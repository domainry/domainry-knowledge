package store

import (
	"strconv"
	"strings"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

type spreadsheetProtectedRange struct {
	ID, SheetID            string
	StartRow, EndRow       int
	StartColumn, EndColumn int
}

func spreadsheetProtectedRanges(root map[string]any) []spreadsheetProtectedRange {
	raw, _ := root["protected_ranges"].([]any)
	result := make([]spreadsheetProtectedRange, 0, len(raw))
	for _, item := range raw {
		value, _ := item.(map[string]any)
		valueRange, _ := value["range"].(map[string]any)
		startRow, rowOK := spreadsheetInteger(valueRange["start_row"], 0, 9999)
		endRow, endRowOK := spreadsheetInteger(valueRange["end_row"], 0, 9999)
		startColumn, columnOK := spreadsheetInteger(valueRange["start_column"], 0, 999)
		endColumn, endColumnOK := spreadsheetInteger(valueRange["end_column"], 0, 999)
		id, idOK := value["id"].(string)
		sheetID, sheetOK := value["sheet_id"].(string)
		if idOK && sheetOK && rowOK && endRowOK && columnOK && endColumnOK {
			result = append(result, spreadsheetProtectedRange{ID: id, SheetID: sheetID, StartRow: startRow, EndRow: endRow, StartColumn: startColumn, EndColumn: endColumn})
		}
	}
	return result
}

func spreadsheetRangesOverlap(left spreadsheetProtectedRange, sheetID string, startRow, endRow, startColumn, endColumn int) bool {
	return left.SheetID == sheetID && left.StartRow <= endRow && startRow <= left.EndRow && left.StartColumn <= endColumn && startColumn <= left.EndColumn
}

func spreadsheetOperationRange(operation knowledgesdk.KnowledgePageNativeOperation) (string, int, int, int, int, bool) {
	parts := strings.Split(operation.TargetID, ":")
	switch operation.Target {
	case knowledgesdk.KnowledgeNativeTargetCell, knowledgesdk.KnowledgeNativeTargetFormula, knowledgesdk.KnowledgeNativeTargetCellStyle:
		if len(parts) != 2 {
			return "", 0, 0, 0, 0, false
		}
		row, rowErr := strconv.Atoi(parts[0])
		column, columnErr := strconv.Atoi(parts[1])
		return operation.ParentID, row, row, column, column, rowErr == nil && columnErr == nil
	case knowledgesdk.KnowledgeNativeTargetMerge:
		if len(parts) != 4 {
			return "", 0, 0, 0, 0, false
		}
		startRow, firstErr := strconv.Atoi(parts[0])
		startColumn, secondErr := strconv.Atoi(parts[1])
		endRow, thirdErr := strconv.Atoi(parts[2])
		endColumn, fourthErr := strconv.Atoi(parts[3])
		return operation.ParentID, startRow, endRow, startColumn, endColumn, firstErr == nil && secondErr == nil && thirdErr == nil && fourthErr == nil
	default:
		return "", 0, 0, 0, 0, false
	}
}

func spreadsheetHasProtectedRanges(content string) bool {
	root, err := decodeSpreadsheetRoot(content)
	return err == nil && len(spreadsheetProtectedRanges(root)) > 0
}

func authorizeSpreadsheetOperations(root map[string]any, operations []knowledgesdk.KnowledgePageNativeOperation, library agentsdk.KnowledgeLibrary, _ agentsdk.Authority) error {
	if library.Role == "manager" {
		return nil
	}
	protected := spreadsheetProtectedRanges(root)
	for _, operation := range operations {
		if operation.Target == knowledgesdk.KnowledgeNativeTargetProtectedRange {
			return conversationError("forbidden", "page_spreadsheet_permission_denied")
		}
		if operation.Target == knowledgesdk.KnowledgeNativeTargetStyle && len(protected) > 0 {
			return conversationError("forbidden", "page_spreadsheet_permission_denied")
		}
		if operation.Target == knowledgesdk.KnowledgeNativeTargetSheet || operation.Target == knowledgesdk.KnowledgeNativeTargetSheetStructure {
			for _, valueRange := range protected {
				if valueRange.SheetID == operation.TargetID {
					return conversationError("forbidden", "page_spreadsheet_permission_denied")
				}
			}
			continue
		}
		sheetID, startRow, endRow, startColumn, endColumn, ok := spreadsheetOperationRange(operation)
		if !ok {
			continue
		}
		for _, valueRange := range protected {
			if spreadsheetRangesOverlap(valueRange, sheetID, startRow, endRow, startColumn, endColumn) {
				return conversationError("forbidden", "page_spreadsheet_permission_denied")
			}
		}
	}
	return nil
}
