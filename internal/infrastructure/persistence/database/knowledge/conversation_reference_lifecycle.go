package store

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	sharedoperation "github.com/domainry/domainry-foundation/operation"
)

// DeleteConversationReferencesForRequest moves Knowledge-owned attachment
// references into durable cleanup without participating in Agent's transaction.
func (s *Store) DeleteConversationReferencesForRequest(ctx context.Context, requestID, conversationID string, a agentsdk.ConversationAuthority) (json.RawMessage, error) {
	requestID, conversationID = strings.TrimSpace(requestID), strings.TrimSpace(conversationID)
	if conversationAuthority(a) != nil || requestID == "" || len(requestID) > 96 || conversationID == "" || len(conversationID) > 96 {
		return nil, fmt.Errorf("Knowledge conversation deletion scope is required")
	}
	var receipt json.RawMessage
	err := s.transaction(ctx, func(tx *sql.Tx) error {
		command := knowledgeOperationCommand("knowledge.conversation_reference_delete", "conversation_references.delete", requestID, conversationID, a)
		claimedReceipt, claimed, claimErr := s.operations.Claim(sharedoperation.WithExecutor(ctx, tx), command)
		if claimErr = knowledgeOperationError(claimErr); claimErr != nil {
			return claimErr
		}
		if !claimed {
			if claimedReceipt.Status != sharedoperation.StatusSucceeded {
				return conversationError("conflict", "mutation_in_progress")
			}
			receipt = append(json.RawMessage(nil), claimedReceipt.Result...)
			return nil
		}
		var queued int64
		queued, claimErr = s.CompatDeleteConversationAttachments(ctx, tx, conversationID, a)
		if claimErr != nil {
			return claimErr
		}
		receipt, _ = json.Marshal(map[string]any{"request_id": requestID, "conversation_id": conversationID, "attachments_queued": queued, "completed_at": time.Now().UTC()})
		return s.operations.Complete(sharedoperation.WithExecutor(ctx, tx), sharedoperation.Completion{ID: command.ID, Scope: command.Scope, Owner: command.Owner, Kind: command.Kind, IdempotencyKey: command.IdempotencyKey, RequestFingerprint: command.RequestFingerprint, Result: receipt, CompletedAt: time.Now().UTC()})
	})
	return receipt, err
}
