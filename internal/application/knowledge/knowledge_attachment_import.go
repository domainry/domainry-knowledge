package application

import (
	"context"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
)

func (s *Service) ImportConversationAttachment(ctx context.Context, library string, in agentsdk.KnowledgeAttachmentImport, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeDocument, error) {
	var zero agentsdk.KnowledgeDocument
	if !conversationKey(in.ClientID) || !conversationKey(in.ConversationID) || !conversationKey(in.AttachmentID) || in.ExpectedRevision < 1 {
		return zero, conversationFailure("bad_request", "document_import_invalid")
	}
	if _, err := s.DocumentAccess(ctx, library, "documents_import_attachment", a); err != nil {
		return zero, err
	}
	if _, err := s.DocumentAccess(ctx, library, "documents_upload", a); err != nil {
		return zero, err
	}
	repo, ok := s.repo.(persistence.KnowledgeAttachmentImportRepository)
	if !ok {
		return zero, conversationFailure("unavailable", "document_import_unavailable")
	}
	origin := persistence.KnowledgeAttachmentOrigin{ConversationID: in.ConversationID, AttachmentID: in.AttachmentID, Revision: in.ExpectedRevision}
	prior, found, err := repo.FindKnowledgeAttachmentImport(ctx, library, in.ClientID, origin, a)
	if err != nil {
		return zero, err
	}
	if found {
		if prior.Document.State == "deleting" || prior.Document.State == "deleted" {
			return zero, conversationFailure("not_found", "document_not_found")
		}
		// A completed explicit copy is independent of later source deletion.
		// Retrying a lost acknowledgement returns it without reading private data.
		if prior.BodyRef != "" {
			return prior.Document, nil
		}
	}
	if _, err = s.DocumentBinding(ctx, library, a); err != nil {
		return zero, err
	}
	source, err := s.DownloadAttachment(ctx, in.ConversationID, in.AttachmentID, a)
	if err != nil {
		return zero, err
	}
	if source.Attachment.Revision != in.ExpectedRevision {
		return zero, conversationFailure("conflict", "revision_conflict")
	}
	recheck := func() error {
		if _, e := s.AttachmentAccess(ctx, "attachments_download", a); e != nil {
			return e
		}
		_, e := s.DocumentAccess(ctx, library, "documents_import_attachment", a)
		return e
	}
	return s.UploadDocumentContent(ctx, library, agentsdk.KnowledgeDocumentUpload{ClientID: in.ClientID, Filename: source.Attachment.Filename, Data: source.Data}, &origin, nil, recheck, a)
}

var _ agentsdk.KnowledgeAttachmentImportService = (*Service)(nil)
