package store

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"strings"
	"time"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
	"github.com/domainry/domainry-orm/query"
)

func CompatDocumentScope(a agentsdk.ConversationAuthority, id string) query.Predicate {
	return query.And(query.Equal("scope_key", CompatLibraryScope(a)), query.Equal("document_id", id))
}
func CompatValidKnowledgeDocumentID(id string) bool {
	return strings.HasPrefix(id, "kdoc_") && len(id) == 37 && personalMemoryKey(id)
}
func CompatDocumentWriting(l agentsdk.KnowledgeLibrary) error {
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
	if conversationAuthority(a) != nil || !CompatValidLibraryID(scope.LibraryID) || !CompatArtifactSHA(source) {
		return conversationError("bad_request", "document_source_invalid")
	}
	return s.transaction(ctx, func(tx *sql.Tx) error {
		return s.CompatActivateDocumentSource(ctx, tx, scope, source)
	})
}
func (s *Store) CompatActivateDocumentSource(ctx context.Context, tx *sql.Tx, scope agentsdk.KnowledgeDocumentStorageScope, source string) error {
	a := agentsdk.ConversationAuthority{Known: true, RuntimeID: scope.RuntimeID, WorkspaceID: scope.WorkspaceID, UserID: "_host"}
	attachmentOwner, err := s.CompatAttachmentKnowledgeSourceOwner(ctx, tx, source)
	if err != nil {
		return err
	}
	if attachmentOwner != "" {
		return conversationError("conflict", "document_source_already_bound")
	}
	var library agentsdk.KnowledgeLibrary
	found, e := s.executionRead(ctx, tx, CompatLibraryTable, CompatLibraryPredicate(a, scope.LibraryID), &library)
	if e != nil {
		return e
	}
	if !found {
		return conversationError("not_found", "library_not_found")
	}
	prior, e := s.CompatDocumentLibrarySource(ctx, tx, scope.LibraryID, a)
	if e != nil {
		return e
	}
	if prior != "" {
		if prior != source {
			return conversationError("conflict", "document_source_changed")
		}
		return nil
	}
	q, args, e := query.NewSelectBuilder(s.store.Renderer(), CompatKnowledgeDocumentSourceTable).Projections(query.Project(query.CountAll())).Where(query.Equal("source_key", source)).Build()
	if e != nil {
		return e
	}
	var count int
	if e = tx.QueryRowContext(ctx, q, args...).Scan(&count); e != nil {
		return e
	}
	if count > 0 {
		return conversationError("conflict", "document_source_already_bound")
	}
	q, args, e = query.NewInsertBuilder(s.store.Renderer(), CompatKnowledgeDocumentSourceTable).Columns("scope_key", "library_id", "source_key").Values(CompatLibraryScope(a), scope.LibraryID, source).Build()
	return conversationExec(ctx, tx, q, args, e)
}
func (s *Store) CompatDocumentLibrarySource(ctx context.Context, db conversationDB, id string, a agentsdk.ConversationAuthority) (string, error) {
	q, args, e := query.NewSelectBuilder(s.store.Renderer(), CompatKnowledgeDocumentSourceTable).Columns("source_key").Where(CompatLibraryPredicate(a, id)).Build()
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
	return s.CompatDocumentLibrarySource(ctx, s.store.Database(), id, a)
}
func (s *Store) KnowledgeSourceManaged(ctx context.Context, source string) (bool, error) {
	if !CompatArtifactSHA(source) {
		return false, conversationError("bad_request", "document_source_invalid")
	}
	q, args, e := query.NewSelectBuilder(s.store.Renderer(), CompatKnowledgeDocumentSourceTable).Projections(query.Project(query.CountAll())).Where(query.Equal("source_key", source)).Build()
	if e != nil {
		return false, e
	}
	var count int
	e = s.store.Database().QueryRowContext(ctx, q, args...).Scan(&count)
	if e != nil || count > 0 {
		return count > 0, e
	}
	owner, e := s.CompatAttachmentKnowledgeSourceOwner(ctx, s.store.Database(), source)
	return owner != "", e
}
func (s *Store) CompatDocument(ctx context.Context, db conversationDB, id string, a agentsdk.ConversationAuthority) (out persistence.KnowledgeDocumentRecord, err error) {
	if !CompatValidKnowledgeDocumentID(id) {
		return out, conversationError("bad_request", "document_invalid")
	}
	found, err := s.executionRead(ctx, db, CompatKnowledgeDocumentTable, CompatDocumentScope(a, id), &out)
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
		out, e = s.CompatDocument(ctx, tx, id, a)
		if e != nil {
			return e
		}
		_, e = s.CompatLibrary(ctx, tx, out.Document.LibraryID, a)
		return e
	})
	return
}
func (s *Store) KnowledgeDocumentByRemoteID(ctx context.Context, library, source, remote string, a agentsdk.ConversationAuthority) (out persistence.KnowledgeDocumentRecord, err error) {
	if !CompatArtifactSHA(source) || !executionText(remote, 96, true) {
		return out, conversationError("not_found", "document_not_found")
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		if _, e := s.CompatLibrary(ctx, tx, library, a); e != nil {
			return e
		}
		found, e := s.executionRead(ctx, tx, CompatKnowledgeDocumentTable, query.And(CompatLibraryPredicate(a, library), query.Equal("source_key", source), query.Equal("remote_id", remote)), &out)
		if e == nil && !found {
			e = conversationError("not_found", "document_not_found")
		}
		return e
	})
	return
}
func (s *Store) CompatSaveDocument(ctx context.Context, tx *sql.Tx, r *persistence.KnowledgeDocumentRecord, expected int64) error {
	if expected < 1 || r.Document.Revision != expected {
		return conversationError("conflict", "revision_conflict")
	}
	r.Document.Revision++
	r.Document.UpdatedAt = time.Now().UTC().Truncate(time.Millisecond)
	q, args, e := query.NewUpdateBuilder(s.store.Renderer(), CompatKnowledgeDocumentTable).Set("state", r.Document.State).Set("revision", r.Document.Revision).Set("payload_json", conversationJSON(r)).Where(query.And(CompatDocumentScope(r.Actor, r.Document.ID), query.Equal("revision", expected))).Build()
	if e = conversationCAS(ctx, tx, q, args, e); e != nil {
		return e
	}
	return nil
}
func (s *Store) ReserveKnowledgeDocument(ctx context.Context, in persistence.KnowledgeDocumentReserve, a agentsdk.ConversationAuthority) (out persistence.KnowledgeDocumentRecord, err error) {
	if err = conversationAuthority(a); err != nil {
		return
	}
	valid := CompatValidAttachmentReserve(persistence.ConversationAttachmentReserve{ClientID: in.ClientID, ConversationID: in.LibraryID, Filename: in.Filename, ContentType: in.ContentType, SHA256: in.SHA256, Bytes: in.Bytes})
	if in.AttachmentOrigin != nil && in.DocumentOrigin != nil || !valid || !CompatValidLibraryID(in.LibraryID) || !CompatArtifactSHA(in.SourceID) || in.AccessPolicySHA256 != "" && !CompatArtifactSHA(in.AccessPolicySHA256) {
		return out, conversationError("bad_request", "document_invalid")
	}
	namespace := ""
	if in.AttachmentOrigin != nil {
		namespace = "conversation_attachment_import.v1"
	}
	if in.DocumentOrigin != nil {
		namespace = "knowledge_document_transfer.v1"
	}
	id := CompatKnowledgeDocumentReservationID(in.LibraryID, in.ClientID, namespace, a)
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		out = persistence.KnowledgeDocumentRecord{}
		library, e := s.CompatLibrary(ctx, tx, in.LibraryID, a)
		if e != nil {
			return e
		}
		if e = CompatDocumentWriting(library); e != nil {
			return e
		}
		source, e := s.CompatDocumentLibrarySource(ctx, tx, in.LibraryID, a)
		if e != nil {
			return e
		}
		if source != in.SourceID {
			return conversationError("conflict", "document_source_changed")
		}
		found, e := s.executionRead(ctx, tx, CompatKnowledgeDocumentTable, CompatDocumentScope(a, id), &out)
		if e != nil {
			return e
		}
		if found {
			if out.RequestSHA256 != conversationHash(in) {
				return conversationError("conflict", "idempotency_conflict")
			}
			return nil
		}
		if e = s.CompatCheckDocumentAttachmentOrigin(ctx, tx, in.AttachmentOrigin, agentsdk.KnowledgeDocument{Filename: in.Filename, ContentType: in.ContentType, Bytes: in.Bytes, SHA256: in.SHA256}, a); e != nil {
			return e
		}
		if _, e = s.CompatCheckKnowledgeDocumentOrigin(ctx, tx, in.DocumentOrigin, agentsdk.KnowledgeDocument{LibraryID: in.LibraryID, Filename: in.Filename, ContentType: in.ContentType, Bytes: in.Bytes, SHA256: in.SHA256}, a); e != nil {
			return e
		}
		q, args, e := query.NewSelectBuilder(s.store.Renderer(), CompatKnowledgeDocumentTable).Columns("bytes").Where(query.And(CompatLibraryPredicate(a, in.LibraryID), query.NotEqual("state", "deleted"))).Build()
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
		if count >= 1000 || total+in.Bytes > 256<<20 {
			return conversationError("conflict", "document_storage_limit")
		}
		now := time.Now().UTC().Truncate(time.Millisecond)
		actor := agentsdk.ConversationAuthority{Known: true, RuntimeID: a.RuntimeID, WorkspaceID: a.WorkspaceID, UserID: a.UserID, RoleKey: a.RoleKey}
		out = persistence.KnowledgeDocumentRecord{AttachmentOrigin: in.AttachmentOrigin, DocumentOrigin: in.DocumentOrigin, Document: agentsdk.KnowledgeDocument{ID: id, LibraryID: in.LibraryID, Filename: in.Filename, ContentType: in.ContentType, Bytes: in.Bytes, SHA256: in.SHA256, CreatedByUserID: a.UserID, State: "uploading", Revision: 1, CreatedAt: now, UpdatedAt: now}, Actor: actor, RequestSHA256: conversationHash(in), SourceID: source, RemoteID: "dka_" + conversationHash([]string{source, CompatLibraryScope(a), id, in.SHA256})}
		out.AccessPolicySHA256 = in.AccessPolicySHA256
		out.PutRequestID = CompatKnowledgeDocumentPutRequestID(out)
		q, args, e = query.NewInsertBuilder(s.store.Renderer(), CompatKnowledgeDocumentTable).Columns("scope_key", "document_id", "library_id", "source_key", "remote_id", "state", "revision", "bytes", "payload_json").Values(CompatLibraryScope(a), id, in.LibraryID, source, out.RemoteID, out.Document.State, 1, in.Bytes, conversationJSON(out)).Build()
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
		out, e = s.CompatDocument(ctx, tx, id, a)
		if e != nil {
			return e
		}
		l, e := s.CompatLibrary(ctx, tx, out.Document.LibraryID, a)
		if e != nil {
			return e
		}
		if e = CompatDocumentWriting(l); e != nil {
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
		if e = s.CompatCheckDocumentAttachmentOrigin(ctx, tx, out.AttachmentOrigin, out.Document, a); e != nil {
			return e
		}
		transferSource, e := s.CompatCheckKnowledgeDocumentOrigin(ctx, tx, out.DocumentOrigin, out.Document, a)
		if e != nil {
			return e
		}
		if out.DocumentOrigin != nil && out.DocumentOrigin.Mode == "move" {
			if e = s.CompatRetireKnowledgeDocument(ctx, tx, &transferSource, out.DocumentOrigin.Revision); e != nil {
				return e
			}
		}
		out.BodyRef = ref
		out.Document.State = "queued"
		if e = s.CompatSaveDocument(ctx, tx, &out, expected); e != nil {
			return e
		}
		return s.CompatQueueDocumentWork(ctx, tx, out)
	})
	return
}
func (s *Store) KnowledgeDocuments(ctx context.Context, library, after string, limit int, a agentsdk.ConversationAuthority) (out agentsdk.KnowledgeDocumentPage, err error) {
	if limit == 0 {
		limit = 20
	}
	if limit < 1 || limit > 50 || after != "" && !CompatValidKnowledgeDocumentID(after) {
		return out, conversationError("bad_request", "document_query_invalid")
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		out = agentsdk.KnowledgeDocumentPage{Items: []agentsdk.KnowledgeDocument{}, Complete: true}
		if _, e := s.CompatLibrary(ctx, tx, library, a); e != nil {
			return e
		}
		q, args, e := query.NewSelectBuilder(s.store.Renderer(), CompatKnowledgeDocumentTable).Columns("payload_json").Where(query.And(CompatLibraryPredicate(a, library), query.GreaterThan("document_id", after), query.NotEqual("state", "deleted"))).OrderBy(query.Ascending("document_id")).Limit(limit + 1).Build()
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
			if e = json.Unmarshal(raw, &r); e != nil {
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
		out, e = s.CompatDocument(ctx, tx, id, a)
		if e != nil {
			return e
		}
		l, e := s.CompatLibrary(ctx, tx, out.Document.LibraryID, a)
		if e != nil {
			return e
		}
		if l.Role != "editor" && l.Role != "manager" {
			return conversationError("forbidden", "document_write_denied")
		}
		return s.CompatRetireKnowledgeDocument(ctx, tx, &out, expected)
	})
	return
}

var _ persistence.KnowledgeDocumentRepository = (*Store)(nil)
