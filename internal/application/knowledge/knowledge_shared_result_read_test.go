package application

import (
	"context"
	"encoding/json"
	"strings"
	"testing"

	sdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
)

type sharedKnowledgeReadRepo struct {
	resultReadLibraryRepo
	producer, reader sdk.ConversationAuthority
	readerMember     bool
}

func (r *sharedKnowledgeReadRepo) allowed(a sdk.ConversationAuthority) bool {
	return a == r.producer || a == r.reader && r.readerMember
}
func (r *sharedKnowledgeReadRepo) KnowledgeLibrary(ctx context.Context, id string, a sdk.ConversationAuthority) (sdk.KnowledgeLibrary, error) {
	if !r.allowed(a) {
		return sdk.KnowledgeLibrary{}, conversationFailure("forbidden", "knowledge_access_denied")
	}
	return r.resultReadLibraryRepo.KnowledgeLibrary(ctx, id, r.producer)
}
func (r *sharedKnowledgeReadRepo) KnowledgeDocumentLibrarySource(ctx context.Context, id string, a sdk.ConversationAuthority) (string, error) {
	if !r.allowed(a) {
		return "", conversationFailure("forbidden", "knowledge_access_denied")
	}
	return r.resultReadLibraryRepo.KnowledgeDocumentLibrarySource(ctx, id, r.producer)
}
func (r *sharedKnowledgeReadRepo) KnowledgeDocumentRecord(ctx context.Context, id string, a sdk.ConversationAuthority) (persistence.KnowledgeDocumentRecord, error) {
	if !r.allowed(a) {
		return persistence.KnowledgeDocumentRecord{}, conversationFailure("forbidden", "knowledge_access_denied")
	}
	return r.resultReadLibraryRepo.KnowledgeDocumentRecord(ctx, id, r.producer)
}
func (r *sharedKnowledgeReadRepo) KnowledgeDocumentByRemoteID(ctx context.Context, library, source, id string, a sdk.ConversationAuthority) (persistence.KnowledgeDocumentRecord, error) {
	if !r.allowed(a) {
		return persistence.KnowledgeDocumentRecord{}, conversationFailure("forbidden", "knowledge_access_denied")
	}
	return r.resultReadLibraryRepo.KnowledgeDocumentByRemoteID(ctx, library, source, id, r.producer)
}

type sharedKnowledgeReadPolicy struct {
	sdk.KnowledgeLibraryAuthorizer
	deniedUser, deniedOperation string
}

func (p *sharedKnowledgeReadPolicy) AuthorizeKnowledgeLibrary(_ context.Context, operation string, _ sdk.KnowledgeLibrary, a sdk.ConversationAuthority) error {
	if a.UserID == p.deniedUser && operation == p.deniedOperation {
		return conversationFailure("forbidden", "knowledge_access_denied")
	}
	return nil
}

type sharedKnowledgeReadProvider struct {
	resultReadDocumentProvider
	authorities []sdk.ConversationAuthority
	after       func(sdk.ConversationAuthority)
}

func (p *sharedKnowledgeReadProvider) SearchKnowledgeDocumentPassages(_ context.Context, _ string, a sdk.ConversationAuthority) ([]sdk.KnowledgeDocumentPassage, error) {
	p.authorities = append(p.authorities, a)
	if p.after != nil {
		p.after(a)
	}
	return p.passages, nil
}
func (p *sharedKnowledgeReadProvider) ReadKnowledgeDocumentPassages(ctx context.Context, id string, a sdk.ConversationAuthority) ([]sdk.KnowledgeDocumentPassage, error) {
	return p.SearchKnowledgeDocumentPassages(ctx, id, a)
}

func TestSharedManagedKnowledgeKeepsProducerScopeAndActualReaderFileRights(t *testing.T) {
	producer := sdk.ConversationAuthority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "producer", RoleKey: "professional"}
	reader := producer
	reader.UserID, reader.RoleKey = "reader", "read-only"
	lib := sdk.KnowledgeLibrary{ID: "lib_" + strings.Repeat("a", 32), Kind: "shared", Role: "reader"}
	doc := persistence.KnowledgeDocumentRecord{Document: sdk.KnowledgeDocument{ID: "kdoc_" + strings.Repeat("b", 32), LibraryID: lib.ID, State: "ready", SHA256: strings.Repeat("c", 64)}, SourceID: "isolated-source", RemoteID: "remote-doc", IndexObserved: true}
	repo := &sharedKnowledgeReadRepo{resultReadLibraryRepo: resultReadLibraryRepo{a: producer, library: lib, doc: doc, member: true}, producer: producer, reader: reader, readerMember: true}
	policy := &sharedKnowledgeReadPolicy{}
	provider := &sharedKnowledgeReadProvider{resultReadDocumentProvider: resultReadDocumentProvider{passages: []sdk.KnowledgeDocumentPassage{{DocumentID: doc.RemoteID, Title: "金额来源", Content: "金额：123.45\n编号：9007199254740993"}}}}
	k, err := NewLibraryKnowledgeSource(repo, producer.RuntimeID, policy, []LibraryKnowledgeBinding{{WorkspaceID: producer.WorkspaceID, LibraryID: lib.ID, Source: provider, ManageDocuments: true}}, nil, nil)
	if err != nil {
		t.Fatal(err)
	}
	catalogQuery := `{"after":"","limit":0}`
	catalogData, _ := json.Marshal(sdk.KnowledgeLibraryPage{Items: []sdk.KnowledgeLibrary{lib}})
	catalog := sdk.ConversationKnowledgeResult{Provider: "agent_libraries", Operation: "libraries", Query: catalogQuery, Data: catalogData, ScopeSHA256: k.CatalogScope(catalogData, producer)}
	for _, operation := range []string{"libraries", "search", "fetch", "extract"} {
		t.Run(operation, func(t *testing.T) {
			var saved sdk.ConversationKnowledgeResult
			var err error
			switch operation {
			case "libraries":
				saved = catalog
			case "search":
				saved, err = k.SearchLibraryKnowledge(t.Context(), lib.ID, "金额", producer)
			default:
				saved, err = k.ReadLibraryKnowledge(t.Context(), lib.ID, doc.Document.ID, producer)
			}
			if err != nil {
				t.Fatal(err)
			}
			original, _ := json.Marshal(saved)
			read := func() error {
				if operation == "extract" {
					passages, err := sdk.SharedKnowledgeExtractionPassages(t.Context(), k, saved, reader, producer)
					if err == nil && (len(passages) != 1 || !strings.Contains(passages[0].Content, "123.45")) {
						t.Fatal("original extraction content changed", passages)
					}
					return err
				}
				return sdk.AuthorizeSharedKnowledgeResultRead(t.Context(), k, saved, reader, producer)
			}
			provider.authorities = nil
			if err := read(); err != nil {
				t.Fatal("shared original source denied", err)
			}
			if operation != "libraries" {
				actual := false
				for _, a := range provider.authorities {
					actual = actual || a == reader
				}
				if !actual {
					t.Fatal("source never performed actual reader IO")
				}
			}
			unchanged, _ := json.Marshal(saved)
			if string(original) != string(unchanged) {
				t.Fatal("shared read rewrote original scope or citations")
			}
			if err := sdk.AuthorizeKnowledgeResultRead(t.Context(), k, saved, reader); err == nil {
				t.Fatal("ordinary reader acquired producer evidence")
			}
			for _, revoked := range []string{"reader-membership", "reader-policy", "producer-policy", "producer-membership", "source-document", "reader-during-IO", "reader-during-final-producer-IO"} {
				t.Run(revoked, func(t *testing.T) {
					t.Cleanup(func() {
						repo.member, repo.readerMember, repo.doc, repo.library = true, true, doc, lib
						policy.deniedUser, policy.deniedOperation = "", ""
						provider.after = nil
					})
					switch revoked {
					case "reader-membership":
						repo.readerMember = false
					case "reader-policy":
						policy.deniedUser, policy.deniedOperation = reader.UserID, "libraries_get"
						if operation == "libraries" {
							policy.deniedOperation = "libraries_list"
						}
					case "producer-policy":
						policy.deniedUser, policy.deniedOperation = producer.UserID, "libraries_get"
						if operation == "libraries" {
							policy.deniedOperation = "libraries_list"
						}
					case "producer-membership":
						repo.member = false
					case "source-document":
						repo.doc.DeleteStarted = true
						if operation == "libraries" {
							repo.library.Archived = true
						}
					case "reader-during-IO":
						if operation == "libraries" {
							return
						}
						provider.after = func(a sdk.ConversationAuthority) {
							if a == reader {
								repo.readerMember = false
							}
						}
					case "reader-during-final-producer-IO":
						if operation == "libraries" {
							return
						}
						readerObserved := false
						provider.after = func(a sdk.ConversationAuthority) {
							if a == reader {
								readerObserved = true
							} else if a == producer && readerObserved {
								repo.readerMember = false
							}
						}
					}
					if err := read(); err == nil {
						t.Fatal("withdrawn source remained readable", revoked)
					}
				})
			}
			for _, invalid := range []string{"producer", "workspace", "private-result", "private-citation", "scope"} {
				bad, p := saved, producer
				switch invalid {
				case "producer":
					p.UserID = "foreign"
				case "workspace":
					p.WorkspaceID = "foreign"
				case "private-result":
					bad.ConversationID = "private"
				case "private-citation":
					bad.Citations = append([]sdk.ConversationCitation(nil), saved.Citations...)
					bad.Citations = append(bad.Citations, sdk.ConversationCitation{ConversationID: "private"})
				case "scope":
					bad.ScopeSHA256 = "forged"
				}
				if err := sdk.AuthorizeSharedKnowledgeResultRead(t.Context(), k, bad, reader, p); err == nil {
					t.Fatal("invalid origin accepted", invalid)
				}
			}
		})
	}
}
