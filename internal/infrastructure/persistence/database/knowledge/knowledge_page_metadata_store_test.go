package store

import (
	"database/sql"
	"reflect"
	"strings"
	"testing"
	"time"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func TestKnowledgePageMetadataPersistsIndependentlyAndRechecksMembers(t *testing.T) {
	store, manager, library, page := pageFixture(t)
	page = publishPageFixture(t, store, manager, library, page, "metadata-publish")
	bob := agentsdk.Authority{Known: true, RuntimeID: manager.RuntimeID, WorkspaceID: manager.WorkspaceID, UserID: "bob", RoleKey: "editor"}
	reader := agentsdk.Authority{Known: true, RuntimeID: manager.RuntimeID, WorkspaceID: manager.WorkspaceID, UserID: "reader", RoleKey: "reader"}
	var err error
	library, err = store.SetKnowledgeLibraryMember(t.Context(), library.ID, bob.UserID, agentsdk.KnowledgeLibraryMemberWrite{Role: "editor", ExpectedRevision: library.Revision}, manager)
	if err != nil {
		t.Fatal(err)
	}
	library, err = store.SetKnowledgeLibraryMember(t.Context(), library.ID, reader.UserID, agentsdk.KnowledgeLibraryMemberWrite{Role: "reader", ExpectedRevision: library.Revision}, manager)
	if err != nil {
		t.Fatal(err)
	}

	before, err := store.KnowledgePage(t.Context(), library.ID, page.Page.ID, true, manager)
	if err != nil {
		t.Fatal(err)
	}
	reviewAt := time.Date(2026, 12, 3, 8, 37, 42, 0, time.FixedZone("test", 8*60*60))
	governance, err := store.SetKnowledgePageGovernance(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageGovernanceWrite{
		ClientID: "governance-save", ExpectedRevision: 1, OwnerUserID: bob.UserID, ContentAdminUserIDs: []string{reader.UserID},
		ArchiveRetentionDays: 730, ReviewIntervalDays: 90, NextReviewAt: reviewAt,
	}, manager)
	if err != nil {
		t.Fatal(err)
	}
	write := knowledgesdk.KnowledgePageMetadataWrite{
		ClientID: "metadata-save", ExpectedRevision: governance.Revision,
		Tags: []string{"发布", "Product"}, Status: knowledgesdk.KnowledgePageStatusInReview,
		Properties: []knowledgesdk.KnowledgePageCustomProperty{
			{ID: "prop_summary", Name: "摘要", Type: knowledgesdk.KnowledgePagePropertyText, Value: "核心说明"},
			{ID: "prop_score", Name: "质量分", Type: knowledgesdk.KnowledgePagePropertyNumber, Value: "98.5"},
			{ID: "prop_due", Name: "截止日", Type: knowledgesdk.KnowledgePagePropertyDate, Value: "2026-12-31"},
			{ID: "prop_stage", Name: "阶段", Type: knowledgesdk.KnowledgePagePropertySelect, Value: "验收"},
			{ID: "prop_required", Name: "必读", Type: knowledgesdk.KnowledgePagePropertyCheckbox, Value: "true"},
			{ID: "prop_reviewer", Name: "复核人", Type: knowledgesdk.KnowledgePagePropertyPerson, Value: bob.UserID},
		},
	}
	metadata, err := store.SetKnowledgePageMetadata(t.Context(), library.ID, page.Page.ID, write, manager)
	if err != nil {
		t.Fatal(err)
	}
	wantReview := reviewAt.UTC().Truncate(time.Minute)
	if metadata.Revision != 3 || metadata.OwnerUserID != bob.UserID || !reflect.DeepEqual(metadata.ContentAdminUserIDs, []string{reader.UserID}) || metadata.ArchiveRetentionDays != 730 || metadata.ReviewIntervalDays != 90 || metadata.Status != knowledgesdk.KnowledgePageStatusInReview || metadata.NextReviewAt == nil || !metadata.NextReviewAt.Equal(wantReview) || !reflect.DeepEqual(metadata.Tags, []string{"Product", "发布"}) || len(metadata.Properties) != 6 {
		t.Fatalf("metadata was not normalized and persisted: %+v", metadata)
	}
	replayed, err := store.SetKnowledgePageMetadata(t.Context(), library.ID, page.Page.ID, write, manager)
	if err != nil || replayed.Revision != metadata.Revision || replayed.UpdatedAt == nil || metadata.UpdatedAt == nil || !replayed.UpdatedAt.Equal(*metadata.UpdatedAt) {
		t.Fatalf("metadata retry was not idempotent: %+v err=%v", replayed, err)
	}
	stale := write
	stale.ClientID = "metadata-stale"
	stale.Status = knowledgesdk.KnowledgePageStatusVerified
	if _, err = store.SetKnowledgePageMetadata(t.Context(), library.ID, page.Page.ID, stale, manager); err == nil || !strings.Contains(err.Error(), "page_metadata_revision_conflict") {
		t.Fatalf("stale metadata revision was accepted: %v", err)
	}
	if _, err = store.SetKnowledgePageMetadata(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageMetadataWrite{ClientID: "reader-write", ExpectedRevision: metadata.Revision}, reader); err == nil {
		t.Fatal("reader changed shared page metadata")
	}
	visible, err := store.KnowledgePageMetadata(t.Context(), library.ID, page.Page.ID, reader)
	if err != nil || visible.Revision != 3 || visible.OwnerUserID != bob.UserID {
		t.Fatalf("authorized reader could not read published metadata: %+v err=%v", visible, err)
	}
	after, err := store.KnowledgePage(t.Context(), library.ID, page.Page.ID, true, manager)
	if err != nil {
		t.Fatal(err)
	}
	if after.Page.Revision != before.Page.Revision || after.Draft.DraftRevision != before.Draft.DraftRevision || after.Published.Version != before.Published.Version {
		t.Fatalf("metadata write changed page content revisions: before=%+v after=%+v", before, after)
	}

	library, err = store.RemoveKnowledgeLibraryMember(t.Context(), library.ID, bob.UserID, library.Revision, manager)
	if err != nil {
		t.Fatal(err)
	}
	cleaned, err := store.KnowledgePageMetadata(t.Context(), library.ID, page.Page.ID, manager)
	if err != nil {
		t.Fatal(err)
	}
	if cleaned.Revision != 4 || cleaned.OwnerUserID != manager.UserID || cleaned.Properties[5].Value != "" || cleaned.Tags[0] != "Product" {
		t.Fatalf("removed member references were not cleared atomically: %+v", cleaned)
	}
}

func TestKnowledgePageMetadataRejectsInvalidTypedPropertiesAndNonMembers(t *testing.T) {
	store, manager, library, page := pageFixture(t)
	tests := []struct {
		name  string
		write knowledgesdk.KnowledgePageMetadataWrite
	}{
		{name: "duplicate tag", write: knowledgesdk.KnowledgePageMetadataWrite{ClientID: "invalid-tags", Tags: []string{"发布", " 发布 "}}},
		{name: "invalid number", write: knowledgesdk.KnowledgePageMetadataWrite{ClientID: "invalid-number", Properties: []knowledgesdk.KnowledgePageCustomProperty{{ID: "prop_number", Name: "数值", Type: knowledgesdk.KnowledgePagePropertyNumber, Value: "NaN"}}}},
		{name: "duplicate property name", write: knowledgesdk.KnowledgePageMetadataWrite{ClientID: "invalid-property-name", Properties: []knowledgesdk.KnowledgePageCustomProperty{{ID: "prop_one", Name: "状态", Type: knowledgesdk.KnowledgePagePropertyText}, {ID: "prop_two", Name: "状态", Type: knowledgesdk.KnowledgePagePropertyText}}}},
		{name: "non-member person", write: knowledgesdk.KnowledgePageMetadataWrite{ClientID: "invalid-person", Properties: []knowledgesdk.KnowledgePageCustomProperty{{ID: "prop_person", Name: "复核人", Type: knowledgesdk.KnowledgePagePropertyPerson, Value: "outsider"}}}},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			if _, err := store.SetKnowledgePageMetadata(t.Context(), library.ID, page.Page.ID, test.write, manager); err == nil {
				t.Fatalf("invalid metadata was accepted: %+v", test.write)
			}
		})
	}
	if _, err := store.SetKnowledgePageGovernance(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageGovernanceWrite{ClientID: "invalid-owner", ExpectedRevision: 1, OwnerUserID: "outsider", ArchiveRetentionDays: 365, ReviewIntervalDays: 180}, manager); err == nil {
		t.Fatal("non-member governance owner was accepted")
	}
}

func TestKnowledgePageGovernanceRequiresManagerAndDoesNotGrantReviewAccess(t *testing.T) {
	store, manager, library, page := pageFixture(t)
	bob := agentsdk.Authority{Known: true, RuntimeID: manager.RuntimeID, WorkspaceID: manager.WorkspaceID, UserID: "bob", RoleKey: "editor"}
	carol := agentsdk.Authority{Known: true, RuntimeID: manager.RuntimeID, WorkspaceID: manager.WorkspaceID, UserID: "carol", RoleKey: "editor"}
	reader := agentsdk.Authority{Known: true, RuntimeID: manager.RuntimeID, WorkspaceID: manager.WorkspaceID, UserID: "reader", RoleKey: "reader"}
	var err error
	for _, member := range []struct {
		userID string
		role   string
	}{{bob.UserID, "editor"}, {carol.UserID, "editor"}, {reader.UserID, "reader"}} {
		library, err = store.SetKnowledgeLibraryMember(t.Context(), library.ID, member.userID, agentsdk.KnowledgeLibraryMemberWrite{Role: member.role, ExpectedRevision: library.Revision}, manager)
		if err != nil {
			t.Fatal(err)
		}
	}
	write := knowledgesdk.KnowledgePageGovernanceWrite{
		ClientID: "governance-policy", ExpectedRevision: 1, OwnerUserID: bob.UserID,
		ContentAdminUserIDs: []string{carol.UserID, reader.UserID}, ArchiveRetentionDays: 365, ReviewIntervalDays: 90,
	}
	if _, err = store.SetKnowledgePageGovernance(t.Context(), library.ID, page.Page.ID, write, bob); err == nil {
		t.Fatal("editor changed manager-owned page governance")
	}
	governance, err := store.SetKnowledgePageGovernance(t.Context(), library.ID, page.Page.ID, write, manager)
	if err != nil || governance.Revision != 2 {
		t.Fatalf("manager could not set governance: metadata=%+v err=%v", governance, err)
	}
	if _, err = store.ReviewKnowledgePageGovernance(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageGovernanceReview{ClientID: "reader-review", ExpectedRevision: governance.Revision}, reader); err == nil {
		t.Fatal("content-administrator designation granted a reader edit access")
	}
	reviewed, err := store.ReviewKnowledgePageGovernance(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageGovernanceReview{ClientID: "editor-review", ExpectedRevision: governance.Revision}, carol)
	if err != nil {
		t.Fatal(err)
	}
	if reviewed.Revision != 3 || reviewed.LastReviewedAt == nil || reviewed.LastReviewedByUserID != carol.UserID || reviewed.NextReviewAt == nil || reviewed.NextReviewAt.Sub(*reviewed.LastReviewedAt) != 90*24*time.Hour {
		t.Fatalf("authorized content administrator review was not recorded or scheduled: %+v", reviewed)
	}
}

func TestKnowledgePageArchiveRetentionIsAtomicAndBlocksExpiredRestore(t *testing.T) {
	store, manager, library, page := pageFixture(t)
	governance, err := store.SetKnowledgePageGovernance(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageGovernanceWrite{
		ClientID: "retention-policy", ExpectedRevision: 1, OwnerUserID: manager.UserID, ArchiveRetentionDays: 30, ReviewIntervalDays: 180,
	}, manager)
	if err != nil || governance.Revision != 2 {
		t.Fatalf("retention policy was not saved: metadata=%+v err=%v", governance, err)
	}
	archived, err := store.SetKnowledgePageArchived(t.Context(), library.ID, page.Page.ID, true, knowledgesdk.KnowledgePageStateWrite{ClientID: "archive-once", ExpectedRevision: page.Page.Revision}, manager)
	if err != nil {
		t.Fatal(err)
	}
	metadata, err := store.KnowledgePageMetadata(t.Context(), library.ID, page.Page.ID, manager)
	if err != nil || metadata.ArchivedAt == nil || metadata.RetainUntil == nil || metadata.RetainUntil.Sub(*metadata.ArchivedAt) != 30*24*time.Hour || metadata.Revision != 3 {
		t.Fatalf("archive and retention deadline were not committed together: metadata=%+v err=%v", metadata, err)
	}
	restored, err := store.SetKnowledgePageArchived(t.Context(), library.ID, page.Page.ID, false, knowledgesdk.KnowledgePageStateWrite{ClientID: "restore-before-deadline", ExpectedRevision: archived.Revision}, manager)
	if err != nil {
		t.Fatal(err)
	}
	metadata, err = store.KnowledgePageMetadata(t.Context(), library.ID, page.Page.ID, manager)
	if err != nil || metadata.ArchivedAt != nil || metadata.RetainUntil != nil || metadata.Revision != 4 {
		t.Fatalf("restore did not clear the retention window: metadata=%+v err=%v", metadata, err)
	}
	archived, err = store.SetKnowledgePageArchived(t.Context(), library.ID, page.Page.ID, true, knowledgesdk.KnowledgePageStateWrite{ClientID: "archive-twice", ExpectedRevision: restored.Revision}, manager)
	if err != nil {
		t.Fatal(err)
	}
	err = store.transaction(t.Context(), func(tx *sql.Tx) error {
		current, found, readErr := store.knowledgePageMetadataRecord(t.Context(), tx, library.ID, page.Page.ID, manager)
		if readErr != nil || !found {
			return readErr
		}
		past := time.Now().UTC().Add(-time.Minute).Truncate(time.Millisecond)
		current.RetainUntil = &past
		priorRevision := current.Revision
		current.Revision++
		current.UpdatedAt = &past
		return store.writeKnowledgePageMetadataRecord(t.Context(), tx, current, priorRevision, true, manager)
	})
	if err != nil {
		t.Fatal(err)
	}
	if _, err = store.SetKnowledgePageArchived(t.Context(), library.ID, page.Page.ID, false, knowledgesdk.KnowledgePageStateWrite{ClientID: "restore-expired", ExpectedRevision: archived.Revision}, manager); err == nil || !strings.Contains(err.Error(), "page_archive_retention_expired") {
		t.Fatalf("expired archived page was restorable: %v", err)
	}
	err = store.transaction(t.Context(), func(tx *sql.Tx) error {
		current, readErr := store.pageRecord(t.Context(), tx, library.ID, page.Page.ID, manager)
		if readErr == nil && current.State != "archived" {
			t.Fatalf("failed restore committed a page state change: %+v", current)
		}
		return readErr
	})
	if err != nil {
		t.Fatal(err)
	}
}
