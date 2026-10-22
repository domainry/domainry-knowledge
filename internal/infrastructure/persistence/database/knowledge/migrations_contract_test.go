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
		{name: "sqlite", dialect: dialect.SQLite, checksum: "db1d177782f85df65f9d199e383bcb4448b95754e6a0793fe86f14a9b9a8d496"},
		{name: "mysql", dialect: dialect.MySQL, checksum: "452609d0192b2849331ea43b11bfe941ba85c7db6abe127760c1791a2b936089"},
		{name: "postgres", dialect: dialect.Postgres, checksum: "3bd27b03307062a6945c707015eee06c4bc5bb29e8e21bfcbbabfbd66a69ab01"},
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
