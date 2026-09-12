package store

import (
	"context"
	"database/sql"
	"encoding/json"
	"strings"
	"time"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
	"github.com/domainry/domainry-orm/query"
)

func (s *Store) CompatQueueAttachmentCleanup(ctx context.Context, tx *sql.Tx, id string, a agentsdk.ConversationAuthority) error {
	record, err := s.CompatAttachment(ctx, tx, id, a)
	if err != nil {
		return err
	}
	if record.Index != nil {
		if err = s.CompatQueueAttachmentIndexWork(ctx, tx, record); err != nil {
			return err
		}
	}
	// Cleanup only needs the owner namespace. Never retain a session, role grant
	// or transient policy bundle as authority for future actions.
	a = agentsdk.ConversationAuthority{Known: true, RuntimeID: a.RuntimeID, WorkspaceID: a.WorkspaceID, UserID: a.UserID}
	work := persistence.ConversationAttachmentCleanup{AttachmentID: id, Authority: a}
	insert := query.NewInsertBuilder(s.store.Renderer(), CompatAttachmentCleanupTable).Columns("owner_key", "attachment_id", "runtime_id", "not_before", "payload_json").Values(conversationOwner(a), id, a.RuntimeID, 0, conversationJSON(work))
	insert, err = s.store.Profile().ApplyUpsert(insert, []string{"owner_key", "attachment_id"}, query.AssignExpression("not_before", query.InsertedValue("not_before")))
	if err != nil {
		return err
	}
	statement, args, err := insert.Build()
	return conversationExec(ctx, tx, statement, args, err)
}

func (s *Store) AttachmentCleanupCandidates(ctx context.Context, runtimeID string, now time.Time, limit int) ([]persistence.ConversationAttachmentCleanup, error) {
	if strings.TrimSpace(runtimeID) == "" || len(runtimeID) > 255 || limit < 1 || limit > 50 {
		return nil, conversationError("bad_request", "attachment_cleanup_invalid")
	}
	statement, args, err := query.NewSelectBuilder(s.store.Renderer(), CompatAttachmentCleanupTable).Columns("payload_json").Where(query.And(query.Equal("runtime_id", runtimeID), query.LessThanOrEqual("not_before", now.UnixMilli()))).OrderBy(query.Ascending("not_before"), query.Ascending("owner_key"), query.Ascending("attachment_id")).Limit(limit).Build()
	if err != nil {
		return nil, err
	}
	rows, err := s.store.Database().QueryContext(ctx, statement, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := []persistence.ConversationAttachmentCleanup{}
	for rows.Next() {
		var raw []byte
		var item persistence.ConversationAttachmentCleanup
		if err := rows.Scan(&raw); err != nil {
			return nil, err
		}
		if err := json.Unmarshal(raw, &item); err != nil {
			return nil, err
		}
		if item.Authority.RuntimeID != runtimeID || conversationAuthority(item.Authority) != nil || !personalMemoryKey(item.AttachmentID) {
			return nil, conversationError("unavailable", "attachment_cleanup_invalid")
		}
		out = append(out, item)
	}
	return out, rows.Err()
}

func (s *Store) DeferAttachmentCleanup(ctx context.Context, id string, until time.Time, a agentsdk.ConversationAuthority) error {
	if err := conversationAuthority(a); err != nil {
		return err
	}
	if !personalMemoryKey(id) {
		return conversationError("bad_request", "attachment_cleanup_invalid")
	}
	statement, args, err := query.NewUpdateBuilder(s.store.Renderer(), CompatAttachmentCleanupTable).Set("not_before", until.UnixMilli()).Where(CompatAttachmentScope(a, id)).Build()
	return conversationExec(ctx, s.store.Database(), statement, args, err)
}
