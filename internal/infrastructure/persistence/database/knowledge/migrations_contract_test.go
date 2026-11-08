package store

import (
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"fmt"
	"path/filepath"
	"strings"
	"testing"

	"github.com/domainry/domainry-orm/dialect"
	_ "modernc.org/sqlite"
)

func TestKnowledgeSchemaMigrationContract(t *testing.T) {
	tests := []struct {
		name      string
		dialect   dialect.Name
		checksums []string
	}{
		{name: "sqlite", dialect: dialect.SQLite, checksums: []string{"db1d177782f85df65f9d199e383bcb4448b95754e6a0793fe86f14a9b9a8d496", "643943e3b50cac1be7152af5e709126e7554398c976b32e0e09ba0beae385fe7"}},
		{name: "mysql", dialect: dialect.MySQL, checksums: []string{"452609d0192b2849331ea43b11bfe941ba85c7db6abe127760c1791a2b936089", "68b143901a89475b2d76b38a17ea62e62a6f6dca86b140b1f5867d0682155bc3"}},
		{name: "postgres", dialect: dialect.Postgres, checksums: []string{"3bd27b03307062a6945c707015eee06c4bc5bb29e8e21bfcbbabfbd66a69ab01", "bdc3c60ce912b5b57e6b8881a947618a7beb208e2c1cbc1a0040f3b34e2c77ce"}},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			renderer, err := dialect.New(test.dialect)
			if err != nil {
				t.Fatal(err)
			}
			migrations, err := SchemaMigrations(renderer.WithSchema(""))
			if err != nil {
				t.Fatal(err)
			}
			if len(migrations) != 2 || migrations[0].Version != knowledgeBaseSchemaVersion || migrations[0].Name != "create_knowledge_schema" || migrations[1].Version != KnowledgeSchemaVersion || migrations[1].Name != "create_page_archive_members" {
				t.Fatalf("unexpected Knowledge schema migration: %#v", migrations)
			}
			for index, migration := range migrations {
				hash := sha256.New()
				_, _ = fmt.Fprintf(hash, "%d\x00%s\x00", migration.Version, migration.Name)
				for _, statement := range migration.Statements {
					_, _ = fmt.Fprintf(hash, "%s\x00", statement)
				}
				if got := hex.EncodeToString(hash.Sum(nil)); got != test.checksums[index] {
					t.Fatalf("Knowledge schema migration %d changed without a version increment: got %s", migration.Version, got)
				}
			}
		})
	}
}

func TestKnowledgeArchiveMigrationAppliesAfterVersionNineteen(t *testing.T) {
	renderer, err := dialect.New(dialect.SQLite)
	if err != nil {
		t.Fatal(err)
	}
	migrations, err := SchemaMigrations(renderer.WithSchema(""))
	if err != nil {
		t.Fatal(err)
	}
	if len(migrations) != 2 {
		t.Fatalf("Knowledge migrations=%d", len(migrations))
	}
	for _, statement := range migrations[0].Statements {
		if strings.Contains(statement, knowledgePageArchiveMemberTable) {
			t.Fatal("version 19 checksum was changed by the archive table")
		}
	}
	for _, statement := range migrations[1].Statements {
		if !strings.Contains(statement, knowledgePageArchiveMemberTable) {
			t.Fatalf("version 20 contains unrelated schema: %s", statement)
		}
	}
	database, err := sql.Open("sqlite", filepath.Join(t.TempDir(), "knowledge-upgrade.db"))
	if err != nil {
		t.Fatal(err)
	}
	defer database.Close()
	for _, migration := range migrations {
		for _, statement := range migration.Statements {
			if _, err = database.ExecContext(t.Context(), statement); err != nil {
				t.Fatalf("apply Knowledge migration %d: %v", migration.Version, err)
			}
		}
	}
	for objectType, name := range map[string]string{
		"table": knowledgePageArchiveMemberTable,
		"index": "idx_knowledge_page_archive_members_root",
	} {
		var count int
		if err = database.QueryRowContext(t.Context(), `SELECT COUNT(*) FROM sqlite_master WHERE type=? AND name=?`, objectType, name).Scan(&count); err != nil || count != 1 {
			t.Fatalf("%s %s count=%d err=%v", objectType, name, count, err)
		}
	}
}
