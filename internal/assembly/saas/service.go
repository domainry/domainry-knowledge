// Package saas assembles an independently deployed Knowledge service. It owns
// its database, migrations, repository and content storage; callers provide no
// Store and cannot participate in its SQL transactions.
package saas

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"path/filepath"
	"strings"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	agentmodulehost "github.com/domainry/domainry-agent-sdk/modulehost"
	sharedartifact "github.com/domainry/domainry-foundation/artifact"
	knowledgecontract "github.com/domainry/domainry-knowledge-sdk/contract"
	knowledgemodulehost "github.com/domainry/domainry-knowledge-sdk/modulehost"
	knowledgeapp "github.com/domainry/domainry-knowledge/internal/application/knowledge"
	knowledgemodule "github.com/domainry/domainry-knowledge/internal/assembly/module"
	artifactstorage "github.com/domainry/domainry-knowledge/internal/infrastructure/artifactstorage"
	documentstorage "github.com/domainry/domainry-knowledge/internal/infrastructure/documentstorage"
	store "github.com/domainry/domainry-knowledge/internal/infrastructure/persistence/database/knowledge"
	"github.com/domainry/domainry-knowledge/internal/infrastructure/persistence/migrationhost"
	saashttp "github.com/domainry/domainry-knowledge/internal/transport/http/saas"
	ormdialect "github.com/domainry/domainry-orm/dialect"
	ormsqlite "github.com/domainry/domainry-orm/sqlite"
	_ "modernc.org/sqlite"
)

type Options struct {
	RuntimeID          string
	ServiceAccessToken string
	DatabasePath       string
	StoragePath        string
	Knowledge          knowledgecontract.Options
}

type Service struct {
	server    *saashttp.Server
	knowledge knowledgecontract.Service
	database  *sql.DB
	artifacts *artifactstorage.Files
	shared    *artifactstorage.SharedFiles
	documents *documentstorage.Files
}

type grantSourceReader struct{ bridge saashttp.GrantBridge }

func (value grantSourceReader) Conversation(ctx context.Context, _ knowledgemodulehost.DB, id string, authority agentsdk.ConversationAuthority) (agentsdk.Conversation, error) {
	return value.bridge.Conversation(ctx, id, authority)
}
func (value grantSourceReader) Run(ctx context.Context, _ knowledgemodulehost.DB, conversationID, runID string, authority agentsdk.ConversationAuthority) (agentsdk.ConversationRun, error) {
	return value.bridge.Run(ctx, conversationID, runID, authority)
}

func Open(ctx context.Context, options Options) (_ *Service, resultErr error) {
	if strings.TrimSpace(options.RuntimeID) == "" || strings.TrimSpace(options.ServiceAccessToken) == "" || strings.TrimSpace(options.DatabasePath) == "" || strings.TrimSpace(options.StoragePath) == "" {
		return nil, fmt.Errorf("Knowledge SaaS configuration is incomplete")
	}
	databasePath, err := filepath.Abs(options.DatabasePath)
	if err != nil {
		return nil, err
	}
	storagePath, err := filepath.Abs(options.StoragePath)
	if err != nil {
		return nil, err
	}
	database, err := sql.Open("sqlite", databasePath)
	if err != nil {
		return nil, err
	}
	database.SetMaxOpenConns(8)
	service := &Service{database: database}
	defer func() {
		if resultErr != nil {
			_ = service.Close(context.Background())
		}
	}()
	if _, err = database.ExecContext(ctx, "PRAGMA foreign_keys = ON"); err != nil {
		return nil, err
	}
	if _, err = database.ExecContext(ctx, "PRAGMA journal_mode = WAL"); err != nil {
		return nil, err
	}
	if _, err = database.ExecContext(ctx, "PRAGMA busy_timeout = 5000"); err != nil {
		return nil, err
	}
	renderer, err := ormdialect.New(ormdialect.SQLite)
	if err != nil {
		return nil, err
	}
	dialect := renderer.WithSchema("")
	profile := ormsqlite.NewProfile()
	registrar := &migrationhost.Registrar{DB: database, Renderer: dialect}
	if err = registrar.Prepare(ctx); err != nil {
		return nil, err
	}
	backend := store.SQLBackend{DB: database, Dialect: dialect, Engine: profile}
	if err = store.EnsureSchema(ctx, backend, registrar); err != nil {
		return nil, err
	}
	service.shared, err = artifactstorage.NewSharedFiles(filepath.Join(storagePath, "shared-artifacts"))
	if err != nil {
		return nil, err
	}
	artifactStore, err := sharedartifact.Open(ctx, database, dialect, registrar)
	if err != nil {
		return nil, err
	}
	service.artifacts, err = artifactstorage.NewFiles(filepath.Join(storagePath, "artifact-bodies"))
	if err != nil {
		return nil, err
	}
	service.documents, err = documentstorage.NewFiles(filepath.Join(storagePath, "documents"))
	if err != nil {
		return nil, err
	}
	bridge := saashttp.GrantBridge{}
	repository := store.New(backend, grantSourceReader{bridge: bridge}, store.ArtifactPersistence{Store: artifactStore, Content: service.shared, Writer: service.shared})
	knowledgeOptions := options.Knowledge
	knowledgeOptions.AttachmentAuthorizer = bridge
	knowledgeOptions.LibraryAuthorizer = bridge
	knowledgeOptions.PersonalAuthorizer = bridge
	knowledgeOptions.Sources = bridge
	if knowledgeOptions.ArtifactStorage == nil {
		knowledgeOptions.ArtifactStorage = service.artifacts
	}
	if knowledgeOptions.DocumentStorage == nil {
		knowledgeOptions.DocumentStorage = service.documents
	}
	runtime := knowledgemodule.NewRuntime(repository)
	if err = runtime.Validate(&knowledgeOptions); err != nil {
		return nil, err
	}
	prepared, err := runtime.Prepare(options.RuntimeID, knowledgeOptions)
	if err != nil {
		return nil, err
	}
	if err = runtime.Activate(options.RuntimeID, knowledgeOptions); err != nil {
		return nil, err
	}
	service.knowledge = runtime.NewService(options.RuntimeID, knowledgeOptions)
	service.knowledge.Start(ctx)
	subjects := store.NewSubjectLifecycle(repository, options.RuntimeID, store.SubjectLifecycleOptions{ArtifactStorage: knowledgeOptions.ArtifactStorage, DocumentStorage: knowledgeOptions.DocumentStorage})
	server, err := saashttp.New(saashttp.Dependencies{Audience: options.RuntimeID, ServiceAccessToken: options.ServiceAccessToken, Runtime: runtime, Knowledge: service.knowledge, ConversationKnowledge: prepared, Artifacts: repository, Subjects: subjects, Repository: repository})
	if err != nil {
		return nil, err
	}
	service.server = server
	return service, nil
}

func (service *Service) Handler() http.Handler {
	if service == nil || service.server == nil {
		return http.NotFoundHandler()
	}
	return service.server.Handler()
}
func (service *Service) Close(context.Context) error {
	if service == nil {
		return nil
	}
	if service.knowledge != nil {
		service.knowledge.Close()
	}
	var values []error
	if service.documents != nil {
		values = append(values, service.documents.Close())
	}
	if service.artifacts != nil {
		values = append(values, service.artifacts.Close())
	}
	if service.shared != nil {
		values = append(values, service.shared.Close())
	}
	if service.database != nil {
		values = append(values, service.database.Close())
	}
	return errors.Join(values...)
}

var _ agentmodulehost.MigrationRegistrar = (*migrationhost.Registrar)(nil)
var _ knowledgeapp.ContextReader = (*store.Store)(nil)
