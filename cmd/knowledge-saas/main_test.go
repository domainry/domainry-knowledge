package main

import (
	"testing"
	"time"
)

func TestLoadConfigurationRequiresServiceToken(t *testing.T) {
	_, err := loadConfiguration(func(string) string { return "" })
	if err == nil {
		t.Fatal("expected service token validation error")
	}
}

func TestLoadConfigurationBuildsMinIOCompatibleS3Options(t *testing.T) {
	values := map[string]string{
		"APP_ENV":                                "production",
		"KNOWLEDGE_SERVICE_ACCESS_TOKEN":         "service-secret",
		"KNOWLEDGE_RUNTIME_ID":                   "facility_ops",
		"KNOWLEDGE_FILE_STORAGE_DRIVER":          "s3",
		"KNOWLEDGE_S3_REGION":                    "us-east-1",
		"KNOWLEDGE_S3_BUCKET":                    "facility-files",
		"KNOWLEDGE_S3_PREFIX":                    "facility/knowledge",
		"KNOWLEDGE_S3_ENDPOINT":                  "https://minio.example.test",
		"KNOWLEDGE_S3_FORCE_PATH_STYLE":          "true",
		"KNOWLEDGE_DOCUMENT_UPLOAD_IDLE_TIMEOUT": "2h",
	}
	config, err := loadConfiguration(func(key string) string { return values[key] })
	if err != nil {
		t.Fatal(err)
	}
	if config.RuntimeID != "facility_ops" || config.FileStorage.Driver != "s3" || !config.FileStorage.ForcePathStyle {
		t.Fatalf("config=%+v", config)
	}
	if config.FileStorage.Bucket != "facility-files" || config.FileStorage.Endpoint != "https://minio.example.test" {
		t.Fatalf("storage=%+v", config.FileStorage)
	}
	if config.Knowledge.DocumentUploadIdleTimeout != 2*time.Hour {
		t.Fatalf("idle timeout=%s", config.Knowledge.DocumentUploadIdleTimeout)
	}
}

func TestLoadConfigurationRejectsLocalProductionStorage(t *testing.T) {
	values := map[string]string{"APP_ENV": "production", "KNOWLEDGE_SERVICE_ACCESS_TOKEN": "service-secret"}
	_, err := loadConfiguration(func(key string) string { return values[key] })
	if err == nil {
		t.Fatal("expected production storage validation error")
	}
}
