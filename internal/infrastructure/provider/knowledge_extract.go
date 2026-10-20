package provider

import (
	"context"
	"encoding/json"

	"github.com/domainry/domainry-connector-sdk/providers/knowledge_base/http_api"
	agentsdk "github.com/domainry/domainry-knowledge-sdk"
)

func (k *Knowledge) KnowledgeExtractionPassages(ctx context.Context, saved agentsdk.Result, a agentsdk.Authority) ([]agentsdk.KnowledgeDocumentPassage, error) {
	if err := ctx.Err(); err != nil {
		return nil, err
	}
	if !a.Known || saved.Operation != "fetch" || saved.DocumentID == "" || saved.Query != "" || saved.LibraryID != "" || saved.Provider != httpapi.ProviderKey || saved.KBID != k.config.KBID || saved.ScopeSHA256 != k.knowledgeScope(a) {
		return nil, knowledgeFailure("access_denied")
	}
	if k.config.ResponseMapping == nil || k.config.ResponseMapping.Fetch == nil || k.config.ResponseMapping.Fetch.Excerpt == "" {
		return nil, knowledgeFailure("extraction_content_unavailable")
	}
	raw, err := json.Marshal(httpapi.Output{Provider: saved.Provider, KBID: saved.KBID, Result: saved.Data})
	if err != nil {
		return nil, knowledgeFailure("response_invalid")
	}
	passages, err := k.documentPassages(raw, k.config.ResponseMapping.Fetch, saved.DocumentID)
	if err != nil {
		return nil, err
	}
	for _, p := range passages {
		if p.DocumentID != saved.DocumentID {
			return nil, knowledgeFailure("response_invalid")
		}
	}
	return passages, nil
}

var _ agentsdk.ExtractionContentSource = (*Knowledge)(nil)
