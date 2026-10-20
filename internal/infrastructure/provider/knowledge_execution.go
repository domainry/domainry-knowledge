package provider

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-connector-sdk/providers/knowledge_base/http_api"
)

func (k *Knowledge) knowledgeScope(a agentsdk.ConversationAuthority) string {
	// Non-secret configuration and owner identity. Rotating an API key is not
	// a source change; switching team, KB, origin or owner is.
	raw, _ := json.Marshal([]any{k.config.BaseURL, k.config.TeamID, k.config.KBID, k.config.WorkspaceID, k.config.TopK, k.config.SearchMode, k.config.SearchRerank, k.config.SearchRecordKinds, a.RuntimeID, a.WorkspaceID, a.UserID})
	sum := sha256.Sum256(raw)
	return hex.EncodeToString(sum[:])
}

func (k *Knowledge) SearchKnowledge(ctx context.Context, query string, a agentsdk.ConversationAuthority) (agentsdk.ConversationKnowledgeResult, error) {
	raw, err := k.Search(ctx, query, a)
	return k.knowledgeEvidence(raw, err, "search", query, "", a)
}

func (k *Knowledge) ReadKnowledge(ctx context.Context, docID string, a agentsdk.ConversationAuthority) (agentsdk.ConversationKnowledgeResult, error) {
	raw, err := k.Fetch(ctx, docID, a)
	return k.knowledgeEvidence(raw, err, "fetch", "", docID, a)
}

func (k *Knowledge) knowledgeEvidence(raw json.RawMessage, err error, operation, query, docID string, a agentsdk.ConversationAuthority) (agentsdk.ConversationKnowledgeResult, error) {
	if err != nil {
		return agentsdk.ConversationKnowledgeResult{}, err
	}
	var envelope httpapi.Output
	if json.Unmarshal(raw, &envelope) != nil || envelope.Provider != httpapi.ProviderKey || envelope.KBID != k.config.KBID || len(envelope.Result) == 0 {
		return agentsdk.ConversationKnowledgeResult{}, knowledgeFailure("response_invalid")
	}
	// Normalize JSON once before exposing it; preserve integer precision and
	// all source fields without guessing an undocumented response schema.
	decoder := json.NewDecoder(bytes.NewReader(envelope.Result))
	decoder.UseNumber()
	var value any
	if decoder.Decode(&value) != nil {
		return agentsdk.ConversationKnowledgeResult{}, knowledgeFailure("response_invalid")
	}
	data, err := json.Marshal(value)
	if err != nil {
		return agentsdk.ConversationKnowledgeResult{}, knowledgeFailure("response_invalid")
	}
	evidence := agentsdk.ConversationKnowledgeResult{Provider: envelope.Provider, KBID: envelope.KBID, Operation: operation, Query: query, DocumentID: docID, ScopeSHA256: k.knowledgeScope(a), Data: data}
	if operation == "search" {
		evidence.SearchTopK = k.config.TopK
		evidence.SearchMode, evidence.SearchReranked, evidence.SearchDegraded, err = knowledgeSearchDiagnostics(value)
		if err != nil {
			return agentsdk.ConversationKnowledgeResult{}, err
		}
	}
	evidence.Citations, err = k.citations(evidence, value)
	return evidence, err
}

func knowledgeSearchDiagnostics(value any) (string, *bool, string, error) {
	object, ok := value.(map[string]any)
	if !ok {
		return "", nil, "", nil
	}
	mode := ""
	if raw, exists := object["mode_used"]; exists {
		var valid bool
		mode, valid = raw.(string)
		if !valid {
			return "", nil, "", knowledgeFailure("response_invalid")
		}
	}
	if mode != "" && mode != "hybrid" && mode != "dense" && mode != "sparse" {
		return "", nil, "", knowledgeFailure("response_invalid")
	}
	var reranked *bool
	if raw, exists := object["reranked"]; exists {
		value, valid := raw.(bool)
		if !valid {
			return "", nil, "", knowledgeFailure("response_invalid")
		}
		reranked = &value
	}
	degraded := ""
	if raw, exists := object["degraded_reason"]; exists {
		var valid bool
		degraded, valid = raw.(string)
		if !valid {
			return "", nil, "", knowledgeFailure("response_invalid")
		}
	}
	if degraded != "" && degraded != "embedder_unavailable" && degraded != "bm25_unavailable" && degraded != "rerank_unavailable" {
		return "", nil, "", knowledgeFailure("response_invalid")
	}
	return mode, reranked, degraded, nil
}

func equalOptionalBool(one, two *bool) bool {
	return one == nil && two == nil || one != nil && two != nil && *one == *two
}

func (k *Knowledge) RevalidateKnowledge(ctx context.Context, saved agentsdk.ConversationKnowledgeResult, a agentsdk.ConversationAuthority) error {
	if saved.LibraryID != "" || saved.ScopeSHA256 != k.knowledgeScope(a) || saved.Provider != httpapi.ProviderKey || saved.KBID != k.config.KBID {
		return knowledgeFailure("access_denied")
	}
	var current agentsdk.ConversationKnowledgeResult
	var err error
	switch {
	case saved.Operation == "search" && saved.Query != "" && saved.DocumentID == "":
		current, err = k.SearchKnowledge(ctx, saved.Query, a)
	case saved.Operation == "fetch" && saved.DocumentID != "" && saved.Query == "":
		current, err = k.ReadKnowledge(ctx, saved.DocumentID, a)
	default:
		return knowledgeFailure("response_invalid")
	}
	if err != nil {
		return err
	}
	// The service currently documents no ACL/version receipt or response
	// schema. Comparing the complete current response is conservative but
	// checks remote ACL changes as well as host permission changes. Never
	// replace a frozen model input with newly retrieved data on resume.
	if !bytes.Equal(saved.Data, current.Data) || saved.SearchTopK != current.SearchTopK || saved.SearchMode != current.SearchMode || saved.SearchDegraded != current.SearchDegraded || !equalOptionalBool(saved.SearchReranked, current.SearchReranked) {
		return &agentsdk.Error{Class: "conflict", Code: "agent.conversation.knowledge_source_changed"}
	}
	// Structured citations are part of the receipt, not an optional cache. A
	// receipt with removed or changed citations must never remain valid merely
	// because its provider JSON is unchanged.
	one, _ := json.Marshal(saved.Citations)
	two, _ := json.Marshal(current.Citations)
	if !bytes.Equal(one, two) {
		return &agentsdk.Error{Class: "conflict", Code: "agent.conversation.knowledge_source_changed"}
	}
	return nil
}

var _ agentsdk.ConversationKnowledgeSource = (*Knowledge)(nil)

// The upstream provides no independently signed ACL/version receipt. Verify
// the complete current source response through the read-only Connector using
// current workspace and source permission IDs. No Agent execution grant is
// consulted or manufactured, and a changed response never replaces saved data.
func (k *Knowledge) AuthorizeKnowledgeResultRead(ctx context.Context, saved agentsdk.ConversationKnowledgeResult, a agentsdk.ConversationAuthority) error {
	return k.RevalidateKnowledge(ctx, saved, a)
}

var _ agentsdk.ConversationKnowledgeResultReadSource = (*Knowledge)(nil)
