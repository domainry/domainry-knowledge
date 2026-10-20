package application

import (
	"bytes"
	"context"
	"io"
	"testing"
	"time"

	sdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/artifact"
	"github.com/domainry/domainry-agent-sdk/persistence"
)

type sourceUploadRepo struct {
	persistence.KnowledgeLibraryRepository
	persistence.KnowledgeDocumentRepository
	library      sdk.KnowledgeLibrary
	reserved     persistence.KnowledgeDocumentReserve
	record       persistence.KnowledgeDocumentRecord
	reserveCalls int
	commitCalls  int
	touchCalls   int
	commitLost   bool
}

func (r *sourceUploadRepo) KnowledgeLibrary(_ context.Context, id string, _ sdk.ConversationAuthority) (sdk.KnowledgeLibrary, error) {
	if id != r.library.ID {
		return sdk.KnowledgeLibrary{}, conversationFailure("not_found", "library_not_found")
	}
	return r.library, nil
}

func (r *sourceUploadRepo) ReserveKnowledgeDocument(_ context.Context, in persistence.KnowledgeDocumentReserve, a sdk.ConversationAuthority) (persistence.KnowledgeDocumentRecord, error) {
	r.reserveCalls++
	r.reserved = in
	r.record = persistence.KnowledgeDocumentRecord{
		Document: sdk.KnowledgeDocument{
			ID: "document-a", LibraryID: in.LibraryID, Filename: in.Filename, ContentType: in.ContentType,
			Bytes: in.Bytes, SHA256: in.SHA256, ContentVersion: 1, CreatedByUserID: a.UserID, State: "uploading", Revision: 1,
		},
		SourceID: in.SourceID, SourceAccess: cloneDocumentSourceAccess(in.SourceAccess), Actor: a,
	}
	return r.record, nil
}

func (r *sourceUploadRepo) CommitKnowledgeDocumentContent(_ context.Context, id string, revision int64, ref string, _ sdk.ConversationAuthority) (persistence.KnowledgeDocumentRecord, error) {
	r.commitCalls++
	if id != r.record.Document.ID || revision != r.record.Document.Revision {
		return persistence.KnowledgeDocumentRecord{}, conversationFailure("conflict", "document_revision_conflict")
	}
	r.record.BodyRef = ref
	r.record.Document.State = "queued"
	r.record.Document.Revision++
	if r.commitLost {
		return persistence.KnowledgeDocumentRecord{}, conversationFailure("conflict", "document_revision_conflict")
	}
	return r.record, nil
}

func (r *sourceUploadRepo) KnowledgeDocumentRecord(_ context.Context, id string, _ sdk.ConversationAuthority) (persistence.KnowledgeDocumentRecord, error) {
	if id != r.record.Document.ID {
		return persistence.KnowledgeDocumentRecord{}, conversationFailure("not_found", "document_not_found")
	}
	return r.record, nil
}

func (r *sourceUploadRepo) TouchKnowledgeDocumentUpload(_ context.Context, id string, _ sdk.ConversationAuthority) (persistence.KnowledgeDocumentRecord, error) {
	if id != r.record.Document.ID || r.record.Document.State != "uploading" || r.record.BodyRef != "" {
		return persistence.KnowledgeDocumentRecord{}, conversationFailure("conflict", "document_state_conflict")
	}
	r.touchCalls++
	r.record.Document.Revision++
	return r.record, nil
}

func (*sourceUploadRepo) ExpireKnowledgeDocumentUploads(context.Context, string, time.Time, int) (int, error) {
	return 0, nil
}

func (r *sourceUploadRepo) KnowledgeDocuments(_ context.Context, library, _ string, _ int, _ sdk.ConversationAuthority) (sdk.KnowledgeDocumentPage, error) {
	if library != r.library.ID {
		return sdk.KnowledgeDocumentPage{}, conversationFailure("not_found", "library_not_found")
	}
	return sdk.KnowledgeDocumentPage{Items: []sdk.KnowledgeDocument{r.record.Document}, Complete: true}, nil
}

type sourceUploadStorage struct {
	sdk.KnowledgeDocumentStorage
	puts       int
	chunkCalls int
}

func (s *sourceUploadStorage) PutKnowledgeDocumentContent(_ context.Context, _ sdk.KnowledgeDocumentStorageScope, _, _ string, expectedBytes int64, content io.Reader) (string, error) {
	raw, err := io.ReadAll(content)
	if err != nil || int64(len(raw)) != expectedBytes {
		return "", err
	}
	s.puts++
	return "body-ref", nil
}

func (s *sourceUploadStorage) PutKnowledgeDocumentContentChunk(_ context.Context, _ sdk.KnowledgeDocumentStorageScope, _, _ string, expectedBytes, offset int64, chunkHash string, chunkBytes int64, content io.Reader) (int64, string, error) {
	raw, err := io.ReadAll(content)
	if err != nil || int64(len(raw)) != chunkBytes || artifact.Hash(raw) != chunkHash {
		return 0, "", conversationFailure("bad_request", "document_content_mismatch")
	}
	s.chunkCalls++
	next := offset + chunkBytes
	if next == expectedBytes {
		return next, "body-ref", nil
	}
	return next, "", nil
}

type sourceUploadLibraryPolicy struct{ sdk.KnowledgeLibraryAuthorizer }

func (*sourceUploadLibraryPolicy) AuthorizeKnowledgeLibrary(context.Context, string, sdk.KnowledgeLibrary, sdk.ConversationAuthority) error {
	return nil
}

type sourceUploadAuthorizer struct {
	calls  int
	denyAt int
	denied bool
}

func (p *sourceUploadAuthorizer) AuthorizeKnowledgeDocumentSource(_ context.Context, _ sdk.KnowledgeDocumentSourceAccess, _ sdk.ConversationAuthority) error {
	p.calls++
	if p.denied || p.calls == p.denyAt {
		return conversationFailure("forbidden", "document_source_access_denied")
	}
	return nil
}

type sourceUploadProvider struct {
	sdk.ManagedKnowledgeDocumentSource
	sdk.ConversationKnowledgeSource
}

func (*sourceUploadProvider) KnowledgeDocumentSourceIdentity() string { return "managed-source" }
func (*sourceUploadProvider) KnowledgeDocumentManagementReady() error { return nil }
func (*sourceUploadProvider) KnowledgeDocumentFormats() []sdk.KnowledgeDocumentFormat {
	return []sdk.KnowledgeDocumentFormat{{Extension: ".txt", ContentType: "text/plain", ParserRoute: "text"}}
}

func TestSourceBackedDocumentUploadPersistsAndRechecksRecordAccess(t *testing.T) {
	authority := sdk.ConversationAuthority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "owner", RoleKey: "sales"}
	library := sdk.KnowledgeLibrary{ID: "library-a", Kind: "shared", Role: "editor"}
	source := sdk.KnowledgeDocumentSourceAccess{Namespace: sdk.KnowledgeDocumentSourceNamespaceRuntimeRecord, ResourceType: "meeting", ResourceID: "meeting-a"}

	newService := func(authorizer *sourceUploadAuthorizer) (*Service, *sourceUploadRepo, *sourceUploadStorage) {
		repo := &sourceUploadRepo{library: library}
		storage := &sourceUploadStorage{}
		service := NewService(repo, authority.RuntimeID, Options{
			DocumentStorage: storage, LibraryAuthorizer: &sourceUploadLibraryPolicy{}, SourceAuthorizer: authorizer,
			LibraryKnowledge: []LibraryKnowledgeBinding{{WorkspaceID: authority.WorkspaceID, LibraryID: library.ID, Source: &sourceUploadProvider{}, ManageDocuments: true}},
		})
		return service, repo, storage
	}

	t.Run("commit", func(t *testing.T) {
		authorizer := &sourceUploadAuthorizer{}
		service, repo, storage := newService(authorizer)
		content := []byte("transcript")
		document, err := service.UploadKnowledgeDocumentForSource(t.Context(), library.ID, sdk.KnowledgeDocumentUpload{ClientID: "meeting-a", Filename: "meeting.txt", Bytes: int64(len(content)), SHA256: artifact.Hash(content), Content: bytes.NewReader(content)}, source, authority)
		if err != nil {
			t.Fatal(err)
		}
		if document.State != "queued" || repo.reserveCalls != 1 || repo.commitCalls != 1 || storage.puts != 1 || authorizer.calls != 2 {
			t.Fatalf("document=%+v reserve=%d commit=%d puts=%d authorizations=%d", document, repo.reserveCalls, repo.commitCalls, storage.puts, authorizer.calls)
		}
		if repo.reserved.SourceAccess == nil || *repo.reserved.SourceAccess != source || repo.record.SourceAccess == nil || *repo.record.SourceAccess != source {
			t.Fatalf("reserve=%+v record=%+v", repo.reserved.SourceAccess, repo.record.SourceAccess)
		}
		authorizer.denied = true
		if _, err = service.KnowledgeDocument(t.Context(), library.ID, document.ID, authority); err == nil {
			t.Fatal("revoked source record remained readable")
		}
		page, err := service.KnowledgeDocuments(t.Context(), library.ID, "", 50, authority)
		if err != nil || len(page.Items) != 0 {
			t.Fatalf("revoked source document list=%+v err=%v", page, err)
		}
		if _, err = service.DeleteKnowledgeDocument(t.Context(), library.ID, document.ID, document.Revision, authority); err == nil {
			t.Fatal("revoked source document remained deletable")
		}
	})

	t.Run("revoked-before-commit", func(t *testing.T) {
		authorizer := &sourceUploadAuthorizer{denyAt: 2}
		service, repo, storage := newService(authorizer)
		content := []byte("transcript")
		_, err := service.UploadKnowledgeDocumentForSource(t.Context(), library.ID, sdk.KnowledgeDocumentUpload{ClientID: "meeting-a", Filename: "meeting.txt", Bytes: int64(len(content)), SHA256: artifact.Hash(content), Content: bytes.NewReader(content)}, source, authority)
		if err == nil || repo.reserveCalls != 1 || repo.commitCalls != 0 || storage.puts != 1 || authorizer.calls != 2 {
			t.Fatalf("error=%v reserve=%d commit=%d puts=%d authorizations=%d", err, repo.reserveCalls, repo.commitCalls, storage.puts, authorizer.calls)
		}
	})
}

func TestPublicDocumentChunkUploadCommitsOnlyAfterFinalVerifiedPart(t *testing.T) {
	authority := sdk.ConversationAuthority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "owner", RoleKey: "editor"}
	library := sdk.KnowledgeLibrary{ID: "library-a", Kind: "shared", Role: "editor"}
	repo := &sourceUploadRepo{library: library}
	storage := &sourceUploadStorage{}
	service := NewService(repo, authority.RuntimeID, Options{
		DocumentStorage: storage, LibraryAuthorizer: &sourceUploadLibraryPolicy{},
		LibraryKnowledge: []LibraryKnowledgeBinding{{WorkspaceID: authority.WorkspaceID, LibraryID: library.ID, Source: &sourceUploadProvider{}, ManageDocuments: true}},
	})
	raw := bytes.Repeat([]byte("resumable-knowledge-"), int(sdk.KnowledgeDocumentUploadChunkBytes/20)+2)
	first := raw[:sdk.KnowledgeDocumentUploadChunkBytes]
	last := raw[sdk.KnowledgeDocumentUploadChunkBytes:]
	input := sdk.KnowledgeDocumentUploadChunk{ClientID: "resumable-a", Filename: "notes.txt", Bytes: int64(len(raw)), SHA256: artifact.Hash(raw), Offset: 0, ChunkBytes: int64(len(first)), ChunkSHA256: artifact.Hash(first), Content: bytes.NewReader(first)}
	progress, err := service.UploadKnowledgeDocumentChunk(t.Context(), library.ID, input, authority)
	if err != nil || progress.Complete || progress.NextOffset != int64(len(first)) || progress.Document == nil || progress.Document.State != "uploading" || repo.commitCalls != 0 || repo.touchCalls != 1 {
		t.Fatalf("first progress=%+v commits=%d touches=%d err=%v", progress, repo.commitCalls, repo.touchCalls, err)
	}
	input.Offset, input.ChunkBytes, input.ChunkSHA256, input.Content = int64(len(first)), int64(len(last)), artifact.Hash(last), bytes.NewReader(last)
	progress, err = service.UploadKnowledgeDocumentChunk(t.Context(), library.ID, input, authority)
	if err != nil || !progress.Complete || progress.NextOffset != int64(len(raw)) || progress.Document == nil || progress.Document.State != "queued" || repo.commitCalls != 1 || storage.chunkCalls != 2 {
		t.Fatalf("final progress=%+v commits=%d chunks=%d err=%v", progress, repo.commitCalls, storage.chunkCalls, err)
	}
}

func TestPublicDocumentChunkUploadReconcilesCommittedResultAfterLostCommitResponse(t *testing.T) {
	authority := sdk.ConversationAuthority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "owner", RoleKey: "editor"}
	library := sdk.KnowledgeLibrary{ID: "library-a", Kind: "shared", Role: "editor"}
	repo := &sourceUploadRepo{library: library, commitLost: true}
	storage := &sourceUploadStorage{}
	service := NewService(repo, authority.RuntimeID, Options{
		DocumentStorage: storage, LibraryAuthorizer: &sourceUploadLibraryPolicy{},
		LibraryKnowledge: []LibraryKnowledgeBinding{{WorkspaceID: authority.WorkspaceID, LibraryID: library.ID, Source: &sourceUploadProvider{}, ManageDocuments: true}},
	})
	raw := []byte("committed-before-response-was-lost")
	progress, err := service.UploadKnowledgeDocumentChunk(t.Context(), library.ID, sdk.KnowledgeDocumentUploadChunk{
		ClientID: "reconcile-a", Filename: "notes.txt", Bytes: int64(len(raw)), SHA256: artifact.Hash(raw),
		ChunkBytes: int64(len(raw)), ChunkSHA256: artifact.Hash(raw), Content: bytes.NewReader(raw),
	}, authority)
	if err != nil || !progress.Complete || progress.Document == nil || progress.Document.State != "queued" || progress.Document.Revision != 2 || repo.commitCalls != 1 {
		t.Fatalf("progress=%+v commits=%d err=%v", progress, repo.commitCalls, err)
	}
}
