package store

import (
	"context"
	"database/sql"
	"errors"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-orm/query"
)

func (s *Store) CompatAttachmentKnowledgeSourceOwner(ctx context.Context, db conversationDB, source string) (string, error) {
	q, args, err := query.NewSelectBuilder(s.store.Renderer(), CompatAttachmentKnowledgeSourceTable).Columns("scope_key").Where(query.Equal("source_key", source)).Build()
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
		q, args, err := query.NewSelectBuilder(s.store.Renderer(), CompatKnowledgeDocumentSourceTable).Projections(query.Project(query.CountAll())).Where(query.Equal("source_key", source)).Build()
		if err != nil {
			return err
		}
		var count int
		if err = tx.QueryRowContext(ctx, q, args...).Scan(&count); err != nil {
			return err
		}
		if count != 0 {
			return conversationError("conflict", "attachment_source_already_bound")
		}
		q, args, err = query.NewSelectBuilder(s.store.Renderer(), CompatAttachmentKnowledgeSourceTable).Columns("scope_key", "source_key").Where(query.Or(query.Equal("source_key", source), query.Equal("scope_key", CompatLibraryScope(a)))).Build()
		if err != nil {
			return err
		}
		rows, err := tx.QueryContext(ctx, q, args...)
		if err != nil {
			return err
		}
		found := false
		for rows.Next() {
			var scope, physical string
			if err = rows.Scan(&scope, &physical); err != nil {
				rows.Close()
				return err
			}
			if scope != CompatLibraryScope(a) || physical != source {
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
		q, args, err = query.NewInsertBuilder(s.store.Renderer(), CompatAttachmentKnowledgeSourceTable).Columns("scope_key", "source_key").Values(CompatLibraryScope(a), source).Build()
		return conversationExec(ctx, tx, q, args, err)
	})
}
