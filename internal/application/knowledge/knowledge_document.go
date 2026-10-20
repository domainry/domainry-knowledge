package application

import (
	"context"
	"encoding/hex"
	"errors"
	"io"
	"strconv"
	"strings"
	"time"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func DocumentStorageScope(library string, a agentsdk.ConversationAuthority) agentsdk.KnowledgeDocumentStorageScope {
	return agentsdk.KnowledgeDocumentStorageScope{RuntimeID: a.RuntimeID, WorkspaceID: a.WorkspaceID, LibraryID: library}
}

func DocumentAccessPolicy(source any) string {
	if policy, ok := source.(agentsdk.KnowledgeDocumentAccessPolicySource); ok {
		return policy.KnowledgeDocumentAccessPolicySHA256()
	}
	return ""
}
func DocumentOriginalMaximumBytes() int64 {
	return agentsdk.KnowledgeDocumentMaximumBytes
}

func DocumentIndexMaximumBytes(source any) int64 {
	maxBytes := agentsdk.KnowledgeDocumentMaximumBytes
	if limit, ok := source.(agentsdk.KnowledgeDocumentIndexLimitSource); ok {
		if n := limit.KnowledgeDocumentIndexMaximumBytes(); n > 0 && n < maxBytes {
			maxBytes = n
		}
	}
	return maxBytes
}
func (s *Service) DocumentAccess(ctx context.Context, library, op string, a agentsdk.ConversationAuthority) (persistence.KnowledgeDocumentRepository, error) {
	libs, err := s.LibraryAccess(ctx, op, a)
	if err != nil {
		return nil, err
	}
	repo, ok := s.repo.(persistence.KnowledgeDocumentRepository)
	if !ok || s.options.DocumentStorage == nil {
		return nil, conversationFailure("unavailable", "documents_unavailable")
	}
	item, err := libs.KnowledgeLibrary(ctx, library, a)
	if err != nil {
		return nil, err
	}
	if err = s.LibraryAuthorize(ctx, op, item, a); err != nil {
		return nil, err
	}
	return repo, nil
}
func (s *Service) DocumentBinding(ctx context.Context, library string, a agentsdk.ConversationAuthority) (agentsdk.ManagedKnowledgeDocumentSource, error) {
	if resolver, ok := s.options.Knowledge.(*LibraryKnowledgeSource); ok {
		Binding, found, err := resolver.Binding(ctx, library, a)
		if err != nil {
			return nil, err
		}
		if found && Binding.ManageDocuments {
			if source, ok := Binding.Source.(agentsdk.ManagedKnowledgeDocumentSource); ok && source.KnowledgeDocumentManagementReady() == nil {
				return source, nil
			}
		}
		return nil, conversationFailure("unavailable", "document_management_unavailable")
	}
	for _, b := range s.options.LibraryKnowledge {
		if b.LibraryID != library || b.WorkspaceID != a.WorkspaceID || a.RuntimeID != s.runtimeID || !b.ManageDocuments {
			continue
		}
		source, ok := b.Source.(agentsdk.ManagedKnowledgeDocumentSource)
		if !ok || source.KnowledgeDocumentManagementReady() != nil {
			break
		}
		return source, nil
	}
	return nil, conversationFailure("unavailable", "document_management_unavailable")
}
func (s *Service) UploadKnowledgeDocument(ctx context.Context, library string, in agentsdk.KnowledgeDocumentUpload, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeDocument, error) {
	return s.uploadDocumentContent(ctx, library, in, nil, nil, nil, nil, a)
}
func (s *Service) UploadKnowledgeDocumentForSource(ctx context.Context, library string, in agentsdk.KnowledgeDocumentUpload, source agentsdk.KnowledgeDocumentSourceAccess, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeDocument, error) {
	return s.uploadDocumentContent(ctx, library, in, nil, nil, nil, &source, a)
}
func (s *Service) UploadDocumentContent(ctx context.Context, library string, in agentsdk.KnowledgeDocumentUpload, origin *persistence.KnowledgeAttachmentOrigin, documentOrigin *persistence.KnowledgeDocumentOrigin, recheck func() error, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeDocument, error) {
	return s.uploadDocumentContent(ctx, library, in, origin, documentOrigin, recheck, nil, a)
}
func (s *Service) uploadDocumentContent(ctx context.Context, library string, in agentsdk.KnowledgeDocumentUpload, origin *persistence.KnowledgeAttachmentOrigin, documentOrigin *persistence.KnowledgeDocumentOrigin, recheck func() error, sourceAccess *agentsdk.KnowledgeDocumentSourceAccess, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeDocument, error) {
	return s.commitDocumentContent(ctx, library, in.ClientID, in.Filename, in.Bytes, in.SHA256, origin, documentOrigin, recheck, sourceAccess, a, func(scope agentsdk.KnowledgeDocumentStorageScope, id string) (string, error) {
		return s.options.DocumentStorage.PutKnowledgeDocumentContent(ctx, scope, id, in.SHA256, in.Bytes, in.Content)
	})
}

func validKnowledgeDocumentDigest(value string) bool {
	decoded, err := hex.DecodeString(value)
	return err == nil && len(decoded) == 32 && strings.ToLower(value) == value
}

func validKnowledgeDocumentChunk(in agentsdk.KnowledgeDocumentUploadChunk) bool {
	if in.Content == nil || in.Bytes < 1 || in.Bytes > DocumentOriginalMaximumBytes() || in.Offset < 0 || in.ChunkBytes < 1 || in.ChunkBytes > agentsdk.KnowledgeDocumentUploadChunkBytes || in.Offset+in.ChunkBytes > in.Bytes || !validKnowledgeDocumentDigest(in.SHA256) || !validKnowledgeDocumentDigest(in.ChunkSHA256) {
		return false
	}
	if in.Offset%agentsdk.KnowledgeDocumentUploadChunkBytes != 0 {
		return false
	}
	return in.Offset+in.ChunkBytes == in.Bytes || in.ChunkBytes == agentsdk.KnowledgeDocumentUploadChunkBytes
}

// UploadKnowledgeDocumentChunk is the resumable public upload boundary. The
// document record is reserved on the first part, while BodyRef remains empty
// until storage verifies the final part and complete-file digest.
func (s *Service) UploadKnowledgeDocumentChunk(ctx context.Context, library string, in agentsdk.KnowledgeDocumentUploadChunk, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeDocumentUploadProgress, error) {
	var zero agentsdk.KnowledgeDocumentUploadProgress
	if !validKnowledgeDocumentChunk(in) {
		return zero, conversationFailure("bad_request", "document_chunk_invalid")
	}
	storage, ok := s.options.DocumentStorage.(agentsdk.KnowledgeDocumentChunkStorage)
	if !ok {
		return zero, conversationFailure("unavailable", "document_chunk_upload_unavailable")
	}
	repo, record, err := s.reserveDocumentContent(ctx, library, in.ClientID, in.Filename, in.Bytes, in.SHA256, nil, nil, nil, a)
	if err != nil {
		return zero, err
	}
	if record.BodyRef != "" {
		document := record.Document
		return agentsdk.KnowledgeDocumentUploadProgress{NextOffset: in.Bytes, Complete: true, Document: &document}, nil
	}
	limited := &io.LimitedReader{R: in.Content, N: in.ChunkBytes + 1}
	next, reference, err := storage.PutKnowledgeDocumentContentChunk(ctx, DocumentStorageScope(library, a), record.Document.ID, in.SHA256, in.Bytes, in.Offset, in.ChunkSHA256, in.ChunkBytes, limited)
	if err != nil {
		return zero, err
	}
	if limited.N != 1 || next < in.Offset+in.ChunkBytes || next > in.Bytes || reference == "" && next == in.Bytes || reference != "" && next != in.Bytes {
		return zero, conversationFailure("unavailable", "document_chunk_state_invalid")
	}
	// Recheck current authority after every durable write. Losing membership
	// leaves an inaccessible uploading record that a current editor can delete.
	if _, err = s.DocumentAccess(ctx, library, knowledgesdk.ActionDocumentsUpload, a); err != nil {
		return zero, err
	}
	if reference == "" {
		uploads, ok := repo.(knowledgeDocumentUploadRepository)
		if !ok {
			return zero, conversationFailure("unavailable", "document_upload_lifecycle_unavailable")
		}
		record, err = uploads.TouchKnowledgeDocumentUpload(ctx, record.Document.ID, a)
		if err != nil {
			return zero, err
		}
		document := record.Document
		return agentsdk.KnowledgeDocumentUploadProgress{NextOffset: next, Document: &document}, nil
	}
	documentID := record.Document.ID
	record, err = repo.CommitKnowledgeDocumentContent(ctx, documentID, record.Document.Revision, reference, a)
	if err != nil {
		current, readErr := s.KnowledgeDocumentRecord(ctx, repo, library, documentID, a)
		if readErr != nil || current.BodyRef != reference {
			return zero, err
		}
		record = current
	}
	s.WakeKnowledgeDocuments()
	document := record.Document
	s.appendKnowledgeAudit(ctx, knowledgesdk.ActionDocumentsUpload, "knowledge.document.uploaded", library, "", document.ID, in.ClientID, document.Revision, nil, map[string]string{
		"bytes": strconv.FormatInt(document.Bytes, 10), "sha256": document.SHA256, "state": document.State,
	}, a)
	return agentsdk.KnowledgeDocumentUploadProgress{NextOffset: next, Complete: true, Document: &document}, nil
}

func (s *Service) commitDocumentContent(ctx context.Context, library, clientID, filename string, bytes int64, hash string, origin *persistence.KnowledgeAttachmentOrigin, documentOrigin *persistence.KnowledgeDocumentOrigin, recheck func() error, sourceAccess *agentsdk.KnowledgeDocumentSourceAccess, a agentsdk.ConversationAuthority, put func(agentsdk.KnowledgeDocumentStorageScope, string) (string, error)) (agentsdk.KnowledgeDocument, error) {
	var zero agentsdk.KnowledgeDocument
	if put == nil {
		return zero, conversationFailure("bad_request", "document_size_invalid")
	}
	repo, r, err := s.reserveDocumentContent(ctx, library, clientID, filename, bytes, hash, origin, documentOrigin, sourceAccess, a)
	if err != nil {
		return zero, err
	}
	if r.BodyRef != "" {
		return r.Document, nil
	}
	ref, err := put(DocumentStorageScope(library, a), r.Document.ID)
	if err != nil {
		return zero, err
	}
	// Losing membership during upload leaves an inaccessible uploading record;
	// a current library editor can delete it. Never publish on stale authority.
	if _, err = s.DocumentAccess(ctx, library, knowledgesdk.ActionDocumentsUpload, a); err != nil {
		return zero, err
	}
	if err = s.authorizeDocumentSource(ctx, sourceAccess, a); err != nil {
		return zero, err
	}
	if recheck != nil {
		if err = recheck(); err != nil {
			return zero, err
		}
	}
	documentID := r.Document.ID
	r, err = repo.CommitKnowledgeDocumentContent(ctx, documentID, r.Document.Revision, ref, a)
	if err != nil {
		current, readErr := s.KnowledgeDocumentRecord(ctx, repo, library, documentID, a)
		if readErr != nil || current.BodyRef != ref {
			return zero, err
		}
		r = current
	}
	s.WakeKnowledgeDocuments()
	action, eventType := knowledgesdk.ActionDocumentsUpload, "knowledge.document.uploaded"
	before := map[string]string(nil)
	if origin != nil {
		action, eventType = knowledgesdk.ActionDocumentsImportAttachment, "knowledge.document.attachment_imported"
		before = map[string]string{"attachment_id": origin.AttachmentID, "attachment_revision": strconv.FormatInt(origin.Revision, 10)}
	}
	if documentOrigin != nil {
		action, eventType = knowledgesdk.ActionDocumentsTransfer, "knowledge.document.transferred"
		before = map[string]string{
			"source_library_id": documentOrigin.LibraryID, "source_document_id": documentOrigin.DocumentID,
			"source_revision": strconv.FormatInt(documentOrigin.Revision, 10), "mode": documentOrigin.Mode,
		}
	}
	s.appendKnowledgeAudit(ctx, action, eventType, library, "", r.Document.ID, clientID, r.Document.Revision, before, map[string]string{
		"bytes": strconv.FormatInt(r.Document.Bytes, 10), "sha256": r.Document.SHA256, "state": r.Document.State,
	}, a)
	return r.Document, nil
}

func (s *Service) reserveDocumentContent(ctx context.Context, library, clientID, filename string, bytes int64, hash string, origin *persistence.KnowledgeAttachmentOrigin, documentOrigin *persistence.KnowledgeDocumentOrigin, sourceAccess *agentsdk.KnowledgeDocumentSourceAccess, a agentsdk.ConversationAuthority) (persistence.KnowledgeDocumentRepository, persistence.KnowledgeDocumentRecord, error) {
	var zero persistence.KnowledgeDocumentRecord
	repo, err := s.DocumentAccess(ctx, library, knowledgesdk.ActionDocumentsUpload, a)
	if err != nil {
		return nil, zero, err
	}
	if err = s.authorizeDocumentSource(ctx, sourceAccess, a); err != nil {
		return nil, zero, err
	}
	source, err := s.DocumentBinding(ctx, library, a)
	if err != nil {
		return nil, zero, err
	}
	if bytes < 1 || bytes > DocumentOriginalMaximumBytes() || !validKnowledgeDocumentDigest(hash) {
		return nil, zero, conversationFailure("bad_request", "document_size_invalid")
	}
	format, supported := KnowledgeDocumentFormat(source, filename)
	if !supported {
		return nil, zero, conversationFailure("bad_request", "document_type_unsupported")
	}
	record, err := repo.ReserveKnowledgeDocument(ctx, persistence.KnowledgeDocumentReserve{AttachmentOrigin: origin, DocumentOrigin: documentOrigin, LibraryID: library, ClientID: clientID, Filename: filename, ContentType: format.ContentType, Bytes: bytes, SHA256: hash, SourceID: source.KnowledgeDocumentSourceIdentity(), AccessPolicySHA256: DocumentAccessPolicy(source), SourceAccess: cloneDocumentSourceAccess(sourceAccess)}, a)
	if err != nil {
		return nil, zero, err
	}
	if record.Document.State == "deleting" || record.Document.State == "deleted" {
		return nil, zero, conversationFailure("not_found", "document_not_found")
	}
	return repo, record, nil
}

func validDocumentSourceAccess(source agentsdk.KnowledgeDocumentSourceAccess) bool {
	return conversationKey(source.Namespace) && conversationKey(source.ResourceType) &&
		conversationText(source.ResourceID, 256, true) && source.ResourceID == strings.TrimSpace(source.ResourceID)
}

func cloneDocumentSourceAccess(source *agentsdk.KnowledgeDocumentSourceAccess) *agentsdk.KnowledgeDocumentSourceAccess {
	if source == nil {
		return nil
	}
	copy := *source
	return &copy
}

func (s *Service) authorizeDocumentSource(ctx context.Context, source *agentsdk.KnowledgeDocumentSourceAccess, a agentsdk.ConversationAuthority) error {
	if source == nil {
		return nil
	}
	if !validDocumentSourceAccess(*source) {
		return conversationFailure("bad_request", "document_source_invalid")
	}
	if s.options.SourceAuthorizer == nil {
		return conversationFailure("unavailable", "document_source_authorizer_unavailable")
	}
	return s.options.SourceAuthorizer.AuthorizeKnowledgeDocumentSource(ctx, *source, a)
}
func (s *Service) KnowledgeDocumentRecord(ctx context.Context, repo persistence.KnowledgeDocumentRepository, library, id string, a agentsdk.ConversationAuthority) (persistence.KnowledgeDocumentRecord, error) {
	r, err := repo.KnowledgeDocumentRecord(ctx, id, a)
	if err == nil && (r.Document.LibraryID != library || r.Document.State == "deleted") {
		err = conversationFailure("not_found", "document_not_found")
	}
	if err == nil {
		err = s.authorizeDocumentSource(ctx, r.SourceAccess, a)
	}
	return r, err
}
func (s *Service) KnowledgeDocuments(ctx context.Context, library, after string, limit int, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeDocumentPage, error) {
	repo, err := s.DocumentAccess(ctx, library, knowledgesdk.ActionDocumentsList, a)
	if err != nil {
		return agentsdk.KnowledgeDocumentPage{}, err
	}
	out, err := repo.KnowledgeDocuments(ctx, library, after, limit, a)
	if err != nil {
		return agentsdk.KnowledgeDocumentPage{}, err
	}
	visible := make([]agentsdk.KnowledgeDocument, 0, len(out.Items))
	for _, document := range out.Items {
		record, readErr := repo.KnowledgeDocumentRecord(ctx, document.ID, a)
		if readErr != nil {
			return agentsdk.KnowledgeDocumentPage{}, readErr
		}
		if readErr = s.authorizeDocumentSource(ctx, record.SourceAccess, a); readErr != nil {
			var denied *agentsdk.Error
			if errors.As(readErr, &denied) && (denied.Class == "forbidden" || denied.Class == "not_found") {
				continue
			}
			return agentsdk.KnowledgeDocumentPage{}, readErr
		}
		visible = append(visible, document)
	}
	out.Items = visible
	if _, err = s.DocumentAccess(ctx, library, knowledgesdk.ActionDocumentsList, a); err != nil {
		return agentsdk.KnowledgeDocumentPage{}, err
	}
	return out, nil
}
func (s *Service) KnowledgeDocument(ctx context.Context, library, id string, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeDocument, error) {
	repo, err := s.DocumentAccess(ctx, library, knowledgesdk.ActionDocumentsGet, a)
	if err != nil {
		return agentsdk.KnowledgeDocument{}, err
	}
	r, err := s.KnowledgeDocumentRecord(ctx, repo, library, id, a)
	if err != nil {
		return agentsdk.KnowledgeDocument{}, err
	}
	if r.Document.ProjectionKind != "file" {
		return agentsdk.KnowledgeDocument{}, conversationFailure("not_found", "document_not_found")
	}
	return r.Document, nil
}
func (s *Service) DownloadKnowledgeDocument(ctx context.Context, library, id string, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeDocumentDownload, error) {
	var zero agentsdk.KnowledgeDocumentDownload
	repo, err := s.DocumentAccess(ctx, library, knowledgesdk.ActionDocumentsDownload, a)
	if err != nil {
		return zero, err
	}
	r, err := s.KnowledgeDocumentRecord(ctx, repo, library, id, a)
	if err != nil {
		return zero, err
	}
	if r.Document.ProjectionKind != "file" {
		return zero, conversationFailure("not_found", "document_not_found")
	}
	if !r.SecurityScanCompleted || r.Document.SecurityStatus != "clean" {
		return zero, conversationFailure("conflict", "document_quarantined")
	}
	if r.BodyRef == "" || r.Document.State == "deleting" {
		return zero, conversationFailure("not_found", "document_content_not_found")
	}
	content, err := s.options.DocumentStorage.OpenKnowledgeDocumentContent(ctx, DocumentStorageScope(library, a), id, r.BodyRef, r.Document.SHA256, r.Document.Bytes)
	if err != nil {
		return zero, err
	}
	closeOnError := func(err error) (agentsdk.KnowledgeDocumentDownload, error) {
		_ = content.Close()
		return zero, err
	}
	if _, err = s.DocumentAccess(ctx, library, knowledgesdk.ActionDocumentsDownload, a); err != nil {
		return closeOnError(err)
	}
	current, err := s.KnowledgeDocumentRecord(ctx, repo, library, id, a)
	if err != nil {
		return closeOnError(err)
	}
	if current.BodyRef != r.BodyRef || current.Document.State == "deleting" || !current.SecurityScanCompleted || current.Document.SecurityStatus != "clean" || current.Document.Bytes != r.Document.Bytes || current.Document.SHA256 != r.Document.SHA256 {
		return closeOnError(conversationFailure("not_found", "document_content_not_found"))
	}
	return agentsdk.KnowledgeDocumentDownload{Document: current.Document, Content: content}, nil
}
func (s *Service) DeleteKnowledgeDocument(ctx context.Context, library, id string, expected int64, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeDocument, error) {
	var zero agentsdk.KnowledgeDocument
	repo, err := s.DocumentAccess(ctx, library, knowledgesdk.ActionDocumentsDelete, a)
	if err != nil {
		return zero, err
	}
	current, err := s.KnowledgeDocumentRecord(ctx, repo, library, id, a)
	if err != nil || current.Document.ProjectionKind != "file" {
		return zero, conversationFailure("not_found", "document_not_found")
	}
	if expected < 1 {
		return zero, conversationFailure("bad_request", "revision_required")
	}
	r, err := s.KnowledgeDocumentRecord(ctx, repo, library, id, a)
	if err != nil {
		return zero, err
	}
	r, err = repo.RequestKnowledgeDocumentDeletion(ctx, id, expected, a)
	if err != nil {
		return zero, err
	}
	s.WakeKnowledgeDocuments()
	s.appendKnowledgeAudit(ctx, knowledgesdk.ActionDocumentsDelete, "knowledge.document.deletion_requested", library, "", id, "", r.Document.Revision, map[string]string{
		"expected_revision": strconv.FormatInt(expected, 10),
	}, map[string]string{"state": r.Document.State}, a)
	return r.Document, nil
}

func (s *Service) RetryKnowledgeDocument(ctx context.Context, library, id string, expected int64, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeDocument, error) {
	var zero agentsdk.KnowledgeDocument
	repo, err := s.DocumentAccess(ctx, library, knowledgesdk.ActionDocumentsRetry, a)
	if err != nil {
		return zero, err
	}
	retry, ok := repo.(persistence.KnowledgeDocumentRetryRepository)
	if !ok {
		return zero, conversationFailure("unavailable", "document_retry_unavailable")
	}
	if expected < 1 {
		return zero, conversationFailure("bad_request", "revision_required")
	}
	current, err := s.KnowledgeDocumentRecord(ctx, repo, library, id, a)
	if err != nil || current.Document.ProjectionKind != "file" {
		return zero, conversationFailure("not_found", "document_not_found")
	}
	record, err := retry.RequestKnowledgeDocumentRetry(ctx, id, expected, a)
	if err != nil {
		return zero, err
	}
	s.WakeKnowledgeDocuments()
	s.appendKnowledgeAudit(ctx, knowledgesdk.ActionDocumentsRetry, "knowledge.document.retry_requested", library, "", id, "", record.Document.Revision, map[string]string{
		"expected_revision": strconv.FormatInt(expected, 10),
	}, map[string]string{"state": record.Document.State}, a)
	return record.Document, nil
}

func (s *Service) ReindexKnowledgeDocument(ctx context.Context, library, id string, expected int64, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeDocument, error) {
	var zero agentsdk.KnowledgeDocument
	repo, err := s.DocumentAccess(ctx, library, knowledgesdk.ActionDocumentsReindex, a)
	if err != nil {
		return zero, err
	}
	reindex, ok := repo.(persistence.KnowledgeDocumentReindexRepository)
	if !ok {
		return zero, conversationFailure("unavailable", "document_reindex_unavailable")
	}
	record, err := s.KnowledgeDocumentRecord(ctx, repo, library, id, a)
	if err != nil {
		return zero, err
	}
	if record.Document.ProjectionKind != "file" {
		return zero, conversationFailure("not_found", "document_not_found")
	}
	source, err := s.DocumentBinding(ctx, library, a)
	if err != nil || source.KnowledgeDocumentSourceIdentity() != record.SourceID || DocumentAccessPolicy(source) != record.AccessPolicySHA256 {
		return zero, conversationFailure("conflict", "document_source_changed")
	}
	record, err = reindex.RequestKnowledgeDocumentReindex(ctx, id, expected, a)
	if err != nil {
		return zero, err
	}
	s.WakeKnowledgeDocuments()
	s.appendKnowledgeAudit(ctx, knowledgesdk.ActionDocumentsReindex, "knowledge.document.reindex_requested", library, "", id, "", record.Document.Revision, map[string]string{
		"expected_revision": strconv.FormatInt(expected, 10),
	}, map[string]string{"state": record.Document.State}, a)
	return record.Document, nil
}
func (s *Service) WakeKnowledgeDocuments() {
	select {
	case s.documentWake <- struct{}{}:
	default:
	}
}

func ActivateDocumentSources(repo any, runtime string, options Options) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	for _, b := range options.LibraryKnowledge {
		if !b.ManageDocuments {
			continue
		}
		documents, ok := repo.(persistence.KnowledgeDocumentRepository)
		if !ok || options.DocumentStorage == nil {
			return conversationFailure("unavailable", "documents_unavailable")
		}
		if err := documents.ActivateKnowledgeDocumentSource(ctx, agentsdk.KnowledgeDocumentStorageScope{RuntimeID: runtime, WorkspaceID: b.WorkspaceID, LibraryID: b.LibraryID}, b.Source.(agentsdk.ManagedKnowledgeDocumentSource).KnowledgeDocumentSourceIdentity()); err != nil {
			return err
		}
	}
	return nil
}

var _ agentsdk.KnowledgeDocumentService = (*Service)(nil)
var _ agentsdk.KnowledgeDocumentChunkUploadService = (*Service)(nil)
