package store

import (
	"github.com/domainry/domainry-agent-sdk/modulehost"
	ormschema "github.com/domainry/domainry-orm/schema"
)

const attachmentIndexJobTable = "_knowledge_attachment_index_jobs"

func attachmentIndexSchema(d modulehost.Dialect) ([]string, error) {
	statements := make([]string, 0, 2)
	for _, b := range []*ormschema.TableBuilder{
		ormschema.NewTable(d, attachmentIndexJobTable).IfNotExists().Columns(required("owner_key", ormschema.TextKey(64)), required("attachment_id", ormschema.TextKey(96)), required("runtime_id", ormschema.TextKey(255)), required("not_before", ormschema.BigInt()), required("lease_until", ormschema.BigInt()), required("fence", ormschema.BigInt()), required("payload_json", ormschema.LongText())).PrimaryKey("owner_key", "attachment_id"),
	} {
		q, _, err := b.Build()
		if err != nil {
			return nil, err
		}
		statements = append(statements, q)
	}
	q, _, err := ormschema.NewIndex(d, "idx_knowledge_attachment_index_jobs_due", attachmentIndexJobTable).Columns("runtime_id", "not_before", "lease_until").Build()
	if err != nil {
		return nil, err
	}
	return append(statements, q), nil
}
