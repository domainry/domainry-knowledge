package main

import (
	"context"
	"errors"
	"fmt"
	"net"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"strings"
	"syscall"
	"time"

	knowledgehttpapi "github.com/domainry/domainry-connectors/providers/knowledge_base/http_api"
	"github.com/domainry/domainry-foundation/logging"
	"github.com/domainry/domainry-foundation/processhost"
	identitymodule "github.com/domainry/domainry-identity/module"
	knowledgecontract "github.com/domainry/domainry-knowledge-sdk/contract"
	knowledgeprovider "github.com/domainry/domainry-knowledge-sdk/provider"
	knowledgeassembly "github.com/domainry/domainry-knowledge/internal/assembly/module"
	product "github.com/domainry/domainry-knowledge/internal/assembly/saas/product"
)

func main() {
	if err := run(); err != nil {
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
	started := false
	startupFailure := logging.Failure{Stage: "configuration_validate"}
	defer func() {
		if !started && runErr != nil {
			observability.StartFailed(context.Background(), runErr, startupFailure)
			runErr = errors.Join(runErr, observability.Close(context.Background(), nil))
			return
		}
		runErr = observability.Finish(context.Background(), nil, runErr)
	}()
	runtimeID := environmentValue("KNOWLEDGE_RUNTIME_ID", "knowledge")
	workspaceID := environmentValue("KNOWLEDGE_WORKSPACE_ID", "knowledge-workspace")
	applicationKey := environmentValue("KNOWLEDGE_APPLICATION_KEY", "knowledge")
	databasePath := environmentValue("KNOWLEDGE_DATABASE_PATH", "data/knowledge.db")
	storagePath := environmentValue("KNOWLEDGE_STORAGE_PATH", "data/knowledge-storage")
	frontendPath := environmentValue("KNOWLEDGE_FRONTEND_PATH", "frontend/app-dist")
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
		address = "127.0.0.1:8092"
	}
	origin := environmentValue("KNOWLEDGE_ORIGIN", "http://127.0.0.1:8092")
	adminPassword := strings.TrimSpace(os.Getenv("KNOWLEDGE_ADMIN_PASSWORD"))
	if adminPassword == "" {
		if strings.EqualFold(strings.TrimSpace(os.Getenv("APP_ENV")), "production") {
			return fmt.Errorf("KNOWLEDGE_ADMIN_PASSWORD is required in production")
		}
		adminPassword = "Knowledge@2026!"
	}
	if _, err = os.Stat(filepath.Join(frontendPath, "index.html")); err != nil {
		return fmt.Errorf("Knowledge frontend is not built at %s: %w", frontendPath, err)
	}
	providerConfig := knowledgeprovider.ConfigFromEnvironment()
	providerConfig.RuntimeID = runtimeID
	var providerFactory knowledgeprovider.Factory
	if providerConfig.Configured() {
		if strings.TrimSpace(providerConfig.WorkspaceID) == "" {
			providerConfig.WorkspaceID = workspaceID
		}
		providerFactory = knowledgeassembly.NewProviderFactory(knowledgehttpapi.New)
	}
	startupFailure = logging.Failure{Stage: "product_initialize"}
	service, err := product.Open(ctx, product.Options{
		RuntimeID: runtimeID, WorkspaceID: workspaceID, ApplicationKey: applicationKey,
		DatabasePath: databasePath, StoragePath: storagePath, Origin: origin, Files: os.DirFS(frontendPath),
		Identity:       identitymodule.OptionsFromEnvironment(),
		Knowledge:      knowledgecontract.Options{DocumentUploadIdleTimeout: documentUploadIdleTimeout},
		ProviderConfig: providerConfig, ProviderFactory: providerFactory,
		AdminLogin: environmentValue("KNOWLEDGE_ADMIN_LOGIN", "admin@knowledge.local"),
		AdminName:  environmentValue("KNOWLEDGE_ADMIN_NAME", "Knowledge Admin"), AdminPassword: adminPassword,
	})
	if err != nil {
		return fmt.Errorf("open Knowledge product: %w", err)
	}
	defer service.Close(context.Background())
	server := &http.Server{Addr: address, Handler: observability.Handler("public", service.Handler()), ReadHeaderTimeout: 5 * time.Second, ReadTimeout: 30 * time.Second, WriteTimeout: 30 * time.Second, IdleTimeout: 60 * time.Second, MaxHeaderBytes: 1 << 20}
	startupFailure = logging.Failure{Stage: "listener_bind", Dependency: "public_listener"}
	listener, err := net.Listen("tcp", address)
	if err != nil {
		return err
	}
	serveErr := make(chan error, 1)
	go func() { serveErr <- server.Serve(listener) }()
	started = true
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

func environmentValue(key, fallback string) string {
	if value := strings.TrimSpace(os.Getenv(key)); value != "" {
		return value
	}
	return fallback
}
