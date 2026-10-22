package store

import (
	"github.com/domainry/domainry-knowledge-sdk/modulehost"
	ormschema "github.com/domainry/domainry-orm/schema"
)

const knowledgePageTable = "_knowledge_pages"
const knowledgePageDraftTable = "_knowledge_page_drafts"
const knowledgePageVersionTable = "_knowledge_page_versions"
const knowledgePageCommentTable = "_knowledge_page_comments"
const knowledgePageCommentReactionTable = "_knowledge_page_comment_reactions"
const knowledgePageAttachmentTable = "_knowledge_page_attachments"
const knowledgePageTaskTable = "_knowledge_page_tasks"
const knowledgePagePollTable = "_knowledge_page_polls"
const knowledgePagePollBallotTable = "_knowledge_page_poll_ballots"
const knowledgePagePollSelectionTable = "_knowledge_page_poll_selections"
const knowledgePageFormSubmissionTable = "_knowledge_page_form_submissions"
const knowledgePageTemplateTable = "_knowledge_page_templates"
const knowledgePageTemplateVersionTable = "_knowledge_page_template_versions"
const knowledgePageProjectionJobTable = "_knowledge_page_projection_jobs"
const knowledgePageAccessTable = "_knowledge_page_access"
const knowledgePageGrantTable = "_knowledge_page_grants"
const knowledgePageContentPolicyTable = "_knowledge_page_content_policies"
const knowledgePageShareTable = "_knowledge_page_shares"
const knowledgePageShareRedemptionTable = "_knowledge_page_share_redemptions"
const knowledgePageCollaborationSessionTable = "_knowledge_page_collaboration_sessions"
const knowledgePageCollaborationUpdateTable = "_knowledge_page_collaboration_updates"
const knowledgePageCollaborationSnapshotTable = "_knowledge_page_collaboration_snapshots"
const knowledgePageEditHistoryTable = "_knowledge_page_edit_history"
const knowledgePageSuggestionTable = "_knowledge_page_suggestions"
const knowledgePageNativeOperationTable = "_knowledge_page_native_operations"
const knowledgePageReferenceTable = "_knowledge_page_references"
const knowledgePagePersonalStateTable = "_knowledge_page_personal_states"
const knowledgePageMetadataTable = "_knowledge_page_metadata"
const knowledgePageTagTable = "_knowledge_page_tags"
const knowledgePageNameTable = "_knowledge_page_names"
const knowledgePageRelationTable = "_knowledge_page_relations"
const knowledgeWebhookSubscriptionTable = "_knowledge_webhook_subscriptions"
const knowledgeWebhookEventTable = "_knowledge_webhook_events"
const knowledgeWebhookDeliveryTable = "_knowledge_webhook_deliveries"
const knowledgeAIExecutionTable = "_knowledge_ai_executions"

func knowledgePageSchema(d modulehost.Dialect) ([]string, error) {
	statements := make([]string, 0, 20)
	tables := []*ormschema.TableBuilder{
		ormschema.NewTableWithRequiredColumns(d, knowledgePageTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("page_id", ormschema.TextKey(96)), required("library_id", ormschema.TextKey(96)),
			required("parent_page_id", ormschema.TextKey(96)), required("rank", ormschema.TextKey(96)), required("state", ormschema.TextKey(16)),
			required("published_parent_page_id", ormschema.TextKey(96)), required("published_rank", ormschema.TextKey(96)),
			required("revision", ormschema.BigInt()), required("published_version", ormschema.BigInt()), required("updated_at", ormschema.BigInt()),
			required("request_key", ormschema.TextKey(64)), required("request_hash", ormschema.TextKey(64)), required("payload_json", ormschema.LongText()),
		).PrimaryKey("id").Unique("page_id").Unique("scope_key", "page_id").Unique("scope_key", "request_key"),
		ormschema.NewTableWithRequiredColumns(d, knowledgePageDraftTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("page_id", ormschema.TextKey(96)), required("library_id", ormschema.TextKey(96)),
			required("base_published_version", ormschema.BigInt()), required("draft_revision", ormschema.BigInt()), required("updated_at", ormschema.BigInt()),
			required("last_request_key", ormschema.TextKey(64)), required("last_request_hash", ormschema.TextKey(64)), required("payload_json", ormschema.LongText()),
		).PrimaryKey("id").Unique("scope_key", "page_id"),
		ormschema.NewTableWithRequiredColumns(d, knowledgePageVersionTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("page_id", ormschema.TextKey(96)), required("version", ormschema.BigInt()),
			required("library_id", ormschema.TextKey(96)), required("published_at", ormschema.BigInt()), required("payload_json", ormschema.LongText()),
		).PrimaryKey("id").Unique("scope_key", "page_id", "version"),
		ormschema.NewTableWithRequiredColumns(d, knowledgePageCommentTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("comment_id", ormschema.TextKey(96)), required("library_id", ormschema.TextKey(96)),
			required("page_id", ormschema.TextKey(96)), required("parent_comment_id", ormschema.TextKey(96)), required("author_user_id", ormschema.TextKey(255)),
			required("resolved", ormschema.Boolean()), required("revision", ormschema.BigInt()), required("updated_at", ormschema.BigInt()),
			required("request_key", ormschema.TextKey(64)), required("request_hash", ormschema.TextKey(64)), required("payload_json", ormschema.LongText()),
		).PrimaryKey("id").Unique("comment_id").Unique("scope_key", "comment_id").Unique("scope_key", "request_key"),
		ormschema.NewTableWithRequiredColumns(d, knowledgePageCommentReactionTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("comment_id", ormschema.TextKey(96)), required("user_id", ormschema.TextKey(255)),
			required("emoji", ormschema.TextKey(32)), required("library_id", ormschema.TextKey(96)), required("page_id", ormschema.TextKey(96)),
			required("created_at", ormschema.BigInt()),
		).PrimaryKey("id").Unique("scope_key", "comment_id", "user_id", "emoji"),
		ormschema.NewTableWithRequiredColumns(d, knowledgePageAttachmentTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("page_id", ormschema.TextKey(96)), required("document_id", ormschema.TextKey(96)),
			required("library_id", ormschema.TextKey(96)), required("rank", ormschema.TextKey(96)), required("payload_json", ormschema.LongText()),
		).PrimaryKey("id").Unique("scope_key", "page_id", "document_id"),
		ormschema.NewTableWithRequiredColumns(d, knowledgePageTaskTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("task_id", ormschema.TextKey(96)), required("library_id", ormschema.TextKey(96)),
			required("page_id", ormschema.TextKey(96)), required("source_block_id", ormschema.TextKey(128)), required("status", ormschema.TextKey(24)),
			required("priority", ormschema.TextKey(16)), required("revision", ormschema.BigInt()), required("due_at", ormschema.BigInt()),
			required("reminder_at", ormschema.BigInt()), required("updated_at", ormschema.BigInt()), required("payload_json", ormschema.LongText()),
		).PrimaryKey("id").Unique("task_id").Unique("scope_key", "task_id").Unique("scope_key", "page_id", "source_block_id"),
		ormschema.NewTableWithRequiredColumns(d, knowledgePagePollTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("poll_id", ormschema.TextKey(96)), required("library_id", ormschema.TextKey(96)),
			required("page_id", ormschema.TextKey(96)), required("source_block_id", ormschema.TextKey(128)), required("status", ormschema.TextKey(16)),
			required("revision", ormschema.BigInt()), required("updated_at", ormschema.BigInt()), required("payload_json", ormschema.LongText()),
		).PrimaryKey("id").Unique("poll_id").Unique("scope_key", "poll_id").Unique("scope_key", "page_id", "source_block_id"),
		ormschema.NewTableWithRequiredColumns(d, knowledgePagePollBallotTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("poll_id", ormschema.TextKey(96)), required("user_id", ormschema.TextKey(255)),
			required("library_id", ormschema.TextKey(96)), required("page_id", ormschema.TextKey(96)), required("revision", ormschema.BigInt()),
			required("selection_count", ormschema.BigInt()), required("updated_at", ormschema.BigInt()),
		).PrimaryKey("id").Unique("scope_key", "poll_id", "user_id"),
		ormschema.NewTableWithRequiredColumns(d, knowledgePagePollSelectionTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("poll_id", ormschema.TextKey(96)), required("user_id", ormschema.TextKey(255)),
			required("library_id", ormschema.TextKey(96)), required("page_id", ormschema.TextKey(96)), required("option_id", ormschema.TextKey(96)),
		).PrimaryKey("id").Unique("scope_key", "poll_id", "user_id", "option_id"),
		ormschema.NewTableWithRequiredColumns(d, knowledgePageFormSubmissionTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("submission_id", ormschema.TextKey(96)), required("library_id", ormschema.TextKey(96)),
			required("page_id", ormschema.TextKey(96)), required("published_version", ormschema.BigInt()), required("content_sha256", ormschema.TextKey(64)),
			required("submitted_by_user_id", ormschema.TextKey(255)), required("submitted_at", ormschema.BigInt()), required("payload_json", ormschema.LongText()),
		).PrimaryKey("id").Unique("submission_id").Unique("scope_key", "submission_id"),
		ormschema.NewTableWithRequiredColumns(d, knowledgePageTemplateTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("template_id", ormschema.TextKey(96)), required("library_id", ormschema.TextKey(96)),
			required("title", ormschema.TextKey(256)), required("revision", ormschema.BigInt()), required("latest_version", ormschema.BigInt()),
			required("updated_at", ormschema.BigInt()), required("request_key", ormschema.TextKey(64)), required("request_hash", ormschema.TextKey(64)), required("payload_json", ormschema.LongText()),
		).PrimaryKey("id").Unique("template_id").Unique("scope_key", "template_id").Unique("scope_key", "request_key"),
		ormschema.NewTableWithRequiredColumns(d, knowledgePageTemplateVersionTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("template_id", ormschema.TextKey(96)), required("version", ormschema.BigInt()),
			required("library_id", ormschema.TextKey(96)), required("created_at", ormschema.BigInt()), required("payload_json", ormschema.LongText()),
		).PrimaryKey("id").Unique("scope_key", "template_id", "version"),
		ormschema.NewTableWithRequiredColumns(d, knowledgePageProjectionJobTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("page_id", ormschema.TextKey(96)), required("library_id", ormschema.TextKey(96)),
			required("runtime_id", ormschema.TextKey(255)), required("version", ormschema.BigInt()), required("not_before", ormschema.BigInt()), required("lease_until", ormschema.BigInt()),
			required("fence", ormschema.BigInt()), required("payload_json", ormschema.LongText()),
		).PrimaryKey("id").Unique("scope_key", "page_id"),
		ormschema.NewTableWithRequiredColumns(d, knowledgePageAccessTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("page_id", ormschema.TextKey(96)), required("library_id", ormschema.TextKey(96)),
			required("mode", ormschema.TextKey(16)), required("revision", ormschema.BigInt()), required("projection_status", ormschema.TextKey(16)),
			required("updated_at", ormschema.BigInt()), required("last_request_key", ormschema.TextKey(64)), required("last_request_hash", ormschema.TextKey(64)), required("payload_json", ormschema.LongText()),
		).PrimaryKey("id").Unique("scope_key", "page_id"),
		ormschema.NewTableWithRequiredColumns(d, knowledgePageGrantTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("page_id", ormschema.TextKey(96)), required("library_id", ormschema.TextKey(96)),
			required("subject_type", ormschema.TextKey(24)), required("subject_id", ormschema.TextKey(255)), required("grant_scope", ormschema.TextKey(16)), required("role", ormschema.TextKey(16)), required("payload_json", ormschema.LongText()),
		).PrimaryKey("id").Unique("scope_key", "page_id", "subject_type", "subject_id", "grant_scope"),
		ormschema.NewTableWithRequiredColumns(d, knowledgePageContentPolicyTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("page_id", ormschema.TextKey(96)), required("library_id", ormschema.TextKey(96)),
			required("policy_scope", ormschema.TextKey(16)), required("revision", ormschema.BigInt()), required("updated_at", ormschema.BigInt()),
			required("last_request_key", ormschema.TextKey(64)), required("last_request_hash", ormschema.TextKey(64)), required("payload_json", ormschema.LongText()),
		).PrimaryKey("id").Unique("scope_key", "page_id"),
		ormschema.NewTableWithRequiredColumns(d, knowledgePageShareTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("share_id", ormschema.TextKey(96)), required("library_id", ormschema.TextKey(96)), required("page_id", ormschema.TextKey(96)),
			required("share_kind", ormschema.TextKey(24)), required("target_type", ormschema.TextKey(24)), required("target_id", ormschema.TextKey(255)), required("share_scope", ormschema.TextKey(16)),
			required("state", ormschema.TextKey(16)), required("expires_at", ormschema.BigInt()), required("revision", ormschema.BigInt()), required("created_by_user_id", ormschema.TextKey(255)),
			required("password_hash", ormschema.TextKey(255)), required("request_key", ormschema.TextKey(64)), required("request_hash", ormschema.TextKey(64)), required("payload_json", ormschema.LongText()),
		).PrimaryKey("id").Unique("share_id").Unique("scope_key", "share_id").Unique("scope_key", "request_key"),
		ormschema.NewTableWithRequiredColumns(d, knowledgePageShareRedemptionTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("share_id", ormschema.TextKey(96)), required("user_id", ormschema.TextKey(255)), required("library_id", ormschema.TextKey(96)), required("page_id", ormschema.TextKey(96)), required("redeemed_at", ormschema.BigInt()),
		).PrimaryKey("id").Unique("scope_key", "share_id", "user_id"),
		ormschema.NewTableWithRequiredColumns(d, knowledgePageCollaborationSessionTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("session_id", ormschema.TextKey(96)), required("library_id", ormschema.TextKey(96)), required("page_id", ormschema.TextKey(96)),
			required("user_id", ormschema.TextKey(255)), required("client_id", ormschema.TextKey(96)), required("state", ormschema.TextKey(16)), required("lease_until", ormschema.BigInt()),
			required("server_clock", ormschema.BigInt()), required("payload_json", ormschema.LongText()),
		).PrimaryKey("id").Unique("scope_key", "session_id"),
		ormschema.NewTableWithRequiredColumns(d, knowledgePageCollaborationUpdateTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("page_id", ormschema.TextKey(96)), required("clock", ormschema.BigInt()), required("update_id", ormschema.TextKey(96)),
			required("session_id", ormschema.TextKey(96)), required("user_id", ormschema.TextKey(255)), required("payload_json", ormschema.LongText()),
		).PrimaryKey("id").Unique("scope_key", "page_id", "clock").Unique("scope_key", "page_id", "update_id"),
		ormschema.NewTableWithRequiredColumns(d, knowledgePageCollaborationSnapshotTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("page_id", ormschema.TextKey(96)), required("library_id", ormschema.TextKey(96)),
			required("draft_revision", ormschema.BigInt()), required("server_clock", ormschema.BigInt()), required("payload_json", ormschema.LongText()),
		).PrimaryKey("id").Unique("scope_key", "page_id"),
		ormschema.NewTableWithRequiredColumns(d, knowledgePageEditHistoryTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("page_id", ormschema.TextKey(96)), required("clock", ormschema.BigInt()),
			required("draft_revision", ormschema.BigInt()), required("user_id", ormschema.TextKey(255)), required("created_at", ormschema.BigInt()),
			required("payload_json", ormschema.LongText()),
		).PrimaryKey("id").Unique("scope_key", "page_id", "draft_revision"),
		ormschema.NewTableWithRequiredColumns(d, knowledgePageSuggestionTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("suggestion_id", ormschema.TextKey(96)), required("library_id", ormschema.TextKey(96)),
			required("page_id", ormschema.TextKey(96)), required("status", ormschema.TextKey(16)), required("author_user_id", ormschema.TextKey(255)),
			required("revision", ormschema.BigInt()), required("updated_at", ormschema.BigInt()), required("payload_json", ormschema.LongText()),
		).PrimaryKey("id").Unique("suggestion_id").Unique("scope_key", "suggestion_id"),
		ormschema.NewTableWithRequiredColumns(d, knowledgePageNativeOperationTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("page_id", ormschema.TextKey(96)), required("operation_id", ormschema.TextKey(96)),
			required("library_id", ormschema.TextKey(96)), required("content_type", ormschema.TextKey(48)), required("target", ormschema.TextKey(32)),
			required("target_id", ormschema.TextKey(128)), required("parent_id", ormschema.TextKey(128)), required("draft_revision", ormschema.BigInt()),
			required("user_id", ormschema.TextKey(255)), required("created_at", ormschema.BigInt()), required("request_hash", ormschema.TextKey(64)), required("payload_json", ormschema.LongText()),
		).PrimaryKey("id").Unique("scope_key", "page_id", "operation_id"),
		ormschema.NewTableWithRequiredColumns(d, knowledgePageReferenceTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("source_page_id", ormschema.TextKey(96)), required("block_id", ormschema.TextKey(128)),
			required("library_id", ormschema.TextKey(96)), required("target_page_id", ormschema.TextKey(96)), required("content_type", ormschema.TextKey(48)), required("reference_mode", ormschema.TextKey(16)),
			required("target_version", ormschema.BigInt()), required("display", ormschema.TextKey(16)), required("updated_at", ormschema.BigInt()), required("payload_json", ormschema.LongText()),
		).PrimaryKey("id").Unique("scope_key", "source_page_id", "block_id"),
		ormschema.NewTableWithRequiredColumns(d, knowledgePagePersonalStateTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("library_id", ormschema.TextKey(96)), required("page_id", ormschema.TextKey(96)), required("user_id", ormschema.TextKey(255)),
			required("favorite", ormschema.Boolean()), required("favorite_at", ormschema.BigInt()), required("subscribed", ormschema.Boolean()), required("subscribed_at", ormschema.BigInt()),
			required("shortcut_rank", ormschema.TextKey(96)), required("last_viewed_at", ormschema.BigInt()), required("last_edited_at", ormschema.BigInt()),
			required("revision", ormschema.BigInt()), required("updated_at", ormschema.BigInt()), required("payload_json", ormschema.LongText()),
		).PrimaryKey("id").Unique("scope_key", "user_id", "page_id"),
		ormschema.NewTableWithRequiredColumns(d, knowledgePageMetadataTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("page_id", ormschema.TextKey(96)), required("library_id", ormschema.TextKey(96)),
			required("runtime_id", ormschema.TextKey(255)), required("workspace_id", ormschema.TextKey(255)),
			required("owner_user_id", ormschema.TextKey(255)), required("content_admin_count", ormschema.BigInt()), required("status", ormschema.TextKey(24)),
			required("next_review_at", ormschema.BigInt()), required("review_interval_days", ormschema.BigInt()), required("last_reviewed_at", ormschema.BigInt()),
			required("archive_retention_days", ormschema.BigInt()), required("archived_at", ormschema.BigInt()), required("retain_until", ormschema.BigInt()),
			required("revision", ormschema.BigInt()), required("updated_at", ormschema.BigInt()), required("payload_json", ormschema.LongText()),
		).PrimaryKey("id").Unique("scope_key", "page_id"),
		ormschema.NewTableWithRequiredColumns(d, knowledgePageTagTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("library_id", ormschema.TextKey(96)), required("page_id", ormschema.TextKey(96)),
			required("tag_key", ormschema.TextKey(128)), required("tag_label", ormschema.TextKey(128)),
		).PrimaryKey("id").Unique("scope_key", "page_id", "tag_key"),
		ormschema.NewTableWithRequiredColumns(d, knowledgePageNameTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("library_id", ormschema.TextKey(96)), required("page_id", ormschema.TextKey(96)),
			required("name_kind", ormschema.TextKey(24)), required("name_key", ormschema.TextKey(256)), required("name_label", ormschema.TextKey(256)),
		).PrimaryKey("id").Unique("scope_key", "page_id", "name_kind", "name_key"),
		ormschema.NewTableWithRequiredColumns(d, knowledgePageRelationTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("library_id", ormschema.TextKey(96)), required("source_page_id", ormschema.TextKey(96)),
			required("target_page_id", ormschema.TextKey(96)), required("updated_at", ormschema.BigInt()), required("payload_json", ormschema.LongText()),
		).PrimaryKey("id").Unique("scope_key", "source_page_id", "target_page_id"),
		ormschema.NewTableWithRequiredColumns(d, knowledgeWebhookSubscriptionTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("subscription_id", ormschema.TextKey(96)), required("library_id", ormschema.TextKey(96)),
			required("application_key", ormschema.TextKey(255)), required("state", ormschema.TextKey(16)), required("revision", ormschema.BigInt()),
			required("updated_at", ormschema.BigInt()), required("request_key", ormschema.TextKey(64)), required("request_hash", ormschema.TextKey(64)), required("payload_json", ormschema.LongText()),
		).PrimaryKey("id").Unique("subscription_id").Unique("scope_key", "subscription_id").Unique("scope_key", "request_key"),
		ormschema.NewTableWithRequiredColumns(d, knowledgeWebhookEventTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("event_id", ormschema.TextKey(96)), required("event_type", ormschema.TextKey(64)),
			required("library_id", ormschema.TextKey(96)), required("page_id", ormschema.TextKey(96)), required("resource_id", ormschema.TextKey(96)),
			required("version", ormschema.BigInt()), required("occurred_at", ormschema.BigInt()), required("payload_json", ormschema.LongText()),
		).PrimaryKey("id").Unique("event_id").Unique("scope_key", "event_id"),
		ormschema.NewTableWithRequiredColumns(d, knowledgeWebhookDeliveryTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("event_id", ormschema.TextKey(96)), required("subscription_id", ormschema.TextKey(96)),
			required("runtime_id", ormschema.TextKey(255)), required("state", ormschema.TextKey(16)), required("attempt", ormschema.BigInt()),
			required("next_attempt_at", ormschema.BigInt()), required("lease_until", ormschema.BigInt()), required("fence", ormschema.BigInt()),
			required("updated_at", ormschema.BigInt()), required("payload_json", ormschema.LongText()),
		).PrimaryKey("id").Unique("scope_key", "event_id", "subscription_id"),
		ormschema.NewTableWithRequiredColumns(d, knowledgeAIExecutionTable, physicalID()).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("execution_id", ormschema.TextKey(96)), required("library_id", ormschema.TextKey(96)), required("page_id", ormschema.TextKey(96)),
			required("runtime_id", ormschema.TextKey(255)), required("workspace_id", ormschema.TextKey(255)), required("user_id", ormschema.TextKey(255)), required("session_id", ormschema.TextKey(96)),
			required("state", ormschema.TextKey(16)), required("revision", ormschema.BigInt()), required("attempt", ormschema.BigInt()), required("not_before", ormschema.BigInt()),
			required("lease_until", ormschema.BigInt()), required("fence", ormschema.BigInt()), required("updated_at", ormschema.BigInt()),
			required("request_key", ormschema.TextKey(64)), required("request_hash", ormschema.TextKey(64)), required("payload_json", ormschema.LongText()),
		).PrimaryKey("id").Unique("execution_id").Unique("scope_key", "execution_id").Unique("scope_key", "request_key"),
	}
	for _, table := range tables {
		statement, _, err := table.Build()
		if err != nil {
			return nil, err
		}
		statements = append(statements, statement)
	}
	indexes := []*ormschema.IndexBuilder{
		ormschema.NewIndex(d, "idx_knowledge_pages_tree", knowledgePageTable).Columns("scope_key", "library_id", "parent_page_id", "state", "rank", "page_id"),
		ormschema.NewIndex(d, "idx_knowledge_pages_published_tree", knowledgePageTable).Columns("scope_key", "library_id", "published_parent_page_id", "state", "published_rank", "page_id"),
		ormschema.NewIndex(d, "idx_knowledge_pages_library", knowledgePageTable).Columns("scope_key", "library_id", "state", "page_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_versions_desc", knowledgePageVersionTable).Columns("scope_key", "page_id", "version"),
		ormschema.NewIndex(d, "idx_knowledge_page_comments_thread", knowledgePageCommentTable).Columns("scope_key", "page_id", "resolved", "parent_comment_id", "comment_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_comments_author", knowledgePageCommentTable).Columns("scope_key", "author_user_id", "page_id", "comment_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_comment_reactions_comment", knowledgePageCommentReactionTable).Columns("scope_key", "comment_id", "emoji", "user_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_comment_reactions_user", knowledgePageCommentReactionTable).Columns("scope_key", "user_id", "page_id", "comment_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_attachments_rank", knowledgePageAttachmentTable).Columns("scope_key", "page_id", "rank", "document_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_tasks_page", knowledgePageTaskTable).Columns("scope_key", "page_id", "status", "updated_at", "task_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_tasks_due", knowledgePageTaskTable).Columns("scope_key", "status", "reminder_at", "due_at", "task_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_polls_page", knowledgePagePollTable).Columns("scope_key", "page_id", "status", "poll_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_poll_ballots_page", knowledgePagePollBallotTable).Columns("scope_key", "page_id", "user_id", "poll_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_poll_selections_result", knowledgePagePollSelectionTable).Columns("scope_key", "page_id", "poll_id", "option_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_poll_selections_user", knowledgePagePollSelectionTable).Columns("scope_key", "page_id", "user_id", "poll_id", "option_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_form_submissions_page", knowledgePageFormSubmissionTable).Columns("scope_key", "page_id", "submitted_at", "submission_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_form_submissions_user", knowledgePageFormSubmissionTable).Columns("scope_key", "page_id", "submitted_by_user_id", "submission_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_templates_library", knowledgePageTemplateTable).Columns("scope_key", "library_id", "title", "template_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_template_versions_desc", knowledgePageTemplateVersionTable).Columns("scope_key", "template_id", "version"),
		ormschema.NewIndex(d, "idx_knowledge_page_projection_jobs_due", knowledgePageProjectionJobTable).Columns("runtime_id", "not_before", "lease_until", "scope_key", "page_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_grants_subject", knowledgePageGrantTable).Columns("scope_key", "library_id", "subject_type", "subject_id", "page_id", "grant_scope"),
		ormschema.NewIndex(d, "idx_knowledge_page_shares_page", knowledgePageShareTable).Columns("scope_key", "library_id", "page_id", "state", "share_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_shares_expiry", knowledgePageShareTable).Columns("scope_key", "state", "expires_at", "share_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_share_redemptions_user", knowledgePageShareRedemptionTable).Columns("scope_key", "user_id", "share_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_collaboration_sessions_page", knowledgePageCollaborationSessionTable).Columns("scope_key", "page_id", "state", "lease_until", "session_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_collaboration_updates", knowledgePageCollaborationUpdateTable).Columns("scope_key", "page_id", "clock"),
		ormschema.NewIndex(d, "idx_knowledge_page_edit_history_desc", knowledgePageEditHistoryTable).Columns("scope_key", "page_id", "draft_revision"),
		ormschema.NewIndex(d, "idx_knowledge_page_edit_history_user", knowledgePageEditHistoryTable).Columns("scope_key", "user_id", "page_id", "draft_revision"),
		ormschema.NewIndex(d, "idx_knowledge_page_suggestions_page", knowledgePageSuggestionTable).Columns("scope_key", "page_id", "status", "updated_at", "suggestion_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_suggestions_author", knowledgePageSuggestionTable).Columns("scope_key", "author_user_id", "page_id", "updated_at", "suggestion_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_native_operations_revision", knowledgePageNativeOperationTable).Columns("scope_key", "page_id", "draft_revision", "operation_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_native_operations_user", knowledgePageNativeOperationTable).Columns("scope_key", "user_id", "page_id", "draft_revision", "operation_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_references_source", knowledgePageReferenceTable).Columns("scope_key", "source_page_id", "block_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_references_target", knowledgePageReferenceTable).Columns("scope_key", "target_page_id", "source_page_id", "block_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_personal_favorites", knowledgePagePersonalStateTable).Columns("scope_key", "library_id", "user_id", "favorite", "favorite_at", "page_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_personal_subscribed", knowledgePagePersonalStateTable).Columns("scope_key", "library_id", "user_id", "subscribed", "subscribed_at", "page_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_personal_shortcuts", knowledgePagePersonalStateTable).Columns("scope_key", "library_id", "user_id", "shortcut_rank", "page_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_personal_views", knowledgePagePersonalStateTable).Columns("scope_key", "library_id", "user_id", "last_viewed_at", "page_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_personal_edits", knowledgePagePersonalStateTable).Columns("scope_key", "library_id", "user_id", "last_edited_at", "page_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_metadata_owner", knowledgePageMetadataTable).Columns("scope_key", "library_id", "owner_user_id", "page_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_metadata_status", knowledgePageMetadataTable).Columns("scope_key", "library_id", "status", "page_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_metadata_review", knowledgePageMetadataTable).Columns("scope_key", "library_id", "next_review_at", "page_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_metadata_retention", knowledgePageMetadataTable).Columns("runtime_id", "retain_until", "scope_key", "page_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_tags_lookup", knowledgePageTagTable).Columns("scope_key", "library_id", "tag_key", "page_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_names_lookup", knowledgePageNameTable).Columns("scope_key", "library_id", "name_key", "page_id", "name_kind"),
		ormschema.NewIndex(d, "idx_knowledge_page_relations_target", knowledgePageRelationTable).Columns("scope_key", "target_page_id", "source_page_id"),
		ormschema.NewIndex(d, "idx_knowledge_webhook_subscriptions_library", knowledgeWebhookSubscriptionTable).Columns("scope_key", "library_id", "state", "subscription_id"),
		ormschema.NewIndex(d, "idx_knowledge_webhook_events_library", knowledgeWebhookEventTable).Columns("scope_key", "library_id", "occurred_at", "event_id"),
		ormschema.NewIndex(d, "idx_knowledge_webhook_deliveries_due", knowledgeWebhookDeliveryTable).Columns("runtime_id", "state", "next_attempt_at", "lease_until", "scope_key", "event_id", "subscription_id"),
		ormschema.NewIndex(d, "idx_knowledge_ai_executions_due", knowledgeAIExecutionTable).Columns("runtime_id", "state", "not_before", "lease_until", "scope_key", "execution_id"),
		ormschema.NewIndex(d, "idx_knowledge_ai_executions_user", knowledgeAIExecutionTable).Columns("scope_key", "user_id", "page_id", "updated_at", "execution_id"),
	}
	for _, index := range indexes {
		statement, _, err := index.Build()
		if err != nil {
			return nil, err
		}
		statements = append(statements, statement)
	}
	return statements, nil
}
