package saas

import (
	"context"
	"encoding/json"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgecontract "github.com/domainry/domainry-knowledge-sdk/contract"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
)

func (server *Server) dispatchKnowledgeService(ctx context.Context, operation string, raw json.RawMessage) (any, error, bool) {
	s := server.dependencies.Knowledge
	switch operation {
	case knowledgesdk.ActionAIExecutionsCreate:
		var in struct {
			LibraryID string                                  `json:"library_id"`
			PageID    string                                  `json:"page_id"`
			Input     knowledgesdk.KnowledgeAIExecutionCreate `json:"input"`
			Authority agentsdk.Authority                      `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.CreateKnowledgeAIExecution(ctx, in.LibraryID, in.PageID, in.Input, in.Authority)
		return v, e, true
	case knowledgesdk.ActionAIExecutionsGet:
		var in struct {
			LibraryID   string             `json:"library_id"`
			PageID      string             `json:"page_id"`
			ExecutionID string             `json:"execution_id"`
			Authority   agentsdk.Authority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.KnowledgeAIExecution(ctx, in.LibraryID, in.PageID, in.ExecutionID, in.Authority)
		return v, e, true
	case knowledgesdk.ActionAIExecutionsConfirm:
		var in struct {
			LibraryID   string                                   `json:"library_id"`
			PageID      string                                   `json:"page_id"`
			ExecutionID string                                   `json:"execution_id"`
			Input       knowledgesdk.KnowledgeAIExecutionConfirm `json:"input"`
			Authority   agentsdk.Authority                       `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.ConfirmKnowledgeAIExecution(ctx, in.LibraryID, in.PageID, in.ExecutionID, in.Input, in.Authority)
		return v, e, true
	case knowledgesdk.ActionAgentReferencesResolve:
		var in struct {
			Reference knowledgesdk.KnowledgeAgentReference `json:"reference"`
			Authority agentsdk.Authority                   `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.ResolveKnowledgeAgentReference(ctx, in.Reference, in.Authority)
		return v, e, true
	case knowledgesdk.ActionApplicationCardsResolve:
		var in struct {
			LibraryID string                                       `json:"library_id"`
			PageID    string                                       `json:"page_id"`
			Input     knowledgesdk.KnowledgeApplicationCardResolve `json:"input"`
			Authority agentsdk.Authority                           `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.ResolveKnowledgeApplicationCard(ctx, in.LibraryID, in.PageID, in.Input, in.Authority)
		return v, e, true
	case knowledgesdk.ActionWebhookSubscriptionsList:
		var in struct {
			LibraryID string             `json:"library_id"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.KnowledgeWebhookSubscriptions(ctx, in.LibraryID, in.Authority)
		return v, e, true
	case knowledgesdk.ActionWebhookSubscriptionsCreate:
		var in struct {
			LibraryID string                                          `json:"library_id"`
			Input     knowledgesdk.KnowledgeWebhookSubscriptionCreate `json:"input"`
			Authority agentsdk.Authority                              `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.CreateKnowledgeWebhookSubscription(ctx, in.LibraryID, in.Input, in.Authority)
		return v, e, true
	case knowledgesdk.ActionWebhookSubscriptionsUpdate:
		var in struct {
			LibraryID      string                                          `json:"library_id"`
			SubscriptionID string                                          `json:"subscription_id"`
			Input          knowledgesdk.KnowledgeWebhookSubscriptionUpdate `json:"input"`
			Authority      agentsdk.Authority                              `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.UpdateKnowledgeWebhookSubscription(ctx, in.LibraryID, in.SubscriptionID, in.Input, in.Authority)
		return v, e, true
	case knowledgesdk.ActionWebhookEventsList:
		var in struct {
			LibraryID string             `json:"library_id"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.KnowledgeWebhookEvents(ctx, in.LibraryID, in.Authority)
		return v, e, true
	case knowledgesdk.ActionWebhookEventsReplay:
		var in struct {
			LibraryID string             `json:"library_id"`
			EventID   string             `json:"event_id"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.ReplayKnowledgeWebhookEvent(ctx, in.LibraryID, in.EventID, in.Authority)
		return v, e, true
	case knowledgesdk.ActionOpenAPIGet:
		var in struct {
			Authority agentsdk.Authority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		if e := s.LibraryAuthorize(ctx, knowledgesdk.ActionOpenAPIGet, agentsdk.KnowledgeLibrary{}, in.Authority); e != nil {
			return nil, e, true
		}
		v, e := knowledgesdk.KnowledgeOpenAPIDocument()
		return v, e, true
	case knowledgesdk.ActionSourcesBind:
		var in struct {
			ID        string                               `json:"id"`
			Input     agentsdk.KnowledgeLibrarySourceWrite `json:"input"`
			Authority agentsdk.Authority                   `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.BindKnowledgeLibrarySource(ctx, in.ID, in.Input, in.Authority)
		return v, e, true
	case knowledgesdk.ActionLibrariesCreate:
		var in struct {
			Input     agentsdk.KnowledgeLibraryCreate `json:"input"`
			Authority agentsdk.Authority              `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.CreateKnowledgeLibrary(ctx, in.Input, in.Authority)
		return v, e, true
	case "service.datasource_access":
		var in struct {
			ID        string             `json:"id"`
			Operation string             `json:"operation"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.DatasourceAccess(ctx, in.ID, in.Operation, in.Authority)
		return v, e, true
	case "service.datasource_definitions":
		var in struct {
			Library   string             `json:"library"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.DatasourceDefinitions(ctx, in.Library, in.Authority)
		return v, e, true
	case knowledgesdk.ActionDocumentsDelete:
		var in struct {
			Library   string             `json:"library"`
			ID        string             `json:"id"`
			Expected  int64              `json:"expected"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.DeleteKnowledgeDocument(ctx, in.Library, in.ID, in.Expected, in.Authority)
		return v, e, true
	case knowledgesdk.ActionDocumentsRetry:
		var in struct {
			Library   string             `json:"library"`
			ID        string             `json:"id"`
			Expected  int64              `json:"expected"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.RetryKnowledgeDocument(ctx, in.Library, in.ID, in.Expected, in.Authority)
		return v, e, true
	case knowledgesdk.ActionDocumentsReindex:
		var in struct {
			Library   string             `json:"library"`
			ID        string             `json:"id"`
			Expected  int64              `json:"expected"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.ReindexKnowledgeDocument(ctx, in.Library, in.ID, in.Expected, in.Authority)
		return v, e, true
	case "service.document_access":
		var in struct {
			Library   string             `json:"library"`
			Operation string             `json:"operation"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		_, e := s.DocumentAccess(ctx, in.Library, in.Operation, in.Authority)
		return struct{}{}, e, true
	case "service.document_binding":
		var in struct {
			Library   string             `json:"library"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		source, e := s.DocumentBinding(ctx, in.Library, in.Authority)
		if e != nil {
			return nil, e, true
		}
		return server.registerSource(source, nil, nil), nil, true
	case knowledgecontract.SaaSDocumentDownloadPrepareOperation:
		var in knowledgecontract.SaaSDocumentDownloadRequest
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		var v agentsdk.KnowledgeDocumentDownload
		var e error
		if in.PageID != "" {
			v, e = s.DownloadKnowledgePageDocument(ctx, in.Library, in.PageID, in.ID, in.Authority)
		} else {
			v, e = s.DownloadKnowledgeDocument(ctx, in.Library, in.ID, in.Authority)
		}
		if e != nil {
			return nil, e, true
		}
		if v.Content == nil {
			return nil, &agentsdk.Error{Class: "unavailable", Code: "knowledge.document_content_unavailable"}, true
		}
		_ = v.Content.Close()
		return v.Document, nil, true
	case knowledgesdk.ActionDocumentsGet:
		var in struct {
			Library   string             `json:"library"`
			ID        string             `json:"id"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.KnowledgeDocument(ctx, in.Library, in.ID, in.Authority)
		return v, e, true
	case "service.document_record":
		var in struct {
			Library   string             `json:"library"`
			ID        string             `json:"id"`
			Authority agentsdk.Authority `json:"authority"`
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
	case knowledgesdk.ActionDocumentsList:
		var in struct {
			Library   string             `json:"library"`
			After     string             `json:"after"`
			Limit     int                `json:"limit"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.KnowledgeDocuments(ctx, in.Library, in.After, in.Limit, in.Authority)
		return v, e, true
	case knowledgesdk.ActionLibrariesList:
		var in struct {
			After     string             `json:"after"`
			Limit     int                `json:"limit"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.KnowledgeLibraries(ctx, in.After, in.Limit, in.Authority)
		return v, e, true
	case knowledgesdk.ActionLibrariesGet:
		var in struct {
			ID        string             `json:"id"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.KnowledgeLibrary(ctx, in.ID, in.Authority)
		return v, e, true
	case knowledgesdk.ActionLibraryMembersList:
		var in struct {
			ID        string             `json:"id"`
			After     string             `json:"after"`
			Limit     int                `json:"limit"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.KnowledgeLibraryMembers(ctx, in.ID, in.After, in.Limit, in.Authority)
		return v, e, true
	case knowledgesdk.ActionLibraryOrganizationMembersList:
		var in struct {
			ID        string             `json:"id"`
			After     string             `json:"after"`
			Limit     int                `json:"limit"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.KnowledgeLibraryOrganizationMembers(ctx, in.ID, in.After, in.Limit, in.Authority)
		return v, e, true
	case knowledgesdk.ActionSourcesList:
		var in struct {
			ID        string             `json:"id"`
			After     string             `json:"after"`
			Limit     int                `json:"limit"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.KnowledgeLibrarySources(ctx, in.ID, in.After, in.Limit, in.Authority)
		return v, e, true
	case "service.library_access":
		var in struct {
			Operation string             `json:"operation"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		_, e := s.LibraryAccess(ctx, in.Operation, in.Authority)
		return struct{}{}, e, true
	case "service.library_authorize":
		var in struct {
			Operation string                    `json:"operation"`
			Item      agentsdk.KnowledgeLibrary `json:"item"`
			Authority agentsdk.Authority        `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		e := s.LibraryAuthorize(ctx, in.Operation, in.Item, in.Authority)
		return struct{}{}, e, true
	case "service.library_result":
		var in struct {
			Item      agentsdk.KnowledgeLibrary `json:"item"`
			Authority agentsdk.Authority        `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.LibraryResult(ctx, in.Item, nil, in.Authority)
		return v, e, true
	case knowledgesdk.ActionLibraryMembersRemove:
		var in struct {
			ID        string             `json:"id"`
			User      string             `json:"user"`
			Revision  int64              `json:"revision"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.RemoveKnowledgeLibraryMember(ctx, in.ID, in.User, in.Revision, in.Authority)
		return v, e, true
	case knowledgesdk.ActionLibraryMembersSet:
		var in struct {
			ID        string                               `json:"id"`
			User      string                               `json:"user"`
			Input     agentsdk.KnowledgeLibraryMemberWrite `json:"input"`
			Authority agentsdk.Authority                   `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.SetKnowledgeLibraryMember(ctx, in.ID, in.User, in.Input, in.Authority)
		return v, e, true
	case knowledgesdk.ActionLibraryOrganizationMembersRemove:
		var in struct {
			ID             string             `json:"id"`
			OrganizationID string             `json:"organization_id"`
			Revision       int64              `json:"revision"`
			Authority      agentsdk.Authority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.RemoveKnowledgeLibraryOrganizationMember(ctx, in.ID, in.OrganizationID, in.Revision, in.Authority)
		return v, e, true
	case knowledgesdk.ActionLibraryOrganizationMembersSet:
		var in struct {
			ID             string                               `json:"id"`
			OrganizationID string                               `json:"organization_id"`
			Input          agentsdk.KnowledgeLibraryMemberWrite `json:"input"`
			Authority      agentsdk.Authority                   `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.SetKnowledgeLibraryOrganizationMember(ctx, in.ID, in.OrganizationID, in.Input, in.Authority)
		return v, e, true
	case knowledgesdk.ActionDocumentsTransfer:
		var in struct {
			Library   string                             `json:"library"`
			Input     agentsdk.KnowledgeDocumentTransfer `json:"input"`
			Authority agentsdk.Authority                 `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.TransferKnowledgeDocument(ctx, in.Library, in.Input, in.Authority)
		return v, e, true
	case knowledgesdk.ActionLibrariesUpdate:
		var in struct {
			ID        string                          `json:"id"`
			Input     agentsdk.KnowledgeLibraryUpdate `json:"input"`
			Authority agentsdk.Authority              `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		v, e := s.UpdateKnowledgeLibrary(ctx, in.ID, in.Input, in.Authority)
		return v, e, true
	case knowledgecontract.SaaSDocumentUploadPrepareOperation:
		var kind struct {
			Operation string `json:"operation"`
		}
		if json.Unmarshal(raw, &kind) != nil {
			return nil, &agentsdk.Error{Class: "bad_request", Code: "knowledge.document_upload_operation_invalid"}, true
		}
		if kind.Operation == knowledgecontract.SaaSDocumentUploadChunkOperation {
			var in knowledgecontract.SaaSDocumentChunkUploadRequest
			if e := decodeInput(raw, &in); e != nil {
				return nil, e, true
			}
			if _, e := s.DocumentAccess(ctx, in.Library, knowledgesdk.ActionDocumentsUpload, in.Authority); e != nil {
				return nil, e, true
			}
			_, e := s.DocumentBinding(ctx, in.Library, in.Authority)
			return struct{}{}, e, true
		}
		var in knowledgecontract.SaaSDocumentUploadRequest
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		if in.Operation != knowledgecontract.SaaSDocumentUploadOperation && in.Operation != knowledgecontract.SaaSDocumentUploadSourceOperation {
			return nil, &agentsdk.Error{Class: "bad_request", Code: "knowledge.document_upload_operation_invalid"}, true
		}
		if (in.Operation == knowledgecontract.SaaSDocumentUploadSourceOperation) != (in.Source != nil) {
			return nil, &agentsdk.Error{Class: "bad_request", Code: "knowledge.document_source_invalid"}, true
		}
		if _, e := s.DocumentAccess(ctx, in.Library, knowledgesdk.ActionDocumentsUpload, in.Authority); e != nil {
			return nil, e, true
		}
		if in.Source != nil {
			e := challengeFor(ctx, "authorize.document_source", struct {
				Source    agentsdk.KnowledgeDocumentSourceAccess `json:"source"`
				Authority agentsdk.Authority                     `json:"authority"`
			}{*in.Source, in.Authority}, nil)
			if e != nil {
				return nil, e, true
			}
		}
		_, e := s.DocumentBinding(ctx, in.Library, in.Authority)
		return struct{}{}, e, true
	}
	return nil, nil, false
}
