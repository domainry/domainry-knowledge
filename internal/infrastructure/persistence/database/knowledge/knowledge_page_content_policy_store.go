package store

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-orm/query"
)

func knowledgePageContentDecision(policy knowledgesdk.KnowledgePageContentPolicy, sourcePageID, pageID, operation string) knowledgesdk.KnowledgePageContentDecision {
	return knowledgesdk.KnowledgePageContentDecision{
		Operation: operation, Allowed: contentPolicyAllows(policy, operation), SourcePageID: sourcePageID,
		Scope: policy.Scope, Revision: policy.Revision, LibraryID: policy.LibraryID, PageID: pageID,
		Classification: policy.Classification, WatermarkMode: policy.WatermarkMode, SensitiveAction: policy.SensitiveAction,
		ApprovalRequired: policy.RequireApproval,
	}
}

func knowledgePageContentGovernance(policy knowledgesdk.KnowledgePageContentPolicy, a agentsdk.Authority) knowledgesdk.KnowledgePageContentGovernance {
	out := knowledgesdk.KnowledgePageContentGovernance{Classification: policy.Classification}
	if policy.WatermarkMode == knowledgesdk.KnowledgePageWatermarkIdentity {
		now := time.Now().UTC().Truncate(time.Minute)
		out.DynamicWatermark = &knowledgesdk.KnowledgePageDynamicWatermark{Text: fmt.Sprintf("%s · %s", a.UserID, now.Format("2006-01-02 15:04 UTC")), GeneratedAt: now}
	}
	return out
}

func defaultKnowledgePageContentPolicy(libraryID, pageID string) knowledgesdk.KnowledgePageContentPolicy {
	return knowledgesdk.KnowledgePageContentPolicy{
		PageID: pageID, LibraryID: libraryID, Scope: knowledgesdk.KnowledgePageContentPolicyPage,
		AllowCopy: true, AllowDownload: true, AllowPrint: true, AllowExport: true, AllowDuplicate: true,
		Classification: knowledgesdk.KnowledgePageClassificationInternal, WatermarkMode: knowledgesdk.KnowledgePageWatermarkNone,
		SensitiveAction: knowledgesdk.KnowledgePageSensitiveContentAllow,
	}
}

func validKnowledgePageContentPolicyScope(value string) bool {
	return value == knowledgesdk.KnowledgePageContentPolicyPage || value == knowledgesdk.KnowledgePageContentPolicySubtree
}

func validKnowledgePageContentOperation(value string) bool {
	switch value {
	case knowledgesdk.KnowledgePageContentOperationCopy, knowledgesdk.KnowledgePageContentOperationDownload, knowledgesdk.KnowledgePageContentOperationPrint, knowledgesdk.KnowledgePageContentOperationExport, knowledgesdk.KnowledgePageContentOperationDuplicate, knowledgesdk.KnowledgePageContentOperationShare:
		return true
	default:
		return false
	}
}

func validKnowledgePageClassification(value string) bool {
	switch value {
	case knowledgesdk.KnowledgePageClassificationPublic, knowledgesdk.KnowledgePageClassificationInternal, knowledgesdk.KnowledgePageClassificationConfidential, knowledgesdk.KnowledgePageClassificationRestricted:
		return true
	default:
		return false
	}
}

func validKnowledgePageWatermarkMode(value string) bool {
	return value == knowledgesdk.KnowledgePageWatermarkNone || value == knowledgesdk.KnowledgePageWatermarkIdentity
}

func validKnowledgePageSensitiveAction(value string) bool {
	return value == knowledgesdk.KnowledgePageSensitiveContentAllow || value == knowledgesdk.KnowledgePageSensitiveContentBlockOutbound
}

func contentPolicyAllows(policy knowledgesdk.KnowledgePageContentPolicy, operation string) bool {
	if policy.SensitiveAction == knowledgesdk.KnowledgePageSensitiveContentBlockOutbound {
		return false
	}
	switch operation {
	case knowledgesdk.KnowledgePageContentOperationCopy:
		return policy.AllowCopy
	case knowledgesdk.KnowledgePageContentOperationDownload:
		return policy.AllowDownload
	case knowledgesdk.KnowledgePageContentOperationPrint:
		return policy.AllowPrint
	case knowledgesdk.KnowledgePageContentOperationExport:
		return policy.AllowExport
	case knowledgesdk.KnowledgePageContentOperationDuplicate:
		return policy.AllowDuplicate
	case knowledgesdk.KnowledgePageContentOperationShare:
		return true
	default:
		return false
	}
}

func (s *Store) knowledgePageContentPolicyRecord(ctx context.Context, db conversationDB, libraryID, pageID string, a agentsdk.Authority) (knowledgesdk.KnowledgePageContentPolicy, bool, error) {
	out := defaultKnowledgePageContentPolicy(libraryID, pageID)
	found, err := s.executionRead(ctx, db, knowledgePageContentPolicyTable, pageScope(a, pageID), &out)
	if err != nil {
		return out, false, err
	}
	if found && (out.LibraryID != libraryID || out.PageID != pageID || !validKnowledgePageContentPolicyScope(out.Scope) || !validKnowledgePageClassification(out.Classification) || !validKnowledgePageWatermarkMode(out.WatermarkMode) || !validKnowledgePageSensitiveAction(out.SensitiveAction) || out.Revision < 1) {
		return out, false, conversationError("unavailable", "page_content_policy_corrupt")
	}
	return out, found, nil
}

func (s *Store) effectiveKnowledgePageContentPolicy(ctx context.Context, db conversationDB, libraryID, pageID string, a agentsdk.Authority) (knowledgesdk.KnowledgePageContentPolicy, string, error) {
	currentID := pageID
	for depth := 0; depth < 128; depth++ {
		page, err := s.pageRecord(ctx, db, libraryID, currentID, a)
		if err != nil {
			return knowledgesdk.KnowledgePageContentPolicy{}, "", err
		}
		policy, found, err := s.knowledgePageContentPolicyRecord(ctx, db, libraryID, currentID, a)
		if err != nil {
			return knowledgesdk.KnowledgePageContentPolicy{}, "", err
		}
		if found && (currentID == pageID || policy.Scope == knowledgesdk.KnowledgePageContentPolicySubtree) {
			return policy, currentID, nil
		}
		if page.ParentPageID == "" {
			return defaultKnowledgePageContentPolicy(libraryID, pageID), "", nil
		}
		currentID = page.ParentPageID
	}
	return knowledgesdk.KnowledgePageContentPolicy{}, "", conversationError("conflict", "page_tree_depth_exceeded")
}

func (s *Store) KnowledgePageContentPolicy(ctx context.Context, libraryID, pageID string, a agentsdk.Authority) (out knowledgesdk.KnowledgePageContentPolicy, err error) {
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		if _, readErr := s.libraryRecord(ctx, tx, libraryID, a); readErr != nil {
			return readErr
		}
		if _, readErr := s.pageRecord(ctx, tx, libraryID, pageID, a); readErr != nil {
			return readErr
		}
		own, found, readErr := s.knowledgePageContentPolicyRecord(ctx, tx, libraryID, pageID, a)
		if readErr != nil {
			return readErr
		}
		if found {
			out = own
			return nil
		}
		effective, _, readErr := s.effectiveKnowledgePageContentPolicy(ctx, tx, libraryID, pageID, a)
		if readErr != nil {
			return readErr
		}
		out = effective
		out.PageID, out.LibraryID, out.Scope, out.Revision, out.UpdatedByUserID, out.UpdatedAt = pageID, libraryID, knowledgesdk.KnowledgePageContentPolicyPage, 0, "", time.Time{}
		return nil
	})
	return
}

func (s *Store) EvaluateKnowledgePageContentPolicy(ctx context.Context, libraryID, pageID, operation string, a agentsdk.Authority) (out knowledgesdk.KnowledgePageContentDecision, err error) {
	if !validKnowledgePageContentOperation(operation) {
		return out, conversationError("bad_request", "page_content_operation_invalid")
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		if _, readErr := s.libraryRecord(ctx, tx, libraryID, a); readErr != nil {
			return readErr
		}
		policy, sourcePageID, readErr := s.effectiveKnowledgePageContentPolicy(ctx, tx, libraryID, pageID, a)
		if readErr != nil {
			return readErr
		}
		out = knowledgePageContentDecision(policy, sourcePageID, pageID, operation)
		return nil
	})
	return
}

func (s *Store) SetKnowledgePageContentPolicy(ctx context.Context, libraryID, pageID string, in knowledgesdk.KnowledgePageContentPolicyWrite, a agentsdk.Authority) (out knowledgesdk.KnowledgePageContentPolicy, err error) {
	if !validKnowledgePageContentPolicyScope(in.Scope) || !validKnowledgePageClassification(in.Classification) || !validKnowledgePageWatermarkMode(in.WatermarkMode) || !validKnowledgePageSensitiveAction(in.SensitiveAction) || in.ExpectedRevision < 0 {
		return out, conversationError("bad_request", "page_content_policy_invalid")
	}
	requestKey, err := pageRequestKey("content_policy", libraryID, pageID, in.ClientID, a)
	if err != nil {
		return out, err
	}
	requestHash := conversationHash(in)
	err = s.mutateKnowledgeOperation(ctx, "knowledge.page_content_policy.set", knowledgesdk.ActionPageContentPolicySet, libraryID+":"+pageID, in.ClientID, in, a, func(tx *sql.Tx) (any, error) {
		library, readErr := s.libraryRecord(ctx, tx, libraryID, a)
		if readErr != nil {
			return out, readErr
		}
		if library.Role != "manager" {
			return out, conversationError("forbidden", "library_manage_required")
		}
		if _, readErr = s.pageRecord(ctx, tx, libraryID, pageID, a); readErr != nil {
			return out, readErr
		}
		current, found, readErr := s.knowledgePageContentPolicyRecord(ctx, tx, libraryID, pageID, a)
		if readErr != nil {
			return out, readErr
		}
		if found {
			var lastKey, lastHash string
			q, args, buildErr := query.NewSelectBuilder(s.store.Renderer(), knowledgePageContentPolicyTable).Columns("last_request_key", "last_request_hash").Where(pageScope(a, pageID)).Build()
			if buildErr != nil {
				return out, buildErr
			}
			if readErr = tx.QueryRowContext(ctx, q, args...).Scan(&lastKey, &lastHash); readErr != nil {
				return out, readErr
			}
			if lastKey == requestKey {
				if lastHash != requestHash {
					return out, conversationError("conflict", "page_idempotency_conflict")
				}
				return current, nil
			}
		}
		if current.Revision != in.ExpectedRevision {
			return out, conversationError("conflict", "page_content_policy_revision_conflict")
		}
		now := time.Now().UTC().Truncate(time.Millisecond)
		out = knowledgesdk.KnowledgePageContentPolicy{PageID: pageID, LibraryID: libraryID, Scope: in.Scope, AllowCopy: in.AllowCopy, AllowDownload: in.AllowDownload, AllowPrint: in.AllowPrint, AllowExport: in.AllowExport, AllowDuplicate: in.AllowDuplicate, Classification: in.Classification, WatermarkMode: in.WatermarkMode, SensitiveAction: in.SensitiveAction, RequireApproval: in.RequireApproval, Revision: current.Revision + 1, UpdatedByUserID: a.UserID, UpdatedAt: now}
		if found {
			q, args, buildErr := query.NewUpdateBuilder(s.store.Renderer(), knowledgePageContentPolicyTable).Set("policy_scope", out.Scope).Set("revision", out.Revision).Set("updated_at", now.UnixMilli()).Set("last_request_key", requestKey).Set("last_request_hash", requestHash).Set("payload_json", conversationJSON(out)).Where(query.And(pageScope(a, pageID), query.Equal("revision", current.Revision))).Build()
			if readErr = conversationCAS(ctx, tx, q, args, buildErr); readErr != nil {
				return out, conversationError("conflict", "page_content_policy_revision_conflict")
			}
			return out, nil
		}
		q, args, buildErr := query.NewInsertBuilder(s.store.Renderer(), knowledgePageContentPolicyTable).Columns("scope_key", "page_id", "library_id", "policy_scope", "revision", "updated_at", "last_request_key", "last_request_hash", "payload_json").Values(libraryScope(a), pageID, libraryID, out.Scope, out.Revision, now.UnixMilli(), requestKey, requestHash, conversationJSON(out)).Build()
		if readErr = conversationExec(ctx, tx, q, args, buildErr); readErr != nil {
			return out, readErr
		}
		return out, nil
	}, &out)
	return
}
