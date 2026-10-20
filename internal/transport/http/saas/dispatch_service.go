package saas

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"slices"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

type sourceDescriptor struct {
	Handle                string                                 `json:"handle"`
	Identity              string                                 `json:"identity"`
	DocumentPermissionIDs []string                               `json:"document_permission_ids,omitempty"`
	ReadPermissionIDs     []string                               `json:"read_permission_ids,omitempty"`
	AccessPolicySHA256    string                                 `json:"access_policy_sha256,omitempty"`
	IndexMaxBytes         int64                                  `json:"index_max_bytes,omitempty"`
	DocumentFormats       []knowledgesdk.KnowledgeDocumentFormat `json:"document_formats,omitempty"`
	Ready                 bool                                   `json:"ready"`
}

func (server *Server) registerSource(source knowledgesdk.ManagedKnowledgeDocumentSource, documentPermissions, readPermissions []string) sourceDescriptor {
	identity := source.KnowledgeDocumentSourceIdentity()
	sum := sha256.Sum256([]byte(identity))
	handle := hex.EncodeToString(sum[:])
	descriptor := sourceDescriptor{Handle: handle, Identity: identity, DocumentPermissionIDs: slices.Clone(documentPermissions), ReadPermissionIDs: slices.Clone(readPermissions), Ready: source.KnowledgeDocumentManagementReady() == nil}
	if value, ok := source.(knowledgesdk.KnowledgeDocumentAccessPolicySource); ok {
		descriptor.AccessPolicySHA256 = value.KnowledgeDocumentAccessPolicySHA256()
	}
	if value, ok := source.(knowledgesdk.KnowledgeDocumentIndexLimitSource); ok {
		descriptor.IndexMaxBytes = value.KnowledgeDocumentIndexMaximumBytes()
	}
	if value, ok := source.(knowledgesdk.KnowledgeDocumentFormatSource); ok {
		descriptor.DocumentFormats = append([]knowledgesdk.KnowledgeDocumentFormat(nil), value.KnowledgeDocumentFormats()...)
	}
	server.sourcesMu.Lock()
	server.sources[handle] = source
	server.sourcesMu.Unlock()
	return descriptor
}

func (server *Server) dispatchExtended(ctx context.Context, operation string, raw json.RawMessage) (any, error) {
	if value, err, handled := server.dispatchPageService(ctx, operation, raw); handled {
		return value, err
	}
	if value, err, handled := server.dispatchKnowledgeService(ctx, operation, raw); handled {
		return value, err
	}
	if value, err, handled := server.dispatchSource(ctx, operation, raw); handled {
		return value, err
	}
	return nil, &knowledgesdk.Error{Class: "not_found", Code: "knowledge.operation_not_found"}
}
