package store

import (
	"strings"
	"testing"
	"time"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func TestKnowledgePageTaskStateIsIndependentIdempotentAndMemberBound(t *testing.T) {
	store, manager, library, page := pageFixture(t)
	library, err := store.SetKnowledgeLibraryMember(t.Context(), library.ID, "bob", agentsdk.KnowledgeLibraryMemberWrite{Role: "reader", ExpectedRevision: library.Revision}, manager)
	if err != nil {
		t.Fatal(err)
	}
	due := time.Now().UTC().Add(48 * time.Hour).Truncate(time.Millisecond)
	reminder := due.Add(-2 * time.Hour)
	create := knowledgesdk.KnowledgePageTaskCreate{
		ClientID: "task-create-1", SourceBlockID: "task-block-1", Title: "完成协作验收",
		AssigneeUserIDs: []string{"bob"}, DueAt: &due, ReminderAt: &reminder, Priority: knowledgesdk.KnowledgeTaskPriorityHigh,
	}
	task, err := store.CreateKnowledgePageTask(t.Context(), library.ID, page.Page.ID, create, manager)
	if err != nil {
		t.Fatal(err)
	}
	if task.Status != knowledgesdk.KnowledgeTaskStatusTodo || task.Revision != 1 || task.SourceBlockID != create.SourceBlockID || len(task.AssigneeUserIDs) != 1 || task.AssigneeUserIDs[0] != "bob" {
		t.Fatalf("created task does not preserve the task protocol: %+v", task)
	}
	replayed, err := store.CreateKnowledgePageTask(t.Context(), library.ID, page.Page.ID, create, manager)
	if err != nil || replayed.ID != task.ID || replayed.Revision != task.Revision {
		t.Fatalf("task create retry did not return the durable receipt: replayed=%+v err=%v", replayed, err)
	}

	bob := agentsdk.Authority{Known: true, RuntimeID: manager.RuntimeID, WorkspaceID: manager.WorkspaceID, UserID: "bob", RoleKey: "reader"}
	update := knowledgesdk.KnowledgePageTaskUpdate{
		ClientID: "task-update-1", ExpectedRevision: task.Revision, Title: task.Title,
		Status: knowledgesdk.KnowledgeTaskStatusDone, AssigneeUserIDs: task.AssigneeUserIDs,
		DueAt: task.DueAt, ReminderAt: task.ReminderAt, Priority: task.Priority,
	}
	done, err := store.UpdateKnowledgePageTask(t.Context(), library.ID, page.Page.ID, task.ID, update, bob)
	if err != nil {
		t.Fatal(err)
	}
	if done.Status != knowledgesdk.KnowledgeTaskStatusDone || done.Revision != 2 || done.UpdatedByUserID != "bob" {
		t.Fatalf("assigned reader could not complete the task: %+v", done)
	}
	replayedUpdate, err := store.UpdateKnowledgePageTask(t.Context(), library.ID, page.Page.ID, task.ID, update, bob)
	if err != nil || replayedUpdate.Revision != done.Revision || replayedUpdate.Status != done.Status {
		t.Fatalf("task update retry did not return the durable receipt: replayed=%+v err=%v", replayedUpdate, err)
	}

	currentPage, err := store.KnowledgePage(t.Context(), library.ID, page.Page.ID, true, manager)
	if err != nil {
		t.Fatal(err)
	}
	versions, err := store.KnowledgePageVersions(t.Context(), library.ID, page.Page.ID, 0, 20, manager)
	if err != nil {
		t.Fatal(err)
	}
	if currentPage.Page.Revision != page.Page.Revision || currentPage.Draft.DraftRevision != page.Draft.DraftRevision || currentPage.Page.PublishedVersion != 0 || len(versions.Items) != 0 {
		t.Fatalf("task state leaked into page/draft/version state: page=%+v versions=%+v", currentPage, versions.Items)
	}

	metadataUpdate := knowledgesdk.KnowledgePageTaskUpdate{
		ClientID: "task-update-reader-metadata", ExpectedRevision: done.Revision, Title: "reader 不能改标题",
		Status: done.Status, AssigneeUserIDs: done.AssigneeUserIDs, DueAt: done.DueAt, ReminderAt: done.ReminderAt, Priority: done.Priority,
	}
	if _, err = store.UpdateKnowledgePageTask(t.Context(), library.ID, page.Page.ID, task.ID, metadataUpdate, bob); err == nil || !strings.Contains(err.Error(), "page_task_update_denied") {
		t.Fatalf("assigned reader changed task metadata: %v", err)
	}
	invalidAssignee := knowledgesdk.KnowledgePageTaskCreate{ClientID: "task-create-invalid-assignee", SourceBlockID: "task-block-2", Title: "不可指派", AssigneeUserIDs: []string{"mallory"}, Priority: knowledgesdk.KnowledgeTaskPriorityNone}
	if _, err = store.CreateKnowledgePageTask(t.Context(), library.ID, page.Page.ID, invalidAssignee, manager); err == nil || !strings.Contains(err.Error(), "page_task_assignee_unavailable") {
		t.Fatalf("non-member assignee was accepted: %v", err)
	}
}

func TestNormalizeKnowledgeTaskInputKeepsEmptyAssigneesAsArray(t *testing.T) {
	_, _, assignees, _, _, err := normalizeKnowledgeTaskInput("空负责人任务", knowledgesdk.KnowledgeTaskPriorityNone, []string{}, nil, nil)
	if err != nil {
		t.Fatal(err)
	}
	if assignees == nil || len(assignees) != 0 {
		t.Fatalf("empty assignees must remain an allocated empty slice, got %#v", assignees)
	}
}
