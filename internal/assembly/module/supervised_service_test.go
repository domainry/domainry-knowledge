package module

import (
	"testing"

	knowledgecontract "github.com/domainry/domainry-knowledge-sdk/contract"
	application "github.com/domainry/domainry-knowledge/internal/application/knowledge"
)

func TestSupervisedServicePreservesOptionalKnowledgePorts(t *testing.T) {
	service := newSupervisedService(application.NewService(nil, "runtime-test", application.Options{}))
	t.Cleanup(service.Close)
	if _, ok := service.(knowledgecontract.ConversationReferenceLifecycle); !ok {
		t.Fatal("supervisor wrapper hid ConversationReferenceLifecycle")
	}
	if _, ok := service.(knowledgecontract.ArtifactExportReader); !ok {
		t.Fatal("supervisor wrapper hid ArtifactExportReader")
	}
}
