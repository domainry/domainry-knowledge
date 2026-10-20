package modulehttptransport

import (
	"net/http/httptest"
	"testing"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
)

type classificationCapture struct {
	*httptest.ResponseRecorder
	kind, code string
}

func (capture *classificationCapture) RecordError(kind, code string) {
	capture.kind, capture.code = kind, code
}

func TestKnowledgeErrorClassificationMatrix(t *testing.T) {
	tests := []struct{ class, code, kind string }{
		{"unavailable", "knowledge.database_unavailable", "unavailable"},
		{"unavailable", "knowledge.embedding_unavailable", "unavailable"},
		{"conflict", "knowledge.page_fence_rejected", "conflict"},
		{"bad_request", "knowledge.validation_failed", "bad_request"},
		{"forbidden", "knowledge.permission_denied", "forbidden"},
	}
	for _, test := range tests {
		capture := &classificationCapture{ResponseRecorder: httptest.NewRecorder()}
		writeError(capture, &agentsdk.Error{Class: test.class, Code: test.code})
		if capture.kind != test.kind || capture.code != test.code {
			t.Fatalf("class=%q kind=%q code=%q", test.class, capture.kind, capture.code)
		}
	}
}
