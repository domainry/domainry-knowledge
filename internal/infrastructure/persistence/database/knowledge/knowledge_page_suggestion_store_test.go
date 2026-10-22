package store

import (
	"errors"
	"strings"
	"testing"

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
		ClientID: "suggest-insert", Kind: knowledgesdk.KnowledgeSuggestionInsert, BaseDraftRevision: page.Draft.DraftRevision,
		Anchor: suggestionAnchorFixture(t, page.Draft.Body.Content, "block-1", "第一段"), ProposedText: "补充内容", Comment: "建议补充说明",
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	if insert.Status != knowledgesdk.KnowledgeSuggestionOpen || insert.ProposedBlockID == "" || insert.Anchor.BlockSHA256 == "" {
		t.Fatalf("unexpected insert suggestion: %+v", insert)
	}
	accepted, err := store.DecideKnowledgePageSuggestion(t.Context(), library.ID, page.Page.ID, insert.ID, knowledgesdk.KnowledgePageSuggestionDecision{
		ClientID: "accept-insert", ExpectedRevision: insert.Revision, ExpectedDraftRevision: page.Draft.DraftRevision, Decision: knowledgesdk.KnowledgeSuggestionDecisionAccept,
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
		ClientID: "suggest-delete", Kind: knowledgesdk.KnowledgeSuggestionDelete, BaseDraftRevision: page.Draft.DraftRevision,
		Anchor: suggestionAnchorFixture(t, page.Draft.Body.Content, insert.ProposedBlockID, "补充内容"), Comment: "删除重复内容",
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	if _, err = store.DecideKnowledgePageSuggestion(t.Context(), library.ID, page.Page.ID, deleteSuggestion.ID, knowledgesdk.KnowledgePageSuggestionDecision{
		ClientID: "accept-delete", ExpectedRevision: deleteSuggestion.Revision, ExpectedDraftRevision: page.Draft.DraftRevision, Decision: knowledgesdk.KnowledgeSuggestionDecisionAccept,
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
			ClientID: client, Kind: knowledgesdk.KnowledgeSuggestionInsert, BaseDraftRevision: page.Draft.DraftRevision,
			Anchor: suggestionAnchorFixture(t, page.Draft.Body.Content, "block-1", "原始内容"), ProposedText: "提议内容",
		}, authority)
		if err != nil {
			t.Fatal(err)
		}
		return value
	}
	rejected := create("suggest-reject")
	rejected, err := store.DecideKnowledgePageSuggestion(t.Context(), library.ID, page.Page.ID, rejected.ID, knowledgesdk.KnowledgePageSuggestionDecision{
		ClientID: "reject", ExpectedRevision: rejected.Revision, ExpectedDraftRevision: page.Draft.DraftRevision, Decision: knowledgesdk.KnowledgeSuggestionDecisionReject,
	}, authority)
	if err != nil || rejected.Status != knowledgesdk.KnowledgeSuggestionRejected {
		t.Fatalf("reject failed: suggestion=%+v err=%v", rejected, err)
	}
	withdrawn := create("suggest-withdraw")
	withdrawn, err = store.DecideKnowledgePageSuggestion(t.Context(), library.ID, page.Page.ID, withdrawn.ID, knowledgesdk.KnowledgePageSuggestionDecision{
		ClientID: "withdraw", ExpectedRevision: withdrawn.Revision, ExpectedDraftRevision: page.Draft.DraftRevision, Decision: knowledgesdk.KnowledgeSuggestionDecisionWithdraw,
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
		ClientID: "accept-stale", ExpectedRevision: stale.Revision, ExpectedDraftRevision: page.Draft.DraftRevision, Decision: knowledgesdk.KnowledgeSuggestionDecisionAccept,
	}, authority)
	var failure *knowledgesdk.Error
	if !errors.As(err, &failure) || failure.Code != "knowledge.page_suggestion_anchor_changed" {
		t.Fatalf("stale anchor was accepted: %v", err)
	}
}
