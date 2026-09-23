package store

import "github.com/domainry/domainry-foundation/schemaownership"

var schemaOwnership = []schemaownership.Table{
	{
		Name: ArtifactVersionsTable, Owner: MigrationOwner, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"owner_key", "artifact_id", "version"},
		BoundedQueryPath: "owner/artifact/version identity and bounded descending version history",
		DeletionPolicy:   "artifact deletion and subject erasure remove immutable logical versions after shared blob and binding revocation",
	},
	{
		Name: ArtifactsTable, Owner: MigrationOwner, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"owner_key", "artifact_id"},
		BoundedQueryPath: "owner/artifact identity and bounded owner creation cursor",
		DeletionPolicy:   "artifact deletion and subject erasure remove logical metadata after shared Artifact content and bindings are revoked",
	},
	{
		Name: CompatAttachmentIndexJobTable, Owner: MigrationOwner, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionTechnicalTTL, PrimaryKey: []string{"owner_key", "attachment_id"},
		BoundedQueryPath: "owner/attachment work identity and runtime/due/lease claim index",
		DeletionPolicy:   "successful or terminal indexing removes the work row; subject erasure cancels and removes owner work",
	},
	{
		Name: CompatKnowledgeDocumentJobTable, Owner: MigrationOwner, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionTechnicalTTL, PrimaryKey: []string{"scope_key", "document_id"},
		BoundedQueryPath: "knowledge scope/document work identity and runtime/due/lease claim index",
		DeletionPolicy:   "successful or terminal ingestion removes the work row; library deletion and subject erasure cancel active work",
	},
	{
		Name: CompatKnowledgeDocumentTable, Owner: MigrationOwner, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"scope_key", "document_id"},
		BoundedQueryPath: "knowledge scope/document identity, source/remote identity and bounded library document listing",
		DeletionPolicy:   "document or library deletion and subject erasure remove document metadata after external content cleanup",
	},
	{
		Name: CompatLibraryTable, Owner: MigrationOwner, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"scope_key", "library_id"},
		BoundedQueryPath: "knowledge scope/library identity, request identity and revision compare-and-set",
		DeletionPolicy:   "library deletion removes dependent members, sources, documents and work; personal libraries are removed on subject erasure",
	},
	{
		Name: CompatLibraryMemberTable, Owner: MigrationOwner, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"scope_key", "library_id", "user_id"},
		BoundedQueryPath: "knowledge scope/library/user identity plus bounded user-to-library and library membership paging",
		DeletionPolicy:   "membership revocation or subject erasure physically removes the relation while preserving the last-manager invariant",
	},
	{
		Name: CompatKnowledgeSourceTable, Owner: MigrationOwner, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"scope_key", "binding_key"},
		BoundedQueryPath: "knowledge scope/binding identity and globally unique source-key lookup across document, datasource and attachment kinds",
		DeletionPolicy:   "source unbinding, library deletion and subject erasure remove the typed source registration after dependent work is fenced",
	},
}

func SchemaOwnership() []schemaownership.Table { return schemaownership.Clone(schemaOwnership) }
func OwnedTables() []string                    { return schemaownership.Names(SchemaOwnership()) }
