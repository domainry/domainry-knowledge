package store

import (
	"context"
	"sync"

	sharedoperation "github.com/domainry/domainry-foundation/operation"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/modulehost"
	embedprovider "github.com/domainry/domainry-knowledge/internal/infrastructure/embedprovider"
	ormdriver "github.com/domainry/domainry-orm/driver"
)

type Backend interface {
	Database() modulehost.Database
	Renderer() modulehost.Dialect
	Profile() ormdriver.Profile
	IsTransientError(error) bool
}

type DB = modulehost.DB
type conversationDB = DB

type Store struct {
	store                Backend
	operations           *sharedoperation.SQLStore
	collaboration        *knowledgeCollaborationNotifier
	collaborationMetrics knowledgeCollaborationMetrics
	embedProviders       *knowledgesdk.EmbedProviderRegistry
}

type knowledgePageRepositoryContract interface {
	knowledgesdk.KnowledgePageRepository
	knowledgesdk.CommentService
	knowledgesdk.PageAttachmentService
}

var _ knowledgePageRepositoryContract = (*Store)(nil)

func New(backend Backend) *Store {
	var operations *sharedoperation.SQLStore
	if backend != nil {
		operations = sharedoperation.NewSQLStore(backend.Database(), sharedoperation.AdaptDialect(backend.Renderer()))
	}
	embeds, err := knowledgesdk.NewEmbedProviderRegistry(embedprovider.Defaults()...)
	if err != nil {
		panic(err)
	}
	return &Store{
		store: backend, operations: operations, collaboration: newKnowledgeCollaborationNotifier(),
		collaborationMetrics: newKnowledgeCollaborationMetrics(), embedProviders: embeds,
	}
}

func (s *Store) SetKnowledgeEmbedProviders(providers []knowledgesdk.EmbedProvider) error {
	if len(providers) == 0 {
		providers = embedprovider.Defaults()
	}
	registry, err := knowledgesdk.NewEmbedProviderRegistry(providers...)
	if err != nil {
		return err
	}
	s.embedProviders = registry
	return nil
}

type knowledgeCollaborationNotifier struct {
	mu          sync.Mutex
	subscribers map[string]map[chan struct{}]struct{}
	external    knowledgesdk.KnowledgeCollaborationNotifier
}

func newKnowledgeCollaborationNotifier() *knowledgeCollaborationNotifier {
	return &knowledgeCollaborationNotifier{subscribers: map[string]map[chan struct{}]struct{}{}}
}

func (n *knowledgeCollaborationNotifier) setExternal(external knowledgesdk.KnowledgeCollaborationNotifier) {
	n.mu.Lock()
	n.external = external
	n.mu.Unlock()
}

func (n *knowledgeCollaborationNotifier) subscribeLocal(keys ...string) (<-chan struct{}, func()) {
	updates := make(chan struct{}, 1)
	n.mu.Lock()
	for _, key := range keys {
		if n.subscribers[key] == nil {
			n.subscribers[key] = map[chan struct{}]struct{}{}
		}
		n.subscribers[key][updates] = struct{}{}
	}
	n.mu.Unlock()
	return updates, func() {
		n.mu.Lock()
		for _, key := range keys {
			delete(n.subscribers[key], updates)
			if len(n.subscribers[key]) == 0 {
				delete(n.subscribers, key)
			}
		}
		n.mu.Unlock()
	}
}

func (n *knowledgeCollaborationNotifier) subscribe(ctx context.Context, keys ...string) (<-chan struct{}, func()) {
	local, unsubscribeLocal := n.subscribeLocal(keys...)
	n.mu.Lock()
	external := n.external
	n.mu.Unlock()
	if external == nil {
		return local, unsubscribeLocal
	}
	remote, unsubscribeRemote, err := external.SubscribeKnowledgeCollaborationWake(ctx, append([]string(nil), keys...))
	if err != nil || remote == nil {
		return local, unsubscribeLocal
	}
	updates := make(chan struct{}, 1)
	done := make(chan struct{})
	var once sync.Once
	stop := func() {
		once.Do(func() {
			close(done)
			unsubscribeRemote()
			unsubscribeLocal()
		})
	}
	go func() {
		for {
			select {
			case <-ctx.Done():
				stop()
				return
			case <-done:
				return
			case <-local:
				select {
				case updates <- struct{}{}:
				default:
				}
			case _, ok := <-remote:
				if !ok {
					stop()
					return
				}
				select {
				case updates <- struct{}{}:
				default:
				}
			}
		}
	}()
	return updates, stop
}

func (n *knowledgeCollaborationNotifier) notifyLocal(keys ...string) {
	n.mu.Lock()
	defer n.mu.Unlock()
	for _, key := range keys {
		for subscriber := range n.subscribers[key] {
			select {
			case subscriber <- struct{}{}:
			default:
			}
		}
	}
}

func (n *knowledgeCollaborationNotifier) notify(ctx context.Context, keys ...string) {
	n.notifyLocal(keys...)
	n.mu.Lock()
	external := n.external
	n.mu.Unlock()
	if external != nil {
		_ = external.PublishKnowledgeCollaborationWake(context.WithoutCancel(ctx), append([]string(nil), keys...))
	}
}

func (s *Store) SetKnowledgeCollaborationNotifier(notifier knowledgesdk.KnowledgeCollaborationNotifier) {
	if s != nil && s.collaboration != nil {
		s.collaboration.setExternal(notifier)
	}
}

type SQLBackend struct {
	DB      modulehost.Database
	Dialect modulehost.Dialect
	Engine  ormdriver.Profile
}

func (b SQLBackend) Database() modulehost.Database { return b.DB }
func (b SQLBackend) Renderer() modulehost.Dialect  { return b.Dialect }
func (b SQLBackend) Profile() ormdriver.Profile    { return b.Engine }
func (b SQLBackend) IsTransientError(err error) bool {
	if b.Engine == nil {
		return false
	}
	switch b.Engine.ClassifyError(err) {
	case ormdriver.ErrorSerialization, ormdriver.ErrorDeadlock, ormdriver.ErrorUnavailable, ormdriver.ErrorTimeout:
		return true
	}
	return false
}
