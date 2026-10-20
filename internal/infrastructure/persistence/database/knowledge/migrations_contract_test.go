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
		{name: "sqlite", dialect: dialect.SQLite, checksum: "47430957834a9158f8974797c329a795563e745a9fb01bfcef5c2dbec0ef29c3"},
		{name: "mysql", dialect: dialect.MySQL, checksum: "ade7c6de7ab15b213acebcb6d792a631934184aa4c2b121e72ad9cb70cec8e78"},
		{name: "postgres", dialect: dialect.Postgres, checksum: "47430957834a9158f8974797c329a795563e745a9fb01bfcef5c2dbec0ef29c3"},
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
