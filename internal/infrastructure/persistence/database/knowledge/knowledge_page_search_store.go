package store

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"hash/fnv"
	"sort"
	"strconv"
	"strings"
	"time"
	"unicode"
	"unicode/utf8"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-orm/query"
)

const (
	knowledgePageSearchMaximumLimit    = 100
	knowledgePageSearchRevisionBitmask = uint64(1<<53 - 1)
)

type normalizedPageSearch struct {
	query, pathQuery, ancestorPageID string
	contentTypes, authors, tags      map[string]bool
	publicationStatuses              map[string]bool
	updatedAfter, updatedBefore      *time.Time
	limit                            int
}

func normalizedSearchSet(values []string, maximum, maximumLength int, validate func(string) bool) (map[string]bool, error) {
	if len(values) > maximum {
		return nil, conversationError("bad_request", "page_search_query_invalid")
	}
	out := make(map[string]bool, len(values))
	for _, value := range values {
		value = strings.TrimSpace(value)
		if value == "" || len(value) > maximumLength || !utf8.ValidString(value) || validate != nil && !validate(value) {
			return nil, conversationError("bad_request", "page_search_query_invalid")
		}
		out[strings.ToLower(value)] = true
	}
	return out, nil
}

func normalizeKnowledgePageSearch(input knowledgesdk.KnowledgePageSearchInput) (normalizedPageSearch, error) {
	out := normalizedPageSearch{
		query:          strings.TrimSpace(input.Query),
		pathQuery:      strings.TrimSpace(input.PathQuery),
		ancestorPageID: strings.TrimSpace(input.AncestorPageID),
		updatedAfter:   input.UpdatedAfter,
		updatedBefore:  input.UpdatedBefore,
		limit:          input.Limit,
	}
	if out.limit == 0 {
		out.limit = 50
	}
	if out.limit < 1 || out.limit > knowledgePageSearchMaximumLimit || !executionText(out.query, 512, false) || !executionText(out.pathQuery, 256, false) || out.ancestorPageID != "" && !validKnowledgePageID(out.ancestorPageID) {
		return out, conversationError("bad_request", "page_search_query_invalid")
	}
	if out.updatedAfter != nil && out.updatedAfter.IsZero() || out.updatedBefore != nil && out.updatedBefore.IsZero() || out.updatedAfter != nil && out.updatedBefore != nil && out.updatedAfter.After(*out.updatedBefore) {
		return out, conversationError("bad_request", "page_search_query_invalid")
	}
	var err error
	out.contentTypes, err = normalizedSearchSet(input.ContentTypes, len(knowledgesdk.KnowledgePageTypeContracts()), 48, func(value string) bool {
		_, ok := knowledgesdk.KnowledgePageTypeContractFor(value)
		return ok
	})
	if err != nil {
		return out, err
	}
	out.authors, err = normalizedSearchSet(input.AuthorUserIDs, 50, 255, validLibraryUser)
	if err != nil {
		return out, err
	}
	out.tags, err = normalizedSearchSet(input.Tags, 20, 128, nil)
	if err != nil {
		return out, err
	}
	out.publicationStatuses, err = normalizedSearchSet(input.PublicationStatuses, 2, 16, func(value string) bool {
		return value == knowledgesdk.KnowledgePagePublicationPublished || value == knowledgesdk.KnowledgePagePublicationUnpublished
	})
	return out, err
}

func pageSearchKind(contentType string) string {
	switch contentType {
	case knowledgesdk.KnowledgePageTypeFile:
		return knowledgesdk.KnowledgePageSearchKindFile
	case knowledgesdk.KnowledgePageTypeDocument:
		return knowledgesdk.KnowledgePageSearchKindPage
	default:
		return knowledgesdk.KnowledgePageSearchKindNativeApp
	}
}

func pageSearchPathText(path []knowledgesdk.KnowledgePageBreadcrumb) string {
	labels := make([]string, 0, len(path))
	for _, item := range path {
		labels = append(labels, item.Title)
	}
	return strings.Join(labels, " / ")
}

func pageSearchPathContains(path []knowledgesdk.KnowledgePageBreadcrumb, pageID string) bool {
	if pageID == "" {
		return true
	}
	for _, item := range path {
		if item.PageID == pageID {
			return true
		}
	}
	return false
}

func pageSearchHasTags(actual []string, required map[string]bool) bool {
	if len(required) == 0 {
		return true
	}
	found := make(map[string]bool, len(actual))
	for _, tag := range actual {
		found[strings.ToLower(strings.TrimSpace(tag))] = true
	}
	for tag := range required {
		if !found[tag] {
			return false
		}
	}
	return true
}

func pageSearchExcerpt(text, needle string) string {
	text = strings.TrimSpace(text)
	if text == "" {
		return ""
	}
	runes := []rune(text)
	start := 0
	if needle != "" {
		byteIndex := strings.Index(strings.ToLower(text), needle)
		if byteIndex >= 0 {
			start = utf8.RuneCountInString(text[:byteIndex]) - 45
			if start < 0 {
				start = 0
			}
		}
	}
	end := start + 150
	if end > len(runes) {
		end = len(runes)
	}
	prefix, suffix := "", ""
	if start > 0 {
		prefix = "…"
	}
	if end < len(runes) {
		suffix = "…"
	}
	return prefix + strings.TrimSpace(string(runes[start:end])) + suffix
}

func jsonValueContains(value any, needle string) bool {
	if needle == "" {
		return false
	}
	switch current := value.(type) {
	case string:
		return strings.Contains(strings.ToLower(current), needle)
	case json.Number:
		return strings.Contains(strings.ToLower(current.String()), needle)
	case float64, bool:
		return strings.Contains(strings.ToLower(fmt.Sprint(current)), needle)
	case []any:
		for _, item := range current {
			if jsonValueContains(item, needle) {
				return true
			}
		}
	case map[string]any:
		for key, item := range current {
			if key == "permissions" || key == "automations" || key == "protected_ranges" || key == "resources" {
				continue
			}
			if jsonValueContains(item, needle) {
				return true
			}
		}
	}
	return false
}

func pageSearchLocation(contentType, content, needle string) knowledgesdk.KnowledgePageSearchLocation {
	location := knowledgesdk.KnowledgePageSearchLocation{Kind: knowledgesdk.KnowledgePageSearchMatchPage}
	if needle == "" || strings.TrimSpace(content) == "" {
		return location
	}
	decoder := json.NewDecoder(strings.NewReader(content))
	decoder.UseNumber()
	var root map[string]any
	if decoder.Decode(&root) != nil {
		return location
	}
	if contentType == knowledgesdk.KnowledgePageTypeDocument {
		blocks, _ := root["blocks"].([]any)
		var findBlock func([]any) (string, bool)
		findBlock = func(items []any) (string, bool) {
			for _, item := range items {
				block, _ := item.(map[string]any)
				if jsonValueContains(block["content"], needle) || jsonValueContains(block["props"], needle) {
					if id, _ := block["id"].(string); id != "" {
						return id, true
					}
				}
				if children, _ := block["children"].([]any); len(children) > 0 {
					if id, ok := findBlock(children); ok {
						return id, true
					}
				}
			}
			return "", false
		}
		if id, ok := findBlock(blocks); ok {
			return knowledgesdk.KnowledgePageSearchLocation{Kind: knowledgesdk.KnowledgePageSearchMatchBlock, BlockID: id}
		}
		return location
	}
	if contentType == knowledgesdk.KnowledgePageTypeMultidimensionalTable {
		records, _ := root["records"].([]any)
		for _, item := range records {
			record, _ := item.(map[string]any)
			values, _ := record["values"].(map[string]any)
			for fieldID, value := range values {
				if jsonValueContains(value, needle) {
					recordID, _ := record["id"].(string)
					return knowledgesdk.KnowledgePageSearchLocation{Kind: knowledgesdk.KnowledgePageSearchMatchCell, RecordID: recordID, FieldID: fieldID}
				}
			}
		}
		return location
	}
	if contentType == knowledgesdk.KnowledgePageTypeSpreadsheet {
		workbook, _ := root["workbook"].(map[string]any)
		sheets, _ := workbook["sheets"].(map[string]any)
		sheetIDs := make([]string, 0, len(sheets))
		for id := range sheets {
			sheetIDs = append(sheetIDs, id)
		}
		sort.Strings(sheetIDs)
		for _, sheetID := range sheetIDs {
			sheet, _ := sheets[sheetID].(map[string]any)
			rows, _ := sheet["cellData"].(map[string]any)
			for rowKey, rawColumns := range rows {
				columns, _ := rawColumns.(map[string]any)
				for columnKey, cell := range columns {
					if jsonValueContains(cell, needle) {
						row, rowErr := strconv.Atoi(rowKey)
						column, columnErr := strconv.Atoi(columnKey)
						if rowErr == nil && columnErr == nil {
							return knowledgesdk.KnowledgePageSearchLocation{Kind: knowledgesdk.KnowledgePageSearchMatchCell, SheetID: sheetID, Cell: spreadsheetColumn(column) + strconv.Itoa(row+1)}
						}
					}
				}
			}
		}
		return location
	}
	if id, path, ok := pageSearchNativeNode(root, needle, "$"); ok {
		return knowledgesdk.KnowledgePageSearchLocation{Kind: knowledgesdk.KnowledgePageSearchMatchNode, NodeID: id, JSONPath: path}
	}
	return location
}

func spreadsheetColumn(index int) string {
	if index < 0 {
		return ""
	}
	out := ""
	for index >= 0 {
		out = string(rune('A'+index%26)) + out
		index = index/26 - 1
	}
	return out
}

func pageSearchNativeNode(value any, needle, path string) (string, string, bool) {
	switch current := value.(type) {
	case []any:
		for index, item := range current {
			if id, itemPath, ok := pageSearchNativeNode(item, needle, path+"["+strconv.Itoa(index)+"]"); ok {
				return id, itemPath, true
			}
		}
	case map[string]any:
		id, _ := current["id"].(string)
		for _, key := range []string{"text", "title", "name", "label", "description", "content"} {
			if id != "" && jsonValueContains(current[key], needle) {
				return id, path, true
			}
		}
		keys := make([]string, 0, len(current))
		for key := range current {
			keys = append(keys, key)
		}
		sort.Strings(keys)
		for _, key := range keys {
			if key == "permissions" || key == "automations" || key == "protected_ranges" || key == "resources" {
				continue
			}
			if nestedID, nestedPath, ok := pageSearchNativeNode(current[key], needle, path+"."+key); ok {
				return nestedID, nestedPath, true
			}
		}
	}
	return "", "", false
}

var pageSearchSynonymGroups = [][]string{
	{"搜索", "检索", "查找"},
	{"发布", "上线", "发版"},
	{"文档", "文件", "资料"},
	{"协作", "协同", "合作"},
	{"权限", "授权", "访问控制"},
	{"登录", "登陆"},
	{"幻灯片", "演示", "ppt"},
	{"表格", "电子表格", "多维表格"},
}

func normalizedSearchText(value string) string {
	return strings.Join(strings.Fields(strings.Map(func(current rune) rune {
		if unicode.IsLetter(current) || unicode.IsNumber(current) {
			return unicode.ToLower(current)
		}
		return ' '
	}, value)), " ")
}

func pageSearchTokens(query string) []string {
	query = normalizedSearchText(query)
	if query == "" {
		return nil
	}
	out := []string{}
	seen := map[string]bool{}
	appendToken := func(value string) {
		if value != "" && !seen[value] {
			seen[value] = true
			out = append(out, value)
		}
	}
	for _, field := range strings.Fields(query) {
		runes := []rune(field)
		allHan := len(runes) > 2
		for _, current := range runes {
			allHan = allHan && unicode.Is(unicode.Han, current)
		}
		if allHan {
			for index := 0; index+1 < len(runes); index++ {
				appendToken(string(runes[index : index+2]))
			}
			continue
		}
		appendToken(field)
	}
	return out
}

func pageSearchVariants(token string) []string {
	out := []string{token}
	for _, group := range pageSearchSynonymGroups {
		matched := false
		for _, item := range group {
			if normalizedSearchText(item) == token {
				matched = true
				break
			}
		}
		if matched {
			for _, item := range group {
				value := normalizedSearchText(item)
				if value != token {
					out = append(out, value)
				}
			}
			break
		}
	}
	return out
}

func pageSearchWords(value string) []string {
	return strings.Fields(normalizedSearchText(value))
}

func pageSearchEditDistanceAtMostOne(left, right string) bool {
	a, b := []rune(left), []rune(right)
	if len(a) < 4 || len(b) < 4 || len(a)-len(b) > 1 || len(b)-len(a) > 1 {
		return false
	}
	if len(a) > len(b) {
		a, b = b, a
	}
	differences := 0
	for ai, bi := 0, 0; ai < len(a) && bi < len(b); {
		if a[ai] == b[bi] {
			ai++
			bi++
			continue
		}
		differences++
		if differences > 1 {
			return false
		}
		if len(a) == len(b) {
			ai++
		}
		bi++
	}
	return true
}

func pageSearchFieldMatch(value, token string) (string, bool, bool) {
	normalized := normalizedSearchText(value)
	for _, variant := range pageSearchVariants(token) {
		if strings.Contains(normalized, variant) {
			return variant, true, variant != token
		}
	}
	for _, candidate := range pageSearchWords(value) {
		if pageSearchEditDistanceAtMostOne(token, candidate) {
			return candidate, true, true
		}
	}
	return "", false, false
}

func searchPageScore(title, path, body string, tags []string, query string) (int, string, bool) {
	normalized := normalizedSearchText(query)
	if normalized == "" {
		return 0, "", true
	}
	tagText := strings.Join(tags, " ")
	fields := []struct {
		value  string
		weight int
	}{{title, 700}, {tagText, 500}, {path, 300}, {body, 100}}
	if normalizedSearchText(title) == normalized {
		return 1000, normalized, true
	}
	for _, field := range fields {
		if strings.Contains(normalizedSearchText(field.value), normalized) {
			return field.weight, normalized, true
		}
	}
	tokens := pageSearchTokens(normalized)
	if len(tokens) == 0 {
		return 0, "", false
	}
	matched, score, firstNeedle := 0, 0, ""
	for _, token := range tokens {
		bestScore, bestNeedle := 0, ""
		for _, field := range fields {
			needle, ok, approximate := pageSearchFieldMatch(field.value, token)
			if !ok {
				continue
			}
			candidate := field.weight
			if approximate {
				candidate = candidate * 7 / 10
			}
			if candidate > bestScore {
				bestScore, bestNeedle = candidate, needle
			}
		}
		if bestScore > 0 {
			matched++
			score += bestScore
			if firstNeedle == "" {
				firstNeedle = bestNeedle
			}
		}
	}
	required := (len(tokens)*3 + 4) / 5
	if matched < required {
		return 0, "", false
	}
	return score/len(tokens) + matched*10, firstNeedle, true
}

func (s *Store) SearchKnowledgePages(ctx context.Context, libraryID string, input knowledgesdk.KnowledgePageSearchInput, a knowledgesdk.Authority) (out knowledgesdk.KnowledgePageSearchPage, err error) {
	out.Items = []knowledgesdk.KnowledgePageSearchHit{}
	if err = conversationAuthority(a); err != nil {
		return
	}
	search, err := normalizeKnowledgePageSearch(input)
	if err != nil {
		return out, err
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		library, readErr := s.libraryRecord(ctx, tx, libraryID, a)
		if readErr != nil {
			return readErr
		}
		statement, args, buildErr := query.NewSelectBuilder(s.store.Renderer(), knowledgePageTable).
			Columns("payload_json").
			Where(query.And(libraryPredicate(a, libraryID), query.Equal("state", "active"))).
			OrderBy(query.Ascending("page_id")).
			Limit(knowledgeLibraryMaximumPages + 1).
			Build()
		if buildErr != nil {
			return buildErr
		}
		rows, queryErr := tx.QueryContext(ctx, statement, args...)
		if queryErr != nil {
			return queryErr
		}
		pages := []knowledgesdk.KnowledgePage{}
		for rows.Next() {
			var raw []byte
			var page knowledgesdk.KnowledgePage
			if queryErr = rows.Scan(&raw); queryErr == nil {
				queryErr = unmarshalDurableJSON(raw, &page)
			}
			if queryErr != nil {
				_ = rows.Close()
				return queryErr
			}
			pages = append(pages, page)
		}
		if queryErr = rows.Err(); queryErr != nil {
			_ = rows.Close()
			return queryErr
		}
		if queryErr = rows.Close(); queryErr != nil {
			return queryErr
		}
		if len(pages) > knowledgeLibraryMaximumPages {
			return conversationError("unavailable", "page_search_limit")
		}
		normalizedQuery := normalizedSearchText(search.query)
		for _, page := range pages {
			effective, accessErr := s.evaluateKnowledgePageAccess(ctx, tx, libraryID, page.ID, a)
			if accessErr != nil {
				return accessErr
			}
			if !effective.Allowed || roleLevel(effective.Role) < roleLevel("reader") {
				continue
			}
			publicationStatus := knowledgesdk.KnowledgePagePublicationUnpublished
			if page.PublishedVersion > 0 {
				publicationStatus = knowledgesdk.KnowledgePagePublicationPublished
			}
			if len(search.publicationStatuses) > 0 && !search.publicationStatuses[publicationStatus] || len(search.contentTypes) > 0 && !search.contentTypes[strings.ToLower(page.ContentType)] || search.updatedAfter != nil && page.UpdatedAt.Before(*search.updatedAfter) || search.updatedBefore != nil && page.UpdatedAt.After(*search.updatedBefore) {
				continue
			}
			metadata, _, metadataErr := s.knowledgePageMetadataRecord(ctx, tx, libraryID, page.ID, a)
			if metadataErr != nil {
				return metadataErr
			}
			if !pageSearchHasTags(metadata.Tags, search.tags) {
				continue
			}
			effectiveLibrary := library
			effectiveLibrary.Role = effective.Role
			var title, contentType, author, body, canonicalContent string
			var path []knowledgesdk.KnowledgePageBreadcrumb
			var version int64
			var publishedAt *time.Time
			if page.PublishedVersion > 0 {
				view, viewErr := s.pageView(ctx, tx, effectiveLibrary, page, false, a)
				if viewErr != nil {
					return viewErr
				}
				if view.Published == nil {
					continue
				}
				title, contentType, author, body, canonicalContent, path, version = view.Published.Title, view.Published.ContentType, view.Published.PublishedByUserID, view.Published.Body.PlainText, view.Published.Body.Content, view.Breadcrumbs, view.Published.Version
				published := view.Published.PublishedAt
				publishedAt = &published
				page.ContentType = contentType
			} else {
				if roleLevel(effective.Role) < roleLevel("editor") {
					continue
				}
				title, contentType, author, path = page.Title, page.ContentType, page.CreatedByUserID, nil
				path, accessErr = s.pageBreadcrumbs(ctx, tx, page, false, a)
				if accessErr != nil {
					return accessErr
				}
			}
			if len(search.authors) > 0 && !search.authors[strings.ToLower(author)] {
				continue
			}
			pathText := pageSearchPathText(path)
			if search.pathQuery != "" && !strings.Contains(strings.ToLower(pathText), strings.ToLower(search.pathQuery)) || !pageSearchPathContains(path, search.ancestorPageID) {
				continue
			}
			score, matchedNeedle, matched := searchPageScore(title, pathText, body, metadata.Tags, normalizedQuery)
			if !matched {
				continue
			}
			indexStatus := page.ProjectionStatus
			if publicationStatus == knowledgesdk.KnowledgePagePublicationUnpublished || indexStatus == "" {
				indexStatus = "none"
			}
			location := pageSearchLocation(contentType, canonicalContent, matchedNeedle)
			out.Items = append(out.Items, knowledgesdk.KnowledgePageSearchHit{
				LibraryID: libraryID, PageID: page.ID, Kind: pageSearchKind(contentType), ContentType: contentType,
				Title: title, Excerpt: pageSearchExcerpt(body, matchedNeedle), Path: path, Tags: append([]string(nil), metadata.Tags...),
				AuthorUserID: author, PublishedVersion: version, PublicationStatus: publicationStatus, IndexStatus: indexStatus,
				Location: location, Score: score, UpdatedAt: page.UpdatedAt, PublishedAt: publishedAt,
			})
		}
		sort.Slice(out.Items, func(left, right int) bool {
			if out.Items[left].Score != out.Items[right].Score {
				return out.Items[left].Score > out.Items[right].Score
			}
			if !out.Items[left].UpdatedAt.Equal(out.Items[right].UpdatedAt) {
				return out.Items[left].UpdatedAt.After(out.Items[right].UpdatedAt)
			}
			return out.Items[left].PageID < out.Items[right].PageID
		})
		if len(out.Items) > search.limit {
			out.Items = out.Items[:search.limit]
			out.Truncated = true
		}
		return nil
	})
	return
}

func (s *Store) knowledgePageSearchRevision(ctx context.Context, libraryID string, a knowledgesdk.Authority) (revision int64, err error) {
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		library, err := s.libraryRecord(ctx, tx, libraryID, a)
		if err != nil {
			return err
		}
		if roleLevel(library.Role) < roleLevel("reader") {
			return conversationError("not_found", "library_not_found")
		}
		// The event cursor is a deterministic state token, not a wall-clock. It
		// closes the gap between two long polls: a mutation that happens before
		// the next notifier subscription is still observed because its durable
		// revision changes this token. The token is also shared by every process
		// using the same database, unlike an in-memory sequence.
		hasher := fnv.New64a()
		_, _ = fmt.Fprintf(hasher, "library:%s:%d;", library.ID, library.Revision)
		for _, source := range []struct {
			name  string
			table string
		}{
			{name: "page", table: knowledgePageTable},
			{name: "access", table: knowledgePageAccessTable},
			{name: "metadata", table: knowledgePageMetadataTable},
		} {
			statement, args, buildErr := query.NewSelectBuilder(s.store.Renderer(), source.table).
				Columns("page_id", "revision", "updated_at").
				Where(libraryPredicate(a, libraryID)).
				OrderBy(query.Ascending("page_id")).
				Limit(knowledgeLibraryMaximumPages + 1).
				Build()
			if buildErr != nil {
				return buildErr
			}
			rows, queryErr := tx.QueryContext(ctx, statement, args...)
			if queryErr != nil {
				return queryErr
			}
			count := 0
			for rows.Next() {
				var pageID string
				var itemRevision, updatedAt int64
				if queryErr = rows.Scan(&pageID, &itemRevision, &updatedAt); queryErr != nil {
					_ = rows.Close()
					return queryErr
				}
				count++
				_, _ = fmt.Fprintf(hasher, "%s:%s:%d:%d;", source.name, pageID, itemRevision, updatedAt)
			}
			if queryErr = rows.Err(); queryErr != nil {
				_ = rows.Close()
				return queryErr
			}
			if queryErr = rows.Close(); queryErr != nil {
				return queryErr
			}
			if count > knowledgeLibraryMaximumPages {
				return conversationError("unavailable", "page_search_limit")
			}
		}
		// The cursor crosses the JSON/SSE boundary and must therefore remain an
		// exact ECMAScript Number. A 63-bit Go int64 silently rounds in browsers,
		// making Last-Event-ID differ from the JSON payload and forcing reconnects.
		revision = int64(hasher.Sum64() & knowledgePageSearchRevisionBitmask)
		if revision == 0 {
			revision = 1
		}
		return nil
	})
	return revision, err
}

func (s *Store) KnowledgePageSearchEvents(ctx context.Context, libraryID string, input knowledgesdk.KnowledgePageSearchEvents, a knowledgesdk.Authority) (out knowledgesdk.KnowledgePageSearchEventBatch, err error) {
	out.Events = []knowledgesdk.KnowledgePageSearchEvent{}
	if input.AfterRevision < 0 || input.WaitMillis < 0 || input.WaitMillis > knowledgeCollaborationMaximumWait.Milliseconds() || conversationAuthority(a) != nil {
		return out, conversationError("bad_request", "page_search_events_invalid")
	}
	updates, unsubscribe := s.collaboration.subscribe(ctx, knowledgeCollaborationLibraryNotifierKey(a, libraryID))
	defer unsubscribe()
	currentRevision, revisionErr := s.knowledgePageSearchRevision(ctx, libraryID, a)
	if revisionErr != nil {
		return out, revisionErr
	}
	out.Revision = currentRevision
	if input.AfterRevision != 0 && input.AfterRevision != currentRevision {
		out.Events = append(out.Events, knowledgesdk.KnowledgePageSearchEvent{Type: knowledgesdk.KnowledgePageSearchEventChanged, Revision: out.Revision})
		return out, nil
	}
	if input.WaitMillis == 0 {
		out.Events = append(out.Events, knowledgesdk.KnowledgePageSearchEvent{Type: knowledgesdk.KnowledgePageSearchEventHeartbeat, Revision: out.Revision})
		return out, nil
	}
	timer := time.NewTimer(time.Duration(input.WaitMillis) * time.Millisecond)
	defer timer.Stop()
	select {
	case <-ctx.Done():
		return out, ctx.Err()
	case <-updates:
	case <-timer.C:
	}
	currentRevision, err = s.knowledgePageSearchRevision(ctx, libraryID, a)
	if err != nil {
		return out, err
	}
	out.Revision = currentRevision
	if input.AfterRevision != currentRevision {
		out.Events = append(out.Events, knowledgesdk.KnowledgePageSearchEvent{Type: knowledgesdk.KnowledgePageSearchEventChanged, Revision: out.Revision})
		return out, nil
	}
	out.Events = append(out.Events, knowledgesdk.KnowledgePageSearchEvent{Type: knowledgesdk.KnowledgePageSearchEventHeartbeat, Revision: out.Revision})
	return out, nil
}
