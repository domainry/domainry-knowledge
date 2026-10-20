package store

import (
	"context"
	"database/sql"
	"errors"
	"path/filepath"
	"testing"
	"time"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
	"github.com/domainry/domainry-knowledge/internal/infrastructure/documentstorage"
)

func saveRetryFixture(t *testing.T, db interface {
	ExecContext(context.Context, string, ...any) (sql.Result, error)
}, record persistence.KnowledgeDocumentRecord, authority agentsdk.ConversationAuthority) {
	t.Helper()
	if _, err := db.ExecContext(t.Context(), `UPDATE _knowledge_documents SET state=?, revision=?, payload_json=? WHERE scope_key=? AND document_id=?`, record.Document.State, record.Document.Revision, conversationJSON(record), libraryScope(authority), record.Document.ID); err != nil {
		t.Fatal(err)
	}
}

func TestKnowledgeDocumentRetryResetsOnlySafeStage(t *testing.T) {
	store, db := openSubjectKnowledgeStore(t)
	storage, err := documentstorage.NewFiles(filepath.Join(t.TempDir(), "documents"))
	if err != nil {
		t.Fatal(err)
	}
	authority := agentsdk.ConversationAuthority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "alice", RoleKey: "member"}
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
	authority := agentsdk.ConversationAuthority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "alice", RoleKey: "member"}
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
	if !errors.As(err, &failure) || failure.Code != "agent.conversation.document_security_rejected" {
		t.Fatalf("retry rejected threat err=%v", err)
	}
}
