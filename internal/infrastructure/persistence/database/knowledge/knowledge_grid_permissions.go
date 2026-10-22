package store

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"strings"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

type gridPermissionPolicy struct {
	Read, Write []string
	ReadSet     bool
	WriteSet    bool
}

func decodeGridRoot(content string) (map[string]any, error) {
	var root map[string]any
	decoder := json.NewDecoder(strings.NewReader(content))
	decoder.UseNumber()
	if err := decoder.Decode(&root); err != nil || root == nil {
		return nil, conversationError("bad_request", "page_content_schema_invalid")
	}
	return root, nil
}

func gridPermission(root map[string]any, scope, id string) gridPermissionPolicy {
	permissions, _ := root["permissions"].(map[string]any)
	var raw any
	if scope == "table" {
		raw = permissions["table"]
	} else if scoped, ok := permissions[scope].(map[string]any); ok {
		raw = scoped[id]
	}
	policy, _ := raw.(map[string]any)
	result := gridPermissionPolicy{}
	if value, exists := policy["read"]; exists {
		result.ReadSet = true
		result.Read, _ = multidimensionalStringList(value, 256)
	}
	if value, exists := policy["write"]; exists {
		result.WriteSet = true
		result.Write, _ = multidimensionalStringList(value, 256)
	}
	return result
}

func validGridPermissionSelector(value string) bool {
	if value == "*" || value == "role:reader" || value == "role:editor" || value == "role:manager" {
		return true
	}
	return strings.HasPrefix(value, "user:") && executionText(strings.TrimPrefix(value, "user:"), 255, true)
}

func validateGridPermissionPolicy(raw any) bool {
	policy, ok := raw.(map[string]any)
	if !ok || len(policy) == 0 {
		return false
	}
	for key, value := range policy {
		if key != "read" && key != "write" {
			return false
		}
		selectors, valid := multidimensionalStringList(value, 256)
		if !valid {
			return false
		}
		seen := make(map[string]bool, len(selectors))
		for _, selector := range selectors {
			if !validGridPermissionSelector(selector) || seen[selector] {
				return false
			}
			seen[selector] = true
		}
	}
	return true
}

func validateGridPermissions(root map[string]any, fieldIDs, recordIDs, viewIDs map[string]bool) bool {
	raw, exists := root["permissions"]
	if !exists {
		return true
	}
	permissions, ok := raw.(map[string]any)
	if !ok || len(permissions) == 0 {
		return false
	}
	for scope, rawScope := range permissions {
		if scope == "table" {
			if !validateGridPermissionPolicy(rawScope) {
				return false
			}
			continue
		}
		var known map[string]bool
		switch scope {
		case "fields":
			known = fieldIDs
		case "records":
			known = recordIDs
		case "views":
			known = viewIDs
		default:
			return false
		}
		items, valid := rawScope.(map[string]any)
		if !valid || len(items) == 0 {
			return false
		}
		for id, policy := range items {
			if !known[id] || !validateGridPermissionPolicy(policy) {
				return false
			}
		}
	}
	return true
}

func gridSelectorsAllow(selectors []string, role, userID string) bool {
	for _, selector := range selectors {
		switch selector {
		case "*", "role:reader":
			return true
		case "role:editor":
			if roleLevel(role) >= roleLevel("editor") {
				return true
			}
		case "role:manager":
			if role == "manager" {
				return true
			}
		default:
			if strings.HasPrefix(selector, "user:") && strings.TrimPrefix(selector, "user:") == userID {
				return true
			}
		}
	}
	return false
}

func gridPolicyAllows(policy gridPermissionPolicy, write bool, library agentsdk.KnowledgeLibrary, a agentsdk.Authority) bool {
	if library.Role == "manager" {
		return true
	}
	if policy.ReadSet && !gridSelectorsAllow(policy.Read, library.Role, a.UserID) {
		return false
	}
	if write && policy.WriteSet && !gridSelectorsAllow(policy.Write, library.Role, a.UserID) {
		return false
	}
	return true
}

func gridAllows(root map[string]any, scope, id string, write bool, library agentsdk.KnowledgeLibrary, a agentsdk.Authority) bool {
	if !gridPolicyAllows(gridPermission(root, "table", ""), write, library, a) {
		return false
	}
	return scope == "table" || gridPolicyAllows(gridPermission(root, scope, id), write, library, a)
}

func gridPolicyPublic(policy gridPermissionPolicy) bool {
	if !policy.ReadSet {
		return true
	}
	return gridSelectorsAllow(policy.Read, "reader", "")
}

func gridEntityIDs(items []any) []string {
	result := make([]string, 0, len(items))
	for _, item := range items {
		if id := nativeEntityID(item); id != "" {
			result = append(result, id)
		}
	}
	return result
}

func filterGridRoot(root map[string]any, readable func(string, string) bool, includeAutomations bool) map[string]any {
	result := map[string]any{"schema_version": root["schema_version"]}
	fields, _ := root["fields"].([]any)
	records, _ := root["records"].([]any)
	views, _ := root["views"].([]any)
	visibleFields, visibleRecords := make(map[string]bool), make(map[string]bool)
	filteredFields := make([]any, 0, len(fields))
	for _, raw := range fields {
		id := nativeEntityID(raw)
		if readable("fields", id) {
			visibleFields[id] = true
			filteredFields = append(filteredFields, raw)
		}
	}
	// A derived field is hidden when its source field is hidden; otherwise its
	// computed output could disclose a protected value.
	for changed := true; changed; {
		changed = false
		kept := filteredFields[:0]
		for _, raw := range filteredFields {
			field, _ := raw.(map[string]any)
			id, _ := field["id"].(string)
			allowed := true
			if field["type"] == "formula" {
				formula, _ := field["formula"].(string)
				for _, match := range multidimensionalFormulaToken.FindAllStringSubmatch(formula, -1) {
					if len(match) > 1 && match[1] != "" && !visibleFields[match[1]] {
						allowed = false
					}
				}
			} else if field["type"] == "lookup" {
				lookup, _ := field["lookup"].(map[string]any)
				relationID, _ := lookup["relation_field_id"].(string)
				targetID, _ := lookup["target_field_id"].(string)
				allowed = visibleFields[relationID] && visibleFields[targetID]
			}
			if allowed {
				kept = append(kept, raw)
			} else {
				delete(visibleFields, id)
				changed = true
			}
		}
		filteredFields = kept
	}
	for _, raw := range records {
		id := nativeEntityID(raw)
		if readable("records", id) {
			visibleRecords[id] = true
		}
	}
	filteredRecords := make([]any, 0, len(records))
	for _, raw := range records {
		record, _ := raw.(map[string]any)
		id := nativeEntityID(raw)
		if !visibleRecords[id] {
			continue
		}
		copyRecord := make(map[string]any, len(record))
		for key, value := range record {
			copyRecord[key] = value
		}
		values, _ := record["values"].(map[string]any)
		copyValues := make(map[string]any, len(values))
		for fieldID, value := range values {
			if !visibleFields[fieldID] {
				continue
			}
			fieldIndex := nativeEntityIndex(filteredFields, fieldID)
			if fieldIndex >= 0 {
				field, _ := filteredFields[fieldIndex].(map[string]any)
				if field["type"] == "relation" {
					if related, ok := value.([]any); ok {
						visible := make([]any, 0, len(related))
						for _, target := range related {
							if targetID, ok := target.(string); ok && visibleRecords[targetID] {
								visible = append(visible, targetID)
							}
						}
						value = visible
					}
				}
			}
			copyValues[fieldID] = value
		}
		copyRecord["values"] = copyValues
		filteredRecords = append(filteredRecords, copyRecord)
	}
	filteredViews := make([]any, 0, len(views))
	for _, raw := range views {
		view, _ := raw.(map[string]any)
		id := nativeEntityID(raw)
		if !readable("views", id) {
			continue
		}
		copyView := make(map[string]any, len(view))
		for key, value := range view {
			copyView[key] = value
		}
		for _, key := range []string{"hidden_field_ids", "frozen_field_ids"} {
			if values, ok := view[key].([]any); ok {
				kept := make([]any, 0, len(values))
				for _, value := range values {
					if fieldID, ok := value.(string); ok && visibleFields[fieldID] {
						kept = append(kept, fieldID)
					}
				}
				copyView[key] = kept
			}
		}
		if fieldID, ok := view["group_by"].(string); ok && !visibleFields[fieldID] {
			delete(copyView, "group_by")
		}
		for _, key := range []string{"filters", "sorts", "color_rules"} {
			if rules, ok := view[key].([]any); ok {
				kept := make([]any, 0, len(rules))
				for _, rawRule := range rules {
					rule, _ := rawRule.(map[string]any)
					fieldID, _ := rule["field_id"].(string)
					if visibleFields[fieldID] {
						kept = append(kept, rawRule)
					}
				}
				copyView[key] = kept
			}
		}
		if config, ok := view["config"].(map[string]any); ok {
			kept := map[string]any{}
			for key, value := range config {
				if fieldID, ok := value.(string); ok && visibleFields[fieldID] {
					kept[key] = fieldID
				}
			}
			copyView["config"] = kept
		}
		filteredViews = append(filteredViews, copyView)
	}
	result["fields"], result["records"], result["views"] = filteredFields, filteredRecords, filteredViews
	if includeAutomations {
		if automations, exists := root["automations"]; exists {
			result["automations"] = automations
		}
	}
	return result
}

func gridPlainText(root map[string]any) string {
	words, nodes := make([]string, 0, 32), 0
	visible := map[string]any{"fields": root["fields"], "records": root["records"], "views": root["views"]}
	if collectTypedPageText(visible, "", 0, &nodes, &words) != nil {
		return ""
	}
	return strings.TrimSpace(strings.Join(strings.Fields(strings.Join(words, " ")), " "))
}

func gridPageContent(original knowledgesdk.PageContent, root map[string]any) (knowledgesdk.PageContent, error) {
	encoded, err := json.Marshal(root)
	if err != nil {
		return knowledgesdk.PageContent{}, err
	}
	digest := sha256.Sum256(encoded)
	plain := gridPlainText(root)
	return knowledgesdk.PageContent{ContentSchemaVersion: original.ContentSchemaVersion, Content: string(encoded), ContentSHA256: hex.EncodeToString(digest[:]), PlainText: plain, Summary: pageContentSummary(plain)}, nil
}

func redactGridBody(body knowledgesdk.PageContent, library agentsdk.KnowledgeLibrary, a agentsdk.Authority) (knowledgesdk.PageContent, *knowledgesdk.KnowledgeGridAccess, error) {
	root, err := decodeGridRoot(body.Content)
	if err != nil {
		return body, nil, err
	}
	if !gridAllows(root, "table", "", false, library, a) {
		return body, nil, conversationError("not_found", "page_not_found")
	}
	access := &knowledgesdk.KnowledgeGridAccess{Read: true, Write: gridAllows(root, "table", "", true, library, a), Manage: library.Role == "manager", ViewWrite: map[string]bool{}, FieldWrite: map[string]bool{}, RecordWrite: map[string]bool{}}
	fields, _ := root["fields"].([]any)
	records, _ := root["records"].([]any)
	views, _ := root["views"].([]any)
	for _, id := range gridEntityIDs(fields) {
		if gridAllows(root, "fields", id, false, library, a) {
			access.FieldWrite[id] = gridAllows(root, "fields", id, true, library, a)
		}
	}
	for _, id := range gridEntityIDs(records) {
		if gridAllows(root, "records", id, false, library, a) {
			access.RecordWrite[id] = gridAllows(root, "records", id, true, library, a)
		}
	}
	for _, id := range gridEntityIDs(views) {
		if gridAllows(root, "views", id, false, library, a) {
			access.ViewWrite[id] = gridAllows(root, "views", id, true, library, a)
		}
	}
	if library.Role == "manager" {
		return body, access, nil
	}
	// Automation definitions can carry protected field IDs and target values.
	// Managers receive the original body above; all redacted bodies omit them.
	filtered := filterGridRoot(root, func(scope, id string) bool { return gridAllows(root, scope, id, false, library, a) }, false)
	redacted, err := gridPageContent(body, filtered)
	return redacted, access, err
}

func applyGridAccessToView(view *knowledgesdk.KnowledgePageView, library agentsdk.KnowledgeLibrary, a agentsdk.Authority) error {
	if view.Page.ContentType != knowledgesdk.KnowledgePageTypeMultidimensionalTable {
		return nil
	}
	var access *knowledgesdk.KnowledgeGridAccess
	if view.Published != nil {
		body, publishedAccess, err := redactGridBody(view.Published.Body, library, a)
		if err != nil {
			if view.Draft == nil {
				return err
			}
			view.Published = nil
		} else {
			view.Published.Body = body
			access = publishedAccess
		}
	}
	if view.Draft != nil {
		body, draftAccess, err := redactGridBody(view.Draft.Body, library, a)
		if err != nil {
			return err
		}
		view.Draft.Body = body
		access = draftAccess
	}
	view.GridAccess = access
	return nil
}

func redactGridVersion(version *knowledgesdk.KnowledgePageVersion, library agentsdk.KnowledgeLibrary, a agentsdk.Authority) error {
	if version.ContentType != knowledgesdk.KnowledgePageTypeMultidimensionalTable {
		return nil
	}
	body, _, err := redactGridBody(version.Body, library, a)
	if err == nil {
		version.Body = body
	}
	return err
}

func gridUniversalPlainText(content string) string {
	root, err := decodeGridRoot(content)
	if err != nil || !gridPolicyPublic(gridPermission(root, "table", "")) {
		return ""
	}
	filtered := filterGridRoot(root, func(scope, id string) bool { return gridPolicyPublic(gridPermission(root, scope, id)) }, false)
	return gridPlainText(filtered)
}

func gridHasRestrictions(content string) bool {
	root, err := decodeGridRoot(content)
	if err != nil {
		return false
	}
	permissions, ok := root["permissions"].(map[string]any)
	return ok && len(permissions) > 0
}

func requireGridTableWrite(content string, library agentsdk.KnowledgeLibrary, a agentsdk.Authority) error {
	root, err := decodeGridRoot(content)
	if err != nil {
		return err
	}
	if !gridAllows(root, "table", "", true, library, a) {
		return conversationError("forbidden", "page_grid_permission_denied")
	}
	return nil
}

func authorizeGridOperations(root map[string]any, operations []knowledgesdk.KnowledgePageNativeOperation, library agentsdk.KnowledgeLibrary, a agentsdk.Authority) error {
	for _, operation := range operations {
		scope, id := "table", ""
		switch operation.Target {
		case knowledgesdk.KnowledgeNativeTargetField:
			scope, id = "fields", operation.TargetID
		case knowledgesdk.KnowledgeNativeTargetRecord:
			scope, id = "records", operation.TargetID
		case knowledgesdk.KnowledgeNativeTargetView:
			scope, id = "views", operation.TargetID
		case knowledgesdk.KnowledgeNativeTargetCell:
			if !gridAllows(root, "records", operation.TargetID, true, library, a) || !gridAllows(root, "fields", operation.ParentID, true, library, a) {
				return conversationError("forbidden", "page_grid_permission_denied")
			}
			continue
		case knowledgesdk.KnowledgeNativeTargetTableStructure:
			if library.Role != "manager" {
				value, err := nativeOperationObject(operation)
				if err != nil || conversationHash(value["permissions"]) != conversationHash(root["permissions"]) {
					return conversationError("forbidden", "page_grid_permission_denied")
				}
			}
		}
		if !gridAllows(root, scope, id, true, library, a) {
			return conversationError("forbidden", "page_grid_permission_denied")
		}
	}
	return nil
}
