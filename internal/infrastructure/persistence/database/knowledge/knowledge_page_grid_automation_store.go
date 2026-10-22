package store

import (
	"context"
	"database/sql"
	"encoding/json"
	"strings"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-orm/query"
)

func gridAutomationDefinition(root map[string]any, automationID string) (map[string]any, bool) {
	automations, ok := root["automations"].([]any)
	if !ok {
		return nil, false
	}
	for _, raw := range automations {
		automation, valid := raw.(map[string]any)
		if valid && automation["id"] == automationID {
			return automation, true
		}
	}
	return nil, false
}

func (s *Store) ExecuteKnowledgeGridAutomation(ctx context.Context, libraryID, pageID string, in knowledgesdk.KnowledgeGridAutomationExecute, a agentsdk.Authority) (out knowledgesdk.KnowledgeGridAutomationResult, err error) {
	if !personalMemoryKey(in.ExecutionID) || !validNativeOperationEntityID(in.AutomationID) || !validNativeOperationEntityID(in.RecordID) || in.ExpectedDraftRevision < 1 || in.Trigger != knowledgesdk.KnowledgeGridAutomationTriggerRecordCreated && in.Trigger != knowledgesdk.KnowledgeGridAutomationTriggerRecordUpdated {
		return out, conversationError("bad_request", "page_grid_automation_invalid")
	}
	if _, err = pageRequestKey("grid_automation", libraryID, pageID, in.ExecutionID, a); err != nil {
		return out, err
	}
	err = s.mutateKnowledgeOperation(ctx, "knowledge.page.grid_automation", knowledgesdk.ActionPageGridAutomationExecute, libraryID+":"+pageID, in.ExecutionID, in, a, func(tx *sql.Tx) (any, error) {
		library, operationErr := s.libraryRecord(ctx, tx, libraryID, a)
		if operationErr != nil {
			return out, operationErr
		}
		if operationErr = requirePageWriting(library); operationErr != nil {
			return out, operationErr
		}
		page, operationErr := s.pageRecord(ctx, tx, libraryID, pageID, a)
		if operationErr != nil {
			return out, operationErr
		}
		if page.State != "active" || page.ContentType != knowledgesdk.KnowledgePageTypeMultidimensionalTable {
			return out, conversationError("conflict", "page_grid_automation_unsupported")
		}
		draft, found, operationErr := s.pageDraft(ctx, tx, pageID, a)
		if operationErr != nil {
			return out, operationErr
		}
		if !found || draft.DraftRevision != in.ExpectedDraftRevision {
			return out, conversationError("conflict", "page_grid_automation_revision_conflict")
		}
		var root map[string]any
		decoder := json.NewDecoder(strings.NewReader(draft.Body.Content))
		decoder.UseNumber()
		if operationErr = decoder.Decode(&root); operationErr != nil || root == nil {
			return out, conversationError("bad_request", "page_content_schema_invalid")
		}
		automation, exists := gridAutomationDefinition(root, in.AutomationID)
		if !exists || automation["enabled"] != true || automation["trigger"] != in.Trigger || automation["action"] != knowledgesdk.KnowledgeGridAutomationActionSetField {
			return out, conversationError("conflict", "page_grid_automation_not_executable")
		}
		fieldID, _ := automation["field_id"].(string)
		if !validNativeOperationEntityID(fieldID) {
			return out, conversationError("bad_request", "page_content_schema_invalid")
		}
		if !gridAllows(root, "records", in.RecordID, true, library, a) || !gridAllows(root, "fields", fieldID, true, library, a) {
			return out, conversationError("forbidden", "page_grid_permission_denied")
		}
		value, marshalErr := json.Marshal(automation["value"])
		if marshalErr != nil {
			return out, conversationError("bad_request", "page_content_schema_invalid")
		}
		expectedHash := ""
		if records, valid := root["records"].([]any); valid {
			if recordIndex := nativeEntityIndex(records, in.RecordID); recordIndex >= 0 {
				if record, valid := records[recordIndex].(map[string]any); valid {
					if values, valid := record["values"].(map[string]any); valid {
						if current, exists := values[fieldID]; exists {
							expectedHash = conversationHash(current)
						}
					}
				}
			}
		}
		operation := knowledgesdk.KnowledgePageNativeOperation{ID: in.ExecutionID, Target: knowledgesdk.KnowledgeNativeTargetCell, TargetID: in.RecordID, ParentID: fieldID, Action: knowledgesdk.KnowledgeNativeOperationUpsert, ExpectedHash: expectedHash, Value: value}
		if operationErr = applyMultidimensionalTableOperation(root, operation); operationErr != nil {
			return out, operationErr
		}
		encoded, marshalErr := json.Marshal(root)
		if marshalErr != nil {
			return out, conversationError("bad_request", "page_content_schema_invalid")
		}
		body, normalizeErr := s.normalizedTypedPageContent(page.ContentType, knowledgesdk.PageContentSchemaVersion, string(encoded), "")
		if normalizeErr != nil {
			return out, normalizeErr
		}
		if operationErr = s.updatePage(ctx, tx, &page, page.Revision, a); operationErr != nil {
			return out, operationErr
		}
		now, priorRevision := page.UpdatedAt, draft.DraftRevision
		draft.DraftRevision++
		draft.Body, draft.UpdatedByUserID, draft.UpdatedAt = body, a.UserID, now
		requestKey, requestErr := pageRequestKey("grid_automation", libraryID, pageID, in.ExecutionID, a)
		if requestErr != nil {
			return out, requestErr
		}
		q, args, updateErr := query.NewUpdateBuilder(s.store.Renderer(), knowledgePageDraftTable).Set("draft_revision", draft.DraftRevision).Set("updated_at", now.UnixMilli()).Set("last_request_key", requestKey).Set("last_request_hash", conversationHash(in)).Set("payload_json", conversationJSON(draft)).Where(query.And(pageScope(a, pageID), query.Equal("draft_revision", priorRevision))).Build()
		if updateErr = conversationCAS(ctx, tx, q, args, updateErr); updateErr != nil {
			return out, conversationError("conflict", "page_grid_automation_retry")
		}
		record := knowledgesdk.KnowledgePageNativeOperationRecord{Operation: operation, LibraryID: libraryID, PageID: pageID, ContentType: page.ContentType, DraftRevision: draft.DraftRevision, UserID: a.UserID, CreatedAt: now}
		q, args, insertErr := query.NewInsertBuilder(s.store.Renderer(), knowledgePageNativeOperationTable).Columns("scope_key", "page_id", "operation_id", "library_id", "content_type", "target", "target_id", "parent_id", "draft_revision", "user_id", "created_at", "request_hash", "payload_json").Values(libraryScope(a), pageID, operation.ID, libraryID, page.ContentType, operation.Target, operation.TargetID, operation.ParentID, draft.DraftRevision, a.UserID, now.UnixMilli(), conversationHash(operation), conversationJSON(record)).Build()
		if insertErr = conversationExec(ctx, tx, q, args, insertErr); insertErr != nil {
			return out, insertErr
		}
		out.View, operationErr = s.pageView(ctx, tx, library, page, true, a)
		out.AutomationID, out.RecordID, out.FieldID, out.Applied = in.AutomationID, in.RecordID, fieldID, true
		return out, operationErr
	}, &out)
	if err == nil {
		s.notifyKnowledgeCollaboration(ctx, a, libraryID, pageID)
	}
	return out, err
}

var _ knowledgesdk.PageGridAutomationService = (*Store)(nil)
