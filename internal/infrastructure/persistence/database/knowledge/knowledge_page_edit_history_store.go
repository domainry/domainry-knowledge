package store

import (
	"context"
	"database/sql"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-orm/query"
)

const knowledgePageEditHistoryMaximumChanges = 2048

func (s *Store) insertKnowledgePageEditHistory(ctx context.Context, tx *sql.Tx, pageID string, entry knowledgesdk.KnowledgePageEditHistoryEntry, a agentsdk.Authority) error {
	q, args, err := query.NewInsertBuilder(s.store.Renderer(), knowledgePageEditHistoryTable).Columns(
		"scope_key", "page_id", "clock", "draft_revision", "user_id", "created_at", "payload_json",
	).Values(libraryScope(a), pageID, entry.Clock, entry.DraftRevision, entry.UserID, entry.CreatedAt.UnixMilli(), conversationJSON(entry)).Build()
	return conversationExec(ctx, tx, q, args, err)
}

func (s *Store) KnowledgePageEditHistory(ctx context.Context, libraryID, pageID string, before int64, limit int, a agentsdk.Authority) (out knowledgesdk.KnowledgePageEditHistoryPage, err error) {
	out = knowledgesdk.KnowledgePageEditHistoryPage{Items: []knowledgesdk.KnowledgePageEditHistoryEntry{}, Complete: true}
	if limit == 0 {
		limit = 50
	}
	if limit < 1 || limit > 100 || before < 0 {
		return out, conversationError("bad_request", "page_edit_history_query_invalid")
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		if _, e := s.libraryRecord(ctx, tx, libraryID, a); e != nil {
			return e
		}
		if _, e := s.pageRecord(ctx, tx, libraryID, pageID, a); e != nil {
			return e
		}
		predicate := pageScope(a, pageID)
		if before > 0 {
			predicate = query.And(predicate, query.LessThan("draft_revision", before))
		}
		q, args, e := query.NewSelectBuilder(s.store.Renderer(), knowledgePageEditHistoryTable).Columns("payload_json").Where(predicate).OrderBy(query.Descending("draft_revision")).Limit(limit + 1).Build()
		if e != nil {
			return e
		}
		rows, e := tx.QueryContext(ctx, q, args...)
		if e != nil {
			return e
		}
		defer rows.Close()
		for rows.Next() {
			var raw []byte
			var item knowledgesdk.KnowledgePageEditHistoryEntry
			if e = rows.Scan(&raw); e != nil {
				return e
			}
			if e = unmarshalDurableJSON(raw, &item); e != nil {
				return e
			}
			if item.Changes == nil {
				item.Changes = []knowledgesdk.KnowledgePageBlockChange{}
			}
			out.Items = append(out.Items, item)
		}
		if e = rows.Err(); e != nil {
			return e
		}
		if len(out.Items) > limit {
			out.Items = out.Items[:limit]
			out.Complete = false
			out.NextBefore = out.Items[len(out.Items)-1].DraftRevision
		}
		return nil
	})
	return
}
