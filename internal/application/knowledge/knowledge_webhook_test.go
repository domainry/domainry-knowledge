package application

import (
	"context"
	"errors"
	"testing"
	"time"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/contract"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
)

type webhookWorkerRepository struct {
	knowledgesdk.KnowledgeWebhookRepository
	persistence.KnowledgeLibraryRepository
	knowledgesdk.KnowledgePageAccessRepository
	work       knowledgesdk.KnowledgeWebhookWork
	claimed    bool
	completed  []knowledgesdk.KnowledgeWebhookDeliveryResult
	library    knowledgesdk.KnowledgeLibrary
	pageAccess knowledgesdk.KnowledgePageEffectiveAccess
}

func (repository *webhookWorkerRepository) ClaimKnowledgeWebhookDelivery(context.Context, string, time.Time, time.Duration) (knowledgesdk.KnowledgeWebhookWork, bool, error) {
	if !repository.claimed {
		return knowledgesdk.KnowledgeWebhookWork{}, false, nil
	}
	repository.claimed = false
	return repository.work, true, nil
}

func (repository *webhookWorkerRepository) CompleteKnowledgeWebhookDelivery(_ context.Context, _ knowledgesdk.KnowledgeWebhookWork, result knowledgesdk.KnowledgeWebhookDeliveryResult) error {
	repository.completed = append(repository.completed, result)
	return nil
}

func (repository *webhookWorkerRepository) KnowledgeLibrary(context.Context, string, knowledgesdk.Authority) (knowledgesdk.KnowledgeLibrary, error) {
	return repository.library, nil
}

func (repository *webhookWorkerRepository) EvaluateKnowledgePageAccess(context.Context, string, string, knowledgesdk.Authority) (knowledgesdk.KnowledgePageEffectiveAccess, error) {
	return repository.pageAccess, nil
}

type webhookAuthorizer struct{}

func (webhookAuthorizer) AuthorizeKnowledgeLibrary(context.Context, string, knowledgesdk.KnowledgeLibrary, knowledgesdk.Authority) error {
	return nil
}
func (webhookAuthorizer) ValidateKnowledgeLibraryMember(context.Context, string, knowledgesdk.Authority) error {
	return nil
}
func (webhookAuthorizer) ValidateKnowledgeLibraryOrganizationMember(context.Context, string, knowledgesdk.Authority) error {
	return nil
}

type webhookResolver struct {
	authority knowledgesdk.Authority
	err       error
	actions   []string
}

func (resolver *webhookResolver) ResolveKnowledgeTrustedApplication(_ context.Context, _ string, action string) (knowledgesdk.Authority, error) {
	resolver.actions = append(resolver.actions, action)
	return resolver.authority, resolver.err
}

type webhookDeliverer struct {
	requests []knowledgesdk.KnowledgeWebhookDeliveryRequest
	result   knowledgesdk.KnowledgeWebhookDeliveryResult
	err      error
}

func (deliverer *webhookDeliverer) DeliverKnowledgeWebhook(_ context.Context, request knowledgesdk.KnowledgeWebhookDeliveryRequest) (knowledgesdk.KnowledgeWebhookDeliveryResult, error) {
	deliverer.requests = append(deliverer.requests, request)
	return deliverer.result, deliverer.err
}

func webhookWorkerFixture() (*Service, *webhookWorkerRepository, *webhookResolver, *webhookDeliverer) {
	authority := knowledgesdk.Authority{Known: true, RuntimeID: "runtime-1", WorkspaceID: "workspace-1", UserID: "service-user"}
	eventID := knowledgesdk.StableKnowledgeEventID("worker-event")
	repository := &webhookWorkerRepository{
		claimed:    true,
		library:    knowledgesdk.KnowledgeLibrary{ID: "library-1", Role: "reader"},
		pageAccess: knowledgesdk.KnowledgePageEffectiveAccess{Allowed: true, Role: "reader"},
		work: knowledgesdk.KnowledgeWebhookWork{
			ScopeKey: "scope-1", Event: knowledgesdk.KnowledgeWebhookEvent{ID: eventID, Type: knowledgesdk.KnowledgeWebhookPagePublished, Action: knowledgesdk.ActionPagesGet, WorkspaceID: authority.WorkspaceID, LibraryID: "library-1", PageID: "page-1"},
			Subscription: knowledgesdk.KnowledgeWebhookSubscription{ID: "subscription-1", ApplicationKey: "trusted.app", EndpointURL: "https://hooks.example.org/knowledge"},
			Delivery:     knowledgesdk.KnowledgeWebhookDelivery{EventID: eventID, SubscriptionID: "subscription-1", State: knowledgesdk.KnowledgeWebhookDeliveryDelivering, Attempt: 1}, Fence: 1,
		},
	}
	resolver := &webhookResolver{authority: authority}
	deliverer := &webhookDeliverer{result: knowledgesdk.KnowledgeWebhookDeliveryResult{Delivered: true, StatusCode: 204}}
	service := NewService(repository, authority.RuntimeID, contract.Options{LibraryAuthorizer: webhookAuthorizer{}, TrustedApplicationResolver: resolver, WebhookDeliverer: deliverer}, nil)
	return service, repository, resolver, deliverer
}

func TestKnowledgeWebhookWorkerReauthorizesBeforeEveryDelivery(t *testing.T) {
	service, repository, resolver, deliverer := webhookWorkerFixture()
	result, err := service.KnowledgeWebhookWorkerTick(t.Context())
	if err != nil || !result.Worked || result.ProcessedCount != 1 {
		t.Fatalf("worker tick failed: %+v err=%v", result, err)
	}
	if len(resolver.actions) != 1 || resolver.actions[0] != knowledgesdk.ActionPagesGet || len(deliverer.requests) != 1 {
		t.Fatalf("delivery was not reauthorized: actions=%v requests=%+v", resolver.actions, deliverer.requests)
	}
	if deliverer.requests[0].IdempotencyKey != repository.work.Event.ID || len(repository.completed) != 1 || !repository.completed[0].Delivered {
		t.Fatalf("delivery idempotency/result invalid: requests=%+v completed=%+v", deliverer.requests, repository.completed)
	}
}

func TestKnowledgeWebhookWorkerRevokesDeliveryWhenApplicationAuthorizationIsRemoved(t *testing.T) {
	service, repository, resolver, deliverer := webhookWorkerFixture()
	resolver.err = &knowledgesdk.Error{Class: knowledgesdk.ErrorClassForbidden, Code: "knowledge.trusted_application_denied"}
	result, err := service.KnowledgeWebhookWorkerTick(t.Context())
	if err != nil || !result.Worked || len(deliverer.requests) != 0 || len(repository.completed) != 1 || repository.completed[0].ErrorCode != "authorization_revoked" || !repository.completed[0].RetryAt.IsZero() {
		t.Fatalf("revoked authorization was not terminal: result=%+v deliveries=%+v completed=%+v err=%v", result, deliverer.requests, repository.completed, err)
	}
}

func TestKnowledgeWebhookWorkerRetriesTransientResolverFailure(t *testing.T) {
	service, repository, resolver, deliverer := webhookWorkerFixture()
	resolver.err = errors.New("identity temporarily unavailable")
	_, err := service.KnowledgeWebhookWorkerTick(t.Context())
	if err != nil || len(deliverer.requests) != 0 || len(repository.completed) != 1 || repository.completed[0].ErrorCode != "authorization_unavailable" || repository.completed[0].RetryAt.IsZero() {
		t.Fatalf("transient resolver failure was not retried: completed=%+v err=%v", repository.completed, err)
	}
}
