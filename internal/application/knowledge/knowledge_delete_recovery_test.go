package application

import (
	"context"
	"errors"
	"testing"
	"time"

	agentsdk "github.com/domainry/domainry-agent-sdk"
)

type deletionRecoveryProbe struct {
	agentsdk.KnowledgeDocumentSource
	calls    int
	id       string
	a        agentsdk.ConversationAuthority
	err      error
	deadline time.Time
}

func (p *deletionRecoveryProbe) RecoverKnowledgeDocumentDelete(ctx context.Context, id string, a agentsdk.ConversationAuthority) error {
	p.calls++
	p.id = id
	p.a = a
	p.deadline, _ = ctx.Deadline()
	return p.err
}

func TestKnowledgeDeleteRecoveryNeedsExplicitSourceAndUsableLease(t *testing.T) {
	a := agentsdk.ConversationAuthority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "owner"}
	// An old source cannot be promoted to retryable by its ordinary Delete method.
	var unsupported struct {
		agentsdk.KnowledgeDocumentSource
	}
	if RecoverKnowledgeDocumentDelete(t.Context(), unsupported, "frozen", a, time.Now().Add(time.Minute)) {
		t.Fatal("unsupported source confirmed")
	}
	probe := &deletionRecoveryProbe{}
	ctx, cancel := context.WithCancel(t.Context())
	cancel()
	if RecoverKnowledgeDocumentDelete(ctx, probe, "frozen", a, time.Now().Add(time.Minute)) || probe.calls != 0 {
		t.Fatal("cancelled attempt dispatched")
	}
	if RecoverKnowledgeDocumentDelete(t.Context(), probe, "frozen", a, time.Now().Add(time.Second)) || probe.calls != 0 {
		t.Fatal("expired lease dispatched")
	}
	leaseUntil := time.Now().Add(time.Minute)
	if !RecoverKnowledgeDocumentDelete(t.Context(), probe, "frozen", a, leaseUntil) || probe.calls != 1 || probe.id != "frozen" || probe.a != a || probe.deadline.After(leaseUntil.Add(-5*time.Second)) {
		t.Fatal("source identity or lease changed")
	}
	probe.err = errors.New("still uncertain")
	if RecoverKnowledgeDocumentDelete(t.Context(), probe, "frozen", a, leaseUntil) || probe.calls != 2 {
		t.Fatal("source error turned into acknowledgement")
	}
}
