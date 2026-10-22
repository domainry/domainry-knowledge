package store

import (
	"context"
	"database/sql"
	"time"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func (s *Store) readKnowledgePageLiveEvents(ctx context.Context, libraryID, pageID string, afterRevision int64, changed bool, a agentsdk.Authority) (out knowledgesdk.KnowledgePageLiveEventBatch, err error) {
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		library, readErr := s.libraryRecord(ctx, tx, libraryID, a)
		if readErr != nil {
			return readErr
		}
		page, readErr := s.pageRecord(ctx, tx, libraryID, pageID, a)
		if readErr != nil {
			return readErr
		}
		effective, readErr := s.evaluateKnowledgePageAccess(ctx, tx, libraryID, pageID, a)
		if readErr != nil || !effective.Allowed || roleLevel(effective.Role) < roleLevel("reader") {
			return conversationError("not_found", "page_not_found")
		}
		// A reader is allowed to observe only an existing published version. An
		// editor may observe an unpublished draft, but the event still carries no
		// title, content, version body or presence information.
		if (library.Role == "reader" || roleLevel(effective.Role) < roleLevel("editor")) && page.PublishedVersion < 1 {
			return conversationError("not_found", "page_not_found")
		}
		if afterRevision > page.Revision {
			return conversationError("bad_request", "page_live_revision_invalid")
		}
		out = knowledgesdk.KnowledgePageLiveEventBatch{PageID: page.ID, Revision: page.Revision, Events: []knowledgesdk.KnowledgePageLiveEvent{}}
		if changed || page.Revision > afterRevision {
			out.Events = append(out.Events, knowledgesdk.KnowledgePageLiveEvent{Type: knowledgesdk.KnowledgePageLiveEventChanged, PageID: page.ID, Revision: page.Revision})
		}
		return nil
	})
	return
}

func (s *Store) KnowledgePageLiveEvents(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgePageLiveEvents, a agentsdk.Authority) (out knowledgesdk.KnowledgePageLiveEventBatch, err error) {
	if input.AfterRevision < 0 || input.WaitMillis < 0 || input.WaitMillis > knowledgeCollaborationMaximumWait.Milliseconds() || conversationAuthority(a) != nil {
		return out, conversationError("bad_request", "page_live_events_invalid")
	}
	updates, unsubscribe := s.collaboration.subscribe(ctx,
		knowledgeCollaborationLibraryNotifierKey(a, libraryID),
		knowledgeCollaborationPageNotifierKey(a, libraryID, pageID),
	)
	defer unsubscribe()
	out, err = s.readKnowledgePageLiveEvents(ctx, libraryID, pageID, input.AfterRevision, false, a)
	if err != nil || len(out.Events) > 0 {
		return out, err
	}
	if input.WaitMillis == 0 {
		out.Events = append(out.Events, knowledgesdk.KnowledgePageLiveEvent{Type: knowledgesdk.KnowledgePageLiveEventHeartbeat, PageID: out.PageID, Revision: out.Revision})
		return out, nil
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
	out, err = s.readKnowledgePageLiveEvents(ctx, libraryID, pageID, input.AfterRevision, changed, a)
	if err == nil && len(out.Events) == 0 {
		out.Events = append(out.Events, knowledgesdk.KnowledgePageLiveEvent{Type: knowledgesdk.KnowledgePageLiveEventHeartbeat, PageID: out.PageID, Revision: out.Revision})
	}
	return out, err
}
