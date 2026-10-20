package artifactstorage

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"io"
	"sort"
	"strconv"
	"strings"
	"sync"
	"testing"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
	sharedartifact "github.com/domainry/domainry-foundation/artifact"
)

type fakeS3Object struct {
	content  []byte
	metadata map[string]string
}

type fakeS3 struct {
	mu               sync.Mutex
	objects          map[string]fakeS3Object
	multipart        map[string]*fakeS3Multipart
	nextUpload       int
	uploadedParts    int
	completedUploads int
	abortedUploads   int
}

type fakeS3Multipart struct {
	key, contentType string
	metadata         map[string]string
	parts            map[int32][]byte
}

func (value *fakeS3) PutObject(_ context.Context, input *s3.PutObjectInput, _ ...func(*s3.Options)) (*s3.PutObjectOutput, error) {
	raw, err := io.ReadAll(input.Body)
	if err != nil {
		return nil, err
	}
	value.mu.Lock()
	defer value.mu.Unlock()
	key := aws.ToString(input.Key)
	if aws.ToString(input.IfNoneMatch) == "*" {
		if _, exists := value.objects[key]; exists {
			return nil, errors.New("precondition failed")
		}
	}
	value.objects[key] = fakeS3Object{content: raw, metadata: input.Metadata}
	return &s3.PutObjectOutput{}, nil
}

func (value *fakeS3) CreateMultipartUpload(_ context.Context, input *s3.CreateMultipartUploadInput, _ ...func(*s3.Options)) (*s3.CreateMultipartUploadOutput, error) {
	value.mu.Lock()
	defer value.mu.Unlock()
	value.nextUpload++
	id := fmt.Sprintf("upload-%d", value.nextUpload)
	if value.multipart == nil {
		value.multipart = map[string]*fakeS3Multipart{}
	}
	value.multipart[id] = &fakeS3Multipart{key: aws.ToString(input.Key), contentType: aws.ToString(input.ContentType), metadata: input.Metadata, parts: map[int32][]byte{}}
	return &s3.CreateMultipartUploadOutput{UploadId: aws.String(id)}, nil
}

func (value *fakeS3) UploadPart(_ context.Context, input *s3.UploadPartInput, _ ...func(*s3.Options)) (*s3.UploadPartOutput, error) {
	raw, err := io.ReadAll(input.Body)
	if err != nil {
		return nil, err
	}
	value.mu.Lock()
	defer value.mu.Unlock()
	upload := value.multipart[aws.ToString(input.UploadId)]
	if upload == nil || upload.key != aws.ToString(input.Key) || int64(len(raw)) != aws.ToInt64(input.ContentLength) {
		return nil, io.ErrUnexpectedEOF
	}
	part := aws.ToInt32(input.PartNumber)
	upload.parts[part] = append([]byte(nil), raw...)
	value.uploadedParts++
	return &s3.UploadPartOutput{ETag: aws.String(fmt.Sprintf("etag-%d", part))}, nil
}

func (value *fakeS3) CompleteMultipartUpload(_ context.Context, input *s3.CompleteMultipartUploadInput, _ ...func(*s3.Options)) (*s3.CompleteMultipartUploadOutput, error) {
	value.mu.Lock()
	defer value.mu.Unlock()
	id := aws.ToString(input.UploadId)
	upload := value.multipart[id]
	if upload == nil || upload.key != aws.ToString(input.Key) || input.MultipartUpload == nil {
		return nil, io.ErrUnexpectedEOF
	}
	parts := append([]types.CompletedPart(nil), input.MultipartUpload.Parts...)
	sort.Slice(parts, func(i, j int) bool { return aws.ToInt32(parts[i].PartNumber) < aws.ToInt32(parts[j].PartNumber) })
	var content []byte
	for _, completed := range parts {
		part := aws.ToInt32(completed.PartNumber)
		raw, found := upload.parts[part]
		if !found {
			return nil, io.ErrUnexpectedEOF
		}
		content = append(content, raw...)
	}
	value.objects[upload.key] = fakeS3Object{content: content, metadata: upload.metadata}
	delete(value.multipart, id)
	value.completedUploads++
	return &s3.CompleteMultipartUploadOutput{}, nil
}

func (value *fakeS3) AbortMultipartUpload(_ context.Context, input *s3.AbortMultipartUploadInput, _ ...func(*s3.Options)) (*s3.AbortMultipartUploadOutput, error) {
	value.mu.Lock()
	defer value.mu.Unlock()
	id := aws.ToString(input.UploadId)
	if _, found := value.multipart[id]; found {
		delete(value.multipart, id)
		value.abortedUploads++
	}
	return &s3.AbortMultipartUploadOutput{}, nil
}

func (value *fakeS3) GetObject(_ context.Context, input *s3.GetObjectInput, _ ...func(*s3.Options)) (*s3.GetObjectOutput, error) {
	value.mu.Lock()
	defer value.mu.Unlock()
	object, found := value.objects[aws.ToString(input.Key)]
	if !found {
		return nil, &types.NoSuchKey{}
	}
	content := object.content
	if header := aws.ToString(input.Range); header != "" {
		if !strings.HasPrefix(header, "bytes=") {
			return nil, io.ErrUnexpectedEOF
		}
		bounds := strings.Split(strings.TrimPrefix(header, "bytes="), "-")
		if len(bounds) != 2 || bounds[0] == "" {
			return nil, io.ErrUnexpectedEOF
		}
		start, err := strconv.ParseInt(bounds[0], 10, 64)
		if err != nil || start < 0 || start > int64(len(content)) {
			return nil, io.ErrUnexpectedEOF
		}
		end := int64(len(content) - 1)
		if bounds[1] != "" {
			end, err = strconv.ParseInt(bounds[1], 10, 64)
			if err != nil || end < start || end >= int64(len(content)) {
				return nil, io.ErrUnexpectedEOF
			}
		}
		content = content[start : end+1]
	}
	return &s3.GetObjectOutput{Body: io.NopCloser(bytes.NewReader(content)), ContentLength: aws.Int64(int64(len(content))), Metadata: object.metadata}, nil
}

func (value *fakeS3) HeadObject(_ context.Context, input *s3.HeadObjectInput, _ ...func(*s3.Options)) (*s3.HeadObjectOutput, error) {
	value.mu.Lock()
	defer value.mu.Unlock()
	object, found := value.objects[aws.ToString(input.Key)]
	if !found {
		return nil, &types.NoSuchKey{}
	}
	return &s3.HeadObjectOutput{ContentLength: aws.Int64(int64(len(object.content))), Metadata: object.metadata}, nil
}

func (value *fakeS3) DeleteObject(_ context.Context, input *s3.DeleteObjectInput, _ ...func(*s3.Options)) (*s3.DeleteObjectOutput, error) {
	value.mu.Lock()
	defer value.mu.Unlock()
	delete(value.objects, aws.ToString(input.Key))
	return &s3.DeleteObjectOutput{}, nil
}

func TestS3SharedStorageSupportsMinIOStyleEndpointAndContentLifecycle(t *testing.T) {
	backend := &fakeS3{objects: map[string]fakeS3Object{}}
	store, err := newS3(S3Config{Region: "us-east-1", Bucket: "knowledge", Prefix: "files", Endpoint: "http://127.0.0.1:9000", ForcePathStyle: true}, backend)
	if err != nil {
		t.Fatal(err)
	}
	raw := []byte("shared attachment")
	info, err := store.PutImmutable(t.Context(), "workspace-a", "upload-a", raw)
	if err != nil || info.Size != int64(len(raw)) {
		t.Fatalf("info=%+v err=%v", info, err)
	}
	stat, err := store.Stat(t.Context(), "workspace-a", info.Reference)
	if err != nil || stat != info {
		t.Fatalf("stat=%+v info=%+v err=%v", stat, info, err)
	}
	reader, err := store.Open(t.Context(), "workspace-a", info.Reference)
	if err != nil {
		t.Fatal(err)
	}
	loaded, readErr := io.ReadAll(reader)
	_ = reader.Close()
	if readErr != nil || !bytes.Equal(loaded, raw) {
		t.Fatalf("loaded=%q err=%v", loaded, readErr)
	}
	if err = store.Delete(t.Context(), "workspace-a", info.Reference); err != nil {
		t.Fatal(err)
	}
	if _, err = store.Open(t.Context(), "workspace-a", info.Reference); err != sharedartifact.ErrContentNotFound {
		t.Fatalf("missing err=%v", err)
	}
	if _, err = newS3(S3Config{Region: "us-east-1", Bucket: "knowledge", Endpoint: "http://minio.example.com"}, backend); err == nil {
		t.Fatal("non-loopback plaintext endpoint was accepted")
	}
}
