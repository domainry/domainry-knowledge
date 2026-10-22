package application

import (
	"context"
	"errors"
	"strconv"
	"time"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

const knowledgeAILeaseDuration = 2 * time.Minute

func (s *Service) aiAccess(ctx context.Context, libraryID, pageID, action string, authority knowledgesdk.Authority) (knowledgesdk.KnowledgeAIRepository, error) {
	if _, _, err := s.pageItemAccess(ctx, libraryID, pageID, action, authority); err != nil {
		return nil, err
	}
	repository, ok := s.repo.(knowledgesdk.KnowledgeAIRepository)
	if !ok {
		return nil, conversationFailure("unavailable", "ai_executions_unavailable")
	}
	return repository, nil
}

func (s *Service) CreateKnowledgeAIExecution(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgeAIExecutionCreate, authority knowledgesdk.Authority) (knowledgesdk.KnowledgeAIExecution, error) {
	repository, err := s.aiAccess(ctx, libraryID, pageID, knowledgesdk.ActionAIExecutionsCreate, authority)
	if err != nil {
		return knowledgesdk.KnowledgeAIExecution{}, err
	}
	if s.options.AIProvider == nil || s.options.AccessExplainer == nil {
		return knowledgesdk.KnowledgeAIExecution{}, conversationFailure("unavailable", "ai_provider_unavailable")
	}
	result, err := repository.CreateKnowledgeAIExecution(ctx, libraryID, pageID, input, authority)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionAIExecutionsCreate, authority)
	}
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionAIExecutionsCreate, "knowledge.ai_execution.created", libraryID, pageID, result.ID, input.ClientID, result.Revision, nil, map[string]string{
			"operation": result.Operation, "source_scope": result.Source.Scope, "source_version": strconv.FormatInt(result.Source.Version, 10), "source_draft_revision": strconv.FormatInt(result.Source.DraftRevision, 10), "source_sha256": result.Source.ContentSHA256,
		}, authority)
		s.WakeKnowledgeAI()
	}
	return result, err
}

func (s *Service) KnowledgeAIExecution(ctx context.Context, libraryID, pageID, executionID string, authority knowledgesdk.Authority) (knowledgesdk.KnowledgeAIExecution, error) {
	repository, err := s.aiAccess(ctx, libraryID, pageID, knowledgesdk.ActionAIExecutionsGet, authority)
	if err != nil {
		return knowledgesdk.KnowledgeAIExecution{}, err
	}
	result, err := repository.KnowledgeAIExecution(ctx, libraryID, pageID, executionID, authority)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionAIExecutionsGet, authority)
	}
	return result, err
}

func (s *Service) ConfirmKnowledgeAIExecution(ctx context.Context, libraryID, pageID, executionID string, input knowledgesdk.KnowledgeAIExecutionConfirm, authority knowledgesdk.Authority) (knowledgesdk.KnowledgeAIExecution, error) {
	repository, err := s.aiAccess(ctx, libraryID, pageID, knowledgesdk.ActionAIExecutionsConfirm, authority)
	if err != nil {
		return knowledgesdk.KnowledgeAIExecution{}, err
	}
	result, err := repository.ConfirmKnowledgeAIExecution(ctx, libraryID, pageID, executionID, input, authority)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionAIExecutionsConfirm, authority)
	}
	if err == nil {
		// Prompt and generated text are intentionally excluded from audit.
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionAIExecutionsConfirm, "knowledge.ai_execution.confirmed", libraryID, pageID, result.ID, input.ClientID, result.Revision, map[string]string{
			"expected_revision": strconv.FormatInt(input.ExpectedRevision, 10),
		}, map[string]string{
			"operation": result.Operation, "source_scope": result.Source.Scope, "source_sha256": result.Source.ContentSHA256,
		}, authority)
	}
	return result, err
}

func (s *Service) WakeKnowledgeAI() {
	select {
	case s.aiWake <- struct{}{}:
	default:
	}
}

func (s *Service) AIWorkerEnabled() bool {
	_, ok := s.repo.(knowledgesdk.KnowledgeAIRepository)
	return ok && s.options.AIProvider != nil && s.options.AccessExplainer != nil
}

func (s *Service) AIWorkerInterval() time.Duration  { return s.options.AIPoll }
func (s *Service) AIWorkerWakeups() <-chan struct{} { return s.aiWake }

func knowledgeAIErrorCode(err error) string {
	var classified *knowledgesdk.Error
	if errors.As(err, &classified) {
		if classified.Code == "knowledge.ai_execution_source_changed" {
			return "source_changed"
		}
		if classified.Class == knowledgesdk.ErrorClassForbidden || classified.Class == knowledgesdk.ErrorClassNotFound {
			return "authorization_revoked"
		}
	}
	return "source_unavailable"
}

func (s *Service) resolveKnowledgeAIAuthority(ctx context.Context, work knowledgesdk.KnowledgeAIExecutionWork) (knowledgesdk.Authority, error) {
	authority, err := s.options.AccessExplainer.ResolveKnowledgeAccessAuthority(ctx, work.Authority.UserID, work.Authority)
	if err != nil {
		return knowledgesdk.Authority{}, err
	}
	if err = s.authorize(authority); err != nil || authority.RuntimeID != work.Authority.RuntimeID || authority.WorkspaceID != work.Authority.WorkspaceID || authority.UserID != work.Authority.UserID {
		return knowledgesdk.Authority{}, conversationFailure("forbidden", "ai_execution_authority_revoked")
	}
	if err = s.recheckPageItemAction(ctx, work.Execution.LibraryID, work.Execution.PageID, knowledgesdk.ActionAIExecutionsCreate, authority); err != nil {
		return knowledgesdk.Authority{}, err
	}
	return authority, nil
}

func (s *Service) KnowledgeAIWorkerTick(ctx context.Context) (WorkerTickResult, error) {
	repository, ok := s.repo.(knowledgesdk.KnowledgeAIRepository)
	if !ok || s.options.AIProvider == nil || s.options.AccessExplainer == nil {
		return WorkerTickResult{}, nil
	}
	work, claimed, err := repository.ClaimKnowledgeAIExecution(ctx, s.runtimeID, time.Now().UTC(), knowledgeAILeaseDuration)
	if err != nil || !claimed {
		return WorkerTickResult{}, err
	}
	result := knowledgesdk.KnowledgeAIGenerationResult{}
	errorCode := ""
	authority, processingErr := s.resolveKnowledgeAIAuthority(ctx, work)
	var input knowledgesdk.KnowledgeAIGenerationInput
	if processingErr == nil {
		input, processingErr = repository.ReadKnowledgeAIExecutionSource(ctx, work, authority)
	}
	if processingErr == nil {
		result, processingErr = s.options.AIProvider.GenerateKnowledgeAI(ctx, input)
		if processingErr != nil {
			errorCode = "provider_unavailable"
		}
	}
	if processingErr == nil {
		// A provider call can be long-running. Resolve Identity and page ACL again,
		// then re-read the frozen source before making its result confirmable.
		authority, processingErr = s.resolveKnowledgeAIAuthority(ctx, work)
		if processingErr == nil {
			var current knowledgesdk.KnowledgeAIGenerationInput
			current, processingErr = repository.ReadKnowledgeAIExecutionSource(ctx, work, authority)
			if processingErr == nil && (current.Source.ContentSHA256 != input.Source.ContentSHA256 || current.Source.Version != input.Source.Version || current.Source.DraftRevision != input.Source.DraftRevision) {
				processingErr = conversationFailure("conflict", "ai_execution_source_changed")
			}
		}
	}
	if processingErr != nil && errorCode == "" {
		errorCode = knowledgeAIErrorCode(processingErr)
	}
	finish, cancel := context.WithTimeout(context.WithoutCancel(ctx), 5*time.Second)
	defer cancel()
	if completeErr := repository.CompleteKnowledgeAIExecution(finish, work, result, errorCode); completeErr != nil {
		return WorkerTickResult{Worked: true, ProcessedCount: 1}, completeErr
	}
	return WorkerTickResult{Worked: true, ProcessedCount: 1}, nil
}
