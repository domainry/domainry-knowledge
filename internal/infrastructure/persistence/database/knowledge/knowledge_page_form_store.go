package store

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"math"
	"net/mail"
	"net/url"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/domainry/domainry-foundation/entityid"
	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-orm/query"
)

const (
	knowledgeFormMaximumAnswerBytes = 256 << 10
	knowledgeFormMaximumResponses   = 100000
	knowledgeFormMaximumExport      = 10000
)

func validKnowledgeFormSubmissionID(value string) bool {
	return entityid.Validate("kformsub", value) == nil
}

func formSubmissionScope(a agentsdk.Authority, pageID string) query.Predicate {
	return query.And(query.Equal("scope_key", libraryScope(a)), query.Equal("page_id", pageID))
}

func decodeFormCanonical(content string) (knowledgesdk.KnowledgeFormContent, map[string]map[string]any, error) {
	var value knowledgesdk.KnowledgeFormContent
	if err := validateKnowledgeFormContent(content); err != nil {
		return value, nil, err
	}
	if err := json.Unmarshal([]byte(content), &value); err != nil {
		return value, nil, conversationError("bad_request", "page_form_schema_invalid")
	}
	root, err := decodeKnowledgeFormContent(content)
	if err != nil {
		return value, nil, err
	}
	components := make(map[string]map[string]any, len(value.Components))
	for _, raw := range root["components"].([]any) {
		component := raw.(map[string]any)
		components[component["key"].(string)] = component
	}
	return value, components, nil
}

func decodeFormAnswer(raw json.RawMessage) (any, error) {
	if len(raw) == 0 || len(raw) > knowledgeFormMaximumAnswerBytes {
		return nil, conversationError("bad_request", "page_form_answer_invalid")
	}
	decoder := json.NewDecoder(bytes.NewReader(raw))
	decoder.UseNumber()
	var value any
	if err := decoder.Decode(&value); err != nil {
		return nil, conversationError("bad_request", "page_form_answer_invalid")
	}
	if err := decoder.Decode(&struct{}{}); err != io.EOF {
		return nil, conversationError("bad_request", "page_form_answer_invalid")
	}
	return value, nil
}

func formConditionEqual(expected, actual any) bool {
	left, leftErr := json.Marshal(expected)
	right, rightErr := json.Marshal(actual)
	return leftErr == nil && rightErr == nil && bytes.Equal(left, right)
}

func formComponentVisible(component map[string]any, answers map[string]any) bool {
	condition, ok := component["conditional"].(map[string]any)
	if !ok {
		return true
	}
	when, _ := condition["when"].(string)
	show, _ := condition["show"].(bool)
	equal := formConditionEqual(condition["eq"], answers[when])
	return equal == show
}

func formComponentOptions(component map[string]any) map[string]string {
	values, _ := component["values"].([]any)
	if data, ok := component["data"].(map[string]any); ok {
		values, _ = data["values"].([]any)
	}
	result := make(map[string]string, len(values))
	for _, raw := range values {
		option, _ := raw.(map[string]any)
		value, _ := option["value"].(string)
		label, _ := option["label"].(string)
		result[value] = label
	}
	return result
}

func formAnswerEmpty(componentType string, value any) bool {
	switch typed := value.(type) {
	case nil:
		return true
	case string:
		return strings.TrimSpace(typed) == ""
	case []any:
		return len(typed) == 0
	case map[string]any:
		for _, selected := range typed {
			if active, ok := selected.(bool); ok && active {
				return false
			}
		}
		return true
	case bool:
		return componentType == "checkbox" && !typed
	default:
		return false
	}
}

func validateFormAnswer(component map[string]any, value any) bool {
	componentType, _ := component["type"].(string)
	validation, _ := component["validate"].(map[string]any)
	switch componentType {
	case "textfield", "textarea", "email", "url", "phoneNumber":
		text, ok := value.(string)
		if !ok || !executionText(text, 32768, false) {
			return false
		}
		minimum, maximum := 0, 32768
		if raw, found := validation["minLength"]; found {
			minimum, _ = formInteger(raw, 0, 32768)
		}
		if raw, found := validation["maxLength"]; found {
			maximum, _ = formInteger(raw, 1, 32768)
		}
		length := len([]rune(text))
		if length < minimum || length > maximum {
			return false
		}
		if componentType == "email" && text != "" {
			address, err := mail.ParseAddress(text)
			if err != nil || address.Address != text || strings.ContainsAny(text, "\r\n") {
				return false
			}
		}
		if componentType == "url" && text != "" {
			parsed, err := url.ParseRequestURI(text)
			if err != nil || parsed.Scheme != "http" && parsed.Scheme != "https" || parsed.Hostname() == "" || parsed.User != nil {
				return false
			}
		}
		if componentType == "phoneNumber" && text != "" {
			digits := 0
			for _, character := range text {
				if character >= '0' && character <= '9' {
					digits++
					continue
				}
				if character != '+' && character != '-' && character != ' ' && character != '(' && character != ')' {
					return false
				}
			}
			if digits < 5 || digits > 20 {
				return false
			}
		}
		return true
	case "number", "currency", "rating", "scale":
		number, ok := value.(json.Number)
		if !ok {
			return false
		}
		parsed, err := number.Float64()
		if err != nil || math.IsNaN(parsed) || math.IsInf(parsed, 0) {
			return false
		}
		if (componentType == "rating" || componentType == "scale") && parsed != math.Trunc(parsed) {
			return false
		}
		if raw, found := validation["min"]; found {
			minimum, _ := formFiniteNumber(raw)
			if parsed < minimum {
				return false
			}
		}
		if raw, found := validation["max"]; found {
			maximum, _ := formFiniteNumber(raw)
			if parsed > maximum {
				return false
			}
		}
		return true
	case "radio", "select":
		if componentType == "select" {
			if multiple, _ := component["multiple"].(bool); multiple {
				values, ok := value.([]any)
				if !ok || len(values) > 100 {
					return false
				}
				options := formComponentOptions(component)
				seen := map[string]bool{}
				for _, raw := range values {
					selected, valid := raw.(string)
					if !valid || options[selected] == "" || seen[selected] {
						return false
					}
					seen[selected] = true
				}
				return true
			}
		}
		selected, ok := value.(string)
		return ok && (selected == "" || formComponentOptions(component)[selected] != "")
	case "selectboxes":
		selected, ok := value.(map[string]any)
		if !ok || len(selected) > 100 {
			return false
		}
		options := formComponentOptions(component)
		for key, raw := range selected {
			if options[key] == "" {
				return false
			}
			if _, valid := raw.(bool); !valid {
				return false
			}
		}
		return true
	case "checkbox":
		_, ok := value.(bool)
		return ok
	case "datetime":
		text, ok := value.(string)
		if !ok || text == "" {
			return ok
		}
		_, err := time.Parse(time.RFC3339, text)
		return err == nil
	case "file":
		files, ok := value.([]any)
		maximum, valid := formInteger(component["maxFiles"], 1, 20)
		if !ok || !valid || len(files) > maximum {
			return false
		}
		seen := map[string]bool{}
		for _, raw := range files {
			file, valid := raw.(map[string]any)
			if !valid || len(file) != 2 || !formExactKeys(file, map[string]bool{"document_id": true, "title": true}) {
				return false
			}
			documentID, idOK := file["document_id"].(string)
			title, titleOK := file["title"].(string)
			if !idOK || !validKnowledgeDocumentID(documentID) || seen[documentID] || !titleOK || !executionText(title, 512, true) {
				return false
			}
			seen[documentID] = true
		}
		return true
	default:
		return false
	}
}

func normalizeFormAnswers(components map[string]map[string]any, input map[string]json.RawMessage) (map[string]json.RawMessage, error) {
	if input == nil || len(input) > len(components) {
		return nil, conversationError("bad_request", "page_form_answers_invalid")
	}
	decoded := make(map[string]any, len(input))
	for key, raw := range input {
		if components[key] == nil {
			return nil, conversationError("bad_request", "page_form_answer_unknown")
		}
		value, err := decodeFormAnswer(raw)
		if err != nil {
			return nil, err
		}
		decoded[key] = value
	}
	result := make(map[string]json.RawMessage, len(input))
	for key, component := range components {
		value, supplied := decoded[key]
		visible := formComponentVisible(component, decoded)
		if !visible {
			if supplied && !formAnswerEmpty(component["type"].(string), value) {
				return nil, conversationError("bad_request", "page_form_answer_hidden")
			}
			continue
		}
		validation := component["validate"].(map[string]any)
		required, _ := validation["required"].(bool)
		if !supplied || formAnswerEmpty(component["type"].(string), value) {
			if required {
				return nil, conversationError("bad_request", "page_form_answer_required")
			}
			continue
		}
		if !validateFormAnswer(component, value) {
			return nil, conversationError("bad_request", "page_form_answer_invalid")
		}
		encoded, err := json.Marshal(value)
		if err != nil {
			return nil, conversationError("bad_request", "page_form_answer_invalid")
		}
		result[key] = encoded
	}
	encoded, err := json.Marshal(result)
	if err != nil || len(encoded) > knowledgeFormMaximumAnswerBytes {
		return nil, conversationError("bad_request", "page_form_answers_too_large")
	}
	return result, nil
}

func requireFormManager(ctx context.Context, s *Store, tx *sql.Tx, libraryID, pageID string, a agentsdk.Authority) (knowledgesdk.KnowledgePage, error) {
	page, err := s.pageRecord(ctx, tx, libraryID, pageID, a)
	if err != nil {
		return page, err
	}
	effective, err := s.evaluateKnowledgePageAccess(ctx, tx, libraryID, pageID, a)
	if err != nil || !effective.Allowed || roleLevel(effective.Role) < roleLevel("manager") {
		return page, conversationError("not_found", "page_not_found")
	}
	if page.ContentType != knowledgesdk.KnowledgePageTypeForm {
		return page, conversationError("conflict", "page_form_required")
	}
	return page, nil
}

func (s *Store) SubmitKnowledgePageForm(ctx context.Context, libraryID, pageID string, in knowledgesdk.KnowledgeFormSubmit, a agentsdk.Authority) (out knowledgesdk.KnowledgeFormSubmission, err error) {
	err = s.mutateKnowledgeOperation(ctx, "knowledge.page_form.submit", knowledgesdk.ActionPageFormSubmit, libraryID+":"+pageID+":"+a.UserID, in.ClientID, in, a, func(tx *sql.Tx) (any, error) {
		library, failure := s.libraryRecord(ctx, tx, libraryID, a)
		if failure != nil || library.Archived {
			return out, failure
		}
		page, failure := s.pageRecord(ctx, tx, libraryID, pageID, a)
		if failure != nil {
			return out, failure
		}
		if page.State != "active" || page.ContentType != knowledgesdk.KnowledgePageTypeForm || page.PublishedVersion < 1 {
			return out, conversationError("conflict", "page_form_unavailable")
		}
		effective, failure := s.evaluateKnowledgePageAccess(ctx, tx, libraryID, pageID, a)
		if failure != nil || !effective.Allowed {
			return out, conversationError("not_found", "page_not_found")
		}
		version, failure := s.pageVersion(ctx, tx, pageID, page.PublishedVersion, a)
		if failure != nil {
			return out, failure
		}
		form, components, failure := decodeFormCanonical(version.Body.Content)
		if failure != nil {
			return out, failure
		}
		if roleLevel(effective.Role) < roleLevel(form.Settings.SubmissionRole) {
			return out, conversationError("forbidden", "page_form_submit_denied")
		}
		now := time.Now().UTC().Truncate(time.Millisecond)
		if form.Settings.OpensAt != "" {
			opensAt, _ := time.Parse(time.RFC3339, form.Settings.OpensAt)
			if now.Before(opensAt) {
				return out, conversationError("conflict", "page_form_not_open")
			}
		}
		if form.Settings.ClosesAt != "" {
			closesAt, _ := time.Parse(time.RFC3339, form.Settings.ClosesAt)
			if !now.Before(closesAt) {
				return out, conversationError("conflict", "page_form_closed")
			}
		}
		answers, failure := normalizeFormAnswers(components, in.Answers)
		if failure != nil {
			return out, failure
		}
		predicate := formSubmissionScope(a, pageID)
		if !form.Settings.AllowMultipleSubmissions {
			statement, args, buildErr := query.NewSelectBuilder(s.store.Renderer(), knowledgePageFormSubmissionTable).Projections(query.Project(query.CountAll())).Where(query.And(predicate, query.Equal("submitted_by_user_id", a.UserID))).Build()
			if buildErr != nil {
				return out, buildErr
			}
			var count int
			if failure = tx.QueryRowContext(ctx, statement, args...).Scan(&count); failure != nil {
				return out, failure
			}
			if count > 0 {
				return out, conversationError("conflict", "page_form_duplicate_submission")
			}
		}
		statement, args, buildErr := query.NewSelectBuilder(s.store.Renderer(), knowledgePageFormSubmissionTable).Projections(query.Project(query.CountAll())).Where(predicate).Build()
		if buildErr != nil {
			return out, buildErr
		}
		var count int
		if failure = tx.QueryRowContext(ctx, statement, args...).Scan(&count); failure != nil {
			return out, failure
		}
		if count >= knowledgeFormMaximumResponses {
			return out, conversationError("conflict", "page_form_submission_limit")
		}
		id, failure := randomKnowledgeID("kformsub_")
		if failure != nil {
			return out, failure
		}
		out = knowledgesdk.KnowledgeFormSubmission{ID: id, LibraryID: libraryID, PageID: pageID, PublishedVersion: version.Version, ContentSHA256: version.Body.ContentSHA256, Answers: answers, SubmittedByUserID: a.UserID, SubmittedAt: now}
		statement, args, buildErr = query.NewInsertBuilder(s.store.Renderer(), knowledgePageFormSubmissionTable).Columns("scope_key", "submission_id", "library_id", "page_id", "published_version", "content_sha256", "submitted_by_user_id", "submitted_at", "payload_json").Values(libraryScope(a), id, libraryID, pageID, version.Version, version.Body.ContentSHA256, a.UserID, now.UnixMilli(), conversationJSON(out)).Build()
		if failure = conversationExec(ctx, tx, statement, args, buildErr); failure != nil {
			return out, failure
		}
		return out, nil
	}, &out)
	return
}

func parseFormSubmissionCursor(value string) (int64, string, error) {
	if value == "" {
		return 0, "", nil
	}
	parts := strings.SplitN(value, ":", 2)
	if len(parts) != 2 || !validKnowledgeFormSubmissionID(parts[1]) {
		return 0, "", conversationError("bad_request", "page_form_cursor_invalid")
	}
	millis, err := strconv.ParseInt(parts[0], 10, 64)
	if err != nil || millis < 1 {
		return 0, "", conversationError("bad_request", "page_form_cursor_invalid")
	}
	return millis, parts[1], nil
}

func scanFormSubmissions(rows *sql.Rows) ([]knowledgesdk.KnowledgeFormSubmission, error) {
	defer rows.Close()
	items := []knowledgesdk.KnowledgeFormSubmission{}
	for rows.Next() {
		var raw []byte
		if err := rows.Scan(&raw); err != nil {
			return nil, err
		}
		var item knowledgesdk.KnowledgeFormSubmission
		if err := unmarshalDurableJSON(raw, &item); err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	return items, rows.Err()
}

func (s *Store) KnowledgePageFormSubmissions(ctx context.Context, libraryID, pageID, before string, limit int, a agentsdk.Authority) (out knowledgesdk.KnowledgeFormSubmissionPage, err error) {
	if limit < 1 || limit > 100 {
		return out, conversationError("bad_request", "page_form_limit_invalid")
	}
	millis, cursorID, err := parseFormSubmissionCursor(before)
	if err != nil {
		return out, err
	}
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		if _, failure := requireFormManager(ctx, s, tx, libraryID, pageID, a); failure != nil {
			return failure
		}
		predicate := formSubmissionScope(a, pageID)
		if millis > 0 {
			predicate = query.And(predicate, query.Or(query.LessThan("submitted_at", millis), query.And(query.Equal("submitted_at", millis), query.LessThan("submission_id", cursorID))))
		}
		statement, args, failure := query.NewSelectBuilder(s.store.Renderer(), knowledgePageFormSubmissionTable).Columns("payload_json").Where(predicate).OrderBy(query.Descending("submitted_at"), query.Descending("submission_id")).Limit(limit + 1).Build()
		if failure != nil {
			return failure
		}
		rows, failure := tx.QueryContext(ctx, statement, args...)
		if failure != nil {
			return failure
		}
		items, failure := scanFormSubmissions(rows)
		if failure != nil {
			return failure
		}
		out.Complete = len(items) <= limit
		if len(items) > limit {
			items = items[:limit]
		}
		out.Items = items
		if !out.Complete && len(items) > 0 {
			last := items[len(items)-1]
			out.NextBefore = fmt.Sprintf("%d:%s", last.SubmittedAt.UnixMilli(), last.ID)
		}
		return nil
	})
	return
}

func allFormSubmissions(ctx context.Context, s *Store, tx *sql.Tx, pageID string, version int64, maximum int, a agentsdk.Authority) ([]knowledgesdk.KnowledgeFormSubmission, error) {
	predicate := formSubmissionScope(a, pageID)
	if version > 0 {
		predicate = query.And(predicate, query.Equal("published_version", version))
	}
	statement, args, err := query.NewSelectBuilder(s.store.Renderer(), knowledgePageFormSubmissionTable).Columns("payload_json").Where(predicate).OrderBy(query.Descending("submitted_at"), query.Descending("submission_id")).Limit(maximum + 1).Build()
	if err != nil {
		return nil, err
	}
	rows, err := tx.QueryContext(ctx, statement, args...)
	if err != nil {
		return nil, err
	}
	items, err := scanFormSubmissions(rows)
	if err != nil {
		return nil, err
	}
	if len(items) > maximum {
		return nil, conversationError("conflict", "page_form_export_limit")
	}
	return items, nil
}

func formAnswerValue(raw json.RawMessage) any {
	value, _ := decodeFormAnswer(raw)
	return value
}

func (s *Store) KnowledgePageFormAnalytics(ctx context.Context, libraryID, pageID string, a agentsdk.Authority) (out knowledgesdk.KnowledgeFormAnalytics, err error) {
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		page, failure := requireFormManager(ctx, s, tx, libraryID, pageID, a)
		if failure != nil {
			return failure
		}
		if page.PublishedVersion < 1 {
			return conversationError("conflict", "page_form_unpublished")
		}
		version, failure := s.pageVersion(ctx, tx, pageID, page.PublishedVersion, a)
		if failure != nil {
			return failure
		}
		form, _, failure := decodeFormCanonical(version.Body.Content)
		if failure != nil {
			return failure
		}
		items, failure := allFormSubmissions(ctx, s, tx, pageID, page.PublishedVersion, knowledgeFormMaximumExport, a)
		if failure != nil {
			return failure
		}
		out = knowledgesdk.KnowledgeFormAnalytics{PublishedVersion: page.PublishedVersion, TotalSubmissions: int64(len(items)), Questions: make([]knowledgesdk.KnowledgeFormQuestionAnalytics, 0, len(form.Components))}
		for _, component := range form.Components {
			question := knowledgesdk.KnowledgeFormQuestionAnalytics{Key: component.Key, Label: component.Label, Type: component.Type, ChoiceCounts: []knowledgesdk.KnowledgeFormChoiceCount{}}
			options := component.Values
			if component.Data != nil {
				options = component.Data.Values
			}
			counts := map[string]int64{}
			numbers := []float64{}
			for _, item := range items {
				raw, ok := item.Answers[component.Key]
				if !ok {
					question.Skipped++
					continue
				}
				question.Answered++
				value := formAnswerValue(raw)
				switch typed := value.(type) {
				case string:
					counts[typed]++
				case json.Number:
					if number, failure := typed.Float64(); failure == nil {
						numbers = append(numbers, number)
					}
				case []any:
					for _, child := range typed {
						if selected, valid := child.(string); valid {
							counts[selected]++
						}
					}
				case map[string]any:
					for selected, rawFlag := range typed {
						if flag, valid := rawFlag.(bool); valid && flag {
							counts[selected]++
						}
					}
				}
			}
			for _, option := range options {
				question.ChoiceCounts = append(question.ChoiceCounts, knowledgesdk.KnowledgeFormChoiceCount{Value: option.Value, Label: option.Label, Count: counts[option.Value]})
			}
			if len(numbers) > 0 {
				minimum, maximum, total := numbers[0], numbers[0], 0.0
				for _, number := range numbers {
					minimum = math.Min(minimum, number)
					maximum = math.Max(maximum, number)
					total += number
				}
				average := total / float64(len(numbers))
				question.NumberMin, question.NumberMax, question.NumberAverage = &minimum, &maximum, &average
			}
			out.Questions = append(out.Questions, question)
		}
		return nil
	})
	return
}

func csvSafe(value string) string {
	if value != "" && strings.ContainsRune("=+-@", rune(value[0])) {
		return "'" + value
	}
	return value
}

func formCSVValue(raw json.RawMessage, component *knowledgesdk.KnowledgeFormComponent) string {
	value := formAnswerValue(raw)
	labels := map[string]string{}
	if component != nil {
		options := component.Values
		if component.Data != nil {
			options = component.Data.Values
		}
		for _, option := range options {
			labels[option.Value] = option.Label
		}
	}
	switch typed := value.(type) {
	case string:
		if labels[typed] != "" {
			return labels[typed]
		}
		return typed
	case json.Number:
		return string(typed)
	case bool:
		if typed {
			return "是"
		}
		return "否"
	case []any:
		values := make([]string, 0, len(typed))
		for _, rawValue := range typed {
			if child, ok := rawValue.(string); ok {
				if labels[child] != "" {
					child = labels[child]
				}
				values = append(values, child)
			} else if file, ok := rawValue.(map[string]any); ok {
				if title, valid := file["title"].(string); valid {
					values = append(values, title)
				}
			}
		}
		return strings.Join(values, "；")
	case map[string]any:
		values := []string{}
		for key, rawFlag := range typed {
			if flag, ok := rawFlag.(bool); ok && flag {
				if labels[key] != "" {
					key = labels[key]
				}
				values = append(values, key)
			}
		}
		sort.Strings(values)
		return strings.Join(values, "；")
	default:
		return ""
	}
}

func (s *Store) ExportKnowledgePageFormSubmissions(ctx context.Context, libraryID, pageID string, a agentsdk.Authority) (out knowledgesdk.KnowledgeFormExport, err error) {
	err = s.transaction(ctx, func(tx *sql.Tx) error {
		page, failure := requireFormManager(ctx, s, tx, libraryID, pageID, a)
		if failure != nil {
			return failure
		}
		if page.PublishedVersion < 1 {
			return conversationError("conflict", "page_form_unpublished")
		}
		version, failure := s.pageVersion(ctx, tx, pageID, page.PublishedVersion, a)
		if failure != nil {
			return failure
		}
		form, _, failure := decodeFormCanonical(version.Body.Content)
		if failure != nil {
			return failure
		}
		items, failure := allFormSubmissions(ctx, s, tx, pageID, 0, knowledgeFormMaximumExport, a)
		if failure != nil {
			return failure
		}
		componentByKey := make(map[string]*knowledgesdk.KnowledgeFormComponent, len(form.Components))
		keys := make([]string, 0, len(form.Components))
		labels := make(map[string]string, len(form.Components))
		for index := range form.Components {
			component := &form.Components[index]
			componentByKey[component.Key] = component
			keys = append(keys, component.Key)
			labels[component.Key] = component.Label
		}
		legacy := map[string]bool{}
		for _, item := range items {
			for key := range item.Answers {
				if labels[key] == "" {
					legacy[key] = true
				}
			}
		}
		legacyKeys := make([]string, 0, len(legacy))
		for key := range legacy {
			legacyKeys = append(legacyKeys, key)
		}
		sort.Strings(legacyKeys)
		keys = append(keys, legacyKeys...)
		var buffer bytes.Buffer
		buffer.WriteString("\xEF\xBB\xBF")
		writer := csv.NewWriter(&buffer)
		header := []string{"答卷 ID", "发布版本", "提交人", "提交时间"}
		for _, key := range keys {
			label := labels[key]
			if label == "" {
				label = "历史问题 " + key
			}
			header = append(header, csvSafe(label))
		}
		if failure = writer.Write(header); failure != nil {
			return failure
		}
		for _, item := range items {
			row := []string{item.ID, strconv.FormatInt(item.PublishedVersion, 10), csvSafe(item.SubmittedByUserID), item.SubmittedAt.Format(time.RFC3339)}
			for _, key := range keys {
				row = append(row, csvSafe(formCSVValue(item.Answers[key], componentByKey[key])))
			}
			if failure = writer.Write(row); failure != nil {
				return failure
			}
		}
		writer.Flush()
		if failure = writer.Error(); failure != nil {
			return failure
		}
		out = knowledgesdk.KnowledgeFormExport{Filename: "问卷答卷.csv", ContentType: "text/csv; charset=utf-8", Body: buffer.String()}
		return nil
	})
	return
}
