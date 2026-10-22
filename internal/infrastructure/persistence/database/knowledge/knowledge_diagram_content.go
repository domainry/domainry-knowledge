package store

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"net/url"
	"strings"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

const emptyKnowledgeMindMapContent = `{"schema_version":1,"theme":"emerald","layout":"side","compact":true,"root":{"id":"root","text":"中心主题","expanded":true,"direction":"auto","style":{"color":"#ffffff","background_color":"#00856a","font_weight":"bold"},"children":[]},"relations":[]}`
const emptyKnowledgeFlowchartContent = `{"schema_version":1,"theme":"emerald","layout":"free","grid":true,"nodes":[{"id":"start","type":"start","x":240,"y":160,"text":"开始","style":{"color":"#17332b","background_color":"#e8f5f0","font_weight":"normal"}}],"edges":[]}`

var diagramThemes = map[string]bool{"emerald": true, "ocean": true, "sunset": true, "mono": true}
var mindMapLayouts = map[string]bool{"side": true, "left": true, "right": true, "down": true}
var flowchartLayouts = map[string]bool{"free": true, "horizontal": true, "vertical": true}
var flowchartNodeTypes = map[string]bool{
	"start": true, "end": true, "process": true, "decision": true, "subprocess": true,
	"user_task": true, "service_task": true, "data": true, "database": true, "document": true,
	"manual_input": true, "preparation": true, "delay": true, "connector": true, "annotation": true,
}
var flowchartNodeLabels = map[string]string{
	"start": "开始节点", "end": "结束节点", "process": "处理步骤", "decision": "判断节点", "subprocess": "子流程",
	"user_task": "人工任务", "service_task": "自动任务", "data": "数据节点", "database": "数据库节点", "document": "文档节点",
	"manual_input": "手工输入", "preparation": "准备节点", "delay": "延迟节点", "connector": "连接点", "annotation": "注释节点",
}
var flowchartEdgeTypes = map[string]bool{"polyline": true, "line": true, "bezier": true}

func diagramColor(value any) bool {
	text, ok := value.(string)
	if !ok || len(text) != 7 || text[0] != '#' {
		return false
	}
	for _, character := range text[1:] {
		if character < '0' || character > '9' && character < 'A' || character > 'F' && character < 'a' || character > 'f' {
			return false
		}
	}
	return true
}

func validateDiagramNodeStyle(value any) bool {
	style, ok := value.(map[string]any)
	if !ok || !hasOnlyKnowledgeObjectKeys(style, "color", "background_color", "font_weight") || len(style) != 3 || !diagramColor(style["color"]) || !diagramColor(style["background_color"]) {
		return false
	}
	weight, ok := style["font_weight"].(string)
	return ok && (weight == "normal" || weight == "bold")
}

func validDiagramText(value string, maximumBytes int) bool {
	if !executionText(value, maximumBytes, false) {
		return false
	}
	for _, character := range value {
		if character <= 0x08 || character == 0x0b || character == 0x0c || character >= 0x0e && character <= 0x1f || character == 0x7f {
			return false
		}
	}
	return true
}

func validateMindMapNode(value any, depth int, ids map[string]bool, count *int, lines *[]string) bool {
	if depth > 64 {
		return false
	}
	node, ok := value.(map[string]any)
	if !ok || len(node) < 6 || len(node) > 9 || !hasOnlyKnowledgeObjectKeys(node, "id", "text", "expanded", "direction", "style", "tags", "note", "link", "children") {
		return false
	}
	id, idOK := node["id"].(string)
	text, textOK := node["text"].(string)
	_, expandedOK := node["expanded"].(bool)
	direction, directionOK := node["direction"].(string)
	children, childrenOK := node["children"].([]any)
	if !idOK || !validMindNoteID(id) || ids[id] || !textOK || !validDiagramText(text, 4096) || !expandedOK || !directionOK || direction != "auto" && direction != "left" && direction != "right" || !validateDiagramNodeStyle(node["style"]) || !childrenOK {
		return false
	}
	if tags, exists := node["tags"]; exists {
		values, valid := tags.([]any)
		if !valid || len(values) > 12 {
			return false
		}
		seen := map[string]bool{}
		for _, raw := range values {
			value, valid := raw.(string)
			if !valid || !validDiagramText(value, 64) || strings.TrimSpace(value) == "" || seen[value] {
				return false
			}
			seen[value] = true
		}
	}
	if note, exists := node["note"]; exists {
		value, valid := note.(string)
		if !valid || !validDiagramText(value, 4096) {
			return false
		}
	}
	if link, exists := node["link"]; exists {
		value, valid := link.(string)
		if !valid || !validDiagramText(value, 2048) {
			return false
		}
		if value != "" {
			parsed, err := url.ParseRequestURI(value)
			if err != nil || parsed.Scheme != "http" && parsed.Scheme != "https" || parsed.Hostname() == "" || parsed.User != nil {
				return false
			}
		}
	}
	ids[id] = true
	*count++
	if *count > 20000 {
		return false
	}
	if strings.TrimSpace(text) != "" {
		*lines = append(*lines, strings.Repeat("  ", depth-1)+text)
	}
	if note, ok := node["note"].(string); ok && strings.TrimSpace(note) != "" {
		*lines = append(*lines, strings.Repeat("  ", depth)+note)
	}
	if tags, ok := node["tags"].([]any); ok {
		for _, raw := range tags {
			if tag, valid := raw.(string); valid {
				*lines = append(*lines, strings.Repeat("  ", depth)+tag)
			}
		}
	}
	for _, child := range children {
		if !validateMindMapNode(child, depth+1, ids, count, lines) {
			return false
		}
	}
	return true
}

func validateMindMapContent(content string) (string, error) {
	root, err := decodeMindNoteContent(content)
	if err != nil {
		return "", err
	}
	if len(root) != 6 || !hasOnlyKnowledgeObjectKeys(root, "schema_version", "theme", "layout", "compact", "root", "relations") {
		return "", conversationError("bad_request", "page_content_schema_invalid")
	}
	schema, schemaOK := root["schema_version"].(json.Number)
	theme, themeOK := root["theme"].(string)
	layout, layoutOK := root["layout"].(string)
	_, compactOK := root["compact"].(bool)
	relations, relationsOK := root["relations"].([]any)
	if !schemaOK || schema.String() != "1" || !themeOK || !diagramThemes[theme] || !layoutOK || !mindMapLayouts[layout] || !compactOK || !relationsOK || len(relations) > 20000 {
		return "", conversationError("bad_request", "page_content_schema_invalid")
	}
	ids := map[string]bool{}
	lines := make([]string, 0, 32)
	count := 0
	if !validateMindMapNode(root["root"], 1, ids, &count, &lines) {
		return "", conversationError("bad_request", "page_content_schema_invalid")
	}
	relationIDs := map[string]bool{}
	for _, raw := range relations {
		relation, ok := raw.(map[string]any)
		if !ok || len(relation) != 8 || !hasOnlyKnowledgeObjectKeys(relation, "id", "from", "to", "label", "bidirectional", "color", "width", "dashed") {
			return "", conversationError("bad_request", "page_content_schema_invalid")
		}
		id, idOK := relation["id"].(string)
		from, fromOK := relation["from"].(string)
		to, toOK := relation["to"].(string)
		label, labelOK := relation["label"].(string)
		_, bidirectionalOK := relation["bidirectional"].(bool)
		_, dashedOK := relation["dashed"].(bool)
		_, widthOK := whiteboardNumber(relation["width"], 1, 12)
		if !idOK || !validMindNoteID(id) || ids[id] || relationIDs[id] || !fromOK || !toOK || from == to || !ids[from] || !ids[to] || !labelOK || !validDiagramText(label, 1024) || !bidirectionalOK || !diagramColor(relation["color"]) || !widthOK || !dashedOK {
			return "", conversationError("bad_request", "page_content_schema_invalid")
		}
		relationIDs[id] = true
		if strings.TrimSpace(label) != "" {
			lines = append(lines, label)
		}
	}
	return strings.Join(lines, "\n"), nil
}

func validateFlowchartContent(content string) (string, error) {
	root, err := decodeMindNoteContent(content)
	if err != nil {
		return "", err
	}
	if len(root) != 6 || !hasOnlyKnowledgeObjectKeys(root, "schema_version", "theme", "layout", "grid", "nodes", "edges") {
		return "", conversationError("bad_request", "page_content_schema_invalid")
	}
	schema, schemaOK := root["schema_version"].(json.Number)
	theme, themeOK := root["theme"].(string)
	layout, layoutOK := root["layout"].(string)
	_, gridOK := root["grid"].(bool)
	nodes, nodesOK := root["nodes"].([]any)
	edges, edgesOK := root["edges"].([]any)
	if !schemaOK || schema.String() != "1" || !themeOK || !diagramThemes[theme] || !layoutOK || !flowchartLayouts[layout] || !gridOK || !nodesOK || !edgesOK || len(nodes) > 20000 || len(edges) > 40000 {
		return "", conversationError("bad_request", "page_content_schema_invalid")
	}
	ids := map[string]bool{}
	lines := make([]string, 0, len(nodes))
	for _, raw := range nodes {
		node, ok := raw.(map[string]any)
		if !ok || len(node) != 6 || !hasOnlyKnowledgeObjectKeys(node, "id", "type", "x", "y", "text", "style") {
			return "", conversationError("bad_request", "page_content_schema_invalid")
		}
		id, idOK := node["id"].(string)
		typeName, typeOK := node["type"].(string)
		text, textOK := node["text"].(string)
		_, xOK := whiteboardNumber(node["x"], -10000000, 10000000)
		_, yOK := whiteboardNumber(node["y"], -10000000, 10000000)
		if !idOK || !validMindNoteID(id) || ids[id] || !typeOK || !flowchartNodeTypes[typeName] || !xOK || !yOK || !textOK || !validDiagramText(text, 4096) || !validateDiagramNodeStyle(node["style"]) {
			return "", conversationError("bad_request", "page_content_schema_invalid")
		}
		ids[id] = true
		if strings.TrimSpace(text) != "" {
			lines = append(lines, text)
		}
	}
	edgeIDs := map[string]bool{}
	for _, raw := range edges {
		edge, ok := raw.(map[string]any)
		if !ok || len(edge) != 6 || !hasOnlyKnowledgeObjectKeys(edge, "id", "source", "target", "label", "type", "style") {
			return "", conversationError("bad_request", "page_content_schema_invalid")
		}
		id, idOK := edge["id"].(string)
		source, sourceOK := edge["source"].(string)
		target, targetOK := edge["target"].(string)
		label, labelOK := edge["label"].(string)
		typeName, typeOK := edge["type"].(string)
		style, styleOK := edge["style"].(map[string]any)
		if !idOK || !validMindNoteID(id) || ids[id] || edgeIDs[id] || !sourceOK || !targetOK || source == target || !ids[source] || !ids[target] || !labelOK || !validDiagramText(label, 1024) || !typeOK || !flowchartEdgeTypes[typeName] || !styleOK || len(style) != 3 || !hasOnlyKnowledgeObjectKeys(style, "color", "width", "dashed") || !diagramColor(style["color"]) {
			return "", conversationError("bad_request", "page_content_schema_invalid")
		}
		if _, ok = whiteboardNumber(style["width"], 1, 12); !ok {
			return "", conversationError("bad_request", "page_content_schema_invalid")
		}
		if _, ok = style["dashed"].(bool); !ok {
			return "", conversationError("bad_request", "page_content_schema_invalid")
		}
		edgeIDs[id] = true
		if strings.TrimSpace(label) != "" {
			lines = append(lines, label)
		}
	}
	return strings.Join(lines, "\n"), nil
}

func diagramPageTypeDefinition(id, empty string, validate func(string) (string, error), rootKey, rootKind string) knowledgePageTypeDefinition {
	return knowledgePageTypeDefinition{
		ID:           id,
		EmptyContent: func() string { return empty },
		Normalize: func(schema int, content, suppliedHash string) (knowledgesdk.PageContent, error) {
			plainText, err := validate(content)
			if err != nil {
				return knowledgesdk.PageContent{}, err
			}
			normalized, err := normalizedStructuredPageContent(rootKey, rootKind, schema, content, suppliedHash)
			if err != nil {
				return knowledgesdk.PageContent{}, err
			}
			normalized.PlainText = plainText
			normalized.Summary = pageContentSummary(plainText)
			return normalized, nil
		},
		ExtractPlainText: normalizedPagePlainText,
		ExtractSummary:   pageContentSummary,
		ScanReferences:   scanJSONPageReferences,
		ValidateBeforePublish: func(content string) error {
			if _, err := validate(content); err != nil {
				return err
			}
			return validateTrustedPageContent(content)
		},
	}
}

func mindMapPageTypeDefinition() knowledgePageTypeDefinition {
	return diagramPageTypeDefinition(knowledgesdk.KnowledgePageTypeMindMap, emptyKnowledgeMindMapContent, validateMindMapContent, "root", "object")
}

func flowchartPageTypeDefinition() knowledgePageTypeDefinition {
	return diagramPageTypeDefinition(knowledgesdk.KnowledgePageTypeFlowchart, emptyKnowledgeFlowchartContent, validateFlowchartContent, "nodes", "array")
}

type knowledgeDiagramCommentTarget struct {
	quote string
	hash  string
}

func diagramCommentTarget(value map[string]any, quote string) (knowledgeDiagramCommentTarget, error) {
	raw, err := json.Marshal(value)
	if err != nil {
		return knowledgeDiagramCommentTarget{}, err
	}
	digest := sha256.Sum256(raw)
	return knowledgeDiagramCommentTarget{quote: strings.TrimSpace(quote), hash: hex.EncodeToString(digest[:])}, nil
}

func mindMapCommentTargets(content string) (map[string]knowledgeDiagramCommentTarget, error) {
	if _, err := validateMindMapContent(content); err != nil {
		return nil, err
	}
	root, err := decodeMindNoteContent(content)
	if err != nil {
		return nil, err
	}
	result := map[string]knowledgeDiagramCommentTarget{}
	var collect func(map[string]any) error
	collect = func(node map[string]any) error {
		id, _ := node["id"].(string)
		quote, _ := node["text"].(string)
		if strings.TrimSpace(quote) == "" {
			quote = "思维导图节点"
		}
		target, targetErr := diagramCommentTarget(node, quote)
		if targetErr != nil {
			return targetErr
		}
		result[id] = target
		children, _ := node["children"].([]any)
		for _, raw := range children {
			if child, ok := raw.(map[string]any); ok {
				if childErr := collect(child); childErr != nil {
					return childErr
				}
			}
		}
		return nil
	}
	if node, ok := root["root"].(map[string]any); ok {
		if err = collect(node); err != nil {
			return nil, err
		}
	}
	for _, raw := range root["relations"].([]any) {
		relation := raw.(map[string]any)
		id := relation["id"].(string)
		quote := strings.TrimSpace(relation["label"].(string))
		if quote == "" {
			quote = "思维导图关系"
		}
		target, targetErr := diagramCommentTarget(relation, quote)
		if targetErr != nil {
			return nil, targetErr
		}
		result[id] = target
	}
	return result, nil
}

func flowchartCommentTargets(content string) (map[string]knowledgeDiagramCommentTarget, error) {
	if _, err := validateFlowchartContent(content); err != nil {
		return nil, err
	}
	root, err := decodeMindNoteContent(content)
	if err != nil {
		return nil, err
	}
	result := map[string]knowledgeDiagramCommentTarget{}
	for _, raw := range root["nodes"].([]any) {
		node := raw.(map[string]any)
		id := node["id"].(string)
		quote := strings.TrimSpace(node["text"].(string))
		if quote == "" {
			quote = flowchartNodeLabels[node["type"].(string)]
		}
		target, targetErr := diagramCommentTarget(node, quote)
		if targetErr != nil {
			return nil, targetErr
		}
		result[id] = target
	}
	for _, raw := range root["edges"].([]any) {
		edge := raw.(map[string]any)
		id := edge["id"].(string)
		quote := strings.TrimSpace(edge["label"].(string))
		if quote == "" {
			quote = "流程连线"
		}
		target, targetErr := diagramCommentTarget(edge, quote)
		if targetErr != nil {
			return nil, targetErr
		}
		result[id] = target
	}
	return result, nil
}

func diagramAnchorHashes(content, contentType string) (map[string]string, error) {
	var targets map[string]knowledgeDiagramCommentTarget
	var err error
	if contentType == knowledgesdk.KnowledgePageTypeMindMap {
		targets, err = mindMapCommentTargets(content)
	} else {
		targets, err = flowchartCommentTargets(content)
	}
	if err != nil {
		return nil, err
	}
	result := make(map[string]string, len(targets))
	for id, target := range targets {
		result[id] = target.hash
	}
	return result, nil
}

func knowledgeDiagramCommentAnchor(content, contentType, nodeID, quote string) (knowledgesdk.KnowledgePageCommentAnchor, error) {
	var targets map[string]knowledgeDiagramCommentTarget
	var err error
	if contentType == knowledgesdk.KnowledgePageTypeMindMap {
		targets, err = mindMapCommentTargets(content)
	} else {
		targets, err = flowchartCommentTargets(content)
	}
	if err != nil {
		return knowledgesdk.KnowledgePageCommentAnchor{}, conversationError("bad_request", "page_comment_anchor_invalid")
	}
	target, found := targets[nodeID]
	if !found {
		return knowledgesdk.KnowledgePageCommentAnchor{}, conversationError("bad_request", "page_comment_anchor_not_found")
	}
	normalizedQuote := normalizedKnowledgeCommentQuote(quote)
	visible := normalizedKnowledgeCommentQuote(target.quote)
	if normalizedQuote == "" || visible == "" || !strings.Contains(visible, normalizedQuote) {
		return knowledgesdk.KnowledgePageCommentAnchor{}, conversationError("bad_request", "page_comment_quote_invalid")
	}
	return knowledgesdk.KnowledgePageCommentAnchor{NodeID: nodeID, Quote: normalizedQuote, BlockSHA256: target.hash}, nil
}
