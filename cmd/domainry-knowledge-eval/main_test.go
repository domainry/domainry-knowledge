package main

import (
	"bytes"
	"encoding/json"
	"os"
	"path/filepath"
	"testing"

	"github.com/domainry/domainry-foundation/apperror"
	"github.com/domainry/domainry-knowledge-sdk/evaluation"
)

func TestRunWritesReportBeforeFailingQualityGate(t *testing.T) {
	path := filepath.Join(t.TempDir(), "evaluation.json")
	raw := []byte(`{
  "top_k": 1,
  "cases": [{"id":"private","query":"secret","expected_documents":[],"allowed_document_ids":[]}],
  "observations": [{"case_id":"private","hits":[{"doc_id":"forbidden"}]}],
  "thresholds": {"maximum_unauthorized_documents":0}
}`)
	if err := os.WriteFile(path, raw, 0o600); err != nil {
		t.Fatal(err)
	}
	var output bytes.Buffer
	err := run([]string{path}, &output)
	if err == nil || apperror.CodeOf(err) != "knowledge.evaluation.quality_gate_failed" {
		t.Fatalf("error=%v", err)
	}
	var report evaluation.Report
	if decodeErr := json.Unmarshal(output.Bytes(), &report); decodeErr != nil {
		t.Fatal(decodeErr)
	}
	if report.Passed || report.Metrics.UnauthorizedDocuments != 1 || len(report.Failures) != 1 || report.Failures[0].Metric != "unauthorized_documents" {
		t.Fatalf("report=%+v", report)
	}
}
