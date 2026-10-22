package store

import (
	"encoding/json"
	"io"
	"math"
	"sort"
	"strconv"
	"strings"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

const emptyKnowledgeSpreadsheetContent = `{"schema_version":1,"workbook":{"id":"workbook-1","name":"工作表","appVersion":"1.1.0","locale":"zhCN","dateSystem":"date1900","styles":{},"sheetOrder":["sheet-1"],"sheets":{"sheet-1":{"id":"sheet-1","name":"工作表 1","tabColor":"","hidden":0,"rowCount":1000,"columnCount":20,"zoomRatio":1,"freeze":{"xSplit":0,"ySplit":0,"startRow":-1,"startColumn":-1},"scrollTop":0,"scrollLeft":0,"defaultColumnWidth":88,"defaultRowHeight":24,"mergeData":[],"cellData":{},"rowData":{},"columnData":{},"showGridlines":1,"rowHeader":{"width":46,"hidden":0},"columnHeader":{"height":20,"hidden":0},"rightToLeft":0}},"resources":[]},"charts":[],"pivots":[],"protected_ranges":[]}`

var spreadsheetWorkbookKeys = map[string]bool{"id": true, "rev": true, "name": true, "appVersion": true, "locale": true, "dateSystem": true, "calculationSettings": true, "styles": true, "sheetOrder": true, "sheets": true, "defaultStyle": true, "resources": true}
var spreadsheetSheetKeys = map[string]bool{"id": true, "name": true, "tabColor": true, "hidden": true, "freeze": true, "rowCount": true, "columnCount": true, "zoomRatio": true, "scrollTop": true, "scrollLeft": true, "defaultColumnWidth": true, "defaultRowHeight": true, "mergeData": true, "cellData": true, "rowData": true, "columnData": true, "defaultStyle": true, "rowHeader": true, "columnHeader": true, "showGridlines": true, "gridlinesColor": true, "backgroundImage": true, "rightToLeft": true}
var spreadsheetCellKeys = map[string]bool{"p": true, "s": true, "v": true, "t": true, "f": true, "ft": true, "fd": true, "ref": true, "xf": true, "si": true, "custom": true}

func spreadsheetObject(value any) (map[string]any, bool) {
	object, ok := value.(map[string]any)
	return object, ok
}

func spreadsheetInteger(value any, minimum, maximum int) (int, bool) {
	number, ok := value.(json.Number)
	if !ok {
		return 0, false
	}
	parsed, err := strconv.Atoi(string(number))
	return parsed, err == nil && parsed >= minimum && parsed <= maximum
}

func spreadsheetNumber(value any) bool {
	number, ok := value.(json.Number)
	if !ok {
		return false
	}
	parsed, err := number.Float64()
	return err == nil && !math.IsNaN(parsed) && !math.IsInf(parsed, 0)
}

func spreadsheetExactKeys(value map[string]any, allowed map[string]bool) bool {
	for key := range value {
		if !allowed[key] {
			return false
		}
	}
	return true
}

func spreadsheetIndex(value string, maximum int) (int, bool) {
	parsed, err := strconv.Atoi(value)
	return parsed, err == nil && parsed >= 0 && parsed <= maximum && strconv.Itoa(parsed) == value
}

func spreadsheetRange(value any, rowCount, columnCount int) (knowledgesdk.KnowledgeSpreadsheetRange, bool) {
	object, ok := spreadsheetObject(value)
	if !ok || len(object) != 4 {
		return knowledgesdk.KnowledgeSpreadsheetRange{}, false
	}
	startRow, startOK := spreadsheetInteger(object["start_row"], 0, rowCount-1)
	endRow, endOK := spreadsheetInteger(object["end_row"], 0, rowCount-1)
	startColumn, startColumnOK := spreadsheetInteger(object["start_column"], 0, columnCount-1)
	endColumn, endColumnOK := spreadsheetInteger(object["end_column"], 0, columnCount-1)
	valueRange := knowledgesdk.KnowledgeSpreadsheetRange{StartRow: startRow, EndRow: endRow, StartColumn: startColumn, EndColumn: endColumn}
	return valueRange, startOK && endOK && startColumnOK && endColumnOK && startRow <= endRow && startColumn <= endColumn
}

func univerSpreadsheetRange(value any, rowCount, columnCount int) bool {
	object, ok := spreadsheetObject(value)
	if !ok {
		return false
	}
	startRow, startOK := spreadsheetInteger(object["startRow"], 0, rowCount-1)
	endRow, endOK := spreadsheetInteger(object["endRow"], 0, rowCount-1)
	startColumn, startColumnOK := spreadsheetInteger(object["startColumn"], 0, columnCount-1)
	endColumn, endColumnOK := spreadsheetInteger(object["endColumn"], 0, columnCount-1)
	return startOK && endOK && startColumnOK && endColumnOK && startRow <= endRow && startColumn <= endColumn
}

func validateSpreadsheetCell(value map[string]any) bool {
	if len(value) == 0 || len(value) > len(spreadsheetCellKeys) || !spreadsheetExactKeys(value, spreadsheetCellKeys) {
		return false
	}
	if raw, ok := value["v"]; ok && raw != nil {
		switch child := raw.(type) {
		case string:
			if !executionText(child, 32768, true) {
				return false
			}
		case json.Number:
			if !spreadsheetNumber(child) {
				return false
			}
		case bool:
		default:
			return false
		}
	}
	if rawFormula, found := value["f"]; found && rawFormula != nil {
		formula, ok := rawFormula.(string)
		if !ok || !strings.HasPrefix(formula, "=") || !executionText(formula, 8192, true) {
			return false
		}
	}
	for _, key := range []string{"ref", "xf", "si"} {
		if child, found := value[key]; found && child != nil {
			text, ok := child.(string)
			if !ok || !executionText(text, 8192, true) {
				return false
			}
		}
	}
	return true
}

func validateSpreadsheetSheet(sheetID string, value map[string]any) (int, int, bool) {
	if !spreadsheetExactKeys(value, spreadsheetSheetKeys) || value["id"] != sheetID || !validNativeOperationEntityID(sheetID) {
		return 0, 0, false
	}
	name, ok := value["name"].(string)
	rowCount, rowOK := spreadsheetInteger(value["rowCount"], 1, 10000)
	columnCount, columnOK := spreadsheetInteger(value["columnCount"], 1, 1000)
	if !ok || !executionText(name, 128, true) || !rowOK || !columnOK {
		return 0, 0, false
	}
	cellData, ok := spreadsheetObject(value["cellData"])
	if !ok || len(cellData) > 10000 {
		return 0, 0, false
	}
	cellCount := 0
	for rowID, rawRow := range cellData {
		if _, valid := spreadsheetIndex(rowID, rowCount-1); !valid {
			return 0, 0, false
		}
		row, valid := spreadsheetObject(rawRow)
		if !valid || len(row) > columnCount {
			return 0, 0, false
		}
		for columnID, rawCell := range row {
			if _, valid = spreadsheetIndex(columnID, columnCount-1); !valid {
				return 0, 0, false
			}
			cell, cellOK := spreadsheetObject(rawCell)
			if !cellOK || !validateSpreadsheetCell(cell) {
				return 0, 0, false
			}
			cellCount++
			if cellCount > 100000 {
				return 0, 0, false
			}
		}
	}
	merges, ok := value["mergeData"].([]any)
	if !ok || len(merges) > 10000 {
		return 0, 0, false
	}
	for _, merge := range merges {
		if !univerSpreadsheetRange(merge, rowCount, columnCount) {
			return 0, 0, false
		}
	}
	for key, maximum := range map[string]int{"rowData": rowCount - 1, "columnData": columnCount - 1} {
		items, valid := spreadsheetObject(value[key])
		if !valid || len(items) > maximum+1 {
			return 0, 0, false
		}
		for id := range items {
			if _, valid = spreadsheetIndex(id, maximum); !valid {
				return 0, 0, false
			}
		}
	}
	return rowCount, columnCount, true
}

func validateSpreadsheetPluginResource(value map[string]any, sheets map[string]map[string]any) bool {
	if len(value) < 2 || len(value) > 3 {
		return false
	}
	name, nameOK := value["name"].(string)
	data, dataOK := value["data"].(string)
	if !nameOK || !dataOK || name != "SHEET_DATA_VALIDATION_PLUGIN" && name != "SHEET_CONDITIONAL_FORMATTING_PLUGIN" || !executionText(data, 256<<10, true) {
		return false
	}
	if id, found := value["id"]; found {
		text, ok := id.(string)
		if !ok || !executionText(text, 128, true) {
			return false
		}
	}
	var rulesBySheet map[string]any
	decoder := json.NewDecoder(strings.NewReader(data))
	decoder.UseNumber()
	if err := decoder.Decode(&rulesBySheet); err != nil || rulesBySheet == nil {
		return false
	}
	if err := decoder.Decode(&struct{}{}); err != io.EOF {
		return false
	}
	nodes := 0
	words := make([]string, 0)
	if err := collectTypedPageText(rulesBySheet, "", 0, &nodes, &words); err != nil {
		return false
	}
	for sheetID, rawRules := range rulesBySheet {
		sheet := sheets[sheetID]
		rowCount, rowOK := spreadsheetInteger(sheet["rowCount"], 1, 10000)
		columnCount, columnOK := spreadsheetInteger(sheet["columnCount"], 1, 1000)
		rules, rulesOK := rawRules.([]any)
		if sheet == nil || !rowOK || !columnOK || !rulesOK || len(rules) > 1000 {
			return false
		}
		seen := map[string]bool{}
		for _, rawRule := range rules {
			rule, ok := spreadsheetObject(rawRule)
			idKey := "uid"
			if name == "SHEET_CONDITIONAL_FORMATTING_PLUGIN" {
				idKey = "cfId"
			}
			id, idOK := rule[idKey].(string)
			ranges, rangeOK := rule["ranges"].([]any)
			if !ok || !idOK || !validNativeOperationEntityID(id) || seen[id] || !rangeOK || len(ranges) < 1 || len(ranges) > 256 {
				return false
			}
			seen[id] = true
			for _, valueRange := range ranges {
				if !univerSpreadsheetRange(valueRange, rowCount, columnCount) {
					return false
				}
			}
		}
	}
	return true
}

func decodeSpreadsheetRoot(content string) (map[string]any, error) {
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

func validateSpreadsheetContent(content string) error {
	root, err := decodeSpreadsheetRoot(content)
	if err != nil {
		return err
	}
	if len(root) != 5 {
		return conversationError("bad_request", "page_content_schema_invalid")
	}
	version, versionOK := spreadsheetInteger(root["schema_version"], 1, 1)
	workbook, workbookOK := spreadsheetObject(root["workbook"])
	charts, chartsOK := root["charts"].([]any)
	pivots, pivotsOK := root["pivots"].([]any)
	protectedRanges, protectedOK := root["protected_ranges"].([]any)
	if !versionOK || version != 1 || !workbookOK || !chartsOK || !pivotsOK || !protectedOK || len(charts) > 128 || len(pivots) > 128 || len(protectedRanges) > 256 || !spreadsheetExactKeys(workbook, spreadsheetWorkbookKeys) {
		return conversationError("bad_request", "page_content_schema_invalid")
	}
	workbookID, idOK := workbook["id"].(string)
	workbookName, nameOK := workbook["name"].(string)
	appVersion, appOK := workbook["appVersion"].(string)
	locale, localeOK := workbook["locale"].(string)
	styles, stylesOK := spreadsheetObject(workbook["styles"])
	sheetOrder, orderOK := workbook["sheetOrder"].([]any)
	sheetsRaw, sheetsOK := spreadsheetObject(workbook["sheets"])
	if !idOK || !validNativeOperationEntityID(workbookID) || !nameOK || !executionText(workbookName, 256, true) || !appOK || !executionText(appVersion, 32, true) || !localeOK || locale != "zhCN" || !stylesOK || len(styles) > 10000 || !orderOK || len(sheetOrder) < 1 || len(sheetOrder) > 256 || !sheetsOK || len(sheetsRaw) != len(sheetOrder) {
		return conversationError("bad_request", "page_content_schema_invalid")
	}
	sheets := make(map[string]map[string]any, len(sheetsRaw))
	dimensions := make(map[string][2]int, len(sheetsRaw))
	for sheetID, rawSheet := range sheetsRaw {
		sheet, ok := spreadsheetObject(rawSheet)
		if !ok {
			return conversationError("bad_request", "page_content_schema_invalid")
		}
		rows, columns, valid := validateSpreadsheetSheet(sheetID, sheet)
		if !valid {
			return conversationError("bad_request", "page_content_schema_invalid")
		}
		sheets[sheetID], dimensions[sheetID] = sheet, [2]int{rows, columns}
	}
	seenSheets := map[string]bool{}
	for _, rawID := range sheetOrder {
		id, ok := rawID.(string)
		if !ok || sheets[id] == nil || seenSheets[id] {
			return conversationError("bad_request", "page_content_schema_invalid")
		}
		seenSheets[id] = true
	}
	resources, resourcesOK := workbook["resources"].([]any)
	if !resourcesOK || len(resources) > 2 {
		return conversationError("bad_request", "page_content_schema_invalid")
	}
	seenResources := map[string]bool{}
	for _, rawResource := range resources {
		resource, ok := spreadsheetObject(rawResource)
		name, _ := resource["name"].(string)
		if !ok || seenResources[name] || !validateSpreadsheetPluginResource(resource, sheets) {
			return conversationError("bad_request", "page_content_schema_invalid")
		}
		seenResources[name] = true
	}
	validateFeatures := func(items []any, kind string) bool {
		seen := map[string]bool{}
		for _, rawItem := range items {
			item, ok := spreadsheetObject(rawItem)
			id, idOK := item["id"].(string)
			name, nameOK := item["name"].(string)
			sheetID, sheetOK := item["sheet_id"].(string)
			key := "range"
			if kind == "pivot" {
				key = "source_range"
			}
			dimension := dimensions[sheetID]
			valueRange, rangeOK := spreadsheetRange(item[key], dimension[0], dimension[1])
			if !ok || !idOK || !validNativeOperationEntityID(id) || seen[id] || !nameOK || !executionText(name, 128, true) || !sheetOK || sheets[sheetID] == nil || !rangeOK {
				return false
			}
			seen[id] = true
			switch kind {
			case "chart":
				chartType, valid := item["type"].(string)
				if len(item) != 5 || !valid || chartType != "column" && chartType != "bar" && chartType != "line" && chartType != "area" && chartType != "pie" && chartType != "donut" && chartType != "scatter" && chartType != "radar" && chartType != "funnel" && chartType != "waterfall" || valueRange.EndColumn-valueRange.StartColumn < 1 {
					return false
				}
			case "pivot":
				aggregate, valid := item["aggregate"].(string)
				if len(item) != 5 || !valid || aggregate != "sum" && aggregate != "count" && aggregate != "average" && aggregate != "min" && aggregate != "max" || valueRange.EndColumn-valueRange.StartColumn < 1 {
					return false
				}
			case "protected_range":
				role, valid := item["minimum_role"].(string)
				if len(item) != 5 || !valid || role != "manager" {
					return false
				}
			}
		}
		return true
	}
	if !validateFeatures(charts, "chart") || !validateFeatures(pivots, "pivot") || !validateFeatures(protectedRanges, "protected_range") {
		return conversationError("bad_request", "page_content_schema_invalid")
	}
	nodes := 0
	words := make([]string, 0)
	if err := collectTypedPageText(root, "", 0, &nodes, &words); err != nil || validateTrustedPageContent(content) != nil {
		return conversationError("bad_request", "page_content_schema_invalid")
	}
	return nil
}

func spreadsheetPlainText(content string) (string, error) {
	root, err := decodeSpreadsheetRoot(content)
	if err != nil {
		return "", err
	}
	workbook, ok := spreadsheetObject(root["workbook"])
	if !ok {
		return "", conversationError("bad_request", "page_content_schema_invalid")
	}
	words := []string{}
	if name, ok := workbook["name"].(string); ok {
		words = append(words, name)
	}
	sheets, _ := spreadsheetObject(workbook["sheets"])
	ids := make([]string, 0, len(sheets))
	for id := range sheets {
		ids = append(ids, id)
	}
	sort.Strings(ids)
	for _, id := range ids {
		sheet, _ := spreadsheetObject(sheets[id])
		if name, ok := sheet["name"].(string); ok {
			words = append(words, name)
		}
		cellData, _ := spreadsheetObject(sheet["cellData"])
		rows := make([]string, 0, len(cellData))
		for row := range cellData {
			rows = append(rows, row)
		}
		sort.Slice(rows, func(left, right int) bool {
			leftValue, _ := strconv.Atoi(rows[left])
			rightValue, _ := strconv.Atoi(rows[right])
			return leftValue < rightValue
		})
		for _, rowID := range rows {
			row, _ := spreadsheetObject(cellData[rowID])
			columns := make([]string, 0, len(row))
			for column := range row {
				columns = append(columns, column)
			}
			sort.Slice(columns, func(left, right int) bool {
				leftValue, _ := strconv.Atoi(columns[left])
				rightValue, _ := strconv.Atoi(columns[right])
				return leftValue < rightValue
			})
			for _, columnID := range columns {
				cell, _ := spreadsheetObject(row[columnID])
				if value, ok := cell["v"]; ok && value != nil {
					words = append(words, strings.TrimSpace(strings.ReplaceAll(string(conversationJSON(value)), `"`, "")))
				}
			}
		}
	}
	for _, key := range []string{"charts", "pivots"} {
		items, _ := root[key].([]any)
		for _, rawItem := range items {
			item, _ := spreadsheetObject(rawItem)
			if name, ok := item["name"].(string); ok {
				words = append(words, name)
			}
		}
	}
	return strings.TrimSpace(strings.Join(strings.Fields(strings.Join(words, " ")), " ")), nil
}

func spreadsheetPageTypeDefinition() knowledgePageTypeDefinition {
	return knowledgePageTypeDefinition{
		ID:           knowledgesdk.KnowledgePageTypeSpreadsheet,
		EmptyContent: func() string { return emptyKnowledgeSpreadsheetContent },
		Normalize: func(schema int, content, suppliedHash string) (knowledgesdk.PageContent, error) {
			if err := validateSpreadsheetContent(content); err != nil {
				return knowledgesdk.PageContent{}, err
			}
			return normalizedStructuredPageContent("workbook", "object", schema, content, suppliedHash)
		},
		ExtractPlainText: func(content knowledgesdk.PageContent) (string, error) { return spreadsheetPlainText(content.Content) },
		ExtractSummary:   pageContentSummary,
		ScanReferences:   scanJSONPageReferences,
		ValidateBeforePublish: func(content string) error {
			if err := validateSpreadsheetContent(content); err != nil {
				return err
			}
			return validateTrustedPageContent(content)
		},
	}
}
