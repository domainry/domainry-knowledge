package provider

import (
	"io"
	"net/http"
	"net/http/httptest"
	"sync/atomic"
	"testing"

	agentsdk "github.com/domainry/domainry-agent-sdk"
)

func TestKnowledgeDeleteRecoveryPreservesAuthorizationAndTarget(t *testing.T) {
	var calls atomic.Int64
	upstream := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		attempt := calls.Add(1)
		if r.Method != http.MethodDelete || r.URL.Path != "/v1/kb/kbs/private/documents" || r.URL.Query().Get("doc_id") != "immutable-document" || len(r.URL.Query()) != 1 || r.Header.Get("X-KB-Permission-Ids") != "" {
			t.Error("recovery changed target or ACL")
		}
		if attempt == 1 {
			http.Error(w, "purge incomplete", http.StatusServiceUnavailable)
			return
		}
		io.WriteString(w, `{"err_code":0,"data":{"ok":true,"stats":{"vectors_deleted":0}}}`)
	}))
	defer upstream.Close()
	a := knowledgeAuthority()
	c := KnowledgeConfig{BaseURL: upstream.URL, APIKey: "synthetic", TeamID: "team", KBID: "private", WorkspaceID: a.WorkspaceID, ResponseMapping: &KnowledgeResponseMapping{Search: &KnowledgeCitationMapping{Items: "/hits", Many: true, DocumentID: "/doc_id", Excerpt: "/body"}, Fetch: &KnowledgeCitationMapping{Items: "/data", DocumentID: "/doc_id", Excerpt: "/body"}}}
	readOnly, err := NewKnowledge(c)
	if err != nil {
		t.Fatal(err)
	}
	if readOnly.RecoverKnowledgeDocumentDelete(t.Context(), "immutable-document", a) == nil || calls.Load() != 0 {
		t.Fatal("recovery enabled writes on a retrieval-only connection")
	}
	factory, err := NewAttachmentKnowledge(c, a.RuntimeID)
	if err != nil {
		t.Fatal(err)
	}
	scope, err := factory.ResolveAttachmentKnowledge(t.Context(), "conv_0123456789abcdef0123456789abcdef", a)
	if err != nil {
		t.Fatal(err)
	}
	recovery, ok := scope.Source.(agentsdk.KnowledgeDocumentDeleteRecoverySource)
	if !ok {
		t.Fatal("scoped source lost recovery contract")
	}
	for _, field := range []string{"known", "runtime", "workspace", "user"} {
		foreign := a
		switch field {
		case "known":
			foreign.Known = false
		case "runtime":
			foreign.RuntimeID = "other-runtime"
		case "workspace":
			foreign.WorkspaceID = "other-workspace"
		case "user":
			foreign.UserID = "other-user"
		}
		if recovery.RecoverKnowledgeDocumentDelete(t.Context(), "immutable-document", foreign) == nil || calls.Load() != 0 {
			t.Fatalf("foreign %s reached recovery transport", field)
		}
	}
	if recovery.RecoverKnowledgeDocumentDelete(t.Context(), "../foreign", a) == nil || calls.Load() != 0 {
		t.Fatal("invalid target reached recovery transport")
	}
	if recovery.RecoverKnowledgeDocumentDelete(t.Context(), "immutable-document", a) == nil || calls.Load() != 1 {
		t.Fatal("failed recovery was acknowledged or implicitly retried")
	}
	if err := recovery.RecoverKnowledgeDocumentDelete(t.Context(), "immutable-document", a); err != nil || calls.Load() != 2 {
		t.Fatal("same-document idempotent recovery failed", err)
	}
}
