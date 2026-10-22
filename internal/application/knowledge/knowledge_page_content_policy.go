package application

import (
	"context"
	"strconv"
	"strings"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func (s *Service) authorizeKnowledgePageOutbound(ctx context.Context, decision knowledgesdk.KnowledgePageContentDecision, a agentsdk.Authority) (knowledgesdk.KnowledgePageContentDecision, error) {
	if !decision.ApprovalRequired {
		return decision, nil
	}
	if s.options.OutboundApprover == nil {
		return knowledgesdk.KnowledgePageContentDecision{}, conversationFailure("forbidden", "page_outbound_approval_required")
	}
	approval, err := s.options.OutboundApprover.AuthorizeKnowledgePageOutbound(ctx, knowledgesdk.KnowledgePageOutboundApprovalRequest{
		LibraryID: decision.LibraryID, PageID: decision.PageID, Operation: decision.Operation, Classification: decision.Classification,
		PolicyPageID: decision.SourcePageID, PolicyRevision: decision.Revision,
	}, a)
	if err != nil {
		return knowledgesdk.KnowledgePageContentDecision{}, err
	}
	if !approval.Allowed || strings.TrimSpace(approval.Reference) == "" || len(approval.Reference) > 512 {
		return knowledgesdk.KnowledgePageContentDecision{}, conversationFailure("forbidden", "page_outbound_approval_required")
	}
	decision.ApprovalReference = strings.TrimSpace(approval.Reference)
	return decision, nil
}

func pageContentOperationAction(operation string) (string, bool) {
	switch operation {
	case knowledgesdk.KnowledgePageContentOperationCopy:
		return knowledgesdk.ActionPageContentCopy, true
	case knowledgesdk.KnowledgePageContentOperationDownload:
		return knowledgesdk.ActionPageDownload, true
	case knowledgesdk.KnowledgePageContentOperationPrint:
		return knowledgesdk.ActionPagePrint, true
	case knowledgesdk.KnowledgePageContentOperationExport:
		return knowledgesdk.ActionPageExport, true
	case knowledgesdk.KnowledgePageContentOperationDuplicate:
		return knowledgesdk.ActionPageDuplicate, true
	default:
		return "", false
	}
}

func (s *Service) KnowledgePageContentPolicy(ctx context.Context, libraryID, pageID string, a agentsdk.Authority) (knowledgesdk.KnowledgePageContentPolicy, error) {
	_, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageContentPolicyGet, a)
	if err != nil {
		return knowledgesdk.KnowledgePageContentPolicy{}, err
	}
	repository, ok := s.repo.(knowledgesdk.KnowledgePageContentPolicyRepository)
	if !ok {
		return knowledgesdk.KnowledgePageContentPolicy{}, conversationFailure("unavailable", "page_content_policy_unavailable")
	}
	result, err := repository.KnowledgePageContentPolicy(ctx, libraryID, pageID, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageContentPolicyGet, a)
	}
	return result, err
}

func (s *Service) SetKnowledgePageContentPolicy(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgePageContentPolicyWrite, a agentsdk.Authority) (knowledgesdk.KnowledgePageContentPolicy, error) {
	_, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageContentPolicySet, a)
	if err != nil {
		return knowledgesdk.KnowledgePageContentPolicy{}, err
	}
	repository, ok := s.repo.(knowledgesdk.KnowledgePageContentPolicyRepository)
	if !ok {
		return knowledgesdk.KnowledgePageContentPolicy{}, conversationFailure("unavailable", "page_content_policy_unavailable")
	}
	result, err := repository.SetKnowledgePageContentPolicy(ctx, libraryID, pageID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageContentPolicySet, a)
	}
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPageContentPolicySet, "knowledge.page.content_policy_changed", libraryID, pageID, pageID, input.ClientID, result.Revision, map[string]string{"expected_revision": strconv.FormatInt(input.ExpectedRevision, 10)}, map[string]string{
			"scope": result.Scope, "classification": result.Classification, "watermark_mode": result.WatermarkMode,
			"sensitive_content_action": result.SensitiveAction, "require_outbound_approval": strconv.FormatBool(result.RequireApproval),
		}, a)
	}
	return result, err
}

func (s *Service) AuthorizeKnowledgePageContentOperation(ctx context.Context, libraryID, pageID, operation string, a agentsdk.Authority) (knowledgesdk.KnowledgePageContentDecision, error) {
	action, ok := pageContentOperationAction(operation)
	if !ok || operation == knowledgesdk.KnowledgePageContentOperationDownload {
		return knowledgesdk.KnowledgePageContentDecision{}, conversationFailure("bad_request", "page_content_operation_invalid")
	}
	_, _, err := s.pageItemAccess(ctx, libraryID, pageID, action, a)
	if err != nil {
		return knowledgesdk.KnowledgePageContentDecision{}, err
	}
	repository, ok := s.repo.(knowledgesdk.KnowledgePageContentPolicyRepository)
	if !ok {
		return knowledgesdk.KnowledgePageContentDecision{}, conversationFailure("unavailable", "page_content_policy_unavailable")
	}
	result, err := repository.EvaluateKnowledgePageContentPolicy(ctx, libraryID, pageID, operation, a)
	if err == nil && !result.Allowed {
		err = conversationFailure("forbidden", "page_content_operation_denied")
	}
	if err == nil {
		result, err = s.authorizeKnowledgePageOutbound(ctx, result, a)
	}
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, action, a)
	}
	if err == nil {
		current, checkErr := repository.EvaluateKnowledgePageContentPolicy(ctx, libraryID, pageID, operation, a)
		if checkErr != nil {
			err = checkErr
		} else if !current.Allowed || current.SourcePageID != result.SourcePageID || current.Revision != result.Revision {
			err = conversationFailure("forbidden", "page_content_operation_denied")
		} else {
			result, err = s.authorizeKnowledgePageOutbound(ctx, current, a)
		}
	}
	return result, err
}

func (s *Service) DownloadKnowledgePageDocument(ctx context.Context, libraryID, pageID, documentID string, a agentsdk.Authority) (agentsdk.KnowledgeDocumentDownload, error) {
	var zero agentsdk.KnowledgeDocumentDownload
	repository, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageDownload, a)
	if err != nil {
		return zero, err
	}
	contentPolicy, ok := s.repo.(knowledgesdk.KnowledgePageContentPolicyRepository)
	if !ok {
		return zero, conversationFailure("unavailable", "page_content_policy_unavailable")
	}
	decision, err := contentPolicy.EvaluateKnowledgePageContentPolicy(ctx, libraryID, pageID, knowledgesdk.KnowledgePageContentOperationDownload, a)
	if err != nil {
		return zero, err
	}
	if !decision.Allowed {
		return zero, conversationFailure("forbidden", "page_content_operation_denied")
	}
	decision, err = s.authorizeKnowledgePageOutbound(ctx, decision, a)
	if err != nil {
		return zero, err
	}
	attachments, ok := any(repository).(knowledgesdk.PageAttachmentService)
	if !ok {
		return zero, conversationFailure("unavailable", "page_attachment_unavailable")
	}
	linked, err := attachments.KnowledgePageAttachments(ctx, libraryID, pageID, a)
	if err != nil {
		return zero, err
	}
	found := false
	for _, attachment := range linked.Items {
		if attachment.DocumentID == documentID {
			found = true
			break
		}
	}
	if !found {
		return zero, conversationFailure("not_found", "page_file_reference_not_found")
	}
	download, err := s.DownloadKnowledgeDocument(ctx, libraryID, documentID, a)
	if err != nil {
		return zero, err
	}
	closeOnError := func(failure error) (agentsdk.KnowledgeDocumentDownload, error) {
		_ = download.Content.Close()
		return zero, failure
	}
	if err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageDownload, a); err != nil {
		return closeOnError(err)
	}
	current, err := contentPolicy.EvaluateKnowledgePageContentPolicy(ctx, libraryID, pageID, knowledgesdk.KnowledgePageContentOperationDownload, a)
	if err != nil {
		return closeOnError(err)
	}
	if !current.Allowed || current.SourcePageID != decision.SourcePageID || current.Revision != decision.Revision {
		return closeOnError(conversationFailure("forbidden", "page_content_operation_denied"))
	}
	if _, err = s.authorizeKnowledgePageOutbound(ctx, current, a); err != nil {
		return closeOnError(err)
	}
	return download, nil
}
