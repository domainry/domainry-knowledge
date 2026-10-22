package store

import (
	"strconv"
	"testing"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
)

func requirePhysicalCursor(t *testing.T, cursor, businessID string) {
	t.Helper()
	if cursor == "" || cursor == businessID {
		t.Fatalf("cursor must be the physical id, cursor=%q business_id=%q", cursor, businessID)
	}
	id, err := strconv.ParseInt(cursor, 10, 64)
	if err != nil || id < 1 {
		t.Fatalf("cursor must be a positive bigint rendered as decimal text: %q err=%v", cursor, err)
	}
}

func TestKnowledgePageCommentsUsePhysicalIDCursor(t *testing.T) {
	store, authority, library, page := pageFixture(t)
	page = savePageFixture(t, store, authority, library, page, "comment-cursor-save", "评论分页", "分页正文")
	page = publishPageFixture(t, store, authority, library, page, "comment-cursor-publish")
	first, err := store.CreateKnowledgePageComment(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageCommentCreate{
		ClientID: "comment-cursor-1", PublishedVersion: page.Page.PublishedVersion,
		Anchor: knowledgesdk.KnowledgePageCommentAnchor{NodeID: "block-1", Quote: "分页正文"}, Body: "第一条",
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	second, err := store.CreateKnowledgePageComment(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageCommentCreate{
		ClientID: "comment-cursor-2", PublishedVersion: page.Page.PublishedVersion,
		Anchor: knowledgesdk.KnowledgePageCommentAnchor{NodeID: "block-1", Quote: "分页正文"}, Body: "第二条",
	}, authority)
	if err != nil {
		t.Fatal(err)
	}

	firstPage, err := store.KnowledgePageComments(t.Context(), library.ID, page.Page.ID, "", 1, false, authority)
	if err != nil || len(firstPage.Items) != 1 || firstPage.Items[0].ID != first.ID || firstPage.Complete {
		t.Fatalf("first comment page mismatch: page=%+v err=%v", firstPage, err)
	}
	requirePhysicalCursor(t, firstPage.NextAfter, first.ID)
	secondPage, err := store.KnowledgePageComments(t.Context(), library.ID, page.Page.ID, firstPage.NextAfter, 1, false, authority)
	if err != nil || len(secondPage.Items) != 1 || secondPage.Items[0].ID != second.ID || !secondPage.Complete || secondPage.NextAfter != "" {
		t.Fatalf("second comment page mismatch: page=%+v err=%v", secondPage, err)
	}
	if _, err = store.KnowledgePageComments(t.Context(), library.ID, page.Page.ID, first.ID, 1, false, authority); err == nil {
		t.Fatal("business comment id was accepted as a physical cursor")
	}
}

func TestKnowledgeLibrariesUsePhysicalIDCursor(t *testing.T) {
	store, _ := openSubjectKnowledgeStore(t)
	authority := agentsdk.Authority{Known: true, RuntimeID: "library-cursor-runtime", WorkspaceID: "library-cursor-workspace", UserID: "alice", RoleKey: "editor"}
	first, err := store.CreateKnowledgeLibrary(t.Context(), agentsdk.KnowledgeLibraryCreate{ClientID: "library-cursor-1", Kind: "shared", Name: "资料库一"}, authority)
	if err != nil {
		t.Fatal(err)
	}
	second, err := store.CreateKnowledgeLibrary(t.Context(), agentsdk.KnowledgeLibraryCreate{ClientID: "library-cursor-2", Kind: "shared", Name: "资料库二"}, authority)
	if err != nil {
		t.Fatal(err)
	}

	firstPage, err := store.KnowledgeLibraries(t.Context(), "", 1, authority)
	if err != nil || len(firstPage.Items) != 1 || firstPage.Items[0].ID != first.ID || firstPage.Complete {
		t.Fatalf("first library page mismatch: page=%+v err=%v", firstPage, err)
	}
	requirePhysicalCursor(t, firstPage.NextAfter, first.ID)
	secondPage, err := store.KnowledgeLibraries(t.Context(), firstPage.NextAfter, 1, authority)
	if err != nil || len(secondPage.Items) != 1 || secondPage.Items[0].ID != second.ID || !secondPage.Complete || secondPage.NextAfter != "" {
		t.Fatalf("second library page mismatch: page=%+v err=%v", secondPage, err)
	}
	if _, err = store.KnowledgeLibraries(t.Context(), first.ID, 1, authority); err == nil {
		t.Fatal("business library id was accepted as a physical cursor")
	}
}

func TestKnowledgePageSharesUsePhysicalIDCursor(t *testing.T) {
	store, manager, library, page := publishedPageShareFixture(t)
	first, err := store.CreateKnowledgePageShare(t.Context(), library.ID, page.Page.ID, pageShareCreate(
		knowledgesdk.KnowledgePageShareUser,
		knowledgesdk.KnowledgeAccessSubject{Type: knowledgesdk.KnowledgeSubjectUser, ID: "bob"},
		knowledgesdk.KnowledgePageShareScopePage, "share-cursor-1", "",
	), manager)
	if err != nil {
		t.Fatal(err)
	}
	second, err := store.CreateKnowledgePageShare(t.Context(), library.ID, page.Page.ID, pageShareCreate(
		knowledgesdk.KnowledgePageShareUser,
		knowledgesdk.KnowledgeAccessSubject{Type: knowledgesdk.KnowledgeSubjectUser, ID: "carol"},
		knowledgesdk.KnowledgePageShareScopePage, "share-cursor-2", "",
	), manager)
	if err != nil {
		t.Fatal(err)
	}

	firstPage, err := store.KnowledgePageShares(t.Context(), library.ID, page.Page.ID, "", 1, manager)
	if err != nil || len(firstPage.Items) != 1 || firstPage.Items[0].ID != first.ID || firstPage.Complete {
		t.Fatalf("first share page mismatch: page=%+v err=%v", firstPage, err)
	}
	requirePhysicalCursor(t, firstPage.NextAfter, first.ID)
	secondPage, err := store.KnowledgePageShares(t.Context(), library.ID, page.Page.ID, firstPage.NextAfter, 1, manager)
	if err != nil || len(secondPage.Items) != 1 || secondPage.Items[0].ID != second.ID || !secondPage.Complete || secondPage.NextAfter != "" {
		t.Fatalf("second share page mismatch: page=%+v err=%v", secondPage, err)
	}
	if _, err = store.KnowledgePageShares(t.Context(), library.ID, page.Page.ID, first.ID, 1, manager); err == nil {
		t.Fatal("business share id was accepted as a physical cursor")
	}
}

func TestKnowledgePageTemplatesUsePhysicalIDCursor(t *testing.T) {
	store, authority, library, root := pageFixture(t)
	first, err := store.CreateKnowledgePageTemplate(t.Context(), library.ID, knowledgesdk.KnowledgePageTemplateCreate{
		ClientID: "template-cursor-1", SourcePageID: root.Page.ID, Title: "模板一",
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	second, err := store.CreateKnowledgePageTemplate(t.Context(), library.ID, knowledgesdk.KnowledgePageTemplateCreate{
		ClientID: "template-cursor-2", SourcePageID: root.Page.ID, Title: "模板二",
	}, authority)
	if err != nil {
		t.Fatal(err)
	}

	firstPage, err := store.KnowledgePageTemplates(t.Context(), library.ID, "", 1, authority)
	if err != nil || len(firstPage.Items) != 1 || firstPage.Items[0].ID != first.ID || firstPage.Complete {
		t.Fatalf("first template page mismatch: page=%+v err=%v", firstPage, err)
	}
	requirePhysicalCursor(t, firstPage.NextAfter, first.ID)
	secondPage, err := store.KnowledgePageTemplates(t.Context(), library.ID, firstPage.NextAfter, 1, authority)
	if err != nil || len(secondPage.Items) != 1 || secondPage.Items[0].ID != second.ID || !secondPage.Complete || secondPage.NextAfter != "" {
		t.Fatalf("second template page mismatch: page=%+v err=%v", secondPage, err)
	}
	if _, err = store.KnowledgePageTemplates(t.Context(), library.ID, first.ID, 1, authority); err == nil {
		t.Fatal("business template id was accepted as a physical cursor")
	}
}

func TestKnowledgeDocumentsUsePhysicalIDCursor(t *testing.T) {
	store, authority, library, _ := pageFixture(t)
	source := conversationHash([]string{"document-cursor-source", library.ID})
	if err := store.ActivateKnowledgeDocumentSource(t.Context(), agentsdk.KnowledgeDocumentStorageScope{
		RuntimeID: authority.RuntimeID, WorkspaceID: authority.WorkspaceID, LibraryID: library.ID,
	}, source); err != nil {
		t.Fatal(err)
	}
	reserve := func(client, filename string) persistence.KnowledgeDocumentRecord {
		t.Helper()
		body := []byte(client)
		record, err := store.ReserveKnowledgeDocument(t.Context(), persistence.KnowledgeDocumentReserve{
			LibraryID: library.ID, ClientID: client, Filename: filename, ContentType: "text/plain",
			SHA256: knowledgeTestDigest(body), Bytes: int64(len(body)), SourceID: source,
		}, authority)
		if err != nil {
			t.Fatal(err)
		}
		return record
	}
	first := reserve("document-cursor-1", "first.txt")
	second := reserve("document-cursor-2", "second.txt")

	firstPage, err := store.KnowledgeDocuments(t.Context(), library.ID, "", 1, authority)
	if err != nil || len(firstPage.Items) != 1 || firstPage.Items[0].ID != first.Document.ID || firstPage.Complete {
		t.Fatalf("first document page mismatch: page=%+v err=%v", firstPage, err)
	}
	requirePhysicalCursor(t, firstPage.NextAfter, first.Document.ID)
	secondPage, err := store.KnowledgeDocuments(t.Context(), library.ID, firstPage.NextAfter, 1, authority)
	if err != nil || len(secondPage.Items) != 1 || secondPage.Items[0].ID != second.Document.ID || !secondPage.Complete || secondPage.NextAfter != "" {
		t.Fatalf("second document page mismatch: page=%+v err=%v", secondPage, err)
	}
	if _, err = store.KnowledgeDocuments(t.Context(), library.ID, first.Document.ID, 1, authority); err == nil {
		t.Fatal("business document id was accepted as a physical cursor")
	}
}
