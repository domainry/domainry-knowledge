package store

import (
	"crypto/sha256"
	"encoding/hex"
	"strings"
	"testing"
	"time"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
)

func TestKnowledgePageCrossLibraryMoveTransfersSubtreeAndRecomputesIsolation(t *testing.T) {
	store, manager, source, root := pageFixture(t)
	source = addPageMember(t, store, source, "source-reader", "reader", manager)
	target, err := store.CreateKnowledgeLibrary(t.Context(), agentsdk.KnowledgeLibraryCreate{ClientID: "page-transfer-target", Kind: "shared", Name: "目标资料库"}, manager)
	if err != nil {
		t.Fatal(err)
	}
	target = addPageMember(t, store, target, "target-reader", "reader", manager)
	targetParent, err := store.CreateKnowledgePage(t.Context(), target.ID, knowledgesdk.KnowledgePageCreate{ClientID: "page-transfer-target-parent", Title: "目标目录", ContentType: knowledgesdk.KnowledgePageTypeDocument}, manager)
	if err != nil {
		t.Fatal(err)
	}
	targetParent = savePageFixture(t, store, manager, target, targetParent, "page-transfer-target-parent-body", "目标目录", "目标父页面正文")
	targetParent = publishPageFixture(t, store, manager, target, targetParent, "page-transfer-target-parent-publish")

	root = savePageFixture(t, store, manager, source, root, "page-transfer-root-body", "跨库根页面", "根页面审批规则")
	root = publishPageFixture(t, store, manager, source, root, "page-transfer-root-publish")
	child, err := store.CreateKnowledgePage(t.Context(), source.ID, knowledgesdk.KnowledgePageCreate{ClientID: "page-transfer-child", ParentPageID: root.Page.ID, Title: "跨库子页面", ContentType: knowledgesdk.KnowledgePageTypeDocument}, manager)
	if err != nil {
		t.Fatal(err)
	}
	child = savePageFixture(t, store, manager, source, child, "page-transfer-child-body", "跨库子页面", "子页面值班规则")
	child = publishPageFixture(t, store, manager, source, child, "page-transfer-child-publish")
	setPageAccessFixture(t, store, source.ID, root.Page.ID, "page-transfer-source-acl", 1, knowledgesdk.KnowledgePageAccessRestricted, []knowledgesdk.KnowledgePageAccessGrant{userPageGrant("source-reader", "reader", knowledgesdk.KnowledgePageGrantSubtree)}, manager)

	previewInput := knowledgesdk.KnowledgePageMovePreview{TargetLibraryID: target.ID, ParentPageID: targetParent.Page.ID, Rank: "transfer-rank"}
	preview, err := store.PreviewKnowledgePageMove(t.Context(), source.ID, root.Page.ID, previewInput, manager)
	if err != nil {
		t.Fatal(err)
	}
	if preview.SourceLibraryID != source.ID || preview.TargetLibraryID != target.ID || preview.AffectedPages != 2 || !preview.RequiresConfirm || preview.Token == "" {
		t.Fatalf("cross-Library preview lost boundary or subtree impact: %+v", preview)
	}
	withoutConfirmation := knowledgesdk.KnowledgePageMove{ClientID: "page-transfer-missing-confirm", ExpectedRevision: root.Page.Revision, TargetLibraryID: target.ID, ParentPageID: targetParent.Page.ID, Rank: "transfer-rank"}
	if _, err = store.MoveKnowledgePage(t.Context(), source.ID, root.Page.ID, withoutConfirmation, manager); err == nil || !strings.Contains(err.Error(), "page_move_access_confirmation_required") {
		t.Fatalf("cross-Library move did not require preview confirmation: %v", err)
	}

	move := knowledgesdk.KnowledgePageMove{ClientID: "page-transfer-confirmed", ExpectedRevision: root.Page.Revision, TargetLibraryID: target.ID, ParentPageID: targetParent.Page.ID, Rank: "transfer-rank", AccessImpactToken: preview.Token}
	moved, err := store.MoveKnowledgePage(t.Context(), source.ID, root.Page.ID, move, manager)
	if err != nil {
		t.Fatal(err)
	}
	if moved.ID != root.Page.ID || moved.LibraryID != target.ID || moved.ParentPageID != targetParent.Page.ID || moved.Rank != "transfer-rank" || moved.PublishedVersion != root.Page.PublishedVersion+1 {
		t.Fatalf("root identity/version was not transferred: before=%+v after=%+v", root.Page, moved)
	}
	if _, err = store.KnowledgePage(t.Context(), source.ID, root.Page.ID, true, manager); err == nil || !strings.Contains(err.Error(), "page_not_found") {
		t.Fatalf("source Library still resolves transferred root: %v", err)
	}
	targetRoot, err := store.KnowledgePage(t.Context(), target.ID, root.Page.ID, true, manager)
	if err != nil {
		t.Fatal(err)
	}
	targetChild, err := store.KnowledgePage(t.Context(), target.ID, child.Page.ID, true, manager)
	if err != nil {
		t.Fatal(err)
	}
	if targetRoot.Draft == nil || targetRoot.Draft.LibraryID != target.ID || targetRoot.Published == nil || targetRoot.Published.LibraryID != target.ID || targetRoot.Published.ParentPageID != targetParent.Page.ID {
		t.Fatalf("root draft/published snapshots were not transferred: %+v", targetRoot)
	}
	if targetChild.Page.LibraryID != target.ID || targetChild.Page.ParentPageID != root.Page.ID || targetChild.Published == nil || targetChild.Published.LibraryID != target.ID || targetChild.Page.PublishedVersion != child.Page.PublishedVersion+1 {
		t.Fatalf("child subtree was not transferred with stable identity: %+v", targetChild)
	}
	policy, err := store.KnowledgePageAccess(t.Context(), target.ID, root.Page.ID, manager)
	if err != nil || policy.Mode != knowledgesdk.KnowledgePageAccessInherit || len(policy.Grants) != 0 || policy.LibraryID != target.ID || policy.ProjectionStatus != "queued" {
		t.Fatalf("target ACL was not recomputed from the target Library: %+v err=%v", policy, err)
	}
	targetReader := manager
	targetReader.UserID = "target-reader"
	effective, err := store.EvaluateKnowledgePageAccess(t.Context(), target.ID, child.Page.ID, targetReader)
	if err != nil || !effective.Allowed || effective.Role != "reader" || effective.Source != "library" {
		t.Fatalf("target Library membership did not become authoritative: %+v err=%v", effective, err)
	}
	sourceReader := manager
	sourceReader.UserID = "source-reader"
	if _, err = store.EvaluateKnowledgePageAccess(t.Context(), target.ID, root.Page.ID, sourceReader); err == nil {
		t.Fatal("source-only reader retained access in the target Library")
	}

	var rootJob, childJob pageProjectionJob
	for pageID, job := range map[string]*pageProjectionJob{root.Page.ID: &rootJob, child.Page.ID: &childJob} {
		found, readErr := store.executionRead(t.Context(), store.store.Database(), knowledgePageProjectionJobTable, pageScope(manager, pageID), job)
		if readErr != nil || !found || job.LibraryID != target.ID {
			t.Fatalf("target projection job missing page=%s job=%+v found=%v err=%v", pageID, *job, found, readErr)
		}
	}
	replayed, err := store.MoveKnowledgePage(t.Context(), source.ID, root.Page.ID, move, manager)
	if err != nil || replayed.ID != moved.ID || replayed.LibraryID != target.ID || replayed.Revision != moved.Revision {
		t.Fatalf("cross-Library move was not idempotent: replay=%+v err=%v", replayed, err)
	}
}

func TestKnowledgePageCrossLibraryMoveRejectsFileOwnershipLeak(t *testing.T) {
	store, manager, source, _ := pageFixture(t)
	target, err := store.CreateKnowledgeLibrary(t.Context(), agentsdk.KnowledgeLibraryCreate{ClientID: "page-transfer-file-target", Kind: "shared", Name: "文件目标库"}, manager)
	if err != nil {
		t.Fatal(err)
	}
	filePage, err := store.CreateKnowledgePage(t.Context(), source.ID, knowledgesdk.KnowledgePageCreate{ClientID: "page-transfer-file", Title: "文件页", ContentType: knowledgesdk.KnowledgePageTypeFile}, manager)
	if err != nil {
		t.Fatal(err)
	}
	preview, err := store.PreviewKnowledgePageMove(t.Context(), source.ID, filePage.Page.ID, knowledgesdk.KnowledgePageMovePreview{TargetLibraryID: target.ID, Rank: filePage.Page.Rank}, manager)
	if err != nil {
		t.Fatal(err)
	}
	_, err = store.MoveKnowledgePage(t.Context(), source.ID, filePage.Page.ID, knowledgesdk.KnowledgePageMove{ClientID: "page-transfer-file-move", ExpectedRevision: filePage.Page.Revision, TargetLibraryID: target.ID, Rank: filePage.Page.Rank, AccessImpactToken: preview.Token}, manager)
	if err == nil || !strings.Contains(err.Error(), "page_transfer_document_required") {
		t.Fatalf("File Page crossed Library without a document transfer: %v", err)
	}
	if _, readErr := store.KnowledgePage(t.Context(), source.ID, filePage.Page.ID, true, manager); readErr != nil {
		t.Fatalf("rejected transfer mutated source File Page: %v", readErr)
	}
}

func TestKnowledgePageCrossLibraryMoveDeletesOldProjectionBeforeRelocatingStableDocument(t *testing.T) {
	store, manager, source, root := pageFixture(t)
	target, err := store.CreateKnowledgeLibrary(t.Context(), agentsdk.KnowledgeLibraryCreate{ClientID: "page-transfer-projection-target", Kind: "shared", Name: "投影目标库"}, manager)
	if err != nil {
		t.Fatal(err)
	}
	sourceID := conversationHash([]string{"page-transfer-projection-source", source.ID})
	targetSourceID := conversationHash([]string{"page-transfer-projection-source", target.ID})
	for _, binding := range []struct {
		libraryID string
		sourceID  string
	}{{source.ID, sourceID}, {target.ID, targetSourceID}} {
		if err = store.ActivateKnowledgeDocumentSource(t.Context(), agentsdk.KnowledgeDocumentStorageScope{RuntimeID: manager.RuntimeID, WorkspaceID: manager.WorkspaceID, LibraryID: binding.libraryID}, binding.sourceID); err != nil {
			t.Fatal(err)
		}
	}

	root = savePageFixture(t, store, manager, source, root, "page-transfer-projection-body", "跨库投影页面", "跨库投影审批规则")
	root = publishPageFixture(t, store, manager, source, root, "page-transfer-projection-publish")
	work, found, err := store.ClaimKnowledgePageProjection(t.Context(), manager.RuntimeID, "page-transfer-projection-worker", time.Now().UTC(), time.Minute)
	if err != nil || !found || work.Page.ID != root.Page.ID {
		t.Fatalf("claim source projection: found=%t work=%+v err=%v", found, work, err)
	}
	canonical := []byte("# " + work.Version.Title + "\n\n" + work.Version.Body.Content)
	digest := sha256.Sum256(canonical)
	contentHash := hex.EncodeToString(digest[:])
	if err = store.CompleteKnowledgePageProjection(t.Context(), work.Lease, "body://page-transfer/source", int64(len(canonical)), contentHash, work.Page.ID+".md", strings.Repeat("a", 64)); err != nil {
		t.Fatal(err)
	}
	lease, claimed, err := store.ClaimKnowledgeDocumentWork(t.Context(), manager.RuntimeID, "page-transfer-document-worker", time.Now().UTC(), time.Minute)
	if err != nil || !claimed {
		t.Fatalf("claim source document put: claimed=%t err=%v", claimed, err)
	}
	if _, started, startErr := store.StartKnowledgeDocumentPut(t.Context(), lease); startErr != nil || !started {
		t.Fatalf("start source document put: started=%t err=%v", started, startErr)
	}
	if err = store.ApplyKnowledgeDocumentProgress(t.Context(), lease, persistence.KnowledgeDocumentProgress{Event: "put_acknowledged"}); err != nil {
		t.Fatal(err)
	}
	lease, claimed, err = store.ClaimKnowledgeDocumentWork(t.Context(), manager.RuntimeID, "page-transfer-document-worker", time.Now().UTC(), time.Minute)
	if err != nil || !claimed {
		t.Fatalf("claim source document index: claimed=%t err=%v", claimed, err)
	}
	if err = store.ApplyKnowledgeDocumentProgress(t.Context(), lease, persistence.KnowledgeDocumentProgress{Event: "indexed", IndexStatus: "INDEXED"}); err != nil {
		t.Fatal(err)
	}
	documentID, err := knowledgePageProjectionDocumentID(manager, root.Page.ID)
	if err != nil {
		t.Fatal(err)
	}
	indexed, err := store.KnowledgeDocumentRecord(t.Context(), documentID, manager)
	if err != nil || indexed.Document.State != "ready" || indexed.Document.LibraryID != source.ID || indexed.SourceID != sourceID {
		t.Fatalf("source projection was not ready: record=%+v err=%v", indexed, err)
	}
	oldRemoteID := indexed.RemoteID

	preview, err := store.PreviewKnowledgePageMove(t.Context(), source.ID, root.Page.ID, knowledgesdk.KnowledgePageMovePreview{TargetLibraryID: target.ID, Rank: root.Page.Rank}, manager)
	if err != nil {
		t.Fatal(err)
	}
	moved, err := store.MoveKnowledgePage(t.Context(), source.ID, root.Page.ID, knowledgesdk.KnowledgePageMove{ClientID: "page-transfer-projection-move", ExpectedRevision: root.Page.Revision, TargetLibraryID: target.ID, Rank: root.Page.Rank, AccessImpactToken: preview.Token}, manager)
	if err != nil {
		t.Fatal(err)
	}
	retiring, err := store.KnowledgeDocumentRecord(t.Context(), documentID, manager)
	if err != nil || retiring.Document.State != "deleting" || retiring.Document.LibraryID != source.ID || retiring.SourceID != sourceID || retiring.RemoteID != oldRemoteID {
		t.Fatalf("source projection did not enter fail-closed deletion: record=%+v err=%v", retiring, err)
	}

	targetWork, found, err := store.ClaimKnowledgePageProjection(t.Context(), manager.RuntimeID, "page-transfer-target-projection-worker", time.Now().UTC(), time.Minute)
	if err != nil || !found || targetWork.Page.ID != root.Page.ID || targetWork.Page.LibraryID != target.ID || targetWork.Version.Version != moved.PublishedVersion {
		t.Fatalf("claim target projection: found=%t work=%+v err=%v", found, targetWork, err)
	}
	targetCanonical := []byte("# " + targetWork.Version.Title + "\n\n" + targetWork.Version.Body.Content)
	targetDigest := sha256.Sum256(targetCanonical)
	targetHash := hex.EncodeToString(targetDigest[:])
	if err = store.CompleteKnowledgePageProjection(t.Context(), targetWork.Lease, "body://page-transfer/target", int64(len(targetCanonical)), targetHash, targetWork.Page.ID+".md", strings.Repeat("b", 64)); err == nil || !strings.Contains(err.Error(), "page_projection_busy") {
		t.Fatalf("target projection replaced the source before durable deletion: %v", err)
	}

	lease, claimed, err = store.ClaimKnowledgeDocumentWork(t.Context(), manager.RuntimeID, "page-transfer-document-worker", time.Now().UTC(), time.Minute)
	if err != nil || !claimed || lease.DocumentID != documentID {
		t.Fatalf("claim source projection delete: lease=%+v claimed=%t err=%v", lease, claimed, err)
	}
	if err = store.StartKnowledgeDocumentDelete(t.Context(), lease); err != nil {
		t.Fatal(err)
	}
	if err = store.ApplyKnowledgeDocumentProgress(t.Context(), lease, persistence.KnowledgeDocumentProgress{Event: "delete_acknowledged"}); err != nil {
		t.Fatal(err)
	}
	lease, claimed, err = store.ClaimKnowledgeDocumentWork(t.Context(), manager.RuntimeID, "page-transfer-document-worker", time.Now().UTC(), time.Minute)
	if err != nil || !claimed {
		t.Fatalf("claim acknowledged source deletion: claimed=%t err=%v", claimed, err)
	}
	if err = store.ApplyKnowledgeDocumentProgress(t.Context(), lease, persistence.KnowledgeDocumentProgress{Event: "deleted"}); err != nil {
		t.Fatal(err)
	}
	if _, err = store.KnowledgeDocumentByRemoteID(t.Context(), source.ID, sourceID, oldRemoteID, manager); err == nil {
		t.Fatal("durably deleted source projection remained readable")
	}

	if err = store.CompleteKnowledgePageProjection(t.Context(), targetWork.Lease, "body://page-transfer/target", int64(len(targetCanonical)), targetHash, targetWork.Page.ID+".md", strings.Repeat("b", 64)); err != nil {
		t.Fatal(err)
	}
	relocated, err := store.KnowledgeDocumentRecord(t.Context(), documentID, manager)
	if err != nil || relocated.Document.ID != documentID || relocated.Document.LibraryID != target.ID || relocated.SourceID != targetSourceID || relocated.Document.State != "queued" || relocated.Document.IndexGeneration != 2 || relocated.RemoteID == oldRemoteID || relocated.PageProjection == nil || relocated.PageProjection.PageID != root.Page.ID || relocated.PageProjection.Version != moved.PublishedVersion {
		t.Fatalf("stable projection was not relocated to the target source: record=%+v err=%v", relocated, err)
	}
	if _, err = store.KnowledgeDocumentByRemoteID(t.Context(), source.ID, sourceID, oldRemoteID, manager); err == nil {
		t.Fatal("source remote became readable after target relocation")
	}
	if targetRecord, lookupErr := store.KnowledgeDocumentByRemoteID(t.Context(), target.ID, targetSourceID, relocated.RemoteID, manager); lookupErr != nil || targetRecord.Document.ID != documentID || targetRecord.Document.IndexGeneration != 2 {
		t.Fatalf("target source did not own the relocated stable document: record=%+v err=%v", targetRecord, lookupErr)
	}
}
