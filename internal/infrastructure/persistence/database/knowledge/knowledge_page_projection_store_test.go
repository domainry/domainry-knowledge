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

func TestClaimKnowledgePageProjectionSkipsCompletedHeadJob(t *testing.T) {
	store, authority, library, completed := pageFixture(t)
	completed = savePageFixture(t, store, authority, library, completed, "completed-body", "已完成页面", "已完成正文")
	completed = publishPageFixture(t, store, authority, library, completed, "completed-publish")

	pending, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{
		ClientID: "pending-create", Title: "待投影页面", ContentType: knowledgesdk.KnowledgePageTypeDocument,
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	pending = savePageFixture(t, store, authority, library, pending, "pending-body", "待投影页面", "待投影正文")
	pending = publishPageFixture(t, store, authority, library, pending, "pending-publish")

	// Reproduce an acknowledgement gap: the access projection is already ready,
	// but its durable queue row was not removed. Put that stale row at the head so
	// it must not block the still-pending page behind it.
	markPageProjectionReady(t, store, library.ID, completed.Page.ID, authority)
	base := time.Now().UTC().Add(-time.Minute).Truncate(time.Millisecond)
	orderPageProjectionJob(t, store, completed.Page.ID, authority, base)
	orderPageProjectionJob(t, store, pending.Page.ID, authority, base.Add(time.Second))

	work, found, err := store.ClaimKnowledgePageProjection(t.Context(), authority.RuntimeID, "head-skip-worker", base.Add(2*time.Second), time.Minute)
	if err != nil || !found {
		t.Fatalf("pending projection behind completed head was not claimable: found=%t err=%v", found, err)
	}
	if work.Page.ID != pending.Page.ID {
		t.Fatalf("claimed page %s, want pending page %s", work.Page.ID, pending.Page.ID)
	}

	var stale pageProjectionJob
	staleFound, err := store.executionRead(t.Context(), store.store.Database(), knowledgePageProjectionJobTable, pageScope(authority, completed.Page.ID), &stale)
	if err != nil {
		t.Fatal(err)
	}
	if staleFound {
		t.Fatalf("completed head job was not discarded: %+v", stale)
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
