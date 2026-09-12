package store

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-orm/query"
)

// DeleteConversationReferencesForRequest moves Knowledge-owned attachment
// references into durable cleanup without participating in Agent's transaction.
func (s *Store) DeleteConversationReferencesForRequest(ctx context.Context, requestID, conversationID string, a agentsdk.ConversationAuthority) (json.RawMessage, error) {
	requestID, conversationID = strings.TrimSpace(requestID), strings.TrimSpace(conversationID)
	if conversationAuthority(a) != nil || requestID == "" || len(requestID) > 96 || conversationID == "" || len(conversationID) > 96 {
		return nil, fmt.Errorf("Knowledge conversation deletion scope is required")
	}
	owner := conversationOwner(a)
	var receipt json.RawMessage
	err := s.transaction(ctx, func(tx *sql.Tx) error {
		statement, args, buildErr := query.NewSelectBuilder(s.store.Renderer(), conversationReferenceReceiptTable).Columns("payload_json").Where(query.And(query.Equal("owner_key", owner), query.Equal("request_id", requestID))).Build()
		if buildErr != nil {
			return buildErr
		}
		if scanErr := tx.QueryRowContext(ctx, statement, args...).Scan(&receipt); scanErr == nil {
			return nil
		} else if !errors.Is(scanErr, sql.ErrNoRows) {
			return scanErr
		}
		statement, args, buildErr = query.NewSelectBuilder(s.store.Renderer(), CompatAttachmentTable).Projections(query.Project(query.CountAll())).Where(query.And(conversationScope(a, conversationID), query.NotEqual("state", "deleted"), query.NotEqual("state", "deleting"))).Build()
		if buildErr != nil {
			return buildErr
		}
		var queued int64
		if scanErr := tx.QueryRowContext(ctx, statement, args...).Scan(&queued); scanErr != nil {
			return scanErr
		}
		if deleteErr := s.CompatDeleteConversationAttachments(ctx, tx, conversationID, a); deleteErr != nil {
			return deleteErr
		}
		receipt, _ = json.Marshal(map[string]any{"request_id": requestID, "conversation_id": conversationID, "attachments_queued": queued, "completed_at": time.Now().UTC()})
		statement, args, buildErr = query.NewInsertBuilder(s.store.Renderer(), conversationReferenceReceiptTable).Columns("owner_key", "request_id", "payload_json").Values(owner, requestID, receipt).Build()
		if buildErr != nil {
			return buildErr
		}
		_, buildErr = tx.ExecContext(ctx, statement, args...)
		return buildErr
	})
	return receipt, err
}
