package application

import (
	"context"
	"strconv"
	"strings"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func (s *Service) pageMetadata() (knowledgesdk.KnowledgePageMetadataService, error) {
	value, ok := s.repo.(knowledgesdk.KnowledgePageMetadataService)
	if !ok {
		return nil, conversationFailure("unavailable", "page_metadata_unavailable")
	}
	return value, nil
}

func (s *Service) SetKnowledgePageGovernance(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgePageGovernanceWrite, a agentsdk.Authority) (knowledgesdk.KnowledgePageMetadata, error) {
	if _, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageGovernanceSet, a); err != nil {
		return knowledgesdk.KnowledgePageMetadata{}, err
	}
	repository, err := s.pageMetadata()
	if err != nil {
		return knowledgesdk.KnowledgePageMetadata{}, err
	}
	result, err := repository.SetKnowledgePageGovernance(ctx, libraryID, pageID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageGovernanceSet, a)
	}
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPageGovernanceSet, "knowledge.page.governance_set", libraryID, pageID, pageID, input.ClientID, result.Revision, map[string]string{
			"expected_revision": strconv.FormatInt(input.ExpectedRevision, 10),
		}, map[string]string{
			"owner_user_id": result.OwnerUserID, "content_admin_count": strconv.Itoa(len(result.ContentAdminUserIDs)),
			"archive_retention_days": strconv.Itoa(result.ArchiveRetentionDays), "review_interval_days": strconv.Itoa(result.ReviewIntervalDays),
			"has_next_review_at": strconv.FormatBool(result.NextReviewAt != nil),
		}, a)
	}
	return result, err
}

func (s *Service) ReviewKnowledgePageGovernance(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgePageGovernanceReview, a agentsdk.Authority) (knowledgesdk.KnowledgePageMetadata, error) {
	if _, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageGovernanceReview, a); err != nil {
		return knowledgesdk.KnowledgePageMetadata{}, err
	}
	repository, err := s.pageMetadata()
	if err != nil {
		return knowledgesdk.KnowledgePageMetadata{}, err
	}
	result, err := repository.ReviewKnowledgePageGovernance(ctx, libraryID, pageID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageGovernanceReview, a)
	}
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPageGovernanceReview, "knowledge.page.governance_reviewed", libraryID, pageID, pageID, input.ClientID, result.Revision, map[string]string{
			"expected_revision": strconv.FormatInt(input.ExpectedRevision, 10),
		}, map[string]string{
			"reviewed_by_user_id": result.LastReviewedByUserID, "review_interval_days": strconv.Itoa(result.ReviewIntervalDays),
			"has_next_review_at": strconv.FormatBool(result.NextReviewAt != nil),
		}, a)
	}
	return result, err
}

func (s *Service) KnowledgePageGovernanceAudit(ctx context.Context, input knowledgesdk.KnowledgeGovernanceAuditQuery, a agentsdk.Authority) (knowledgesdk.KnowledgeGovernanceAuditPage, error) {
	input.LibraryID, input.PageID, input.Event, input.ActorID, input.After = strings.TrimSpace(input.LibraryID), strings.TrimSpace(input.PageID), strings.TrimSpace(input.Event), strings.TrimSpace(input.ActorID), strings.TrimSpace(input.After)
	if input.LibraryID == "" || input.PageID == "" || input.Limit < 1 || input.Limit > 100 || len(input.Event) > 128 || len(input.ActorID) > 255 || len(input.After) > 2048 {
		return knowledgesdk.KnowledgeGovernanceAuditPage{}, conversationFailure("bad_request", "page_governance_audit_query_invalid")
	}
	if input.Event != "" && input.Event != "knowledge.page.governance_set" && input.Event != "knowledge.page.governance_reviewed" {
		return knowledgesdk.KnowledgeGovernanceAuditPage{}, conversationFailure("bad_request", "page_governance_audit_event_invalid")
	}
	if _, _, err := s.pageItemAccess(ctx, input.LibraryID, input.PageID, knowledgesdk.ActionPageGovernanceAuditList, a); err != nil {
		return knowledgesdk.KnowledgeGovernanceAuditPage{}, err
	}
	if s.options.AuditReader == nil {
		return knowledgesdk.KnowledgeGovernanceAuditPage{}, conversationFailure("unavailable", "page_governance_audit_unavailable")
	}
	result, err := s.options.AuditReader.ReadKnowledgeAudit(ctx, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, input.LibraryID, input.PageID, knowledgesdk.ActionPageGovernanceAuditList, a)
	}
	return result, err
}

func (s *Service) KnowledgePageMetadata(ctx context.Context, libraryID, pageID string, a agentsdk.Authority) (knowledgesdk.KnowledgePageMetadata, error) {
	if _, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageMetadataGet, a); err != nil {
		return knowledgesdk.KnowledgePageMetadata{}, err
	}
	repository, err := s.pageMetadata()
	if err != nil {
		return knowledgesdk.KnowledgePageMetadata{}, err
	}
	result, err := repository.KnowledgePageMetadata(ctx, libraryID, pageID, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageMetadataGet, a)
	}
	return result, err
}

func (s *Service) SetKnowledgePageMetadata(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgePageMetadataWrite, a agentsdk.Authority) (knowledgesdk.KnowledgePageMetadata, error) {
	if _, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageMetadataSet, a); err != nil {
		return knowledgesdk.KnowledgePageMetadata{}, err
	}
	repository, err := s.pageMetadata()
	if err != nil {
		return knowledgesdk.KnowledgePageMetadata{}, err
	}
	result, err := repository.SetKnowledgePageMetadata(ctx, libraryID, pageID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageMetadataSet, a)
	}
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPageMetadataSet, "knowledge.page.metadata_set", libraryID, pageID, pageID, input.ClientID, result.Revision, map[string]string{
			"expected_revision": strconv.FormatInt(input.ExpectedRevision, 10),
		}, map[string]string{
			"tag_count": strconv.Itoa(len(result.Tags)), "property_count": strconv.Itoa(len(result.Properties)), "has_owner": strconv.FormatBool(result.OwnerUserID != ""), "status": result.Status, "has_review_at": strconv.FormatBool(result.NextReviewAt != nil),
		}, a)
	}
	return result, err
}
