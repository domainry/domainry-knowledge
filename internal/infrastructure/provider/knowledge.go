package provider

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"slices"
	"strings"

	connector "github.com/domainry/domainry-connector-sdk"
	"github.com/domainry/domainry-connector-sdk/providers/knowledge_base/http_api"
	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgeprovider "github.com/domainry/domainry-knowledge-sdk/provider"
	connectortransport "github.com/domainry/domainry-knowledge/internal/infrastructure/connectortransport"
)

// KnowledgeConfig binds one Knowledge workspace to one remote team/knowledge base.
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
func NewKnowledge(c KnowledgeConfig, adapterFactory knowledgeprovider.AdapterFactory) (*Knowledge, error) {
	if !c.Configured() {
		return nil, nil
	}
	if adapterFactory == nil {
		return nil, fmt.Errorf("knowledge provider adapter factory is required")
	}
	if c.InvalidResponseMapping {
		return nil, fmt.Errorf("invalid knowledge response mapping JSON")
	}
	if c.InvalidAnalysisDocumentIDs {
		return nil, fmt.Errorf("invalid knowledge analysis document IDs JSON")
	}
	if c.InvalidSearchConfig {
		return nil, fmt.Errorf("invalid knowledge search configuration")
	}
	if c.DocumentManagement && c.ResponseMapping == nil {
		c.ResponseMapping = officialKnowledgeResponseMapping()
	}
	if c.DocumentPermissionIDs != nil {
		var permissionErr error
		c.DocumentPermissionIDs, permissionErr = normalizedKnowledgeQueryPermissions(c.DocumentPermissionIDs)
		if permissionErr != nil || len(c.DocumentPermissionIDs) == 0 || len(c.DocumentPermissionIDs) > 256 || knowledgeQueryPermissionBytes(c.DocumentPermissionIDs) > 8192 || c.PermissionIDs != nil || c.AuthorizeWorkspace != nil {
			return nil, fmt.Errorf("fixed document permissions must be nonempty and cannot use dynamic authority policy")
		}
	}
	if c.ReadPermissionIDs != nil {
		var permissionErr error
		c.ReadPermissionIDs, permissionErr = normalizedKnowledgeQueryPermissions(c.ReadPermissionIDs)
		if permissionErr != nil || len(c.ReadPermissionIDs) == 0 || len(c.ReadPermissionIDs) > knowledgeQueryPermissionMaximumIDs || knowledgeQueryPermissionBytes(c.ReadPermissionIDs) > knowledgeQueryPermissionMaximumBytes || c.PermissionIDs != nil || c.AuthorizeWorkspace != nil {
			return nil, fmt.Errorf("fixed read permissions must be nonempty and cannot use dynamic authority policy")
		}
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
		return nil, fmt.Errorf("knowledge API origin, API key, team ID, knowledge base ID and Knowledge workspace ID are required")
	}
	if c.TopK == 0 {
		c.TopK = 5
	}
	if c.TopK < 1 || c.TopK > 20 {
		return nil, fmt.Errorf("knowledge top_k must be between 1 and 20")
	}
	if c.SearchMode != "" && c.SearchMode != "hybrid" && c.SearchMode != "dense" && c.SearchMode != "sparse" {
		return nil, fmt.Errorf("knowledge search mode must be hybrid, dense or sparse")
	}
	if len(c.SearchRecordKinds) > 32 {
		return nil, fmt.Errorf("knowledge record kinds must contain at most 32 values")
	}
	if c.SearchRecordKinds != nil {
		c.SearchRecordKinds = slices.Clone(c.SearchRecordKinds)
		slices.Sort(c.SearchRecordKinds)
		for i, kind := range c.SearchRecordKinds {
			if !validKnowledgeRecordKind(kind) || i > 0 && kind == c.SearchRecordKinds[i-1] {
				return nil, fmt.Errorf("invalid knowledge record kind")
			}
		}
	}
	if c.SearchRerank != nil {
		value := *c.SearchRerank
		c.SearchRerank = &value
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
	adapter, err := adapterFactory(c.Transport)
	if err != nil {
		return nil, err
	}
	if adapter == nil {
		return nil, fmt.Errorf("knowledge provider adapter factory returned nil")
	}
	k := &Knowledge{config: c, adapter: adapter}
	validator, ok := adapter.(connector.ConfigValidator)
	if !ok {
		return nil, fmt.Errorf("knowledge provider adapter does not validate configuration")
	}
	if err = validator.ValidateConfig(k.connection()); err != nil {
		return nil, fmt.Errorf("invalid knowledge provider configuration")
	}
	return k, nil
}

func validKnowledgeRecordKind(value string) bool {
	if strings.TrimSpace(value) == "" || strings.TrimSpace(value) != value || len(value) > 128 {
		return false
	}
	for _, r := range value {
		if r >= 'a' && r <= 'z' || r >= 'A' && r <= 'Z' || r >= '0' && r <= '9' || strings.ContainsRune("_-#@./:", r) {
			continue
		}
		return false
	}
	return true
}

func (k *Knowledge) connection() connector.Connection {
	c := connector.Connection{Key: "knowledge_primary", WorkspaceID: k.config.WorkspaceID, ConnectorKey: httpapi.ConnectorKey, ProviderKey: httpapi.ProviderKey, Config: map[string]any{"base_url": k.config.BaseURL, "team_id": k.config.TeamID, "kb_id": k.config.KBID}}
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
	return &agentsdk.Error{Class: class, Code: "knowledge.knowledge_" + code}
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

func (k *Knowledge) Search(ctx context.Context, query string, authority agentsdk.Authority) (json.RawMessage, error) {
	out, err := connector.Call(ctx, knowledgeGateway{knowledge: k, authority: authority}, httpapi.Search, httpapi.SearchInput{Query: query, TopK: k.config.TopK, RecordKinds: slices.Clone(k.config.SearchRecordKinds), Mode: k.config.SearchMode, Rerank: k.config.SearchRerank})
	if err != nil {
		return nil, knowledgeConnectorError(err)
	}
	return json.Marshal(out)
}

// Fetch exposes the same shared Connector operation with the same host policy.
func (k *Knowledge) Fetch(ctx context.Context, docID string, authority agentsdk.Authority) (json.RawMessage, error) {
	out, err := connector.Call(ctx, knowledgeGateway{knowledge: k, authority: authority}, httpapi.Fetch, httpapi.FetchInput{DocID: docID})
	if err != nil {
		return nil, knowledgeConnectorError(err)
	}
	return json.Marshal(out)
}

type knowledgeGateway struct {
	knowledge           *Knowledge
	authority           agentsdk.Authority
	permissionIDs       []string
	overridePermissions bool
}

func (g knowledgeGateway) Call(ctx context.Context, request connector.CallRequest) (connector.CallResult, error) {
	k, a := g.knowledge, g.authority
	ids, err := k.knowledgeAccessPolicy(ctx, a)
	if err != nil {
		return connector.CallResult{}, err
	}
	request.Connection = k.connection()
	if g.overridePermissions {
		ids = slices.Clone(g.permissionIDs)
		request.Connection.Config["document_permission_ids"] = slices.Clone(ids)
	}
	request.Connection.WorkspaceID = a.WorkspaceID
	request.Principal = connector.Principal{IsAuthenticated: true, UserID: a.UserID, WorkspaceID: a.WorkspaceID}
	request.Secrets = map[string]string{"api_key": k.config.APIKey}
	if k.config.ReadPermissionIDs != nil || k.config.DocumentPermissionIDs != nil || k.config.PermissionIDs != nil {
		request.Connection.Config["permission_ids_by_user"] = map[string][]string{a.UserID: ids}
	}
	return k.adapter.Call(ctx, request)
}
