package product

import (
	"context"
	"errors"
	"fmt"
	"path/filepath"
	"strings"

	identitysdk "github.com/domainry/domainry-identity-sdk"
	identitymodule "github.com/domainry/domainry-identity/module"
)

func (host *Host) openIdentity(ctx context.Context, options Options) error {
	databasePath, err := filepath.Abs(options.DatabasePath)
	if err != nil {
		return err
	}
	factory := identitymodule.NewFactory(identityOptions(options.Identity))
	bootstrap, err := factory.OpenBootstrapWithDatabase(ctx, host.application.ApplicationKey, host.databaseHandle(databasePath))
	if err != nil {
		return fmt.Errorf("open Identity bootstrap module: %w", err)
	}
	if err = bootstrap.BindOperationsPersistence(); err != nil {
		_ = bootstrap.Close(context.Background())
		return fmt.Errorf("bind Identity bootstrap Operations persistence: %w", err)
	}
	catalog := identitysdk.ProjectRoleCatalog{
		Application:                          identitysdk.ApplicationRef{ApplicationKey: host.application.ApplicationKey},
		InitialWorkspaceAdministratorRoleKey: administratorRoleKey,
		Roles: []identitysdk.ProjectRoleDefinition{{
			Key: administratorRoleKey, Name: "Knowledge administrator", Audience: "user", AssignmentMode: "manual", ProvisionToWorkspaces: true,
		}},
	}
	if err = bootstrap.BindBootstrapProjectRoleCatalog(ctx, catalog); err != nil {
		_ = bootstrap.Close(context.Background())
		return fmt.Errorf("bind Knowledge administrator role catalog: %w", err)
	}
	request := identitysdk.WorkspaceIdentityBootstrapRequest{
		ContractVersion: identitysdk.WorkspaceIdentityBootstrapContractVersion,
		ContractHash:    identitysdk.WorkspaceIdentityBootstrapContractHash,
		InvocationID:    "knowledge-product-bootstrap-v1", WorkspaceID: host.workspaceID,
		CompanyID: host.workspaceID + "-company", CompanyCode: "KNOWLEDGE", CompanyName: "Knowledge Workspace",
		FirstStoreID: host.workspaceID + "-workspace", FirstStoreCode: "KNOWLEDGE-001", FirstStoreName: "Knowledge Workspace",
		InitialAdminUserID: host.workspaceID + "-admin", InitialAdminLoginID: strings.TrimSpace(options.AdminLogin), InitialAdminName: strings.TrimSpace(options.AdminName), InitialAdminPassword: options.AdminPassword,
	}
	tx, err := host.database.BeginTx(ctx, nil)
	if err != nil {
		_ = bootstrap.Close(context.Background())
		return err
	}
	receipt, bootstrapErr := bootstrap.BootstrapWorkspaceIdentity(ctx, request, identitysdk.EmbeddedTransaction{Executor: tx})
	if bootstrapErr != nil {
		_ = tx.Rollback()
		_ = bootstrap.Close(context.Background())
		return fmt.Errorf("bootstrap Knowledge workspace identity: %w", bootstrapErr)
	}
	if err = tx.Commit(); err != nil {
		completionErr := bootstrap.CompleteWorkspaceIdentityBootstrap(ctx, identitysdk.WorkspaceIdentityBootstrapCompletion{WorkspaceID: receipt.WorkspaceID, ReceiptID: receipt.ReceiptID, Outcome: identitysdk.WorkspaceIdentityBootstrapTransactionRolledBack})
		_ = bootstrap.Close(context.Background())
		return errors.Join(err, completionErr)
	}
	if !receipt.Replayed {
		if err = bootstrap.CompleteWorkspaceIdentityBootstrap(ctx, identitysdk.WorkspaceIdentityBootstrapCompletion{WorkspaceID: receipt.WorkspaceID, ReceiptID: receipt.ReceiptID, Outcome: identitysdk.WorkspaceIdentityBootstrapTransactionCommitted}); err != nil {
			_ = bootstrap.Close(context.Background())
			return err
		}
	}
	if err = bootstrap.Close(ctx); err != nil {
		return err
	}

	host.identity, err = factory.OpenWithDatabase(ctx, host.application, host.databaseHandle(databasePath))
	if err != nil {
		return fmt.Errorf("open Identity module: %w", err)
	}
	if binder, ok := host.identity.(identitysdk.OperationsPersistenceBinding); !ok {
		return fmt.Errorf("Identity module Operations persistence binding is required")
	} else if err = binder.BindOperationsPersistence(); err != nil {
		return fmt.Errorf("bind Identity Operations persistence: %w", err)
	}
	if _, err = host.identity.Applications().Register(ctx, identitysdk.ApplicationRegistration{Application: host.application}); err != nil {
		return fmt.Errorf("register Knowledge application identity: %w", err)
	}
	return nil
}
