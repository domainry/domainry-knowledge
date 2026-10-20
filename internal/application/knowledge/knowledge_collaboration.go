package application

import (
	"context"
	"sort"
	"strconv"
	"strings"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func validateResolvedKnowledgePrincipals(userIDs []string, principals []knowledgesdk.KnowledgePrincipal) error {
	if len(principals) != len(userIDs) {
		return conversationFailure("unavailable", "principal_directory_invalid")
	}
	expected := make(map[string]struct{}, len(userIDs))
	for _, userID := range userIDs {
		expected[userID] = struct{}{}
	}
	seen := make(map[string]struct{}, len(principals))
	for _, principal := range principals {
		if _, ok := expected[principal.UserID]; !ok {
			return conversationFailure("unavailable", "principal_directory_invalid")
		}
		if _, duplicate := seen[principal.UserID]; duplicate {
			return conversationFailure("unavailable", "principal_directory_invalid")
		}
		if !conversationText(principal.UserID, 255, true) || !conversationText(principal.DisplayName, 512, true) || !conversationText(principal.Email, 512, false) || !conversationText(principal.AvatarURL, 2048, false) || !conversationText(principal.Status, 64, true) {
			return conversationFailure("unavailable", "principal_directory_invalid")
		}
		seen[principal.UserID] = struct{}{}
	}
	return nil
}

func validateSearchedKnowledgePrincipals(page knowledgesdk.KnowledgePrincipalPage, limit int) error {
	if len(page.Items) > limit || !conversationText(page.NextAfter, 255, false) || page.Complete && page.NextAfter != "" || !page.Complete && page.NextAfter == "" {
		return conversationFailure("unavailable", "principal_directory_invalid")
	}
	seen := make(map[string]struct{}, len(page.Items))
	for _, principal := range page.Items {
		if _, duplicate := seen[principal.UserID]; duplicate || principal.Status != "active" || !conversationText(principal.UserID, 255, true) || !conversationText(principal.DisplayName, 512, true) || !conversationText(principal.Email, 512, false) || !conversationText(principal.AvatarURL, 2048, false) {
			return conversationFailure("unavailable", "principal_directory_invalid")
		}
		seen[principal.UserID] = struct{}{}
	}
	return nil
}

func (s *Service) KnowledgePageComments(ctx context.Context, libraryID, pageID, after string, limit int, unresolvedOnly bool, a agentsdk.ConversationAuthority) (knowledgesdk.KnowledgePageCommentPage, error) {
	repository, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageCommentsList, a)
	if err != nil {
		return knowledgesdk.KnowledgePageCommentPage{}, err
	}
	result, err := repository.KnowledgePageComments(ctx, libraryID, pageID, after, limit, unresolvedOnly, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageCommentsList, a)
	}
	return result, err
}

func (s *Service) CreateKnowledgePageComment(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgePageCommentCreate, a agentsdk.ConversationAuthority) (knowledgesdk.KnowledgePageComment, error) {
	repository, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageCommentsCreate, a)
	if err != nil {
		return knowledgesdk.KnowledgePageComment{}, err
	}
	result, err := repository.CreateKnowledgePageComment(ctx, libraryID, pageID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageCommentsCreate, a)
	}
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPageCommentsCreate, "knowledge.page_comment.created", libraryID, pageID, result.ID, input.ClientID, result.Revision, nil, map[string]string{
			"published_version": strconv.FormatInt(result.PublishedVersion, 10), "parent_comment_id": result.ParentCommentID, "mention_count": strconv.Itoa(len(result.MentionedUserIDs)),
		}, a)
		s.publishKnowledgeMentions(ctx, result, a)
	}
	return result, err
}

func (s *Service) UpdateKnowledgePageComment(ctx context.Context, libraryID, pageID, commentID string, input knowledgesdk.KnowledgePageCommentUpdate, a agentsdk.ConversationAuthority) (knowledgesdk.KnowledgePageComment, error) {
	repository, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageCommentsUpdate, a)
	if err != nil {
		return knowledgesdk.KnowledgePageComment{}, err
	}
	result, err := repository.UpdateKnowledgePageComment(ctx, libraryID, pageID, commentID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageCommentsUpdate, a)
	}
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPageCommentsUpdate, "knowledge.page_comment.updated", libraryID, pageID, result.ID, input.ClientID, result.Revision, map[string]string{
			"expected_revision": strconv.FormatInt(input.ExpectedRevision, 10),
		}, map[string]string{"mention_count": strconv.Itoa(len(result.MentionedUserIDs))}, a)
		s.publishKnowledgeMentions(ctx, result, a)
	}
	return result, err
}

func (s *Service) ResolveKnowledgePageComment(ctx context.Context, libraryID, pageID, commentID string, input knowledgesdk.KnowledgePageCommentResolve, a agentsdk.ConversationAuthority) (knowledgesdk.KnowledgePageComment, error) {
	repository, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageCommentsResolve, a)
	if err != nil {
		return knowledgesdk.KnowledgePageComment{}, err
	}
	result, err := repository.ResolveKnowledgePageComment(ctx, libraryID, pageID, commentID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageCommentsResolve, a)
	}
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPageCommentsResolve, "knowledge.page_comment.resolution_changed", libraryID, pageID, result.ID, input.ClientID, result.Revision, map[string]string{
			"expected_revision": strconv.FormatInt(input.ExpectedRevision, 10),
		}, map[string]string{"resolved": strconv.FormatBool(result.Resolved)}, a)
	}
	return result, err
}

func (s *Service) DeleteKnowledgePageComment(ctx context.Context, libraryID, pageID, commentID string, input knowledgesdk.KnowledgePageCommentDelete, a agentsdk.ConversationAuthority) (knowledgesdk.KnowledgePageComment, error) {
	repository, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageCommentsDelete, a)
	if err != nil {
		return knowledgesdk.KnowledgePageComment{}, err
	}
	result, err := repository.DeleteKnowledgePageComment(ctx, libraryID, pageID, commentID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageCommentsDelete, a)
	}
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPageCommentsDelete, "knowledge.page_comment.deleted", libraryID, pageID, result.ID, input.ClientID, result.Revision, map[string]string{
			"expected_revision": strconv.FormatInt(input.ExpectedRevision, 10),
		}, map[string]string{"deleted": strconv.FormatBool(result.Deleted)}, a)
	}
	return result, err
}

func (s *Service) KnowledgePageAttachments(ctx context.Context, libraryID, pageID string, a agentsdk.ConversationAuthority) (knowledgesdk.KnowledgePageAttachmentPage, error) {
	repository, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageAttachmentsList, a)
	if err != nil {
		return knowledgesdk.KnowledgePageAttachmentPage{}, err
	}
	result, err := repository.KnowledgePageAttachments(ctx, libraryID, pageID, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageAttachmentsList, a)
	}
	return result, err
}

func (s *Service) SetKnowledgePageAttachment(ctx context.Context, libraryID, pageID, documentID string, input knowledgesdk.KnowledgePageAttachmentWrite, a agentsdk.ConversationAuthority) (knowledgesdk.KnowledgePageAttachment, error) {
	repository, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageAttachmentsSet, a)
	if err != nil {
		return knowledgesdk.KnowledgePageAttachment{}, err
	}
	result, err := repository.SetKnowledgePageAttachment(ctx, libraryID, pageID, documentID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageAttachmentsSet, a)
	}
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPageAttachmentsSet, "knowledge.page_attachment.set", libraryID, pageID, documentID, input.ClientID, 0, nil, map[string]string{
			"document_id": result.DocumentID, "rank": result.Rank,
		}, a)
	}
	return result, err
}

func (s *Service) RemoveKnowledgePageAttachment(ctx context.Context, libraryID, pageID, documentID string, input knowledgesdk.KnowledgePageAttachmentRemove, a agentsdk.ConversationAuthority) error {
	repository, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageAttachmentsRemove, a)
	if err != nil {
		return err
	}
	if err = repository.RemoveKnowledgePageAttachment(ctx, libraryID, pageID, documentID, input, a); err != nil {
		return err
	}
	if err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageAttachmentsRemove, a); err != nil {
		return err
	}
	s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPageAttachmentsRemove, "knowledge.page_attachment.removed", libraryID, pageID, documentID, input.ClientID, 0, map[string]string{"document_id": documentID}, nil, a)
	return nil
}

func (s *Service) SearchKnowledgePrincipals(ctx context.Context, query, after string, limit int, a agentsdk.ConversationAuthority) (knowledgesdk.KnowledgePrincipalPage, error) {
	if err := s.authorize(a); err != nil {
		return knowledgesdk.KnowledgePrincipalPage{}, err
	}
	if s.options.PrincipalDirectory == nil {
		return knowledgesdk.KnowledgePrincipalPage{}, conversationFailure("unavailable", "principal_directory_unavailable")
	}
	if !conversationText(query, 512, false) || !conversationText(after, 255, false) || limit < 0 || limit > 100 {
		return knowledgesdk.KnowledgePrincipalPage{}, conversationFailure("bad_request", "principal_query_invalid")
	}
	if limit == 0 {
		limit = 20
	}
	if err := s.authorizeLibraryAction(ctx, knowledgesdk.ActionPrincipalsSearch, agentsdk.KnowledgeLibrary{}, a); err != nil {
		return knowledgesdk.KnowledgePrincipalPage{}, err
	}
	result, err := s.options.PrincipalDirectory.SearchKnowledgePrincipals(ctx, query, after, limit, a)
	if err == nil {
		err = s.authorizeLibraryAction(ctx, knowledgesdk.ActionPrincipalsSearch, agentsdk.KnowledgeLibrary{}, a)
	}
	if err == nil {
		err = validateSearchedKnowledgePrincipals(result, limit)
	}
	return result, err
}

func (s *Service) ResolveKnowledgePrincipals(ctx context.Context, userIDs []string, a agentsdk.ConversationAuthority) ([]knowledgesdk.KnowledgePrincipal, error) {
	if err := s.authorize(a); err != nil {
		return nil, err
	}
	if s.options.PrincipalDirectory == nil {
		return nil, conversationFailure("unavailable", "principal_directory_unavailable")
	}
	if len(userIDs) < 1 || len(userIDs) > 100 {
		return nil, conversationFailure("bad_request", "principal_limit_invalid")
	}
	seen := make(map[string]struct{}, len(userIDs))
	for _, userID := range userIDs {
		if !conversationText(userID, 255, true) || strings.TrimSpace(userID) != userID {
			return nil, conversationFailure("bad_request", "principal_invalid")
		}
		if _, duplicate := seen[userID]; duplicate {
			return nil, conversationFailure("bad_request", "principal_invalid")
		}
		seen[userID] = struct{}{}
	}
	if err := s.authorizeLibraryAction(ctx, knowledgesdk.ActionPrincipalsResolve, agentsdk.KnowledgeLibrary{}, a); err != nil {
		return nil, err
	}
	result, err := s.options.PrincipalDirectory.ResolveKnowledgePrincipals(ctx, append([]string(nil), userIDs...), a)
	if err == nil {
		err = s.authorizeLibraryAction(ctx, knowledgesdk.ActionPrincipalsResolve, agentsdk.KnowledgeLibrary{}, a)
	}
	if err != nil {
		return nil, err
	}
	if err = validateResolvedKnowledgePrincipals(userIDs, result); err != nil {
		return nil, err
	}
	return result, nil
}

func (s *Service) SearchKnowledgeLibraryMembers(ctx context.Context, libraryID, query, after string, limit int, a agentsdk.ConversationAuthority) (knowledgesdk.KnowledgePrincipalPage, error) {
	libraries, err := s.LibraryAccess(ctx, knowledgesdk.ActionLibraryMembersSearch, a)
	if err != nil {
		return knowledgesdk.KnowledgePrincipalPage{}, err
	}
	library, err := libraries.KnowledgeLibrary(ctx, libraryID, a)
	if err != nil {
		return knowledgesdk.KnowledgePrincipalPage{}, err
	}
	if err = s.authorizeLibraryAction(ctx, knowledgesdk.ActionLibraryMembersSearch, library, a); err != nil {
		return knowledgesdk.KnowledgePrincipalPage{}, err
	}
	if s.options.PrincipalDirectory == nil || !conversationText(query, 512, false) || len(after) > 255 || limit < 0 || limit > 100 {
		return knowledgesdk.KnowledgePrincipalPage{}, conversationFailure("bad_request", "principal_query_invalid")
	}
	if limit == 0 {
		limit = 20
	}
	members, ok := s.repo.(interface {
		KnowledgeLibraryMemberIDs(context.Context, string, agentsdk.ConversationAuthority) ([]string, error)
	})
	if !ok {
		return knowledgesdk.KnowledgePrincipalPage{}, conversationFailure("unavailable", "library_members_unavailable")
	}
	userIDs, err := members.KnowledgeLibraryMemberIDs(ctx, libraryID, a)
	if err != nil {
		return knowledgesdk.KnowledgePrincipalPage{}, err
	}
	principals, err := s.options.PrincipalDirectory.ResolveKnowledgePrincipals(ctx, userIDs, a)
	if err != nil {
		return knowledgesdk.KnowledgePrincipalPage{}, err
	}
	if err = validateResolvedKnowledgePrincipals(userIDs, principals); err != nil {
		return knowledgesdk.KnowledgePrincipalPage{}, err
	}
	needle := strings.ToLower(strings.TrimSpace(query))
	items := make([]knowledgesdk.KnowledgePrincipal, 0, len(principals))
	for _, principal := range principals {
		if principal.Status != "active" || principal.UserID <= after {
			continue
		}
		haystack := strings.ToLower(principal.UserID + "\n" + principal.DisplayName + "\n" + principal.Email)
		if needle != "" && !strings.Contains(haystack, needle) {
			continue
		}
		items = append(items, principal)
	}
	sort.Slice(items, func(i, j int) bool { return items[i].UserID < items[j].UserID })
	result := knowledgesdk.KnowledgePrincipalPage{Items: items, Complete: true}
	if len(result.Items) > limit {
		result.Items = result.Items[:limit]
		result.NextAfter = result.Items[len(result.Items)-1].UserID
		result.Complete = false
	}
	if err = s.recheckPageAction(ctx, libraryID, knowledgesdk.ActionLibraryMembersSearch, a); err != nil {
		return knowledgesdk.KnowledgePrincipalPage{}, err
	}
	return result, nil
}

func (s *Service) ExplainKnowledgeAccess(ctx context.Context, libraryID string, input knowledgesdk.KnowledgeAccessExplainRequest, a agentsdk.ConversationAuthority) (knowledgesdk.KnowledgeAccessExplanation, error) {
	repository, library, err := s.pageAccess(ctx, libraryID, knowledgesdk.ActionAccessExplain, a)
	if err != nil {
		return knowledgesdk.KnowledgeAccessExplanation{}, err
	}
	if s.options.AccessExplainer == nil {
		return knowledgesdk.KnowledgeAccessExplanation{}, conversationFailure("unavailable", "access_explainer_unavailable")
	}
	rule, known := KnowledgeResourcePolicy[input.Action]
	if !known || !conversationText(input.UserID, 255, true) || strings.TrimSpace(input.UserID) != input.UserID || !conversationText(input.PageID, 96, false) {
		return knowledgesdk.KnowledgeAccessExplanation{}, conversationFailure("bad_request", "knowledge_access_invalid")
	}
	roleReader, ok := s.repo.(interface {
		KnowledgeLibraryRoleForUser(context.Context, string, string, agentsdk.ConversationAuthority) (string, error)
		KnowledgeLibraryPageCount(context.Context, string, agentsdk.ConversationAuthority) (int, error)
		EvaluateKnowledgePageAccessForUser(context.Context, string, string, string, agentsdk.ConversationAuthority) (knowledgesdk.KnowledgePageEffectiveAccess, error)
	})
	if !ok {
		return knowledgesdk.KnowledgeAccessExplanation{}, conversationFailure("unavailable", "access_explainer_unavailable")
	}
	role, err := roleReader.KnowledgeLibraryRoleForUser(ctx, libraryID, input.UserID, a)
	if err != nil {
		return knowledgesdk.KnowledgeAccessExplanation{}, err
	}
	if input.ProposedRole != "" {
		if input.ProposedRole != "reader" && input.ProposedRole != "editor" && input.ProposedRole != "manager" {
			return knowledgesdk.KnowledgeAccessExplanation{}, conversationFailure("bad_request", "knowledge_access_role_invalid")
		}
		role = input.ProposedRole
	}
	pageCount, err := roleReader.KnowledgeLibraryPageCount(ctx, libraryID, a)
	if err != nil {
		return knowledgesdk.KnowledgeAccessExplanation{}, err
	}
	targetLibrary := library
	targetLibrary.Role = role
	result, err := s.options.AccessExplainer.ExplainKnowledgeAccess(ctx, input, targetLibrary, a)
	if err != nil {
		return knowledgesdk.KnowledgeAccessExplanation{}, err
	}
	if result.UserID != input.UserID || result.LibraryID != libraryID || result.PageID != input.PageID || result.Action != input.Action || !conversationText(result.Identity.Code, 255, true) || !conversationText(result.Identity.Label, 512, true) || !conversationText(result.Identity.Source, 512, false) {
		return knowledgesdk.KnowledgeAccessExplanation{}, conversationFailure("unavailable", "access_explainer_invalid")
	}
	roleAllowed := resourceRoleLevel(role) >= resourceRoleLevel(rule.MinimumRole)
	result.LibraryRole = role
	result.InheritedFrom = libraryID
	result.ImpactPages = pageCount
	result.Proposed = input.ProposedRole != ""
	result.Library = knowledgesdk.KnowledgeAccessLayer{Allowed: roleAllowed, Code: "library_role_denied", Label: "资料库成员角色"}
	if roleAllowed {
		result.Library.Code = "library_role_allowed"
	}
	if result.Proposed {
		result.Library.Code = "library_role_proposed"
	}
	pageAllowed := true
	pageSource, pageLabel, inheritedFrom := "library", "页面继承资料库权限", libraryID
	if input.PageID != "" {
		// The caller is already a current manager authorized for access explain.
		// Load the metadata-capable draft view so an unpublished or archived page
		// can still be explained without exposing its body in the result.
		page, pageErr := repository.KnowledgePage(ctx, libraryID, input.PageID, true, a)
		if pageErr != nil {
			return knowledgesdk.KnowledgeAccessExplanation{}, pageErr
		}
		effective, accessErr := roleReader.EvaluateKnowledgePageAccessForUser(ctx, libraryID, input.PageID, input.UserID, a)
		if accessErr != nil {
			return knowledgesdk.KnowledgeAccessExplanation{}, accessErr
		}
		if input.ProposedRole != "" && role == input.ProposedRole && effective.Source == "not_member" {
			effective = knowledgesdk.KnowledgePageEffectiveAccess{Allowed: page.Page.AccessMode == knowledgesdk.KnowledgePageAccessInherit, Role: input.ProposedRole, Mode: page.Page.AccessMode, Source: "library"}
		}
		pageAllowed = page.Page.State == "active" && effective.Allowed && resourceRoleLevel(effective.Role) >= resourceRoleLevel(rule.MinimumRole)
		pageSource = effective.Source
		switch effective.Source {
		case "direct_grant":
			pageLabel, inheritedFrom = "页面直接授权", effective.GrantPageID
		case "ancestor_grant":
			pageLabel, inheritedFrom = "祖先子树授权", effective.GrantPageID
		case "manager":
			pageLabel, inheritedFrom = "资料库管理员治理访问", libraryID
		case "restricted", "not_member":
			pageLabel, inheritedFrom = "页面限制且没有有效授权", input.PageID
		}
	}
	result.InheritedFrom = inheritedFrom
	result.Page = knowledgesdk.KnowledgeAccessLayer{Allowed: pageAllowed, Code: "page_inherited", Label: pageLabel, Source: pageSource}
	if !pageAllowed {
		result.Page.Code = "page_access_denied"
	}
	result.Final = knowledgesdk.KnowledgeAccessLayer{Allowed: result.Identity.Allowed && roleAllowed && pageAllowed, Code: "access_denied", Label: "最终权限"}
	if result.Final.Allowed {
		result.Final.Code = "access_allowed"
	}
	if err == nil {
		err = s.recheckPageAction(ctx, libraryID, knowledgesdk.ActionAccessExplain, a)
	}
	return result, err
}

var _ knowledgesdk.PageService = (*Service)(nil)
var _ knowledgesdk.CollaborationService = (*Service)(nil)
