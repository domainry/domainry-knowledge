package application

import (
	"context"
	"time"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
	"github.com/domainry/domainry-knowledge/artifact"
)

func (s *Service) KnowledgeDocumentWorker(ctx context.Context, repo persistence.KnowledgeDocumentRepository) {
	defer s.wg.Done()
	for ctx.Err() == nil {
		lease, ok, err := repo.ClaimKnowledgeDocumentWork(ctx, s.runtimeID, s.owner, time.Now().UTC(), time.Minute)
		if err == nil && ok {
			attempt, cancel := context.WithTimeout(ctx, 45*time.Second)
			s.ProcessKnowledgeDocument(attempt, repo, lease)
			cancel()
			continue
		}
		select {
		case <-ctx.Done():
			return
		case <-s.documentWake:
		case <-time.After(s.options.DocumentPoll):
		}
	}
}
func (s *Service) ProcessKnowledgeDocument(ctx context.Context, repo persistence.KnowledgeDocumentRepository, lease persistence.KnowledgeDocumentLease) {
	progress := persistence.KnowledgeDocumentProgress{Event: "retry", ErrorCode: "document_work_unavailable", RetryAt: time.Now().UTC().Add(30 * time.Second)}
	defer func() {
		// A lost response does not release safety state. Persist only through the
		// still-current fenced lease; never let late completion revive deletion.
		finish, cancel := context.WithTimeout(context.WithoutCancel(ctx), 5*time.Second)
		defer cancel()
		_ = repo.ApplyKnowledgeDocumentProgress(finish, lease, progress)
	}()
	r, err := repo.KnowledgeDocumentWorkRecord(ctx, lease)
	if err != nil {
		return
	}
	deleting := r.Document.State == "deleting"
	if deleting && !r.PutStarted {
		if s.options.DocumentStorage.DeleteKnowledgeDocumentContent(ctx, DocumentStorageScope(r.Document.LibraryID, r.Actor), r.Document.ID) != nil {
			progress.ErrorCode = "document_cleanup_failed"
			return
		}
		progress.Event = "deleted"
		return
	}
	source, err := s.DocumentBinding(ctx, r.Document.LibraryID, r.Actor)
	if err != nil || source.KnowledgeDocumentSourceIdentity() != r.SourceID {
		progress.ErrorCode = "document_management_unavailable"
		return
	}
	if DocumentAccessPolicy(source) != r.AccessPolicySHA256 {
		progress.ErrorCode = "document_access_policy_changed"
		return
	}
	if _, supported := source.(agentsdk.KnowledgeDocumentDeleteRecoverySource); supported && deleting && r.DeleteStarted && !r.DeleteAcknowledged {
		progress.ErrorCode = "document_delete_uncertain"
		if RecoverKnowledgeDocumentDelete(ctx, source, r.RemoteID, r.Actor, lease.ExpiresAt) {
			progress = persistence.KnowledgeDocumentProgress{Event: "delete_acknowledged", RetryAt: time.Now().UTC().Add(s.options.DocumentPoll)}
		}
		return
	}
	if !r.PutStarted {
		if r.Document.Bytes > DocumentMaxBytes(source) {
			progress.ErrorCode = "document_size_invalid"
			return
		}
		if _, err = s.DocumentAccess(ctx, r.Document.LibraryID, "documents_upload", r.Actor); err != nil {
			progress.ErrorCode = "document_upload_access_denied"
			return
		}
		raw, err := s.options.DocumentStorage.ReadKnowledgeDocumentContent(ctx, DocumentStorageScope(r.Document.LibraryID, r.Actor), r.Document.ID, r.BodyRef)
		if err != nil || int64(len(raw)) != r.Document.Bytes || artifact.Hash(raw) != r.Document.SHA256 {
			progress.ErrorCode = "document_content_mismatch"
			return
		}
		// Never overwrite a preexisting remote document, even with our exclusive
		// deterministic ID. The provider does not promise idempotent uploads.
		state, err := source.InspectKnowledgeDocument(ctx, r.RemoteID, r.Actor)
		if err != nil {
			progress.ErrorCode = "document_inspect_failed"
			return
		}
		if state.DocumentID != r.RemoteID || state.Exists {
			progress.ErrorCode = "document_remote_conflict"
			return
		}
		if _, err = s.DocumentAccess(ctx, r.Document.LibraryID, "documents_upload", r.Actor); err != nil {
			progress.ErrorCode = "document_upload_access_denied"
			return
		}
		write, cancel, err := CommittedKnowledgeWriteContext(ctx, lease.ExpiresAt)
		if err != nil {
			return
		}
		defer cancel()
		startedRecord, started, err := repo.StartKnowledgeDocumentPut(write, lease)
		if err != nil || !started {
			return
		}
		if err = source.PutKnowledgeDocument(write, agentsdk.KnowledgeDocumentContent{DocumentID: startedRecord.RemoteID, Filename: startedRecord.Document.Filename, Data: raw, RequestID: startedRecord.PutRequestID, AccessPolicySHA256: startedRecord.AccessPolicySHA256}, r.Actor); err != nil {
			progress.ErrorCode = "document_put_uncertain"
			return
		}
		progress = persistence.KnowledgeDocumentProgress{Event: "put_acknowledged", RetryAt: time.Now().UTC().Add(s.options.DocumentPoll)}
		return
	}
	state, err := source.InspectKnowledgeDocument(ctx, r.RemoteID, r.Actor)
	if err != nil || state.DocumentID != r.RemoteID {
		progress.ErrorCode = "document_inspect_failed"
		return
	}
	progress.IndexStatus = state.IndexStatus
	progress.RetryAt = time.Now().UTC().Add(s.options.DocumentPoll)
	progress.ErrorCode = ""
	if deleting && r.DeleteStarted {
		// A private fetch returning 1004 can mean ACL denial. Do not turn an
		// unacknowledged DELETE into confirmed cleanup based on visibility alone.
		if r.AccessPolicySHA256 != "" && !r.DeleteAcknowledged {
			progress.ErrorCode = "document_delete_uncertain"
			progress.RetryAt = time.Now().UTC().Add(30 * time.Second)
			return
		}
		if state.Exists {
			progress.ErrorCode = "document_delete_uncertain"
			progress.RetryAt = time.Now().UTC().Add(30 * time.Second)
			return
		}
		if s.options.DocumentStorage.DeleteKnowledgeDocumentContent(ctx, DocumentStorageScope(r.Document.LibraryID, r.Actor), r.Document.ID) != nil {
			progress.ErrorCode = "document_cleanup_failed"
			return
		}
		progress.Event = "deleted"
		return
	}
	if !state.Exists {
		progress.ErrorCode = "document_put_unconfirmed"
		progress.RetryAt = time.Now().UTC().Add(30 * time.Second)
		return
	}
	if !r.IndexObserved && state.IndexStatus == "INDEXED" {
		progress.Event = "indexed"
		return
	}
	if deleting && r.IndexObserved {
		write, cancel, err := CommittedKnowledgeWriteContext(ctx, lease.ExpiresAt)
		if err != nil {
			return
		}
		defer cancel()
		if err = repo.StartKnowledgeDocumentDelete(write, lease); err != nil {
			return
		}
		if err = source.DeleteKnowledgeDocument(write, r.RemoteID, r.Actor); err != nil {
			progress.ErrorCode = "document_delete_uncertain"
		} else {
			progress.Event = "delete_acknowledged"
		}
		return // Recovery requires the optional source contract and an acknowledgement.
	}
	if state.IndexStatus == "FAILED" || state.IndexStatus == "ERROR" {
		progress.ErrorCode = "document_index_failed"
		progress.RetryAt = time.Now().UTC().Add(30 * time.Second)
	}
}
