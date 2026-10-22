package store

import (
	"testing"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func TestKnowledgePagePersonalNavigationCollectionsAndTrash(t *testing.T) {
	store, authority, library, page := pageFixture(t)

	initial, err := store.KnowledgePagePersonalState(t.Context(), library.ID, page.Page.ID, authority)
	if err != nil || initial.Revision != 0 || initial.Favorite || initial.Subscribed || initial.ShortcutRank != "" || initial.LastEditedAt.IsZero() {
		t.Fatalf("new page did not enter recent edits without changing preference revision: %+v err=%v", initial, err)
	}
	state, err := store.SetKnowledgePagePersonalState(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePagePersonalStateWrite{
		ClientID: "navigation-preferences", ExpectedRevision: 0, Favorite: true, Subscribed: true, ShortcutRank: "a0",
	}, authority)
	if err != nil || state.Revision != 1 || !state.Favorite || state.FavoriteAt.IsZero() || !state.Subscribed || state.SubscribedAt.IsZero() || state.ShortcutRank != "a0" {
		t.Fatalf("personal preferences were not persisted: %+v err=%v", state, err)
	}
	replay, err := store.SetKnowledgePagePersonalState(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePagePersonalStateWrite{
		ClientID: "navigation-preferences", ExpectedRevision: 0, Favorite: true, Subscribed: true, ShortcutRank: "a0",
	}, authority)
	if err != nil || replay.Revision != state.Revision || !replay.UpdatedAt.Equal(state.UpdatedAt) {
		t.Fatalf("personal preference replay was not idempotent: %+v err=%v", replay, err)
	}

	viewed, err := store.RecordKnowledgePageView(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageViewRecord{ClientID: "navigation-view"}, authority)
	if err != nil || viewed.LastViewedAt.IsZero() || viewed.Revision != state.Revision {
		t.Fatalf("authorized view was not recorded independently of preference revision: %+v err=%v", viewed, err)
	}
	page = savePageFixture(t, store, authority, library, page, "navigation-edit", "导航状态", "已编辑")
	edited, err := store.KnowledgePagePersonalState(t.Context(), library.ID, page.Page.ID, authority)
	if err != nil || edited.LastEditedAt.IsZero() || edited.Revision != state.Revision {
		t.Fatalf("successful page mutation did not update recent edits: %+v err=%v", edited, err)
	}

	for _, kind := range []knowledgesdk.KnowledgePageCollectionKind{
		knowledgesdk.KnowledgePageCollectionFavorites,
		knowledgesdk.KnowledgePageCollectionSubscribed,
		knowledgesdk.KnowledgePageCollectionShortcuts,
		knowledgesdk.KnowledgePageCollectionRecentViews,
		knowledgesdk.KnowledgePageCollectionRecentEdits,
	} {
		collection, listErr := store.KnowledgePageCollection(t.Context(), library.ID, kind, "", 20, authority)
		if listErr != nil || len(collection.Items) != 1 || collection.Items[0].Page.ID != page.Page.ID || collection.Items[0].State.UserID != authority.UserID {
			t.Fatalf("collection %s did not return the authorized page: %+v err=%v", kind, collection, listErr)
		}
	}

	archived, err := store.SetKnowledgePageArchived(t.Context(), library.ID, page.Page.ID, true, knowledgesdk.KnowledgePageStateWrite{ClientID: "navigation-archive", ExpectedRevision: page.Page.Revision}, authority)
	if err != nil {
		t.Fatal(err)
	}
	favorites, err := store.KnowledgePageCollection(t.Context(), library.ID, knowledgesdk.KnowledgePageCollectionFavorites, "", 20, authority)
	if err != nil || len(favorites.Items) != 0 {
		t.Fatalf("archived pages must leave active navigation collections: %+v err=%v", favorites, err)
	}
	trash, err := store.KnowledgePageCollection(t.Context(), library.ID, knowledgesdk.KnowledgePageCollectionTrash, "", 20, authority)
	if err != nil || len(trash.Items) != 1 || trash.Items[0].Page.ID != page.Page.ID || trash.Items[0].Page.Revision != archived.Revision {
		t.Fatalf("recycle bin did not expose the restorable archived page: %+v err=%v", trash, err)
	}
}

func TestKnowledgePageCollectionsRecheckCurrentMembership(t *testing.T) {
	store, manager, library, page := pageFixture(t)
	page = publishPageFixture(t, store, manager, library, page, "navigation-publish")
	reader := agentsdk.Authority{Known: true, RuntimeID: manager.RuntimeID, WorkspaceID: manager.WorkspaceID, UserID: "reader", RoleKey: "reader"}
	if _, err := store.SetKnowledgeLibraryMember(t.Context(), library.ID, reader.UserID, agentsdk.KnowledgeLibraryMemberWrite{Role: "reader", ExpectedRevision: library.Revision}, manager); err != nil {
		t.Fatal(err)
	}
	if _, err := store.SetKnowledgePagePersonalState(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePagePersonalStateWrite{ClientID: "reader-favorite", Favorite: true}, reader); err != nil {
		t.Fatal(err)
	}
	current, err := store.KnowledgeLibrary(t.Context(), library.ID, manager)
	if err != nil {
		t.Fatal(err)
	}
	if _, err = store.RemoveKnowledgeLibraryMember(t.Context(), library.ID, reader.UserID, current.Revision, manager); err != nil {
		t.Fatal(err)
	}
	if _, err = store.KnowledgePageCollection(t.Context(), library.ID, knowledgesdk.KnowledgePageCollectionFavorites, "", 20, reader); err == nil {
		t.Fatal("revoked reader retained a favorite collection")
	}
}
