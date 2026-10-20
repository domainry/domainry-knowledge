package store

import (
	"context"
	"fmt"

	sharedoperation "github.com/domainry/domainry-foundation/operation"
	"github.com/domainry/domainry-knowledge-sdk/modulehost"
)

const MigrationOwner = "knowledge"

type MigrationRegistrar interface {
	ApplyOwnedMigrations(context.Context, string, []modulehost.SchemaMigration) error
}

// EnsureSchema installs Foundation operations plus Knowledge-owned tables
// through the deployment's one migration ledger.
func EnsureSchema(ctx context.Context, backend Backend, migrations MigrationRegistrar) error {
	if backend == nil || backend.Database() == nil || backend.Renderer() == nil || migrations == nil {
		return fmt.Errorf("Knowledge persistence host is incomplete")
	}
	if _, err := sharedoperation.Open(ctx, backend.Database(), sharedoperation.AdaptDialect(backend.Renderer()), migrations); err != nil {
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

// SchemaMigrations is the only source of the fresh Knowledge-owned schema.
func SchemaMigrations(d modulehost.Dialect) ([]modulehost.SchemaMigration, error) {
	final := modulehost.SchemaMigration{Version: 1, Name: "create_knowledge_schema"}
	for _, build := range []func(modulehost.Dialect) ([]string, error){knowledgeLibrarySchema, knowledgePageSchema, knowledgeDocumentSchema} {
		statements, err := build(d)
		if err != nil {
			return nil, err
		}
		final.Statements = append(final.Statements, statements...)
	}
	return []modulehost.SchemaMigration{final}, nil
}
