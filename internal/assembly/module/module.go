// Package module composes Knowledge capabilities behind its public contracts.
package module

import (
	"fmt"
	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
	"github.com/domainry/domainry-knowledge/contract"
	application "github.com/domainry/domainry-knowledge/internal/application/knowledge"
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
