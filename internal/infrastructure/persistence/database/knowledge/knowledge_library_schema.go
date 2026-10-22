package store

import (
	"github.com/domainry/domainry-knowledge-sdk/modulehost"
	ormschema "github.com/domainry/domainry-orm/schema"
)

const knowledgeLibraryTable = "_knowledge_libraries"
const knowledgeLibraryMemberTable = "_knowledge_library_members"

func knowledgeLibrarySchema(d modulehost.Dialect) ([]string, error) {
	table, _, err := ormschema.NewTableWithRequiredColumns(d, knowledgeLibraryTable, physicalID()).IfNotExists().Columns(
		required("scope_key", ormschema.TextKey(64)), required("library_id", ormschema.TextKey(96)), required("request_hash", ormschema.TextKey(64)), required("revision", ormschema.BigInt()), required("payload_json", ormschema.LongText()),
	).PrimaryKey("id").Unique("library_id").Unique("scope_key", "library_id").Build()
	if err != nil {
		return nil, err
	}
	members, _, err := ormschema.NewTableWithRequiredColumns(d, knowledgeLibraryMemberTable, physicalID()).IfNotExists().Columns(
		required("scope_key", ormschema.TextKey(64)), required("library_id", ormschema.TextKey(96)), required("subject_type", ormschema.TextKey(24)), required("subject_id", ormschema.TextKey(255)), required("role", ormschema.TextKey(16)), required("payload_json", ormschema.LongText()),
	).PrimaryKey("id").Unique("scope_key", "library_id", "subject_type", "subject_id").Build()
	if err != nil {
		return nil, err
	}
	index, _, err := ormschema.NewIndex(d, "idx_knowledge_library_members_subject", knowledgeLibraryMemberTable).Columns("scope_key", "subject_type", "subject_id", "library_id").Build()
	if err != nil {
		return nil, err
	}
	return []string{table, members, index}, nil
}
