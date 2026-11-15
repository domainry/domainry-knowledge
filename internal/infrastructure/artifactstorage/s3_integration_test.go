package artifactstorage

import (
	"bytes"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"io"
	"os"
	"strings"
	"testing"
	"time"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
)

func TestKnowledgeDocumentS3AgainstConfiguredEndpoint(t *testing.T) {
	endpoint := os.Getenv("KNOWLEDGE_S3_INTEGRATION_ENDPOINT")
	if endpoint == "" {
		t.Skip("KNOWLEDGE_S3_INTEGRATION_ENDPOINT is not configured")
	}
	store, err := NewS3(t.Context(), S3Config{
		Region:                      knowledgeIntegrationValue("KNOWLEDGE_S3_INTEGRATION_REGION", "us-east-1"),
		Bucket:                      knowledgeIntegrationValue("KNOWLEDGE_S3_INTEGRATION_BUCKET", "kb-raw"),
		Prefix:                      "integration/domainry-knowledge",
		Endpoint:                    endpoint,
		ForcePathStyle:              true,
		AllowInsecureEndpoint:       true,
		DisableServerSideEncryption: true,
	})
	if err != nil {
		t.Fatal(err)
	}
	identity := sha256.Sum256([]byte(t.Name() + time.Now().UTC().String()))
	scope := agentsdk.KnowledgeDocumentStorageScope{
		RuntimeID: "integration-runtime", WorkspaceID: "integration-workspace",
		LibraryID: "klib_" + strings.Repeat("a", 32),
	}
	documentID := "kdoc_" + hex.EncodeToString(identity[:16])
	content := []byte("domainry-knowledge-s3-integration")
	digest := sha256.Sum256(content)
	contentSHA256 := hex.EncodeToString(digest[:])
	reference, err := store.PutKnowledgeDocumentContent(t.Context(), scope, documentID, contentSHA256, int64(len(content)), bytes.NewReader(content))
	if err != nil {
		t.Fatal(err)
	}
	_, deletedKey, keyErr := store.knowledgeDocumentKeys(scope, documentID)
	if keyErr != nil {
		t.Fatal(keyErr)
	}
	defer store.cleanupKnowledgeDocumentObject(t.Context(), deletedKey)
	reader, err := store.OpenKnowledgeDocumentContent(t.Context(), scope, documentID, reference, contentSHA256, int64(len(content)))
	if err != nil {
		t.Fatal(err)
	}
	loaded, readErr := io.ReadAll(reader)
	closeErr := reader.Close()
	if readErr != nil || closeErr != nil || !bytes.Equal(loaded, content) {
		t.Fatalf("loaded=%q readErr=%v closeErr=%v", loaded, readErr, closeErr)
	}
	if err = store.DeleteKnowledgeDocumentContent(t.Context(), scope, documentID); err != nil {
		t.Fatal(err)
	}
	if _, err = store.OpenKnowledgeDocumentContent(t.Context(), scope, documentID, reference, contentSHA256, int64(len(content))); err == nil {
		t.Fatal("deleted document remained readable")
	} else {
		var coded *agentsdk.Error
		if !errors.As(err, &coded) || coded.Code != "knowledge.document_not_found" {
			t.Fatalf("deleted document err=%v", err)
		}
	}
}

func knowledgeIntegrationValue(name, fallback string) string {
	if value := os.Getenv(name); value != "" {
		return value
	}
	return fallback
}
