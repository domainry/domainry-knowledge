// Package modulehost defines infrastructure and narrow Agent source ports used
// to embed Knowledge without exposing either module's Store.
package modulehost

import (
	"context"
	"database/sql"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	agentmodulehost "github.com/domainry/domainry-agent-sdk/modulehost"
	sharedartifact "github.com/domainry/domainry-foundation/artifact"
	knowledgecontract "github.com/domainry/domainry-knowledge/contract"
	ormdriver "github.com/domainry/domainry-orm/driver"
)

type DB interface {
	ExecContext(context.Context, string, ...any) (sql.Result, error)
	QueryContext(context.Context, string, ...any) (*sql.Rows, error)
	QueryRowContext(context.Context, string, ...any) *sql.Row
}

type SourceReader interface {
	Conversation(context.Context, DB, string, agentsdk.ConversationAuthority) (agentsdk.Conversation, error)
	Run(context.Context, DB, string, string, agentsdk.ConversationAuthority) (agentsdk.ConversationRun, error)
}

type Host interface {
	Database() agentmodulehost.Database
	Dialect() agentmodulehost.Dialect
	Migrations() agentmodulehost.MigrationRegistrar
	Profile() ormdriver.Profile
	SourceReader
}

type ArtifactHost interface {
	ArtifactStore() sharedartifact.ManagedStore
	ArtifactContentStore() sharedartifact.ContentStore
	ArtifactContentWriter() sharedartifact.ContentWriter
}

type Factory interface {
	OpenModule(context.Context, knowledgecontract.ApplicationRef, Host) (knowledgecontract.ModuleBinding, error)
}
