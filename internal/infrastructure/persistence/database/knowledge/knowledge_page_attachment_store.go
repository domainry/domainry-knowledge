package store

import (
	"context"
	"database/sql"
	"errors"
	"time"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-orm/query"
)

func pageAttachmentScope(a agentsdk.Authority, pageID, documentID string) query.Predicate {
	return query.And(pageScope(a, pageID), query.Equal("document_id", documentID))
}

func (s *Store) validateKnowledgeFilePageReference(ctx context.Context, db conversationDB, libraryID, pageID, content string, a agentsdk.Authority) error {
	reference, err := decodeFilePageContent(content)
	if err != nil {
		return err
	}
	q, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgePageAttachmentTable).Projections(query.Project(query.CountAll())).Where(query.And(pageScope(a, pageID), query.Equal("library_id", libraryID), query.Equal("document_id", reference.DocumentID))).Build()
	if err != nil {
		return err
	}
	var count int
	if err = db.QueryRowContext(ctx, q, args...).Scan(&count); err != nil {
		return err
	}
	if count != 1 {
		return conversationError("not_found", "page_file_reference_not_found")
	}
	return nil
}

func (s *Store) copyKnowledgePageAttachments(ctx context.Context, tx *sql.Tx, sourcePageID, targetPageID string, now time.Time, a agentsdk.Authority) error {
	q, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgePageAttachmentTable).Columns("payload_json").Where(pageScope(a, sourcePageID)).OrderBy(query.Ascending("rank"), query.Ascending("document_id")).Limit(1001).Build()
	if err != nil {
		return err
	}
	rows, err := tx.QueryContext(ctx, q, args...)
	if err != nil {
		return err
	}
	items := make([]knowledgesdk.KnowledgePageAttachment, 0)
	for rows.Next() {
		var raw []byte
		var item knowledgesdk.KnowledgePageAttachment
		if err = rows.Scan(&raw); err != nil {
			rows.Close()
			return err
		}
		if err = unmarshalDurableJSON(raw, &item); err != nil {
			rows.Close()
			return err
		}
		items = append(items, item)
	}
	if err = rows.Err(); err != nil {
		rows.Close()
		return err
	}
	if err = rows.Close(); err != nil {
		return err
	}
	if len(items) > 1000 {
		return conversationError("conflict", "page_attachment_limit")
	}
	for _, item := range items {
		item.PageID, item.CreatedByUserID, item.CreatedAt = targetPageID, a.UserID, now
		q, args, err = query.NewInsertBuilder(s.store.Renderer(), knowledgePageAttachmentTable).Columns("scope_key", "page_id", "document_id", "library_id", "rank", "payload_json").Values(libraryScope(a), targetPageID, item.DocumentID, item.LibraryID, item.Rank, conversationJSON(item)).Build()
		if err = conversationExec(ctx, tx, q, args, err); err != nil {
			return err
		}
	}
	return nil
}

func (s *Store) KnowledgePageAttachments(ctx context.Context, libraryID, pageID string, a agentsdk.Authority) (out knowledgesdk.KnowledgePageAttachmentPage, err error) {
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

func (s *Store) SetKnowledgePageAttachment(ctx context.Context, libraryID, pageID, documentID string, in knowledgesdk.KnowledgePageAttachmentWrite, a agentsdk.Authority) (out knowledgesdk.KnowledgePageAttachment, err error) {
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

func (s *Store) RemoveKnowledgePageAttachment(ctx context.Context, libraryID, pageID, documentID string, in knowledgesdk.KnowledgePageAttachmentRemove, a agentsdk.Authority) (err error) {
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
