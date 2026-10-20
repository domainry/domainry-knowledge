package store

import (
	"github.com/domainry/domainry-knowledge-sdk/modulehost"
	ormschema "github.com/domainry/domainry-orm/schema"
)

const knowledgePageTable = "_knowledge_pages"
const knowledgePageDraftTable = "_knowledge_page_drafts"
const knowledgePageVersionTable = "_knowledge_page_versions"
const knowledgePageCommentTable = "_knowledge_page_comments"
const knowledgePageAttachmentTable = "_knowledge_page_attachments"
const knowledgePageProjectionJobTable = "_knowledge_page_projection_jobs"
const knowledgePageAccessTable = "_knowledge_page_access"
const knowledgePageGrantTable = "_knowledge_page_grants"
const knowledgePageCollaborationSessionTable = "_knowledge_page_collaboration_sessions"
const knowledgePageCollaborationUpdateTable = "_knowledge_page_collaboration_updates"
const knowledgePageCollaborationSnapshotTable = "_knowledge_page_collaboration_snapshots"

func knowledgePageSchema(d modulehost.Dialect) ([]string, error) {
	statements := make([]string, 0, 18)
	tables := []*ormschema.TableBuilder{
		ormschema.NewTable(d, knowledgePageTable).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("page_id", ormschema.TextKey(96)), required("library_id", ormschema.TextKey(96)),
			required("parent_page_id", ormschema.TextKey(96)), required("rank", ormschema.TextKey(96)), required("state", ormschema.TextKey(16)),
			required("published_parent_page_id", ormschema.TextKey(96)), required("published_rank", ormschema.TextKey(96)),
			required("revision", ormschema.BigInt()), required("published_version", ormschema.BigInt()), required("updated_at", ormschema.BigInt()),
			required("request_key", ormschema.TextKey(64)), required("request_hash", ormschema.TextKey(64)), required("payload_json", ormschema.LongText()),
		).PrimaryKey("scope_key", "page_id").Unique("scope_key", "request_key"),
		ormschema.NewTable(d, knowledgePageDraftTable).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("page_id", ormschema.TextKey(96)), required("library_id", ormschema.TextKey(96)),
			required("base_published_version", ormschema.BigInt()), required("draft_revision", ormschema.BigInt()), required("updated_at", ormschema.BigInt()),
			required("last_request_key", ormschema.TextKey(64)), required("last_request_hash", ormschema.TextKey(64)), required("payload_json", ormschema.LongText()),
		).PrimaryKey("scope_key", "page_id"),
		ormschema.NewTable(d, knowledgePageVersionTable).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("page_id", ormschema.TextKey(96)), required("version", ormschema.BigInt()),
			required("library_id", ormschema.TextKey(96)), required("published_at", ormschema.BigInt()), required("payload_json", ormschema.LongText()),
		).PrimaryKey("scope_key", "page_id", "version"),
		ormschema.NewTable(d, knowledgePageCommentTable).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("comment_id", ormschema.TextKey(96)), required("library_id", ormschema.TextKey(96)),
			required("page_id", ormschema.TextKey(96)), required("parent_comment_id", ormschema.TextKey(96)), required("author_user_id", ormschema.TextKey(255)),
			required("resolved", ormschema.Boolean()), required("revision", ormschema.BigInt()), required("updated_at", ormschema.BigInt()),
			required("request_key", ormschema.TextKey(64)), required("request_hash", ormschema.TextKey(64)), required("payload_json", ormschema.LongText()),
		).PrimaryKey("scope_key", "comment_id").Unique("scope_key", "request_key"),
		ormschema.NewTable(d, knowledgePageAttachmentTable).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("page_id", ormschema.TextKey(96)), required("document_id", ormschema.TextKey(96)),
			required("library_id", ormschema.TextKey(96)), required("rank", ormschema.TextKey(96)), required("payload_json", ormschema.LongText()),
		).PrimaryKey("scope_key", "page_id", "document_id"),
		ormschema.NewTable(d, knowledgePageProjectionJobTable).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("page_id", ormschema.TextKey(96)), required("library_id", ormschema.TextKey(96)),
			required("runtime_id", ormschema.TextKey(255)), required("version", ormschema.BigInt()), required("not_before", ormschema.BigInt()), required("lease_until", ormschema.BigInt()),
			required("fence", ormschema.BigInt()), required("payload_json", ormschema.LongText()),
		).PrimaryKey("scope_key", "page_id"),
		ormschema.NewTable(d, knowledgePageAccessTable).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("page_id", ormschema.TextKey(96)), required("library_id", ormschema.TextKey(96)),
			required("mode", ormschema.TextKey(16)), required("revision", ormschema.BigInt()), required("projection_status", ormschema.TextKey(16)),
			required("updated_at", ormschema.BigInt()), required("last_request_key", ormschema.TextKey(64)), required("last_request_hash", ormschema.TextKey(64)), required("payload_json", ormschema.LongText()),
		).PrimaryKey("scope_key", "page_id"),
		ormschema.NewTable(d, knowledgePageGrantTable).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("page_id", ormschema.TextKey(96)), required("library_id", ormschema.TextKey(96)),
			required("user_id", ormschema.TextKey(255)), required("grant_scope", ormschema.TextKey(16)), required("role", ormschema.TextKey(16)), required("payload_json", ormschema.LongText()),
		).PrimaryKey("scope_key", "page_id", "user_id", "grant_scope"),
		ormschema.NewTable(d, knowledgePageCollaborationSessionTable).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("session_id", ormschema.TextKey(96)), required("library_id", ormschema.TextKey(96)), required("page_id", ormschema.TextKey(96)),
			required("user_id", ormschema.TextKey(255)), required("client_id", ormschema.TextKey(96)), required("state", ormschema.TextKey(16)), required("lease_until", ormschema.BigInt()),
			required("server_clock", ormschema.BigInt()), required("payload_json", ormschema.LongText()),
		).PrimaryKey("scope_key", "session_id"),
		ormschema.NewTable(d, knowledgePageCollaborationUpdateTable).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("page_id", ormschema.TextKey(96)), required("clock", ormschema.BigInt()), required("update_id", ormschema.TextKey(96)),
			required("session_id", ormschema.TextKey(96)), required("user_id", ormschema.TextKey(255)), required("payload_json", ormschema.LongText()),
		).PrimaryKey("scope_key", "page_id", "clock").Unique("scope_key", "page_id", "update_id"),
		ormschema.NewTable(d, knowledgePageCollaborationSnapshotTable).IfNotExists().Columns(
			required("scope_key", ormschema.TextKey(64)), required("page_id", ormschema.TextKey(96)), required("library_id", ormschema.TextKey(96)),
			required("draft_revision", ormschema.BigInt()), required("server_clock", ormschema.BigInt()), required("payload_json", ormschema.LongText()),
		).PrimaryKey("scope_key", "page_id"),
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
		ormschema.NewIndex(d, "idx_knowledge_page_attachments_rank", knowledgePageAttachmentTable).Columns("scope_key", "page_id", "rank", "document_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_projection_jobs_due", knowledgePageProjectionJobTable).Columns("runtime_id", "not_before", "lease_until", "scope_key", "page_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_grants_user", knowledgePageGrantTable).Columns("scope_key", "library_id", "user_id", "page_id", "grant_scope"),
		ormschema.NewIndex(d, "idx_knowledge_page_collaboration_sessions_page", knowledgePageCollaborationSessionTable).Columns("scope_key", "page_id", "state", "lease_until", "session_id"),
		ormschema.NewIndex(d, "idx_knowledge_page_collaboration_updates", knowledgePageCollaborationUpdateTable).Columns("scope_key", "page_id", "clock"),
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
