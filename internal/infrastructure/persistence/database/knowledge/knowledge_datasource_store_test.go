package store

import (
	"reflect"
	"strings"
	"testing"
	"time"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
)

func TestDatasourceBindingQueuesPublishedSnapshotWithoutPublishingDraft(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	policy := setPageAccessFixture(t, store, library.ID, page.Page.ID, "restricted", 1, knowledgesdk.KnowledgePageAccessRestricted, nil, authority)
	page = savePageFixture(t, store, authority, library, page, "published-body", "Published", "published marker")
	page = publishPageFixture(t, store, authority, library, page, "publish-before-binding")
	work, found, err := store.ClaimKnowledgePageProjection(t.Context(), authority.RuntimeID, "local", time.Now().UTC().Add(time.Second), time.Minute)
	if err != nil || !found {
		t.Fatalf("local work: found=%v err=%v", found, err)
	}
	if err = store.SkipKnowledgePageProjection(t.Context(), work.Lease); err != nil {
		t.Fatal(err)
	}
	page = savePageFixture(t, store, authority, library, page, "draft-body", "Unpublished", "unpublished marker")
	before, err := store.KnowledgePage(t.Context(), library.ID, page.Page.ID, true, authority)
	if err != nil {
		t.Fatal(err)
	}
	draft, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "draft-only", Title: "Draft only", ContentType: knowledgesdk.KnowledgePageTypeDocument}, authority)
	if err != nil {
		t.Fatal(err)
	}
	archived, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "archived", Title: "Archived", ContentType: knowledgesdk.KnowledgePageTypeDocument}, authority)
	if err != nil {
		t.Fatal(err)
	}
	archived = publishPageFixture(t, store, authority, library, archived, "archived-publish")
	if _, err = store.SetKnowledgePageArchived(t.Context(), library.ID, archived.Page.ID, true, knowledgesdk.KnowledgePageStateWrite{ClientID: "archive-before-binding", ExpectedRevision: archived.Page.Revision}, authority); err != nil {
		t.Fatal(err)
	}
	assignment := persistence.KnowledgeDatasourceAssignment{DatasourceKey: "enterprise", SourceID: strings.Repeat("e", 64), AccessPolicySHA256: strings.Repeat("a", 64), ExpectedRevision: library.Revision}
	bound, err := store.BindKnowledgeDatasource(t.Context(), library.ID, assignment, authority)
	if err != nil {
		t.Fatal(err)
	}
	after, err := store.KnowledgePage(t.Context(), library.ID, page.Page.ID, true, authority)
	if err != nil || after.Page.ProjectionStatus != "queued" || after.Page.AccessStatus != "queued" || after.Page.AccessRevision != policy.Revision || after.Page.AccessMode != knowledgesdk.KnowledgePageAccessRestricted {
		t.Fatalf("binding did not queue the existing ACL: page=%+v err=%v", after.Page, err)
	}
	if after.Page.Revision != before.Page.Revision || after.Page.PublishedVersion != before.Page.PublishedVersion || !reflect.DeepEqual(before.Published, after.Published) || !reflect.DeepEqual(before.Draft, after.Draft) {
		t.Fatal("binding changed the page, published version or unpublished draft")
	}
	work, found, err = store.ClaimKnowledgePageProjection(t.Context(), authority.RuntimeID, "remote", time.Now().UTC().Add(time.Second), time.Minute)
	if err != nil || !found || work.Lease.PageID != page.Page.ID || work.Version.Body.PlainText != "published marker" || work.Lease.AccessRevision != policy.Revision {
		t.Fatalf("binding queued the wrong content: work=%+v found=%v err=%v", work, found, err)
	}
	if replay, replayErr := store.BindKnowledgeDatasource(t.Context(), library.ID, assignment, authority); replayErr != nil || replay.Revision != bound.Revision {
		t.Fatalf("binding replay: library=%+v err=%v", replay, replayErr)
	}
	// An idempotent binding retry must not discard a worker's existing lease.
	if err = store.RetryKnowledgePageProjection(t.Context(), work.Lease, time.Now().UTC()); err != nil {
		t.Fatalf("binding replay replaced in-flight projection: %v", err)
	}
	archivedAfter, err := store.KnowledgePage(t.Context(), library.ID, archived.Page.ID, false, authority)
	if err != nil || archivedAfter.Page.State != "archived" || archivedAfter.Page.ProjectionStatus != "none" {
		t.Fatalf("binding changed an archived page: %+v err=%v", archivedAfter.Page, err)
	}
	draftAfter, err := store.KnowledgePage(t.Context(), library.ID, draft.Page.ID, true, authority)
	if err != nil || draftAfter.Page.PublishedVersion != 0 || draftAfter.Page.ProjectionStatus != "none" {
		t.Fatalf("binding indexed an unpublished page: %+v err=%v", draftAfter.Page, err)
	}
}

func TestDatasourceBindingPreventsConcurrentLocalProjectionSkip(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	page = publishPageFixture(t, store, authority, library, page, "publish-race")
	work, found, err := store.ClaimKnowledgePageProjection(t.Context(), authority.RuntimeID, "local", time.Now().UTC().Add(time.Second), time.Minute)
	if err != nil || !found {
		t.Fatalf("local work: found=%v err=%v", found, err)
	}
	assignment := persistence.KnowledgeDatasourceAssignment{DatasourceKey: "enterprise", SourceID: strings.Repeat("e", 64), AccessPolicySHA256: strings.Repeat("a", 64), ExpectedRevision: library.Revision}
	if _, err = store.BindKnowledgeDatasource(t.Context(), library.ID, assignment, authority); err != nil {
		t.Fatal(err)
	}
	if err = store.SkipKnowledgePageProjection(t.Context(), work.Lease); err == nil || !strings.Contains(err.Error(), "page_projection_source_changed") {
		t.Fatalf("an outdated local-only decision discarded remote indexing: %v", err)
	}
	if err = store.RetryKnowledgePageProjection(t.Context(), work.Lease, time.Now().UTC()); err != nil {
		t.Fatal(err)
	}
	retry, found, err := store.ClaimKnowledgePageProjection(t.Context(), authority.RuntimeID, "remote", time.Now().UTC().Add(time.Second), time.Minute)
	if err != nil || !found || retry.Lease.PageID != page.Page.ID || retry.Lease.Token <= work.Lease.Token {
		t.Fatalf("work was not recoverable: work=%+v found=%v err=%v", retry, found, err)
	}
}
