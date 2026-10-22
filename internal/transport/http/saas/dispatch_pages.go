package saas

import (
	"context"
	"encoding/json"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func (server *Server) dispatchPageService(ctx context.Context, operation string, raw json.RawMessage) (any, error, bool) {
	service := server.dependencies.Knowledge
	switch operation {
	case knowledgesdk.ActionPageSearchEvents:
		var input struct {
			LibraryID string                                 `json:"library_id"`
			Input     knowledgesdk.KnowledgePageSearchEvents `json:"input"`
			Authority agentsdk.Authority                     `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.KnowledgePageSearchEvents(ctx, input.LibraryID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageSearch:
		var input struct {
			LibraryID string                                `json:"library_id"`
			Input     knowledgesdk.KnowledgePageSearchInput `json:"input"`
			Authority agentsdk.Authority                    `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.SearchKnowledgePages(ctx, input.LibraryID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPagesList:
		var input struct {
			LibraryID       string             `json:"library_id"`
			ParentID        string             `json:"parent_id"`
			After           string             `json:"after"`
			Limit           int                `json:"limit"`
			IncludeArchived bool               `json:"include_archived"`
			Authority       agentsdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.KnowledgePages(ctx, input.LibraryID, input.ParentID, input.After, input.Limit, input.IncludeArchived, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPagesGet:
		var input struct {
			LibraryID    string             `json:"library_id"`
			PageID       string             `json:"page_id"`
			IncludeDraft bool               `json:"include_draft"`
			Authority    agentsdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.KnowledgePage(ctx, input.LibraryID, input.PageID, input.IncludeDraft, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPagePersonalStateGet:
		var input struct {
			LibraryID string             `json:"library_id"`
			PageID    string             `json:"page_id"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.KnowledgePagePersonalState(ctx, input.LibraryID, input.PageID, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPagePersonalStateSet:
		var input struct {
			LibraryID string                                       `json:"library_id"`
			PageID    string                                       `json:"page_id"`
			Input     knowledgesdk.KnowledgePagePersonalStateWrite `json:"input"`
			Authority agentsdk.Authority                           `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.SetKnowledgePagePersonalState(ctx, input.LibraryID, input.PageID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageViewRecord:
		var input struct {
			LibraryID string                               `json:"library_id"`
			PageID    string                               `json:"page_id"`
			Input     knowledgesdk.KnowledgePageViewRecord `json:"input"`
			Authority agentsdk.Authority                   `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.RecordKnowledgePageView(ctx, input.LibraryID, input.PageID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageCollectionsList:
		var input struct {
			LibraryID string                                   `json:"library_id"`
			Kind      knowledgesdk.KnowledgePageCollectionKind `json:"kind"`
			After     string                                   `json:"after"`
			Limit     int                                      `json:"limit"`
			Authority agentsdk.Authority                       `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.KnowledgePageCollection(ctx, input.LibraryID, input.Kind, input.After, input.Limit, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageMetadataGet:
		var input struct {
			LibraryID string             `json:"library_id"`
			PageID    string             `json:"page_id"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.KnowledgePageMetadata(ctx, input.LibraryID, input.PageID, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageMetadataSet:
		var input struct {
			LibraryID string                                  `json:"library_id"`
			PageID    string                                  `json:"page_id"`
			Input     knowledgesdk.KnowledgePageMetadataWrite `json:"input"`
			Authority agentsdk.Authority                      `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.SetKnowledgePageMetadata(ctx, input.LibraryID, input.PageID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageGovernanceSet:
		var input struct {
			LibraryID string                                    `json:"library_id"`
			PageID    string                                    `json:"page_id"`
			Input     knowledgesdk.KnowledgePageGovernanceWrite `json:"input"`
			Authority agentsdk.Authority                        `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.SetKnowledgePageGovernance(ctx, input.LibraryID, input.PageID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageGovernanceReview:
		var input struct {
			LibraryID string                                     `json:"library_id"`
			PageID    string                                     `json:"page_id"`
			Input     knowledgesdk.KnowledgePageGovernanceReview `json:"input"`
			Authority agentsdk.Authority                         `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.ReviewKnowledgePageGovernance(ctx, input.LibraryID, input.PageID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageGovernanceAuditList:
		var input struct {
			Input     knowledgesdk.KnowledgeGovernanceAuditQuery `json:"input"`
			Authority agentsdk.Authority                         `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.KnowledgePageGovernanceAudit(ctx, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageIdentitiesSearch:
		var input struct {
			LibraryID string             `json:"library_id"`
			Query     string             `json:"query"`
			Limit     int                `json:"limit"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.SearchKnowledgePageIdentities(ctx, input.LibraryID, input.Query, input.Limit, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageRelationshipGraphGet:
		var input struct {
			LibraryID string             `json:"library_id"`
			PageID    string             `json:"page_id"`
			Depth     int                `json:"depth"`
			Limit     int                `json:"limit"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.KnowledgePageRelationshipGraph(ctx, input.LibraryID, input.PageID, input.Depth, input.Limit, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPagesCreate:
		var input struct {
			LibraryID string                           `json:"library_id"`
			Input     knowledgesdk.KnowledgePageCreate `json:"input"`
			Authority agentsdk.Authority               `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.CreateKnowledgePage(ctx, input.LibraryID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageReferencesList:
		var input struct {
			LibraryID string                                       `json:"library_id"`
			PageID    string                                       `json:"page_id"`
			Direction knowledgesdk.KnowledgePageReferenceDirection `json:"direction"`
			After     string                                       `json:"after"`
			Limit     int                                          `json:"limit"`
			Authority agentsdk.Authority                           `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.KnowledgePageReferences(ctx, input.LibraryID, input.PageID, input.Direction, input.After, input.Limit, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageReferencesCreate:
		var input struct {
			LibraryID string                                    `json:"library_id"`
			PageID    string                                    `json:"page_id"`
			Input     knowledgesdk.KnowledgePageReferenceCreate `json:"input"`
			Authority agentsdk.Authority                        `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.CreateKnowledgePageReference(ctx, input.LibraryID, input.PageID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPagesUpdate:
		var input struct {
			LibraryID string                               `json:"library_id"`
			PageID    string                               `json:"page_id"`
			Input     knowledgesdk.KnowledgePageDraftWrite `json:"input"`
			Authority agentsdk.Authority                   `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.SaveKnowledgePageDraft(ctx, input.LibraryID, input.PageID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPagesMove:
		var input struct {
			LibraryID string                         `json:"library_id"`
			PageID    string                         `json:"page_id"`
			Input     knowledgesdk.KnowledgePageMove `json:"input"`
			Authority agentsdk.Authority             `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.MoveKnowledgePage(ctx, input.LibraryID, input.PageID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPagesMovePreview:
		var input struct {
			LibraryID string                                `json:"library_id"`
			PageID    string                                `json:"page_id"`
			Input     knowledgesdk.KnowledgePageMovePreview `json:"input"`
			Authority agentsdk.Authority                    `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.PreviewKnowledgePageMove(ctx, input.LibraryID, input.PageID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPagesReorder:
		var input struct {
			LibraryID string                            `json:"library_id"`
			Input     knowledgesdk.KnowledgePageReorder `json:"input"`
			Authority agentsdk.Authority                `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.ReorderKnowledgePages(ctx, input.LibraryID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPagesCopy:
		var input struct {
			LibraryID string                         `json:"library_id"`
			PageID    string                         `json:"page_id"`
			Input     knowledgesdk.KnowledgePageCopy `json:"input"`
			Authority agentsdk.Authority             `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.CopyKnowledgePage(ctx, input.LibraryID, input.PageID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPagesArchive, knowledgesdk.ActionPagesRestore:
		var input struct {
			LibraryID string                               `json:"library_id"`
			PageID    string                               `json:"page_id"`
			Input     knowledgesdk.KnowledgePageStateWrite `json:"input"`
			Authority agentsdk.Authority                   `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.SetKnowledgePageArchived(ctx, input.LibraryID, input.PageID, operation == knowledgesdk.ActionPagesArchive, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPagesPublish:
		var input struct {
			LibraryID string                            `json:"library_id"`
			PageID    string                            `json:"page_id"`
			Input     knowledgesdk.KnowledgePagePublish `json:"input"`
			Authority agentsdk.Authority                `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.PublishKnowledgePage(ctx, input.LibraryID, input.PageID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageAccessGet:
		var input struct {
			LibraryID string             `json:"library_id"`
			PageID    string             `json:"page_id"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.KnowledgePageAccess(ctx, input.LibraryID, input.PageID, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageAccessSet:
		var input struct {
			LibraryID string                                `json:"library_id"`
			PageID    string                                `json:"page_id"`
			Input     knowledgesdk.KnowledgePageAccessWrite `json:"input"`
			Authority agentsdk.Authority                    `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.SetKnowledgePageAccess(ctx, input.LibraryID, input.PageID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageContentPolicyGet:
		var input struct {
			LibraryID string             `json:"library_id"`
			PageID    string             `json:"page_id"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.KnowledgePageContentPolicy(ctx, input.LibraryID, input.PageID, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageContentPolicySet:
		var input struct {
			LibraryID string                                       `json:"library_id"`
			PageID    string                                       `json:"page_id"`
			Input     knowledgesdk.KnowledgePageContentPolicyWrite `json:"input"`
			Authority agentsdk.Authority                           `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.SetKnowledgePageContentPolicy(ctx, input.LibraryID, input.PageID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageContentCopy, knowledgesdk.ActionPagePrint, knowledgesdk.ActionPageExport, knowledgesdk.ActionPageDuplicate:
		var input struct {
			LibraryID string             `json:"library_id"`
			PageID    string             `json:"page_id"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		operationName := knowledgesdk.KnowledgePageContentOperationCopy
		if operation == knowledgesdk.ActionPagePrint {
			operationName = knowledgesdk.KnowledgePageContentOperationPrint
		} else if operation == knowledgesdk.ActionPageExport {
			operationName = knowledgesdk.KnowledgePageContentOperationExport
		} else if operation == knowledgesdk.ActionPageDuplicate {
			operationName = knowledgesdk.KnowledgePageContentOperationDuplicate
		}
		value, err := service.AuthorizeKnowledgePageContentOperation(ctx, input.LibraryID, input.PageID, operationName, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageDownload:
		var input struct {
			LibraryID  string             `json:"library_id"`
			PageID     string             `json:"page_id"`
			DocumentID string             `json:"document_id"`
			Authority  agentsdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.DownloadKnowledgePageDocument(ctx, input.LibraryID, input.PageID, input.DocumentID, input.Authority)
		if err != nil {
			return nil, err, true
		}
		if value.Content == nil {
			return nil, &agentsdk.Error{Class: "unavailable", Code: "knowledge.document_content_unavailable"}, true
		}
		_ = value.Content.Close()
		return value.Document, nil, true
	case knowledgesdk.ActionPageSharesList:
		var input struct {
			LibraryID string             `json:"library_id"`
			PageID    string             `json:"page_id"`
			After     string             `json:"after"`
			Limit     int                `json:"limit"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.KnowledgePageShares(ctx, input.LibraryID, input.PageID, input.After, input.Limit, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageSharesCreate:
		var input struct {
			LibraryID string                                `json:"library_id"`
			PageID    string                                `json:"page_id"`
			Input     knowledgesdk.KnowledgePageShareCreate `json:"input"`
			Authority agentsdk.Authority                    `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.CreateKnowledgePageShare(ctx, input.LibraryID, input.PageID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageSharesRevoke:
		var input struct {
			LibraryID        string             `json:"library_id"`
			PageID           string             `json:"page_id"`
			ShareID          string             `json:"share_id"`
			ExpectedRevision int64              `json:"expected_revision"`
			Authority        agentsdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.RevokeKnowledgePageShare(ctx, input.LibraryID, input.PageID, input.ShareID, input.ExpectedRevision, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageSharesRedeem:
		var input struct {
			ShareID   string                                `json:"share_id"`
			Input     knowledgesdk.KnowledgePageShareRedeem `json:"input"`
			Authority agentsdk.Authority                    `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.RedeemKnowledgePageShare(ctx, input.ShareID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageSharesRead:
		var input struct {
			ShareID   string             `json:"share_id"`
			PageID    string             `json:"page_id"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.ReadKnowledgePageShare(ctx, input.ShareID, input.PageID, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageShareContentCopy, knowledgesdk.ActionPageShareContentPrint, knowledgesdk.ActionPageShareContentExport:
		var input struct {
			ShareID   string             `json:"share_id"`
			PageID    string             `json:"page_id"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		operationName := knowledgesdk.KnowledgePageContentOperationCopy
		if operation == knowledgesdk.ActionPageShareContentPrint {
			operationName = knowledgesdk.KnowledgePageContentOperationPrint
		} else if operation == knowledgesdk.ActionPageShareContentExport {
			operationName = knowledgesdk.KnowledgePageContentOperationExport
		}
		value, err := service.AuthorizeKnowledgePageShareContentOperation(ctx, input.ShareID, input.PageID, operationName, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageCollaborationConnect:
		var input struct {
			LibraryID string                                     `json:"library_id"`
			PageID    string                                     `json:"page_id"`
			Input     knowledgesdk.KnowledgeCollaborationConnect `json:"input"`
			Authority agentsdk.Authority                         `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.ConnectKnowledgeCollaboration(ctx, input.LibraryID, input.PageID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageCollaborationSync:
		var input struct {
			LibraryID string                                  `json:"library_id"`
			PageID    string                                  `json:"page_id"`
			Input     knowledgesdk.KnowledgeCollaborationSync `json:"input"`
			Authority agentsdk.Authority                      `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.SyncKnowledgeCollaboration(ctx, input.LibraryID, input.PageID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageCollaborationEvents:
		var input struct {
			LibraryID string                                    `json:"library_id"`
			PageID    string                                    `json:"page_id"`
			Input     knowledgesdk.KnowledgeCollaborationEvents `json:"input"`
			Authority agentsdk.Authority                        `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.KnowledgeCollaborationEvents(ctx, input.LibraryID, input.PageID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageLiveEvents:
		var input struct {
			LibraryID string                               `json:"library_id"`
			PageID    string                               `json:"page_id"`
			Input     knowledgesdk.KnowledgePageLiveEvents `json:"input"`
			Authority agentsdk.Authority                   `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.KnowledgePageLiveEvents(ctx, input.LibraryID, input.PageID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageCollaborationClose:
		var input struct {
			LibraryID string             `json:"library_id"`
			PageID    string             `json:"page_id"`
			SessionID string             `json:"session_id"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		err := service.CloseKnowledgeCollaboration(ctx, input.LibraryID, input.PageID, input.SessionID, input.Authority)
		return struct{}{}, err, true
	case knowledgesdk.ActionPageCollaborationPublish:
		var input struct {
			LibraryID string                                     `json:"library_id"`
			PageID    string                                     `json:"page_id"`
			Input     knowledgesdk.KnowledgeCollaborationPublish `json:"input"`
			Authority agentsdk.Authority                         `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.PublishKnowledgeCollaboration(ctx, input.LibraryID, input.PageID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageVersionsList:
		var input struct {
			LibraryID string             `json:"library_id"`
			PageID    string             `json:"page_id"`
			Before    int64              `json:"before"`
			Limit     int                `json:"limit"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.KnowledgePageVersions(ctx, input.LibraryID, input.PageID, input.Before, input.Limit, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageVersionsGet:
		var input struct {
			LibraryID string             `json:"library_id"`
			PageID    string             `json:"page_id"`
			Version   int64              `json:"version"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.KnowledgePageVersion(ctx, input.LibraryID, input.PageID, input.Version, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageEditHistoryList:
		var input struct {
			LibraryID string             `json:"library_id"`
			PageID    string             `json:"page_id"`
			Before    int64              `json:"before"`
			Limit     int                `json:"limit"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.KnowledgePageEditHistory(ctx, input.LibraryID, input.PageID, input.Before, input.Limit, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageSuggestionsList:
		var input struct {
			LibraryID string             `json:"library_id"`
			PageID    string             `json:"page_id"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.KnowledgePageSuggestions(ctx, input.LibraryID, input.PageID, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageNativeOperationsApply:
		var input struct {
			LibraryID string                                         `json:"library_id"`
			PageID    string                                         `json:"page_id"`
			Input     knowledgesdk.KnowledgePageNativeOperationBatch `json:"input"`
			Authority agentsdk.Authority                             `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.ApplyKnowledgePageNativeOperations(ctx, input.LibraryID, input.PageID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageGridAutomationExecute:
		var input struct {
			LibraryID string                                      `json:"library_id"`
			PageID    string                                      `json:"page_id"`
			Input     knowledgesdk.KnowledgeGridAutomationExecute `json:"input"`
			Authority agentsdk.Authority                          `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.ExecuteKnowledgeGridAutomation(ctx, input.LibraryID, input.PageID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageSuggestionsCreate:
		var input struct {
			LibraryID string                                     `json:"library_id"`
			PageID    string                                     `json:"page_id"`
			Input     knowledgesdk.KnowledgePageSuggestionCreate `json:"input"`
			Authority agentsdk.Authority                         `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.CreateKnowledgePageSuggestion(ctx, input.LibraryID, input.PageID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageSuggestionsDecide:
		var input struct {
			LibraryID    string                                       `json:"library_id"`
			PageID       string                                       `json:"page_id"`
			SuggestionID string                                       `json:"suggestion_id"`
			Input        knowledgesdk.KnowledgePageSuggestionDecision `json:"input"`
			Authority    agentsdk.Authority                           `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.DecideKnowledgePageSuggestion(ctx, input.LibraryID, input.PageID, input.SuggestionID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageVersionsDiff:
		var input struct {
			LibraryID string                                     `json:"library_id"`
			PageID    string                                     `json:"page_id"`
			Input     knowledgesdk.KnowledgePageVersionDiffInput `json:"input"`
			Authority agentsdk.Authority                         `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.DiffKnowledgePageVersions(ctx, input.LibraryID, input.PageID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageVersionsRestore:
		var input struct {
			LibraryID string                                   `json:"library_id"`
			PageID    string                                   `json:"page_id"`
			Version   int64                                    `json:"version"`
			Input     knowledgesdk.KnowledgePageRestoreVersion `json:"input"`
			Authority agentsdk.Authority                       `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.RestoreKnowledgePageVersion(ctx, input.LibraryID, input.PageID, input.Version, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageCommentsList:
		var input struct {
			LibraryID      string             `json:"library_id"`
			PageID         string             `json:"page_id"`
			After          string             `json:"after"`
			Limit          int                `json:"limit"`
			UnresolvedOnly bool               `json:"unresolved_only"`
			Authority      agentsdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.KnowledgePageComments(ctx, input.LibraryID, input.PageID, input.After, input.Limit, input.UnresolvedOnly, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageCommentsCreate:
		var input struct {
			LibraryID string                                  `json:"library_id"`
			PageID    string                                  `json:"page_id"`
			Input     knowledgesdk.KnowledgePageCommentCreate `json:"input"`
			Authority agentsdk.Authority                      `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.CreateKnowledgePageComment(ctx, input.LibraryID, input.PageID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageCommentsUpdate:
		var input struct {
			LibraryID string                                  `json:"library_id"`
			PageID    string                                  `json:"page_id"`
			CommentID string                                  `json:"comment_id"`
			Input     knowledgesdk.KnowledgePageCommentUpdate `json:"input"`
			Authority agentsdk.Authority                      `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.UpdateKnowledgePageComment(ctx, input.LibraryID, input.PageID, input.CommentID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageCommentsResolve:
		var input struct {
			LibraryID string                                   `json:"library_id"`
			PageID    string                                   `json:"page_id"`
			CommentID string                                   `json:"comment_id"`
			Input     knowledgesdk.KnowledgePageCommentResolve `json:"input"`
			Authority agentsdk.Authority                       `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.ResolveKnowledgePageComment(ctx, input.LibraryID, input.PageID, input.CommentID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageCommentsDelete:
		var input struct {
			LibraryID string                                  `json:"library_id"`
			PageID    string                                  `json:"page_id"`
			CommentID string                                  `json:"comment_id"`
			Input     knowledgesdk.KnowledgePageCommentDelete `json:"input"`
			Authority agentsdk.Authority                      `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.DeleteKnowledgePageComment(ctx, input.LibraryID, input.PageID, input.CommentID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageCommentsReact:
		var input struct {
			LibraryID string                                         `json:"library_id"`
			PageID    string                                         `json:"page_id"`
			CommentID string                                         `json:"comment_id"`
			Input     knowledgesdk.KnowledgePageCommentReactionWrite `json:"input"`
			Authority agentsdk.Authority                             `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.SetKnowledgePageCommentReaction(ctx, input.LibraryID, input.PageID, input.CommentID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageAttachmentsList:
		var input struct {
			LibraryID string             `json:"library_id"`
			PageID    string             `json:"page_id"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.KnowledgePageAttachments(ctx, input.LibraryID, input.PageID, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageAttachmentsSet:
		var input struct {
			LibraryID  string                                    `json:"library_id"`
			PageID     string                                    `json:"page_id"`
			DocumentID string                                    `json:"document_id"`
			Input      knowledgesdk.KnowledgePageAttachmentWrite `json:"input"`
			Authority  agentsdk.Authority                        `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.SetKnowledgePageAttachment(ctx, input.LibraryID, input.PageID, input.DocumentID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageAttachmentsRemove:
		var input struct {
			LibraryID  string                                     `json:"library_id"`
			PageID     string                                     `json:"page_id"`
			DocumentID string                                     `json:"document_id"`
			Input      knowledgesdk.KnowledgePageAttachmentRemove `json:"input"`
			Authority  agentsdk.Authority                         `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		err := service.RemoveKnowledgePageAttachment(ctx, input.LibraryID, input.PageID, input.DocumentID, input.Input, input.Authority)
		return struct{}{}, err, true
	case knowledgesdk.ActionPageTasksList:
		var input struct {
			LibraryID string             `json:"library_id"`
			PageID    string             `json:"page_id"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.KnowledgePageTasks(ctx, input.LibraryID, input.PageID, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageTasksCreate:
		var input struct {
			LibraryID string                               `json:"library_id"`
			PageID    string                               `json:"page_id"`
			Input     knowledgesdk.KnowledgePageTaskCreate `json:"input"`
			Authority agentsdk.Authority                   `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.CreateKnowledgePageTask(ctx, input.LibraryID, input.PageID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageTasksUpdate:
		var input struct {
			LibraryID string                               `json:"library_id"`
			PageID    string                               `json:"page_id"`
			TaskID    string                               `json:"task_id"`
			Input     knowledgesdk.KnowledgePageTaskUpdate `json:"input"`
			Authority agentsdk.Authority                   `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.UpdateKnowledgePageTask(ctx, input.LibraryID, input.PageID, input.TaskID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPagePollsList:
		var input struct {
			LibraryID string             `json:"library_id"`
			PageID    string             `json:"page_id"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.KnowledgePagePolls(ctx, input.LibraryID, input.PageID, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPagePollsCreate:
		var input struct {
			LibraryID string                               `json:"library_id"`
			PageID    string                               `json:"page_id"`
			Input     knowledgesdk.KnowledgePagePollCreate `json:"input"`
			Authority agentsdk.Authority                   `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.CreateKnowledgePagePoll(ctx, input.LibraryID, input.PageID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPagePollsUpdate:
		var input struct {
			LibraryID string                               `json:"library_id"`
			PageID    string                               `json:"page_id"`
			PollID    string                               `json:"poll_id"`
			Input     knowledgesdk.KnowledgePagePollUpdate `json:"input"`
			Authority agentsdk.Authority                   `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.UpdateKnowledgePagePoll(ctx, input.LibraryID, input.PageID, input.PollID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPagePollsVote:
		var input struct {
			LibraryID string                             `json:"library_id"`
			PageID    string                             `json:"page_id"`
			PollID    string                             `json:"poll_id"`
			Input     knowledgesdk.KnowledgePagePollVote `json:"input"`
			Authority agentsdk.Authority                 `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.VoteKnowledgePagePoll(ctx, input.LibraryID, input.PageID, input.PollID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageFormSubmit:
		var input struct {
			LibraryID string                           `json:"library_id"`
			PageID    string                           `json:"page_id"`
			Input     knowledgesdk.KnowledgeFormSubmit `json:"input"`
			Authority agentsdk.Authority               `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.SubmitKnowledgePageForm(ctx, input.LibraryID, input.PageID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageFormResponsesList:
		var input struct {
			LibraryID string             `json:"library_id"`
			PageID    string             `json:"page_id"`
			Before    string             `json:"before"`
			Limit     int                `json:"limit"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.KnowledgePageFormSubmissions(ctx, input.LibraryID, input.PageID, input.Before, input.Limit, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageFormAnalyticsGet:
		var input struct {
			LibraryID string             `json:"library_id"`
			PageID    string             `json:"page_id"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.KnowledgePageFormAnalytics(ctx, input.LibraryID, input.PageID, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageFormResponsesExport:
		var input struct {
			LibraryID string             `json:"library_id"`
			PageID    string             `json:"page_id"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.ExportKnowledgePageFormSubmissions(ctx, input.LibraryID, input.PageID, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageTemplatesList:
		var input struct {
			LibraryID string             `json:"library_id"`
			After     string             `json:"after"`
			Limit     int                `json:"limit"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.KnowledgePageTemplates(ctx, input.LibraryID, input.After, input.Limit, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageTemplatesCreate:
		var input struct {
			LibraryID string                                   `json:"library_id"`
			Input     knowledgesdk.KnowledgePageTemplateCreate `json:"input"`
			Authority agentsdk.Authority                       `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.CreateKnowledgePageTemplate(ctx, input.LibraryID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageTemplatesUpdate:
		var input struct {
			LibraryID  string                                   `json:"library_id"`
			TemplateID string                                   `json:"template_id"`
			Input      knowledgesdk.KnowledgePageTemplateUpdate `json:"input"`
			Authority  agentsdk.Authority                       `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.UpdateKnowledgePageTemplate(ctx, input.LibraryID, input.TemplateID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageTemplateVersionsList:
		var input struct {
			LibraryID  string             `json:"library_id"`
			TemplateID string             `json:"template_id"`
			Before     int64              `json:"before"`
			Limit      int                `json:"limit"`
			Authority  agentsdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.KnowledgePageTemplateVersions(ctx, input.LibraryID, input.TemplateID, input.Before, input.Limit, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageTemplateVersionsGet:
		var input struct {
			LibraryID  string             `json:"library_id"`
			TemplateID string             `json:"template_id"`
			Version    int64              `json:"version"`
			Authority  agentsdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.KnowledgePageTemplateVersion(ctx, input.LibraryID, input.TemplateID, input.Version, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageTemplatesInstantiate:
		var input struct {
			LibraryID  string                                        `json:"library_id"`
			TemplateID string                                        `json:"template_id"`
			Input      knowledgesdk.KnowledgePageTemplateInstantiate `json:"input"`
			Authority  agentsdk.Authority                            `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.InstantiateKnowledgePageTemplate(ctx, input.LibraryID, input.TemplateID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPrincipalsSearch:
		var input struct {
			Query     string             `json:"query"`
			After     string             `json:"after"`
			Limit     int                `json:"limit"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.SearchKnowledgePrincipals(ctx, input.Query, input.After, input.Limit, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPrincipalsResolve:
		var input struct {
			UserIDs   []string           `json:"user_ids"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.ResolveKnowledgePrincipals(ctx, input.UserIDs, input.Authority)
		return value, err, true
	case knowledgesdk.ActionOrganizationPrincipalsResolve:
		var input struct {
			OrganizationIDs []string           `json:"organization_ids"`
			Authority       agentsdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.ResolveKnowledgeOrganizationPrincipals(ctx, input.OrganizationIDs, input.Authority)
		return value, err, true
	case knowledgesdk.ActionLibraryMembersSearch:
		var input struct {
			LibraryID string             `json:"library_id"`
			Query     string             `json:"query"`
			After     string             `json:"after"`
			Limit     int                `json:"limit"`
			Authority agentsdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.SearchKnowledgeLibraryMembers(ctx, input.LibraryID, input.Query, input.After, input.Limit, input.Authority)
		return value, err, true
	case knowledgesdk.ActionAccessExplain:
		var input struct {
			LibraryID string                                     `json:"library_id"`
			Input     knowledgesdk.KnowledgeAccessExplainRequest `json:"input"`
			Authority agentsdk.Authority                         `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.ExplainKnowledgeAccess(ctx, input.LibraryID, input.Input, input.Authority)
		return value, err, true
	default:
		return nil, nil, false
	}
}
