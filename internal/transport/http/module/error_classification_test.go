package modulehttptransport

import (
	"net/http/httptest"
	"testing"

	toolsdk "github.com/domainry/domainry-tools-sdk"
)

type classificationCapture struct {
	*httptest.ResponseRecorder
	kind, code string
}

func (capture *classificationCapture) RecordError(kind, code string) {
	capture.kind, capture.code = kind, code
}

func TestKnowledgeErrorClassificationMatrix(t *testing.T) {
	tests := []struct {
		class toolsdk.ErrorClass
		code  string
		kind  string
	}{
		{"unavailable", "knowledge.database_unavailable", "unavailable"},
		{"unavailable", "knowledge.embedding_unavailable", "unavailable"},
		{"conflict", "knowledge.page_fence_rejected", "conflict"},
		{"bad_request", "knowledge.validation_failed", "bad_request"},
		{"forbidden", "knowledge.permission_denied", "forbidden"},
	}
	for _, test := range tests {
		capture := &classificationCapture{ResponseRecorder: httptest.NewRecorder()}
		writeError(capture, &toolsdk.Error{Class: test.class, Code: test.code})
		if capture.kind != test.kind || capture.code != test.code {
			t.Fatalf("class=%q kind=%q code=%q", test.class, capture.kind, capture.code)
		}
	}
}
