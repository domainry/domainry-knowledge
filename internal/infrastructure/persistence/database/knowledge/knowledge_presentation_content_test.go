package store

import (
	"encoding/json"
	"strings"
	"testing"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func presentationFixture(t *testing.T, mutate func(map[string]any)) string {
	t.Helper()
	var root map[string]any
	decoder := json.NewDecoder(strings.NewReader(emptyKnowledgePresentationContent))
	decoder.UseNumber()
	if err := decoder.Decode(&root); err != nil {
		t.Fatal(err)
	}
	if mutate != nil {
		mutate(root)
	}
	encoded, err := json.Marshal(root)
	if err != nil {
		t.Fatal(err)
	}
	return string(encoded)
}

func TestPresentationContentValidatesCanonicalSchemaAndSearchText(t *testing.T) {
	content := presentationFixture(t, func(root map[string]any) {
		master := root["master"].(map[string]any)
		master["footer"] = "产品委员会"
		slide := root["slides"].([]any)[0].(map[string]any)
		slide["title"] = "季度复盘"
		slide["notes"] = "强调留存率"
		elements := slide["elements"].([]any)
		elements[0].(map[string]any)["text"] = "增长 28%"
	})
	if err := validatePresentationContent(content); err != nil {
		t.Fatalf("valid presentation rejected: %v", err)
	}
	normalized, err := normalizedTypedPageContent(knowledgesdk.KnowledgePageTypePresentation, knowledgesdk.PageContentSchemaVersion, content, "")
	if err != nil {
		t.Fatal(err)
	}
	for _, expected := range []string{"季度复盘", "增长 28%", "强调留存率", "产品委员会"} {
		if !strings.Contains(normalized.PlainText, expected) {
			t.Fatalf("presentation search text omitted %q: %q", expected, normalized.PlainText)
		}
	}
	if strings.Contains(normalized.PlainText, "schema_version") {
		t.Fatalf("presentation search text exposed JSON keys: %q", normalized.PlainText)
	}
}

func TestPresentationContentAcceptsEveryLayoutAndShape(t *testing.T) {
	for _, layout := range []string{"title", "section", "agenda", "title_content", "two_column", "quote", "image_focus", "blank"} {
		content := presentationFixture(t, func(root map[string]any) {
			root["slides"].([]any)[0].(map[string]any)["layout"] = layout
		})
		if err := validatePresentationContent(content); err != nil {
			t.Fatalf("layout %q rejected: %v", layout, err)
		}
	}
	for _, shape := range []string{"rectangle", "rounded_rectangle", "ellipse", "triangle", "diamond", "hexagon", "star", "arrow_right", "callout", "line"} {
		content := presentationFixture(t, func(root map[string]any) {
			slide := root["slides"].([]any)[0].(map[string]any)
			slide["elements"] = []any{map[string]any{
				"id": "shape-1", "type": "shape", "x": 100, "y": 100, "width": 400, "height": 200, "rotation": 0,
				"shape": shape, "fill_color": "#176B52", "stroke_color": "#17221C", "stroke_width": 2,
				"text": "形状", "font_size": 28, "font_weight": "normal", "color": "#FFFFFF", "align": "center",
			}}
		})
		if err := validatePresentationContent(content); err != nil {
			t.Fatalf("shape %q rejected: %v", shape, err)
		}
	}
}

func TestPresentationContentRejectsUnboundedOrUntrustedStructures(t *testing.T) {
	cases := map[string]func(map[string]any){
		"legacy excalidraw snapshot": func(root map[string]any) {
			delete(root, "schema_version")
			slide := root["slides"].([]any)[0].(map[string]any)
			slide["appState"] = map[string]any{"viewBackgroundColor": "#fff"}
		},
		"unknown theme": func(root map[string]any) { root["theme"] = "attacker" },
		"out of bounds": func(root map[string]any) {
			slide := root["slides"].([]any)[0].(map[string]any)
			slide["elements"].([]any)[0].(map[string]any)["x"] = 1590
		},
		"duplicate element id": func(root map[string]any) {
			slide := root["slides"].([]any)[0].(map[string]any)
			elements := slide["elements"].([]any)
			slide["elements"] = append(elements, elements[0])
		},
		"executable key": func(root map[string]any) { root["script"] = "alert(1)" },
		"unreferenced asset": func(root map[string]any) {
			slide := root["slides"].([]any)[0].(map[string]any)
			slide["files"] = map[string]any{"asset-1": map[string]any{"id": "asset-1", "mime_type": "image/png", "document_ref": "knowledge-document:kdoc_0123456789abcdef0123456789abcdef", "filename": "图.png"}}
		},
		"unsafe asset mime": func(root map[string]any) {
			slide := root["slides"].([]any)[0].(map[string]any)
			slide["files"] = map[string]any{"asset-1": map[string]any{"id": "asset-1", "mime_type": "text/html", "document_ref": "knowledge-document:kdoc_0123456789abcdef0123456789abcdef", "filename": "攻击.html"}}
			slide["elements"] = []any{map[string]any{"id": "media-1", "type": "image", "x": 0, "y": 0, "width": 400, "height": 300, "rotation": 0, "asset_id": "asset-1", "fit": "contain"}}
		},
	}
	for name, mutate := range cases {
		t.Run(name, func(t *testing.T) {
			if err := validatePresentationContent(presentationFixture(t, mutate)); err == nil {
				t.Fatal("invalid presentation accepted")
			}
		})
	}
}
