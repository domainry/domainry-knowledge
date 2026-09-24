package saas

import (
	"context"
	"database/sql"
	"net/http/httptest"
	"path/filepath"
	"testing"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	knowledgecontract "github.com/domainry/domainry-knowledge-sdk/contract"
	knowledgeremote "github.com/domainry/domainry-knowledge-sdk/remote"
	_ "modernc.org/sqlite"
)

type allowLibraries struct{}

func (allowLibraries) AuthorizeKnowledgeLibrary(context.Context, string, agentsdk.KnowledgeLibrary, agentsdk.ConversationAuthority) error {
	return nil
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
