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

func (s *Service) publishKnowledgeMentions(ctx context.Context, comment knowledgesdk.KnowledgePageComment, authority agentsdk.Authority) {
	if s.options.CollaborationPublisher == nil || len(comment.MentionedUserIDs) == 0 {
		return
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
}
