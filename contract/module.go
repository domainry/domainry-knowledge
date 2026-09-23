package contract

import (
	"context"
	"encoding/json"
	agentsdk "github.com/domainry/domainry-agent-sdk"
	"time"
)

type ConversationKnowledge interface {
	Search(context.Context, string, agentsdk.ConversationAuthority) (json.RawMessage, error)
}
type SourcePolicy interface {
	CheckSources(context.Context, agentsdk.ConversationAuthority, string, *agentsdk.ConversationSources) ([]agentsdk.ConversationRunReference, error)
	CheckRun(context.Context, agentsdk.ConversationAuthority, string, agentsdk.ConversationRunReference) ([]agentsdk.ConversationRunReference, error)
}
type Options struct {
	DocumentStorage      agentsdk.KnowledgeDocumentStorage
	DocumentPoll         time.Duration
	LibraryKnowledge     []LibraryKnowledgeBinding
	KnowledgeDatasources agentsdk.KnowledgeDatasourceCatalog
	LibraryAuthorizer    agentsdk.KnowledgeLibraryAuthorizer
	AttachmentAuthorizer agentsdk.ConversationAttachmentAuthorizer
	AttachmentKnowledge  []agentsdk.ConversationAttachmentKnowledgeBinding
	ArtifactStorage      agentsdk.ConversationArtifactStorage
	ArtifactExportTTL    time.Duration
	PersonalAuthorizer   agentsdk.ConversationToolAuthorizer
	Knowledge            ConversationKnowledge
	Sources              SourcePolicy
}
type LibraryKnowledgeBinding struct {
	WorkspaceID     string
	LibraryID       string
	Source          agentsdk.ConversationKnowledgeSource
	ManageDocuments bool // Trusted host opt-in; never a client supplied grant.
}

// Factory lets a host connect Knowledge during composition without importing its implementation.
// Prepare wraps managed sources; Activate validates durable source registration.
type Factory interface {
	Validate(any, *Options) error
	Prepare(any, string, Options) (ConversationKnowledge, error)
	Activate(any, string, Options) error
	NewService(any, string, Options) Service
}
