package store

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"math"
	"net/mail"
	"net/url"
	"regexp"
	"sort"
	"strings"
	"time"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	embedprovider "github.com/domainry/domainry-knowledge/internal/infrastructure/embedprovider"
)

const knowledgePageTypeFile = "file"

type knowledgePageContentReference struct {
	Kind     string
	TargetID string
}

type knowledgePageTypeDefinition struct {
	ID                    string
	EmptyContent          func() string
	Normalize             func(int, string, string) (knowledgesdk.PageContent, error)
	ExtractPlainText      func(knowledgesdk.PageContent) (string, error)
	ExtractSummary        func(string) string
	ScanReferences        func(string) ([]knowledgePageContentReference, error)
	ValidateBeforePublish func(string) error
}

func structuredPageTypeDefinition(id, root, rootKind, empty string) knowledgePageTypeDefinition {
	return knowledgePageTypeDefinition{
		ID:           id,
		EmptyContent: func() string { return empty },
		Normalize: func(schema int, content, suppliedHash string) (knowledgesdk.PageContent, error) {
			return normalizedStructuredPageContent(root, rootKind, schema, content, suppliedHash)
		},
		ExtractPlainText:      normalizedPagePlainText,
		ExtractSummary:        pageContentSummary,
		ScanReferences:        scanJSONPageReferences,
		ValidateBeforePublish: validateTrustedPageContent,
	}
}

func multidimensionalTablePageTypeDefinition() knowledgePageTypeDefinition {
	const empty = `{"schema_version":1,"fields":[{"id":"title","name":"标题","type":"text","required":true}],"records":[],"views":[{"id":"view-grid","name":"表格","type":"grid","row_height":"normal"}]}`
	return knowledgePageTypeDefinition{
		ID:           knowledgesdk.KnowledgePageTypeMultidimensionalTable,
		EmptyContent: func() string { return empty },
		Normalize: func(schema int, content, suppliedHash string) (knowledgesdk.PageContent, error) {
			if err := validateMultidimensionalTableContent(content); err != nil {
				return knowledgesdk.PageContent{}, err
			}
			normalized, err := normalizedStructuredPageContent("fields", "array", schema, content, suppliedHash)
			if err != nil {
				return knowledgesdk.PageContent{}, err
			}
			// Search content is the intersection visible to every page reader; role-
			// or user-restricted field and record values never enter the index.
			normalized.PlainText = gridUniversalPlainText(content)
			normalized.Summary = pageContentSummary(normalized.PlainText)
			return normalized, nil
		},
		ExtractPlainText: normalizedPagePlainText,
		ExtractSummary:   pageContentSummary,
		ScanReferences:   scanJSONPageReferences,
		ValidateBeforePublish: func(content string) error {
			if err := validateMultidimensionalTableContent(content); err != nil {
				return err
			}
			return validateTrustedPageContent(content)
		},
	}
}

func mustKnowledgePageTypeRegistry(definitions []knowledgePageTypeDefinition) map[string]knowledgePageTypeDefinition {
	registry := make(map[string]knowledgePageTypeDefinition, len(definitions))
	for _, definition := range definitions {
		if strings.TrimSpace(definition.ID) == "" || registry[definition.ID].ID != "" || definition.EmptyContent == nil || definition.Normalize == nil || definition.ExtractPlainText == nil || definition.ExtractSummary == nil || definition.ScanReferences == nil || definition.ValidateBeforePublish == nil {
			panic("invalid or duplicate knowledge page type definition: " + definition.ID)
		}
		registry[definition.ID] = definition
	}
	return registry
}

var knowledgePageTypeRegistry = mustKnowledgePageTypeRegistry([]knowledgePageTypeDefinition{
	{
		ID:                    knowledgesdk.KnowledgePageTypeDocument,
		EmptyContent:          func() string { return `{"blocks":[]}` },
		Normalize:             normalizedPageContentStructural,
		ExtractPlainText:      normalizedPagePlainText,
		ExtractSummary:        pageContentSummary,
		ScanReferences:        scanJSONPageReferences,
		ValidateBeforePublish: validateDocumentPageBeforePublishStructural,
	},
	multidimensionalTablePageTypeDefinition(),
	spreadsheetPageTypeDefinition(),
	presentationPageTypeDefinition(),
	formPageTypeDefinition(),
	mindNotePageTypeDefinition(),
	whiteboardPageTypeDefinition(),
	mindMapPageTypeDefinition(),
	flowchartPageTypeDefinition(),
	{
		ID:                    knowledgePageTypeFile,
		EmptyContent:          func() string { return `{"document_id":"","display_mode":"preview","title":""}` },
		Normalize:             normalizedFilePageContent,
		ExtractPlainText:      normalizedPagePlainText,
		ExtractSummary:        pageContentSummary,
		ScanReferences:        scanFilePageReferences,
		ValidateBeforePublish: validateTrustedPageContent,
	},
})

var multidimensionalFormulaToken = regexp.MustCompile(`\{([a-zA-Z0-9_-]{1,128})\}|\d+(?:\.\d+)?|[+*/()-]`)
var multidimensionalColorPattern = regexp.MustCompile(`^#[0-9a-fA-F]{6}$`)
var multidimensionalPhonePattern = regexp.MustCompile(`^[+()0-9 .-]+$`)

func multidimensionalObjectList(value any, maximum int) ([]map[string]any, bool) {
	raw, ok := value.([]any)
	if !ok || len(raw) > maximum {
		return nil, false
	}
	items := make([]map[string]any, 0, len(raw))
	for _, child := range raw {
		item, valid := child.(map[string]any)
		if !valid {
			return nil, false
		}
		items = append(items, item)
	}
	return items, true
}

func multidimensionalStableID(value any) (string, bool) {
	id, ok := value.(string)
	id = strings.TrimSpace(id)
	return id, ok && validNativeOperationEntityID(id)
}

func multidimensionalText(value any, maximum int) (string, bool) {
	text, ok := value.(string)
	text = strings.TrimSpace(text)
	return text, ok && text != "" && executionText(text, maximum, true)
}

func multidimensionalStringList(value any, maximum int) ([]string, bool) {
	raw, ok := value.([]any)
	if !ok || len(raw) > maximum {
		return nil, false
	}
	result := make([]string, 0, len(raw))
	seen := make(map[string]bool, len(raw))
	for _, child := range raw {
		text, valid := child.(string)
		if !valid || !executionText(text, 256, true) || seen[text] {
			return nil, false
		}
		seen[text] = true
		result = append(result, text)
	}
	return result, true
}

func validateMultidimensionalFormula(formula string, fields map[string]map[string]any, fieldID string) ([]string, bool) {
	compact := strings.Join(strings.Fields(formula), "")
	if compact == "" || len(compact) > 512 {
		return nil, false
	}
	indexes := multidimensionalFormulaToken.FindAllStringSubmatchIndex(compact, -1)
	position := 0
	references := make([]string, 0)
	for _, index := range indexes {
		if index[0] != position {
			return nil, false
		}
		position = index[1]
		if index[2] >= 0 {
			reference := compact[index[2]:index[3]]
			field := fields[reference]
			fieldType, _ := field["type"].(string)
			if reference == fieldID || field == nil || fieldType != "number" && fieldType != "currency" && fieldType != "progress" && fieldType != "rating" && fieldType != "formula" {
				return nil, false
			}
			references = append(references, reference)
		}
	}
	return references, position == len(compact)
}

func multidimensionalFiniteNumber(value any) (float64, bool) {
	number, ok := value.(json.Number)
	if !ok {
		return 0, false
	}
	parsed, err := number.Float64()
	return parsed, err == nil && !math.IsInf(parsed, 0) && !math.IsNaN(parsed)
}

func validateMultidimensionalValue(field map[string]any, value any, recordIDs map[string]bool) bool {
	fieldType, _ := field["type"].(string)
	switch fieldType {
	case "text", "long_text", "barcode":
		text, ok := value.(string)
		maximum := 32768
		if fieldType == "barcode" {
			maximum = 512
		}
		return ok && executionText(text, maximum, true)
	case "number", "currency":
		_, ok := multidimensionalFiniteNumber(value)
		return ok || value == nil
	case "email":
		text, ok := value.(string)
		if !ok || !executionText(text, 320, true) {
			return value == nil
		}
		address, err := mail.ParseAddress(text)
		return err == nil && address.Address == text
	case "phone":
		text, ok := value.(string)
		if !ok || !executionText(text, 64, true) || !multidimensionalPhonePattern.MatchString(text) {
			return value == nil
		}
		digits := 0
		for _, character := range text {
			if character >= '0' && character <= '9' {
				digits++
			}
		}
		return digits >= 5 && digits <= 20
	case "url":
		text, ok := value.(string)
		if !ok || !executionText(text, 2048, true) {
			return value == nil
		}
		parsed, err := url.ParseRequestURI(text)
		return err == nil && (parsed.Scheme == "https" || parsed.Scheme == "http") && parsed.Hostname() != "" && parsed.User == nil
	case "single_select":
		option, ok := value.(string)
		if !ok {
			return value == nil
		}
		options, valid := multidimensionalObjectList(field["options"], 256)
		if !valid {
			return false
		}
		for _, item := range options {
			if item["id"] == option {
				return true
			}
		}
		return false
	case "multi_select":
		values, ok := multidimensionalStringList(value, 256)
		if !ok {
			return false
		}
		for _, child := range values {
			if !validateMultidimensionalValue(map[string]any{"type": "single_select", "options": field["options"]}, child, recordIDs) {
				return false
			}
		}
		return true
	case "person":
		_, ok := multidimensionalStringList(value, 256)
		return ok
	case "date":
		date, ok := value.(string)
		if !ok {
			return value == nil
		}
		_, err := time.Parse("2006-01-02", date)
		return err == nil
	case "attachment":
		attachments, ok := multidimensionalObjectList(value, 128)
		if !ok {
			return false
		}
		for _, attachment := range attachments {
			documentID, _ := attachment["document_id"].(string)
			title, titleOK := multidimensionalText(attachment["title"], 512)
			if !validKnowledgeDocumentID(documentID) || !titleOK || title == "" {
				return false
			}
		}
		return true
	case "checkbox":
		_, ok := value.(bool)
		return ok
	case "progress":
		number, ok := multidimensionalFiniteNumber(value)
		return ok && number >= 0 && number <= 100
	case "rating":
		number, ok := multidimensionalFiniteNumber(value)
		return ok && number >= 0 && number <= 5 && number == math.Trunc(number)
	case "relation":
		values, ok := multidimensionalStringList(value, 256)
		if !ok {
			return false
		}
		relation, _ := field["relation"].(map[string]any)
		if relation["page_id"] == "self" {
			for _, id := range values {
				if !recordIDs[id] {
					return false
				}
			}
		}
		return true
	case "formula", "lookup", "created_time", "updated_time", "auto_number":
		return false
	default:
		return false
	}
}

func validateMultidimensionalTableContent(content string) error {
	var root map[string]any
	decoder := json.NewDecoder(strings.NewReader(content))
	decoder.UseNumber()
	if err := decoder.Decode(&root); err != nil || root == nil {
		return conversationError("bad_request", "page_content_schema_invalid")
	}
	version, ok := multidimensionalFiniteNumber(root["schema_version"])
	fields, fieldsOK := multidimensionalObjectList(root["fields"], 256)
	records, recordsOK := multidimensionalObjectList(root["records"], 100000)
	views, viewsOK := multidimensionalObjectList(root["views"], 128)
	if !ok || version != 1 || !fieldsOK || len(fields) == 0 || !recordsOK || !viewsOK || len(views) == 0 {
		return conversationError("bad_request", "page_content_schema_invalid")
	}
	fieldByID := make(map[string]map[string]any, len(fields))
	allowedFieldTypes := map[string]bool{"text": true, "long_text": true, "number": true, "currency": true, "single_select": true, "multi_select": true, "person": true, "date": true, "attachment": true, "checkbox": true, "progress": true, "rating": true, "email": true, "phone": true, "url": true, "barcode": true, "formula": true, "relation": true, "lookup": true, "created_time": true, "updated_time": true, "auto_number": true}
	for _, field := range fields {
		id, idOK := multidimensionalStableID(field["id"])
		_, nameOK := multidimensionalText(field["name"], 256)
		fieldType, typeOK := field["type"].(string)
		if !idOK || !nameOK || !typeOK || !allowedFieldTypes[fieldType] || fieldByID[id] != nil {
			return conversationError("bad_request", "page_content_schema_invalid")
		}
		fieldByID[id] = field
		if fieldType == "single_select" || fieldType == "multi_select" {
			options, valid := multidimensionalObjectList(field["options"], 256)
			if !valid {
				return conversationError("bad_request", "page_content_schema_invalid")
			}
			seen := make(map[string]bool, len(options))
			for _, option := range options {
				optionID, optionIDOK := multidimensionalStableID(option["id"])
				_, labelOK := multidimensionalText(option["label"], 256)
				if !optionIDOK || !labelOK || seen[optionID] {
					return conversationError("bad_request", "page_content_schema_invalid")
				}
				seen[optionID] = true
			}
		}
		if fieldType == "relation" {
			relation, valid := field["relation"].(map[string]any)
			pageID, _ := relation["page_id"].(string)
			if !valid || pageID != "self" && !validKnowledgePageID(pageID) {
				return conversationError("bad_request", "page_content_schema_invalid")
			}
		}
	}
	formulaDependencies := make(map[string][]string)
	for id, field := range fieldByID {
		switch field["type"] {
		case "formula":
			formula, valid := field["formula"].(string)
			dependencies, validFormula := validateMultidimensionalFormula(formula, fieldByID, id)
			if !valid || !validFormula {
				return conversationError("bad_request", "page_content_schema_invalid")
			}
			formulaDependencies[id] = dependencies
		case "lookup":
			lookup, valid := field["lookup"].(map[string]any)
			relationID, _ := lookup["relation_field_id"].(string)
			targetID, _ := lookup["target_field_id"].(string)
			if !valid || fieldByID[relationID] == nil || fieldByID[relationID]["type"] != "relation" || fieldByID[targetID] == nil {
				return conversationError("bad_request", "page_content_schema_invalid")
			}
		}
	}
	visiting, visited := make(map[string]bool), make(map[string]bool)
	var cyclic func(string) bool
	cyclic = func(id string) bool {
		if visiting[id] {
			return true
		}
		if visited[id] {
			return false
		}
		visiting[id] = true
		for _, dependency := range formulaDependencies[id] {
			if _, formula := formulaDependencies[dependency]; formula && cyclic(dependency) {
				return true
			}
		}
		visiting[id] = false
		visited[id] = true
		return false
	}
	for id := range formulaDependencies {
		if cyclic(id) {
			return conversationError("bad_request", "page_content_schema_invalid")
		}
	}
	recordIDs := make(map[string]bool, len(records))
	for _, record := range records {
		id, idOK := multidimensionalStableID(record["id"])
		if !idOK || recordIDs[id] {
			return conversationError("bad_request", "page_content_schema_invalid")
		}
		recordIDs[id] = true
		for _, key := range []string{"created_at", "updated_at"} {
			if raw, exists := record[key]; exists {
				stamp, valid := raw.(string)
				if !valid || !executionText(stamp, 64, false) {
					return conversationError("bad_request", "page_content_schema_invalid")
				}
				if _, err := time.Parse(time.RFC3339, stamp); err != nil {
					return conversationError("bad_request", "page_content_schema_invalid")
				}
			}
		}
	}
	for _, record := range records {
		values, valid := record["values"].(map[string]any)
		if !valid {
			return conversationError("bad_request", "page_content_schema_invalid")
		}
		for fieldID, value := range values {
			field := fieldByID[fieldID]
			if field == nil || !validateMultidimensionalValue(field, value, recordIDs) {
				return conversationError("bad_request", "page_content_schema_invalid")
			}
		}
		for fieldID, field := range fieldByID {
			if required, _ := field["required"].(bool); required && field["type"] != "formula" && field["type"] != "lookup" && field["type"] != "created_time" && field["type"] != "updated_time" && field["type"] != "auto_number" {
				value, exists := values[fieldID]
				if !exists || value == nil || value == "" {
					return conversationError("bad_request", "page_content_schema_invalid")
				}
			}
		}
	}
	viewIDs := make(map[string]bool, len(views))
	allowedViews := map[string]bool{"grid": true, "kanban": true, "gantt": true, "calendar": true, "gallery": true, "form": true}
	allowedOperators := map[string]bool{"eq": true, "neq": true, "contains": true, "empty": true, "not_empty": true, "gt": true, "gte": true, "lt": true, "lte": true}
	for _, view := range views {
		id, idOK := multidimensionalStableID(view["id"])
		_, nameOK := multidimensionalText(view["name"], 256)
		viewType, typeOK := view["type"].(string)
		if !idOK || !nameOK || !typeOK || !allowedViews[viewType] || viewIDs[id] {
			return conversationError("bad_request", "page_content_schema_invalid")
		}
		viewIDs[id] = true
		for _, key := range []string{"hidden_field_ids", "frozen_field_ids"} {
			if raw, exists := view[key]; exists {
				fieldIDs, valid := multidimensionalStringList(raw, 256)
				if !valid {
					return conversationError("bad_request", "page_content_schema_invalid")
				}
				for _, fieldID := range fieldIDs {
					if fieldByID[fieldID] == nil {
						return conversationError("bad_request", "page_content_schema_invalid")
					}
				}
			}
		}
		if groupID, exists := view["group_by"].(string); exists {
			if fieldByID[groupID] == nil || viewType == "kanban" && fieldByID[groupID]["type"] != "single_select" {
				return conversationError("bad_request", "page_content_schema_invalid")
			}
		}
		if rowHeight, exists := view["row_height"].(string); exists && rowHeight != "compact" && rowHeight != "normal" && rowHeight != "tall" {
			return conversationError("bad_request", "page_content_schema_invalid")
		}
		if shared, exists := view["shared"]; exists {
			if _, valid := shared.(bool); !valid {
				return conversationError("bad_request", "page_content_schema_invalid")
			}
		}
		if rawFilters, exists := view["filters"]; exists {
			filters, valid := multidimensionalObjectList(rawFilters, 64)
			if !valid {
				return conversationError("bad_request", "page_content_schema_invalid")
			}
			seen := make(map[string]bool, len(filters))
			for _, filter := range filters {
				filterID, filterIDOK := multidimensionalStableID(filter["id"])
				fieldID, fieldIDOK := multidimensionalStableID(filter["field_id"])
				operator, operatorOK := filter["operator"].(string)
				if !filterIDOK || seen[filterID] || !fieldIDOK || fieldByID[fieldID] == nil || !operatorOK || !allowedOperators[operator] {
					return conversationError("bad_request", "page_content_schema_invalid")
				}
				seen[filterID] = true
			}
		}
		if rawSorts, exists := view["sorts"]; exists {
			sorts, valid := multidimensionalObjectList(rawSorts, 32)
			if !valid {
				return conversationError("bad_request", "page_content_schema_invalid")
			}
			seen := make(map[string]bool, len(sorts))
			for _, sortRule := range sorts {
				fieldID, fieldIDOK := multidimensionalStableID(sortRule["field_id"])
				direction, directionOK := sortRule["direction"].(string)
				if !fieldIDOK || fieldByID[fieldID] == nil || seen[fieldID] || !directionOK || direction != "asc" && direction != "desc" {
					return conversationError("bad_request", "page_content_schema_invalid")
				}
				seen[fieldID] = true
			}
		}
		if rawRules, exists := view["color_rules"]; exists {
			rules, valid := multidimensionalObjectList(rawRules, 64)
			if !valid {
				return conversationError("bad_request", "page_content_schema_invalid")
			}
			seen := make(map[string]bool, len(rules))
			for _, rule := range rules {
				ruleID, ruleIDOK := multidimensionalStableID(rule["id"])
				fieldID, fieldIDOK := multidimensionalStableID(rule["field_id"])
				operator, operatorOK := rule["operator"].(string)
				color, colorOK := rule["color"].(string)
				if !ruleIDOK || seen[ruleID] || !fieldIDOK || fieldByID[fieldID] == nil || !operatorOK || !allowedOperators[operator] || !colorOK || !multidimensionalColorPattern.MatchString(color) {
					return conversationError("bad_request", "page_content_schema_invalid")
				}
				seen[ruleID] = true
			}
		}
		if rawConfig, exists := view["config"]; exists {
			config, valid := rawConfig.(map[string]any)
			if !valid {
				return conversationError("bad_request", "page_content_schema_invalid")
			}
			for key, rawFieldID := range config {
				fieldID, valid := rawFieldID.(string)
				field := fieldByID[fieldID]
				if !valid || field == nil {
					return conversationError("bad_request", "page_content_schema_invalid")
				}
				fieldType, _ := field["type"].(string)
				if (key == "start_field_id" || key == "end_field_id" || key == "date_field_id") && fieldType != "date" || key == "cover_field_id" && fieldType != "attachment" || key != "start_field_id" && key != "end_field_id" && key != "date_field_id" && key != "cover_field_id" && key != "title_field_id" {
					return conversationError("bad_request", "page_content_schema_invalid")
				}
			}
		}
	}
	permissionFieldIDs := make(map[string]bool, len(fieldByID))
	for id := range fieldByID {
		permissionFieldIDs[id] = true
	}
	if !validateGridPermissions(root, permissionFieldIDs, recordIDs, viewIDs) {
		return conversationError("bad_request", "page_content_schema_invalid")
	}
	if rawAutomations, exists := root["automations"]; exists {
		automations, valid := multidimensionalObjectList(rawAutomations, 128)
		if !valid {
			return conversationError("bad_request", "page_content_schema_invalid")
		}
		seen := make(map[string]bool, len(automations))
		for _, automation := range automations {
			id, idOK := multidimensionalStableID(automation["id"])
			_, enabledOK := automation["enabled"].(bool)
			trigger, triggerOK := automation["trigger"].(string)
			action, actionOK := automation["action"].(string)
			fieldID, fieldIDOK := multidimensionalStableID(automation["field_id"])
			idempotencyKey, idempotencyOK := multidimensionalStableID(automation["idempotency_key"])
			field := fieldByID[fieldID]
			if !idOK || seen[id] || !enabledOK || !triggerOK || trigger != knowledgesdk.KnowledgeGridAutomationTriggerRecordCreated && trigger != knowledgesdk.KnowledgeGridAutomationTriggerRecordUpdated || !actionOK || action != knowledgesdk.KnowledgeGridAutomationActionSetField || !fieldIDOK || field == nil || field["type"] == "formula" || field["type"] == "lookup" || field["type"] == "created_time" || field["type"] == "updated_time" || field["type"] == "auto_number" || !idempotencyOK || idempotencyKey == "" || !validateMultidimensionalValue(field, automation["value"], recordIDs) {
				return conversationError("bad_request", "page_content_schema_invalid")
			}
			seen[id] = true
		}
	}
	return nil
}

type knowledgeFilePageContent struct {
	DocumentID  string `json:"document_id"`
	DisplayMode string `json:"display_mode"`
	Title       string `json:"title"`
}

func validKnowledgePageType(value string) bool {
	_, ok := knowledgePageTypeRegistry[value]
	return ok
}

func emptyTypedPageContent(contentType string) string {
	definition, ok := knowledgePageTypeRegistry[contentType]
	if !ok {
		return ""
	}
	return definition.EmptyContent()
}

func normalizedTypedPageContent(contentType string, schema int, content, suppliedHash string) (knowledgesdk.PageContent, error) {
	return normalizedTypedPageContentWithEmbeds(contentType, schema, content, suppliedHash, defaultKnowledgeEmbedProviders())
}

func (s *Store) normalizedTypedPageContent(contentType string, schema int, content, suppliedHash string) (knowledgesdk.PageContent, error) {
	return normalizedTypedPageContentWithEmbeds(contentType, schema, content, suppliedHash, s.embedProviders)
}

func normalizedTypedPageContentWithEmbeds(contentType string, schema int, content, suppliedHash string, embeds *knowledgesdk.EmbedProviderRegistry) (knowledgesdk.PageContent, error) {
	definition, ok := knowledgePageTypeRegistry[contentType]
	if !ok {
		return knowledgesdk.PageContent{}, conversationError("bad_request", "page_content_type_invalid")
	}
	normalized, err := definition.Normalize(schema, content, suppliedHash)
	if err != nil {
		return knowledgesdk.PageContent{}, err
	}
	if contentType == knowledgesdk.KnowledgePageTypeDocument {
		if err = validateKnowledgeExternalEmbeds(normalized.Content, embeds); err != nil {
			return knowledgesdk.PageContent{}, err
		}
	}
	references, err := definition.ScanReferences(normalized.Content)
	if err != nil {
		return knowledgesdk.PageContent{}, conversationError("bad_request", "page_content_schema_invalid")
	}
	for _, reference := range references {
		if reference.Kind == "page" && !validKnowledgePageID(reference.TargetID) || reference.Kind == "document" && !validKnowledgeDocumentID(reference.TargetID) {
			return knowledgesdk.PageContent{}, conversationError("bad_request", "page_content_reference_invalid")
		}
	}
	plain, err := definition.ExtractPlainText(normalized)
	if err != nil {
		return knowledgesdk.PageContent{}, conversationError("bad_request", "page_content_schema_invalid")
	}
	normalized.PlainText = plain
	normalized.Summary = definition.ExtractSummary(plain)
	return normalized, nil
}

func defaultKnowledgeEmbedProviders() *knowledgesdk.EmbedProviderRegistry {
	registry, err := knowledgesdk.NewEmbedProviderRegistry(embedprovider.Defaults()...)
	if err != nil {
		panic(err)
	}
	return registry
}

func normalizedStructuredPageContent(root, rootKind string, schema int, content, suppliedHash string) (knowledgesdk.PageContent, error) {
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
	rootValue, ok := value[root]
	if !ok {
		return knowledgesdk.PageContent{}, conversationError("bad_request", "page_content_schema_invalid")
	}
	if rootKind == "object" {
		if _, valid := rootValue.(map[string]any); !valid {
			return knowledgesdk.PageContent{}, conversationError("bad_request", "page_content_schema_invalid")
		}
	} else if rootKind == "array" {
		if _, valid := rootValue.([]any); !valid {
			return knowledgesdk.PageContent{}, conversationError("bad_request", "page_content_schema_invalid")
		}
	} else {
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
	return knowledgesdk.PageContent{ContentSchemaVersion: schema, Content: content, ContentSHA256: hash, PlainText: plain, Summary: pageContentSummary(plain)}, nil
}

func normalizedPagePlainText(content knowledgesdk.PageContent) (string, error) {
	if strings.ContainsRune(content.PlainText, '\x00') {
		return "", fmt.Errorf("plain text contains a null byte")
	}
	return strings.TrimSpace(strings.Join(strings.Fields(content.PlainText), " ")), nil
}

func pageContentSummary(plain string) string {
	summary := strings.TrimSpace(plain)
	if runes := []rune(summary); len(runes) > 280 {
		summary = string(runes[:280])
	}
	return summary
}

func scanJSONPageReferences(content string) ([]knowledgePageContentReference, error) {
	var value any
	decoder := json.NewDecoder(strings.NewReader(content))
	decoder.UseNumber()
	if err := decoder.Decode(&value); err != nil {
		return nil, err
	}
	if err := decoder.Decode(&struct{}{}); err != io.EOF {
		return nil, fmt.Errorf("page content has trailing data")
	}
	references := make([]knowledgePageContentReference, 0)
	var scan func(any)
	scan = func(current any) {
		switch item := current.(type) {
		case map[string]any:
			if itemType, _ := item["type"].(string); itemType == "knowledgeReference" || itemType == "syncedBlock" || itemType == "pageMention" || itemType == "blockMention" {
				if props, ok := item["props"].(map[string]any); ok {
					key := "targetPageId"
					if itemType == "pageMention" || itemType == "blockMention" {
						key = "pageId"
					}
					if target, ok := props[key].(string); ok {
						target = strings.TrimSpace(target)
						if target != "" {
							references = append(references, knowledgePageContentReference{Kind: "page", TargetID: target})
						}
					}
				}
			}
			for _, child := range item {
				scan(child)
			}
		case []any:
			for _, child := range item {
				scan(child)
			}
		case string:
			for _, prefix := range []struct{ value, kind string }{{"knowledge-page:", "page"}, {"knowledge-document:", "document"}} {
				if strings.HasPrefix(item, prefix.value) {
					references = append(references, knowledgePageContentReference{Kind: prefix.kind, TargetID: strings.TrimSpace(strings.TrimPrefix(item, prefix.value))})
				}
			}
		}
	}
	scan(value)
	return references, nil
}

func scanFilePageReferences(content string) ([]knowledgePageContentReference, error) {
	value, err := decodeFilePageContent(content)
	if err != nil {
		return nil, err
	}
	return []knowledgePageContentReference{{Kind: "document", TargetID: value.DocumentID}}, nil
}

func validateTrustedPageContent(content string) error {
	var value any
	decoder := json.NewDecoder(strings.NewReader(content))
	decoder.UseNumber()
	if err := decoder.Decode(&value); err != nil {
		return conversationError("bad_request", "page_content_schema_invalid")
	}
	var validate func(any, string) error
	validate = func(current any, key string) error {
		switch item := current.(type) {
		case map[string]any:
			for childKey, child := range item {
				lower := strings.ToLower(strings.TrimSpace(childKey))
				if lower == "script" || lower == "srcdoc" || lower == "iframe" {
					return conversationError("bad_request", "page_content_executable_forbidden")
				}
				if err := validate(child, childKey); err != nil {
					return err
				}
			}
		case []any:
			for _, child := range item {
				if err := validate(child, key); err != nil {
					return err
				}
			}
		case string:
			lower := strings.ToLower(strings.TrimSpace(item))
			if strings.HasPrefix(lower, "javascript:") || strings.Contains(lower, "<script") || strings.EqualFold(key, "type") && (lower == "script" || lower == "iframe") {
				return conversationError("bad_request", "page_content_executable_forbidden")
			}
		}
		return nil
	}
	return validate(value, "")
}

func validatePageTypeBeforePublish(contentType, content string) error {
	definition, ok := knowledgePageTypeRegistry[contentType]
	if !ok {
		return conversationError("bad_request", "page_content_type_invalid")
	}
	return definition.ValidateBeforePublish(content)
}

func decodeFilePageContent(content string) (knowledgeFilePageContent, error) {
	var value knowledgeFilePageContent
	decoder := json.NewDecoder(strings.NewReader(content))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&value); err != nil {
		return value, conversationError("bad_request", "page_content_schema_invalid")
	}
	if err := decoder.Decode(&struct{}{}); err != io.EOF {
		return value, conversationError("bad_request", "page_content_schema_invalid")
	}
	value.DocumentID, value.DisplayMode, value.Title = strings.TrimSpace(value.DocumentID), strings.TrimSpace(value.DisplayMode), strings.TrimSpace(value.Title)
	if !validKnowledgeDocumentID(value.DocumentID) || value.DisplayMode != "preview" && value.DisplayMode != "card" || !executionText(value.Title, 256, true) {
		return value, conversationError("bad_request", "page_content_schema_invalid")
	}
	return value, nil
}

func normalizedFilePageContent(schema int, content, suppliedHash string) (knowledgesdk.PageContent, error) {
	if schema != knowledgesdk.PageContentSchemaVersion || !executionText(content, knowledgePageMaximumBytes, true) {
		return knowledgesdk.PageContent{}, conversationError("bad_request", "page_content_invalid")
	}
	value, err := decodeFilePageContent(content)
	if err != nil {
		return knowledgesdk.PageContent{}, err
	}
	digest := sha256.Sum256([]byte(content))
	hash := hex.EncodeToString(digest[:])
	if suppliedHash != "" && suppliedHash != hash {
		return knowledgesdk.PageContent{}, conversationError("bad_request", "page_content_hash_mismatch")
	}
	return knowledgesdk.PageContent{ContentSchemaVersion: schema, Content: content, ContentSHA256: hash, PlainText: value.Title, Summary: value.Title}, nil
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
	if contentType == knowledgePageTypeFile {
		content := emptyTypedPageContent(contentType)
		digest := sha256.Sum256([]byte(content))
		return knowledgesdk.PageContent{ContentSchemaVersion: knowledgesdk.PageContentSchemaVersion, Content: content, ContentSHA256: hex.EncodeToString(digest[:])}
	}
	value, _ := normalizedTypedPageContent(contentType, knowledgesdk.PageContentSchemaVersion, emptyTypedPageContent(contentType), "")
	return value
}
