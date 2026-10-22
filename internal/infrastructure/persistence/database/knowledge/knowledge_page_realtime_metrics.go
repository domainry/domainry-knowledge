package store

import (
	"context"
	"encoding/base64"
	"time"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/metric"
)

const knowledgeCollaborationMeterName = "github.com/domainry/domainry-knowledge/collaboration"

type knowledgeCollaborationMetrics interface {
	recordSnapshot(context.Context, int64)
	recordUpdate(context.Context, int64, time.Duration, int64, time.Duration, int64)
	recordOnlineUsers(context.Context, int64)
	recordEventStream(context.Context, bool, int64)
}

type otelKnowledgeCollaborationMetrics struct {
	snapshotBytes       metric.Int64Histogram
	updateBytes         metric.Int64Histogram
	updates             metric.Int64Counter
	onlineUsers         metric.Int64Histogram
	endToEndLatency     metric.Int64Histogram
	sseReconnects       metric.Int64Counter
	replayedEvents      metric.Int64Counter
	compressionDuration metric.Int64Histogram
	compressedBytes     metric.Int64Histogram
}

func newKnowledgeCollaborationMetrics() knowledgeCollaborationMetrics {
	meter := otel.Meter(knowledgeCollaborationMeterName)
	metrics := &otelKnowledgeCollaborationMetrics{}
	metrics.snapshotBytes, _ = meter.Int64Histogram("knowledge.collaboration.snapshot.size", metric.WithUnit("By"), metric.WithDescription("Logical collaboration checkpoint size."))
	metrics.updateBytes, _ = meter.Int64Histogram("knowledge.collaboration.update.size", metric.WithUnit("By"), metric.WithDescription("Accepted Yjs delta size."))
	metrics.updates, _ = meter.Int64Counter("knowledge.collaboration.update.accepted", metric.WithUnit("{update}"), metric.WithDescription("Accepted collaboration updates; derive update rate from this monotonic counter."))
	metrics.onlineUsers, _ = meter.Int64Histogram("knowledge.collaboration.online_users", metric.WithUnit("{user}"), metric.WithDescription("Unique active users observed for a page operation."))
	metrics.endToEndLatency, _ = meter.Int64Histogram("knowledge.collaboration.end_to_end.latency", metric.WithUnit("ms"), metric.WithDescription("Time from local edit creation to durable server acceptance."))
	metrics.sseReconnects, _ = meter.Int64Counter("knowledge.collaboration.sse.reconnects", metric.WithUnit("{reconnect}"), metric.WithDescription("Authenticated SSE reconnects."))
	metrics.replayedEvents, _ = meter.Int64Counter("knowledge.collaboration.event.replayed", metric.WithUnit("{event}"), metric.WithDescription("Durable collaboration events replayed to SSE clients."))
	metrics.compressionDuration, _ = meter.Int64Histogram("knowledge.collaboration.checkpoint.compression.duration", metric.WithUnit("ms"), metric.WithDescription("Yjs checkpoint gzip duration."))
	metrics.compressedBytes, _ = meter.Int64Histogram("knowledge.collaboration.checkpoint.compressed.size", metric.WithUnit("By"), metric.WithDescription("Compressed durable Yjs checkpoint size."))
	return metrics
}

func (metrics *otelKnowledgeCollaborationMetrics) recordSnapshot(ctx context.Context, size int64) {
	if metrics != nil && metrics.snapshotBytes != nil && size >= 0 {
		metrics.snapshotBytes.Record(ctx, size)
	}
}

func (metrics *otelKnowledgeCollaborationMetrics) recordUpdate(ctx context.Context, updateBytes int64, latency time.Duration, snapshotBytes int64, compressionDuration time.Duration, compressedBytes int64) {
	if metrics == nil {
		return
	}
	if metrics.updateBytes != nil {
		metrics.updateBytes.Record(ctx, updateBytes)
	}
	if metrics.updates != nil {
		metrics.updates.Add(ctx, 1)
	}
	if metrics.endToEndLatency != nil && latency >= 0 {
		metrics.endToEndLatency.Record(ctx, latency.Milliseconds())
	}
	if snapshotBytes >= 0 {
		metrics.recordSnapshot(ctx, snapshotBytes)
	}
	if compressionDuration > 0 && metrics.compressionDuration != nil {
		metrics.compressionDuration.Record(ctx, compressionDuration.Milliseconds())
	}
	if compressedBytes > 0 && metrics.compressedBytes != nil {
		metrics.compressedBytes.Record(ctx, compressedBytes)
	}
}

func (metrics *otelKnowledgeCollaborationMetrics) recordOnlineUsers(ctx context.Context, users int64) {
	if metrics != nil && metrics.onlineUsers != nil && users >= 0 {
		metrics.onlineUsers.Record(ctx, users)
	}
}

func (metrics *otelKnowledgeCollaborationMetrics) recordEventStream(ctx context.Context, reconnected bool, replayed int64) {
	if metrics == nil {
		return
	}
	if reconnected && metrics.sseReconnects != nil {
		metrics.sseReconnects.Add(ctx, 1)
	}
	if replayed > 0 && metrics.replayedEvents != nil {
		metrics.replayedEvents.Add(ctx, replayed)
	}
}

func knowledgeCollaborationSnapshotSize(snapshot knowledgesdk.KnowledgeCollaborationSnapshot) int64 {
	size := int64(len(snapshot.Content))
	if state, err := base64.StdEncoding.DecodeString(snapshot.YjsState); err == nil {
		size += int64(len(state))
	}
	for _, update := range snapshot.YjsUpdates {
		if delta, err := base64.StdEncoding.DecodeString(update.YjsUpdate); err == nil {
			size += int64(len(delta))
		}
	}
	return size
}

func knowledgeCollaborationUniqueUsers(presence []knowledgesdk.KnowledgeCollaborationPresence) int64 {
	users := make(map[string]struct{}, len(presence))
	for _, value := range presence {
		if value.UserID != "" {
			users[value.UserID] = struct{}{}
		}
	}
	return int64(len(users))
}

func knowledgeCollaborationReplayCount(events []knowledgesdk.KnowledgeCollaborationServerEvent) int64 {
	var count int64
	for _, event := range events {
		if event.Type == knowledgesdk.KnowledgeCollaborationEventUpdate || event.Type == knowledgesdk.KnowledgeCollaborationEventSnapshot {
			count++
		}
	}
	return count
}
