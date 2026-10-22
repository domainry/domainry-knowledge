package store

import (
	"context"
	"database/sql"
	"errors"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/domainry/domainry-foundation/entityid"
	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-orm/query"
	"golang.org/x/crypto/bcrypt"
)

const knowledgePageShareMaximumLifetime = 366 * 24 * time.Hour

func validKnowledgePageShareID(value string) bool {
	return entityid.Validate("kshare", value) == nil
}

func pageShareScope(a agentsdk.Authority, shareID string) query.Predicate {
	return query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("share_id", shareID))
}

func pageShareRedemptionScope(a agentsdk.Authority, shareID string) query.Predicate {
	return query.And(pageShareScope(a, shareID), query.Equal("user_id", a.UserID))
}

func validPageShareKind(value string) bool {
	return value == knowledgesdk.KnowledgePageShareOrganization || value == knowledgesdk.KnowledgePageShareUser || value == knowledgesdk.KnowledgePageShareExternal
}

func validPageShareScope(value string) bool {
	return value == knowledgesdk.KnowledgePageShareScopePage || value == knowledgesdk.KnowledgePageShareScopeSubtree
}

func validatePageShareTarget(kind string, target knowledgesdk.KnowledgeAccessSubject) bool {
	switch kind {
	case knowledgesdk.KnowledgePageShareOrganization:
		return target.Type == knowledgesdk.KnowledgeSubjectOrganization && validLibraryUser(target.ID)
	case knowledgesdk.KnowledgePageShareUser:
		return target.Type == knowledgesdk.KnowledgeSubjectUser && validLibraryUser(target.ID)
	case knowledgesdk.KnowledgePageShareExternal:
		return target.Type == "" && target.ID == ""
	default:
		return false
	}
}

func pageShareEligible(share knowledgesdk.KnowledgePageShare, a agentsdk.Authority) bool {
	switch share.Kind {
	case knowledgesdk.KnowledgePageShareUser:
		return share.Target.Type == knowledgesdk.KnowledgeSubjectUser && share.Target.ID == a.UserID
	case knowledgesdk.KnowledgePageShareOrganization:
		if share.Target.Type != knowledgesdk.KnowledgeSubjectOrganization {
			return false
		}
		if a.OrgID == share.Target.ID {
			return true
		}
		for _, id := range a.OrgScopeIDs {
			if id == share.Target.ID {
				return true
			}
		}
		return false
	case knowledgesdk.KnowledgePageShareExternal:
		return a.AccountType == "human"
	default:
		return false
	}
}

func (s *Store) pageShareRecord(ctx context.Context, db conversationDB, shareID string, a agentsdk.Authority) (knowledgesdk.KnowledgePageShare, string, error) {
	var out knowledgesdk.KnowledgePageShare
	if !validKnowledgePageShareID(shareID) {
		return out, "", conversationError("bad_request", "page_share_invalid")
	}
	q, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgePageShareTable).Columns("payload_json", "password_hash").Where(pageShareScope(a, shareID)).Build()
	if err != nil {
		return out, "", err
	}
	var raw []byte
	var passwordHash string
	err = db.QueryRowContext(ctx, q, args...).Scan(&raw, &passwordHash)
	if errors.Is(err, sql.ErrNoRows) {
		return out, "", conversationError("not_found", "page_share_not_found")
	}
	if err != nil {
		return out, "", err
	}
	if err = unmarshalDurableJSON(raw, &out); err != nil || out.ID != shareID || !validPageShareKind(out.Kind) || !validPageShareScope(out.Scope) {
		if err != nil {
			return knowledgesdk.KnowledgePageShare{}, "", err
		}
		return knowledgesdk.KnowledgePageShare{}, "", conversationError("unavailable", "page_share_invalid")
	}
	return out, passwordHash, nil
}

func pageShareListLimit(after string, limit int) (int64, int, error) {
	if limit == 0 {
		limit = 50
	}
	afterID, valid := parsePhysicalAfter(after)
	if limit < 1 || limit > 100 || !valid {
		return 0, 0, conversationError("bad_request", "page_share_query_invalid")
	}
	return afterID, limit, nil
}

func (s *Store) KnowledgePageShares(ctx context.Context, libraryID, pageID, after string, limit int, a agentsdk.Authority) (out knowledgesdk.KnowledgePageSharePage, err error) {
	out.Items = []knowledgesdk.KnowledgePageShare{}
	var afterID int64
	afterID, limit, err = pageShareListLimit(after, limit)
	if err != nil {
		return out, err
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		library, readErr := s.libraryRecord(ctx, tx, libraryID, a)
		if readErr != nil {
			return readErr
		}
		if library.Role != "manager" {
			return conversationError("forbidden", "library_manage_required")
		}
		if _, readErr = s.pageRecord(ctx, tx, libraryID, pageID, a); readErr != nil {
			return readErr
		}
		predicate := query.And(pageScope(a, pageID), query.Equal("library_id", libraryID))
		if afterID > 0 {
			predicate = query.And(predicate, query.GreaterThan("id", afterID))
		}
		q, args, buildErr := query.NewSelectBuilder(s.store.Renderer(), knowledgePageShareTable).Columns("id", "payload_json").Where(predicate).OrderBy(query.Ascending("id")).Limit(limit + 1).Build()
		if buildErr != nil {
			return buildErr
		}
		rows, queryErr := tx.QueryContext(ctx, q, args...)
		if queryErr != nil {
			return queryErr
		}
		defer rows.Close()
		physicalIDs := make([]int64, 0, limit+1)
		for rows.Next() {
			var physicalID int64
			var raw []byte
			var item knowledgesdk.KnowledgePageShare
			if queryErr = rows.Scan(&physicalID, &raw); queryErr == nil {
				queryErr = unmarshalDurableJSON(raw, &item)
			}
			if queryErr != nil {
				return queryErr
			}
			physicalIDs = append(physicalIDs, physicalID)
			out.Items = append(out.Items, item)
		}
		if queryErr = rows.Err(); queryErr != nil {
			return queryErr
		}
		out.Complete = true
		if len(out.Items) > limit {
			out.Items = out.Items[:limit]
			out.Complete = false
			out.NextAfter = physicalAfterValue(physicalIDs[limit-1])
		}
		return nil
	})
	return out, err
}

func (s *Store) CreateKnowledgePageShare(ctx context.Context, libraryID, pageID string, in knowledgesdk.KnowledgePageShareCreate, a agentsdk.Authority) (out knowledgesdk.KnowledgePageShare, err error) {
	now := time.Now().UTC()
	if !personalMemoryKey(in.ClientID) || !validPageShareKind(in.Kind) || !validPageShareScope(in.Scope) || !validatePageShareTarget(in.Kind, in.Target) || !in.ExpiresAt.After(now) || in.ExpiresAt.After(now.Add(knowledgePageShareMaximumLifetime)) {
		return out, conversationError("bad_request", "page_share_invalid")
	}
	password := in.Password
	if password != strings.TrimSpace(password) || utf8.RuneCountInString(password) > 72 || password != "" && utf8.RuneCountInString(password) < 8 || in.Kind == knowledgesdk.KnowledgePageShareExternal && password == "" {
		return out, conversationError("bad_request", "page_share_password_invalid")
	}
	passwordHash := ""
	if password != "" {
		hash, hashErr := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		if hashErr != nil {
			return out, hashErr
		}
		passwordHash = string(hash)
	}
	requestKey, err := pageRequestKey("page_share_create.v1", libraryID, pageID, in.ClientID, a)
	if err != nil {
		return out, err
	}
	requestHash := conversationHash(in)
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		library, readErr := s.libraryRecord(ctx, tx, libraryID, a)
		if readErr != nil {
			return readErr
		}
		if library.Role != "manager" || library.Archived {
			return conversationError("forbidden", "library_manage_required")
		}
		page, readErr := s.pageRecord(ctx, tx, libraryID, pageID, a)
		if readErr != nil {
			return readErr
		}
		if page.State != "active" || page.PublishedVersion < 1 {
			return conversationError("conflict", "page_share_published_required")
		}
		policy, _, policyErr := s.effectiveKnowledgePageContentPolicy(ctx, tx, libraryID, pageID, a)
		if policyErr != nil {
			return policyErr
		}
		if !contentPolicyAllows(policy, knowledgesdk.KnowledgePageContentOperationShare) {
			return conversationError("forbidden", "page_content_operation_denied")
		}
		q, args, buildErr := query.NewSelectBuilder(s.store.Renderer(), knowledgePageShareTable).Columns("payload_json", "request_hash").Where(query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("request_key", requestKey))).Build()
		if buildErr != nil {
			return buildErr
		}
		var raw []byte
		var existingHash string
		readErr = tx.QueryRowContext(ctx, q, args...).Scan(&raw, &existingHash)
		if readErr == nil {
			if existingHash != requestHash {
				return conversationError("conflict", "page_share_request_conflict")
			}
			return unmarshalDurableJSON(raw, &out)
		}
		if !errors.Is(readErr, sql.ErrNoRows) {
			return readErr
		}
		shareID, idErr := randomKnowledgeID("kshare_")
		if idErr != nil {
			return idErr
		}
		out = knowledgesdk.KnowledgePageShare{ID: shareID, LibraryID: libraryID, PageID: pageID, Kind: in.Kind, Target: in.Target, Scope: in.Scope, Role: "reader", PasswordProtected: passwordHash != "", State: knowledgesdk.KnowledgePageShareActive, ExpiresAt: in.ExpiresAt.UTC(), Revision: 1, CreatedByUserID: a.UserID, CreatedAt: now, UpdatedAt: now}
		q, args, buildErr = query.NewInsertBuilder(s.store.Renderer(), knowledgePageShareTable).Columns("scope_key", "share_id", "library_id", "page_id", "share_kind", "target_type", "target_id", "share_scope", "state", "expires_at", "revision", "created_by_user_id", "password_hash", "request_key", "request_hash", "payload_json").Values(libraryScope(a), out.ID, libraryID, pageID, out.Kind, out.Target.Type, out.Target.ID, out.Scope, out.State, out.ExpiresAt.UnixMilli(), out.Revision, out.CreatedByUserID, passwordHash, requestKey, requestHash, conversationJSON(out)).Build()
		return conversationExec(ctx, tx, q, args, buildErr)
	})
	return out, err
}

func (s *Store) RevokeKnowledgePageShare(ctx context.Context, libraryID, pageID, shareID string, expectedRevision int64, a agentsdk.Authority) (out knowledgesdk.KnowledgePageShare, err error) {
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		library, readErr := s.libraryRecord(ctx, tx, libraryID, a)
		if readErr != nil {
			return readErr
		}
		if library.Role != "manager" {
			return conversationError("forbidden", "library_manage_required")
		}
		out, _, readErr = s.pageShareRecord(ctx, tx, shareID, a)
		if readErr != nil || out.LibraryID != libraryID || out.PageID != pageID {
			if readErr != nil {
				return readErr
			}
			return conversationError("not_found", "page_share_not_found")
		}
		if out.Revision != expectedRevision {
			return conversationError("conflict", "revision_conflict")
		}
		if out.State == knowledgesdk.KnowledgePageShareRevoked {
			return nil
		}
		out.State, out.Revision, out.UpdatedAt = knowledgesdk.KnowledgePageShareRevoked, out.Revision+1, time.Now().UTC()
		q, args, buildErr := query.NewUpdateBuilder(s.store.Renderer(), knowledgePageShareTable).Set("state", out.State).Set("revision", out.Revision).Set("payload_json", conversationJSON(out)).Where(query.And(pageShareScope(a, shareID), query.Equal("revision", expectedRevision), query.Equal("state", knowledgesdk.KnowledgePageShareActive))).Build()
		if buildErr = conversationCAS(ctx, tx, q, args, buildErr); buildErr != nil {
			return buildErr
		}
		q, args, buildErr = query.NewDeleteBuilder(s.store.Renderer(), knowledgePageShareRedemptionTable).Where(pageShareScope(a, shareID)).Build()
		return conversationExec(ctx, tx, q, args, buildErr)
	})
	return out, err
}

func (s *Store) RedeemKnowledgePageShare(ctx context.Context, shareID string, in knowledgesdk.KnowledgePageShareRedeem, a agentsdk.Authority) (out knowledgesdk.KnowledgePageShare, err error) {
	if err = conversationAuthority(a); err != nil {
		return out, err
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		var passwordHash string
		var readErr error
		out, passwordHash, readErr = s.pageShareRecord(ctx, tx, shareID, a)
		if readErr != nil {
			return readErr
		}
		if out.State != knowledgesdk.KnowledgePageShareActive || !out.ExpiresAt.After(time.Now().UTC()) || !pageShareEligible(out, a) {
			return conversationError("not_found", "page_share_not_found")
		}
		if passwordHash != "" && bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(in.Password)) != nil {
			return conversationError("forbidden", "page_share_password_invalid")
		}
		page, pageErr := s.pageRecord(ctx, tx, out.LibraryID, out.PageID, a)
		if pageErr != nil || page.State != "active" || page.PublishedVersion < 1 {
			return conversationError("not_found", "page_share_not_found")
		}
		q, args, buildErr := query.NewDeleteBuilder(s.store.Renderer(), knowledgePageShareRedemptionTable).Where(pageShareRedemptionScope(a, shareID)).Build()
		if buildErr = conversationExec(ctx, tx, q, args, buildErr); buildErr != nil {
			return buildErr
		}
		now := time.Now().UTC().UnixMilli()
		q, args, buildErr = query.NewInsertBuilder(s.store.Renderer(), knowledgePageShareRedemptionTable).Columns("scope_key", "share_id", "user_id", "library_id", "page_id", "redeemed_at").Values(libraryScope(a), shareID, a.UserID, out.LibraryID, out.PageID, now).Build()
		return conversationExec(ctx, tx, q, args, buildErr)
	})
	return out, err
}

func (s *Store) shareContainsPage(ctx context.Context, db conversationDB, share knowledgesdk.KnowledgePageShare, pageID string, a agentsdk.Authority) (bool, error) {
	if pageID == share.PageID {
		return true, nil
	}
	if share.Scope != knowledgesdk.KnowledgePageShareScopeSubtree {
		return false, nil
	}
	current := pageID
	seen := map[string]bool{}
	for depth := 0; current != "" && depth < knowledgePageMaximumDepth; depth++ {
		if seen[current] {
			return false, conversationError("unavailable", "page_tree_cycle")
		}
		seen[current] = true
		page, err := s.pageRecord(ctx, db, share.LibraryID, current, a)
		if err != nil || page.State != "active" || page.PublishedVersion < 1 {
			return false, err
		}
		version, err := s.pageVersion(ctx, db, current, page.PublishedVersion, a)
		if err != nil {
			return false, err
		}
		current = version.ParentPageID
		if current == share.PageID {
			return true, nil
		}
	}
	return false, nil
}

func (s *Store) readKnowledgePageShare(ctx context.Context, tx *sql.Tx, shareID, pageID string, a agentsdk.Authority) (knowledgesdk.KnowledgePageSharedView, error) {
	share, _, err := s.pageShareRecord(ctx, tx, shareID, a)
	if err != nil || share.State != knowledgesdk.KnowledgePageShareActive || !share.ExpiresAt.After(time.Now().UTC()) || !pageShareEligible(share, a) {
		return knowledgesdk.KnowledgePageSharedView{}, conversationError("not_found", "page_share_not_found")
	}
	q, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgePageShareRedemptionTable).Columns("redeemed_at").Where(pageShareRedemptionScope(a, shareID)).Build()
	if err != nil {
		return knowledgesdk.KnowledgePageSharedView{}, err
	}
	var redeemedAt int64
	if err = tx.QueryRowContext(ctx, q, args...).Scan(&redeemedAt); err != nil {
		return knowledgesdk.KnowledgePageSharedView{}, conversationError("forbidden", "page_share_redeem_required")
	}
	allowed, err := s.shareContainsPage(ctx, tx, share, pageID, a)
	if err != nil || !allowed {
		return knowledgesdk.KnowledgePageSharedView{}, conversationError("not_found", "page_share_not_found")
	}
	page, err := s.pageRecord(ctx, tx, share.LibraryID, pageID, a)
	if err != nil || page.State != "active" || page.PublishedVersion < 1 {
		return knowledgesdk.KnowledgePageSharedView{}, conversationError("not_found", "page_share_not_found")
	}
	version, err := s.pageVersion(ctx, tx, pageID, page.PublishedVersion, a)
	if err != nil {
		return knowledgesdk.KnowledgePageSharedView{}, err
	}
	policy, _, err := s.effectiveKnowledgePageContentPolicy(ctx, tx, share.LibraryID, pageID, a)
	if err != nil {
		return knowledgesdk.KnowledgePageSharedView{}, err
	}
	if policy.SensitiveAction == knowledgesdk.KnowledgePageSensitiveContentBlockOutbound {
		return knowledgesdk.KnowledgePageSharedView{}, conversationError("not_found", "page_share_not_found")
	}
	page.Title, page.ParentPageID, page.Rank = version.Title, version.ParentPageID, version.Rank
	return knowledgesdk.KnowledgePageSharedView{Share: share, View: knowledgesdk.KnowledgePageView{Page: page, Published: &version, Breadcrumbs: []knowledgesdk.KnowledgePageBreadcrumb{{PageID: page.ID, Title: page.Title}}, Governance: knowledgePageContentGovernance(policy, a)}}, nil
}

func (s *Store) ReadKnowledgePageShare(ctx context.Context, shareID, pageID string, a agentsdk.Authority) (out knowledgesdk.KnowledgePageSharedView, err error) {
	if err = conversationAuthority(a); err != nil {
		return out, err
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		var readErr error
		out, readErr = s.readKnowledgePageShare(ctx, tx, shareID, pageID, a)
		return readErr
	})
	return out, err
}

func (s *Store) AuthorizeKnowledgePageShareContentOperation(ctx context.Context, shareID, pageID, operation string, a agentsdk.Authority) (out knowledgesdk.KnowledgePageContentDecision, err error) {
	if operation != knowledgesdk.KnowledgePageContentOperationCopy && operation != knowledgesdk.KnowledgePageContentOperationPrint && operation != knowledgesdk.KnowledgePageContentOperationExport && operation != knowledgesdk.KnowledgePageContentOperationShare {
		return out, conversationError("bad_request", "page_content_operation_invalid")
	}
	if err = conversationAuthority(a); err != nil {
		return out, err
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		shared, readErr := s.readKnowledgePageShare(ctx, tx, shareID, pageID, a)
		if readErr != nil {
			return readErr
		}
		policy, sourcePageID, readErr := s.effectiveKnowledgePageContentPolicy(ctx, tx, shared.Share.LibraryID, pageID, a)
		if readErr != nil {
			return readErr
		}
		out = knowledgePageContentDecision(policy, sourcePageID, pageID, operation)
		if !out.Allowed {
			return conversationError("forbidden", "page_content_operation_denied")
		}
		return nil
	})
	return out, err
}

// EvaluateKnowledgePageShareAccessForAuthority returns the same current-state
// decision used by the share read path, but does not mutate redemption state.
// The caller authority selects the workspace-scoped record; the target
// authority supplies the live Identity user and organization scope being
// explained by an already-authorized Knowledge manager.
func (s *Store) EvaluateKnowledgePageShareAccessForAuthority(ctx context.Context, libraryID, shareID, pageID string, target, caller agentsdk.Authority) (out knowledgesdk.KnowledgeAccessLayer, err error) {
	out = knowledgesdk.KnowledgeAccessLayer{Code: "page_share_denied", Label: "受控分享不允许当前访问", Source: "share"}
	if err = conversationAuthority(target); err != nil {
		return out, err
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		share, _, readErr := s.pageShareRecord(ctx, tx, shareID, caller)
		if readErr != nil {
			return readErr
		}
		out.Source = share.Kind
		if share.LibraryID != libraryID {
			return conversationError("not_found", "page_share_not_found")
		}
		if share.State != knowledgesdk.KnowledgePageShareActive {
			out.Code, out.Label = "page_share_revoked", "分享已撤销"
			return nil
		}
		if !share.ExpiresAt.After(time.Now().UTC()) {
			out.Code, out.Label = "page_share_expired", "分享已过期"
			return nil
		}
		if !pageShareEligible(share, target) {
			out.Code, out.Label = "page_share_target_denied", "当前身份不在分享对象范围"
			return nil
		}
		allowed, readErr := s.shareContainsPage(ctx, tx, share, pageID, caller)
		if readErr != nil {
			return readErr
		}
		if !allowed {
			out.Code, out.Label = "page_share_scope_denied", "页面不在分享范围"
			return nil
		}
		page, readErr := s.pageRecord(ctx, tx, share.LibraryID, pageID, caller)
		if readErr != nil || page.State != "active" || page.PublishedVersion < 1 {
			out.Code, out.Label = "page_share_unpublished", "页面没有可分享的发布版本"
			return nil
		}
		q, args, buildErr := query.NewSelectBuilder(s.store.Renderer(), knowledgePageShareRedemptionTable).Columns("redeemed_at").Where(query.And(pageShareScope(caller, shareID), query.Equal("user_id", target.UserID))).Build()
		if buildErr != nil {
			return buildErr
		}
		var redeemedAt int64
		readErr = tx.QueryRowContext(ctx, q, args...).Scan(&redeemedAt)
		if errors.Is(readErr, sql.ErrNoRows) {
			out.Code, out.Label = "page_share_redeem_required", "当前账号尚未兑换分享"
			return nil
		}
		if readErr != nil {
			return readErr
		}
		out.Allowed, out.Code, out.Label = true, "page_share_allowed", "受控分享允许只读访问"
		return nil
	})
	return out, err
}
