package store

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"sort"
	"strings"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

var pageContentRoots = map[string]string{
	knowledgesdk.KnowledgePageTypeMultidimensionalTable: "fields",
	knowledgesdk.KnowledgePageTypeSpreadsheet:           "sheets",
	knowledgesdk.KnowledgePageTypePresentation:          "slides",
	knowledgesdk.KnowledgePageTypeForm:                  "components",
	knowledgesdk.KnowledgePageTypeMindNote:              "nodes",
	knowledgesdk.KnowledgePageTypeWhiteboard:            "nodes",
	knowledgesdk.KnowledgePageTypeMindMap:               "root",
	knowledgesdk.KnowledgePageTypeFlowchart:             "nodes",
}

func validKnowledgePageType(value string) bool {
	if value == knowledgesdk.KnowledgePageTypeDocument {
		return true
	}
	_, ok := pageContentRoots[value]
	return ok
}

func emptyTypedPageContent(contentType string) string {
	switch contentType {
	case knowledgesdk.KnowledgePageTypeDocument:
		return `{"blocks":[]}`
	case knowledgesdk.KnowledgePageTypeMultidimensionalTable:
		return `{"fields":[{"id":"title","name":"标题","type":"text"}],"records":[]}`
	case knowledgesdk.KnowledgePageTypeSpreadsheet:
		return `{"id":"workbook-1","name":"工作表","appVersion":"1.1.0","locale":"zhCN","dateSystem":"date1900","styles":{},"sheetOrder":["sheet-1"],"sheets":{"sheet-1":{"id":"sheet-1","name":"工作表 1","tabColor":"","hidden":0,"rowCount":1000,"columnCount":20,"zoomRatio":1,"freeze":{"xSplit":0,"ySplit":0,"startRow":-1,"startColumn":-1},"scrollTop":0,"scrollLeft":0,"defaultColumnWidth":88,"defaultRowHeight":24,"mergeData":[],"cellData":{},"rowData":{},"columnData":{},"showGridlines":1,"rowHeader":{"width":46,"hidden":0},"columnHeader":{"height":20,"hidden":0},"rightToLeft":0}},"resources":[]}`
	case knowledgesdk.KnowledgePageTypePresentation:
		return `{"slides":[{"id":"slide-1","title":"未命名幻灯片","elements":[],"files":{}}]}`
	case knowledgesdk.KnowledgePageTypeForm:
		return `{"display":"form","components":[{"type":"textfield","key":"question1","label":"未命名问题","input":true}]}`
	case knowledgesdk.KnowledgePageTypeMindNote:
		return `{"nodes":[{"id":"note-1","type":"bulletListItem","props":{},"content":[{"type":"text","text":"未命名主题","styles":{}}],"children":[]}]}`
	case knowledgesdk.KnowledgePageTypeWhiteboard:
		return `{"nodes":[],"files":{}}`
	case knowledgesdk.KnowledgePageTypeMindMap:
		return `{"root":{"nodeData":{"id":"root","topic":"中心主题","children":[]},"direction":2}}`
	case knowledgesdk.KnowledgePageTypeFlowchart:
		return `{"nodes":[{"id":"start","type":"ellipse","x":240,"y":160,"text":"开始"}],"edges":[]}`
	default:
		return ""
	}
}

func normalizedTypedPageContent(contentType string, schema int, content, suppliedHash string) (knowledgesdk.PageContent, error) {
	if !validKnowledgePageType(contentType) {
		return knowledgesdk.PageContent{}, conversationError("bad_request", "page_content_type_invalid")
	}
	if contentType == knowledgesdk.KnowledgePageTypeDocument {
		return normalizedPageContent(schema, content, suppliedHash)
	}
	if schema != knowledgesdk.PageContentSchemaVersion || !executionText(content, knowledgePageMaximumBytes, true) {
		return knowledgesdk.PageContent{}, conversationError("bad_request", "page_content_invalid")
	}
	var value map[string]any
	decoder := json.NewDecoder(strings.NewReader(content))
	decoder.UseNumber()
	if err := decoder.Decode(&value); err != nil || len(value) == 0 {
		return knowledgesdk.PageContent{}, conversationError("bad_request", "page_content_invalid")
	}
	if err := decoder.Decode(&struct{}{}); err != io.EOF {
		return knowledgesdk.PageContent{}, conversationError("bad_request", "page_content_invalid")
	}
	root := pageContentRoots[contentType]
	rootValue, ok := value[root]
	if !ok {
		return knowledgesdk.PageContent{}, conversationError("bad_request", "page_content_schema_invalid")
	}
	if contentType == knowledgesdk.KnowledgePageTypeMindMap || contentType == knowledgesdk.KnowledgePageTypeSpreadsheet {
		if _, valid := rootValue.(map[string]any); !valid {
			return knowledgesdk.PageContent{}, conversationError("bad_request", "page_content_schema_invalid")
		}
	} else if _, valid := rootValue.([]any); !valid {
		return knowledgesdk.PageContent{}, conversationError("bad_request", "page_content_schema_invalid")
	}
	words := make([]string, 0, 32)
	nodes := 0
	if err := collectTypedPageText(value, "", 0, &nodes, &words); err != nil {
		return knowledgesdk.PageContent{}, conversationError("bad_request", "page_content_schema_invalid")
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

func collectTypedPageText(value any, key string, depth int, nodes *int, words *[]string) error {
	*nodes++
	if depth > 16 || *nodes > 20000 {
		return fmt.Errorf("typed page exceeds structural limits")
	}
	switch item := value.(type) {
	case map[string]any:
		if len(item) > 256 {
			return fmt.Errorf("typed page object is too large")
		}
		keys := make([]string, 0, len(item))
		for childKey := range item {
			keys = append(keys, childKey)
		}
		sort.Strings(keys)
		for _, childKey := range keys {
			child := item[childKey]
			if err := collectTypedPageText(child, childKey, depth+1, nodes, words); err != nil {
				return err
			}
		}
	case []any:
		if len(item) > 10000 {
			return fmt.Errorf("typed page array is too large")
		}
		for _, child := range item {
			if err := collectTypedPageText(child, key, depth+1, nodes, words); err != nil {
				return err
			}
		}
	case string:
		if len(item) > knowledgePageMaximumBytes || strings.ContainsRune(item, '\x00') {
			return fmt.Errorf("typed page string is invalid")
		}
		if key != "id" && key != "type" && key != "kind" && key != "from" && key != "to" {
			*words = append(*words, item)
		}
	case json.Number, bool, nil:
		return nil
	default:
		return fmt.Errorf("unsupported typed page value")
	}
	return nil
}

func emptyPageContentForType(contentType string) knowledgesdk.PageContent {
	value, _ := normalizedTypedPageContent(contentType, knowledgesdk.PageContentSchemaVersion, emptyTypedPageContent(contentType), "")
	return value
}
