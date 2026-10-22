package records

import "github.com/domainry/domainry-foundation/schemaownership"

var schemaOwnership = []schemaownership.Table{
	{
		Name: recordTable, Owner: MigrationOwner, Kind: schemaownership.KindEntity, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"}, EntityIDColumn: "record_id", EntityIDPrefix: "krec", BusinessKey: []string{"record_id"},
		BoundedQueryPath: "namespace/owner/kind/record identity and ascending physical id pagination",
		DeletionPolicy:   "the owning product removes records and their versions and receipts when the scoped user data is erased",
	},
	{
		Name: recordVersionTable, Owner: MigrationOwner, Kind: schemaownership.KindDependent, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"},
		BoundedQueryPath: "namespace/owner/kind/record/revision immutable history lookup",
		DeletionPolicy:   "versions follow the owning record retention and are removed with the scoped record",
	},
	{
		Name: recordReceiptTable, Owner: MigrationOwner, Kind: schemaownership.KindIdempotency, WorkspaceScope: schemaownership.ScopeExplicitMixed,
		RetentionClass: schemaownership.RetentionUserErase, PrimaryKey: []string{"id"},
		BoundedQueryPath: "namespace/owner/kind/client idempotency lookup",
		DeletionPolicy:   "receipts follow the scoped record owner retention and are removed during owner erasure",
	},
}

func SchemaOwnership() []schemaownership.Table { return schemaownership.Clone(schemaOwnership) }
func OwnedTables() []string                    { return schemaownership.Names(SchemaOwnership()) }
