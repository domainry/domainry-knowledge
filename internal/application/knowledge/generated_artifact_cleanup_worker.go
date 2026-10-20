package application

import (
	"context"
	"time"
)

const generatedArtifactCleanupBatchSize = 500

type generatedArtifactCleanupRepository interface {
	GeneratedArtifactCleanupEnabled() bool
	ReconcileGeneratedArtifactContent(context.Context, time.Time, int) (int, error)
}

func (s *Service) GeneratedArtifactCleanupWorkerEnabled() bool {
	repo, ok := s.repo.(generatedArtifactCleanupRepository)
	return ok && repo.GeneratedArtifactCleanupEnabled()
}

func (s *Service) GeneratedArtifactCleanupWorkerInterval() time.Duration {
	interval := s.options.DocumentPoll
	if interval < time.Minute {
		interval = time.Minute
	}
	return interval
}

func (s *Service) GeneratedArtifactCleanupWorkerTick(ctx context.Context) (WorkerTickResult, error) {
	repo, ok := s.repo.(generatedArtifactCleanupRepository)
	if !ok || !repo.GeneratedArtifactCleanupEnabled() {
		return WorkerTickResult{}, nil
	}
	processed, err := repo.ReconcileGeneratedArtifactContent(ctx, time.Now().UTC(), generatedArtifactCleanupBatchSize)
	return WorkerTickResult{Worked: processed > 0, ProcessedCount: processed}, err
}
