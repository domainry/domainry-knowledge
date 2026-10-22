package store

import (
	"context"
	"database/sql"
	"sort"
	"strings"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-orm/query"
)

const (
	knowledgePageNameDraftTitle     = "draft_title"
	knowledgePageNamePublishedTitle = "published_title"
	knowledgePageNameAlias          = "alias"
	knowledgePageGraphMaximumDepth  = 3
	knowledgePageGraphMaximumNodes  = 200
)

type knowledgePageRelationRecord struct {
	LibraryID       string `json:"library_id"`
	SourcePageID    string `json:"source_page_id"`
	TargetPageID    string `json:"target_page_id"`
	UpdatedByUserID string `json:"updated_by_user_id"`
	UpdatedAt       int64  `json:"updated_at"`
}

func normalizedPageName(value string, maximum int) (string, string, bool) {
	label := strings.TrimSpace(value)
	if !executionText(label, maximum, true) {
		return "", "", false
	}
	return strings.ToLower(label), label, true
}

func (s *Store) replaceKnowledgePageName(ctx context.Context, tx *sql.Tx, libraryID, pageID, kind, label string, a knowledgesdk.Authority) error {
	predicate := query.And(pageMetadataPredicate(a, pageID), query.Equal("name_kind", kind))
	statement, args, err := query.NewDeleteBuilder(s.store.Renderer(), knowledgePageNameTable).Where(predicate).Build()
	if err = conversationExec(ctx, tx, statement, args, err); err != nil {
		return err
	}
	if strings.TrimSpace(label) == "" {
		return nil
	}
	key, normalized, ok := normalizedPageName(label, 256)
	if !ok {
		return conversationError("bad_request", "page_name_invalid")
	}
	statement, args, err = query.NewInsertBuilder(s.store.Renderer(), knowledgePageNameTable).
		Columns("scope_key", "library_id", "page_id", "name_kind", "name_key", "name_label").
		Values(libraryScope(a), libraryID, pageID, kind, key, normalized).Build()
	return conversationExec(ctx, tx, statement, args, err)
}

func knowledgePageDiscoveryLimit(limit int) (int, error) {
	if limit == 0 {
		limit = 20
	}
	if limit < 1 || limit > 100 {
		return 0, conversationError("bad_request", "page_identity_query_invalid")
	}
	return limit, nil
}

func knowledgePageGraphLimits(depth, limit int) (int, int, error) {
	if depth == 0 {
		depth = 2
	}
	if limit == 0 {
		limit = 80
	}
	if depth < 1 || depth > knowledgePageGraphMaximumDepth || limit < 1 || limit > knowledgePageGraphMaximumNodes {
		return 0, 0, conversationError("bad_request", "page_relationship_graph_query_invalid")
	}
	return depth, limit, nil
}

func identityMatches(value knowledgesdk.KnowledgePageIdentity, normalized string) bool {
	if normalized == "" || strings.Contains(strings.ToLower(value.Title), normalized) || strings.Contains(strings.ToLower(value.PageID), normalized) {
		return true
	}
	for _, alias := range value.Aliases {
		if strings.Contains(strings.ToLower(alias), normalized) {
			return true
		}
	}
	return false
}

func identityRank(value knowledgesdk.KnowledgePageIdentity, normalized string) int {
	if normalized == "" {
		return 4
	}
	title := strings.ToLower(value.Title)
	if title == normalized {
		return 0
	}
	for _, alias := range value.Aliases {
		if strings.ToLower(alias) == normalized {
			return 1
		}
	}
	if strings.HasPrefix(title, normalized) {
		return 2
	}
	for _, alias := range value.Aliases {
		if strings.HasPrefix(strings.ToLower(alias), normalized) {
			return 3
		}
	}
	return 4
}

func escapedPageNamePattern(value string) string {
	return "%" + strings.NewReplacer("~", "~~", "%", "~%", "_", "~_").Replace(value) + "%"
}

func (s *Store) visibleKnowledgePageIdentity(ctx context.Context, tx *sql.Tx, libraryID, pageID string, a knowledgesdk.Authority) (knowledgesdk.KnowledgePageIdentity, string, bool, error) {
	var page knowledgesdk.KnowledgePage
	found, err := s.executionRead(ctx, tx, knowledgePageTable, pageScope(a, pageID), &page)
	if err != nil || !found || page.LibraryID != libraryID || page.State != "active" {
		return knowledgesdk.KnowledgePageIdentity{}, "", false, err
	}
	access, err := s.evaluateKnowledgePageAccess(ctx, tx, libraryID, pageID, a)
	if err != nil || !access.Allowed || roleLevel(access.Role) < roleLevel("reader") {
		return knowledgesdk.KnowledgePageIdentity{}, "", false, err
	}
	publishedOnly := roleLevel(access.Role) < roleLevel("editor")
	if publishedOnly {
		if page.PublishedVersion < 1 {
			return knowledgesdk.KnowledgePageIdentity{}, "", false, nil
		}
		version, versionErr := s.pageVersion(ctx, tx, pageID, page.PublishedVersion, a)
		if versionErr != nil {
			return knowledgesdk.KnowledgePageIdentity{}, "", false, versionErr
		}
		page.Title, page.ParentPageID, page.Rank, page.ContentType = version.Title, version.ParentPageID, version.Rank, version.ContentType
	}
	path, err := s.pageBreadcrumbs(ctx, tx, page, publishedOnly, a)
	if err != nil {
		return knowledgesdk.KnowledgePageIdentity{}, "", false, err
	}
	metadata, _, err := s.knowledgePageMetadataRecord(ctx, tx, libraryID, pageID, a)
	if err != nil {
		return knowledgesdk.KnowledgePageIdentity{}, "", false, err
	}
	return knowledgesdk.KnowledgePageIdentity{PageID: pageID, Title: page.Title, Aliases: metadata.Aliases, ContentType: page.ContentType, Path: path}, page.ParentPageID, true, nil
}

func (s *Store) SearchKnowledgePageIdentities(ctx context.Context, libraryID, search string, limit int, a knowledgesdk.Authority) (out knowledgesdk.KnowledgePageIdentityPage, err error) {
	out.Items = []knowledgesdk.KnowledgePageIdentity{}
	if err = conversationAuthority(a); err != nil {
		return
	}
	search = strings.TrimSpace(search)
	if search != "" && !executionText(search, 128, true) {
		return out, conversationError("bad_request", "page_identity_query_invalid")
	}
	if limit, err = knowledgePageDiscoveryLimit(limit); err != nil {
		return
	}
	normalized := strings.ToLower(search)
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		if _, readErr := s.libraryRecord(ctx, tx, libraryID, a); readErr != nil {
			return readErr
		}
		predicate := query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("library_id", libraryID))
		if normalized != "" {
			predicate = query.And(predicate, query.LikeEscaped("name_key", escapedPageNamePattern(normalized)))
		}
		scanLimit := limit * (knowledgePageMaximumAliases + 2) * 20
		if scanLimit > knowledgeLibraryMaximumPages*(knowledgePageMaximumAliases+2) {
			scanLimit = knowledgeLibraryMaximumPages * (knowledgePageMaximumAliases + 2)
		}
		statement, args, buildErr := query.NewSelectBuilder(s.store.Renderer(), knowledgePageNameTable).
			Columns("page_id").Where(predicate).OrderBy(query.Ascending("name_key"), query.Ascending("page_id"), query.Ascending("name_kind")).Limit(scanLimit + 1).Build()
		if buildErr != nil {
			return buildErr
		}
		rows, readErr := tx.QueryContext(ctx, statement, args...)
		if readErr != nil {
			return readErr
		}
		defer rows.Close()
		candidateIDs := make([]string, 0, scanLimit)
		seen := map[string]bool{}
		for rows.Next() {
			var pageID string
			if readErr = rows.Scan(&pageID); readErr != nil {
				return readErr
			}
			if !seen[pageID] {
				seen[pageID] = true
				candidateIDs = append(candidateIDs, pageID)
			}
		}
		if readErr = rows.Err(); readErr != nil {
			return readErr
		}
		for _, pageID := range candidateIDs {
			identity, _, visible, resolveErr := s.visibleKnowledgePageIdentity(ctx, tx, libraryID, pageID, a)
			if resolveErr != nil {
				return resolveErr
			}
			if visible && identityMatches(identity, normalized) {
				out.Items = append(out.Items, identity)
			}
		}
		sort.Slice(out.Items, func(left, right int) bool {
			leftRank, rightRank := identityRank(out.Items[left], normalized), identityRank(out.Items[right], normalized)
			if leftRank != rightRank {
				return leftRank < rightRank
			}
			leftPath, rightPath := knowledgePageIdentityPath(out.Items[left]), knowledgePageIdentityPath(out.Items[right])
			if leftPath != rightPath {
				return leftPath < rightPath
			}
			return out.Items[left].PageID < out.Items[right].PageID
		})
		if len(out.Items) > limit {
			out.Items = out.Items[:limit]
		}
		return nil
	})
	return
}

func knowledgePageIdentityPath(value knowledgesdk.KnowledgePageIdentity) string {
	parts := make([]string, 0, len(value.Path))
	for _, item := range value.Path {
		parts = append(parts, item.Title)
	}
	return strings.Join(parts, " / ")
}

func graphEdgeKey(edge knowledgesdk.KnowledgePageRelationshipEdge) string {
	source, target := edge.SourcePageID, edge.TargetPageID
	if !edge.Directed && target < source {
		source, target = target, source
	}
	return edge.Kind + "\n" + source + "\n" + target
}

func (s *Store) incidentKnowledgePageGraphEdges(ctx context.Context, tx *sql.Tx, libraryID, pageID string, limit int, parentID string, a knowledgesdk.Authority) ([]knowledgesdk.KnowledgePageRelationshipEdge, bool, error) {
	edges := []knowledgesdk.KnowledgePageRelationshipEdge{}
	truncated := false
	readPairs := func(table, sourceColumn, targetColumn, kind string, directed bool) error {
		predicate := query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("library_id", libraryID), query.Or(query.Equal(sourceColumn, pageID), query.Equal(targetColumn, pageID)))
		statement, args, err := query.NewSelectBuilder(s.store.Renderer(), table).Columns(sourceColumn, targetColumn).Where(predicate).OrderBy(query.Ascending(sourceColumn), query.Ascending(targetColumn)).Limit(limit + 1).Build()
		if err != nil {
			return err
		}
		rows, err := tx.QueryContext(ctx, statement, args...)
		if err != nil {
			return err
		}
		count := 0
		for rows.Next() {
			var source, target string
			if err = rows.Scan(&source, &target); err != nil {
				_ = rows.Close()
				return err
			}
			count++
			if count <= limit {
				edges = append(edges, knowledgesdk.KnowledgePageRelationshipEdge{SourcePageID: source, TargetPageID: target, Kind: kind, Directed: directed})
			}
		}
		if count > limit {
			truncated = true
		}
		readErr := rows.Err()
		closeErr := rows.Close()
		if readErr != nil {
			return readErr
		}
		return closeErr
	}
	if err := readPairs(knowledgePageRelationTable, "source_page_id", "target_page_id", knowledgesdk.KnowledgePageRelationshipRelated, false); err != nil {
		return nil, false, err
	}
	if err := readPairs(knowledgePageReferenceTable, "source_page_id", "target_page_id", knowledgesdk.KnowledgePageRelationshipReference, true); err != nil {
		return nil, false, err
	}
	if parentID != "" {
		edges = append(edges, knowledgesdk.KnowledgePageRelationshipEdge{SourcePageID: parentID, TargetPageID: pageID, Kind: knowledgesdk.KnowledgePageRelationshipHierarchy, Directed: true})
	}
	childPredicate := query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("library_id", libraryID), query.Equal("state", "active"), query.Or(query.Equal("parent_page_id", pageID), query.Equal("published_parent_page_id", pageID)))
	statement, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgePageTable).Columns("page_id").Where(childPredicate).OrderBy(query.Ascending("page_id")).Limit(limit + 1).Build()
	if err != nil {
		return nil, false, err
	}
	rows, err := tx.QueryContext(ctx, statement, args...)
	if err != nil {
		return nil, false, err
	}
	defer rows.Close()
	count := 0
	for rows.Next() {
		var childID string
		if err = rows.Scan(&childID); err != nil {
			return nil, false, err
		}
		count++
		if count <= limit {
			edges = append(edges, knowledgesdk.KnowledgePageRelationshipEdge{SourcePageID: pageID, TargetPageID: childID, Kind: knowledgesdk.KnowledgePageRelationshipHierarchy, Directed: true})
		}
	}
	if err = rows.Err(); err != nil {
		return nil, false, err
	}
	return edges, truncated || count > limit, nil
}

func (s *Store) KnowledgePageRelationshipGraph(ctx context.Context, libraryID, pageID string, depth, limit int, a knowledgesdk.Authority) (out knowledgesdk.KnowledgePageRelationshipGraph, err error) {
	out = knowledgesdk.KnowledgePageRelationshipGraph{CenterPageID: pageID, Nodes: []knowledgesdk.KnowledgePageRelationshipNode{}, Edges: []knowledgesdk.KnowledgePageRelationshipEdge{}}
	if err = conversationAuthority(a); err != nil {
		return
	}
	if depth, limit, err = knowledgePageGraphLimits(depth, limit); err != nil {
		return
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		if _, readErr := s.libraryRecord(ctx, tx, libraryID, a); readErr != nil {
			return readErr
		}
		type resolvedNode struct {
			identity knowledgesdk.KnowledgePageIdentity
			parentID string
		}
		resolved := map[string]resolvedNode{}
		resolve := func(candidateID string) (resolvedNode, bool, error) {
			if value, ok := resolved[candidateID]; ok {
				return value, true, nil
			}
			identity, parentID, visible, resolveErr := s.visibleKnowledgePageIdentity(ctx, tx, libraryID, candidateID, a)
			if resolveErr != nil || !visible {
				return resolvedNode{}, false, resolveErr
			}
			value := resolvedNode{identity: identity, parentID: parentID}
			resolved[candidateID] = value
			return value, true, nil
		}
		center, visible, readErr := resolve(pageID)
		if readErr != nil {
			return readErr
		}
		if !visible {
			return conversationError("not_found", "page_not_found")
		}
		_ = center
		frontier := []string{pageID}
		edgeMap := map[string]knowledgesdk.KnowledgePageRelationshipEdge{}
		for level := 0; level < depth && len(frontier) > 0; level++ {
			next := []string{}
			sort.Strings(frontier)
			for _, currentID := range frontier {
				current := resolved[currentID]
				raw, clipped, edgeErr := s.incidentKnowledgePageGraphEdges(ctx, tx, libraryID, currentID, limit*4, current.parentID, a)
				if edgeErr != nil {
					return edgeErr
				}
				out.Truncated = out.Truncated || clipped
				for _, edge := range raw {
					neighborID := edge.TargetPageID
					if neighborID == currentID {
						neighborID = edge.SourcePageID
					}
					_, known := resolved[neighborID]
					if !known && len(resolved) >= limit {
						out.Truncated = true
						continue
					}
					neighbor, neighborVisible, resolveErr := resolve(neighborID)
					if resolveErr != nil {
						return resolveErr
					}
					if !neighborVisible {
						continue
					}
					// The candidate query intentionally checks both draft and
					// published parents so readers and editors share one bounded
					// lookup. Keep only the parent that is visible to this caller;
					// otherwise an unpublished move would leave a false old edge.
					if edge.Kind == knowledgesdk.KnowledgePageRelationshipHierarchy && edge.TargetPageID == neighborID && neighbor.parentID != edge.SourcePageID {
						continue
					}
					if !known {
						next = append(next, neighborID)
					}
					if !edge.Directed && edge.TargetPageID < edge.SourcePageID {
						edge.SourcePageID, edge.TargetPageID = edge.TargetPageID, edge.SourcePageID
					}
					edgeMap[graphEdgeKey(edge)] = edge
				}
			}
			frontier = next
		}
		for id, node := range resolved {
			out.Nodes = append(out.Nodes, knowledgesdk.KnowledgePageRelationshipNode{KnowledgePageIdentity: node.identity, Center: id == pageID})
		}
		for _, edge := range edgeMap {
			if _, sourceVisible := resolved[edge.SourcePageID]; sourceVisible {
				if _, targetVisible := resolved[edge.TargetPageID]; targetVisible {
					out.Edges = append(out.Edges, edge)
				}
			}
		}
		sort.Slice(out.Nodes, func(left, right int) bool {
			if out.Nodes[left].Center != out.Nodes[right].Center {
				return out.Nodes[left].Center
			}
			return knowledgePageIdentityPath(out.Nodes[left].KnowledgePageIdentity) < knowledgePageIdentityPath(out.Nodes[right].KnowledgePageIdentity)
		})
		sort.Slice(out.Edges, func(left, right int) bool { return graphEdgeKey(out.Edges[left]) < graphEdgeKey(out.Edges[right]) })
		return nil
	})
	return
}
