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
	var physicalID int64
	var stored []byte
	if e = db.QueryRowContext(t.Context(), "SELECT id, payload FROM knowledge_records WHERE record_id = ?", r.RecordID).Scan(&physicalID, &stored); e != nil {
		t.Fatal(e)
	}
	if physicalID != r.ID || r.ID < 1 || r.RecordID == "" {
		t.Fatalf("record identity=%+v physical=%d", r, physicalID)
	}
	if !bytes.Contains(stored, []byte(`"created_at":`)) || bytes.Contains(stored, []byte(`"created_at":"`)) || bytes.Contains(stored, []byte(`"updated_at":"`)) {
		t.Fatalf("record times must be numeric UTC milliseconds: %s", stored)
	}
	retry, e := s.Save(t.Context(), "requirements", in, a, validate)
	if e != nil || retry.ID != r.ID || retry.RecordID != r.RecordID || retry.Revision != 1 {
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
	in.RecordID = r.RecordID
	in.ClientID = "two"
	in.ExpectedRevision = 1
	in.Title = "Two"
	if _, e = s.Save(t.Context(), "requirements", in, a, validate); e != nil {
		t.Fatal(e)
	}
	old, e := s.Get(t.Context(), "requirements", r.RecordID, 1, a)
	if e != nil || old.Title != "One" {
		t.Fatal("old version changed")
	}
	for _, other := range []sdk.Authority{{Known: true, RuntimeID: "r", WorkspaceID: "w", UserID: "b"}, {Known: true, RuntimeID: "r", WorkspaceID: "other", UserID: "a"}} {
		if _, e = s.Get(t.Context(), "requirements", r.RecordID, 0, other); e == nil {
			t.Fatal("scope escaped")
		}
	}
	work, _ := New(db, renderer, sqlite.NewProfile(), "work")
	if _, e = work.Get(t.Context(), "requirements", r.RecordID, 0, a); e == nil {
		t.Fatal("product namespace escaped")
	}
}

func TestStructuredRecordSchemaAndPaginationUsePhysicalIDs(t *testing.T) {
	db, err := sql.Open("sqlite", filepath.Join(t.TempDir(), "physical.db"))
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()
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
	for _, table := range []string{"knowledge_records", "knowledge_record_versions", "knowledge_record_receipts"} {
		rows, queryErr := db.QueryContext(t.Context(), `SELECT name, type, pk FROM pragma_table_info(?)`, table)
		if queryErr != nil {
			t.Fatal(queryErr)
		}
		primaryKey := ""
		idType := ""
		for rows.Next() {
			var name, columnType string
			var primary int
			if queryErr = rows.Scan(&name, &columnType, &primary); queryErr != nil {
				_ = rows.Close()
				t.Fatal(queryErr)
			}
			if name == "id" {
				idType = columnType
			}
			if primary > 0 {
				primaryKey = name
			}
		}
		if queryErr = rows.Close(); queryErr != nil {
			t.Fatal(queryErr)
		}
		if primaryKey != "id" || idType != "INTEGER" {
			t.Fatalf("table %s primary=%q id_type=%q", table, primaryKey, idType)
		}
	}
	store, err := New(db, d.WithSchema(""), sqlite.NewProfile(), "pm")
	if err != nil {
		t.Fatal(err)
	}
	a := sdk.Authority{Known: true, RuntimeID: "r", WorkspaceID: "w", UserID: "u"}
	validate := func(_, _ *Record) error { return nil }
	for _, clientID := range []string{"one", "two", "three"} {
		if _, err = store.Save(t.Context(), "requirements", Write{ClientID: clientID, Title: clientID, Data: json.RawMessage(`{}`)}, a, validate); err != nil {
			t.Fatal(err)
		}
	}
	first, err := store.List(t.Context(), "requirements", "", 0, 2, a)
	if err != nil || first.Complete || len(first.Items) != 2 || first.Items[0].ID >= first.Items[1].ID || first.NextCursor != first.Items[1].ID {
		t.Fatalf("first page=%+v err=%v", first, err)
	}
	second, err := store.List(t.Context(), "requirements", "", first.NextCursor, 2, a)
	if err != nil || !second.Complete || len(second.Items) != 1 || second.Items[0].ID <= first.NextCursor || second.NextCursor != 0 {
		t.Fatalf("second page=%+v err=%v", second, err)
	}
}
