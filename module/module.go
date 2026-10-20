// Package module is the stable in-process facade for domainry-knowledge.
// Implementations are private; callers select and assemble capabilities explicitly.
package module

import (
	"context"
	agentsdk "github.com/domainry/domainry-agent-sdk"
	modulehost "github.com/domainry/domainry-agent-sdk/modulehost"
	persistence "github.com/domainry/domainry-agent-sdk/persistence"
	"github.com/domainry/domainry-foundation/schemaownership"
	"github.com/domainry/domainry-knowledge-sdk/contract"
	knowledgemodulehost "github.com/domainry/domainry-knowledge-sdk/modulehost"
	knowledgeprovider "github.com/domainry/domainry-knowledge-sdk/provider"
	application "github.com/domainry/domainry-knowledge/internal/application/knowledge"
	assembly "github.com/domainry/domainry-knowledge/internal/assembly/module"
	artifactstorage "github.com/domainry/domainry-knowledge/internal/infrastructure/artifactstorage"
	attachmentstorage "github.com/domainry/domainry-knowledge/internal/infrastructure/attachmentstorage"
	connectortransport "github.com/domainry/domainry-knowledge/internal/infrastructure/connectortransport"
	documentstorage "github.com/domainry/domainry-knowledge/internal/infrastructure/documentstorage"
	store "github.com/domainry/domainry-knowledge/internal/infrastructure/persistence/database/knowledge"
	recordstore "github.com/domainry/domainry-knowledge/internal/infrastructure/persistence/database/record"
	provider "github.com/domainry/domainry-knowledge/internal/infrastructure/provider"
	lifecyclecontract "github.com/domainry/domainry-lifecycle-sdk/contract"
	"net/http"
	"time"
)

func ArtifactTool(key string) (agentsdk.ConversationToolDefinition, bool) {
	return application.ArtifactTool(key)
}
func AttachmentContentType(filename string) string {
	return application.AttachmentContentType(filename)
}
func ValidateAttachmentKnowledge(repo any, options *Options) error {
	return application.ValidateAttachmentKnowledge(repo, options)
}
func ValidAttachmentSourceHash(v string) bool { return application.ValidAttachmentSourceHash(v) }

const AttachmentKnowledgeProvider = application.AttachmentKnowledgeProvider

func AttachmentKnowledgeReceipt(scope agentsdk.ConversationAttachmentKnowledgeScope, conversation, op, q, id string, data DocumentEvidence, a agentsdk.ConversationAuthority) (agentsdk.ConversationKnowledgeResult, error) {
	return application.AttachmentKnowledgeReceipt(scope, conversation, op, q, id, data, a)
}
func DatasourceIdentity(value string) bool { return application.DatasourceIdentity(value) }
func RecoverKnowledgeDocumentDelete(ctx context.Context, source agentsdk.KnowledgeDocumentSource, id string, a agentsdk.ConversationAuthority, leaseUntil time.Time) bool {
	return application.RecoverKnowledgeDocumentDelete(ctx, source, id, a, leaseUntil)
}
func DocumentStorageScope(library string, a agentsdk.ConversationAuthority) agentsdk.KnowledgeDocumentStorageScope {
	return application.DocumentStorageScope(library, a)
}
func DocumentAccessPolicy(source any) string { return application.DocumentAccessPolicy(source) }
func DocumentOriginalMaximumBytes() int64    { return application.DocumentOriginalMaximumBytes() }
func BuiltinDocumentSecurityScanner() contract.DocumentSecurityScanner {
	return application.BuiltinDocumentSecurityScanner()
}
func NewClamdDocumentSecurityScanner(network, address string, timeout time.Duration) (contract.DocumentSecurityScanner, error) {
	return assembly.NewClamdDocumentSecurityScanner(network, address, timeout)
}
func DocumentIndexMaximumBytes(source any) int64 {
	return application.DocumentIndexMaximumBytes(source)
}
func DocumentIndexMaximumBytesForFilename(source any, filename string) int64 {
	return application.DocumentIndexMaximumBytesForFilename(source, filename)
}
func ActivateDocumentSources(repo any, runtime string, options Options) error {
	return application.ActivateDocumentSources(repo, runtime, options)
}

const ManagedKnowledgeProvider = application.ManagedKnowledgeProvider

type DocumentGuardedKnowledge = application.DocumentGuardedKnowledge
type DocumentSnapshot = application.DocumentSnapshot
type DocumentEvidence = application.DocumentEvidence

func DocumentReadable(r persistence.KnowledgeDocumentRecord, library, source, policy string) bool {
	return application.DocumentReadable(r, library, source, policy)
}

type LibraryKnowledgeBinding = application.LibraryKnowledgeBinding
type LibraryKnowledgeSource = application.LibraryKnowledgeSource

func NewLibraryKnowledgeSource(repo any, runtimeID string, policy agentsdk.KnowledgeLibraryAuthorizer, sourcePolicy agentsdk.KnowledgeDocumentSourceAuthorizer, bindings []LibraryKnowledgeBinding, defaultSource ConversationKnowledge, catalog agentsdk.KnowledgeDatasourceCatalog) (*LibraryKnowledgeSource, error) {
	return application.NewLibraryKnowledgeSource(repo, runtimeID, policy, sourcePolicy, bindings, defaultSource, catalog)
}
func LibraryKnowledgeAccessError(err error) error {
	return application.LibraryKnowledgeAccessError(err)
}
func CommittedKnowledgeWriteContext(ctx context.Context, expires time.Time) (context.Context, context.CancelFunc, error) {
	return application.CommittedKnowledgeWriteContext(ctx, expires)
}

type ConversationKnowledge = application.ConversationKnowledge
type SourcePolicy = application.SourcePolicy
type Options = application.Options
type Service = contract.Service

func NewService(repo any, runtimeID string, options Options) Service {
	return assembly.NewRuntime(repo).NewService(runtimeID, options)
}
func GuardManagedKnowledge(base ConversationKnowledge, source agentsdk.ManagedKnowledgeDocumentSource, repo persistence.KnowledgeSourceRegistry) ConversationKnowledge {
	return application.GuardManagedKnowledge(base, source, repo)
}

type ContextReader = application.ContextReader

type Backend = store.Backend
type DB = store.DB
type Sources = store.Sources
type Store = store.Store
type ArtifactPersistence = store.ArtifactPersistence

func NewStore(backend Backend, sources Sources, artifacts ArtifactPersistence) *Store {
	return store.New(backend, sources, artifacts)
}

type SQLBackend = store.SQLBackend

const MigrationOwner = store.MigrationOwner

type MigrationRegistrar = store.MigrationRegistrar

func EnsureSchema(ctx context.Context, backend Backend, migrations MigrationRegistrar) error {
	return store.EnsureSchema(ctx, backend, migrations)
}
func SchemaMigrations(d modulehost.Dialect) ([]modulehost.SchemaMigration, error) {
	return store.SchemaMigrations(d)
}
func SchemaOwnership() []schemaownership.Table { return store.SchemaOwnership() }
func OwnedTables() []string                    { return schemaownership.Names(SchemaOwnership()) }
func NewSubjectLifecycle(backend Backend, runtimeID string, options Options) lifecyclecontract.SubjectExecutionHandler {
	return assembly.NewSubjectLifecycle(backend, runtimeID, options)
}

type Record = recordstore.Record
type RecordWrite = recordstore.Write
type RecordPage = recordstore.Page
type RecordValidator = recordstore.Validator
type RecordStore = recordstore.Store

func NewRecordStore(ctx context.Context, backend Backend, migrations modulehost.MigrationRegistrar, namespace string) (*RecordStore, error) {
	return assembly.NewRecordStore(ctx, backend, migrations, namespace)
}

type AttachmentKnowledge = provider.AttachmentKnowledge

func NewAttachmentKnowledge(c KnowledgeConfig, runtime string, adapterFactory knowledgeprovider.AdapterFactory) (*AttachmentKnowledge, error) {
	return provider.NewAttachmentKnowledge(c, runtime, adapterFactory)
}

type KnowledgeConfig = provider.KnowledgeConfig

func KnowledgeConfigFromEnvironment() KnowledgeConfig {
	return provider.KnowledgeConfigFromEnvironment()
}

type Knowledge = provider.Knowledge

func NewKnowledge(c KnowledgeConfig, adapterFactory knowledgeprovider.AdapterFactory) (*Knowledge, error) {
	return provider.NewKnowledge(c, adapterFactory)
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

type AttachmentFiles = attachmentstorage.Files

func NewAttachmentFiles(directory string) (*AttachmentFiles, error) {
	return attachmentstorage.NewFiles(directory)
}

type ArtifactFiles = artifactstorage.Files

func NewArtifactFiles(directory string) (*ArtifactFiles, error) {
	return artifactstorage.NewFiles(directory)
}

type DocumentFiles = documentstorage.Files

func NewDocumentFiles(path string) (*DocumentFiles, error) {
	return documentstorage.NewFiles(path)
}

func NewFactory() knowledgemodulehost.Factory { return assembly.NewFactory() }
func NewProviderFactory(adapterFactory knowledgeprovider.AdapterFactory) knowledgeprovider.Factory {
	return assembly.NewProviderFactory(adapterFactory)
}

// NewServiceRuntime is a focused fixture seam for application tests that do
// not open a full module database.
func NewServiceRuntime(repository any) contract.Runtime { return assembly.NewRuntime(repository) }
