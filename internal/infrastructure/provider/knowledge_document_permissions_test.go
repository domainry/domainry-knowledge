package provider

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"slices"
	"strings"
	"sync/atomic"
	"testing"

	agentsdk "github.com/domainry/domainry-agent-sdk"
)

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
	k, err := NewKnowledge(c)
	if err != nil {
		t.Fatal(err)
	}
	ids[0] = "changed"
	a := knowledgeAuthority()
	in := agentsdk.KnowledgeDocumentContent{DocumentID: "doc-1", Filename: "季度费用.XLSX", Data: []byte("fixture"), RequestID: "persisted-request", AccessPolicySHA256: k.KnowledgeDocumentAccessPolicySHA256()}
	if len(in.AccessPolicySHA256) != 64 {
		t.Fatal("missing access fingerprint")
	}
	for _, invalid := range []agentsdk.KnowledgeDocumentContent{
		{DocumentID: in.DocumentID, Filename: in.Filename, Data: in.Data, RequestID: in.RequestID},
		{DocumentID: in.DocumentID, Filename: in.Filename, Data: in.Data, AccessPolicySHA256: in.AccessPolicySHA256},
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
		other, err := NewKnowledge(c)
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
	c.PermissionIDs = func(context.Context, agentsdk.ConversationAuthority) ([]string, error) { return nil, nil }
	if _, err := NewKnowledge(c); err == nil {
		t.Fatal("fixed writes combined with dynamic reads")
	}
}
