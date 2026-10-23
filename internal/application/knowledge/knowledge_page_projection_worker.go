package application

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"time"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

type knowledgePageProjectionSkipper interface {
	SkipKnowledgePageProjection(context.Context, knowledgesdk.KnowledgePageProjectionLease) error
}

func (s *Service) ProcessKnowledgePageProjection(ctx context.Context, repository knowledgesdk.KnowledgePageProjectionRepository, work knowledgesdk.KnowledgePageProjectionWork) (resultErr error) {
	completed := false
	defer func() {
		if completed {
			return
		}
		retry, cancel := context.WithTimeout(context.WithoutCancel(ctx), 5*time.Second)
		defer cancel()
		resultErr = errors.Join(resultErr, repository.RetryKnowledgePageProjection(retry, work.Lease, time.Now().UTC().Add(30*time.Second)))
	}()
	configured, err := s.DocumentManagementConfigured(ctx, work.Lease.LibraryID, work.Lease.Actor)
	if err != nil {
		resultErr = err
		return
	}
	if !configured {
		skipper, ok := repository.(knowledgePageProjectionSkipper)
		if !ok {
			resultErr = conversationFailure("unavailable", "page_projection_skip_unavailable")
			return
		}
		if err = skipper.SkipKnowledgePageProjection(ctx, work.Lease); err != nil {
			resultErr = err
			return
		}
		completed = true
		return nil
	}
	if _, err := s.DocumentAccess(ctx, work.Lease.LibraryID, knowledgesdk.ActionPagesPublish, work.Lease.Actor); err != nil {
		resultErr = err
		return
	}
	source, err := s.DocumentBinding(ctx, work.Lease.LibraryID, work.Lease.Actor)
	if err != nil {
		resultErr = err
		return
	}
	content := []byte("# " + work.Version.Title + "\n\n" + work.Version.Body.PlainText)
	digest := sha256.Sum256(content)
	hash := hex.EncodeToString(digest[:])
	filename := work.Page.ID + ".md"
	documentID, err := knowledgesdk.DeriveKnowledgeEntityID("kdoc", "knowledge.page_projection_document", work.Lease.RuntimeID, work.Lease.WorkspaceID, work.Lease.PageID)
	if err != nil {
		resultErr = err
		return
	}
	reference, err := s.options.DocumentStorage.PutKnowledgeDocumentContent(ctx, DocumentStorageScope(work.Lease.LibraryID, work.Lease.Actor), documentID, hash, int64(len(content)), bytes.NewReader(content))
	if err != nil {
		resultErr = err
		return
	}
	if _, err = s.DocumentAccess(ctx, work.Lease.LibraryID, knowledgesdk.ActionPagesPublish, work.Lease.Actor); err != nil {
		resultErr = err
		return
	}
	if err = repository.CompleteKnowledgePageProjection(ctx, work.Lease, reference, int64(len(content)), hash, filename, DocumentAccessPolicy(source)); err != nil {
		resultErr = err
		return
	}
	completed = true
	s.WakeKnowledgeDocuments()
	return resultErr
}
