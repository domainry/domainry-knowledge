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

type applicationCardAdapterService struct {
	adapterTestService
	libraryID, pageID string
	input             knowledgesdk.KnowledgeApplicationCardResolve
}

func (service *applicationCardAdapterService) ResolveKnowledgeApplicationCard(_ context.Context, libraryID, pageID string, input knowledgesdk.KnowledgeApplicationCardResolve, _ knowledgesdk.Authority) (knowledgesdk.KnowledgeApplicationCard, error) {
	service.libraryID, service.pageID, service.input = libraryID, pageID, input
	return knowledgesdk.KnowledgeApplicationCard{Provider: input.Provider, Kind: input.Kind, ResourceID: input.ResourceID, Title: "当前应用条目"}, nil
}

type collaborationEventAdapterService struct {
	adapterTestService
	calls  int
	inputs []knowledgesdk.KnowledgeCollaborationEvents
}

type pageLiveEventAdapterService struct {
	adapterTestService
	calls  int
	inputs []knowledgesdk.KnowledgePageLiveEvents
}

type pageSearchEventAdapterService struct {
	adapterTestService
	calls  int
	inputs []knowledgesdk.KnowledgePageSearchEvents
}

type formAdapterService struct {
	adapterTestService
	submitLibraryID, submitPageID string
	submitInput                   knowledgesdk.KnowledgeFormSubmit
	listBefore                    string
	listLimit                     int
}

type pageNavigationAdapterService struct {
	adapterTestService
	setLibraryID, setPageID string
	setInput                knowledgesdk.KnowledgePagePersonalStateWrite
	viewInput               knowledgesdk.KnowledgePageViewRecord
	collectionKind          knowledgesdk.KnowledgePageCollectionKind
	collectionAfter         string
	collectionLimit         int
}

type pageMetadataAdapterService struct {
	adapterTestService
	getLibraryID, getPageID                 string
	setLibraryID, setPageID                 string
	setInput                                knowledgesdk.KnowledgePageMetadataWrite
	governanceLibraryID, governancePageID   string
	governanceInput                         knowledgesdk.KnowledgePageGovernanceWrite
	reviewLibraryID, reviewPageID           string
	reviewInput                             knowledgesdk.KnowledgePageGovernanceReview
	auditLibraryID, auditPageID, auditEvent string
	auditActorID, auditAfter                string
	auditLimit                              int
}

type pageReferenceAdapterService struct {
	adapterTestService
	libraryID, pageID string
	direction         knowledgesdk.KnowledgePageReferenceDirection
	after             string
	limit             int
}

type pageDiscoveryAdapterService struct {
	adapterTestService
	searchLibraryID, searchQuery string
	searchLimit                  int
	pageSearchLibraryID          string
	pageSearchInput              knowledgesdk.KnowledgePageSearchInput
	graphLibraryID, graphPageID  string
	graphDepth, graphLimit       int
}

type pageShareAdapterService struct {
	adapterTestService
	listLibraryID, listPageID, listAfter string
	listLimit                            int
	revokeLibraryID, revokePageID        string
	revokeShareID                        string
	revokeExpectedRevision               int64
}

func (service *pageShareAdapterService) KnowledgePageShares(_ context.Context, libraryID, pageID, after string, limit int, _ knowledgesdk.Authority) (knowledgesdk.KnowledgePageSharePage, error) {
	service.listLibraryID, service.listPageID, service.listAfter, service.listLimit = libraryID, pageID, after, limit
	return knowledgesdk.KnowledgePageSharePage{Items: []knowledgesdk.KnowledgePageShare{}, Complete: true}, nil
}

func (service *pageShareAdapterService) RevokeKnowledgePageShare(_ context.Context, libraryID, pageID, shareID string, expectedRevision int64, _ knowledgesdk.Authority) (knowledgesdk.KnowledgePageShare, error) {
	service.revokeLibraryID, service.revokePageID, service.revokeShareID, service.revokeExpectedRevision = libraryID, pageID, shareID, expectedRevision
	return knowledgesdk.KnowledgePageShare{ID: shareID, LibraryID: libraryID, PageID: pageID, State: knowledgesdk.KnowledgePageShareRevoked, Revision: expectedRevision + 1}, nil
}

func (service *pageDiscoveryAdapterService) SearchKnowledgePages(_ context.Context, libraryID string, input knowledgesdk.KnowledgePageSearchInput, _ knowledgesdk.Authority) (knowledgesdk.KnowledgePageSearchPage, error) {
	service.pageSearchLibraryID, service.pageSearchInput = libraryID, input
	return knowledgesdk.KnowledgePageSearchPage{Items: []knowledgesdk.KnowledgePageSearchHit{{LibraryID: libraryID, PageID: "page_a", Kind: knowledgesdk.KnowledgePageSearchKindPage, ContentType: knowledgesdk.KnowledgePageTypeDocument, Title: "运行手册", Path: []knowledgesdk.KnowledgePageBreadcrumb{}, Tags: []string{"产品"}, AuthorUserID: "alice", PublicationStatus: knowledgesdk.KnowledgePagePublicationPublished, IndexStatus: "ready", Location: knowledgesdk.KnowledgePageSearchLocation{Kind: knowledgesdk.KnowledgePageSearchMatchBlock, BlockID: "block-a"}}}}, nil
}

func (service *pageDiscoveryAdapterService) SearchKnowledgePageIdentities(_ context.Context, libraryID, search string, limit int, _ knowledgesdk.Authority) (knowledgesdk.KnowledgePageIdentityPage, error) {
	service.searchLibraryID, service.searchQuery, service.searchLimit = libraryID, search, limit
	return knowledgesdk.KnowledgePageIdentityPage{Items: []knowledgesdk.KnowledgePageIdentity{{PageID: "page_a", Title: "运行手册", Aliases: []string{"值班指南"}, ContentType: "document", Path: []knowledgesdk.KnowledgePageBreadcrumb{{PageID: "parent_a", Title: "产品"}, {PageID: "page_a", Title: "运行手册"}}}}}, nil
}

func (service *pageDiscoveryAdapterService) KnowledgePageRelationshipGraph(_ context.Context, libraryID, pageID string, depth, limit int, _ knowledgesdk.Authority) (knowledgesdk.KnowledgePageRelationshipGraph, error) {
	service.graphLibraryID, service.graphPageID, service.graphDepth, service.graphLimit = libraryID, pageID, depth, limit
	return knowledgesdk.KnowledgePageRelationshipGraph{CenterPageID: pageID, Nodes: []knowledgesdk.KnowledgePageRelationshipNode{}, Edges: []knowledgesdk.KnowledgePageRelationshipEdge{}}, nil
}

func (service *pageReferenceAdapterService) KnowledgePageReferences(_ context.Context, libraryID, pageID string, direction knowledgesdk.KnowledgePageReferenceDirection, after string, limit int, _ knowledgesdk.Authority) (knowledgesdk.KnowledgePageReferencePage, error) {
	service.libraryID, service.pageID, service.direction, service.after, service.limit = libraryID, pageID, direction, after, limit
	return knowledgesdk.KnowledgePageReferencePage{Direction: direction, Items: []knowledgesdk.KnowledgePageReferenceLink{}, Complete: true}, nil
}

func (service *pageMetadataAdapterService) KnowledgePageMetadata(_ context.Context, libraryID, pageID string, _ knowledgesdk.Authority) (knowledgesdk.KnowledgePageMetadata, error) {
	service.getLibraryID, service.getPageID = libraryID, pageID
	return knowledgesdk.KnowledgePageMetadata{LibraryID: libraryID, PageID: pageID, Aliases: []string{"值班指南"}, RelatedPageIDs: []string{"page_b"}, Tags: []string{"产品"}, Status: knowledgesdk.KnowledgePageStatusVerified, Properties: []knowledgesdk.KnowledgePageCustomProperty{}, Revision: 3}, nil
}

func (service *pageMetadataAdapterService) SetKnowledgePageMetadata(_ context.Context, libraryID, pageID string, input knowledgesdk.KnowledgePageMetadataWrite, _ knowledgesdk.Authority) (knowledgesdk.KnowledgePageMetadata, error) {
	service.setLibraryID, service.setPageID, service.setInput = libraryID, pageID, input
	return knowledgesdk.KnowledgePageMetadata{LibraryID: libraryID, PageID: pageID, Aliases: input.Aliases, RelatedPageIDs: input.RelatedPageIDs, Tags: input.Tags, Status: input.Status, Properties: input.Properties, Revision: input.ExpectedRevision + 1}, nil
}

func (service *pageMetadataAdapterService) SetKnowledgePageGovernance(_ context.Context, libraryID, pageID string, input knowledgesdk.KnowledgePageGovernanceWrite, _ knowledgesdk.Authority) (knowledgesdk.KnowledgePageMetadata, error) {
	service.governanceLibraryID, service.governancePageID, service.governanceInput = libraryID, pageID, input
	nextReviewAt := input.NextReviewAt
	return knowledgesdk.KnowledgePageMetadata{LibraryID: libraryID, PageID: pageID, OwnerUserID: input.OwnerUserID, ContentAdminUserIDs: input.ContentAdminUserIDs, ArchiveRetentionDays: input.ArchiveRetentionDays, ReviewIntervalDays: input.ReviewIntervalDays, NextReviewAt: &nextReviewAt, Revision: input.ExpectedRevision + 1}, nil
}

func (service *pageMetadataAdapterService) ReviewKnowledgePageGovernance(_ context.Context, libraryID, pageID string, input knowledgesdk.KnowledgePageGovernanceReview, _ knowledgesdk.Authority) (knowledgesdk.KnowledgePageMetadata, error) {
	service.reviewLibraryID, service.reviewPageID, service.reviewInput = libraryID, pageID, input
	return knowledgesdk.KnowledgePageMetadata{LibraryID: libraryID, PageID: pageID, LastReviewedByUserID: "alice", Revision: input.ExpectedRevision + 1}, nil
}

func (service *pageMetadataAdapterService) KnowledgePageGovernanceAudit(_ context.Context, input knowledgesdk.KnowledgeGovernanceAuditQuery, _ knowledgesdk.Authority) (knowledgesdk.KnowledgeGovernanceAuditPage, error) {
	service.auditLibraryID, service.auditPageID, service.auditEvent = input.LibraryID, input.PageID, input.Event
	service.auditActorID, service.auditAfter, service.auditLimit = input.ActorID, input.After, input.Limit
	return knowledgesdk.KnowledgeGovernanceAuditPage{Items: []knowledgesdk.KnowledgeGovernanceEvent{{ID: "audit-a", Family: knowledgesdk.KnowledgeAuditEventFamily, Type: input.Event, LibraryID: input.LibraryID, PageID: input.PageID}}, Complete: true}, nil
}

func (service *pageNavigationAdapterService) SetKnowledgePagePersonalState(_ context.Context, libraryID, pageID string, input knowledgesdk.KnowledgePagePersonalStateWrite, _ knowledgesdk.Authority) (knowledgesdk.KnowledgePagePersonalState, error) {
	service.setLibraryID, service.setPageID, service.setInput = libraryID, pageID, input
	return knowledgesdk.KnowledgePagePersonalState{LibraryID: libraryID, PageID: pageID, UserID: "alice", Favorite: input.Favorite, Subscribed: input.Subscribed, ShortcutRank: input.ShortcutRank, Revision: input.ExpectedRevision + 1}, nil
}

func (service *pageNavigationAdapterService) RecordKnowledgePageView(_ context.Context, libraryID, pageID string, input knowledgesdk.KnowledgePageViewRecord, _ knowledgesdk.Authority) (knowledgesdk.KnowledgePagePersonalState, error) {
	service.setLibraryID, service.setPageID, service.viewInput = libraryID, pageID, input
	return knowledgesdk.KnowledgePagePersonalState{LibraryID: libraryID, PageID: pageID, UserID: "alice"}, nil
}

func (service *pageNavigationAdapterService) KnowledgePageCollection(_ context.Context, _ string, kind knowledgesdk.KnowledgePageCollectionKind, after string, limit int, _ knowledgesdk.Authority) (knowledgesdk.KnowledgePageCollectionPage, error) {
	service.collectionKind, service.collectionAfter, service.collectionLimit = kind, after, limit
	return knowledgesdk.KnowledgePageCollectionPage{Items: []knowledgesdk.KnowledgePageCollectionItem{}, Complete: true}, nil
}

func (service *formAdapterService) SubmitKnowledgePageForm(_ context.Context, libraryID, pageID string, input knowledgesdk.KnowledgeFormSubmit, _ knowledgesdk.Authority) (knowledgesdk.KnowledgeFormSubmission, error) {
	service.submitLibraryID, service.submitPageID, service.submitInput = libraryID, pageID, input
	return knowledgesdk.KnowledgeFormSubmission{ID: "kformsub_" + strings.Repeat("a", 32), LibraryID: libraryID, PageID: pageID, PublishedVersion: 2, Answers: input.Answers}, nil
}

func (service *formAdapterService) KnowledgePageFormSubmissions(_ context.Context, _, _ string, before string, limit int, _ knowledgesdk.Authority) (knowledgesdk.KnowledgeFormSubmissionPage, error) {
	service.listBefore, service.listLimit = before, limit
	return knowledgesdk.KnowledgeFormSubmissionPage{Items: []knowledgesdk.KnowledgeFormSubmission{}, Complete: true}, nil
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

func (service *pageLiveEventAdapterService) KnowledgePageLiveEvents(_ context.Context, _, pageID string, input knowledgesdk.KnowledgePageLiveEvents, _ knowledgesdk.Authority) (knowledgesdk.KnowledgePageLiveEventBatch, error) {
	service.calls++
	service.inputs = append(service.inputs, input)
	if service.calls > 1 {
		return knowledgesdk.KnowledgePageLiveEventBatch{}, &knowledgesdk.Error{Class: "not_found", Code: "knowledge.page_not_found"}
	}
	return knowledgesdk.KnowledgePageLiveEventBatch{PageID: pageID, Revision: 8, Events: []knowledgesdk.KnowledgePageLiveEvent{{Type: knowledgesdk.KnowledgePageLiveEventChanged, PageID: pageID, Revision: 8}}}, nil
}

func (service *pageSearchEventAdapterService) KnowledgePageSearchEvents(_ context.Context, _ string, input knowledgesdk.KnowledgePageSearchEvents, _ knowledgesdk.Authority) (knowledgesdk.KnowledgePageSearchEventBatch, error) {
	service.calls++
	service.inputs = append(service.inputs, input)
	if service.calls > 1 {
		return knowledgesdk.KnowledgePageSearchEventBatch{}, &knowledgesdk.Error{Class: "not_found", Code: "knowledge.library_not_found"}
	}
	return knowledgesdk.KnowledgePageSearchEventBatch{Revision: 9, Events: []knowledgesdk.KnowledgePageSearchEvent{{Type: knowledgesdk.KnowledgePageSearchEventChanged, Revision: 9}}}, nil
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
	for _, key := range []string{knowledgesdk.ActionLibraryMembersSearch, knowledgesdk.ActionPrincipalsResolve, knowledgesdk.ActionPagesPublish, knowledgesdk.ActionPageReferencesList, knowledgesdk.ActionPageMetadataGet, knowledgesdk.ActionPageMetadataSet, knowledgesdk.ActionPageSearch, knowledgesdk.ActionPageSearchEvents, knowledgesdk.ActionPageIdentitiesSearch, knowledgesdk.ActionPageRelationshipGraphGet, knowledgesdk.ActionPageFormSubmit, knowledgesdk.ActionPageFormResponsesList, knowledgesdk.ActionPageFormAnalyticsGet, knowledgesdk.ActionPageFormResponsesExport, knowledgesdk.ActionDocumentsTransfer} {
		if !routes[key] {
			t.Fatalf("action %q was not projected", key)
		}
	}
}

func TestKnowledgeOpenAPIHTTPRouteRequiresIdentityAndReturnsExactActionProjection(t *testing.T) {
	projected, err := NewAdapter(adapterTestService{}, "runtime-a")
	if err != nil {
		t.Fatal(err)
	}
	request := httptest.NewRequest(http.MethodGet, "/knowledge/openapi.json", nil)
	response := httptest.NewRecorder()
	projected.Handler().ServeHTTP(response, request)
	if response.Code != http.StatusForbidden {
		t.Fatalf("anonymous status=%d body=%s", response.Code, response.Body.String())
	}

	identity := identitysdk.RequestIdentity{Principal: identitysdk.Principal{Known: true, WorkspaceID: "workspace-a", UserID: "alice"}}
	request = httptest.NewRequest(http.MethodGet, "/knowledge/openapi.json", nil)
	request = request.WithContext(identitysdk.WithRequestIdentity(request.Context(), identity))
	response = httptest.NewRecorder()
	projected.Handler().ServeHTTP(response, request)
	if response.Code != http.StatusOK || !strings.Contains(response.Body.String(), `"x-domainry-action":"knowledge.page_search.search"`) || !strings.Contains(response.Body.String(), `"applicationServiceBearer"`) {
		t.Fatalf("authorized status=%d body=%s", response.Code, response.Body.String())
	}
}

func TestKnowledgeApplicationCardHTTPRouteUsesTypedAuthorizedService(t *testing.T) {
	service := &applicationCardAdapterService{}
	projected, err := NewAdapter(service, "runtime-a")
	if err != nil {
		t.Fatal(err)
	}
	identity := identitysdk.RequestIdentity{Principal: identitysdk.Principal{Known: true, WorkspaceID: "workspace-a", UserID: "alice"}}
	request := httptest.NewRequest(http.MethodPost, "/knowledge/libraries/klib_a/pages/kpage_a/application-cards/resolve", strings.NewReader(`{"provider":"jira","kind":"jira","resource_id":"PROJ-42"}`))
	request.Header.Set("Content-Type", "application/json")
	request = request.WithContext(identitysdk.WithRequestIdentity(request.Context(), identity))
	response := httptest.NewRecorder()
	projected.Handler().ServeHTTP(response, request)
	if response.Code != http.StatusOK || service.libraryID != "klib_a" || service.pageID != "kpage_a" || service.input.Provider != "jira" || service.input.Kind != knowledgesdk.KnowledgeApplicationCardJira || service.input.ResourceID != "PROJ-42" || !strings.Contains(response.Body.String(), `"title":"当前应用条目"`) {
		t.Fatalf("status=%d service=%+v body=%s", response.Code, service, response.Body.String())
	}
}

func TestKnowledgePageReferencesHTTPRouteDecodesDirectionAndCursor(t *testing.T) {
	service := &pageReferenceAdapterService{}
	projected, err := NewAdapter(service, "runtime-a")
	if err != nil {
		t.Fatal(err)
	}
	identity := identitysdk.RequestIdentity{Principal: identitysdk.Principal{Known: true, WorkspaceID: "workspace-a", UserID: "alice"}}
	request := httptest.NewRequest(http.MethodGet, "/knowledge/libraries/lib_a/pages/page_a/references?direction=incoming&after=cursor-a&limit=12", nil)
	request = request.WithContext(identitysdk.WithRequestIdentity(request.Context(), identity))
	response := httptest.NewRecorder()
	projected.Handler().ServeHTTP(response, request)
	if response.Code != http.StatusOK || service.libraryID != "lib_a" || service.pageID != "page_a" || service.direction != knowledgesdk.KnowledgePageReferenceIncoming || service.after != "cursor-a" || service.limit != 12 {
		t.Fatalf("reference list route mismatch: status=%d service=%+v body=%s", response.Code, service, response.Body.String())
	}
}

func TestKnowledgePageShareHTTPRoutesDecodePaginationAndRevokeBody(t *testing.T) {
	service := &pageShareAdapterService{}
	projected, err := NewAdapter(service, "runtime-a")
	if err != nil {
		t.Fatal(err)
	}
	identity := identitysdk.RequestIdentity{Principal: identitysdk.Principal{Known: true, WorkspaceID: "workspace-a", UserID: "alice"}}

	request := httptest.NewRequest(http.MethodGet, "/knowledge/libraries/lib_a/pages/page_a/shares?after=share-cursor&limit=100", nil)
	request = request.WithContext(identitysdk.WithRequestIdentity(request.Context(), identity))
	response := httptest.NewRecorder()
	projected.Handler().ServeHTTP(response, request)
	if response.Code != http.StatusOK || service.listLibraryID != "lib_a" || service.listPageID != "page_a" || service.listAfter != "share-cursor" || service.listLimit != 100 {
		t.Fatalf("share list route mismatch: status=%d service=%+v body=%s", response.Code, service, response.Body.String())
	}

	request = httptest.NewRequest(http.MethodPost, "/knowledge/libraries/lib_a/pages/page_a/shares/share_a/revoke", strings.NewReader(`{"expected_revision":7}`))
	request.Header.Set("Content-Type", "application/json")
	request = request.WithContext(identitysdk.WithRequestIdentity(request.Context(), identity))
	response = httptest.NewRecorder()
	projected.Handler().ServeHTTP(response, request)
	if response.Code != http.StatusOK || service.revokeLibraryID != "lib_a" || service.revokePageID != "page_a" || service.revokeShareID != "share_a" || service.revokeExpectedRevision != 7 {
		t.Fatalf("share revoke route mismatch: status=%d service=%+v body=%s", response.Code, service, response.Body.String())
	}
}

func TestKnowledgePageMetadataHTTPRoutesDecodeTypedProperties(t *testing.T) {
	service := &pageMetadataAdapterService{}
	projected, err := NewAdapter(service, "runtime-a")
	if err != nil {
		t.Fatal(err)
	}
	identity := identitysdk.RequestIdentity{Principal: identitysdk.Principal{Known: true, WorkspaceID: "workspace-a", UserID: "alice"}}

	request := httptest.NewRequest(http.MethodGet, "/knowledge/libraries/lib_a/pages/page_a/metadata", nil)
	request = request.WithContext(identitysdk.WithRequestIdentity(request.Context(), identity))
	response := httptest.NewRecorder()
	projected.Handler().ServeHTTP(response, request)
	if response.Code != http.StatusOK || service.getLibraryID != "lib_a" || service.getPageID != "page_a" || !strings.Contains(response.Body.String(), `"status":"verified"`) {
		t.Fatalf("metadata get route mismatch: status=%d service=%+v body=%s", response.Code, service, response.Body.String())
	}
	if strings.Contains(response.Body.String(), `"next_review_at"`) || strings.Contains(response.Body.String(), `"updated_at"`) {
		t.Fatalf("empty metadata timestamps must be omitted instead of serializing Go's zero time: body=%s", response.Body.String())
	}

	request = httptest.NewRequest(http.MethodPut, "/knowledge/libraries/lib_a/pages/page_a/metadata", strings.NewReader(`{"client_id":"metadata-1","expected_revision":3,"aliases":["值班指南"],"related_page_ids":["page_b"],"tags":["产品"],"status":"in_review","properties":[{"id":"prop_score","name":"质量分","type":"number","value":"98.5"}]}`))
	request.Header.Set("Content-Type", "application/json")
	request = request.WithContext(identitysdk.WithRequestIdentity(request.Context(), identity))
	response = httptest.NewRecorder()
	projected.Handler().ServeHTTP(response, request)
	if response.Code != http.StatusOK || service.setLibraryID != "lib_a" || service.setPageID != "page_a" || service.setInput.ClientID != "metadata-1" || service.setInput.ExpectedRevision != 3 || len(service.setInput.Aliases) != 1 || service.setInput.Aliases[0] != "值班指南" || len(service.setInput.RelatedPageIDs) != 1 || service.setInput.RelatedPageIDs[0] != "page_b" || service.setInput.Status != knowledgesdk.KnowledgePageStatusInReview || len(service.setInput.Properties) != 1 || service.setInput.Properties[0].Type != knowledgesdk.KnowledgePagePropertyNumber {
		t.Fatalf("metadata put route mismatch: status=%d service=%+v body=%s", response.Code, service, response.Body.String())
	}

	request = httptest.NewRequest(http.MethodPut, "/knowledge/libraries/lib_a/pages/page_a/governance", strings.NewReader(`{"client_id":"governance-1","expected_revision":4,"owner_user_id":"bob","content_admin_user_ids":["carol"],"archive_retention_days":730,"review_interval_days":90,"next_review_at":"2026-12-03T00:37:00Z"}`))
	request.Header.Set("Content-Type", "application/json")
	request = request.WithContext(identitysdk.WithRequestIdentity(request.Context(), identity))
	response = httptest.NewRecorder()
	projected.Handler().ServeHTTP(response, request)
	if response.Code != http.StatusOK || service.governanceLibraryID != "lib_a" || service.governancePageID != "page_a" || service.governanceInput.ClientID != "governance-1" || service.governanceInput.ExpectedRevision != 4 || service.governanceInput.OwnerUserID != "bob" || len(service.governanceInput.ContentAdminUserIDs) != 1 || service.governanceInput.ContentAdminUserIDs[0] != "carol" || service.governanceInput.ArchiveRetentionDays != 730 || service.governanceInput.ReviewIntervalDays != 90 || service.governanceInput.NextReviewAt.IsZero() {
		t.Fatalf("governance put route mismatch: status=%d service=%+v body=%s", response.Code, service, response.Body.String())
	}

	request = httptest.NewRequest(http.MethodPost, "/knowledge/libraries/lib_a/pages/page_a/governance/review", strings.NewReader(`{"client_id":"review-1","expected_revision":5}`))
	request.Header.Set("Content-Type", "application/json")
	request = request.WithContext(identitysdk.WithRequestIdentity(request.Context(), identity))
	response = httptest.NewRecorder()
	projected.Handler().ServeHTTP(response, request)
	if response.Code != http.StatusOK || service.reviewLibraryID != "lib_a" || service.reviewPageID != "page_a" || service.reviewInput.ClientID != "review-1" || service.reviewInput.ExpectedRevision != 5 {
		t.Fatalf("governance review route mismatch: status=%d service=%+v body=%s", response.Code, service, response.Body.String())
	}

	request = httptest.NewRequest(http.MethodGet, "/knowledge/libraries/lib_a/pages/page_a/governance/audit?event=knowledge.page.governance_set&actor_id=bob&after=audit-cursor&limit=27", nil)
	request = request.WithContext(identitysdk.WithRequestIdentity(request.Context(), identity))
	response = httptest.NewRecorder()
	projected.Handler().ServeHTTP(response, request)
	if response.Code != http.StatusOK || service.auditLibraryID != "lib_a" || service.auditPageID != "page_a" || service.auditEvent != "knowledge.page.governance_set" || service.auditActorID != "bob" || service.auditAfter != "audit-cursor" || service.auditLimit != 27 || !strings.Contains(response.Body.String(), `"family":"knowledge.collaboration"`) {
		t.Fatalf("governance audit route mismatch: status=%d service=%+v body=%s", response.Code, service, response.Body.String())
	}
}

func TestKnowledgePageDiscoveryHTTPRoutesDecodeSearchAndGraphBounds(t *testing.T) {
	service := &pageDiscoveryAdapterService{}
	projected, err := NewAdapter(service, "runtime-a")
	if err != nil {
		t.Fatal(err)
	}
	identity := identitysdk.RequestIdentity{Principal: identitysdk.Principal{Known: true, WorkspaceID: "workspace-a", UserID: "alice"}}

	request := httptest.NewRequest(http.MethodPost, "/knowledge/libraries/lib_a/page-search", strings.NewReader(`{"query":"发布流程","content_types":["document"],"author_user_ids":["alice"],"tags":["产品"],"path_query":"产品 / 手册","ancestor_page_id":"page_parent","publication_statuses":["published"],"limit":31}`))
	request.Header.Set("Content-Type", "application/json")
	request = request.WithContext(identitysdk.WithRequestIdentity(request.Context(), identity))
	response := httptest.NewRecorder()
	projected.Handler().ServeHTTP(response, request)
	if response.Code != http.StatusOK || service.pageSearchLibraryID != "lib_a" || service.pageSearchInput.Query != "发布流程" || service.pageSearchInput.Limit != 31 || len(service.pageSearchInput.ContentTypes) != 1 || service.pageSearchInput.AncestorPageID != "page_parent" || !strings.Contains(response.Body.String(), `"block_id":"block-a"`) {
		t.Fatalf("page search route mismatch: status=%d service=%+v body=%s", response.Code, service, response.Body.String())
	}

	request = httptest.NewRequest(http.MethodGet, "/knowledge/libraries/lib_a/page-identities?query=%E5%80%BC%E7%8F%AD&limit=17", nil)
	request = request.WithContext(identitysdk.WithRequestIdentity(request.Context(), identity))
	response = httptest.NewRecorder()
	projected.Handler().ServeHTTP(response, request)
	if response.Code != http.StatusOK || service.searchLibraryID != "lib_a" || service.searchQuery != "值班" || service.searchLimit != 17 || !strings.Contains(response.Body.String(), `"aliases":["值班指南"]`) || !strings.Contains(response.Body.String(), `"path":[`) {
		t.Fatalf("page identity search route mismatch: status=%d service=%+v body=%s", response.Code, service, response.Body.String())
	}

	request = httptest.NewRequest(http.MethodGet, "/knowledge/libraries/lib_a/pages/page_a/relationship-graph?depth=3&limit=120", nil)
	request = request.WithContext(identitysdk.WithRequestIdentity(request.Context(), identity))
	response = httptest.NewRecorder()
	projected.Handler().ServeHTTP(response, request)
	if response.Code != http.StatusOK || service.graphLibraryID != "lib_a" || service.graphPageID != "page_a" || service.graphDepth != 3 || service.graphLimit != 120 || !strings.Contains(response.Body.String(), `"center_page_id":"page_a"`) {
		t.Fatalf("page relationship graph route mismatch: status=%d service=%+v body=%s", response.Code, service, response.Body.String())
	}
}

func TestKnowledgeFormHTTPRoutesDecodeSubmissionAndPagination(t *testing.T) {
	service := &formAdapterService{}
	projected, err := NewAdapter(service, "runtime-a")
	if err != nil {
		t.Fatal(err)
	}
	identity := identitysdk.RequestIdentity{Principal: identitysdk.Principal{Known: true, WorkspaceID: "workspace-a", UserID: "alice"}}
	request := httptest.NewRequest(http.MethodPost, "/knowledge/libraries/lib_a/pages/page_a/form/submissions", strings.NewReader(`{"client_id":"submit-1","answers":{"name":"Alice","count":2}}`))
	request.Header.Set("Content-Type", "application/json")
	request = request.WithContext(identitysdk.WithRequestIdentity(request.Context(), identity))
	response := httptest.NewRecorder()
	projected.Handler().ServeHTTP(response, request)
	if response.Code != http.StatusCreated || service.submitLibraryID != "lib_a" || service.submitPageID != "page_a" || service.submitInput.ClientID != "submit-1" || string(service.submitInput.Answers["name"]) != `"Alice"` {
		t.Fatalf("form submission route mismatch: status=%d service=%+v body=%s", response.Code, service, response.Body.String())
	}

	request = httptest.NewRequest(http.MethodGet, "/knowledge/libraries/lib_a/pages/page_a/form/submissions?before=123:kformsub_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa&limit=25", nil)
	request = request.WithContext(identitysdk.WithRequestIdentity(request.Context(), identity))
	response = httptest.NewRecorder()
	projected.Handler().ServeHTTP(response, request)
	if response.Code != http.StatusOK || service.listBefore != "123:kformsub_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" || service.listLimit != 25 {
		t.Fatalf("form response pagination route mismatch: status=%d before=%q limit=%d body=%s", response.Code, service.listBefore, service.listLimit, response.Body.String())
	}
}

func TestKnowledgePageNavigationHTTPRoutesDecodePrivateStateAndCollections(t *testing.T) {
	service := &pageNavigationAdapterService{}
	projected, err := NewAdapter(service, "runtime-a")
	if err != nil {
		t.Fatal(err)
	}
	identity := identitysdk.RequestIdentity{Principal: identitysdk.Principal{Known: true, WorkspaceID: "workspace-a", UserID: "alice"}}

	request := httptest.NewRequest(http.MethodPut, "/knowledge/libraries/lib_a/pages/page_a/personal-state", strings.NewReader(`{"client_id":"state-1","expected_revision":2,"favorite":true,"subscribed":true,"shortcut_rank":"a0"}`))
	request.Header.Set("Content-Type", "application/json")
	request = request.WithContext(identitysdk.WithRequestIdentity(request.Context(), identity))
	response := httptest.NewRecorder()
	projected.Handler().ServeHTTP(response, request)
	if response.Code != http.StatusOK || service.setLibraryID != "lib_a" || service.setPageID != "page_a" || service.setInput.ClientID != "state-1" || service.setInput.ExpectedRevision != 2 || !service.setInput.Favorite || !service.setInput.Subscribed || service.setInput.ShortcutRank != "a0" {
		t.Fatalf("personal-state route mismatch: status=%d service=%+v body=%s", response.Code, service, response.Body.String())
	}

	request = httptest.NewRequest(http.MethodPost, "/knowledge/libraries/lib_a/pages/page_a/view", strings.NewReader(`{"client_id":"view-1"}`))
	request.Header.Set("Content-Type", "application/json")
	request = request.WithContext(identitysdk.WithRequestIdentity(request.Context(), identity))
	response = httptest.NewRecorder()
	projected.Handler().ServeHTTP(response, request)
	if response.Code != http.StatusOK || service.viewInput.ClientID != "view-1" {
		t.Fatalf("page-view route mismatch: status=%d input=%+v body=%s", response.Code, service.viewInput, response.Body.String())
	}

	request = httptest.NewRequest(http.MethodGet, "/knowledge/libraries/lib_a/page-collections?kind=recent_views&after=kpage_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa&limit=25", nil)
	request = request.WithContext(identitysdk.WithRequestIdentity(request.Context(), identity))
	response = httptest.NewRecorder()
	projected.Handler().ServeHTTP(response, request)
	if response.Code != http.StatusOK || service.collectionKind != knowledgesdk.KnowledgePageCollectionRecentViews || service.collectionAfter != "kpage_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" || service.collectionLimit != 25 {
		t.Fatalf("page-collection route mismatch: status=%d kind=%q after=%q limit=%d body=%s", response.Code, service.collectionKind, service.collectionAfter, service.collectionLimit, response.Body.String())
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
		"/knowledge/libraries/lib_a/page-collections?kind=favorites&kind=trash",
		"/knowledge/libraries/lib_a/page-identities?query=a&query=b",
		"/knowledge/libraries/lib_a/pages/page_a/relationship-graph?depth=1&depth=2",
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
	request.Header.Set("X-Knowledge-Collaboration-Attempt", "3")
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
	if len(service.inputs) != 2 || service.inputs[0].AfterClock != 6 || service.inputs[0].WaitMillis != 0 || service.inputs[0].ConnectionAttempt != 3 || service.inputs[1].AfterClock != 7 || service.inputs[1].WaitMillis != 15_000 || service.inputs[1].ConnectionAttempt != 0 {
		t.Fatalf("Last-Event-ID/wait contract lost: %+v", service.inputs)
	}
}

func TestKnowledgePageLiveEventsStreamOnlySignalsAndCloseOnRevocation(t *testing.T) {
	service := &pageLiveEventAdapterService{}
	projected, err := NewAdapter(service, "runtime-a")
	if err != nil {
		t.Fatal(err)
	}
	request := httptest.NewRequest(http.MethodGet, "/knowledge/libraries/lib_a/pages/page_a/live-events", nil)
	request.Header.Set("Last-Event-ID", "7")
	identity := identitysdk.RequestIdentity{Principal: identitysdk.Principal{Known: true, WorkspaceID: "workspace-a", UserID: "alice"}}
	request = request.WithContext(identitysdk.WithRequestIdentity(request.Context(), identity))
	response := httptest.NewRecorder()
	projected.Handler().ServeHTTP(unwrapOnlyResponseWriter{ResponseWriter: response}, request)
	if response.Code != http.StatusOK || response.Header().Get("Content-Type") != "text/event-stream; charset=utf-8" || response.Header().Get("X-Accel-Buffering") != "no" || !response.Flushed {
		t.Fatalf("page live SSE headers/status invalid: status=%d headers=%v flushed=%v body=%s", response.Code, response.Header(), response.Flushed, response.Body.String())
	}
	body := response.Body.String()
	for _, want := range []string{"retry: 1000", "id: 8", "event: changed", `"page_id":"page_a"`, "event: revoked", `"code":"knowledge.page_not_found"`} {
		if !strings.Contains(body, want) {
			t.Fatalf("page live SSE body missing %q: %s", want, body)
		}
	}
	for _, forbidden := range []string{"snapshot", "presence", "content"} {
		if strings.Contains(body, forbidden) {
			t.Fatalf("page live SSE leaked %q: %s", forbidden, body)
		}
	}
	if len(service.inputs) != 2 || service.inputs[0].AfterRevision != 7 || service.inputs[0].WaitMillis != 0 || service.inputs[1].AfterRevision != 8 || service.inputs[1].WaitMillis != 15_000 {
		t.Fatalf("page live Last-Event-ID/wait contract lost: %+v", service.inputs)
	}
}

func TestKnowledgePageSearchEventsStreamOnlyInvalidationSignalsAndCloseOnRevocation(t *testing.T) {
	service := &pageSearchEventAdapterService{}
	projected, err := NewAdapter(service, "runtime-a")
	if err != nil {
		t.Fatal(err)
	}
	request := httptest.NewRequest(http.MethodGet, "/knowledge/libraries/lib_a/page-search/events", nil)
	request.Header.Set("Last-Event-ID", "8")
	identity := identitysdk.RequestIdentity{Principal: identitysdk.Principal{Known: true, WorkspaceID: "workspace-a", UserID: "alice"}}
	request = request.WithContext(identitysdk.WithRequestIdentity(request.Context(), identity))
	response := httptest.NewRecorder()
	projected.Handler().ServeHTTP(unwrapOnlyResponseWriter{ResponseWriter: response}, request)
	if response.Code != http.StatusOK || response.Header().Get("Content-Type") != "text/event-stream; charset=utf-8" || response.Header().Get("X-Accel-Buffering") != "no" || !response.Flushed {
		t.Fatalf("page search SSE headers/status invalid: status=%d headers=%v flushed=%v body=%s", response.Code, response.Header(), response.Flushed, response.Body.String())
	}
	body := response.Body.String()
	for _, want := range []string{"retry: 1000", "id: 9", "event: changed", `"revision":9`, "event: revoked", `"code":"knowledge.library_not_found"`} {
		if !strings.Contains(body, want) {
			t.Fatalf("page search SSE body missing %q: %s", want, body)
		}
	}
	for _, forbidden := range []string{"title", "excerpt", "content", "path"} {
		if strings.Contains(body, forbidden) {
			t.Fatalf("page search SSE leaked %q: %s", forbidden, body)
		}
	}
	if len(service.inputs) != 2 || service.inputs[0].AfterRevision != 8 || service.inputs[0].WaitMillis != 0 || service.inputs[1].AfterRevision != 9 || service.inputs[1].WaitMillis != 15_000 {
		t.Fatalf("page search Last-Event-ID/wait contract lost: %+v", service.inputs)
	}
}
