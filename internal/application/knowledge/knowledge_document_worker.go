package application

import (
	"context"
	"errors"
	"time"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/contract"
)

const (
	knowledgeDocumentUploadExpiryBatchSize = 100
	knowledgeDocumentUploadExpiryInterval  = time.Minute
)

type knowledgeDocumentUploadRepository interface {
	TouchKnowledgeDocumentUpload(context.Context, string, agentsdk.ConversationAuthority) (persistence.KnowledgeDocumentRecord, error)
	ExpireKnowledgeDocumentUploads(context.Context, string, time.Time, int) (int, error)
}

type WorkerTickResult struct {
	Worked         bool
	ProcessedCount int
}

func (s *Service) DocumentWorkerEnabled() bool {
	_, ok := s.repo.(persistence.KnowledgeDocumentRepository)
	return s.options.DocumentStorage != nil && ok
}

func (s *Service) DocumentWorkerInterval() time.Duration  { return s.options.DocumentPoll }
func (s *Service) DocumentWorkerWakeups() <-chan struct{} { return s.documentWake }

func (s *Service) KnowledgeDocumentWorkerTick(ctx context.Context) (WorkerTickResult, error) {
	repo, ok := s.repo.(persistence.KnowledgeDocumentRepository)
	if !ok || s.options.DocumentStorage == nil {
		return WorkerTickResult{}, nil
	}
	now := time.Now().UTC()
	if uploads, ok := repo.(knowledgeDocumentUploadRepository); ok {
		s.workerMu.Lock()
		due := !now.Before(s.nextDocumentUploadExpirySweep)
		if due {
			s.nextDocumentUploadExpirySweep = now.Add(knowledgeDocumentUploadExpiryInterval)
		}
		s.workerMu.Unlock()
		if due {
			processed, err := uploads.ExpireKnowledgeDocumentUploads(ctx, s.runtimeID, now.Add(-s.options.DocumentUploadIdleTimeout), knowledgeDocumentUploadExpiryBatchSize)
			if err != nil {
				return WorkerTickResult{}, err
			}
			if processed > 0 {
				return WorkerTickResult{Worked: true, ProcessedCount: processed}, nil
			}
		}
	}
	if projections, ok := repo.(knowledgesdk.KnowledgePageProjectionRepository); ok {
		work, claimed, err := projections.ClaimKnowledgePageProjection(ctx, s.runtimeID, s.owner, now, s.options.DocumentWorkTimeout)
		if err != nil {
			return WorkerTickResult{}, err
		}
		if claimed {
			attempt, cancel := context.WithDeadline(ctx, work.Lease.ExpiresAt)
			err = s.ProcessKnowledgePageProjection(attempt, projections, work)
			cancel()
			return WorkerTickResult{Worked: true, ProcessedCount: 1}, err
		}
	}
	lease, claimed, err := repo.ClaimKnowledgeDocumentWork(ctx, s.runtimeID, s.owner, now, s.options.DocumentWorkTimeout)
	if err != nil || !claimed {
		return WorkerTickResult{}, err
	}
	attempt, cancel := context.WithDeadline(ctx, lease.ExpiresAt)
	err = s.ProcessKnowledgeDocument(attempt, repo, lease)
	cancel()
	return WorkerTickResult{Worked: true, ProcessedCount: 1}, err
}

func (s *Service) ProcessKnowledgeDocument(ctx context.Context, repo persistence.KnowledgeDocumentRepository, lease persistence.KnowledgeDocumentLease) (resultErr error) {
	progress := persistence.KnowledgeDocumentProgress{Event: "retry", ErrorCode: "document_work_unavailable", RetryAt: time.Now().UTC().Add(30 * time.Second)}
	defer func() {
		// A lost response does not release safety state. Persist only through the
		// still-current fenced lease; never let late completion revive deletion.
		finish, cancel := context.WithTimeout(context.WithoutCancel(ctx), 5*time.Second)
		defer cancel()
		resultErr = errors.Join(resultErr, repo.ApplyKnowledgeDocumentProgress(finish, lease, progress))
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
	if !r.SecurityScanCompleted {
		if s.options.DocumentSecurity == nil {
			progress.ErrorCode = "document_security_unavailable"
			return
		}
		startedRecord, started, scanErr := repo.StartKnowledgeDocumentScan(ctx, lease)
		if scanErr != nil || !started {
			return
		}
		content, openErr := s.options.DocumentStorage.OpenKnowledgeDocumentContent(ctx, DocumentStorageScope(startedRecord.Document.LibraryID, startedRecord.Actor), startedRecord.Document.ID, startedRecord.BodyRef, startedRecord.Document.SHA256, startedRecord.Document.Bytes)
		if openErr != nil {
			progress.ErrorCode = "document_content_mismatch"
			return
		}
		result, scanErr := s.options.DocumentSecurity.ScanKnowledgeDocument(ctx, contract.KnowledgeDocumentSecurityInput{Document: startedRecord.Document, Content: content})
		_ = content.Close()
		if scanErr != nil {
			progress.ErrorCode = "document_security_scan_failed"
			return
		}
		progress.SecurityScanner = result.Scanner
		progress.SecurityReportSHA256 = result.ReportSHA256
		if result.Clean {
			progress.Event = "scan_clean"
			progress.ErrorCode = ""
			progress.RetryAt = time.Time{}
		} else {
			progress.Event = "scan_rejected"
			progress.ErrorCode = result.ErrorCode
		}
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
	if r.Reindex != nil {
		s.processKnowledgeDocumentReindex(ctx, repo, lease, r, source, &progress)
		return
	}
	if r.RetiredRemoteID != "" {
		s.processKnowledgeDocumentRetiredIndex(ctx, repo, lease, r, source, &progress)
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
		if s.authorizeDocumentSource(ctx, r.SourceAccess, r.Actor) != nil {
			progress.ErrorCode = "document_source_access_denied"
			return
		}
		if maximum := DocumentIndexMaximumBytesForFilename(source, r.Document.Filename); maximum < 1 || r.Document.Bytes > maximum {
			progress.ErrorCode = "document_index_size_unsupported"
			return
		}
		action := knowledgesdk.ActionDocumentsUpload
		if r.PageProjection != nil {
			action = knowledgesdk.ActionPagesPublish
		}
		if _, err = s.DocumentAccess(ctx, r.Document.LibraryID, action, r.Actor); err != nil {
			progress.ErrorCode = "document_upload_access_denied"
			return
		}
		content, err := s.options.DocumentStorage.OpenKnowledgeDocumentContent(ctx, DocumentStorageScope(r.Document.LibraryID, r.Actor), r.Document.ID, r.BodyRef, r.Document.SHA256, r.Document.Bytes)
		if err != nil {
			progress.ErrorCode = "document_content_mismatch"
			return
		}
		defer content.Close()
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
		if _, err = s.DocumentAccess(ctx, r.Document.LibraryID, action, r.Actor); err != nil {
			progress.ErrorCode = "document_upload_access_denied"
			return
		}
		if s.authorizeDocumentSource(ctx, r.SourceAccess, r.Actor) != nil {
			progress.ErrorCode = "document_source_access_denied"
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
		permissionIDs := []string(nil)
		if startedRecord.PageProjection != nil && startedRecord.PageProjection.PermissionID != "" {
			permissionIDs = []string{startedRecord.PageProjection.PermissionID}
		}
		if err = source.PutKnowledgeDocument(write, agentsdk.KnowledgeDocumentContent{DocumentID: startedRecord.RemoteID, Filename: startedRecord.Document.Filename, Bytes: startedRecord.Document.Bytes, SHA256: startedRecord.Document.SHA256, Content: content, RequestID: startedRecord.PutRequestID, AccessPolicySHA256: startedRecord.AccessPolicySHA256, PermissionIDs: permissionIDs}, r.Actor); err != nil {
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
	return resultErr
}

func (s *Service) processKnowledgeDocumentReindex(ctx context.Context, repo persistence.KnowledgeDocumentRepository, lease persistence.KnowledgeDocumentLease, r persistence.KnowledgeDocumentRecord, source agentsdk.ManagedKnowledgeDocumentSource, progress *persistence.KnowledgeDocumentProgress) {
	target := r.Reindex
	if target == nil {
		return
	}
	if !target.PutStarted {
		if s.authorizeDocumentSource(ctx, r.SourceAccess, r.Actor) != nil {
			progress.ErrorCode = "document_source_access_denied"
			return
		}
		filename, contentBytes, contentSHA256, bodyRef := r.Document.Filename, r.Document.Bytes, r.Document.SHA256, r.BodyRef
		if r.Replacement != nil {
			filename, contentBytes, contentSHA256, bodyRef = r.Replacement.Filename, r.Replacement.Bytes, r.Replacement.SHA256, r.Replacement.BodyRef
		}
		if maximum := DocumentIndexMaximumBytesForFilename(source, filename); maximum < 1 || contentBytes > maximum {
			progress.ErrorCode = "document_index_size_unsupported"
			return
		}
		action := knowledgesdk.ActionDocumentsReindex
		if r.PageProjection != nil {
			action = knowledgesdk.ActionPagesPublish
		}
		if _, err := s.DocumentAccess(ctx, r.Document.LibraryID, action, r.Actor); err != nil {
			progress.ErrorCode = "document_upload_access_denied"
			return
		}
		state, err := source.InspectKnowledgeDocument(ctx, target.RemoteID, r.Actor)
		if err != nil || state.DocumentID != target.RemoteID {
			progress.ErrorCode = "document_inspect_failed"
			return
		}
		if state.Exists {
			progress.ErrorCode = "document_remote_conflict"
			return
		}
		content, err := s.options.DocumentStorage.OpenKnowledgeDocumentContent(ctx, DocumentStorageScope(r.Document.LibraryID, r.Actor), r.Document.ID, bodyRef, contentSHA256, contentBytes)
		if err != nil {
			progress.ErrorCode = "document_content_mismatch"
			return
		}
		defer content.Close()
		write, cancel, err := CommittedKnowledgeWriteContext(ctx, lease.ExpiresAt)
		if err != nil {
			return
		}
		defer cancel()
		startedRecord, started, err := repo.StartKnowledgeDocumentReindexPut(write, lease)
		if err != nil || !started || startedRecord.Reindex == nil {
			return
		}
		permissionIDs := []string(nil)
		if startedRecord.Replacement != nil && startedRecord.Replacement.PageProjection.PermissionID != "" {
			permissionIDs = []string{startedRecord.Replacement.PageProjection.PermissionID}
		} else if startedRecord.PageProjection != nil && startedRecord.PageProjection.PermissionID != "" {
			permissionIDs = []string{startedRecord.PageProjection.PermissionID}
		}
		if err = source.PutKnowledgeDocument(write, agentsdk.KnowledgeDocumentContent{DocumentID: startedRecord.Reindex.RemoteID, Filename: filename, Bytes: contentBytes, SHA256: contentSHA256, Content: content, RequestID: startedRecord.Reindex.PutRequestID, AccessPolicySHA256: startedRecord.AccessPolicySHA256, PermissionIDs: permissionIDs}, r.Actor); err != nil {
			progress.ErrorCode = "document_reindex_put_uncertain"
			return
		}
		*progress = persistence.KnowledgeDocumentProgress{Event: "reindex_put_acknowledged", RetryAt: time.Now().UTC().Add(s.options.DocumentPoll)}
		return
	}
	state, err := source.InspectKnowledgeDocument(ctx, target.RemoteID, r.Actor)
	if err != nil || state.DocumentID != target.RemoteID {
		progress.ErrorCode = "document_inspect_failed"
		return
	}
	progress.IndexStatus = state.IndexStatus
	progress.RetryAt = time.Now().UTC().Add(s.options.DocumentPoll)
	if !state.Exists {
		progress.ErrorCode = "document_reindex_put_unconfirmed"
		return
	}
	if !target.PutAcknowledged {
		progress.Event = "reindex_put_acknowledged"
		progress.ErrorCode = ""
		return
	}
	if state.IndexStatus == "INDEXED" {
		progress.Event = "reindex_indexed"
		progress.ErrorCode = ""
		return
	}
	if state.IndexStatus == "FAILED" || state.IndexStatus == "ERROR" {
		progress.ErrorCode = "document_reindex_failed"
		return
	}
	progress.ErrorCode = ""
}

func (s *Service) processKnowledgeDocumentRetiredIndex(ctx context.Context, repo persistence.KnowledgeDocumentRepository, lease persistence.KnowledgeDocumentLease, r persistence.KnowledgeDocumentRecord, source agentsdk.ManagedKnowledgeDocumentSource, progress *persistence.KnowledgeDocumentProgress) {
	retired := r.RetiredRemoteID
	if retired == "" {
		return
	}
	if r.RetiredDeleteStarted && !r.RetiredDeleteAcknowledged {
		if RecoverKnowledgeDocumentDelete(ctx, source, retired, r.Actor, lease.ExpiresAt) {
			*progress = persistence.KnowledgeDocumentProgress{Event: "retired_delete_acknowledged", RetryAt: time.Now().UTC().Add(s.options.DocumentPoll)}
		} else {
			progress.ErrorCode = "document_reindex_cleanup_uncertain"
		}
		return
	}
	if !r.RetiredDeleteStarted {
		write, cancel, err := CommittedKnowledgeWriteContext(ctx, lease.ExpiresAt)
		if err != nil {
			return
		}
		defer cancel()
		startedRecord, started, err := repo.StartKnowledgeDocumentRetiredDelete(write, lease)
		if err != nil || !started || startedRecord.RetiredRemoteID != retired {
			return
		}
		if err = source.DeleteKnowledgeDocument(write, retired, r.Actor); err != nil {
			progress.ErrorCode = "document_reindex_cleanup_uncertain"
			return
		}
		*progress = persistence.KnowledgeDocumentProgress{Event: "retired_delete_acknowledged", RetryAt: time.Now().UTC().Add(s.options.DocumentPoll)}
		return
	}
	state, err := source.InspectKnowledgeDocument(ctx, retired, r.Actor)
	if err != nil || state.DocumentID != retired {
		progress.ErrorCode = "document_inspect_failed"
		return
	}
	if state.Exists {
		progress.ErrorCode = "document_reindex_cleanup_uncertain"
		progress.RetryAt = time.Now().UTC().Add(30 * time.Second)
		return
	}
	*progress = persistence.KnowledgeDocumentProgress{Event: "retired_deleted"}
}
