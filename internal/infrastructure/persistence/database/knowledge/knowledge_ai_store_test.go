package store

import (
	"strings"
	"testing"
	"time"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func TestKnowledgeAIExecutionPinsSourceRequiresConfirmationAndNeverWritesPage(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	page = savePageFixture(t, store, authority, library, page, "ai-draft", "运行手册", "# 发布检查\n确认权限与索引")
	page = publishPageFixture(t, store, authority, library, page, "ai-publish")
	beforeDraft := *page.Draft

	execution, err := store.CreateKnowledgeAIExecution(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgeAIExecutionCreate{
		ClientID: "ai-create-1", Operation: knowledgesdk.KnowledgeAIOperationSummarize, SourceScope: knowledgesdk.KnowledgeAISourcePublished, BlockID: "block-1",
	}, authority)
	if err != nil || execution.State != knowledgesdk.KnowledgeAIExecutionPending || execution.Source.Reference == nil || execution.Source.Reference.LibraryID != library.ID || execution.Source.Reference.Version != page.Published.Version {
		t.Fatalf("AI execution did not freeze a published reference: %+v err=%v", execution, err)
	}
	work, claimed, err := store.ClaimKnowledgeAIExecution(t.Context(), authority.RuntimeID, time.Now().UTC().Add(time.Second), time.Minute)
	if err != nil || !claimed || work.ScopeKey == "" || work.Execution.Attempt != 1 {
		t.Fatalf("AI execution claim failed: claimed=%v work=%+v err=%v", claimed, work, err)
	}
	input, err := store.ReadKnowledgeAIExecutionSource(t.Context(), work, authority)
	if err != nil || !strings.Contains(input.SourceText, "发布检查") || input.Source.ContentSHA256 != execution.Source.ContentSHA256 {
		t.Fatalf("AI execution source mismatch: %+v err=%v", input, err)
	}
	if err = store.CompleteKnowledgeAIExecution(t.Context(), work, knowledgesdk.KnowledgeAIGenerationResult{Text: "发布前需要确认权限与索引。", Provider: "fake", Model: "test"}, ""); err != nil {
		t.Fatal(err)
	}
	completed, err := store.KnowledgeAIExecution(t.Context(), library.ID, page.Page.ID, execution.ID, authority)
	if err != nil || completed.State != knowledgesdk.KnowledgeAIExecutionCompleted || completed.Result == "" {
		t.Fatalf("AI execution did not complete durably: %+v err=%v", completed, err)
	}
	session, err := store.ConnectKnowledgeCollaboration(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgeCollaborationConnect{ClientID: "ai-confirm-session"}, authority)
	if err != nil {
		t.Fatal(err)
	}
	confirmed, err := store.ConfirmKnowledgeAIExecution(t.Context(), library.ID, page.Page.ID, execution.ID, knowledgesdk.KnowledgeAIExecutionConfirm{
		ClientID: "ai-confirm-1", ExpectedRevision: completed.Revision, SessionID: session.ID,
	}, authority)
	if err != nil || confirmed.State != knowledgesdk.KnowledgeAIExecutionConfirmed || confirmed.ConfirmedAt.IsZero() {
		t.Fatalf("AI confirmation failed: %+v err=%v", confirmed, err)
	}
	after, err := store.KnowledgePage(t.Context(), library.ID, page.Page.ID, true, authority)
	if err != nil || after.Draft.DraftRevision != beforeDraft.DraftRevision || after.Draft.Body.ContentSHA256 != beforeDraft.Body.ContentSHA256 {
		t.Fatalf("confirmation silently mutated the page draft: before=%+v after=%+v err=%v", beforeDraft, after.Draft, err)
	}

	restarted := New(store.store)
	persisted, err := restarted.KnowledgeAIExecution(t.Context(), library.ID, page.Page.ID, execution.ID, authority)
	if err != nil || persisted.State != knowledgesdk.KnowledgeAIExecutionConfirmed || persisted.Result != confirmed.Result {
		t.Fatalf("AI execution was not durable across restart: %+v err=%v", persisted, err)
	}
}

func TestKnowledgeAIDraftExecutionRequiresActiveSessionAndRejectsChangedSource(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	page = savePageFixture(t, store, authority, library, page, "ai-draft-source", "草稿", "原始草稿")
	if _, err := store.CreateKnowledgeAIExecution(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgeAIExecutionCreate{
		ClientID: "ai-draft-without-session", Operation: knowledgesdk.KnowledgeAIOperationRewrite, SourceScope: knowledgesdk.KnowledgeAISourceDraft,
	}, authority); err == nil || !strings.Contains(err.Error(), "ai_execution_session_required") {
		t.Fatalf("draft execution accepted no collaboration session: %v", err)
	}
	session, err := store.ConnectKnowledgeCollaboration(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgeCollaborationConnect{ClientID: "ai-draft-session"}, authority)
	if err != nil {
		t.Fatal(err)
	}
	execution, err := store.CreateKnowledgeAIExecution(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgeAIExecutionCreate{
		ClientID: "ai-draft-create", Operation: knowledgesdk.KnowledgeAIOperationRewrite, Prompt: "更简洁", SourceScope: knowledgesdk.KnowledgeAISourceDraft, SessionID: session.ID,
	}, authority)
	if err != nil || execution.Source.DraftRevision != page.Draft.DraftRevision || execution.Source.Reference != nil {
		t.Fatalf("draft source was not frozen: %+v err=%v", execution, err)
	}
	work, claimed, err := store.ClaimKnowledgeAIExecution(t.Context(), authority.RuntimeID, time.Now().UTC().Add(time.Second), time.Minute)
	if err != nil || !claimed {
		t.Fatalf("draft work claim failed: claimed=%v err=%v", claimed, err)
	}
	if _, err = store.ReadKnowledgeAIExecutionSource(t.Context(), work, authority); err != nil {
		t.Fatalf("active draft source unreadable: %v", err)
	}
	page = savePageFixture(t, store, authority, library, page, "ai-draft-changed", "草稿", "已经变化的草稿")
	if _, err = store.ReadKnowledgeAIExecutionSource(t.Context(), work, authority); err == nil || (!strings.Contains(err.Error(), "ai_execution_source_changed") && !strings.Contains(err.Error(), "collaboration_session_revoked")) {
		t.Fatalf("changed draft source was accepted: %v", err)
	}
	if err = store.CompleteKnowledgeAIExecution(t.Context(), work, knowledgesdk.KnowledgeAIGenerationResult{}, "source_changed"); err != nil {
		t.Fatal(err)
	}
	failed, err := store.KnowledgeAIExecution(t.Context(), library.ID, page.Page.ID, execution.ID, authority)
	if err != nil || failed.State != knowledgesdk.KnowledgeAIExecutionFailed || failed.ErrorCode != "source_changed" {
		t.Fatalf("changed draft execution did not fail safely: %+v err=%v", failed, err)
	}
}
