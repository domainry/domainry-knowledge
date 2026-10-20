package store

import "github.com/domainry/domainry-foundation/schemaownership"

var schemaOwnership = []schemaownership.Table{
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
		Name: knowledgePageAccessTable, Owner: MigrationOwner, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"scope_key", "page_id"},
		BoundedQueryPath: "knowledge scope/page access identity with revision compare-and-set",
		DeletionPolicy:   "page or library deletion and subject erasure remove the access policy after collaboration sessions are fenced",
	},
	{
		Name: knowledgePageGrantTable, Owner: MigrationOwner, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"scope_key", "page_id", "user_id", "grant_scope"},
		BoundedQueryPath: "knowledge scope/page/user/grant identity and bounded user grant index",
		DeletionPolicy:   "grant revocation, page or library deletion and subject erasure physically remove the relation",
	},
	{
		Name: knowledgePageCollaborationSessionTable, Owner: MigrationOwner, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionTechnicalTTL, PrimaryKey: []string{"scope_key", "session_id"},
		BoundedQueryPath: "knowledge scope/session identity and bounded page/state/lease session index",
		DeletionPolicy:   "closed or expired sessions are removed; page/library deletion and subject erasure fence and remove active sessions",
	},
	{
		Name: knowledgePageCollaborationUpdateTable, Owner: MigrationOwner, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"scope_key", "page_id", "clock"},
		BoundedQueryPath: "knowledge scope/page/clock identity and bounded collaboration update replay",
		DeletionPolicy:   "compaction removes acknowledged updates; page/library deletion and subject erasure remove remaining update content",
	},
	{
		Name: knowledgePageCollaborationSnapshotTable, Owner: MigrationOwner, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"scope_key", "page_id"},
		BoundedQueryPath: "knowledge scope/page current collaboration snapshot identity",
		DeletionPolicy:   "new compaction replaces the snapshot; page/library deletion and subject erasure remove snapshot content",
	},
	{
		Name: knowledgeSourceTable, Owner: MigrationOwner, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"scope_key", "binding_key"},
		BoundedQueryPath: "knowledge scope/binding identity and globally unique source-key lookup across document and datasource kinds",
		DeletionPolicy:   "source unbinding, library deletion and subject erasure remove the typed source registration after dependent work is fenced",
	},
}

func SchemaOwnership() []schemaownership.Table { return schemaownership.Clone(schemaOwnership) }
func OwnedTables() []string                    { return schemaownership.Names(SchemaOwnership()) }
