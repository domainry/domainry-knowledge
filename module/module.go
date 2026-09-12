// Package module is the stable in-process facade for domainry-knowledge.
// Implementations are private; callers select and assemble capabilities explicitly.
package module

import (
	"context"
	agentsdk "github.com/domainry/domainry-agent-sdk"
	modulehost "github.com/domainry/domainry-agent-sdk/modulehost"
	persistence "github.com/domainry/domainry-agent-sdk/persistence"
	"github.com/domainry/domainry-knowledge/contract"
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
	query "github.com/domainry/domainry-orm/query"
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
func DocumentMaxBytes(source any) int64      { return application.DocumentMaxBytes(source) }
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

func NewLibraryKnowledgeSource(repo any, runtimeID string, policy agentsdk.KnowledgeLibraryAuthorizer, bindings []LibraryKnowledgeBinding, legacy ConversationKnowledge, catalog agentsdk.KnowledgeDatasourceCatalog) (*LibraryKnowledgeSource, error) {
	return application.NewLibraryKnowledgeSource(repo, runtimeID, policy, bindings, legacy, catalog)
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
type Service = application.Service

func NewService(repo any, runtimeID string, options Options) *Service {
	return application.NewService(repo, runtimeID, options)
}
func GuardManagedKnowledge(base ConversationKnowledge, source agentsdk.ManagedKnowledgeDocumentSource, repo persistence.KnowledgeSourceRegistry) ConversationKnowledge {
	return application.GuardManagedKnowledge(base, source, repo)
}

type ContextReader = application.ContextReader

func CompatArtifactExportScope(a agentsdk.ConversationAuthority, id string) query.Predicate {
	return store.CompatArtifactExportScope(a, id)
}

type CompatArtifactCursor = store.CompatArtifactCursor

func CompatConversationArtifactMigration(d modulehost.Dialect) (modulehost.SchemaMigration, error) {
	return store.CompatConversationArtifactMigration(d)
}
func CompatArtifactScope(a agentsdk.ConversationAuthority, id string) query.Predicate {
	return store.CompatArtifactScope(a, id)
}
func CompatArtifactSHA(value string) bool { return store.CompatArtifactSHA(value) }
func CompatValidateArtifactRecord(in persistence.ConversationArtifactRecord) error {
	return store.CompatValidateArtifactRecord(in)
}
func CompatArtifactRequestKey(digest string, fallback any) (any, error) {
	return store.CompatArtifactRequestKey(digest, fallback)
}

const CompatAttachmentKnowledgeSourceTable = store.CompatAttachmentKnowledgeSourceTable
const CompatAttachmentIndexJobTable = store.CompatAttachmentIndexJobTable

func CompatAttachmentIndexMigration(d modulehost.Dialect) (modulehost.SchemaMigration, error) {
	return store.CompatAttachmentIndexMigration(d)
}

const CompatAttachmentTable = store.CompatAttachmentTable
const CompatAttachmentCleanupTable = store.CompatAttachmentCleanupTable

func CompatConversationAttachmentMigration(d modulehost.Dialect) (modulehost.SchemaMigration, error) {
	return store.CompatConversationAttachmentMigration(d)
}
func CompatConversationAttachmentCleanupMigration(d modulehost.Dialect) (modulehost.SchemaMigration, error) {
	return store.CompatConversationAttachmentCleanupMigration(d)
}
func CompatAttachmentScope(a agentsdk.ConversationAuthority, id string) query.Predicate {
	return store.CompatAttachmentScope(a, id)
}
func CompatAttachmentDeleted(state string) bool { return store.CompatAttachmentDeleted(state) }

var CompatAttachmentErrorCodePattern = store.CompatAttachmentErrorCodePattern

func CompatValidAttachmentReserve(in persistence.ConversationAttachmentReserve) bool {
	return store.CompatValidAttachmentReserve(in)
}

type Backend = store.Backend
type DB = store.DB
type Sources = store.Sources
type Store = store.Store

func NewStore(backend Backend, sources Sources) *Store {
	return store.New(backend, sources)
}

type SQLBackend = store.SQLBackend

func CompatKnowledgeDocumentReservationID(library, client string, namespace string, a agentsdk.ConversationAuthority) string {
	return store.CompatKnowledgeDocumentReservationID(library, client, namespace, a)
}
func CompatValidAttachmentOrigin(origin persistence.KnowledgeAttachmentOrigin) bool {
	return store.CompatValidAttachmentOrigin(origin)
}

const CompatKnowledgeDatasourceTable = store.CompatKnowledgeDatasourceTable

func CompatKnowledgeDatasourceMigration(d modulehost.Dialect) (modulehost.SchemaMigration, error) {
	return store.CompatKnowledgeDatasourceMigration(d)
}
func CompatDocumentScopeForLibrary(id string, a agentsdk.ConversationAuthority) agentsdk.KnowledgeDocumentStorageScope {
	return store.CompatDocumentScopeForLibrary(id, a)
}

const CompatKnowledgeDocumentTable = store.CompatKnowledgeDocumentTable
const CompatKnowledgeDocumentJobTable = store.CompatKnowledgeDocumentJobTable
const CompatKnowledgeDocumentSourceTable = store.CompatKnowledgeDocumentSourceTable

func CompatKnowledgeDocumentMigration(d modulehost.Dialect) (modulehost.SchemaMigration, error) {
	return store.CompatKnowledgeDocumentMigration(d)
}
func CompatDocumentScope(a agentsdk.ConversationAuthority, id string) query.Predicate {
	return store.CompatDocumentScope(a, id)
}
func CompatValidKnowledgeDocumentID(id string) bool {
	return store.CompatValidKnowledgeDocumentID(id)
}
func CompatDocumentWriting(l agentsdk.KnowledgeLibrary) error {
	return store.CompatDocumentWriting(l)
}
func CompatValidKnowledgeDocumentOrigin(o persistence.KnowledgeDocumentOrigin) bool {
	return store.CompatValidKnowledgeDocumentOrigin(o)
}
func CompatDocumentLeaseAuthority(l persistence.KnowledgeDocumentLease) agentsdk.ConversationAuthority {
	return store.CompatDocumentLeaseAuthority(l)
}
func CompatKnowledgeDocumentPutRequestID(r persistence.KnowledgeDocumentRecord) string {
	return store.CompatKnowledgeDocumentPutRequestID(r)
}

const CompatLibraryTable = store.CompatLibraryTable
const CompatLibraryMemberTable = store.CompatLibraryMemberTable

func CompatKnowledgeLibraryMigration(d modulehost.Dialect) (modulehost.SchemaMigration, error) {
	return store.CompatKnowledgeLibraryMigration(d)
}
func CompatLibraryScope(a agentsdk.ConversationAuthority) string {
	return store.CompatLibraryScope(a)
}
func CompatLibraryPredicate(a agentsdk.ConversationAuthority, id string) query.Predicate {
	return store.CompatLibraryPredicate(a, id)
}
func CompatValidLibraryID(id string) bool     { return store.CompatValidLibraryID(id) }
func CompatValidLibraryUser(id string) bool   { return store.CompatValidLibraryUser(id) }
func CompatValidLibraryRole(role string) bool { return store.CompatValidLibraryRole(role) }
func CompatLibraryPageLimit(after string, limit int, users bool) (int, error) {
	return store.CompatLibraryPageLimit(after, limit, users)
}
func LegacyMigrations(d modulehost.Dialect) ([]modulehost.SchemaMigration, error) {
	return store.LegacyMigrations(d)
}
func SubjectLifecycleMigration(d modulehost.Dialect) (modulehost.SchemaMigration, error) {
	return store.SubjectLifecycleMigration(d)
}
func ConversationReferenceLifecycleMigration(d modulehost.Dialect) (modulehost.SchemaMigration, error) {
	return store.ConversationReferenceLifecycleMigration(d)
}
func NewSubjectLifecycle(backend Backend, runtimeID string, options Options) lifecyclecontract.SubjectExecutionHandler {
	return store.NewSubjectLifecycle(store.New(backend, nil), runtimeID, store.SubjectLifecycleOptions{
		AttachmentStorage: options.AttachmentStorage, ArtifactStorage: options.ArtifactStorage,
		DocumentStorage: options.DocumentStorage,
	})
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

func NewAttachmentKnowledge(c KnowledgeConfig, runtime string) (*AttachmentKnowledge, error) {
	return provider.NewAttachmentKnowledge(c, runtime)
}

type KnowledgeConfig = provider.KnowledgeConfig

func KnowledgeConfigFromEnvironment() KnowledgeConfig {
	return provider.KnowledgeConfigFromEnvironment()
}

type Knowledge = provider.Knowledge

func NewKnowledge(c KnowledgeConfig) (*Knowledge, error) {
	return provider.NewKnowledge(c)
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

func NewFactory() contract.Factory { return assembly.NewFactory() }
