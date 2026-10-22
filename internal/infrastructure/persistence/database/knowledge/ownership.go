package store

import "github.com/domainry/domainry-foundation/schemaownership"

var schemaOwnership = []schemaownership.Table{
	{
		Name: knowledgeDocumentJobTable, Owner: MigrationOwner, Kind: schemaownership.KindState, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionTechnicalTTL, PrimaryKey: []string{"id"},
		BoundedQueryPath: "knowledge scope/document work identity and runtime/due/lease claim index",
		DeletionPolicy:   "successful or terminal ingestion removes the work row; library deletion and subject erasure cancel active work",
	},
	{
		Name: knowledgeDocumentTable, Owner: MigrationOwner, Kind: schemaownership.KindEntity, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"}, EntityIDColumn: "document_id", EntityIDPrefix: "kdoc", BusinessKey: []string{"document_id"},
		BoundedQueryPath: "knowledge scope/document identity, source/remote identity and bounded library document listing",
		DeletionPolicy:   "document or library deletion and subject erasure remove document metadata after external content cleanup",
	},
	{
		Name: knowledgeLibraryTable, Owner: MigrationOwner, Kind: schemaownership.KindEntity, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"}, EntityIDColumn: "library_id", EntityIDPrefix: "klib", BusinessKey: []string{"library_id"},
		BoundedQueryPath: "knowledge scope/library identity, request identity and revision compare-and-set",
		DeletionPolicy:   "library deletion removes dependent members, sources, documents and work; personal libraries are removed on subject erasure",
	},
	{
		Name: knowledgeLibraryMemberTable, Owner: MigrationOwner, Kind: schemaownership.KindRelation, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"},
		BoundedQueryPath: "knowledge scope/library/Identity subject plus bounded subject-to-library and library membership paging",
		DeletionPolicy:   "user or organization membership revocation and subject erasure physically remove the relation while preserving the last-manager invariant",
	},
	{
		Name: knowledgePageTable, Owner: MigrationOwner, Kind: schemaownership.KindEntity, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"}, EntityIDColumn: "page_id", EntityIDPrefix: "kpage", BusinessKey: []string{"page_id"},
		BoundedQueryPath: "knowledge scope/page identity and bounded library parent/rank tree paging",
		DeletionPolicy:   "page archival retains metadata and versions; library deletion or subject erasure removes the page after projection cleanup",
	},
	{
		Name: knowledgePageMetadataTable, Owner: MigrationOwner, Kind: schemaownership.KindDependent, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"},
		BoundedQueryPath: "knowledge scope/page metadata identity with revision compare-and-set and bounded owner/status/review indexes",
		DeletionPolicy:   "page or library deletion and subject erasure remove mutable page metadata; publishing never rewrites immutable content versions",
	},
	{
		Name: knowledgePageTagTable, Owner: MigrationOwner, Kind: schemaownership.KindRelation, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"},
		BoundedQueryPath: "knowledge scope/library/tag/page lookup for authorized metadata filtering",
		DeletionPolicy:   "metadata replacement, page or library deletion and subject erasure physically remove page tag relations",
	},
	{
		Name: knowledgePageNameTable, Owner: MigrationOwner, Kind: schemaownership.KindDependent, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"},
		BoundedQueryPath: "knowledge scope/library/normalized draft title, published title and alias lookup for authorized page disambiguation",
		DeletionPolicy:   "title or metadata replacement updates the relevant names; page or library deletion and subject erasure physically remove all page names",
	},
	{
		Name: knowledgePageRelationTable, Owner: MigrationOwner, Kind: schemaownership.KindRelation, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"},
		BoundedQueryPath: "knowledge scope/source/target identity with bounded outgoing and incoming relationship traversal",
		DeletionPolicy:   "metadata replacement removes outgoing associations; page or library deletion and subject erasure remove incoming and outgoing relations",
	},
	{
		Name: knowledgePageDraftTable, Owner: MigrationOwner, Kind: schemaownership.KindState, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"},
		BoundedQueryPath: "knowledge scope/page current draft identity with revision compare-and-set",
		DeletionPolicy:   "page or library deletion and subject erasure remove mutable draft content; publishing never rewrites historical versions",
	},
	{
		Name: knowledgePageVersionTable, Owner: MigrationOwner, Kind: schemaownership.KindDependent, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"},
		BoundedQueryPath: "knowledge scope/page/version identity and bounded descending version history",
		DeletionPolicy:   "page archival retains immutable versions; library deletion or subject erasure removes versions after projection cleanup",
	},
	{
		Name: knowledgePageCommentTable, Owner: MigrationOwner, Kind: schemaownership.KindEntity, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"}, EntityIDColumn: "comment_id", EntityIDPrefix: "kcomment", BusinessKey: []string{"comment_id"},
		BoundedQueryPath: "knowledge scope/comment identity, bounded page thread paging and author erasure index",
		DeletionPolicy:   "comment deletion tombstones the body; page or library deletion and subject erasure physically remove retained rows",
	},
	{
		Name: knowledgePageCommentReactionTable, Owner: MigrationOwner, Kind: schemaownership.KindRelation, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"},
		BoundedQueryPath: "knowledge scope/comment reaction aggregation and bounded user erasure index",
		DeletionPolicy:   "removing a reaction, page/library deletion, or subject erasure physically removes the reaction row",
	},
	{
		Name: knowledgePageAttachmentTable, Owner: MigrationOwner, Kind: schemaownership.KindRelation, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"},
		BoundedQueryPath: "knowledge scope/page/document identity and bounded page rank listing",
		DeletionPolicy:   "detaching, page/library deletion or subject erasure removes only the relation and never the immutable document original",
	},
	{
		Name: knowledgePageTaskTable, Owner: MigrationOwner, Kind: schemaownership.KindEntity, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"}, EntityIDColumn: "task_id", EntityIDPrefix: "ktask", BusinessKey: []string{"task_id"},
		BoundedQueryPath: "knowledge scope/task identity plus bounded page/status and reminder/due indexes",
		DeletionPolicy:   "page or library deletion and subject erasure remove task state; completing a task retains its audit-visible state",
	},
	{
		Name: knowledgePagePollTable, Owner: MigrationOwner, Kind: schemaownership.KindEntity, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"}, EntityIDColumn: "poll_id", EntityIDPrefix: "kpoll", BusinessKey: []string{"poll_id"},
		BoundedQueryPath: "knowledge scope/poll identity and bounded page/status listing",
		DeletionPolicy:   "page or library deletion and subject erasure remove poll configuration after ballots and selections are removed",
	},
	{
		Name: knowledgePagePollBallotTable, Owner: MigrationOwner, Kind: schemaownership.KindState, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"},
		BoundedQueryPath: "knowledge scope/poll/user ballot identity plus bounded page/user lookup",
		DeletionPolicy:   "page or library deletion, subject erasure, or poll removal physically removes the caller ballot",
	},
	{
		Name: knowledgePagePollSelectionTable, Owner: MigrationOwner, Kind: schemaownership.KindRelation, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"},
		BoundedQueryPath: "knowledge scope/page/poll/option aggregate result index and bounded caller selection lookup",
		DeletionPolicy:   "ballot replacement, page or library deletion, subject erasure, or poll removal physically removes selections",
	},
	{
		Name: knowledgePageFormSubmissionTable, Owner: MigrationOwner, Kind: schemaownership.KindEntity, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"}, EntityIDColumn: "submission_id", EntityIDPrefix: "kformsub", BusinessKey: []string{"submission_id"},
		BoundedQueryPath: "knowledge scope/page/submission identity with bounded page/time and page/user indexes",
		DeletionPolicy:   "page or library deletion and subject erasure remove immutable form responses; publishing a new form version never rewrites prior responses",
	},
	{
		Name: knowledgePageTemplateTable, Owner: MigrationOwner, Kind: schemaownership.KindEntity, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"}, EntityIDColumn: "template_id", EntityIDPrefix: "ktmpl", BusinessKey: []string{"template_id"},
		BoundedQueryPath: "knowledge scope/template identity and bounded library/title listing",
		DeletionPolicy:   "library deletion or subject erasure removes the template catalog after created instances remain independent",
	},
	{
		Name: knowledgePageTemplateVersionTable, Owner: MigrationOwner, Kind: schemaownership.KindDependent, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"},
		BoundedQueryPath: "knowledge scope/template/version identity and bounded descending immutable history",
		DeletionPolicy:   "library deletion or subject erasure removes immutable template versions; instantiated pages are never linked for mutation",
	},
	{
		Name: knowledgePageProjectionJobTable, Owner: MigrationOwner, Kind: schemaownership.KindState, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionTechnicalTTL, PrimaryKey: []string{"id"},
		BoundedQueryPath: "knowledge scope/page projection identity and due/lease claim index",
		DeletionPolicy:   "successful projection or terminal archival removes the intent; library deletion and subject erasure fence and remove active work",
	},
	{
		Name: knowledgePageAccessTable, Owner: MigrationOwner, Kind: schemaownership.KindState, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"},
		BoundedQueryPath: "knowledge scope/page access identity with revision compare-and-set",
		DeletionPolicy:   "page or library deletion and subject erasure remove the access policy after collaboration sessions are fenced",
	},
	{
		Name: knowledgePageGrantTable, Owner: MigrationOwner, Kind: schemaownership.KindRelation, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"},
		BoundedQueryPath: "knowledge scope/page/Identity subject/grant identity and bounded subject grant index",
		DeletionPolicy:   "grant revocation, page or library deletion and subject erasure physically remove the relation",
	},
	{
		Name: knowledgePageContentPolicyTable, Owner: MigrationOwner, Kind: schemaownership.KindState, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"},
		BoundedQueryPath: "knowledge scope/page content-policy identity with bounded ancestor traversal and revision compare-and-set",
		DeletionPolicy:   "page or library deletion and subject erasure physically remove the content-governance policy",
	},
	{
		Name: knowledgePageShareTable, Owner: MigrationOwner, Kind: schemaownership.KindEntity, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"}, EntityIDColumn: "share_id", EntityIDPrefix: "kshare", BusinessKey: []string{"share_id"},
		BoundedQueryPath: "knowledge scope/share identity plus bounded page/state and expiry indexes",
		DeletionPolicy:   "share revocation retains the policy audit state while removing all user-bound redemptions; page/library deletion and subject erasure remove the share",
	},
	{
		Name: knowledgePageShareRedemptionTable, Owner: MigrationOwner, Kind: schemaownership.KindRelation, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"},
		BoundedQueryPath: "knowledge scope/share/user redemption identity and bounded user entitlement lookup",
		DeletionPolicy:   "share revocation, expiry cleanup, page/library deletion or subject erasure physically removes the redemption",
	},
	{
		Name: knowledgePageCollaborationSessionTable, Owner: MigrationOwner, Kind: schemaownership.KindState, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionTechnicalTTL, PrimaryKey: []string{"id"},
		BoundedQueryPath: "knowledge scope/session identity and bounded page/state/lease session index",
		DeletionPolicy:   "closed or expired sessions are removed; page/library deletion and subject erasure fence and remove active sessions",
	},
	{
		Name: knowledgePageCollaborationUpdateTable, Owner: MigrationOwner, Kind: schemaownership.KindDependent, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"},
		BoundedQueryPath: "knowledge scope/page/clock identity and bounded collaboration update replay",
		DeletionPolicy:   "compaction removes acknowledged updates; page/library deletion and subject erasure remove remaining update content",
	},
	{
		Name: knowledgePageCollaborationSnapshotTable, Owner: MigrationOwner, Kind: schemaownership.KindState, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"},
		BoundedQueryPath: "knowledge scope/page current collaboration snapshot identity",
		DeletionPolicy:   "new compaction replaces the snapshot; page/library deletion and subject erasure remove snapshot content",
	},
	{
		Name: knowledgePageEditHistoryTable, Owner: MigrationOwner, Kind: schemaownership.KindDependent, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"},
		BoundedQueryPath: "knowledge scope/page/draft-revision identity with bounded descending edit history and user erasure index",
		DeletionPolicy:   "page or library deletion and subject erasure remove block-level edit history; collaboration update compaction does not remove it",
	},
	{
		Name: knowledgePageSuggestionTable, Owner: MigrationOwner, Kind: schemaownership.KindEntity, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"}, EntityIDColumn: "suggestion_id", EntityIDPrefix: "ksuggest", BusinessKey: []string{"suggestion_id"},
		BoundedQueryPath: "knowledge scope/suggestion identity with bounded page/status and author indexes",
		DeletionPolicy:   "page or library deletion and subject erasure remove revision suggestions and their discussion metadata",
	},
	{
		Name: knowledgePageNativeOperationTable, Owner: MigrationOwner, Kind: schemaownership.KindIdempotency, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"},
		BoundedQueryPath: "knowledge scope/page/operation identity with bounded draft-revision replay and user erasure indexes",
		DeletionPolicy:   "page or library deletion and subject erasure remove native editor operation records after published snapshots are retained independently",
	},
	{
		Name: knowledgePageReferenceTable, Owner: MigrationOwner, Kind: schemaownership.KindRelation, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"},
		BoundedQueryPath: "knowledge scope/source/block identity plus bounded target backlink and cycle traversal indexes",
		DeletionPolicy:   "saving a source draft replaces its reference rows; page or library deletion and subject erasure remove both incoming and outgoing relations",
	},
	{
		Name: knowledgePagePersonalStateTable, Owner: MigrationOwner, Kind: schemaownership.KindState, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"},
		BoundedQueryPath: "knowledge scope/user/page identity plus bounded library collection indexes for favorites, subscriptions, shortcuts and recent activity",
		DeletionPolicy:   "page or library deletion and subject erasure remove personal navigation state; individual toggles and recent activity remain isolated to the owning user",
	},
	{
		Name: knowledgeSourceTable, Owner: MigrationOwner, Kind: schemaownership.KindRelation, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"},
		BoundedQueryPath: "knowledge scope/binding identity and globally unique source-key lookup across document and datasource kinds",
		DeletionPolicy:   "source unbinding, library deletion and subject erasure remove the typed source registration after dependent work is fenced",
	},
	{
		Name: knowledgeWebhookSubscriptionTable, Owner: MigrationOwner, Kind: schemaownership.KindEntity, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"}, EntityIDColumn: "subscription_id", EntityIDPrefix: "kwhsub", BusinessKey: []string{"subscription_id"},
		BoundedQueryPath: "knowledge scope/library/state/subscription listing and request-key idempotency",
		DeletionPolicy:   "revocation retains subscription audit state; library deletion and subject erasure remove subscriptions after deliveries are fenced",
	},
	{
		Name: knowledgeWebhookEventTable, Owner: MigrationOwner, Kind: schemaownership.KindEntity, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionLegalAudit, PrimaryKey: []string{"id"}, EntityIDColumn: "event_id", EntityIDPrefix: "kwhevt", BusinessKey: []string{"event_id"},
		BoundedQueryPath: "knowledge scope/event identity and bounded library/time replay listing",
		DeletionPolicy:   "events are immutable and retained for bounded replay until the workspace retention policy deletes them",
	},
	{
		Name: knowledgeWebhookDeliveryTable, Owner: MigrationOwner, Kind: schemaownership.KindState, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionTechnicalTTL, PrimaryKey: []string{"id"},
		BoundedQueryPath: "runtime/state/due/lease claim plus knowledge scope/event/subscription replay identity",
		DeletionPolicy:   "terminal delivery state is retained with the event for replay audit and removed by bounded webhook retention",
	},
	{
		Name: knowledgeAIExecutionTable, Owner: MigrationOwner, Kind: schemaownership.KindEntity, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"}, EntityIDColumn: "execution_id", EntityIDPrefix: "kaiexec", BusinessKey: []string{"execution_id"},
		BoundedQueryPath: "runtime/state/due/lease claim plus knowledge scope/user/page/execution identity",
		DeletionPolicy:   "page or library deletion and subject erasure remove prompts, generated text and execution status; confirmation never writes page content directly",
	},
}

func SchemaOwnership() []schemaownership.Table { return schemaownership.Clone(schemaOwnership) }
func OwnedTables() []string                    { return schemaownership.Names(SchemaOwnership()) }
