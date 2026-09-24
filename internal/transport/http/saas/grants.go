package saas

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"strings"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	knowledgecontract "github.com/domainry/domainry-knowledge-sdk/contract"
)

type grantContextKey struct{}

type grantContext struct {
	operation string
	secret    []byte
	grants    map[string]json.RawMessage
}

type challengeError struct {
	kind  string
	input json.RawMessage
}

func (value *challengeError) Error() string {
	return "Knowledge remote authorization challenge required"
}

func withGrants(ctx context.Context, operation string, secret []byte, values []knowledgecontract.SaaSGrant) context.Context {
	grants := make(map[string]json.RawMessage, len(values))
	for _, value := range values {
		if token := strings.TrimSpace(value.Token); token != "" && len(token) <= 256 {
			grants[token] = value.Result
		}
	}
	return context.WithValue(ctx, grantContextKey{}, grantContext{operation: operation, secret: secret, grants: grants})
}

func challengeFor(ctx context.Context, kind string, input any, output any) error {
	state, ok := ctx.Value(grantContextKey{}).(grantContext)
	if !ok || len(state.secret) < 32 {
		return fmt.Errorf("Knowledge SaaS grant context is unavailable")
	}
	raw, err := json.Marshal(input)
	if err != nil {
		return err
	}
	token := challengeToken(state.secret, state.operation, kind, raw)
	grant, granted := state.grants[token]
	if !granted {
		return &challengeError{kind: kind, input: raw}
	}
	if output == nil {
		return nil
	}
	if len(grant) == 0 || json.Unmarshal(grant, output) != nil {
		return fmt.Errorf("Knowledge SaaS grant result is invalid")
	}
	return nil
}

func challengeToken(secret []byte, operation, kind string, input []byte) string {
	mac := hmac.New(sha256.New, secret)
	_, _ = mac.Write([]byte(operation))
	_, _ = mac.Write([]byte{0})
	_, _ = mac.Write([]byte(kind))
	_, _ = mac.Write([]byte{0})
	_, _ = mac.Write(input)
	return base64.RawURLEncoding.EncodeToString(mac.Sum(nil))
}

func challengeResponse(secret []byte, operation string, err error) *knowledgecontract.SaaSChallenge {
	var challenge *challengeError
	if !errors.As(err, &challenge) {
		return nil
	}
	return &knowledgecontract.SaaSChallenge{Token: challengeToken(secret, operation, challenge.kind, challenge.input), Kind: challenge.kind, Input: challenge.input}
}

// GrantBridge turns process-local Agent callbacks into bounded request/reply
// challenges. The Knowledge process never receives an Agent repository.
type GrantBridge struct{}

func (GrantBridge) AuthorizeConversationAttachment(ctx context.Context, action string, authority agentsdk.ConversationAuthority) error {
	return challengeFor(ctx, "authorize.attachment", struct {
		Action    string                         `json:"action"`
		Authority agentsdk.ConversationAuthority `json:"authority"`
	}{action, authority}, nil)
}
func (GrantBridge) AuthorizeKnowledgeLibrary(ctx context.Context, operation string, item agentsdk.KnowledgeLibrary, authority agentsdk.ConversationAuthority) error {
	return challengeFor(ctx, "authorize.library", struct {
		Operation string                         `json:"operation"`
		Item      agentsdk.KnowledgeLibrary      `json:"item"`
		Authority agentsdk.ConversationAuthority `json:"authority"`
	}{operation, item, authority}, nil)
}
func (GrantBridge) ValidateKnowledgeLibraryMember(ctx context.Context, user string, authority agentsdk.ConversationAuthority) error {
	return challengeFor(ctx, "authorize.library_member", struct {
		User      string                         `json:"user"`
		Authority agentsdk.ConversationAuthority `json:"authority"`
	}{user, authority}, nil)
}
func (GrantBridge) AuthorizeConversationTool(ctx context.Context, input agentsdk.ConversationToolRequest) (agentsdk.ConversationToolAuthorization, error) {
	var output agentsdk.ConversationToolAuthorization
	err := challengeFor(ctx, "authorize.personal", input, &output)
	return output, err
}
func (GrantBridge) CheckSources(ctx context.Context, authority agentsdk.ConversationAuthority, consumer string, sources *agentsdk.ConversationSources) ([]agentsdk.ConversationRunReference, error) {
	var output []agentsdk.ConversationRunReference
	err := challengeFor(ctx, "sources.check", struct {
		Consumer  string                         `json:"consumer"`
		Sources   *agentsdk.ConversationSources  `json:"sources"`
		Authority agentsdk.ConversationAuthority `json:"authority"`
	}{consumer, sources, authority}, &output)
	return output, err
}
func (GrantBridge) CheckRun(ctx context.Context, authority agentsdk.ConversationAuthority, consumer string, ref agentsdk.ConversationRunReference) ([]agentsdk.ConversationRunReference, error) {
	var output []agentsdk.ConversationRunReference
	err := challengeFor(ctx, "sources.run", struct {
		Consumer  string                            `json:"consumer"`
		Ref       agentsdk.ConversationRunReference `json:"ref"`
		Authority agentsdk.ConversationAuthority    `json:"authority"`
	}{consumer, ref, authority}, &output)
	return output, err
}
func (GrantBridge) Conversation(ctx context.Context, id string, authority agentsdk.ConversationAuthority) (agentsdk.Conversation, error) {
	var output agentsdk.Conversation
	err := challengeFor(ctx, "context.conversation", struct {
		ConversationID string                         `json:"conversation_id"`
		Authority      agentsdk.ConversationAuthority `json:"authority"`
	}{id, authority}, &output)
	return output, err
}
func (GrantBridge) Run(ctx context.Context, conversationID, runID string, authority agentsdk.ConversationAuthority) (agentsdk.ConversationRun, error) {
	var output agentsdk.ConversationRun
	err := challengeFor(ctx, "context.run", struct {
		ConversationID string                         `json:"conversation_id"`
		RunID          string                         `json:"run_id"`
		Authority      agentsdk.ConversationAuthority `json:"authority"`
	}{conversationID, runID, authority}, &output)
	return output, err
}
