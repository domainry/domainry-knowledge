package store

import (
	"database/sql"
	sdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-orm/dialect"
	_ "modernc.org/sqlite"
	"path/filepath"
	"testing"
)

func TestKnowledgeRunsWithoutAgentTables(t *testing.T) {
	db, err := sql.Open("sqlite", filepath.Join(t.TempDir(), "knowledge.db"))
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()
	db.SetMaxOpenConns(1)
	d, _ := dialect.New(dialect.SQLite)
	migrations, err := LegacyMigrations(d.WithSchema(""))
	if err != nil {
		t.Fatal(err)
	}
	for _, m := range migrations {
		for _, q := range m.Statements {
			if _, err = db.Exec(q); err != nil {
				t.Fatal(err)
			}
		}
	}
	s := New(SQLBackend{DB: db, Dialect: d.WithSchema("")}, nil, ArtifactPersistence{})
	a := sdk.ConversationAuthority{Known: true, RuntimeID: "knowledge-host", WorkspaceID: "one", UserID: "a"}
	library, err := s.CreateKnowledgeLibrary(t.Context(), sdk.KnowledgeLibraryCreate{ClientID: "library", Kind: "personal", Name: "Independent Knowledge"}, a)
	if err != nil {
		t.Fatal(err)
	}
	if _, err = s.KnowledgeLibrary(t.Context(), library.ID, a); err != nil {
		t.Fatal(err)
	}
	b := a
	b.UserID = "b"
	if _, err = s.KnowledgeLibrary(t.Context(), library.ID, b); err == nil {
		t.Fatal("cross-owner library access")
	}
	var n int
	db.QueryRow(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name='_agent_conversations'`).Scan(&n)
	if n != 0 {
		t.Fatal("Knowledge created Agent conversation tables")
	}
}
