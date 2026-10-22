package records

import (
	"github.com/domainry/domainry-orm/migration"
	"github.com/domainry/domainry-orm/query"
	"github.com/domainry/domainry-orm/schema"
)

const (
	MigrationOwner     = "knowledge_records"
	recordTable        = "knowledge_records"
	recordVersionTable = "knowledge_record_versions"
	recordReceiptTable = "knowledge_record_receipts"
)

// Migrations submits the fresh Knowledge records schema to the host's shared
// ledger. Every table has an auto-increment bigint physical primary key. Only
// knowledge_records is an entity; versions and receipts carry natural keys but
// do not manufacture their own business IDs.
func Migrations(d query.Renderer) ([]migration.Migration, error) {
	m := migration.Migration{Version: 1, Name: "knowledge_structured_records"}
	for _, table := range []string{recordTable, recordVersionTable, recordReceiptTable} {
		columns := []schema.ColumnDefinition{
			schema.Column("id", schema.BigInt()).NotNull().AutoIncrement(),
			schema.Column("namespace", schema.TextKey(96)).NotNull(),
			schema.Column("owner", schema.TextKey(64)).NotNull(),
			schema.Column("kind", schema.TextKey(96)).NotNull(),
			schema.Column("payload", schema.LongText()).NotNull(),
		}
		keys := []string{"namespace", "owner", "kind"}
		if table == recordReceiptTable {
			columns = append(columns, schema.Column("client", schema.TextKey(96)).NotNull(), schema.Column("digest", schema.TextKey(64)).NotNull())
			keys = append(keys, "client")
		} else {
			columns = append(columns, schema.Column("record_id", schema.TextKey(96)).NotNull(), schema.Column("revision", schema.BigInt()).NotNull())
			keys = append(keys, "record_id")
			if table == recordVersionTable {
				keys = append(keys, "revision")
			}
		}
		builder := schema.NewTable(d, table).IfNotExists().Columns(columns...).PrimaryKey("id").Unique(keys...)
		if table == recordTable {
			builder = builder.Unique("record_id")
		}
		statement, _, err := builder.Build()
		if err != nil {
			return nil, err
		}
		m.Statements = append(m.Statements, statement)
	}
	return []migration.Migration{m}, nil
}
