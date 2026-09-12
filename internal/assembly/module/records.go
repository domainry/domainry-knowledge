package module

import (
	"context"
	"fmt"
	"github.com/domainry/domainry-agent-sdk/modulehost"
	store "github.com/domainry/domainry-knowledge/internal/infrastructure/persistence/database/knowledge"
	records "github.com/domainry/domainry-knowledge/internal/infrastructure/persistence/database/record"
	"github.com/domainry/domainry-orm/dialect"
)

// NewRecordStore borrows the host's pool, dialect, engine profile and migration
// registrar. No module-owned pool or second migration ledger is created.
func NewRecordStore(ctx context.Context, backend store.Backend, registrar modulehost.MigrationRegistrar, namespace string) (*records.Store, error) {
	if backend == nil || registrar == nil || backend.Profile() == nil {
		return nil, fmt.Errorf("record persistence requires a host backend and migration registrar")
	}
	engine, err := dialect.Parse(registrar.Driver())
	if err != nil {
		return nil, err
	}
	if engine.Name() != backend.Profile().Name() {
		return nil, fmt.Errorf("record host database profile mismatch")
	}
	result, err := records.New(backend.Database(), backend.Renderer(), backend.Profile(), namespace)
	if err != nil {
		return nil, err
	}
	migrations, err := records.Migrations(backend.Renderer())
	if err != nil {
		return nil, err
	}
	if err = registrar.ApplyOwnedMigrations(ctx, "knowledge_records", migrations); err != nil {
		return nil, err
	}
	return result, nil
}
