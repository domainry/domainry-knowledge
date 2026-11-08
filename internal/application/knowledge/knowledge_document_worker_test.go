package application

import (
	"context"
	"sync"
	"testing"
	"time"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
)

type uploadExpirySweep struct {
	before time.Time
	limit  int
}

type uploadExpiryWorkerRepository struct {
	persistence.KnowledgeDocumentRepository
	once   sync.Once
	called chan uploadExpirySweep
}

func (*uploadExpiryWorkerRepository) ClaimKnowledgeDocumentWork(context.Context, string, string, time.Time, time.Duration) (persistence.KnowledgeDocumentLease, bool, error) {
	return persistence.KnowledgeDocumentLease{}, false, nil
}

func (*uploadExpiryWorkerRepository) TouchKnowledgeDocumentUpload(context.Context, string, agentsdk.Authority) (persistence.KnowledgeDocumentRecord, error) {
	return persistence.KnowledgeDocumentRecord{}, nil
}

func (repo *uploadExpiryWorkerRepository) ExpireKnowledgeDocumentUploads(_ context.Context, _ string, before time.Time, limit int) (int, error) {
	repo.once.Do(func() { repo.called <- uploadExpirySweep{before: before, limit: limit} })
	return 0, nil
}

type uploadExpiryDocumentStorage struct {
	agentsdk.KnowledgeDocumentStorage
}

type batchedProjectionRepository struct {
	persistence.KnowledgeDocumentRepository
	knowledgesdk.KnowledgePageProjectionRepository

	mu                sync.Mutex
	remaining         int
	claimed           int
	skipped           int
	active            int
	maximumConcurrent int
}

type batchedDocumentRepository struct {
	persistence.KnowledgeDocumentRepository

	mu        sync.Mutex
	remaining []persistence.KnowledgeDocumentLease
	processed map[string]int
}

func (repo *batchedDocumentRepository) ClaimKnowledgeDocumentWork(_ context.Context, _, owner string, _ time.Time, leaseDuration time.Duration) (persistence.KnowledgeDocumentLease, bool, error) {
	repo.mu.Lock()
	defer repo.mu.Unlock()
	if len(repo.remaining) == 0 {
		return persistence.KnowledgeDocumentLease{}, false, nil
	}
	lease := repo.remaining[0]
	repo.remaining = repo.remaining[1:]
	lease.Owner = owner
	lease.ExpiresAt = time.Now().UTC().Add(leaseDuration)
	return lease, true, nil
}

func (repo *batchedDocumentRepository) KnowledgeDocumentWorkRecord(_ context.Context, lease persistence.KnowledgeDocumentLease) (persistence.KnowledgeDocumentRecord, error) {
	repo.mu.Lock()
	repo.processed[lease.DocumentID]++
	repo.mu.Unlock()
	return persistence.KnowledgeDocumentRecord{
		Actor:    agentsdk.Authority{Known: true, RuntimeID: lease.RuntimeID, WorkspaceID: lease.WorkspaceID, UserID: "user-a"},
		Document: agentsdk.KnowledgeDocument{ID: lease.DocumentID, LibraryID: lease.LibraryID, State: "deleting"},
	}, nil
}

func (*batchedDocumentRepository) ApplyKnowledgeDocumentProgress(context.Context, persistence.KnowledgeDocumentLease, persistence.KnowledgeDocumentProgress) error {
	return nil
}

type batchedDocumentStorage struct {
	agentsdk.KnowledgeDocumentStorage
}

func (*batchedDocumentStorage) DeleteKnowledgeDocumentContent(context.Context, agentsdk.KnowledgeDocumentStorageScope, string) error {
	return nil
}

type serialTickRepository struct {
	persistence.KnowledgeDocumentRepository

	mu                sync.Mutex
	active            int
	maximumConcurrent int
	entered           chan struct{}
	release           chan struct{}
}

func (repo *serialTickRepository) ClaimKnowledgeDocumentWork(context.Context, string, string, time.Time, time.Duration) (persistence.KnowledgeDocumentLease, bool, error) {
	repo.mu.Lock()
	repo.active++
	if repo.active > repo.maximumConcurrent {
		repo.maximumConcurrent = repo.active
	}
	repo.mu.Unlock()
	repo.entered <- struct{}{}
	<-repo.release
	repo.mu.Lock()
	repo.active--
	repo.mu.Unlock()
	return persistence.KnowledgeDocumentLease{}, false, nil
}

func (repo *batchedProjectionRepository) ClaimKnowledgePageProjection(_ context.Context, runtimeID, owner string, _ time.Time, leaseDuration time.Duration) (knowledgesdk.KnowledgePageProjectionWork, bool, error) {
	repo.mu.Lock()
	defer repo.mu.Unlock()
	if repo.remaining == 0 {
		return knowledgesdk.KnowledgePageProjectionWork{}, false, nil
	}
	repo.remaining--
	repo.claimed++
	index := repo.claimed
	actor := agentsdk.Authority{Known: true, RuntimeID: runtimeID, WorkspaceID: "workspace-a", UserID: "user-a"}
	return knowledgesdk.KnowledgePageProjectionWork{Lease: knowledgesdk.KnowledgePageProjectionLease{
		RuntimeID: runtimeID, WorkspaceID: actor.WorkspaceID, LibraryID: "library-a",
		PageID: "page-" + time.Unix(int64(index), 0).UTC().Format("150405"), Owner: owner,
		Token: int64(index), ExpiresAt: time.Now().UTC().Add(leaseDuration), Actor: actor,
	}}, true, nil
}

func (*batchedProjectionRepository) CompleteKnowledgePageProjection(context.Context, knowledgesdk.KnowledgePageProjectionLease, string, int64, string, string, string) error {
	return nil
}

func (*batchedProjectionRepository) RetryKnowledgePageProjection(context.Context, knowledgesdk.KnowledgePageProjectionLease, time.Time) error {
	return nil
}

func (repo *batchedProjectionRepository) SkipKnowledgePageProjection(context.Context, knowledgesdk.KnowledgePageProjectionLease) error {
	repo.mu.Lock()
	repo.active++
	if repo.active > repo.maximumConcurrent {
		repo.maximumConcurrent = repo.active
	}
	repo.mu.Unlock()
	time.Sleep(10 * time.Millisecond)
	repo.mu.Lock()
	repo.active--
	repo.skipped++
	repo.mu.Unlock()
	return nil
}

func (*batchedProjectionRepository) ClaimKnowledgeDocumentWork(context.Context, string, string, time.Time, time.Duration) (persistence.KnowledgeDocumentLease, bool, error) {
	return persistence.KnowledgeDocumentLease{}, false, nil
}

type deletionDocumentStorage struct {
	agentsdk.KnowledgeDocumentStorage
	deleted []string
}

func (storage *deletionDocumentStorage) DeleteKnowledgeDocumentContent(_ context.Context, _ agentsdk.KnowledgeDocumentStorageScope, documentID string) error {
	storage.deleted = append(storage.deleted, documentID)
	return nil
}

type deletionDocumentRepository struct {
	persistence.KnowledgeDocumentRepository
	record  persistence.KnowledgeDocumentRecord
	applied persistence.KnowledgeDocumentProgress
}

type unconfirmedDeletionRepository struct {
	deletionDocumentRepository
	starts int
}

func (repo *unconfirmedDeletionRepository) StartKnowledgeDocumentUnconfirmedDelete(context.Context, persistence.KnowledgeDocumentLease) error {
	repo.starts++
	return nil
}

type unconfirmedDeletionSource struct {
	sourceUploadProvider
	recoveries int
}

func (source *unconfirmedDeletionSource) RecoverKnowledgeDocumentDelete(context.Context, string, agentsdk.Authority) error {
	source.recoveries++
	return nil
}

func (repo *deletionDocumentRepository) KnowledgeDocumentWorkRecord(context.Context, persistence.KnowledgeDocumentLease) (persistence.KnowledgeDocumentRecord, error) {
	return repo.record, nil
}

func (repo *deletionDocumentRepository) ApplyKnowledgeDocumentProgress(_ context.Context, _ persistence.KnowledgeDocumentLease, progress persistence.KnowledgeDocumentProgress) error {
	repo.applied = progress
	return nil
}

func TestKnowledgeDocumentDeletionPreservesReversiblePageProjectionContent(t *testing.T) {
	actor := agentsdk.Authority{Known: true, RuntimeID: "runtime-a", WorkspaceID: "workspace-a", UserID: "user-a"}
	lease := persistence.KnowledgeDocumentLease{RuntimeID: actor.RuntimeID, WorkspaceID: actor.WorkspaceID, LibraryID: "klib_page", DocumentID: "kdoc_page", Owner: "worker", Token: 1, ExpiresAt: time.Now().UTC().Add(time.Minute)}
	for _, test := range []struct {
		name                 string
		pageProjection       *persistence.KnowledgePageProjectionOrigin
		pageLifecycleManaged bool
		wantStorageDelete    bool
	}{
		{name: "page archive retains private projection body", pageProjection: &persistence.KnowledgePageProjectionOrigin{PageID: "kpage_page", Version: 1, AccessRevision: 1}},
		{name: "file page archive retains immutable original", pageLifecycleManaged: true},
		{name: "uploaded document deletion remains irreversible", wantStorageDelete: true},
	} {
		t.Run(test.name, func(t *testing.T) {
			storage := &deletionDocumentStorage{}
			repo := &deletionDocumentRepository{record: persistence.KnowledgeDocumentRecord{
				PageProjection:       test.pageProjection,
				PageLifecycleManaged: test.pageLifecycleManaged,
				Document:             agentsdk.KnowledgeDocument{ID: lease.DocumentID, LibraryID: lease.LibraryID, State: "deleting"},
				Actor:                actor,
			}}
			service := NewService(repo, actor.RuntimeID, Options{DocumentStorage: storage}, nil)
			if err := service.ProcessKnowledgeDocument(t.Context(), repo, lease); err != nil {
				t.Fatal(err)
			}
			if repo.applied.Event != "deleted" {
				t.Fatalf("deletion progress=%+v", repo.applied)
			}
			if got := len(storage.deleted); (got == 1) != test.wantStorageDelete {
				t.Fatalf("storage deletes=%v want_delete=%v", storage.deleted, test.wantStorageDelete)
			}
		})
	}
}

func TestDeletingUnconfirmedPutUsesExplicitIdempotentDeleteRecovery(t *testing.T) {
	actor := agentsdk.Authority{Known: true, RuntimeID: "runtime-a", WorkspaceID: "workspace-a", UserID: "user-a"}
	lease := persistence.KnowledgeDocumentLease{RuntimeID: actor.RuntimeID, WorkspaceID: actor.WorkspaceID, LibraryID: "library-a", DocumentID: "document-a", Owner: "worker", Token: 1, ExpiresAt: time.Now().UTC().Add(time.Minute)}
	source := &unconfirmedDeletionSource{}
	repo := &unconfirmedDeletionRepository{deletionDocumentRepository: deletionDocumentRepository{record: persistence.KnowledgeDocumentRecord{
		Document:              agentsdk.KnowledgeDocument{ID: lease.DocumentID, LibraryID: lease.LibraryID, State: "deleting", SecurityStatus: "clean"},
		Actor:                 actor,
		SourceID:              source.KnowledgeDocumentSourceIdentity(),
		RemoteID:              "remote-document-a",
		PutStarted:            true,
		SecurityScanStarted:   true,
		SecurityScanCompleted: true,
	}}}
	service := NewService(repo, actor.RuntimeID, Options{
		DocumentStorage:  &deletionDocumentStorage{},
		LibraryKnowledge: []LibraryKnowledgeBinding{{WorkspaceID: actor.WorkspaceID, LibraryID: lease.LibraryID, Source: source, ManageDocuments: true}},
	}, nil)
	if err := service.ProcessKnowledgeDocument(t.Context(), repo, lease); err != nil {
		t.Fatal(err)
	}
	if repo.starts != 1 || source.recoveries != 1 || repo.applied.Event != "delete_acknowledged" || repo.applied.ErrorCode != "" {
		t.Fatalf("starts=%d recoveries=%d progress=%+v", repo.starts, source.recoveries, repo.applied)
	}
}

func TestDeletingUnconfirmedPutWithAcknowledgedRecoveryFinalizesWithoutSourceBinding(t *testing.T) {
	actor := agentsdk.Authority{Known: true, RuntimeID: "runtime-a", WorkspaceID: "workspace-a", UserID: "user-a"}
	lease := persistence.KnowledgeDocumentLease{RuntimeID: actor.RuntimeID, WorkspaceID: actor.WorkspaceID, LibraryID: "library-a", DocumentID: "document-a", Owner: "worker", Token: 1, ExpiresAt: time.Now().UTC().Add(time.Minute)}
	storage := &deletionDocumentStorage{}
	repo := &deletionDocumentRepository{record: persistence.KnowledgeDocumentRecord{
		Document:              agentsdk.KnowledgeDocument{ID: lease.DocumentID, LibraryID: lease.LibraryID, State: "deleting", SecurityStatus: "clean"},
		Actor:                 actor,
		SourceID:              "removed-source",
		RemoteID:              "remote-document-a",
		PutStarted:            true,
		SecurityScanStarted:   true,
		SecurityScanCompleted: true,
		DeleteStarted:         true,
		DeleteAcknowledged:    true,
	}}
	service := NewService(repo, actor.RuntimeID, Options{DocumentStorage: storage}, nil)
	if err := service.ProcessKnowledgeDocument(t.Context(), repo, lease); err != nil {
		t.Fatal(err)
	}
	if repo.applied.Event != "deleted" || repo.applied.ErrorCode != "" || len(storage.deleted) != 1 || storage.deleted[0] != lease.DocumentID {
		t.Fatalf("progress=%+v storage=%v", repo.applied, storage.deleted)
	}
}

func TestKnowledgeDocumentIndexSourcePreservesPageProjectionMetadata(t *testing.T) {
	record := persistence.KnowledgeDocumentRecord{PageProjection: &persistence.KnowledgePageProjectionOrigin{
		PageID: "kpage-current", Version: 3, Title: "发布流程", LibraryKind: "shared", ContentType: "document",
		Breadcrumbs: []agentsdk.KnowledgePageBreadcrumb{{PageID: "kpage-root", Title: "研发"}, {PageID: "kpage-current", Title: "发布流程"}},
	}, Replacement: &persistence.KnowledgeDocumentReplacement{PageProjection: persistence.KnowledgePageProjectionOrigin{
		PageID: "kpage-current", Version: 4, Title: "新版发布流程", LibraryKind: "shared", ContentType: "document",
		Breadcrumbs: []agentsdk.KnowledgePageBreadcrumb{{PageID: "kpage-root", Title: "研发"}, {PageID: "kpage-current", Title: "新版发布流程"}},
	}}}
	current := knowledgeDocumentIndexSource(record, false)
	replacement := knowledgeDocumentIndexSource(record, true)
	if current == nil || current.Title != "发布流程" || current.PageID != "kpage-current" || current.PageVersion != 3 || current.LibraryKind != "shared" || current.ContentType != "document" || len(current.Breadcrumbs) != 2 || current.Breadcrumbs[0].PageID != "kpage-root" {
		t.Fatalf("current source metadata lost: %+v", current)
	}
	if replacement == nil || replacement.Title != "新版发布流程" || replacement.PageVersion != 4 {
		t.Fatalf("replacement source metadata lost: %+v", replacement)
	}
	if got := knowledgeDocumentIndexSource(persistence.KnowledgeDocumentRecord{}, false); got != nil {
		t.Fatalf("ordinary uploaded document gained page metadata: %+v", got)
	}
}

func TestKnowledgeDocumentStorageIDUsesOriginalForPageAttachmentProjection(t *testing.T) {
	attachment := persistence.KnowledgeDocumentRecord{
		DocumentOrigin: &persistence.KnowledgeDocumentOrigin{DocumentID: "kdoc_original"},
		Document:       agentsdk.KnowledgeDocument{ID: "kdoc_page_attachment", ProjectionKind: "page_attachment"},
	}
	if got := knowledgeDocumentStorageID(attachment); got != "kdoc_original" {
		t.Fatalf("page attachment opened storage for %q, want immutable original", got)
	}
	ordinary := persistence.KnowledgeDocumentRecord{Document: agentsdk.KnowledgeDocument{ID: "kdoc_file", ProjectionKind: "file"}}
	if got := knowledgeDocumentStorageID(ordinary); got != "kdoc_file" {
		t.Fatalf("ordinary document opened storage for %q", got)
	}
}

func TestKnowledgeDocumentWorkerSweepsIdleUploads(t *testing.T) {
	repo := &uploadExpiryWorkerRepository{called: make(chan uploadExpirySweep, 1)}
	service := NewService(repo, "runtime-a", Options{DocumentStorage: &uploadExpiryDocumentStorage{}}, nil)
	if _, err := service.KnowledgeDocumentWorkerTick(t.Context()); err != nil {
		t.Fatal(err)
	}

	select {
	case sweep := <-repo.called:
		if sweep.limit != knowledgeDocumentUploadExpiryBatchSize {
			t.Fatalf("expiry batch=%d", sweep.limit)
		}
		age := time.Since(sweep.before)
		if age < 24*time.Hour-time.Second || age > 24*time.Hour+time.Second {
			t.Fatalf("default upload idle timeout age=%s", age)
		}
	case <-time.After(time.Second):
		t.Fatal("document worker did not sweep idle uploads")
	}
}

func TestKnowledgeDocumentWorkerUsesFixedBatchAndBoundedConcurrency(t *testing.T) {
	repository := &batchedProjectionRepository{remaining: knowledgeDocumentWorkerBatchSize + 8}
	service := NewService(repository, "runtime-a", Options{DocumentStorage: &uploadExpiryDocumentStorage{}}, nil)

	first, err := service.KnowledgeDocumentWorkerTick(t.Context())
	if err != nil {
		t.Fatal(err)
	}
	if !first.Worked || first.ProcessedCount != knowledgeDocumentWorkerBatchSize {
		t.Fatalf("first batch=%+v", first)
	}
	repository.mu.Lock()
	firstSkipped, firstMaximum := repository.skipped, repository.maximumConcurrent
	repository.mu.Unlock()
	if firstSkipped != knowledgeDocumentWorkerBatchSize || firstMaximum < 2 || firstMaximum > knowledgeDocumentWorkerConcurrency {
		t.Fatalf("first skipped=%d max_concurrent=%d", firstSkipped, firstMaximum)
	}

	second, err := service.KnowledgeDocumentWorkerTick(t.Context())
	if err != nil {
		t.Fatal(err)
	}
	if !second.Worked || second.ProcessedCount != 8 {
		t.Fatalf("second batch=%+v", second)
	}
	repository.mu.Lock()
	defer repository.mu.Unlock()
	if repository.skipped != knowledgeDocumentWorkerBatchSize+8 || repository.remaining != 0 || repository.maximumConcurrent > knowledgeDocumentWorkerConcurrency {
		t.Fatalf("skipped=%d remaining=%d max_concurrent=%d", repository.skipped, repository.remaining, repository.maximumConcurrent)
	}
}

func TestKnowledgeDocumentWorkerProcessesEveryClaimedDocumentOnce(t *testing.T) {
	repository := &batchedDocumentRepository{processed: map[string]int{}}
	for index := range knowledgeDocumentWorkerBatchSize {
		repository.remaining = append(repository.remaining, persistence.KnowledgeDocumentLease{
			RuntimeID: "runtime-a", WorkspaceID: "workspace-a", LibraryID: "library-a",
			DocumentID: "document-" + time.Unix(int64(index), 0).UTC().Format("150405"), Token: int64(index + 1),
		})
	}
	service := NewService(repository, "runtime-a", Options{DocumentStorage: &batchedDocumentStorage{}}, nil)

	result, err := service.KnowledgeDocumentWorkerTick(t.Context())
	if err != nil {
		t.Fatal(err)
	}
	if !result.Worked || result.ProcessedCount != knowledgeDocumentWorkerBatchSize {
		t.Fatalf("batch=%+v", result)
	}
	repository.mu.Lock()
	defer repository.mu.Unlock()
	if len(repository.processed) != knowledgeDocumentWorkerBatchSize {
		t.Fatalf("processed documents=%v", repository.processed)
	}
	for documentID, count := range repository.processed {
		if count != 1 {
			t.Fatalf("document %s processed %d times", documentID, count)
		}
	}
}

func TestKnowledgeDocumentWorkerDeduplicatesDurableEntityWithinBatch(t *testing.T) {
	runs := 0
	tasks := []knowledgeDocumentWorkerTask{
		{key: "document:runtime:workspace:library:document", run: func() error { runs += 100; return nil }},
		{key: "document:runtime:workspace:library:document", run: func() error { runs++; return nil }},
	}
	if err := runKnowledgeDocumentWorkerTasks(tasks); err != nil {
		t.Fatal(err)
	}
	if runs != 1 {
		t.Fatalf("duplicate durable entity ran %d weighted times", runs)
	}
}

func TestKnowledgeDocumentWorkerSerializesConcurrentTicks(t *testing.T) {
	repository := &serialTickRepository{entered: make(chan struct{}, 2), release: make(chan struct{}, 2)}
	service := NewService(repository, "runtime-a", Options{DocumentStorage: &uploadExpiryDocumentStorage{}}, nil)
	errors := make(chan error, 2)
	go func() { _, err := service.KnowledgeDocumentWorkerTick(t.Context()); errors <- err }()
	select {
	case <-repository.entered:
	case <-time.After(time.Second):
		t.Fatal("first worker tick did not enter repository")
	}
	go func() { _, err := service.KnowledgeDocumentWorkerTick(t.Context()); errors <- err }()
	select {
	case <-repository.entered:
		t.Fatal("second worker tick entered repository before first completed")
	case <-time.After(50 * time.Millisecond):
	}
	repository.release <- struct{}{}
	select {
	case <-repository.entered:
	case <-time.After(time.Second):
		t.Fatal("second worker tick did not enter after first completed")
	}
	repository.release <- struct{}{}
	for range 2 {
		if err := <-errors; err != nil {
			t.Fatal(err)
		}
	}
	repository.mu.Lock()
	defer repository.mu.Unlock()
	if repository.maximumConcurrent != 1 {
		t.Fatalf("maximum concurrent repository claims=%d", repository.maximumConcurrent)
	}
}

func TestOversizedOriginalIsStoredWithoutCallingProvider(t *testing.T) {
	actor := agentsdk.Authority{Known: true, RuntimeID: "runtime-a", WorkspaceID: "workspace-a", UserID: "user-a"}
	source := &limitedUploadProvider{}
	for _, projection := range []bool{false, true} {
		t.Run(map[bool]string{false: "uploaded original", true: "published page projection"}[projection], func(t *testing.T) {
			record := persistence.KnowledgeDocumentRecord{
				Actor: actor, SourceID: source.KnowledgeDocumentSourceIdentity(), SecurityScanCompleted: true,
				Document: agentsdk.KnowledgeDocument{ID: "document-a", LibraryID: "library-a", Filename: "oversized.txt", Bytes: 17, State: "queued"},
			}
			if projection {
				record.PageProjection = &persistence.KnowledgePageProjectionOrigin{PageID: "page-a", Version: 1}
			}
			repo := &deletionDocumentRepository{record: record}
			service := NewService(repo, actor.RuntimeID, Options{
				DocumentStorage:  &uploadExpiryDocumentStorage{},
				LibraryKnowledge: []LibraryKnowledgeBinding{{WorkspaceID: actor.WorkspaceID, LibraryID: "library-a", Source: source, ManageDocuments: true}},
			}, nil)
			lease := persistence.KnowledgeDocumentLease{RuntimeID: actor.RuntimeID, WorkspaceID: actor.WorkspaceID, LibraryID: "library-a", DocumentID: "document-a", Owner: "worker", Token: 1, ExpiresAt: time.Now().Add(time.Minute)}
			if err := service.ProcessKnowledgeDocument(t.Context(), repo, lease); err != nil {
				t.Fatal(err)
			}
			if projection {
				if repo.applied.Event != "retry" || repo.applied.ErrorCode != "document_index_size_unsupported" {
					t.Fatalf("page projection lost indexing failure: %+v", repo.applied)
				}
			} else if repo.applied.Event != "stored" || repo.applied.IndexStatus != "STORED" || repo.applied.ErrorCode != "" {
				t.Fatalf("original was not stored: %+v", repo.applied)
			}
		})
	}
}

type localOnlyProjectionRepository struct {
	knowledgesdk.KnowledgePageProjectionRepository
	skipped int
	retried int
}

func (repo *localOnlyProjectionRepository) SkipKnowledgePageProjection(context.Context, knowledgesdk.KnowledgePageProjectionLease) error {
	repo.skipped++
	return nil
}

func (repo *localOnlyProjectionRepository) RetryKnowledgePageProjection(context.Context, knowledgesdk.KnowledgePageProjectionLease, time.Time) error {
	repo.retried++
	return nil
}

func TestKnowledgePageProjectionStopsForLocalOnlyLibrary(t *testing.T) {
	repository := &localOnlyProjectionRepository{}
	service := NewService(nil, "runtime-a", Options{}, nil)
	work := knowledgesdk.KnowledgePageProjectionWork{Lease: knowledgesdk.KnowledgePageProjectionLease{
		RuntimeID: "runtime-a", WorkspaceID: "workspace-a", LibraryID: "klib_local", PageID: "kpage_local",
		Actor: agentsdk.Authority{Known: true, RuntimeID: "runtime-a", WorkspaceID: "workspace-a", UserID: "user-a"},
	}}
	if err := service.ProcessKnowledgePageProjection(t.Context(), repository, work); err != nil {
		t.Fatal(err)
	}
	if repository.skipped != 1 || repository.retried != 0 {
		t.Fatalf("skipped=%d retried=%d", repository.skipped, repository.retried)
	}
}
