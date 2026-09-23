// Package module composes Knowledge capabilities behind its public contracts.
package module

import (
	"fmt"
	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
	sharedartifact "github.com/domainry/domainry-foundation/artifact"
	"github.com/domainry/domainry-knowledge/contract"
	application "github.com/domainry/domainry-knowledge/internal/application/knowledge"
	store "github.com/domainry/domainry-knowledge/internal/infrastructure/persistence/database/knowledge"
	lifecyclecontract "github.com/domainry/domainry-lifecycle-sdk/contract"
)

type Factory struct{}

func NewFactory() contract.Factory { return Factory{} }
func (Factory) Validate(repo any, options *contract.Options) error {
	return application.ValidateOptions(repo, options)
}
func (Factory) Activate(repo any, runtime string, options contract.Options) error {
	return application.ActivateDocumentSources(repo, runtime, options)
}
func (Factory) NewService(repo any, runtime string, options contract.Options) contract.Service {
	return application.NewService(repo, runtime, options)
}
func (Factory) Prepare(repo any, runtime string, options contract.Options) (contract.ConversationKnowledge, error) {
	if documents, ok := repo.(persistence.KnowledgeSourceRegistry); ok && options.Knowledge != nil {
		if source, ok := options.Knowledge.(agentsdk.ManagedKnowledgeDocumentSource); ok {
			if _, ok := options.Knowledge.(agentsdk.ConversationKnowledgeSource); !ok {
				return nil, fmt.Errorf("managed document source requires knowledge revalidation")
			}
			options.Knowledge = application.GuardManagedKnowledge(options.Knowledge, source, documents)
		}
	}
	if len(options.LibraryKnowledge) > 0 || options.KnowledgeDatasources != nil {
		return application.NewLibraryKnowledgeSource(repo, runtime, options.LibraryAuthorizer, options.LibraryKnowledge, options.Knowledge, options.KnowledgeDatasources)
	}
	return options.Knowledge, nil
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
