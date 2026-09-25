package records

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"github.com/domainry/domainry-orm/dialect"
	"github.com/domainry/domainry-orm/sqlite"
	sdk "github.com/domainry/domainry-tools-sdk"
	_ "modernc.org/sqlite"
	"path/filepath"
	"testing"
)

func TestDocumentIsolationReceiptsAndImmutableVersions(t *testing.T) {
	db, e := sql.Open("sqlite", filepath.Join(t.TempDir(), "docs.db"))
	if e != nil {
		t.Fatal(e)
	}
	defer db.Close()
	db.SetMaxOpenConns(1)
	d, _ := dialect.New(dialect.SQLite)
	renderer := d.WithSchema("")
	migrations, e := Migrations(renderer)
	if e != nil {
		t.Fatal(e)
	}
	for _, m := range migrations {
		for _, statement := range m.Statements {
			if _, e = db.ExecContext(t.Context(), statement); e != nil {
				t.Fatal(e)
			}
		}
	}
	s, e := New(db, renderer, sqlite.NewProfile(), "pm")
	if e != nil {
		t.Fatal(e)
	}
	a := sdk.Authority{Known: true, RuntimeID: "r", WorkspaceID: "w", UserID: "a"}
	validate := func(_, next *Record) error { next.Status = "draft"; return nil }
	in := Write{ClientID: "one", Title: "One", Data: json.RawMessage(`{}`)}
	r, e := s.Save(t.Context(), "requirements", in, a, validate)
	if e != nil {
		t.Fatal(e)
	}
	var stored []byte
	if e = db.QueryRowContext(t.Context(), "SELECT payload FROM knowledge_records WHERE id = ?", r.ID).Scan(&stored); e != nil {
		t.Fatal(e)
	}
	if !bytes.Contains(stored, []byte(`"created_at":`)) || bytes.Contains(stored, []byte(`"created_at":"`)) || bytes.Contains(stored, []byte(`"updated_at":"`)) {
		t.Fatalf("record times must be numeric UTC milliseconds: %s", stored)
	}
	retry, e := s.Save(t.Context(), "requirements", in, a, validate)
	if e != nil || retry.ID != r.ID || retry.Revision != 1 {
		t.Fatal("duplicate receipt", e)
	}
	if _, ok, e := s.Receipt(t.Context(), "requirements", in, a); e != nil || !ok {
		t.Fatal(e)
	}
	bad := in
	bad.Title = "Changed"
	if _, e = s.Save(t.Context(), "requirements", bad, a, validate); e == nil {
		t.Fatal("idempotency conflict ignored")
	}
	in.ID = r.ID
	in.ClientID = "two"
	in.ExpectedRevision = 1
	in.Title = "Two"
	if _, e = s.Save(t.Context(), "requirements", in, a, validate); e != nil {
		t.Fatal(e)
	}
	old, e := s.Get(t.Context(), "requirements", r.ID, 1, a)
	if e != nil || old.Title != "One" {
		t.Fatal("old version changed")
	}
	for _, other := range []sdk.Authority{{Known: true, RuntimeID: "r", WorkspaceID: "w", UserID: "b"}, {Known: true, RuntimeID: "r", WorkspaceID: "other", UserID: "a"}} {
		if _, e = s.Get(t.Context(), "requirements", r.ID, 0, other); e == nil {
			t.Fatal("scope escaped")
		}
	}
	work, _ := New(db, renderer, sqlite.NewProfile(), "work")
	if _, e = work.Get(t.Context(), "requirements", r.ID, 0, a); e == nil {
		t.Fatal("product namespace escaped")
	}
}

func TestOriginalSQLiteRecordsSurvivePortableMigration(t *testing.T) {
	db, err := sql.Open("sqlite", filepath.Join(t.TempDir(), "legacy.db"))
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()
	// Exact first-release schema: persisted payloads were BLOB, with no ledger.
	for _, ddl := range []string{
		`CREATE TABLE knowledge_records (namespace TEXT NOT NULL,owner TEXT NOT NULL,kind TEXT NOT NULL,id TEXT NOT NULL,revision INTEGER NOT NULL,payload BLOB NOT NULL,PRIMARY KEY(namespace,owner,kind,id))`,
		`CREATE TABLE knowledge_record_versions (namespace TEXT NOT NULL,owner TEXT NOT NULL,kind TEXT NOT NULL,id TEXT NOT NULL,revision INTEGER NOT NULL,payload BLOB NOT NULL,PRIMARY KEY(namespace,owner,kind,id,revision))`,
		`CREATE TABLE knowledge_record_receipts (namespace TEXT NOT NULL,owner TEXT NOT NULL,kind TEXT NOT NULL,client TEXT NOT NULL,digest TEXT NOT NULL,payload BLOB NOT NULL,PRIMARY KEY(namespace,owner,kind,client))`,
	} {
		if _, err = db.ExecContext(t.Context(), ddl); err != nil {
			t.Fatal(err)
		}
	}
	a := sdk.Authority{Known: true, RuntimeID: "r", WorkspaceID: "w", UserID: "u"}
	owner, _ := scope(a)
	in := Write{ClientID: "original", Title: "已有需求", Data: json.RawMessage(`{"notes":"旧资料"}`)}
	original := Record{ID: "rec_original", Kind: "requirements", Title: in.Title, Revision: 1, Data: in.Data}
	raw, _ := marshalRecord(original)
	for _, table := range []string{"knowledge_records", "knowledge_record_versions"} {
		if _, err = db.ExecContext(t.Context(), "INSERT INTO "+table+"(namespace,owner,kind,id,revision,payload) VALUES(?,?,?,?,?,?)", "pm", owner, original.Kind, original.ID, 1, raw); err != nil {
			t.Fatal(err)
		}
	}
	if _, err = db.ExecContext(t.Context(), "INSERT INTO knowledge_record_receipts(namespace,owner,kind,client,digest,payload) VALUES(?,?,?,?,?,?)", "pm", owner, original.Kind, in.ClientID, hash(in), raw); err != nil {
		t.Fatal(err)
	}
	d, _ := dialect.New(dialect.SQLite)
	migrations, err := Migrations(d.WithSchema(""))
	if err != nil {
		t.Fatal(err)
	}
	for _, m := range migrations {
		for _, statement := range m.Statements {
			if _, err = db.ExecContext(t.Context(), statement); err != nil {
				t.Fatal(err)
			}
		}
	}
	store, err := New(db, d.WithSchema(""), sqlite.NewProfile(), "pm")
	if err != nil {
		t.Fatal(err)
	}
	replay, err := store.Save(t.Context(), original.Kind, in, a, func(_, _ *Record) error { t.Fatal("old receipt was not recovered"); return nil })
	if err != nil || replay.ID != original.ID {
		t.Fatalf("receipt: %+v %v", replay, err)
	}
	in.ID, in.ExpectedRevision, in.ClientID, in.Title = original.ID, 1, "revised", "修订后的需求"
	updated, err := store.Save(t.Context(), original.Kind, in, a, func(_, _ *Record) error { return nil })
	if err != nil || updated.Revision != 2 {
		t.Fatalf("update: %+v %v", updated, err)
	}
	historical, err := store.Get(t.Context(), original.Kind, original.ID, 1, a)
	if err != nil || historical.Title != original.Title {
		t.Fatalf("historical payload: %+v %v", historical, err)
	}
}
