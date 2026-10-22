package store

import (
	"strings"
	"testing"
)

func TestKnowledgeMindMapCanonicalContentValidation(t *testing.T) {
	content := `{"schema_version":1,"theme":"ocean","layout":"side","compact":true,"root":{"id":"root","text":"产品战略","expanded":true,"direction":"auto","style":{"color":"#ffffff","background_color":"#2563eb","font_weight":"bold"},"children":[{"id":"growth","text":"增长","expanded":true,"direction":"right","style":{"color":"#17324d","background_color":"#eaf2ff","font_weight":"normal"},"tags":["实验","转化"],"note":"验证增长假设","link":"https://example.com/growth","children":[]},{"id":"quality","text":"质量","expanded":true,"direction":"left","style":{"color":"#17324d","background_color":"#eaf2ff","font_weight":"normal"},"children":[]} ]},"relations":[{"id":"relation-1","from":"growth","to":"quality","label":"平衡","bidirectional":true,"color":"#64748b","width":2,"dashed":true}]}`
	plain, err := validateMindMapContent(content)
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(plain, "产品战略") || !strings.Contains(plain, "增长") || !strings.Contains(plain, "平衡") || !strings.Contains(plain, "增长假设") || !strings.Contains(plain, "实验") {
		t.Fatalf("mind map plain text missing nodes: %q", plain)
	}
	invalid := []string{
		`{"root":{"nodeData":{"id":"root","topic":"旧快照"}}}`,
		strings.Replace(content, `"to":"quality"`, `"to":"missing"`, 1),
		strings.Replace(content, `"id":"quality"`, `"id":"growth"`, 1),
		strings.Replace(content, `"layout":"side"`, `"layout":"radial"`, 1),
		strings.Replace(content, `"text":"增长"`, `"text":"坏\u0000内容"`, 1),
		strings.Replace(content, `"id":"growth"`, `"id":"坏 id"`, 1),
		strings.Replace(content, `"id":"relation-1"`, `"id":"growth"`, 1),
		strings.Replace(content, `"label":"平衡"`, `"label":"`+strings.Repeat("界", 342)+`"`, 1),
		strings.Replace(content, `"link":"https://example.com/growth"`, `"link":"javascript:alert(1)"`, 1),
		strings.Replace(content, `"schema_version":1`, `"schema_version":1,"unknown":true`, 1),
	}
	for _, candidate := range invalid {
		if _, err = validateMindMapContent(candidate); err == nil {
			t.Fatalf("accepted invalid mind map content: %s", candidate)
		}
	}
}

func TestKnowledgeFlowchartCanonicalContentValidation(t *testing.T) {
	content := `{"schema_version":1,"theme":"emerald","layout":"horizontal","grid":true,"nodes":[{"id":"start","type":"start","x":120,"y":160,"text":"开始","style":{"color":"#17332b","background_color":"#e8f5f0","font_weight":"normal"}},{"id":"review","type":"decision","x":420,"y":160,"text":"通过？","style":{"color":"#6b3f00","background_color":"#fff3cd","font_weight":"bold"}}],"edges":[{"id":"edge-1","source":"start","target":"review","label":"提交","type":"polyline","style":{"color":"#789087","width":2,"dashed":false}}]}`
	plain, err := validateFlowchartContent(content)
	if err != nil {
		t.Fatal(err)
	}
	if plain != "开始\n通过？\n提交" {
		t.Fatalf("unexpected flowchart plain text: %q", plain)
	}
	for nodeType := range flowchartNodeTypes {
		candidate := strings.Replace(content, `"type":"start"`, `"type":"`+nodeType+`"`, 1)
		if _, err = validateFlowchartContent(candidate); err != nil {
			t.Fatalf("rejected supported flowchart node type %q: %v", nodeType, err)
		}
	}
	invalid := []string{
		`{"nodes":[{"id":"start","type":"start","x":120,"y":160,"text":"旧快照"}],"edges":[]}`,
		strings.Replace(content, `"target":"review"`, `"target":"missing"`, 1),
		strings.Replace(content, `"type":"decision"`, `"type":"script"`, 1),
		strings.Replace(content, `"color":"#789087"`, `"color":"javascript:alert(1)"`, 1),
		strings.Replace(content, `"width":2`, `"width":99`, 1),
		strings.Replace(content, `"id":"edge-1"`, `"id":"坏 id"`, 1),
		strings.Replace(content, `"id":"edge-1"`, `"id":"start"`, 1),
		strings.Replace(content, `"label":"提交"`, `"label":"`+strings.Repeat("界", 342)+`"`, 1),
		strings.Replace(content, `"schema_version":1`, `"schema_version":1,"unknown":true`, 1),
	}
	for _, candidate := range invalid {
		if _, err = validateFlowchartContent(candidate); err == nil {
			t.Fatalf("accepted invalid flowchart content: %s", candidate)
		}
	}
}

func TestKnowledgeDiagramCommentAnchorsUseCanonicalElements(t *testing.T) {
	mind := `{"schema_version":1,"theme":"ocean","layout":"side","compact":true,"root":{"id":"root","text":"产品战略","expanded":true,"direction":"auto","style":{"color":"#ffffff","background_color":"#2563eb","font_weight":"bold"},"children":[{"id":"growth","text":"增长","expanded":true,"direction":"right","style":{"color":"#17324d","background_color":"#eaf2ff","font_weight":"normal"},"children":[]},{"id":"quality","text":"质量","expanded":true,"direction":"left","style":{"color":"#17324d","background_color":"#eaf2ff","font_weight":"normal"},"children":[]} ]},"relations":[{"id":"relation-1","from":"growth","to":"quality","label":"平衡","bidirectional":true,"color":"#64748b","width":2,"dashed":true}]}`
	anchor, err := knowledgeDiagramCommentAnchor(mind, "mind_map", "growth", "增长")
	if err != nil || anchor.NodeID != "growth" || anchor.BlockSHA256 == "" {
		t.Fatalf("mind map anchor not resolved: %+v %v", anchor, err)
	}
	if _, err = knowledgeDiagramCommentAnchor(mind, "mind_map", "missing", "增长"); err == nil || !strings.Contains(err.Error(), "anchor_not_found") {
		t.Fatalf("missing mind map node accepted: %v", err)
	}
	if _, err = knowledgeDiagramCommentAnchor(mind, "mind_map", "growth", "质量"); err == nil || !strings.Contains(err.Error(), "quote_invalid") {
		t.Fatalf("wrong mind map quote accepted: %v", err)
	}

	flow := `{"schema_version":1,"theme":"emerald","layout":"horizontal","grid":true,"nodes":[{"id":"start","type":"start","x":120,"y":160,"text":"开始","style":{"color":"#17332b","background_color":"#e8f5f0","font_weight":"normal"}},{"id":"review","type":"decision","x":420,"y":160,"text":"通过？","style":{"color":"#6b3f00","background_color":"#fff3cd","font_weight":"bold"}}],"edges":[{"id":"edge-1","source":"start","target":"review","label":"提交","type":"polyline","style":{"color":"#789087","width":2,"dashed":false}}]}`
	edgeAnchor, err := knowledgeDiagramCommentAnchor(flow, "flowchart", "edge-1", "提交")
	if err != nil || edgeAnchor.NodeID != "edge-1" || edgeAnchor.BlockSHA256 == "" {
		t.Fatalf("flowchart edge anchor not resolved: %+v %v", edgeAnchor, err)
	}
	hashes, err := diagramAnchorHashes(flow, "flowchart")
	if err != nil || hashes["start"] == "" || hashes["edge-1"] == "" {
		t.Fatalf("flowchart anchor hashes incomplete: %+v %v", hashes, err)
	}
}

func TestKnowledgeDiagramTextLimitsUseUTF8Bytes(t *testing.T) {
	content := strings.Replace(emptyKnowledgeFlowchartContent, `"text":"开始"`, `"text":"`+strings.Repeat("界", 1400)+`"`, 1)
	if _, err := validateFlowchartContent(content); err == nil {
		t.Fatal("accepted a diagram label larger than 4096 UTF-8 bytes")
	}
}
