package store

import (
	"strings"
	"testing"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func TestKnowledgeAgentReferencePinsPublishedVersionBlockAndHash(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	page = savePageFixture(t, store, authority, library, page, "agent-draft", "运行手册", "# 发布检查\n确认权限与索引")
	page = publishPageFixture(t, store, authority, library, page, "agent-publish")
	block, digest, found, err := knowledgeAgentDocumentBlock(page.Published.Body.Content, "block-1")
	if err != nil || !found || !strings.Contains(knowledgeAgentDocumentBlockText(block), "发布检查") {
		t.Fatalf("published block unavailable: found=%t digest=%q err=%v", found, digest, err)
	}
	reference := knowledgesdk.KnowledgeAgentReference{LibraryID: library.ID, PageID: page.Page.ID, Version: page.Published.Version, BlockID: "block-1", ContentSHA256: digest}
	resolved, err := store.ResolveKnowledgeAgentReference(t.Context(), reference, authority)
	if err != nil || resolved.Reference != reference || resolved.Title != "运行手册" || !strings.Contains(resolved.Text, "发布检查") {
		t.Fatalf("unexpected resolved reference: %+v err=%v", resolved, err)
	}
	reference.ContentSHA256 = strings.Repeat("0", 64)
	if _, err = store.ResolveKnowledgeAgentReference(t.Context(), reference, authority); err == nil || !strings.Contains(err.Error(), "agent_reference_hash_mismatch") {
		t.Fatalf("stale or fabricated hash was accepted: %v", err)
	}
	pageReference := knowledgesdk.KnowledgeAgentReference{LibraryID: library.ID, PageID: page.Page.ID, Version: page.Published.Version, ContentSHA256: page.Published.Body.ContentSHA256}
	resolved, err = store.ResolveKnowledgeAgentReference(t.Context(), pageReference, authority)
	if err != nil || !strings.Contains(resolved.Text, "确认权限与索引") {
		t.Fatalf("whole-page reference failed: %+v err=%v", resolved, err)
	}
}
