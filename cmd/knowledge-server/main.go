package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"strings"
	"syscall"
	"time"

	knowledgehttpapi "github.com/domainry/domainry-connectors/providers/knowledge_base/http_api"
	"github.com/domainry/domainry-foundation/processhost"
	knowledgecontract "github.com/domainry/domainry-knowledge-sdk/contract"
	knowledgeprovider "github.com/domainry/domainry-knowledge-sdk/provider"
	knowledgeassembly "github.com/domainry/domainry-knowledge/internal/assembly/module"
	saasservice "github.com/domainry/domainry-knowledge/internal/assembly/saas"
)

func main() {
	if run() != nil {
		os.Exit(1)
	}
}

func run() (runErr error) {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	observability, err := processhost.Open(ctx, processhost.Config{ServiceName: "domainry-knowledge"})
	if err != nil {
		return err
	}
	defer func() { runErr = observability.Finish(context.Background(), nil, runErr) }()
	runtimeID := strings.TrimSpace(os.Getenv("KNOWLEDGE_RUNTIME_ID"))
	token := strings.TrimSpace(os.Getenv("KNOWLEDGE_SERVICE_ACCESS_TOKEN"))
	databasePath := strings.TrimSpace(os.Getenv("KNOWLEDGE_DATABASE_PATH"))
	storagePath := strings.TrimSpace(os.Getenv("KNOWLEDGE_STORAGE_PATH"))
	fileStorage := saasservice.FileStorageOptions{
		Driver: strings.TrimSpace(os.Getenv("KNOWLEDGE_FILE_STORAGE_DRIVER")), Region: strings.TrimSpace(os.Getenv("KNOWLEDGE_S3_REGION")),
		Bucket: strings.TrimSpace(os.Getenv("KNOWLEDGE_S3_BUCKET")), Prefix: strings.TrimSpace(os.Getenv("KNOWLEDGE_S3_PREFIX")), Endpoint: strings.TrimSpace(os.Getenv("KNOWLEDGE_S3_ENDPOINT")),
	}
	if raw := strings.TrimSpace(os.Getenv("KNOWLEDGE_S3_FORCE_PATH_STYLE")); raw != "" {
		value, parseErr := strconv.ParseBool(raw)
		if parseErr != nil {
			return fmt.Errorf("KNOWLEDGE_S3_FORCE_PATH_STYLE must be a boolean: %w", parseErr)
		}
		fileStorage.ForcePathStyle = value
	}
	var documentUploadIdleTimeout time.Duration
	if raw := strings.TrimSpace(os.Getenv("KNOWLEDGE_DOCUMENT_UPLOAD_IDLE_TIMEOUT")); raw != "" {
		parsed, parseErr := time.ParseDuration(raw)
		if parseErr != nil {
			return fmt.Errorf("KNOWLEDGE_DOCUMENT_UPLOAD_IDLE_TIMEOUT must be a duration: %w", parseErr)
		}
		documentUploadIdleTimeout = parsed
	}
	address := strings.TrimSpace(os.Getenv("KNOWLEDGE_HTTP_ADDR"))
	if address == "" {
		address = ":8092"
	}
	providerConfig := knowledgeprovider.ConfigFromEnvironment()
	providerConfig.RuntimeID = runtimeID
	providerFactory := knowledgeassembly.NewProviderFactory(knowledgehttpapi.New)
	source, err := providerFactory.NewSource(providerConfig)
	if err != nil {
		return fmt.Errorf("configure Knowledge provider: %w", err)
	}
	service, err := saasservice.Open(ctx, saasservice.Options{RuntimeID: runtimeID, ServiceAccessToken: token, DatabasePath: databasePath, StoragePath: storagePath, FileStorage: fileStorage, Knowledge: knowledgecontract.Options{Knowledge: source, DocumentUploadIdleTimeout: documentUploadIdleTimeout}})
	if err != nil {
		return fmt.Errorf("open Knowledge SaaS service: %w", err)
	}
	defer service.Close(context.Background())
	server := &http.Server{Addr: address, Handler: observability.Handler("public", service.Handler()), ReadHeaderTimeout: 5 * time.Second, ReadTimeout: 30 * time.Second, WriteTimeout: 30 * time.Second, IdleTimeout: 60 * time.Second, MaxHeaderBytes: 1 << 20}
	serveErr := make(chan error, 1)
	go func() { serveErr <- server.ListenAndServe() }()
	observability.Started(ctx, map[string]any{"listener_group": "public"})
	select {
	case err = <-serveErr:
		if errors.Is(err, http.ErrServerClosed) {
			return nil
		}
		return err
	case <-ctx.Done():
		observability.Stopping(context.Background(), map[string]any{"reason": "signal"})
		shutdown, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		return server.Shutdown(shutdown)
	}
}
