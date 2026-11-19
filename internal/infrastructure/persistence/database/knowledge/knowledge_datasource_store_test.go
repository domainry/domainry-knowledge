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

func TestDatasourceBindingQueuesPublishedLocalFilePageOriginal(t *testing.T) {
	store, authority, library, _ := pageFixture(t)
	body := []byte("private file body uploaded before datasource binding")
	record, err := store.ReserveKnowledgeDocument(t.Context(), persistence.KnowledgeDocumentReserve{
		LibraryID: library.ID, ClientID: "local-file-before-binding", Filename: "launch-plan.pdf",
		ContentType: "application/pdf", SHA256: knowledgeTestDigest(body), Bytes: int64(len(body)),
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	record, err = store.CommitKnowledgeDocumentContent(t.Context(), record.Document.ID, record.Document.Revision, "body://local-file-before-binding", authority)
	if err != nil {
		t.Fatal(err)
	}
	record.SecurityScanStarted, record.SecurityScanCompleted = true, true
	record.Document.State, record.Document.ProcessingStage = "ready", "complete"
	record.Document.SecurityStatus, record.Document.SecurityScanner = "clean", "test"
	record.Document.SecurityReportSHA256, record.Document.IndexStatus = record.Document.SHA256, "STORED"
	saveRetryFixture(t, store.store.Database(), record, authority)

	page, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{
		ClientID: "local-file-page", Title: record.Document.Filename, ContentType: knowledgesdk.KnowledgePageTypeFile,
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	if _, err = store.SetKnowledgePageAttachment(t.Context(), library.ID, page.Page.ID, record.Document.ID, knowledgesdk.KnowledgePageAttachmentWrite{
		ClientID: "local-file-page-attachment", Title: record.Document.Filename, Rank: "a",
	}, authority); err != nil {
		t.Fatal(err)
	}
	content := `{"document_id":"` + record.Document.ID + `","display_mode":"preview","title":"` + record.Document.Filename + `"}`
	page = savePageFixture(t, store, authority, library, page, "local-file-page-save", record.Document.Filename, content)
	page = publishPageFixture(t, store, authority, library, page, "local-file-page-publish")
	work, found, err := store.ClaimKnowledgePageProjection(t.Context(), authority.RuntimeID, "local-file-page-skip", time.Now().UTC().Add(time.Second), time.Minute)
	if err != nil || !found || work.Lease.PageID != page.Page.ID {
		t.Fatalf("claim local File Page projection: work=%+v found=%t err=%v", work, found, err)
	}
	if err = store.SkipKnowledgePageProjection(t.Context(), work.Lease); err != nil {
		t.Fatal(err)
	}

	sourceID := strings.Repeat("e", 64)
	accessPolicy := strings.Repeat("a", 64)
	if _, err = store.BindKnowledgeDatasource(t.Context(), library.ID, persistence.KnowledgeDatasourceAssignment{
		DatasourceKey: "enterprise", SourceID: sourceID, AccessPolicySHA256: accessPolicy, ExpectedRevision: library.Revision,
	}, authority); err != nil {
		t.Fatal(err)
	}
	migrated, err := store.KnowledgeDocumentRecord(t.Context(), record.Document.ID, authority)
	if err != nil {
		t.Fatal(err)
	}
	if migrated.SourceID != sourceID || migrated.AccessPolicySHA256 != accessPolicy || migrated.Document.State != "queued" || migrated.Document.ProcessingStage != "parse" || migrated.Document.IndexStatus != "" || migrated.PutRequestID == "" || migrated.RemoteID == record.RemoteID {
		t.Fatalf("binding did not queue the published local File Page original: before=%+v after=%+v", record, migrated)
	}
	byRemoteID, err := store.KnowledgeDocumentByRemoteID(t.Context(), library.ID, sourceID, migrated.RemoteID, authority)
	if err != nil || byRemoteID.Document.ID != record.Document.ID {
		t.Fatalf("bound File Page original is missing from the physical datasource scope: record=%+v err=%v", byRemoteID, err)
	}
	lease, claimed, err := store.ClaimKnowledgeDocumentWork(t.Context(), authority.RuntimeID, "local-file-page-index", time.Now().UTC(), time.Minute)
	if err != nil || !claimed || lease.DocumentID != record.Document.ID {
		t.Fatalf("migrated File Page original was not queued: lease=%+v claimed=%t err=%v", lease, claimed, err)
	}
}
