package product

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"strings"
	"testing"

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
	if !strings.Contains(csp, "frame-src https://www.youtube-nocookie.com https://player.bilibili.com") || strings.Contains(csp, " https://www.youtube.com") {
		t.Fatalf("controlled embed CSP is not exact: %q", csp)
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
