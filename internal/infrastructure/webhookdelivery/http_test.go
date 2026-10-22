package webhookdelivery

import (
	"context"
	"io"
	"net/http"
	"net/netip"
	"strings"
	"testing"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

type roundTripFunc func(*http.Request) (*http.Response, error)

func (function roundTripFunc) RoundTrip(request *http.Request) (*http.Response, error) {
	return function(request)
}

func TestPublicWebhookIPRejectsLocalAndPrivateNetworks(t *testing.T) {
	for _, value := range []string{"127.0.0.1", "10.0.0.1", "172.16.0.1", "192.168.1.1", "169.254.169.254", "::1", "fc00::1", "fe80::1"} {
		if publicWebhookIP(netip.MustParseAddr(value)) {
			t.Fatalf("non-public address accepted: %s", value)
		}
	}
	if !publicWebhookIP(netip.MustParseAddr("8.8.8.8")) || !publicWebhookIP(netip.MustParseAddr("2606:4700:4700::1111")) {
		t.Fatal("public address rejected")
	}
}

func TestHTTPDeliveryCarriesStableIdentityAndClassifiesRetry(t *testing.T) {
	client := &http.Client{Transport: roundTripFunc(func(request *http.Request) (*http.Response, error) {
		if request.Method != http.MethodPost || request.URL.String() != "https://hooks.example.org/knowledge" || request.Header.Get("Idempotency-Key") != "event-1" || request.Header.Get("X-Domainry-Event-Type") != knowledgesdk.KnowledgeWebhookPagePublished {
			t.Fatalf("unexpected request: method=%s url=%s headers=%v", request.Method, request.URL, request.Header)
		}
		return &http.Response{StatusCode: http.StatusTooManyRequests, Header: http.Header{"Retry-After": []string{"5"}}, Body: io.NopCloser(strings.NewReader("rate limited")), Request: request}, nil
	})}
	result, err := New(client).DeliverKnowledgeWebhook(context.Background(), knowledgesdk.KnowledgeWebhookDeliveryRequest{
		ApplicationKey: "trusted.app", EndpointURL: "https://hooks.example.org/knowledge", IdempotencyKey: "event-1",
		Event: knowledgesdk.KnowledgeWebhookEvent{ID: "event-1", Type: knowledgesdk.KnowledgeWebhookPagePublished},
	})
	if err != nil || result.Delivered || result.StatusCode != http.StatusTooManyRequests || result.ErrorCode != "http_status_429" || result.RetryAt.IsZero() {
		t.Fatalf("unexpected delivery result: %+v err=%v", result, err)
	}
}
