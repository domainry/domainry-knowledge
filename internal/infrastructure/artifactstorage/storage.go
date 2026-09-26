package artifactstorage

import (
	"context"
	"fmt"
	"io"
	"strings"

	sharedartifact "github.com/domainry/domainry-foundation/artifact"
)

type SharedStorage interface {
	sharedartifact.ContentStore
	sharedartifact.ContentWriter
	io.Closer
}

type SharedStorageConfig struct {
	Driver         string
	Region         string
	Bucket         string
	Prefix         string
	Endpoint       string
	ForcePathStyle bool
}

func OpenShared(ctx context.Context, localDirectory string, config SharedStorageConfig) (SharedStorage, error) {
	switch strings.ToLower(strings.TrimSpace(config.Driver)) {
	case "", "local":
		return NewSharedFiles(localDirectory)
	case "s3":
		return NewS3(ctx, S3Config{Region: config.Region, Bucket: config.Bucket, Prefix: config.Prefix, Endpoint: config.Endpoint, ForcePathStyle: config.ForcePathStyle})
	default:
		return nil, fmt.Errorf("Knowledge file storage driver must be local or s3")
	}
}
