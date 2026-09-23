package application

import (
	"context"
	"sync"
	"testing"
	"time"
)

func TestServiceStartsAndStopsGeneratedArtifactCleanup(t *testing.T) {
	repo := &generatedArtifactCleanupTestRepository{called: make(chan struct{})}
	service := NewService(repo, "runtime-a", Options{})
	service.Start(t.Context())
	select {
	case <-repo.called:
	case <-time.After(time.Second):
		t.Fatal("generated artifact cleanup did not start")
	}
	service.Close()
	repo.mu.Lock()
	defer repo.mu.Unlock()
	if repo.calls != 1 || repo.limit != generatedArtifactCleanupBatchSize || repo.at.IsZero() {
		t.Fatalf("calls=%d limit=%d at=%s", repo.calls, repo.limit, repo.at)
	}
}

type generatedArtifactCleanupTestRepository struct {
	mu     sync.Mutex
	called chan struct{}
	calls  int
	limit  int
	at     time.Time
}

func (*generatedArtifactCleanupTestRepository) GeneratedArtifactCleanupEnabled() bool { return true }

func (r *generatedArtifactCleanupTestRepository) ReconcileGeneratedArtifactContent(_ context.Context, at time.Time, limit int) (int, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.calls++
	r.limit, r.at = limit, at
	if r.calls == 1 {
		close(r.called)
	}
	return 1, nil
}
