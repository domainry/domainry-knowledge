package application

import (
	"context"
	"fmt"
	"slices"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
)

func ValidateAttachmentKnowledge(repo any, options *Options) error {
	options.AttachmentKnowledge = slices.Clone(options.AttachmentKnowledge)
	if len(options.AttachmentKnowledge) == 0 {
		return nil
	}
	if _, ok := repo.(persistence.ConversationAttachmentIndexRepository); !ok {
		return fmt.Errorf("attachment knowledge requires durable index persistence")
	}
	workspaces, sources := map[string]bool{}, map[string]bool{}
	for _, b := range options.AttachmentKnowledge {
		if !conversationText(b.WorkspaceID, 255, true) || b.Knowledge == nil {
			return fmt.Errorf("invalid attachment knowledge Binding")
		}
		id := b.Knowledge.AttachmentKnowledgeSourceIdentity()
		if !ValidAttachmentSourceHash(id) || workspaces[b.WorkspaceID] || sources[id] {
			return fmt.Errorf("attachment sources must have unique workspace and physical knowledge base")
		}
		workspaces[b.WorkspaceID], sources[id] = true, true
		if legacy, ok := options.Knowledge.(agentsdk.ManagedKnowledgeDocumentSource); ok && legacy.KnowledgeDocumentSourceIdentity() == id {
			return fmt.Errorf("attachment and default knowledge must not share a physical knowledge base")
		}
		for _, library := range options.LibraryKnowledge {
			if source, ok := library.Source.(agentsdk.ManagedKnowledgeDocumentSource); ok && source.KnowledgeDocumentSourceIdentity() == id {
				return fmt.Errorf("attachment and library knowledge must not share a physical knowledge base")
			}
		}
	}
	return nil
}

func ValidAttachmentSourceHash(v string) bool {
	if len(v) != 64 {
		return false
	}
	for _, r := range v {
		if !(r >= '0' && r <= '9' || r >= 'a' && r <= 'f') {
			return false
		}
	}
	return true
}

// Resolve only from trusted host bindings. Neither user requests nor model
// calls choose the physical KB, owner, private ACL or document request ID.
func (s *Service) AttachmentKnowledgeBinding(ctx context.Context, conversation string, a agentsdk.ConversationAuthority) (agentsdk.ConversationAttachmentKnowledgeScope, error) {
	var zero agentsdk.ConversationAttachmentKnowledgeScope
	if err := s.authorize(a); err != nil {
		return zero, err
	}
	for _, b := range s.options.AttachmentKnowledge {
		if b.WorkspaceID != a.WorkspaceID {
			continue
		}
		scope, err := b.Knowledge.ResolveAttachmentKnowledge(ctx, conversation, a)
		if err != nil {
			return zero, err
		}
		if scope.Source == nil || scope.Source.KnowledgeDocumentManagementReady() != nil || scope.Source.KnowledgeDocumentSourceIdentity() != b.Knowledge.AttachmentKnowledgeSourceIdentity() || !ValidAttachmentSourceHash(scope.Source.KnowledgeDocumentAccessPolicySHA256()) || !conversationText(scope.PermissionID, 128, true) || scope.Source.KnowledgeDocumentMaxBytes() < 1 {
			return zero, conversationFailure("unavailable", "attachment_source_invalid")
		}
		return scope, nil
	}
	return zero, conversationFailure("unavailable", "attachment_index_unavailable")
}

func (s *Service) IndexAttachment(ctx context.Context, conversation, id string, expected int64, a agentsdk.ConversationAuthority) (agentsdk.ConversationAttachment, error) {
	var zero agentsdk.ConversationAttachment
	records, err := s.AttachmentAccess(ctx, "attachments_index", a)
	if err != nil {
		return zero, err
	}
	repo, ok := s.repo.(persistence.ConversationAttachmentIndexRepository)
	if !ok {
		return zero, conversationFailure("unavailable", "attachment_index_unavailable")
	}
	r, err := s.AttachmentRecord(ctx, records, conversation, id, a)
	if err != nil {
		return zero, err
	}
	if _, err = s.AttachmentAccess(ctx, "attachments_download", a); err != nil {
		return zero, err
	}
	scope, err := s.AttachmentKnowledgeBinding(ctx, conversation, a)
	if err != nil {
		return zero, err
	}
	if r.Attachment.Bytes > DocumentMaxBytes(scope.Source) {
		return zero, conversationFailure("bad_request", "attachment_size_invalid")
	}
	source := persistence.ConversationAttachmentSource{Identity: scope.Source.KnowledgeDocumentSourceIdentity(), PermissionID: scope.PermissionID, AccessPolicySHA256: scope.Source.KnowledgeDocumentAccessPolicySHA256()}
	if err = repo.ActivateAttachmentKnowledgeSource(ctx, a.RuntimeID, a.WorkspaceID, source.Identity); err != nil {
		return zero, err
	}
	if _, err = s.AttachmentAccess(ctx, "attachments_index", a); err != nil {
		return zero, err
	}
	r, err = repo.QueueAttachmentIndex(ctx, id, expected, source, a)
	if err != nil {
		return zero, err
	}
	s.WakeAttachmentIndex()
	return s.AttachmentIndexView(ctx, r, a), nil
}

func (s *Service) WakeAttachmentIndex() {
	select {
	case s.attachmentIndexWake <- struct{}{}:
	default:
	}
}

var _ agentsdk.ConversationAttachmentIndexService = (*Service)(nil)
