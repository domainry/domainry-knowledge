package store

import (
	"context"
	"database/sql"
	"encoding/json"
	"strconv"
	"strings"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-orm/query"
)

const (
	knowledgeNativeOperationMaximumBatch = 512
	knowledgeNativeOperationMaximumValue = 256 << 10
)

func validNativeOperationTarget(value string) bool {
	switch value {
	case knowledgesdk.KnowledgeNativeTargetField,
		knowledgesdk.KnowledgeNativeTargetRecord,
		knowledgesdk.KnowledgeNativeTargetView,
		knowledgesdk.KnowledgeNativeTargetCell,
		knowledgesdk.KnowledgeNativeTargetTableStructure,
		knowledgesdk.KnowledgeNativeTargetSheet,
		knowledgesdk.KnowledgeNativeTargetWorkbookStructure,
		knowledgesdk.KnowledgeNativeTargetSheetStructure,
		knowledgesdk.KnowledgeNativeTargetFormula,
		knowledgesdk.KnowledgeNativeTargetCellStyle,
		knowledgesdk.KnowledgeNativeTargetStyle,
		knowledgesdk.KnowledgeNativeTargetMerge,
		knowledgesdk.KnowledgeNativeTargetChart,
		knowledgesdk.KnowledgeNativeTargetPivot,
		knowledgesdk.KnowledgeNativeTargetProtectedRange,
		knowledgesdk.KnowledgeNativeTargetNode,
		knowledgesdk.KnowledgeNativeTargetEdge,
		knowledgesdk.KnowledgeNativeTargetGraphStructure,
		knowledgesdk.KnowledgeNativeTargetSlide,
		knowledgesdk.KnowledgeNativeTargetElement,
		knowledgesdk.KnowledgeNativeTargetAsset,
		knowledgesdk.KnowledgeNativeTargetPresentation,
		knowledgesdk.KnowledgeNativeTargetComponent,
		knowledgesdk.KnowledgeNativeTargetFormStructure:
		return true
	default:
		return false
	}
}

func validNativeOperationAction(value string) bool {
	return value == knowledgesdk.KnowledgeNativeOperationUpsert || value == knowledgesdk.KnowledgeNativeOperationDelete
}

func validNativeOperationEntityID(value string) bool {
	return len(value) <= 128 && executionText(value, 128, true)
}

func validateNativeOperation(operation knowledgesdk.KnowledgePageNativeOperation) error {
	if !personalMemoryKey(operation.ID) || !validNativeOperationTarget(operation.Target) || !validNativeOperationAction(operation.Action) || !validNativeOperationEntityID(operation.TargetID) || len(operation.ExpectedHash) != 0 && (len(operation.ExpectedHash) != 64 || !personalMemoryKey(operation.ExpectedHash)) {
		return conversationError("bad_request", "page_native_operation_invalid")
	}
	switch operation.Target {
	case knowledgesdk.KnowledgeNativeTargetCell, knowledgesdk.KnowledgeNativeTargetFormula, knowledgesdk.KnowledgeNativeTargetCellStyle, knowledgesdk.KnowledgeNativeTargetMerge, knowledgesdk.KnowledgeNativeTargetElement, knowledgesdk.KnowledgeNativeTargetAsset:
		if !validNativeOperationEntityID(operation.ParentID) {
			return conversationError("bad_request", "page_native_operation_invalid")
		}
	default:
		if operation.ParentID != "" {
			return conversationError("bad_request", "page_native_operation_invalid")
		}
	}
	if operation.Action == knowledgesdk.KnowledgeNativeOperationUpsert {
		if len(operation.Value) == 0 || len(operation.Value) > knowledgeNativeOperationMaximumValue || !json.Valid(operation.Value) {
			return conversationError("bad_request", "page_native_operation_invalid")
		}
	} else if len(operation.Value) != 0 {
		return conversationError("bad_request", "page_native_operation_invalid")
	}
	return nil
}

func nativeEntityID(value any) string {
	item, _ := value.(map[string]any)
	id, _ := item["id"].(string)
	return strings.TrimSpace(id)
}

func nativeEntityIndex(items []any, id string) int {
	for index, item := range items {
		if nativeEntityID(item) == id {
			return index
		}
	}
	return -1
}

func nativeTargetConflict(current any, found bool, expectedHash string) error {
	if !found && expectedHash == "" {
		return nil
	}
	if found && expectedHash != "" && conversationHash(current) == expectedHash {
		return nil
	}
	return conversationError("conflict", "page_native_operation_target_conflict")
}

func decodeNativeOperationValue(raw json.RawMessage) (any, error) {
	var value any
	decoder := json.NewDecoder(strings.NewReader(string(raw)))
	decoder.UseNumber()
	if err := decoder.Decode(&value); err != nil {
		return nil, conversationError("bad_request", "page_native_operation_invalid")
	}
	return value, nil
}

func applyMultidimensionalTableOperation(root map[string]any, operation knowledgesdk.KnowledgePageNativeOperation) error {
	switch operation.Target {
	case knowledgesdk.KnowledgeNativeTargetField, knowledgesdk.KnowledgeNativeTargetRecord, knowledgesdk.KnowledgeNativeTargetView:
		key := operation.Target + "s"
		items, ok := root[key].([]any)
		if !ok {
			if operation.Target != knowledgesdk.KnowledgeNativeTargetView {
				return conversationError("bad_request", "page_native_operation_content_invalid")
			}
			items = []any{}
		}
		index := nativeEntityIndex(items, operation.TargetID)
		found := index >= 0
		var current any
		if found {
			current = items[index]
		}
		if err := nativeTargetConflict(current, found, operation.ExpectedHash); err != nil {
			return err
		}
		if operation.Action == knowledgesdk.KnowledgeNativeOperationDelete {
			if !found {
				return conversationError("conflict", "page_native_operation_target_missing")
			}
			items = append(items[:index:index], items[index+1:]...)
			if operation.Target == knowledgesdk.KnowledgeNativeTargetField {
				if records, valid := root["records"].([]any); valid {
					for _, rawRecord := range records {
						if record, valid := rawRecord.(map[string]any); valid {
							if values, valid := record["values"].(map[string]any); valid {
								delete(values, operation.TargetID)
							}
						}
					}
				}
			} else if operation.Target == knowledgesdk.KnowledgeNativeTargetRecord {
				relationFields := make(map[string]bool)
				if fields, valid := root["fields"].([]any); valid {
					for _, rawField := range fields {
						field, valid := rawField.(map[string]any)
						if valid && field["type"] == "relation" {
							if id, valid := field["id"].(string); valid {
								relationFields[id] = true
							}
						}
					}
				}
				for _, rawRecord := range items {
					record, valid := rawRecord.(map[string]any)
					if !valid {
						continue
					}
					values, valid := record["values"].(map[string]any)
					if !valid {
						continue
					}
					for fieldID := range relationFields {
						relations, valid := values[fieldID].([]any)
						if !valid {
							continue
						}
						filtered := relations[:0]
						for _, rawRelation := range relations {
							if rawRelation != operation.TargetID {
								filtered = append(filtered, rawRelation)
							}
						}
						values[fieldID] = filtered
					}
				}
			}
		} else {
			value, err := decodeNativeOperationValue(operation.Value)
			if err != nil {
				return err
			}
			if nativeEntityID(value) != operation.TargetID {
				return conversationError("bad_request", "page_native_operation_target_mismatch")
			}
			if found {
				items[index] = value
			} else {
				items = append(items, value)
			}
		}
		root[key] = items
		return nil
	case knowledgesdk.KnowledgeNativeTargetCell:
		records, ok := root["records"].([]any)
		if !ok {
			return conversationError("bad_request", "page_native_operation_content_invalid")
		}
		recordIndex := nativeEntityIndex(records, operation.TargetID)
		if recordIndex < 0 {
			return conversationError("conflict", "page_native_operation_parent_missing")
		}
		fields, ok := root["fields"].([]any)
		if !ok || nativeEntityIndex(fields, operation.ParentID) < 0 {
			return conversationError("conflict", "page_native_operation_parent_missing")
		}
		record, ok := records[recordIndex].(map[string]any)
		if !ok {
			return conversationError("bad_request", "page_native_operation_content_invalid")
		}
		values, ok := record["values"].(map[string]any)
		if !ok {
			values = map[string]any{}
		}
		current, found := values[operation.ParentID]
		if err := nativeTargetConflict(current, found, operation.ExpectedHash); err != nil {
			return err
		}
		if operation.Action == knowledgesdk.KnowledgeNativeOperationDelete {
			if !found {
				return conversationError("conflict", "page_native_operation_target_missing")
			}
			delete(values, operation.ParentID)
		} else {
			value, err := decodeNativeOperationValue(operation.Value)
			if err != nil {
				return err
			}
			values[operation.ParentID] = value
		}
		record["values"] = values
		records[recordIndex] = record
		root["records"] = records
		return nil
	case knowledgesdk.KnowledgeNativeTargetTableStructure:
		if operation.TargetID != "table" || operation.Action != knowledgesdk.KnowledgeNativeOperationUpsert {
			return conversationError("bad_request", "page_native_operation_target_mismatch")
		}
		current := nativeObjectWithout(root, "fields", "records", "views")
		if err := nativeTargetConflict(current, true, operation.ExpectedHash); err != nil {
			return err
		}
		value, err := nativeOperationObject(operation)
		if err != nil {
			return err
		}
		if _, invalid := value["fields"]; invalid {
			return conversationError("bad_request", "page_native_operation_target_mismatch")
		}
		if _, invalid := value["records"]; invalid {
			return conversationError("bad_request", "page_native_operation_target_mismatch")
		}
		if _, invalid := value["views"]; invalid {
			return conversationError("bad_request", "page_native_operation_target_mismatch")
		}
		for key := range root {
			if key != "fields" && key != "records" && key != "views" {
				delete(root, key)
			}
		}
		for key, child := range value {
			root[key] = child
		}
		return nil
	default:
		return conversationError("bad_request", "page_native_operation_invalid")
	}
}

func nativeObjectWithout(value map[string]any, excluded ...string) map[string]any {
	result := make(map[string]any, len(value))
	skip := make(map[string]bool, len(excluded))
	for _, key := range excluded {
		skip[key] = true
	}
	for key, child := range value {
		if !skip[key] {
			result[key] = child
		}
	}
	return result
}

func nativeOperationObject(operation knowledgesdk.KnowledgePageNativeOperation) (map[string]any, error) {
	value, err := decodeNativeOperationValue(operation.Value)
	if err != nil {
		return nil, err
	}
	object, ok := value.(map[string]any)
	if !ok {
		return nil, conversationError("bad_request", "page_native_operation_content_invalid")
	}
	return object, nil
}

func nativeSpreadsheetWorkbook(root map[string]any) (map[string]any, error) {
	workbook, ok := root["workbook"].(map[string]any)
	if !ok {
		return nil, conversationError("bad_request", "page_native_operation_content_invalid")
	}
	return workbook, nil
}

func nativeSpreadsheetSheets(root map[string]any) (map[string]any, error) {
	workbook, err := nativeSpreadsheetWorkbook(root)
	if err != nil {
		return nil, err
	}
	sheets, ok := workbook["sheets"].(map[string]any)
	if !ok {
		return nil, conversationError("bad_request", "page_native_operation_content_invalid")
	}
	return sheets, nil
}

func nativeSpreadsheetSheet(root map[string]any, sheetID string) (map[string]any, error) {
	sheets, err := nativeSpreadsheetSheets(root)
	if err != nil {
		return nil, err
	}
	sheet, ok := sheets[sheetID].(map[string]any)
	if !ok {
		return nil, conversationError("conflict", "page_native_operation_parent_missing")
	}
	return sheet, nil
}

func nativeSpreadsheetCell(sheet map[string]any, cellID string, create bool) (map[string]any, map[string]any, string, error) {
	parts := strings.Split(cellID, ":")
	if len(parts) != 2 || parts[0] == "" || parts[1] == "" {
		return nil, nil, "", conversationError("bad_request", "page_native_operation_target_mismatch")
	}
	cellData, ok := sheet["cellData"].(map[string]any)
	if !ok {
		if !create {
			return nil, nil, parts[1], nil
		}
		cellData = map[string]any{}
		sheet["cellData"] = cellData
	}
	row, ok := cellData[parts[0]].(map[string]any)
	if !ok {
		if !create {
			return cellData, nil, parts[1], nil
		}
		row = map[string]any{}
		cellData[parts[0]] = row
	}
	return cellData, row, parts[1], nil
}

func nativeSpreadsheetCellPartition(cell map[string]any, target string) (any, bool) {
	switch target {
	case knowledgesdk.KnowledgeNativeTargetCell:
		value := nativeObjectWithout(cell, "f", "si", "s")
		return value, len(value) > 0
	case knowledgesdk.KnowledgeNativeTargetFormula:
		value := map[string]any{}
		for _, key := range []string{"f", "si"} {
			if child, ok := cell[key]; ok {
				value[key] = child
			}
		}
		return value, len(value) > 0
	case knowledgesdk.KnowledgeNativeTargetCellStyle:
		value, ok := cell["s"]
		return value, ok
	default:
		return nil, false
	}
}

func applySpreadsheetCellOperation(sheet map[string]any, operation knowledgesdk.KnowledgePageNativeOperation) error {
	cellData, row, columnID, err := nativeSpreadsheetCell(sheet, operation.TargetID, false)
	if err != nil {
		return err
	}
	cell := map[string]any(nil)
	if row != nil {
		cell, _ = row[columnID].(map[string]any)
	}
	current, found := nativeSpreadsheetCellPartition(cell, operation.Target)
	if err = nativeTargetConflict(current, found, operation.ExpectedHash); err != nil {
		return err
	}
	if operation.Action == knowledgesdk.KnowledgeNativeOperationDelete {
		if !found {
			return conversationError("conflict", "page_native_operation_target_missing")
		}
	} else if cell == nil {
		cellData, row, columnID, err = nativeSpreadsheetCell(sheet, operation.TargetID, true)
		if err != nil {
			return err
		}
		cell = map[string]any{}
		row[columnID] = cell
	}
	switch operation.Target {
	case knowledgesdk.KnowledgeNativeTargetCell:
		for key := range cell {
			if key != "f" && key != "si" && key != "s" {
				delete(cell, key)
			}
		}
		if operation.Action == knowledgesdk.KnowledgeNativeOperationUpsert {
			value, objectErr := nativeOperationObject(operation)
			if objectErr != nil {
				return objectErr
			}
			for key, child := range value {
				if key == "f" || key == "si" || key == "s" {
					return conversationError("bad_request", "page_native_operation_target_mismatch")
				}
				cell[key] = child
			}
		}
	case knowledgesdk.KnowledgeNativeTargetFormula:
		delete(cell, "f")
		delete(cell, "si")
		if operation.Action == knowledgesdk.KnowledgeNativeOperationUpsert {
			value, objectErr := nativeOperationObject(operation)
			if objectErr != nil {
				return objectErr
			}
			for key, child := range value {
				if key != "f" && key != "si" {
					return conversationError("bad_request", "page_native_operation_target_mismatch")
				}
				cell[key] = child
			}
			if len(value) == 0 {
				return conversationError("bad_request", "page_native_operation_content_invalid")
			}
		}
	case knowledgesdk.KnowledgeNativeTargetCellStyle:
		delete(cell, "s")
		if operation.Action == knowledgesdk.KnowledgeNativeOperationUpsert {
			value, valueErr := decodeNativeOperationValue(operation.Value)
			if valueErr != nil {
				return valueErr
			}
			cell["s"] = value
		}
	}
	if len(cell) == 0 {
		delete(row, columnID)
		if len(row) == 0 {
			parts := strings.Split(operation.TargetID, ":")
			delete(cellData, parts[0])
		}
	}
	return nil
}

func nativeSpreadsheetMergeID(value any) string {
	merge, ok := value.(map[string]any)
	if !ok {
		return ""
	}
	parts := make([]string, 0, 4)
	for _, key := range []string{"startRow", "startColumn", "endRow", "endColumn"} {
		child, ok := merge[key]
		if !ok {
			return ""
		}
		parts = append(parts, strings.TrimSpace(strings.ReplaceAll(string(conversationJSON(child)), `"`, "")))
	}
	return strings.Join(parts, ":")
}

func applySpreadsheetOperation(root map[string]any, operation knowledgesdk.KnowledgePageNativeOperation) error {
	switch operation.Target {
	case knowledgesdk.KnowledgeNativeTargetSheet:
		sheets, err := nativeSpreadsheetSheets(root)
		if err != nil {
			return err
		}
		current, found := sheets[operation.TargetID]
		if err = nativeTargetConflict(current, found, operation.ExpectedHash); err != nil {
			return err
		}
		if operation.Action == knowledgesdk.KnowledgeNativeOperationDelete {
			if !found {
				return conversationError("conflict", "page_native_operation_target_missing")
			}
			delete(sheets, operation.TargetID)
			return nil
		}
		value, err := nativeOperationObject(operation)
		if err != nil {
			return err
		}
		if nativeEntityID(value) != operation.TargetID {
			return conversationError("bad_request", "page_native_operation_target_mismatch")
		}
		sheets[operation.TargetID] = value
		return nil
	case knowledgesdk.KnowledgeNativeTargetWorkbookStructure:
		workbook, err := nativeSpreadsheetWorkbook(root)
		if err != nil {
			return err
		}
		current := nativeObjectWithout(workbook, "sheets", "styles")
		if err := nativeTargetConflict(current, true, operation.ExpectedHash); err != nil {
			return err
		}
		if operation.Action != knowledgesdk.KnowledgeNativeOperationUpsert {
			return conversationError("bad_request", "page_native_operation_invalid")
		}
		value, err := nativeOperationObject(operation)
		if err != nil {
			return err
		}
		if id, _ := value["id"].(string); id != operation.TargetID {
			return conversationError("bad_request", "page_native_operation_target_mismatch")
		}
		for key := range workbook {
			if key != "sheets" && key != "styles" {
				delete(workbook, key)
			}
		}
		for key, child := range value {
			workbook[key] = child
		}
		return nil
	case knowledgesdk.KnowledgeNativeTargetSheetStructure:
		sheet, err := nativeSpreadsheetSheet(root, operation.TargetID)
		if err != nil {
			return err
		}
		current := nativeObjectWithout(sheet, "cellData", "mergeData")
		if err = nativeTargetConflict(current, true, operation.ExpectedHash); err != nil {
			return err
		}
		if operation.Action != knowledgesdk.KnowledgeNativeOperationUpsert {
			return conversationError("bad_request", "page_native_operation_invalid")
		}
		value, err := nativeOperationObject(operation)
		if err != nil {
			return err
		}
		if nativeEntityID(value) != operation.TargetID {
			return conversationError("bad_request", "page_native_operation_target_mismatch")
		}
		for key := range sheet {
			if key != "cellData" && key != "mergeData" {
				delete(sheet, key)
			}
		}
		for key, child := range value {
			sheet[key] = child
		}
		return nil
	case knowledgesdk.KnowledgeNativeTargetStyle:
		workbook, err := nativeSpreadsheetWorkbook(root)
		if err != nil {
			return err
		}
		styles, ok := workbook["styles"].(map[string]any)
		if !ok {
			styles = map[string]any{}
			workbook["styles"] = styles
		}
		current, found := styles[operation.TargetID]
		if err := nativeTargetConflict(current, found, operation.ExpectedHash); err != nil {
			return err
		}
		if operation.Action == knowledgesdk.KnowledgeNativeOperationDelete {
			if !found {
				return conversationError("conflict", "page_native_operation_target_missing")
			}
			delete(styles, operation.TargetID)
			return nil
		}
		value, err := decodeNativeOperationValue(operation.Value)
		if err != nil {
			return err
		}
		styles[operation.TargetID] = value
		return nil
	case knowledgesdk.KnowledgeNativeTargetCell, knowledgesdk.KnowledgeNativeTargetFormula, knowledgesdk.KnowledgeNativeTargetCellStyle:
		sheet, err := nativeSpreadsheetSheet(root, operation.ParentID)
		if err != nil {
			return err
		}
		return applySpreadsheetCellOperation(sheet, operation)
	case knowledgesdk.KnowledgeNativeTargetMerge:
		sheet, err := nativeSpreadsheetSheet(root, operation.ParentID)
		if err != nil {
			return err
		}
		merges, ok := sheet["mergeData"].([]any)
		if !ok {
			merges = []any{}
		}
		index := -1
		for candidateIndex, merge := range merges {
			if nativeSpreadsheetMergeID(merge) == operation.TargetID {
				index = candidateIndex
				break
			}
		}
		found := index >= 0
		var current any
		if found {
			current = merges[index]
		}
		if err = nativeTargetConflict(current, found, operation.ExpectedHash); err != nil {
			return err
		}
		if operation.Action == knowledgesdk.KnowledgeNativeOperationDelete {
			if !found {
				return conversationError("conflict", "page_native_operation_target_missing")
			}
			merges = append(merges[:index:index], merges[index+1:]...)
		} else {
			value, valueErr := nativeOperationObject(operation)
			if valueErr != nil {
				return valueErr
			}
			if nativeSpreadsheetMergeID(value) != operation.TargetID {
				return conversationError("bad_request", "page_native_operation_target_mismatch")
			}
			if found {
				merges[index] = value
			} else {
				merges = append(merges, value)
			}
		}
		sheet["mergeData"] = merges
		return nil
	case knowledgesdk.KnowledgeNativeTargetChart, knowledgesdk.KnowledgeNativeTargetPivot, knowledgesdk.KnowledgeNativeTargetProtectedRange:
		key := map[string]string{
			knowledgesdk.KnowledgeNativeTargetChart:          "charts",
			knowledgesdk.KnowledgeNativeTargetPivot:          "pivots",
			knowledgesdk.KnowledgeNativeTargetProtectedRange: "protected_ranges",
		}[operation.Target]
		items, ok := root[key].([]any)
		if !ok {
			return conversationError("bad_request", "page_native_operation_content_invalid")
		}
		index := nativeEntityIndex(items, operation.TargetID)
		found := index >= 0
		var current any
		if found {
			current = items[index]
		}
		if err := nativeTargetConflict(current, found, operation.ExpectedHash); err != nil {
			return err
		}
		if operation.Action == knowledgesdk.KnowledgeNativeOperationDelete {
			if !found {
				return conversationError("conflict", "page_native_operation_target_missing")
			}
			root[key] = append(items[:index:index], items[index+1:]...)
			return nil
		}
		value, err := nativeOperationObject(operation)
		if err != nil {
			return err
		}
		if nativeEntityID(value) != operation.TargetID {
			return conversationError("bad_request", "page_native_operation_target_mismatch")
		}
		if found {
			items[index] = value
		} else {
			items = append(items, value)
		}
		root[key] = items
		return nil
	default:
		return conversationError("bad_request", "page_native_operation_invalid")
	}
}

func graphArrayEntity(root map[string]any, key, targetID string) ([]any, int, any, bool, error) {
	items, ok := root[key].([]any)
	if !ok {
		return nil, -1, nil, false, conversationError("bad_request", "page_native_operation_content_invalid")
	}
	index := nativeEntityIndex(items, targetID)
	if index < 0 {
		return items, -1, nil, false, nil
	}
	return items, index, items[index], true, nil
}

func applyGraphArrayEntity(root, baseline map[string]any, key string, operation knowledgesdk.KnowledgePageNativeOperation) error {
	_, _, baselineValue, baselineFound, err := graphArrayEntity(baseline, key, operation.TargetID)
	if err != nil {
		return err
	}
	if err = nativeTargetConflict(baselineValue, baselineFound, operation.ExpectedHash); err != nil {
		return err
	}
	items, index, _, found, err := graphArrayEntity(root, key, operation.TargetID)
	if err != nil {
		return err
	}
	if operation.Action == knowledgesdk.KnowledgeNativeOperationDelete {
		if !found {
			return conversationError("conflict", "page_native_operation_target_missing")
		}
		root[key] = append(items[:index:index], items[index+1:]...)
		return nil
	}
	value, err := nativeOperationObject(operation)
	if err != nil {
		return err
	}
	if nativeEntityID(value) != operation.TargetID {
		return conversationError("bad_request", "page_native_operation_target_mismatch")
	}
	if found {
		items[index] = value
	} else {
		items = append(items, value)
	}
	root[key] = items
	return nil
}

type nativeMindMapNodeLocation struct {
	node     map[string]any
	parent   map[string]any
	children []any
	index    int
}

func findNativeMindMapNode(node map[string]any, parent map[string]any, siblings []any, index int, targetID string) (nativeMindMapNodeLocation, bool) {
	if nativeEntityID(node) == targetID {
		return nativeMindMapNodeLocation{node: node, parent: parent, children: siblings, index: index}, true
	}
	children, _ := node["children"].([]any)
	for childIndex, rawChild := range children {
		child, ok := rawChild.(map[string]any)
		if !ok {
			continue
		}
		if found, ok := findNativeMindMapNode(child, node, children, childIndex, targetID); ok {
			return found, true
		}
	}
	return nativeMindMapNodeLocation{}, false
}

func nativeMindMapRoot(root map[string]any) (map[string]any, map[string]any, error) {
	node, ok := root["root"].(map[string]any)
	if !ok {
		return nil, nil, conversationError("bad_request", "page_native_operation_content_invalid")
	}
	return root, node, nil
}

func nativeMindMapNodeState(root map[string]any, targetID string) (map[string]any, nativeMindMapNodeLocation, bool, error) {
	_, rootNode, err := nativeMindMapRoot(root)
	if err != nil {
		return nil, nativeMindMapNodeLocation{}, false, err
	}
	location, found := findNativeMindMapNode(rootNode, nil, nil, 0, targetID)
	if !found {
		return nil, location, false, nil
	}
	parentID := ""
	if location.parent != nil {
		parentID = nativeEntityID(location.parent)
	}
	state := map[string]any{"node": nativeObjectWithout(location.node, "children"), "parent_id": parentID, "index": location.index}
	return state, location, true, nil
}

func nativeOperationIndex(value any) (int, bool) {
	switch number := value.(type) {
	case json.Number:
		parsed, err := strconv.Atoi(string(number))
		return parsed, err == nil && parsed >= 0
	case float64:
		parsed := int(number)
		return parsed, number == float64(parsed) && parsed >= 0
	case int:
		return number, number >= 0
	default:
		return 0, false
	}
}

func applyMindMapNodeOperation(root, baseline map[string]any, operation knowledgesdk.KnowledgePageNativeOperation) error {
	baselineState, _, baselineFound, err := nativeMindMapNodeState(baseline, operation.TargetID)
	if err != nil {
		return err
	}
	if err = nativeTargetConflict(baselineState, baselineFound, operation.ExpectedHash); err != nil {
		return err
	}
	_, rootNode, err := nativeMindMapRoot(root)
	if err != nil {
		return err
	}
	_, current, found, err := nativeMindMapNodeState(root, operation.TargetID)
	if err != nil {
		return err
	}
	if operation.Action == knowledgesdk.KnowledgeNativeOperationDelete {
		if !found {
			return conversationError("conflict", "page_native_operation_target_missing")
		}
		if current.parent == nil {
			return conversationError("bad_request", "page_native_operation_root_delete")
		}
		current.parent["children"] = append(current.children[:current.index:current.index], current.children[current.index+1:]...)
		return nil
	}
	value, err := nativeOperationObject(operation)
	if err != nil {
		return err
	}
	node, ok := value["node"].(map[string]any)
	parentID, parentOK := value["parent_id"].(string)
	index, indexOK := nativeOperationIndex(value["index"])
	if !ok || !parentOK || !indexOK || nativeEntityID(node) != operation.TargetID {
		return conversationError("bad_request", "page_native_operation_target_mismatch")
	}
	if operation.TargetID == nativeEntityID(rootNode) {
		if parentID != "" || index != 0 {
			return conversationError("bad_request", "page_native_operation_target_mismatch")
		}
		children := rootNode["children"]
		for key := range rootNode {
			delete(rootNode, key)
		}
		for key, child := range node {
			rootNode[key] = child
		}
		if children != nil {
			rootNode["children"] = children
		}
		return nil
	}
	_, parent, parentFound, err := nativeMindMapNodeState(root, parentID)
	if err != nil || !parentFound {
		return conversationError("conflict", "page_native_operation_parent_missing")
	}
	if found {
		if _, descendant := findNativeMindMapNode(current.node, nil, nil, 0, parentID); descendant {
			return conversationError("bad_request", "page_native_operation_cycle")
		}
	}
	children, _ := parent.node["children"].([]any)
	preservedChildren := []any{}
	if found {
		preservedChildren, _ = current.node["children"].([]any)
		current.parent["children"] = append(current.children[:current.index:current.index], current.children[current.index+1:]...)
		children, _ = parent.node["children"].([]any)
	}
	node["children"] = preservedChildren
	if index > len(children) {
		index = len(children)
	}
	children = append(children, nil)
	copy(children[index+1:], children[index:])
	children[index] = node
	parent.node["children"] = children
	return nil
}

func applyGraphStructure(root, baseline map[string]any, contentType string, operation knowledgesdk.KnowledgePageNativeOperation) error {
	if operation.Action != knowledgesdk.KnowledgeNativeOperationUpsert {
		return conversationError("bad_request", "page_native_operation_invalid")
	}
	value, err := nativeOperationObject(operation)
	if err != nil {
		return err
	}
	switch contentType {
	case knowledgesdk.KnowledgePageTypeWhiteboard:
		current := nativeObjectWithout(baseline, "elements")
		if err = nativeTargetConflict(current, true, operation.ExpectedHash); err != nil {
			return err
		}
		for key := range root {
			if key != "elements" {
				delete(root, key)
			}
		}
		for key, child := range value {
			root[key] = child
		}
	case knowledgesdk.KnowledgePageTypeFlowchart:
		current := nativeObjectWithout(baseline, "nodes", "edges")
		if err = nativeTargetConflict(current, true, operation.ExpectedHash); err != nil {
			return err
		}
		for key := range root {
			if key != "nodes" && key != "edges" {
				delete(root, key)
			}
		}
		for key, child := range value {
			root[key] = child
		}
	case knowledgesdk.KnowledgePageTypeMindMap:
		data, _, dataErr := nativeMindMapRoot(root)
		if dataErr != nil {
			return dataErr
		}
		baselineData, _, dataErr := nativeMindMapRoot(baseline)
		if dataErr != nil {
			return dataErr
		}
		current := nativeObjectWithout(baselineData, "root", "relations")
		if err = nativeTargetConflict(current, true, operation.ExpectedHash); err != nil {
			return err
		}
		for key := range data {
			if key != "root" && key != "relations" {
				delete(data, key)
			}
		}
		for key, child := range value {
			data[key] = child
		}
	}
	return nil
}

func applyGraphOperation(root, baseline map[string]any, contentType string, operation knowledgesdk.KnowledgePageNativeOperation) error {
	if operation.Target == knowledgesdk.KnowledgeNativeTargetGraphStructure {
		return applyGraphStructure(root, baseline, contentType, operation)
	}
	switch contentType {
	case knowledgesdk.KnowledgePageTypeWhiteboard:
		return applyGraphArrayEntity(root, baseline, "elements", operation)
	case knowledgesdk.KnowledgePageTypeFlowchart:
		if operation.Target == knowledgesdk.KnowledgeNativeTargetNode {
			return applyGraphArrayEntity(root, baseline, "nodes", operation)
		}
		if operation.Target == knowledgesdk.KnowledgeNativeTargetEdge {
			return applyGraphArrayEntity(root, baseline, "edges", operation)
		}
	case knowledgesdk.KnowledgePageTypeMindMap:
		if operation.Target == knowledgesdk.KnowledgeNativeTargetNode {
			return applyMindMapNodeOperation(root, baseline, operation)
		}
		if operation.Target == knowledgesdk.KnowledgeNativeTargetEdge {
			data, _, err := nativeMindMapRoot(root)
			if err != nil {
				return err
			}
			baselineData, _, err := nativeMindMapRoot(baseline)
			if err != nil {
				return err
			}
			if _, ok := data["relations"]; !ok {
				data["relations"] = []any{}
			}
			if _, ok := baselineData["relations"]; !ok {
				baselineData["relations"] = []any{}
			}
			return applyGraphArrayEntity(data, baselineData, "relations", operation)
		}
	}
	return conversationError("bad_request", "page_native_operation_invalid")
}

func nativePresentationSlides(root map[string]any) ([]any, error) {
	slides, ok := root["slides"].([]any)
	if !ok {
		return nil, conversationError("bad_request", "page_native_operation_content_invalid")
	}
	return slides, nil
}

func nativePresentationSlide(root map[string]any, slideID string) (map[string]any, int, error) {
	slides, err := nativePresentationSlides(root)
	if err != nil {
		return nil, -1, err
	}
	index := nativeEntityIndex(slides, slideID)
	if index < 0 {
		return nil, -1, nil
	}
	slide, ok := slides[index].(map[string]any)
	if !ok {
		return nil, -1, conversationError("bad_request", "page_native_operation_content_invalid")
	}
	return slide, index, nil
}

func nativePresentationStructure(root map[string]any) (map[string]any, error) {
	slides, err := nativePresentationSlides(root)
	if err != nil {
		return nil, err
	}
	order := make([]any, 0, len(slides))
	for _, rawSlide := range slides {
		id := nativeEntityID(rawSlide)
		if id == "" {
			return nil, conversationError("bad_request", "page_native_operation_content_invalid")
		}
		order = append(order, id)
	}
	value := nativeObjectWithout(root, "slides")
	value["slide_order"] = order
	return value, nil
}

func applyPresentationOperation(root, baseline map[string]any, operation knowledgesdk.KnowledgePageNativeOperation) error {
	switch operation.Target {
	case knowledgesdk.KnowledgeNativeTargetSlide:
		baselineSlide, _, err := nativePresentationSlide(baseline, operation.TargetID)
		if err != nil {
			return err
		}
		baselineFound := baselineSlide != nil
		baselineValue := any(nil)
		if baselineFound {
			if operation.Action == knowledgesdk.KnowledgeNativeOperationDelete {
				baselineValue = baselineSlide
			} else {
				baselineValue = nativeObjectWithout(baselineSlide, "elements", "files")
			}
		}
		if err = nativeTargetConflict(baselineValue, baselineFound, operation.ExpectedHash); err != nil {
			return err
		}
		slides, err := nativePresentationSlides(root)
		if err != nil {
			return err
		}
		slide, index, err := nativePresentationSlide(root, operation.TargetID)
		if err != nil {
			return err
		}
		if operation.Action == knowledgesdk.KnowledgeNativeOperationDelete {
			if slide == nil {
				return conversationError("conflict", "page_native_operation_target_missing")
			}
			root["slides"] = append(slides[:index:index], slides[index+1:]...)
			return nil
		}
		value, err := nativeOperationObject(operation)
		if err != nil || nativeEntityID(value) != operation.TargetID {
			return conversationError("bad_request", "page_native_operation_target_mismatch")
		}
		if slide == nil {
			if _, ok := value["elements"].([]any); !ok {
				value["elements"] = []any{}
			}
			if _, ok := value["files"].(map[string]any); !ok {
				value["files"] = map[string]any{}
			}
			root["slides"] = append(slides, value)
			return nil
		}
		elements, files := slide["elements"], slide["files"]
		for key := range slide {
			if key != "elements" && key != "files" {
				delete(slide, key)
			}
		}
		for key, child := range value {
			if key == "elements" || key == "files" {
				return conversationError("bad_request", "page_native_operation_target_mismatch")
			}
			slide[key] = child
		}
		slide["elements"], slide["files"] = elements, files
		return nil
	case knowledgesdk.KnowledgeNativeTargetElement:
		slide, _, err := nativePresentationSlide(root, operation.ParentID)
		if err != nil || slide == nil {
			return conversationError("conflict", "page_native_operation_parent_missing")
		}
		baselineSlide, _, err := nativePresentationSlide(baseline, operation.ParentID)
		if err != nil || baselineSlide == nil {
			return conversationError("conflict", "page_native_operation_parent_missing")
		}
		return applyGraphArrayEntity(slide, baselineSlide, "elements", operation)
	case knowledgesdk.KnowledgeNativeTargetAsset:
		slide, _, err := nativePresentationSlide(root, operation.ParentID)
		if err != nil || slide == nil {
			return conversationError("conflict", "page_native_operation_parent_missing")
		}
		baselineSlide, _, err := nativePresentationSlide(baseline, operation.ParentID)
		if err != nil || baselineSlide == nil {
			return conversationError("conflict", "page_native_operation_parent_missing")
		}
		assets, ok := slide["files"].(map[string]any)
		if !ok {
			assets = map[string]any{}
			slide["files"] = assets
		}
		baselineAssets, _ := baselineSlide["files"].(map[string]any)
		current, found := baselineAssets[operation.TargetID]
		if err = nativeTargetConflict(current, found, operation.ExpectedHash); err != nil {
			return err
		}
		if operation.Action == knowledgesdk.KnowledgeNativeOperationDelete {
			if !found {
				return conversationError("conflict", "page_native_operation_target_missing")
			}
			delete(assets, operation.TargetID)
			return nil
		}
		value, err := decodeNativeOperationValue(operation.Value)
		if err != nil {
			return err
		}
		assets[operation.TargetID] = value
		return nil
	case knowledgesdk.KnowledgeNativeTargetPresentation:
		current, err := nativePresentationStructure(baseline)
		if err != nil {
			return err
		}
		if err = nativeTargetConflict(current, true, operation.ExpectedHash); err != nil {
			return err
		}
		if operation.Action != knowledgesdk.KnowledgeNativeOperationUpsert {
			return conversationError("bad_request", "page_native_operation_invalid")
		}
		value, err := nativeOperationObject(operation)
		if err != nil {
			return err
		}
		order, ok := value["slide_order"].([]any)
		if !ok {
			return conversationError("bad_request", "page_native_operation_content_invalid")
		}
		delete(value, "slide_order")
		slides, err := nativePresentationSlides(root)
		if err != nil {
			return err
		}
		byID := make(map[string]any, len(slides))
		for _, slide := range slides {
			byID[nativeEntityID(slide)] = slide
		}
		ordered := make([]any, 0, len(order))
		for _, rawID := range order {
			id, ok := rawID.(string)
			if !ok || byID[id] == nil {
				return conversationError("bad_request", "page_native_operation_target_mismatch")
			}
			ordered = append(ordered, byID[id])
			delete(byID, id)
		}
		if len(byID) != 0 {
			return conversationError("bad_request", "page_native_operation_target_mismatch")
		}
		for key := range root {
			if key != "slides" {
				delete(root, key)
			}
		}
		for key, child := range value {
			root[key] = child
		}
		root["slides"] = ordered
		return nil
	default:
		return conversationError("bad_request", "page_native_operation_invalid")
	}
}

func nativeFormComponentID(value any) string {
	component, _ := value.(map[string]any)
	id, _ := component["key"].(string)
	return strings.TrimSpace(id)
}

func nativeFormComponentIndex(items []any, id string) int {
	for index, item := range items {
		if nativeFormComponentID(item) == id {
			return index
		}
	}
	return -1
}

func nativeFormStructure(root map[string]any) (map[string]any, error) {
	items, ok := root["components"].([]any)
	if !ok {
		return nil, conversationError("bad_request", "page_native_operation_content_invalid")
	}
	order := make([]any, 0, len(items))
	for _, item := range items {
		id := nativeFormComponentID(item)
		if id == "" {
			return nil, conversationError("bad_request", "page_native_operation_content_invalid")
		}
		order = append(order, id)
	}
	value := nativeObjectWithout(root, "components")
	value["component_order"] = order
	return value, nil
}

func applyFormOperation(root, baseline map[string]any, operation knowledgesdk.KnowledgePageNativeOperation) error {
	switch operation.Target {
	case knowledgesdk.KnowledgeNativeTargetComponent:
		baselineItems, ok := baseline["components"].([]any)
		if !ok {
			return conversationError("bad_request", "page_native_operation_content_invalid")
		}
		baselineIndex := nativeFormComponentIndex(baselineItems, operation.TargetID)
		baselineFound := baselineIndex >= 0
		var baselineValue any
		if baselineFound {
			baselineValue = baselineItems[baselineIndex]
		}
		if err := nativeTargetConflict(baselineValue, baselineFound, operation.ExpectedHash); err != nil {
			return err
		}
		items, ok := root["components"].([]any)
		if !ok {
			return conversationError("bad_request", "page_native_operation_content_invalid")
		}
		index := nativeFormComponentIndex(items, operation.TargetID)
		if operation.Action == knowledgesdk.KnowledgeNativeOperationDelete {
			if index < 0 {
				return conversationError("conflict", "page_native_operation_target_missing")
			}
			root["components"] = append(items[:index:index], items[index+1:]...)
			return nil
		}
		value, err := nativeOperationObject(operation)
		if err != nil || nativeFormComponentID(value) != operation.TargetID {
			return conversationError("bad_request", "page_native_operation_target_mismatch")
		}
		if index >= 0 {
			items[index] = value
		} else {
			items = append(items, value)
		}
		root["components"] = items
		return nil
	case knowledgesdk.KnowledgeNativeTargetFormStructure:
		current, err := nativeFormStructure(baseline)
		if err != nil {
			return err
		}
		if err := nativeTargetConflict(current, true, operation.ExpectedHash); err != nil {
			return err
		}
		if operation.Action != knowledgesdk.KnowledgeNativeOperationUpsert {
			return conversationError("bad_request", "page_native_operation_invalid")
		}
		value, err := nativeOperationObject(operation)
		if err != nil {
			return err
		}
		order, ok := value["component_order"].([]any)
		if !ok {
			return conversationError("bad_request", "page_native_operation_content_invalid")
		}
		delete(value, "component_order")
		items, ok := root["components"].([]any)
		if !ok {
			return conversationError("bad_request", "page_native_operation_content_invalid")
		}
		byID := make(map[string]any, len(items))
		for _, item := range items {
			byID[nativeFormComponentID(item)] = item
		}
		ordered := make([]any, 0, len(order))
		for _, rawID := range order {
			id, ok := rawID.(string)
			if !ok || byID[id] == nil {
				return conversationError("bad_request", "page_native_operation_target_mismatch")
			}
			ordered = append(ordered, byID[id])
			delete(byID, id)
		}
		if len(byID) != 0 {
			return conversationError("bad_request", "page_native_operation_target_mismatch")
		}
		for key := range root {
			if key != "components" {
				delete(root, key)
			}
		}
		for key, child := range value {
			root[key] = child
		}
		root["components"] = ordered
		return nil
	default:
		return conversationError("bad_request", "page_native_operation_invalid")
	}
}

func applyKnowledgeNativeOperations(contentType, content string, operations []knowledgesdk.KnowledgePageNativeOperation) (string, error) {
	var root map[string]any
	decoder := json.NewDecoder(strings.NewReader(content))
	decoder.UseNumber()
	if err := decoder.Decode(&root); err != nil || root == nil {
		return "", conversationError("bad_request", "page_native_operation_content_invalid")
	}
	var baseline map[string]any
	baselineDecoder := json.NewDecoder(strings.NewReader(content))
	baselineDecoder.UseNumber()
	if err := baselineDecoder.Decode(&baseline); err != nil || baseline == nil {
		return "", conversationError("bad_request", "page_native_operation_content_invalid")
	}
	for _, operation := range operations {
		var err error
		switch contentType {
		case knowledgesdk.KnowledgePageTypeMultidimensionalTable:
			err = applyMultidimensionalTableOperation(root, operation)
		case knowledgesdk.KnowledgePageTypeSpreadsheet:
			err = applySpreadsheetOperation(root, operation)
		case knowledgesdk.KnowledgePageTypeWhiteboard, knowledgesdk.KnowledgePageTypeMindMap, knowledgesdk.KnowledgePageTypeFlowchart:
			err = applyGraphOperation(root, baseline, contentType, operation)
		case knowledgesdk.KnowledgePageTypePresentation:
			err = applyPresentationOperation(root, baseline, operation)
		case knowledgesdk.KnowledgePageTypeForm:
			err = applyFormOperation(root, baseline, operation)
		default:
			err = conversationError("conflict", "page_native_operation_unsupported")
		}
		if err != nil {
			return "", err
		}
	}
	encoded, err := json.Marshal(root)
	if err != nil {
		return "", conversationError("bad_request", "page_native_operation_content_invalid")
	}
	return string(encoded), nil
}

func (s *Store) nativeOperationRecords(ctx context.Context, db conversationDB, scope, pageID string, draftRevision int64) ([]knowledgesdk.KnowledgePageNativeOperationRecord, error) {
	statement, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgePageNativeOperationTable).
		Columns("payload_json").
		Where(query.And(query.Equal("scope_key", scope), query.Equal("page_id", pageID), query.Equal("draft_revision", draftRevision))).
		OrderBy(query.Ascending("id")).Build()
	if err != nil {
		return nil, err
	}
	rows, err := db.QueryContext(ctx, statement, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	values := []knowledgesdk.KnowledgePageNativeOperationRecord{}
	for rows.Next() {
		var raw []byte
		if err := rows.Scan(&raw); err != nil {
			return nil, err
		}
		var value knowledgesdk.KnowledgePageNativeOperationRecord
		if err := unmarshalDurableJSON(raw, &value); err != nil {
			return nil, err
		}
		values = append(values, value)
	}
	return values, rows.Err()
}

func (s *Store) ApplyKnowledgePageNativeOperations(ctx context.Context, libraryID, pageID string, in knowledgesdk.KnowledgePageNativeOperationBatch, a agentsdk.Authority) (out knowledgesdk.KnowledgePageNativeOperationResult, err error) {
	out.Operations = []knowledgesdk.KnowledgePageNativeOperationRecord{}
	if in.BaseDraftRevision < 1 || len(in.Operations) < 1 || len(in.Operations) > knowledgeNativeOperationMaximumBatch {
		return out, conversationError("bad_request", "page_native_operation_batch_invalid")
	}
	seen := make(map[string]bool, len(in.Operations))
	for _, operation := range in.Operations {
		if seen[operation.ID] {
			return out, conversationError("bad_request", "page_native_operation_duplicate")
		}
		seen[operation.ID] = true
		if err = validateNativeOperation(operation); err != nil {
			return out, err
		}
	}
	if _, err = pageRequestKey("native_operations", libraryID, pageID, in.ClientID, a); err != nil {
		return out, err
	}
	err = s.mutateKnowledgeOperation(ctx, "knowledge.page.native_operations", knowledgesdk.ActionPageNativeOperationsApply, libraryID+":"+pageID, in.ClientID, in, a, func(tx *sql.Tx) (any, error) {
		library, e := s.libraryRecord(ctx, tx, libraryID, a)
		if e != nil {
			return out, e
		}
		if e = requirePageWriting(library); e != nil {
			return out, e
		}
		page, e := s.pageRecord(ctx, tx, libraryID, pageID, a)
		if e != nil {
			return out, e
		}
		if page.State != "active" || page.ContentType != knowledgesdk.KnowledgePageTypeMultidimensionalTable && page.ContentType != knowledgesdk.KnowledgePageTypeSpreadsheet && page.ContentType != knowledgesdk.KnowledgePageTypeWhiteboard && page.ContentType != knowledgesdk.KnowledgePageTypeMindMap && page.ContentType != knowledgesdk.KnowledgePageTypeFlowchart && page.ContentType != knowledgesdk.KnowledgePageTypePresentation && page.ContentType != knowledgesdk.KnowledgePageTypeForm {
			return out, conversationError("conflict", "page_native_operation_unsupported")
		}
		draft, found, e := s.pageDraft(ctx, tx, pageID, a)
		if e != nil {
			return out, e
		}
		if !found || in.BaseDraftRevision > draft.DraftRevision {
			return out, conversationError("conflict", "page_native_operation_base_invalid")
		}
		if page.ContentType == knowledgesdk.KnowledgePageTypeMultidimensionalTable {
			root, decodeErr := decodeGridRoot(draft.Body.Content)
			if decodeErr != nil {
				return out, decodeErr
			}
			if e = authorizeGridOperations(root, in.Operations, library, a); e != nil {
				return out, e
			}
		} else if page.ContentType == knowledgesdk.KnowledgePageTypeSpreadsheet {
			root, decodeErr := decodeSpreadsheetRoot(draft.Body.Content)
			if decodeErr != nil {
				return out, decodeErr
			}
			if e = authorizeSpreadsheetOperations(root, in.Operations, library, a); e != nil {
				return out, e
			}
		}
		content, e := applyKnowledgeNativeOperations(page.ContentType, draft.Body.Content, in.Operations)
		if e != nil {
			return out, e
		}
		body, e := s.normalizedTypedPageContent(page.ContentType, knowledgesdk.PageContentSchemaVersion, content, "")
		if e != nil {
			return out, e
		}
		priorDraftRevision := draft.DraftRevision
		if e = s.updatePage(ctx, tx, &page, page.Revision, a); e != nil {
			return out, e
		}
		now := page.UpdatedAt
		draft.DraftRevision++
		draft.Body, draft.UpdatedByUserID, draft.UpdatedAt = body, a.UserID, now
		requestKey, requestErr := pageRequestKey("native_operations", libraryID, pageID, in.ClientID, a)
		if requestErr != nil {
			return out, requestErr
		}
		q, args, updateErr := query.NewUpdateBuilder(s.store.Renderer(), knowledgePageDraftTable).Set("draft_revision", draft.DraftRevision).Set("updated_at", now.UnixMilli()).Set("last_request_key", requestKey).Set("last_request_hash", conversationHash(in)).Set("payload_json", conversationJSON(draft)).Where(query.And(pageScope(a, pageID), query.Equal("draft_revision", priorDraftRevision))).Build()
		if updateErr = conversationCAS(ctx, tx, q, args, updateErr); updateErr != nil {
			return out, conversationError("conflict", "page_native_operation_retry")
		}
		for _, operation := range in.Operations {
			record := knowledgesdk.KnowledgePageNativeOperationRecord{Operation: operation, LibraryID: libraryID, PageID: pageID, ContentType: page.ContentType, DraftRevision: draft.DraftRevision, UserID: a.UserID, CreatedAt: now}
			q, args, insertErr := query.NewInsertBuilder(s.store.Renderer(), knowledgePageNativeOperationTable).Columns("scope_key", "page_id", "operation_id", "library_id", "content_type", "target", "target_id", "parent_id", "draft_revision", "user_id", "created_at", "request_hash", "payload_json").Values(libraryScope(a), pageID, operation.ID, libraryID, page.ContentType, operation.Target, operation.TargetID, operation.ParentID, draft.DraftRevision, a.UserID, now.UnixMilli(), conversationHash(operation), conversationJSON(record)).Build()
			if insertErr = conversationExec(ctx, tx, q, args, insertErr); insertErr != nil {
				return out, insertErr
			}
		}
		out.Operations, e = s.nativeOperationRecords(ctx, tx, libraryScope(a), pageID, draft.DraftRevision)
		if e != nil {
			return out, e
		}
		out.View, e = s.pageView(ctx, tx, library, page, true, a)
		return out, e
	}, &out)
	if err == nil {
		s.notifyKnowledgeCollaboration(ctx, a, libraryID, pageID)
	}
	return out, err
}

var _ knowledgesdk.PageNativeOperationService = (*Store)(nil)
