package store

import (
	"context"
	"database/sql"
	"regexp"
	"time"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
	"github.com/domainry/domainry-orm/query"
)

const knowledgeDocumentMaximumLease = 2 * time.Hour

var knowledgeErrorCodePattern = regexp.MustCompile(`^[a-z][a-z0-9_]{0,127}$`)

func documentLeaseAuthority(l persistence.KnowledgeDocumentLease) agentsdk.Authority {
	return agentsdk.Authority{Known: true, RuntimeID: l.RuntimeID, WorkspaceID: l.WorkspaceID, UserID: "_worker"}
}
func (s *Store) queueDocumentWork(ctx context.Context, tx *sql.Tx, r persistence.KnowledgeDocumentRecord) error {
	l := persistence.KnowledgeDocumentLease{RuntimeID: r.Actor.RuntimeID, WorkspaceID: r.Actor.WorkspaceID, LibraryID: r.Document.LibraryID, DocumentID: r.Document.ID}
	b := query.NewInsertBuilder(s.store.Renderer(), knowledgeDocumentJobTable).Columns("scope_key", "document_id", "runtime_id", "not_before", "lease_until", "fence", "payload_json").Values(libraryScope(r.Actor), r.Document.ID, r.Actor.RuntimeID, 0, 0, 0, conversationJSON(l))
	// Revocation wakes work but never resets an in-flight lease or its fence.
	b, e := s.store.Profile().ApplyUpsert(b, []string{"scope_key", "document_id"}, query.AssignExpression("not_before", query.InsertedValue("not_before")))
	if e != nil {
		return e
	}
	q, args, e := b.Build()
	return conversationExec(ctx, tx, q, args, e)
}
func (s *Store) ClaimKnowledgeDocumentWork(ctx context.Context, runtime, owner string, now time.Time, ttl time.Duration) (out persistence.KnowledgeDocumentLease, found bool, err error) {
	if !executionText(runtime, 255, true) || !personalMemoryKey(owner) || ttl < 100*time.Millisecond || ttl > knowledgeDocumentMaximumLease {
		return out, false, conversationError("bad_request", "document_lease_invalid")
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		out = persistence.KnowledgeDocumentLease{}
		found = false
		q, args, e := query.NewSelectBuilder(s.store.Renderer(), knowledgeDocumentJobTable).Columns("payload_json").Where(query.And(query.Equal("runtime_id", runtime), query.LessThanOrEqual("not_before", now.UnixMilli()), query.LessThanOrEqual("lease_until", now.UnixMilli()))).OrderBy(query.Ascending("not_before"), query.Ascending("scope_key"), query.Ascending("document_id")).Limit(1).Build()
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
		if e = unmarshalDurableJSON(raw, &out); e != nil {
			return e
		}
		if out.RuntimeID != runtime || !validKnowledgeDocumentID(out.DocumentID) || !validLibraryID(out.LibraryID) || conversationAuthority(documentLeaseAuthority(out)) != nil {
			return conversationError("unavailable", "document_lease_invalid")
		}
		prior := out.Token
		out.Token++
		out.Owner = owner
		out.ExpiresAt = now.UTC().Add(ttl).Truncate(time.Millisecond)
		q, args, e = query.NewUpdateBuilder(s.store.Renderer(), knowledgeDocumentJobTable).Set("fence", out.Token).Set("lease_until", out.ExpiresAt.UnixMilli()).Set("payload_json", conversationJSON(out)).Where(query.And(documentScope(documentLeaseAuthority(out), out.DocumentID), query.Equal("fence", prior), query.LessThanOrEqual("lease_until", now.UnixMilli()))).Build()
		if e = conversationCAS(ctx, tx, q, args, e); e != nil {
			return e
		}
		found = true
		return nil
	})
	return
}
func (s *Store) documentWork(ctx context.Context, db conversationDB, l persistence.KnowledgeDocumentLease) (out persistence.KnowledgeDocumentRecord, err error) {
	if l.Token < 1 || !personalMemoryKey(l.Owner) || !validKnowledgeDocumentID(l.DocumentID) || conversationAuthority(documentLeaseAuthority(l)) != nil {
		return out, conversationError("conflict", "document_lease_lost")
	}
	var current persistence.KnowledgeDocumentLease
	found, e := s.executionRead(ctx, db, knowledgeDocumentJobTable, documentScope(documentLeaseAuthority(l), l.DocumentID), &current)
	if e != nil {
		return out, e
	}
	if !found || current.Token != l.Token || current.Owner != l.Owner || current.RuntimeID != l.RuntimeID || current.LibraryID != l.LibraryID || !current.ExpiresAt.After(time.Now().UTC()) {
		return out, conversationError("conflict", "document_lease_lost")
	}
	out, e = s.documentRecord(ctx, db, l.DocumentID, documentLeaseAuthority(l))
	if e != nil {
		return out, e
	}
	if out.Actor.RuntimeID != l.RuntimeID || out.Actor.WorkspaceID != l.WorkspaceID || out.Document.LibraryID != l.LibraryID {
		return out, conversationError("unavailable", "document_lease_invalid")
	}
	return out, nil
}
func (s *Store) KnowledgeDocumentWorkRecord(ctx context.Context, l persistence.KnowledgeDocumentLease) (persistence.KnowledgeDocumentRecord, error) {
	return s.documentWork(ctx, s.store.Database(), l)
}

func knowledgeDocumentPutRequestID(r persistence.KnowledgeDocumentRecord) string {
	return "kput_" + conversationHash([]string{r.SourceID, r.RemoteID, r.RequestSHA256})
}
func (s *Store) StartKnowledgeDocumentScan(ctx context.Context, l persistence.KnowledgeDocumentLease) (out persistence.KnowledgeDocumentRecord, started bool, err error) {
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		started = false
		var e error
		out, e = s.documentWork(ctx, tx, l)
		if e != nil {
			return e
		}
		if out.SecurityScanCompleted || out.Document.State == "deleting" || out.Document.State == "deleted" {
			return nil
		}
		if out.BodyRef == "" || out.PutStarted || out.Document.SecurityStatus != "pending" && out.Document.SecurityStatus != "scanning" || out.Document.State != "quarantined" && out.Document.State != "scanning" {
			return conversationError("conflict", "document_state_conflict")
		}
		if !out.SecurityScanStarted || out.Document.State != "scanning" {
			out.SecurityScanStarted = true
			out.Document.State = "scanning"
			out.Document.ProcessingStage = "scan"
			out.Document.SecurityStatus = "scanning"
			out.Document.ErrorCode = ""
			if e = s.saveDocumentRecord(ctx, tx, &out, out.Document.Revision); e != nil {
				return e
			}
		}
		started = true
		return nil
	})
	return
}
func (s *Store) StartKnowledgeDocumentPut(ctx context.Context, l persistence.KnowledgeDocumentLease) (out persistence.KnowledgeDocumentRecord, started bool, err error) {
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		started = false
		var e error
		out, e = s.documentWork(ctx, tx, l)
		if e != nil {
			return e
		}
		if out.PutStarted || out.Document.State == "deleting" || out.Document.State == "deleted" {
			return nil
		}
		library, e := s.libraryRecord(ctx, tx, out.Document.LibraryID, out.Actor)
		if e != nil {
			return e
		}
		if e = requireDocumentWriting(library); e != nil {
			return e
		}
		if out.BodyRef == "" || !out.SecurityScanCompleted || out.Document.SecurityStatus != "clean" || out.Document.State != "queued" && out.Document.State != "failed" {
			return conversationError("conflict", "document_state_conflict")
		}
		if out.PutRequestID == "" {
			// Backfill old, unstarted public reservations in the same transaction
			// as the write marker. An already uncertain write is never replayed.
			out.PutRequestID = knowledgeDocumentPutRequestID(out)
		}
		out.PutStarted = true
		out.Document.State = "indexing"
		out.Document.ProcessingStage = "parse"
		out.Document.ErrorCode = ""
		if e = s.saveDocumentRecord(ctx, tx, &out, out.Document.Revision); e != nil {
			return e
		}
		started = true
		return nil
	})
	return
}

func (s *Store) StartKnowledgeDocumentReindexPut(ctx context.Context, l persistence.KnowledgeDocumentLease) (out persistence.KnowledgeDocumentRecord, started bool, err error) {
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		started = false
		var e error
		out, e = s.documentWork(ctx, tx, l)
		if e != nil {
			return e
		}
		if out.Reindex == nil || out.Reindex.PutStarted || out.Document.State != "ready" || out.Document.SecurityStatus != "clean" || out.BodyRef == "" || !out.IndexObserved || out.DeleteStarted || out.RetiredRemoteID != "" || out.Reindex.Generation != out.Document.IndexGeneration+1 || !executionText(out.Reindex.RemoteID, 96, true) || !personalMemoryKey(out.Reindex.PutRequestID) {
			return conversationError("conflict", "document_state_conflict")
		}
		out.Reindex.PutStarted = true
		out.Document.Reindexing = true
		out.Document.ProcessingStage = "index"
		out.Document.ErrorCode = ""
		if e = s.saveDocumentRecord(ctx, tx, &out, out.Document.Revision); e != nil {
			return e
		}
		started = true
		return nil
	})
	return
}

func (s *Store) StartKnowledgeDocumentRetiredDelete(ctx context.Context, l persistence.KnowledgeDocumentLease) (out persistence.KnowledgeDocumentRecord, started bool, err error) {
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		started = false
		var e error
		out, e = s.documentWork(ctx, tx, l)
		if e != nil {
			return e
		}
		if out.RetiredRemoteID == "" || out.RetiredDeleteStarted || out.Reindex != nil || !out.IndexObserved || out.Document.State != "ready" || out.DeleteStarted {
			return conversationError("conflict", "document_state_conflict")
		}
		out.RetiredDeleteStarted = true
		if e = s.saveDocumentRecord(ctx, tx, &out, out.Document.Revision); e != nil {
			return e
		}
		started = true
		return nil
	})
	return
}
func (s *Store) StartKnowledgeDocumentDelete(ctx context.Context, l persistence.KnowledgeDocumentLease) error {
	return s.transaction(ctx, func(tx *sql.Tx) error {
		r, e := s.documentWork(ctx, tx, l)
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
		return s.saveDocumentRecord(ctx, tx, &r, r.Document.Revision)
	})
}
func (s *Store) ApplyKnowledgeDocumentProgress(ctx context.Context, l persistence.KnowledgeDocumentLease, in persistence.KnowledgeDocumentProgress) error {
	if in.ErrorCode != "" && !knowledgeErrorCodePattern.MatchString(in.ErrorCode) || !executionText(in.IndexStatus, 64, false) || !executionText(in.SecurityScanner, 128, false) || in.SecurityReportSHA256 != "" && !validArtifactSHA(in.SecurityReportSHA256) {
		return conversationError("bad_request", "document_progress_invalid")
	}
	return s.transaction(ctx, func(tx *sql.Tx) error {
		r, e := s.documentWork(ctx, tx, l)
		if e != nil {
			return e
		}
		before := conversationHash(r)
		done := false
		switch in.Event {
		case "stored":
			if r.SourceID != "" || r.PutStarted || !r.SecurityScanCompleted || r.Document.SecurityStatus != "clean" || in.IndexStatus != "STORED" {
				return conversationError("conflict", "document_state_conflict")
			}
			r.Document.State = "ready"
			r.Document.ProcessingStage = "complete"
			r.Document.IndexStatus = in.IndexStatus
			r.Document.ErrorCode = ""
			done = true
		case "scan_clean":
			if !r.SecurityScanStarted || r.PutStarted || r.Document.SecurityStatus != "scanning" || !validArtifactSHA(in.SecurityReportSHA256) || in.SecurityScanner == "" {
				return conversationError("conflict", "document_state_conflict")
			}
			r.SecurityScanCompleted = true
			r.Document.SecurityStatus = "clean"
			r.Document.SecurityScanner = in.SecurityScanner
			r.Document.SecurityReportSHA256 = in.SecurityReportSHA256
			r.Document.State = "queued"
			r.Document.ProcessingStage = "parse"
			r.Document.ErrorCode = ""
		case "scan_rejected":
			if !r.SecurityScanStarted || r.PutStarted || r.Document.SecurityStatus != "scanning" || !validArtifactSHA(in.SecurityReportSHA256) || in.SecurityScanner == "" || in.ErrorCode == "" {
				return conversationError("conflict", "document_state_conflict")
			}
			r.SecurityScanCompleted = true
			r.Document.SecurityStatus = "rejected"
			r.Document.SecurityScanner = in.SecurityScanner
			r.Document.SecurityReportSHA256 = in.SecurityReportSHA256
			r.Document.State = "failed"
			r.Document.ProcessingStage = "failed"
			r.Document.ErrorCode = in.ErrorCode
			done = true
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
			r.Document.ProcessingStage = "parse"
		case "reindex_put_acknowledged":
			if r.Reindex == nil || !r.Reindex.PutStarted {
				return conversationError("conflict", "document_state_conflict")
			}
			r.Reindex.PutAcknowledged = true
			r.Document.Reindexing = true
			r.Document.ProcessingStage = "index"
			r.Document.ErrorCode = ""
		case "reindex_indexed":
			if r.Reindex == nil || !r.Reindex.PutStarted || !r.Reindex.PutAcknowledged || in.IndexStatus != "INDEXED" || r.RetiredRemoteID != "" {
				return conversationError("conflict", "document_state_conflict")
			}
			r.RetiredRemoteID = r.RemoteID
			r.RetiredDeleteStarted = false
			r.RetiredDeleteAcknowledged = false
			r.RemoteID = r.Reindex.RemoteID
			r.Document.IndexGeneration = r.Reindex.Generation
			r.Document.IndexStatus = in.IndexStatus
			r.Document.Reindexing = false
			r.Document.ProcessingStage = "complete"
			r.Document.ErrorCode = ""
			if r.Replacement != nil {
				r.PageProjection = &r.Replacement.PageProjection
				r.BodyRef = r.Replacement.BodyRef
				r.Document.Filename = r.Replacement.Filename
				r.Document.Bytes = r.Replacement.Bytes
				r.Document.SHA256 = r.Replacement.SHA256
				r.Document.ContentVersion = r.Replacement.ContentVersion
				r.Document.OriginPageID = r.Replacement.PageProjection.PageID
				r.Document.OriginPageVersion = r.Replacement.PageProjection.Version
				r.Replacement = nil
			}
			r.Reindex = nil
		case "retired_delete_acknowledged":
			if r.RetiredRemoteID == "" || !r.RetiredDeleteStarted {
				return conversationError("conflict", "document_state_conflict")
			}
			r.RetiredDeleteAcknowledged = true
			r.Document.ErrorCode = ""
		case "retired_deleted":
			if r.RetiredRemoteID == "" || !r.RetiredDeleteStarted || !r.RetiredDeleteAcknowledged {
				return conversationError("conflict", "document_state_conflict")
			}
			r.RetiredRemoteID = ""
			r.RetiredDeleteStarted = false
			r.RetiredDeleteAcknowledged = false
			r.Document.ErrorCode = ""
			done = r.Document.State == "ready"
		case "indexed":
			if !r.PutStarted || in.IndexStatus != "INDEXED" {
				return conversationError("conflict", "document_state_conflict")
			}
			r.IndexObserved = true
			r.Document.IndexStatus = in.IndexStatus
			r.Document.ErrorCode = ""
			if r.Document.State != "deleting" {
				r.Document.State = "ready"
				r.Document.ProcessingStage = "complete"
				done = true
			}
		case "retry":
			if r.Reindex == nil && r.RetiredRemoteID == "" {
				r.Document.IndexStatus = in.IndexStatus
			}
			r.Document.ErrorCode = in.ErrorCode
			if r.Document.State != "deleting" && r.Document.State != "deleted" {
				if r.Reindex != nil {
					r.Document.State = "ready"
					r.Document.Reindexing = true
					r.Document.ProcessingStage = "index"
				} else if r.RetiredRemoteID != "" {
					r.Document.State = "ready"
					r.Document.Reindexing = false
					r.Document.ProcessingStage = "complete"
				} else if r.SecurityScanStarted && !r.SecurityScanCompleted {
					r.Document.State = "scanning"
					r.Document.ProcessingStage = "scan"
				} else if !r.PutStarted {
					r.Document.State = "failed"
					r.Document.ProcessingStage = "failed"
				} else if !r.PutAcknowledged {
					r.Document.State = "needs_reconcile"
				} else {
					r.Document.State = "indexing"
					switch in.IndexStatus {
					case "CHUNKED":
						r.Document.ProcessingStage = "index"
					case "INDEXING":
						r.Document.ProcessingStage = "index"
					default:
						r.Document.ProcessingStage = "parse"
					}
				}
			}
		case "deleted":
			if r.Document.State != "deleting" || r.Reindex != nil || r.RetiredRemoteID != "" || r.PutStarted && (!r.IndexObserved || !r.DeleteStarted || r.AccessPolicySHA256 != "" && !r.DeleteAcknowledged) {
				return conversationError("conflict", "document_cleanup_unconfirmed")
			}
			r.Document.State = "deleted"
			r.Document.ProcessingStage = "delete"
			r.Document.ErrorCode = ""
			r.BodyRef = ""
			done = true
		default:
			return conversationError("bad_request", "document_progress_invalid")
		}
		if r.PageProjection != nil {
			page, pageErr := s.pageRecord(ctx, tx, r.Document.LibraryID, r.PageProjection.PageID, r.Actor)
			if pageErr != nil {
				return pageErr
			}
			if page.State == "archived" && r.Reindex == nil && r.RetiredRemoteID == "" && r.Document.State != "deleted" {
				r.Document.State = "deleting"
				r.Document.ProcessingStage = "delete"
				r.Document.ErrorCode = ""
				done = false
			} else if page.State == "active" && page.PublishedVersion == r.PageProjection.Version && r.Document.State == "ready" && r.Reindex == nil && r.RetiredRemoteID == "" {
				if e = s.setPageProjectionStatus(ctx, tx, page, "ready", r.PageProjection.AccessRevision, r.Actor); e != nil {
					return e
				}
			}
		}
		if before != conversationHash(r) {
			if e = s.saveDocumentRecord(ctx, tx, &r, r.Document.Revision); e != nil {
				return e
			}
		}
		predicate := query.And(documentScope(documentLeaseAuthority(l), l.DocumentID), query.Equal("fence", l.Token))
		if done {
			q, args, e := query.NewDeleteBuilder(s.store.Renderer(), knowledgeDocumentJobTable).Where(predicate).Build()
			return conversationExec(ctx, tx, q, args, e)
		}
		l.Owner = ""
		l.ExpiresAt = time.Time{}
		q, args, e := query.NewUpdateBuilder(s.store.Renderer(), knowledgeDocumentJobTable).Set("lease_until", 0).Set("not_before", in.RetryAt.UnixMilli()).Set("payload_json", conversationJSON(l)).Where(predicate).Build()
		return conversationCAS(ctx, tx, q, args, e)
	})
}
