package store

import (
	"context"
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"strings"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func knowledgeAgentDocumentBlock(content, blockID string) (knowledgeDocumentBlock, string, bool, error) {
	var payload knowledgeDocumentPayload
	decoder := json.NewDecoder(strings.NewReader(content))
	decoder.UseNumber()
	if err := decoder.Decode(&payload); err != nil {
		return knowledgeDocumentBlock{}, "", false, err
	}
	var visit func([]knowledgeDocumentBlock) (knowledgeDocumentBlock, bool)
	visit = func(blocks []knowledgeDocumentBlock) (knowledgeDocumentBlock, bool) {
		for _, block := range blocks {
			if block.ID == blockID {
				return block, true
			}
			if found, ok := visit(block.Children); ok {
				return found, true
			}
		}
		return knowledgeDocumentBlock{}, false
	}
	blocks := make([]knowledgeDocumentBlock, 0, len(payload.Blocks))
	for _, raw := range payload.Blocks {
		var block knowledgeDocumentBlock
		blockDecoder := json.NewDecoder(strings.NewReader(string(raw)))
		blockDecoder.UseNumber()
		if err := blockDecoder.Decode(&block); err != nil {
			return knowledgeDocumentBlock{}, "", false, err
		}
		blocks = append(blocks, block)
	}
	block, found := visit(blocks)
	if !found {
		return knowledgeDocumentBlock{}, "", false, nil
	}
	canonical, err := json.Marshal(block)
	if err != nil {
		return knowledgeDocumentBlock{}, "", false, err
	}
	digest := sha256.Sum256(canonical)
	return block, hex.EncodeToString(digest[:]), true, nil
}

func knowledgeAgentDocumentBlockText(block knowledgeDocumentBlock) string {
	words := []string{knowledgeDocumentBlockPreview(block)}
	for _, child := range block.Children {
		words = append(words, knowledgeAgentDocumentBlockText(child))
	}
	value := strings.Join(strings.Fields(strings.Join(words, "\n")), " ")
	runes := []rune(value)
	if len(runes) > 16384 {
		value = string(runes[:16384])
	}
	return value
}

func (s *Store) ResolveKnowledgeAgentReference(ctx context.Context, reference knowledgesdk.KnowledgeAgentReference, authority knowledgesdk.Authority) (out knowledgesdk.KnowledgeAgentResolvedReference, err error) {
	if conversationAuthority(authority) != nil || !validLibraryID(reference.LibraryID) || !validKnowledgePageID(reference.PageID) || reference.Version < 1 || !validArtifactSHA(reference.ContentSHA256) || reference.BlockID != "" && !knowledgeBlockIDPattern.MatchString(reference.BlockID) {
		return out, conversationError("bad_request", "agent_reference_invalid")
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		library, readErr := s.libraryRecord(ctx, tx, reference.LibraryID, authority)
		if readErr != nil {
			return readErr
		}
		if _, readErr = s.pageRecord(ctx, tx, reference.LibraryID, reference.PageID, authority); readErr != nil {
			return readErr
		}
		version, readErr := s.pageVersion(ctx, tx, reference.PageID, reference.Version, authority)
		if readErr != nil {
			return readErr
		}
		if readErr = redactGridVersion(&version, library, authority); readErr != nil {
			return readErr
		}
		text, digest := version.Body.PlainText, version.Body.ContentSHA256
		if reference.BlockID != "" {
			if version.ContentType != knowledgesdk.KnowledgePageTypeDocument {
				return conversationError("bad_request", "agent_reference_block_unsupported")
			}
			block, blockDigest, found, blockErr := knowledgeAgentDocumentBlock(version.Body.Content, reference.BlockID)
			if blockErr != nil {
				return blockErr
			}
			if !found {
				return conversationError("not_found", "agent_reference_not_found")
			}
			text, digest = knowledgeAgentDocumentBlockText(block), blockDigest
		}
		if digest != reference.ContentSHA256 {
			return conversationError("conflict", "agent_reference_hash_mismatch")
		}
		out = knowledgesdk.KnowledgeAgentResolvedReference{Reference: reference, Title: version.Title, ContentType: version.ContentType, Text: text}
		return nil
	})
	return out, err
}

var _ knowledgesdk.KnowledgeAgentReferenceRepository = (*Store)(nil)
