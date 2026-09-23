package store

import (
	"context"
	"fmt"

	"github.com/domainry/domainry-agent-sdk/modulehost"
	sharedoperation "github.com/domainry/domainry-foundation/operation"
	sharedsubjectlifecycle "github.com/domainry/domainry-foundation/subjectlifecycle"
)

const MigrationOwner = "knowledge"

type MigrationRegistrar interface {
	ApplyOwnedMigrations(context.Context, string, []modulehost.SchemaMigration) error
}

// EnsureSchema installs Foundation's canonical Operations and Subject
// Lifecycle tables plus Knowledge-owned tables through the deployment's one
// migration ledger.
func EnsureSchema(ctx context.Context, backend Backend, migrations MigrationRegistrar) error {
	if backend == nil || backend.Database() == nil || backend.Renderer() == nil || migrations == nil {
		return fmt.Errorf("Knowledge persistence host is incomplete")
	}
	if _, err := sharedoperation.Open(ctx, backend.Database(), sharedoperation.AdaptDialect(backend.Renderer()), migrations); err != nil {
		return err
	}
	sharedDialect, ok := backend.Renderer().(sharedsubjectlifecycle.Dialect)
	if !ok {
		return fmt.Errorf("Knowledge dialect does not support shared Subject Lifecycle persistence")
	}
	if err := sharedsubjectlifecycle.EnsureSchema(ctx, sharedDialect, migrations); err != nil {
		return err
	}
	values, err := SchemaMigrations(backend.Renderer())
	if err != nil {
		return err
	}
	if err := migrations.ApplyOwnedMigrations(ctx, MigrationOwner, values); err != nil {
		return fmt.Errorf("apply Knowledge migrations: %w", err)
	}
	return nil
}

// SchemaMigrations is the only source of Knowledge-owned DDL. Embedded Module
// and standalone SaaS deployments apply this same history to their current
// database rather than receiving a Store from another module.
func SchemaMigrations(d modulehost.Dialect) ([]modulehost.SchemaMigration, error) {
	final := modulehost.SchemaMigration{Version: 1, Name: "create_knowledge_schema"}
	for _, build := range []func(modulehost.Dialect) (modulehost.SchemaMigration, error){CompatConversationArtifactMigration, CompatKnowledgeLibraryMigration, CompatKnowledgeDocumentMigration, CompatAttachmentIndexMigration} {
		m, err := build(d)
		if err != nil {
			return nil, err
		}
		final.Statements = append(final.Statements, m.Statements...)
	}
	return []modulehost.SchemaMigration{final}, nil
}
