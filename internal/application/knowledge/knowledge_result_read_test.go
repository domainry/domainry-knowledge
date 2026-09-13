package application

import (
	"context"
	"encoding/json"
	"errors"
	"strings"
	"testing"

	sdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
)

type resultReadLibraryRepo struct {
	persistence.KnowledgeLibraryRepository
	persistence.KnowledgeDocumentRepository
	a       sdk.ConversationAuthority
	library sdk.KnowledgeLibrary
	doc     persistence.KnowledgeDocumentRecord
	member  bool
}

func (r *resultReadLibraryRepo) KnowledgeLibrary(_ context.Context, id string, a sdk.ConversationAuthority) (sdk.KnowledgeLibrary, error) {
	if !r.member || a != r.a || id != r.library.ID {
		return sdk.KnowledgeLibrary{}, conversationFailure("forbidden", "knowledge_access_denied")
	}
	return r.library, nil
}
func (r *resultReadLibraryRepo) KnowledgeDocumentLibrarySource(_ context.Context, id string, a sdk.ConversationAuthority) (string, error) {
	if a != r.a || id != r.library.ID {
		return "", conversationFailure("forbidden", "knowledge_access_denied")
	}
	return r.doc.SourceID, nil
}
func (r *resultReadLibraryRepo) KnowledgeDocumentRecord(_ context.Context, id string, a sdk.ConversationAuthority) (persistence.KnowledgeDocumentRecord, error) {
	if a != r.a || id != r.doc.Document.ID {
		return persistence.KnowledgeDocumentRecord{}, conversationFailure("not_found", "document_not_found")
	}
	return r.doc, nil
}
func (r *resultReadLibraryRepo) KnowledgeDocumentByRemoteID(ctx context.Context, library, source, id string, a sdk.ConversationAuthority) (persistence.KnowledgeDocumentRecord, error) {
	if library != r.library.ID || source != r.doc.SourceID || id != r.doc.RemoteID {
		return persistence.KnowledgeDocumentRecord{}, conversationFailure("not_found", "document_not_found")
	}
	return r.KnowledgeDocumentRecord(ctx, r.doc.Document.ID, a)
}

type resultReadLibraryPolicy struct {
	sdk.KnowledgeLibraryAuthorizer
	denied     string
	operations []string
}

func (p *resultReadLibraryPolicy) AuthorizeKnowledgeLibrary(_ context.Context, operation string, _ sdk.KnowledgeLibrary, _ sdk.ConversationAuthority) error {
	p.operations = append(p.operations, operation)
	if p.denied == operation {
		return conversationFailure("forbidden", "library_access_denied")
	}
	return nil
}

type resultReadDocumentProvider struct {
	sdk.ManagedKnowledgeDocumentSource
	sdk.ConversationKnowledgeSource
	passages  []sdk.KnowledgeDocumentPassage
	reads     int
	afterRead func()
}

func (*resultReadDocumentProvider) KnowledgeDocumentSourceIdentity() string { return "isolated-source" }
func (*resultReadDocumentProvider) KnowledgeDocumentManagementReady() error { return nil }
func (s *resultReadDocumentProvider) SearchKnowledgeDocumentPassages(context.Context, string, sdk.ConversationAuthority) ([]sdk.KnowledgeDocumentPassage, error) {
	s.reads++
	if s.afterRead != nil {
		s.afterRead()
	}
	return s.passages, nil
}
func (s *resultReadDocumentProvider) ReadKnowledgeDocumentPassages(ctx context.Context, _ string, a sdk.ConversationAuthority) ([]sdk.KnowledgeDocumentPassage, error) {
	return s.SearchKnowledgeDocumentPassages(ctx, "", a)
}

func TestManagedKnowledgeResultReadingUsesCurrentOriginalAndLibraryRights(t *testing.T) {
	a := sdk.ConversationAuthority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "reader"}
	lib := sdk.KnowledgeLibrary{ID: "lib_" + strings.Repeat("a", 32), Kind: "shared", Role: "reader"}
	doc := persistence.KnowledgeDocumentRecord{Document: sdk.KnowledgeDocument{ID: "kdoc_" + strings.Repeat("b", 32), LibraryID: lib.ID, State: "ready", SHA256: strings.Repeat("c", 64)}, SourceID: "isolated-source", RemoteID: "remote-doc", IndexObserved: true}
	repo := &resultReadLibraryRepo{a: a, library: lib, doc: doc, member: true}
	policy := &resultReadLibraryPolicy{}
	provider := &resultReadDocumentProvider{passages: []sdk.KnowledgeDocumentPassage{{DocumentID: doc.RemoteID, Title: "文件", Content: "金额：123.45"}}}
	k, err := NewLibraryKnowledgeSource(repo, a.RuntimeID, policy, []LibraryKnowledgeBinding{{WorkspaceID: a.WorkspaceID, LibraryID: lib.ID, Source: provider, ManageDocuments: true}}, nil, nil)
	if err != nil {
		t.Fatal(err)
	}
	for _, operation := range []string{"search", "fetch"} {
		t.Run(operation, func(t *testing.T) {
			var saved sdk.ConversationKnowledgeResult
			if operation == "search" {
				saved, err = k.SearchLibraryKnowledge(t.Context(), lib.ID, "金额", a)
			} else {
				saved, err = k.ReadLibraryKnowledge(t.Context(), lib.ID, doc.Document.ID, a)
			}
			if err != nil {
				t.Fatal(err)
			}
			if err = sdk.AuthorizeKnowledgeResultRead(t.Context(), k, saved, a); err != nil {
				t.Fatal(err)
			}
			for _, change := range []struct {
				name  string
				apply func()
			}{
				{"download", func() { policy.denied = "documents_download" }},
				{"library", func() { policy.denied = "libraries_get" }},
				{"membership", func() { repo.member = false }},
				{"archived", func() { repo.library.Archived = true }},
				{"removed", func() { repo.doc.DeleteStarted = true }},
				{"content", func() { repo.doc.Document.SHA256 = strings.Repeat("d", 64) }},
				{"binding", func() { repo.doc.SourceID = "different-source" }},
			} {
				t.Run(change.name, func(t *testing.T) {
					change.apply()
					if err = sdk.AuthorizeKnowledgeResultRead(t.Context(), k, saved, a); err == nil {
						t.Fatal("revoked source remained readable")
					}
					policy.denied = ""
					repo.member = true
					repo.library = lib
					repo.doc = doc
				})
			}
			provider.afterRead = func() { policy.denied = "documents_download" }
			if err = sdk.AuthorizeKnowledgeResultRead(t.Context(), k, saved, a); err == nil {
				t.Fatal("mid-read permission revocation survived")
			}
			provider.afterRead = nil
			policy.denied = ""
			changed := saved
			var data DocumentEvidence
			_ = json.Unmarshal(saved.Data, &data)
			data.Passages[0].Content = "金额：999.99"
			changed.Data, _ = json.Marshal(data)
			if err = sdk.AuthorizeKnowledgeResultRead(t.Context(), k, changed, a); err == nil {
				t.Fatal("altered original output accepted")
			}
			other := a
			other.UserID = "other"
			before := provider.reads
			if err = sdk.AuthorizeKnowledgeResultRead(t.Context(), k, saved, other); err == nil || provider.reads != before {
				t.Fatal("foreign reader reached source")
			}
			changed = saved
			changed.ConversationID = "private-conversation"
			if err = sdk.AuthorizeKnowledgeResultRead(t.Context(), k, changed, a); err == nil {
				t.Fatal("private conversation source promoted")
			}
		})
	}
	for _, op := range policy.operations {
		if op != "libraries_get" && op != "documents_download" {
			t.Fatalf("result reading used professional action %s", op)
		}
	}
	var coded *sdk.Error
	if err = sdk.AuthorizeKnowledgeResultRead(t.Context(), struct{}{}, sdk.ConversationKnowledgeResult{}, a); !errors.As(err, &coded) || coded.Code != sdk.KnowledgeResultReadUnsupportedCode {
		t.Fatal("old source did not explicitly report unsupported", err)
	}
}

type resultReadGuardRegistry struct {
	persistence.KnowledgeSourceRegistry
	managed bool
}

func (r *resultReadGuardRegistry) KnowledgeSourceManaged(context.Context, string) (bool, error) {
	return r.managed, nil
}

type resultReadLegacySource struct {
	reads     int
	afterRead func()
}

func (*resultReadLegacySource) Search(context.Context, string, sdk.ConversationAuthority) (json.RawMessage, error) {
	panic("execution is not a result-read policy")
}
func (s *resultReadLegacySource) AuthorizeKnowledgeResultRead(context.Context, sdk.ConversationKnowledgeResult, sdk.ConversationAuthority) error {
	s.reads++
	if s.afterRead != nil {
		s.afterRead()
	}
	return nil
}
func TestKnowledgeResultReaderPreservesManagedSourceGuard(t *testing.T) {
	registry := &resultReadGuardRegistry{}
	base := &resultReadLegacySource{}
	guarded := &DocumentGuardedKnowledge{base: base, source: &resultReadDocumentProvider{}, repo: registry}
	a := sdk.ConversationAuthority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "reader"}
	saved := sdk.ConversationKnowledgeResult{Provider: "fixture", Operation: "fetch", DocumentID: "original"}
	if err := sdk.AuthorizeKnowledgeResultRead(t.Context(), guarded, saved, a); err != nil || base.reads != 1 {
		t.Fatal("guard did not delegate explicit source reader", err)
	}
	registry.managed = true
	if err := sdk.AuthorizeKnowledgeResultRead(t.Context(), guarded, saved, a); err == nil || base.reads != 1 {
		t.Fatal("managed source escaped through legacy reader", err)
	}
	registry.managed = false
	base.afterRead = func() { registry.managed = true }
	if err := sdk.AuthorizeKnowledgeResultRead(t.Context(), guarded, saved, a); err == nil || base.reads != 2 {
		t.Fatal("late managed-source registration survived", err)
	}
}
