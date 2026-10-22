package store

import (
	"context"
	"database/sql"
	"errors"
	"sort"
	"time"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-orm/query"
)

const knowledgePageMaximumGrants = 1000

func knowledgePagePermissionToken(a agentsdk.Authority, pageID string) string {
	return "scope:knowledge:page:" + conversationHash([]string{"knowledge-page.v1", a.RuntimeID, a.WorkspaceID, pageID})
}

func defaultKnowledgePageAccess(page knowledgesdk.KnowledgePage, a agentsdk.Authority) knowledgesdk.KnowledgePageAccessPolicy {
	status := "ready"
	if page.PublishedVersion > 0 {
		status = "queued"
	}
	return knowledgesdk.KnowledgePageAccessPolicy{
		PageID: page.ID, LibraryID: page.LibraryID, Mode: knowledgesdk.KnowledgePageAccessInherit,
		Revision: 1, ProjectionStatus: status, Grants: []knowledgesdk.KnowledgePageAccessGrant{},
		UpdatedByUserID: a.UserID, UpdatedAt: page.UpdatedAt,
	}
}

func (s *Store) insertKnowledgePageAccess(ctx context.Context, tx *sql.Tx, page *knowledgesdk.KnowledgePage, requestKey, requestHash string, a agentsdk.Authority) error {
	policy := defaultKnowledgePageAccess(*page, a)
	page.AccessMode, page.AccessRevision, page.AccessStatus = policy.Mode, policy.Revision, policy.ProjectionStatus
	q, args, err := query.NewInsertBuilder(s.store.Renderer(), knowledgePageAccessTable).
		Columns("scope_key", "page_id", "library_id", "mode", "revision", "projection_status", "updated_at", "last_request_key", "last_request_hash", "payload_json").
		Values(libraryScope(a), page.ID, page.LibraryID, policy.Mode, policy.Revision, policy.ProjectionStatus, policy.UpdatedAt.UnixMilli(), requestKey, requestHash, conversationJSON(policy)).Build()
	return conversationExec(ctx, tx, q, args, err)
}

func validKnowledgePageAccessMode(mode string) bool {
	return mode == knowledgesdk.KnowledgePageAccessInherit || mode == knowledgesdk.KnowledgePageAccessRestricted
}

func validKnowledgePageGrantScope(scope string) bool {
	return scope == knowledgesdk.KnowledgePageGrantPage || scope == knowledgesdk.KnowledgePageGrantSubtree
}

func validKnowledgeAccessSubject(subject knowledgesdk.KnowledgeAccessSubject) bool {
	return (subject.Type == knowledgesdk.KnowledgeSubjectUser || subject.Type == knowledgesdk.KnowledgeSubjectOrganization) && validLibraryUser(subject.ID)
}

func knowledgeAccessSubjectKey(subject knowledgesdk.KnowledgeAccessSubject) string {
	return subject.Type + "\x00" + subject.ID
}

func (s *Store) knowledgePageAccessPolicy(ctx context.Context, db conversationDB, libraryID, pageID string, a agentsdk.Authority) (knowledgesdk.KnowledgePageAccessPolicy, error) {
	var out knowledgesdk.KnowledgePageAccessPolicy
	found, err := s.executionRead(ctx, db, knowledgePageAccessTable, pageScope(a, pageID), &out)
	if err != nil {
		return out, err
	}
	if !found || out.LibraryID != libraryID || out.PageID != pageID || !validKnowledgePageAccessMode(out.Mode) || out.Revision < 1 {
		return out, conversationError("unavailable", "page_access_invalid")
	}
	out.Grants = []knowledgesdk.KnowledgePageAccessGrant{}
	q, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgePageGrantTable).Columns("payload_json").
		Where(query.And(pageScope(a, pageID), query.Equal("library_id", libraryID))).
		OrderBy(query.Ascending("subject_type"), query.Ascending("subject_id"), query.Ascending("grant_scope")).Limit(knowledgePageMaximumGrants + 1).Build()
	if err != nil {
		return out, err
	}
	rows, err := db.QueryContext(ctx, q, args...)
	if err != nil {
		return out, err
	}
	defer rows.Close()
	for rows.Next() {
		var raw []byte
		var grant knowledgesdk.KnowledgePageAccessGrant
		if err = rows.Scan(&raw); err == nil {
			err = unmarshalDurableJSON(raw, &grant)
		}
		if err != nil {
			return out, err
		}
		out.Grants = append(out.Grants, grant)
	}
	if err = rows.Err(); err != nil {
		return out, err
	}
	if len(out.Grants) > knowledgePageMaximumGrants {
		return out, conversationError("unavailable", "page_grant_limit")
	}
	return out, nil
}

func (s *Store) KnowledgePageAccess(ctx context.Context, libraryID, pageID string, a agentsdk.Authority) (out knowledgesdk.KnowledgePageAccessPolicy, err error) {
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
		out, readErr = s.knowledgePageAccessPolicy(ctx, tx, libraryID, pageID, a)
		return readErr
	})
	return
}

func (s *Store) libraryRoleForSubject(ctx context.Context, db conversationDB, libraryID string, subject knowledgesdk.KnowledgeAccessSubject, a agentsdk.Authority) (string, error) {
	statement, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgeLibraryMemberTable).Columns("role").Where(libraryMemberPredicate(a, libraryID, subject.Type, subject.ID)).Build()
	if err != nil {
		return "", err
	}
	var role string
	err = db.QueryRowContext(ctx, statement, args...).Scan(&role)
	if errors.Is(err, sql.ErrNoRows) {
		return "", nil
	}
	if err != nil || !validLibraryRole(role) {
		return "", err
	}
	return role, nil
}

func roleLevel(role string) int {
	switch role {
	case "reader":
		return 1
	case "editor":
		return 2
	case "manager":
		return 3
	default:
		return 0
	}
}

func lesserRole(one, two string) string {
	if roleLevel(one) < roleLevel(two) {
		return one
	}
	return two
}

func (s *Store) pageAncestors(ctx context.Context, db conversationDB, libraryID, pageID string, a agentsdk.Authority) ([]string, error) {
	out := []string{}
	seen := map[string]bool{}
	current := pageID
	for depth := 0; current != "" && depth < knowledgePageMaximumDepth; depth++ {
		if seen[current] {
			return nil, conversationError("unavailable", "page_tree_cycle")
		}
		seen[current] = true
		page, err := s.pageRecord(ctx, db, libraryID, current, a)
		if err != nil {
			return nil, err
		}
		out = append(out, current)
		current = page.ParentPageID
	}
	if current != "" {
		return nil, conversationError("unavailable", "page_tree_depth")
	}
	return out, nil
}

func (s *Store) evaluateKnowledgePageAccess(ctx context.Context, db conversationDB, libraryID, pageID string, a agentsdk.Authority) (knowledgesdk.KnowledgePageEffectiveAccess, error) {
	library, err := s.libraryRecord(ctx, db, libraryID, a)
	if err != nil {
		return knowledgesdk.KnowledgePageEffectiveAccess{}, err
	}
	if _, err = s.pageRecord(ctx, db, libraryID, pageID, a); err != nil {
		return knowledgesdk.KnowledgePageEffectiveAccess{}, err
	}
	policy, err := s.knowledgePageAccessPolicy(ctx, db, libraryID, pageID, a)
	if err != nil {
		return knowledgesdk.KnowledgePageEffectiveAccess{}, err
	}
	if library.Role == "manager" {
		return knowledgesdk.KnowledgePageEffectiveAccess{Allowed: true, Role: "manager", Mode: policy.Mode, Source: "manager"}, nil
	}
	if policy.Mode == knowledgesdk.KnowledgePageAccessInherit {
		return knowledgesdk.KnowledgePageEffectiveAccess{Allowed: true, Role: library.Role, Mode: policy.Mode, Source: "library"}, nil
	}
	ancestors, err := s.pageAncestors(ctx, db, libraryID, pageID, a)
	if err != nil {
		return knowledgesdk.KnowledgePageEffectiveAccess{}, err
	}
	bestRole, bestPage, bestScope := "", "", ""
	for index, ancestorID := range ancestors {
		predicate := query.And(pageScope(a, ancestorID), query.Equal("library_id", libraryID), authorityMembershipSubjectsPredicate(a))
		q, args, buildErr := query.NewSelectBuilder(s.store.Renderer(), knowledgePageGrantTable).Columns("payload_json").Where(predicate).OrderBy(query.Ascending("grant_scope")).Limit(2).Build()
		if buildErr != nil {
			return knowledgesdk.KnowledgePageEffectiveAccess{}, buildErr
		}
		rows, queryErr := db.QueryContext(ctx, q, args...)
		if queryErr != nil {
			return knowledgesdk.KnowledgePageEffectiveAccess{}, queryErr
		}
		for rows.Next() {
			var raw []byte
			var grant knowledgesdk.KnowledgePageAccessGrant
			if queryErr = rows.Scan(&raw); queryErr == nil {
				queryErr = unmarshalDurableJSON(raw, &grant)
			}
			if queryErr != nil {
				_ = rows.Close()
				return knowledgesdk.KnowledgePageEffectiveAccess{}, queryErr
			}
			if index > 0 && grant.Scope != knowledgesdk.KnowledgePageGrantSubtree {
				continue
			}
			if roleLevel(grant.Role) > roleLevel(bestRole) {
				bestRole, bestPage, bestScope = grant.Role, ancestorID, grant.Scope
			}
		}
		if queryErr = rows.Err(); queryErr != nil {
			_ = rows.Close()
			return knowledgesdk.KnowledgePageEffectiveAccess{}, queryErr
		}
		if queryErr = rows.Close(); queryErr != nil {
			return knowledgesdk.KnowledgePageEffectiveAccess{}, queryErr
		}
	}
	if bestRole == "" {
		return knowledgesdk.KnowledgePageEffectiveAccess{Allowed: false, Mode: policy.Mode, Source: "restricted"}, nil
	}
	source := "ancestor_grant"
	if bestPage == pageID {
		source = "direct_grant"
	}
	return knowledgesdk.KnowledgePageEffectiveAccess{Allowed: true, Role: lesserRole(library.Role, bestRole), Mode: policy.Mode, Source: source, GrantPageID: bestPage, GrantScope: bestScope}, nil
}

func (s *Store) EvaluateKnowledgePageAccess(ctx context.Context, libraryID, pageID string, a agentsdk.Authority) (out knowledgesdk.KnowledgePageEffectiveAccess, err error) {
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		var readErr error
		out, readErr = s.evaluateKnowledgePageAccess(ctx, tx, libraryID, pageID, a)
		return readErr
	})
	return
}

func (s *Store) EvaluateKnowledgePageAccessForAuthority(ctx context.Context, libraryID, pageID string, target, a agentsdk.Authority) (out knowledgesdk.KnowledgePageEffectiveAccess, err error) {
	if err = conversationAuthority(target); err != nil || target.RuntimeID != a.RuntimeID || target.WorkspaceID != a.WorkspaceID {
		return out, conversationError("bad_request", "library_member_invalid")
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		library, readErr := s.libraryRecord(ctx, tx, libraryID, a)
		if readErr != nil {
			return readErr
		}
		if library.Role != "manager" {
			return conversationError("forbidden", "library_manage_required")
		}
		out, readErr = s.evaluateKnowledgePageAccess(ctx, tx, libraryID, pageID, target)
		if readErr != nil {
			var coded *agentsdk.Error
			if errors.As(readErr, &coded) && coded.Class == "not_found" {
				out = knowledgesdk.KnowledgePageEffectiveAccess{Allowed: false, Source: "not_member"}
				return nil
			}
		}
		return readErr
	})
	return
}

func validatePageAccessWrite(in knowledgesdk.KnowledgePageAccessWrite) error {
	if !personalMemoryKey(in.ClientID) || in.ExpectedRevision < 1 || !validKnowledgePageAccessMode(in.Mode) || len(in.Grants) > knowledgePageMaximumGrants {
		return conversationError("bad_request", "page_access_invalid")
	}
	if in.Mode == knowledgesdk.KnowledgePageAccessInherit && len(in.Grants) != 0 {
		return conversationError("bad_request", "page_access_invalid")
	}
	seen := map[string]bool{}
	for _, grant := range in.Grants {
		key := knowledgeAccessSubjectKey(grant.Subject) + "\x00" + grant.Scope
		if !validKnowledgeAccessSubject(grant.Subject) || !validLibraryRole(grant.Role) || !validKnowledgePageGrantScope(grant.Scope) || seen[key] {
			return conversationError("bad_request", "page_grant_invalid")
		}
		seen[key] = true
	}
	return nil
}

func (s *Store) queueCurrentPageProjection(ctx context.Context, tx *sql.Tx, page *knowledgesdk.KnowledgePage, accessRevision int64, a agentsdk.Authority) error {
	if page.PublishedVersion == 0 {
		page.AccessStatus = "ready"
		return nil
	}
	version, err := s.pageVersion(ctx, tx, page.ID, page.PublishedVersion, a)
	if err != nil {
		return err
	}
	page.ProjectionStatus, page.AccessStatus = "queued", "queued"
	job := pageProjectionJob{PageID: page.ID, LibraryID: page.LibraryID, Version: page.PublishedVersion, ContentSHA256: version.Body.ContentSHA256, AccessRevision: accessRevision, Actor: a, NotBefore: time.Now().UTC().Truncate(time.Millisecond)}
	q, args, err := query.NewDeleteBuilder(s.store.Renderer(), knowledgePageProjectionJobTable).Where(pageScope(a, page.ID)).Build()
	if err = conversationExec(ctx, tx, q, args, err); err != nil {
		return err
	}
	q, args, err = query.NewInsertBuilder(s.store.Renderer(), knowledgePageProjectionJobTable).Columns("scope_key", "page_id", "library_id", "runtime_id", "version", "not_before", "lease_until", "fence", "payload_json").Values(libraryScope(a), page.ID, page.LibraryID, a.RuntimeID, page.PublishedVersion, job.NotBefore.UnixMilli(), 0, 0, conversationJSON(job)).Build()
	return conversationExec(ctx, tx, q, args, err)
}

func (s *Store) SetKnowledgePageAccess(ctx context.Context, libraryID, pageID string, in knowledgesdk.KnowledgePageAccessWrite, a agentsdk.Authority) (out knowledgesdk.KnowledgePageAccessPolicy, err error) {
	if err = validatePageAccessWrite(in); err != nil {
		return
	}
	requestKey, err := pageRequestKey("access", libraryID, pageID, in.ClientID, a)
	if err != nil {
		return out, err
	}
	requestHash := conversationHash(in)
	err = s.mutateKnowledgeOperation(ctx, "knowledge.page.access.set", knowledgesdk.ActionPageAccessSet, libraryID+":"+pageID, in.ClientID, in, a, func(tx *sql.Tx) (any, error) {
		library, readErr := s.libraryRecord(ctx, tx, libraryID, a)
		if readErr != nil {
			return out, readErr
		}
		if library.Role != "manager" {
			return out, conversationError("forbidden", "library_manage_required")
		}
		page, readErr := s.pageRecord(ctx, tx, libraryID, pageID, a)
		if readErr != nil {
			return out, readErr
		}
		current, readErr := s.knowledgePageAccessPolicy(ctx, tx, libraryID, pageID, a)
		if readErr != nil {
			return out, readErr
		}
		var lastKey, lastHash string
		q, args, buildErr := query.NewSelectBuilder(s.store.Renderer(), knowledgePageAccessTable).Columns("last_request_key", "last_request_hash").Where(pageScope(a, pageID)).Build()
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
		if current.Revision != in.ExpectedRevision {
			return out, conversationError("conflict", "page_access_revision_conflict")
		}
		now := time.Now().UTC().Truncate(time.Millisecond)
		grants := append([]knowledgesdk.KnowledgePageAccessGrant(nil), in.Grants...)
		for index := range grants {
			role, roleErr := s.libraryRoleForSubject(ctx, tx, libraryID, grants[index].Subject, a)
			if roleErr != nil {
				return out, roleErr
			}
			if role == "" {
				return out, conversationError("bad_request", "page_grant_member_required")
			}
			grants[index].CreatedByUserID, grants[index].CreatedAt = a.UserID, now
		}
		sort.Slice(grants, func(i, j int) bool {
			if grants[i].Subject.Type == grants[j].Subject.Type && grants[i].Subject.ID == grants[j].Subject.ID {
				return grants[i].Scope < grants[j].Scope
			}
			if grants[i].Subject.Type == grants[j].Subject.Type {
				return grants[i].Subject.ID < grants[j].Subject.ID
			}
			return grants[i].Subject.Type < grants[j].Subject.Type
		})
		out = knowledgesdk.KnowledgePageAccessPolicy{PageID: pageID, LibraryID: libraryID, Mode: in.Mode, Revision: current.Revision + 1, ProjectionStatus: "ready", Grants: grants, UpdatedByUserID: a.UserID, UpdatedAt: now}
		if page.PublishedVersion > 0 {
			out.ProjectionStatus = "queued"
		}
		q, args, buildErr = query.NewUpdateBuilder(s.store.Renderer(), knowledgePageAccessTable).
			Set("mode", out.Mode).Set("revision", out.Revision).Set("projection_status", out.ProjectionStatus).Set("updated_at", now.UnixMilli()).Set("last_request_key", requestKey).Set("last_request_hash", requestHash).Set("payload_json", conversationJSON(out)).
			Where(query.And(pageScope(a, pageID), query.Equal("revision", current.Revision))).Build()
		if readErr = conversationCAS(ctx, tx, q, args, buildErr); readErr != nil {
			return out, conversationError("conflict", "page_access_revision_conflict")
		}
		q, args, buildErr = query.NewDeleteBuilder(s.store.Renderer(), knowledgePageGrantTable).Where(pageScope(a, pageID)).Build()
		if readErr = conversationExec(ctx, tx, q, args, buildErr); readErr != nil {
			return out, readErr
		}
		for _, grant := range grants {
			q, args, buildErr = query.NewInsertBuilder(s.store.Renderer(), knowledgePageGrantTable).Columns("scope_key", "page_id", "library_id", "subject_type", "subject_id", "grant_scope", "role", "payload_json").Values(libraryScope(a), pageID, libraryID, grant.Subject.Type, grant.Subject.ID, grant.Scope, grant.Role, conversationJSON(grant)).Build()
			if readErr = conversationExec(ctx, tx, q, args, buildErr); readErr != nil {
				return out, readErr
			}
		}
		page.AccessMode, page.AccessRevision, page.AccessStatus = out.Mode, out.Revision, out.ProjectionStatus
		if readErr = s.queueCurrentPageProjection(ctx, tx, &page, out.Revision, a); readErr != nil {
			return out, readErr
		}
		q, args, buildErr = query.NewUpdateBuilder(s.store.Renderer(), knowledgePageTable).Set("payload_json", conversationJSON(page)).Where(pageScope(a, pageID)).Build()
		if readErr = conversationExec(ctx, tx, q, args, buildErr); readErr != nil {
			return out, readErr
		}
		// Existing sessions reconnect against the new effective policy. This is
		// the durable disconnect signal consumed by heartbeat/sync requests.
		if readErr = s.revokeKnowledgeCollaborationSessions(ctx, tx, pageScope(a, pageID)); readErr != nil {
			return out, readErr
		}
		return out, nil
	}, &out)
	if err == nil {
		s.notifyKnowledgeCollaboration(ctx, a, libraryID, pageID)
	}
	return
}

func (s *Store) KnowledgePageProjectionPermission(ctx context.Context, libraryID, pageID string, a agentsdk.Authority) (token string, revision int64, err error) {
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		if _, readErr := s.libraryRecord(ctx, tx, libraryID, a); readErr != nil {
			return readErr
		}
		policy, readErr := s.knowledgePageAccessPolicy(ctx, tx, libraryID, pageID, a)
		if readErr != nil {
			return readErr
		}
		revision = policy.Revision
		token = knowledgePagePermissionToken(a, pageID)
		return nil
	})
	return
}

func (s *Store) KnowledgePagePermissionTokens(ctx context.Context, libraryID string, a agentsdk.Authority) (out []string, err error) {
	out = []string{}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		if _, readErr := s.libraryRecord(ctx, tx, libraryID, a); readErr != nil {
			return readErr
		}
		q, args, buildErr := query.NewSelectBuilder(s.store.Renderer(), knowledgePageAccessTable).Columns("page_id").Where(query.And(libraryPredicate(a, libraryID), query.Equal("projection_status", "ready"))).OrderBy(query.Ascending("page_id")).Limit(knowledgeLibraryMaximumPages + 1).Build()
		if buildErr != nil {
			return buildErr
		}
		rows, queryErr := tx.QueryContext(ctx, q, args...)
		if queryErr != nil {
			return queryErr
		}
		defer rows.Close()
		for rows.Next() {
			var pageID string
			if queryErr = rows.Scan(&pageID); queryErr != nil {
				return queryErr
			}
			page, pageErr := s.pageRecord(ctx, tx, libraryID, pageID, a)
			if pageErr != nil {
				return pageErr
			}
			if page.State != "active" || page.PublishedVersion < 1 || page.ProjectionStatus != "ready" || page.AccessStatus != "ready" {
				continue
			}
			effective, accessErr := s.evaluateKnowledgePageAccess(ctx, tx, libraryID, pageID, a)
			if accessErr != nil {
				return accessErr
			}
			if effective.Allowed {
				out = append(out, knowledgePagePermissionToken(a, pageID))
			}
		}
		if queryErr = rows.Err(); queryErr != nil {
			return queryErr
		}
		if len(out) > knowledgeLibraryMaximumPages {
			return conversationError("unavailable", "page_permission_limit")
		}
		return nil
	})
	return
}

func (s *Store) restrictedSubtreeExists(ctx context.Context, db conversationDB, libraryID, rootID string, a agentsdk.Authority) (int, bool, string, error) {
	q, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgePageTable).Columns("payload_json").Where(query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("library_id", libraryID))).Limit(knowledgeLibraryMaximumPages + 1).Build()
	if err != nil {
		return 0, false, "", err
	}
	rows, err := db.QueryContext(ctx, q, args...)
	if err != nil {
		return 0, false, "", err
	}
	pages := map[string]knowledgesdk.KnowledgePage{}
	for rows.Next() {
		var raw []byte
		var page knowledgesdk.KnowledgePage
		if err = rows.Scan(&raw); err == nil {
			err = unmarshalDurableJSON(raw, &page)
		}
		if err != nil {
			_ = rows.Close()
			return 0, false, "", err
		}
		pages[page.ID] = page
	}
	if err = rows.Err(); err != nil {
		_ = rows.Close()
		return 0, false, "", err
	}
	_ = rows.Close()
	if len(pages) > knowledgeLibraryMaximumPages {
		return 0, false, "", conversationError("unavailable", "page_limit")
	}
	children := map[string][]string{}
	for _, page := range pages {
		children[page.ParentPageID] = append(children[page.ParentPageID], page.ID)
	}
	stack, count, restricted := []string{rootID}, 0, false
	accessState := []any{}
	for len(stack) > 0 {
		id := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		count++
		policy, policyErr := s.knowledgePageAccessPolicy(ctx, db, libraryID, id, a)
		if policyErr != nil {
			return 0, false, "", policyErr
		}
		restricted = restricted || policy.Mode == knowledgesdk.KnowledgePageAccessRestricted
		accessState = append(accessState, []any{id, pages[id].ParentPageID, policy.Mode, policy.Revision})
		stack = append(stack, children[id]...)
	}
	sort.Slice(accessState, func(i, j int) bool { return accessState[i].([]any)[0].(string) < accessState[j].([]any)[0].(string) })
	return count, restricted, conversationHash(accessState), nil
}

type knowledgePageSubjectRole struct {
	Subject knowledgesdk.KnowledgeAccessSubject `json:"subject"`
	Role    string                              `json:"role"`
}

func (s *Store) ancestorSubtreeGrantSubjects(ctx context.Context, db conversationDB, libraryID, parentID string, a agentsdk.Authority) (map[string]knowledgePageSubjectRole, error) {
	out := map[string]knowledgePageSubjectRole{}
	current := parentID
	for depth := 0; current != "" && depth < knowledgePageMaximumDepth; depth++ {
		page, err := s.pageRecord(ctx, db, libraryID, current, a)
		if err != nil {
			return nil, err
		}
		q, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgePageGrantTable).Columns("subject_type", "subject_id", "role").Where(query.And(pageScope(a, current), query.Equal("grant_scope", knowledgesdk.KnowledgePageGrantSubtree))).Build()
		if err != nil {
			return nil, err
		}
		rows, err := db.QueryContext(ctx, q, args...)
		if err != nil {
			return nil, err
		}
		for rows.Next() {
			var subjectType, subjectID, role string
			if err = rows.Scan(&subjectType, &subjectID, &role); err != nil {
				_ = rows.Close()
				return nil, err
			}
			subject := knowledgesdk.KnowledgeAccessSubject{Type: subjectType, ID: subjectID}
			key := knowledgeAccessSubjectKey(subject)
			if roleLevel(role) > roleLevel(out[key].Role) {
				out[key] = knowledgePageSubjectRole{Subject: subject, Role: role}
			}
		}
		if err = rows.Err(); err != nil {
			_ = rows.Close()
			return nil, err
		}
		_ = rows.Close()
		current = page.ParentPageID
	}
	if current != "" {
		return nil, conversationError("unavailable", "page_tree_depth")
	}
	return out, nil
}

func (s *Store) pageMoveImpact(ctx context.Context, tx *sql.Tx, libraryID, pageID string, in knowledgesdk.KnowledgePageMovePreview, a agentsdk.Authority) (knowledgesdk.KnowledgePageMoveImpact, error) {
	page, err := s.pageRecord(ctx, tx, libraryID, pageID, a)
	if err != nil {
		return knowledgesdk.KnowledgePageMoveImpact{}, err
	}
	if err = s.validatePageParent(ctx, tx, libraryID, pageID, in.ParentPageID, a); err != nil {
		return knowledgesdk.KnowledgePageMoveImpact{}, err
	}
	count, restricted, subtreeAccessHash, err := s.restrictedSubtreeExists(ctx, tx, libraryID, pageID, a)
	if err != nil {
		return knowledgesdk.KnowledgePageMoveImpact{}, err
	}
	oldSubjects, err := s.ancestorSubtreeGrantSubjects(ctx, tx, libraryID, page.ParentPageID, a)
	if err != nil {
		return knowledgesdk.KnowledgePageMoveImpact{}, err
	}
	newSubjects, err := s.ancestorSubtreeGrantSubjects(ctx, tx, libraryID, in.ParentPageID, a)
	if err != nil {
		return knowledgesdk.KnowledgePageMoveImpact{}, err
	}
	changedByKey := map[string]knowledgesdk.KnowledgeAccessSubject{}
	if restricted {
		for key, oldGrant := range oldSubjects {
			if newSubjects[key].Role != oldGrant.Role {
				changedByKey[key] = oldGrant.Subject
			}
		}
		for key, newGrant := range newSubjects {
			if oldSubjects[key].Role != newGrant.Role {
				changedByKey[key] = newGrant.Subject
			}
		}
	}
	changed := make([]knowledgesdk.KnowledgeAccessSubject, 0, len(changedByKey))
	for _, subject := range changedByKey {
		changed = append(changed, subject)
	}
	sort.Slice(changed, func(i, j int) bool {
		if changed[i].Type == changed[j].Type {
			return changed[i].ID < changed[j].ID
		}
		return changed[i].Type < changed[j].Type
	})
	token := conversationHash([]any{"page-move-impact.v2", pageID, page.ParentPageID, in.ParentPageID, in.Rank, page.Revision, count, subtreeAccessHash, oldSubjects, newSubjects})
	return knowledgesdk.KnowledgePageMoveImpact{PageID: pageID, ParentPageID: in.ParentPageID, AffectedPages: count, ChangedSubjects: changed, RequiresConfirm: len(changed) > 0, Token: token}, nil
}

func (s *Store) PreviewKnowledgePageMove(ctx context.Context, libraryID, pageID string, in knowledgesdk.KnowledgePageMovePreview, a agentsdk.Authority) (out knowledgesdk.KnowledgePageMoveImpact, err error) {
	if !validPageRank(in.Rank, true) {
		return out, conversationError("bad_request", "page_move_invalid")
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		library, readErr := s.libraryRecord(ctx, tx, libraryID, a)
		if readErr != nil {
			return readErr
		}
		if library.Role != "manager" {
			return conversationError("forbidden", "library_manage_required")
		}
		out, readErr = s.pageMoveImpact(ctx, tx, libraryID, pageID, in, a)
		return readErr
	})
	return
}

var _ knowledgesdk.KnowledgePageAccessRepository = (*Store)(nil)
