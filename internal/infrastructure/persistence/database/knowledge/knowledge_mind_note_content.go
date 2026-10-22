package store

import (
	"encoding/json"
	"io"
	"strings"
	"time"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

const (
	mindNoteMaximumNodes = 20000
	mindNoteMaximumDepth = 64
)

func validMindNoteID(value string) bool {
	if len(value) == 0 || len(value) > 128 {
		return false
	}
	for index, character := range []byte(value) {
		alphaNumeric := character >= 'a' && character <= 'z' || character >= 'A' && character <= 'Z' || character >= '0' && character <= '9'
		if !alphaNumeric && (index == 0 || character != ':' && character != '_' && character != '-') {
			return false
		}
	}
	return true
}

func validMindNoteText(value string) bool {
	if !executionText(value, 4096, false) {
		return false
	}
	for _, character := range value {
		if character <= 0x08 || character == 0x0b || character == 0x0c || character >= 0x0e && character <= 0x1f || character == 0x7f {
			return false
		}
	}
	return true
}

func decodeMindNoteContent(content string) (map[string]any, error) {
	if !executionText(content, knowledgePageMaximumBytes, true) {
		return nil, conversationError("bad_request", "page_content_invalid")
	}
	var root map[string]any
	decoder := json.NewDecoder(strings.NewReader(content))
	decoder.UseNumber()
	if err := decoder.Decode(&root); err != nil || root == nil {
		return nil, conversationError("bad_request", "page_content_schema_invalid")
	}
	if err := decoder.Decode(&struct{}{}); err != io.EOF {
		return nil, conversationError("bad_request", "page_content_schema_invalid")
	}
	return root, nil
}

func validateMindNoteNodes(raw []any, depth int, ids map[string]bool, count *int) bool {
	if depth > mindNoteMaximumDepth {
		return false
	}
	for _, value := range raw {
		node, ok := value.(map[string]any)
		if !ok || len(node) < 5 || len(node) > 9 || !hasOnlyKnowledgeObjectKeys(node, "id", "text", "completed", "collapsed", "priority", "due_date", "tags", "note", "children") {
			return false
		}
		id, idOK := node["id"].(string)
		text, textOK := node["text"].(string)
		_, completedOK := node["completed"].(bool)
		_, collapsedOK := node["collapsed"].(bool)
		children, childrenOK := node["children"].([]any)
		if !idOK || !validMindNoteID(id) || ids[id] || !textOK || !validMindNoteText(text) || !completedOK || !collapsedOK || !childrenOK {
			return false
		}
		if priority, exists := node["priority"]; exists {
			value, valid := priority.(string)
			if !valid || value != "none" && value != "low" && value != "medium" && value != "high" && value != "urgent" {
				return false
			}
		}
		if dueDate, exists := node["due_date"]; exists {
			value, valid := dueDate.(string)
			if !valid {
				return false
			}
			if value != "" {
				if _, err := time.Parse("2006-01-02", value); err != nil {
					return false
				}
			}
		}
		if note, exists := node["note"]; exists {
			value, valid := note.(string)
			if !valid || !validMindNoteText(value) {
				return false
			}
		}
		if tags, exists := node["tags"]; exists {
			values, valid := tags.([]any)
			if !valid || len(values) > 12 {
				return false
			}
			seen := map[string]bool{}
			for _, raw := range values {
				value, valid := raw.(string)
				if !valid || !executionText(value, 64, true) || seen[value] {
					return false
				}
				seen[value] = true
			}
		}
		ids[id] = true
		*count = *count + 1
		if *count > mindNoteMaximumNodes || !validateMindNoteNodes(children, depth+1, ids, count) {
			return false
		}
	}
	return true
}

func validateMindNoteContent(content string) error {
	root, err := decodeMindNoteContent(content)
	if err != nil {
		return err
	}
	if !hasOnlyKnowledgeObjectKeys(root, "schema_version", "nodes") {
		return conversationError("bad_request", "page_content_schema_invalid")
	}
	schemaVersion, schemaOK := root["schema_version"].(json.Number)
	nodes, nodesOK := root["nodes"].([]any)
	if !schemaOK || schemaVersion.String() != "1" || !nodesOK || len(nodes) == 0 {
		return conversationError("bad_request", "page_content_schema_invalid")
	}
	count := 0
	if !validateMindNoteNodes(nodes, 1, map[string]bool{}, &count) {
		return conversationError("bad_request", "page_content_schema_invalid")
	}
	return nil
}

func mindNotePlainText(content string) string {
	root, err := decodeMindNoteContent(content)
	if err != nil {
		return ""
	}
	lines := make([]string, 0, 32)
	var visit func([]any)
	visit = func(nodes []any) {
		for _, value := range nodes {
			node, _ := value.(map[string]any)
			if text, ok := node["text"].(string); ok && strings.TrimSpace(text) != "" {
				lines = append(lines, text)
			}
			if note, ok := node["note"].(string); ok && strings.TrimSpace(note) != "" {
				lines = append(lines, note)
			}
			if tags, ok := node["tags"].([]any); ok {
				for _, raw := range tags {
					if tag, valid := raw.(string); valid {
						lines = append(lines, tag)
					}
				}
			}
			if children, ok := node["children"].([]any); ok {
				visit(children)
			}
		}
	}
	if nodes, ok := root["nodes"].([]any); ok {
		visit(nodes)
	}
	return strings.TrimSpace(strings.Join(lines, "\n"))
}

func mindNotePageTypeDefinition() knowledgePageTypeDefinition {
	const empty = `{"schema_version":1,"nodes":[{"id":"note-1","text":"未命名主题","completed":false,"collapsed":false,"children":[]}]}`
	return knowledgePageTypeDefinition{
		ID:           knowledgesdk.KnowledgePageTypeMindNote,
		EmptyContent: func() string { return empty },
		Normalize: func(schema int, content, suppliedHash string) (knowledgesdk.PageContent, error) {
			if err := validateMindNoteContent(content); err != nil {
				return knowledgesdk.PageContent{}, err
			}
			normalized, err := normalizedStructuredPageContent("nodes", "array", schema, content, suppliedHash)
			if err != nil {
				return knowledgesdk.PageContent{}, err
			}
			normalized.PlainText = mindNotePlainText(content)
			normalized.Summary = pageContentSummary(normalized.PlainText)
			return normalized, nil
		},
		ExtractPlainText: normalizedPagePlainText,
		ExtractSummary:   pageContentSummary,
		ScanReferences:   scanJSONPageReferences,
		ValidateBeforePublish: func(content string) error {
			if err := validateMindNoteContent(content); err != nil {
				return err
			}
			return validateTrustedPageContent(content)
		},
	}
}
