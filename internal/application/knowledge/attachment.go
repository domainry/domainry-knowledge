package application

import (
	"bytes"
	"context"
	"path/filepath"
	"strings"
	"time"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
	"github.com/domainry/domainry-knowledge/artifact"
)

func (s *Service) AttachmentAccess(ctx context.Context, action string, a agentsdk.ConversationAuthority) (persistence.ConversationAttachmentRepository, error) {
	if err := s.authorize(a); err != nil {
		return nil, err
	}
	repo, ok := s.repo.(persistence.ConversationAttachmentRepository)
	if !ok || s.options.AttachmentStorage == nil || s.options.AttachmentAuthorizer == nil {
		return nil, conversationFailure("unavailable", "attachments_unavailable")
	}
	if err := s.options.AttachmentAuthorizer.AuthorizeConversationAttachment(ctx, action, a); err != nil {
		return nil, err
	}
	return repo, nil
}

func AttachmentContentType(filename string) string {
	return map[string]string{".pdf": "application/pdf", ".doc": "application/msword", ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".xls": "application/vnd.ms-excel", ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ".txt": "text/plain", ".md": "text/markdown", ".csv": "text/csv", ".tsv": "text/tab-separated-values", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".webp": "image/webp"}[strings.ToLower(filepath.Ext(filename))]
}

func attachmentImageContentType(data []byte) string {
	switch {
	case len(data) >= 8 && bytes.Equal(data[:8], []byte("\x89PNG\r\n\x1a\n")):
		return "image/png"
	case len(data) >= 3 && bytes.Equal(data[:3], []byte("\xff\xd8\xff")):
		return "image/jpeg"
	case len(data) >= 6 && (bytes.Equal(data[:6], []byte("GIF87a")) || bytes.Equal(data[:6], []byte("GIF89a"))):
		return "image/gif"
	case len(data) >= 12 && bytes.Equal(data[:4], []byte("RIFF")) && bytes.Equal(data[8:12], []byte("WEBP")):
		return "image/webp"
	default:
		return ""
	}
}

func (s *Service) UploadAttachment(ctx context.Context, conversationID string, in agentsdk.ConversationAttachmentUpload, a agentsdk.ConversationAuthority) (agentsdk.ConversationAttachment, error) {
	var zero agentsdk.ConversationAttachment
	repo, err := s.AttachmentAccess(ctx, "attachments_upload", a)
	if err != nil {
		return zero, err
	}
	if len(in.Data) == 0 || int64(len(in.Data)) > agentsdk.ConversationAttachmentMaxBytes {
		return zero, conversationFailure("bad_request", "attachment_size_invalid")
	}
	contentType := AttachmentContentType(in.Filename)
	if contentType == "" {
		return zero, conversationFailure("bad_request", "attachment_type_unsupported")
	}
	// Image inputs are sent to model providers as their declared media type.
	// Refuse extension spoofing before reserving storage metadata.
	if strings.HasPrefix(contentType, "image/") && attachmentImageContentType(in.Data) != contentType {
		return zero, conversationFailure("bad_request", "attachment_type_unsupported")
	}
	conversation, err := s.contextReader().Get(ctx, conversationID, a)
	if err != nil {
		return zero, err
	}
	if conversation.Archived {
		return zero, conversationFailure("conflict", "attachment_conversation_archived")
	}
	hash := artifact.Hash(in.Data)
	record, err := repo.ReserveAttachment(ctx, persistence.ConversationAttachmentReserve{ClientID: in.ClientID, ConversationID: conversationID, Filename: in.Filename, ContentType: contentType, SHA256: hash, Bytes: int64(len(in.Data))}, a)
	if err != nil {
		return zero, err
	}
	if record.Attachment.State == "deleting" || record.Attachment.State == "deleted" {
		return zero, conversationFailure("not_found", "attachment_not_found")
	}
	if record.BodyRef != "" {
		return s.AttachmentIndexView(ctx, record, a), nil
	}
	if record.Attachment.State == "failed" {
		record, err = repo.TransitionAttachment(ctx, record.Attachment.ID, record.Attachment.Revision, persistence.ConversationAttachmentTransition{State: "uploading"}, a)
		if err != nil {
			return zero, err
		}
	}
	reference, err := s.options.AttachmentStorage.PutAttachmentContent(ctx, record.Attachment.ID, hash, in.Data, a)
	if err != nil {
		// A cancelled upload remains retryable; a concrete storage failure has a
		// stable public code. Neither can silently mark the attachment indexed.
		if ctx.Err() == nil {
			_, _ = repo.TransitionAttachment(ctx, record.Attachment.ID, record.Attachment.Revision, persistence.ConversationAttachmentTransition{State: "failed", ErrorCode: "upload_failed"}, a)
		}
		return zero, err
	}
	if _, err := s.AttachmentAccess(ctx, "attachments_upload", a); err != nil {
		cleanupCtx, cancel := context.WithTimeout(context.WithoutCancel(ctx), 5*time.Second)
		defer cancel()
		_, _ = repo.TransitionAttachment(cleanupCtx, record.Attachment.ID, record.Attachment.Revision, persistence.ConversationAttachmentTransition{State: "deleting"}, a)
		s.WakeAttachmentCleanup()
		return zero, err
	}
	stored, err := repo.TransitionAttachment(ctx, record.Attachment.ID, record.Attachment.Revision, persistence.ConversationAttachmentTransition{State: "stored", BodyRef: reference}, a)
	if err != nil {
		// Concurrent identical uploads may have finalized the same immutable
		// object. A deletion or a different reference must never be overwritten.
		current, readErr := repo.AttachmentRecord(ctx, record.Attachment.ID, a)
		if readErr == nil && current.BodyRef == reference && current.Attachment.State != "deleting" && current.Attachment.State != "deleted" {
			return s.AttachmentIndexView(ctx, current, a), nil
		}
		s.WakeAttachmentCleanup()
		return zero, err
	}
	return s.AttachmentIndexView(ctx, stored, a), nil
}

func (s *Service) AttachmentView(item agentsdk.ConversationAttachment) agentsdk.ConversationAttachment {
	item.Indexing = nil
	return item
}

func (s *Service) AttachmentRecord(ctx context.Context, repo persistence.ConversationAttachmentRepository, conversationID, id string, a agentsdk.ConversationAuthority) (persistence.ConversationAttachmentRecord, error) {
	if _, err := s.contextReader().Get(ctx, conversationID, a); err != nil {
		return persistence.ConversationAttachmentRecord{}, err
	}
	record, err := repo.AttachmentRecord(ctx, id, a)
	if err == nil && record.Attachment.ConversationID != conversationID {
		err = conversationFailure("not_found", "attachment_not_found")
	}
	return record, err
}

func (s *Service) Attachments(ctx context.Context, conversationID, after string, limit int, a agentsdk.ConversationAuthority) (agentsdk.ConversationAttachmentPage, error) {
	repo, err := s.AttachmentAccess(ctx, "attachments_list", a)
	if err != nil {
		return agentsdk.ConversationAttachmentPage{}, err
	}
	page, err := repo.Attachments(ctx, conversationID, after, limit, a)
	for i := range page.Items {
		page.Items[i] = s.AttachmentView(page.Items[i])
	}
	return page, err
}

func (s *Service) Attachment(ctx context.Context, conversationID, id string, a agentsdk.ConversationAuthority) (agentsdk.ConversationAttachment, error) {
	repo, err := s.AttachmentAccess(ctx, "attachments_get", a)
	if err != nil {
		return agentsdk.ConversationAttachment{}, err
	}
	record, err := s.AttachmentRecord(ctx, repo, conversationID, id, a)
	if err == nil && record.Attachment.State == "deleted" {
		err = conversationFailure("not_found", "attachment_not_found")
	}
	if err != nil {
		return agentsdk.ConversationAttachment{}, err
	}
	return s.AttachmentIndexView(ctx, record, a), nil
}

func (s *Service) DownloadAttachment(ctx context.Context, conversationID, id string, a agentsdk.ConversationAuthority) (agentsdk.ConversationAttachmentDownload, error) {
	var out agentsdk.ConversationAttachmentDownload
	repo, err := s.AttachmentAccess(ctx, "attachments_download", a)
	if err != nil {
		return out, err
	}
	record, err := s.AttachmentRecord(ctx, repo, conversationID, id, a)
	if err != nil {
		return out, err
	}
	if record.BodyRef == "" || record.Attachment.State == "deleting" || record.Attachment.State == "deleted" {
		return out, conversationFailure("not_found", "attachment_content_not_found")
	}
	raw, err := s.options.AttachmentStorage.ReadAttachmentContent(ctx, id, record.BodyRef, a)
	if err != nil {
		return out, err
	}
	if int64(len(raw)) != record.Attachment.Bytes || artifact.Hash(raw) != record.Attachment.SHA256 {
		return out, conversationFailure("unavailable", "attachment_content_mismatch")
	}
	if _, err := s.AttachmentAccess(ctx, "attachments_download", a); err != nil {
		return out, err
	}
	current, err := s.AttachmentRecord(ctx, repo, conversationID, id, a)
	if err != nil {
		return out, err
	}
	if current.Attachment.State == "deleting" || current.Attachment.State == "deleted" || current.BodyRef != record.BodyRef {
		return out, conversationFailure("not_found", "attachment_not_found")
	}
	return agentsdk.ConversationAttachmentDownload{Attachment: s.AttachmentView(current.Attachment), Data: raw}, nil
}

func (s *Service) DeleteAttachment(ctx context.Context, conversationID, id string, expected int64, a agentsdk.ConversationAuthority) (agentsdk.ConversationAttachment, error) {
	var zero agentsdk.ConversationAttachment
	repo, err := s.AttachmentAccess(ctx, "attachments_delete", a)
	if err != nil {
		return zero, err
	}
	if expected < 1 {
		return zero, conversationFailure("bad_request", "revision_required")
	}
	record, err := s.AttachmentRecord(ctx, repo, conversationID, id, a)
	if err != nil {
		return zero, err
	}
	if record.Attachment.State == "deleted" {
		return s.AttachmentIndexView(ctx, record, a), nil
	}
	if record.Attachment.State != "deleting" {
		record, err = repo.TransitionAttachment(ctx, id, expected, persistence.ConversationAttachmentTransition{State: "deleting"}, a)
		if err != nil {
			return zero, err
		}
	}
	s.WakeAttachmentCleanup()
	// The durable worker owns physical cleanup. The immediate result confirms
	// revoked Access and honestly reports that cleanup is still pending.
	return s.AttachmentIndexView(ctx, record, a), nil
}

func (s *Service) WakeAttachmentCleanup() {
	select {
	case s.attachmentWake <- struct{}{}:
	default:
	}
}

func (s *Service) CleanAttachment(ctx context.Context, repo persistence.ConversationAttachmentRepository, work persistence.ConversationAttachmentCleanup) error {
	record, err := repo.AttachmentRecord(ctx, work.AttachmentID, work.Authority)
	if err != nil {
		return err
	}
	if record.Attachment.State != "deleting" {
		return nil
	}
	if record.Index != nil {
		s.WakeAttachmentIndex()
		return conversationFailure("unavailable", "attachment_index_cleanup_pending")
	}
	// Legacy sources have no durable remote write receipts. Never adopt them
	// into the new worker or infer a successful remote deletion.
	if record.Source != nil {
		return conversationFailure("unavailable", "attachment_remote_cleanup_unavailable")
	}
	if err := s.options.AttachmentStorage.DeleteAttachmentContent(ctx, work.AttachmentID, work.Authority); err != nil {
		return err
	}
	_, err = repo.TransitionAttachment(ctx, work.AttachmentID, record.Attachment.Revision, persistence.ConversationAttachmentTransition{State: "deleted"}, work.Authority)
	return err
}

func (s *Service) CleanupAttachments(ctx context.Context, repo persistence.ConversationAttachmentRepository) {
	defer s.wg.Done()
	ticker := time.NewTicker(time.Second)
	defer ticker.Stop()
	for {
		work, err := repo.AttachmentCleanupCandidates(ctx, s.runtimeID, time.Now().UTC(), 20)
		if err == nil {
			for _, item := range work {
				attempt, cancel := context.WithTimeout(ctx, 10*time.Second)
				err := s.CleanAttachment(attempt, repo, item)
				cancel()
				if err != nil {
					_ = repo.DeferAttachmentCleanup(ctx, item.AttachmentID, time.Now().UTC().Add(30*time.Second), item.Authority)
				}
				if ctx.Err() != nil {
					return
				}
			}
		}
		select {
		case <-ctx.Done():
			return
		case <-s.attachmentWake:
		case <-ticker.C:
		}
	}
}

var _ agentsdk.ConversationAttachmentService = (*Service)(nil)
