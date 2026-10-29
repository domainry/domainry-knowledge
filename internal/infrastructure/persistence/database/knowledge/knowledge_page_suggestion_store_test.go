package store

import (
	"errors"
	"strings"
	"testing"
	"time"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func suggestionAnchorFixture(t *testing.T, content, nodeID, quote string) knowledgesdk.KnowledgePageCommentAnchor {
	t.Helper()
	anchor, err := knowledgeDocumentCommentAnchor(content, nodeID, quote)
	if err != nil {
		t.Fatal(err)
	}
	anchor.BlockSHA256 = ""
	return anchor
}

func TestKnowledgePageSuggestionAcceptsInsertAndDeleteIntoDraft(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	page = savePageFixture(t, store, authority, library, page, "suggestion-base", "修订页面", "第一段")

	insert, err := store.CreateKnowledgePageSuggestion(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageSuggestionCreate{
		ClientID: "suggest-insert", Source: knowledgesdk.KnowledgeSuggestionSourceKnowledgeUI, Kind: knowledgesdk.KnowledgeSuggestionInsert, BaseDraftRevision: page.Draft.DraftRevision,
		Anchor: suggestionAnchorFixture(t, page.Draft.Body.Content, "block-1", "第一段"), ProposedText: "补充内容", Comment: "建议补充说明",
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	if insert.Status != knowledgesdk.KnowledgeSuggestionOpen || insert.ProposedBlockID == "" || insert.Anchor.BlockSHA256 == "" {
		t.Fatalf("unexpected insert suggestion: %+v", insert)
	}
	accepted, err := store.DecideKnowledgePageSuggestion(t.Context(), library.ID, page.Page.ID, insert.ID, knowledgesdk.KnowledgePageSuggestionDecision{
		ClientID: "accept-insert", Source: knowledgesdk.KnowledgeSuggestionSourceKnowledgeUI, ExpectedRevision: insert.Revision, ExpectedDraftRevision: page.Draft.DraftRevision, Decision: knowledgesdk.KnowledgeSuggestionDecisionAccept,
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	if accepted.Status != knowledgesdk.KnowledgeSuggestionAccepted || accepted.DecidedByUserID != authority.UserID {
		t.Fatalf("unexpected accepted suggestion: %+v", accepted)
	}
	page, err = store.KnowledgePage(t.Context(), library.ID, page.Page.ID, true, authority)
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(page.Draft.Body.Content, "补充内容") || page.Draft.DraftRevision != insert.BaseDraftRevision+1 {
		t.Fatalf("accepted insertion was not applied to the draft: %+v", page.Draft)
	}
	history, err := store.KnowledgePageEditHistory(t.Context(), library.ID, page.Page.ID, 0, 10, authority)
	if err != nil || len(history.Items) < 1 || history.Items[0].Changes[0].NodeID != insert.ProposedBlockID || history.Items[0].Changes[0].Kind != "insert" {
		t.Fatalf("accepted insertion did not write block history: history=%+v err=%v", history, err)
	}

	deleteSuggestion, err := store.CreateKnowledgePageSuggestion(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageSuggestionCreate{
		ClientID: "suggest-delete", Source: knowledgesdk.KnowledgeSuggestionSourceKnowledgeUI, Kind: knowledgesdk.KnowledgeSuggestionDelete, BaseDraftRevision: page.Draft.DraftRevision,
		Anchor: suggestionAnchorFixture(t, page.Draft.Body.Content, insert.ProposedBlockID, "补充内容"), Comment: "删除重复内容",
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	if _, err = store.DecideKnowledgePageSuggestion(t.Context(), library.ID, page.Page.ID, deleteSuggestion.ID, knowledgesdk.KnowledgePageSuggestionDecision{
		ClientID: "accept-delete", Source: knowledgesdk.KnowledgeSuggestionSourceKnowledgeUI, ExpectedRevision: deleteSuggestion.Revision, ExpectedDraftRevision: page.Draft.DraftRevision, Decision: knowledgesdk.KnowledgeSuggestionDecisionAccept,
	}, authority); err != nil {
		t.Fatal(err)
	}
	page, err = store.KnowledgePage(t.Context(), library.ID, page.Page.ID, true, authority)
	if err != nil {
		t.Fatal(err)
	}
	if strings.Contains(page.Draft.Body.Content, "补充内容") {
		t.Fatalf("accepted deletion remained in draft: %s", page.Draft.Body.Content)
	}
}

func TestKnowledgePageSuggestionDetectsChangedAnchorAndSupportsDecisions(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	page = savePageFixture(t, store, authority, library, page, "suggestion-decision-base", "修订页面", "原始内容")
	create := func(client string) knowledgesdk.KnowledgePageSuggestion {
		t.Helper()
		value, err := store.CreateKnowledgePageSuggestion(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageSuggestionCreate{
			ClientID: client, Source: knowledgesdk.KnowledgeSuggestionSourceKnowledgeUI, Kind: knowledgesdk.KnowledgeSuggestionInsert, BaseDraftRevision: page.Draft.DraftRevision,
			Anchor: suggestionAnchorFixture(t, page.Draft.Body.Content, "block-1", "原始内容"), ProposedText: "提议内容",
		}, authority)
		if err != nil {
			t.Fatal(err)
		}
		return value
	}
	rejected := create("suggest-reject")
	rejected, err := store.DecideKnowledgePageSuggestion(t.Context(), library.ID, page.Page.ID, rejected.ID, knowledgesdk.KnowledgePageSuggestionDecision{
		ClientID: "reject", Source: knowledgesdk.KnowledgeSuggestionSourceKnowledgeUI, ExpectedRevision: rejected.Revision, ExpectedDraftRevision: page.Draft.DraftRevision, Decision: knowledgesdk.KnowledgeSuggestionDecisionReject,
	}, authority)
	if err != nil || rejected.Status != knowledgesdk.KnowledgeSuggestionRejected {
		t.Fatalf("reject failed: suggestion=%+v err=%v", rejected, err)
	}
	withdrawn := create("suggest-withdraw")
	withdrawn, err = store.DecideKnowledgePageSuggestion(t.Context(), library.ID, page.Page.ID, withdrawn.ID, knowledgesdk.KnowledgePageSuggestionDecision{
		ClientID: "withdraw", Source: knowledgesdk.KnowledgeSuggestionSourceKnowledgeUI, ExpectedRevision: withdrawn.Revision, ExpectedDraftRevision: page.Draft.DraftRevision, Decision: knowledgesdk.KnowledgeSuggestionDecisionWithdraw,
	}, authority)
	if err != nil || withdrawn.Status != knowledgesdk.KnowledgeSuggestionWithdrawn {
		t.Fatalf("withdraw failed: suggestion=%+v err=%v", withdrawn, err)
	}
	stale := create("suggest-stale")
	page = savePageFixture(t, store, authority, library, page, "suggestion-anchor-change", "修订页面", "已被其他人修改")
	items, err := store.KnowledgePageSuggestions(t.Context(), library.ID, page.Page.ID, authority)
	if err != nil {
		t.Fatal(err)
	}
	var changed bool
	for _, item := range items.Items {
		if item.ID == stale.ID {
			changed = item.Anchor.Changed
		}
	}
	if !changed {
		t.Fatalf("changed suggestion anchor was not marked: %+v", items.Items)
	}
	_, err = store.DecideKnowledgePageSuggestion(t.Context(), library.ID, page.Page.ID, stale.ID, knowledgesdk.KnowledgePageSuggestionDecision{
		ClientID: "accept-stale", Source: knowledgesdk.KnowledgeSuggestionSourceKnowledgeUI, ExpectedRevision: stale.Revision, ExpectedDraftRevision: page.Draft.DraftRevision, Decision: knowledgesdk.KnowledgeSuggestionDecisionAccept,
	}, authority)
	var failure *knowledgesdk.Error
	if !errors.As(err, &failure) || failure.Code != "knowledge.page_suggestion_anchor_changed" {
		t.Fatalf("stale anchor was accepted: %v", err)
	}
}

func TestKnowledgePageSuggestionAgentReplacePreservesBlockAndPublishedVersion(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	page = savePageFixture(t, store, authority, library, page, "replace-base", "修订页面", "发布正文")
	page = publishPageFixture(t, store, authority, library, page, "replace-publish")
	anchor, err := knowledgeDocumentCommentAnchor(page.Draft.Body.Content, "block-1", "发布正文")
	if err != nil {
		t.Fatal(err)
	}
	replacement, err := store.CreateKnowledgePageSuggestion(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageSuggestionCreate{
		ClientID: "agent-propose", Source: knowledgesdk.KnowledgeSuggestionSourceVerdentAgent, ToolCallID: "tool-propose-1",
		Kind: knowledgesdk.KnowledgeSuggestionReplace, BaseDraftRevision: page.Draft.DraftRevision,
		Anchor: suggestionAnchorFixture(t, page.Draft.Body.Content, "block-1", "发布正文"), ExpectedBlockSHA256: anchor.BlockSHA256,
		ProposedText: "Agent 替换后的草稿", Comment: "来自会话确认的修改",
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	if replacement.Source != knowledgesdk.KnowledgeSuggestionSourceVerdentAgent || replacement.ClientID != "agent-propose" || replacement.ToolCallID != "tool-propose-1" || replacement.Anchor.BlockSHA256 != anchor.BlockSHA256 || replacement.ProposedBlockID != "" {
		t.Fatalf("replace suggestion lost provenance or stable anchor: %+v", replacement)
	}

	liveResult := make(chan knowledgesdk.KnowledgePageLiveEventBatch, 1)
	liveFailure := make(chan error, 1)
	go func() {
		batch, waitErr := store.KnowledgePageLiveEvents(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageLiveEvents{AfterRevision: page.Page.Revision, WaitMillis: 2500}, authority)
		if waitErr != nil {
			liveFailure <- waitErr
			return
		}
		liveResult <- batch
	}()

	accepted, err := store.DecideKnowledgePageSuggestion(t.Context(), library.ID, page.Page.ID, replacement.ID, knowledgesdk.KnowledgePageSuggestionDecision{
		ClientID: "agent-apply", Source: knowledgesdk.KnowledgeSuggestionSourceVerdentAgent, ToolCallID: "tool-apply-1",
		ExpectedRevision: replacement.Revision, ExpectedDraftRevision: page.Draft.DraftRevision, Decision: knowledgesdk.KnowledgeSuggestionDecisionAccept,
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	if accepted.DecisionSource != knowledgesdk.KnowledgeSuggestionSourceVerdentAgent || accepted.DecisionClientID != "agent-apply" || accepted.DecisionToolCallID != "tool-apply-1" {
		t.Fatalf("replace decision lost agent invocation: %+v", accepted)
	}
	select {
	case batch := <-liveResult:
		if len(batch.Events) != 1 || batch.Events[0].Type != knowledgesdk.KnowledgePageLiveEventChanged || batch.Revision <= page.Page.Revision {
			t.Fatalf("accepted replace did not wake the existing page live-event stream: %+v", batch)
		}
	case waitErr := <-liveFailure:
		t.Fatalf("page live-event stream failed: %v", waitErr)
	case <-time.After(3 * time.Second):
		t.Fatal("accepted replace did not notify the existing page live-event stream")
	}
	current, err := store.KnowledgePage(t.Context(), library.ID, page.Page.ID, true, authority)
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(current.Draft.Body.Content, `"id":"block-1"`) || !strings.Contains(current.Draft.Body.Content, "Agent 替换后的草稿") || strings.Contains(current.Draft.Body.Content, "发布正文") {
		t.Fatalf("replace did not preserve the block ID and replace only draft content: %s", current.Draft.Body.Content)
	}
	if current.Published == nil || !strings.Contains(current.Published.Body.Content, "发布正文") || strings.Contains(current.Published.Body.Content, "Agent 替换后的草稿") {
		t.Fatalf("replace modified the immutable published version: %+v", current.Published)
	}
	history, err := store.KnowledgePageEditHistory(t.Context(), library.ID, page.Page.ID, 0, 10, authority)
	if err != nil || len(history.Items) == 0 || len(history.Items[0].Changes) != 1 || history.Items[0].Changes[0].NodeID != "block-1" || history.Items[0].Changes[0].Kind != "update" {
		t.Fatalf("replace did not reuse block edit history: history=%+v err=%v", history, err)
	}
}

func TestKnowledgePageSuggestionReplaceRejectsStaleHashAndInvalidProvenance(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	page = savePageFixture(t, store, authority, library, page, "replace-conflict-base", "修订页面", "当前正文")
	base := knowledgesdk.KnowledgePageSuggestionCreate{
		ClientID: "agent-stale", Source: knowledgesdk.KnowledgeSuggestionSourceVerdentAgent, ToolCallID: "tool-stale-1",
		Kind: knowledgesdk.KnowledgeSuggestionReplace, BaseDraftRevision: page.Draft.DraftRevision,
		Anchor: suggestionAnchorFixture(t, page.Draft.Body.Content, "block-1", "当前正文"), ExpectedBlockSHA256: strings.Repeat("0", 64), ProposedText: "不能覆盖",
	}
	_, err := store.CreateKnowledgePageSuggestion(t.Context(), library.ID, page.Page.ID, base, authority)
	var failure *knowledgesdk.Error
	if !errors.As(err, &failure) || failure.Class != "conflict" || failure.Code != "knowledge.page_suggestion_anchor_changed" {
		t.Fatalf("stale replace hash was not an explicit conflict: %v", err)
	}
	base.ClientID, base.Source, base.ToolCallID = "agent-source-missing", "", ""
	_, err = store.CreateKnowledgePageSuggestion(t.Context(), library.ID, page.Page.ID, base, authority)
	if !errors.As(err, &failure) || failure.Class != "bad_request" || failure.Code != "knowledge.page_suggestion_invalid" {
		t.Fatalf("missing explicit provenance was accepted: %v", err)
	}
}

func TestKnowledgePageSuggestionReplaceRejectsDraftRevisionConflictsWithoutOverwrite(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	page = savePageFixture(t, store, authority, library, page, "replace-revision-base", "修订页面", "基线正文")
	anchor, err := knowledgeDocumentCommentAnchor(page.Draft.Body.Content, "block-1", "基线正文")
	if err != nil {
		t.Fatal(err)
	}
	input := knowledgesdk.KnowledgePageSuggestionCreate{
		ClientID: "agent-old-revision", Source: knowledgesdk.KnowledgeSuggestionSourceVerdentAgent, ToolCallID: "tool-old-revision",
		Kind: knowledgesdk.KnowledgeSuggestionReplace, BaseDraftRevision: page.Draft.DraftRevision - 1,
		Anchor: suggestionAnchorFixture(t, page.Draft.Body.Content, "block-1", "基线正文"), ExpectedBlockSHA256: anchor.BlockSHA256, ProposedText: "不得写入",
	}
	_, err = store.CreateKnowledgePageSuggestion(t.Context(), library.ID, page.Page.ID, input, authority)
	var failure *knowledgesdk.Error
	if !errors.As(err, &failure) || failure.Class != "conflict" || failure.Code != "knowledge.page_suggestion_draft_changed" {
		t.Fatalf("stale base draft revision was not an explicit conflict: %v", err)
	}

	input.ClientID, input.ToolCallID, input.BaseDraftRevision = "agent-current-revision", "tool-current-revision", page.Draft.DraftRevision
	replacement, err := store.CreateKnowledgePageSuggestion(t.Context(), library.ID, page.Page.ID, input, authority)
	if err != nil {
		t.Fatal(err)
	}
	page = savePageFixture(t, store, authority, library, page, "concurrent-editor", "修订页面", "并发编辑正文")
	_, err = store.DecideKnowledgePageSuggestion(t.Context(), library.ID, page.Page.ID, replacement.ID, knowledgesdk.KnowledgePageSuggestionDecision{
		ClientID: "agent-stale-apply", Source: knowledgesdk.KnowledgeSuggestionSourceVerdentAgent, ToolCallID: "tool-stale-apply",
		ExpectedRevision: replacement.Revision, ExpectedDraftRevision: replacement.BaseDraftRevision, Decision: knowledgesdk.KnowledgeSuggestionDecisionAccept,
	}, authority)
	if !errors.As(err, &failure) || failure.Class != "conflict" || failure.Code != "knowledge.page_suggestion_draft_changed" {
		t.Fatalf("stale apply draft revision was not an explicit conflict: %v", err)
	}
	current, err := store.KnowledgePage(t.Context(), library.ID, page.Page.ID, true, authority)
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(current.Draft.Body.Content, "并发编辑正文") || strings.Contains(current.Draft.Body.Content, "不得写入") {
		t.Fatalf("stale replace overwrote the concurrent draft: %s", current.Draft.Body.Content)
	}
	items, err := store.KnowledgePageSuggestions(t.Context(), library.ID, page.Page.ID, authority)
	if err != nil {
		t.Fatal(err)
	}
	for _, item := range items.Items {
		if item.ID == replacement.ID && item.Status != knowledgesdk.KnowledgeSuggestionOpen {
			t.Fatalf("failed replace was retried or closed instead of remaining open: %+v", item)
		}
	}
}
