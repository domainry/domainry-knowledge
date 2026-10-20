// Package connectortransport supplies the standalone Knowledge host's bounded
// outbound capability. Runtime embeddings can instead inject their Transport.
package connectortransport

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"hash"
	"io"
	"net"
	"net/http"
	"net/url"
	"strings"
	"time"

	connector "github.com/domainry/domainry-connector-sdk"
	connectorhttpapi "github.com/domainry/domainry-connector-sdk/providers/knowledge_base/http_api"
)

type HTTP struct {
	origin       *url.URL
	client       *http.Client
	documentPath string
}

// NewKnowledgeDocumentHTTP explicitly adds bounded document management for one
// dedicated KB. The ordinary retrieval transport does not gain write access.
func NewKnowledgeDocumentHTTP(origin, kb string, client *http.Client) (*HTTP, error) {
	if kb == "" || len(kb) > 256 || kb == "." || kb == ".." || strings.ContainsAny(kb, "/\\\x00") {
		return nil, errors.New("knowledge document transport requires a valid KB ID")
	}
	t, err := NewHTTP(origin, client)
	if err != nil {
		return nil, err
	}
	t.documentPath = "/v1/kb/kbs/" + url.PathEscape(kb) + "/documents"
	return t, nil
}

func NewHTTP(origin string, client *http.Client) (*HTTP, error) {
	u, err := url.Parse(origin)
	if err != nil || u.Hostname() == "" || u.User != nil || u.RawQuery != "" || u.ForceQuery || u.Fragment != "" || (u.Path != "" && u.Path != "/") {
		return nil, errors.New("connector transport requires a service origin")
	}
	ip := net.ParseIP(u.Hostname())
	if u.Scheme != "https" && !(u.Scheme == "http" && (u.Hostname() == "localhost" || ip != nil && ip.IsLoopback())) {
		return nil, errors.New("connector transport requires HTTPS or loopback HTTP")
	}
	if client == nil {
		client = &http.Client{Timeout: 30 * time.Second}
	}
	bounded := *client
	// Per-operation contexts own deadlines. A client-wide timeout would abort a
	// legitimate large upload even when the streamed operation allows longer.
	bounded.Timeout = 0
	bounded.CheckRedirect = func(*http.Request, []*http.Request) error { return http.ErrUseLastResponse }
	return &HTTP{origin: u, client: &bounded}, nil
}

func (t *HTTP) RoundTripHTTP(ctx context.Context, in connector.HTTPRequest) (connector.HTTPResponse, error) {
	u, err := url.Parse(in.URL)
	if err != nil || u.Scheme != t.origin.Scheme || !strings.EqualFold(u.Host, t.origin.Host) || u.User != nil || u.Fragment != "" || in.MaxResponseBytes < 1 || in.MaxResponseBytes > 512*1024 || len(in.SecretQuery)+len(in.SecretForm)+len(in.SecretJSON) != 0 {
		return connector.HTTPResponse{}, errors.New("connector request exceeds host transport policy")
	}
	readPath := map[string]bool{
		"/v1/kb/search": true, "/v1/kb/fetch": true,
		"/v1/kb/analysis/tables/catalog": true,
		"/v1/kb/analysis/tables/read":    true,
	}
	streamed := in.Content != nil
	read := !streamed && in.Method == http.MethodPost && readPath[u.EscapedPath()] && u.RawQuery == "" && !u.ForceQuery && len(in.Body) <= 128*1024
	write := false
	if t.documentPath != "" && u.EscapedPath() == t.documentPath {
		q, queryErr := url.ParseQuery(u.RawQuery)
		if queryErr == nil && len(q["doc_id"]) == 1 && strings.TrimSpace(q.Get("doc_id")) != "" && len(q.Get("doc_id")) <= 4096 {
			write = in.Method == http.MethodDelete && !streamed && len(q) == 1 && len(in.Body) == 0 || in.Method == http.MethodPost && streamed && len(q) == 2 && len(q["filename"]) == 1 && q.Get("filename") != "" && len(q.Get("filename")) <= 255
		}
	}
	if streamed {
		q, queryErr := url.ParseQuery(u.RawQuery)
		maximum := int64(0)
		if queryErr == nil {
			maximum = connectorhttpapi.MaximumInlineDocumentBytesForFilename(q.Get("filename"))
		}
		if len(in.Body) != 0 || in.ContentLength < 1 || maximum < 1 || in.ContentLength > maximum || !connector.ValidSHA256(in.ContentSHA256) {
			return connector.HTTPResponse{}, errors.New("connector streamed content identity is invalid")
		}
	}
	if !read && !write {
		return connector.HTTPResponse{}, errors.New("connector operation exceeds host transport policy")
	}
	timeout := in.Timeout
	if timeout == 0 {
		if streamed {
			timeout = 30 * time.Minute
		} else {
			timeout = 30 * time.Second
		}
	}
	if timeout < time.Second || timeout > 2*time.Hour || streamed && timeout < time.Minute {
		return connector.HTTPResponse{}, errors.New("connector request timeout exceeds host transport policy")
	}
	ctx, cancel := context.WithTimeout(ctx, timeout)
	defer cancel()
	var requestBody io.Reader = bytes.NewReader(in.Body)
	var limited *io.LimitedReader
	var digest hashWriter
	if streamed {
		limited = &io.LimitedReader{R: in.Content, N: in.ContentLength + 1}
		digest.hash = sha256.New()
		requestBody = io.TeeReader(limited, &digest)
	}
	req, err := http.NewRequestWithContext(ctx, in.Method, in.URL, requestBody)
	if err != nil {
		return connector.HTTPResponse{}, errors.New("invalid connector request")
	}
	if streamed {
		req.ContentLength = in.ContentLength
	}
	for key, values := range in.Headers {
		for _, value := range values {
			req.Header.Add(key, value)
		}
	}
	for key, values := range in.SecretHeaders {
		if len(req.Header.Values(key)) != 0 {
			return connector.HTTPResponse{}, errors.New("secret header collides with public header")
		}
		for _, value := range values {
			req.Header.Add(key, value)
		}
	}
	response, err := t.client.Do(req)
	if err != nil {
		return connector.HTTPResponse{}, err
	}
	defer response.Body.Close()
	if streamed {
		var extra [1]byte
		n, readErr := limited.Read(extra[:])
		if digest.bytes != in.ContentLength || hex.EncodeToString(digest.hash.Sum(nil)) != in.ContentSHA256 || n != 0 || readErr != io.EOF {
			return connector.HTTPResponse{}, errors.New("connector streamed content identity changed")
		}
	}
	// Return at most limit+1 so the Provider can classify oversized JSON without
	// retaining an unbounded body. HTTP failures never need their response body.
	var body []byte
	if response.StatusCode/100 == 2 {
		body, err = io.ReadAll(io.LimitReader(response.Body, in.MaxResponseBytes+1))
		if err != nil {
			return connector.HTTPResponse{}, err
		}
	}
	return connector.HTTPResponse{StatusCode: response.StatusCode, Body: body}, nil
}

type hashWriter struct {
	hash  hash.Hash
	bytes int64
}

func (w *hashWriter) Write(content []byte) (int, error) {
	n, err := w.hash.Write(content)
	w.bytes += int64(n)
	return n, err
}

func (*HTTP) ExecuteSQL(context.Context, connector.SQLRequest) (connector.SQLResult, error) {
	return connector.SQLResult{}, errors.New("SQL is not enabled for this connector transport")
}
