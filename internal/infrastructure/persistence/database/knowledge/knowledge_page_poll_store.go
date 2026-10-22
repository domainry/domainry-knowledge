package store

import (
	"context"
	"database/sql"
	"slices"
	"strings"
	"time"

	"github.com/domainry/domainry-foundation/entityid"
	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-orm/query"
)

const (
	knowledgePagePollMaximumQuestionBytes = 4096
	knowledgePagePollMaximumOptionBytes   = 512
	knowledgePagePollMinimumOptions       = 2
	knowledgePagePollMaximumOptions       = 12
	knowledgePagePollMaximumPerPage       = 100
	knowledgePagePollMaximumVoters        = 10000
)

func validKnowledgePollID(id string) bool {
	return entityid.Validate("kpoll", id) == nil
}

func validKnowledgePollOptionID(id string) bool {
	return entityid.Validate("kopt", id) == nil
}

func pollScope(a agentsdk.Authority, id string) query.Predicate {
	return query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("poll_id", id))
}

func pollBallotScope(a agentsdk.Authority, pollID, userID string) query.Predicate {
	return query.And(pollScope(a, pollID), query.Equal("user_id", userID))
}

func validKnowledgePollStatus(value string) bool {
	return value == knowledgesdk.KnowledgePollStatusOpen || value == knowledgesdk.KnowledgePollStatusClosed
}

func normalizePollQuestion(value string) (string, error) {
	value = strings.TrimSpace(value)
	if !executionText(value, knowledgePagePollMaximumQuestionBytes, true) {
		return "", conversationError("bad_request", "page_poll_question_invalid")
	}
	return value, nil
}

func normalizePollCreateOptions(values []string) ([]knowledgesdk.KnowledgePagePollOption, error) {
	if len(values) < knowledgePagePollMinimumOptions || len(values) > knowledgePagePollMaximumOptions {
		return nil, conversationError("bad_request", "page_poll_options_invalid")
	}
	result := make([]knowledgesdk.KnowledgePagePollOption, 0, len(values))
	seenLabels := map[string]bool{}
	for _, raw := range values {
		label := strings.TrimSpace(raw)
		key := strings.ToLower(label)
		if !executionText(label, knowledgePagePollMaximumOptionBytes, true) || seenLabels[key] {
			return nil, conversationError("bad_request", "page_poll_options_invalid")
		}
		seenLabels[key] = true
		id, err := randomKnowledgeID("kopt_")
		if err != nil {
			return nil, err
		}
		result = append(result, knowledgesdk.KnowledgePagePollOption{ID: id, Label: label})
	}
	return result, nil
}

func normalizePollUpdateOptions(values []knowledgesdk.KnowledgePagePollOptionWrite, existing []knowledgesdk.KnowledgePagePollOption) ([]knowledgesdk.KnowledgePagePollOption, error) {
	if len(values) < knowledgePagePollMinimumOptions || len(values) > knowledgePagePollMaximumOptions {
		return nil, conversationError("bad_request", "page_poll_options_invalid")
	}
	existingIDs := make(map[string]bool, len(existing))
	for _, option := range existing {
		existingIDs[option.ID] = true
	}
	result := make([]knowledgesdk.KnowledgePagePollOption, 0, len(values))
	seenIDs, seenLabels := map[string]bool{}, map[string]bool{}
	for _, value := range values {
		label := strings.TrimSpace(value.Label)
		labelKey := strings.ToLower(label)
		if !executionText(label, knowledgePagePollMaximumOptionBytes, true) || seenLabels[labelKey] {
			return nil, conversationError("bad_request", "page_poll_options_invalid")
		}
		seenLabels[labelKey] = true
		id := strings.TrimSpace(value.ID)
		if id == "" {
			var err error
			id, err = randomKnowledgeID("kopt_")
			if err != nil {
				return nil, err
			}
		} else if !validKnowledgePollOptionID(id) || !existingIDs[id] || seenIDs[id] {
			return nil, conversationError("bad_request", "page_poll_options_invalid")
		}
		seenIDs[id] = true
		result = append(result, knowledgesdk.KnowledgePagePollOption{ID: id, Label: label})
	}
	return result, nil
}

func (s *Store) pollRecord(ctx context.Context, db conversationDB, libraryID, pageID, pollID string, a agentsdk.Authority) (knowledgesdk.KnowledgePagePoll, error) {
	var poll knowledgesdk.KnowledgePagePoll
	if !validKnowledgePollID(pollID) {
		return poll, conversationError("bad_request", "page_poll_invalid")
	}
	found, err := s.executionRead(ctx, db, knowledgePagePollTable, pollScope(a, pollID), &poll)
	if err != nil {
		return poll, err
	}
	if !found || poll.LibraryID != libraryID || poll.PageID != pageID {
		return knowledgesdk.KnowledgePagePoll{}, conversationError("not_found", "page_poll_not_found")
	}
	return poll, nil
}

func scanPolls(ctx context.Context, tx *sql.Tx, statement string, args []any) ([]knowledgesdk.KnowledgePagePoll, error) {
	rows, err := tx.QueryContext(ctx, statement, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []knowledgesdk.KnowledgePagePoll{}
	for rows.Next() {
		var raw []byte
		var poll knowledgesdk.KnowledgePagePoll
		if err = rows.Scan(&raw); err != nil {
			return nil, err
		}
		if err = unmarshalDurableJSON(raw, &poll); err != nil {
			return nil, err
		}
		items = append(items, poll)
	}
	return items, rows.Err()
}

func pollIDsAsAny(polls []knowledgesdk.KnowledgePagePoll) []any {
	values := make([]any, 0, len(polls))
	for _, poll := range polls {
		values = append(values, poll.ID)
	}
	return values
}

func (s *Store) pollViews(ctx context.Context, tx *sql.Tx, pageID string, polls []knowledgesdk.KnowledgePagePoll, a agentsdk.Authority) ([]knowledgesdk.KnowledgePagePollView, error) {
	if len(polls) == 0 {
		return []knowledgesdk.KnowledgePagePollView{}, nil
	}
	pollIDs := pollIDsAsAny(polls)
	base := query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("page_id", pageID), query.In("poll_id", pollIDs...))

	resultCounts := map[string]map[string]int64{}
	statement, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgePagePollSelectionTable).
		Projections(query.Project(query.Column("poll_id")), query.Project(query.Column("option_id")), query.ProjectAs(query.CountAll(), "votes")).
		Where(base).GroupBy(query.Column("poll_id"), query.Column("option_id")).Limit(knowledgePagePollMaximumPerPage*knowledgePagePollMaximumOptions + 1).Build()
	if err != nil {
		return nil, err
	}
	rows, err := tx.QueryContext(ctx, statement, args...)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var pollID, optionID string
		var count int64
		if err = rows.Scan(&pollID, &optionID, &count); err != nil {
			_ = rows.Close()
			return nil, err
		}
		if resultCounts[pollID] == nil {
			resultCounts[pollID] = map[string]int64{}
		}
		resultCounts[pollID][optionID] = count
	}
	if err = rows.Close(); err != nil {
		return nil, err
	}

	voterCounts := map[string]int64{}
	statement, args, err = query.NewSelectBuilder(s.store.Renderer(), knowledgePagePollBallotTable).
		Projections(query.Project(query.Column("poll_id")), query.ProjectAs(query.CountAll(), "voters")).
		Where(query.And(base, query.GreaterThan("selection_count", 0))).GroupBy(query.Column("poll_id")).Limit(knowledgePagePollMaximumPerPage + 1).Build()
	if err != nil {
		return nil, err
	}
	rows, err = tx.QueryContext(ctx, statement, args...)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var pollID string
		var count int64
		if err = rows.Scan(&pollID, &count); err != nil {
			_ = rows.Close()
			return nil, err
		}
		voterCounts[pollID] = count
	}
	if err = rows.Close(); err != nil {
		return nil, err
	}

	ballotRevisions := map[string]int64{}
	statement, args, err = query.NewSelectBuilder(s.store.Renderer(), knowledgePagePollBallotTable).Columns("poll_id", "revision").Where(query.And(base, query.Equal("user_id", a.UserID))).Limit(knowledgePagePollMaximumPerPage + 1).Build()
	if err != nil {
		return nil, err
	}
	rows, err = tx.QueryContext(ctx, statement, args...)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var pollID string
		var revision int64
		if err = rows.Scan(&pollID, &revision); err != nil {
			_ = rows.Close()
			return nil, err
		}
		ballotRevisions[pollID] = revision
	}
	if err = rows.Close(); err != nil {
		return nil, err
	}

	selected := map[string]map[string]bool{}
	statement, args, err = query.NewSelectBuilder(s.store.Renderer(), knowledgePagePollSelectionTable).Columns("poll_id", "option_id").Where(query.And(base, query.Equal("user_id", a.UserID))).OrderBy(query.Ascending("poll_id"), query.Ascending("option_id")).Limit(knowledgePagePollMaximumPerPage*knowledgePagePollMaximumOptions + 1).Build()
	if err != nil {
		return nil, err
	}
	rows, err = tx.QueryContext(ctx, statement, args...)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var pollID, optionID string
		if err = rows.Scan(&pollID, &optionID); err != nil {
			_ = rows.Close()
			return nil, err
		}
		if selected[pollID] == nil {
			selected[pollID] = map[string]bool{}
		}
		selected[pollID][optionID] = true
	}
	if err = rows.Close(); err != nil {
		return nil, err
	}

	views := make([]knowledgesdk.KnowledgePagePollView, 0, len(polls))
	for _, poll := range polls {
		view := knowledgesdk.KnowledgePagePollView{Poll: poll, TotalVoters: voterCounts[poll.ID], BallotRevision: ballotRevisions[poll.ID], Results: make([]knowledgesdk.KnowledgePagePollResult, 0, len(poll.Options)), SelectedOptionIDs: []string{}}
		for _, option := range poll.Options {
			votes := resultCounts[poll.ID][option.ID]
			view.Results = append(view.Results, knowledgesdk.KnowledgePagePollResult{OptionID: option.ID, Label: option.Label, Votes: votes})
			view.TotalSelections += votes
			if selected[poll.ID][option.ID] {
				view.SelectedOptionIDs = append(view.SelectedOptionIDs, option.ID)
			}
		}
		views = append(views, view)
	}
	return views, nil
}

func (s *Store) KnowledgePagePolls(ctx context.Context, libraryID, pageID string, a agentsdk.Authority) (out knowledgesdk.KnowledgePagePollPage, err error) {
	out.Items = []knowledgesdk.KnowledgePagePollView{}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		if _, readErr := s.libraryRecord(ctx, tx, libraryID, a); readErr != nil {
			return readErr
		}
		if _, readErr := s.pageRecord(ctx, tx, libraryID, pageID, a); readErr != nil {
			return readErr
		}
		statement, args, buildErr := query.NewSelectBuilder(s.store.Renderer(), knowledgePagePollTable).Columns("payload_json").Where(query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("library_id", libraryID), query.Equal("page_id", pageID))).OrderBy(query.Ascending("poll_id")).Limit(knowledgePagePollMaximumPerPage + 1).Build()
		if buildErr != nil {
			return buildErr
		}
		polls, readErr := scanPolls(ctx, tx, statement, args)
		if readErr != nil {
			return readErr
		}
		if len(polls) > knowledgePagePollMaximumPerPage {
			return conversationError("conflict", "page_poll_limit_exceeded")
		}
		out.Items, readErr = s.pollViews(ctx, tx, pageID, polls, a)
		return readErr
	})
	return
}

func (s *Store) CreateKnowledgePagePoll(ctx context.Context, libraryID, pageID string, in knowledgesdk.KnowledgePagePollCreate, a agentsdk.Authority) (out knowledgesdk.KnowledgePagePollView, err error) {
	if !knowledgeBlockIDPattern.MatchString(in.SourceBlockID) {
		return out, conversationError("bad_request", "page_poll_source_invalid")
	}
	question, err := normalizePollQuestion(in.Question)
	if err != nil {
		return out, err
	}
	options, err := normalizePollCreateOptions(in.Options)
	if err != nil {
		return out, err
	}
	if _, err = pageRequestKey("poll_create", libraryID, pageID, in.ClientID, a); err != nil {
		return out, err
	}
	err = s.mutateKnowledgeOperation(ctx, "knowledge.page_poll.create", knowledgesdk.ActionPagePollsCreate, libraryID+":"+pageID+":"+in.SourceBlockID, in.ClientID, in, a, func(tx *sql.Tx) (any, error) {
		library, operationErr := s.libraryRecord(ctx, tx, libraryID, a)
		if operationErr != nil {
			return out, operationErr
		}
		if operationErr = requirePageWriting(library); operationErr != nil {
			return out, operationErr
		}
		page, operationErr := s.pageRecord(ctx, tx, libraryID, pageID, a)
		if operationErr != nil {
			return out, operationErr
		}
		if page.State != "active" {
			return out, conversationError("conflict", "page_archived")
		}
		var existing knowledgesdk.KnowledgePagePoll
		found, operationErr := s.executionRead(ctx, tx, knowledgePagePollTable, query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("page_id", pageID), query.Equal("source_block_id", in.SourceBlockID)), &existing)
		if operationErr != nil {
			return out, operationErr
		}
		if found {
			views, viewErr := s.pollViews(ctx, tx, pageID, []knowledgesdk.KnowledgePagePoll{existing}, a)
			if viewErr != nil {
				return out, viewErr
			}
			return views[0], nil
		}
		statement, args, buildErr := query.NewSelectBuilder(s.store.Renderer(), knowledgePagePollTable).Projections(query.ProjectAs(query.CountAll(), "polls")).Where(query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("page_id", pageID))).Build()
		if buildErr != nil {
			return out, buildErr
		}
		var count int64
		if operationErr = tx.QueryRowContext(ctx, statement, args...).Scan(&count); operationErr != nil {
			return out, operationErr
		}
		if count >= knowledgePagePollMaximumPerPage {
			return out, conversationError("conflict", "page_poll_limit_exceeded")
		}
		id, operationErr := randomKnowledgeID("kpoll_")
		if operationErr != nil {
			return out, operationErr
		}
		now := time.Now().UTC().Truncate(time.Millisecond)
		poll := knowledgesdk.KnowledgePagePoll{ID: id, LibraryID: libraryID, PageID: pageID, SourceBlockID: in.SourceBlockID, Question: question, Options: options, Multiple: in.Multiple, Status: knowledgesdk.KnowledgePollStatusOpen, Revision: 1, CreatedByUserID: a.UserID, UpdatedByUserID: a.UserID, CreatedAt: now, UpdatedAt: now}
		statement, args, buildErr = query.NewInsertBuilder(s.store.Renderer(), knowledgePagePollTable).Columns("scope_key", "poll_id", "library_id", "page_id", "source_block_id", "status", "revision", "updated_at", "payload_json").Values(libraryScope(a), poll.ID, libraryID, pageID, poll.SourceBlockID, poll.Status, poll.Revision, poll.UpdatedAt.UnixMilli(), conversationJSON(poll)).Build()
		if operationErr = conversationExec(ctx, tx, statement, args, buildErr); operationErr != nil {
			return out, operationErr
		}
		views, viewErr := s.pollViews(ctx, tx, pageID, []knowledgesdk.KnowledgePagePoll{poll}, a)
		if viewErr != nil {
			return out, viewErr
		}
		return views[0], nil
	}, &out)
	return
}

func (s *Store) pollActiveVoters(ctx context.Context, tx *sql.Tx, pollID string, a agentsdk.Authority) (int64, error) {
	statement, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgePagePollBallotTable).Projections(query.ProjectAs(query.CountAll(), "voters")).Where(query.And(pollScope(a, pollID), query.GreaterThan("selection_count", 0))).Build()
	if err != nil {
		return 0, err
	}
	var count int64
	err = tx.QueryRowContext(ctx, statement, args...).Scan(&count)
	return count, err
}

func pollOptionsEqual(left, right []knowledgesdk.KnowledgePagePollOption) bool {
	return slices.EqualFunc(left, right, func(a, b knowledgesdk.KnowledgePagePollOption) bool { return a.ID == b.ID && a.Label == b.Label })
}

func (s *Store) UpdateKnowledgePagePoll(ctx context.Context, libraryID, pageID, pollID string, in knowledgesdk.KnowledgePagePollUpdate, a agentsdk.Authority) (out knowledgesdk.KnowledgePagePollView, err error) {
	if !validKnowledgePollStatus(in.Status) {
		return out, conversationError("bad_request", "page_poll_status_invalid")
	}
	question, err := normalizePollQuestion(in.Question)
	if err != nil {
		return out, err
	}
	if _, err = pageRequestKey("poll_update", libraryID, pollID, in.ClientID, a); err != nil {
		return out, err
	}
	err = s.mutateKnowledgeOperation(ctx, "knowledge.page_poll.update", knowledgesdk.ActionPagePollsUpdate, libraryID+":"+pageID+":"+pollID, in.ClientID, in, a, func(tx *sql.Tx) (any, error) {
		library, operationErr := s.libraryRecord(ctx, tx, libraryID, a)
		if operationErr != nil {
			return out, operationErr
		}
		if operationErr = requirePageWriting(library); operationErr != nil {
			return out, operationErr
		}
		page, operationErr := s.pageRecord(ctx, tx, libraryID, pageID, a)
		if operationErr != nil {
			return out, operationErr
		}
		if page.State != "active" {
			return out, conversationError("conflict", "page_archived")
		}
		poll, operationErr := s.pollRecord(ctx, tx, libraryID, pageID, pollID, a)
		if operationErr != nil {
			return out, operationErr
		}
		if poll.Revision != in.ExpectedRevision {
			return out, conversationError("conflict", "page_poll_revision_conflict")
		}
		options, operationErr := normalizePollUpdateOptions(in.Options, poll.Options)
		if operationErr != nil {
			return out, operationErr
		}
		voters, operationErr := s.pollActiveVoters(ctx, tx, pollID, a)
		if operationErr != nil {
			return out, operationErr
		}
		if voters > 0 && (question != poll.Question || in.Multiple != poll.Multiple || !pollOptionsEqual(options, poll.Options)) {
			return out, conversationError("conflict", "page_poll_structure_locked")
		}
		poll.Question, poll.Options, poll.Multiple, poll.Status = question, options, in.Multiple, in.Status
		poll.Revision++
		poll.UpdatedByUserID = a.UserID
		poll.UpdatedAt = time.Now().UTC().Truncate(time.Millisecond)
		statement, args, buildErr := query.NewUpdateBuilder(s.store.Renderer(), knowledgePagePollTable).Set("status", poll.Status).Set("revision", poll.Revision).Set("updated_at", poll.UpdatedAt.UnixMilli()).Set("payload_json", conversationJSON(poll)).Where(query.And(pollScope(a, pollID), query.Equal("revision", in.ExpectedRevision))).Build()
		if operationErr = conversationCAS(ctx, tx, statement, args, buildErr); operationErr != nil {
			return out, conversationError("conflict", "page_poll_revision_conflict")
		}
		views, viewErr := s.pollViews(ctx, tx, pageID, []knowledgesdk.KnowledgePagePoll{poll}, a)
		if viewErr != nil {
			return out, viewErr
		}
		return views[0], nil
	}, &out)
	return
}

func normalizePollVote(poll knowledgesdk.KnowledgePagePoll, optionIDs []string) ([]string, error) {
	if len(optionIDs) > len(poll.Options) || !poll.Multiple && len(optionIDs) > 1 {
		return nil, conversationError("bad_request", "page_poll_ballot_invalid")
	}
	wanted := make(map[string]bool, len(optionIDs))
	for _, optionID := range optionIDs {
		if !validKnowledgePollOptionID(optionID) || wanted[optionID] {
			return nil, conversationError("bad_request", "page_poll_ballot_invalid")
		}
		wanted[optionID] = true
	}
	result := make([]string, 0, len(wanted))
	for _, option := range poll.Options {
		if wanted[option.ID] {
			result = append(result, option.ID)
			delete(wanted, option.ID)
		}
	}
	if len(wanted) != 0 {
		return nil, conversationError("bad_request", "page_poll_ballot_invalid")
	}
	return result, nil
}

func (s *Store) VoteKnowledgePagePoll(ctx context.Context, libraryID, pageID, pollID string, in knowledgesdk.KnowledgePagePollVote, a agentsdk.Authority) (out knowledgesdk.KnowledgePagePollView, err error) {
	if _, err = pageRequestKey("poll_vote", libraryID, pollID, in.ClientID, a); err != nil {
		return out, err
	}
	err = s.mutateKnowledgeOperation(ctx, "knowledge.page_poll.vote", knowledgesdk.ActionPagePollsVote, libraryID+":"+pageID+":"+pollID+":"+a.UserID, in.ClientID, in, a, func(tx *sql.Tx) (any, error) {
		library, operationErr := s.libraryRecord(ctx, tx, libraryID, a)
		if operationErr != nil {
			return out, operationErr
		}
		if library.Archived {
			return out, conversationError("conflict", "library_archived")
		}
		page, operationErr := s.pageRecord(ctx, tx, libraryID, pageID, a)
		if operationErr != nil {
			return out, operationErr
		}
		if page.State != "active" {
			return out, conversationError("conflict", "page_archived")
		}
		poll, operationErr := s.pollRecord(ctx, tx, libraryID, pageID, pollID, a)
		if operationErr != nil {
			return out, operationErr
		}
		if poll.Status != knowledgesdk.KnowledgePollStatusOpen {
			return out, conversationError("conflict", "page_poll_closed")
		}
		optionIDs, operationErr := normalizePollVote(poll, in.OptionIDs)
		if operationErr != nil {
			return out, operationErr
		}

		statement, args, buildErr := query.NewSelectBuilder(s.store.Renderer(), knowledgePagePollBallotTable).Columns("revision", "selection_count").Where(pollBallotScope(a, pollID, a.UserID)).Build()
		if buildErr != nil {
			return out, buildErr
		}
		var currentRevision, currentSelections int64
		readErr := tx.QueryRowContext(ctx, statement, args...).Scan(&currentRevision, &currentSelections)
		if readErr != nil && readErr != sql.ErrNoRows {
			return out, readErr
		}
		if readErr == sql.ErrNoRows {
			currentRevision, currentSelections = 0, 0
		}
		if currentRevision != in.ExpectedBallotRevision {
			return out, conversationError("conflict", "page_poll_ballot_revision_conflict")
		}
		if currentSelections == 0 && len(optionIDs) > 0 {
			voters, countErr := s.pollActiveVoters(ctx, tx, pollID, a)
			if countErr != nil {
				return out, countErr
			}
			if voters >= knowledgePagePollMaximumVoters {
				return out, conversationError("conflict", "page_poll_voter_limit_exceeded")
			}
		}

		nextRevision := currentRevision + 1
		now := time.Now().UTC().Truncate(time.Millisecond)
		if currentRevision == 0 {
			statement, args, buildErr = query.NewInsertBuilder(s.store.Renderer(), knowledgePagePollBallotTable).Columns("scope_key", "poll_id", "user_id", "library_id", "page_id", "revision", "selection_count", "updated_at").Values(libraryScope(a), pollID, a.UserID, libraryID, pageID, nextRevision, len(optionIDs), now.UnixMilli()).Build()
			if operationErr = conversationExec(ctx, tx, statement, args, buildErr); operationErr != nil {
				return out, operationErr
			}
		} else {
			statement, args, buildErr = query.NewUpdateBuilder(s.store.Renderer(), knowledgePagePollBallotTable).Set("revision", nextRevision).Set("selection_count", len(optionIDs)).Set("updated_at", now.UnixMilli()).Where(query.And(pollBallotScope(a, pollID, a.UserID), query.Equal("revision", currentRevision))).Build()
			if operationErr = conversationCAS(ctx, tx, statement, args, buildErr); operationErr != nil {
				return out, conversationError("conflict", "page_poll_ballot_revision_conflict")
			}
		}
		statement, args, buildErr = query.NewDeleteBuilder(s.store.Renderer(), knowledgePagePollSelectionTable).Where(pollBallotScope(a, pollID, a.UserID)).Build()
		if operationErr = conversationExec(ctx, tx, statement, args, buildErr); operationErr != nil {
			return out, operationErr
		}
		for _, optionID := range optionIDs {
			statement, args, buildErr = query.NewInsertBuilder(s.store.Renderer(), knowledgePagePollSelectionTable).Columns("scope_key", "poll_id", "user_id", "library_id", "page_id", "option_id").Values(libraryScope(a), pollID, a.UserID, libraryID, pageID, optionID).Build()
			if operationErr = conversationExec(ctx, tx, statement, args, buildErr); operationErr != nil {
				return out, operationErr
			}
		}
		views, viewErr := s.pollViews(ctx, tx, pageID, []knowledgesdk.KnowledgePagePoll{poll}, a)
		if viewErr != nil {
			return out, viewErr
		}
		return views[0], nil
	}, &out)
	return
}
