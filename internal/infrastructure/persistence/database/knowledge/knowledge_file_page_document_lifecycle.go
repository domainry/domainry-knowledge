package store

import (
	"context"
	"database/sql"
	"strconv"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
	"github.com/domainry/domainry-orm/query"
)

func knowledgeFilePageRemoteID(record persistence.KnowledgeDocumentRecord, generation int64) string {
	prefix := "local_"
	if record.SourceID != "" {
		prefix = "dka_"
	}
	return prefix + conversationHash([]string{
		record.SourceID,
		libraryScope(record.Actor),
		record.Document.ID,
		record.Document.SHA256,
		strconv.FormatInt(generation, 10),
	})
}

func reopenPageLifecycleDocument(record *persistence.KnowledgeDocumentRecord) error {
	if record.BodyRef == "" || record.SecurityScanCompleted && record.Document.SecurityStatus != "clean" {
		return conversationError("conflict", "page_file_content_unavailable")
	}
	generation := record.Document.IndexGeneration + 1
	if generation < 1 {
		generation = 1
	}
	record.RemoteID = knowledgeFilePageRemoteID(*record, generation)
	record.PutRequestID = ""
	record.PutStarted = false
	record.PutRecoveryAttempts = 0
	record.PutAcknowledged = false
	record.IndexObserved = false
	record.DeleteStarted = false
	record.DeleteAcknowledged = false
	record.ResumeAfterDelete = false
	record.Reindex = nil
	record.RetiredRemoteID = ""
	record.RetiredDeleteStarted = false
	record.RetiredDeleteAcknowledged = false
	record.Document.IndexGeneration = generation
	record.Document.IndexStatus = ""
	record.Document.Reindexing = false
	if record.SecurityScanCompleted {
		record.Document.State = "queued"
		record.Document.ProcessingStage = "parse"
	} else {
		record.SecurityScanStarted = false
		record.Document.SecurityStatus = "pending"
		record.Document.SecurityScanner = ""
		record.Document.SecurityReportSHA256 = ""
		record.Document.State = "quarantined"
		record.Document.ProcessingStage = "scan"
	}
	record.Document.ErrorCode = ""
	if record.SourceID != "" {
		record.PutRequestID = knowledgeDocumentPutRequestID(*record)
	}
	return nil
}

func (s *Store) activeFilePageReferences(ctx context.Context, tx *sql.Tx, libraryID, documentID string, a agentsdk.Authority) (int, error) {
	q, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgePageAttachmentTable).
		Columns("page_id").
		Where(query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("library_id", libraryID), query.Equal("document_id", documentID))).
		OrderBy(query.Ascending("page_id")).
		Limit(1001).
		Build()
	if err != nil {
		return 0, err
	}
	rows, err := tx.QueryContext(ctx, q, args...)
	if err != nil {
		return 0, err
	}
	pageIDs := make([]string, 0)
	for rows.Next() {
		var pageID string
		if err = rows.Scan(&pageID); err != nil {
			rows.Close()
			return 0, err
		}
		pageIDs = append(pageIDs, pageID)
	}
	if err = rows.Err(); err != nil {
		rows.Close()
		return 0, err
	}
	if err = rows.Close(); err != nil {
		return 0, err
	}
	if len(pageIDs) > 1000 {
		return 0, conversationError("conflict", "page_attachment_limit")
	}
	active := 0
	for _, pageID := range pageIDs {
		page, readErr := s.pageRecord(ctx, tx, libraryID, pageID, a)
		if readErr != nil {
			return 0, readErr
		}
		// The attachment is the authorization boundary for an original file.
		// An active draft File Page must retain its original before its first
		// publish; otherwise SetAttachment retires the document in the small
		// window before SaveDraft writes the document reference.
		if page.ContentType != knowledgePageTypeFile || page.State != "active" {
			continue
		}
		active++
	}
	return active, nil
}

func (s *Store) reconcileFilePageDocumentLifecycle(ctx context.Context, tx *sql.Tx, libraryID, documentID string, a agentsdk.Authority) error {
	record, err := s.documentRecord(ctx, tx, documentID, a)
	if err != nil {
		return err
	}
	if record.Document.LibraryID != libraryID || record.Document.ProjectionKind != "file" {
		return conversationError("not_found", "document_not_found")
	}
	before := conversationHash(record)
	active, err := s.activeFilePageReferences(ctx, tx, libraryID, documentID, a)
	if err != nil {
		return err
	}
	record.PageLifecycleManaged = true
	if active == 0 {
		record.ResumeAfterDelete = false
		switch record.Document.State {
		case "deleted":
			if before == conversationHash(record) {
				return nil
			}
			return s.saveDocumentRecord(ctx, tx, &record, record.Document.Revision)
		case "deleting":
			if before != conversationHash(record) {
				if err = s.saveDocumentRecord(ctx, tx, &record, record.Document.Revision); err != nil {
					return err
				}
			}
			return s.queueDocumentWork(ctx, tx, record)
		default:
			return s.retireKnowledgeDocument(ctx, tx, &record, record.Document.Revision)
		}
	}
	switch record.Document.State {
	case "deleting":
		if record.ResumeAfterDelete {
			return nil
		}
		record.ResumeAfterDelete = true
		if err = s.saveDocumentRecord(ctx, tx, &record, record.Document.Revision); err != nil {
			return err
		}
		return s.queueDocumentWork(ctx, tx, record)
	case "deleted":
		if err = reopenPageLifecycleDocument(&record); err != nil {
			return err
		}
		if err = s.saveDocumentRecord(ctx, tx, &record, record.Document.Revision); err != nil {
			return err
		}
		return s.queueDocumentWork(ctx, tx, record)
	default:
		record.ResumeAfterDelete = false
		if before == conversationHash(record) {
			return nil
		}
		return s.saveDocumentRecord(ctx, tx, &record, record.Document.Revision)
	}
}

func (s *Store) reconcileFilePageAttachments(ctx context.Context, tx *sql.Tx, page agentsdk.KnowledgePage, a agentsdk.Authority) error {
	if page.ContentType != knowledgePageTypeFile {
		return nil
	}
	q, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgePageAttachmentTable).
		Columns("document_id").
		Where(query.And(pageScope(a, page.ID), query.Equal("library_id", page.LibraryID))).
		OrderBy(query.Ascending("document_id")).
		Limit(1001).
		Build()
	if err != nil {
		return err
	}
	rows, err := tx.QueryContext(ctx, q, args...)
	if err != nil {
		return err
	}
	documentIDs := make([]string, 0)
	for rows.Next() {
		var documentID string
		if err = rows.Scan(&documentID); err != nil {
			rows.Close()
			return err
		}
		documentIDs = append(documentIDs, documentID)
	}
	if err = rows.Err(); err != nil {
		rows.Close()
		return err
	}
	if err = rows.Close(); err != nil {
		return err
	}
	if len(documentIDs) > 1000 {
		return conversationError("conflict", "page_attachment_limit")
	}
	for _, documentID := range documentIDs {
		if err = s.reconcileFilePageDocumentLifecycle(ctx, tx, page.LibraryID, documentID, a); err != nil {
			return err
		}
	}
	return nil
}
