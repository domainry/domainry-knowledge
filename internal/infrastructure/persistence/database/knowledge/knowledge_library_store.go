package store

import (
	"context"
	"database/sql"
	"strings"
	"time"

	"github.com/domainry/domainry-foundation/entityid"
	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
	"github.com/domainry/domainry-orm/query"
)

func libraryScope(a agentsdk.Authority) string {
	return conversationHash([]string{a.RuntimeID, a.WorkspaceID})
}
func libraryPredicate(a agentsdk.Authority, id string) query.Predicate {
	return query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("library_id", id))
}
func validLibraryID(id string) bool {
	return entityid.Validate("klib", id) == nil
}
func validLibraryUser(id string) bool {
	return executionText(id, 255, true) && strings.TrimSpace(id) == id
}
func validLibraryOrganization(id string) bool {
	return executionText(id, 255, true) && strings.TrimSpace(id) == id
}
func validLibraryRole(role string) bool {
	return role == "reader" || role == "editor" || role == "manager"
}

func libraryMemberPredicate(a agentsdk.Authority, libraryID, subjectType, subjectID string) query.Predicate {
	return query.And(libraryPredicate(a, libraryID), query.Equal("subject_type", subjectType), query.Equal("subject_id", subjectID))
}

func authorityOrganizationIDs(a agentsdk.Authority) []any {
	seen := map[string]bool{}
	values := make([]any, 0, len(a.OrgScopeIDs)+1)
	for _, id := range append(append([]string(nil), a.OrgScopeIDs...), a.OrgID) {
		if id != "" && !seen[id] {
			seen[id] = true
			values = append(values, id)
		}
	}
	return values
}

func authorityMembershipSubjectsPredicate(a agentsdk.Authority) query.Predicate {
	user := query.And(query.Equal("subject_type", agentsdk.KnowledgeSubjectUser), query.Equal("subject_id", a.UserID))
	organizations := authorityOrganizationIDs(a)
	if len(organizations) == 0 {
		return user
	}
	return query.Or(user, query.And(query.Equal("subject_type", agentsdk.KnowledgeSubjectOrganization), query.In("subject_id", organizations...)))
}

func qualifiedAuthorityMembershipSubjectsPredicate(a agentsdk.Authority, qualifier string) query.Predicate {
	user := query.And(
		query.EqualValue(query.QualifiedColumn(qualifier, "subject_type"), agentsdk.KnowledgeSubjectUser),
		query.EqualValue(query.QualifiedColumn(qualifier, "subject_id"), a.UserID),
	)
	organizations := authorityOrganizationIDs(a)
	if len(organizations) == 0 {
		return user
	}
	return query.Or(user, query.And(
		query.EqualValue(query.QualifiedColumn(qualifier, "subject_type"), agentsdk.KnowledgeSubjectOrganization),
		query.InExpression(query.QualifiedColumn(qualifier, "subject_id"), organizations...),
	))
}

func libraryMembershipPredicate(a agentsdk.Authority, libraryID string) query.Predicate {
	return query.And(libraryPredicate(a, libraryID), authorityMembershipSubjectsPredicate(a))
}

func (s *Store) libraryRoleForAuthority(ctx context.Context, db conversationDB, libraryID string, a agentsdk.Authority) (string, error) {
	q, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgeLibraryMemberTable).Columns("role").Where(libraryMembershipPredicate(a, libraryID)).Build()
	if err != nil {
		return "", err
	}
	rows, err := db.QueryContext(ctx, q, args...)
	if err != nil {
		return "", err
	}
	defer rows.Close()
	best := ""
	for rows.Next() {
		var role string
		if err = rows.Scan(&role); err != nil {
			return "", err
		}
		if roleLevel(role) > roleLevel(best) {
			best = role
		}
	}
	return best, rows.Err()
}

func (s *Store) libraryRecord(ctx context.Context, db conversationDB, id string, a agentsdk.Authority) (agentsdk.KnowledgeLibrary, error) {
	var out agentsdk.KnowledgeLibrary
	if err := conversationAuthority(a); err != nil {
		return out, err
	}
	if !validLibraryID(id) {
		return out, conversationError("bad_request", "library_invalid")
	}
	role, err := s.libraryRoleForAuthority(ctx, db, id, a)
	if err != nil {
		return out, err
	}
	if !validLibraryRole(role) {
		return out, conversationError("not_found", "library_not_found")
	}
	found, err := s.executionRead(ctx, db, knowledgeLibraryTable, libraryPredicate(a, id), &out)
	if err == nil && (!found || out.Kind == "personal" && out.OwnerUserID != a.UserID) {
		err = conversationError("not_found", "library_not_found")
	}
	out.Role = role
	return out, err
}
func (s *Store) KnowledgeLibrary(ctx context.Context, id string, a agentsdk.Authority) (out agentsdk.KnowledgeLibrary, err error) {
	err = s.transaction(ctx, func(tx *sql.Tx) error { var e error; out, e = s.libraryRecord(ctx, tx, id, a); return e })
	return
}

func (s *Store) CreateKnowledgeLibrary(ctx context.Context, in agentsdk.KnowledgeLibraryCreate, a agentsdk.Authority) (out agentsdk.KnowledgeLibrary, err error) {
	if err = conversationAuthority(a); err != nil {
		return
	}
	if !personalMemoryKey(in.ClientID) || !executionText(in.Name, 128, true) || !executionText(in.Description, 1024, false) || in.Kind != "personal" && in.Kind != "shared" {
		return out, conversationError("bad_request", "library_invalid")
	}
	id, err := entityid.Derive("klib", "knowledge.library", conversationOwner(a), "shared", in.ClientID)
	if err != nil {
		return out, err
	}
	if in.Kind == "personal" {
		id, err = entityid.Derive("klib", "knowledge.library", conversationOwner(a), "personal")
		if err != nil {
			return out, err
		}
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		out = agentsdk.KnowledgeLibrary{}
		var prior agentsdk.KnowledgeLibrary
		found, e := s.executionRead(ctx, tx, knowledgeLibraryTable, libraryPredicate(a, id), &prior)
		if e != nil {
			return e
		}
		if found {
			if in.Kind != "personal" {
				q, args, e := query.NewSelectBuilder(s.store.Renderer(), knowledgeLibraryTable).Columns("request_hash").Where(libraryPredicate(a, id)).Build()
				if e != nil {
					return e
				}
				var hash string
				if e = tx.QueryRowContext(ctx, q, args...).Scan(&hash); e != nil {
					return e
				}
				if hash != conversationHash(in) {
					return conversationError("conflict", "idempotency_conflict")
				}
			}
			out, e = s.libraryRecord(ctx, tx, id, a)
			return e
		}
		q, args, e := query.NewSelectBuilder(s.store.Renderer(), knowledgeLibraryTable).Projections(query.Project(query.CountAll())).Where(query.Equal("scope_key", libraryScope(a))).Build()
		if e != nil {
			return e
		}
		var count int
		if e = tx.QueryRowContext(ctx, q, args...).Scan(&count); e != nil {
			return e
		}
		if count >= 1000 {
			return conversationError("conflict", "library_limit")
		}
		now := time.Now().UTC().Truncate(time.Millisecond)
		out = agentsdk.KnowledgeLibrary{ID: id, Kind: in.Kind, Name: in.Name, Description: in.Description, OwnerUserID: a.UserID, Revision: 1, CreatedAt: now, UpdatedAt: now}
		q, args, e = query.NewInsertBuilder(s.store.Renderer(), knowledgeLibraryTable).Columns("scope_key", "library_id", "request_hash", "revision", "payload_json").Values(libraryScope(a), id, conversationHash(in), 1, conversationJSON(out)).Build()
		if e = conversationExec(ctx, tx, q, args, e); e != nil {
			return e
		}
		member := agentsdk.KnowledgeLibraryMember{UserID: a.UserID, Role: "manager", UpdatedAt: now}
		q, args, e = query.NewInsertBuilder(s.store.Renderer(), knowledgeLibraryMemberTable).Columns("scope_key", "library_id", "subject_type", "subject_id", "role", "payload_json").Values(libraryScope(a), id, agentsdk.KnowledgeSubjectUser, a.UserID, member.Role, conversationJSON(member)).Build()
		if e = conversationExec(ctx, tx, q, args, e); e != nil {
			return e
		}
		out.Role = "manager"
		return nil
	})
	return
}

func libraryPageLimit(after string, limit int, users bool) (int, error) {
	if limit == 0 {
		limit = 20
	}
	if limit < 1 || limit > 50 || after != "" && ((!users && !validLibraryID(after)) || (users && !validLibraryUser(after))) {
		return 0, conversationError("bad_request", "library_query_invalid")
	}
	return limit, nil
}

func libraryEntityPageLimit(after string, limit int) (int64, int, error) {
	if limit == 0 {
		limit = 20
	}
	afterID, valid := parsePhysicalAfter(after)
	if limit < 1 || limit > 50 || !valid {
		return 0, 0, conversationError("bad_request", "library_query_invalid")
	}
	return afterID, limit, nil
}

func (s *Store) KnowledgeLibraries(ctx context.Context, after string, limit int, a agentsdk.Authority) (out agentsdk.KnowledgeLibraryPage, err error) {
	out.Items = []agentsdk.KnowledgeLibrary{}
	out.Complete = true
	if err = conversationAuthority(a); err != nil {
		return
	}
	var afterID int64
	if afterID, limit, err = libraryEntityPageLimit(after, limit); err != nil {
		return
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		out = agentsdk.KnowledgeLibraryPage{Items: []agentsdk.KnowledgeLibrary{}, Complete: true}
		q, args, e := query.NewSelectBuilder(s.store.Renderer(), knowledgeLibraryTable).Alias("library").Distinct().Projections(
			query.Project(query.QualifiedColumn("library", "id")),
			query.Project(query.QualifiedColumn("library", "library_id")),
		).Join(query.InnerJoin(knowledgeLibraryMemberTable, "member", query.And(
			query.EqualExpressions(query.QualifiedColumn("library", "scope_key"), query.QualifiedColumn("member", "scope_key")),
			query.EqualExpressions(query.QualifiedColumn("library", "library_id"), query.QualifiedColumn("member", "library_id")),
		))).Where(query.And(
			query.EqualValue(query.QualifiedColumn("member", "scope_key"), libraryScope(a)),
			qualifiedAuthorityMembershipSubjectsPredicate(a, "member"),
			query.GreaterThanExpression(query.QualifiedColumn("library", "id"), afterID),
		)).OrderBy(query.AscendingExpression(query.QualifiedColumn("library", "id"))).Limit(limit + 1).Build()
		if e != nil {
			return e
		}
		rows, e := tx.QueryContext(ctx, q, args...)
		if e != nil {
			return e
		}
		ids := []string{}
		physicalIDs := []int64{}
		for rows.Next() {
			var physicalID int64
			var id string
			if e = rows.Scan(&physicalID, &id); e != nil {
				break
			}
			physicalIDs = append(physicalIDs, physicalID)
			ids = append(ids, id)
		}
		if e == nil {
			e = rows.Err()
		}
		_ = rows.Close()
		if e != nil {
			return e
		}
		if len(ids) > limit {
			out.Complete = false
			ids = ids[:limit]
			out.NextAfter = physicalAfterValue(physicalIDs[limit-1])
		}
		for _, id := range ids {
			item, e := s.libraryRecord(ctx, tx, id, a)
			if e != nil {
				return e
			}
			out.Items = append(out.Items, item)
		}
		return nil
	})
	return
}

func (s *Store) saveLibraryRecord(ctx context.Context, tx *sql.Tx, item *agentsdk.KnowledgeLibrary, expected int64, a agentsdk.Authority) error {
	if expected < 1 || item.Revision != expected {
		return conversationError("conflict", "revision_conflict")
	}
	item.Revision++
	item.UpdatedAt = time.Now().UTC().Truncate(time.Millisecond)
	stored := *item
	stored.Role = ""
	q, args, e := query.NewUpdateBuilder(s.store.Renderer(), knowledgeLibraryTable).Set("revision", item.Revision).Set("payload_json", conversationJSON(stored)).Where(query.And(libraryPredicate(a, item.ID), query.Equal("revision", expected))).Build()
	return conversationCAS(ctx, tx, q, args, e)
}
func (s *Store) UpdateKnowledgeLibrary(ctx context.Context, id string, in agentsdk.KnowledgeLibraryUpdate, a agentsdk.Authority) (out agentsdk.KnowledgeLibrary, err error) {
	if !executionText(in.Name, 128, true) || !executionText(in.Description, 1024, false) {
		return out, conversationError("bad_request", "library_invalid")
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		var e error
		out, e = s.libraryRecord(ctx, tx, id, a)
		if e != nil {
			return e
		}
		if out.Role != "manager" {
			return conversationError("forbidden", "library_manage_required")
		}
		out.Name, out.Description, out.Archived = in.Name, in.Description, in.Archived
		if e = s.saveLibraryRecord(ctx, tx, &out, in.ExpectedRevision, a); e != nil {
			return e
		}
		if out.Archived {
			return s.revokeKnowledgeCollaborationSessions(ctx, tx, libraryPredicate(a, id))
		}
		return nil
	})
	if err == nil {
		s.notifyKnowledgeCollaboration(ctx, a, id, "")
	}
	return
}
func (s *Store) KnowledgeLibraryMembers(ctx context.Context, id, after string, limit int, a agentsdk.Authority) (out agentsdk.KnowledgeLibraryMembers, err error) {
	out.Items = []agentsdk.KnowledgeLibraryMember{}
	out.Complete = true
	if limit, err = libraryPageLimit(after, limit, true); err != nil {
		return
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		out = agentsdk.KnowledgeLibraryMembers{Items: []agentsdk.KnowledgeLibraryMember{}, Complete: true}
		item, e := s.libraryRecord(ctx, tx, id, a)
		if e != nil {
			return e
		}
		if item.Role != "manager" {
			return conversationError("forbidden", "library_manage_required")
		}
		out.Revision = item.Revision
		q, args, e := query.NewSelectBuilder(s.store.Renderer(), knowledgeLibraryMemberTable).Columns("payload_json").Where(query.And(libraryPredicate(a, id), query.Equal("subject_type", agentsdk.KnowledgeSubjectUser), query.GreaterThan("subject_id", after))).OrderBy(query.Ascending("subject_id")).Limit(limit + 1).Build()
		if e != nil {
			return e
		}
		rows, e := tx.QueryContext(ctx, q, args...)
		if e != nil {
			return e
		}
		defer rows.Close()
		for rows.Next() {
			var raw []byte
			var member agentsdk.KnowledgeLibraryMember
			if e = rows.Scan(&raw); e != nil {
				return e
			}
			if e = unmarshalDurableJSON(raw, &member); e != nil {
				return e
			}
			out.Items = append(out.Items, member)
		}
		if e = rows.Err(); e != nil {
			return e
		}
		if len(out.Items) > limit {
			out.Items = out.Items[:limit]
			out.Complete = false
			out.NextAfter = out.Items[limit-1].UserID
		}
		return nil
	})
	return
}

func (s *Store) KnowledgeLibraryOrganizationMembers(ctx context.Context, id, after string, limit int, a agentsdk.Authority) (out agentsdk.KnowledgeLibraryOrganizationMembers, err error) {
	out.Items = []agentsdk.KnowledgeLibraryOrganizationMember{}
	out.Complete = true
	if limit, err = libraryPageLimit(after, limit, true); err != nil {
		return
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		out = agentsdk.KnowledgeLibraryOrganizationMembers{Items: []agentsdk.KnowledgeLibraryOrganizationMember{}, Complete: true}
		item, readErr := s.libraryRecord(ctx, tx, id, a)
		if readErr != nil {
			return readErr
		}
		if item.Role != "manager" {
			return conversationError("forbidden", "library_manage_required")
		}
		out.Revision = item.Revision
		statement, args, buildErr := query.NewSelectBuilder(s.store.Renderer(), knowledgeLibraryMemberTable).Columns("payload_json").Where(query.And(libraryPredicate(a, id), query.Equal("subject_type", agentsdk.KnowledgeSubjectOrganization), query.GreaterThan("subject_id", after))).OrderBy(query.Ascending("subject_id")).Limit(limit + 1).Build()
		if buildErr != nil {
			return buildErr
		}
		rows, queryErr := tx.QueryContext(ctx, statement, args...)
		if queryErr != nil {
			return queryErr
		}
		defer rows.Close()
		for rows.Next() {
			var raw []byte
			var member agentsdk.KnowledgeLibraryOrganizationMember
			if queryErr = rows.Scan(&raw); queryErr == nil {
				queryErr = unmarshalDurableJSON(raw, &member)
			}
			if queryErr != nil {
				return queryErr
			}
			out.Items = append(out.Items, member)
		}
		if queryErr = rows.Err(); queryErr != nil {
			return queryErr
		}
		if len(out.Items) > limit {
			out.Items = out.Items[:limit]
			out.Complete = false
			out.NextAfter = out.Items[limit-1].OrganizationID
		}
		return nil
	})
	return
}

// KnowledgeLibraryMemberIDs is the narrow mention-picker projection. Any
// current member may resolve the members of this one library, but roles and
// the workspace-wide directory remain hidden.
func (s *Store) KnowledgeLibraryMemberIDs(ctx context.Context, id string, a agentsdk.Authority) (out []string, err error) {
	out = []string{}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		if _, readErr := s.libraryRecord(ctx, tx, id, a); readErr != nil {
			return readErr
		}
		statement, args, buildErr := query.NewSelectBuilder(s.store.Renderer(), knowledgeLibraryMemberTable).
			Columns("subject_id").
			Where(query.And(libraryPredicate(a, id), query.Equal("subject_type", agentsdk.KnowledgeSubjectUser))).
			OrderBy(query.Ascending("subject_id")).
			Limit(1001).
			Build()
		if buildErr != nil {
			return buildErr
		}
		rows, queryErr := tx.QueryContext(ctx, statement, args...)
		if queryErr != nil {
			return queryErr
		}
		defer rows.Close()
		for rows.Next() {
			var userID string
			if scanErr := rows.Scan(&userID); scanErr != nil {
				return scanErr
			}
			out = append(out, userID)
		}
		if rowsErr := rows.Err(); rowsErr != nil {
			return rowsErr
		}
		if len(out) > 1000 {
			return conversationError("unavailable", "library_members_limit_exceeded")
		}
		return nil
	})
	return out, err
}

// KnowledgeLibraryRoleForUser resolves current membership for an access
// explanation after the caller has already passed manager authorization. It
// returns no cached Identity profile and never mutates membership.
func (s *Store) KnowledgeLibraryRoleForUser(ctx context.Context, id, user string, a agentsdk.Authority) (role string, err error) {
	if !validLibraryUser(user) {
		return "", conversationError("bad_request", "library_member_invalid")
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		library, readErr := s.libraryRecord(ctx, tx, id, a)
		if readErr != nil {
			return readErr
		}
		if library.Role != "manager" {
			return conversationError("forbidden", "library_manage_required")
		}
		if library.Kind == "personal" {
			if library.OwnerUserID == user {
				role = "manager"
			}
			return nil
		}
		var member agentsdk.KnowledgeLibraryMember
		found, readErr := s.executionRead(ctx, tx, knowledgeLibraryMemberTable, libraryMemberPredicate(a, id, agentsdk.KnowledgeSubjectUser, user), &member)
		if readErr != nil {
			return readErr
		}
		if found {
			role = member.Role
		}
		return nil
	})
	return role, err
}

func (s *Store) KnowledgeLibraryRoleForAuthority(ctx context.Context, id string, target, a agentsdk.Authority) (role string, err error) {
	if err = conversationAuthority(target); err != nil || target.RuntimeID != a.RuntimeID || target.WorkspaceID != a.WorkspaceID {
		return "", conversationError("bad_request", "library_member_invalid")
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		library, readErr := s.libraryRecord(ctx, tx, id, a)
		if readErr != nil {
			return readErr
		}
		if library.Role != "manager" {
			return conversationError("forbidden", "library_manage_required")
		}
		if library.Kind == "personal" {
			if library.OwnerUserID == target.UserID {
				role = "manager"
			}
			return nil
		}
		role, readErr = s.libraryRoleForAuthority(ctx, tx, id, target)
		return readErr
	})
	return role, err
}

func (s *Store) KnowledgeLibraryPageCount(ctx context.Context, id string, a agentsdk.Authority) (count int, err error) {
	if err = conversationAuthority(a); err != nil {
		return
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		if _, readErr := s.libraryRecord(ctx, tx, id, a); readErr != nil {
			return readErr
		}
		statement, args, buildErr := query.NewSelectBuilder(s.store.Renderer(), knowledgePageTable).Projections(query.Project(query.CountAll())).Where(query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("library_id", id), query.Equal("state", "active"))).Build()
		if buildErr != nil {
			return buildErr
		}
		return tx.QueryRowContext(ctx, statement, args...).Scan(&count)
	})
	return
}
func (s *Store) SetKnowledgeLibraryMember(ctx context.Context, id, user string, in agentsdk.KnowledgeLibraryMemberWrite, a agentsdk.Authority) (agentsdk.KnowledgeLibrary, error) {
	if !validLibraryRole(in.Role) {
		return agentsdk.KnowledgeLibrary{}, conversationError("bad_request", "library_role_invalid")
	}
	return s.mutateLibraryMember(ctx, id, agentsdk.KnowledgeSubjectUser, user, in.Role, in.ExpectedRevision, a)
}
func (s *Store) RemoveKnowledgeLibraryMember(ctx context.Context, id, user string, expected int64, a agentsdk.Authority) (agentsdk.KnowledgeLibrary, error) {
	return s.mutateLibraryMember(ctx, id, agentsdk.KnowledgeSubjectUser, user, "", expected, a)
}

func (s *Store) SetKnowledgeLibraryOrganizationMember(ctx context.Context, id, organizationID string, in agentsdk.KnowledgeLibraryMemberWrite, a agentsdk.Authority) (agentsdk.KnowledgeLibrary, error) {
	if !validLibraryRole(in.Role) {
		return agentsdk.KnowledgeLibrary{}, conversationError("bad_request", "library_role_invalid")
	}
	return s.mutateLibraryMember(ctx, id, agentsdk.KnowledgeSubjectOrganization, organizationID, in.Role, in.ExpectedRevision, a)
}

func (s *Store) RemoveKnowledgeLibraryOrganizationMember(ctx context.Context, id, organizationID string, expected int64, a agentsdk.Authority) (agentsdk.KnowledgeLibrary, error) {
	return s.mutateLibraryMember(ctx, id, agentsdk.KnowledgeSubjectOrganization, organizationID, "", expected, a)
}

func (s *Store) mutateLibraryMember(ctx context.Context, id, subjectType, subjectID, role string, expected int64, a agentsdk.Authority) (out agentsdk.KnowledgeLibrary, err error) {
	if subjectType != agentsdk.KnowledgeSubjectUser && subjectType != agentsdk.KnowledgeSubjectOrganization || !validLibraryUser(subjectID) {
		return out, conversationError("bad_request", "library_member_invalid")
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		var e error
		out, e = s.libraryRecord(ctx, tx, id, a)
		if e != nil {
			return e
		}
		if out.Kind != "shared" {
			return conversationError("forbidden", "personal_library_private")
		}
		if out.Role != "manager" {
			return conversationError("forbidden", "library_manage_required")
		}
		if expected < 1 || out.Revision != expected {
			return conversationError("conflict", "revision_conflict")
		}
		predicate := libraryMemberPredicate(a, id, subjectType, subjectID)
		priorRole := ""
		var found bool
		if subjectType == agentsdk.KnowledgeSubjectUser {
			var prior agentsdk.KnowledgeLibraryMember
			found, e = s.executionRead(ctx, tx, knowledgeLibraryMemberTable, predicate, &prior)
			priorRole = prior.Role
		} else {
			var prior agentsdk.KnowledgeLibraryOrganizationMember
			found, e = s.executionRead(ctx, tx, knowledgeLibraryMemberTable, predicate, &prior)
			priorRole = prior.Role
		}
		if e != nil {
			return e
		}
		if !found && role == "" {
			return conversationError("not_found", "library_member_not_found")
		}
		if found && priorRole == role {
			return nil
		}
		if priorRole == "manager" && role != "manager" {
			q, args, e := query.NewSelectBuilder(s.store.Renderer(), knowledgeLibraryMemberTable).Projections(query.Project(query.CountAll())).Where(query.And(libraryPredicate(a, id), query.Equal("role", "manager"))).Build()
			if e != nil {
				return e
			}
			var count int
			if e = tx.QueryRowContext(ctx, q, args...).Scan(&count); e != nil {
				return e
			}
			if count <= 1 {
				return conversationError("conflict", "library_last_manager")
			}
		}
		if !found {
			q, args, e := query.NewSelectBuilder(s.store.Renderer(), knowledgeLibraryMemberTable).Projections(query.Project(query.CountAll())).Where(libraryPredicate(a, id)).Build()
			if e != nil {
				return e
			}
			var count int
			if e = tx.QueryRowContext(ctx, q, args...).Scan(&count); e != nil {
				return e
			}
			if count >= 1000 {
				return conversationError("conflict", "library_member_limit")
			}
		}
		// Advancing the library revision serializes all settings/member changes,
		// including concurrent attempts to remove the final two managers.
		if e = s.saveLibraryRecord(ctx, tx, &out, expected, a); e != nil {
			return e
		}
		if role == "" {
			if subjectType == agentsdk.KnowledgeSubjectUser {
				if e = s.clearKnowledgePageMetadataMember(ctx, tx, id, subjectID, a); e != nil {
					return e
				}
			}
			q, args, e := query.NewDeleteBuilder(s.store.Renderer(), knowledgeLibraryMemberTable).Where(predicate).Build()
			if e = conversationExec(ctx, tx, q, args, e); e != nil {
				return e
			}
			q, args, e = query.NewDeleteBuilder(s.store.Renderer(), knowledgePageGrantTable).Where(query.And(libraryPredicate(a, id), query.Equal("subject_type", subjectType), query.Equal("subject_id", subjectID))).Build()
			if e = conversationExec(ctx, tx, q, args, e); e != nil {
				return e
			}
		} else {
			var payload any
			if subjectType == agentsdk.KnowledgeSubjectUser {
				payload = agentsdk.KnowledgeLibraryMember{UserID: subjectID, Role: role, UpdatedAt: out.UpdatedAt}
			} else {
				payload = agentsdk.KnowledgeLibraryOrganizationMember{OrganizationID: subjectID, Role: role, UpdatedAt: out.UpdatedAt}
			}
			if found {
				q, args, e := query.NewUpdateBuilder(s.store.Renderer(), knowledgeLibraryMemberTable).Set("role", role).Set("payload_json", conversationJSON(payload)).Where(predicate).Build()
				if e = conversationExec(ctx, tx, q, args, e); e != nil {
					return e
				}
			} else {
				q, args, e := query.NewInsertBuilder(s.store.Renderer(), knowledgeLibraryMemberTable).Columns("scope_key", "library_id", "subject_type", "subject_id", "role", "payload_json").Values(libraryScope(a), id, subjectType, subjectID, role, conversationJSON(payload)).Build()
				if e = conversationExec(ctx, tx, q, args, e); e != nil {
					return e
				}
			}
		}
		out.Role, e = s.libraryRoleForAuthority(ctx, tx, id, a)
		if e != nil {
			return e
		}
		if role == "" || role == "reader" {
			revocation := libraryPredicate(a, id)
			if subjectType == agentsdk.KnowledgeSubjectUser {
				revocation = query.And(revocation, query.Equal("user_id", subjectID))
			}
			if e = s.revokeKnowledgeCollaborationSessions(ctx, tx, revocation); e != nil {
				return e
			}
		}
		return nil
	})
	if err == nil {
		s.notifyKnowledgeCollaboration(ctx, a, id, "")
	}
	return
}

var _ persistence.KnowledgeLibraryRepository = (*Store)(nil)
