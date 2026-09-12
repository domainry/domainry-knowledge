package records

import (
	"github.com/domainry/domainry-orm/migration"
	"github.com/domainry/domainry-orm/query"
	"github.com/domainry/domainry-orm/schema"
)

// Migrations submits Knowledge-owned DDL to the host's shared ledger. Bounded
// keys fit MySQL composite indexes; JSON is text on every engine. IF NOT EXISTS
// preserves records written by the original SQLite TEXT/BLOB schema.
func Migrations(d query.Renderer) ([]migration.Migration, error) {
	m := migration.Migration{Version: 1, Name: "knowledge_structured_records"}
	for _, table := range []string{"knowledge_records", "knowledge_record_versions", "knowledge_record_receipts"} {
		columns := []schema.ColumnDefinition{
			schema.Column("namespace", schema.TextKey(96)).NotNull(),
			schema.Column("owner", schema.TextKey(64)).NotNull(),
			schema.Column("kind", schema.TextKey(96)).NotNull(),
			schema.Column("payload", schema.LongText()).NotNull(),
		}
		keys := []string{"namespace", "owner", "kind"}
		if table == "knowledge_record_receipts" {
			columns = append(columns, schema.Column("client", schema.TextKey(96)).NotNull(), schema.Column("digest", schema.TextKey(64)).NotNull())
			keys = append(keys, "client")
		} else {
			columns = append(columns, schema.Column("id", schema.TextKey(96)).NotNull(), schema.Column("revision", schema.BigInt()).NotNull())
			keys = append(keys, "id")
			if table == "knowledge_record_versions" {
				keys = append(keys, "revision")
			}
		}
		statement, _, err := schema.NewTable(d, table).IfNotExists().Columns(columns...).PrimaryKey(keys...).Build()
		if err != nil {
			return nil, err
		}
		m.Statements = append(m.Statements, statement)
	}
	return []migration.Migration{m}, nil
}
