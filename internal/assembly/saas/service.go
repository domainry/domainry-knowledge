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
)

type Options struct {
	RuntimeID          string
	ServiceAccessToken string
	Database           DatabaseOptions
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
	if strings.TrimSpace(options.RuntimeID) == "" || strings.TrimSpace(options.ServiceAccessToken) == "" || strings.TrimSpace(options.StoragePath) == "" {
		return nil, fmt.Errorf("Knowledge SaaS configuration is incomplete")
	}
	storagePath, err := filepath.Abs(options.StoragePath)
	if err != nil {
		return nil, err
	}
	databaseResources, err := openDatabase(ctx, options.Database)
	if err != nil {
		return nil, err
	}
	service := &Service{database: databaseResources.database}
	defer func() {
		if resultErr != nil {
			_ = service.Close(context.Background())
		}
	}()
	registrar := &migrationhost.Registrar{DB: databaseResources.database, Renderer: databaseResources.renderer, DriverName: databaseResources.driver, SchemaName: databaseResources.schema}
	backend := store.SQLBackend{DB: databaseResources.database, Dialect: databaseResources.renderer, Engine: databaseResources.profile}
	var artifactStore *sharedartifact.SQLStore
	if err = databaseResources.applyMigrations(ctx, func() error {
		if prepareErr := registrar.Prepare(ctx); prepareErr != nil {
			return prepareErr
		}
		if schemaErr := store.EnsureSchema(ctx, backend, registrar); schemaErr != nil {
			return schemaErr
		}
		artifactStore, err = sharedartifact.Open(ctx, databaseResources.database, databaseResources.renderer, registrar)
		return err
	}); err != nil {
		return nil, err
	}
	service.shared, err = artifactstorage.OpenShared(ctx, filepath.Join(storagePath, "shared-artifacts"), artifactstorage.SharedStorageConfig{
		Driver: options.FileStorage.Driver, Region: options.FileStorage.Region, Bucket: options.FileStorage.Bucket,
		Prefix: options.FileStorage.Prefix, Endpoint: options.FileStorage.Endpoint, ForcePathStyle: options.FileStorage.ForcePathStyle,
	})
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

func (service *Service) Ready(ctx context.Context) error {
	if service == nil || service.database == nil {
		return fmt.Errorf("Knowledge database is unavailable")
	}
	if err := service.database.PingContext(ctx); err != nil {
		return fmt.Errorf("ping Knowledge database: %w", err)
	}
	return nil
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
