package provider

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"reflect"
	"strings"
	"sync"
	"testing"

	sdk "github.com/domainry/domainry-agent-sdk"
)

func TestSharedKnowledgeProviderUsesActualReaderACLAndPreservesOriginalEvidence(t *testing.T) {
	for _, operation := range []string{"search", "fetch"} {
		t.Run(operation, func(t *testing.T) {
			producer, reader := knowledgeAuthority(), knowledgeAuthority()
			producer.UserID, producer.RoleKey = "producer", "professional"
			reader.UserID, reader.RoleKey = "reader", "read_only"
			var mu sync.Mutex
			allowed := map[string]bool{producer.UserID: true, reader.UserID: true}
			requests := [][]string{}
			revokeDuringRead, changeDuringRead, changedSource, changedACL := false, false, false, false
			server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				var input struct {
					Permissions []string `json:"permission_ids"`
				}
				if json.NewDecoder(r.Body).Decode(&input) != nil {
					t.Error("invalid actual source request")
				}
				mu.Lock()
				defer mu.Unlock()
				requests = append(requests, append([]string(nil), input.Permissions...))
				if reflect.DeepEqual(input.Permissions, []string{"reader-document"}) {
					if revokeDuringRead {
						allowed[reader.UserID] = false
					}
					if changeDuringRead {
						changedACL = true
					}
				} else if !reflect.DeepEqual(input.Permissions, []string{"producer-document"}) {
					t.Errorf("source received an invented ACL: %v", input.Permissions)
				}
				body := `{"doc_id":"doc","title":"Original source","body":"金额：123.45","source_number":9007199254740993}`
				if changedSource {
					body = strings.Replace(body, "123.45", "999.99", 1)
				}
				if r.URL.Path == "/v1/kb/search" {
					io.WriteString(w, `{"hits":[`+body+`]}`)
				} else {
					io.WriteString(w, `{"err_code":0,"data":`+body+`}`)
				}
			}))
			defer server.Close()
			k, err := NewKnowledge(KnowledgeConfig{BaseURL: server.URL, APIKey: "private-key", TeamID: "team", KBID: "kb", WorkspaceID: reader.WorkspaceID, RuntimeID: reader.RuntimeID, Client: server.Client(), ResponseMapping: &KnowledgeResponseMapping{Search: &KnowledgeCitationMapping{Items: "/hits", Many: true, DocumentID: "/doc_id", Title: "/title", Excerpt: "/body"}, Fetch: &KnowledgeCitationMapping{Items: "/data", DocumentID: "/doc_id", Title: "/title", Excerpt: "/body"}},
				AuthorizeWorkspace: func(_ context.Context, a sdk.ConversationAuthority) error {
					mu.Lock()
					defer mu.Unlock()
					if !allowed[a.UserID] || a.WorkspaceID != reader.WorkspaceID || a.RuntimeID != reader.RuntimeID {
						return errors.New("current source membership denied")
					}
					return nil
				}, PermissionIDs: func(_ context.Context, a sdk.ConversationAuthority) ([]string, error) {
					mu.Lock()
					defer mu.Unlock()
					if a == producer {
						return []string{"producer-document"}, nil
					}
					if a != reader {
						return nil, errors.New("unknown exact role")
					}
					if changedACL {
						return []string{"reader-other-document"}, nil
					}
					return []string{"reader-document"}, nil
				}})
			if err != nil {
				t.Fatal(err)
			}
			var saved sdk.ConversationKnowledgeResult
			if operation == "search" {
				saved, err = k.SearchKnowledge(t.Context(), "金额", producer)
			} else {
				saved, err = k.ReadKnowledge(t.Context(), "doc", producer)
			}
			if err != nil || !bytes.Contains(saved.Data, []byte("9007199254740993")) || len(saved.Citations) != 1 {
				t.Fatal("original precise evidence missing", saved, err)
			}
			original, _ := json.Marshal(saved)
			if err := sdk.AuthorizeSharedKnowledgeResultRead(t.Context(), k, saved, reader, producer); err != nil {
				t.Fatal(err)
			}
			mu.Lock()
			actual := append([][]string(nil), requests...)
			mu.Unlock()
			if !reflect.DeepEqual(actual, [][]string{{"producer-document"}, {"producer-document"}, {"reader-document"}, {"producer-document"}}) {
				t.Fatalf("actual reader/source boundaries: %v", actual)
			}
			if err := sdk.AuthorizeKnowledgeResultRead(t.Context(), k, saved, reader); err == nil {
				t.Fatal("ordinary read accepted foreign producer scope")
			}
			if operation == "fetch" {
				passages, err := sdk.SharedKnowledgeExtractionPassages(t.Context(), k, saved, reader, producer)
				if err != nil || len(passages) != 1 || passages[0].DocumentID != "doc" || passages[0].Content != "金额：123.45" {
					t.Fatal("original extraction source changed", passages, err)
				}
			}
			after, _ := json.Marshal(saved)
			if !bytes.Equal(original, after) {
				t.Fatal("shared reading rewrote original scope, data or citations")
			}
			for _, user := range []string{reader.UserID, producer.UserID} {
				t.Run(user+"_revoked_before_IO", func(t *testing.T) {
					mu.Lock()
					allowed[user] = false
					before := len(requests)
					mu.Unlock()
					if err := sdk.AuthorizeSharedKnowledgeResultRead(t.Context(), k, saved, reader, producer); err == nil {
						t.Fatal("revoked source returned evidence")
					}
					mu.Lock()
					count := len(requests)
					allowed[user] = true
					mu.Unlock()
					if count != before {
						t.Fatal("revoked identity reached source IO")
					}
				})
			}
			for _, change := range []bool{false, true} {
				t.Run(map[bool]string{false: "reader_revoked_during_IO", true: "reader_ACL_changed_during_IO"}[change], func(t *testing.T) {
					mu.Lock()
					revokeDuringRead, changeDuringRead = !change, change
					mu.Unlock()
					if err := sdk.AuthorizeSharedKnowledgeResultRead(t.Context(), k, saved, reader, producer); err == nil {
						t.Fatal("in-flight read survived current reader policy change")
					}
					mu.Lock()
					revokeDuringRead, changeDuringRead, changedACL = false, false, false
					allowed[reader.UserID] = true
					mu.Unlock()
				})
			}
			mu.Lock()
			changedSource = true
			mu.Unlock()
			if err := sdk.AuthorizeSharedKnowledgeResultRead(t.Context(), k, saved, reader, producer); err == nil {
				t.Fatal("changed complete source accepted")
			}
			mu.Lock()
			changedSource = false
			mu.Unlock()
			for _, mutate := range []func(*sdk.ConversationKnowledgeResult){
				func(v *sdk.ConversationKnowledgeResult) { v.ScopeSHA256 = k.knowledgeScope(reader) },
				func(v *sdk.ConversationKnowledgeResult) { v.ConversationID = "private" },
				func(v *sdk.ConversationKnowledgeResult) { v.Citations[0].ConversationID = "private" },
				func(v *sdk.ConversationKnowledgeResult) { v.Citations[0].ID = "invented-citation" },
			} {
				var forged sdk.ConversationKnowledgeResult
				_ = json.Unmarshal(original, &forged)
				mutate(&forged)
				if err := sdk.AuthorizeSharedKnowledgeResultRead(t.Context(), k, forged, reader, producer); err == nil {
					t.Fatal("forged original source accepted")
				}
			}
		})
	}
}
