package artifactstorage

import (
	"bytes"
	"context"
	"errors"
	"io"
	"strings"
	"testing"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	agentsdk "github.com/domainry/domainry-agent-sdk"
	knowledgeartifact "github.com/domainry/domainry-agent-sdk/artifact"
)

type deleteAfterKnowledgeChunkS3 struct {
	*fakeS3
	deletedKey string
	marked     bool
}

func (value *deleteAfterKnowledgeChunkS3) PutObject(ctx context.Context, input *s3.PutObjectInput, options ...func(*s3.Options)) (*s3.PutObjectOutput, error) {
	result, err := value.fakeS3.PutObject(ctx, input, options...)
	if err != nil || !strings.Contains(aws.ToString(input.Key), ".upload/") {
		return result, err
	}
	value.mu.Lock()
	if !value.marked {
		value.objects[value.deletedKey] = fakeS3Object{content: []byte("deleted")}
		value.marked = true
	}
	value.mu.Unlock()
	return result, nil
}

func TestS3KnowledgeDocumentsStreamSeekAndKeepDeletionFence(t *testing.T) {
	backend := &fakeS3{objects: map[string]fakeS3Object{}}
	store, err := newS3(S3Config{Region: "us-east-1", Bucket: "knowledge", Prefix: "files", Endpoint: "http://127.0.0.1:9000", ForcePathStyle: true}, backend)
	if err != nil {
		t.Fatal(err)
	}
	scope := agentsdk.KnowledgeDocumentStorageScope{RuntimeID: "runtime", WorkspaceID: "workspace", LibraryID: "lib_" + strings.Repeat("a", 32)}
	documentID := "kdoc_" + strings.Repeat("b", 32)
	raw := bytes.Repeat([]byte("0123456789abcdef"), 16*1024)
	digest := knowledgeartifact.Hash(raw)
	reference, err := store.PutKnowledgeDocumentContent(t.Context(), scope, documentID, digest, int64(len(raw)), bytes.NewReader(raw))
	if err != nil || reference != "s3_document_"+digest {
		t.Fatalf("reference=%q err=%v", reference, err)
	}
	if replay, replayErr := store.PutKnowledgeDocumentContent(t.Context(), scope, documentID, digest, int64(len(raw)), bytes.NewReader(raw)); replayErr != nil || replay != reference {
		t.Fatalf("replay=%q err=%v", replay, replayErr)
	}

	reader, err := store.OpenKnowledgeDocumentContent(t.Context(), scope, documentID, reference, digest, int64(len(raw)))
	if err != nil {
		t.Fatal(err)
	}
	if _, err = reader.Seek(65_537, io.SeekStart); err != nil {
		t.Fatal(err)
	}
	readerAt, ok := reader.(io.ReaderAt)
	if !ok {
		t.Fatal("S3 document reader does not provide positional reads")
	}
	random := make([]byte, 4097)
	if _, err = readerAt.ReadAt(random, 12_345); err != nil || !bytes.Equal(random, raw[12_345:12_345+len(random)]) {
		t.Fatalf("positional read err=%v", err)
	}
	if offset, seekErr := reader.Seek(0, io.SeekCurrent); seekErr != nil || offset != 65_537 {
		t.Fatalf("positional read changed sequential offset=%d err=%v", offset, seekErr)
	}
	segment := make([]byte, 32_769)
	if _, err = io.ReadFull(reader, segment); err != nil || !bytes.Equal(segment, raw[65_537:65_537+len(segment)]) {
		t.Fatalf("range read err=%v", err)
	}
	if _, err = reader.Seek(0, io.SeekStart); err != nil {
		t.Fatal(err)
	}
	loaded, err := io.ReadAll(reader)
	if closeErr := reader.Close(); err != nil || closeErr != nil || !bytes.Equal(loaded, raw) {
		t.Fatalf("read err=%v close=%v bytes=%d", err, closeErr, len(loaded))
	}

	if err = store.DeleteKnowledgeDocumentContent(t.Context(), scope, documentID); err != nil {
		t.Fatal(err)
	}
	if _, err = store.OpenKnowledgeDocumentContent(t.Context(), scope, documentID, reference, digest, int64(len(raw))); err == nil {
		t.Fatal("deleted document remained readable")
	}
	if _, err = store.PutKnowledgeDocumentContent(t.Context(), scope, documentID, digest, int64(len(raw)), bytes.NewReader(raw)); err == nil {
		t.Fatal("late upload crossed the durable deletion fence")
	}
}

func TestS3KnowledgeDocumentRejectsBodyMismatchWithoutLeavingContent(t *testing.T) {
	backend := &fakeS3{objects: map[string]fakeS3Object{}}
	store, err := newS3(S3Config{Region: "us-east-1", Bucket: "knowledge", Prefix: "files", Endpoint: "http://127.0.0.1:9000", ForcePathStyle: true}, backend)
	if err != nil {
		t.Fatal(err)
	}
	scope := agentsdk.KnowledgeDocumentStorageScope{RuntimeID: "runtime", WorkspaceID: "workspace", LibraryID: "lib_" + strings.Repeat("c", 32)}
	documentID := "kdoc_" + strings.Repeat("d", 32)
	raw := []byte("declared content")
	digest := knowledgeartifact.Hash(raw)
	if _, err = store.PutKnowledgeDocumentContent(t.Context(), scope, documentID, digest, int64(len(raw)), bytes.NewReader(append(raw, '!'))); err == nil {
		t.Fatal("long body was accepted")
	}
	contentKey, _, keyErr := store.knowledgeDocumentKeys(scope, documentID)
	if keyErr != nil {
		t.Fatal(keyErr)
	}
	backend.mu.Lock()
	_, found := backend.objects[contentKey]
	backend.mu.Unlock()
	if found {
		t.Fatal("mismatched body remained in object storage")
	}
	if _, err = store.PutKnowledgeDocumentContent(t.Context(), scope, documentID, digest, int64(len(raw)), bytes.NewReader(raw[:4])); err == nil {
		t.Fatal("short body was accepted")
	}
	var coded *agentsdk.Error
	if !errors.As(err, &coded) || coded.Code != "agent.conversation.document_content_mismatch" {
		t.Fatalf("short body err=%v", err)
	}
}

func TestS3KnowledgeDocumentUsesMultipartAndPublishesOnlyVerifiedContent(t *testing.T) {
	backend := &fakeS3{objects: map[string]fakeS3Object{}}
	store, err := newS3(S3Config{Region: "us-east-1", Bucket: "knowledge", Prefix: "files", Endpoint: "http://127.0.0.1:9000", ForcePathStyle: true}, backend)
	if err != nil {
		t.Fatal(err)
	}
	scope := agentsdk.KnowledgeDocumentStorageScope{RuntimeID: "runtime", WorkspaceID: "workspace", LibraryID: "lib_" + strings.Repeat("e", 32)}
	documentID := "kdoc_" + strings.Repeat("f", 32)
	raw := bytes.Repeat([]byte("multipart-original"), int(knowledgeDocumentMultipartPartBytes/18)+100)
	digest := knowledgeartifact.Hash(raw)
	reference, err := store.PutKnowledgeDocumentContent(t.Context(), scope, documentID, digest, int64(len(raw)), bytes.NewReader(raw))
	if err != nil || reference != "s3_document_"+digest || backend.uploadedParts != 2 || backend.completedUploads != 1 || backend.abortedUploads != 0 {
		t.Fatalf("reference=%q parts=%d completed=%d aborted=%d err=%v", reference, backend.uploadedParts, backend.completedUploads, backend.abortedUploads, err)
	}
	reader, err := store.OpenKnowledgeDocumentContent(t.Context(), scope, documentID, reference, digest, int64(len(raw)))
	if err != nil {
		t.Fatal(err)
	}
	loaded, readErr := io.ReadAll(reader)
	_ = reader.Close()
	if readErr != nil || !bytes.Equal(loaded, raw) {
		t.Fatalf("multipart content mismatch bytes=%d err=%v", len(loaded), readErr)
	}

	badID := "kdoc_" + strings.Repeat("1", 32)
	if _, err = store.PutKnowledgeDocumentContent(t.Context(), scope, badID, strings.Repeat("a", 64), int64(len(raw)), bytes.NewReader(raw)); err == nil {
		t.Fatal("multipart digest mismatch was accepted")
	}
	badKey, _, keyErr := store.knowledgeDocumentKeys(scope, badID)
	if keyErr != nil {
		t.Fatal(keyErr)
	}
	backend.mu.Lock()
	_, published := backend.objects[badKey]
	remainingUploads, aborted := len(backend.multipart), backend.abortedUploads
	backend.mu.Unlock()
	if published || remainingUploads != 0 || aborted != 1 {
		t.Fatalf("mismatched multipart published=%v pending=%d aborted=%d", published, remainingUploads, aborted)
	}
}

func TestS3KnowledgeDocumentChunkUploadResumesAndRemovesStagingObjects(t *testing.T) {
	backend := &fakeS3{objects: map[string]fakeS3Object{}}
	store, err := newS3(S3Config{Region: "us-east-1", Bucket: "knowledge", Prefix: "files", Endpoint: "http://127.0.0.1:9000", ForcePathStyle: true}, backend)
	if err != nil {
		t.Fatal(err)
	}
	scope := agentsdk.KnowledgeDocumentStorageScope{RuntimeID: "runtime", WorkspaceID: "workspace", LibraryID: "lib_" + strings.Repeat("2", 32)}
	documentID := "kdoc_" + strings.Repeat("3", 32)
	raw := bytes.Repeat([]byte("resumable-s3-original-"), int(2*agentsdk.KnowledgeDocumentUploadChunkBytes/22)+2)
	first := raw[:agentsdk.KnowledgeDocumentUploadChunkBytes]
	second := raw[agentsdk.KnowledgeDocumentUploadChunkBytes : 2*agentsdk.KnowledgeDocumentUploadChunkBytes]
	last := raw[2*agentsdk.KnowledgeDocumentUploadChunkBytes:]
	digest := knowledgeartifact.Hash(raw)
	next, reference, err := store.PutKnowledgeDocumentContentChunk(t.Context(), scope, documentID, digest, int64(len(raw)), 0, knowledgeartifact.Hash(first), int64(len(first)), bytes.NewReader(first))
	if err != nil || next != int64(len(first)) || reference != "" {
		t.Fatalf("first next=%d ref=%q err=%v", next, reference, err)
	}
	wrong := append([]byte(nil), first...)
	wrong[0] ^= 0xff
	if _, _, err = store.PutKnowledgeDocumentContentChunk(t.Context(), scope, documentID, digest, int64(len(raw)), 0, knowledgeartifact.Hash(wrong), int64(len(wrong)), bytes.NewReader(wrong)); err == nil {
		t.Fatal("conflicting replay was accepted")
	}
	var coded *agentsdk.Error
	if !errors.As(err, &coded) || coded.Code != "agent.conversation.document_upload_content_conflict" {
		t.Fatalf("conflicting replay err=%v", err)
	}
	if _, _, err = store.PutKnowledgeDocumentContentChunk(t.Context(), scope, documentID, digest, int64(len(raw)), int64(len(first)+len(second)), knowledgeartifact.Hash(last), int64(len(last)), bytes.NewReader(last)); err == nil {
		t.Fatal("upload gap was accepted")
	}
	if !errors.As(err, &coded) || coded.Code != "agent.conversation.document_upload_offset_conflict" {
		t.Fatalf("upload gap err=%v", err)
	}
	next, reference, err = store.PutKnowledgeDocumentContentChunk(t.Context(), scope, documentID, digest, int64(len(raw)), int64(len(first)), knowledgeartifact.Hash(second), int64(len(second)), bytes.NewReader(second))
	if err != nil || next != int64(len(first)+len(second)) || reference != "" {
		t.Fatalf("second next=%d ref=%q err=%v", next, reference, err)
	}
	next, reference, err = store.PutKnowledgeDocumentContentChunk(t.Context(), scope, documentID, digest, int64(len(raw)), 0, knowledgeartifact.Hash(first), int64(len(first)), bytes.NewReader(first))
	if err != nil || next != int64(len(first)+len(second)) || reference != "" {
		t.Fatalf("replay next=%d ref=%q err=%v", next, reference, err)
	}
	next, reference, err = store.PutKnowledgeDocumentContentChunk(t.Context(), scope, documentID, digest, int64(len(raw)), int64(len(first)+len(second)), knowledgeartifact.Hash(last), int64(len(last)), bytes.NewReader(last))
	if err != nil || next != int64(len(raw)) || reference != "s3_document_"+digest {
		t.Fatalf("final next=%d ref=%q err=%v", next, reference, err)
	}
	contentKey, _, keyErr := store.knowledgeDocumentKeys(scope, documentID)
	if keyErr != nil {
		t.Fatal(keyErr)
	}
	backend.mu.Lock()
	_, firstStaged := backend.objects[knowledgeDocumentChunkKey(contentKey, 0)]
	_, secondStaged := backend.objects[knowledgeDocumentChunkKey(contentKey, int64(len(first)))]
	_, lastStaged := backend.objects[knowledgeDocumentChunkKey(contentKey, int64(len(first)+len(second)))]
	final := backend.objects[contentKey]
	backend.mu.Unlock()
	if firstStaged || secondStaged || lastStaged || !bytes.Equal(final.content, raw) {
		t.Fatalf("staging first=%v second=%v last=%v final=%d", firstStaged, secondStaged, lastStaged, len(final.content))
	}
}

func TestS3KnowledgeDocumentChunkUploadRemovesPartWhenDeleteRacesWrite(t *testing.T) {
	base := &fakeS3{objects: map[string]fakeS3Object{}}
	backend := &deleteAfterKnowledgeChunkS3{fakeS3: base}
	store, err := newS3(S3Config{Region: "us-east-1", Bucket: "knowledge", Prefix: "files", Endpoint: "http://127.0.0.1:9000", ForcePathStyle: true}, backend)
	if err != nil {
		t.Fatal(err)
	}
	scope := agentsdk.KnowledgeDocumentStorageScope{RuntimeID: "runtime", WorkspaceID: "workspace", LibraryID: "lib_" + strings.Repeat("4", 32)}
	documentID := "kdoc_" + strings.Repeat("5", 32)
	contentKey, deletedKey, err := store.knowledgeDocumentKeys(scope, documentID)
	if err != nil {
		t.Fatal(err)
	}
	backend.deletedKey = deletedKey
	raw := bytes.Repeat([]byte("x"), int(agentsdk.KnowledgeDocumentUploadChunkBytes+1))
	first := raw[:agentsdk.KnowledgeDocumentUploadChunkBytes]
	_, _, err = store.PutKnowledgeDocumentContentChunk(t.Context(), scope, documentID, knowledgeartifact.Hash(raw), int64(len(raw)), 0, knowledgeartifact.Hash(first), int64(len(first)), bytes.NewReader(first))
	var coded *agentsdk.Error
	if !errors.As(err, &coded) || coded.Code != "agent.conversation.document_not_found" {
		t.Fatalf("race err=%v", err)
	}
	base.mu.Lock()
	_, staged := base.objects[knowledgeDocumentChunkKey(contentKey, 0)]
	_, deleted := base.objects[deletedKey]
	base.mu.Unlock()
	if staged || !deleted {
		t.Fatalf("staged=%v deleted=%v", staged, deleted)
	}
}
