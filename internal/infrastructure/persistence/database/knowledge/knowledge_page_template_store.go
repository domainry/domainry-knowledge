package store

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"sort"
	"strings"
	"time"

	"github.com/domainry/domainry-foundation/entityid"
	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-orm/query"
)

const knowledgePageTemplateMaximumNodes = 200

func validKnowledgePageTemplateID(id string) bool {
	return entityid.Validate("ktmpl", id) == nil
}

func templateScope(a agentsdk.Authority, templateID string) query.Predicate {
	return query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("template_id", templateID))
}

func templateVersionScope(a agentsdk.Authority, templateID string, version int64) query.Predicate {
	return query.And(templateScope(a, templateID), query.Equal("version", version))
}

func validateKnowledgePageTemplateMetadata(title, description string) (string, string, error) {
	title, description = strings.TrimSpace(title), strings.TrimSpace(description)
	if !executionText(title, 256, true) || !executionText(description, 2048, false) {
		return "", "", conversationError("bad_request", "page_template_invalid")
	}
	return title, description, nil
}

func (s *Store) templateRecord(ctx context.Context, db conversationDB, libraryID, templateID string, a agentsdk.Authority) (knowledgesdk.KnowledgePageTemplate, error) {
	var out knowledgesdk.KnowledgePageTemplate
	if !validLibraryID(libraryID) || !validKnowledgePageTemplateID(templateID) {
		return out, conversationError("bad_request", "page_template_invalid")
	}
	found, err := s.executionRead(ctx, db, knowledgePageTemplateTable, templateScope(a, templateID), &out)
	if err != nil {
		return out, err
	}
	if !found || out.LibraryID != libraryID {
		return knowledgesdk.KnowledgePageTemplate{}, conversationError("not_found", "page_template_not_found")
	}
	return out, nil
}

func (s *Store) templateVersionRecord(ctx context.Context, db conversationDB, libraryID, templateID string, version int64, a agentsdk.Authority) (knowledgesdk.KnowledgePageTemplateVersion, error) {
	var out knowledgesdk.KnowledgePageTemplateVersion
	if version < 1 {
		return out, conversationError("bad_request", "page_template_version_invalid")
	}
	found, err := s.executionRead(ctx, db, knowledgePageTemplateVersionTable, templateVersionScope(a, templateID, version), &out)
	if err != nil {
		return out, err
	}
	if !found || out.LibraryID != libraryID || out.TemplateID != templateID {
		return knowledgesdk.KnowledgePageTemplateVersion{}, conversationError("not_found", "page_template_version_not_found")
	}
	return out, nil
}

func pageTemplateListLimit(after string, limit int) (int64, int, error) {
	if limit == 0 {
		limit = 50
	}
	afterID, valid := parsePhysicalAfter(after)
	if limit < 1 || limit > 100 || !valid {
		return 0, 0, conversationError("bad_request", "page_template_query_invalid")
	}
	return afterID, limit, nil
}

func (s *Store) KnowledgePageTemplates(ctx context.Context, libraryID, after string, limit int, a agentsdk.Authority) (out knowledgesdk.KnowledgePageTemplatePage, err error) {
	out.Items = []knowledgesdk.KnowledgePageTemplate{}
	var afterID int64
	afterID, limit, err = pageTemplateListLimit(after, limit)
	if err != nil {
		return out, err
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		if _, readErr := s.libraryRecord(ctx, tx, libraryID, a); readErr != nil {
			return readErr
		}
		predicate := query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("library_id", libraryID))
		if afterID > 0 {
			predicate = query.And(predicate, query.GreaterThan("id", afterID))
		}
		q, args, buildErr := query.NewSelectBuilder(s.store.Renderer(), knowledgePageTemplateTable).Columns("id", "payload_json").Where(predicate).OrderBy(query.Ascending("id")).Limit(limit + 1).Build()
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
			var item knowledgesdk.KnowledgePageTemplate
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

func (s *Store) templateAttachments(ctx context.Context, db conversationDB, libraryID, pageID string, a agentsdk.Authority) ([]knowledgesdk.KnowledgePageTemplateAttachment, error) {
	q, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgePageAttachmentTable).Columns("payload_json").Where(query.And(pageScope(a, pageID), query.Equal("library_id", libraryID))).OrderBy(query.Ascending("rank"), query.Ascending("document_id")).Limit(1001).Build()
	if err != nil {
		return nil, err
	}
	rows, err := db.QueryContext(ctx, q, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := make([]knowledgesdk.KnowledgePageTemplateAttachment, 0)
	for rows.Next() {
		var raw []byte
		var item knowledgesdk.KnowledgePageAttachment
		if err = rows.Scan(&raw); err == nil {
			err = unmarshalDurableJSON(raw, &item)
		}
		if err != nil {
			return nil, err
		}
		out = append(out, knowledgesdk.KnowledgePageTemplateAttachment{DocumentID: item.DocumentID, Title: item.Title, Rank: item.Rank})
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	if len(out) > 1000 {
		return nil, conversationError("conflict", "page_attachment_limit")
	}
	return out, nil
}

func (s *Store) snapshotKnowledgePageTemplate(ctx context.Context, tx *sql.Tx, libraryID, sourcePageID, templateID, title, description string, version int64, a agentsdk.Authority) (knowledgesdk.KnowledgePageTemplateVersion, error) {
	if !validKnowledgePageID(sourcePageID) {
		return knowledgesdk.KnowledgePageTemplateVersion{}, conversationError("bad_request", "page_template_source_invalid")
	}
	q, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgePageTable).Columns("payload_json").Where(query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("library_id", libraryID), query.Equal("state", "active"))).OrderBy(query.Ascending("parent_page_id"), query.Ascending("rank"), query.Ascending("page_id")).Limit(knowledgeLibraryMaximumPages + 1).Build()
	if err != nil {
		return knowledgesdk.KnowledgePageTemplateVersion{}, err
	}
	rows, err := tx.QueryContext(ctx, q, args...)
	if err != nil {
		return knowledgesdk.KnowledgePageTemplateVersion{}, err
	}
	pages := make(map[string]knowledgesdk.KnowledgePage)
	children := make(map[string][]knowledgesdk.KnowledgePage)
	for rows.Next() {
		var raw []byte
		var page knowledgesdk.KnowledgePage
		if err = rows.Scan(&raw); err == nil {
			err = unmarshalDurableJSON(raw, &page)
		}
		if err != nil {
			_ = rows.Close()
			return knowledgesdk.KnowledgePageTemplateVersion{}, err
		}
		pages[page.ID] = page
		children[page.ParentPageID] = append(children[page.ParentPageID], page)
	}
	if err = rows.Err(); err != nil {
		_ = rows.Close()
		return knowledgesdk.KnowledgePageTemplateVersion{}, err
	}
	if err = rows.Close(); err != nil {
		return knowledgesdk.KnowledgePageTemplateVersion{}, err
	}
	if len(pages) > knowledgeLibraryMaximumPages {
		return knowledgesdk.KnowledgePageTemplateVersion{}, conversationError("conflict", "page_limit")
	}
	if _, ok := pages[sourcePageID]; !ok {
		return knowledgesdk.KnowledgePageTemplateVersion{}, conversationError("not_found", "page_not_found")
	}
	for parentID := range children {
		sort.Slice(children[parentID], func(i, j int) bool {
			if children[parentID][i].Rank == children[parentID][j].Rank {
				return children[parentID][i].ID < children[parentID][j].ID
			}
			return children[parentID][i].Rank < children[parentID][j].Rank
		})
	}
	ordered := make([]knowledgesdk.KnowledgePage, 0, knowledgePageTemplateMaximumNodes)
	seen := map[string]bool{}
	var walk func(string, int) error
	walk = func(pageID string, depth int) error {
		if depth > knowledgePageMaximumDepth || seen[pageID] {
			return conversationError("conflict", "page_tree_cycle")
		}
		if len(ordered) >= knowledgePageTemplateMaximumNodes {
			return conversationError("conflict", "page_template_node_limit")
		}
		seen[pageID] = true
		ordered = append(ordered, pages[pageID])
		for _, child := range children[pageID] {
			if err := walk(child.ID, depth+1); err != nil {
				return err
			}
		}
		return nil
	}
	if err = walk(sourcePageID, 0); err != nil {
		return knowledgesdk.KnowledgePageTemplateVersion{}, err
	}
	nodeKeys := make(map[string]string, len(ordered))
	for index, page := range ordered {
		nodeKeys[page.ID] = fmt.Sprintf("node-%06d", index+1)
	}
	nodes := make([]knowledgesdk.KnowledgePageTemplateNode, 0, len(ordered))
	for _, page := range ordered {
		effective, accessErr := s.evaluateKnowledgePageAccess(ctx, tx, libraryID, page.ID, a)
		if accessErr != nil || !effective.Allowed || roleLevel(effective.Role) < roleLevel("editor") {
			return knowledgesdk.KnowledgePageTemplateVersion{}, conversationError("not_found", "page_not_found")
		}
		draft, found, readErr := s.pageDraft(ctx, tx, page.ID, a)
		if readErr != nil {
			return knowledgesdk.KnowledgePageTemplateVersion{}, readErr
		}
		if !found {
			return knowledgesdk.KnowledgePageTemplateVersion{}, conversationError("conflict", "page_template_subtree_incomplete")
		}
		attachments, attachmentErr := s.templateAttachments(ctx, tx, libraryID, page.ID, a)
		if attachmentErr != nil {
			return knowledgesdk.KnowledgePageTemplateVersion{}, attachmentErr
		}
		node := knowledgesdk.KnowledgePageTemplateNode{NodeKey: nodeKeys[page.ID], SourcePageID: page.ID, Rank: draft.Rank, Title: draft.Title, ContentType: draft.ContentType, Body: draft.Body, Attachments: attachments}
		if page.ID != sourcePageID {
			node.ParentNodeKey = nodeKeys[page.ParentPageID]
			if node.ParentNodeKey == "" {
				return knowledgesdk.KnowledgePageTemplateVersion{}, conversationError("conflict", "page_template_subtree_incomplete")
			}
		}
		nodes = append(nodes, node)
	}
	return knowledgesdk.KnowledgePageTemplateVersion{TemplateID: templateID, LibraryID: libraryID, Version: version, Title: title, Description: description, Nodes: nodes, CreatedByUserID: a.UserID, CreatedAt: time.Now().UTC().Truncate(time.Millisecond)}, nil
}

func (s *Store) insertKnowledgePageTemplateVersion(ctx context.Context, tx *sql.Tx, version knowledgesdk.KnowledgePageTemplateVersion, a agentsdk.Authority) error {
	q, args, err := query.NewInsertBuilder(s.store.Renderer(), knowledgePageTemplateVersionTable).Columns("scope_key", "template_id", "version", "library_id", "created_at", "payload_json").Values(libraryScope(a), version.TemplateID, version.Version, version.LibraryID, version.CreatedAt.UnixMilli(), conversationJSON(version)).Build()
	return conversationExec(ctx, tx, q, args, err)
}

func (s *Store) CreateKnowledgePageTemplate(ctx context.Context, libraryID string, in knowledgesdk.KnowledgePageTemplateCreate, a agentsdk.Authority) (out knowledgesdk.KnowledgePageTemplate, err error) {
	title, description, err := validateKnowledgePageTemplateMetadata(in.Title, in.Description)
	if err != nil {
		return out, err
	}
	requestKey, err := pageRequestKey("template_create", libraryID, in.SourcePageID, in.ClientID, a)
	if err != nil {
		return out, err
	}
	requestHash := conversationHash(in)
	err = s.mutateKnowledgeOperation(ctx, "knowledge.page_template.create", knowledgesdk.ActionPageTemplatesCreate, libraryID+":"+in.SourcePageID, in.ClientID, in, a, func(tx *sql.Tx) (any, error) {
		library, readErr := s.libraryRecord(ctx, tx, libraryID, a)
		if readErr != nil {
			return out, readErr
		}
		if writeErr := requirePageWriting(library); writeErr != nil {
			return out, writeErr
		}
		templateID, idErr := randomKnowledgeID("ktmpl_")
		if idErr != nil {
			return out, idErr
		}
		version, snapshotErr := s.snapshotKnowledgePageTemplate(ctx, tx, libraryID, in.SourcePageID, templateID, title, description, 1, a)
		if snapshotErr != nil {
			return out, snapshotErr
		}
		now := version.CreatedAt
		out = knowledgesdk.KnowledgePageTemplate{ID: templateID, LibraryID: libraryID, Title: title, Description: description, RootContentType: version.Nodes[0].ContentType, NodeCount: len(version.Nodes), LatestVersion: 1, Revision: 1, CreatedByUserID: a.UserID, UpdatedByUserID: a.UserID, CreatedAt: now, UpdatedAt: now}
		q, args, buildErr := query.NewInsertBuilder(s.store.Renderer(), knowledgePageTemplateTable).Columns("scope_key", "template_id", "library_id", "title", "revision", "latest_version", "updated_at", "request_key", "request_hash", "payload_json").Values(libraryScope(a), templateID, libraryID, title, 1, 1, now.UnixMilli(), requestKey, requestHash, conversationJSON(out)).Build()
		if execErr := conversationExec(ctx, tx, q, args, buildErr); execErr != nil {
			return out, execErr
		}
		if insertErr := s.insertKnowledgePageTemplateVersion(ctx, tx, version, a); insertErr != nil {
			return out, insertErr
		}
		return out, nil
	}, &out)
	return out, err
}

func (s *Store) UpdateKnowledgePageTemplate(ctx context.Context, libraryID, templateID string, in knowledgesdk.KnowledgePageTemplateUpdate, a agentsdk.Authority) (out knowledgesdk.KnowledgePageTemplate, err error) {
	title, description, err := validateKnowledgePageTemplateMetadata(in.Title, in.Description)
	if err != nil || in.ExpectedRevision < 1 {
		if err != nil {
			return out, err
		}
		return out, conversationError("bad_request", "page_template_revision_invalid")
	}
	if _, err = pageRequestKey("template_update", libraryID, templateID, in.ClientID, a); err != nil {
		return out, err
	}
	err = s.mutateKnowledgeOperation(ctx, "knowledge.page_template.update", knowledgesdk.ActionPageTemplatesUpdate, libraryID+":"+templateID, in.ClientID, in, a, func(tx *sql.Tx) (any, error) {
		library, readErr := s.libraryRecord(ctx, tx, libraryID, a)
		if readErr != nil {
			return out, readErr
		}
		if writeErr := requirePageWriting(library); writeErr != nil {
			return out, writeErr
		}
		out, readErr = s.templateRecord(ctx, tx, libraryID, templateID, a)
		if readErr != nil {
			return out, readErr
		}
		if out.Revision != in.ExpectedRevision {
			return out, conversationError("conflict", "page_template_revision_conflict")
		}
		version, snapshotErr := s.snapshotKnowledgePageTemplate(ctx, tx, libraryID, in.SourcePageID, templateID, title, description, out.LatestVersion+1, a)
		if snapshotErr != nil {
			return out, snapshotErr
		}
		if insertErr := s.insertKnowledgePageTemplateVersion(ctx, tx, version, a); insertErr != nil {
			return out, insertErr
		}
		out.Title, out.Description, out.RootContentType, out.NodeCount = title, description, version.Nodes[0].ContentType, len(version.Nodes)
		out.LatestVersion, out.Revision = version.Version, out.Revision+1
		out.UpdatedByUserID, out.UpdatedAt = a.UserID, version.CreatedAt
		q, args, buildErr := query.NewUpdateBuilder(s.store.Renderer(), knowledgePageTemplateTable).Set("title", title).Set("revision", out.Revision).Set("latest_version", out.LatestVersion).Set("updated_at", out.UpdatedAt.UnixMilli()).Set("payload_json", conversationJSON(out)).Where(query.And(templateScope(a, templateID), query.Equal("revision", in.ExpectedRevision))).Build()
		if casErr := conversationCAS(ctx, tx, q, args, buildErr); casErr != nil {
			return out, conversationError("conflict", "page_template_revision_conflict")
		}
		return out, nil
	}, &out)
	return out, err
}

func templateVersionListLimit(before int64, limit int) (int, error) {
	if limit == 0 {
		limit = 20
	}
	if before < 0 || limit < 1 || limit > 100 {
		return 0, conversationError("bad_request", "page_template_version_query_invalid")
	}
	return limit, nil
}

func (s *Store) KnowledgePageTemplateVersions(ctx context.Context, libraryID, templateID string, before int64, limit int, a agentsdk.Authority) (out knowledgesdk.KnowledgePageTemplateVersionPage, err error) {
	out.Items = []knowledgesdk.KnowledgePageTemplateVersionSummary{}
	limit, err = templateVersionListLimit(before, limit)
	if err != nil {
		return out, err
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		if _, readErr := s.libraryRecord(ctx, tx, libraryID, a); readErr != nil {
			return readErr
		}
		if _, readErr := s.templateRecord(ctx, tx, libraryID, templateID, a); readErr != nil {
			return readErr
		}
		predicate := templateScope(a, templateID)
		if before > 0 {
			predicate = query.And(predicate, query.LessThan("version", before))
		}
		q, args, buildErr := query.NewSelectBuilder(s.store.Renderer(), knowledgePageTemplateVersionTable).Columns("payload_json").Where(predicate).OrderBy(query.Descending("version")).Limit(limit + 1).Build()
		if buildErr != nil {
			return buildErr
		}
		rows, queryErr := tx.QueryContext(ctx, q, args...)
		if queryErr != nil {
			return queryErr
		}
		defer rows.Close()
		for rows.Next() {
			var raw []byte
			var version knowledgesdk.KnowledgePageTemplateVersion
			if queryErr = rows.Scan(&raw); queryErr == nil {
				queryErr = unmarshalDurableJSON(raw, &version)
			}
			if queryErr != nil {
				return queryErr
			}
			out.Items = append(out.Items, knowledgesdk.KnowledgePageTemplateVersionSummary{TemplateID: templateID, Version: version.Version, Title: version.Title, Description: version.Description, NodeCount: len(version.Nodes), CreatedByUserID: version.CreatedByUserID, CreatedAt: version.CreatedAt})
		}
		if queryErr = rows.Err(); queryErr != nil {
			return queryErr
		}
		out.Complete = true
		if len(out.Items) > limit {
			out.Items = out.Items[:limit]
			out.Complete = false
			out.NextBefore = out.Items[len(out.Items)-1].Version
		}
		return nil
	})
	return out, err
}

func (s *Store) KnowledgePageTemplateVersion(ctx context.Context, libraryID, templateID string, version int64, a agentsdk.Authority) (out knowledgesdk.KnowledgePageTemplateVersion, err error) {
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		if _, readErr := s.libraryRecord(ctx, tx, libraryID, a); readErr != nil {
			return readErr
		}
		if _, readErr := s.templateRecord(ctx, tx, libraryID, templateID, a); readErr != nil {
			return readErr
		}
		var readErr error
		out, readErr = s.templateVersionRecord(ctx, tx, libraryID, templateID, version, a)
		return readErr
	})
	return out, err
}

func collectTemplateBlockIDs(value any, ids map[string]string) error {
	switch item := value.(type) {
	case map[string]any:
		if id, ok := item["id"].(string); ok && knowledgeBlockIDPattern.MatchString(id) {
			if _, exists := ids[id]; !exists {
				newID, err := randomKnowledgeID("block_")
				if err != nil {
					return err
				}
				ids[id] = newID
			}
		}
		for _, child := range item {
			if err := collectTemplateBlockIDs(child, ids); err != nil {
				return err
			}
		}
	case []any:
		for _, child := range item {
			if err := collectTemplateBlockIDs(child, ids); err != nil {
				return err
			}
		}
	}
	return nil
}

func rewriteTemplateContentValue(value any, sourcePageID string, pageIDs map[string]string, blockIDs map[string]map[string]string) {
	switch item := value.(type) {
	case map[string]any:
		if id, ok := item["id"].(string); ok {
			if replacement := blockIDs[sourcePageID][id]; replacement != "" {
				item["id"] = replacement
			}
		}
		refSourcePage := sourcePageID
		for _, key := range []string{"targetPageId", "pageId"} {
			if id, ok := item[key].(string); ok {
				refSourcePage = id
				if replacement := pageIDs[id]; replacement != "" {
					item[key] = replacement
				}
			}
		}
		for _, key := range []string{"targetBlockId", "blockId"} {
			if id, ok := item[key].(string); ok {
				if replacement := blockIDs[refSourcePage][id]; replacement != "" {
					item[key] = replacement
				}
			}
		}
		for key, child := range item {
			if text, ok := child.(string); ok && strings.HasPrefix(text, "knowledge-page:") {
				sourceID := strings.TrimSpace(strings.TrimPrefix(text, "knowledge-page:"))
				if replacement := pageIDs[sourceID]; replacement != "" {
					item[key] = "knowledge-page:" + replacement
					continue
				}
			}
			rewriteTemplateContentValue(child, sourcePageID, pageIDs, blockIDs)
		}
	case []any:
		for index, child := range item {
			if text, ok := child.(string); ok && strings.HasPrefix(text, "knowledge-page:") {
				sourceID := strings.TrimSpace(strings.TrimPrefix(text, "knowledge-page:"))
				if replacement := pageIDs[sourceID]; replacement != "" {
					item[index] = "knowledge-page:" + replacement
					continue
				}
			}
			rewriteTemplateContentValue(child, sourcePageID, pageIDs, blockIDs)
		}
	}
}

func (s *Store) remapKnowledgePageTemplateBodies(nodes []knowledgesdk.KnowledgePageTemplateNode, pageIDs map[string]string) (map[string]knowledgesdk.PageContent, error) {
	blockIDs := make(map[string]map[string]string, len(nodes))
	decoded := make(map[string]any, len(nodes))
	for _, node := range nodes {
		var value any
		decoder := json.NewDecoder(strings.NewReader(node.Body.Content))
		decoder.UseNumber()
		if err := decoder.Decode(&value); err != nil {
			return nil, conversationError("unavailable", "page_template_content_invalid")
		}
		decoded[node.NodeKey] = value
		blockIDs[node.SourcePageID] = map[string]string{}
		if node.ContentType == knowledgesdk.KnowledgePageTypeDocument {
			if err := collectTemplateBlockIDs(value, blockIDs[node.SourcePageID]); err != nil {
				return nil, err
			}
		}
	}
	out := make(map[string]knowledgesdk.PageContent, len(nodes))
	for _, node := range nodes {
		value := decoded[node.NodeKey]
		rewriteTemplateContentValue(value, node.SourcePageID, pageIDs, blockIDs)
		raw, err := json.Marshal(value)
		if err != nil {
			return nil, err
		}
		body, err := s.normalizedTypedPageContent(node.ContentType, knowledgesdk.PageContentSchemaVersion, string(raw), "")
		if err != nil {
			return nil, err
		}
		out[node.NodeKey] = body
	}
	return out, nil
}

func (s *Store) InstantiateKnowledgePageTemplate(ctx context.Context, libraryID, templateID string, in knowledgesdk.KnowledgePageTemplateInstantiate, a agentsdk.Authority) (out knowledgesdk.KnowledgePageTemplateInstance, err error) {
	if in.Version < 0 || in.Rank != "" && !validPageRank(in.Rank, true) || !executionText(in.RootTitle, 256, false) {
		return out, conversationError("bad_request", "page_template_instance_invalid")
	}
	requestKey, err := pageRequestKey("template_instantiate", libraryID, templateID, in.ClientID, a)
	if err != nil {
		return out, err
	}
	err = s.mutateKnowledgeOperation(ctx, "knowledge.page_template.instantiate", knowledgesdk.ActionPageTemplatesInstantiate, libraryID+":"+templateID, in.ClientID, in, a, func(tx *sql.Tx) (any, error) {
		library, readErr := s.libraryRecord(ctx, tx, libraryID, a)
		if readErr != nil {
			return out, readErr
		}
		if writeErr := requirePageWriting(library); writeErr != nil {
			return out, writeErr
		}
		template, readErr := s.templateRecord(ctx, tx, libraryID, templateID, a)
		if readErr != nil {
			return out, readErr
		}
		versionNumber := in.Version
		if versionNumber == 0 {
			versionNumber = template.LatestVersion
		}
		version, readErr := s.templateVersionRecord(ctx, tx, libraryID, templateID, versionNumber, a)
		if readErr != nil {
			return out, readErr
		}
		if len(version.Nodes) == 0 || len(version.Nodes) > knowledgePageTemplateMaximumNodes {
			return out, conversationError("unavailable", "page_template_version_invalid")
		}
		if validateErr := s.validatePageParent(ctx, tx, libraryID, "", in.ParentPageID, a); validateErr != nil {
			return out, validateErr
		}
		if in.ParentPageID != "" {
			effective, accessErr := s.evaluateKnowledgePageAccess(ctx, tx, libraryID, in.ParentPageID, a)
			if accessErr != nil || !effective.Allowed || roleLevel(effective.Role) < roleLevel("editor") {
				return out, conversationError("not_found", "page_not_found")
			}
		}
		q, args, buildErr := query.NewSelectBuilder(s.store.Renderer(), knowledgePageTable).Projections(query.Project(query.CountAll())).Where(query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("library_id", libraryID))).Build()
		if buildErr != nil {
			return out, buildErr
		}
		var pageCount int
		if readErr = tx.QueryRowContext(ctx, q, args...).Scan(&pageCount); readErr != nil {
			return out, readErr
		}
		if pageCount+len(version.Nodes) > knowledgeLibraryMaximumPages {
			return out, conversationError("conflict", "page_limit")
		}
		pageIDs := make(map[string]string, len(version.Nodes))
		for _, node := range version.Nodes {
			id, idErr := randomKnowledgeID("kpage_")
			if idErr != nil {
				return out, idErr
			}
			pageIDs[node.SourcePageID] = id
		}
		bodies, remapErr := s.remapKnowledgePageTemplateBodies(version.Nodes, pageIDs)
		if remapErr != nil {
			return out, remapErr
		}
		now := time.Now().UTC().Truncate(time.Millisecond)
		out = knowledgesdk.KnowledgePageTemplateInstance{TemplateID: templateID, Version: versionNumber, CreatedPageIDs: make([]string, 0, len(version.Nodes))}
		pagesByNode := make(map[string]knowledgesdk.KnowledgePage, len(version.Nodes))
		for index, node := range version.Nodes {
			pageID := pageIDs[node.SourcePageID]
			parentID := in.ParentPageID
			if node.ParentNodeKey != "" {
				parentID = pagesByNode[node.ParentNodeKey].ID
				if parentID == "" {
					return out, conversationError("unavailable", "page_template_version_invalid")
				}
			}
			rank, title := node.Rank, node.Title
			if index == 0 {
				if in.Rank != "" {
					rank = in.Rank
				} else {
					rank = defaultPageRank(now, pageID)
				}
				if strings.TrimSpace(in.RootTitle) != "" {
					title = strings.TrimSpace(in.RootTitle)
				}
			}
			if !executionText(title, 256, true) || !validPageRank(rank, true) || !validKnowledgePageType(node.ContentType) {
				return out, conversationError("unavailable", "page_template_version_invalid")
			}
			page := knowledgesdk.KnowledgePage{ID: pageID, LibraryID: libraryID, ParentPageID: parentID, Rank: rank, Title: title, ContentType: node.ContentType, State: "active", ProjectionStatus: "none", AccessMode: knowledgesdk.KnowledgePageAccessInherit, AccessRevision: 1, AccessStatus: "ready", Revision: 1, CreatedByUserID: a.UserID, UpdatedByUserID: a.UserID, CreatedAt: now, UpdatedAt: now}
			draft := knowledgesdk.KnowledgePageDraft{PageID: pageID, LibraryID: libraryID, DraftRevision: 1, Title: title, ContentType: node.ContentType, ParentPageID: parentID, Rank: rank, Body: bodies[node.NodeKey], UpdatedByUserID: a.UserID, UpdatedAt: now}
			nodeRequestKey := conversationHash([]string{requestKey, node.NodeKey})
			requestHash := conversationHash(in)
			q, args, buildErr = query.NewInsertBuilder(s.store.Renderer(), knowledgePageTable).Columns("scope_key", "page_id", "library_id", "parent_page_id", "rank", "state", "published_parent_page_id", "published_rank", "revision", "published_version", "updated_at", "request_key", "request_hash", "payload_json").Values(libraryScope(a), pageID, libraryID, parentID, rank, page.State, "", "", 1, 0, now.UnixMilli(), nodeRequestKey, requestHash, conversationJSON(page)).Build()
			if execErr := conversationExec(ctx, tx, q, args, buildErr); execErr != nil {
				return out, execErr
			}
			if metadataErr := s.insertDefaultKnowledgePageMetadata(ctx, tx, page, a); metadataErr != nil {
				return out, metadataErr
			}
			if nameErr := s.replaceKnowledgePageName(ctx, tx, libraryID, pageID, knowledgePageNameDraftTitle, page.Title, a); nameErr != nil {
				return out, nameErr
			}
			if accessErr := s.insertKnowledgePageAccess(ctx, tx, &page, nodeRequestKey, requestHash, a); accessErr != nil {
				return out, accessErr
			}
			q, args, buildErr = query.NewInsertBuilder(s.store.Renderer(), knowledgePageDraftTable).Columns("scope_key", "page_id", "library_id", "base_published_version", "draft_revision", "updated_at", "last_request_key", "last_request_hash", "payload_json").Values(libraryScope(a), pageID, libraryID, 0, 1, now.UnixMilli(), nodeRequestKey, requestHash, conversationJSON(draft)).Build()
			if execErr := conversationExec(ctx, tx, q, args, buildErr); execErr != nil {
				return out, execErr
			}
			if _, touchErr := s.touchKnowledgePagePersonalState(ctx, tx, libraryID, pageID, "edited", now, a); touchErr != nil {
				return out, touchErr
			}
			for _, attachment := range node.Attachments {
				document, documentErr := s.documentRecord(ctx, tx, attachment.DocumentID, a)
				if documentErr != nil || document.Document.LibraryID != libraryID || document.Document.State == "deleted" || document.Document.State == "deleting" {
					return out, conversationError("conflict", "page_template_attachment_unavailable")
				}
				relation := knowledgesdk.KnowledgePageAttachment{PageID: pageID, LibraryID: libraryID, DocumentID: attachment.DocumentID, Title: attachment.Title, Rank: attachment.Rank, CreatedByUserID: a.UserID, CreatedAt: now}
				q, args, buildErr = query.NewInsertBuilder(s.store.Renderer(), knowledgePageAttachmentTable).Columns("scope_key", "page_id", "document_id", "library_id", "rank", "payload_json").Values(libraryScope(a), pageID, attachment.DocumentID, libraryID, attachment.Rank, conversationJSON(relation)).Build()
				if execErr := conversationExec(ctx, tx, q, args, buildErr); execErr != nil {
					return out, execErr
				}
			}
			pagesByNode[node.NodeKey] = page
			out.CreatedPageIDs = append(out.CreatedPageIDs, pageID)
		}
		root := pagesByNode[version.Nodes[0].NodeKey]
		out.Root, readErr = s.pageView(ctx, tx, library, root, true, a)
		if readErr != nil {
			return out, readErr
		}
		return out, nil
	}, &out)
	return out, err
}
