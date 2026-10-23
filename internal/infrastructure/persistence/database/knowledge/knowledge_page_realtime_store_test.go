package store

import (
	"context"
	"crypto/sha256"
	"database/sql"
	"encoding/base64"
	"encoding/hex"
	"errors"
	"fmt"
	"strings"
	"sync"
	"testing"
	"time"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-orm/query"
)

type collaborationMetricsRecorder struct {
	snapshotBytes       []int64
	updateBytes         []int64
	latencies           []time.Duration
	compressedBytes     []int64
	compressionDuration []time.Duration
	onlineUsers         []int64
	reconnects          int
	replayed            int64
}

func (recorder *collaborationMetricsRecorder) recordSnapshot(_ context.Context, value int64) {
	recorder.snapshotBytes = append(recorder.snapshotBytes, value)
}

func (recorder *collaborationMetricsRecorder) recordUpdate(_ context.Context, updateBytes int64, latency time.Duration, snapshotBytes int64, compressionDuration time.Duration, compressedBytes int64) {
	recorder.updateBytes = append(recorder.updateBytes, updateBytes)
	recorder.latencies = append(recorder.latencies, latency)
	recorder.snapshotBytes = append(recorder.snapshotBytes, snapshotBytes)
	recorder.compressionDuration = append(recorder.compressionDuration, compressionDuration)
	recorder.compressedBytes = append(recorder.compressedBytes, compressedBytes)
}

func (recorder *collaborationMetricsRecorder) recordOnlineUsers(_ context.Context, value int64) {
	recorder.onlineUsers = append(recorder.onlineUsers, value)
}

func (recorder *collaborationMetricsRecorder) recordEventStream(_ context.Context, reconnected bool, replayed int64) {
	if reconnected {
		recorder.reconnects++
	}
	recorder.replayed += replayed
}

type collaborationWakeBus struct {
	mu          sync.Mutex
	subscribers map[string]map[chan struct{}]struct{}
}

func newCollaborationWakeBus() *collaborationWakeBus {
	return &collaborationWakeBus{subscribers: map[string]map[chan struct{}]struct{}{}}
}

func (bus *collaborationWakeBus) PublishKnowledgeCollaborationWake(_ context.Context, keys []string) error {
	bus.mu.Lock()
	defer bus.mu.Unlock()
	for _, key := range keys {
		for subscriber := range bus.subscribers[key] {
			select {
			case subscriber <- struct{}{}:
			default:
			}
		}
	}
	return nil
}

func (bus *collaborationWakeBus) SubscribeKnowledgeCollaborationWake(_ context.Context, keys []string) (<-chan struct{}, func(), error) {
	updates := make(chan struct{}, 1)
	bus.mu.Lock()
	for _, key := range keys {
		if bus.subscribers[key] == nil {
			bus.subscribers[key] = map[chan struct{}]struct{}{}
		}
		bus.subscribers[key][updates] = struct{}{}
	}
	bus.mu.Unlock()
	return updates, func() {
		bus.mu.Lock()
		defer bus.mu.Unlock()
		for _, key := range keys {
			delete(bus.subscribers[key], updates)
		}
	}, nil
}

func connectCollaborationFixture(t *testing.T, store *Store, libraryID, pageID, clientID string, authority agentsdk.Authority) knowledgesdk.KnowledgeCollaborationSession {
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

func syncCollaborationFixture(t *testing.T, store *Store, libraryID, pageID string, session knowledgesdk.KnowledgeCollaborationSession, after int64, update *knowledgesdk.KnowledgeCollaborationUpdate, authority agentsdk.Authority) knowledgesdk.KnowledgeCollaborationSyncResult {
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
	retry, err := store.SyncKnowledgeCollaboration(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgeCollaborationSync{SessionID: session.ID, AfterClock: session.ServerClock, Update: &update}, authority)
	if err != nil || !retry.Applied || retry.Session.Snapshot.DraftRevision != result.Session.Snapshot.DraftRevision {
		t.Fatalf("identical checkpoint retry was not idempotent: result=%+v err=%v", retry, err)
	}
	conflicting := update
	conflicting.YjsState = base64.StdEncoding.EncodeToString([]byte("different checkpoint"))
	_, err = store.SyncKnowledgeCollaboration(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgeCollaborationSync{SessionID: session.ID, AfterClock: result.Session.ServerClock, Update: &conflicting}, authority)
	var failure *knowledgesdk.Error
	if !errors.As(err, &failure) || failure.Code != "knowledge.collaboration_update_conflict" {
		t.Fatalf("same update ID with different checkpoint did not conflict: %v", err)
	}
	if err := store.transaction(t.Context(), func(tx *sql.Tx) error {
		var snapshotRecord knowledgeCollaborationSnapshotRecord
		found, readErr := store.executionRead(t.Context(), tx, knowledgePageCollaborationSnapshotTable, pageScope(authority, page.Page.ID), &snapshotRecord)
		if readErr != nil {
			return readErr
		}
		if !found || snapshotRecord.YjsStateGzip == "" || snapshotRecord.Snapshot.YjsState != "" {
			t.Fatalf("durable checkpoint was not gzip-only: %+v", snapshotRecord)
		}
		restored, restoreErr := restoreKnowledgeCollaborationSnapshot(snapshotRecord)
		if restoreErr != nil || restored.YjsState != update.YjsState {
			t.Fatalf("durable checkpoint did not round-trip: snapshot=%+v err=%v", restored, restoreErr)
		}
		var updateRecord knowledgeCollaborationUpdateRecord
		found, readErr = store.executionRead(t.Context(), tx, knowledgePageCollaborationUpdateTable, query.And(pageScope(authority, page.Page.ID), query.Equal("update_id", update.UpdateID)), &updateRecord)
		if readErr != nil {
			return readErr
		}
		if !found || updateRecord.RequestHash == "" || updateRecord.Update.YjsUpdate == "" {
			t.Fatalf("durable update log lost idempotency or delta: %+v", updateRecord)
		}
		return nil
	}); err != nil {
		t.Fatal(err)
	}
	restarted := New(store.store)
	reconnected := connectCollaborationFixture(t, restarted, library.ID, page.Page.ID, "client-restart", authority)
	if reconnected.Snapshot.Content != update.Content || reconnected.Snapshot.YjsState != update.YjsState || reconnected.Snapshot.DraftRevision != result.Session.Snapshot.DraftRevision {
		t.Fatalf("collaboration checkpoint did not survive restart: %+v", reconnected.Snapshot)
	}
}

func TestKnowledgeCollaborationPersistsContinuousBlockEditHistory(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	page = savePageFixture(t, store, authority, library, page, "history-base", "原标题", "第一段")
	session := connectCollaborationFixture(t, store, library.ID, page.Page.ID, "history-client", authority)
	newTitle := "新标题"
	update := collaborationUpdateFixture("history-client", "history-update", "第一段已修改\n第二段", &newTitle, "block-1", "block-2")
	result := syncCollaborationFixture(t, store, library.ID, page.Page.ID, session, session.ServerClock, &update, authority)
	history, err := store.KnowledgePageEditHistory(t.Context(), library.ID, page.Page.ID, 0, 20, authority)
	if err != nil {
		t.Fatal(err)
	}
	if len(history.Items) != 2 || !history.Complete {
		t.Fatalf("unexpected edit history page: %+v", history)
	}
	entry := history.Items[0]
	if entry.Clock != result.Session.ServerClock || entry.DraftRevision != result.Session.Snapshot.DraftRevision || entry.UserID != authority.UserID || !entry.TitleChanged || entry.ChangedBlockCount != 2 || entry.Truncated || len(entry.Changes) != 2 {
		t.Fatalf("unexpected edit history entry: %+v", entry)
	}
	if entry.Changes[0].NodeID != "block-1" || entry.Changes[0].Kind != "update" || entry.Changes[0].BeforePreview != "第一段" || entry.Changes[0].AfterPreview != "第一段已修改" {
		t.Fatalf("missing block update diff: %+v", entry.Changes)
	}
	if entry.Changes[1].NodeID != "block-2" || entry.Changes[1].Kind != "insert" || entry.Changes[1].AfterPreview != "第二段" {
		t.Fatalf("missing block insert diff: %+v", entry.Changes)
	}
}

func TestKnowledgeCollaborationRecordsOperationalMetricsWithoutContentLabels(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	recorder := &collaborationMetricsRecorder{}
	store.collaborationMetrics = recorder
	session := connectCollaborationFixture(t, store, library.ID, page.Page.ID, "metrics-client", authority)
	update := collaborationUpdateFixture("metrics-client", "metrics-update", "metrics body", nil, "block-1")
	update.ClientCreatedAt = time.Now().Add(-20 * time.Millisecond)
	result := syncCollaborationFixture(t, store, library.ID, page.Page.ID, session, session.ServerClock, &update, authority)
	if !result.Applied {
		t.Fatal("metrics fixture update was not applied")
	}
	if len(recorder.updateBytes) != 1 || recorder.updateBytes[0] != int64(len("update:"+update.UpdateID)) || len(recorder.latencies) != 1 || recorder.latencies[0] < 0 || len(recorder.compressedBytes) != 1 || recorder.compressedBytes[0] <= 0 || len(recorder.compressionDuration) != 1 || recorder.compressionDuration[0] <= 0 {
		t.Fatalf("update/checkpoint metrics missing: %+v", recorder)
	}
	if len(recorder.onlineUsers) < 2 || recorder.onlineUsers[len(recorder.onlineUsers)-1] != 1 || len(recorder.snapshotBytes) < 2 || recorder.snapshotBytes[len(recorder.snapshotBytes)-1] <= 0 {
		t.Fatalf("snapshot/presence metrics missing: %+v", recorder)
	}
	batch, err := store.KnowledgeCollaborationEvents(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgeCollaborationEvents{SessionID: session.ID, AfterClock: 0, ConnectionAttempt: 2}, authority)
	if err != nil {
		t.Fatal(err)
	}
	if len(batch.Events) == 0 || recorder.reconnects != 1 || recorder.replayed < 1 {
		t.Fatalf("reconnect/replay metrics missing: batch=%+v recorder=%+v", batch, recorder)
	}
}

func TestKnowledgeCollaborationReplaysDeltasAfterBoundedCheckpoint(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	session := connectCollaborationFixture(t, store, library.ID, page.Page.ID, "delta-client", authority)
	checkpoint := collaborationUpdateFixture("delta-client", "delta-checkpoint", "初始正文", nil, "block-1")
	first := syncCollaborationFixture(t, store, library.ID, page.Page.ID, session, session.ServerClock, &checkpoint, authority)
	delta := collaborationUpdateFixture("delta-client", "delta-only", "增量后的正文", nil, "block-1")
	delta.YjsState = ""
	second := syncCollaborationFixture(t, store, library.ID, page.Page.ID, session, first.Session.ServerClock, &delta, authority)
	if !second.Applied || second.Session.Snapshot.YjsState != checkpoint.YjsState || second.Session.Snapshot.YjsStateClock != first.Session.ServerClock {
		t.Fatalf("delta unexpectedly replaced the durable checkpoint: %+v", second.Session.Snapshot)
	}
	reconnected := connectCollaborationFixture(t, New(store.store), library.ID, page.Page.ID, "delta-reconnect", authority)
	if reconnected.Snapshot.YjsState != checkpoint.YjsState || len(reconnected.Snapshot.YjsUpdates) != 1 || reconnected.Snapshot.YjsUpdates[0].UpdateID != delta.UpdateID || reconnected.Snapshot.YjsUpdates[0].Clock != second.Session.ServerClock {
		t.Fatalf("reconnect did not return checkpoint plus ordered delta replay: %+v", reconnected.Snapshot)
	}
}

func TestKnowledgeCollaborationRequiresPeriodicCheckpointBeforeReplayWindowCanOverflow(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	session := connectCollaborationFixture(t, store, library.ID, page.Page.ID, "checkpoint-client", authority)
	first := collaborationUpdateFixture("checkpoint-client", "checkpoint-1", "1", nil, "block-1")
	result := syncCollaborationFixture(t, store, library.ID, page.Page.ID, session, session.ServerClock, &first, authority)
	for clock := int64(2); clock <= knowledgeCollaborationCheckpointInterval; clock++ {
		update := collaborationUpdateFixture("checkpoint-client", fmt.Sprintf("delta-%d", clock), fmt.Sprintf("%d", clock), nil, "block-1")
		update.YjsState = ""
		result = syncCollaborationFixture(t, store, library.ID, page.Page.ID, session, result.Session.ServerClock, &update, authority)
	}
	required := collaborationUpdateFixture("checkpoint-client", "checkpoint-required", "checkpoint required", nil, "block-1")
	required.YjsState = ""
	if _, err := store.SyncKnowledgeCollaboration(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgeCollaborationSync{SessionID: session.ID, AfterClock: result.Session.ServerClock, Update: &required}, authority); err == nil || !strings.Contains(err.Error(), "collaboration_checkpoint_required") {
		t.Fatalf("unbounded delta chain was accepted: %v", err)
	}
	required.YjsState = base64.StdEncoding.EncodeToString([]byte("checkpoint:required"))
	result = syncCollaborationFixture(t, store, library.ID, page.Page.ID, session, result.Session.ServerClock, &required, authority)
	if result.Session.Snapshot.YjsStateClock != result.Session.ServerClock || len(result.Session.Snapshot.YjsUpdates) != 0 {
		t.Fatalf("periodic checkpoint did not compact the client replay view: %+v", result.Session.Snapshot)
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
	awareness := base64.StdEncoding.EncodeToString([]byte("transient-awareness"))
	result, err := store.SyncKnowledgeCollaboration(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgeCollaborationSync{
		SessionID: bob.ID, AfterClock: bob.ServerClock, Update: &update, AwarenessUpdate: awareness, CursorBlockID: "block-1", SelectionBlockID: "block-1",
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
	if bobPresence == nil || bobPresence.AwarenessUpdate != awareness || bobPresence.CursorBlockID != "block-1" || bobPresence.SelectionBlockID != "block-1" || bobPresence.EditedBlocks != 1 {
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
		authority agentsdk.Authority
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
	if err = store.transaction(t.Context(), func(tx *sql.Tx) error {
		var record knowledgeCollaborationSessionRecord
		found, readErr := store.executionRead(t.Context(), tx, knowledgePageCollaborationSessionTable, knowledgeCollaborationSessionScope(authority, session.ID), &record)
		if readErr != nil {
			return readErr
		}
		if !found || record.State != "revoked" || record.AwarenessUpdate != "" || record.CursorBlockID != "" || record.SelectionBlockID != "" || len(record.EditedBlockIDs) != 0 {
			t.Fatalf("revoked session retained transient collaboration state: %+v", record)
		}
		return nil
	}); err != nil {
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
	stream, err := store.KnowledgeCollaborationEvents(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgeCollaborationEvents{SessionID: session.ID, AfterClock: 0}, authority)
	if err != nil || len(stream.Events) != 2 || stream.Events[0].Type != knowledgesdk.KnowledgeCollaborationEventSnapshot || stream.Events[0].Snapshot == nil || stream.Events[0].Snapshot.ServerClock != clock || stream.Events[1].Type != knowledgesdk.KnowledgeCollaborationEventPresence {
		t.Fatalf("SSE batch did not fall back to durable snapshot and presence: batch=%+v err=%v", stream, err)
	}
}

func TestKnowledgeCollaborationEventsWakeImmediatelyAndResumeByClock(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	reader := connectCollaborationFixture(t, store, library.ID, page.Page.ID, "reader", authority)
	result := make(chan knowledgesdk.KnowledgeCollaborationEventBatch, 1)
	errors := make(chan error, 1)
	ctx, cancel := context.WithTimeout(t.Context(), 3*time.Second)
	defer cancel()
	go func() {
		batch, err := store.KnowledgeCollaborationEvents(ctx, library.ID, page.Page.ID, knowledgesdk.KnowledgeCollaborationEvents{SessionID: reader.ID, AfterClock: reader.ServerClock, WaitMillis: 2500}, authority)
		if err != nil {
			errors <- err
			return
		}
		result <- batch
	}()
	update := collaborationUpdateFixture("reader", "stream-update", "SSE 立即更新", nil, "block-1")
	syncResult := syncCollaborationFixture(t, store, library.ID, page.Page.ID, reader, reader.ServerClock, &update, authority)
	select {
	case err := <-errors:
		t.Fatal(err)
	case batch := <-result:
		if batch.ServerClock != syncResult.Session.ServerClock || len(batch.Events) < 1 || batch.Events[0].Type != knowledgesdk.KnowledgeCollaborationEventUpdate || batch.Events[0].Clock != syncResult.Session.ServerClock || batch.Events[0].Update == nil || batch.Events[0].Update.UpdateID != update.UpdateID {
			t.Fatalf("event wait did not resume from durable clock: %+v", batch)
		}
	case <-ctx.Done():
		t.Fatal("event wait was not awakened by committed update")
	}
}

func TestKnowledgeCollaborationExternalNotifierWakesAnotherStoreInstance(t *testing.T) {
	writer, authority, library, page := pageFixture(t)
	readerStore := New(writer.store)
	bus := newCollaborationWakeBus()
	writer.SetKnowledgeCollaborationNotifier(bus)
	readerStore.SetKnowledgeCollaborationNotifier(bus)
	reader := connectCollaborationFixture(t, readerStore, library.ID, page.Page.ID, "cross-instance-reader", authority)
	writerSession := connectCollaborationFixture(t, writer, library.ID, page.Page.ID, "cross-instance-writer", authority)
	result := make(chan knowledgesdk.KnowledgeCollaborationEventBatch, 1)
	errors := make(chan error, 1)
	ctx, cancel := context.WithTimeout(t.Context(), 3*time.Second)
	defer cancel()
	go func() {
		batch, waitErr := readerStore.KnowledgeCollaborationEvents(ctx, library.ID, page.Page.ID, knowledgesdk.KnowledgeCollaborationEvents{SessionID: reader.ID, AfterClock: reader.ServerClock, WaitMillis: 2500}, authority)
		if waitErr != nil {
			errors <- waitErr
			return
		}
		result <- batch
	}()
	update := collaborationUpdateFixture("cross-instance-writer", "cross-instance-update", "跨实例唤醒", nil, "block-1")
	synced := syncCollaborationFixture(t, writer, library.ID, page.Page.ID, writerSession, writerSession.ServerClock, &update, authority)
	select {
	case waitErr := <-errors:
		t.Fatal(waitErr)
	case batch := <-result:
		if batch.ServerClock != synced.Session.ServerClock || len(batch.Events) == 0 || batch.Events[0].Update == nil || batch.Events[0].Update.UpdateID != update.UpdateID {
			t.Fatalf("external notifier woke without durable replay: %+v", batch)
		}
	case <-ctx.Done():
		t.Fatal("external notifier did not wake the second store instance")
	}
}

func TestKnowledgeCollaborationEventsWakeWhenMembershipRevokesSession(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	bob := authority
	bob.UserID = "bob"
	var err error
	library, err = store.SetKnowledgeLibraryMember(t.Context(), library.ID, bob.UserID, agentsdk.KnowledgeLibraryMemberWrite{Role: "editor", ExpectedRevision: library.Revision}, authority)
	if err != nil {
		t.Fatal(err)
	}
	session := connectCollaborationFixture(t, store, library.ID, page.Page.ID, "bob-events", bob)
	awareness := base64.StdEncoding.EncodeToString([]byte("revoked-awareness"))
	if _, err = store.SyncKnowledgeCollaboration(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgeCollaborationSync{SessionID: session.ID, AfterClock: session.ServerClock, AwarenessUpdate: awareness, CursorBlockID: "block-1", SelectionBlockID: "block-1"}, bob); err != nil {
		t.Fatal(err)
	}
	ctx, cancel := context.WithTimeout(t.Context(), 3*time.Second)
	defer cancel()
	streamErr := make(chan error, 1)
	go func() {
		_, waitErr := store.KnowledgeCollaborationEvents(ctx, library.ID, page.Page.ID, knowledgesdk.KnowledgeCollaborationEvents{SessionID: session.ID, AfterClock: session.ServerClock, WaitMillis: 2500}, bob)
		streamErr <- waitErr
	}()
	if _, err = store.RemoveKnowledgeLibraryMember(t.Context(), library.ID, bob.UserID, library.Revision, authority); err != nil {
		t.Fatal(err)
	}
	select {
	case err = <-streamErr:
		if err == nil || !strings.Contains(err.Error(), "collaboration_session_revoked") && !strings.Contains(err.Error(), "library_not_found") {
			t.Fatalf("revoked event wait returned %v", err)
		}
	case <-ctx.Done():
		t.Fatal("membership revocation did not wake the existing event wait")
	}
}

func TestKnowledgePageLiveEventsWakeForReadersAndCloseOnRevocation(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	page = savePageFixture(t, store, authority, library, page, "live-reader-save", "实时引用", "已发布内容")
	page = publishPageFixture(t, store, authority, library, page, "live-reader-publish")
	bob := authority
	bob.UserID = "live-reader-bob"
	var err error
	library, err = store.SetKnowledgeLibraryMember(t.Context(), library.ID, bob.UserID, agentsdk.KnowledgeLibraryMemberWrite{Role: "reader", ExpectedRevision: library.Revision}, authority)
	if err != nil {
		t.Fatal(err)
	}
	initial, err := store.KnowledgePageLiveEvents(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageLiveEvents{AfterRevision: page.Page.Revision}, bob)
	if err != nil || len(initial.Events) != 1 || initial.Events[0].Type != knowledgesdk.KnowledgePageLiveEventHeartbeat {
		t.Fatalf("unexpected initial live event: batch=%+v err=%v", initial, err)
	}
	ctx, cancel := context.WithTimeout(t.Context(), 3*time.Second)
	defer cancel()
	changed := make(chan knowledgesdk.KnowledgePageLiveEventBatch, 1)
	errors := make(chan error, 1)
	go func() {
		batch, waitErr := store.KnowledgePageLiveEvents(ctx, library.ID, page.Page.ID, knowledgesdk.KnowledgePageLiveEvents{AfterRevision: initial.Revision, WaitMillis: 2500}, bob)
		if waitErr != nil {
			errors <- waitErr
			return
		}
		changed <- batch
	}()
	page = savePageFixture(t, store, authority, library, page, "live-reader-draft", "实时引用", "更新中的草稿")
	select {
	case waitErr := <-errors:
		t.Fatal(waitErr)
	case batch := <-changed:
		if len(batch.Events) != 1 || batch.Events[0].Type != knowledgesdk.KnowledgePageLiveEventChanged || batch.Events[0].PageID != page.Page.ID {
			t.Fatalf("page change did not produce a content-free signal: %+v", batch)
		}
	case <-ctx.Done():
		t.Fatal("page live event did not wake after a page change")
	}

	revoked := make(chan error, 1)
	go func() {
		_, waitErr := store.KnowledgePageLiveEvents(ctx, library.ID, page.Page.ID, knowledgesdk.KnowledgePageLiveEvents{AfterRevision: page.Page.Revision, WaitMillis: 2500}, bob)
		revoked <- waitErr
	}()
	if _, err = store.RemoveKnowledgeLibraryMember(t.Context(), library.ID, bob.UserID, library.Revision, authority); err != nil {
		t.Fatal(err)
	}
	select {
	case waitErr := <-revoked:
		if waitErr == nil || !strings.Contains(waitErr.Error(), "library_not_found") {
			t.Fatalf("revoked page live wait returned %v", waitErr)
		}
	case <-ctx.Done():
		t.Fatal("membership revocation did not close the page live wait")
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

func TestKnowledgeCollaborationCloseIsIdempotentAfterRevocation(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	session := connectCollaborationFixture(t, store, library.ID, page.Page.ID, "close-idempotent", authority)
	_ = savePageFixture(t, store, authority, library, page, "external-save-before-close", "外部保存", "替换正文")

	if err := store.CloseKnowledgeCollaboration(t.Context(), library.ID, page.Page.ID, session.ID, authority); err != nil {
		t.Fatalf("close after revocation must be idempotent: %v", err)
	}
	if err := store.CloseKnowledgeCollaboration(t.Context(), library.ID, page.Page.ID, session.ID, authority); err != nil {
		t.Fatalf("repeated close must be idempotent: %v", err)
	}
	if err := store.CloseKnowledgeCollaboration(t.Context(), library.ID, page.Page.ID, "kcollab_missing", authority); err != nil {
		t.Fatalf("close of an already-pruned session must be idempotent: %v", err)
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
