package module

import (
	"testing"

	sdk "github.com/domainry/domainry-knowledge-sdk"
	application "github.com/domainry/domainry-knowledge/internal/application/knowledge"
)

func TestSupervisedBindingKeepsOwnerLocalDocumentSnapshotCapability(t *testing.T) {
	service := newSupervisedService(&application.Service{})
	if _, ok := service.(sdk.KnowledgeDocumentSnapshotService); !ok {
		t.Fatal("composition erased the optional managed-document snapshot capability")
	}
}
