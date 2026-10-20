package store

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/url"
	"regexp"
	"sort"
	"strings"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

const (
	knowledgeDocumentMaximumBlocks       = 20000
	knowledgeDocumentMaximumBlockDepth   = 64
	knowledgeDocumentMaximumObjectFields = 256
)

var knowledgeBlockIDPattern = regexp.MustCompile(`^[A-Za-z0-9][A-Za-z0-9:_-]{0,127}$`)

var knowledgeDocumentBlockTypes = map[string]bool{
	"paragraph": true, "heading": true, "bulletListItem": true,
	"numberedListItem": true, "checkListItem": true, "toggleListItem": true,
	"quote": true, "codeBlock": true, "divider": true, "table": true,
	"image": true, "video": true, "audio": true, "file": true,
	"callout": true, "formula": true, "button": true,
	"knowledgeReference": true, "syncedBlock": true, "columns": true, "column": true,
}

type knowledgeDocumentPayload struct {
	Blocks []json.RawMessage `json:"blocks"`
}

type knowledgeDocumentBlock struct {
	ID       string                   `json:"id"`
	Type     string                   `json:"type"`
	Props    map[string]any           `json:"props"`
	Content  any                      `json:"content"`
	Children []knowledgeDocumentBlock `json:"children"`
}

func normalizedPageContent(schema int, content, suppliedHash string) (knowledgesdk.PageContent, error) {
	if schema != knowledgesdk.PageContentSchemaVersion || !executionText(content, knowledgePageMaximumBytes, false) {
		return knowledgesdk.PageContent{}, conversationError("bad_request", "page_content_invalid")
	}
	var payload knowledgeDocumentPayload
	decoder := json.NewDecoder(strings.NewReader(content))
	decoder.UseNumber()
	if err := decoder.Decode(&payload); err != nil {
		return knowledgesdk.PageContent{}, conversationError("bad_request", "page_content_invalid")
	}
	if err := decoder.Decode(&struct{}{}); err != io.EOF || payload.Blocks == nil {
		return knowledgesdk.PageContent{}, conversationError("bad_request", "page_content_invalid")
	}
	var root map[string]json.RawMessage
	if err := json.Unmarshal([]byte(content), &root); err != nil || len(root) != 1 || root["blocks"] == nil {
		return knowledgesdk.PageContent{}, conversationError("bad_request", "page_content_schema_invalid")
	}
	if len(payload.Blocks) > knowledgeDocumentMaximumBlocks {
		return knowledgesdk.PageContent{}, conversationError("bad_request", "page_content_schema_invalid")
	}
	seen := make(map[string]bool, len(payload.Blocks))
	words := make([]string, 0, len(payload.Blocks)*2)
	nodes := 0
	for _, raw := range payload.Blocks {
		var block knowledgeDocumentBlock
		blockDecoder := json.NewDecoder(strings.NewReader(string(raw)))
		blockDecoder.UseNumber()
		if err := blockDecoder.Decode(&block); err != nil {
			return knowledgesdk.PageContent{}, conversationError("bad_request", "page_content_schema_invalid")
		}
		if err := validateKnowledgeDocumentBlock(block, 0, &nodes, seen, &words); err != nil {
			return knowledgesdk.PageContent{}, conversationError("bad_request", "page_content_schema_invalid")
		}
	}
	digest := sha256.Sum256([]byte(content))
	hash := hex.EncodeToString(digest[:])
	if suppliedHash != "" && suppliedHash != hash {
		return knowledgesdk.PageContent{}, conversationError("bad_request", "page_content_hash_mismatch")
	}
	plain := strings.TrimSpace(strings.Join(strings.Fields(strings.Join(words, " ")), " "))
	summary := plain
	if runes := []rune(summary); len(runes) > 280 {
		summary = string(runes[:280])
	}
	return knowledgesdk.PageContent{ContentSchemaVersion: schema, Content: content, ContentSHA256: hash, PlainText: plain, Summary: summary}, nil
}

func validateKnowledgeDocumentBlock(block knowledgeDocumentBlock, depth int, nodes *int, seen map[string]bool, words *[]string) error {
	*nodes++
	if depth > knowledgeDocumentMaximumBlockDepth || *nodes > knowledgeDocumentMaximumBlocks {
		return fmt.Errorf("document block tree exceeds structural limits")
	}
	if !knowledgeBlockIDPattern.MatchString(block.ID) || seen[block.ID] || !knowledgeDocumentBlockTypes[block.Type] {
		return fmt.Errorf("document block identity or type is invalid")
	}
	seen[block.ID] = true
	if len(block.Props) > 64 {
		return fmt.Errorf("document block has too many properties")
	}
	propKeys := make([]string, 0, len(block.Props))
	for key := range block.Props {
		propKeys = append(propKeys, key)
	}
	sort.Strings(propKeys)
	for _, key := range propKeys {
		value := block.Props[key]
		if !knowledgeBlockIDPattern.MatchString(key) || validateKnowledgeBlockProperty(block.Type, key, value) != nil {
			return fmt.Errorf("document block property is invalid")
		}
		if key == "title" || key == "name" || key == "caption" || key == "label" {
			if text, ok := value.(string); ok && strings.TrimSpace(text) != "" {
				*words = append(*words, text)
			}
		}
	}
	if block.Content != nil {
		if err := validateKnowledgeBlockValue(block.Content, "content", block.Type, depth+1, nodes, words); err != nil {
			return err
		}
	}
	for _, child := range block.Children {
		if err := validateKnowledgeDocumentBlock(child, depth+1, nodes, seen, words); err != nil {
			return err
		}
	}
	return nil
}

func validateKnowledgeBlockProperty(blockType, key string, value any) error {
	switch item := value.(type) {
	case string:
		if len(item) > 16*1024 || strings.ContainsRune(item, 0) {
			return fmt.Errorf("property text is invalid")
		}
		if key == "url" || key == "href" {
			return validateKnowledgeBlockURL(blockType, item)
		}
	case json.Number:
		if _, err := item.Float64(); err != nil {
			return err
		}
	case bool, nil:
		return nil
	default:
		return fmt.Errorf("property value must be scalar")
	}
	return nil
}

func validateKnowledgeBlockURL(blockType, value string) error {
	value = strings.TrimSpace(value)
	if value == "" {
		return nil
	}
	if blockType == "image" || blockType == "video" || blockType == "audio" || blockType == "file" {
		if strings.HasPrefix(value, "knowledge-document:") || strings.HasPrefix(value, "/knowledge/libraries/") && strings.Contains(value, "/documents/") && strings.HasSuffix(value, "/content") {
			return nil
		}
		return fmt.Errorf("external file source is forbidden")
	}
	if strings.HasPrefix(value, "knowledge-page:") {
		return nil
	}
	parsed, err := url.Parse(value)
	if err != nil || parsed.Host == "" || parsed.Scheme != "https" && parsed.Scheme != "http" {
		return fmt.Errorf("link URL is invalid")
	}
	return nil
}

func validateKnowledgeBlockValue(value any, key, blockType string, depth int, nodes *int, words *[]string) error {
	*nodes++
	if depth > knowledgeDocumentMaximumBlockDepth || *nodes > knowledgeDocumentMaximumBlocks*8 {
		return fmt.Errorf("document content exceeds structural limits")
	}
	switch item := value.(type) {
	case map[string]any:
		if len(item) > knowledgeDocumentMaximumObjectFields {
			return fmt.Errorf("document content object is too large")
		}
		keys := make([]string, 0, len(item))
		for childKey := range item {
			keys = append(keys, childKey)
		}
		sort.Strings(keys)
		for _, childKey := range keys {
			child := item[childKey]
			if len(childKey) == 0 || len(childKey) > 128 {
				return fmt.Errorf("document content key is invalid")
			}
			if childKey == "href" || childKey == "url" {
				if text, ok := child.(string); !ok || validateKnowledgeBlockURL(blockType, text) != nil {
					return fmt.Errorf("document content URL is invalid")
				}
			}
			if err := validateKnowledgeBlockValue(child, childKey, blockType, depth+1, nodes, words); err != nil {
				return err
			}
		}
	case []any:
		if len(item) > knowledgeDocumentMaximumBlocks {
			return fmt.Errorf("document content array is too large")
		}
		for _, child := range item {
			if err := validateKnowledgeBlockValue(child, key, blockType, depth+1, nodes, words); err != nil {
				return err
			}
		}
	case string:
		if len(item) > knowledgePageMaximumBytes || strings.ContainsRune(item, 0) {
			return fmt.Errorf("document content text is invalid")
		}
		if key == "text" && strings.TrimSpace(item) != "" {
			*words = append(*words, item)
		}
	case json.Number:
		if _, err := item.Float64(); err != nil {
			return err
		}
	case bool, nil:
		return nil
	default:
		return fmt.Errorf("document content value is unsupported")
	}
	return nil
}
