package artifactstorage

import (
	"context"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/domainry/domainry-foundation/telemetry"
)

type diagnosticS3Client struct{ client s3Client }

func (client diagnosticS3Client) PutObject(ctx context.Context, input *s3.PutObjectInput, options ...func(*s3.Options)) (output *s3.PutObjectOutput, returnErr error) {
	ctx, finish := startS3Call(ctx, "put_object", s3ObjectInput(aws.ToString(input.Bucket), aws.ToString(input.Key), aws.ToInt64(input.ContentLength)))
	defer func() { finish(map[string]any{"etag": aws.ToString(outputETag(output))}, returnErr) }()
	return client.client.PutObject(ctx, input, options...)
}

func (client diagnosticS3Client) CreateMultipartUpload(ctx context.Context, input *s3.CreateMultipartUploadInput, options ...func(*s3.Options)) (output *s3.CreateMultipartUploadOutput, returnErr error) {
	ctx, finish := startS3Call(ctx, "create_multipart_upload", s3ObjectInput(aws.ToString(input.Bucket), aws.ToString(input.Key), 0))
	defer func() { finish(map[string]any{"created": output != nil}, returnErr) }()
	return client.client.CreateMultipartUpload(ctx, input, options...)
}

func (client diagnosticS3Client) UploadPart(ctx context.Context, input *s3.UploadPartInput, options ...func(*s3.Options)) (output *s3.UploadPartOutput, returnErr error) {
	values := s3ObjectInput(aws.ToString(input.Bucket), aws.ToString(input.Key), aws.ToInt64(input.ContentLength))
	values["part_number"] = aws.ToInt32(input.PartNumber)
	ctx, finish := startS3Call(ctx, "upload_part", values)
	defer func() { finish(map[string]any{"etag": aws.ToString(outputPartETag(output))}, returnErr) }()
	return client.client.UploadPart(ctx, input, options...)
}

func (client diagnosticS3Client) CompleteMultipartUpload(ctx context.Context, input *s3.CompleteMultipartUploadInput, options ...func(*s3.Options)) (output *s3.CompleteMultipartUploadOutput, returnErr error) {
	ctx, finish := startS3Call(ctx, "complete_multipart_upload", s3ObjectInput(aws.ToString(input.Bucket), aws.ToString(input.Key), 0))
	defer func() { finish(map[string]any{"completed": output != nil}, returnErr) }()
	return client.client.CompleteMultipartUpload(ctx, input, options...)
}

func (client diagnosticS3Client) AbortMultipartUpload(ctx context.Context, input *s3.AbortMultipartUploadInput, options ...func(*s3.Options)) (output *s3.AbortMultipartUploadOutput, returnErr error) {
	ctx, finish := startS3Call(ctx, "abort_multipart_upload", s3ObjectInput(aws.ToString(input.Bucket), aws.ToString(input.Key), 0))
	defer func() { finish(nil, returnErr) }()
	return client.client.AbortMultipartUpload(ctx, input, options...)
}

func (client diagnosticS3Client) GetObject(ctx context.Context, input *s3.GetObjectInput, options ...func(*s3.Options)) (output *s3.GetObjectOutput, returnErr error) {
	ctx, finish := startS3Call(ctx, "get_object", s3ObjectInput(aws.ToString(input.Bucket), aws.ToString(input.Key), 0))
	defer func() {
		bytes := int64(0)
		if output != nil {
			bytes = aws.ToInt64(output.ContentLength)
		}
		finish(map[string]any{"content_bytes": bytes}, returnErr)
	}()
	return client.client.GetObject(ctx, input, options...)
}

func (client diagnosticS3Client) HeadObject(ctx context.Context, input *s3.HeadObjectInput, options ...func(*s3.Options)) (output *s3.HeadObjectOutput, returnErr error) {
	ctx, finish := startS3Call(ctx, "head_object", s3ObjectInput(aws.ToString(input.Bucket), aws.ToString(input.Key), 0))
	defer func() {
		bytes := int64(0)
		if output != nil {
			bytes = aws.ToInt64(output.ContentLength)
		}
		finish(map[string]any{"content_bytes": bytes}, returnErr)
	}()
	return client.client.HeadObject(ctx, input, options...)
}

func (client diagnosticS3Client) DeleteObject(ctx context.Context, input *s3.DeleteObjectInput, options ...func(*s3.Options)) (output *s3.DeleteObjectOutput, returnErr error) {
	ctx, finish := startS3Call(ctx, "delete_object", s3ObjectInput(aws.ToString(input.Bucket), aws.ToString(input.Key), 0))
	defer func() { finish(nil, returnErr) }()
	return client.client.DeleteObject(ctx, input, options...)
}

func startS3Call(ctx context.Context, operation string, input map[string]any) (context.Context, func(map[string]any, error)) {
	started := time.Now()
	ctx = telemetry.WithHTTPClientOperation(ctx, "knowledge.s3."+operation)
	return ctx, func(output map[string]any, err error) {
		telemetry.RecordDependencyCall(ctx, telemetry.DependencyCall{
			Feature: telemetry.DiagnosticFeatureObjectStore, Dependency: "knowledge.s3", Operation: operation, Input: input,
		}, telemetry.DependencyResult{Output: output, Err: err}, time.Since(started))
	}
}

func s3ObjectInput(bucket, key string, contentBytes int64) map[string]any {
	return map[string]any{"bucket": bucket, "object_key": key, "content_bytes": contentBytes}
}

func outputETag(output *s3.PutObjectOutput) *string {
	if output == nil {
		return nil
	}
	return output.ETag
}

func outputPartETag(output *s3.UploadPartOutput) *string {
	if output == nil {
		return nil
	}
	return output.ETag
}

var _ s3Client = diagnosticS3Client{}
