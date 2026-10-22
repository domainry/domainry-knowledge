package application

import (
	"context"
	"strconv"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func (s *Service) KnowledgePagePolls(ctx context.Context, libraryID, pageID string, a agentsdk.Authority) (knowledgesdk.KnowledgePagePollPage, error) {
	_, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPagePollsList, a)
	if err != nil {
		return knowledgesdk.KnowledgePagePollPage{}, err
	}
	repository, ok := s.repo.(knowledgesdk.PagePollService)
	if !ok {
		return knowledgesdk.KnowledgePagePollPage{}, conversationFailure("unavailable", "page_polls_unavailable")
	}
	result, err := repository.KnowledgePagePolls(ctx, libraryID, pageID, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPagePollsList, a)
	}
	return result, err
}

func (s *Service) CreateKnowledgePagePoll(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgePagePollCreate, a agentsdk.Authority) (knowledgesdk.KnowledgePagePollView, error) {
	_, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPagePollsCreate, a)
	if err != nil {
		return knowledgesdk.KnowledgePagePollView{}, err
	}
	repository, ok := s.repo.(knowledgesdk.PagePollService)
	if !ok {
		return knowledgesdk.KnowledgePagePollView{}, conversationFailure("unavailable", "page_polls_unavailable")
	}
	result, err := repository.CreateKnowledgePagePoll(ctx, libraryID, pageID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPagePollsCreate, a)
	}
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPagePollsCreate, "knowledge.page_poll.created", libraryID, pageID, result.Poll.ID, input.ClientID, result.Poll.Revision, nil, map[string]string{
			"source_block_id": result.Poll.SourceBlockID, "option_count": strconv.Itoa(len(result.Poll.Options)), "multiple": strconv.FormatBool(result.Poll.Multiple),
		}, a)
	}
	return result, err
}

func (s *Service) UpdateKnowledgePagePoll(ctx context.Context, libraryID, pageID, pollID string, input knowledgesdk.KnowledgePagePollUpdate, a agentsdk.Authority) (knowledgesdk.KnowledgePagePollView, error) {
	_, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPagePollsUpdate, a)
	if err != nil {
		return knowledgesdk.KnowledgePagePollView{}, err
	}
	repository, ok := s.repo.(knowledgesdk.PagePollService)
	if !ok {
		return knowledgesdk.KnowledgePagePollView{}, conversationFailure("unavailable", "page_polls_unavailable")
	}
	result, err := repository.UpdateKnowledgePagePoll(ctx, libraryID, pageID, pollID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPagePollsUpdate, a)
	}
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPagePollsUpdate, "knowledge.page_poll.updated", libraryID, pageID, result.Poll.ID, input.ClientID, result.Poll.Revision, map[string]string{
			"expected_revision": strconv.FormatInt(input.ExpectedRevision, 10),
		}, map[string]string{
			"status": result.Poll.Status, "option_count": strconv.Itoa(len(result.Poll.Options)), "multiple": strconv.FormatBool(result.Poll.Multiple),
		}, a)
	}
	return result, err
}

func (s *Service) VoteKnowledgePagePoll(ctx context.Context, libraryID, pageID, pollID string, input knowledgesdk.KnowledgePagePollVote, a agentsdk.Authority) (knowledgesdk.KnowledgePagePollView, error) {
	_, _, err := s.pageItemAccess(ctx, libraryID, pageID, knowledgesdk.ActionPagePollsVote, a)
	if err != nil {
		return knowledgesdk.KnowledgePagePollView{}, err
	}
	repository, ok := s.repo.(knowledgesdk.PagePollService)
	if !ok {
		return knowledgesdk.KnowledgePagePollView{}, conversationFailure("unavailable", "page_polls_unavailable")
	}
	result, err := repository.VoteKnowledgePagePoll(ctx, libraryID, pageID, pollID, input, a)
	if err == nil {
		err = s.recheckPageItemAction(ctx, libraryID, pageID, knowledgesdk.ActionPagePollsVote, a)
	}
	if err == nil {
		s.appendKnowledgeAudit(ctx, knowledgesdk.ActionPagePollsVote, "knowledge.page_poll.voted", libraryID, pageID, result.Poll.ID, input.ClientID, result.BallotRevision, map[string]string{
			"expected_ballot_revision": strconv.FormatInt(input.ExpectedBallotRevision, 10),
		}, map[string]string{
			"selection_count": strconv.Itoa(len(result.SelectedOptionIDs)),
		}, a)
	}
	return result, err
}
