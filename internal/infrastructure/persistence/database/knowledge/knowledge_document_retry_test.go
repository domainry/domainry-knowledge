package store

import (
	"context"
	"database/sql"
	"errors"
	"path/filepath"
	"testing"
	"time"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
	"github.com/domainry/domainry-knowledge/internal/infrastructure/documentstorage"
)

func saveRetryFixture(t *testing.T, db interface {
	ExecContext(context.Context, string, ...any) (sql.Result, error)
}, record persistence.KnowledgeDocumentRecord, authority agentsdk.Authority) {
	t.Helper()
	if _, err := db.ExecContext(t.Context(), `UPDATE _knowledge_documents SET state=?, revision=?, payload_json=? WHERE scope_key=? AND document_id=?`, record.Document.State, record.Document.Revision, conversationJSON(record), libraryScope(authority), record.Document.ID); err != nil {
		t.Fatal(err)
	}
}

func TestReleasedKnowledgeDocumentLeasePreservesRetryInput(t *testing.T) {
	expiresAt := time.Now().UTC().Add(time.Minute)
	lease := persistence.KnowledgeDocumentLease{
		RuntimeID:   "runtime",
		WorkspaceID: "workspace",
		LibraryID:   "library",
		DocumentID:  "document",
		Owner:       "worker",
		Token:       7,
		ExpiresAt:   expiresAt,
	}
	released := releasedKnowledgeDocumentLease(lease)
	if released.Owner != "" || !released.ExpiresAt.IsZero() {
		t.Fatalf("released lease retained ownership: %+v", released)
	}
	if lease.Owner != "worker" || !lease.ExpiresAt.Equal(expiresAt) || lease.Token != 7 {
		t.Fatalf("release mutated fenced retry input: %+v", lease)
	}
}

func TestKnowledgeDocumentRetryResetsOnlySafeStage(t *testing.T) {
	store, db := openSubjectKnowledgeStore(t)
	storage, err := documentstorage.NewFiles(filepath.Join(t.TempDir(), "documents"))
	if err != nil {
		t.Fatal(err)
	}
	authority := agentsdk.Authority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "alice", RoleKey: "member"}
	library, err := store.CreateKnowledgeLibrary(t.Context(), agentsdk.KnowledgeLibraryCreate{ClientID: "retry-library", Kind: "personal", Name: "Retry"}, authority)
	if err != nil {
		t.Fatal(err)
	}

	failedScan := reserveSubjectDocument(t, store, storage, library, "failed-scan", authority)
	failedScan.Document.State = "failed"
	failedScan.Document.ProcessingStage = "failed"
	failedScan.Document.SecurityStatus = "scanning"
	failedScan.Document.ErrorCode = "document_security_scan_failed"
	failedScan.SecurityScanStarted = true
	saveRetryFixture(t, db, failedScan, authority)

	retried, err := store.RequestKnowledgeDocumentRetry(t.Context(), failedScan.Document.ID, failedScan.Document.Revision, authority)
	if err != nil {
		t.Fatal(err)
	}
	if retried.Document.State != "quarantined" || retried.Document.ProcessingStage != "scan" || retried.Document.SecurityStatus != "pending" || retried.Document.ErrorCode != "" || retried.SecurityScanStarted || retried.PutStarted {
		t.Fatalf("unsafe scan retry transition: %+v", retried)
	}
	lease, claimed, err := store.ClaimKnowledgeDocumentWork(t.Context(), authority.RuntimeID, "retry-worker", time.Now().UTC(), time.Minute)
	if err != nil || !claimed || lease.DocumentID != retried.Document.ID {
		t.Fatalf("retry was not immediately queued: lease=%+v claimed=%t err=%v", lease, claimed, err)
	}

	uncertainPut := reserveSubjectDocument(t, store, storage, library, "uncertain-put", authority)
	uncertainPut.SecurityScanStarted = true
	uncertainPut.SecurityScanCompleted = true
	uncertainPut.PutStarted = true
	uncertainPut.Document.SecurityStatus = "clean"
	uncertainPut.Document.State = "needs_reconcile"
	uncertainPut.Document.ProcessingStage = "parse"
	uncertainPut.Document.ErrorCode = "document_put_uncertain"
	saveRetryFixture(t, db, uncertainPut, authority)

	retried, err = store.RequestKnowledgeDocumentRetry(t.Context(), uncertainPut.Document.ID, uncertainPut.Document.Revision, authority)
	if err != nil {
		t.Fatal(err)
	}
	if !retried.PutStarted || retried.PutAcknowledged || retried.Document.State != "needs_reconcile" || retried.Document.ErrorCode != "" {
		t.Fatalf("uncertain provider write was reset: %+v", retried)
	}
}

func TestKnowledgeDocumentRetryRejectsQuarantinedThreat(t *testing.T) {
	store, db := openSubjectKnowledgeStore(t)
	storage, err := documentstorage.NewFiles(filepath.Join(t.TempDir(), "documents"))
	if err != nil {
		t.Fatal(err)
	}
	authority := agentsdk.Authority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "alice", RoleKey: "member"}
	library, err := store.CreateKnowledgeLibrary(t.Context(), agentsdk.KnowledgeLibraryCreate{ClientID: "rejected-library", Kind: "personal", Name: "Rejected"}, authority)
	if err != nil {
		t.Fatal(err)
	}
	record := reserveSubjectDocument(t, store, storage, library, "malicious", authority)
	record.SecurityScanStarted = true
	record.SecurityScanCompleted = true
	record.Document.State = "failed"
	record.Document.ProcessingStage = "failed"
	record.Document.SecurityStatus = "rejected"
	record.Document.ErrorCode = "document_malware_detected"
	saveRetryFixture(t, db, record, authority)

	_, err = store.RequestKnowledgeDocumentRetry(t.Context(), record.Document.ID, record.Document.Revision, authority)
	var failure *agentsdk.Error
	if !errors.As(err, &failure) || failure.Code != "knowledge.document_security_rejected" {
		t.Fatalf("retry rejected threat err=%v", err)
	}
}

func TestStoreOriginalAfterProviderLimitChangeRejectsStartedIndexAndPageProjection(t *testing.T) {
	for _, name := range []string{"original", "started index", "page projection"} {
		t.Run(name, func(t *testing.T) {
			store, db := openSubjectKnowledgeStore(t)
			storage, err := documentstorage.NewFiles(filepath.Join(t.TempDir(), "documents"))
			if err != nil {
				t.Fatal(err)
			}
			actor := agentsdk.Authority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "alice", RoleKey: "member"}
			library, err := store.CreateKnowledgeLibrary(t.Context(), agentsdk.KnowledgeLibraryCreate{ClientID: "storage-limit", Kind: "personal", Name: "Storage limit"}, actor)
			if err != nil {
				t.Fatal(err)
			}
			record := reserveSubjectDocument(t, store, storage, library, "boundary", actor)
			record.SecurityScanStarted, record.SecurityScanCompleted = true, true
			record.Document.SecurityStatus = "clean"
			record.Document.State = "queued"
			if name == "started index" {
				record.PutStarted = true
			}
			if name == "page projection" {
				record.PageProjection = &persistence.KnowledgePageProjectionOrigin{PageID: "page-a", Version: 1}
			}
			saveRetryFixture(t, db, record, actor)
			lease, claimed, err := store.ClaimKnowledgeDocumentWork(t.Context(), actor.RuntimeID, "worker", time.Now(), time.Minute)
			if err != nil || !claimed {
				t.Fatalf("claim=%v err=%v", claimed, err)
			}
			err = store.ApplyKnowledgeDocumentProgress(t.Context(), lease, persistence.KnowledgeDocumentProgress{Event: "stored", IndexStatus: "STORED"})
			if name != "original" {
				if err == nil {
					t.Fatal("stored event discarded an existing or required projection")
				}
				return
			}
			if err != nil {
				t.Fatal(err)
			}
			stored, err := store.KnowledgeDocumentRecord(t.Context(), record.Document.ID, actor)
			if err != nil || stored.Document.State != "ready" || stored.Document.IndexStatus != "STORED" || stored.PutStarted || stored.RemoteID != record.RemoteID || stored.BodyRef != record.BodyRef {
				t.Fatalf("stored=%+v err=%v", stored, err)
			}
		})
	}
}

func TestKnowledgeDocumentPutRecoveryIsDurablyLimitedToOneAutomaticReplay(t *testing.T) {
	store, db := openSubjectKnowledgeStore(t)
	storage, err := documentstorage.NewFiles(filepath.Join(t.TempDir(), "documents"))
	if err != nil {
		t.Fatal(err)
	}
	authority := agentsdk.Authority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "alice", RoleKey: "member"}
	library, err := store.CreateKnowledgeLibrary(t.Context(), agentsdk.KnowledgeLibraryCreate{ClientID: "put-recovery-library", Kind: "personal", Name: "Put recovery"}, authority)
	if err != nil {
		t.Fatal(err)
	}
	record := reserveSubjectDocument(t, store, storage, library, "put-recovery", authority)
	record.SecurityScanStarted, record.SecurityScanCompleted = true, true
	record.PutStarted = true
	record.PutRequestID = knowledgeDocumentPutRequestID(record)
	record.Document.SecurityStatus = "clean"
	record.Document.State = "needs_reconcile"
	record.Document.ProcessingStage = "parse"
	record.Document.ErrorCode = "document_put_unconfirmed"
	saveRetryFixture(t, db, record, authority)
	lease, claimed, err := store.ClaimKnowledgeDocumentWork(t.Context(), authority.RuntimeID, "put-recovery-worker", time.Now().UTC(), time.Minute)
	if err != nil || !claimed {
		t.Fatalf("claim recovery: lease=%+v claimed=%t err=%v", lease, claimed, err)
	}
	started, ok, err := store.StartKnowledgeDocumentPutRecovery(t.Context(), lease)
	if err != nil || !ok || started.PutRecoveryAttempts != 1 || started.Document.State != "indexing" || started.Document.ErrorCode != "" || started.PutRequestID != record.PutRequestID {
		t.Fatalf("recovery marker not committed: record=%+v started=%t err=%v", started, ok, err)
	}
	again, ok, err := store.StartKnowledgeDocumentPutRecovery(t.Context(), lease)
	if err != nil || ok || again.PutRecoveryAttempts != 1 {
		t.Fatalf("automatic recovery replay was not fenced: record=%+v started=%t err=%v", again, ok, err)
	}
}

func TestUnconfirmedPutDeleteRecordsRecoveryIntentWithoutIndexObservation(t *testing.T) {
	store, db := openSubjectKnowledgeStore(t)
	storage, err := documentstorage.NewFiles(filepath.Join(t.TempDir(), "documents"))
	if err != nil {
		t.Fatal(err)
	}
	authority := agentsdk.Authority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "alice", RoleKey: "member"}
	library, err := store.CreateKnowledgeLibrary(t.Context(), agentsdk.KnowledgeLibraryCreate{ClientID: "uncertain-delete-library", Kind: "personal", Name: "Uncertain delete"}, authority)
	if err != nil {
		t.Fatal(err)
	}
	record := reserveSubjectDocument(t, store, storage, library, "uncertain-delete", authority)
	record.SecurityScanStarted, record.SecurityScanCompleted = true, true
	record.PutStarted = true
	record.Document.SecurityStatus = "clean"
	record.Document.State = "deleting"
	record.Document.ProcessingStage = "delete"
	record.Document.ErrorCode = "document_put_unconfirmed"
	saveRetryFixture(t, db, record, authority)
	lease, claimed, err := store.ClaimKnowledgeDocumentWork(t.Context(), authority.RuntimeID, "uncertain-delete-worker", time.Now().UTC(), time.Minute)
	if err != nil || !claimed {
		t.Fatalf("claim delete recovery: lease=%+v claimed=%t err=%v", lease, claimed, err)
	}
	if err = store.StartKnowledgeDocumentUnconfirmedDelete(t.Context(), lease); err != nil {
		t.Fatal(err)
	}
	started, err := store.KnowledgeDocumentRecord(t.Context(), record.Document.ID, authority)
	if err != nil || !started.DeleteStarted || started.IndexObserved || !started.PutStarted || started.Document.State != "deleting" {
		t.Fatalf("delete recovery intent=%+v err=%v", started, err)
	}
	if err = store.StartKnowledgeDocumentUnconfirmedDelete(t.Context(), lease); err == nil {
		t.Fatal("duplicate unconfirmed delete intent was accepted")
	}
	if err = store.ApplyKnowledgeDocumentProgress(t.Context(), lease, persistence.KnowledgeDocumentProgress{Event: "delete_acknowledged"}); err != nil {
		t.Fatal(err)
	}
	lease, claimed, err = store.ClaimKnowledgeDocumentWork(t.Context(), authority.RuntimeID, "uncertain-delete-finalizer", time.Now().UTC().Add(time.Second), time.Minute)
	if err != nil || !claimed {
		t.Fatalf("claim acknowledged cleanup: lease=%+v claimed=%t err=%v", lease, claimed, err)
	}
	if err = store.ApplyKnowledgeDocumentProgress(t.Context(), lease, persistence.KnowledgeDocumentProgress{Event: "deleted"}); err != nil {
		t.Fatal(err)
	}
	deleted, err := store.KnowledgeDocumentRecord(t.Context(), record.Document.ID, authority)
	if err != nil || deleted.Document.State != "deleted" || !deleted.DeleteAcknowledged || deleted.IndexObserved {
		t.Fatalf("acknowledged unobserved cleanup=%+v err=%v", deleted, err)
	}
}
