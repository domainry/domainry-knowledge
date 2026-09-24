package saas

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
)

type sourceDescriptor struct {
	Handle             string `json:"handle"`
	Identity           string `json:"identity"`
	PermissionID       string `json:"permission_id,omitempty"`
	AccessPolicySHA256 string `json:"access_policy_sha256,omitempty"`
	MaxBytes           int64  `json:"max_bytes,omitempty"`
	Ready              bool   `json:"ready"`
}

func (server *Server) registerSource(source agentsdk.ManagedKnowledgeDocumentSource, permission string) sourceDescriptor {
	identity := source.KnowledgeDocumentSourceIdentity()
	sum := sha256.Sum256([]byte(identity))
	handle := hex.EncodeToString(sum[:])
	descriptor := sourceDescriptor{Handle: handle, Identity: identity, PermissionID: permission, Ready: source.KnowledgeDocumentManagementReady() == nil}
	if value, ok := source.(agentsdk.KnowledgeDocumentAccessPolicySource); ok {
		descriptor.AccessPolicySHA256 = value.KnowledgeDocumentAccessPolicySHA256()
	}
	if value, ok := source.(agentsdk.KnowledgeDocumentSizeLimitSource); ok {
		descriptor.MaxBytes = value.KnowledgeDocumentMaxBytes()
	}
	server.sourcesMu.Lock()
	server.sources[handle] = source
	server.sourcesMu.Unlock()
	return descriptor
}

func (server *Server) dispatchExtended(ctx context.Context, operation string, raw json.RawMessage) (any, error) {
	if value, err, handled := server.dispatchService(ctx, operation, raw); handled {
		return value, err
	}
	if value, err, handled := server.dispatchRepositories(ctx, operation, raw); handled {
		return value, err
	}
	if value, err, handled := server.dispatchSource(ctx, operation, raw); handled {
		return value, err
	}
	return nil, &agentsdk.Error{Class: "not_found", Code: "knowledge.operation_not_found"}
}

func (server *Server) dispatchService(ctx context.Context, operation string, raw json.RawMessage) (any, error, bool) {
	s := server.dependencies.Knowledge
	switch operation {
	case "service.attachment":
		var in struct {
			ConversationID string                         `json:"conversation_id"`
			ID             string                         `json:"id"`
			Authority      agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.Attachment(ctx, in.ConversationID, in.ID, in.Authority)
		return v, e, true
	case "service.attachment_access":
		var in struct {
			Action    string                         `json:"action"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		_, e := s.AttachmentAccess(ctx, in.Action, in.Authority)
		return struct{}{}, e, true
	case "service.attachment_index_view":
		var in struct {
			Record    persistence.ConversationAttachmentRecord `json:"record"`
			Authority agentsdk.ConversationAuthority           `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		return s.AttachmentIndexView(ctx, in.Record, in.Authority), nil, true
	case "service.attachment_knowledge":
		var in struct {
			Conversation string                         `json:"conversation"`
			Operation    string                         `json:"operation"`
			Query        string                         `json:"query"`
			ID           string                         `json:"id"`
			Authority    agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.AttachmentKnowledge(ctx, in.Conversation, in.Operation, in.Query, in.ID, in.Authority)
		return v, e, true
	case "service.attachment_knowledge_access":
		var in struct {
			Conversation string                         `json:"conversation"`
			Authority    agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		scope, records, e := s.AttachmentKnowledgeAccess(ctx, in.Conversation, in.Authority)
		if e != nil {
			return nil, e, true
		}
		source, ok := scope.Source.(agentsdk.ManagedKnowledgeDocumentSource)
		if !ok {
			return nil, &agentsdk.Error{Class: "unavailable", Code: "knowledge.source_invalid"}, true
		}
		return struct {
			Scope   sourceDescriptor                                    `json:"scope"`
			Records map[string]persistence.ConversationAttachmentRecord `json:"records"`
		}{server.registerSource(source, scope.PermissionID), records}, nil, true
	case "service.attachment_knowledge_binding":
		var in struct {
			Conversation string                         `json:"conversation"`
			Authority    agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		scope, e := s.AttachmentKnowledgeBinding(ctx, in.Conversation, in.Authority)
		if e != nil {
			return nil, e, true
		}
		source, ok := scope.Source.(agentsdk.ManagedKnowledgeDocumentSource)
		if !ok {
			return nil, &agentsdk.Error{Class: "unavailable", Code: "knowledge.source_invalid"}, true
		}
		return server.registerSource(source, scope.PermissionID), nil, true
	case "service.attachment_record":
		var in struct {
			ConversationID string                         `json:"conversation_id"`
			ID             string                         `json:"id"`
			Authority      agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		repo, ok := server.dependencies.Repository.(persistence.ConversationAttachmentRepository)
		if !ok {
			return nil, &agentsdk.Error{Class: "unavailable", Code: "knowledge.attachments_unavailable"}, true
		}
		v, e := s.AttachmentRecord(ctx, repo, in.ConversationID, in.ID, in.Authority)
		return v, e, true
	case "service.attachments":
		var in struct {
			ConversationID string                         `json:"conversation_id"`
			After          string                         `json:"after"`
			Limit          int                            `json:"limit"`
			Authority      agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.Attachments(ctx, in.ConversationID, in.After, in.Limit, in.Authority)
		return v, e, true
	case "service.attachment_knowledge_authorize":
		var in struct {
			Input  agentsdk.ConversationToolRequest `json:"input"`
			Result agentsdk.ConversationToolResult  `json:"result"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		e := s.AuthorizeAttachmentKnowledgeResult(ctx, in.Input, in.Result)
		return struct{}{}, e, true
	case "service.attachment_index_check":
		var in struct {
			Conversation string                         `json:"conversation"`
			ID           string                         `json:"id"`
			Expected     int64                          `json:"expected"`
			Authority    agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.CheckAttachmentIndex(ctx, in.Conversation, in.ID, in.Expected, in.Authority)
		return v, e, true
	case "service.attachment_delete":
		var in struct {
			ConversationID string                         `json:"conversation_id"`
			ID             string                         `json:"id"`
			Expected       int64                          `json:"expected"`
			Authority      agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.DeleteAttachment(ctx, in.ConversationID, in.ID, in.Expected, in.Authority)
		return v, e, true
	case "service.attachment_download":
		var in struct {
			ConversationID string                         `json:"conversation_id"`
			ID             string                         `json:"id"`
			Authority      agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.DownloadAttachment(ctx, in.ConversationID, in.ID, in.Authority)
		return v, e, true
	case "service.attachment_index":
		var in struct {
			Conversation string                         `json:"conversation"`
			ID           string                         `json:"id"`
			Expected     int64                          `json:"expected"`
			Authority    agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.IndexAttachment(ctx, in.Conversation, in.ID, in.Expected, in.Authority)
		return v, e, true
	case "service.attachment_upload":
		var in struct {
			ConversationID string                                `json:"conversation_id"`
			Input          agentsdk.ConversationAttachmentUpload `json:"input"`
			Authority      agentsdk.ConversationAuthority        `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.UploadAttachment(ctx, in.ConversationID, in.Input, in.Authority)
		return v, e, true
	}
	return server.dispatchKnowledgeService(ctx, operation, raw)
}
