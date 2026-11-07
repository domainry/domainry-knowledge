package store

import (
	"context"
	"database/sql"
	"reflect"
	"strconv"
	"time"

	"github.com/domainry/domainry-foundation/entityid"
	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
	"github.com/domainry/domainry-orm/query"
)

func knowledgeFilePageRemoteID(record persistence.KnowledgeDocumentRecord, generation int64) string {
	if record.Document.ProjectionKind == "page_attachment" && record.PageProjection != nil && record.DocumentOrigin != nil {
		return knowledgePageAttachmentProjectionRemoteID(
			record.SourceID, record.Actor, record.PageProjection.PageID, record.DocumentOrigin.DocumentID,
			record.PageProjection.Version, record.PageProjection.AccessRevision, generation, record.Document.SHA256)
	}
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

func knowledgePageAttachmentProjectionDocumentID(a agentsdk.Authority, pageID, documentID string) (string, error) {
	return entityid.Derive("kdoc", "knowledge.page_attachment_projection_document", a.RuntimeID, a.WorkspaceID, pageID, documentID)
}

func knowledgePageAttachmentProjectionRemoteID(sourceID string, a agentsdk.Authority, pageID, documentID string, version, accessRevision, generation int64, sha256 string) string {
	return "dka_" + conversationHash([]any{"knowledge.page_attachment_projection.v1", sourceID, libraryScope(a), pageID, documentID, version, accessRevision, generation, sha256})
}

func (s *Store) pageAttachmentLinked(ctx context.Context, tx *sql.Tx, pageID, documentID string, a agentsdk.Authority) (bool, error) {
	q, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgePageAttachmentTable).
		Projections(query.Project(query.CountAll())).
		Where(pageAttachmentScope(a, pageID, documentID)).
		Build()
	if err != nil {
		return false, err
	}
	var count int
	if err = tx.QueryRowContext(ctx, q, args...).Scan(&count); err != nil {
		return false, err
	}
	return count == 1, nil
}

func (s *Store) retirePageAttachmentProjection(ctx context.Context, tx *sql.Tx, page agentsdk.KnowledgePage, documentID string, a agentsdk.Authority) error {
	projectionID, err := knowledgePageAttachmentProjectionDocumentID(a, page.ID, documentID)
	if err != nil {
		return err
	}
	var record persistence.KnowledgeDocumentRecord
	found, err := s.executionRead(ctx, tx, knowledgeDocumentTable, documentScope(a, projectionID), &record)
	if err != nil || !found || record.Document.State == "deleted" {
		return err
	}
	if record.Document.ProjectionKind != "page_attachment" || record.PageProjection == nil || record.PageProjection.PageID != page.ID || record.DocumentOrigin == nil || record.DocumentOrigin.DocumentID != documentID {
		return conversationError("conflict", "page_attachment_projection_identity_conflict")
	}
	record.ResumeAfterDelete = false
	if record.Document.State == "deleting" {
		if err = s.saveDocumentRecord(ctx, tx, &record, record.Document.Revision); err != nil {
			return err
		}
		return s.queueDocumentWork(ctx, tx, record)
	}
	return s.retireKnowledgeDocument(ctx, tx, &record, record.Document.Revision)
}

func (s *Store) reconcilePageAttachmentProjection(ctx context.Context, tx *sql.Tx, page agentsdk.KnowledgePage, documentID string, a agentsdk.Authority) error {
	linked, err := s.pageAttachmentLinked(ctx, tx, page.ID, documentID, a)
	if err != nil {
		return err
	}
	if !linked || page.State != "active" || page.PublishedVersion < 1 {
		return s.retirePageAttachmentProjection(ctx, tx, page, documentID, a)
	}
	source, err := s.documentRecord(ctx, tx, documentID, a)
	if err != nil {
		return err
	}
	if source.Document.LibraryID != page.LibraryID || source.Document.ProjectionKind != "file" || source.BodyRef == "" || (source.Document.State == "deleting" || source.Document.State == "deleted") && !source.PageLifecycleManaged {
		return conversationError("not_found", "document_not_found")
	}
	if source.SecurityScanCompleted && source.Document.SecurityStatus != "clean" {
		return conversationError("conflict", "page_attachment_content_unavailable")
	}
	version, err := s.pageVersion(ctx, tx, page.ID, page.PublishedVersion, a)
	if err != nil {
		return err
	}
	access, err := s.knowledgePageAccessPolicy(ctx, tx, page.LibraryID, page.ID, a)
	if err != nil {
		return err
	}
	library, err := s.libraryRecord(ctx, tx, page.LibraryID, a)
	if err != nil {
		return err
	}
	sourceID, err := s.documentLibrarySource(ctx, tx, page.LibraryID, a)
	if err != nil {
		return err
	}
	if sourceID == "" || source.SourceID != sourceID {
		return conversationError("unavailable", "document_management_unavailable")
	}
	publishedPage := page
	publishedPage.Title, publishedPage.ParentPageID, publishedPage.Rank = version.Title, version.ParentPageID, version.Rank
	breadcrumbs, err := s.pageBreadcrumbs(ctx, tx, publishedPage, true, a)
	if err != nil {
		return err
	}
	projectionID, err := knowledgePageAttachmentProjectionDocumentID(a, page.ID, documentID)
	if err != nil {
		return err
	}
	origin := persistence.KnowledgePageProjectionOrigin{
		PageID: page.ID, Version: version.Version, AccessRevision: access.Revision,
		PermissionID: knowledgePagePermissionToken(a, page.ID), Title: version.Title,
		ContentType: version.ContentType, LibraryKind: library.Kind, Breadcrumbs: breadcrumbs,
	}
	now := time.Now().UTC().Truncate(time.Millisecond)
	var record persistence.KnowledgeDocumentRecord
	found, err := s.executionRead(ctx, tx, knowledgeDocumentTable, documentScope(a, projectionID), &record)
	if err != nil {
		return err
	}
	if !found {
		state, stage, securityStatus := "quarantined", "scan", "pending"
		scanStarted, scanCompleted := false, false
		securityScanner, securityReport := "", ""
		if source.SecurityScanCompleted {
			state, stage, securityStatus = "queued", "parse", "clean"
			scanStarted, scanCompleted = true, true
			securityScanner, securityReport = source.Document.SecurityScanner, source.Document.SecurityReportSHA256
		}
		remoteID := knowledgePageAttachmentProjectionRemoteID(sourceID, a, page.ID, documentID, version.Version, access.Revision, 1, source.Document.SHA256)
		record = persistence.KnowledgeDocumentRecord{
			DocumentOrigin: &persistence.KnowledgeDocumentOrigin{LibraryID: page.LibraryID, DocumentID: documentID, Revision: source.Document.Revision, Mode: "copy"},
			PageProjection: &origin,
			Document: agentsdk.KnowledgeDocument{
				ID: projectionID, LibraryID: page.LibraryID, ProjectionKind: "page_attachment",
				OriginPageID: page.ID, OriginPageVersion: version.Version, Filename: source.Document.Filename,
				ContentType: source.Document.ContentType, Bytes: source.Document.Bytes, SHA256: source.Document.SHA256,
				ContentVersion: source.Document.ContentVersion, IndexGeneration: 1, CreatedByUserID: version.PublishedByUserID,
				State: state, ProcessingStage: stage, SecurityStatus: securityStatus,
				SecurityScanner: securityScanner, SecurityReportSHA256: securityReport,
				Revision: 1, CreatedAt: now, UpdatedAt: now,
			},
			Actor: a, RequestSHA256: conversationHash([]any{origin, documentID, source.Document.SHA256}),
			SourceID: sourceID, AccessPolicySHA256: source.AccessPolicySHA256, SourceAccess: cloneDocumentSourceAccess(source.SourceAccess),
			RemoteID: remoteID, BodyRef: source.BodyRef, SecurityScanStarted: scanStarted, SecurityScanCompleted: scanCompleted,
			PageLifecycleManaged: true,
		}
		record.PutRequestID = knowledgeDocumentPutRequestID(record)
		q, args, buildErr := query.NewInsertBuilder(s.store.Renderer(), knowledgeDocumentTable).
			Columns("scope_key", "document_id", "runtime_id", "library_id", "projection_kind", "source_key", "remote_id", "state", "revision", "bytes", "updated_at", "payload_json").
			Values(libraryScope(a), projectionID, a.RuntimeID, page.LibraryID, "page_attachment", sourceID, remoteID, state, 1, source.Document.Bytes, now.UnixMilli(), conversationJSON(record)).
			Build()
		if err = conversationExec(ctx, tx, q, args, buildErr); err != nil {
			return err
		}
		return s.queueDocumentWork(ctx, tx, record)
	}
	if record.Document.ProjectionKind != "page_attachment" || record.PageProjection == nil || record.PageProjection.PageID != page.ID || record.DocumentOrigin == nil || record.DocumentOrigin.DocumentID != documentID || record.SourceID != sourceID {
		return conversationError("conflict", "page_attachment_projection_identity_conflict")
	}
	if record.Document.State == "deleting" {
		record.DocumentOrigin = &persistence.KnowledgeDocumentOrigin{LibraryID: page.LibraryID, DocumentID: documentID, Revision: source.Document.Revision, Mode: "copy"}
		record.PageProjection = &origin
		record.Actor, record.BodyRef = a, source.BodyRef
		record.Document.Filename, record.Document.ContentType = source.Document.Filename, source.Document.ContentType
		record.Document.Bytes, record.Document.SHA256, record.Document.ContentVersion = source.Document.Bytes, source.Document.SHA256, source.Document.ContentVersion
		record.Document.OriginPageID, record.Document.OriginPageVersion = page.ID, version.Version
		record.ResumeAfterDelete, record.PageLifecycleManaged = true, true
		if err = s.saveDocumentRecord(ctx, tx, &record, record.Document.Revision); err != nil {
			return err
		}
		return s.queueDocumentWork(ctx, tx, record)
	}
	if record.Document.State == "deleted" {
		revision := record.Document.Revision
		record.DocumentOrigin = &persistence.KnowledgeDocumentOrigin{LibraryID: page.LibraryID, DocumentID: documentID, Revision: source.Document.Revision, Mode: "copy"}
		record.PageProjection, record.Replacement = &origin, nil
		record.Actor, record.BodyRef = a, source.BodyRef
		record.Document.Filename, record.Document.ContentType = source.Document.Filename, source.Document.ContentType
		record.Document.Bytes, record.Document.SHA256, record.Document.ContentVersion = source.Document.Bytes, source.Document.SHA256, source.Document.ContentVersion
		record.Document.OriginPageID, record.Document.OriginPageVersion = page.ID, version.Version
		record.Document.IndexGeneration++
		if record.Document.IndexGeneration < 1 {
			record.Document.IndexGeneration = 1
		}
		record.RemoteID = knowledgePageAttachmentProjectionRemoteID(sourceID, a, page.ID, documentID, version.Version, access.Revision, record.Document.IndexGeneration, source.Document.SHA256)
		record.RequestSHA256 = conversationHash([]any{origin, documentID, source.Document.SHA256})
		record.PutRequestID = knowledgeDocumentPutRequestID(record)
		record.PutStarted, record.PutAcknowledged, record.IndexObserved = false, false, false
		record.PutRecoveryAttempts, record.DeleteStarted, record.DeleteAcknowledged = 0, false, false
		record.ResumeAfterDelete, record.PageLifecycleManaged = false, true
		record.Reindex, record.RetiredRemoteID = nil, ""
		record.RetiredDeleteStarted, record.RetiredDeleteAcknowledged = false, false
		record.Document.IndexStatus, record.Document.ErrorCode, record.Document.Reindexing = "", "", false
		if source.SecurityScanCompleted {
			record.SecurityScanStarted, record.SecurityScanCompleted = true, true
			record.Document.State, record.Document.ProcessingStage, record.Document.SecurityStatus = "queued", "parse", "clean"
			record.Document.SecurityScanner, record.Document.SecurityReportSHA256 = source.Document.SecurityScanner, source.Document.SecurityReportSHA256
		} else {
			record.SecurityScanStarted, record.SecurityScanCompleted = false, false
			record.Document.State, record.Document.ProcessingStage, record.Document.SecurityStatus = "quarantined", "scan", "pending"
			record.Document.SecurityScanner, record.Document.SecurityReportSHA256 = "", ""
		}
		if err = s.saveDocumentRecord(ctx, tx, &record, revision); err != nil {
			return err
		}
		return s.queueDocumentWork(ctx, tx, record)
	}
	if reflect.DeepEqual(*record.PageProjection, origin) && record.Document.SHA256 == source.Document.SHA256 && record.BodyRef == source.BodyRef {
		return nil
	}
	if record.Document.State != "ready" || record.Reindex != nil || record.RetiredRemoteID != "" || record.DeleteStarted {
		return conversationError("conflict", "page_attachment_projection_busy")
	}
	record.Actor = a
	record.DocumentOrigin = &persistence.KnowledgeDocumentOrigin{LibraryID: page.LibraryID, DocumentID: documentID, Revision: source.Document.Revision, Mode: "copy"}
	record.Replacement = &persistence.KnowledgeDocumentReplacement{PageProjection: origin, Filename: source.Document.Filename, Bytes: source.Document.Bytes, SHA256: source.Document.SHA256, ContentVersion: source.Document.ContentVersion, BodyRef: source.BodyRef}
	generation := record.Document.IndexGeneration + 1
	remoteID := knowledgePageAttachmentProjectionRemoteID(sourceID, a, page.ID, documentID, version.Version, access.Revision, generation, source.Document.SHA256)
	record.Reindex = &persistence.KnowledgeDocumentReindex{Generation: generation, RemoteID: remoteID, PutRequestID: "kput_" + conversationHash([]any{sourceID, remoteID, version.Version, documentID, source.Document.SHA256})}
	record.Document.Reindexing, record.Document.ProcessingStage = true, "index"
	if err = s.saveDocumentRecord(ctx, tx, &record, record.Document.Revision); err != nil {
		return err
	}
	return s.queueDocumentWork(ctx, tx, record)
}

func (s *Store) reconcileKnowledgePageAttachment(ctx context.Context, tx *sql.Tx, page agentsdk.KnowledgePage, documentID string, a agentsdk.Authority) error {
	if page.ContentType == knowledgePageTypeFile {
		return s.reconcileFilePageDocumentLifecycle(ctx, tx, page.LibraryID, documentID, a)
	}
	return s.reconcilePageAttachmentProjection(ctx, tx, page, documentID, a)
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

func (s *Store) reconcilePageAttachments(ctx context.Context, tx *sql.Tx, page agentsdk.KnowledgePage, a agentsdk.Authority) error {
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
		if err = s.reconcileKnowledgePageAttachment(ctx, tx, page, documentID, a); err != nil {
			return err
		}
	}
	return nil
}

func (s *Store) reconcileFilePageAttachments(ctx context.Context, tx *sql.Tx, page agentsdk.KnowledgePage, a agentsdk.Authority) error {
	if page.ContentType != knowledgePageTypeFile {
		return nil
	}
	return s.reconcilePageAttachments(ctx, tx, page, a)
}

func (s *Store) reconcileDocumentPageAttachments(ctx context.Context, tx *sql.Tx, page agentsdk.KnowledgePage, a agentsdk.Authority) error {
	if page.ContentType == knowledgePageTypeFile {
		return nil
	}
	return s.reconcilePageAttachments(ctx, tx, page, a)
}
