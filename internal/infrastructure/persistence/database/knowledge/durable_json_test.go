package store

import (
	"bytes"
	"encoding/json"
	"strings"
	"testing"
	"time"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
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

func TestDurableJSONPreservesOpaqueArtifactBodyBytes(t *testing.T) {
	body := json.RawMessage(`{"z":1,"created_at":"user-authored text","a":{"last":2,"first":1}}`)
	want := persistence.ConversationArtifactRecord{Artifact: agentsdk.ConversationArtifact{CreatedAt: time.Date(2026, 9, 25, 0, 0, 0, 123_000_000, time.UTC)}, Body: body}
	raw, err := marshalDurableJSON(want)
	if err != nil {
		t.Fatal(err)
	}
	if !bytes.Contains(raw, []byte(`"created_at":1790294400123`)) || !bytes.Contains(raw, body) {
		t.Fatalf("durable metadata or immutable body changed: %s", raw)
	}
	var got persistence.ConversationArtifactRecord
	if err := unmarshalDurableJSON(raw, &got); err != nil {
		t.Fatal(err)
	}
	if !got.Artifact.CreatedAt.Equal(want.Artifact.CreatedAt) || !bytes.Equal(got.Body, body) {
		t.Fatalf("artifact body did not survive exact round trip: %+v", got)
	}
}

func TestOwnedKnowledgeStorageShapesUseNumericInstants(t *testing.T) {
	instant := time.Date(2026, 9, 25, 0, 0, 0, 123_000_000, time.UTC)
	artifact := agentsdk.ConversationArtifact{CreatedAt: instant, UpdatedAt: instant}
	last := instant
	tests := []struct {
		name   string
		value  any
		target any
	}{
		{"library", agentsdk.KnowledgeLibrary{CreatedAt: instant, UpdatedAt: instant}, &agentsdk.KnowledgeLibrary{}},
		{"member", agentsdk.KnowledgeLibraryMember{UpdatedAt: instant}, &agentsdk.KnowledgeLibraryMember{}},
		{"document", persistence.KnowledgeDocumentRecord{Document: agentsdk.KnowledgeDocument{CreatedAt: instant, UpdatedAt: instant}}, &persistence.KnowledgeDocumentRecord{}},
		{"document lease", persistence.KnowledgeDocumentLease{ExpiresAt: instant}, &persistence.KnowledgeDocumentLease{}},
		{"attachment lease", persistence.ConversationAttachmentIndexLease{ExpiresAt: instant}, &persistence.ConversationAttachmentIndexLease{}},
		{"datasource", persistence.KnowledgeDatasourceBinding{CreatedAt: instant}, &persistence.KnowledgeDatasourceBinding{}},
		{"artifact", artifact, &agentsdk.ConversationArtifact{}},
		{"artifact record", persistence.ConversationArtifactRecord{Artifact: artifact, Body: json.RawMessage(`{"updated_at":"author text"}`)}, &persistence.ConversationArtifactRecord{}},
		{"export", agentsdk.ConversationArtifactExport{CreatedAt: instant, ExpiresAt: instant, LastDownloadedAt: &last}, &agentsdk.ConversationArtifactExport{}},
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
