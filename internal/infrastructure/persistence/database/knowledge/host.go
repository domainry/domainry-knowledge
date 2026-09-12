package store

import (
	"context"
	"database/sql"
	sdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/modulehost"
	ormdriver "github.com/domainry/domainry-orm/driver"
)

type Backend interface {
	Database() modulehost.Database
	Renderer() modulehost.Dialect
	Profile() ormdriver.Profile
	IsTransientError(error) bool
}
type DB interface {
	ExecContext(context.Context, string, ...any) (sql.Result, error)
	QueryContext(context.Context, string, ...any) (*sql.Rows, error)
	QueryRowContext(context.Context, string, ...any) *sql.Row
}
type conversationDB = DB

// Sources validates Agent-owned references within the caller's transaction.
// Business persistence never owns or mutates conversation execution state.
type Sources interface {
	Conversation(context.Context, DB, string, sdk.ConversationAuthority) (sdk.Conversation, error)
	Run(context.Context, DB, string, string, sdk.ConversationAuthority) (sdk.ConversationRun, error)
}
type Store struct {
	store   Backend
	sources Sources
}

func New(backend Backend, sources Sources) *Store { return &Store{store: backend, sources: sources} }
func (s *Store) get(ctx context.Context, db DB, id string, a sdk.ConversationAuthority) (sdk.Conversation, error) {
	if s.sources == nil {
		return sdk.Conversation{}, conversationError("unavailable", "source_access_unavailable")
	}
	return s.sources.Conversation(ctx, db, id, a)
}
func (s *Store) Get(ctx context.Context, id string, a sdk.ConversationAuthority) (sdk.Conversation, error) {
	return s.get(ctx, s.store.Database(), id, a)
}

func (s *Store) runRow(ctx context.Context, db DB, conversation, id string, a sdk.ConversationAuthority) (sdk.ConversationRun, error) {
	if s.sources == nil {
		return sdk.ConversationRun{}, conversationError("unavailable", "source_access_unavailable")
	}
	return s.sources.Run(ctx, db, conversation, id, a)
}

func (s *Store) Run(ctx context.Context, conversation, id string, a sdk.ConversationAuthority) (sdk.ConversationRun, error) {
	return s.runRow(ctx, s.store.Database(), conversation, id, a)
}

// SQLBackend makes the Knowledge repository directly embeddable without Agent.
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
