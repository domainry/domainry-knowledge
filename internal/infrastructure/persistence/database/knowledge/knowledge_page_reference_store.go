package store

import (
	"context"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"strings"
	"time"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-orm/query"
)

const (
	knowledgePageReferenceMaximumPerPage = 256
	knowledgePageReferenceMaximumDepth   = 8
	knowledgePageReferenceMaximumNodes   = 512
)

type knowledgePageReferenceRecord struct {
	SourcePageID  string `json:"source_page_id"`
	BlockID       string `json:"block_id"`
	LibraryID     string `json:"library_id"`
	TargetPageID  string `json:"target_page_id"`
	ContentType   string `json:"content_type"`
	ReferenceMode string `json:"reference_mode"`
	TargetVersion int64  `json:"target_version"`
	Display       string `json:"display"`
	UpdatedAt     int64  `json:"updated_at"`
}

func knowledgePageReferenceCursor(direction knowledgesdk.KnowledgePageReferenceDirection, reference knowledgePageReferenceRecord) string {
	value := reference.BlockID
	if direction == knowledgesdk.KnowledgePageReferenceIncoming {
		value = reference.SourcePageID + "\n" + reference.BlockID
	}
	return base64.RawURLEncoding.EncodeToString([]byte(value))
}

func parseKnowledgePageReferenceCursor(direction knowledgesdk.KnowledgePageReferenceDirection, value string) (string, string, error) {
	if value == "" {
		return "", "", nil
	}
	raw, err := base64.RawURLEncoding.DecodeString(value)
	if err != nil {
		return "", "", conversationError("bad_request", "page_reference_query_invalid")
	}
	parts := strings.Split(string(raw), "\n")
	if direction == knowledgesdk.KnowledgePageReferenceOutgoing {
		if len(parts) != 1 || !knowledgeBlockIDPattern.MatchString(parts[0]) {
			return "", "", conversationError("bad_request", "page_reference_query_invalid")
		}
		return "", parts[0], nil
	}
	if len(parts) != 2 || !validKnowledgePageID(parts[0]) || !knowledgeBlockIDPattern.MatchString(parts[1]) {
		return "", "", conversationError("bad_request", "page_reference_query_invalid")
	}
	return parts[0], parts[1], nil
}

func knowledgePageReferenceLimit(limit int) (int, error) {
	if limit == 0 {
		limit = 20
	}
	if limit < 1 || limit > 100 {
		return 0, conversationError("bad_request", "page_reference_query_invalid")
	}
	return limit, nil
}

func (s *Store) visibleKnowledgePageReferencePage(ctx context.Context, tx *sql.Tx, library knowledgesdk.KnowledgeLibrary, pageID string, a knowledgesdk.Authority) (string, string, bool, error) {
	page, err := s.pageRecord(ctx, tx, library.ID, pageID, a)
	if err != nil {
		return "", "", false, err
	}
	access, err := s.evaluateKnowledgePageAccess(ctx, tx, library.ID, pageID, a)
	if err != nil {
		return "", "", false, err
	}
	if !access.Allowed || page.State != "active" {
		return "", "", false, nil
	}
	if roleLevel(access.Role) < roleLevel("editor") {
		if page.PublishedVersion < 1 {
			return "", "", false, nil
		}
		version, versionErr := s.pageVersion(ctx, tx, page.ID, page.PublishedVersion, a)
		if versionErr != nil {
			return "", "", false, versionErr
		}
		return version.Title, version.ContentType, true, nil
	}
	return page.Title, page.ContentType, true, nil
}

func (s *Store) KnowledgePageReferences(ctx context.Context, libraryID, pageID string, direction knowledgesdk.KnowledgePageReferenceDirection, after string, limit int, a knowledgesdk.Authority) (out knowledgesdk.KnowledgePageReferencePage, err error) {
	out = knowledgesdk.KnowledgePageReferencePage{Direction: direction, Items: []knowledgesdk.KnowledgePageReferenceLink{}, Complete: true}
	if err = conversationAuthority(a); err != nil {
		return
	}
	if direction != knowledgesdk.KnowledgePageReferenceOutgoing && direction != knowledgesdk.KnowledgePageReferenceIncoming {
		return out, conversationError("bad_request", "page_reference_query_invalid")
	}
	if limit, err = knowledgePageReferenceLimit(limit); err != nil {
		return
	}
	afterSource, afterBlock, err := parseKnowledgePageReferenceCursor(direction, after)
	if err != nil {
		return out, err
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		library, readErr := s.libraryRecord(ctx, tx, libraryID, a)
		if readErr != nil {
			return readErr
		}
		current, readErr := s.pageRecord(ctx, tx, libraryID, pageID, a)
		if readErr != nil {
			return readErr
		}
		access, readErr := s.evaluateKnowledgePageAccess(ctx, tx, libraryID, pageID, a)
		if readErr != nil {
			return readErr
		}
		if !access.Allowed || current.State != "active" {
			return conversationError("not_found", "page_not_found")
		}
		if roleLevel(access.Role) < roleLevel("editor") && current.PublishedVersion < 1 {
			return conversationError("not_found", "page_not_found")
		}

		predicate := query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("source_page_id", pageID))
		order := []query.Order{query.Ascending("block_id")}
		if direction == knowledgesdk.KnowledgePageReferenceIncoming {
			predicate = query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("target_page_id", pageID))
			order = []query.Order{query.Ascending("source_page_id"), query.Ascending("block_id")}
			if afterSource != "" {
				predicate = query.And(predicate, query.Or(query.GreaterThan("source_page_id", afterSource), query.And(query.Equal("source_page_id", afterSource), query.GreaterThan("block_id", afterBlock))))
			}
		} else if afterBlock != "" {
			predicate = query.And(predicate, query.GreaterThan("block_id", afterBlock))
		}
		scanLimit := limit*4 + 1
		builder := query.NewSelectBuilder(s.store.Renderer(), knowledgePageReferenceTable).Columns("payload_json").Where(predicate)
		for _, item := range order {
			builder = builder.OrderBy(item)
		}
		statement, args, buildErr := builder.Limit(scanLimit).Build()
		if buildErr != nil {
			return buildErr
		}
		rows, queryErr := tx.QueryContext(ctx, statement, args...)
		if queryErr != nil {
			return queryErr
		}
		defer rows.Close()
		references := make([]knowledgePageReferenceRecord, 0, scanLimit)
		for rows.Next() {
			var raw []byte
			var reference knowledgePageReferenceRecord
			if readErr = rows.Scan(&raw); readErr == nil {
				readErr = unmarshalDurableJSON(raw, &reference)
			}
			if readErr != nil {
				return readErr
			}
			references = append(references, reference)
		}
		if readErr = rows.Err(); readErr != nil {
			return readErr
		}

		currentTitle, currentType, _, readErr := s.visibleKnowledgePageReferencePage(ctx, tx, library, pageID, a)
		if readErr != nil {
			return readErr
		}
		for index, reference := range references {
			otherID := reference.TargetPageID
			if direction == knowledgesdk.KnowledgePageReferenceIncoming {
				otherID = reference.SourcePageID
			}
			otherTitle, otherType, available, resolveErr := s.visibleKnowledgePageReferencePage(ctx, tx, library, otherID, a)
			if resolveErr != nil {
				return resolveErr
			}
			if direction == knowledgesdk.KnowledgePageReferenceIncoming && !available {
				continue
			}
			link := knowledgesdk.KnowledgePageReferenceLink{
				SourcePageID: reference.SourcePageID, TargetPageID: reference.TargetPageID, BlockID: reference.BlockID,
				ReferenceMode: reference.ReferenceMode, TargetVersion: reference.TargetVersion, Display: reference.Display, Available: available, UpdatedAt: time.UnixMilli(reference.UpdatedAt).UTC(),
			}
			if direction == knowledgesdk.KnowledgePageReferenceOutgoing {
				link.SourceTitle, link.SourceType, link.TargetTitle, link.TargetType = currentTitle, currentType, otherTitle, otherType
			} else {
				link.SourceTitle, link.SourceType, link.TargetTitle, link.TargetType = otherTitle, otherType, currentTitle, currentType
			}
			out.Items = append(out.Items, link)
			if len(out.Items) == limit {
				out.Complete = index == len(references)-1 && len(references) < scanLimit
				if !out.Complete {
					out.NextAfter = knowledgePageReferenceCursor(direction, reference)
				}
				return nil
			}
		}
		if len(references) == scanLimit {
			out.Complete = false
			out.NextAfter = knowledgePageReferenceCursor(direction, references[len(references)-1])
		}
		return nil
	})
	return
}

func documentPageReferences(sourcePageID, libraryID, content string, now time.Time) ([]knowledgePageReferenceRecord, error) {
	decoder := json.NewDecoder(strings.NewReader(content))
	decoder.UseNumber()
	var payload struct {
		Blocks []map[string]any `json:"blocks"`
	}
	if err := decoder.Decode(&payload); err != nil {
		return nil, err
	}
	if err := decoder.Decode(&struct{}{}); err != io.EOF {
		return nil, fmt.Errorf("document reference content has trailing data")
	}
	references := make([]knowledgePageReferenceRecord, 0)
	var walk func([]map[string]any) error
	walk = func(blocks []map[string]any) error {
		for _, block := range blocks {
			blockID, _ := block["id"].(string)
			blockType, _ := block["type"].(string)
			if blockType == "knowledgeReference" {
				props, _ := block["props"].(map[string]any)
				targetPageID, _ := props["targetPageId"].(string)
				targetPageID = strings.TrimSpace(targetPageID)
				// A newly inserted reference is a valid draft before the user picks
				// its target.  It becomes an indexed edge only after that choice;
				// publish validation still rejects unresolved references.
				if targetPageID == "" {
					continue
				}
				contentType, _ := props["targetType"].(string)
				referenceMode, _ := props["referenceMode"].(string)
				display, _ := props["display"].(string)
				if referenceMode == "" {
					referenceMode = "live"
				}
				targetVersion := int64(0)
				if raw, exists := props["targetVersion"]; exists {
					targetVersion, _ = knowledgeJSONInteger(raw, 0, 1<<31-1)
				}
				references = append(references, knowledgePageReferenceRecord{
					SourcePageID: sourcePageID, BlockID: blockID, LibraryID: libraryID, TargetPageID: targetPageID, ContentType: contentType,
					ReferenceMode: referenceMode, TargetVersion: targetVersion, Display: display, UpdatedAt: now.UnixMilli(),
				})
				if len(references) > knowledgePageReferenceMaximumPerPage {
					return conversationError("conflict", "page_reference_limit")
				}
			}
			if rawChildren, ok := block["children"].([]any); ok {
				children := make([]map[string]any, 0, len(rawChildren))
				for _, rawChild := range rawChildren {
					child, valid := rawChild.(map[string]any)
					if !valid {
						return conversationError("bad_request", "page_content_schema_invalid")
					}
					children = append(children, child)
				}
				if err := walk(children); err != nil {
					return err
				}
			}
		}
		return nil
	}
	if err := walk(payload.Blocks); err != nil {
		return nil, err
	}
	return references, nil
}

func replaceDocumentBlockWithReference(content, blockID string, target knowledgesdk.KnowledgePage, display string) (string, error) {
	decoder := json.NewDecoder(strings.NewReader(content))
	decoder.UseNumber()
	var root map[string]any
	if err := decoder.Decode(&root); err != nil {
		return "", conversationError("bad_request", "page_content_schema_invalid")
	}
	if err := decoder.Decode(&struct{}{}); err != io.EOF {
		return "", conversationError("bad_request", "page_content_schema_invalid")
	}
	blocks, ok := root["blocks"].([]any)
	if !ok {
		return "", conversationError("bad_request", "page_content_schema_invalid")
	}
	found := false
	var replace func([]any)
	replace = func(items []any) {
		for index, raw := range items {
			block, valid := raw.(map[string]any)
			if !valid {
				continue
			}
			if currentID, _ := block["id"].(string); currentID == blockID {
				items[index] = map[string]any{
					"id": blockID, "type": "knowledgeReference",
					"props": map[string]any{
						"targetPageId": target.ID, "title": target.Title, "targetType": target.ContentType, "display": display,
						"referenceMode": "live", "targetVersion": 0, "embeddedEdit": display == "embed",
					},
					"content": []any{}, "children": []any{},
				}
				found = true
				return
			}
			if children, valid := block["children"].([]any); valid {
				replace(children)
				if found {
					return
				}
			}
		}
	}
	replace(blocks)
	if !found {
		return "", conversationError("conflict", "page_reference_source_block_not_found")
	}
	encoded, err := json.Marshal(root)
	if err != nil {
		return "", conversationError("bad_request", "page_content_schema_invalid")
	}
	return string(encoded), nil
}

func (s *Store) outgoingPageReferences(ctx context.Context, tx *sql.Tx, sourcePageID string, a knowledgesdk.Authority) ([]knowledgePageReferenceRecord, error) {
	q, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgePageReferenceTable).Columns("payload_json").
		Where(query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("source_page_id", sourcePageID))).
		OrderBy(query.Ascending("block_id")).Limit(knowledgePageReferenceMaximumPerPage + 1).Build()
	if err != nil {
		return nil, err
	}
	rows, err := tx.QueryContext(ctx, q, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	references := make([]knowledgePageReferenceRecord, 0)
	for rows.Next() {
		var raw []byte
		var reference knowledgePageReferenceRecord
		if err = rows.Scan(&raw); err == nil {
			err = unmarshalDurableJSON(raw, &reference)
		}
		if err != nil {
			return nil, err
		}
		references = append(references, reference)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	if len(references) > knowledgePageReferenceMaximumPerPage {
		return nil, conversationError("conflict", "page_reference_limit")
	}
	return references, nil
}

func (s *Store) validatePageReferenceGraph(ctx context.Context, tx *sql.Tx, libraryID, sourcePageID string, candidates []knowledgePageReferenceRecord, a knowledgesdk.Authority) error {
	for _, reference := range candidates {
		if reference.TargetPageID == sourcePageID {
			return conversationError("conflict", "page_reference_cycle")
		}
		target, err := s.pageRecord(ctx, tx, libraryID, reference.TargetPageID, a)
		if err != nil || target.State != "active" {
			return conversationError("not_found", "page_not_found")
		}
		if reference.ContentType != target.ContentType {
			return conversationError("conflict", "page_reference_type_mismatch")
		}
		access, accessErr := s.evaluateKnowledgePageAccess(ctx, tx, libraryID, reference.TargetPageID, a)
		if accessErr != nil || !access.Allowed || roleLevel(access.Role) < roleLevel("reader") {
			return conversationError("not_found", "page_not_found")
		}
		if reference.ReferenceMode == "fixed" {
			if reference.TargetVersion < 1 {
				return conversationError("bad_request", "page_reference_version_invalid")
			}
			if _, err = s.pageVersion(ctx, tx, reference.TargetPageID, reference.TargetVersion, a); err != nil {
				return conversationError("not_found", "page_version_not_found")
			}
		}
	}

	memo := make(map[string]int)
	visiting := make(map[string]bool)
	seen := make(map[string]bool)
	var depthFrom func(string) (int, error)
	depthFrom = func(pageID string) (int, error) {
		if depth, ok := memo[pageID]; ok {
			return depth, nil
		}
		if visiting[pageID] {
			return 0, conversationError("conflict", "page_reference_cycle")
		}
		visiting[pageID] = true
		seen[pageID] = true
		if len(seen) > knowledgePageReferenceMaximumNodes {
			return 0, conversationError("conflict", "page_reference_graph_limit")
		}
		references := candidates
		if pageID != sourcePageID {
			page, err := s.pageRecord(ctx, tx, libraryID, pageID, a)
			if err != nil || page.State != "active" {
				visiting[pageID] = false
				memo[pageID] = 0
				return 0, nil
			}
			references, err = s.outgoingPageReferences(ctx, tx, pageID, a)
			if err != nil {
				return 0, err
			}
		}
		maximum := 0
		for _, reference := range references {
			depth, err := depthFrom(reference.TargetPageID)
			if err != nil {
				return 0, err
			}
			if depth+1 > maximum {
				maximum = depth + 1
			}
		}
		visiting[pageID] = false
		memo[pageID] = maximum
		return maximum, nil
	}
	depth, err := depthFrom(sourcePageID)
	if err != nil {
		return err
	}
	if depth > knowledgePageReferenceMaximumDepth {
		return conversationError("conflict", "page_reference_depth")
	}
	return nil
}

func (s *Store) replaceKnowledgePageReferences(ctx context.Context, tx *sql.Tx, libraryID, sourcePageID, content string, a knowledgesdk.Authority) error {
	now := time.Now().UTC().Truncate(time.Millisecond)
	references, err := documentPageReferences(sourcePageID, libraryID, content, now)
	if err != nil {
		return conversationError("bad_request", "page_content_schema_invalid")
	}
	if err = s.validatePageReferenceGraph(ctx, tx, libraryID, sourcePageID, references, a); err != nil {
		return err
	}
	q, args, err := query.NewDeleteBuilder(s.store.Renderer(), knowledgePageReferenceTable).Where(query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("source_page_id", sourcePageID))).Build()
	if err = conversationExec(ctx, tx, q, args, err); err != nil {
		return err
	}
	for _, reference := range references {
		q, args, err = query.NewInsertBuilder(s.store.Renderer(), knowledgePageReferenceTable).Columns(
			"scope_key", "source_page_id", "block_id", "library_id", "target_page_id", "content_type", "reference_mode", "target_version", "display", "updated_at", "payload_json",
		).Values(libraryScope(a), sourcePageID, reference.BlockID, libraryID, reference.TargetPageID, reference.ContentType, reference.ReferenceMode, reference.TargetVersion, reference.Display, reference.UpdatedAt, conversationJSON(reference)).Build()
		if err = conversationExec(ctx, tx, q, args, err); err != nil {
			return err
		}
	}
	return nil
}

func (s *Store) CreateKnowledgePageReference(ctx context.Context, libraryID, parentPageID string, in knowledgesdk.KnowledgePageReferenceCreate, a knowledgesdk.Authority) (out knowledgesdk.KnowledgePageReferenceCreateResult, err error) {
	if err = conversationAuthority(a); err != nil {
		return
	}
	if !validKnowledgePageID(parentPageID) || !executionText(in.Title, 256, true) || !validKnowledgePageType(in.ContentType) || in.ContentType == knowledgesdk.KnowledgePageTypeDocument ||
		(in.Display != "card" && in.Display != "embed") || !knowledgeBlockIDPattern.MatchString(in.ReferenceBlockID) || in.ExpectedParentDraftRevision < 1 || in.ExpectedParentPageRevision < 1 {
		return out, conversationError("bad_request", "page_reference_create_invalid")
	}
	requestKey, err := pageRequestKey("reference", libraryID, parentPageID, in.ClientID, a)
	if err != nil {
		return out, err
	}
	requestHash := conversationHash(in)
	err = s.mutateKnowledgeOperation(ctx, "knowledge.page_reference.create", knowledgesdk.ActionPageReferencesCreate, libraryID+":"+parentPageID, in.ClientID, in, a, func(tx *sql.Tx) (any, error) {
		library, e := s.libraryRecord(ctx, tx, libraryID, a)
		if e != nil {
			return out, e
		}
		if e = requirePageWriting(library); e != nil {
			return out, e
		}
		parent, e := s.pageRecord(ctx, tx, libraryID, parentPageID, a)
		if e != nil {
			return out, e
		}
		if parent.State != "active" || parent.ContentType != knowledgesdk.KnowledgePageTypeDocument {
			return out, conversationError("conflict", "page_reference_parent_invalid")
		}
		parentDraft, found, e := s.pageDraft(ctx, tx, parentPageID, a)
		if e != nil {
			return out, e
		}
		if !found {
			return out, conversationError("conflict", "page_draft_missing")
		}
		if parentDraft.DraftRevision != in.ExpectedParentDraftRevision || parent.Revision != in.ExpectedParentPageRevision {
			return out, pageDraftConflict("page_draft_revision_conflict", parentDraft)
		}
		parentBody, e := s.normalizedTypedPageContent(parent.ContentType, in.ParentContentSchemaVersion, in.ParentContent, in.ParentContentSHA256)
		if e != nil {
			return out, e
		}
		if e = s.validatePageParent(ctx, tx, libraryID, "", parentPageID, a); e != nil {
			return out, e
		}
		q, args, e := query.NewSelectBuilder(s.store.Renderer(), knowledgePageTable).Projections(query.Project(query.CountAll())).Where(query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("library_id", libraryID))).Build()
		if e != nil {
			return out, e
		}
		var count int
		if e = tx.QueryRowContext(ctx, q, args...).Scan(&count); e != nil {
			return out, e
		}
		if count >= knowledgeLibraryMaximumPages {
			return out, conversationError("conflict", "page_limit")
		}
		id, e := randomKnowledgeID("kpage_")
		if e != nil {
			return out, e
		}
		now := time.Now().UTC().Truncate(time.Millisecond)
		target := knowledgesdk.KnowledgePage{
			ID: id, LibraryID: libraryID, ParentPageID: parentPageID, Rank: defaultPageRank(now, id), Title: strings.TrimSpace(in.Title), ContentType: in.ContentType,
			State: "active", ProjectionStatus: "none", AccessMode: knowledgesdk.KnowledgePageAccessInherit, AccessRevision: 1, AccessStatus: "ready", Revision: 1,
			CreatedByUserID: a.UserID, UpdatedByUserID: a.UserID, CreatedAt: now, UpdatedAt: now,
		}
		targetDraft := knowledgesdk.KnowledgePageDraft{
			PageID: id, LibraryID: libraryID, DraftRevision: 1, Title: target.Title, ContentType: target.ContentType, ParentPageID: target.ParentPageID, Rank: target.Rank,
			Body: emptyPageContentForType(target.ContentType), UpdatedByUserID: a.UserID, UpdatedAt: now,
		}
		q, args, e = query.NewInsertBuilder(s.store.Renderer(), knowledgePageTable).Columns("scope_key", "page_id", "library_id", "parent_page_id", "rank", "state", "published_parent_page_id", "published_rank", "revision", "published_version", "updated_at", "request_key", "request_hash", "payload_json").Values(libraryScope(a), id, libraryID, target.ParentPageID, target.Rank, target.State, "", "", target.Revision, 0, now.UnixMilli(), requestKey, requestHash, conversationJSON(target)).Build()
		if e = conversationExec(ctx, tx, q, args, e); e != nil {
			return out, e
		}
		if e = s.insertDefaultKnowledgePageMetadata(ctx, tx, target, a); e != nil {
			return out, e
		}
		if e = s.replaceKnowledgePageName(ctx, tx, libraryID, id, knowledgePageNameDraftTitle, target.Title, a); e != nil {
			return out, e
		}
		if e = s.insertKnowledgePageAccess(ctx, tx, &target, requestKey, requestHash, a); e != nil {
			return out, e
		}
		q, args, e = query.NewInsertBuilder(s.store.Renderer(), knowledgePageDraftTable).Columns("scope_key", "page_id", "library_id", "base_published_version", "draft_revision", "updated_at", "last_request_key", "last_request_hash", "payload_json").Values(libraryScope(a), id, libraryID, 0, 1, now.UnixMilli(), requestKey, requestHash, conversationJSON(targetDraft)).Build()
		if e = conversationExec(ctx, tx, q, args, e); e != nil {
			return out, e
		}
		if _, e = s.touchKnowledgePagePersonalState(ctx, tx, libraryID, id, "edited", now, a); e != nil {
			return out, e
		}

		parentContent, e := replaceDocumentBlockWithReference(parentBody.Content, in.ReferenceBlockID, target, in.Display)
		if e != nil {
			return out, e
		}
		parentBody, e = s.normalizedTypedPageContent(parent.ContentType, knowledgesdk.PageContentSchemaVersion, parentContent, "")
		if e != nil {
			return out, e
		}
		if e = s.replaceKnowledgePageReferences(ctx, tx, libraryID, parentPageID, parentBody.Content, a); e != nil {
			return out, e
		}
		parentRevision := parent.Revision
		if e = s.updatePage(ctx, tx, &parent, parentRevision, a); e != nil {
			return out, e
		}
		parentDraft.DraftRevision++
		parentDraft.Body, parentDraft.UpdatedByUserID, parentDraft.UpdatedAt = parentBody, a.UserID, parent.UpdatedAt
		q, args, e = query.NewUpdateBuilder(s.store.Renderer(), knowledgePageDraftTable).Set("draft_revision", parentDraft.DraftRevision).Set("updated_at", parentDraft.UpdatedAt.UnixMilli()).Set("last_request_key", requestKey).Set("last_request_hash", requestHash).Set("payload_json", conversationJSON(parentDraft)).Where(query.And(pageScope(a, parentPageID), query.Equal("draft_revision", in.ExpectedParentDraftRevision))).Build()
		if e = conversationCAS(ctx, tx, q, args, e); e != nil {
			return out, conversationError("conflict", "page_draft_revision_conflict")
		}
		history := knowledgesdk.KnowledgePageEditHistoryEntry{DraftRevision: parentDraft.DraftRevision, UserID: a.UserID, ChangedBlockCount: 1, Changes: []knowledgesdk.KnowledgePageBlockChange{{NodeID: in.ReferenceBlockID, Kind: "update"}}, CreatedAt: parent.UpdatedAt}
		if e = s.insertKnowledgePageEditHistory(ctx, tx, parentPageID, history, a); e != nil {
			return out, e
		}
		if e = s.resetKnowledgeCollaborationState(ctx, tx, parentPageID, a); e != nil {
			return out, e
		}
		out.Parent, e = s.pageView(ctx, tx, library, parent, true, a)
		if e == nil {
			out.Target, e = s.pageView(ctx, tx, library, target, true, a)
		}
		return out, e
	}, &out)
	return
}
