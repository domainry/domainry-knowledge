package provider

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync"
	"testing"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
)

func TestKnowledgeDocumentLifecycleUsesScopedConnector(t *testing.T) {
	var mu sync.Mutex
	var stored []byte
	var phase string
	calls := 0
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		mu.Lock()
		defer mu.Unlock()
		calls++
		if r.Header.Get("Authorization") != "Bearer private-key" {
			t.Error("wrong credential")
		}
		if r.URL.Path == "/v1/kb/kbs/kb/documents" {
			if r.URL.Query().Get("doc_id") != "doc-1" {
				t.Error("wrong document ID")
			}
			if r.Method == http.MethodPost {
				if !knowledgeWireFilename.MatchString(r.URL.Query().Get("filename")) || !strings.HasSuffix(r.URL.Query().Get("filename"), ".pdf") || r.Header.Get("Content-Type") != "application/octet-stream" {
					t.Error("wrong upload request")
				}
				wantSource := map[string]string{
					"source": "verdent_knowledge", "source_id": "verdent-main", "title": "季度费用", "page_id": "kpage-safe-1",
					"page_version": "3", "library_kind": "shared", "content_type": "document",
				}
				for key, value := range wantSource {
					if r.URL.Query().Get(key) != value {
						t.Errorf("%s=%q want %q", key, r.URL.Query().Get(key), value)
					}
				}
				var pathSegments []struct {
					ID, Title, Kind string
				}
				if json.Unmarshal([]byte(r.URL.Query().Get("path_segments")), &pathSegments) != nil || len(pathSegments) != 2 || pathSegments[0].ID != "kpage-parent-1" || pathSegments[0].Kind != "folder" || pathSegments[1].ID != "kpage-safe-1" || pathSegments[1].Kind != "document" {
					t.Errorf("wrong path segments: %+v", pathSegments)
				}
				stored, _ = io.ReadAll(r.Body)
				phase = "PENDING"
				w.WriteHeader(202)
				io.WriteString(w, `{"err_code":0,"data":{"status":"PENDING"}}`)
				return
			}
			if r.Method != http.MethodDelete {
				t.Error("wrong document method")
			}
			stored = nil
			phase = ""
			io.WriteString(w, `{"err_code":0,"data":{"deleted":true}}`)
			return
		}
		var body map[string]any
		if json.NewDecoder(r.Body).Decode(&body) != nil || body["team_id"] != "team" || body["kb_id"] != "kb" || body["doc_id"] != "doc-1" {
			t.Error("wrong inspection scope")
		}
		if stored == nil {
			io.WriteString(w, `{"err_code":1004,"err_msg":"document not found"}`)
			return
		}
		_ = json.NewEncoder(w).Encode(map[string]any{"err_code": 0, "data": map[string]any{"doc_id": "doc-1", "status": phase, "chunks": []any{}}})
	}))
	defer server.Close()
	config := KnowledgeConfig{BaseURL: server.URL, APIKey: "private-key", TeamID: "team", KBID: "kb", WorkspaceID: "workspace", Client: server.Client(), DocumentSourceProvider: "verdent_knowledge", DocumentSourceID: "verdent-main"}
	read, err := newKnowledgeWithOfficialAdapter(config)
	if err != nil {
		t.Fatal(err)
	}
	a := knowledgeAuthority()
	raw := bytes.Repeat([]byte{0, 0xff, 0x80, 1}, 65536)
	content := agentsdk.KnowledgeDocumentIndexContent{DocumentID: "doc-1", Filename: "费用.pdf", Bytes: int64(len(raw)), SHA256: testContentHash(raw), Content: bytes.NewReader(raw), Source: &agentsdk.KnowledgeDocumentIndexSource{Title: "季度费用", PageID: "kpage-safe-1", PageVersion: 3, LibraryKind: "shared", ContentType: "document", Breadcrumbs: []agentsdk.KnowledgePageBreadcrumb{{PageID: "kpage-parent-1", Title: "研发空间"}, {PageID: "kpage-safe-1", Title: "季度费用"}}}}
	if err := read.PutKnowledgeDocument(t.Context(), content, a); err == nil {
		t.Fatal("retrieval config granted writes")
	}
	if err := read.DeleteKnowledgeDocument(t.Context(), content.DocumentID, a); err == nil {
		t.Fatal("retrieval config granted deletes")
	}
	mu.Lock()
	before := calls
	mu.Unlock()
	if before != 0 {
		t.Fatal("disabled writes reached network")
	}
	config.DocumentManagement = true
	source, err := newKnowledgeWithOfficialAdapter(config)
	if err != nil {
		t.Fatal(err)
	}
	content.AccessPolicySHA256 = source.KnowledgeDocumentAccessPolicySHA256()
	state, err := source.InspectKnowledgeDocument(t.Context(), content.DocumentID, a)
	if err != nil || state.Exists {
		t.Fatal("preflight absence missing", err)
	}
	foreign := a
	foreign.WorkspaceID = "other"
	if err := source.PutKnowledgeDocument(t.Context(), content, foreign); err == nil {
		t.Fatal("foreign workspace wrote document")
	}
	if err := source.PutKnowledgeDocument(t.Context(), content, a); err != nil {
		t.Fatal(err)
	}
	state, err = source.InspectKnowledgeDocument(t.Context(), content.DocumentID, a)
	if err != nil || !state.Exists || state.IndexStatus != "PENDING" {
		t.Fatal("pending treated as ready", state, err)
	}
	mu.Lock()
	if !bytes.Equal(stored, raw) {
		t.Error("original byte stream changed")
	}
	phase = "INDEXED"
	mu.Unlock()
	state, err = source.InspectKnowledgeDocument(t.Context(), content.DocumentID, a)
	if err != nil || state.IndexStatus != "INDEXED" {
		t.Fatal("index state lost", err)
	}
	if err := source.DeleteKnowledgeDocument(t.Context(), content.DocumentID, a); err != nil {
		t.Fatal(err)
	}
	state, err = source.InspectKnowledgeDocument(t.Context(), content.DocumentID, a)
	if err != nil || state.Exists {
		t.Fatal("deletion not verified", err)
	}
}
