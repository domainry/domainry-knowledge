package application

import (
	"context"

	sdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
)

// This is deliberately an Owner-local check. Business Actions can recheck a
// frozen managed-document reference without opening storage or calling the
// search/fetch Provider while the business transaction is held. It does not
// certify current external search results or approve customer disclosure.
func (s *Service) CheckKnowledgeDocumentSnapshot(ctx context.Context, library string, expected sdk.KnowledgeDocumentSnapshot, authority sdk.Authority) (sdk.KnowledgeDocument, error) {
	if !expected.Valid() {
		return sdk.KnowledgeDocument{}, conversationFailure("bad_request", "knowledge_document_snapshot_invalid")
	}
	var current sdk.KnowledgeDocument
	// Re-resolve access, binding and source/page policy after the first read so
	// a revocation or rebind observed during the check cannot release a fact.
	for i := 0; i < 2; i++ {
		repo, err := s.DocumentAccess(ctx, library, sdk.ActionDocumentsDownload, authority)
		if err != nil {
			return sdk.KnowledgeDocument{}, err
		}
		source, err := s.DocumentBinding(ctx, library, authority)
		if err != nil {
			return sdk.KnowledgeDocument{}, err
		}
		record, err := s.KnowledgeDocumentRecord(ctx, repo, library, expected.DocumentID, authority)
		if err != nil {
			return sdk.KnowledgeDocument{}, err
		}
		document := record.Document
		if document.ID != expected.DocumentID || !DocumentReadable(record, library, source.KnowledgeDocumentSourceIdentity(), DocumentAccessPolicy(source)) || !record.SecurityScanCompleted || document.SecurityStatus != "clean" || document.IndexStatus != "INDEXED" || document.Reindexing || record.Reindex != nil || record.Replacement != nil || document.ContentVersion != expected.ContentVersion || document.IndexGeneration != expected.IndexGeneration || document.SHA256 != expected.SHA256 {
			return sdk.KnowledgeDocument{}, conversationFailure("conflict", "knowledge_document_snapshot_stale")
		}
		switch document.ProjectionKind {
		case "file":
			if expected.PageID != "" || record.PageProjection != nil {
				return sdk.KnowledgeDocument{}, conversationFailure("conflict", "knowledge_document_snapshot_stale")
			}
		case "page":
			if record.PageProjection == nil || expected.PageID == "" || document.OriginPageID != expected.PageID || document.OriginPageVersion != expected.PageVersion || record.PageProjection.PageID != expected.PageID || record.PageProjection.Version != expected.PageVersion {
				return sdk.KnowledgeDocument{}, conversationFailure("conflict", "knowledge_document_snapshot_stale")
			}
			validator, ok := repo.(interface {
				ValidateKnowledgePageProjection(context.Context, persistence.KnowledgePageProjectionOrigin, string, sdk.Authority) error
			})
			if !ok {
				return sdk.KnowledgeDocument{}, conversationFailure("forbidden", "knowledge_access_denied")
			}
			if err := validator.ValidateKnowledgePageProjection(ctx, *record.PageProjection, library, authority); err != nil {
				return sdk.KnowledgeDocument{}, err
			}
		default:
			return sdk.KnowledgeDocument{}, conversationFailure("conflict", "knowledge_document_snapshot_stale")
		}
		current = document
	}
	return current, nil
}

var _ sdk.KnowledgeDocumentSnapshotService = (*Service)(nil)
