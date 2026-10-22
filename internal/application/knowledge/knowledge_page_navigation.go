package application

import (
	"context"
	"strconv"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func (s *Service) pageNavigation() (knowledgesdk.KnowledgePageNavigationService, error) {
	value, ok := s.repo.(knowledgesdk.KnowledgePageNavigationService)
	if !ok {
		return nil, conversationFailure("unavailable", "page_navigation_unavailable")
	}
	return value, nil
}

func (s *Service) KnowledgePagePersonalState(ctx context.Context, libraryID, pageID string, a agentsdk.Authority) (knowledgesdk.KnowledgePagePersonalState, error) {
	if _, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPagePersonalStateGet, a); err != nil {
		return knowledgesdk.KnowledgePagePersonalState{}, err
	}
	repository, err := s.pageNavigation()
	if err != nil {
		return knowledgesdk.KnowledgePagePersonalState{}, err
	}
	result, err := repository.KnowledgePagePersonalState(ctx, libraryID, pageID, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPagePersonalStateGet, a)
	}
	return result, err
}

func (s *Service) SetKnowledgePagePersonalState(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgePagePersonalStateWrite, a agentsdk.Authority) (knowledgesdk.KnowledgePagePersonalState, error) {
	if _, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPagePersonalStateSet, a); err != nil {
		return knowledgesdk.KnowledgePagePersonalState{}, err
	}
	repository, err := s.pageNavigation()
	if err != nil {
		return knowledgesdk.KnowledgePagePersonalState{}, err
	}
	result, err := repository.SetKnowledgePagePersonalState(ctx, libraryID, pageID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPagePersonalStateSet, a)
	}
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPagePersonalStateSet, "knowledge.page.personal_state_set", libraryID, pageID, pageID, input.ClientID, result.Revision, map[string]string{
			"expected_revision": strconv.FormatInt(input.ExpectedRevision, 10),
		}, map[string]string{
			"favorite": strconv.FormatBool(result.Favorite), "subscribed": strconv.FormatBool(result.Subscribed), "shortcut": strconv.FormatBool(result.ShortcutRank != ""),
		}, a)
	}
	return result, err
}

func (s *Service) RecordKnowledgePageView(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgePageViewRecord, a agentsdk.Authority) (knowledgesdk.KnowledgePagePersonalState, error) {
	if _, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageViewRecord, a); err != nil {
		return knowledgesdk.KnowledgePagePersonalState{}, err
	}
	repository, err := s.pageNavigation()
	if err != nil {
		return knowledgesdk.KnowledgePagePersonalState{}, err
	}
	result, err := repository.RecordKnowledgePageView(ctx, libraryID, pageID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageViewRecord, a)
	}
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPageViewRecord, "knowledge.page.viewed", libraryID, pageID, pageID, input.ClientID, result.Revision, nil, map[string]string{
			"authorized": "true",
		}, a)
	}
	return result, err
}

func (s *Service) KnowledgePageCollection(ctx context.Context, libraryID string, kind knowledgesdk.KnowledgePageCollectionKind, after string, limit int, a agentsdk.Authority) (knowledgesdk.KnowledgePageCollectionPage, error) {
	if _, _, err := s.pageAccess(ctx, libraryID, knowledgesdk.ActionPageCollectionsList, a); err != nil {
		return knowledgesdk.KnowledgePageCollectionPage{}, err
	}
	repository, err := s.pageNavigation()
	if err != nil {
		return knowledgesdk.KnowledgePageCollectionPage{}, err
	}
	result, err := repository.KnowledgePageCollection(ctx, libraryID, kind, after, limit, a)
	if err == nil {
		err = s.recheckPageAction(ctx, libraryID, knowledgesdk.ActionPageCollectionsList, a)
	}
	return result, err
}
