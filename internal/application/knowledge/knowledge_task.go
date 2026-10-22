package application

import (
	"context"
	"strconv"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func (s *Service) KnowledgePageTasks(ctx context.Context, libraryID, pageID string, a agentsdk.Authority) (knowledgesdk.KnowledgePageTaskPage, error) {
	_, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageTasksList, a)
	if err != nil {
		return knowledgesdk.KnowledgePageTaskPage{}, err
	}
	repository, ok := s.repo.(knowledgesdk.PageTaskService)
	if !ok {
		return knowledgesdk.KnowledgePageTaskPage{}, conversationFailure("unavailable", "page_tasks_unavailable")
	}
	result, err := repository.KnowledgePageTasks(ctx, libraryID, pageID, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageTasksList, a)
	}
	return result, err
}

func (s *Service) CreateKnowledgePageTask(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgePageTaskCreate, a agentsdk.Authority) (knowledgesdk.KnowledgePageTask, error) {
	_, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageTasksCreate, a)
	if err != nil {
		return knowledgesdk.KnowledgePageTask{}, err
	}
	repository, ok := s.repo.(knowledgesdk.PageTaskService)
	if !ok {
		return knowledgesdk.KnowledgePageTask{}, conversationFailure("unavailable", "page_tasks_unavailable")
	}
	result, err := repository.CreateKnowledgePageTask(ctx, libraryID, pageID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageTasksCreate, a)
	}
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPageTasksCreate, "knowledge.page_task.created", libraryID, pageID, result.ID, input.ClientID, result.Revision, nil, map[string]string{
			"source_block_id": result.SourceBlockID, "status": result.Status, "priority": result.Priority, "assignee_count": strconv.Itoa(len(result.AssigneeUserIDs)),
		}, a)
		err = s.publishKnowledgeTask(ctx, result, "knowledge.page_task.assigned", a)
	}
	return result, err
}

func (s *Service) UpdateKnowledgePageTask(ctx context.Context, libraryID, pageID, taskID string, input knowledgesdk.KnowledgePageTaskUpdate, a agentsdk.Authority) (knowledgesdk.KnowledgePageTask, error) {
	_, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageTasksUpdate, a)
	if err != nil {
		return knowledgesdk.KnowledgePageTask{}, err
	}
	repository, ok := s.repo.(knowledgesdk.PageTaskService)
	if !ok {
		return knowledgesdk.KnowledgePageTask{}, conversationFailure("unavailable", "page_tasks_unavailable")
	}
	result, err := repository.UpdateKnowledgePageTask(ctx, libraryID, pageID, taskID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageTasksUpdate, a)
	}
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPageTasksUpdate, "knowledge.page_task.updated", libraryID, pageID, result.ID, input.ClientID, result.Revision, map[string]string{
			"expected_revision": strconv.FormatInt(input.ExpectedRevision, 10),
		}, map[string]string{
			"status": result.Status, "priority": result.Priority, "assignee_count": strconv.Itoa(len(result.AssigneeUserIDs)),
		}, a)
		err = s.publishKnowledgeTask(ctx, result, "knowledge.page_task.updated", a)
	}
	return result, err
}
