package store

import (
	"database/sql"
	"fmt"
	"testing"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func TestKnowledgePageDescendantTraversalPagesOnlySelectedSubtree(t *testing.T) {
	store, authority, library, root := pageFixture(t)
	decoy, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{
		ClientID: "traversal-decoy", Title: "无关根", ContentType: knowledgesdk.KnowledgePageTypeDocument,
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	firstChildID := ""
	for index := 0; index < knowledgePageTraversalBatchSize+2; index++ {
		child, createErr := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{
			ClientID: fmt.Sprintf("traversal-child-%03d", index), ParentPageID: root.Page.ID,
			Title: fmt.Sprintf("子页面 %03d", index), ContentType: knowledgesdk.KnowledgePageTypeDocument,
		}, authority)
		if createErr != nil {
			t.Fatal(createErr)
		}
		if index == 0 {
			firstChildID = child.Page.ID
		}
	}
	grandchild, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{
		ClientID: "traversal-grandchild", ParentPageID: firstChildID,
		Title: "孙页面", ContentType: knowledgesdk.KnowledgePageTypeDocument,
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	if _, err = store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{
		ClientID: "traversal-decoy-child", ParentPageID: decoy.Page.ID,
		Title: "无关子页面", ContentType: knowledgesdk.KnowledgePageTypeDocument,
	}, authority); err != nil {
		t.Fatal(err)
	}

	visited := map[string]bool{}
	err = store.transaction(t.Context(), func(tx *sql.Tx) error {
		return store.visitKnowledgePageDescendants(t.Context(), tx, library.ID, root.Page.ID, knowledgePageDescendantQuery{
			parentColumn: "parent_page_id", activeOnly: true,
		}, authority, func(page knowledgesdk.KnowledgePage, _ string) error {
			visited[page.ID] = true
			return nil
		})
	})
	if err != nil {
		t.Fatal(err)
	}
	want := knowledgePageTraversalBatchSize + 3
	if len(visited) != want || !visited[firstChildID] || !visited[grandchild.Page.ID] || visited[decoy.Page.ID] {
		t.Fatalf("visited=%d want=%d first=%t grandchild=%t decoy=%t", len(visited), want, visited[firstChildID], visited[grandchild.Page.ID], visited[decoy.Page.ID])
	}
}
