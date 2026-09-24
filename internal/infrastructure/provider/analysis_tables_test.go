package provider

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"reflect"
	"sync/atomic"
	"testing"

	"github.com/domainry/domainry-connectors/providers/knowledge_base/http_api"
	identitysdk "github.com/domainry/domainry-identity-sdk"
	reportsdk "github.com/domainry/domainry-report-sdk"
	reportmodel "github.com/domainry/domainry-report-sdk/model"
	"github.com/domainry/domainry-report-sdk/modulehost"
)

const knowledgeAnalysisDigest = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"

func knowledgeAnalysisSubject() reportmodel.ReportSubject {
	return reportmodel.ReportSubject{
		Principal:       identitysdk.Principal{Known: true, WorkspaceID: "workspace", UserID: "user"},
		AccessScopeHash: "scope",
	}
}

func knowledgeAnalysisRows() [][]*string {
	rows := make([][]*string, 205)
	for index := range rows {
		amount := "10.25"
		region := "east"
		if index%5 == 0 {
			rows[index] = []*string{nil, &region}
		} else {
			rows[index] = []*string{&amount, &region}
		}
	}
	return rows
}

func knowledgeAnalysisChecksum(t *testing.T, fields []string, rows [][]*string) string {
	t.Helper()
	digest := sha256.New()
	encoder := json.NewEncoder(digest)
	if err := encoder.Encode(fields); err != nil {
		t.Fatal(err)
	}
	for _, row := range rows {
		if err := encoder.Encode(row); err != nil {
			t.Fatal(err)
		}
	}
	return hex.EncodeToString(digest.Sum(nil))
}

func knowledgeAnalysisTable() httpapi.AnalysisTableCatalogItem {
	return httpapi.AnalysisTableCatalogItem{
		DatasetKey: "table_0123456789abcdef0123456789abcdef", DocID: "doc-1", TableRef: "tbl_fixture_0",
		Name: "Revenue", Sheet: "Revenue", DefinitionVersion: knowledgeAnalysisDigest,
		DataVersion: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
		Generation:  "gen_current", DocVersion: 2, RowCount: 205, Complete: true,
		Columns: []httpapi.AnalysisTableColumn{
			{Key: "amount", Name: "Amount", Type: "decimal", Precision: 18, Scale: 2},
			{Key: "region", Name: "Region", Type: "text"},
		},
	}
}

func TestKnowledgeAnalysisTableStreamsEveryPermissionCheckedPage(t *testing.T) {
	table, rows := knowledgeAnalysisTable(), knowledgeAnalysisRows()
	fields := []string{"amount", "region"}
	checksum := knowledgeAnalysisChecksum(t, fields, rows)
	var requests atomic.Int32
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		requests.Add(1)
		if r.Method != http.MethodPost || r.Header.Get("Authorization") != "Bearer private-key" {
			t.Errorf("invalid request protocol")
		}
		var body map[string]any
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			t.Error(err)
		}
		if body["team_id"] != "team" || body["kb_id"] != "kb" {
			t.Errorf("wrong source scope: %+v", body)
		}
		w.Header().Set("Content-Type", "application/json")
		switch r.URL.Path {
		case "/v1/kb/analysis/tables/catalog":
			if !reflect.DeepEqual(body["document_ids"], []any{"doc-1"}) {
				t.Errorf("untrusted document catalog: %+v", body)
			}
			_ = json.NewEncoder(w).Encode(map[string]any{"err_code": 0, "data": map[string]any{"tables": []httpapi.AnalysisTableCatalogItem{table}}})
		case "/v1/kb/analysis/tables/read":
			offset, limit := int(body["offset"].(float64)), int(body["limit"].(float64))
			page := [][]*string{}
			var next *int
			if limit > 0 {
				end := offset + limit
				if end > len(rows) {
					end = len(rows)
				}
				page = rows[offset:end]
				if end < len(rows) {
					value := end
					next = &value
				}
			}
			response := httpapi.AnalysisTableReadOutput{
				AnalysisTableCatalogItem: table, Fields: fields, ContentSHA256: checksum,
				Offset: offset, Rows: page, NextOffset: next,
			}
			_ = json.NewEncoder(w).Encode(map[string]any{"err_code": 0, "data": response})
		default:
			http.NotFound(w, r)
		}
	}))
	defer server.Close()

	k, err := newKnowledgeWithOfficialAdapter(KnowledgeConfig{
		BaseURL: server.URL, APIKey: "private-key", TeamID: "team", KBID: "kb",
		WorkspaceID: "workspace", RuntimeID: "runtime", AnalysisDocumentIDs: []string{"doc-1"},
		Client: server.Client(),
	})
	if err != nil {
		t.Fatal(err)
	}
	sources, err := k.ReportAnalysisSources(t.Context(), knowledgeAnalysisSubject())
	if err != nil || len(sources) != 1 || sources[0].Kind != "table_file" || sources[0].Columns[0].Name != "Amount" || len(sources[0].References) != 1 || sources[0].References[0].Kind != "knowledge_document" || sources[0].References[0].ID != "doc-1" || sources[0].References[0].Version != "gen_current" || sources[0].References[0].Subresource != "tbl_fixture_0" {
		t.Fatalf("sources=%+v err=%v", sources, err)
	}
	version, err := k.ReadReportAnalysisTableVersion(t.Context(), table.DatasetKey, fields, knowledgeAnalysisSubject())
	if err != nil || version.Rows != 205 || version.ContentSHA256 != checksum {
		t.Fatalf("version=%+v err=%v", version, err)
	}
	var received []reportmodel.AnalysisTableRow
	actual, err := k.StreamReportAnalysisTable(t.Context(), version, fields, knowledgeAnalysisSubject(), func(row reportmodel.AnalysisTableRow) error {
		received = append(received, row)
		return nil
	})
	if err != nil || actual != version || len(received) != len(rows) || received[0]["amount"] != nil || received[204]["region"] == nil {
		t.Fatalf("actual=%+v rows=%d err=%v", actual, len(received), err)
	}
	if requests.Load() != 8 {
		t.Fatalf("requests=%d, want discovery plus catalog/version and catalog/3 pages/final version", requests.Load())
	}
}

func TestKnowledgeAnalysisTableFailsClosedBeforeAndDuringRead(t *testing.T) {
	var calls atomic.Int32
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		calls.Add(1)
		io.WriteString(w, `{"err_code":409}`)
	}))
	defer server.Close()
	k, err := newKnowledgeWithOfficialAdapter(KnowledgeConfig{
		BaseURL: server.URL, APIKey: "private-key", TeamID: "team", KBID: "kb",
		WorkspaceID: "workspace", RuntimeID: "runtime", AnalysisDocumentIDs: []string{"doc-1"}, Client: server.Client(),
	})
	if err != nil {
		t.Fatal(err)
	}
	badSubject := knowledgeAnalysisSubject()
	badSubject.Principal.WorkspaceID = "other"
	if _, err = k.ReportAnalysisSources(t.Context(), badSubject); err == nil || calls.Load() != 0 {
		t.Fatalf("workspace denial err=%v calls=%d", err, calls.Load())
	}
	_, err = k.ReadReportAnalysisTableVersion(t.Context(), knowledgeAnalysisTable().DatasetKey, []string{"amount"}, knowledgeAnalysisSubject())
	var reportErr *reportsdk.Error
	if !errors.As(err, &reportErr) || reportErr.StatusCode != 409 {
		t.Fatalf("source change err=%v", err)
	}
}

func TestKnowledgeAnalysisConfigurationFromEnvironment(t *testing.T) {
	t.Setenv("AGENT_KNOWLEDGE_ANALYSIS_DOCUMENT_IDS", `["doc-2","doc-1"]`)
	config := KnowledgeConfigFromEnvironment()
	if !reflect.DeepEqual(config.AnalysisDocumentIDs, []string{"doc-2", "doc-1"}) {
		t.Fatalf("analysis docs=%v", config.AnalysisDocumentIDs)
	}
	t.Setenv("AGENT_KNOWLEDGE_ANALYSIS_DOCUMENT_IDS", `{}`)
	if _, err := newKnowledgeWithOfficialAdapter(KnowledgeConfigFromEnvironment()); err == nil {
		t.Fatal("invalid analysis document JSON accepted")
	}
}

var _ modulehost.AnalysisTableSource = (*Knowledge)(nil)
