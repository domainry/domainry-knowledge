package store

import (
	"bytes"
	"encoding/json"
	"strings"
	"testing"
	"time"
)

func TestDurableJSONUsesUnixMillisecondsAndRejectsStringTime(t *testing.T) {
	type record struct {
		CreatedAt time.Time `json:"created_at"`
	}
	want := time.Date(2026, time.September, 25, 7, 5, 6, 789000000, time.FixedZone("source", 8*60*60))
	raw, err := marshalDurableJSON(record{CreatedAt: want})
	if err != nil {
		t.Fatal(err)
	}
	if got := string(raw); !strings.Contains(got, `"created_at":1790291106789`) {
		t.Fatalf("durable JSON must contain UTC Unix milliseconds, got %s", got)
	}
	var decoded record
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
	type record struct {
		CreatedAt time.Time       `json:"created_at"`
		Body      json.RawMessage `json:"body"`
	}
	body := json.RawMessage(`{"z":1,"created_at":"user-authored text","a":{"last":2,"first":1}}`)
	want := record{CreatedAt: time.Date(2026, 9, 25, 0, 0, 0, 123_000_000, time.UTC), Body: body}
	raw, err := marshalDurableJSON(want)
	if err != nil {
		t.Fatal(err)
	}
	if !bytes.Contains(raw, []byte(`"created_at":1790294400123`)) || !bytes.Contains(raw, body) {
		t.Fatalf("durable metadata or immutable body changed: %s", raw)
	}
	var got record
	if err := unmarshalDurableJSON(raw, &got); err != nil {
		t.Fatal(err)
	}
	if !got.CreatedAt.Equal(want.CreatedAt) || !bytes.Equal(got.Body, body) {
		t.Fatalf("artifact body did not survive exact round trip: %+v", got)
	}
}
