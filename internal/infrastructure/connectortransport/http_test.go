package connectortransport

import (
	"bytes"
	"crypto/sha256"
	"encoding/hex"
	"io"
	"net/http"
	"net/http/httptest"
	"sync/atomic"
	"testing"

	connector "github.com/domainry/domainry-connector-sdk"
	connectorhttpapi "github.com/domainry/domainry-connector-sdk/providers/knowledge_base/http_api"
)

func streamedRequest(target string, data []byte) connector.HTTPRequest {
	digest := sha256.Sum256(data)
	return connector.HTTPRequest{Method: http.MethodPost, URL: target, Content: bytes.NewReader(data), ContentLength: int64(len(data)), ContentSHA256: hex.EncodeToString(digest[:]), MaxResponseBytes: 512 * 1024, Headers: map[string][]string{"Content-Type": {"application/octet-stream"}}, SecretHeaders: map[string][]string{"Authorization": {"Bearer test-secret"}}}
}

func TestKnowledgeDocumentTransportRequiresExactGrantedKB(t *testing.T) {
	var calls atomic.Int32
	data := bytes.Repeat([]byte{0, 0xff, '%'}, 65536)
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		calls.Add(1)
		body, _ := io.ReadAll(r.Body)
		if r.Method == http.MethodPost && !bytes.Equal(body, data) {
			t.Error("document bytes changed")
		}
		if r.Header.Get("Authorization") != "Bearer test-secret" {
			t.Error("secret missing")
		}
		io.WriteString(w, `{"err_code":0}`)
	}))
	defer server.Close()
	read, err := NewHTTP(server.URL, server.Client())
	if err != nil {
		t.Fatal(err)
	}
	doc, err := NewKnowledgeDocumentHTTP(server.URL, "one", server.Client())
	if err != nil {
		t.Fatal(err)
	}
	target := server.URL + "/v1/kb/kbs/one/documents?doc_id=d&filename=f.md"
	put := streamedRequest(target, data)
	if _, err := read.RoundTripHTTP(t.Context(), put); err == nil || calls.Load() != 0 {
		t.Fatal("read transport accepted document write")
	}
	if _, err := doc.RoundTripHTTP(t.Context(), streamedRequest(target, data)); err != nil {
		t.Fatal(err)
	}
	remove := put
	remove.Method = http.MethodDelete
	remove.Content, remove.ContentLength, remove.ContentSHA256 = nil, 0, ""
	remove.URL = server.URL + "/v1/kb/kbs/one/documents?doc_id=d"
	if _, err := doc.RoundTripHTTP(t.Context(), remove); err != nil {
		t.Fatal(err)
	}
	for _, mutate := range []func(*connector.HTTPRequest){
		func(r *connector.HTTPRequest) {
			r.URL = server.URL + "/v1/kb/kbs/other/documents?doc_id=d&filename=f.md"
		},
		func(r *connector.HTTPRequest) {
			r.URL = server.URL + "/v1/kb/kbs/one/documents?doc_id=d&filename=f.md&permission_ids=public"
		},
		func(r *connector.HTTPRequest) {
			r.URL = server.URL + "/v1/kb/kbs/one/documents?doc_id=d&doc_id=other&filename=f.md"
		},
		func(r *connector.HTTPRequest) {
			r.URL = server.URL + "/v1/kb/kbs/one/../other/documents?doc_id=d&filename=f.md"
		},
		func(r *connector.HTTPRequest) {
			r.URL = server.URL + "/v1/kb/kbs/one/documents?doc_id=d&filename=f.md#fragment"
		},
		func(r *connector.HTTPRequest) {
			r.URL = "https://foreign.example/v1/kb/kbs/one/documents?doc_id=d&filename=f.md"
		},
		func(r *connector.HTTPRequest) { r.Method = http.MethodGet },
		func(r *connector.HTTPRequest) { r.Method = http.MethodDelete },
		func(r *connector.HTTPRequest) { r.ContentLength = connectorhttpapi.MaximumInlineDocumentBytes + 1 },
		func(r *connector.HTTPRequest) { r.SecretQuery = map[string]string{"key": "secret"} },
		func(r *connector.HTTPRequest) { r.MaxResponseBytes = 1024 * 1024 },
		func(r *connector.HTTPRequest) { r.Headers = map[string][]string{"Authorization": {"public"}} },
	} {
		in := streamedRequest(target, data)
		mutate(&in)
		if _, err := doc.RoundTripHTTP(t.Context(), in); err == nil {
			t.Fatal("ungranted document request accepted")
		}
	}
	if calls.Load() != 2 {
		t.Fatal("rejected request reached network")
	}
	if _, err := NewKnowledgeDocumentHTTP(server.URL, "../other", server.Client()); err == nil {
		t.Fatal("unsafe KB path accepted")
	}
}

func TestKnowledgeDocumentTransportDoesNotFollowRedirects(t *testing.T) {
	var redirected atomic.Int32
	target := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { redirected.Add(1) }))
	defer target.Close()
	source := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, target.URL, http.StatusTemporaryRedirect)
	}))
	defer source.Close()
	transport, err := NewKnowledgeDocumentHTTP(source.URL, "kb", source.Client())
	if err != nil {
		t.Fatal(err)
	}
	request := streamedRequest(source.URL+"/v1/kb/kbs/kb/documents?doc_id=d&filename=f.txt", []byte("private document"))
	request.SecretHeaders = map[string][]string{"Authorization": {"Bearer secret"}}
	out, err := transport.RoundTripHTTP(t.Context(), request)
	if err != nil || out.StatusCode != 307 || redirected.Load() != 0 {
		t.Fatal("redirect forwarded document or credentials", err)
	}
}
