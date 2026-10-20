// Package product composes Identity and Knowledge as sibling in-process
// modules for the standalone Knowledge SaaS product.
package product

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"io"
	"io/fs"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	auditmodule "github.com/domainry/domainry-audit/module"
	"github.com/domainry/domainry-foundation/modulehttp"
	sharedoperation "github.com/domainry/domainry-foundation/operation"
	identitysdk "github.com/domainry/domainry-identity-sdk"
	identitymodule "github.com/domainry/domainry-identity/module"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgecontract "github.com/domainry/domainry-knowledge-sdk/contract"
	knowledgemodulehost "github.com/domainry/domainry-knowledge-sdk/modulehost"
	knowledgeprovider "github.com/domainry/domainry-knowledge-sdk/provider"
	documentstorage "github.com/domainry/domainry-knowledge/internal/infrastructure/documentstorage"
	"github.com/domainry/domainry-knowledge/internal/infrastructure/persistence/migrationhost"
	knowledgemodule "github.com/domainry/domainry-knowledge/module"
	metadatamodule "github.com/domainry/domainry-metadata/module"
	ormdialect "github.com/domainry/domainry-orm/dialect"
	ormdriver "github.com/domainry/domainry-orm/driver"
	ormsqlite "github.com/domainry/domainry-orm/sqlite"
	_ "modernc.org/sqlite"
)

const administratorRoleKey = "knowledge_admin"

type Options struct {
	RuntimeID, WorkspaceID, ApplicationKey string
	DatabasePath, StoragePath              string
	Origin                                 string
	Files                                  fs.FS
	Identity                               identitymodule.Options
	Knowledge                              knowledgecontract.Options
	ProviderConfig                         knowledgeprovider.Config
	ProviderFactory                        knowledgeprovider.Factory
	AdminLogin, AdminName, AdminPassword   string
}

type Host struct {
	runtimeID   string
	workspaceID string
	application identitysdk.ApplicationRef
	database    *sql.DB
	dialect     knowledgemodulehost.Dialect
	profile     ormdriver.Profile
	registrar   *migrationhost.Registrar
	identity    identitysdk.Binding
	knowledge   knowledgemodulehost.ModuleBinding
	retrieval   knowledgecontract.Knowledge
	documents   io.Closer
	handler     http.Handler
}

func Open(ctx context.Context, options Options) (_ *Host, resultErr error) {
	if strings.TrimSpace(options.RuntimeID) == "" || strings.TrimSpace(options.WorkspaceID) == "" || strings.TrimSpace(options.ApplicationKey) == "" || strings.TrimSpace(options.DatabasePath) == "" || strings.TrimSpace(options.StoragePath) == "" {
		return nil, fmt.Errorf("Knowledge product configuration is incomplete")
	}
	databasePath, err := filepath.Abs(options.DatabasePath)
	if err != nil {
		return nil, err
	}
	storagePath, err := filepath.Abs(options.StoragePath)
	if err != nil {
		return nil, err
	}
	if err = os.MkdirAll(filepath.Dir(databasePath), 0o700); err != nil {
		return nil, fmt.Errorf("create Knowledge database directory: %w", err)
	}
	database, err := sql.Open("sqlite", databasePath)
	if err != nil {
		return nil, err
	}
	database.SetMaxOpenConns(8)
	host := &Host{
		runtimeID: options.RuntimeID, workspaceID: options.WorkspaceID, database: database,
		application: identitysdk.ApplicationRef{WorkspaceID: identitysdk.WorkspaceID(options.WorkspaceID), ApplicationKey: identitysdk.ApplicationKey(options.ApplicationKey)},
	}
	defer func() {
		if resultErr != nil {
			_ = host.Close(context.Background())
		}
	}()
	for _, statement := range []string{"PRAGMA foreign_keys = ON", "PRAGMA journal_mode = WAL", "PRAGMA busy_timeout = 5000"} {
		if _, err = database.ExecContext(ctx, statement); err != nil {
			return nil, err
		}
	}
	renderer, err := ormdialect.New(ormdialect.SQLite)
	if err != nil {
		return nil, err
	}
	host.dialect = renderer.WithSchema("")
	host.profile = ormsqlite.NewProfile()
	host.registrar = &migrationhost.Registrar{DB: database, Renderer: host.dialect}
	if err = host.registrar.Prepare(ctx); err != nil {
		return nil, err
	}
	if _, err = sharedoperation.Open(ctx, database, sharedoperation.AdaptDialect(host.dialect), host.registrar); err != nil {
		return nil, err
	}
	if err = host.openIdentity(ctx, options); err != nil {
		return nil, err
	}
	if err = host.registerKnowledgePermissions(ctx); err != nil {
		return nil, err
	}

	documents, err := documentstorage.NewFiles(filepath.Join(storagePath, "documents"))
	if err != nil {
		return nil, fmt.Errorf("open Knowledge document storage: %w", err)
	}
	host.documents = documents
	knowledgeOptions := options.Knowledge
	knowledgeOptions.LibraryAuthorizer = host
	knowledgeOptions.PrincipalDirectory = host
	knowledgeOptions.AccessExplainer = host
	knowledgeOptions.DocumentStorage = documents
	if options.ProviderFactory != nil {
		source, sourceErr := options.ProviderFactory.NewSource(options.ProviderConfig)
		if sourceErr != nil {
			return nil, fmt.Errorf("configure Knowledge provider: %w", sourceErr)
		}
		if source != nil {
			knowledgeOptions.Knowledge = source
			if source.KnowledgeDocumentManagementReady() == nil {
				knowledgeOptions.KnowledgeDatasources = newSingleDatasourceCatalog(options.RuntimeID, options.WorkspaceID, source)
			}
		}
	}

	binding, err := knowledgemodule.NewFactory().OpenModule(ctx, knowledgecontract.ApplicationRef{RuntimeID: options.RuntimeID}, host)
	if err != nil {
		return nil, fmt.Errorf("open Knowledge module: %w", err)
	}
	host.knowledge = binding
	runtime := binding.Runtime()
	if err = runtime.Validate(&knowledgeOptions); err != nil {
		return nil, err
	}
	host.retrieval, err = runtime.Prepare(options.RuntimeID, knowledgeOptions)
	if err != nil {
		return nil, err
	}
	// The prepared value is the library-aware resolver. The HTTP service must
	// receive that same resolver so datasource bindings are available to CRUD,
	// upload and retrieval instead of only to the two retrieval endpoints.
	knowledgeOptions.Knowledge = host.retrieval
	if err = runtime.Activate(options.RuntimeID, knowledgeOptions); err != nil {
		return nil, err
	}
	runtime.NewService(options.RuntimeID, knowledgeOptions)
	provider, ok := binding.(modulehttp.Provider)
	if !ok || len(provider.HTTPAdapters()) == 0 {
		return nil, fmt.Errorf("Knowledge module HTTP adapter is unavailable")
	}
	host.handler, err = host.newHandler(options, provider.HTTPAdapters())
	if err != nil {
		return nil, err
	}
	return host, nil
}

func (host *Host) Database() knowledgemodulehost.Database             { return host.database }
func (host *Host) Dialect() knowledgemodulehost.Dialect               { return host.dialect }
func (host *Host) Migrations() knowledgemodulehost.MigrationRegistrar { return host.registrar }
func (host *Host) Profile() ormdriver.Profile                         { return host.profile }

func (host *Host) Handler() http.Handler {
	if host == nil || host.handler == nil {
		return http.NotFoundHandler()
	}
	return host.handler
}

func (host *Host) Close(ctx context.Context) error {
	if host == nil {
		return nil
	}
	var values []error
	if host.knowledge != nil {
		values = append(values, host.knowledge.Close(ctx))
		host.knowledge = nil
	}
	if host.identity != nil {
		values = append(values, host.identity.Close(ctx))
		host.identity = nil
	}
	if host.documents != nil {
		values = append(values, host.documents.Close())
		host.documents = nil
	}
	if host.database != nil {
		values = append(values, host.database.Close())
		host.database = nil
	}
	return errors.Join(values...)
}

func identityOptions(options identitymodule.Options) identitymodule.Options {
	if options.AuditFactory == nil {
		options.AuditFactory = auditmodule.NewFactory(auditmodule.Options{})
	}
	if options.MetadataFactory == nil {
		options.MetadataFactory = metadatamodule.NewFactory()
	}
	return options
}

func (host *Host) databaseHandle(databasePath string) identitysdk.DatabaseHandle {
	return identitysdk.DatabaseHandle{Pool: host.database, Driver: "sqlite", FilePath: databasePath, Migrations: host.registrar, ModuleMigrations: host.registrar}
}

var _ knowledgemodulehost.Host = (*Host)(nil)
var _ knowledgesdk.KnowledgeLibraryAuthorizer = (*Host)(nil)
var _ knowledgesdk.KnowledgePrincipalDirectory = (*Host)(nil)
var _ knowledgesdk.KnowledgeAccessExplainer = (*Host)(nil)
