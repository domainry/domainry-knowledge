package store

import (
	"context"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-orm/query"
)

const knowledgePageTraversalBatchSize = 128

type knowledgePageDescendantQuery struct {
	parentColumn  string
	activeOnly    bool
	publishedOnly bool
}

// visitKnowledgePageDescendants walks only the requested subtree. Each query
// is bounded by a fixed page size and a fixed parent frontier, so a move of a
// small subtree never materializes the rest of the Library in process memory.
// The page table's current/published parent indexes own the traversal order.
func (s *Store) visitKnowledgePageDescendants(
	ctx context.Context,
	db conversationDB,
	libraryID, rootPageID string,
	options knowledgePageDescendantQuery,
	a agentsdk.Authority,
	visit func(knowledgesdk.KnowledgePage, string) error,
) error {
	if options.parentColumn != "parent_page_id" && options.parentColumn != "published_parent_page_id" {
		return conversationError("bad_request", "page_tree_parent_invalid")
	}
	frontier := []string{rootPageID}
	seen := map[string]bool{rootPageID: true}
	count := 0
	for len(frontier) != 0 {
		next := make([]string, 0)
		for start := 0; start < len(frontier); start += knowledgePageTraversalBatchSize {
			end := start + knowledgePageTraversalBatchSize
			if end > len(frontier) {
				end = len(frontier)
			}
			parents := make([]any, end-start)
			for index, parentID := range frontier[start:end] {
				parents[index] = parentID
			}
			afterPageID := ""
			for {
				predicates := []query.Predicate{
					query.Equal("scope_key", libraryScope(a)),
					query.Equal("library_id", libraryID),
					query.In(options.parentColumn, parents...),
				}
				if options.activeOnly {
					predicates = append(predicates, query.Equal("state", "active"))
				}
				if options.publishedOnly {
					predicates = append(predicates, query.GreaterThan("published_version", 0))
				}
				if afterPageID != "" {
					predicates = append(predicates, query.GreaterThan("page_id", afterPageID))
				}
				statement, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgePageTable).
					Columns("payload_json", options.parentColumn, "page_id").
					Where(query.And(predicates...)).
					OrderBy(query.Ascending("page_id")).
					Limit(knowledgePageTraversalBatchSize).
					Build()
				if err != nil {
					return err
				}
				rows, err := db.QueryContext(ctx, statement, args...)
				if err != nil {
					return err
				}
				type descendant struct {
					page     knowledgesdk.KnowledgePage
					parentID string
				}
				batch := make([]descendant, 0, knowledgePageTraversalBatchSize)
				for rows.Next() {
					var raw []byte
					var parentID, pageID string
					if err = rows.Scan(&raw, &parentID, &pageID); err != nil {
						_ = rows.Close()
						return err
					}
					var page knowledgesdk.KnowledgePage
					if err = unmarshalDurableJSON(raw, &page); err != nil {
						_ = rows.Close()
						return err
					}
					if page.ID != pageID {
						_ = rows.Close()
						return conversationError("unavailable", "page_tree_identity_mismatch")
					}
					if seen[page.ID] {
						_ = rows.Close()
						return conversationError("conflict", "page_tree_cycle")
					}
					seen[page.ID] = true
					count++
					if count > knowledgeLibraryMaximumPages {
						_ = rows.Close()
						return conversationError("unavailable", "page_tree_limit")
					}
					batch = append(batch, descendant{page: page, parentID: parentID})
					afterPageID = page.ID
				}
				if err = rows.Err(); err != nil {
					_ = rows.Close()
					return err
				}
				if err = rows.Close(); err != nil {
					return err
				}
				// PostgreSQL transactions own one connection. Finish and close the
				// page cursor before a visitor loads access policy, versions, or any
				// other state on that same transaction.
				for _, item := range batch {
					if err = visit(item.page, item.parentID); err != nil {
						return err
					}
					next = append(next, item.page.ID)
				}
				if len(batch) < knowledgePageTraversalBatchSize {
					break
				}
			}
		}
		frontier = next
	}
	return nil
}
