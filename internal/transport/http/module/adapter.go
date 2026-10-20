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

	agentsdk "github.com/domainry/domainry-agent-sdk"
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
	case knowledgesdk.ActionLibrariesList, knowledgesdk.ActionLibraryMembersList, knowledgesdk.ActionDocumentsList, knowledgesdk.ActionSourcesList:
		return []string{"after", "limit"}
	case knowledgesdk.ActionLibraryMembersSearch:
		return []string{"query", "after", "limit"}
	case knowledgesdk.ActionPagesList:
		return []string{"parent_page_id", "after", "limit", "include_archived"}
	case knowledgesdk.ActionPagesGet:
		return []string{"draft"}
	case knowledgesdk.ActionPageVersionsList:
		return []string{"before", "limit"}
	case knowledgesdk.ActionPageCommentsList:
		return []string{"after", "limit", "unresolved"}
	case knowledgesdk.ActionDocumentsUpload:
		return []string{"client_id", "filename"}
	case knowledgesdk.ActionLibraryMembersRemove, knowledgesdk.ActionDocumentsRetry, knowledgesdk.ActionDocumentsReindex, knowledgesdk.ActionDocumentsDelete:
		return []string{"expected_revision"}
	case knowledgesdk.ActionPrincipalsSearch:
		return []string{"query", "after", "limit"}
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
		knowledgesdk.ActionLibrariesList:             a.listLibraries,
		knowledgesdk.ActionLibrariesCreate:           a.createLibrary,
		knowledgesdk.ActionLibrariesGet:              a.getLibrary,
		knowledgesdk.ActionLibrariesUpdate:           a.updateLibrary,
		knowledgesdk.ActionLibrariesArchive:          a.archiveLibrary,
		knowledgesdk.ActionLibrariesRestore:          a.restoreLibrary,
		knowledgesdk.ActionLibraryMembersList:        a.listMembers,
		knowledgesdk.ActionLibraryMembersSearch:      a.searchLibraryMembers,
		knowledgesdk.ActionLibraryMembersSet:         a.setMember,
		knowledgesdk.ActionLibraryMembersRemove:      a.removeMember,
		knowledgesdk.ActionPagesList:                 a.listPages,
		knowledgesdk.ActionPagesGet:                  a.getPage,
		knowledgesdk.ActionPagesCreate:               a.createPage,
		knowledgesdk.ActionPagesUpdate:               a.saveDraft,
		knowledgesdk.ActionPagesMove:                 a.movePage,
		knowledgesdk.ActionPagesMovePreview:          a.previewPageMove,
		knowledgesdk.ActionPagesReorder:              a.reorderPages,
		knowledgesdk.ActionPagesCopy:                 a.copyPage,
		knowledgesdk.ActionPagesArchive:              a.archivePage,
		knowledgesdk.ActionPagesRestore:              a.restorePage,
		knowledgesdk.ActionPagesPublish:              a.publishPage,
		knowledgesdk.ActionPageAccessGet:             a.getPageAccess,
		knowledgesdk.ActionPageAccessSet:             a.setPageAccess,
		knowledgesdk.ActionPageCollaborationConnect:  a.connectPageCollaboration,
		knowledgesdk.ActionPageCollaborationSync:     a.syncPageCollaboration,
		knowledgesdk.ActionPageCollaborationClose:    a.closePageCollaboration,
		knowledgesdk.ActionPageCollaborationPublish:  a.publishPageCollaboration,
		knowledgesdk.ActionPageVersionsList:          a.listVersions,
		knowledgesdk.ActionPageVersionsGet:           a.getVersion,
		knowledgesdk.ActionPageVersionsDiff:          a.diffVersions,
		knowledgesdk.ActionPageVersionsRestore:       a.restoreVersion,
		knowledgesdk.ActionPageCommentsList:          a.listComments,
		knowledgesdk.ActionPageCommentsCreate:        a.createComment,
		knowledgesdk.ActionPageCommentsUpdate:        a.updateComment,
		knowledgesdk.ActionPageCommentsResolve:       a.resolveComment,
		knowledgesdk.ActionPageCommentsDelete:        a.deleteComment,
		knowledgesdk.ActionPageAttachmentsList:       a.listPageAttachments,
		knowledgesdk.ActionPageAttachmentsSet:        a.setPageAttachment,
		knowledgesdk.ActionPageAttachmentsRemove:     a.removePageAttachment,
		knowledgesdk.ActionDocumentsList:             a.listDocuments,
		knowledgesdk.ActionDocumentsGet:              a.getDocument,
		knowledgesdk.ActionDocumentsUpload:           a.uploadDocument,
		knowledgesdk.ActionDocumentsDownload:         a.downloadDocument,
		knowledgesdk.ActionDocumentsRetry:            a.retryDocument,
		knowledgesdk.ActionDocumentsReindex:          a.reindexDocument,
		knowledgesdk.ActionDocumentsDelete:           a.deleteDocument,
		knowledgesdk.ActionDocumentsTransfer:         a.transferDocument,
		knowledgesdk.ActionDocumentsImportAttachment: a.importAttachment,
		knowledgesdk.ActionSourcesList:               a.listSources,
		knowledgesdk.ActionSourcesBind:               a.bindSource,
		knowledgesdk.ActionAccessExplain:             a.explainAccess,
		knowledgesdk.ActionPrincipalsSearch:          a.searchPrincipals,
		knowledgesdk.ActionPrincipalsResolve:         a.resolvePrincipals,
	}
}

func (a *adapter) authority(request *http.Request) (agentsdk.ConversationAuthority, error) {
	identity, ok := identitysdk.RequestIdentityFromContext(request.Context())
	if !ok || !identity.Principal.Known {
		return agentsdk.ConversationAuthority{}, &agentsdk.Error{Class: "forbidden", Code: "knowledge.principal_required"}
	}
	principal := identity.Principal
	return agentsdk.ConversationAuthority{Known: true, RuntimeID: a.runtimeID, WorkspaceID: strings.TrimSpace(principal.WorkspaceID), UserID: strings.TrimSpace(principal.UserID), RoleKey: strings.TrimSpace(principal.RoleKey)}, nil
}

func authorityOrWriteError(a *adapter, response http.ResponseWriter, request *http.Request) (agentsdk.ConversationAuthority, bool) {
	authority, err := a.authority(request)
	if err != nil {
		writeError(response, err)
		return agentsdk.ConversationAuthority{}, false
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
		return 0, &agentsdk.Error{Class: "bad_request", Code: "knowledge.query_invalid"}
	}
	return value, nil
}

func queryInt64(request *http.Request, key string) (int64, error) {
	raw := strings.TrimSpace(request.URL.Query().Get(key))
	value, err := strconv.ParseInt(raw, 10, 64)
	if err != nil || value < 1 {
		return 0, &agentsdk.Error{Class: "bad_request", Code: "knowledge.query_invalid"}
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
		return false, &agentsdk.Error{Class: "bad_request", Code: "knowledge.query_invalid"}
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
	var input agentsdk.KnowledgeLibraryCreate
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
	var input agentsdk.KnowledgeLibraryUpdate
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
	result, err := a.service.UpdateKnowledgeLibrary(request.Context(), current.ID, agentsdk.KnowledgeLibraryUpdate{ExpectedRevision: input.ExpectedRevision, Name: current.Name, Description: current.Description, Archived: archived}, authority)
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
	var input agentsdk.KnowledgeLibraryMemberWrite
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

func pathVersion(request *http.Request) (int64, error) {
	version, err := strconv.ParseInt(strings.TrimSpace(request.PathValue("version")), 10, 64)
	if err != nil || version < 1 {
		return 0, &agentsdk.Error{Class: "bad_request", Code: "knowledge.page_version_invalid"}
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
	if !rangeOK || total > agentsdk.KnowledgeDocumentMaximumBytes || chunkBytes < 1 || chunkBytes > agentsdk.KnowledgeDocumentUploadChunkBytes || request.ContentLength != chunkBytes || !validSHA256(sha256) || !validSHA256(chunkSHA256) {
		writeCode(response, http.StatusBadRequest, "knowledge.document_upload_invalid")
		return
	}
	_ = http.NewResponseController(response).SetReadDeadline(time.Now().Add(documentTransferTimeout))
	result, err := a.service.UploadKnowledgeDocumentChunk(request.Context(), request.PathValue("libraryID"), agentsdk.KnowledgeDocumentUploadChunk{ClientID: request.URL.Query().Get("client_id"), Filename: request.URL.Query().Get("filename"), Bytes: total, SHA256: sha256, Offset: start, ChunkBytes: chunkBytes, ChunkSHA256: chunkSHA256, Content: http.MaxBytesReader(response, request.Body, agentsdk.KnowledgeDocumentUploadChunkBytes)}, authority)
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
	var result agentsdk.KnowledgeDocument
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
	var input agentsdk.KnowledgeDocumentTransfer
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.TransferKnowledgeDocument(request.Context(), request.PathValue("libraryID"), input, authority)
	writeResult(response, result, err, http.StatusCreated)
}

func (a *adapter) importAttachment(response http.ResponseWriter, request *http.Request) {
	authority, ok := authorityOrWriteError(a, response, request)
	if !ok {
		return
	}
	var input agentsdk.KnowledgeAttachmentImport
	if !decodeJSON(response, request, &input) {
		return
	}
	result, err := a.service.ImportConversationAttachment(request.Context(), request.PathValue("libraryID"), input, authority)
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
	var input agentsdk.KnowledgeLibrarySourceWrite
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
	var coded *agentsdk.Error
	if !errors.As(err, &coded) {
		writeCode(response, http.StatusServiceUnavailable, "knowledge.unavailable")
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
			writeJSON(response, status, struct {
				Code     string                             `json:"code"`
				Conflict knowledgesdk.KnowledgePageConflict `json:"conflict"`
			}{Code: coded.Code, Conflict: pageConflict.KnowledgePageConflict()})
			return
		}
	}
	writeCode(response, status, coded.Code)
}

func writeCode(response http.ResponseWriter, status int, code string) {
	writeJSON(response, status, map[string]string{"code": code})
}

func writeJSON(response http.ResponseWriter, status int, value any) {
	response.Header().Set("Content-Type", "application/json")
	response.Header().Set("Cache-Control", "no-store")
	response.WriteHeader(status)
	_ = json.NewEncoder(response).Encode(value)
}

var _ modulehttp.Adapter = (*adapter)(nil)
