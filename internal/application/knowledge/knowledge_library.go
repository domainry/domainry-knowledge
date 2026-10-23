package application

import (
	"context"
	"strconv"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
)

func (s *Service) LibraryAccess(ctx context.Context, op string, a agentsdk.Authority) (persistence.KnowledgeLibraryRepository, error) {
	if e := s.authorize(a); e != nil {
		return nil, e
	}
	repo, ok := s.repo.(persistence.KnowledgeLibraryRepository)
	if !ok || s.options.LibraryAuthorizer == nil {
		return nil, conversationFailure("unavailable", "libraries_unavailable")
	}
	// Resource-specific decisions are made after trusted facts are loaded.
	return repo, nil
}
func (s *Service) LibraryAuthorize(ctx context.Context, op string, item agentsdk.KnowledgeLibrary, a agentsdk.Authority) error {
	return s.authorizeLibraryAction(ctx, op, item, a)
}
func (s *Service) CreateKnowledgeLibrary(ctx context.Context, in agentsdk.KnowledgeLibraryCreate, a agentsdk.Authority) (agentsdk.KnowledgeLibrary, error) {
	repo, e := s.LibraryAccess(ctx, knowledgesdk.ActionLibrariesCreate, a)
	if e != nil {
		return agentsdk.KnowledgeLibrary{}, e
	}
	if e = s.LibraryAuthorize(ctx, knowledgesdk.ActionLibrariesCreate, agentsdk.KnowledgeLibrary{Kind: in.Kind, OwnerUserID: a.UserID}, a); e != nil {
		return agentsdk.KnowledgeLibrary{}, e
	}
	out, err := repo.CreateKnowledgeLibrary(ctx, in, a)
	out, err = s.LibraryResult(ctx, out, err, a)
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionLibrariesCreate, "knowledge.library.created", out.ID, "", out.ID, in.ClientID, out.Revision, nil, map[string]string{
			"kind": out.Kind, "state": libraryState(out.Archived),
		}, a)
	}
	return out, err
}
func (s *Service) KnowledgeLibraries(ctx context.Context, after string, limit int, a agentsdk.Authority) (agentsdk.KnowledgeLibraryPage, error) {
	repo, e := s.LibraryAccess(ctx, knowledgesdk.ActionLibrariesList, a)
	if e != nil {
		return agentsdk.KnowledgeLibraryPage{}, e
	}
	if e = s.LibraryAuthorize(ctx, knowledgesdk.ActionLibrariesList, agentsdk.KnowledgeLibrary{}, a); e != nil {
		return agentsdk.KnowledgeLibraryPage{}, e
	}
	page, e := repo.KnowledgeLibraries(ctx, after, limit, a)
	if e != nil {
		return page, e
	}
	// Resolve Identity again at return time. The repository only ever selects
	// the caller's memberships; knowledge provider scopes are not inferred here.
	if e = s.LibraryAuthorize(ctx, knowledgesdk.ActionLibrariesList, agentsdk.KnowledgeLibrary{}, a); e != nil {
		return agentsdk.KnowledgeLibraryPage{}, e
	}
	for i := range page.Items {
		page.Items[i], e = s.LibraryResult(ctx, page.Items[i], nil, a)
		if e != nil {
			return agentsdk.KnowledgeLibraryPage{}, e
		}
	}
	return page, nil
}
func (s *Service) KnowledgeLibrary(ctx context.Context, id string, a agentsdk.Authority) (agentsdk.KnowledgeLibrary, error) {
	repo, e := s.LibraryAccess(ctx, knowledgesdk.ActionLibrariesGet, a)
	if e != nil {
		return agentsdk.KnowledgeLibrary{}, e
	}
	item, e := repo.KnowledgeLibrary(ctx, id, a)
	if e != nil {
		return agentsdk.KnowledgeLibrary{}, e
	}
	if e = s.LibraryAuthorize(ctx, knowledgesdk.ActionLibrariesGet, item, a); e != nil {
		return agentsdk.KnowledgeLibrary{}, e
	}
	return s.LibraryResult(ctx, item, nil, a)
}
func (s *Service) UpdateKnowledgeLibrary(ctx context.Context, id string, in agentsdk.KnowledgeLibraryUpdate, a agentsdk.Authority) (agentsdk.KnowledgeLibrary, error) {
	repo, e := s.LibraryAccess(ctx, knowledgesdk.ActionLibrariesUpdate, a)
	if e != nil {
		return agentsdk.KnowledgeLibrary{}, e
	}
	item, e := repo.KnowledgeLibrary(ctx, id, a)
	if e != nil {
		return agentsdk.KnowledgeLibrary{}, e
	}
	action := knowledgesdk.ActionLibrariesUpdate
	if item.Archived != in.Archived {
		if in.Archived {
			action = knowledgesdk.ActionLibrariesArchive
		} else {
			action = knowledgesdk.ActionLibrariesRestore
		}
	}
	if e = s.LibraryAuthorize(ctx, action, item, a); e != nil {
		return agentsdk.KnowledgeLibrary{}, e
	}
	out, err := repo.UpdateKnowledgeLibrary(ctx, id, in, a)
	out, err = s.LibraryResult(ctx, out, err, a)
	if err == nil {
		eventType := "knowledge.library.updated"
		if action == knowledgesdk.ActionLibrariesArchive {
			eventType = "knowledge.library.archived"
		} else if action == knowledgesdk.ActionLibrariesRestore {
			eventType = "knowledge.library.restored"
		}
		s.appendKnowledgeAudit(ctx, action, eventType, id, "", id, "", out.Revision, map[string]string{
			"revision": strconv.FormatInt(item.Revision, 10), "state": libraryState(item.Archived),
		}, map[string]string{
			"revision": strconv.FormatInt(out.Revision, 10), "state": libraryState(out.Archived),
		}, a)
	}
	return out, err
}
func (s *Service) KnowledgeLibraryMembers(ctx context.Context, id, after string, limit int, a agentsdk.Authority) (agentsdk.KnowledgeLibraryMembers, error) {
	repo, e := s.LibraryAccess(ctx, knowledgesdk.ActionLibraryMembersList, a)
	if e != nil {
		return agentsdk.KnowledgeLibraryMembers{}, e
	}
	item, e := repo.KnowledgeLibrary(ctx, id, a)
	if e != nil {
		return agentsdk.KnowledgeLibraryMembers{}, e
	}
	if e = s.LibraryAuthorize(ctx, knowledgesdk.ActionLibraryMembersList, item, a); e != nil {
		return agentsdk.KnowledgeLibraryMembers{}, e
	}
	return repo.KnowledgeLibraryMembers(ctx, id, after, limit, a)
}
func (s *Service) SetKnowledgeLibraryMember(ctx context.Context, id, user string, in agentsdk.KnowledgeLibraryMemberWrite, a agentsdk.Authority) (agentsdk.KnowledgeLibrary, error) {
	repo, e := s.LibraryAccess(ctx, knowledgesdk.ActionLibraryMembersSet, a)
	if e != nil {
		return agentsdk.KnowledgeLibrary{}, e
	}
	item, e := repo.KnowledgeLibrary(ctx, id, a)
	if e != nil {
		return agentsdk.KnowledgeLibrary{}, e
	}
	if e = s.LibraryAuthorize(ctx, knowledgesdk.ActionLibraryMembersSet, item, a); e != nil {
		return agentsdk.KnowledgeLibrary{}, e
	}
	if item.Kind != "shared" || item.Role != "manager" {
		return agentsdk.KnowledgeLibrary{}, conversationFailure("forbidden", "library_manage_required")
	}
	if e = s.options.LibraryAuthorizer.ValidateKnowledgeLibraryMember(ctx, user, a); e != nil {
		return agentsdk.KnowledgeLibrary{}, e
	}
	out, err := repo.SetKnowledgeLibraryMember(ctx, id, user, in, a)
	out, err = s.LibraryResult(ctx, out, err, a)
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionLibraryMembersSet, "knowledge.library_member.set", id, "", user, "", out.Revision, map[string]string{
			"expected_revision": strconv.FormatInt(in.ExpectedRevision, 10),
		}, map[string]string{"user_id": user, "role": in.Role}, a)
	}
	return out, err
}
func (s *Service) RemoveKnowledgeLibraryMember(ctx context.Context, id, user string, revision int64, a agentsdk.Authority) (agentsdk.KnowledgeLibrary, error) {
	repo, e := s.LibraryAccess(ctx, knowledgesdk.ActionLibraryMembersRemove, a)
	if e != nil {
		return agentsdk.KnowledgeLibrary{}, e
	}
	item, e := repo.KnowledgeLibrary(ctx, id, a)
	if e != nil {
		return agentsdk.KnowledgeLibrary{}, e
	}
	if e = s.LibraryAuthorize(ctx, knowledgesdk.ActionLibraryMembersRemove, item, a); e != nil {
		return agentsdk.KnowledgeLibrary{}, e
	}
	// Removing an inactive account must remain possible; validate only additions.
	out, err := repo.RemoveKnowledgeLibraryMember(ctx, id, user, revision, a)
	out, err = s.LibraryResult(ctx, out, err, a)
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionLibraryMembersRemove, "knowledge.library_member.removed", id, "", user, "", out.Revision, map[string]string{
			"expected_revision": strconv.FormatInt(revision, 10), "user_id": user,
		}, nil, a)
	}
	return out, err
}

func (s *Service) KnowledgeLibraryOrganizationMembers(ctx context.Context, id, after string, limit int, a agentsdk.Authority) (agentsdk.KnowledgeLibraryOrganizationMembers, error) {
	repo, err := s.LibraryAccess(ctx, knowledgesdk.ActionLibraryOrganizationMembersList, a)
	if err != nil {
		return agentsdk.KnowledgeLibraryOrganizationMembers{}, err
	}
	item, err := repo.KnowledgeLibrary(ctx, id, a)
	if err != nil {
		return agentsdk.KnowledgeLibraryOrganizationMembers{}, err
	}
	if err = s.LibraryAuthorize(ctx, knowledgesdk.ActionLibraryOrganizationMembersList, item, a); err != nil {
		return agentsdk.KnowledgeLibraryOrganizationMembers{}, err
	}
	return repo.KnowledgeLibraryOrganizationMembers(ctx, id, after, limit, a)
}

func (s *Service) SetKnowledgeLibraryOrganizationMember(ctx context.Context, id, organizationID string, in agentsdk.KnowledgeLibraryMemberWrite, a agentsdk.Authority) (agentsdk.KnowledgeLibrary, error) {
	repo, err := s.LibraryAccess(ctx, knowledgesdk.ActionLibraryOrganizationMembersSet, a)
	if err != nil {
		return agentsdk.KnowledgeLibrary{}, err
	}
	item, err := repo.KnowledgeLibrary(ctx, id, a)
	if err != nil {
		return agentsdk.KnowledgeLibrary{}, err
	}
	if err = s.LibraryAuthorize(ctx, knowledgesdk.ActionLibraryOrganizationMembersSet, item, a); err != nil {
		return agentsdk.KnowledgeLibrary{}, err
	}
	if item.Kind != "shared" || item.Role != "manager" {
		return agentsdk.KnowledgeLibrary{}, conversationFailure("forbidden", "library_manage_required")
	}
	if err = s.options.LibraryAuthorizer.ValidateKnowledgeLibraryOrganizationMember(ctx, organizationID, a); err != nil {
		return agentsdk.KnowledgeLibrary{}, err
	}
	out, err := repo.SetKnowledgeLibraryOrganizationMember(ctx, id, organizationID, in, a)
	out, err = s.LibraryResult(ctx, out, err, a)
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionLibraryOrganizationMembersSet, "knowledge.library_organization_member.set", id, "", organizationID, "", out.Revision, map[string]string{
			"expected_revision": strconv.FormatInt(in.ExpectedRevision, 10),
		}, map[string]string{"organization_id": organizationID, "role": in.Role}, a)
	}
	return out, err
}

func (s *Service) RemoveKnowledgeLibraryOrganizationMember(ctx context.Context, id, organizationID string, revision int64, a agentsdk.Authority) (agentsdk.KnowledgeLibrary, error) {
	repo, err := s.LibraryAccess(ctx, knowledgesdk.ActionLibraryOrganizationMembersRemove, a)
	if err != nil {
		return agentsdk.KnowledgeLibrary{}, err
	}
	item, err := repo.KnowledgeLibrary(ctx, id, a)
	if err != nil {
		return agentsdk.KnowledgeLibrary{}, err
	}
	if err = s.LibraryAuthorize(ctx, knowledgesdk.ActionLibraryOrganizationMembersRemove, item, a); err != nil {
		return agentsdk.KnowledgeLibrary{}, err
	}
	out, err := repo.RemoveKnowledgeLibraryOrganizationMember(ctx, id, organizationID, revision, a)
	out, err = s.LibraryResult(ctx, out, err, a)
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionLibraryOrganizationMembersRemove, "knowledge.library_organization_member.removed", id, "", organizationID, "", out.Revision, map[string]string{
			"expected_revision": strconv.FormatInt(revision, 10), "organization_id": organizationID,
		}, nil, a)
	}
	return out, err
}

func libraryState(archived bool) string {
	if archived {
		return "archived"
	}
	return "active"
}

var _ agentsdk.KnowledgeLibraryService = (*Service)(nil)

func (s *Service) LibraryResult(ctx context.Context, item agentsdk.KnowledgeLibrary, err error, a agentsdk.Authority) (agentsdk.KnowledgeLibrary, error) {
	if err != nil {
		return agentsdk.KnowledgeLibrary{}, err
	}
	if source, ok := s.options.Knowledge.(*LibraryKnowledgeSource); ok {
		item.KnowledgeConfigured, err = source.Configured(ctx, item.ID, a)
		if err != nil {
			return agentsdk.KnowledgeLibrary{}, err
		}
	}
	if s.options.DocumentStorage != nil {
		item.DocumentsConfigured = true
		item.DocumentMaxBytes = DocumentOriginalMaximumBytes()
		Binding, unavailable := s.DocumentBinding(ctx, item.ID, a)
		if unavailable == nil {
			item.DocumentIndexMaxBytes = DocumentIndexMaximumBytes(Binding)
			item.DocumentFormats = KnowledgeDocumentUploadFormats(Binding)
		} else {
			item.DocumentFormats = StoredKnowledgeDocumentFormats()
		}
	}
	item.SourcesManageable = item.Role == "manager" && s.options.LibraryAuthorizer != nil && s.LibraryAuthorize(ctx, knowledgesdk.ActionSourcesList, item, a) == nil
	if item.SourcesManageable {
		if bindings, ok := s.repo.(persistence.KnowledgeDatasourceRepository); ok {
			Binding, found, e := bindings.KnowledgeDatasourceBinding(ctx, DocumentStorageScope(item.ID, a))
			if e != nil {
				return agentsdk.KnowledgeLibrary{}, e
			}
			if found {
				item.DatasourceKey = Binding.DatasourceKey
			}
		}
	}
	return item, nil
}
