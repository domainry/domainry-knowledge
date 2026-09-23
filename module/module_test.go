package module

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
	"testing"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/modulehost"
	"github.com/domainry/domainry-agent-sdk/persistence"
	sharedoperation "github.com/domainry/domainry-foundation/operation"
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
	wantOwners := sharedoperation.MigrationOwner + "," + sharedsubjectlifecycle.MigrationOwner + "," + MigrationOwner
	if strings.Join(sharedRegistrar.owners, ",") != wantOwners+","+wantOwners {
		t.Fatalf("migration owner calls=%v", sharedRegistrar.owners)
	}
	for _, table := range []string{
		"_agent_knowledge_libraries", "_agent_knowledge_library_members",
		"_agent_knowledge_documents", "_agent_knowledge_sources",
		"_agent_knowledge_document_jobs", "_agent_attachment_index_jobs",
		sharedoperation.TableName,
		sharedsubjectlifecycle.RequestTableName, sharedsubjectlifecycle.StepTableName,
	} {
		var count int
		if err := sharedDB.QueryRowContext(t.Context(), `SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name=?`, table).Scan(&count); err != nil || count != 1 {
			t.Fatalf("shared table %s count=%d err=%v", table, count, err)
		}
	}
	for _, retired := range []string{"_agent_knowledge_document_sources", "_agent_knowledge_datasource_bindings", "_agent_attachment_knowledge_sources", "_agent_artifact_mutations", "_knowledge_owner_operation_receipts"} {
		var count int
		if err := sharedDB.QueryRowContext(t.Context(), `SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name=?`, retired).Scan(&count); err != nil || count != 0 {
			t.Fatalf("retired table %s count=%d err=%v", retired, count, err)
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
	var operationReceipts int

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
	if err = standaloneDB.QueryRowContext(t.Context(), `SELECT COUNT(*) FROM _operations WHERE owner='knowledge'`).Scan(&operationReceipts); err != nil || operationReceipts != 0 {
		t.Fatalf("standalone database leaked Knowledge operation receipts=%d err=%v", operationReceipts, err)
	}
}

func TestKnowledgeSourcesUseOneTypedRegistry(t *testing.T) {
	database, dialect := openDatabase(t, "knowledge-source-registry")
	backend := SQLBackend{DB: database, Dialect: dialect}
	if err := EnsureSchema(t.Context(), backend, &registrar{database: database}); err != nil {
		t.Fatal(err)
	}
	store := NewStore(backend, nil, ArtifactPersistence{})
	authority := agentsdk.ConversationAuthority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "alice"}
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
	attachmentSource := strings.Repeat("d", 64)
	if err = store.ActivateAttachmentKnowledgeSource(t.Context(), authority.RuntimeID, authority.WorkspaceID, attachmentSource); err != nil {
		t.Fatal(err)
	}

	rows, err := database.QueryContext(t.Context(), `SELECT source_kind, source_key FROM _agent_knowledge_sources ORDER BY source_kind`)
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
	want := map[string]string{"document": documentSource, "datasource": datasourceSource, "attachment": attachmentSource}
	if len(got) != len(want) {
		t.Fatalf("source registry rows=%v", got)
	}
	for kind, source := range want {
		if got[kind] != source {
			t.Fatalf("source registry kind=%s source=%q want=%q", kind, got[kind], source)
		}
	}
}
