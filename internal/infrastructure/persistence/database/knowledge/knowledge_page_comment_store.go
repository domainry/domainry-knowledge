package store

import (
	"context"
	"database/sql"
	"strings"
	"time"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-orm/query"
)

const (
	knowledgePageCommentMaximumBytes    = 32 << 10
	knowledgePageCommentMaximumMentions = 20
)

func commentScope(a agentsdk.ConversationAuthority, id string) query.Predicate {
	return query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("comment_id", id))
}

func (s *Store) commentRecord(ctx context.Context, db conversationDB, libraryID, pageID, commentID string, a agentsdk.ConversationAuthority) (knowledgesdk.KnowledgePageComment, error) {
	var comment knowledgesdk.KnowledgePageComment
	if !validKnowledgeCommentID(commentID) {
		return comment, conversationError("bad_request", "page_comment_invalid")
	}
	found, err := s.executionRead(ctx, db, knowledgePageCommentTable, commentScope(a, commentID), &comment)
	if err != nil {
		return comment, err
	}
	if !found || comment.LibraryID != libraryID || comment.PageID != pageID {
		return knowledgesdk.KnowledgePageComment{}, conversationError("not_found", "page_comment_not_found")
	}
	return comment, nil
}

func validCommentAnchor(anchor knowledgesdk.KnowledgePageCommentAnchor) bool {
	return executionText(anchor.NodeID, 128, false) && executionText(anchor.Quote, 1024, false) && strings.TrimSpace(anchor.NodeID) == anchor.NodeID
}

func normalizedMentions(values []string) ([]string, error) {
	if len(values) > knowledgePageCommentMaximumMentions {
		return nil, conversationError("bad_request", "page_comment_mentions_invalid")
	}
	seen := map[string]bool{}
	result := make([]string, 0, len(values))
	for _, value := range values {
		if !validLibraryUser(value) || seen[value] {
			return nil, conversationError("bad_request", "page_comment_mentions_invalid")
		}
		seen[value] = true
		result = append(result, value)
	}
	return result, nil
}

func (s *Store) validateMentionedMembers(ctx context.Context, tx *sql.Tx, libraryID string, users []string, a agentsdk.ConversationAuthority) error {
	for _, user := range users {
		var member agentsdk.KnowledgeLibraryMember
		found, err := s.executionRead(ctx, tx, knowledgeLibraryMemberTable, query.And(libraryPredicate(a, libraryID), query.Equal("user_id", user)), &member)
		if err != nil {
			return err
		}
		if !found || !validLibraryRole(member.Role) {
			return conversationError("bad_request", "page_comment_mention_unavailable")
		}
	}
	return nil
}

func commentPageLimit(after string, limit int) (int, error) {
	if limit == 0 {
		limit = 50
	}
	if limit < 1 || limit > 200 || after != "" && !validKnowledgeCommentID(after) {
		return 0, conversationError("bad_request", "page_comment_query_invalid")
	}
	return limit, nil
}

func (s *Store) KnowledgePageComments(ctx context.Context, libraryID, pageID, after string, limit int, unresolvedOnly bool, a agentsdk.ConversationAuthority) (out knowledgesdk.KnowledgePageCommentPage, err error) {
	out = knowledgesdk.KnowledgePageCommentPage{Items: []knowledgesdk.KnowledgePageComment{}, Complete: true}
	if limit, err = commentPageLimit(after, limit); err != nil {
		return
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		if _, e := s.libraryRecord(ctx, tx, libraryID, a); e != nil {
			return e
		}
		page, e := s.pageRecord(ctx, tx, libraryID, pageID, a)
		if e != nil {
			return e
		}
		predicate := query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("library_id", libraryID), query.Equal("page_id", pageID), query.GreaterThan("comment_id", after))
		if unresolvedOnly {
			predicate = query.And(predicate, query.Equal("resolved", false))
		}
		q, args, e := query.NewSelectBuilder(s.store.Renderer(), knowledgePageCommentTable).Columns("payload_json").Where(predicate).OrderBy(query.Ascending("comment_id")).Limit(limit + 1).Build()
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
			var item knowledgesdk.KnowledgePageComment
			if e = rows.Scan(&raw); e != nil {
				return e
			}
			if e = unmarshalDurableJSON(raw, &item); e != nil {
				return e
			}
			if item.PublishedVersion != page.PublishedVersion && (item.Anchor.NodeID != "" || item.Anchor.Quote != "") {
				item.Anchor.Changed = true
			}
			out.Items = append(out.Items, item)
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

func (s *Store) CreateKnowledgePageComment(ctx context.Context, libraryID, pageID string, in knowledgesdk.KnowledgePageCommentCreate, a agentsdk.ConversationAuthority) (out knowledgesdk.KnowledgePageComment, err error) {
	if !executionText(in.Body, knowledgePageCommentMaximumBytes, true) || in.PublishedVersion < 1 || !validCommentAnchor(in.Anchor) {
		return out, conversationError("bad_request", "page_comment_invalid")
	}
	mentions, err := normalizedMentions(in.MentionedUserIDs)
	if err != nil {
		return out, err
	}
	requestKey, err := pageRequestKey("comment_create", libraryID, pageID, in.ClientID, a)
	if err != nil {
		return out, err
	}
	requestHash := conversationHash(in)
	err = s.mutateKnowledgeOperation(ctx, "knowledge.page_comment.create", knowledgesdk.ActionPageCommentsCreate, libraryID+":"+pageID, in.ClientID, in, a, func(tx *sql.Tx) (any, error) {
		library, e := s.libraryRecord(ctx, tx, libraryID, a)
		if e != nil {
			return out, e
		}
		if library.Archived {
			return out, conversationError("conflict", "library_archived")
		}
		page, e := s.pageRecord(ctx, tx, libraryID, pageID, a)
		if e != nil {
			return out, e
		}
		if page.State != "active" {
			return out, conversationError("conflict", "page_archived")
		}
		if page.PublishedVersion < in.PublishedVersion {
			return out, conversationError("conflict", "page_comment_version_invalid")
		}
		if _, e = s.pageVersion(ctx, tx, pageID, in.PublishedVersion, a); e != nil {
			return out, e
		}
		if in.ParentCommentID != "" {
			parent, parentErr := s.commentRecord(ctx, tx, libraryID, pageID, in.ParentCommentID, a)
			if parentErr != nil || parent.Deleted {
				return out, conversationError("bad_request", "page_comment_parent_invalid")
			}
			if parent.ParentCommentID != "" {
				return out, conversationError("bad_request", "page_comment_reply_depth")
			}
		}
		if e = s.validateMentionedMembers(ctx, tx, libraryID, mentions, a); e != nil {
			return out, e
		}
		var prior knowledgesdk.KnowledgePageComment
		found, e := s.executionRead(ctx, tx, knowledgePageCommentTable, query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("request_key", requestKey)), &prior)
		if e != nil {
			return out, e
		}
		if found {
			var storedHash string
			q, args, buildErr := query.NewSelectBuilder(s.store.Renderer(), knowledgePageCommentTable).Columns("request_hash").Where(commentScope(a, prior.ID)).Build()
			if buildErr != nil {
				return out, buildErr
			}
			if e = tx.QueryRowContext(ctx, q, args...).Scan(&storedHash); e != nil {
				return out, e
			}
			if storedHash != requestHash {
				return out, conversationError("conflict", "page_idempotency_conflict")
			}
			out = prior
			return out, nil
		}
		id, e := randomKnowledgeID("kcomment_")
		if e != nil {
			return out, e
		}
		now := time.Now().UTC().Truncate(time.Millisecond)
		out = knowledgesdk.KnowledgePageComment{ID: id, PageID: pageID, LibraryID: libraryID, ParentCommentID: in.ParentCommentID, PublishedVersion: in.PublishedVersion, Anchor: in.Anchor, Body: strings.TrimSpace(in.Body), MentionedUserIDs: mentions, AuthorUserID: a.UserID, Revision: 1, CreatedAt: now, UpdatedAt: now}
		q, args, e := query.NewInsertBuilder(s.store.Renderer(), knowledgePageCommentTable).Columns("scope_key", "comment_id", "library_id", "page_id", "parent_comment_id", "author_user_id", "resolved", "revision", "updated_at", "request_key", "request_hash", "payload_json").Values(libraryScope(a), id, libraryID, pageID, in.ParentCommentID, a.UserID, false, 1, now.UnixMilli(), requestKey, requestHash, conversationJSON(out)).Build()
		if e = conversationExec(ctx, tx, q, args, e); e != nil {
			return out, e
		}
		return out, nil
	}, &out)
	return
}

func (s *Store) saveComment(ctx context.Context, tx *sql.Tx, comment *knowledgesdk.KnowledgePageComment, expected int64, a agentsdk.ConversationAuthority) error {
	if expected < 1 || comment.Revision != expected {
		return conversationError("conflict", "page_comment_revision_conflict")
	}
	comment.Revision++
	comment.UpdatedAt = time.Now().UTC().Truncate(time.Millisecond)
	q, args, err := query.NewUpdateBuilder(s.store.Renderer(), knowledgePageCommentTable).Set("resolved", comment.Resolved).Set("revision", comment.Revision).Set("updated_at", comment.UpdatedAt.UnixMilli()).Set("payload_json", conversationJSON(*comment)).Where(query.And(commentScope(a, comment.ID), query.Equal("revision", expected))).Build()
	if err := conversationCAS(ctx, tx, q, args, err); err != nil {
		return conversationError("conflict", "page_comment_revision_conflict")
	}
	return nil
}

func (s *Store) mutatePageComment(ctx context.Context, libraryID, pageID, commentID, kind, action, clientID string, input any, expected int64, a agentsdk.ConversationAuthority, mutate func(*sql.Tx, *knowledgesdk.KnowledgePageComment, agentsdk.KnowledgeLibrary) error) (out knowledgesdk.KnowledgePageComment, err error) {
	err = s.mutateKnowledgeOperation(ctx, kind, action, libraryID+":"+pageID+":"+commentID, clientID, input, a, func(tx *sql.Tx) (any, error) {
		library, e := s.libraryRecord(ctx, tx, libraryID, a)
		if e != nil {
			return out, e
		}
		if library.Archived {
			return out, conversationError("conflict", "library_archived")
		}
		page, pageErr := s.pageRecord(ctx, tx, libraryID, pageID, a)
		if pageErr != nil {
			return out, pageErr
		}
		if page.State != "active" {
			return out, conversationError("conflict", "page_archived")
		}
		out, e = s.commentRecord(ctx, tx, libraryID, pageID, commentID, a)
		if e != nil {
			return out, e
		}
		if out.AuthorUserID != a.UserID && library.Role != "manager" {
			return out, conversationError("forbidden", "page_comment_manage_denied")
		}
		if e = mutate(tx, &out, library); e != nil {
			return out, e
		}
		if e = s.saveComment(ctx, tx, &out, expected, a); e != nil {
			return out, e
		}
		return out, nil
	}, &out)
	return
}

func (s *Store) UpdateKnowledgePageComment(ctx context.Context, libraryID, pageID, commentID string, in knowledgesdk.KnowledgePageCommentUpdate, a agentsdk.ConversationAuthority) (knowledgesdk.KnowledgePageComment, error) {
	if !executionText(in.Body, knowledgePageCommentMaximumBytes, true) {
		return knowledgesdk.KnowledgePageComment{}, conversationError("bad_request", "page_comment_invalid")
	}
	mentions, err := normalizedMentions(in.MentionedUserIDs)
	if err != nil {
		return knowledgesdk.KnowledgePageComment{}, err
	}
	if _, err = pageRequestKey("comment_update", libraryID, commentID, in.ClientID, a); err != nil {
		return knowledgesdk.KnowledgePageComment{}, err
	}
	return s.mutatePageComment(ctx, libraryID, pageID, commentID, "knowledge.page_comment.update", knowledgesdk.ActionPageCommentsUpdate, in.ClientID, in, in.ExpectedRevision, a, func(tx *sql.Tx, comment *knowledgesdk.KnowledgePageComment, _ agentsdk.KnowledgeLibrary) error {
		if comment.Deleted {
			return conversationError("conflict", "page_comment_deleted")
		}
		if err := s.validateMentionedMembers(ctx, tx, libraryID, mentions, a); err != nil {
			return err
		}
		comment.Body, comment.MentionedUserIDs = strings.TrimSpace(in.Body), mentions
		return nil
	})
}

func (s *Store) ResolveKnowledgePageComment(ctx context.Context, libraryID, pageID, commentID string, in knowledgesdk.KnowledgePageCommentResolve, a agentsdk.ConversationAuthority) (knowledgesdk.KnowledgePageComment, error) {
	if _, err := pageRequestKey("comment_resolve", libraryID, commentID, in.ClientID, a); err != nil {
		return knowledgesdk.KnowledgePageComment{}, err
	}
	return s.mutatePageComment(ctx, libraryID, pageID, commentID, "knowledge.page_comment.resolve", knowledgesdk.ActionPageCommentsResolve, in.ClientID, in, in.ExpectedRevision, a, func(_ *sql.Tx, comment *knowledgesdk.KnowledgePageComment, _ agentsdk.KnowledgeLibrary) error {
		if comment.Deleted {
			return conversationError("conflict", "page_comment_deleted")
		}
		comment.Resolved = in.Resolved
		if in.Resolved {
			comment.ResolvedByUserID = a.UserID
		} else {
			comment.ResolvedByUserID = ""
		}
		return nil
	})
}

func (s *Store) DeleteKnowledgePageComment(ctx context.Context, libraryID, pageID, commentID string, in knowledgesdk.KnowledgePageCommentDelete, a agentsdk.ConversationAuthority) (knowledgesdk.KnowledgePageComment, error) {
	if _, err := pageRequestKey("comment_delete", libraryID, commentID, in.ClientID, a); err != nil {
		return knowledgesdk.KnowledgePageComment{}, err
	}
	return s.mutatePageComment(ctx, libraryID, pageID, commentID, "knowledge.page_comment.delete", knowledgesdk.ActionPageCommentsDelete, in.ClientID, in, in.ExpectedRevision, a, func(_ *sql.Tx, comment *knowledgesdk.KnowledgePageComment, _ agentsdk.KnowledgeLibrary) error {
		comment.Deleted, comment.Body, comment.MentionedUserIDs = true, "", nil
		return nil
	})
}
