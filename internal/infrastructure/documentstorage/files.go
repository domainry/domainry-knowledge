// Package documentstorage uses the private immutable file engine in a separate
// library namespace. Storage namespaces are not Identity principals.
package documentstorage

import (
	"context"
	"errors"
	"io"
	"strings"

	"github.com/domainry/domainry-foundation/entityid"
	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	attachmentstorage "github.com/domainry/domainry-knowledge/internal/infrastructure/attachmentstorage"
)

type Files struct{ files *attachmentstorage.Files }

func NewFiles(path string) (*Files, error) {
	f, e := attachmentstorage.NewFiles(path)
	if e != nil {
		return nil, e
	}
	return &Files{files: f}, nil
}
func (f *Files) Close() error { return f.files.Close() }

func namespace(s agentsdk.KnowledgeDocumentStorageScope, id string) (agentsdk.Authority, string, error) {
	if entityid.Validate("klib", s.LibraryID) != nil || entityid.Validate("kdoc", id) != nil {
		return agentsdk.Authority{}, "", &agentsdk.Error{Class: "bad_request", Code: "knowledge.document_reference_invalid"}
	}
	return agentsdk.Authority{Known: true, RuntimeID: s.RuntimeID, WorkspaceID: s.WorkspaceID, UserID: "knowledge-library:" + s.LibraryID}, "att_" + strings.TrimPrefix(id, "kdoc_"), nil
}
func documentError(e error) error {
	var coded *agentsdk.Error
	if errors.As(e, &coded) {
		copy := *coded
		copy.Code = strings.Replace(copy.Code, "attachment_", "document_", 1)
		return &copy
	}
	return e
}
func (f *Files) PutKnowledgeDocumentContent(ctx context.Context, s agentsdk.KnowledgeDocumentStorageScope, id, hash string, expectedBytes int64, content io.Reader) (string, error) {
	a, key, e := namespace(s, id)
	if e != nil {
		return "", e
	}
	ref, e := f.files.PutAttachmentContentStream(ctx, key, hash, expectedBytes, agentsdk.KnowledgeDocumentMaximumBytes, content, a)
	return ref, documentError(e)
}

func (f *Files) PutKnowledgeDocumentContentChunk(ctx context.Context, s agentsdk.KnowledgeDocumentStorageScope, id, hash string, expectedBytes, offset int64, chunkHash string, chunkBytes int64, content io.Reader) (int64, string, error) {
	a, key, e := namespace(s, id)
	if e != nil {
		return 0, "", e
	}
	next, ref, e := f.files.PutAttachmentContentChunk(ctx, key, hash, expectedBytes, agentsdk.KnowledgeDocumentMaximumBytes, offset, chunkHash, chunkBytes, content, a)
	return next, ref, documentError(e)
}

func (f *Files) OpenKnowledgeDocumentContent(ctx context.Context, s agentsdk.KnowledgeDocumentStorageScope, id, ref, expectedSHA256 string, expectedBytes int64) (io.ReadSeekCloser, error) {
	a, key, e := namespace(s, id)
	if e != nil {
		return nil, e
	}
	if ref != key+":"+expectedSHA256 {
		return nil, documentError(&agentsdk.Error{Class: "unavailable", Code: "knowledge.attachment_content_mismatch"})
	}
	content, e := f.files.OpenAttachmentContent(ctx, key, ref, expectedBytes, expectedBytes, a)
	return content, documentError(e)
}
func (f *Files) DeleteKnowledgeDocumentContent(ctx context.Context, s agentsdk.KnowledgeDocumentStorageScope, id string) error {
	a, key, e := namespace(s, id)
	if e != nil {
		return e
	}
	return documentError(f.files.DeleteAttachmentContent(ctx, key, a))
}

var _ agentsdk.KnowledgeDocumentStorage = (*Files)(nil)
var _ agentsdk.KnowledgeDocumentChunkStorage = (*Files)(nil)
