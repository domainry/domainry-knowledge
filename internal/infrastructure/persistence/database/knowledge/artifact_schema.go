package store

import (
	"github.com/domainry/domainry-agent-sdk/modulehost"
	ormschema "github.com/domainry/domainry-orm/schema"
)

const (
	conversationArtifactVersionTable = "_knowledge_conversation_artifact_versions"
	conversationArtifactTable        = "_knowledge_conversation_artifacts"
)

func conversationArtifactSchema(d modulehost.Dialect) ([]string, error) {
	statements := make([]string, 0, 3)
	tables := []*ormschema.TableBuilder{
		ormschema.NewTable(d, conversationArtifactTable).IfNotExists().Columns(required("owner_key", ormschema.TextKey(64)), required("artifact_id", ormschema.TextKey(96)), required("version", ormschema.BigInt()), required("created_at", ormschema.BigInt()), required("source_conversation_id", ormschema.TextKey(96)), required("payload_json", ormschema.LongText())).PrimaryKey("owner_key", "artifact_id"),
		ormschema.NewTable(d, conversationArtifactVersionTable).IfNotExists().Columns(required("owner_key", ormschema.TextKey(64)), required("artifact_id", ormschema.TextKey(96)), required("version", ormschema.BigInt()), required("payload_json", ormschema.LongText())).PrimaryKey("owner_key", "artifact_id", "version"),
	}
	for _, table := range tables {
		statement, _, err := table.Build()
		if err != nil {
			return nil, err
		}
		statements = append(statements, statement)
	}
	statement, _, err := ormschema.NewIndex(d, "idx_knowledge_conversation_artifacts_owner", conversationArtifactTable).Columns("owner_key", "created_at", "artifact_id").Build()
	if err != nil {
		return nil, err
	}
	return append(statements, statement), nil
}
