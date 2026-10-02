package application

import (
	"context"
	"errors"
	"strings"
	"time"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/artifact"
	"github.com/domainry/domainry-agent-sdk/persistence"
)

func DocumentStorageScope(library string, a agentsdk.ConversationAuthority) agentsdk.KnowledgeDocumentStorageScope {
	return agentsdk.KnowledgeDocumentStorageScope{RuntimeID: a.RuntimeID, WorkspaceID: a.WorkspaceID, LibraryID: library}
}

func DocumentAccessPolicy(source any) string {
	if policy, ok := source.(agentsdk.KnowledgeDocumentAccessPolicySource); ok {
		return policy.KnowledgeDocumentAccessPolicySHA256()
	}
	return ""
}
func DocumentMaxBytes(source any) int64 {
	maxBytes := int64(16 << 20)
	if limit, ok := source.(agentsdk.KnowledgeDocumentSizeLimitSource); ok {
		if n := limit.KnowledgeDocumentMaxBytes(); n < maxBytes {
			maxBytes = n
		}
	}
	return maxBytes
}
func (s *Service) DocumentAccess(ctx context.Context, library, op string, a agentsdk.ConversationAuthority) (persistence.KnowledgeDocumentRepository, error) {
	libs, err := s.LibraryAccess(ctx, op, a)
	if err != nil {
		return nil, err
	}
	repo, ok := s.repo.(persistence.KnowledgeDocumentRepository)
	if !ok || s.options.DocumentStorage == nil {
		return nil, conversationFailure("unavailable", "documents_unavailable")
	}
	item, err := libs.KnowledgeLibrary(ctx, library, a)
	if err != nil {
		return nil, err
	}
	if item.Archived && op != "documents_delete" && op != "documents_list" && op != "documents_get" {
		return nil, conversationFailure("conflict", "library_archived")
	}
	if (op == "documents_upload" || op == "documents_delete" || op == "documents_import_attachment" || op == "documents_transfer") && item.Role != "editor" && item.Role != "manager" {
		return nil, conversationFailure("forbidden", "document_write_denied")
	}
	if err = s.LibraryAuthorize(ctx, op, item, a); err != nil {
		return nil, err
	}
	return repo, nil
}
func (s *Service) DocumentBinding(ctx context.Context, library string, a agentsdk.ConversationAuthority) (agentsdk.ManagedKnowledgeDocumentSource, error) {
	if resolver, ok := s.options.Knowledge.(*LibraryKnowledgeSource); ok {
		Binding, found, err := resolver.Binding(ctx, library, a)
		if err != nil {
			return nil, err
		}
		if found && Binding.ManageDocuments {
			if source, ok := Binding.Source.(agentsdk.ManagedKnowledgeDocumentSource); ok && source.KnowledgeDocumentManagementReady() == nil {
				return source, nil
			}
		}
		return nil, conversationFailure("unavailable", "document_management_unavailable")
	}
	for _, b := range s.options.LibraryKnowledge {
		if b.LibraryID != library || b.WorkspaceID != a.WorkspaceID || a.RuntimeID != s.runtimeID || !b.ManageDocuments {
			continue
		}
		source, ok := b.Source.(agentsdk.ManagedKnowledgeDocumentSource)
		if !ok || source.KnowledgeDocumentManagementReady() != nil {
			break
		}
		return source, nil
	}
	return nil, conversationFailure("unavailable", "document_management_unavailable")
}
func (s *Service) UploadKnowledgeDocument(ctx context.Context, library string, in agentsdk.KnowledgeDocumentUpload, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeDocument, error) {
	return s.uploadDocumentContent(ctx, library, in, nil, nil, nil, nil, a)
}
func (s *Service) UploadKnowledgeDocumentForSource(ctx context.Context, library string, in agentsdk.KnowledgeDocumentUpload, source agentsdk.KnowledgeDocumentSourceAccess, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeDocument, error) {
	return s.uploadDocumentContent(ctx, library, in, nil, nil, nil, &source, a)
}
func (s *Service) UploadDocumentContent(ctx context.Context, library string, in agentsdk.KnowledgeDocumentUpload, origin *persistence.KnowledgeAttachmentOrigin, documentOrigin *persistence.KnowledgeDocumentOrigin, recheck func() error, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeDocument, error) {
	return s.uploadDocumentContent(ctx, library, in, origin, documentOrigin, recheck, nil, a)
}
func (s *Service) uploadDocumentContent(ctx context.Context, library string, in agentsdk.KnowledgeDocumentUpload, origin *persistence.KnowledgeAttachmentOrigin, documentOrigin *persistence.KnowledgeDocumentOrigin, recheck func() error, sourceAccess *agentsdk.KnowledgeDocumentSourceAccess, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeDocument, error) {
	var zero agentsdk.KnowledgeDocument
	repo, err := s.DocumentAccess(ctx, library, "documents_upload", a)
	if err != nil {
		return zero, err
	}
	if err = s.authorizeDocumentSource(ctx, sourceAccess, a); err != nil {
		return zero, err
	}
	source, err := s.DocumentBinding(ctx, library, a)
	if err != nil {
		return zero, err
	}
	if len(in.Data) == 0 || int64(len(in.Data)) > DocumentMaxBytes(source) {
		return zero, conversationFailure("bad_request", "document_size_invalid")
	}
	contentType := AttachmentContentType(in.Filename)
	if contentType == "" {
		return zero, conversationFailure("bad_request", "document_type_unsupported")
	}
	hash := artifact.Hash(in.Data)
	r, err := repo.ReserveKnowledgeDocument(ctx, persistence.KnowledgeDocumentReserve{AttachmentOrigin: origin, DocumentOrigin: documentOrigin, LibraryID: library, ClientID: in.ClientID, Filename: in.Filename, ContentType: contentType, Bytes: int64(len(in.Data)), SHA256: hash, SourceID: source.KnowledgeDocumentSourceIdentity(), AccessPolicySHA256: DocumentAccessPolicy(source), SourceAccess: cloneDocumentSourceAccess(sourceAccess)}, a)
	if err != nil {
		return zero, err
	}
	if r.Document.State == "deleting" || r.Document.State == "deleted" {
		return zero, conversationFailure("not_found", "document_not_found")
	}
	if r.BodyRef != "" {
		return r.Document, nil
	}
	ref, err := s.options.DocumentStorage.PutKnowledgeDocumentContent(ctx, DocumentStorageScope(library, a), r.Document.ID, hash, in.Data)
	if err != nil {
		return zero, err
	}
	// Losing membership during upload leaves an inaccessible uploading record;
	// a current library editor can delete it. Never publish on stale authority.
	if _, err = s.DocumentAccess(ctx, library, "documents_upload", a); err != nil {
		return zero, err
	}
	if err = s.authorizeDocumentSource(ctx, sourceAccess, a); err != nil {
		return zero, err
	}
	if recheck != nil {
		if err = recheck(); err != nil {
			return zero, err
		}
	}
	r, err = repo.CommitKnowledgeDocumentContent(ctx, r.Document.ID, r.Document.Revision, ref, a)
	if err != nil {
		return zero, err
	}
	s.WakeKnowledgeDocuments()
	return r.Document, nil
}

func validDocumentSourceAccess(source agentsdk.KnowledgeDocumentSourceAccess) bool {
	return conversationKey(source.Namespace) && conversationKey(source.ResourceType) &&
		conversationText(source.ResourceID, 256, true) && source.ResourceID == strings.TrimSpace(source.ResourceID)
}

func cloneDocumentSourceAccess(source *agentsdk.KnowledgeDocumentSourceAccess) *agentsdk.KnowledgeDocumentSourceAccess {
	if source == nil {
		return nil
	}
	copy := *source
	return &copy
}

func (s *Service) authorizeDocumentSource(ctx context.Context, source *agentsdk.KnowledgeDocumentSourceAccess, a agentsdk.ConversationAuthority) error {
	if source == nil {
		return nil
	}
	if !validDocumentSourceAccess(*source) {
		return conversationFailure("bad_request", "document_source_invalid")
	}
	if s.options.SourceAuthorizer == nil {
		return conversationFailure("unavailable", "document_source_authorizer_unavailable")
	}
	return s.options.SourceAuthorizer.AuthorizeKnowledgeDocumentSource(ctx, *source, a)
}
func (s *Service) KnowledgeDocumentRecord(ctx context.Context, repo persistence.KnowledgeDocumentRepository, library, id string, a agentsdk.ConversationAuthority) (persistence.KnowledgeDocumentRecord, error) {
	r, err := repo.KnowledgeDocumentRecord(ctx, id, a)
	if err == nil && (r.Document.LibraryID != library || r.Document.State == "deleted") {
		err = conversationFailure("not_found", "document_not_found")
	}
	if err == nil {
		err = s.authorizeDocumentSource(ctx, r.SourceAccess, a)
	}
	return r, err
}
func (s *Service) KnowledgeDocuments(ctx context.Context, library, after string, limit int, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeDocumentPage, error) {
	repo, err := s.DocumentAccess(ctx, library, "documents_list", a)
	if err != nil {
		return agentsdk.KnowledgeDocumentPage{}, err
	}
	out, err := repo.KnowledgeDocuments(ctx, library, after, limit, a)
	if err != nil {
		return agentsdk.KnowledgeDocumentPage{}, err
	}
	visible := make([]agentsdk.KnowledgeDocument, 0, len(out.Items))
	for _, document := range out.Items {
		record, readErr := repo.KnowledgeDocumentRecord(ctx, document.ID, a)
		if readErr != nil {
			return agentsdk.KnowledgeDocumentPage{}, readErr
		}
		if readErr = s.authorizeDocumentSource(ctx, record.SourceAccess, a); readErr != nil {
			var denied *agentsdk.Error
			if errors.As(readErr, &denied) && (denied.Class == "forbidden" || denied.Class == "not_found") {
				continue
			}
			return agentsdk.KnowledgeDocumentPage{}, readErr
		}
		visible = append(visible, document)
	}
	out.Items = visible
	if _, err = s.DocumentAccess(ctx, library, "documents_list", a); err != nil {
		return agentsdk.KnowledgeDocumentPage{}, err
	}
	return out, nil
}
func (s *Service) KnowledgeDocument(ctx context.Context, library, id string, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeDocument, error) {
	repo, err := s.DocumentAccess(ctx, library, "documents_get", a)
	if err != nil {
		return agentsdk.KnowledgeDocument{}, err
	}
	r, err := s.KnowledgeDocumentRecord(ctx, repo, library, id, a)
	if err != nil {
		return agentsdk.KnowledgeDocument{}, err
	}
	return r.Document, nil
}
func (s *Service) DownloadKnowledgeDocument(ctx context.Context, library, id string, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeDocumentDownload, error) {
	var zero agentsdk.KnowledgeDocumentDownload
	repo, err := s.DocumentAccess(ctx, library, "documents_download", a)
	if err != nil {
		return zero, err
	}
	r, err := s.KnowledgeDocumentRecord(ctx, repo, library, id, a)
	if err != nil {
		return zero, err
	}
	if r.BodyRef == "" || r.Document.State == "deleting" {
		return zero, conversationFailure("not_found", "document_content_not_found")
	}
	raw, err := s.options.DocumentStorage.ReadKnowledgeDocumentContent(ctx, DocumentStorageScope(library, a), id, r.BodyRef)
	if err != nil {
		return zero, err
	}
	if int64(len(raw)) != r.Document.Bytes || artifact.Hash(raw) != r.Document.SHA256 {
		return zero, conversationFailure("unavailable", "document_content_mismatch")
	}
	if _, err = s.DocumentAccess(ctx, library, "documents_download", a); err != nil {
		return zero, err
	}
	current, err := s.KnowledgeDocumentRecord(ctx, repo, library, id, a)
	if err != nil {
		return zero, err
	}
	if current.BodyRef != r.BodyRef || current.Document.State == "deleting" {
		return zero, conversationFailure("not_found", "document_content_not_found")
	}
	return agentsdk.KnowledgeDocumentDownload{Document: current.Document, Data: raw}, nil
}
func (s *Service) DeleteKnowledgeDocument(ctx context.Context, library, id string, expected int64, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeDocument, error) {
	var zero agentsdk.KnowledgeDocument
	repo, err := s.DocumentAccess(ctx, library, "documents_delete", a)
	if err != nil {
		return zero, err
	}
	if expected < 1 {
		return zero, conversationFailure("bad_request", "revision_required")
	}
	r, err := s.KnowledgeDocumentRecord(ctx, repo, library, id, a)
	if err != nil {
		return zero, err
	}
	r, err = repo.RequestKnowledgeDocumentDeletion(ctx, id, expected, a)
	if err != nil {
		return zero, err
	}
	s.WakeKnowledgeDocuments()
	return r.Document, nil
}
func (s *Service) WakeKnowledgeDocuments() {
	select {
	case s.documentWake <- struct{}{}:
	default:
	}
}

func ActivateDocumentSources(repo any, runtime string, options Options) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	for _, b := range options.LibraryKnowledge {
		if !b.ManageDocuments {
			continue
		}
		documents, ok := repo.(persistence.KnowledgeDocumentRepository)
		if !ok || options.DocumentStorage == nil {
			return conversationFailure("unavailable", "documents_unavailable")
		}
		if err := documents.ActivateKnowledgeDocumentSource(ctx, agentsdk.KnowledgeDocumentStorageScope{RuntimeID: runtime, WorkspaceID: b.WorkspaceID, LibraryID: b.LibraryID}, b.Source.(agentsdk.ManagedKnowledgeDocumentSource).KnowledgeDocumentSourceIdentity()); err != nil {
			return err
		}
	}
	return nil
}

var _ agentsdk.KnowledgeDocumentService = (*Service)(nil)
