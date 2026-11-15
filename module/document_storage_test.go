package module

import (
	"testing"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func TestDocumentS3IsStableModuleStorage(t *testing.T) {
	t.Setenv("AWS_ACCESS_KEY_ID", "test-access-key")
	t.Setenv("AWS_SECRET_ACCESS_KEY", "test-secret-key")
	storage, err := NewDocumentS3(t.Context(), DocumentS3Config{
		Region:         "us-east-1",
		Bucket:         "knowledge-documents",
		Prefix:         "verdent/knowledge",
		Endpoint:       "http://127.0.0.1:9000",
		ForcePathStyle: true,
	})
	if err != nil {
		t.Fatal(err)
	}
	var documents knowledgesdk.KnowledgeDocumentStorage = storage
	var chunks knowledgesdk.KnowledgeDocumentChunkStorage = storage
	if documents == nil || chunks == nil {
		t.Fatal("S3 document storage contracts are unavailable")
	}
}
