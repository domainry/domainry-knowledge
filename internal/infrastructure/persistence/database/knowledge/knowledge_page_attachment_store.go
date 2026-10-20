package store

import (
	"context"
	"database/sql"
	"errors"
	"time"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-orm/query"
)

func pageAttachmentScope(a agentsdk.ConversationAuthority, pageID, documentID string) query.Predicate {
	return query.And(pageScope(a, pageID), query.Equal("document_id", documentID))
}

func (s *Store) KnowledgePageAttachments(ctx context.Context, libraryID, pageID string, a agentsdk.ConversationAuthority) (out knowledgesdk.KnowledgePageAttachmentPage, err error) {
	out.Items = []knowledgesdk.KnowledgePageAttachment{}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		if _, e := s.libraryRecord(ctx, tx, libraryID, a); e != nil {
			return e
		}
		if _, e := s.pageRecord(ctx, tx, libraryID, pageID, a); e != nil {
			return e
		}
		q, args, e := query.NewSelectBuilder(s.store.Renderer(), knowledgePageAttachmentTable).Columns("payload_json").Where(query.And(pageScope(a, pageID), query.Equal("library_id", libraryID))).OrderBy(query.Ascending("rank"), query.Ascending("document_id")).Limit(1001).Build()
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
			var item knowledgesdk.KnowledgePageAttachment
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
		if len(out.Items) > 1000 {
			return conversationError("conflict", "page_attachment_limit")
		}
		return nil
	})
	return
}

func (s *Store) SetKnowledgePageAttachment(ctx context.Context, libraryID, pageID, documentID string, in knowledgesdk.KnowledgePageAttachmentWrite, a agentsdk.ConversationAuthority) (out knowledgesdk.KnowledgePageAttachment, err error) {
	if !executionText(in.Title, 256, false) || !validPageRank(in.Rank, true) {
		return out, conversationError("bad_request", "page_attachment_invalid")
	}
	if _, err = pageRequestKey("attachment_set", libraryID, pageID+":"+documentID, in.ClientID, a); err != nil {
		return out, err
	}
	err = s.mutateKnowledgeOperation(ctx, "knowledge.page_attachment.set", knowledgesdk.ActionPageAttachmentsSet, libraryID+":"+pageID+":"+documentID, in.ClientID, in, a, func(tx *sql.Tx) (any, error) {
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
		document, e := s.documentRecord(ctx, tx, documentID, a)
		if e != nil || document.Document.LibraryID != libraryID || document.Document.ProjectionKind != "file" || document.Document.State == "deleted" || document.Document.State == "deleting" {
			return out, conversationError("not_found", "document_not_found")
		}
		predicate := pageAttachmentScope(a, pageID, documentID)
		var prior knowledgesdk.KnowledgePageAttachment
		found, e := s.executionRead(ctx, tx, knowledgePageAttachmentTable, predicate, &prior)
		if e != nil {
			return out, e
		}
		if found {
			prior.Title, prior.Rank = in.Title, in.Rank
			q, args, buildErr := query.NewUpdateBuilder(s.store.Renderer(), knowledgePageAttachmentTable).Set("rank", prior.Rank).Set("payload_json", conversationJSON(prior)).Where(predicate).Build()
			if e = conversationExec(ctx, tx, q, args, buildErr); e != nil {
				return out, e
			}
			out = prior
			return out, nil
		}
		now := time.Now().UTC().Truncate(time.Millisecond)
		out = knowledgesdk.KnowledgePageAttachment{PageID: pageID, LibraryID: libraryID, DocumentID: documentID, Title: in.Title, Rank: in.Rank, CreatedByUserID: a.UserID, CreatedAt: now}
		q, args, e := query.NewInsertBuilder(s.store.Renderer(), knowledgePageAttachmentTable).Columns("scope_key", "page_id", "document_id", "library_id", "rank", "payload_json").Values(libraryScope(a), pageID, documentID, libraryID, in.Rank, conversationJSON(out)).Build()
		if e = conversationExec(ctx, tx, q, args, e); e != nil {
			return out, e
		}
		return out, nil
	}, &out)
	return
}

func (s *Store) RemoveKnowledgePageAttachment(ctx context.Context, libraryID, pageID, documentID string, in knowledgesdk.KnowledgePageAttachmentRemove, a agentsdk.ConversationAuthority) (err error) {
	if _, err = pageRequestKey("attachment_remove", libraryID, pageID+":"+documentID, in.ClientID, a); err != nil {
		return err
	}
	var receipt struct {
		Removed bool `json:"removed"`
	}
	err = s.mutateKnowledgeOperation(ctx, "knowledge.page_attachment.remove", knowledgesdk.ActionPageAttachmentsRemove, libraryID+":"+pageID+":"+documentID, in.ClientID, in, a, func(tx *sql.Tx) (any, error) {
		library, e := s.libraryRecord(ctx, tx, libraryID, a)
		if e != nil {
			return receipt, e
		}
		if e = requirePageWriting(library); e != nil {
			return receipt, e
		}
		page, pageErr := s.pageRecord(ctx, tx, libraryID, pageID, a)
		if pageErr != nil {
			return receipt, pageErr
		}
		if page.State != "active" {
			return receipt, conversationError("conflict", "page_archived")
		}
		q, args, e := query.NewDeleteBuilder(s.store.Renderer(), knowledgePageAttachmentTable).Where(pageAttachmentScope(a, pageID, documentID)).Build()
		if e != nil {
			return receipt, e
		}
		result, e := tx.ExecContext(ctx, q, args...)
		if e != nil {
			return receipt, e
		}
		rows, e := result.RowsAffected()
		if e != nil {
			return receipt, e
		}
		if rows != 1 {
			return receipt, conversationError("not_found", "page_attachment_not_found")
		}
		receipt.Removed = true
		return receipt, nil
	}, &receipt)
	if errors.Is(err, sql.ErrNoRows) {
		return conversationError("not_found", "page_attachment_not_found")
	}
	return err
}
