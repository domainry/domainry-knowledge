package module

import (
	agentsdk "github.com/domainry/domainry-agent-sdk"
	knowledgeprovider "github.com/domainry/domainry-knowledge-sdk/provider"
	provider "github.com/domainry/domainry-knowledge/internal/infrastructure/provider"
)

type ProviderFactory struct{}

func NewProviderFactory() knowledgeprovider.Factory { return ProviderFactory{} }

func (ProviderFactory) NewSource(config knowledgeprovider.Config) (knowledgeprovider.Source, error) {
	return provider.NewKnowledge(config)
}

func (ProviderFactory) NewAttachmentSource(config knowledgeprovider.Config, runtimeID string) (agentsdk.ConversationAttachmentKnowledge, error) {
	return provider.NewAttachmentKnowledge(config, runtimeID)
}
