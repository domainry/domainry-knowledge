package provider

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"slices"
	"strings"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	connector "github.com/domainry/domainry-connector-sdk"
	"github.com/domainry/domainry-connectors/providers/knowledge_base/http_api"
	knowledgeprovider "github.com/domainry/domainry-knowledge-sdk/provider"
	connectortransport "github.com/domainry/domainry-knowledge/internal/infrastructure/connectortransport"
)

// KnowledgeConfig binds one Agent workspace to one remote team/knowledge base.
// PermissionIDs, when provided, must derive access from the authenticated
// authority. Browser input and model output must never supply permissions.
type KnowledgeConfig = knowledgeprovider.Config

var KnowledgeConfigFromEnvironment = knowledgeprovider.ConfigFromEnvironment

type Knowledge struct {
	config  KnowledgeConfig
	adapter connector.Adapter
}

// NewKnowledge binds the shared official Provider to this host's transport.
// A nil result means retrieval is disabled, without a typed-nil interface.
func NewKnowledge(c KnowledgeConfig) (*Knowledge, error) {
	if !c.Configured() {
		return nil, nil
	}
	if c.InvalidResponseMapping {
		return nil, fmt.Errorf("invalid knowledge response mapping JSON")
	}
	if c.InvalidAnalysisDocumentIDs {
		return nil, fmt.Errorf("invalid knowledge analysis document IDs JSON")
	}
	if c.DocumentPermissionIDs != nil {
		if len(c.DocumentPermissionIDs) == 0 || len(c.DocumentPermissionIDs) > 100 || c.PermissionIDs != nil || c.AuthorizeWorkspace != nil {
			return nil, fmt.Errorf("fixed document permissions must be nonempty and cannot use dynamic authority policy")
		}
		c.DocumentPermissionIDs = slices.Clone(c.DocumentPermissionIDs)
		slices.Sort(c.DocumentPermissionIDs)
		c.DocumentPermissionIDs = slices.Compact(c.DocumentPermissionIDs)
	}
	if c.AnalysisDocumentIDs != nil {
		if len(c.AnalysisDocumentIDs) == 0 || len(c.AnalysisDocumentIDs) > 50 {
			return nil, fmt.Errorf("analysis document IDs must contain between 1 and 50 values")
		}
		if strings.TrimSpace(c.RuntimeID) == "" {
			return nil, fmt.Errorf("Runtime ID is required for analysis documents")
		}
		c.AnalysisDocumentIDs = slices.Clone(c.AnalysisDocumentIDs)
		for _, id := range c.AnalysisDocumentIDs {
			if strings.TrimSpace(id) == "" || strings.TrimSpace(id) != id || len(id) > 256 {
				return nil, fmt.Errorf("invalid analysis document ID")
			}
		}
		slices.Sort(c.AnalysisDocumentIDs)
		c.AnalysisDocumentIDs = slices.Compact(c.AnalysisDocumentIDs)
	}
	if err := validateKnowledgeMapping(c.ResponseMapping); err != nil {
		return nil, err
	}
	if c.ResponseMapping != nil {
		// Do not retain a caller-owned mutable policy pointer.
		raw, _ := json.Marshal(c.ResponseMapping)
		var copy KnowledgeResponseMapping
		_ = json.Unmarshal(raw, &copy)
		c.ResponseMapping = &copy
	}
	c.BaseURL = strings.TrimRight(strings.TrimSpace(c.BaseURL), "/")
	c.APIKey, c.TeamID, c.KBID, c.WorkspaceID = strings.TrimSpace(c.APIKey), strings.TrimSpace(c.TeamID), strings.TrimSpace(c.KBID), strings.TrimSpace(c.WorkspaceID)
	if c.BaseURL == "" || c.APIKey == "" || c.TeamID == "" || c.KBID == "" || c.WorkspaceID == "" {
		return nil, fmt.Errorf("knowledge API origin, API key, team ID, knowledge base ID and Agent workspace ID are required")
	}
	if c.TopK == 0 {
		c.TopK = 5
	}
	if c.TopK < 1 || c.TopK > 20 {
		return nil, fmt.Errorf("knowledge top_k must be between 1 and 20")
	}
	if c.Transport == nil {
		var transport *connectortransport.HTTP
		var err error
		if c.DocumentManagement {
			transport, err = connectortransport.NewKnowledgeDocumentHTTP(c.BaseURL, c.KBID, c.Client)
		} else {
			transport, err = connectortransport.NewHTTP(c.BaseURL, c.Client)
		}
		if err != nil {
			return nil, err
		}
		c.Transport = transport
	}
	adapter, err := httpapi.New(c.Transport)
	if err != nil {
		return nil, err
	}
	k := &Knowledge{config: c, adapter: adapter}
	if err = adapter.(connector.ConfigValidator).ValidateConfig(k.connection()); err != nil {
		return nil, fmt.Errorf("invalid knowledge provider configuration")
	}
	return k, nil
}

func (k *Knowledge) connection() connector.Connection {
	c := connector.Connection{Key: "agent_knowledge", WorkspaceID: k.config.WorkspaceID, ConnectorKey: httpapi.ConnectorKey, ProviderKey: httpapi.ProviderKey, Config: map[string]any{"base_url": k.config.BaseURL, "team_id": k.config.TeamID, "kb_id": k.config.KBID}}
	if k.config.DocumentPermissionIDs != nil {
		c.Config["document_permission_ids"] = slices.Clone(k.config.DocumentPermissionIDs)
	}
	if k.config.AnalysisDocumentIDs != nil {
		c.Config["analysis_document_ids"] = slices.Clone(k.config.AnalysisDocumentIDs)
	}
	return c
}

func knowledgeFailure(code string) error {
	class := "unavailable"
	if code == "access_denied" {
		class = "forbidden"
	}
	if code == "not_found" {
		class = "not_found"
	}
	return &agentsdk.Error{Class: class, Code: "agent.conversation.knowledge_" + code}
}
func knowledgeConnectorError(err error) error {
	if errors.Is(err, context.Canceled) {
		return context.Canceled
	}
	if code, ok := connector.ProviderErrorCodeOf(err); ok && strings.HasPrefix(code, "knowledge_api.") {
		return knowledgeFailure(strings.TrimPrefix(code, "knowledge_api."))
	}
	return knowledgeFailure("failed")
}

func (k *Knowledge) Search(ctx context.Context, query string, authority agentsdk.ConversationAuthority) (json.RawMessage, error) {
	out, err := connector.Call(ctx, knowledgeGateway{k, authority}, httpapi.Search, httpapi.SearchInput{Query: query, TopK: k.config.TopK})
	if err != nil {
		return nil, knowledgeConnectorError(err)
	}
	return json.Marshal(out)
}

// Fetch exposes the same shared Connector operation with the same host policy.
func (k *Knowledge) Fetch(ctx context.Context, docID string, authority agentsdk.ConversationAuthority) (json.RawMessage, error) {
	out, err := connector.Call(ctx, knowledgeGateway{k, authority}, httpapi.Fetch, httpapi.FetchInput{DocID: docID})
	if err != nil {
		return nil, knowledgeConnectorError(err)
	}
	return json.Marshal(out)
}

type knowledgeGateway struct {
	knowledge *Knowledge
	authority agentsdk.ConversationAuthority
}

func (g knowledgeGateway) Call(ctx context.Context, request connector.CallRequest) (connector.CallResult, error) {
	k, a := g.knowledge, g.authority
	ids, err := k.knowledgeAccessPolicy(ctx, a)
	if err != nil {
		return connector.CallResult{}, err
	}
	request.Connection = k.connection()
	request.Connection.WorkspaceID = a.WorkspaceID
	request.Principal = connector.Principal{IsAuthenticated: true, UserID: a.UserID, WorkspaceID: a.WorkspaceID}
	request.Secrets = map[string]string{"api_key": k.config.APIKey}
	if k.config.DocumentPermissionIDs != nil || k.config.PermissionIDs != nil {
		request.Connection.Config["permission_ids_by_user"] = map[string][]string{a.UserID: ids}
	}
	return k.adapter.Call(ctx, request)
}
