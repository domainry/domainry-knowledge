package store

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"strings"
	"time"

	sharedoperation "github.com/domainry/domainry-foundation/operation"
	agentsdk "github.com/domainry/domainry-knowledge-sdk"
)

func knowledgeOperationCommand(kind, action, clientID string, input any, a agentsdk.Authority) sharedoperation.Command {
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

func (s *Store) mutateKnowledgeOperation(ctx context.Context, kind, action, resource, clientID string, input any, a agentsdk.Authority, apply func(*sql.Tx) (any, error), out any) error {
	if err := conversationAuthority(a); err != nil {
		return err
	}
	if !personalMemoryKey(clientID) || strings.TrimSpace(resource) == "" {
		return conversationError("bad_request", "page_client_id_invalid")
	}
	return s.transaction(ctx, func(tx *sql.Tx) error {
		command := knowledgeOperationCommand(kind, action, clientID, input, a)
		command.Scope.ResourceType = "knowledge_resource"
		command.Scope.ResourceID = resource
		command.IdempotencyKey = conversationOwner(a) + ":" + conversationHash([]string{kind, resource, clientID})
		command.ID = "knowledge-operation:" + conversationHash([]string{a.WorkspaceID, kind, command.IdempotencyKey})
		command.RequestFingerprint = conversationHash([]any{action, resource, input})
		receipt, claimed, err := s.operations.Claim(sharedoperation.WithExecutor(ctx, tx), command)
		if err = knowledgeOperationError(err); err != nil {
			return err
		}
		if !claimed {
			if receipt.Status != sharedoperation.StatusSucceeded {
				return conversationError("conflict", "mutation_in_progress")
			}
			return unmarshalDurableJSON(receipt.Result, out)
		}
		value, err := apply(tx)
		if err != nil {
			return err
		}
		result := json.RawMessage(conversationJSON(value))
		if err = s.operations.Complete(sharedoperation.WithExecutor(ctx, tx), sharedoperation.Completion{ID: command.ID, Scope: command.Scope, Owner: command.Owner, Kind: command.Kind, IdempotencyKey: command.IdempotencyKey, RequestFingerprint: command.RequestFingerprint, Result: result, CompletedAt: time.Now().UTC()}); err != nil {
			return err
		}
		return unmarshalDurableJSON(result, out)
	})
}
