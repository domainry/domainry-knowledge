package application

import (
	"path/filepath"
	"regexp"
	"strings"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
)

var knowledgeDocumentExtension = regexp.MustCompile(`^\.[a-z0-9]{1,8}$`)

// StoredKnowledgeDocumentFormats is the authoritative original-file surface.
// These formats are understood by the built-in security gate and the browser
// preview/download layer. A configured Connector may add indexing metadata to
// one of these formats, but it does not decide whether Knowledge can retain an
// original in its own authorized storage.
func StoredKnowledgeDocumentFormats() []agentsdk.KnowledgeDocumentFormat {
	contentTypes := map[string]string{
		".txt": "text/plain", ".md": "text/markdown", ".rst": "text/plain", ".html": "text/html", ".htm": "text/html",
		".csv": "text/csv", ".json": "application/json", ".jsonl": "application/x-ndjson", ".py": "text/x-python",
		".js": "text/javascript", ".ts": "text/plain", ".tsx": "text/plain", ".jsx": "text/javascript", ".java": "text/x-java-source",
		".go": "text/x-go", ".rs": "text/plain", ".c": "text/x-c", ".h": "text/x-c", ".cpp": "text/x-c++", ".hpp": "text/x-c++",
		".cs": "text/plain", ".rb": "text/x-ruby", ".php": "text/x-php", ".kt": "text/plain", ".swift": "text/plain", ".scala": "text/plain", ".sh": "text/x-shellscript",
		".pdf": "application/pdf", ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation", ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		".xlsm": "application/vnd.ms-excel.sheet.macroEnabled.12", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
		".gif": "image/gif", ".bmp": "image/bmp", ".webp": "image/webp", ".mp3": "audio/mpeg", ".wav": "audio/wav",
		".ogg": "audio/ogg", ".flac": "audio/flac", ".m4a": "audio/mp4", ".aac": "audio/aac", ".mp4": "video/mp4",
		".mov": "video/quicktime", ".webm": "video/webm", ".avi": "video/x-msvideo",
	}
	exts := []string{
		".txt", ".md", ".rst", ".html", ".htm", ".csv", ".json", ".jsonl", ".py", ".js", ".ts", ".tsx", ".jsx", ".java", ".go", ".rs", ".c", ".h", ".cpp", ".hpp", ".cs", ".rb", ".php", ".kt", ".swift", ".scala", ".sh",
		".pdf", ".docx", ".pptx", ".xlsx", ".xlsm", ".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp", ".mp3", ".wav", ".ogg", ".flac", ".m4a", ".aac", ".mp4", ".mov", ".webm", ".avi",
	}
	out := make([]agentsdk.KnowledgeDocumentFormat, 0, len(exts))
	for _, extension := range exts {
		out = append(out, agentsdk.KnowledgeDocumentFormat{Extension: extension, ContentType: contentTypes[extension], ParserRoute: "storage"})
	}
	return out
}

func StoredKnowledgeDocumentFormat(filename string) (agentsdk.KnowledgeDocumentFormat, bool) {
	extension := strings.ToLower(filepath.Ext(filename))
	for _, format := range StoredKnowledgeDocumentFormats() {
		if format.Extension == extension {
			return format, true
		}
	}
	return agentsdk.KnowledgeDocumentFormat{}, false
}

// KnowledgeDocumentUploadFormats keeps local storage support independent from
// remote indexing. Connector metadata replaces the storage-only marker for an
// overlapping format, allowing the worker to index it after the original is
// safely retained.
func KnowledgeDocumentUploadFormats(source any) []agentsdk.KnowledgeDocumentFormat {
	stored := StoredKnowledgeDocumentFormats()
	indexed := map[string]agentsdk.KnowledgeDocumentFormat{}
	for _, format := range KnowledgeDocumentFormats(source) {
		indexed[format.Extension] = format
	}
	for i := range stored {
		if format, ok := indexed[stored[i].Extension]; ok {
			stored[i] = format
		}
	}
	return stored
}

// KnowledgeDocumentFormats projects the configured Connector's authoritative
// Builder capabilities into a bounded application value. Knowledge does not
// carry its own parser-format table.
func KnowledgeDocumentFormats(source any) []agentsdk.KnowledgeDocumentFormat {
	provider, ok := source.(agentsdk.KnowledgeDocumentFormatSource)
	if !ok {
		return nil
	}
	raw := provider.KnowledgeDocumentFormats()
	if len(raw) == 0 || len(raw) > 128 {
		return nil
	}
	seen := map[string]bool{}
	out := make([]agentsdk.KnowledgeDocumentFormat, 0, len(raw))
	for _, format := range raw {
		format.Extension = strings.ToLower(format.Extension)
		if !knowledgeDocumentExtension.MatchString(format.Extension) || seen[format.Extension] || format.ContentType == "" || len(format.ContentType) > 128 || format.ParserRoute == "" || len(format.ParserRoute) > 32 || format.BuilderMaxBytes < 0 || format.AssetMaxBytes < 0 || format.EnrichmentMaxBytes < 0 || format.AnalysisOutputMaxBytes < 0 {
			return nil
		}
		seen[format.Extension] = true
		out = append(out, format)
	}
	return out
}

func KnowledgeDocumentFormat(source any, filename string) (agentsdk.KnowledgeDocumentFormat, bool) {
	extension := strings.ToLower(filepath.Ext(filename))
	for _, format := range KnowledgeDocumentFormats(source) {
		if format.Extension == extension {
			return format, true
		}
	}
	return agentsdk.KnowledgeDocumentFormat{}, false
}

func DocumentIndexMaximumBytesForFilename(source any, filename string) int64 {
	format, ok := KnowledgeDocumentFormat(source, filename)
	if !ok {
		return 0
	}
	maximum := DocumentIndexMaximumBytes(source)
	if format.BuilderMaxBytes > 0 && format.BuilderMaxBytes < maximum {
		maximum = format.BuilderMaxBytes
	}
	return maximum
}
