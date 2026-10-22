package product

import (
	"context"
	"fmt"
	"strconv"
	"strings"
	"time"

	auditcontract "github.com/domainry/domainry-audit-sdk/contract"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

const (
	knowledgeAuditPageObject    = "knowledge.page"
	knowledgeAuditLibraryObject = "knowledge.library"
)

type knowledgeAuditBridge struct {
	appender auditcontract.Appender
	reader   auditcontract.Reader
}

func stringMapAny(values map[string]string) map[string]any {
	if len(values) == 0 {
		return nil
	}
	result := make(map[string]any, len(values))
	for key, value := range values {
		result[key] = value
	}
	return result
}

func anyMapString(values map[string]any) map[string]string {
	if len(values) == 0 {
		return nil
	}
	result := make(map[string]string, len(values))
	for key, value := range values {
		switch item := value.(type) {
		case string:
			result[key] = item
		case float64:
			result[key] = strconv.FormatFloat(item, 'f', -1, 64)
		case bool:
			result[key] = strconv.FormatBool(item)
		default:
			result[key] = fmt.Sprint(item)
		}
	}
	return result
}

func metadataString(values map[string]any, key string) string {
	value, _ := values[key].(string)
	return strings.TrimSpace(value)
}

func metadataInt64(values map[string]any, key string) int64 {
	value := values[key]
	switch item := value.(type) {
	case float64:
		return int64(item)
	case int64:
		return item
	case string:
		result, _ := strconv.ParseInt(item, 10, 64)
		return result
	default:
		return 0
	}
}

func (bridge *knowledgeAuditBridge) AppendKnowledgeAudit(ctx context.Context, event knowledgesdk.KnowledgeGovernanceEvent) error {
	if bridge == nil || bridge.appender == nil {
		return fmt.Errorf("knowledge audit appender is unavailable")
	}
	objectKey, recordID := knowledgeAuditLibraryObject, event.LibraryID
	if event.PageID != "" {
		objectKey, recordID = knowledgeAuditPageObject, event.PageID
	}
	metadata := map[string]any{
		"action": event.Action, "library_id": event.LibraryID, "page_id": event.PageID, "version": event.Version,
		"resource_id": event.ResourceID, "client_id": event.ClientID,
	}
	_, err := bridge.appender.Append(ctx, auditcontract.AppendRequest{
		IdempotencyKey: event.ID, Family: event.Family, Event: event.Type, ObjectKey: objectKey, RecordID: recordID,
		Actor:   auditcontract.Actor{WorkspaceID: event.Actor.WorkspaceID, SubjectID: event.Actor.UserID, RoleKey: event.Actor.RoleKey},
		Summary: event.Action, Before: stringMapAny(event.Before), After: stringMapAny(event.After), Metadata: metadata,
	})
	return err
}

func (bridge *knowledgeAuditBridge) ReadKnowledgeAudit(ctx context.Context, input knowledgesdk.KnowledgeGovernanceAuditQuery, authority knowledgesdk.Authority) (knowledgesdk.KnowledgeGovernanceAuditPage, error) {
	result := knowledgesdk.KnowledgeGovernanceAuditPage{Items: []knowledgesdk.KnowledgeGovernanceEvent{}, Complete: true}
	if bridge == nil || bridge.reader == nil {
		return result, fmt.Errorf("knowledge audit reader is unavailable")
	}
	scanLimit := input.Limit + 1
	if input.Event == "" && scanLimit < 64 {
		scanLimit = 64
	}
	cursor := input.After
	matched := make([]auditcontract.Event, 0, input.Limit+1)
	for len(matched) <= input.Limit {
		events, err := bridge.reader.List(ctx, authority.WorkspaceID, auditcontract.Query{
			ObjectKey: knowledgeAuditPageObject, RecordID: input.PageID, Event: input.Event, ActorID: input.ActorID, Cursor: cursor, Limit: scanLimit,
		})
		if err != nil {
			return result, err
		}
		for _, event := range events {
			if event.Family != knowledgesdk.KnowledgeAuditEventFamily || metadataString(event.Metadata, "library_id") != input.LibraryID || metadataString(event.Metadata, "page_id") != input.PageID {
				return result, fmt.Errorf("knowledge audit event scope is invalid")
			}
			if input.Event != "" || event.Event == "knowledge.page.governance_set" || event.Event == "knowledge.page.governance_reviewed" {
				matched = append(matched, event)
				if len(matched) > input.Limit {
					break
				}
			}
		}
		if len(matched) > input.Limit || len(events) < scanLimit {
			break
		}
		cursor = auditcontract.EncodeCursor(events[len(events)-1])
	}
	if len(matched) > input.Limit {
		matched = matched[:input.Limit]
		result.Complete = false
	}
	for _, event := range matched {
		occurredAt, parseErr := time.Parse(time.RFC3339, event.CreatedAt)
		if parseErr != nil {
			return result, fmt.Errorf("parse knowledge audit event time: %w", parseErr)
		}
		result.Items = append(result.Items, knowledgesdk.KnowledgeGovernanceEvent{
			ID: event.AuditEventID, Family: event.Family, Type: event.Event, Action: metadataString(event.Metadata, "action"),
			Actor:     knowledgesdk.Authority{Known: true, RuntimeID: authority.RuntimeID, WorkspaceID: event.WorkspaceID, UserID: event.ActorID, RoleKey: event.RoleKey},
			LibraryID: input.LibraryID, PageID: input.PageID, Version: metadataInt64(event.Metadata, "version"),
			ResourceID: metadataString(event.Metadata, "resource_id"), ClientID: metadataString(event.Metadata, "client_id"),
			Before: anyMapString(event.Before), After: anyMapString(event.After), OccurredAt: occurredAt.UTC(),
		})
	}
	if !result.Complete && len(matched) > 0 {
		result.NextAfter = auditcontract.EncodeCursor(matched[len(matched)-1])
	}
	return result, nil
}

var _ knowledgesdk.KnowledgeAuditAppender = (*knowledgeAuditBridge)(nil)
var _ knowledgesdk.KnowledgeAuditReader = (*knowledgeAuditBridge)(nil)
