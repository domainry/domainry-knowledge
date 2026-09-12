package store

import (
	"github.com/domainry/domainry-agent-sdk/modulehost"
	ormschema "github.com/domainry/domainry-orm/schema"
)

const CompatLibraryTable = "_agent_knowledge_libraries"
const CompatLibraryMemberTable = "_agent_knowledge_library_members"

func CompatKnowledgeLibraryMigration(d modulehost.Dialect) (modulehost.SchemaMigration, error) {
	m := modulehost.SchemaMigration{Version: 9, Name: "agent_knowledge_libraries"}
	table, _, err := ormschema.NewTable(d, CompatLibraryTable).IfNotExists().Columns(
		required("scope_key", ormschema.TextKey(64)), required("library_id", ormschema.TextKey(96)), required("request_hash", ormschema.TextKey(64)), required("revision", ormschema.BigInt()), required("payload_json", ormschema.LongText()),
	).PrimaryKey("scope_key", "library_id").Build()
	if err != nil {
		return m, err
	}
	members, _, err := ormschema.NewTable(d, CompatLibraryMemberTable).IfNotExists().Columns(
		required("scope_key", ormschema.TextKey(64)), required("library_id", ormschema.TextKey(96)), required("user_id", ormschema.TextKey(255)), required("role", ormschema.TextKey(16)), required("payload_json", ormschema.LongText()),
	).PrimaryKey("scope_key", "library_id", "user_id").Build()
	if err != nil {
		return m, err
	}
	index, _, err := ormschema.NewIndex(d, "idx_agent_library_members_user_v9", CompatLibraryMemberTable).Columns("scope_key", "user_id", "library_id").Build()
	if err != nil {
		return m, err
	}
	m.Statements = []string{table, members, index}
	return m, nil
}
