package application

import (
	"context"
	"time"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/artifact"
	"github.com/domainry/domainry-agent-sdk/persistence"
)

func (s *Service) AttachmentIndexWorker(ctx context.Context, repo persistence.ConversationAttachmentIndexRepository) {
	defer s.wg.Done()
	for ctx.Err() == nil {
		lease, found, err := repo.ClaimAttachmentIndexWork(ctx, s.runtimeID, s.owner, time.Now().UTC(), time.Minute)
		if err == nil && found {
			attempt, cancel := context.WithTimeout(ctx, 45*time.Second)
			s.ProcessAttachmentIndex(attempt, repo, lease)
			cancel()
			continue
		}
		select {
		case <-ctx.Done():
			return
		case <-s.attachmentIndexWake:
		case <-time.After(s.options.DocumentPoll):
		}
	}
}

func (s *Service) ProcessAttachmentIndex(ctx context.Context, repo persistence.ConversationAttachmentIndexRepository, lease persistence.ConversationAttachmentIndexLease) {
	progress := persistence.ConversationAttachmentIndexProgress{Event: "retry", ErrorCode: "attachment_index_unavailable", RetryAt: time.Now().UTC().Add(30 * time.Second)}
	defer func() {
		finish, cancel := context.WithTimeout(context.WithoutCancel(ctx), 5*time.Second)
		defer cancel()
		_ = repo.ApplyAttachmentIndexProgress(finish, lease, progress)
	}()
	r, err := repo.AttachmentIndexWorkRecord(ctx, lease)
	if err != nil {
		return
	}
	deleting := r.Attachment.State == "deleting"
	removeOriginal := func() {
		if repo.DeleteAttachmentContent(ctx, r.Attachment.ID, lease.Authority) != nil {
			progress.ErrorCode = "attachment_cleanup_failed"
			return
		}
		progress.Event = "deleted"
	}
	if deleting && (r.Index == nil || !r.Index.PutStarted) {
		removeOriginal()
		return
	}
	if r.Index == nil || r.Source == nil {
		return
	}
	scope, err := s.AttachmentKnowledgeBinding(ctx, r.Attachment.ConversationID, r.Index.Actor)
	if err != nil || scope.Source.KnowledgeDocumentSourceIdentity() != r.Source.Identity {
		return
	}
	source := scope.Source
	if source.KnowledgeDocumentAccessPolicySHA256() != r.Source.AccessPolicySHA256 || scope.PermissionID != r.Source.PermissionID {
		progress.ErrorCode = "attachment_access_policy_changed"
		return
	}
	if _, supported := source.(agentsdk.KnowledgeDocumentDeleteRecoverySource); supported && deleting && r.Index.DeleteStarted && !r.Index.DeleteAcknowledged {
		progress.ErrorCode = "attachment_delete_uncertain"
		if RecoverKnowledgeDocumentDelete(ctx, source, r.Source.DocID, r.Index.Actor, lease.ExpiresAt) {
			progress = persistence.ConversationAttachmentIndexProgress{Event: "delete_acknowledged", RetryAt: time.Now().UTC().Add(s.options.DocumentPoll)}
		}
		return
	}
	if !r.Index.PutStarted {
		if r.Attachment.Bytes > DocumentMaxBytes(source) {
			progress.ErrorCode = "attachment_size_invalid"
			return
		}
		if !s.AttachmentIndexWriteAllowed(ctx, r) {
			progress.ErrorCode = "attachment_index_access_denied"
			return
		}
		raw, err := repo.AttachmentContent(ctx, r.Attachment.ID, r.Index.Actor)
		if err != nil || int64(len(raw)) != r.Attachment.Bytes || artifact.Hash(raw) != r.Attachment.SHA256 {
			progress.ErrorCode = "attachment_content_mismatch"
			return
		}
		state, err := source.InspectKnowledgeDocument(ctx, r.Source.DocID, r.Index.Actor)
		if err != nil {
			progress.ErrorCode = "attachment_inspect_failed"
			return
		}
		if state.DocumentID != r.Source.DocID || state.Exists {
			progress.ErrorCode = "attachment_remote_conflict"
			return
		}
		if !s.AttachmentIndexWriteAllowed(ctx, r) {
			progress.ErrorCode = "attachment_index_access_denied"
			return
		}
		write, cancel, err := CommittedKnowledgeWriteContext(ctx, lease.ExpiresAt)
		if err != nil {
			return
		}
		defer cancel()
		current, started, err := repo.StartAttachmentIndexPut(write, lease)
		if err != nil || !started {
			return
		}
		// The source is an SDK port. Original bytes are forwarded unchanged;
		// all parsing, chunking and indexing belongs to the knowledge service.
		err = source.PutKnowledgeDocument(write, agentsdk.KnowledgeDocumentContent{DocumentID: current.Source.DocID, Filename: current.Attachment.Filename, Data: raw, RequestID: current.Source.RequestID, AccessPolicySHA256: current.Source.AccessPolicySHA256}, current.Index.Actor)
		if err != nil {
			progress.ErrorCode = "attachment_put_uncertain"
			return
		}
		progress = persistence.ConversationAttachmentIndexProgress{Event: "put_acknowledged", RetryAt: time.Now().UTC().Add(s.options.DocumentPoll)}
		return
	}
	state, err := source.InspectKnowledgeDocument(ctx, r.Source.DocID, r.Index.Actor)
	if err != nil || state.DocumentID != r.Source.DocID {
		progress.ErrorCode = "attachment_inspect_failed"
		return
	}
	progress.IndexStatus, progress.ErrorCode = state.IndexStatus, ""
	progress.RetryAt = time.Now().UTC().Add(s.options.DocumentPoll)
	if deleting && r.Index.DeleteStarted {
		if !r.Index.DeleteAcknowledged || state.Exists {
			progress.ErrorCode = "attachment_delete_uncertain"
			progress.RetryAt = time.Now().UTC().Add(30 * time.Second)
			return
		}
		removeOriginal()
		return
	}
	if !state.Exists {
		progress.ErrorCode = "attachment_put_unconfirmed"
		progress.RetryAt = time.Now().UTC().Add(30 * time.Second)
		return
	}
	if state.IndexStatus == "INDEXED" && (!r.Index.IndexObserved || !deleting) {
		progress.Event = "indexed"
		return
	}
	if deleting && r.Index.IndexObserved {
		write, cancel, err := CommittedKnowledgeWriteContext(ctx, lease.ExpiresAt)
		if err != nil {
			return
		}
		defer cancel()
		if err = repo.StartAttachmentIndexDelete(write, lease); err != nil {
			return
		}
		if err = source.DeleteKnowledgeDocument(write, r.Source.DocID, r.Index.Actor); err != nil {
			progress.ErrorCode = "attachment_delete_uncertain"
			progress.RetryAt = time.Now().UTC().Add(30 * time.Second)
		} else {
			progress.Event = "delete_acknowledged"
		}
		return
	}
	if state.IndexStatus == "FAILED" || state.IndexStatus == "ERROR" {
		progress.ErrorCode = "attachment_index_failed"
		progress.RetryAt = time.Now().UTC().Add(30 * time.Second)
	}
}

func (s *Service) AttachmentIndexWriteAllowed(ctx context.Context, r persistence.ConversationAttachmentRecord) bool {
	for _, op := range []string{"attachments_index", "attachments_download"} {
		if _, err := s.AttachmentAccess(ctx, op, r.Index.Actor); err != nil {
			return false
		}
	}
	c, err := s.contextReader().Get(ctx, r.Attachment.ConversationID, r.Index.Actor)
	return err == nil && !c.Archived
}
