package store

import (
	"context"
	"database/sql"
	"slices"
	"sort"
	"strings"
	"time"

	"github.com/domainry/domainry-foundation/entityid"
	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-orm/query"
)

const (
	knowledgePageTaskMaximumTitleBytes = 2048
	knowledgePageTaskMaximumAssignees  = 20
)

func validKnowledgeTaskID(id string) bool {
	return entityid.Validate("ktask", id) == nil
}

func taskScope(a agentsdk.Authority, id string) query.Predicate {
	return query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("task_id", id))
}

func validKnowledgeTaskStatus(value string) bool {
	return value == knowledgesdk.KnowledgeTaskStatusTodo || value == knowledgesdk.KnowledgeTaskStatusInProgress || value == knowledgesdk.KnowledgeTaskStatusDone || value == knowledgesdk.KnowledgeTaskStatusCanceled
}

func validKnowledgeTaskPriority(value string) bool {
	return value == knowledgesdk.KnowledgeTaskPriorityNone || value == knowledgesdk.KnowledgeTaskPriorityLow || value == knowledgesdk.KnowledgeTaskPriorityMedium || value == knowledgesdk.KnowledgeTaskPriorityHigh || value == knowledgesdk.KnowledgeTaskPriorityUrgent
}

func normalizedTaskAssignees(values []string) ([]string, error) {
	if len(values) > knowledgePageTaskMaximumAssignees {
		return nil, conversationError("bad_request", "page_task_assignees_invalid")
	}
	result := append([]string(nil), values...)
	sort.Strings(result)
	for index, value := range result {
		if !validLibraryUser(value) || index > 0 && result[index-1] == value {
			return nil, conversationError("bad_request", "page_task_assignees_invalid")
		}
	}
	return result, nil
}

func normalizedTaskTime(value *time.Time) (*time.Time, error) {
	if value == nil {
		return nil, nil
	}
	normalized := value.UTC().Truncate(time.Millisecond)
	if normalized.Year() < 1970 || normalized.Year() > 9999 {
		return nil, conversationError("bad_request", "page_task_time_invalid")
	}
	return &normalized, nil
}

func normalizeKnowledgeTaskInput(title, priority string, assignees []string, dueAt, reminderAt *time.Time) (string, string, []string, *time.Time, *time.Time, error) {
	if !executionText(title, knowledgePageTaskMaximumTitleBytes, true) {
		return "", "", nil, nil, nil, conversationError("bad_request", "page_task_invalid")
	}
	title = strings.TrimSpace(title)
	if priority == "" {
		priority = knowledgesdk.KnowledgeTaskPriorityNone
	}
	if !validKnowledgeTaskPriority(priority) {
		return "", "", nil, nil, nil, conversationError("bad_request", "page_task_priority_invalid")
	}
	normalizedAssignees, err := normalizedTaskAssignees(assignees)
	if err != nil {
		return "", "", nil, nil, nil, err
	}
	due, err := normalizedTaskTime(dueAt)
	if err != nil {
		return "", "", nil, nil, nil, err
	}
	reminder, err := normalizedTaskTime(reminderAt)
	if err != nil {
		return "", "", nil, nil, nil, err
	}
	if reminder != nil && (due == nil || reminder.After(*due)) {
		return "", "", nil, nil, nil, conversationError("bad_request", "page_task_reminder_invalid")
	}
	return title, priority, normalizedAssignees, due, reminder, nil
}

func taskInstantMillis(value *time.Time) int64 {
	if value == nil {
		return 0
	}
	return value.UnixMilli()
}

func (s *Store) validateTaskAssignees(ctx context.Context, tx *sql.Tx, libraryID string, users []string, a agentsdk.Authority) error {
	for _, userID := range users {
		var member agentsdk.KnowledgeLibraryMember
		found, err := s.executionRead(ctx, tx, knowledgeLibraryMemberTable, libraryMemberPredicate(a, libraryID, agentsdk.KnowledgeSubjectUser, userID), &member)
		if err != nil {
			return err
		}
		if !found || !validLibraryRole(member.Role) {
			return conversationError("bad_request", "page_task_assignee_unavailable")
		}
	}
	return nil
}

func (s *Store) taskRecord(ctx context.Context, db conversationDB, libraryID, pageID, taskID string, a agentsdk.Authority) (knowledgesdk.KnowledgePageTask, error) {
	var task knowledgesdk.KnowledgePageTask
	if !validKnowledgeTaskID(taskID) {
		return task, conversationError("bad_request", "page_task_invalid")
	}
	found, err := s.executionRead(ctx, db, knowledgePageTaskTable, taskScope(a, taskID), &task)
	if err != nil {
		return task, err
	}
	if !found || task.LibraryID != libraryID || task.PageID != pageID {
		return knowledgesdk.KnowledgePageTask{}, conversationError("not_found", "page_task_not_found")
	}
	return task, nil
}

func (s *Store) KnowledgePageTasks(ctx context.Context, libraryID, pageID string, a agentsdk.Authority) (out knowledgesdk.KnowledgePageTaskPage, err error) {
	out.Items = []knowledgesdk.KnowledgePageTask{}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		if _, e := s.libraryRecord(ctx, tx, libraryID, a); e != nil {
			return e
		}
		if _, e := s.pageRecord(ctx, tx, libraryID, pageID, a); e != nil {
			return e
		}
		q, args, e := query.NewSelectBuilder(s.store.Renderer(), knowledgePageTaskTable).Columns("payload_json").Where(query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("library_id", libraryID), query.Equal("page_id", pageID))).OrderBy(query.Ascending("task_id")).Build()
		if e != nil {
			return e
		}
		rows, e := tx.QueryContext(ctx, q, args...)
		if e != nil {
			return e
		}
		defer rows.Close()
		for rows.Next() {
			var raw []byte
			var task knowledgesdk.KnowledgePageTask
			if e = rows.Scan(&raw); e != nil {
				return e
			}
			if e = unmarshalDurableJSON(raw, &task); e != nil {
				return e
			}
			out.Items = append(out.Items, task)
		}
		return rows.Err()
	})
	return
}

func (s *Store) CreateKnowledgePageTask(ctx context.Context, libraryID, pageID string, in knowledgesdk.KnowledgePageTaskCreate, a agentsdk.Authority) (out knowledgesdk.KnowledgePageTask, err error) {
	if !knowledgeBlockIDPattern.MatchString(in.SourceBlockID) {
		return out, conversationError("bad_request", "page_task_source_invalid")
	}
	title, priority, assignees, dueAt, reminderAt, err := normalizeKnowledgeTaskInput(in.Title, in.Priority, in.AssigneeUserIDs, in.DueAt, in.ReminderAt)
	if err != nil {
		return out, err
	}
	if _, err = pageRequestKey("task_create", libraryID, pageID, in.ClientID, a); err != nil {
		return out, err
	}
	err = s.mutateKnowledgeOperation(ctx, "knowledge.page_task.create", knowledgesdk.ActionPageTasksCreate, libraryID+":"+pageID+":"+in.SourceBlockID, in.ClientID, in, a, func(tx *sql.Tx) (any, error) {
		library, e := s.libraryRecord(ctx, tx, libraryID, a)
		if e != nil {
			return out, e
		}
		if e = requirePageWriting(library); e != nil {
			return out, e
		}
		page, e := s.pageRecord(ctx, tx, libraryID, pageID, a)
		if e != nil {
			return out, e
		}
		if page.State != "active" {
			return out, conversationError("conflict", "page_archived")
		}
		var existing knowledgesdk.KnowledgePageTask
		found, e := s.executionRead(ctx, tx, knowledgePageTaskTable, query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("page_id", pageID), query.Equal("source_block_id", in.SourceBlockID)), &existing)
		if e != nil {
			return out, e
		}
		if found {
			return existing, nil
		}
		if e = s.validateTaskAssignees(ctx, tx, libraryID, assignees, a); e != nil {
			return out, e
		}
		id, e := randomKnowledgeID("ktask_")
		if e != nil {
			return out, e
		}
		now := time.Now().UTC().Truncate(time.Millisecond)
		out = knowledgesdk.KnowledgePageTask{ID: id, LibraryID: libraryID, PageID: pageID, SourceBlockID: in.SourceBlockID, Title: title, Status: knowledgesdk.KnowledgeTaskStatusTodo, AssigneeUserIDs: assignees, DueAt: dueAt, ReminderAt: reminderAt, Priority: priority, Revision: 1, CreatedByUserID: a.UserID, UpdatedByUserID: a.UserID, CreatedAt: now, UpdatedAt: now}
		q, args, e := query.NewInsertBuilder(s.store.Renderer(), knowledgePageTaskTable).Columns("scope_key", "task_id", "library_id", "page_id", "source_block_id", "status", "priority", "revision", "due_at", "reminder_at", "updated_at", "payload_json").Values(libraryScope(a), id, libraryID, pageID, in.SourceBlockID, out.Status, out.Priority, out.Revision, taskInstantMillis(out.DueAt), taskInstantMillis(out.ReminderAt), now.UnixMilli(), conversationJSON(out)).Build()
		if e != nil {
			return out, e
		}
		if _, e = tx.ExecContext(ctx, q, args...); e != nil {
			return out, e
		}
		return out, nil
	}, &out)
	return
}

func (s *Store) UpdateKnowledgePageTask(ctx context.Context, libraryID, pageID, taskID string, in knowledgesdk.KnowledgePageTaskUpdate, a agentsdk.Authority) (out knowledgesdk.KnowledgePageTask, err error) {
	if !validKnowledgeTaskStatus(in.Status) {
		return out, conversationError("bad_request", "page_task_status_invalid")
	}
	title, priority, assignees, dueAt, reminderAt, err := normalizeKnowledgeTaskInput(in.Title, in.Priority, in.AssigneeUserIDs, in.DueAt, in.ReminderAt)
	if err != nil {
		return out, err
	}
	if _, err = pageRequestKey("task_update", libraryID, taskID, in.ClientID, a); err != nil {
		return out, err
	}
	err = s.mutateKnowledgeOperation(ctx, "knowledge.page_task.update", knowledgesdk.ActionPageTasksUpdate, libraryID+":"+pageID+":"+taskID, in.ClientID, in, a, func(tx *sql.Tx) (any, error) {
		library, e := s.libraryRecord(ctx, tx, libraryID, a)
		if e != nil {
			return out, e
		}
		if library.Archived {
			return out, conversationError("conflict", "library_archived")
		}
		page, e := s.pageRecord(ctx, tx, libraryID, pageID, a)
		if e != nil {
			return out, e
		}
		if page.State != "active" {
			return out, conversationError("conflict", "page_archived")
		}
		out, e = s.taskRecord(ctx, tx, libraryID, pageID, taskID, a)
		if e != nil {
			return out, e
		}
		if out.Revision != in.ExpectedRevision {
			return out, conversationError("conflict", "page_task_revision_conflict")
		}
		isEditor := library.Role == "editor" || library.Role == "manager"
		isAssignee := slices.Contains(out.AssigneeUserIDs, a.UserID)
		if !isEditor && (!isAssignee || title != out.Title || priority != out.Priority || !slices.Equal(assignees, out.AssigneeUserIDs) || !taskTimesEqual(dueAt, out.DueAt) || !taskTimesEqual(reminderAt, out.ReminderAt)) {
			return out, conversationError("forbidden", "page_task_update_denied")
		}
		if e = s.validateTaskAssignees(ctx, tx, libraryID, assignees, a); e != nil {
			return out, e
		}
		out.Title, out.Status, out.AssigneeUserIDs, out.DueAt, out.ReminderAt, out.Priority = title, in.Status, assignees, dueAt, reminderAt, priority
		out.Revision++
		out.UpdatedByUserID = a.UserID
		out.UpdatedAt = time.Now().UTC().Truncate(time.Millisecond)
		q, args, e := query.NewUpdateBuilder(s.store.Renderer(), knowledgePageTaskTable).Set("status", out.Status).Set("priority", out.Priority).Set("revision", out.Revision).Set("due_at", taskInstantMillis(out.DueAt)).Set("reminder_at", taskInstantMillis(out.ReminderAt)).Set("updated_at", out.UpdatedAt.UnixMilli()).Set("payload_json", conversationJSON(out)).Where(query.And(taskScope(a, taskID), query.Equal("revision", in.ExpectedRevision))).Build()
		if e = conversationCAS(ctx, tx, q, args, e); e != nil {
			return out, conversationError("conflict", "page_task_revision_conflict")
		}
		return out, nil
	}, &out)
	return
}

func taskTimesEqual(left, right *time.Time) bool {
	if left == nil || right == nil {
		return left == nil && right == nil
	}
	return left.Equal(*right)
}
