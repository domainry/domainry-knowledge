package saas

import (
	"context"
	"encoding/json"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func (server *Server) dispatchPageService(ctx context.Context, operation string, raw json.RawMessage) (any, error, bool) {
	service := server.dependencies.Knowledge
	switch operation {
	case knowledgesdk.ActionPagesList:
		var input struct {
			LibraryID       string                         `json:"library_id"`
			ParentID        string                         `json:"parent_id"`
			After           string                         `json:"after"`
			Limit           int                            `json:"limit"`
			IncludeArchived bool                           `json:"include_archived"`
			Authority       agentsdk.ConversationAuthority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.KnowledgePages(ctx, input.LibraryID, input.ParentID, input.After, input.Limit, input.IncludeArchived, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPagesGet:
		var input struct {
			LibraryID    string                         `json:"library_id"`
			PageID       string                         `json:"page_id"`
			IncludeDraft bool                           `json:"include_draft"`
			Authority    agentsdk.ConversationAuthority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.KnowledgePage(ctx, input.LibraryID, input.PageID, input.IncludeDraft, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPagesCreate:
		var input struct {
			LibraryID string                           `json:"library_id"`
			Input     knowledgesdk.KnowledgePageCreate `json:"input"`
			Authority agentsdk.ConversationAuthority   `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.CreateKnowledgePage(ctx, input.LibraryID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPagesUpdate:
		var input struct {
			LibraryID string                               `json:"library_id"`
			PageID    string                               `json:"page_id"`
			Input     knowledgesdk.KnowledgePageDraftWrite `json:"input"`
			Authority agentsdk.ConversationAuthority       `json:"authority"`
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
			Authority agentsdk.ConversationAuthority `json:"authority"`
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
			Authority agentsdk.ConversationAuthority        `json:"authority"`
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
			Authority agentsdk.ConversationAuthority    `json:"authority"`
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
			Authority agentsdk.ConversationAuthority `json:"authority"`
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
			Authority agentsdk.ConversationAuthority       `json:"authority"`
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
			Authority agentsdk.ConversationAuthority    `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.PublishKnowledgePage(ctx, input.LibraryID, input.PageID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageAccessGet:
		var input struct {
			LibraryID string                         `json:"library_id"`
			PageID    string                         `json:"page_id"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
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
			Authority agentsdk.ConversationAuthority        `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.SetKnowledgePageAccess(ctx, input.LibraryID, input.PageID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageCollaborationConnect:
		var input struct {
			LibraryID string                                     `json:"library_id"`
			PageID    string                                     `json:"page_id"`
			Input     knowledgesdk.KnowledgeCollaborationConnect `json:"input"`
			Authority agentsdk.ConversationAuthority             `json:"authority"`
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
			Authority agentsdk.ConversationAuthority          `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.SyncKnowledgeCollaboration(ctx, input.LibraryID, input.PageID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageCollaborationClose:
		var input struct {
			LibraryID string                         `json:"library_id"`
			PageID    string                         `json:"page_id"`
			SessionID string                         `json:"session_id"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
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
			Authority agentsdk.ConversationAuthority             `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.PublishKnowledgeCollaboration(ctx, input.LibraryID, input.PageID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageVersionsList:
		var input struct {
			LibraryID string                         `json:"library_id"`
			PageID    string                         `json:"page_id"`
			Before    int64                          `json:"before"`
			Limit     int                            `json:"limit"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.KnowledgePageVersions(ctx, input.LibraryID, input.PageID, input.Before, input.Limit, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageVersionsGet:
		var input struct {
			LibraryID string                         `json:"library_id"`
			PageID    string                         `json:"page_id"`
			Version   int64                          `json:"version"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.KnowledgePageVersion(ctx, input.LibraryID, input.PageID, input.Version, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageVersionsDiff:
		var input struct {
			LibraryID string                                     `json:"library_id"`
			PageID    string                                     `json:"page_id"`
			Input     knowledgesdk.KnowledgePageVersionDiffInput `json:"input"`
			Authority agentsdk.ConversationAuthority             `json:"authority"`
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
			Authority agentsdk.ConversationAuthority           `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.RestoreKnowledgePageVersion(ctx, input.LibraryID, input.PageID, input.Version, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageCommentsList:
		var input struct {
			LibraryID      string                         `json:"library_id"`
			PageID         string                         `json:"page_id"`
			After          string                         `json:"after"`
			Limit          int                            `json:"limit"`
			UnresolvedOnly bool                           `json:"unresolved_only"`
			Authority      agentsdk.ConversationAuthority `json:"authority"`
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
			Authority agentsdk.ConversationAuthority          `json:"authority"`
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
			Authority agentsdk.ConversationAuthority          `json:"authority"`
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
			Authority agentsdk.ConversationAuthority           `json:"authority"`
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
			Authority agentsdk.ConversationAuthority          `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.DeleteKnowledgePageComment(ctx, input.LibraryID, input.PageID, input.CommentID, input.Input, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPageAttachmentsList:
		var input struct {
			LibraryID string                         `json:"library_id"`
			PageID    string                         `json:"page_id"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
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
			Authority  agentsdk.ConversationAuthority            `json:"authority"`
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
			Authority  agentsdk.ConversationAuthority             `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		err := service.RemoveKnowledgePageAttachment(ctx, input.LibraryID, input.PageID, input.DocumentID, input.Input, input.Authority)
		return struct{}{}, err, true
	case knowledgesdk.ActionPrincipalsSearch:
		var input struct {
			Query     string                         `json:"query"`
			After     string                         `json:"after"`
			Limit     int                            `json:"limit"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.SearchKnowledgePrincipals(ctx, input.Query, input.After, input.Limit, input.Authority)
		return value, err, true
	case knowledgesdk.ActionPrincipalsResolve:
		var input struct {
			UserIDs   []string                       `json:"user_ids"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err, true
		}
		value, err := service.ResolveKnowledgePrincipals(ctx, input.UserIDs, input.Authority)
		return value, err, true
	case knowledgesdk.ActionLibraryMembersSearch:
		var input struct {
			LibraryID string                         `json:"library_id"`
			Query     string                         `json:"query"`
			After     string                         `json:"after"`
			Limit     int                            `json:"limit"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
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
			Authority agentsdk.ConversationAuthority             `json:"authority"`
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
