package application

import (
	"path/filepath"
	"regexp"
	"strings"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
)

var knowledgeDocumentExtension = regexp.MustCompile(`^\.[a-z0-9]{1,8}$`)

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
