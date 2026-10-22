package application

import (
	"context"
	"strconv"
	"time"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func (s *Service) appendKnowledgeAudit(ctx context.Context, action, eventType, libraryID, pageID, resourceID, clientID string, version int64, before, after map[string]string, authority agentsdk.Authority) {
	if s.options.AuditAppender == nil {
		return
	}
	stable := clientID
	if stable == "" {
		stable = resourceID + ":" + strconv.FormatInt(version, 10)
	}
	event := knowledgesdk.KnowledgeGovernanceEvent{
		ID: knowledgesdk.StableKnowledgeEventID(authority.WorkspaceID, action, libraryID, pageID, stable), Family: knowledgesdk.KnowledgeAuditEventFamily,
		Type: eventType, Action: action, Actor: authority, LibraryID: libraryID, PageID: pageID, Version: version,
		ResourceID: resourceID, ClientID: clientID, Before: before, After: after, OccurredAt: time.Now().UTC(),
	}
	writeContext, cancel := context.WithTimeout(context.WithoutCancel(ctx), 2*time.Second)
	defer cancel()
	if err := s.options.AuditAppender.AppendKnowledgeAudit(writeContext, event); err != nil && s.failures != nil {
		s.failures.RecordFailure(ctx, "knowledge_audit_append_failed", err, Failure{Stage: "audit_append", Dependency: "audit"})
	}
}

func (s *Service) appendKnowledgeWebhook(ctx context.Context, eventType, action, libraryID, pageID, resourceID string, version int64, authority agentsdk.Authority) error {
	repository, ok := s.repo.(knowledgesdk.KnowledgeWebhookRepository)
	if !ok {
		return nil
	}
	eventID, err := knowledgesdk.DeriveKnowledgeEntityID("kwhevt", "knowledge.webhook_event", conversationDigest([]string{authority.RuntimeID, authority.WorkspaceID, eventType, libraryID, pageID, resourceID, strconv.FormatInt(version, 10)}))
	if err != nil {
		return err
	}
	event := knowledgesdk.KnowledgeWebhookEvent{
		ID:   eventID,
		Type: eventType, Action: action, WorkspaceID: authority.WorkspaceID, LibraryID: libraryID, PageID: pageID,
		ResourceID: resourceID, Version: version, ActorUserID: authority.UserID, OccurredAt: time.Now().UTC(), Authority: authority,
	}
	writeContext, cancel := context.WithTimeout(context.WithoutCancel(ctx), 5*time.Second)
	defer cancel()
	if err := repository.AppendKnowledgeWebhookEvent(writeContext, event); err != nil {
		if s.failures != nil {
			s.failures.RecordFailure(ctx, "knowledge_webhook_append_failed", err, Failure{Stage: "webhook_append", Dependency: "database", Retryable: true})
		}
		return err
	}
	s.WakeKnowledgeWebhooks()
	return nil
}

func (s *Service) publishKnowledgeMentions(ctx context.Context, comment knowledgesdk.KnowledgePageComment, authority agentsdk.Authority) error {
	if len(comment.MentionedUserIDs) == 0 {
		return nil
	}
	webhookErr := s.appendKnowledgeWebhook(ctx, knowledgesdk.KnowledgeWebhookCommentMentioned, knowledgesdk.ActionPageCommentsList, comment.LibraryID, comment.PageID, comment.ID, comment.Revision, authority)
	if s.options.CollaborationPublisher == nil {
		return webhookErr
	}
	event := knowledgesdk.KnowledgeCollaborationEvent{
		ID:   knowledgesdk.StableKnowledgeEventID(authority.WorkspaceID, "comment_mentioned", comment.LibraryID, comment.PageID, comment.ID, strconv.FormatInt(comment.Revision, 10)),
		Type: "knowledge.page_comment.mentioned", Actor: authority, LibraryID: comment.LibraryID, PageID: comment.PageID,
		Version: comment.PublishedVersion, CommentID: comment.ID, RecipientUserIDs: append([]string(nil), comment.MentionedUserIDs...), OccurredAt: time.Now().UTC(),
	}
	writeContext, cancel := context.WithTimeout(context.WithoutCancel(ctx), 2*time.Second)
	defer cancel()
	if err := s.options.CollaborationPublisher.PublishKnowledgeCollaboration(writeContext, event); err != nil && s.failures != nil {
		s.failures.RecordFailure(ctx, "knowledge_collaboration_publish_failed", err, Failure{Stage: "collaboration_publish", Dependency: "collaboration"})
	}
	return webhookErr
}

func (s *Service) publishKnowledgeSuggestion(ctx context.Context, suggestion knowledgesdk.KnowledgePageSuggestion, authority agentsdk.Authority) {
	if s.options.CollaborationPublisher == nil || len(suggestion.MentionedUserIDs) == 0 {
		return
	}
	event := knowledgesdk.KnowledgeCollaborationEvent{
		ID:   knowledgesdk.StableKnowledgeEventID(authority.WorkspaceID, "suggestion_mentioned", suggestion.LibraryID, suggestion.PageID, suggestion.ID, strconv.FormatInt(suggestion.Revision, 10)),
		Type: "knowledge.page_suggestion.mentioned", Actor: authority, LibraryID: suggestion.LibraryID, PageID: suggestion.PageID,
		Version: suggestion.Revision, SuggestionID: suggestion.ID, RecipientUserIDs: append([]string(nil), suggestion.MentionedUserIDs...), OccurredAt: time.Now().UTC(),
	}
	writeContext, cancel := context.WithTimeout(context.WithoutCancel(ctx), 2*time.Second)
	defer cancel()
	if err := s.options.CollaborationPublisher.PublishKnowledgeCollaboration(writeContext, event); err != nil && s.failures != nil {
		s.failures.RecordFailure(ctx, "knowledge_suggestion_publish_failed", err, Failure{Stage: "suggestion_publish", Dependency: "collaboration"})
	}
}

func (s *Service) publishKnowledgeTask(ctx context.Context, task knowledgesdk.KnowledgePageTask, eventType string, authority agentsdk.Authority) error {
	webhookErr := s.appendKnowledgeWebhook(ctx, knowledgesdk.KnowledgeWebhookTaskChanged, knowledgesdk.ActionPageTasksList, task.LibraryID, task.PageID, task.ID, task.Revision, authority)
	if s.options.CollaborationPublisher == nil || len(task.AssigneeUserIDs) == 0 {
		return webhookErr
	}
	event := knowledgesdk.KnowledgeCollaborationEvent{
		ID:   knowledgesdk.StableKnowledgeEventID(authority.WorkspaceID, eventType, task.LibraryID, task.PageID, task.ID, strconv.FormatInt(task.Revision, 10)),
		Type: eventType, Actor: authority, LibraryID: task.LibraryID, PageID: task.PageID, TaskID: task.ID,
		Version: task.Revision, RecipientUserIDs: append([]string(nil), task.AssigneeUserIDs...), OccurredAt: time.Now().UTC(),
	}
	writeContext, cancel := context.WithTimeout(context.WithoutCancel(ctx), 2*time.Second)
	defer cancel()
	if err := s.options.CollaborationPublisher.PublishKnowledgeCollaboration(writeContext, event); err != nil && s.failures != nil {
		s.failures.RecordFailure(ctx, "knowledge_task_publish_failed", err, Failure{Stage: "task_publish", Dependency: "collaboration"})
	}
	return webhookErr
}
