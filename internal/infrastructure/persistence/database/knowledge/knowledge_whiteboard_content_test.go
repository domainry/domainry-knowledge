package store

import (
	"encoding/json"
	"strings"
	"testing"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func whiteboardElementFixture(id, elementType string) map[string]any {
	return map[string]any{
		"id": id, "type": elementType, "x": 10, "y": 20, "width": 220, "height": 120, "angle": 0,
		"stroke_color": "#1b1b1f", "background_color": "transparent", "fill_style": "solid",
		"stroke_width": 2, "stroke_style": "solid", "roughness": 1, "opacity": 100,
	}
}

func whiteboardFixture(t *testing.T, mutate func(map[string]any)) string {
	t.Helper()
	text := whiteboardElementFixture("text-1", "text")
	text["text"], text["original_text"], text["font_size"], text["font_family"] = "发布评审", "发布评审", 20, 5
	text["text_align"], text["vertical_align"], text["line_height"], text["auto_resize"] = "left", "top", 1.25, true
	frame := whiteboardElementFixture("frame-1", "frame")
	frame["name"] = "发布区域"
	root := map[string]any{
		"schema_version": 1,
		"elements":       []any{text, frame},
		"assets":         map[string]any{},
		"settings":       map[string]any{"background_color": "#ffffff", "grid_size": 20, "grid_enabled": false},
	}
	if mutate != nil {
		mutate(root)
	}
	raw, err := json.Marshal(root)
	if err != nil {
		t.Fatal(err)
	}
	return string(raw)
}

func TestWhiteboardCanonicalSchemaAndSearchProjection(t *testing.T) {
	content := whiteboardFixture(t, nil)
	normalized, err := normalizedTypedPageContent(knowledgesdk.KnowledgePageTypeWhiteboard, knowledgesdk.PageContentSchemaVersion, content, "")
	if err != nil {
		t.Fatal(err)
	}
	if normalized.PlainText != "发布评审 发布区域" {
		t.Fatalf("unexpected search projection: %q", normalized.PlainText)
	}
	if strings.Contains(normalized.PlainText, "stroke_color") || strings.Contains(normalized.PlainText, "data:image") {
		t.Fatalf("implementation metadata leaked into search: %q", normalized.PlainText)
	}
}

func TestWhiteboardRejectsEditorPrivateFieldsAndDanglingReferences(t *testing.T) {
	cases := map[string]string{
		"private seed": whiteboardFixture(t, func(root map[string]any) {
			root["elements"].([]any)[0].(map[string]any)["seed"] = 42
		}),
		"unknown root": whiteboardFixture(t, func(root map[string]any) { root["appState"] = map[string]any{} }),
		"dangling frame": whiteboardFixture(t, func(root map[string]any) {
			root["elements"].([]any)[0].(map[string]any)["frame_id"] = "missing-frame"
		}),
		"wrong type field": whiteboardFixture(t, func(root map[string]any) {
			root["elements"].([]any)[1].(map[string]any)["points"] = []any{[]any{0, 0}, []any{1, 1}}
		}),
	}
	for name, content := range cases {
		t.Run(name, func(t *testing.T) {
			if _, err := normalizedTypedPageContent(knowledgesdk.KnowledgePageTypeWhiteboard, knowledgesdk.PageContentSchemaVersion, content, ""); err == nil || !strings.Contains(err.Error(), "page_content_schema_invalid") {
				t.Fatalf("invalid whiteboard was accepted: %v", err)
			}
		})
	}
}

func TestWhiteboardImageAssetsAreSafeReferencedDataOnly(t *testing.T) {
	valid := whiteboardFixture(t, func(root map[string]any) {
		image := whiteboardElementFixture("image-1", "image")
		image["file_id"], image["scale"] = "asset-1", []any{1, 1}
		root["elements"] = append(root["elements"].([]any), image)
		root["assets"] = map[string]any{"asset-1": map[string]any{"id": "asset-1", "mime_type": "image/png", "data_url": "data:image/png;base64,AA==", "created_at": 1}}
	})
	if _, err := decodeKnowledgeWhiteboardContent(valid); err != nil {
		t.Fatalf("safe referenced image was rejected: %v", err)
	}
	unsafe := strings.Replace(valid, "data:image/png;base64,AA==", "data:text/html;base64,AA==", 1)
	if _, err := decodeKnowledgeWhiteboardContent(unsafe); err == nil {
		t.Fatal("unsafe image data URL was accepted")
	}
	unreferenced := whiteboardFixture(t, func(root map[string]any) {
		root["assets"] = map[string]any{"asset-1": map[string]any{"id": "asset-1", "mime_type": "image/png", "data_url": "data:image/png;base64,AA==", "created_at": 1}}
	})
	if _, err := decodeKnowledgeWhiteboardContent(unreferenced); err == nil {
		t.Fatal("unreferenced asset was accepted")
	}
}

func TestWhiteboardCommentAnchorUsesCanonicalElementHash(t *testing.T) {
	content := whiteboardFixture(t, nil)
	anchor, err := knowledgeWhiteboardCommentAnchor(content, "text-1", "发布")
	if err != nil || len(anchor.BlockSHA256) != 64 || anchor.Quote != "发布" {
		t.Fatalf("anchor=%+v err=%v", anchor, err)
	}
	if _, err = knowledgeWhiteboardCommentAnchor(content, "missing", "发布"); err == nil || !strings.Contains(err.Error(), "anchor_not_found") {
		t.Fatalf("missing element accepted: %v", err)
	}
	if _, err = knowledgeWhiteboardCommentAnchor(content, "text-1", "不存在"); err == nil || !strings.Contains(err.Error(), "quote_invalid") {
		t.Fatalf("unrelated quote accepted: %v", err)
	}
}

func TestWhiteboardCommentPersistsAndTracksPublishedElementChanges(t *testing.T) {
	store, authority, library, _ := pageFixture(t)
	page, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "whiteboard-comment-page", Title: "评审画板", ContentType: knowledgesdk.KnowledgePageTypeWhiteboard}, authority)
	if err != nil {
		t.Fatal(err)
	}
	page = savePageFixture(t, store, authority, library, page, "whiteboard-comment-v1", "评审画板", whiteboardFixture(t, nil))
	page = publishPageFixture(t, store, authority, library, page, "whiteboard-comment-publish-v1")
	comment, err := store.CreateKnowledgePageComment(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageCommentCreate{
		ClientID: "whiteboard-comment-create", PublishedVersion: 1,
		Anchor: knowledgesdk.KnowledgePageCommentAnchor{NodeID: "text-1", Quote: "发布评审"}, Body: "请确认这个节点",
	}, authority)
	if err != nil || comment.Anchor.Changed || len(comment.Anchor.BlockSHA256) != 64 {
		t.Fatalf("comment=%+v err=%v", comment, err)
	}
	comments, err := store.KnowledgePageComments(t.Context(), library.ID, page.Page.ID, "", 20, false, authority)
	if err != nil || len(comments.Items) != 1 || comments.Items[0].Anchor.Changed {
		t.Fatalf("fresh anchor was not resolved: comments=%+v err=%v", comments, err)
	}
	changed := whiteboardFixture(t, func(root map[string]any) {
		root["elements"].([]any)[0].(map[string]any)["text"] = "结论已修改"
		root["elements"].([]any)[0].(map[string]any)["original_text"] = "结论已修改"
	})
	page = savePageFixture(t, store, authority, library, page, "whiteboard-comment-v2", "评审画板", changed)
	page = publishPageFixture(t, store, authority, library, page, "whiteboard-comment-publish-v2")
	comments, err = store.KnowledgePageComments(t.Context(), library.ID, page.Page.ID, "", 20, false, authority)
	if err != nil || len(comments.Items) != 1 || !comments.Items[0].Anchor.Changed {
		t.Fatalf("changed element did not invalidate anchor: comments=%+v err=%v", comments, err)
	}
}
