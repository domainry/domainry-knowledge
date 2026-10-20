package store

import (
	"testing"
	"time"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
)

func reserveUploadingDocument(t *testing.T, store *Store, client string, authority agentsdk.Authority) persistence.KnowledgeDocumentRecord {
	t.Helper()
	library, err := store.CreateKnowledgeLibrary(t.Context(), agentsdk.KnowledgeLibraryCreate{ClientID: client + "-library", Kind: "personal", Name: "Uploads"}, authority)
	if err != nil {
		t.Fatal(err)
	}
	source := conversationHash([]string{"source", library.ID})
	if err = store.ActivateKnowledgeDocumentSource(t.Context(), agentsdk.KnowledgeDocumentStorageScope{RuntimeID: authority.RuntimeID, WorkspaceID: authority.WorkspaceID, LibraryID: library.ID}, source); err != nil {
		t.Fatal(err)
	}
	body := []byte("partial upload")
	record, err := store.ReserveKnowledgeDocument(t.Context(), persistence.KnowledgeDocumentReserve{LibraryID: library.ID, ClientID: client, Filename: "partial.txt", ContentType: "text/plain", SHA256: knowledgeTestDigest(body), Bytes: int64(len(body)), SourceID: source}, authority)
	if err != nil {
		t.Fatal(err)
	}
	return record
}

func setKnowledgeDocumentUpdatedAt(t *testing.T, store *Store, record persistence.KnowledgeDocumentRecord, at time.Time) persistence.KnowledgeDocumentRecord {
	t.Helper()
	record.Document.UpdatedAt = at.UTC().Truncate(time.Millisecond)
	if _, err := store.store.Database().ExecContext(t.Context(), `UPDATE _knowledge_documents SET updated_at=?, payload_json=? WHERE scope_key=? AND document_id=?`, record.Document.UpdatedAt.UnixMilli(), conversationJSON(record), libraryScope(record.Actor), record.Document.ID); err != nil {
		t.Fatal(err)
	}
	return record
}

func TestKnowledgeDocumentUploadActivityRenewsExpiryAndIdleUploadQueuesDeletion(t *testing.T) {
	store, _ := openSubjectKnowledgeStore(t)
	authority := agentsdk.Authority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "alice", RoleKey: "member"}
	record := reserveUploadingDocument(t, store, "idle-upload", authority)
	old := time.Now().UTC().Add(-2 * time.Hour).Truncate(time.Millisecond)
	record = setKnowledgeDocumentUpdatedAt(t, store, record, old)

	renewed, err := store.TouchKnowledgeDocumentUpload(t.Context(), record.Document.ID, authority)
	if err != nil {
		t.Fatal(err)
	}
	if renewed.Document.Revision != record.Document.Revision+1 || !renewed.Document.UpdatedAt.After(old) || renewed.Document.State != "uploading" {
		t.Fatalf("upload activity was not renewed: before=%+v after=%+v", record.Document, renewed.Document)
	}
	if expired, expireErr := store.ExpireKnowledgeDocumentUploads(t.Context(), authority.RuntimeID, time.Now().UTC().Add(-time.Hour), 10); expireErr != nil || expired != 0 {
		t.Fatalf("active upload expired: count=%d err=%v", expired, expireErr)
	}

	renewed = setKnowledgeDocumentUpdatedAt(t, store, renewed, old)
	expired, err := store.ExpireKnowledgeDocumentUploads(t.Context(), authority.RuntimeID, time.Now().UTC().Add(-time.Hour), 10)
	if err != nil || expired != 1 {
		t.Fatalf("idle upload expiry: count=%d err=%v", expired, err)
	}
	current, err := store.KnowledgeDocumentRecord(t.Context(), renewed.Document.ID, authority)
	if err != nil {
		t.Fatal(err)
	}
	if current.Document.State != "deleting" || current.Document.ProcessingStage != "delete" || current.Document.ErrorCode != "document_upload_expired" || current.BodyRef != "" || current.PutStarted {
		t.Fatalf("idle upload did not enter safe deletion: %+v", current)
	}
	lease, claimed, err := store.ClaimKnowledgeDocumentWork(t.Context(), authority.RuntimeID, "expiry-worker", time.Now().UTC(), time.Minute)
	if err != nil || !claimed || lease.DocumentID != current.Document.ID {
		t.Fatalf("expired upload was not queued: lease=%+v claimed=%t err=%v", lease, claimed, err)
	}
}
