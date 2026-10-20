package provider

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"math"
	"net/url"
	"regexp"
	"strconv"
	"strings"
	"unicode/utf8"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	knowledgeprovider "github.com/domainry/domainry-knowledge-sdk/provider"
)

// A host supplies an explicit, verified mapping; absent configuration never
// guesses field names. Live fetch responses can keep document metadata apart
// from the chunk array.
// Items is an RFC 6901 pointer into the response. Field pointers are relative to
// each selected object. Many distinguishes an array from one document object.
type KnowledgeCitationMapping = knowledgeprovider.CitationMapping
type KnowledgeResponseMapping = knowledgeprovider.ResponseMapping

func knowledgeMappingJSON(raw string) (*KnowledgeResponseMapping, error) {
	var mapping KnowledgeResponseMapping
	decoder := json.NewDecoder(strings.NewReader(raw))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&mapping); err != nil {
		return nil, err
	}
	var extra any
	if decoder.Decode(&extra) != io.EOF {
		return nil, fmt.Errorf("invalid trailing mapping JSON")
	}
	return &mapping, validateKnowledgeMapping(&mapping)
}

func citationPointerParts(pointer string) ([]string, error) {
	if pointer == "" {
		return nil, nil
	}
	if len(pointer) > 1024 || !utf8.ValidString(pointer) || pointer[0] != '/' || strings.ContainsRune(pointer, 0) {
		return nil, fmt.Errorf("invalid knowledge citation pointer")
	}
	parts := strings.Split(pointer[1:], "/")
	if len(parts) > 32 {
		return nil, fmt.Errorf("knowledge citation pointer too deep")
	}
	for i, p := range parts {
		var out strings.Builder
		for j := 0; j < len(p); j++ {
			if p[j] != '~' {
				out.WriteByte(p[j])
				continue
			}
			j++
			if j >= len(p) || (p[j] != '0' && p[j] != '1') {
				return nil, fmt.Errorf("invalid knowledge citation escape")
			}
			if p[j] == '0' {
				out.WriteByte('~')
			} else {
				out.WriteByte('/')
			}
		}
		parts[i] = out.String()
	}
	return parts, nil
}
func citationPointer(value any, pointer string) (any, bool) {
	parts, err := citationPointerParts(pointer)
	if err != nil {
		return nil, false
	}
	for _, part := range parts {
		switch node := value.(type) {
		case map[string]any:
			var ok bool
			value, ok = node[part]
			if !ok {
				return nil, false
			}
		case []any:
			n, err := strconv.Atoi(part)
			if err != nil || n < 0 || n >= len(node) || strconv.Itoa(n) != part {
				return nil, false
			}
			value = node[n]
		default:
			return nil, false
		}
	}
	return value, true
}
func validateKnowledgeMapping(mapping *KnowledgeResponseMapping) error {
	if mapping == nil {
		return nil
	}
	for operation, m := range map[string]*KnowledgeCitationMapping{"search": mapping.Search, "fetch": mapping.Fetch} {
		if m == nil {
			continue
		}
		if operation == "search" && m.DocumentID == "" {
			return fmt.Errorf("search citation mapping requires document ID")
		}
		if m.MetadataObject != nil {
			if operation != "fetch" {
				return fmt.Errorf("shared citation metadata is only supported for fetch")
			}
			if _, err := citationPointerParts(*m.MetadataObject); err != nil {
				return err
			}
		}
		for _, pointer := range []string{m.Items, m.DocumentID, m.Title, m.URL, m.Excerpt, m.ChunkID, m.DocumentVersion, m.ContentSHA256, m.SourceRevision, m.Page, m.Section, m.AnchorRef, m.RecordKind, m.Score} {
			if _, err := citationPointerParts(pointer); err != nil {
				return err
			}
		}
	}
	return nil
}
func citationText(item any, pointer string, limit int) (string, error) {
	if pointer == "" {
		return "", nil
	}
	value, ok := citationPointer(item, pointer)
	if !ok || value == nil {
		return "", nil
	}
	text, ok := value.(string)
	if !ok || !utf8.ValidString(text) || strings.ContainsRune(text, 0) || len(text) > limit {
		return "", knowledgeFailure("citation_mapping_invalid")
	}
	return text, nil
}

func citationMappedValue(item, metadata any, pointer string) (any, bool) {
	if pointer == "" {
		return nil, false
	}
	if value, ok := citationPointer(item, pointer); ok {
		return value, true
	}
	if metadata != nil {
		return citationPointer(metadata, pointer)
	}
	return nil, false
}

func citationMappedText(item, metadata any, pointer string, limit int) (string, error) {
	value, ok := citationMappedValue(item, metadata, pointer)
	if !ok || value == nil {
		return "", nil
	}
	text, ok := value.(string)
	if !ok || !utf8.ValidString(text) || strings.ContainsRune(text, 0) || len(text) > limit {
		return "", knowledgeFailure("citation_mapping_invalid")
	}
	return text, nil
}

func citationMappedInt64(item, metadata any, pointer string, maximum int64) (int64, error) {
	value, ok := citationMappedValue(item, metadata, pointer)
	if !ok || value == nil {
		return 0, nil
	}
	var number int64
	switch typed := value.(type) {
	case json.Number:
		parsed, err := typed.Int64()
		if err != nil {
			return 0, knowledgeFailure("citation_mapping_invalid")
		}
		number = parsed
	case float64:
		if math.Trunc(typed) != typed || typed > math.MaxInt64 || typed < math.MinInt64 {
			return 0, knowledgeFailure("citation_mapping_invalid")
		}
		number = int64(typed)
	default:
		return 0, knowledgeFailure("citation_mapping_invalid")
	}
	if number < 0 || number > maximum {
		return 0, knowledgeFailure("citation_mapping_invalid")
	}
	return number, nil
}

func citationMappedFloat64(item, metadata any, pointer string) (float64, error) {
	value, ok := citationMappedValue(item, metadata, pointer)
	if !ok || value == nil {
		return 0, nil
	}
	var number float64
	switch typed := value.(type) {
	case json.Number:
		parsed, err := typed.Float64()
		if err != nil {
			return 0, knowledgeFailure("citation_mapping_invalid")
		}
		number = parsed
	case float64:
		number = typed
	default:
		return 0, knowledgeFailure("citation_mapping_invalid")
	}
	if math.IsNaN(number) || math.IsInf(number, 0) || math.Abs(number) > 1e12 {
		return 0, knowledgeFailure("citation_mapping_invalid")
	}
	return number, nil
}

func citationMappedLocation(item, metadata any, mapping *KnowledgeCitationMapping) (*agentsdk.DocumentLocation, error) {
	page, err := citationMappedInt64(item, metadata, mapping.Page, 10_000_000)
	if err != nil {
		return nil, err
	}
	section, err := citationMappedText(item, metadata, mapping.Section, 4096)
	if err != nil {
		return nil, err
	}
	chunk, err := citationMappedText(item, metadata, mapping.ChunkID, 512)
	if err != nil {
		return nil, err
	}
	anchor, err := citationMappedText(item, metadata, mapping.AnchorRef, 4096)
	if err != nil {
		return nil, err
	}
	recordKind, err := citationMappedText(item, metadata, mapping.RecordKind, 32)
	if err != nil {
		return nil, err
	}
	location := agentsdk.DocumentLocation{Page: int(page), Section: section, ChunkID: chunk}
	if anchor != "" {
		applyKnowledgeAnchor(anchor, &location)
	}
	if recordKind == "audio" || recordKind == "video" {
		location.MediaKind = recordKind
	}
	if location.Page == 0 && location.Slide == 0 && location.Section == "" && location.ChunkID == "" && location.Sheet == "" && location.Row == 0 && location.RowEnd == 0 && location.Cell == "" && location.Line == 0 && location.LineEnd == 0 && location.Paragraph == 0 && location.JSONPath == "" && location.HTMLID == "" && location.StartMS == 0 && location.EndMS == 0 && location.MediaKind == "" {
		return nil, nil
	}
	return &location, nil
}

var knowledgeAnchorFields = map[string]*regexp.Regexp{
	"page":          regexp.MustCompile(`(?:^|[, {])["']page["']\s*:\s*([0-9]+)`),
	"slide":         regexp.MustCompile(`(?:^|[, {])["']slide["']\s*:\s*([0-9]+)`),
	"line_range":    regexp.MustCompile(`(?:^|[, {])["']line_range["']\s*:\s*\[\s*([0-9]+)\s*,\s*([0-9]+)\s*\]`),
	"row_range":     regexp.MustCompile(`(?:^|[, {])["']row_range["']\s*:\s*\[\s*([0-9]+)\s*,\s*([0-9]+)\s*\]`),
	"para_index":    regexp.MustCompile(`(?:^|[, {])["']para_index["']\s*:\s*([0-9]+)`),
	"time_range_ms": regexp.MustCompile(`(?:^|[, {])["']time_range_ms["']\s*:\s*\[\s*([0-9]+)\s*,\s*([0-9]+)\s*\]`),
}

var knowledgeAnchorTextFields = map[string]*regexp.Regexp{
	"sheet":     regexp.MustCompile(`(?:^|[, {])["']sheet["']\s*:\s*["']([^"'\\\x00]{0,128})["']`),
	"json_path": regexp.MustCompile(`(?:^|[, {])["']json_path["']\s*:\s*["']([^"'\\\x00]{0,512})["']`),
	"html_id":   regexp.MustCompile(`(?:^|[, {])["']html_id["']\s*:\s*["']([^"'\\\x00]{0,256})["']`),
}

// kb-builder materializes anchors using Python's bounded dict representation
// (for example {'time_range_ms': [0, 9000]}). Accept that exact numeric shape
// as well as JSON without evaluating provider-controlled text.
func applyKnowledgeAnchor(raw string, out *agentsdk.DocumentLocation) {
	if out == nil || len(raw) > 4096 {
		return
	}
	parse := func(key string, maximum int64) []int64 {
		match := knowledgeAnchorFields[key].FindStringSubmatch(raw)
		if len(match) < 2 {
			return nil
		}
		values := make([]int64, 0, len(match)-1)
		for _, value := range match[1:] {
			number, err := strconv.ParseInt(value, 10, 64)
			if err != nil || number < 0 || number > maximum {
				return nil
			}
			values = append(values, number)
		}
		return values
	}
	if values := parse("page", 10_000_000); len(values) == 1 {
		out.Page = int(values[0])
	}
	if values := parse("slide", 10_000_000); len(values) == 1 {
		out.Slide = int(values[0])
	}
	if values := parse("line_range", 10_000_000); len(values) == 2 && values[1] >= values[0] {
		out.Line, out.LineEnd = int(values[0]), int(values[1])
	}
	if values := parse("row_range", 10_000_000); len(values) == 2 && values[1] >= values[0] {
		out.Row, out.RowEnd = int(values[0]), int(values[1])
	}
	if values := parse("para_index", 10_000_000); len(values) == 1 {
		out.Paragraph = int(values[0])
	}
	if values := parse("time_range_ms", 7*24*60*60*1000); len(values) == 2 && values[1] >= values[0] {
		out.StartMS, out.EndMS = values[0], values[1]
	}
	for key, pattern := range knowledgeAnchorTextFields {
		match := pattern.FindStringSubmatch(raw)
		if len(match) != 2 || !utf8.ValidString(match[1]) {
			continue
		}
		switch key {
		case "sheet":
			out.Sheet = match[1]
		case "json_path":
			out.JSONPath = match[1]
		case "html_id":
			out.HTMLID = match[1]
		}
	}
}

func (k *Knowledge) citations(evidence agentsdk.ConversationKnowledgeResult, data any) ([]agentsdk.ConversationCitation, error) {
	if k.config.ResponseMapping == nil {
		return nil, nil
	}
	mapping := k.config.ResponseMapping.Search
	if evidence.Operation == "fetch" {
		mapping = k.config.ResponseMapping.Fetch
	}
	if mapping == nil {
		return nil, nil
	}
	selected, ok := citationPointer(data, mapping.Items)
	if !ok {
		return nil, knowledgeFailure("citation_mapping_invalid")
	}
	items := []any{selected}
	if mapping.Many {
		items, ok = selected.([]any)
		if !ok {
			return nil, knowledgeFailure("citation_mapping_invalid")
		}
	}
	if len(items) > 50 {
		return nil, knowledgeFailure("citation_limit_exceeded")
	}
	var metadata any
	if mapping.MetadataObject != nil {
		metadata, ok = citationPointer(data, *mapping.MetadataObject)
		if !ok {
			return nil, knowledgeFailure("citation_mapping_invalid")
		}
		if _, ok := metadata.(map[string]any); !ok {
			return nil, knowledgeFailure("citation_mapping_invalid")
		}
	}
	out := make([]agentsdk.ConversationCitation, 0, len(items))
	dataHash := sha256.Sum256(evidence.Data)
	for i, item := range items {
		if _, ok := item.(map[string]any); !ok {
			return nil, knowledgeFailure("citation_mapping_invalid")
		}
		docID, err := citationMappedText(item, metadata, mapping.DocumentID, 4096)
		if err != nil {
			return nil, err
		}
		if evidence.Operation == "fetch" && mapping.DocumentID == "" {
			docID = evidence.DocumentID
		}
		if strings.TrimSpace(docID) == "" || (evidence.Operation == "fetch" && docID != evidence.DocumentID) {
			return nil, knowledgeFailure("citation_mapping_invalid")
		}
		title, err := citationMappedText(item, metadata, mapping.Title, 512)
		if err != nil {
			return nil, err
		}
		link, err := citationMappedText(item, metadata, mapping.URL, 4096)
		if err != nil {
			return nil, err
		}
		if link != "" {
			parsed, err := url.Parse(link)
			if err != nil || parsed.Hostname() == "" || parsed.User != nil || (parsed.Scheme != "https" && parsed.Scheme != "http") || strings.ContainsAny(link, "\r\n\t") {
				link = ""
			}
		}
		excerpt, err := citationText(item, mapping.Excerpt, 512*1024)
		if err != nil {
			return nil, err
		}
		truncated := len(excerpt) > 2048
		if truncated {
			end := 2048
			for !utf8.RuneStart(excerpt[end]) {
				end--
			}
			excerpt = excerpt[:end]
		}
		chunkID, err := citationMappedText(item, metadata, mapping.ChunkID, 512)
		if err != nil {
			return nil, err
		}
		documentVersion, err := citationMappedInt64(item, metadata, mapping.DocumentVersion, math.MaxInt64)
		if err != nil {
			return nil, err
		}
		contentSHA256, err := citationMappedText(item, metadata, mapping.ContentSHA256, 128)
		if err != nil {
			return nil, err
		}
		sourceRevision, err := citationMappedText(item, metadata, mapping.SourceRevision, 512)
		if err != nil {
			return nil, err
		}
		score, err := citationMappedFloat64(item, metadata, mapping.Score)
		if err != nil {
			return nil, err
		}
		location, err := citationMappedLocation(item, metadata, mapping)
		if err != nil {
			return nil, err
		}
		citation := agentsdk.ConversationCitation{Provider: evidence.Provider, KBID: evidence.KBID, Operation: evidence.Operation, DocumentID: docID, ChunkID: chunkID, DocumentVersion: documentVersion, ContentSHA256: contentSHA256, SourceRevision: sourceRevision, Score: score, Title: title, URL: link, Excerpt: excerpt, ExcerptTruncated: truncated, Location: location}
		raw, _ := json.Marshal([]any{evidence.ScopeSHA256, hex.EncodeToString(dataHash[:]), mapping.Items, i, citation})
		sum := sha256.Sum256(raw)
		citation.ID = "kc_" + hex.EncodeToString(sum[:16])
		out = append(out, citation)
	}
	encoded, _ := json.Marshal(out)
	if len(encoded) > 192*1024 {
		return nil, knowledgeFailure("citation_limit_exceeded")
	}
	return out, nil
}
