package product

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io/fs"
	"net/http"
	"net/url"
	"strings"

	"github.com/domainry/domainry-foundation/httpresponse"
	"github.com/domainry/domainry-foundation/modulehttp"
	"github.com/domainry/domainry-foundation/requestcontext"
	identitysdk "github.com/domainry/domainry-identity-sdk"
	identityprincipal "github.com/domainry/domainry-identity-sdk/authorization/principal"
	identityhttpapi "github.com/domainry/domainry-identity-sdk/httpapi"
	"github.com/domainry/domainry-identity-sdk/httpmiddleware"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func (host *Host) newHandler(options Options, knowledgeAdapters []modulehttp.Adapter) (http.Handler, error) {
	authenticator, err := identityprincipal.NewAuthenticator(host.identity, identityprincipal.Options{})
	if err != nil {
		return nil, fmt.Errorf("assemble Identity principal authenticator: %w", err)
	}
	authentication, err := httpmiddleware.New(authenticator, httpmiddleware.WithBindingCredential(host.identity), httpmiddleware.WithAuthorization(host.identity.Authorization()))
	if err != nil {
		return nil, err
	}
	mux := http.NewServeMux()
	identityProvider, ok := host.identity.(identityhttpapi.Provider)
	if !ok {
		return nil, fmt.Errorf("Identity module HTTP adapters are unavailable")
	}
	browserMounted := 0
	for _, adapter := range identityProvider.HTTPAdapters() {
		if adapter == nil || adapter.Owner() != "identity" || adapter.Name() != "browser_authentication" {
			continue
		}
		if err = modulehttp.ValidateAdapter(adapter); err != nil {
			return nil, err
		}
		for _, route := range adapter.Routes() {
			if err = mountRoute(mux, route.Pattern(), adapter.Handler()); err != nil {
				return nil, err
			}
			browserMounted++
		}
	}
	if browserMounted == 0 {
		return nil, fmt.Errorf("Identity browser authentication routes are unavailable")
	}

	mux.HandleFunc("GET /app/config", func(response http.ResponseWriter, _ *http.Request) {
		writeJSON(response, http.StatusOK, map[string]any{"mode": "identity", "workspace_id": host.workspaceID, "runtime_id": host.runtimeID, "modules": []string{"identity", "knowledge"}})
	})
	mux.Handle("GET /app/session", authentication.Authenticate(http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
		identity, _ := identitysdk.RequestIdentityFromContext(request.Context())
		principal := identity.Principal
		writeJSON(response, http.StatusOK, map[string]any{
			"mode": "identity", "runtime_id": host.runtimeID, "workspace_id": principal.WorkspaceID,
			"user_id": principal.UserID, "name": principal.User.Name, "scope": productScope(host.runtimeID, principal.WorkspaceID, principal.UserID),
			"must_change_password": principal.MustChangePassword, "ready": true, "modules": []string{"identity", "knowledge"},
		})
	})))

	for _, adapter := range knowledgeAdapters {
		if adapter == nil || adapter.Owner() != "knowledge" {
			return nil, fmt.Errorf("Knowledge module adapter owner mismatch")
		}
		if err = modulehttp.ValidateAdapter(adapter); err != nil {
			return nil, err
		}
		for _, route := range adapter.Routes() {
			browserHandler := authentication.Authenticate(authentication.RequirePasswordChanged(adapter.Handler()))
			handler := host.authenticateKnowledgeRoute(route.Action.Key, adapter.Handler(), browserHandler)
			if err = mountRoute(mux, route.Pattern(), handler); err != nil {
				return nil, err
			}
		}
	}
	retrieval := authentication.Authenticate(authentication.RequirePasswordChanged(http.HandlerFunc(host.searchKnowledge)))
	mux.Handle("GET /knowledge/search", retrieval)
	mux.Handle("GET /knowledge/retrieval/documents/{documentID}", authentication.Authenticate(authentication.RequirePasswordChanged(http.HandlerFunc(host.readKnowledge))))

	if options.Files != nil {
		mux.Handle("/", spaFiles(options.Files))
	} else {
		mux.HandleFunc("/", func(response http.ResponseWriter, request *http.Request) {
			httpresponse.WriteError(response, request, httpresponse.Failure{Status: http.StatusNotFound, Code: "knowledge.ui_unavailable"})
		})
	}
	origin, err := url.Parse(options.Origin)
	if err != nil || (origin.Scheme != "http" && origin.Scheme != "https") || origin.Host == "" || origin.Path != "" || origin.RawQuery != "" || origin.Fragment != "" || origin.User != nil {
		return nil, fmt.Errorf("Knowledge product origin must be an exact HTTP(S) origin")
	}
	return http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
		response.Header().Set("Cache-Control", "no-store")
		response.Header().Set("X-Content-Type-Options", "nosniff")
		response.Header().Set("Referrer-Policy", "no-referrer")
		frameSources := "'none'"
		if len(host.embedFrameOrigins) > 0 {
			frameSources = strings.Join(host.embedFrameOrigins, " ")
		}
		response.Header().Set("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; font-src 'self' data:; connect-src 'self'; worker-src 'self' blob:; frame-src "+frameSources+"; frame-ancestors 'none'; base-uri 'none'; form-action 'self'")
		unsafe := request.Method != http.MethodGet && request.Method != http.MethodHead && request.Method != http.MethodOptions
		if request.Host != origin.Host || request.Header.Get("Origin") != "" && request.Header.Get("Origin") != options.Origin || unsafe && request.Header.Get("Origin") != options.Origin {
			httpresponse.WriteError(response, request, httpresponse.Failure{Status: http.StatusForbidden, Code: "knowledge.origin_required"})
			return
		}
		mux.ServeHTTP(response, request)
	}), nil
}

func (host *Host) authenticateKnowledgeRoute(action string, applicationHandler, browserHandler http.Handler) http.Handler {
	return http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
		header := strings.TrimSpace(request.Header.Get("Authorization"))
		parts := strings.SplitN(header, " ", 2)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") || strings.TrimSpace(parts[1]) == "" || len(host.trustedApplications.Registrations()) == 0 {
			browserHandler.ServeHTTP(response, request)
			return
		}
		verification, ok := host.identity.(identitysdk.ApplicationServiceVerificationBinding)
		if !ok || verification.ApplicationServiceVerifier() == nil {
			browserHandler.ServeHTTP(response, request)
			return
		}
		principal, verifyErr := verification.ApplicationServiceVerifier().Verify(request.Context(), identitysdk.VerifyApplicationServiceTokenRequest{
			AccessToken: strings.TrimSpace(parts[1]), Audience: host.application.ApplicationKey,
			Grant: identitysdk.ApplicationServiceGrant{Resource: identitysdk.ResourceType("knowledge_action"), Action: identitysdk.Action(action)},
		})
		if verifyErr != nil {
			browserHandler.ServeHTTP(response, request)
			return
		}
		registration, allowed := host.trustedApplications.Authorize(string(principal.Application.ApplicationKey), action)
		if !allowed || string(principal.Application.WorkspaceID) != host.workspaceID || principal.Audience != host.application.ApplicationKey {
			httpresponse.WriteError(response, request, httpresponse.Failure{Status: http.StatusForbidden, Code: "knowledge.trusted_application_denied"})
			return
		}
		resolution, resolveErr := host.identity.Principals().Resolve(requestcontext.WithWorkspaceID(request.Context(), host.workspaceID), identitysdk.PrincipalResolutionRequest{SubjectID: identitysdk.SubjectID(registration.ServiceUserID)})
		if resolveErr != nil || !resolution.Principal.Known || resolution.Principal.WorkspaceID != host.workspaceID || resolution.Principal.UserID != registration.ServiceUserID {
			httpresponse.WriteError(response, request, httpresponse.Failure{Status: http.StatusForbidden, Code: "knowledge.trusted_application_principal_unavailable", Cause: resolveErr})
			return
		}
		resolved := resolution.Principal
		resolved.AccessBundle = &resolution.AccessBundle
		identity := identitysdk.RequestIdentity{Principal: resolved, AccessToken: strings.TrimSpace(parts[1])}
		applicationHandler.ServeHTTP(response, request.WithContext(identitysdk.WithRequestIdentity(request.Context(), identity)))
	})
}

func mountRoute(mux *http.ServeMux, pattern string, handler http.Handler) (err error) {
	defer func() {
		if recover() != nil {
			err = fmt.Errorf("module HTTP route %q is invalid or duplicated", pattern)
		}
	}()
	mux.Handle(pattern, handler)
	return nil
}

func productScope(runtimeID, workspaceID, userID string) string {
	payload, _ := json.Marshal([]string{runtimeID, workspaceID, userID})
	digest := sha256.Sum256(payload)
	return hex.EncodeToString(digest[:])
}

func authorityFromRequest(request *http.Request, runtimeID string) (knowledgesdk.Authority, error) {
	identity, ok := identitysdk.RequestIdentityFromContext(request.Context())
	if !ok || !identity.Principal.Known {
		return knowledgesdk.Authority{}, &knowledgesdk.Error{Class: "forbidden", Code: "knowledge.principal_required"}
	}
	principal := identity.Principal
	return knowledgesdk.Authority{Known: true, RuntimeID: runtimeID, WorkspaceID: principal.WorkspaceID, UserID: principal.UserID, RoleKey: principal.RoleKey, OrgID: principal.OrgID, OrgScopeIDs: append([]string(nil), principal.OrgScopeIDs...), AccountType: principal.User.AccountType}, nil
}

type libraryRetrieval interface {
	SearchLibraryKnowledge(context.Context, string, string, knowledgesdk.Authority) (knowledgesdk.Result, error)
	ReadLibraryKnowledge(context.Context, string, string, knowledgesdk.Authority) (knowledgesdk.Result, error)
}

func (host *Host) searchKnowledge(response http.ResponseWriter, request *http.Request) {
	query := strings.TrimSpace(request.URL.Query().Get("query"))
	libraryID := strings.TrimSpace(request.URL.Query().Get("library_id"))
	if query == "" || len(query) > 8192 || len(request.URL.Query()) > 2 {
		httpresponse.WriteError(response, request, httpresponse.Failure{Status: http.StatusBadRequest, Code: "knowledge.query_invalid"})
		return
	}
	authority, err := authorityFromRequest(request, host.runtimeID)
	if err != nil {
		writeKnowledgeError(response, err)
		return
	}
	if host.retrieval == nil {
		httpresponse.WriteError(response, request, httpresponse.Failure{Status: http.StatusServiceUnavailable, Code: "knowledge.retrieval_unavailable"})
		return
	}
	var result knowledgesdk.Result
	if libraryID != "" {
		librarySource, ok := host.retrieval.(libraryRetrieval)
		if !ok {
			httpresponse.WriteError(response, request, httpresponse.Failure{Status: http.StatusServiceUnavailable, Code: "knowledge.library_retrieval_unavailable"})
			return
		}
		result, err = librarySource.SearchLibraryKnowledge(request.Context(), libraryID, query, authority)
	} else {
		result, err = host.retrieval.SearchKnowledge(request.Context(), query, authority)
	}
	if err != nil {
		writeKnowledgeError(response, err)
		return
	}
	writeJSON(response, http.StatusOK, result)
}

func (host *Host) readKnowledge(response http.ResponseWriter, request *http.Request) {
	documentID := strings.TrimSpace(request.PathValue("documentID"))
	libraryID := strings.TrimSpace(request.URL.Query().Get("library_id"))
	if documentID == "" || len(documentID) > 512 || len(request.URL.Query()) > 1 {
		httpresponse.WriteError(response, request, httpresponse.Failure{Status: http.StatusBadRequest, Code: "knowledge.request_invalid"})
		return
	}
	authority, err := authorityFromRequest(request, host.runtimeID)
	if err != nil {
		writeKnowledgeError(response, err)
		return
	}
	if host.retrieval == nil {
		httpresponse.WriteError(response, request, httpresponse.Failure{Status: http.StatusServiceUnavailable, Code: "knowledge.retrieval_unavailable"})
		return
	}
	var result knowledgesdk.Result
	if libraryID != "" {
		librarySource, ok := host.retrieval.(libraryRetrieval)
		if !ok {
			httpresponse.WriteError(response, request, httpresponse.Failure{Status: http.StatusServiceUnavailable, Code: "knowledge.library_retrieval_unavailable"})
			return
		}
		result, err = librarySource.ReadLibraryKnowledge(request.Context(), libraryID, documentID, authority)
	} else {
		result, err = host.retrieval.ReadKnowledge(request.Context(), documentID, authority)
	}
	if err != nil {
		writeKnowledgeError(response, err)
		return
	}
	writeJSON(response, http.StatusOK, result)
}

func writeKnowledgeError(response http.ResponseWriter, err error) {
	status, code := http.StatusInternalServerError, "knowledge.request_failed"
	var coded *knowledgesdk.Error
	if errors.As(err, &coded) {
		if strings.TrimSpace(coded.Code) != "" {
			code = coded.Code
		}
		switch coded.Class {
		case "bad_request":
			status = http.StatusBadRequest
		case "forbidden":
			status = http.StatusForbidden
		case "not_found":
			status = http.StatusNotFound
		case "conflict":
			status = http.StatusConflict
		case "unavailable":
			status = http.StatusServiceUnavailable
		}
	}
	httpresponse.WriteError(response, nil, httpresponse.Failure{Status: status, Code: code, Cause: err})
}

func writeJSON(response http.ResponseWriter, status int, value any) {
	httpresponse.WriteJSON(response, status, value)
}

func spaFiles(files fs.FS) http.Handler {
	server := http.FileServer(http.FS(files))
	return http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
		name := strings.TrimPrefix(request.URL.Path, "/")
		if name == "" {
			name = "index.html"
		}
		if _, err := fs.Stat(files, name); err == nil {
			server.ServeHTTP(response, request)
			return
		}
		content, err := fs.ReadFile(files, "index.html")
		if err != nil {
			httpresponse.WriteError(response, request, httpresponse.Failure{Status: http.StatusInternalServerError, Code: "knowledge.ui_unavailable", Cause: err})
			return
		}
		response.Header().Set("Content-Type", "text/html; charset=utf-8")
		_, _ = response.Write(content)
	})
}
