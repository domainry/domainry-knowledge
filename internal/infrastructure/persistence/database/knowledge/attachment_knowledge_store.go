package store

import (
	"context"
	"encoding/json"
	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
	"github.com/domainry/domainry-orm/query"
)

func (s *Store) AttachmentKnowledgeRecords(ctx context.Context, conversation string, a agentsdk.ConversationAuthority) ([]persistence.ConversationAttachmentRecord, error) {
	if _, err := s.Get(ctx, conversation, a); err != nil {
		return nil, err
	}
	q, args, err := query.NewSelectBuilder(s.store.Renderer(), CompatAttachmentTable).Columns("payload_json").Where(query.And(conversationScope(a, conversation), query.Equal("state", "ready"))).OrderBy(query.Ascending("attachment_id")).Limit(51).Build()
	if err != nil {
		return nil, err
	}
	rows, err := s.store.Database().QueryContext(ctx, q, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := []persistence.ConversationAttachmentRecord{}
	for rows.Next() {
		var raw []byte
		var r persistence.ConversationAttachmentRecord
		if err = rows.Scan(&raw); err != nil {
			return nil, err
		}
		if err = json.Unmarshal(raw, &r); err != nil {
			return nil, err
		}
		if len(out) >= 50 || r.Attachment.ConversationID != conversation || r.Attachment.State != "ready" {
			return nil, conversationError("unavailable", "attachment_metadata_invalid")
		}
		out = append(out, r)
	}
	return out, rows.Err()
}

var _ persistence.ConversationAttachmentKnowledgeRepository = (*Store)(nil)
