package module

import (
	"context"
	"sync"
	"time"

	workerplatform "github.com/domainry/domainry-foundation/worker"
	"github.com/domainry/domainry-knowledge-sdk/contract"
	application "github.com/domainry/domainry-knowledge/internal/application/knowledge"
)

// supervisedService is the process-composition boundary for Knowledge
// background work. The application service owns business ticks and durable
// state; Foundation owns goroutines, recovery, panic handling, metrics and the
// single operational failure event.
type supervisedService struct {
	*application.Service
	implementation *application.Service

	startOnce sync.Once
	closeOnce sync.Once
	cancel    context.CancelFunc
	done      <-chan struct{}
}

func newSupervisedService(implementation *application.Service) contract.Service {
	return &supervisedService{Service: implementation, implementation: implementation}
}

func (service *supervisedService) Start(parent context.Context) {
	service.startOnce.Do(func() {
		if parent == nil {
			parent = context.Background()
		}
		ctx, cancel := context.WithCancel(parent)
		service.cancel = cancel
		done := make([]<-chan struct{}, 0, 3)
		interval := service.implementation.DocumentWorkerInterval()
		if interval <= 0 {
			interval = 2 * time.Second
		}
		maxInterval := interval * 16
		if maxInterval < 30*time.Second {
			maxInterval = 30 * time.Second
		}
		if service.implementation.DocumentWorkerEnabled() {
			done = append(done, workerplatform.StartWakeableAdaptiveLoop(
				ctx,
				workerplatform.Identity{Owner: "knowledge", Name: "document"},
				interval,
				maxInterval,
				service.implementation.DocumentWorkerWakeups(),
				func(tickCtx context.Context) (workerplatform.TickResult, error) {
					result, err := service.implementation.KnowledgeDocumentWorkerTick(tickCtx)
					return workerplatform.TickResult{Worked: result.Worked, ProcessedCount: result.ProcessedCount}, err
				},
			))
		}
		if service.implementation.AttachmentIndexWorkerEnabled() {
			done = append(done, workerplatform.StartWakeableAdaptiveLoop(
				ctx,
				workerplatform.Identity{Owner: "knowledge", Name: "attachment_index"},
				interval,
				maxInterval,
				service.implementation.AttachmentIndexWorkerWakeups(),
				func(tickCtx context.Context) (workerplatform.TickResult, error) {
					result, err := service.implementation.AttachmentIndexWorkerTick(tickCtx)
					return workerplatform.TickResult{Worked: result.Worked, ProcessedCount: result.ProcessedCount}, err
				},
			))
		}
		if service.implementation.GeneratedArtifactCleanupWorkerEnabled() {
			done = append(done, workerplatform.StartNamedLoop(
				ctx,
				workerplatform.Identity{Owner: "knowledge", Name: "generated_artifact_cleanup"},
				service.implementation.GeneratedArtifactCleanupWorkerInterval(),
				func(tickCtx context.Context) (workerplatform.TickResult, error) {
					result, err := service.implementation.GeneratedArtifactCleanupWorkerTick(tickCtx)
					return workerplatform.TickResult{Worked: result.Worked, ProcessedCount: result.ProcessedCount}, err
				},
			))
		}
		service.done = workerplatform.Join(done...)
	})
}

func (service *supervisedService) Close() {
	service.closeOnce.Do(func() {
		if service.cancel != nil {
			service.cancel()
		}
		if service.done != nil {
			<-service.done
		}
		service.implementation.Close()
	})
}
