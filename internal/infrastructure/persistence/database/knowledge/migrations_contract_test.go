package store

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"testing"

	"github.com/domainry/domainry-orm/dialect"
)

func TestKnowledgeSchemaMigrationContract(t *testing.T) {
	tests := []struct {
		name     string
		dialect  dialect.Name
		checksum string
	}{
		{name: "sqlite", dialect: dialect.SQLite, checksum: "4b5caeab8279acd078a201f3bc5f2655efc57c15d7136f4e28f8c3170d826912"},
		{name: "mysql", dialect: dialect.MySQL, checksum: "1edfaeef27e00efc3fdf63ba8943ed6098a36cb6baf119cfb935b68f72044cca"},
		{name: "postgres", dialect: dialect.Postgres, checksum: "b6251f39ea9719f53ddf9a1ac9dc497ef77b5921d1389edf0ee405c10eca32c5"},
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
			if len(migrations) != 1 || migrations[0].Version != KnowledgeSchemaVersion || migrations[0].Name != "create_knowledge_schema" {
				t.Fatalf("unexpected Knowledge schema migration: %#v", migrations)
			}
			hash := sha256.New()
			_, _ = fmt.Fprintf(hash, "%d\x00%s\x00", migrations[0].Version, migrations[0].Name)
			for _, statement := range migrations[0].Statements {
				_, _ = fmt.Fprintf(hash, "%s\x00", statement)
			}
			if got := hex.EncodeToString(hash.Sum(nil)); got != test.checksum {
				t.Fatalf("Knowledge schema migration changed without a version increment: got %s", got)
			}
		})
	}
}
