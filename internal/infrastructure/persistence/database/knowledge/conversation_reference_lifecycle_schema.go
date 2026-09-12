package store

import (
	"github.com/domainry/domainry-agent-sdk/modulehost"
	ormschema "github.com/domainry/domainry-orm/schema"
)

const conversationReferenceReceiptTable = "_knowledge_owner_operation_receipts"

func ConversationReferenceLifecycleMigration(d modulehost.Dialect) (modulehost.SchemaMigration, error) {
	statement, _, err := ormschema.NewTable(d, conversationReferenceReceiptTable).IfNotExists().Columns(
		required("owner_key", ormschema.TextKey(64)), required("request_id", ormschema.TextKey(96)),
		required("payload_json", ormschema.LongText()),
	).PrimaryKey("owner_key", "request_id").Build()
	return modulehost.SchemaMigration{Version: 16, Name: "knowledge_owner_operation_receipts", Statements: []string{statement}}, err
}
