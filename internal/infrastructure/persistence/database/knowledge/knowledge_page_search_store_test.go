package store

import (
	"context"
	"strings"
	"testing"
	"time"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func TestKnowledgePageSearchAppliesStructuredFiltersAndReturnsCanonicalBlock(t *testing.T) {
	store, authority, library, root := pageFixture(t)
	root = savePageFixture(t, store, authority, library, root, "search-root-save", "产品中心", "产品知识入口")
	root = publishPageFixture(t, store, authority, library, root, "search-root-publish")

	child, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{
		ClientID: "search-child", ParentPageID: root.Page.ID, Title: "发布手册", ContentType: knowledgesdk.KnowledgePageTypeDocument,
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	child = savePageFixture(t, store, authority, library, child, "search-child-save", "发布手册", "发布流程需要双人复核\n回滚步骤必须演练")
	child = publishPageFixture(t, store, authority, library, child, "search-child-publish")
	metadata, err := store.SetKnowledgePageMetadata(t.Context(), library.ID, child.Page.ID, knowledgesdk.KnowledgePageMetadataWrite{
		ClientID: "search-child-metadata", ExpectedRevision: 1, Tags: []string{"产品", "发布"}, Status: knowledgesdk.KnowledgePageStatusVerified,
	}, authority)
	if err != nil || metadata.Revision != 2 {
		t.Fatalf("metadata setup failed: metadata=%+v err=%v", metadata, err)
	}
	unpublished, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{
		ClientID: "search-unpublished", ParentPageID: root.Page.ID, Title: "未发布计划", ContentType: knowledgesdk.KnowledgePageTypeDocument,
	}, authority)
	if err != nil {
		t.Fatal(err)
	}

	result, err := store.SearchKnowledgePages(t.Context(), library.ID, knowledgesdk.KnowledgePageSearchInput{
		Query: "发布流程", ContentTypes: []string{knowledgesdk.KnowledgePageTypeDocument}, AuthorUserIDs: []string{authority.UserID},
		UpdatedAfter: timePointer(child.Page.UpdatedAt.Add(-time.Minute)), UpdatedBefore: timePointer(child.Page.UpdatedAt.Add(time.Minute)),
		Tags: []string{"产品", "发布"}, PathQuery: "产品中心 / 发布手册", AncestorPageID: root.Page.ID,
		PublicationStatuses: []string{knowledgesdk.KnowledgePagePublicationPublished}, Limit: 20,
	}, authority)
	if err != nil || len(result.Items) != 1 {
		t.Fatalf("structured page search mismatch: result=%+v err=%v", result, err)
	}
	hit := result.Items[0]
	if hit.PageID != child.Page.ID || hit.Kind != knowledgesdk.KnowledgePageSearchKindPage || hit.ContentType != knowledgesdk.KnowledgePageTypeDocument || hit.AuthorUserID != authority.UserID || hit.PublishedVersion != 1 || hit.PublicationStatus != knowledgesdk.KnowledgePagePublicationPublished || hit.IndexStatus != "queued" || hit.Location.Kind != knowledgesdk.KnowledgePageSearchMatchBlock || hit.Location.BlockID != "block-1" || len(hit.Path) != 2 || hit.Path[0].PageID != root.Page.ID || hit.Path[1].PageID != child.Page.ID {
		t.Fatalf("search hit lost canonical identity or locator: %+v", hit)
	}

	unpublishedResult, err := store.SearchKnowledgePages(t.Context(), library.ID, knowledgesdk.KnowledgePageSearchInput{
		Query: "未发布计划", PublicationStatuses: []string{knowledgesdk.KnowledgePagePublicationUnpublished}, Limit: 20,
	}, authority)
	if err != nil || len(unpublishedResult.Items) != 1 || unpublishedResult.Items[0].PageID != unpublished.Page.ID || unpublishedResult.Items[0].IndexStatus != "none" || unpublishedResult.Items[0].Location.Kind != knowledgesdk.KnowledgePageSearchMatchPage {
		t.Fatalf("unpublished title search mismatch: result=%+v err=%v", unpublishedResult, err)
	}

	wrongTag, err := store.SearchKnowledgePages(t.Context(), library.ID, knowledgesdk.KnowledgePageSearchInput{Query: "发布流程", Tags: []string{"不存在"}, Limit: 20}, authority)
	if err != nil || len(wrongTag.Items) != 0 {
		t.Fatalf("tag filter leaked a nonmatching page: result=%+v err=%v", wrongTag, err)
	}
}

func TestKnowledgePageSearchClassifiesNativeCellAndFileResults(t *testing.T) {
	if got := pageSearchKind(knowledgesdk.KnowledgePageTypeFile); got != knowledgesdk.KnowledgePageSearchKindFile {
		t.Fatalf("file page was classified as %q", got)
	}
	store, authority, library, _ := pageFixture(t)
	grid, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "search-grid", Title: "客户表", ContentType: knowledgesdk.KnowledgePageTypeMultidimensionalTable}, authority)
	if err != nil {
		t.Fatal(err)
	}
	grid = savePageFixture(t, store, authority, library, grid, "search-grid-save", "客户表", `{"schema_version":1,"fields":[{"id":"name","name":"客户","type":"text"}],"records":[{"id":"record-1","values":{"name":"北辰科技"}}],"views":[{"id":"view-1","name":"表格","type":"grid"}]}`)
	grid = publishPageFixture(t, store, authority, library, grid, "search-grid-publish")

	result, err := store.SearchKnowledgePages(t.Context(), library.ID, knowledgesdk.KnowledgePageSearchInput{Query: "北辰科技", Limit: 20}, authority)
	if err != nil || len(result.Items) != 1 {
		t.Fatalf("native page search failed: result=%+v err=%v", result, err)
	}
	hit := result.Items[0]
	if hit.PageID != grid.Page.ID || hit.Kind != knowledgesdk.KnowledgePageSearchKindNativeApp || hit.Location.Kind != knowledgesdk.KnowledgePageSearchMatchCell || hit.Location.RecordID != "record-1" || hit.Location.FieldID != "name" {
		t.Fatalf("native cell locator mismatch: %+v", hit)
	}
}

func TestKnowledgePageSearchEventsWakeForLibraryChangesAndCloseOnRevocation(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	page = savePageFixture(t, store, authority, library, page, "search-event-save", "实时检索", "已发布内容")
	page = publishPageFixture(t, store, authority, library, page, "search-event-publish")
	bob := authority
	bob.UserID = "search-event-bob"
	var err error
	library, err = store.SetKnowledgeLibraryMember(t.Context(), library.ID, bob.UserID, knowledgesdk.KnowledgeLibraryMemberWrite{Role: "reader", ExpectedRevision: library.Revision}, authority)
	if err != nil {
		t.Fatal(err)
	}
	initial, err := store.KnowledgePageSearchEvents(t.Context(), library.ID, knowledgesdk.KnowledgePageSearchEvents{}, bob)
	if err != nil || len(initial.Events) != 1 || initial.Events[0].Type != knowledgesdk.KnowledgePageSearchEventHeartbeat || initial.Revision <= 0 || initial.Revision > int64(1<<53-1) {
		t.Fatalf("unexpected initial search event: batch=%+v err=%v", initial, err)
	}

	ctx, cancel := context.WithTimeout(t.Context(), 3*time.Second)
	defer cancel()
	changed := make(chan knowledgesdk.KnowledgePageSearchEventBatch, 1)
	errors := make(chan error, 1)
	go func() {
		batch, waitErr := store.KnowledgePageSearchEvents(ctx, library.ID, knowledgesdk.KnowledgePageSearchEvents{AfterRevision: initial.Revision, WaitMillis: 2500}, bob)
		if waitErr != nil {
			errors <- waitErr
			return
		}
		changed <- batch
	}()
	page = savePageFixture(t, store, authority, library, page, "search-event-change", "实时检索", "更新中的草稿")
	select {
	case waitErr := <-errors:
		t.Fatal(waitErr)
	case batch := <-changed:
		if len(batch.Events) != 1 || batch.Events[0].Type != knowledgesdk.KnowledgePageSearchEventChanged || batch.Events[0].Revision == initial.Revision || batch.Events[0].Code != "" {
			t.Fatalf("page change did not produce a content-free search invalidation: %+v", batch)
		}
	case <-ctx.Done():
		t.Fatal("search event did not wake after a page change")
	}

	revoked := make(chan error, 1)
	go func() {
		_, waitErr := store.KnowledgePageSearchEvents(ctx, library.ID, knowledgesdk.KnowledgePageSearchEvents{AfterRevision: initial.Revision, WaitMillis: 2500}, bob)
		revoked <- waitErr
	}()
	if _, err = store.RemoveKnowledgeLibraryMember(t.Context(), library.ID, bob.UserID, library.Revision, authority); err != nil {
		t.Fatal(err)
	}
	select {
	case waitErr := <-revoked:
		if waitErr == nil || !strings.Contains(waitErr.Error(), "library_not_found") {
			t.Fatalf("revoked search event wait returned %v", waitErr)
		}
	case <-ctx.Done():
		t.Fatal("membership revocation did not close the search event wait")
	}
}

func TestKnowledgePageSearchRelevanceRegression(t *testing.T) {
	tests := []struct {
		name              string
		title, path, body string
		tags              []string
		query, wantNeedle string
		wantMatch         bool
		minimum, maximum  int
	}{
		{name: "exact title", title: "发布规范", path: "产品 / 发布规范", body: "正文", query: "发布规范", wantNeedle: "发布规范", wantMatch: true, minimum: 1000, maximum: 1000},
		{name: "title weight", title: "发布规范手册", body: "发布规范", query: "发布规范", wantNeedle: "发布规范", wantMatch: true, minimum: 700, maximum: 700},
		{name: "tag weight", title: "运行手册", tags: []string{"发布规范"}, query: "发布规范", wantNeedle: "发布规范", wantMatch: true, minimum: 500, maximum: 500},
		{name: "path weight", title: "运行手册", path: "产品 / 发布规范 / 运行手册", query: "发布规范", wantNeedle: "发布规范", wantMatch: true, minimum: 300, maximum: 300},
		{name: "body weight", title: "运行手册", body: "正文说明发布规范需要双人复核", query: "发布规范", wantNeedle: "发布规范", wantMatch: true, minimum: 100, maximum: 100},
		{name: "chinese tokenization and synonym", title: "运行手册", body: "发布流程需要双人复核", query: "上线流程", wantNeedle: "发布", wantMatch: true, minimum: 60, maximum: 120},
		{name: "english spelling correction", title: "Knowledge collaboration guide", query: "knowlege", wantNeedle: "knowledge", wantMatch: true, minimum: 490, maximum: 510},
		{name: "unrelated", title: "运行手册", body: "发布流程", query: "财务报销", wantMatch: false},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			score, needle, matched := searchPageScore(test.title, test.path, test.body, test.tags, test.query)
			if matched != test.wantMatch || test.wantMatch && (needle != test.wantNeedle || score < test.minimum || score > test.maximum) {
				t.Fatalf("relevance mismatch: score=%d needle=%q matched=%v", score, needle, matched)
			}
		})
	}
}

func timePointer(value time.Time) *time.Time { return &value }
