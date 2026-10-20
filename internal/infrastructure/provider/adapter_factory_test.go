package provider

import (
	connectorknowledge "github.com/domainry/domainry-connectors/providers/knowledge_base/http_api"
)

func newKnowledgeWithOfficialAdapter(config KnowledgeConfig) (*Knowledge, error) {
	return NewKnowledge(config, connectorknowledge.New)
}
