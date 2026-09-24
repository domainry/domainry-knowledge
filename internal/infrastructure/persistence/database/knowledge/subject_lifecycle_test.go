package store

import (
	"bytes"
	"database/sql"
	"path/filepath"
	"strings"
	"testing"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/artifact"
	"github.com/domainry/domainry-agent-sdk/modulehost"
	"github.com/domainry/domainry-agent-sdk/persistence"
	sharedoperation "github.com/domainry/domainry-foundation/operation"
	sharedsubjectlifecycle "github.com/domainry/domainry-foundation/subjectlifecycle"
	"github.com/domainry/domainry-knowledge/internal/infrastructure/documentstorage"
	lifecyclemodel "github.com/domainry/domainry-lifecycle-sdk/model"
	ormdialect "github.com/domainry/domainry-orm/dialect"
	ormsqlite "github.com/domainry/domainry-orm/sqlite"
	_ "modernc.org/sqlite"
)

func openSubjectKnowledgeStore(t *testing.T) (*Store, *sql.DB) {
	t.Helper()
	db, err := sql.Open("sqlite", filepath.Join(t.TempDir(), "knowledge-subject.db"))
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = db.Close() })
	db.SetMaxOpenConns(1)
	dialect, _ := ormdialect.New(ormdialect.SQLite)
	operations, err := sharedoperation.SchemaMigrationsForDialect(sharedoperation.AdaptDialect(dialect.WithSchema("")))
	if err != nil {
		t.Fatal(err)
	}
	for _, migration := range operations {
		for _, statement := range migration.Statements {
			if _, err = db.ExecContext(t.Context(), statement); err != nil {
				t.Fatal(err)
			}
		}
	}
	for _, migration := range mustKnowledgeMigrations(t, dialect.WithSchema("")) {
		for _, statement := range migration.Statements {
			if _, err = db.ExecContext(t.Context(), statement); err != nil {
				t.Fatal(err)
			}
		}
	}
	shared, err := sharedsubjectlifecycle.SchemaMigrationsForDialect(dialect.WithSchema(""))
	if err != nil {
		t.Fatal(err)
	}
	for _, migration := range shared {
		for _, statement := range migration.Statements {
			if _, err = db.ExecContext(t.Context(), statement); err != nil {
				t.Fatal(err)
			}
		}
	}
	return New(SQLBackend{DB: db, Dialect: dialect.WithSchema(""), Engine: ormsqlite.NewProfile()}, nil, ArtifactPersistence{}), db
}

func mustKnowledgeMigrations(t *testing.T, dialect modulehost.Dialect) []modulehost.SchemaMigration {
	t.Helper()
	migrations, err := SchemaMigrations(dialect)
	if err != nil {
		t.Fatal(err)
	}
	return migrations
}

func reserveSubjectDocument(t *testing.T, store *Store, storage agentsdk.KnowledgeDocumentStorage, library agentsdk.KnowledgeLibrary, client string, a agentsdk.ConversationAuthority) persistence.KnowledgeDocumentRecord {
	t.Helper()
	source := conversationHash([]string{"source", library.ID})
	if err := store.ActivateKnowledgeDocumentSource(t.Context(), agentsdk.KnowledgeDocumentStorageScope{RuntimeID: a.RuntimeID, WorkspaceID: a.WorkspaceID, LibraryID: library.ID}, source); err != nil {
		t.Fatal(err)
	}
	body := []byte("private content for " + client)
	record, err := store.ReserveKnowledgeDocument(t.Context(), persistence.KnowledgeDocumentReserve{LibraryID: library.ID, ClientID: client, Filename: client + ".txt", ContentType: "text/plain", SHA256: artifact.Hash(body), Bytes: int64(len(body)), SourceID: source}, a)
	if err != nil {
		t.Fatal(err)
	}
	scope := agentsdk.KnowledgeDocumentStorageScope{RuntimeID: a.RuntimeID, WorkspaceID: a.WorkspaceID, LibraryID: library.ID}
	ref, err := storage.PutKnowledgeDocumentContent(t.Context(), scope, record.Document.ID, record.Document.SHA256, body)
	if err != nil {
		t.Fatal(err)
	}
	record, err = store.CommitKnowledgeDocumentContent(t.Context(), record.Document.ID, record.Document.Revision, ref, a)
	if err != nil {
		t.Fatal(err)
	}
	return record
}

func TestSubjectLifecycleRemovesPersonalCopiesAndAnonymizesSharedReferences(t *testing.T) {
	store, db := openSubjectKnowledgeStore(t)
	documents, err := documentstorage.NewFiles(filepath.Join(t.TempDir(), "documents"))
	if err != nil {
		t.Fatal(err)
	}
	a := agentsdk.ConversationAuthority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "alice", RoleKey: "member"}
	b := a
	b.UserID = "bob"
	aliceLibrary, err := store.CreateKnowledgeLibrary(t.Context(), agentsdk.KnowledgeLibraryCreate{ClientID: "alice", Kind: "personal", Name: "Alice private"}, a)
	if err != nil {
		t.Fatal(err)
	}
	bobLibrary, err := store.CreateKnowledgeLibrary(t.Context(), agentsdk.KnowledgeLibraryCreate{ClientID: "bob", Kind: "personal", Name: "Bob private"}, b)
	if err != nil {
		t.Fatal(err)
	}
	shared, err := store.CreateKnowledgeLibrary(t.Context(), agentsdk.KnowledgeLibraryCreate{ClientID: "shared", Kind: "shared", Name: "Shared"}, a)
	if err != nil {
		t.Fatal(err)
	}
	shared, err = store.SetKnowledgeLibraryMember(t.Context(), shared.ID, b.UserID, agentsdk.KnowledgeLibraryMemberWrite{Role: "manager", ExpectedRevision: shared.Revision}, a)
	if err != nil {
		t.Fatal(err)
	}
	aliceDocument := reserveSubjectDocument(t, store, documents, aliceLibrary, "alice-doc", a)
	bobDocument := reserveSubjectDocument(t, store, documents, bobLibrary, "bob-doc", b)
	sharedDocument := reserveSubjectDocument(t, store, documents, shared, "shared-doc", a)
	sharedDocument.AttachmentOrigin = &persistence.KnowledgeAttachmentOrigin{ConversationID: "conv_source", AttachmentID: "att_source", Revision: 1}
	sharedDocument.DocumentOrigin = &persistence.KnowledgeDocumentOrigin{LibraryID: aliceLibrary.ID, DocumentID: aliceDocument.Document.ID, Revision: 1, Mode: "copy"}
	if _, err = store.store.Database().ExecContext(t.Context(), `UPDATE _agent_knowledge_documents SET payload_json=? WHERE scope_key=? AND document_id=?`, conversationJSON(sharedDocument), CompatLibraryScope(a), sharedDocument.Document.ID); err != nil {
		t.Fatal(err)
	}
	lifecycle := NewSubjectLifecycle(store, a.RuntimeID, SubjectLifecycleOptions{DocumentStorage: documents})
	preview, err := lifecycle.PreviewSubject(t.Context(), a.WorkspaceID, a.UserID)
	if err != nil || !bytes.Contains(preview, []byte(`"personal_libraries":1`)) || !bytes.Contains(preview, []byte(`"personal_documents":1`)) {
		t.Fatalf("preview=%s err=%v", preview, err)
	}
	exported, err := lifecycle.ExportSubjectForRequest(t.Context(), "export", a.WorkspaceID, a.UserID)
	if err != nil || !bytes.Contains(exported, []byte("alice-doc.txt")) || bytes.Contains(exported, []byte("bob-doc.txt")) || bytes.Contains(exported, []byte("shared-doc.txt")) {
		t.Fatalf("export=%s err=%v", exported, err)
	}
	if _, err = lifecycle.EraseSubjectForRequest(t.Context(), "held", a.WorkspaceID, a.UserID, []lifecyclemodel.LegalHold{{ID: "hold"}}); err == nil {
		t.Fatal("legal hold did not block Knowledge erasure")
	}
	receipt, err := lifecycle.EraseSubjectForRequest(t.Context(), "erase-alice", a.WorkspaceID, a.UserID, nil)
	if err != nil {
		t.Fatal(err)
	}
	replayed, err := lifecycle.EraseSubjectForRequest(t.Context(), "erase-alice", a.WorkspaceID, a.UserID, nil)
	if err != nil || !bytes.Equal(receipt, replayed) {
		t.Fatalf("receipt replay=%s err=%v", replayed, err)
	}
	var steps int
	if err = db.QueryRowContext(t.Context(), `SELECT COUNT(*) FROM _subject_steps WHERE workspace_id=? AND request_id=? AND owner='knowledge' AND operation='erase'`, a.WorkspaceID, "erase-alice").Scan(&steps); err != nil || steps != 1 {
		t.Fatalf("shared Knowledge subject steps=%d err=%v", steps, err)
	}
	if _, err = store.KnowledgeLibrary(t.Context(), aliceLibrary.ID, a); err == nil {
		t.Fatal("personal library survived")
	}
	if _, err = store.KnowledgeDocumentRecord(t.Context(), aliceDocument.Document.ID, a); err == nil {
		t.Fatal("personal document row survived")
	}
	aliceScope := agentsdk.KnowledgeDocumentStorageScope{RuntimeID: a.RuntimeID, WorkspaceID: a.WorkspaceID, LibraryID: aliceLibrary.ID}
	if _, err = documents.ReadKnowledgeDocumentContent(t.Context(), aliceScope, aliceDocument.Document.ID, aliceDocument.BodyRef); err == nil {
		t.Fatal("personal document content survived")
	}
	if _, err = store.KnowledgeDocumentRecord(t.Context(), bobDocument.Document.ID, b); err != nil {
		t.Fatal("other user's private copy was removed", err)
	}
	sharedAfter, err := store.KnowledgeDocumentRecord(t.Context(), sharedDocument.Document.ID, b)
	if err != nil || sharedAfter.Document.CreatedByUserID == a.UserID || !strings.HasPrefix(sharedAfter.Document.CreatedByUserID, "erased-") || sharedAfter.Actor.UserID == a.UserID || sharedAfter.Actor.RoleKey != "" || sharedAfter.AttachmentOrigin != nil || sharedAfter.DocumentOrigin != nil {
		t.Fatalf("shared reference=%+v err=%v", sharedAfter, err)
	}
	sharedScope := agentsdk.KnowledgeDocumentStorageScope{RuntimeID: a.RuntimeID, WorkspaceID: a.WorkspaceID, LibraryID: shared.ID}
	if _, err = documents.ReadKnowledgeDocumentContent(t.Context(), sharedScope, sharedDocument.Document.ID, sharedDocument.BodyRef); err != nil {
		t.Fatal("shared saved copy was removed", err)
	}
}

func TestSubjectLifecycleKeepsRemoteDeletionEvidenceUntilAcknowledged(t *testing.T) {
	store, db := openSubjectKnowledgeStore(t)
	a := agentsdk.ConversationAuthority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "remote-user"}
	library, err := store.CreateKnowledgeLibrary(t.Context(), agentsdk.KnowledgeLibraryCreate{ClientID: "remote", Kind: "personal", Name: "Remote"}, a)
	if err != nil {
		t.Fatal(err)
	}
	source := conversationHash([]string{"source", library.ID})
	if err = store.ActivateKnowledgeDocumentSource(t.Context(), agentsdk.KnowledgeDocumentStorageScope{RuntimeID: a.RuntimeID, WorkspaceID: a.WorkspaceID, LibraryID: library.ID}, source); err != nil {
		t.Fatal(err)
	}
	record, err := store.ReserveKnowledgeDocument(t.Context(), persistence.KnowledgeDocumentReserve{LibraryID: library.ID, ClientID: "remote", Filename: "remote.txt", ContentType: "text/plain", SHA256: strings.Repeat("a", 64), Bytes: 1, SourceID: source}, a)
	if err != nil {
		t.Fatal(err)
	}
	record.Document.State, record.PutStarted, record.IndexObserved = "ready", true, true
	if _, err = db.ExecContext(t.Context(), `UPDATE _agent_knowledge_documents SET state='ready', payload_json=? WHERE scope_key=? AND document_id=?`, conversationJSON(record), CompatLibraryScope(a), record.Document.ID); err != nil {
		t.Fatal(err)
	}
	lifecycle := NewSubjectLifecycle(store, a.RuntimeID, SubjectLifecycleOptions{})
	if _, err = lifecycle.EraseSubjectForRequest(t.Context(), "erase-remote", a.WorkspaceID, a.UserID, nil); err == nil || !strings.Contains(err.Error(), "cleanup is pending") {
		t.Fatal("remote copy was reported erased", err)
	}
	after, err := store.KnowledgeDocumentRecord(t.Context(), record.Document.ID, a)
	if err != nil || after.Document.State != "deleting" || !after.PutStarted || !after.IndexObserved {
		t.Fatalf("remote deletion evidence=%+v err=%v", after, err)
	}
	var jobs, receipts int
	if err = db.QueryRowContext(t.Context(), `SELECT count(*) FROM _agent_knowledge_document_jobs WHERE scope_key=? AND document_id=?`, CompatLibraryScope(a), record.Document.ID).Scan(&jobs); err != nil || jobs != 1 {
		t.Fatalf("jobs=%d err=%v", jobs, err)
	}
	if err = db.QueryRowContext(t.Context(), `SELECT count(*) FROM _subject_steps WHERE owner='knowledge'`).Scan(&receipts); err != nil || receipts != 0 {
		t.Fatalf("receipts=%d err=%v", receipts, err)
	}
}
