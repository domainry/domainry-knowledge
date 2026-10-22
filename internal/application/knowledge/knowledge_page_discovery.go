package application

import (
	"context"
	"errors"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func (s *Service) pageDiscovery() (knowledgesdk.KnowledgePageDiscoveryService, error) {
	value, ok := s.repo.(knowledgesdk.KnowledgePageDiscoveryService)
	if !ok {
		return nil, conversationFailure("unavailable", "page_discovery_unavailable")
	}
	return value, nil
}

func (s *Service) SearchKnowledgePages(ctx context.Context, libraryID string, input knowledgesdk.KnowledgePageSearchInput, a knowledgesdk.Authority) (knowledgesdk.KnowledgePageSearchPage, error) {
	if _, _, err := s.pageAccess(ctx, libraryID, knowledgesdk.ActionPageSearch, a); err != nil {
		return knowledgesdk.KnowledgePageSearchPage{}, err
	}
	repository, err := s.pageDiscovery()
	if err != nil {
		return knowledgesdk.KnowledgePageSearchPage{}, err
	}
	result, err := repository.SearchKnowledgePages(ctx, libraryID, input, a)
	if err != nil {
		return result, err
	}
	// Search snippets are content. Re-evaluate every returned page after the
	// query so an ACL change racing the search cannot leave a revoked hit in the
	// response merely because it was visible when the scan started.
	visible := result.Items[:0]
	for _, item := range result.Items {
		accessErr := s.recheckPageItemAction(ctx, libraryID, item.PageID, knowledgesdk.ActionPageSearch, a)
		if accessErr == nil {
			visible = append(visible, item)
			continue
		}
		var classified *knowledgesdk.Error
		if errors.As(accessErr, &classified) && (classified.Class == knowledgesdk.ErrorClassForbidden || classified.Class == knowledgesdk.ErrorClassNotFound) {
			continue
		}
		// A transient access-store failure is not evidence that the page is
		// forbidden. Failing the whole request keeps outages observable instead
		// of silently returning an incomplete result set.
		return knowledgesdk.KnowledgePageSearchPage{}, accessErr
	}
	result.Items = visible
	if err = s.recheckPageAction(ctx, libraryID, knowledgesdk.ActionPageSearch, a); err != nil {
		return knowledgesdk.KnowledgePageSearchPage{}, err
	}
	return result, nil
}

func (s *Service) KnowledgePageSearchEvents(ctx context.Context, libraryID string, input knowledgesdk.KnowledgePageSearchEvents, a knowledgesdk.Authority) (knowledgesdk.KnowledgePageSearchEventBatch, error) {
	if _, _, err := s.pageAccess(ctx, libraryID, knowledgesdk.ActionPageSearchEvents, a); err != nil {
		return knowledgesdk.KnowledgePageSearchEventBatch{}, err
	}
	repository, err := s.pageDiscovery()
	if err != nil {
		return knowledgesdk.KnowledgePageSearchEventBatch{}, err
	}
	result, err := repository.KnowledgePageSearchEvents(ctx, libraryID, input, a)
	if err == nil {
		err = s.recheckPageAction(ctx, libraryID, knowledgesdk.ActionPageSearchEvents, a)
	}
	return result, err
}

func (s *Service) SearchKnowledgePageIdentities(ctx context.Context, libraryID, query string, limit int, a knowledgesdk.Authority) (knowledgesdk.KnowledgePageIdentityPage, error) {
	if _, _, err := s.pageAccess(ctx, libraryID, knowledgesdk.ActionPageIdentitiesSearch, a); err != nil {
		return knowledgesdk.KnowledgePageIdentityPage{}, err
	}
	repository, err := s.pageDiscovery()
	if err != nil {
		return knowledgesdk.KnowledgePageIdentityPage{}, err
	}
	result, err := repository.SearchKnowledgePageIdentities(ctx, libraryID, query, limit, a)
	if err != nil {
		return result, err
	}
	visible := result.Items[:0]
	for _, item := range result.Items {
		accessErr := s.recheckPageItemAction(ctx, libraryID, item.PageID, knowledgesdk.ActionPageIdentitiesSearch, a)
		if accessErr == nil {
			visible = append(visible, item)
			continue
		}
		var classified *knowledgesdk.Error
		if errors.As(accessErr, &classified) && (classified.Class == knowledgesdk.ErrorClassForbidden || classified.Class == knowledgesdk.ErrorClassNotFound) {
			continue
		}
		return knowledgesdk.KnowledgePageIdentityPage{}, accessErr
	}
	result.Items = visible
	err = s.recheckPageAction(ctx, libraryID, knowledgesdk.ActionPageIdentitiesSearch, a)
	return result, err
}

func (s *Service) KnowledgePageRelationshipGraph(ctx context.Context, libraryID, pageID string, depth, limit int, a knowledgesdk.Authority) (knowledgesdk.KnowledgePageRelationshipGraph, error) {
	if _, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageRelationshipGraphGet, a); err != nil {
		return knowledgesdk.KnowledgePageRelationshipGraph{}, err
	}
	repository, err := s.pageDiscovery()
	if err != nil {
		return knowledgesdk.KnowledgePageRelationshipGraph{}, err
	}
	result, err := repository.KnowledgePageRelationshipGraph(ctx, libraryID, pageID, depth, limit, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageRelationshipGraphGet, a)
	}
	return result, err
}
