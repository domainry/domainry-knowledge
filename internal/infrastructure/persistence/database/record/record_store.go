// Package records stores owner-scoped structured documents with immutable
// revisions. Product services supply their own schemas and transition rules.
package records

import (
	"context"
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/domainry/domainry-knowledge-sdk/contract"
	"github.com/domainry/domainry-orm/driver"
	"github.com/domainry/domainry-orm/query"
	"github.com/domainry/domainry-orm/sqlhost"
	sdk "github.com/domainry/domainry-tools-sdk"
	"strings"
	"time"
)

type Record = contract.Record
type Write = contract.Write
type Page = contract.Page
type Validator = contract.Validator
type Store struct {
	db        sqlhost.Database
	renderer  query.Renderer
	profile   driver.Profile
	namespace string
}

// New borrows a host-owned database. The host must apply Migrations before use.
func New(db sqlhost.Database, renderer query.Renderer, profile driver.Profile, namespace string) (*Store, error) {
	if db == nil || renderer == nil || profile == nil || !key(namespace) {
		return nil, fmt.Errorf("record database, renderer, profile and namespace required")
	}
	return &Store{db: db, renderer: renderer, profile: profile, namespace: namespace}, nil
}
func (s *Store) owner(kind, owner string) query.Predicate {
	return query.And(query.Equal("namespace", s.namespace), query.Equal("owner", owner), query.Equal("kind", kind))
}
func (s *Store) document(kind, owner, id string) query.Predicate {
	return query.And(s.owner(kind, owner), query.Equal("id", id))
}
func (s *Store) receipt(kind, owner, client string) query.Predicate {
	return query.And(s.owner(kind, owner), query.Equal("client", client))
}
func readRow(ctx context.Context, db sqlhost.Queryer, builder *query.SelectBuilder, destinations ...any) error {
	statement, args, err := builder.Build()
	if err != nil {
		return err
	}
	return db.QueryRowContext(ctx, statement, args...).Scan(destinations...)
}

type statementBuilder interface{ Build() (string, []any, error) }

func execute(ctx context.Context, db sqlhost.Executor, builder statementBuilder) (sql.Result, error) {
	statement, args, err := builder.Build()
	if err != nil {
		return nil, err
	}
	return db.ExecContext(ctx, statement, args...)
}
func failure(class, code string) error {
	return &sdk.Error{Class: class, Code: "knowledge.records." + code}
}
func hash(v any) string {
	b, _ := json.Marshal(v)
	h := sha256.Sum256(b)
	return hex.EncodeToString(h[:])
}
func key(s string) bool {
	if s == "" || len(s) > 96 {
		return false
	}
	for _, c := range s {
		if !(c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z' || c >= '0' && c <= '9' || strings.ContainsRune("_-.:", c)) {
			return false
		}
	}
	return true
}
func scope(a sdk.Authority) (string, error) {
	if !a.Known || a.RuntimeID == "" || a.WorkspaceID == "" || a.UserID == "" {
		return "", failure("forbidden", "principal_required")
	}
	return hash([]string{a.RuntimeID, a.WorkspaceID, a.UserID}), nil
}
func (s *Store) Get(ctx context.Context, kind, id string, revision int64, a sdk.Authority) (Record, error) {
	var out Record
	o, err := scope(a)
	if err != nil {
		return out, err
	}
	if !key(kind) || !key(id) || revision < 0 {
		return out, failure("bad_request", "query_invalid")
	}
	var raw []byte
	if revision == 0 {
		err = readRow(ctx, s.db, query.NewSelectBuilder(s.renderer, "knowledge_records").Columns("payload").Where(s.document(kind, o, id)), &raw)
	} else {
		err = readRow(ctx, s.db, query.NewSelectBuilder(s.renderer, "knowledge_record_versions").Columns("payload").Where(query.And(s.document(kind, o, id), query.Equal("revision", revision))), &raw)
	}
	if errors.Is(err, sql.ErrNoRows) {
		return out, failure("not_found", "not_found")
	}
	if err != nil {
		return out, err
	}
	err = json.Unmarshal(raw, &out)
	return out, err
}
func (s *Store) List(ctx context.Context, kind, q, after string, limit int, a sdk.Authority) (Page, error) {
	out := Page{Items: []Record{}, Complete: true}
	o, err := scope(a)
	if err != nil {
		return out, err
	}
	if !key(kind) || len(q) > 255 || after != "" && !key(after) {
		return out, failure("bad_request", "query_invalid")
	}
	if limit == 0 {
		limit = 30
	}
	if limit < 1 || limit > 50 {
		return out, failure("bad_request", "query_invalid")
	}
	statement, args, err := query.NewSelectBuilder(s.renderer, "knowledge_records").Columns("payload").Where(query.And(s.owner(kind, o), query.GreaterThan("id", after))).OrderBy(query.Ascending("id")).Build()
	if err != nil {
		return out, err
	}
	rows, err := s.db.QueryContext(ctx, statement, args...)
	if err != nil {
		return out, err
	}
	defer rows.Close()
	for rows.Next() {
		var raw []byte
		var r Record
		if err = rows.Scan(&raw); err != nil {
			return out, err
		}
		if err = json.Unmarshal(raw, &r); err != nil {
			return out, err
		}
		if q != "" && !strings.Contains(strings.ToLower(r.Title+" "+string(r.Data)), strings.ToLower(q)) {
			continue
		}
		if len(out.Items) == limit {
			out.Complete = false
			out.NextCursor = out.Items[len(out.Items)-1].ID
			break
		}
		out.Items = append(out.Items, r)
	}
	return out, rows.Err()
}
func (s *Store) Save(ctx context.Context, kind string, in Write, a sdk.Authority, validate Validator) (Record, error) {
	var out Record
	o, err := scope(a)
	if err != nil {
		return out, err
	}
	if !key(kind) || !key(in.ClientID) || in.ID != "" && !key(in.ID) || in.ExpectedRevision < 0 || strings.TrimSpace(in.Title) == "" || len(in.Title) > 255 || len(in.Data) > 32768 || !json.Valid(in.Data) || validate == nil {
		return out, failure("bad_request", "document_invalid")
	}
	// Retry the entire transaction after a serialization/deadlock or concurrent
	// receipt insert. A committed receipt is re-read before any business effect.
	for attempt := 0; ; attempt++ {
		out, err = s.save(ctx, kind, in, o, validate)
		if err == nil || attempt == 5 {
			return out, err
		}
		switch s.profile.ClassifyError(err) {
		case driver.ErrorSerialization, driver.ErrorDeadlock, driver.ErrorConflict, driver.ErrorUnavailable, driver.ErrorTimeout:
		default:
			return out, err
		}
		timer := time.NewTimer(time.Duration(5<<attempt) * time.Millisecond)
		select {
		case <-ctx.Done():
			timer.Stop()
			return Record{}, ctx.Err()
		case <-timer.C:
		}
	}
}
func (s *Store) save(ctx context.Context, kind string, in Write, o string, validate Validator) (Record, error) {
	var out Record
	tx, err := s.db.BeginTx(ctx, &sql.TxOptions{Isolation: sql.LevelSerializable})
	if err != nil {
		return out, err
	}
	defer tx.Rollback()
	var digest string
	var raw []byte
	err = readRow(ctx, tx, query.NewSelectBuilder(s.renderer, "knowledge_record_receipts").Columns("digest", "payload").Where(s.receipt(kind, o, in.ClientID)), &digest, &raw)
	if err == nil {
		if digest != hash(in) {
			return out, failure("conflict", "idempotency_conflict")
		}
		err = json.Unmarshal(raw, &out)
		return out, err
	}
	if !errors.Is(err, sql.ErrNoRows) {
		return out, err
	}
	var previous *Record
	id := in.ID
	if id != "" {
		var p Record
		err = readRow(ctx, tx, query.NewSelectBuilder(s.renderer, "knowledge_records").Columns("payload").Where(s.document(kind, o, id)), &raw)
		if errors.Is(err, sql.ErrNoRows) {
			return out, failure("not_found", "not_found")
		}
		if err != nil {
			return out, err
		}
		if err = json.Unmarshal(raw, &p); err != nil {
			return out, err
		}
		previous = &p
		if p.Revision != in.ExpectedRevision {
			return out, failure("conflict", "revision_conflict")
		}
	} else {
		if in.ExpectedRevision != 0 {
			return out, failure("conflict", "revision_conflict")
		}
		id = "rec_" + hash([]string{s.namespace, o, kind, in.ClientID})[:32]
	}
	now := time.Now().UTC()
	out = Record{ID: id, Kind: kind, Title: strings.TrimSpace(in.Title), Status: in.Status, Revision: 1, Data: append(json.RawMessage(nil), in.Data...), CreatedAt: now, UpdatedAt: now}
	if previous != nil {
		out.Revision = previous.Revision + 1
		out.CreatedAt = previous.CreatedAt
	}
	if err = validate(previous, &out); err != nil {
		return Record{}, err
	}
	raw, err = json.Marshal(out)
	if err != nil {
		return Record{}, err
	}
	if previous == nil {
		_, err = execute(ctx, tx, query.NewInsertBuilder(s.renderer, "knowledge_records").Columns("namespace", "owner", "kind", "id", "revision", "payload").Values(s.namespace, o, kind, id, out.Revision, string(raw)))
	} else {
		var r sql.Result
		r, err = execute(ctx, tx, query.NewUpdateBuilder(s.renderer, "knowledge_records").Set("revision", out.Revision).Set("payload", string(raw)).Where(query.And(s.document(kind, o, id), query.Equal("revision", previous.Revision))))
		if err == nil {
			n, e := r.RowsAffected()
			if e != nil {
				return out, e
			}
			if n != 1 {
				return out, failure("conflict", "revision_conflict")
			}
		}
	}
	if err != nil {
		return out, err
	}
	if _, err = execute(ctx, tx, query.NewInsertBuilder(s.renderer, "knowledge_record_versions").Columns("namespace", "owner", "kind", "id", "revision", "payload").Values(s.namespace, o, kind, id, out.Revision, string(raw))); err != nil {
		return out, err
	}
	if _, err = execute(ctx, tx, query.NewInsertBuilder(s.renderer, "knowledge_record_receipts").Columns("namespace", "owner", "kind", "client", "digest", "payload").Values(s.namespace, o, kind, in.ClientID, hash(in), string(raw))); err != nil {
		return out, err
	}
	err = tx.Commit()
	return out, err
}

// Receipt is read-only recovery: absence does not repeat a possibly sent command.
func (s *Store) Receipt(ctx context.Context, kind string, in Write, a sdk.Authority) (Record, bool, error) {
	var out Record
	o, err := scope(a)
	if err != nil {
		return out, false, err
	}
	var digest string
	var raw []byte
	err = readRow(ctx, s.db, query.NewSelectBuilder(s.renderer, "knowledge_record_receipts").Columns("digest", "payload").Where(s.receipt(kind, o, in.ClientID)), &digest, &raw)
	if errors.Is(err, sql.ErrNoRows) {
		return out, false, nil
	}
	if err != nil {
		return out, false, err
	}
	if digest != hash(in) {
		return out, false, failure("conflict", "idempotency_conflict")
	}
	err = json.Unmarshal(raw, &out)
	return out, true, err
}
