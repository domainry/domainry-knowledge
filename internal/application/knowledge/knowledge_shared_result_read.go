package application

import (
	"context"
	"encoding/json"

	sdk "github.com/domainry/domainry-agent-sdk"
)

func validSharedKnowledgeAuthorities(reader, producer sdk.ConversationAuthority, runtimeID string) bool {
	return reader.Known && producer.Known && reader.RuntimeID == runtimeID && producer.RuntimeID == runtimeID && reader.WorkspaceID != "" && producer.WorkspaceID == reader.WorkspaceID && reader.UserID != "" && producer.UserID != ""
}

func (k *LibraryKnowledgeSource) AuthorizeSharedKnowledgeResultRead(ctx context.Context, saved sdk.ConversationKnowledgeResult, reader, producer sdk.ConversationAuthority) error {
	if !validSharedKnowledgeAuthorities(reader, producer, k.runtimeID) {
		return conversationFailure("forbidden", "knowledge_access_denied")
	}
	if reader == producer {
		return k.AuthorizeKnowledgeResultRead(ctx, saved, reader)
	}
	if saved.ConversationID != "" {
		return conversationFailure("forbidden", "knowledge_access_denied")
	}
	for _, c := range saved.Citations {
		if c.ConversationID != "" {
			return conversationFailure("forbidden", "knowledge_access_denied")
		}
	}
	if saved.Operation == "libraries" {
		if err := k.authorizeResultReadLibrary(ctx, "", "libraries_list", reader); err != nil {
			return err
		}
	} else if saved.LibraryID != "" {
		if _, err := k.Access(ctx, saved.LibraryID, reader); err != nil {
			return err
		}
		if saved.Provider == ManagedKnowledgeProvider {
			if err := k.authorizeResultReadLibrary(ctx, saved.LibraryID, "documents_download", reader); err != nil {
				return err
			}
		}
	}
	// Original scope and citations are verified with the producer, whose
	// current library/file rights must remain valid independently of execution.
	if err := k.AuthorizeKnowledgeResultRead(ctx, saved, producer); err != nil {
		return err
	}
	if saved.Operation == "libraries" {
		if err := k.authorizeResultReadLibrary(ctx, "", "libraries_list", reader); err != nil {
			return err
		}
		var page sdk.KnowledgeLibraryPage
		if json.Unmarshal(saved.Data, &page) != nil {
			return conversationFailure("forbidden", "knowledge_access_denied")
		}
		for _, item := range page.Items {
			if _, err := k.Access(ctx, item.ID, reader); err != nil {
				return err
			}
		}
		return k.authorizeResultReadLibrary(ctx, "", "libraries_list", reader)
	}
	if saved.LibraryID == "" {
		return sdk.AuthorizeSharedKnowledgeResultRead(ctx, k.legacy, saved, reader, producer)
	}
	binding, err := k.Access(ctx, saved.LibraryID, reader)
	if err != nil {
		return err
	}
	source, managed, err := k.ManagedSource(ctx, binding, reader)
	if err != nil {
		return err
	}
	if managed {
		if err := k.authorizeResultReadLibrary(ctx, saved.LibraryID, "documents_download", reader); err != nil {
			return err
		}
		var data DocumentEvidence
		if json.Unmarshal(saved.Data, &data) != nil {
			return conversationFailure("forbidden", "knowledge_access_denied")
		}
		if err := k.CheckDocumentSnapshots(ctx, binding, source.KnowledgeDocumentSourceIdentity(), data, reader); err != nil {
			return err
		}
		// The actual reader performs both remote IO and local document filtering.
		// Reconstruct only the evidence identity with the original producer.
		current, err := k.ManagedKnowledge(ctx, binding, source, saved.Operation, saved.Query, saved.DocumentID, reader)
		if err != nil {
			return err
		}
		var actual DocumentEvidence
		if json.Unmarshal(current.Data, &actual) != nil {
			return conversationFailure("forbidden", "knowledge_access_denied")
		}
		original, err := k.DocumentReceipt(binding, source.KnowledgeDocumentSourceIdentity(), saved.Operation, saved.Query, saved.DocumentID, actual, producer)
		if err != nil || conversationDigest(original) != conversationDigest(saved) {
			return conversationFailure("conflict", "knowledge_source_changed")
		}
		if err := k.CheckDocumentSnapshots(ctx, binding, source.KnowledgeDocumentSourceIdentity(), actual, reader); err != nil {
			return err
		}
		if err := k.authorizeResultReadLibrary(ctx, saved.LibraryID, "documents_download", reader); err != nil {
			return err
		}
	} else {
		if saved.Provider == ManagedKnowledgeProvider {
			return conversationFailure("forbidden", "knowledge_access_denied")
		}
		inner := saved
		inner.LibraryID = ""
		inner.Citations = append([]sdk.ConversationCitation(nil), saved.Citations...)
		for i := range inner.Citations {
			if inner.Citations[i].LibraryID != saved.LibraryID {
				return conversationFailure("forbidden", "knowledge_access_denied")
			}
			inner.Citations[i].LibraryID = ""
		}
		if err := sdk.AuthorizeSharedKnowledgeResultRead(ctx, binding.Source, inner, reader, producer); err != nil {
			return err
		}
		if _, err := k.Access(ctx, saved.LibraryID, reader); err != nil {
			return err
		}
		if _, managed, err := k.ManagedSource(ctx, binding, reader); err != nil || managed {
			return conversationFailure("conflict", "knowledge_source_changed")
		}
		// The inner shared owner has completed both actors' remote checks.
		// Recheck local producer membership without starting more IO after its
		// final reader ACL check.
		producerBinding, err := k.Access(ctx, saved.LibraryID, producer)
		if err != nil {
			return err
		}
		if _, managed, err := k.ManagedSource(ctx, producerBinding, producer); err != nil || managed {
			return conversationFailure("conflict", "knowledge_source_changed")
		}
		_, err = k.Access(ctx, saved.LibraryID, reader)
		return err
	}
	if err := k.AuthorizeKnowledgeResultRead(ctx, saved, producer); err != nil {
		return err
	}
	// Producer verification may itself perform remote IO. Reader membership,
	// source binding and file state must still be valid after that IO finishes.
	currentBinding, err := k.Access(ctx, saved.LibraryID, reader)
	if err != nil {
		return err
	}
	currentSource, currentManaged, err := k.ManagedSource(ctx, currentBinding, reader)
	if err != nil || !currentManaged || currentSource.KnowledgeDocumentSourceIdentity() != source.KnowledgeDocumentSourceIdentity() || DocumentAccessPolicy(currentSource) != DocumentAccessPolicy(source) {
		return conversationFailure("conflict", "knowledge_source_changed")
	}
	var finalData DocumentEvidence
	if json.Unmarshal(saved.Data, &finalData) != nil {
		return conversationFailure("forbidden", "knowledge_access_denied")
	}
	if err := k.CheckDocumentSnapshots(ctx, currentBinding, currentSource.KnowledgeDocumentSourceIdentity(), finalData, reader); err != nil {
		return err
	}
	return k.authorizeResultReadLibrary(ctx, saved.LibraryID, "documents_download", reader)
}

func (k *LibraryKnowledgeSource) SharedKnowledgeExtractionPassages(ctx context.Context, saved sdk.ConversationKnowledgeResult, reader, producer sdk.ConversationAuthority) ([]sdk.KnowledgeDocumentPassage, error) {
	if err := sdk.AuthorizeSharedKnowledgeResultRead(ctx, k, saved, reader, producer); err != nil {
		return nil, err
	}
	var passages []sdk.KnowledgeDocumentPassage
	var err error
	if saved.Operation != "fetch" || saved.DocumentID == "" || saved.Query != "" {
		return nil, conversationFailure("forbidden", "knowledge_access_denied")
	}
	if saved.LibraryID == "" {
		passages, err = sdk.SharedKnowledgeExtractionPassages(ctx, k.legacy, saved, reader, producer)
	} else {
		binding, accessErr := k.Access(ctx, saved.LibraryID, reader)
		if accessErr != nil {
			return nil, accessErr
		}
		source, managed, sourceErr := k.ManagedSource(ctx, binding, reader)
		if sourceErr != nil {
			return nil, sourceErr
		}
		if managed {
			var data DocumentEvidence
			if json.Unmarshal(saved.Data, &data) != nil || !data.Partial {
				return nil, conversationFailure("forbidden", "knowledge_access_denied")
			}
			for _, p := range data.Passages {
				if p.DocumentID != saved.DocumentID {
					return nil, conversationFailure("forbidden", "knowledge_access_denied")
				}
			}
			if err := k.CheckDocumentSnapshots(ctx, binding, source.KnowledgeDocumentSourceIdentity(), data, reader); err != nil {
				return nil, err
			}
			passages = data.Passages
		} else {
			inner := saved
			inner.LibraryID = ""
			inner.Citations = append([]sdk.ConversationCitation(nil), saved.Citations...)
			for i := range inner.Citations {
				inner.Citations[i].LibraryID = ""
			}
			passages, err = sdk.SharedKnowledgeExtractionPassages(ctx, binding.Source, inner, reader, producer)
		}
	}
	if err != nil {
		return nil, err
	}
	if err := sdk.AuthorizeSharedKnowledgeResultRead(ctx, k, saved, reader, producer); err != nil {
		return nil, err
	}
	return passages, nil
}

func (k *DocumentGuardedKnowledge) AuthorizeSharedKnowledgeResultRead(ctx context.Context, saved sdk.ConversationKnowledgeResult, reader, producer sdk.ConversationAuthority) error {
	if err := k.Check(ctx); err != nil {
		return err
	}
	if err := sdk.AuthorizeSharedKnowledgeResultRead(ctx, k.base, saved, reader, producer); err != nil {
		return err
	}
	return k.Check(ctx)
}

func (k *DocumentGuardedKnowledge) SharedKnowledgeExtractionPassages(ctx context.Context, saved sdk.ConversationKnowledgeResult, reader, producer sdk.ConversationAuthority) ([]sdk.KnowledgeDocumentPassage, error) {
	if err := k.Check(ctx); err != nil {
		return nil, err
	}
	passages, err := sdk.SharedKnowledgeExtractionPassages(ctx, k.base, saved, reader, producer)
	if err != nil {
		return nil, err
	}
	if err := k.Check(ctx); err != nil {
		return nil, err
	}
	return passages, nil
}

var _ sdk.ConversationKnowledgeSharedResultReadSource = (*LibraryKnowledgeSource)(nil)
var _ sdk.KnowledgeSharedExtractionContentSource = (*LibraryKnowledgeSource)(nil)
var _ sdk.ConversationKnowledgeSharedResultReadSource = (*DocumentGuardedKnowledge)(nil)
var _ sdk.KnowledgeSharedExtractionContentSource = (*DocumentGuardedKnowledge)(nil)
