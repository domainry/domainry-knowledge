package store

import (
	"context"
	"database/sql"
	"encoding/json"
	"time"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
	"github.com/domainry/domainry-orm/query"
)

func CompatDocumentLeaseAuthority(l persistence.KnowledgeDocumentLease) agentsdk.ConversationAuthority {
	return agentsdk.ConversationAuthority{Known: true, RuntimeID: l.RuntimeID, WorkspaceID: l.WorkspaceID, UserID: "_worker"}
}
func (s *Store) CompatQueueDocumentWork(ctx context.Context, tx *sql.Tx, r persistence.KnowledgeDocumentRecord) error {
	l := persistence.KnowledgeDocumentLease{RuntimeID: r.Actor.RuntimeID, WorkspaceID: r.Actor.WorkspaceID, LibraryID: r.Document.LibraryID, DocumentID: r.Document.ID}
	b := query.NewInsertBuilder(s.store.Renderer(), CompatKnowledgeDocumentJobTable).Columns("scope_key", "document_id", "runtime_id", "not_before", "lease_until", "fence", "payload_json").Values(CompatLibraryScope(r.Actor), r.Document.ID, r.Actor.RuntimeID, 0, 0, 0, conversationJSON(l))
	// Revocation wakes work but never resets an in-flight lease or its fence.
	b, e := s.store.Profile().ApplyUpsert(b, []string{"scope_key", "document_id"}, query.AssignExpression("not_before", query.InsertedValue("not_before")))
	if e != nil {
		return e
	}
	q, args, e := b.Build()
	return conversationExec(ctx, tx, q, args, e)
}
func (s *Store) ClaimKnowledgeDocumentWork(ctx context.Context, runtime, owner string, now time.Time, ttl time.Duration) (out persistence.KnowledgeDocumentLease, found bool, err error) {
	if !executionText(runtime, 255, true) || !personalMemoryKey(owner) || ttl < 100*time.Millisecond || ttl > 5*time.Minute {
		return out, false, conversationError("bad_request", "document_lease_invalid")
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		out = persistence.KnowledgeDocumentLease{}
		found = false
		q, args, e := query.NewSelectBuilder(s.store.Renderer(), CompatKnowledgeDocumentJobTable).Columns("payload_json").Where(query.And(query.Equal("runtime_id", runtime), query.LessThanOrEqual("not_before", now.UnixMilli()), query.LessThanOrEqual("lease_until", now.UnixMilli()))).OrderBy(query.Ascending("not_before"), query.Ascending("scope_key"), query.Ascending("document_id")).Limit(1).Build()
		if e != nil {
			return e
		}
		var raw []byte
		e = tx.QueryRowContext(ctx, q, args...).Scan(&raw)
		if e == sql.ErrNoRows {
			return nil
		}
		if e != nil {
			return e
		}
		if e = json.Unmarshal(raw, &out); e != nil {
			return e
		}
		if out.RuntimeID != runtime || !CompatValidKnowledgeDocumentID(out.DocumentID) || !CompatValidLibraryID(out.LibraryID) || conversationAuthority(CompatDocumentLeaseAuthority(out)) != nil {
			return conversationError("unavailable", "document_lease_invalid")
		}
		prior := out.Token
		out.Token++
		out.Owner = owner
		out.ExpiresAt = now.UTC().Add(ttl)
		q, args, e = query.NewUpdateBuilder(s.store.Renderer(), CompatKnowledgeDocumentJobTable).Set("fence", out.Token).Set("lease_until", out.ExpiresAt.UnixMilli()).Set("payload_json", conversationJSON(out)).Where(query.And(CompatDocumentScope(CompatDocumentLeaseAuthority(out), out.DocumentID), query.Equal("fence", prior), query.LessThanOrEqual("lease_until", now.UnixMilli()))).Build()
		if e = conversationCAS(ctx, tx, q, args, e); e != nil {
			return e
		}
		found = true
		return nil
	})
	return
}
func (s *Store) CompatDocumentWork(ctx context.Context, db conversationDB, l persistence.KnowledgeDocumentLease) (out persistence.KnowledgeDocumentRecord, err error) {
	if l.Token < 1 || !personalMemoryKey(l.Owner) || !CompatValidKnowledgeDocumentID(l.DocumentID) || conversationAuthority(CompatDocumentLeaseAuthority(l)) != nil {
		return out, conversationError("conflict", "document_lease_lost")
	}
	var current persistence.KnowledgeDocumentLease
	found, e := s.executionRead(ctx, db, CompatKnowledgeDocumentJobTable, CompatDocumentScope(CompatDocumentLeaseAuthority(l), l.DocumentID), &current)
	if e != nil {
		return out, e
	}
	if !found || current.Token != l.Token || current.Owner != l.Owner || current.RuntimeID != l.RuntimeID || current.LibraryID != l.LibraryID || !current.ExpiresAt.After(time.Now().UTC()) {
		return out, conversationError("conflict", "document_lease_lost")
	}
	out, e = s.CompatDocument(ctx, db, l.DocumentID, CompatDocumentLeaseAuthority(l))
	if e != nil {
		return out, e
	}
	if out.Actor.RuntimeID != l.RuntimeID || out.Actor.WorkspaceID != l.WorkspaceID || out.Document.LibraryID != l.LibraryID {
		return out, conversationError("unavailable", "document_lease_invalid")
	}
	return out, nil
}
func (s *Store) KnowledgeDocumentWorkRecord(ctx context.Context, l persistence.KnowledgeDocumentLease) (persistence.KnowledgeDocumentRecord, error) {
	return s.CompatDocumentWork(ctx, s.store.Database(), l)
}

func CompatKnowledgeDocumentPutRequestID(r persistence.KnowledgeDocumentRecord) string {
	return "kput_" + conversationHash([]string{r.SourceID, r.RemoteID, r.RequestSHA256})
}
func (s *Store) StartKnowledgeDocumentPut(ctx context.Context, l persistence.KnowledgeDocumentLease) (out persistence.KnowledgeDocumentRecord, started bool, err error) {
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		started = false
		var e error
		out, e = s.CompatDocumentWork(ctx, tx, l)
		if e != nil {
			return e
		}
		if out.PutStarted || out.Document.State == "deleting" || out.Document.State == "deleted" {
			return nil
		}
		library, e := s.CompatLibrary(ctx, tx, out.Document.LibraryID, out.Actor)
		if e != nil {
			return e
		}
		if e = CompatDocumentWriting(library); e != nil {
			return e
		}
		if out.BodyRef == "" || out.Document.State != "queued" && out.Document.State != "failed" {
			return conversationError("conflict", "document_state_conflict")
		}
		if out.PutRequestID == "" {
			// Backfill old, unstarted public reservations in the same transaction
			// as the write marker. An already uncertain write is never replayed.
			out.PutRequestID = CompatKnowledgeDocumentPutRequestID(out)
		}
		out.PutStarted = true
		out.Document.State = "indexing"
		out.Document.ErrorCode = ""
		if e = s.CompatSaveDocument(ctx, tx, &out, out.Document.Revision); e != nil {
			return e
		}
		started = true
		return nil
	})
	return
}
func (s *Store) StartKnowledgeDocumentDelete(ctx context.Context, l persistence.KnowledgeDocumentLease) error {
	return s.transaction(ctx, func(tx *sql.Tx) error {
		r, e := s.CompatDocumentWork(ctx, tx, l)
		if e != nil {
			return e
		}
		if r.Document.State != "deleting" || !r.IndexObserved {
			return conversationError("conflict", "document_cleanup_unconfirmed")
		}
		if r.DeleteStarted {
			return nil
		}
		r.DeleteStarted = true
		return s.CompatSaveDocument(ctx, tx, &r, r.Document.Revision)
	})
}
func (s *Store) ApplyKnowledgeDocumentProgress(ctx context.Context, l persistence.KnowledgeDocumentLease, in persistence.KnowledgeDocumentProgress) error {
	if in.ErrorCode != "" && !CompatAttachmentErrorCodePattern.MatchString(in.ErrorCode) || !executionText(in.IndexStatus, 64, false) {
		return conversationError("bad_request", "document_progress_invalid")
	}
	return s.transaction(ctx, func(tx *sql.Tx) error {
		r, e := s.CompatDocumentWork(ctx, tx, l)
		if e != nil {
			return e
		}
		before := conversationHash(r)
		done := false
		switch in.Event {
		case "delete_acknowledged":
			if !r.DeleteStarted || r.Document.State != "deleting" {
				return conversationError("conflict", "document_state_conflict")
			}
			r.DeleteAcknowledged = true
			r.Document.ErrorCode = ""
		case "put_acknowledged":
			if !r.PutStarted {
				return conversationError("conflict", "document_state_conflict")
			}
			r.PutAcknowledged = true
		case "indexed":
			if !r.PutStarted || in.IndexStatus != "INDEXED" {
				return conversationError("conflict", "document_state_conflict")
			}
			r.IndexObserved = true
			r.Document.IndexStatus = in.IndexStatus
			r.Document.ErrorCode = ""
			if r.Document.State != "deleting" {
				r.Document.State = "ready"
				done = true
			}
		case "retry":
			r.Document.IndexStatus = in.IndexStatus
			r.Document.ErrorCode = in.ErrorCode
			if r.Document.State != "deleting" && r.Document.State != "deleted" {
				if !r.PutStarted {
					r.Document.State = "failed"
				} else if !r.PutAcknowledged {
					r.Document.State = "needs_reconcile"
				} else {
					r.Document.State = "indexing"
				}
			}
		case "deleted":
			if r.Document.State != "deleting" || r.PutStarted && (!r.IndexObserved || !r.DeleteStarted || r.AccessPolicySHA256 != "" && !r.DeleteAcknowledged) {
				return conversationError("conflict", "document_cleanup_unconfirmed")
			}
			r.Document.State = "deleted"
			r.Document.ErrorCode = ""
			r.BodyRef = ""
			done = true
		default:
			return conversationError("bad_request", "document_progress_invalid")
		}
		if before != conversationHash(r) {
			if e = s.CompatSaveDocument(ctx, tx, &r, r.Document.Revision); e != nil {
				return e
			}
		}
		predicate := query.And(CompatDocumentScope(CompatDocumentLeaseAuthority(l), l.DocumentID), query.Equal("fence", l.Token))
		if done {
			q, args, e := query.NewDeleteBuilder(s.store.Renderer(), CompatKnowledgeDocumentJobTable).Where(predicate).Build()
			return conversationExec(ctx, tx, q, args, e)
		}
		l.Owner = ""
		l.ExpiresAt = time.Time{}
		q, args, e := query.NewUpdateBuilder(s.store.Renderer(), CompatKnowledgeDocumentJobTable).Set("lease_until", 0).Set("not_before", in.RetryAt.UnixMilli()).Set("payload_json", conversationJSON(l)).Where(predicate).Build()
		return conversationCAS(ctx, tx, q, args, e)
	})
}
