package application

import (
	"context"

	sdk "github.com/domainry/domainry-agent-sdk"
)

func (k *LibraryKnowledgeSource) AuthorizeKnowledgeResultRead(ctx context.Context, saved sdk.ConversationKnowledgeResult, a sdk.ConversationAuthority) error {
	return k.revalidateKnowledge(ctx, saved, a, true)
}

func (k *LibraryKnowledgeSource) authorizeResultReadLibrary(ctx context.Context, id, operation string, a sdk.ConversationAuthority) error {
	if !a.Known || a.RuntimeID != k.runtimeID {
		return conversationFailure("forbidden", "knowledge_access_denied")
	}
	library := sdk.KnowledgeLibrary{}
	if id != "" {
		var err error
		library, err = k.repo.KnowledgeLibrary(ctx, id, a)
		if err != nil {
			return LibraryKnowledgeAccessError(err)
		}
		if library.Archived {
			return conversationFailure("forbidden", "knowledge_access_denied")
		}
	}
	return LibraryKnowledgeAccessError(k.policy.AuthorizeKnowledgeLibrary(ctx, operation, library, a))
}

func (k *DocumentGuardedKnowledge) AuthorizeKnowledgeResultRead(ctx context.Context, saved sdk.ConversationKnowledgeResult, a sdk.ConversationAuthority) error {
	if err := k.Check(ctx); err != nil {
		return err
	}
	if err := sdk.AuthorizeKnowledgeResultRead(ctx, k.base, saved, a); err != nil {
		return err
	}
	return k.Check(ctx)
}

var _ sdk.ConversationKnowledgeResultReadSource = (*LibraryKnowledgeSource)(nil)
var _ sdk.ConversationKnowledgeResultReadSource = (*DocumentGuardedKnowledge)(nil)
