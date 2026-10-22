package store

import (
	"strings"
	"testing"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func createDiscoveryPage(t *testing.T, store *Store, libraryID, clientID, parentID, title string, authority knowledgesdk.Authority) knowledgesdk.KnowledgePageView {
	t.Helper()
	page, err := store.CreateKnowledgePage(t.Context(), libraryID, knowledgesdk.KnowledgePageCreate{ClientID: clientID, ParentPageID: parentID, Title: title, ContentType: knowledgesdk.KnowledgePageTypeDocument}, authority)
	if err != nil {
		t.Fatal(err)
	}
	return page
}

func TestKnowledgePageIdentitySearchDisambiguatesSameTitlesAndAliasesByStableID(t *testing.T) {
	store, authority, library, _ := pageFixture(t)
	product := createDiscoveryPage(t, store, library.ID, "identity-parent-product", "", "产品", authority)
	support := createDiscoveryPage(t, store, library.ID, "identity-parent-support", "", "支持", authority)
	first := createDiscoveryPage(t, store, library.ID, "identity-child-product", product.Page.ID, "运行手册", authority)
	second := createDiscoveryPage(t, store, library.ID, "identity-child-support", support.Page.ID, "运行手册", authority)

	metadata, err := store.SetKnowledgePageMetadata(t.Context(), library.ID, first.Page.ID, knowledgesdk.KnowledgePageMetadataWrite{
		ClientID: "identity-alias", ExpectedRevision: 1, Aliases: []string{"值班指南"}, RelatedPageIDs: []string{second.Page.ID},
	}, authority)
	if err != nil || metadata.Revision != 2 || len(metadata.Aliases) != 1 || metadata.RelatedPageIDs[0] != second.Page.ID {
		t.Fatalf("aliases and related pages were not persisted: metadata=%+v err=%v", metadata, err)
	}

	results, err := store.SearchKnowledgePageIdentities(t.Context(), library.ID, "运行手册", 20, authority)
	if err != nil || len(results.Items) != 2 {
		t.Fatalf("same-title lookup mismatch: results=%+v err=%v", results, err)
	}
	paths := map[string]string{}
	for _, item := range results.Items {
		parts := make([]string, 0, len(item.Path))
		for _, breadcrumb := range item.Path {
			parts = append(parts, breadcrumb.Title)
		}
		paths[item.PageID] = strings.Join(parts, " / ")
	}
	if paths[first.Page.ID] != "产品 / 运行手册" || paths[second.Page.ID] != "支持 / 运行手册" {
		t.Fatalf("same titles were not disambiguated by live paths: %+v", paths)
	}
	byAlias, err := store.SearchKnowledgePageIdentities(t.Context(), library.ID, "值班", 20, authority)
	if err != nil || len(byAlias.Items) != 1 || byAlias.Items[0].PageID != first.Page.ID || byAlias.Items[0].Aliases[0] != "值班指南" {
		t.Fatalf("alias did not resolve to the stable page ID: %+v err=%v", byAlias, err)
	}

	renamed, err := store.SaveKnowledgePageDraft(t.Context(), library.ID, first.Page.ID, knowledgesdk.KnowledgePageDraftWrite{
		ClientID: "identity-rename", ExpectedDraftRevision: first.Draft.DraftRevision, ExpectedPageRevision: first.Page.Revision,
		Title: "线上运行手册", ParentPageID: first.Page.ParentPageID, Rank: first.Page.Rank, ContentSchemaVersion: knowledgesdk.PageContentSchemaVersion, Content: first.Draft.Body.Content,
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	byAlias, err = store.SearchKnowledgePageIdentities(t.Context(), library.ID, "值班指南", 20, authority)
	if err != nil || len(byAlias.Items) != 1 || byAlias.Items[0].PageID != first.Page.ID || byAlias.Items[0].Title != renamed.Page.Title {
		t.Fatalf("rename changed identity or left a stale title: %+v err=%v", byAlias, err)
	}
	moved, err := store.MoveKnowledgePage(t.Context(), library.ID, first.Page.ID, knowledgesdk.KnowledgePageMove{ClientID: "identity-move", ExpectedRevision: renamed.Page.Revision, ParentPageID: support.Page.ID, Rank: renamed.Page.Rank}, authority)
	if err != nil {
		t.Fatal(err)
	}
	byAlias, err = store.SearchKnowledgePageIdentities(t.Context(), library.ID, "值班指南", 20, authority)
	if err != nil || len(byAlias.Items) != 1 || byAlias.Items[0].PageID != moved.ID || knowledgePageIdentityPath(byAlias.Items[0]) != "支持 / 线上运行手册" {
		t.Fatalf("move changed identity or left a stale path: %+v err=%v", byAlias, err)
	}
}

func TestKnowledgePageRelationshipGraphCombinesHierarchyReferencesAndExplicitRelations(t *testing.T) {
	store, authority, library, source := pageFixture(t)
	parent := createDiscoveryPage(t, store, library.ID, "graph-parent", "", "产品", authority)
	center := createDiscoveryPage(t, store, library.ID, "graph-center", parent.Page.ID, "运行手册", authority)
	related := createDiscoveryPage(t, store, library.ID, "graph-related", "", "值班制度", authority)
	if _, err := store.SetKnowledgePageMetadata(t.Context(), library.ID, center.Page.ID, knowledgesdk.KnowledgePageMetadataWrite{ClientID: "graph-relation", ExpectedRevision: 1, RelatedPageIDs: []string{related.Page.ID}}, authority); err != nil {
		t.Fatal(err)
	}
	content := referenceDocumentContent("graph-reference", center.Page.ID, "旧标题", center.Page.ContentType, "card", "live", 0)
	if _, err := store.SaveKnowledgePageDraft(t.Context(), library.ID, source.Page.ID, knowledgesdk.KnowledgePageDraftWrite{
		ClientID: "graph-reference-save", ExpectedDraftRevision: source.Draft.DraftRevision, ExpectedPageRevision: source.Page.Revision,
		Title: source.Page.Title, Rank: source.Page.Rank, ContentSchemaVersion: knowledgesdk.PageContentSchemaVersion, Content: content,
	}, authority); err != nil {
		t.Fatal(err)
	}

	graph, err := store.KnowledgePageRelationshipGraph(t.Context(), library.ID, center.Page.ID, 1, 20, authority)
	if err != nil || graph.CenterPageID != center.Page.ID || graph.Truncated {
		t.Fatalf("relationship graph failed: graph=%+v err=%v", graph, err)
	}
	nodes := map[string]bool{}
	for _, node := range graph.Nodes {
		nodes[node.PageID] = true
		if node.PageID == center.Page.ID && !node.Center {
			t.Fatal("center node was not marked")
		}
	}
	for _, pageID := range []string{center.Page.ID, parent.Page.ID, related.Page.ID, source.Page.ID} {
		if !nodes[pageID] {
			t.Fatalf("graph is missing visible page %s: %+v", pageID, graph.Nodes)
		}
	}
	edges := map[string]bool{}
	for _, edge := range graph.Edges {
		edges[edge.Kind+":"+edge.SourcePageID+":"+edge.TargetPageID] = true
	}
	if !edges[knowledgesdk.KnowledgePageRelationshipHierarchy+":"+parent.Page.ID+":"+center.Page.ID] ||
		!edges[knowledgesdk.KnowledgePageRelationshipReference+":"+source.Page.ID+":"+center.Page.ID] {
		t.Fatalf("hierarchy or reference edge is missing: %+v", graph.Edges)
	}
	foundRelated := false
	for _, edge := range graph.Edges {
		if edge.Kind == knowledgesdk.KnowledgePageRelationshipRelated && !edge.Directed && (edge.SourcePageID == center.Page.ID && edge.TargetPageID == related.Page.ID || edge.SourcePageID == related.Page.ID && edge.TargetPageID == center.Page.ID) {
			foundRelated = true
		}
	}
	if !foundRelated {
		t.Fatalf("explicit related-page edge is missing: %+v", graph.Edges)
	}
}

func TestKnowledgePageRelationshipGraphTracksStableRelationLifecycle(t *testing.T) {
	store, manager, library, center := pageFixture(t)
	parent := createDiscoveryPage(t, store, library.ID, "lifecycle-parent", "", "支持", manager)
	target := createDiscoveryPage(t, store, library.ID, "lifecycle-target", "", "运行手册", manager)
	if _, err := store.SetKnowledgePageMetadata(t.Context(), library.ID, center.Page.ID, knowledgesdk.KnowledgePageMetadataWrite{ClientID: "lifecycle-relation", ExpectedRevision: 1, RelatedPageIDs: []string{target.Page.ID}}, manager); err != nil {
		t.Fatal(err)
	}
	renamed, err := store.SaveKnowledgePageDraft(t.Context(), library.ID, target.Page.ID, knowledgesdk.KnowledgePageDraftWrite{
		ClientID: "lifecycle-rename", ExpectedDraftRevision: target.Draft.DraftRevision, ExpectedPageRevision: target.Page.Revision,
		Title: "线上运行手册", Rank: target.Page.Rank, ContentSchemaVersion: knowledgesdk.PageContentSchemaVersion, Content: target.Draft.Body.Content,
	}, manager)
	if err != nil {
		t.Fatal(err)
	}
	moved, err := store.MoveKnowledgePage(t.Context(), library.ID, target.Page.ID, knowledgesdk.KnowledgePageMove{ClientID: "lifecycle-move", ExpectedRevision: renamed.Page.Revision, ParentPageID: parent.Page.ID, Rank: renamed.Page.Rank}, manager)
	if err != nil {
		t.Fatal(err)
	}
	graph, err := store.KnowledgePageRelationshipGraph(t.Context(), library.ID, center.Page.ID, 1, 20, manager)
	if err != nil {
		t.Fatal(err)
	}
	resolved := false
	for _, node := range graph.Nodes {
		if node.PageID == target.Page.ID {
			resolved = node.Title == "线上运行手册" && knowledgePageIdentityPath(node.KnowledgePageIdentity) == "支持 / 线上运行手册"
		}
	}
	if !resolved {
		t.Fatalf("renamed or moved relation did not resolve from its stable page ID: %+v", graph.Nodes)
	}

	archived, err := store.SetKnowledgePageArchived(t.Context(), library.ID, target.Page.ID, true, knowledgesdk.KnowledgePageStateWrite{ClientID: "lifecycle-archive", ExpectedRevision: moved.Revision}, manager)
	if err != nil {
		t.Fatal(err)
	}
	graph, err = store.KnowledgePageRelationshipGraph(t.Context(), library.ID, center.Page.ID, 1, 20, manager)
	if err != nil {
		t.Fatal(err)
	}
	for _, node := range graph.Nodes {
		if node.PageID == target.Page.ID {
			t.Fatalf("archived target remained visible in the relationship graph: %+v", graph.Nodes)
		}
	}
	metadata, err := store.KnowledgePageMetadata(t.Context(), library.ID, center.Page.ID, manager)
	if err != nil || len(metadata.RelatedPageIDs) != 1 || metadata.RelatedPageIDs[0] != target.Page.ID {
		t.Fatalf("archive rewrote the stable relation instead of changing its visibility: metadata=%+v err=%v", metadata, err)
	}
	if _, err = store.SetKnowledgePageArchived(t.Context(), library.ID, target.Page.ID, false, knowledgesdk.KnowledgePageStateWrite{ClientID: "lifecycle-restore", ExpectedRevision: archived.Revision}, manager); err != nil {
		t.Fatal(err)
	}
	graph, err = store.KnowledgePageRelationshipGraph(t.Context(), library.ID, center.Page.ID, 1, 20, manager)
	if err != nil {
		t.Fatal(err)
	}
	restored := false
	for _, node := range graph.Nodes {
		if node.PageID == target.Page.ID {
			restored = node.Title == "线上运行手册"
		}
	}
	if !restored {
		t.Fatalf("restored target did not reappear through the original stable relation: %+v", graph.Nodes)
	}
}

func TestKnowledgePageRelationshipGraphRechecksTargetACL(t *testing.T) {
	store, manager, library, center := pageFixture(t)
	target := createDiscoveryPage(t, store, library.ID, "acl-relation-target", "", "受控页面", manager)
	if _, err := store.SetKnowledgePageMetadata(t.Context(), library.ID, center.Page.ID, knowledgesdk.KnowledgePageMetadataWrite{ClientID: "acl-relation", ExpectedRevision: 1, RelatedPageIDs: []string{target.Page.ID}}, manager); err != nil {
		t.Fatal(err)
	}
	center = publishPageFixture(t, store, manager, library, center, "acl-center-publish")
	target = publishPageFixture(t, store, manager, library, target, "acl-target-publish")
	library = addPageMember(t, store, library, "bob", "reader", manager)
	bob := manager
	bob.UserID = "bob"
	graph, err := store.KnowledgePageRelationshipGraph(t.Context(), library.ID, center.Page.ID, 1, 20, bob)
	if err != nil {
		t.Fatal(err)
	}
	visible := false
	for _, node := range graph.Nodes {
		visible = visible || node.PageID == target.Page.ID
	}
	if !visible {
		t.Fatalf("authorized relation target was omitted: %+v", graph.Nodes)
	}
	setPageAccessFixture(t, store, library.ID, target.Page.ID, "acl-relation-revoke", 1, knowledgesdk.KnowledgePageAccessRestricted, nil, manager)
	graph, err = store.KnowledgePageRelationshipGraph(t.Context(), library.ID, center.Page.ID, 1, 20, bob)
	if err != nil {
		t.Fatal(err)
	}
	for _, node := range graph.Nodes {
		if node.PageID == target.Page.ID {
			t.Fatalf("revoked relation target leaked through the graph: %+v", graph.Nodes)
		}
	}
	for _, edge := range graph.Edges {
		if edge.SourcePageID == target.Page.ID || edge.TargetPageID == target.Page.ID {
			t.Fatalf("revoked relation edge leaked through the graph: %+v", graph.Edges)
		}
	}
}
