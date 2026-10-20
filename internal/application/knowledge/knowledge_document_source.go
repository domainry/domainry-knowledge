package application

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"unicode/utf8"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/contract"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
)

const ManagedKnowledgeProvider = "knowledge_library_documents"

// Once a physical KB is managed, its local document allowlist remains mandatory
// across restarts, configuration downgrades, and removal of the last document.
func (k *LibraryKnowledgeSource) ManagedSource(ctx context.Context, b LibraryKnowledgeBinding, a agentsdk.Authority) (agentsdk.ManagedKnowledgeDocumentSource, bool, error) {
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

// Default retrieval also consults the durable registry. Otherwise simply
// dropping library bindings would expose deleted or unregistered remote hits.
type DocumentGuardedKnowledge struct {
	base   contract.Knowledge
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
func (k *DocumentGuardedKnowledge) SearchKnowledge(ctx context.Context, q string, a agentsdk.Authority) (agentsdk.Result, error) {
	if err := k.Check(ctx); err != nil {
		return agentsdk.Result{}, err
	}
	out, err := k.base.SearchKnowledge(ctx, q, a)
	if err == nil {
		err = k.Check(ctx)
	}
	if err != nil {
		return agentsdk.Result{}, err
	}
	return out, nil
}
func (k *DocumentGuardedKnowledge) ReadKnowledge(ctx context.Context, id string, a agentsdk.Authority) (agentsdk.Result, error) {
	if err := k.Check(ctx); err != nil {
		return agentsdk.Result{}, err
	}
	out, err := k.base.ReadKnowledge(ctx, id, a)
	if err == nil {
		err = k.Check(ctx)
	}
	if err != nil {
		return agentsdk.Result{}, err
	}
	return out, nil
}
func (k *DocumentGuardedKnowledge) RevalidateKnowledge(ctx context.Context, saved agentsdk.Result, a agentsdk.Authority) error {
	if err := k.Check(ctx); err != nil {
		return err
	}
	if err := k.base.RevalidateKnowledge(ctx, saved, a); err != nil {
		return err
	}
	return k.Check(ctx)
}

type DocumentSnapshot struct {
	ID              string `json:"id"`
	ContentVersion  int64  `json:"content_version,omitempty"`
	IndexGeneration int64  `json:"index_generation,omitempty"`
	SHA256          string `json:"sha256"`
	PageID          string `json:"page_id,omitempty"`
	PageVersion     int64  `json:"page_version,omitempty"`
	AccessRevision  int64  `json:"access_revision,omitempty"`
	PermissionID    string `json:"permission_id,omitempty"`
}
type DocumentEvidence struct {
	Passages       []agentsdk.KnowledgeDocumentPassage `json:"passages"`
	Documents      []DocumentSnapshot                  `json:"documents"`
	SearchTopK     int                                 `json:"search_top_k,omitempty"`
	SearchMode     string                              `json:"search_mode,omitempty"`
	SearchReranked *bool                               `json:"search_reranked,omitempty"`
	SearchDegraded string                              `json:"search_degraded_reason,omitempty"`
	Partial        bool                                `json:"partial"` // Parsed passages never prove a complete original file.
}

func managedKnowledgeSearch(ctx context.Context, source agentsdk.ManagedKnowledgeDocumentSource, query string, authority agentsdk.Authority) (agentsdk.KnowledgeDocumentSearch, error) {
	if searchable, ok := source.(agentsdk.ManagedKnowledgeDocumentSearchSource); ok {
		result, err := searchable.SearchKnowledgeDocuments(ctx, query, authority)
		if err != nil {
			return result, err
		}
		if result.TopK < 1 || result.TopK > 20 || result.Mode != "" && result.Mode != "hybrid" && result.Mode != "dense" && result.Mode != "sparse" || result.DegradedReason != "" && result.DegradedReason != "embedder_unavailable" && result.DegradedReason != "bm25_unavailable" && result.DegradedReason != "rerank_unavailable" {
			return agentsdk.KnowledgeDocumentSearch{}, conversationFailure("unavailable", "knowledge_response_invalid")
		}
		if result.Reranked != nil {
			value := *result.Reranked
			result.Reranked = &value
		}
		return result, nil
	}
	passages, err := source.SearchKnowledgeDocumentPassages(ctx, query, authority)
	return agentsdk.KnowledgeDocumentSearch{Passages: passages}, err
}

func DocumentReadable(r persistence.KnowledgeDocumentRecord, library, source, policy string) bool {
	return r.Document.LibraryID == library && r.SourceID == source && r.AccessPolicySHA256 == policy && r.Document.State == "ready" && r.Document.ContentVersion > 0 && r.Document.IndexGeneration > 0 && r.IndexObserved && !r.DeleteStarted
}

func managedKnowledgeSourceRevision(document agentsdk.KnowledgeDocument) string {
	return fmt.Sprintf("content:%d;index:%d", document.ContentVersion, document.IndexGeneration)
}
func (k *LibraryKnowledgeSource) authorizeManagedDocumentSource(ctx context.Context, r persistence.KnowledgeDocumentRecord, a agentsdk.Authority) error {
	if r.SourceAccess == nil {
		return nil
	}
	if !validDocumentSourceAccess(*r.SourceAccess) || k.sourcePolicy == nil {
		return conversationFailure("forbidden", "knowledge_access_denied")
	}
	return k.sourcePolicy.AuthorizeKnowledgeDocumentSource(ctx, *r.SourceAccess, a)
}
func (k *LibraryKnowledgeSource) ManagedDocument(ctx context.Context, b LibraryKnowledgeBinding, source, id string, a agentsdk.Authority) (persistence.KnowledgeDocumentRecord, error) {
	r, err := k.documents.KnowledgeDocumentRecord(ctx, id, a)
	if err != nil {
		return r, LibraryKnowledgeAccessError(err)
	}
	if !DocumentReadable(r, b.LibraryID, source, DocumentAccessPolicy(b.Source)) {
		return r, conversationFailure("forbidden", "knowledge_access_denied")
	}
	if err = k.authorizeManagedDocumentSource(ctx, r, a); err != nil {
		return r, err
	}
	if err = k.validatePageProjection(ctx, r, b.LibraryID, a); err != nil {
		return r, err
	}
	return r, nil
}

func (k *LibraryKnowledgeSource) validatePageProjection(ctx context.Context, record persistence.KnowledgeDocumentRecord, libraryID string, authority agentsdk.Authority) error {
	if record.PageProjection == nil {
		return nil
	}
	validator, ok := k.documents.(interface {
		ValidateKnowledgePageProjection(context.Context, persistence.KnowledgePageProjectionOrigin, string, agentsdk.Authority) error
	})
	if !ok {
		return conversationFailure("forbidden", "knowledge_access_denied")
	}
	return validator.ValidateKnowledgePageProjection(ctx, *record.PageProjection, libraryID, authority)
}
func (k *LibraryKnowledgeSource) ManagedKnowledge(ctx context.Context, b LibraryKnowledgeBinding, source agentsdk.ManagedKnowledgeDocumentSource, op, q, id string, a agentsdk.Authority) (agentsdk.Result, error) {
	var passages []agentsdk.KnowledgeDocumentPassage
	var search agentsdk.KnowledgeDocumentSearch
	var err error
	if op == "search" {
		permissionSource, scoped := source.(agentsdk.ManagedKnowledgeDocumentPermissionSource)
		permissionRepository, available := k.documents.(interface {
			KnowledgePagePermissionTokens(context.Context, string, agentsdk.Authority) ([]string, error)
		})
		if !scoped || !available {
			return agentsdk.Result{}, conversationFailure("unavailable", "page_permissions_unavailable")
		}
		permissionIDs, permissionErr := permissionRepository.KnowledgePagePermissionTokens(ctx, b.LibraryID, a)
		if permissionErr != nil {
			return agentsdk.Result{}, permissionErr
		}
		search, err = permissionSource.SearchKnowledgeDocumentsWithPermissions(ctx, q, permissionIDs, a)
		passages = search.Passages
	} else {
		r, e := k.ManagedDocument(ctx, b, source.KnowledgeDocumentSourceIdentity(), id, a)
		if e != nil {
			return agentsdk.Result{}, e
		}
		permissionSource, scoped := source.(agentsdk.ManagedKnowledgeDocumentPermissionSource)
		if !scoped {
			return agentsdk.Result{}, conversationFailure("unavailable", "page_permissions_unavailable")
		}
		permissionIDs := []string(nil)
		if r.PageProjection != nil && r.PageProjection.PermissionID != "" {
			permissionIDs = []string{r.PageProjection.PermissionID}
		}
		passages, err = permissionSource.ReadKnowledgeDocumentPassagesWithPermissions(ctx, r.RemoteID, permissionIDs, a)
	}
	if err != nil {
		return agentsdk.Result{}, err
	}
	data := DocumentEvidence{Passages: []agentsdk.KnowledgeDocumentPassage{}, Documents: []DocumentSnapshot{}, SearchTopK: search.TopK, SearchMode: search.Mode, SearchReranked: search.Reranked, SearchDegraded: search.DegradedReason, Partial: true}
	seen := map[string]bool{}
	if len(passages) > 1000 {
		return agentsdk.Result{}, conversationFailure("unavailable", "knowledge_response_invalid")
	}
	for _, p := range passages {
		r, err := k.documents.KnowledgeDocumentByRemoteID(ctx, b.LibraryID, source.KnowledgeDocumentSourceIdentity(), p.DocumentID, a)
		if err != nil {
			var coded *agentsdk.Error
			if errors.As(err, &coded) && coded.Code == "knowledge.document_not_found" {
				continue
			}
			return agentsdk.Result{}, LibraryKnowledgeAccessError(err)
		}
		if !DocumentReadable(r, b.LibraryID, source.KnowledgeDocumentSourceIdentity(), DocumentAccessPolicy(source)) {
			continue
		}
		if err = k.authorizeManagedDocumentSource(ctx, r, a); err != nil {
			var denied *agentsdk.Error
			if errors.As(err, &denied) && (denied.Class == "forbidden" || denied.Class == "not_found") {
				continue
			}
			return agentsdk.Result{}, err
		}
		if err = k.validatePageProjection(ctx, r, b.LibraryID, a); err != nil {
			var denied *agentsdk.Error
			if errors.As(err, &denied) && (denied.Class == "forbidden" || denied.Class == "not_found") {
				continue
			}
			return agentsdk.Result{}, err
		}
		if id != "" && r.Document.ID != id {
			return agentsdk.Result{}, conversationFailure("unavailable", "knowledge_response_invalid")
		}
		if !conversationText(p.Content, 512*1024, true) || !conversationText(p.Title, 512, false) || !conversationText(p.URL, 4096, false) {
			return agentsdk.Result{}, conversationFailure("unavailable", "knowledge_response_invalid")
		}
		if !conversationText(p.ChunkID, 512, false) || !conversationText(p.SourceRevision, 512, false) || p.DocumentVersion < 0 || p.ContentSHA256 != "" && p.ContentSHA256 != r.Document.SHA256 {
			return agentsdk.Result{}, conversationFailure("unavailable", "knowledge_response_invalid")
		}
		p.DocumentID = r.Document.ID
		p.DocumentVersion = r.Document.ContentVersion
		p.ContentSHA256 = r.Document.SHA256
		p.SourceRevision = managedKnowledgeSourceRevision(r.Document)
		if r.PageProjection != nil {
			p.PageID = r.PageProjection.PageID
			p.PageVersion = r.PageProjection.Version
			p.URL = "/knowledge/libraries/" + b.LibraryID + "/pages/" + r.PageProjection.PageID
		}
		if p.Title == "" {
			p.Title = r.Document.Filename
		}
		data.Passages = append(data.Passages, p)
		if !seen[p.DocumentID] {
			seen[p.DocumentID] = true
			snapshot := DocumentSnapshot{ID: p.DocumentID, ContentVersion: r.Document.ContentVersion, IndexGeneration: r.Document.IndexGeneration, SHA256: r.Document.SHA256}
			if r.PageProjection != nil {
				snapshot.PageID, snapshot.PageVersion, snapshot.AccessRevision, snapshot.PermissionID = r.PageProjection.PageID, r.PageProjection.Version, r.PageProjection.AccessRevision, r.PageProjection.PermissionID
			}
			data.Documents = append(data.Documents, snapshot)
		}
	}
	if id != "" && len(data.Passages) == 0 {
		return agentsdk.Result{}, conversationFailure("not_found", "knowledge_not_found")
	}
	out, err := k.DocumentReceipt(b, source.KnowledgeDocumentSourceIdentity(), op, q, id, data, a)
	if err != nil {
		return agentsdk.Result{}, err
	}
	// Recheck every local document after the remote request and filtering.
	if err = k.CheckDocumentSnapshots(ctx, b, source.KnowledgeDocumentSourceIdentity(), data, a); err != nil {
		return agentsdk.Result{}, liveKnowledgeResultAuthorization(err)
	}
	return out, nil
}
func (k *LibraryKnowledgeSource) DocumentReceipt(b LibraryKnowledgeBinding, source, op, q, id string, data DocumentEvidence, a agentsdk.Authority) (agentsdk.Result, error) {
	raw, err := json.Marshal(data)
	if err != nil || len(raw) > 640*1024 {
		return agentsdk.Result{}, conversationFailure("unavailable", "knowledge_context_exceeded")
	}
	out := agentsdk.Result{Provider: ManagedKnowledgeProvider, LibraryID: b.LibraryID, Operation: op, Query: q, DocumentID: id, SearchTopK: data.SearchTopK, SearchMode: data.SearchMode, SearchReranked: data.SearchReranked, SearchDegraded: data.SearchDegraded, Data: raw}
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
		out.Citations = append(out.Citations, agentsdk.Citation{ID: "kc_" + conversationDigest([]any{source, a.RuntimeID, a.WorkspaceID, a.UserID, b.LibraryID, op, q, id, data, i})[:32], Provider: ManagedKnowledgeProvider, LibraryID: b.LibraryID, Operation: op, DocumentID: p.DocumentID, PageID: p.PageID, PageVersion: p.PageVersion, ChunkID: p.ChunkID, DocumentVersion: p.DocumentVersion, ContentSHA256: p.ContentSHA256, SourceRevision: p.SourceRevision, Score: p.Score, Title: p.Title, URL: p.URL, Excerpt: excerpt, ExcerptTruncated: len(excerpt) < len(p.Content), Location: p.Location})
	}
	out.ScopeSHA256 = conversationDigest([]any{source, a.RuntimeID, a.WorkspaceID, a.UserID, out})
	return out, nil
}
func (k *LibraryKnowledgeSource) CheckDocumentSnapshots(ctx context.Context, b LibraryKnowledgeBinding, source string, data DocumentEvidence, a agentsdk.Authority) error {
	if _, err := k.Access(ctx, b.LibraryID, a); err != nil {
		return err
	}
	for _, snapshot := range data.Documents {
		r, err := k.ManagedDocument(ctx, b, source, snapshot.ID, a)
		if err != nil {
			return err
		}
		if snapshot.ContentVersion < 1 || snapshot.IndexGeneration < 1 || r.Document.ContentVersion != snapshot.ContentVersion || r.Document.IndexGeneration != snapshot.IndexGeneration || r.Document.SHA256 != snapshot.SHA256 {
			return conversationFailure("conflict", "knowledge_source_changed")
		}
		if r.PageProjection == nil {
			if snapshot.PageID != "" || snapshot.PageVersion != 0 || snapshot.AccessRevision != 0 || snapshot.PermissionID != "" {
				return conversationFailure("conflict", "knowledge_source_changed")
			}
		} else if snapshot.PageID != r.PageProjection.PageID || snapshot.PageVersion != r.PageProjection.Version || snapshot.AccessRevision != r.PageProjection.AccessRevision || snapshot.PermissionID != r.PageProjection.PermissionID {
			return conversationFailure("conflict", "knowledge_source_changed")
		}
	}
	return nil
}
func (k *LibraryKnowledgeSource) RevalidateManagedKnowledge(ctx context.Context, b LibraryKnowledgeBinding, source agentsdk.ManagedKnowledgeDocumentSource, saved agentsdk.Result, a agentsdk.Authority) error {
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
