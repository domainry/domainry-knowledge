// Package module composes Knowledge capabilities behind its public contracts.
package module

import (
	"context"
	"fmt"
	"sync"
	"time"

	actioncontract "github.com/domainry/domainry-foundation/action"
	"github.com/domainry/domainry-foundation/logging"
	"github.com/domainry/domainry-foundation/modulehttp"
	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/contract"
	knowledgemodulehost "github.com/domainry/domainry-knowledge-sdk/modulehost"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
	application "github.com/domainry/domainry-knowledge/internal/application/knowledge"
	documentsecurity "github.com/domainry/domainry-knowledge/internal/infrastructure/documentsecurity"
	store "github.com/domainry/domainry-knowledge/internal/infrastructure/persistence/database/knowledge"
	modulehttptransport "github.com/domainry/domainry-knowledge/internal/transport/http/module"
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
	if options != nil {
		if repository, ok := runtime.repository.(interface {
			SetKnowledgeEmbedProviders([]knowledgesdk.EmbedProvider) error
		}); ok {
			if err := repository.SetKnowledgeEmbedProviders(options.EmbedProviders); err != nil {
				return err
			}
		}
		if repository, ok := runtime.repository.(interface {
			SetKnowledgeCollaborationNotifier(knowledgesdk.KnowledgeCollaborationNotifier)
		}); ok {
			repository.SetKnowledgeCollaborationNotifier(options.CollaborationNotifier)
		}
	}
	return application.ValidateOptions(runtime.repository, options)
}
func (runtime Runtime) Activate(runtimeID string, options contract.Options) error {
	return application.ActivateDocumentSources(runtime.repository, runtimeID, options)
}
func (runtime Runtime) NewService(runtimeID string, options contract.Options) contract.Service {
	if repository, ok := runtime.repository.(interface {
		SetKnowledgeCollaborationNotifier(knowledgesdk.KnowledgeCollaborationNotifier)
	}); ok {
		repository.SetKnowledgeCollaborationNotifier(options.CollaborationNotifier)
	}
	service := newSupervisedService(application.NewService(runtime.repository, runtimeID, options, failureRecorder{}))
	if runtime.binding != nil {
		runtime.binding.bindService(service)
	}
	return service
}

type failureRecorder struct{}

func (failureRecorder) RecordFailure(ctx context.Context, event string, err error, failure application.Failure) {
	fields := logging.Failure{Stage: failure.Stage, Dependency: failure.Dependency, Retryable: failure.Retryable}
	switch event {
	case "knowledge_audit_append_failed":
		logging.RecordFailure(ctx, "knowledge_audit_append_failed", err, fields)
	case "knowledge_collaboration_publish_failed":
		logging.RecordFailure(ctx, "knowledge_collaboration_publish_failed", err, fields)
	default:
		logging.RecordFailure(ctx, "knowledge_operational_failure", err, fields)
	}
}
func (runtime Runtime) Prepare(runtimeID string, options contract.Options) (contract.Knowledge, error) {
	if documents, ok := runtime.repository.(persistence.KnowledgeSourceRegistry); ok && options.Knowledge != nil {
		if source, ok := options.Knowledge.(agentsdk.ManagedKnowledgeDocumentSource); ok {
			if _, ok := options.Knowledge.(agentsdk.Source); !ok {
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
	repository := store.New(backend)
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
