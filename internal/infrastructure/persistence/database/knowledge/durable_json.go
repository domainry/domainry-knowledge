package store

import (
	"encoding/json"
	"fmt"
	"reflect"
	"time"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
)

// These are persistence shapes, not HTTP projections. Each owned instant is
// already a UTC Unix-millisecond number before JSON serialization begins.
type storedKnowledgeLibrary struct {
	agentsdk.KnowledgeLibrary
	CreatedAt int64 `json:"created_at"`
	UpdatedAt int64 `json:"updated_at"`
}

type storedKnowledgeLibraryMember struct {
	agentsdk.KnowledgeLibraryMember
	UpdatedAt int64 `json:"updated_at"`
}

type storedKnowledgeLibraryOrganizationMember struct {
	agentsdk.KnowledgeLibraryOrganizationMember
	UpdatedAt int64 `json:"updated_at"`
}

type storedKnowledgeDocument struct {
	agentsdk.KnowledgeDocument
	CreatedAt int64 `json:"created_at"`
	UpdatedAt int64 `json:"updated_at"`
}

type storedKnowledgeDocumentRecord struct {
	persistence.KnowledgeDocumentRecord
	Document storedKnowledgeDocument `json:"document"`
}

type storedKnowledgePage struct {
	knowledgesdk.KnowledgePage
	CreatedAt int64 `json:"created_at"`
	UpdatedAt int64 `json:"updated_at"`
}

type storedKnowledgePageDraft struct {
	knowledgesdk.KnowledgePageDraft
	UpdatedAt int64 `json:"updated_at"`
}

type storedKnowledgePageVersion struct {
	knowledgesdk.KnowledgePageVersion
	PublishedAt int64 `json:"published_at"`
}

type storedKnowledgePageContentGovernance struct {
	Classification string `json:"classification"`
	WatermarkText  string `json:"watermark_text,omitempty"`
	WatermarkAt    int64  `json:"watermark_at,omitempty"`
}

type storedKnowledgePageView struct {
	Page        storedKnowledgePage                    `json:"page"`
	Published   *storedKnowledgePageVersion            `json:"published,omitempty"`
	Draft       *storedKnowledgePageDraft              `json:"draft,omitempty"`
	Breadcrumbs []knowledgesdk.KnowledgePageBreadcrumb `json:"breadcrumbs"`
	GridAccess  *knowledgesdk.KnowledgeGridAccess      `json:"grid_access,omitempty"`
	Governance  storedKnowledgePageContentGovernance   `json:"governance"`
}

type storedKnowledgePagePage struct {
	Items     []storedKnowledgePage `json:"items"`
	NextAfter string                `json:"next_after,omitempty"`
	Complete  bool                  `json:"complete"`
}

type storedKnowledgePageReferenceCreateResult struct {
	Parent storedKnowledgePageView `json:"parent"`
	Target storedKnowledgePageView `json:"target"`
}

type storedKnowledgePageComment struct {
	knowledgesdk.KnowledgePageComment
	CreatedAt int64 `json:"created_at"`
	UpdatedAt int64 `json:"updated_at"`
}

type storedKnowledgePageEditHistoryEntry struct {
	knowledgesdk.KnowledgePageEditHistoryEntry
	CreatedAt int64 `json:"created_at"`
}

type storedKnowledgePageSuggestion struct {
	knowledgesdk.KnowledgePageSuggestion
	CreatedAt int64 `json:"created_at"`
	UpdatedAt int64 `json:"updated_at"`
}

type storedKnowledgePageNativeOperationRecord struct {
	knowledgesdk.KnowledgePageNativeOperationRecord
	CreatedAt int64 `json:"created_at"`
}

type storedKnowledgePageNativeOperationResult struct {
	View       storedKnowledgePageView                    `json:"view"`
	Operations []storedKnowledgePageNativeOperationRecord `json:"operations"`
}

type storedKnowledgeGridAutomationResult struct {
	View         storedKnowledgePageView `json:"view"`
	AutomationID string                  `json:"automation_id"`
	RecordID     string                  `json:"record_id"`
	FieldID      string                  `json:"field_id"`
	Applied      bool                    `json:"applied"`
}

type storedKnowledgePageAttachment struct {
	knowledgesdk.KnowledgePageAttachment
	CreatedAt int64 `json:"created_at"`
}

type storedKnowledgePageTask struct {
	knowledgesdk.KnowledgePageTask
	DueAt      int64 `json:"due_at,omitempty"`
	ReminderAt int64 `json:"reminder_at,omitempty"`
	CreatedAt  int64 `json:"created_at"`
	UpdatedAt  int64 `json:"updated_at"`
}

type storedKnowledgePagePoll struct {
	knowledgesdk.KnowledgePagePoll
	CreatedAt int64 `json:"created_at"`
	UpdatedAt int64 `json:"updated_at"`
}

type storedKnowledgePagePollView struct {
	knowledgesdk.KnowledgePagePollView
	Poll storedKnowledgePagePoll `json:"poll"`
}

type storedKnowledgeFormSubmission struct {
	knowledgesdk.KnowledgeFormSubmission
	SubmittedAt int64 `json:"submitted_at"`
}

type storedKnowledgePageTemplate struct {
	knowledgesdk.KnowledgePageTemplate
	CreatedAt int64 `json:"created_at"`
	UpdatedAt int64 `json:"updated_at"`
}

type storedKnowledgePageTemplateVersion struct {
	knowledgesdk.KnowledgePageTemplateVersion
	CreatedAt int64 `json:"created_at"`
}

type storedKnowledgePageTemplateInstance struct {
	TemplateID     string                  `json:"template_id"`
	Version        int64                   `json:"version"`
	Root           storedKnowledgePageView `json:"root"`
	CreatedPageIDs []string                `json:"created_page_ids"`
}

type storedKnowledgePageAccessGrant struct {
	knowledgesdk.KnowledgePageAccessGrant
	CreatedAt int64 `json:"created_at"`
}

type storedKnowledgePageAccessPolicy struct {
	knowledgesdk.KnowledgePageAccessPolicy
	UpdatedAt int64                            `json:"updated_at"`
	Grants    []storedKnowledgePageAccessGrant `json:"grants"`
}

type storedKnowledgePageContentPolicy struct {
	knowledgesdk.KnowledgePageContentPolicy
	UpdatedAt int64 `json:"updated_at"`
}

type storedKnowledgePageShare struct {
	knowledgesdk.KnowledgePageShare
	ExpiresAt int64 `json:"expires_at"`
	CreatedAt int64 `json:"created_at"`
	UpdatedAt int64 `json:"updated_at"`
}

type storedKnowledgePagePersonalState struct {
	knowledgesdk.KnowledgePagePersonalState
	FavoriteAt   int64 `json:"favorite_at"`
	SubscribedAt int64 `json:"subscribed_at"`
	LastViewedAt int64 `json:"last_viewed_at"`
	LastEditedAt int64 `json:"last_edited_at"`
	UpdatedAt    int64 `json:"updated_at"`
}

type storedKnowledgePageMetadata struct {
	knowledgesdk.KnowledgePageMetadata
	NextReviewAt   int64 `json:"next_review_at"`
	LastReviewedAt int64 `json:"last_reviewed_at"`
	ArchivedAt     int64 `json:"archived_at"`
	RetainUntil    int64 `json:"retain_until"`
	UpdatedAt      int64 `json:"updated_at"`
}

type storedKnowledgeWebhookSubscription struct {
	knowledgesdk.KnowledgeWebhookSubscription
	CreatedAt int64 `json:"created_at"`
	UpdatedAt int64 `json:"updated_at"`
}

type storedKnowledgeWebhookEvent struct {
	knowledgesdk.KnowledgeWebhookEvent
	OccurredAt int64 `json:"occurred_at"`
}

type storedKnowledgeWebhookDelivery struct {
	knowledgesdk.KnowledgeWebhookDelivery
	NextAttemptAt int64 `json:"next_attempt_at"`
	UpdatedAt     int64 `json:"updated_at"`
}

type storedKnowledgeAIExecution struct {
	knowledgesdk.KnowledgeAIExecution
	CreatedAt   int64 `json:"created_at"`
	UpdatedAt   int64 `json:"updated_at"`
	ConfirmedAt int64 `json:"confirmed_at,omitempty"`
}

type storedPageProjectionJob struct {
	pageProjectionJob
	NotBefore  int64 `json:"not_before"`
	LeaseUntil int64 `json:"lease_until"`
}

type storedKnowledgeDocumentLease struct {
	persistence.KnowledgeDocumentLease
	ExpiresAt int64 `json:"expires_at"`
}

type storedKnowledgeDatasourceBinding struct {
	persistence.KnowledgeDatasourceBinding
	CreatedAt int64 `json:"created_at"`
}

func durableMillis(value time.Time) int64 {
	if value.IsZero() {
		return 0
	}
	return value.UTC().UnixMilli()
}

func durableTime(value int64) time.Time {
	if value == 0 {
		return time.Time{}
	}
	return time.UnixMilli(value).UTC()
}

func storedLibrary(value agentsdk.KnowledgeLibrary) storedKnowledgeLibrary {
	return storedKnowledgeLibrary{KnowledgeLibrary: value, CreatedAt: durableMillis(value.CreatedAt), UpdatedAt: durableMillis(value.UpdatedAt)}
}

func storedMember(value agentsdk.KnowledgeLibraryMember) storedKnowledgeLibraryMember {
	return storedKnowledgeLibraryMember{KnowledgeLibraryMember: value, UpdatedAt: durableMillis(value.UpdatedAt)}
}

func storedOrganizationMember(value agentsdk.KnowledgeLibraryOrganizationMember) storedKnowledgeLibraryOrganizationMember {
	return storedKnowledgeLibraryOrganizationMember{KnowledgeLibraryOrganizationMember: value, UpdatedAt: durableMillis(value.UpdatedAt)}
}

func storedDocument(value agentsdk.KnowledgeDocument) storedKnowledgeDocument {
	return storedKnowledgeDocument{KnowledgeDocument: value, CreatedAt: durableMillis(value.CreatedAt), UpdatedAt: durableMillis(value.UpdatedAt)}
}

func storedPage(value knowledgesdk.KnowledgePage) storedKnowledgePage {
	return storedKnowledgePage{KnowledgePage: value, CreatedAt: durableMillis(value.CreatedAt), UpdatedAt: durableMillis(value.UpdatedAt)}
}

func storedPageDraft(value knowledgesdk.KnowledgePageDraft) storedKnowledgePageDraft {
	return storedKnowledgePageDraft{KnowledgePageDraft: value, UpdatedAt: durableMillis(value.UpdatedAt)}
}

func storedPageVersion(value knowledgesdk.KnowledgePageVersion) storedKnowledgePageVersion {
	return storedKnowledgePageVersion{KnowledgePageVersion: value, PublishedAt: durableMillis(value.PublishedAt)}
}

func storedPageView(value knowledgesdk.KnowledgePageView) storedKnowledgePageView {
	governance := storedKnowledgePageContentGovernance{Classification: value.Governance.Classification}
	if value.Governance.DynamicWatermark != nil {
		governance.WatermarkText = value.Governance.DynamicWatermark.Text
		governance.WatermarkAt = durableMillis(value.Governance.DynamicWatermark.GeneratedAt)
	}
	out := storedKnowledgePageView{Page: storedPage(value.Page), Breadcrumbs: append([]knowledgesdk.KnowledgePageBreadcrumb(nil), value.Breadcrumbs...), GridAccess: value.GridAccess, Governance: governance}
	if value.Published != nil {
		published := storedPageVersion(*value.Published)
		out.Published = &published
	}
	if value.Draft != nil {
		draft := storedPageDraft(*value.Draft)
		out.Draft = &draft
	}
	return out
}

func storedPagePage(value knowledgesdk.KnowledgePagePage) storedKnowledgePagePage {
	out := storedKnowledgePagePage{NextAfter: value.NextAfter, Complete: value.Complete, Items: make([]storedKnowledgePage, 0, len(value.Items))}
	for _, page := range value.Items {
		out.Items = append(out.Items, storedPage(page))
	}
	return out
}

func storedPageReferenceCreateResult(value knowledgesdk.KnowledgePageReferenceCreateResult) storedKnowledgePageReferenceCreateResult {
	return storedKnowledgePageReferenceCreateResult{Parent: storedPageView(value.Parent), Target: storedPageView(value.Target)}
}

func storedPageComment(value knowledgesdk.KnowledgePageComment) storedKnowledgePageComment {
	return storedKnowledgePageComment{KnowledgePageComment: value, CreatedAt: durableMillis(value.CreatedAt), UpdatedAt: durableMillis(value.UpdatedAt)}
}

func storedPageEditHistoryEntry(value knowledgesdk.KnowledgePageEditHistoryEntry) storedKnowledgePageEditHistoryEntry {
	return storedKnowledgePageEditHistoryEntry{KnowledgePageEditHistoryEntry: value, CreatedAt: durableMillis(value.CreatedAt)}
}

func storedPageSuggestion(value knowledgesdk.KnowledgePageSuggestion) storedKnowledgePageSuggestion {
	return storedKnowledgePageSuggestion{KnowledgePageSuggestion: value, CreatedAt: durableMillis(value.CreatedAt), UpdatedAt: durableMillis(value.UpdatedAt)}
}

func storedPageNativeOperationRecord(value knowledgesdk.KnowledgePageNativeOperationRecord) storedKnowledgePageNativeOperationRecord {
	return storedKnowledgePageNativeOperationRecord{KnowledgePageNativeOperationRecord: value, CreatedAt: durableMillis(value.CreatedAt)}
}

func storedPageNativeOperationResult(value knowledgesdk.KnowledgePageNativeOperationResult) storedKnowledgePageNativeOperationResult {
	out := storedKnowledgePageNativeOperationResult{View: storedPageView(value.View), Operations: make([]storedKnowledgePageNativeOperationRecord, 0, len(value.Operations))}
	for _, operation := range value.Operations {
		out.Operations = append(out.Operations, storedPageNativeOperationRecord(operation))
	}
	return out
}

func storedGridAutomationResult(value knowledgesdk.KnowledgeGridAutomationResult) storedKnowledgeGridAutomationResult {
	return storedKnowledgeGridAutomationResult{
		View: storedPageView(value.View), AutomationID: value.AutomationID, RecordID: value.RecordID, FieldID: value.FieldID, Applied: value.Applied,
	}
}

func storedPageAttachment(value knowledgesdk.KnowledgePageAttachment) storedKnowledgePageAttachment {
	return storedKnowledgePageAttachment{KnowledgePageAttachment: value, CreatedAt: durableMillis(value.CreatedAt)}
}

func storedPageTask(value knowledgesdk.KnowledgePageTask) storedKnowledgePageTask {
	out := storedKnowledgePageTask{KnowledgePageTask: value, CreatedAt: durableMillis(value.CreatedAt), UpdatedAt: durableMillis(value.UpdatedAt)}
	if value.DueAt != nil {
		out.DueAt = durableMillis(*value.DueAt)
	}
	if value.ReminderAt != nil {
		out.ReminderAt = durableMillis(*value.ReminderAt)
	}
	return out
}

func storedPagePoll(value knowledgesdk.KnowledgePagePoll) storedKnowledgePagePoll {
	return storedKnowledgePagePoll{KnowledgePagePoll: value, CreatedAt: durableMillis(value.CreatedAt), UpdatedAt: durableMillis(value.UpdatedAt)}
}

func storedPagePollView(value knowledgesdk.KnowledgePagePollView) storedKnowledgePagePollView {
	return storedKnowledgePagePollView{KnowledgePagePollView: value, Poll: storedPagePoll(value.Poll)}
}

func storedFormSubmission(value knowledgesdk.KnowledgeFormSubmission) storedKnowledgeFormSubmission {
	return storedKnowledgeFormSubmission{KnowledgeFormSubmission: value, SubmittedAt: durableMillis(value.SubmittedAt)}
}

func storedPageTemplate(value knowledgesdk.KnowledgePageTemplate) storedKnowledgePageTemplate {
	return storedKnowledgePageTemplate{KnowledgePageTemplate: value, CreatedAt: durableMillis(value.CreatedAt), UpdatedAt: durableMillis(value.UpdatedAt)}
}

func storedPageTemplateVersion(value knowledgesdk.KnowledgePageTemplateVersion) storedKnowledgePageTemplateVersion {
	return storedKnowledgePageTemplateVersion{KnowledgePageTemplateVersion: value, CreatedAt: durableMillis(value.CreatedAt)}
}

func storedPageTemplateInstance(value knowledgesdk.KnowledgePageTemplateInstance) storedKnowledgePageTemplateInstance {
	return storedKnowledgePageTemplateInstance{TemplateID: value.TemplateID, Version: value.Version, Root: storedPageView(value.Root), CreatedPageIDs: append([]string(nil), value.CreatedPageIDs...)}
}

func storedPageAccessGrant(value knowledgesdk.KnowledgePageAccessGrant) storedKnowledgePageAccessGrant {
	return storedKnowledgePageAccessGrant{KnowledgePageAccessGrant: value, CreatedAt: durableMillis(value.CreatedAt)}
}

func storedPageAccessPolicy(value knowledgesdk.KnowledgePageAccessPolicy) storedKnowledgePageAccessPolicy {
	out := storedKnowledgePageAccessPolicy{KnowledgePageAccessPolicy: value, UpdatedAt: durableMillis(value.UpdatedAt), Grants: make([]storedKnowledgePageAccessGrant, 0, len(value.Grants))}
	for _, grant := range value.Grants {
		out.Grants = append(out.Grants, storedPageAccessGrant(grant))
	}
	return out
}

func storedPageContentPolicy(value knowledgesdk.KnowledgePageContentPolicy) storedKnowledgePageContentPolicy {
	return storedKnowledgePageContentPolicy{KnowledgePageContentPolicy: value, UpdatedAt: durableMillis(value.UpdatedAt)}
}

func storedPageShare(value knowledgesdk.KnowledgePageShare) storedKnowledgePageShare {
	return storedKnowledgePageShare{KnowledgePageShare: value, ExpiresAt: durableMillis(value.ExpiresAt), CreatedAt: durableMillis(value.CreatedAt), UpdatedAt: durableMillis(value.UpdatedAt)}
}

func storedPagePersonalState(value knowledgesdk.KnowledgePagePersonalState) storedKnowledgePagePersonalState {
	return storedKnowledgePagePersonalState{
		KnowledgePagePersonalState: value,
		FavoriteAt:                 durableMillis(value.FavoriteAt),
		SubscribedAt:               durableMillis(value.SubscribedAt),
		LastViewedAt:               durableMillis(value.LastViewedAt),
		LastEditedAt:               durableMillis(value.LastEditedAt),
		UpdatedAt:                  durableMillis(value.UpdatedAt),
	}
}

func storedPageMetadata(value knowledgesdk.KnowledgePageMetadata) storedKnowledgePageMetadata {
	var nextReviewAt, lastReviewedAt, archivedAt, retainUntil, updatedAt int64
	if value.NextReviewAt != nil {
		nextReviewAt = durableMillis(*value.NextReviewAt)
	}
	if value.LastReviewedAt != nil {
		lastReviewedAt = durableMillis(*value.LastReviewedAt)
	}
	if value.ArchivedAt != nil {
		archivedAt = durableMillis(*value.ArchivedAt)
	}
	if value.RetainUntil != nil {
		retainUntil = durableMillis(*value.RetainUntil)
	}
	if value.UpdatedAt != nil {
		updatedAt = durableMillis(*value.UpdatedAt)
	}
	return storedKnowledgePageMetadata{KnowledgePageMetadata: value, NextReviewAt: nextReviewAt, LastReviewedAt: lastReviewedAt, ArchivedAt: archivedAt, RetainUntil: retainUntil, UpdatedAt: updatedAt}
}

func storedWebhookSubscription(value knowledgesdk.KnowledgeWebhookSubscription) storedKnowledgeWebhookSubscription {
	return storedKnowledgeWebhookSubscription{KnowledgeWebhookSubscription: value, CreatedAt: durableMillis(value.CreatedAt), UpdatedAt: durableMillis(value.UpdatedAt)}
}

func storedWebhookEvent(value knowledgesdk.KnowledgeWebhookEvent) storedKnowledgeWebhookEvent {
	return storedKnowledgeWebhookEvent{KnowledgeWebhookEvent: value, OccurredAt: durableMillis(value.OccurredAt)}
}

func storedWebhookDelivery(value knowledgesdk.KnowledgeWebhookDelivery) storedKnowledgeWebhookDelivery {
	return storedKnowledgeWebhookDelivery{KnowledgeWebhookDelivery: value, NextAttemptAt: durableMillis(value.NextAttemptAt), UpdatedAt: durableMillis(value.UpdatedAt)}
}

func storedAIExecution(value knowledgesdk.KnowledgeAIExecution) storedKnowledgeAIExecution {
	return storedKnowledgeAIExecution{KnowledgeAIExecution: value, CreatedAt: durableMillis(value.CreatedAt), UpdatedAt: durableMillis(value.UpdatedAt), ConfirmedAt: durableMillis(value.ConfirmedAt)}
}

// marshalDurableJSON has no timestamp-name inference and never opens a
// json.RawMessage. Unregistered types containing time.Time fail closed.
func marshalDurableJSON(value any) ([]byte, error) {
	switch item := value.(type) {
	case agentsdk.KnowledgeLibrary:
		return json.Marshal(storedLibrary(item))
	case agentsdk.KnowledgeLibraryMember:
		return json.Marshal(storedMember(item))
	case agentsdk.KnowledgeLibraryOrganizationMember:
		return json.Marshal(storedOrganizationMember(item))
	case agentsdk.KnowledgeDocument:
		return json.Marshal(storedDocument(item))
	case persistence.KnowledgeDocumentRecord:
		return json.Marshal(storedKnowledgeDocumentRecord{KnowledgeDocumentRecord: item, Document: storedDocument(item.Document)})
	case *persistence.KnowledgeDocumentRecord:
		if item == nil {
			return json.Marshal(nil)
		}
		return marshalDurableJSON(*item)
	case knowledgesdk.KnowledgePage:
		return json.Marshal(storedPage(item))
	case knowledgesdk.KnowledgePageDraft:
		return json.Marshal(storedPageDraft(item))
	case knowledgesdk.KnowledgePageVersion:
		return json.Marshal(storedPageVersion(item))
	case knowledgesdk.KnowledgePageView:
		return json.Marshal(storedPageView(item))
	case knowledgesdk.KnowledgePagePage:
		return json.Marshal(storedPagePage(item))
	case knowledgesdk.KnowledgePageReferenceCreateResult:
		return json.Marshal(storedPageReferenceCreateResult(item))
	case knowledgesdk.KnowledgePagePersonalState:
		return json.Marshal(storedPagePersonalState(item))
	case knowledgesdk.KnowledgePageMetadata:
		return json.Marshal(storedPageMetadata(item))
	case knowledgesdk.KnowledgePageComment:
		return json.Marshal(storedPageComment(item))
	case knowledgesdk.KnowledgePageEditHistoryEntry:
		return json.Marshal(storedPageEditHistoryEntry(item))
	case knowledgesdk.KnowledgePageSuggestion:
		return json.Marshal(storedPageSuggestion(item))
	case knowledgesdk.KnowledgePageNativeOperationRecord:
		return json.Marshal(storedPageNativeOperationRecord(item))
	case knowledgesdk.KnowledgePageNativeOperationResult:
		return json.Marshal(storedPageNativeOperationResult(item))
	case knowledgesdk.KnowledgeGridAutomationResult:
		return json.Marshal(storedGridAutomationResult(item))
	case knowledgesdk.KnowledgePageAttachment:
		return json.Marshal(storedPageAttachment(item))
	case knowledgesdk.KnowledgePageTask:
		return json.Marshal(storedPageTask(item))
	case knowledgesdk.KnowledgePagePoll:
		return json.Marshal(storedPagePoll(item))
	case knowledgesdk.KnowledgePagePollView:
		return json.Marshal(storedPagePollView(item))
	case knowledgesdk.KnowledgeFormSubmission:
		return json.Marshal(storedFormSubmission(item))
	case knowledgesdk.KnowledgePageTemplate:
		return json.Marshal(storedPageTemplate(item))
	case knowledgesdk.KnowledgePageTemplateVersion:
		return json.Marshal(storedPageTemplateVersion(item))
	case knowledgesdk.KnowledgePageTemplateInstance:
		return json.Marshal(storedPageTemplateInstance(item))
	case knowledgesdk.KnowledgePageAccessGrant:
		return json.Marshal(storedPageAccessGrant(item))
	case knowledgesdk.KnowledgePageAccessPolicy:
		return json.Marshal(storedPageAccessPolicy(item))
	case knowledgesdk.KnowledgePageContentPolicy:
		return json.Marshal(storedPageContentPolicy(item))
	case knowledgesdk.KnowledgePageShare:
		return json.Marshal(storedPageShare(item))
	case knowledgesdk.KnowledgeWebhookSubscription:
		return json.Marshal(storedWebhookSubscription(item))
	case knowledgesdk.KnowledgeWebhookEvent:
		return json.Marshal(storedWebhookEvent(item))
	case knowledgesdk.KnowledgeWebhookDelivery:
		return json.Marshal(storedWebhookDelivery(item))
	case knowledgesdk.KnowledgeAIExecution:
		return json.Marshal(storedAIExecution(item))
	case pageProjectionJob:
		return json.Marshal(storedPageProjectionJob{pageProjectionJob: item, NotBefore: durableMillis(item.NotBefore), LeaseUntil: durableMillis(item.LeaseUntil)})
	case persistence.KnowledgeDocumentLease:
		return json.Marshal(storedKnowledgeDocumentLease{KnowledgeDocumentLease: item, ExpiresAt: durableMillis(item.ExpiresAt)})
	case persistence.KnowledgeDatasourceBinding:
		return json.Marshal(storedKnowledgeDatasourceBinding{KnowledgeDatasourceBinding: item, CreatedAt: durableMillis(item.CreatedAt)})
	default:
		if containsUnregisteredTime(reflect.ValueOf(value), map[uintptr]bool{}) {
			return nil, fmt.Errorf("durable JSON type %T has unregistered time fields", value)
		}
		return json.Marshal(value)
	}
}

// unmarshalDurableJSON reconstructs typed instants from the numeric storage
// DTOs. It does not format a user-facing date or inspect opaque content.
func unmarshalDurableJSON(raw []byte, destination any) error {
	switch out := destination.(type) {
	case *agentsdk.KnowledgeLibrary:
		var stored storedKnowledgeLibrary
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.KnowledgeLibrary
		out.CreatedAt, out.UpdatedAt = durableTime(stored.CreatedAt), durableTime(stored.UpdatedAt)
	case *agentsdk.KnowledgeLibraryMember:
		var stored storedKnowledgeLibraryMember
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.KnowledgeLibraryMember
		out.UpdatedAt = durableTime(stored.UpdatedAt)
	case *agentsdk.KnowledgeLibraryOrganizationMember:
		var stored storedKnowledgeLibraryOrganizationMember
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.KnowledgeLibraryOrganizationMember
		out.UpdatedAt = durableTime(stored.UpdatedAt)
	case *persistence.KnowledgeDocumentRecord:
		var stored storedKnowledgeDocumentRecord
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.KnowledgeDocumentRecord
		out.Document = stored.Document.KnowledgeDocument
		out.Document.CreatedAt, out.Document.UpdatedAt = durableTime(stored.Document.CreatedAt), durableTime(stored.Document.UpdatedAt)
	case *knowledgesdk.KnowledgePage:
		var stored storedKnowledgePage
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.KnowledgePage
		out.CreatedAt, out.UpdatedAt = durableTime(stored.CreatedAt), durableTime(stored.UpdatedAt)
	case *knowledgesdk.KnowledgePageDraft:
		var stored storedKnowledgePageDraft
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.KnowledgePageDraft
		out.UpdatedAt = durableTime(stored.UpdatedAt)
	case *knowledgesdk.KnowledgePageVersion:
		var stored storedKnowledgePageVersion
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.KnowledgePageVersion
		out.PublishedAt = durableTime(stored.PublishedAt)
	case *knowledgesdk.KnowledgePageView:
		var stored storedKnowledgePageView
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		out.Page = stored.Page.KnowledgePage
		out.Page.CreatedAt, out.Page.UpdatedAt = durableTime(stored.Page.CreatedAt), durableTime(stored.Page.UpdatedAt)
		out.Published = nil
		if stored.Published != nil {
			published := stored.Published.KnowledgePageVersion
			published.PublishedAt = durableTime(stored.Published.PublishedAt)
			out.Published = &published
		}
		out.Draft = nil
		if stored.Draft != nil {
			draft := stored.Draft.KnowledgePageDraft
			draft.UpdatedAt = durableTime(stored.Draft.UpdatedAt)
			out.Draft = &draft
		}
		out.Breadcrumbs = append([]knowledgesdk.KnowledgePageBreadcrumb(nil), stored.Breadcrumbs...)
		out.GridAccess = stored.GridAccess
		out.Governance = knowledgesdk.KnowledgePageContentGovernance{Classification: stored.Governance.Classification}
		if stored.Governance.WatermarkText != "" {
			out.Governance.DynamicWatermark = &knowledgesdk.KnowledgePageDynamicWatermark{Text: stored.Governance.WatermarkText, GeneratedAt: durableTime(stored.Governance.WatermarkAt)}
		}
	case *knowledgesdk.KnowledgePagePage:
		var stored storedKnowledgePagePage
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		out.Items = make([]knowledgesdk.KnowledgePage, 0, len(stored.Items))
		for _, page := range stored.Items {
			value := page.KnowledgePage
			value.CreatedAt, value.UpdatedAt = durableTime(page.CreatedAt), durableTime(page.UpdatedAt)
			out.Items = append(out.Items, value)
		}
		out.NextAfter, out.Complete = stored.NextAfter, stored.Complete
	case *knowledgesdk.KnowledgePageReferenceCreateResult:
		var stored storedKnowledgePageReferenceCreateResult
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		parentRaw, err := json.Marshal(stored.Parent)
		if err != nil {
			return err
		}
		if err = unmarshalDurableJSON(parentRaw, &out.Parent); err != nil {
			return err
		}
		targetRaw, err := json.Marshal(stored.Target)
		if err != nil {
			return err
		}
		if err = unmarshalDurableJSON(targetRaw, &out.Target); err != nil {
			return err
		}
	case *knowledgesdk.KnowledgePageComment:
		var stored storedKnowledgePageComment
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.KnowledgePageComment
		out.CreatedAt, out.UpdatedAt = durableTime(stored.CreatedAt), durableTime(stored.UpdatedAt)
	case *knowledgesdk.KnowledgePagePersonalState:
		var stored storedKnowledgePagePersonalState
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.KnowledgePagePersonalState
		out.FavoriteAt, out.SubscribedAt = durableTime(stored.FavoriteAt), durableTime(stored.SubscribedAt)
		out.LastViewedAt, out.LastEditedAt, out.UpdatedAt = durableTime(stored.LastViewedAt), durableTime(stored.LastEditedAt), durableTime(stored.UpdatedAt)
	case *knowledgesdk.KnowledgePageMetadata:
		var stored storedKnowledgePageMetadata
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.KnowledgePageMetadata
		if stored.NextReviewAt > 0 {
			value := durableTime(stored.NextReviewAt)
			out.NextReviewAt = &value
		} else {
			out.NextReviewAt = nil
		}
		if stored.LastReviewedAt > 0 {
			value := durableTime(stored.LastReviewedAt)
			out.LastReviewedAt = &value
		} else {
			out.LastReviewedAt = nil
		}
		if stored.ArchivedAt > 0 {
			value := durableTime(stored.ArchivedAt)
			out.ArchivedAt = &value
		} else {
			out.ArchivedAt = nil
		}
		if stored.RetainUntil > 0 {
			value := durableTime(stored.RetainUntil)
			out.RetainUntil = &value
		} else {
			out.RetainUntil = nil
		}
		if stored.UpdatedAt > 0 {
			value := durableTime(stored.UpdatedAt)
			out.UpdatedAt = &value
		} else {
			out.UpdatedAt = nil
		}
	case *knowledgesdk.KnowledgeWebhookSubscription:
		var stored storedKnowledgeWebhookSubscription
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.KnowledgeWebhookSubscription
		out.CreatedAt, out.UpdatedAt = durableTime(stored.CreatedAt), durableTime(stored.UpdatedAt)
	case *knowledgesdk.KnowledgeWebhookEvent:
		var stored storedKnowledgeWebhookEvent
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.KnowledgeWebhookEvent
		out.OccurredAt = durableTime(stored.OccurredAt)
	case *knowledgesdk.KnowledgeWebhookDelivery:
		var stored storedKnowledgeWebhookDelivery
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.KnowledgeWebhookDelivery
		out.NextAttemptAt, out.UpdatedAt = durableTime(stored.NextAttemptAt), durableTime(stored.UpdatedAt)
	case *knowledgesdk.KnowledgeAIExecution:
		var stored storedKnowledgeAIExecution
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.KnowledgeAIExecution
		out.CreatedAt, out.UpdatedAt, out.ConfirmedAt = durableTime(stored.CreatedAt), durableTime(stored.UpdatedAt), durableTime(stored.ConfirmedAt)
	case *knowledgesdk.KnowledgePageEditHistoryEntry:
		var stored storedKnowledgePageEditHistoryEntry
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.KnowledgePageEditHistoryEntry
		out.CreatedAt = durableTime(stored.CreatedAt)
	case *knowledgesdk.KnowledgePageSuggestion:
		var stored storedKnowledgePageSuggestion
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.KnowledgePageSuggestion
		out.CreatedAt, out.UpdatedAt = durableTime(stored.CreatedAt), durableTime(stored.UpdatedAt)
	case *knowledgesdk.KnowledgePageNativeOperationRecord:
		var stored storedKnowledgePageNativeOperationRecord
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.KnowledgePageNativeOperationRecord
		out.CreatedAt = durableTime(stored.CreatedAt)
	case *knowledgesdk.KnowledgePageNativeOperationResult:
		var stored storedKnowledgePageNativeOperationResult
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		viewRaw, err := json.Marshal(stored.View)
		if err != nil {
			return err
		}
		if err = unmarshalDurableJSON(viewRaw, &out.View); err != nil {
			return err
		}
		out.Operations = make([]knowledgesdk.KnowledgePageNativeOperationRecord, 0, len(stored.Operations))
		for _, operation := range stored.Operations {
			value := operation.KnowledgePageNativeOperationRecord
			value.CreatedAt = durableTime(operation.CreatedAt)
			out.Operations = append(out.Operations, value)
		}
	case *knowledgesdk.KnowledgeGridAutomationResult:
		var stored storedKnowledgeGridAutomationResult
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		viewRaw, err := json.Marshal(stored.View)
		if err != nil {
			return err
		}
		if err = unmarshalDurableJSON(viewRaw, &out.View); err != nil {
			return err
		}
		out.AutomationID, out.RecordID, out.FieldID, out.Applied = stored.AutomationID, stored.RecordID, stored.FieldID, stored.Applied
	case *knowledgesdk.KnowledgePageAttachment:
		var stored storedKnowledgePageAttachment
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.KnowledgePageAttachment
		out.CreatedAt = durableTime(stored.CreatedAt)
	case *knowledgesdk.KnowledgePageTask:
		var stored storedKnowledgePageTask
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.KnowledgePageTask
		out.DueAt, out.ReminderAt = nil, nil
		if stored.DueAt != 0 {
			value := durableTime(stored.DueAt)
			out.DueAt = &value
		}
		if stored.ReminderAt != 0 {
			value := durableTime(stored.ReminderAt)
			out.ReminderAt = &value
		}
		out.CreatedAt, out.UpdatedAt = durableTime(stored.CreatedAt), durableTime(stored.UpdatedAt)
	case *knowledgesdk.KnowledgePagePoll:
		var stored storedKnowledgePagePoll
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.KnowledgePagePoll
		out.CreatedAt, out.UpdatedAt = durableTime(stored.CreatedAt), durableTime(stored.UpdatedAt)
	case *knowledgesdk.KnowledgePagePollView:
		var stored storedKnowledgePagePollView
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.KnowledgePagePollView
		out.Poll = stored.Poll.KnowledgePagePoll
		out.Poll.CreatedAt, out.Poll.UpdatedAt = durableTime(stored.Poll.CreatedAt), durableTime(stored.Poll.UpdatedAt)
	case *knowledgesdk.KnowledgeFormSubmission:
		var stored storedKnowledgeFormSubmission
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.KnowledgeFormSubmission
		out.SubmittedAt = durableTime(stored.SubmittedAt)
	case *knowledgesdk.KnowledgePageTemplate:
		var stored storedKnowledgePageTemplate
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.KnowledgePageTemplate
		out.CreatedAt, out.UpdatedAt = durableTime(stored.CreatedAt), durableTime(stored.UpdatedAt)
	case *knowledgesdk.KnowledgePageTemplateVersion:
		var stored storedKnowledgePageTemplateVersion
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.KnowledgePageTemplateVersion
		out.CreatedAt = durableTime(stored.CreatedAt)
	case *knowledgesdk.KnowledgePageTemplateInstance:
		var stored storedKnowledgePageTemplateInstance
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		out.TemplateID, out.Version = stored.TemplateID, stored.Version
		out.CreatedPageIDs = append([]string(nil), stored.CreatedPageIDs...)
		rootRaw, err := json.Marshal(stored.Root)
		if err != nil {
			return err
		}
		if err = unmarshalDurableJSON(rootRaw, &out.Root); err != nil {
			return err
		}
	case *knowledgesdk.KnowledgePageAccessGrant:
		var stored storedKnowledgePageAccessGrant
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.KnowledgePageAccessGrant
		out.CreatedAt = durableTime(stored.CreatedAt)
	case *knowledgesdk.KnowledgePageAccessPolicy:
		var stored storedKnowledgePageAccessPolicy
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.KnowledgePageAccessPolicy
		out.UpdatedAt = durableTime(stored.UpdatedAt)
		out.Grants = make([]knowledgesdk.KnowledgePageAccessGrant, 0, len(stored.Grants))
		for _, grant := range stored.Grants {
			value := grant.KnowledgePageAccessGrant
			value.CreatedAt = durableTime(grant.CreatedAt)
			out.Grants = append(out.Grants, value)
		}
	case *knowledgesdk.KnowledgePageContentPolicy:
		var stored storedKnowledgePageContentPolicy
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.KnowledgePageContentPolicy
		out.UpdatedAt = durableTime(stored.UpdatedAt)
	case *knowledgesdk.KnowledgePageShare:
		var stored storedKnowledgePageShare
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.KnowledgePageShare
		out.ExpiresAt, out.CreatedAt, out.UpdatedAt = durableTime(stored.ExpiresAt), durableTime(stored.CreatedAt), durableTime(stored.UpdatedAt)
	case *pageProjectionJob:
		var stored storedPageProjectionJob
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.pageProjectionJob
		out.NotBefore, out.LeaseUntil = durableTime(stored.NotBefore), durableTime(stored.LeaseUntil)
	case *persistence.KnowledgeDocumentLease:
		var stored storedKnowledgeDocumentLease
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.KnowledgeDocumentLease
		out.ExpiresAt = durableTime(stored.ExpiresAt)
	case *persistence.KnowledgeDatasourceBinding:
		var stored storedKnowledgeDatasourceBinding
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.KnowledgeDatasourceBinding
		out.CreatedAt = durableTime(stored.CreatedAt)
	default:
		return json.Unmarshal(raw, destination)
	}
	return nil
}

func containsUnregisteredTime(value reflect.Value, seen map[uintptr]bool) bool {
	for value.IsValid() && (value.Kind() == reflect.Interface || value.Kind() == reflect.Pointer) {
		if value.IsNil() {
			return false
		}
		if value.Kind() == reflect.Pointer {
			address := value.Pointer()
			if seen[address] {
				return false
			}
			seen[address] = true
		}
		value = value.Elem()
	}
	if !value.IsValid() || value.Type() == reflect.TypeOf(json.RawMessage{}) {
		return false
	}
	if value.Type() == reflect.TypeOf(time.Time{}) {
		return true
	}
	if value.Type().Implements(reflect.TypeOf((*json.Marshaler)(nil)).Elem()) {
		return false
	}
	switch value.Kind() {
	case reflect.Struct:
		for i := 0; i < value.NumField(); i++ {
			if value.Type().Field(i).PkgPath == "" && containsUnregisteredTime(value.Field(i), seen) {
				return true
			}
		}
	case reflect.Slice, reflect.Array:
		for i := 0; i < value.Len(); i++ {
			if containsUnregisteredTime(value.Index(i), seen) {
				return true
			}
		}
	case reflect.Map:
		iter := value.MapRange()
		for iter.Next() {
			if containsUnregisteredTime(iter.Value(), seen) {
				return true
			}
		}
	}
	return false
}
