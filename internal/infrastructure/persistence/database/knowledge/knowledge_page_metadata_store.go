package store

import (
	"context"
	"database/sql"
	"math"
	"sort"
	"strconv"
	"strings"
	"time"
	"unicode"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-orm/query"
)

const (
	knowledgePageMaximumTags           = 20
	knowledgePageMaximumProperties     = 32
	knowledgePageMaximumAliases        = 12
	knowledgePageMaximumRelations      = 64
	knowledgePageMaximumContentAdmins  = 20
	knowledgePageMaximumGovernanceDays = 3650
)

func emptyKnowledgePageMetadata(libraryID, pageID string) knowledgesdk.KnowledgePageMetadata {
	return knowledgesdk.KnowledgePageMetadata{
		LibraryID: libraryID, PageID: pageID, Aliases: []string{}, RelatedPageIDs: []string{}, Tags: []string{},
		ContentAdminUserIDs: []string{}, Properties: []knowledgesdk.KnowledgePageCustomProperty{},
		ArchiveRetentionDays: knowledgesdk.KnowledgePageDefaultArchiveRetentionDays,
		ReviewIntervalDays:   knowledgesdk.KnowledgePageDefaultReviewIntervalDays,
	}
}

func pageMetadataPredicate(a agentsdk.Authority, pageID string) query.Predicate {
	return query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("page_id", pageID))
}

func (s *Store) knowledgePageMetadataRecord(ctx context.Context, db conversationDB, libraryID, pageID string, a agentsdk.Authority) (knowledgesdk.KnowledgePageMetadata, bool, error) {
	metadata := emptyKnowledgePageMetadata(libraryID, pageID)
	found, err := s.executionRead(ctx, db, knowledgePageMetadataTable, pageMetadataPredicate(a, pageID), &metadata)
	if err != nil {
		return metadata, false, err
	}
	if found && (metadata.LibraryID != libraryID || metadata.PageID != pageID) {
		return metadata, false, conversationError("unavailable", "page_metadata_corrupt")
	}
	if metadata.Tags == nil {
		metadata.Tags = []string{}
	}
	if metadata.Aliases == nil {
		metadata.Aliases = []string{}
	}
	if metadata.RelatedPageIDs == nil {
		metadata.RelatedPageIDs = []string{}
	}
	if metadata.Properties == nil {
		metadata.Properties = []knowledgesdk.KnowledgePageCustomProperty{}
	}
	if metadata.ContentAdminUserIDs == nil {
		metadata.ContentAdminUserIDs = []string{}
	}
	return metadata, found, nil
}

func normalizedPageAlias(value string) (string, string, bool) {
	label := strings.TrimSpace(value)
	if !executionText(label, 128, true) {
		return "", "", false
	}
	for _, character := range label {
		if unicode.IsControl(character) {
			return "", "", false
		}
	}
	return strings.ToLower(label), label, true
}

func normalizedPageTag(value string) (string, string, bool) {
	label := strings.TrimSpace(value)
	if !executionText(label, 64, true) {
		return "", "", false
	}
	for _, character := range label {
		if unicode.IsControl(character) {
			return "", "", false
		}
	}
	return strings.ToLower(label), label, true
}

func validKnowledgePageStatus(value string) bool {
	switch value {
	case "", knowledgesdk.KnowledgePageStatusInProgress, knowledgesdk.KnowledgePageStatusInReview, knowledgesdk.KnowledgePageStatusVerified, knowledgesdk.KnowledgePageStatusDeprecated:
		return true
	default:
		return false
	}
}

func validKnowledgePagePropertyType(value string) bool {
	switch value {
	case knowledgesdk.KnowledgePagePropertyText, knowledgesdk.KnowledgePagePropertyNumber, knowledgesdk.KnowledgePagePropertyDate, knowledgesdk.KnowledgePagePropertySelect, knowledgesdk.KnowledgePagePropertyCheckbox, knowledgesdk.KnowledgePagePropertyPerson:
		return true
	default:
		return false
	}
}

func validKnowledgePagePropertyValue(property knowledgesdk.KnowledgePageCustomProperty) bool {
	value := strings.TrimSpace(property.Value)
	if property.Value != value || !validKnowledgePagePropertyType(property.Type) {
		return false
	}
	switch property.Type {
	case knowledgesdk.KnowledgePagePropertyText:
		return executionText(value, 1024, false)
	case knowledgesdk.KnowledgePagePropertySelect:
		return executionText(value, 128, false)
	case knowledgesdk.KnowledgePagePropertyNumber:
		if value == "" {
			return true
		}
		number, err := strconv.ParseFloat(value, 64)
		return err == nil && !math.IsNaN(number) && !math.IsInf(number, 0)
	case knowledgesdk.KnowledgePagePropertyDate:
		if value == "" {
			return true
		}
		if _, err := time.Parse("2006-01-02", value); err == nil {
			return true
		}
		_, err := time.Parse(time.RFC3339, value)
		return err == nil
	case knowledgesdk.KnowledgePagePropertyCheckbox:
		return value == "" || value == "true" || value == "false"
	case knowledgesdk.KnowledgePagePropertyPerson:
		return value == "" || validLibraryUser(value)
	default:
		return false
	}
}

func normalizeKnowledgePageMetadataWrite(input knowledgesdk.KnowledgePageMetadataWrite) (knowledgesdk.KnowledgePageMetadataWrite, error) {
	if input.ExpectedRevision < 0 || !personalMemoryKey(input.ClientID) || len(input.Tags) > knowledgePageMaximumTags || len(input.Aliases) > knowledgePageMaximumAliases || len(input.RelatedPageIDs) > knowledgePageMaximumRelations || len(input.Properties) > knowledgePageMaximumProperties || !validKnowledgePageStatus(input.Status) {
		return input, conversationError("bad_request", "page_metadata_invalid")
	}
	tags := make(map[string]string, len(input.Tags))
	for _, value := range input.Tags {
		key, label, ok := normalizedPageTag(value)
		if !ok {
			return input, conversationError("bad_request", "page_metadata_invalid")
		}
		if _, exists := tags[key]; exists {
			return input, conversationError("bad_request", "page_metadata_tag_duplicate")
		}
		tags[key] = label
	}
	input.Tags = input.Tags[:0]
	keys := make([]string, 0, len(tags))
	for key := range tags {
		keys = append(keys, key)
	}
	sort.Strings(keys)
	for _, key := range keys {
		input.Tags = append(input.Tags, tags[key])
	}
	aliases := make(map[string]string, len(input.Aliases))
	for _, value := range input.Aliases {
		key, label, ok := normalizedPageAlias(value)
		if !ok {
			return input, conversationError("bad_request", "page_metadata_alias_invalid")
		}
		if _, exists := aliases[key]; exists {
			return input, conversationError("bad_request", "page_metadata_alias_duplicate")
		}
		aliases[key] = label
	}
	input.Aliases = input.Aliases[:0]
	keys = keys[:0]
	for key := range aliases {
		keys = append(keys, key)
	}
	sort.Strings(keys)
	for _, key := range keys {
		input.Aliases = append(input.Aliases, aliases[key])
	}
	related := make(map[string]bool, len(input.RelatedPageIDs))
	for _, pageID := range input.RelatedPageIDs {
		pageID = strings.TrimSpace(pageID)
		if !validKnowledgePageID(pageID) || related[pageID] {
			return input, conversationError("bad_request", "page_metadata_relation_invalid")
		}
		related[pageID] = true
	}
	input.RelatedPageIDs = input.RelatedPageIDs[:0]
	for pageID := range related {
		input.RelatedPageIDs = append(input.RelatedPageIDs, pageID)
	}
	sort.Strings(input.RelatedPageIDs)
	propertyIDs := map[string]bool{}
	propertyNames := map[string]bool{}
	for index, property := range input.Properties {
		property.ID = strings.TrimSpace(property.ID)
		property.Name = strings.TrimSpace(property.Name)
		property.Type = strings.TrimSpace(property.Type)
		property.Value = strings.TrimSpace(property.Value)
		nameKey := strings.ToLower(property.Name)
		if !strings.HasPrefix(property.ID, "prop_") || !personalMemoryKey(property.ID) || !executionText(property.Name, 64, true) || propertyIDs[property.ID] || propertyNames[nameKey] || !validKnowledgePagePropertyValue(property) {
			return input, conversationError("bad_request", "page_metadata_property_invalid")
		}
		propertyIDs[property.ID], propertyNames[nameKey] = true, true
		input.Properties[index] = property
	}
	return input, nil
}

func normalizeKnowledgePageGovernanceWrite(input knowledgesdk.KnowledgePageGovernanceWrite) (knowledgesdk.KnowledgePageGovernanceWrite, error) {
	if input.ExpectedRevision < 0 || !personalMemoryKey(input.ClientID) || !validLibraryUser(input.OwnerUserID) || len(input.ContentAdminUserIDs) > knowledgePageMaximumContentAdmins || input.ArchiveRetentionDays < 1 || input.ArchiveRetentionDays > knowledgePageMaximumGovernanceDays || input.ReviewIntervalDays < 0 || input.ReviewIntervalDays > knowledgePageMaximumGovernanceDays {
		return input, conversationError("bad_request", "page_governance_invalid")
	}
	if !input.NextReviewAt.IsZero() {
		input.NextReviewAt = input.NextReviewAt.UTC().Truncate(time.Minute)
		if input.NextReviewAt.Before(time.Date(2000, 1, 1, 0, 0, 0, 0, time.UTC)) || input.NextReviewAt.After(time.Date(2200, 1, 1, 0, 0, 0, 0, time.UTC)) {
			return input, conversationError("bad_request", "page_governance_invalid")
		}
	}
	if input.ReviewIntervalDays == 0 && !input.NextReviewAt.IsZero() {
		return input, conversationError("bad_request", "page_governance_review_schedule_invalid")
	}
	seen := map[string]bool{input.OwnerUserID: true}
	admins := make([]string, 0, len(input.ContentAdminUserIDs))
	for _, userID := range input.ContentAdminUserIDs {
		userID = strings.TrimSpace(userID)
		if !validLibraryUser(userID) || seen[userID] {
			return input, conversationError("bad_request", "page_governance_member_invalid")
		}
		seen[userID] = true
		admins = append(admins, userID)
	}
	sort.Strings(admins)
	input.ContentAdminUserIDs = admins
	return input, nil
}

func metadataTimeMillis(value *time.Time) int64 {
	if value == nil {
		return 0
	}
	return durableMillis(*value)
}

func (s *Store) writeKnowledgePageMetadataRecord(ctx context.Context, tx *sql.Tx, metadata knowledgesdk.KnowledgePageMetadata, expectedRevision int64, found bool, a agentsdk.Authority) error {
	values := []any{
		libraryScope(a), metadata.PageID, metadata.LibraryID, a.RuntimeID, a.WorkspaceID, metadata.OwnerUserID, len(metadata.ContentAdminUserIDs), metadata.Status,
		metadataTimeMillis(metadata.NextReviewAt), metadata.ReviewIntervalDays, metadataTimeMillis(metadata.LastReviewedAt), metadata.ArchiveRetentionDays,
		metadataTimeMillis(metadata.ArchivedAt), metadataTimeMillis(metadata.RetainUntil), metadata.Revision, metadataTimeMillis(metadata.UpdatedAt), conversationJSON(metadata),
	}
	if !found {
		q, args, err := query.NewInsertBuilder(s.store.Renderer(), knowledgePageMetadataTable).
			Columns("scope_key", "page_id", "library_id", "runtime_id", "workspace_id", "owner_user_id", "content_admin_count", "status", "next_review_at", "review_interval_days", "last_reviewed_at", "archive_retention_days", "archived_at", "retain_until", "revision", "updated_at", "payload_json").
			Values(values...).Build()
		return conversationExec(ctx, tx, q, args, err)
	}
	q, args, err := query.NewUpdateBuilder(s.store.Renderer(), knowledgePageMetadataTable).
		Set("owner_user_id", metadata.OwnerUserID).Set("content_admin_count", len(metadata.ContentAdminUserIDs)).Set("status", metadata.Status).
		Set("next_review_at", metadataTimeMillis(metadata.NextReviewAt)).Set("review_interval_days", metadata.ReviewIntervalDays).Set("last_reviewed_at", metadataTimeMillis(metadata.LastReviewedAt)).
		Set("archive_retention_days", metadata.ArchiveRetentionDays).Set("archived_at", metadataTimeMillis(metadata.ArchivedAt)).Set("retain_until", metadataTimeMillis(metadata.RetainUntil)).
		Set("revision", metadata.Revision).Set("updated_at", metadataTimeMillis(metadata.UpdatedAt)).Set("payload_json", conversationJSON(metadata)).
		Where(query.And(pageMetadataPredicate(a, metadata.PageID), query.Equal("revision", expectedRevision))).Build()
	return conversationCAS(ctx, tx, q, args, err)
}

func (s *Store) knowledgeLibraryUserExists(ctx context.Context, db conversationDB, libraryID, userID string, a agentsdk.Authority) (bool, error) {
	if userID == "" {
		return true, nil
	}
	var member agentsdk.KnowledgeLibraryMember
	return s.executionRead(ctx, db, knowledgeLibraryMemberTable, libraryMemberPredicate(a, libraryID, agentsdk.KnowledgeSubjectUser, userID), &member)
}

func (s *Store) KnowledgePageMetadata(ctx context.Context, libraryID, pageID string, a agentsdk.Authority) (out knowledgesdk.KnowledgePageMetadata, err error) {
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		library, readErr := s.libraryRecord(ctx, tx, libraryID, a)
		if readErr != nil {
			return readErr
		}
		page, readErr := s.pageRecord(ctx, tx, libraryID, pageID, a)
		if readErr != nil {
			return readErr
		}
		if _, readErr = s.pageView(ctx, tx, library, page, library.Role != "reader", a); readErr != nil {
			return readErr
		}
		var found bool
		out, found, readErr = s.knowledgePageMetadataRecord(ctx, tx, libraryID, pageID, a)
		if readErr == nil && !found {
			out.OwnerUserID = page.CreatedByUserID
		}
		return readErr
	})
	return
}

// clearKnowledgePageMetadataMember keeps descriptive responsibility fields from
// pointing at a user after that user is removed from the library. Page metadata
// has its own revision because this cleanup must not create a fake page/content
// revision or immutable content version.
func (s *Store) clearKnowledgePageMetadataMember(ctx context.Context, tx *sql.Tx, libraryID, userID string, a agentsdk.Authority) error {
	q, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgePageMetadataTable).
		Columns("payload_json").
		Where(query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("library_id", libraryID))).
		Limit(knowledgeLibraryMaximumPages + 1).
		Build()
	if err != nil {
		return err
	}
	rows, err := tx.QueryContext(ctx, q, args...)
	if err != nil {
		return err
	}
	items := []knowledgesdk.KnowledgePageMetadata{}
	for rows.Next() {
		var raw []byte
		var metadata knowledgesdk.KnowledgePageMetadata
		if err = rows.Scan(&raw); err == nil {
			err = unmarshalDurableJSON(raw, &metadata)
		}
		if err != nil {
			_ = rows.Close()
			return err
		}
		items = append(items, metadata)
	}
	if err = rows.Err(); err != nil {
		_ = rows.Close()
		return err
	}
	if err = rows.Close(); err != nil {
		return err
	}
	if len(items) > knowledgeLibraryMaximumPages {
		return conversationError("unavailable", "page_metadata_limit")
	}
	now := time.Now().UTC().Truncate(time.Millisecond)
	for _, metadata := range items {
		changed := false
		if metadata.OwnerUserID == userID {
			// A page must always retain an accountable owner. Fall back to the
			// member performing the removal; the library layer only permits a
			// current manager to remove another member.
			metadata.OwnerUserID = a.UserID
			changed = true
		}
		admins := metadata.ContentAdminUserIDs[:0]
		for _, adminUserID := range metadata.ContentAdminUserIDs {
			if adminUserID == userID {
				changed = true
				continue
			}
			admins = append(admins, adminUserID)
		}
		metadata.ContentAdminUserIDs = admins
		for index := range metadata.Properties {
			if metadata.Properties[index].Type == knowledgesdk.KnowledgePagePropertyPerson && metadata.Properties[index].Value == userID {
				metadata.Properties[index].Value = ""
				changed = true
			}
		}
		if !changed {
			continue
		}
		priorRevision := metadata.Revision
		metadata.Revision++
		metadata.UpdatedByUserID = a.UserID
		metadata.UpdatedAt = &now
		if err = s.writeKnowledgePageMetadataRecord(ctx, tx, metadata, priorRevision, true, a); err != nil {
			return err
		}
	}
	return nil
}

func (s *Store) SetKnowledgePageMetadata(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgePageMetadataWrite, a agentsdk.Authority) (out knowledgesdk.KnowledgePageMetadata, err error) {
	input, err = normalizeKnowledgePageMetadataWrite(input)
	if err != nil {
		return out, err
	}
	err = s.mutateKnowledgeOperation(ctx, "knowledge.page.metadata.set", knowledgesdk.ActionPageMetadataSet, libraryID+":"+pageID, input.ClientID, input, a, func(tx *sql.Tx) (any, error) {
		library, readErr := s.libraryRecord(ctx, tx, libraryID, a)
		if readErr != nil {
			return out, readErr
		}
		page, readErr := s.pageRecord(ctx, tx, libraryID, pageID, a)
		if readErr != nil {
			return out, readErr
		}
		effective, readErr := s.evaluateKnowledgePageAccess(ctx, tx, libraryID, pageID, a)
		if readErr != nil || !effective.Allowed || roleLevel(effective.Role) < roleLevel("editor") || page.State != "active" || library.Archived {
			if readErr != nil {
				return out, readErr
			}
			return out, conversationError("not_found", "page_not_found")
		}
		current, found, readErr := s.knowledgePageMetadataRecord(ctx, tx, libraryID, pageID, a)
		if readErr != nil {
			return out, readErr
		}
		if current.Revision != input.ExpectedRevision {
			return out, conversationError("conflict", "page_metadata_revision_conflict")
		}
		for _, alias := range input.Aliases {
			aliasKey, _, _ := normalizedPageAlias(alias)
			if aliasKey == strings.ToLower(strings.TrimSpace(page.Title)) {
				return out, conversationError("bad_request", "page_metadata_alias_matches_title")
			}
		}
		for _, targetPageID := range input.RelatedPageIDs {
			if targetPageID == pageID {
				return out, conversationError("bad_request", "page_metadata_relation_self")
			}
			target, targetErr := s.pageRecord(ctx, tx, libraryID, targetPageID, a)
			if targetErr != nil || target.State != "active" {
				return out, conversationError("not_found", "page_not_found")
			}
			targetAccess, accessErr := s.evaluateKnowledgePageAccess(ctx, tx, libraryID, targetPageID, a)
			if accessErr != nil || !targetAccess.Allowed || roleLevel(targetAccess.Role) < roleLevel("reader") {
				return out, conversationError("not_found", "page_not_found")
			}
			if roleLevel(targetAccess.Role) < roleLevel("editor") && target.PublishedVersion < 1 {
				return out, conversationError("not_found", "page_not_found")
			}
		}
		users := []string{}
		for _, property := range input.Properties {
			if property.Type == knowledgesdk.KnowledgePagePropertyPerson {
				users = append(users, property.Value)
			}
		}
		checkedUsers := map[string]bool{}
		for _, userID := range users {
			if userID == "" || checkedUsers[userID] {
				continue
			}
			exists, memberErr := s.knowledgeLibraryUserExists(ctx, tx, libraryID, userID, a)
			if memberErr != nil {
				return out, memberErr
			}
			if !exists {
				return out, conversationError("bad_request", "page_metadata_member_invalid")
			}
			checkedUsers[userID] = true
		}
		now := time.Now().UTC().Truncate(time.Millisecond)
		out = current
		out.Aliases, out.RelatedPageIDs, out.Tags, out.Status, out.Properties = input.Aliases, input.RelatedPageIDs, input.Tags, input.Status, input.Properties
		out.Revision, out.UpdatedByUserID, out.UpdatedAt = current.Revision+1, a.UserID, &now
		if readErr = s.writeKnowledgePageMetadataRecord(ctx, tx, out, input.ExpectedRevision, found, a); readErr != nil {
			return out, readErr
		}
		q, args, buildErr := query.NewDeleteBuilder(s.store.Renderer(), knowledgePageTagTable).Where(pageMetadataPredicate(a, pageID)).Build()
		if readErr = conversationExec(ctx, tx, q, args, buildErr); readErr != nil {
			return out, readErr
		}
		for _, tag := range out.Tags {
			key, label, _ := normalizedPageTag(tag)
			q, args, buildErr = query.NewInsertBuilder(s.store.Renderer(), knowledgePageTagTable).Columns("scope_key", "library_id", "page_id", "tag_key", "tag_label").Values(libraryScope(a), libraryID, pageID, key, label).Build()
			if readErr = conversationExec(ctx, tx, q, args, buildErr); readErr != nil {
				return out, readErr
			}
		}
		q, args, buildErr = query.NewDeleteBuilder(s.store.Renderer(), knowledgePageNameTable).Where(query.And(pageMetadataPredicate(a, pageID), query.Equal("name_kind", knowledgePageNameAlias))).Build()
		if readErr = conversationExec(ctx, tx, q, args, buildErr); readErr != nil {
			return out, readErr
		}
		for _, alias := range out.Aliases {
			key, label, _ := normalizedPageAlias(alias)
			q, args, buildErr = query.NewInsertBuilder(s.store.Renderer(), knowledgePageNameTable).Columns("scope_key", "library_id", "page_id", "name_kind", "name_key", "name_label").Values(libraryScope(a), libraryID, pageID, knowledgePageNameAlias, key, label).Build()
			if readErr = conversationExec(ctx, tx, q, args, buildErr); readErr != nil {
				return out, readErr
			}
		}
		q, args, buildErr = query.NewDeleteBuilder(s.store.Renderer(), knowledgePageRelationTable).Where(query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("source_page_id", pageID))).Build()
		if readErr = conversationExec(ctx, tx, q, args, buildErr); readErr != nil {
			return out, readErr
		}
		for _, targetPageID := range out.RelatedPageIDs {
			relation := knowledgePageRelationRecord{LibraryID: libraryID, SourcePageID: pageID, TargetPageID: targetPageID, UpdatedByUserID: a.UserID, UpdatedAt: now.UnixMilli()}
			q, args, buildErr = query.NewInsertBuilder(s.store.Renderer(), knowledgePageRelationTable).Columns("scope_key", "library_id", "source_page_id", "target_page_id", "updated_at", "payload_json").Values(libraryScope(a), libraryID, pageID, targetPageID, now.UnixMilli(), conversationJSON(relation)).Build()
			if readErr = conversationExec(ctx, tx, q, args, buildErr); readErr != nil {
				return out, readErr
			}
		}
		return out, nil
	}, &out)
	if err == nil {
		s.notifyKnowledgeCollaboration(ctx, a, libraryID, pageID)
	}
	return
}

func (s *Store) insertDefaultKnowledgePageMetadata(ctx context.Context, tx *sql.Tx, page knowledgesdk.KnowledgePage, a agentsdk.Authority) error {
	metadata := emptyKnowledgePageMetadata(page.LibraryID, page.ID)
	metadata.OwnerUserID = page.CreatedByUserID
	now := page.CreatedAt.UTC().Truncate(time.Millisecond)
	nextReviewAt := now.AddDate(0, 0, metadata.ReviewIntervalDays)
	metadata.NextReviewAt = &nextReviewAt
	metadata.Revision, metadata.UpdatedByUserID, metadata.UpdatedAt = 1, a.UserID, &now
	return s.writeKnowledgePageMetadataRecord(ctx, tx, metadata, 0, false, a)
}

func (s *Store) SetKnowledgePageGovernance(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgePageGovernanceWrite, a agentsdk.Authority) (out knowledgesdk.KnowledgePageMetadata, err error) {
	input, err = normalizeKnowledgePageGovernanceWrite(input)
	if err != nil {
		return out, err
	}
	err = s.mutateKnowledgeOperation(ctx, "knowledge.page.governance.set", knowledgesdk.ActionPageGovernanceSet, libraryID+":"+pageID, input.ClientID, input, a, func(tx *sql.Tx) (any, error) {
		library, readErr := s.libraryRecord(ctx, tx, libraryID, a)
		if readErr != nil {
			return out, readErr
		}
		page, readErr := s.pageRecord(ctx, tx, libraryID, pageID, a)
		if readErr != nil {
			return out, readErr
		}
		effective, readErr := s.evaluateKnowledgePageAccess(ctx, tx, libraryID, pageID, a)
		if readErr != nil || !effective.Allowed || roleLevel(library.Role) < roleLevel("manager") || roleLevel(effective.Role) < roleLevel("manager") || library.Archived {
			if readErr != nil {
				return out, readErr
			}
			return out, conversationError("not_found", "page_not_found")
		}
		current, found, readErr := s.knowledgePageMetadataRecord(ctx, tx, libraryID, pageID, a)
		if readErr != nil {
			return out, readErr
		}
		if !found {
			current.OwnerUserID = page.CreatedByUserID
		}
		if current.Revision != input.ExpectedRevision {
			return out, conversationError("conflict", "page_metadata_revision_conflict")
		}
		for _, userID := range append([]string{input.OwnerUserID}, input.ContentAdminUserIDs...) {
			exists, memberErr := s.knowledgeLibraryUserExists(ctx, tx, libraryID, userID, a)
			if memberErr != nil {
				return out, memberErr
			}
			if !exists {
				return out, conversationError("bad_request", "page_governance_member_invalid")
			}
		}
		now := time.Now().UTC().Truncate(time.Millisecond)
		current.OwnerUserID = input.OwnerUserID
		current.ContentAdminUserIDs = append([]string(nil), input.ContentAdminUserIDs...)
		current.ArchiveRetentionDays = input.ArchiveRetentionDays
		current.ReviewIntervalDays = input.ReviewIntervalDays
		if input.NextReviewAt.IsZero() {
			if input.ReviewIntervalDays > 0 {
				next := now.AddDate(0, 0, input.ReviewIntervalDays)
				current.NextReviewAt = &next
			} else {
				current.NextReviewAt = nil
			}
		} else {
			next := input.NextReviewAt
			current.NextReviewAt = &next
		}
		if page.State == "archived" {
			if current.ArchivedAt == nil {
				archivedAt := page.UpdatedAt.UTC().Truncate(time.Millisecond)
				current.ArchivedAt = &archivedAt
			}
			retainUntil := current.ArchivedAt.AddDate(0, 0, current.ArchiveRetentionDays)
			current.RetainUntil = &retainUntil
		}
		current.Revision++
		current.UpdatedByUserID, current.UpdatedAt = a.UserID, &now
		if readErr = s.writeKnowledgePageMetadataRecord(ctx, tx, current, input.ExpectedRevision, found, a); readErr != nil {
			return out, readErr
		}
		out = current
		return out, nil
	}, &out)
	if err == nil {
		s.notifyKnowledgeCollaboration(ctx, a, libraryID, pageID)
	}
	return
}

func containsKnowledgePageContentAdmin(values []string, userID string) bool {
	for _, value := range values {
		if value == userID {
			return true
		}
	}
	return false
}

func (s *Store) ReviewKnowledgePageGovernance(ctx context.Context, libraryID, pageID string, input knowledgesdk.KnowledgePageGovernanceReview, a agentsdk.Authority) (out knowledgesdk.KnowledgePageMetadata, err error) {
	if input.ExpectedRevision < 1 || !personalMemoryKey(input.ClientID) {
		return out, conversationError("bad_request", "page_governance_review_invalid")
	}
	err = s.mutateKnowledgeOperation(ctx, "knowledge.page.governance.review", knowledgesdk.ActionPageGovernanceReview, libraryID+":"+pageID, input.ClientID, input, a, func(tx *sql.Tx) (any, error) {
		library, readErr := s.libraryRecord(ctx, tx, libraryID, a)
		if readErr != nil {
			return out, readErr
		}
		page, readErr := s.pageRecord(ctx, tx, libraryID, pageID, a)
		if readErr != nil {
			return out, readErr
		}
		effective, readErr := s.evaluateKnowledgePageAccess(ctx, tx, libraryID, pageID, a)
		if readErr != nil || !effective.Allowed || roleLevel(effective.Role) < roleLevel("editor") || page.State != "active" || library.Archived {
			if readErr != nil {
				return out, readErr
			}
			return out, conversationError("not_found", "page_not_found")
		}
		current, found, readErr := s.knowledgePageMetadataRecord(ctx, tx, libraryID, pageID, a)
		if readErr != nil {
			return out, readErr
		}
		if !found || current.Revision != input.ExpectedRevision {
			return out, conversationError("conflict", "page_metadata_revision_conflict")
		}
		if roleLevel(library.Role) < roleLevel("manager") && current.OwnerUserID != a.UserID && !containsKnowledgePageContentAdmin(current.ContentAdminUserIDs, a.UserID) {
			return out, conversationError("forbidden", "page_governance_review_denied")
		}
		now := time.Now().UTC().Truncate(time.Millisecond)
		current.LastReviewedAt, current.LastReviewedByUserID = &now, a.UserID
		if current.ReviewIntervalDays > 0 {
			next := now.AddDate(0, 0, current.ReviewIntervalDays)
			current.NextReviewAt = &next
		} else {
			current.NextReviewAt = nil
		}
		current.Revision++
		current.UpdatedByUserID, current.UpdatedAt = a.UserID, &now
		if readErr = s.writeKnowledgePageMetadataRecord(ctx, tx, current, input.ExpectedRevision, true, a); readErr != nil {
			return out, readErr
		}
		out = current
		return out, nil
	}, &out)
	if err == nil {
		s.notifyKnowledgeCollaboration(ctx, a, libraryID, pageID)
	}
	return
}

// setKnowledgePageArchiveGovernance is called in the same transaction as the
// page state change, so ArchivedAt and RetainUntil can never describe a state
// that did not commit. A page past RetainUntil is no longer restorable even if
// the asynchronous purge worker has not removed its rows yet.
func (s *Store) setKnowledgePageArchiveGovernance(ctx context.Context, tx *sql.Tx, page knowledgesdk.KnowledgePage, archived bool, now time.Time, a agentsdk.Authority) error {
	metadata, found, err := s.knowledgePageMetadataRecord(ctx, tx, page.LibraryID, page.ID, a)
	if err != nil {
		return err
	}
	if !found {
		metadata.OwnerUserID = page.CreatedByUserID
		metadata.Revision = 0
	}
	if !archived && metadata.RetainUntil != nil && !now.Before(*metadata.RetainUntil) {
		return conversationError("conflict", "page_archive_retention_expired")
	}
	if archived {
		archivedAt := now
		retainUntil := archivedAt.AddDate(0, 0, metadata.ArchiveRetentionDays)
		metadata.ArchivedAt, metadata.RetainUntil = &archivedAt, &retainUntil
	} else {
		metadata.ArchivedAt, metadata.RetainUntil = nil, nil
	}
	expected := metadata.Revision
	metadata.Revision++
	metadata.UpdatedByUserID, metadata.UpdatedAt = a.UserID, &now
	return s.writeKnowledgePageMetadataRecord(ctx, tx, metadata, expected, found, a)
}
