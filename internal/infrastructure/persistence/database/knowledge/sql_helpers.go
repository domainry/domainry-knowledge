package store

import (
	"context"
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"errors"
	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-orm/query"
	ormschema "github.com/domainry/domainry-orm/schema"
	"strings"
	"time"
	"unicode/utf8"
)

func (s *Store) executionRead(ctx context.Context, db conversationDB, table string, predicate query.Predicate, out any) (bool, error) {
	q, args, err := query.NewSelectBuilder(s.store.Renderer(), table).Columns("payload_json").Where(predicate).Build()
	if err != nil {
		return false, err
	}
	var raw []byte
	err = db.QueryRowContext(ctx, q, args...).Scan(&raw)
	if errors.Is(err, sql.ErrNoRows) {
		return false, nil
	}
	if err != nil {
		return false, err
	}
	return true, unmarshalDurableJSON(raw, out)
}

func executionText(value string, limit int, required bool) bool {
	return limit > 0 && len(value) <= limit && utf8.ValidString(value) && !strings.ContainsRune(value, 0) && (!required || strings.TrimSpace(value) != "")
}

func personalMemoryKey(value string) bool {
	if len(value) == 0 || len(value) > 96 {
		return false
	}
	for _, c := range value {
		if c != '_' && c != '-' && c != '.' && c != ':' && !(c >= 'a' && c <= 'z') && !(c >= 'A' && c <= 'Z') && !(c >= '0' && c <= '9') {
			return false
		}
	}
	return true
}

func conversationHash(v any) string {
	b, _ := json.Marshal(v)
	h := sha256.Sum256(b)
	return hex.EncodeToString(h[:])
}

func conversationJSON(v any) []byte { b, _ := marshalDurableJSON(v); return b }

func conversationError(class, code string) error {
	return &agentsdk.Error{Class: class, Code: "agent.conversation." + code}
}

func conversationAuthority(a agentsdk.ConversationAuthority) error {
	if !a.Known || strings.TrimSpace(a.RuntimeID) == "" || strings.TrimSpace(a.WorkspaceID) == "" || strings.TrimSpace(a.UserID) == "" || len(a.RuntimeID) > 255 || len(a.WorkspaceID) > 255 || len(a.UserID) > 255 {
		return conversationError("forbidden", "principal_required")
	}
	return nil
}

func conversationOwner(a agentsdk.ConversationAuthority) string {
	return conversationHash([]string{a.RuntimeID, a.WorkspaceID, a.UserID})
}

func conversationScope(a agentsdk.ConversationAuthority, id string) query.Predicate {
	return query.And(query.Equal("owner_key", conversationOwner(a)), query.Equal("conversation_id", id))
}

func conversationExec(ctx context.Context, db conversationDB, statement string, args []any, err error) error {
	if err != nil {
		return err
	}
	_, err = db.ExecContext(ctx, statement, args...)
	return err
}

func conversationCAS(ctx context.Context, db conversationDB, statement string, args []any, err error) error {
	if err != nil {
		return err
	}
	result, err := db.ExecContext(ctx, statement, args...)
	if err != nil {
		return err
	}
	n, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if n != 1 {
		return conversationError("conflict", "revision_conflict")
	}
	return nil
}

func (s *Store) transaction(ctx context.Context, fn func(*sql.Tx) error) error {
	for attempt := 0; ; attempt++ {
		tx, err := s.store.Database().BeginTx(ctx, &sql.TxOptions{Isolation: sql.LevelSerializable})
		if err == nil {
			err = fn(tx)
			if err == nil {
				err = tx.Commit()
			}
			_ = tx.Rollback()
		}
		if err == nil || attempt >= 4 || !s.store.IsTransientError(err) {
			return err
		}
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-time.After(time.Duration(5<<attempt) * time.Millisecond):
		}
	}
}

func required(name string, kind ormschema.ColumnType) ormschema.ColumnDefinition {
	return ormschema.Column(name, kind).NotNull()
}
