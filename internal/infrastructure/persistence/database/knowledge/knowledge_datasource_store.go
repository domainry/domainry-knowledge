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
			// Reconcile missing projections without changing the binding or
			// replacing any in-flight work after a lost response.
			return s.queueUnindexedLibraryPages(ctx, tx, id, a)
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
		if e = s.registerKnowledgePhysicalSource(ctx, tx, in.SourceID); e != nil {
			return e
		}
		binding := persistence.KnowledgeDatasourceBinding{LibraryID: id, DatasourceKey: in.DatasourceKey, SourceID: in.SourceID, AccessPolicySHA256: in.AccessPolicySHA256, CreatedBy: a.UserID, CreatedAt: time.Now().UTC().Truncate(time.Millisecond)}
		bindingKey := conversationHash([]string{"knowledge_datasource_binding", libraryScope(a), id, in.SourceID})
		q, args, e := query.NewInsertBuilder(s.store.Renderer(), knowledgeSourceTable).Columns("scope_key", "binding_key", "source_kind", "source_key", "payload_json").Values(libraryScope(a), id, knowledgeDatasourceSourceKind, bindingKey, conversationJSON(binding)).Build()
		if e = conversationExec(ctx, tx, q, args, e); e != nil {
			return e
		}
		if e = s.saveLibraryRecord(ctx, tx, &out, in.ExpectedRevision, a); e != nil {
			return e
		}
		return s.queueUnindexedLibraryPages(ctx, tx, id, a)
	})
	return
}

// Binding a source must include pages published while the library was local.
// Keep their published snapshots and ACL revisions; drafts never enter this queue.
func (s *Store) queueUnindexedLibraryPages(ctx context.Context, tx *sql.Tx, id string, a agentsdk.Authority) error {
	q, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgePageTable).Columns("payload_json").
		Where(query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("library_id", id), query.Equal("state", "active"), query.GreaterThan("published_version", 0))).Build()
	if err != nil {
		return err
	}
	rows, err := tx.QueryContext(ctx, q, args...)
	if err != nil {
		return err
	}
	var pages []agentsdk.KnowledgePage
	for rows.Next() {
		var raw []byte
		var page agentsdk.KnowledgePage
		if err = rows.Scan(&raw); err == nil {
			err = unmarshalDurableJSON(raw, &page)
		}
		if err != nil {
			break
		}
		if page.ProjectionStatus == "none" {
			pages = append(pages, page)
		}
	}
	iterationErr := rows.Err()
	closeErr := rows.Close()
	if err != nil {
		return err
	}
	if iterationErr != nil {
		return iterationErr
	}
	if closeErr != nil {
		return closeErr
	}
	for _, page := range pages {
		access, err := s.knowledgePageAccessPolicy(ctx, tx, id, page.ID, a)
		if err != nil {
			return err
		}
		if err = s.queueCurrentPageProjection(ctx, tx, &page, access.Revision, a); err != nil {
			return err
		}
		if err = s.setPageProjectionStatus(ctx, tx, page, "queued", access.Revision, a); err != nil {
			return err
		}
	}
	return nil
}

func documentScopeForLibrary(id string, a agentsdk.Authority) agentsdk.KnowledgeDocumentStorageScope {
	return agentsdk.KnowledgeDocumentStorageScope{RuntimeID: a.RuntimeID, WorkspaceID: a.WorkspaceID, LibraryID: id}
}
