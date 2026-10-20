package modulehttptransport

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/domainry/domainry-foundation/httpresponse"
	"github.com/domainry/domainry-foundation/modulehttp"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgecontract "github.com/domainry/domainry-knowledge-sdk/contract"
)

type adapterTestService struct{ knowledgecontract.Service }
type adapterTestProvider struct{ adapter modulehttp.Adapter }

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
