package applicationcardprovider

import (
	"testing"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func TestWebResolvesAnHTTPSResourceWithoutFetchingIt(t *testing.T) {
	provider := Web{}
	card, err := provider.ResolveKnowledgeApplicationCard(t.Context(), knowledgesdk.KnowledgeApplicationCardProviderInput{
		Kind: knowledgesdk.KnowledgeApplicationCardWeb, ResourceID: "https://example.com/acceptance?from=knowledge",
	})
	if err != nil {
		t.Fatal(err)
	}
	if provider.Key() != "web" || len(provider.Kinds()) != 1 || provider.Kinds()[0] != knowledgesdk.KnowledgeApplicationCardWeb {
		t.Fatalf("unexpected provider contract: key=%q kinds=%v", provider.Key(), provider.Kinds())
	}
	if card.Title != "example.com" || card.Subtitle != "https://example.com/acceptance?from=knowledge" || card.URL != card.Subtitle || card.Status != "可打开" || card.UpdatedAt.IsZero() {
		t.Fatalf("unexpected web card: %#v", card)
	}
}

func TestWebRejectsNonHTTPSResources(t *testing.T) {
	for _, resourceID := range []string{"http://example.com", "https://user@example.com", "not-a-url"} {
		if _, err := (Web{}).ResolveKnowledgeApplicationCard(t.Context(), knowledgesdk.KnowledgeApplicationCardProviderInput{Kind: knowledgesdk.KnowledgeApplicationCardWeb, ResourceID: resourceID}); err == nil {
			t.Fatalf("expected %q to be rejected", resourceID)
		}
	}
}
