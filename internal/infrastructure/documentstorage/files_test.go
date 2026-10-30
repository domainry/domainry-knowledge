package documentstorage

import (
	"bytes"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"io"
	"path/filepath"
	"strings"
	"testing"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
)

func digest(raw []byte) string {
	sum := sha256.Sum256(raw)
	return hex.EncodeToString(sum[:])
}

func TestLibraryOriginalIsolationAndDurableDeletionFence(t *testing.T) {
	path := filepath.Join(t.TempDir(), "private")
	f, err := NewFiles(path)
	if err != nil {
		t.Fatal(err)
	}
	defer func() { f.Close() }()
	scope := agentsdk.KnowledgeDocumentStorageScope{RuntimeID: "runtime", WorkspaceID: "workspace", LibraryID: "klib_" + strings.Repeat("a", 32)}
	id, raw := "kdoc_"+strings.Repeat("b", 32), []byte("shared immutable original")
	ref, err := f.PutKnowledgeDocumentContent(t.Context(), scope, id, digest(raw), int64(len(raw)), bytes.NewReader(raw))
	if err != nil {
		t.Fatal(err)
	}
	stream, err := f.OpenKnowledgeDocumentContent(t.Context(), scope, id, ref, digest(raw), int64(len(raw)))
	if err != nil {
		t.Fatal(err)
	}
	defer stream.Close()
	if _, err = stream.Seek(7, io.SeekStart); err != nil {
		t.Fatal(err)
	}
	part := make([]byte, 9)
	if _, err = io.ReadFull(stream, part); err != nil || string(part) != "immutable" {
		t.Fatalf("range=%q err=%v", part, err)
	}
	other := scope
	other.LibraryID = "klib_" + strings.Repeat("c", 32)
	if _, err = f.OpenKnowledgeDocumentContent(t.Context(), other, id, ref, digest(raw), int64(len(raw))); err == nil {
		t.Fatal("cross-library original read")
	}
	other = scope
	other.WorkspaceID = "other"
	if _, err = f.OpenKnowledgeDocumentContent(t.Context(), other, id, ref, digest(raw), int64(len(raw))); err == nil {
		t.Fatal("cross-workspace original read")
	}
	if err = f.DeleteKnowledgeDocumentContent(t.Context(), scope, id); err != nil {
		t.Fatal(err)
	}
	f.Close()
	f, err = NewFiles(path)
	if err != nil {
		t.Fatal(err)
	}
	if _, err = f.PutKnowledgeDocumentContent(t.Context(), scope, id, digest(raw), int64(len(raw)), bytes.NewReader(raw)); err == nil {
		t.Fatal("late upload escaped persistent tombstone")
	}
	if _, err = f.OpenKnowledgeDocumentContent(t.Context(), scope, id, ref, digest(raw), int64(len(raw))); err == nil {
		t.Fatal("deleted original returned")
	}
}

func TestLibraryOriginalChunkUploadResumesAndPublishesAtomically(t *testing.T) {
	f, err := NewFiles(filepath.Join(t.TempDir(), "private"))
	if err != nil {
		t.Fatal(err)
	}
	defer f.Close()
	scope := agentsdk.KnowledgeDocumentStorageScope{RuntimeID: "runtime", WorkspaceID: "workspace", LibraryID: "klib_" + strings.Repeat("d", 32)}
	id := "kdoc_" + strings.Repeat("e", 32)
	raw := bytes.Repeat([]byte("chunked-original-"), int(2*agentsdk.KnowledgeDocumentUploadChunkBytes/17)+2)
	first := raw[:agentsdk.KnowledgeDocumentUploadChunkBytes]
	second := raw[agentsdk.KnowledgeDocumentUploadChunkBytes : 2*agentsdk.KnowledgeDocumentUploadChunkBytes]
	last := raw[2*agentsdk.KnowledgeDocumentUploadChunkBytes:]
	contentDigest := digest(raw)
	next, ref, err := f.PutKnowledgeDocumentContentChunk(t.Context(), scope, id, contentDigest, int64(len(raw)), 0, digest(first), int64(len(first)), bytes.NewReader(first))
	if err != nil || next != int64(len(first)) || ref != "" {
		t.Fatalf("first next=%d ref=%q err=%v", next, ref, err)
	}
	if _, err = f.OpenKnowledgeDocumentContent(t.Context(), scope, id, id+":"+contentDigest, contentDigest, int64(len(raw))); err == nil {
		t.Fatal("incomplete staged upload became readable")
	}
	wrong := append([]byte(nil), first...)
	wrong[0] ^= 0xff
	if _, _, err = f.PutKnowledgeDocumentContentChunk(t.Context(), scope, id, contentDigest, int64(len(raw)), 0, digest(wrong), int64(len(wrong)), bytes.NewReader(wrong)); err == nil {
		t.Fatal("conflicting replay was accepted")
	}
	var coded *agentsdk.Error
	if !errors.As(err, &coded) || coded.Code != "knowledge.document_storage.document_upload_content_conflict" {
		t.Fatalf("conflicting replay err=%v", err)
	}
	if _, _, err = f.PutKnowledgeDocumentContentChunk(t.Context(), scope, id, contentDigest, int64(len(raw)), int64(len(first)+len(second)), digest(last), int64(len(last)), bytes.NewReader(last)); err == nil {
		t.Fatal("upload gap was accepted")
	}
	if !errors.As(err, &coded) || coded.Code != "knowledge.document_storage.document_upload_offset_conflict" {
		t.Fatalf("upload gap err=%v", err)
	}
	next, ref, err = f.PutKnowledgeDocumentContentChunk(t.Context(), scope, id, contentDigest, int64(len(raw)), int64(len(first)), digest(second), int64(len(second)), bytes.NewReader(second))
	if err != nil || next != int64(len(first)+len(second)) || ref != "" {
		t.Fatalf("second next=%d ref=%q err=%v", next, ref, err)
	}
	next, ref, err = f.PutKnowledgeDocumentContentChunk(t.Context(), scope, id, contentDigest, int64(len(raw)), 0, digest(first), int64(len(first)), bytes.NewReader(first))
	if err != nil || next != int64(len(first)+len(second)) || ref != "" {
		t.Fatalf("replay next=%d ref=%q err=%v", next, ref, err)
	}
	next, ref, err = f.PutKnowledgeDocumentContentChunk(t.Context(), scope, id, contentDigest, int64(len(raw)), int64(len(first)+len(second)), digest(last), int64(len(last)), bytes.NewReader(last))
	wantRef := "att_" + strings.Repeat("e", 32) + ":" + contentDigest
	if err != nil || next != int64(len(raw)) || ref != wantRef {
		t.Fatalf("final next=%d ref=%q err=%v", next, ref, err)
	}
	reader, err := f.OpenKnowledgeDocumentContent(t.Context(), scope, id, ref, contentDigest, int64(len(raw)))
	if err != nil {
		t.Fatal(err)
	}
	loaded, readErr := io.ReadAll(reader)
	_ = reader.Close()
	if readErr != nil || !bytes.Equal(loaded, raw) {
		t.Fatalf("loaded bytes=%d err=%v", len(loaded), readErr)
	}
}

func TestLibraryOriginalKeepsImmutableVersionsBehindStableDocumentID(t *testing.T) {
	f, err := NewFiles(filepath.Join(t.TempDir(), "private"))
	if err != nil {
		t.Fatal(err)
	}
	defer f.Close()
	scope := agentsdk.KnowledgeDocumentStorageScope{RuntimeID: "runtime", WorkspaceID: "workspace", LibraryID: "klib_" + strings.Repeat("1", 32)}
	id := "kdoc_" + strings.Repeat("2", 32)
	first, second := []byte("published version one"), []byte("published version two")
	firstRef, err := f.PutKnowledgeDocumentContent(t.Context(), scope, id, digest(first), int64(len(first)), bytes.NewReader(first))
	if err != nil {
		t.Fatal(err)
	}
	secondRef, err := f.PutKnowledgeDocumentContent(t.Context(), scope, id, digest(second), int64(len(second)), bytes.NewReader(second))
	if err != nil || firstRef == secondRef {
		t.Fatalf("first=%q second=%q err=%v", firstRef, secondRef, err)
	}
	for _, version := range []struct {
		ref  string
		body []byte
	}{{firstRef, first}, {secondRef, second}} {
		reader, openErr := f.OpenKnowledgeDocumentContent(t.Context(), scope, id, version.ref, digest(version.body), int64(len(version.body)))
		if openErr != nil {
			t.Fatal(openErr)
		}
		loaded, readErr := io.ReadAll(reader)
		_ = reader.Close()
		if readErr != nil || !bytes.Equal(loaded, version.body) {
			t.Fatalf("loaded=%q err=%v", loaded, readErr)
		}
	}
	if err = f.DeleteKnowledgeDocumentContent(t.Context(), scope, id); err != nil {
		t.Fatal(err)
	}
	if _, err = f.OpenKnowledgeDocumentContent(t.Context(), scope, id, secondRef, digest(second), int64(len(second))); err == nil {
		t.Fatal("deleted version remained readable")
	}
}
