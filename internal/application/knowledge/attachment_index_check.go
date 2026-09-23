package application

import (
	"context"
	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
)

func (s *Service) AttachmentIndexView(ctx context.Context, r persistence.ConversationAttachmentRecord, a agentsdk.ConversationAuthority) agentsdk.ConversationAttachment {
	out := s.AttachmentView(r.Attachment)
	v := &agentsdk.ConversationAttachmentIndexView{Requested: r.Index != nil}
	if r.Index != nil {
		v.LastCheckRevision = r.Index.LastCheckRevision
	}
	out.Indexing = v
	scope, err := s.AttachmentKnowledgeBinding(ctx, r.Attachment.ConversationID, a)
	if err != nil {
		v.Reason = "attachment_index_unavailable"
		return out
	}
	v.MaxBytes = DocumentMaxBytes(scope.Source)
	if r.Source != nil && (r.Source.Identity != scope.Source.KnowledgeDocumentSourceIdentity() || r.Source.AccessPolicySHA256 != scope.Source.KnowledgeDocumentAccessPolicySHA256() || r.Source.PermissionID != scope.PermissionID) {
		v.Reason = "attachment_source_changed"
		return out
	}
	parent, err := s.contextReader().Get(ctx, r.Attachment.ConversationID, a)
	if err != nil {
		v.Reason = "attachment_index_access_denied"
		return out
	}
	if r.Attachment.State == "deleted" {
		return out
	}
	if parent.Archived && r.Attachment.State != "deleting" {
		v.Reason = "attachment_conversation_archived"
		return out
	}
	if r.Attachment.State == "deleting" {
		_, err = s.AttachmentAccess(ctx, "attachments_delete", a)
	} else {
		_, err = s.AttachmentAccess(ctx, "attachments_index", a)
		if err == nil {
			_, err = s.AttachmentAccess(ctx, "attachments_download", a)
		}
	}
	if err != nil {
		v.Reason = "attachment_index_access_denied"
		return out
	}
	if r.Index == nil {
		if r.Attachment.Bytes > v.MaxBytes {
			v.Reason = "attachment_size_invalid"
			return out
		}
		v.CanStart = r.Attachment.State == "stored" && r.Source == nil
		return out
	}
	if _, ok := s.repo.(persistence.ConversationAttachmentIndexCheckRepository); ok {
		_, err = s.AttachmentAccess(ctx, "attachments_check_index", a)
		v.CanCheck = err == nil
	}
	if !v.CanCheck {
		v.Reason = "attachment_index_check_denied"
	}
	return out
}

func (s *Service) CheckAttachmentIndex(ctx context.Context, conversation, id string, expected int64, a agentsdk.ConversationAuthority) (agentsdk.ConversationAttachment, error) {
	var zero agentsdk.ConversationAttachment
	records, err := s.AttachmentAccess(ctx, "attachments_check_index", a)
	if err != nil {
		return zero, err
	}
	r, err := s.AttachmentRecord(ctx, records, conversation, id, a)
	if err != nil {
		return zero, err
	}
	view := s.AttachmentIndexView(ctx, r, a)
	if view.Indexing == nil || !view.Indexing.Requested {
		return zero, conversationFailure("conflict", "attachment_index_not_requested")
	}
	if r.Attachment.State == "deleted" {
		return view, nil
	}
	if !view.Indexing.CanCheck {
		class := "forbidden"
		if view.Indexing.Reason == "attachment_index_unavailable" {
			class = "unavailable"
		} else if view.Indexing.Reason == "attachment_source_changed" {
			class = "conflict"
		}
		return zero, conversationFailure(class, view.Indexing.Reason)
	}
	repo, ok := s.repo.(persistence.ConversationAttachmentIndexCheckRepository)
	if !ok {
		return zero, conversationFailure("unavailable", "attachment_index_unavailable")
	}
	r, err = repo.RequestAttachmentIndexCheck(ctx, conversation, id, expected, a)
	if err != nil {
		return zero, err
	}
	s.WakeAttachmentIndex()
	return s.AttachmentIndexView(ctx, r, a), nil
}

var _ agentsdk.ConversationAttachmentIndexCheckService = (*Service)(nil)
