package artifactstorage

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"io"
	"net/url"
	"path"
	"strings"

	"github.com/aws/aws-sdk-go-v2/aws"
	awsconfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
	"github.com/aws/smithy-go"
	sharedartifact "github.com/domainry/domainry-foundation/artifact"
)

const defaultS3Prefix = "domainry-knowledge"

type S3Config struct {
	Region         string
	Bucket         string
	Prefix         string
	Endpoint       string
	ForcePathStyle bool
}

type s3Client interface {
	PutObject(context.Context, *s3.PutObjectInput, ...func(*s3.Options)) (*s3.PutObjectOutput, error)
	GetObject(context.Context, *s3.GetObjectInput, ...func(*s3.Options)) (*s3.GetObjectOutput, error)
	HeadObject(context.Context, *s3.HeadObjectInput, ...func(*s3.Options)) (*s3.HeadObjectOutput, error)
	DeleteObject(context.Context, *s3.DeleteObjectInput, ...func(*s3.Options)) (*s3.DeleteObjectOutput, error)
}

type S3 struct {
	client s3Client
	bucket string
	prefix string
}

func NewS3(ctx context.Context, config S3Config) (*S3, error) {
	if err := config.validate(); err != nil {
		return nil, err
	}
	awsConfiguration, err := awsconfig.LoadDefaultConfig(ctx, awsconfig.WithRegion(strings.TrimSpace(config.Region)))
	if err != nil {
		return nil, fmt.Errorf("load Knowledge S3 configuration: %w", err)
	}
	if _, err = awsConfiguration.Credentials.Retrieve(ctx); err != nil {
		return nil, fmt.Errorf("retrieve Knowledge S3 credentials: %w", err)
	}
	client := s3.NewFromConfig(awsConfiguration, func(options *s3.Options) {
		if endpoint := strings.TrimSpace(config.Endpoint); endpoint != "" {
			options.BaseEndpoint = aws.String(endpoint)
		}
		options.UsePathStyle = config.ForcePathStyle
	})
	return newS3(config, client)
}

func newS3(config S3Config, client s3Client) (*S3, error) {
	if err := config.validate(); err != nil {
		return nil, err
	}
	if client == nil {
		return nil, errors.New("Knowledge S3 client is required")
	}
	prefix := strings.Trim(strings.TrimSpace(config.Prefix), "/")
	if prefix == "" {
		prefix = defaultS3Prefix
	}
	if path.Clean(prefix) != prefix || strings.HasPrefix(prefix, "..") {
		return nil, errors.New("KNOWLEDGE_S3_PREFIX must be a clean relative path")
	}
	return &S3{client: client, bucket: strings.TrimSpace(config.Bucket), prefix: prefix}, nil
}

func (config S3Config) validate() error {
	if strings.TrimSpace(config.Region) == "" {
		return errors.New("KNOWLEDGE_S3_REGION is required")
	}
	if strings.TrimSpace(config.Bucket) == "" {
		return errors.New("KNOWLEDGE_S3_BUCKET is required")
	}
	if endpoint := strings.TrimSpace(config.Endpoint); endpoint != "" {
		parsed, err := url.Parse(endpoint)
		if err != nil || parsed.Host == "" || parsed.RawQuery != "" || parsed.Fragment != "" || parsed.Scheme != "https" && !loopbackHTTP(parsed) {
			return errors.New("KNOWLEDGE_S3_ENDPOINT must be HTTPS unless it targets loopback")
		}
	}
	return nil
}

func (store *S3) PutImmutable(ctx context.Context, workspaceID, identity string, content []byte) (sharedartifact.ContentInfo, error) {
	if err := ctx.Err(); err != nil {
		return sharedartifact.ContentInfo{}, err
	}
	if strings.TrimSpace(identity) == "" || len(content) == 0 || int64(len(content)) > maxSharedBytes {
		return sharedartifact.ContentInfo{}, errors.New("shared artifact identity or size is invalid")
	}
	workspaceHash, err := workspaceName(workspaceID)
	if err != nil {
		return sharedartifact.ContentInfo{}, err
	}
	contentHash := sha256.Sum256(content)
	identityHash := sha256.Sum256([]byte(strings.TrimSpace(identity)))
	reference := "artifact_" + hex.EncodeToString(identityHash[:16]) + "_" + hex.EncodeToString(contentHash[:])
	if info, statErr := store.Stat(ctx, workspaceID, reference); statErr == nil {
		if info.SHA256 != hex.EncodeToString(contentHash[:]) || info.Size != int64(len(content)) {
			return sharedartifact.ContentInfo{}, sharedartifact.ErrIdentityConflict
		}
		return info, nil
	} else if !errors.Is(statErr, sharedartifact.ErrContentNotFound) {
		return sharedartifact.ContentInfo{}, statErr
	}
	key := store.objectKey(workspaceHash, reference)
	_, err = store.client.PutObject(ctx, &s3.PutObjectInput{
		Bucket: aws.String(store.bucket), Key: aws.String(key), Body: bytes.NewReader(content),
		ContentLength: aws.Int64(int64(len(content))), ContentType: aws.String("application/octet-stream"),
		ServerSideEncryption: types.ServerSideEncryptionAes256,
		Metadata:             map[string]string{"content-sha256": hex.EncodeToString(contentHash[:]), "identity-sha256": hex.EncodeToString(identityHash[:]), "workspace-sha256": workspaceHash},
	})
	if err != nil {
		return sharedartifact.ContentInfo{}, fmt.Errorf("put Knowledge S3 object: %w", err)
	}
	return sharedartifact.ContentInfo{Reference: reference, SHA256: hex.EncodeToString(contentHash[:]), Size: int64(len(content))}, nil
}

func (store *S3) Open(ctx context.Context, workspaceID, reference string) (io.ReadCloser, error) {
	workspaceHash, err := store.validReference(workspaceID, reference)
	if err != nil {
		return nil, err
	}
	result, err := store.client.GetObject(ctx, &s3.GetObjectInput{Bucket: aws.String(store.bucket), Key: aws.String(store.objectKey(workspaceHash, reference))})
	if missingS3(err) {
		return nil, sharedartifact.ErrContentNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("get Knowledge S3 object: %w", err)
	}
	return result.Body, nil
}

func (store *S3) Stat(ctx context.Context, workspaceID, reference string) (sharedartifact.ContentInfo, error) {
	workspaceHash, err := store.validReference(workspaceID, reference)
	if err != nil {
		return sharedartifact.ContentInfo{}, err
	}
	result, err := store.client.HeadObject(ctx, &s3.HeadObjectInput{Bucket: aws.String(store.bucket), Key: aws.String(store.objectKey(workspaceHash, reference))})
	if missingS3(err) {
		return sharedartifact.ContentInfo{}, sharedartifact.ErrContentNotFound
	}
	if err != nil {
		return sharedartifact.ContentInfo{}, fmt.Errorf("stat Knowledge S3 object: %w", err)
	}
	contentHash := strings.ToLower(strings.TrimSpace(result.Metadata["content-sha256"]))
	if len(contentHash) != 64 || aws.ToInt64(result.ContentLength) < 1 || aws.ToInt64(result.ContentLength) > maxSharedBytes {
		return sharedartifact.ContentInfo{}, errors.New("Knowledge S3 object metadata is invalid")
	}
	return sharedartifact.ContentInfo{Reference: reference, SHA256: contentHash, Size: aws.ToInt64(result.ContentLength)}, nil
}

func (store *S3) Delete(ctx context.Context, workspaceID, reference string) error {
	workspaceHash, err := store.validReference(workspaceID, reference)
	if err != nil {
		return err
	}
	_, err = store.client.DeleteObject(ctx, &s3.DeleteObjectInput{Bucket: aws.String(store.bucket), Key: aws.String(store.objectKey(workspaceHash, reference))})
	if missingS3(err) {
		return nil
	}
	if err != nil {
		return fmt.Errorf("delete Knowledge S3 object: %w", err)
	}
	return nil
}

func (*S3) Close() error { return nil }

func (store *S3) validReference(workspaceID, reference string) (string, error) {
	if !sharedReference.MatchString(strings.TrimSpace(reference)) {
		return "", errors.New("shared artifact reference is invalid")
	}
	return workspaceName(workspaceID)
}

func (store *S3) objectKey(workspaceHash, reference string) string {
	return store.prefix + "/" + workspaceHash + "/" + reference + ".blob"
}

func missingS3(err error) bool {
	if err == nil {
		return false
	}
	var noSuchKey *types.NoSuchKey
	if errors.As(err, &noSuchKey) {
		return true
	}
	var apiError smithy.APIError
	if errors.As(err, &apiError) {
		switch apiError.ErrorCode() {
		case "NoSuchKey", "NotFound", "NoSuchBucket":
			return true
		}
	}
	return false
}

func loopbackHTTP(value *url.URL) bool {
	if value.Scheme != "http" {
		return false
	}
	switch value.Hostname() {
	case "localhost", "127.0.0.1", "::1":
		return true
	default:
		return false
	}
}

var _ SharedStorage = (*S3)(nil)
