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
	Database           knowledgesaas.DatabaseOptions
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
		Database: config.Database, StoragePath: config.StoragePath,
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
	mux.HandleFunc("GET /ready", func(writer http.ResponseWriter, request *http.Request) {
		if readyErr := service.Ready(request.Context()); readyErr != nil {
			writeStatus(writer, http.StatusServiceUnavailable, "not_ready")
			return
		}
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
	integer := func(key string, fallback int) (int, error) {
		raw := strings.TrimSpace(getenv(key))
		if raw == "" {
			return fallback, nil
		}
		parsed, err := strconv.Atoi(raw)
		if err != nil {
			return 0, fmt.Errorf("%s must be an integer: %w", key, err)
		}
		return parsed, nil
	}
	duration := func(key string, fallback time.Duration) (time.Duration, error) {
		raw := strings.TrimSpace(getenv(key))
		if raw == "" {
			return fallback, nil
		}
		parsed, err := time.ParseDuration(raw)
		if err != nil {
			return 0, fmt.Errorf("%s must be a duration: %w", key, err)
		}
		return parsed, nil
	}
	maxOpen, err := integer("KNOWLEDGE_DATABASE_MAX_OPEN_CONNECTIONS", 16)
	if err != nil {
		return configuration{}, err
	}
	maxIdle, err := integer("KNOWLEDGE_DATABASE_MAX_IDLE_CONNECTIONS", 8)
	if err != nil {
		return configuration{}, err
	}
	sqliteMaxOpen, err := integer("KNOWLEDGE_SQLITE_MAX_OPEN_CONNECTIONS", 8)
	if err != nil {
		return configuration{}, err
	}
	connectionLifetime, err := duration("KNOWLEDGE_DATABASE_CONNECTION_LIFETIME", 30*time.Minute)
	if err != nil {
		return configuration{}, err
	}
	connectionIdleTime, err := duration("KNOWLEDGE_DATABASE_CONNECTION_IDLE_TIME", 5*time.Minute)
	if err != nil {
		return configuration{}, err
	}
	sqliteBusyTimeout, err := duration("KNOWLEDGE_SQLITE_BUSY_TIMEOUT", 5*time.Second)
	if err != nil {
		return configuration{}, err
	}
	databaseDriver := strings.ToLower(value("KNOWLEDGE_DATABASE_DRIVER", "sqlite"))
	result := configuration{
		Address:            value("KNOWLEDGE_SAAS_HTTP_ADDR", "127.0.0.1:8093"),
		RuntimeID:          value("KNOWLEDGE_RUNTIME_ID", "knowledge"),
		ServiceAccessToken: strings.TrimSpace(getenv("KNOWLEDGE_SERVICE_ACCESS_TOKEN")),
		Database: knowledgesaas.DatabaseOptions{
			Driver: databaseDriver, Path: value("KNOWLEDGE_DATABASE_PATH", "data/knowledge-saas.db"),
			DSN: strings.TrimSpace(getenv("KNOWLEDGE_DATABASE_DSN")), Schema: value("KNOWLEDGE_DATABASE_SCHEMA", "public"),
			MaxOpenConnections: maxOpen, MaxIdleConnections: maxIdle,
			ConnectionLifetime: connectionLifetime, ConnectionIdleTime: connectionIdleTime,
			SQLiteBusyTimeout: sqliteBusyTimeout, SQLiteMaxOpen: sqliteMaxOpen,
		},
		StoragePath: value("KNOWLEDGE_STORAGE_PATH", "data/knowledge-saas-storage"),
		FileStorage: knowledgesaas.FileStorageOptions{
			Driver: value("KNOWLEDGE_FILE_STORAGE_DRIVER", "local"), Region: strings.TrimSpace(getenv("KNOWLEDGE_S3_REGION")),
			Bucket: strings.TrimSpace(getenv("KNOWLEDGE_S3_BUCKET")), Prefix: strings.TrimSpace(getenv("KNOWLEDGE_S3_PREFIX")),
			Endpoint: strings.TrimSpace(getenv("KNOWLEDGE_S3_ENDPOINT")),
		},
	}
	if result.ServiceAccessToken == "" {
		return configuration{}, errors.New("KNOWLEDGE_SERVICE_ACCESS_TOKEN is required")
	}
	if databaseDriver != "sqlite" && databaseDriver != "postgres" {
		return configuration{}, errors.New("KNOWLEDGE_DATABASE_DRIVER must be sqlite or postgres")
	}
	if databaseDriver == "sqlite" && (strings.TrimSpace(result.Database.Path) == "" || sqliteBusyTimeout <= 0 || sqliteMaxOpen < 1) {
		return configuration{}, errors.New("valid Knowledge SQLite settings are required")
	}
	if databaseDriver == "postgres" && result.Database.DSN == "" {
		return configuration{}, errors.New("KNOWLEDGE_DATABASE_DSN is required for PostgreSQL")
	}
	if maxOpen < 1 || maxIdle < 0 || maxIdle > maxOpen || connectionLifetime <= 0 || connectionIdleTime <= 0 {
		return configuration{}, errors.New("valid Knowledge database pool settings are required")
	}
	production := strings.EqualFold(strings.TrimSpace(getenv("APP_ENV")), "production")
	if production && databaseDriver != "postgres" {
		return configuration{}, errors.New("KNOWLEDGE_DATABASE_DRIVER=postgres is required in production")
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
	if production && driver != "s3" {
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
