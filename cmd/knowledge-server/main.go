package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	knowledgehttpapi "github.com/domainry/domainry-connectors/providers/knowledge_base/http_api"
	knowledgecontract "github.com/domainry/domainry-knowledge-sdk/contract"
	knowledgeprovider "github.com/domainry/domainry-knowledge-sdk/provider"
	knowledgeassembly "github.com/domainry/domainry-knowledge/internal/assembly/module"
	saasservice "github.com/domainry/domainry-knowledge/internal/assembly/saas"
)

func main() {
	if err := run(); err != nil {
		_, _ = fmt.Fprintln(os.Stderr, "domainry-knowledge:", err)
		os.Exit(1)
	}
}

func run() error {
	runtimeID := strings.TrimSpace(os.Getenv("KNOWLEDGE_RUNTIME_ID"))
	token := strings.TrimSpace(os.Getenv("KNOWLEDGE_SERVICE_ACCESS_TOKEN"))
	databasePath := strings.TrimSpace(os.Getenv("KNOWLEDGE_DATABASE_PATH"))
	storagePath := strings.TrimSpace(os.Getenv("KNOWLEDGE_STORAGE_PATH"))
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
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	service, err := saasservice.Open(ctx, saasservice.Options{RuntimeID: runtimeID, ServiceAccessToken: token, DatabasePath: databasePath, StoragePath: storagePath, Knowledge: knowledgecontract.Options{Knowledge: source}})
	if err != nil {
		return fmt.Errorf("open Knowledge SaaS service: %w", err)
	}
	defer service.Close(context.Background())
	server := &http.Server{Addr: address, Handler: service.Handler(), ReadHeaderTimeout: 5 * time.Second, ReadTimeout: 30 * time.Second, WriteTimeout: 30 * time.Second, IdleTimeout: 60 * time.Second, MaxHeaderBytes: 1 << 20}
	serveErr := make(chan error, 1)
	go func() { serveErr <- server.ListenAndServe() }()
	select {
	case err = <-serveErr:
		if errors.Is(err, http.ErrServerClosed) {
			return nil
		}
		return err
	case <-ctx.Done():
		shutdown, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		return server.Shutdown(shutdown)
	}
}
