package store

import (
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
	store      Backend
	operations *sharedoperation.SQLStore
}

func New(backend Backend) *Store {
	var operations *sharedoperation.SQLStore
	if backend != nil {
		operations = sharedoperation.NewSQLStore(backend.Database(), sharedoperation.AdaptDialect(backend.Renderer()))
	}
	return &Store{store: backend, operations: operations}
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
