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

	auditsdk "github.com/domainry/domainry-audit-sdk"
	auditmodulehost "github.com/domainry/domainry-audit-sdk/modulehost"
	auditmodule "github.com/domainry/domainry-audit/module"
	"github.com/domainry/domainry-foundation/modulehttp"
	sharedoperation "github.com/domainry/domainry-foundation/operation"
	"github.com/domainry/domainry-foundation/telemetry"
	identitysdk "github.com/domainry/domainry-identity-sdk"
	identitymodule "github.com/domainry/domainry-identity/module"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgecontract "github.com/domainry/domainry-knowledge-sdk/contract"
	knowledgemodulehost "github.com/domainry/domainry-knowledge-sdk/modulehost"
	knowledgeprovider "github.com/domainry/domainry-knowledge-sdk/provider"
	applicationcardprovider "github.com/domainry/domainry-knowledge/internal/infrastructure/applicationcardprovider"
	documentstorage "github.com/domainry/domainry-knowledge/internal/infrastructure/documentstorage"
	embedprovider "github.com/domainry/domainry-knowledge/internal/infrastructure/embedprovider"
	"github.com/domainry/domainry-knowledge/internal/infrastructure/persistence/migrationhost"
	"github.com/domainry/domainry-knowledge/internal/infrastructure/persistence/sqliteconfig"
	webhookdelivery "github.com/domainry/domainry-knowledge/internal/infrastructure/webhookdelivery"
	knowledgemodule "github.com/domainry/domainry-knowledge/module"
	metadatamodule "github.com/domainry/domainry-metadata/module"
	ormdialect "github.com/domainry/domainry-orm/dialect"
	ormdriver "github.com/domainry/domainry-orm/driver"
	ormsqlite "github.com/domainry/domainry-orm/sqlite"
	_ "modernc.org/sqlite"
)

const (
	knowledgeReaderRoleKey  = "knowledge_reader"
	knowledgeEditorRoleKey  = "knowledge_editor"
	knowledgeManagerRoleKey = "knowledge_manager"
)

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
	runtimeID           string
	workspaceID         string
	application         identitysdk.ApplicationRef
	database            *sql.DB
	dialect             ormdialect.Renderer
	profile             ormdriver.Profile
	registrar           *migrationhost.Registrar
	identity            identitysdk.Binding
	audit               auditsdk.Binding
	knowledge           knowledgemodulehost.ModuleBinding
	retrieval           knowledgecontract.Knowledge
	documents           io.Closer
	handler             http.Handler
	embedFrameOrigins   []string
	trustedApplications *knowledgesdk.TrustedApplicationRegistry
}

func Open(ctx context.Context, options Options) (_ *Host, resultErr error) {
	if strings.TrimSpace(options.RuntimeID) == "" || strings.TrimSpace(options.WorkspaceID) == "" || strings.TrimSpace(options.ApplicationKey) == "" || strings.TrimSpace(options.DatabasePath) == "" || strings.TrimSpace(options.StoragePath) == "" {
		return nil, fmt.Errorf("Knowledge product configuration is incomplete")
	}
	if len(options.Knowledge.EmbedProviders) == 0 {
		options.Knowledge.EmbedProviders = embedprovider.Defaults()
	}
	if !hasApplicationCardProvider(options.Knowledge.ApplicationCardProviders, "web") {
		options.Knowledge.ApplicationCardProviders = append(options.Knowledge.ApplicationCardProviders, applicationcardprovider.Web{})
	}
	embedRegistry, err := knowledgesdk.NewEmbedProviderRegistry(options.Knowledge.EmbedProviders...)
	if err != nil {
		return nil, err
	}
	trustedApplications, err := knowledgesdk.NewTrustedApplicationRegistry(options.Knowledge.TrustedApplications...)
	if err != nil {
		return nil, err
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
	database, err := telemetry.OpenObservedSQL("sqlite", sqliteconfig.DSN(databasePath), "runtime", nil)
	if err != nil {
		return nil, err
	}
	database.SetMaxOpenConns(8)
	host := &Host{
		runtimeID: options.RuntimeID, workspaceID: options.WorkspaceID, database: database,
		application:         identitysdk.ApplicationRef{WorkspaceID: identitysdk.WorkspaceID(options.WorkspaceID), ApplicationKey: identitysdk.ApplicationKey(options.ApplicationKey)},
		embedFrameOrigins:   embedRegistry.FrameOrigins(),
		trustedApplications: trustedApplications,
	}
	defer func() {
		if resultErr != nil {
			_ = host.Close(context.Background())
		}
	}()
	for _, statement := range []string{"PRAGMA journal_mode = WAL"} {
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
	host.audit, err = auditmodule.NewFactory(auditmodule.Options{}).OpenModule(ctx, auditsdk.ApplicationRef{InstallationID: options.RuntimeID + "-knowledge"}, auditPersistenceHost{host: host})
	if err != nil {
		return nil, fmt.Errorf("open Knowledge audit binding: %w", err)
	}
	if err = host.registerKnowledgePermissions(ctx); err != nil {
		return nil, err
	}
	if err = host.registerTrustedKnowledgeApplications(ctx); err != nil {
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
	knowledgeOptions.TrustedApplicationResolver = host
	if knowledgeOptions.WebhookDeliverer == nil {
		knowledgeOptions.WebhookDeliverer = webhookdelivery.New(nil)
	}
	knowledgeOptions.DocumentStorage = documents
	auditBridge := &knowledgeAuditBridge{appender: host.audit.Appender(), reader: host.audit.Reader()}
	knowledgeOptions.AuditAppender = auditBridge
	knowledgeOptions.AuditReader = auditBridge
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

func hasApplicationCardProvider(providers []knowledgesdk.KnowledgeApplicationCardProvider, key string) bool {
	for _, provider := range providers {
		if provider != nil && strings.TrimSpace(provider.Key()) == key {
			return true
		}
	}
	return false
}

func (host *Host) Database() knowledgemodulehost.Database             { return host.database }
func (host *Host) Dialect() knowledgemodulehost.Dialect               { return host.dialect }
func (host *Host) Migrations() knowledgemodulehost.MigrationRegistrar { return host.registrar }
func (host *Host) Profile() ormdriver.Profile                         { return host.profile }

// auditPersistenceHost adapts the shared database primitives to Audit's
// deliberately separate modulehost contract. Host cannot expose two Dialect
// methods whose return types are distinct named interfaces in Go.
type auditPersistenceHost struct{ host *Host }

func (adapter auditPersistenceHost) Database() auditmodulehost.Database { return adapter.host.database }
func (adapter auditPersistenceHost) Dialect() auditmodulehost.Dialect   { return adapter.host.dialect }
func (adapter auditPersistenceHost) Migrations() auditmodulehost.MigrationRegistrar {
	return adapter.host.registrar
}

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
	if host.audit != nil {
		values = append(values, host.audit.Close(ctx))
		host.audit = nil
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
var _ knowledgesdk.KnowledgeTrustedApplicationResolver = (*Host)(nil)
