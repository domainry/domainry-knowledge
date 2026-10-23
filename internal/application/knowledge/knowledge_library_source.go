package application

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/contract"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
)

// Bindings are trusted host configuration, never browser or model input. Each
// Binding must own an isolated remote knowledge source. In particular, team-
// visible documents in a shared remote KB cannot isolate two different libraries.
type LibraryKnowledgeBinding = contract.LibraryKnowledgeBinding

// liveKnowledgeResultAuthorizationFailure marks a permission/source check that
// failed after a remote knowledge call had already started. Callers must not
// downgrade it to a model-visible tool error because an earlier result from the
// same live operation may already be present in the model context.
type liveKnowledgeResultAuthorizationFailure struct{ cause error }

func (e *liveKnowledgeResultAuthorizationFailure) Error() string                        { return e.cause.Error() }
func (e *liveKnowledgeResultAuthorizationFailure) Unwrap() error                        { return e.cause }
func (*liveKnowledgeResultAuthorizationFailure) ConversationResultAuthorizationFailed() {}

func liveKnowledgeResultAuthorization(err error) error {
	if err == nil {
		return nil
	}
	return &liveKnowledgeResultAuthorizationFailure{cause: err}
}

type LibraryKnowledgeSource struct {
	repo          persistence.KnowledgeLibraryRepository
	policy        agentsdk.KnowledgeLibraryAuthorizer
	sourcePolicy  agentsdk.KnowledgeDocumentSourceAuthorizer
	bindings      map[string]LibraryKnowledgeBinding
	defaultSource contract.Knowledge
	runtimeID     string
	documents     persistence.KnowledgeDocumentRepository
	catalog       agentsdk.KnowledgeDatasourceCatalog
	datasources   persistence.KnowledgeDatasourceRepository
}

func NewLibraryKnowledgeSource(repo any, runtimeID string, policy agentsdk.KnowledgeLibraryAuthorizer, sourcePolicy agentsdk.KnowledgeDocumentSourceAuthorizer, bindings []LibraryKnowledgeBinding, defaultSource contract.Knowledge, catalog agentsdk.KnowledgeDatasourceCatalog) (*LibraryKnowledgeSource, error) {
	libraries, ok := repo.(persistence.KnowledgeLibraryRepository)
	if !ok || policy == nil || len(bindings) == 0 && catalog == nil || len(bindings) > 1000 {
		return nil, fmt.Errorf("library retrieval requires library persistence, live authorization and at most 1000 host bindings")
	}
	out := &LibraryKnowledgeSource{repo: libraries, policy: policy, sourcePolicy: sourcePolicy, bindings: map[string]LibraryKnowledgeBinding{}, defaultSource: defaultSource, runtimeID: runtimeID}
	out.documents, _ = repo.(persistence.KnowledgeDocumentRepository)
	out.catalog = catalog
	out.datasources, _ = repo.(persistence.KnowledgeDatasourceRepository)
	if catalog != nil && (out.datasources == nil || out.documents == nil) {
		return nil, fmt.Errorf("datasource catalog requires Binding and document persistence")
	}
	for _, Binding := range bindings {
		if !conversationText(Binding.WorkspaceID, 255, true) || knowledgesdk.ValidateKnowledgeEntityID("klib", Binding.LibraryID) != nil || !conversationKey(Binding.LibraryID) || Binding.Source == nil {
			return nil, fmt.Errorf("invalid library knowledge Binding")
		}
		key := conversationDigest([]string{Binding.WorkspaceID, Binding.LibraryID})
		if _, exists := out.bindings[key]; exists {
			return nil, fmt.Errorf("duplicate library knowledge Binding")
		}
		out.bindings[key] = Binding
		if Binding.ManageDocuments {
			source, ok := Binding.Source.(agentsdk.ManagedKnowledgeDocumentSource)
			if !ok || out.documents == nil || source.KnowledgeDocumentManagementReady() != nil {
				return nil, fmt.Errorf("managed library requires document persistence and an isolated document provider with explicit field mappings")
			}
		}
	}
	return out, nil
}
func (k *LibraryKnowledgeSource) Configured(ctx context.Context, id string, a agentsdk.Authority) (bool, error) {
	_, ok, err := k.Binding(ctx, id, a)
	return ok, err
}

// ManagedDocumentsConfigured reports host intent without requiring the remote
// provider to be healthy. Workers use this distinction to avoid retrying local-
// only libraries forever while still retrying a configured provider that is
// temporarily unavailable.
func (k *LibraryKnowledgeSource) ManagedDocumentsConfigured(ctx context.Context, id string, a agentsdk.Authority) (bool, error) {
	if a.RuntimeID != k.runtimeID {
		return false, nil
	}
	if static, ok := k.bindings[conversationDigest([]string{a.WorkspaceID, id})]; ok {
		return static.ManageDocuments, nil
	}
	if k.datasources == nil {
		return false, nil
	}
	_, found, err := k.datasources.KnowledgeDatasourceBinding(ctx, DocumentStorageScope(id, a))
	return found, err
}

func (k *LibraryKnowledgeSource) Binding(ctx context.Context, id string, a agentsdk.Authority) (LibraryKnowledgeBinding, bool, error) {
	if a.RuntimeID != k.runtimeID {
		return LibraryKnowledgeBinding{}, false, nil
	}
	static, ok := k.bindings[conversationDigest([]string{a.WorkspaceID, id})]
	if k.datasources == nil {
		return static, ok, nil
	}
	stored, found, err := k.datasources.KnowledgeDatasourceBinding(ctx, DocumentStorageScope(id, a))
	if err != nil {
		return LibraryKnowledgeBinding{}, false, err
	}
	if !found {
		return static, ok, nil
	}
	// Never replace a persisted dynamic Binding with a startup-only alias.
	if ok || k.catalog == nil {
		return LibraryKnowledgeBinding{}, false, nil
	}
	source, err := k.catalog.OpenKnowledgeDatasource(ctx, stored.DatasourceKey, DocumentStorageScope(id, a))
	if err != nil || source == nil || source.KnowledgeDocumentSourceIdentity() != stored.SourceID || DocumentAccessPolicy(source) != stored.AccessPolicySHA256 || source.KnowledgeDocumentManagementReady() != nil {
		return LibraryKnowledgeBinding{}, false, nil
	}
	return LibraryKnowledgeBinding{WorkspaceID: a.WorkspaceID, LibraryID: id, Source: source, ManageDocuments: true}, true, nil
}
func (k *LibraryKnowledgeSource) Access(ctx context.Context, id string, a agentsdk.Authority) (LibraryKnowledgeBinding, error) {
	if !a.Known || a.RuntimeID != k.runtimeID {
		return LibraryKnowledgeBinding{}, conversationFailure("forbidden", "knowledge_access_denied")
	}
	library, err := k.repo.KnowledgeLibrary(ctx, id, a)
	if err != nil {
		return LibraryKnowledgeBinding{}, LibraryKnowledgeAccessError(err)
	}
	if library.Archived {
		return LibraryKnowledgeBinding{}, conversationFailure("forbidden", "knowledge_access_denied")
	}
	if err = k.policy.AuthorizeKnowledgeLibrary(ctx, knowledgesdk.ActionLibrariesGet, library, a); err != nil {
		return LibraryKnowledgeBinding{}, LibraryKnowledgeAccessError(err)
	}
	Binding, ok, err := k.Binding(ctx, id, a)
	if err != nil {
		return LibraryKnowledgeBinding{}, err
	}
	if !ok {
		return LibraryKnowledgeBinding{}, conversationFailure("forbidden", "knowledge_access_denied")
	}
	return Binding, nil
}
func LibraryKnowledgeAccessError(err error) error {
	var coded *agentsdk.Error
	if errors.As(err, &coded) && (coded.Class == "forbidden" || coded.Class == "not_found") {
		return conversationFailure("forbidden", "knowledge_access_denied")
	}
	return err
}
func (k *LibraryKnowledgeSource) SearchKnowledge(ctx context.Context, q string, a agentsdk.Authority) (agentsdk.Result, error) {
	if k.defaultSource == nil {
		return agentsdk.Result{}, conversationFailure("bad_request", "knowledge_library_required")
	}
	return k.defaultSource.SearchKnowledge(ctx, q, a)
}
func (k *LibraryKnowledgeSource) ReadKnowledge(ctx context.Context, id string, a agentsdk.Authority) (agentsdk.Result, error) {
	if k.defaultSource == nil {
		return agentsdk.Result{}, conversationFailure("bad_request", "knowledge_library_required")
	}
	return k.defaultSource.ReadKnowledge(ctx, id, a)
}
func (k *LibraryKnowledgeSource) SearchLibraryKnowledge(ctx context.Context, id, q string, a agentsdk.Authority) (agentsdk.Result, error) {
	Binding, err := k.Access(ctx, id, a)
	if err != nil {
		return agentsdk.Result{}, err
	}
	source, managed, err := k.ManagedSource(ctx, Binding, a)
	if err != nil {
		return agentsdk.Result{}, err
	}
	if managed {
		return k.ManagedKnowledge(ctx, Binding, source, "search", q, "", a)
	}
	evidence, err := Binding.Source.SearchKnowledge(ctx, q, a)
	if err != nil {
		return agentsdk.Result{}, err
	}
	if evidence.Operation != "search" || evidence.Query != q || evidence.DocumentID != "" {
		return agentsdk.Result{}, conversationFailure("unavailable", "knowledge_response_invalid")
	}
	return k.Wrap(ctx, id, evidence, a)
}
func (k *LibraryKnowledgeSource) ReadLibraryKnowledge(ctx context.Context, id, doc string, a agentsdk.Authority) (agentsdk.Result, error) {
	Binding, err := k.Access(ctx, id, a)
	if err != nil {
		return agentsdk.Result{}, err
	}
	source, managed, err := k.ManagedSource(ctx, Binding, a)
	if err != nil {
		return agentsdk.Result{}, err
	}
	if managed {
		return k.ManagedKnowledge(ctx, Binding, source, "fetch", "", doc, a)
	}
	evidence, err := Binding.Source.ReadKnowledge(ctx, doc, a)
	if err != nil {
		return agentsdk.Result{}, err
	}
	if evidence.Operation != "fetch" || evidence.DocumentID != doc || evidence.Query != "" {
		return agentsdk.Result{}, conversationFailure("unavailable", "knowledge_response_invalid")
	}
	return k.Wrap(ctx, id, evidence, a)
}
func (k *LibraryKnowledgeSource) Wrap(ctx context.Context, id string, evidence agentsdk.Result, a agentsdk.Authority) (agentsdk.Result, error) {
	Binding, err := k.Access(ctx, id, a)
	if err != nil {
		return agentsdk.Result{}, liveKnowledgeResultAuthorization(err)
	}
	if _, managed, err := k.ManagedSource(ctx, Binding, a); err != nil {
		return agentsdk.Result{}, liveKnowledgeResultAuthorization(err)
	} else if managed {
		return agentsdk.Result{}, liveKnowledgeResultAuthorization(conversationFailure("conflict", "knowledge_source_changed"))
	}
	if evidence.LibraryID != "" {
		return agentsdk.Result{}, conversationFailure("unavailable", "knowledge_response_invalid")
	}
	evidence.LibraryID = id
	evidence.Citations = append([]agentsdk.Citation(nil), evidence.Citations...)
	for i := range evidence.Citations {
		if evidence.Citations[i].LibraryID != "" {
			return agentsdk.Result{}, conversationFailure("unavailable", "knowledge_response_invalid")
		}
		evidence.Citations[i].LibraryID = id
	}
	return evidence, nil
}
func (k *LibraryKnowledgeSource) ListKnowledgeLibraries(ctx context.Context, after string, limit int, a agentsdk.Authority) (agentsdk.Result, error) {
	if !a.Known || a.RuntimeID != k.runtimeID {
		return agentsdk.Result{}, conversationFailure("forbidden", "knowledge_access_denied")
	}
	load := func(pageLimit int) (agentsdk.KnowledgeLibraryPage, []byte, error) {
		page, err := k.repo.KnowledgeLibraries(ctx, after, pageLimit, a)
		if err != nil {
			return agentsdk.KnowledgeLibraryPage{}, nil, err
		}
		items := []agentsdk.KnowledgeLibrary{}
		for _, item := range page.Items {
			configured, configuredErr := k.Configured(ctx, item.ID, a)
			if configuredErr != nil {
				return agentsdk.KnowledgeLibraryPage{}, nil, configuredErr
			}
			if !configured || item.Archived {
				continue
			}
			_, accessErr := k.Access(ctx, item.ID, a)
			if accessErr != nil {
				var coded *agentsdk.Error
				if errors.As(accessErr, &coded) && coded.Class == "forbidden" {
					continue
				}
				return agentsdk.KnowledgeLibraryPage{}, nil, accessErr
			}
			item.KnowledgeConfigured = true
			items = append(items, item)
		}
		page.Items = items
		data, marshalErr := json.Marshal(page)
		return page, data, marshalErr
	}
	page, data, err := load(limit)
	if err != nil {
		return agentsdk.Result{}, err
	}
	for len(data) > 48*1024 && len(page.Items) > 1 {
		page, data, err = load(len(page.Items) - 1)
		if err != nil {
			return agentsdk.Result{}, err
		}
	}
	query, _ := json.Marshal(struct {
		After string `json:"after"`
		Limit int    `json:"limit"`
	}{after, limit})
	return agentsdk.Result{Provider: "agent_libraries", Operation: "libraries", Query: string(query), ScopeSHA256: k.CatalogScope(data, a), Data: data}, nil
}
func (k *LibraryKnowledgeSource) CatalogScope(data []byte, a agentsdk.Authority) string {
	decoder := json.NewDecoder(bytes.NewReader(data))
	decoder.UseNumber()
	var value any
	if decoder.Decode(&value) != nil {
		return ""
	}
	return conversationDigest([]any{k.runtimeID, a.WorkspaceID, a.UserID, value})
}
func (k *LibraryKnowledgeSource) RevalidateKnowledge(ctx context.Context, saved agentsdk.Result, a agentsdk.Authority) error {
	return k.revalidateKnowledge(ctx, saved, a)
}

func (k *LibraryKnowledgeSource) AuthorizeKnowledgeResultRead(ctx context.Context, saved agentsdk.Result, a agentsdk.Authority) error {
	if err := k.revalidateKnowledge(ctx, saved, a); err != nil {
		return err
	}
	if saved.Provider != ManagedKnowledgeProvider || saved.LibraryID == "" {
		if saved.LibraryID == "" {
			if authorizer, ok := k.defaultSource.(knowledgesdk.ResultReadAuthorizer); ok {
				return authorizer.AuthorizeKnowledgeResultRead(ctx, saved, a)
			}
		}
		return nil
	}
	library, err := k.repo.KnowledgeLibrary(ctx, saved.LibraryID, a)
	if err != nil {
		return LibraryKnowledgeAccessError(err)
	}
	if err = k.policy.AuthorizeKnowledgeLibrary(ctx, knowledgesdk.ActionLibrariesList, library, a); err != nil {
		return err
	}
	return k.policy.AuthorizeKnowledgeLibrary(ctx, knowledgesdk.ActionDocumentsDownload, library, a)
}

func (k *LibraryKnowledgeSource) revalidateKnowledge(ctx context.Context, saved agentsdk.Result, a agentsdk.Authority) error {
	if saved.Operation == "libraries" {
		var args struct {
			After string `json:"after"`
			Limit int    `json:"limit"`
		}
		if json.Unmarshal([]byte(saved.Query), &args) != nil {
			return conversationFailure("unavailable", "knowledge_response_invalid")
		}
		if !a.Known || a.RuntimeID != k.runtimeID || saved.Provider != "agent_libraries" || saved.LibraryID != "" || saved.KBID != "" || saved.DocumentID != "" || len(saved.Citations) != 0 || saved.ScopeSHA256 == "" || saved.ScopeSHA256 != k.CatalogScope(saved.Data, a) {
			return conversationFailure("forbidden", "knowledge_access_denied")
		}
		var page agentsdk.KnowledgeLibraryPage
		if len(saved.Data) > 64*1024 || json.Unmarshal(saved.Data, &page) != nil || len(page.Items) > 50 {
			return conversationFailure("unavailable", "knowledge_response_invalid")
		}
		seen := map[string]bool{}
		for _, item := range page.Items {
			if seen[item.ID] {
				return conversationFailure("unavailable", "knowledge_response_invalid")
			}
			seen[item.ID] = true
			if _, err := k.Access(ctx, item.ID, a); err != nil {
				return err
			}
		}
		// This is a historical catalog snapshot. Renaming a library, adding
		// unrelated members or restoring a reader must not rewrite that snapshot
		// or prevent resuming it when every referenced library is readable again.
		return nil
	}
	if saved.LibraryID == "" {
		if k.defaultSource == nil {
			return conversationFailure("forbidden", "knowledge_access_denied")
		}
		return k.defaultSource.RevalidateKnowledge(ctx, saved, a)
	}
	Binding, err := k.Access(ctx, saved.LibraryID, a)
	if err != nil {
		return err
	}
	source, managed, err := k.ManagedSource(ctx, Binding, a)
	if err != nil {
		return err
	}
	if managed {
		return k.RevalidateManagedKnowledge(ctx, Binding, source, saved, a)
	}
	if saved.Provider == ManagedKnowledgeProvider {
		return conversationFailure("forbidden", "knowledge_access_denied")
	}
	inner := saved
	inner.LibraryID = ""
	inner.Citations = append([]agentsdk.Citation(nil), saved.Citations...)
	for i := range inner.Citations {
		if inner.Citations[i].LibraryID != saved.LibraryID {
			return conversationFailure("unavailable", "knowledge_response_invalid")
		}
		inner.Citations[i].LibraryID = ""
	}
	err = Binding.Source.RevalidateKnowledge(ctx, inner, a)
	if err != nil {
		return err
	}
	if _, err = k.Access(ctx, saved.LibraryID, a); err != nil {
		return err
	}
	_, managed, err = k.ManagedSource(ctx, Binding, a)
	if err != nil {
		return err
	}
	if managed {
		return conversationFailure("conflict", "knowledge_source_changed")
	}
	return nil
}

var _ contract.Knowledge = (*LibraryKnowledgeSource)(nil)
var _ knowledgesdk.ResultReadAuthorizer = (*LibraryKnowledgeSource)(nil)
