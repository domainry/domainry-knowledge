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
	}, Replacement: &persistence.KnowledgeDocumentReplacement{PageProjection: persistence.KnowledgePageProjectionOrigin{
		PageID: "kpage-current", Version: 4, Title: "新版发布流程", LibraryKind: "shared", ContentType: "document",
	}}}
	current := knowledgeDocumentIndexSource(record, false)
	replacement := knowledgeDocumentIndexSource(record, true)
	if current == nil || current.Title != "发布流程" || current.PageID != "kpage-current" || current.PageVersion != 3 || current.LibraryKind != "shared" || current.ContentType != "document" {
		t.Fatalf("current source metadata lost: %+v", current)
	}
	if replacement == nil || replacement.Title != "新版发布流程" || replacement.PageVersion != 4 {
		t.Fatalf("replacement source metadata lost: %+v", replacement)
	}
	if got := knowledgeDocumentIndexSource(persistence.KnowledgeDocumentRecord{}, false); got != nil {
		t.Fatalf("ordinary uploaded document gained page metadata: %+v", got)
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
