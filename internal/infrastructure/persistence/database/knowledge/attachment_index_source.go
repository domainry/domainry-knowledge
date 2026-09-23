package store

import (
	"context"
	"database/sql"
	"errors"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-orm/query"
)

func (s *Store) CompatAttachmentKnowledgeSourceOwner(ctx context.Context, db conversationDB, source string) (string, error) {
	q, args, err := query.NewSelectBuilder(s.store.Renderer(), CompatKnowledgeSourceTable).Columns("scope_key").Where(query.And(query.Equal("source_key", source), query.Equal("source_kind", compatKnowledgeAttachmentSourceKind))).Build()
	if err != nil {
		return "", err
	}
	var owner string
	err = db.QueryRowContext(ctx, q, args...).Scan(&owner)
	if errors.Is(err, sql.ErrNoRows) {
		return "", nil
	}
	return owner, err
}

func (s *Store) ActivateAttachmentKnowledgeSource(ctx context.Context, runtime, workspace, source string) error {
	a := agentsdk.ConversationAuthority{Known: true, RuntimeID: runtime, WorkspaceID: workspace, UserID: "_host"}
	if conversationAuthority(a) != nil || !CompatArtifactSHA(source) {
		return conversationError("bad_request", "attachment_source_invalid")
	}
	return s.transaction(ctx, func(tx *sql.Tx) error {
		binding := compatKnowledgeSourcePredicate(a, compatKnowledgeAttachmentBindingKey)
		q, args, err := query.NewSelectBuilder(s.store.Renderer(), CompatKnowledgeSourceTable).Columns("scope_key", "binding_key", "source_kind", "source_key").Where(query.Or(query.Equal("source_key", source), binding)).Build()
		if err != nil {
			return err
		}
		rows, err := tx.QueryContext(ctx, q, args...)
		if err != nil {
			return err
		}
		found := false
		for rows.Next() {
			var scope, key, kind, physical string
			if err = rows.Scan(&scope, &key, &kind, &physical); err != nil {
				rows.Close()
				return err
			}
			if scope != CompatLibraryScope(a) || key != compatKnowledgeAttachmentBindingKey || kind != compatKnowledgeAttachmentSourceKind || physical != source {
				rows.Close()
				return conversationError("conflict", "attachment_source_already_bound")
			}
			found = true
		}
		err = rows.Err()
		rows.Close()
		if err != nil {
			return err
		}
		if found {
			return nil
		}
		q, args, err = query.NewInsertBuilder(s.store.Renderer(), CompatKnowledgeSourceTable).Columns("scope_key", "binding_key", "source_kind", "source_key", "payload_json").Values(CompatLibraryScope(a), compatKnowledgeAttachmentBindingKey, compatKnowledgeAttachmentSourceKind, source, "{}").Build()
		return conversationExec(ctx, tx, q, args, err)
	})
}
