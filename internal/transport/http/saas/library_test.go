package saas

import (
	"context"
	"encoding/json"
	"errors"
	"testing"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgecontract "github.com/domainry/domainry-knowledge-sdk/contract"
)

type libraryRetrievalProbe struct {
	knowledgecontract.Knowledge
	calls int
}

func (p *libraryRetrievalProbe) SearchLibraryKnowledge(_ context.Context, library, query string, a knowledgesdk.Authority) (knowledgesdk.Result, error) {
	p.calls++
	return knowledgesdk.Result{LibraryID: library, Operation: "search", Query: query}, nil
}
func (p *libraryRetrievalProbe) ReadLibraryKnowledge(_ context.Context, library, document string, a knowledgesdk.Authority) (knowledgesdk.Result, error) {
	p.calls++
	return knowledgesdk.Result{LibraryID: library, Operation: "fetch", DocumentID: document}, nil
}

func TestLibraryDispatchRequiresExactAuthorityAndNeverUsesUnscopedSource(t *testing.T) {
	p := &libraryRetrievalProbe{}
	s := &Server{dependencies: Dependencies{Audience: "runtime-a", Retrieval: p}}
	a := knowledgesdk.Authority{Known: true, RuntimeID: "runtime-a", WorkspaceID: "workspace-a", UserID: "reader-a"}
	for _, operation := range []string{knowledgecontract.SaaSLibrarySearchOperation, knowledgecontract.SaaSLibraryReadOperation} {
		input := map[string]any{"library_id": "library-a", "authority": a}
		if operation == knowledgecontract.SaaSLibrarySearchOperation {
			input["query"] = "export"
		} else {
			input["document_id"] = "document-a"
		}
		raw, _ := json.Marshal(input)
		if _, err := s.dispatch(t.Context(), operation, raw); err != nil {
			t.Fatal(err)
		}
		for _, change := range []func(map[string]any){
			func(v map[string]any) { v["library_id"] = "" },
			func(v map[string]any) { v["library_id"] = " library-a" },
			func(v map[string]any) { b := a; b.Known = false; v["authority"] = b },
			func(v map[string]any) { b := a; b.RuntimeID = "other-runtime"; v["authority"] = b },
			func(v map[string]any) { b := a; b.WorkspaceID = ""; v["authority"] = b },
			func(v map[string]any) { b := a; b.UserID = ""; v["authority"] = b },
			func(v map[string]any) { v["untrusted_extra_field"] = "ignored?" },
		} {
			v := map[string]any{}
			for key, value := range input {
				v[key] = value
			}
			change(v)
			raw, _ := json.Marshal(v)
			before := p.calls
			if _, err := s.dispatch(t.Context(), operation, raw); err == nil || p.calls != before {
				t.Fatalf("invalid scope reached retrieval: operation=%s calls=%d error=%v", operation, p.calls, err)
			}
		}
		missing := &Server{dependencies: Dependencies{Audience: "runtime-a"}}
		raw, _ = json.Marshal(input)
		_, err := missing.dispatch(t.Context(), operation, raw)
		var unavailable *knowledgesdk.Error
		if !errors.As(err, &unavailable) || unavailable.Code != "knowledge.library_retrieval_unavailable" {
			t.Fatal("missing library source did not fail closed", err)
		}
	}
	if p.calls != 2 {
		t.Fatal("unexpected fallback or duplicate retrieval", p.calls)
	}
}
