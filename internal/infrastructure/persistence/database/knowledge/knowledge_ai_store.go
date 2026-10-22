package store

import (
	"context"
	"database/sql"
	"errors"
	"strings"
	"time"

	"github.com/domainry/domainry-foundation/entityid"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-orm/query"
)

const knowledgeAIMaximumResultBytes = 64 * 1024

func knowledgeAIExecutionScope(scope, executionID string) query.Predicate {
	return query.And(query.Equal("scope_key", scope), query.Equal("execution_id", executionID))
}

func validKnowledgeAIOperation(value string) bool {
	switch value {
	case knowledgesdk.KnowledgeAIOperationWrite,
		knowledgesdk.KnowledgeAIOperationSummarize,
		knowledgesdk.KnowledgeAIOperationTranslate,
		knowledgesdk.KnowledgeAIOperationRewrite,
		knowledgesdk.KnowledgeAIOperationAnswer:
		return true
	default:
		return false
	}
}

func validateKnowledgeAIExecutionCreate(in knowledgesdk.KnowledgeAIExecutionCreate) error {
	if !personalMemoryKey(in.ClientID) || !validKnowledgeAIOperation(in.Operation) ||
		!executionText(in.Prompt, 8192, false) || !executionText(in.Language, 64, false) ||
		(in.SourceScope != knowledgesdk.KnowledgeAISourcePublished && in.SourceScope != knowledgesdk.KnowledgeAISourceDraft) ||
		(in.BlockID != "" && !knowledgeBlockIDPattern.MatchString(in.BlockID)) {
		return conversationError("bad_request", "ai_execution_invalid")
	}
	if (in.Operation == knowledgesdk.KnowledgeAIOperationWrite || in.Operation == knowledgesdk.KnowledgeAIOperationAnswer) && strings.TrimSpace(in.Prompt) == "" {
		return conversationError("bad_request", "ai_execution_prompt_required")
	}
	if in.Operation == knowledgesdk.KnowledgeAIOperationTranslate && strings.TrimSpace(in.Language) == "" {
		return conversationError("bad_request", "ai_execution_language_required")
	}
	if in.SourceScope == knowledgesdk.KnowledgeAISourceDraft && !personalMemoryKey(in.SessionID) {
		return conversationError("bad_request", "ai_execution_session_required")
	}
	if in.SourceScope == knowledgesdk.KnowledgeAISourcePublished && in.SessionID != "" {
		return conversationError("bad_request", "ai_execution_session_invalid")
	}
	return nil
}

func knowledgeAISourceFromBody(scope, pageID, title, contentType string, version, draftRevision int64, body knowledgesdk.PageContent, blockID string) (knowledgesdk.KnowledgeAISource, string, error) {
	source := knowledgesdk.KnowledgeAISource{
		Scope: scope, PageID: pageID, Title: title, Version: version, DraftRevision: draftRevision,
		BlockID: blockID, ContentSHA256: body.ContentSHA256,
	}
	text := body.PlainText
	if blockID != "" {
		if contentType != knowledgesdk.KnowledgePageTypeDocument {
			return source, "", conversationError("bad_request", "ai_execution_block_unsupported")
		}
		block, digest, found, err := knowledgeAgentDocumentBlock(body.Content, blockID)
		if err != nil {
			return source, "", err
		}
		if !found {
			return source, "", conversationError("not_found", "ai_execution_source_not_found")
		}
		source.ContentSHA256 = digest
		text = knowledgeAgentDocumentBlockText(block)
	}
	if scope == knowledgesdk.KnowledgeAISourcePublished {
		reference := knowledgesdk.KnowledgeAgentReference{PageID: pageID, Version: version, BlockID: blockID, ContentSHA256: source.ContentSHA256}
		source.Reference = &reference
	}
	return source, text, nil
}

func (s *Store) knowledgeAIPublishedSource(ctx context.Context, tx *sql.Tx, library knowledgesdk.KnowledgeLibrary, page knowledgesdk.KnowledgePage, blockID string, a knowledgesdk.Authority) (knowledgesdk.KnowledgeAISource, string, error) {
	if page.PublishedVersion < 1 {
		return knowledgesdk.KnowledgeAISource{}, "", conversationError("conflict", "ai_execution_published_source_missing")
	}
	version, err := s.pageVersion(ctx, tx, page.ID, page.PublishedVersion, a)
	if err != nil {
		return knowledgesdk.KnowledgeAISource{}, "", err
	}
	if err = redactGridVersion(&version, library, a); err != nil {
		return knowledgesdk.KnowledgeAISource{}, "", err
	}
	source, text, err := knowledgeAISourceFromBody(knowledgesdk.KnowledgeAISourcePublished, page.ID, version.Title, version.ContentType, version.Version, 0, version.Body, blockID)
	if err == nil && source.Reference != nil {
		source.Reference.LibraryID = page.LibraryID
	}
	return source, text, err
}

func (s *Store) knowledgeAIDraftSource(ctx context.Context, tx *sql.Tx, libraryID, pageID, sessionID, blockID string, a knowledgesdk.Authority) (knowledgesdk.KnowledgeAISource, string, error) {
	library, _, draft, err := s.authorizeKnowledgeCollaboration(ctx, tx, libraryID, pageID, a)
	if err != nil {
		return knowledgesdk.KnowledgeAISource{}, "", err
	}
	if _, err = s.collaborationSession(ctx, tx, libraryID, pageID, sessionID, a); err != nil {
		return knowledgesdk.KnowledgeAISource{}, "", err
	}
	if draft.ContentType == knowledgesdk.KnowledgePageTypeMultidimensionalTable {
		draft.Body, _, err = redactGridBody(draft.Body, library, a)
		if err != nil {
			return knowledgesdk.KnowledgeAISource{}, "", err
		}
	}
	return knowledgeAISourceFromBody(knowledgesdk.KnowledgeAISourceDraft, pageID, draft.Title, draft.ContentType, 0, draft.DraftRevision, draft.Body, blockID)
}

func (s *Store) CreateKnowledgeAIExecution(ctx context.Context, libraryID, pageID string, in knowledgesdk.KnowledgeAIExecutionCreate, a knowledgesdk.Authority) (out knowledgesdk.KnowledgeAIExecution, err error) {
	if err = conversationAuthority(a); err != nil {
		return out, err
	}
	if !validLibraryID(libraryID) || !validKnowledgePageID(pageID) {
		return out, conversationError("bad_request", "ai_execution_invalid")
	}
	if err = validateKnowledgeAIExecutionCreate(in); err != nil {
		return out, err
	}
	requestKey, err := pageRequestKey("ai_execution_create", libraryID, pageID, in.ClientID, a)
	if err != nil {
		return out, err
	}
	err = s.mutateKnowledgeOperation(ctx, "knowledge_ai_execution_create", knowledgesdk.ActionAIExecutionsCreate, pageID, in.ClientID, in, a, func(tx *sql.Tx) (any, error) {
		library, readErr := s.libraryRecord(ctx, tx, libraryID, a)
		if readErr != nil {
			return nil, readErr
		}
		page, readErr := s.pageRecord(ctx, tx, libraryID, pageID, a)
		if readErr != nil || page.State != "active" {
			return nil, conversationError("not_found", "page_not_found")
		}
		var source knowledgesdk.KnowledgeAISource
		if in.SourceScope == knowledgesdk.KnowledgeAISourcePublished {
			source, _, readErr = s.knowledgeAIPublishedSource(ctx, tx, library, page, in.BlockID, a)
		} else {
			source, _, readErr = s.knowledgeAIDraftSource(ctx, tx, libraryID, pageID, in.SessionID, in.BlockID, a)
		}
		if readErr != nil {
			return nil, readErr
		}
		id, readErr := randomKnowledgeID("kaiexec_")
		if readErr != nil {
			return nil, readErr
		}
		now := time.Now().UTC().Truncate(time.Millisecond)
		execution := knowledgesdk.KnowledgeAIExecution{
			ID: id, LibraryID: libraryID, PageID: pageID, Operation: in.Operation, Prompt: in.Prompt, Language: in.Language,
			State: knowledgesdk.KnowledgeAIExecutionPending, Revision: 1, Source: source, CreatedByUserID: a.UserID, CreatedAt: now, UpdatedAt: now,
		}
		statement, args, buildErr := query.NewInsertBuilder(s.store.Renderer(), knowledgeAIExecutionTable).Columns(
			"scope_key", "execution_id", "library_id", "page_id", "runtime_id", "workspace_id", "user_id", "session_id",
			"state", "revision", "attempt", "not_before", "lease_until", "fence", "updated_at", "request_key", "request_hash", "payload_json",
		).Values(
			libraryScope(a), id, libraryID, pageID, a.RuntimeID, a.WorkspaceID, a.UserID, in.SessionID,
			execution.State, execution.Revision, 0, now.UnixMilli(), 0, 0, now.UnixMilli(), requestKey, conversationHash(in), conversationJSON(execution),
		).Build()
		if readErr = conversationExec(ctx, tx, statement, args, buildErr); readErr != nil {
			return nil, readErr
		}
		return execution, nil
	}, &out)
	return out, err
}

func (s *Store) KnowledgeAIExecution(ctx context.Context, libraryID, pageID, executionID string, a knowledgesdk.Authority) (out knowledgesdk.KnowledgeAIExecution, err error) {
	if conversationAuthority(a) != nil || !validLibraryID(libraryID) || !validKnowledgePageID(pageID) || entityid.Validate("kaiexec", executionID) != nil {
		return out, conversationError("bad_request", "ai_execution_invalid")
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		if _, readErr := s.libraryRecord(ctx, tx, libraryID, a); readErr != nil {
			return readErr
		}
		if _, readErr := s.pageRecord(ctx, tx, libraryID, pageID, a); readErr != nil {
			return readErr
		}
		found, readErr := s.executionRead(ctx, tx, knowledgeAIExecutionTable, knowledgeAIExecutionScope(libraryScope(a), executionID), &out)
		if readErr != nil {
			return readErr
		}
		if !found || out.LibraryID != libraryID || out.PageID != pageID || out.CreatedByUserID != a.UserID {
			return conversationError("not_found", "ai_execution_not_found")
		}
		return nil
	})
	return out, err
}

func (s *Store) ConfirmKnowledgeAIExecution(ctx context.Context, libraryID, pageID, executionID string, in knowledgesdk.KnowledgeAIExecutionConfirm, a knowledgesdk.Authority) (out knowledgesdk.KnowledgeAIExecution, err error) {
	if conversationAuthority(a) != nil || !validLibraryID(libraryID) || !validKnowledgePageID(pageID) || entityid.Validate("kaiexec", executionID) != nil || !personalMemoryKey(in.ClientID) || in.ExpectedRevision < 1 || !personalMemoryKey(in.SessionID) {
		return out, conversationError("bad_request", "ai_execution_confirmation_invalid")
	}
	err = s.mutateKnowledgeOperation(ctx, "knowledge_ai_execution_confirm", knowledgesdk.ActionAIExecutionsConfirm, executionID, in.ClientID, in, a, func(tx *sql.Tx) (any, error) {
		if _, _, _, readErr := s.authorizeKnowledgeCollaboration(ctx, tx, libraryID, pageID, a); readErr != nil {
			return nil, readErr
		}
		if _, readErr := s.collaborationSession(ctx, tx, libraryID, pageID, in.SessionID, a); readErr != nil {
			return nil, readErr
		}
		var execution knowledgesdk.KnowledgeAIExecution
		found, readErr := s.executionRead(ctx, tx, knowledgeAIExecutionTable, knowledgeAIExecutionScope(libraryScope(a), executionID), &execution)
		if readErr != nil {
			return nil, readErr
		}
		if !found || execution.LibraryID != libraryID || execution.PageID != pageID || execution.CreatedByUserID != a.UserID {
			return nil, conversationError("not_found", "ai_execution_not_found")
		}
		if execution.State != knowledgesdk.KnowledgeAIExecutionCompleted || execution.Revision != in.ExpectedRevision {
			return nil, conversationError("conflict", "ai_execution_confirmation_conflict")
		}
		if execution.Source.Scope == knowledgesdk.KnowledgeAISourceDraft {
			source, _, sourceErr := s.knowledgeAIDraftSource(ctx, tx, libraryID, pageID, in.SessionID, execution.Source.BlockID, a)
			if sourceErr != nil {
				return nil, sourceErr
			}
			if source.DraftRevision != execution.Source.DraftRevision || source.ContentSHA256 != execution.Source.ContentSHA256 {
				return nil, conversationError("conflict", "ai_execution_source_changed")
			}
		}
		now := time.Now().UTC().Truncate(time.Millisecond)
		execution.State, execution.Revision, execution.UpdatedAt, execution.ConfirmedAt = knowledgesdk.KnowledgeAIExecutionConfirmed, execution.Revision+1, now, now
		statement, args, buildErr := query.NewUpdateBuilder(s.store.Renderer(), knowledgeAIExecutionTable).Set("state", execution.State).Set("revision", execution.Revision).Set("updated_at", now.UnixMilli()).Set("payload_json", conversationJSON(execution)).Where(query.And(knowledgeAIExecutionScope(libraryScope(a), executionID), query.Equal("revision", in.ExpectedRevision), query.Equal("state", knowledgesdk.KnowledgeAIExecutionCompleted))).Build()
		if readErr = conversationCAS(ctx, tx, statement, args, buildErr); readErr != nil {
			return nil, readErr
		}
		return execution, nil
	}, &out)
	return out, err
}

func (s *Store) ClaimKnowledgeAIExecution(ctx context.Context, runtimeID string, now time.Time, leaseDuration time.Duration) (out knowledgesdk.KnowledgeAIExecutionWork, claimed bool, err error) {
	if strings.TrimSpace(runtimeID) == "" || leaseDuration <= 0 {
		return out, false, conversationError("bad_request", "ai_execution_claim_invalid")
	}
	now = now.UTC().Truncate(time.Millisecond)
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		statement, args, buildErr := query.NewSelectBuilder(s.store.Renderer(), knowledgeAIExecutionTable).Columns("scope_key", "workspace_id", "user_id", "session_id", "payload_json", "fence").Where(query.And(
			query.Equal("runtime_id", runtimeID), query.In("state", knowledgesdk.KnowledgeAIExecutionPending, knowledgesdk.KnowledgeAIExecutionRunning),
			query.LessThanOrEqual("not_before", now.UnixMilli()), query.LessThanOrEqual("lease_until", now.UnixMilli()),
		)).OrderBy(query.Ascending("not_before"), query.Ascending("execution_id")).Limit(1).Build()
		if buildErr != nil {
			return buildErr
		}
		var raw []byte
		var workspaceID, userID, sessionID string
		var fence int64
		if scanErr := tx.QueryRowContext(ctx, statement, args...).Scan(&out.ScopeKey, &workspaceID, &userID, &sessionID, &raw, &fence); errors.Is(scanErr, sql.ErrNoRows) {
			return nil
		} else if scanErr != nil {
			return scanErr
		}
		if readErr := unmarshalDurableJSON(raw, &out.Execution); readErr != nil {
			return readErr
		}
		out.Authority = knowledgesdk.Authority{Known: true, RuntimeID: runtimeID, WorkspaceID: workspaceID, UserID: userID}
		out.SessionID, out.Fence, out.LeaseExpiresAt = sessionID, fence+1, now.Add(leaseDuration).UTC().Truncate(time.Millisecond)
		out.Execution.State, out.Execution.Revision, out.Execution.Attempt, out.Execution.UpdatedAt = knowledgesdk.KnowledgeAIExecutionRunning, out.Execution.Revision+1, out.Execution.Attempt+1, now
		statement, args, buildErr = query.NewUpdateBuilder(s.store.Renderer(), knowledgeAIExecutionTable).Set("state", out.Execution.State).Set("revision", out.Execution.Revision).Set("attempt", out.Execution.Attempt).Set("lease_until", out.LeaseExpiresAt.UnixMilli()).Set("fence", out.Fence).Set("updated_at", now.UnixMilli()).Set("payload_json", conversationJSON(out.Execution)).Where(query.And(knowledgeAIExecutionScope(out.ScopeKey, out.Execution.ID), query.Equal("fence", fence))).Build()
		if readErr := conversationCAS(ctx, tx, statement, args, buildErr); readErr != nil {
			return readErr
		}
		claimed = true
		return nil
	})
	return out, claimed, err
}

func (s *Store) ReadKnowledgeAIExecutionSource(ctx context.Context, work knowledgesdk.KnowledgeAIExecutionWork, a knowledgesdk.Authority) (out knowledgesdk.KnowledgeAIGenerationInput, err error) {
	if conversationAuthority(a) != nil || libraryScope(a) != work.ScopeKey || a.RuntimeID != work.Authority.RuntimeID || a.WorkspaceID != work.Authority.WorkspaceID || a.UserID != work.Authority.UserID {
		return out, conversationError("forbidden", "ai_execution_authority_invalid")
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		library, readErr := s.libraryRecord(ctx, tx, work.Execution.LibraryID, a)
		if readErr != nil {
			return readErr
		}
		page, readErr := s.pageRecord(ctx, tx, work.Execution.LibraryID, work.Execution.PageID, a)
		if readErr != nil || page.State != "active" {
			return conversationError("not_found", "page_not_found")
		}
		effective, readErr := s.evaluateKnowledgePageAccess(ctx, tx, work.Execution.LibraryID, work.Execution.PageID, a)
		if readErr != nil || !effective.Allowed {
			return conversationError("not_found", "page_not_found")
		}
		var source knowledgesdk.KnowledgeAISource
		var text string
		if work.Execution.Source.Scope == knowledgesdk.KnowledgeAISourcePublished {
			version, versionErr := s.pageVersion(ctx, tx, page.ID, work.Execution.Source.Version, a)
			if versionErr != nil {
				return versionErr
			}
			if versionErr = redactGridVersion(&version, library, a); versionErr != nil {
				return versionErr
			}
			source, text, readErr = knowledgeAISourceFromBody(knowledgesdk.KnowledgeAISourcePublished, page.ID, version.Title, version.ContentType, version.Version, 0, version.Body, work.Execution.Source.BlockID)
			if readErr == nil && source.Reference != nil {
				source.Reference.LibraryID = work.Execution.LibraryID
			}
		} else if work.Execution.Source.Scope == knowledgesdk.KnowledgeAISourceDraft {
			source, text, readErr = s.knowledgeAIDraftSource(ctx, tx, work.Execution.LibraryID, work.Execution.PageID, work.SessionID, work.Execution.Source.BlockID, a)
		} else {
			return conversationError("internal", "ai_execution_source_invalid")
		}
		if readErr != nil {
			return readErr
		}
		if source.Version != work.Execution.Source.Version || source.DraftRevision != work.Execution.Source.DraftRevision || source.ContentSHA256 != work.Execution.Source.ContentSHA256 {
			return conversationError("conflict", "ai_execution_source_changed")
		}
		out = knowledgesdk.KnowledgeAIGenerationInput{ExecutionID: work.Execution.ID, Operation: work.Execution.Operation, Prompt: work.Execution.Prompt, Language: work.Execution.Language, Source: source, SourceText: text}
		return nil
	})
	return out, err
}

func (s *Store) CompleteKnowledgeAIExecution(ctx context.Context, work knowledgesdk.KnowledgeAIExecutionWork, result knowledgesdk.KnowledgeAIGenerationResult, errorCode string) error {
	if !executionText(result.Text, knowledgeAIMaximumResultBytes, false) || !executionText(result.Provider, 255, false) || !executionText(result.Model, 255, false) || !executionText(errorCode, 96, false) {
		return conversationError("bad_request", "ai_execution_result_invalid")
	}
	now := time.Now().UTC().Truncate(time.Millisecond)
	if errorCode != "" {
		work.Execution.State, work.Execution.Result, work.Execution.ErrorCode = knowledgesdk.KnowledgeAIExecutionFailed, "", errorCode
	} else {
		if strings.TrimSpace(result.Text) == "" || strings.TrimSpace(result.Provider) == "" || strings.TrimSpace(result.Model) == "" {
			return conversationError("bad_request", "ai_execution_result_invalid")
		}
		work.Execution.State, work.Execution.Result, work.Execution.ErrorCode = knowledgesdk.KnowledgeAIExecutionCompleted, result.Text, ""
		work.Execution.Provider, work.Execution.Model = result.Provider, result.Model
	}
	work.Execution.Revision++
	work.Execution.UpdatedAt = now
	return s.transaction(ctx, func(tx *sql.Tx) error {
		statement, args, buildErr := query.NewUpdateBuilder(s.store.Renderer(), knowledgeAIExecutionTable).Set("state", work.Execution.State).Set("revision", work.Execution.Revision).Set("lease_until", 0).Set("updated_at", now.UnixMilli()).Set("payload_json", conversationJSON(work.Execution)).Where(query.And(knowledgeAIExecutionScope(work.ScopeKey, work.Execution.ID), query.Equal("state", knowledgesdk.KnowledgeAIExecutionRunning), query.Equal("fence", work.Fence))).Build()
		return conversationCAS(ctx, tx, statement, args, buildErr)
	})
}

var _ knowledgesdk.KnowledgeAIRepository = (*Store)(nil)
