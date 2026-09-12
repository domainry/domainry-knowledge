package store

import (
	"github.com/domainry/domainry-agent-sdk/modulehost"
	ormschema "github.com/domainry/domainry-orm/schema"
)

const CompatKnowledgeDatasourceTable = "_agent_knowledge_datasource_bindings"

func CompatKnowledgeDatasourceMigration(d modulehost.Dialect) (modulehost.SchemaMigration, error) {
	m := modulehost.SchemaMigration{Version: 11, Name: "agent_knowledge_datasource_bindings"}
	q, _, err := ormschema.NewTable(d, CompatKnowledgeDatasourceTable).IfNotExists().Columns(required("scope_key", ormschema.TextKey(64)), required("library_id", ormschema.TextKey(96)), required("source_key", ormschema.TextKey(64)), required("payload_json", ormschema.LongText())).PrimaryKey("scope_key", "library_id").Unique("source_key").Build()
	if err != nil {
		return m, err
	}
	m.Statements = []string{q}
	return m, nil
}
