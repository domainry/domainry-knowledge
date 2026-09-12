package application

import (
	"context"
	"encoding/json"
	"errors"
	"unicode/utf8"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
)

const ManagedKnowledgeProvider = "agent_library_documents"

// Once a physical KB is managed, its local document allowlist remains mandatory
// across restarts, configuration downgrades, and removal of the last document.
func (k *LibraryKnowledgeSource) ManagedSource(ctx context.Context, b LibraryKnowledgeBinding, a agentsdk.ConversationAuthority) (agentsdk.ManagedKnowledgeDocumentSource, bool, error) {
	source, _ := b.Source.(agentsdk.ManagedKnowledgeDocumentSource)
	if k.documents == nil {
		return nil, false, nil
	}
	registered, err := k.documents.KnowledgeDocumentLibrarySource(ctx, b.LibraryID, a)
	if err != nil {
		return nil, false, LibraryKnowledgeAccessError(err)
	}
	if registered != "" {
		if source == nil || source.KnowledgeDocumentSourceIdentity() != registered {
			return nil, false, conversationFailure("forbidden", "knowledge_access_denied")
		}
		return source, true, nil
	}
	if source != nil {
		used, err := k.documents.KnowledgeSourceManaged(ctx, source.KnowledgeDocumentSourceIdentity())
		if err != nil {
			return nil, false, err
		}
		if used {
			return nil, false, conversationFailure("forbidden", "knowledge_access_denied")
		}
	}
	return source, false, nil
}

// Legacy/default retrieval also consults the durable registry. Otherwise simply
// dropping library bindings would expose deleted or unregistered remote hits.
type DocumentGuardedKnowledge struct {
	base   ConversationKnowledge
	source agentsdk.ManagedKnowledgeDocumentSource
	repo   persistence.KnowledgeSourceRegistry
}

func (k *DocumentGuardedKnowledge) Check(ctx context.Context) error {
	managed, err := k.repo.KnowledgeSourceManaged(ctx, k.source.KnowledgeDocumentSourceIdentity())
	if err != nil {
		return err
	}
	if managed {
		return conversationFailure("forbidden", "knowledge_access_denied")
	}
	return nil
}
func (k *DocumentGuardedKnowledge) Search(ctx context.Context, q string, a agentsdk.ConversationAuthority) (json.RawMessage, error) {
	if err := k.Check(ctx); err != nil {
		return nil, err
	}
	out, err := k.base.Search(ctx, q, a)
	if err == nil {
		err = k.Check(ctx)
	}
	if err != nil {
		return nil, err
	}
	return out, nil
}
func (k *DocumentGuardedKnowledge) SearchKnowledge(ctx context.Context, q string, a agentsdk.ConversationAuthority) (agentsdk.ConversationKnowledgeResult, error) {
	if err := k.Check(ctx); err != nil {
		return agentsdk.ConversationKnowledgeResult{}, err
	}
	out, err := k.base.(agentsdk.ConversationKnowledgeSource).SearchKnowledge(ctx, q, a)
	if err == nil {
		err = k.Check(ctx)
	}
	if err != nil {
		return agentsdk.ConversationKnowledgeResult{}, err
	}
	return out, nil
}
func (k *DocumentGuardedKnowledge) ReadKnowledge(ctx context.Context, id string, a agentsdk.ConversationAuthority) (agentsdk.ConversationKnowledgeResult, error) {
	if err := k.Check(ctx); err != nil {
		return agentsdk.ConversationKnowledgeResult{}, err
	}
	out, err := k.base.(agentsdk.ConversationKnowledgeSource).ReadKnowledge(ctx, id, a)
	if err == nil {
		err = k.Check(ctx)
	}
	if err != nil {
		return agentsdk.ConversationKnowledgeResult{}, err
	}
	return out, nil
}
func (k *DocumentGuardedKnowledge) RevalidateKnowledge(ctx context.Context, saved agentsdk.ConversationKnowledgeResult, a agentsdk.ConversationAuthority) error {
	if err := k.Check(ctx); err != nil {
		return err
	}
	if err := k.base.(agentsdk.ConversationKnowledgeSource).RevalidateKnowledge(ctx, saved, a); err != nil {
		return err
	}
	return k.Check(ctx)
}

type DocumentSnapshot struct {
	ID     string `json:"id"`
	SHA256 string `json:"sha256"`
}
type DocumentEvidence struct {
	Passages  []agentsdk.KnowledgeDocumentPassage `json:"passages"`
	Documents []DocumentSnapshot                  `json:"documents"`
	Partial   bool                                `json:"partial"` // Parsed passages never prove a complete original file.
}

func DocumentReadable(r persistence.KnowledgeDocumentRecord, library, source, policy string) bool {
	return r.Document.LibraryID == library && r.SourceID == source && r.AccessPolicySHA256 == policy && r.Document.State == "ready" && r.IndexObserved && !r.DeleteStarted
}
func (k *LibraryKnowledgeSource) ManagedDocument(ctx context.Context, b LibraryKnowledgeBinding, source, id string, a agentsdk.ConversationAuthority) (persistence.KnowledgeDocumentRecord, error) {
	r, err := k.documents.KnowledgeDocumentRecord(ctx, id, a)
	if err != nil {
		return r, LibraryKnowledgeAccessError(err)
	}
	if !DocumentReadable(r, b.LibraryID, source, DocumentAccessPolicy(b.Source)) {
		return r, conversationFailure("forbidden", "knowledge_access_denied")
	}
	return r, nil
}
func (k *LibraryKnowledgeSource) ManagedKnowledge(ctx context.Context, b LibraryKnowledgeBinding, source agentsdk.ManagedKnowledgeDocumentSource, op, q, id string, a agentsdk.ConversationAuthority) (agentsdk.ConversationKnowledgeResult, error) {
	var passages []agentsdk.KnowledgeDocumentPassage
	var err error
	if op == "search" {
		passages, err = source.SearchKnowledgeDocumentPassages(ctx, q, a)
	} else {
		r, e := k.ManagedDocument(ctx, b, source.KnowledgeDocumentSourceIdentity(), id, a)
		if e != nil {
			return agentsdk.ConversationKnowledgeResult{}, e
		}
		passages, err = source.ReadKnowledgeDocumentPassages(ctx, r.RemoteID, a)
	}
	if err != nil {
		return agentsdk.ConversationKnowledgeResult{}, err
	}
	data := DocumentEvidence{Passages: []agentsdk.KnowledgeDocumentPassage{}, Documents: []DocumentSnapshot{}, Partial: true}
	seen := map[string]bool{}
	if len(passages) > 1000 {
		return agentsdk.ConversationKnowledgeResult{}, conversationFailure("unavailable", "knowledge_response_invalid")
	}
	for _, p := range passages {
		r, err := k.documents.KnowledgeDocumentByRemoteID(ctx, b.LibraryID, source.KnowledgeDocumentSourceIdentity(), p.DocumentID, a)
		if err != nil {
			var coded *agentsdk.Error
			if errors.As(err, &coded) && coded.Code == "agent.conversation.document_not_found" {
				continue
			}
			return agentsdk.ConversationKnowledgeResult{}, LibraryKnowledgeAccessError(err)
		}
		if !DocumentReadable(r, b.LibraryID, source.KnowledgeDocumentSourceIdentity(), DocumentAccessPolicy(source)) {
			continue
		}
		if id != "" && r.Document.ID != id {
			return agentsdk.ConversationKnowledgeResult{}, conversationFailure("unavailable", "knowledge_response_invalid")
		}
		if !conversationText(p.Content, 512*1024, true) || !conversationText(p.Title, 512, false) || !conversationText(p.URL, 4096, false) {
			return agentsdk.ConversationKnowledgeResult{}, conversationFailure("unavailable", "knowledge_response_invalid")
		}
		p.DocumentID = r.Document.ID
		if p.Title == "" {
			p.Title = r.Document.Filename
		}
		data.Passages = append(data.Passages, p)
		if !seen[p.DocumentID] {
			seen[p.DocumentID] = true
			data.Documents = append(data.Documents, DocumentSnapshot{p.DocumentID, r.Document.SHA256})
		}
	}
	if id != "" && len(data.Passages) == 0 {
		return agentsdk.ConversationKnowledgeResult{}, conversationFailure("not_found", "knowledge_not_found")
	}
	out, err := k.DocumentReceipt(b, source.KnowledgeDocumentSourceIdentity(), op, q, id, data, a)
	if err != nil {
		return agentsdk.ConversationKnowledgeResult{}, err
	}
	// Recheck every local document after the remote request and filtering.
	if err = k.CheckDocumentSnapshots(ctx, b, source.KnowledgeDocumentSourceIdentity(), data, a); err != nil {
		return agentsdk.ConversationKnowledgeResult{}, err
	}
	return out, nil
}
func (k *LibraryKnowledgeSource) DocumentReceipt(b LibraryKnowledgeBinding, source, op, q, id string, data DocumentEvidence, a agentsdk.ConversationAuthority) (agentsdk.ConversationKnowledgeResult, error) {
	raw, err := json.Marshal(data)
	if err != nil || len(raw) > 640*1024 {
		return agentsdk.ConversationKnowledgeResult{}, conversationFailure("unavailable", "knowledge_context_exceeded")
	}
	out := agentsdk.ConversationKnowledgeResult{Provider: ManagedKnowledgeProvider, LibraryID: b.LibraryID, Operation: op, Query: q, DocumentID: id, Data: raw}
	// Citation count is bounded independently of the full mapped passage data.
	for i, p := range data.Passages {
		if i >= 50 {
			break
		}
		excerpt := p.Content
		if len(excerpt) > 2048 {
			excerpt = excerpt[:2048]
			for !utf8.ValidString(excerpt) {
				excerpt = excerpt[:len(excerpt)-1]
			}
		}
		out.Citations = append(out.Citations, agentsdk.ConversationCitation{ID: "kc_" + conversationDigest([]any{source, a.RuntimeID, a.WorkspaceID, a.UserID, b.LibraryID, op, q, id, data, i})[:32], Provider: ManagedKnowledgeProvider, LibraryID: b.LibraryID, Operation: op, DocumentID: p.DocumentID, Title: p.Title, URL: p.URL, Excerpt: excerpt, ExcerptTruncated: len(excerpt) < len(p.Content)})
	}
	out.ScopeSHA256 = conversationDigest([]any{source, a.RuntimeID, a.WorkspaceID, a.UserID, out})
	return out, nil
}
func (k *LibraryKnowledgeSource) CheckDocumentSnapshots(ctx context.Context, b LibraryKnowledgeBinding, source string, data DocumentEvidence, a agentsdk.ConversationAuthority) error {
	if _, err := k.Access(ctx, b.LibraryID, a); err != nil {
		return err
	}
	for _, snapshot := range data.Documents {
		r, err := k.ManagedDocument(ctx, b, source, snapshot.ID, a)
		if err != nil {
			return err
		}
		if r.Document.SHA256 != snapshot.SHA256 {
			return conversationFailure("conflict", "knowledge_source_changed")
		}
	}
	return nil
}
func (k *LibraryKnowledgeSource) RevalidateManagedKnowledge(ctx context.Context, b LibraryKnowledgeBinding, source agentsdk.ManagedKnowledgeDocumentSource, saved agentsdk.ConversationKnowledgeResult, a agentsdk.ConversationAuthority) error {
	if saved.Provider != ManagedKnowledgeProvider || saved.KBID != "" || saved.Operation != "search" && saved.Operation != "fetch" || saved.Operation == "search" && (saved.Query == "" || saved.DocumentID != "") || saved.Operation == "fetch" && (saved.DocumentID == "" || saved.Query != "") {
		return conversationFailure("forbidden", "knowledge_access_denied")
	}
	var data DocumentEvidence
	if len(saved.Data) > 640*1024 || json.Unmarshal(saved.Data, &data) != nil || !data.Partial || len(data.Passages) > 1000 || len(data.Documents) > 1000 {
		return conversationFailure("unavailable", "knowledge_response_invalid")
	}
	expected, err := k.DocumentReceipt(b, source.KnowledgeDocumentSourceIdentity(), saved.Operation, saved.Query, saved.DocumentID, data, a)
	if err != nil {
		return err
	}
	// Typed reconstruction also rejects altered citations or extra raw fields.
	if conversationDigest(expected) != conversationDigest(saved) {
		return conversationFailure("forbidden", "knowledge_access_denied")
	}
	if err = k.CheckDocumentSnapshots(ctx, b, source.KnowledgeDocumentSourceIdentity(), data, a); err != nil {
		return err
	}
	current, err := k.ManagedKnowledge(ctx, b, source, saved.Operation, saved.Query, saved.DocumentID, a)
	if err != nil {
		return err
	}
	if conversationDigest(current) != conversationDigest(saved) {
		return conversationFailure("conflict", "knowledge_source_changed")
	}
	return nil
}
