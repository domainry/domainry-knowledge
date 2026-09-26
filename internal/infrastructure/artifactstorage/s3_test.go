package artifactstorage

import (
	"bytes"
	"context"
	"io"
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
	mu      sync.Mutex
	objects map[string]fakeS3Object
}

func (value *fakeS3) PutObject(_ context.Context, input *s3.PutObjectInput, _ ...func(*s3.Options)) (*s3.PutObjectOutput, error) {
	raw, err := io.ReadAll(input.Body)
	if err != nil {
		return nil, err
	}
	value.mu.Lock()
	defer value.mu.Unlock()
	value.objects[aws.ToString(input.Key)] = fakeS3Object{content: raw, metadata: input.Metadata}
	return &s3.PutObjectOutput{}, nil
}

func (value *fakeS3) GetObject(_ context.Context, input *s3.GetObjectInput, _ ...func(*s3.Options)) (*s3.GetObjectOutput, error) {
	value.mu.Lock()
	defer value.mu.Unlock()
	object, found := value.objects[aws.ToString(input.Key)]
	if !found {
		return nil, &types.NoSuchKey{}
	}
	return &s3.GetObjectOutput{Body: io.NopCloser(bytes.NewReader(object.content)), ContentLength: aws.Int64(int64(len(object.content))), Metadata: object.metadata}, nil
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
