package application

import (
	"context"
	"errors"
	"sort"
	"strings"
	"time"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

const (
	knowledgeWebhookLeaseDuration = 30 * time.Second
	knowledgeWebhookMaxAttempts   = 10
)

var knowledgeWebhookRequiredActions = map[string]string{
	knowledgesdk.KnowledgeWebhookPagePublished:     knowledgesdk.ActionPagesGet,
	knowledgesdk.KnowledgeWebhookCommentMentioned:  knowledgesdk.ActionPageCommentsList,
	knowledgesdk.KnowledgeWebhookTaskChanged:       knowledgesdk.ActionPageTasksList,
	knowledgesdk.KnowledgeWebhookPermissionChanged: knowledgesdk.ActionPageAccessGet,
	knowledgesdk.KnowledgeWebhookIndexCompleted:    knowledgesdk.ActionPageSearch,
}

func (s *Service) webhookAccess(ctx context.Context, libraryID, action string, authority knowledgesdk.Authority) (knowledgesdk.KnowledgeWebhookRepository, error) {
	if _, _, err := s.pageAccess(ctx, libraryID, action, authority); err != nil {
		return nil, err
	}
	repository, ok := s.repo.(knowledgesdk.KnowledgeWebhookRepository)
	if !ok {
		return nil, conversationFailure("unavailable", "webhooks_unavailable")
	}
	return repository, nil
}

func (s *Service) validateKnowledgeWebhookApplication(ctx context.Context, libraryID, applicationKey string, eventTypes []string, caller knowledgesdk.Authority) error {
	if !conversationText(applicationKey, 255, true) || strings.TrimSpace(applicationKey) != applicationKey || len(eventTypes) == 0 || len(eventTypes) > len(knowledgeWebhookRequiredActions) {
		return conversationFailure("bad_request", "webhook_subscription_invalid")
	}
	if s.options.TrustedApplicationResolver == nil {
		return conversationFailure("unavailable", "trusted_application_resolver_unavailable")
	}
	values := append([]string(nil), eventTypes...)
	sort.Strings(values)
	for index, eventType := range values {
		action, ok := knowledgeWebhookRequiredActions[eventType]
		if !ok || index > 0 && values[index-1] == eventType {
			return conversationFailure("bad_request", "webhook_event_types_invalid")
		}
		resolved, err := s.options.TrustedApplicationResolver.ResolveKnowledgeTrustedApplication(ctx, applicationKey, action)
		if err != nil {
			return err
		}
		if err = s.authorize(resolved); err != nil || resolved.RuntimeID != caller.RuntimeID || resolved.WorkspaceID != caller.WorkspaceID {
			return conversationFailure("forbidden", "trusted_application_scope_denied")
		}
		if err = s.recheckPageAction(ctx, libraryID, action, resolved); err != nil {
			return err
		}
	}
	return nil
}

func (s *Service) KnowledgeWebhookSubscriptions(ctx context.Context, libraryID string, authority knowledgesdk.Authority) (knowledgesdk.KnowledgeWebhookSubscriptionPage, error) {
	repository, err := s.webhookAccess(ctx, libraryID, knowledgesdk.ActionWebhookSubscriptionsList, authority)
	if err != nil {
		return knowledgesdk.KnowledgeWebhookSubscriptionPage{}, err
	}
	result, err := repository.KnowledgeWebhookSubscriptions(ctx, libraryID, authority)
	if err == nil {
		err = s.recheckPageAction(ctx, libraryID, knowledgesdk.ActionWebhookSubscriptionsList, authority)
	}
	return result, err
}

func (s *Service) CreateKnowledgeWebhookSubscription(ctx context.Context, libraryID string, input knowledgesdk.KnowledgeWebhookSubscriptionCreate, authority knowledgesdk.Authority) (knowledgesdk.KnowledgeWebhookSubscription, error) {
	repository, err := s.webhookAccess(ctx, libraryID, knowledgesdk.ActionWebhookSubscriptionsCreate, authority)
	if err != nil {
		return knowledgesdk.KnowledgeWebhookSubscription{}, err
	}
	if err = s.validateKnowledgeWebhookApplication(ctx, libraryID, input.ApplicationKey, input.EventTypes, authority); err != nil {
		return knowledgesdk.KnowledgeWebhookSubscription{}, err
	}
	result, err := repository.CreateKnowledgeWebhookSubscription(ctx, libraryID, input, authority)
	if err == nil {
		err = s.recheckPageAction(ctx, libraryID, knowledgesdk.ActionWebhookSubscriptionsCreate, authority)
	}
	return result, err
}

func (s *Service) UpdateKnowledgeWebhookSubscription(ctx context.Context, libraryID, subscriptionID string, input knowledgesdk.KnowledgeWebhookSubscriptionUpdate, authority knowledgesdk.Authority) (knowledgesdk.KnowledgeWebhookSubscription, error) {
	repository, err := s.webhookAccess(ctx, libraryID, knowledgesdk.ActionWebhookSubscriptionsUpdate, authority)
	if err != nil {
		return knowledgesdk.KnowledgeWebhookSubscription{}, err
	}
	current, err := repository.KnowledgeWebhookSubscriptions(ctx, libraryID, authority)
	if err != nil {
		return knowledgesdk.KnowledgeWebhookSubscription{}, err
	}
	applicationKey := ""
	for _, item := range current.Items {
		if item.ID == subscriptionID {
			applicationKey = item.ApplicationKey
			break
		}
	}
	if applicationKey == "" {
		return knowledgesdk.KnowledgeWebhookSubscription{}, conversationFailure("not_found", "webhook_subscription_not_found")
	}
	if input.State == knowledgesdk.KnowledgeWebhookSubscriptionActive {
		if err = s.validateKnowledgeWebhookApplication(ctx, libraryID, applicationKey, input.EventTypes, authority); err != nil {
			return knowledgesdk.KnowledgeWebhookSubscription{}, err
		}
	}
	result, err := repository.UpdateKnowledgeWebhookSubscription(ctx, libraryID, subscriptionID, input, authority)
	if err == nil {
		err = s.recheckPageAction(ctx, libraryID, knowledgesdk.ActionWebhookSubscriptionsUpdate, authority)
	}
	return result, err
}

func (s *Service) KnowledgeWebhookEvents(ctx context.Context, libraryID string, authority knowledgesdk.Authority) (knowledgesdk.KnowledgeWebhookEventPage, error) {
	repository, err := s.webhookAccess(ctx, libraryID, knowledgesdk.ActionWebhookEventsList, authority)
	if err != nil {
		return knowledgesdk.KnowledgeWebhookEventPage{}, err
	}
	result, err := repository.KnowledgeWebhookEvents(ctx, libraryID, authority)
	if err == nil {
		err = s.recheckPageAction(ctx, libraryID, knowledgesdk.ActionWebhookEventsList, authority)
	}
	return result, err
}

func (s *Service) ReplayKnowledgeWebhookEvent(ctx context.Context, libraryID, eventID string, authority knowledgesdk.Authority) (knowledgesdk.KnowledgeWebhookEventRecord, error) {
	repository, err := s.webhookAccess(ctx, libraryID, knowledgesdk.ActionWebhookEventsReplay, authority)
	if err != nil {
		return knowledgesdk.KnowledgeWebhookEventRecord{}, err
	}
	result, err := repository.ReplayKnowledgeWebhookEvent(ctx, libraryID, eventID, authority)
	if err == nil {
		err = s.recheckPageAction(ctx, libraryID, knowledgesdk.ActionWebhookEventsReplay, authority)
	}
	if err == nil {
		s.WakeKnowledgeWebhooks()
	}
	return result, err
}

func (s *Service) WakeKnowledgeWebhooks() {
	select {
	case s.webhookWake <- struct{}{}:
	default:
	}
}

func (s *Service) WebhookWorkerEnabled() bool {
	_, ok := s.repo.(knowledgesdk.KnowledgeWebhookRepository)
	return ok && s.options.WebhookDeliverer != nil && s.options.TrustedApplicationResolver != nil
}

func (s *Service) WebhookWorkerInterval() time.Duration  { return s.options.WebhookPoll }
func (s *Service) WebhookWorkerWakeups() <-chan struct{} { return s.webhookWake }

func knowledgeWebhookRetry(attempt int, statusCode int, code string, now time.Time) knowledgesdk.KnowledgeWebhookDeliveryResult {
	if code == "" {
		code = "delivery_failed"
	}
	result := knowledgesdk.KnowledgeWebhookDeliveryResult{StatusCode: statusCode, ErrorCode: code}
	if attempt < knowledgeWebhookMaxAttempts {
		delay := time.Second << min(attempt-1, 6)
		result.RetryAt = now.Add(delay)
	}
	return result
}

func knowledgeWebhookAuthorizationRevoked(err error) bool {
	var classified *knowledgesdk.Error
	if !errors.As(err, &classified) {
		return false
	}
	return !classified.Retryable && (classified.Class == knowledgesdk.ErrorClassForbidden || classified.Class == knowledgesdk.ErrorClassNotFound || classified.Class == knowledgesdk.ErrorClassBadRequest)
}

func knowledgeWebhookRetryableStatus(statusCode int) bool {
	return statusCode == 408 || statusCode == 429 || statusCode >= 500
}

func (s *Service) KnowledgeWebhookWorkerTick(ctx context.Context) (WorkerTickResult, error) {
	repository, ok := s.repo.(knowledgesdk.KnowledgeWebhookRepository)
	if !ok || s.options.WebhookDeliverer == nil || s.options.TrustedApplicationResolver == nil {
		return WorkerTickResult{}, nil
	}
	now := time.Now().UTC()
	work, claimed, err := repository.ClaimKnowledgeWebhookDelivery(ctx, s.runtimeID, now, knowledgeWebhookLeaseDuration)
	if err != nil || !claimed {
		return WorkerTickResult{}, err
	}
	result := knowledgesdk.KnowledgeWebhookDeliveryResult{}
	serviceAuthority, authorizationErr := s.options.TrustedApplicationResolver.ResolveKnowledgeTrustedApplication(ctx, work.Subscription.ApplicationKey, work.Event.Action)
	if authorizationErr == nil {
		authorizationErr = s.authorize(serviceAuthority)
	}
	if authorizationErr == nil && (serviceAuthority.RuntimeID != s.runtimeID || serviceAuthority.WorkspaceID != work.Event.WorkspaceID) {
		authorizationErr = conversationFailure("forbidden", "trusted_application_scope_denied")
	}
	if authorizationErr == nil {
		if work.Event.PageID == "" {
			authorizationErr = s.recheckPageAction(ctx, work.Event.LibraryID, work.Event.Action, serviceAuthority)
		} else {
			authorizationErr = s.recheckPageItemAction(ctx, work.Event.LibraryID, work.Event.PageID, work.Event.Action, serviceAuthority)
		}
	}
	if authorizationErr != nil {
		if knowledgeWebhookAuthorizationRevoked(authorizationErr) {
			result.ErrorCode = "authorization_revoked"
		} else {
			result = knowledgeWebhookRetry(work.Delivery.Attempt, 0, "authorization_unavailable", now)
		}
	} else {
		result, err = s.options.WebhookDeliverer.DeliverKnowledgeWebhook(ctx, knowledgesdk.KnowledgeWebhookDeliveryRequest{
			ApplicationKey: work.Subscription.ApplicationKey,
			EndpointURL:    work.Subscription.EndpointURL,
			Event:          work.Event,
			IdempotencyKey: work.Event.ID,
		})
		if err != nil {
			result = knowledgeWebhookRetry(work.Delivery.Attempt, result.StatusCode, "delivery_unavailable", now)
		} else if !result.Delivered && result.RetryAt.IsZero() && knowledgeWebhookRetryableStatus(result.StatusCode) {
			result = knowledgeWebhookRetry(work.Delivery.Attempt, result.StatusCode, result.ErrorCode, now)
		}
		if work.Delivery.Attempt >= knowledgeWebhookMaxAttempts {
			result.RetryAt = time.Time{}
		}
	}
	finish, cancel := context.WithTimeout(context.WithoutCancel(ctx), 5*time.Second)
	defer cancel()
	if completeErr := repository.CompleteKnowledgeWebhookDelivery(finish, work, result); completeErr != nil {
		return WorkerTickResult{Worked: true, ProcessedCount: 1}, completeErr
	}
	return WorkerTickResult{Worked: true, ProcessedCount: 1}, nil
}
