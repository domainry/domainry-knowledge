package store

import (
	"context"
	"database/sql"
	"encoding/base64"
	"sort"
	"strings"
	"time"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-orm/query"
)

const (
	knowledgeCollaborationLease               = 30 * time.Second
	knowledgeCollaborationRetainedEvents      = int64(256)
	knowledgeCollaborationMaximumUpdateBytes  = knowledgePageMaximumBytes
	knowledgeCollaborationMaximumStateBytes   = knowledgePageMaximumBytes * 4
	knowledgeCollaborationMaximumEditedBlocks = 2048
)

type knowledgeCollaborationSessionRecord struct {
	ID, LibraryID, PageID, ClientID, UserID string
	State                                   string
	ServerClock                             int64
	LeaseUntilMillis, LastSeenMillis        int64
	CursorBlockID, SelectionBlockID         string
	EditedBlockIDs                          []string
}

type knowledgeCollaborationUpdateRecord struct {
	Clock     int64
	SessionID string
	UserID    string
	Update    knowledgesdk.KnowledgeCollaborationUpdate
}

func knowledgeCollaborationSessionScope(a agentsdk.ConversationAuthority, sessionID string) query.Predicate {
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

func initialKnowledgeCollaborationSnapshot(pageID string, draft knowledgesdk.KnowledgePageDraft, clock int64) knowledgesdk.KnowledgeCollaborationSnapshot {
	return knowledgesdk.KnowledgeCollaborationSnapshot{
		PageID: pageID, DraftRevision: draft.DraftRevision, ServerClock: clock,
		Title: draft.Title, Content: draft.Body.Content, ContentSHA256: draft.Body.ContentSHA256,
	}
}

func validateKnowledgeCollaborationUpdate(update knowledgesdk.KnowledgeCollaborationUpdate) (knowledgesdk.PageContent, error) {
	if !validateKnowledgeCollaborationClientID(update.ClientID) || !personalMemoryKey(update.UpdateID) || len(update.EditedBlockIDs) > knowledgeCollaborationMaximumEditedBlocks {
		return knowledgesdk.PageContent{}, conversationError("bad_request", "collaboration_update_invalid")
	}
	if update.Title != nil && !executionText(*update.Title, 256, true) {
		return knowledgesdk.PageContent{}, conversationError("bad_request", "collaboration_title_invalid")
	}
	if err := decodeKnowledgeCollaborationBinary(update.YjsUpdate, knowledgeCollaborationMaximumUpdateBytes, update.Title == nil); err != nil {
		return knowledgesdk.PageContent{}, err
	}
	if err := decodeKnowledgeCollaborationBinary(update.YjsState, knowledgeCollaborationMaximumStateBytes, true); err != nil {
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

func (s *Store) authorizeKnowledgeCollaboration(ctx context.Context, tx *sql.Tx, libraryID, pageID string, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeLibrary, knowledgesdk.KnowledgePage, knowledgesdk.KnowledgePageDraft, error) {
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
	if page.ContentType != knowledgesdk.KnowledgePageTypeDocument {
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

func (s *Store) knowledgeCollaborationSnapshot(ctx context.Context, tx *sql.Tx, pageID string, draft knowledgesdk.KnowledgePageDraft, a agentsdk.ConversationAuthority) (knowledgesdk.KnowledgeCollaborationSnapshot, bool, error) {
	var snapshot knowledgesdk.KnowledgeCollaborationSnapshot
	found, err := s.executionRead(ctx, tx, knowledgePageCollaborationSnapshotTable, pageScope(a, pageID), &snapshot)
	if err != nil {
		return snapshot, false, err
	}
	if !found || snapshot.PageID != pageID || snapshot.DraftRevision != draft.DraftRevision || snapshot.Title != draft.Title || snapshot.ContentSHA256 != draft.Body.ContentSHA256 {
		clock := snapshot.ServerClock
		if found {
			clock++
		}
		snapshot = initialKnowledgeCollaborationSnapshot(pageID, draft, clock)
		if found {
			q, args, buildErr := query.NewUpdateBuilder(s.store.Renderer(), knowledgePageCollaborationSnapshotTable).Set("draft_revision", snapshot.DraftRevision).Set("server_clock", snapshot.ServerClock).Set("payload_json", conversationJSON(snapshot)).Where(pageScope(a, pageID)).Build()
			if err = conversationExec(ctx, tx, q, args, buildErr); err != nil {
				return snapshot, false, err
			}
		} else {
			q, args, buildErr := query.NewInsertBuilder(s.store.Renderer(), knowledgePageCollaborationSnapshotTable).Columns("scope_key", "page_id", "library_id", "draft_revision", "server_clock", "payload_json").Values(libraryScope(a), pageID, draft.LibraryID, snapshot.DraftRevision, snapshot.ServerClock, conversationJSON(snapshot)).Build()
			if err = conversationExec(ctx, tx, q, args, buildErr); err != nil {
				return snapshot, false, err
			}
		}
		q, args, buildErr := query.NewDeleteBuilder(s.store.Renderer(), knowledgePageCollaborationUpdateTable).Where(pageScope(a, pageID)).Build()
		if err = conversationExec(ctx, tx, q, args, buildErr); err != nil {
			return snapshot, false, err
		}
	}
	return snapshot, found, nil
}

func collaborationSessionAPI(record knowledgeCollaborationSessionRecord, snapshot knowledgesdk.KnowledgeCollaborationSnapshot, presence []knowledgesdk.KnowledgeCollaborationPresence) knowledgesdk.KnowledgeCollaborationSession {
	return knowledgesdk.KnowledgeCollaborationSession{
		ID: record.ID, LibraryID: record.LibraryID, PageID: record.PageID, ClientID: record.ClientID, UserID: record.UserID,
		State: record.State, ServerClock: snapshot.ServerClock, ExpiresAt: durableTime(record.LeaseUntilMillis), Snapshot: snapshot, Presence: presence,
	}
}

func (s *Store) knowledgeCollaborationPresence(ctx context.Context, tx *sql.Tx, pageID string, now time.Time, a agentsdk.ConversationAuthority) ([]knowledgesdk.KnowledgeCollaborationPresence, error) {
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
			SessionID: record.ID, UserID: record.UserID, CursorBlockID: record.CursorBlockID,
			SelectionBlockID: record.SelectionBlockID, EditedBlocks: len(record.EditedBlockIDs), LastSeenAt: durableTime(record.LastSeenMillis),
		})
	}
	return out, rows.Err()
}

func (s *Store) ConnectKnowledgeCollaboration(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgeCollaborationConnect, a agentsdk.ConversationAuthority) (out knowledgesdk.KnowledgeCollaborationSession, err error) {
	if !validateKnowledgeCollaborationClientID(input.ClientID) || conversationAuthority(a) != nil {
		return out, conversationError("bad_request", "collaboration_connect_invalid")
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		_, _, draft, authorizeErr := s.authorizeKnowledgeCollaboration(ctx, tx, libraryID, pageID, a)
		if authorizeErr != nil {
			return authorizeErr
		}
		snapshot, _, readErr := s.knowledgeCollaborationSnapshot(ctx, tx, pageID, draft, a)
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
		out = collaborationSessionAPI(record, snapshot, presence)
		return nil
	})
	return
}

func (s *Store) collaborationSession(ctx context.Context, tx *sql.Tx, libraryID, pageID, sessionID string, a agentsdk.ConversationAuthority) (knowledgeCollaborationSessionRecord, error) {
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

func (s *Store) collaborationEvents(ctx context.Context, tx *sql.Tx, pageID string, afterClock int64, snapshot knowledgesdk.KnowledgeCollaborationSnapshot, a agentsdk.ConversationAuthority) ([]knowledgesdk.KnowledgeCollaborationUpdateEvent, error) {
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
		copySnapshot := snapshot
		return []knowledgesdk.KnowledgeCollaborationUpdateEvent{{Clock: snapshot.ServerClock, Snapshot: &copySnapshot}}, nil
	}
	events := make([]knowledgesdk.KnowledgeCollaborationUpdateEvent, 0, len(updates))
	for _, update := range updates {
		copyUpdate := update.Update
		events = append(events, knowledgesdk.KnowledgeCollaborationUpdateEvent{Clock: update.Clock, UserID: update.UserID, Update: &copyUpdate})
	}
	return events, nil
}

func (s *Store) SyncKnowledgeCollaboration(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgeCollaborationSync, a agentsdk.ConversationAuthority) (out knowledgesdk.KnowledgeCollaborationSyncResult, err error) {
	if input.AfterClock < 0 || !validKnowledgeCollaborationBlockID(input.CursorBlockID) || !validKnowledgeCollaborationBlockID(input.SelectionBlockID) {
		return out, conversationError("bad_request", "collaboration_sync_invalid")
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		_, page, draft, authorizeErr := s.authorizeKnowledgeCollaboration(ctx, tx, libraryID, pageID, a)
		if authorizeErr != nil {
			return authorizeErr
		}
		record, readErr := s.collaborationSession(ctx, tx, libraryID, pageID, input.SessionID, a)
		if readErr != nil {
			return readErr
		}
		snapshot, _, readErr := s.knowledgeCollaborationSnapshot(ctx, tx, pageID, draft, a)
		if readErr != nil {
			return readErr
		}
		if input.Update != nil {
			if input.Update.ClientID != record.ClientID {
				return conversationError("forbidden", "collaboration_client_mismatch")
			}
			var replay knowledgeCollaborationUpdateRecord
			found, duplicateErr := s.executionRead(ctx, tx, knowledgePageCollaborationUpdateTable, query.And(pageScope(a, pageID), query.Equal("update_id", input.Update.UpdateID)), &replay)
			if duplicateErr != nil {
				return duplicateErr
			}
			if found {
				if replay.Update.ClientID != input.Update.ClientID || conversationHash(replay.Update) != conversationHash(*input.Update) {
					return conversationError("conflict", "collaboration_update_conflict")
				}
				out.Applied = true
			} else if input.AfterClock == snapshot.ServerClock {
				body, validationErr := validateKnowledgeCollaborationUpdate(*input.Update)
				if validationErr != nil {
					return validationErr
				}
				now := time.Now().UTC().Truncate(time.Millisecond)
				draft.DraftRevision++
				if input.Update.Title != nil {
					draft.Title = strings.TrimSpace(*input.Update.Title)
				}
				draft.Body, draft.UpdatedByUserID, draft.UpdatedAt = body, a.UserID, now
				record.EditedBlockIDs = mergeKnowledgeCollaborationBlockIDs(record.EditedBlockIDs, input.Update.EditedBlockIDs)
				snapshot.DraftRevision, snapshot.ServerClock = draft.DraftRevision, snapshot.ServerClock+1
				snapshot.Title, snapshot.Content, snapshot.ContentSHA256, snapshot.YjsState = draft.Title, body.Content, body.ContentSHA256, input.Update.YjsState
				q, args, buildErr := query.NewUpdateBuilder(s.store.Renderer(), knowledgePageDraftTable).Set("draft_revision", draft.DraftRevision).Set("updated_at", now.UnixMilli()).Set("last_request_key", "collaboration:"+input.Update.UpdateID).Set("last_request_hash", conversationHash(*input.Update)).Set("payload_json", conversationJSON(draft)).Where(query.And(pageScope(a, pageID), query.Equal("draft_revision", draft.DraftRevision-1))).Build()
				if readErr = conversationCAS(ctx, tx, q, args, buildErr); readErr != nil {
					return conversationError("conflict", "page_draft_revision_conflict")
				}
				q, args, buildErr = query.NewUpdateBuilder(s.store.Renderer(), knowledgePageCollaborationSnapshotTable).Set("draft_revision", snapshot.DraftRevision).Set("server_clock", snapshot.ServerClock).Set("payload_json", conversationJSON(snapshot)).Where(pageScope(a, pageID)).Build()
				if readErr = conversationExec(ctx, tx, q, args, buildErr); readErr != nil {
					return readErr
				}
				updateRecord := knowledgeCollaborationUpdateRecord{Clock: snapshot.ServerClock, SessionID: record.ID, UserID: a.UserID, Update: *input.Update}
				q, args, buildErr = query.NewInsertBuilder(s.store.Renderer(), knowledgePageCollaborationUpdateTable).Columns("scope_key", "page_id", "clock", "update_id", "session_id", "user_id", "payload_json").Values(libraryScope(a), pageID, snapshot.ServerClock, input.Update.UpdateID, record.ID, a.UserID, conversationJSON(updateRecord)).Build()
				if readErr = conversationExec(ctx, tx, q, args, buildErr); readErr != nil {
					return readErr
				}
				if snapshot.ServerClock > knowledgeCollaborationRetainedEvents {
					q, args, buildErr = query.NewDeleteBuilder(s.store.Renderer(), knowledgePageCollaborationUpdateTable).Where(query.And(pageScope(a, pageID), query.LessThanOrEqual("clock", snapshot.ServerClock-knowledgeCollaborationRetainedEvents))).Build()
					if readErr = conversationExec(ctx, tx, q, args, buildErr); readErr != nil {
						return readErr
					}
				}
				page.UpdatedAt, page.UpdatedByUserID = now, a.UserID
				q, args, buildErr = query.NewUpdateBuilder(s.store.Renderer(), knowledgePageTable).Set("updated_at", now.UnixMilli()).Set("payload_json", conversationJSON(page)).Where(pageScope(a, pageID)).Build()
				if readErr = conversationExec(ctx, tx, q, args, buildErr); readErr != nil {
					return readErr
				}
				out.Applied = true
			}
		}
		now := time.Now().UTC().Truncate(time.Millisecond)
		record.ServerClock, record.LeaseUntilMillis, record.LastSeenMillis = snapshot.ServerClock, now.Add(knowledgeCollaborationLease).UnixMilli(), now.UnixMilli()
		record.CursorBlockID, record.SelectionBlockID = input.CursorBlockID, input.SelectionBlockID
		q, args, buildErr := query.NewUpdateBuilder(s.store.Renderer(), knowledgePageCollaborationSessionTable).Set("lease_until", record.LeaseUntilMillis).Set("server_clock", record.ServerClock).Set("payload_json", conversationJSON(record)).Where(query.And(knowledgeCollaborationSessionScope(a, record.ID), query.Equal("state", "connected"))).Build()
		if readErr = conversationExec(ctx, tx, q, args, buildErr); readErr != nil {
			return readErr
		}
		presence, readErr := s.knowledgeCollaborationPresence(ctx, tx, pageID, now, a)
		if readErr != nil {
			return readErr
		}
		out.Session = collaborationSessionAPI(record, snapshot, presence)
		out.Events, readErr = s.collaborationEvents(ctx, tx, pageID, input.AfterClock, snapshot, a)
		out.Complete = true
		return readErr
	})
	return
}

func (s *Store) CloseKnowledgeCollaboration(ctx context.Context, libraryID, pageID, sessionID string, a agentsdk.ConversationAuthority) (err error) {
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		if _, _, _, authorizeErr := s.authorizeKnowledgeCollaboration(ctx, tx, libraryID, pageID, a); authorizeErr != nil {
			return authorizeErr
		}
		record, readErr := s.collaborationSession(ctx, tx, libraryID, pageID, sessionID, a)
		if readErr != nil {
			return readErr
		}
		record.State = "closed"
		q, args, buildErr := query.NewUpdateBuilder(s.store.Renderer(), knowledgePageCollaborationSessionTable).Set("state", record.State).Set("payload_json", conversationJSON(record)).Where(knowledgeCollaborationSessionScope(a, sessionID)).Build()
		return conversationExec(ctx, tx, q, args, buildErr)
	})
	return
}

func (s *Store) PublishKnowledgeCollaboration(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgeCollaborationPublish, a agentsdk.ConversationAuthority) (out knowledgesdk.KnowledgePageView, err error) {
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
		snapshot, _, readErr = s.knowledgeCollaborationSnapshot(ctx, tx, pageID, currentDraft, a)
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
		q, args, buildErr := query.NewUpdateBuilder(s.store.Renderer(), knowledgePageCollaborationSessionTable).Set("state", record.State).Set("payload_json", conversationJSON(record)).Where(query.And(predicate, query.Equal("session_id", record.ID), query.Equal("state", "connected"))).Build()
		if err = conversationExec(ctx, tx, q, args, buildErr); err != nil {
			return err
		}
	}
	return nil
}

func (s *Store) resetKnowledgeCollaborationState(ctx context.Context, tx *sql.Tx, pageID string, a agentsdk.ConversationAuthority) error {
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
