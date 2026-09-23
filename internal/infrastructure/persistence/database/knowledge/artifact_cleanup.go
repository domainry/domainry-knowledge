package store

import (
	"context"
	"fmt"
	"time"

	sharedartifact "github.com/domainry/domainry-foundation/artifact"
)

func (s *Store) GeneratedArtifactCleanupEnabled() bool {
	return s != nil && s.artifacts.Store != nil && s.artifacts.Content != nil
}

func (s *Store) ReconcileGeneratedArtifactContent(ctx context.Context, now time.Time, limit int) (int, error) {
	if !s.GeneratedArtifactCleanupEnabled() {
		return 0, fmt.Errorf("generated artifact cleanup requires shared Artifact metadata and content stores")
	}
	cleanup, err := sharedartifact.NewCleanupService(s.artifacts.Store, s.artifacts.Content)
	if err != nil {
		return 0, err
	}
	result, err := cleanup.Reconcile(ctx, sharedartifact.OwnerAgent, generatedArtifactKind, now, limit)
	return result.Expired + result.Deleted, err
}
