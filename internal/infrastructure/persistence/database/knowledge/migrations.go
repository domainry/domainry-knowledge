package store

import "github.com/domainry/domainry-agent-sdk/modulehost"

// LegacyMigrations preserves the deployed SQL text, names and versions. An
// existing Agent host retains its historical ledger; a new Knowledge host can
// apply this history under its own registrar without creating Agent tables.
func LegacyMigrations(d modulehost.Dialect) ([]modulehost.SchemaMigration, error) {
	out := []modulehost.SchemaMigration{}
	for _, build := range []func(modulehost.Dialect) (modulehost.SchemaMigration, error){CompatConversationArtifactMigration, CompatConversationAttachmentMigration, CompatConversationAttachmentCleanupMigration, CompatKnowledgeLibraryMigration, CompatKnowledgeDocumentMigration, CompatKnowledgeDatasourceMigration, CompatAttachmentIndexMigration} {
		m, err := build(d)
		if err != nil {
			return nil, err
		}
		out = append(out, m)
	}
	subjects, err := SubjectLifecycleMigration(d)
	if err != nil {
		return nil, err
	}
	out = append(out, subjects)
	references, err := ConversationReferenceLifecycleMigration(d)
	if err != nil {
		return nil, err
	}
	out = append(out, references)
	return out, nil
}
