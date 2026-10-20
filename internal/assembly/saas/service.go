// Package saas assembles an independently deployed Knowledge service. It owns
// its database, migrations, repository and content storage; callers provide no
// Store and cannot participate in its SQL transactions.
package saas

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"io"
	"net/http"
	"path/filepath"
	"strings"

	sharedartifact "github.com/domainry/domainry-foundation/artifact"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgecontract "github.com/domainry/domainry-knowledge-sdk/contract"
	knowledgefiles "github.com/domainry/domainry-knowledge-sdk/files"
	knowledgemodulehost "github.com/domainry/domainry-knowledge-sdk/modulehost"
	knowledgemodule "github.com/domainry/domainry-knowledge/internal/assembly/module"
	artifactstorage "github.com/domainry/domainry-knowledge/internal/infrastructure/artifactstorage"
	documentstorage "github.com/domainry/domainry-knowledge/internal/infrastructure/documentstorage"
	filestore "github.com/domainry/domainry-knowledge/internal/infrastructure/filestore"
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
	FileStorage        FileStorageOptions
	Knowledge          knowledgecontract.Options
}

type FileStorageOptions struct {
	Driver         string
	Region         string
	Bucket         string
	Prefix         string
	Endpoint       string
	ForcePathStyle bool
}

type Service struct {
	server          *saashttp.Server
	knowledge       knowledgecontract.Service
	database        *sql.DB
	shared          artifactstorage.SharedStorage
	documents       knowledgesdk.KnowledgeDocumentStorage
	documentsCloser io.Closer
	files           knowledgefiles.Service
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
	service.shared, err = artifactstorage.OpenShared(ctx, filepath.Join(storagePath, "shared-artifacts"), artifactstorage.SharedStorageConfig{
		Driver: options.FileStorage.Driver, Region: options.FileStorage.Region, Bucket: options.FileStorage.Bucket,
		Prefix: options.FileStorage.Prefix, Endpoint: options.FileStorage.Endpoint, ForcePathStyle: options.FileStorage.ForcePathStyle,
	})
	if err != nil {
		return nil, err
	}
	artifactStore, err := sharedartifact.Open(ctx, database, dialect, registrar)
	if err != nil {
		return nil, err
	}
	if documents, ok := service.shared.(knowledgesdk.KnowledgeDocumentStorage); ok {
		service.documents = documents
	} else {
		localDocuments, openErr := documentstorage.NewFiles(filepath.Join(storagePath, "documents"))
		if openErr != nil {
			return nil, openErr
		}
		service.documents = localDocuments
		service.documentsCloser = localDocuments
	}
	bridge := saashttp.GrantBridge{}
	repository := store.New(backend)
	service.files, err = filestore.New(options.RuntimeID, artifactStore, service.shared, service.shared)
	if err != nil {
		return nil, err
	}
	knowledgeOptions := options.Knowledge
	knowledgeOptions.LibraryAuthorizer = bridge
	knowledgeOptions.SourceAuthorizer = bridge
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
	server, err := saashttp.New(saashttp.Dependencies{Audience: options.RuntimeID, ServiceAccessToken: options.ServiceAccessToken, Runtime: runtime, Knowledge: service.knowledge, Retrieval: prepared, Files: service.files, Repository: repository})
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
	if service.documentsCloser != nil {
		values = append(values, service.documentsCloser.Close())
	}
	if service.shared != nil {
		values = append(values, service.shared.Close())
	}
	if service.database != nil {
		values = append(values, service.database.Close())
	}
	return errors.Join(values...)
}

var _ knowledgemodulehost.MigrationRegistrar = (*migrationhost.Registrar)(nil)
