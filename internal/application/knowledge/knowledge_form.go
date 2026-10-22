package application

import (
	"context"
	"strconv"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func (s *Service) formRepository() (knowledgesdk.PageFormService, error) {
	repository, ok := s.repo.(knowledgesdk.PageFormService)
	if !ok {
		return nil, conversationFailure("unavailable", "page_forms_unavailable")
	}
	return repository, nil
}

func (s *Service) SubmitKnowledgePageForm(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgeFormSubmit, a agentsdk.Authority) (knowledgesdk.KnowledgeFormSubmission, error) {
	if _, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageFormSubmit, a); err != nil {
		return knowledgesdk.KnowledgeFormSubmission{}, err
	}
	repository, err := s.formRepository()
	if err != nil {
		return knowledgesdk.KnowledgeFormSubmission{}, err
	}
	result, err := repository.SubmitKnowledgePageForm(ctx, libraryID, pageID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageFormSubmit, a)
	}
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPageFormSubmit, "knowledge.page_form.submitted", libraryID, pageID, result.ID, input.ClientID, result.PublishedVersion, nil, map[string]string{
			"published_version": strconv.FormatInt(result.PublishedVersion, 10), "answer_count": strconv.Itoa(len(result.Answers)),
		}, a)
	}
	return result, err
}

func (s *Service) KnowledgePageFormSubmissions(ctx context.Context, libraryID, pageID, before string, limit int, a agentsdk.Authority) (knowledgesdk.KnowledgeFormSubmissionPage, error) {
	if _, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageFormResponsesList, a); err != nil {
		return knowledgesdk.KnowledgeFormSubmissionPage{}, err
	}
	repository, err := s.formRepository()
	if err != nil {
		return knowledgesdk.KnowledgeFormSubmissionPage{}, err
	}
	result, err := repository.KnowledgePageFormSubmissions(ctx, libraryID, pageID, before, limit, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageFormResponsesList, a)
	}
	return result, err
}

func (s *Service) KnowledgePageFormAnalytics(ctx context.Context, libraryID, pageID string, a agentsdk.Authority) (knowledgesdk.KnowledgeFormAnalytics, error) {
	if _, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageFormAnalyticsGet, a); err != nil {
		return knowledgesdk.KnowledgeFormAnalytics{}, err
	}
	repository, err := s.formRepository()
	if err != nil {
		return knowledgesdk.KnowledgeFormAnalytics{}, err
	}
	result, err := repository.KnowledgePageFormAnalytics(ctx, libraryID, pageID, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageFormAnalyticsGet, a)
	}
	return result, err
}

func (s *Service) ExportKnowledgePageFormSubmissions(ctx context.Context, libraryID, pageID string, a agentsdk.Authority) (knowledgesdk.KnowledgeFormExport, error) {
	decision, err := s.AuthorizeKnowledgePageContentOperation(ctx, libraryID, pageID, knowledgesdk.KnowledgePageContentOperationExport, a)
	if err != nil {
		return knowledgesdk.KnowledgeFormExport{}, err
	}
	if _, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageFormResponsesExport, a); err != nil {
		return knowledgesdk.KnowledgeFormExport{}, err
	}
	repository, err := s.formRepository()
	if err != nil {
		return knowledgesdk.KnowledgeFormExport{}, err
	}
	result, err := repository.ExportKnowledgePageFormSubmissions(ctx, libraryID, pageID, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageFormResponsesExport, a)
	}
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageExport, a)
	}
	if err == nil {
		contentPolicy, ok := s.repo.(knowledgesdk.KnowledgePageContentPolicyRepository)
		if !ok {
			err = conversationFailure("unavailable", "page_content_policy_unavailable")
		} else if current, checkErr := contentPolicy.EvaluateKnowledgePageContentPolicy(ctx, libraryID, pageID, knowledgesdk.KnowledgePageContentOperationExport, a); checkErr != nil {
			err = checkErr
		} else if !current.Allowed || current.SourcePageID != decision.SourcePageID || current.Revision != decision.Revision {
			err = conversationFailure("forbidden", "page_content_operation_denied")
		}
	}
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPageFormResponsesExport, "knowledge.page_form.responses_exported", libraryID, pageID, pageID, "export:"+pageID, 0, nil, map[string]string{"content_type": result.ContentType}, a)
	}
	return result, err
}
