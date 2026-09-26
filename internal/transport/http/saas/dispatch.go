package saas

import (
	"context"
	"encoding/json"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
	knowledgefiles "github.com/domainry/domainry-knowledge-sdk/files"
	lifecyclemodel "github.com/domainry/domainry-lifecycle-sdk/model"
)

func (server *Server) dispatch(ctx context.Context, operation string, raw json.RawMessage) (any, error) {
	s := server.dependencies.Knowledge
	switch operation {
	case "files.upload":
		var in struct {
			Authority knowledgefiles.Authority `json:"authority"`
			Input     knowledgefiles.Upload    `json:"input"`
		}
		if err := decodeInput(raw, &in); err != nil {
			return nil, err
		}
		return server.dependencies.Files.Upload(ctx, in.Authority, in.Input)
	case "files.get":
		var in struct {
			Authority knowledgefiles.Authority `json:"authority"`
			ID        string                   `json:"id"`
		}
		if err := decodeInput(raw, &in); err != nil {
			return nil, err
		}
		return server.dependencies.Files.Get(ctx, in.Authority, in.ID)
	case "files.download":
		var in struct {
			Authority knowledgefiles.Authority `json:"authority"`
			ID        string                   `json:"id"`
		}
		if err := decodeInput(raw, &in); err != nil {
			return nil, err
		}
		return server.dependencies.Files.Download(ctx, in.Authority, in.ID)
	case "files.bind":
		var in struct {
			Authority knowledgefiles.Authority `json:"authority"`
			ID        string                   `json:"id"`
			Binding   knowledgefiles.Binding   `json:"binding"`
		}
		if err := decodeInput(raw, &in); err != nil {
			return nil, err
		}
		return struct{}{}, server.dependencies.Files.Bind(ctx, in.Authority, in.ID, in.Binding)
	case "files.delete":
		var in struct {
			Authority knowledgefiles.Authority `json:"authority"`
			ID        string                   `json:"id"`
		}
		if err := decodeInput(raw, &in); err != nil {
			return nil, err
		}
		return struct{}{}, server.dependencies.Files.Delete(ctx, in.Authority, in.ID)
	case "runtime.activate":
		return struct{}{}, nil
	case "runtime.knowledge.search":
		var in struct {
			Query     string                         `json:"query"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if err := decodeInput(raw, &in); err != nil {
			return nil, err
		}
		if server.dependencies.ConversationKnowledge == nil {
			return nil, &agentsdk.Error{Class: "unavailable", Code: "knowledge.search_unavailable"}
		}
		return server.dependencies.ConversationKnowledge.Search(ctx, in.Query, in.Authority)
	case "artifacts.record":
		var in struct {
			ID        string                         `json:"id"`
			Version   int64                          `json:"version"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if err := decodeInput(raw, &in); err != nil {
			return nil, err
		}
		return server.dependencies.Artifacts.ArtifactRecord(ctx, in.ID, in.Version, in.Authority)
	case "artifacts.save":
		var in struct {
			Input     persistence.ConversationArtifactWrite `json:"input"`
			Authority agentsdk.ConversationAuthority        `json:"authority"`
		}
		if err := decodeInput(raw, &in); err != nil {
			return nil, err
		}
		return server.dependencies.Artifacts.SaveArtifact(ctx, in.Input, in.Authority)
	case "artifacts.save_export":
		var in struct {
			Input struct {
				RequestSHA256 string                              `json:"request_sha256,omitempty"`
				TTLSeconds    int64                               `json:"ttl_seconds"`
				ClientID      string                              `json:"client_id"`
				Export        agentsdk.ConversationArtifactExport `json:"export"`
				Content       []byte                              `json:"content"`
			} `json:"input"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if err := decodeInput(raw, &in); err != nil {
			return nil, err
		}
		return server.dependencies.Artifacts.SaveArtifactExport(ctx, persistence.ConversationArtifactExportWrite{RequestSHA256: in.Input.RequestSHA256, TTLSeconds: in.Input.TTLSeconds, ClientID: in.Input.ClientID, Export: in.Input.Export, Content: in.Input.Content}, in.Authority)
	case "service.artifact":
		var in struct {
			ID        string                         `json:"id"`
			Version   int64                          `json:"version"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if err := decodeInput(raw, &in); err != nil {
			return nil, err
		}
		return s.Artifact(ctx, in.ID, in.Version, in.Authority)
	case "service.artifact_access":
		var in struct {
			Authority agentsdk.ConversationAuthority `json:"authority"`
			Key       string                         `json:"key"`
			Input     any                            `json:"input"`
		}
		if err := decodeInput(raw, &in); err != nil {
			return nil, err
		}
		_, err := s.ArtifactAccess(ctx, in.Authority, in.Key, in.Input)
		return struct{}{}, err
	case "service.artifact_body":
		var in struct {
			Record    persistence.ConversationArtifactRecord `json:"record"`
			Content   agentsdk.ConversationArtifactContent   `json:"content"`
			Authority agentsdk.ConversationAuthority         `json:"authority"`
		}
		if err := decodeInput(raw, &in); err != nil {
			return nil, err
		}
		return s.ArtifactBody(ctx, in.Record, in.Content, in.Authority)
	case "service.artifact_content":
		var in struct {
			Record    persistence.ConversationArtifactRecord `json:"record"`
			Authority agentsdk.ConversationAuthority         `json:"authority"`
		}
		if err := decodeInput(raw, &in); err != nil {
			return nil, err
		}
		return s.ArtifactContent(ctx, in.Record, in.Authority)
	case "service.artifact_origin":
		var in struct {
			ConversationID string                         `json:"conversation_id"`
			RunID          string                         `json:"run_id"`
			Authority      agentsdk.ConversationAuthority `json:"authority"`
		}
		if err := decodeInput(raw, &in); err != nil {
			return nil, err
		}
		return s.ArtifactOrigin(ctx, in.ConversationID, in.RunID, in.Authority)
	case "service.artifact_versions":
		var in struct {
			ID        string                         `json:"id"`
			Before    int64                          `json:"before"`
			Limit     int                            `json:"limit"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if err := decodeInput(raw, &in); err != nil {
			return nil, err
		}
		return s.ArtifactVersions(ctx, in.ID, in.Before, in.Limit, in.Authority)
	case "service.artifact_view":
		var in struct {
			Record    persistence.ConversationArtifactRecord `json:"record"`
			Authority agentsdk.ConversationAuthority         `json:"authority"`
		}
		if err := decodeInput(raw, &in); err != nil {
			return nil, err
		}
		return s.ArtifactView(ctx, in.Record, in.Authority)
	case "service.artifacts":
		var in struct {
			Input     agentsdk.ConversationArtifactQuery `json:"input"`
			Authority agentsdk.ConversationAuthority     `json:"authority"`
		}
		if err := decodeInput(raw, &in); err != nil {
			return nil, err
		}
		return s.Artifacts(ctx, in.Input, in.Authority)
	case "service.artifact_create":
		var in struct {
			Input     agentsdk.ConversationArtifactCreate `json:"input"`
			Authority agentsdk.ConversationAuthority      `json:"authority"`
		}
		if err := decodeInput(raw, &in); err != nil {
			return nil, err
		}
		return s.CreateArtifact(ctx, in.Input, in.Authority)
	case "service.artifact_edit":
		var in struct {
			ID        string                            `json:"id"`
			Input     agentsdk.ConversationArtifactEdit `json:"input"`
			Authority agentsdk.ConversationAuthority    `json:"authority"`
		}
		if err := decodeInput(raw, &in); err != nil {
			return nil, err
		}
		return s.EditArtifact(ctx, in.ID, in.Input, in.Authority)
	case "service.artifact_export":
		var in struct {
			ID        string                                     `json:"id"`
			Input     agentsdk.ConversationArtifactExportRequest `json:"input"`
			Authority agentsdk.ConversationAuthority             `json:"authority"`
		}
		if err := decodeInput(raw, &in); err != nil {
			return nil, err
		}
		return s.ExportArtifact(ctx, in.ID, in.Input, in.Authority)
	case "service.artifact_download":
		var in struct {
			ExportID  string                         `json:"export_id"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if err := decodeInput(raw, &in); err != nil {
			return nil, err
		}
		return s.DownloadArtifact(ctx, in.ExportID, in.Authority)
	case "subjects.preview", "subjects.export", "subjects.erase":
		var in struct {
			RequestID   string                     `json:"request_id,omitempty"`
			WorkspaceID string                     `json:"workspace_id"`
			SubjectID   string                     `json:"subject_id"`
			LegalHolds  []lifecyclemodel.LegalHold `json:"legal_holds,omitempty"`
		}
		if err := decodeInput(raw, &in); err != nil {
			return nil, err
		}
		if operation == "subjects.preview" {
			return server.dependencies.Subjects.PreviewSubject(ctx, in.WorkspaceID, in.SubjectID)
		}
		if operation == "subjects.export" {
			return server.dependencies.Subjects.ExportSubjectForRequest(ctx, in.RequestID, in.WorkspaceID, in.SubjectID)
		}
		return server.dependencies.Subjects.EraseSubjectForRequest(ctx, in.RequestID, in.WorkspaceID, in.SubjectID, in.LegalHolds)
	default:
		return server.dispatchExtended(ctx, operation, raw)
	}
}
