package store

import (
	"bytes"
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"path/filepath"
	"testing"

	sharedoperation "github.com/domainry/domainry-foundation/operation"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/modulehost"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
	ormdialect "github.com/domainry/domainry-orm/dialect"
	ormsqlite "github.com/domainry/domainry-orm/sqlite"
	_ "modernc.org/sqlite"
)

func openSubjectKnowledgeStore(t *testing.T) (*Store, *sql.DB) {
	t.Helper()
	database, err := sql.Open("sqlite", filepath.Join(t.TempDir(), "knowledge.db"))
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = database.Close() })
	database.SetMaxOpenConns(1)
	dialect, err := ormdialect.New(ormdialect.SQLite)
	if err != nil {
		t.Fatal(err)
	}
	renderer := dialect.WithSchema("")
	operations, err := sharedoperation.SchemaMigrationsForDialect(sharedoperation.AdaptDialect(renderer))
	if err != nil {
		t.Fatal(err)
	}
	for _, migration := range append(operations, mustKnowledgeMigrations(t, renderer)...) {
		for _, statement := range migration.Statements {
			if _, err = database.ExecContext(t.Context(), statement); err != nil {
				t.Fatal(err)
			}
		}
	}
	return New(SQLBackend{DB: database, Dialect: renderer, Engine: ormsqlite.NewProfile()}), database
}

func mustKnowledgeMigrations(t *testing.T, dialect modulehost.Dialect) []modulehost.SchemaMigration {
	t.Helper()
	migrations, err := SchemaMigrations(dialect)
	if err != nil {
		t.Fatal(err)
	}
	return migrations
}

func knowledgeTestDigest(body []byte) string {
	digest := sha256.Sum256(body)
	return hex.EncodeToString(digest[:])
}

func reserveSubjectDocument(t *testing.T, store *Store, storage knowledgesdk.KnowledgeDocumentStorage, library knowledgesdk.KnowledgeLibrary, client string, authority knowledgesdk.Authority) persistence.KnowledgeDocumentRecord {
	t.Helper()
	source := conversationHash([]string{"source", library.ID})
	if err := store.ActivateKnowledgeDocumentSource(t.Context(), knowledgesdk.KnowledgeDocumentStorageScope{RuntimeID: authority.RuntimeID, WorkspaceID: authority.WorkspaceID, LibraryID: library.ID}, source); err != nil {
		t.Fatal(err)
	}
	body := []byte("private content for " + client)
	record, err := store.ReserveKnowledgeDocument(t.Context(), persistence.KnowledgeDocumentReserve{LibraryID: library.ID, ClientID: client, Filename: client + ".txt", ContentType: "text/plain", SHA256: knowledgeTestDigest(body), Bytes: int64(len(body)), SourceID: source}, authority)
	if err != nil {
		t.Fatal(err)
	}
	scope := knowledgesdk.KnowledgeDocumentStorageScope{RuntimeID: authority.RuntimeID, WorkspaceID: authority.WorkspaceID, LibraryID: library.ID}
	reference, err := storage.PutKnowledgeDocumentContent(t.Context(), scope, record.Document.ID, record.Document.SHA256, int64(len(body)), bytes.NewReader(body))
	if err != nil {
		t.Fatalf("put document %s in library %s: %v", record.Document.ID, library.ID, err)
	}
	record, err = store.CommitKnowledgeDocumentContent(t.Context(), record.Document.ID, record.Document.Revision, reference, authority)
	if err != nil {
		t.Fatal(err)
	}
	return record
}
