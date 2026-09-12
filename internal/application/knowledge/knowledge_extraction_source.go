package application

import (
	"context"
	"encoding/json"

	agentsdk "github.com/domainry/domainry-agent-sdk"
)

func (k *DocumentGuardedKnowledge) KnowledgeExtractionPassages(ctx context.Context, saved agentsdk.ConversationKnowledgeResult, a agentsdk.ConversationAuthority) ([]agentsdk.KnowledgeDocumentPassage, error) {
	if err := k.Check(ctx); err != nil {
		return nil, err
	}
	source, ok := k.base.(agentsdk.KnowledgeExtractionContentSource)
	if !ok {
		return nil, conversationFailure("unavailable", "knowledge_extraction_content_unavailable")
	}
	passages, err := source.KnowledgeExtractionPassages(ctx, saved, a)
	if err != nil {
		return nil, err
	}
	if err = k.Check(ctx); err != nil {
		return nil, err
	}
	return passages, nil
}

func (k *LibraryKnowledgeSource) KnowledgeExtractionPassages(ctx context.Context, saved agentsdk.ConversationKnowledgeResult, a agentsdk.ConversationAuthority) ([]agentsdk.KnowledgeDocumentPassage, error) {
	if saved.Operation != "fetch" || saved.DocumentID == "" || saved.Query != "" {
		return nil, conversationFailure("bad_request", "knowledge_response_invalid")
	}
	if saved.LibraryID == "" {
		source, ok := k.legacy.(agentsdk.KnowledgeExtractionContentSource)
		if !ok {
			return nil, conversationFailure("unavailable", "knowledge_extraction_content_unavailable")
		}
		return source.KnowledgeExtractionPassages(ctx, saved, a)
	}
	Binding, err := k.Access(ctx, saved.LibraryID, a)
	if err != nil {
		return nil, err
	}
	source, managed, err := k.ManagedSource(ctx, Binding, a)
	if err != nil {
		return nil, err
	}
	if managed {
		var data DocumentEvidence
		if json.Unmarshal(saved.Data, &data) != nil || !data.Partial {
			return nil, conversationFailure("conflict", "knowledge_response_invalid")
		}
		expected, err := k.DocumentReceipt(Binding, source.KnowledgeDocumentSourceIdentity(), "fetch", "", saved.DocumentID, data, a)
		if err != nil || conversationDigest(expected) != conversationDigest(saved) {
			return nil, conversationFailure("conflict", "knowledge_response_invalid")
		}
		if err = k.CheckDocumentSnapshots(ctx, Binding, source.KnowledgeDocumentSourceIdentity(), data, a); err != nil {
			return nil, err
		}
		for _, p := range data.Passages {
			if p.DocumentID != saved.DocumentID {
				return nil, conversationFailure("conflict", "knowledge_response_invalid")
			}
		}
		return data.Passages, nil
	}
	normalizer, ok := Binding.Source.(agentsdk.KnowledgeExtractionContentSource)
	if !ok {
		return nil, conversationFailure("unavailable", "knowledge_extraction_content_unavailable")
	}
	unwrapped := saved
	unwrapped.LibraryID = ""
	unwrapped.Citations = append([]agentsdk.ConversationCitation(nil), saved.Citations...)
	for i := range unwrapped.Citations {
		unwrapped.Citations[i].LibraryID = ""
	}
	return normalizer.KnowledgeExtractionPassages(ctx, unwrapped, a)
}
