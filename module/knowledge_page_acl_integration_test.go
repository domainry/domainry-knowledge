//go:build integration

package module

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"slices"
	"strings"
	"sync"
	"testing"
	"time"

	httpapi "github.com/domainry/domainry-connectors/providers/knowledge_base/http_api"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	application "github.com/domainry/domainry-knowledge/internal/application/knowledge"
	ormsqlite "github.com/domainry/domainry-orm/sqlite"
)

type integrationLibraryAuthorizer struct{}

func (integrationLibraryAuthorizer) AuthorizeKnowledgeLibrary(context.Context, string, knowledgesdk.KnowledgeLibrary, knowledgesdk.Authority) error {
	return nil
}
func (integrationLibraryAuthorizer) ValidateKnowledgeLibraryMember(context.Context, string, knowledgesdk.Authority) error {
	return nil
}
func (integrationLibraryAuthorizer) ValidateKnowledgeLibraryOrganizationMember(context.Context, string, knowledgesdk.Authority) error {
	return nil
}

type aclRemoteDocument struct {
	permissions []string
	deleted     bool
}

type aclRemoteFixture struct {
	mu          sync.Mutex
	documents   map[string]aclRemoteDocument
	uploadOrder []string
	inspections [][]string
	requests    []string
}

func (fixture *aclRemoteFixture) handler(writer http.ResponseWriter, request *http.Request) {
	fixture.mu.Lock()
	fixture.requests = append(fixture.requests, request.Method+" "+request.URL.RequestURI())
	fixture.mu.Unlock()
	writer.Header().Set("Content-Type", "application/json")
	if request.URL.Path == "/v1/kb/kbs/kb-integration/documents" {
		docID := request.URL.Query().Get("doc_id")
		switch request.Method {
		case http.MethodPost:
			_, _ = io.Copy(io.Discard, request.Body)
			var permissions []string
			if json.Unmarshal([]byte(request.Header.Get("X-KB-Permission-Ids")), &permissions) != nil || len(permissions) != 1 {
				writer.WriteHeader(http.StatusBadRequest)
				return
			}
			fixture.mu.Lock()
			fixture.documents[docID] = aclRemoteDocument{permissions: slices.Clone(permissions)}
			fixture.uploadOrder = append(fixture.uploadOrder, docID)
			fixture.mu.Unlock()
			_, _ = io.WriteString(writer, `{"err_code":0,"data":{"status":"INDEXED"}}`)
			return
		case http.MethodDelete:
			fixture.mu.Lock()
			document := fixture.documents[docID]
			document.deleted = true
			fixture.documents[docID] = document
			fixture.mu.Unlock()
			_, _ = io.WriteString(writer, `{"err_code":0}`)
			return
		}
	}
	if request.URL.Path == "/v1/kb/fetch" {
		var input struct {
			DocID         string   `json:"doc_id"`
			PermissionIDs []string `json:"permission_ids"`
		}
		if json.NewDecoder(request.Body).Decode(&input) != nil {
			writer.WriteHeader(http.StatusBadRequest)
			return
		}
		fixture.mu.Lock()
		document, exists := fixture.documents[input.DocID]
		fixture.inspections = append(fixture.inspections, slices.Clone(input.PermissionIDs))
		fixture.mu.Unlock()
		visible := exists && !document.deleted && slices.ContainsFunc(document.permissions, func(value string) bool {
			return slices.Contains(input.PermissionIDs, value)
		})
		if !visible {
			_, _ = io.WriteString(writer, `{"err_code":1004,"err_msg":"document not found"}`)
			return
		}
		_, _ = fmt.Fprintf(writer, `{"err_code":0,"data":{"doc_id":%q,"kb_id":"kb-integration","status":"INDEXED","chunks":[]}}`, input.DocID)
		return
	}
	writer.WriteHeader(http.StatusNotFound)
}

func integrationPageContent(text string) string {
	value, _ := json.Marshal(map[string]any{"blocks": []any{map[string]any{
		"id": "block-1", "type": "paragraph", "props": map[string]any{},
		"content": []any{map[string]any{"type": "text", "text": text, "styles": map[string]any{}}}, "children": []any{},
	}}})
	return string(value)
}

func waitForKnowledgeACL(t *testing.T, timeout time.Duration, check func() (bool, string)) {
	t.Helper()
	deadline := time.Now().Add(timeout)
	for time.Now().Before(deadline) {
		if ok, _ := check(); ok {
			return
		}
		time.Sleep(10 * time.Millisecond)
	}
	_, detail := check()
	t.Fatalf("Knowledge ACL integration did not converge: %s", detail)
}

func TestKnowledgePageProjectionAppliesUserAndOrganizationACLThroughManagedProvider(t *testing.T) {
	database, dialect := openDatabase(t, "knowledge-page-acl-integration")
	database.SetMaxOpenConns(4)
	backend := SQLBackend{DB: database, Dialect: dialect, Engine: ormsqlite.NewProfile()}
	if err := EnsureSchema(t.Context(), backend, &registrar{database: database}); err != nil {
		t.Fatal(err)
	}
	repository := NewStore(backend)
	manager := knowledgesdk.Authority{Known: true, RuntimeID: "runtime-integration", WorkspaceID: "workspace-integration", UserID: "alice", RoleKey: "manager"}
	library, err := repository.CreateKnowledgeLibrary(t.Context(), knowledgesdk.KnowledgeLibraryCreate{ClientID: "library-integration", Kind: "shared", Name: "权限集成库"}, manager)
	if err != nil {
		t.Fatal(err)
	}
	library, err = repository.SetKnowledgeLibraryMember(t.Context(), library.ID, "bob", knowledgesdk.KnowledgeLibraryMemberWrite{Role: "reader", ExpectedRevision: library.Revision}, manager)
	if err != nil {
		t.Fatal(err)
	}
	library, err = repository.SetKnowledgeLibraryOrganizationMember(t.Context(), library.ID, "org-engineering", knowledgesdk.KnowledgeLibraryMemberWrite{Role: "reader", ExpectedRevision: library.Revision}, manager)
	if err != nil {
		t.Fatal(err)
	}

	remote := &aclRemoteFixture{documents: map[string]aclRemoteDocument{}}
	server := httptest.NewServer(http.HandlerFunc(remote.handler))
	defer server.Close()
	source, err := NewKnowledge(KnowledgeConfig{
		BaseURL: server.URL, APIKey: "scoped-index-key", TeamID: manager.WorkspaceID, KBID: "kb-integration", WorkspaceID: manager.WorkspaceID,
		DocumentManagement: true, DocumentPermissionIDs: []string{"space:" + library.ID}, ReadPermissionIDs: []string{"space:" + library.ID}, TopK: 10,
	}, httpapi.New)
	if err != nil {
		t.Fatal(err)
	}
	catalog, err := NewSingleDatasourceCatalog(manager.RuntimeID, manager.WorkspaceID, "enterprise-vector-index", "Enterprise Vector Index", "integration", source)
	if err != nil {
		t.Fatal(err)
	}
	storage, err := NewDocumentFiles(filepath.Join(t.TempDir(), "documents"))
	if err != nil {
		t.Fatal(err)
	}
	options := Options{DocumentStorage: storage, DocumentSecurity: BuiltinDocumentSecurityScanner(), DocumentPoll: 10 * time.Millisecond,
		DocumentWorkTimeout: time.Minute, KnowledgeDatasources: catalog, LibraryAuthorizer: integrationLibraryAuthorizer{}}
	runtime := NewServiceRuntime(repository)
	if err = runtime.Validate(&options); err != nil {
		t.Fatal(err)
	}
	options.Knowledge, err = runtime.Prepare(manager.RuntimeID, options)
	if err != nil {
		t.Fatal(err)
	}
	if err = runtime.Activate(manager.RuntimeID, options); err != nil {
		t.Fatal(err)
	}
	service := application.NewService(repository, manager.RuntimeID, options, nil)
	defer service.Close()

	sources, err := service.KnowledgeLibrarySources(t.Context(), library.ID, "", 10, manager)
	if err != nil || len(sources.Items) != 1 || !sources.Items[0].Available {
		t.Fatalf("managed datasource unavailable: sources=%+v err=%v", sources, err)
	}
	library, err = service.BindKnowledgeLibrarySource(t.Context(), library.ID, knowledgesdk.KnowledgeLibrarySourceWrite{DatasourceKey: "enterprise-vector-index", ExpectedRevision: sources.Revision}, manager)
	if err != nil {
		t.Fatal(err)
	}
	page, err := service.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "page-integration", Title: "权限页面", ContentType: knowledgesdk.KnowledgePageTypeDocument}, manager)
	if err != nil {
		t.Fatal(err)
	}
	page, err = service.SaveKnowledgePageDraft(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageDraftWrite{
		ClientID: "page-save", ExpectedDraftRevision: page.Draft.DraftRevision, ExpectedPageRevision: page.Page.Revision,
		Title: page.Page.Title, Rank: page.Page.Rank, ContentSchemaVersion: knowledgesdk.PageContentSchemaVersion, Content: integrationPageContent("权限正文"),
	}, manager)
	if err != nil {
		t.Fatal(err)
	}
	page, err = service.PublishKnowledgePage(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePagePublish{
		ClientID: "page-publish", ExpectedPageRevision: page.Page.Revision, ExpectedDraftRevision: page.Draft.DraftRevision,
	}, manager)
	if err != nil {
		t.Fatal(err)
	}
	bob := manager
	bob.UserID, bob.RoleKey = "bob", "reader"
	organizationUser := manager
	organizationUser.UserID, organizationUser.RoleKey, organizationUser.OrgScopeIDs = "carol", "reader", []string{"org-engineering"}
	waitForKnowledgeACL(t, 5*time.Second, func() (bool, string) {
		_, tickErr := service.KnowledgeDocumentWorkerTick(t.Context())
		ids, tokenErr := repository.KnowledgePagePermissionTokens(t.Context(), library.ID, bob)
		access, accessErr := service.KnowledgePageAccess(t.Context(), library.ID, page.Page.ID, manager)
		remote.mu.Lock()
		requests, uploads, inspections := slices.Clone(remote.requests), slices.Clone(remote.uploadOrder), slices.Clone(remote.inspections)
		remote.mu.Unlock()
		return tickErr == nil && tokenErr == nil && len(ids) == 1, fmt.Sprintf("tick_err=%v initial ids=%v err=%v access=%+v access_err=%v requests=%v uploads=%v inspections=%v", tickErr, ids, tokenErr, access, accessErr, requests, uploads, inspections)
	})

	policy, err := service.SetKnowledgePageAccess(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageAccessWrite{
		ClientID: "grant-user", ExpectedRevision: 1, Mode: knowledgesdk.KnowledgePageAccessRestricted,
		Grants: []knowledgesdk.KnowledgePageAccessGrant{{Subject: knowledgesdk.KnowledgeAccessSubject{Type: knowledgesdk.KnowledgeSubjectUser, ID: "bob"}, Role: "reader", Scope: knowledgesdk.KnowledgePageGrantPage}},
	}, manager)
	if err != nil {
		t.Fatal(err)
	}
	if ids, _ := repository.KnowledgePagePermissionTokens(t.Context(), library.ID, bob); len(ids) != 0 {
		t.Fatalf("queued user ACL leaked before remote reprojection: %v", ids)
	}
	waitForKnowledgeACL(t, 5*time.Second, func() (bool, string) {
		_, tickErr := service.KnowledgeDocumentWorkerTick(t.Context())
		bobIDs, bobErr := repository.KnowledgePagePermissionTokens(t.Context(), library.ID, bob)
		orgIDs, orgErr := repository.KnowledgePagePermissionTokens(t.Context(), library.ID, organizationUser)
		return tickErr == nil && bobErr == nil && orgErr == nil && len(bobIDs) == 1 && len(orgIDs) == 0,
			fmt.Sprintf("tick_err=%v user ids=%v err=%v organization ids=%v err=%v", tickErr, bobIDs, bobErr, orgIDs, orgErr)
	})

	policy, err = service.SetKnowledgePageAccess(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageAccessWrite{
		ClientID: "grant-organization", ExpectedRevision: policy.Revision, Mode: knowledgesdk.KnowledgePageAccessRestricted,
		Grants: []knowledgesdk.KnowledgePageAccessGrant{{Subject: knowledgesdk.KnowledgeAccessSubject{Type: knowledgesdk.KnowledgeSubjectOrganization, ID: "org-engineering"}, Role: "reader", Scope: knowledgesdk.KnowledgePageGrantPage}},
	}, manager)
	if err != nil {
		t.Fatal(err)
	}
	if ids, _ := repository.KnowledgePagePermissionTokens(t.Context(), library.ID, bob); len(ids) != 0 {
		t.Fatalf("revoked user retained a query token: %v", ids)
	}
	waitForKnowledgeACL(t, 5*time.Second, func() (bool, string) {
		_, tickErr := service.KnowledgeDocumentWorkerTick(t.Context())
		bobIDs, bobErr := repository.KnowledgePagePermissionTokens(t.Context(), library.ID, bob)
		orgIDs, orgErr := repository.KnowledgePagePermissionTokens(t.Context(), library.ID, organizationUser)
		return tickErr == nil && bobErr == nil && orgErr == nil && len(bobIDs) == 0 && len(orgIDs) == 1,
			fmt.Sprintf("tick_err=%v user ids=%v err=%v organization ids=%v err=%v", tickErr, bobIDs, bobErr, orgIDs, orgErr)
	})

	policy, err = service.SetKnowledgePageAccess(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageAccessWrite{
		ClientID: "revoke-all", ExpectedRevision: policy.Revision, Mode: knowledgesdk.KnowledgePageAccessRestricted,
	}, manager)
	if err != nil {
		t.Fatal(err)
	}
	if bobIDs, _ := repository.KnowledgePagePermissionTokens(t.Context(), library.ID, bob); len(bobIDs) != 0 {
		t.Fatalf("user token survived revoke: %v", bobIDs)
	}
	if orgIDs, _ := repository.KnowledgePagePermissionTokens(t.Context(), library.ID, organizationUser); len(orgIDs) != 0 {
		t.Fatalf("organization token survived revoke: %v", orgIDs)
	}
	waitForKnowledgeACL(t, 5*time.Second, func() (bool, string) {
		_, tickErr := service.KnowledgeDocumentWorkerTick(t.Context())
		current, accessErr := service.KnowledgePageAccess(t.Context(), library.ID, page.Page.ID, manager)
		return tickErr == nil && accessErr == nil && current.Revision == policy.Revision && current.ProjectionStatus == "ready",
			fmt.Sprintf("tick_err=%v policy=%+v err=%v", tickErr, current, accessErr)
	})

	remote.mu.Lock()
	defer remote.mu.Unlock()
	if len(remote.uploadOrder) != 4 {
		t.Fatalf("ACL revisions did not create four indexed generations: uploads=%v", remote.uploadOrder)
	}
	unique := map[string]bool{}
	for _, id := range remote.uploadOrder {
		unique[id] = true
	}
	if len(unique) != len(remote.uploadOrder) {
		t.Fatalf("ACL-only reprojection reused a conflicting remote ID: %v", remote.uploadOrder)
	}
	for _, permissions := range remote.inspections {
		if len(permissions) != 1 || !strings.HasPrefix(permissions[0], "scope:knowledge:page:") {
			t.Fatalf("projection inspection used a space-wide or untrusted ACL: %v", permissions)
		}
	}
}
