package module

import (
	knowledgeprovider "github.com/domainry/domainry-knowledge-sdk/provider"
	provider "github.com/domainry/domainry-knowledge/internal/infrastructure/provider"
)

type ProviderFactory struct {
	adapterFactory knowledgeprovider.AdapterFactory
}

func NewProviderFactory(adapterFactory knowledgeprovider.AdapterFactory) knowledgeprovider.Factory {
	return ProviderFactory{adapterFactory: adapterFactory}
}

func (factory ProviderFactory) NewSource(config knowledgeprovider.Config) (knowledgeprovider.Source, error) {
	return provider.NewKnowledge(config, factory.adapterFactory)
}
