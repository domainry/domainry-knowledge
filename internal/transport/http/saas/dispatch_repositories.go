package saas

import (
	"context"
	"encoding/json"
	"time"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
)

func (server *Server) dispatchRepositories(ctx context.Context, operation string, raw json.RawMessage) (any, error, bool) {
	if value, err, handled := server.dispatchArtifactRepository(ctx, operation, raw); handled {
		return value, err, true
	}
	if value, err, handled := server.dispatchAttachmentRepository(ctx, operation, raw); handled {
		return value, err, true
	}
	return server.dispatchDocumentRepository(ctx, operation, raw)
}

func (server *Server) dispatchArtifactRepository(ctx context.Context, operation string, raw json.RawMessage) (any, error, bool) {
	repo, ok := server.dependencies.Repository.(persistence.ConversationArtifactRepository)
	if !ok {
		return nil, nil, false
	}
	switch operation {
	case "artifacts.list":
		var in struct {
			Input     agentsdk.ConversationArtifactQuery `json:"input"`
			Authority agentsdk.ConversationAuthority     `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := repo.Artifacts(ctx, in.Input, in.Authority)
		return v, e, true
	case "artifacts.versions":
		var in struct {
			ID        string                         `json:"id"`
			Before    int64                          `json:"before"`
			Limit     int                            `json:"limit"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := repo.ArtifactVersions(ctx, in.ID, in.Before, in.Limit, in.Authority)
		return v, e, true
	case "artifacts.export_record":
		var in struct {
			ID        string                         `json:"id"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := repo.ArtifactExport(ctx, in.ID, in.Authority)
		return v, e, true
	case "artifacts.export_content":
		var in struct {
			ID        string                         `json:"id"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := repo.ArtifactExportContent(ctx, in.ID, in.Authority)
		return v, e, true
	case "artifacts.record_download":
		var in struct {
			ID        string                         `json:"id"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := repo.RecordArtifactDownload(ctx, in.ID, in.Authority)
		return v, e, true
	}
	return nil, nil, false
}

func (server *Server) dispatchAttachmentRepository(ctx context.Context, operation string, raw json.RawMessage) (any, error, bool) {
	repo, ok := server.dependencies.Repository.(persistence.ConversationAttachmentRepository)
	if !ok {
		return nil, nil, false
	}
	switch operation {
	case "attachments.reserve":
		var in struct {
			Input struct {
				ClientID       string `json:"client_id"`
				ConversationID string `json:"conversation_id"`
				Filename       string `json:"filename"`
				ContentType    string `json:"content_type"`
				SHA256         string `json:"sha256"`
				Bytes          int64  `json:"bytes"`
				Content        []byte `json:"content"`
			} `json:"input"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := repo.ReserveAttachment(ctx, persistence.ConversationAttachmentReserve{ClientID: in.Input.ClientID, ConversationID: in.Input.ConversationID, Filename: in.Input.Filename, ContentType: in.Input.ContentType, SHA256: in.Input.SHA256, Bytes: in.Input.Bytes, Content: in.Input.Content}, in.Authority)
		return v, e, true
	case "attachments.record":
		var in struct {
			ID        string                         `json:"id"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := repo.AttachmentRecord(ctx, in.ID, in.Authority)
		return v, e, true
	case "attachments.list":
		var in struct {
			ConversationID string                         `json:"conversation_id"`
			After          string                         `json:"after"`
			Limit          int                            `json:"limit"`
			Authority      agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := repo.Attachments(ctx, in.ConversationID, in.After, in.Limit, in.Authority)
		return v, e, true
	case "attachments.transition":
		var in struct {
			ID        string                                       `json:"id"`
			Expected  int64                                        `json:"expected"`
			Input     persistence.ConversationAttachmentTransition `json:"input"`
			Authority agentsdk.ConversationAuthority               `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := repo.TransitionAttachment(ctx, in.ID, in.Expected, in.Input, in.Authority)
		return v, e, true
	case "attachments.content":
		var in struct {
			ID        string                         `json:"id"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := repo.AttachmentContent(ctx, in.ID, in.Authority)
		return v, e, true
	case "attachments.delete_content":
		var in struct {
			ID        string                         `json:"id"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		e := repo.DeleteAttachmentContent(ctx, in.ID, in.Authority)
		return struct{}{}, e, true
	}
	return nil, nil, false
}

func (server *Server) dispatchDocumentRepository(ctx context.Context, operation string, raw json.RawMessage) (any, error, bool) {
	repo, ok := server.dependencies.Repository.(persistence.KnowledgeDocumentRepository)
	if !ok {
		return nil, nil, false
	}
	switch operation {
	case "documents.activate_source":
		var in struct {
			Scope agentsdk.KnowledgeDocumentStorageScope `json:"scope"`
			ID    string                                 `json:"id"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		e := repo.ActivateKnowledgeDocumentSource(ctx, in.Scope, in.ID)
		return struct{}{}, e, true
	case "documents.library_source":
		var in struct {
			ID        string                         `json:"id"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := repo.KnowledgeDocumentLibrarySource(ctx, in.ID, in.Authority)
		return v, e, true
	case "documents.source_managed":
		var in struct {
			ID string `json:"id"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := repo.KnowledgeSourceManaged(ctx, in.ID)
		return v, e, true
	case "documents.reserve":
		var in struct {
			Input     persistence.KnowledgeDocumentReserve `json:"input"`
			Authority agentsdk.ConversationAuthority       `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := repo.ReserveKnowledgeDocument(ctx, in.Input, in.Authority)
		return v, e, true
	case "documents.commit_content":
		var in struct {
			ID        string                         `json:"id"`
			Revision  int64                          `json:"revision"`
			BodyRef   string                         `json:"body_ref"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := repo.CommitKnowledgeDocumentContent(ctx, in.ID, in.Revision, in.BodyRef, in.Authority)
		return v, e, true
	case "documents.record":
		var in struct {
			ID        string                         `json:"id"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := repo.KnowledgeDocumentRecord(ctx, in.ID, in.Authority)
		return v, e, true
	case "documents.by_remote":
		var in struct {
			Library   string                         `json:"library"`
			Source    string                         `json:"source"`
			ID        string                         `json:"id"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := repo.KnowledgeDocumentByRemoteID(ctx, in.Library, in.Source, in.ID, in.Authority)
		return v, e, true
	case "documents.list":
		var in struct {
			Library   string                         `json:"library"`
			After     string                         `json:"after"`
			Limit     int                            `json:"limit"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := repo.KnowledgeDocuments(ctx, in.Library, in.After, in.Limit, in.Authority)
		return v, e, true
	case "documents.request_delete":
		var in struct {
			ID        string                         `json:"id"`
			Revision  int64                          `json:"revision"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := repo.RequestKnowledgeDocumentDeletion(ctx, in.ID, in.Revision, in.Authority)
		return v, e, true
	case "documents.claim_work":
		var in struct {
			Owner    string        `json:"owner"`
			Scope    string        `json:"scope"`
			Now      time.Time     `json:"now"`
			Duration time.Duration `json:"duration"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		lease, claimed, e := repo.ClaimKnowledgeDocumentWork(ctx, in.Owner, in.Scope, in.Now, in.Duration)
		return struct {
			Lease   persistence.KnowledgeDocumentLease `json:"lease"`
			Claimed bool                               `json:"claimed"`
		}{lease, claimed}, e, true
	case "documents.work_record":
		var in persistence.KnowledgeDocumentLease
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := repo.KnowledgeDocumentWorkRecord(ctx, in)
		return v, e, true
	case "documents.start_put":
		var in persistence.KnowledgeDocumentLease
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		record, started, e := repo.StartKnowledgeDocumentPut(ctx, in)
		return struct {
			Record  persistence.KnowledgeDocumentRecord `json:"record"`
			Started bool                                `json:"started"`
		}{record, started}, e, true
	case "documents.start_delete":
		var in persistence.KnowledgeDocumentLease
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		e := repo.StartKnowledgeDocumentDelete(ctx, in)
		return struct{}{}, e, true
	case "documents.apply_progress":
		var in struct {
			Lease    persistence.KnowledgeDocumentLease    `json:"lease"`
			Progress persistence.KnowledgeDocumentProgress `json:"progress"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		e := repo.ApplyKnowledgeDocumentProgress(ctx, in.Lease, in.Progress)
		return struct{}{}, e, true
	}
	return nil, nil, false
}
