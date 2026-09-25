package store

import (
	"encoding/json"
	"fmt"
	"reflect"
	"time"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
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
