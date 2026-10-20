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

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
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

// GrantBridge turns process-local Knowledge authorization callbacks into
// bounded request/reply challenges for the remote module client.
type GrantBridge struct{}

func (GrantBridge) AuthorizeKnowledgeLibrary(ctx context.Context, operation string, item agentsdk.KnowledgeLibrary, authority agentsdk.Authority) error {
	return challengeFor(ctx, "authorize.library", struct {
		Operation string                    `json:"operation"`
		Item      agentsdk.KnowledgeLibrary `json:"item"`
		Authority agentsdk.Authority        `json:"authority"`
	}{operation, item, authority}, nil)
}
func (GrantBridge) ValidateKnowledgeLibraryMember(ctx context.Context, user string, authority agentsdk.Authority) error {
	return challengeFor(ctx, "authorize.library_member", struct {
		User      string             `json:"user"`
		Authority agentsdk.Authority `json:"authority"`
	}{user, authority}, nil)
}
func (GrantBridge) AuthorizeKnowledgeDocumentSource(ctx context.Context, source agentsdk.KnowledgeDocumentSourceAccess, authority agentsdk.Authority) error {
	return challengeFor(ctx, "authorize.document_source", struct {
		Source    agentsdk.KnowledgeDocumentSourceAccess `json:"source"`
		Authority agentsdk.Authority                     `json:"authority"`
	}{source, authority}, nil)
}
