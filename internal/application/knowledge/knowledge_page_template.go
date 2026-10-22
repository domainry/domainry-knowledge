package application

import (
	"context"
	"strconv"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func (s *Service) pageTemplateRepository() (knowledgesdk.PageTemplateService, error) {
	repository, ok := s.repo.(knowledgesdk.PageTemplateService)
	if !ok {
		return nil, conversationFailure("unavailable", "page_templates_unavailable")
	}
	return repository, nil
}

func (s *Service) KnowledgePageTemplates(ctx context.Context, libraryID, after string, limit int, a agentsdk.Authority) (knowledgesdk.KnowledgePageTemplatePage, error) {
	_, _, err := s.pageAccess(ctx, libraryID, knowledgesdk.ActionPageTemplatesList, a)
	if err != nil {
		return knowledgesdk.KnowledgePageTemplatePage{}, err
	}
	repository, err := s.pageTemplateRepository()
	if err != nil {
		return knowledgesdk.KnowledgePageTemplatePage{}, err
	}
	result, err := repository.KnowledgePageTemplates(ctx, libraryID, after, limit, a)
	if err == nil {
		err = s.recheckPageAction(ctx, libraryID, knowledgesdk.ActionPageTemplatesList, a)
	}
	return result, err
}

func (s *Service) CreateKnowledgePageTemplate(ctx context.Context, libraryID string, input knowledgesdk.KnowledgePageTemplateCreate, a agentsdk.Authority) (knowledgesdk.KnowledgePageTemplate, error) {
	_, _, err := s.pageItemAccess(ctx, libraryID, input.SourcePageID, knowledgesdk.ActionPageTemplatesCreate, a)
	if err != nil {
		return knowledgesdk.KnowledgePageTemplate{}, err
	}
	repository, err := s.pageTemplateRepository()
	if err != nil {
		return knowledgesdk.KnowledgePageTemplate{}, err
	}
	result, err := repository.CreateKnowledgePageTemplate(ctx, libraryID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, input.SourcePageID, knowledgesdk.ActionPageTemplatesCreate, a)
	}
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPageTemplatesCreate, "knowledge.page_template.created", libraryID, input.SourcePageID, result.ID, input.ClientID, result.Revision, nil, map[string]string{"version": strconv.FormatInt(result.LatestVersion, 10), "node_count": strconv.Itoa(result.NodeCount)}, a)
	}
	return result, err
}

func (s *Service) UpdateKnowledgePageTemplate(ctx context.Context, libraryID, templateID string, input knowledgesdk.KnowledgePageTemplateUpdate, a agentsdk.Authority) (knowledgesdk.KnowledgePageTemplate, error) {
	_, _, err := s.pageItemAccess(ctx, libraryID, input.SourcePageID, knowledgesdk.ActionPageTemplatesUpdate, a)
	if err != nil {
		return knowledgesdk.KnowledgePageTemplate{}, err
	}
	repository, err := s.pageTemplateRepository()
	if err != nil {
		return knowledgesdk.KnowledgePageTemplate{}, err
	}
	result, err := repository.UpdateKnowledgePageTemplate(ctx, libraryID, templateID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, input.SourcePageID, knowledgesdk.ActionPageTemplatesUpdate, a)
	}
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPageTemplatesUpdate, "knowledge.page_template.version_created", libraryID, input.SourcePageID, templateID, input.ClientID, result.Revision, map[string]string{"expected_revision": strconv.FormatInt(input.ExpectedRevision, 10)}, map[string]string{"version": strconv.FormatInt(result.LatestVersion, 10), "node_count": strconv.Itoa(result.NodeCount)}, a)
	}
	return result, err
}

func (s *Service) KnowledgePageTemplateVersions(ctx context.Context, libraryID, templateID string, before int64, limit int, a agentsdk.Authority) (knowledgesdk.KnowledgePageTemplateVersionPage, error) {
	_, _, err := s.pageAccess(ctx, libraryID, knowledgesdk.ActionPageTemplateVersionsList, a)
	if err != nil {
		return knowledgesdk.KnowledgePageTemplateVersionPage{}, err
	}
	repository, err := s.pageTemplateRepository()
	if err != nil {
		return knowledgesdk.KnowledgePageTemplateVersionPage{}, err
	}
	result, err := repository.KnowledgePageTemplateVersions(ctx, libraryID, templateID, before, limit, a)
	if err == nil {
		err = s.recheckPageAction(ctx, libraryID, knowledgesdk.ActionPageTemplateVersionsList, a)
	}
	return result, err
}

func (s *Service) KnowledgePageTemplateVersion(ctx context.Context, libraryID, templateID string, version int64, a agentsdk.Authority) (knowledgesdk.KnowledgePageTemplateVersion, error) {
	_, _, err := s.pageAccess(ctx, libraryID, knowledgesdk.ActionPageTemplateVersionsGet, a)
	if err != nil {
		return knowledgesdk.KnowledgePageTemplateVersion{}, err
	}
	repository, err := s.pageTemplateRepository()
	if err != nil {
		return knowledgesdk.KnowledgePageTemplateVersion{}, err
	}
	result, err := repository.KnowledgePageTemplateVersion(ctx, libraryID, templateID, version, a)
	if err == nil {
		err = s.recheckPageAction(ctx, libraryID, knowledgesdk.ActionPageTemplateVersionsGet, a)
	}
	return result, err
}

func (s *Service) InstantiateKnowledgePageTemplate(ctx context.Context, libraryID, templateID string, input knowledgesdk.KnowledgePageTemplateInstantiate, a agentsdk.Authority) (knowledgesdk.KnowledgePageTemplateInstance, error) {
	_, _, err := s.pageAccess(ctx, libraryID, knowledgesdk.ActionPageTemplatesInstantiate, a)
	if err != nil {
		return knowledgesdk.KnowledgePageTemplateInstance{}, err
	}
	if input.ParentPageID != "" {
		if _, _, err = s.pageItemAccess(ctx, libraryID, input.ParentPageID, knowledgesdk.ActionPageTemplatesInstantiate, a); err != nil {
			return knowledgesdk.KnowledgePageTemplateInstance{}, err
		}
	}
	repository, err := s.pageTemplateRepository()
	if err != nil {
		return knowledgesdk.KnowledgePageTemplateInstance{}, err
	}
	result, err := repository.InstantiateKnowledgePageTemplate(ctx, libraryID, templateID, input, a)
	if err == nil {
		err = s.recheckPageAction(ctx, libraryID, knowledgesdk.ActionPageTemplatesInstantiate, a)
	}
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPageTemplatesInstantiate, "knowledge.page_template.instantiated", libraryID, result.Root.Page.ID, templateID, input.ClientID, result.Root.Page.Revision, nil, map[string]string{"version": strconv.FormatInt(result.Version, 10), "page_count": strconv.Itoa(len(result.CreatedPageIDs))}, a)
	}
	return result, err
}
