package modulehttptransport

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"mime"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/domainry/domainry-foundation/httpresponse"
	"github.com/domainry/domainry-foundation/modulehttp"
	identitysdk "github.com/domainry/domainry-identity-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgecontract "github.com/domainry/domainry-knowledge-sdk/contract"
)

const maxJSONBodyBytes = 2 << 20
const documentTransferTimeout = 30 * time.Minute

type adapter struct {
	service   knowledgecontract.Service
	runtimeID string
	mux       *http.ServeMux
	routes    []modulehttp.Route
}

func (*adapter) ContractVersion() string { return modulehttp.ContractVersion }
func (*adapter) Owner() string           { return "knowledge" }
func (*adapter) Name() string            { return "knowledge_product" }
func (a *adapter) Handler() http.Handler { return a.mux }
func (a *adapter) Routes() []modulehttp.Route {
	return append([]modulehttp.Route(nil), a.routes...)
}

func NewAdapter(service knowledgecontract.Service, runtimeID string) (modulehttp.Adapter, error) {
	if service == nil || strings.TrimSpace(runtimeID) == "" {
		return nil, fmt.Errorf("Knowledge HTTP adapter dependencies are incomplete")
	}
	a := &adapter{service: service, runtimeID: runtimeID, mux: http.NewServeMux()}
	handlers := a.handlers()
	actions, err := knowledgesdk.AuthorizationActions()
	if err != nil {
		return nil, err
	}
	for _, action := range actions {
		if action.HTTP == nil {
			continue
		}
		handler, found := handlers[action.Key]
		if !found {
			return nil, fmt.Errorf("Knowledge Action %q has no HTTP handler", action.Key)
		}
		route, err := modulehttp.RouteFromAction(action)
		if err != nil {
			return nil, fmt.Errorf("project Knowledge Action %q: %w", action.Key, err)
		}
		a.routes = append(a.routes, route)
		a.mux.HandleFunc(route.Pattern(), strictQuery(handler, actionQueryKeys(action.Key)...))
		delete(handlers, action.Key)
	}
	if len(handlers) != 0 {
		keys := make([]string, 0, len(handlers))
		for key := range handlers {
			keys = append(keys, key)
		}
		sort.Strings(keys)
		return nil, fmt.Errorf("Knowledge HTTP handlers have no Action route entries: %s", strings.Join(keys, ", "))
	}
	return a, nil
}

func actionQueryKeys(action string) []string {
	switch action {
	case knowledgesdk.ActionLibrariesList, knowledgesdk.ActionLibraryMembersList, knowledgesdk.ActionLibraryOrganizationMembersList, knowledgesdk.ActionDocumentsList, knowledgesdk.ActionSourcesList, knowledgesdk.ActionPageTemplatesList, knowledgesdk.ActionPageSharesList:
		return []string{"after", "limit"}
	case knowledgesdk.ActionLibraryMembersSearch:
		return []string{"query", "after", "limit"}
	case knowledgesdk.ActionPagesList:
		return []string{"parent_page_id", "after", "limit", "include_archived"}
	case knowledgesdk.ActionPageReferencesList:
		return []string{"direction", "after", "limit"}
	case knowledgesdk.ActionPageIdentitiesSearch:
		return []string{"query", "limit"}
	case knowledgesdk.ActionPageRelationshipGraphGet:
		return []string{"depth", "limit"}
	case knowledgesdk.ActionPageCollectionsList:
		return []string{"kind", "after", "limit"}
	case knowledgesdk.ActionPagesGet:
		return []string{"draft"}
	case knowledgesdk.ActionPageVersionsList, knowledgesdk.ActionPageEditHistoryList, knowledgesdk.ActionPageTemplateVersionsList, knowledgesdk.ActionPageFormResponsesList:
		return []string{"before", "limit"}
	case knowledgesdk.ActionPageCommentsList:
		return []string{"after", "limit", "unresolved"}
	case knowledgesdk.ActionDocumentsUpload:
		return []string{"client_id", "filename"}
	case knowledgesdk.ActionLibraryMembersRemove, knowledgesdk.ActionLibraryOrganizationMembersRemove, knowledgesdk.ActionDocumentsRetry, knowledgesdk.ActionDocumentsReindex, knowledgesdk.ActionDocumentsDelete:
		return []string{"expected_revision"}
	case knowledgesdk.ActionPrincipalsSearch:
		return []string{"query", "after", "limit"}
	case knowledgesdk.ActionPageGovernanceAuditList:
		return []string{"event", "actor_id", "after", "limit"}
	default:
		return nil
	}
}

func strictQuery(next http.HandlerFunc, keys ...string) http.HandlerFunc {
	allowed := make(map[string]struct{}, len(keys))
	for _, key := range keys {
		allowed[key] = struct{}{}
	}
	return func(response http.ResponseWriter, request *http.Request) {
		for key, values := range request.URL.Query() {
			if _, ok := allowed[key]; !ok || len(values) != 1 {
				writeCode(response, http.StatusBadRequest, "knowledge.query_invalid")
				return
			}
		}
		next(response, request)
	}
}

func (a *adapter) handlers() map[string]http.HandlerFunc {
	return map[string]http.HandlerFunc{
		knowledgesdk.ActionOpenAPIGet:                       a.getOpenAPI,
		knowledgesdk.ActionLibrariesList:                    a.listLibraries,
		knowledgesdk.ActionLibrariesCreate:                  a.createLibrary,
		knowledgesdk.ActionLibrariesGet:                     a.getLibrary,
		knowledgesdk.ActionLibrariesUpdate:                  a.updateLibrary,
		knowledgesdk.ActionLibrariesArchive:                 a.archiveLibrary,
		knowledgesdk.ActionLibrariesRestore:                 a.restoreLibrary,
		knowledgesdk.ActionLibraryMembersList:               a.listMembers,
		knowledgesdk.ActionLibraryMembersSearch:             a.searchLibraryMembers,
		knowledgesdk.ActionLibraryMembersSet:                a.setMember,
		knowledgesdk.ActionLibraryMembersRemove:             a.removeMember,
		knowledgesdk.ActionLibraryOrganizationMembersList:   a.listOrganizationMembers,
		knowledgesdk.ActionLibraryOrganizationMembersSet:    a.setOrganizationMember,
		knowledgesdk.ActionLibraryOrganizationMembersRemove: a.removeOrganizationMember,
		knowledgesdk.ActionPagesList:                        a.listPages,
		knowledgesdk.ActionPagesGet:                         a.getPage,
		knowledgesdk.ActionPagesCreate:                      a.createPage,
		knowledgesdk.ActionPageReferencesList:               a.listPageReferences,
		knowledgesdk.ActionPageReferencesCreate:             a.createPageReference,
		knowledgesdk.ActionPagesUpdate:                      a.saveDraft,
		knowledgesdk.ActionPageNativeOperationsApply:        a.applyPageNativeOperations,
		knowledgesdk.ActionPageGridAutomationExecute:        a.executePageGridAutomation,
		knowledgesdk.ActionPagesMove:                        a.movePage,
		knowledgesdk.ActionPagesMovePreview:                 a.previewPageMove,
		knowledgesdk.ActionPagesReorder:                     a.reorderPages,
		knowledgesdk.ActionPagesCopy:                        a.copyPage,
		knowledgesdk.ActionPagesArchive:                     a.archivePage,
		knowledgesdk.ActionPagesRestore:                     a.restorePage,
		knowledgesdk.ActionPagesPublish:                     a.publishPage,
		knowledgesdk.ActionPageAccessGet:                    a.getPageAccess,
		knowledgesdk.ActionPageAccessSet:                    a.setPageAccess,
		knowledgesdk.ActionPageContentPolicyGet:             a.getPageContentPolicy,
		knowledgesdk.ActionPageContentPolicySet:             a.setPageContentPolicy,
		knowledgesdk.ActionPageContentCopy:                  a.authorizePageContentCopy,
		knowledgesdk.ActionPageDownload:                     a.downloadPageDocument,
		knowledgesdk.ActionPagePrint:                        a.authorizePagePrint,
		knowledgesdk.ActionPageExport:                       a.authorizePageExport,
		knowledgesdk.ActionPageDuplicate:                    a.authorizePageDuplicate,
		knowledgesdk.ActionPageSharesList:                   a.listPageShares,
		knowledgesdk.ActionPageSharesCreate:                 a.createPageShare,
		knowledgesdk.ActionPageSharesRevoke:                 a.revokePageShare,
		knowledgesdk.ActionPageSharesRedeem:                 a.redeemPageShare,
		knowledgesdk.ActionPageSharesRead:                   a.readPageShare,
		knowledgesdk.ActionPageShareContentCopy:             a.authorizePageShareContentCopy,
		knowledgesdk.ActionPageShareContentPrint:            a.authorizePageShareContentPrint,
		knowledgesdk.ActionPageShareContentExport:           a.authorizePageShareContentExport,
		knowledgesdk.ActionPageCollaborationConnect:         a.connectPageCollaboration,
		knowledgesdk.ActionPageCollaborationSync:            a.syncPageCollaboration,
		knowledgesdk.ActionPageCollaborationEvents:          a.streamPageCollaborationEvents,
		knowledgesdk.ActionPageCollaborationClose:           a.closePageCollaboration,
		knowledgesdk.ActionPageCollaborationPublish:         a.publishPageCollaboration,
		knowledgesdk.ActionPageLiveEvents:                   a.streamPageLiveEvents,
		knowledgesdk.ActionPagePersonalStateGet:             a.getPagePersonalState,
		knowledgesdk.ActionPagePersonalStateSet:             a.setPagePersonalState,
		knowledgesdk.ActionPageViewRecord:                   a.recordPageView,
		knowledgesdk.ActionPageCollectionsList:              a.listPageCollections,
		knowledgesdk.ActionPageMetadataGet:                  a.getPageMetadata,
		knowledgesdk.ActionPageMetadataSet:                  a.setPageMetadata,
		knowledgesdk.ActionPageGovernanceSet:                a.setPageGovernance,
		knowledgesdk.ActionPageGovernanceReview:             a.reviewPageGovernance,
		knowledgesdk.ActionPageGovernanceAuditList:          a.listPageGovernanceAudit,
		knowledgesdk.ActionPageSearch:                       a.searchPages,
		knowledgesdk.ActionPageSearchEvents:                 a.streamPageSearchEvents,
		knowledgesdk.ActionPageIdentitiesSearch:             a.searchPageIdentities,
		knowledgesdk.ActionPageRelationshipGraphGet:         a.getPageRelationshipGraph,
		knowledgesdk.ActionPageVersionsList:                 a.listVersions,
		knowledgesdk.ActionPageVersionsGet:                  a.getVersion,
		knowledgesdk.ActionPageVersionsDiff:                 a.diffVersions,
		knowledgesdk.ActionPageVersionsRestore:              a.restoreVersion,
		knowledgesdk.ActionPageEditHistoryList:              a.listEditHistory,
		knowledgesdk.ActionPageSuggestionsList:              a.listPageSuggestions,
		knowledgesdk.ActionPageSuggestionsCreate:            a.createPageSuggestion,
		knowledgesdk.ActionPageSuggestionsDecide:            a.decidePageSuggestion,
		knowledgesdk.ActionPageCommentsList:                 a.listComments,
		knowledgesdk.ActionPageCommentsCreate:               a.createComment,
		knowledgesdk.ActionPageCommentsUpdate:               a.updateComment,
		knowledgesdk.ActionPageCommentsResolve:              a.resolveComment,
		knowledgesdk.ActionPageCommentsDelete:               a.deleteComment,
		knowledgesdk.ActionPageCommentsReact:                a.reactComment,
		knowledgesdk.ActionPageAttachmentsList:              a.listPageAttachments,
		knowledgesdk.ActionPageAttachmentsSet:               a.setPageAttachment,
		knowledgesdk.ActionPageAttachmentsRemove:            a.removePageAttachment,
		knowledgesdk.ActionPageTasksList:                    a.listPageTasks,
		knowledgesdk.ActionPageTasksCreate:                  a.createPageTask,
		knowledgesdk.ActionPageTasksUpdate:                  a.updatePageTask,
		knowledgesdk.ActionPagePollsList:                    a.listPagePolls,
		knowledgesdk.ActionPagePollsCreate:                  a.createPagePoll,
		knowledgesdk.ActionPagePollsUpdate:                  a.updatePagePoll,
		knowledgesdk.ActionPagePollsVote:                    a.votePagePoll,
		knowledgesdk.ActionPageFormSubmit:                   a.submitPageForm,
		knowledgesdk.ActionPageFormResponsesList:            a.listPageFormSubmissions,
		knowledgesdk.ActionPageFormAnalyticsGet:             a.getPageFormAnalytics,
		knowledgesdk.ActionPageFormResponsesExport:          a.exportPageFormSubmissions,
		knowledgesdk.ActionPageTemplatesList:                a.listPageTemplates,
		knowledgesdk.ActionPageTemplatesCreate:              a.createPageTemplate,
		knowledgesdk.ActionPageTemplatesUpdate:              a.updatePageTemplate,
		knowledgesdk.ActionPageTemplateVersionsList:         a.listPageTemplateVersions,
		knowledgesdk.ActionPageTemplateVersionsGet:          a.getPageTemplateVersion,
		knowledgesdk.ActionPageTemplatesInstantiate:         a.instantiatePageTemplate,
		knowledgesdk.ActionWebhookSubscriptionsList:         a.listWebhookSubscriptions,
		knowledgesdk.ActionWebhookSubscriptionsCreate:       a.createWebhookSubscription,
		knowledgesdk.ActionWebhookSubscriptionsUpdate:       a.updateWebhookSubscription,
		knowledgesdk.ActionWebhookEventsList:                a.listWebhookEvents,
		knowledgesdk.ActionWebhookEventsReplay:              a.replayWebhookEvent,
		knowledgesdk.ActionAgentReferencesResolve:           a.resolveAgentReference,
		knowledgesdk.ActionAIExecutionsCreate:               a.createAIExecution,
		knowledgesdk.ActionAIExecutionsGet:                  a.getAIExecution,
		knowledgesdk.ActionAIExecutionsConfirm:              a.confirmAIExecution,
		knowledgesdk.ActionApplicationCardsResolve:          a.resolveApplicationCard,
		knowledgesdk.ActionDocumentsList:                    a.listDocuments,
		knowledgesdk.ActionDocumentsGet:                     a.getDocument,
		knowledgesdk.ActionDocumentsUpload:                  a.uploadDocument,
		knowledgesdk.ActionDocumentsDownload:                a.downloadDocument,
		knowledgesdk.ActionDocumentsRetry:                   a.retryDocument,
		knowledgesdk.ActionDocumentsReindex:                 a.reindexDocument,
		knowledgesdk.ActionDocumentsDelete:                  a.deleteDocument,
		knowledgesdk.ActionDocumentsTransfer:                a.transferDocument,
		knowledgesdk.ActionSourcesList:                      a.listSources,
		knowledgesdk.ActionSourcesBind:                      a.bindSource,
		knowledgesdk.ActionAccessExplain:                    a.explainAccess,
		knowledgesdk.ActionPrincipalsSearch:                 a.searchPrincipals,
		knowledgesdk.ActionPrincipalsResolve:                a.resolvePrincipals,
		knowledgesdk.ActionOrganizationPrincipalsResolve:    a.resolveOrganizationPrincipals,
	}
}

func (a *adapter) getOpenAPI(response http.ResponseWriter, request *http.Request) {
	if _, ok := authorityOrWriteError(a, response, request); !ok {
		return
	}
	document, err := knowledgesdk.KnowledgeOpenAPIDocument()
	if err != nil {
		writeCode(response, http.StatusInternalServerError, "knowledge.openapi_unavailable")
		return
	}
	writeJSON(response, http.StatusOK, document)
}

func (a *adapter) listWebhookSubscriptions(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	result, err := a.service.KnowledgeWebhookSubscriptions(request.Context(), request.PathValue("libraryID"), authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) createWebhookSubscription(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgeWebhookSubscriptionCreate
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.CreateKnowledgeWebhookSubscription(request.Context(), request.PathValue("libraryID"), input, authority)
	writeResult(response, result, err, http.StatusCreated)
}

func (a *adapter) updateWebhookSubscription(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgeWebhookSubscriptionUpdate
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.UpdateKnowledgeWebhookSubscription(request.Context(), request.PathValue("libraryID"), request.PathValue("subscriptionID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) listWebhookEvents(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	result, err := a.service.KnowledgeWebhookEvents(request.Context(), request.PathValue("libraryID"), authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) replayWebhookEvent(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	result, err := a.service.ReplayKnowledgeWebhookEvent(request.Context(), request.PathValue("libraryID"), request.PathValue("eventID"), authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) resolveAgentReference(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgeAgentReference
	if !decodeJSON(response, request, &input) {
		return
	}
	input.LibraryID, input.PageID = request.PathValue("libraryID"), request.PathValue("pageID")
	result, err := a.service.ResolveKnowledgeAgentReference(request.Context(), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) createAIExecution(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgeAIExecutionCreate
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.CreateKnowledgeAIExecution(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), input, authority)
	writeResult(response, result, err, http.StatusAccepted)
}

func (a *adapter) getAIExecution(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	result, err := a.service.KnowledgeAIExecution(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), request.PathValue("executionID"), authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) confirmAIExecution(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgeAIExecutionConfirm
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.ConfirmKnowledgeAIExecution(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), request.PathValue("executionID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) resolveApplicationCard(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgeApplicationCardResolve
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.ResolveKnowledgeApplicationCard(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) authority(request *http.Request) (knowledgesdk.Authority, error) {
	identity, ok := identitysdk.RequestIdentityFromContext(request.Context())
	if !ok || !identity.Principal.Known {
		return knowledgesdk.Authority{}, &knowledgesdk.Error{Class: "forbidden", Code: "knowledge.principal_required"}
	}
	principal := identity.Principal
	return knowledgesdk.Authority{Known: true, RuntimeID: a.runtimeID, WorkspaceID: strings.TrimSpace(principal.WorkspaceID), UserID: strings.TrimSpace(principal.UserID), RoleKey: strings.TrimSpace(principal.RoleKey), OrgID: strings.TrimSpace(principal.OrgID), OrgScopeIDs: append([]string(nil), principal.OrgScopeIDs...), AccountType: strings.TrimSpace(principal.User.AccountType)}, nil
}

func authorityOrWriteError(a *adapter, response http.ResponseWriter, request *http.Request) (knowledgesdk.Authority, bool) {
	authority, err := a.authority(request)
	if err != nil {
		writeError(response, err)
		return knowledgesdk.Authority{}, false
	}
	return authority, true
}

func decodeJSON(response http.ResponseWriter, request *http.Request, destination any) bool {
	decoder := json.NewDecoder(http.MaxBytesReader(response, request.Body, maxJSONBodyBytes))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(destination); err != nil {
		writeCode(response, http.StatusBadRequest, "knowledge.request_invalid")
		return false
	}
	var extra any
	if decoder.Decode(&extra) != io.EOF {
		writeCode(response, http.StatusBadRequest, "knowledge.request_invalid")
		return false
	}
	return true
}

func queryInt(request *http.Request, key string, defaultValue int) (int, error) {
	raw := strings.TrimSpace(request.URL.Query().Get(key))
	if raw == "" {
		return defaultValue, nil
	}
	value, err := strconv.Atoi(raw)
	if err != nil || value < 0 {
		return 0, &knowledgesdk.Error{Class: "bad_request", Code: "knowledge.query_invalid"}
	}
	return value, nil
}

func queryInt64(request *http.Request, key string) (int64, error) {
	raw := strings.TrimSpace(request.URL.Query().Get(key))
	value, err := strconv.ParseInt(raw, 10, 64)
	if err != nil || value < 1 {
		return 0, &knowledgesdk.Error{Class: "bad_request", Code: "knowledge.query_invalid"}
	}
	return value, nil
}

func queryBool(request *http.Request, key string) (bool, error) {
	raw := strings.TrimSpace(request.URL.Query().Get(key))
	if raw == "" {
		return false, nil
	}
	value, err := strconv.ParseBool(raw)
	if err != nil {
		return false, &knowledgesdk.Error{Class: "bad_request", Code: "knowledge.query_invalid"}
	}
	return value, nil
}

func (a *adapter) listLibraries(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	limit, err := queryInt(request, "limit", 20)
	if err != nil {
		writeError(response, err)
		return
	}
	result, err := a.service.KnowledgeLibraries(request.Context(), request.URL.Query().Get("after"), limit, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) createLibrary(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgeLibraryCreate
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.CreateKnowledgeLibrary(request.Context(), input, authority)
	writeResult(response, result, err, http.StatusCreated)
}

func (a *adapter) getLibrary(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	result, err := a.service.KnowledgeLibrary(request.Context(), request.PathValue("libraryID"), authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) updateLibrary(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgeLibraryUpdate
	if !decodeJSON(response, request, &input) {
		return
	}
	current, err := a.service.KnowledgeLibrary(request.Context(), request.PathValue("libraryID"), authority)
	if err != nil {
		writeError(response, err)
		return
	}
	input.Archived = current.Archived
	result, err := a.service.UpdateKnowledgeLibrary(request.Context(), current.ID, input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) archiveLibrary(response http.ResponseWriter, request *http.Request) {
	a.setLibraryArchived(response, request, true)
}
func (a *adapter) restoreLibrary(response http.ResponseWriter, request *http.Request) {
	a.setLibraryArchived(response, request, false)
}
func (a *adapter) setLibraryArchived(response http.ResponseWriter, request *http.Request, archived bool) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input struct {
		ExpectedRevision int64 `json:"expected_revision"`
	}
	if !decodeJSON(response, request, &input) {
		return
	}
	current, err := a.service.KnowledgeLibrary(request.Context(), request.PathValue("libraryID"), authority)
	if err != nil {
		writeError(response, err)
		return
	}
	result, err := a.service.UpdateKnowledgeLibrary(request.Context(), current.ID, knowledgesdk.KnowledgeLibraryUpdate{ExpectedRevision: input.ExpectedRevision, Name: current.Name, Description: current.Description, Archived: archived}, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) listMembers(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	limit, err := queryInt(request, "limit", 20)
	if err != nil {
		writeError(response, err)
		return
	}
	result, err := a.service.KnowledgeLibraryMembers(request.Context(), request.PathValue("libraryID"), request.URL.Query().Get("after"), limit, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) searchLibraryMembers(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	limit, err := queryInt(request, "limit", 20)
	if err != nil {
		writeError(response, err)
		return
	}
	result, err := a.service.SearchKnowledgeLibraryMembers(request.Context(), request.PathValue("libraryID"), request.URL.Query().Get("query"), request.URL.Query().Get("after"), limit, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) setMember(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgeLibraryMemberWrite
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.SetKnowledgeLibraryMember(request.Context(), request.PathValue("libraryID"), request.PathValue("userID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) removeMember(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	revision, err := queryInt64(request, "expected_revision")
	if err != nil {
		writeError(response, err)
		return
	}
	result, err := a.service.RemoveKnowledgeLibraryMember(request.Context(), request.PathValue("libraryID"), request.PathValue("userID"), revision, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) listOrganizationMembers(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	limit, err := queryInt(request, "limit", 20)
	if err != nil {
		writeError(response, err)
		return
	}
	result, err := a.service.KnowledgeLibraryOrganizationMembers(request.Context(), request.PathValue("libraryID"), request.URL.Query().Get("after"), limit, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) setOrganizationMember(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgeLibraryMemberWrite
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.SetKnowledgeLibraryOrganizationMember(request.Context(), request.PathValue("libraryID"), request.PathValue("organizationID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) removeOrganizationMember(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	revision, err := queryInt64(request, "expected_revision")
	if err != nil {
		writeError(response, err)
		return
	}
	result, err := a.service.RemoveKnowledgeLibraryOrganizationMember(request.Context(), request.PathValue("libraryID"), request.PathValue("organizationID"), revision, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) listPages(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	limit, err := queryInt(request, "limit", 50)
	if err != nil {
		writeError(response, err)
		return
	}
	archived, err := queryBool(request, "include_archived")
	if err != nil {
		writeError(response, err)
		return
	}
	result, err := a.service.KnowledgePages(request.Context(), request.PathValue("libraryID"), request.URL.Query().Get("parent_page_id"), request.URL.Query().Get("after"), limit, archived, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) getPage(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	draft, err := queryBool(request, "draft")
	if err != nil {
		writeError(response, err)
		return
	}
	result, err := a.service.KnowledgePage(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), draft, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) getPagePersonalState(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	result, err := a.service.KnowledgePagePersonalState(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) setPagePersonalState(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePagePersonalStateWrite
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.SetKnowledgePagePersonalState(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) recordPageView(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageViewRecord
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.RecordKnowledgePageView(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) listPageCollections(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	limit, err := queryInt(request, "limit", 20)
	if err != nil {
		writeError(response, err)
		return
	}
	result, err := a.service.KnowledgePageCollection(request.Context(), request.PathValue("libraryID"), knowledgesdk.KnowledgePageCollectionKind(request.URL.Query().Get("kind")), request.URL.Query().Get("after"), limit, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) getPageMetadata(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	result, err := a.service.KnowledgePageMetadata(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) setPageMetadata(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageMetadataWrite
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.SetKnowledgePageMetadata(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) setPageGovernance(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageGovernanceWrite
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.SetKnowledgePageGovernance(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) reviewPageGovernance(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageGovernanceReview
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.ReviewKnowledgePageGovernance(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) listPageGovernanceAudit(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	limit, err := queryInt(request, "limit", 50)
	if err != nil {
		writeError(response, err)
		return
	}
	result, err := a.service.KnowledgePageGovernanceAudit(request.Context(), knowledgesdk.KnowledgeGovernanceAuditQuery{
		LibraryID: request.PathValue("libraryID"), PageID: request.PathValue("pageID"), Event: request.URL.Query().Get("event"),
		ActorID: request.URL.Query().Get("actor_id"), After: request.URL.Query().Get("after"), Limit: limit,
	}, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) searchPages(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageSearchInput
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.SearchKnowledgePages(request.Context(), request.PathValue("libraryID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func pageSearchLastEventID(request *http.Request) (int64, error) {
	raw := strings.TrimSpace(request.Header.Get("Last-Event-ID"))
	if raw == "" {
		return 0, nil
	}
	revision, err := strconv.ParseInt(raw, 10, 64)
	if err != nil || revision < 0 {
		return 0, &knowledgesdk.Error{Class: "bad_request", Code: "knowledge.page_search_event_id_invalid"}
	}
	return revision, nil
}

func writePageSearchSSE(response http.ResponseWriter, event knowledgesdk.KnowledgePageSearchEvent) error {
	payload, err := json.Marshal(event)
	if err != nil {
		return err
	}
	if _, err = fmt.Fprintf(response, "id: %d\n", event.Revision); err != nil {
		return err
	}
	_, err = fmt.Fprintf(response, "event: %s\ndata: %s\n\n", event.Type, payload)
	return err
}

func (a *adapter) streamPageSearchEvents(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	if !collaborationResponseSupportsFlush(response) {
		writeCode(response, http.StatusInternalServerError, "knowledge.streaming_unavailable")
		return
	}
	afterRevision, err := pageSearchLastEventID(request)
	if err != nil {
		writeError(response, err)
		return
	}
	libraryID := request.PathValue("libraryID")
	batch, err := a.service.KnowledgePageSearchEvents(request.Context(), libraryID, knowledgesdk.KnowledgePageSearchEvents{AfterRevision: afterRevision}, authority)
	if err != nil {
		writeError(response, err)
		return
	}
	controller := http.NewResponseController(response)
	response.Header().Set("Content-Type", "text/event-stream; charset=utf-8")
	response.Header().Set("Cache-Control", "no-cache, no-transform")
	response.Header().Set("Connection", "keep-alive")
	response.Header().Set("X-Accel-Buffering", "no")
	if _, err = io.WriteString(response, "retry: 1000\n\n"); err != nil {
		return
	}
	writeBatch := func(current knowledgesdk.KnowledgePageSearchEventBatch) bool {
		if len(current.Events) == 0 {
			current.Events = []knowledgesdk.KnowledgePageSearchEvent{{Type: knowledgesdk.KnowledgePageSearchEventHeartbeat, Revision: current.Revision}}
		}
		for _, event := range current.Events {
			if writePageSearchSSE(response, event) != nil {
				return false
			}
		}
		return controller.Flush() == nil
	}
	if !writeBatch(batch) {
		return
	}
	afterRevision = batch.Revision
	for {
		batch, err = a.service.KnowledgePageSearchEvents(request.Context(), libraryID, knowledgesdk.KnowledgePageSearchEvents{AfterRevision: afterRevision, WaitMillis: 15_000}, authority)
		if err != nil {
			if code, revoked := pageLiveRevocationCode(err); revoked && request.Context().Err() == nil {
				_ = writePageSearchSSE(response, knowledgesdk.KnowledgePageSearchEvent{Type: knowledgesdk.KnowledgePageSearchEventRevoked, Revision: afterRevision, Code: code})
				_ = controller.Flush()
			}
			return
		}
		if !writeBatch(batch) {
			return
		}
		afterRevision = batch.Revision
	}
}

func (a *adapter) searchPageIdentities(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	limit, err := queryInt(request, "limit", 20)
	if err != nil {
		writeError(response, err)
		return
	}
	result, err := a.service.SearchKnowledgePageIdentities(request.Context(), request.PathValue("libraryID"), request.URL.Query().Get("query"), limit, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) getPageRelationshipGraph(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	depth, err := queryInt(request, "depth", 2)
	if err != nil {
		writeError(response, err)
		return
	}
	limit, err := queryInt(request, "limit", 80)
	if err != nil {
		writeError(response, err)
		return
	}
	result, err := a.service.KnowledgePageRelationshipGraph(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), depth, limit, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) createPage(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageCreate
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.CreateKnowledgePage(request.Context(), request.PathValue("libraryID"), input, authority)
	writeResult(response, result, err, http.StatusCreated)
}

func (a *adapter) listPageReferences(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	limit, err := queryInt(request, "limit", 20)
	if err != nil {
		writeError(response, err)
		return
	}
	result, err := a.service.KnowledgePageReferences(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), knowledgesdk.KnowledgePageReferenceDirection(request.URL.Query().Get("direction")), request.URL.Query().Get("after"), limit, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) createPageReference(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageReferenceCreate
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.CreateKnowledgePageReference(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), input, authority)
	writeResult(response, result, err, http.StatusCreated)
}

func (a *adapter) saveDraft(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageDraftWrite
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.SaveKnowledgePageDraft(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) movePage(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageMove
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.MoveKnowledgePage(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) previewPageMove(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageMovePreview
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.PreviewKnowledgePageMove(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) reorderPages(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageReorder
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.ReorderKnowledgePages(request.Context(), request.PathValue("libraryID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) copyPage(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageCopy
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.CopyKnowledgePage(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), input, authority)
	writeResult(response, result, err, http.StatusCreated)
}

func (a *adapter) archivePage(response http.ResponseWriter, request *http.Request) {
	a.setPageArchived(response, request, true)
}
func (a *adapter) restorePage(response http.ResponseWriter, request *http.Request) {
	a.setPageArchived(response, request, false)
}
func (a *adapter) setPageArchived(response http.ResponseWriter, request *http.Request, archived bool) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageStateWrite
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.SetKnowledgePageArchived(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), archived, input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) publishPage(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePagePublish
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.PublishKnowledgePage(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) getPageAccess(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	result, err := a.service.KnowledgePageAccess(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) setPageAccess(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageAccessWrite
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.SetKnowledgePageAccess(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) getPageContentPolicy(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	result, err := a.service.KnowledgePageContentPolicy(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) setPageContentPolicy(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageContentPolicyWrite
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.SetKnowledgePageContentPolicy(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) authorizePageContent(response http.ResponseWriter, request *http.Request, operation string) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	result, err := a.service.AuthorizeKnowledgePageContentOperation(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), operation, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) authorizePageContentCopy(response http.ResponseWriter, request *http.Request) {
	a.authorizePageContent(response, request, knowledgesdk.KnowledgePageContentOperationCopy)
}

func (a *adapter) authorizePagePrint(response http.ResponseWriter, request *http.Request) {
	a.authorizePageContent(response, request, knowledgesdk.KnowledgePageContentOperationPrint)
}

func (a *adapter) authorizePageExport(response http.ResponseWriter, request *http.Request) {
	a.authorizePageContent(response, request, knowledgesdk.KnowledgePageContentOperationExport)
}

func (a *adapter) authorizePageDuplicate(response http.ResponseWriter, request *http.Request) {
	a.authorizePageContent(response, request, knowledgesdk.KnowledgePageContentOperationDuplicate)
}

func (a *adapter) downloadPageDocument(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	download, err := a.service.DownloadKnowledgePageDocument(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), request.PathValue("documentID"), authority)
	if err != nil {
		writeError(response, err)
		return
	}
	defer download.Content.Close()
	response.Header().Set("Content-Type", "application/octet-stream")
	response.Header().Set("Content-Disposition", mime.FormatMediaType("attachment", map[string]string{"filename": download.Document.Filename}))
	response.Header().Set("X-Knowledge-File-SHA256", download.Document.SHA256)
	response.Header().Set("X-Content-Type-Options", "nosniff")
	response.Header().Set("Cache-Control", "private, no-store")
	http.ServeContent(response, request, download.Document.Filename, time.Time{}, download.Content)
}

func (a *adapter) listPageShares(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	limit, err := queryInt(request, "limit", 50)
	if err != nil {
		writeError(response, err)
		return
	}
	result, err := a.service.KnowledgePageShares(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), request.URL.Query().Get("after"), limit, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) createPageShare(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageShareCreate
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.CreateKnowledgePageShare(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), input, authority)
	writeResult(response, result, err, http.StatusCreated)
}

func (a *adapter) revokePageShare(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageShareRevoke
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.RevokeKnowledgePageShare(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), request.PathValue("shareID"), input.ExpectedRevision, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) redeemPageShare(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageShareRedeem
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.RedeemKnowledgePageShare(request.Context(), request.PathValue("shareID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) readPageShare(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	result, err := a.service.ReadKnowledgePageShare(request.Context(), request.PathValue("shareID"), request.PathValue("pageID"), authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) authorizePageShareContent(response http.ResponseWriter, request *http.Request, operation string) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	result, err := a.service.AuthorizeKnowledgePageShareContentOperation(request.Context(), request.PathValue("shareID"), request.PathValue("pageID"), operation, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) authorizePageShareContentCopy(response http.ResponseWriter, request *http.Request) {
	a.authorizePageShareContent(response, request, knowledgesdk.KnowledgePageContentOperationCopy)
}

func (a *adapter) authorizePageShareContentPrint(response http.ResponseWriter, request *http.Request) {
	a.authorizePageShareContent(response, request, knowledgesdk.KnowledgePageContentOperationPrint)
}

func (a *adapter) authorizePageShareContentExport(response http.ResponseWriter, request *http.Request) {
	a.authorizePageShareContent(response, request, knowledgesdk.KnowledgePageContentOperationExport)
}

func (a *adapter) connectPageCollaboration(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgeCollaborationConnect
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.ConnectKnowledgeCollaboration(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), input, authority)
	writeResult(response, result, err, http.StatusCreated)
}

func (a *adapter) syncPageCollaboration(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgeCollaborationSync
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.SyncKnowledgeCollaboration(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func collaborationLastEventID(request *http.Request) (int64, error) {
	raw := strings.TrimSpace(request.Header.Get("Last-Event-ID"))
	if raw == "" {
		return 0, nil
	}
	clock, err := strconv.ParseInt(raw, 10, 64)
	if err != nil || clock < 0 {
		return 0, &knowledgesdk.Error{Class: "bad_request", Code: "knowledge.collaboration_event_id_invalid"}
	}
	return clock, nil
}

func pageLiveLastEventID(request *http.Request) (int64, error) {
	raw := strings.TrimSpace(request.Header.Get("Last-Event-ID"))
	if raw == "" {
		return 0, nil
	}
	revision, err := strconv.ParseInt(raw, 10, 64)
	if err != nil || revision < 0 {
		return 0, &knowledgesdk.Error{Class: "bad_request", Code: "knowledge.page_live_event_id_invalid"}
	}
	return revision, nil
}

func collaborationConnectionAttempt(request *http.Request) (int64, error) {
	raw := strings.TrimSpace(request.Header.Get("X-Knowledge-Collaboration-Attempt"))
	if raw == "" {
		return 0, nil
	}
	attempt, err := strconv.ParseInt(raw, 10, 64)
	if err != nil || attempt < 0 || attempt > 100_000 {
		return 0, &knowledgesdk.Error{Class: "bad_request", Code: "knowledge.collaboration_connection_attempt_invalid"}
	}
	return attempt, nil
}

func writeCollaborationSSE(response http.ResponseWriter, event knowledgesdk.KnowledgeCollaborationServerEvent) error {
	payload, err := json.Marshal(event)
	if err != nil {
		return err
	}
	if event.Clock >= 0 {
		if _, err = fmt.Fprintf(response, "id: %d\n", event.Clock); err != nil {
			return err
		}
	}
	_, err = fmt.Fprintf(response, "event: %s\ndata: %s\n\n", event.Type, payload)
	return err
}

func writePageLiveSSE(response http.ResponseWriter, event knowledgesdk.KnowledgePageLiveEvent) error {
	payload, err := json.Marshal(event)
	if err != nil {
		return err
	}
	if _, err = fmt.Fprintf(response, "id: %d\n", event.Revision); err != nil {
		return err
	}
	_, err = fmt.Fprintf(response, "event: %s\ndata: %s\n\n", event.Type, payload)
	return err
}

func pageLiveRevocationCode(err error) (string, bool) {
	var failure *knowledgesdk.Error
	if errors.As(err, &failure) && strings.TrimSpace(failure.Code) != "" && (failure.Class == "forbidden" || failure.Class == "not_found") {
		return failure.Code, true
	}
	return "", false
}

func collaborationRevocationCode(err error) (string, bool) {
	var failure *knowledgesdk.Error
	if errors.As(err, &failure) && strings.TrimSpace(failure.Code) != "" {
		if failure.Class == "unavailable" || failure.Retryable {
			return "", false
		}
		return failure.Code, true
	}
	return "", false
}

func collaborationResponseSupportsFlush(response http.ResponseWriter) bool {
	for response != nil {
		switch current := response.(type) {
		case interface{ FlushError() error }:
			return true
		case http.Flusher:
			return true
		case interface{ Unwrap() http.ResponseWriter }:
			response = current.Unwrap()
		default:
			return false
		}
	}
	return false
}

func (a *adapter) streamPageCollaborationEvents(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	if !collaborationResponseSupportsFlush(response) {
		writeCode(response, http.StatusInternalServerError, "knowledge.streaming_unavailable")
		return
	}
	controller := http.NewResponseController(response)
	afterClock, err := collaborationLastEventID(request)
	if err != nil {
		writeError(response, err)
		return
	}
	connectionAttempt, err := collaborationConnectionAttempt(request)
	if err != nil {
		writeError(response, err)
		return
	}
	libraryID, pageID, sessionID := request.PathValue("libraryID"), request.PathValue("pageID"), request.PathValue("sessionID")
	batch, err := a.service.KnowledgeCollaborationEvents(request.Context(), libraryID, pageID, knowledgesdk.KnowledgeCollaborationEvents{SessionID: sessionID, AfterClock: afterClock, ConnectionAttempt: connectionAttempt}, authority)
	if err != nil {
		writeError(response, err)
		return
	}
	response.Header().Set("Content-Type", "text/event-stream; charset=utf-8")
	response.Header().Set("Cache-Control", "no-cache, no-transform")
	response.Header().Set("Connection", "keep-alive")
	response.Header().Set("X-Accel-Buffering", "no")
	// Streaming responses intentionally outlive the server's ordinary write
	// timeout. Clear the per-request deadline without weakening timeouts for
	// normal API responses.
	_ = controller.SetWriteDeadline(time.Time{})
	if _, err = io.WriteString(response, "retry: 1000\n\n"); err != nil {
		return
	}
	writeBatch := func(current knowledgesdk.KnowledgeCollaborationEventBatch) bool {
		if len(current.Events) == 0 {
			if _, err = io.WriteString(response, ": heartbeat\n"); err != nil {
				return false
			}
			current.Events = []knowledgesdk.KnowledgeCollaborationServerEvent{{Type: knowledgesdk.KnowledgeCollaborationEventHeartbeat, Clock: current.ServerClock}}
		}
		for _, event := range current.Events {
			if writeCollaborationSSE(response, event) != nil {
				return false
			}
		}
		if err = controller.Flush(); err != nil {
			return false
		}
		return true
	}
	if !writeBatch(batch) {
		return
	}
	afterClock = batch.ServerClock
	for {
		batch, err = a.service.KnowledgeCollaborationEvents(request.Context(), libraryID, pageID, knowledgesdk.KnowledgeCollaborationEvents{SessionID: sessionID, AfterClock: afterClock, WaitMillis: 15_000}, authority)
		if err != nil {
			if code, revoked := collaborationRevocationCode(err); revoked && request.Context().Err() == nil {
				_ = writeCollaborationSSE(response, knowledgesdk.KnowledgeCollaborationServerEvent{Type: knowledgesdk.KnowledgeCollaborationEventRevoked, Clock: afterClock, Code: code})
				_ = controller.Flush()
			}
			return
		}
		if !writeBatch(batch) {
			return
		}
		afterClock = batch.ServerClock
	}
}

func (a *adapter) streamPageLiveEvents(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	if !collaborationResponseSupportsFlush(response) {
		writeCode(response, http.StatusInternalServerError, "knowledge.streaming_unavailable")
		return
	}
	afterRevision, err := pageLiveLastEventID(request)
	if err != nil {
		writeError(response, err)
		return
	}
	libraryID, pageID := request.PathValue("libraryID"), request.PathValue("pageID")
	batch, err := a.service.KnowledgePageLiveEvents(request.Context(), libraryID, pageID, knowledgesdk.KnowledgePageLiveEvents{AfterRevision: afterRevision}, authority)
	if err != nil {
		writeError(response, err)
		return
	}
	controller := http.NewResponseController(response)
	_ = controller.SetWriteDeadline(time.Time{})
	response.Header().Set("Content-Type", "text/event-stream; charset=utf-8")
	response.Header().Set("Cache-Control", "no-cache, no-transform")
	response.Header().Set("Connection", "keep-alive")
	response.Header().Set("X-Accel-Buffering", "no")
	if _, err = io.WriteString(response, "retry: 1000\n\n"); err != nil {
		return
	}
	writeBatch := func(current knowledgesdk.KnowledgePageLiveEventBatch) bool {
		if len(current.Events) == 0 {
			current.Events = []knowledgesdk.KnowledgePageLiveEvent{{Type: knowledgesdk.KnowledgePageLiveEventHeartbeat, PageID: current.PageID, Revision: current.Revision}}
		}
		for _, event := range current.Events {
			if writePageLiveSSE(response, event) != nil {
				return false
			}
		}
		return controller.Flush() == nil
	}
	if !writeBatch(batch) {
		return
	}
	afterRevision = batch.Revision
	for {
		batch, err = a.service.KnowledgePageLiveEvents(request.Context(), libraryID, pageID, knowledgesdk.KnowledgePageLiveEvents{AfterRevision: afterRevision, WaitMillis: 15_000}, authority)
		if err != nil {
			if code, revoked := pageLiveRevocationCode(err); revoked && request.Context().Err() == nil {
				_ = writePageLiveSSE(response, knowledgesdk.KnowledgePageLiveEvent{Type: knowledgesdk.KnowledgePageLiveEventRevoked, PageID: pageID, Revision: afterRevision, Code: code})
				_ = controller.Flush()
			}
			return
		}
		if !writeBatch(batch) {
			return
		}
		afterRevision = batch.Revision
	}
}

func (a *adapter) closePageCollaboration(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	err := a.service.CloseKnowledgeCollaboration(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), request.PathValue("sessionID"), authority)
	if err != nil {
		writeError(response, err)
		return
	}
	response.WriteHeader(http.StatusNoContent)
}

func (a *adapter) publishPageCollaboration(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgeCollaborationPublish
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.PublishKnowledgeCollaboration(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) listVersions(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	limit, err := queryInt(request, "limit", 20)
	if err != nil {
		writeError(response, err)
		return
	}
	before := int64(0)
	if request.URL.Query().Get("before") != "" {
		before, err = queryInt64(request, "before")
		if err != nil {
			writeError(response, err)
			return
		}
	}
	result, err := a.service.KnowledgePageVersions(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), before, limit, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) listEditHistory(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	limit, err := queryInt(request, "limit", 50)
	if err != nil {
		writeError(response, err)
		return
	}
	before := int64(0)
	if request.URL.Query().Get("before") != "" {
		before, err = queryInt64(request, "before")
		if err != nil {
			writeError(response, err)
			return
		}
	}
	result, err := a.service.KnowledgePageEditHistory(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), before, limit, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) listPageSuggestions(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	result, err := a.service.KnowledgePageSuggestions(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) applyPageNativeOperations(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageNativeOperationBatch
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.ApplyKnowledgePageNativeOperations(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) executePageGridAutomation(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgeGridAutomationExecute
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.ExecuteKnowledgeGridAutomation(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) createPageSuggestion(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageSuggestionCreate
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.CreateKnowledgePageSuggestion(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), input, authority)
	writeResult(response, result, err, http.StatusCreated)
}

func (a *adapter) decidePageSuggestion(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageSuggestionDecision
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.DecideKnowledgePageSuggestion(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), request.PathValue("suggestionID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func pathVersion(request *http.Request) (int64, error) {
	version, err := strconv.ParseInt(strings.TrimSpace(request.PathValue("version")), 10, 64)
	if err != nil || version < 1 {
		return 0, &knowledgesdk.Error{Class: "bad_request", Code: "knowledge.page_version_invalid"}
	}
	return version, nil
}

func (a *adapter) getVersion(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	version, err := pathVersion(request)
	if err != nil {
		writeError(response, err)
		return
	}
	result, err := a.service.KnowledgePageVersion(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), version, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) diffVersions(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageVersionDiffInput
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.DiffKnowledgePageVersions(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) restoreVersion(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	version, err := pathVersion(request)
	if err != nil {
		writeError(response, err)
		return
	}
	var input knowledgesdk.KnowledgePageRestoreVersion
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.RestoreKnowledgePageVersion(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), version, input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) listComments(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	limit, err := queryInt(request, "limit", 50)
	if err != nil {
		writeError(response, err)
		return
	}
	unresolved, err := queryBool(request, "unresolved")
	if err != nil {
		writeError(response, err)
		return
	}
	result, err := a.service.KnowledgePageComments(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), request.URL.Query().Get("after"), limit, unresolved, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) createComment(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageCommentCreate
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.CreateKnowledgePageComment(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), input, authority)
	writeResult(response, result, err, http.StatusCreated)
}

func (a *adapter) updateComment(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageCommentUpdate
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.UpdateKnowledgePageComment(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), request.PathValue("commentID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) resolveComment(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageCommentResolve
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.ResolveKnowledgePageComment(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), request.PathValue("commentID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) deleteComment(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageCommentDelete
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.DeleteKnowledgePageComment(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), request.PathValue("commentID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) reactComment(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageCommentReactionWrite
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.SetKnowledgePageCommentReaction(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), request.PathValue("commentID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) listPageAttachments(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	result, err := a.service.KnowledgePageAttachments(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) setPageAttachment(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageAttachmentWrite
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.SetKnowledgePageAttachment(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), request.PathValue("documentID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) removePageAttachment(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageAttachmentRemove
	if !decodeJSON(response, request, &input) {
		return
	}
	err := a.service.RemoveKnowledgePageAttachment(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), request.PathValue("documentID"), input, authority)
	if err != nil {
		writeError(response, err)
		return
	}
	response.WriteHeader(http.StatusNoContent)
}

func (a *adapter) listPageTasks(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	result, err := a.service.KnowledgePageTasks(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) createPageTask(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageTaskCreate
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.CreateKnowledgePageTask(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), input, authority)
	writeResult(response, result, err, http.StatusCreated)
}

func (a *adapter) updatePageTask(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageTaskUpdate
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.UpdateKnowledgePageTask(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), request.PathValue("taskID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) listPagePolls(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	result, err := a.service.KnowledgePagePolls(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) createPagePoll(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePagePollCreate
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.CreateKnowledgePagePoll(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), input, authority)
	writeResult(response, result, err, http.StatusCreated)
}

func (a *adapter) updatePagePoll(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePagePollUpdate
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.UpdateKnowledgePagePoll(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), request.PathValue("pollID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) votePagePoll(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePagePollVote
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.VoteKnowledgePagePoll(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), request.PathValue("pollID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) submitPageForm(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgeFormSubmit
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.SubmitKnowledgePageForm(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), input, authority)
	writeResult(response, result, err, http.StatusCreated)
}

func (a *adapter) listPageFormSubmissions(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	limit, err := queryInt(request, "limit", 50)
	if err != nil {
		writeError(response, err)
		return
	}
	result, err := a.service.KnowledgePageFormSubmissions(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), request.URL.Query().Get("before"), limit, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) getPageFormAnalytics(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	result, err := a.service.KnowledgePageFormAnalytics(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) exportPageFormSubmissions(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	result, err := a.service.ExportKnowledgePageFormSubmissions(request.Context(), request.PathValue("libraryID"), request.PathValue("pageID"), authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) listPageTemplates(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	limit, err := queryInt(request, "limit", 50)
	if err != nil {
		writeError(response, err)
		return
	}
	result, err := a.service.KnowledgePageTemplates(request.Context(), request.PathValue("libraryID"), request.URL.Query().Get("after"), limit, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) createPageTemplate(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageTemplateCreate
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.CreateKnowledgePageTemplate(request.Context(), request.PathValue("libraryID"), input, authority)
	writeResult(response, result, err, http.StatusCreated)
}

func (a *adapter) updatePageTemplate(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageTemplateUpdate
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.UpdateKnowledgePageTemplate(request.Context(), request.PathValue("libraryID"), request.PathValue("templateID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) listPageTemplateVersions(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	limit, err := queryInt(request, "limit", 20)
	if err != nil {
		writeError(response, err)
		return
	}
	before := int64(0)
	if request.URL.Query().Get("before") != "" {
		before, err = queryInt64(request, "before")
		if err != nil {
			writeError(response, err)
			return
		}
	}
	result, err := a.service.KnowledgePageTemplateVersions(request.Context(), request.PathValue("libraryID"), request.PathValue("templateID"), before, limit, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) getPageTemplateVersion(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	version, err := pathVersion(request)
	if err != nil {
		writeError(response, err)
		return
	}
	result, err := a.service.KnowledgePageTemplateVersion(request.Context(), request.PathValue("libraryID"), request.PathValue("templateID"), version, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) instantiatePageTemplate(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePageTemplateInstantiate
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.InstantiateKnowledgePageTemplate(request.Context(), request.PathValue("libraryID"), request.PathValue("templateID"), input, authority)
	writeResult(response, result, err, http.StatusCreated)
}

func (a *adapter) listDocuments(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	limit, err := queryInt(request, "limit", 20)
	if err != nil {
		writeError(response, err)
		return
	}
	result, err := a.service.KnowledgeDocuments(request.Context(), request.PathValue("libraryID"), request.URL.Query().Get("after"), limit, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) getDocument(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	result, err := a.service.KnowledgeDocument(request.Context(), request.PathValue("libraryID"), request.PathValue("documentID"), authority)
	writeResult(response, result, err, http.StatusOK)
}

func parseContentRange(value string) (start, end, total int64, ok bool) {
	unit, rest, found := strings.Cut(strings.TrimSpace(value), " ")
	rangePart, totalPart, foundTotal := strings.Cut(rest, "/")
	startPart, endPart, foundRange := strings.Cut(rangePart, "-")
	if !found || unit != "bytes" || !foundTotal || !foundRange {
		return 0, 0, 0, false
	}
	start, startErr := strconv.ParseInt(startPart, 10, 64)
	end, endErr := strconv.ParseInt(endPart, 10, 64)
	total, totalErr := strconv.ParseInt(totalPart, 10, 64)
	return start, end, total, startErr == nil && endErr == nil && totalErr == nil && start >= 0 && end >= start && total > end
}

func validSHA256(value string) bool {
	if len(value) != 64 {
		return false
	}
	for _, char := range value {
		if !(char >= '0' && char <= '9' || char >= 'a' && char <= 'f') {
			return false
		}
	}
	return true
}

func (a *adapter) uploadDocument(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	mediaType, _, err := mime.ParseMediaType(request.Header.Get("Content-Type"))
	if err != nil || mediaType != "application/octet-stream" {
		writeCode(response, http.StatusBadRequest, "knowledge.document_type_unsupported")
		return
	}
	start, end, total, rangeOK := parseContentRange(request.Header.Get("Content-Range"))
	chunkBytes := end - start + 1
	sha256, chunkSHA256 := request.Header.Get("X-Knowledge-File-SHA256"), request.Header.Get("X-Knowledge-Chunk-SHA256")
	if !rangeOK || total > knowledgesdk.KnowledgeDocumentMaximumBytes || chunkBytes < 1 || chunkBytes > knowledgesdk.KnowledgeDocumentUploadChunkBytes || request.ContentLength != chunkBytes || !validSHA256(sha256) || !validSHA256(chunkSHA256) {
		writeCode(response, http.StatusBadRequest, "knowledge.document_upload_invalid")
		return
	}
	_ = http.NewResponseController(response).SetReadDeadline(time.Now().Add(documentTransferTimeout))
	result, err := a.service.UploadKnowledgeDocumentChunk(request.Context(), request.PathValue("libraryID"), knowledgesdk.KnowledgeDocumentUploadChunk{ClientID: request.URL.Query().Get("client_id"), Filename: request.URL.Query().Get("filename"), Bytes: total, SHA256: sha256, Offset: start, ChunkBytes: chunkBytes, ChunkSHA256: chunkSHA256, Content: http.MaxBytesReader(response, request.Body, knowledgesdk.KnowledgeDocumentUploadChunkBytes)}, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) downloadDocument(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	download, err := a.service.DownloadKnowledgeDocument(request.Context(), request.PathValue("libraryID"), request.PathValue("documentID"), authority)
	if err != nil {
		writeError(response, err)
		return
	}
	defer download.Content.Close()
	disposition := "attachment"
	if strings.HasPrefix(download.Document.ContentType, "audio/") || strings.HasPrefix(download.Document.ContentType, "video/") {
		response.Header().Set("Content-Type", download.Document.ContentType)
		disposition = "inline"
	} else {
		response.Header().Set("Content-Type", "application/octet-stream")
	}
	response.Header().Set("Content-Disposition", mime.FormatMediaType(disposition, map[string]string{"filename": download.Document.Filename}))
	response.Header().Set("X-Knowledge-File-SHA256", download.Document.SHA256)
	response.Header().Set("X-Content-Type-Options", "nosniff")
	response.Header().Set("Cache-Control", "private, no-store")
	http.ServeContent(response, request, download.Document.Filename, time.Time{}, download.Content)
}

func (a *adapter) retryDocument(response http.ResponseWriter, request *http.Request) {
	a.reviseDocument(response, request, "retry")
}
func (a *adapter) reindexDocument(response http.ResponseWriter, request *http.Request) {
	a.reviseDocument(response, request, "reindex")
}
func (a *adapter) deleteDocument(response http.ResponseWriter, request *http.Request) {
	a.reviseDocument(response, request, "delete")
}
func (a *adapter) reviseDocument(response http.ResponseWriter, request *http.Request, operation string) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	revision, err := queryInt64(request, "expected_revision")
	if err != nil {
		writeError(response, err)
		return
	}
	var result knowledgesdk.KnowledgeDocument
	switch operation {
	case "retry":
		result, err = a.service.RetryKnowledgeDocument(request.Context(), request.PathValue("libraryID"), request.PathValue("documentID"), revision, authority)
	case "reindex":
		result, err = a.service.ReindexKnowledgeDocument(request.Context(), request.PathValue("libraryID"), request.PathValue("documentID"), revision, authority)
	default:
		result, err = a.service.DeleteKnowledgeDocument(request.Context(), request.PathValue("libraryID"), request.PathValue("documentID"), revision, authority)
	}
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) transferDocument(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgeDocumentTransfer
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.TransferKnowledgeDocument(request.Context(), request.PathValue("libraryID"), input, authority)
	writeResult(response, result, err, http.StatusCreated)
}

func (a *adapter) listSources(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	limit, err := queryInt(request, "limit", 20)
	if err != nil {
		writeError(response, err)
		return
	}
	result, err := a.service.KnowledgeLibrarySources(request.Context(), request.PathValue("libraryID"), request.URL.Query().Get("after"), limit, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) bindSource(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgeLibrarySourceWrite
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.BindKnowledgeLibrarySource(request.Context(), request.PathValue("libraryID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) searchPrincipals(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	limit, err := queryInt(request, "limit", 20)
	if err != nil {
		writeError(response, err)
		return
	}
	result, err := a.service.SearchKnowledgePrincipals(request.Context(), request.URL.Query().Get("query"), request.URL.Query().Get("after"), limit, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) resolvePrincipals(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgePrincipalResolveRequest
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.ResolveKnowledgePrincipals(request.Context(), input.UserIDs, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) resolveOrganizationPrincipals(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgeOrganizationPrincipalResolveRequest
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.ResolveKnowledgeOrganizationPrincipals(request.Context(), input.OrganizationIDs, authority)
	writeResult(response, result, err, http.StatusOK)
}

func (a *adapter) explainAccess(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input knowledgesdk.KnowledgeAccessExplainRequest
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.ExplainKnowledgeAccess(request.Context(), request.PathValue("libraryID"), input, authority)
	writeResult(response, result, err, http.StatusOK)
}

func writeResult(response http.ResponseWriter, value any, err error, status int) {
	if err != nil {
		writeError(response, err)
		return
	}
	writeJSON(response, status, value)
}

func writeError(response http.ResponseWriter, err error) {
	var coded *knowledgesdk.Error
	if !errors.As(err, &coded) {
		writeCode(response, http.StatusServiceUnavailable, "knowledge.unavailable", err)
		return
	}
	status := http.StatusServiceUnavailable
	switch coded.Class {
	case "bad_request":
		status = http.StatusBadRequest
	case "forbidden":
		status = http.StatusForbidden
	case "not_found":
		status = http.StatusNotFound
	case "conflict":
		status = http.StatusConflict
	}
	if status == http.StatusConflict {
		var pageConflict interface {
			KnowledgePageConflict() knowledgesdk.KnowledgePageConflict
		}
		if errors.As(err, &pageConflict) {
			conflict := pageConflict.KnowledgePageConflict()
			httpresponse.WriteError(response, nil, httpresponse.Failure{Status: status, Code: knowledgeErrorCode(coded.Code), Cause: err, Params: map[string]string{
				"current_draft_revision": strconv.FormatInt(conflict.CurrentDraftRevision, 10),
				"base_published_version": strconv.FormatInt(conflict.BasePublishedVersion, 10),
				"current_content_sha256": conflict.CurrentContentSHA256,
				"current_updated_at":     conflict.CurrentUpdatedAt.UTC().Format(time.RFC3339Nano),
			}})
			return
		}
	}
	writeCode(response, status, knowledgeErrorCode(coded.Code), err)
}

func knowledgeErrorCode(code string) string {
	code = strings.TrimSpace(code)
	if code == "" || strings.Contains(code, ".") {
		return code
	}
	return "knowledge." + code
}

func writeCode(response http.ResponseWriter, status int, code string, causes ...error) {
	var cause error
	if len(causes) > 0 {
		cause = causes[0]
	}
	httpresponse.WriteError(response, nil, httpresponse.Failure{Status: status, Code: code, Cause: cause})
}

func writeJSON(response http.ResponseWriter, status int, value any) {
	response.Header().Set("Cache-Control", "no-store")
	httpresponse.WriteJSON(response, status, value)
}

var _ modulehttp.Adapter = (*adapter)(nil)
