package store

import (
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"io"
	"math"
	"net/url"
	"strings"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

const emptyKnowledgeWhiteboardContent = `{"schema_version":1,"elements":[],"assets":{},"settings":{"background_color":"#ffffff","grid_size":20,"grid_enabled":false}}`

var whiteboardRootKeys = map[string]bool{"schema_version": true, "elements": true, "assets": true, "settings": true}
var whiteboardSettingsKeys = map[string]bool{"background_color": true, "grid_size": true, "grid_enabled": true}
var whiteboardElementKeys = map[string]bool{
	"id": true, "type": true, "x": true, "y": true, "width": true, "height": true, "angle": true,
	"stroke_color": true, "background_color": true, "fill_style": true, "stroke_width": true, "stroke_style": true, "roughness": true, "opacity": true,
	"group_ids": true, "frame_id": true, "roundness": true, "bound_elements": true, "link": true, "locked": true, "custom_kind": true,
	"text": true, "original_text": true, "font_size": true, "font_family": true, "text_align": true, "vertical_align": true, "container_id": true, "line_height": true, "auto_resize": true,
	"points": true, "pressures": true, "simulate_pressure": true, "start_binding": true, "end_binding": true, "start_arrowhead": true, "end_arrowhead": true, "elbowed": true,
	"file_id": true, "scale": true, "crop": true, "name": true,
}
var whiteboardBindingKeys = map[string]bool{"element_id": true, "focus": true, "gap": true, "fixed_point": true}
var whiteboardCropKeys = map[string]bool{"x": true, "y": true, "width": true, "height": true, "natural_width": true, "natural_height": true}
var whiteboardAssetKeys = map[string]bool{"id": true, "mime_type": true, "data_url": true, "created_at": true}
var whiteboardElementTypes = map[string]bool{"rectangle": true, "diamond": true, "ellipse": true, "line": true, "arrow": true, "freedraw": true, "text": true, "image": true, "frame": true}
var whiteboardFillStyles = map[string]bool{"hachure": true, "cross-hatch": true, "solid": true, "zigzag": true}
var whiteboardStrokeStyles = map[string]bool{"solid": true, "dashed": true, "dotted": true}
var whiteboardColors = map[string]bool{"transparent": true}
var whiteboardMIMETypes = map[string]bool{"image/png": true, "image/jpeg": true, "image/gif": true, "image/webp": true}
var whiteboardArrowheads = map[string]bool{"": true, "arrow": true, "bar": true, "dot": true, "triangle": true}

func whiteboardExactKeys(value map[string]any, allowed map[string]bool) bool {
	for key := range value {
		if !allowed[key] {
			return false
		}
	}
	return true
}

func whiteboardNumber(value any, minimum, maximum float64) (float64, bool) {
	number, ok := value.(json.Number)
	if !ok {
		return 0, false
	}
	parsed, err := number.Float64()
	return parsed, err == nil && !math.IsNaN(parsed) && !math.IsInf(parsed, 0) && parsed >= minimum && parsed <= maximum
}

func whiteboardInteger(value any, minimum, maximum int64) (int64, bool) {
	number, ok := value.(json.Number)
	if !ok {
		return 0, false
	}
	parsed, err := number.Int64()
	return parsed, err == nil && parsed >= minimum && parsed <= maximum
}

func whiteboardColor(value any) bool {
	text, ok := value.(string)
	if !ok || len(text) > 16 {
		return false
	}
	if whiteboardColors[text] {
		return true
	}
	if len(text) != 7 && len(text) != 9 || text[0] != '#' {
		return false
	}
	for _, character := range text[1:] {
		if character < '0' || character > '9' && character < 'A' || character > 'F' && character < 'a' || character > 'f' {
			return false
		}
	}
	return true
}

func whiteboardPoint(value any, minimum, maximum float64) bool {
	items, ok := value.([]any)
	if !ok || len(items) != 2 {
		return false
	}
	_, left := whiteboardNumber(items[0], minimum, maximum)
	_, right := whiteboardNumber(items[1], minimum, maximum)
	return left && right
}

func whiteboardOptionalText(value map[string]any, key string, maximum int) bool {
	raw, found := value[key]
	if !found {
		return true
	}
	text, ok := raw.(string)
	return ok && executionText(text, maximum, true)
}

func validateWhiteboardBinding(value any) (string, bool) {
	binding, ok := value.(map[string]any)
	if !ok || len(binding) < 3 || len(binding) > 4 || !whiteboardExactKeys(binding, whiteboardBindingKeys) {
		return "", false
	}
	elementID, idOK := binding["element_id"].(string)
	_, focusOK := whiteboardNumber(binding["focus"], -1, 1)
	_, gapOK := whiteboardNumber(binding["gap"], 0, 100000)
	if !idOK || !validNativeOperationEntityID(elementID) || !focusOK || !gapOK {
		return "", false
	}
	if fixed, found := binding["fixed_point"]; found && !whiteboardPoint(fixed, 0, 1) {
		return "", false
	}
	return elementID, true
}

func validateWhiteboardElement(value map[string]any) (knowledgesdk.KnowledgeWhiteboardElement, []string, bool) {
	var decoded knowledgesdk.KnowledgeWhiteboardElement
	if len(value) < 14 || !whiteboardExactKeys(value, whiteboardElementKeys) {
		return decoded, nil, false
	}
	id, idOK := value["id"].(string)
	elementType, typeOK := value["type"].(string)
	fillStyle, fillOK := value["fill_style"].(string)
	strokeStyle, strokeOK := value["stroke_style"].(string)
	_, xOK := whiteboardNumber(value["x"], -10000000, 10000000)
	_, yOK := whiteboardNumber(value["y"], -10000000, 10000000)
	_, widthOK := whiteboardNumber(value["width"], 0, 10000000)
	_, heightOK := whiteboardNumber(value["height"], 0, 10000000)
	_, angleOK := whiteboardNumber(value["angle"], -100000, 100000)
	_, strokeWidthOK := whiteboardNumber(value["stroke_width"], 0.5, 32)
	_, roughnessOK := whiteboardNumber(value["roughness"], 0, 3)
	_, opacityOK := whiteboardNumber(value["opacity"], 0, 100)
	if !idOK || !validNativeOperationEntityID(id) || !typeOK || !whiteboardElementTypes[elementType] || !fillOK || !whiteboardFillStyles[fillStyle] || !strokeOK || !whiteboardStrokeStyles[strokeStyle] || !xOK || !yOK || !widthOK || !heightOK || !angleOK || !strokeWidthOK || !roughnessOK || !opacityOK || !whiteboardColor(value["stroke_color"]) || !whiteboardColor(value["background_color"]) {
		return decoded, nil, false
	}
	for _, key := range []string{"link", "text", "original_text", "name"} {
		if !whiteboardOptionalText(value, key, map[string]int{"link": 2048, "text": 32768, "original_text": 32768, "name": 512}[key]) {
			return decoded, nil, false
		}
	}
	if rawLink, found := value["link"]; found && rawLink.(string) != "" {
		parsed, err := url.Parse(rawLink.(string))
		if err != nil || parsed.Scheme != "https" && parsed.Scheme != "http" && parsed.Scheme != "knowledge-page" {
			return decoded, nil, false
		}
	}
	for _, key := range []string{"locked", "auto_resize", "simulate_pressure", "elbowed"} {
		if raw, found := value[key]; found {
			if _, ok := raw.(bool); !ok {
				return decoded, nil, false
			}
		}
	}
	if raw, found := value["custom_kind"]; found {
		kind, ok := raw.(string)
		if !ok || kind != "sticky_note" && kind != "template_heading" || kind == "sticky_note" && elementType != "rectangle" || kind == "template_heading" && elementType != "text" {
			return decoded, nil, false
		}
	}
	if raw, found := value["roundness"]; found {
		if _, ok := whiteboardInteger(raw, 1, 3); !ok {
			return decoded, nil, false
		}
	}
	for _, key := range []string{"frame_id", "container_id", "file_id"} {
		if raw, found := value[key]; found {
			text, ok := raw.(string)
			if !ok || !validNativeOperationEntityID(text) {
				return decoded, nil, false
			}
		}
	}
	if raw, found := value["group_ids"]; found {
		items, ok := raw.([]any)
		seen := map[string]bool{}
		if !ok || len(items) > 32 {
			return decoded, nil, false
		}
		for _, item := range items {
			groupID, valid := item.(string)
			if !valid || !validNativeOperationEntityID(groupID) || seen[groupID] {
				return decoded, nil, false
			}
			seen[groupID] = true
		}
	}
	references := make([]string, 0, 8)
	if raw, found := value["bound_elements"]; found {
		items, ok := raw.([]any)
		if !ok || len(items) > 64 {
			return decoded, nil, false
		}
		seen := map[string]bool{}
		for _, item := range items {
			bound, valid := item.(map[string]any)
			if !valid || len(bound) != 2 || !whiteboardExactKeys(bound, map[string]bool{"id": true, "type": true}) {
				return decoded, nil, false
			}
			boundID, boundIDOK := bound["id"].(string)
			boundType, boundTypeOK := bound["type"].(string)
			if !boundIDOK || !validNativeOperationEntityID(boundID) || seen[boundID] || !boundTypeOK || boundType != "text" && boundType != "arrow" {
				return decoded, nil, false
			}
			seen[boundID] = true
			references = append(references, boundID)
		}
	}
	if elementType == "text" {
		if _, ok := value["text"].(string); !ok {
			return decoded, nil, false
		}
		if _, ok := whiteboardNumber(value["font_size"], 1, 512); !ok {
			return decoded, nil, false
		}
		if _, ok := whiteboardNumber(value["font_family"], 1, 100); !ok {
			return decoded, nil, false
		}
		if align, ok := value["text_align"].(string); !ok || align != "left" && align != "center" && align != "right" {
			return decoded, nil, false
		}
		if align, ok := value["vertical_align"].(string); !ok || align != "top" && align != "middle" && align != "bottom" {
			return decoded, nil, false
		}
		if _, ok := whiteboardNumber(value["line_height"], 0.5, 10); !ok {
			return decoded, nil, false
		}
	} else {
		for _, key := range []string{"text", "original_text", "font_size", "font_family", "text_align", "vertical_align", "container_id", "line_height", "auto_resize"} {
			if _, found := value[key]; found {
				return decoded, nil, false
			}
		}
	}
	lineLike := elementType == "line" || elementType == "arrow" || elementType == "freedraw"
	if lineLike {
		points, ok := value["points"].([]any)
		if !ok || len(points) < 2 || len(points) > 10000 {
			return decoded, nil, false
		}
		for _, point := range points {
			if !whiteboardPoint(point, -10000000, 10000000) {
				return decoded, nil, false
			}
		}
	} else if _, found := value["points"]; found {
		return decoded, nil, false
	}
	if elementType == "line" || elementType == "arrow" {
		for _, key := range []string{"start_binding", "end_binding"} {
			if raw, found := value[key]; found {
				bindingID, valid := validateWhiteboardBinding(raw)
				if !valid {
					return decoded, nil, false
				}
				references = append(references, bindingID)
			}
		}
		for _, key := range []string{"start_arrowhead", "end_arrowhead"} {
			if raw, found := value[key]; found {
				arrowhead, ok := raw.(string)
				if !ok || !whiteboardArrowheads[arrowhead] {
					return decoded, nil, false
				}
			}
		}
	} else {
		for _, key := range []string{"start_binding", "end_binding", "start_arrowhead", "end_arrowhead", "elbowed"} {
			if _, found := value[key]; found {
				return decoded, nil, false
			}
		}
	}
	if elementType == "freedraw" {
		if raw, found := value["pressures"]; found {
			pressures, ok := raw.([]any)
			if !ok || len(pressures) > 10000 {
				return decoded, nil, false
			}
			for _, pressure := range pressures {
				if _, valid := whiteboardNumber(pressure, 0, 1); !valid {
					return decoded, nil, false
				}
			}
		}
	} else {
		for _, key := range []string{"pressures", "simulate_pressure"} {
			if _, found := value[key]; found {
				return decoded, nil, false
			}
		}
	}
	if elementType == "image" {
		if fileID, ok := value["file_id"].(string); !ok || !validNativeOperationEntityID(fileID) || !whiteboardPoint(value["scale"], -100, 100) {
			return decoded, nil, false
		}
		if raw, found := value["crop"]; found {
			crop, ok := raw.(map[string]any)
			if !ok || len(crop) != 6 || !whiteboardExactKeys(crop, whiteboardCropKeys) {
				return decoded, nil, false
			}
			for _, key := range []string{"x", "y", "width", "height", "natural_width", "natural_height"} {
				minimum := float64(0)
				if key == "width" || key == "height" || key == "natural_width" || key == "natural_height" {
					minimum = 0.0001
				}
				if _, valid := whiteboardNumber(crop[key], minimum, 10000000); !valid {
					return decoded, nil, false
				}
			}
		}
	} else {
		for _, key := range []string{"file_id", "scale", "crop"} {
			if _, found := value[key]; found {
				return decoded, nil, false
			}
		}
	}
	if elementType != "frame" {
		if _, found := value["name"]; found {
			return decoded, nil, false
		}
	} else if rawName, found := value["name"]; found {
		if name, ok := rawName.(string); !ok || !executionText(name, 512, true) {
			return decoded, nil, false
		}
	}
	raw, err := json.Marshal(value)
	if err != nil || json.Unmarshal(raw, &decoded) != nil {
		return decoded, nil, false
	}
	return decoded, references, true
}

func decodeKnowledgeWhiteboardContent(content string) (knowledgesdk.KnowledgeWhiteboardContent, error) {
	var decoded knowledgesdk.KnowledgeWhiteboardContent
	var root map[string]any
	decoder := json.NewDecoder(strings.NewReader(content))
	decoder.UseNumber()
	if err := decoder.Decode(&root); err != nil || root == nil || len(root) != 4 || !whiteboardExactKeys(root, whiteboardRootKeys) {
		return decoded, conversationError("bad_request", "page_content_schema_invalid")
	}
	if err := decoder.Decode(&struct{}{}); err != io.EOF {
		return decoded, conversationError("bad_request", "page_content_schema_invalid")
	}
	version, versionOK := whiteboardInteger(root["schema_version"], 1, 1)
	elements, elementsOK := root["elements"].([]any)
	assets, assetsOK := root["assets"].(map[string]any)
	settings, settingsOK := root["settings"].(map[string]any)
	if !versionOK || version != 1 || !elementsOK || len(elements) > 5000 || !assetsOK || len(assets) > 128 || !settingsOK || len(settings) != 3 || !whiteboardExactKeys(settings, whiteboardSettingsKeys) || !whiteboardColor(settings["background_color"]) {
		return decoded, conversationError("bad_request", "page_content_schema_invalid")
	}
	if _, ok := whiteboardInteger(settings["grid_size"], 1, 100); !ok {
		return decoded, conversationError("bad_request", "page_content_schema_invalid")
	}
	if _, ok := settings["grid_enabled"].(bool); !ok {
		return decoded, conversationError("bad_request", "page_content_schema_invalid")
	}
	decoded.SchemaVersion = 1
	decoded.Elements = make([]knowledgesdk.KnowledgeWhiteboardElement, 0, len(elements))
	decoded.Assets = make(map[string]knowledgesdk.KnowledgeWhiteboardAsset, len(assets))
	elementTypes := make(map[string]string, len(elements))
	references := make(map[string][]string, len(elements))
	imageAssets := map[string]bool{}
	for _, rawElement := range elements {
		elementMap, ok := rawElement.(map[string]any)
		if !ok {
			return decoded, conversationError("bad_request", "page_content_schema_invalid")
		}
		element, refs, valid := validateWhiteboardElement(elementMap)
		if !valid || elementTypes[element.ID] != "" {
			return decoded, conversationError("bad_request", "page_content_schema_invalid")
		}
		elementTypes[element.ID] = element.Type
		references[element.ID] = refs
		if element.FrameID != "" {
			references[element.ID] = append(references[element.ID], element.FrameID)
		}
		if element.ContainerID != "" {
			references[element.ID] = append(references[element.ID], element.ContainerID)
		}
		if element.FileID != "" {
			imageAssets[element.FileID] = true
		}
		decoded.Elements = append(decoded.Elements, element)
	}
	for elementID, refs := range references {
		for _, reference := range refs {
			if reference == elementID || elementTypes[reference] == "" {
				return decoded, conversationError("bad_request", "page_content_schema_invalid")
			}
		}
	}
	for _, element := range decoded.Elements {
		if element.FrameID != "" && elementTypes[element.FrameID] != "frame" || element.ContainerID != "" && elementTypes[element.ContainerID] != "rectangle" && elementTypes[element.ContainerID] != "diamond" && elementTypes[element.ContainerID] != "ellipse" {
			return decoded, conversationError("bad_request", "page_content_schema_invalid")
		}
		for _, bound := range element.BoundElements {
			if elementTypes[bound.ID] != bound.Type {
				return decoded, conversationError("bad_request", "page_content_schema_invalid")
			}
		}
	}
	totalAssetBytes := 0
	for assetID, rawAsset := range assets {
		assetMap, ok := rawAsset.(map[string]any)
		if !ok || len(assetMap) != 4 || !whiteboardExactKeys(assetMap, whiteboardAssetKeys) || !validNativeOperationEntityID(assetID) || !imageAssets[assetID] {
			return decoded, conversationError("bad_request", "page_content_schema_invalid")
		}
		id, idOK := assetMap["id"].(string)
		mimeType, mimeOK := assetMap["mime_type"].(string)
		dataURL, dataOK := assetMap["data_url"].(string)
		createdAt, createdOK := whiteboardInteger(assetMap["created_at"], 0, math.MaxInt64)
		prefix := "data:" + mimeType + ";base64,"
		if !idOK || id != assetID || !mimeOK || !whiteboardMIMETypes[mimeType] || !dataOK || !strings.HasPrefix(dataURL, prefix) || !createdOK {
			return decoded, conversationError("bad_request", "page_content_schema_invalid")
		}
		binary, err := base64.StdEncoding.DecodeString(strings.TrimPrefix(dataURL, prefix))
		if err != nil || len(binary) == 0 || len(binary) > 2<<20 {
			return decoded, conversationError("bad_request", "page_content_schema_invalid")
		}
		totalAssetBytes += len(binary)
		if totalAssetBytes > 8<<20 {
			return decoded, conversationError("bad_request", "page_content_schema_invalid")
		}
		decoded.Assets[assetID] = knowledgesdk.KnowledgeWhiteboardAsset{ID: id, MIMEType: mimeType, DataURL: dataURL, CreatedAt: createdAt}
	}
	for assetID := range imageAssets {
		if _, found := decoded.Assets[assetID]; !found {
			return decoded, conversationError("bad_request", "page_content_schema_invalid")
		}
	}
	rawSettings, _ := json.Marshal(settings)
	if json.Unmarshal(rawSettings, &decoded.Settings) != nil {
		return decoded, conversationError("bad_request", "page_content_schema_invalid")
	}
	return decoded, nil
}

func whiteboardPlainText(value knowledgesdk.KnowledgeWhiteboardContent) string {
	words := make([]string, 0, len(value.Elements))
	for _, element := range value.Elements {
		if text := strings.TrimSpace(element.Text); text != "" {
			words = append(words, text)
		}
		if name := strings.TrimSpace(element.Name); name != "" {
			words = append(words, name)
		}
	}
	return strings.TrimSpace(strings.Join(strings.Fields(strings.Join(words, " ")), " "))
}

func whiteboardPageTypeDefinition() knowledgePageTypeDefinition {
	return knowledgePageTypeDefinition{
		ID:           knowledgesdk.KnowledgePageTypeWhiteboard,
		EmptyContent: func() string { return emptyKnowledgeWhiteboardContent },
		Normalize: func(schema int, content, suppliedHash string) (knowledgesdk.PageContent, error) {
			value, err := decodeKnowledgeWhiteboardContent(content)
			if err != nil {
				return knowledgesdk.PageContent{}, err
			}
			normalized, err := normalizedStructuredPageContent("elements", "array", schema, content, suppliedHash)
			if err != nil {
				return knowledgesdk.PageContent{}, err
			}
			normalized.PlainText = whiteboardPlainText(value)
			normalized.Summary = pageContentSummary(normalized.PlainText)
			return normalized, nil
		},
		ExtractPlainText: normalizedPagePlainText,
		ExtractSummary:   pageContentSummary,
		ScanReferences:   scanJSONPageReferences,
		ValidateBeforePublish: func(content string) error {
			if _, err := decodeKnowledgeWhiteboardContent(content); err != nil {
				return err
			}
			return validateTrustedPageContent(content)
		},
	}
}

func whiteboardElementQuote(element knowledgesdk.KnowledgeWhiteboardElement) string {
	if text := strings.TrimSpace(element.Text); text != "" {
		return text
	}
	if name := strings.TrimSpace(element.Name); name != "" {
		return name
	}
	if element.CustomKind == "sticky_note" {
		return "便签"
	}
	return map[string]string{"rectangle": "矩形", "diamond": "菱形", "ellipse": "椭圆", "line": "线条", "arrow": "连接线", "freedraw": "自由绘制", "image": "图片", "frame": "画板区域", "text": "文本"}[element.Type]
}

func whiteboardAnchorHashes(content string) (map[string]string, error) {
	value, err := decodeKnowledgeWhiteboardContent(content)
	if err != nil {
		return nil, err
	}
	result := make(map[string]string, len(value.Elements))
	for _, element := range value.Elements {
		raw, marshalErr := json.Marshal(element)
		if marshalErr != nil {
			return nil, marshalErr
		}
		digest := sha256.Sum256(raw)
		result[element.ID] = hex.EncodeToString(digest[:])
	}
	return result, nil
}

func knowledgeWhiteboardCommentAnchor(content, nodeID, quote string) (knowledgesdk.KnowledgePageCommentAnchor, error) {
	value, err := decodeKnowledgeWhiteboardContent(content)
	if err != nil {
		return knowledgesdk.KnowledgePageCommentAnchor{}, conversationError("bad_request", "page_comment_anchor_invalid")
	}
	var found *knowledgesdk.KnowledgeWhiteboardElement
	for index := range value.Elements {
		if value.Elements[index].ID == nodeID {
			found = &value.Elements[index]
			break
		}
	}
	if found == nil {
		return knowledgesdk.KnowledgePageCommentAnchor{}, conversationError("bad_request", "page_comment_anchor_not_found")
	}
	normalizedQuote := normalizedKnowledgeCommentQuote(quote)
	visible := normalizedKnowledgeCommentQuote(whiteboardElementQuote(*found))
	if normalizedQuote == "" || visible == "" || !strings.Contains(visible, normalizedQuote) {
		return knowledgesdk.KnowledgePageCommentAnchor{}, conversationError("bad_request", "page_comment_quote_invalid")
	}
	raw, err := json.Marshal(found)
	if err != nil {
		return knowledgesdk.KnowledgePageCommentAnchor{}, err
	}
	digest := sha256.Sum256(raw)
	return knowledgesdk.KnowledgePageCommentAnchor{NodeID: nodeID, Quote: normalizedQuote, BlockSHA256: hex.EncodeToString(digest[:])}, nil
}
