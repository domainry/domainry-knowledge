package store

import (
	"context"
	"database/sql"
	"time"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
	"github.com/domainry/domainry-orm/query"
)

func (s *Store) requireKnowledgePageStateWrite(ctx context.Context, tx *sql.Tx, libraryID, pageID string, a agentsdk.Authority) error {
	access, err := s.evaluateKnowledgePageAccess(ctx, tx, libraryID, pageID, a)
	if err != nil || !access.Allowed || roleLevel(access.Role) < roleLevel("editor") {
		return conversationError("not_found", "page_not_found")
	}
	return nil
}

// activeKnowledgePageSubtree walks the union graph of draft and published
// parent edges. Edge kinds may alternate at every depth while drafts are being
// edited, so two independent tree walks are not sufficient.
func (s *Store) activeKnowledgePageSubtree(ctx context.Context, tx *sql.Tx, libraryID string, root knowledgesdk.KnowledgePage, a agentsdk.Authority) ([]knowledgesdk.KnowledgePage, error) {
	items := []knowledgesdk.KnowledgePage{root}
	seen := map[string]bool{root.ID: true}
	if err := s.requireKnowledgePageStateWrite(ctx, tx, libraryID, root.ID, a); err != nil {
		return nil, err
	}
	frontier := []string{root.ID}
	for len(frontier) > 0 {
		next := make([]string, 0)
		for start := 0; start < len(frontier); start += knowledgePageTraversalBatchSize {
			end := start + knowledgePageTraversalBatchSize
			if end > len(frontier) {
				end = len(frontier)
			}
			parents := make([]any, end-start)
			for index, parentID := range frontier[start:end] {
				parents[index] = parentID
			}
			afterPageID := ""
			for {
				predicates := []query.Predicate{
					query.Equal("scope_key", libraryScope(a)), query.Equal("library_id", libraryID), query.Equal("state", "active"),
					query.Or(query.In("parent_page_id", parents...), query.In("published_parent_page_id", parents...)),
				}
				if afterPageID != "" {
					predicates = append(predicates, query.GreaterThan("page_id", afterPageID))
				}
				statement, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgePageTable).
					Columns("payload_json", "page_id").Where(query.And(predicates...)).
					OrderBy(query.Ascending("page_id")).Limit(knowledgePageTraversalBatchSize).Build()
				if err != nil {
					return nil, err
				}
				rows, err := tx.QueryContext(ctx, statement, args...)
				if err != nil {
					return nil, err
				}
				batch := make([]knowledgesdk.KnowledgePage, 0, knowledgePageTraversalBatchSize)
				for rows.Next() {
					var raw []byte
					var pageID string
					if err = rows.Scan(&raw, &pageID); err != nil {
						_ = rows.Close()
						return nil, err
					}
					var page knowledgesdk.KnowledgePage
					if err = unmarshalDurableJSON(raw, &page); err != nil || page.ID != pageID {
						_ = rows.Close()
						if err != nil {
							return nil, err
						}
						return nil, conversationError("unavailable", "page_tree_identity_mismatch")
					}
					afterPageID = pageID
					batch = append(batch, page)
				}
				if err = rows.Err(); err != nil {
					_ = rows.Close()
					return nil, err
				}
				if err = rows.Close(); err != nil {
					return nil, err
				}
				for _, page := range batch {
					if seen[page.ID] {
						continue
					}
					if err = s.requireKnowledgePageStateWrite(ctx, tx, libraryID, page.ID, a); err != nil {
						return nil, err
					}
					seen[page.ID] = true
					items = append(items, page)
					next = append(next, page.ID)
					if len(items) > knowledgeLibraryMaximumPages {
						return nil, conversationError("unavailable", "page_tree_limit")
					}
				}
				if len(batch) < knowledgePageTraversalBatchSize {
					break
				}
			}
		}
		frontier = next
	}
	return items, nil
}

func (s *Store) replaceKnowledgePageArchiveMembers(ctx context.Context, tx *sql.Tx, libraryID, rootPageID string, pages []knowledgesdk.KnowledgePage, archivedAt time.Time, a agentsdk.Authority) error {
	for _, page := range pages {
		statement, args, err := query.NewDeleteBuilder(s.store.Renderer(), knowledgePageArchiveMemberTable).
			Where(pageScope(a, page.ID)).Build()
		if err = conversationExec(ctx, tx, statement, args, err); err != nil {
			return err
		}
		statement, args, err = query.NewInsertBuilder(s.store.Renderer(), knowledgePageArchiveMemberTable).
			Columns("scope_key", "library_id", "root_page_id", "page_id", "archived_at").
			Values(libraryScope(a), libraryID, rootPageID, page.ID, archivedAt.UnixMilli()).Build()
		if err = conversationExec(ctx, tx, statement, args, err); err != nil {
			return err
		}
	}
	return nil
}

func (s *Store) knowledgePageArchiveMemberIDs(ctx context.Context, tx *sql.Tx, libraryID, rootPageID string, a agentsdk.Authority) ([]string, error) {
	statement, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgePageArchiveMemberTable).
		Columns("page_id").
		Where(query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("library_id", libraryID), query.Equal("root_page_id", rootPageID))).
		OrderBy(query.Ascending("page_id")).Limit(knowledgeLibraryMaximumPages + 1).Build()
	if err != nil {
		return nil, err
	}
	rows, err := tx.QueryContext(ctx, statement, args...)
	if err != nil {
		return nil, err
	}
	ids := make([]string, 0)
	for rows.Next() {
		var pageID string
		if err = rows.Scan(&pageID); err != nil {
			_ = rows.Close()
			return nil, err
		}
		ids = append(ids, pageID)
	}
	if err = rows.Err(); err != nil {
		_ = rows.Close()
		return nil, err
	}
	if err = rows.Close(); err != nil {
		return nil, err
	}
	if len(ids) > knowledgeLibraryMaximumPages {
		return nil, conversationError("unavailable", "page_tree_limit")
	}
	return ids, nil
}

func (s *Store) deleteKnowledgePageArchiveMember(ctx context.Context, tx *sql.Tx, pageID string, a agentsdk.Authority) error {
	statement, args, err := query.NewDeleteBuilder(s.store.Renderer(), knowledgePageArchiveMemberTable).
		Where(pageScope(a, pageID)).Build()
	return conversationExec(ctx, tx, statement, args, err)
}

func (s *Store) archiveKnowledgePageRecord(ctx context.Context, tx *sql.Tx, page knowledgesdk.KnowledgePage, a agentsdk.Authority) (knowledgesdk.KnowledgePage, error) {
	page.State = "archived"
	page.ProjectionStatus = "none"
	if err := s.updatePage(ctx, tx, &page, page.Revision, a); err != nil {
		return page, err
	}
	if err := s.setKnowledgePageArchiveGovernance(ctx, tx, page, true, page.UpdatedAt, a); err != nil {
		return page, err
	}
	if err := s.resetKnowledgeCollaborationState(ctx, tx, page.ID, a); err != nil {
		return page, err
	}
	documentID, err := knowledgePageProjectionDocumentID(a, page.ID)
	if err != nil {
		return page, err
	}
	var projection persistence.KnowledgeDocumentRecord
	found, err := s.executionRead(ctx, tx, knowledgeDocumentTable, documentScope(a, documentID), &projection)
	if err != nil {
		return page, err
	}
	if found && projection.Document.State != "deleted" {
		if err = s.queueDocumentWork(ctx, tx, projection); err != nil {
			return page, err
		}
	}
	statement, args, err := query.NewDeleteBuilder(s.store.Renderer(), knowledgePageProjectionJobTable).
		Where(pageScope(a, page.ID)).Build()
	if err = conversationExec(ctx, tx, statement, args, err); err != nil {
		return page, err
	}
	if err = s.reconcileFilePageAttachments(ctx, tx, page, a); err != nil {
		return page, err
	}
	if err = s.reconcileDocumentPageAttachments(ctx, tx, page, a); err != nil {
		return page, err
	}
	return page, nil
}

func (s *Store) relocateKnowledgePageOnRestore(ctx context.Context, tx *sql.Tx, page *knowledgesdk.KnowledgePage, parentPageID, rank, requestKey, requestHash string, a agentsdk.Authority) error {
	if page.ParentPageID == parentPageID && page.Rank == rank {
		return nil
	}
	page.ParentPageID, page.Rank = parentPageID, rank
	var version *knowledgesdk.KnowledgePageVersion
	if page.PublishedVersion > 0 {
		current, err := s.pageVersion(ctx, tx, page.ID, page.PublishedVersion, a)
		if err != nil {
			return err
		}
		publishedParentID, err := s.publishedPageParentID(ctx, tx, page.LibraryID, parentPageID, a)
		if err != nil {
			return err
		}
		if parentPageID != "" && publishedParentID != parentPageID {
			return conversationError("conflict", "page_parent_unpublished")
		}
		next := current
		next.Version++
		next.ParentPageID, next.Rank = publishedParentID, rank
		next.PublishedByUserID = a.UserID
		next.PublishedAt = time.Now().UTC().Truncate(time.Millisecond)
		next.PublishNote = "Restored under a different parent"
		statement, args, err := query.NewInsertBuilder(s.store.Renderer(), knowledgePageVersionTable).
			Columns("scope_key", "page_id", "version", "library_id", "published_at", "payload_json").
			Values(libraryScope(a), page.ID, next.Version, page.LibraryID, next.PublishedAt.UnixMilli(), conversationJSON(next)).Build()
		if err = conversationExec(ctx, tx, statement, args, err); err != nil {
			return err
		}
		page.PublishedVersion = next.Version
		version = &next
	}
	draft, found, err := s.pageDraft(ctx, tx, page.ID, a)
	if err != nil {
		return err
	}
	if found {
		expected := draft.DraftRevision
		draft.DraftRevision++
		draft.ParentPageID, draft.Rank = parentPageID, rank
		if version != nil {
			draft.BasePublishedVersion = version.Version
		}
		draft.UpdatedByUserID = a.UserID
		draft.UpdatedAt = time.Now().UTC().Truncate(time.Millisecond)
		statement, args, buildErr := query.NewUpdateBuilder(s.store.Renderer(), knowledgePageDraftTable).
			Set("base_published_version", draft.BasePublishedVersion).
			Set("draft_revision", draft.DraftRevision).
			Set("updated_at", draft.UpdatedAt.UnixMilli()).
			Set("last_request_key", requestKey).
			Set("last_request_hash", requestHash).
			Set("payload_json", conversationJSON(draft)).
			Where(query.And(pageScope(a, page.ID), query.Equal("draft_revision", expected))).Build()
		if err = conversationCAS(ctx, tx, statement, args, buildErr); err != nil {
			return conversationError("conflict", "page_draft_revision_conflict")
		}
		if err = s.resetKnowledgeCollaborationState(ctx, tx, page.ID, a); err != nil {
			return err
		}
	}
	return nil
}

func (s *Store) restoreKnowledgePageRecord(ctx context.Context, tx *sql.Tx, page knowledgesdk.KnowledgePage, relocate bool, parentPageID, rank, requestKey, requestHash string, a agentsdk.Authority) (knowledgesdk.KnowledgePage, error) {
	if relocate {
		if err := s.relocateKnowledgePageOnRestore(ctx, tx, &page, parentPageID, rank, requestKey, requestHash, a); err != nil {
			return page, err
		}
	}
	page.State = "active"
	if page.PublishedVersion > 0 {
		page.ProjectionStatus, page.AccessStatus = "queued", "queued"
	}
	if err := s.updatePage(ctx, tx, &page, page.Revision, a); err != nil {
		return page, err
	}
	if relocate && page.PublishedVersion > 0 {
		statement, args, err := query.NewUpdateBuilder(s.store.Renderer(), knowledgePageTable).
			Set("published_parent_page_id", parentPageID).Set("published_rank", rank).
			Where(query.And(pageScope(a, page.ID), query.Equal("revision", page.Revision))).Build()
		if err = conversationCAS(ctx, tx, statement, args, err); err != nil {
			return page, conversationError("conflict", "page_revision_conflict")
		}
	}
	if err := s.setKnowledgePageArchiveGovernance(ctx, tx, page, false, page.UpdatedAt, a); err != nil {
		return page, err
	}
	if page.PublishedVersion > 0 {
		access, err := s.knowledgePageAccessPolicy(ctx, tx, page.LibraryID, page.ID, a)
		if err != nil {
			return page, err
		}
		access.ProjectionStatus, access.UpdatedAt, access.UpdatedByUserID = "queued", page.UpdatedAt, a.UserID
		statement, args, buildErr := query.NewUpdateBuilder(s.store.Renderer(), knowledgePageAccessTable).
			Set("projection_status", access.ProjectionStatus).Set("updated_at", access.UpdatedAt.UnixMilli()).Set("payload_json", conversationJSON(access)).
			Where(query.And(pageScope(a, page.ID), query.Equal("revision", access.Revision))).Build()
		if err = conversationCAS(ctx, tx, statement, args, buildErr); err != nil {
			return page, err
		}
		if err = s.queueCurrentPageProjection(ctx, tx, &page, access.Revision, a); err != nil {
			return page, err
		}
		statement, args, buildErr = query.NewUpdateBuilder(s.store.Renderer(), knowledgePageTable).
			Set("payload_json", conversationJSON(page)).
			Where(query.And(pageScope(a, page.ID), query.Equal("revision", page.Revision))).Build()
		if err = conversationCAS(ctx, tx, statement, args, buildErr); err != nil {
			return page, err
		}
	}
	if err := s.reconcileFilePageAttachments(ctx, tx, page, a); err != nil {
		return page, err
	}
	if err := s.reconcileDocumentPageAttachments(ctx, tx, page, a); err != nil {
		return page, err
	}
	return page, nil
}
