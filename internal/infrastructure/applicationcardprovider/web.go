// Package applicationcardprovider contains application-card providers owned by
// the standalone Knowledge product.
package applicationcardprovider

import (
	"context"
	"fmt"
	"net/url"
	"strings"
	"time"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

// Web resolves a public HTTPS resource without fetching it. The card remains
// useful in the standalone product while keeping third-party credentials and
// response payloads out of Knowledge page content.
type Web struct{}

func (Web) Key() string { return "web" }

func (Web) Kinds() []string { return []string{knowledgesdk.KnowledgeApplicationCardWeb} }

func (Web) ResolveKnowledgeApplicationCard(_ context.Context, input knowledgesdk.KnowledgeApplicationCardProviderInput) (knowledgesdk.KnowledgeApplicationCard, error) {
	raw := strings.TrimSpace(input.ResourceID)
	parsed, err := url.ParseRequestURI(raw)
	if err != nil || parsed.Scheme != "https" || parsed.Hostname() == "" || parsed.User != nil {
		return knowledgesdk.KnowledgeApplicationCard{}, fmt.Errorf("web application card requires an HTTPS URL")
	}
	return knowledgesdk.KnowledgeApplicationCard{
		Title:     parsed.Hostname(),
		Subtitle:  raw,
		Status:    "可打开",
		URL:       raw,
		UpdatedAt: time.Now().UTC(),
	}, nil
}

func Defaults() []knowledgesdk.KnowledgeApplicationCardProvider {
	return []knowledgesdk.KnowledgeApplicationCardProvider{Web{}}
}
