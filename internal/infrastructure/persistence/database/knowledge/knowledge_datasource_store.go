package store

import (
	"context"
	"database/sql"
	"time"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
	"github.com/domainry/domainry-orm/query"
)

func (s *Store) KnowledgeDatasourceBinding(ctx context.Context, scope agentsdk.KnowledgeDocumentStorageScope) (out persistence.KnowledgeDatasourceBinding, found bool, err error) {
	a := agentsdk.Authority{Known: true, RuntimeID: scope.RuntimeID, WorkspaceID: scope.WorkspaceID, UserID: "_host"}
	if conversationAuthority(a) != nil || !validLibraryID(scope.LibraryID) {
		return out, false, conversationError("bad_request", "document_source_invalid")
	}
	found, err = s.executionRead(ctx, s.store.Database(), knowledgeSourceTable, query.And(knowledgeSourcePredicate(a, scope.LibraryID), query.Equal("source_kind", knowledgeDatasourceSourceKind)), &out)
	return
}
func (s *Store) BindKnowledgeDatasource(ctx context.Context, id string, in persistence.KnowledgeDatasourceAssignment, a agentsdk.Authority) (out agentsdk.KnowledgeLibrary, err error) {
	if conversationAuthority(a) != nil || !validLibraryID(id) || !personalMemoryKey(in.DatasourceKey) || !validArtifactSHA(in.SourceID) || !validArtifactSHA(in.AccessPolicySHA256) || in.ExpectedRevision < 1 {
		return out, conversationError("bad_request", "datasource_binding_invalid")
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		var e error
		out, e = s.libraryRecord(ctx, tx, id, a)
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
		found, e := s.executionRead(ctx, tx, knowledgeSourceTable, query.And(knowledgeSourcePredicate(a, id), query.Equal("source_kind", knowledgeDatasourceSourceKind)), &prior)
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
		registered, e := s.documentLibrarySource(ctx, tx, id, a)
		if e != nil {
			return e
		}
		if registered != "" {
			return conversationError("conflict", "datasource_already_bound")
		}
		claimed, e := s.knowledgeSourceClaimed(ctx, tx, in.SourceID)
		if e != nil {
			return e
		}
		if claimed {
			return conversationError("conflict", "document_source_already_bound")
		}
		binding := persistence.KnowledgeDatasourceBinding{LibraryID: id, DatasourceKey: in.DatasourceKey, SourceID: in.SourceID, AccessPolicySHA256: in.AccessPolicySHA256, CreatedBy: a.UserID, CreatedAt: time.Now().UTC().Truncate(time.Millisecond)}
		q, args, e := query.NewInsertBuilder(s.store.Renderer(), knowledgeSourceTable).Columns("scope_key", "binding_key", "source_kind", "source_key", "payload_json").Values(libraryScope(a), id, knowledgeDatasourceSourceKind, in.SourceID, conversationJSON(binding)).Build()
		if e = conversationExec(ctx, tx, q, args, e); e != nil {
			return e
		}
		return s.saveLibraryRecord(ctx, tx, &out, in.ExpectedRevision, a)
	})
	return
}
func documentScopeForLibrary(id string, a agentsdk.Authority) agentsdk.KnowledgeDocumentStorageScope {
	return agentsdk.KnowledgeDocumentStorageScope{RuntimeID: a.RuntimeID, WorkspaceID: a.WorkspaceID, LibraryID: id}
}
