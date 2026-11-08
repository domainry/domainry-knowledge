package store

import (
	"database/sql"
	"fmt"
	"os"
	"testing"
	"time"

	sharedoperation "github.com/domainry/domainry-foundation/operation"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	ormdialect "github.com/domainry/domainry-orm/dialect"
	ormpostgres "github.com/domainry/domainry-orm/postgres"
	_ "github.com/jackc/pgx/v5/stdlib"
)

// Real PostgreSQL rejects nested queries while the transaction's result cursor
// is still open. SQLite-only fixtures cannot detect this regression.
func TestKnowledgePageNavigationPostgres(t *testing.T) {
	dsn := os.Getenv("KNOWLEDGE_TEST_POSTGRES_DSN")
	if dsn == "" {
		t.Skip("KNOWLEDGE_TEST_POSTGRES_DSN is not set")
	}
	db, err := sql.Open("pgx", dsn)
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()
	schema := fmt.Sprintf("knowledge_page_test_%d", time.Now().UnixNano())
	if _, err = db.ExecContext(t.Context(), "CREATE SCHEMA "+schema); err != nil {
		t.Fatal(err)
	}
	defer db.Exec("DROP SCHEMA " + schema + " CASCADE")
	dialect, err := ormdialect.New(ormdialect.Postgres)
	if err != nil {
		t.Fatal(err)
	}
	renderer := dialect.WithSchema(schema)
	operations, err := sharedoperation.SchemaMigrationsForDialect(sharedoperation.AdaptDialect(renderer))
	if err != nil {
		t.Fatal(err)
	}
	for _, migration := range append(operations, mustKnowledgeMigrations(t, renderer)...) {
		for _, statement := range migration.Statements {
			if _, err = db.ExecContext(t.Context(), statement); err != nil {
				t.Fatal(err)
			}
		}
	}
	store := New(SQLBackend{DB: db, Dialect: renderer, Engine: ormpostgres.NewProfile()})
	actor := knowledgesdk.Authority{Known: true, RuntimeID: "pg-pages", WorkspaceID: "pg-workspace", UserID: "alice", RoleKey: "editor"}
	library, err := store.CreateKnowledgeLibrary(t.Context(), knowledgesdk.KnowledgeLibraryCreate{ClientID: "pg-library", Kind: "shared", Name: "PG navigation"}, actor)
	if err != nil {
		t.Fatal(err)
	}
	empty, err := store.KnowledgePages(t.Context(), library.ID, "", "", 10, false, actor)
	if err != nil || len(empty.Items) != 0 {
		t.Fatalf("empty list: %+v %v", empty, err)
	}
	parent, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "pg-parent", Title: "Parent", ContentType: "document"}, actor)
	if err != nil {
		t.Fatal(err)
	}
	parent = publishPageFixture(t, store, actor, library, parent, "pg-publish-parent")
	child, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "pg-child", Title: "Child", ParentPageID: parent.Page.ID, ContentType: "document"}, actor)
	if err != nil {
		t.Fatal(err)
	}
	publishPageFixture(t, store, actor, library, child, "pg-publish-child")
	visited := 0
	if err = store.transaction(t.Context(), func(tx *sql.Tx) error {
		return store.visitKnowledgePageDescendants(t.Context(), tx, library.ID, parent.Page.ID, knowledgePageDescendantQuery{
			parentColumn: "published_parent_page_id", activeOnly: true, publishedOnly: true,
		}, actor, func(page knowledgesdk.KnowledgePage, _ string) error {
			if _, accessErr := store.knowledgePageAccessPolicy(t.Context(), tx, library.ID, page.ID, actor); accessErr != nil {
				return accessErr
			}
			visited++
			return nil
		})
	}); err != nil || visited != 1 {
		t.Fatalf("postgres descendant visitor with nested state reads: visited=%d err=%v", visited, err)
	}
	checkList := func(a knowledgesdk.Authority) {
		t.Helper()
		roots, err := store.KnowledgePages(t.Context(), library.ID, "", "", 10, false, a)
		if err != nil || len(roots.Items) != 1 || !roots.Items[0].HasChildren {
			t.Fatalf("roots: %+v %v", roots, err)
		}
		children, err := store.KnowledgePages(t.Context(), library.ID, parent.Page.ID, "", 10, false, a)
		if err != nil || len(children.Items) != 1 || children.Items[0].ID != child.Page.ID {
			t.Fatalf("children: %+v %v", children, err)
		}
	}
	checkList(actor)
	library, err = store.SetKnowledgeLibraryMember(t.Context(), library.ID, "bob", knowledgesdk.KnowledgeLibraryMemberWrite{Role: "reader", ExpectedRevision: library.Revision}, actor)
	if err != nil {
		t.Fatal(err)
	}
	reader := actor
	reader.UserID = "bob"
	checkList(reader)
	// An unbound projection has ready access but no remote document. Token
	// enumeration must still safely examine and exclude it.
	for {
		work, found, err := store.ClaimKnowledgePageProjection(t.Context(), actor.RuntimeID, "pg-test", time.Now().UTC(), time.Minute)
		if err != nil {
			t.Fatal(err)
		}
		if !found {
			break
		}
		if err = store.SkipKnowledgePageProjection(t.Context(), work.Lease); err != nil {
			t.Fatal(err)
		}
	}
	if _, err = store.KnowledgePagePermissionTokens(t.Context(), library.ID, actor); err != nil {
		t.Fatalf("permission tokens: %v", err)
	}
}
