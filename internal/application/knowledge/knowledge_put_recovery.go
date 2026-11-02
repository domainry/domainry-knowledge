package application

import (
	"context"
	"time"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
)

// RecoverKnowledgeDocumentPut repeats only the exact immutable command through
// a source that explicitly owns replay safety. The committed context ends
// before the durable work lease, so a late provider response cannot outlive
// the caller's fence.
func RecoverKnowledgeDocumentPut(ctx context.Context, source agentsdk.KnowledgeDocumentSource, input agentsdk.KnowledgeDocumentIndexContent, a agentsdk.Authority, leaseUntil time.Time) bool {
	recovery, ok := source.(agentsdk.KnowledgeDocumentPutRecoverySource)
	if !ok || input.Content == nil {
		return false
	}
	write, cancel, err := CommittedKnowledgeWriteContext(ctx, leaseUntil)
	if err != nil {
		return false
	}
	defer cancel()
	return recovery.RecoverKnowledgeDocumentPut(write, input, a) == nil
}
