package application

import (
	"context"
	"strconv"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func (s *Service) pageShareRepository(ctx context.Context, action string, a knowledgesdk.Authority) (knowledgesdk.PageShareService, error) {
	if _, err := s.LibraryAccess(ctx, action, a); err != nil {
		return nil, err
	}
	if err := s.LibraryAuthorize(ctx, action, knowledgesdk.KnowledgeLibrary{}, a); err != nil {
		return nil, err
	}
	repository, ok := s.repo.(knowledgesdk.PageShareService)
	if !ok {
		return nil, conversationFailure("unavailable", "page_shares_unavailable")
	}
	return repository, nil
}

func (s *Service) livePageShareAuthority(ctx context.Context, a knowledgesdk.Authority) (knowledgesdk.Authority, error) {
	if s.options.AccessExplainer == nil {
		return knowledgesdk.Authority{}, conversationFailure("unavailable", "page_share_identity_unavailable")
	}
	resolved, err := s.options.AccessExplainer.ResolveKnowledgeAccessAuthority(ctx, a.UserID, a)
	if err != nil {
		return knowledgesdk.Authority{}, err
	}
	if err = s.authorize(resolved); err != nil || resolved.UserID != a.UserID || resolved.WorkspaceID != a.WorkspaceID {
		if err != nil {
			return knowledgesdk.Authority{}, err
		}
		return knowledgesdk.Authority{}, conversationFailure("forbidden", "page_share_identity_invalid")
	}
	return resolved, nil
}

func (s *Service) KnowledgePageShares(ctx context.Context, libraryID, pageID, after string, limit int, a knowledgesdk.Authority) (knowledgesdk.KnowledgePageSharePage, error) {
	repository, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageSharesList, a)
	if err != nil {
		return knowledgesdk.KnowledgePageSharePage{}, err
	}
	shares, ok := repository.(knowledgesdk.PageShareService)
	if !ok {
		return knowledgesdk.KnowledgePageSharePage{}, conversationFailure("unavailable", "page_shares_unavailable")
	}
	return shares.KnowledgePageShares(ctx, libraryID, pageID, after, limit, a)
}

func (s *Service) CreateKnowledgePageShare(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgePageShareCreate, a knowledgesdk.Authority) (knowledgesdk.KnowledgePageShare, error) {
	repository, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageSharesCreate, a)
	if err != nil {
		return knowledgesdk.KnowledgePageShare{}, err
	}
	switch input.Kind {
	case knowledgesdk.KnowledgePageShareUser:
		err = s.options.LibraryAuthorizer.ValidateKnowledgeLibraryMember(ctx, input.Target.ID, a)
	case knowledgesdk.KnowledgePageShareOrganization:
		err = s.options.LibraryAuthorizer.ValidateKnowledgeLibraryOrganizationMember(ctx, input.Target.ID, a)
	}
	if err != nil {
		return knowledgesdk.KnowledgePageShare{}, err
	}
	shares, ok := repository.(knowledgesdk.PageShareService)
	if !ok {
		return knowledgesdk.KnowledgePageShare{}, conversationFailure("unavailable", "page_shares_unavailable")
	}
	{
		policies, policyOK := s.repo.(knowledgesdk.KnowledgePageContentPolicyRepository)
		if !policyOK {
			return knowledgesdk.KnowledgePageShare{}, conversationFailure("unavailable", "page_content_policy_unavailable")
		}
		decision, policyErr := policies.EvaluateKnowledgePageContentPolicy(ctx, libraryID, pageID, knowledgesdk.KnowledgePageContentOperationShare, a)
		if policyErr != nil {
			return knowledgesdk.KnowledgePageShare{}, policyErr
		}
		if !decision.Allowed {
			return knowledgesdk.KnowledgePageShare{}, conversationFailure("forbidden", "page_content_operation_denied")
		}
		decision, policyErr = s.authorizeKnowledgePageOutbound(ctx, decision, a)
		if policyErr != nil {
			return knowledgesdk.KnowledgePageShare{}, policyErr
		}
		current, policyErr := policies.EvaluateKnowledgePageContentPolicy(ctx, libraryID, pageID, knowledgesdk.KnowledgePageContentOperationShare, a)
		if policyErr != nil || !current.Allowed || current.SourcePageID != decision.SourcePageID || current.Revision != decision.Revision {
			if policyErr != nil {
				return knowledgesdk.KnowledgePageShare{}, policyErr
			}
			return knowledgesdk.KnowledgePageShare{}, conversationFailure("forbidden", "page_content_operation_denied")
		}
		if _, policyErr = s.authorizeKnowledgePageOutbound(ctx, current, a); policyErr != nil {
			return knowledgesdk.KnowledgePageShare{}, policyErr
		}
	}
	result, err := shares.CreateKnowledgePageShare(ctx, libraryID, pageID, input, a)
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPageSharesCreate, "knowledge.page.share_created", libraryID, pageID, result.ID, input.ClientID, result.Revision, nil, map[string]string{"kind": result.Kind, "scope": result.Scope, "expires_at": result.ExpiresAt.Format("2006-01-02T15:04:05Z07:00")}, a)
	}
	return result, err
}

func (s *Service) RevokeKnowledgePageShare(ctx context.Context, libraryID, pageID, shareID string, expectedRevision int64, a knowledgesdk.Authority) (knowledgesdk.KnowledgePageShare, error) {
	repository, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageSharesRevoke, a)
	if err != nil {
		return knowledgesdk.KnowledgePageShare{}, err
	}
	shares, ok := repository.(knowledgesdk.PageShareService)
	if !ok {
		return knowledgesdk.KnowledgePageShare{}, conversationFailure("unavailable", "page_shares_unavailable")
	}
	result, err := shares.RevokeKnowledgePageShare(ctx, libraryID, pageID, shareID, expectedRevision, a)
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPageSharesRevoke, "knowledge.page.share_revoked", libraryID, pageID, result.ID, "", result.Revision, map[string]string{"revision": strconv.FormatInt(expectedRevision, 10)}, map[string]string{"state": result.State}, a)
	}
	return result, err
}

func (s *Service) RedeemKnowledgePageShare(ctx context.Context, shareID string, input knowledgesdk.KnowledgePageShareRedeem, a knowledgesdk.Authority) (knowledgesdk.KnowledgePageShare, error) {
	repository, err := s.pageShareRepository(ctx, knowledgesdk.ActionPageSharesRedeem, a)
	if err != nil {
		return knowledgesdk.KnowledgePageShare{}, err
	}
	liveAuthority, err := s.livePageShareAuthority(ctx, a)
	if err != nil {
		return knowledgesdk.KnowledgePageShare{}, err
	}
	return repository.RedeemKnowledgePageShare(ctx, shareID, input, liveAuthority)
}

func (s *Service) ReadKnowledgePageShare(ctx context.Context, shareID, pageID string, a knowledgesdk.Authority) (knowledgesdk.KnowledgePageSharedView, error) {
	repository, err := s.pageShareRepository(ctx, knowledgesdk.ActionPageSharesRead, a)
	if err != nil {
		return knowledgesdk.KnowledgePageSharedView{}, err
	}
	liveAuthority, err := s.livePageShareAuthority(ctx, a)
	if err != nil {
		return knowledgesdk.KnowledgePageSharedView{}, err
	}
	result, err := repository.ReadKnowledgePageShare(ctx, shareID, pageID, liveAuthority)
	if err != nil {
		return result, err
	}
	decision, err := repository.AuthorizeKnowledgePageShareContentOperation(ctx, shareID, pageID, knowledgesdk.KnowledgePageContentOperationShare, liveAuthority)
	if err != nil {
		return knowledgesdk.KnowledgePageSharedView{}, err
	}
	decision, err = s.authorizeKnowledgePageOutbound(ctx, decision, liveAuthority)
	if err != nil {
		return knowledgesdk.KnowledgePageSharedView{}, err
	}
	liveAuthority, err = s.livePageShareAuthority(ctx, a)
	if err != nil {
		return knowledgesdk.KnowledgePageSharedView{}, err
	}
	currentView, err := repository.ReadKnowledgePageShare(ctx, shareID, pageID, liveAuthority)
	if err != nil {
		return knowledgesdk.KnowledgePageSharedView{}, err
	}
	current, err := repository.AuthorizeKnowledgePageShareContentOperation(ctx, shareID, pageID, knowledgesdk.KnowledgePageContentOperationShare, liveAuthority)
	if err != nil || !current.Allowed || current.SourcePageID != decision.SourcePageID || current.Revision != decision.Revision {
		if err != nil {
			return knowledgesdk.KnowledgePageSharedView{}, err
		}
		return knowledgesdk.KnowledgePageSharedView{}, conversationFailure("forbidden", "page_content_operation_denied")
	}
	if _, err = s.authorizeKnowledgePageOutbound(ctx, current, liveAuthority); err != nil {
		return knowledgesdk.KnowledgePageSharedView{}, err
	}
	return currentView, nil
}

func pageShareContentOperationAction(operation string) (string, bool) {
	switch operation {
	case knowledgesdk.KnowledgePageContentOperationCopy:
		return knowledgesdk.ActionPageShareContentCopy, true
	case knowledgesdk.KnowledgePageContentOperationPrint:
		return knowledgesdk.ActionPageShareContentPrint, true
	case knowledgesdk.KnowledgePageContentOperationExport:
		return knowledgesdk.ActionPageShareContentExport, true
	default:
		return "", false
	}
}

func (s *Service) AuthorizeKnowledgePageShareContentOperation(ctx context.Context, shareID, pageID, operation string, a knowledgesdk.Authority) (knowledgesdk.KnowledgePageContentDecision, error) {
	action, ok := pageShareContentOperationAction(operation)
	if !ok {
		return knowledgesdk.KnowledgePageContentDecision{}, conversationFailure("bad_request", "page_content_operation_invalid")
	}
	repository, err := s.pageShareRepository(ctx, action, a)
	if err != nil {
		return knowledgesdk.KnowledgePageContentDecision{}, err
	}
	liveAuthority, err := s.livePageShareAuthority(ctx, a)
	if err != nil {
		return knowledgesdk.KnowledgePageContentDecision{}, err
	}
	result, err := repository.AuthorizeKnowledgePageShareContentOperation(ctx, shareID, pageID, operation, liveAuthority)
	if err != nil {
		return knowledgesdk.KnowledgePageContentDecision{}, err
	}
	result, err = s.authorizeKnowledgePageOutbound(ctx, result, liveAuthority)
	if err != nil {
		return knowledgesdk.KnowledgePageContentDecision{}, err
	}
	repository, err = s.pageShareRepository(ctx, action, a)
	if err != nil {
		return knowledgesdk.KnowledgePageContentDecision{}, err
	}
	liveAuthority, err = s.livePageShareAuthority(ctx, a)
	if err != nil {
		return knowledgesdk.KnowledgePageContentDecision{}, err
	}
	current, err := repository.AuthorizeKnowledgePageShareContentOperation(ctx, shareID, pageID, operation, liveAuthority)
	if err != nil {
		return knowledgesdk.KnowledgePageContentDecision{}, err
	}
	if !current.Allowed || current.SourcePageID != result.SourcePageID || current.Revision != result.Revision {
		return knowledgesdk.KnowledgePageContentDecision{}, conversationFailure("forbidden", "page_content_operation_denied")
	}
	return s.authorizeKnowledgePageOutbound(ctx, current, liveAuthority)
}
