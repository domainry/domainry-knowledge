package store

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"path/filepath"
	"strings"
	"sync"
	"testing"
	"time"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge/internal/infrastructure/documentstorage"
)

func documentContentFixture(text string) string {
	if text == "" {
		return `{"blocks":[]}`
	}
	blocks := make([]map[string]any, 0)
	for index, line := range strings.Split(text, "\n") {
		if line == "" {
			continue
		}
		blockType := "paragraph"
		props := map[string]any{}
		trimmed := line
		if strings.HasPrefix(line, "# ") {
			blockType, trimmed, props = "heading", strings.TrimPrefix(line, "# "), map[string]any{"level": 1}
		}
		blocks = append(blocks, map[string]any{"id": fmt.Sprintf("block-%d", index+1), "type": blockType, "props": props, "content": []any{map[string]any{"type": "text", "text": trimmed, "styles": map[string]any{}}}, "children": []any{}})
	}
	raw, _ := json.Marshal(map[string]any{"blocks": blocks})
	return string(raw)
}

func pageFixture(t *testing.T) (*Store, agentsdk.Authority, agentsdk.KnowledgeLibrary, knowledgesdk.KnowledgePageView) {
	t.Helper()
	store, _ := openSubjectKnowledgeStore(t)
	authority := agentsdk.Authority{Known: true, RuntimeID: "page-runtime", WorkspaceID: "page-workspace", UserID: "alice", RoleKey: "editor"}
	library, err := store.CreateKnowledgeLibrary(t.Context(), agentsdk.KnowledgeLibraryCreate{ClientID: "page-library", Kind: "shared", Name: "页面资料库"}, authority)
	if err != nil {
		t.Fatal(err)
	}
	page, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "page-create", Title: "开始", ContentType: knowledgesdk.KnowledgePageTypeDocument}, authority)
	if err != nil {
		t.Fatal(err)
	}
	return store, authority, library, page
}

func savePageFixture(t *testing.T, store *Store, authority agentsdk.Authority, library agentsdk.KnowledgeLibrary, page knowledgesdk.KnowledgePageView, client, title, content string) knowledgesdk.KnowledgePageView {
	t.Helper()
	if page.Page.ContentType == knowledgesdk.KnowledgePageTypeDocument {
		content = documentContentFixture(content)
	}
	updated, err := store.SaveKnowledgePageDraft(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageDraftWrite{
		ClientID: client, ExpectedDraftRevision: page.Draft.DraftRevision, ExpectedPageRevision: page.Page.Revision,
		Title: title, ParentPageID: page.Page.ParentPageID, Rank: page.Page.Rank,
		ContentSchemaVersion: knowledgesdk.PageContentSchemaVersion, Content: content,
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	return updated
}

func publishPageFixture(t *testing.T, store *Store, authority agentsdk.Authority, library agentsdk.KnowledgeLibrary, page knowledgesdk.KnowledgePageView, client string) knowledgesdk.KnowledgePageView {
	t.Helper()
	published, err := store.PublishKnowledgePage(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePagePublish{
		ClientID: client, ExpectedPageRevision: page.Page.Revision, ExpectedDraftRevision: page.Draft.DraftRevision, PublishNote: "发布验收",
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	return published
}

func TestKnowledgePageDraftCASPublishHistoryAndRestore(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	if page.Published != nil || page.Draft == nil || page.Draft.DraftRevision != 1 {
		t.Fatalf("new page must contain only an empty draft: %+v", page)
	}

	base := *page.Draft
	results := make(chan error, 2)
	var wait sync.WaitGroup
	for index, content := range []string{documentContentFixture("第一位编辑者"), documentContentFixture("第二位编辑者")} {
		wait.Add(1)
		go func(index int, content string) {
			defer wait.Done()
			_, err := store.SaveKnowledgePageDraft(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageDraftWrite{
				ClientID: "concurrent-" + string(rune('a'+index)), ExpectedDraftRevision: base.DraftRevision, ExpectedPageRevision: page.Page.Revision,
				Title: "并发草稿", Rank: page.Page.Rank, ContentSchemaVersion: knowledgesdk.PageContentSchemaVersion, Content: content,
			}, authority)
			results <- err
		}(index, content)
	}
	wait.Wait()
	close(results)
	succeeded, conflicted := 0, 0
	for err := range results {
		if err == nil {
			succeeded++
		} else if strings.Contains(err.Error(), "revision_conflict") {
			conflicted++
		} else {
			t.Fatalf("unexpected concurrent save error: %v", err)
		}
	}
	if succeeded != 1 || conflicted != 1 {
		t.Fatalf("draft CAS succeeded=%d conflicted=%d", succeeded, conflicted)
	}

	current, err := store.KnowledgePage(t.Context(), library.ID, page.Page.ID, true, authority)
	if err != nil {
		t.Fatal(err)
	}
	_, err = store.SaveKnowledgePageDraft(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageDraftWrite{
		ClientID: "stale-draft", ExpectedDraftRevision: base.DraftRevision, ExpectedPageRevision: page.Page.Revision,
		Title: "过期草稿", Rank: page.Page.Rank, ContentSchemaVersion: knowledgesdk.PageContentSchemaVersion, Content: documentContentFixture("不能覆盖"),
	}, authority)
	var conflict *knowledgesdk.KnowledgePageConflictError
	if !errors.As(err, &conflict) || conflict.Conflict.CurrentDraftRevision != current.Draft.DraftRevision || conflict.Conflict.CurrentContentSHA256 != current.Draft.Body.ContentSHA256 || conflict.Conflict.CurrentUpdatedAt.IsZero() {
		t.Fatalf("stale save must expose a safe current-draft conflict snapshot: conflict=%+v err=%v", conflict, err)
	}
	published := publishPageFixture(t, store, authority, library, current, "publish-1")
	if published.Published == nil || published.Published.Version != 1 || published.Page.ProjectionStatus != "queued" {
		t.Fatalf("publish did not atomically expose immutable version and projection intent: %+v", published)
	}
	changed := savePageFixture(t, store, authority, library, published, "draft-2", "第二版", "正文第二版")
	second := publishPageFixture(t, store, authority, library, changed, "publish-2")
	versions, err := store.KnowledgePageVersions(t.Context(), library.ID, page.Page.ID, 0, 20, authority)
	if err != nil || len(versions.Items) != 2 || versions.Items[0].Version != 2 || versions.Items[1].Body.Content == versions.Items[0].Body.Content {
		t.Fatalf("immutable history invalid: %+v err=%v", versions, err)
	}
	restored, err := store.RestoreKnowledgePageVersion(t.Context(), library.ID, page.Page.ID, 1, knowledgesdk.KnowledgePageRestoreVersion{ClientID: "restore-1", ExpectedPageRevision: second.Page.Revision, ExpectedDraftRevision: second.Draft.DraftRevision}, authority)
	if err != nil {
		t.Fatal(err)
	}
	if restored.Page.PublishedVersion != 2 || restored.Draft == nil || restored.Draft.Body.Content != versions.Items[1].Body.Content {
		t.Fatalf("restore rewrote history instead of producing a draft: %+v", restored)
	}
}

func TestKnowledgePageTypedContentCreateSavePublishAndSearchText(t *testing.T) {
	store, authority, library, _ := pageFixture(t)
	cases := map[string]string{
		knowledgesdk.KnowledgePageTypeMultidimensionalTable: `{"schema_version":1,"fields":[{"id":"name","name":"客户","type":"text"}],"records":[{"id":"r1","values":{"name":"北辰科技"}}],"views":[{"id":"view-grid","name":"表格","type":"grid"}]}`,
		knowledgesdk.KnowledgePageTypeSpreadsheet: spreadsheetTestContent(t, func(root map[string]any) {
			workbook := root["workbook"].(map[string]any)
			workbook["name"] = "预算"
			sheet := workbook["sheets"].(map[string]any)["sheet-1"].(map[string]any)
			sheet["name"] = "预算"
			sheet["cellData"] = map[string]any{"0": map[string]any{"0": map[string]any{"v": "项目"}, "1": map[string]any{"v": "金额"}}, "1": map[string]any{"0": map[string]any{"v": "设计"}, "1": map[string]any{"v": 12000}}}
		}),
		knowledgesdk.KnowledgePageTypePresentation: presentationFixture(t, func(root map[string]any) {
			slide := root["slides"].([]any)[0].(map[string]any)
			slide["title"] = "季度复盘"
			slide["elements"].([]any)[0].(map[string]any)["text"] = "增长 28%"
		}),
		knowledgesdk.KnowledgePageTypeForm:     `{"schema_version":1,"display":"form","components":[{"type":"radio","key":"satisfaction","label":"满意度","input":true,"validate":{"required":true},"values":[{"label":"满意","value":"good"},{"label":"一般","value":"normal"}]}],"settings":{"submission_role":"reader","allow_multiple_submissions":false,"opens_at":"","closes_at":"","confirmation_message":"提交成功"}}`,
		knowledgesdk.KnowledgePageTypeMindNote: `{"schema_version":1,"nodes":[{"id":"n1","text":"核心判断","completed":false,"collapsed":false,"children":[]}]}`,
		knowledgesdk.KnowledgePageTypeWhiteboard: whiteboardFixture(t, func(root map[string]any) {
			text := whiteboardElementFixture("n1", "text")
			text["text"], text["original_text"], text["font_size"], text["font_family"] = "用户问题", "用户问题", 20, 5
			text["text_align"], text["vertical_align"], text["line_height"], text["auto_resize"] = "left", "top", 1.25, true
			root["elements"] = []any{text}
		}),
		knowledgesdk.KnowledgePageTypeMindMap:   `{"schema_version":1,"theme":"emerald","layout":"side","compact":true,"root":{"id":"root","text":"产品战略","expanded":true,"direction":"auto","style":{"color":"#ffffff","background_color":"#00856a","font_weight":"bold"},"children":[{"id":"n1","text":"增长","expanded":true,"direction":"auto","style":{"color":"#17332b","background_color":"#e8f5f0","font_weight":"normal"},"children":[]}]},"relations":[]}`,
		knowledgesdk.KnowledgePageTypeFlowchart: `{"schema_version":1,"theme":"emerald","layout":"free","grid":true,"nodes":[{"id":"n1","type":"process","x":240,"y":160,"text":"提交审批","style":{"color":"#17332b","background_color":"#e8f5f0","font_weight":"normal"}}],"edges":[]}`,
	}
	for contentType, content := range cases {
		t.Run(contentType, func(t *testing.T) {
			created, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "typed-" + contentType, Title: contentType, ContentType: contentType}, authority)
			if err != nil || created.Page.ContentType != contentType || created.Draft == nil || created.Draft.ContentType != contentType || created.Draft.Body.Content == "" {
				t.Fatalf("typed create mismatch: view=%+v err=%v", created, err)
			}
			saved, err := store.SaveKnowledgePageDraft(t.Context(), library.ID, created.Page.ID, knowledgesdk.KnowledgePageDraftWrite{ClientID: "save-" + contentType, ExpectedDraftRevision: created.Draft.DraftRevision, ExpectedPageRevision: created.Page.Revision, Title: contentType, Rank: created.Page.Rank, ContentSchemaVersion: knowledgesdk.PageContentSchemaVersion, Content: content}, authority)
			if err != nil || saved.Draft == nil || saved.Draft.Body.PlainText == "" || strings.Contains(saved.Draft.Body.PlainText, `{"`) {
				t.Fatalf("typed save did not derive searchable text: view=%+v err=%v", saved, err)
			}
			published := publishPageFixture(t, store, authority, library, saved, "publish-"+contentType)
			if published.Published == nil || published.Published.ContentType != contentType || published.Published.Body.PlainText != saved.Draft.Body.PlainText {
				t.Fatalf("typed publish mismatch: %+v", published)
			}
		})
	}
	if _, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "typed-invalid", Title: "无效类型", ContentType: "unknown"}, authority); err == nil || !strings.Contains(err.Error(), "page_invalid") {
		t.Fatalf("unknown page type accepted: %v", err)
	}
}

func TestKnowledgeFilePageUsesTreeLifecycleAndAuthorizedDocumentReference(t *testing.T) {
	store, authority, library, parent := pageFixture(t)
	parent = savePageFixture(t, store, authority, library, parent, "file-page-parent-save", "文件目录", "文件目录")
	parent = publishPageFixture(t, store, authority, library, parent, "file-page-parent-publish")
	documents, err := documentstorage.NewFiles(filepath.Join(t.TempDir(), "documents"))
	if err != nil {
		t.Fatal(err)
	}
	document := reserveSubjectDocument(t, store, documents, library, "file-page", authority)
	created, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "file-page-create", ParentPageID: parent.Page.ID, Title: "产品说明.pdf", ContentType: knowledgePageTypeFile}, authority)
	if err != nil || created.Draft == nil || created.Page.ContentType != knowledgePageTypeFile {
		t.Fatalf("file page create failed: view=%+v err=%v", created, err)
	}
	content := `{"document_id":"` + document.Document.ID + `","display_mode":"preview","title":"产品说明.pdf"}`
	write := knowledgesdk.KnowledgePageDraftWrite{ClientID: "file-page-save-before-attach", ExpectedDraftRevision: created.Draft.DraftRevision, ExpectedPageRevision: created.Page.Revision, Title: created.Page.Title, ParentPageID: created.Page.ParentPageID, Rank: created.Page.Rank, ContentSchemaVersion: knowledgesdk.PageContentSchemaVersion, Content: content}
	if _, err = store.SaveKnowledgePageDraft(t.Context(), library.ID, created.Page.ID, write, authority); err == nil || !strings.Contains(err.Error(), "page_file_reference_not_found") {
		t.Fatalf("file page accepted an unattached document reference: %v", err)
	}
	if _, err = store.SetKnowledgePageAttachment(t.Context(), library.ID, created.Page.ID, document.Document.ID, knowledgesdk.KnowledgePageAttachmentWrite{ClientID: "file-page-attach", Title: document.Document.Filename, Rank: "a"}, authority); err != nil {
		t.Fatal(err)
	}
	write.ClientID = "file-page-save"
	saved, err := store.SaveKnowledgePageDraft(t.Context(), library.ID, created.Page.ID, write, authority)
	if err != nil || saved.Draft == nil || saved.Draft.Body.PlainText != "产品说明.pdf" {
		t.Fatalf("file page save failed: view=%+v err=%v", saved, err)
	}
	published := publishPageFixture(t, store, authority, library, saved, "file-page-publish")
	if published.Published == nil || published.Published.ContentType != knowledgePageTypeFile {
		t.Fatalf("file page did not publish through normal page lifecycle: %+v", published)
	}
	children, err := store.KnowledgePages(t.Context(), library.ID, parent.Page.ID, "", 10, false, authority)
	if err != nil || len(children.Items) != 1 || children.Items[0].ID != created.Page.ID {
		t.Fatalf("file page is not in the unified child tree: page=%+v err=%v", children, err)
	}
	copied, err := store.CopyKnowledgePage(t.Context(), library.ID, created.Page.ID, knowledgesdk.KnowledgePageCopy{ClientID: "file-page-copy", Title: "产品说明副本"}, authority)
	if err != nil {
		t.Fatal(err)
	}
	attachments, err := store.KnowledgePageAttachments(t.Context(), library.ID, copied.Page.ID, authority)
	if err != nil || len(attachments.Items) != 1 || attachments.Items[0].DocumentID != document.Document.ID {
		t.Fatalf("file page copy lost its authorized original reference: attachments=%+v err=%v", attachments, err)
	}
	if _, err = store.PublishKnowledgePage(t.Context(), library.ID, copied.Page.ID, knowledgesdk.KnowledgePagePublish{ClientID: "file-page-copy-publish", ExpectedPageRevision: copied.Page.Revision, ExpectedDraftRevision: copied.Draft.DraftRevision}, authority); err != nil {
		t.Fatalf("copied file page could not publish: %v", err)
	}
}

func TestKnowledgePageSiblingReorderIsAtomicAndRequiresExactSet(t *testing.T) {
	store, authority, library, first := pageFixture(t)
	second, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "reorder-second", Title: "第二页", ContentType: knowledgesdk.KnowledgePageTypeDocument}, authority)
	if err != nil {
		t.Fatal(err)
	}
	third, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "reorder-third", Title: "第三页", ContentType: knowledgesdk.KnowledgePageTypeDocument}, authority)
	if err != nil {
		t.Fatal(err)
	}
	request := knowledgesdk.KnowledgePageReorder{ClientID: "reorder-once", Items: []knowledgesdk.KnowledgePageOrder{
		{PageID: third.Page.ID, ExpectedRevision: third.Page.Revision},
		{PageID: first.Page.ID, ExpectedRevision: first.Page.Revision},
		{PageID: second.Page.ID, ExpectedRevision: second.Page.Revision},
	}}
	ordered, err := store.ReorderKnowledgePages(t.Context(), library.ID, request, authority)
	if err != nil {
		t.Fatal(err)
	}
	if len(ordered.Items) != 3 || ordered.Items[0].ID != third.Page.ID || !(ordered.Items[0].Rank < ordered.Items[1].Rank && ordered.Items[1].Rank < ordered.Items[2].Rank) {
		t.Fatalf("unexpected reordered page set: %+v", ordered.Items)
	}
	replayed, err := store.ReorderKnowledgePages(t.Context(), library.ID, request, authority)
	if err != nil || len(replayed.Items) != 3 || replayed.Items[0] != ordered.Items[0] || replayed.Items[2] != ordered.Items[2] {
		t.Fatalf("reorder retry did not return the committed receipt: replayed=%+v err=%v", replayed, err)
	}
	listed, err := store.KnowledgePages(t.Context(), library.ID, "", "", 10, false, authority)
	if err != nil || len(listed.Items) != 3 || listed.Items[0].ID != third.Page.ID || listed.Items[1].ID != first.Page.ID || listed.Items[2].ID != second.Page.ID {
		t.Fatalf("persisted order=%+v err=%v", listed.Items, err)
	}
	stale := request
	stale.ClientID = "reorder-stale"
	if _, err = store.ReorderKnowledgePages(t.Context(), library.ID, stale, authority); err == nil || !strings.Contains(err.Error(), "page_reorder_revision_conflict") {
		t.Fatalf("stale batch must fail without partial writes: %v", err)
	}
	afterStale, err := store.KnowledgePages(t.Context(), library.ID, "", "", 10, false, authority)
	if err != nil || afterStale.Items[0].ID != third.Page.ID || afterStale.Items[1].ID != first.Page.ID || afterStale.Items[2].ID != second.Page.ID {
		t.Fatalf("stale reorder changed page order: %+v err=%v", afterStale.Items, err)
	}
	if _, err = store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "reorder-fourth", Title: "第四页", ContentType: knowledgesdk.KnowledgePageTypeDocument}, authority); err != nil {
		t.Fatal(err)
	}
	exact := knowledgesdk.KnowledgePageReorder{ClientID: "reorder-missing-sibling", Items: []knowledgesdk.KnowledgePageOrder{
		{PageID: ordered.Items[0].ID, ExpectedRevision: ordered.Items[0].Revision},
		{PageID: ordered.Items[1].ID, ExpectedRevision: ordered.Items[1].Revision},
		{PageID: ordered.Items[2].ID, ExpectedRevision: ordered.Items[2].Revision},
	}}
	if _, err = store.ReorderKnowledgePages(t.Context(), library.ID, exact, authority); err == nil || !strings.Contains(err.Error(), "page_reorder_set_conflict") {
		t.Fatalf("partial sibling set must be rejected: %v", err)
	}
}

func TestArchivedKnowledgePageRejectsEveryCommentMutation(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	page = savePageFixture(t, store, authority, library, page, "archive-comment-draft", "评论页", "已发布正文")
	page = publishPageFixture(t, store, authority, library, page, "archive-comment-publish")
	comment, err := store.CreateKnowledgePageComment(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageCommentCreate{
		ClientID: "archive-comment-create", PublishedVersion: page.Page.PublishedVersion, Anchor: knowledgesdk.KnowledgePageCommentAnchor{NodeID: "block-1", Quote: "已发布正文"}, Body: "归档前评论",
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	archived, err := store.SetKnowledgePageArchived(t.Context(), library.ID, page.Page.ID, true, knowledgesdk.KnowledgePageStateWrite{ClientID: "archive-comment-page", ExpectedRevision: page.Page.Revision}, authority)
	if err != nil || archived.State != "archived" {
		t.Fatalf("archive=%+v err=%v", archived, err)
	}
	mutations := []struct {
		name string
		run  func() error
	}{
		{name: "create", run: func() error {
			_, mutationErr := store.CreateKnowledgePageComment(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageCommentCreate{ClientID: "archived-create", PublishedVersion: page.Page.PublishedVersion, Anchor: knowledgesdk.KnowledgePageCommentAnchor{NodeID: "block-1", Quote: "已发布正文"}, Body: "禁止"}, authority)
			return mutationErr
		}},
		{name: "update", run: func() error {
			_, mutationErr := store.UpdateKnowledgePageComment(t.Context(), library.ID, page.Page.ID, comment.ID, knowledgesdk.KnowledgePageCommentUpdate{ClientID: "archived-update", ExpectedRevision: comment.Revision, Body: "禁止"}, authority)
			return mutationErr
		}},
		{name: "resolve", run: func() error {
			_, mutationErr := store.ResolveKnowledgePageComment(t.Context(), library.ID, page.Page.ID, comment.ID, knowledgesdk.KnowledgePageCommentResolve{ClientID: "archived-resolve", ExpectedRevision: comment.Revision, Resolved: true}, authority)
			return mutationErr
		}},
		{name: "delete", run: func() error {
			_, mutationErr := store.DeleteKnowledgePageComment(t.Context(), library.ID, page.Page.ID, comment.ID, knowledgesdk.KnowledgePageCommentDelete{ClientID: "archived-delete", ExpectedRevision: comment.Revision}, authority)
			return mutationErr
		}},
	}
	for _, mutation := range mutations {
		t.Run(mutation.name, func(t *testing.T) {
			if mutationErr := mutation.run(); mutationErr == nil || !strings.Contains(mutationErr.Error(), "page_archived") {
				t.Fatalf("archived page accepted comment mutation: %v", mutationErr)
			}
		})
	}
}

func TestKnowledgePageTreeCommentsAndHiddenProjection(t *testing.T) {
	store, authority, library, root := pageFixture(t)
	root = savePageFixture(t, store, authority, library, root, "root-body", "根页面", "# 根\n\n正文")
	root = publishPageFixture(t, store, authority, library, root, "root-publish")
	child, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "child-create", ParentPageID: root.Page.ID, Title: "子页面", ContentType: knowledgesdk.KnowledgePageTypeDocument}, authority)
	if err != nil {
		t.Fatal(err)
	}
	if _, err = store.MoveKnowledgePage(t.Context(), library.ID, root.Page.ID, knowledgesdk.KnowledgePageMove{ClientID: "cycle", ExpectedRevision: root.Page.Revision, ParentPageID: child.Page.ID, Rank: root.Page.Rank}, authority); err == nil || !strings.Contains(err.Error(), "page_tree_cycle") {
		t.Fatalf("moving a page below its descendant was not rejected: %v", err)
	}
	if _, err = store.SetKnowledgePageArchived(t.Context(), library.ID, root.Page.ID, true, knowledgesdk.KnowledgePageStateWrite{ClientID: "archive-parent", ExpectedRevision: root.Page.Revision}, authority); err == nil || !strings.Contains(err.Error(), "page_has_active_children") {
		t.Fatalf("active subtree archive was not preflighted: %v", err)
	}

	library, err = store.SetKnowledgeLibraryMember(t.Context(), library.ID, "bob", agentsdk.KnowledgeLibraryMemberWrite{Role: "reader", ExpectedRevision: library.Revision}, authority)
	if err != nil {
		t.Fatal(err)
	}
	bob := authority
	bob.UserID = "bob"
	comment, err := store.CreateKnowledgePageComment(t.Context(), library.ID, root.Page.ID, knowledgesdk.KnowledgePageCommentCreate{ClientID: "comment-1", PublishedVersion: 1, Anchor: knowledgesdk.KnowledgePageCommentAnchor{NodeID: "block-1", Quote: "根"}, Body: "请复核", MentionedUserIDs: []string{"alice"}}, bob)
	if err != nil {
		t.Fatal(err)
	}
	commentUpdate := knowledgesdk.KnowledgePageCommentUpdate{ClientID: "foreign-edit", ExpectedRevision: comment.Revision, Body: "manager 更新"}
	updatedComment, err := store.UpdateKnowledgePageComment(t.Context(), library.ID, root.Page.ID, comment.ID, commentUpdate, authority)
	if err != nil {
		t.Fatalf("manager should manage any comment: %v", err)
	}
	replayedComment, err := store.UpdateKnowledgePageComment(t.Context(), library.ID, root.Page.ID, comment.ID, commentUpdate, authority)
	if err != nil || replayedComment.Revision != updatedComment.Revision || replayedComment.Body != updatedComment.Body {
		t.Fatalf("comment update retry did not return the committed receipt: first=%+v replay=%+v err=%v", updatedComment, replayedComment, err)
	}
	changedUpdate := commentUpdate
	changedUpdate.Body = "同键不同内容"
	if _, err = store.UpdateKnowledgePageComment(t.Context(), library.ID, root.Page.ID, comment.ID, changedUpdate, authority); err == nil || !strings.Contains(err.Error(), "idempotency_conflict") {
		t.Fatalf("comment update idempotency key accepted different content: %v", err)
	}
	if _, err = store.CreateKnowledgePageComment(t.Context(), library.ID, root.Page.ID, knowledgesdk.KnowledgePageCommentCreate{ClientID: "bad-mention", PublishedVersion: 1, Anchor: knowledgesdk.KnowledgePageCommentAnchor{NodeID: "block-1", Quote: "根"}, Body: "未知成员", MentionedUserIDs: []string{"mallory"}}, bob); err == nil || !strings.Contains(err.Error(), "mention") {
		t.Fatalf("non-member mention was accepted: %v", err)
	}

	if err = store.ActivateKnowledgeDocumentSource(t.Context(), agentsdk.KnowledgeDocumentStorageScope{RuntimeID: authority.RuntimeID, WorkspaceID: authority.WorkspaceID, LibraryID: library.ID}, conversationHash([]string{"page-source", library.ID})); err != nil {
		t.Fatal(err)
	}
	work, found, err := store.ClaimKnowledgePageProjection(t.Context(), authority.RuntimeID, "page-worker", time.Now().UTC().Add(time.Second), time.Minute)
	if err != nil || !found || work.Version.Version != 1 {
		t.Fatalf("published projection intent was not claimable: found=%v work=%+v err=%v", found, work, err)
	}
	canonical := []byte("# " + work.Version.Title + "\n\n" + work.Version.Body.Content)
	digest := sha256.Sum256(canonical)
	if err = store.CompleteKnowledgePageProjection(t.Context(), work.Lease, "body://page-1", int64(len(canonical)), hex.EncodeToString(digest[:]), work.Page.ID+".md", strings.Repeat("a", 64)); err != nil {
		t.Fatal(err)
	}
	documents, err := store.KnowledgeDocuments(t.Context(), library.ID, "", 20, authority)
	if err != nil || len(documents.Items) != 0 {
		t.Fatalf("page projection leaked into file management: %+v err=%v", documents, err)
	}
	documentID, err := knowledgePageProjectionDocumentID(authority, root.Page.ID)
	if err != nil {
		t.Fatal(err)
	}
	record, err := store.KnowledgeDocumentRecord(t.Context(), documentID, authority)
	if err != nil || record.Document.ProjectionKind != "page" || record.Document.OriginPageID != root.Page.ID || record.Document.OriginPageVersion != 1 {
		t.Fatalf("page projection origin missing: %+v err=%v", record, err)
	}
}

func TestKnowledgePageReaderTreeUsesPublishedSnapshotAndPaginatesPublishedRows(t *testing.T) {
	store, authority, library, parent := pageFixture(t)
	var err error
	movedParent, err := store.MoveKnowledgePage(t.Context(), library.ID, parent.Page.ID, knowledgesdk.KnowledgePageMove{ClientID: "parent-rank", ExpectedRevision: parent.Page.Revision, Rank: "b"}, authority)
	if err != nil {
		t.Fatal(err)
	}
	parent.Page = movedParent
	parent.Draft.DraftRevision++
	parent.Draft.Rank = movedParent.Rank
	parent, err = store.SaveKnowledgePageDraft(t.Context(), library.ID, parent.Page.ID, knowledgesdk.KnowledgePageDraftWrite{
		ClientID: "parent-draft", ExpectedDraftRevision: parent.Draft.DraftRevision, ExpectedPageRevision: parent.Page.Revision,
		Title: "已发布父页面", Rank: "b", ContentSchemaVersion: knowledgesdk.PageContentSchemaVersion, Content: documentContentFixture("父页面正文"),
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	parent = publishPageFixture(t, store, authority, library, parent, "parent-publish")

	child, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "snapshot-child", ParentPageID: parent.Page.ID, Rank: "m", Title: "已发布子页面", ContentType: knowledgesdk.KnowledgePageTypeDocument}, authority)
	if err != nil {
		t.Fatal(err)
	}
	child = savePageFixture(t, store, authority, library, child, "snapshot-child-draft", "已发布子页面", "子页面正文")
	child = publishPageFixture(t, store, authority, library, child, "snapshot-child-publish")

	if _, err = store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "hidden-root", Rank: "a", Title: "未发布页面", ContentType: knowledgesdk.KnowledgePageTypeDocument}, authority); err != nil {
		t.Fatal(err)
	}
	sibling, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "published-sibling", Rank: "z", Title: "已发布同级页面", ContentType: knowledgesdk.KnowledgePageTypeDocument}, authority)
	if err != nil {
		t.Fatal(err)
	}
	sibling = publishPageFixture(t, store, authority, library, sibling, "published-sibling-publish")

	parent, err = store.SaveKnowledgePageDraft(t.Context(), library.ID, parent.Page.ID, knowledgesdk.KnowledgePageDraftWrite{
		ClientID: "parent-unpublished-rename", ExpectedDraftRevision: parent.Draft.DraftRevision, ExpectedPageRevision: parent.Page.Revision,
		Title: "草稿父页面", Rank: parent.Page.Rank, ContentSchemaVersion: knowledgesdk.PageContentSchemaVersion, Content: parent.Draft.Body.Content,
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	child, err = store.SaveKnowledgePageDraft(t.Context(), library.ID, child.Page.ID, knowledgesdk.KnowledgePageDraftWrite{
		ClientID: "child-unpublished-move", ExpectedDraftRevision: child.Draft.DraftRevision, ExpectedPageRevision: child.Page.Revision,
		Title: "草稿子页面", ParentPageID: child.Page.ParentPageID, Rank: child.Page.Rank, ContentSchemaVersion: knowledgesdk.PageContentSchemaVersion, Content: child.Draft.Body.Content,
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	if _, err = store.MoveKnowledgePage(t.Context(), library.ID, child.Page.ID, knowledgesdk.KnowledgePageMove{ClientID: "child-unpublished-structure", ExpectedRevision: child.Page.Revision, Rank: "c"}, authority); err != nil {
		t.Fatal(err)
	}
	if _, err = store.SetKnowledgePageArchived(t.Context(), library.ID, parent.Page.ID, true, knowledgesdk.KnowledgePageStateWrite{ClientID: "archive-published-parent", ExpectedRevision: parent.Page.Revision}, authority); err == nil || !strings.Contains(err.Error(), "page_has_active_children") {
		t.Fatalf("parent archive ignored its still-published child: %v", err)
	}

	library, err = store.SetKnowledgeLibraryMember(t.Context(), library.ID, "bob", agentsdk.KnowledgeLibraryMemberWrite{Role: "reader", ExpectedRevision: library.Revision}, authority)
	if err != nil {
		t.Fatal(err)
	}
	bob := authority
	bob.UserID = "bob"

	children, err := store.KnowledgePages(t.Context(), library.ID, parent.Page.ID, "", 10, false, bob)
	if err != nil || len(children.Items) != 1 || children.Items[0].ID != child.Page.ID || children.Items[0].Title != "已发布子页面" || children.Items[0].HasChildren {
		t.Fatalf("reader child tree used unpublished draft state: %+v err=%v", children, err)
	}
	first, err := store.KnowledgePages(t.Context(), library.ID, "", "", 1, false, bob)
	if err != nil || len(first.Items) != 1 || first.Items[0].ID != parent.Page.ID || !first.Items[0].HasChildren || first.Complete || first.NextAfter != parent.Page.ID {
		t.Fatalf("reader first page did not filter before pagination: %+v err=%v", first, err)
	}
	second, err := store.KnowledgePages(t.Context(), library.ID, "", first.NextAfter, 1, false, bob)
	if err != nil || len(second.Items) != 1 || second.Items[0].ID != sibling.Page.ID || second.Items[0].HasChildren || !second.Complete {
		t.Fatalf("reader published cursor was unstable: %+v err=%v", second, err)
	}
	view, err := store.KnowledgePage(t.Context(), library.ID, child.Page.ID, true, bob)
	if err != nil || view.Draft != nil || len(view.Breadcrumbs) != 2 || view.Breadcrumbs[0].Title != "已发布父页面" || view.Breadcrumbs[1].Title != "已发布子页面" {
		t.Fatalf("reader breadcrumbs leaked draft hierarchy: %+v err=%v", view, err)
	}
	publishedView, err := store.KnowledgePage(t.Context(), library.ID, child.Page.ID, false, authority)
	if err != nil || publishedView.Draft != nil || publishedView.Page.Title != "已发布子页面" || len(publishedView.Breadcrumbs) != 2 || publishedView.Breadcrumbs[0].Title != "已发布父页面" {
		t.Fatalf("explicit published read leaked editor draft state: %+v err=%v", publishedView, err)
	}
}

func TestKnowledgePageStateMutationsHaveDurableIdempotencyReceipts(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	page = savePageFixture(t, store, authority, library, page, "idempotent-draft", "幂等页面", "正文")
	copyInput := knowledgesdk.KnowledgePageCopy{ClientID: "idempotent-copy", Rank: "copy", Title: "幂等副本"}
	copied, err := store.CopyKnowledgePage(t.Context(), library.ID, page.Page.ID, copyInput, authority)
	if err != nil {
		t.Fatal(err)
	}
	copiedReplay, err := store.CopyKnowledgePage(t.Context(), library.ID, page.Page.ID, copyInput, authority)
	if err != nil || copiedReplay.Page.ID != copied.Page.ID || copiedReplay.Draft == nil || copiedReplay.Draft.Body.Content != documentContentFixture("正文") {
		t.Fatalf("copy retry did not return the same atomically copied page: first=%+v replay=%+v err=%v", copied, copiedReplay, err)
	}
	publish := knowledgesdk.KnowledgePagePublish{ClientID: "idempotent-publish", ExpectedPageRevision: page.Page.Revision, ExpectedDraftRevision: page.Draft.DraftRevision, PublishNote: "first"}
	first, err := store.PublishKnowledgePage(t.Context(), library.ID, page.Page.ID, publish, authority)
	if err != nil {
		t.Fatal(err)
	}
	replayed, err := store.PublishKnowledgePage(t.Context(), library.ID, page.Page.ID, publish, authority)
	if err != nil || replayed.Page.Revision != first.Page.Revision || replayed.Page.PublishedVersion != 1 || replayed.Published == nil || replayed.Published.Version != 1 {
		t.Fatalf("publish retry did not return the committed receipt: first=%+v replay=%+v err=%v", first, replayed, err)
	}
	changed := publish
	changed.PublishNote = "different"
	if _, err = store.PublishKnowledgePage(t.Context(), library.ID, page.Page.ID, changed, authority); err == nil || !strings.Contains(err.Error(), "idempotency_conflict") {
		t.Fatalf("publish idempotency key accepted a different request: %v", err)
	}

	move := knowledgesdk.KnowledgePageMove{ClientID: "idempotent-move", ExpectedRevision: first.Page.Revision, Rank: "moved"}
	moved, err := store.MoveKnowledgePage(t.Context(), library.ID, page.Page.ID, move, authority)
	if err != nil {
		t.Fatal(err)
	}
	movedReplay, err := store.MoveKnowledgePage(t.Context(), library.ID, page.Page.ID, move, authority)
	if err != nil || movedReplay.Revision != moved.Revision || movedReplay.Rank != moved.Rank {
		t.Fatalf("move retry did not return the committed receipt: first=%+v replay=%+v err=%v", moved, movedReplay, err)
	}

	archive := knowledgesdk.KnowledgePageStateWrite{ClientID: "idempotent-archive", ExpectedRevision: moved.Revision}
	archived, err := store.SetKnowledgePageArchived(t.Context(), library.ID, page.Page.ID, true, archive, authority)
	if err != nil {
		t.Fatal(err)
	}
	archivedReplay, err := store.SetKnowledgePageArchived(t.Context(), library.ID, page.Page.ID, true, archive, authority)
	if err != nil || archivedReplay.Revision != archived.Revision || archivedReplay.State != "archived" {
		t.Fatalf("archive retry did not return the committed receipt: first=%+v replay=%+v err=%v", archived, archivedReplay, err)
	}
	restored, err := store.SetKnowledgePageArchived(t.Context(), library.ID, page.Page.ID, false, knowledgesdk.KnowledgePageStateWrite{ClientID: "idempotent-unarchive", ExpectedRevision: archived.Revision}, authority)
	if err != nil || restored.State != "active" || restored.ProjectionStatus != "queued" {
		t.Fatalf("restored published page did not queue its search projection: page=%+v err=%v", restored, err)
	}
	work, found, err := store.ClaimKnowledgePageProjection(t.Context(), authority.RuntimeID, "restore-worker", time.Now().UTC().Add(time.Second), time.Minute)
	if err != nil || !found || work.Page.ID != page.Page.ID || work.Version.Version != restored.PublishedVersion {
		t.Fatalf("restored page projection intent was not durable: found=%v work=%+v err=%v", found, work, err)
	}
}

func TestKnowledgePageAttachmentMutationsHaveDurableIdempotencyReceipts(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	documents, err := documentstorage.NewFiles(filepath.Join(t.TempDir(), "documents"))
	if err != nil {
		t.Fatal(err)
	}
	document := reserveSubjectDocument(t, store, documents, library, "page-attachment", authority)
	set := knowledgesdk.KnowledgePageAttachmentWrite{ClientID: "attachment-set", Title: "设计说明", Rank: "a"}
	first, err := store.SetKnowledgePageAttachment(t.Context(), library.ID, page.Page.ID, document.Document.ID, set, authority)
	if err != nil {
		t.Fatal(err)
	}
	replayed, err := store.SetKnowledgePageAttachment(t.Context(), library.ID, page.Page.ID, document.Document.ID, set, authority)
	if err != nil || replayed != first {
		t.Fatalf("attachment set retry did not return the committed receipt: first=%+v replay=%+v err=%v", first, replayed, err)
	}
	changed := set
	changed.Title = "同键不同标题"
	if _, err = store.SetKnowledgePageAttachment(t.Context(), library.ID, page.Page.ID, document.Document.ID, changed, authority); err == nil || !strings.Contains(err.Error(), "idempotency_conflict") {
		t.Fatalf("attachment set idempotency key accepted a different request: %v", err)
	}
	remove := knowledgesdk.KnowledgePageAttachmentRemove{ClientID: "attachment-remove"}
	if err = store.RemoveKnowledgePageAttachment(t.Context(), library.ID, page.Page.ID, document.Document.ID, remove, authority); err != nil {
		t.Fatal(err)
	}
	if err = store.RemoveKnowledgePageAttachment(t.Context(), library.ID, page.Page.ID, document.Document.ID, remove, authority); err != nil {
		t.Fatalf("attachment remove retry did not return the committed receipt: %v", err)
	}
	set.ClientID = "attachment-set-before-archive"
	if _, err = store.SetKnowledgePageAttachment(t.Context(), library.ID, page.Page.ID, document.Document.ID, set, authority); err != nil {
		t.Fatal(err)
	}
	if _, err = store.SetKnowledgePageArchived(t.Context(), library.ID, page.Page.ID, true, knowledgesdk.KnowledgePageStateWrite{ClientID: "attachment-page-archive", ExpectedRevision: page.Page.Revision}, authority); err != nil {
		t.Fatal(err)
	}
	if err = store.RemoveKnowledgePageAttachment(t.Context(), library.ID, page.Page.ID, document.Document.ID, knowledgesdk.KnowledgePageAttachmentRemove{ClientID: "attachment-remove-archived"}, authority); err == nil || !strings.Contains(err.Error(), "page_archived") {
		t.Fatalf("archived page accepted attachment removal: %v", err)
	}
}

func TestKnowledgePageCommentMarksVersionedAnchorChangedAfterPublish(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	page = savePageFixture(t, store, authority, library, page, "anchor-v1", "锚点页面", "第一版正文")
	page = publishPageFixture(t, store, authority, library, page, "anchor-publish-v1")
	comment, err := store.CreateKnowledgePageComment(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageCommentCreate{
		ClientID: "anchor-comment", PublishedVersion: 1, Anchor: knowledgesdk.KnowledgePageCommentAnchor{NodeID: "block-1", Quote: "第一版"}, Body: "这里需要调整",
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	if comment.Anchor.Changed {
		t.Fatal("new comment anchor was marked changed")
	}
	if len(comment.Anchor.BlockSHA256) != 64 {
		t.Fatalf("new comment did not persist a canonical block fingerprint: %+v", comment.Anchor)
	}
	page = savePageFixture(t, store, authority, library, page, "anchor-v2", "锚点页面", "第一版正文\n\n新增内容")
	page = publishPageFixture(t, store, authority, library, page, "anchor-publish-v2")
	comments, err := store.KnowledgePageComments(t.Context(), library.ID, page.Page.ID, "", 20, false, authority)
	if err != nil || len(comments.Items) != 1 || comments.Items[0].Anchor.Changed {
		t.Fatalf("unchanged block was invalidated only because the page version advanced: %+v err=%v", comments, err)
	}
	page = savePageFixture(t, store, authority, library, page, "anchor-v3", "锚点页面", "第三版正文")
	page = publishPageFixture(t, store, authority, library, page, "anchor-publish-v3")
	comments, err = store.KnowledgePageComments(t.Context(), library.ID, page.Page.ID, "", 20, false, authority)
	if err != nil || len(comments.Items) != 1 || !comments.Items[0].Anchor.Changed {
		t.Fatalf("changed block anchor was not marked invalid: %+v err=%v", comments, err)
	}
	if _, err = store.CreateKnowledgePageComment(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageCommentCreate{ClientID: "missing-anchor", PublishedVersion: 3, Anchor: knowledgesdk.KnowledgePageCommentAnchor{NodeID: "missing", Quote: "第三版"}, Body: "无效锚点"}, authority); err == nil || !strings.Contains(err.Error(), "anchor_not_found") {
		t.Fatalf("missing block anchor was accepted: %v", err)
	}
	if _, err = store.CreateKnowledgePageComment(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageCommentCreate{ClientID: "wrong-quote", PublishedVersion: 3, Anchor: knowledgesdk.KnowledgePageCommentAnchor{NodeID: "block-1", Quote: "不属于该块"}, Body: "无效引用"}, authority); err == nil || !strings.Contains(err.Error(), "quote_invalid") {
		t.Fatalf("quote outside the selected block was accepted: %v", err)
	}
}

func TestKnowledgePageCommentReactionsAggregatePerUserWithoutChangingCommentRevision(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	page = savePageFixture(t, store, authority, library, page, "reaction-v1", "回应页面", "需要回应的正文")
	page = publishPageFixture(t, store, authority, library, page, "reaction-publish")
	comment, err := store.CreateKnowledgePageComment(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageCommentCreate{
		ClientID: "reaction-comment", PublishedVersion: 1, Anchor: knowledgesdk.KnowledgePageCommentAnchor{NodeID: "block-1", Quote: "需要回应"}, Body: "请确认",
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	library, err = store.SetKnowledgeLibraryMember(t.Context(), library.ID, "bob", agentsdk.KnowledgeLibraryMemberWrite{Role: "reader", ExpectedRevision: library.Revision}, authority)
	if err != nil {
		t.Fatal(err)
	}
	write := knowledgesdk.KnowledgePageCommentReactionWrite{ClientID: "alice-like", Emoji: "👍", Active: true}
	first, err := store.SetKnowledgePageCommentReaction(t.Context(), library.ID, page.Page.ID, comment.ID, write, authority)
	if err != nil || first.Revision != comment.Revision || len(first.Reactions) != 1 || first.Reactions[0].Count != 1 || !first.Reactions[0].Reacted {
		t.Fatalf("first reaction=%+v err=%v", first, err)
	}
	replayed, err := store.SetKnowledgePageCommentReaction(t.Context(), library.ID, page.Page.ID, comment.ID, write, authority)
	if err != nil || replayed.Reactions[0].Count != 1 {
		t.Fatalf("reaction retry duplicated the row: %+v err=%v", replayed, err)
	}
	bob := authority
	bob.UserID = "bob"
	if _, err = store.SetKnowledgePageCommentReaction(t.Context(), library.ID, page.Page.ID, comment.ID, knowledgesdk.KnowledgePageCommentReactionWrite{ClientID: "bob-like", Emoji: "👍", Active: true}, bob); err != nil {
		t.Fatal(err)
	}
	listed, err := store.KnowledgePageComments(t.Context(), library.ID, page.Page.ID, "", 20, false, authority)
	if err != nil || len(listed.Items) != 1 || len(listed.Items[0].Reactions) != 1 || listed.Items[0].Reactions[0].Count != 2 || !listed.Items[0].Reactions[0].Reacted {
		t.Fatalf("aggregated reactions=%+v err=%v", listed, err)
	}
	if _, err = store.SetKnowledgePageCommentReaction(t.Context(), library.ID, page.Page.ID, comment.ID, knowledgesdk.KnowledgePageCommentReactionWrite{ClientID: "alice-unlike", Emoji: "👍", Active: false}, authority); err != nil {
		t.Fatal(err)
	}
	listed, err = store.KnowledgePageComments(t.Context(), library.ID, page.Page.ID, "", 20, false, authority)
	if err != nil || listed.Items[0].Reactions[0].Count != 1 || listed.Items[0].Reactions[0].Reacted {
		t.Fatalf("reaction removal did not preserve other users: %+v err=%v", listed, err)
	}
	if _, err = store.SetKnowledgePageCommentReaction(t.Context(), library.ID, page.Page.ID, comment.ID, knowledgesdk.KnowledgePageCommentReactionWrite{ClientID: "bad-reaction", Emoji: "<script>", Active: true}, authority); err == nil || !strings.Contains(err.Error(), "reaction_invalid") {
		t.Fatalf("unsupported reaction was accepted: %v", err)
	}
}

func TestKnowledgePageContentValidationAndDeterministicTextProjection(t *testing.T) {
	content := `{"blocks":[{"id":"heading-1","type":"heading","props":{"level":1},"content":[{"type":"text","text":"中文标题","styles":{}}],"children":[]},{"id":"table-1","type":"table","props":{},"content":{"type":"tableContent","columnWidths":[120,120],"headerRows":1,"rows":[{"cells":[{"type":"tableCell","props":{"backgroundColor":"gray","textColor":"default","textAlignment":"center","colspan":1,"rowspan":1},"content":[{"type":"text","text":"项目","styles":{}}]},{"type":"tableCell","props":{"backgroundColor":"gray","textColor":"default","textAlignment":"center","colspan":1,"rowspan":1},"content":[{"type":"text","text":"状态","styles":{}}]}]},{"cells":[{"type":"tableCell","props":{"backgroundColor":"default","textColor":"default","textAlignment":"left","colspan":1,"rowspan":1},"content":[{"type":"text","text":"页面","styles":{}}]},{"type":"tableCell","props":{"backgroundColor":"green","textColor":"default","textAlignment":"left","colspan":1,"rowspan":1},"content":[{"type":"text","text":"完成","styles":{}}]}]}]},"children":[]},{"id":"code-1","type":"codeBlock","props":{"language":"go"},"content":[{"type":"text","text":"fmt.Println(\"确定性\")","styles":{}}],"children":[]},{"id":"link-1","type":"paragraph","props":{},"content":[{"type":"link","href":"https://example.invalid","content":[{"type":"text","text":"说明","styles":{}}]}],"children":[]},{"id":"image-1","type":"image","props":{"url":"knowledge-document:kdoc_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","caption":"架构图","name":"架构图"},"children":[]}]}`
	first, err := normalizedPageContent(knowledgesdk.PageContentSchemaVersion, content, "")
	if err != nil {
		t.Fatal(err)
	}
	second, err := normalizedPageContent(knowledgesdk.PageContentSchemaVersion, content, first.ContentSHA256)
	if err != nil || second != first || first.PlainText != "中文标题 项目 状态 页面 完成 fmt.Println(\"确定性\") 说明 架构图 架构图" {
		t.Fatalf("page content normalization was not deterministic: first=%+v second=%+v err=%v", first, second, err)
	}
	for name, invalid := range map[string]string{
		"unknown block":             `{"blocks":[{"id":"evil-1","type":"html","props":{},"content":"<script>alert(1)</script>","children":[]}]}`,
		"external image":            `{"blocks":[{"id":"image-1","type":"image","props":{"url":"https://example.invalid/a.png"},"children":[]}]}`,
		"data image":                `{"blocks":[{"id":"image-1","type":"image","props":{"url":"data:image/png;base64,AAAA"},"children":[]}]}`,
		"malformed image reference": `{"blocks":[{"id":"image-1","type":"image","props":{"url":"knowledge-document:kdoc_123"},"children":[]}]}`,
		"direct content route":      `{"blocks":[{"id":"file-1","type":"file","props":{"url":"/knowledge/libraries/klib_a/documents/kdoc_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/content"},"children":[]}]}`,
		"media script property":     `{"blocks":[{"id":"video-1","type":"video","props":{"url":"knowledge-document:kdoc_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","script":"alert(1)"},"children":[]}]}`,
		"duplicate id":              `{"blocks":[{"id":"same","type":"paragraph","props":{},"content":[],"children":[]},{"id":"same","type":"paragraph","props":{},"content":[],"children":[]}]}`,
		"nul":                       "{\"blocks\":\u0000}",
	} {
		t.Run(name, func(t *testing.T) {
			if _, validationErr := normalizedPageContent(knowledgesdk.PageContentSchemaVersion, invalid, ""); validationErr == nil {
				t.Fatalf("unsafe page content was accepted: %q", invalid)
			}
		})
	}
	if _, err = normalizedPageContent(knowledgesdk.PageContentSchemaVersion, content, strings.Repeat("0", 64)); err == nil || !strings.Contains(err.Error(), "hash_mismatch") {
		t.Fatalf("mismatched content hash was accepted: %v", err)
	}
}

func TestKnowledgePageFormulaContentIsValidatedAndIndexed(t *testing.T) {
	content := `{"blocks":[{"id":"formula-1","type":"formula","props":{},"content":"E = mc^2","children":[]},{"id":"paragraph-1","type":"paragraph","props":{},"content":[{"type":"text","text":"行内公式","styles":{}},{"type":"inlineFormula","props":{},"content":"x_1 + x_2"}],"children":[]}]}`
	normalized, err := normalizedPageContent(knowledgesdk.PageContentSchemaVersion, content, "")
	if err != nil {
		t.Fatal(err)
	}
	if normalized.PlainText != "E = mc^2 行内公式 x_1 + x_2" {
		t.Fatalf("formula source was not indexed deterministically: %q", normalized.PlainText)
	}
	invalid := `{"blocks":[{"id":"paragraph-1","type":"paragraph","props":{},"content":[{"type":"inlineFormula","props":{"script":"alert(1)"},"content":"x"}],"children":[]}]}`
	if _, validationErr := normalizedPageContent(knowledgesdk.PageContentSchemaVersion, invalid, ""); validationErr == nil {
		t.Fatal("inline formula with executable properties was accepted")
	}
}

func TestKnowledgePageInlineMentionsUseStableIdentifiers(t *testing.T) {
	pageID := "kpage_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
	content := `{"blocks":[{"id":"paragraph-1","type":"paragraph","props":{},"content":[{"type":"text","text":"参与者","styles":{}},{"type":"personMention","props":{"userId":"user-123"}},{"type":"dateMention","props":{"date":"2026-10-21"}},{"type":"pageMention","props":{"pageId":"` + pageID + `"}},{"type":"blockMention","props":{"pageId":"` + pageID + `","blockId":"block-target"}}],"children":[]}]}`
	normalized, err := normalizedPageContent(knowledgesdk.PageContentSchemaVersion, content, "")
	if err != nil {
		t.Fatal(err)
	}
	expected := "参与者 @user-123 2026-10-21 knowledge-page:" + pageID + " knowledge-page:" + pageID + "#block-target"
	if normalized.PlainText != expected {
		t.Fatalf("inline mention identifiers were not indexed deterministically: got=%q want=%q", normalized.PlainText, expected)
	}
	references, err := scanJSONPageReferences(normalized.Content)
	if err != nil || len(references) != 2 || references[0].TargetID != pageID || references[1].TargetID != pageID {
		t.Fatalf("inline page references were not scanned: references=%+v err=%v", references, err)
	}
	for name, invalid := range map[string]string{
		"person snapshot": `{"blocks":[{"id":"p","type":"paragraph","props":{},"content":[{"type":"personMention","props":{"userId":"user-123","displayName":"Alice"}}],"children":[]}]}`,
		"missing person":  `{"blocks":[{"id":"p","type":"paragraph","props":{},"content":[{"type":"personMention","props":{"userId":""}}],"children":[]}]}`,
		"invalid date":    `{"blocks":[{"id":"p","type":"paragraph","props":{},"content":[{"type":"dateMention","props":{"date":"2026-02-30"}}],"children":[]}]}`,
		"invalid page":    `{"blocks":[{"id":"p","type":"paragraph","props":{},"content":[{"type":"pageMention","props":{"pageId":"page-1"}}],"children":[]}]}`,
		"invalid block":   `{"blocks":[{"id":"p","type":"paragraph","props":{},"content":[{"type":"blockMention","props":{"pageId":"` + pageID + `","blockId":"<script>"}}],"children":[]}]}`,
		"inline content":  `{"blocks":[{"id":"p","type":"paragraph","props":{},"content":[{"type":"pageMention","props":{"pageId":"` + pageID + `"},"content":"snapshot"}],"children":[]}]}`,
	} {
		t.Run(name, func(t *testing.T) {
			if _, validationErr := normalizedPageContent(knowledgesdk.PageContentSchemaVersion, invalid, ""); validationErr == nil {
				t.Fatalf("invalid inline mention was accepted: %s", invalid)
			}
		})
	}
}

func TestKnowledgePageMediaBlocksUseOnlyAuthorizedDocumentReferences(t *testing.T) {
	content := `{"blocks":[{"id":"image-1","type":"image","props":{"backgroundColor":"default","textAlignment":"center","name":"架构图","caption":"系统边界","url":"knowledge-document:kdoc_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","showPreview":true,"previewWidth":720,"cropAspect":"16:9","cropX":40,"cropY":65,"cropZoom":125},"children":[]},{"id":"video-1","type":"video","props":{"backgroundColor":"default","textAlignment":"left","name":"演示视频","caption":"发布演示","url":"knowledge-document:kdoc_bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","showPreview":true,"previewWidth":960},"children":[]},{"id":"audio-1","type":"audio","props":{"backgroundColor":"default","name":"访谈录音","caption":"用户访谈","url":"knowledge-document:kdoc_cccccccccccccccccccccccccccccccc","showPreview":true},"children":[]},{"id":"file-1","type":"file","props":{"backgroundColor":"default","name":"需求文档.pdf","caption":"原始附件","url":"knowledge-document:kdoc_dddddddddddddddddddddddddddddddd"},"children":[]}]}`
	normalized, err := normalizedPageContent(knowledgesdk.PageContentSchemaVersion, content, "")
	if err != nil || normalized.PlainText != "系统边界 架构图 发布演示 演示视频 用户访谈 访谈录音 原始附件 需求文档.pdf" {
		t.Fatalf("authorized media blocks were not normalized: normalized=%+v err=%v", normalized, err)
	}
	for name, invalid := range map[string]string{
		"unknown crop aspect": `{"blocks":[{"id":"image-1","type":"image","props":{"url":"knowledge-document:kdoc_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","cropAspect":"2:1"},"children":[]}]}`,
		"crop focus overflow": `{"blocks":[{"id":"image-1","type":"image","props":{"url":"knowledge-document:kdoc_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","cropAspect":"1:1","cropX":101},"children":[]}]}`,
		"crop zoom underflow": `{"blocks":[{"id":"image-1","type":"image","props":{"url":"knowledge-document:kdoc_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","cropAspect":"1:1","cropZoom":99},"children":[]}]}`,
		"video crop metadata": `{"blocks":[{"id":"video-1","type":"video","props":{"url":"knowledge-document:kdoc_bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","cropAspect":"1:1"},"children":[]}]}`,
	} {
		t.Run(name, func(t *testing.T) {
			if _, validationErr := normalizedPageContent(knowledgesdk.PageContentSchemaVersion, invalid, ""); validationErr == nil {
				t.Fatalf("invalid image crop metadata was accepted: %s", invalid)
			}
		})
	}
}

func TestKnowledgePageCardsUseSanitizedMetadataAndControlledURLs(t *testing.T) {
	raw := `{"blocks":[{"id":"bookmark-1","type":"bookmark","props":{"url":"https://openai.com/research","title":"&lt;b&gt;安全标题&lt;/b&gt;","description":"<script>alert(1)</script>\u0007 正文","siteName":" OpenAI  Research "},"children":[]},{"id":"page-1","type":"knowledgeReference","props":{"targetPageId":"kpage_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","title":"知识页面","targetType":"document","display":"card"},"children":[]},{"id":"person-1","type":"personCard","props":{"userId":"user-123","displayName":" Alice  <b>管理员</b> ","email":"alice@example.com"},"children":[]},{"id":"embed-1","type":"externalEmbed","props":{"provider":"youtube","url":"https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ","title":"产品演示"},"children":[]}]}`
	digest := sha256.Sum256([]byte(raw))
	normalized, err := normalizedPageContent(knowledgesdk.PageContentSchemaVersion, raw, hex.EncodeToString(digest[:]))
	if err != nil {
		t.Fatal(err)
	}
	for _, forbidden := range []string{"<script>", "<b>", "&lt;b&gt;", "\u0007"} {
		if strings.Contains(normalized.Content, forbidden) {
			t.Fatalf("card metadata was not cleaned: forbidden=%q content=%s", forbidden, normalized.Content)
		}
	}
	for _, expected := range []string{"安全标题", "alert(1) 正文", "OpenAI Research", "Alice 管理员", "alice@example.com", "知识页面", "产品演示"} {
		if !strings.Contains(normalized.PlainText, expected) {
			t.Fatalf("card metadata was not indexed: expected=%q plain=%q", expected, normalized.PlainText)
		}
	}
	canonicalDigest := sha256.Sum256([]byte(normalized.Content))
	if normalized.ContentSHA256 != hex.EncodeToString(canonicalDigest[:]) || normalized.Content == raw {
		t.Fatalf("sanitized card content did not receive a canonical hash: %+v", normalized)
	}
	if err = validateDocumentPageBeforePublish(normalized.Content); err != nil {
		t.Fatalf("valid card content could not be published: %v", err)
	}
}

func TestKnowledgePageCardsRejectUnsafeURLsAndMetadata(t *testing.T) {
	invalid := map[string]string{
		"bookmark HTTP":              `{"blocks":[{"id":"bookmark-1","type":"bookmark","props":{"url":"http://openai.com","title":"HTTP"},"children":[]}]}`,
		"bookmark localhost":         `{"blocks":[{"id":"bookmark-1","type":"bookmark","props":{"url":"https://localhost/admin","title":"local"},"children":[]}]}`,
		"bookmark private IP":        `{"blocks":[{"id":"bookmark-1","type":"bookmark","props":{"url":"https://127.0.0.1/admin","title":"IP"},"children":[]}]}`,
		"bookmark credentials":       `{"blocks":[{"id":"bookmark-1","type":"bookmark","props":{"url":"https://admin:secret@openai.com/","title":"credentials"},"children":[]}]}`,
		"bookmark custom port":       `{"blocks":[{"id":"bookmark-1","type":"bookmark","props":{"url":"https://openai.com:8443/","title":"port"},"children":[]}]}`,
		"bookmark unknown property":  `{"blocks":[{"id":"bookmark-1","type":"bookmark","props":{"url":"https://openai.com/","title":"x","script":"alert(1)"},"children":[]}]}`,
		"arbitrary iframe":           `{"blocks":[{"id":"embed-1","type":"externalEmbed","props":{"provider":"youtube","url":"https://evil.example.com/embed/dQw4w9WgXcQ","title":"evil"},"children":[]}]}`,
		"noncanonical youtube":       `{"blocks":[{"id":"embed-1","type":"externalEmbed","props":{"provider":"youtube","url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ","title":"watch"},"children":[]}]}`,
		"provider mismatch":          `{"blocks":[{"id":"embed-1","type":"externalEmbed","props":{"provider":"bilibili","url":"https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ","title":"mismatch"},"children":[]}]}`,
		"embed query injection":      `{"blocks":[{"id":"embed-1","type":"externalEmbed","props":{"provider":"youtube","url":"https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?origin=https://evil.example","title":"query"},"children":[]}]}`,
		"invalid person email":       `{"blocks":[{"id":"person-1","type":"personCard","props":{"userId":"user-1","displayName":"Alice","email":"Alice <alice@example.com>"},"children":[]}]}`,
		"page card unknown property": `{"blocks":[{"id":"page-1","type":"knowledgeReference","props":{"targetPageId":"kpage_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","title":"页面","targetType":"document","display":"card","script":"alert(1)"},"children":[]}]}`,
		"block envelope script":      `{"blocks":[{"id":"bookmark-1","type":"bookmark","props":{"url":"https://openai.com/","title":"x"},"children":[],"script":"alert(1)"}]}`,
	}
	for name, content := range invalid {
		t.Run(name, func(t *testing.T) {
			if _, err := normalizedPageContent(knowledgesdk.PageContentSchemaVersion, content, ""); err == nil {
				t.Fatalf("unsafe card content was accepted: %s", content)
			}
		})
	}
}

func TestKnowledgePagePublishRejectsUnresolvedCards(t *testing.T) {
	for name, content := range map[string]string{
		"bookmark": `{"blocks":[{"id":"bookmark-1","type":"bookmark","props":{"url":"","title":"待补充书签"},"children":[]}]}`,
		"person":   `{"blocks":[{"id":"person-1","type":"personCard","props":{"userId":"","displayName":"待选择成员","email":""},"children":[]}]}`,
		"embed":    `{"blocks":[{"id":"embed-1","type":"externalEmbed","props":{"provider":"youtube","url":"","title":"待补充视频"},"children":[]}]}`,
	} {
		t.Run(name, func(t *testing.T) {
			if err := validateDocumentPageBeforePublish(content); err == nil {
				t.Fatalf("unresolved card was publishable: %s", content)
			}
		})
	}
}

func TestKnowledgePageCodeBlockLanguageAndWrapAreValidated(t *testing.T) {
	content := `{"blocks":[{"id":"code-1","type":"codeBlock","props":{"language":"typescript","wrap":false},"content":[{"type":"text","text":"const answer: number = 42","styles":{}}],"children":[]}]}`
	normalized, err := normalizedPageContent(knowledgesdk.PageContentSchemaVersion, content, "")
	if err != nil || normalized.PlainText != "const answer: number = 42" {
		t.Fatalf("valid code block was not normalized: normalized=%+v err=%v", normalized, err)
	}
	for name, invalid := range map[string]string{
		"unknown language": `{"blocks":[{"id":"code-1","type":"codeBlock","props":{"language":"brainfuck","wrap":true},"content":"+","children":[]}]}`,
		"non-boolean wrap": `{"blocks":[{"id":"code-1","type":"codeBlock","props":{"language":"go","wrap":"yes"},"content":"package main","children":[]}]}`,
	} {
		t.Run(name, func(t *testing.T) {
			if _, validationErr := normalizedPageContent(knowledgesdk.PageContentSchemaVersion, invalid, ""); validationErr == nil {
				t.Fatalf("invalid code block metadata was accepted: %s", invalid)
			}
		})
	}
}

func TestKnowledgePageTableStructureAndPresentationAreValidated(t *testing.T) {
	content := `{"blocks":[{"id":"table-1","type":"table","props":{"textColor":"default"},"content":{"type":"tableContent","columnWidths":[160,null],"headerRows":1,"headerCols":1,"rows":[{"cells":[{"type":"tableCell","props":{"backgroundColor":"gray","textColor":"default","textAlignment":"center","colspan":1,"rowspan":2},"content":[{"type":"text","text":"负责人","styles":{"bold":true}}]},{"type":"tableCell","props":{"backgroundColor":"gray","textColor":"default","textAlignment":"center","colspan":1,"rowspan":1},"content":[{"type":"text","text":"状态","styles":{"bold":true}}]}]},{"cells":[{"type":"tableCell","props":{"backgroundColor":"green","textColor":"default","textAlignment":"right","colspan":1,"rowspan":1},"content":[{"type":"text","text":"完成","styles":{}}]}]}]},"children":[]}]}`
	normalized, err := normalizedPageContent(knowledgesdk.PageContentSchemaVersion, content, "")
	if err != nil || normalized.PlainText != "负责人 状态 完成" {
		t.Fatalf("valid styled and merged table was not normalized: normalized=%+v err=%v", normalized, err)
	}
	for name, invalid := range map[string]string{
		"ragged row":      `{"blocks":[{"id":"table-1","type":"table","props":{},"content":{"type":"tableContent","columnWidths":[120,120],"rows":[{"cells":[{"type":"tableCell","props":{"backgroundColor":"default","textColor":"default","textAlignment":"left","colspan":1,"rowspan":1},"content":[]}]}]},"children":[]}]}`,
		"unsafe color":    `{"blocks":[{"id":"table-1","type":"table","props":{},"content":{"type":"tableContent","columnWidths":[120],"rows":[{"cells":[{"type":"tableCell","props":{"backgroundColor":"url(javascript:alert(1))","textColor":"default","textAlignment":"left","colspan":1,"rowspan":1},"content":[]}]}]},"children":[]}]}`,
		"bad alignment":   `{"blocks":[{"id":"table-1","type":"table","props":{},"content":{"type":"tableContent","columnWidths":[120],"rows":[{"cells":[{"type":"tableCell","props":{"backgroundColor":"default","textColor":"default","textAlignment":"diagonal","colspan":1,"rowspan":1},"content":[]}]}]},"children":[]}]}`,
		"span past table": `{"blocks":[{"id":"table-1","type":"table","props":{},"content":{"type":"tableContent","columnWidths":[120],"rows":[{"cells":[{"type":"tableCell","props":{"backgroundColor":"default","textColor":"default","textAlignment":"left","colspan":2,"rowspan":1},"content":[]}]}]},"children":[]}]}`,
		"unknown field":   `{"blocks":[{"id":"table-1","type":"table","props":{},"content":{"type":"tableContent","columnWidths":[120],"script":"alert(1)","rows":[{"cells":[{"type":"tableCell","props":{"backgroundColor":"default","textColor":"default","textAlignment":"left","colspan":1,"rowspan":1},"content":[]}]}]},"children":[]}]}`,
	} {
		t.Run(name, func(t *testing.T) {
			if _, validationErr := normalizedPageContent(knowledgesdk.PageContentSchemaVersion, invalid, ""); validationErr == nil {
				t.Fatalf("invalid table was accepted: %s", invalid)
			}
		})
	}
}

func TestKnowledgePageColumnLayoutIsValidatedAndIndexed(t *testing.T) {
	content := `{"blocks":[{"id":"columns-1","type":"columnList","props":{},"children":[{"id":"column-1","type":"column","props":{"width":1},"children":[{"id":"paragraph-1","type":"paragraph","props":{},"content":[{"type":"text","text":"左栏","styles":{}}],"children":[]}]},{"id":"column-2","type":"column","props":{"width":1},"children":[{"id":"paragraph-2","type":"paragraph","props":{},"content":[{"type":"text","text":"右栏","styles":{}}],"children":[]}]}]}]}`
	normalized, err := normalizedPageContent(knowledgesdk.PageContentSchemaVersion, content, "")
	if err != nil || normalized.PlainText != "左栏 右栏" {
		t.Fatalf("valid column layout was not indexed: normalized=%+v err=%v", normalized, err)
	}
	for name, invalid := range map[string]string{
		"legacy fake type": `{"blocks":[{"id":"columns-1","type":"columns","props":{},"children":[]}]}`,
		"one column":       `{"blocks":[{"id":"columns-1","type":"columnList","props":{},"children":[{"id":"column-1","type":"column","props":{},"children":[]}]}]}`,
		"root column":      `{"blocks":[{"id":"column-1","type":"column","props":{},"children":[]}]}`,
		"wrong child":      `{"blocks":[{"id":"columns-1","type":"columnList","props":{},"children":[{"id":"column-1","type":"column","props":{},"children":[]},{"id":"paragraph-1","type":"paragraph","props":{},"content":[],"children":[]}]}]}`,
	} {
		t.Run(name, func(t *testing.T) {
			if _, validationErr := normalizedPageContent(knowledgesdk.PageContentSchemaVersion, invalid, ""); validationErr == nil {
				t.Fatalf("invalid column layout was accepted: %s", invalid)
			}
		})
	}
}

func TestKnowledgePageTableOfContentsBlockIsStrictMetadata(t *testing.T) {
	content := `{"blocks":[{"id":"toc-1","type":"tableOfContents","props":{"maxDepth":3},"children":[]},{"id":"heading-1","type":"heading","props":{"level":1},"content":[{"type":"text","text":"架构","styles":{}}],"children":[]}]}`
	normalized, err := normalizedPageContent(knowledgesdk.PageContentSchemaVersion, content, "")
	if err != nil || normalized.PlainText != "架构" {
		t.Fatalf("table of contents metadata changed the text projection: normalized=%+v err=%v", normalized, err)
	}
	for _, invalid := range []string{
		`{"blocks":[{"id":"toc-1","type":"tableOfContents","props":{"maxDepth":0},"children":[]}]}`,
		`{"blocks":[{"id":"toc-1","type":"tableOfContents","props":{"maxDepth":4},"children":[]}]}`,
		`{"blocks":[{"id":"toc-1","type":"tableOfContents","props":{"maxDepth":"3"},"children":[]}]}`,
	} {
		if _, validationErr := normalizedPageContent(knowledgesdk.PageContentSchemaVersion, invalid, ""); validationErr == nil {
			t.Fatalf("invalid table of contents metadata was accepted: %s", invalid)
		}
	}
}

func TestKnowledgePageDynamicBusinessBlocksUseStrictStableReferences(t *testing.T) {
	content := `{"blocks":[{"id":"collection-1","type":"informationCollection","props":{"targetPageId":"kpage_0123456789abcdef0123456789abcdef","title":"报名信息"},"children":[]},{"id":"activity-1","type":"knowledgeActivity","props":{"maxItems":10},"children":[]}]}`
	normalized, err := normalizedPageContent(knowledgesdk.PageContentSchemaVersion, content, "")
	if err != nil || normalized.PlainText != "报名信息" {
		t.Fatalf("dynamic business Blocks were not normalized: normalized=%+v err=%v", normalized, err)
	}
	for _, invalid := range []string{
		`{"blocks":[{"id":"collection-1","type":"informationCollection","props":{"targetPageId":"javascript:alert(1)","title":"报名"},"children":[]}]}`,
		`{"blocks":[{"id":"collection-1","type":"informationCollection","props":{"targetPageId":"","title":42},"children":[]}]}`,
		`{"blocks":[{"id":"activity-1","type":"knowledgeActivity","props":{"maxItems":50},"children":[]}]}`,
		`{"blocks":[{"id":"activity-1","type":"knowledgeActivity","props":{"maxItems":10,"events":[]},"children":[]}]}`,
	} {
		if _, validationErr := normalizedPageContent(knowledgesdk.PageContentSchemaVersion, invalid, ""); validationErr == nil {
			t.Fatalf("invalid dynamic business Block was accepted: %s", invalid)
		}
	}
}

func TestKnowledgePagePublishRequiresPublishedAncestorChain(t *testing.T) {
	store, authority, library, parent := pageFixture(t)
	child, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "unpublished-parent-child", ParentPageID: parent.Page.ID, Title: "子页面", ContentType: knowledgesdk.KnowledgePageTypeDocument}, authority)
	if err != nil {
		t.Fatal(err)
	}
	if _, err = store.PublishKnowledgePage(t.Context(), library.ID, child.Page.ID, knowledgesdk.KnowledgePagePublish{ClientID: "child-publish-too-early", ExpectedPageRevision: child.Page.Revision, ExpectedDraftRevision: child.Draft.DraftRevision}, authority); err == nil || !strings.Contains(err.Error(), "page_parent_unpublished") {
		t.Fatalf("child was published beneath an unpublished ancestor: %v", err)
	}
	parent = publishPageFixture(t, store, authority, library, parent, "publish-parent-first")
	if _, err = store.PublishKnowledgePage(t.Context(), library.ID, child.Page.ID, knowledgesdk.KnowledgePagePublish{ClientID: "child-publish-after-parent", ExpectedPageRevision: child.Page.Revision, ExpectedDraftRevision: child.Draft.DraftRevision}, authority); err != nil {
		t.Fatalf("child publish failed after its ancestor was published: %v", err)
	}
}
