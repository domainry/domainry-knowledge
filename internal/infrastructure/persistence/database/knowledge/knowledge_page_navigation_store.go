package store

import (
	"context"
	"database/sql"
	"sort"
	"strings"
	"time"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-orm/query"
)

func pagePersonalStatePredicate(a agentsdk.Authority, pageID string) query.Predicate {
	return query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("user_id", a.UserID), query.Equal("page_id", pageID))
}

func emptyKnowledgePagePersonalState(libraryID, pageID string, a agentsdk.Authority) knowledgesdk.KnowledgePagePersonalState {
	return knowledgesdk.KnowledgePagePersonalState{LibraryID: libraryID, PageID: pageID, UserID: a.UserID}
}

func (s *Store) knowledgePagePersonalStateRecord(ctx context.Context, db conversationDB, libraryID, pageID string, a agentsdk.Authority) (knowledgesdk.KnowledgePagePersonalState, bool, error) {
	state := emptyKnowledgePagePersonalState(libraryID, pageID, a)
	found, err := s.executionRead(ctx, db, knowledgePagePersonalStateTable, pagePersonalStatePredicate(a, pageID), &state)
	if err != nil {
		return state, false, err
	}
	if found && (state.LibraryID != libraryID || state.PageID != pageID || state.UserID != a.UserID) {
		return state, false, conversationError("unavailable", "page_personal_state_corrupt")
	}
	return state, found, nil
}

func (s *Store) persistKnowledgePagePersonalState(ctx context.Context, tx *sql.Tx, state knowledgesdk.KnowledgePagePersonalState, found bool, a agentsdk.Authority) error {
	values := []any{state.LibraryID, state.PageID, state.UserID, state.Favorite, durableMillis(state.FavoriteAt), state.Subscribed, durableMillis(state.SubscribedAt), state.ShortcutRank, durableMillis(state.LastViewedAt), durableMillis(state.LastEditedAt), state.Revision, durableMillis(state.UpdatedAt), conversationJSON(state)}
	if !found {
		q, args, err := query.NewInsertBuilder(s.store.Renderer(), knowledgePagePersonalStateTable).
			Columns("scope_key", "library_id", "page_id", "user_id", "favorite", "favorite_at", "subscribed", "subscribed_at", "shortcut_rank", "last_viewed_at", "last_edited_at", "revision", "updated_at", "payload_json").
			Values(append([]any{libraryScope(a)}, values...)...).Build()
		return conversationExec(ctx, tx, q, args, err)
	}
	q, args, err := query.NewUpdateBuilder(s.store.Renderer(), knowledgePagePersonalStateTable).
		Set("favorite", state.Favorite).Set("favorite_at", durableMillis(state.FavoriteAt)).Set("subscribed", state.Subscribed).Set("subscribed_at", durableMillis(state.SubscribedAt)).
		Set("shortcut_rank", state.ShortcutRank).Set("last_viewed_at", durableMillis(state.LastViewedAt)).Set("last_edited_at", durableMillis(state.LastEditedAt)).
		Set("revision", state.Revision).Set("updated_at", durableMillis(state.UpdatedAt)).Set("payload_json", conversationJSON(state)).
		Where(pagePersonalStatePredicate(a, state.PageID)).Build()
	return conversationCAS(ctx, tx, q, args, err)
}

func (s *Store) touchKnowledgePagePersonalState(ctx context.Context, tx *sql.Tx, libraryID, pageID, kind string, at time.Time, a agentsdk.Authority) (knowledgesdk.KnowledgePagePersonalState, error) {
	state, found, err := s.knowledgePagePersonalStateRecord(ctx, tx, libraryID, pageID, a)
	if err != nil {
		return state, err
	}
	at = at.UTC().Truncate(time.Millisecond)
	switch kind {
	case "viewed":
		state.LastViewedAt = at
	case "edited":
		state.LastEditedAt = at
	default:
		return state, conversationError("bad_request", "page_personal_touch_invalid")
	}
	state.UpdatedAt = at
	if err = s.persistKnowledgePagePersonalState(ctx, tx, state, found, a); err != nil {
		return state, err
	}
	return state, nil
}

func (s *Store) KnowledgePagePersonalState(ctx context.Context, libraryID, pageID string, a agentsdk.Authority) (out knowledgesdk.KnowledgePagePersonalState, err error) {
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		library, readErr := s.libraryRecord(ctx, tx, libraryID, a)
		if readErr != nil {
			return readErr
		}
		page, readErr := s.pageRecord(ctx, tx, libraryID, pageID, a)
		if readErr != nil {
			return readErr
		}
		if _, readErr = s.pageView(ctx, tx, library, page, library.Role != "reader", a); readErr != nil {
			return readErr
		}
		out, _, readErr = s.knowledgePagePersonalStateRecord(ctx, tx, libraryID, pageID, a)
		return readErr
	})
	return
}

func (s *Store) SetKnowledgePagePersonalState(ctx context.Context, libraryID, pageID string, in knowledgesdk.KnowledgePagePersonalStateWrite, a agentsdk.Authority) (out knowledgesdk.KnowledgePagePersonalState, err error) {
	if in.ExpectedRevision < 0 || !validPageRank(in.ShortcutRank, false) {
		return out, conversationError("bad_request", "page_personal_state_invalid")
	}
	if _, err = pageRequestKey("personal-state", libraryID, pageID, in.ClientID, a); err != nil {
		return out, err
	}
	err = s.mutateKnowledgeOperation(ctx, "knowledge.page.personal_state.set", knowledgesdk.ActionPagePersonalStateSet, libraryID+":"+pageID, in.ClientID, in, a, func(tx *sql.Tx) (any, error) {
		library, readErr := s.libraryRecord(ctx, tx, libraryID, a)
		if readErr != nil {
			return out, readErr
		}
		page, readErr := s.pageRecord(ctx, tx, libraryID, pageID, a)
		if readErr != nil {
			return out, readErr
		}
		if _, readErr = s.pageView(ctx, tx, library, page, library.Role != "reader", a); readErr != nil {
			return out, readErr
		}
		current, found, readErr := s.knowledgePagePersonalStateRecord(ctx, tx, libraryID, pageID, a)
		if readErr != nil {
			return out, readErr
		}
		if current.Revision != in.ExpectedRevision {
			return out, conversationError("conflict", "page_personal_state_revision_conflict")
		}
		now := time.Now().UTC().Truncate(time.Millisecond)
		if !current.Favorite && in.Favorite {
			current.FavoriteAt = now
		} else if !in.Favorite {
			current.FavoriteAt = time.Time{}
		}
		if !current.Subscribed && in.Subscribed {
			current.SubscribedAt = now
		} else if !in.Subscribed {
			current.SubscribedAt = time.Time{}
		}
		current.Favorite, current.Subscribed, current.ShortcutRank = in.Favorite, in.Subscribed, strings.TrimSpace(in.ShortcutRank)
		current.Revision++
		current.UpdatedAt = now
		if readErr = s.persistKnowledgePagePersonalState(ctx, tx, current, found, a); readErr != nil {
			return out, readErr
		}
		out = current
		return out, nil
	}, &out)
	return
}

func (s *Store) RecordKnowledgePageView(ctx context.Context, libraryID, pageID string, in knowledgesdk.KnowledgePageViewRecord, a agentsdk.Authority) (out knowledgesdk.KnowledgePagePersonalState, err error) {
	if _, err = pageRequestKey("view", libraryID, pageID, in.ClientID, a); err != nil {
		return out, err
	}
	err = s.mutateKnowledgeOperation(ctx, "knowledge.page.view.record", knowledgesdk.ActionPageViewRecord, libraryID+":"+pageID, in.ClientID, in, a, func(tx *sql.Tx) (any, error) {
		library, readErr := s.libraryRecord(ctx, tx, libraryID, a)
		if readErr != nil {
			return out, readErr
		}
		page, readErr := s.pageRecord(ctx, tx, libraryID, pageID, a)
		if readErr != nil {
			return out, readErr
		}
		if _, readErr = s.pageView(ctx, tx, library, page, library.Role != "reader", a); readErr != nil {
			return out, readErr
		}
		out, readErr = s.touchKnowledgePagePersonalState(ctx, tx, libraryID, pageID, "viewed", time.Now(), a)
		return out, readErr
	}, &out)
	return
}

func validKnowledgePageCollectionKind(kind knowledgesdk.KnowledgePageCollectionKind) bool {
	switch kind {
	case knowledgesdk.KnowledgePageCollectionFavorites, knowledgesdk.KnowledgePageCollectionRecentViews, knowledgesdk.KnowledgePageCollectionRecentEdits, knowledgesdk.KnowledgePageCollectionSubscribed, knowledgesdk.KnowledgePageCollectionShortcuts, knowledgesdk.KnowledgePageCollectionTrash:
		return true
	default:
		return false
	}
}

func collectionStateTime(kind knowledgesdk.KnowledgePageCollectionKind, state knowledgesdk.KnowledgePagePersonalState) time.Time {
	switch kind {
	case knowledgesdk.KnowledgePageCollectionFavorites:
		return state.FavoriteAt
	case knowledgesdk.KnowledgePageCollectionSubscribed:
		return state.SubscribedAt
	case knowledgesdk.KnowledgePageCollectionRecentViews:
		return state.LastViewedAt
	default:
		return state.LastEditedAt
	}
}

func (s *Store) collectionPersonalStates(ctx context.Context, tx *sql.Tx, libraryID string, kind knowledgesdk.KnowledgePageCollectionKind, a agentsdk.Authority) ([]knowledgesdk.KnowledgePagePersonalState, error) {
	predicate := query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("library_id", libraryID), query.Equal("user_id", a.UserID))
	switch kind {
	case knowledgesdk.KnowledgePageCollectionFavorites:
		predicate = query.And(predicate, query.Equal("favorite", true))
	case knowledgesdk.KnowledgePageCollectionSubscribed:
		predicate = query.And(predicate, query.Equal("subscribed", true))
	case knowledgesdk.KnowledgePageCollectionShortcuts:
		predicate = query.And(predicate, query.NotEqual("shortcut_rank", ""))
	case knowledgesdk.KnowledgePageCollectionRecentViews:
		predicate = query.And(predicate, query.GreaterThan("last_viewed_at", 0))
	case knowledgesdk.KnowledgePageCollectionRecentEdits:
		predicate = query.And(predicate, query.GreaterThan("last_edited_at", 0))
	}
	q, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgePagePersonalStateTable).Columns("payload_json").Where(predicate).Limit(knowledgeLibraryMaximumPages + 1).Build()
	if err != nil {
		return nil, err
	}
	rows, err := tx.QueryContext(ctx, q, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	states := []knowledgesdk.KnowledgePagePersonalState{}
	for rows.Next() {
		var raw []byte
		var state knowledgesdk.KnowledgePagePersonalState
		if err = rows.Scan(&raw); err != nil {
			return nil, err
		}
		if err = unmarshalDurableJSON(raw, &state); err != nil {
			return nil, err
		}
		states = append(states, state)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	sort.Slice(states, func(i, j int) bool {
		if kind == knowledgesdk.KnowledgePageCollectionShortcuts {
			if states[i].ShortcutRank != states[j].ShortcutRank {
				return states[i].ShortcutRank < states[j].ShortcutRank
			}
		} else if left, right := collectionStateTime(kind, states[i]), collectionStateTime(kind, states[j]); !left.Equal(right) {
			return left.After(right)
		}
		return states[i].PageID < states[j].PageID
	})
	return states, nil
}

func (s *Store) collectionTrashPages(ctx context.Context, tx *sql.Tx, libraryID string, a agentsdk.Authority) ([]knowledgesdk.KnowledgePage, error) {
	q, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgePageTable).Columns("payload_json").Where(query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("library_id", libraryID), query.Equal("state", "archived"))).Limit(knowledgeLibraryMaximumPages + 1).Build()
	if err != nil {
		return nil, err
	}
	rows, err := tx.QueryContext(ctx, q, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	pages := []knowledgesdk.KnowledgePage{}
	for rows.Next() {
		var raw []byte
		var page knowledgesdk.KnowledgePage
		if err = rows.Scan(&raw); err != nil {
			return nil, err
		}
		if err = unmarshalDurableJSON(raw, &page); err != nil {
			return nil, err
		}
		pages = append(pages, page)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	sort.Slice(pages, func(i, j int) bool {
		if !pages[i].UpdatedAt.Equal(pages[j].UpdatedAt) {
			return pages[i].UpdatedAt.After(pages[j].UpdatedAt)
		}
		return pages[i].ID < pages[j].ID
	})
	return pages, nil
}

func collectionStartsAfter(pageID, after string, started bool) bool {
	return started || after == "" || pageID == after
}

func (s *Store) KnowledgePageCollection(ctx context.Context, libraryID string, kind knowledgesdk.KnowledgePageCollectionKind, after string, limit int, a agentsdk.Authority) (out knowledgesdk.KnowledgePageCollectionPage, err error) {
	out = knowledgesdk.KnowledgePageCollectionPage{Items: []knowledgesdk.KnowledgePageCollectionItem{}, Complete: true}
	if !validKnowledgePageCollectionKind(kind) || after != "" && !validKnowledgePageID(after) {
		return out, conversationError("bad_request", "page_collection_invalid")
	}
	if limit == 0 {
		limit = 20
	}
	if limit < 1 || limit > 50 {
		return out, conversationError("bad_request", "page_collection_invalid")
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		library, readErr := s.libraryRecord(ctx, tx, libraryID, a)
		if readErr != nil {
			return readErr
		}
		if kind == knowledgesdk.KnowledgePageCollectionTrash {
			if roleLevel(library.Role) < roleLevel("editor") {
				return conversationError("forbidden", "page_collection_denied")
			}
			pages, listErr := s.collectionTrashPages(ctx, tx, libraryID, a)
			if listErr != nil {
				return listErr
			}
			started := after == ""
			for _, page := range pages {
				if !started {
					if page.ID == after {
						started = true
					}
					continue
				}
				effective, accessErr := s.evaluateKnowledgePageAccess(ctx, tx, libraryID, page.ID, a)
				if accessErr != nil || !effective.Allowed || roleLevel(effective.Role) < roleLevel("editor") {
					continue
				}
				state, _, stateErr := s.knowledgePagePersonalStateRecord(ctx, tx, libraryID, page.ID, a)
				if stateErr != nil {
					return stateErr
				}
				out.Items = append(out.Items, knowledgesdk.KnowledgePageCollectionItem{Page: page, State: state})
				if len(out.Items) > limit {
					break
				}
			}
		} else {
			states, listErr := s.collectionPersonalStates(ctx, tx, libraryID, kind, a)
			if listErr != nil {
				return listErr
			}
			started := after == ""
			for _, state := range states {
				if !started {
					if state.PageID == after {
						started = true
					}
					continue
				}
				page, pageErr := s.pageRecord(ctx, tx, libraryID, state.PageID, a)
				if pageErr != nil || page.State != "active" {
					continue
				}
				effective, accessErr := s.evaluateKnowledgePageAccess(ctx, tx, libraryID, page.ID, a)
				if accessErr != nil || !effective.Allowed {
					continue
				}
				if library.Role == "reader" {
					if page.PublishedVersion == 0 {
						continue
					}
					version, versionErr := s.pageVersion(ctx, tx, page.ID, page.PublishedVersion, a)
					if versionErr != nil {
						return versionErr
					}
					page.Title, page.ParentPageID, page.Rank = version.Title, version.ParentPageID, version.Rank
				}
				out.Items = append(out.Items, knowledgesdk.KnowledgePageCollectionItem{Page: page, State: state})
				if len(out.Items) > limit {
					break
				}
			}
		}
		if len(out.Items) > limit {
			out.Items = out.Items[:limit]
			out.Complete = false
			out.NextAfter = out.Items[len(out.Items)-1].Page.ID
		}
		return nil
	})
	return
}
