package store

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"strings"
	"testing"
	"time"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-orm/query"
)

func referenceDocumentContent(blockID, targetPageID, title, contentType, display, mode string, version int64) string {
	props := map[string]any{
		"targetPageId":  targetPageID,
		"title":         title,
		"targetType":    contentType,
		"display":       display,
		"referenceMode": mode,
		"targetVersion": version,
		"embeddedEdit":  display == "embed" && mode == "live",
	}
	payload := map[string]any{"blocks": []any{map[string]any{
		"id": blockID, "type": "knowledgeReference", "props": props, "content": []any{}, "children": []any{},
	}}}
	raw, _ := json.Marshal(payload)
	return string(raw)
}

func pageCountForReferenceTest(t *testing.T, store *Store, libraryID string, authority knowledgesdk.Authority) int {
	t.Helper()
	q, args, err := query.NewSelectBuilder(store.store.Renderer(), knowledgePageTable).Projections(query.Project(query.CountAll())).Where(query.And(query.Equal("scope_key", libraryScope(authority)), query.Equal("library_id", libraryID))).Build()
	if err != nil {
		t.Fatal(err)
	}
	var count int
	if err = store.store.Database().QueryRowContext(t.Context(), q, args...).Scan(&count); err != nil {
		t.Fatal(err)
	}
	return count
}

func TestDocumentPageReferencesIgnoreUnresolvedDraftBlocks(t *testing.T) {
	content := referenceDocumentContent("reference-draft", "", "未选择知识条目", knowledgesdk.KnowledgePageTypeDocument, "card", "live", 0)
	references, err := documentPageReferences("kpage_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "klib_bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", content, time.Unix(0, 0))
	if err != nil {
		t.Fatal(err)
	}
	if len(references) != 0 {
		t.Fatalf("unresolved draft reference must not be indexed: %+v", references)
	}
}

func TestCreateKnowledgePageReferenceIsAtomicAndIdempotent(t *testing.T) {
	store, authority, library, parent := pageFixture(t)
	placeholder := `{"blocks":[{"id":"reference-block","type":"paragraph","props":{},"content":[],"children":[]}]}`
	input := knowledgesdk.KnowledgePageReferenceCreate{
		ClientID: "create-reference-1", ExpectedParentDraftRevision: parent.Draft.DraftRevision, ExpectedParentPageRevision: parent.Page.Revision,
		ParentContentSchemaVersion: knowledgesdk.PageContentSchemaVersion, ParentContent: placeholder, ReferenceBlockID: "reference-block",
		Title: "项目数据", ContentType: knowledgesdk.KnowledgePageTypeMultidimensionalTable, Display: "embed",
	}
	created, err := store.CreateKnowledgePageReference(t.Context(), library.ID, parent.Page.ID, input, authority)
	if err != nil {
		t.Fatal(err)
	}
	if created.Parent.Draft == nil || created.Parent.Draft.DraftRevision != parent.Draft.DraftRevision+1 || created.Parent.Page.Revision != parent.Page.Revision+1 {
		t.Fatalf("parent was not changed exactly once: %+v", created.Parent)
	}
	if created.Target.Draft == nil || created.Target.Page.ParentPageID != parent.Page.ID || created.Target.Page.ContentType != input.ContentType {
		t.Fatalf("target child is invalid: %+v", created.Target)
	}
	var body struct {
		Blocks []struct {
			ID    string         `json:"id"`
			Type  string         `json:"type"`
			Props map[string]any `json:"props"`
		} `json:"blocks"`
	}
	if err = json.Unmarshal([]byte(created.Parent.Draft.Body.Content), &body); err != nil || len(body.Blocks) != 1 {
		t.Fatalf("parent reference body is invalid: body=%+v err=%v", body, err)
	}
	block := body.Blocks[0]
	if block.ID != input.ReferenceBlockID || block.Type != "knowledgeReference" || block.Props["targetPageId"] != created.Target.Page.ID || block.Props["targetType"] != input.ContentType || block.Props["referenceMode"] != "live" || block.Props["embeddedEdit"] != true {
		t.Fatalf("reference block was not governed by the created target: %+v", block)
	}

	replayed, err := store.CreateKnowledgePageReference(t.Context(), library.ID, parent.Page.ID, input, authority)
	if err != nil || replayed.Target.Page.ID != created.Target.Page.ID || pageCountForReferenceTest(t, store, library.ID, authority) != 2 {
		t.Fatalf("idempotent retry created a duplicate: replay=%+v err=%v", replayed, err)
	}

	current, err := store.KnowledgePage(t.Context(), library.ID, parent.Page.ID, true, authority)
	if err != nil {
		t.Fatal(err)
	}
	bad := knowledgesdk.KnowledgePageReferenceCreate{
		ClientID: "create-reference-bad", ExpectedParentDraftRevision: current.Draft.DraftRevision, ExpectedParentPageRevision: current.Page.Revision,
		ParentContentSchemaVersion: knowledgesdk.PageContentSchemaVersion, ParentContent: current.Draft.Body.Content, ReferenceBlockID: "missing-block",
		Title: "不应创建", ContentType: knowledgesdk.KnowledgePageTypeSpreadsheet, Display: "card",
	}
	if _, err = store.CreateKnowledgePageReference(t.Context(), library.ID, parent.Page.ID, bad, authority); err == nil || !strings.Contains(err.Error(), "page_reference_source_block_not_found") {
		t.Fatalf("missing source block must fail atomically: %v", err)
	}
	if count := pageCountForReferenceTest(t, store, library.ID, authority); count != 2 {
		t.Fatalf("failed composite operation leaked a target page: count=%d", count)
	}
}

func TestKnowledgePageReferencesListsOutgoingAndIncomingWithLiveTitles(t *testing.T) {
	store, authority, library, source := pageFixture(t)
	target, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "reference-list-target", Title: "当前目标标题", ContentType: knowledgesdk.KnowledgePageTypeDocument}, authority)
	if err != nil {
		t.Fatal(err)
	}
	content := referenceDocumentContent("reference-list-block", target.Page.ID, "过期快照标题", target.Page.ContentType, "card", "live", 0)
	if _, err = store.SaveKnowledgePageDraft(t.Context(), library.ID, source.Page.ID, knowledgesdk.KnowledgePageDraftWrite{
		ClientID: "reference-list-save", ExpectedDraftRevision: source.Draft.DraftRevision, ExpectedPageRevision: source.Page.Revision,
		Title: source.Page.Title, Rank: source.Page.Rank, ContentSchemaVersion: knowledgesdk.PageContentSchemaVersion, Content: content,
	}, authority); err != nil {
		t.Fatal(err)
	}

	outgoing, err := store.KnowledgePageReferences(t.Context(), library.ID, source.Page.ID, knowledgesdk.KnowledgePageReferenceOutgoing, "", 20, authority)
	if err != nil || !outgoing.Complete || len(outgoing.Items) != 1 {
		t.Fatalf("outgoing reference list mismatch: page=%+v err=%v", outgoing, err)
	}
	link := outgoing.Items[0]
	if !link.Available || link.SourcePageID != source.Page.ID || link.TargetPageID != target.Page.ID || link.TargetTitle != target.Page.Title || link.TargetTitle == "过期快照标题" || link.BlockID != "reference-list-block" {
		t.Fatalf("outgoing reference did not resolve the live authorized target: %+v", link)
	}

	incoming, err := store.KnowledgePageReferences(t.Context(), library.ID, target.Page.ID, knowledgesdk.KnowledgePageReferenceIncoming, "", 20, authority)
	if err != nil || !incoming.Complete || len(incoming.Items) != 1 {
		t.Fatalf("incoming backlink list mismatch: page=%+v err=%v", incoming, err)
	}
	if incoming.Items[0].SourcePageID != source.Page.ID || incoming.Items[0].SourceTitle != source.Page.Title || incoming.Items[0].TargetTitle != target.Page.Title {
		t.Fatalf("incoming backlink did not resolve both live page titles: %+v", incoming.Items[0])
	}
}

func TestKnowledgePageReferencesRecheckReaderVisibility(t *testing.T) {
	t.Run("unpublished current page is not a readable graph entry", func(t *testing.T) {
		store, manager, library, page := pageFixture(t)
		library = addPageMember(t, store, library, "bob", "reader", manager)
		bob := manager
		bob.UserID = "bob"
		if _, err := store.KnowledgePageReferences(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageReferenceOutgoing, "", 20, bob); err == nil || !strings.Contains(err.Error(), "page_not_found") {
			t.Fatalf("reader accessed reference graph for an unpublished page: %v", err)
		}
	})

	t.Run("incoming backlinks hide an inaccessible source", func(t *testing.T) {
		store, manager, library, source := pageFixture(t)
		target, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "reference-private-source-target", Title: "公开目标", ContentType: knowledgesdk.KnowledgePageTypeDocument}, manager)
		if err != nil {
			t.Fatal(err)
		}
		source, err = store.SaveKnowledgePageDraft(t.Context(), library.ID, source.Page.ID, knowledgesdk.KnowledgePageDraftWrite{
			ClientID: "reference-private-source-save", ExpectedDraftRevision: source.Draft.DraftRevision, ExpectedPageRevision: source.Page.Revision,
			Title: source.Page.Title, Rank: source.Page.Rank, ContentSchemaVersion: knowledgesdk.PageContentSchemaVersion,
			Content: referenceDocumentContent("private-source-reference", target.Page.ID, target.Page.Title, target.Page.ContentType, "card", "live", 0),
		}, manager)
		if err != nil {
			t.Fatal(err)
		}
		target = publishPageFixture(t, store, manager, library, target, "reference-private-target-publish")
		source = publishPageFixture(t, store, manager, library, source, "reference-private-source-publish")
		library = addPageMember(t, store, library, "bob", "reader", manager)
		setPageAccessFixture(t, store, library.ID, source.Page.ID, "reference-private-source-acl", 1, knowledgesdk.KnowledgePageAccessRestricted, nil, manager)
		bob := manager
		bob.UserID = "bob"

		incoming, listErr := store.KnowledgePageReferences(t.Context(), library.ID, target.Page.ID, knowledgesdk.KnowledgePageReferenceIncoming, "", 20, bob)
		if listErr != nil || !incoming.Complete || len(incoming.Items) != 0 {
			t.Fatalf("private source leaked through incoming backlinks: page=%+v err=%v", incoming, listErr)
		}
	})

	t.Run("outgoing references retain only an unavailable target tombstone", func(t *testing.T) {
		store, manager, library, source := pageFixture(t)
		target, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "reference-private-target", Title: "私密目标", ContentType: knowledgesdk.KnowledgePageTypeDocument}, manager)
		if err != nil {
			t.Fatal(err)
		}
		source, err = store.SaveKnowledgePageDraft(t.Context(), library.ID, source.Page.ID, knowledgesdk.KnowledgePageDraftWrite{
			ClientID: "reference-private-target-save", ExpectedDraftRevision: source.Draft.DraftRevision, ExpectedPageRevision: source.Page.Revision,
			Title: source.Page.Title, Rank: source.Page.Rank, ContentSchemaVersion: knowledgesdk.PageContentSchemaVersion,
			Content: referenceDocumentContent("private-target-reference", target.Page.ID, target.Page.Title, target.Page.ContentType, "embed", "live", 0),
		}, manager)
		if err != nil {
			t.Fatal(err)
		}
		target = publishPageFixture(t, store, manager, library, target, "reference-private-target-publish")
		source = publishPageFixture(t, store, manager, library, source, "reference-private-source-publish")
		library = addPageMember(t, store, library, "bob", "reader", manager)
		setPageAccessFixture(t, store, library.ID, target.Page.ID, "reference-private-target-acl", 1, knowledgesdk.KnowledgePageAccessRestricted, nil, manager)
		bob := manager
		bob.UserID = "bob"

		outgoing, listErr := store.KnowledgePageReferences(t.Context(), library.ID, source.Page.ID, knowledgesdk.KnowledgePageReferenceOutgoing, "", 20, bob)
		if listErr != nil || !outgoing.Complete || len(outgoing.Items) != 1 {
			t.Fatalf("outgoing reference tombstone mismatch: page=%+v err=%v", outgoing, listErr)
		}
		link := outgoing.Items[0]
		if link.Available || link.TargetPageID != target.Page.ID || link.TargetTitle != "" || link.TargetType != "" {
			t.Fatalf("private target metadata leaked through outgoing reference: %+v", link)
		}
	})
}

func TestKnowledgePageReferenceGraphRejectsMismatchMissingVersionAndCycle(t *testing.T) {
	store, authority, library, first := pageFixture(t)
	second, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "reference-second", Title: "第二页", ContentType: knowledgesdk.KnowledgePageTypeDocument}, authority)
	if err != nil {
		t.Fatal(err)
	}

	wrongType := referenceDocumentContent("wrong-type", second.Page.ID, second.Page.Title, knowledgesdk.KnowledgePageTypeSpreadsheet, "card", "live", 0)
	_, err = store.SaveKnowledgePageDraft(t.Context(), library.ID, first.Page.ID, knowledgesdk.KnowledgePageDraftWrite{
		ClientID: "reference-wrong-type", ExpectedDraftRevision: first.Draft.DraftRevision, ExpectedPageRevision: first.Page.Revision,
		Title: first.Page.Title, Rank: first.Page.Rank, ContentSchemaVersion: knowledgesdk.PageContentSchemaVersion, Content: wrongType,
	}, authority)
	if err == nil || !strings.Contains(err.Error(), "page_reference_type_mismatch") {
		t.Fatalf("reference type mismatch was accepted: %v", err)
	}

	fixedWithoutVersion := referenceDocumentContent("fixed-missing", second.Page.ID, second.Page.Title, second.Page.ContentType, "card", "fixed", 2)
	_, err = store.SaveKnowledgePageDraft(t.Context(), library.ID, first.Page.ID, knowledgesdk.KnowledgePageDraftWrite{
		ClientID: "reference-fixed-missing", ExpectedDraftRevision: first.Draft.DraftRevision, ExpectedPageRevision: first.Page.Revision,
		Title: first.Page.Title, Rank: first.Page.Rank, ContentSchemaVersion: knowledgesdk.PageContentSchemaVersion, Content: fixedWithoutVersion,
	}, authority)
	if err == nil || !strings.Contains(err.Error(), "page_version_not_found") {
		t.Fatalf("missing fixed version was accepted: %v", err)
	}

	firstToSecond := referenceDocumentContent("first-to-second", second.Page.ID, second.Page.Title, second.Page.ContentType, "embed", "live", 0)
	first, err = store.SaveKnowledgePageDraft(t.Context(), library.ID, first.Page.ID, knowledgesdk.KnowledgePageDraftWrite{
		ClientID: "reference-first-second", ExpectedDraftRevision: first.Draft.DraftRevision, ExpectedPageRevision: first.Page.Revision,
		Title: first.Page.Title, Rank: first.Page.Rank, ContentSchemaVersion: knowledgesdk.PageContentSchemaVersion, Content: firstToSecond,
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	secondToFirst := referenceDocumentContent("second-to-first", first.Page.ID, first.Page.Title, first.Page.ContentType, "card", "live", 0)
	_, err = store.SaveKnowledgePageDraft(t.Context(), library.ID, second.Page.ID, knowledgesdk.KnowledgePageDraftWrite{
		ClientID: "reference-cycle", ExpectedDraftRevision: second.Draft.DraftRevision, ExpectedPageRevision: second.Page.Revision,
		Title: second.Page.Title, Rank: second.Page.Rank, ContentSchemaVersion: knowledgesdk.PageContentSchemaVersion, Content: secondToFirst,
	}, authority)
	if err == nil || !strings.Contains(err.Error(), "page_reference_cycle") {
		t.Fatalf("reference cycle was accepted: %v", err)
	}

	q, args, buildErr := query.NewSelectBuilder(store.store.Renderer(), knowledgePageReferenceTable).Columns("target_page_id", "content_type", "reference_mode", "target_version").Where(query.And(query.Equal("scope_key", libraryScope(authority)), query.Equal("source_page_id", first.Page.ID), query.Equal("block_id", "first-to-second"))).Build()
	if buildErr != nil {
		t.Fatal(buildErr)
	}
	var targetID, contentType, mode string
	var version int64
	if err = store.store.Database().QueryRowContext(t.Context(), q, args...).Scan(&targetID, &contentType, &mode, &version); err != nil {
		t.Fatal(err)
	}
	if targetID != second.Page.ID || contentType != knowledgesdk.KnowledgePageTypeDocument || mode != "live" || version != 0 {
		t.Fatalf("reference graph row is invalid: target=%s type=%s mode=%s version=%d", targetID, contentType, mode, version)
	}
	q, args, buildErr = query.NewSelectBuilder(store.store.Renderer(), knowledgePageReferenceTable).Projections(query.Project(query.CountAll())).Where(query.And(query.Equal("scope_key", libraryScope(authority)), query.Equal("source_page_id", second.Page.ID))).Build()
	if buildErr != nil {
		t.Fatal(buildErr)
	}
	var rejectedRows int
	if err = store.store.Database().QueryRowContext(t.Context(), q, args...).Scan(&rejectedRows); err != nil && err != sql.ErrNoRows {
		t.Fatal(err)
	}
	if rejectedRows != 0 {
		t.Fatalf("rejected cycle leaked graph rows: %d", rejectedRows)
	}
}

func TestKnowledgePageReferenceGraphAcceptsPublishedFixedVersion(t *testing.T) {
	store, authority, library, parent := pageFixture(t)
	target, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "fixed-target", Title: "固定目标", ContentType: knowledgesdk.KnowledgePageTypeDocument}, authority)
	if err != nil {
		t.Fatal(err)
	}
	target = savePageFixture(t, store, authority, library, target, "fixed-target-save", target.Page.Title, "固定版本正文")
	target = publishPageFixture(t, store, authority, library, target, "fixed-target-publish")
	content := referenceDocumentContent("fixed-reference", target.Page.ID, target.Page.Title, target.Page.ContentType, "embed", "fixed", target.Published.Version)
	parent, err = store.SaveKnowledgePageDraft(t.Context(), library.ID, parent.Page.ID, knowledgesdk.KnowledgePageDraftWrite{
		ClientID: "fixed-reference-save", ExpectedDraftRevision: parent.Draft.DraftRevision, ExpectedPageRevision: parent.Page.Revision,
		Title: parent.Page.Title, Rank: parent.Page.Rank, ContentSchemaVersion: knowledgesdk.PageContentSchemaVersion, Content: content,
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	if parent.Draft == nil || !strings.Contains(parent.Draft.Body.Content, fmt.Sprintf(`"targetVersion":%d`, target.Published.Version)) {
		t.Fatalf("fixed reference version was not retained: %+v", parent.Draft)
	}
}

func TestKnowledgePageReferenceGraphRejectsExcessiveDepth(t *testing.T) {
	store, authority, library, first := pageFixture(t)
	pages := make([]knowledgesdk.KnowledgePageView, knowledgePageReferenceMaximumDepth+2)
	pages[0] = first
	for index := 1; index < len(pages); index++ {
		created, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{
			ClientID: fmt.Sprintf("reference-depth-page-%d", index), Title: fmt.Sprintf("深度页面 %d", index), ContentType: knowledgesdk.KnowledgePageTypeDocument,
		}, authority)
		if err != nil {
			t.Fatal(err)
		}
		pages[index] = created
	}
	for index := len(pages) - 2; index >= 1; index-- {
		current, target := pages[index], pages[index+1]
		content := referenceDocumentContent(fmt.Sprintf("depth-reference-%d", index), target.Page.ID, target.Page.Title, target.Page.ContentType, "embed", "live", 0)
		saved, err := store.SaveKnowledgePageDraft(t.Context(), library.ID, current.Page.ID, knowledgesdk.KnowledgePageDraftWrite{
			ClientID: fmt.Sprintf("reference-depth-save-%d", index), ExpectedDraftRevision: current.Draft.DraftRevision, ExpectedPageRevision: current.Page.Revision,
			Title: current.Page.Title, Rank: current.Page.Rank, ContentSchemaVersion: knowledgesdk.PageContentSchemaVersion, Content: content,
		}, authority)
		if err != nil {
			t.Fatalf("depth %d should still be accepted: %v", len(pages)-1-index, err)
		}
		pages[index] = saved
	}
	root, target := pages[0], pages[1]
	tooDeep := referenceDocumentContent("depth-reference-root", target.Page.ID, target.Page.Title, target.Page.ContentType, "embed", "live", 0)
	_, err := store.SaveKnowledgePageDraft(t.Context(), library.ID, root.Page.ID, knowledgesdk.KnowledgePageDraftWrite{
		ClientID: "reference-depth-rejected", ExpectedDraftRevision: root.Draft.DraftRevision, ExpectedPageRevision: root.Page.Revision,
		Title: root.Page.Title, Rank: root.Page.Rank, ContentSchemaVersion: knowledgesdk.PageContentSchemaVersion, Content: tooDeep,
	}, authority)
	if err == nil || !strings.Contains(err.Error(), "page_reference_depth") {
		t.Fatalf("reference chain deeper than %d was accepted: %v", knowledgePageReferenceMaximumDepth, err)
	}
}
