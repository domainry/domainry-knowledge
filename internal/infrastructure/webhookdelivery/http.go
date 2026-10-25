package webhookdelivery

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net"
	"net/http"
	"net/netip"
	"strconv"
	"strings"
	"time"

	"github.com/domainry/domainry-foundation/telemetry"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

const deliveryTimeout = 10 * time.Second

type HTTP struct {
	client *http.Client
}

func New(client *http.Client) *HTTP {
	if client == nil {
		dialer := &net.Dialer{Timeout: 5 * time.Second, KeepAlive: 30 * time.Second}
		transport := &http.Transport{
			Proxy:                 nil,
			ForceAttemptHTTP2:     true,
			TLSHandshakeTimeout:   5 * time.Second,
			ResponseHeaderTimeout: 5 * time.Second,
			IdleConnTimeout:       30 * time.Second,
			DialContext: func(ctx context.Context, network, address string) (net.Conn, error) {
				host, port, err := net.SplitHostPort(address)
				if err != nil || port != "443" {
					return nil, fmt.Errorf("webhook endpoint address is invalid")
				}
				addresses, err := net.DefaultResolver.LookupNetIP(ctx, "ip", host)
				if err != nil {
					return nil, fmt.Errorf("resolve webhook endpoint: %w", err)
				}
				if len(addresses) == 0 {
					return nil, fmt.Errorf("resolve webhook endpoint: no addresses")
				}
				for _, address := range addresses {
					if !publicWebhookIP(address) {
						return nil, fmt.Errorf("webhook endpoint resolved to a non-public address")
					}
				}
				return dialer.DialContext(ctx, network, net.JoinHostPort(addresses[0].String(), port))
			},
		}
		client = &http.Client{
			Transport: transport,
			Timeout:   deliveryTimeout,
			CheckRedirect: func(*http.Request, []*http.Request) error {
				return http.ErrUseLastResponse
			},
		}
	}
	client = telemetry.InstrumentHTTPClientWithOptions(client, "domainry.knowledge.webhook", telemetry.HTTPClientInstrumentationOptions{DisableDiagnosticContent: true})
	return &HTTP{client: client}
}

func publicWebhookIP(address netip.Addr) bool {
	return address.IsValid() && address.IsGlobalUnicast() && !address.IsPrivate() && !address.IsLoopback() && !address.IsLinkLocalUnicast() && !address.IsUnspecified()
}

func retryAfter(header string, now time.Time) time.Time {
	header = strings.TrimSpace(header)
	if seconds, err := strconv.Atoi(header); err == nil && seconds > 0 {
		if seconds > 86400 {
			seconds = 86400
		}
		return now.Add(time.Duration(seconds) * time.Second)
	}
	if value, err := http.ParseTime(header); err == nil && value.After(now) {
		if value.After(now.Add(24 * time.Hour)) {
			return now.Add(24 * time.Hour)
		}
		return value.UTC()
	}
	return time.Time{}
}

func (delivery *HTTP) DeliverKnowledgeWebhook(ctx context.Context, input knowledgesdk.KnowledgeWebhookDeliveryRequest) (knowledgesdk.KnowledgeWebhookDeliveryResult, error) {
	if delivery == nil || delivery.client == nil || strings.TrimSpace(input.ApplicationKey) == "" || strings.TrimSpace(input.EndpointURL) == "" || strings.TrimSpace(input.IdempotencyKey) == "" {
		return knowledgesdk.KnowledgeWebhookDeliveryResult{}, fmt.Errorf("webhook delivery request is incomplete")
	}
	body, err := json.Marshal(input.Event)
	if err != nil {
		return knowledgesdk.KnowledgeWebhookDeliveryResult{}, err
	}
	ctx = telemetry.WithHTTPClientOperation(ctx, "knowledge.webhook.deliver")
	request, err := http.NewRequestWithContext(ctx, http.MethodPost, input.EndpointURL, strings.NewReader(string(body)))
	if err != nil || request.URL.Scheme != "https" || request.URL.Hostname() == "" || request.URL.User != nil || request.URL.Port() != "" && request.URL.Port() != "443" {
		return knowledgesdk.KnowledgeWebhookDeliveryResult{}, fmt.Errorf("webhook endpoint is invalid")
	}
	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("User-Agent", "Domainry-Knowledge-Webhook/1.0")
	request.Header.Set("Idempotency-Key", input.IdempotencyKey)
	request.Header.Set("X-Domainry-Application", input.ApplicationKey)
	request.Header.Set("X-Domainry-Event-ID", input.Event.ID)
	request.Header.Set("X-Domainry-Event-Type", input.Event.Type)
	response, err := delivery.client.Do(request)
	if err != nil {
		return knowledgesdk.KnowledgeWebhookDeliveryResult{}, err
	}
	defer response.Body.Close()
	_, _ = io.CopyN(io.Discard, response.Body, 4096)
	result := knowledgesdk.KnowledgeWebhookDeliveryResult{StatusCode: response.StatusCode}
	if response.StatusCode >= 200 && response.StatusCode < 300 {
		result.Delivered = true
		return result, nil
	}
	result.ErrorCode = fmt.Sprintf("http_status_%d", response.StatusCode)
	if response.StatusCode == http.StatusRequestTimeout || response.StatusCode == http.StatusTooManyRequests || response.StatusCode >= 500 {
		result.RetryAt = retryAfter(response.Header.Get("Retry-After"), time.Now().UTC())
	}
	return result, nil
}

var _ knowledgesdk.KnowledgeWebhookDeliverer = (*HTTP)(nil)
