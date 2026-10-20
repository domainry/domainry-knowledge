package store

import (
	"encoding/json"
	"fmt"
	"reflect"
	"time"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
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

type storedKnowledgePageView struct {
	Page        storedKnowledgePage                    `json:"page"`
	Published   *storedKnowledgePageVersion            `json:"published,omitempty"`
	Draft       *storedKnowledgePageDraft              `json:"draft,omitempty"`
	Breadcrumbs []knowledgesdk.KnowledgePageBreadcrumb `json:"breadcrumbs"`
}

type storedKnowledgePagePage struct {
	Items     []storedKnowledgePage `json:"items"`
	NextAfter string                `json:"next_after,omitempty"`
	Complete  bool                  `json:"complete"`
}

type storedKnowledgePageComment struct {
	knowledgesdk.KnowledgePageComment
	CreatedAt int64 `json:"created_at"`
	UpdatedAt int64 `json:"updated_at"`
}

type storedKnowledgePageAttachment struct {
	knowledgesdk.KnowledgePageAttachment
	CreatedAt int64 `json:"created_at"`
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

type storedPageProjectionJob struct {
	pageProjectionJob
	NotBefore  int64 `json:"not_before"`
	LeaseUntil int64 `json:"lease_until"`
}

type storedKnowledgeDocumentLease struct {
	persistence.KnowledgeDocumentLease
	ExpiresAt int64 `json:"expires_at"`
}

type storedAttachmentIndexLease struct {
	persistence.ConversationAttachmentIndexLease
	ExpiresAt int64 `json:"expires_at"`
}

type storedKnowledgeDatasourceBinding struct {
	persistence.KnowledgeDatasourceBinding
	CreatedAt int64 `json:"created_at"`
}

type storedArtifact struct {
	agentsdk.ConversationArtifact
	CreatedAt int64 `json:"created_at"`
	UpdatedAt int64 `json:"updated_at"`
}

type storedArtifactRecord struct {
	persistence.ConversationArtifactRecord
	Artifact storedArtifact `json:"artifact"`
}

type storedArtifactExport struct {
	agentsdk.ConversationArtifactExport
	CreatedAt        int64  `json:"created_at"`
	ExpiresAt        int64  `json:"expires_at"`
	LastDownloadedAt *int64 `json:"last_downloaded_at,omitempty"`
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
	out := storedKnowledgePageView{Page: storedPage(value.Page), Breadcrumbs: append([]knowledgesdk.KnowledgePageBreadcrumb(nil), value.Breadcrumbs...)}
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

func storedPageComment(value knowledgesdk.KnowledgePageComment) storedKnowledgePageComment {
	return storedKnowledgePageComment{KnowledgePageComment: value, CreatedAt: durableMillis(value.CreatedAt), UpdatedAt: durableMillis(value.UpdatedAt)}
}

func storedPageAttachment(value knowledgesdk.KnowledgePageAttachment) storedKnowledgePageAttachment {
	return storedKnowledgePageAttachment{KnowledgePageAttachment: value, CreatedAt: durableMillis(value.CreatedAt)}
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

func storedArtifactValue(value agentsdk.ConversationArtifact) storedArtifact {
	return storedArtifact{ConversationArtifact: value, CreatedAt: durableMillis(value.CreatedAt), UpdatedAt: durableMillis(value.UpdatedAt)}
}

func storedExport(value agentsdk.ConversationArtifactExport) storedArtifactExport {
	out := storedArtifactExport{ConversationArtifactExport: value, CreatedAt: durableMillis(value.CreatedAt), ExpiresAt: durableMillis(value.ExpiresAt)}
	if value.LastDownloadedAt != nil {
		last := durableMillis(*value.LastDownloadedAt)
		out.LastDownloadedAt = &last
	}
	return out
}

// marshalDurableJSON has no timestamp-name inference and never opens a
// json.RawMessage. Unregistered types containing time.Time fail closed.
func marshalDurableJSON(value any) ([]byte, error) {
	switch item := value.(type) {
	case agentsdk.KnowledgeLibrary:
		return json.Marshal(storedLibrary(item))
	case agentsdk.KnowledgeLibraryMember:
		return json.Marshal(storedMember(item))
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
	case knowledgesdk.KnowledgePageComment:
		return json.Marshal(storedPageComment(item))
	case knowledgesdk.KnowledgePageAttachment:
		return json.Marshal(storedPageAttachment(item))
	case knowledgesdk.KnowledgePageAccessGrant:
		return json.Marshal(storedPageAccessGrant(item))
	case knowledgesdk.KnowledgePageAccessPolicy:
		return json.Marshal(storedPageAccessPolicy(item))
	case pageProjectionJob:
		return json.Marshal(storedPageProjectionJob{pageProjectionJob: item, NotBefore: durableMillis(item.NotBefore), LeaseUntil: durableMillis(item.LeaseUntil)})
	case persistence.KnowledgeDocumentLease:
		return json.Marshal(storedKnowledgeDocumentLease{KnowledgeDocumentLease: item, ExpiresAt: durableMillis(item.ExpiresAt)})
	case persistence.ConversationAttachmentIndexLease:
		return json.Marshal(storedAttachmentIndexLease{ConversationAttachmentIndexLease: item, ExpiresAt: durableMillis(item.ExpiresAt)})
	case persistence.KnowledgeDatasourceBinding:
		return json.Marshal(storedKnowledgeDatasourceBinding{KnowledgeDatasourceBinding: item, CreatedAt: durableMillis(item.CreatedAt)})
	case agentsdk.ConversationArtifact:
		return json.Marshal(storedArtifactValue(item))
	case persistence.ConversationArtifactRecord:
		return json.Marshal(storedArtifactRecord{ConversationArtifactRecord: item, Artifact: storedArtifactValue(item.Artifact)})
	case agentsdk.ConversationArtifactExport:
		return json.Marshal(storedExport(item))
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
	case *knowledgesdk.KnowledgePageComment:
		var stored storedKnowledgePageComment
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.KnowledgePageComment
		out.CreatedAt, out.UpdatedAt = durableTime(stored.CreatedAt), durableTime(stored.UpdatedAt)
	case *knowledgesdk.KnowledgePageAttachment:
		var stored storedKnowledgePageAttachment
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.KnowledgePageAttachment
		out.CreatedAt = durableTime(stored.CreatedAt)
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
	case *persistence.ConversationAttachmentIndexLease:
		var stored storedAttachmentIndexLease
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.ConversationAttachmentIndexLease
		out.ExpiresAt = durableTime(stored.ExpiresAt)
	case *persistence.KnowledgeDatasourceBinding:
		var stored storedKnowledgeDatasourceBinding
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.KnowledgeDatasourceBinding
		out.CreatedAt = durableTime(stored.CreatedAt)
	case *agentsdk.ConversationArtifact:
		var stored storedArtifact
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.ConversationArtifact
		out.CreatedAt, out.UpdatedAt = durableTime(stored.CreatedAt), durableTime(stored.UpdatedAt)
	case *persistence.ConversationArtifactRecord:
		var stored storedArtifactRecord
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.ConversationArtifactRecord
		out.Artifact = stored.Artifact.ConversationArtifact
		out.Artifact.CreatedAt, out.Artifact.UpdatedAt = durableTime(stored.Artifact.CreatedAt), durableTime(stored.Artifact.UpdatedAt)
	case *agentsdk.ConversationArtifactExport:
		var stored storedArtifactExport
		if err := json.Unmarshal(raw, &stored); err != nil {
			return err
		}
		*out = stored.ConversationArtifactExport
		out.CreatedAt, out.ExpiresAt = durableTime(stored.CreatedAt), durableTime(stored.ExpiresAt)
		if stored.LastDownloadedAt != nil {
			last := durableTime(*stored.LastDownloadedAt)
			out.LastDownloadedAt = &last
		}
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
