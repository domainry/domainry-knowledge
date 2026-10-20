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
