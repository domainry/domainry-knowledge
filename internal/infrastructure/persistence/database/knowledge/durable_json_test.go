package store

import (
	"bytes"
	"encoding/json"
	"strings"
	"testing"
	"time"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
)

func TestDurableJSONUsesUnixMillisecondsAndRejectsStringTime(t *testing.T) {
	want := time.Date(2026, time.September, 25, 7, 5, 6, 789000000, time.FixedZone("source", 8*60*60))
	raw, err := marshalDurableJSON(agentsdk.KnowledgeLibrary{CreatedAt: want, UpdatedAt: want})
	if err != nil {
		t.Fatal(err)
	}
	if got := string(raw); !strings.Contains(got, `"created_at":1790291106789`) {
		t.Fatalf("durable JSON must contain UTC Unix milliseconds, got %s", got)
	}
	var decoded agentsdk.KnowledgeLibrary
	if err = unmarshalDurableJSON(raw, &decoded); err != nil {
		t.Fatal(err)
	}
	if !decoded.CreatedAt.Equal(want) {
		t.Fatalf("decoded time = %s, want instant %s", decoded.CreatedAt, want)
	}
	if err = unmarshalDurableJSON([]byte(`{"created_at":"2026-09-25T07:05:06.789+08:00"}`), &decoded); err == nil {
		t.Fatal("expected durable string timestamp to be rejected")
	}
}

func TestOwnedKnowledgeStorageShapesUseNumericInstants(t *testing.T) {
	instant := time.Date(2026, 9, 25, 0, 0, 0, 123_000_000, time.UTC)
	tests := []struct {
		name   string
		value  any
		target any
	}{
		{"library", agentsdk.KnowledgeLibrary{CreatedAt: instant, UpdatedAt: instant}, &agentsdk.KnowledgeLibrary{}},
		{"member", agentsdk.KnowledgeLibraryMember{UpdatedAt: instant}, &agentsdk.KnowledgeLibraryMember{}},
		{"document", persistence.KnowledgeDocumentRecord{Document: agentsdk.KnowledgeDocument{CreatedAt: instant, UpdatedAt: instant}}, &persistence.KnowledgeDocumentRecord{}},
		{"document lease", persistence.KnowledgeDocumentLease{ExpiresAt: instant}, &persistence.KnowledgeDocumentLease{}},
		{"datasource", persistence.KnowledgeDatasourceBinding{CreatedAt: instant}, &persistence.KnowledgeDatasourceBinding{}},
		{"page view", knowledgesdk.KnowledgePageView{Page: knowledgesdk.KnowledgePage{CreatedAt: instant, UpdatedAt: instant}, Published: &knowledgesdk.KnowledgePageVersion{PublishedAt: instant}, Draft: &knowledgesdk.KnowledgePageDraft{UpdatedAt: instant}}, &knowledgesdk.KnowledgePageView{}},
		{"page page", knowledgesdk.KnowledgePagePage{Items: []knowledgesdk.KnowledgePage{{CreatedAt: instant, UpdatedAt: instant}}, Complete: true}, &knowledgesdk.KnowledgePagePage{}},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			raw, err := marshalDurableJSON(test.value)
			if err != nil {
				t.Fatal(err)
			}
			if !bytes.Contains(raw, []byte(`1790294400123`)) || bytes.Contains(raw, []byte(`"2026-09-25T00:00:00.123Z"`)) {
				t.Fatalf("owned instant must be a number: %s", raw)
			}
			if err := unmarshalDurableJSON(raw, test.target); err != nil {
				t.Fatal(err)
			}
			want, err := json.Marshal(test.value)
			if err != nil {
				t.Fatal(err)
			}
			got, err := json.Marshal(test.target)
			if err != nil || !bytes.Equal(got, want) {
				t.Fatalf("round trip got=%s want=%s err=%v", got, want, err)
			}
		})
	}
}
