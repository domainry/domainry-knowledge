package saas

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/domainry/domainry-foundation/telemetry"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgecontract "github.com/domainry/domainry-knowledge-sdk/contract"
)

type errorCapture struct {
	*httptest.ResponseRecorder
	kind, code  string
	internalErr error
}

func (capture *errorCapture) RecordError(kind, code string) {
	capture.kind, capture.code = kind, code
}

func (capture *errorCapture) RecordInternalError(err error) {
	capture.internalErr = err
}

func TestRecordRoutePublishesBoundedTemplateToOuterProcessBoundary(t *testing.T) {
	var observation telemetry.HTTPServerObservation
	handler := telemetry.HTTPServerMiddleware(telemetry.HTTPServerConfig{Observe: func(value telemetry.HTTPServerObservation) {
		observation = value
	}}, http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		recordRoute(request)
		writer.WriteHeader(http.StatusNoContent)
	}))
	request := httptest.NewRequest(http.MethodPost, knowledgecontract.SaaSDocumentUploadPath+"?access_token=secret", nil)
	handler.ServeHTTP(httptest.NewRecorder(), request)
	if observation.Route != knowledgecontract.SaaSDocumentUploadPath || observation.Method != http.MethodPost || observation.Status != http.StatusNoContent {
		t.Fatalf("observation=%+v", observation)
	}
}

func TestSafeErrorPreservesOnlyPageConflictSnapshot(t *testing.T) {
	updatedAt := time.Date(2026, 10, 19, 1, 2, 3, 0, time.UTC)
	err := knowledgesdk.NewKnowledgePageConflictError("page_draft_revision_conflict", knowledgesdk.KnowledgePageConflict{
		CurrentDraftRevision: 9, BasePublishedVersion: 4, CurrentContentSHA256: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", CurrentUpdatedAt: updatedAt,
	})
	wire := safeError(err)
	var conflict knowledgesdk.KnowledgePageConflict
	if wire.Class != "conflict" || wire.Code != "page_draft_revision_conflict" || json.Unmarshal(wire.Details, &conflict) != nil || conflict.CurrentDraftRevision != 9 || !conflict.CurrentUpdatedAt.Equal(updatedAt) {
		t.Fatalf("wire=%+v conflict=%+v", wire, conflict)
	}
}

func TestWriteSaaSErrorUsesNonSuccessStatusForClassifiedFailure(t *testing.T) {
	capture := &errorCapture{ResponseRecorder: httptest.NewRecorder()}
	writeSaaSError(capture, &knowledgesdk.Error{Class: "conflict", Code: "knowledge.page_conflict"})
	if capture.Code != http.StatusConflict || capture.kind != "conflict" || capture.code != "knowledge.page_conflict" || capture.internalErr != nil {
		t.Fatalf("status=%d kind=%q code=%q internal=%v", capture.Code, capture.kind, capture.code, capture.internalErr)
	}
}

func TestWriteSaaSErrorRecordsUnknownFailureWithoutLeakingRawText(t *testing.T) {
	capture := &errorCapture{ResponseRecorder: httptest.NewRecorder()}
	writeSaaSError(capture, errors.New("database password=private"))
	if capture.Code != http.StatusInternalServerError || capture.kind != "internal" || capture.internalErr == nil {
		t.Fatalf("status=%d kind=%q internal=%v", capture.Code, capture.kind, capture.internalErr)
	}
	if strings.Contains(capture.Body.String(), "private") || strings.Contains(capture.Body.String(), "password") {
		t.Fatalf("raw error leaked: %s", capture.Body.String())
	}
}
