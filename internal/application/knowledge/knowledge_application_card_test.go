package application

import (
	"context"
	"testing"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

type applicationCardProvider struct{ calls int }

func (*applicationCardProvider) Key() string { return "work-apps" }
func (*applicationCardProvider) Kinds() []string {
	return []string{knowledgesdk.KnowledgeApplicationCardTask}
}
func (provider *applicationCardProvider) ResolveKnowledgeApplicationCard(_ context.Context, input knowledgesdk.KnowledgeApplicationCardProviderInput) (knowledgesdk.KnowledgeApplicationCard, error) {
	provider.calls++
	return knowledgesdk.KnowledgeApplicationCard{Title: "当前任务", Status: "open", URL: "https://tasks.example.org/" + input.ResourceID}, nil
}

func TestKnowledgeApplicationCardRechecksPageAccessAfterProvider(t *testing.T) {
	authority := knowledgesdk.Authority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "alice"}
	repository := &pageAuthorizationRepository{
		library: knowledgesdk.KnowledgeLibrary{ID: "klib_test", Role: "reader"},
		page:    knowledgesdk.KnowledgePageView{Page: knowledgesdk.KnowledgePage{ID: "kpage_test", LibraryID: "klib_test", State: "active"}},
	}
	policy := &pageAuthorizationPolicy{denyAt: 2}
	provider := &applicationCardProvider{}
	service := NewService(repository, "runtime", Options{LibraryAuthorizer: policy, ApplicationCardProviders: []knowledgesdk.KnowledgeApplicationCardProvider{provider}}, nil)

	_, err := service.ResolveKnowledgeApplicationCard(t.Context(), "klib_test", "kpage_test", knowledgesdk.KnowledgeApplicationCardResolve{Provider: "work-apps", Kind: knowledgesdk.KnowledgeApplicationCardTask, ResourceID: "TASK-1"}, authority)
	if err == nil || provider.calls != 1 {
		t.Fatalf("revoked application card must fail after provider: calls=%d err=%v", provider.calls, err)
	}
	if len(policy.actions) != 2 || policy.actions[0] != knowledgesdk.ActionApplicationCardsResolve || policy.actions[1] != knowledgesdk.ActionApplicationCardsResolve {
		t.Fatalf("application card did not recheck exact action: %v", policy.actions)
	}
}
