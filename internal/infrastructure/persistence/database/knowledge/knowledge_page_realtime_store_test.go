package store

import (
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"strings"
	"sync"
	"testing"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func connectCollaborationFixture(t *testing.T, store *Store, libraryID, pageID, clientID string, authority agentsdk.ConversationAuthority) knowledgesdk.KnowledgeCollaborationSession {
	t.Helper()
	session, err := store.ConnectKnowledgeCollaboration(t.Context(), libraryID, pageID, knowledgesdk.KnowledgeCollaborationConnect{ClientID: clientID}, authority)
	if err != nil {
		t.Fatal(err)
	}
	return session
}

func collaborationUpdateFixture(clientID, updateID, text string, title *string, editedBlockIDs ...string) knowledgesdk.KnowledgeCollaborationUpdate {
	content := documentContentFixture(text)
	digest := sha256.Sum256([]byte(content))
	return knowledgesdk.KnowledgeCollaborationUpdate{
		ClientID:       clientID,
		UpdateID:       updateID,
		Title:          title,
		YjsUpdate:      base64.StdEncoding.EncodeToString([]byte("update:" + updateID)),
		YjsState:       base64.StdEncoding.EncodeToString([]byte("state:" + updateID)),
		Content:        content,
		ContentSHA256:  hex.EncodeToString(digest[:]),
		EditedBlockIDs: editedBlockIDs,
	}
}

func syncCollaborationFixture(t *testing.T, store *Store, libraryID, pageID string, session knowledgesdk.KnowledgeCollaborationSession, after int64, update *knowledgesdk.KnowledgeCollaborationUpdate, authority agentsdk.ConversationAuthority) knowledgesdk.KnowledgeCollaborationSyncResult {
	t.Helper()
	result, err := store.SyncKnowledgeCollaboration(t.Context(), libraryID, pageID, knowledgesdk.KnowledgeCollaborationSync{SessionID: session.ID, AfterClock: after, Update: update}, authority)
	if err != nil {
		t.Fatal(err)
	}
	return result
}

func TestKnowledgeCollaborationBlockSnapshotSurvivesRestart(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	page = savePageFixture(t, store, authority, library, page, "canonical", "标题", "正文 😀")
	session := connectCollaborationFixture(t, store, library.ID, page.Page.ID, "client", authority)
	want := documentContentFixture("正文 😀")
	if session.Snapshot.Title != "标题" || session.Snapshot.Content != want || session.Snapshot.YjsState != "" {
		t.Fatalf("unexpected initial collaboration snapshot: %+v", session.Snapshot)
	}
	update := collaborationUpdateFixture("client", "persist-state", "正文 😀\n补充", nil, "block-1", "block-2")
	result := syncCollaborationFixture(t, store, library.ID, page.Page.ID, session, session.ServerClock, &update, authority)
	if !result.Applied || result.Session.Snapshot.YjsState != update.YjsState {
		t.Fatalf("Yjs checkpoint was not applied: %+v", result)
	}
	restarted := New(store.store, store.sources, store.artifacts)
	reconnected := connectCollaborationFixture(t, restarted, library.ID, page.Page.ID, "client-restart", authority)
	if reconnected.Snapshot.Content != update.Content || reconnected.Snapshot.YjsState != update.YjsState || reconnected.Snapshot.DraftRevision != result.Session.Snapshot.DraftRevision {
		t.Fatalf("collaboration checkpoint did not survive restart: %+v", reconnected.Snapshot)
	}
}

func TestKnowledgeCollaborationPresenceReportsBlocksAndEventAuthors(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	alice := connectCollaborationFixture(t, store, library.ID, page.Page.ID, "alice", authority)
	bobAuthority := authority
	bobAuthority.UserID = "bob"
	var err error
	library, err = store.SetKnowledgeLibraryMember(t.Context(), library.ID, bobAuthority.UserID, agentsdk.KnowledgeLibraryMemberWrite{Role: "editor", ExpectedRevision: library.Revision}, authority)
	if err != nil {
		t.Fatal(err)
	}
	bob := connectCollaborationFixture(t, store, library.ID, page.Page.ID, "bob", bobAuthority)
	title := "协作标题"
	update := collaborationUpdateFixture("bob", "bob-update", "Bob 修改", &title, "block-1")
	result, err := store.SyncKnowledgeCollaboration(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgeCollaborationSync{
		SessionID: bob.ID, AfterClock: bob.ServerClock, Update: &update, CursorBlockID: "block-1", SelectionBlockID: "block-1",
	}, bobAuthority)
	if err != nil {
		t.Fatal(err)
	}
	var bobPresence *knowledgesdk.KnowledgeCollaborationPresence
	for index := range result.Session.Presence {
		if result.Session.Presence[index].UserID == bobAuthority.UserID {
			bobPresence = &result.Session.Presence[index]
		}
	}
	if bobPresence == nil || bobPresence.CursorBlockID != "block-1" || bobPresence.SelectionBlockID != "block-1" || bobPresence.EditedBlocks != 1 {
		t.Fatalf("presence did not expose block cursor and edit count: %+v", result.Session.Presence)
	}
	aliceResult := syncCollaborationFixture(t, store, library.ID, page.Page.ID, alice, alice.ServerClock, nil, authority)
	if len(aliceResult.Events) != 1 || aliceResult.Events[0].UserID != bobAuthority.UserID || aliceResult.Events[0].Update == nil {
		t.Fatalf("incremental event did not identify its author: %+v", aliceResult.Events)
	}
}

func TestKnowledgeCollaborationStaleWriterMustMergeAndRetry(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	alice := connectCollaborationFixture(t, store, library.ID, page.Page.ID, "alice", authority)
	bobAuthority := authority
	bobAuthority.UserID = "bob"
	var err error
	library, err = store.SetKnowledgeLibraryMember(t.Context(), library.ID, bobAuthority.UserID, agentsdk.KnowledgeLibraryMemberWrite{Role: "editor", ExpectedRevision: library.Revision}, authority)
	if err != nil {
		t.Fatal(err)
	}
	bob := connectCollaborationFixture(t, store, library.ID, page.Page.ID, "bob", bobAuthority)
	aliceUpdate := collaborationUpdateFixture("alice", "alice-update", "Alice", nil, "block-1")
	aliceResult := syncCollaborationFixture(t, store, library.ID, page.Page.ID, alice, alice.ServerClock, &aliceUpdate, authority)
	if !aliceResult.Applied {
		t.Fatal("first update was not applied")
	}
	bobStale := collaborationUpdateFixture("bob", "bob-stale", "Bob", nil, "block-2")
	bobResult := syncCollaborationFixture(t, store, library.ID, page.Page.ID, bob, bob.ServerClock, &bobStale, bobAuthority)
	if bobResult.Applied || bobResult.Session.Snapshot.Content != aliceUpdate.Content {
		t.Fatalf("stale update overwrote canonical state: %+v", bobResult)
	}
	merged := collaborationUpdateFixture("bob", "bob-merged", "Alice 和 Bob", nil, "block-1", "block-2")
	bobResult = syncCollaborationFixture(t, store, library.ID, page.Page.ID, bob, bobResult.Session.ServerClock, &merged, bobAuthority)
	if !bobResult.Applied || bobResult.Session.Snapshot.Content != merged.Content || bobResult.Session.Snapshot.ServerClock != aliceResult.Session.Snapshot.ServerClock+1 {
		t.Fatalf("merged retry did not become canonical: %+v", bobResult)
	}
}

func TestKnowledgeCollaborationSimultaneousWritersDoNotOverwrite(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	alice := connectCollaborationFixture(t, store, library.ID, page.Page.ID, "alice-concurrent", authority)
	bobAuthority := authority
	bobAuthority.UserID = "bob"
	var err error
	library, err = store.SetKnowledgeLibraryMember(t.Context(), library.ID, bobAuthority.UserID, agentsdk.KnowledgeLibraryMemberWrite{Role: "editor", ExpectedRevision: library.Revision}, authority)
	if err != nil {
		t.Fatal(err)
	}
	bob := connectCollaborationFixture(t, store, library.ID, page.Page.ID, "bob-concurrent", bobAuthority)
	type outcome struct {
		result knowledgesdk.KnowledgeCollaborationSyncResult
		err    error
	}
	outcomes := make(chan outcome, 2)
	var wait sync.WaitGroup
	for _, item := range []struct {
		session   knowledgesdk.KnowledgeCollaborationSession
		authority agentsdk.ConversationAuthority
		update    knowledgesdk.KnowledgeCollaborationUpdate
	}{
		{alice, authority, collaborationUpdateFixture("alice-concurrent", "alice-concurrent-update", "Alice", nil, "block-1")},
		{bob, bobAuthority, collaborationUpdateFixture("bob-concurrent", "bob-concurrent-update", "Bob", nil, "block-2")},
	} {
		item := item
		wait.Add(1)
		go func() {
			defer wait.Done()
			result, syncErr := store.SyncKnowledgeCollaboration(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgeCollaborationSync{SessionID: item.session.ID, AfterClock: item.session.ServerClock, Update: &item.update}, item.authority)
			outcomes <- outcome{result: result, err: syncErr}
		}()
	}
	wait.Wait()
	close(outcomes)
	applied, stale := 0, 0
	for current := range outcomes {
		if current.err != nil {
			t.Fatalf("simultaneous sync returned an error instead of a merge response: %v", current.err)
		}
		if current.result.Applied {
			applied++
		} else {
			stale++
		}
	}
	if applied != 1 || stale != 1 {
		t.Fatalf("simultaneous writes were not serialized: applied=%d stale=%d", applied, stale)
	}
}

func TestKnowledgeCollaborationPublishFreezesImmutableBlockVersion(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	session := connectCollaborationFixture(t, store, library.ID, page.Page.ID, "publisher", authority)
	first := collaborationUpdateFixture("publisher", "publisher-1", "协作草稿", nil, "block-1")
	result := syncCollaborationFixture(t, store, library.ID, page.Page.ID, session, session.ServerClock, &first, authority)
	published, err := store.PublishKnowledgeCollaboration(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgeCollaborationPublish{SessionID: session.ID, ClientID: session.ClientID, PublishNote: "协同发布"}, authority)
	if err != nil {
		t.Fatal(err)
	}
	if published.Published == nil || published.Published.Body.Content != first.Content || published.Page.PublishedVersion != 1 {
		t.Fatalf("publish did not freeze the current collaboration snapshot: %+v", published)
	}
	second := collaborationUpdateFixture("publisher", "publisher-2", "协作草稿继续修改", nil, "block-1")
	_ = syncCollaborationFixture(t, store, library.ID, page.Page.ID, session, result.Session.ServerClock, &second, authority)
	version, err := store.KnowledgePageVersion(t.Context(), library.ID, page.Page.ID, 1, authority)
	if err != nil || version.Body.Content != first.Content {
		t.Fatalf("later collaboration update mutated immutable version: %+v err=%v", version, err)
	}
}

func TestKnowledgeCollaborationMemberRemovalRevokesSession(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	bob := authority
	bob.UserID = "bob"
	var err error
	library, err = store.SetKnowledgeLibraryMember(t.Context(), library.ID, bob.UserID, agentsdk.KnowledgeLibraryMemberWrite{Role: "editor", ExpectedRevision: library.Revision}, authority)
	if err != nil {
		t.Fatal(err)
	}
	session := connectCollaborationFixture(t, store, library.ID, page.Page.ID, "bob", bob)
	if _, err = store.RemoveKnowledgeLibraryMember(t.Context(), library.ID, bob.UserID, library.Revision, authority); err != nil {
		t.Fatal(err)
	}
	if _, err = store.SyncKnowledgeCollaboration(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgeCollaborationSync{SessionID: session.ID}, bob); err == nil {
		t.Fatal("removed member retained an active collaboration session")
	}
}

func TestKnowledgeCollaborationHeartbeatRetentionAndSnapshotFallback(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	session := connectCollaborationFixture(t, store, library.ID, page.Page.ID, "retention", authority)
	heartbeat, err := store.SyncKnowledgeCollaboration(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgeCollaborationSync{
		SessionID: session.ID, AfterClock: session.ServerClock, CursorBlockID: "block-1", SelectionBlockID: "block-2",
	}, authority)
	if err != nil || len(heartbeat.Session.Presence) != 1 || heartbeat.Session.Presence[0].CursorBlockID != "block-1" {
		t.Fatalf("heartbeat did not renew presence: result=%+v err=%v", heartbeat, err)
	}
	clock := heartbeat.Session.ServerClock
	for index := int64(1); index <= knowledgeCollaborationRetainedEvents+1; index++ {
		update := collaborationUpdateFixture("retention", fmt.Sprintf("retention-%d", index), strings.Repeat("x", int(index)), nil, "block-1")
		result := syncCollaborationFixture(t, store, library.ID, page.Page.ID, session, clock, &update, authority)
		clock = result.Session.ServerClock
	}
	result := syncCollaborationFixture(t, store, library.ID, page.Page.ID, session, 0, nil, authority)
	if len(result.Events) != 1 || result.Events[0].Snapshot == nil || result.Events[0].Update != nil || result.Events[0].Snapshot.Content != documentContentFixture(strings.Repeat("x", int(knowledgeCollaborationRetainedEvents+1))) {
		t.Fatalf("client outside retained window did not receive current checkpoint: %+v", result.Events)
	}
}

func TestKnowledgeCollaborationExternalDraftWriteRevokesSession(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	session := connectCollaborationFixture(t, store, library.ID, page.Page.ID, "external", authority)
	replacement := savePageFixture(t, store, authority, library, page, "external-save", "外部保存", "替换正文")
	if _, err := store.SyncKnowledgeCollaboration(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgeCollaborationSync{SessionID: session.ID}, authority); err == nil || !strings.Contains(err.Error(), "collaboration_session_revoked") {
		t.Fatalf("stale session survived external draft replacement: %v", err)
	}
	reconnected := connectCollaborationFixture(t, store, library.ID, page.Page.ID, "external-new", authority)
	if reconnected.Snapshot.Content != documentContentFixture("替换正文") || reconnected.Snapshot.DraftRevision != replacement.Draft.DraftRevision || reconnected.Snapshot.YjsState != "" {
		t.Fatalf("reconnect did not start from replacement draft: %+v", reconnected.Snapshot)
	}
}

func TestKnowledgeCollaborationRejectsMalformedAndUnsafeUpdates(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	session := connectCollaborationFixture(t, store, library.ID, page.Page.ID, "security", authority)
	valid := collaborationUpdateFixture("security", "valid", "安全内容", nil, "block-1")
	unsafeContent := `{"blocks":[{"id":"image-1","type":"image","props":{"url":"https://evil.example/payload.svg"},"content":[],"children":[]}]}`
	digest := sha256.Sum256([]byte(unsafeContent))
	malicious := []knowledgesdk.KnowledgeCollaborationUpdate{
		{ClientID: "security", UpdateID: "bad-base64", YjsUpdate: "%%%", YjsState: valid.YjsState, Content: valid.Content, ContentSHA256: valid.ContentSHA256},
		{ClientID: "security", UpdateID: "bad-state", YjsUpdate: valid.YjsUpdate, YjsState: "%%%", Content: valid.Content, ContentSHA256: valid.ContentSHA256},
		{ClientID: "security", UpdateID: "bad-json", YjsUpdate: valid.YjsUpdate, YjsState: valid.YjsState, Content: `{}`, ContentSHA256: valid.ContentSHA256},
		{ClientID: "security", UpdateID: "unsafe-media", YjsUpdate: valid.YjsUpdate, YjsState: valid.YjsState, Content: unsafeContent, ContentSHA256: hex.EncodeToString(digest[:])},
	}
	for _, update := range malicious {
		if _, err := store.SyncKnowledgeCollaboration(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgeCollaborationSync{SessionID: session.ID, AfterClock: session.ServerClock, Update: &update}, authority); err == nil {
			t.Fatalf("malicious collaboration update %q was accepted", update.UpdateID)
		}
	}
	current, err := store.KnowledgePage(t.Context(), library.ID, page.Page.ID, true, authority)
	if err != nil || current.Draft.Body.Content != documentContentFixture("") {
		t.Fatalf("rejected updates changed the draft: %+v err=%v", current.Draft, err)
	}
}
