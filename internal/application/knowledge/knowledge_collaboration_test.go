package application

import (
	"strings"
	"testing"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func TestValidateResolvedKnowledgePrincipalsRejectsDirectorySubstitution(t *testing.T) {
	tests := []struct {
		name       string
		principals []knowledgesdk.KnowledgePrincipal
	}{
		{name: "substituted", principals: []knowledgesdk.KnowledgePrincipal{{UserID: "mallory", DisplayName: "Mallory", Status: "active"}}},
		{name: "duplicate", principals: []knowledgesdk.KnowledgePrincipal{{UserID: "alice", DisplayName: "Alice", Status: "active"}, {UserID: "alice", DisplayName: "Alice 2", Status: "active"}}},
		{name: "malformed", principals: []knowledgesdk.KnowledgePrincipal{{UserID: "alice", Status: "active"}}},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			requested := []string{"alice"}
			if test.name == "duplicate" {
				requested = []string{"alice", "bob"}
			}
			if err := validateResolvedKnowledgePrincipals(requested, test.principals); err == nil || !strings.Contains(err.Error(), "principal_directory_invalid") {
				t.Fatalf("invalid directory result was accepted: principals=%+v err=%v", test.principals, err)
			}
		})
	}
	if err := validateResolvedKnowledgePrincipals([]string{"alice", "bob"}, []knowledgesdk.KnowledgePrincipal{
		{UserID: "bob", DisplayName: "Bob", Status: "inactive"},
		{UserID: "alice", DisplayName: "Alice", Status: "active"},
	}); err != nil {
		t.Fatalf("valid unordered resolution was rejected: %v", err)
	}
}

func TestValidateSearchedKnowledgePrincipalsRequiresActiveBoundedResults(t *testing.T) {
	valid := knowledgesdk.KnowledgePrincipalPage{Items: []knowledgesdk.KnowledgePrincipal{{UserID: "alice", DisplayName: "Alice", Status: "active"}}, Complete: true}
	if err := validateSearchedKnowledgePrincipals(valid, 20); err != nil {
		t.Fatal(err)
	}
	invalid := []knowledgesdk.KnowledgePrincipalPage{
		{Items: []knowledgesdk.KnowledgePrincipal{{UserID: "alice", DisplayName: "Alice", Status: "inactive"}}, Complete: true},
		{Items: []knowledgesdk.KnowledgePrincipal{{UserID: "alice", DisplayName: "Alice", Status: "active"}}, Complete: false},
		{Items: []knowledgesdk.KnowledgePrincipal{{UserID: "alice", DisplayName: "Alice", Status: "active"}}, NextAfter: "cursor", Complete: true},
	}
	for _, page := range invalid {
		if err := validateSearchedKnowledgePrincipals(page, 20); err == nil || !strings.Contains(err.Error(), "principal_directory_invalid") {
			t.Fatalf("unsafe principal search result was accepted: %+v err=%v", page, err)
		}
	}
}
