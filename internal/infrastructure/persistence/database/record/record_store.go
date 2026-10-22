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
	"github.com/domainry/domainry-foundation/entityid"
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
type storedRecord struct {
	ID        int64           `json:"id"`
	RecordID  string          `json:"record_id"`
	Kind      string          `json:"kind"`
	Title     string          `json:"title"`
	Status    string          `json:"status"`
	Revision  int64           `json:"revision"`
	Data      json.RawMessage `json:"data"`
	CreatedAt int64           `json:"created_at"`
	UpdatedAt int64           `json:"updated_at"`
}

func marshalRecord(value Record) ([]byte, error) {
	return json.Marshal(storedRecord{ID: value.ID, RecordID: value.RecordID, Kind: value.Kind, Title: value.Title, Status: value.Status, Revision: value.Revision, Data: value.Data, CreatedAt: value.CreatedAt.UTC().UnixMilli(), UpdatedAt: value.UpdatedAt.UTC().UnixMilli()})
}

func unmarshalRecord(raw []byte, value *Record) error {
	var stored storedRecord
	if err := json.Unmarshal(raw, &stored); err != nil {
		return err
	}
	*value = Record{ID: stored.ID, RecordID: stored.RecordID, Kind: stored.Kind, Title: stored.Title, Status: stored.Status, Revision: stored.Revision, Data: stored.Data, CreatedAt: time.UnixMilli(stored.CreatedAt).UTC(), UpdatedAt: time.UnixMilli(stored.UpdatedAt).UTC()}
	return nil
}

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
func (s *Store) document(kind, owner, recordID string) query.Predicate {
	return query.And(s.owner(kind, owner), query.Equal("record_id", recordID))
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

func insertPhysicalID(ctx context.Context, db sqlhost.DBTX, profile driver.Profile, builder *query.InsertBuilder) (int64, error) {
	if profile.Capabilities().Returning {
		returning, err := profile.ApplyReturning(builder, "id")
		if err != nil {
			return 0, err
		}
		statement, args, err := returning.Build()
		if err != nil {
			return 0, err
		}
		var id int64
		if err := db.QueryRowContext(ctx, statement, args...).Scan(&id); err != nil {
			return 0, err
		}
		return id, nil
	}
	result, err := execute(ctx, db, builder)
	if err != nil {
		return 0, err
	}
	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}
	return id, nil
}
func failure(class sdk.ErrorClass, code string) error {
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
		var physicalID int64
		err = readRow(ctx, s.db, query.NewSelectBuilder(s.renderer, "knowledge_records").Columns("id", "payload").Where(s.document(kind, o, id)), &physicalID, &raw)
		if err == nil {
			err = unmarshalRecord(raw, &out)
			out.ID = physicalID
		}
	} else {
		err = readRow(ctx, s.db, query.NewSelectBuilder(s.renderer, "knowledge_record_versions").Columns("payload").Where(query.And(s.document(kind, o, id), query.Equal("revision", revision))), &raw)
		if err == nil {
			err = unmarshalRecord(raw, &out)
		}
	}
	if errors.Is(err, sql.ErrNoRows) {
		return out, failure("not_found", "not_found")
	}
	if err != nil {
		return out, err
	}
	return out, err
}
func (s *Store) List(ctx context.Context, kind, q string, after int64, limit int, a sdk.Authority) (Page, error) {
	out := Page{Items: []Record{}, Complete: true}
	o, err := scope(a)
	if err != nil {
		return out, err
	}
	if !key(kind) || len(q) > 255 || after < 0 {
		return out, failure("bad_request", "query_invalid")
	}
	if limit == 0 {
		limit = 30
	}
	if limit < 1 || limit > 50 {
		return out, failure("bad_request", "query_invalid")
	}
	statement, args, err := query.NewSelectBuilder(s.renderer, "knowledge_records").Columns("id", "payload").Where(query.And(s.owner(kind, o), query.GreaterThan("id", after))).OrderBy(query.Ascending("id")).Build()
	if err != nil {
		return out, err
	}
	rows, err := s.db.QueryContext(ctx, statement, args...)
	if err != nil {
		return out, err
	}
	defer rows.Close()
	for rows.Next() {
		var physicalID int64
		var raw []byte
		var r Record
		if err = rows.Scan(&physicalID, &raw); err != nil {
			return out, err
		}
		if err = unmarshalRecord(raw, &r); err != nil {
			return out, err
		}
		r.ID = physicalID
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
	if !key(kind) || !key(in.ClientID) || in.RecordID != "" && !key(in.RecordID) || in.ExpectedRevision < 0 || strings.TrimSpace(in.Title) == "" || len(in.Title) > 255 || len(in.Data) > 32768 || !json.Valid(in.Data) || validate == nil {
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
		err = unmarshalRecord(raw, &out)
		return out, err
	}
	if !errors.Is(err, sql.ErrNoRows) {
		return out, err
	}
	var previous *Record
	recordID := in.RecordID
	if recordID != "" {
		var p Record
		var physicalID int64
		err = readRow(ctx, tx, query.NewSelectBuilder(s.renderer, "knowledge_records").Columns("id", "payload").Where(s.document(kind, o, recordID)), &physicalID, &raw)
		if errors.Is(err, sql.ErrNoRows) {
			return out, failure("not_found", "not_found")
		}
		if err != nil {
			return out, err
		}
		if err = unmarshalRecord(raw, &p); err != nil {
			return out, err
		}
		p.ID = physicalID
		previous = &p
		if p.Revision != in.ExpectedRevision {
			return out, failure("conflict", "revision_conflict")
		}
	} else {
		if in.ExpectedRevision != 0 {
			return out, failure("conflict", "revision_conflict")
		}
		recordID, err = entityid.Derive("krec", "knowledge.record", s.namespace, o, kind, in.ClientID)
		if err != nil {
			return out, err
		}
	}
	now := time.Now().UTC().Truncate(time.Millisecond)
	out = Record{RecordID: recordID, Kind: kind, Title: strings.TrimSpace(in.Title), Status: in.Status, Revision: 1, Data: append(json.RawMessage(nil), in.Data...), CreatedAt: now, UpdatedAt: now}
	if previous != nil {
		out.ID = previous.ID
		out.Revision = previous.Revision + 1
		out.CreatedAt = previous.CreatedAt
	}
	if err = validate(previous, &out); err != nil {
		return Record{}, err
	}
	if previous == nil {
		raw, err = marshalRecord(out)
		if err != nil {
			return Record{}, err
		}
		out.ID, err = insertPhysicalID(ctx, tx, s.profile, query.NewInsertBuilder(s.renderer, "knowledge_records").Columns("namespace", "owner", "kind", "record_id", "revision", "payload").Values(s.namespace, o, kind, recordID, out.Revision, string(raw)))
		if err == nil {
			raw, err = marshalRecord(out)
		}
		if err == nil {
			_, err = execute(ctx, tx, query.NewUpdateBuilder(s.renderer, "knowledge_records").Set("payload", string(raw)).Where(query.Equal("id", out.ID)))
		}
	} else {
		raw, err = marshalRecord(out)
		if err != nil {
			return Record{}, err
		}
		var r sql.Result
		r, err = execute(ctx, tx, query.NewUpdateBuilder(s.renderer, "knowledge_records").Set("revision", out.Revision).Set("payload", string(raw)).Where(query.And(s.document(kind, o, recordID), query.Equal("revision", previous.Revision))))
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
	if _, err = execute(ctx, tx, query.NewInsertBuilder(s.renderer, "knowledge_record_versions").Columns("namespace", "owner", "kind", "record_id", "revision", "payload").Values(s.namespace, o, kind, recordID, out.Revision, string(raw))); err != nil {
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
	err = unmarshalRecord(raw, &out)
	return out, true, err
}
