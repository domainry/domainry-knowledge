package application

import (
	"context"
	"strings"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func (s *Service) ResolveKnowledgeApplicationCard(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgeApplicationCardResolve, authority knowledgesdk.Authority) (knowledgesdk.KnowledgeApplicationCard, error) {
	if strings.TrimSpace(input.Provider) == "" || strings.TrimSpace(input.Kind) == "" || strings.TrimSpace(input.ResourceID) == "" {
		return knowledgesdk.KnowledgeApplicationCard{}, conversationFailure("bad_request", "application_card_reference_invalid")
	}
	if _, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionApplicationCardsResolve, authority); err != nil {
		return knowledgesdk.KnowledgeApplicationCard{}, err
	}
	if s.applicationCards == nil || len(s.applicationCards.Providers()) == 0 {
		return knowledgesdk.KnowledgeApplicationCard{}, conversationFailure("unavailable", "application_cards_unavailable")
	}
	card, err := s.applicationCards.Resolve(ctx, input, libraryID, pageID, authority)
	if err != nil {
		return knowledgesdk.KnowledgeApplicationCard{}, conversationFailure("unavailable", "application_card_unavailable")
	}
	if err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionApplicationCardsResolve, authority); err != nil {
		return knowledgesdk.KnowledgeApplicationCard{}, err
	}
	return card, nil
}
