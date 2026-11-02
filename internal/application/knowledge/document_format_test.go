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
	expected := map[string]string{
		".txt": "text/plain", ".md": "text/markdown", ".rst": "text/plain", ".html": "text/html", ".htm": "text/html",
		".csv": "text/csv", ".json": "application/json", ".jsonl": "application/x-ndjson", ".py": "text/x-python",
		".js": "text/javascript", ".ts": "text/plain", ".tsx": "text/plain", ".jsx": "text/javascript", ".java": "text/x-java-source",
		".go": "text/x-go", ".rs": "text/plain", ".c": "text/x-c", ".h": "text/x-c", ".cpp": "text/x-c++", ".hpp": "text/x-c++",
		".cs": "text/plain", ".rb": "text/x-ruby", ".php": "text/x-php", ".kt": "text/plain", ".swift": "text/plain", ".scala": "text/plain", ".sh": "text/x-shellscript",
		".pdf": "application/pdf", ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
		".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ".xlsm": "application/vnd.ms-excel.sheet.macroEnabled.12",
		".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".bmp": "image/bmp", ".webp": "image/webp",
		".mp3": "audio/mpeg", ".wav": "audio/wav", ".ogg": "audio/ogg", ".flac": "audio/flac", ".m4a": "audio/mp4", ".aac": "audio/aac",
		".mp4": "video/mp4", ".mov": "video/quicktime", ".webm": "video/webm", ".avi": "video/x-msvideo",
	}
	if len(stored) != len(expected) || len(expected) != 48 {
		t.Fatalf("stored format count=%d expected=%d", len(stored), len(expected))
	}
	byExtension := make(map[string]agentsdk.KnowledgeDocumentFormat, len(stored))
	for _, format := range stored {
		if byExtension[format.Extension].Extension != "" {
			t.Fatalf("duplicate stored format %q", format.Extension)
		}
		byExtension[format.Extension] = format
	}
	for extension, contentType := range expected {
		if format := byExtension[extension]; format.ContentType != contentType || format.ParserRoute != "storage" {
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
