package store

import (
	"context"
	"database/sql"
	"errors"
	"strings"
	"time"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
	"github.com/domainry/domainry-orm/query"
)

const (
	knowledgeLibraryMaximumDocuments = 1000
	knowledgeLibraryMaximumBytes     = int64(1 << 40) // 1 TiB aggregate; each immutable original is capped by the SDK contract.
)

func documentScope(a agentsdk.ConversationAuthority, id string) query.Predicate {
	return query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("document_id", id))
}
func knowledgeSourcePredicate(a agentsdk.ConversationAuthority, binding string) query.Predicate {
	return query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("binding_key", binding))
}
func (s *Store) knowledgeSourceClaimed(ctx context.Context, db conversationDB, source string) (bool, error) {
	q, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgeSourceTable).Projections(query.Project(query.CountAll())).Where(query.Equal("source_key", source)).Build()
	if err != nil {
		return false, err
	}
	var count int
	err = db.QueryRowContext(ctx, q, args...).Scan(&count)
	return count > 0, err
}
func validKnowledgeDocumentID(id string) bool {
	return strings.HasPrefix(id, "kdoc_") && len(id) == 37 && personalMemoryKey(id)
}
func requireDocumentWriting(l agentsdk.KnowledgeLibrary) error {
	if l.Archived {
		return conversationError("conflict", "library_archived")
	}
	if l.Role != "editor" && l.Role != "manager" {
		return conversationError("forbidden", "document_write_denied")
	}
	return nil
}
func (s *Store) ActivateKnowledgeDocumentSource(ctx context.Context, scope agentsdk.KnowledgeDocumentStorageScope, source string) error {
	a := agentsdk.ConversationAuthority{Known: true, RuntimeID: scope.RuntimeID, WorkspaceID: scope.WorkspaceID, UserID: "_host"}
	if conversationAuthority(a) != nil || !validLibraryID(scope.LibraryID) || !validArtifactSHA(source) {
		return conversationError("bad_request", "document_source_invalid")
	}
	return s.transaction(ctx, func(tx *sql.Tx) error {
		return s.activateDocumentSource(ctx, tx, scope, source)
	})
}
func (s *Store) activateDocumentSource(ctx context.Context, tx *sql.Tx, scope agentsdk.KnowledgeDocumentStorageScope, source string) error {
	a := agentsdk.ConversationAuthority{Known: true, RuntimeID: scope.RuntimeID, WorkspaceID: scope.WorkspaceID, UserID: "_host"}
	var library agentsdk.KnowledgeLibrary
	found, e := s.executionRead(ctx, tx, knowledgeLibraryTable, libraryPredicate(a, scope.LibraryID), &library)
	if e != nil {
		return e
	}
	if !found {
		return conversationError("not_found", "library_not_found")
	}
	prior, e := s.documentLibrarySource(ctx, tx, scope.LibraryID, a)
	if e != nil {
		return e
	}
	if prior != "" {
		if prior != source {
			return conversationError("conflict", "document_source_changed")
		}
		return nil
	}
	claimed, e := s.knowledgeSourceClaimed(ctx, tx, source)
	if e != nil {
		return e
	}
	if claimed {
		return conversationError("conflict", "document_source_already_bound")
	}
	q, args, e := query.NewInsertBuilder(s.store.Renderer(), knowledgeSourceTable).Columns("scope_key", "binding_key", "source_kind", "source_key", "payload_json").Values(libraryScope(a), scope.LibraryID, knowledgeDocumentSourceKind, source, "{}").Build()
	return conversationExec(ctx, tx, q, args, e)
}
func (s *Store) documentLibrarySource(ctx context.Context, db conversationDB, id string, a agentsdk.ConversationAuthority) (string, error) {
	q, args, e := query.NewSelectBuilder(s.store.Renderer(), knowledgeSourceTable).Columns("source_key").Where(knowledgeSourcePredicate(a, id)).Build()
	if e != nil {
		return "", e
	}
	var out string
	e = db.QueryRowContext(ctx, q, args...).Scan(&out)
	if errors.Is(e, sql.ErrNoRows) {
		return "", nil
	}
	return out, e
}
func (s *Store) KnowledgeDocumentLibrarySource(ctx context.Context, id string, a agentsdk.ConversationAuthority) (string, error) {
	if _, e := s.KnowledgeLibrary(ctx, id, a); e != nil {
		return "", e
	}
	return s.documentLibrarySource(ctx, s.store.Database(), id, a)
}
func (s *Store) KnowledgeSourceManaged(ctx context.Context, source string) (bool, error) {
	if !validArtifactSHA(source) {
		return false, conversationError("bad_request", "document_source_invalid")
	}
	return s.knowledgeSourceClaimed(ctx, s.store.Database(), source)
}
func (s *Store) documentRecord(ctx context.Context, db conversationDB, id string, a agentsdk.ConversationAuthority) (out persistence.KnowledgeDocumentRecord, err error) {
	if !validKnowledgeDocumentID(id) {
		return out, conversationError("bad_request", "document_invalid")
	}
	found, err := s.executionRead(ctx, db, knowledgeDocumentTable, documentScope(a, id), &out)
	if err == nil && !found {
		err = conversationError("not_found", "document_not_found")
	}
	return
}
func (s *Store) KnowledgeDocumentRecord(ctx context.Context, id string, a agentsdk.ConversationAuthority) (out persistence.KnowledgeDocumentRecord, err error) {
	if err = conversationAuthority(a); err != nil {
		return
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		var e error
		out, e = s.documentRecord(ctx, tx, id, a)
		if e != nil {
			return e
		}
		_, e = s.libraryRecord(ctx, tx, out.Document.LibraryID, a)
		return e
	})
	return
}
func (s *Store) KnowledgeDocumentByRemoteID(ctx context.Context, library, source, remote string, a agentsdk.ConversationAuthority) (out persistence.KnowledgeDocumentRecord, err error) {
	if !validArtifactSHA(source) || !executionText(remote, 96, true) {
		return out, conversationError("not_found", "document_not_found")
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		if _, e := s.libraryRecord(ctx, tx, library, a); e != nil {
			return e
		}
		found, e := s.executionRead(ctx, tx, knowledgeDocumentTable, query.And(libraryPredicate(a, library), query.Equal("source_key", source), query.Equal("remote_id", remote)), &out)
		if e == nil && !found {
			e = conversationError("not_found", "document_not_found")
		}
		return e
	})
	return
}
func (s *Store) saveDocumentRecord(ctx context.Context, tx *sql.Tx, r *persistence.KnowledgeDocumentRecord, expected int64) error {
	if expected < 1 || r.Document.Revision != expected {
		return conversationError("conflict", "revision_conflict")
	}
	r.Document.Revision++
	r.Document.UpdatedAt = time.Now().UTC().Truncate(time.Millisecond)
	q, args, e := query.NewUpdateBuilder(s.store.Renderer(), knowledgeDocumentTable).Set("remote_id", r.RemoteID).Set("projection_kind", r.Document.ProjectionKind).Set("state", r.Document.State).Set("revision", r.Document.Revision).Set("bytes", r.Document.Bytes).Set("updated_at", r.Document.UpdatedAt.UnixMilli()).Set("payload_json", conversationJSON(r)).Where(query.And(documentScope(r.Actor, r.Document.ID), query.Equal("revision", expected))).Build()
	if e = conversationCAS(ctx, tx, q, args, e); e != nil {
		return e
	}
	return nil
}

func validDocumentSourceAccess(source *agentsdk.KnowledgeDocumentSourceAccess) bool {
	return source == nil || personalMemoryKey(source.Namespace) && personalMemoryKey(source.ResourceType) &&
		executionText(source.ResourceID, 256, true) && source.ResourceID == strings.TrimSpace(source.ResourceID)
}

func cloneDocumentSourceAccess(source *agentsdk.KnowledgeDocumentSourceAccess) *agentsdk.KnowledgeDocumentSourceAccess {
	if source == nil {
		return nil
	}
	copy := *source
	return &copy
}

func (s *Store) ReserveKnowledgeDocument(ctx context.Context, in persistence.KnowledgeDocumentReserve, a agentsdk.ConversationAuthority) (out persistence.KnowledgeDocumentRecord, err error) {
	if err = conversationAuthority(a); err != nil {
		return
	}
	valid := validAttachmentReserve(persistence.ConversationAttachmentReserve{ClientID: in.ClientID, ConversationID: in.LibraryID, Filename: in.Filename, ContentType: in.ContentType, SHA256: in.SHA256, Bytes: in.Bytes})
	if in.AttachmentOrigin != nil && in.DocumentOrigin != nil || !valid || !validLibraryID(in.LibraryID) || !validArtifactSHA(in.SourceID) || in.AccessPolicySHA256 != "" && !validArtifactSHA(in.AccessPolicySHA256) || !validDocumentSourceAccess(in.SourceAccess) {
		return out, conversationError("bad_request", "document_invalid")
	}
	namespace := ""
	if in.AttachmentOrigin != nil {
		namespace = "conversation_attachment_import.v1"
	}
	if in.DocumentOrigin != nil {
		namespace = "knowledge_document_transfer.v1"
	}
	id := knowledgeDocumentReservationID(in.LibraryID, in.ClientID, namespace, a)
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		out = persistence.KnowledgeDocumentRecord{}
		library, e := s.libraryRecord(ctx, tx, in.LibraryID, a)
		if e != nil {
			return e
		}
		if e = requireDocumentWriting(library); e != nil {
			return e
		}
		source, e := s.documentLibrarySource(ctx, tx, in.LibraryID, a)
		if e != nil {
			return e
		}
		if source != in.SourceID {
			return conversationError("conflict", "document_source_changed")
		}
		found, e := s.executionRead(ctx, tx, knowledgeDocumentTable, documentScope(a, id), &out)
		if e != nil {
			return e
		}
		if found {
			if out.RequestSHA256 != conversationHash(in) {
				return conversationError("conflict", "idempotency_conflict")
			}
			return nil
		}
		if e = s.checkDocumentAttachmentOrigin(ctx, tx, in.AttachmentOrigin, agentsdk.KnowledgeDocument{Filename: in.Filename, ContentType: in.ContentType, Bytes: in.Bytes, SHA256: in.SHA256}, a); e != nil {
			return e
		}
		if _, e = s.checkKnowledgeDocumentOrigin(ctx, tx, in.DocumentOrigin, agentsdk.KnowledgeDocument{LibraryID: in.LibraryID, Filename: in.Filename, ContentType: in.ContentType, Bytes: in.Bytes, SHA256: in.SHA256}, a); e != nil {
			return e
		}
		q, args, e := query.NewSelectBuilder(s.store.Renderer(), knowledgeDocumentTable).Columns("bytes").Where(query.And(libraryPredicate(a, in.LibraryID), query.NotEqual("state", "deleted"))).Build()
		if e != nil {
			return e
		}
		rows, e := tx.QueryContext(ctx, q, args...)
		if e != nil {
			return e
		}
		count, total := 0, int64(0)
		for rows.Next() {
			var n int64
			if e = rows.Scan(&n); e != nil {
				break
			}
			count++
			total += n
		}
		if e == nil {
			e = rows.Err()
		}
		_ = rows.Close()
		if e != nil {
			return e
		}
		if count >= knowledgeLibraryMaximumDocuments || total > knowledgeLibraryMaximumBytes-in.Bytes {
			return conversationError("conflict", "document_storage_limit")
		}
		now := time.Now().UTC().Truncate(time.Millisecond)
		actor := agentsdk.ConversationAuthority{Known: true, RuntimeID: a.RuntimeID, WorkspaceID: a.WorkspaceID, UserID: a.UserID, RoleKey: a.RoleKey}
		out = persistence.KnowledgeDocumentRecord{AttachmentOrigin: in.AttachmentOrigin, DocumentOrigin: in.DocumentOrigin, Document: agentsdk.KnowledgeDocument{ID: id, LibraryID: in.LibraryID, ProjectionKind: "file", Filename: in.Filename, ContentType: in.ContentType, Bytes: in.Bytes, SHA256: in.SHA256, ContentVersion: 1, IndexGeneration: 1, CreatedByUserID: a.UserID, State: "uploading", ProcessingStage: "upload", SecurityStatus: "pending", Revision: 1, CreatedAt: now, UpdatedAt: now}, Actor: actor, RequestSHA256: conversationHash(in), SourceID: source, SourceAccess: cloneDocumentSourceAccess(in.SourceAccess), RemoteID: "dka_" + conversationHash([]string{source, libraryScope(a), id, in.SHA256})}
		out.AccessPolicySHA256 = in.AccessPolicySHA256
		out.PutRequestID = knowledgeDocumentPutRequestID(out)
		q, args, e = query.NewInsertBuilder(s.store.Renderer(), knowledgeDocumentTable).Columns("scope_key", "document_id", "runtime_id", "library_id", "projection_kind", "source_key", "remote_id", "state", "revision", "bytes", "updated_at", "payload_json").Values(libraryScope(a), id, a.RuntimeID, in.LibraryID, "file", source, out.RemoteID, out.Document.State, 1, in.Bytes, now.UnixMilli(), conversationJSON(out)).Build()
		return conversationExec(ctx, tx, q, args, e)
	})
	return
}
func (s *Store) CommitKnowledgeDocumentContent(ctx context.Context, id string, expected int64, ref string, a agentsdk.ConversationAuthority) (out persistence.KnowledgeDocumentRecord, err error) {
	if !executionText(ref, 1024, true) {
		return out, conversationError("bad_request", "document_reference_invalid")
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		var e error
		out, e = s.documentRecord(ctx, tx, id, a)
		if e != nil {
			return e
		}
		l, e := s.libraryRecord(ctx, tx, out.Document.LibraryID, a)
		if e != nil {
			return e
		}
		if e = requireDocumentWriting(l); e != nil {
			return e
		}
		if out.Document.State == "deleting" || out.Document.State == "deleted" {
			return conversationError("not_found", "document_not_found")
		}
		if out.BodyRef != "" {
			if out.BodyRef == ref {
				return nil
			}
			return conversationError("conflict", "document_content_conflict")
		}
		if out.Document.State != "uploading" {
			return conversationError("conflict", "document_state_conflict")
		}
		if e = s.checkDocumentAttachmentOrigin(ctx, tx, out.AttachmentOrigin, out.Document, a); e != nil {
			return e
		}
		transferSource, e := s.checkKnowledgeDocumentOrigin(ctx, tx, out.DocumentOrigin, out.Document, a)
		if e != nil {
			return e
		}
		if out.DocumentOrigin != nil && out.DocumentOrigin.Mode == "move" {
			if e = s.retireKnowledgeDocument(ctx, tx, &transferSource, out.DocumentOrigin.Revision); e != nil {
				return e
			}
		}
		out.BodyRef = ref
		out.Document.State = "quarantined"
		out.Document.ProcessingStage = "scan"
		if e = s.saveDocumentRecord(ctx, tx, &out, expected); e != nil {
			return e
		}
		return s.queueDocumentWork(ctx, tx, out)
	})
	return
}
func (s *Store) KnowledgeDocuments(ctx context.Context, library, after string, limit int, a agentsdk.ConversationAuthority) (out agentsdk.KnowledgeDocumentPage, err error) {
	if limit == 0 {
		limit = 20
	}
	if limit < 1 || limit > 50 || after != "" && !validKnowledgeDocumentID(after) {
		return out, conversationError("bad_request", "document_query_invalid")
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		out = agentsdk.KnowledgeDocumentPage{Items: []agentsdk.KnowledgeDocument{}, Complete: true}
		if _, e := s.libraryRecord(ctx, tx, library, a); e != nil {
			return e
		}
		q, args, e := query.NewSelectBuilder(s.store.Renderer(), knowledgeDocumentTable).Columns("payload_json").Where(query.And(libraryPredicate(a, library), query.Equal("projection_kind", "file"), query.GreaterThan("document_id", after), query.NotEqual("state", "deleted"))).OrderBy(query.Ascending("document_id")).Limit(limit + 1).Build()
		if e != nil {
			return e
		}
		rows, e := tx.QueryContext(ctx, q, args...)
		if e != nil {
			return e
		}
		defer rows.Close()
		for rows.Next() {
			var raw []byte
			var r persistence.KnowledgeDocumentRecord
			if e = rows.Scan(&raw); e != nil {
				return e
			}
			if e = unmarshalDurableJSON(raw, &r); e != nil {
				return e
			}
			out.Items = append(out.Items, r.Document)
		}
		if e = rows.Err(); e != nil {
			return e
		}
		if len(out.Items) > limit {
			out.Items = out.Items[:limit]
			out.Complete = false
			out.NextAfter = out.Items[limit-1].ID
		}
		return nil
	})
	return
}
func (s *Store) RequestKnowledgeDocumentDeletion(ctx context.Context, id string, expected int64, a agentsdk.ConversationAuthority) (out persistence.KnowledgeDocumentRecord, err error) {
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		var e error
		out, e = s.documentRecord(ctx, tx, id, a)
		if e != nil {
			return e
		}
		l, e := s.libraryRecord(ctx, tx, out.Document.LibraryID, a)
		if e != nil {
			return e
		}
		if l.Role != "editor" && l.Role != "manager" {
			return conversationError("forbidden", "document_write_denied")
		}
		return s.retireKnowledgeDocument(ctx, tx, &out, expected)
	})
	return
}

func (s *Store) RequestKnowledgeDocumentRetry(ctx context.Context, id string, expected int64, a agentsdk.ConversationAuthority) (out persistence.KnowledgeDocumentRecord, err error) {
	if expected < 1 {
		return out, conversationError("bad_request", "revision_required")
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		var e error
		out, e = s.documentRecord(ctx, tx, id, a)
		if e != nil {
			return e
		}
		library, e := s.libraryRecord(ctx, tx, out.Document.LibraryID, a)
		if e != nil {
			return e
		}
		if e = requireDocumentWriting(library); e != nil {
			return e
		}
		retryable := out.Document.State == "failed" || out.Document.State == "needs_reconcile" || out.Document.ErrorCode != ""
		if !retryable || out.Document.State == "deleting" || out.Document.State == "deleted" || out.IndexObserved && out.Reindex == nil && out.RetiredRemoteID == "" {
			return conversationError("conflict", "document_retry_not_available")
		}
		if out.Document.SecurityStatus == "rejected" {
			return conversationError("conflict", "document_security_rejected")
		}
		switch {
		case out.Reindex != nil:
			out.Document.State = "ready"
			out.Document.Reindexing = true
			out.Document.ProcessingStage = "index"
		case out.RetiredRemoteID != "":
			out.Document.State = "ready"
			out.Document.Reindexing = false
			out.Document.ProcessingStage = "complete"
		case !out.SecurityScanCompleted:
			if out.BodyRef == "" || out.PutStarted {
				return conversationError("conflict", "document_state_conflict")
			}
			out.SecurityScanStarted = false
			out.Document.State = "quarantined"
			out.Document.ProcessingStage = "scan"
			out.Document.SecurityStatus = "pending"
			out.Document.SecurityScanner = ""
			out.Document.SecurityReportSHA256 = ""
		case !out.PutStarted:
			if out.BodyRef == "" || out.Document.SecurityStatus != "clean" {
				return conversationError("conflict", "document_state_conflict")
			}
			out.Document.State = "queued"
			out.Document.ProcessingStage = "parse"
		case !out.PutAcknowledged:
			out.Document.State = "needs_reconcile"
			out.Document.ProcessingStage = "parse"
		default:
			out.Document.State = "indexing"
			out.Document.ProcessingStage = "parse"
			if out.Document.IndexStatus == "CHUNKED" || out.Document.IndexStatus == "INDEXING" {
				out.Document.ProcessingStage = "index"
			}
		}
		out.Document.ErrorCode = ""
		if e = s.saveDocumentRecord(ctx, tx, &out, expected); e != nil {
			return e
		}
		return s.queueDocumentWork(ctx, tx, out)
	})
	return
}

func (s *Store) RequestKnowledgeDocumentReindex(ctx context.Context, id string, expected int64, a agentsdk.ConversationAuthority) (out persistence.KnowledgeDocumentRecord, err error) {
	if expected < 1 {
		return out, conversationError("bad_request", "revision_required")
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		var e error
		out, e = s.documentRecord(ctx, tx, id, a)
		if e != nil {
			return e
		}
		library, e := s.libraryRecord(ctx, tx, out.Document.LibraryID, a)
		if e != nil {
			return e
		}
		if e = requireDocumentWriting(library); e != nil {
			return e
		}
		if out.Document.Revision != expected {
			return conversationError("conflict", "revision_conflict")
		}
		if out.Document.State != "ready" || out.Document.SecurityStatus != "clean" || out.BodyRef == "" || !out.PutStarted || !out.PutAcknowledged || !out.IndexObserved || out.DeleteStarted || out.Reindex != nil || out.RetiredRemoteID != "" || out.Document.IndexGeneration < 1 {
			return conversationError("conflict", "document_reindex_not_available")
		}
		generation := out.Document.IndexGeneration + 1
		remote := "dka_" + conversationHash([]any{"knowledge_document_reindex.v1", out.SourceID, libraryScope(a), out.Document.ID, out.Document.SHA256, generation})
		out.Reindex = &persistence.KnowledgeDocumentReindex{Generation: generation, RemoteID: remote, PutRequestID: "kput_" + conversationHash([]any{out.SourceID, remote, out.RequestSHA256, generation})}
		out.Document.Reindexing = true
		out.Document.ProcessingStage = "index"
		out.Document.ErrorCode = ""
		if e = s.saveDocumentRecord(ctx, tx, &out, expected); e != nil {
			return e
		}
		return s.queueDocumentWork(ctx, tx, out)
	})
	return
}

var _ persistence.KnowledgeDocumentRepository = (*Store)(nil)
var _ persistence.KnowledgeDocumentRetryRepository = (*Store)(nil)
var _ persistence.KnowledgeDocumentReindexRepository = (*Store)(nil)
