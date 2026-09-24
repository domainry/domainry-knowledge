package saas

import (
	"context"
	"encoding/json"

	agentsdk "github.com/domainry/domainry-agent-sdk"
)

func (server *Server) source(handle string) (agentsdk.ManagedKnowledgeDocumentSource, error) {
	server.sourcesMu.RLock()
	value := server.sources[handle]
	server.sourcesMu.RUnlock()
	if value == nil {
		return nil, &agentsdk.Error{Class: "not_found", Code: "knowledge.source_not_found"}
	}
	return value, nil
}

func (server *Server) dispatchSource(ctx context.Context, operation string, raw json.RawMessage) (any, error, bool) {
	switch operation {
	case "source.document.put":
		var in struct {
			Handle    string                            `json:"handle"`
			Input     agentsdk.KnowledgeDocumentContent `json:"input"`
			Authority agentsdk.ConversationAuthority    `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		source, e := server.source(in.Handle)
		if e == nil {
			e = source.PutKnowledgeDocument(ctx, in.Input, in.Authority)
		}
		return struct{}{}, e, true
	case "source.document.inspect":
		var in struct {
			Handle    string                         `json:"handle"`
			ID        string                         `json:"id"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		source, e := server.source(in.Handle)
		if e != nil {
			return nil, e, true
		}
		v, e := source.InspectKnowledgeDocument(ctx, in.ID, in.Authority)
		return v, e, true
	case "source.document.delete":
		var in struct {
			Handle    string                         `json:"handle"`
			ID        string                         `json:"id"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		source, e := server.source(in.Handle)
		if e == nil {
			e = source.DeleteKnowledgeDocument(ctx, in.ID, in.Authority)
		}
		return struct{}{}, e, true
	case "source.document.recover_delete":
		var in struct {
			Handle    string                         `json:"handle"`
			ID        string                         `json:"id"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		source, e := server.source(in.Handle)
		if e != nil {
			return nil, e, true
		}
		recovery, ok := source.(agentsdk.KnowledgeDocumentDeleteRecoverySource)
		if !ok {
			return nil, &agentsdk.Error{Class: "unavailable", Code: "knowledge.delete_recovery_unavailable"}, true
		}
		e = recovery.RecoverKnowledgeDocumentDelete(ctx, in.ID, in.Authority)
		return struct{}{}, e, true
	case "source.knowledge.search":
		var in struct {
			Handle    string                         `json:"handle"`
			Query     string                         `json:"query"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		source, e := server.source(in.Handle)
		if e != nil {
			return nil, e, true
		}
		knowledge, ok := source.(agentsdk.ConversationKnowledgeSource)
		if !ok {
			return nil, &agentsdk.Error{Class: "unavailable", Code: "knowledge.source_search_unavailable"}, true
		}
		v, e := knowledge.SearchKnowledge(ctx, in.Query, in.Authority)
		return v, e, true
	case "source.knowledge.read":
		var in struct {
			Handle    string                         `json:"handle"`
			ID        string                         `json:"id"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		source, e := server.source(in.Handle)
		if e != nil {
			return nil, e, true
		}
		knowledge, ok := source.(agentsdk.ConversationKnowledgeSource)
		if !ok {
			return nil, &agentsdk.Error{Class: "unavailable", Code: "knowledge.source_read_unavailable"}, true
		}
		v, e := knowledge.ReadKnowledge(ctx, in.ID, in.Authority)
		return v, e, true
	case "source.knowledge.revalidate":
		var in struct {
			Handle    string                               `json:"handle"`
			Input     agentsdk.ConversationKnowledgeResult `json:"input"`
			Authority agentsdk.ConversationAuthority       `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		source, e := server.source(in.Handle)
		if e != nil {
			return nil, e, true
		}
		knowledge, ok := source.(agentsdk.ConversationKnowledgeSource)
		if !ok {
			return nil, &agentsdk.Error{Class: "unavailable", Code: "knowledge.source_revalidation_unavailable"}, true
		}
		e = knowledge.RevalidateKnowledge(ctx, in.Input, in.Authority)
		return struct{}{}, e, true
	case "source.passages.search":
		var in struct {
			Handle    string                         `json:"handle"`
			Query     string                         `json:"query"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		source, e := server.source(in.Handle)
		if e != nil {
			return nil, e, true
		}
		v, e := source.SearchKnowledgeDocumentPassages(ctx, in.Query, in.Authority)
		return v, e, true
	case "source.passages.read":
		var in struct {
			Handle    string                         `json:"handle"`
			ID        string                         `json:"id"`
			Authority agentsdk.ConversationAuthority `json:"authority"`
		}
		if e := decodeInput(raw, &in); e != nil {
			return nil, e, true
		}
		source, e := server.source(in.Handle)
		if e != nil {
			return nil, e, true
		}
		v, e := source.ReadKnowledgeDocumentPassages(ctx, in.ID, in.Authority)
		return v, e, true
	}
	return nil, nil, false
}
