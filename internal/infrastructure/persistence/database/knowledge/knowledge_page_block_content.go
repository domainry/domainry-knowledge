package store

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"html"
	"io"
	"net"
	"net/mail"
	"net/url"
	"regexp"
	"sort"
	"strings"
	"time"
	"unicode"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

const (
	knowledgeDocumentMaximumBlocks       = 20000
	knowledgeDocumentMaximumBlockDepth   = 64
	knowledgeDocumentMaximumObjectFields = 256
)

var knowledgeBlockIDPattern = regexp.MustCompile(`^[A-Za-z0-9][A-Za-z0-9:_-]{0,127}$`)
var knowledgeMetadataHTMLPattern = regexp.MustCompile(`<[^<>]*>`)
var registeredKnowledgePageType = func(string) bool { return false }

func init() {
	// Assigned after package variables are initialized to keep both registries
	// code-owned without introducing a Go variable-initialization cycle.
	registeredKnowledgePageType = validKnowledgePageType
}

type knowledgeBlockDefinition struct {
	ID                  string
	Validator           func(map[string]any) error
	ContentValidator    func(any) error
	ExtractPropertyKeys map[string]bool
	ExtractContentText  bool
	RequiredAction      string
}

func commonKnowledgeBlockDefinition(id string, extractKeys ...string) knowledgeBlockDefinition {
	keys := make(map[string]bool, len(extractKeys))
	for _, key := range extractKeys {
		keys[key] = true
	}
	return knowledgeBlockDefinition{ID: id, Validator: func(map[string]any) error { return nil }, ExtractPropertyKeys: keys, RequiredAction: "knowledge.pages.update"}
}

func contentTextKnowledgeBlockDefinition(id string, extractKeys ...string) knowledgeBlockDefinition {
	definition := commonKnowledgeBlockDefinition(id, extractKeys...)
	definition.ExtractContentText = true
	return definition
}

func codeBlockKnowledgeDefinition() knowledgeBlockDefinition {
	definition := contentTextKnowledgeBlockDefinition("codeBlock")
	definition.Validator = validateCodeBlockProperties
	return definition
}

func tableBlockKnowledgeDefinition() knowledgeBlockDefinition {
	definition := commonKnowledgeBlockDefinition("table")
	definition.Validator = validateTableBlockProperties
	definition.ContentValidator = validateTableBlockContent
	return definition
}

func mediaBlockKnowledgeDefinition(id string) knowledgeBlockDefinition {
	definition := commonKnowledgeBlockDefinition(id, "caption", "name")
	definition.Validator = func(props map[string]any) error { return validateMediaBlockProperties(id, props) }
	return definition
}

func mustKnowledgeBlockRegistry(definitions []knowledgeBlockDefinition) map[string]knowledgeBlockDefinition {
	registry := make(map[string]knowledgeBlockDefinition, len(definitions))
	for _, definition := range definitions {
		if definition.ID == "" || registry[definition.ID].ID != "" || definition.Validator == nil || definition.ExtractPropertyKeys == nil || definition.RequiredAction == "" {
			panic("invalid or duplicate knowledge block definition: " + definition.ID)
		}
		registry[definition.ID] = definition
	}
	return registry
}

var knowledgeBlockRegistry = mustKnowledgeBlockRegistry([]knowledgeBlockDefinition{
	commonKnowledgeBlockDefinition("paragraph"),
	commonKnowledgeBlockDefinition("heading"),
	commonKnowledgeBlockDefinition("bulletListItem"),
	commonKnowledgeBlockDefinition("numberedListItem"),
	commonKnowledgeBlockDefinition("checkListItem"),
	commonKnowledgeBlockDefinition("toggleListItem"),
	commonKnowledgeBlockDefinition("quote"),
	codeBlockKnowledgeDefinition(),
	commonKnowledgeBlockDefinition("divider"),
	tableBlockKnowledgeDefinition(),
	mediaBlockKnowledgeDefinition("image"),
	mediaBlockKnowledgeDefinition("video"),
	mediaBlockKnowledgeDefinition("audio"),
	mediaBlockKnowledgeDefinition("file"),
	{ID: "callout", Validator: validateCalloutBlockProperties, ExtractPropertyKeys: map[string]bool{"icon": true}, RequiredAction: "knowledge.pages.update"},
	contentTextKnowledgeBlockDefinition("formula"),
	{ID: "button", Validator: validateButtonBlockProperties, ExtractPropertyKeys: map[string]bool{"label": true}, RequiredAction: "knowledge.pages.update"},
	{ID: "knowledgeReference", Validator: validateKnowledgeReferenceBlockProperties, ExtractPropertyKeys: map[string]bool{"title": true}, RequiredAction: "knowledge.pages.update"},
	{ID: "bookmark", Validator: validateBookmarkBlockProperties, ExtractPropertyKeys: map[string]bool{"title": true, "description": true, "siteName": true}, RequiredAction: "knowledge.pages.update"},
	{ID: "personCard", Validator: validatePersonCardBlockProperties, ExtractPropertyKeys: map[string]bool{"displayName": true, "email": true}, RequiredAction: "knowledge.pages.update"},
	{ID: "externalEmbed", Validator: validateExternalEmbedBlockProperties, ExtractPropertyKeys: map[string]bool{"title": true}, RequiredAction: "knowledge.pages.update"},
	{ID: "applicationCard", Validator: validateApplicationCardBlockProperties, ExtractPropertyKeys: map[string]bool{}, RequiredAction: knowledgesdk.ActionApplicationCardsResolve},
	{ID: "syncedBlock", Validator: validateSyncedBlockProperties, ExtractPropertyKeys: map[string]bool{"title": true}, RequiredAction: "knowledge.pages.update"},
	{ID: "tableOfContents", Validator: validateTableOfContentsBlockProperties, ExtractPropertyKeys: map[string]bool{}, RequiredAction: "knowledge.pages.update"},
	{ID: "knowledgeTask", Validator: validateKnowledgeTaskBlockProperties, ExtractPropertyKeys: map[string]bool{"title": true}, RequiredAction: "knowledge.page_tasks.update"},
	{ID: "knowledgePoll", Validator: validateKnowledgePollBlockProperties, ExtractPropertyKeys: map[string]bool{"question": true}, RequiredAction: "knowledge.page_polls.update"},
	{ID: "subpageList", Validator: validateSubpageListBlockProperties, ExtractPropertyKeys: map[string]bool{}, RequiredAction: "knowledge.pages.list"},
	{ID: "informationCollection", Validator: validateInformationCollectionBlockProperties, ExtractPropertyKeys: map[string]bool{"title": true}, RequiredAction: "knowledge.pages.get"},
	{ID: "knowledgeActivity", Validator: validateKnowledgeActivityBlockProperties, ExtractPropertyKeys: map[string]bool{}, RequiredAction: "knowledge.page_versions.list"},
	commonKnowledgeBlockDefinition("columnList"),
	commonKnowledgeBlockDefinition("column"),
})

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

type knowledgeHistoryBlock struct {
	ID       string
	SHA256   string
	Preview  string
	ParentID string
	Index    int
}

func normalizedKnowledgeCommentQuote(value string) string {
	return strings.Join(strings.Fields(value), " ")
}

func appendKnowledgeCommentAnchorWords(value any, key string, words *[]string) {
	switch item := value.(type) {
	case map[string]any:
		if extracted, handled, _ := validateKnowledgeInlineContent(item); handled {
			if extracted != "" {
				*words = append(*words, extracted)
			}
			return
		}
		keys := make([]string, 0, len(item))
		for childKey := range item {
			keys = append(keys, childKey)
		}
		sort.Strings(keys)
		for _, childKey := range keys {
			appendKnowledgeCommentAnchorWords(item[childKey], childKey, words)
		}
	case []any:
		for _, child := range item {
			appendKnowledgeCommentAnchorWords(child, key, words)
		}
	case string:
		if key == "text" && strings.TrimSpace(item) != "" {
			*words = append(*words, item)
		}
	}
}

func knowledgeDocumentBlockPreview(block knowledgeDocumentBlock) string {
	words := make([]string, 0, 4)
	if definition, ok := knowledgeBlockRegistry[block.Type]; ok {
		keys := make([]string, 0, len(definition.ExtractPropertyKeys))
		for key := range definition.ExtractPropertyKeys {
			keys = append(keys, key)
		}
		sort.Strings(keys)
		for _, key := range keys {
			if text, ok := block.Props[key].(string); ok && strings.TrimSpace(text) != "" {
				words = append(words, text)
			}
		}
		if definition.ExtractContentText {
			if text, ok := block.Content.(string); ok && strings.TrimSpace(text) != "" {
				words = append(words, text)
			}
		}
	}
	appendKnowledgeCommentAnchorWords(block.Content, "content", &words)
	preview := normalizedKnowledgeCommentQuote(strings.Join(words, " "))
	if preview == "" {
		preview = block.Type
	}
	return string([]rune(preview)[:min(len([]rune(preview)), 240)])
}

func knowledgeDocumentHistoryBlocks(content string) (map[string]knowledgeHistoryBlock, error) {
	var payload knowledgeDocumentPayload
	decoder := json.NewDecoder(strings.NewReader(content))
	decoder.UseNumber()
	if err := decoder.Decode(&payload); err != nil {
		return nil, err
	}
	blocks := make(map[string]knowledgeHistoryBlock)
	var visit func([]knowledgeDocumentBlock, string) error
	visit = func(items []knowledgeDocumentBlock, parentID string) error {
		for index, block := range items {
			fingerprint, err := json.Marshal(struct {
				Type     string         `json:"type"`
				Props    map[string]any `json:"props"`
				Content  any            `json:"content"`
				ParentID string         `json:"parent_id"`
				Index    int            `json:"index"`
			}{block.Type, block.Props, block.Content, parentID, index})
			if err != nil {
				return err
			}
			digest := sha256.Sum256(fingerprint)
			blocks[block.ID] = knowledgeHistoryBlock{ID: block.ID, SHA256: hex.EncodeToString(digest[:]), Preview: knowledgeDocumentBlockPreview(block), ParentID: parentID, Index: index}
			if err := visit(block.Children, block.ID); err != nil {
				return err
			}
		}
		return nil
	}
	root := make([]knowledgeDocumentBlock, 0, len(payload.Blocks))
	for _, raw := range payload.Blocks {
		var block knowledgeDocumentBlock
		blockDecoder := json.NewDecoder(strings.NewReader(string(raw)))
		blockDecoder.UseNumber()
		if err := blockDecoder.Decode(&block); err != nil {
			return nil, err
		}
		root = append(root, block)
	}
	if err := visit(root, ""); err != nil {
		return nil, err
	}
	return blocks, nil
}

func knowledgeDocumentBlockChanges(before, after string) ([]knowledgesdk.KnowledgePageBlockChange, error) {
	previous, err := knowledgeDocumentHistoryBlocks(before)
	if err != nil {
		return nil, err
	}
	next, err := knowledgeDocumentHistoryBlocks(after)
	if err != nil {
		return nil, err
	}
	ids := make([]string, 0, len(previous)+len(next))
	seen := make(map[string]bool, len(previous)+len(next))
	for id := range previous {
		seen[id], ids = true, append(ids, id)
	}
	for id := range next {
		if !seen[id] {
			ids = append(ids, id)
		}
	}
	sort.Strings(ids)
	changes := make([]knowledgesdk.KnowledgePageBlockChange, 0)
	for _, id := range ids {
		left, hadLeft := previous[id]
		right, hasRight := next[id]
		switch {
		case !hadLeft:
			changes = append(changes, knowledgesdk.KnowledgePageBlockChange{NodeID: id, Kind: "insert", AfterSHA256: right.SHA256, AfterPreview: right.Preview})
		case !hasRight:
			changes = append(changes, knowledgesdk.KnowledgePageBlockChange{NodeID: id, Kind: "delete", BeforeSHA256: left.SHA256, BeforePreview: left.Preview})
		case left.SHA256 != right.SHA256:
			changes = append(changes, knowledgesdk.KnowledgePageBlockChange{NodeID: id, Kind: "update", BeforeSHA256: left.SHA256, AfterSHA256: right.SHA256, BeforePreview: left.Preview, AfterPreview: right.Preview})
		}
	}
	return changes, nil
}

func applyKnowledgeDocumentSuggestion(content string, suggestion knowledgesdk.KnowledgePageSuggestion) (string, error) {
	anchor, err := knowledgeDocumentCommentAnchor(content, suggestion.Anchor.NodeID, suggestion.Anchor.Quote)
	if err != nil || anchor.BlockSHA256 != suggestion.Anchor.BlockSHA256 {
		return "", conversationError("conflict", "page_suggestion_anchor_changed")
	}
	var rawPayload knowledgeDocumentPayload
	decoder := json.NewDecoder(strings.NewReader(content))
	decoder.UseNumber()
	if err = decoder.Decode(&rawPayload); err != nil {
		return "", conversationError("bad_request", "page_suggestion_content_invalid")
	}
	blocks := make([]knowledgeDocumentBlock, 0, len(rawPayload.Blocks))
	for _, raw := range rawPayload.Blocks {
		var block knowledgeDocumentBlock
		blockDecoder := json.NewDecoder(strings.NewReader(string(raw)))
		blockDecoder.UseNumber()
		if err = blockDecoder.Decode(&block); err != nil {
			return "", conversationError("bad_request", "page_suggestion_content_invalid")
		}
		blocks = append(blocks, block)
	}
	changed := false
	var mutate func([]knowledgeDocumentBlock) []knowledgeDocumentBlock
	mutate = func(items []knowledgeDocumentBlock) []knowledgeDocumentBlock {
		result := make([]knowledgeDocumentBlock, 0, len(items)+1)
		for _, block := range items {
			if !changed && block.ID == suggestion.Anchor.NodeID {
				switch suggestion.Kind {
				case knowledgesdk.KnowledgeSuggestionDelete:
					changed = true
					continue
				case knowledgesdk.KnowledgeSuggestionInsert:
					result = append(result, block)
					result = append(result, knowledgeDocumentBlock{
						ID: suggestion.ProposedBlockID, Type: "paragraph", Props: map[string]any{},
						Content: []any{map[string]any{"type": "text", "text": suggestion.ProposedText, "styles": map[string]any{}}}, Children: []knowledgeDocumentBlock{},
					})
					changed = true
					continue
				case knowledgesdk.KnowledgeSuggestionReplace:
					switch block.Content.(type) {
					case []any:
						block.Content = []any{map[string]any{"type": "text", "text": suggestion.ProposedText, "styles": map[string]any{}}}
					case string:
						definition, replaceable := knowledgeBlockRegistry[block.Type]
						if !replaceable || !definition.ExtractContentText {
							return items
						}
						block.Content = suggestion.ProposedText
					default:
						return items
					}
					result = append(result, block)
					changed = true
					continue
				}
			}
			block.Children = mutate(block.Children)
			result = append(result, block)
		}
		return result
	}
	blocks = mutate(blocks)
	if !changed {
		if suggestion.Kind == knowledgesdk.KnowledgeSuggestionReplace {
			return "", conversationError("conflict", "page_suggestion_replace_unsupported")
		}
		return "", conversationError("conflict", "page_suggestion_anchor_changed")
	}
	raw, err := json.Marshal(struct {
		Blocks []knowledgeDocumentBlock `json:"blocks"`
	}{Blocks: blocks})
	if err != nil {
		return "", err
	}
	return string(raw), nil
}

func knowledgeDocumentCommentAnchor(content, nodeID, quote string) (knowledgesdk.KnowledgePageCommentAnchor, error) {
	var payload knowledgeDocumentPayload
	decoder := json.NewDecoder(strings.NewReader(content))
	decoder.UseNumber()
	if err := decoder.Decode(&payload); err != nil {
		return knowledgesdk.KnowledgePageCommentAnchor{}, conversationError("bad_request", "page_comment_anchor_invalid")
	}
	var found *knowledgeDocumentBlock
	var visit func([]knowledgeDocumentBlock)
	visit = func(blocks []knowledgeDocumentBlock) {
		for index := range blocks {
			if found != nil {
				return
			}
			if blocks[index].ID == nodeID {
				found = &blocks[index]
				return
			}
			visit(blocks[index].Children)
		}
	}
	blocks := make([]knowledgeDocumentBlock, 0, len(payload.Blocks))
	for _, raw := range payload.Blocks {
		var block knowledgeDocumentBlock
		blockDecoder := json.NewDecoder(strings.NewReader(string(raw)))
		blockDecoder.UseNumber()
		if err := blockDecoder.Decode(&block); err != nil {
			return knowledgesdk.KnowledgePageCommentAnchor{}, conversationError("bad_request", "page_comment_anchor_invalid")
		}
		blocks = append(blocks, block)
	}
	visit(blocks)
	if found == nil {
		return knowledgesdk.KnowledgePageCommentAnchor{}, conversationError("bad_request", "page_comment_anchor_not_found")
	}
	words := make([]string, 0, 4)
	if definition, ok := knowledgeBlockRegistry[found.Type]; ok {
		keys := make([]string, 0, len(definition.ExtractPropertyKeys))
		for key := range definition.ExtractPropertyKeys {
			keys = append(keys, key)
		}
		sort.Strings(keys)
		for _, key := range keys {
			if text, ok := found.Props[key].(string); ok && strings.TrimSpace(text) != "" {
				words = append(words, text)
			}
		}
		if definition.ExtractContentText {
			if text, ok := found.Content.(string); ok && strings.TrimSpace(text) != "" {
				words = append(words, text)
			}
		}
	}
	appendKnowledgeCommentAnchorWords(found.Content, "content", &words)
	visibleText := normalizedKnowledgeCommentQuote(strings.Join(words, " "))
	normalizedQuote := normalizedKnowledgeCommentQuote(quote)
	if normalizedQuote == "" || visibleText != "" && !strings.Contains(visibleText, normalizedQuote) || visibleText == "" && normalizedQuote != found.Type {
		return knowledgesdk.KnowledgePageCommentAnchor{}, conversationError("bad_request", "page_comment_quote_invalid")
	}
	raw, err := json.Marshal(found)
	if err != nil {
		return knowledgesdk.KnowledgePageCommentAnchor{}, err
	}
	digest := sha256.Sum256(raw)
	return knowledgesdk.KnowledgePageCommentAnchor{NodeID: nodeID, Quote: normalizedQuote, BlockSHA256: hex.EncodeToString(digest[:])}, nil
}

func normalizedPageContent(schema int, content, suppliedHash string) (knowledgesdk.PageContent, error) {
	normalized, err := normalizedPageContentStructural(schema, content, suppliedHash)
	if err != nil {
		return normalized, err
	}
	if err = validateKnowledgeExternalEmbeds(normalized.Content, defaultKnowledgeEmbedProviders()); err != nil {
		return knowledgesdk.PageContent{}, err
	}
	return normalized, nil
}

func normalizedPageContentStructural(schema int, content, suppliedHash string) (knowledgesdk.PageContent, error) {
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
	rawDigest := sha256.Sum256([]byte(content))
	if suppliedHash != "" && suppliedHash != hex.EncodeToString(rawDigest[:]) {
		return knowledgesdk.PageContent{}, conversationError("bad_request", "page_content_hash_mismatch")
	}
	seen := make(map[string]bool, len(payload.Blocks))
	words := make([]string, 0, len(payload.Blocks)*2)
	nodes := 0
	metadataChanged := false
	for index, raw := range payload.Blocks {
		normalizedRaw, changed, sanitizeErr := sanitizeKnowledgeDocumentBlock(raw)
		if sanitizeErr != nil {
			return knowledgesdk.PageContent{}, conversationError("bad_request", "page_content_schema_invalid")
		}
		payload.Blocks[index] = normalizedRaw
		metadataChanged = metadataChanged || changed
		var block knowledgeDocumentBlock
		blockDecoder := json.NewDecoder(strings.NewReader(string(normalizedRaw)))
		blockDecoder.UseNumber()
		if err := blockDecoder.Decode(&block); err != nil {
			return knowledgesdk.PageContent{}, conversationError("bad_request", "page_content_schema_invalid")
		}
		if err := validateKnowledgeDocumentBlock(block, "", 0, &nodes, seen, &words); err != nil {
			return knowledgesdk.PageContent{}, conversationError("bad_request", "page_content_schema_invalid")
		}
	}
	if metadataChanged {
		var builder strings.Builder
		builder.WriteString(`{"blocks":[`)
		for index, raw := range payload.Blocks {
			if index > 0 {
				builder.WriteByte(',')
			}
			builder.Write(raw)
		}
		builder.WriteString(`]}`)
		content = builder.String()
	}
	digest := sha256.Sum256([]byte(content))
	hash := hex.EncodeToString(digest[:])
	plain := strings.TrimSpace(strings.Join(strings.Fields(strings.Join(words, " ")), " "))
	summary := plain
	if runes := []rune(summary); len(runes) > 280 {
		summary = string(runes[:280])
	}
	return knowledgesdk.PageContent{ContentSchemaVersion: schema, Content: content, ContentSHA256: hash, PlainText: plain, Summary: summary}, nil
}

var knowledgeBlockMetadataLimits = map[string]map[string]int{
	"bookmark":              {"title": 256, "description": 1024, "siteName": 128},
	"personCard":            {"displayName": 256, "email": 320},
	"externalEmbed":         {"title": 256},
	"knowledgeReference":    {"title": 256},
	"informationCollection": {"title": 256},
}

func sanitizeKnowledgeMetadata(value string, maximum int) string {
	value = html.UnescapeString(value)
	value = knowledgeMetadataHTMLPattern.ReplaceAllString(value, " ")
	value = strings.Map(func(character rune) rune {
		if unicode.IsControl(character) {
			return ' '
		}
		return character
	}, value)
	value = strings.Join(strings.Fields(value), " ")
	runes := []rune(value)
	if len(runes) > maximum {
		value = string(runes[:maximum])
	}
	return value
}

func sanitizeKnowledgeDocumentBlock(raw json.RawMessage) (json.RawMessage, bool, error) {
	decoder := json.NewDecoder(strings.NewReader(string(raw)))
	decoder.UseNumber()
	var block map[string]any
	if err := decoder.Decode(&block); err != nil || !hasOnlyKnowledgeObjectKeys(block, "id", "type", "props", "content", "children") {
		return nil, false, fmt.Errorf("document block envelope is invalid")
	}
	changed, err := sanitizeKnowledgeDocumentBlockValue(block)
	if err != nil || !changed {
		return raw, changed, err
	}
	normalized, err := json.Marshal(block)
	return normalized, true, err
}

func sanitizeKnowledgeDocumentBlockValue(block map[string]any) (bool, error) {
	blockType, ok := block["type"].(string)
	if !ok {
		return false, fmt.Errorf("document block type is invalid")
	}
	changed := false
	if limits := knowledgeBlockMetadataLimits[blockType]; len(limits) > 0 {
		props, ok := block["props"].(map[string]any)
		if !ok {
			return false, fmt.Errorf("document block properties are invalid")
		}
		for key, maximum := range limits {
			value, found := props[key]
			if !found || value == nil {
				continue
			}
			text, ok := value.(string)
			if !ok {
				return false, fmt.Errorf("document block metadata is invalid")
			}
			normalized := sanitizeKnowledgeMetadata(text, maximum)
			if normalized != text {
				props[key] = normalized
				changed = true
			}
		}
	}
	if rawChildren, found := block["children"]; found && rawChildren != nil {
		children, ok := rawChildren.([]any)
		if !ok {
			return false, fmt.Errorf("document block children are invalid")
		}
		for _, rawChild := range children {
			child, ok := rawChild.(map[string]any)
			if !ok || !hasOnlyKnowledgeObjectKeys(child, "id", "type", "props", "content", "children") {
				return false, fmt.Errorf("document child block is invalid")
			}
			childChanged, err := sanitizeKnowledgeDocumentBlockValue(child)
			if err != nil {
				return false, err
			}
			changed = changed || childChanged
		}
	}
	return changed, nil
}

func validateKnowledgeDocumentBlock(block knowledgeDocumentBlock, parentType string, depth int, nodes *int, seen map[string]bool, words *[]string) error {
	*nodes++
	if depth > knowledgeDocumentMaximumBlockDepth || *nodes > knowledgeDocumentMaximumBlocks {
		return fmt.Errorf("document block tree exceeds structural limits")
	}
	definition, registered := knowledgeBlockRegistry[block.Type]
	if !knowledgeBlockIDPattern.MatchString(block.ID) || seen[block.ID] || !registered {
		return fmt.Errorf("document block identity or type is invalid")
	}
	if block.Type == "column" && parentType != "columnList" {
		return fmt.Errorf("column must be a direct child of columnList")
	}
	if block.Type == "columnList" {
		if parentType == "column" || len(block.Children) < 2 {
			return fmt.Errorf("columnList layout is invalid")
		}
		for _, child := range block.Children {
			if child.Type != "column" {
				return fmt.Errorf("columnList children must be columns")
			}
		}
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
		if definition.ExtractPropertyKeys[key] {
			if text, ok := value.(string); ok && strings.TrimSpace(text) != "" {
				*words = append(*words, text)
			}
		}
	}
	if err := definition.Validator(block.Props); err != nil {
		return fmt.Errorf("document block properties are invalid: %w", err)
	}
	if definition.ContentValidator != nil {
		if err := definition.ContentValidator(block.Content); err != nil {
			return fmt.Errorf("document block content is invalid: %w", err)
		}
	}
	if block.Content != nil {
		if definition.ExtractContentText {
			if text, ok := block.Content.(string); ok && strings.TrimSpace(text) != "" {
				*words = append(*words, text)
			}
		}
		if err := validateKnowledgeBlockValue(block.Content, "content", block.Type, depth+1, nodes, words); err != nil {
			return err
		}
	}
	for _, child := range block.Children {
		if err := validateKnowledgeDocumentBlock(child, block.Type, depth+1, nodes, seen, words); err != nil {
			return err
		}
	}
	return nil
}

func optionalKnowledgeBlockString(props map[string]any, key string) (string, error) {
	value, found := props[key]
	if !found || value == nil {
		return "", nil
	}
	text, ok := value.(string)
	if !ok {
		return "", fmt.Errorf("%s must be text", key)
	}
	return strings.TrimSpace(text), nil
}

func validateCalloutBlockProperties(props map[string]any) error {
	tone, err := optionalKnowledgeBlockString(props, "tone")
	if err != nil || tone != "" && tone != "info" && tone != "success" && tone != "warning" && tone != "danger" {
		return fmt.Errorf("callout tone is invalid")
	}
	icon, err := optionalKnowledgeBlockString(props, "icon")
	if err != nil || len([]rune(icon)) > 2 {
		return fmt.Errorf("callout icon is invalid")
	}
	return nil
}

func validateCodeBlockProperties(props map[string]any) error {
	language, err := optionalKnowledgeBlockString(props, "language")
	if err != nil {
		return fmt.Errorf("code language is invalid")
	}
	switch language {
	case "", "text", "javascript", "typescript", "json", "html", "css", "bash", "go", "python", "java", "sql", "markdown", "yaml", "rust", "csharp", "cpp":
	default:
		return fmt.Errorf("code language is invalid")
	}
	if wrap, found := props["wrap"]; found && wrap != nil {
		if _, ok := wrap.(bool); !ok {
			return fmt.Errorf("code wrap setting is invalid")
		}
	}
	return nil
}

func hasOnlyKnowledgeObjectKeys(value map[string]any, allowed ...string) bool {
	if len(value) > len(allowed) {
		return false
	}
	valid := make(map[string]bool, len(allowed))
	for _, key := range allowed {
		valid[key] = true
	}
	for key := range value {
		if !valid[key] {
			return false
		}
	}
	return true
}

func knowledgeJSONInteger(value any, minimum, maximum int64) (int64, bool) {
	number, ok := value.(json.Number)
	if !ok {
		return 0, false
	}
	integer, err := number.Int64()
	return integer, err == nil && integer >= minimum && integer <= maximum
}

func validateTableBlockProperties(props map[string]any) error {
	if !hasOnlyKnowledgeObjectKeys(props, "textColor") {
		return fmt.Errorf("table properties are invalid")
	}
	if color, found := props["textColor"]; found && !validKnowledgeTableColor(color) {
		return fmt.Errorf("table text color is invalid")
	}
	return nil
}

func validKnowledgeTableColor(value any) bool {
	color, ok := value.(string)
	if !ok {
		return false
	}
	switch color {
	case "default", "gray", "brown", "red", "orange", "yellow", "green", "blue", "purple", "pink":
		return true
	default:
		return false
	}
}

func validateTableBlockContent(value any) error {
	table, ok := value.(map[string]any)
	if !ok || !hasOnlyKnowledgeObjectKeys(table, "type", "columnWidths", "headerRows", "headerCols", "rows") || table["type"] != "tableContent" {
		return fmt.Errorf("table content shape is invalid")
	}
	widths, ok := table["columnWidths"].([]any)
	if !ok || len(widths) == 0 || len(widths) > 128 {
		return fmt.Errorf("table column widths are invalid")
	}
	for _, value := range widths {
		if value == nil {
			continue
		}
		if _, valid := knowledgeJSONInteger(value, 24, 2000); !valid {
			return fmt.Errorf("table column width is invalid")
		}
	}
	rows, ok := table["rows"].([]any)
	if !ok || len(rows) == 0 || len(rows) > 1000 {
		return fmt.Errorf("table rows are invalid")
	}
	for _, key := range []string{"headerRows", "headerCols"} {
		if value, found := table[key]; found && value != nil {
			maximum := int64(1)
			if key == "headerRows" && len(rows) < int(maximum) || key == "headerCols" && len(widths) < int(maximum) {
				return fmt.Errorf("table header is invalid")
			}
			if _, valid := knowledgeJSONInteger(value, 0, maximum); !valid {
				return fmt.Errorf("table header is invalid")
			}
		}
	}

	occupied := make([]int64, len(widths))
	for rowIndex, rawRow := range rows {
		row, ok := rawRow.(map[string]any)
		if !ok || !hasOnlyKnowledgeObjectKeys(row, "cells") {
			return fmt.Errorf("table row is invalid")
		}
		cells, ok := row["cells"].([]any)
		if !ok || len(cells) == 0 || len(cells) > len(widths) {
			return fmt.Errorf("table row cells are invalid")
		}
		filled := make([]bool, len(widths))
		for column, remaining := range occupied {
			filled[column] = remaining > 0
		}
		nextOccupied := make([]int64, len(widths))
		for column, remaining := range occupied {
			if remaining > 0 {
				nextOccupied[column] = remaining - 1
			}
		}
		cursor := 0
		for _, rawCell := range cells {
			cell, ok := rawCell.(map[string]any)
			if !ok || !hasOnlyKnowledgeObjectKeys(cell, "type", "props", "content") || cell["type"] != "tableCell" {
				return fmt.Errorf("table cell is invalid")
			}
			props, ok := cell["props"].(map[string]any)
			if !ok || !hasOnlyKnowledgeObjectKeys(props, "backgroundColor", "textColor", "textAlignment", "colspan", "rowspan") || !validKnowledgeTableColor(props["backgroundColor"]) || !validKnowledgeTableColor(props["textColor"]) {
				return fmt.Errorf("table cell properties are invalid")
			}
			alignment, ok := props["textAlignment"].(string)
			if !ok || alignment != "left" && alignment != "center" && alignment != "right" && alignment != "justify" {
				return fmt.Errorf("table cell alignment is invalid")
			}
			colspan, valid := knowledgeJSONInteger(props["colspan"], 1, int64(len(widths)))
			if !valid {
				return fmt.Errorf("table cell colspan is invalid")
			}
			rowspan, valid := knowledgeJSONInteger(props["rowspan"], 1, int64(len(rows)-rowIndex))
			if !valid {
				return fmt.Errorf("table cell rowspan is invalid")
			}
			if _, ok := cell["content"].([]any); !ok {
				return fmt.Errorf("table cell content is invalid")
			}
			for cursor < len(filled) && filled[cursor] {
				cursor++
			}
			if cursor+int(colspan) > len(filled) {
				return fmt.Errorf("table cell span exceeds row")
			}
			for column := cursor; column < cursor+int(colspan); column++ {
				if filled[column] {
					return fmt.Errorf("table cell spans overlap")
				}
				filled[column] = true
				nextOccupied[column] = rowspan - 1
			}
			cursor += int(colspan)
		}
		for _, complete := range filled {
			if !complete {
				return fmt.Errorf("table row is not rectangular")
			}
		}
		occupied = nextOccupied
	}
	for _, remaining := range occupied {
		if remaining != 0 {
			return fmt.Errorf("table rowspan exceeds rows")
		}
	}
	return nil
}

func validateMediaBlockProperties(blockType string, props map[string]any) error {
	allowed := []string{"backgroundColor", "name", "url", "caption"}
	if blockType == "image" || blockType == "video" {
		allowed = append(allowed, "textAlignment", "showPreview", "previewWidth")
		if blockType == "image" {
			allowed = append(allowed, "cropAspect", "cropX", "cropY", "cropZoom")
		}
	} else if blockType == "audio" {
		allowed = append(allowed, "showPreview")
	}
	if !hasOnlyKnowledgeObjectKeys(props, allowed...) {
		return fmt.Errorf("media properties are invalid")
	}
	if color, found := props["backgroundColor"]; found && !validKnowledgeTableColor(color) {
		return fmt.Errorf("media background color is invalid")
	}
	for key, maximum := range map[string]int{"name": 512, "caption": 2048} {
		if value, found := props[key]; found {
			text, ok := value.(string)
			if !ok || len([]rune(text)) > maximum {
				return fmt.Errorf("media %s is invalid", key)
			}
		}
	}
	if value, found := props["url"]; found {
		text, ok := value.(string)
		if !ok || validateKnowledgeBlockURL(blockType, text) != nil {
			return fmt.Errorf("media URL is invalid")
		}
	}
	if value, found := props["textAlignment"]; found {
		alignment, ok := value.(string)
		if !ok || alignment != "left" && alignment != "center" && alignment != "right" && alignment != "justify" {
			return fmt.Errorf("media alignment is invalid")
		}
	}
	if value, found := props["showPreview"]; found {
		if _, ok := value.(bool); !ok {
			return fmt.Errorf("media preview setting is invalid")
		}
	}
	if value, found := props["previewWidth"]; found && value != nil {
		if _, valid := knowledgeJSONInteger(value, 64, 4096); !valid {
			return fmt.Errorf("media preview width is invalid")
		}
	}
	if blockType == "image" {
		if value, found := props["cropAspect"]; found {
			aspect, ok := value.(string)
			if !ok || aspect != "original" && aspect != "1:1" && aspect != "4:3" && aspect != "16:9" && aspect != "3:4" {
				return fmt.Errorf("image crop aspect is invalid")
			}
		}
		for key, bounds := range map[string][2]int64{"cropX": {0, 100}, "cropY": {0, 100}, "cropZoom": {100, 300}} {
			if value, found := props[key]; found {
				if _, valid := knowledgeJSONInteger(value, bounds[0], bounds[1]); !valid {
					return fmt.Errorf("image %s is invalid", key)
				}
			}
		}
	}
	return nil
}

func validateButtonBlockProperties(props map[string]any) error {
	label, err := optionalKnowledgeBlockString(props, "label")
	if err != nil || len([]rune(label)) > 80 {
		return fmt.Errorf("button label is invalid")
	}
	appearance, err := optionalKnowledgeBlockString(props, "appearance")
	if err != nil || appearance != "" && appearance != "primary" && appearance != "secondary" {
		return fmt.Errorf("button appearance is invalid")
	}
	return nil
}

func validateKnowledgeReferenceBlockProperties(props map[string]any) error {
	if !hasOnlyKnowledgeObjectKeys(props, "targetPageId", "title", "targetType", "display", "referenceMode", "targetVersion", "embeddedEdit") {
		return fmt.Errorf("knowledge reference properties are invalid")
	}
	targetPageID, err := optionalKnowledgeBlockString(props, "targetPageId")
	if err != nil || targetPageID != "" && !validKnowledgePageID(targetPageID) {
		return fmt.Errorf("knowledge reference target is invalid")
	}
	contentType, err := optionalKnowledgeBlockString(props, "targetType")
	if err != nil || contentType != "" && !validKnowledgeReferenceContentType(contentType) {
		return fmt.Errorf("knowledge reference type is invalid")
	}
	display, err := optionalKnowledgeBlockString(props, "display")
	if err != nil || display != "" && display != "card" && display != "embed" {
		return fmt.Errorf("knowledge reference display is invalid")
	}
	if err := validateKnowledgeMetadataProperty(props, "title", 256); err != nil {
		return fmt.Errorf("knowledge reference title is invalid")
	}
	referenceMode, err := optionalKnowledgeBlockString(props, "referenceMode")
	if err != nil || referenceMode != "" && referenceMode != "live" && referenceMode != "fixed" {
		return fmt.Errorf("knowledge reference mode is invalid")
	}
	targetVersion := int64(0)
	if raw, found := props["targetVersion"]; found && raw != nil {
		var valid bool
		targetVersion, valid = knowledgeJSONInteger(raw, 0, 1<<31-1)
		if !valid {
			return fmt.Errorf("knowledge reference version is invalid")
		}
	}
	if (referenceMode == "fixed") != (targetVersion > 0) {
		return fmt.Errorf("knowledge reference fixed version is invalid")
	}
	if embeddedEdit, found := props["embeddedEdit"]; found {
		if _, ok := embeddedEdit.(bool); !ok || referenceMode == "fixed" && embeddedEdit == true || display != "embed" && embeddedEdit == true {
			return fmt.Errorf("knowledge reference embedded edit is invalid")
		}
	}
	return nil
}

func validKnowledgeReferenceContentType(value string) bool {
	return registeredKnowledgePageType(value)
}

func validateKnowledgeMetadataProperty(props map[string]any, key string, maximum int) error {
	value, found := props[key]
	if !found || value == nil {
		return nil
	}
	text, ok := value.(string)
	if !ok || len([]rune(text)) > maximum || sanitizeKnowledgeMetadata(text, maximum) != text {
		return fmt.Errorf("%s metadata is invalid", key)
	}
	return nil
}

func validateBookmarkBlockProperties(props map[string]any) error {
	if !hasOnlyKnowledgeObjectKeys(props, "url", "title", "description", "siteName") {
		return fmt.Errorf("bookmark properties are invalid")
	}
	bookmarkURL, err := optionalKnowledgeBlockString(props, "url")
	if err != nil || bookmarkURL != "" && validateKnowledgeBookmarkURL(bookmarkURL) != nil {
		return fmt.Errorf("bookmark URL is invalid")
	}
	for key, maximum := range knowledgeBlockMetadataLimits["bookmark"] {
		if err := validateKnowledgeMetadataProperty(props, key, maximum); err != nil {
			return err
		}
	}
	return nil
}

func validatePersonCardBlockProperties(props map[string]any) error {
	if !hasOnlyKnowledgeObjectKeys(props, "userId", "displayName", "email") {
		return fmt.Errorf("person card properties are invalid")
	}
	userID, err := optionalKnowledgeBlockString(props, "userId")
	if err != nil || userID != "" && !validLibraryUser(userID) {
		return fmt.Errorf("person card user is invalid")
	}
	for key, maximum := range knowledgeBlockMetadataLimits["personCard"] {
		if err := validateKnowledgeMetadataProperty(props, key, maximum); err != nil {
			return err
		}
	}
	emailValue, err := optionalKnowledgeBlockString(props, "email")
	if err != nil {
		return fmt.Errorf("person card email is invalid")
	}
	if emailValue != "" {
		address, parseErr := mail.ParseAddress(emailValue)
		if parseErr != nil || address.Address != emailValue {
			return fmt.Errorf("person card email is invalid")
		}
	}
	return nil
}

func validateExternalEmbedBlockProperties(props map[string]any) error {
	if !hasOnlyKnowledgeObjectKeys(props, "provider", "url", "title") {
		return fmt.Errorf("external embed properties are invalid")
	}
	provider, err := optionalKnowledgeBlockString(props, "provider")
	if err != nil || provider != "" && !knowledgeEmbedProviderKeyPattern.MatchString(provider) {
		return fmt.Errorf("external embed provider is invalid")
	}
	embedURL, err := optionalKnowledgeBlockString(props, "url")
	if err != nil || embedURL != "" && (provider == "" || validateKnowledgeExternalEmbedURL(provider, embedURL) != nil) {
		return fmt.Errorf("external embed URL is invalid")
	}
	if err := validateKnowledgeMetadataProperty(props, "title", 256); err != nil {
		return err
	}
	return nil
}

func validateApplicationCardBlockProperties(props map[string]any) error {
	if !hasOnlyKnowledgeObjectKeys(props, "provider", "kind", "resourceId") {
		return fmt.Errorf("application card properties are invalid")
	}
	provider, providerErr := optionalKnowledgeBlockString(props, "provider")
	kind, kindErr := optionalKnowledgeBlockString(props, "kind")
	resourceID, resourceErr := optionalKnowledgeBlockString(props, "resourceId")
	if providerErr != nil || kindErr != nil || resourceErr != nil {
		return fmt.Errorf("application card reference is invalid")
	}
	if kind != "" && !knowledgeApplicationCardKind(kind) {
		return fmt.Errorf("application card reference is invalid")
	}
	if provider != "" && !knowledgeEmbedProviderKeyPattern.MatchString(provider) {
		return fmt.Errorf("application card reference is invalid")
	}
	if len(resourceID) > 2048 || strings.ContainsRune(resourceID, '\x00') {
		return fmt.Errorf("application card reference is invalid")
	}
	return nil
}

func knowledgeApplicationCardKind(kind string) bool {
	switch kind {
	case knowledgesdk.KnowledgeApplicationCardCalendar, knowledgesdk.KnowledgeApplicationCardMeeting, knowledgesdk.KnowledgeApplicationCardGroup, knowledgesdk.KnowledgeApplicationCardTask, knowledgesdk.KnowledgeApplicationCardJira, knowledgesdk.KnowledgeApplicationCardWeb:
		return true
	default:
		return false
	}
}

func validateSyncedBlockProperties(props map[string]any) error {
	targetPageID, err := optionalKnowledgeBlockString(props, "targetPageId")
	if err != nil || targetPageID != "" && !validKnowledgePageID(targetPageID) {
		return fmt.Errorf("synced block page target is invalid")
	}
	targetBlockID, err := optionalKnowledgeBlockString(props, "targetBlockId")
	if err != nil || targetBlockID != "" && !knowledgeBlockIDPattern.MatchString(targetBlockID) {
		return fmt.Errorf("synced block target is invalid")
	}
	return nil
}

func validateTableOfContentsBlockProperties(props map[string]any) error {
	value, found := props["maxDepth"]
	if !found || value == nil {
		return nil
	}
	number, ok := value.(json.Number)
	if !ok {
		return fmt.Errorf("table of contents depth is invalid")
	}
	depth, err := number.Int64()
	if err != nil || depth < 1 || depth > 3 {
		return fmt.Errorf("table of contents depth is invalid")
	}
	return nil
}

func validateKnowledgeTaskBlockProperties(props map[string]any) error {
	if !hasOnlyKnowledgeObjectKeys(props, "title") {
		return fmt.Errorf("knowledge task properties are invalid")
	}
	title, err := optionalKnowledgeBlockString(props, "title")
	if err != nil || len([]rune(title)) > 512 || sanitizeKnowledgeMetadata(title, 512) != title {
		return fmt.Errorf("knowledge task title is invalid")
	}
	return nil
}

func validateKnowledgePollBlockProperties(props map[string]any) error {
	if !hasOnlyKnowledgeObjectKeys(props, "question") {
		return fmt.Errorf("knowledge poll properties are invalid")
	}
	question, err := optionalKnowledgeBlockString(props, "question")
	if err != nil || len([]rune(question)) > 1024 || sanitizeKnowledgeMetadata(question, 1024) != question {
		return fmt.Errorf("knowledge poll question is invalid")
	}
	return nil
}

func validateSubpageListBlockProperties(props map[string]any) error {
	if !hasOnlyKnowledgeObjectKeys(props, "maxItems") {
		return fmt.Errorf("subpage list properties are invalid")
	}
	value, found := props["maxItems"]
	if !found || value == nil {
		return nil
	}
	maximum, ok := knowledgeJSONInteger(value, 5, 50)
	if !ok || maximum != 5 && maximum != 10 && maximum != 20 && maximum != 50 {
		return fmt.Errorf("subpage list maximum is invalid")
	}
	return nil
}

func validateInformationCollectionBlockProperties(props map[string]any) error {
	if !hasOnlyKnowledgeObjectKeys(props, "targetPageId", "title") {
		return fmt.Errorf("information collection properties are invalid")
	}
	targetPageID, err := optionalKnowledgeBlockString(props, "targetPageId")
	if err != nil || targetPageID != "" && !validKnowledgePageID(targetPageID) {
		return fmt.Errorf("information collection target is invalid")
	}
	if err := validateKnowledgeMetadataProperty(props, "title", 256); err != nil {
		return fmt.Errorf("information collection title is invalid")
	}
	return nil
}

func validateKnowledgeActivityBlockProperties(props map[string]any) error {
	if !hasOnlyKnowledgeObjectKeys(props, "maxItems") {
		return fmt.Errorf("knowledge activity properties are invalid")
	}
	value, found := props["maxItems"]
	if !found || value == nil {
		return nil
	}
	maximum, ok := knowledgeJSONInteger(value, 5, 20)
	if !ok || maximum != 5 && maximum != 10 && maximum != 20 {
		return fmt.Errorf("knowledge activity maximum is invalid")
	}
	return nil
}

func validateDocumentPageBeforePublish(content string) error {
	if err := validateDocumentPageBeforePublishStructural(content); err != nil {
		return err
	}
	if err := validateKnowledgeExternalEmbeds(content, defaultKnowledgeEmbedProviders()); err != nil {
		return conversationError("conflict", "page_embed_unresolved")
	}
	return nil
}

func validateDocumentPageBeforePublishStructural(content string) error {
	if err := validateTrustedPageContent(content); err != nil {
		return err
	}
	var payload knowledgeDocumentPayload
	if err := json.Unmarshal([]byte(content), &payload); err != nil {
		return conversationError("bad_request", "page_content_schema_invalid")
	}
	var validate func(knowledgeDocumentBlock) error
	validate = func(block knowledgeDocumentBlock) error {
		switch block.Type {
		case "knowledgeReference":
			target, _ := optionalKnowledgeBlockString(block.Props, "targetPageId")
			if !validKnowledgePageID(target) {
				return conversationError("conflict", "page_reference_unresolved")
			}
		case "syncedBlock":
			pageID, _ := optionalKnowledgeBlockString(block.Props, "targetPageId")
			blockID, _ := optionalKnowledgeBlockString(block.Props, "targetBlockId")
			if !validKnowledgePageID(pageID) || !knowledgeBlockIDPattern.MatchString(blockID) {
				return conversationError("conflict", "page_reference_unresolved")
			}
		case "image", "video", "audio", "file":
			reference, _ := optionalKnowledgeBlockString(block.Props, "url")
			if !strings.HasPrefix(reference, "knowledge-document:") || !validKnowledgeDocumentID(strings.TrimPrefix(reference, "knowledge-document:")) {
				return conversationError("conflict", "page_media_unresolved")
			}
		case "bookmark":
			bookmarkURL, _ := optionalKnowledgeBlockString(block.Props, "url")
			if validateKnowledgeBookmarkURL(bookmarkURL) != nil {
				return conversationError("conflict", "page_bookmark_unresolved")
			}
		case "personCard":
			userID, _ := optionalKnowledgeBlockString(block.Props, "userId")
			if !validLibraryUser(userID) {
				return conversationError("conflict", "page_person_unresolved")
			}
		case "externalEmbed":
			provider, _ := optionalKnowledgeBlockString(block.Props, "provider")
			embedURL, _ := optionalKnowledgeBlockString(block.Props, "url")
			if provider == "" || validateKnowledgeExternalEmbedURL(provider, embedURL) != nil {
				return conversationError("conflict", "page_embed_unresolved")
			}
		case "applicationCard":
			provider, _ := optionalKnowledgeBlockString(block.Props, "provider")
			kind, _ := optionalKnowledgeBlockString(block.Props, "kind")
			resourceID, _ := optionalKnowledgeBlockString(block.Props, "resourceId")
			if !knowledgeEmbedProviderKeyPattern.MatchString(provider) || !knowledgeApplicationCardKind(kind) || resourceID == "" {
				return conversationError("conflict", "page_application_card_unresolved")
			}
		}
		for _, child := range block.Children {
			if err := validate(child); err != nil {
				return err
			}
		}
		return nil
	}
	for _, raw := range payload.Blocks {
		var block knowledgeDocumentBlock
		if err := json.Unmarshal(raw, &block); err != nil {
			return conversationError("bad_request", "page_content_schema_invalid")
		}
		if err := validate(block); err != nil {
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
		if strings.HasPrefix(value, "knowledge-document:") && validKnowledgeDocumentID(strings.TrimPrefix(value, "knowledge-document:")) {
			return nil
		}
		return fmt.Errorf("external file source is forbidden")
	}
	if blockType == "bookmark" {
		return validateKnowledgeBookmarkURL(value)
	}
	if blockType == "externalEmbed" {
		return validateKnowledgeExternalEmbedURL("", value)
	}
	if strings.HasPrefix(value, "knowledge-page:") {
		if validKnowledgePageID(strings.TrimPrefix(value, "knowledge-page:")) {
			return nil
		}
		return fmt.Errorf("knowledge page URL is invalid")
	}
	parsed, err := url.Parse(value)
	if err != nil || parsed.Host == "" || parsed.Scheme != "https" && parsed.Scheme != "http" {
		return fmt.Errorf("link URL is invalid")
	}
	return nil
}

func validateKnowledgeBookmarkURL(value string) error {
	if len(value) == 0 || len(value) > 2048 || strings.TrimSpace(value) != value {
		return fmt.Errorf("bookmark URL is invalid")
	}
	parsed, err := url.ParseRequestURI(value)
	if err != nil || parsed.Scheme != "https" || parsed.Opaque != "" || parsed.User != nil || parsed.Fragment != "" {
		return fmt.Errorf("bookmark URL is invalid")
	}
	hostname := strings.ToLower(strings.TrimSuffix(parsed.Hostname(), "."))
	if hostname == "" || net.ParseIP(hostname) != nil || !strings.Contains(hostname, ".") || parsed.Port() != "" && parsed.Port() != "443" {
		return fmt.Errorf("bookmark host is forbidden")
	}
	for _, suffix := range []string{"localhost", ".localhost", ".local", ".internal", ".home", ".lan", ".test", ".invalid", ".example"} {
		if hostname == suffix || strings.HasSuffix(hostname, suffix) {
			return fmt.Errorf("bookmark host is forbidden")
		}
	}
	return nil
}

func validateKnowledgeExternalEmbedURL(provider, value string) error {
	if len(value) == 0 || len(value) > 2048 || strings.TrimSpace(value) != value {
		return fmt.Errorf("embed URL is invalid")
	}
	parsed, err := url.ParseRequestURI(value)
	if err != nil || parsed.Scheme != "https" || parsed.User != nil || parsed.Port() != "" || parsed.Fragment != "" {
		return fmt.Errorf("embed URL is invalid")
	}
	if provider != "" && !knowledgeEmbedProviderKeyPattern.MatchString(provider) {
		return fmt.Errorf("embed provider is invalid")
	}
	host := strings.ToLower(strings.TrimSuffix(parsed.Hostname(), "."))
	if host == "" || net.ParseIP(host) != nil || !strings.Contains(host, ".") {
		return fmt.Errorf("embed provider is forbidden")
	}
	for _, suffix := range []string{"localhost", ".localhost", ".local", ".internal", ".home", ".lan", ".test", ".invalid", ".example"} {
		if host == suffix || strings.HasSuffix(host, suffix) {
			return fmt.Errorf("embed provider is forbidden")
		}
	}
	return nil
}

var knowledgeEmbedProviderKeyPattern = regexp.MustCompile(`^[a-z0-9][a-z0-9_-]{0,63}$`)

func validateKnowledgeExternalEmbeds(content string, registry *knowledgesdk.EmbedProviderRegistry) error {
	if registry == nil {
		return conversationError("unavailable", "embed_provider_registry_unavailable")
	}
	var payload knowledgeDocumentPayload
	if err := json.Unmarshal([]byte(content), &payload); err != nil {
		return conversationError("bad_request", "page_content_schema_invalid")
	}
	var validate func(knowledgeDocumentBlock) error
	validate = func(block knowledgeDocumentBlock) error {
		if block.Type == "externalEmbed" {
			provider, _ := optionalKnowledgeBlockString(block.Props, "provider")
			embedURL, _ := optionalKnowledgeBlockString(block.Props, "url")
			if provider != "" || embedURL != "" {
				canonical, err := registry.Canonicalize(provider, embedURL)
				if err != nil || canonical != embedURL {
					return conversationError("bad_request", "page_embed_provider_rejected")
				}
			}
		}
		for _, child := range block.Children {
			if err := validate(child); err != nil {
				return err
			}
		}
		return nil
	}
	for _, raw := range payload.Blocks {
		var block knowledgeDocumentBlock
		if err := json.Unmarshal(raw, &block); err != nil {
			return conversationError("bad_request", "page_content_schema_invalid")
		}
		if err := validate(block); err != nil {
			return err
		}
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
		if extracted, handled, err := validateKnowledgeInlineContent(item); handled {
			if err != nil {
				return err
			}
			if extracted != "" {
				*words = append(*words, extracted)
			}
			return nil
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

func validateKnowledgeInlineContent(item map[string]any) (string, bool, error) {
	itemType, _ := item["type"].(string)
	if itemType == "inlineFormula" {
		if !hasOnlyKnowledgeObjectKeys(item, "type", "props", "content") {
			return "", true, fmt.Errorf("inline formula contains unsupported fields")
		}
		source, ok := item["content"].(string)
		if !ok || len(source) > 16*1024 || strings.ContainsRune(source, 0) {
			return "", true, fmt.Errorf("inline formula source is invalid")
		}
		if props, found := item["props"]; found {
			values, ok := props.(map[string]any)
			if !ok || len(values) != 0 {
				return "", true, fmt.Errorf("inline formula properties are invalid")
			}
		}
		return strings.TrimSpace(source), true, nil
	}
	if itemType != "personMention" && itemType != "dateMention" && itemType != "pageMention" && itemType != "blockMention" {
		return "", false, nil
	}
	if !hasOnlyKnowledgeObjectKeys(item, "type", "props") {
		return "", true, fmt.Errorf("inline mention contains unsupported fields")
	}
	props, ok := item["props"].(map[string]any)
	if !ok {
		return "", true, fmt.Errorf("inline mention properties are invalid")
	}
	switch itemType {
	case "personMention":
		if !hasOnlyKnowledgeObjectKeys(props, "userId") {
			return "", true, fmt.Errorf("person mention properties are invalid")
		}
		userID, err := optionalKnowledgeBlockString(props, "userId")
		if err != nil || !validLibraryUser(userID) {
			return "", true, fmt.Errorf("person mention target is invalid")
		}
		return "@" + userID, true, nil
	case "dateMention":
		if !hasOnlyKnowledgeObjectKeys(props, "date") {
			return "", true, fmt.Errorf("date mention properties are invalid")
		}
		date, err := optionalKnowledgeBlockString(props, "date")
		parsed, parseErr := time.Parse("2006-01-02", date)
		if err != nil || parseErr != nil || parsed.Format("2006-01-02") != date {
			return "", true, fmt.Errorf("date mention target is invalid")
		}
		return date, true, nil
	case "pageMention":
		if !hasOnlyKnowledgeObjectKeys(props, "pageId") {
			return "", true, fmt.Errorf("page mention properties are invalid")
		}
		pageID, err := optionalKnowledgeBlockString(props, "pageId")
		if err != nil || !validKnowledgePageID(pageID) {
			return "", true, fmt.Errorf("page mention target is invalid")
		}
		return "knowledge-page:" + pageID, true, nil
	case "blockMention":
		if !hasOnlyKnowledgeObjectKeys(props, "pageId", "blockId") {
			return "", true, fmt.Errorf("block mention properties are invalid")
		}
		pageID, pageErr := optionalKnowledgeBlockString(props, "pageId")
		blockID, blockErr := optionalKnowledgeBlockString(props, "blockId")
		if pageErr != nil || blockErr != nil || !validKnowledgePageID(pageID) || !knowledgeBlockIDPattern.MatchString(blockID) {
			return "", true, fmt.Errorf("block mention target is invalid")
		}
		return "knowledge-page:" + pageID + "#" + blockID, true, nil
	}
	return "", true, fmt.Errorf("inline mention type is invalid")
}
