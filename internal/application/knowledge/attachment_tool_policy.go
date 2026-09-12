package application

import (
	"context"
	"encoding/json"
	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-tools-sdk/schema"
)

func attachmentKnowledgeTool(key string) (agentsdk.ConversationToolDefinition, bool) {
	for _, d := range agentsdk.AttachmentConversationTools() {
		if d.Key == key {
			return d, true
		}
	}
	return agentsdk.ConversationToolDefinition{}, false
}
func privateRemoteAttachmentCall(call agentsdk.ConversationToolCall) bool {
	_, ok := attachmentKnowledgeTool(call.Name)
	return ok
}

type attachmentKnowledgeArguments struct {
	Query        string `json:"query"`
	AttachmentID string `json:"attachment_id"`
}

func attachmentToolArguments(in agentsdk.ConversationToolRequest) (attachmentKnowledgeArguments, error) {
	var args attachmentKnowledgeArguments
	d, ok := attachmentKnowledgeTool(in.Call.Name)
	if !ok || conversationDigest(d) != conversationDigest(in.Definition) {
		return args, conversationFailure("conflict", "tool_changed")
	}
	compiled, err := schema.CompileSchema(d.InputSchema)
	if err != nil || schema.ValidateJSON(compiled, []byte(in.Call.Arguments)) != nil {
		return args, conversationFailure("bad_request", "arguments_invalid")
	}
	err = json.Unmarshal([]byte(in.Call.Arguments), &args)
	return args, err
}
func (s *Service) authorizeAttachmentKnowledgeTool(ctx context.Context, in agentsdk.ConversationToolRequest) (agentsdk.ConversationToolAuthorization, error) {
	var denied agentsdk.ConversationToolAuthorization
	d, ok := attachmentKnowledgeTool(in.Definition.Key)
	if !ok || conversationDigest(d) != conversationDigest(in.Definition) || s.options.PersonalAuthorizer == nil {
		return denied, nil
	}
	bound := false
	for _, b := range s.options.AttachmentKnowledge {
		bound = bound || b.WorkspaceID == in.Authority.WorkspaceID
	}
	if !bound {
		return denied, nil
	}
	if _, err := s.AttachmentAccess(ctx, "attachments_download", in.Authority); err != nil {
		return denied, nil
	}
	if in.ConversationID != "" {
		parent, err := s.contextReader().Get(ctx, in.ConversationID, in.Authority)
		if err != nil {
			return denied, err
		}
		if parent.Archived {
			return denied, nil
		}
	}
	return s.options.PersonalAuthorizer.AuthorizeConversationTool(ctx, in)
}
