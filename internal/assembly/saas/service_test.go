package saas

import (
	"bytes"
	"context"
	"database/sql"
	"errors"
	"fmt"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"
	"time"

	"github.com/domainry/domainry-foundation/entityid"
	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgecontract "github.com/domainry/domainry-knowledge-sdk/contract"
	knowledgefiles "github.com/domainry/domainry-knowledge-sdk/files"
	knowledgeremote "github.com/domainry/domainry-knowledge-sdk/remote"
	_ "modernc.org/sqlite"
)

type allowLibraries struct{}

func sqliteDatabase(path string) DatabaseOptions {
	return DatabaseOptions{
		Driver: "sqlite", Path: path, SQLiteBusyTimeout: 5 * time.Second, SQLiteMaxOpen: 8,
		MaxOpenConnections: 16, MaxIdleConnections: 8,
		ConnectionLifetime: 30 * time.Minute, ConnectionIdleTime: 5 * time.Minute,
	}
}

func (allowLibraries) AuthorizeKnowledgeLibrary(context.Context, string, agentsdk.KnowledgeLibrary, agentsdk.Authority) error {
	return nil
}

func TestRemoteFilesUseKnowledgeOwnedMetadataAndContent(t *testing.T) {
	root := t.TempDir()
	options := Options{RuntimeID: "runtime-a", ServiceAccessToken: "secret-token", Database: sqliteDatabase(filepath.Join(root, "knowledge.db")), StoragePath: filepath.Join(root, "storage")}
	open := func() (*Service, *httptest.Server, knowledgefiles.Service) {
		service, err := Open(t.Context(), options)
		if err != nil {
			t.Fatal(err)
		}
		httpServer := httptest.NewServer(service.Handler())
		client, err := knowledgefiles.OpenRemote(t.Context(), knowledgefiles.RemoteConfig{Endpoint: httpServer.URL, ServiceAccessToken: "secret-token"}, "runtime-a")
		if err != nil {
			t.Fatal(err)
		}
		return service, httpServer, client
	}
	authority := knowledgefiles.Authority{RuntimeID: "runtime-a", WorkspaceID: "workspace-a", SubjectID: "user-a"}
	service, httpServer, client := open()
	raw := []byte("offline attachment")
	file, err := client.Upload(t.Context(), authority, knowledgefiles.Upload{ClientID: "upload-a", Filename: "note.txt", ContentType: "text/plain", Data: raw})
	if err != nil || file.ID == "" || file.ContentType != "text/plain" {
		t.Fatalf("file=%+v err=%v", file, err)
	}
	if err = entityid.Validate("art", file.ID); err != nil {
		t.Fatalf("file ID is not canonical: %v", err)
	}
	if err = client.Bind(t.Context(), authority, file.ID, knowledgefiles.Binding{Owner: "im", ResourceType: "message", ResourceID: "message-a", FieldKey: "attachment-a"}); err != nil {
		t.Fatal(err)
	}
	httpServer.Close()
	if err = service.Close(t.Context()); err != nil {
		t.Fatal(err)
	}
	service, httpServer, client = open()
	defer httpServer.Close()
	defer service.Close(t.Context())
	download, err := client.Download(t.Context(), authority, file.ID)
	if err != nil || download.File.ID != file.ID || !bytes.Equal(download.Data, raw) {
		t.Fatalf("download=%+v err=%v", download, err)
	}
	err = client.Delete(t.Context(), authority, file.ID)
	var fileErr *knowledgefiles.Error
	if !errors.As(err, &fileErr) || fileErr.Code != "knowledge.file_in_use" {
		t.Fatalf("delete err=%v", err)
	}
}

func TestPostgreSQLRemoteFilesSurviveServiceRestart(t *testing.T) {
	dsn := os.Getenv("KNOWLEDGE_TEST_POSTGRES_DSN")
	if dsn == "" {
		t.Skip("KNOWLEDGE_TEST_POSTGRES_DSN is not set")
	}
	schema := fmt.Sprintf("domainry_knowledge_service_test_%d", time.Now().UTC().UnixNano())
	databaseOptions := DatabaseOptions{
		Driver: "postgres", DSN: dsn, Schema: schema,
		MaxOpenConnections: 4, MaxIdleConnections: 2,
		ConnectionLifetime: time.Minute, ConnectionIdleTime: time.Minute,
	}
	cleanupDatabase, err := openDatabase(t.Context(), databaseOptions)
	if err != nil {
		t.Fatal(err)
	}
	defer cleanupDatabase.database.Close()
	defer func() {
		cleanupContext, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		_, _ = cleanupDatabase.database.ExecContext(cleanupContext, "DROP SCHEMA IF EXISTS "+cleanupDatabase.renderer.Identifier(schema)+" CASCADE")
	}()

	root := t.TempDir()
	options := Options{
		RuntimeID: "runtime-postgres", ServiceAccessToken: "secret-token", Database: databaseOptions,
		StoragePath: filepath.Join(root, "storage"),
	}
	authority := knowledgefiles.Authority{RuntimeID: "runtime-postgres", WorkspaceID: "workspace-a", SubjectID: "user-a"}
	open := func() (*Service, *httptest.Server, knowledgefiles.Service) {
		service, openErr := Open(t.Context(), options)
		if openErr != nil {
			t.Fatal(openErr)
		}
		httpServer := httptest.NewServer(service.Handler())
		client, openErr := knowledgefiles.OpenRemote(t.Context(), knowledgefiles.RemoteConfig{Endpoint: httpServer.URL, ServiceAccessToken: "secret-token"}, "runtime-postgres")
		if openErr != nil {
			t.Fatal(openErr)
		}
		return service, httpServer, client
	}

	service, httpServer, client := open()
	raw := []byte("postgres-backed attachment")
	file, err := client.Upload(t.Context(), authority, knowledgefiles.Upload{ClientID: "upload-postgres", Filename: "note.txt", ContentType: "text/plain", Data: raw})
	if err != nil {
		t.Fatal(err)
	}
	httpServer.Close()
	if err = service.Close(t.Context()); err != nil {
		t.Fatal(err)
	}

	service, httpServer, client = open()
	download, err := client.Download(t.Context(), authority, file.ID)
	httpServer.Close()
	closeErr := service.Close(t.Context())
	if err != nil || closeErr != nil || download.File.ID != file.ID || !bytes.Equal(download.Data, raw) {
		t.Fatalf("download=%+v err=%v close=%v", download, err, closeErr)
	}
}

func TestOpenCreatesDatabaseParentDirectory(t *testing.T) {
	root := t.TempDir()
	service, err := Open(t.Context(), Options{
		RuntimeID: "runtime-a", ServiceAccessToken: "secret-token",
		Database:    sqliteDatabase(filepath.Join(root, "nested", "database", "knowledge.db")),
		StoragePath: filepath.Join(root, "storage"),
	})
	if err != nil {
		t.Fatal(err)
	}
	if err = service.Close(t.Context()); err != nil {
		t.Fatal(err)
	}
}

func TestReadyTracksOwnedDatabase(t *testing.T) {
	root := t.TempDir()
	service, err := Open(t.Context(), Options{
		RuntimeID: "runtime-a", ServiceAccessToken: "secret-token",
		Database: sqliteDatabase(filepath.Join(root, "knowledge.db")), StoragePath: filepath.Join(root, "storage"),
	})
	if err != nil {
		t.Fatal(err)
	}
	if err = service.Ready(t.Context()); err != nil {
		t.Fatalf("ready before close: %v", err)
	}
	if err = service.Close(t.Context()); err != nil {
		t.Fatal(err)
	}
	if err = service.Ready(t.Context()); err == nil {
		t.Fatal("closed database reported ready")
	}
}
func (allowLibraries) ValidateKnowledgeLibraryMember(context.Context, string, agentsdk.Authority) error {
	return nil
}
func (allowLibraries) ValidateKnowledgeLibraryOrganizationMember(context.Context, string, agentsdk.Authority) error {
	return nil
}

func TestRemoteKnowledgeOwnsDatabaseAndSurvivesRestart(t *testing.T) {
	root := t.TempDir()
	databasePath := filepath.Join(root, "knowledge.db")
	storagePath := filepath.Join(root, "storage")
	authority := agentsdk.Authority{Known: true, RuntimeID: "runtime-a", WorkspaceID: "workspace-a", UserID: "user-a"}
	open := func() (*Service, *httptest.Server, knowledgecontract.Service) {
		service, err := Open(t.Context(), Options{RuntimeID: "runtime-a", ServiceAccessToken: "secret-token", Database: sqliteDatabase(databasePath), StoragePath: storagePath})
		if err != nil {
			t.Fatal(err)
		}
		httpServer := httptest.NewServer(service.Handler())
		binding, err := knowledgeremote.NewFactory(knowledgeremote.Config{Endpoint: httpServer.URL, ServiceAccessToken: "secret-token"}).OpenSaaS(t.Context(), knowledgecontract.ApplicationRef{RuntimeID: "runtime-a"})
		if err != nil {
			t.Fatal(err)
		}
		client := binding.Runtime().NewService("runtime-a", knowledgecontract.Options{LibraryAuthorizer: allowLibraries{}})
		return service, httpServer, client
	}
	service, httpServer, client := open()
	library, err := client.CreateKnowledgeLibrary(t.Context(), agentsdk.KnowledgeLibraryCreate{ClientID: "library-a", Kind: "personal", Name: "Independent"}, authority)
	if err != nil {
		t.Fatal(err)
	}
	httpServer.Close()
	if err = service.Close(t.Context()); err != nil {
		t.Fatal(err)
	}
	service, httpServer, client = open()
	defer httpServer.Close()
	defer service.Close(t.Context())
	saved, err := client.KnowledgeLibrary(t.Context(), library.ID, authority)
	if err != nil || saved.Name != "Independent" {
		t.Fatalf("saved=%+v err=%v", saved, err)
	}
	database, err := sql.Open("sqlite", databasePath)
	if err != nil {
		t.Fatal(err)
	}
	defer database.Close()
	var agentConversationTables int
	if err = database.QueryRow(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name='_agent_conversations'`).Scan(&agentConversationTables); err != nil || agentConversationTables != 0 {
		t.Fatalf("Agent conversation tables=%d err=%v", agentConversationTables, err)
	}
	var knowledgeTables int
	if err = database.QueryRow(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name='_knowledge_libraries'`).Scan(&knowledgeTables); err != nil || knowledgeTables == 0 {
		t.Fatalf("knowledge tables=%d err=%v", knowledgeTables, err)
	}
}
