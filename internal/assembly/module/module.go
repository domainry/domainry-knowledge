// Package module composes Knowledge capabilities behind its public contracts.
package module

import (
	"context"
	"database/sql"
	"fmt"
	"sync"
	"time"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
	actioncontract "github.com/domainry/domainry-foundation/action"
	sharedartifact "github.com/domainry/domainry-foundation/artifact"
	"github.com/domainry/domainry-foundation/modulehttp"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/contract"
	knowledgemodulehost "github.com/domainry/domainry-knowledge-sdk/modulehost"
	application "github.com/domainry/domainry-knowledge/internal/application/knowledge"
	documentsecurity "github.com/domainry/domainry-knowledge/internal/infrastructure/documentsecurity"
	store "github.com/domainry/domainry-knowledge/internal/infrastructure/persistence/database/knowledge"
	modulehttptransport "github.com/domainry/domainry-knowledge/internal/transport/http/module"
	lifecyclecontract "github.com/domainry/domainry-lifecycle-sdk/contract"
)

type Runtime struct {
	repository any
	binding    *Binding
}

func NewRuntime(repository any) contract.Runtime { return Runtime{repository: repository} }
func NewClamdDocumentSecurityScanner(network, address string, timeout time.Duration) (contract.DocumentSecurityScanner, error) {
	clamd, err := documentsecurity.NewClamdScanner(network, address, timeout)
	if err != nil {
		return nil, err
	}
	return application.ChainDocumentSecurityScanners(application.BuiltinDocumentSecurityScanner(), clamd)
}
func (runtime Runtime) Validate(options *contract.Options) error {
	return application.ValidateOptions(runtime.repository, options)
}
func (runtime Runtime) Activate(runtimeID string, options contract.Options) error {
	if err := application.ActivateDocumentSources(runtime.repository, runtimeID, options); err != nil {
		return err
	}
	if len(options.AttachmentKnowledge) == 0 {
		return nil
	}
	repository, ok := runtime.repository.(persistence.ConversationAttachmentIndexRepository)
	if !ok {
		return fmt.Errorf("attachment knowledge requires durable index persistence")
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	for _, binding := range options.AttachmentKnowledge {
		if err := repository.ActivateAttachmentKnowledgeSource(ctx, runtimeID, binding.WorkspaceID, binding.Knowledge.AttachmentKnowledgeSourceIdentity()); err != nil {
			return err
		}
	}
	return nil
}
func (runtime Runtime) NewService(runtimeID string, options contract.Options) contract.Service {
	service := newSupervisedService(application.NewService(runtime.repository, runtimeID, options))
	if runtime.binding != nil {
		runtime.binding.bindService(service)
	}
	return service
}
func (runtime Runtime) Prepare(runtimeID string, options contract.Options) (contract.ConversationKnowledge, error) {
	if documents, ok := runtime.repository.(persistence.KnowledgeSourceRegistry); ok && options.Knowledge != nil {
		if source, ok := options.Knowledge.(agentsdk.ManagedKnowledgeDocumentSource); ok {
			if _, ok := options.Knowledge.(agentsdk.ConversationKnowledgeSource); !ok {
				return nil, fmt.Errorf("managed document source requires knowledge revalidation")
			}
			options.Knowledge = application.GuardManagedKnowledge(options.Knowledge, source, documents)
		}
	}
	if len(options.LibraryKnowledge) > 0 || options.KnowledgeDatasources != nil {
		return application.NewLibraryKnowledgeSource(runtime.repository, runtimeID, options.LibraryAuthorizer, options.SourceAuthorizer, options.LibraryKnowledge, options.Knowledge, options.KnowledgeDatasources)
	}
	return options.Knowledge, nil
}

type Factory struct{}

func NewFactory() knowledgemodulehost.Factory { return Factory{} }

func (Factory) OpenModule(ctx context.Context, ref contract.ApplicationRef, host knowledgemodulehost.Host) (knowledgemodulehost.ModuleBinding, error) {
	if err := ref.Validate(); err != nil {
		return nil, err
	}
	if host == nil || host.Database() == nil || host.Dialect() == nil || host.Migrations() == nil || host.Profile() == nil {
		return nil, fmt.Errorf("Knowledge module host is incomplete")
	}
	backend := store.SQLBackend{DB: host.Database(), Dialect: host.Dialect(), Engine: host.Profile()}
	if err := store.EnsureSchema(ctx, backend, host.Migrations()); err != nil {
		return nil, fmt.Errorf("open Knowledge persistence: %w", err)
	}
	artifacts := store.ArtifactPersistence{}
	if artifactHost, ok := host.(knowledgemodulehost.ArtifactHost); ok {
		artifacts = store.ArtifactPersistence{Store: artifactHost.ArtifactStore(), Content: artifactHost.ArtifactContentStore(), Writer: artifactHost.ArtifactContentWriter()}
	}
	repository := store.New(backend, host, artifacts)
	workerContext, cancelWorkers := context.WithCancel(ctx)
	binding := &Binding{runtimeID: ref.RuntimeID, repository: repository, workerContext: workerContext, cancelWorkers: cancelWorkers}
	binding.runtime = Runtime{repository: repository, binding: binding}
	return binding, nil
}

type Binding struct {
	mu            sync.RWMutex
	runtimeID     string
	repository    *store.Store
	runtime       contract.Runtime
	service       contract.Service
	adapters      []modulehttp.Adapter
	adapterErr    error
	workerContext context.Context
	cancelWorkers context.CancelFunc
}

func (binding *Binding) bindService(service contract.Service) {
	binding.mu.Lock()
	defer binding.mu.Unlock()
	if binding.service != nil {
		if binding.service != service {
			binding.adapterErr = fmt.Errorf("Knowledge service is already bound")
		}
		return
	}
	adapter, err := modulehttptransport.NewAdapter(service, binding.runtimeID)
	binding.service = service
	binding.adapterErr = err
	if err == nil {
		binding.adapters = []modulehttp.Adapter{adapter}
		service.Start(binding.workerContext)
	}
}

func (binding *Binding) Runtime() contract.Runtime { return binding.runtime }
func (binding *Binding) HTTPAdapters() []modulehttp.Adapter {
	binding.mu.RLock()
	defer binding.mu.RUnlock()
	return append([]modulehttp.Adapter(nil), binding.adapters...)
}
func (binding *Binding) AuthorizationActions() ([]actioncontract.ActionDefinition, error) {
	binding.mu.RLock()
	defer binding.mu.RUnlock()
	if binding.adapterErr != nil {
		return nil, binding.adapterErr
	}
	if binding.service == nil || len(binding.adapters) == 0 {
		return nil, fmt.Errorf("Knowledge service HTTP adapter is not bound")
	}
	actions, err := knowledgesdk.AuthorizationActions()
	if err != nil {
		return nil, err
	}
	provider := knowledgeHTTPProvider{adapters: binding.adapters}
	if err := modulehttp.ValidateAuthorizationProjection(actions, provider); err != nil {
		return nil, err
	}
	return actions, nil
}
func (binding *Binding) ArtifactTransactions() knowledgemodulehost.ArtifactTransactions {
	return artifactTransactions{repository: binding.repository}
}
func (binding *Binding) SubjectLifecycle(options contract.Options) lifecyclecontract.SubjectExecutionHandler {
	return store.NewSubjectLifecycle(binding.repository, binding.runtimeID, store.SubjectLifecycleOptions{
		ArtifactStorage: options.ArtifactStorage, DocumentStorage: options.DocumentStorage,
	})
}
func (binding *Binding) Close(context.Context) error {
	if binding == nil {
		return nil
	}
	binding.mu.Lock()
	service := binding.service
	binding.service = nil
	cancelWorkers := binding.cancelWorkers
	binding.cancelWorkers = nil
	binding.mu.Unlock()
	if cancelWorkers != nil {
		cancelWorkers()
	}
	if service != nil {
		service.Close()
	}
	return nil
}

type knowledgeHTTPProvider struct{ adapters []modulehttp.Adapter }

func (provider knowledgeHTTPProvider) HTTPAdapters() []modulehttp.Adapter {
	return append([]modulehttp.Adapter(nil), provider.adapters...)
}

type artifactTransactions struct{ repository *store.Store }

func (transactions artifactTransactions) ArtifactRecordInTransaction(ctx context.Context, tx *sql.Tx, id string, version int64, authority agentsdk.ConversationAuthority) (persistence.ConversationArtifactRecord, error) {
	return transactions.repository.ArtifactRecordInTransaction(ctx, tx, id, version, authority)
}

func (transactions artifactTransactions) SaveArtifactInTransaction(ctx context.Context, tx *sql.Tx, input persistence.ConversationArtifactWrite, authority agentsdk.ConversationAuthority) (persistence.ConversationArtifactRecord, error) {
	return transactions.repository.SaveArtifactInTransaction(ctx, tx, input, authority)
}

func (transactions artifactTransactions) SaveArtifactExportInTransaction(ctx context.Context, tx *sql.Tx, input persistence.ConversationArtifactExportWrite, authority agentsdk.ConversationAuthority) (any, error) {
	return transactions.repository.SaveArtifactExportInTransaction(ctx, tx, input, authority)
}

func NewSubjectLifecycle(backend store.Backend, runtimeID string, options application.Options) lifecyclecontract.SubjectExecutionHandler {
	artifacts := store.ArtifactPersistence{}
	if host, ok := backend.(interface {
		ArtifactStore() sharedartifact.ManagedStore
		ArtifactContentStore() sharedartifact.ContentStore
		ArtifactContentWriter() sharedartifact.ContentWriter
	}); ok {
		artifacts = store.ArtifactPersistence{Store: host.ArtifactStore(), Content: host.ArtifactContentStore(), Writer: host.ArtifactContentWriter()}
	}
	return store.NewSubjectLifecycle(store.New(backend, nil, artifacts), runtimeID, store.SubjectLifecycleOptions{
		ArtifactStorage: options.ArtifactStorage, DocumentStorage: options.DocumentStorage,
	})
}
