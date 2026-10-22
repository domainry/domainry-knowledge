package application

import (
	"context"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func (s *Service) ResolveKnowledgeAgentReference(ctx context.Context, reference knowledgesdk.KnowledgeAgentReference, authority knowledgesdk.Authority) (knowledgesdk.KnowledgeAgentResolvedReference, error) {
	if reference.LibraryID == "" || reference.PageID == "" {
		return knowledgesdk.KnowledgeAgentResolvedReference{}, conversationFailure("bad_request", "agent_reference_invalid")
	}
	if _, _, err := s.pageItemAccess(ctx, reference.LibraryID, reference.PageID, knowledgesdk.ActionAgentReferencesResolve, authority); err != nil {
		return knowledgesdk.KnowledgeAgentResolvedReference{}, err
	}
	repository, ok := s.repo.(knowledgesdk.KnowledgeAgentReferenceRepository)
	if !ok {
		return knowledgesdk.KnowledgeAgentResolvedReference{}, conversationFailure("unavailable", "agent_references_unavailable")
	}
	result, err := repository.ResolveKnowledgeAgentReference(ctx, reference, authority)
	if err == nil {
		err = s.recheckPageItemAction(ctx, reference.LibraryID, reference.PageID, knowledgesdk.ActionAgentReferencesResolve, authority)
	}
	return result, err
}
