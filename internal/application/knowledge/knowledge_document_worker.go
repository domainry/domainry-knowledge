package application

import (
	"context"
	"errors"
	"sync"
	"time"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/contract"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
)

const (
	knowledgeDocumentUploadExpiryBatchSize         = 100
	knowledgeDocumentUploadExpiryInterval          = time.Minute
	knowledgeDocumentMaximumAutomaticPutRecoveries = 1
	knowledgeDocumentWorkerBatchSize               = 8
	knowledgeDocumentWorkerConcurrency             = 8
)

func knowledgeDocumentProjectionPermissionIDs(r persistence.KnowledgeDocumentRecord, replacement bool) []string {
	projection := r.PageProjection
	if replacement && r.Replacement != nil {
		projection = &r.Replacement.PageProjection
	}
	if projection == nil || projection.PermissionID == "" {
		return nil
	}
	return []string{projection.PermissionID}
}

func knowledgeDocumentIndexSource(r persistence.KnowledgeDocumentRecord, replacement bool) *agentsdk.KnowledgeDocumentIndexSource {
	projection := r.PageProjection
	if replacement && r.Replacement != nil {
		projection = &r.Replacement.PageProjection
	}
	if projection == nil {
		return nil
	}
	return &agentsdk.KnowledgeDocumentIndexSource{
		Title: projection.Title, PageID: projection.PageID, PageVersion: projection.Version,
		LibraryKind: projection.LibraryKind, ContentType: projection.ContentType,
		Breadcrumbs: append([]agentsdk.KnowledgePageBreadcrumb(nil), projection.Breadcrumbs...),
	}
}

func knowledgeDocumentStorageID(r persistence.KnowledgeDocumentRecord) string {
	if r.Document.ProjectionKind == "page_attachment" && r.DocumentOrigin != nil && r.DocumentOrigin.DocumentID != "" {
		return r.DocumentOrigin.DocumentID
	}
	return r.Document.ID
}

func inspectKnowledgeDocument(ctx context.Context, source agentsdk.KnowledgeDocumentSource, id string, permissionIDs []string, actor agentsdk.Authority) (agentsdk.KnowledgeDocumentState, error) {
	if len(permissionIDs) != 0 {
		if scoped, ok := source.(agentsdk.KnowledgeDocumentPermissionInspectionSource); ok {
			return scoped.InspectKnowledgeDocumentWithPermissions(ctx, id, permissionIDs, actor)
		}
	}
	return source.InspectKnowledgeDocument(ctx, id, actor)
}

func (s *Service) deleteKnowledgeDocumentStoredContent(ctx context.Context, r persistence.KnowledgeDocumentRecord) error {
	// A page archive is reversible for the configured retention window. Its
	// search projection must be removed from the provider immediately, but the
	// private projection body must remain available so restoring the page can
	// rebuild the same deterministic document identity. The storage deletion
	// contract is an irreversible tombstone and therefore belongs only to
	// permanently deleted uploaded documents, not to a reversible page archive.
	if r.PageProjection != nil || r.PageLifecycleManaged {
		return nil
	}
	return s.options.DocumentStorage.DeleteKnowledgeDocumentContent(ctx, DocumentStorageScope(r.Document.LibraryID, r.Actor), r.Document.ID)
}

func (s *Service) recoverKnowledgeDocumentPut(ctx context.Context, repo persistence.KnowledgeDocumentRepository, lease persistence.KnowledgeDocumentLease, r persistence.KnowledgeDocumentRecord, source agentsdk.ManagedKnowledgeDocumentSource, progress *persistence.KnowledgeDocumentProgress) bool {
	if _, ok := source.(agentsdk.KnowledgeDocumentPutRecoverySource); !ok || r.PutRecoveryAttempts >= knowledgeDocumentMaximumAutomaticPutRecoveries {
		return false
	}
	action := knowledgesdk.ActionDocumentsUpload
	if r.PageProjection != nil {
		action = knowledgesdk.ActionPagesPublish
	}
	if _, err := s.DocumentAccess(ctx, r.Document.LibraryID, action, r.Actor); err != nil {
		progress.ErrorCode = "document_upload_access_denied"
		return true
	}
	if s.authorizeDocumentSource(ctx, r.SourceAccess, r.Actor) != nil {
		progress.ErrorCode = "document_source_access_denied"
		return true
	}
	if maximum := DocumentIndexMaximumBytesForFilename(source, r.Document.Filename); maximum < 1 || r.Document.Bytes > maximum {
		progress.ErrorCode = "document_index_size_unsupported"
		return true
	}
	content, err := s.options.DocumentStorage.OpenKnowledgeDocumentContent(ctx, DocumentStorageScope(r.Document.LibraryID, r.Actor), knowledgeDocumentStorageID(r), r.BodyRef, r.Document.SHA256, r.Document.Bytes)
	if err != nil {
		progress.ErrorCode = "document_content_mismatch"
		return true
	}
	defer content.Close()
	write, cancel, err := CommittedKnowledgeWriteContext(ctx, lease.ExpiresAt)
	if err != nil {
		return true
	}
	startedRecord, started, err := repo.StartKnowledgeDocumentPutRecovery(write, lease)
	cancel()
	if err != nil || !started {
		return true
	}
	input := agentsdk.KnowledgeDocumentIndexContent{DocumentID: startedRecord.RemoteID, Filename: startedRecord.Document.Filename, Bytes: startedRecord.Document.Bytes, SHA256: startedRecord.Document.SHA256, Content: content, Source: knowledgeDocumentIndexSource(startedRecord, false), RequestID: startedRecord.PutRequestID, AccessPolicySHA256: startedRecord.AccessPolicySHA256, PermissionIDs: knowledgeDocumentProjectionPermissionIDs(startedRecord, false)}
	if !RecoverKnowledgeDocumentPut(ctx, source, input, startedRecord.Actor, lease.ExpiresAt) {
		progress.ErrorCode = "document_put_recovery_uncertain"
		return true
	}
	*progress = persistence.KnowledgeDocumentProgress{Event: "put_acknowledged", RetryAt: time.Now().UTC().Add(s.options.DocumentPoll)}
	return true
}

func (s *Service) recoverKnowledgeDocumentReindexPut(ctx context.Context, repo persistence.KnowledgeDocumentRepository, lease persistence.KnowledgeDocumentLease, r persistence.KnowledgeDocumentRecord, source agentsdk.ManagedKnowledgeDocumentSource, progress *persistence.KnowledgeDocumentProgress) bool {
	if _, ok := source.(agentsdk.KnowledgeDocumentPutRecoverySource); !ok || r.Reindex == nil || r.Reindex.PutRecoveryAttempts >= knowledgeDocumentMaximumAutomaticPutRecoveries {
		return false
	}
	action := knowledgesdk.ActionDocumentsReindex
	if r.PageProjection != nil {
		action = knowledgesdk.ActionPagesPublish
	}
	if _, err := s.DocumentAccess(ctx, r.Document.LibraryID, action, r.Actor); err != nil {
		progress.ErrorCode = "document_upload_access_denied"
		return true
	}
	if s.authorizeDocumentSource(ctx, r.SourceAccess, r.Actor) != nil {
		progress.ErrorCode = "document_source_access_denied"
		return true
	}
	filename, contentBytes, contentSHA256, bodyRef := r.Document.Filename, r.Document.Bytes, r.Document.SHA256, r.BodyRef
	if r.Replacement != nil {
		filename, contentBytes, contentSHA256, bodyRef = r.Replacement.Filename, r.Replacement.Bytes, r.Replacement.SHA256, r.Replacement.BodyRef
	}
	if maximum := DocumentIndexMaximumBytesForFilename(source, filename); maximum < 1 || contentBytes > maximum {
		progress.ErrorCode = "document_index_size_unsupported"
		return true
	}
	content, err := s.options.DocumentStorage.OpenKnowledgeDocumentContent(ctx, DocumentStorageScope(r.Document.LibraryID, r.Actor), knowledgeDocumentStorageID(r), bodyRef, contentSHA256, contentBytes)
	if err != nil {
		progress.ErrorCode = "document_content_mismatch"
		return true
	}
	defer content.Close()
	write, cancel, err := CommittedKnowledgeWriteContext(ctx, lease.ExpiresAt)
	if err != nil {
		return true
	}
	startedRecord, started, err := repo.StartKnowledgeDocumentReindexPutRecovery(write, lease)
	cancel()
	if err != nil || !started || startedRecord.Reindex == nil {
		return true
	}
	input := agentsdk.KnowledgeDocumentIndexContent{DocumentID: startedRecord.Reindex.RemoteID, Filename: filename, Bytes: contentBytes, SHA256: contentSHA256, Content: content, Source: knowledgeDocumentIndexSource(startedRecord, true), RequestID: startedRecord.Reindex.PutRequestID, AccessPolicySHA256: startedRecord.AccessPolicySHA256, PermissionIDs: knowledgeDocumentProjectionPermissionIDs(startedRecord, true)}
	if !RecoverKnowledgeDocumentPut(ctx, source, input, startedRecord.Actor, lease.ExpiresAt) {
		progress.ErrorCode = "document_reindex_put_recovery_uncertain"
		return true
	}
	*progress = persistence.KnowledgeDocumentProgress{Event: "reindex_put_acknowledged", RetryAt: time.Now().UTC().Add(s.options.DocumentPoll)}
	return true
}

type knowledgeDocumentUploadRepository interface {
	TouchKnowledgeDocumentUpload(context.Context, string, agentsdk.Authority) (persistence.KnowledgeDocumentRecord, error)
	ExpireKnowledgeDocumentUploads(context.Context, string, time.Time, int) (int, error)
}

// knowledgeDocumentUnconfirmedDeleteRepository records a cleanup intent for a
// Put whose outcome could not be confirmed.  The application may use this path
// only when the bound source exposes KnowledgeDocumentDeleteRecoverySource:
// that contract turns a same-ID delete into a positive, idempotent upstream
// acknowledgement instead of inferring absence from an ACL-filtered Inspect.
type knowledgeDocumentUnconfirmedDeleteRepository interface {
	StartKnowledgeDocumentUnconfirmedDelete(context.Context, persistence.KnowledgeDocumentLease) error
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

type knowledgeDocumentWorkerTask struct {
	key string
	run func() error
}

func uniqueKnowledgeDocumentWorkerTasks(tasks []knowledgeDocumentWorkerTask) []knowledgeDocumentWorkerTask {
	if len(tasks) < 2 {
		return tasks
	}
	unique := make([]knowledgeDocumentWorkerTask, 0, len(tasks))
	indexByKey := make(map[string]int, len(tasks))
	for _, task := range tasks {
		if index, found := indexByKey[task.key]; found {
			// A later fenced lease is authoritative if a repository ever returns
			// the same durable entity twice in one batch. Replace the pending task
			// instead of executing two lifecycle transitions concurrently.
			unique[index] = task
			continue
		}
		indexByKey[task.key] = len(unique)
		unique = append(unique, task)
	}
	return unique
}

func runKnowledgeDocumentWorkerTasks(tasks []knowledgeDocumentWorkerTask) error {
	tasks = uniqueKnowledgeDocumentWorkerTasks(tasks)
	if len(tasks) == 0 {
		return nil
	}
	workers := knowledgeDocumentWorkerConcurrency
	if workers > len(tasks) {
		workers = len(tasks)
	}
	queue := make(chan knowledgeDocumentWorkerTask)
	errorsByTask := make(chan error, len(tasks))
	var group sync.WaitGroup
	group.Add(workers)
	for range workers {
		go func() {
			defer group.Done()
			for task := range queue {
				if err := task.run(); err != nil {
					errorsByTask <- err
				}
			}
		}()
	}
	for _, task := range tasks {
		queue <- task
	}
	close(queue)
	group.Wait()
	close(errorsByTask)
	var result error
	for err := range errorsByTask {
		result = errors.Join(result, err)
	}
	return result
}

func (s *Service) KnowledgeDocumentWorkerTick(ctx context.Context) (WorkerTickResult, error) {
	repo, ok := s.repo.(persistence.KnowledgeDocumentRepository)
	if !ok || s.options.DocumentStorage == nil {
		return WorkerTickResult{}, nil
	}
	// A service may be exposed through more than one lifecycle adapter. Keep the
	// durable claim-and-run cycle single-flight per process so two supervisors or
	// an operational tick cannot overlap work for the same fenced entity.
	s.documentWorkerTickMu.Lock()
	defer s.documentWorkerTickMu.Unlock()
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
	tasks := make([]knowledgeDocumentWorkerTask, 0, knowledgeDocumentWorkerBatchSize)
	var claimErr error
	if projections, ok := repo.(knowledgesdk.KnowledgePageProjectionRepository); ok {
		for len(tasks) < knowledgeDocumentWorkerBatchSize {
			work, claimed, err := projections.ClaimKnowledgePageProjection(ctx, s.runtimeID, s.owner, now, s.options.DocumentWorkTimeout)
			if err != nil {
				claimErr = errors.Join(claimErr, err)
				break
			}
			if !claimed {
				break
			}
			claimedWork := work
			tasks = append(tasks, knowledgeDocumentWorkerTask{
				key: "page:" + claimedWork.Lease.RuntimeID + ":" + claimedWork.Lease.WorkspaceID + ":" + claimedWork.Lease.LibraryID + ":" + claimedWork.Lease.PageID,
				run: func() error {
					attempt, cancel := context.WithDeadline(ctx, claimedWork.Lease.ExpiresAt)
					defer cancel()
					return s.ProcessKnowledgePageProjection(attempt, projections, claimedWork)
				},
			})
		}
	}
	if claimErr == nil {
		for len(tasks) < knowledgeDocumentWorkerBatchSize {
			lease, claimed, err := repo.ClaimKnowledgeDocumentWork(ctx, s.runtimeID, s.owner, now, s.options.DocumentWorkTimeout)
			if err != nil {
				claimErr = errors.Join(claimErr, err)
				break
			}
			if !claimed {
				break
			}
			claimedLease := lease
			tasks = append(tasks, knowledgeDocumentWorkerTask{
				key: "document:" + claimedLease.RuntimeID + ":" + claimedLease.WorkspaceID + ":" + claimedLease.LibraryID + ":" + claimedLease.DocumentID,
				run: func() error {
					attempt, cancel := context.WithDeadline(ctx, claimedLease.ExpiresAt)
					defer cancel()
					return s.ProcessKnowledgeDocument(attempt, repo, claimedLease)
				},
			})
		}
	}
	if len(tasks) == 0 {
		return WorkerTickResult{}, claimErr
	}
	claimedCount := len(tasks)
	tasks = uniqueKnowledgeDocumentWorkerTasks(tasks)
	workErr := runKnowledgeDocumentWorkerTasks(tasks)
	if claimedCount == knowledgeDocumentWorkerBatchSize {
		// Interrupt the supervisor's normal poll delay while a full batch proves
		// that more durable work may already be available. The durable claim is
		// still authoritative; this is only a lossy wake-up hint.
		s.WakeKnowledgeDocuments()
	}
	return WorkerTickResult{Worked: true, ProcessedCount: len(tasks)}, errors.Join(claimErr, workErr)
}

func (s *Service) ProcessKnowledgeDocument(ctx context.Context, repo persistence.KnowledgeDocumentRepository, lease persistence.KnowledgeDocumentLease) (resultErr error) {
	progress := persistence.KnowledgeDocumentProgress{Event: "retry", ErrorCode: "document_work_unavailable", RetryAt: time.Now().UTC().Add(30 * time.Second)}
	var webhookRecord *persistence.KnowledgeDocumentRecord
	defer func() {
		// A lost response does not release safety state. Persist only through the
		// still-current fenced lease; never let late completion revive deletion.
		finish, cancel := context.WithTimeout(context.WithoutCancel(ctx), 5*time.Second)
		defer cancel()
		applyErr := repo.ApplyKnowledgeDocumentProgress(finish, lease, progress)
		resultErr = errors.Join(resultErr, applyErr)
		if applyErr == nil && webhookRecord != nil && (progress.Event == "indexed" || progress.Event == "reindex_indexed") {
			pageID, version := "", webhookRecord.Document.Revision
			if webhookRecord.PageProjection != nil {
				pageID, version = webhookRecord.PageProjection.PageID, webhookRecord.PageProjection.Version
			}
			resultErr = errors.Join(resultErr, s.appendKnowledgeWebhook(finish, knowledgesdk.KnowledgeWebhookIndexCompleted, knowledgesdk.ActionPageSearch, webhookRecord.Document.LibraryID, pageID, webhookRecord.Document.ID, version, webhookRecord.Actor))
		}
	}()
	r, err := repo.KnowledgeDocumentWorkRecord(ctx, lease)
	if err != nil {
		return
	}
	webhookRecord = &r
	deleting := r.Document.State == "deleting"
	if deleting && !r.PutStarted {
		if s.deleteKnowledgeDocumentStoredContent(ctx, r) != nil {
			progress.ErrorCode = "document_cleanup_failed"
			return
		}
		progress.Event = "deleted"
		progress.ErrorCode = ""
		progress.RetryAt = time.Time{}
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
		content, openErr := s.options.DocumentStorage.OpenKnowledgeDocumentContent(ctx, DocumentStorageScope(startedRecord.Document.LibraryID, startedRecord.Actor), knowledgeDocumentStorageID(startedRecord), startedRecord.BodyRef, startedRecord.Document.SHA256, startedRecord.Document.Bytes)
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
	if r.SourceID == "" {
		progress.Event = "stored"
		progress.IndexStatus = "STORED"
		progress.ErrorCode = ""
		progress.RetryAt = time.Time{}
		return
	}
	// An unobserved Put can reach this state only through the explicit
	// idempotent-delete recovery contract: ordinary deletion cannot start until
	// IndexObserved is true.  Once that recovery has a positive acknowledgement,
	// remote cleanup is established and local finalization must not depend on a
	// datasource binding that may already have been removed.
	if deleting && r.PutStarted && !r.IndexObserved && r.DeleteStarted && r.DeleteAcknowledged {
		if s.deleteKnowledgeDocumentStoredContent(ctx, r) != nil {
			progress.ErrorCode = "document_cleanup_failed"
			return
		}
		progress.Event = "deleted"
		progress.ErrorCode = ""
		progress.RetryAt = time.Time{}
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
	if deleting && r.PutStarted && !r.IndexObserved && !r.DeleteStarted {
		recoveryRepo, persisted := repo.(knowledgeDocumentUnconfirmedDeleteRepository)
		_, supported := source.(agentsdk.KnowledgeDocumentDeleteRecoverySource)
		if persisted && supported {
			write, cancel, commitErr := CommittedKnowledgeWriteContext(ctx, lease.ExpiresAt)
			if commitErr != nil {
				return
			}
			commitErr = recoveryRepo.StartKnowledgeDocumentUnconfirmedDelete(write, lease)
			cancel()
			if commitErr != nil {
				return commitErr
			}
			progress.ErrorCode = "document_delete_uncertain"
			if RecoverKnowledgeDocumentDelete(ctx, source, r.RemoteID, r.Actor, lease.ExpiresAt) {
				progress = persistence.KnowledgeDocumentProgress{Event: "delete_acknowledged", RetryAt: time.Now().UTC().Add(s.options.DocumentPoll)}
			}
			return
		}
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
			// The immutable original is still a valid uploaded file when the
			// provider cannot index its size. This also applies when a provider's
			// limit changes while an unstarted upload is queued. Published page
			// projections must retain their explicit indexing failure instead.
			if r.PageProjection == nil {
				progress = persistence.KnowledgeDocumentProgress{Event: "stored", IndexStatus: "STORED"}
				return
			}
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
		content, err := s.options.DocumentStorage.OpenKnowledgeDocumentContent(ctx, DocumentStorageScope(r.Document.LibraryID, r.Actor), knowledgeDocumentStorageID(r), r.BodyRef, r.Document.SHA256, r.Document.Bytes)
		if err != nil {
			progress.ErrorCode = "document_content_mismatch"
			return
		}
		defer content.Close()
		// Never overwrite a preexisting remote document, even with our exclusive
		// deterministic ID. The provider does not promise idempotent uploads.
		state, err := inspectKnowledgeDocument(ctx, source, r.RemoteID, knowledgeDocumentProjectionPermissionIDs(r, false), r.Actor)
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
		permissionIDs := knowledgeDocumentProjectionPermissionIDs(startedRecord, false)
		if err = source.PutKnowledgeDocument(write, agentsdk.KnowledgeDocumentIndexContent{DocumentID: startedRecord.RemoteID, Filename: startedRecord.Document.Filename, Bytes: startedRecord.Document.Bytes, SHA256: startedRecord.Document.SHA256, Content: content, Source: knowledgeDocumentIndexSource(startedRecord, false), RequestID: startedRecord.PutRequestID, AccessPolicySHA256: startedRecord.AccessPolicySHA256, PermissionIDs: permissionIDs}, r.Actor); err != nil {
			progress.ErrorCode = "document_put_uncertain"
			return
		}
		progress = persistence.KnowledgeDocumentProgress{Event: "put_acknowledged", RetryAt: time.Now().UTC().Add(s.options.DocumentPoll)}
		return
	}
	state, err := inspectKnowledgeDocument(ctx, source, r.RemoteID, knowledgeDocumentProjectionPermissionIDs(r, false), r.Actor)
	if err != nil || state.DocumentID != r.RemoteID {
		progress.ErrorCode = "document_inspect_failed"
		return
	}
	progress.IndexStatus = state.IndexStatus
	progress.RetryAt = time.Now().UTC().Add(s.options.DocumentPoll)
	progress.ErrorCode = ""
	if (state.IndexStatus == "FAILED" || state.IndexStatus == "ERROR" || !state.Exists && (r.Document.ErrorCode == "document_put_uncertain" || r.Document.ErrorCode == "document_put_unconfirmed")) && s.recoverKnowledgeDocumentPut(ctx, repo, lease, r, source, &progress) {
		return
	}
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
		if s.deleteKnowledgeDocumentStoredContent(ctx, r) != nil {
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
		state, err := inspectKnowledgeDocument(ctx, source, target.RemoteID, knowledgeDocumentProjectionPermissionIDs(r, true), r.Actor)
		if err != nil || state.DocumentID != target.RemoteID {
			progress.ErrorCode = "document_inspect_failed"
			return
		}
		if state.Exists {
			progress.ErrorCode = "document_remote_conflict"
			return
		}
		content, err := s.options.DocumentStorage.OpenKnowledgeDocumentContent(ctx, DocumentStorageScope(r.Document.LibraryID, r.Actor), knowledgeDocumentStorageID(r), bodyRef, contentSHA256, contentBytes)
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
		permissionIDs := knowledgeDocumentProjectionPermissionIDs(startedRecord, true)
		if err = source.PutKnowledgeDocument(write, agentsdk.KnowledgeDocumentIndexContent{DocumentID: startedRecord.Reindex.RemoteID, Filename: filename, Bytes: contentBytes, SHA256: contentSHA256, Content: content, Source: knowledgeDocumentIndexSource(startedRecord, true), RequestID: startedRecord.Reindex.PutRequestID, AccessPolicySHA256: startedRecord.AccessPolicySHA256, PermissionIDs: permissionIDs}, r.Actor); err != nil {
			progress.ErrorCode = "document_reindex_put_uncertain"
			return
		}
		*progress = persistence.KnowledgeDocumentProgress{Event: "reindex_put_acknowledged", RetryAt: time.Now().UTC().Add(s.options.DocumentPoll)}
		return
	}
	state, err := inspectKnowledgeDocument(ctx, source, target.RemoteID, knowledgeDocumentProjectionPermissionIDs(r, true), r.Actor)
	if err != nil || state.DocumentID != target.RemoteID {
		progress.ErrorCode = "document_inspect_failed"
		return
	}
	progress.IndexStatus = state.IndexStatus
	progress.RetryAt = time.Now().UTC().Add(s.options.DocumentPoll)
	if (state.IndexStatus == "FAILED" || state.IndexStatus == "ERROR" || !state.Exists && (r.Document.ErrorCode == "document_reindex_put_uncertain" || r.Document.ErrorCode == "document_reindex_put_unconfirmed")) && s.recoverKnowledgeDocumentReindexPut(ctx, repo, lease, r, source, progress) {
		return
	}
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
	state, err := inspectKnowledgeDocument(ctx, source, retired, knowledgeDocumentProjectionPermissionIDs(r, false), r.Actor)
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
