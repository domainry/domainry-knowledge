package provider

import (
	"context"
	"crypto/sha256"
	"fmt"
	"path"
	"regexp"
	"strings"
	"unicode/utf8"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	connector "github.com/domainry/domainry-connector-sdk"
	"github.com/domainry/domainry-connectors/providers/knowledge_base/http_api"
)

func (k *Knowledge) PutKnowledgeDocument(ctx context.Context, in agentsdk.KnowledgeDocumentContent, a agentsdk.ConversationAuthority) error {
	if !k.config.DocumentManagement {
		return knowledgeFailure("document_management_unavailable")
	}
	if in.AccessPolicySHA256 != k.KnowledgeDocumentAccessPolicySHA256() {
		return knowledgeFailure("document_access_policy_changed")
	}
	filename, err := knowledgeUploadFilename(in.Filename)
	if err != nil {
		return err
	}
	_, err = connector.Call(ctx, knowledgeDocumentWriteGateway{knowledgeGateway{k, a}, in.RequestID}, httpapi.PutDocument, httpapi.PutDocumentInput{DocID: in.DocumentID, Filename: filename, Content: in.Data})
	if err != nil {
		return knowledgeConnectorError(err)
	}
	return nil
}

type knowledgeDocumentWriteGateway struct {
	base      knowledgeGateway
	requestID string
}

func (g knowledgeDocumentWriteGateway) Call(ctx context.Context, r connector.CallRequest) (connector.CallResult, error) {
	r.RequestRef = g.requestID
	return g.base.Call(ctx, r)
}

var knowledgeWireFilename = regexp.MustCompile(`^[A-Za-z0-9][A-Za-z0-9 ._-]{0,254}$`)
var knowledgeWireExtension = regexp.MustCompile(`^\.[a-z0-9]{1,16}$`)

// Upstream only accepts ASCII filenames. Keep the user's original name in
// Agent storage; send a stable transport name with the original parser suffix.
func knowledgeUploadFilename(name string) (string, error) {
	if knowledgeWireFilename.MatchString(name) && strings.TrimSpace(name) == name {
		return name, nil
	}
	ext := strings.ToLower(path.Ext(name))
	if len(name) == 0 || len(name) > 255 || strings.TrimSpace(name) != name || !utf8.ValidString(name) || strings.ContainsAny(name, "/\\") || strings.ContainsFunc(name, func(r rune) bool { return r < 0x20 || r == 0x7f }) || !knowledgeWireExtension.MatchString(ext) {
		return "", knowledgeFailure("request_invalid")
	}
	h := sha256.Sum256([]byte(name))
	return fmt.Sprintf("document-%x%s", h[:16], ext), nil
}

func (k *Knowledge) KnowledgeDocumentMaxBytes() int64 { return httpapi.MaxDocumentBytes }

func (k *Knowledge) InspectKnowledgeDocument(ctx context.Context, id string, a agentsdk.ConversationAuthority) (agentsdk.KnowledgeDocumentState, error) {
	out, err := connector.Call(ctx, knowledgeGateway{k, a}, httpapi.DocumentStatus, httpapi.DocumentInput{DocID: id})
	if err != nil {
		return agentsdk.KnowledgeDocumentState{}, knowledgeConnectorError(err)
	}
	if out.DocID != id || out.Provider != httpapi.ProviderKey || out.KBID != k.config.KBID {
		return agentsdk.KnowledgeDocumentState{}, knowledgeFailure("response_invalid")
	}
	return agentsdk.KnowledgeDocumentState{DocumentID: id, Exists: out.Exists, IndexStatus: out.IndexStatus}, nil
}

func (k *Knowledge) DeleteKnowledgeDocument(ctx context.Context, id string, a agentsdk.ConversationAuthority) error {
	if !k.config.DocumentManagement {
		return knowledgeFailure("document_management_unavailable")
	}
	_, err := connector.Call(ctx, knowledgeGateway{k, a}, httpapi.DeleteDocument, httpapi.DocumentInput{DocID: id})
	if err != nil {
		return knowledgeConnectorError(err)
	}
	return nil
}

func (k *Knowledge) RecoverKnowledgeDocumentDelete(ctx context.Context, id string, a agentsdk.ConversationAuthority) error {
	if httpapi.DeleteDocument.Reliability.Idempotency.Strategy != connector.IdempotencyNatural {
		return knowledgeFailure("delete_recovery_unavailable")
	}
	// The official Connector promises same-document DELETE idempotency. Its
	// transport still performs exactly one attempt; the durable host owns retry.
	return k.DeleteKnowledgeDocument(ctx, id, a)
}

var _ agentsdk.KnowledgeDocumentSource = (*Knowledge)(nil)
var _ agentsdk.KnowledgeDocumentDeleteRecoverySource = (*Knowledge)(nil)
