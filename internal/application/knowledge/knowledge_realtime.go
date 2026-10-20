package application

import (
	"context"
	"strconv"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func (s *Service) realtimeCollaborationAccess(ctx context.Context, libraryID, pageID, action string, a agentsdk.ConversationAuthority) (knowledgesdk.KnowledgeRealtimeCollaborationService, error) {
	if _, _, err := s.pageItemAccess(ctx, libraryID, pageID, action, a); err != nil {
		return nil, err
	}
	repository, ok := s.repo.(knowledgesdk.KnowledgeRealtimeCollaborationService)
	if !ok {
		return nil, conversationFailure("unavailable", "page_collaboration_unavailable")
	}
	return repository, nil
}

func (s *Service) ConnectKnowledgeCollaboration(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgeCollaborationConnect, a agentsdk.ConversationAuthority) (knowledgesdk.KnowledgeCollaborationSession, error) {
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

func (s *Service) SyncKnowledgeCollaboration(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgeCollaborationSync, a agentsdk.ConversationAuthority) (knowledgesdk.KnowledgeCollaborationSyncResult, error) {
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

func (s *Service) CloseKnowledgeCollaboration(ctx context.Context, libraryID, pageID, sessionID string, a agentsdk.ConversationAuthority) error {
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

func (s *Service) PublishKnowledgeCollaboration(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgeCollaborationPublish, a agentsdk.ConversationAuthority) (knowledgesdk.KnowledgePageView, error) {
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
