package store

import (
	"context"
	"database/sql"
	"time"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
	"github.com/domainry/domainry-orm/query"
)

func (s *Store) KnowledgeDatasourceBinding(ctx context.Context, scope agentsdk.KnowledgeDocumentStorageScope) (out persistence.KnowledgeDatasourceBinding, found bool, err error) {
	a := agentsdk.ConversationAuthority{Known: true, RuntimeID: scope.RuntimeID, WorkspaceID: scope.WorkspaceID, UserID: "_host"}
	if conversationAuthority(a) != nil || !CompatValidLibraryID(scope.LibraryID) {
		return out, false, conversationError("bad_request", "document_source_invalid")
	}
	found, err = s.executionRead(ctx, s.store.Database(), CompatKnowledgeSourceTable, query.And(compatKnowledgeSourcePredicate(a, scope.LibraryID), query.Equal("source_kind", compatKnowledgeDatasourceSourceKind)), &out)
	return
}
func (s *Store) BindKnowledgeDatasource(ctx context.Context, id string, in persistence.KnowledgeDatasourceAssignment, a agentsdk.ConversationAuthority) (out agentsdk.KnowledgeLibrary, err error) {
	if conversationAuthority(a) != nil || !CompatValidLibraryID(id) || !personalMemoryKey(in.DatasourceKey) || !CompatArtifactSHA(in.SourceID) || !CompatArtifactSHA(in.AccessPolicySHA256) || in.ExpectedRevision < 1 {
		return out, conversationError("bad_request", "datasource_binding_invalid")
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		var e error
		out, e = s.CompatLibrary(ctx, tx, id, a)
		if e != nil {
			return e
		}
		if out.Role != "manager" {
			return conversationError("forbidden", "library_manage_required")
		}
		if out.Archived {
			return conversationError("conflict", "library_archived")
		}
		var prior persistence.KnowledgeDatasourceBinding
		found, e := s.executionRead(ctx, tx, CompatKnowledgeSourceTable, query.And(compatKnowledgeSourcePredicate(a, id), query.Equal("source_kind", compatKnowledgeDatasourceSourceKind)), &prior)
		if e != nil {
			return e
		}
		if found {
			if prior.DatasourceKey != in.DatasourceKey || prior.SourceID != in.SourceID || prior.AccessPolicySHA256 != in.AccessPolicySHA256 {
				return conversationError("conflict", "datasource_already_bound")
			}
			return nil // Lost response recovery; never repeat the binding mutation.
		}
		if out.Revision != in.ExpectedRevision {
			return conversationError("conflict", "revision_conflict")
		}
		registered, e := s.CompatDocumentLibrarySource(ctx, tx, id, a)
		if e != nil {
			return e
		}
		if registered != "" {
			return conversationError("conflict", "datasource_already_bound")
		}
		claimed, e := s.compatKnowledgeSourceClaimed(ctx, tx, in.SourceID)
		if e != nil {
			return e
		}
		if claimed {
			return conversationError("conflict", "document_source_already_bound")
		}
		binding := persistence.KnowledgeDatasourceBinding{LibraryID: id, DatasourceKey: in.DatasourceKey, SourceID: in.SourceID, AccessPolicySHA256: in.AccessPolicySHA256, CreatedBy: a.UserID, CreatedAt: time.Now().UTC().Truncate(time.Millisecond)}
		q, args, e := query.NewInsertBuilder(s.store.Renderer(), CompatKnowledgeSourceTable).Columns("scope_key", "binding_key", "source_kind", "source_key", "payload_json").Values(CompatLibraryScope(a), id, compatKnowledgeDatasourceSourceKind, in.SourceID, conversationJSON(binding)).Build()
		if e = conversationExec(ctx, tx, q, args, e); e != nil {
			return e
		}
		return s.CompatSaveLibrary(ctx, tx, &out, in.ExpectedRevision, a)
	})
	return
}
func CompatDocumentScopeForLibrary(id string, a agentsdk.ConversationAuthority) agentsdk.KnowledgeDocumentStorageScope {
	return agentsdk.KnowledgeDocumentStorageScope{RuntimeID: a.RuntimeID, WorkspaceID: a.WorkspaceID, LibraryID: id}
}
