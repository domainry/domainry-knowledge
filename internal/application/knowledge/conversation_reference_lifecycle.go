package application

import (
	"context"
	"encoding/json"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-knowledge/contract"
)

type conversationReferenceLifecycleRepository interface {
	DeleteConversationReferencesForRequest(context.Context, string, string, agentsdk.ConversationAuthority) (json.RawMessage, error)
}

func (s *Service) DeleteConversationReferencesForRequest(ctx context.Context, requestID, conversationID string, a agentsdk.ConversationAuthority) (json.RawMessage, error) {
	if err := s.authorize(a); err != nil {
		return nil, err
	}
	repo, ok := s.repo.(conversationReferenceLifecycleRepository)
	if !ok {
		return nil, conversationFailure("unavailable", "reference_lifecycle_unavailable")
	}
	return repo.DeleteConversationReferencesForRequest(ctx, requestID, conversationID, a)
}

var _ contract.ConversationReferenceLifecycle = (*Service)(nil)
