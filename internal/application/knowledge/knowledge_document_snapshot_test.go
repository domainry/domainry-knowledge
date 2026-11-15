package application

import (
	"context"
	"strings"
	"testing"

	sdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
)

type snapshotLibraryPolicy struct {
	sdk.KnowledgeLibraryAuthorizer
	calls  int
	denyAt int
}

func (p *snapshotLibraryPolicy) AuthorizeKnowledgeLibrary(_ context.Context, op string, library sdk.KnowledgeLibrary, a sdk.Authority) error {
	p.calls++
	if op != sdk.ActionDocumentsDownload || library.ID != "library-a" || a.RuntimeID != "runtime" || a.WorkspaceID != "workspace" || a.UserID != "current-reader" || p.calls == p.denyAt {
		return conversationFailure("forbidden", "test.snapshot_download_denied")
	}
	return nil
}

type snapshotRepo struct {
	sourceUploadRepo
	pageChecks int
	denyPage   bool
	afterRead  func()
}

func (r *snapshotRepo) KnowledgeDocumentRecord(ctx context.Context, id string, a sdk.Authority) (persistence.KnowledgeDocumentRecord, error) {
	v, err := r.sourceUploadRepo.KnowledgeDocumentRecord(ctx, id, a)
	if r.afterRead != nil {
		r.afterRead()
	}
	return v, err
}
func (r *snapshotRepo) ValidateKnowledgePageProjection(_ context.Context, p persistence.KnowledgePageProjectionOrigin, library string, a sdk.Authority) error {
	r.pageChecks++
	if r.denyPage || p.PageID != "page-a" || p.Version != 4 || library != "library-a" || a.UserID != "current-reader" {
		return conversationFailure("forbidden", "test.page_access_denied")
	}
	return nil
}
func snapshotServiceFixture() (*Service, *snapshotRepo, *snapshotLibraryPolicy, *sourceUploadAuthorizer, sdk.Authority, sdk.KnowledgeDocumentSnapshot) {
	a := sdk.Authority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "current-reader", RoleKey: "support"}
	expected := sdk.KnowledgeDocumentSnapshot{DocumentID: "document-a", ContentVersion: 2, IndexGeneration: 3, SHA256: strings.Repeat("a", 64)}
	repo := &snapshotRepo{sourceUploadRepo: sourceUploadRepo{library: sdk.KnowledgeLibrary{ID: "library-a", Kind: "shared", Role: "reader"}, record: persistence.KnowledgeDocumentRecord{Document: sdk.KnowledgeDocument{ID: expected.DocumentID, LibraryID: "library-a", ProjectionKind: "file", ContentVersion: 2, IndexGeneration: 3, SHA256: expected.SHA256, State: "ready", SecurityStatus: "clean", IndexStatus: "INDEXED", Revision: 8}, SourceID: "managed-source", SecurityScanCompleted: true, IndexObserved: true, BodyRef: "must-not-open", SourceAccess: &sdk.KnowledgeDocumentSourceAccess{Namespace: sdk.KnowledgeDocumentSourceNamespaceRuntimeRecord, ResourceType: "meeting", ResourceID: "source-a"}}}}
	policy := &snapshotLibraryPolicy{}
	sourcePolicy := &sourceUploadAuthorizer{}
	service := NewService(repo, "runtime", Options{DocumentStorage: &sourceUploadStorage{}, LibraryAuthorizer: policy, SourceAuthorizer: sourcePolicy, LibraryKnowledge: []LibraryKnowledgeBinding{{WorkspaceID: "workspace", LibraryID: "library-a", Source: &sourceUploadProvider{}, ManageDocuments: true}}}, nil)
	return service, repo, policy, sourcePolicy, a, expected
}
func TestManagedSnapshotCheckUsesCurrentDownloadAndSourceAuthorityWithoutStorageOrProviderRead(t *testing.T) {
	s, repo, policy, sourcePolicy, a, expected := snapshotServiceFixture()
	doc, err := s.CheckKnowledgeDocumentSnapshot(t.Context(), "library-a", expected, a)
	if err != nil || doc.ID != expected.DocumentID || doc.SHA256 != expected.SHA256 || policy.calls != 2 || sourcePolicy.calls != 2 || repo.pageChecks != 0 {
		t.Fatal(doc, err, policy.calls, sourcePolicy.calls)
	}
	// The provider's read/fetch methods and storage's Open method are nil
	// embedded ports: this test would panic if metadata validation called them.
}
func TestManagedSnapshotCheckRejectsStaleUnsafeOrReboundDocuments(t *testing.T) {
	for name, change := range map[string]func(*snapshotRepo, *sdk.KnowledgeDocumentSnapshot){
		"different content":    func(r *snapshotRepo, _ *sdk.KnowledgeDocumentSnapshot) { r.record.Document.ContentVersion++ },
		"different generation": func(r *snapshotRepo, _ *sdk.KnowledgeDocumentSnapshot) { r.record.Document.IndexGeneration++ },
		"different hash": func(r *snapshotRepo, _ *sdk.KnowledgeDocumentSnapshot) {
			r.record.Document.SHA256 = strings.Repeat("b", 64)
		},
		"source rebound":        func(r *snapshotRepo, _ *sdk.KnowledgeDocumentSnapshot) { r.record.SourceID = "other-source" },
		"source policy changed": func(r *snapshotRepo, _ *sdk.KnowledgeDocumentSnapshot) { r.record.AccessPolicySHA256 = "other-policy" },
		"not indexed":           func(r *snapshotRepo, _ *sdk.KnowledgeDocumentSnapshot) { r.record.IndexObserved = false },
		"index failure":         func(r *snapshotRepo, _ *sdk.KnowledgeDocumentSnapshot) { r.record.Document.IndexStatus = "FAILED" },
		"scan incomplete":       func(r *snapshotRepo, _ *sdk.KnowledgeDocumentSnapshot) { r.record.SecurityScanCompleted = false },
		"quarantined":           func(r *snapshotRepo, _ *sdk.KnowledgeDocumentSnapshot) { r.record.Document.SecurityStatus = "rejected" },
		"deleting":              func(r *snapshotRepo, _ *sdk.KnowledgeDocumentSnapshot) { r.record.DeleteStarted = true },
		"reindexing":            func(r *snapshotRepo, _ *sdk.KnowledgeDocumentSnapshot) { r.record.Document.Reindexing = true },
		"replacement pending": func(r *snapshotRepo, _ *sdk.KnowledgeDocumentSnapshot) {
			r.record.Replacement = &persistence.KnowledgeDocumentReplacement{}
		},
		"unknown kind":      func(r *snapshotRepo, _ *sdk.KnowledgeDocumentSnapshot) { r.record.Document.ProjectionKind = "unknown" },
		"forged page":       func(_ *snapshotRepo, e *sdk.KnowledgeDocumentSnapshot) { e.PageID = "other"; e.PageVersion = 1 },
		"invalid reference": func(_ *snapshotRepo, e *sdk.KnowledgeDocumentSnapshot) { e.ContentVersion = 0 },
	} {
		t.Run(name, func(t *testing.T) {
			s, r, _, _, a, e := snapshotServiceFixture()
			change(r, &e)
			if doc, err := s.CheckKnowledgeDocumentSnapshot(t.Context(), "library-a", e, a); err == nil || doc.ID != "" {
				t.Fatal("unsafe snapshot accepted", doc, err)
			}
		})
	}
}
func TestManagedSnapshotCheckRechecksLibraryAndSourceRevocationAndWorkspace(t *testing.T) {
	for _, mode := range []string{"library", "source", "foreign-workspace", "foreign-library", "changed-during-read"} {
		t.Run(mode, func(t *testing.T) {
			s, r, p, source, a, e := snapshotServiceFixture()
			library := "library-a"
			switch mode {
			case "library":
				p.denyAt = 2
			case "source":
				source.denyAt = 2
			case "foreign-workspace":
				a.WorkspaceID = "other"
			case "foreign-library":
				library = "other"
			case "changed-during-read":
				r.afterRead = func() { r.record.Document.ContentVersion++ }
			}
			if doc, err := s.CheckKnowledgeDocumentSnapshot(t.Context(), library, e, a); err == nil || doc.ID != "" {
				t.Fatal("revoked or stale fact returned", doc, err)
			}
		})
	}
}
func TestManagedPageSnapshotRequiresLivePageProjectionPolicy(t *testing.T) {
	for _, deny := range []bool{false, true} {
		s, r, _, _, a, e := snapshotServiceFixture()
		r.record.Document.ProjectionKind = "page"
		r.record.Document.OriginPageID = "page-a"
		r.record.Document.OriginPageVersion = 4
		r.record.PageProjection = &persistence.KnowledgePageProjectionOrigin{PageID: "page-a", Version: 4, AccessRevision: 2}
		r.denyPage = deny
		e.PageID = "page-a"
		e.PageVersion = 4
		doc, err := s.CheckKnowledgeDocumentSnapshot(t.Context(), "library-a", e, a)
		if deny {
			if err == nil || doc.ID != "" {
				t.Fatal("denied page accepted", doc, err)
			}
		} else if err != nil || r.pageChecks != 2 {
			t.Fatal(doc, err, r.pageChecks)
		}
	}
}
