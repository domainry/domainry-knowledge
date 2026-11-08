package store

import (
	"database/sql"
	"fmt"
	"testing"
	"time"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-orm/query"
)

func orderPageProjectionJob(t *testing.T, store *Store, pageID string, authority knowledgesdk.Authority, notBefore time.Time) {
	t.Helper()
	notBefore = notBefore.UTC().Truncate(time.Millisecond)
	if err := store.transaction(t.Context(), func(tx *sql.Tx) error {
		var job pageProjectionJob
		found, err := store.executionRead(t.Context(), tx, knowledgePageProjectionJobTable, pageScope(authority, pageID), &job)
		if err != nil {
			return err
		}
		if !found {
			return fmt.Errorf("projection job for page %s was not found", pageID)
		}
		job.NotBefore = notBefore
		q, args, buildErr := query.NewUpdateBuilder(store.store.Renderer(), knowledgePageProjectionJobTable).
			Set("not_before", notBefore.UnixMilli()).
			Set("payload_json", conversationJSON(job)).
			Where(pageScope(authority, pageID)).Build()
		return conversationCAS(t.Context(), tx, q, args, buildErr)
	}); err != nil {
		t.Fatal(err)
	}
}

func setPageProjectionJobAccessRevision(t *testing.T, store *Store, pageID string, authority knowledgesdk.Authority, accessRevision int64) {
	t.Helper()
	if err := store.transaction(t.Context(), func(tx *sql.Tx) error {
		var job pageProjectionJob
		found, err := store.executionRead(t.Context(), tx, knowledgePageProjectionJobTable, pageScope(authority, pageID), &job)
		if err != nil {
			return err
		}
		if !found {
			return fmt.Errorf("projection job for page %s was not found", pageID)
		}
		job.AccessRevision = accessRevision
		q, args, buildErr := query.NewUpdateBuilder(store.store.Renderer(), knowledgePageProjectionJobTable).
			Set("payload_json", conversationJSON(job)).
			Where(pageScope(authority, pageID)).Build()
		return conversationCAS(t.Context(), tx, q, args, buildErr)
	}); err != nil {
		t.Fatal(err)
	}
}

func TestClaimKnowledgePageProjectionRequeuesReadyDurableJob(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	page = savePageFixture(t, store, authority, library, page, "ready-body", "待重新投影页面", "待重新投影正文")
	page = publishPageFixture(t, store, authority, library, page, "ready-publish")
	markPageProjectionReady(t, store, library.ID, page.Page.ID, authority)

	now := time.Now().UTC().Add(time.Second).Truncate(time.Millisecond)
	work, found, err := store.ClaimKnowledgePageProjection(t.Context(), authority.RuntimeID, "ready-requeue-worker", now, time.Minute)
	if err != nil || !found {
		t.Fatalf("ready durable projection was not claimable: found=%t err=%v", found, err)
	}
	if work.Page.ID != page.Page.ID {
		t.Fatalf("claimed page %s, want %s", work.Page.ID, page.Page.ID)
	}
	if work.Page.ProjectionStatus != "queued" || work.Page.AccessStatus != "queued" {
		t.Fatalf("claimed page was not requeued: %+v", work.Page)
	}

	projected, err := store.KnowledgePage(t.Context(), library.ID, page.Page.ID, true, authority)
	if err != nil {
		t.Fatal(err)
	}
	if projected.Page.ProjectionStatus != "queued" || projected.Page.AccessStatus != "queued" {
		t.Fatalf("persisted page was not requeued: %+v", projected.Page)
	}
	access, err := store.KnowledgePageAccess(t.Context(), library.ID, page.Page.ID, authority)
	if err != nil {
		t.Fatal(err)
	}
	if access.ProjectionStatus != "queued" {
		t.Fatalf("persisted access was not requeued: %+v", access)
	}

	var claimed pageProjectionJob
	claimedFound, err := store.executionRead(t.Context(), store.store.Database(), knowledgePageProjectionJobTable, pageScope(authority, page.Page.ID), &claimed)
	if err != nil {
		t.Fatal(err)
	}
	if !claimedFound || claimed.Fence != work.Lease.Token || claimed.LeaseUntil != work.Lease.ExpiresAt {
		t.Fatalf("ready job lease was not preserved: found=%t job=%+v lease=%+v", claimedFound, claimed, work.Lease)
	}
}

func TestClaimKnowledgePageProjectionSkipsSupersededAccessRevision(t *testing.T) {
	store, authority, library, superseded := pageFixture(t)
	superseded = savePageFixture(t, store, authority, library, superseded, "superseded-body", "过期权限页面", "过期权限正文")
	superseded = publishPageFixture(t, store, authority, library, superseded, "superseded-publish")
	setPageAccessFixture(t, store, library.ID, superseded.Page.ID, "superseded-access", 1, knowledgesdk.KnowledgePageAccessInherit, nil, authority)
	setPageProjectionJobAccessRevision(t, store, superseded.Page.ID, authority, 1)

	pending, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{
		ClientID: "pending-create", Title: "待投影页面", ContentType: knowledgesdk.KnowledgePageTypeDocument,
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	pending = savePageFixture(t, store, authority, library, pending, "pending-body", "待投影页面", "待投影正文")
	pending = publishPageFixture(t, store, authority, library, pending, "pending-publish")

	base := time.Now().UTC().Add(-time.Minute).Truncate(time.Millisecond)
	orderPageProjectionJob(t, store, superseded.Page.ID, authority, base)
	orderPageProjectionJob(t, store, pending.Page.ID, authority, base.Add(time.Second))

	work, found, err := store.ClaimKnowledgePageProjection(t.Context(), authority.RuntimeID, "head-skip-worker", base.Add(2*time.Second), time.Minute)
	if err != nil || !found {
		t.Fatalf("pending projection behind completed head was not claimable: found=%t err=%v", found, err)
	}
	if work.Page.ID != pending.Page.ID {
		t.Fatalf("claimed page %s, want pending page %s", work.Page.ID, pending.Page.ID)
	}

	var stale pageProjectionJob
	staleFound, err := store.executionRead(t.Context(), store.store.Database(), knowledgePageProjectionJobTable, pageScope(authority, superseded.Page.ID), &stale)
	if err != nil {
		t.Fatal(err)
	}
	if staleFound {
		t.Fatalf("superseded head job was not discarded: %+v", stale)
	}

	var claimed pageProjectionJob
	claimedFound, err := store.executionRead(t.Context(), store.store.Database(), knowledgePageProjectionJobTable, pageScope(authority, pending.Page.ID), &claimed)
	if err != nil {
		t.Fatal(err)
	}
	if !claimedFound || claimed.Fence != work.Lease.Token || claimed.LeaseUntil != work.Lease.ExpiresAt {
		t.Fatalf("pending job lease was not preserved: found=%t job=%+v lease=%+v", claimedFound, claimed, work.Lease)
	}
}
