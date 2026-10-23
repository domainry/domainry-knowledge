package application

import (
	"testing"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
)

type documentFormatTestSource struct{}

func (documentFormatTestSource) KnowledgeDocumentIndexMaximumBytes() int64 { return 30 << 20 }

func (documentFormatTestSource) KnowledgeDocumentFormats() []agentsdk.KnowledgeDocumentFormat {
	return []agentsdk.KnowledgeDocumentFormat{
		{Extension: ".txt", ContentType: "text/plain", ParserRoute: "text"},
		{Extension: ".mp4", ContentType: "video/mp4", ParserRoute: "media", BuilderMaxBytes: 20 << 20, AssetMaxBytes: 20 << 20},
		{Extension: ".png", ContentType: "image/png", ParserRoute: "media", AssetMaxBytes: 20 << 20, EnrichmentMaxBytes: 8 << 20},
		{Extension: ".xlsx", ContentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ParserRoute: "structured", AnalysisOutputMaxBytes: 16 << 20},
	}
}

func TestDocumentIndexMaximumBytesSeparatesTransportAndBuilderLimits(t *testing.T) {
	source := documentFormatTestSource{}
	if got := DocumentIndexMaximumBytesForFilename(source, "notes.txt"); got != 30<<20 {
		t.Fatalf("text maximum=%d", got)
	}
	if got := DocumentIndexMaximumBytesForFilename(source, "meeting.mp4"); got != 20<<20 {
		t.Fatalf("media maximum=%d", got)
	}
	if got := DocumentIndexMaximumBytesForFilename(source, "diagram.png"); got != 30<<20 {
		t.Fatalf("image maximum=%d; enrichment budget must not become an upload limit", got)
	}
	if got := DocumentIndexMaximumBytesForFilename(source, "table.xlsx"); got != 30<<20 {
		t.Fatalf("structured maximum=%d; analysis output budget must not become an upload limit", got)
	}
}

func TestStoredDocumentFormatsCoverFilesMediaAndKeepConnectorMetadata(t *testing.T) {
	stored := StoredKnowledgeDocumentFormats()
	byExtension := make(map[string]agentsdk.KnowledgeDocumentFormat, len(stored))
	for _, format := range stored {
		if byExtension[format.Extension].Extension != "" {
			t.Fatalf("duplicate stored format %q", format.Extension)
		}
		byExtension[format.Extension] = format
	}
	for _, extension := range []string{".txt", ".pdf", ".png", ".mp3", ".mp4"} {
		if format := byExtension[extension]; format.ContentType == "" || format.ParserRoute != "storage" {
			t.Fatalf("stored format %s=%+v", extension, format)
		}
	}
	if _, ok := StoredKnowledgeDocumentFormat("unsafe.exe"); ok {
		t.Fatal("unsupported executable format was accepted")
	}

	uploads := KnowledgeDocumentUploadFormats(documentFormatTestSource{})
	merged := make(map[string]agentsdk.KnowledgeDocumentFormat, len(uploads))
	for _, format := range uploads {
		merged[format.Extension] = format
	}
	if merged[".txt"].ParserRoute != "text" || merged[".mp4"].BuilderMaxBytes != 20<<20 {
		t.Fatalf("connector indexing metadata was not preserved: txt=%+v mp4=%+v", merged[".txt"], merged[".mp4"])
	}
	if merged[".mp3"].ParserRoute != "storage" {
		t.Fatalf("storage-only audio format was lost: %+v", merged[".mp3"])
	}
}
