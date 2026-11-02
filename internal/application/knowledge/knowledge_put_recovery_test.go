package application

import (
	"bytes"
	"context"
	"errors"
	"testing"
	"time"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
)

type putRecoveryProbe struct {
	agentsdk.KnowledgeDocumentSource
	calls    int
	input    agentsdk.KnowledgeDocumentIndexContent
	a        agentsdk.Authority
	err      error
	deadline time.Time
}

func (p *putRecoveryProbe) RecoverKnowledgeDocumentPut(ctx context.Context, input agentsdk.KnowledgeDocumentIndexContent, a agentsdk.Authority) error {
	p.calls++
	p.input = input
	p.a = a
	p.deadline, _ = ctx.Deadline()
	return p.err
}

func TestKnowledgePutRecoveryNeedsExplicitSourceAndPreservesImmutableCommand(t *testing.T) {
	a := agentsdk.Authority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "owner"}
	raw := []byte("immutable")
	input := agentsdk.KnowledgeDocumentIndexContent{DocumentID: "remote", Filename: "page.md", Bytes: int64(len(raw)), SHA256: "sha256", Content: bytes.NewReader(raw), RequestID: "request", AccessPolicySHA256: "policy", PermissionIDs: []string{"page:read"}}
	var unsupported struct {
		agentsdk.KnowledgeDocumentSource
	}
	if RecoverKnowledgeDocumentPut(t.Context(), unsupported, input, a, time.Now().Add(time.Minute)) {
		t.Fatal("unsupported source confirmed")
	}
	probe := &putRecoveryProbe{}
	ctx, cancel := context.WithCancel(t.Context())
	cancel()
	if RecoverKnowledgeDocumentPut(ctx, probe, input, a, time.Now().Add(time.Minute)) || probe.calls != 0 {
		t.Fatal("cancelled recovery dispatched")
	}
	leaseUntil := time.Now().Add(time.Minute)
	input.Content = bytes.NewReader(raw)
	if !RecoverKnowledgeDocumentPut(t.Context(), probe, input, a, leaseUntil) || probe.calls != 1 || probe.input.DocumentID != input.DocumentID || probe.input.RequestID != input.RequestID || probe.input.SHA256 != input.SHA256 || !probe.a.Equal(a) || probe.deadline.After(leaseUntil.Add(-5*time.Second)) {
		t.Fatal("recovery changed command identity or lease")
	}
	probe.err = errors.New("still uncertain")
	input.Content = bytes.NewReader(raw)
	if RecoverKnowledgeDocumentPut(t.Context(), probe, input, a, leaseUntil) || probe.calls != 2 {
		t.Fatal("source error turned into acknowledgement")
	}
}
