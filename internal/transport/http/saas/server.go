package saas

import (
	"bytes"
	"crypto/rand"
	"crypto/subtle"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"strings"
	"sync"

	"github.com/domainry/domainry-foundation/apperror"
	"github.com/domainry/domainry-foundation/httpresponse"
	"github.com/domainry/domainry-foundation/telemetry"
	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgecontract "github.com/domainry/domainry-knowledge-sdk/contract"
	knowledgefiles "github.com/domainry/domainry-knowledge-sdk/files"
	"github.com/domainry/domainry-knowledge-sdk/saashost"
)

const maxEnvelopeBytes = 40 << 20

type Dependencies struct {
	Audience           string
	ServiceAccessToken string
	Runtime            knowledgecontract.Runtime
	Knowledge          knowledgecontract.Service
	Retrieval          knowledgecontract.Knowledge
	Files              knowledgefiles.Service
	Repository         any
}

type Server struct {
	dependencies Dependencies
	secret       []byte
	sourcesMu    sync.RWMutex
	sources      map[string]agentsdk.ManagedKnowledgeDocumentSource
}

func New(dependencies Dependencies) (*Server, error) {
	if strings.TrimSpace(dependencies.Audience) == "" || strings.TrimSpace(dependencies.ServiceAccessToken) == "" || dependencies.Runtime == nil || dependencies.Knowledge == nil || dependencies.Files == nil || dependencies.Repository == nil {
		return nil, errors.New("Knowledge SaaS server dependencies are incomplete")
	}
	secret := make([]byte, 32)
	if _, err := rand.Read(secret); err != nil {
		return nil, err
	}
	return &Server{dependencies: dependencies, secret: secret, sources: map[string]agentsdk.ManagedKnowledgeDocumentSource{}}, nil
}

func (server *Server) Handler() http.Handler { return http.HandlerFunc(server.serveHTTP) }

func (server *Server) serveHTTP(writer http.ResponseWriter, request *http.Request) {
	recordRoute(request)
	if !server.authenticate(request) {
		writeStatus(writer, http.StatusUnauthorized, "forbidden", "knowledge.service_credential_invalid")
		return
	}
	if request.Header.Get(saashost.RuntimeIDHeader) != server.dependencies.Audience {
		writeStatus(writer, http.StatusForbidden, "forbidden", "knowledge.runtime_mismatch")
		return
	}
	switch {
	case request.Method == http.MethodGet && request.URL.Path == knowledgecontract.SaaSDiscoveryPath:
		writeJSON(writer, http.StatusOK, knowledgecontract.Descriptor{ProtocolVersion: knowledgecontract.SaaSProtocolVersionV1, Mode: knowledgecontract.DeploymentModeSaaS, Audience: server.dependencies.Audience, Capabilities: append([]string(nil), knowledgecontract.SaaSCapabilitiesV1...)})
	case request.Method == http.MethodPost && request.URL.Path == knowledgecontract.SaaSInvokePath:
		server.invoke(writer, request)
	case request.Method == http.MethodPost && request.URL.Path == knowledgecontract.SaaSDocumentUploadPath:
		server.uploadDocument(writer, request)
	case request.Method == http.MethodGet && request.URL.Path == knowledgecontract.SaaSDocumentDownloadPath:
		server.downloadDocument(writer, request)
	case request.Method == http.MethodPost && request.URL.Path == knowledgecontract.SaaSSourceDocumentPutPath:
		server.putSourceDocument(writer, request)
	default:
		writeStatus(writer, http.StatusNotFound, "not_found", "knowledge.route_not_found")
	}
}

func recordRoute(request *http.Request) {
	if request == nil {
		return
	}
	switch {
	case request.Method == http.MethodGet && request.URL.Path == knowledgecontract.SaaSDiscoveryPath:
		telemetry.RecordHTTPRoute(request, "GET "+knowledgecontract.SaaSDiscoveryPath)
	case request.Method == http.MethodPost && request.URL.Path == knowledgecontract.SaaSInvokePath:
		telemetry.RecordHTTPRoute(request, "POST "+knowledgecontract.SaaSInvokePath)
	case request.Method == http.MethodPost && request.URL.Path == knowledgecontract.SaaSDocumentUploadPath:
		telemetry.RecordHTTPRoute(request, "POST "+knowledgecontract.SaaSDocumentUploadPath)
	case request.Method == http.MethodGet && request.URL.Path == knowledgecontract.SaaSDocumentDownloadPath:
		telemetry.RecordHTTPRoute(request, "GET "+knowledgecontract.SaaSDocumentDownloadPath)
	case request.Method == http.MethodPost && request.URL.Path == knowledgecontract.SaaSSourceDocumentPutPath:
		telemetry.RecordHTTPRoute(request, "POST "+knowledgecontract.SaaSSourceDocumentPutPath)
	}
}

func (server *Server) authenticate(request *http.Request) bool {
	want := "Bearer " + strings.TrimSpace(server.dependencies.ServiceAccessToken)
	got := request.Header.Get("Authorization")
	return len(got) == len(want) && subtle.ConstantTimeCompare([]byte(got), []byte(want)) == 1
}

func (server *Server) invoke(writer http.ResponseWriter, request *http.Request) {
	request.Body = http.MaxBytesReader(writer, request.Body, maxEnvelopeBytes)
	decoder := json.NewDecoder(request.Body)
	decoder.DisallowUnknownFields()
	var envelope knowledgecontract.SaaSRequest
	if decoder.Decode(&envelope) != nil || decoder.Decode(&struct{}{}) != io.EOF || strings.TrimSpace(envelope.Operation) == "" || len(envelope.Operation) > 128 {
		writeStatus(writer, http.StatusBadRequest, "bad_request", "knowledge.request_invalid")
		return
	}
	ctx := withGrants(request.Context(), envelope.Operation, server.secret, envelope.Grants)
	result, err := server.dispatch(ctx, envelope.Operation, envelope.Input)
	if err != nil {
		if challenge := challengeResponse(server.secret, envelope.Operation, err); challenge != nil {
			writeJSON(writer, http.StatusOK, knowledgecontract.SaaSResponse{Challenge: challenge})
			return
		}
		writeSaaSError(writer, err)
		return
	}
	raw, err := json.Marshal(result)
	if err != nil {
		httpresponse.WriteError(writer, nil, httpresponse.Failure{Status: http.StatusInternalServerError, Code: "knowledge.response_invalid", Cause: err})
		return
	}
	writeJSON(writer, http.StatusOK, knowledgecontract.SaaSResponse{Result: raw})
}

func decodeInput(raw json.RawMessage, output any) error {
	decoder := json.NewDecoder(bytes.NewReader(raw))
	decoder.DisallowUnknownFields()
	if decoder.Decode(output) != nil || decoder.Decode(&struct{}{}) != io.EOF {
		return &agentsdk.Error{Class: "bad_request", Code: "knowledge.request_invalid"}
	}
	return nil
}
func safeError(err error) *knowledgecontract.SaaSError {
	var fileError *knowledgefiles.Error
	if errors.As(err, &fileError) {
		return &knowledgecontract.SaaSError{Class: safeClass(fileError.Class), Code: safeCode(fileError.Code), Retryable: fileError.Retryable}
	}
	var coded *agentsdk.Error
	if errors.As(err, &coded) {
		result := &knowledgecontract.SaaSError{Class: safeClass(coded.Class), Code: safeCode(coded.Code), Retryable: coded.Retryable}
		var pageConflict interface {
			KnowledgePageConflict() knowledgesdk.KnowledgePageConflict
		}
		if result.Class == "conflict" && errors.As(err, &pageConflict) {
			if raw, marshalErr := json.Marshal(pageConflict.KnowledgePageConflict()); marshalErr == nil {
				result.Details = raw
			}
		}
		return result
	}
	return &knowledgecontract.SaaSError{Class: string(apperror.KindInternal), Code: "knowledge.internal_unavailable"}
}
func safeClass(value apperror.ErrorKind) string {
	switch value {
	case apperror.KindBadRequest,
		apperror.KindForbidden,
		apperror.KindNotFound,
		apperror.KindConflict,
		apperror.KindRateLimited,
		apperror.KindUnavailable,
		apperror.KindInternal:
		return string(value)
	default:
		return string(apperror.KindInternal)
	}
}
func safeCode(value string) string {
	value = strings.TrimSpace(value)
	if value == "" || len(value) > 128 {
		return "knowledge.request_failed"
	}
	for _, r := range value {
		if !(r >= 'a' && r <= 'z' || r >= '0' && r <= '9' || r == '.' || r == '_') {
			return "knowledge.request_failed"
		}
	}
	return value
}
func writeSaaSError(w http.ResponseWriter, err error) {
	status := http.StatusInternalServerError
	if wire := safeError(err); wire != nil {
		switch wire.Class {
		case "bad_request":
			status = http.StatusBadRequest
		case "forbidden":
			status = http.StatusForbidden
		case "not_found":
			status = http.StatusNotFound
		case "conflict":
			status = http.StatusConflict
		case "rate_limited":
			status = http.StatusTooManyRequests
		case "unavailable":
			status = http.StatusServiceUnavailable
		}
		httpresponse.WriteError(w, nil, httpresponse.Failure{Status: status, Code: wire.Code, Message: wire.Message, Cause: err})
	}
}
func writeStatus(w http.ResponseWriter, status int, _ string, code string, causes ...error) {
	var cause error
	if len(causes) > 0 {
		cause = causes[0]
	}
	httpresponse.WriteError(w, nil, httpresponse.Failure{Status: status, Code: code, Cause: cause})
}
func writeJSON(w http.ResponseWriter, status int, value any) {
	httpresponse.WriteJSON(w, status, value)
}
