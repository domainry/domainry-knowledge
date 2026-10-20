package store

import (
	"context"
	"database/sql"
	"time"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
	"github.com/domainry/domainry-orm/query"
)

const knowledgeDocumentUploadExpiryMaximumBatch = 500

// TouchKnowledgeDocumentUpload records durable activity only after storage has
// accepted a part. It deliberately has no caller-supplied revision: replayed
// parts are idempotent and must be able to renew the same upload concurrently.
func (s *Store) TouchKnowledgeDocumentUpload(ctx context.Context, id string, a agentsdk.Authority) (out persistence.KnowledgeDocumentRecord, err error) {
	if err = conversationAuthority(a); err != nil {
		return out, err
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		var e error
		out, e = s.documentRecord(ctx, tx, id, a)
		if e != nil {
			return e
		}
		if out.Document.State != "uploading" || out.BodyRef != "" || out.PutStarted {
			return conversationError("conflict", "document_state_conflict")
		}
		return s.saveDocumentRecord(ctx, tx, &out, out.Document.Revision)
	})
	return out, err
}

// ExpireKnowledgeDocumentUploads turns idle reservations into ordinary fenced
// deletion work. The existing worker then installs the storage deletion marker,
// removes staged parts and finally releases the library's document/byte quota.
func (s *Store) ExpireKnowledgeDocumentUploads(ctx context.Context, runtime string, before time.Time, limit int) (expired int, err error) {
	if !executionText(runtime, 255, true) || before.IsZero() || limit < 1 || limit > knowledgeDocumentUploadExpiryMaximumBatch {
		return 0, conversationError("bad_request", "document_upload_expiry_invalid")
	}
	cutoff := before.UTC().UnixMilli()
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		q, args, e := query.NewSelectBuilder(s.store.Renderer(), knowledgeDocumentTable).
			Columns("payload_json").
			Where(query.And(query.Equal("runtime_id", runtime), query.Equal("state", "uploading"), query.LessThanOrEqual("updated_at", cutoff))).
			OrderBy(query.Ascending("updated_at"), query.Ascending("scope_key"), query.Ascending("document_id")).
			Limit(limit).
			Build()
		if e != nil {
			return e
		}
		rows, e := tx.QueryContext(ctx, q, args...)
		if e != nil {
			return e
		}
		records := make([]persistence.KnowledgeDocumentRecord, 0, limit)
		for rows.Next() {
			var raw []byte
			var record persistence.KnowledgeDocumentRecord
			if e = rows.Scan(&raw); e != nil {
				break
			}
			if e = unmarshalDurableJSON(raw, &record); e != nil {
				break
			}
			records = append(records, record)
		}
		if e == nil {
			e = rows.Err()
		}
		if closeErr := rows.Close(); e == nil {
			e = closeErr
		}
		if e != nil {
			return e
		}
		for index := range records {
			record := &records[index]
			if record.Actor.RuntimeID != runtime || record.Document.State != "uploading" || record.BodyRef != "" || record.PutStarted || record.Document.UpdatedAt.After(before) {
				return conversationError("unavailable", "document_upload_expiry_state_invalid")
			}
			record.Document.State = "deleting"
			record.Document.ProcessingStage = "delete"
			record.Document.ErrorCode = "document_upload_expired"
			if e = s.saveDocumentRecord(ctx, tx, record, record.Document.Revision); e != nil {
				return e
			}
			if e = s.queueDocumentWork(ctx, tx, *record); e != nil {
				return e
			}
			expired++
		}
		return nil
	})
	return expired, err
}
