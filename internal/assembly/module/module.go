// Package module composes Knowledge capabilities behind its public contracts.
package module

import (
	"context"
	"fmt"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
	sharedartifact "github.com/domainry/domainry-foundation/artifact"
	"github.com/domainry/domainry-knowledge/contract"
	application "github.com/domainry/domainry-knowledge/internal/application/knowledge"
	store "github.com/domainry/domainry-knowledge/internal/infrastructure/persistence/database/knowledge"
	knowledgemodulehost "github.com/domainry/domainry-knowledge/modulehost"
	lifecyclecontract "github.com/domainry/domainry-lifecycle-sdk/contract"
)

type Runtime struct{ repository any }

func NewRuntime(repository any) contract.Runtime { return Runtime{repository: repository} }
func (runtime Runtime) Validate(options *contract.Options) error {
	return application.ValidateOptions(runtime.repository, options)
}
func (runtime Runtime) Activate(runtimeID string, options contract.Options) error {
	return application.ActivateDocumentSources(runtime.repository, runtimeID, options)
}
func (runtime Runtime) NewService(runtimeID string, options contract.Options) contract.Service {
	return application.NewService(runtime.repository, runtimeID, options)
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
		return application.NewLibraryKnowledgeSource(runtime.repository, runtimeID, options.LibraryAuthorizer, options.LibraryKnowledge, options.Knowledge, options.KnowledgeDatasources)
	}
	return options.Knowledge, nil
}

type Factory struct{}

func NewFactory() knowledgemodulehost.Factory { return Factory{} }

func (Factory) OpenModule(ctx context.Context, ref contract.ApplicationRef, host knowledgemodulehost.Host) (contract.ModuleBinding, error) {
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
	return &Binding{runtimeID: ref.RuntimeID, repository: repository, runtime: NewRuntime(repository)}, nil
}

type Binding struct {
	runtimeID  string
	repository *store.Store
	runtime    contract.Runtime
}

func (binding *Binding) Runtime() contract.Runtime { return binding.runtime }
func (binding *Binding) SubjectLifecycle(options contract.Options) lifecyclecontract.SubjectExecutionHandler {
	return store.NewSubjectLifecycle(binding.repository, binding.runtimeID, store.SubjectLifecycleOptions{
		ArtifactStorage: options.ArtifactStorage, DocumentStorage: options.DocumentStorage,
	})
}
func (*Binding) Close(context.Context) error { return nil }

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
