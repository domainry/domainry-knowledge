package store

import (
	"encoding/json"
	"io"
	"math"
	"strings"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

const emptyKnowledgePresentationContent = `{"schema_version":1,"theme":"forest","master":{"background_color":"#FFFFFF","text_color":"#17221C","accent_color":"#176B52","muted_color":"#66746C","font_family":"Arial","footer":"","show_slide_number":true},"slides":[{"id":"slide-1","title":"演示标题","layout":"title","background_color":"","notes":"","elements":[{"id":"slide-1-title","type":"text","x":168,"y":260,"width":1264,"height":150,"rotation":0,"text":"演示标题","font_size":72,"font_weight":"bold","color":"#17221C","align":"center"},{"id":"slide-1-subtitle","type":"text","x":260,"y":438,"width":1080,"height":78,"rotation":0,"text":"补充一句清晰的说明","font_size":28,"font_weight":"normal","color":"#66746C","align":"center"}],"files":{}}]}`

var presentationRootKeys = map[string]bool{"schema_version": true, "theme": true, "master": true, "slides": true}
var presentationMasterKeys = map[string]bool{"background_color": true, "text_color": true, "accent_color": true, "muted_color": true, "font_family": true, "footer": true, "show_slide_number": true}
var presentationSlideKeys = map[string]bool{"id": true, "title": true, "layout": true, "background_color": true, "notes": true, "elements": true, "files": true}
var presentationElementKeys = map[string]bool{
	"id": true, "type": true, "x": true, "y": true, "width": true, "height": true, "rotation": true,
	"text": true, "font_size": true, "font_weight": true, "color": true, "align": true,
	"shape": true, "fill_color": true, "stroke_color": true, "stroke_width": true,
	"asset_id": true, "fit": true, "table": true, "chart": true, "formula": true, "language": true, "source": true,
}
var presentationAssetKeys = map[string]bool{"id": true, "mime_type": true, "document_ref": true, "filename": true}
var presentationThemes = map[string]bool{"forest": true, "midnight": true, "sunrise": true}
var presentationLayouts = map[string]bool{"title": true, "section": true, "agenda": true, "title_content": true, "two_column": true, "quote": true, "image_focus": true, "blank": true}
var presentationShapes = map[string]bool{
	"rectangle": true, "rounded_rectangle": true, "ellipse": true, "triangle": true, "diamond": true,
	"hexagon": true, "star": true, "arrow_right": true, "callout": true, "line": true,
}
var presentationChartTypes = map[string]bool{"column": true, "bar": true, "line": true, "area": true, "pie": true, "donut": true}
var presentationFonts = map[string]bool{"Arial": true, "Aptos": true, "Helvetica": true, "Georgia": true, "Times New Roman": true}
var presentationImageMIMETypes = map[string]bool{"image/png": true, "image/jpeg": true, "image/webp": true, "image/gif": true}
var presentationVideoMIMETypes = map[string]bool{"video/mp4": true, "video/webm": true}

func presentationExactKeys(value map[string]any, allowed map[string]bool) bool {
	for key := range value {
		if !allowed[key] {
			return false
		}
	}
	return true
}

func presentationNumber(value any, minimum, maximum float64) (float64, bool) {
	number, ok := value.(json.Number)
	if !ok {
		return 0, false
	}
	parsed, err := number.Float64()
	return parsed, err == nil && !math.IsInf(parsed, 0) && !math.IsNaN(parsed) && parsed >= minimum && parsed <= maximum
}

func presentationText(value any, maximum int, required bool) (string, bool) {
	text, ok := value.(string)
	return text, ok && executionText(text, maximum, required)
}

func presentationColor(value any, allowEmpty bool) bool {
	text, ok := value.(string)
	if !ok || allowEmpty && text == "" {
		return ok && allowEmpty
	}
	if len(text) != 7 || text[0] != '#' {
		return false
	}
	for _, character := range text[1:] {
		if character < '0' || character > '9' && character < 'A' || character > 'F' && character < 'a' || character > 'f' {
			return false
		}
	}
	return true
}

func validatePresentationMaster(value any) bool {
	master, ok := value.(map[string]any)
	if !ok || len(master) != len(presentationMasterKeys) || !presentationExactKeys(master, presentationMasterKeys) {
		return false
	}
	font, fontOK := master["font_family"].(string)
	_, footerOK := presentationText(master["footer"], 512, false)
	_, slideNumberOK := master["show_slide_number"].(bool)
	return presentationColor(master["background_color"], false) && presentationColor(master["text_color"], false) && presentationColor(master["accent_color"], false) && presentationColor(master["muted_color"], false) && fontOK && presentationFonts[font] && footerOK && slideNumberOK
}

func validatePresentationAsset(id string, value any) (string, bool) {
	asset, ok := value.(map[string]any)
	if !ok || len(asset) != len(presentationAssetKeys) || !presentationExactKeys(asset, presentationAssetKeys) {
		return "", false
	}
	assetID, idOK := asset["id"].(string)
	mimeType, mimeOK := asset["mime_type"].(string)
	documentReference, referenceOK := asset["document_ref"].(string)
	_, filenameOK := presentationText(asset["filename"], 512, true)
	documentID := strings.TrimPrefix(documentReference, "knowledge-document:")
	if !idOK || assetID != id || !validNativeOperationEntityID(assetID) || !mimeOK || !presentationImageMIMETypes[mimeType] && !presentationVideoMIMETypes[mimeType] || !referenceOK || documentID == documentReference || !validKnowledgeDocumentID(documentID) || !filenameOK {
		return "", false
	}
	return mimeType, true
}

func validatePresentationElement(value any, assets map[string]string) (string, bool) {
	element, ok := value.(map[string]any)
	if !ok || !presentationExactKeys(element, presentationElementKeys) {
		return "", false
	}
	id, idOK := element["id"].(string)
	elementType, typeOK := element["type"].(string)
	x, xOK := presentationNumber(element["x"], 0, 1600)
	y, yOK := presentationNumber(element["y"], 0, 900)
	width, widthOK := presentationNumber(element["width"], 1, 1600)
	height, heightOK := presentationNumber(element["height"], 1, 900)
	_, rotationOK := presentationNumber(element["rotation"], -360, 360)
	if !idOK || !validNativeOperationEntityID(id) || !typeOK || !xOK || !yOK || !widthOK || !heightOK || !rotationOK || x+width > 1600 || y+height > 900 {
		return "", false
	}
	switch elementType {
	case "text":
		if len(element) != 12 {
			return "", false
		}
		_, textOK := presentationText(element["text"], 32768, false)
		_, fontSizeOK := presentationNumber(element["font_size"], 8, 240)
		fontWeight, weightOK := element["font_weight"].(string)
		align, alignOK := element["align"].(string)
		return id, textOK && fontSizeOK && weightOK && (fontWeight == "normal" || fontWeight == "bold") && presentationColor(element["color"], false) && alignOK && (align == "left" || align == "center" || align == "right")
	case "shape":
		if len(element) != 16 {
			return "", false
		}
		shape, shapeOK := element["shape"].(string)
		_, strokeWidthOK := presentationNumber(element["stroke_width"], 0, 24)
		_, textOK := presentationText(element["text"], 32768, false)
		_, fontSizeOK := presentationNumber(element["font_size"], 8, 240)
		fontWeight, weightOK := element["font_weight"].(string)
		align, alignOK := element["align"].(string)
		return id, shapeOK && presentationShapes[shape] && presentationColor(element["fill_color"], false) && presentationColor(element["stroke_color"], false) && strokeWidthOK && textOK && fontSizeOK && weightOK && (fontWeight == "normal" || fontWeight == "bold") && presentationColor(element["color"], false) && alignOK && (align == "left" || align == "center" || align == "right")
	case "image", "video":
		if len(element) != 9 {
			return "", false
		}
		assetID, assetOK := element["asset_id"].(string)
		fit, fitOK := element["fit"].(string)
		mimeType := assets[assetID]
		return id, assetOK && mimeType != "" && fitOK && (fit == "contain" || fit == "cover") && (elementType == "image" && presentationImageMIMETypes[mimeType] || elementType == "video" && presentationVideoMIMETypes[mimeType])
	case "table":
		if len(element) != 8 {
			return "", false
		}
		table, tableOK := element["table"].(map[string]any)
		rows, rowsOK := table["rows"].([]any)
		_, headerOK := table["header"].(bool)
		if !tableOK || len(table) != 2 || !rowsOK || !headerOK || len(rows) < 1 || len(rows) > 50 {
			return "", false
		}
		columns := -1
		for _, rawRow := range rows {
			row, valid := rawRow.([]any)
			if !valid || len(row) < 1 || len(row) > 20 || columns >= 0 && len(row) != columns {
				return "", false
			}
			columns = len(row)
			for _, rawCell := range row {
				if _, valid := presentationText(rawCell, 2048, false); !valid {
					return "", false
				}
			}
		}
		return id, true
	case "chart":
		if len(element) != 8 {
			return "", false
		}
		chart, chartOK := element["chart"].(map[string]any)
		chartType, typeOK := chart["type"].(string)
		categories, categoriesOK := chart["categories"].([]any)
		series, seriesOK := chart["series"].([]any)
		if !chartOK || len(chart) != 3 || !typeOK || !presentationChartTypes[chartType] || !categoriesOK || len(categories) < 1 || len(categories) > 50 || !seriesOK || len(series) < 1 || len(series) > 12 {
			return "", false
		}
		for _, category := range categories {
			if _, valid := presentationText(category, 256, true); !valid {
				return "", false
			}
		}
		for _, rawSeries := range series {
			item, valid := rawSeries.(map[string]any)
			values, valuesOK := item["values"].([]any)
			if !valid || len(item) != 2 || !valuesOK || len(values) != len(categories) {
				return "", false
			}
			if _, valid = presentationText(item["name"], 256, true); !valid {
				return "", false
			}
			for _, rawValue := range values {
				if _, valid = presentationNumber(rawValue, -1e12, 1e12); !valid {
					return "", false
				}
			}
		}
		return id, true
	case "formula":
		if len(element) != 10 {
			return "", false
		}
		_, formulaOK := presentationText(element["formula"], 8192, true)
		_, fontSizeOK := presentationNumber(element["font_size"], 8, 240)
		return id, formulaOK && fontSizeOK && presentationColor(element["color"], false)
	case "code":
		if len(element) != 12 {
			return "", false
		}
		language, languageOK := presentationText(element["language"], 64, true)
		_, sourceOK := presentationText(element["source"], 32768, false)
		_, fontSizeOK := presentationNumber(element["font_size"], 8, 120)
		if !languageOK || !sourceOK || !fontSizeOK || !presentationColor(element["color"], false) || !presentationColor(element["fill_color"], false) {
			return "", false
		}
		for _, character := range language {
			if character >= 'a' && character <= 'z' || character >= 'A' && character <= 'Z' || character >= '0' && character <= '9' || strings.ContainsRune("_+#.-", character) {
				continue
			}
			return "", false
		}
		return id, true
	default:
		return "", false
	}
}

func decodePresentationContent(content string) (map[string]any, error) {
	if !executionText(content, knowledgePageMaximumBytes, true) {
		return nil, conversationError("bad_request", "page_content_invalid")
	}
	var root map[string]any
	decoder := json.NewDecoder(strings.NewReader(content))
	decoder.UseNumber()
	if err := decoder.Decode(&root); err != nil || root == nil {
		return nil, conversationError("bad_request", "page_content_schema_invalid")
	}
	if err := decoder.Decode(&struct{}{}); err != io.EOF {
		return nil, conversationError("bad_request", "page_content_schema_invalid")
	}
	return root, nil
}

func validatePresentationContent(content string) error {
	root, err := decodePresentationContent(content)
	if err != nil {
		return err
	}
	if len(root) != len(presentationRootKeys) || !presentationExactKeys(root, presentationRootKeys) {
		return conversationError("bad_request", "page_content_schema_invalid")
	}
	schemaVersion, schemaOK := presentationNumber(root["schema_version"], 1, 1)
	theme, themeOK := root["theme"].(string)
	slides, slidesOK := root["slides"].([]any)
	if !schemaOK || schemaVersion != 1 || !themeOK || !presentationThemes[theme] || !validatePresentationMaster(root["master"]) || !slidesOK || len(slides) < 1 || len(slides) > 200 {
		return conversationError("bad_request", "page_content_schema_invalid")
	}
	slideIDs := make(map[string]bool, len(slides))
	for _, rawSlide := range slides {
		slide, ok := rawSlide.(map[string]any)
		if !ok || len(slide) != len(presentationSlideKeys) || !presentationExactKeys(slide, presentationSlideKeys) {
			return conversationError("bad_request", "page_content_schema_invalid")
		}
		slideID, idOK := slide["id"].(string)
		_, titleOK := presentationText(slide["title"], 512, true)
		layout, layoutOK := slide["layout"].(string)
		_, notesOK := presentationText(slide["notes"], 32768, false)
		elements, elementsOK := slide["elements"].([]any)
		files, filesOK := slide["files"].(map[string]any)
		if !idOK || !validNativeOperationEntityID(slideID) || slideIDs[slideID] || !titleOK || !layoutOK || !presentationLayouts[layout] || !presentationColor(slide["background_color"], true) || !notesOK || !elementsOK || len(elements) > 256 || !filesOK || len(files) > 64 {
			return conversationError("bad_request", "page_content_schema_invalid")
		}
		assets := make(map[string]string, len(files))
		for assetID, rawAsset := range files {
			mimeType, valid := validatePresentationAsset(assetID, rawAsset)
			if !valid {
				return conversationError("bad_request", "page_content_schema_invalid")
			}
			assets[assetID] = mimeType
		}
		usedAssets := make(map[string]bool, len(assets))
		elementIDs := make(map[string]bool, len(elements))
		for _, rawElement := range elements {
			elementID, valid := validatePresentationElement(rawElement, assets)
			if !valid || elementIDs[elementID] {
				return conversationError("bad_request", "page_content_schema_invalid")
			}
			elementIDs[elementID] = true
			if element, _ := rawElement.(map[string]any); element["type"] == "image" || element["type"] == "video" {
				usedAssets[element["asset_id"].(string)] = true
			}
		}
		if len(usedAssets) != len(assets) {
			return conversationError("bad_request", "page_content_schema_invalid")
		}
		slideIDs[slideID] = true
	}
	return nil
}

func presentationPlainText(content string) string {
	root, err := decodePresentationContent(content)
	if err != nil {
		return ""
	}
	words := make([]string, 0, 32)
	if master, ok := root["master"].(map[string]any); ok {
		if footer, ok := master["footer"].(string); ok {
			words = append(words, footer)
		}
	}
	if slides, ok := root["slides"].([]any); ok {
		for _, rawSlide := range slides {
			slide, _ := rawSlide.(map[string]any)
			for _, key := range []string{"title", "notes"} {
				if text, ok := slide[key].(string); ok {
					words = append(words, text)
				}
			}
			if elements, ok := slide["elements"].([]any); ok {
				for _, rawElement := range elements {
					if element, ok := rawElement.(map[string]any); ok {
						if text, ok := element["text"].(string); ok {
							words = append(words, text)
						}
						for _, key := range []string{"formula", "source"} {
							if text, ok := element[key].(string); ok {
								words = append(words, text)
							}
						}
						if table, ok := element["table"].(map[string]any); ok {
							if rows, ok := table["rows"].([]any); ok {
								for _, rawRow := range rows {
									if row, ok := rawRow.([]any); ok {
										for _, rawCell := range row {
											if cell, ok := rawCell.(string); ok {
												words = append(words, cell)
											}
										}
									}
								}
							}
						}
						if chart, ok := element["chart"].(map[string]any); ok {
							if categories, ok := chart["categories"].([]any); ok {
								for _, raw := range categories {
									if text, ok := raw.(string); ok {
										words = append(words, text)
									}
								}
							}
							if series, ok := chart["series"].([]any); ok {
								for _, raw := range series {
									if item, ok := raw.(map[string]any); ok {
										if text, ok := item["name"].(string); ok {
											words = append(words, text)
										}
									}
								}
							}
						}
					}
				}
			}
			if files, ok := slide["files"].(map[string]any); ok {
				for _, rawAsset := range files {
					if asset, ok := rawAsset.(map[string]any); ok {
						if filename, ok := asset["filename"].(string); ok {
							words = append(words, filename)
						}
					}
				}
			}
		}
	}
	return strings.TrimSpace(strings.Join(strings.Fields(strings.Join(words, " ")), " "))
}

func presentationPageTypeDefinition() knowledgePageTypeDefinition {
	return knowledgePageTypeDefinition{
		ID:           knowledgesdk.KnowledgePageTypePresentation,
		EmptyContent: func() string { return emptyKnowledgePresentationContent },
		Normalize: func(schema int, content, suppliedHash string) (knowledgesdk.PageContent, error) {
			if err := validatePresentationContent(content); err != nil {
				return knowledgesdk.PageContent{}, err
			}
			normalized, err := normalizedStructuredPageContent("slides", "array", schema, content, suppliedHash)
			if err != nil {
				return knowledgesdk.PageContent{}, err
			}
			normalized.PlainText = presentationPlainText(content)
			normalized.Summary = pageContentSummary(normalized.PlainText)
			return normalized, nil
		},
		ExtractPlainText: normalizedPagePlainText,
		ExtractSummary:   pageContentSummary,
		ScanReferences:   scanJSONPageReferences,
		ValidateBeforePublish: func(content string) error {
			if err := validatePresentationContent(content); err != nil {
				return err
			}
			return validateTrustedPageContent(content)
		},
	}
}
