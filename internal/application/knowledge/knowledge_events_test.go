package application

import (
	"context"
	"errors"
	"reflect"
	"testing"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/contract"
)

type knowledgeEventSink struct {
	audits        []knowledgesdk.KnowledgeGovernanceEvent
	collaboration []knowledgesdk.KnowledgeCollaborationEvent
	err           error
}

func (s *knowledgeEventSink) AppendKnowledgeAudit(_ context.Context, event knowledgesdk.KnowledgeGovernanceEvent) error {
	s.audits = append(s.audits, event)
	return s.err
}

func (s *knowledgeEventSink) PublishKnowledgeCollaboration(_ context.Context, event knowledgesdk.KnowledgeCollaborationEvent) error {
	s.collaboration = append(s.collaboration, event)
	return s.err
}

func TestKnowledgeEventsAreStableMinimalAndBestEffort(t *testing.T) {
	sink := &knowledgeEventSink{err: errors.New("sink unavailable")}
	service := &Service{options: contract.Options{AuditAppender: sink, CollaborationPublisher: sink}}
	authority := agentsdk.Authority{Known: true, RuntimeID: "runtime-a", WorkspaceID: "workspace-a", UserID: "user-a"}

	service.appendKnowledgeAudit(t.Context(), knowledgesdk.ActionPagesPublish, "knowledge.page.published", "library-a", "page-a", "page-a", "publish-1", 3, nil, map[string]string{"content_sha256": "sha256"}, authority)
	service.appendKnowledgeAudit(t.Context(), knowledgesdk.ActionPagesPublish, "knowledge.page.published", "library-a", "page-a", "page-a", "publish-1", 3, nil, map[string]string{"content_sha256": "sha256"}, authority)
	if len(sink.audits) != 2 || sink.audits[0].ID != sink.audits[1].ID {
		t.Fatalf("audit IDs are not stable: %#v", sink.audits)
	}
	if sink.audits[0].Family != knowledgesdk.KnowledgeAuditEventFamily || sink.audits[0].Actor != authority || !reflect.DeepEqual(sink.audits[0].After, map[string]string{"content_sha256": "sha256"}) {
		t.Fatalf("unexpected audit event: %#v", sink.audits[0])
	}

	comment := knowledgesdk.KnowledgePageComment{ID: "comment-a", LibraryID: "library-a", PageID: "page-a", PublishedVersion: 3, Revision: 2, MentionedUserIDs: []string{"user-b", "user-c"}, Body: "this must not be published"}
	service.publishKnowledgeMentions(t.Context(), comment, authority)
	service.publishKnowledgeMentions(t.Context(), comment, authority)
	if len(sink.collaboration) != 2 || sink.collaboration[0].ID != sink.collaboration[1].ID {
		t.Fatalf("collaboration IDs are not stable: %#v", sink.collaboration)
	}
	if !reflect.DeepEqual(sink.collaboration[0].RecipientUserIDs, comment.MentionedUserIDs) || sink.collaboration[0].CommentID != comment.ID {
		t.Fatalf("unexpected collaboration event: %#v", sink.collaboration[0])
	}
}
