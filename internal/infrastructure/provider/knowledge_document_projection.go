package provider

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"math"
	"net/url"
	"slices"
	"sort"
	"strconv"
	"strings"
	"unicode"
	"unicode/utf8"

	connector "github.com/domainry/domainry-connector-sdk"
	httpapi "github.com/domainry/domainry-connector-sdk/providers/knowledge_base/http_api"
	agentsdk "github.com/domainry/domainry-knowledge-sdk"
)

const (
	// Measured against the current kb-search-api query boundary on 2026-10-20:
	// 4096 distinct IDs / 131072 CompactJSON ASCII bytes are accepted and the
	// next ID/byte is rejected before retrieval. See docs/evidence.
	knowledgeQueryPermissionMaximumIDs   = 4096
	knowledgeQueryPermissionMaximumBytes = 131072
)

func (k *Knowledge) KnowledgeDocumentSourceIdentity() string {
	u, _ := url.Parse(k.config.BaseURL)
	u.Scheme = strings.ToLower(u.Scheme)
	u.Host = strings.ToLower(u.Host)
	if u.Scheme == "https" && u.Port() == "443" || u.Scheme == "http" && u.Port() == "80" {
		u.Host = u.Hostname()
		if strings.Contains(u.Host, ":") {
			u.Host = "[" + u.Host + "]"
		}
	}
	raw, _ := json.Marshal([]string{"knowledge_document_source.v1", strings.TrimRight(u.String(), "/"), k.config.TeamID, k.config.KBID})
	h := sha256.Sum256(raw)
	return hex.EncodeToString(h[:])
}

func officialKnowledgeResponseMapping() *KnowledgeResponseMapping {
	root := ""
	return &KnowledgeResponseMapping{
		Search: &KnowledgeCitationMapping{Items: "/hits", Many: true, DocumentID: "/doc_id", Title: "/title", URL: "/source_url", Excerpt: "/snippet", ChunkID: "/record_id", DocumentVersion: "/doc_version", AnchorRef: "/anchor_ref", RecordKind: "/record_kind", Score: "/score"},
		Fetch:  &KnowledgeCitationMapping{MetadataObject: &root, Items: "/chunks", Many: true, DocumentID: "/doc_id", Title: "/title", URL: "/source_url", Excerpt: "/content", ChunkID: "/record_id", DocumentVersion: "/doc_version", AnchorRef: "/anchor_ref", RecordKind: "/record_kind"},
	}
}
func (k *Knowledge) KnowledgeDocumentManagementReady() error {
	if !k.config.DocumentManagement || k.config.PermissionIDs != nil || k.config.AuthorizeWorkspace != nil {
		return knowledgeFailure("document_management_unavailable")
	}
	return k.documentProjectionReady()
}

// Policy changes must not alter physical identity: the durable source guard
// must still recognize a managed KB after configuration is changed or removed.
func (k *Knowledge) KnowledgeDocumentAccessPolicySHA256() string {
	raw, _ := json.Marshal([]any{"knowledge_document_access.v1", k.KnowledgeDocumentSourceIdentity(), k.config.DocumentPermissionIDs})
	h := sha256.Sum256(raw)
	return hex.EncodeToString(h[:])
}
func (k *Knowledge) documentProjectionReady() error {
	m := k.config.ResponseMapping
	if m == nil || m.Search == nil || m.Fetch == nil || m.Search.Excerpt == "" || m.Fetch.Excerpt == "" {
		return knowledgeFailure("document_mapping_required")
	}
	return nil
}
func (k *Knowledge) SearchKnowledgeDocumentPassages(ctx context.Context, q string, a agentsdk.Authority) ([]agentsdk.KnowledgeDocumentPassage, error) {
	result, err := k.SearchKnowledgeDocuments(ctx, q, a)
	return result.Passages, err
}

func (k *Knowledge) SearchKnowledgeDocuments(ctx context.Context, q string, a agentsdk.Authority) (agentsdk.KnowledgeDocumentSearch, error) {
	return k.SearchKnowledgeDocumentsWithPermissions(ctx, q, nil, a)
}

func normalizedKnowledgeQueryPermissions(ids []string) ([]string, error) {
	values := append([]string(nil), ids...)
	sort.Strings(values)
	values = slices.Compact(values)
	for _, id := range values {
		if id == "" || len(id) > 128 || !utf8.ValidString(id) || strings.TrimFunc(id, func(r rune) bool { return unicode.IsSpace(r) || r >= 0x1c && r <= 0x1f }) != id || strings.ContainsFunc(id, func(r rune) bool { return r <= 0x1f || r == 0x7f }) {
			return nil, knowledgeFailure("access_denied")
		}
	}
	return values, nil
}

func knowledgeQueryPermissionBytes(ids []string) int {
	bytes := 2
	for index, id := range ids {
		if index > 0 {
			bytes++
		}
		bytes += len(strconv.QuoteToASCII(id))
	}
	return bytes
}

func knowledgeQueryPermissionBatches(base, page []string) ([][]string, error) {
	base, err := normalizedKnowledgeQueryPermissions(base)
	if err != nil || len(base) > knowledgeQueryPermissionMaximumIDs || knowledgeQueryPermissionBytes(base) > knowledgeQueryPermissionMaximumBytes {
		return nil, knowledgeFailure("access_denied")
	}
	page, err = normalizedKnowledgeQueryPermissions(page)
	if err != nil {
		return nil, err
	}
	baseSet := make(map[string]bool, len(base))
	for _, id := range base {
		baseSet[id] = true
	}
	additional := page[:0]
	for _, id := range page {
		if !baseSet[id] {
			additional = append(additional, id)
		}
	}
	if len(additional) == 0 {
		return [][]string{base}, nil
	}
	batches := [][]string{}
	current := append([]string(nil), base...)
	for _, id := range additional {
		candidate := append(append([]string(nil), current...), id)
		sort.Strings(candidate)
		if len(candidate) > knowledgeQueryPermissionMaximumIDs || knowledgeQueryPermissionBytes(candidate) > knowledgeQueryPermissionMaximumBytes {
			if len(current) == len(base) {
				return nil, knowledgeFailure("access_denied")
			}
			sort.Strings(current)
			batches = append(batches, current)
			current = append(append([]string(nil), base...), id)
			if len(current) > knowledgeQueryPermissionMaximumIDs || knowledgeQueryPermissionBytes(current) > knowledgeQueryPermissionMaximumBytes {
				return nil, knowledgeFailure("access_denied")
			}
			continue
		}
		current = candidate
	}
	sort.Strings(current)
	batches = append(batches, current)
	return batches, nil
}

func (k *Knowledge) searchKnowledgeDocumentsWithPermissionBatch(ctx context.Context, q string, permissionIDs []string, a agentsdk.Authority) (agentsdk.KnowledgeDocumentSearch, error) {
	var result agentsdk.KnowledgeDocumentSearch
	if e := k.documentProjectionReady(); e != nil {
		return result, e
	}
	out, e := connector.Call(ctx, knowledgeGateway{knowledge: k, authority: a, permissionIDs: permissionIDs, overridePermissions: true}, httpapi.Search, httpapi.SearchInput{Query: q, TopK: k.config.TopK, RecordKinds: slices.Clone(k.config.SearchRecordKinds), Mode: k.config.SearchMode, Rerank: k.config.SearchRerank})
	if e != nil {
		return result, knowledgeConnectorError(e)
	}
	raw, e := json.Marshal(out)
	if e != nil {
		return result, knowledgeFailure("response_invalid")
	}
	data, e := k.documentResponse(raw)
	if e != nil {
		return result, e
	}
	result.Passages, e = k.documentPassagesFromValue(data, k.config.ResponseMapping.Search, "")
	if e != nil {
		return result, e
	}
	result.TopK = k.config.TopK
	result.Mode, result.Reranked, result.DegradedReason, e = knowledgeSearchDiagnostics(data)
	return result, e
}

func (k *Knowledge) SearchKnowledgeDocumentsWithPermissions(ctx context.Context, q string, pagePermissionIDs []string, a agentsdk.Authority) (agentsdk.KnowledgeDocumentSearch, error) {
	base, err := k.knowledgeAccessPolicy(ctx, a)
	if err != nil {
		return agentsdk.KnowledgeDocumentSearch{}, knowledgeFailure("access_denied")
	}
	batches, err := knowledgeQueryPermissionBatches(base, pagePermissionIDs)
	if err != nil {
		return agentsdk.KnowledgeDocumentSearch{}, err
	}
	merged := agentsdk.KnowledgeDocumentSearch{TopK: k.config.TopK}
	byPassage := map[string]agentsdk.KnowledgeDocumentPassage{}
	for index, batch := range batches {
		current, searchErr := k.searchKnowledgeDocumentsWithPermissionBatch(ctx, q, batch, a)
		if searchErr != nil {
			return agentsdk.KnowledgeDocumentSearch{}, searchErr
		}
		if index == 0 {
			merged.Mode, merged.Reranked, merged.DegradedReason = current.Mode, current.Reranked, current.DegradedReason
		} else if merged.Mode != current.Mode || !equalOptionalBool(merged.Reranked, current.Reranked) || merged.DegradedReason != current.DegradedReason {
			return agentsdk.KnowledgeDocumentSearch{}, knowledgeFailure("response_invalid")
		}
		for _, passage := range current.Passages {
			key := passage.DocumentID + "\x00" + passage.ChunkID
			prior, exists := byPassage[key]
			if !exists || passage.Score > prior.Score {
				byPassage[key] = passage
			}
		}
	}
	for _, passage := range byPassage {
		merged.Passages = append(merged.Passages, passage)
	}
	sort.Slice(merged.Passages, func(i, j int) bool {
		if merged.Passages[i].Score != merged.Passages[j].Score {
			return merged.Passages[i].Score > merged.Passages[j].Score
		}
		if merged.Passages[i].DocumentID != merged.Passages[j].DocumentID {
			return merged.Passages[i].DocumentID < merged.Passages[j].DocumentID
		}
		return merged.Passages[i].ChunkID < merged.Passages[j].ChunkID
	})
	if len(merged.Passages) > merged.TopK {
		merged.Passages = merged.Passages[:merged.TopK]
	}
	return merged, nil
}
func (k *Knowledge) ReadKnowledgeDocumentPassages(ctx context.Context, id string, a agentsdk.Authority) ([]agentsdk.KnowledgeDocumentPassage, error) {
	return k.ReadKnowledgeDocumentPassagesWithPermissions(ctx, id, nil, a)
}

func (k *Knowledge) ReadKnowledgeDocumentPassagesWithPermissions(ctx context.Context, id string, pagePermissionIDs []string, a agentsdk.Authority) ([]agentsdk.KnowledgeDocumentPassage, error) {
	if e := k.documentProjectionReady(); e != nil {
		return nil, e
	}
	base, e := k.knowledgeAccessPolicy(ctx, a)
	if e != nil {
		return nil, knowledgeFailure("access_denied")
	}
	batches, e := knowledgeQueryPermissionBatches(base, pagePermissionIDs)
	if e != nil || len(batches) != 1 {
		return nil, knowledgeFailure("access_denied")
	}
	out, e := connector.Call(ctx, knowledgeGateway{knowledge: k, authority: a, permissionIDs: batches[0], overridePermissions: true}, httpapi.Fetch, httpapi.FetchInput{DocID: id})
	if e != nil {
		return nil, knowledgeConnectorError(e)
	}
	raw, e := json.Marshal(out)
	if e != nil {
		return nil, knowledgeFailure("response_invalid")
	}
	return k.documentPassages(raw, k.config.ResponseMapping.Fetch, id)
}
func (k *Knowledge) documentPassages(raw []byte, m *KnowledgeCitationMapping, id string) ([]agentsdk.KnowledgeDocumentPassage, error) {
	data, err := k.documentResponse(raw)
	if err != nil {
		return nil, err
	}
	return k.documentPassagesFromValue(data, m, id)
}

func (k *Knowledge) documentResponse(raw []byte) (any, error) {
	var envelope httpapi.Output
	if json.Unmarshal(raw, &envelope) != nil || envelope.Provider != httpapi.ProviderKey || envelope.KBID != k.config.KBID {
		return nil, knowledgeFailure("response_invalid")
	}
	var data any
	d := json.NewDecoder(bytes.NewReader(envelope.Result))
	d.UseNumber()
	if d.Decode(&data) != nil {
		return nil, knowledgeFailure("response_invalid")
	}
	return data, nil
}

func (k *Knowledge) documentPassagesFromValue(data any, m *KnowledgeCitationMapping, id string) ([]agentsdk.KnowledgeDocumentPassage, error) {
	selected, ok := citationPointer(data, m.Items)
	if !ok {
		return nil, knowledgeFailure("citation_mapping_invalid")
	}
	items := []any{selected}
	if m.Many {
		items, ok = selected.([]any)
		if !ok {
			return nil, knowledgeFailure("citation_mapping_invalid")
		}
	}
	if len(items) > 1000 {
		return nil, knowledgeFailure("document_passage_limit")
	}
	var metadata any
	if m.MetadataObject != nil {
		metadata, ok = citationPointer(data, *m.MetadataObject)
		if !ok {
			return nil, knowledgeFailure("citation_mapping_invalid")
		}
		if _, ok = metadata.(map[string]any); !ok {
			return nil, knowledgeFailure("citation_mapping_invalid")
		}
	}
	out := make([]agentsdk.KnowledgeDocumentPassage, 0, len(items))
	for _, item := range items {
		if _, ok := item.(map[string]any); !ok {
			return nil, knowledgeFailure("citation_mapping_invalid")
		}
		doc, e := citationMappedText(item, metadata, m.DocumentID, 4096)
		if e != nil {
			return nil, e
		}
		if id != "" && m.DocumentID == "" {
			doc = id
		}
		if strings.TrimSpace(doc) == "" || id != "" && doc != id {
			return nil, knowledgeFailure("citation_mapping_invalid")
		}
		title, e := citationMappedText(item, metadata, m.Title, 512)
		if e != nil {
			return nil, e
		}
		link, e := citationMappedText(item, metadata, m.URL, 4096)
		if e != nil {
			return nil, e
		}
		if link != "" {
			u, e := url.Parse(link)
			if e != nil || u.Hostname() == "" || u.User != nil || u.Scheme != "https" && u.Scheme != "http" || strings.ContainsAny(link, "\r\n\t") {
				link = ""
			}
		}
		content, e := citationText(item, m.Excerpt, 512*1024)
		if e != nil {
			return nil, e
		}
		chunkID, e := citationMappedText(item, metadata, m.ChunkID, 512)
		if e != nil {
			return nil, e
		}
		documentVersion, e := citationMappedInt64(item, metadata, m.DocumentVersion, math.MaxInt64)
		if e != nil {
			return nil, e
		}
		contentSHA256, e := citationMappedText(item, metadata, m.ContentSHA256, 128)
		if e != nil {
			return nil, e
		}
		sourceRevision, e := citationMappedText(item, metadata, m.SourceRevision, 512)
		if e != nil {
			return nil, e
		}
		score, e := citationMappedFloat64(item, metadata, m.Score)
		if e != nil {
			return nil, e
		}
		location, e := citationMappedLocation(item, metadata, m)
		if e != nil {
			return nil, e
		}
		out = append(out, agentsdk.KnowledgeDocumentPassage{DocumentID: doc, ChunkID: chunkID, DocumentVersion: documentVersion, ContentSHA256: contentSHA256, SourceRevision: sourceRevision, Score: score, Title: title, URL: link, Content: content, Location: location})
	}
	return out, nil
}

var _ agentsdk.ManagedKnowledgeDocumentSource = (*Knowledge)(nil)
var _ agentsdk.ManagedKnowledgeDocumentSearchSource = (*Knowledge)(nil)
var _ agentsdk.ManagedKnowledgeDocumentPermissionSource = (*Knowledge)(nil)
