package store

import (
	"fmt"
	"strings"
	"testing"
	"time"

	"github.com/domainry/domainry-foundation/entityid"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func TestKnowledgeWebhookDurableIdempotentReplayAndFencedDelivery(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	subscription, err := store.CreateKnowledgeWebhookSubscription(t.Context(), library.ID, knowledgesdk.KnowledgeWebhookSubscriptionCreate{
		ClientID: "webhook-subscription-1", ApplicationKey: "trusted.app", EndpointURL: "https://hooks.example.org/knowledge",
		EventTypes: []string{knowledgesdk.KnowledgeWebhookPagePublished},
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	eventID, err := entityid.Derive("kwhevt", "knowledge.webhook_event", "webhook", library.ID, page.Page.ID, "1")
	if err != nil {
		t.Fatal(err)
	}
	event := knowledgesdk.KnowledgeWebhookEvent{
		ID: eventID, Type: knowledgesdk.KnowledgeWebhookPagePublished,
		Action: knowledgesdk.ActionPagesGet, WorkspaceID: authority.WorkspaceID, LibraryID: library.ID, PageID: page.Page.ID,
		ResourceID: page.Page.ID, Version: 1, OccurredAt: time.Now().UTC(), Authority: authority,
	}
	if err = store.AppendKnowledgeWebhookEvent(t.Context(), event); err != nil {
		t.Fatal(err)
	}
	// Retrying the same logical event is harmless even though the caller's wall
	// clock changed; the originally persisted event remains authoritative.
	event.OccurredAt = event.OccurredAt.Add(time.Minute)
	if err = store.AppendKnowledgeWebhookEvent(t.Context(), event); err != nil {
		t.Fatalf("idempotent event retry failed: %v", err)
	}
	conflict := event
	conflict.Version++
	if err = store.AppendKnowledgeWebhookEvent(t.Context(), conflict); err == nil || !strings.Contains(err.Error(), "webhook_event_idempotency_conflict") {
		t.Fatalf("same event ID with different facts did not conflict: %v", err)
	}

	now := time.Now().UTC().Add(time.Second)
	first, claimed, err := store.ClaimKnowledgeWebhookDelivery(t.Context(), authority.RuntimeID, now, time.Second)
	if err != nil || !claimed || first.ScopeKey == "" || first.Subscription.ID != subscription.ID || first.Delivery.Attempt != 1 {
		t.Fatalf("first delivery claim invalid: claimed=%v work=%+v err=%v", claimed, first, err)
	}
	second, claimed, err := store.ClaimKnowledgeWebhookDelivery(t.Context(), authority.RuntimeID, now.Add(2*time.Second), time.Second)
	if err != nil || !claimed || second.Fence <= first.Fence || second.Delivery.Attempt != 2 {
		t.Fatalf("expired delivery was not reclaimed with a new fence: claimed=%v work=%+v err=%v", claimed, second, err)
	}
	if err = store.CompleteKnowledgeWebhookDelivery(t.Context(), first, knowledgesdk.KnowledgeWebhookDeliveryResult{Delivered: true, StatusCode: 204}); err == nil {
		t.Fatal("stale delivery fence completed newer work")
	}
	if err = store.CompleteKnowledgeWebhookDelivery(t.Context(), second, knowledgesdk.KnowledgeWebhookDeliveryResult{Delivered: true, StatusCode: 204}); err != nil {
		t.Fatal(err)
	}

	// A new Store over the same database represents a process restart: events
	// and delivery outcomes must come from SQL rather than process memory.
	restarted := New(store.store)
	events, err := restarted.KnowledgeWebhookEvents(t.Context(), library.ID, authority)
	if err != nil || len(events.Items) != 1 || len(events.Items[0].Deliveries) != 1 || events.Items[0].Deliveries[0].State != knowledgesdk.KnowledgeWebhookDeliveryDelivered {
		t.Fatalf("durable webhook state missing after restart: %+v err=%v", events, err)
	}
	replayed, err := restarted.ReplayKnowledgeWebhookEvent(t.Context(), library.ID, event.ID, authority)
	if err != nil || len(replayed.Deliveries) != 1 || replayed.Deliveries[0].State != knowledgesdk.KnowledgeWebhookDeliveryPending || replayed.Deliveries[0].Attempt != 0 {
		t.Fatalf("webhook replay did not reset delivery: %+v err=%v", replayed, err)
	}

	subscription, err = restarted.UpdateKnowledgeWebhookSubscription(t.Context(), library.ID, subscription.ID, knowledgesdk.KnowledgeWebhookSubscriptionUpdate{
		ClientID: "webhook-revoke-1", ExpectedRevision: subscription.Revision, EndpointURL: subscription.EndpointURL,
		EventTypes: subscription.EventTypes, State: knowledgesdk.KnowledgeWebhookSubscriptionRevoked,
	}, authority)
	if err != nil || subscription.State != knowledgesdk.KnowledgeWebhookSubscriptionRevoked {
		t.Fatalf("subscription revoke failed: %+v err=%v", subscription, err)
	}
	if _, claimed, err = restarted.ClaimKnowledgeWebhookDelivery(t.Context(), authority.RuntimeID, now.Add(3*time.Second), time.Second); err != nil || claimed {
		t.Fatalf("revoked subscription remained deliverable: claimed=%v err=%v", claimed, err)
	}
}

func TestKnowledgeWebhookRejectsUnsafeEndpoint(t *testing.T) {
	store, authority, library, _ := pageFixture(t)
	for index, endpoint := range []string{"http://hooks.example.org/x", "https://localhost/x", "https://127.0.0.1/x", "https://hooks.example.org:8443/x", "https://user:pass@hooks.example.org/x"} {
		if _, err := store.CreateKnowledgeWebhookSubscription(t.Context(), library.ID, knowledgesdk.KnowledgeWebhookSubscriptionCreate{ClientID: fmt.Sprintf("unsafe-%d", index), ApplicationKey: "trusted.app", EndpointURL: endpoint, EventTypes: []string{knowledgesdk.KnowledgeWebhookPagePublished}}, authority); err == nil {
			t.Fatalf("unsafe webhook endpoint accepted: %s", endpoint)
		}
	}
}
