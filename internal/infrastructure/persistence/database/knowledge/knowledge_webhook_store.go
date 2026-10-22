package store

import (
	"context"
	"database/sql"
	"errors"
	"net"
	"net/url"
	"sort"
	"strings"
	"time"

	"github.com/domainry/domainry-foundation/entityid"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-orm/query"
)

const knowledgeWebhookMaximumRecords = 200

var knowledgeWebhookEventActions = map[string]string{
	knowledgesdk.KnowledgeWebhookPagePublished:     knowledgesdk.ActionPagesGet,
	knowledgesdk.KnowledgeWebhookCommentMentioned:  knowledgesdk.ActionPageCommentsList,
	knowledgesdk.KnowledgeWebhookTaskChanged:       knowledgesdk.ActionPageTasksList,
	knowledgesdk.KnowledgeWebhookPermissionChanged: knowledgesdk.ActionPageAccessGet,
	knowledgesdk.KnowledgeWebhookIndexCompleted:    knowledgesdk.ActionPageSearch,
}

func normalizeWebhookEventTypes(values []string) ([]string, error) {
	if len(values) == 0 || len(values) > len(knowledgeWebhookEventActions) {
		return nil, conversationError("bad_request", "webhook_event_types_invalid")
	}
	result := append([]string(nil), values...)
	sort.Strings(result)
	for index, value := range result {
		if _, ok := knowledgeWebhookEventActions[value]; !ok || index > 0 && result[index-1] == value {
			return nil, conversationError("bad_request", "webhook_event_types_invalid")
		}
	}
	return result, nil
}

func validateWebhookEndpoint(raw string) (string, error) {
	raw = strings.TrimSpace(raw)
	if raw == "" || len(raw) > 2048 {
		return "", conversationError("bad_request", "webhook_endpoint_invalid")
	}
	parsed, err := url.ParseRequestURI(raw)
	if err != nil || parsed.Scheme != "https" || parsed.Host == "" || parsed.User != nil || parsed.Fragment != "" || parsed.Port() != "" && parsed.Port() != "443" {
		return "", conversationError("bad_request", "webhook_endpoint_invalid")
	}
	host := strings.ToLower(strings.TrimSuffix(parsed.Hostname(), "."))
	if host == "" || net.ParseIP(host) != nil || !strings.Contains(host, ".") {
		return "", conversationError("bad_request", "webhook_endpoint_invalid")
	}
	for _, suffix := range []string{"localhost", ".localhost", ".local", ".internal", ".home", ".lan", ".test", ".invalid", ".example"} {
		if host == suffix || strings.HasSuffix(host, suffix) {
			return "", conversationError("bad_request", "webhook_endpoint_invalid")
		}
	}
	return parsed.String(), nil
}

func webhookSubscriptionScope(a knowledgesdk.Authority, subscriptionID string) query.Predicate {
	return query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("subscription_id", subscriptionID))
}

func webhookEventScope(a knowledgesdk.Authority, eventID string) query.Predicate {
	return query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("event_id", eventID))
}

func webhookDeliveryScope(scope, eventID, subscriptionID string) query.Predicate {
	return query.And(query.Equal("scope_key", scope), query.Equal("event_id", eventID), query.Equal("subscription_id", subscriptionID))
}

func containsWebhookEvent(values []string, eventType string) bool {
	index := sort.SearchStrings(values, eventType)
	return index < len(values) && values[index] == eventType
}

func sameKnowledgeWebhookEvent(left, right knowledgesdk.KnowledgeWebhookEvent) bool {
	return left.ID == right.ID && left.Type == right.Type && left.Action == right.Action && left.WorkspaceID == right.WorkspaceID && left.LibraryID == right.LibraryID && left.PageID == right.PageID && left.ResourceID == right.ResourceID && left.Version == right.Version && left.ActorUserID == right.ActorUserID
}

func (s *Store) KnowledgeWebhookSubscriptions(ctx context.Context, libraryID string, a knowledgesdk.Authority) (out knowledgesdk.KnowledgeWebhookSubscriptionPage, err error) {
	out.Items = []knowledgesdk.KnowledgeWebhookSubscription{}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		if _, e := s.libraryRecord(ctx, tx, libraryID, a); e != nil {
			return e
		}
		statement, args, e := query.NewSelectBuilder(s.store.Renderer(), knowledgeWebhookSubscriptionTable).Columns("payload_json").Where(query.And(libraryPredicate(a, libraryID))).OrderBy(query.Ascending("subscription_id")).Limit(knowledgeWebhookMaximumRecords + 1).Build()
		if e != nil {
			return e
		}
		rows, e := tx.QueryContext(ctx, statement, args...)
		if e != nil {
			return e
		}
		defer rows.Close()
		for rows.Next() {
			var raw []byte
			var item knowledgesdk.KnowledgeWebhookSubscription
			if e = rows.Scan(&raw); e != nil {
				return e
			}
			if e = unmarshalDurableJSON(raw, &item); e != nil {
				return e
			}
			out.Items = append(out.Items, item)
		}
		if len(out.Items) > knowledgeWebhookMaximumRecords {
			return conversationError("conflict", "webhook_subscription_limit_exceeded")
		}
		return rows.Err()
	})
	return
}

func (s *Store) CreateKnowledgeWebhookSubscription(ctx context.Context, libraryID string, in knowledgesdk.KnowledgeWebhookSubscriptionCreate, a knowledgesdk.Authority) (out knowledgesdk.KnowledgeWebhookSubscription, err error) {
	events, err := normalizeWebhookEventTypes(in.EventTypes)
	if err != nil || !executionText(in.ApplicationKey, 255, true) || strings.TrimSpace(in.ApplicationKey) != in.ApplicationKey {
		return out, conversationError("bad_request", "webhook_subscription_invalid")
	}
	endpoint, err := validateWebhookEndpoint(in.EndpointURL)
	if err != nil {
		return out, err
	}
	if _, err = pageRequestKey("webhook_subscription_create", libraryID, libraryID, in.ClientID, a); err != nil {
		return out, err
	}
	err = s.mutateKnowledgeOperation(ctx, "knowledge.webhook_subscription.create", knowledgesdk.ActionWebhookSubscriptionsCreate, libraryID, in.ClientID, in, a, func(tx *sql.Tx) (any, error) {
		if _, e := s.libraryRecord(ctx, tx, libraryID, a); e != nil {
			return out, e
		}
		id, e := randomKnowledgeID("kwhsub_")
		if e != nil {
			return out, e
		}
		now := time.Now().UTC().Truncate(time.Millisecond)
		out = knowledgesdk.KnowledgeWebhookSubscription{ID: id, LibraryID: libraryID, ApplicationKey: in.ApplicationKey, EndpointURL: endpoint, EventTypes: events, State: knowledgesdk.KnowledgeWebhookSubscriptionActive, Revision: 1, CreatedByUserID: a.UserID, CreatedAt: now, UpdatedAt: now}
		requestKey, _ := pageRequestKey("webhook_subscription_create", libraryID, libraryID, in.ClientID, a)
		statement, args, e := query.NewInsertBuilder(s.store.Renderer(), knowledgeWebhookSubscriptionTable).Columns("scope_key", "subscription_id", "library_id", "application_key", "state", "revision", "updated_at", "request_key", "request_hash", "payload_json").Values(libraryScope(a), id, libraryID, out.ApplicationKey, out.State, out.Revision, now.UnixMilli(), requestKey, conversationHash(in), conversationJSON(out)).Build()
		if e = conversationExec(ctx, tx, statement, args, e); e != nil {
			return out, e
		}
		return out, nil
	}, &out)
	return
}

func (s *Store) UpdateKnowledgeWebhookSubscription(ctx context.Context, libraryID, subscriptionID string, in knowledgesdk.KnowledgeWebhookSubscriptionUpdate, a knowledgesdk.Authority) (out knowledgesdk.KnowledgeWebhookSubscription, err error) {
	events, err := normalizeWebhookEventTypes(in.EventTypes)
	if err != nil || entityid.Validate("kwhsub", subscriptionID) != nil || in.ExpectedRevision < 1 || in.State != knowledgesdk.KnowledgeWebhookSubscriptionActive && in.State != knowledgesdk.KnowledgeWebhookSubscriptionRevoked {
		return out, conversationError("bad_request", "webhook_subscription_invalid")
	}
	endpoint, err := validateWebhookEndpoint(in.EndpointURL)
	if err != nil {
		return out, err
	}
	err = s.mutateKnowledgeOperation(ctx, "knowledge.webhook_subscription.update", knowledgesdk.ActionWebhookSubscriptionsUpdate, libraryID+":"+subscriptionID, in.ClientID, in, a, func(tx *sql.Tx) (any, error) {
		if _, e := s.libraryRecord(ctx, tx, libraryID, a); e != nil {
			return out, e
		}
		found, e := s.executionRead(ctx, tx, knowledgeWebhookSubscriptionTable, webhookSubscriptionScope(a, subscriptionID), &out)
		if e != nil {
			return out, e
		}
		if !found || out.LibraryID != libraryID {
			return out, conversationError("not_found", "webhook_subscription_not_found")
		}
		if out.Revision != in.ExpectedRevision {
			return out, conversationError("conflict", "webhook_subscription_revision_conflict")
		}
		out.EndpointURL, out.EventTypes, out.State = endpoint, events, in.State
		out.Revision++
		out.UpdatedAt = time.Now().UTC().Truncate(time.Millisecond)
		statement, args, e := query.NewUpdateBuilder(s.store.Renderer(), knowledgeWebhookSubscriptionTable).Set("state", out.State).Set("revision", out.Revision).Set("updated_at", out.UpdatedAt.UnixMilli()).Set("payload_json", conversationJSON(out)).Where(query.And(webhookSubscriptionScope(a, subscriptionID), query.Equal("revision", in.ExpectedRevision))).Build()
		if e = conversationCAS(ctx, tx, statement, args, e); e != nil {
			return out, conversationError("conflict", "webhook_subscription_revision_conflict")
		}
		if out.State == knowledgesdk.KnowledgeWebhookSubscriptionRevoked {
			statement, args, e = query.NewUpdateBuilder(s.store.Renderer(), knowledgeWebhookDeliveryTable).Set("state", knowledgesdk.KnowledgeWebhookDeliveryRevoked).Set("lease_until", 0).Set("updated_at", out.UpdatedAt.UnixMilli()).Where(query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("subscription_id", subscriptionID), query.In("state", knowledgesdk.KnowledgeWebhookDeliveryPending, knowledgesdk.KnowledgeWebhookDeliveryDelivering))).Build()
			e = conversationExec(ctx, tx, statement, args, e)
		}
		return out, e
	}, &out)
	return
}

func (s *Store) AppendKnowledgeWebhookEvent(ctx context.Context, event knowledgesdk.KnowledgeWebhookEvent) error {
	if conversationAuthority(event.Authority) != nil || entityid.Validate("kwhevt", event.ID) != nil || knowledgeWebhookEventActions[event.Type] != event.Action || !validLibraryID(event.LibraryID) || event.PageID != "" && !validKnowledgePageID(event.PageID) || event.WorkspaceID != "" && event.WorkspaceID != event.Authority.WorkspaceID {
		return conversationError("bad_request", "webhook_event_invalid")
	}
	event.ActorUserID, event.WorkspaceID, event.OccurredAt = event.Authority.UserID, event.Authority.WorkspaceID, event.OccurredAt.UTC().Truncate(time.Millisecond)
	if event.OccurredAt.IsZero() {
		event.OccurredAt = time.Now().UTC().Truncate(time.Millisecond)
	}
	scope := libraryScope(event.Authority)
	return s.transaction(ctx, func(tx *sql.Tx) error {
		var existing knowledgesdk.KnowledgeWebhookEvent
		found, err := s.executionRead(ctx, tx, knowledgeWebhookEventTable, query.And(query.Equal("scope_key", scope), query.Equal("event_id", event.ID)), &existing)
		if err != nil {
			return err
		}
		if found {
			if !sameKnowledgeWebhookEvent(existing, event) {
				return conversationError("conflict", "webhook_event_idempotency_conflict")
			}
			return s.createWebhookDeliveries(ctx, tx, scope, existing, event.Authority.RuntimeID, false)
		}
		statement, args, err := query.NewInsertBuilder(s.store.Renderer(), knowledgeWebhookEventTable).Columns("scope_key", "event_id", "event_type", "library_id", "page_id", "resource_id", "version", "occurred_at", "payload_json").Values(scope, event.ID, event.Type, event.LibraryID, event.PageID, event.ResourceID, event.Version, event.OccurredAt.UnixMilli(), conversationJSON(event)).OnConflictDoNothing("scope_key", "event_id").Build()
		if err = conversationExec(ctx, tx, statement, args, err); err != nil {
			return err
		}
		return s.createWebhookDeliveries(ctx, tx, scope, event, event.Authority.RuntimeID, false)
	})
}

func (s *Store) createWebhookDeliveries(ctx context.Context, tx *sql.Tx, scope string, event knowledgesdk.KnowledgeWebhookEvent, runtimeID string, replay bool) error {
	statement, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgeWebhookSubscriptionTable).Columns("payload_json").Where(query.And(query.Equal("scope_key", scope), query.Equal("library_id", event.LibraryID), query.Equal("state", knowledgesdk.KnowledgeWebhookSubscriptionActive))).OrderBy(query.Ascending("subscription_id")).Limit(knowledgeWebhookMaximumRecords + 1).Build()
	if err != nil {
		return err
	}
	rows, err := tx.QueryContext(ctx, statement, args...)
	if err != nil {
		return err
	}
	var subscriptions []knowledgesdk.KnowledgeWebhookSubscription
	for rows.Next() {
		var raw []byte
		var subscription knowledgesdk.KnowledgeWebhookSubscription
		if err = rows.Scan(&raw); err == nil {
			err = unmarshalDurableJSON(raw, &subscription)
		}
		if err != nil {
			_ = rows.Close()
			return err
		}
		if containsWebhookEvent(subscription.EventTypes, event.Type) {
			subscriptions = append(subscriptions, subscription)
		}
	}
	if err = rows.Close(); err != nil {
		return err
	}
	if len(subscriptions) > knowledgeWebhookMaximumRecords {
		return conversationError("conflict", "webhook_subscription_limit_exceeded")
	}
	now := time.Now().UTC().Truncate(time.Millisecond)
	for _, subscription := range subscriptions {
		delivery := knowledgesdk.KnowledgeWebhookDelivery{EventID: event.ID, SubscriptionID: subscription.ID, State: knowledgesdk.KnowledgeWebhookDeliveryPending, NextAttemptAt: now, UpdatedAt: now}
		insert := query.NewInsertBuilder(s.store.Renderer(), knowledgeWebhookDeliveryTable).Columns("scope_key", "event_id", "subscription_id", "runtime_id", "state", "attempt", "next_attempt_at", "lease_until", "fence", "updated_at", "payload_json").Values(scope, event.ID, subscription.ID, runtimeID, delivery.State, 0, now.UnixMilli(), 0, 0, now.UnixMilli(), conversationJSON(delivery))
		if replay {
			insert = insert.OnConflictDoUpdate([]string{"scope_key", "event_id", "subscription_id"}, query.Assign("state", delivery.State), query.Assign("attempt", 0), query.Assign("next_attempt_at", now.UnixMilli()), query.Assign("lease_until", 0), query.Assign("updated_at", now.UnixMilli()), query.Assign("payload_json", conversationJSON(delivery)))
		} else {
			insert = insert.OnConflictDoNothing("scope_key", "event_id", "subscription_id")
		}
		statement, args, err = insert.Build()
		if err = conversationExec(ctx, tx, statement, args, err); err != nil {
			return err
		}
	}
	return nil
}

func (s *Store) KnowledgeWebhookEvents(ctx context.Context, libraryID string, a knowledgesdk.Authority) (out knowledgesdk.KnowledgeWebhookEventPage, err error) {
	out.Items = []knowledgesdk.KnowledgeWebhookEventRecord{}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		if _, e := s.libraryRecord(ctx, tx, libraryID, a); e != nil {
			return e
		}
		statement, args, e := query.NewSelectBuilder(s.store.Renderer(), knowledgeWebhookEventTable).Columns("payload_json").Where(libraryPredicate(a, libraryID)).OrderBy(query.Descending("occurred_at"), query.Descending("event_id")).Limit(knowledgeWebhookMaximumRecords).Build()
		if e != nil {
			return e
		}
		rows, e := tx.QueryContext(ctx, statement, args...)
		if e != nil {
			return e
		}
		var events []knowledgesdk.KnowledgeWebhookEvent
		for rows.Next() {
			var raw []byte
			var event knowledgesdk.KnowledgeWebhookEvent
			if e = rows.Scan(&raw); e == nil {
				e = unmarshalDurableJSON(raw, &event)
			}
			if e != nil {
				_ = rows.Close()
				return e
			}
			events = append(events, event)
		}
		if e = rows.Close(); e != nil {
			return e
		}
		for _, event := range events {
			record := knowledgesdk.KnowledgeWebhookEventRecord{Event: event, Deliveries: []knowledgesdk.KnowledgeWebhookDelivery{}}
			statement, args, e = query.NewSelectBuilder(s.store.Renderer(), knowledgeWebhookDeliveryTable).Columns("payload_json").Where(webhookEventScope(a, event.ID)).OrderBy(query.Ascending("subscription_id")).Build()
			if e != nil {
				return e
			}
			deliveryRows, queryErr := tx.QueryContext(ctx, statement, args...)
			if queryErr != nil {
				return queryErr
			}
			for deliveryRows.Next() {
				var raw []byte
				var delivery knowledgesdk.KnowledgeWebhookDelivery
				if queryErr = deliveryRows.Scan(&raw); queryErr == nil {
					queryErr = unmarshalDurableJSON(raw, &delivery)
				}
				if queryErr != nil {
					break
				}
				record.Deliveries = append(record.Deliveries, delivery)
			}
			queryErr = errors.Join(queryErr, deliveryRows.Close())
			if queryErr != nil {
				return queryErr
			}
			out.Items = append(out.Items, record)
		}
		return nil
	})
	return
}

func (s *Store) ReplayKnowledgeWebhookEvent(ctx context.Context, libraryID, eventID string, a knowledgesdk.Authority) (out knowledgesdk.KnowledgeWebhookEventRecord, err error) {
	if entityid.Validate("kwhevt", eventID) != nil {
		return out, conversationError("bad_request", "webhook_event_invalid")
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		if _, e := s.libraryRecord(ctx, tx, libraryID, a); e != nil {
			return e
		}
		found, e := s.executionRead(ctx, tx, knowledgeWebhookEventTable, webhookEventScope(a, eventID), &out.Event)
		if e != nil {
			return e
		}
		if !found || out.Event.LibraryID != libraryID {
			return conversationError("not_found", "webhook_event_not_found")
		}
		return s.createWebhookDeliveries(ctx, tx, libraryScope(a), out.Event, a.RuntimeID, true)
	})
	if err == nil {
		page, listErr := s.KnowledgeWebhookEvents(ctx, libraryID, a)
		if listErr != nil {
			return out, listErr
		}
		for _, record := range page.Items {
			if record.Event.ID == eventID {
				return record, nil
			}
		}
	}
	return
}

func (s *Store) ClaimKnowledgeWebhookDelivery(ctx context.Context, runtimeID string, now time.Time, leaseDuration time.Duration) (out knowledgesdk.KnowledgeWebhookWork, claimed bool, err error) {
	if strings.TrimSpace(runtimeID) == "" || leaseDuration <= 0 {
		return out, false, conversationError("bad_request", "webhook_claim_invalid")
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		statement, args, e := query.NewSelectBuilder(s.store.Renderer(), knowledgeWebhookDeliveryTable).Columns("scope_key", "payload_json", "fence").Where(query.And(query.Equal("runtime_id", runtimeID), query.In("state", knowledgesdk.KnowledgeWebhookDeliveryPending, knowledgesdk.KnowledgeWebhookDeliveryDelivering), query.LessThanOrEqual("next_attempt_at", now.UnixMilli()), query.LessThanOrEqual("lease_until", now.UnixMilli()))).OrderBy(query.Ascending("next_attempt_at"), query.Ascending("event_id"), query.Ascending("subscription_id")).Limit(1).Build()
		if e != nil {
			return e
		}
		var scope string
		var raw []byte
		var fence int64
		if e = tx.QueryRowContext(ctx, statement, args...).Scan(&scope, &raw, &fence); errors.Is(e, sql.ErrNoRows) {
			return nil
		} else if e != nil {
			return e
		}
		if e = unmarshalDurableJSON(raw, &out.Delivery); e != nil {
			return e
		}
		var event knowledgesdk.KnowledgeWebhookEvent
		found, e := s.executionRead(ctx, tx, knowledgeWebhookEventTable, query.And(query.Equal("scope_key", scope), query.Equal("event_id", out.Delivery.EventID)), &event)
		if e != nil {
			return e
		}
		if !found {
			return conversationError("unavailable", "webhook_event_unavailable")
		}
		var subscription knowledgesdk.KnowledgeWebhookSubscription
		found, e = s.executionRead(ctx, tx, knowledgeWebhookSubscriptionTable, query.And(query.Equal("scope_key", scope), query.Equal("subscription_id", out.Delivery.SubscriptionID)), &subscription)
		if e != nil {
			return e
		}
		if !found {
			return conversationError("unavailable", "webhook_subscription_unavailable")
		}
		if subscription.State != knowledgesdk.KnowledgeWebhookSubscriptionActive {
			now = now.UTC().Truncate(time.Millisecond)
			out.Delivery.State, out.Delivery.UpdatedAt = knowledgesdk.KnowledgeWebhookDeliveryRevoked, now
			statement, args, e = query.NewUpdateBuilder(s.store.Renderer(), knowledgeWebhookDeliveryTable).Set("state", out.Delivery.State).Set("lease_until", 0).Set("updated_at", now.UnixMilli()).Set("payload_json", conversationJSON(out.Delivery)).Where(query.And(webhookDeliveryScope(scope, out.Delivery.EventID, out.Delivery.SubscriptionID), query.Equal("fence", fence))).Build()
			return conversationCAS(ctx, tx, statement, args, e)
		}
		if !containsWebhookEvent(subscription.EventTypes, event.Type) {
			now = now.UTC().Truncate(time.Millisecond)
			out.Delivery.State, out.Delivery.UpdatedAt = knowledgesdk.KnowledgeWebhookDeliveryRevoked, now
			statement, args, e = query.NewUpdateBuilder(s.store.Renderer(), knowledgeWebhookDeliveryTable).Set("state", out.Delivery.State).Set("lease_until", 0).Set("updated_at", now.UnixMilli()).Set("payload_json", conversationJSON(out.Delivery)).Where(query.And(webhookDeliveryScope(scope, out.Delivery.EventID, out.Delivery.SubscriptionID), query.Equal("fence", fence))).Build()
			return conversationCAS(ctx, tx, statement, args, e)
		}
		out.ScopeKey, out.Event, out.Subscription = scope, event, subscription
		out.Fence, out.LeaseExpiresAt = fence+1, now.Add(leaseDuration).UTC().Truncate(time.Millisecond)
		out.Delivery.State, out.Delivery.Attempt, out.Delivery.UpdatedAt = knowledgesdk.KnowledgeWebhookDeliveryDelivering, out.Delivery.Attempt+1, now.UTC().Truncate(time.Millisecond)
		statement, args, e = query.NewUpdateBuilder(s.store.Renderer(), knowledgeWebhookDeliveryTable).Set("state", out.Delivery.State).Set("attempt", out.Delivery.Attempt).Set("lease_until", out.LeaseExpiresAt.UnixMilli()).Set("fence", out.Fence).Set("updated_at", out.Delivery.UpdatedAt.UnixMilli()).Set("payload_json", conversationJSON(out.Delivery)).Where(query.And(webhookDeliveryScope(scope, out.Delivery.EventID, out.Delivery.SubscriptionID), query.Equal("fence", fence))).Build()
		if e = conversationCAS(ctx, tx, statement, args, e); e != nil {
			return e
		}
		claimed = true
		return nil
	})
	return
}

func (s *Store) CompleteKnowledgeWebhookDelivery(ctx context.Context, work knowledgesdk.KnowledgeWebhookWork, result knowledgesdk.KnowledgeWebhookDeliveryResult) error {
	now := time.Now().UTC().Truncate(time.Millisecond)
	state := knowledgesdk.KnowledgeWebhookDeliveryFailed
	if result.Delivered {
		state = knowledgesdk.KnowledgeWebhookDeliveryDelivered
	} else if result.ErrorCode == "authorization_revoked" {
		state = knowledgesdk.KnowledgeWebhookDeliveryRevoked
	} else if !result.RetryAt.IsZero() {
		state = knowledgesdk.KnowledgeWebhookDeliveryPending
	}
	work.Delivery.State, work.Delivery.LastStatusCode, work.Delivery.LastErrorCode, work.Delivery.UpdatedAt = state, result.StatusCode, result.ErrorCode, now
	if result.RetryAt.IsZero() {
		result.RetryAt = now
	}
	return s.transaction(ctx, func(tx *sql.Tx) error {
		statement, args, err := query.NewUpdateBuilder(s.store.Renderer(), knowledgeWebhookDeliveryTable).Set("state", state).Set("next_attempt_at", result.RetryAt.UTC().UnixMilli()).Set("lease_until", 0).Set("updated_at", now.UnixMilli()).Set("payload_json", conversationJSON(work.Delivery)).Where(query.And(webhookDeliveryScope(work.ScopeKey, work.Delivery.EventID, work.Delivery.SubscriptionID), query.Equal("state", knowledgesdk.KnowledgeWebhookDeliveryDelivering), query.Equal("fence", work.Fence))).Build()
		return conversationCAS(ctx, tx, statement, args, err)
	})
}

var _ knowledgesdk.KnowledgeWebhookRepository = (*Store)(nil)
