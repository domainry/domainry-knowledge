package store

import (
	"bytes"
	"compress/gzip"
	"context"
	"database/sql"
	"encoding/base64"
	"io"
	"sort"
	"strings"
	"time"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-orm/query"
)

const (
	knowledgeCollaborationLease                  = 30 * time.Second
	knowledgeCollaborationMaximumWait            = 15 * time.Second
	knowledgeCollaborationRetainedEvents         = int64(256)
	knowledgeCollaborationMaximumUpdateBytes     = knowledgePageMaximumBytes
	knowledgeCollaborationMaximumStateBytes      = knowledgePageMaximumBytes * 4
	knowledgeCollaborationMaximumCheckpointBytes = knowledgeCollaborationMaximumStateBytes + 64*1024
	knowledgeCollaborationMaximumAwarenessBytes  = 64 * 1024
	knowledgeCollaborationCheckpointInterval     = int64(32)
	knowledgeCollaborationCheckpointBytes        = int64(2 * knowledgePageMaximumBytes)
	knowledgeCollaborationMaximumEditedBlocks    = 2048
)

func knowledgeCollaborationLibraryNotifierKey(a agentsdk.Authority, libraryID string) string {
	return libraryScope(a) + ":library:" + libraryID
}

func knowledgeCollaborationPageNotifierKey(a agentsdk.Authority, libraryID, pageID string) string {
	return libraryScope(a) + ":page:" + libraryID + ":" + pageID
}

func (s *Store) notifyKnowledgeCollaboration(ctx context.Context, a agentsdk.Authority, libraryID, pageID string) {
	keys := []string{knowledgeCollaborationLibraryNotifierKey(a, libraryID)}
	if pageID != "" {
		keys = append(keys, knowledgeCollaborationPageNotifierKey(a, libraryID, pageID))
	}
	s.collaboration.notify(ctx, keys...)
}

type knowledgeCollaborationSessionRecord struct {
	ID, LibraryID, PageID, ClientID, UserID string
	State                                   string
	ServerClock                             int64
	LeaseUntilMillis, LastSeenMillis        int64
	CursorBlockID, SelectionBlockID         string
	AwarenessUpdate                         string
	EditedBlockIDs                          []string
}

type knowledgeCollaborationUpdateRecord struct {
	Clock       int64
	SessionID   string
	UserID      string
	RequestHash string
	Update      knowledgeCollaborationDurableUpdate
}

type knowledgeCollaborationDurableUpdate struct {
	ClientID       string
	UpdateID       string
	Title          *string
	YjsUpdate      string
	Content        string
	ContentSHA256  string
	EditedBlockIDs []string
}

func durableKnowledgeCollaborationUpdate(update knowledgesdk.KnowledgeCollaborationUpdate) knowledgeCollaborationDurableUpdate {
	return knowledgeCollaborationDurableUpdate{
		ClientID: update.ClientID, UpdateID: update.UpdateID, Title: update.Title, YjsUpdate: update.YjsUpdate,
		Content: update.Content, ContentSHA256: update.ContentSHA256, EditedBlockIDs: append([]string(nil), update.EditedBlockIDs...),
	}
}

func (update knowledgeCollaborationDurableUpdate) api() knowledgesdk.KnowledgeCollaborationUpdate {
	return knowledgesdk.KnowledgeCollaborationUpdate{
		ClientID: update.ClientID, UpdateID: update.UpdateID, Title: update.Title, YjsUpdate: update.YjsUpdate,
		Content: update.Content, ContentSHA256: update.ContentSHA256, EditedBlockIDs: append([]string(nil), update.EditedBlockIDs...),
	}
}

type knowledgeCollaborationSnapshotRecord struct {
	Snapshot     knowledgesdk.KnowledgeCollaborationSnapshot `json:"snapshot"`
	YjsStateGzip string                                      `json:"yjs_state_gzip,omitempty"`
}

func knowledgeCollaborationSessionScope(a agentsdk.Authority, sessionID string) query.Predicate {
	return query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("session_id", sessionID))
}

func validateKnowledgeCollaborationClientID(value string) bool {
	return value != "seed" && personalMemoryKey(value) && len(value) <= 64
}

func validKnowledgeCollaborationBlockID(value string) bool {
	return value == "" || knowledgeBlockIDPattern.MatchString(value)
}

func decodeKnowledgeCollaborationBinary(value string, maximum int, required bool) error {
	if value == "" {
		if required {
			return conversationError("bad_request", "collaboration_binary_missing")
		}
		return nil
	}
	if len(value) > base64.StdEncoding.EncodedLen(maximum) {
		return conversationError("bad_request", "collaboration_binary_too_large")
	}
	decoded, err := base64.StdEncoding.DecodeString(value)
	if err != nil || len(decoded) == 0 || len(decoded) > maximum {
		return conversationError("bad_request", "collaboration_binary_invalid")
	}
	return nil
}

func knowledgeCollaborationBinaryBytes(value string) int64 {
	decoded, err := base64.StdEncoding.DecodeString(value)
	if err != nil {
		return 0
	}
	return int64(len(decoded))
}

func durableKnowledgeCollaborationSnapshot(snapshot knowledgesdk.KnowledgeCollaborationSnapshot) (knowledgeCollaborationSnapshotRecord, time.Duration, int64, error) {
	record := knowledgeCollaborationSnapshotRecord{Snapshot: snapshot}
	if snapshot.YjsState == "" {
		return record, 0, 0, nil
	}
	raw, err := base64.StdEncoding.DecodeString(snapshot.YjsState)
	if err != nil || len(raw) == 0 || len(raw) > knowledgeCollaborationMaximumStateBytes {
		return record, 0, 0, conversationError("internal", "collaboration_checkpoint_invalid")
	}
	started := time.Now()
	var compressed bytes.Buffer
	writer := gzip.NewWriter(&compressed)
	if _, err = writer.Write(raw); err == nil {
		err = writer.Close()
	} else {
		_ = writer.Close()
	}
	duration := time.Since(started)
	if err != nil {
		return record, duration, 0, err
	}
	record.Snapshot.YjsState = ""
	record.YjsStateGzip = base64.StdEncoding.EncodeToString(compressed.Bytes())
	return record, duration, int64(compressed.Len()), nil
}

func restoreKnowledgeCollaborationSnapshot(record knowledgeCollaborationSnapshotRecord) (knowledgesdk.KnowledgeCollaborationSnapshot, error) {
	snapshot := record.Snapshot
	if record.YjsStateGzip == "" {
		if snapshot.YjsState != "" {
			return snapshot, conversationError("internal", "collaboration_checkpoint_encoding_invalid")
		}
		return snapshot, nil
	}
	if snapshot.YjsState != "" {
		return snapshot, conversationError("internal", "collaboration_checkpoint_encoding_invalid")
	}
	compressed, err := base64.StdEncoding.DecodeString(record.YjsStateGzip)
	if err != nil || len(compressed) == 0 || len(compressed) > knowledgeCollaborationMaximumCheckpointBytes {
		return snapshot, conversationError("internal", "collaboration_checkpoint_encoding_invalid")
	}
	reader, err := gzip.NewReader(bytes.NewReader(compressed))
	if err != nil {
		return snapshot, conversationError("internal", "collaboration_checkpoint_encoding_invalid")
	}
	raw, readErr := io.ReadAll(io.LimitReader(reader, int64(knowledgeCollaborationMaximumStateBytes)+1))
	closeErr := reader.Close()
	if readErr != nil || closeErr != nil || len(raw) == 0 || len(raw) > knowledgeCollaborationMaximumStateBytes {
		return snapshot, conversationError("internal", "collaboration_checkpoint_encoding_invalid")
	}
	snapshot.YjsState = base64.StdEncoding.EncodeToString(raw)
	return snapshot, nil
}

func initialKnowledgeCollaborationSnapshot(pageID string, draft knowledgesdk.KnowledgePageDraft, clock int64) knowledgesdk.KnowledgeCollaborationSnapshot {
	snapshot := knowledgesdk.KnowledgeCollaborationSnapshot{
		PageID: pageID, DraftRevision: draft.DraftRevision, ServerClock: clock,
		Title: draft.Title, Content: draft.Body.Content, ContentSHA256: draft.Body.ContentSHA256,
	}
	if draft.ContentType != knowledgesdk.KnowledgePageTypeDocument {
		snapshot.YjsStateClock = clock
	}
	return snapshot
}

func validateKnowledgeCollaborationUpdate(update knowledgesdk.KnowledgeCollaborationUpdate) (knowledgesdk.PageContent, error) {
	if !validateKnowledgeCollaborationClientID(update.ClientID) || !personalMemoryKey(update.UpdateID) || len(update.EditedBlockIDs) > knowledgeCollaborationMaximumEditedBlocks {
		return knowledgesdk.PageContent{}, conversationError("bad_request", "collaboration_update_invalid")
	}
	if update.Title != nil && !executionText(*update.Title, 256, true) {
		return knowledgesdk.PageContent{}, conversationError("bad_request", "collaboration_title_invalid")
	}
	if err := decodeKnowledgeCollaborationBinary(update.YjsUpdate, knowledgeCollaborationMaximumUpdateBytes, true); err != nil {
		return knowledgesdk.PageContent{}, err
	}
	if err := decodeKnowledgeCollaborationBinary(update.YjsState, knowledgeCollaborationMaximumStateBytes, false); err != nil {
		return knowledgesdk.PageContent{}, err
	}
	seen := map[string]bool{}
	for _, blockID := range update.EditedBlockIDs {
		if !validKnowledgeCollaborationBlockID(blockID) || blockID == "" || seen[blockID] {
			return knowledgesdk.PageContent{}, conversationError("bad_request", "collaboration_block_invalid")
		}
		seen[blockID] = true
	}
	return normalizedPageContent(knowledgesdk.PageContentSchemaVersion, update.Content, update.ContentSHA256)
}

func mergeKnowledgeCollaborationBlockIDs(current, changed []string) []string {
	seen := make(map[string]bool, len(current)+len(changed))
	for _, value := range append(append([]string(nil), current...), changed...) {
		if value != "" {
			seen[value] = true
		}
	}
	out := make([]string, 0, len(seen))
	for value := range seen {
		out = append(out, value)
	}
	sort.Strings(out)
	return out
}

func (s *Store) authorizeKnowledgeCollaboration(ctx context.Context, tx *sql.Tx, libraryID, pageID string, a agentsdk.Authority) (agentsdk.KnowledgeLibrary, knowledgesdk.KnowledgePage, knowledgesdk.KnowledgePageDraft, error) {
	library, err := s.libraryRecord(ctx, tx, libraryID, a)
	if err != nil {
		return library, knowledgesdk.KnowledgePage{}, knowledgesdk.KnowledgePageDraft{}, err
	}
	if err = requirePageWriting(library); err != nil {
		return library, knowledgesdk.KnowledgePage{}, knowledgesdk.KnowledgePageDraft{}, err
	}
	page, err := s.pageRecord(ctx, tx, libraryID, pageID, a)
	if err != nil || page.State != "active" {
		return library, page, knowledgesdk.KnowledgePageDraft{}, conversationError("not_found", "page_not_found")
	}
	switch page.ContentType {
	case knowledgesdk.KnowledgePageTypeDocument,
		knowledgesdk.KnowledgePageTypeWhiteboard,
		knowledgesdk.KnowledgePageTypeMindMap,
		knowledgesdk.KnowledgePageTypeFlowchart:
	default:
		return library, page, knowledgesdk.KnowledgePageDraft{}, conversationError("conflict", "page_collaboration_type_unsupported")
	}
	effective, err := s.evaluateKnowledgePageAccess(ctx, tx, libraryID, pageID, a)
	if err != nil || !effective.Allowed || roleLevel(effective.Role) < roleLevel("editor") {
		return library, page, knowledgesdk.KnowledgePageDraft{}, conversationError("not_found", "page_not_found")
	}
	draft, found, err := s.pageDraft(ctx, tx, pageID, a)
	if err != nil {
		return library, page, draft, err
	}
	if !found {
		return library, page, draft, conversationError("conflict", "page_draft_missing")
	}
	return library, page, draft, nil
}

func (s *Store) knowledgeCollaborationSnapshot(ctx context.Context, tx *sql.Tx, pageID string, draft knowledgesdk.KnowledgePageDraft, a agentsdk.Authority) (knowledgesdk.KnowledgeCollaborationSnapshot, knowledgeCollaborationSnapshotRecord, bool, error) {
	var record knowledgeCollaborationSnapshotRecord
	found, err := s.executionRead(ctx, tx, knowledgePageCollaborationSnapshotTable, pageScope(a, pageID), &record)
	if err != nil {
		return knowledgesdk.KnowledgeCollaborationSnapshot{}, record, false, err
	}
	var snapshot knowledgesdk.KnowledgeCollaborationSnapshot
	if found {
		snapshot, err = restoreKnowledgeCollaborationSnapshot(record)
		if err != nil {
			return snapshot, record, false, err
		}
	}
	if !found || snapshot.PageID != pageID || snapshot.DraftRevision != draft.DraftRevision || snapshot.Title != draft.Title || snapshot.ContentSHA256 != draft.Body.ContentSHA256 {
		clock := snapshot.ServerClock
		if found {
			clock++
		}
		snapshot = initialKnowledgeCollaborationSnapshot(pageID, draft, clock)
		record, _, _, err = durableKnowledgeCollaborationSnapshot(snapshot)
		if err != nil {
			return snapshot, record, false, err
		}
		if found {
			q, args, buildErr := query.NewUpdateBuilder(s.store.Renderer(), knowledgePageCollaborationSnapshotTable).Set("draft_revision", snapshot.DraftRevision).Set("server_clock", snapshot.ServerClock).Set("payload_json", conversationJSON(record)).Where(pageScope(a, pageID)).Build()
			if err = conversationExec(ctx, tx, q, args, buildErr); err != nil {
				return snapshot, record, false, err
			}
		} else {
			q, args, buildErr := query.NewInsertBuilder(s.store.Renderer(), knowledgePageCollaborationSnapshotTable).Columns("scope_key", "page_id", "library_id", "draft_revision", "server_clock", "payload_json").Values(libraryScope(a), pageID, draft.LibraryID, snapshot.DraftRevision, snapshot.ServerClock, conversationJSON(record)).Build()
			if err = conversationExec(ctx, tx, q, args, buildErr); err != nil {
				return snapshot, record, false, err
			}
		}
		q, args, buildErr := query.NewDeleteBuilder(s.store.Renderer(), knowledgePageCollaborationUpdateTable).Where(pageScope(a, pageID)).Build()
		if err = conversationExec(ctx, tx, q, args, buildErr); err != nil {
			return snapshot, record, false, err
		}
	}
	return snapshot, record, found, nil
}

func (s *Store) knowledgeCollaborationClientSnapshot(ctx context.Context, tx *sql.Tx, pageID string, snapshot knowledgesdk.KnowledgeCollaborationSnapshot, a agentsdk.Authority) (knowledgesdk.KnowledgeCollaborationSnapshot, error) {
	snapshot.YjsUpdates = nil
	if snapshot.YjsStateClock < 0 || snapshot.YjsStateClock > snapshot.ServerClock {
		return snapshot, conversationError("internal", "collaboration_checkpoint_invalid")
	}
	if snapshot.YjsStateClock == snapshot.ServerClock {
		return snapshot, nil
	}
	q, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgePageCollaborationUpdateTable).Columns("payload_json").Where(query.And(pageScope(a, pageID), query.GreaterThan("clock", snapshot.YjsStateClock))).OrderBy(query.Ascending("clock")).Limit(int(knowledgeCollaborationRetainedEvents) + 1).Build()
	if err != nil {
		return snapshot, err
	}
	rows, err := tx.QueryContext(ctx, q, args...)
	if err != nil {
		return snapshot, err
	}
	defer rows.Close()
	expected := snapshot.YjsStateClock + 1
	for rows.Next() {
		var raw []byte
		if err = rows.Scan(&raw); err != nil {
			return snapshot, err
		}
		var record knowledgeCollaborationUpdateRecord
		if err = unmarshalDurableJSON(raw, &record); err != nil {
			return snapshot, err
		}
		if record.Clock != expected || record.Update.YjsUpdate == "" {
			return snapshot, conversationError("internal", "collaboration_checkpoint_gap")
		}
		snapshot.YjsUpdates = append(snapshot.YjsUpdates, knowledgesdk.KnowledgeCollaborationYjsUpdate{Clock: record.Clock, UpdateID: record.Update.UpdateID, YjsUpdate: record.Update.YjsUpdate})
		expected++
	}
	if err = rows.Err(); err != nil {
		return snapshot, err
	}
	if expected != snapshot.ServerClock+1 || len(snapshot.YjsUpdates) > int(knowledgeCollaborationRetainedEvents) {
		return snapshot, conversationError("internal", "collaboration_checkpoint_gap")
	}
	return snapshot, nil
}

func collaborationSessionAPI(record knowledgeCollaborationSessionRecord, snapshot knowledgesdk.KnowledgeCollaborationSnapshot, presence []knowledgesdk.KnowledgeCollaborationPresence) knowledgesdk.KnowledgeCollaborationSession {
	return knowledgesdk.KnowledgeCollaborationSession{
		ID: record.ID, LibraryID: record.LibraryID, PageID: record.PageID, ClientID: record.ClientID, UserID: record.UserID,
		State: record.State, ServerClock: snapshot.ServerClock, ExpiresAt: durableTime(record.LeaseUntilMillis), Snapshot: snapshot, Presence: presence,
	}
}

func (s *Store) knowledgeCollaborationPresence(ctx context.Context, tx *sql.Tx, pageID string, now time.Time, a agentsdk.Authority) ([]knowledgesdk.KnowledgeCollaborationPresence, error) {
	q, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgePageCollaborationSessionTable).Columns("payload_json").Where(query.And(pageScope(a, pageID), query.Equal("state", "connected"), query.GreaterThan("lease_until", now.UnixMilli()))).OrderBy(query.Ascending("session_id")).Limit(1000).Build()
	if err != nil {
		return nil, err
	}
	rows, err := tx.QueryContext(ctx, q, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := []knowledgesdk.KnowledgeCollaborationPresence{}
	for rows.Next() {
		var raw []byte
		if err = rows.Scan(&raw); err != nil {
			return nil, err
		}
		var record knowledgeCollaborationSessionRecord
		if err = unmarshalDurableJSON(raw, &record); err != nil {
			return nil, err
		}
		out = append(out, knowledgesdk.KnowledgeCollaborationPresence{
			SessionID: record.ID, UserID: record.UserID, AwarenessUpdate: record.AwarenessUpdate, CursorBlockID: record.CursorBlockID,
			SelectionBlockID: record.SelectionBlockID, EditedBlocks: len(record.EditedBlockIDs), LastSeenAt: durableTime(record.LastSeenMillis),
		})
	}
	return out, rows.Err()
}

func (s *Store) ConnectKnowledgeCollaboration(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgeCollaborationConnect, a agentsdk.Authority) (out knowledgesdk.KnowledgeCollaborationSession, err error) {
	if !validateKnowledgeCollaborationClientID(input.ClientID) || conversationAuthority(a) != nil {
		return out, conversationError("bad_request", "collaboration_connect_invalid")
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		_, _, draft, authorizeErr := s.authorizeKnowledgeCollaboration(ctx, tx, libraryID, pageID, a)
		if authorizeErr != nil {
			return authorizeErr
		}
		snapshot, _, _, readErr := s.knowledgeCollaborationSnapshot(ctx, tx, pageID, draft, a)
		if readErr != nil {
			return readErr
		}
		clientSnapshot, readErr := s.knowledgeCollaborationClientSnapshot(ctx, tx, pageID, snapshot, a)
		if readErr != nil {
			return readErr
		}
		now := time.Now().UTC().Truncate(time.Millisecond)
		sessionID, readErr := randomKnowledgeID("kcollab_")
		if readErr != nil {
			return readErr
		}
		record := knowledgeCollaborationSessionRecord{ID: sessionID, LibraryID: libraryID, PageID: pageID, ClientID: input.ClientID, UserID: a.UserID, State: "connected", ServerClock: snapshot.ServerClock, LeaseUntilMillis: now.Add(knowledgeCollaborationLease).UnixMilli(), LastSeenMillis: now.UnixMilli()}
		q, args, buildErr := query.NewInsertBuilder(s.store.Renderer(), knowledgePageCollaborationSessionTable).Columns("scope_key", "session_id", "library_id", "page_id", "user_id", "client_id", "state", "lease_until", "server_clock", "payload_json").Values(libraryScope(a), sessionID, libraryID, pageID, a.UserID, input.ClientID, record.State, record.LeaseUntilMillis, record.ServerClock, conversationJSON(record)).Build()
		if readErr = conversationExec(ctx, tx, q, args, buildErr); readErr != nil {
			return readErr
		}
		presence, readErr := s.knowledgeCollaborationPresence(ctx, tx, pageID, now, a)
		if readErr != nil {
			return readErr
		}
		out = collaborationSessionAPI(record, clientSnapshot, presence)
		return nil
	})
	if err == nil {
		s.collaborationMetrics.recordSnapshot(ctx, knowledgeCollaborationSnapshotSize(out.Snapshot))
		s.collaborationMetrics.recordOnlineUsers(ctx, knowledgeCollaborationUniqueUsers(out.Presence))
		s.notifyKnowledgeCollaboration(ctx, a, libraryID, pageID)
	}
	return
}

func (s *Store) collaborationSession(ctx context.Context, tx *sql.Tx, libraryID, pageID, sessionID string, a agentsdk.Authority) (knowledgeCollaborationSessionRecord, error) {
	var record knowledgeCollaborationSessionRecord
	if !personalMemoryKey(sessionID) {
		return record, conversationError("bad_request", "collaboration_session_invalid")
	}
	found, err := s.executionRead(ctx, tx, knowledgePageCollaborationSessionTable, knowledgeCollaborationSessionScope(a, sessionID), &record)
	if err != nil {
		return record, err
	}
	if !found || record.LibraryID != libraryID || record.PageID != pageID || record.UserID != a.UserID {
		return record, conversationError("not_found", "collaboration_session_not_found")
	}
	if record.State != "connected" {
		return record, conversationError("forbidden", "collaboration_session_revoked")
	}
	if record.LeaseUntilMillis <= time.Now().UTC().UnixMilli() {
		return record, conversationError("conflict", "collaboration_session_expired")
	}
	return record, nil
}

func (s *Store) collaborationEvents(ctx context.Context, tx *sql.Tx, pageID string, afterClock int64, snapshot knowledgesdk.KnowledgeCollaborationSnapshot, a agentsdk.Authority) ([]knowledgesdk.KnowledgeCollaborationUpdateEvent, error) {
	if afterClock >= snapshot.ServerClock {
		return nil, nil
	}
	q, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgePageCollaborationUpdateTable).Columns("payload_json").Where(query.And(pageScope(a, pageID), query.GreaterThan("clock", afterClock))).OrderBy(query.Ascending("clock")).Limit(int(knowledgeCollaborationRetainedEvents) + 1).Build()
	if err != nil {
		return nil, err
	}
	rows, err := tx.QueryContext(ctx, q, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	updates := []knowledgeCollaborationUpdateRecord{}
	for rows.Next() {
		var raw []byte
		if err = rows.Scan(&raw); err != nil {
			return nil, err
		}
		var update knowledgeCollaborationUpdateRecord
		if err = unmarshalDurableJSON(raw, &update); err != nil {
			return nil, err
		}
		updates = append(updates, update)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	if len(updates) == 0 || updates[0].Clock != afterClock+1 || len(updates) > int(knowledgeCollaborationRetainedEvents) {
		copySnapshot, snapshotErr := s.knowledgeCollaborationClientSnapshot(ctx, tx, pageID, snapshot, a)
		if snapshotErr != nil {
			return nil, snapshotErr
		}
		return []knowledgesdk.KnowledgeCollaborationUpdateEvent{{Clock: snapshot.ServerClock, Snapshot: &copySnapshot}}, nil
	}
	events := make([]knowledgesdk.KnowledgeCollaborationUpdateEvent, 0, len(updates))
	for _, update := range updates {
		copyUpdate := update.Update.api()
		events = append(events, knowledgesdk.KnowledgeCollaborationUpdateEvent{Clock: update.Clock, UserID: update.UserID, Update: &copyUpdate})
	}
	return events, nil
}

func (s *Store) SyncKnowledgeCollaboration(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgeCollaborationSync, a agentsdk.Authority) (out knowledgesdk.KnowledgeCollaborationSyncResult, err error) {
	if input.AfterClock < 0 || !validKnowledgeCollaborationBlockID(input.CursorBlockID) || !validKnowledgeCollaborationBlockID(input.SelectionBlockID) {
		return out, conversationError("bad_request", "collaboration_sync_invalid")
	}
	if err = decodeKnowledgeCollaborationBinary(input.AwarenessUpdate, knowledgeCollaborationMaximumAwarenessBytes, false); err != nil {
		return out, err
	}
	acceptedUpdate := false
	acceptedUpdateBytes, acceptedSnapshotBytes, acceptedCompressedBytes := int64(0), int64(-1), int64(0)
	acceptedLatency := time.Duration(-1)
	compressionDuration := time.Duration(0)
	onlineUsers := int64(-1)
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		_, page, draft, authorizeErr := s.authorizeKnowledgeCollaboration(ctx, tx, libraryID, pageID, a)
		if authorizeErr != nil {
			return authorizeErr
		}
		record, readErr := s.collaborationSession(ctx, tx, libraryID, pageID, input.SessionID, a)
		if readErr != nil {
			return readErr
		}
		snapshot, durableSnapshot, _, readErr := s.knowledgeCollaborationSnapshot(ctx, tx, pageID, draft, a)
		if readErr != nil {
			return readErr
		}
		if input.Update != nil {
			if page.ContentType != knowledgesdk.KnowledgePageTypeDocument {
				return conversationError("conflict", "page_collaboration_update_unsupported")
			}
			if input.Update.ClientID != record.ClientID {
				return conversationError("forbidden", "collaboration_client_mismatch")
			}
			var replay knowledgeCollaborationUpdateRecord
			found, duplicateErr := s.executionRead(ctx, tx, knowledgePageCollaborationUpdateTable, query.And(pageScope(a, pageID), query.Equal("update_id", input.Update.UpdateID)), &replay)
			if duplicateErr != nil {
				return duplicateErr
			}
			if found {
				if replay.Update.ClientID != input.Update.ClientID || replay.RequestHash != conversationHash(*input.Update) {
					return conversationError("conflict", "collaboration_update_conflict")
				}
				out.Applied = true
			} else if input.AfterClock == snapshot.ServerClock {
				body, validationErr := validateKnowledgeCollaborationUpdate(*input.Update)
				if validationErr != nil {
					return validationErr
				}
				blockChanges, diffErr := knowledgeDocumentBlockChanges(snapshot.Content, body.Content)
				if diffErr != nil {
					return conversationError("bad_request", "collaboration_content_diff_invalid")
				}
				if readErr = s.replaceKnowledgePageReferences(ctx, tx, libraryID, pageID, body.Content, a); readErr != nil {
					return readErr
				}
				titleBefore := draft.Title
				nextClock := snapshot.ServerClock + 1
				updateBytes := knowledgeCollaborationBinaryBytes(input.Update.YjsUpdate)
				checkpointDue := snapshot.YjsState == "" || nextClock-snapshot.YjsStateClock >= knowledgeCollaborationCheckpointInterval || snapshot.YjsUpdateBytes+updateBytes >= knowledgeCollaborationCheckpointBytes
				if checkpointDue && input.Update.YjsState == "" {
					return conversationError("conflict", "collaboration_checkpoint_required")
				}
				now := time.Now().UTC().Truncate(time.Millisecond)
				draft.DraftRevision++
				if input.Update.Title != nil {
					draft.Title = strings.TrimSpace(*input.Update.Title)
				}
				draft.Body, draft.UpdatedByUserID, draft.UpdatedAt = body, a.UserID, now
				record.EditedBlockIDs = mergeKnowledgeCollaborationBlockIDs(record.EditedBlockIDs, input.Update.EditedBlockIDs)
				snapshot.DraftRevision, snapshot.ServerClock = draft.DraftRevision, nextClock
				snapshot.Title, snapshot.Content, snapshot.ContentSHA256 = draft.Title, body.Content, body.ContentSHA256
				if input.Update.YjsState != "" {
					snapshot.YjsState, snapshot.YjsStateClock = input.Update.YjsState, snapshot.ServerClock
					snapshot.YjsUpdateBytes = 0
					durableSnapshot, compressionDuration, acceptedCompressedBytes, readErr = durableKnowledgeCollaborationSnapshot(snapshot)
					if readErr != nil {
						return readErr
					}
				} else {
					snapshot.YjsUpdateBytes += updateBytes
					durableSnapshot.Snapshot = snapshot
					durableSnapshot.Snapshot.YjsState = ""
				}
				q, args, buildErr := query.NewUpdateBuilder(s.store.Renderer(), knowledgePageDraftTable).Set("draft_revision", draft.DraftRevision).Set("updated_at", now.UnixMilli()).Set("last_request_key", "collaboration:"+input.Update.UpdateID).Set("last_request_hash", conversationHash(*input.Update)).Set("payload_json", conversationJSON(draft)).Where(query.And(pageScope(a, pageID), query.Equal("draft_revision", draft.DraftRevision-1))).Build()
				if readErr = conversationCAS(ctx, tx, q, args, buildErr); readErr != nil {
					return conversationError("conflict", "page_draft_revision_conflict")
				}
				q, args, buildErr = query.NewUpdateBuilder(s.store.Renderer(), knowledgePageCollaborationSnapshotTable).Set("draft_revision", snapshot.DraftRevision).Set("server_clock", snapshot.ServerClock).Set("payload_json", conversationJSON(durableSnapshot)).Where(pageScope(a, pageID)).Build()
				if readErr = conversationExec(ctx, tx, q, args, buildErr); readErr != nil {
					return readErr
				}
				updateRecord := knowledgeCollaborationUpdateRecord{Clock: snapshot.ServerClock, SessionID: record.ID, UserID: a.UserID, RequestHash: conversationHash(*input.Update), Update: durableKnowledgeCollaborationUpdate(*input.Update)}
				q, args, buildErr = query.NewInsertBuilder(s.store.Renderer(), knowledgePageCollaborationUpdateTable).Columns("scope_key", "page_id", "clock", "update_id", "session_id", "user_id", "payload_json").Values(libraryScope(a), pageID, snapshot.ServerClock, input.Update.UpdateID, record.ID, a.UserID, conversationJSON(updateRecord)).Build()
				if readErr = conversationExec(ctx, tx, q, args, buildErr); readErr != nil {
					return readErr
				}
				storedChanges := blockChanges
				if len(storedChanges) > knowledgePageEditHistoryMaximumChanges {
					storedChanges = storedChanges[:knowledgePageEditHistoryMaximumChanges]
				}
				history := knowledgesdk.KnowledgePageEditHistoryEntry{
					Clock: snapshot.ServerClock, DraftRevision: draft.DraftRevision, UserID: a.UserID,
					TitleChanged: titleBefore != draft.Title, ChangedBlockCount: len(blockChanges), Changes: storedChanges,
					Truncated: len(storedChanges) != len(blockChanges), CreatedAt: now,
				}
				if readErr = s.insertKnowledgePageEditHistory(ctx, tx, pageID, history, a); readErr != nil {
					return readErr
				}
				if snapshot.ServerClock > knowledgeCollaborationRetainedEvents {
					q, args, buildErr = query.NewDeleteBuilder(s.store.Renderer(), knowledgePageCollaborationUpdateTable).Where(query.And(pageScope(a, pageID), query.LessThanOrEqual("clock", snapshot.ServerClock-knowledgeCollaborationRetainedEvents))).Build()
					if readErr = conversationExec(ctx, tx, q, args, buildErr); readErr != nil {
						return readErr
					}
				}
				page.UpdatedAt, page.UpdatedByUserID = now, a.UserID
				page.Title = draft.Title
				q, args, buildErr = query.NewUpdateBuilder(s.store.Renderer(), knowledgePageTable).Set("updated_at", now.UnixMilli()).Set("payload_json", conversationJSON(page)).Where(pageScope(a, pageID)).Build()
				if readErr = conversationExec(ctx, tx, q, args, buildErr); readErr != nil {
					return readErr
				}
				if readErr = s.replaceKnowledgePageName(ctx, tx, libraryID, pageID, knowledgePageNameDraftTitle, page.Title, a); readErr != nil {
					return readErr
				}
				acceptedUpdate = true
				acceptedUpdateBytes = updateBytes
				acceptedSnapshotBytes = knowledgeCollaborationSnapshotSize(snapshot)
				if !input.Update.ClientCreatedAt.IsZero() {
					candidate := now.Sub(input.Update.ClientCreatedAt)
					if candidate >= 0 && candidate <= 24*time.Hour {
						acceptedLatency = candidate
					}
				}
				out.Applied = true
			}
		}
		now := time.Now().UTC().Truncate(time.Millisecond)
		record.ServerClock, record.LeaseUntilMillis, record.LastSeenMillis = snapshot.ServerClock, now.Add(knowledgeCollaborationLease).UnixMilli(), now.UnixMilli()
		record.CursorBlockID, record.SelectionBlockID = input.CursorBlockID, input.SelectionBlockID
		if input.AwarenessUpdate != "" {
			record.AwarenessUpdate = input.AwarenessUpdate
		}
		q, args, buildErr := query.NewUpdateBuilder(s.store.Renderer(), knowledgePageCollaborationSessionTable).Set("lease_until", record.LeaseUntilMillis).Set("server_clock", record.ServerClock).Set("payload_json", conversationJSON(record)).Where(query.And(knowledgeCollaborationSessionScope(a, record.ID), query.Equal("state", "connected"))).Build()
		if readErr = conversationExec(ctx, tx, q, args, buildErr); readErr != nil {
			return readErr
		}
		presence, readErr := s.knowledgeCollaborationPresence(ctx, tx, pageID, now, a)
		if readErr != nil {
			return readErr
		}
		clientSnapshot, snapshotErr := s.knowledgeCollaborationClientSnapshot(ctx, tx, pageID, snapshot, a)
		if snapshotErr != nil {
			return snapshotErr
		}
		out.Session = collaborationSessionAPI(record, clientSnapshot, presence)
		onlineUsers = knowledgeCollaborationUniqueUsers(presence)
		out.Events, readErr = s.collaborationEvents(ctx, tx, pageID, input.AfterClock, snapshot, a)
		out.Complete = true
		return readErr
	})
	if err == nil {
		if onlineUsers >= 0 {
			s.collaborationMetrics.recordOnlineUsers(ctx, onlineUsers)
		}
		if acceptedUpdate {
			s.collaborationMetrics.recordUpdate(ctx, acceptedUpdateBytes, acceptedLatency, acceptedSnapshotBytes, compressionDuration, acceptedCompressedBytes)
		}
		s.notifyKnowledgeCollaboration(ctx, a, libraryID, pageID)
	}
	return
}

func collaborationServerEvents(events []knowledgesdk.KnowledgeCollaborationUpdateEvent, presence []knowledgesdk.KnowledgeCollaborationPresence, clock int64, includePresence bool) []knowledgesdk.KnowledgeCollaborationServerEvent {
	out := make([]knowledgesdk.KnowledgeCollaborationServerEvent, 0, len(events)+1)
	for _, event := range events {
		kind := knowledgesdk.KnowledgeCollaborationEventUpdate
		if event.Snapshot != nil {
			kind = knowledgesdk.KnowledgeCollaborationEventSnapshot
		}
		out = append(out, knowledgesdk.KnowledgeCollaborationServerEvent{Type: kind, Clock: event.Clock, UserID: event.UserID, Update: event.Update, Snapshot: event.Snapshot})
	}
	if includePresence {
		out = append(out, knowledgesdk.KnowledgeCollaborationServerEvent{Type: knowledgesdk.KnowledgeCollaborationEventPresence, Clock: clock, Presence: presence})
	}
	return out
}

func (s *Store) readKnowledgeCollaborationEvents(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgeCollaborationEvents, includePresence bool, a agentsdk.Authority) (out knowledgesdk.KnowledgeCollaborationEventBatch, err error) {
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		_, _, draft, authorizeErr := s.authorizeKnowledgeCollaboration(ctx, tx, libraryID, pageID, a)
		if authorizeErr != nil {
			return authorizeErr
		}
		record, readErr := s.collaborationSession(ctx, tx, libraryID, pageID, input.SessionID, a)
		if readErr != nil {
			return readErr
		}
		snapshot, _, _, readErr := s.knowledgeCollaborationSnapshot(ctx, tx, pageID, draft, a)
		if readErr != nil {
			return readErr
		}
		if input.AfterClock > snapshot.ServerClock {
			return conversationError("bad_request", "collaboration_clock_invalid")
		}
		now := time.Now().UTC().Truncate(time.Millisecond)
		record.ServerClock, record.LeaseUntilMillis, record.LastSeenMillis = snapshot.ServerClock, now.Add(knowledgeCollaborationLease).UnixMilli(), now.UnixMilli()
		q, args, buildErr := query.NewUpdateBuilder(s.store.Renderer(), knowledgePageCollaborationSessionTable).Set("lease_until", record.LeaseUntilMillis).Set("server_clock", record.ServerClock).Set("payload_json", conversationJSON(record)).Where(query.And(knowledgeCollaborationSessionScope(a, record.ID), query.Equal("state", "connected"))).Build()
		if readErr = conversationExec(ctx, tx, q, args, buildErr); readErr != nil {
			return readErr
		}
		updates, readErr := s.collaborationEvents(ctx, tx, pageID, input.AfterClock, snapshot, a)
		if readErr != nil {
			return readErr
		}
		presence, readErr := s.knowledgeCollaborationPresence(ctx, tx, pageID, now, a)
		if readErr != nil {
			return readErr
		}
		out = knowledgesdk.KnowledgeCollaborationEventBatch{SessionID: record.ID, ServerClock: snapshot.ServerClock, Events: collaborationServerEvents(updates, presence, snapshot.ServerClock, includePresence), Complete: true}
		return nil
	})
	return
}

func (s *Store) KnowledgeCollaborationEvents(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgeCollaborationEvents, a agentsdk.Authority) (out knowledgesdk.KnowledgeCollaborationEventBatch, err error) {
	if input.AfterClock < 0 || input.WaitMillis < 0 || input.WaitMillis > knowledgeCollaborationMaximumWait.Milliseconds() || input.ConnectionAttempt < 0 || input.ConnectionAttempt > 100_000 || conversationAuthority(a) != nil {
		return out, conversationError("bad_request", "collaboration_events_invalid")
	}
	defer func() {
		if err == nil {
			s.collaborationMetrics.recordEventStream(ctx, input.ConnectionAttempt > 0, knowledgeCollaborationReplayCount(out.Events))
		}
	}()
	updates, unsubscribe := s.collaboration.subscribe(ctx,
		knowledgeCollaborationLibraryNotifierKey(a, libraryID),
		knowledgeCollaborationPageNotifierKey(a, libraryID, pageID),
	)
	defer unsubscribe()
	out, err = s.readKnowledgeCollaborationEvents(ctx, libraryID, pageID, input, input.WaitMillis == 0, a)
	if err != nil || len(out.Events) > 0 || input.WaitMillis == 0 {
		return out, err
	}
	timer := time.NewTimer(time.Duration(input.WaitMillis) * time.Millisecond)
	defer timer.Stop()
	changed := false
	select {
	case <-ctx.Done():
		return out, ctx.Err()
	case <-updates:
		changed = true
	case <-timer.C:
	}
	return s.readKnowledgeCollaborationEvents(ctx, libraryID, pageID, input, changed, a)
}

func (s *Store) CloseKnowledgeCollaboration(ctx context.Context, libraryID, pageID, sessionID string, a agentsdk.Authority) (err error) {
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		if _, _, _, authorizeErr := s.authorizeKnowledgeCollaboration(ctx, tx, libraryID, pageID, a); authorizeErr != nil {
			return authorizeErr
		}
		if !personalMemoryKey(sessionID) {
			return conversationError("bad_request", "collaboration_session_invalid")
		}
		var record knowledgeCollaborationSessionRecord
		found, readErr := s.executionRead(ctx, tx, knowledgePageCollaborationSessionTable, knowledgeCollaborationSessionScope(a, sessionID), &record)
		if readErr != nil {
			return readErr
		}
		// Closing a transport is cleanup, so it must stay idempotent when a page
		// switch, policy change, or a second teardown already revoked/closed the
		// durable session. The scoped lookup and page authorization above keep a
		// caller from learning about or mutating another user's session.
		if !found || record.LibraryID != libraryID || record.PageID != pageID || record.UserID != a.UserID || record.State != "connected" {
			return nil
		}
		record.State = "closed"
		record.AwarenessUpdate, record.CursorBlockID, record.SelectionBlockID = "", "", ""
		record.EditedBlockIDs = nil
		q, args, buildErr := query.NewUpdateBuilder(s.store.Renderer(), knowledgePageCollaborationSessionTable).Set("state", record.State).Set("payload_json", conversationJSON(record)).Where(knowledgeCollaborationSessionScope(a, sessionID)).Build()
		return conversationExec(ctx, tx, q, args, buildErr)
	})
	if err == nil {
		s.notifyKnowledgeCollaboration(ctx, a, libraryID, pageID)
	}
	return
}

func (s *Store) PublishKnowledgeCollaboration(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgeCollaborationPublish, a agentsdk.Authority) (out knowledgesdk.KnowledgePageView, err error) {
	var page knowledgesdk.KnowledgePage
	var draft knowledgesdk.KnowledgePageDraft
	var snapshot knowledgesdk.KnowledgeCollaborationSnapshot
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		_, currentPage, currentDraft, authorizeErr := s.authorizeKnowledgeCollaboration(ctx, tx, libraryID, pageID, a)
		if authorizeErr != nil {
			return authorizeErr
		}
		record, readErr := s.collaborationSession(ctx, tx, libraryID, pageID, input.SessionID, a)
		if readErr != nil {
			return readErr
		}
		if input.ClientID != record.ClientID {
			return conversationError("forbidden", "collaboration_client_mismatch")
		}
		snapshot, _, _, readErr = s.knowledgeCollaborationSnapshot(ctx, tx, pageID, currentDraft, a)
		if readErr != nil {
			return readErr
		}
		if snapshot.Title != currentDraft.Title || snapshot.ContentSHA256 != currentDraft.Body.ContentSHA256 || snapshot.DraftRevision != currentDraft.DraftRevision {
			return conversationError("conflict", "collaboration_snapshot_stale")
		}
		page, draft = currentPage, currentDraft
		return nil
	})
	if err != nil {
		return out, err
	}
	clientID := "collab-publish:" + conversationHash([]any{input.SessionID, snapshot.ServerClock, snapshot.ContentSHA256})[:32]
	return s.PublishKnowledgePage(ctx, libraryID, pageID, knowledgesdk.KnowledgePagePublish{ClientID: clientID, ExpectedPageRevision: page.Revision, ExpectedDraftRevision: draft.DraftRevision, PublishNote: input.PublishNote}, a)
}

func (s *Store) revokeKnowledgeCollaborationSessions(ctx context.Context, tx *sql.Tx, predicate query.Predicate) error {
	q, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgePageCollaborationSessionTable).Columns("payload_json").Where(query.And(predicate, query.Equal("state", "connected"))).Build()
	if err != nil {
		return err
	}
	rows, err := tx.QueryContext(ctx, q, args...)
	if err != nil {
		return err
	}
	records := []knowledgeCollaborationSessionRecord{}
	for rows.Next() {
		var raw []byte
		if err = rows.Scan(&raw); err != nil {
			_ = rows.Close()
			return err
		}
		var record knowledgeCollaborationSessionRecord
		if err = unmarshalDurableJSON(raw, &record); err != nil {
			_ = rows.Close()
			return err
		}
		records = append(records, record)
	}
	if err = rows.Close(); err != nil {
		return err
	}
	for _, record := range records {
		record.State = "revoked"
		record.AwarenessUpdate, record.CursorBlockID, record.SelectionBlockID = "", "", ""
		record.EditedBlockIDs = nil
		q, args, buildErr := query.NewUpdateBuilder(s.store.Renderer(), knowledgePageCollaborationSessionTable).Set("state", record.State).Set("payload_json", conversationJSON(record)).Where(query.And(predicate, query.Equal("session_id", record.ID), query.Equal("state", "connected"))).Build()
		if err = conversationExec(ctx, tx, q, args, buildErr); err != nil {
			return err
		}
	}
	return nil
}

func (s *Store) resetKnowledgeCollaborationState(ctx context.Context, tx *sql.Tx, pageID string, a agentsdk.Authority) error {
	if err := s.revokeKnowledgeCollaborationSessions(ctx, tx, pageScope(a, pageID)); err != nil {
		return err
	}
	for _, table := range []string{knowledgePageCollaborationUpdateTable, knowledgePageCollaborationSnapshotTable} {
		q, args, buildErr := query.NewDeleteBuilder(s.store.Renderer(), table).Where(pageScope(a, pageID)).Build()
		if err := conversationExec(ctx, tx, q, args, buildErr); err != nil {
			return err
		}
	}
	return nil
}

var _ knowledgesdk.KnowledgeRealtimeCollaborationService = (*Store)(nil)
