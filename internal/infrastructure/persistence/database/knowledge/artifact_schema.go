package store

import (
	"github.com/domainry/domainry-agent-sdk/modulehost"
	ormschema "github.com/domainry/domainry-orm/schema"
)

const (
	ArtifactVersionsTable = "_agent_artifact_versions"
	ArtifactsTable        = "_agent_artifacts"
)

func CompatConversationArtifactMigration(d modulehost.Dialect) (modulehost.SchemaMigration, error) {
	m := modulehost.SchemaMigration{Version: 6, Name: "agent_conversation_artifacts"}
	tables := []*ormschema.TableBuilder{
		ormschema.NewTable(d, ArtifactsTable).IfNotExists().Columns(required("owner_key", ormschema.TextKey(64)), required("artifact_id", ormschema.TextKey(96)), required("version", ormschema.BigInt()), required("created_at", ormschema.BigInt()), required("source_conversation_id", ormschema.TextKey(96)), required("payload_json", ormschema.LongText())).PrimaryKey("owner_key", "artifact_id"),
		ormschema.NewTable(d, ArtifactVersionsTable).IfNotExists().Columns(required("owner_key", ormschema.TextKey(64)), required("artifact_id", ormschema.TextKey(96)), required("version", ormschema.BigInt()), required("payload_json", ormschema.LongText())).PrimaryKey("owner_key", "artifact_id", "version"),
	}
	for _, table := range tables {
		statement, _, err := table.Build()
		if err != nil {
			return m, err
		}
		m.Statements = append(m.Statements, statement)
	}
	statement, _, err := ormschema.NewIndex(d, "idx_agent_artifacts_owner_v6", ArtifactsTable).Columns("owner_key", "created_at", "artifact_id").Build()
	if err != nil {
		return m, err
	}
	m.Statements = append(m.Statements, statement)
	return m, nil
}
