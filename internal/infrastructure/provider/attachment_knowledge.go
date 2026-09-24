package provider

import (
	"context"
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"regexp"
	"strings"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	knowledgeprovider "github.com/domainry/domainry-knowledge-sdk/provider"
)

// AttachmentKnowledge is a factory for fixed owner/conversation ACLs on a
// dedicated KB, not a default source and not a library knowledge binding.
type AttachmentKnowledge struct {
	config            KnowledgeConfig
	runtime, identity string
	adapterFactory    knowledgeprovider.AdapterFactory
}

func NewAttachmentKnowledge(c KnowledgeConfig, runtime string, adapterFactory knowledgeprovider.AdapterFactory) (*AttachmentKnowledge, error) {
	if strings.TrimSpace(runtime) == "" || len(runtime) > 255 || c.PermissionIDs != nil || c.AuthorizeWorkspace != nil || c.DocumentPermissionIDs != nil {
		return nil, fmt.Errorf("attachment knowledge owns its private runtime/workspace/user/conversation policy")
	}
	c.DocumentManagement = true
	c.DocumentPermissionIDs = []string{"scope:agent:attachment:configuration"}
	k, err := NewKnowledge(c, adapterFactory)
	if err != nil || k == nil {
		return nil, fmt.Errorf("invalid attachment knowledge configuration")
	}
	if err = k.KnowledgeDocumentManagementReady(); err != nil {
		return nil, err
	}
	return &AttachmentKnowledge{config: k.config, runtime: runtime, identity: k.KnowledgeDocumentSourceIdentity(), adapterFactory: adapterFactory}, nil
}

func (k *AttachmentKnowledge) AttachmentKnowledgeSourceIdentity() string { return k.identity }

var attachmentConversationID = regexp.MustCompile(`^conv_[a-f0-9]{32}$`)

func (k *AttachmentKnowledge) ResolveAttachmentKnowledge(ctx context.Context, conversation string, a agentsdk.ConversationAuthority) (agentsdk.ConversationAttachmentKnowledgeScope, error) {
	var zero agentsdk.ConversationAttachmentKnowledgeScope
	if err := ctx.Err(); err != nil {
		return zero, err
	}
	if !a.Known || a.RuntimeID != k.runtime || a.WorkspaceID != k.config.WorkspaceID || strings.TrimSpace(a.UserID) == "" || len(a.UserID) > 255 || !attachmentConversationID.MatchString(conversation) {
		return zero, knowledgeFailure("access_denied")
	}
	raw, _ := json.Marshal([]string{"attachment.v1", a.RuntimeID, a.WorkspaceID, a.UserID, conversation})
	permission := fmt.Sprintf("scope:agent:attachment:%x", sha256.Sum256(raw))
	c := k.config
	c.DocumentPermissionIDs = []string{permission}
	base, err := NewKnowledge(c, k.adapterFactory)
	if err != nil {
		return zero, err
	}
	return agentsdk.ConversationAttachmentKnowledgeScope{Source: &attachmentKnowledgeSource{base: base, authority: a}, PermissionID: permission}, nil
}

// Do not expose the unscoped Knowledge through embedding: a resolved source
// must reject reuse with another user even inside the same workspace.
type attachmentKnowledgeSource struct {
	base      *Knowledge
	authority agentsdk.ConversationAuthority
}

func (k *attachmentKnowledgeSource) authorize(a agentsdk.ConversationAuthority) error {
	if !a.Known || a.RuntimeID != k.authority.RuntimeID || a.WorkspaceID != k.authority.WorkspaceID || a.UserID != k.authority.UserID {
		return knowledgeFailure("access_denied")
	}
	return nil
}
func (k *attachmentKnowledgeSource) KnowledgeDocumentSourceIdentity() string {
	return k.base.KnowledgeDocumentSourceIdentity()
}
func (k *attachmentKnowledgeSource) KnowledgeDocumentAccessPolicySHA256() string {
	return k.base.KnowledgeDocumentAccessPolicySHA256()
}
func (k *attachmentKnowledgeSource) KnowledgeDocumentMaxBytes() int64 {
	return k.base.KnowledgeDocumentMaxBytes()
}
func (k *attachmentKnowledgeSource) KnowledgeDocumentManagementReady() error {
	return k.base.KnowledgeDocumentManagementReady()
}
func (k *attachmentKnowledgeSource) PutKnowledgeDocument(ctx context.Context, in agentsdk.KnowledgeDocumentContent, a agentsdk.ConversationAuthority) error {
	if err := k.authorize(a); err != nil {
		return err
	}
	return k.base.PutKnowledgeDocument(ctx, in, a)
}
func (k *attachmentKnowledgeSource) InspectKnowledgeDocument(ctx context.Context, id string, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeDocumentState, error) {
	if err := k.authorize(a); err != nil {
		return agentsdk.KnowledgeDocumentState{}, err
	}
	return k.base.InspectKnowledgeDocument(ctx, id, a)
}
func (k *attachmentKnowledgeSource) DeleteKnowledgeDocument(ctx context.Context, id string, a agentsdk.ConversationAuthority) error {
	if err := k.authorize(a); err != nil {
		return err
	}
	return k.base.DeleteKnowledgeDocument(ctx, id, a)
}
func (k *attachmentKnowledgeSource) RecoverKnowledgeDocumentDelete(ctx context.Context, id string, a agentsdk.ConversationAuthority) error {
	if err := k.authorize(a); err != nil {
		return err
	}
	return k.base.RecoverKnowledgeDocumentDelete(ctx, id, a)
}
func (k *attachmentKnowledgeSource) SearchKnowledgeDocumentPassages(ctx context.Context, q string, a agentsdk.ConversationAuthority) ([]agentsdk.KnowledgeDocumentPassage, error) {
	if err := k.authorize(a); err != nil {
		return nil, err
	}
	return k.base.SearchKnowledgeDocumentPassages(ctx, q, a)
}
func (k *attachmentKnowledgeSource) ReadKnowledgeDocumentPassages(ctx context.Context, id string, a agentsdk.ConversationAuthority) ([]agentsdk.KnowledgeDocumentPassage, error) {
	if err := k.authorize(a); err != nil {
		return nil, err
	}
	return k.base.ReadKnowledgeDocumentPassages(ctx, id, a)
}

var _ agentsdk.ConversationAttachmentKnowledge = (*AttachmentKnowledge)(nil)
