package saas

import (
	"bytes"
	"context"
	"database/sql"
	"errors"
	"net/http/httptest"
	"path/filepath"
	"testing"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	knowledgecontract "github.com/domainry/domainry-knowledge-sdk/contract"
	knowledgefiles "github.com/domainry/domainry-knowledge-sdk/files"
	knowledgeremote "github.com/domainry/domainry-knowledge-sdk/remote"
	_ "modernc.org/sqlite"
)

type allowLibraries struct{}

func (allowLibraries) AuthorizeKnowledgeLibrary(context.Context, string, agentsdk.KnowledgeLibrary, agentsdk.ConversationAuthority) error {
	return nil
}

func TestRemoteFilesUseKnowledgeOwnedMetadataAndContent(t *testing.T) {
	root := t.TempDir()
	options := Options{RuntimeID: "runtime-a", ServiceAccessToken: "secret-token", DatabasePath: filepath.Join(root, "knowledge.db"), StoragePath: filepath.Join(root, "storage")}
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
func (allowLibraries) ValidateKnowledgeLibraryMember(context.Context, string, agentsdk.ConversationAuthority) error {
	return nil
}

func TestRemoteKnowledgeOwnsDatabaseAndSurvivesRestart(t *testing.T) {
	root := t.TempDir()
	databasePath := filepath.Join(root, "knowledge.db")
	storagePath := filepath.Join(root, "storage")
	authority := agentsdk.ConversationAuthority{Known: true, RuntimeID: "runtime-a", WorkspaceID: "workspace-a", UserID: "user-a"}
	open := func() (*Service, *httptest.Server, knowledgecontract.Service) {
		service, err := Open(t.Context(), Options{RuntimeID: "runtime-a", ServiceAccessToken: "secret-token", DatabasePath: databasePath, StoragePath: storagePath})
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
	if err = database.QueryRow(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name='_agent_knowledge_libraries'`).Scan(&knowledgeTables); err != nil || knowledgeTables == 0 {
		t.Fatalf("knowledge tables=%d err=%v", knowledgeTables, err)
	}
}
