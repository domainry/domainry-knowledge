package application

import (
	"context"
	"encoding/json"
	"strings"
	"testing"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

type realtimeAuthorizationRepository struct {
	*pageAuthorizationRepository
	connectCalls int
	syncCalls    int
}

func (repository *realtimeAuthorizationRepository) ConnectKnowledgeCollaboration(_ context.Context, libraryID, pageID string, input knowledgesdk.KnowledgeCollaborationConnect, a agentsdk.Authority) (knowledgesdk.KnowledgeCollaborationSession, error) {
	repository.connectCalls++
	return knowledgesdk.KnowledgeCollaborationSession{ID: "session", LibraryID: libraryID, PageID: pageID, ClientID: input.ClientID, UserID: a.UserID, State: "connected", Snapshot: knowledgesdk.KnowledgeCollaborationSnapshot{PageID: pageID}}, nil
}

func (repository *realtimeAuthorizationRepository) SyncKnowledgeCollaboration(_ context.Context, libraryID, pageID string, input knowledgesdk.KnowledgeCollaborationSync, a agentsdk.Authority) (knowledgesdk.KnowledgeCollaborationSyncResult, error) {
	repository.syncCalls++
	return knowledgesdk.KnowledgeCollaborationSyncResult{Applied: true, Complete: true, Session: knowledgesdk.KnowledgeCollaborationSession{ID: input.SessionID, LibraryID: libraryID, PageID: pageID, UserID: a.UserID, State: "connected", ServerClock: 4, Snapshot: knowledgesdk.KnowledgeCollaborationSnapshot{PageID: pageID, DraftRevision: 3, ServerClock: 4}}}, nil
}

func (*realtimeAuthorizationRepository) KnowledgeCollaborationEvents(_ context.Context, _, _ string, input knowledgesdk.KnowledgeCollaborationEvents, _ agentsdk.Authority) (knowledgesdk.KnowledgeCollaborationEventBatch, error) {
	return knowledgesdk.KnowledgeCollaborationEventBatch{SessionID: input.SessionID, ServerClock: input.AfterClock, Events: []knowledgesdk.KnowledgeCollaborationServerEvent{}, Complete: true}, nil
}

func (*realtimeAuthorizationRepository) CloseKnowledgeCollaboration(context.Context, string, string, string, agentsdk.Authority) error {
	return nil
}

func (repository *realtimeAuthorizationRepository) PublishKnowledgeCollaboration(context.Context, string, string, knowledgesdk.KnowledgeCollaborationPublish, agentsdk.Authority) (knowledgesdk.KnowledgePageView, error) {
	return repository.page, nil
}

func TestKnowledgeRealtimeRechecksExactIdentityActionAndNeverAuditsBody(t *testing.T) {
	base := &pageAuthorizationRepository{
		library: agentsdk.KnowledgeLibrary{ID: "klib_test", Role: "editor"},
		page:    knowledgesdk.KnowledgePageView{Page: knowledgesdk.KnowledgePage{ID: "kpage_test", LibraryID: "klib_test", State: "active"}},
	}
	repository := &realtimeAuthorizationRepository{pageAuthorizationRepository: base}
	policy := &pageAuthorizationPolicy{}
	sink := &knowledgeEventSink{}
	service := NewService(repository, "runtime", Options{LibraryAuthorizer: policy, AuditAppender: sink}, nil)
	authority := agentsdk.Authority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "alice"}

	session, err := service.ConnectKnowledgeCollaboration(t.Context(), base.library.ID, base.page.Page.ID, knowledgesdk.KnowledgeCollaborationConnect{ClientID: "client"}, authority)
	if err != nil {
		t.Fatal(err)
	}
	secret := "绝不能进入审计的正文"
	update := knowledgesdk.KnowledgeCollaborationUpdate{ClientID: "client", UpdateID: "update", YjsUpdate: "dXBkYXRl", YjsState: "c3RhdGU=", Content: secret, ContentSHA256: strings.Repeat("a", 64), EditedBlockIDs: []string{"block-1"}}
	if _, err = service.SyncKnowledgeCollaboration(t.Context(), base.library.ID, base.page.Page.ID, knowledgesdk.KnowledgeCollaborationSync{SessionID: session.ID, Update: &update}, authority); err != nil {
		t.Fatal(err)
	}
	if repository.connectCalls != 1 || repository.syncCalls != 1 {
		t.Fatalf("unexpected repository calls: connect=%d sync=%d", repository.connectCalls, repository.syncCalls)
	}
	wantActions := []string{knowledgesdk.ActionPageCollaborationConnect, knowledgesdk.ActionPageCollaborationConnect, knowledgesdk.ActionPageCollaborationSync, knowledgesdk.ActionPageCollaborationSync}
	if len(policy.actions) != len(wantActions) {
		t.Fatalf("missing exact-action checks: %v", policy.actions)
	}
	for index := range wantActions {
		if policy.actions[index] != wantActions[index] {
			t.Fatalf("action checks=%v", policy.actions)
		}
	}
	raw, _ := json.Marshal(sink.audits)
	if strings.Contains(string(raw), secret) || strings.Contains(string(raw), "block-1") {
		t.Fatalf("CRDT body/operation escaped into audit: %s", raw)
	}
	if len(sink.audits) != 2 || sink.audits[1].After["edited_block_count"] != "1" || sink.audits[1].After["encoded_update_bytes"] != "8" || sink.audits[1].After["applied"] != "true" || sink.audits[1].After["server_clock"] != "4" {
		t.Fatalf("audit lost bounded collaboration metadata: %+v", sink.audits)
	}
}

func TestKnowledgeCollaborationEventsRechecksExactIdentityAction(t *testing.T) {
	base := &pageAuthorizationRepository{
		library: agentsdk.KnowledgeLibrary{ID: "klib_test", Role: "editor"},
		page:    knowledgesdk.KnowledgePageView{Page: knowledgesdk.KnowledgePage{ID: "kpage_test", LibraryID: "klib_test", State: "active"}},
	}
	repository := &realtimeAuthorizationRepository{pageAuthorizationRepository: base}
	policy := &pageAuthorizationPolicy{}
	service := NewService(repository, "runtime", Options{LibraryAuthorizer: policy}, nil)
	authority := agentsdk.Authority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "alice"}
	batch, err := service.KnowledgeCollaborationEvents(t.Context(), base.library.ID, base.page.Page.ID, knowledgesdk.KnowledgeCollaborationEvents{SessionID: "session", AfterClock: 3, WaitMillis: 10}, authority)
	if err != nil || batch.SessionID != "session" {
		t.Fatalf("events batch=%+v err=%v", batch, err)
	}
	want := []string{knowledgesdk.ActionPageCollaborationEvents, knowledgesdk.ActionPageCollaborationEvents}
	if len(policy.actions) != len(want) || policy.actions[0] != want[0] || policy.actions[1] != want[1] {
		t.Fatalf("event stream did not recheck exact action: %v", policy.actions)
	}
}

func TestKnowledgeRealtimeIdentityDenialStopsBeforeRepositoryMutation(t *testing.T) {
	base := &pageAuthorizationRepository{library: agentsdk.KnowledgeLibrary{ID: "klib_test", Role: "editor"}, page: knowledgesdk.KnowledgePageView{Page: knowledgesdk.KnowledgePage{ID: "kpage_test", LibraryID: "klib_test", State: "active"}}}
	repository := &realtimeAuthorizationRepository{pageAuthorizationRepository: base}
	policy := &pageAuthorizationPolicy{denyAt: 1}
	service := NewService(repository, "runtime", Options{LibraryAuthorizer: policy}, nil)
	authority := agentsdk.Authority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "alice"}
	if _, err := service.SyncKnowledgeCollaboration(t.Context(), base.library.ID, base.page.Page.ID, knowledgesdk.KnowledgeCollaborationSync{SessionID: "session"}, authority); err == nil || !strings.Contains(err.Error(), "permission_denied") {
		t.Fatalf("Identity denial was not returned: %v", err)
	}
	if repository.syncCalls != 0 || len(policy.actions) != 1 || policy.actions[0] != knowledgesdk.ActionPageCollaborationSync {
		t.Fatalf("denied sync reached repository or used wrong action: calls=%d actions=%v", repository.syncCalls, policy.actions)
	}
}
