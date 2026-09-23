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

func (s *Service) GeneratedArtifactCleanupWorker(ctx context.Context, repo generatedArtifactCleanupRepository) {
	defer s.wg.Done()
	interval := s.options.DocumentPoll
	if interval < time.Minute {
		interval = time.Minute
	}
	for ctx.Err() == nil {
		_, _ = repo.ReconcileGeneratedArtifactContent(ctx, time.Now().UTC(), generatedArtifactCleanupBatchSize)
		timer := time.NewTimer(interval)
		select {
		case <-ctx.Done():
			if !timer.Stop() {
				<-timer.C
			}
			return
		case <-timer.C:
		}
	}
}
