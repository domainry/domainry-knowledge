package saas

import (
	"context"
	"database/sql"
	"fmt"
	"path/filepath"
	"strings"
	"time"

	"github.com/domainry/domainry-foundation/telemetry"
	ormdialect "github.com/domainry/domainry-orm/dialect"
	ormdriver "github.com/domainry/domainry-orm/driver"
	ormpostgres "github.com/domainry/domainry-orm/postgres"
	ormsqlite "github.com/domainry/domainry-orm/sqlite"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/stdlib"
	_ "modernc.org/sqlite"
)

type DatabaseOptions struct {
	Driver             string
	Path               string
	DSN                string
	Schema             string
	MaxOpenConnections int
	MaxIdleConnections int
	ConnectionLifetime time.Duration
	ConnectionIdleTime time.Duration
	SQLiteBusyTimeout  time.Duration
	SQLiteMaxOpen      int
}

type databaseResources struct {
	database *sql.DB
	renderer ormdialect.Renderer
	profile  ormdriver.Profile
	driver   string
	schema   string
}

func openDatabase(ctx context.Context, options DatabaseOptions) (_ databaseResources, resultErr error) {
	driver := strings.ToLower(strings.TrimSpace(options.Driver))
	switch driver {
	case "sqlite":
		if strings.TrimSpace(options.Path) == "" || options.SQLiteBusyTimeout <= 0 || options.SQLiteMaxOpen < 1 {
			return databaseResources{}, fmt.Errorf("valid Knowledge SQLite settings are required")
		}
		path, err := filepath.Abs(strings.TrimSpace(options.Path))
		if err != nil {
			return databaseResources{}, err
		}
		connectionConfig := ormsqlite.DefaultOwnedConnectionConfig(path)
		connectionConfig.BusyTimeout = options.SQLiteBusyTimeout
		connectionConfig.MaxOpenConnections = options.SQLiteMaxOpen
		connectionConfig.MaxIdleConnections = options.SQLiteMaxOpen
		dsn, err := connectionConfig.DSN()
		if err != nil {
			return databaseResources{}, err
		}
		database, err := telemetry.OpenObservedSQL("sqlite", dsn, "runtime", nil)
		if err != nil {
			return databaseResources{}, err
		}
		defer func() {
			if resultErr != nil {
				_ = database.Close()
			}
		}()
		if err = ormsqlite.InitializeOwned(ctx, database, connectionConfig); err != nil {
			return databaseResources{}, err
		}
		dialectValue, err := ormdialect.New(ormdialect.SQLite)
		if err != nil {
			return databaseResources{}, err
		}
		return databaseResources{database: database, renderer: dialectValue.WithSchema(""), profile: ormsqlite.NewProfile(), driver: "sqlite"}, nil
	case "postgres":
		if strings.TrimSpace(options.DSN) == "" {
			return databaseResources{}, fmt.Errorf("KNOWLEDGE_DATABASE_DSN is required for PostgreSQL")
		}
		if options.MaxOpenConnections < 1 || options.MaxIdleConnections < 0 || options.MaxIdleConnections > options.MaxOpenConnections || options.ConnectionLifetime <= 0 || options.ConnectionIdleTime <= 0 {
			return databaseResources{}, fmt.Errorf("valid Knowledge database pool settings are required")
		}
		schema := strings.TrimSpace(options.Schema)
		if !ormdialect.ValidIdentifier(schema) {
			return databaseResources{}, fmt.Errorf("KNOWLEDGE_DATABASE_SCHEMA must be a safe SQL identifier")
		}
		connectionConfig, err := pgx.ParseConfig(strings.TrimSpace(options.DSN))
		if err != nil {
			return databaseResources{}, fmt.Errorf("KNOWLEDGE_DATABASE_DSN is invalid: %w", err)
		}
		if connectionConfig.RuntimeParams == nil {
			connectionConfig.RuntimeParams = make(map[string]string)
		}
		dialectValue, err := ormdialect.New(ormdialect.Postgres)
		if err != nil {
			return databaseResources{}, err
		}
		connectionConfig.RuntimeParams["search_path"] = dialectValue.Identifier(schema)
		database := sql.OpenDB(telemetry.WrapSQLConnector(stdlib.GetConnector(*connectionConfig), "runtime", nil))
		database.SetMaxOpenConns(options.MaxOpenConnections)
		database.SetMaxIdleConns(options.MaxIdleConnections)
		database.SetConnMaxLifetime(options.ConnectionLifetime)
		database.SetConnMaxIdleTime(options.ConnectionIdleTime)
		defer func() {
			if resultErr != nil {
				_ = database.Close()
			}
		}()
		if err = database.PingContext(ctx); err != nil {
			return databaseResources{}, fmt.Errorf("connect PostgreSQL: %w", err)
		}
		if _, err = database.ExecContext(ctx, "CREATE SCHEMA IF NOT EXISTS "+dialectValue.Identifier(schema)); err != nil {
			return databaseResources{}, fmt.Errorf("prepare PostgreSQL schema: %w", err)
		}
		return databaseResources{database: database, renderer: dialectValue.WithSchema(schema), profile: ormpostgres.NewProfile(), driver: "postgres", schema: schema}, nil
	default:
		return databaseResources{}, fmt.Errorf("KNOWLEDGE_DATABASE_DRIVER must be sqlite or postgres")
	}
}

func (resources databaseResources) applyMigrations(ctx context.Context, apply func() error) error {
	release, err := resources.acquireMigrationLock(ctx)
	if err != nil {
		return err
	}
	applyErr := apply()
	releaseContext, cancel := context.WithTimeout(context.WithoutCancel(ctx), 5*time.Second)
	defer cancel()
	releaseErr := release(releaseContext)
	if applyErr != nil {
		return applyErr
	}
	return releaseErr
}

func (resources databaseResources) acquireMigrationLock(ctx context.Context) (func(context.Context) error, error) {
	if resources.driver != "postgres" {
		return func(context.Context) error { return nil }, nil
	}
	connection, err := resources.database.Conn(ctx)
	if err != nil {
		return nil, err
	}
	key := "domainry-knowledge:migrations:" + resources.schema
	for {
		var acquired bool
		if err = connection.QueryRowContext(ctx, "SELECT pg_try_advisory_lock(hashtextextended($1, 0))", key).Scan(&acquired); err != nil {
			_ = connection.Close()
			return nil, fmt.Errorf("acquire PostgreSQL migration lock: %w", err)
		}
		if acquired {
			break
		}
		timer := time.NewTimer(100 * time.Millisecond)
		select {
		case <-ctx.Done():
			timer.Stop()
			_ = connection.Close()
			return nil, ctx.Err()
		case <-timer.C:
		}
	}
	return func(releaseContext context.Context) error {
		defer connection.Close()
		var released bool
		if err := connection.QueryRowContext(releaseContext, "SELECT pg_advisory_unlock(hashtextextended($1, 0))", key).Scan(&released); err != nil {
			return fmt.Errorf("release PostgreSQL migration lock: %w", err)
		}
		if !released {
			return fmt.Errorf("PostgreSQL migration lock was lost")
		}
		return nil
	}, nil
}
