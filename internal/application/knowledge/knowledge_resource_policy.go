package application

import (
	"context"
	"fmt"
	"strings"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

type KnowledgeResourceRule struct {
	MinimumRole     string
	Writable        bool
	ManagerOnly     bool
	AllowNoResource bool
}

// KnowledgeResourcePolicy is the single code-owned role matrix for Knowledge
// resources. Identity still owns the exact Action grant; this matrix only
// interprets the caller's current library membership.
var KnowledgeResourcePolicy = map[string]KnowledgeResourceRule{
	knowledgesdk.ActionLibrariesList:             {AllowNoResource: true},
	knowledgesdk.ActionLibrariesCreate:           {AllowNoResource: true},
	knowledgesdk.ActionLibrariesGet:              {MinimumRole: "reader"},
	knowledgesdk.ActionLibrariesUpdate:           {MinimumRole: "manager", Writable: true, ManagerOnly: true},
	knowledgesdk.ActionLibrariesArchive:          {MinimumRole: "manager", ManagerOnly: true},
	knowledgesdk.ActionLibrariesRestore:          {MinimumRole: "manager", ManagerOnly: true},
	knowledgesdk.ActionLibraryMembersList:        {MinimumRole: "manager", ManagerOnly: true},
	knowledgesdk.ActionLibraryMembersSearch:      {MinimumRole: "reader"},
	knowledgesdk.ActionLibraryMembersSet:         {MinimumRole: "manager", Writable: true, ManagerOnly: true},
	knowledgesdk.ActionLibraryMembersRemove:      {MinimumRole: "manager", Writable: true, ManagerOnly: true},
	knowledgesdk.ActionPagesList:                 {MinimumRole: "reader"},
	knowledgesdk.ActionPagesGet:                  {MinimumRole: "reader"},
	knowledgesdk.ActionPagesCreate:               {MinimumRole: "editor", Writable: true},
	knowledgesdk.ActionPagesUpdate:               {MinimumRole: "editor", Writable: true},
	knowledgesdk.ActionPagesMove:                 {MinimumRole: "editor", Writable: true},
	knowledgesdk.ActionPagesMovePreview:          {MinimumRole: "manager", ManagerOnly: true},
	knowledgesdk.ActionPagesReorder:              {MinimumRole: "editor", Writable: true},
	knowledgesdk.ActionPagesCopy:                 {MinimumRole: "editor", Writable: true},
	knowledgesdk.ActionPagesArchive:              {MinimumRole: "editor", Writable: true},
	knowledgesdk.ActionPagesRestore:              {MinimumRole: "editor", Writable: true},
	knowledgesdk.ActionPagesPublish:              {MinimumRole: "editor", Writable: true},
	knowledgesdk.ActionPageAccessGet:             {MinimumRole: "manager", ManagerOnly: true},
	knowledgesdk.ActionPageAccessSet:             {MinimumRole: "manager", Writable: true, ManagerOnly: true},
	knowledgesdk.ActionPageCollaborationConnect:  {MinimumRole: "editor", Writable: true},
	knowledgesdk.ActionPageCollaborationSync:     {MinimumRole: "editor", Writable: true},
	knowledgesdk.ActionPageCollaborationClose:    {MinimumRole: "editor", Writable: true},
	knowledgesdk.ActionPageCollaborationPublish:  {MinimumRole: "editor", Writable: true},
	knowledgesdk.ActionPageVersionsList:          {MinimumRole: "reader"},
	knowledgesdk.ActionPageVersionsGet:           {MinimumRole: "reader"},
	knowledgesdk.ActionPageVersionsDiff:          {MinimumRole: "reader"},
	knowledgesdk.ActionPageVersionsRestore:       {MinimumRole: "editor", Writable: true},
	knowledgesdk.ActionPageCommentsList:          {MinimumRole: "reader"},
	knowledgesdk.ActionPageCommentsCreate:        {MinimumRole: "reader", Writable: true},
	knowledgesdk.ActionPageCommentsUpdate:        {MinimumRole: "reader", Writable: true},
	knowledgesdk.ActionPageCommentsResolve:       {MinimumRole: "reader", Writable: true},
	knowledgesdk.ActionPageCommentsDelete:        {MinimumRole: "reader", Writable: true},
	knowledgesdk.ActionPageAttachmentsList:       {MinimumRole: "reader"},
	knowledgesdk.ActionPageAttachmentsSet:        {MinimumRole: "editor", Writable: true},
	knowledgesdk.ActionPageAttachmentsRemove:     {MinimumRole: "editor", Writable: true},
	knowledgesdk.ActionDocumentsList:             {MinimumRole: "reader"},
	knowledgesdk.ActionDocumentsGet:              {MinimumRole: "reader"},
	knowledgesdk.ActionDocumentsDownload:         {MinimumRole: "reader"},
	knowledgesdk.ActionDocumentsUpload:           {MinimumRole: "editor", Writable: true},
	knowledgesdk.ActionDocumentsRetry:            {MinimumRole: "editor", Writable: true},
	knowledgesdk.ActionDocumentsReindex:          {MinimumRole: "editor", Writable: true},
	knowledgesdk.ActionDocumentsDelete:           {MinimumRole: "editor", Writable: true},
	knowledgesdk.ActionDocumentsTransfer:         {MinimumRole: "editor", Writable: true},
	knowledgesdk.ActionDocumentsImportAttachment: {MinimumRole: "editor", Writable: true},
	knowledgesdk.ActionSourcesList:               {MinimumRole: "manager", ManagerOnly: true},
	knowledgesdk.ActionSourcesBind:               {MinimumRole: "manager", Writable: true, ManagerOnly: true},
	knowledgesdk.ActionAccessExplain:             {MinimumRole: "manager", ManagerOnly: true},
	knowledgesdk.ActionPrincipalsSearch:          {AllowNoResource: true},
	knowledgesdk.ActionPrincipalsResolve:         {AllowNoResource: true},
}

func resourceRoleLevel(role string) int {
	switch role {
	case "reader":
		return 1
	case "editor":
		return 2
	case "manager":
		return 3
	default:
		return 0
	}
}

func validateResourcePolicy() error {
	actions, err := knowledgesdk.AuthorizationActions()
	if err != nil {
		return err
	}
	for _, action := range actions {
		if action.Permission == nil {
			continue
		}
		rule, ok := KnowledgeResourcePolicy[action.Key]
		if !ok {
			return fmt.Errorf("Knowledge Action %q has no resource policy", action.Key)
		}
		if !rule.AllowNoResource && resourceRoleLevel(rule.MinimumRole) == 0 {
			return fmt.Errorf("Knowledge Action %q has an invalid minimum role", action.Key)
		}
	}
	return nil
}

func (s *Service) authorizeLibraryAction(ctx context.Context, action string, library agentsdk.KnowledgeLibrary, a agentsdk.ConversationAuthority) error {
	rule, ok := KnowledgeResourcePolicy[strings.TrimSpace(action)]
	if !ok {
		return conversationFailure("forbidden", "knowledge_action_unknown")
	}
	if s.options.LibraryAuthorizer == nil {
		return conversationFailure("unavailable", "knowledge_authorizer_unavailable")
	}
	if err := s.options.LibraryAuthorizer.AuthorizeKnowledgeLibrary(ctx, action, library, a); err != nil {
		return err
	}
	if rule.AllowNoResource && library.ID == "" {
		return nil
	}
	if resourceRoleLevel(library.Role) < resourceRoleLevel(rule.MinimumRole) {
		return conversationFailure("forbidden", "library_role_denied")
	}
	if rule.Writable && library.Archived {
		return conversationFailure("conflict", "library_archived")
	}
	return nil
}
