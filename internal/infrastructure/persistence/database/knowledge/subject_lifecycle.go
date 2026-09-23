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
	sharedartifact "github.com/domainry/domainry-foundation/artifact"
	sharedoperation "github.com/domainry/domainry-foundation/operation"
	lifecyclecontract "github.com/domainry/domainry-lifecycle-sdk/contract"
	lifecyclemodel "github.com/domainry/domainry-lifecycle-sdk/model"
	"github.com/domainry/domainry-orm/query"
)

type SubjectArtifactStorage interface {
	DeleteSubjectArtifactContent(context.Context, agentsdk.ConversationAuthority) (int, error)
}

type SubjectLifecycleOptions struct {
	ArtifactStorage agentsdk.ConversationArtifactStorage
	DocumentStorage agentsdk.KnowledgeDocumentStorage
}

type SubjectLifecycle struct {
	store     *Store
	runtimeID string
	options   SubjectLifecycleOptions
}

const sharedSubjectStepsTable = "_subject_steps"

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
	for key, table := range map[string]string{"artifacts": "_agent_artifacts"} {
		if counts[key], err = s.count(ctx, table, query.Equal("owner_key", owner)); err != nil {
			return nil, err
		}
	}
	attachments, err := s.subjectAttachmentArtifacts(ctx, a)
	if err != nil {
		return nil, err
	}
	counts["attachments"] = int64(len(attachments))
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
	} {
		items, readErr := s.payloads(ctx, tableColumn[0], query.Equal(tableColumn[1], owner))
		if readErr != nil {
			return nil, readErr
		}
		export[key] = items
	}
	attachmentArtifacts, err := s.subjectAttachmentArtifacts(ctx, a)
	if err != nil {
		return nil, err
	}
	attachments := make([]json.RawMessage, 0, len(attachmentArtifacts))
	for _, item := range attachmentArtifacts {
		_, record, readErr := s.store.attachmentArtifact(ctx, s.store.store.Database(), item.ID, a)
		if readErr != nil {
			return nil, readErr
		}
		raw, marshalErr := json.Marshal(record)
		if marshalErr != nil {
			return nil, marshalErr
		}
		attachments = append(attachments, raw)
	}
	export["attachments"] = attachments
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

func (s SubjectLifecycle) subjectAttachmentArtifacts(ctx context.Context, a agentsdk.ConversationAuthority) ([]sharedartifact.Artifact, error) {
	if s.store == nil || s.store.artifacts.Store == nil {
		return []sharedartifact.Artifact{}, nil
	}
	if err := s.store.sharedArtifactsReady(); err != nil {
		return nil, err
	}
	items, err := s.store.artifacts.Store.List(ctx, a.WorkspaceID, sharedartifact.Query{
		Owner: sharedartifact.OwnerAgent, Kind: attachmentArtifactKind,
		Binding: &sharedartifact.BindingQuery{Owner: sharedartifact.OwnerAgent, Kind: sharedartifact.BindingSubject, ResourceType: "agent_user", ResourceID: a.UserID},
		Limit:   1000,
	})
	if err != nil {
		return nil, err
	}
	out := make([]sharedartifact.Artifact, 0, len(items))
	for _, item := range items {
		if attachmentArtifactOwnedBy(item, a) {
			out = append(out, item)
		}
	}
	return out, nil
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
	if receipt, found, readErr := s.receipt(ctx, s.store.store.Database(), a.WorkspaceID, requestID); readErr != nil || found {
		return receipt, readErr
	}
	candidates, err := s.erasureCandidates(ctx, a)
	if err != nil {
		return nil, err
	}
	pending, err := s.prepareExternalCleanup(ctx, a, candidates)
	if err != nil {
		return nil, err
	}
	if pending {
		return nil, fmt.Errorf("Knowledge subject external cleanup is pending")
	}
	physical, err := s.deletePhysicalSubjectData(ctx, a, candidates)
	if err != nil {
		return nil, err
	}
	var receipt json.RawMessage
	err = s.store.transaction(ctx, func(tx *sql.Tx) error {
		if previous, found, readErr := s.receipt(ctx, tx, a.WorkspaceID, requestID); readErr != nil {
			return readErr
		} else if found {
			receipt = previous
			return nil
		}
		changed, eraseErr := s.eraseRows(ctx, tx, a, candidates)
		if eraseErr != nil {
			return eraseErr
		}
		for key, count := range physical {
			changed[key] += count
		}
		completedAt := time.Now().UTC()
		receipt, _ = json.Marshal(map[string]any{"request_id": requestID, "changed": changed, "personal_copies_removed": len(candidates.documents), "shared_references_anonymized": changed["shared_documents_anonymized"], "completed_at": completedAt})
		step, marshalErr := json.Marshal(lifecyclemodel.SubjectExecutionStep{WorkspaceID: a.WorkspaceID, RequestID: requestID, Owner: "knowledge", Operation: "erase", Payload: append(json.RawMessage(nil), receipt...), CompletedAt: completedAt})
		if marshalErr != nil {
			return marshalErr
		}
		statement, args, buildErr := query.NewWorkspaceInsertBuilder(s.store.store.Renderer(), sharedSubjectStepsTable, a.WorkspaceID).
			Columns("request_id", "owner", "operation", "payload_json", "completed_at").
			Values(requestID, "knowledge", "erase", string(step), completedAt.Format(time.RFC3339Nano)).Build()
		if buildErr != nil {
			return buildErr
		}
		_, buildErr = tx.ExecContext(ctx, statement, args...)
		return buildErr
	})
	return receipt, err
}

func (s SubjectLifecycle) receipt(ctx context.Context, db conversationDB, workspaceID, requestID string) (json.RawMessage, bool, error) {
	statement, args, err := query.NewWorkspaceSelectBuilder(s.store.store.Renderer(), sharedSubjectStepsTable, workspaceID).
		Columns("payload_json").
		Where(query.And(query.Equal("request_id", requestID), query.Equal("owner", "knowledge"), query.Equal("operation", "erase"))).Build()
	if err != nil {
		return nil, false, err
	}
	var raw string
	err = db.QueryRowContext(ctx, statement, args...).Scan(&raw)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, false, nil
	}
	if err != nil {
		return nil, false, err
	}
	var step lifecyclemodel.SubjectExecutionStep
	if json.Unmarshal([]byte(raw), &step) != nil || step.WorkspaceID != workspaceID || step.RequestID != requestID || step.Owner != "knowledge" || step.Operation != "erase" || !json.Valid(step.Payload) {
		return nil, false, fmt.Errorf("Knowledge shared subject execution step is invalid")
	}
	return append(json.RawMessage(nil), step.Payload...), true, nil
}

func (s SubjectLifecycle) erasureCandidates(ctx context.Context, a agentsdk.ConversationAuthority) (knowledgeSubjectCandidates, error) {
	result := knowledgeSubjectCandidates{}
	items, err := s.subjectAttachmentArtifacts(ctx, a)
	if err != nil {
		return result, err
	}
	for _, item := range items {
		_, record, readErr := s.store.attachmentArtifact(ctx, s.store.store.Database(), item.ID, a)
		if readErr != nil {
			return result, readErr
		}
		result.attachments = append(result.attachments, record)
	}
	result.libraries, err = s.personalLibraries(ctx, s.store.store.Database(), a)
	if err != nil {
		return result, err
	}
	for _, libraryID := range result.libraries {
		statement, args, err := query.NewSelectBuilder(s.store.store.Renderer(), CompatKnowledgeDocumentTable).Columns("payload_json").Where(query.And(query.Equal("scope_key", CompatLibraryScope(a)), query.Equal("library_id", libraryID))).Build()
		if err != nil {
			return result, err
		}
		rows, err := s.store.store.Database().QueryContext(ctx, statement, args...)
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

func (s SubjectLifecycle) prepareExternalCleanup(ctx context.Context, a agentsdk.ConversationAuthority, candidates knowledgeSubjectCandidates) (bool, error) {
	pending := false
	err := s.store.transaction(ctx, func(tx *sql.Tx) error {
		for _, record := range candidates.attachments {
			if record.Attachment.State == "deleted" {
				continue
			}
			pending = true
			if record.Attachment.State != "deleting" {
				expected := record.Attachment.Revision
				record.Attachment.State, record.Attachment.ErrorCode = "deleting", ""
				record.Attachment.Revision++
				record.Attachment.UpdatedAt = time.Now().UTC().Truncate(time.Millisecond)
				if err := s.store.CompatSaveAttachment(ctx, tx, record, expected, a); err != nil {
					return err
				}
			}
			if err := s.store.CompatQueueAttachmentIndexWork(ctx, tx, record, a); err != nil {
				return err
			}
		}
		return nil
	})
	if err != nil {
		return false, err
	}
	for _, record := range candidates.documents {
		if record.Document.State == "deleted" || !record.PutStarted && !record.IndexObserved {
			continue
		}
		pending = true
		if record.Document.State != "deleting" {
			if _, err := s.store.RequestKnowledgeDocumentDeletion(ctx, record.Document.ID, record.Document.Revision, a); err != nil {
				return false, err
			}
		}
	}
	return pending, nil
}

func (s SubjectLifecycle) deletePhysicalSubjectData(ctx context.Context, a agentsdk.ConversationAuthority, candidates knowledgeSubjectCandidates) (map[string]int64, error) {
	changed := map[string]int64{}
	for _, record := range candidates.documents {
		if s.options.DocumentStorage != nil && record.BodyRef != "" {
			scope := agentsdk.KnowledgeDocumentStorageScope{RuntimeID: a.RuntimeID, WorkspaceID: a.WorkspaceID, LibraryID: record.Document.LibraryID}
			if err := s.options.DocumentStorage.DeleteKnowledgeDocumentContent(ctx, scope, record.Document.ID); err != nil {
				return nil, err
			}
			changed["document_content_objects"]++
		}
	}
	if storage, ok := s.options.ArtifactStorage.(SubjectArtifactStorage); ok {
		count, err := storage.DeleteSubjectArtifactContent(ctx, a)
		if err != nil {
			return nil, err
		}
		changed["artifact_content_objects"] += int64(count)
	}
	if s.store.artifacts.Store != nil && s.store.artifacts.Content != nil {
		items, err := s.store.artifacts.Store.List(ctx, a.WorkspaceID, sharedartifact.Query{
			Owner: sharedartifact.OwnerAgent, Kind: generatedArtifactKind,
			Binding: &sharedartifact.BindingQuery{Owner: sharedartifact.OwnerAgent, Kind: sharedartifact.BindingSubject, ResourceType: "agent_user", ResourceID: a.UserID},
			Limit:   1000,
		})
		if err != nil {
			return nil, err
		}
		for _, item := range items {
			deleted, deleteErr := s.deleteGeneratedArtifactContent(ctx, item)
			if deleteErr != nil {
				return nil, deleteErr
			}
			if deleted {
				changed["generated_artifact_content_objects"]++
			}
		}
	}
	return changed, nil
}

func (s SubjectLifecycle) deleteGeneratedArtifactContent(ctx context.Context, item sharedartifact.Artifact) (bool, error) {
	if item.Status == sharedartifact.StatusDeleted {
		return false, nil
	}
	now := time.Now().UTC()
	if item.Status != sharedartifact.StatusExpired && item.Status != sharedartifact.StatusRejected {
		changed, err := s.store.artifacts.Store.Transition(ctx, item.WorkspaceID, item.ID, item.Status, sharedartifact.StatusExpired, item.ScanStatus, now)
		if err != nil {
			return false, err
		}
		if changed {
			item.Status = sharedartifact.StatusExpired
		} else {
			current, found, readErr := s.store.artifacts.Store.ByID(ctx, item.WorkspaceID, item.ID)
			if readErr != nil {
				return false, readErr
			}
			if !found {
				return false, nil
			}
			if current.Status == sharedartifact.StatusDeleted {
				return false, nil
			}
			if current.Status != sharedartifact.StatusExpired && current.Status != sharedartifact.StatusRejected {
				return false, fmt.Errorf("generated Artifact state changed before content deletion")
			}
			item = current
		}
	}
	if err := s.store.artifacts.Content.Delete(ctx, item.WorkspaceID, item.StorageReference); err != nil && !errors.Is(err, sharedartifact.ErrContentNotFound) {
		return false, err
	}
	changed, err := s.store.artifacts.Store.Transition(ctx, item.WorkspaceID, item.ID, item.Status, sharedartifact.StatusDeleted, item.ScanStatus, now)
	if err != nil || changed {
		return changed, err
	}
	current, found, err := s.store.artifacts.Store.ByID(ctx, item.WorkspaceID, item.ID)
	if err != nil {
		return false, err
	}
	if found && current.Status != sharedartifact.StatusDeleted {
		return false, fmt.Errorf("generated Artifact state changed while deleting terminal content")
	}
	return false, nil
}

func (s SubjectLifecycle) eraseRows(ctx context.Context, tx *sql.Tx, a agentsdk.ConversationAuthority, candidates knowledgeSubjectCandidates) (map[string]int64, error) {
	changed := map[string]int64{}
	owner, scope := conversationOwner(a), CompatLibraryScope(a)
	for key, table := range map[string]string{
		"artifact_versions": "_agent_artifact_versions", "artifacts": "_agent_artifacts",
		"attachment_index_jobs": CompatAttachmentIndexJobTable,
	} {
		n, err := s.deleteWhere(ctx, tx, table, query.Equal("owner_key", owner))
		if err != nil {
			return nil, err
		}
		changed[key] = n
	}
	for _, libraryID := range candidates.libraries {
		predicate := query.And(query.Equal("scope_key", scope), query.Equal("library_id", libraryID))
		for key, target := range map[string]struct {
			table     string
			predicate query.Predicate
		}{
			"document_jobs":     {CompatKnowledgeDocumentJobTable, predicate},
			"documents":         {CompatKnowledgeDocumentTable, predicate},
			"knowledge_sources": {CompatKnowledgeSourceTable, compatKnowledgeSourcePredicate(a, libraryID)},
			"library_members":   {CompatLibraryMemberTable, predicate},
			"libraries":         {CompatLibraryTable, predicate},
		} {
			n, err := s.deleteWhere(ctx, tx, target.table, target.predicate)
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
	if err != nil {
		return nil, err
	}
	changed["operation_receipts"], err = s.store.operations.DeleteRecords(sharedoperation.WithExecutor(ctx, tx), sharedoperation.RecordFilter{WorkspaceID: a.WorkspaceID, Owner: "knowledge", RequestedBy: a.UserID})
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
