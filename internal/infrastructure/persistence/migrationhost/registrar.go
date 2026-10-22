package migrationhost

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/domainry/domainry-knowledge-sdk/modulehost"
	ormmigration "github.com/domainry/domainry-orm/migration"
	"github.com/domainry/domainry-orm/query"
	"github.com/domainry/domainry-orm/schema"
)

type Registrar struct {
	DB       *sql.DB
	Renderer modulehost.Dialect
}

func (*Registrar) Driver() string { return "sqlite" }
func (*Registrar) Schema() string { return "" }
func (r *Registrar) Prepare(ctx context.Context) error {
	statement, args, err := schema.NewTableWithRequiredColumns(r.Renderer, "_schema_migrations", schema.Column("id", schema.BigInt()).NotNull().AutoIncrement()).IfNotExists().Columns(schema.Column("owner", schema.TextKey(191)).NotNull(), schema.Column("version", schema.BigInt()).NotNull(), schema.Column("name", schema.TextKey(191)).NotNull(), schema.Column("checksum", schema.TextKey(64)).NotNull(), schema.Column("dirty", schema.Boolean()).NotNull(), schema.Column("applied_at", schema.BigInt()).NotNull()).PrimaryKey("id").Unique("owner", "version").Build()
	if err != nil {
		return err
	}
	_, err = r.DB.ExecContext(ctx, statement, args...)
	return err
}
func (r *Registrar) ApplyOwnedMigrations(ctx context.Context, owner string, values []modulehost.SchemaMigration) error {
	for _, value := range values {
		value := value
		if err := r.ApplyOwnedMigration(ctx, owner, value.Version, value.Name, ormmigration.Checksum(value), func(ctx context.Context) error {
			tx, err := r.DB.BeginTx(ctx, nil)
			if err != nil {
				return err
			}
			defer tx.Rollback()
			for _, statement := range value.Statements {
				if _, err = tx.ExecContext(ctx, statement); err != nil {
					return err
				}
			}
			return tx.Commit()
		}); err != nil {
			return err
		}
	}
	return nil
}

// ApplyOwnedMigration lets embedded modules build a source-owned schema while
// the product host remains the sole owner of the migration ledger.
func (r *Registrar) ApplyOwnedMigration(ctx context.Context, owner string, version uint, name, checksum string, apply func(context.Context) error) error {
	if strings.TrimSpace(owner) == "" || version == 0 || strings.TrimSpace(name) == "" || strings.TrimSpace(checksum) == "" || apply == nil {
		return fmt.Errorf("invalid Knowledge host migration")
	}
	predicate := query.And(query.Equal("owner", owner), query.Equal("version", version))
	statement, args, err := query.NewSelectBuilder(r.Renderer, "_schema_migrations").Columns("name", "checksum", "dirty").Where(predicate).Build()
	if err != nil {
		return err
	}
	var previousName, previousChecksum string
	var dirty bool
	err = r.DB.QueryRowContext(ctx, statement, args...).Scan(&previousName, &previousChecksum, &dirty)
	if err == nil {
		if dirty {
			return fmt.Errorf("migration %s/%d is dirty", owner, version)
		}
		if previousName != name || previousChecksum != checksum {
			return fmt.Errorf("migration %s/%d checksum drift", owner, version)
		}
		return nil
	}
	if !errors.Is(err, sql.ErrNoRows) {
		return err
	}
	insert, insertArgs, err := query.NewInsertBuilder(r.Renderer, "_schema_migrations").Columns("owner", "version", "name", "checksum", "dirty", "applied_at").Values(owner, version, name, checksum, true, int64(0)).Build()
	if err != nil {
		return err
	}
	if _, err = r.DB.ExecContext(ctx, insert, insertArgs...); err != nil {
		return err
	}
	if err = apply(ctx); err != nil {
		return fmt.Errorf("apply %s/%d: %w", owner, version, err)
	}
	complete, completeArgs, err := query.NewUpdateBuilder(r.Renderer, "_schema_migrations").Set("dirty", false).Set("applied_at", time.Now().UTC().UnixMilli()).Where(predicate).Build()
	if err != nil {
		return err
	}
	_, err = r.DB.ExecContext(ctx, complete, completeArgs...)
	return err
}
