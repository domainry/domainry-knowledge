package store

import (
	"context"
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"sort"
	"strings"
	"time"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-orm/query"
)

const (
	knowledgePageCommentMaximumBytes    = 32 << 10
	knowledgePageCommentMaximumMentions = 20
)

var knowledgeCommentReactionOrder = []string{"👍", "❤️", "🎉", "👀", "😄", "🚀"}

func validKnowledgeCommentReaction(value string) bool {
	for _, emoji := range knowledgeCommentReactionOrder {
		if value == emoji {
			return true
		}
	}
	return false
}

func (s *Store) hydrateKnowledgeCommentReactions(ctx context.Context, db conversationDB, comments []knowledgesdk.KnowledgePageComment, a agentsdk.Authority) error {
	if len(comments) == 0 {
		return nil
	}
	values := make([]any, 0, len(comments))
	positions := make(map[string]int, len(comments))
	for index := range comments {
		comments[index].Reactions = []knowledgesdk.KnowledgeCommentReaction{}
		values = append(values, comments[index].ID)
		positions[comments[index].ID] = index
	}
	predicate := query.And(query.Equal("scope_key", libraryScope(a)), query.In("comment_id", values...))
	q, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgePageCommentReactionTable).Projections(
		query.Project(query.Column("comment_id")),
		query.Project(query.Column("emoji")),
		query.ProjectAs(query.CountAll(), "reaction_count"),
		query.ProjectAs(query.Sum(query.CaseWhen(query.Equal("user_id", a.UserID), 1).Else(0)), "caller_reacted"),
	).Where(predicate).GroupBy(query.Column("comment_id"), query.Column("emoji")).Build()
	if err != nil {
		return err
	}
	rows, err := db.QueryContext(ctx, q, args...)
	if err != nil {
		return err
	}
	defer rows.Close()
	for rows.Next() {
		var commentID, emoji string
		var count, reacted int64
		if err = rows.Scan(&commentID, &emoji, &count, &reacted); err != nil {
			return err
		}
		if index, ok := positions[commentID]; ok && validKnowledgeCommentReaction(emoji) && count > 0 {
			comments[index].Reactions = append(comments[index].Reactions, knowledgesdk.KnowledgeCommentReaction{Emoji: emoji, Count: count, Reacted: reacted > 0})
		}
	}
	if err = rows.Err(); err != nil {
		return err
	}
	order := make(map[string]int, len(knowledgeCommentReactionOrder))
	for index, emoji := range knowledgeCommentReactionOrder {
		order[emoji] = index
	}
	for index := range comments {
		sort.Slice(comments[index].Reactions, func(left, right int) bool {
			return order[comments[index].Reactions[left].Emoji] < order[comments[index].Reactions[right].Emoji]
		})
	}
	return nil
}

func commentScope(a agentsdk.Authority, id string) query.Predicate {
	return query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("comment_id", id))
}

func (s *Store) commentRecord(ctx context.Context, db conversationDB, libraryID, pageID, commentID string, a agentsdk.Authority) (knowledgesdk.KnowledgePageComment, error) {
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
	if comment.MentionedUserIDs == nil {
		comment.MentionedUserIDs = []string{}
	}
	return comment, nil
}

func validCommentAnchor(anchor knowledgesdk.KnowledgePageCommentAnchor) bool {
	return executionText(anchor.NodeID, 128, false) && executionText(anchor.Quote, 1024, false) && strings.TrimSpace(anchor.NodeID) == anchor.NodeID && anchor.BlockSHA256 == ""
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

func (s *Store) validateMentionedMembers(ctx context.Context, tx *sql.Tx, libraryID string, users []string, a agentsdk.Authority) error {
	for _, user := range users {
		var member agentsdk.KnowledgeLibraryMember
		found, err := s.executionRead(ctx, tx, knowledgeLibraryMemberTable, libraryMemberPredicate(a, libraryID, agentsdk.KnowledgeSubjectUser, user), &member)
		if err != nil {
			return err
		}
		if !found || !validLibraryRole(member.Role) {
			return conversationError("bad_request", "page_comment_mention_unavailable")
		}
	}
	return nil
}

func commentPageLimit(after string, limit int) (int64, int, error) {
	if limit == 0 {
		limit = 50
	}
	afterID, valid := parsePhysicalAfter(after)
	if limit < 1 || limit > 200 || !valid {
		return 0, 0, conversationError("bad_request", "page_comment_query_invalid")
	}
	return afterID, limit, nil
}

func (s *Store) KnowledgePageComments(ctx context.Context, libraryID, pageID, after string, limit int, unresolvedOnly bool, a agentsdk.Authority) (out knowledgesdk.KnowledgePageCommentPage, err error) {
	out = knowledgesdk.KnowledgePageCommentPage{Items: []knowledgesdk.KnowledgePageComment{}, Complete: true}
	var afterID int64
	if afterID, limit, err = commentPageLimit(after, limit); err != nil {
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
		currentAnchors := map[string]string{}
		if page.PublishedVersion > 0 {
			currentVersion, versionErr := s.pageVersion(ctx, tx, pageID, page.PublishedVersion, a)
			if versionErr != nil {
				return versionErr
			}
			var payload knowledgeDocumentPayload
			if currentVersion.ContentType == knowledgesdk.KnowledgePageTypeDocument && json.Unmarshal([]byte(currentVersion.Body.Content), &payload) == nil {
				var collect func([]knowledgeDocumentBlock)
				collect = func(blocks []knowledgeDocumentBlock) {
					for index := range blocks {
						raw, marshalErr := json.Marshal(&blocks[index])
						if marshalErr == nil {
							digest := sha256.Sum256(raw)
							currentAnchors[blocks[index].ID] = hex.EncodeToString(digest[:])
						}
						collect(blocks[index].Children)
					}
				}
				blocks := make([]knowledgeDocumentBlock, 0, len(payload.Blocks))
				for _, raw := range payload.Blocks {
					var block knowledgeDocumentBlock
					decoder := json.NewDecoder(strings.NewReader(string(raw)))
					decoder.UseNumber()
					if decoder.Decode(&block) == nil {
						blocks = append(blocks, block)
					}
				}
				collect(blocks)
			} else if currentVersion.ContentType == knowledgesdk.KnowledgePageTypeWhiteboard {
				anchors, anchorErr := whiteboardAnchorHashes(currentVersion.Body.Content)
				if anchorErr != nil {
					return anchorErr
				}
				currentAnchors = anchors
			} else if currentVersion.ContentType == knowledgesdk.KnowledgePageTypeMindMap || currentVersion.ContentType == knowledgesdk.KnowledgePageTypeFlowchart {
				anchors, anchorErr := diagramAnchorHashes(currentVersion.Body.Content, currentVersion.ContentType)
				if anchorErr != nil {
					return anchorErr
				}
				currentAnchors = anchors
			}
		}
		predicate := query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("library_id", libraryID), query.Equal("page_id", pageID))
		if afterID > 0 {
			predicate = query.And(predicate, query.GreaterThan("id", afterID))
		}
		if unresolvedOnly {
			predicate = query.And(predicate, query.Equal("resolved", false))
		}
		q, args, e := query.NewSelectBuilder(s.store.Renderer(), knowledgePageCommentTable).Columns("id", "payload_json").Where(predicate).OrderBy(query.Ascending("id")).Limit(limit + 1).Build()
		if e != nil {
			return e
		}
		rows, e := tx.QueryContext(ctx, q, args...)
		if e != nil {
			return e
		}
		defer rows.Close()
		physicalIDs := make([]int64, 0, limit+1)
		for rows.Next() {
			var physicalID int64
			var raw []byte
			var item knowledgesdk.KnowledgePageComment
			if e = rows.Scan(&physicalID, &raw); e != nil {
				return e
			}
			if e = unmarshalDurableJSON(raw, &item); e != nil {
				return e
			}
			if item.MentionedUserIDs == nil {
				item.MentionedUserIDs = []string{}
			}
			item.Anchor.Changed = currentAnchors[item.Anchor.NodeID] == "" || currentAnchors[item.Anchor.NodeID] != item.Anchor.BlockSHA256
			physicalIDs = append(physicalIDs, physicalID)
			out.Items = append(out.Items, item)
		}
		if e = rows.Err(); e != nil {
			return e
		}
		if e = rows.Close(); e != nil {
			return e
		}
		if len(out.Items) > limit {
			out.Items = out.Items[:limit]
			out.Complete = false
			out.NextAfter = physicalAfterValue(physicalIDs[limit-1])
		}
		return s.hydrateKnowledgeCommentReactions(ctx, tx, out.Items, a)
	})
	return
}

func (s *Store) SetKnowledgePageCommentReaction(ctx context.Context, libraryID, pageID, commentID string, in knowledgesdk.KnowledgePageCommentReactionWrite, a agentsdk.Authority) (out knowledgesdk.KnowledgePageComment, err error) {
	if !validKnowledgeCommentReaction(in.Emoji) {
		return out, conversationError("bad_request", "page_comment_reaction_invalid")
	}
	if _, err = pageRequestKey("comment_reaction", libraryID, commentID, in.ClientID, a); err != nil {
		return out, err
	}
	err = s.mutateKnowledgeOperation(ctx, "knowledge.page_comment.react", knowledgesdk.ActionPageCommentsReact, libraryID+":"+pageID+":"+commentID+":"+in.Emoji, in.ClientID, in, a, func(tx *sql.Tx) (any, error) {
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
		out, e = s.commentRecord(ctx, tx, libraryID, pageID, commentID, a)
		if e != nil {
			return out, e
		}
		if out.Deleted {
			return out, conversationError("conflict", "page_comment_deleted")
		}
		predicate := query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("comment_id", commentID), query.Equal("user_id", a.UserID), query.Equal("emoji", in.Emoji))
		if in.Active {
			q, args, buildErr := query.NewInsertBuilder(s.store.Renderer(), knowledgePageCommentReactionTable).Columns("scope_key", "comment_id", "user_id", "emoji", "library_id", "page_id", "created_at").Values(libraryScope(a), commentID, a.UserID, in.Emoji, libraryID, pageID, time.Now().UTC().UnixMilli()).OnConflictDoNothing("scope_key", "comment_id", "user_id", "emoji").Build()
			if e = conversationExec(ctx, tx, q, args, buildErr); e != nil {
				return out, e
			}
		} else {
			q, args, buildErr := query.NewDeleteBuilder(s.store.Renderer(), knowledgePageCommentReactionTable).Where(predicate).Build()
			if e = conversationExec(ctx, tx, q, args, buildErr); e != nil {
				return out, e
			}
		}
		items := []knowledgesdk.KnowledgePageComment{out}
		if e = s.hydrateKnowledgeCommentReactions(ctx, tx, items, a); e != nil {
			return out, e
		}
		out = items[0]
		return out, nil
	}, &out)
	return
}

func (s *Store) CreateKnowledgePageComment(ctx context.Context, libraryID, pageID string, in knowledgesdk.KnowledgePageCommentCreate, a agentsdk.Authority) (out knowledgesdk.KnowledgePageComment, err error) {
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
		version, e := s.pageVersion(ctx, tx, pageID, in.PublishedVersion, a)
		if e != nil {
			return out, e
		}
		var anchor knowledgesdk.KnowledgePageCommentAnchor
		var anchorErr error
		switch version.ContentType {
		case knowledgesdk.KnowledgePageTypeDocument:
			anchor, anchorErr = knowledgeDocumentCommentAnchor(version.Body.Content, in.Anchor.NodeID, in.Anchor.Quote)
		case knowledgesdk.KnowledgePageTypeWhiteboard:
			anchor, anchorErr = knowledgeWhiteboardCommentAnchor(version.Body.Content, in.Anchor.NodeID, in.Anchor.Quote)
		case knowledgesdk.KnowledgePageTypeMindMap, knowledgesdk.KnowledgePageTypeFlowchart:
			anchor, anchorErr = knowledgeDiagramCommentAnchor(version.Body.Content, version.ContentType, in.Anchor.NodeID, in.Anchor.Quote)
		default:
			return out, conversationError("bad_request", "page_comment_anchor_unsupported")
		}
		if anchorErr != nil {
			return out, anchorErr
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
		out = knowledgesdk.KnowledgePageComment{ID: id, PageID: pageID, LibraryID: libraryID, ParentCommentID: in.ParentCommentID, PublishedVersion: in.PublishedVersion, Anchor: anchor, Body: strings.TrimSpace(in.Body), MentionedUserIDs: mentions, Reactions: []knowledgesdk.KnowledgeCommentReaction{}, AuthorUserID: a.UserID, Revision: 1, CreatedAt: now, UpdatedAt: now}
		q, args, e := query.NewInsertBuilder(s.store.Renderer(), knowledgePageCommentTable).Columns("scope_key", "comment_id", "library_id", "page_id", "parent_comment_id", "author_user_id", "resolved", "revision", "updated_at", "request_key", "request_hash", "payload_json").Values(libraryScope(a), id, libraryID, pageID, in.ParentCommentID, a.UserID, false, 1, now.UnixMilli(), requestKey, requestHash, conversationJSON(out)).Build()
		if e = conversationExec(ctx, tx, q, args, e); e != nil {
			return out, e
		}
		return out, nil
	}, &out)
	return
}

func (s *Store) saveComment(ctx context.Context, tx *sql.Tx, comment *knowledgesdk.KnowledgePageComment, expected int64, a agentsdk.Authority) error {
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

func (s *Store) mutatePageComment(ctx context.Context, libraryID, pageID, commentID, kind, action, clientID string, input any, expected int64, a agentsdk.Authority, mutate func(*sql.Tx, *knowledgesdk.KnowledgePageComment, agentsdk.KnowledgeLibrary) error) (out knowledgesdk.KnowledgePageComment, err error) {
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
		comments := []knowledgesdk.KnowledgePageComment{out}
		if e = s.hydrateKnowledgeCommentReactions(ctx, tx, comments, a); e != nil {
			return out, e
		}
		out = comments[0]
		return out, nil
	}, &out)
	return
}

func (s *Store) UpdateKnowledgePageComment(ctx context.Context, libraryID, pageID, commentID string, in knowledgesdk.KnowledgePageCommentUpdate, a agentsdk.Authority) (knowledgesdk.KnowledgePageComment, error) {
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

func (s *Store) ResolveKnowledgePageComment(ctx context.Context, libraryID, pageID, commentID string, in knowledgesdk.KnowledgePageCommentResolve, a agentsdk.Authority) (knowledgesdk.KnowledgePageComment, error) {
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

func (s *Store) DeleteKnowledgePageComment(ctx context.Context, libraryID, pageID, commentID string, in knowledgesdk.KnowledgePageCommentDelete, a agentsdk.Authority) (knowledgesdk.KnowledgePageComment, error) {
	if _, err := pageRequestKey("comment_delete", libraryID, commentID, in.ClientID, a); err != nil {
		return knowledgesdk.KnowledgePageComment{}, err
	}
	return s.mutatePageComment(ctx, libraryID, pageID, commentID, "knowledge.page_comment.delete", knowledgesdk.ActionPageCommentsDelete, in.ClientID, in, in.ExpectedRevision, a, func(_ *sql.Tx, comment *knowledgesdk.KnowledgePageComment, _ agentsdk.KnowledgeLibrary) error {
		comment.Deleted, comment.Body, comment.MentionedUserIDs = true, "", []string{}
		return nil
	})
}
