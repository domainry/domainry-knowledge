package application

import (
	"context"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
)

func (s *Service) LibraryAccess(ctx context.Context, op string, a agentsdk.ConversationAuthority) (persistence.KnowledgeLibraryRepository, error) {
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
func (s *Service) LibraryAuthorize(ctx context.Context, op string, item agentsdk.KnowledgeLibrary, a agentsdk.ConversationAuthority) error {
	return s.options.LibraryAuthorizer.AuthorizeKnowledgeLibrary(ctx, op, item, a)
}
func (s *Service) CreateKnowledgeLibrary(ctx context.Context, in agentsdk.KnowledgeLibraryCreate, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeLibrary, error) {
	repo, e := s.LibraryAccess(ctx, "libraries_create", a)
	if e != nil {
		return agentsdk.KnowledgeLibrary{}, e
	}
	if e = s.LibraryAuthorize(ctx, "libraries_create", agentsdk.KnowledgeLibrary{Kind: in.Kind, OwnerUserID: a.UserID}, a); e != nil {
		return agentsdk.KnowledgeLibrary{}, e
	}
	out, err := repo.CreateKnowledgeLibrary(ctx, in, a)
	return s.LibraryResult(ctx, out, err, a)
}
func (s *Service) KnowledgeLibraries(ctx context.Context, after string, limit int, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeLibraryPage, error) {
	repo, e := s.LibraryAccess(ctx, "libraries_list", a)
	if e != nil {
		return agentsdk.KnowledgeLibraryPage{}, e
	}
	if e = s.LibraryAuthorize(ctx, "libraries_list", agentsdk.KnowledgeLibrary{}, a); e != nil {
		return agentsdk.KnowledgeLibraryPage{}, e
	}
	page, e := repo.KnowledgeLibraries(ctx, after, limit, a)
	if e != nil {
		return page, e
	}
	// Resolve Identity again at return time. The repository only ever selects
	// the caller's memberships; knowledge provider scopes are not inferred here.
	if e = s.LibraryAuthorize(ctx, "libraries_list", agentsdk.KnowledgeLibrary{}, a); e != nil {
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
func (s *Service) KnowledgeLibrary(ctx context.Context, id string, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeLibrary, error) {
	repo, e := s.LibraryAccess(ctx, "libraries_get", a)
	if e != nil {
		return agentsdk.KnowledgeLibrary{}, e
	}
	item, e := repo.KnowledgeLibrary(ctx, id, a)
	if e != nil {
		return agentsdk.KnowledgeLibrary{}, e
	}
	if e = s.LibraryAuthorize(ctx, "libraries_get", item, a); e != nil {
		return agentsdk.KnowledgeLibrary{}, e
	}
	return s.LibraryResult(ctx, item, nil, a)
}
func (s *Service) UpdateKnowledgeLibrary(ctx context.Context, id string, in agentsdk.KnowledgeLibraryUpdate, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeLibrary, error) {
	repo, e := s.LibraryAccess(ctx, "libraries_update", a)
	if e != nil {
		return agentsdk.KnowledgeLibrary{}, e
	}
	item, e := repo.KnowledgeLibrary(ctx, id, a)
	if e != nil {
		return agentsdk.KnowledgeLibrary{}, e
	}
	if e = s.LibraryAuthorize(ctx, "libraries_update", item, a); e != nil {
		return agentsdk.KnowledgeLibrary{}, e
	}
	out, err := repo.UpdateKnowledgeLibrary(ctx, id, in, a)
	return s.LibraryResult(ctx, out, err, a)
}
func (s *Service) KnowledgeLibraryMembers(ctx context.Context, id, after string, limit int, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeLibraryMembers, error) {
	repo, e := s.LibraryAccess(ctx, "libraries_members", a)
	if e != nil {
		return agentsdk.KnowledgeLibraryMembers{}, e
	}
	item, e := repo.KnowledgeLibrary(ctx, id, a)
	if e != nil {
		return agentsdk.KnowledgeLibraryMembers{}, e
	}
	if e = s.LibraryAuthorize(ctx, "libraries_members", item, a); e != nil {
		return agentsdk.KnowledgeLibraryMembers{}, e
	}
	return repo.KnowledgeLibraryMembers(ctx, id, after, limit, a)
}
func (s *Service) SetKnowledgeLibraryMember(ctx context.Context, id, user string, in agentsdk.KnowledgeLibraryMemberWrite, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeLibrary, error) {
	repo, e := s.LibraryAccess(ctx, "libraries_set_member", a)
	if e != nil {
		return agentsdk.KnowledgeLibrary{}, e
	}
	item, e := repo.KnowledgeLibrary(ctx, id, a)
	if e != nil {
		return agentsdk.KnowledgeLibrary{}, e
	}
	if e = s.LibraryAuthorize(ctx, "libraries_set_member", item, a); e != nil {
		return agentsdk.KnowledgeLibrary{}, e
	}
	if item.Kind != "shared" || item.Role != "manager" {
		return agentsdk.KnowledgeLibrary{}, conversationFailure("forbidden", "library_manage_required")
	}
	if e = s.options.LibraryAuthorizer.ValidateKnowledgeLibraryMember(ctx, user, a); e != nil {
		return agentsdk.KnowledgeLibrary{}, e
	}
	out, err := repo.SetKnowledgeLibraryMember(ctx, id, user, in, a)
	return s.LibraryResult(ctx, out, err, a)
}
func (s *Service) RemoveKnowledgeLibraryMember(ctx context.Context, id, user string, revision int64, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeLibrary, error) {
	repo, e := s.LibraryAccess(ctx, "libraries_remove_member", a)
	if e != nil {
		return agentsdk.KnowledgeLibrary{}, e
	}
	item, e := repo.KnowledgeLibrary(ctx, id, a)
	if e != nil {
		return agentsdk.KnowledgeLibrary{}, e
	}
	if e = s.LibraryAuthorize(ctx, "libraries_remove_member", item, a); e != nil {
		return agentsdk.KnowledgeLibrary{}, e
	}
	// Removing an inactive account must remain possible; validate only additions.
	out, err := repo.RemoveKnowledgeLibraryMember(ctx, id, user, revision, a)
	return s.LibraryResult(ctx, out, err, a)
}

var _ agentsdk.KnowledgeLibraryService = (*Service)(nil)

func (s *Service) LibraryResult(ctx context.Context, item agentsdk.KnowledgeLibrary, err error, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeLibrary, error) {
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
		Binding, unavailable := s.DocumentBinding(ctx, item.ID, a)
		item.DocumentsConfigured = unavailable == nil
		if unavailable == nil {
			item.DocumentMaxBytes = DocumentMaxBytes(Binding)
		}
	}
	item.SourcesManageable = item.Role == "manager" && s.options.LibraryAuthorizer != nil && s.LibraryAuthorize(ctx, "libraries_sources", item, a) == nil
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
