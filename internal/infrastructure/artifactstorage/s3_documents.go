package artifactstorage

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"regexp"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
	agentsdk "github.com/domainry/domainry-knowledge-sdk"
)

var knowledgeLibraryIDPattern = regexp.MustCompile(`^lib_[a-f0-9]{32}$`)
var knowledgeDocumentIDPattern = regexp.MustCompile(`^kdoc_[a-f0-9]{32}$`)
var knowledgeDocumentReferencePattern = regexp.MustCompile(`^s3_document_[a-f0-9]{64}$`)
var knowledgeDocumentSHA256Pattern = regexp.MustCompile(`^[a-f0-9]{64}$`)

const knowledgeDocumentMultipartPartBytes int64 = agentsdk.KnowledgeDocumentUploadChunkBytes

func knowledgeDocumentStorageError(class, code string) error {
	return &agentsdk.Error{Class: class, Code: "knowledge." + code}
}

func knowledgeDocumentScopeHash(scope agentsdk.KnowledgeDocumentStorageScope, documentID string) (string, error) {
	if strings.TrimSpace(scope.RuntimeID) == "" || strings.TrimSpace(scope.WorkspaceID) == "" || len(scope.RuntimeID) > 255 || len(scope.WorkspaceID) > 255 || !knowledgeLibraryIDPattern.MatchString(scope.LibraryID) || !knowledgeDocumentIDPattern.MatchString(documentID) {
		return "", knowledgeDocumentStorageError("bad_request", "document_reference_invalid")
	}
	raw, _ := json.Marshal([]string{scope.RuntimeID, scope.WorkspaceID, scope.LibraryID})
	digest := sha256.Sum256(raw)
	return hex.EncodeToString(digest[:]), nil
}

func knowledgeDocumentReference(contentSHA256 string) string {
	return "s3_document_" + contentSHA256
}

func (store *S3) knowledgeDocumentKeys(scope agentsdk.KnowledgeDocumentStorageScope, documentID string) (content, deleted string, err error) {
	scopeHash, err := knowledgeDocumentScopeHash(scope, documentID)
	if err != nil {
		return "", "", err
	}
	base := store.prefix + "/documents/" + scopeHash + "/" + documentID
	return base + ".bin", base + ".deleted", nil
}

func (store *S3) knowledgeDocumentDeleted(ctx context.Context, key string) (bool, error) {
	_, err := store.client.HeadObject(ctx, &s3.HeadObjectInput{Bucket: aws.String(store.bucket), Key: aws.String(key)})
	if missingS3(err) {
		return false, nil
	}
	if err != nil {
		return false, knowledgeDocumentStorageError("unavailable", "document_storage_unavailable")
	}
	return true, nil
}

func (store *S3) knowledgeDocumentHead(ctx context.Context, key, expectedSHA256 string, expectedBytes int64) (bool, error) {
	result, err := store.client.HeadObject(ctx, &s3.HeadObjectInput{Bucket: aws.String(store.bucket), Key: aws.String(key)})
	if missingS3(err) {
		return false, nil
	}
	if err != nil {
		return false, knowledgeDocumentStorageError("unavailable", "document_storage_unavailable")
	}
	if aws.ToInt64(result.ContentLength) != expectedBytes || strings.ToLower(strings.TrimSpace(result.Metadata["content-sha256"])) != expectedSHA256 {
		return false, knowledgeDocumentStorageError("unavailable", "document_content_mismatch")
	}
	return true, nil
}

func (store *S3) deleteKnowledgeDocumentObject(ctx context.Context, key string) error {
	_, err := store.client.DeleteObject(ctx, &s3.DeleteObjectInput{Bucket: aws.String(store.bucket), Key: aws.String(key)})
	if missingS3(err) {
		return nil
	}
	return err
}

func (store *S3) cleanupKnowledgeDocumentObject(ctx context.Context, key string) {
	cleanup, cancel := context.WithTimeout(context.WithoutCancel(ctx), 30*time.Second)
	defer cancel()
	_ = store.deleteKnowledgeDocumentObject(cleanup, key)
}

func (store *S3) abortKnowledgeDocumentMultipart(ctx context.Context, key, uploadID string) {
	cleanup, cancel := context.WithTimeout(context.WithoutCancel(ctx), 30*time.Second)
	defer cancel()
	_, _ = store.client.AbortMultipartUpload(cleanup, &s3.AbortMultipartUploadInput{
		Bucket: aws.String(store.bucket), Key: aws.String(key), UploadId: aws.String(uploadID),
	})
}

func (store *S3) putKnowledgeDocumentMultipart(ctx context.Context, contentKey, deletedKey, expectedSHA256 string, expectedBytes int64, content io.Reader) error {
	created, err := store.client.CreateMultipartUpload(ctx, &s3.CreateMultipartUploadInput{
		Bucket: aws.String(store.bucket), Key: aws.String(contentKey), ContentType: aws.String("application/octet-stream"),
		ServerSideEncryption: types.ServerSideEncryptionAes256,
		Metadata:             map[string]string{"content-sha256": expectedSHA256},
	})
	if err != nil || strings.TrimSpace(aws.ToString(created.UploadId)) == "" {
		return knowledgeDocumentStorageError("unavailable", "document_storage_unavailable")
	}
	uploadID := aws.ToString(created.UploadId)
	completed := false
	defer func() {
		if !completed {
			store.abortKnowledgeDocumentMultipart(ctx, contentKey, uploadID)
		}
	}()

	digest := sha256.New()
	limited := &io.LimitedReader{R: content, N: expectedBytes + 1}
	hashed := io.TeeReader(limited, digest)
	buffer := make([]byte, knowledgeDocumentMultipartPartBytes)
	parts := make([]types.CompletedPart, 0, (expectedBytes+knowledgeDocumentMultipartPartBytes-1)/knowledgeDocumentMultipartPartBytes)
	remaining := expectedBytes
	for partNumber := int32(1); remaining > 0; partNumber++ {
		partBytes := knowledgeDocumentMultipartPartBytes
		if remaining < partBytes {
			partBytes = remaining
		}
		payload := buffer[:partBytes]
		if _, err = io.ReadFull(hashed, payload); err != nil {
			return knowledgeDocumentStorageError("bad_request", "document_content_mismatch")
		}
		uploaded, uploadErr := store.client.UploadPart(ctx, &s3.UploadPartInput{
			Bucket: aws.String(store.bucket), Key: aws.String(contentKey), UploadId: aws.String(uploadID),
			PartNumber: aws.Int32(partNumber), ContentLength: aws.Int64(partBytes), Body: bytes.NewReader(payload),
		})
		if uploadErr != nil || strings.TrimSpace(aws.ToString(uploaded.ETag)) == "" {
			return knowledgeDocumentStorageError("unavailable", "document_storage_unavailable")
		}
		parts = append(parts, types.CompletedPart{ETag: uploaded.ETag, PartNumber: aws.Int32(partNumber)})
		remaining -= partBytes
	}
	extra, readErr := io.ReadAll(io.LimitReader(hashed, 1))
	if readErr != nil || limited.N > 1 || len(extra) != 0 || hex.EncodeToString(digest.Sum(nil)) != expectedSHA256 {
		return knowledgeDocumentStorageError("bad_request", "document_content_mismatch")
	}
	if deleted, checkErr := store.knowledgeDocumentDeleted(ctx, deletedKey); checkErr != nil {
		return checkErr
	} else if deleted {
		return knowledgeDocumentStorageError("not_found", "document_not_found")
	}
	_, err = store.client.CompleteMultipartUpload(ctx, &s3.CompleteMultipartUploadInput{
		Bucket: aws.String(store.bucket), Key: aws.String(contentKey), UploadId: aws.String(uploadID),
		MultipartUpload: &types.CompletedMultipartUpload{Parts: parts},
	})
	if err != nil {
		return err
	}
	completed = true
	return nil
}

// PutKnowledgeDocumentContent streams the original directly to object storage.
// The deletion marker is checked before and after the write so a late upload
// can never make a deleted document readable again.
func (store *S3) PutKnowledgeDocumentContent(ctx context.Context, scope agentsdk.KnowledgeDocumentStorageScope, documentID, expectedSHA256 string, expectedBytes int64, content io.Reader) (string, error) {
	if err := ctx.Err(); err != nil {
		return "", err
	}
	if !knowledgeDocumentSHA256Pattern.MatchString(expectedSHA256) || expectedBytes < 1 || expectedBytes > agentsdk.KnowledgeDocumentMaximumBytes || content == nil {
		return "", knowledgeDocumentStorageError("bad_request", "document_content_mismatch")
	}
	contentKey, deletedKey, err := store.knowledgeDocumentKeys(scope, documentID)
	if err != nil {
		return "", err
	}
	if deleted, checkErr := store.knowledgeDocumentDeleted(ctx, deletedKey); checkErr != nil {
		return "", checkErr
	} else if deleted {
		return "", knowledgeDocumentStorageError("not_found", "document_not_found")
	}
	if found, headErr := store.knowledgeDocumentHead(ctx, contentKey, expectedSHA256, expectedBytes); headErr != nil {
		return "", headErr
	} else if found {
		if deleted, markerErr := store.knowledgeDocumentDeleted(ctx, deletedKey); markerErr != nil {
			return "", markerErr
		} else if deleted {
			return "", knowledgeDocumentStorageError("not_found", "document_not_found")
		}
		return knowledgeDocumentReference(expectedSHA256), nil
	}

	var putErr error
	if expectedBytes > knowledgeDocumentMultipartPartBytes {
		putErr = store.putKnowledgeDocumentMultipart(ctx, contentKey, deletedKey, expectedSHA256, expectedBytes, content)
	} else {
		digest := sha256.New()
		limited := &io.LimitedReader{R: content, N: expectedBytes + 1}
		body := io.LimitReader(io.TeeReader(limited, digest), expectedBytes)
		_, putErr = store.client.PutObject(ctx, &s3.PutObjectInput{
			Bucket: aws.String(store.bucket), Key: aws.String(contentKey), Body: body,
			ContentLength: aws.Int64(expectedBytes), ContentType: aws.String("application/octet-stream"),
			ServerSideEncryption: types.ServerSideEncryptionAes256,
			Metadata:             map[string]string{"content-sha256": expectedSHA256},
		})
		if putErr == nil {
			extra, readErr := io.ReadAll(io.LimitReader(limited, 1))
			if readErr != nil || limited.N > 1 || len(extra) != 0 || hex.EncodeToString(digest.Sum(nil)) != expectedSHA256 {
				store.cleanupKnowledgeDocumentObject(ctx, contentKey)
				return "", knowledgeDocumentStorageError("bad_request", "document_content_mismatch")
			}
		}
	}
	if putErr != nil {
		if found, headErr := store.knowledgeDocumentHead(ctx, contentKey, expectedSHA256, expectedBytes); headErr == nil && found {
			if deleted, markerErr := store.knowledgeDocumentDeleted(ctx, deletedKey); markerErr == nil && !deleted {
				return knowledgeDocumentReference(expectedSHA256), nil
			}
		}
		var coded *agentsdk.Error
		if errors.As(putErr, &coded) {
			return "", putErr
		}
		return "", knowledgeDocumentStorageError("unavailable", "document_storage_unavailable")
	}
	if deleted, checkErr := store.knowledgeDocumentDeleted(ctx, deletedKey); checkErr != nil || deleted {
		store.cleanupKnowledgeDocumentObject(ctx, contentKey)
		if checkErr != nil {
			return "", checkErr
		}
		return "", knowledgeDocumentStorageError("not_found", "document_not_found")
	}
	return knowledgeDocumentReference(expectedSHA256), nil
}

func knowledgeDocumentChunkKey(contentKey string, offset int64) string {
	return strings.TrimSuffix(contentKey, ".bin") + fmt.Sprintf(".upload/%04d", offset/agentsdk.KnowledgeDocumentUploadChunkBytes)
}

func (store *S3) knowledgeDocumentChunkHead(ctx context.Context, key, expectedSHA256 string, expectedBytes, offset, chunkBytes int64, chunkSHA256 string) (bool, error) {
	result, err := store.client.HeadObject(ctx, &s3.HeadObjectInput{Bucket: aws.String(store.bucket), Key: aws.String(key)})
	if missingS3(err) {
		return false, nil
	}
	if err != nil {
		return false, knowledgeDocumentStorageError("unavailable", "document_storage_unavailable")
	}
	if aws.ToInt64(result.ContentLength) != chunkBytes || strings.ToLower(strings.TrimSpace(result.Metadata["content-sha256"])) != expectedSHA256 || result.Metadata["content-bytes"] != fmt.Sprint(expectedBytes) || result.Metadata["chunk-offset"] != fmt.Sprint(offset) || chunkSHA256 != "" && strings.ToLower(strings.TrimSpace(result.Metadata["chunk-sha256"])) != chunkSHA256 {
		return false, knowledgeDocumentStorageError("conflict", "document_upload_content_conflict")
	}
	return true, nil
}

func verifyKnowledgeDocumentChunk(content io.Reader, chunkBytes int64, chunkSHA256 string) error {
	_, err := readKnowledgeDocumentChunk(content, chunkBytes, chunkSHA256)
	return err
}

func readKnowledgeDocumentChunk(content io.Reader, chunkBytes int64, chunkSHA256 string) ([]byte, error) {
	payload := make([]byte, chunkBytes)
	digest := sha256.New()
	limited := &io.LimitedReader{R: content, N: chunkBytes + 1}
	written, err := io.ReadFull(io.TeeReader(limited, digest), payload)
	if err != nil || int64(written) != chunkBytes {
		return nil, knowledgeDocumentStorageError("bad_request", "document_content_mismatch")
	}
	extra, err := io.ReadAll(io.LimitReader(limited, 1))
	if err != nil || limited.N != 1 || len(extra) != 0 || hex.EncodeToString(digest.Sum(nil)) != chunkSHA256 {
		return nil, knowledgeDocumentStorageError("bad_request", "document_content_mismatch")
	}
	return payload, nil
}

type stagedKnowledgeDocumentReader struct {
	ctx    context.Context
	store  *S3
	keys   []string
	index  int
	body   io.ReadCloser
	closed bool
}

func (reader *stagedKnowledgeDocumentReader) Read(buffer []byte) (int, error) {
	for {
		if reader.closed {
			return 0, errors.New("staged Knowledge document reader is closed")
		}
		if reader.body == nil {
			if reader.index >= len(reader.keys) {
				return 0, io.EOF
			}
			result, err := reader.store.client.GetObject(reader.ctx, &s3.GetObjectInput{Bucket: aws.String(reader.store.bucket), Key: aws.String(reader.keys[reader.index])})
			if err != nil {
				return 0, knowledgeDocumentStorageError("unavailable", "document_storage_unavailable")
			}
			reader.body = result.Body
		}
		n, err := reader.body.Read(buffer)
		if err == io.EOF {
			_ = reader.body.Close()
			reader.body = nil
			reader.index++
			if n > 0 {
				return n, nil
			}
			continue
		}
		return n, err
	}
}

func (reader *stagedKnowledgeDocumentReader) Close() error {
	reader.closed = true
	if reader.body != nil {
		return reader.body.Close()
	}
	return nil
}

// PutKnowledgeDocumentContentChunk stores replay-safe 8 MiB parts as private
// objects. On the final part it streams those objects into the ordinary
// immutable S3 publish path, so no complete original is assembled in memory.
func (store *S3) PutKnowledgeDocumentContentChunk(ctx context.Context, scope agentsdk.KnowledgeDocumentStorageScope, documentID, expectedSHA256 string, expectedBytes, offset int64, chunkSHA256 string, chunkBytes int64, content io.Reader) (int64, string, error) {
	if !knowledgeDocumentSHA256Pattern.MatchString(expectedSHA256) || !knowledgeDocumentSHA256Pattern.MatchString(chunkSHA256) || expectedBytes < 1 || expectedBytes > agentsdk.KnowledgeDocumentMaximumBytes || offset < 0 || offset%agentsdk.KnowledgeDocumentUploadChunkBytes != 0 || chunkBytes < 1 || chunkBytes > agentsdk.KnowledgeDocumentUploadChunkBytes || offset+chunkBytes > expectedBytes || offset+chunkBytes < expectedBytes && chunkBytes != agentsdk.KnowledgeDocumentUploadChunkBytes || content == nil {
		return 0, "", knowledgeDocumentStorageError("bad_request", "document_content_mismatch")
	}
	contentKey, deletedKey, err := store.knowledgeDocumentKeys(scope, documentID)
	if err != nil {
		return 0, "", err
	}
	if deleted, checkErr := store.knowledgeDocumentDeleted(ctx, deletedKey); checkErr != nil {
		return 0, "", checkErr
	} else if deleted {
		return 0, "", knowledgeDocumentStorageError("not_found", "document_not_found")
	}
	if found, headErr := store.knowledgeDocumentHead(ctx, contentKey, expectedSHA256, expectedBytes); headErr != nil {
		return 0, "", headErr
	} else if found {
		if err = verifyKnowledgeDocumentChunk(content, chunkBytes, chunkSHA256); err != nil {
			return 0, "", err
		}
		return expectedBytes, knowledgeDocumentReference(expectedSHA256), nil
	}
	if offset > 0 {
		previousOffset := offset - agentsdk.KnowledgeDocumentUploadChunkBytes
		previousKey := knowledgeDocumentChunkKey(contentKey, previousOffset)
		present, previousErr := store.knowledgeDocumentChunkHead(ctx, previousKey, expectedSHA256, expectedBytes, previousOffset, agentsdk.KnowledgeDocumentUploadChunkBytes, "")
		if previousErr != nil {
			return 0, "", previousErr
		}
		if !present {
			return 0, "", knowledgeDocumentStorageError("conflict", "document_upload_offset_conflict")
		}
	}
	key := knowledgeDocumentChunkKey(contentKey, offset)
	if present, headErr := store.knowledgeDocumentChunkHead(ctx, key, expectedSHA256, expectedBytes, offset, chunkBytes, chunkSHA256); headErr != nil {
		return 0, "", headErr
	} else if present {
		if err = verifyKnowledgeDocumentChunk(content, chunkBytes, chunkSHA256); err != nil {
			return 0, "", err
		}
	} else {
		payload, readErr := readKnowledgeDocumentChunk(content, chunkBytes, chunkSHA256)
		if readErr != nil {
			return 0, "", readErr
		}
		_, putErr := store.client.PutObject(ctx, &s3.PutObjectInput{
			Bucket: aws.String(store.bucket), Key: aws.String(key), Body: bytes.NewReader(payload), IfNoneMatch: aws.String("*"),
			ContentLength: aws.Int64(chunkBytes), ContentType: aws.String("application/octet-stream"),
			ServerSideEncryption: types.ServerSideEncryptionAes256,
			Metadata:             map[string]string{"content-sha256": expectedSHA256, "content-bytes": fmt.Sprint(expectedBytes), "chunk-offset": fmt.Sprint(offset), "chunk-sha256": chunkSHA256},
		})
		if putErr != nil {
			// A concurrent retry may have won the conditional create. Only treat
			// that as success when its immutable metadata is exactly this part.
			if present, headErr := store.knowledgeDocumentChunkHead(ctx, key, expectedSHA256, expectedBytes, offset, chunkBytes, chunkSHA256); headErr != nil || !present {
				return 0, "", knowledgeDocumentStorageError("unavailable", "document_storage_unavailable")
			}
		}
	}
	// Delete can race after the initial marker check. Recheck after the durable
	// part write and remove this key so a late writer cannot leave orphaned
	// staging data behind the permanent deletion fence.
	if deleted, checkErr := store.knowledgeDocumentDeleted(ctx, deletedKey); checkErr != nil || deleted {
		store.cleanupKnowledgeDocumentObject(ctx, key)
		if checkErr != nil {
			return 0, "", checkErr
		}
		return 0, "", knowledgeDocumentStorageError("not_found", "document_not_found")
	}
	next := offset + chunkBytes
	for next < expectedBytes {
		stagedBytes := agentsdk.KnowledgeDocumentUploadChunkBytes
		if remaining := expectedBytes - next; remaining < stagedBytes {
			stagedBytes = remaining
		}
		present, stagedErr := store.knowledgeDocumentChunkHead(ctx, knowledgeDocumentChunkKey(contentKey, next), expectedSHA256, expectedBytes, next, stagedBytes, "")
		if stagedErr != nil {
			return 0, "", stagedErr
		}
		if !present {
			break
		}
		next += stagedBytes
	}
	if next < expectedBytes {
		return next, "", nil
	}
	partCount := (expectedBytes + agentsdk.KnowledgeDocumentUploadChunkBytes - 1) / agentsdk.KnowledgeDocumentUploadChunkBytes
	keys := make([]string, 0, partCount)
	for index := int64(0); index < partCount; index++ {
		partOffset := index * agentsdk.KnowledgeDocumentUploadChunkBytes
		partBytes := agentsdk.KnowledgeDocumentUploadChunkBytes
		if remaining := expectedBytes - partOffset; remaining < partBytes {
			partBytes = remaining
		}
		partKey := knowledgeDocumentChunkKey(contentKey, partOffset)
		present, partErr := store.knowledgeDocumentChunkHead(ctx, partKey, expectedSHA256, expectedBytes, partOffset, partBytes, "")
		if partErr != nil {
			return 0, "", partErr
		}
		if !present {
			return 0, "", knowledgeDocumentStorageError("conflict", "document_upload_offset_conflict")
		}
		keys = append(keys, partKey)
	}
	staged := &stagedKnowledgeDocumentReader{ctx: ctx, store: store, keys: keys}
	reference, err := store.PutKnowledgeDocumentContent(ctx, scope, documentID, expectedSHA256, expectedBytes, staged)
	_ = staged.Close()
	if err != nil {
		return 0, "", err
	}
	for _, stagedKey := range keys {
		store.cleanupKnowledgeDocumentObject(ctx, stagedKey)
	}
	return expectedBytes, reference, nil
}

func (store *S3) OpenKnowledgeDocumentContent(ctx context.Context, scope agentsdk.KnowledgeDocumentStorageScope, documentID, reference, expectedSHA256 string, expectedBytes int64) (io.ReadSeekCloser, error) {
	if err := ctx.Err(); err != nil {
		return nil, err
	}
	if !knowledgeDocumentSHA256Pattern.MatchString(expectedSHA256) || !knowledgeDocumentReferencePattern.MatchString(reference) || reference != knowledgeDocumentReference(expectedSHA256) || expectedBytes < 1 || expectedBytes > agentsdk.KnowledgeDocumentMaximumBytes {
		return nil, knowledgeDocumentStorageError("bad_request", "document_reference_invalid")
	}
	contentKey, deletedKey, err := store.knowledgeDocumentKeys(scope, documentID)
	if err != nil {
		return nil, err
	}
	if deleted, checkErr := store.knowledgeDocumentDeleted(ctx, deletedKey); checkErr != nil {
		return nil, checkErr
	} else if deleted {
		return nil, knowledgeDocumentStorageError("not_found", "document_not_found")
	}
	if found, headErr := store.knowledgeDocumentHead(ctx, contentKey, expectedSHA256, expectedBytes); headErr != nil {
		return nil, headErr
	} else if !found {
		return nil, knowledgeDocumentStorageError("not_found", "document_content_not_found")
	}
	return &s3KnowledgeDocumentReader{ctx: ctx, client: store.client, bucket: store.bucket, key: contentKey, size: expectedBytes}, nil
}

func (store *S3) DeleteKnowledgeDocumentContent(ctx context.Context, scope agentsdk.KnowledgeDocumentStorageScope, documentID string) error {
	contentKey, deletedKey, err := store.knowledgeDocumentKeys(scope, documentID)
	if err != nil {
		return err
	}
	_, err = store.client.PutObject(ctx, &s3.PutObjectInput{
		Bucket: aws.String(store.bucket), Key: aws.String(deletedKey), Body: strings.NewReader("deleted"),
		ContentLength: aws.Int64(7), ContentType: aws.String("text/plain"), ServerSideEncryption: types.ServerSideEncryptionAes256,
	})
	if err != nil {
		return knowledgeDocumentStorageError("unavailable", "document_storage_unavailable")
	}
	if err = store.deleteKnowledgeDocumentObject(ctx, contentKey); err != nil {
		return knowledgeDocumentStorageError("unavailable", "document_storage_unavailable")
	}
	for offset := int64(0); offset < agentsdk.KnowledgeDocumentMaximumBytes; offset += agentsdk.KnowledgeDocumentUploadChunkBytes {
		key := knowledgeDocumentChunkKey(contentKey, offset)
		_, headErr := store.client.HeadObject(ctx, &s3.HeadObjectInput{Bucket: aws.String(store.bucket), Key: aws.String(key)})
		if missingS3(headErr) {
			break
		}
		if headErr != nil {
			return knowledgeDocumentStorageError("unavailable", "document_storage_unavailable")
		}
		if err = store.deleteKnowledgeDocumentObject(ctx, key); err != nil {
			return knowledgeDocumentStorageError("unavailable", "document_storage_unavailable")
		}
	}
	return nil
}

type s3KnowledgeDocumentReader struct {
	ctx    context.Context
	client s3Client
	bucket string
	key    string
	size   int64
	offset int64
	body   io.ReadCloser
	closed bool
}

func (reader *s3KnowledgeDocumentReader) Read(buffer []byte) (int, error) {
	if reader.closed {
		return 0, errors.New("Knowledge document reader is closed")
	}
	if len(buffer) == 0 {
		return 0, nil
	}
	if reader.offset >= reader.size {
		return 0, io.EOF
	}
	if reader.body == nil {
		rangeHeader := fmt.Sprintf("bytes=%d-", reader.offset)
		result, err := reader.client.GetObject(reader.ctx, &s3.GetObjectInput{Bucket: aws.String(reader.bucket), Key: aws.String(reader.key), Range: aws.String(rangeHeader)})
		if missingS3(err) {
			return 0, knowledgeDocumentStorageError("not_found", "document_content_not_found")
		}
		if err != nil {
			return 0, knowledgeDocumentStorageError("unavailable", "document_storage_unavailable")
		}
		reader.body = result.Body
	}
	n, err := reader.body.Read(buffer)
	reader.offset += int64(n)
	if n > 0 {
		if err == io.EOF && reader.offset < reader.size {
			return n, io.ErrUnexpectedEOF
		}
		return n, nil
	}
	if err == io.EOF && reader.offset < reader.size {
		return 0, io.ErrUnexpectedEOF
	}
	return n, err
}

// ReadAt performs a bounded object-store range read and does not disturb the
// sequential cursor. archive/zip relies on this contract for central-directory
// and entry reads; using Seek+Read here would repeatedly download object tails.
func (reader *s3KnowledgeDocumentReader) ReadAt(buffer []byte, offset int64) (int, error) {
	if reader.closed {
		return 0, errors.New("Knowledge document reader is closed")
	}
	if offset < 0 {
		return 0, errors.New("invalid Knowledge document offset")
	}
	if len(buffer) == 0 {
		return 0, nil
	}
	if offset >= reader.size {
		return 0, io.EOF
	}
	want := int64(len(buffer))
	if remaining := reader.size - offset; want > remaining {
		want = remaining
	}
	end := offset + want - 1
	result, err := reader.client.GetObject(reader.ctx, &s3.GetObjectInput{
		Bucket: aws.String(reader.bucket), Key: aws.String(reader.key),
		Range: aws.String(fmt.Sprintf("bytes=%d-%d", offset, end)),
	})
	if missingS3(err) {
		return 0, knowledgeDocumentStorageError("not_found", "document_content_not_found")
	}
	if err != nil {
		return 0, knowledgeDocumentStorageError("unavailable", "document_storage_unavailable")
	}
	defer result.Body.Close()
	n, readErr := io.ReadFull(result.Body, buffer[:want])
	if readErr != nil {
		return n, knowledgeDocumentStorageError("unavailable", "document_content_mismatch")
	}
	if int64(len(buffer)) > want {
		return n, io.EOF
	}
	return n, nil
}

func (reader *s3KnowledgeDocumentReader) Seek(offset int64, whence int) (int64, error) {
	if reader.closed {
		return 0, errors.New("Knowledge document reader is closed")
	}
	base := int64(0)
	switch whence {
	case io.SeekStart:
	case io.SeekCurrent:
		base = reader.offset
	case io.SeekEnd:
		base = reader.size
	default:
		return 0, errors.New("invalid seek origin")
	}
	if offset < -base || offset > reader.size-base {
		return 0, errors.New("invalid Knowledge document seek")
	}
	if reader.body != nil {
		_ = reader.body.Close()
		reader.body = nil
	}
	reader.offset = base + offset
	return reader.offset, nil
}

func (reader *s3KnowledgeDocumentReader) Close() error {
	if reader.closed {
		return nil
	}
	reader.closed = true
	if reader.body != nil {
		return reader.body.Close()
	}
	return nil
}

var _ agentsdk.KnowledgeDocumentStorage = (*S3)(nil)
var _ agentsdk.KnowledgeDocumentChunkStorage = (*S3)(nil)
