package store

import (
	"context"
	"database/sql"
	"encoding/json"
	"sort"
	"time"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
	"github.com/domainry/domainry-orm/query"
)

// knowledgePageTransferSubtree returns the union of the draft/current and
// published hierarchies. A page can be moved in a draft before its published
// path changes; transferring only one tree would leave the other tree visible
// in the source Library.
func (s *Store) knowledgePageTransferSubtree(ctx context.Context, tx *sql.Tx, libraryID, rootPageID string, a agentsdk.Authority) ([]knowledgesdk.KnowledgePage, error) {
	root, err := s.pageRecord(ctx, tx, libraryID, rootPageID, a)
	if err != nil {
		return nil, err
	}
	if root.State != "active" {
		return nil, conversationError("conflict", "page_archived")
	}
	byID := map[string]knowledgesdk.KnowledgePage{root.ID: root}
	visit := func(page knowledgesdk.KnowledgePage, _ string) error {
		byID[page.ID] = page
		return nil
	}
	for _, options := range []knowledgePageDescendantQuery{
		{parentColumn: "parent_page_id", activeOnly: true},
		{parentColumn: "published_parent_page_id", activeOnly: true, publishedOnly: true},
	} {
		if err = s.visitKnowledgePageDescendants(ctx, tx, libraryID, rootPageID, options, a, visit); err != nil {
			return nil, err
		}
	}
	pages := make([]knowledgesdk.KnowledgePage, 0, len(byID))
	pages = append(pages, root)
	ids := make([]string, 0, len(byID)-1)
	for id := range byID {
		if id != rootPageID {
			ids = append(ids, id)
		}
	}
	sort.Strings(ids)
	for _, id := range ids {
		pages = append(pages, byID[id])
	}
	return pages, nil
}

func (s *Store) rejectUnsupportedPageTransferContent(ctx context.Context, tx *sql.Tx, pages []knowledgesdk.KnowledgePage, a agentsdk.Authority) error {
	for _, page := range pages {
		// A File Page and an attachment own an immutable original in the source
		// Library. Moving that original is a separate durable document transfer;
		// silently retaining a cross-Library reference would bypass isolation.
		if page.ContentType == knowledgesdk.KnowledgePageTypeFile {
			return conversationError("conflict", "page_transfer_document_required")
		}
		q, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgePageAttachmentTable).
			Projections(query.Project(query.CountAll())).Where(pageScope(a, page.ID)).Build()
		if err != nil {
			return err
		}
		var count int
		if err = tx.QueryRowContext(ctx, q, args...).Scan(&count); err != nil {
			return err
		}
		if count != 0 {
			return conversationError("conflict", "page_transfer_document_required")
		}
	}
	return nil
}

func (s *Store) retirePageProjectionForTransfer(ctx context.Context, tx *sql.Tx, sourceLibraryID string, page knowledgesdk.KnowledgePage, a agentsdk.Authority) error {
	if page.PublishedVersion == 0 {
		return nil
	}
	documentID, err := knowledgePageProjectionDocumentID(a, page.ID)
	if err != nil {
		return err
	}
	var record persistence.KnowledgeDocumentRecord
	found, err := s.executionRead(ctx, tx, knowledgeDocumentTable, documentScope(a, documentID), &record)
	if err != nil || !found {
		return err
	}
	if record.Document.ProjectionKind != "page" || record.PageProjection == nil || record.PageProjection.PageID != page.ID || record.Document.LibraryID != sourceLibraryID {
		return conversationError("conflict", "page_projection_identity_conflict")
	}
	if record.Document.State == "deleted" {
		return nil
	}
	if record.Document.State != "ready" || record.Reindex != nil || record.RetiredRemoteID != "" || !record.IndexObserved {
		return conversationError("conflict", "page_transfer_projection_busy")
	}
	return s.retireKnowledgeDocument(ctx, tx, &record, record.Document.Revision)
}

func rewriteLibraryID(raw []byte, targetLibraryID string) ([]byte, error) {
	var payload map[string]json.RawMessage
	if err := json.Unmarshal(raw, &payload); err != nil {
		return nil, err
	}
	if _, present := payload["library_id"]; present {
		library, err := json.Marshal(targetLibraryID)
		if err != nil {
			return nil, err
		}
		payload["library_id"] = library
	}
	return json.Marshal(payload)
}

func (s *Store) transferPageOwnedPayloadRows(ctx context.Context, tx *sql.Tx, table, pageColumn, pageID, targetLibraryID string, a agentsdk.Authority) error {
	predicate := query.And(query.Equal("scope_key", libraryScope(a)), query.Equal(pageColumn, pageID))
	q, args, err := query.NewSelectBuilder(s.store.Renderer(), table).Columns("id", "payload_json").Where(predicate).Build()
	if err != nil {
		return err
	}
	rows, err := tx.QueryContext(ctx, q, args...)
	if err != nil {
		return err
	}
	type row struct {
		id  int64
		raw []byte
	}
	items := []row{}
	for rows.Next() {
		var item row
		if err = rows.Scan(&item.id, &item.raw); err != nil {
			_ = rows.Close()
			return err
		}
		items = append(items, item)
	}
	if err = rows.Err(); err != nil {
		_ = rows.Close()
		return err
	}
	if err = rows.Close(); err != nil {
		return err
	}
	for _, item := range items {
		raw, encodeErr := rewriteLibraryID(item.raw, targetLibraryID)
		if encodeErr != nil {
			return encodeErr
		}
		q, args, err = query.NewUpdateBuilder(s.store.Renderer(), table).
			Set("library_id", targetLibraryID).Set("payload_json", raw).
			Where(query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("id", item.id))).Build()
		if err = conversationCAS(ctx, tx, q, args, err); err != nil {
			return err
		}
	}
	return nil
}

func (s *Store) transferPageOwnedLibraryColumn(ctx context.Context, tx *sql.Tx, table, pageColumn, pageID, targetLibraryID string, a agentsdk.Authority) error {
	q, args, err := query.NewUpdateBuilder(s.store.Renderer(), table).Set("library_id", targetLibraryID).
		Where(query.And(query.Equal("scope_key", libraryScope(a)), query.Equal(pageColumn, pageID))).Build()
	return conversationExec(ctx, tx, q, args, err)
}

func (s *Store) clearPageTransferAuthorityState(ctx context.Context, tx *sql.Tx, pageID string, a agentsdk.Authority) error {
	// Redemptions must be removed before their shares. Personal collections are
	// caller-private navigation state and must not follow content into a new ACL
	// boundary.
	for _, table := range []string{knowledgePageShareRedemptionTable, knowledgePageShareTable, knowledgePagePersonalStateTable, knowledgePageGrantTable} {
		q, args, err := query.NewDeleteBuilder(s.store.Renderer(), table).Where(pageScope(a, pageID)).Build()
		if err = conversationExec(ctx, tx, q, args, err); err != nil {
			return err
		}
	}
	return s.resetKnowledgeCollaborationState(ctx, tx, pageID, a)
}

func (s *Store) transferPageOwnedState(ctx context.Context, tx *sql.Tx, pageID, targetLibraryID string, a agentsdk.Authority) error {
	for _, item := range []struct{ table, pageColumn string }{
		{knowledgePageCommentTable, "page_id"},
		{knowledgePageTaskTable, "page_id"},
		{knowledgePagePollTable, "page_id"},
		{knowledgePageFormSubmissionTable, "page_id"},
		{knowledgePageContentPolicyTable, "page_id"},
		{knowledgePageCollaborationSessionTable, "page_id"},
		{knowledgePageSuggestionTable, "page_id"},
		{knowledgePageNativeOperationTable, "page_id"},
		{knowledgePageReferenceTable, "source_page_id"},
		{knowledgePageRelationTable, "source_page_id"},
		{knowledgeAIExecutionTable, "page_id"},
	} {
		if err := s.transferPageOwnedPayloadRows(ctx, tx, item.table, item.pageColumn, pageID, targetLibraryID, a); err != nil {
			return err
		}
	}
	for _, item := range []struct{ table, pageColumn string }{
		{knowledgePageCommentReactionTable, "page_id"},
		{knowledgePagePollBallotTable, "page_id"},
		{knowledgePagePollSelectionTable, "page_id"},
		{knowledgePageTagTable, "page_id"},
		{knowledgePageNameTable, "page_id"},
		{knowledgePageArchiveMemberTable, "page_id"},
	} {
		if err := s.transferPageOwnedLibraryColumn(ctx, tx, item.table, item.pageColumn, pageID, targetLibraryID, a); err != nil {
			return err
		}
	}
	return nil
}

func (s *Store) transferKnowledgePageMetadata(ctx context.Context, tx *sql.Tx, sourceLibraryID, targetLibraryID, pageID string, now time.Time, a agentsdk.Authority) error {
	metadata, found, err := s.knowledgePageMetadataRecord(ctx, tx, sourceLibraryID, pageID, a)
	if err != nil {
		return err
	}
	if !found {
		return conversationError("unavailable", "page_metadata_invalid")
	}
	metadata.LibraryID = targetLibraryID
	// Governance identities are library-member references. Reappointing them
	// without target membership validation would manufacture authority context.
	metadata.OwnerUserID = ""
	metadata.ContentAdminUserIDs = []string{}
	metadata.Revision++
	metadata.UpdatedByUserID = a.UserID
	metadata.UpdatedAt = &now
	q, args, err := query.NewUpdateBuilder(s.store.Renderer(), knowledgePageMetadataTable).
		Set("library_id", targetLibraryID).Set("owner_user_id", "").Set("content_admin_count", 0).
		Set("revision", metadata.Revision).Set("updated_at", now.UnixMilli()).Set("payload_json", conversationJSON(metadata)).
		Where(pageMetadataPredicate(a, pageID)).Build()
	return conversationCAS(ctx, tx, q, args, err)
}

func (s *Store) transferKnowledgePage(ctx context.Context, tx *sql.Tx, sourceLibraryID, targetLibraryID, rootPageID string, in knowledgesdk.KnowledgePageMove, impact knowledgesdk.KnowledgePageMoveImpact, a agentsdk.Authority) (knowledgesdk.KnowledgePage, error) {
	pages, err := s.knowledgePageTransferSubtree(ctx, tx, sourceLibraryID, rootPageID, a)
	if err != nil {
		return knowledgesdk.KnowledgePage{}, err
	}
	if len(pages) != impact.AffectedPages {
		return knowledgesdk.KnowledgePage{}, conversationError("conflict", "page_move_access_confirmation_required")
	}
	if pages[0].Revision != in.ExpectedRevision {
		return knowledgesdk.KnowledgePage{}, conversationError("conflict", "page_revision_conflict")
	}
	if err = s.rejectUnsupportedPageTransferContent(ctx, tx, pages, a); err != nil {
		return knowledgesdk.KnowledgePage{}, err
	}
	var targetCount int
	q, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgePageTable).Projections(query.Project(query.CountAll())).Where(query.And(libraryPredicate(a, targetLibraryID), query.Equal("state", "active"))).Build()
	if err != nil {
		return knowledgesdk.KnowledgePage{}, err
	}
	if err = tx.QueryRowContext(ctx, q, args...).Scan(&targetCount); err != nil {
		return knowledgesdk.KnowledgePage{}, err
	}
	if targetCount+len(pages) > knowledgeLibraryMaximumPages {
		return knowledgesdk.KnowledgePage{}, conversationError("conflict", "page_limit")
	}
	targetPublishedParentID, err := s.publishedPageParentID(ctx, tx, targetLibraryID, in.ParentPageID, a)
	if err != nil {
		return knowledgesdk.KnowledgePage{}, err
	}
	if pages[0].PublishedVersion > 0 && in.ParentPageID != "" && targetPublishedParentID == "" {
		return knowledgesdk.KnowledgePage{}, conversationError("conflict", "page_parent_unpublished")
	}
	moved := make(map[string]bool, len(pages))
	for _, page := range pages {
		moved[page.ID] = true
		if err = s.retirePageProjectionForTransfer(ctx, tx, sourceLibraryID, page, a); err != nil {
			return knowledgesdk.KnowledgePage{}, err
		}
	}
	now := time.Now().UTC().Truncate(time.Millisecond)
	requestHash := conversationHash(in)
	requestKey, err := pageRequestKey("transfer", sourceLibraryID, rootPageID, in.ClientID, a)
	if err != nil {
		return knowledgesdk.KnowledgePage{}, err
	}
	var rootResult knowledgesdk.KnowledgePage
	for _, prior := range pages {
		page := prior
		draft, found, readErr := s.pageDraft(ctx, tx, page.ID, a)
		if readErr != nil {
			return knowledgesdk.KnowledgePage{}, readErr
		}
		if !found {
			return knowledgesdk.KnowledgePage{}, conversationError("conflict", "page_draft_missing")
		}
		if err = s.clearPageTransferAuthorityState(ctx, tx, page.ID, a); err != nil {
			return knowledgesdk.KnowledgePage{}, err
		}
		if err = s.transferPageOwnedState(ctx, tx, page.ID, targetLibraryID, a); err != nil {
			return knowledgesdk.KnowledgePage{}, err
		}
		if err = s.transferKnowledgePageMetadata(ctx, tx, sourceLibraryID, targetLibraryID, page.ID, now, a); err != nil {
			return knowledgesdk.KnowledgePage{}, err
		}

		currentParentID := page.ParentPageID
		if page.ID == rootPageID {
			currentParentID = in.ParentPageID
		} else if currentParentID != "" && !moved[currentParentID] {
			currentParentID = rootPageID
		}
		currentRank := page.Rank
		if page.ID == rootPageID {
			currentRank = in.Rank
		}
		publishedParentID, publishedRank := "", ""
		if page.PublishedVersion > 0 {
			currentVersion, versionErr := s.pageVersion(ctx, tx, page.ID, page.PublishedVersion, a)
			if versionErr != nil {
				return knowledgesdk.KnowledgePage{}, versionErr
			}
			publishedParentID, publishedRank = currentVersion.ParentPageID, currentVersion.Rank
			if page.ID == rootPageID {
				publishedParentID, publishedRank = targetPublishedParentID, in.Rank
			} else if publishedParentID != "" && !moved[publishedParentID] {
				publishedParentID = rootPageID
			}
			versionNumber := page.PublishedVersion + 1
			version := currentVersion
			version.LibraryID, version.Version = targetLibraryID, versionNumber
			version.ParentPageID, version.Rank = publishedParentID, publishedRank
			version.PublishedByUserID, version.PublishedAt = a.UserID, now
			version.PublishNote = "Transferred across Libraries"
			q, args, err = query.NewInsertBuilder(s.store.Renderer(), knowledgePageVersionTable).
				Columns("scope_key", "page_id", "version", "library_id", "published_at", "payload_json").
				Values(libraryScope(a), page.ID, versionNumber, targetLibraryID, now.UnixMilli(), conversationJSON(version)).Build()
			if err = conversationExec(ctx, tx, q, args, err); err != nil {
				return knowledgesdk.KnowledgePage{}, err
			}
			page.PublishedVersion = versionNumber
			draft.BasePublishedVersion = versionNumber
		}

		access, readErr := s.knowledgePageAccessPolicy(ctx, tx, sourceLibraryID, page.ID, a)
		if readErr != nil {
			return knowledgesdk.KnowledgePage{}, readErr
		}
		access.LibraryID, access.Mode, access.Revision = targetLibraryID, knowledgesdk.KnowledgePageAccessInherit, access.Revision+1
		access.Grants, access.UpdatedByUserID, access.UpdatedAt = []knowledgesdk.KnowledgePageAccessGrant{}, a.UserID, now
		access.ProjectionStatus = "ready"
		if page.PublishedVersion > 0 {
			access.ProjectionStatus = "queued"
		}
		q, args, err = query.NewUpdateBuilder(s.store.Renderer(), knowledgePageAccessTable).
			Set("library_id", targetLibraryID).Set("mode", access.Mode).Set("revision", access.Revision).
			Set("projection_status", access.ProjectionStatus).Set("updated_at", now.UnixMilli()).
			Set("last_request_key", requestKey).Set("last_request_hash", requestHash).Set("payload_json", conversationJSON(access)).
			Where(query.And(pageScope(a, page.ID), query.Equal("revision", access.Revision-1))).Build()
		if err = conversationCAS(ctx, tx, q, args, err); err != nil {
			return knowledgesdk.KnowledgePage{}, conversationError("conflict", "page_access_revision_conflict")
		}

		page.LibraryID, page.ParentPageID, page.Rank = targetLibraryID, currentParentID, currentRank
		page.AccessMode, page.AccessRevision, page.AccessStatus = access.Mode, access.Revision, access.ProjectionStatus
		page.ProjectionStatus = access.ProjectionStatus
		page.Revision++
		page.UpdatedByUserID, page.UpdatedAt = a.UserID, now
		if err = s.queueCurrentPageProjection(ctx, tx, &page, access.Revision, a); err != nil {
			return knowledgesdk.KnowledgePage{}, err
		}
		q, args, err = query.NewUpdateBuilder(s.store.Renderer(), knowledgePageTable).
			Set("library_id", targetLibraryID).Set("parent_page_id", page.ParentPageID).Set("rank", page.Rank).
			Set("published_parent_page_id", publishedParentID).Set("published_rank", publishedRank).
			Set("revision", page.Revision).Set("published_version", page.PublishedVersion).Set("updated_at", now.UnixMilli()).Set("payload_json", conversationJSON(page)).
			Where(query.And(pageScope(a, page.ID), query.Equal("revision", prior.Revision))).Build()
		if err = conversationCAS(ctx, tx, q, args, err); err != nil {
			return knowledgesdk.KnowledgePage{}, conversationError("conflict", "page_revision_conflict")
		}

		draft.LibraryID, draft.ParentPageID, draft.Rank = targetLibraryID, currentParentID, currentRank
		draft.DraftRevision++
		draft.UpdatedByUserID, draft.UpdatedAt = a.UserID, now
		q, args, err = query.NewUpdateBuilder(s.store.Renderer(), knowledgePageDraftTable).
			Set("library_id", targetLibraryID).Set("base_published_version", draft.BasePublishedVersion).
			Set("draft_revision", draft.DraftRevision).Set("updated_at", now.UnixMilli()).
			Set("last_request_key", requestKey).Set("last_request_hash", requestHash).Set("payload_json", conversationJSON(draft)).
			Where(query.And(pageScope(a, page.ID), query.Equal("draft_revision", draft.DraftRevision-1))).Build()
		if err = conversationCAS(ctx, tx, q, args, err); err != nil {
			return knowledgesdk.KnowledgePage{}, conversationError("conflict", "page_draft_revision_conflict")
		}
		if page.ID == rootPageID {
			rootResult = page
		}
	}
	return rootResult, nil
}
