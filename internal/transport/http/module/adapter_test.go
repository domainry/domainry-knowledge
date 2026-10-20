package modulehttptransport

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/domainry/domainry-foundation/httpresponse"
	"github.com/domainry/domainry-foundation/modulehttp"
	identitysdk "github.com/domainry/domainry-identity-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgecontract "github.com/domainry/domainry-knowledge-sdk/contract"
)

type adapterTestService struct{ knowledgecontract.Service }
type adapterTestProvider struct{ adapter modulehttp.Adapter }

type collaborationEventAdapterService struct {
	adapterTestService
	calls  int
	inputs []knowledgesdk.KnowledgeCollaborationEvents
}

type unwrapOnlyResponseWriter struct{ http.ResponseWriter }

func (writer unwrapOnlyResponseWriter) Unwrap() http.ResponseWriter { return writer.ResponseWriter }

func (service *collaborationEventAdapterService) KnowledgeCollaborationEvents(_ context.Context, _, _ string, input knowledgesdk.KnowledgeCollaborationEvents, _ knowledgesdk.Authority) (knowledgesdk.KnowledgeCollaborationEventBatch, error) {
	service.calls++
	service.inputs = append(service.inputs, input)
	if service.calls > 1 {
		return knowledgesdk.KnowledgeCollaborationEventBatch{}, &knowledgesdk.Error{Class: "forbidden", Code: "knowledge.collaboration_session_revoked"}
	}
	update := &knowledgesdk.KnowledgeCollaborationUpdate{ClientID: "client", UpdateID: "update", YjsState: "c3RhdGU=", Content: "content", ContentSHA256: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"}
	return knowledgesdk.KnowledgeCollaborationEventBatch{SessionID: input.SessionID, ServerClock: 7, Complete: true, Events: []knowledgesdk.KnowledgeCollaborationServerEvent{{Type: knowledgesdk.KnowledgeCollaborationEventUpdate, Clock: 7, UserID: "bob", Update: update}}}, nil
}

func (value adapterTestProvider) HTTPAdapters() []modulehttp.Adapter {
	return []modulehttp.Adapter{value.adapter}
}

func TestWriteErrorIncludesBoundedPageConflictDetails(t *testing.T) {
	updatedAt := time.Date(2026, 10, 19, 1, 2, 3, 0, time.UTC)
	err := knowledgesdk.NewKnowledgePageConflictError("page_draft_revision_conflict", knowledgesdk.KnowledgePageConflict{
		CurrentDraftRevision: 7, BasePublishedVersion: 3, CurrentContentSHA256: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", CurrentUpdatedAt: updatedAt,
	})
	response := httptest.NewRecorder()
	writeError(response, err)
	if response.Code != http.StatusConflict {
		t.Fatalf("status=%d body=%s", response.Code, response.Body.String())
	}
	var body httpresponse.ErrorResponse
	if decodeErr := json.Unmarshal(response.Body.Bytes(), &body); decodeErr != nil || body.Code != "knowledge.page_draft_revision_conflict" || body.Params["current_draft_revision"] != "7" || body.Params["current_updated_at"] != updatedAt.Format(time.RFC3339Nano) {
		t.Fatalf("body=%+v decodeErr=%v", body, decodeErr)
	}
}

func TestKnowledgeAuthorizationManifestProjectsEveryHTTPRouteAndHandler(t *testing.T) {
	projected, err := NewAdapter(adapterTestService{}, "runtime-a")
	if err != nil {
		t.Fatal(err)
	}
	actions, err := knowledgesdk.AuthorizationActions()
	if err != nil {
		t.Fatal(err)
	}
	if err = modulehttp.ValidateAuthorizationProjection(actions, adapterTestProvider{adapter: projected}); err != nil {
		t.Fatal(err)
	}
	routes := map[string]bool{}
	for _, route := range projected.Routes() {
		routes[route.Action.Key] = true
	}
	for _, key := range []string{knowledgesdk.ActionLibraryMembersSearch, knowledgesdk.ActionPrincipalsResolve, knowledgesdk.ActionPagesPublish, knowledgesdk.ActionDocumentsTransfer} {
		if !routes[key] {
			t.Fatalf("action %q was not projected", key)
		}
	}
}

func TestKnowledgeHTTPRoutesRejectUnknownAndRepeatedQueryParameters(t *testing.T) {
	projected, err := NewAdapter(adapterTestService{}, "runtime-a")
	if err != nil {
		t.Fatal(err)
	}
	for _, target := range []string{
		"/knowledge/principals?unexpected=value",
		"/knowledge/principals?query=a&query=b",
		"/knowledge/libraries/lib_a/members/search?limit=20&limit=30",
	} {
		request := httptest.NewRequest(http.MethodGet, target, nil)
		response := httptest.NewRecorder()
		projected.Handler().ServeHTTP(response, request)
		if response.Code != http.StatusBadRequest {
			t.Fatalf("%s status=%d body=%s", target, response.Code, response.Body.String())
		}
	}
}

func TestKnowledgeCollaborationEventsStreamsSSEAndClosesOnRevocation(t *testing.T) {
	service := &collaborationEventAdapterService{}
	projected, err := NewAdapter(service, "runtime-a")
	if err != nil {
		t.Fatal(err)
	}
	request := httptest.NewRequest(http.MethodGet, "/knowledge/libraries/lib_a/pages/page_a/collaboration/session_a/events", nil)
	request.Header.Set("Last-Event-ID", "6")
	identity := identitysdk.RequestIdentity{Principal: identitysdk.Principal{Known: true, WorkspaceID: "workspace-a", UserID: "alice"}}
	request = request.WithContext(identitysdk.WithRequestIdentity(request.Context(), identity))
	response := httptest.NewRecorder()
	projected.Handler().ServeHTTP(unwrapOnlyResponseWriter{ResponseWriter: response}, request)
	if response.Code != http.StatusOK || response.Header().Get("Content-Type") != "text/event-stream; charset=utf-8" || response.Header().Get("X-Accel-Buffering") != "no" || !response.Flushed {
		t.Fatalf("SSE headers/status invalid: status=%d headers=%v flushed=%v body=%s", response.Code, response.Header(), response.Flushed, response.Body.String())
	}
	body := response.Body.String()
	for _, want := range []string{"retry: 1000", "id: 7", "event: update", `"update_id":"update"`, "event: revoked", `"code":"knowledge.collaboration_session_revoked"`} {
		if !strings.Contains(body, want) {
			t.Fatalf("SSE body missing %q: %s", want, body)
		}
	}
	if len(service.inputs) != 2 || service.inputs[0].AfterClock != 6 || service.inputs[0].WaitMillis != 0 || service.inputs[1].AfterClock != 7 || service.inputs[1].WaitMillis != 15_000 {
		t.Fatalf("Last-Event-ID/wait contract lost: %+v", service.inputs)
	}
}
