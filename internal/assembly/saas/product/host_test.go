package product

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"net/url"
	"path/filepath"
	"strings"
	"testing"
	"time"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgeprovider "github.com/domainry/domainry-knowledge-sdk/provider"
)

func TestStandaloneProductComposesIdentityAndKnowledgeModules(t *testing.T) {
	t.Setenv("APP_ENV", "development")
	t.Setenv("AUTH_INITIAL_CREDENTIAL_ROTATION_REQUIRED", "false")
	root := t.TempDir()
	options := Options{
		RuntimeID: "knowledge", WorkspaceID: "knowledge-workspace", ApplicationKey: "knowledge",
		DatabasePath: filepath.Join(root, "knowledge.db"), StoragePath: filepath.Join(root, "storage"), Origin: "http://knowledge.test",
		AdminLogin: "admin@knowledge.test", AdminName: "Knowledge Admin", AdminPassword: "Knowledge@2026",
	}
	open := func() *Host {
		host, err := Open(t.Context(), options)
		if err != nil {
			t.Fatal(err)
		}
		return host
	}
	host := open()
	actions, err := knowledgesdk.AuthorizationActions()
	if err != nil {
		t.Fatal(err)
	}
	expectedPermissionCount := 0
	for _, action := range actions {
		if action.Permission != nil {
			expectedPermissionCount++
		}
	}
	var permissionCount, bundledPermissionCount, directPermissionCount int
	if err := host.database.QueryRowContext(t.Context(), `
		SELECT COUNT(*),
		       SUM(CASE WHEN grant_mode = 'bundled' THEN 1 ELSE 0 END),
		       SUM(CASE WHEN grant_mode = 'direct' THEN 1 ELSE 0 END)
		FROM _identity_permissions
		WHERE source_owner = 'module:knowledge' AND definition_status = 'active'`).Scan(&permissionCount, &bundledPermissionCount, &directPermissionCount); err != nil {
		t.Fatal(err)
	}
	if permissionCount != expectedPermissionCount || bundledPermissionCount != expectedPermissionCount-1 || directPermissionCount != 1 {
		t.Fatalf("Knowledge permissions total=%d bundled=%d direct=%d want=%d/%d/1", permissionCount, bundledPermissionCount, directPermissionCount, expectedPermissionCount, expectedPermissionCount-1)
	}
	expectedRoles, err := knowledgeProjectRoles(actions)
	if err != nil {
		t.Fatal(err)
	}
	roleRows, err := host.database.QueryContext(t.Context(), `
		SELECT role_key, json_array_length(json_extract(definition_json, '$.permissions'))
		FROM _identity_roles
		WHERE source_owner = 'module:knowledge' AND status = 'active'
		ORDER BY role_key`)
	if err != nil {
		t.Fatal(err)
	}
	defer roleRows.Close()
	actualRolePermissionCounts := map[string]int{}
	for roleRows.Next() {
		var key string
		var count int
		if err := roleRows.Scan(&key, &count); err != nil {
			t.Fatal(err)
		}
		actualRolePermissionCounts[key] = count
	}
	if err := roleRows.Err(); err != nil {
		t.Fatal(err)
	}
	if len(actualRolePermissionCounts) != len(expectedRoles) {
		t.Fatalf("published Knowledge roles=%v want=%d roles", actualRolePermissionCounts, len(expectedRoles))
	}
	for _, role := range expectedRoles {
		if actualRolePermissionCounts[role.Key] != len(role.Permissions) {
			t.Fatalf("published role %q permissions=%d want=%d", role.Key, actualRolePermissionCounts[role.Key], len(role.Permissions))
		}
	}
	navigation := httptest.NewRequest(http.MethodGet, "http://knowledge.test/", nil)
	navigation.Host = "knowledge.test"
	navigation.Header.Set("Sec-Fetch-Site", "cross-site")
	navigationResponse := httptest.NewRecorder()
	host.Handler().ServeHTTP(navigationResponse, navigation)
	if navigationResponse.Code == http.StatusForbidden {
		t.Fatalf("safe top-level navigation must not be rejected by CSRF protection: %s", navigationResponse.Body.String())
	}
	unsafeCrossSite := httptest.NewRequest(http.MethodPost, "http://knowledge.test/auth/login", strings.NewReader(`{}`))
	unsafeCrossSite.Host = "knowledge.test"
	unsafeCrossSite.Header.Set("Sec-Fetch-Site", "cross-site")
	unsafeCrossSiteResponse := httptest.NewRecorder()
	host.Handler().ServeHTTP(unsafeCrossSiteResponse, unsafeCrossSite)
	if unsafeCrossSiteResponse.Code != http.StatusForbidden {
		t.Fatalf("unsafe cross-site request without the configured Origin status=%d body=%s", unsafeCrossSiteResponse.Code, unsafeCrossSiteResponse.Body.String())
	}
	login := callProduct(t, host.Handler(), http.MethodPost, "/auth/login", map[string]any{"workspace_id": options.WorkspaceID, "login": options.AdminLogin, "password": options.AdminPassword}, "")
	if login.Code != http.StatusOK {
		t.Fatalf("login status=%d body=%s", login.Code, login.Body.String())
	}
	var loginBody struct {
		AccessToken string `json:"access_token"`
	}
	if err := json.Unmarshal(login.Body.Bytes(), &loginBody); err != nil || loginBody.AccessToken == "" {
		t.Fatalf("login body=%s err=%v", login.Body.String(), err)
	}
	session := callProduct(t, host.Handler(), http.MethodGet, "/app/session", nil, loginBody.AccessToken)
	if session.Code != http.StatusOK {
		t.Fatalf("session status=%d body=%s", session.Code, session.Body.String())
	}
	csp := session.Header().Get("Content-Security-Policy")
	if !strings.Contains(csp, "frame-src https://www.youtube.com https://player.bilibili.com") || strings.Contains(csp, "youtube-nocookie.com") {
		t.Fatalf("controlled embed CSP is not exact: %q", csp)
	}
	if policy := session.Header().Get("Referrer-Policy"); policy != "strict-origin-when-cross-origin" {
		t.Fatalf("external players require an origin referrer policy, got %q", policy)
	}
	if !strings.Contains(csp, "script-src 'self' 'wasm-unsafe-eval'") || strings.Contains(csp, "script-src 'self' 'unsafe-eval'") {
		t.Fatalf("CSP must allow WebAssembly hashing without enabling general unsafe evaluation: %q", csp)
	}
	created := callProduct(t, host.Handler(), http.MethodPost, "/knowledge/libraries", map[string]any{"kind": "shared", "name": "产品知识库", "client_id": "acceptance-library"}, loginBody.AccessToken)
	if created.Code != http.StatusCreated {
		t.Fatalf("create library status=%d body=%s", created.Code, created.Body.String())
	}
	var library knowledgesdk.KnowledgeLibrary
	if err := json.Unmarshal(created.Body.Bytes(), &library); err != nil || library.ID == "" {
		t.Fatalf("create library body=%s err=%v", created.Body.String(), err)
	}
	createdPage := callProduct(t, host.Handler(), http.MethodPost, "/knowledge/libraries/"+library.ID+"/pages", map[string]any{
		"client_id": "acceptance-page", "title": "治理验收", "content_type": knowledgesdk.KnowledgePageTypeDocument,
	}, loginBody.AccessToken)
	var page knowledgesdk.KnowledgePageView
	if createdPage.Code != http.StatusCreated || json.Unmarshal(createdPage.Body.Bytes(), &page) != nil || page.Page.ID == "" {
		t.Fatalf("create page status=%d body=%s", createdPage.Code, createdPage.Body.String())
	}
	metadataResponse := callProduct(t, host.Handler(), http.MethodGet, "/knowledge/libraries/"+library.ID+"/pages/"+page.Page.ID+"/metadata", nil, loginBody.AccessToken)
	var metadata knowledgesdk.KnowledgePageMetadata
	if metadataResponse.Code != http.StatusOK || json.Unmarshal(metadataResponse.Body.Bytes(), &metadata) != nil || metadata.OwnerUserID == "" {
		t.Fatalf("metadata status=%d body=%s", metadataResponse.Code, metadataResponse.Body.String())
	}
	governance := callProduct(t, host.Handler(), http.MethodPut, "/knowledge/libraries/"+library.ID+"/pages/"+page.Page.ID+"/governance", map[string]any{
		"client_id": "acceptance-governance", "expected_revision": metadata.Revision, "owner_user_id": metadata.OwnerUserID,
		"content_admin_user_ids": []string{}, "archive_retention_days": 730, "review_interval_days": 90,
	}, loginBody.AccessToken)
	if governance.Code != http.StatusOK {
		t.Fatalf("set governance status=%d body=%s", governance.Code, governance.Body.String())
	}
	applicationCard := callProduct(t, host.Handler(), http.MethodPost, "/knowledge/libraries/"+library.ID+"/pages/"+page.Page.ID+"/application-cards/resolve", map[string]any{
		"provider": "web", "kind": knowledgesdk.KnowledgeApplicationCardWeb, "resource_id": "https://example.com/acceptance",
	}, loginBody.AccessToken)
	var card knowledgesdk.KnowledgeApplicationCard
	if applicationCard.Code != http.StatusOK || json.Unmarshal(applicationCard.Body.Bytes(), &card) != nil || card.Provider != "web" || card.Kind != knowledgesdk.KnowledgeApplicationCardWeb || card.Title != "example.com" || card.URL != "https://example.com/acceptance" {
		t.Fatalf("resolve default web application card status=%d body=%s", applicationCard.Code, applicationCard.Body.String())
	}
	if err := host.Close(context.Background()); err != nil {
		t.Fatal(err)
	}
	reopened := open()
	defer reopened.Close(context.Background())
	login = callProduct(t, reopened.Handler(), http.MethodPost, "/auth/login", map[string]any{"workspace_id": options.WorkspaceID, "login": options.AdminLogin, "password": options.AdminPassword}, "")
	if login.Code != http.StatusOK {
		t.Fatalf("reopened login status=%d body=%s", login.Code, login.Body.String())
	}
	if err := json.Unmarshal(login.Body.Bytes(), &loginBody); err != nil || loginBody.AccessToken == "" {
		t.Fatalf("reopened login body=%s err=%v", login.Body.String(), err)
	}
	auditResponse := callProduct(t, reopened.Handler(), http.MethodGet, "/knowledge/libraries/"+library.ID+"/pages/"+page.Page.ID+"/governance/audit?event=knowledge.page.governance_set&limit=20", nil, loginBody.AccessToken)
	var auditPage knowledgesdk.KnowledgeGovernanceAuditPage
	if auditResponse.Code != http.StatusOK || json.Unmarshal(auditResponse.Body.Bytes(), &auditPage) != nil || len(auditPage.Items) != 1 || auditPage.Items[0].ClientID != "acceptance-governance" || auditPage.Items[0].PageID != page.Page.ID {
		t.Fatalf("governance audit status=%d body=%s", auditResponse.Code, auditResponse.Body.String())
	}
	allGovernanceResponse := callProduct(t, reopened.Handler(), http.MethodGet, "/knowledge/libraries/"+library.ID+"/pages/"+page.Page.ID+"/governance/audit?limit=20", nil, loginBody.AccessToken)
	var allGovernance knowledgesdk.KnowledgeGovernanceAuditPage
	if allGovernanceResponse.Code != http.StatusOK || json.Unmarshal(allGovernanceResponse.Body.Bytes(), &allGovernance) != nil || len(allGovernance.Items) != 1 || allGovernance.Items[0].Type != "knowledge.page.governance_set" {
		t.Fatalf("unfiltered governance audit leaked unrelated page events status=%d body=%s", allGovernanceResponse.Code, allGovernanceResponse.Body.String())
	}
}

func TestStandaloneProductUsesAuthenticatedKnowledgeUploadHTTPBoundary(t *testing.T) {
	t.Setenv("APP_ENV", "development")
	t.Setenv("AUTH_INITIAL_CREDENTIAL_ROTATION_REQUIRED", "false")
	root := t.TempDir()
	source := &acceptanceSource{}
	options := Options{
		RuntimeID: "knowledge", WorkspaceID: "knowledge-workspace", ApplicationKey: "knowledge",
		DatabasePath: filepath.Join(root, "knowledge.db"), StoragePath: filepath.Join(root, "storage"), Origin: "http://knowledge.test",
		ProviderConfig: knowledgeprovider.Config{RuntimeID: "knowledge", WorkspaceID: "knowledge-workspace"}, ProviderFactory: acceptanceProviderFactory{source: source},
		AdminLogin: "admin@knowledge.test", AdminName: "Knowledge Admin", AdminPassword: "Knowledge@2026",
	}
	host, err := Open(t.Context(), options)
	if err != nil {
		t.Fatal(err)
	}
	defer host.Close(context.Background())
	login := callProduct(t, host.Handler(), http.MethodPost, "/auth/login", map[string]any{"workspace_id": options.WorkspaceID, "login": options.AdminLogin, "password": options.AdminPassword}, "")
	var authenticated struct {
		AccessToken string `json:"access_token"`
	}
	if login.Code != http.StatusOK || json.Unmarshal(login.Body.Bytes(), &authenticated) != nil || authenticated.AccessToken == "" {
		t.Fatalf("login status=%d body=%s", login.Code, login.Body.String())
	}
	created := callProduct(t, host.Handler(), http.MethodPost, "/knowledge/libraries", map[string]any{"kind": "shared", "name": "Upload acceptance", "client_id": "upload-library"}, authenticated.AccessToken)
	var library knowledgesdk.KnowledgeLibrary
	if created.Code != http.StatusCreated || json.Unmarshal(created.Body.Bytes(), &library) != nil {
		t.Fatalf("create status=%d body=%s", created.Code, created.Body.String())
	}
	bound := callProduct(t, host.Handler(), http.MethodPut, "/knowledge/libraries/"+library.ID+"/source", map[string]any{"datasource_key": "primary", "expected_revision": library.Revision}, authenticated.AccessToken)
	if bound.Code != http.StatusOK {
		t.Fatalf("bind status=%d body=%s", bound.Code, bound.Body.String())
	}
	content := []byte("real Knowledge HTTP upload")
	digest := sha256.Sum256(content)
	hash := hex.EncodeToString(digest[:])
	upload := callProductRaw(t, host.Handler(), http.MethodPost, "/knowledge/libraries/"+library.ID+"/documents?client_id=upload-document&filename=acceptance.txt", content, map[string]string{
		"Content-Type": "application/octet-stream", "Content-Range": "bytes 0-25/26", "X-Knowledge-File-SHA256": hash, "X-Knowledge-Chunk-SHA256": hash,
	}, authenticated.AccessToken)
	if upload.Code != http.StatusOK {
		t.Fatalf("upload status=%d body=%s", upload.Code, upload.Body.String())
	}
	var progress struct {
		NextOffset int64                          `json:"next_offset"`
		Complete   bool                           `json:"complete"`
		Document   knowledgesdk.KnowledgeDocument `json:"document"`
	}
	if json.Unmarshal(upload.Body.Bytes(), &progress) != nil || !progress.Complete || progress.NextOffset != int64(len(content)) || progress.Document.LibraryID != library.ID || progress.Document.SHA256 != hash {
		t.Fatalf("invalid upload response: %s", upload.Body.String())
	}
}

func TestStandaloneProductStoresAndServesFilesWithoutIndexProvider(t *testing.T) {
	t.Setenv("APP_ENV", "development")
	t.Setenv("AUTH_INITIAL_CREDENTIAL_ROTATION_REQUIRED", "false")
	root := t.TempDir()
	options := Options{
		RuntimeID: "knowledge", WorkspaceID: "knowledge-workspace", ApplicationKey: "knowledge",
		DatabasePath: filepath.Join(root, "knowledge.db"), StoragePath: filepath.Join(root, "storage"), Origin: "http://knowledge.test",
		AdminLogin: "admin@knowledge.test", AdminName: "Knowledge Admin", AdminPassword: "Knowledge@2026",
	}
	host, err := Open(t.Context(), options)
	if err != nil {
		t.Fatal(err)
	}
	defer host.Close(context.Background())
	login := callProduct(t, host.Handler(), http.MethodPost, "/auth/login", map[string]any{"workspace_id": options.WorkspaceID, "login": options.AdminLogin, "password": options.AdminPassword}, "")
	var authenticated struct {
		AccessToken string `json:"access_token"`
	}
	if login.Code != http.StatusOK || json.Unmarshal(login.Body.Bytes(), &authenticated) != nil || authenticated.AccessToken == "" {
		t.Fatalf("login status=%d body=%s", login.Code, login.Body.String())
	}
	created := callProduct(t, host.Handler(), http.MethodPost, "/knowledge/libraries", map[string]any{"kind": "personal", "name": "Local files", "client_id": "local-files-library"}, authenticated.AccessToken)
	var library knowledgesdk.KnowledgeLibrary
	if created.Code != http.StatusCreated || json.Unmarshal(created.Body.Bytes(), &library) != nil {
		t.Fatalf("create status=%d body=%s", created.Code, created.Body.String())
	}
	if !library.DocumentsConfigured || library.DocumentMaxBytes != knowledgesdk.KnowledgeDocumentMaximumBytes {
		t.Fatalf("local document storage was not projected: %+v", library)
	}
	formats := map[string]bool{}
	for _, format := range library.DocumentFormats {
		formats[format.Extension] = true
	}
	for _, extension := range []string{".png", ".mp3", ".mp4", ".txt"} {
		if !formats[extension] {
			t.Fatalf("local format %s missing from %+v", extension, library.DocumentFormats)
		}
	}
	createdPage := callProduct(t, host.Handler(), http.MethodPost, "/knowledge/libraries/"+library.ID+"/pages", map[string]any{
		"client_id": "local-files-page", "title": "附件验收", "content_type": knowledgesdk.KnowledgePageTypeDocument,
	}, authenticated.AccessToken)
	var page knowledgesdk.KnowledgePageView
	if createdPage.Code != http.StatusCreated || json.Unmarshal(createdPage.Body.Bytes(), &page) != nil || page.Page.ID == "" {
		t.Fatalf("create attachment page status=%d body=%s", createdPage.Code, createdPage.Body.String())
	}

	files := []struct {
		name string
		body []byte
	}{
		{name: "pixel.png", body: append([]byte{0x89, 'P', 'N', 'G', '\r', '\n', 0x1a, '\n'}, []byte("safe-image")...)},
		{name: "voice.mp3", body: []byte("ID3safe-audio")},
		{name: "clip.mp4", body: []byte{0, 0, 0, 12, 'f', 't', 'y', 'p', 'i', 's', 'o', 'm'}},
		{name: "notes.txt", body: []byte("safe local text")},
	}
	for index, file := range files {
		digest := sha256.Sum256(file.body)
		hash := hex.EncodeToString(digest[:])
		path := "/knowledge/libraries/" + library.ID + "/documents?client_id=local-file-" + fmt.Sprint(index) + "&filename=" + url.QueryEscape(file.name)
		upload := callProductRaw(t, host.Handler(), http.MethodPost, path, file.body, map[string]string{
			"Content-Type": "application/octet-stream", "Content-Range": fmt.Sprintf("bytes 0-%d/%d", len(file.body)-1, len(file.body)), "X-Knowledge-File-SHA256": hash, "X-Knowledge-Chunk-SHA256": hash,
		}, authenticated.AccessToken)
		var progress struct {
			NextOffset int64                           `json:"next_offset"`
			Complete   bool                            `json:"complete"`
			Document   *knowledgesdk.KnowledgeDocument `json:"document"`
		}
		if upload.Code != http.StatusOK || json.Unmarshal(upload.Body.Bytes(), &progress) != nil || !progress.Complete || progress.Document == nil {
			t.Fatalf("upload %s status=%d body=%s", file.name, upload.Code, upload.Body.String())
		}
		if index == 0 {
			attachmentPath := "/knowledge/libraries/" + library.ID + "/pages/" + page.Page.ID + "/attachments/" + progress.Document.ID
			attached := callProduct(t, host.Handler(), http.MethodPut, attachmentPath, map[string]any{"client_id": "attach-local-image", "title": "原图片", "rank": "a"}, authenticated.AccessToken)
			if attached.Code != http.StatusOK {
				t.Fatalf("attach local image status=%d body=%s", attached.Code, attached.Body.String())
			}
			replaced := callProduct(t, host.Handler(), http.MethodPut, attachmentPath, map[string]any{"client_id": "replace-local-image", "title": "替换后的图片", "rank": "b"}, authenticated.AccessToken)
			if replaced.Code != http.StatusOK {
				t.Fatalf("replace local image status=%d body=%s", replaced.Code, replaced.Body.String())
			}
			listed := callProduct(t, host.Handler(), http.MethodGet, "/knowledge/libraries/"+library.ID+"/pages/"+page.Page.ID+"/attachments", nil, authenticated.AccessToken)
			var attachments knowledgesdk.KnowledgePageAttachmentPage
			if listed.Code != http.StatusOK || json.Unmarshal(listed.Body.Bytes(), &attachments) != nil || len(attachments.Items) != 1 || attachments.Items[0].Title != "替换后的图片" || attachments.Items[0].Rank != "b" {
				t.Fatalf("replace must update one attachment status=%d body=%s", listed.Code, listed.Body.String())
			}
		}
		var stored knowledgesdk.KnowledgeDocument
		deadline := time.Now().Add(3 * time.Second)
		for time.Now().Before(deadline) {
			response := callProduct(t, host.Handler(), http.MethodGet, "/knowledge/libraries/"+library.ID+"/documents/"+progress.Document.ID, nil, authenticated.AccessToken)
			if response.Code != http.StatusOK || json.Unmarshal(response.Body.Bytes(), &stored) != nil {
				t.Fatalf("read %s status=%d body=%s", file.name, response.Code, response.Body.String())
			}
			if stored.State == "ready" {
				break
			}
			time.Sleep(10 * time.Millisecond)
		}
		if stored.State != "ready" || stored.IndexStatus != "STORED" || stored.SecurityStatus != "clean" {
			t.Fatalf("stored %s did not complete locally: %+v", file.name, stored)
		}
		download := callProduct(t, host.Handler(), http.MethodGet, "/knowledge/libraries/"+library.ID+"/documents/"+stored.ID+"/content", nil, authenticated.AccessToken)
		if download.Code != http.StatusOK || !bytes.Equal(download.Body.Bytes(), file.body) || download.Header().Get("X-Knowledge-File-SHA256") != hash {
			t.Fatalf("download %s status=%d body=%x headers=%v", file.name, download.Code, download.Body.Bytes(), download.Header())
		}
	}

	unsupported := []byte("MZ executable")
	digest := sha256.Sum256(unsupported)
	hash := hex.EncodeToString(digest[:])
	rejected := callProductRaw(t, host.Handler(), http.MethodPost, "/knowledge/libraries/"+library.ID+"/documents?client_id=local-file-rejected&filename=malware.exe", unsupported, map[string]string{
		"Content-Type": "application/octet-stream", "Content-Range": fmt.Sprintf("bytes 0-%d/%d", len(unsupported)-1, len(unsupported)), "X-Knowledge-File-SHA256": hash, "X-Knowledge-Chunk-SHA256": hash,
	}, authenticated.AccessToken)
	if rejected.Code != http.StatusBadRequest || !strings.Contains(rejected.Body.String(), "document_type_unsupported") {
		t.Fatalf("unsupported upload status=%d body=%s", rejected.Code, rejected.Body.String())
	}
}

func callProduct(t *testing.T, handler http.Handler, method, path string, body any, token string) *httptest.ResponseRecorder {
	t.Helper()
	var payload bytes.Buffer
	if body != nil {
		if err := json.NewEncoder(&payload).Encode(body); err != nil {
			t.Fatal(err)
		}
	}
	request := httptest.NewRequest(method, "http://knowledge.test"+path, &payload)
	request.Host = "knowledge.test"
	if body != nil {
		request.Header.Set("Content-Type", "application/json")
	}
	if method != http.MethodGet && method != http.MethodHead {
		request.Header.Set("Origin", "http://knowledge.test")
	}
	if token != "" {
		request.Header.Set("Authorization", "Bearer "+token)
	}
	response := httptest.NewRecorder()
	handler.ServeHTTP(response, request)
	return response
}

func callProductRaw(t *testing.T, handler http.Handler, method, path string, body []byte, headers map[string]string, token string) *httptest.ResponseRecorder {
	t.Helper()
	request := httptest.NewRequest(method, "http://knowledge.test"+path, bytes.NewReader(body))
	request.Host = "knowledge.test"
	request.Header.Set("Origin", "http://knowledge.test")
	request.Header.Set("Authorization", "Bearer "+token)
	for key, value := range headers {
		request.Header.Set(key, value)
	}
	response := httptest.NewRecorder()
	handler.ServeHTTP(response, request)
	return response
}

type acceptanceProviderFactory struct{ source knowledgeprovider.Source }

func (factory acceptanceProviderFactory) NewSource(knowledgeprovider.Config) (knowledgeprovider.Source, error) {
	return factory.source, nil
}

type acceptanceSource struct{}

func (*acceptanceSource) SearchKnowledge(context.Context, string, knowledgesdk.Authority) (knowledgesdk.Result, error) {
	return knowledgesdk.Result{Provider: "acceptance", KBID: "acceptance", Operation: "search", ScopeSHA256: strings.Repeat("a", 64), Data: json.RawMessage(`{}`)}, nil
}
func (*acceptanceSource) ReadKnowledge(context.Context, string, knowledgesdk.Authority) (knowledgesdk.Result, error) {
	return knowledgesdk.Result{Provider: "acceptance", KBID: "acceptance", Operation: "fetch", ScopeSHA256: strings.Repeat("a", 64), Data: json.RawMessage(`{}`)}, nil
}
func (*acceptanceSource) RevalidateKnowledge(context.Context, knowledgesdk.Result, knowledgesdk.Authority) error {
	return nil
}
func (*acceptanceSource) PutKnowledgeDocument(_ context.Context, input knowledgesdk.KnowledgeDocumentIndexContent, _ knowledgesdk.Authority) error {
	_, err := io.Copy(io.Discard, input.Content)
	return err
}
func (*acceptanceSource) InspectKnowledgeDocument(_ context.Context, id string, _ knowledgesdk.Authority) (knowledgesdk.KnowledgeDocumentState, error) {
	return knowledgesdk.KnowledgeDocumentState{DocumentID: id, Exists: true, IndexStatus: "INDEXED"}, nil
}
func (*acceptanceSource) DeleteKnowledgeDocument(context.Context, string, knowledgesdk.Authority) error {
	return nil
}
func (*acceptanceSource) KnowledgeDocumentSourceIdentity() string     { return strings.Repeat("b", 64) }
func (*acceptanceSource) KnowledgeDocumentManagementReady() error     { return nil }
func (*acceptanceSource) KnowledgeDocumentAccessPolicySHA256() string { return strings.Repeat("c", 64) }
func (*acceptanceSource) KnowledgeDocumentIndexMaximumBytes() int64   { return 64 << 20 }
func (*acceptanceSource) KnowledgeDocumentFormats() []knowledgesdk.KnowledgeDocumentFormat {
	return []knowledgesdk.KnowledgeDocumentFormat{{Extension: ".txt", ContentType: "text/plain", ParserRoute: "text"}}
}
func (*acceptanceSource) SearchKnowledgeDocumentPassages(context.Context, string, knowledgesdk.Authority) ([]knowledgesdk.KnowledgeDocumentPassage, error) {
	return nil, nil
}
func (*acceptanceSource) ReadKnowledgeDocumentPassages(context.Context, string, knowledgesdk.Authority) ([]knowledgesdk.KnowledgeDocumentPassage, error) {
	return nil, nil
}
