package store

import (
	"encoding/json"
	"strings"
	"testing"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func TestKnowledgePageTemplateVersionsAndIndependentSubtreeInstance(t *testing.T) {
	store, authority, library, root := pageFixture(t)
	child, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "template-child-create", ParentPageID: root.Page.ID, Rank: "child-a", Title: "模板子页面", ContentType: knowledgesdk.KnowledgePageTypeDocument}, authority)
	if err != nil {
		t.Fatal(err)
	}
	childContent := `{"blocks":[{"id":"child-block","type":"paragraph","props":{},"content":[{"type":"text","text":"第一版子页面","styles":{}}],"children":[]}]}`
	child, err = store.SaveKnowledgePageDraft(t.Context(), library.ID, child.Page.ID, knowledgesdk.KnowledgePageDraftWrite{ClientID: "template-child-save-v1", ExpectedDraftRevision: child.Draft.DraftRevision, ExpectedPageRevision: child.Page.Revision, Title: child.Page.Title, ParentPageID: root.Page.ID, Rank: child.Page.Rank, ContentSchemaVersion: knowledgesdk.PageContentSchemaVersion, Content: childContent}, authority)
	if err != nil {
		t.Fatal(err)
	}
	rootContent := `{"blocks":[{"id":"root-block","type":"paragraph","props":{},"content":[{"type":"blockMention","props":{"pageId":"` + child.Page.ID + `","blockId":"child-block"}}],"children":[]},{"id":"page-card","type":"knowledgeReference","props":{"targetPageId":"` + child.Page.ID + `","title":"模板子页面","targetType":"document","display":"card"},"content":[],"children":[]}]}`
	root, err = store.SaveKnowledgePageDraft(t.Context(), library.ID, root.Page.ID, knowledgesdk.KnowledgePageDraftWrite{ClientID: "template-root-save-v1", ExpectedDraftRevision: root.Draft.DraftRevision, ExpectedPageRevision: root.Page.Revision, Title: "模板根页面", Rank: root.Page.Rank, ContentSchemaVersion: knowledgesdk.PageContentSchemaVersion, Content: rootContent}, authority)
	if err != nil {
		t.Fatal(err)
	}
	template, err := store.CreateKnowledgePageTemplate(t.Context(), library.ID, knowledgesdk.KnowledgePageTemplateCreate{ClientID: "template-create-1", SourcePageID: root.Page.ID, Title: "项目模板", Description: "根页面和子页面"}, authority)
	if err != nil {
		t.Fatal(err)
	}
	if template.LatestVersion != 1 || template.NodeCount != 2 || template.RootContentType != knowledgesdk.KnowledgePageTypeDocument {
		t.Fatalf("template did not freeze the subtree: %+v", template)
	}
	replayed, err := store.CreateKnowledgePageTemplate(t.Context(), library.ID, knowledgesdk.KnowledgePageTemplateCreate{ClientID: "template-create-1", SourcePageID: root.Page.ID, Title: "项目模板", Description: "根页面和子页面"}, authority)
	if err != nil || replayed.ID != template.ID {
		t.Fatalf("template create idempotency failed: replayed=%+v err=%v", replayed, err)
	}

	childV2, err := store.SaveKnowledgePageDraft(t.Context(), library.ID, child.Page.ID, knowledgesdk.KnowledgePageDraftWrite{ClientID: "template-child-save-v2", ExpectedDraftRevision: child.Draft.DraftRevision, ExpectedPageRevision: child.Page.Revision, Title: "模板子页面第二版", ParentPageID: root.Page.ID, Rank: child.Page.Rank, ContentSchemaVersion: knowledgesdk.PageContentSchemaVersion, Content: documentContentFixture("第二版子页面")}, authority)
	if err != nil {
		t.Fatal(err)
	}
	template, err = store.UpdateKnowledgePageTemplate(t.Context(), library.ID, template.ID, knowledgesdk.KnowledgePageTemplateUpdate{ClientID: "template-update-2", ExpectedRevision: template.Revision, SourcePageID: root.Page.ID, Title: "项目模板", Description: "第二版"}, authority)
	if err != nil {
		t.Fatal(err)
	}
	if template.LatestVersion != 2 || template.Revision != 2 {
		t.Fatalf("template update did not append a version: %+v", template)
	}
	version1, err := store.KnowledgePageTemplateVersion(t.Context(), library.ID, template.ID, 1, authority)
	if err != nil {
		t.Fatal(err)
	}
	version2, err := store.KnowledgePageTemplateVersion(t.Context(), library.ID, template.ID, 2, authority)
	if err != nil {
		t.Fatal(err)
	}
	if version1.Nodes[1].Title != "模板子页面" || version2.Nodes[1].Title != childV2.Page.Title || version1.Nodes[1].Body.Content == version2.Nodes[1].Body.Content {
		t.Fatalf("template versions are not immutable snapshots: v1=%+v v2=%+v", version1.Nodes[1], version2.Nodes[1])
	}

	instance, err := store.InstantiateKnowledgePageTemplate(t.Context(), library.ID, template.ID, knowledgesdk.KnowledgePageTemplateInstantiate{ClientID: "template-instantiate-v1", Version: 1, Rank: "instance-a", RootTitle: "项目 A"}, authority)
	if err != nil {
		t.Fatal(err)
	}
	if instance.Version != 1 || instance.Root.Page.Title != "项目 A" || len(instance.CreatedPageIDs) != 2 || instance.Root.Page.ID == root.Page.ID {
		t.Fatalf("invalid template instance: %+v", instance)
	}
	children, err := store.KnowledgePages(t.Context(), library.ID, instance.Root.Page.ID, "", 10, false, authority)
	if err != nil || len(children.Items) != 1 {
		t.Fatalf("template child hierarchy was not rebuilt: children=%+v err=%v", children, err)
	}
	instanceChild := children.Items[0]
	if instanceChild.ID == child.Page.ID || instanceChild.Title != "模板子页面" {
		t.Fatalf("template child is not an independent v1 copy: %+v", instanceChild)
	}
	rootView, err := store.KnowledgePage(t.Context(), library.ID, instance.Root.Page.ID, true, authority)
	if err != nil {
		t.Fatal(err)
	}
	var content map[string]any
	if err = json.Unmarshal([]byte(rootView.Draft.Body.Content), &content); err != nil {
		t.Fatal(err)
	}
	raw, _ := json.Marshal(content)
	text := string(raw)
	if strings.Contains(text, child.Page.ID) || strings.Contains(text, `"id":"root-block"`) || !strings.Contains(text, instanceChild.ID) {
		t.Fatalf("instance references or block IDs were not remapped: %s", text)
	}
	original, err := store.KnowledgePage(t.Context(), library.ID, root.Page.ID, true, authority)
	if err != nil || original.Draft.Body.Content != rootContent {
		t.Fatalf("instantiation mutated the source page: original=%+v err=%v", original.Draft, err)
	}
}
