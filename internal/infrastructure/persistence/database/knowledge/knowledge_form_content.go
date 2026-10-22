package store

import (
	"encoding/json"
	"io"
	"math"
	"strconv"
	"strings"
	"time"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

const emptyKnowledgeFormContent = `{"schema_version":1,"display":"form","components":[{"type":"textfield","key":"question1","label":"未命名问题","input":true,"validate":{"required":false}}],"settings":{"submission_role":"reader","allow_multiple_submissions":false,"opens_at":"","closes_at":"","confirmation_message":"提交成功，感谢你的参与。"}}`

var formRootKeys = map[string]bool{"schema_version": true, "display": true, "components": true, "settings": true}
var formComponentKeys = map[string]bool{"type": true, "key": true, "label": true, "description": true, "placeholder": true, "input": true, "validate": true, "values": true, "data": true, "multiple": true, "currency": true, "inputMask": true, "maxFiles": true, "conditional": true}
var formValidationKeys = map[string]bool{"required": true, "minLength": true, "maxLength": true, "min": true, "max": true}
var formSettingsKeys = map[string]bool{"submission_role": true, "allow_multiple_submissions": true, "opens_at": true, "closes_at": true, "confirmation_message": true}
var formSupportedTypes = map[string]bool{"textfield": true, "textarea": true, "number": true, "currency": true, "email": true, "url": true, "phoneNumber": true, "radio": true, "select": true, "selectboxes": true, "checkbox": true, "datetime": true, "rating": true, "scale": true, "file": true}
var formCurrencyCodes = map[string]bool{"CNY": true, "USD": true, "EUR": true, "JPY": true}

func formExactKeys(value map[string]any, allowed map[string]bool) bool {
	for key := range value {
		if !allowed[key] {
			return false
		}
	}
	return true
}

func formInteger(value any, minimum, maximum int) (int, bool) {
	number, ok := value.(json.Number)
	if !ok {
		return 0, false
	}
	parsed, err := strconv.Atoi(string(number))
	return parsed, err == nil && parsed >= minimum && parsed <= maximum
}

func formFiniteNumber(value any) (float64, bool) {
	number, ok := value.(json.Number)
	if !ok {
		return 0, false
	}
	parsed, err := number.Float64()
	return parsed, err == nil && !math.IsNaN(parsed) && !math.IsInf(parsed, 0)
}

func formOptionalText(value any, maximum int) (string, bool) {
	if value == nil {
		return "", true
	}
	text, ok := value.(string)
	return text, ok && executionText(text, maximum, false)
}

func validateFormOptions(value any) (map[string]string, bool) {
	raw, ok := value.([]any)
	if !ok || len(raw) < 1 || len(raw) > 100 {
		return nil, false
	}
	result := make(map[string]string, len(raw))
	for _, child := range raw {
		option, valid := child.(map[string]any)
		if !valid || len(option) != 2 || !formExactKeys(option, map[string]bool{"label": true, "value": true}) {
			return nil, false
		}
		label, labelOK := option["label"].(string)
		stored, valueOK := option["value"].(string)
		if !labelOK || !valueOK || !executionText(label, 512, true) || !personalMemoryKey(stored) || result[stored] != "" {
			return nil, false
		}
		result[stored] = label
	}
	return result, true
}

func validateFormComponent(component map[string]any) (string, map[string]string, error) {
	if !formExactKeys(component, formComponentKeys) || len(component) < 5 {
		return "", nil, conversationError("bad_request", "page_content_schema_invalid")
	}
	componentType, typeOK := component["type"].(string)
	key, keyOK := component["key"].(string)
	label, labelOK := component["label"].(string)
	input, inputOK := component["input"].(bool)
	if !typeOK || !formSupportedTypes[componentType] || !keyOK || !personalMemoryKey(key) || !labelOK || !executionText(label, 512, true) || !inputOK || !input {
		return "", nil, conversationError("bad_request", "page_content_schema_invalid")
	}
	if _, ok := formOptionalText(component["description"], 4096); !ok {
		return "", nil, conversationError("bad_request", "page_content_schema_invalid")
	}
	if _, ok := formOptionalText(component["placeholder"], 1024); !ok {
		return "", nil, conversationError("bad_request", "page_content_schema_invalid")
	}
	validation, ok := component["validate"].(map[string]any)
	if !ok || !formExactKeys(validation, formValidationKeys) {
		return "", nil, conversationError("bad_request", "page_content_schema_invalid")
	}
	if required, found := validation["required"]; !found {
		return "", nil, conversationError("bad_request", "page_content_schema_invalid")
	} else if _, valid := required.(bool); !valid {
		return "", nil, conversationError("bad_request", "page_content_schema_invalid")
	}
	if componentType == "textfield" || componentType == "textarea" || componentType == "email" || componentType == "url" || componentType == "phoneNumber" {
		minimum, minOK := 0, true
		maximum, maxOK := 32768, true
		if value, found := validation["minLength"]; found {
			minimum, minOK = formInteger(value, 0, 32768)
		}
		if value, found := validation["maxLength"]; found {
			maximum, maxOK = formInteger(value, 1, 32768)
		}
		if !minOK || !maxOK || minimum > maximum || validation["min"] != nil || validation["max"] != nil {
			return "", nil, conversationError("bad_request", "page_content_schema_invalid")
		}
	} else if componentType == "number" || componentType == "currency" || componentType == "rating" || componentType == "scale" {
		minimum, hasMinimum := 0.0, false
		maximum, hasMaximum := 0.0, false
		if value, found := validation["min"]; found {
			minimum, hasMinimum = formFiniteNumber(value)
			if !hasMinimum {
				return "", nil, conversationError("bad_request", "page_content_schema_invalid")
			}
		}
		if value, found := validation["max"]; found {
			maximum, hasMaximum = formFiniteNumber(value)
			if !hasMaximum {
				return "", nil, conversationError("bad_request", "page_content_schema_invalid")
			}
		}
		if hasMinimum && hasMaximum && minimum > maximum || validation["minLength"] != nil || validation["maxLength"] != nil {
			return "", nil, conversationError("bad_request", "page_content_schema_invalid")
		}
		if componentType == "rating" || componentType == "scale" {
			if !hasMinimum || !hasMaximum || minimum < 0 || maximum > 20 || maximum <= minimum || maximum-minimum > 20 || minimum != math.Trunc(minimum) || maximum != math.Trunc(maximum) {
				return "", nil, conversationError("bad_request", "page_content_schema_invalid")
			}
		}
	} else if len(validation) != 1 {
		return "", nil, conversationError("bad_request", "page_content_schema_invalid")
	}
	if componentType == "currency" {
		currency, valid := component["currency"].(string)
		if !valid || !formCurrencyCodes[currency] || component["inputMask"] != nil {
			return "", nil, conversationError("bad_request", "page_content_schema_invalid")
		}
	} else if component["currency"] != nil {
		return "", nil, conversationError("bad_request", "page_content_schema_invalid")
	}
	if componentType == "phoneNumber" {
		mask, valid := component["inputMask"].(string)
		if !valid || mask != "" {
			return "", nil, conversationError("bad_request", "page_content_schema_invalid")
		}
	} else if component["inputMask"] != nil {
		return "", nil, conversationError("bad_request", "page_content_schema_invalid")
	}
	if componentType == "file" {
		if _, valid := formInteger(component["maxFiles"], 1, 20); !valid {
			return "", nil, conversationError("bad_request", "page_content_schema_invalid")
		}
	} else if component["maxFiles"] != nil {
		return "", nil, conversationError("bad_request", "page_content_schema_invalid")
	}
	options := map[string]string{}
	switch componentType {
	case "radio", "selectboxes":
		var valid bool
		options, valid = validateFormOptions(component["values"])
		if !valid || component["data"] != nil {
			return "", nil, conversationError("bad_request", "page_content_schema_invalid")
		}
	case "select":
		data, dataOK := component["data"].(map[string]any)
		if !dataOK || len(data) != 1 {
			return "", nil, conversationError("bad_request", "page_content_schema_invalid")
		}
		var valid bool
		options, valid = validateFormOptions(data["values"])
		if !valid || component["values"] != nil {
			return "", nil, conversationError("bad_request", "page_content_schema_invalid")
		}
	default:
		if component["values"] != nil || component["data"] != nil {
			return "", nil, conversationError("bad_request", "page_content_schema_invalid")
		}
	}
	if multiple, found := component["multiple"]; found {
		flag, valid := multiple.(bool)
		if !valid || !flag || componentType != "select" {
			return "", nil, conversationError("bad_request", "page_content_schema_invalid")
		}
	}
	if rawCondition, found := component["conditional"]; found {
		condition, valid := rawCondition.(map[string]any)
		if !valid || len(condition) != 3 || !formExactKeys(condition, map[string]bool{"show": true, "when": true, "eq": true}) {
			return "", nil, conversationError("bad_request", "page_content_schema_invalid")
		}
		if _, valid = condition["show"].(bool); !valid {
			return "", nil, conversationError("bad_request", "page_content_schema_invalid")
		}
		when, whenOK := condition["when"].(string)
		if !whenOK || !personalMemoryKey(when) || when == key {
			return "", nil, conversationError("bad_request", "page_content_schema_invalid")
		}
		switch condition["eq"].(type) {
		case string, bool, json.Number:
		default:
			return "", nil, conversationError("bad_request", "page_content_schema_invalid")
		}
	}
	return key, options, nil
}

func decodeKnowledgeFormContent(content string) (map[string]any, error) {
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

func validateKnowledgeFormContent(content string) error {
	root, err := decodeKnowledgeFormContent(content)
	if err != nil || len(root) != 4 || !formExactKeys(root, formRootKeys) {
		return conversationError("bad_request", "page_content_schema_invalid")
	}
	version, versionOK := formInteger(root["schema_version"], 1, 1)
	display, displayOK := root["display"].(string)
	components, componentsOK := root["components"].([]any)
	settings, settingsOK := root["settings"].(map[string]any)
	if !versionOK || version != 1 || !displayOK || display != "form" || !componentsOK || len(components) < 1 || len(components) > 200 || !settingsOK || len(settings) != 5 || !formExactKeys(settings, formSettingsKeys) {
		return conversationError("bad_request", "page_content_schema_invalid")
	}
	role, roleOK := settings["submission_role"].(string)
	multiple, multipleOK := settings["allow_multiple_submissions"].(bool)
	opensAt, opensOK := settings["opens_at"].(string)
	closesAt, closesOK := settings["closes_at"].(string)
	confirmation, confirmationOK := settings["confirmation_message"].(string)
	_ = multiple
	if !roleOK || !validLibraryRole(role) || !multipleOK || !opensOK || !closesOK || !confirmationOK || !executionText(confirmation, 2048, true) {
		return conversationError("bad_request", "page_content_schema_invalid")
	}
	var openTime, closeTime time.Time
	if opensAt != "" {
		openTime, err = time.Parse(time.RFC3339, opensAt)
		if err != nil {
			return conversationError("bad_request", "page_content_schema_invalid")
		}
	}
	if closesAt != "" {
		closeTime, err = time.Parse(time.RFC3339, closesAt)
		if err != nil || !openTime.IsZero() && !closeTime.After(openTime) {
			return conversationError("bad_request", "page_content_schema_invalid")
		}
	}
	keys := make(map[string]bool, len(components))
	conditions := make(map[string]string, len(components))
	for _, raw := range components {
		component, ok := raw.(map[string]any)
		if !ok {
			return conversationError("bad_request", "page_content_schema_invalid")
		}
		key, _, componentErr := validateFormComponent(component)
		if componentErr != nil || keys[key] {
			return conversationError("bad_request", "page_content_schema_invalid")
		}
		keys[key] = true
		if condition, ok := component["conditional"].(map[string]any); ok {
			conditions[key], _ = condition["when"].(string)
		}
	}
	for _, source := range conditions {
		if !keys[source] {
			return conversationError("bad_request", "page_content_schema_invalid")
		}
	}
	for key := range conditions {
		seen := map[string]bool{}
		current := key
		for current != "" {
			if seen[current] {
				return conversationError("bad_request", "page_content_schema_invalid")
			}
			seen[current] = true
			current = conditions[current]
		}
	}
	return nil
}

func knowledgeFormPlainText(content string) string {
	root, err := decodeKnowledgeFormContent(content)
	if err != nil {
		return ""
	}
	words := make([]string, 0, 64)
	components, _ := root["components"].([]any)
	for _, raw := range components {
		component, _ := raw.(map[string]any)
		for _, key := range []string{"label", "description", "placeholder"} {
			if text, ok := component[key].(string); ok && strings.TrimSpace(text) != "" {
				words = append(words, text)
			}
		}
		if values, ok := component["values"].([]any); ok {
			for _, rawOption := range values {
				if option, valid := rawOption.(map[string]any); valid {
					if label, labelOK := option["label"].(string); labelOK {
						words = append(words, label)
					}
				}
			}
		}
		if data, ok := component["data"].(map[string]any); ok {
			if values, valid := data["values"].([]any); valid {
				for _, rawOption := range values {
					if option, optionOK := rawOption.(map[string]any); optionOK {
						if label, labelOK := option["label"].(string); labelOK {
							words = append(words, label)
						}
					}
				}
			}
		}
	}
	return strings.TrimSpace(strings.Join(strings.Fields(strings.Join(words, " ")), " "))
}

func formPageTypeDefinition() knowledgePageTypeDefinition {
	return knowledgePageTypeDefinition{
		ID:           knowledgesdk.KnowledgePageTypeForm,
		EmptyContent: func() string { return emptyKnowledgeFormContent },
		Normalize: func(schema int, content, suppliedHash string) (knowledgesdk.PageContent, error) {
			if err := validateKnowledgeFormContent(content); err != nil {
				return knowledgesdk.PageContent{}, err
			}
			normalized, err := normalizedStructuredPageContent("components", "array", schema, content, suppliedHash)
			if err != nil {
				return knowledgesdk.PageContent{}, err
			}
			normalized.PlainText = knowledgeFormPlainText(content)
			normalized.Summary = pageContentSummary(normalized.PlainText)
			return normalized, nil
		},
		ExtractPlainText: normalizedPagePlainText,
		ExtractSummary:   pageContentSummary,
		ScanReferences:   scanJSONPageReferences,
		ValidateBeforePublish: func(content string) error {
			if err := validateKnowledgeFormContent(content); err != nil {
				return err
			}
			return validateTrustedPageContent(content)
		},
	}
}
