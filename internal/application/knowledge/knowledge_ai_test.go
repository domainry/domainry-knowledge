package application

import (
	"context"
	"testing"
	"time"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

type aiWorkerRepository struct {
	*pageAuthorizationRepository
	work          knowledgesdk.KnowledgeAIExecutionWork
	claimed       bool
	readCount     int
	completed     bool
	completedCode string
	completedText string
}

func (*aiWorkerRepository) CreateKnowledgeAIExecution(context.Context, string, string, knowledgesdk.KnowledgeAIExecutionCreate, knowledgesdk.Authority) (knowledgesdk.KnowledgeAIExecution, error) {
	return knowledgesdk.KnowledgeAIExecution{}, nil
}

func (*aiWorkerRepository) KnowledgeAIExecution(context.Context, string, string, string, knowledgesdk.Authority) (knowledgesdk.KnowledgeAIExecution, error) {
	return knowledgesdk.KnowledgeAIExecution{}, nil
}

func (*aiWorkerRepository) ConfirmKnowledgeAIExecution(context.Context, string, string, string, knowledgesdk.KnowledgeAIExecutionConfirm, knowledgesdk.Authority) (knowledgesdk.KnowledgeAIExecution, error) {
	return knowledgesdk.KnowledgeAIExecution{}, nil
}

func (repository *aiWorkerRepository) ClaimKnowledgeAIExecution(context.Context, string, time.Time, time.Duration) (knowledgesdk.KnowledgeAIExecutionWork, bool, error) {
	if repository.claimed {
		return knowledgesdk.KnowledgeAIExecutionWork{}, false, nil
	}
	repository.claimed = true
	return repository.work, true, nil
}

func (repository *aiWorkerRepository) ReadKnowledgeAIExecutionSource(context.Context, knowledgesdk.KnowledgeAIExecutionWork, knowledgesdk.Authority) (knowledgesdk.KnowledgeAIGenerationInput, error) {
	repository.readCount++
	return knowledgesdk.KnowledgeAIGenerationInput{ExecutionID: repository.work.Execution.ID, Source: repository.work.Execution.Source, SourceText: "只读来源"}, nil
}

func (repository *aiWorkerRepository) CompleteKnowledgeAIExecution(_ context.Context, _ knowledgesdk.KnowledgeAIExecutionWork, result knowledgesdk.KnowledgeAIGenerationResult, code string) error {
	repository.completed = true
	repository.completedCode = code
	repository.completedText = result.Text
	return nil
}

type aiTestProvider struct{ calls int }

func (provider *aiTestProvider) GenerateKnowledgeAI(_ context.Context, _ knowledgesdk.KnowledgeAIGenerationInput) (knowledgesdk.KnowledgeAIGenerationResult, error) {
	provider.calls++
	return knowledgesdk.KnowledgeAIGenerationResult{Text: "模型生成结果", Provider: "fake", Model: "test"}, nil
}

func TestKnowledgeAIWorkerRechecksAuthorizationAfterProviderAndRejectsResult(t *testing.T) {
	authority := knowledgesdk.Authority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "alice"}
	base := &pageAuthorizationRepository{
		library: knowledgesdk.KnowledgeLibrary{ID: "klib_test", Role: "reader"},
		page:    knowledgesdk.KnowledgePageView{Page: knowledgesdk.KnowledgePage{ID: "kpage_test", LibraryID: "klib_test", State: "active"}},
	}
	repository := &aiWorkerRepository{pageAuthorizationRepository: base, work: knowledgesdk.KnowledgeAIExecutionWork{
		ScopeKey: "scope", Authority: authority, Fence: 1,
		Execution: knowledgesdk.KnowledgeAIExecution{ID: "kai_test", LibraryID: "klib_test", PageID: "kpage_test", Operation: knowledgesdk.KnowledgeAIOperationSummarize, Source: knowledgesdk.KnowledgeAISource{Scope: knowledgesdk.KnowledgeAISourcePublished, Version: 1, ContentSHA256: "hash"}},
	}}
	policy := &pageAuthorizationPolicy{denyAt: 2}
	provider := &aiTestProvider{}
	service := NewService(repository, "runtime", Options{LibraryAuthorizer: policy, AccessExplainer: &pageIdentityAccessExplainer{}, AIProvider: provider}, nil)

	result, err := service.KnowledgeAIWorkerTick(t.Context())
	if err != nil || !result.Worked || result.ProcessedCount != 1 {
		t.Fatalf("AI worker tick failed: result=%+v err=%v", result, err)
	}
	if provider.calls != 1 || repository.readCount != 1 {
		t.Fatalf("AI worker call sequence invalid: provider=%d reads=%d", provider.calls, repository.readCount)
	}
	if !repository.completed || repository.completedCode != "authorization_revoked" || repository.completedText != "模型生成结果" {
		t.Fatalf("revoked AI result became confirmable: completed=%v code=%q text=%q", repository.completed, repository.completedCode, repository.completedText)
	}
	if len(policy.actions) != 2 || policy.actions[0] != knowledgesdk.ActionAIExecutionsCreate || policy.actions[1] != knowledgesdk.ActionAIExecutionsCreate {
		t.Fatalf("AI worker did not recheck the exact action: %v", policy.actions)
	}
}
