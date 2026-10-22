package store

import (
	"encoding/json"
	"strings"
	"testing"
	"time"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func createPublishedFormFixture(t *testing.T, store *Store, manager agentsdk.Authority, library agentsdk.KnowledgeLibrary, client, content string) knowledgesdk.KnowledgePageView {
	t.Helper()
	page, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: client + "-create", Title: "活动报名", ContentType: knowledgesdk.KnowledgePageTypeForm}, manager)
	if err != nil {
		t.Fatal(err)
	}
	page = savePageFixture(t, store, manager, library, page, client+"-save", "活动报名", content)
	return publishPageFixture(t, store, manager, library, page, client+"-publish")
}

func formAnswers(values map[string]string) map[string]json.RawMessage {
	answers := make(map[string]json.RawMessage, len(values))
	for key, value := range values {
		answers[key] = json.RawMessage(value)
	}
	return answers
}

func formChoiceCount(analytics knowledgesdk.KnowledgeFormAnalytics, key, value string) int64 {
	for _, question := range analytics.Questions {
		if question.Key != key {
			continue
		}
		for _, choice := range question.ChoiceCounts {
			if choice.Value == value {
				return choice.Count
			}
		}
	}
	return -1
}

func TestKnowledgePageFormSubmissionLifecycleAnalyticsAndExport(t *testing.T) {
	store, manager, library, _ := pageFixture(t)
	library = addPageMember(t, store, library, "bob", "reader", manager)
	library = addPageMember(t, store, library, "carol", "reader", manager)
	bob, carol := manager, manager
	bob.UserID, carol.UserID = "bob", "carol"
	page := createPublishedFormFixture(t, store, manager, library, "form-lifecycle", canonicalFormFixture)

	bobInput := knowledgesdk.KnowledgeFormSubmit{ClientID: "form-bob-submit", Answers: formAnswers(map[string]string{
		"name": `"=cmd"`, "attend": `"yes"`, "guests": `2`,
	})}
	bobSubmission, err := store.SubmitKnowledgePageForm(t.Context(), library.ID, page.Page.ID, bobInput, bob)
	if err != nil || bobSubmission.PublishedVersion != 1 || bobSubmission.SubmittedByUserID != bob.UserID || bobSubmission.ContentSHA256 != page.Published.Body.ContentSHA256 {
		t.Fatalf("valid published-form submission failed: submission=%+v err=%v", bobSubmission, err)
	}
	replayed, err := store.SubmitKnowledgePageForm(t.Context(), library.ID, page.Page.ID, bobInput, bob)
	if err != nil || replayed.ID != bobSubmission.ID {
		t.Fatalf("idempotent submission retry changed the answer set: replayed=%+v err=%v", replayed, err)
	}
	if _, err = store.SubmitKnowledgePageForm(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgeFormSubmit{ClientID: "form-bob-duplicate", Answers: bobInput.Answers}, bob); err == nil || !strings.Contains(err.Error(), "page_form_duplicate_submission") {
		t.Fatalf("duplicate submission was accepted: %v", err)
	}
	if _, err = store.SubmitKnowledgePageForm(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgeFormSubmit{ClientID: "form-carol-hidden", Answers: formAnswers(map[string]string{"name": `"Carol"`, "attend": `"no"`, "guests": `1`})}, carol); err == nil || !strings.Contains(err.Error(), "page_form_answer_hidden") {
		t.Fatalf("hidden conditional answer was accepted: %v", err)
	}
	carolSubmission, err := store.SubmitKnowledgePageForm(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgeFormSubmit{ClientID: "form-carol-submit", Answers: formAnswers(map[string]string{"name": `"Carol"`, "attend": `"no"`})}, carol)
	if err != nil || carolSubmission.PublishedVersion != 1 {
		t.Fatalf("conditional answer submission failed: submission=%+v err=%v", carolSubmission, err)
	}

	newDraft := strings.Replace(canonicalFormFixture, `"label":"姓名"`, `"label":"姓名（新版草稿）"`, 1)
	page = savePageFixture(t, store, manager, library, page, "form-unpublished-draft", "活动报名", newDraft)
	if page.Page.PublishedVersion != 1 || page.Draft.Body.Content == page.Published.Body.Content {
		t.Fatalf("test fixture did not create a distinct unpublished draft: %+v", page)
	}

	listed, err := store.KnowledgePageFormSubmissions(t.Context(), library.ID, page.Page.ID, "", 1, manager)
	if err != nil || len(listed.Items) != 1 || listed.Complete || listed.NextBefore == "" {
		t.Fatalf("manager response pagination is invalid: page=%+v err=%v", listed, err)
	}
	next, err := store.KnowledgePageFormSubmissions(t.Context(), library.ID, page.Page.ID, listed.NextBefore, 10, manager)
	if err != nil || len(next.Items) != 1 || !next.Complete {
		t.Fatalf("manager response continuation is invalid: page=%+v err=%v", next, err)
	}
	if _, err = store.KnowledgePageFormSubmissions(t.Context(), library.ID, page.Page.ID, "", 10, bob); err == nil {
		t.Fatal("reader could list protected form responses")
	}

	analytics, err := store.KnowledgePageFormAnalytics(t.Context(), library.ID, page.Page.ID, manager)
	if err != nil || analytics.PublishedVersion != 1 || analytics.TotalSubmissions != 2 || formChoiceCount(analytics, "attend", "yes") != 1 || formChoiceCount(analytics, "attend", "no") != 1 {
		t.Fatalf("form analytics are invalid: analytics=%+v err=%v", analytics, err)
	}
	exported, err := store.ExportKnowledgePageFormSubmissions(t.Context(), library.ID, page.Page.ID, manager)
	if err != nil || exported.ContentType != "text/csv; charset=utf-8" || !strings.HasPrefix(exported.Body, "\xEF\xBB\xBF") || !strings.Contains(exported.Body, "'=cmd") || !strings.Contains(exported.Body, "参加") {
		t.Fatalf("form CSV export is invalid or formula-unsafe: export=%+v err=%v", exported, err)
	}
}

func TestKnowledgePageFormSubmissionEnforcesPublishedSchemaRoleAndDeadline(t *testing.T) {
	store, manager, library, _ := pageFixture(t)
	library = addPageMember(t, store, library, "bob", "reader", manager)
	library = addPageMember(t, store, library, "carol", "editor", manager)
	bob, carol := manager, manager
	bob.UserID, carol.UserID = "bob", "carol"
	answers := formAnswers(map[string]string{"name": `"User"`, "attend": `"no"`})

	editorOnly := strings.Replace(canonicalFormFixture, `"submission_role":"reader"`, `"submission_role":"editor"`, 1)
	page := createPublishedFormFixture(t, store, manager, library, "form-role", editorOnly)
	if _, err := store.SubmitKnowledgePageForm(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgeFormSubmit{ClientID: "form-role-reader", Answers: answers}, bob); err == nil || !strings.Contains(err.Error(), "page_form_submit_denied") {
		t.Fatalf("reader bypassed form submission role: %v", err)
	}
	if _, err := store.SubmitKnowledgePageForm(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgeFormSubmit{ClientID: "form-role-editor", Answers: answers}, carol); err != nil {
		t.Fatalf("editor could not submit editor-only form: %v", err)
	}

	future := time.Now().UTC().Add(24 * time.Hour).Format(time.RFC3339)
	futureClose := time.Now().UTC().Add(48 * time.Hour).Format(time.RFC3339)
	notOpen := strings.Replace(canonicalFormFixture, `"opens_at":"2026-10-01T00:00:00Z","closes_at":"2026-12-01T00:00:00Z"`, `"opens_at":"`+future+`","closes_at":"`+futureClose+`"`, 1)
	page = createPublishedFormFixture(t, store, manager, library, "form-not-open", notOpen)
	if _, err := store.SubmitKnowledgePageForm(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgeFormSubmit{ClientID: "form-future-reader", Answers: answers}, bob); err == nil || !strings.Contains(err.Error(), "page_form_not_open") {
		t.Fatalf("future form accepted a submission: %v", err)
	}

	past := time.Now().UTC().Add(-24 * time.Hour).Format(time.RFC3339)
	closed := strings.Replace(canonicalFormFixture, `"opens_at":"2026-10-01T00:00:00Z","closes_at":"2026-12-01T00:00:00Z"`, `"opens_at":"","closes_at":"`+past+`"`, 1)
	page = createPublishedFormFixture(t, store, manager, library, "form-closed", closed)
	if _, err := store.SubmitKnowledgePageForm(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgeFormSubmit{ClientID: "form-closed-reader", Answers: answers}, bob); err == nil || !strings.Contains(err.Error(), "page_form_closed") {
		t.Fatalf("closed form accepted a submission: %v", err)
	}
}

func TestKnowledgePageFormRequiredCheckboxMustBeChecked(t *testing.T) {
	content := `{"schema_version":1,"display":"form","components":[{"type":"checkbox","key":"consent","label":"同意条款","input":true,"validate":{"required":true}}],"settings":{"submission_role":"reader","allow_multiple_submissions":false,"opens_at":"","closes_at":"","confirmation_message":"提交成功"}}`
	_, components, err := decodeFormCanonical(content)
	if err != nil {
		t.Fatal(err)
	}
	if _, err = normalizeFormAnswers(components, formAnswers(map[string]string{"consent": `false`})); err == nil || !strings.Contains(err.Error(), "page_form_answer_required") {
		t.Fatalf("required unchecked checkbox was accepted: %v", err)
	}
	if answers, checkedErr := normalizeFormAnswers(components, formAnswers(map[string]string{"consent": `true`})); checkedErr != nil || string(answers["consent"]) != "true" {
		t.Fatalf("required checked checkbox was rejected: answers=%v err=%v", answers, checkedErr)
	}
}

func TestKnowledgePageFormValidatesURLPhoneAndCurrencyAnswers(t *testing.T) {
	content := `{"schema_version":1,"display":"form","components":[{"type":"url","key":"site","label":"网站","input":true,"validate":{"required":true}},{"type":"phoneNumber","key":"phone","label":"电话","input":true,"inputMask":"","validate":{"required":true}},{"type":"currency","key":"budget","label":"预算","input":true,"currency":"CNY","validate":{"required":true,"min":0,"max":10000}}],"settings":{"submission_role":"reader","allow_multiple_submissions":false,"opens_at":"","closes_at":"","confirmation_message":"提交成功"}}`
	_, components, err := decodeFormCanonical(content)
	if err != nil {
		t.Fatal(err)
	}
	valid := formAnswers(map[string]string{"site": `"https://example.com/docs"`, "phone": `"+86 138-0013-8000"`, "budget": `888.5`})
	if _, err = normalizeFormAnswers(components, valid); err != nil {
		t.Fatalf("valid rich answers rejected: %v", err)
	}
	for name, answers := range map[string]map[string]json.RawMessage{
		"unsafe URL":      formAnswers(map[string]string{"site": `"javascript:alert(1)"`, "phone": `"+86 13800138000"`, "budget": `1`}),
		"invalid phone":   formAnswers(map[string]string{"site": `"https://example.com"`, "phone": `"call-me"`, "budget": `1`}),
		"excess currency": formAnswers(map[string]string{"site": `"https://example.com"`, "phone": `"13800138000"`, "budget": `10001`}),
	} {
		if _, failure := normalizeFormAnswers(components, answers); failure == nil {
			t.Fatalf("%s answer was accepted", name)
		}
	}
}

func TestKnowledgePageFormValidatesRatingScaleAndAttachmentAnswers(t *testing.T) {
	content := `{"schema_version":1,"display":"form","components":[{"type":"rating","key":"quality","label":"质量评分","input":true,"validate":{"required":true,"min":1,"max":5}},{"type":"scale","key":"recommend","label":"推荐意愿","input":true,"validate":{"required":true,"min":0,"max":10}},{"type":"file","key":"evidence","label":"证明材料","input":true,"maxFiles":2,"validate":{"required":true}}],"settings":{"submission_role":"reader","allow_multiple_submissions":false,"opens_at":"","closes_at":"","confirmation_message":"提交成功"}}`
	_, components, err := decodeFormCanonical(content)
	if err != nil {
		t.Fatal(err)
	}
	valid := formAnswers(map[string]string{"quality": `5`, "recommend": `8`, "evidence": `[{"document_id":"kdoc_0123456789abcdef0123456789abcdef","title":"报告.pdf"}]`})
	if _, err = normalizeFormAnswers(components, valid); err != nil {
		t.Fatalf("valid rich answers rejected: %v", err)
	}
	for name, answers := range map[string]map[string]json.RawMessage{
		"rating out of range": formAnswers(map[string]string{"quality": `6`, "recommend": `8`, "evidence": `[{"document_id":"kdoc_0123456789abcdef0123456789abcdef","title":"报告.pdf"}]`}),
		"fractional scale":    formAnswers(map[string]string{"quality": `5`, "recommend": `8.5`, "evidence": `[{"document_id":"kdoc_0123456789abcdef0123456789abcdef","title":"报告.pdf"}]`}),
		"invalid document":    formAnswers(map[string]string{"quality": `5`, "recommend": `8`, "evidence": `[{"document_id":"../../etc/passwd","title":"报告.pdf"}]`}),
	} {
		if _, failure := normalizeFormAnswers(components, answers); failure == nil {
			t.Fatalf("%s answer was accepted", name)
		}
	}
}
