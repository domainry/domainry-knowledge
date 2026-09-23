package store

import (
	"database/sql"
	"strings"
	"testing"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	sharedoperation "github.com/domainry/domainry-foundation/operation"
	ormdialect "github.com/domainry/domainry-orm/dialect"
	_ "modernc.org/sqlite"
)

func TestKnowledgeMutationReceiptUsesSharedOperations(t *testing.T) {
	database, err := sql.Open("sqlite", "file:"+t.Name()+"?mode=memory&cache=shared")
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = database.Close() })
	database.SetMaxOpenConns(1)
	dialect, err := ormdialect.New(ormdialect.SQLite)
	if err != nil {
		t.Fatal(err)
	}
	renderer := dialect.WithSchema("")
	operations, err := sharedoperation.SchemaMigrationsForDialect(sharedoperation.AdaptDialect(renderer))
	if err != nil {
		t.Fatal(err)
	}
	knowledge, err := SchemaMigrations(renderer)
	if err != nil {
		t.Fatal(err)
	}
	for _, migration := range append(operations, knowledge...) {
		for _, statement := range migration.Statements {
			if _, err = database.ExecContext(t.Context(), statement); err != nil {
				t.Fatal(err)
			}
		}
	}
	store := New(SQLBackend{DB: database, Dialect: renderer}, nil, ArtifactPersistence{})
	authority := agentsdk.ConversationAuthority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "alice"}
	applied := 0
	apply := func(*sql.Tx) (any, error) {
		applied++
		return map[string]any{"artifact_id": "artifact-1"}, nil
	}
	var first, replay map[string]any
	if err = store.CompatArtifactMutation(t.Context(), "create-1", "create", map[string]any{"title": "one"}, authority, apply, &first); err != nil {
		t.Fatal(err)
	}
	if err = store.CompatArtifactMutation(t.Context(), "create-1", "create", map[string]any{"title": "one"}, authority, apply, &replay); err != nil {
		t.Fatal(err)
	}
	if applied != 1 || first["artifact_id"] != replay["artifact_id"] {
		t.Fatalf("shared operation replay first=%v replay=%v applied=%d", first, replay, applied)
	}
	if err = store.CompatArtifactMutation(t.Context(), "create-1", "create", map[string]any{"title": "changed"}, authority, apply, &replay); err == nil || !strings.Contains(err.Error(), "idempotency_conflict") {
		t.Fatalf("changed request reused operation receipt: %v", err)
	}
	var receipts int
	if err = database.QueryRowContext(t.Context(), `SELECT COUNT(*) FROM _operations WHERE workspace_id=? AND owner='knowledge' AND kind='knowledge.artifact_mutation' AND status='succeeded'`, authority.WorkspaceID).Scan(&receipts); err != nil || receipts != 1 {
		t.Fatalf("Knowledge operation receipts=%d err=%v", receipts, err)
	}
	for _, retired := range []string{"_agent_artifact_mutations", "_knowledge_owner_operation_receipts"} {
		var count int
		if err = database.QueryRowContext(t.Context(), `SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name=?`, retired).Scan(&count); err != nil || count != 0 {
			t.Fatalf("retired receipt table %s count=%d err=%v", retired, count, err)
		}
	}
}
