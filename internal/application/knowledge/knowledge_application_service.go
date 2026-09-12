package application

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	agentsdk "github.com/domainry/domainry-agent-sdk"
	persistence "github.com/domainry/domainry-agent-sdk/persistence"
	"github.com/domainry/domainry-knowledge/contract"
	"strings"
	"sync"
	"time"
	"unicode/utf8"
)

type ConversationKnowledge = contract.ConversationKnowledge
type SourcePolicy = contract.SourcePolicy
type Options = contract.Options
type Service struct {
	repo                                              any
	options                                           Options
	runtimeID, owner                                  string
	attachmentWake, attachmentIndexWake, documentWake chan struct{}
	wg                                                sync.WaitGroup
	cancel                                            context.CancelFunc
	start                                             sync.Once
}

func NewService(repo any, runtimeID string, options Options) *Service {
	var b [16]byte
	if _, err := rand.Read(b[:]); err != nil {
		panic(err)
	}
	if options.DocumentPoll == 0 {
		options.DocumentPoll = 2 * time.Second
	}
	if options.ArtifactExportTTL == 0 {
		options.ArtifactExportTTL = time.Hour
	}
	return &Service{repo: repo, runtimeID: runtimeID, owner: hex.EncodeToString(b[:]), options: options, attachmentWake: make(chan struct{}, 1), attachmentIndexWake: make(chan struct{}, 1), documentWake: make(chan struct{}, 1)}
}
func (s *Service) Start(parent context.Context) {
	s.start.Do(func() {
		ctx, cancel := context.WithCancel(parent)
		s.cancel = cancel
		if s.options.DocumentStorage != nil {
			s.wg.Add(1)
			go s.KnowledgeDocumentWorker(ctx, s.repo.(persistence.KnowledgeDocumentRepository))
		}
		if s.options.AttachmentStorage != nil {
			s.wg.Add(1)
			go s.CleanupAttachments(ctx, s.repo.(persistence.ConversationAttachmentRepository))
			if repo, ok := s.repo.(persistence.ConversationAttachmentIndexRepository); ok {
				s.wg.Add(1)
				go s.AttachmentIndexWorker(ctx, repo)
			}
		}
	})
}
func (s *Service) Close() {
	if s.cancel != nil {
		s.cancel()
	}
	s.wg.Wait()
}
func (s *Service) authorize(a agentsdk.ConversationAuthority) error {
	if !a.Known || a.RuntimeID != s.runtimeID || strings.TrimSpace(a.UserID) == "" || strings.TrimSpace(a.WorkspaceID) == "" || len(a.UserID) > 255 || len(a.WorkspaceID) > 255 {
		return conversationFailure("forbidden", "principal_required")
	}
	return nil
}

type conversationSourceAudit struct {
	s        *Service
	a        agentsdk.ConversationAuthority
	consumer string
}

func (s *Service) sourceAudit(a agentsdk.ConversationAuthority, consumer ...string) *conversationSourceAudit {
	c := ""
	if len(consumer) > 0 {
		c = consumer[0]
	}
	return &conversationSourceAudit{s: s, a: a, consumer: c}
}
func (a *conversationSourceAudit) sources(ctx context.Context, sources *agentsdk.ConversationSources) ([]agentsdk.ConversationRunReference, error) {
	if a.s.options.Sources != nil {
		return a.s.options.Sources.CheckSources(ctx, a.a, a.consumer, sources)
	}
	if sources == nil || sources.Version == 1 && len(sources.Runs) == 0 && len(sources.Omitted) == 0 {
		return nil, nil
	}
	return nil, conversationFailure("unavailable", "source_access_unavailable")
}
func (a *conversationSourceAudit) run(ctx context.Context, ref agentsdk.ConversationRunReference) ([]agentsdk.ConversationRunReference, error) {
	if a.s.options.Sources == nil {
		return nil, conversationFailure("unavailable", "source_access_unavailable")
	}
	return a.s.options.Sources.CheckRun(ctx, a.a, a.consumer, ref)
}
func (s *Service) sourceAccessContext(ctx context.Context) (context.Context, context.CancelFunc) {
	return context.WithTimeout(ctx, 20*time.Second)
}
func conversationFailure(class, code string) error {
	return &agentsdk.Error{Class: class, Code: "agent.conversation." + code}
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

func GuardManagedKnowledge(base ConversationKnowledge, source agentsdk.ManagedKnowledgeDocumentSource, repo persistence.KnowledgeSourceRegistry) ConversationKnowledge {
	return &DocumentGuardedKnowledge{base: base, source: source, repo: repo}
}

// ContextReader is optional. Standalone Knowledge hosts need not implement
// Agent's conversation mutation, memory or execution repository interfaces.
type ContextReader interface {
	Get(context.Context, string, agentsdk.ConversationAuthority) (agentsdk.Conversation, error)
	Run(context.Context, string, string, agentsdk.ConversationAuthority) (agentsdk.ConversationRun, error)
}

func (s *Service) contextReader() ContextReader {
	if r, ok := s.repo.(ContextReader); ok {
		return r
	}
	return missingContext{}
}

type missingContext struct{}

func (missingContext) Get(context.Context, string, agentsdk.ConversationAuthority) (agentsdk.Conversation, error) {
	return agentsdk.Conversation{}, conversationFailure("unavailable", "source_access_unavailable")
}
func (missingContext) Run(context.Context, string, string, agentsdk.ConversationAuthority) (agentsdk.ConversationRun, error) {
	return agentsdk.ConversationRun{}, conversationFailure("unavailable", "source_access_unavailable")
}
