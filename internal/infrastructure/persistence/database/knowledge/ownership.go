package store

import "github.com/domainry/domainry-foundation/schemaownership"

var schemaOwnership = []schemaownership.Table{
	{
		Name: conversationArtifactVersionTable, Owner: MigrationOwner, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"owner_key", "artifact_id", "version"},
		BoundedQueryPath: "owner/artifact/version identity and bounded descending version history",
		DeletionPolicy:   "artifact deletion and subject erasure remove immutable logical versions after shared blob and binding revocation",
	},
	{
		Name: conversationArtifactTable, Owner: MigrationOwner, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"owner_key", "artifact_id"},
		BoundedQueryPath: "owner/artifact identity and bounded owner creation cursor",
		DeletionPolicy:   "artifact deletion and subject erasure remove logical metadata after shared Artifact content and bindings are revoked",
	},
	{
		Name: attachmentIndexJobTable, Owner: MigrationOwner, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionTechnicalTTL, PrimaryKey: []string{"owner_key", "attachment_id"},
		BoundedQueryPath: "owner/attachment work identity and runtime/due/lease claim index",
		DeletionPolicy:   "successful or terminal indexing removes the work row; subject erasure cancels and removes owner work",
	},
	{
		Name: knowledgeDocumentJobTable, Owner: MigrationOwner, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionTechnicalTTL, PrimaryKey: []string{"scope_key", "document_id"},
		BoundedQueryPath: "knowledge scope/document work identity and runtime/due/lease claim index",
		DeletionPolicy:   "successful or terminal ingestion removes the work row; library deletion and subject erasure cancel active work",
	},
	{
		Name: knowledgeDocumentTable, Owner: MigrationOwner, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"scope_key", "document_id"},
		BoundedQueryPath: "knowledge scope/document identity, source/remote identity and bounded library document listing",
		DeletionPolicy:   "document or library deletion and subject erasure remove document metadata after external content cleanup",
	},
	{
		Name: knowledgeLibraryTable, Owner: MigrationOwner, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"scope_key", "library_id"},
		BoundedQueryPath: "knowledge scope/library identity, request identity and revision compare-and-set",
		DeletionPolicy:   "library deletion removes dependent members, sources, documents and work; personal libraries are removed on subject erasure",
	},
	{
		Name: knowledgeLibraryMemberTable, Owner: MigrationOwner, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"scope_key", "library_id", "user_id"},
		BoundedQueryPath: "knowledge scope/library/user identity plus bounded user-to-library and library membership paging",
		DeletionPolicy:   "membership revocation or subject erasure physically removes the relation while preserving the last-manager invariant",
	},
	{
		Name: knowledgePageTable, Owner: MigrationOwner, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"scope_key", "page_id"},
		BoundedQueryPath: "knowledge scope/page identity and bounded library parent/rank tree paging",
		DeletionPolicy:   "page archival retains metadata and versions; library deletion or subject erasure removes the page after projection cleanup",
	},
	{
		Name: knowledgePageDraftTable, Owner: MigrationOwner, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"scope_key", "page_id"},
		BoundedQueryPath: "knowledge scope/page current draft identity with revision compare-and-set",
		DeletionPolicy:   "page or library deletion and subject erasure remove mutable draft content; publishing never rewrites historical versions",
	},
	{
		Name: knowledgePageVersionTable, Owner: MigrationOwner, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"scope_key", "page_id", "version"},
		BoundedQueryPath: "knowledge scope/page/version identity and bounded descending version history",
		DeletionPolicy:   "page archival retains immutable versions; library deletion or subject erasure removes versions after projection cleanup",
	},
	{
		Name: knowledgePageCommentTable, Owner: MigrationOwner, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"scope_key", "comment_id"},
		BoundedQueryPath: "knowledge scope/comment identity, bounded page thread paging and author erasure index",
		DeletionPolicy:   "comment deletion tombstones the body; page or library deletion and subject erasure physically remove retained rows",
	},
	{
		Name: knowledgePageAttachmentTable, Owner: MigrationOwner, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"scope_key", "page_id", "document_id"},
		BoundedQueryPath: "knowledge scope/page/document identity and bounded page rank listing",
		DeletionPolicy:   "detaching, page/library deletion or subject erasure removes only the relation and never the immutable document original",
	},
	{
		Name: knowledgePageProjectionJobTable, Owner: MigrationOwner, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionTechnicalTTL, PrimaryKey: []string{"scope_key", "page_id"},
		BoundedQueryPath: "knowledge scope/page projection identity and due/lease claim index",
		DeletionPolicy:   "successful projection or terminal archival removes the intent; library deletion and subject erasure fence and remove active work",
	},
	{
		Name: knowledgeSourceTable, Owner: MigrationOwner, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"scope_key", "binding_key"},
		BoundedQueryPath: "knowledge scope/binding identity and globally unique source-key lookup across document, datasource and attachment kinds",
		DeletionPolicy:   "source unbinding, library deletion and subject erasure remove the typed source registration after dependent work is fenced",
	},
}

func SchemaOwnership() []schemaownership.Table { return schemaownership.Clone(schemaOwnership) }
func OwnedTables() []string                    { return schemaownership.Names(SchemaOwnership()) }
