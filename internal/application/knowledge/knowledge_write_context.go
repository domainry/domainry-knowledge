package application

import (
	"context"
	"time"
)

// A normal host shutdown must drain a selected remote write once its durable
// marker is committed. Cancelling between that marker and HTTP would create an
// uncertain write even though no request left the host. Keep the existing
// deadline and leave five seconds in the lease for its durable acknowledgement.
// Process crashes and transport failures remain uncertain; any later recovery
// requires the source's explicit recovery contract, never this context alone.
func CommittedKnowledgeWriteContext(ctx context.Context, expires time.Time) (context.Context, context.CancelFunc, error) {
	if err := ctx.Err(); err != nil {
		return nil, nil, err
	}
	deadline := expires.Add(-5 * time.Second)
	if prior, ok := ctx.Deadline(); ok && prior.Before(deadline) {
		deadline = prior
	}
	if !deadline.After(time.Now()) {
		return nil, nil, context.DeadlineExceeded
	}
	write, cancel := context.WithDeadline(context.WithoutCancel(ctx), deadline)
	return write, cancel, nil
}
