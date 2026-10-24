// Command knowledge-saas runs the headless Knowledge service used by other
// Domainry products for Knowledge RPC and product-neutral file storage.
package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"strings"
	"syscall"
	"time"

	"github.com/domainry/domainry-foundation/logging"
	"github.com/domainry/domainry-foundation/processhost"
	knowledgecontract "github.com/domainry/domainry-knowledge-sdk/contract"
	knowledgesaas "github.com/domainry/domainry-knowledge/internal/assembly/saas"
)

type configuration struct {
	Address            string
	RuntimeID          string
	ServiceAccessToken string
	DatabasePath       string
	StoragePath        string
	FileStorage        knowledgesaas.FileStorageOptions
	Knowledge          knowledgecontract.Options
}

func main() {
	if err := run(); err != nil {
		os.Exit(1)
	}
}

func run() (runErr error) {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	observability, err := processhost.Open(ctx, processhost.Config{ServiceName: "domainry-knowledge-saas"})
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

	config, err := loadConfiguration(os.Getenv)
	if err != nil {
		return err
	}
	startupFailure = logging.Failure{Stage: "product_initialize"}
	service, err := knowledgesaas.Open(ctx, knowledgesaas.Options{
		RuntimeID: config.RuntimeID, ServiceAccessToken: config.ServiceAccessToken,
		DatabasePath: config.DatabasePath, StoragePath: config.StoragePath,
		FileStorage: config.FileStorage, Knowledge: config.Knowledge,
	})
	if err != nil {
		return fmt.Errorf("open Knowledge SaaS: %w", err)
	}
	defer service.Close(context.Background())

	mux := http.NewServeMux()
	mux.HandleFunc("GET /live", func(writer http.ResponseWriter, _ *http.Request) {
		writeStatus(writer, http.StatusOK, "live")
	})
	mux.HandleFunc("GET /ready", func(writer http.ResponseWriter, _ *http.Request) {
		writeStatus(writer, http.StatusOK, "ready")
	})
	mux.Handle("/", service.Handler())
	server := &http.Server{
		Addr: config.Address, Handler: observability.Handler("public", mux),
		ReadHeaderTimeout: 5 * time.Second, ReadTimeout: 30 * time.Second,
		WriteTimeout: 30 * time.Second, IdleTimeout: 60 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}
	startupFailure = logging.Failure{Stage: "listener_bind", Dependency: "public_listener"}
	listener, err := net.Listen("tcp", config.Address)
	if err != nil {
		return err
	}
	serveErr := make(chan error, 1)
	go func() { serveErr <- server.Serve(listener) }()
	started = true
	observability.Started(ctx, map[string]any{"listener_group": "public", "storage_driver": config.FileStorage.Driver})
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

func loadConfiguration(getenv func(string) string) (configuration, error) {
	value := func(key, fallback string) string {
		if current := strings.TrimSpace(getenv(key)); current != "" {
			return current
		}
		return fallback
	}
	result := configuration{
		Address:            value("KNOWLEDGE_SAAS_HTTP_ADDR", "127.0.0.1:8093"),
		RuntimeID:          value("KNOWLEDGE_RUNTIME_ID", "knowledge"),
		ServiceAccessToken: strings.TrimSpace(getenv("KNOWLEDGE_SERVICE_ACCESS_TOKEN")),
		DatabasePath:       value("KNOWLEDGE_DATABASE_PATH", "data/knowledge-saas.db"),
		StoragePath:        value("KNOWLEDGE_STORAGE_PATH", "data/knowledge-saas-storage"),
		FileStorage: knowledgesaas.FileStorageOptions{
			Driver: value("KNOWLEDGE_FILE_STORAGE_DRIVER", "local"), Region: strings.TrimSpace(getenv("KNOWLEDGE_S3_REGION")),
			Bucket: strings.TrimSpace(getenv("KNOWLEDGE_S3_BUCKET")), Prefix: strings.TrimSpace(getenv("KNOWLEDGE_S3_PREFIX")),
			Endpoint: strings.TrimSpace(getenv("KNOWLEDGE_S3_ENDPOINT")),
		},
	}
	if result.ServiceAccessToken == "" {
		return configuration{}, errors.New("KNOWLEDGE_SERVICE_ACCESS_TOKEN is required")
	}
	if raw := strings.TrimSpace(getenv("KNOWLEDGE_S3_FORCE_PATH_STYLE")); raw != "" {
		parsed, err := strconv.ParseBool(raw)
		if err != nil {
			return configuration{}, fmt.Errorf("KNOWLEDGE_S3_FORCE_PATH_STYLE must be a boolean: %w", err)
		}
		result.FileStorage.ForcePathStyle = parsed
	}
	driver := strings.ToLower(strings.TrimSpace(result.FileStorage.Driver))
	if driver != "local" && driver != "s3" {
		return configuration{}, errors.New("KNOWLEDGE_FILE_STORAGE_DRIVER must be local or s3")
	}
	result.FileStorage.Driver = driver
	if strings.EqualFold(strings.TrimSpace(getenv("APP_ENV")), "production") && driver != "s3" {
		return configuration{}, errors.New("KNOWLEDGE_FILE_STORAGE_DRIVER=s3 is required in production")
	}
	if driver == "s3" && (result.FileStorage.Region == "" || result.FileStorage.Bucket == "") {
		return configuration{}, errors.New("KNOWLEDGE_S3_REGION and KNOWLEDGE_S3_BUCKET are required for s3 storage")
	}
	if raw := strings.TrimSpace(getenv("KNOWLEDGE_DOCUMENT_UPLOAD_IDLE_TIMEOUT")); raw != "" {
		parsed, err := time.ParseDuration(raw)
		if err != nil {
			return configuration{}, fmt.Errorf("KNOWLEDGE_DOCUMENT_UPLOAD_IDLE_TIMEOUT must be a duration: %w", err)
		}
		result.Knowledge.DocumentUploadIdleTimeout = parsed
	}
	return result, nil
}

func writeStatus(writer http.ResponseWriter, status int, state string) {
	writer.Header().Set("Content-Type", "application/json; charset=utf-8")
	writer.WriteHeader(status)
	_ = json.NewEncoder(writer).Encode(map[string]string{"status": state})
}
