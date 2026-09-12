package application

import (
	"context"
	"time"

	agentsdk "github.com/domainry/domainry-agent-sdk"
)

// Only a trusted source with an explicit recovery contract may repeat a
// deletion or look up its receipt. The application never derives this ability
// from HTTP methods or from document visibility in an ACL-filtered query.
func RecoverKnowledgeDocumentDelete(ctx context.Context, source agentsdk.KnowledgeDocumentSource, id string, a agentsdk.ConversationAuthority, leaseUntil time.Time) bool {
	recovery, ok := source.(agentsdk.KnowledgeDocumentDeleteRecoverySource)
	if !ok {
		return false
	}
	write, cancel, err := CommittedKnowledgeWriteContext(ctx, leaseUntil)
	if err != nil {
		return false
	}
	defer cancel()
	return recovery.RecoverKnowledgeDocumentDelete(write, id, a) == nil
}
