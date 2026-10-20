package application

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/contract"
	persistence "github.com/domainry/domainry-knowledge-sdk/persistence"
	"strings"
	"sync"
	"time"
	"unicode/utf8"
)

type Knowledge = contract.Knowledge
type Options = contract.Options

type Failure struct {
	Stage      string
	Dependency string
	Retryable  bool
}

type FailureRecorder interface {
	RecordFailure(context.Context, string, error, Failure)
}

type Service struct {
	repo                          any
	options                       Options
	failures                      FailureRecorder
	runtimeID, owner              string
	documentWake                  chan struct{}
	workerMu                      sync.Mutex
	nextDocumentUploadExpirySweep time.Time
}

func NewService(repo any, runtimeID string, options Options, failures FailureRecorder) *Service {
	var b [16]byte
	if _, err := rand.Read(b[:]); err != nil {
		panic(err)
	}
	if options.DocumentPoll == 0 {
		options.DocumentPoll = 2 * time.Second
	}
	if options.DocumentWorkTimeout == 0 {
		options.DocumentWorkTimeout = 30 * time.Minute
	}
	if options.DocumentUploadIdleTimeout == 0 {
		options.DocumentUploadIdleTimeout = 24 * time.Hour
	}
	if options.DocumentStorage != nil && options.DocumentSecurity == nil {
		options.DocumentSecurity = builtinDocumentSecurity{}
	}
	return &Service{repo: repo, runtimeID: runtimeID, owner: hex.EncodeToString(b[:]), options: options, failures: failures, documentWake: make(chan struct{}, 1)}
}

// Start and Close are intentionally lifecycle-neutral. The assembly wrapper
// owns goroutines and supervises every tick through Foundation worker.
func (*Service) Start(context.Context) {}
func (*Service) Close()                {}
func (s *Service) authorize(a agentsdk.Authority) error {
	if !a.Known || a.RuntimeID != s.runtimeID || strings.TrimSpace(a.UserID) == "" || strings.TrimSpace(a.WorkspaceID) == "" || len(a.UserID) > 255 || len(a.WorkspaceID) > 255 {
		return conversationFailure("forbidden", "principal_required")
	}
	return nil
}

func conversationFailure(class, code string) error {
	return &agentsdk.Error{Class: class, Code: "knowledge." + code}
}

func conversationText(v string, max int, required bool) bool {
	return utf8.ValidString(v) && !strings.ContainsRune(v, 0) && len(v) <= max && (!required || strings.TrimSpace(v) != "")
}

func conversationKey(v string) bool {
	if len(v) < 1 || len(v) > 96 {
		return false
	}
	for _, r := range v {
		if !(r >= 'a' && r <= 'z' || r >= 'A' && r <= 'Z' || r >= '0' && r <= '9' || r == '_' || r == '-' || r == '.' || r == ':') {
			return false
		}
	}
	return true
}

func conversationDigest(v any) string {
	raw, _ := json.Marshal(v)
	hash := sha256.Sum256(raw)
	return hex.EncodeToString(hash[:])
}

func conversationJSONText(v any) string { raw, _ := json.Marshal(v); return string(raw) }

// This is a byte budget, deliberately not an inaccurate chars/4 token claim.
// It bounds the complete serialized message array; provider token limits remain
// independently Configured with headroom for output and protocol framing.

func GuardManagedKnowledge(base Knowledge, source agentsdk.ManagedKnowledgeDocumentSource, repo persistence.KnowledgeSourceRegistry) Knowledge {
	return &DocumentGuardedKnowledge{base: base, source: source, repo: repo}
}
