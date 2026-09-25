package store

import (
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
