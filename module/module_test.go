package module

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
	"testing"

	sharedoperation "github.com/domainry/domainry-foundation/operation"
	"github.com/domainry/domainry-foundation/schemaownership"
	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/modulehost"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
	recordstore "github.com/domainry/domainry-knowledge/internal/infrastructure/persistence/database/record"
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
	wantOwners := sharedoperation.MigrationOwner + "," + MigrationOwner
	if strings.Join(sharedRegistrar.owners, ",") != wantOwners+","+wantOwners {
		t.Fatalf("migration owner calls=%v", sharedRegistrar.owners)
	}
	for _, table := range []string{
		"_knowledge_libraries", "_knowledge_library_members",
		"_knowledge_documents", "_knowledge_sources",
		"_knowledge_document_jobs",
		sharedoperation.TableName,
	} {
		var count int
		if err := sharedDB.QueryRowContext(t.Context(), `SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name=?`, table).Scan(&count); err != nil || count != 1 {
			t.Fatalf("shared table %s count=%d err=%v", table, count, err)
		}
	}
	for _, retired := range []string{"_knowledge_owner_operation_receipts"} {
		var count int
		if err := sharedDB.QueryRowContext(t.Context(), `SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name=?`, retired).Scan(&count); err != nil || count != 0 {
			t.Fatalf("retired table %s count=%d err=%v", retired, count, err)
		}
	}
	authority := agentsdk.Authority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "alice"}
	first := NewStore(backend)
	second := NewStore(backend)
	library, err := first.CreateKnowledgeLibrary(t.Context(), agentsdk.KnowledgeLibraryCreate{ClientID: "shared", Kind: "personal", Name: "Shared physical row"}, authority)
	if err != nil {
		t.Fatal(err)
	}
	if loaded, readErr := second.KnowledgeLibrary(t.Context(), library.ID, authority); readErr != nil || loaded.ID != library.ID {
		t.Fatalf("shared module row=%+v err=%v", loaded, readErr)
	}
	var operationReceipts int

	standaloneDB, standaloneDialect := openDatabase(t, "knowledge-standalone")
	standaloneBackend := SQLBackend{DB: standaloneDB, Dialect: standaloneDialect}
	standaloneRegistrar := &registrar{database: standaloneDB}
	if err = EnsureSchema(t.Context(), standaloneBackend, standaloneRegistrar); err != nil {
		t.Fatal(err)
	}
	standalone := NewStore(standaloneBackend)
	if _, readErr := standalone.KnowledgeLibrary(t.Context(), library.ID, authority); readErr == nil {
		t.Fatal("standalone database leaked the Module database library")
	}
	if err = standaloneDB.QueryRowContext(t.Context(), `SELECT COUNT(*) FROM _operations WHERE owner='knowledge'`).Scan(&operationReceipts); err != nil || operationReceipts != 0 {
		t.Fatalf("standalone database leaked Knowledge operation receipts=%d err=%v", operationReceipts, err)
	}
}

func TestKnowledgeSchemaOwnershipMatchesFreshPhysicalPrimaryKeys(t *testing.T) {
	tables := SchemaOwnership()
	if err := schemaownership.ValidateAll(tables); err != nil {
		t.Fatal(err)
	}
	if len(tables) != 43 || len(OwnedTables()) != len(tables) {
		t.Fatalf("Knowledge ownership=%+v names=%v", tables, OwnedTables())
	}
	database, dialect := openDatabase(t, "knowledge-ownership")
	if err := EnsureSchema(t.Context(), SQLBackend{DB: database, Dialect: dialect}, &registrar{database: database}); err != nil {
		t.Fatal(err)
	}
	recordMigrations, err := recordstore.Migrations(dialect)
	if err != nil {
		t.Fatal(err)
	}
	for _, migration := range recordMigrations {
		for _, statement := range migration.Statements {
			if _, err = database.ExecContext(t.Context(), statement); err != nil {
				t.Fatal(err)
			}
		}
	}
	for _, table := range tables {
		rows, err := database.QueryContext(t.Context(), `SELECT name, type FROM pragma_table_info(?) WHERE pk > 0 ORDER BY pk`, table.Name)
		if err != nil {
			t.Fatal(err)
		}
		primaryKey := []string{}
		primaryType := ""
		for rows.Next() {
			var column, columnType string
			if err := rows.Scan(&column, &columnType); err != nil {
				_ = rows.Close()
				t.Fatal(err)
			}
			primaryKey = append(primaryKey, column)
			primaryType = columnType
		}
		if err := rows.Close(); err != nil {
			t.Fatal(err)
		}
		if strings.Join(primaryKey, ",") != strings.Join(table.PrimaryKey, ",") {
			t.Fatalf("Knowledge table %s physical primary key=%v ownership=%v", table.Name, primaryKey, table.PrimaryKey)
		}
		var ddl string
		if err := database.QueryRowContext(t.Context(), `SELECT sql FROM sqlite_master WHERE type='table' AND name=?`, table.Name).Scan(&ddl); err != nil {
			t.Fatal(err)
		}
		if primaryType != "INTEGER" || !strings.Contains(strings.ToUpper(ddl), "AUTOINCREMENT") {
			t.Fatalf("Knowledge table %s physical id type=%q ddl=%s", table.Name, primaryType, ddl)
		}
		if table.Kind == schemaownership.KindEntity && !hasSingleColumnUniqueIndex(t, database, table.Name, table.EntityIDColumn) {
			t.Fatalf("Knowledge entity table %s has no globally unique %s", table.Name, table.EntityIDColumn)
		}
	}
}

func hasSingleColumnUniqueIndex(t *testing.T, database *sql.DB, table, column string) bool {
	t.Helper()
	rows, err := database.QueryContext(t.Context(), `SELECT name, "unique" FROM pragma_index_list(?)`, table)
	if err != nil {
		t.Fatal(err)
	}
	uniqueIndexes := []string{}
	for rows.Next() {
		var name string
		var unique int
		if err = rows.Scan(&name, &unique); err != nil {
			t.Fatal(err)
		}
		if unique == 0 {
			continue
		}
		uniqueIndexes = append(uniqueIndexes, name)
	}
	if err = rows.Close(); err != nil {
		t.Fatal(err)
	}
	if err = rows.Err(); err != nil {
		t.Fatal(err)
	}
	for _, name := range uniqueIndexes {
		indexRows, indexErr := database.QueryContext(t.Context(), `SELECT name FROM pragma_index_info(?) ORDER BY seqno`, name)
		if indexErr != nil {
			t.Fatal(indexErr)
		}
		columns := []string{}
		for indexRows.Next() {
			var indexedColumn string
			if indexErr = indexRows.Scan(&indexedColumn); indexErr != nil {
				_ = indexRows.Close()
				t.Fatal(indexErr)
			}
			columns = append(columns, indexedColumn)
		}
		if indexErr = indexRows.Close(); indexErr != nil {
			t.Fatal(indexErr)
		}
		if len(columns) == 1 && columns[0] == column {
			return true
		}
	}
	return false
}

func TestKnowledgeSourcesUseOneTypedRegistry(t *testing.T) {
	database, dialect := openDatabase(t, "knowledge-source-registry")
	backend := SQLBackend{DB: database, Dialect: dialect}
	if err := EnsureSchema(t.Context(), backend, &registrar{database: database}); err != nil {
		t.Fatal(err)
	}
	store := NewStore(backend)
	authority := agentsdk.Authority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "alice"}
	documentLibrary, err := store.CreateKnowledgeLibrary(t.Context(), agentsdk.KnowledgeLibraryCreate{ClientID: "document", Kind: "shared", Name: "Document source"}, authority)
	if err != nil {
		t.Fatal(err)
	}
	documentSource := strings.Repeat("a", 64)
	if err = store.ActivateKnowledgeDocumentSource(t.Context(), agentsdk.KnowledgeDocumentStorageScope{RuntimeID: authority.RuntimeID, WorkspaceID: authority.WorkspaceID, LibraryID: documentLibrary.ID}, documentSource); err != nil {
		t.Fatal(err)
	}
	if _, found, readErr := store.KnowledgeDatasourceBinding(t.Context(), agentsdk.KnowledgeDocumentStorageScope{RuntimeID: authority.RuntimeID, WorkspaceID: authority.WorkspaceID, LibraryID: documentLibrary.ID}); readErr != nil || found {
		t.Fatalf("direct source exposed a datasource binding: found=%v err=%v", found, readErr)
	}

	datasourceLibrary, err := store.CreateKnowledgeLibrary(t.Context(), agentsdk.KnowledgeLibraryCreate{ClientID: "datasource", Kind: "shared", Name: "Datasource"}, authority)
	if err != nil {
		t.Fatal(err)
	}
	datasourceSource := strings.Repeat("b", 64)
	if _, err = store.BindKnowledgeDatasource(t.Context(), datasourceLibrary.ID, persistence.KnowledgeDatasourceAssignment{DatasourceKey: "approved", SourceID: datasourceSource, AccessPolicySHA256: strings.Repeat("c", 64), ExpectedRevision: datasourceLibrary.Revision}, authority); err != nil {
		t.Fatal(err)
	}
	rows, err := database.QueryContext(t.Context(), `SELECT source_kind, source_key FROM _knowledge_sources ORDER BY source_kind`)
	if err != nil {
		t.Fatal(err)
	}
	defer rows.Close()
	got := map[string]string{}
	for rows.Next() {
		var kind, source string
		if err = rows.Scan(&kind, &source); err != nil {
			t.Fatal(err)
		}
		got[kind] = source
	}
	if err = rows.Err(); err != nil {
		t.Fatal(err)
	}
	want := map[string]string{"document": documentSource, "datasource": datasourceSource}
	if len(got) != len(want) {
		t.Fatalf("source registry rows=%v", got)
	}
	for kind, source := range want {
		if got[kind] != source {
			t.Fatalf("source registry kind=%s source=%q want=%q", kind, got[kind], source)
		}
	}
}
