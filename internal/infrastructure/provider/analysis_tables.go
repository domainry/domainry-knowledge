package provider

import (
	"context"
	"errors"
	"slices"
	"strings"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	connector "github.com/domainry/domainry-connector-sdk"
	"github.com/domainry/domainry-connector-sdk/providers/knowledge_base/http_api"
	reportsdk "github.com/domainry/domainry-report-sdk"
	reportmodel "github.com/domainry/domainry-report-sdk/model"
	"github.com/domainry/domainry-report-sdk/modulehost"
)

const analysisTablePageSize = 100

func (k *Knowledge) reportAuthority(subject reportmodel.ReportSubject) agentsdk.ConversationAuthority {
	return agentsdk.ConversationAuthority{
		Known: subject.Principal.Known, RuntimeID: k.config.RuntimeID,
		WorkspaceID: subject.Principal.WorkspaceID, UserID: subject.Principal.UserID,
		RoleKey: subject.Principal.RoleKey,
	}
}

func reportTableError(err error) error {
	if errors.Is(err, context.Canceled) || errors.Is(err, context.DeadlineExceeded) {
		return err
	}
	status, code := 502, "backend.report.analysis.table_source_failed"
	if providerCode, ok := connector.ProviderErrorCodeOf(err); ok {
		switch strings.TrimPrefix(providerCode, "knowledge_api.") {
		case "access_denied":
			status, code = 403, "backend.permission.denied"
		case "not_found":
			status, code = 404, "backend.report.analysis.dataset_not_found"
		case "source_changed":
			status, code = 409, "backend.report.analysis.source_changed"
		case "request_invalid":
			status, code = 400, "backend.report.analysis.source_request_invalid"
		case "analysis_unavailable":
			status, code = 503, "backend.report.analysis.table_unavailable"
		}
	}
	return &reportsdk.Error{StatusCode: status, Code: code}
}

func (k *Knowledge) tableCatalog(ctx context.Context, subject reportmodel.ReportSubject) (httpapi.AnalysisTableCatalogOutput, error) {
	if k == nil || len(k.config.AnalysisDocumentIDs) == 0 || subject.Validate() != nil {
		return httpapi.AnalysisTableCatalogOutput{}, &reportsdk.Error{StatusCode: 503, Code: "backend.report.analysis.table_unavailable"}
	}
	out, err := connector.Call(ctx, knowledgeGateway{k, k.reportAuthority(subject)}, httpapi.CatalogAnalysisTables, httpapi.AnalysisTableCatalogInput{})
	if err != nil {
		return out, reportTableError(err)
	}
	if out.Provider != httpapi.ProviderKey || out.KBID != k.config.KBID {
		return out, &reportsdk.Error{StatusCode: 502, Code: "backend.report.analysis.table_source_invalid"}
	}
	return out, nil
}

func (k *Knowledge) ReportAnalysisSources(ctx context.Context, subject reportmodel.ReportSubject) ([]reportmodel.AnalysisDataset, error) {
	catalog, err := k.tableCatalog(ctx, subject)
	if err != nil {
		return nil, err
	}
	result := make([]reportmodel.AnalysisDataset, 0, len(catalog.Tables))
	for _, table := range catalog.Tables {
		columns := make([]reportmodel.AnalysisColumn, len(table.Columns))
		for index, column := range table.Columns {
			columns[index] = reportmodel.AnalysisColumn{Key: column.Key, Name: column.Name, Type: column.Type, Unit: column.Unit, Precision: column.Precision, Scale: column.Scale}
		}
		result = append(result, reportmodel.AnalysisDataset{
			Key: table.DatasetKey, Name: table.Name, Kind: "table_file", Version: table.DefinitionVersion, Columns: columns,
			References: []reportmodel.AnalysisReference{{Kind: "knowledge_document", ID: table.DocID, Label: table.Name, Version: table.Generation, Subresource: table.TableRef}},
		})
	}
	return result, nil
}

func findAnalysisTable(catalog httpapi.AnalysisTableCatalogOutput, dataset string) (httpapi.AnalysisTableCatalogItem, error) {
	for _, table := range catalog.Tables {
		if table.DatasetKey == dataset {
			return table, nil
		}
	}
	return httpapi.AnalysisTableCatalogItem{}, &reportsdk.Error{StatusCode: 404, Code: "backend.report.analysis.dataset_not_found"}
}

func validateAnalysisFields(table httpapi.AnalysisTableCatalogItem, fields []string) bool {
	if len(fields) == 0 || !sortStringsUnique(fields) {
		return false
	}
	allowed := map[string]bool{}
	for _, column := range table.Columns {
		allowed[column.Key] = true
	}
	for _, field := range fields {
		if !allowed[field] {
			return false
		}
	}
	return true
}

func sortStringsUnique(values []string) bool {
	return slices.IsSorted(values) && len(slices.Compact(slices.Clone(values))) == len(values)
}

func (k *Knowledge) readTablePage(ctx context.Context, table httpapi.AnalysisTableCatalogItem, fields []string, offset, limit int, subject reportmodel.ReportSubject) (httpapi.AnalysisTableReadOutput, error) {
	out, err := connector.Call(ctx, knowledgeGateway{k, k.reportAuthority(subject)}, httpapi.ReadAnalysisTable, httpapi.AnalysisTableReadInput{
		DocID: table.DocID, DatasetKey: table.DatasetKey, Generation: table.Generation,
		DefinitionVersion: table.DefinitionVersion, DataVersion: table.DataVersion,
		Fields: slices.Clone(fields), Offset: offset, Limit: limit,
	})
	if err != nil {
		return out, reportTableError(err)
	}
	return out, nil
}

func tableVersion(table httpapi.AnalysisTableCatalogItem, page httpapi.AnalysisTableReadOutput) modulehost.AnalysisTableVersion {
	return modulehost.AnalysisTableVersion{
		DatasetKey: table.DatasetKey, DefinitionVersion: table.DefinitionVersion,
		DataVersion: table.DataVersion, ContentSHA256: page.ContentSHA256,
		Rows: table.RowCount, Complete: table.Complete,
	}
}

func (k *Knowledge) ReadReportAnalysisTableVersion(ctx context.Context, dataset string, fields []string, subject reportmodel.ReportSubject) (modulehost.AnalysisTableVersion, error) {
	catalog, err := k.tableCatalog(ctx, subject)
	if err != nil {
		return modulehost.AnalysisTableVersion{}, err
	}
	table, err := findAnalysisTable(catalog, dataset)
	if err != nil || !validateAnalysisFields(table, fields) {
		if err != nil {
			return modulehost.AnalysisTableVersion{}, err
		}
		return modulehost.AnalysisTableVersion{}, &reportsdk.Error{StatusCode: 400, Code: "backend.report.analysis.source_request_invalid"}
	}
	page, err := k.readTablePage(ctx, table, fields, 0, 0, subject)
	if err != nil {
		return modulehost.AnalysisTableVersion{}, err
	}
	return tableVersion(table, page), nil
}

func (k *Knowledge) StreamReportAnalysisTable(ctx context.Context, expected modulehost.AnalysisTableVersion, fields []string, subject reportmodel.ReportSubject, consume func(reportmodel.AnalysisTableRow) error) (modulehost.AnalysisTableVersion, error) {
	catalog, err := k.tableCatalog(ctx, subject)
	if err != nil {
		return modulehost.AnalysisTableVersion{}, err
	}
	table, err := findAnalysisTable(catalog, expected.DatasetKey)
	if err != nil || !validateAnalysisFields(table, fields) || table.DefinitionVersion != expected.DefinitionVersion || table.DataVersion != expected.DataVersion || table.RowCount != expected.Rows || !table.Complete {
		if err != nil {
			return modulehost.AnalysisTableVersion{}, err
		}
		return modulehost.AnalysisTableVersion{}, &reportsdk.Error{StatusCode: 409, Code: "backend.report.analysis.source_changed"}
	}
	offset := 0
	for {
		page, err := k.readTablePage(ctx, table, fields, offset, analysisTablePageSize, subject)
		if err != nil {
			return modulehost.AnalysisTableVersion{}, err
		}
		if page.ContentSHA256 != expected.ContentSHA256 || page.RowCount != expected.Rows || page.Offset != offset {
			return modulehost.AnalysisTableVersion{}, &reportsdk.Error{StatusCode: 409, Code: "backend.report.analysis.source_changed"}
		}
		for _, values := range page.Rows {
			row := reportmodel.AnalysisTableRow{}
			for index, field := range fields {
				if values[index] != nil {
					value := *values[index]
					row[field] = &value
				} else {
					row[field] = nil
				}
			}
			if err := consume(row); err != nil {
				return modulehost.AnalysisTableVersion{}, err
			}
		}
		if page.NextOffset == nil {
			break
		}
		offset = *page.NextOffset
	}
	final, err := k.readTablePage(ctx, table, fields, 0, 0, subject)
	if err != nil {
		return modulehost.AnalysisTableVersion{}, err
	}
	version := tableVersion(table, final)
	if version != expected {
		return modulehost.AnalysisTableVersion{}, &reportsdk.Error{StatusCode: 409, Code: "backend.report.analysis.source_changed"}
	}
	return version, nil
}

var _ modulehost.AnalysisTableSource = (*Knowledge)(nil)
