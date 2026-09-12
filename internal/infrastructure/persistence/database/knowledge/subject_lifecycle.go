package store

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-agent-sdk/persistence"
	lifecyclecontract "github.com/domainry/domainry-lifecycle-sdk/contract"
	lifecyclemodel "github.com/domainry/domainry-lifecycle-sdk/model"
	"github.com/domainry/domainry-orm/query"
)

type SubjectArtifactStorage interface {
	DeleteSubjectArtifactContent(context.Context, agentsdk.ConversationAuthority) (int, error)
}

type SubjectLifecycleOptions struct {
	AttachmentStorage agentsdk.ConversationAttachmentStorage
	ArtifactStorage   agentsdk.ConversationArtifactStorage
	DocumentStorage   agentsdk.KnowledgeDocumentStorage
}

type SubjectLifecycle struct {
	store     *Store
	runtimeID string
	options   SubjectLifecycleOptions
}

func NewSubjectLifecycle(store *Store, runtimeID string, options SubjectLifecycleOptions) SubjectLifecycle {
	return SubjectLifecycle{store: store, runtimeID: strings.TrimSpace(runtimeID), options: options}
}

func (SubjectLifecycle) Owner(context.Context) string { return "knowledge" }

func (s SubjectLifecycle) authority(workspaceID, subjectID string) (agentsdk.ConversationAuthority, error) {
	a := agentsdk.ConversationAuthority{Known: true, RuntimeID: s.runtimeID, WorkspaceID: strings.TrimSpace(workspaceID), UserID: strings.TrimSpace(subjectID)}
	if s.store == nil || s.store.store == nil || s.runtimeID == "" || conversationAuthority(a) != nil {
		return agentsdk.ConversationAuthority{}, fmt.Errorf("knowledge subject scope is required")
	}
	return a, nil
}

func (s SubjectLifecycle) PreviewSubject(ctx context.Context, workspaceID, subjectID string) (json.RawMessage, error) {
	a, err := s.authority(workspaceID, subjectID)
	if err != nil {
		return nil, err
	}
	counts := map[string]int64{}
	owner := conversationOwner(a)
	for key, table := range map[string]string{
		"artifacts": "_agent_artifacts", "attachments": CompatAttachmentTable,
	} {
		if counts[key], err = s.count(ctx, table, query.Equal("owner_key", owner)); err != nil {
			return nil, err
		}
	}
	scope := CompatLibraryScope(a)
	if counts["library_memberships"], err = s.count(ctx, CompatLibraryMemberTable, query.And(query.Equal("scope_key", scope), query.Equal("user_id", a.UserID))); err != nil {
		return nil, err
	}
	personal, err := s.personalLibraries(ctx, s.store.store.Database(), a)
	if err != nil {
		return nil, err
	}
	counts["personal_libraries"] = int64(len(personal))
	for _, id := range personal {
		n, countErr := s.count(ctx, CompatKnowledgeDocumentTable, query.And(query.Equal("scope_key", scope), query.Equal("library_id", id)))
		if countErr != nil {
			return nil, countErr
		}
		counts["personal_documents"] += n
	}
	return json.Marshal(counts)
}

func (s SubjectLifecycle) count(ctx context.Context, table string, predicate query.Predicate) (int64, error) {
	statement, args, err := query.NewSelectBuilder(s.store.store.Renderer(), table).Projections(query.Project(query.CountAll())).Where(predicate).Build()
	if err != nil {
		return 0, err
	}
	var count int64
	err = s.store.store.Database().QueryRowContext(ctx, statement, args...).Scan(&count)
	return count, err
}

func (s SubjectLifecycle) ExportSubjectForRequest(ctx context.Context, _ string, workspaceID, subjectID string) (json.RawMessage, error) {
	a, err := s.authority(workspaceID, subjectID)
	if err != nil {
		return nil, err
	}
	owner, scope := conversationOwner(a), CompatLibraryScope(a)
	export := map[string]any{}
	for key, tableColumn := range map[string][2]string{
		"artifacts": {"_agent_artifacts", "owner_key"}, "artifact_versions": {"_agent_artifact_versions", "owner_key"},
		"attachments": {CompatAttachmentTable, "owner_key"},
	} {
		items, readErr := s.payloads(ctx, tableColumn[0], query.Equal(tableColumn[1], owner))
		if readErr != nil {
			return nil, readErr
		}
		export[key] = items
	}
	personal, err := s.personalLibraries(ctx, s.store.store.Database(), a)
	if err != nil {
		return nil, err
	}
	libraries := []json.RawMessage{}
	documents := []json.RawMessage{}
	for _, id := range personal {
		items, readErr := s.payloads(ctx, CompatLibraryTable, query.And(query.Equal("scope_key", scope), query.Equal("library_id", id)))
		if readErr != nil {
			return nil, readErr
		}
		libraries = append(libraries, items...)
		items, readErr = s.payloads(ctx, CompatKnowledgeDocumentTable, query.And(query.Equal("scope_key", scope), query.Equal("library_id", id)))
		if readErr != nil {
			return nil, readErr
		}
		documents = append(documents, items...)
	}
	export["personal_libraries"], export["personal_documents"] = libraries, documents
	export["shared_membership"] = map[string]any{"workspace_scope": scope, "user_id": a.UserID}
	return json.Marshal(export)
}

func (s SubjectLifecycle) payloads(ctx context.Context, table string, predicate query.Predicate) ([]json.RawMessage, error) {
	statement, args, err := query.NewSelectBuilder(s.store.store.Renderer(), table).Columns("payload_json").Where(predicate).Build()
	if err != nil {
		return nil, err
	}
	rows, err := s.store.store.Database().QueryContext(ctx, statement, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []json.RawMessage{}
	for rows.Next() {
		var raw json.RawMessage
		if err := rows.Scan(&raw); err != nil {
			return nil, err
		}
		items = append(items, append(json.RawMessage(nil), raw...))
	}
	return items, rows.Err()
}

func (s SubjectLifecycle) personalLibraries(ctx context.Context, db conversationDB, a agentsdk.ConversationAuthority) ([]string, error) {
	statement, args, err := query.NewSelectBuilder(s.store.store.Renderer(), CompatLibraryTable).Columns("library_id", "payload_json").Where(query.Equal("scope_key", CompatLibraryScope(a))).Build()
	if err != nil {
		return nil, err
	}
	rows, err := db.QueryContext(ctx, statement, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	ids := []string{}
	for rows.Next() {
		var id string
		var raw []byte
		var library agentsdk.KnowledgeLibrary
		if err := rows.Scan(&id, &raw); err != nil {
			return nil, err
		}
		if err := json.Unmarshal(raw, &library); err != nil {
			return nil, err
		}
		if library.Kind == "personal" && library.OwnerUserID == a.UserID {
			ids = append(ids, id)
		}
	}
	return ids, rows.Err()
}

type knowledgeSubjectCandidates struct {
	attachments []persistence.ConversationAttachmentRecord
	documents   []persistence.KnowledgeDocumentRecord
	libraries   []string
}

func (s SubjectLifecycle) EraseSubjectForRequest(ctx context.Context, requestID, workspaceID, subjectID string, holds []lifecyclemodel.LegalHold) (json.RawMessage, error) {
	if len(holds) > 0 {
		return nil, fmt.Errorf("knowledge subject erasure blocked by legal hold")
	}
	a, err := s.authority(workspaceID, subjectID)
	requestID = strings.TrimSpace(requestID)
	if err != nil || requestID == "" || len(requestID) > 96 {
		return nil, fmt.Errorf("knowledge subject erasure request is required")
	}
	if receipt, found, readErr := s.receipt(ctx, s.store.store.Database(), conversationOwner(a), requestID); readErr != nil || found {
		return receipt, readErr
	}
	candidates, err := s.erasureCandidates(ctx, a)
	if err != nil {
		return nil, err
	}
	if err = s.deletePhysicalSubjectData(ctx, a, candidates); err != nil {
		return nil, err
	}
	var receipt json.RawMessage
	err = s.store.transaction(ctx, func(tx *sql.Tx) error {
		if previous, found, readErr := s.receipt(ctx, tx, conversationOwner(a), requestID); readErr != nil {
			return readErr
		} else if found {
			receipt = previous
			return nil
		}
		changed, eraseErr := s.eraseRows(ctx, tx, a, candidates)
		if eraseErr != nil {
			return eraseErr
		}
		if storage, ok := s.options.ArtifactStorage.(SubjectArtifactStorage); ok {
			// Physical owner storage was already removed before this transaction.
			_ = storage
			changed["artifact_content_objects"] = -1
		}
		receipt, _ = json.Marshal(map[string]any{"request_id": requestID, "changed": changed, "personal_copies_removed": len(candidates.documents), "shared_references_anonymized": changed["shared_documents_anonymized"], "completed_at": time.Now().UTC()})
		statement, args, buildErr := query.NewInsertBuilder(s.store.store.Renderer(), subjectReceiptTable).Columns("owner_key", "request_id", "payload_json").Values(conversationOwner(a), requestID, receipt).Build()
		if buildErr != nil {
			return buildErr
		}
		_, buildErr = tx.ExecContext(ctx, statement, args...)
		return buildErr
	})
	return receipt, err
}

func (s SubjectLifecycle) receipt(ctx context.Context, db conversationDB, owner, requestID string) (json.RawMessage, bool, error) {
	statement, args, err := query.NewSelectBuilder(s.store.store.Renderer(), subjectReceiptTable).Columns("payload_json").Where(query.And(query.Equal("owner_key", owner), query.Equal("request_id", requestID))).Build()
	if err != nil {
		return nil, false, err
	}
	var raw json.RawMessage
	err = db.QueryRowContext(ctx, statement, args...).Scan(&raw)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, false, nil
	}
	return raw, err == nil, err
}

func (s SubjectLifecycle) erasureCandidates(ctx context.Context, a agentsdk.ConversationAuthority) (knowledgeSubjectCandidates, error) {
	result := knowledgeSubjectCandidates{}
	owner := conversationOwner(a)
	statement, args, err := query.NewSelectBuilder(s.store.store.Renderer(), CompatAttachmentTable).Columns("payload_json").Where(query.Equal("owner_key", owner)).Build()
	if err != nil {
		return result, err
	}
	rows, err := s.store.store.Database().QueryContext(ctx, statement, args...)
	if err != nil {
		return result, err
	}
	for rows.Next() {
		var raw []byte
		var record persistence.ConversationAttachmentRecord
		if err = rows.Scan(&raw); err == nil {
			err = json.Unmarshal(raw, &record)
		}
		if err != nil {
			rows.Close()
			return result, err
		}
		result.attachments = append(result.attachments, record)
	}
	if err = rows.Close(); err != nil {
		return result, err
	}
	result.libraries, err = s.personalLibraries(ctx, s.store.store.Database(), a)
	if err != nil {
		return result, err
	}
	for _, libraryID := range result.libraries {
		statement, args, err = query.NewSelectBuilder(s.store.store.Renderer(), CompatKnowledgeDocumentTable).Columns("payload_json").Where(query.And(query.Equal("scope_key", CompatLibraryScope(a)), query.Equal("library_id", libraryID))).Build()
		if err != nil {
			return result, err
		}
		rows, err = s.store.store.Database().QueryContext(ctx, statement, args...)
		if err != nil {
			return result, err
		}
		for rows.Next() {
			var raw []byte
			var record persistence.KnowledgeDocumentRecord
			if err = rows.Scan(&raw); err == nil {
				err = json.Unmarshal(raw, &record)
			}
			if err != nil {
				rows.Close()
				return result, err
			}
			result.documents = append(result.documents, record)
		}
		if err = rows.Close(); err != nil {
			return result, err
		}
	}
	return result, nil
}

func (s SubjectLifecycle) deletePhysicalSubjectData(ctx context.Context, a agentsdk.ConversationAuthority, candidates knowledgeSubjectCandidates) error {
	for _, record := range candidates.attachments {
		if s.options.AttachmentStorage != nil && record.BodyRef != "" {
			if err := s.options.AttachmentStorage.DeleteAttachmentContent(ctx, record.Attachment.ID, a); err != nil {
				return err
			}
		}
	}
	for _, record := range candidates.documents {
		if s.options.DocumentStorage != nil && record.BodyRef != "" {
			scope := agentsdk.KnowledgeDocumentStorageScope{RuntimeID: a.RuntimeID, WorkspaceID: a.WorkspaceID, LibraryID: record.Document.LibraryID}
			if err := s.options.DocumentStorage.DeleteKnowledgeDocumentContent(ctx, scope, record.Document.ID); err != nil {
				return err
			}
		}
	}
	if storage, ok := s.options.ArtifactStorage.(SubjectArtifactStorage); ok {
		if _, err := storage.DeleteSubjectArtifactContent(ctx, a); err != nil {
			return err
		}
	}
	return nil
}

func (s SubjectLifecycle) eraseRows(ctx context.Context, tx *sql.Tx, a agentsdk.ConversationAuthority, candidates knowledgeSubjectCandidates) (map[string]int64, error) {
	changed := map[string]int64{}
	owner, scope := conversationOwner(a), CompatLibraryScope(a)
	for key, table := range map[string]string{
		"artifact_exports": "_agent_artifact_exports", "artifact_mutations": "_agent_artifact_mutations", "artifact_versions": "_agent_artifact_versions", "artifacts": "_agent_artifacts",
		"attachment_index_jobs": CompatAttachmentIndexJobTable, "attachment_cleanup": CompatAttachmentCleanupTable, "attachments": CompatAttachmentTable,
	} {
		n, err := s.deleteWhere(ctx, tx, table, query.Equal("owner_key", owner))
		if err != nil {
			return nil, err
		}
		changed[key] = n
	}
	for _, libraryID := range candidates.libraries {
		predicate := query.And(query.Equal("scope_key", scope), query.Equal("library_id", libraryID))
		for key, table := range map[string]string{"document_jobs": CompatKnowledgeDocumentJobTable, "documents": CompatKnowledgeDocumentTable, "document_sources": CompatKnowledgeDocumentSourceTable, "datasource_bindings": CompatKnowledgeDatasourceTable, "library_members": CompatLibraryMemberTable, "libraries": CompatLibraryTable} {
			n, err := s.deleteWhere(ctx, tx, table, predicate)
			if err != nil {
				return nil, err
			}
			changed[key] += n
		}
	}
	n, err := s.deleteWhere(ctx, tx, CompatLibraryMemberTable, query.And(query.Equal("scope_key", scope), query.Equal("user_id", a.UserID)))
	if err != nil {
		return nil, err
	}
	changed["shared_memberships"] = n
	anonymized, err := s.anonymizeSharedDocumentReferences(ctx, tx, a, candidates.libraries)
	changed["shared_documents_anonymized"] = anonymized
	return changed, err
}

func (s SubjectLifecycle) deleteWhere(ctx context.Context, tx *sql.Tx, table string, predicate query.Predicate) (int64, error) {
	statement, args, err := query.NewDeleteBuilder(s.store.store.Renderer(), table).Where(predicate).Build()
	if err != nil {
		return 0, err
	}
	result, err := tx.ExecContext(ctx, statement, args...)
	if err != nil {
		return 0, err
	}
	return result.RowsAffected()
}

func (s SubjectLifecycle) anonymizeSharedDocumentReferences(ctx context.Context, tx *sql.Tx, a agentsdk.ConversationAuthority, personal []string) (int64, error) {
	personalSet := map[string]bool{}
	for _, id := range personal {
		personalSet[id] = true
	}
	statement, args, err := query.NewSelectBuilder(s.store.store.Renderer(), CompatKnowledgeDocumentTable).Columns("document_id", "payload_json").Where(query.Equal("scope_key", CompatLibraryScope(a))).Build()
	if err != nil {
		return 0, err
	}
	rows, err := tx.QueryContext(ctx, statement, args...)
	if err != nil {
		return 0, err
	}
	type update struct {
		id  string
		raw []byte
	}
	updates := []update{}
	anonymous := "erased-" + conversationHash([]string{a.WorkspaceID, a.UserID})[:24]
	for rows.Next() {
		var id string
		var raw []byte
		var record persistence.KnowledgeDocumentRecord
		if err = rows.Scan(&id, &raw); err == nil {
			err = json.Unmarshal(raw, &record)
		}
		if err != nil {
			rows.Close()
			return 0, err
		}
		if personalSet[record.Document.LibraryID] || record.Document.CreatedByUserID != a.UserID && record.Actor.UserID != a.UserID {
			continue
		}
		record.Document.CreatedByUserID = anonymous
		if record.Actor.UserID == a.UserID {
			record.Actor.UserID, record.Actor.RoleKey = anonymous, ""
		}
		record.AttachmentOrigin = nil
		record.DocumentOrigin = nil
		updates = append(updates, update{id: id, raw: conversationJSON(record)})
	}
	if err = rows.Close(); err != nil {
		return 0, err
	}
	for _, value := range updates {
		statement, args, err = query.NewUpdateBuilder(s.store.store.Renderer(), CompatKnowledgeDocumentTable).Set("payload_json", value.raw).Where(query.And(query.Equal("scope_key", CompatLibraryScope(a)), query.Equal("document_id", value.id))).Build()
		if err != nil {
			return 0, err
		}
		if _, err = tx.ExecContext(ctx, statement, args...); err != nil {
			return 0, err
		}
	}
	return int64(len(updates)), nil
}

var _ lifecyclecontract.SubjectExecutionHandler = SubjectLifecycle{}
