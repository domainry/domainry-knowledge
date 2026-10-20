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
		knowledgesdk.KnowledgePageTypeMultidimensionalTable: `{"fields":[{"id":"name","name":"客户","type":"text"}],"records":[{"id":"r1","values":{"name":"北辰科技"}}]}`,
		knowledgesdk.KnowledgePageTypeSpreadsheet:           `{"id":"workbook-1","name":"预算","appVersion":"1.1.0","locale":"zhCN","sheetOrder":["s1"],"styles":{},"sheets":{"s1":{"id":"s1","name":"预算","cellData":{"0":{"0":{"v":"项目"},"1":{"v":"金额"}},"1":{"0":{"v":"设计"},"1":{"v":12000}}}}}}`,
		knowledgesdk.KnowledgePageTypePresentation:          `{"slides":[{"id":"s1","title":"季度复盘","elements":[{"id":"title","type":"text","text":"增长 28%"}],"files":{}}]}`,
		knowledgesdk.KnowledgePageTypeForm:                  `{"display":"form","components":[{"type":"radio","key":"satisfaction","label":"满意度","input":true,"validate":{"required":true},"values":[{"label":"满意","value":"good"},{"label":"一般","value":"normal"}]}]}`,
		knowledgesdk.KnowledgePageTypeMindNote:              `{"nodes":[{"id":"n1","type":"bulletListItem","props":{},"content":[{"type":"text","text":"核心判断","styles":{}}],"children":[]}]}`,
		knowledgesdk.KnowledgePageTypeWhiteboard:            `{"nodes":[{"id":"n1","type":"text","text":"用户问题","x":10,"y":20}],"files":{}}`,
		knowledgesdk.KnowledgePageTypeMindMap:               `{"root":{"nodeData":{"id":"root","topic":"产品战略","children":[{"id":"n1","topic":"增长","children":[]}]},"direction":2}}`,
		knowledgesdk.KnowledgePageTypeFlowchart:             `{"nodes":[{"id":"n1","type":"rect","x":240,"y":160,"text":"提交审批"}],"edges":[]}`,
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
		ClientID: "archive-comment-create", PublishedVersion: page.Page.PublishedVersion, Body: "归档前评论",
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
			_, mutationErr := store.CreateKnowledgePageComment(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageCommentCreate{ClientID: "archived-create", PublishedVersion: page.Page.PublishedVersion, Body: "禁止"}, authority)
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
	comment, err := store.CreateKnowledgePageComment(t.Context(), library.ID, root.Page.ID, knowledgesdk.KnowledgePageCommentCreate{ClientID: "comment-1", PublishedVersion: 1, Body: "请复核", MentionedUserIDs: []string{"alice"}}, bob)
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
	if _, err = store.CreateKnowledgePageComment(t.Context(), library.ID, root.Page.ID, knowledgesdk.KnowledgePageCommentCreate{ClientID: "bad-mention", PublishedVersion: 1, Body: "未知成员", MentionedUserIDs: []string{"mallory"}}, bob); err == nil || !strings.Contains(err.Error(), "mention") {
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
	record, err := store.KnowledgeDocumentRecord(t.Context(), knowledgePageProjectionDocumentID(authority, root.Page.ID), authority)
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
	if err != nil || len(children.Items) != 1 || children.Items[0].ID != child.Page.ID || children.Items[0].Title != "已发布子页面" {
		t.Fatalf("reader child tree used unpublished draft state: %+v err=%v", children, err)
	}
	first, err := store.KnowledgePages(t.Context(), library.ID, "", "", 1, false, bob)
	if err != nil || len(first.Items) != 1 || first.Items[0].ID != parent.Page.ID || first.Complete || first.NextAfter != parent.Page.ID {
		t.Fatalf("reader first page did not filter before pagination: %+v err=%v", first, err)
	}
	second, err := store.KnowledgePages(t.Context(), library.ID, "", first.NextAfter, 1, false, bob)
	if err != nil || len(second.Items) != 1 || second.Items[0].ID != sibling.Page.ID || !second.Complete {
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
		ClientID: "anchor-comment", PublishedVersion: 1, Anchor: knowledgesdk.KnowledgePageCommentAnchor{NodeID: "section-a", Quote: "第一版"}, Body: "这里需要调整",
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	if comment.Anchor.Changed {
		t.Fatal("new comment anchor was marked changed")
	}
	page = savePageFixture(t, store, authority, library, page, "anchor-v2", "锚点页面", "第二版正文")
	_ = publishPageFixture(t, store, authority, library, page, "anchor-publish-v2")
	comments, err := store.KnowledgePageComments(t.Context(), library.ID, page.Page.ID, "", 20, false, authority)
	if err != nil || len(comments.Items) != 1 || !comments.Items[0].Anchor.Changed {
		t.Fatalf("old version anchor was not marked changed: %+v err=%v", comments, err)
	}
}

func TestKnowledgePageContentValidationAndDeterministicTextProjection(t *testing.T) {
	content := `{"blocks":[{"id":"heading-1","type":"heading","props":{"level":1},"content":[{"type":"text","text":"中文标题","styles":{}}],"children":[]},{"id":"table-1","type":"table","props":{},"content":{"type":"tableContent","rows":[{"cells":[{"type":"tableCell","content":[{"type":"text","text":"项目","styles":{}}]},{"type":"tableCell","content":[{"type":"text","text":"状态","styles":{}}]}]},{"cells":[{"type":"tableCell","content":[{"type":"text","text":"页面","styles":{}}]},{"type":"tableCell","content":[{"type":"text","text":"完成","styles":{}}]}]}]},"children":[]},{"id":"code-1","type":"codeBlock","props":{"language":"go"},"content":[{"type":"text","text":"fmt.Println(\"确定性\")","styles":{}}],"children":[]},{"id":"link-1","type":"paragraph","props":{},"content":[{"type":"link","href":"https://example.invalid","content":[{"type":"text","text":"说明","styles":{}}]}],"children":[]},{"id":"image-1","type":"image","props":{"url":"knowledge-document:kdoc_123","caption":"架构图","name":"架构图"},"children":[]}]}`
	first, err := normalizedPageContent(knowledgesdk.PageContentSchemaVersion, content, "")
	if err != nil {
		t.Fatal(err)
	}
	second, err := normalizedPageContent(knowledgesdk.PageContentSchemaVersion, content, first.ContentSHA256)
	if err != nil || second != first || first.PlainText != "中文标题 项目 状态 页面 完成 fmt.Println(\"确定性\") 说明 架构图 架构图" {
		t.Fatalf("page content normalization was not deterministic: first=%+v second=%+v err=%v", first, second, err)
	}
	for name, invalid := range map[string]string{
		"unknown block":  `{"blocks":[{"id":"evil-1","type":"html","props":{},"content":"<script>alert(1)</script>","children":[]}]}`,
		"external image": `{"blocks":[{"id":"image-1","type":"image","props":{"url":"https://example.invalid/a.png"},"children":[]}]}`,
		"data image":     `{"blocks":[{"id":"image-1","type":"image","props":{"url":"data:image/png;base64,AAAA"},"children":[]}]}`,
		"duplicate id":   `{"blocks":[{"id":"same","type":"paragraph","props":{},"content":[],"children":[]},{"id":"same","type":"paragraph","props":{},"content":[],"children":[]}]}`,
		"nul":            "{\"blocks\":\u0000}",
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
