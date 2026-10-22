package store

import (
	"context"
	"database/sql"
	"strings"
	"time"

	"github.com/domainry/domainry-foundation/entityid"
	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-orm/query"
)

const (
	knowledgePageSuggestionMaximumTextBytes    = 32 << 10
	knowledgePageSuggestionMaximumCommentBytes = 16 << 10
)

func validKnowledgeSuggestionID(id string) bool {
	return entityid.Validate("ksuggest", id) == nil
}

func suggestionScope(a agentsdk.Authority, id string) query.Predicate {
	return query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("suggestion_id", id))
}

func validKnowledgeSuggestionKind(kind string) bool {
	return kind == knowledgesdk.KnowledgeSuggestionInsert || kind == knowledgesdk.KnowledgeSuggestionDelete
}

func validKnowledgeSuggestionDecision(decision string) bool {
	return decision == knowledgesdk.KnowledgeSuggestionDecisionAccept || decision == knowledgesdk.KnowledgeSuggestionDecisionReject || decision == knowledgesdk.KnowledgeSuggestionDecisionWithdraw
}

func (s *Store) suggestionRecord(ctx context.Context, db conversationDB, libraryID, pageID, suggestionID string, a agentsdk.Authority) (knowledgesdk.KnowledgePageSuggestion, error) {
	var suggestion knowledgesdk.KnowledgePageSuggestion
	if !validKnowledgeSuggestionID(suggestionID) {
		return suggestion, conversationError("bad_request", "page_suggestion_invalid")
	}
	found, err := s.executionRead(ctx, db, knowledgePageSuggestionTable, suggestionScope(a, suggestionID), &suggestion)
	if err != nil {
		return suggestion, err
	}
	if !found || suggestion.LibraryID != libraryID || suggestion.PageID != pageID {
		return knowledgesdk.KnowledgePageSuggestion{}, conversationError("not_found", "page_suggestion_not_found")
	}
	return suggestion, nil
}

func (s *Store) KnowledgePageSuggestions(ctx context.Context, libraryID, pageID string, a agentsdk.Authority) (out knowledgesdk.KnowledgePageSuggestionPage, err error) {
	out.Items = []knowledgesdk.KnowledgePageSuggestion{}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		if _, e := s.libraryRecord(ctx, tx, libraryID, a); e != nil {
			return e
		}
		page, e := s.pageRecord(ctx, tx, libraryID, pageID, a)
		if e != nil {
			return e
		}
		draft, found, e := s.pageDraft(ctx, tx, pageID, a)
		if e != nil {
			return e
		}
		q, args, e := query.NewSelectBuilder(s.store.Renderer(), knowledgePageSuggestionTable).Columns("payload_json").Where(query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("library_id", libraryID), query.Equal("page_id", pageID))).OrderBy(query.Descending("updated_at"), query.Descending("suggestion_id")).Build()
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
			var suggestion knowledgesdk.KnowledgePageSuggestion
			if e = rows.Scan(&raw); e == nil {
				e = unmarshalDurableJSON(raw, &suggestion)
			}
			if e != nil {
				return e
			}
			if suggestion.Status == knowledgesdk.KnowledgeSuggestionOpen {
				suggestion.Anchor.Changed = !found || page.ContentType != knowledgesdk.KnowledgePageTypeDocument
				if !suggestion.Anchor.Changed {
					anchor, anchorErr := knowledgeDocumentCommentAnchor(draft.Body.Content, suggestion.Anchor.NodeID, suggestion.Anchor.Quote)
					suggestion.Anchor.Changed = anchorErr != nil || anchor.BlockSHA256 != suggestion.Anchor.BlockSHA256
				}
			}
			out.Items = append(out.Items, suggestion)
		}
		return rows.Err()
	})
	return
}

func (s *Store) CreateKnowledgePageSuggestion(ctx context.Context, libraryID, pageID string, in knowledgesdk.KnowledgePageSuggestionCreate, a agentsdk.Authority) (out knowledgesdk.KnowledgePageSuggestion, err error) {
	if !validKnowledgeSuggestionKind(in.Kind) || in.BaseDraftRevision < 1 || !validCommentAnchor(in.Anchor) || !executionText(in.Comment, knowledgePageSuggestionMaximumCommentBytes, false) {
		return out, conversationError("bad_request", "page_suggestion_invalid")
	}
	proposedText := strings.TrimSpace(in.ProposedText)
	if in.Kind == knowledgesdk.KnowledgeSuggestionInsert && !executionText(proposedText, knowledgePageSuggestionMaximumTextBytes, true) || in.Kind == knowledgesdk.KnowledgeSuggestionDelete && proposedText != "" {
		return out, conversationError("bad_request", "page_suggestion_invalid")
	}
	mentions, err := normalizedMentions(in.MentionedUserIDs)
	if err != nil {
		return out, err
	}
	if _, err = pageRequestKey("suggestion_create", libraryID, pageID, in.ClientID, a); err != nil {
		return out, err
	}
	err = s.mutateKnowledgeOperation(ctx, "knowledge.page_suggestion.create", knowledgesdk.ActionPageSuggestionsCreate, libraryID+":"+pageID, in.ClientID, in, a, func(tx *sql.Tx) (any, error) {
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
		if page.State != "active" || page.ContentType != knowledgesdk.KnowledgePageTypeDocument {
			return out, conversationError("conflict", "page_suggestion_unsupported")
		}
		draft, found, e := s.pageDraft(ctx, tx, pageID, a)
		if e != nil {
			return out, e
		}
		if !found || draft.DraftRevision != in.BaseDraftRevision {
			return out, conversationError("conflict", "page_suggestion_draft_changed")
		}
		anchor, e := knowledgeDocumentCommentAnchor(draft.Body.Content, in.Anchor.NodeID, in.Anchor.Quote)
		if e != nil {
			return out, e
		}
		if e = s.validateMentionedMembers(ctx, tx, libraryID, mentions, a); e != nil {
			return out, e
		}
		id, e := randomKnowledgeID("ksuggest_")
		if e != nil {
			return out, e
		}
		proposedBlockID := ""
		if in.Kind == knowledgesdk.KnowledgeSuggestionInsert {
			proposedBlockID, e = randomKnowledgeID("kblock_")
			if e != nil {
				return out, e
			}
		}
		now := time.Now().UTC().Truncate(time.Millisecond)
		out = knowledgesdk.KnowledgePageSuggestion{
			ID: id, LibraryID: libraryID, PageID: pageID, Kind: in.Kind, Status: knowledgesdk.KnowledgeSuggestionOpen,
			BaseDraftRevision: draft.DraftRevision, Anchor: anchor, ProposedBlockID: proposedBlockID, ProposedText: proposedText,
			Comment: strings.TrimSpace(in.Comment), MentionedUserIDs: mentions, AuthorUserID: a.UserID, Revision: 1, CreatedAt: now, UpdatedAt: now,
		}
		q, args, e := query.NewInsertBuilder(s.store.Renderer(), knowledgePageSuggestionTable).Columns("scope_key", "suggestion_id", "library_id", "page_id", "status", "author_user_id", "revision", "updated_at", "payload_json").Values(libraryScope(a), id, libraryID, pageID, out.Status, out.AuthorUserID, out.Revision, now.UnixMilli(), conversationJSON(out)).Build()
		if e = conversationExec(ctx, tx, q, args, e); e != nil {
			return out, e
		}
		return out, nil
	}, &out)
	return
}

func (s *Store) DecideKnowledgePageSuggestion(ctx context.Context, libraryID, pageID, suggestionID string, in knowledgesdk.KnowledgePageSuggestionDecision, a agentsdk.Authority) (out knowledgesdk.KnowledgePageSuggestion, err error) {
	if !validKnowledgeSuggestionID(suggestionID) || !validKnowledgeSuggestionDecision(in.Decision) || in.ExpectedRevision < 1 || in.ExpectedDraftRevision < 1 {
		return out, conversationError("bad_request", "page_suggestion_decision_invalid")
	}
	if _, err = pageRequestKey("suggestion_decide", libraryID, suggestionID, in.ClientID, a); err != nil {
		return out, err
	}
	err = s.mutateKnowledgeOperation(ctx, "knowledge.page_suggestion.decide", knowledgesdk.ActionPageSuggestionsDecide, libraryID+":"+pageID+":"+suggestionID, in.ClientID, in, a, func(tx *sql.Tx) (any, error) {
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
		out, e = s.suggestionRecord(ctx, tx, libraryID, pageID, suggestionID, a)
		if e != nil {
			return out, e
		}
		if out.Status != knowledgesdk.KnowledgeSuggestionOpen || out.Revision != in.ExpectedRevision {
			return out, conversationError("conflict", "page_suggestion_revision_conflict")
		}
		if in.Decision == knowledgesdk.KnowledgeSuggestionDecisionWithdraw && out.AuthorUserID != a.UserID {
			return out, conversationError("forbidden", "page_suggestion_withdraw_denied")
		}
		now := time.Now().UTC().Truncate(time.Millisecond)
		switch in.Decision {
		case knowledgesdk.KnowledgeSuggestionDecisionAccept:
			if page.State != "active" || page.ContentType != knowledgesdk.KnowledgePageTypeDocument {
				return out, conversationError("conflict", "page_suggestion_unsupported")
			}
			draft, found, draftErr := s.pageDraft(ctx, tx, pageID, a)
			if draftErr != nil {
				return out, draftErr
			}
			if !found || draft.DraftRevision != in.ExpectedDraftRevision {
				return out, conversationError("conflict", "page_suggestion_draft_changed")
			}
			updatedContent, applyErr := applyKnowledgeDocumentSuggestion(draft.Body.Content, out)
			if applyErr != nil {
				return out, applyErr
			}
			body, normalizeErr := s.normalizedTypedPageContent(page.ContentType, knowledgesdk.PageContentSchemaVersion, updatedContent, "")
			if normalizeErr != nil {
				return out, normalizeErr
			}
			changes, diffErr := knowledgeDocumentBlockChanges(draft.Body.Content, body.Content)
			if diffErr != nil {
				return out, conversationError("bad_request", "page_content_diff_invalid")
			}
			if e = s.updatePage(ctx, tx, &page, page.Revision, a); e != nil {
				return out, e
			}
			now = page.UpdatedAt
			draft.DraftRevision++
			draft.Body, draft.UpdatedByUserID, draft.UpdatedAt = body, a.UserID, now
			q, args, updateErr := query.NewUpdateBuilder(s.store.Renderer(), knowledgePageDraftTable).Set("draft_revision", draft.DraftRevision).Set("updated_at", now.UnixMilli()).Set("payload_json", conversationJSON(draft)).Where(query.And(pageScope(a, pageID), query.Equal("draft_revision", in.ExpectedDraftRevision))).Build()
			if updateErr = conversationCAS(ctx, tx, q, args, updateErr); updateErr != nil {
				return out, conversationError("conflict", "page_suggestion_draft_changed")
			}
			storedChanges := changes
			if len(storedChanges) > knowledgePageEditHistoryMaximumChanges {
				storedChanges = storedChanges[:knowledgePageEditHistoryMaximumChanges]
			}
			history := knowledgesdk.KnowledgePageEditHistoryEntry{DraftRevision: draft.DraftRevision, UserID: a.UserID, ChangedBlockCount: len(changes), Changes: storedChanges, Truncated: len(storedChanges) != len(changes), CreatedAt: now}
			if e = s.insertKnowledgePageEditHistory(ctx, tx, pageID, history, a); e != nil {
				return out, e
			}
			if e = s.resetKnowledgeCollaborationState(ctx, tx, pageID, a); e != nil {
				return out, e
			}
			out.Status = knowledgesdk.KnowledgeSuggestionAccepted
		case knowledgesdk.KnowledgeSuggestionDecisionReject:
			out.Status = knowledgesdk.KnowledgeSuggestionRejected
		case knowledgesdk.KnowledgeSuggestionDecisionWithdraw:
			out.Status = knowledgesdk.KnowledgeSuggestionWithdrawn
		}
		out.Revision++
		out.DecidedByUserID, out.UpdatedAt = a.UserID, now
		q, args, e := query.NewUpdateBuilder(s.store.Renderer(), knowledgePageSuggestionTable).Set("status", out.Status).Set("revision", out.Revision).Set("updated_at", now.UnixMilli()).Set("payload_json", conversationJSON(out)).Where(query.And(suggestionScope(a, suggestionID), query.Equal("revision", in.ExpectedRevision), query.Equal("status", knowledgesdk.KnowledgeSuggestionOpen))).Build()
		if e = conversationCAS(ctx, tx, q, args, e); e != nil {
			return out, conversationError("conflict", "page_suggestion_revision_conflict")
		}
		return out, nil
	}, &out)
	return
}

var _ knowledgesdk.PageSuggestionService = (*Store)(nil)
