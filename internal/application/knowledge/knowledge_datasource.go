package application

import (
	"context"
	"encoding/hex"
	"errors"
	"slices"
	"strings"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
)

func (s *Service) DatasourceAccess(ctx context.Context, id, op string, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeLibrary, error) {
	repo, err := s.LibraryAccess(ctx, op, a)
	if err != nil {
		return agentsdk.KnowledgeLibrary{}, err
	}
	library, err := repo.KnowledgeLibrary(ctx, id, a)
	if err != nil {
		return library, err
	}
	if library.Role != "manager" {
		return agentsdk.KnowledgeLibrary{}, conversationFailure("forbidden", "library_manage_required")
	}
	if op == "libraries_bind_source" && library.Archived {
		return agentsdk.KnowledgeLibrary{}, conversationFailure("conflict", "library_archived")
	}
	if err = s.LibraryAuthorize(ctx, op, library, a); err != nil {
		return agentsdk.KnowledgeLibrary{}, err
	}
	return library, nil
}
func DatasourceIdentity(value string) bool {
	raw, err := hex.DecodeString(value)
	return err == nil && len(raw) == 32 && value == strings.ToLower(value)
}
func (s *Service) DatasourceDefinitions(ctx context.Context, library string, a agentsdk.ConversationAuthority) ([]agentsdk.KnowledgeDatasourceDefinition, error) {
	if s.options.KnowledgeDatasources == nil {
		return []agentsdk.KnowledgeDatasourceDefinition{}, nil
	}
	items, err := s.options.KnowledgeDatasources.KnowledgeDatasources(ctx, DocumentStorageScope(library, a))
	if err != nil {
		return nil, conversationFailure("unavailable", "datasources_unavailable")
	}
	if len(items) > 1000 {
		return nil, conversationFailure("unavailable", "datasources_invalid")
	}
	seen, seenSource := map[string]bool{}, map[string]bool{}
	items = slices.Clone(items)
	for _, item := range items {
		if !conversationKey(item.Key) || !conversationText(item.Name, 128, true) || !conversationText(item.Description, 1024, false) || !DatasourceIdentity(item.SourceID) || seen[item.Key] || seenSource[item.SourceID] {
			return nil, conversationFailure("unavailable", "datasources_invalid")
		}
		seen[item.Key], seenSource[item.SourceID] = true, true
	}
	slices.SortFunc(items, func(a, b agentsdk.KnowledgeDatasourceDefinition) int { return strings.Compare(a.Key, b.Key) })
	return items, nil
}
func (s *Service) KnowledgeLibrarySources(ctx context.Context, id, after string, limit int, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeLibrarySources, error) {
	var zero agentsdk.KnowledgeLibrarySources
	library, err := s.DatasourceAccess(ctx, id, "libraries_sources", a)
	if err != nil {
		return zero, err
	}
	if limit == 0 {
		limit = 20
	}
	if limit < 1 || limit > 50 || after != "" && !conversationKey(after) {
		return zero, conversationFailure("bad_request", "datasource_query_invalid")
	}
	repo, ok := s.repo.(persistence.KnowledgeDatasourceRepository)
	if !ok {
		return zero, conversationFailure("unavailable", "datasources_unavailable")
	}
	current, found, err := repo.KnowledgeDatasourceBinding(ctx, DocumentStorageScope(id, a))
	if err != nil {
		return zero, err
	}
	out := agentsdk.KnowledgeLibrarySources{LibraryID: id, Revision: library.Revision, Status: "unbound", Items: []agentsdk.KnowledgeDatasourceChoice{}, Complete: true}
	bindErr := s.LibraryAuthorize(ctx, "libraries_bind_source", library, a)
	if bindErr != nil {
		var coded *agentsdk.Error
		if !errors.As(bindErr, &coded) || coded.Class != "forbidden" {
			return zero, bindErr
		}
	}
	out.CanBind = bindErr == nil && !library.Archived && s.options.DocumentStorage != nil
	static := false
	if resolver, ok := s.options.Knowledge.(*LibraryKnowledgeSource); ok {
		_, static = resolver.bindings[conversationDigest([]string{a.WorkspaceID, id})]
		if found {
			out.CurrentKey = current.DatasourceKey
			out.Status = "unavailable"
			_, available, e := resolver.Binding(ctx, id, a)
			if e != nil {
				return zero, e
			}
			if available {
				out.Status = "connected"
			}
		}
	}
	if found && out.CurrentKey == "" {
		out.CurrentKey = current.DatasourceKey
		out.Status = "unavailable"
	}
	if static && !found {
		out.Status = "host_managed"
	}
	definitions, err := s.DatasourceDefinitions(ctx, id, a)
	if err != nil {
		return zero, err
	}
	documents, ok := s.repo.(persistence.KnowledgeDocumentRepository)
	if !ok {
		return zero, conversationFailure("unavailable", "datasources_unavailable")
	}
	for _, definition := range definitions {
		if definition.Key <= after {
			continue
		}
		if len(out.Items) == limit {
			out.Complete = false
			out.NextAfter = out.Items[len(out.Items)-1].Key
			break
		}
		used, e := documents.KnowledgeSourceManaged(ctx, definition.SourceID)
		if e != nil {
			return zero, e
		}
		out.Items = append(out.Items, agentsdk.KnowledgeDatasourceChoice{Key: definition.Key, Name: definition.Name, Description: definition.Description, Available: !found && !static && !used && out.CanBind})
	}
	currentLibrary, err := s.DatasourceAccess(ctx, id, "libraries_sources", a)
	if err != nil {
		return zero, err
	}
	if currentLibrary.Revision != library.Revision {
		return zero, conversationFailure("conflict", "revision_conflict")
	}
	return out, nil
}
func (s *Service) BindKnowledgeLibrarySource(ctx context.Context, id string, in agentsdk.KnowledgeLibrarySourceWrite, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeLibrary, error) {
	var zero agentsdk.KnowledgeLibrary
	if !conversationKey(in.DatasourceKey) || in.ExpectedRevision < 1 {
		return zero, conversationFailure("bad_request", "datasource_binding_invalid")
	}
	if _, err := s.DatasourceAccess(ctx, id, "libraries_bind_source", a); err != nil {
		return zero, err
	}
	if s.options.DocumentStorage == nil || s.options.KnowledgeDatasources == nil {
		return zero, conversationFailure("unavailable", "datasources_unavailable")
	}
	resolver, ok := s.options.Knowledge.(*LibraryKnowledgeSource)
	if !ok {
		return zero, conversationFailure("unavailable", "datasources_unavailable")
	}
	if _, static := resolver.bindings[conversationDigest([]string{a.WorkspaceID, id})]; static {
		return zero, conversationFailure("conflict", "datasource_already_bound")
	}
	definitions, err := s.DatasourceDefinitions(ctx, id, a)
	if err != nil {
		return zero, err
	}
	var definition agentsdk.KnowledgeDatasourceDefinition
	for _, d := range definitions {
		if d.Key == in.DatasourceKey {
			definition = d
			break
		}
	}
	if definition.Key == "" {
		return zero, conversationFailure("not_found", "datasource_not_found")
	}
	source, err := s.options.KnowledgeDatasources.OpenKnowledgeDatasource(ctx, in.DatasourceKey, DocumentStorageScope(id, a))
	if err != nil || source == nil || source.KnowledgeDocumentSourceIdentity() != definition.SourceID || !DatasourceIdentity(DocumentAccessPolicy(source)) || source.KnowledgeDocumentManagementReady() != nil || source.KnowledgeDocumentMaxBytes() < 1 {
		return zero, conversationFailure("unavailable", "datasource_unavailable")
	}
	if _, err = s.DatasourceAccess(ctx, id, "libraries_bind_source", a); err != nil {
		return zero, err
	}
	repo, ok := s.repo.(persistence.KnowledgeDatasourceRepository)
	if !ok {
		return zero, conversationFailure("unavailable", "datasources_unavailable")
	}
	_, err = repo.BindKnowledgeDatasource(ctx, id, persistence.KnowledgeDatasourceAssignment{DatasourceKey: in.DatasourceKey, SourceID: definition.SourceID, AccessPolicySHA256: DocumentAccessPolicy(source), ExpectedRevision: in.ExpectedRevision}, a)
	if err != nil {
		return zero, err
	}
	library, err := s.DatasourceAccess(ctx, id, "libraries_bind_source", a)
	return s.LibraryResult(ctx, library, err, a)
}

var _ agentsdk.KnowledgeDatasourceService = (*Service)(nil)
