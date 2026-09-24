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

	agentsdk "github.com/domainry/domainry-agent-sdk"
	knowledgecontract "github.com/domainry/domainry-knowledge-sdk/contract"
	"github.com/domainry/domainry-knowledge-sdk/saashost"
	lifecyclecontract "github.com/domainry/domainry-lifecycle-sdk/contract"
)

const maxEnvelopeBytes = 40 << 20

type Dependencies struct {
	Audience              string
	ServiceAccessToken    string
	Runtime               knowledgecontract.Runtime
	Knowledge             knowledgecontract.Service
	ConversationKnowledge knowledgecontract.ConversationKnowledge
	Artifacts             knowledgecontract.ArtifactMutationService
	Subjects              lifecyclecontract.SubjectExecutionHandler
	Repository            any
}

type Server struct {
	dependencies Dependencies
	secret       []byte
	sourcesMu    sync.RWMutex
	sources      map[string]agentsdk.ManagedKnowledgeDocumentSource
}

func New(dependencies Dependencies) (*Server, error) {
	if strings.TrimSpace(dependencies.Audience) == "" || strings.TrimSpace(dependencies.ServiceAccessToken) == "" || dependencies.Runtime == nil || dependencies.Knowledge == nil || dependencies.Artifacts == nil || dependencies.Subjects == nil || dependencies.Repository == nil {
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
	writer.Header().Set("Content-Type", "application/json")
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
	default:
		writeStatus(writer, http.StatusNotFound, "not_found", "knowledge.route_not_found")
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
		writeJSON(writer, http.StatusOK, knowledgecontract.SaaSResponse{Error: safeError(err)})
		return
	}
	raw, err := json.Marshal(result)
	if err != nil {
		writeJSON(writer, http.StatusOK, knowledgecontract.SaaSResponse{Error: &knowledgecontract.SaaSError{Class: "unavailable", Code: "knowledge.response_invalid"}})
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
	var coded *agentsdk.Error
	if errors.As(err, &coded) {
		return &knowledgecontract.SaaSError{Class: safeClass(coded.Class), Code: safeCode(coded.Code), Retryable: coded.Retryable}
	}
	return &knowledgecontract.SaaSError{Class: "unavailable", Code: "knowledge.internal_unavailable"}
}
func safeClass(value string) string {
	switch value {
	case "bad_request", "forbidden", "not_found", "conflict", "unavailable":
		return value
	default:
		return "unavailable"
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
func writeStatus(w http.ResponseWriter, status int, class, code string) {
	writeJSON(w, status, knowledgecontract.SaaSResponse{Error: &knowledgecontract.SaaSError{Class: class, Code: code}})
}
func writeJSON(w http.ResponseWriter, status int, value any) {
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}
