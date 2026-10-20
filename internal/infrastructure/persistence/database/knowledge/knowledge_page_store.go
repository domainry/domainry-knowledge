package store

import (
	"context"
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"
	"unicode/utf8"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-orm/query"
)

const (
	knowledgeLibraryMaximumPages = 10000
	knowledgePageMaximumBytes    = 1 << 20
	knowledgePageMaximumDepth    = 256
)

func pageScope(a agentsdk.ConversationAuthority, id string) query.Predicate {
	return query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("page_id", id))
}

func pageVersionScope(a agentsdk.ConversationAuthority, id string, version int64) query.Predicate {
	return query.And(pageScope(a, id), query.Equal("version", version))
}

func validKnowledgePageID(id string) bool {
	return strings.HasPrefix(id, "kpage_") && len(id) == 38 && personalMemoryKey(id)
}

func validKnowledgeCommentID(id string) bool {
	return strings.HasPrefix(id, "kcomment_") && len(id) == 41 && personalMemoryKey(id)
}

func randomKnowledgeID(prefix string) (string, error) {
	var value [16]byte
	if _, err := rand.Read(value[:]); err != nil {
		return "", err
	}
	return prefix + hex.EncodeToString(value[:]), nil
}

func validPageRank(value string, required bool) bool {
	return executionText(value, 96, required) && strings.TrimSpace(value) == value
}

func defaultPageRank(now time.Time, id string) string {
	return fmt.Sprintf("%020d:%s", now.UTC().UnixMilli(), id)
}

func pageRequestKey(kind, library, page, client string, a agentsdk.ConversationAuthority) (string, error) {
	if !personalMemoryKey(client) {
		return "", conversationError("bad_request", "page_client_id_invalid")
	}
	return conversationHash([]string{kind, libraryScope(a), library, page, a.UserID, client}), nil
}

func requirePageWriting(library agentsdk.KnowledgeLibrary) error {
	if library.Archived {
		return conversationError("conflict", "library_archived")
	}
	if library.Role != "editor" && library.Role != "manager" {
		return conversationError("forbidden", "page_write_denied")
	}
	return nil
}

func pageDraftConflict(code string, draft knowledgesdk.KnowledgePageDraft) error {
	return knowledgesdk.NewKnowledgePageConflictError(code, knowledgesdk.KnowledgePageConflict{
		CurrentDraftRevision: draft.DraftRevision,
		BasePublishedVersion: draft.BasePublishedVersion,
		CurrentContentSHA256: draft.Body.ContentSHA256,
		CurrentUpdatedAt:     draft.UpdatedAt,
	})
}

func emptyPageContent() knowledgesdk.PageContent {
	return emptyPageContentForType(knowledgesdk.KnowledgePageTypeDocument)
}

func (s *Store) pageRecord(ctx context.Context, db conversationDB, libraryID, pageID string, a agentsdk.ConversationAuthority) (knowledgesdk.KnowledgePage, error) {
	var page knowledgesdk.KnowledgePage
	if !validKnowledgePageID(pageID) || !validLibraryID(libraryID) {
		return page, conversationError("bad_request", "page_invalid")
	}
	found, err := s.executionRead(ctx, db, knowledgePageTable, pageScope(a, pageID), &page)
	if err != nil {
		return page, err
	}
	if !found || page.LibraryID != libraryID {
		return knowledgesdk.KnowledgePage{}, conversationError("not_found", "page_not_found")
	}
	return page, nil
}

func (s *Store) pageDraft(ctx context.Context, db conversationDB, pageID string, a agentsdk.ConversationAuthority) (knowledgesdk.KnowledgePageDraft, bool, error) {
	var draft knowledgesdk.KnowledgePageDraft
	found, err := s.executionRead(ctx, db, knowledgePageDraftTable, pageScope(a, pageID), &draft)
	return draft, found, err
}

func (s *Store) pageVersion(ctx context.Context, db conversationDB, pageID string, version int64, a agentsdk.ConversationAuthority) (knowledgesdk.KnowledgePageVersion, error) {
	var out knowledgesdk.KnowledgePageVersion
	if version < 1 {
		return out, conversationError("bad_request", "page_version_invalid")
	}
	found, err := s.executionRead(ctx, db, knowledgePageVersionTable, pageVersionScope(a, pageID, version), &out)
	if err == nil && !found {
		err = conversationError("not_found", "page_version_not_found")
	}
	return out, err
}

func (s *Store) pageBreadcrumbs(ctx context.Context, db conversationDB, page knowledgesdk.KnowledgePage, publishedOnly bool, a agentsdk.ConversationAuthority) ([]knowledgesdk.KnowledgePageBreadcrumb, error) {
	chain := []knowledgesdk.KnowledgePageBreadcrumb{{PageID: page.ID, Title: page.Title}}
	seen := map[string]bool{page.ID: true}
	parent := page.ParentPageID
	for depth := 0; parent != "" && depth < knowledgePageMaximumDepth; depth++ {
		if seen[parent] {
			return nil, conversationError("conflict", "page_tree_cycle")
		}
		seen[parent] = true
		item, err := s.pageRecord(ctx, db, page.LibraryID, parent, a)
		if err != nil {
			return nil, err
		}
		if publishedOnly {
			if item.PublishedVersion == 0 {
				return nil, conversationError("not_found", "page_not_found")
			}
			version, versionErr := s.pageVersion(ctx, db, item.ID, item.PublishedVersion, a)
			if versionErr != nil {
				return nil, versionErr
			}
			item.Title, item.ParentPageID, item.Rank = version.Title, version.ParentPageID, version.Rank
		}
		effective, accessErr := s.evaluateKnowledgePageAccess(ctx, db, page.LibraryID, item.ID, a)
		if accessErr != nil {
			return nil, accessErr
		}
		if effective.Allowed {
			chain = append(chain, knowledgesdk.KnowledgePageBreadcrumb{PageID: item.ID, Title: item.Title})
		}
		parent = item.ParentPageID
	}
	if parent != "" {
		return nil, conversationError("conflict", "page_tree_depth")
	}
	for left, right := 0, len(chain)-1; left < right; left, right = left+1, right-1 {
		chain[left], chain[right] = chain[right], chain[left]
	}
	return chain, nil
}

func (s *Store) pageView(ctx context.Context, db conversationDB, library agentsdk.KnowledgeLibrary, page knowledgesdk.KnowledgePage, includeDraft bool, a agentsdk.ConversationAuthority) (knowledgesdk.KnowledgePageView, error) {
	view := knowledgesdk.KnowledgePageView{Page: page, Breadcrumbs: []knowledgesdk.KnowledgePageBreadcrumb{}}
	publishedOnly := library.Role == "reader" || !includeDraft
	if page.PublishedVersion > 0 {
		version, err := s.pageVersion(ctx, db, page.ID, page.PublishedVersion, a)
		if err != nil {
			return view, err
		}
		view.Published = &version
		if publishedOnly {
			view.Page.Title, view.Page.ParentPageID, view.Page.Rank = version.Title, version.ParentPageID, version.Rank
		}
	}
	if includeDraft && library.Role != "reader" {
		draft, found, err := s.pageDraft(ctx, db, page.ID, a)
		if err != nil {
			return view, err
		}
		if found {
			view.Draft = &draft
		}
	}
	if publishedOnly && view.Published == nil {
		return knowledgesdk.KnowledgePageView{}, conversationError("not_found", "page_not_found")
	}
	breadcrumbs, err := s.pageBreadcrumbs(ctx, db, view.Page, publishedOnly, a)
	if err != nil {
		return view, err
	}
	view.Breadcrumbs = breadcrumbs
	return view, nil
}

func (s *Store) KnowledgePage(ctx context.Context, libraryID, pageID string, includeDraft bool, a agentsdk.ConversationAuthority) (out knowledgesdk.KnowledgePageView, err error) {
	if err = conversationAuthority(a); err != nil {
		return
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		library, e := s.libraryRecord(ctx, tx, libraryID, a)
		if e != nil {
			return e
		}
		page, e := s.pageRecord(ctx, tx, libraryID, pageID, a)
		if e != nil {
			return e
		}
		out, e = s.pageView(ctx, tx, library, page, includeDraft, a)
		return e
	})
	return
}

func pageListLimit(after string, limit int) (int, error) {
	if limit == 0 {
		limit = 50
	}
	if limit < 1 || limit > 200 || after != "" && !validKnowledgePageID(after) {
		return 0, conversationError("bad_request", "page_query_invalid")
	}
	return limit, nil
}

func (s *Store) KnowledgePages(ctx context.Context, libraryID, parentID, after string, limit int, includeArchived bool, a agentsdk.ConversationAuthority) (out knowledgesdk.KnowledgePagePage, err error) {
	out = knowledgesdk.KnowledgePagePage{Items: []knowledgesdk.KnowledgePage{}, Complete: true}
	if err = conversationAuthority(a); err != nil {
		return
	}
	if limit, err = pageListLimit(after, limit); err != nil {
		return
	}
	if parentID != "" && !validKnowledgePageID(parentID) {
		return out, conversationError("bad_request", "page_parent_invalid")
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		library, e := s.libraryRecord(ctx, tx, libraryID, a)
		if e != nil {
			return e
		}
		if parentID != "" {
			parent, parentErr := s.pageRecord(ctx, tx, libraryID, parentID, a)
			if parentErr != nil {
				return parentErr
			}
			if library.Role == "reader" && parent.PublishedVersion == 0 {
				return conversationError("not_found", "page_not_found")
			}
			if parent.State == "archived" && !includeArchived {
				return conversationError("not_found", "page_not_found")
			}
			effective, accessErr := s.evaluateKnowledgePageAccess(ctx, tx, libraryID, parentID, a)
			if accessErr != nil || !effective.Allowed {
				return conversationError("not_found", "page_not_found")
			}
		}
		parentColumn, rankColumn := "parent_page_id", "rank"
		if library.Role == "reader" {
			parentColumn, rankColumn = "published_parent_page_id", "published_rank"
		}
		predicate := query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("library_id", libraryID), query.Equal(parentColumn, parentID))
		if library.Role == "reader" {
			predicate = query.And(predicate, query.GreaterThan("published_version", 0))
		}
		if !includeArchived {
			predicate = query.And(predicate, query.Equal("state", "active"))
		}
		if after != "" {
			cursor, e := s.pageRecord(ctx, tx, libraryID, after, a)
			if e != nil {
				return e
			}
			cursorAccess, accessErr := s.evaluateKnowledgePageAccess(ctx, tx, libraryID, after, a)
			if accessErr != nil || !cursorAccess.Allowed {
				return conversationError("bad_request", "page_query_invalid")
			}
			cursorRank := cursor.Rank
			if library.Role == "reader" {
				if cursor.PublishedVersion == 0 {
					return conversationError("bad_request", "page_query_invalid")
				}
				version, readErr := s.pageVersion(ctx, tx, cursor.ID, cursor.PublishedVersion, a)
				if readErr != nil {
					return readErr
				}
				cursorRank = version.Rank
			}
			predicate = query.And(predicate, query.Or(query.GreaterThan(rankColumn, cursorRank), query.And(query.Equal(rankColumn, cursorRank), query.GreaterThan("page_id", cursor.ID))))
		}
		q, args, e := query.NewSelectBuilder(s.store.Renderer(), knowledgePageTable).Columns("payload_json").Where(predicate).OrderBy(query.Ascending(rankColumn), query.Ascending("page_id")).Limit(knowledgeLibraryMaximumPages + 1).Build()
		if e != nil {
			return e
		}
		rows, e := tx.QueryContext(ctx, q, args...)
		if e != nil {
			return e
		}
		defer rows.Close()
		for rows.Next() {
			var raw []byte
			var page knowledgesdk.KnowledgePage
			if e = rows.Scan(&raw); e != nil {
				return e
			}
			if e = unmarshalDurableJSON(raw, &page); e != nil {
				return e
			}
			if library.Role == "reader" {
				if page.PublishedVersion == 0 {
					continue
				}
				version, readErr := s.pageVersion(ctx, tx, page.ID, page.PublishedVersion, a)
				if readErr != nil {
					return readErr
				}
				page.Title, page.ParentPageID, page.Rank = version.Title, version.ParentPageID, version.Rank
			}
			effective, accessErr := s.evaluateKnowledgePageAccess(ctx, tx, libraryID, page.ID, a)
			if accessErr != nil {
				return accessErr
			}
			if !effective.Allowed {
				continue
			}
			out.Items = append(out.Items, page)
		}
		if e = rows.Err(); e != nil {
			return e
		}
		if len(out.Items) > limit {
			out.Items = out.Items[:limit]
			out.Complete = false
			out.NextAfter = out.Items[len(out.Items)-1].ID
		}
		return nil
	})
	return
}

func (s *Store) validatePageParent(ctx context.Context, tx *sql.Tx, libraryID, pageID, parentID string, a agentsdk.ConversationAuthority) error {
	if parentID == "" {
		return nil
	}
	if parentID == pageID || !validKnowledgePageID(parentID) {
		return conversationError("conflict", "page_tree_cycle")
	}
	seen := map[string]bool{pageID: true}
	current := parentID
	for depth := 0; current != "" && depth < knowledgePageMaximumDepth; depth++ {
		if seen[current] {
			return conversationError("conflict", "page_tree_cycle")
		}
		seen[current] = true
		parent, err := s.pageRecord(ctx, tx, libraryID, current, a)
		if err != nil {
			return err
		}
		if parent.State == "archived" {
			return conversationError("conflict", "page_parent_archived")
		}
		current = parent.ParentPageID
	}
	if current != "" {
		return conversationError("conflict", "page_tree_depth")
	}
	return nil
}

func (s *Store) validatePublishedPageParent(ctx context.Context, tx *sql.Tx, libraryID, pageID, parentID string, a agentsdk.ConversationAuthority) error {
	seen := map[string]bool{pageID: true}
	current := parentID
	for depth := 0; current != "" && depth < knowledgePageMaximumDepth; depth++ {
		if seen[current] {
			return conversationError("conflict", "page_tree_cycle")
		}
		seen[current] = true
		parent, err := s.pageRecord(ctx, tx, libraryID, current, a)
		if err != nil || parent.State != "active" || parent.PublishedVersion == 0 {
			return conversationError("conflict", "page_parent_unpublished")
		}
		version, err := s.pageVersion(ctx, tx, parent.ID, parent.PublishedVersion, a)
		if err != nil {
			return err
		}
		current = version.ParentPageID
	}
	if current != "" {
		return conversationError("conflict", "page_tree_depth")
	}
	return nil
}

func (s *Store) CreateKnowledgePage(ctx context.Context, libraryID string, in knowledgesdk.KnowledgePageCreate, a agentsdk.ConversationAuthority) (out knowledgesdk.KnowledgePageView, err error) {
	if err = conversationAuthority(a); err != nil {
		return
	}
	if !executionText(in.Title, 256, true) || in.Rank != "" && !validPageRank(in.Rank, true) || !validKnowledgePageType(in.ContentType) {
		return out, conversationError("bad_request", "page_invalid")
	}
	requestKey, err := pageRequestKey("create", libraryID, "", in.ClientID, a)
	if err != nil {
		return out, err
	}
	requestHash := conversationHash(in)
	err = s.mutateKnowledgeOperation(ctx, "knowledge.page.create", knowledgesdk.ActionPagesCreate, libraryID, in.ClientID, in, a, func(tx *sql.Tx) (any, error) {
		library, e := s.libraryRecord(ctx, tx, libraryID, a)
		if e != nil {
			return out, e
		}
		if e = requirePageWriting(library); e != nil {
			return out, e
		}
		var prior knowledgesdk.KnowledgePage
		found, e := s.executionRead(ctx, tx, knowledgePageTable, query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("request_key", requestKey)), &prior)
		if e != nil {
			return out, e
		}
		if found {
			var storedHash string
			q, args, buildErr := query.NewSelectBuilder(s.store.Renderer(), knowledgePageTable).Columns("request_hash").Where(pageScope(a, prior.ID)).Build()
			if buildErr != nil {
				return out, buildErr
			}
			if e = tx.QueryRowContext(ctx, q, args...).Scan(&storedHash); e != nil {
				return out, e
			}
			if storedHash != requestHash {
				return out, conversationError("conflict", "page_idempotency_conflict")
			}
			out, e = s.pageView(ctx, tx, library, prior, true, a)
			return out, e
		}
		if e = s.validatePageParent(ctx, tx, libraryID, "", in.ParentPageID, a); e != nil {
			return out, e
		}
		q, args, e := query.NewSelectBuilder(s.store.Renderer(), knowledgePageTable).Projections(query.Project(query.CountAll())).Where(query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("library_id", libraryID))).Build()
		if e != nil {
			return out, e
		}
		var count int
		if e = tx.QueryRowContext(ctx, q, args...).Scan(&count); e != nil {
			return out, e
		}
		if count >= knowledgeLibraryMaximumPages {
			return out, conversationError("conflict", "page_limit")
		}
		id, e := randomKnowledgeID("kpage_")
		if e != nil {
			return out, e
		}
		now := time.Now().UTC().Truncate(time.Millisecond)
		rank := in.Rank
		if rank == "" {
			rank = defaultPageRank(now, id)
		}
		page := knowledgesdk.KnowledgePage{ID: id, LibraryID: libraryID, ParentPageID: in.ParentPageID, Rank: rank, Title: strings.TrimSpace(in.Title), ContentType: in.ContentType, State: "active", ProjectionStatus: "none", AccessMode: knowledgesdk.KnowledgePageAccessInherit, AccessRevision: 1, AccessStatus: "ready", Revision: 1, CreatedByUserID: a.UserID, UpdatedByUserID: a.UserID, CreatedAt: now, UpdatedAt: now}
		draft := knowledgesdk.KnowledgePageDraft{PageID: id, LibraryID: libraryID, DraftRevision: 1, Title: page.Title, ContentType: page.ContentType, ParentPageID: page.ParentPageID, Rank: page.Rank, Body: emptyPageContentForType(page.ContentType), UpdatedByUserID: a.UserID, UpdatedAt: now}
		q, args, e = query.NewInsertBuilder(s.store.Renderer(), knowledgePageTable).Columns("scope_key", "page_id", "library_id", "parent_page_id", "rank", "state", "published_parent_page_id", "published_rank", "revision", "published_version", "updated_at", "request_key", "request_hash", "payload_json").Values(libraryScope(a), id, libraryID, page.ParentPageID, page.Rank, page.State, "", "", page.Revision, 0, now.UnixMilli(), requestKey, requestHash, conversationJSON(page)).Build()
		if e = conversationExec(ctx, tx, q, args, e); e != nil {
			return out, e
		}
		if e = s.insertKnowledgePageAccess(ctx, tx, &page, requestKey, requestHash, a); e != nil {
			return out, e
		}
		q, args, e = query.NewInsertBuilder(s.store.Renderer(), knowledgePageDraftTable).Columns("scope_key", "page_id", "library_id", "base_published_version", "draft_revision", "updated_at", "last_request_key", "last_request_hash", "payload_json").Values(libraryScope(a), id, libraryID, 0, 1, now.UnixMilli(), requestKey, requestHash, conversationJSON(draft)).Build()
		if e = conversationExec(ctx, tx, q, args, e); e != nil {
			return out, e
		}
		out, e = s.pageView(ctx, tx, library, page, true, a)
		return out, e
	}, &out)
	return
}

func (s *Store) updatePage(ctx context.Context, tx *sql.Tx, page *knowledgesdk.KnowledgePage, expected int64, a agentsdk.ConversationAuthority) error {
	if expected < 1 || page.Revision != expected {
		return conversationError("conflict", "page_revision_conflict")
	}
	page.Revision++
	page.UpdatedAt = time.Now().UTC().Truncate(time.Millisecond)
	page.UpdatedByUserID = a.UserID
	q, args, err := query.NewUpdateBuilder(s.store.Renderer(), knowledgePageTable).
		Set("parent_page_id", page.ParentPageID).Set("rank", page.Rank).Set("state", page.State).Set("revision", page.Revision).
		Set("published_version", page.PublishedVersion).Set("updated_at", page.UpdatedAt.UnixMilli()).Set("payload_json", conversationJSON(*page)).
		Where(query.And(pageScope(a, page.ID), query.Equal("revision", expected))).Build()
	if err := conversationCAS(ctx, tx, q, args, err); err != nil {
		return conversationError("conflict", "page_revision_conflict")
	}
	return nil
}

func (s *Store) SaveKnowledgePageDraft(ctx context.Context, libraryID, pageID string, in knowledgesdk.KnowledgePageDraftWrite, a agentsdk.ConversationAuthority) (out knowledgesdk.KnowledgePageView, err error) {
	if err = conversationAuthority(a); err != nil {
		return
	}
	if !executionText(in.Title, 256, true) || !validPageRank(in.Rank, true) || in.ExpectedDraftRevision < 1 || in.ExpectedPageRevision < 1 {
		return out, conversationError("bad_request", "page_draft_invalid")
	}
	requestKey, err := pageRequestKey("draft", libraryID, pageID, in.ClientID, a)
	if err != nil {
		return out, err
	}
	requestHash := conversationHash(in)
	err = s.mutateKnowledgeOperation(ctx, "knowledge.page.draft.save", knowledgesdk.ActionPagesUpdate, libraryID+":"+pageID, in.ClientID, in, a, func(tx *sql.Tx) (any, error) {
		library, e := s.libraryRecord(ctx, tx, libraryID, a)
		if e != nil {
			return out, e
		}
		if e = requirePageWriting(library); e != nil {
			return out, e
		}
		page, e := s.pageRecord(ctx, tx, libraryID, pageID, a)
		if e != nil {
			return out, e
		}
		if page.State != "active" {
			return out, conversationError("conflict", "page_archived")
		}
		body, normalizeErr := normalizedTypedPageContent(page.ContentType, in.ContentSchemaVersion, in.Content, in.ContentSHA256)
		if normalizeErr != nil {
			return out, normalizeErr
		}
		draft, found, e := s.pageDraft(ctx, tx, pageID, a)
		if e != nil {
			return out, e
		}
		if !found {
			return out, conversationError("conflict", "page_draft_missing")
		}
		var lastKey, lastHash string
		q, args, e := query.NewSelectBuilder(s.store.Renderer(), knowledgePageDraftTable).Columns("last_request_key", "last_request_hash").Where(pageScope(a, pageID)).Build()
		if e != nil {
			return out, e
		}
		if e = tx.QueryRowContext(ctx, q, args...).Scan(&lastKey, &lastHash); e != nil {
			return out, e
		}
		if lastKey == requestKey {
			if lastHash != requestHash {
				return out, conversationError("conflict", "page_idempotency_conflict")
			}
			out, e = s.pageView(ctx, tx, library, page, true, a)
			return out, e
		}
		if draft.DraftRevision != in.ExpectedDraftRevision || page.Revision != in.ExpectedPageRevision {
			return out, pageDraftConflict("page_draft_revision_conflict", draft)
		}
		if in.ParentPageID != page.ParentPageID || in.Rank != page.Rank {
			return out, conversationError("conflict", "page_move_required")
		}
		if e = s.validatePageParent(ctx, tx, libraryID, pageID, in.ParentPageID, a); e != nil {
			return out, e
		}
		if in.ParentPageID != "" {
			targetAccess, accessErr := s.evaluateKnowledgePageAccess(ctx, tx, libraryID, in.ParentPageID, a)
			if accessErr != nil || !targetAccess.Allowed || roleLevel(targetAccess.Role) < roleLevel("editor") {
				return out, conversationError("not_found", "page_not_found")
			}
		}
		page.Title, page.ParentPageID, page.Rank = strings.TrimSpace(in.Title), in.ParentPageID, in.Rank
		if e = s.updatePage(ctx, tx, &page, in.ExpectedPageRevision, a); e != nil {
			return out, e
		}
		now := page.UpdatedAt
		draft.DraftRevision++
		draft.Title, draft.ParentPageID, draft.Rank, draft.Body = page.Title, page.ParentPageID, page.Rank, body
		draft.UpdatedByUserID, draft.UpdatedAt = a.UserID, now
		q, args, e = query.NewUpdateBuilder(s.store.Renderer(), knowledgePageDraftTable).Set("draft_revision", draft.DraftRevision).Set("updated_at", now.UnixMilli()).Set("last_request_key", requestKey).Set("last_request_hash", requestHash).Set("payload_json", conversationJSON(draft)).Where(query.And(pageScope(a, pageID), query.Equal("draft_revision", in.ExpectedDraftRevision))).Build()
		if e = conversationCAS(ctx, tx, q, args, e); e != nil {
			return out, conversationError("conflict", "page_draft_revision_conflict")
		}
		if e = s.resetKnowledgeCollaborationState(ctx, tx, pageID, a); e != nil {
			return out, e
		}
		out, e = s.pageView(ctx, tx, library, page, true, a)
		return out, e
	}, &out)
	return
}

func (s *Store) MoveKnowledgePage(ctx context.Context, libraryID, pageID string, in knowledgesdk.KnowledgePageMove, a agentsdk.ConversationAuthority) (out knowledgesdk.KnowledgePage, err error) {
	if !validPageRank(in.Rank, true) || in.ExpectedRevision < 1 {
		return out, conversationError("bad_request", "page_move_invalid")
	}
	if _, err = pageRequestKey("move", libraryID, pageID, in.ClientID, a); err != nil {
		return out, err
	}
	err = s.mutateKnowledgeOperation(ctx, "knowledge.page.move", knowledgesdk.ActionPagesMove, libraryID+":"+pageID, in.ClientID, in, a, func(tx *sql.Tx) (any, error) {
		library, e := s.libraryRecord(ctx, tx, libraryID, a)
		if e != nil {
			return out, e
		}
		if e = requirePageWriting(library); e != nil {
			return out, e
		}
		out, e = s.pageRecord(ctx, tx, libraryID, pageID, a)
		if e != nil {
			return out, e
		}
		if out.State != "active" {
			return out, conversationError("conflict", "page_archived")
		}
		if e = s.validatePageParent(ctx, tx, libraryID, pageID, in.ParentPageID, a); e != nil {
			return out, e
		}
		if in.ParentPageID != "" {
			targetAccess, accessErr := s.evaluateKnowledgePageAccess(ctx, tx, libraryID, in.ParentPageID, a)
			if accessErr != nil || !targetAccess.Allowed || roleLevel(targetAccess.Role) < roleLevel("editor") {
				return out, conversationError("not_found", "page_not_found")
			}
		}
		impact, impactErr := s.pageMoveImpact(ctx, tx, libraryID, pageID, knowledgesdk.KnowledgePageMovePreview{ParentPageID: in.ParentPageID, Rank: in.Rank}, a)
		if impactErr != nil {
			return out, impactErr
		}
		if impact.RequiresConfirm && (library.Role != "manager" || in.AccessImpactToken != impact.Token) {
			return out, conversationError("conflict", "page_move_access_confirmation_required")
		}
		out.ParentPageID, out.Rank = in.ParentPageID, in.Rank
		if e = s.updatePage(ctx, tx, &out, in.ExpectedRevision, a); e != nil {
			return out, e
		}
		draft, found, e := s.pageDraft(ctx, tx, pageID, a)
		if e != nil {
			return out, e
		}
		if found {
			draft.ParentPageID, draft.Rank, draft.UpdatedByUserID, draft.UpdatedAt = out.ParentPageID, out.Rank, a.UserID, out.UpdatedAt
			draft.DraftRevision++
			q, args, buildErr := query.NewUpdateBuilder(s.store.Renderer(), knowledgePageDraftTable).Set("draft_revision", draft.DraftRevision).Set("updated_at", draft.UpdatedAt.UnixMilli()).Set("payload_json", conversationJSON(draft)).Where(pageScope(a, pageID)).Build()
			if e = conversationExec(ctx, tx, q, args, buildErr); e != nil {
				return out, e
			}
			if e = s.resetKnowledgeCollaborationState(ctx, tx, pageID, a); e != nil {
				return out, e
			}
		}
		return out, nil
	}, &out)
	return
}

func (s *Store) ReorderKnowledgePages(ctx context.Context, libraryID string, in knowledgesdk.KnowledgePageReorder, a agentsdk.ConversationAuthority) (out knowledgesdk.KnowledgePagePage, err error) {
	if err = conversationAuthority(a); err != nil {
		return
	}
	if len(in.Items) == 0 || len(in.Items) > knowledgeLibraryMaximumPages || in.ParentPageID != "" && !validKnowledgePageID(in.ParentPageID) {
		return out, conversationError("bad_request", "page_reorder_invalid")
	}
	seen := make(map[string]struct{}, len(in.Items))
	for _, item := range in.Items {
		if !validKnowledgePageID(item.PageID) || item.ExpectedRevision < 1 {
			return out, conversationError("bad_request", "page_reorder_invalid")
		}
		if _, duplicate := seen[item.PageID]; duplicate {
			return out, conversationError("bad_request", "page_reorder_invalid")
		}
		seen[item.PageID] = struct{}{}
	}
	err = s.mutateKnowledgeOperation(ctx, "knowledge.pages.reorder", knowledgesdk.ActionPagesReorder, libraryID+":"+in.ParentPageID, in.ClientID, in, a, func(tx *sql.Tx) (any, error) {
		library, e := s.libraryRecord(ctx, tx, libraryID, a)
		if e != nil {
			return out, e
		}
		if e = requirePageWriting(library); e != nil {
			return out, e
		}
		if in.ParentPageID != "" {
			parent, parentErr := s.pageRecord(ctx, tx, libraryID, in.ParentPageID, a)
			if parentErr != nil {
				return out, parentErr
			}
			if parent.State != "active" {
				return out, conversationError("conflict", "page_parent_archived")
			}
		}
		q, args, e := query.NewSelectBuilder(s.store.Renderer(), knowledgePageTable).Columns("payload_json").Where(query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("library_id", libraryID), query.Equal("parent_page_id", in.ParentPageID), query.Equal("state", "active"))).Build()
		if e != nil {
			return out, e
		}
		rows, e := tx.QueryContext(ctx, q, args...)
		if e != nil {
			return out, e
		}
		current := make(map[string]knowledgesdk.KnowledgePage, len(in.Items))
		for rows.Next() {
			var raw []byte
			var page knowledgesdk.KnowledgePage
			if e = rows.Scan(&raw); e == nil {
				e = unmarshalDurableJSON(raw, &page)
			}
			if e != nil {
				_ = rows.Close()
				return out, e
			}
			current[page.ID] = page
		}
		if e = rows.Err(); e != nil {
			_ = rows.Close()
			return out, e
		}
		if e = rows.Close(); e != nil {
			return out, e
		}
		if len(current) != len(in.Items) {
			return out, conversationError("conflict", "page_reorder_set_conflict")
		}
		out.Items = make([]knowledgesdk.KnowledgePage, 0, len(in.Items))
		for index, item := range in.Items {
			page, found := current[item.PageID]
			if !found || page.Revision != item.ExpectedRevision {
				return out, conversationError("conflict", "page_reorder_revision_conflict")
			}
			effective, accessErr := s.evaluateKnowledgePageAccess(ctx, tx, libraryID, page.ID, a)
			if accessErr != nil || !effective.Allowed || roleLevel(effective.Role) < roleLevel("editor") {
				return out, conversationError("not_found", "page_not_found")
			}
			page.Rank = fmt.Sprintf("%020d", (index+1)*1_000_000)
			if e = s.updatePage(ctx, tx, &page, item.ExpectedRevision, a); e != nil {
				return out, conversationError("conflict", "page_reorder_revision_conflict")
			}
			draft, found, draftErr := s.pageDraft(ctx, tx, page.ID, a)
			if draftErr != nil {
				return out, draftErr
			}
			if !found {
				return out, conversationError("conflict", "page_draft_missing")
			}
			expectedDraftRevision := draft.DraftRevision
			draft.DraftRevision++
			draft.Rank, draft.UpdatedByUserID, draft.UpdatedAt = page.Rank, a.UserID, page.UpdatedAt
			q, args, e = query.NewUpdateBuilder(s.store.Renderer(), knowledgePageDraftTable).Set("draft_revision", draft.DraftRevision).Set("updated_at", draft.UpdatedAt.UnixMilli()).Set("payload_json", conversationJSON(draft)).Where(query.And(pageScope(a, page.ID), query.Equal("draft_revision", expectedDraftRevision))).Build()
			if e = conversationCAS(ctx, tx, q, args, e); e != nil {
				return out, conversationError("conflict", "page_reorder_revision_conflict")
			}
			if e = s.resetKnowledgeCollaborationState(ctx, tx, page.ID, a); e != nil {
				return out, e
			}
			out.Items = append(out.Items, page)
		}
		out.Complete = true
		return out, nil
	}, &out)
	return
}

func (s *Store) CopyKnowledgePage(ctx context.Context, libraryID, pageID string, in knowledgesdk.KnowledgePageCopy, a agentsdk.ConversationAuthority) (knowledgesdk.KnowledgePageView, error) {
	var out knowledgesdk.KnowledgePageView
	if in.Rank != "" && !validPageRank(in.Rank, true) || !executionText(in.Title, 256, false) {
		return out, conversationError("bad_request", "page_invalid")
	}
	requestKey, err := pageRequestKey("copy", libraryID, pageID, in.ClientID, a)
	if err != nil {
		return out, err
	}
	err = s.mutateKnowledgeOperation(ctx, "knowledge.page.copy", knowledgesdk.ActionPagesCopy, libraryID+":"+pageID, in.ClientID, in, a, func(tx *sql.Tx) (any, error) {
		library, e := s.libraryRecord(ctx, tx, libraryID, a)
		if e != nil {
			return out, e
		}
		if e = requirePageWriting(library); e != nil {
			return out, e
		}
		sourcePage, e := s.pageRecord(ctx, tx, libraryID, pageID, a)
		if e != nil {
			return out, e
		}
		sourceDraft, found, e := s.pageDraft(ctx, tx, pageID, a)
		if e != nil {
			return out, e
		}
		if !found {
			return out, conversationError("conflict", "page_draft_missing")
		}
		if e = s.validatePageParent(ctx, tx, libraryID, "", in.ParentPageID, a); e != nil {
			return out, e
		}
		q, args, e := query.NewSelectBuilder(s.store.Renderer(), knowledgePageTable).Projections(query.Project(query.CountAll())).Where(query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("library_id", libraryID))).Build()
		if e != nil {
			return out, e
		}
		var count int
		if e = tx.QueryRowContext(ctx, q, args...).Scan(&count); e != nil {
			return out, e
		}
		if count >= knowledgeLibraryMaximumPages {
			return out, conversationError("conflict", "page_limit")
		}
		id, e := randomKnowledgeID("kpage_")
		if e != nil {
			return out, e
		}
		now := time.Now().UTC().Truncate(time.Millisecond)
		rank := in.Rank
		if rank == "" {
			rank = defaultPageRank(now, id)
		}
		title := strings.TrimSpace(in.Title)
		if title == "" {
			title = sourcePage.Title + " 副本"
		}
		if !executionText(title, 256, true) {
			return out, conversationError("bad_request", "page_invalid")
		}
		page := knowledgesdk.KnowledgePage{ID: id, LibraryID: libraryID, ParentPageID: in.ParentPageID, Rank: rank, Title: title, ContentType: sourcePage.ContentType, State: "active", ProjectionStatus: "none", AccessMode: knowledgesdk.KnowledgePageAccessInherit, AccessRevision: 1, AccessStatus: "ready", Revision: 1, CreatedByUserID: a.UserID, UpdatedByUserID: a.UserID, CreatedAt: now, UpdatedAt: now}
		draft := knowledgesdk.KnowledgePageDraft{PageID: id, LibraryID: libraryID, DraftRevision: 1, Title: title, ContentType: sourcePage.ContentType, ParentPageID: in.ParentPageID, Rank: rank, Body: sourceDraft.Body, UpdatedByUserID: a.UserID, UpdatedAt: now}
		requestHash := conversationHash(in)
		q, args, e = query.NewInsertBuilder(s.store.Renderer(), knowledgePageTable).Columns("scope_key", "page_id", "library_id", "parent_page_id", "rank", "state", "published_parent_page_id", "published_rank", "revision", "published_version", "updated_at", "request_key", "request_hash", "payload_json").Values(libraryScope(a), id, libraryID, page.ParentPageID, page.Rank, page.State, "", "", page.Revision, 0, now.UnixMilli(), requestKey, requestHash, conversationJSON(page)).Build()
		if e = conversationExec(ctx, tx, q, args, e); e != nil {
			return out, e
		}
		if e = s.insertKnowledgePageAccess(ctx, tx, &page, requestKey, conversationHash(in), a); e != nil {
			return out, e
		}
		q, args, e = query.NewInsertBuilder(s.store.Renderer(), knowledgePageDraftTable).Columns("scope_key", "page_id", "library_id", "base_published_version", "draft_revision", "updated_at", "last_request_key", "last_request_hash", "payload_json").Values(libraryScope(a), id, libraryID, 0, 1, now.UnixMilli(), requestKey, requestHash, conversationJSON(draft)).Build()
		if e = conversationExec(ctx, tx, q, args, e); e != nil {
			return out, e
		}
		out, e = s.pageView(ctx, tx, library, page, true, a)
		return out, e
	}, &out)
	return out, err
}

func (s *Store) SetKnowledgePageArchived(ctx context.Context, libraryID, pageID string, archived bool, in knowledgesdk.KnowledgePageStateWrite, a agentsdk.ConversationAuthority) (out knowledgesdk.KnowledgePage, err error) {
	if in.ExpectedRevision < 1 {
		return out, conversationError("bad_request", "page_revision_invalid")
	}
	if _, err = pageRequestKey("state", libraryID, pageID, in.ClientID, a); err != nil {
		return out, err
	}
	action := knowledgesdk.ActionPagesArchive
	if !archived {
		action = knowledgesdk.ActionPagesRestore
	}
	err = s.mutateKnowledgeOperation(ctx, "knowledge.page.state", action, libraryID+":"+pageID, in.ClientID, struct {
		Archived bool
		Input    knowledgesdk.KnowledgePageStateWrite
	}{archived, in}, a, func(tx *sql.Tx) (any, error) {
		library, e := s.libraryRecord(ctx, tx, libraryID, a)
		if e != nil {
			return out, e
		}
		if e = requirePageWriting(library); e != nil {
			return out, e
		}
		out, e = s.pageRecord(ctx, tx, libraryID, pageID, a)
		if e != nil {
			return out, e
		}
		want := "active"
		if archived {
			want = "archived"
			q, args, buildErr := query.NewSelectBuilder(s.store.Renderer(), knowledgePageTable).Projections(query.Project(query.CountAll())).Where(query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("library_id", libraryID), query.Or(query.Equal("parent_page_id", pageID), query.Equal("published_parent_page_id", pageID)), query.Equal("state", "active"))).Build()
			if buildErr != nil {
				return out, buildErr
			}
			var children int
			if e = tx.QueryRowContext(ctx, q, args...).Scan(&children); e != nil {
				return out, e
			}
			if children > 0 {
				return out, conversationError("conflict", "page_has_active_children")
			}
		} else if out.ParentPageID != "" {
			parent, parentErr := s.pageRecord(ctx, tx, libraryID, out.ParentPageID, a)
			if parentErr != nil || parent.State != "active" {
				return out, conversationError("conflict", "page_parent_archived")
			}
		}
		if out.State == want {
			if out.Revision != in.ExpectedRevision {
				return out, conversationError("conflict", "page_revision_conflict")
			}
			return out, nil
		}
		out.State = want
		if archived {
			out.ProjectionStatus = "none"
		} else if out.PublishedVersion > 0 {
			out.ProjectionStatus = "queued"
			out.AccessStatus = "queued"
		}
		if e = s.updatePage(ctx, tx, &out, in.ExpectedRevision, a); e != nil {
			return out, e
		}
		if archived {
			if e = s.resetKnowledgeCollaborationState(ctx, tx, pageID, a); e != nil {
				return out, e
			}
			documentID := knowledgePageProjectionDocumentID(a, pageID)
			var projection persistence.KnowledgeDocumentRecord
			found, readErr := s.executionRead(ctx, tx, knowledgeDocumentTable, documentScope(a, documentID), &projection)
			if readErr != nil {
				return out, readErr
			}
			if found && projection.Document.State != "deleted" {
				if e = s.queueDocumentWork(ctx, tx, projection); e != nil {
					return out, e
				}
			}
			q, args, buildErr := query.NewDeleteBuilder(s.store.Renderer(), knowledgePageProjectionJobTable).Where(pageScope(a, pageID)).Build()
			if e = conversationExec(ctx, tx, q, args, buildErr); e != nil {
				return out, e
			}
		} else if out.PublishedVersion > 0 {
			access, accessErr := s.knowledgePageAccessPolicy(ctx, tx, libraryID, pageID, a)
			if accessErr != nil {
				return out, accessErr
			}
			access.ProjectionStatus = "queued"
			access.UpdatedAt = out.UpdatedAt
			access.UpdatedByUserID = a.UserID
			q, args, buildErr := query.NewUpdateBuilder(s.store.Renderer(), knowledgePageAccessTable).Set("projection_status", access.ProjectionStatus).Set("updated_at", access.UpdatedAt.UnixMilli()).Set("payload_json", conversationJSON(access)).Where(query.And(pageScope(a, pageID), query.Equal("revision", access.Revision))).Build()
			if e = conversationCAS(ctx, tx, q, args, buildErr); e != nil {
				return out, e
			}
			version, versionErr := s.pageVersion(ctx, tx, pageID, out.PublishedVersion, a)
			if versionErr != nil {
				return out, versionErr
			}
			job := pageProjectionJob{PageID: pageID, LibraryID: libraryID, Version: out.PublishedVersion, ContentSHA256: version.Body.ContentSHA256, AccessRevision: access.Revision, Actor: a, NotBefore: out.UpdatedAt}
			q, args, buildErr = query.NewDeleteBuilder(s.store.Renderer(), knowledgePageProjectionJobTable).Where(pageScope(a, pageID)).Build()
			if e = conversationExec(ctx, tx, q, args, buildErr); e != nil {
				return out, e
			}
			q, args, buildErr = query.NewInsertBuilder(s.store.Renderer(), knowledgePageProjectionJobTable).Columns("scope_key", "page_id", "library_id", "runtime_id", "version", "not_before", "lease_until", "fence", "payload_json").Values(libraryScope(a), pageID, libraryID, a.RuntimeID, out.PublishedVersion, out.UpdatedAt.UnixMilli(), 0, 0, conversationJSON(job)).Build()
			if e = conversationExec(ctx, tx, q, args, buildErr); e != nil {
				return out, e
			}
		}
		return out, nil
	}, &out)
	return
}

func (s *Store) PublishKnowledgePage(ctx context.Context, libraryID, pageID string, in knowledgesdk.KnowledgePagePublish, a agentsdk.ConversationAuthority) (out knowledgesdk.KnowledgePageView, err error) {
	if in.ExpectedPageRevision < 1 || in.ExpectedDraftRevision < 1 || !executionText(in.PublishNote, 2048, false) {
		return out, conversationError("bad_request", "page_publish_invalid")
	}
	requestKey, err := pageRequestKey("publish", libraryID, pageID, in.ClientID, a)
	if err != nil {
		return out, err
	}
	err = s.mutateKnowledgeOperation(ctx, "knowledge.page.publish", knowledgesdk.ActionPagesPublish, libraryID+":"+pageID, in.ClientID, in, a, func(tx *sql.Tx) (any, error) {
		library, e := s.libraryRecord(ctx, tx, libraryID, a)
		if e != nil {
			return out, e
		}
		if e = requirePageWriting(library); e != nil {
			return out, e
		}
		page, e := s.pageRecord(ctx, tx, libraryID, pageID, a)
		if e != nil {
			return out, e
		}
		if page.State != "active" {
			return out, conversationError("conflict", "page_archived")
		}
		draft, found, e := s.pageDraft(ctx, tx, pageID, a)
		if e != nil {
			return out, e
		}
		if !found {
			return out, conversationError("conflict", "page_draft_missing")
		}
		if draft.DraftRevision != in.ExpectedDraftRevision || page.Revision != in.ExpectedPageRevision {
			return out, pageDraftConflict("page_draft_revision_conflict", draft)
		}
		if e = s.validatePublishedPageParent(ctx, tx, libraryID, pageID, draft.ParentPageID, a); e != nil {
			return out, e
		}
		versionNumber := page.PublishedVersion + 1
		version := knowledgesdk.KnowledgePageVersion{PageID: pageID, LibraryID: libraryID, Version: versionNumber, Title: draft.Title, ContentType: page.ContentType, ParentPageID: draft.ParentPageID, Rank: draft.Rank, Body: draft.Body, PublishedByUserID: a.UserID, PublishedAt: time.Now().UTC().Truncate(time.Millisecond), PublishNote: in.PublishNote}
		q, args, e := query.NewInsertBuilder(s.store.Renderer(), knowledgePageVersionTable).Columns("scope_key", "page_id", "version", "library_id", "published_at", "payload_json").Values(libraryScope(a), pageID, versionNumber, libraryID, version.PublishedAt.UnixMilli(), conversationJSON(version)).Build()
		if e = conversationExec(ctx, tx, q, args, e); e != nil {
			return out, e
		}
		page.PublishedVersion, page.ProjectionStatus, page.AccessStatus = versionNumber, "queued", "queued"
		access, e := s.knowledgePageAccessPolicy(ctx, tx, libraryID, pageID, a)
		if e != nil {
			return out, e
		}
		access.ProjectionStatus, access.UpdatedAt, access.UpdatedByUserID = "queued", version.PublishedAt, a.UserID
		q, args, e = query.NewUpdateBuilder(s.store.Renderer(), knowledgePageAccessTable).Set("projection_status", "queued").Set("updated_at", access.UpdatedAt.UnixMilli()).Set("payload_json", conversationJSON(access)).Where(query.And(pageScope(a, pageID), query.Equal("revision", access.Revision))).Build()
		if e = conversationCAS(ctx, tx, q, args, e); e != nil {
			return out, conversationError("conflict", "page_access_revision_conflict")
		}
		if e = s.updatePage(ctx, tx, &page, in.ExpectedPageRevision, a); e != nil {
			return out, e
		}
		q, args, e = query.NewUpdateBuilder(s.store.Renderer(), knowledgePageTable).Set("published_parent_page_id", version.ParentPageID).Set("published_rank", version.Rank).Where(query.And(pageScope(a, pageID), query.Equal("revision", page.Revision))).Build()
		if e = conversationCAS(ctx, tx, q, args, e); e != nil {
			return out, conversationError("conflict", "page_revision_conflict")
		}
		draft.BasePublishedVersion = versionNumber
		draft.UpdatedAt = page.UpdatedAt
		q, args, e = query.NewUpdateBuilder(s.store.Renderer(), knowledgePageDraftTable).Set("base_published_version", versionNumber).Set("updated_at", draft.UpdatedAt.UnixMilli()).Set("last_request_key", requestKey).Set("last_request_hash", conversationHash(in)).Set("payload_json", conversationJSON(draft)).Where(query.And(pageScope(a, pageID), query.Equal("draft_revision", in.ExpectedDraftRevision))).Build()
		if e = conversationCAS(ctx, tx, q, args, e); e != nil {
			return out, conversationError("conflict", "page_draft_revision_conflict")
		}
		job := pageProjectionJob{PageID: pageID, LibraryID: libraryID, Version: versionNumber, ContentSHA256: version.Body.ContentSHA256, AccessRevision: access.Revision, Actor: a, NotBefore: page.UpdatedAt}
		q, args, e = query.NewDeleteBuilder(s.store.Renderer(), knowledgePageProjectionJobTable).Where(pageScope(a, pageID)).Build()
		if e = conversationExec(ctx, tx, q, args, e); e != nil {
			return out, e
		}
		q, args, e = query.NewInsertBuilder(s.store.Renderer(), knowledgePageProjectionJobTable).Columns("scope_key", "page_id", "library_id", "runtime_id", "version", "not_before", "lease_until", "fence", "payload_json").Values(libraryScope(a), pageID, libraryID, a.RuntimeID, versionNumber, page.UpdatedAt.UnixMilli(), 0, 0, conversationJSON(job)).Build()
		if e = conversationExec(ctx, tx, q, args, e); e != nil {
			return out, e
		}
		out, e = s.pageView(ctx, tx, library, page, true, a)
		return out, e
	}, &out)
	return
}

type pageProjectionJob struct {
	PageID, LibraryID, ContentSHA256 string
	Version, AccessRevision          int64
	Actor                            agentsdk.ConversationAuthority
	NotBefore                        time.Time
	LeaseUntil                       time.Time
	Fence                            int64
}

func (s *Store) KnowledgePageVersions(ctx context.Context, libraryID, pageID string, before int64, limit int, a agentsdk.ConversationAuthority) (out knowledgesdk.KnowledgePageVersionPage, err error) {
	out = knowledgesdk.KnowledgePageVersionPage{Items: []knowledgesdk.KnowledgePageVersion{}, Complete: true}
	if limit == 0 {
		limit = 20
	}
	if limit < 1 || limit > 100 || before < 0 {
		return out, conversationError("bad_request", "page_version_query_invalid")
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		if _, e := s.libraryRecord(ctx, tx, libraryID, a); e != nil {
			return e
		}
		if _, e := s.pageRecord(ctx, tx, libraryID, pageID, a); e != nil {
			return e
		}
		predicate := pageScope(a, pageID)
		if before > 0 {
			predicate = query.And(predicate, query.LessThan("version", before))
		}
		q, args, e := query.NewSelectBuilder(s.store.Renderer(), knowledgePageVersionTable).Columns("payload_json").Where(predicate).OrderBy(query.Descending("version")).Limit(limit + 1).Build()
		if e != nil {
			return e
		}
		rows, e := tx.QueryContext(ctx, q, args...)
		if e != nil {
			return e
		}
		defer rows.Close()
		for rows.Next() {
			var raw []byte
			var item knowledgesdk.KnowledgePageVersion
			if e = rows.Scan(&raw); e != nil {
				return e
			}
			if e = unmarshalDurableJSON(raw, &item); e != nil {
				return e
			}
			out.Items = append(out.Items, item)
		}
		if e = rows.Err(); e != nil {
			return e
		}
		if len(out.Items) > limit {
			out.Items = out.Items[:limit]
			out.Complete = false
			out.NextBefore = out.Items[len(out.Items)-1].Version
		}
		return nil
	})
	return
}

func (s *Store) KnowledgePageVersion(ctx context.Context, libraryID, pageID string, version int64, a agentsdk.ConversationAuthority) (out knowledgesdk.KnowledgePageVersion, err error) {
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		if _, e := s.libraryRecord(ctx, tx, libraryID, a); e != nil {
			return e
		}
		if _, e := s.pageRecord(ctx, tx, libraryID, pageID, a); e != nil {
			return e
		}
		var e error
		out, e = s.pageVersion(ctx, tx, pageID, version, a)
		return e
	})
	return
}

func diffText(from, to string) []knowledgesdk.KnowledgeDiffOp {
	if from == to {
		return []knowledgesdk.KnowledgeDiffOp{{Kind: "equal", Text: from}}
	}
	fromLines, toLines := strings.Split(from, "\n"), strings.Split(to, "\n")
	if len(fromLines)*len(toLines) > 250000 {
		return []knowledgesdk.KnowledgeDiffOp{{Kind: "delete", Text: from}, {Kind: "insert", Text: to}}
	}
	dp := make([][]int, len(fromLines)+1)
	for i := range dp {
		dp[i] = make([]int, len(toLines)+1)
	}
	for i := len(fromLines) - 1; i >= 0; i-- {
		for j := len(toLines) - 1; j >= 0; j-- {
			if fromLines[i] == toLines[j] {
				dp[i][j] = dp[i+1][j+1] + 1
			} else if dp[i+1][j] >= dp[i][j+1] {
				dp[i][j] = dp[i+1][j]
			} else {
				dp[i][j] = dp[i][j+1]
			}
		}
	}
	operations := []knowledgesdk.KnowledgeDiffOp{}
	appendOp := func(kind, text string) {
		if len(operations) > 0 && operations[len(operations)-1].Kind == kind {
			operations[len(operations)-1].Text += "\n" + text
		} else {
			operations = append(operations, knowledgesdk.KnowledgeDiffOp{Kind: kind, Text: text})
		}
	}
	for i, j := 0, 0; i < len(fromLines) || j < len(toLines); {
		if i < len(fromLines) && j < len(toLines) && fromLines[i] == toLines[j] {
			appendOp("equal", fromLines[i])
			i, j = i+1, j+1
		} else if j >= len(toLines) || i < len(fromLines) && dp[i+1][j] >= dp[i][j+1] {
			appendOp("delete", fromLines[i])
			i++
		} else {
			appendOp("insert", toLines[j])
			j++
		}
	}
	return operations
}

func (s *Store) DiffKnowledgePageVersions(ctx context.Context, libraryID, pageID string, in knowledgesdk.KnowledgePageVersionDiffInput, a agentsdk.ConversationAuthority) (knowledgesdk.KnowledgePageVersionDiff, error) {
	from, err := s.KnowledgePageVersion(ctx, libraryID, pageID, in.FromVersion, a)
	if err != nil {
		return knowledgesdk.KnowledgePageVersionDiff{}, err
	}
	to, err := s.KnowledgePageVersion(ctx, libraryID, pageID, in.ToVersion, a)
	if err != nil {
		return knowledgesdk.KnowledgePageVersionDiff{}, err
	}
	return knowledgesdk.KnowledgePageVersionDiff{FromVersion: from.Version, ToVersion: to.Version, Title: diffText(from.Title, to.Title), Parent: diffText(from.ParentPageID, to.ParentPageID), Content: diffText(from.Body.Content, to.Body.Content)}, nil
}

func (s *Store) RestoreKnowledgePageVersion(ctx context.Context, libraryID, pageID string, versionNumber int64, in knowledgesdk.KnowledgePageRestoreVersion, a agentsdk.ConversationAuthority) (out knowledgesdk.KnowledgePageView, err error) {
	if in.ExpectedPageRevision < 1 || in.ExpectedDraftRevision < 1 {
		return out, conversationError("bad_request", "page_restore_invalid")
	}
	requestKey, err := pageRequestKey("restore_version", libraryID, pageID, in.ClientID, a)
	if err != nil {
		return out, err
	}
	err = s.mutateKnowledgeOperation(ctx, "knowledge.page.version.restore", knowledgesdk.ActionPageVersionsRestore, libraryID+":"+pageID, in.ClientID, struct {
		Version int64
		Input   knowledgesdk.KnowledgePageRestoreVersion
	}{versionNumber, in}, a, func(tx *sql.Tx) (any, error) {
		library, e := s.libraryRecord(ctx, tx, libraryID, a)
		if e != nil {
			return out, e
		}
		if e = requirePageWriting(library); e != nil {
			return out, e
		}
		page, e := s.pageRecord(ctx, tx, libraryID, pageID, a)
		if e != nil {
			return out, e
		}
		if page.State != "active" {
			return out, conversationError("conflict", "page_archived")
		}
		draft, found, e := s.pageDraft(ctx, tx, pageID, a)
		if e != nil {
			return out, e
		}
		if !found {
			return out, conversationError("conflict", "page_draft_missing")
		}
		if page.Revision != in.ExpectedPageRevision || draft.DraftRevision != in.ExpectedDraftRevision {
			return out, pageDraftConflict("page_draft_revision_conflict", draft)
		}
		version, e := s.pageVersion(ctx, tx, pageID, versionNumber, a)
		if e != nil {
			return out, e
		}
		if e = s.validatePageParent(ctx, tx, libraryID, pageID, version.ParentPageID, a); e != nil {
			return out, e
		}
		page.Title, page.ParentPageID, page.Rank = version.Title, version.ParentPageID, version.Rank
		if e = s.updatePage(ctx, tx, &page, in.ExpectedPageRevision, a); e != nil {
			return out, e
		}
		draft.DraftRevision++
		draft.Title, draft.ParentPageID, draft.Rank, draft.Body = version.Title, version.ParentPageID, version.Rank, version.Body
		draft.UpdatedByUserID, draft.UpdatedAt = a.UserID, page.UpdatedAt
		q, args, e := query.NewUpdateBuilder(s.store.Renderer(), knowledgePageDraftTable).Set("draft_revision", draft.DraftRevision).Set("updated_at", draft.UpdatedAt.UnixMilli()).Set("last_request_key", requestKey).Set("last_request_hash", conversationHash(in)).Set("payload_json", conversationJSON(draft)).Where(query.And(pageScope(a, pageID), query.Equal("draft_revision", in.ExpectedDraftRevision))).Build()
		if e = conversationCAS(ctx, tx, q, args, e); e != nil {
			return out, conversationError("conflict", "page_draft_revision_conflict")
		}
		if e = s.resetKnowledgeCollaborationState(ctx, tx, pageID, a); e != nil {
			return out, e
		}
		out, e = s.pageView(ctx, tx, library, page, true, a)
		return out, e
	}, &out)
	return
}

func parseVersion(value string) (int64, error) {
	version, err := strconv.ParseInt(strings.TrimSpace(value), 10, 64)
	if err != nil || version < 1 {
		return 0, conversationError("bad_request", "page_version_invalid")
	}
	return version, nil
}

func validPageText(value string, limit int, required bool) bool {
	return len(value) <= limit && utf8.ValidString(value) && !strings.ContainsRune(value, 0) && (!required || strings.TrimSpace(value) != "")
}

func isNoRows(err error) bool { return errors.Is(err, sql.ErrNoRows) }
