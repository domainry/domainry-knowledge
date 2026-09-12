package store

import (
	"github.com/domainry/domainry-agent-sdk/modulehost"
	ormschema "github.com/domainry/domainry-orm/schema"
)

const CompatAttachmentKnowledgeSourceTable = "_agent_attachment_knowledge_sources"
const CompatAttachmentIndexJobTable = "_agent_attachment_index_jobs"

func CompatAttachmentIndexMigration(d modulehost.Dialect) (modulehost.SchemaMigration, error) {
	m := modulehost.SchemaMigration{Version: 14, Name: "agent_attachment_remote_index"}
	for _, b := range []*ormschema.TableBuilder{
		ormschema.NewTable(d, CompatAttachmentKnowledgeSourceTable).IfNotExists().Columns(required("scope_key", ormschema.TextKey(64)), required("source_key", ormschema.TextKey(64))).PrimaryKey("scope_key").Unique("source_key"),
		ormschema.NewTable(d, CompatAttachmentIndexJobTable).IfNotExists().Columns(required("owner_key", ormschema.TextKey(64)), required("attachment_id", ormschema.TextKey(96)), required("runtime_id", ormschema.TextKey(255)), required("not_before", ormschema.BigInt()), required("lease_until", ormschema.BigInt()), required("fence", ormschema.BigInt()), required("payload_json", ormschema.LongText())).PrimaryKey("owner_key", "attachment_id"),
	} {
		q, _, err := b.Build()
		if err != nil {
			return m, err
		}
		m.Statements = append(m.Statements, q)
	}
	q, _, err := ormschema.NewIndex(d, "idx_agent_attachment_index_due_v14", CompatAttachmentIndexJobTable).Columns("runtime_id", "not_before", "lease_until").Build()
	if err != nil {
		return m, err
	}
	m.Statements = append(m.Statements, q)
	return m, nil
}
