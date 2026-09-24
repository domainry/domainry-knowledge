package saas

import (
	"context"
	"encoding/json"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
)

func (server *Server) dispatchKnowledgeService(ctx context.Context, operation string, raw json.RawMessage) (any, error, bool) {
	s := server.dependencies.Knowledge
	switch operation {
	case "service.library_source_bind":
		var in struct {
			ID        string                               `json:"id"`
			Input     agentsdk.KnowledgeLibrarySourceWrite `json:"input"`
			Authority agentsdk.ConversationAuthority       `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.BindKnowledgeLibrarySource(ctx, in.ID, in.Input, in.Authority)
		return v, e, true
	case "service.library_create":
		var in struct {
			Input     agentsdk.KnowledgeLibraryCreate `json:"input"`
			Authority agentsdk.ConversationAuthority  `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.CreateKnowledgeLibrary(ctx, in.Input, in.Authority)
		return v, e, true
	case "service.datasource_access":
		var in struct {
			ID        string                         `json:"id"`
			Operation string                         `json:"operation"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.DatasourceAccess(ctx, in.ID, in.Operation, in.Authority)
		return v, e, true
	case "service.datasource_definitions":
		var in struct {
			Library   string                         `json:"library"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.DatasourceDefinitions(ctx, in.Library, in.Authority)
		return v, e, true
	case "service.document_delete":
		var in struct {
			Library   string                         `json:"library"`
			ID        string                         `json:"id"`
			Expected  int64                          `json:"expected"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.DeleteKnowledgeDocument(ctx, in.Library, in.ID, in.Expected, in.Authority)
		return v, e, true
	case "service.document_access":
		var in struct {
			Library   string                         `json:"library"`
			Operation string                         `json:"operation"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		_, e := s.DocumentAccess(ctx, in.Library, in.Operation, in.Authority)
		return struct{}{}, e, true
	case "service.document_binding":
		var in struct {
			Library   string                         `json:"library"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		source, e := s.DocumentBinding(ctx, in.Library, in.Authority)
		if e != nil {
			return nil, e, true
		}
		return server.registerSource(source, ""), nil, true
	case "service.document_download":
		var in struct {
			Library   string                         `json:"library"`
			ID        string                         `json:"id"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.DownloadKnowledgeDocument(ctx, in.Library, in.ID, in.Authority)
		return v, e, true
	case "service.document_import_attachment":
		var in struct {
			Library   string                             `json:"library"`
			Input     agentsdk.KnowledgeAttachmentImport `json:"input"`
			Authority agentsdk.ConversationAuthority     `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.ImportConversationAttachment(ctx, in.Library, in.Input, in.Authority)
		return v, e, true
	case "service.document":
		var in struct {
			Library   string                         `json:"library"`
			ID        string                         `json:"id"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.KnowledgeDocument(ctx, in.Library, in.ID, in.Authority)
		return v, e, true
	case "service.document_record":
		var in struct {
			Library   string                         `json:"library"`
			ID        string                         `json:"id"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		repo, ok := server.dependencies.Repository.(persistence.KnowledgeDocumentRepository)
		if !ok {
			return nil, &agentsdk.Error{Class: "unavailable", Code: "knowledge.documents_unavailable"}, true
		}
		v, e := s.KnowledgeDocumentRecord(ctx, repo, in.Library, in.ID, in.Authority)
		return v, e, true
	case "service.documents":
		var in struct {
			Library   string                         `json:"library"`
			After     string                         `json:"after"`
			Limit     int                            `json:"limit"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.KnowledgeDocuments(ctx, in.Library, in.After, in.Limit, in.Authority)
		return v, e, true
	case "service.libraries":
		var in struct {
			After     string                         `json:"after"`
			Limit     int                            `json:"limit"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.KnowledgeLibraries(ctx, in.After, in.Limit, in.Authority)
		return v, e, true
	case "service.library":
		var in struct {
			ID        string                         `json:"id"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.KnowledgeLibrary(ctx, in.ID, in.Authority)
		return v, e, true
	case "service.library_members":
		var in struct {
			ID        string                         `json:"id"`
			After     string                         `json:"after"`
			Limit     int                            `json:"limit"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.KnowledgeLibraryMembers(ctx, in.ID, in.After, in.Limit, in.Authority)
		return v, e, true
	case "service.library_sources":
		var in struct {
			ID        string                         `json:"id"`
			After     string                         `json:"after"`
			Limit     int                            `json:"limit"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.KnowledgeLibrarySources(ctx, in.ID, in.After, in.Limit, in.Authority)
		return v, e, true
	case "service.library_access":
		var in struct {
			Operation string                         `json:"operation"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		_, e := s.LibraryAccess(ctx, in.Operation, in.Authority)
		return struct{}{}, e, true
	case "service.library_authorize":
		var in struct {
			Operation string                         `json:"operation"`
			Item      agentsdk.KnowledgeLibrary      `json:"item"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		e := s.LibraryAuthorize(ctx, in.Operation, in.Item, in.Authority)
		return struct{}{}, e, true
	case "service.library_result":
		var in struct {
			Item      agentsdk.KnowledgeLibrary      `json:"item"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.LibraryResult(ctx, in.Item, nil, in.Authority)
		return v, e, true
	case "service.library_member_remove":
		var in struct {
			ID        string                         `json:"id"`
			User      string                         `json:"user"`
			Revision  int64                          `json:"revision"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.RemoveKnowledgeLibraryMember(ctx, in.ID, in.User, in.Revision, in.Authority)
		return v, e, true
	case "service.library_member_set":
		var in struct {
			ID        string                               `json:"id"`
			User      string                               `json:"user"`
			Input     agentsdk.KnowledgeLibraryMemberWrite `json:"input"`
			Authority agentsdk.ConversationAuthority       `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.SetKnowledgeLibraryMember(ctx, in.ID, in.User, in.Input, in.Authority)
		return v, e, true
	case "service.document_transfer":
		var in struct {
			Library   string                             `json:"library"`
			Input     agentsdk.KnowledgeDocumentTransfer `json:"input"`
			Authority agentsdk.ConversationAuthority     `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.TransferKnowledgeDocument(ctx, in.Library, in.Input, in.Authority)
		return v, e, true
	case "service.library_update":
		var in struct {
			ID        string                          `json:"id"`
			Input     agentsdk.KnowledgeLibraryUpdate `json:"input"`
			Authority agentsdk.ConversationAuthority  `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.UpdateKnowledgeLibrary(ctx, in.ID, in.Input, in.Authority)
		return v, e, true
	case "service.document_upload_content":
		var in struct {
			Library        string                                 `json:"library"`
			Input          agentsdk.KnowledgeDocumentUpload       `json:"input"`
			Origin         *persistence.KnowledgeAttachmentOrigin `json:"origin,omitempty"`
			DocumentOrigin *persistence.KnowledgeDocumentOrigin   `json:"document_origin,omitempty"`
			Authority      agentsdk.ConversationAuthority         `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.UploadDocumentContent(ctx, in.Library, in.Input, in.Origin, in.DocumentOrigin, nil, in.Authority)
		return v, e, true
	case "service.document_upload":
		var in struct {
			Library   string                           `json:"library"`
			Input     agentsdk.KnowledgeDocumentUpload `json:"input"`
			Authority agentsdk.ConversationAuthority   `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.UploadKnowledgeDocument(ctx, in.Library, in.Input, in.Authority)
		return v, e, true
	}
	return nil, nil, false
}
