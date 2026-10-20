// Package module is the stable in-process facade for domainry-knowledge.
package module

import (
	"context"
	"net/http"
	"time"

	"github.com/domainry/domainry-foundation/schemaownership"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/contract"
	knowledgemodulehost "github.com/domainry/domainry-knowledge-sdk/modulehost"
	knowledgepersistence "github.com/domainry/domainry-knowledge-sdk/persistence"
	knowledgeprovider "github.com/domainry/domainry-knowledge-sdk/provider"
	application "github.com/domainry/domainry-knowledge/internal/application/knowledge"
	assembly "github.com/domainry/domainry-knowledge/internal/assembly/module"
	connectortransport "github.com/domainry/domainry-knowledge/internal/infrastructure/connectortransport"
	documentstorage "github.com/domainry/domainry-knowledge/internal/infrastructure/documentstorage"
	store "github.com/domainry/domainry-knowledge/internal/infrastructure/persistence/database/knowledge"
	recordstore "github.com/domainry/domainry-knowledge/internal/infrastructure/persistence/database/record"
	provider "github.com/domainry/domainry-knowledge/internal/infrastructure/provider"
)

func DatasourceIdentity(value string) bool { return application.DatasourceIdentity(value) }
func RecoverKnowledgeDocumentDelete(ctx context.Context, source knowledgesdk.KnowledgeDocumentSource, id string, authority knowledgesdk.Authority, leaseUntil time.Time) bool {
	return application.RecoverKnowledgeDocumentDelete(ctx, source, id, authority, leaseUntil)
}
func DocumentStorageScope(library string, authority knowledgesdk.Authority) knowledgesdk.KnowledgeDocumentStorageScope {
	return application.DocumentStorageScope(library, authority)
}
func DocumentAccessPolicy(source any) string { return application.DocumentAccessPolicy(source) }
func DocumentOriginalMaximumBytes() int64    { return application.DocumentOriginalMaximumBytes() }
func DocumentIndexMaximumBytes(source any) int64 {
	return application.DocumentIndexMaximumBytes(source)
}
func DocumentIndexMaximumBytesForFilename(source any, filename string) int64 {
	return application.DocumentIndexMaximumBytesForFilename(source, filename)
}
func BuiltinDocumentSecurityScanner() contract.DocumentSecurityScanner {
	return application.BuiltinDocumentSecurityScanner()
}
func NewClamdDocumentSecurityScanner(network, address string, timeout time.Duration) (contract.DocumentSecurityScanner, error) {
	return assembly.NewClamdDocumentSecurityScanner(network, address, timeout)
}
func ActivateDocumentSources(repo any, runtime string, options Options) error {
	return application.ActivateDocumentSources(repo, runtime, options)
}

const ManagedKnowledgeProvider = application.ManagedKnowledgeProvider

type DocumentGuardedKnowledge = application.DocumentGuardedKnowledge
type DocumentSnapshot = application.DocumentSnapshot
type DocumentEvidence = application.DocumentEvidence

func DocumentReadable(record knowledgepersistence.KnowledgeDocumentRecord, library, source, policy string) bool {
	return application.DocumentReadable(record, library, source, policy)
}

type LibraryKnowledgeBinding = application.LibraryKnowledgeBinding
type LibraryKnowledgeSource = application.LibraryKnowledgeSource

func NewLibraryKnowledgeSource(repo any, runtimeID string, policy knowledgesdk.KnowledgeLibraryAuthorizer, sourcePolicy knowledgesdk.KnowledgeDocumentSourceAuthorizer, bindings []LibraryKnowledgeBinding, defaultSource Knowledge, catalog knowledgesdk.KnowledgeDatasourceCatalog) (*LibraryKnowledgeSource, error) {
	return application.NewLibraryKnowledgeSource(repo, runtimeID, policy, sourcePolicy, bindings, defaultSource, catalog)
}
func LibraryKnowledgeAccessError(err error) error {
	return application.LibraryKnowledgeAccessError(err)
}
func CommittedKnowledgeWriteContext(ctx context.Context, expires time.Time) (context.Context, context.CancelFunc, error) {
	return application.CommittedKnowledgeWriteContext(ctx, expires)
}

type Knowledge = application.Knowledge
type Options = application.Options
type Service = contract.Service

func NewService(repo any, runtimeID string, options Options) Service {
	return assembly.NewRuntime(repo).NewService(runtimeID, options)
}
func GuardManagedKnowledge(base Knowledge, source knowledgesdk.ManagedKnowledgeDocumentSource, repo knowledgepersistence.KnowledgeSourceRegistry) Knowledge {
	return application.GuardManagedKnowledge(base, source, repo)
}

type Backend = store.Backend
type DB = store.DB
type Store = store.Store
type SQLBackend = store.SQLBackend

func NewStore(backend Backend) *Store { return store.New(backend) }

const MigrationOwner = store.MigrationOwner

type MigrationRegistrar = store.MigrationRegistrar

func EnsureSchema(ctx context.Context, backend Backend, migrations MigrationRegistrar) error {
	return store.EnsureSchema(ctx, backend, migrations)
}
func SchemaMigrations(d knowledgemodulehost.Dialect) ([]knowledgemodulehost.SchemaMigration, error) {
	return store.SchemaMigrations(d)
}
func SchemaOwnership() []schemaownership.Table { return store.SchemaOwnership() }
func OwnedTables() []string                    { return schemaownership.Names(SchemaOwnership()) }

type Record = recordstore.Record
type RecordWrite = recordstore.Write
type RecordPage = recordstore.Page
type RecordValidator = recordstore.Validator
type RecordStore = recordstore.Store

func NewRecordStore(ctx context.Context, backend Backend, migrations knowledgemodulehost.MigrationRegistrar, namespace string) (*RecordStore, error) {
	return assembly.NewRecordStore(ctx, backend, migrations, namespace)
}

type KnowledgeConfig = provider.KnowledgeConfig
type KnowledgeProvider = provider.Knowledge

func KnowledgeConfigFromEnvironment() KnowledgeConfig {
	return provider.KnowledgeConfigFromEnvironment()
}
func NewKnowledge(config KnowledgeConfig, adapterFactory knowledgeprovider.AdapterFactory) (*KnowledgeProvider, error) {
	return provider.NewKnowledge(config, adapterFactory)
}

type KnowledgeCitationMapping = provider.KnowledgeCitationMapping
type KnowledgeResponseMapping = provider.KnowledgeResponseMapping
type HTTP = connectortransport.HTTP

func NewKnowledgeDocumentHTTP(origin, kb string, client *http.Client) (*HTTP, error) {
	return connectortransport.NewKnowledgeDocumentHTTP(origin, kb, client)
}
func NewHTTP(origin string, client *http.Client) (*HTTP, error) {
	return connectortransport.NewHTTP(origin, client)
}

type DocumentFiles = documentstorage.Files

func NewDocumentFiles(path string) (*DocumentFiles, error) { return documentstorage.NewFiles(path) }

func NewFactory() knowledgemodulehost.Factory { return assembly.NewFactory() }
func NewProviderFactory(adapterFactory knowledgeprovider.AdapterFactory) knowledgeprovider.Factory {
	return assembly.NewProviderFactory(adapterFactory)
}
func NewServiceRuntime(repository any) contract.Runtime { return assembly.NewRuntime(repository) }
