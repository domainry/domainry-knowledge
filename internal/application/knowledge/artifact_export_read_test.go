package application

import (
	"context"
	"fmt"
	"testing"

	sdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
	"github.com/domainry/domainry-knowledge/artifact"
)

type artifactExportReadStore struct {
	persistence.ConversationArtifactRepository
	authority sdk.ConversationAuthority
	record    persistence.ConversationArtifactRecord
	export    sdk.ConversationArtifactExport
	downloads int
}

func (s *artifactExportReadStore) ArtifactRecord(ctx context.Context, id string, version int64, a sdk.ConversationAuthority) (persistence.ConversationArtifactRecord, error) {
	if a != s.authority || id != s.record.Artifact.ID || version != s.record.Artifact.Version {
		return persistence.ConversationArtifactRecord{}, conversationFailure("not_found", "artifact_not_found")
	}
	return s.record, ctx.Err()
}
func (s *artifactExportReadStore) ArtifactExport(ctx context.Context, id string, a sdk.ConversationAuthority) (sdk.ConversationArtifactExport, error) {
	if a != s.authority || id != s.export.ID {
		return sdk.ConversationArtifactExport{}, conversationFailure("not_found", "artifact_export_not_found")
	}
	return s.export, ctx.Err()
}
func (s *artifactExportReadStore) RecordArtifactDownload(ctx context.Context, id string, a sdk.ConversationAuthority) (sdk.ConversationArtifactExport, error) {
	out, err := s.ArtifactExport(ctx, id, a)
	if err != nil {
		return out, err
	}
	s.downloads++
	out.Downloads = int64(s.downloads)
	return out, nil
}

type artifactExportReadPolicy struct{ denied bool }

func (p *artifactExportReadPolicy) AuthorizeConversationTool(ctx context.Context, in sdk.ConversationToolRequest) (sdk.ConversationToolAuthorization, error) {
	return sdk.ConversationToolAuthorization{Granted: in.Call.Name == "artifact_read" && !p.denied}, ctx.Err()
}

func TestExistingArtifactExportReadRequiresOnlyCurrentReadableVersion(t *testing.T) {
	for _, content := range []sdk.ConversationArtifactContent{
		{Kind: "markdown", Markdown: "原导出正文"},
		{Kind: "table", Table: &sdk.ConversationArtifactTable{Columns: []sdk.ConversationArtifactColumn{{Key: "value", Label: "值", Type: "text"}}, Rows: [][]*string{{new("=1+2")}}}},
	} {
		t.Run(content.Kind, func(t *testing.T) {
			a := sdk.ConversationAuthority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "owner"}
			body, hash, err := artifact.Encode(content)
			if err != nil {
				t.Fatal(err)
			}
			format := "markdown"
			if content.Kind == "table" {
				format = "csv"
			}
			data, err := artifact.Export(content, format)
			if err != nil {
				t.Fatal(err)
			}
			repo := &artifactExportReadStore{authority: a, record: persistence.ConversationArtifactRecord{Artifact: sdk.ConversationArtifact{ID: "art_original", Version: 2, Kind: content.Kind, Bytes: len(body), SHA256: hash}, Body: body, Sources: &sdk.ConversationSources{Version: 1}}}
			repo.export = sdk.ConversationArtifactExport{ID: "export_original", ArtifactID: repo.record.Artifact.ID, Version: 2, Format: format, Filename: fmt.Sprintf("%s-v2%s", repo.record.Artifact.ID, data.Extension), ContentType: data.ContentType, SHA256: artifact.Hash(data.Data), Bytes: len(data.Data), FormulaGuarded: data.FormulaGuarded}
			policy := &artifactExportReadPolicy{}
			service := NewService(repo, a.RuntimeID, Options{PersonalAuthorizer: policy})
			if _, err := service.DownloadArtifact(t.Context(), repo.export.ID, a); err == nil || repo.downloads != 0 {
				t.Fatal("ordinary download bypassed its original export grant")
			}
			out, err := service.ReadArtifactExport(t.Context(), repo.export.ID, a)
			if err != nil || string(out.Data) != string(data.Data) || repo.downloads != 1 || out.Export.ID != repo.export.ID || out.Export.FormulaGuarded != data.FormulaGuarded {
				t.Fatal("readable original export was recreated or changed", err)
			}
			policy.denied = true
			if _, err := service.ReadArtifactExport(t.Context(), repo.export.ID, a); err == nil || repo.downloads != 1 {
				t.Fatal("read revocation ignored or download counted")
			}
			policy.denied = false
			for _, mutate := range []func(){
				func() { repo.export.SHA256 = "modified" },
				func() { repo.export.Bytes++ },
				func() { repo.export.Filename = "other.md" },
				func() { repo.export.ContentType = "text/html" },
				func() { repo.export.FormulaGuarded = !repo.export.FormulaGuarded },
				func() { repo.record.Body = []byte(`{"kind":"markdown","markdown":"modified"}`) },
				func() { repo.record.Sources = nil },
				func() {
					repo.record.Sources = &sdk.ConversationSources{Version: 1, Runs: []sdk.ConversationRunReference{{ConversationID: "private", RunID: "source"}}}
				},
			} {
				export, record := repo.export, repo.record
				mutate()
				if out, err := service.ReadArtifactExport(t.Context(), repo.export.ID, a); err == nil || len(out.Data) > 0 || repo.downloads != 1 {
					t.Fatal("unverifiable export returned or counted")
				}
				repo.export, repo.record = export, record
			}
			other := a
			other.UserID = "other"
			if _, err := service.ReadArtifactExport(t.Context(), repo.export.ID, other); err == nil || repo.downloads != 1 {
				t.Fatal("cross-owner export readable")
			}
		})
	}
}
