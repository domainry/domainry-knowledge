package store

import (
	"github.com/domainry/domainry-agent-sdk/modulehost"
	ormschema "github.com/domainry/domainry-orm/schema"
)

const knowledgeLibraryTable = "_knowledge_libraries"
const knowledgeLibraryMemberTable = "_knowledge_library_members"

func knowledgeLibrarySchema(d modulehost.Dialect) ([]string, error) {
	table, _, err := ormschema.NewTable(d, knowledgeLibraryTable).IfNotExists().Columns(
		required("scope_key", ormschema.TextKey(64)), required("library_id", ormschema.TextKey(96)), required("request_hash", ormschema.TextKey(64)), required("revision", ormschema.BigInt()), required("payload_json", ormschema.LongText()),
	).PrimaryKey("scope_key", "library_id").Build()
	if err != nil {
		return nil, err
	}
	members, _, err := ormschema.NewTable(d, knowledgeLibraryMemberTable).IfNotExists().Columns(
		required("scope_key", ormschema.TextKey(64)), required("library_id", ormschema.TextKey(96)), required("user_id", ormschema.TextKey(255)), required("role", ormschema.TextKey(16)), required("payload_json", ormschema.LongText()),
	).PrimaryKey("scope_key", "library_id", "user_id").Build()
	if err != nil {
		return nil, err
	}
	index, _, err := ormschema.NewIndex(d, "idx_knowledge_library_members_user", knowledgeLibraryMemberTable).Columns("scope_key", "user_id", "library_id").Build()
	if err != nil {
		return nil, err
	}
	return []string{table, members, index}, nil
}
