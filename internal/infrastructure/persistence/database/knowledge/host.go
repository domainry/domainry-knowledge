package store

import (
	"sync"

	sharedoperation "github.com/domainry/domainry-foundation/operation"
	"github.com/domainry/domainry-knowledge-sdk/modulehost"
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
	store         Backend
	operations    *sharedoperation.SQLStore
	collaboration *knowledgeCollaborationNotifier
}

func New(backend Backend) *Store {
	var operations *sharedoperation.SQLStore
	if backend != nil {
		operations = sharedoperation.NewSQLStore(backend.Database(), sharedoperation.AdaptDialect(backend.Renderer()))
	}
	return &Store{store: backend, operations: operations, collaboration: newKnowledgeCollaborationNotifier()}
}

type knowledgeCollaborationNotifier struct {
	mu          sync.Mutex
	subscribers map[string]map[chan struct{}]struct{}
}

func newKnowledgeCollaborationNotifier() *knowledgeCollaborationNotifier {
	return &knowledgeCollaborationNotifier{subscribers: map[string]map[chan struct{}]struct{}{}}
}

func (n *knowledgeCollaborationNotifier) subscribe(keys ...string) (<-chan struct{}, func()) {
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

func (n *knowledgeCollaborationNotifier) notify(keys ...string) {
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
