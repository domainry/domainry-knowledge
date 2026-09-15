package provider

import (
	"bytes"
	"context"
	"encoding/json"
	"slices"
	"strings"

	sdk "github.com/domainry/domainry-agent-sdk"
	connector "github.com/domainry/domainry-connector-sdk"
)

// The gateway and shared reads use the same live workspace/ACL policy. Returned
// IDs are copied so an in-flight response cannot silently adopt later grants.
func (k *Knowledge) knowledgeAccessPolicy(ctx context.Context, a sdk.ConversationAuthority) ([]string, error) {
	denied := func() error { return connector.PermanentError("knowledge_api.access_denied", nil) }
	if !a.Known || strings.TrimSpace(a.RuntimeID) == "" || strings.TrimSpace(a.UserID) == "" || strings.TrimSpace(a.WorkspaceID) == "" {
		return nil, denied()
	}
	if k.config.AuthorizeWorkspace != nil {
		if err := k.config.AuthorizeWorkspace(ctx, a); err != nil {
			return nil, denied()
		}
	} else if a.WorkspaceID != k.config.WorkspaceID {
		return nil, denied()
	}
	if k.config.PermissionIDs != nil {
		ids, err := k.config.PermissionIDs(ctx, a)
		if err != nil {
			return nil, denied()
		}
		return slices.Clone(ids), nil
	}
	return slices.Clone(k.config.DocumentPermissionIDs), nil
}

func (k *Knowledge) sharedKnowledgePolicy(ctx context.Context, a sdk.ConversationAuthority) ([]string, error) {
	ids, err := k.knowledgeAccessPolicy(ctx, a)
	if err != nil {
		return nil, knowledgeFailure("access_denied")
	}
	slices.Sort(ids)
	return slices.Compact(ids), nil
}

func (k *Knowledge) AuthorizeSharedKnowledgeResultRead(ctx context.Context, saved sdk.ConversationKnowledgeResult, reader, producer sdk.ConversationAuthority) error {
	if !reader.Known || !producer.Known || reader.RuntimeID == "" || producer.RuntimeID != reader.RuntimeID || reader.WorkspaceID == "" || producer.WorkspaceID != reader.WorkspaceID || reader.UserID == "" || producer.UserID == "" || saved.ConversationID != "" {
		return knowledgeFailure("access_denied")
	}
	for _, c := range saved.Citations {
		if c.ConversationID != "" {
			return knowledgeFailure("access_denied")
		}
	}
	if reader == producer {
		return k.AuthorizeKnowledgeResultRead(ctx, saved, reader)
	}
	readerPolicy, err := k.sharedKnowledgePolicy(ctx, reader)
	if err != nil {
		return err
	}
	if err := k.AuthorizeKnowledgeResultRead(ctx, saved, producer); err != nil {
		return err
	}
	var current sdk.ConversationKnowledgeResult
	if saved.Operation == "search" {
		current, err = k.SearchKnowledge(ctx, saved.Query, reader)
	} else {
		current, err = k.ReadKnowledge(ctx, saved.DocumentID, reader)
	}
	if err != nil {
		return err
	}
	if !bytes.Equal(current.Data, saved.Data) {
		return &sdk.Error{Class: "conflict", Code: "agent.conversation.knowledge_source_changed"}
	}
	// Current data is already normalized under the reader. Bind its citations
	// to the original scope only for comparison, never for a remote request.
	current.ScopeSHA256 = k.knowledgeScope(producer)
	decoder := json.NewDecoder(bytes.NewReader(current.Data))
	decoder.UseNumber()
	var value any
	if decoder.Decode(&value) != nil {
		return knowledgeFailure("response_invalid")
	}
	current.Citations, err = k.citations(current, value)
	if err != nil {
		return err
	}
	one, _ := json.Marshal(saved.Citations)
	two, _ := json.Marshal(current.Citations)
	if len(saved.Citations) > 0 && !bytes.Equal(one, two) {
		return &sdk.Error{Class: "conflict", Code: "agent.conversation.knowledge_source_changed"}
	}
	if err := k.AuthorizeKnowledgeResultRead(ctx, saved, producer); err != nil {
		return err
	}
	currentPolicy, err := k.sharedKnowledgePolicy(ctx, reader)
	if err != nil {
		return err
	}
	if !slices.Equal(readerPolicy, currentPolicy) {
		return knowledgeFailure("access_denied")
	}
	return nil
}

func (k *Knowledge) SharedKnowledgeExtractionPassages(ctx context.Context, saved sdk.ConversationKnowledgeResult, reader, producer sdk.ConversationAuthority) ([]sdk.KnowledgeDocumentPassage, error) {
	if err := sdk.AuthorizeSharedKnowledgeResultRead(ctx, k, saved, reader, producer); err != nil {
		return nil, err
	}
	passages, err := k.KnowledgeExtractionPassages(ctx, saved, producer)
	if err != nil {
		return nil, err
	}
	if err := sdk.AuthorizeSharedKnowledgeResultRead(ctx, k, saved, reader, producer); err != nil {
		return nil, err
	}
	return passages, nil
}

var _ sdk.ConversationKnowledgeSharedResultReadSource = (*Knowledge)(nil)
var _ sdk.KnowledgeSharedExtractionContentSource = (*Knowledge)(nil)
