package store

import (
	"github.com/domainry/domainry-agent-sdk/modulehost"
	ormschema "github.com/domainry/domainry-orm/schema"
)

const subjectReceiptTable = "_knowledge_subject_erasure_receipts"

func SubjectLifecycleMigration(d modulehost.Dialect) (modulehost.SchemaMigration, error) {
	statement, _, err := ormschema.NewTable(d, subjectReceiptTable).IfNotExists().Columns(
		required("owner_key", ormschema.TextKey(64)), required("request_id", ormschema.TextKey(96)),
		required("payload_json", ormschema.LongText()),
	).PrimaryKey("owner_key", "request_id").Build()
	return modulehost.SchemaMigration{Version: 15, Name: "knowledge_subject_erasure_receipts", Statements: []string{statement}}, err
}
