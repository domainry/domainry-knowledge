package store

import (
	"github.com/domainry/domainry-knowledge-sdk/modulehost"
	ormschema "github.com/domainry/domainry-orm/schema"
)

const knowledgeDocumentTable = "_knowledge_documents"
const knowledgeDocumentJobTable = "_knowledge_document_jobs"
const knowledgeSourceTable = "_knowledge_sources"

const (
	knowledgeDocumentSourceKind   = "document"
	knowledgeDatasourceSourceKind = "datasource"
)

func knowledgeDocumentSchema(d modulehost.Dialect) ([]string, error) {
	statements := make([]string, 0, 5)
	for _, builder := range []*ormschema.TableBuilder{
		ormschema.NewTable(d, knowledgeSourceTable).IfNotExists().Columns(required("scope_key", ormschema.TextKey(64)), required("binding_key", ormschema.TextKey(96)), required("source_kind", ormschema.TextKey(24)), required("source_key", ormschema.TextKey(64)), required("payload_json", ormschema.LongText())).PrimaryKey("scope_key", "binding_key").Unique("source_key"),
		ormschema.NewTable(d, knowledgeDocumentTable).IfNotExists().Columns(required("scope_key", ormschema.TextKey(64)), required("document_id", ormschema.TextKey(96)), required("runtime_id", ormschema.TextKey(255)), required("library_id", ormschema.TextKey(96)), required("projection_kind", ormschema.TextKey(16)), required("source_key", ormschema.TextKey(64)), required("remote_id", ormschema.TextKey(96)), required("state", ormschema.TextKey(24)), required("revision", ormschema.BigInt()), required("bytes", ormschema.BigInt()), required("updated_at", ormschema.BigInt()), required("payload_json", ormschema.LongText())).PrimaryKey("scope_key", "document_id").Unique("source_key", "remote_id"),
		ormschema.NewTable(d, knowledgeDocumentJobTable).IfNotExists().Columns(required("scope_key", ormschema.TextKey(64)), required("document_id", ormschema.TextKey(96)), required("runtime_id", ormschema.TextKey(255)), required("not_before", ormschema.BigInt()), required("lease_until", ormschema.BigInt()), required("fence", ormschema.BigInt()), required("payload_json", ormschema.LongText())).PrimaryKey("scope_key", "document_id"),
	} {
		q, _, e := builder.Build()
		if e != nil {
			return nil, e
		}
		statements = append(statements, q)
	}
	for _, index := range []*ormschema.IndexBuilder{
		ormschema.NewIndex(d, "idx_knowledge_documents_library", knowledgeDocumentTable).Columns("scope_key", "library_id", "projection_kind", "document_id"),
		ormschema.NewIndex(d, "idx_knowledge_documents_upload_expiry", knowledgeDocumentTable).Columns("runtime_id", "state", "updated_at", "scope_key", "document_id"),
		ormschema.NewIndex(d, "idx_knowledge_document_jobs_due", knowledgeDocumentJobTable).Columns("runtime_id", "not_before", "lease_until"),
	} {
		q, _, e := index.Build()
		if e != nil {
			return nil, e
		}
		statements = append(statements, q)
	}
	return statements, nil
}
