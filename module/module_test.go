package module

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
	"testing"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/modulehost"
	sharedsubjectlifecycle "github.com/domainry/domainry-foundation/subjectlifecycle"
	ormdialect "github.com/domainry/domainry-orm/dialect"
	_ "modernc.org/sqlite"
)

type registrar struct {
	database *sql.DB
	owners   []string
	applied  map[string]bool
}

func (r *registrar) ApplyOwnedMigrations(ctx context.Context, owner string, migrations []modulehost.SchemaMigration) error {
	r.owners = append(r.owners, owner)
	if r.applied == nil {
		r.applied = map[string]bool{}
	}
	for _, migration := range migrations {
		key := fmt.Sprintf("%s/%d", owner, migration.Version)
		if r.applied[key] {
			continue
		}
		for _, statement := range migration.Statements {
			if _, err := r.database.ExecContext(ctx, statement); err != nil {
				return err
			}
		}
		r.applied[key] = true
	}
	return nil
}

func openDatabase(t *testing.T, name string) (*sql.DB, modulehost.Dialect) {
	t.Helper()
	database, err := sql.Open("sqlite", "file:"+name+"?mode=memory&cache=shared")
	if err != nil {
		t.Fatal(err)
	}
	database.SetMaxOpenConns(1)
	t.Cleanup(func() { _ = database.Close() })
	dialect, err := ormdialect.New(ormdialect.SQLite)
	if err != nil {
		t.Fatal(err)
	}
	return database, dialect.WithSchema("")
}

func TestEnsureSchemaKeepsNormalizedKnowledgeTablesSharedOrIsolatedByDeployment(t *testing.T) {
	sharedDB, dialect := openDatabase(t, "knowledge-shared")
	backend := SQLBackend{DB: sharedDB, Dialect: dialect}
	sharedRegistrar := &registrar{database: sharedDB}
	if err := EnsureSchema(t.Context(), backend, sharedRegistrar); err != nil {
		t.Fatal(err)
	}
	if err := EnsureSchema(t.Context(), backend, sharedRegistrar); err != nil {
		t.Fatal(err)
	}
	wantOwners := sharedsubjectlifecycle.MigrationOwner + "," + MigrationOwner
	if strings.Join(sharedRegistrar.owners, ",") != wantOwners+","+wantOwners {
		t.Fatalf("migration owner calls=%v", sharedRegistrar.owners)
	}
	for _, table := range []string{
		"_agent_knowledge_libraries", "_agent_knowledge_library_members",
		"_agent_knowledge_documents", "_agent_knowledge_document_sources",
		"_agent_knowledge_document_jobs", "_agent_knowledge_datasource_bindings",
		sharedsubjectlifecycle.RequestTableName, sharedsubjectlifecycle.StepTableName,
	} {
		var count int
		if err := sharedDB.QueryRowContext(t.Context(), `SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name=?`, table).Scan(&count); err != nil || count != 1 {
			t.Fatalf("shared table %s count=%d err=%v", table, count, err)
		}
	}
	authority := agentsdk.ConversationAuthority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "alice"}
	first := NewStore(backend, nil, ArtifactPersistence{})
	second := NewStore(backend, nil, ArtifactPersistence{})
	library, err := first.CreateKnowledgeLibrary(t.Context(), agentsdk.KnowledgeLibraryCreate{ClientID: "shared", Kind: "personal", Name: "Shared physical row"}, authority)
	if err != nil {
		t.Fatal(err)
	}
	if loaded, readErr := second.KnowledgeLibrary(t.Context(), library.ID, authority); readErr != nil || loaded.ID != library.ID {
		t.Fatalf("shared module row=%+v err=%v", loaded, readErr)
	}

	standaloneDB, standaloneDialect := openDatabase(t, "knowledge-standalone")
	standaloneBackend := SQLBackend{DB: standaloneDB, Dialect: standaloneDialect}
	standaloneRegistrar := &registrar{database: standaloneDB}
	if err = EnsureSchema(t.Context(), standaloneBackend, standaloneRegistrar); err != nil {
		t.Fatal(err)
	}
	standalone := NewStore(standaloneBackend, nil, ArtifactPersistence{})
	if _, readErr := standalone.KnowledgeLibrary(t.Context(), library.ID, authority); readErr == nil {
		t.Fatal("standalone database leaked the Module database library")
	}
}
