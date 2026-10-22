package store

import (
	"strings"
	"sync"
	"testing"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func pollResultVotes(view knowledgesdk.KnowledgePagePollView, optionID string) int64 {
	for _, result := range view.Results {
		if result.OptionID == optionID {
			return result.Votes
		}
	}
	return -1
}

func TestKnowledgePagePollBallotsAggregateIndependentlyAndUsePerUserCAS(t *testing.T) {
	store, manager, library, page := pageFixture(t)
	var err error
	library, err = store.SetKnowledgeLibraryMember(t.Context(), library.ID, "bob", agentsdk.KnowledgeLibraryMemberWrite{Role: "reader", ExpectedRevision: library.Revision}, manager)
	if err != nil {
		t.Fatal(err)
	}
	library, err = store.SetKnowledgeLibraryMember(t.Context(), library.ID, "carol", agentsdk.KnowledgeLibraryMemberWrite{Role: "reader", ExpectedRevision: library.Revision}, manager)
	if err != nil {
		t.Fatal(err)
	}
	create := knowledgesdk.KnowledgePagePollCreate{ClientID: "poll-create-1", SourceBlockID: "poll-block-1", Question: "本周发布吗？", Options: []string{"发布", "延期"}}
	created, err := store.CreateKnowledgePagePoll(t.Context(), library.ID, page.Page.ID, create, manager)
	if err != nil {
		t.Fatal(err)
	}
	if created.Poll.Revision != 1 || created.Poll.Status != knowledgesdk.KnowledgePollStatusOpen || created.TotalVoters != 0 || len(created.Results) != 2 {
		t.Fatalf("created poll does not preserve the poll protocol: %+v", created)
	}
	replayed, err := store.CreateKnowledgePagePoll(t.Context(), library.ID, page.Page.ID, create, manager)
	if err != nil || replayed.Poll.ID != created.Poll.ID || replayed.Poll.Revision != created.Poll.Revision {
		t.Fatalf("poll create retry did not return the durable receipt: replayed=%+v err=%v", replayed, err)
	}

	bob := agentsdk.Authority{Known: true, RuntimeID: manager.RuntimeID, WorkspaceID: manager.WorkspaceID, UserID: "bob", RoleKey: "reader"}
	carol := agentsdk.Authority{Known: true, RuntimeID: manager.RuntimeID, WorkspaceID: manager.WorkspaceID, UserID: "carol", RoleKey: "reader"}
	votes := []struct {
		authority agentsdk.Authority
		clientID  string
		optionID  string
	}{
		{authority: bob, clientID: "poll-vote-bob-1", optionID: created.Poll.Options[0].ID},
		{authority: carol, clientID: "poll-vote-carol-1", optionID: created.Poll.Options[1].ID},
	}
	errors := make(chan error, len(votes))
	var wait sync.WaitGroup
	for _, vote := range votes {
		vote := vote
		wait.Add(1)
		go func() {
			defer wait.Done()
			_, voteErr := store.VoteKnowledgePagePoll(t.Context(), library.ID, page.Page.ID, created.Poll.ID, knowledgesdk.KnowledgePagePollVote{ClientID: vote.clientID, ExpectedBallotRevision: 0, OptionIDs: []string{vote.optionID}}, vote.authority)
			errors <- voteErr
		}()
	}
	wait.Wait()
	close(errors)
	for voteErr := range errors {
		if voteErr != nil {
			t.Fatal(voteErr)
		}
	}

	listed, err := store.KnowledgePagePolls(t.Context(), library.ID, page.Page.ID, manager)
	if err != nil || len(listed.Items) != 1 {
		t.Fatalf("poll list failed: %+v err=%v", listed, err)
	}
	aggregate := listed.Items[0]
	if aggregate.TotalVoters != 2 || aggregate.TotalSelections != 2 || pollResultVotes(aggregate, created.Poll.Options[0].ID) != 1 || pollResultVotes(aggregate, created.Poll.Options[1].ID) != 1 || len(aggregate.SelectedOptionIDs) != 0 {
		t.Fatalf("independent ballots did not aggregate or leaked another user's selection: %+v", aggregate)
	}
	bobView, err := store.KnowledgePagePolls(t.Context(), library.ID, page.Page.ID, bob)
	if err != nil || len(bobView.Items) != 1 || bobView.Items[0].BallotRevision != 1 || len(bobView.Items[0].SelectedOptionIDs) != 1 || bobView.Items[0].SelectedOptionIDs[0] != created.Poll.Options[0].ID {
		t.Fatalf("caller ballot projection is invalid: %+v err=%v", bobView, err)
	}
	bobReplay, err := store.VoteKnowledgePagePoll(t.Context(), library.ID, page.Page.ID, created.Poll.ID, knowledgesdk.KnowledgePagePollVote{ClientID: "poll-vote-bob-1", ExpectedBallotRevision: 0, OptionIDs: []string{created.Poll.Options[0].ID}}, bob)
	if err != nil || bobReplay.BallotRevision != 1 {
		t.Fatalf("ballot retry did not return the durable receipt: %+v err=%v", bobReplay, err)
	}
	bobChanged, err := store.VoteKnowledgePagePoll(t.Context(), library.ID, page.Page.ID, created.Poll.ID, knowledgesdk.KnowledgePagePollVote{ClientID: "poll-vote-bob-2", ExpectedBallotRevision: 1, OptionIDs: []string{created.Poll.Options[1].ID}}, bob)
	if err != nil || bobChanged.BallotRevision != 2 || bobChanged.TotalVoters != 2 || pollResultVotes(bobChanged, created.Poll.Options[0].ID) != 0 || pollResultVotes(bobChanged, created.Poll.Options[1].ID) != 2 {
		t.Fatalf("ballot replacement lost aggregate votes: %+v err=%v", bobChanged, err)
	}
	if _, err = store.VoteKnowledgePagePoll(t.Context(), library.ID, page.Page.ID, created.Poll.ID, knowledgesdk.KnowledgePagePollVote{ClientID: "poll-vote-bob-stale", ExpectedBallotRevision: 1, OptionIDs: []string{created.Poll.Options[0].ID}}, bob); err == nil || !strings.Contains(err.Error(), "page_poll_ballot_revision_conflict") {
		t.Fatalf("stale ballot revision was accepted: %v", err)
	}

	structural := knowledgesdk.KnowledgePagePollUpdate{ClientID: "poll-update-structure", ExpectedRevision: created.Poll.Revision, Question: created.Poll.Question, Options: []knowledgesdk.KnowledgePagePollOptionWrite{{ID: created.Poll.Options[0].ID, Label: "立即发布"}, {ID: created.Poll.Options[1].ID, Label: created.Poll.Options[1].Label}}, Status: created.Poll.Status}
	if _, err = store.UpdateKnowledgePagePoll(t.Context(), library.ID, page.Page.ID, created.Poll.ID, structural, manager); err == nil || !strings.Contains(err.Error(), "page_poll_structure_locked") {
		t.Fatalf("poll structure changed after ballots existed: %v", err)
	}
	closePoll := knowledgesdk.KnowledgePagePollUpdate{ClientID: "poll-update-close", ExpectedRevision: created.Poll.Revision, Question: created.Poll.Question, Options: []knowledgesdk.KnowledgePagePollOptionWrite{{ID: created.Poll.Options[0].ID, Label: created.Poll.Options[0].Label}, {ID: created.Poll.Options[1].ID, Label: created.Poll.Options[1].Label}}, Status: knowledgesdk.KnowledgePollStatusClosed}
	closed, err := store.UpdateKnowledgePagePoll(t.Context(), library.ID, page.Page.ID, created.Poll.ID, closePoll, manager)
	if err != nil || closed.Poll.Revision != 2 || closed.Poll.Status != knowledgesdk.KnowledgePollStatusClosed {
		t.Fatalf("poll could not be closed without rewriting ballots: %+v err=%v", closed, err)
	}
	if _, err = store.VoteKnowledgePagePoll(t.Context(), library.ID, page.Page.ID, created.Poll.ID, knowledgesdk.KnowledgePagePollVote{ClientID: "poll-vote-carol-closed", ExpectedBallotRevision: 1, OptionIDs: []string{created.Poll.Options[0].ID}}, carol); err == nil || !strings.Contains(err.Error(), "page_poll_closed") {
		t.Fatalf("closed poll accepted a ballot: %v", err)
	}

	currentPage, err := store.KnowledgePage(t.Context(), library.ID, page.Page.ID, true, manager)
	if err != nil {
		t.Fatal(err)
	}
	versions, err := store.KnowledgePageVersions(t.Context(), library.ID, page.Page.ID, 0, 20, manager)
	if err != nil {
		t.Fatal(err)
	}
	if currentPage.Page.Revision != page.Page.Revision || currentPage.Draft.DraftRevision != page.Draft.DraftRevision || len(versions.Items) != 0 {
		t.Fatalf("poll state leaked into page/draft/version state: page=%+v versions=%+v", currentPage, versions.Items)
	}
}

func TestKnowledgePagePollRejectsInvalidShape(t *testing.T) {
	store, manager, library, page := pageFixture(t)
	_, err := store.CreateKnowledgePagePoll(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePagePollCreate{ClientID: "poll-invalid", SourceBlockID: "poll-block-invalid", Question: "问题", Options: []string{"重复", "重复"}}, manager)
	if err == nil || !strings.Contains(err.Error(), "page_poll_options_invalid") {
		t.Fatalf("duplicate poll options were accepted: %v", err)
	}
}
