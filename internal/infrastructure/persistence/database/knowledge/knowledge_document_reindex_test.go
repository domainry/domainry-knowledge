package store

import (
	"errors"
	"path/filepath"
	"testing"
	"time"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
	"github.com/domainry/domainry-knowledge/internal/infrastructure/documentstorage"
)

func claimReindexWork(t *testing.T, store *Store, runtime, owner string) persistence.KnowledgeDocumentLease {
	t.Helper()
	lease, claimed, err := store.ClaimKnowledgeDocumentWork(t.Context(), runtime, owner, time.Now().UTC(), time.Minute)
	if err != nil || !claimed {
		t.Fatalf("claim reindex work: lease=%+v claimed=%t err=%v", lease, claimed, err)
	}
	return lease
}

func TestKnowledgeDocumentReindexCutsOverOnlyAfterShadowIndexIsReady(t *testing.T) {
	store, db := openSubjectKnowledgeStore(t)
	storage, err := documentstorage.NewFiles(filepath.Join(t.TempDir(), "documents"))
	if err != nil {
		t.Fatal(err)
	}
	authority := agentsdk.Authority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "alice", RoleKey: "member"}
	library, err := store.CreateKnowledgeLibrary(t.Context(), agentsdk.KnowledgeLibraryCreate{ClientID: "reindex-library", Kind: "personal", Name: "Reindex"}, authority)
	if err != nil {
		t.Fatal(err)
	}
	record := reserveSubjectDocument(t, store, storage, library, "reindex-document", authority)
	record.SecurityScanStarted = true
	record.SecurityScanCompleted = true
	record.PutStarted = true
	record.PutAcknowledged = true
	record.IndexObserved = true
	record.Document.State = "ready"
	record.Document.ProcessingStage = "complete"
	record.Document.SecurityStatus = "clean"
	record.Document.IndexStatus = "INDEXED"
	saveRetryFixture(t, db, record, authority)
	oldRemoteID := record.RemoteID

	requested, err := store.RequestKnowledgeDocumentReindex(t.Context(), record.Document.ID, record.Document.Revision, authority)
	if err != nil {
		t.Fatal(err)
	}
	if requested.RemoteID != oldRemoteID || requested.Reindex == nil || requested.Reindex.RemoteID == oldRemoteID || requested.Reindex.Generation != 2 || requested.Document.IndexGeneration != 1 || !requested.Document.Reindexing || requested.Document.State != "ready" {
		t.Fatalf("reindex request changed active generation early: %+v", requested)
	}
	shadowRemoteID := requested.Reindex.RemoteID
	if _, err = store.KnowledgeDocumentByRemoteID(t.Context(), library.ID, requested.SourceID, shadowRemoteID, authority); err == nil {
		t.Fatal("shadow remote became readable before cutover")
	}
	if active, lookupErr := store.KnowledgeDocumentByRemoteID(t.Context(), library.ID, requested.SourceID, oldRemoteID, authority); lookupErr != nil || active.Document.ID != record.Document.ID {
		t.Fatalf("active remote disappeared during shadow build: active=%+v err=%v", active, lookupErr)
	}

	lease := claimReindexWork(t, store, authority.RuntimeID, "reindex-worker")
	started, ok, err := store.StartKnowledgeDocumentReindexPut(t.Context(), lease)
	if err != nil || !ok || started.Reindex == nil || !started.Reindex.PutStarted {
		t.Fatalf("start shadow put: record=%+v started=%t err=%v", started, ok, err)
	}
	if err = store.ApplyKnowledgeDocumentProgress(t.Context(), lease, persistence.KnowledgeDocumentProgress{Event: "reindex_put_acknowledged"}); err != nil {
		t.Fatal(err)
	}

	lease = claimReindexWork(t, store, authority.RuntimeID, "reindex-worker")
	if err = store.ApplyKnowledgeDocumentProgress(t.Context(), lease, persistence.KnowledgeDocumentProgress{Event: "reindex_indexed", IndexStatus: "INDEXED"}); err != nil {
		t.Fatal(err)
	}
	cutover, err := store.KnowledgeDocumentRecord(t.Context(), record.Document.ID, authority)
	if err != nil {
		t.Fatal(err)
	}
	if cutover.RemoteID != shadowRemoteID || cutover.RetiredRemoteID != oldRemoteID || cutover.Reindex != nil || cutover.Document.IndexGeneration != 2 || cutover.Document.Reindexing || cutover.Document.State != "ready" {
		t.Fatalf("invalid atomic cutover: %+v", cutover)
	}
	if _, err = store.KnowledgeDocumentByRemoteID(t.Context(), library.ID, cutover.SourceID, oldRemoteID, authority); err == nil {
		t.Fatal("retired remote remained readable after cutover")
	}
	if active, lookupErr := store.KnowledgeDocumentByRemoteID(t.Context(), library.ID, cutover.SourceID, shadowRemoteID, authority); lookupErr != nil || active.Document.IndexGeneration != 2 {
		t.Fatalf("new generation not readable after cutover: active=%+v err=%v", active, lookupErr)
	}

	lease = claimReindexWork(t, store, authority.RuntimeID, "reindex-worker")
	cleaning, ok, err := store.StartKnowledgeDocumentRetiredDelete(t.Context(), lease)
	if err != nil || !ok || !cleaning.RetiredDeleteStarted {
		t.Fatalf("start retired cleanup: record=%+v started=%t err=%v", cleaning, ok, err)
	}
	if err = store.ApplyKnowledgeDocumentProgress(t.Context(), lease, persistence.KnowledgeDocumentProgress{Event: "retired_delete_acknowledged"}); err != nil {
		t.Fatal(err)
	}
	lease = claimReindexWork(t, store, authority.RuntimeID, "reindex-worker")
	if err = store.ApplyKnowledgeDocumentProgress(t.Context(), lease, persistence.KnowledgeDocumentProgress{Event: "retired_deleted"}); err != nil {
		t.Fatal(err)
	}
	complete, err := store.KnowledgeDocumentRecord(t.Context(), record.Document.ID, authority)
	if err != nil || complete.RetiredRemoteID != "" || complete.RetiredDeleteStarted || complete.RetiredDeleteAcknowledged || complete.Document.IndexGeneration != 2 {
		t.Fatalf("retired generation cleanup incomplete: record=%+v err=%v", complete, err)
	}
	_, claimed, err := store.ClaimKnowledgeDocumentWork(t.Context(), authority.RuntimeID, "reindex-worker", time.Now().UTC(), time.Minute)
	if err != nil || claimed {
		t.Fatalf("completed reindex job remained queued: claimed=%t err=%v", claimed, err)
	}
}

func TestKnowledgeDocumentReindexRejectsConcurrentDelete(t *testing.T) {
	store, db := openSubjectKnowledgeStore(t)
	storage, err := documentstorage.NewFiles(filepath.Join(t.TempDir(), "documents"))
	if err != nil {
		t.Fatal(err)
	}
	authority := agentsdk.Authority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "alice", RoleKey: "member"}
	library, err := store.CreateKnowledgeLibrary(t.Context(), agentsdk.KnowledgeLibraryCreate{ClientID: "reindex-delete-library", Kind: "personal", Name: "Reindex delete"}, authority)
	if err != nil {
		t.Fatal(err)
	}
	record := reserveSubjectDocument(t, store, storage, library, "reindex-delete", authority)
	record.SecurityScanStarted, record.SecurityScanCompleted = true, true
	record.PutStarted, record.PutAcknowledged, record.IndexObserved = true, true, true
	record.Document.State, record.Document.ProcessingStage = "ready", "complete"
	record.Document.SecurityStatus, record.Document.IndexStatus = "clean", "INDEXED"
	saveRetryFixture(t, db, record, authority)

	requested, err := store.RequestKnowledgeDocumentReindex(t.Context(), record.Document.ID, record.Document.Revision, authority)
	if err != nil {
		t.Fatal(err)
	}
	_, err = store.RequestKnowledgeDocumentDeletion(t.Context(), record.Document.ID, requested.Document.Revision, authority)
	var failure *agentsdk.Error
	if !errors.As(err, &failure) || failure.Code != "knowledge.document_reindex_in_progress" {
		t.Fatalf("delete during reindex err=%v", err)
	}
}
