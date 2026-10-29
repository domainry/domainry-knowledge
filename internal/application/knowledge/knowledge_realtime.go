package application

import (
	"context"
	"strconv"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func (s *Service) realtimeCollaborationAccess(ctx context.Context, libraryID, pageID, action string, a agentsdk.Authority) (knowledgesdk.KnowledgeRealtimeCollaborationService, error) {
	if _, _, err := s.pageItemAccess(ctx, libraryID, pageID, action, a); err != nil {
		return nil, err
	}
	repository, ok := s.repo.(knowledgesdk.KnowledgeRealtimeCollaborationService)
	if !ok {
		return nil, conversationFailure("unavailable", "page_collaboration_unavailable")
	}
	return repository, nil
}

func (s *Service) ConnectKnowledgeCollaboration(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgeCollaborationConnect, a agentsdk.Authority) (knowledgesdk.KnowledgeCollaborationSession, error) {
	repository, err := s.realtimeCollaborationAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageCollaborationConnect, a)
	if err != nil {
		return knowledgesdk.KnowledgeCollaborationSession{}, err
	}
	result, err := repository.ConnectKnowledgeCollaboration(ctx, libraryID, pageID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageCollaborationConnect, a)
	}
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPageCollaborationConnect, "knowledge.page_collaboration.connected", libraryID, pageID, result.ID, input.ClientID, result.Snapshot.DraftRevision, nil, map[string]string{"server_clock": strconv.FormatInt(result.ServerClock, 10)}, a)
	}
	return result, err
}

func (s *Service) SyncKnowledgeCollaboration(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgeCollaborationSync, a agentsdk.Authority) (knowledgesdk.KnowledgeCollaborationSyncResult, error) {
	repository, err := s.realtimeCollaborationAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageCollaborationSync, a)
	if err != nil {
		return knowledgesdk.KnowledgeCollaborationSyncResult{}, err
	}
	result, err := repository.SyncKnowledgeCollaboration(ctx, libraryID, pageID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageCollaborationSync, a)
	}
	// Update payloads and page content are intentionally excluded from audit.
	// The durable record proves who synchronized which update and server clock.
	if err == nil && input.Update != nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPageCollaborationSync, "knowledge.page_collaboration.updated", libraryID, pageID, input.SessionID, input.Update.UpdateID, result.Session.Snapshot.DraftRevision, nil, map[string]string{
			"server_clock":         strconv.FormatInt(result.Session.ServerClock, 10),
			"encoded_update_bytes": strconv.Itoa(len(input.Update.YjsUpdate)),
			"edited_block_count":   strconv.Itoa(len(input.Update.EditedBlockIDs)),
			"applied":              strconv.FormatBool(result.Applied),
		}, a)
	}
	return result, err
}

func (s *Service) KnowledgePageEditHistory(ctx context.Context, libraryID, pageID string, before int64, limit int, a agentsdk.Authority) (knowledgesdk.KnowledgePageEditHistoryPage, error) {
	if _, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageEditHistoryList, a); err != nil {
		return knowledgesdk.KnowledgePageEditHistoryPage{}, err
	}
	repository, ok := s.repo.(knowledgesdk.PageEditHistoryService)
	if !ok {
		return knowledgesdk.KnowledgePageEditHistoryPage{}, conversationFailure("unavailable", "page_edit_history_unavailable")
	}
	result, err := repository.KnowledgePageEditHistory(ctx, libraryID, pageID, before, limit, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageEditHistoryList, a)
	}
	return result, err
}

func (s *Service) KnowledgePageSuggestions(ctx context.Context, libraryID, pageID string, a agentsdk.Authority) (knowledgesdk.KnowledgePageSuggestionPage, error) {
	if _, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageSuggestionsList, a); err != nil {
		return knowledgesdk.KnowledgePageSuggestionPage{}, err
	}
	repository, ok := s.repo.(knowledgesdk.PageSuggestionService)
	if !ok {
		return knowledgesdk.KnowledgePageSuggestionPage{}, conversationFailure("unavailable", "page_suggestions_unavailable")
	}
	result, err := repository.KnowledgePageSuggestions(ctx, libraryID, pageID, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageSuggestionsList, a)
	}
	return result, err
}

func (s *Service) CreateKnowledgePageSuggestion(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgePageSuggestionCreate, a agentsdk.Authority) (knowledgesdk.KnowledgePageSuggestion, error) {
	if _, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageSuggestionsCreate, a); err != nil {
		return knowledgesdk.KnowledgePageSuggestion{}, err
	}
	repository, ok := s.repo.(knowledgesdk.PageSuggestionService)
	if !ok {
		return knowledgesdk.KnowledgePageSuggestion{}, conversationFailure("unavailable", "page_suggestions_unavailable")
	}
	result, err := repository.CreateKnowledgePageSuggestion(ctx, libraryID, pageID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageSuggestionsCreate, a)
	}
	if err == nil {
		after := map[string]string{
			"kind":                result.Kind,
			"base_draft_revision": strconv.FormatInt(result.BaseDraftRevision, 10),
			"source":              result.Source,
		}
		if result.ToolCallID != "" {
			after["tool_call_id"] = result.ToolCallID
		}
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPageSuggestionsCreate, "knowledge.page_suggestion.created", libraryID, pageID, result.ID, input.ClientID, result.Revision, nil, after, a)
		s.publishKnowledgeSuggestion(ctx, result, a)
	}
	return result, err
}

func (s *Service) DecideKnowledgePageSuggestion(ctx context.Context, libraryID, pageID, suggestionID string, input knowledgesdk.KnowledgePageSuggestionDecision, a agentsdk.Authority) (knowledgesdk.KnowledgePageSuggestion, error) {
	if _, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageSuggestionsDecide, a); err != nil {
		return knowledgesdk.KnowledgePageSuggestion{}, err
	}
	repository, ok := s.repo.(knowledgesdk.PageSuggestionService)
	if !ok {
		return knowledgesdk.KnowledgePageSuggestion{}, conversationFailure("unavailable", "page_suggestions_unavailable")
	}
	result, err := repository.DecideKnowledgePageSuggestion(ctx, libraryID, pageID, suggestionID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageSuggestionsDecide, a)
	}
	if err == nil {
		after := map[string]string{
			"decision":          input.Decision,
			"status":            result.Status,
			"source":            input.Source,
			"suggestion_source": result.Source,
		}
		if input.ToolCallID != "" {
			after["tool_call_id"] = input.ToolCallID
		}
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPageSuggestionsDecide, "knowledge.page_suggestion.decided", libraryID, pageID, result.ID, input.ClientID, result.Revision, map[string]string{"expected_revision": strconv.FormatInt(input.ExpectedRevision, 10)}, after, a)
	}
	return result, err
}

func (s *Service) KnowledgeCollaborationEvents(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgeCollaborationEvents, a agentsdk.Authority) (knowledgesdk.KnowledgeCollaborationEventBatch, error) {
	repository, err := s.realtimeCollaborationAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageCollaborationEvents, a)
	if err != nil {
		return knowledgesdk.KnowledgeCollaborationEventBatch{}, err
	}
	result, err := repository.KnowledgeCollaborationEvents(ctx, libraryID, pageID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageCollaborationEvents, a)
	}
	return result, err
}

func (s *Service) KnowledgePageLiveEvents(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgePageLiveEvents, a agentsdk.Authority) (knowledgesdk.KnowledgePageLiveEventBatch, error) {
	if _, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageLiveEvents, a); err != nil {
		return knowledgesdk.KnowledgePageLiveEventBatch{}, err
	}
	repository, ok := s.repo.(knowledgesdk.KnowledgePageLiveEventService)
	if !ok {
		return knowledgesdk.KnowledgePageLiveEventBatch{}, conversationFailure("unavailable", "page_live_events_unavailable")
	}
	result, err := repository.KnowledgePageLiveEvents(ctx, libraryID, pageID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageLiveEvents, a)
	}
	return result, err
}

func (s *Service) CloseKnowledgeCollaboration(ctx context.Context, libraryID, pageID, sessionID string, a agentsdk.Authority) error {
	repository, err := s.realtimeCollaborationAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageCollaborationClose, a)
	if err != nil {
		return err
	}
	if err = repository.CloseKnowledgeCollaboration(ctx, libraryID, pageID, sessionID, a); err != nil {
		return err
	}
	if err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageCollaborationClose, a); err != nil {
		return err
	}
	s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPageCollaborationClose, "knowledge.page_collaboration.closed", libraryID, pageID, sessionID, "", 0, nil, nil, a)
	return nil
}

func (s *Service) PublishKnowledgeCollaboration(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgeCollaborationPublish, a agentsdk.Authority) (knowledgesdk.KnowledgePageView, error) {
	repository, err := s.realtimeCollaborationAccess(ctx, libraryID, pageID, knowledgesdk.ActionPageCollaborationPublish, a)
	if err != nil {
		return knowledgesdk.KnowledgePageView{}, err
	}
	result, err := repository.PublishKnowledgeCollaboration(ctx, libraryID, pageID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPageCollaborationPublish, a)
	}
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPageCollaborationPublish, "knowledge.page_collaboration.published", libraryID, pageID, input.SessionID, input.ClientID, result.Page.PublishedVersion, nil, map[string]string{"published_version": strconv.FormatInt(result.Page.PublishedVersion, 10)}, a)
		s.WakeKnowledgeDocuments()
	}
	return result, err
}
