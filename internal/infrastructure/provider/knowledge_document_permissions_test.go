package provider

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"slices"
	"strings"
	"sync"
	"sync/atomic"
	"testing"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
)

func TestKnowledgePagePermissionSearchBatchesWithoutTruncationAndGloballyRanks(t *testing.T) {
	pagePermissions := make([]string, 5000)
	for index := range pagePermissions {
		pagePermissions[index] = fmt.Sprintf("page:%04d", index)
	}
	var mu sync.Mutex
	seen := map[string]int{}
	requests := 0
	upstream := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var input struct {
			PermissionIDs []string `json:"permission_ids"`
		}
		if json.NewDecoder(r.Body).Decode(&input) != nil {
			t.Error("invalid search body")
		}
		mu.Lock()
		requests++
		requestNumber := requests
		for _, id := range input.PermissionIDs {
			seen[id]++
		}
		mu.Unlock()
		hitID, score := "remote-first", 0.6
		if requestNumber == 2 {
			hitID, score = "remote-second", 0.9
		}
		_ = json.NewEncoder(w).Encode(map[string]any{"hits": []map[string]any{
			{"doc_id": "remote-public", "record_id": "public", "doc_version": 1, "record_kind": "text", "title": "public", "source_url": "", "anchor_ref": "", "snippet": "public", "score": 0.5},
			{"doc_id": hitID, "record_id": hitID, "doc_version": 1, "record_kind": "text", "title": hitID, "source_url": "", "anchor_ref": "", "snippet": hitID, "score": score},
		}, "mode_used": "hybrid", "reranked": true})
	}))
	defer upstream.Close()
	k, err := newKnowledgeWithOfficialAdapter(KnowledgeConfig{BaseURL: upstream.URL, APIKey: "fixture", TeamID: "team", KBID: "kb", WorkspaceID: "workspace", DocumentManagement: true, DocumentPermissionIDs: []string{"library:read"}, ReadPermissionIDs: []string{"library:read"}, TopK: 3})
	if err != nil {
		t.Fatal(err)
	}
	result, err := k.SearchKnowledgeDocumentsWithPermissions(t.Context(), "query", pagePermissions, knowledgeAuthority())
	if err != nil {
		t.Fatal(err)
	}
	if requests != 2 || len(seen) != len(pagePermissions)+1 || seen["library:read"] != 2 {
		t.Fatalf("permissions were truncated or base policy was not repeated: requests=%d seen=%d base=%d", requests, len(seen), seen["library:read"])
	}
	for _, id := range pagePermissions {
		if seen[id] != 1 {
			t.Fatalf("permission %q was lost or repeated: %d", id, seen[id])
		}
	}
	if len(result.Passages) != 3 || result.Passages[0].DocumentID != "remote-second" || result.Passages[1].DocumentID != "remote-first" || result.Passages[2].DocumentID != "remote-public" {
		t.Fatalf("batch results were not globally ranked and deduplicated: %+v", result.Passages)
	}
}

func TestKnowledgePermissionBatchingHonorsMeasuredASCIIByteBoundary(t *testing.T) {
	permissions := make([]string, 1200)
	for index := range permissions {
		permissions[index] = fmt.Sprintf("%04d:%s", index, strings.Repeat("x", 120))
	}
	batches, err := knowledgeQueryPermissionBatches([]string{"library"}, permissions)
	if err != nil || len(batches) < 2 {
		t.Fatalf("byte-bound permission set was not split: batches=%d err=%v", len(batches), err)
	}
	seen := map[string]bool{}
	for _, batch := range batches {
		if len(batch) > knowledgeQueryPermissionMaximumIDs || knowledgeQueryPermissionBytes(batch) > knowledgeQueryPermissionMaximumBytes || !slices.Contains(batch, "library") {
			t.Fatalf("invalid permission batch count=%d bytes=%d", len(batch), knowledgeQueryPermissionBytes(batch))
		}
		for _, id := range batch {
			if id != "library" {
				seen[id] = true
			}
		}
	}
	if len(seen) != len(permissions) {
		t.Fatalf("byte batching truncated tokens: got=%d want=%d", len(seen), len(permissions))
	}
}

func TestKnowledgePrivateDocumentPolicyBindsWritesReadsAndInspection(t *testing.T) {
	var calls atomic.Int64
	upstream := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		calls.Add(1)
		if r.URL.Path == "/v1/kb/kbs/kb/documents" {
			if r.Method == "POST" {
				if r.Header.Get("X-KB-Permission-Ids") != `["a:read","z:read"]` || r.Header.Get("X-KB-Request-ID") != "persisted-request" {
					t.Error("upload policy or stable command lost")
				}
				if !knowledgeWireFilename.MatchString(r.URL.Query().Get("filename")) || !strings.HasSuffix(r.URL.Query().Get("filename"), ".xlsx") {
					t.Error("non-ASCII filename or lost parser extension")
				}
			} else if r.Header.Get("X-KB-Permission-Ids") != "" {
				t.Error("delete mutated ACL")
			}
			io.WriteString(w, `{"err_code":0}`)
			return
		}
		var in struct {
			IDs []string `json:"permission_ids"`
		}
		if json.NewDecoder(r.Body).Decode(&in) != nil || !slices.Equal(in.IDs, []string{"a:read", "z:read"}) {
			t.Error("read/inspect used different ACL from upload")
		}
		io.WriteString(w, `{"err_code":0,"data":{"doc_id":"doc-1","status":"INDEXED","hits":[]}}`)
	}))
	defer upstream.Close()
	ids := []string{"z:read", "a:read", "z:read"}
	c := KnowledgeConfig{BaseURL: upstream.URL, APIKey: "fixture", TeamID: "team", KBID: "kb", WorkspaceID: "workspace", DocumentManagement: true, DocumentPermissionIDs: ids}
	k, err := newKnowledgeWithOfficialAdapter(c)
	if err != nil {
		t.Fatal(err)
	}
	ids[0] = "changed"
	a := knowledgeAuthority()
	raw := []byte("fixture")
	in := agentsdk.KnowledgeDocumentIndexContent{DocumentID: "doc-1", Filename: "季度费用.XLSX", Bytes: int64(len(raw)), SHA256: testContentHash(raw), Content: bytes.NewReader(raw), RequestID: "persisted-request", AccessPolicySHA256: k.KnowledgeDocumentAccessPolicySHA256()}
	if len(in.AccessPolicySHA256) != 64 {
		t.Fatal("missing access fingerprint")
	}
	for _, invalid := range []agentsdk.KnowledgeDocumentIndexContent{
		{DocumentID: in.DocumentID, Filename: in.Filename, Bytes: in.Bytes, SHA256: in.SHA256, Content: bytes.NewReader(raw), RequestID: in.RequestID},
		{DocumentID: in.DocumentID, Filename: in.Filename, Bytes: in.Bytes, SHA256: in.SHA256, Content: bytes.NewReader(raw), AccessPolicySHA256: in.AccessPolicySHA256},
	} {
		if k.PutKnowledgeDocument(t.Context(), invalid, a) == nil {
			t.Fatal("unfrozen policy or missing command accepted")
		}
	}
	if calls.Load() != 0 {
		t.Fatal("rejected upload reached IO")
	}
	if err := k.PutKnowledgeDocument(t.Context(), in, a); err != nil {
		t.Fatal(err)
	}
	if _, err := k.Search(t.Context(), "query", a); err != nil {
		t.Fatal(err)
	}
	if _, err := k.Fetch(t.Context(), in.DocumentID, a); err != nil {
		t.Fatal(err)
	}
	if _, err := k.InspectKnowledgeDocument(t.Context(), in.DocumentID, a); err != nil {
		t.Fatal(err)
	}
	if err := k.DeleteKnowledgeDocument(t.Context(), in.DocumentID, a); err != nil {
		t.Fatal(err)
	}
	if calls.Load() != 5 {
		t.Fatal("unexpected calls")
	}
	for _, tc := range []struct {
		ids  []string
		same bool
	}{{[]string{"a:read", "z:read"}, true}, {[]string{"other"}, false}, {nil, false}} {
		c.DocumentPermissionIDs = tc.ids
		c.APIKey = "rotated"
		other, err := newKnowledgeWithOfficialAdapter(c)
		if err != nil {
			t.Fatal(err)
		}
		if other.KnowledgeDocumentSourceIdentity() != k.KnowledgeDocumentSourceIdentity() {
			t.Fatal("policy rotation bypasses physical managed source guard")
		}
		if (other.KnowledgeDocumentAccessPolicySHA256() == in.AccessPolicySHA256) != tc.same {
			t.Fatal("policy fingerprint unstable or unchanged after ACL change")
		}
	}
	c.DocumentPermissionIDs = []string{"private"}
	c.PermissionIDs = func(context.Context, agentsdk.Authority) ([]string, error) { return nil, nil }
	if _, err := newKnowledgeWithOfficialAdapter(c); err == nil {
		t.Fatal("fixed writes combined with dynamic reads")
	}
}

func TestKnowledgeSeparatesDocumentGrantsFromPrincipalReadIdentities(t *testing.T) {
	documentPermissions := []string{"scope:conversation"}
	readPermissions := []string{"scope:conversation", "scope:organization", "scope:user", "scope:workspace"}
	var uploadChecked, readChecked bool
	upstream := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/v1/kb/kbs/kb/documents" {
			uploadChecked = r.Method == http.MethodPost && r.Header.Get("X-KB-Permission-Ids") == `["scope:conversation"]`
			io.WriteString(w, `{"err_code":0}`)
			return
		}
		var in struct {
			IDs []string `json:"permission_ids"`
		}
		_ = json.NewDecoder(r.Body).Decode(&in)
		readChecked = slices.Equal(in.IDs, readPermissions)
		io.WriteString(w, `{"err_code":0,"data":{"doc_id":"doc-1","status":"INDEXED","hits":[]}}`)
	}))
	defer upstream.Close()
	c := KnowledgeConfig{BaseURL: upstream.URL, APIKey: "fixture", TeamID: "team", KBID: "kb", WorkspaceID: "workspace", DocumentManagement: true, DocumentPermissionIDs: documentPermissions, ReadPermissionIDs: readPermissions}
	k, err := newKnowledgeWithOfficialAdapter(c)
	if err != nil {
		t.Fatal(err)
	}
	a := knowledgeAuthority()
	raw := []byte("private")
	if err = k.PutKnowledgeDocument(t.Context(), agentsdk.KnowledgeDocumentIndexContent{DocumentID: "doc-1", Filename: "private.txt", Bytes: int64(len(raw)), SHA256: testContentHash(raw), Content: bytes.NewReader(raw), RequestID: "request-1", AccessPolicySHA256: k.KnowledgeDocumentAccessPolicySHA256()}, a); err != nil {
		t.Fatal(err)
	}
	if _, err = k.Search(t.Context(), "private", a); err != nil {
		t.Fatal(err)
	}
	if !uploadChecked || !readChecked {
		t.Fatalf("upload=%t read=%t", uploadChecked, readChecked)
	}
}

func TestKnowledgeProjectionInspectionUsesExactPagePermission(t *testing.T) {
	var seen [][]string
	upstream := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var input struct {
			PermissionIDs []string `json:"permission_ids"`
		}
		if json.NewDecoder(r.Body).Decode(&input) != nil {
			t.Error("invalid inspection body")
		}
		seen = append(seen, slices.Clone(input.PermissionIDs))
		io.WriteString(w, `{"err_code":0,"data":{"doc_id":"doc-page","status":"INDEXED","hits":[]}}`)
	}))
	defer upstream.Close()
	k, err := newKnowledgeWithOfficialAdapter(KnowledgeConfig{
		BaseURL: upstream.URL, APIKey: "fixture", TeamID: "team", KBID: "kb", WorkspaceID: "workspace",
		DocumentManagement: true, DocumentPermissionIDs: []string{"space:library"}, ReadPermissionIDs: []string{"space:library"},
	})
	if err != nil {
		t.Fatal(err)
	}
	if _, err = k.InspectKnowledgeDocument(t.Context(), "doc-page", knowledgeAuthority()); err != nil {
		t.Fatal(err)
	}
	if _, err = k.InspectKnowledgeDocumentWithPermissions(t.Context(), "doc-page", []string{"scope:knowledge:page:token"}, knowledgeAuthority()); err != nil {
		t.Fatal(err)
	}
	if len(seen) != 2 || !slices.Equal(seen[0], []string{"space:library"}) || !slices.Equal(seen[1], []string{"scope:knowledge:page:token"}) {
		t.Fatalf("inspection did not preserve the page ACL boundary: %+v", seen)
	}
}
