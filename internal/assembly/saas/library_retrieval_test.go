package saas

import (
	"context"
	"errors"
	"net/http/httptest"
	"path/filepath"
	"strings"
	"sync"
	"sync/atomic"
	"testing"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgecontract "github.com/domainry/domainry-knowledge-sdk/contract"
	knowledgeremote "github.com/domainry/domainry-knowledge-sdk/remote"
)

type currentLibraryPolicy struct{ denied atomic.Bool }

func (*currentLibraryPolicy) ValidateKnowledgeLibraryOrganizationMember(context.Context, string, knowledgesdk.Authority) error {
	return &knowledgesdk.Error{Class: "forbidden", Code: "knowledge.test_organization_not_configured"}
}

func (p *currentLibraryPolicy) ValidateKnowledgeLibraryMember(_ context.Context, user string, a knowledgesdk.Authority) error {
	if p.denied.Load() || user != a.UserID {
		return &knowledgesdk.Error{Class: "forbidden", Code: "knowledge.test_library_denied"}
	}
	return nil
}

func (p *currentLibraryPolicy) AuthorizeKnowledgeLibrary(_ context.Context, _ string, library knowledgesdk.KnowledgeLibrary, a knowledgesdk.Authority) error {
	if p.denied.Load() || a.UserID != library.OwnerUserID {
		return &knowledgesdk.Error{Class: "forbidden", Code: "knowledge.test_library_denied"}
	}
	return nil
}

type remoteLibrarySource struct{ reads atomic.Int64 }

func (*remoteLibrarySource) SearchKnowledge(_ context.Context, query string, _ knowledgesdk.Authority) (knowledgesdk.Result, error) {
	return remoteLibraryResult("search", query, ""), nil
}
func (p *remoteLibrarySource) ReadKnowledge(_ context.Context, document string, _ knowledgesdk.Authority) (knowledgesdk.Result, error) {
	p.reads.Add(1)
	return remoteLibraryResult("fetch", "", document), nil
}
func (*remoteLibrarySource) RevalidateKnowledge(context.Context, knowledgesdk.Result, knowledgesdk.Authority) error {
	return nil
}

func remoteLibraryResult(operation, query, document string) knowledgesdk.Result {
	return knowledgesdk.Result{Provider: "test-reference", Operation: operation, Query: query, DocumentID: document, ScopeSHA256: strings.Repeat("a", 64), Citations: []knowledgesdk.Citation{
		{ID: "citation-a", Provider: "test-reference", Operation: operation, DocumentID: "document-a", Excerpt: "PDF export diagnostic guide"},
	}}
}

func TestRemoteLibraryRetrievalUsesExistingLibraryAndCurrentPolicy(t *testing.T) {
	root := t.TempDir()
	options := Options{RuntimeID: "runtime-a", ServiceAccessToken: "test-token", Database: sqliteDatabase(filepath.Join(root, "knowledge.db")), StoragePath: filepath.Join(root, "storage")}
	authority := knowledgesdk.Authority{Known: true, RuntimeID: "runtime-a", WorkspaceID: "workspace-a", UserID: "reader-a"}
	policy := &currentLibraryPolicy{}
	open := func() (knowledgecontract.Service, knowledgecontract.Knowledge, func()) {
		service, err := Open(t.Context(), options)
		if err != nil {
			t.Fatal(err)
		}
		httpServer := httptest.NewServer(service.Handler())
		var once sync.Once
		close := func() { once.Do(func() { httpServer.Close(); _ = service.Close(context.Background()) }) }
		t.Cleanup(close)
		binding, err := knowledgeremote.NewFactory(knowledgeremote.Config{Endpoint: httpServer.URL, ServiceAccessToken: "test-token"}).OpenSaaS(t.Context(), knowledgecontract.ApplicationRef{RuntimeID: "runtime-a"})
		if err != nil {
			t.Fatal(err)
		}
		clientOptions := knowledgecontract.Options{LibraryAuthorizer: policy}
		source, err := binding.Runtime().Prepare("runtime-a", clientOptions)
		if err != nil {
			t.Fatal(err)
		}
		return binding.Runtime().NewService("runtime-a", clientOptions), source, close
	}
	client, _, closeFirst := open()
	library, err := client.CreateKnowledgeLibrary(t.Context(), knowledgesdk.KnowledgeLibraryCreate{ClientID: "existing-library", Kind: "personal", Name: "Existing support guide"}, authority)
	if err != nil {
		t.Fatal(err)
	}
	closeFirst()
	provider := &remoteLibrarySource{}
	options.Knowledge.LibraryKnowledge = []knowledgecontract.LibraryKnowledgeBinding{{WorkspaceID: authority.WorkspaceID, LibraryID: library.ID, Source: provider}}
	client, source, _ := open()
	saved, err := client.KnowledgeLibrary(t.Context(), library.ID, authority)
	if err != nil || saved.ID != library.ID || saved.Name != library.Name {
		t.Fatalf("saved=%+v error=%v", saved, err)
	}
	scoped, ok := source.(knowledgecontract.LibraryKnowledge)
	if !ok {
		t.Fatal("remote client does not expose library retrieval")
	}
	search, err := scoped.SearchLibraryKnowledge(t.Context(), library.ID, "PDF export", authority)
	if err != nil || search.LibraryID != library.ID || len(search.Citations) != 1 || search.Citations[0].LibraryID != library.ID {
		t.Fatalf("search=%+v error=%v", search, err)
	}
	read, err := scoped.ReadLibraryKnowledge(t.Context(), library.ID, "document-a", authority)
	if err != nil || read.Citations[0].Excerpt != "PDF export diagnostic guide" {
		t.Fatalf("read=%+v error=%v", read, err)
	}
	if err = scoped.RevalidateKnowledge(t.Context(), read, authority); err != nil {
		t.Fatal(err)
	}
	if _, err = scoped.ReadLibraryKnowledge(t.Context(), "", "document-a", authority); err == nil {
		t.Fatal("empty library fell back to a default source")
	}
	foreign := authority
	foreign.WorkspaceID = "other-workspace"
	if _, err = scoped.ReadLibraryKnowledge(t.Context(), library.ID, "document-a", foreign); err == nil {
		t.Fatal("another Workspace read the library")
	}
	policy.denied.Store(true)
	for _, operation := range []func() error{
		func() error {
			_, err := scoped.ReadLibraryKnowledge(t.Context(), library.ID, "document-a", authority)
			return err
		},
		func() error { return scoped.RevalidateKnowledge(t.Context(), read, authority) },
	} {
		var denied *knowledgesdk.Error
		if err := operation(); !errors.As(err, &denied) || denied.Class != "forbidden" {
			t.Fatalf("current revocation was not enforced: %v", err)
		}
	}
	if provider.reads.Load() != 1 {
		t.Fatal("denied calls reached the source or retried with unscoped access", provider.reads.Load())
	}
}
