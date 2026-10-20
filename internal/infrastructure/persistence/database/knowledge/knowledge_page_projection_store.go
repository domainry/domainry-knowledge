package store

import (
	"context"
	"database/sql"
	"time"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-orm/query"
)

func knowledgePageProjectionDocumentID(a agentsdk.ConversationAuthority, pageID string) string {
	return "kdoc_" + conversationHash([]string{libraryScope(a), pageID})[:32]
}

func (s *Store) ClaimKnowledgePageProjection(ctx context.Context, runtimeID, owner string, now time.Time, ttl time.Duration) (out knowledgesdk.KnowledgePageProjectionWork, found bool, err error) {
	if !executionText(runtimeID, 255, true) || !personalMemoryKey(owner) || ttl < 100*time.Millisecond || ttl > knowledgeDocumentMaximumLease {
		return out, false, conversationError("bad_request", "page_projection_lease_invalid")
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		q, args, buildErr := query.NewSelectBuilder(s.store.Renderer(), knowledgePageProjectionJobTable).Columns("payload_json").Where(query.And(query.Equal("runtime_id", runtimeID), query.LessThanOrEqual("not_before", now.UnixMilli()), query.LessThanOrEqual("lease_until", now.UnixMilli()))).OrderBy(query.Ascending("not_before"), query.Ascending("scope_key"), query.Ascending("page_id")).Limit(1).Build()
		if buildErr != nil {
			return buildErr
		}
		var raw []byte
		if scanErr := tx.QueryRowContext(ctx, q, args...).Scan(&raw); scanErr == sql.ErrNoRows {
			return nil
		} else if scanErr != nil {
			return scanErr
		}
		var job pageProjectionJob
		if decodeErr := unmarshalDurableJSON(raw, &job); decodeErr != nil {
			return decodeErr
		}
		if job.Actor.RuntimeID != runtimeID || conversationAuthority(job.Actor) != nil || !validKnowledgePageID(job.PageID) || !validLibraryID(job.LibraryID) || job.Version < 1 || job.AccessRevision < 1 {
			return conversationError("unavailable", "page_projection_lease_invalid")
		}
		page, readErr := s.pageRecord(ctx, tx, job.LibraryID, job.PageID, job.Actor)
		if readErr != nil {
			return readErr
		}
		if page.State != "active" || page.PublishedVersion != job.Version {
			deleteQuery, deleteArgs, deleteErr := query.NewDeleteBuilder(s.store.Renderer(), knowledgePageProjectionJobTable).Where(pageScope(job.Actor, job.PageID)).Build()
			return conversationExec(ctx, tx, deleteQuery, deleteArgs, deleteErr)
		}
		version, readErr := s.pageVersion(ctx, tx, job.PageID, job.Version, job.Actor)
		if readErr != nil || version.Body.ContentSHA256 != job.ContentSHA256 {
			if readErr != nil {
				return readErr
			}
			return conversationError("unavailable", "page_projection_version_invalid")
		}
		access, readErr := s.knowledgePageAccessPolicy(ctx, tx, job.LibraryID, job.PageID, job.Actor)
		if readErr != nil || access.Revision != job.AccessRevision || access.ProjectionStatus != "queued" {
			if readErr != nil {
				return readErr
			}
			return conversationError("conflict", "page_projection_access_stale")
		}
		permissionID := knowledgePagePermissionToken(job.Actor, job.PageID)
		priorFence := job.Fence
		job.Fence++
		job.LeaseUntil = now.UTC().Add(ttl).Truncate(time.Millisecond)
		lease := knowledgesdk.KnowledgePageProjectionLease{RuntimeID: runtimeID, WorkspaceID: job.Actor.WorkspaceID, LibraryID: job.LibraryID, PageID: job.PageID, Version: job.Version, AccessRevision: job.AccessRevision, PermissionID: permissionID, Owner: owner, Token: job.Fence, ExpiresAt: job.LeaseUntil, Actor: job.Actor}
		q, args, buildErr = query.NewUpdateBuilder(s.store.Renderer(), knowledgePageProjectionJobTable).Set("fence", job.Fence).Set("lease_until", job.LeaseUntil.UnixMilli()).Set("payload_json", conversationJSON(job)).Where(query.And(pageScope(job.Actor, job.PageID), query.Equal("fence", priorFence), query.LessThanOrEqual("lease_until", now.UnixMilli()))).Build()
		if casErr := conversationCAS(ctx, tx, q, args, buildErr); casErr != nil {
			return casErr
		}
		out = knowledgesdk.KnowledgePageProjectionWork{Lease: lease, Page: page, Version: version}
		found = true
		return nil
	})
	return out, found, err
}

func (s *Store) currentPageProjectionJob(ctx context.Context, tx *sql.Tx, lease knowledgesdk.KnowledgePageProjectionLease) (pageProjectionJob, error) {
	var job pageProjectionJob
	found, err := s.executionRead(ctx, tx, knowledgePageProjectionJobTable, pageScope(lease.Actor, lease.PageID), &job)
	if err != nil {
		return job, err
	}
	if !found || job.Fence != lease.Token || job.LeaseUntil != lease.ExpiresAt || job.PageID != lease.PageID || job.LibraryID != lease.LibraryID || job.Version != lease.Version || job.AccessRevision != lease.AccessRevision || job.Actor != lease.Actor || !job.LeaseUntil.After(time.Now().UTC()) {
		return job, conversationError("conflict", "page_projection_lease_lost")
	}
	return job, nil
}

func (s *Store) CompleteKnowledgePageProjection(ctx context.Context, lease knowledgesdk.KnowledgePageProjectionLease, bodyRef string, bytes int64, sha256, filename, accessPolicySHA256 string) error {
	if bodyRef == "" || bytes < 1 || bytes > knowledgePageMaximumBytes+1024 || !validArtifactSHA(sha256) || !executionText(filename, 255, true) || accessPolicySHA256 != "" && !validArtifactSHA(accessPolicySHA256) {
		return conversationError("bad_request", "page_projection_invalid")
	}
	return s.transaction(ctx, func(tx *sql.Tx) error {
		if _, err := s.currentPageProjectionJob(ctx, tx, lease); err != nil {
			return err
		}
		page, err := s.pageRecord(ctx, tx, lease.LibraryID, lease.PageID, lease.Actor)
		if err != nil {
			return err
		}
		if page.State != "active" || page.PublishedVersion != lease.Version {
			return conversationError("conflict", "page_projection_stale")
		}
		access, err := s.knowledgePageAccessPolicy(ctx, tx, lease.LibraryID, lease.PageID, lease.Actor)
		if err != nil {
			return err
		}
		expectedPermission := knowledgePagePermissionToken(lease.Actor, lease.PageID)
		if access.Revision != lease.AccessRevision || access.ProjectionStatus != "queued" || expectedPermission != lease.PermissionID {
			return conversationError("conflict", "page_projection_access_stale")
		}
		version, err := s.pageVersion(ctx, tx, lease.PageID, lease.Version, lease.Actor)
		if err != nil {
			return err
		}
		sourceID, err := s.documentLibrarySource(ctx, tx, lease.LibraryID, lease.Actor)
		if err != nil {
			return err
		}
		if sourceID == "" {
			return conversationError("unavailable", "document_management_unavailable")
		}
		documentID := knowledgePageProjectionDocumentID(lease.Actor, lease.PageID)
		origin := persistence.KnowledgePageProjectionOrigin{PageID: lease.PageID, Version: lease.Version, AccessRevision: lease.AccessRevision, PermissionID: lease.PermissionID}
		var record persistence.KnowledgeDocumentRecord
		found, err := s.executionRead(ctx, tx, knowledgeDocumentTable, documentScope(lease.Actor, documentID), &record)
		if err != nil {
			return err
		}
		now := time.Now().UTC().Truncate(time.Millisecond)
		if !found {
			remoteID := "dka_" + conversationHash([]any{sourceID, libraryScope(lease.Actor), lease.PageID, lease.Version, sha256})
			record = persistence.KnowledgeDocumentRecord{
				PageProjection: &origin,
				Document:       agentsdk.KnowledgeDocument{ID: documentID, LibraryID: lease.LibraryID, ProjectionKind: "page", OriginPageID: lease.PageID, OriginPageVersion: lease.Version, Filename: filename, ContentType: "text/markdown; charset=utf-8", Bytes: bytes, SHA256: sha256, ContentVersion: lease.Version, IndexGeneration: 1, CreatedByUserID: version.PublishedByUserID, State: "queued", ProcessingStage: "parse", SecurityStatus: "clean", SecurityScanner: "knowledge-page-schema", SecurityReportSHA256: sha256, Revision: 1, CreatedAt: now, UpdatedAt: now},
				Actor:          lease.Actor, RequestSHA256: conversationHash([]any{origin, sha256}), SourceID: sourceID, AccessPolicySHA256: accessPolicySHA256, RemoteID: remoteID, BodyRef: bodyRef, SecurityScanStarted: true, SecurityScanCompleted: true,
			}
			record.PutRequestID = knowledgeDocumentPutRequestID(record)
			q, args, buildErr := query.NewInsertBuilder(s.store.Renderer(), knowledgeDocumentTable).Columns("scope_key", "document_id", "runtime_id", "library_id", "projection_kind", "source_key", "remote_id", "state", "revision", "bytes", "updated_at", "payload_json").Values(libraryScope(lease.Actor), documentID, lease.RuntimeID, lease.LibraryID, "page", sourceID, remoteID, record.Document.State, 1, bytes, now.UnixMilli(), conversationJSON(record)).Build()
			if execErr := conversationExec(ctx, tx, q, args, buildErr); execErr != nil {
				return execErr
			}
		} else {
			if record.Document.ProjectionKind != "page" || record.PageProjection == nil || record.PageProjection.PageID != lease.PageID || record.SourceID != sourceID {
				return conversationError("conflict", "page_projection_identity_conflict")
			}
			if record.PageProjection.Version == lease.Version && record.PageProjection.AccessRevision == lease.AccessRevision && record.PageProjection.PermissionID == lease.PermissionID && record.Document.SHA256 == sha256 {
				// An acknowledgement may have been lost after the document intent
				// was committed. Treat the source-owned projection as idempotent.
			} else if record.Document.State == "deleted" {
				remoteID := "dka_" + conversationHash([]any{sourceID, libraryScope(lease.Actor), lease.PageID, lease.Version, sha256})
				revision := record.Document.Revision
				record.PageProjection, record.Replacement = &origin, nil
				record.Actor, record.BodyRef, record.RemoteID = lease.Actor, bodyRef, remoteID
				record.RequestSHA256 = conversationHash([]any{origin, sha256})
				record.PutRequestID = knowledgeDocumentPutRequestID(record)
				record.PutStarted, record.PutAcknowledged, record.IndexObserved, record.DeleteStarted, record.DeleteAcknowledged = false, false, false, false, false
				record.Reindex, record.RetiredRemoteID = nil, ""
				record.SecurityScanStarted, record.SecurityScanCompleted = true, true
				record.Document.Filename, record.Document.Bytes, record.Document.SHA256 = filename, bytes, sha256
				record.Document.ContentVersion, record.Document.OriginPageVersion = lease.Version, lease.Version
				record.Document.State, record.Document.ProcessingStage, record.Document.SecurityStatus = "queued", "parse", "clean"
				record.Document.SecurityScanner, record.Document.SecurityReportSHA256, record.Document.ErrorCode = "knowledge-page-schema", sha256, ""
				if err = s.saveDocumentRecord(ctx, tx, &record, revision); err != nil {
					return err
				}
			} else {
				if record.Document.State != "ready" || record.Reindex != nil || record.RetiredRemoteID != "" || record.DeleteStarted {
					return conversationError("conflict", "page_projection_busy")
				}
				record.Actor = lease.Actor
				record.Replacement = &persistence.KnowledgeDocumentReplacement{PageProjection: origin, Filename: filename, Bytes: bytes, SHA256: sha256, ContentVersion: lease.Version, BodyRef: bodyRef}
				generation := record.Document.IndexGeneration + 1
				remoteID := "dka_" + conversationHash([]any{sourceID, libraryScope(lease.Actor), lease.PageID, lease.Version, sha256})
				record.Reindex = &persistence.KnowledgeDocumentReindex{Generation: generation, RemoteID: remoteID, PutRequestID: "kput_" + conversationHash([]any{sourceID, remoteID, lease.Version, sha256})}
				record.Document.Reindexing = true
				if err = s.saveDocumentRecord(ctx, tx, &record, record.Document.Revision); err != nil {
					return err
				}
			}
		}
		if err = s.queueDocumentWork(ctx, tx, record); err != nil {
			return err
		}
		if err = s.setPageProjectionStatus(ctx, tx, page, "queued", lease.AccessRevision, lease.Actor); err != nil {
			return err
		}
		q, args, buildErr := query.NewDeleteBuilder(s.store.Renderer(), knowledgePageProjectionJobTable).Where(query.And(pageScope(lease.Actor, lease.PageID), query.Equal("fence", lease.Token))).Build()
		return conversationExec(ctx, tx, q, args, buildErr)
	})
}

func (s *Store) RetryKnowledgePageProjection(ctx context.Context, lease knowledgesdk.KnowledgePageProjectionLease, notBefore time.Time) error {
	return s.transaction(ctx, func(tx *sql.Tx) error {
		job, err := s.currentPageProjectionJob(ctx, tx, lease)
		if err != nil {
			return err
		}
		job.LeaseUntil = time.Time{}
		job.NotBefore = notBefore.UTC().Truncate(time.Millisecond)
		q, args, buildErr := query.NewUpdateBuilder(s.store.Renderer(), knowledgePageProjectionJobTable).Set("lease_until", 0).Set("not_before", job.NotBefore.UnixMilli()).Set("payload_json", conversationJSON(job)).Where(query.And(pageScope(lease.Actor, lease.PageID), query.Equal("fence", lease.Token))).Build()
		return conversationCAS(ctx, tx, q, args, buildErr)
	})
}

func (s *Store) setPageProjectionStatus(ctx context.Context, tx *sql.Tx, page knowledgesdk.KnowledgePage, status string, accessRevision int64, authority agentsdk.ConversationAuthority) error {
	access, err := s.knowledgePageAccessPolicy(ctx, tx, page.LibraryID, page.ID, authority)
	if err != nil {
		return err
	}
	if access.Revision != accessRevision {
		return nil
	}
	page.ProjectionStatus, page.AccessStatus, page.AccessRevision, page.AccessMode = status, status, access.Revision, access.Mode
	access.ProjectionStatus, access.UpdatedAt = status, time.Now().UTC().Truncate(time.Millisecond)
	q, args, err := query.NewUpdateBuilder(s.store.Renderer(), knowledgePageTable).Set("payload_json", conversationJSON(page)).Where(query.And(pageScope(authority, page.ID), query.Equal("published_version", page.PublishedVersion))).Build()
	if err = conversationExec(ctx, tx, q, args, err); err != nil {
		return err
	}
	q, args, err = query.NewUpdateBuilder(s.store.Renderer(), knowledgePageAccessTable).Set("projection_status", status).Set("updated_at", access.UpdatedAt.UnixMilli()).Set("payload_json", conversationJSON(access)).Where(query.And(pageScope(authority, page.ID), query.Equal("revision", accessRevision))).Build()
	return conversationCAS(ctx, tx, q, args, err)
}

func (s *Store) ValidateKnowledgePageProjection(ctx context.Context, origin persistence.KnowledgePageProjectionOrigin, libraryID string, authority agentsdk.ConversationAuthority) error {
	return s.transaction(ctx, func(tx *sql.Tx) error {
		if _, err := s.libraryRecord(ctx, tx, libraryID, authority); err != nil {
			return err
		}
		page, err := s.pageRecord(ctx, tx, libraryID, origin.PageID, authority)
		if err != nil {
			return err
		}
		access, accessErr := s.evaluateKnowledgePageAccess(ctx, tx, libraryID, origin.PageID, authority)
		if accessErr != nil || !access.Allowed {
			return conversationError("forbidden", "knowledge_access_denied")
		}
		policy, accessErr := s.knowledgePageAccessPolicy(ctx, tx, libraryID, origin.PageID, authority)
		if accessErr != nil || policy.ProjectionStatus != "ready" || page.AccessRevision != policy.Revision || page.AccessStatus != "ready" {
			return conversationError("forbidden", "knowledge_access_denied")
		}
		expectedPermissionID := knowledgePagePermissionToken(authority, origin.PageID)
		if origin.AccessRevision != policy.Revision || origin.PermissionID != expectedPermissionID {
			return conversationError("forbidden", "knowledge_access_denied")
		}
		if page.State != "active" || page.PublishedVersion != origin.Version || page.ProjectionStatus != "ready" {
			return conversationError("forbidden", "knowledge_access_denied")
		}
		_, err = s.pageVersion(ctx, tx, origin.PageID, origin.Version, authority)
		return err
	})
}

var _ knowledgesdk.KnowledgePageProjectionRepository = (*Store)(nil)
