package application

import (
	"context"
	"strconv"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
)

type pageRepository interface {
	knowledgesdk.KnowledgePageRepository
	knowledgesdk.CommentService
	knowledgesdk.PageAttachmentService
}

func (s *Service) pageAccess(ctx context.Context, libraryID, action string, a agentsdk.Authority) (pageRepository, agentsdk.KnowledgeLibrary, error) {
	libraries, err := s.LibraryAccess(ctx, action, a)
	if err != nil {
		return nil, agentsdk.KnowledgeLibrary{}, err
	}
	repository, ok := s.repo.(pageRepository)
	if !ok {
		return nil, agentsdk.KnowledgeLibrary{}, conversationFailure("unavailable", "pages_unavailable")
	}
	library, err := libraries.KnowledgeLibrary(ctx, libraryID, a)
	if err != nil {
		return nil, agentsdk.KnowledgeLibrary{}, err
	}
	if err = s.authorizeLibraryAction(ctx, action, library, a); err != nil {
		return nil, agentsdk.KnowledgeLibrary{}, err
	}
	return repository, library, nil
}

func (s *Service) recheckPageAction(ctx context.Context, libraryID, action string, a agentsdk.Authority) error {
	libraries, ok := s.repo.(persistence.KnowledgeLibraryRepository)
	if !ok {
		return conversationFailure("unavailable", "libraries_unavailable")
	}
	library, err := libraries.KnowledgeLibrary(ctx, libraryID, a)
	if err != nil {
		return err
	}
	return s.authorizeLibraryAction(ctx, action, library, a)
}

func (s *Service) pageItemAccess(ctx context.Context, libraryID, pageID, action string, a agentsdk.Authority) (pageRepository, agentsdk.KnowledgeLibrary, error) {
	repository, library, err := s.pageAccess(ctx, libraryID, action, a)
	if err != nil {
		return nil, agentsdk.KnowledgeLibrary{}, err
	}
	access, ok := s.repo.(knowledgesdk.KnowledgePageAccessRepository)
	if !ok {
		return nil, agentsdk.KnowledgeLibrary{}, conversationFailure("unavailable", "page_access_unavailable")
	}
	effective, err := access.EvaluateKnowledgePageAccess(ctx, libraryID, pageID, a)
	if err != nil {
		return nil, agentsdk.KnowledgeLibrary{}, err
	}
	rule, ok := KnowledgeResourcePolicy[action]
	if !ok || !effective.Allowed || resourceRoleLevel(effective.Role) < resourceRoleLevel(rule.MinimumRole) {
		return nil, agentsdk.KnowledgeLibrary{}, conversationFailure("not_found", "page_not_found")
	}
	return repository, library, nil
}

func (s *Service) recheckPageItemAction(ctx context.Context, libraryID, pageID, action string, a agentsdk.Authority) error {
	if err := s.recheckPageAction(ctx, libraryID, action, a); err != nil {
		return err
	}
	access, ok := s.repo.(knowledgesdk.KnowledgePageAccessRepository)
	if !ok {
		return conversationFailure("unavailable", "page_access_unavailable")
	}
	effective, err := access.EvaluateKnowledgePageAccess(ctx, libraryID, pageID, a)
	rule := KnowledgeResourcePolicy[action]
	if err != nil || !effective.Allowed || resourceRoleLevel(effective.Role) < resourceRoleLevel(rule.MinimumRole) {
		if err != nil {
			return err
		}
		return conversationFailure("not_found", "page_not_found")
	}
	return nil
}

func (s *Service) KnowledgePages(ctx context.Context, libraryID, parentID, after string, limit int, includeArchived bool, a agentsdk.Authority) (knowledgesdk.KnowledgePagePage, error) {
	repository, _, err := s.pageAccess(ctx, libraryID, knowledgesdk.ActionPagesList, a)
	if err != nil {
		return knowledgesdk.KnowledgePagePage{}, err
	}
	result, err := repository.KnowledgePages(ctx, libraryID, parentID, after, limit, includeArchived, a)
	if err == nil {
		err = s.recheckPageAction(ctx, libraryID, knowledgesdk.ActionPagesList, a)
	}
	return result, err
}

func (s *Service) KnowledgePage(ctx context.Context, libraryID, pageID string, includeDraft bool, a agentsdk.Authority) (knowledgesdk.KnowledgePageView, error) {
	repository, library, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPagesGet, a)
	if err != nil {
		return knowledgesdk.KnowledgePageView{}, err
	}
	includeDraft = includeDraft && library.Role != "reader"
	if access, ok := s.repo.(knowledgesdk.KnowledgePageAccessRepository); ok {
		effective, accessErr := access.EvaluateKnowledgePageAccess(ctx, libraryID, pageID, a)
		if accessErr != nil {
			return knowledgesdk.KnowledgePageView{}, accessErr
		}
		includeDraft = includeDraft && resourceRoleLevel(effective.Role) >= resourceRoleLevel("editor")
	}
	result, err := repository.KnowledgePage(ctx, libraryID, pageID, includeDraft, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPagesGet, a)
	}
	return result, err
}

func (s *Service) CreateKnowledgePage(ctx context.Context, libraryID string, input knowledgesdk.KnowledgePageCreate, a agentsdk.Authority) (knowledgesdk.KnowledgePageView, error) {
	repository, _, err := s.pageAccess(ctx, libraryID, knowledgesdk.ActionPagesCreate, a)
	if err != nil {
		return knowledgesdk.KnowledgePageView{}, err
	}
	if input.ParentPageID != "" {
		if _, _, err = s.pageItemAccess(ctx, libraryID, input.ParentPageID, knowledgesdk.ActionPagesCreate, a); err != nil {
			return knowledgesdk.KnowledgePageView{}, err
		}
	}
	result, err := repository.CreateKnowledgePage(ctx, libraryID, input, a)
	if err == nil {
		err = s.recheckPageAction(ctx, libraryID, knowledgesdk.ActionPagesCreate, a)
	}
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPagesCreate, "knowledge.page.created", libraryID, result.Page.ID, result.Page.ID, input.ClientID, result.Page.Revision, nil, map[string]string{
			"parent_page_id": result.Page.ParentPageID, "rank": result.Page.Rank, "state": result.Page.State,
		}, a)
	}
	return result, err
}

func (s *Service) KnowledgePageReferences(ctx context.Context, libraryID, pageID string, direction knowledgesdk.KnowledgePageReferenceDirection, after string, limit int, a agentsdk.Authority) (knowledgesdk.KnowledgePageReferencePage, error) {
	repository, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageReferencesList, a)
	if err != nil {
		return knowledgesdk.KnowledgePageReferencePage{}, err
	}
	result, err := repository.KnowledgePageReferences(ctx, libraryID, pageID, direction, after, limit, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageReferencesList, a)
	}
	return result, err
}

func (s *Service) CreateKnowledgePageReference(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgePageReferenceCreate, a agentsdk.Authority) (knowledgesdk.KnowledgePageReferenceCreateResult, error) {
	repository, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageReferencesCreate, a)
	if err != nil {
		return knowledgesdk.KnowledgePageReferenceCreateResult{}, err
	}
	result, err := repository.CreateKnowledgePageReference(ctx, libraryID, pageID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageReferencesCreate, a)
	}
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPageReferencesCreate, "knowledge.page.reference_created", libraryID, pageID, result.Target.Page.ID, input.ClientID, result.Parent.Page.Revision, map[string]string{
			"expected_parent_draft_revision": strconv.FormatInt(input.ExpectedParentDraftRevision, 10),
			"reference_block_id":             input.ReferenceBlockID,
		}, map[string]string{
			"target_page_id": result.Target.Page.ID,
			"content_type":   result.Target.Page.ContentType,
			"display":        input.Display,
		}, a)
	}
	return result, err
}

func (s *Service) SaveKnowledgePageDraft(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgePageDraftWrite, a agentsdk.Authority) (knowledgesdk.KnowledgePageView, error) {
	repository, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPagesUpdate, a)
	if err != nil {
		return knowledgesdk.KnowledgePageView{}, err
	}
	result, err := repository.SaveKnowledgePageDraft(ctx, libraryID, pageID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPagesUpdate, a)
	}
	if err == nil && result.Draft != nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPagesUpdate, "knowledge.page.draft_saved", libraryID, pageID, pageID, input.ClientID, result.Draft.DraftRevision, map[string]string{
			"expected_draft_revision": strconv.FormatInt(input.ExpectedDraftRevision, 10),
		}, map[string]string{
			"draft_revision": strconv.FormatInt(result.Draft.DraftRevision, 10), "content_sha256": result.Draft.Body.ContentSHA256,
		}, a)
	}
	return result, err
}

func (s *Service) ApplyKnowledgePageNativeOperations(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgePageNativeOperationBatch, a agentsdk.Authority) (knowledgesdk.KnowledgePageNativeOperationResult, error) {
	repository, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageNativeOperationsApply, a)
	if err != nil {
		return knowledgesdk.KnowledgePageNativeOperationResult{}, err
	}
	result, err := repository.ApplyKnowledgePageNativeOperations(ctx, libraryID, pageID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageNativeOperationsApply, a)
	}
	if err == nil && result.View.Draft != nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPageNativeOperationsApply, "knowledge.page.native_operations_applied", libraryID, pageID, pageID, input.ClientID, result.View.Draft.DraftRevision, map[string]string{
			"base_draft_revision": strconv.FormatInt(input.BaseDraftRevision, 10),
		}, map[string]string{
			"draft_revision": strconv.FormatInt(result.View.Draft.DraftRevision, 10), "operation_count": strconv.Itoa(len(result.Operations)), "content_type": result.View.Page.ContentType,
		}, a)
	}
	return result, err
}

func (s *Service) ExecuteKnowledgeGridAutomation(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgeGridAutomationExecute, a agentsdk.Authority) (knowledgesdk.KnowledgeGridAutomationResult, error) {
	repository, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageGridAutomationExecute, a)
	if err != nil {
		return knowledgesdk.KnowledgeGridAutomationResult{}, err
	}
	result, err := repository.ExecuteKnowledgeGridAutomation(ctx, libraryID, pageID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageGridAutomationExecute, a)
	}
	if err == nil && result.View.Draft != nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPageGridAutomationExecute, "knowledge.page.grid_automation_executed", libraryID, pageID, pageID, input.ExecutionID, result.View.Draft.DraftRevision, map[string]string{
			"automation_id": input.AutomationID, "record_id": input.RecordID, "trigger": input.Trigger,
		}, map[string]string{
			"field_id": result.FieldID, "draft_revision": strconv.FormatInt(result.View.Draft.DraftRevision, 10),
		}, a)
	}
	return result, err
}

func (s *Service) MoveKnowledgePage(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgePageMove, a agentsdk.Authority) (knowledgesdk.KnowledgePage, error) {
	repository, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPagesMove, a)
	if err != nil {
		return knowledgesdk.KnowledgePage{}, err
	}
	result, err := repository.MoveKnowledgePage(ctx, libraryID, pageID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPagesMove, a)
	}
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPagesMove, "knowledge.page.moved", libraryID, pageID, pageID, input.ClientID, result.Revision, map[string]string{
			"expected_revision": strconv.FormatInt(input.ExpectedRevision, 10),
		}, map[string]string{
			"parent_page_id": result.ParentPageID, "rank": result.Rank,
		}, a)
	}
	return result, err
}

func (s *Service) PreviewKnowledgePageMove(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgePageMovePreview, a agentsdk.Authority) (knowledgesdk.KnowledgePageMoveImpact, error) {
	repository, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPagesMovePreview, a)
	if err != nil {
		return knowledgesdk.KnowledgePageMoveImpact{}, err
	}
	result, err := repository.PreviewKnowledgePageMove(ctx, libraryID, pageID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPagesMovePreview, a)
	}
	return result, err
}

func (s *Service) KnowledgePageAccess(ctx context.Context, libraryID, pageID string, a agentsdk.Authority) (knowledgesdk.KnowledgePageAccessPolicy, error) {
	_, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageAccessGet, a)
	if err != nil {
		return knowledgesdk.KnowledgePageAccessPolicy{}, err
	}
	repository, ok := s.repo.(knowledgesdk.KnowledgePageAccessRepository)
	if !ok {
		return knowledgesdk.KnowledgePageAccessPolicy{}, conversationFailure("unavailable", "page_access_unavailable")
	}
	result, err := repository.KnowledgePageAccess(ctx, libraryID, pageID, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageAccessGet, a)
	}
	return result, err
}

func (s *Service) SetKnowledgePageAccess(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgePageAccessWrite, a agentsdk.Authority) (knowledgesdk.KnowledgePageAccessPolicy, error) {
	_, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageAccessSet, a)
	if err != nil {
		return knowledgesdk.KnowledgePageAccessPolicy{}, err
	}
	repository, ok := s.repo.(knowledgesdk.KnowledgePageAccessRepository)
	if !ok {
		return knowledgesdk.KnowledgePageAccessPolicy{}, conversationFailure("unavailable", "page_access_unavailable")
	}
	result, err := repository.SetKnowledgePageAccess(ctx, libraryID, pageID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageAccessSet, a)
	}
	if err == nil {
		s.WakeKnowledgeDocuments()
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPageAccessSet, "knowledge.page.access_changed", libraryID, pageID, pageID, input.ClientID, result.Revision, nil, map[string]string{"mode": result.Mode, "grant_count": strconv.Itoa(len(result.Grants))}, a)
		err = s.appendKnowledgeWebhook(ctx, knowledgesdk.KnowledgeWebhookPermissionChanged, knowledgesdk.ActionPageAccessGet, libraryID, pageID, pageID, result.Revision, a)
	}
	return result, err
}

func (s *Service) ReorderKnowledgePages(ctx context.Context, libraryID string, input knowledgesdk.KnowledgePageReorder, a agentsdk.Authority) (knowledgesdk.KnowledgePagePage, error) {
	repository, _, err := s.pageAccess(ctx, libraryID, knowledgesdk.ActionPagesReorder, a)
	if err != nil {
		return knowledgesdk.KnowledgePagePage{}, err
	}
	result, err := repository.ReorderKnowledgePages(ctx, libraryID, input, a)
	if err == nil {
		err = s.recheckPageAction(ctx, libraryID, knowledgesdk.ActionPagesReorder, a)
	}
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPagesReorder, "knowledge.pages.reordered", libraryID, "", libraryID+":"+input.ParentPageID, input.ClientID, int64(len(result.Items)), map[string]string{
			"parent_page_id": input.ParentPageID,
		}, map[string]string{
			"page_count": strconv.Itoa(len(result.Items)),
		}, a)
	}
	return result, err
}

func (s *Service) CopyKnowledgePage(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgePageCopy, a agentsdk.Authority) (knowledgesdk.KnowledgePageView, error) {
	repository, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPagesCopy, a)
	if err != nil {
		return knowledgesdk.KnowledgePageView{}, err
	}
	contentPolicy, ok := s.repo.(knowledgesdk.KnowledgePageContentPolicyRepository)
	if !ok {
		return knowledgesdk.KnowledgePageView{}, conversationFailure("unavailable", "page_content_policy_unavailable")
	}
	decision, err := contentPolicy.EvaluateKnowledgePageContentPolicy(ctx, libraryID, pageID, knowledgesdk.KnowledgePageContentOperationDuplicate, a)
	if err != nil {
		return knowledgesdk.KnowledgePageView{}, err
	}
	if !decision.Allowed {
		return knowledgesdk.KnowledgePageView{}, conversationFailure("forbidden", "page_content_operation_denied")
	}
	decision, err = s.authorizeKnowledgePageOutbound(ctx, decision, a)
	if err != nil {
		return knowledgesdk.KnowledgePageView{}, err
	}
	currentDecision, err := contentPolicy.EvaluateKnowledgePageContentPolicy(ctx, libraryID, pageID, knowledgesdk.KnowledgePageContentOperationDuplicate, a)
	if err != nil {
		return knowledgesdk.KnowledgePageView{}, err
	}
	if !currentDecision.Allowed || currentDecision.SourcePageID != decision.SourcePageID || currentDecision.Revision != decision.Revision {
		return knowledgesdk.KnowledgePageView{}, conversationFailure("forbidden", "page_content_operation_denied")
	}
	if _, err = s.authorizeKnowledgePageOutbound(ctx, currentDecision, a); err != nil {
		return knowledgesdk.KnowledgePageView{}, err
	}
	result, err := repository.CopyKnowledgePage(ctx, libraryID, pageID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPagesCopy, a)
	}
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPagesCopy, "knowledge.page.copied", libraryID, result.Page.ID, result.Page.ID, input.ClientID, result.Page.Revision, map[string]string{
			"source_page_id": pageID,
		}, map[string]string{
			"parent_page_id": result.Page.ParentPageID, "rank": result.Page.Rank, "state": result.Page.State,
		}, a)
	}
	return result, err
}

func (s *Service) SetKnowledgePageArchived(ctx context.Context, libraryID, pageID string, archived bool, input knowledgesdk.KnowledgePageStateWrite, a agentsdk.Authority) (knowledgesdk.KnowledgePage, error) {
	action := knowledgesdk.ActionPagesArchive
	if !archived {
		action = knowledgesdk.ActionPagesRestore
	}
	repository, _, err := s.pageItemAccess(ctx, libraryID, pageID, action, a)
	if err != nil {
		return knowledgesdk.KnowledgePage{}, err
	}
	result, err := repository.SetKnowledgePageArchived(ctx, libraryID, pageID, archived, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, action, a)
	}
	if err == nil {
		eventType := "knowledge.page.archived"
		if !archived {
			eventType = "knowledge.page.restored"
		}
		s.appendKnowledgeAudit(ctx, action, eventType, libraryID, pageID, pageID, input.ClientID, result.Revision, map[string]string{
			"expected_revision": strconv.FormatInt(input.ExpectedRevision, 10),
		}, map[string]string{"state": result.State}, a)
	}
	return result, err
}

func (s *Service) PublishKnowledgePage(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgePagePublish, a agentsdk.Authority) (knowledgesdk.KnowledgePageView, error) {
	repository, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPagesPublish, a)
	if err != nil {
		return knowledgesdk.KnowledgePageView{}, err
	}
	result, err := repository.PublishKnowledgePage(ctx, libraryID, pageID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPagesPublish, a)
	}
	if err == nil {
		s.WakeKnowledgeDocuments()
		contentSHA256 := ""
		if result.Published != nil {
			contentSHA256 = result.Published.Body.ContentSHA256
		}
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPagesPublish, "knowledge.page.published", libraryID, pageID, pageID, input.ClientID, result.Page.PublishedVersion, map[string]string{
			"expected_draft_revision": strconv.FormatInt(input.ExpectedDraftRevision, 10),
		}, map[string]string{
			"published_version": strconv.FormatInt(result.Page.PublishedVersion, 10), "content_sha256": contentSHA256,
		}, a)
		err = s.appendKnowledgeWebhook(ctx, knowledgesdk.KnowledgeWebhookPagePublished, knowledgesdk.ActionPagesGet, libraryID, pageID, pageID, result.Page.PublishedVersion, a)
	}
	return result, err
}

func (s *Service) KnowledgePageVersions(ctx context.Context, libraryID, pageID string, before int64, limit int, a agentsdk.Authority) (knowledgesdk.KnowledgePageVersionPage, error) {
	repository, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageVersionsList, a)
	if err != nil {
		return knowledgesdk.KnowledgePageVersionPage{}, err
	}
	result, err := repository.KnowledgePageVersions(ctx, libraryID, pageID, before, limit, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageVersionsList, a)
	}
	return result, err
}

func (s *Service) KnowledgePageVersion(ctx context.Context, libraryID, pageID string, version int64, a agentsdk.Authority) (knowledgesdk.KnowledgePageVersion, error) {
	repository, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageVersionsGet, a)
	if err != nil {
		return knowledgesdk.KnowledgePageVersion{}, err
	}
	result, err := repository.KnowledgePageVersion(ctx, libraryID, pageID, version, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageVersionsGet, a)
	}
	return result, err
}

func (s *Service) DiffKnowledgePageVersions(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgePageVersionDiffInput, a agentsdk.Authority) (knowledgesdk.KnowledgePageVersionDiff, error) {
	repository, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageVersionsDiff, a)
	if err != nil {
		return knowledgesdk.KnowledgePageVersionDiff{}, err
	}
	result, err := repository.DiffKnowledgePageVersions(ctx, libraryID, pageID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageVersionsDiff, a)
	}
	return result, err
}

func (s *Service) RestoreKnowledgePageVersion(ctx context.Context, libraryID, pageID string, version int64, input knowledgesdk.KnowledgePageRestoreVersion, a agentsdk.Authority) (knowledgesdk.KnowledgePageView, error) {
	repository, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageVersionsRestore, a)
	if err != nil {
		return knowledgesdk.KnowledgePageView{}, err
	}
	result, err := repository.RestoreKnowledgePageVersion(ctx, libraryID, pageID, version, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageVersionsRestore, a)
	}
	if err == nil && result.Draft != nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPageVersionsRestore, "knowledge.page_version.restored", libraryID, pageID, pageID, input.ClientID, version, map[string]string{
			"source_version": strconv.FormatInt(version, 10), "expected_draft_revision": strconv.FormatInt(input.ExpectedDraftRevision, 10),
		}, map[string]string{
			"draft_revision": strconv.FormatInt(result.Draft.DraftRevision, 10), "content_sha256": result.Draft.Body.ContentSHA256,
		}, a)
	}
	return result, err
}
