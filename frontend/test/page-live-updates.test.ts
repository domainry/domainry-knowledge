import assert from "node:assert/strict";
import test from "node:test";
import { resolveKnowledgePageLiveRefresh } from "../src/pageLiveUpdates.ts";
import type { KnowledgePageView } from "../src/types.ts";

function view(id: string, revision: number, draft?: string, published?: string): KnowledgePageView {
  return {
    page: {
      id,
      library_id: "library-1",
      parent_page_id: "",
      published_parent_page_id: "",
      rank: "a",
      published_rank: "a",
      title: `Page ${id}`,
      content_type: "document",
      state: "active",
      revision,
      published_version: published ? 1 : 0,
      updated_at: "2026-10-30T00:00:00Z",
      created_at: "2026-10-30T00:00:00Z",
    },
    breadcrumbs: [],
    ...(draft ? {
      draft: {
        page_id: id,
        library_id: "library-1",
        base_published_version: published ? 1 : 0,
        draft_revision: revision,
        title: `Draft ${id}`,
        content_type: "document",
        parent_page_id: "",
        rank: "a",
        body: { content_schema_version: 2, content: draft, content_sha256: "a".repeat(64), plain_text: draft, summary: draft },
        updated_by_user_id: "user-1",
        updated_at: "2026-10-30T00:00:00Z",
      },
    } : {}),
    ...(published ? {
      published: {
        page_id: id,
        library_id: "library-1",
        version: 1,
        title: `Published ${id}`,
        content_type: "document",
        parent_page_id: "",
        rank: "a",
        body: { content_schema_version: 2, content: published, content_sha256: "b".repeat(64), plain_text: published, summary: published },
        published_by_user_id: "user-1",
        published_at: "2026-10-30T00:00:00Z",
      },
    } : {}),
  };
}

test("live refresh applies a newer draft to the open read page", () => {
  const result = resolveKnowledgePageLiveRefresh({
    selectedPageID: "page-1",
    mode: "read",
    dirty: false,
    current: view("page-1", 2, "before"),
    refreshed: view("page-1", 3, "after"),
  });
  assert.equal(result?.title, "Draft page-1");
  assert.equal(result?.body, "after");
  assert.equal(result?.view.page.revision, 3);
});

test("live refresh uses published content for readers without a visible draft", () => {
  const result = resolveKnowledgePageLiveRefresh({
    selectedPageID: "page-1",
    mode: "read",
    dirty: false,
    current: view("page-1", 2, undefined, "published before"),
    refreshed: view("page-1", 3, undefined, "published after"),
  });
  assert.equal(result?.title, "Published page-1");
  assert.equal(result?.body, "published after");
});

test("live refresh never overwrites an unsaved editor or another selected page", () => {
  assert.equal(resolveKnowledgePageLiveRefresh({
    selectedPageID: "page-1",
    mode: "edit",
    dirty: true,
    current: view("page-1", 2, "local edit"),
    refreshed: view("page-1", 3, "remote edit"),
  }), null);
  assert.equal(resolveKnowledgePageLiveRefresh({
    selectedPageID: "page-2",
    mode: "read",
    dirty: false,
    current: view("page-1", 2, "before"),
    refreshed: view("page-1", 3, "after"),
  }), null);
});
