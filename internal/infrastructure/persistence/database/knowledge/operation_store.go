package store

import (
	"errors"
	"time"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	sharedoperation "github.com/domainry/domainry-foundation/operation"
)

func knowledgeOperationCommand(kind, action, clientID string, input any, a agentsdk.ConversationAuthority) sharedoperation.Command {
	key := conversationOwner(a) + ":" + conversationHash(clientID)
	id := "knowledge-operation:" + conversationHash([]string{a.WorkspaceID, kind, key})
	return sharedoperation.Command{
		ID: id, Scope: sharedoperation.Scope{WorkspaceID: a.WorkspaceID, ResourceType: "knowledge_owner", ResourceID: conversationOwner(a)},
		Owner: "knowledge", Kind: kind, ActionKey: action, IdempotencyKey: key, RequestFingerprint: conversationHash([]any{action, input}),
		RequestedBy: a.UserID, Reason: "Knowledge mutation", Reference: clientID, StatusURL: "knowledge://operations/" + id, CreatedAt: time.Now().UTC(),
	}
}

func knowledgeOperationError(err error) error {
	if errors.Is(err, sharedoperation.ErrIdempotencyConflict) {
		return conversationError("conflict", "idempotency_conflict")
	}
	return err
}
