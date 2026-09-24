package provider

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	connector "github.com/domainry/domainry-connector-sdk"
	connectortransport "github.com/domainry/domainry-knowledge/internal/infrastructure/connectortransport"
)

type permissionProbeSpec struct {
	PublicDocument    string `json:"public_document"`
	PublicMarker      string `json:"public_marker"`
	PrivateDocument   string `json:"private_document,omitempty"`
	PrivateMarker     string `json:"private_marker,omitempty"`
	AllowedPermission string `json:"allowed_permission,omitempty"`
}
type permissionProbeObservation struct {
	Case           string `json:"case"`
	Operation      string `json:"operation"`
	PermissionForm string `json:"permission_form"`
	HTTPStatus     int    `json:"http_status"`
	ErrorCode      *int64 `json:"err_code,omitempty"`
	ResponseBytes  int    `json:"response_bytes"`
}
type permissionProbeReport struct {
	StartedAt    time.Time                    `json:"started_at"`
	Scope        string                       `json:"scope"`
	Spec         permissionProbeSpec          `json:"spec"`
	Observations []permissionProbeObservation `json:"observations"`
	Passed       []string                     `json:"passed"`
	Complete     bool                         `json:"complete"`
	Error        string                       `json:"error,omitempty"`
}

// Only test instrumentation substitutes the documented explicit [] variant.
// Production translation, credentials and outbound limits remain owned by
// the official Connector and the Agent's restricted retrieval transport.
type permissionProbeTransport struct {
	connector.Transport
	Empty  bool
	Case   string
	Report *permissionProbeReport
}

func (p *permissionProbeTransport) RoundTripHTTP(ctx context.Context, in connector.HTTPRequest) (connector.HTTPResponse, error) {
	var payload map[string]json.RawMessage
	if json.Unmarshal(in.Body, &payload) != nil {
		return connector.HTTPResponse{}, errors.New("probe request is not JSON")
	}
	form := "omitted"
	if p.Empty {
		payload["permission_ids"] = json.RawMessage(`[]`)
		var err error
		in.Body, err = json.Marshal(payload)
		if err != nil {
			return connector.HTTPResponse{}, err
		}
	}
	if ids, ok := payload["permission_ids"]; ok {
		form = "nonempty"
		if string(ids) == "[]" {
			form = "empty"
		}
	}
	response, err := p.Transport.RoundTripHTTP(ctx, in)
	var envelope map[string]json.RawMessage
	_ = json.Unmarshal(response.Body, &envelope)
	var code *int64
	if raw := envelope["err_code"]; len(raw) > 0 {
		var value int64
		if json.Unmarshal(raw, &value) == nil {
			code = &value
		}
	}
	operation := "search"
	if strings.HasSuffix(in.URL, "/fetch") {
		operation = "fetch"
	}
	p.Report.Observations = append(p.Report.Observations, permissionProbeObservation{Case: p.Case, Operation: operation, PermissionForm: form, HTTPStatus: response.StatusCode, ErrorCode: code, ResponseBytes: len(response.Body)})
	return response, err
}

func probeSearch(e agentsdk.ConversationKnowledgeResult, doc, marker string, want bool) error {
	var envelope struct {
		Data struct {
			Hits json.RawMessage `json:"hits"`
		} `json:"data"`
	}
	if json.Unmarshal(e.Data, &envelope) != nil || len(bytes.TrimSpace(envelope.Data.Hits)) == 0 || bytes.TrimSpace(envelope.Data.Hits)[0] != '[' {
		return errors.New("search did not return the observed data.hits array")
	}
	var hits []struct {
		Document string `json:"doc_id"`
		Snippet  string `json:"snippet"`
	}
	if json.Unmarshal(envelope.Data.Hits, &hits) != nil {
		return errors.New("search hits have an invalid shape")
	}
	found := false
	for _, hit := range hits {
		if !want && (hit.Document == doc || strings.Contains(hit.Snippet, marker)) {
			return errors.New("private document leaked through search")
		}
		found = found || hit.Document == doc && strings.Contains(hit.Snippet, marker)
	}
	if want && !found {
		return errors.New("expected document and unique marker absent from search")
	}
	return nil
}
func probeFetch(e agentsdk.ConversationKnowledgeResult, marker string) error {
	var envelope struct {
		Data struct {
			Chunks []struct {
				Content string `json:"content"`
			} `json:"chunks"`
		} `json:"data"`
	}
	if json.Unmarshal(e.Data, &envelope) != nil {
		return errors.New("fetch did not return JSON data")
	}
	for _, chunk := range envelope.Data.Chunks {
		if strings.Contains(chunk.Content, marker) {
			return nil
		}
	}
	return errors.New("expected marker absent from fetched chunks")
}

func runKnowledgePermissionProbe(ctx context.Context, config KnowledgeConfig, spec permissionProbeSpec) (report permissionProbeReport, err error) {
	report = permissionProbeReport{StartedAt: time.Now().UTC(), Scope: "public_control_only", Spec: spec, Observations: []permissionProbeObservation{}, Passed: []string{}}
	defer func() {
		if err != nil {
			report.Error = err.Error()
		}
	}()
	private := spec.PrivateDocument != "" || spec.PrivateMarker != "" || spec.AllowedPermission != ""
	if spec.PublicDocument == "" || spec.PublicMarker == "" || private && (spec.PrivateDocument == "" || spec.PrivateMarker == "" || spec.AllowedPermission == "") {
		return report, errors.New("complete explicit public and private test references required")
	}
	if private {
		report.Scope = "private_permission_matrix"
		if spec.PublicDocument == spec.PrivateDocument || spec.PublicMarker == spec.PrivateMarker {
			return report, errors.New("public and private controls must differ")
		}
	}
	transport, e := connectortransport.NewHTTP(config.BaseURL, config.Client)
	if e != nil {
		return report, e
	}
	probe := &permissionProbeTransport{Transport: transport, Report: &report}
	config.Transport = probe
	config.DocumentManagement = false
	config.ResponseMapping = nil
	config.InvalidResponseMapping = false
	config.TopK = 20
	ids := []string(nil)
	config.PermissionIDs = func(_ context.Context, a agentsdk.ConversationAuthority) ([]string, error) {
		if a.UserID != "permission-probe" {
			return nil, errors.New("unexpected test principal")
		}
		return ids, nil
	}
	source, e := newKnowledgeWithOfficialAdapter(config)
	if e != nil {
		return report, e
	}
	a := agentsdk.ConversationAuthority{Known: true, RuntimeID: "permission-probe", WorkspaceID: config.WorkspaceID, UserID: "permission-probe"}
	wrong := "domainry-probe-ungranted:" + fmt.Sprint(time.Now().UnixNano())
	cases := []struct {
		name         string
		ids          []string
		empty, allow bool
	}{{name: "omitted"}, {name: "explicit_empty", empty: true}, {name: "unrelated", ids: []string{wrong}}}
	if private {
		cases = append([]struct {
			name         string
			ids          []string
			empty, allow bool
		}{{name: "allowed", ids: []string{spec.AllowedPermission}, allow: true}}, cases...)
		cases = append(cases, struct {
			name         string
			ids          []string
			empty, allow bool
		}{name: "mixed_exact_match", ids: []string{wrong, spec.AllowedPermission}, allow: true}, struct {
			name         string
			ids          []string
			empty, allow bool
		}{name: "similar_but_not_exact", ids: []string{spec.AllowedPermission + ":ungranted-child"}})
	}
	for _, item := range cases {
		ids, probe.Empty, probe.Case = item.ids, item.empty, item.name
		// Every negative private check has a successful same-request-scope
		// public control. A broken API key or rejected endpoint is not ACL proof.
		publicSearch, e := source.SearchKnowledge(ctx, spec.PublicMarker, a)
		if e != nil {
			return report, fmt.Errorf("%s public search: %w", item.name, e)
		}
		if e = probeSearch(publicSearch, spec.PublicDocument, spec.PublicMarker, true); e != nil {
			return report, fmt.Errorf("%s public search: %w", item.name, e)
		}
		publicRead, e := source.ReadKnowledge(ctx, spec.PublicDocument, a)
		if e != nil {
			return report, fmt.Errorf("%s public fetch: %w", item.name, e)
		}
		if e = probeFetch(publicRead, spec.PublicMarker); e != nil {
			return report, fmt.Errorf("%s public fetch: %w", item.name, e)
		}
		if private {
			searched, e := source.SearchKnowledge(ctx, spec.PrivateMarker, a)
			if e != nil {
				return report, fmt.Errorf("%s private search request unavailable: %w", item.name, e)
			}
			if e = probeSearch(searched, spec.PrivateDocument, spec.PrivateMarker, item.allow); e != nil {
				return report, fmt.Errorf("%s: %w", item.name, e)
			}
			fetched, e := source.ReadKnowledge(ctx, spec.PrivateDocument, a)
			if item.allow {
				if e != nil {
					return report, fmt.Errorf("%s private fetch: %w", item.name, e)
				}
				if e = probeFetch(fetched, spec.PrivateMarker); e != nil {
					return report, e
				}
			} else {
				var coded *agentsdk.Error
				if !errors.As(e, &coded) || coded.Code != "agent.conversation.knowledge_not_found" && coded.Code != "agent.conversation.knowledge_access_denied" {
					return report, fmt.Errorf("%s: private fetch was not explicitly denied", item.name)
				}
				if len(fetched.Data) != 0 || len(fetched.Citations) != 0 {
					return report, errors.New("denied fetch retained model evidence")
				}
			}
		}
		report.Passed = append(report.Passed, item.name)
	}
	if private {
		ids, probe.Empty, probe.Case = []string{spec.AllowedPermission}, false, "saved_evidence"
		saved, e := source.ReadKnowledge(ctx, spec.PrivateDocument, a)
		if e != nil {
			return report, e
		}
		ids, probe.Case = []string{wrong}, "saved_evidence_after_permission_change"
		var coded *agentsdk.Error
		if e = source.RevalidateKnowledge(ctx, saved, a); !errors.As(e, &coded) || coded.Code != "agent.conversation.knowledge_not_found" && coded.Code != "agent.conversation.knowledge_access_denied" {
			return report, errors.New("saved evidence revalidation did not produce a verified access denial")
		}
		report.Passed = append(report.Passed, "saved_evidence_rejected_after_permission_change")
	}
	report.Complete = true
	return report, nil
}

func TestLiveKnowledgePermissionProbe(t *testing.T) {
	if os.Getenv("AGENT_KNOWLEDGE_PERMISSION_PROBE_LIVE") != "1" {
		t.Skip("requires explicit live read-only permission acceptance")
	}
	config := KnowledgeConfigFromEnvironment()
	config.WorkspaceID = "permission-probe"
	if config.BaseURL != "https://api.verdent.ai" {
		t.Fatal("verified Verdent origin required")
	}
	var spec permissionProbeSpec
	if json.Unmarshal([]byte(os.Getenv("AGENT_KNOWLEDGE_PERMISSION_PROBE_SPEC")), &spec) != nil {
		t.Fatal("test references required")
	}
	dir := os.Getenv("AGENT_LIVE_EVIDENCE_DIR")
	if !filepath.IsAbs(dir) {
		t.Fatal("absolute evidence directory required")
	}
	ctx, cancel := context.WithTimeout(t.Context(), 8*time.Minute)
	defer cancel()
	report, err := runKnowledgePermissionProbe(ctx, config, spec)
	raw, marshalErr := json.MarshalIndent(report, "", "  ")
	if marshalErr != nil {
		t.Fatal(marshalErr)
	}
	path := filepath.Join(dir, "permission-report.json")
	if e := os.WriteFile(path, raw, 0600); e != nil {
		t.Fatal(e)
	}
	t.Logf("Permission evidence: %s; scope=%s; completed scenarios=%d", path, report.Scope, len(report.Passed))
	if err != nil {
		t.Fatal(err)
	}
}

func TestKnowledgePermissionProbeRejectsFalsePositiveEvidence(t *testing.T) {
	for _, fault := range []string{"none", "search_leak", "fetch_leak", "global_denial", "malformed_search", "public_hidden", "revalidation_unavailable"} {
		t.Run(fault, func(t *testing.T) {
			spec := permissionProbeSpec{PublicDocument: "public-doc", PublicMarker: "PUBLIC-CONTROL", PrivateDocument: "private-doc", PrivateMarker: "PRIVATE-CONTROL", AllowedPermission: "user:reader"}
			deniedFetches := 0
			server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				var input struct {
					Query    string   `json:"query"`
					Document string   `json:"doc_id"`
					IDs      []string `json:"permission_ids"`
				}
				if json.NewDecoder(r.Body).Decode(&input) != nil {
					t.Error("invalid request")
					return
				}
				allow := false
				for _, id := range input.IDs {
					allow = allow || id == spec.AllowedPermission
				}
				if fault == "global_denial" && !allow {
					http.Error(w, "denied", 403)
					return
				}
				private := input.Query == spec.PrivateMarker || input.Document == spec.PrivateDocument
				doc, marker := spec.PublicDocument, spec.PublicMarker
				if private {
					doc, marker = spec.PrivateDocument, spec.PrivateMarker
				}
				var data any
				if strings.HasSuffix(r.URL.Path, "/search") {
					if fault == "malformed_search" && !allow {
						_, _ = w.Write([]byte(`{"err_code":0,"data":{}}`))
						return
					}
					hits := []any{}
					if !private && (fault != "public_hidden" || allow) || private && (allow || fault == "search_leak") {
						hits = append(hits, map[string]string{"doc_id": doc, "snippet": marker})
					}
					data = map[string]any{"hits": hits}
				} else {
					if private && !allow {
						deniedFetches++
						if fault == "revalidation_unavailable" && deniedFetches == 5 {
							http.Error(w, "unavailable", 503)
							return
						}
					}
					if private && !allow && fault != "fetch_leak" {
						_, _ = w.Write([]byte(`{"err_code":1004,"err_msg":"not visible"}`))
						return
					}
					data = map[string]any{"doc_id": doc, "chunks": []any{map[string]string{"content": marker}}}
				}
				_ = json.NewEncoder(w).Encode(map[string]any{"err_code": 0, "data": data})
			}))
			defer server.Close()
			report, err := runKnowledgePermissionProbe(t.Context(), KnowledgeConfig{BaseURL: server.URL, APIKey: "fixture-only", TeamID: "team", KBID: "kb", WorkspaceID: "workspace", Client: server.Client()}, spec)
			if fault == "none" {
				if err != nil || !report.Complete || len(report.Passed) != 7 {
					t.Fatal(report, err)
				}
				empty := 0
				for _, observation := range report.Observations {
					if observation.PermissionForm == "empty" {
						empty++
					}
				}
				if empty != 4 {
					t.Fatal("explicit [] variant did not reach actual transport", empty)
				}
			} else if err == nil || report.Complete || report.Error == "" {
				t.Fatal("invalid permission evidence passed", fault, report)
			}
		})
	}
}
