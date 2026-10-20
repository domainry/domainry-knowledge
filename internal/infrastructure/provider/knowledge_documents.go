package provider

import (
	"context"
	"crypto/sha256"
	"fmt"
	"path"
	"regexp"
	"slices"
	"strings"
	"unicode/utf8"

	connector "github.com/domainry/domainry-connector-sdk"
	"github.com/domainry/domainry-connector-sdk/providers/knowledge_base/http_api"
	agentsdk "github.com/domainry/domainry-knowledge-sdk"
)

func (k *Knowledge) PutKnowledgeDocument(ctx context.Context, in agentsdk.KnowledgeDocumentIndexContent, a agentsdk.Authority) error {
	if !k.config.DocumentManagement {
		return knowledgeFailure("document_management_unavailable")
	}
	if in.AccessPolicySHA256 != k.KnowledgeDocumentAccessPolicySHA256() {
		return knowledgeFailure("document_access_policy_changed")
	}
	if len(in.PermissionIDs) > 1 {
		return knowledgeFailure("request_invalid")
	}
	for _, permissionID := range in.PermissionIDs {
		if permissionID == "" || len(permissionID) > 128 || strings.TrimSpace(permissionID) != permissionID {
			return knowledgeFailure("request_invalid")
		}
	}
	filename, err := knowledgeUploadFilename(in.Filename)
	if err != nil {
		return err
	}
	maximum := httpapi.MaximumInlineDocumentBytesForFilename(filename)
	if in.Content == nil || in.Bytes < 1 || maximum < 1 || in.Bytes > maximum || !connector.ValidSHA256(in.SHA256) {
		return knowledgeFailure("request_invalid")
	}
	base := knowledgeGateway{knowledge: k, authority: a}
	if len(in.PermissionIDs) != 0 {
		base.permissionIDs, base.overridePermissions = slices.Clone(in.PermissionIDs), true
	}
	_, err = connector.CallWithContent(ctx, knowledgeDocumentWriteGateway{base, in.RequestID}, httpapi.PutDocument, httpapi.PutDocumentInput{DocID: in.DocumentID, Filename: filename, Bytes: in.Bytes, SHA256: in.SHA256}, in.Content, in.Bytes, in.SHA256, "application/octet-stream")
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
// Knowledge storage; send a stable transport name with the original parser suffix.
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

func (k *Knowledge) KnowledgeDocumentIndexMaximumBytes() int64 {
	return httpapi.MaximumInlineDocumentBytes
}

func (k *Knowledge) KnowledgeDocumentFormats() []agentsdk.KnowledgeDocumentFormat {
	capabilities := httpapi.DocumentFormatCapabilities()
	formats := make([]agentsdk.KnowledgeDocumentFormat, 0, len(capabilities))
	for _, capability := range capabilities {
		formats = append(formats, agentsdk.KnowledgeDocumentFormat{
			Extension: capability.Extension, ContentType: capability.ContentType, ParserRoute: capability.ParserRoute,
			BuilderMaxBytes: capability.BuilderWholeFileMaximumBytes, AssetMaxBytes: capability.AssetMaximumBytes,
			EnrichmentMaxBytes: capability.EnrichmentMaxBytes, AnalysisOutputMaxBytes: capability.AnalysisMaxBytes,
		})
	}
	return formats
}

func (k *Knowledge) InspectKnowledgeDocument(ctx context.Context, id string, a agentsdk.Authority) (agentsdk.KnowledgeDocumentState, error) {
	out, err := connector.Call(ctx, knowledgeGateway{knowledge: k, authority: a}, httpapi.DocumentStatus, httpapi.DocumentInput{DocID: id})
	if err != nil {
		return agentsdk.KnowledgeDocumentState{}, knowledgeConnectorError(err)
	}
	if out.DocID != id || out.Provider != httpapi.ProviderKey || out.KBID != k.config.KBID {
		return agentsdk.KnowledgeDocumentState{}, knowledgeFailure("response_invalid")
	}
	return agentsdk.KnowledgeDocumentState{DocumentID: id, Exists: out.Exists, IndexStatus: out.IndexStatus}, nil
}

func (k *Knowledge) DeleteKnowledgeDocument(ctx context.Context, id string, a agentsdk.Authority) error {
	if !k.config.DocumentManagement {
		return knowledgeFailure("document_management_unavailable")
	}
	_, err := connector.Call(ctx, knowledgeGateway{knowledge: k, authority: a}, httpapi.DeleteDocument, httpapi.DocumentInput{DocID: id})
	if err != nil {
		return knowledgeConnectorError(err)
	}
	return nil
}

func (k *Knowledge) RecoverKnowledgeDocumentDelete(ctx context.Context, id string, a agentsdk.Authority) error {
	if httpapi.DeleteDocument.Reliability.Idempotency.Strategy != connector.IdempotencyNatural {
		return knowledgeFailure("delete_recovery_unavailable")
	}
	// The official Connector promises same-document DELETE idempotency. Its
	// transport still performs exactly one attempt; the durable host owns retry.
	return k.DeleteKnowledgeDocument(ctx, id, a)
}

var _ agentsdk.KnowledgeDocumentSource = (*Knowledge)(nil)
var _ agentsdk.KnowledgeDocumentDeleteRecoverySource = (*Knowledge)(nil)
