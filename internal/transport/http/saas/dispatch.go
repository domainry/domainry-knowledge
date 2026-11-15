package saas

import (
	"context"
	"encoding/json"
	"strings"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgecontract "github.com/domainry/domainry-knowledge-sdk/contract"
	knowledgefiles "github.com/domainry/domainry-knowledge-sdk/files"
)

func (server *Server) dispatch(ctx context.Context, operation string, raw json.RawMessage) (any, error) {
	switch operation {
	case "files.upload":
		var input struct {
			Authority knowledgefiles.Authority `json:"authority"`
			Input     knowledgefiles.Upload    `json:"input"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err
		}
		return server.dependencies.Files.Upload(ctx, input.Authority, input.Input)
	case "files.get":
		var input struct {
			Authority knowledgefiles.Authority `json:"authority"`
			ID        string                   `json:"id"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err
		}
		return server.dependencies.Files.Get(ctx, input.Authority, input.ID)
	case "files.download":
		var input struct {
			Authority knowledgefiles.Authority `json:"authority"`
			ID        string                   `json:"id"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err
		}
		return server.dependencies.Files.Download(ctx, input.Authority, input.ID)
	case "files.bind":
		var input struct {
			Authority knowledgefiles.Authority `json:"authority"`
			ID        string                   `json:"id"`
			Binding   knowledgefiles.Binding   `json:"binding"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err
		}
		return struct{}{}, server.dependencies.Files.Bind(ctx, input.Authority, input.ID, input.Binding)
	case "files.delete":
		var input struct {
			Authority knowledgefiles.Authority `json:"authority"`
			ID        string                   `json:"id"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err
		}
		return struct{}{}, server.dependencies.Files.Delete(ctx, input.Authority, input.ID)
	case "runtime.activate":
		return struct{}{}, nil
	case knowledgecontract.SaaSLibrarySearchOperation:
		var input knowledgecontract.SaaSLibrarySearchRequest
		if err := decodeInput(raw, &input); err != nil {
			return nil, err
		}
		if err := server.validateLibraryAuthority(input.LibraryID, input.Authority); err != nil {
			return nil, err
		}
		source, ok := server.dependencies.Retrieval.(knowledgecontract.LibraryKnowledge)
		if !ok || source == nil {
			return nil, &knowledgesdk.Error{Class: "unavailable", Code: "knowledge.library_retrieval_unavailable"}
		}
		return source.SearchLibraryKnowledge(ctx, input.LibraryID, input.Query, input.Authority)
	case knowledgecontract.SaaSLibraryReadOperation:
		var input knowledgecontract.SaaSLibraryReadRequest
		if err := decodeInput(raw, &input); err != nil {
			return nil, err
		}
		if err := server.validateLibraryAuthority(input.LibraryID, input.Authority); err != nil {
			return nil, err
		}
		source, ok := server.dependencies.Retrieval.(knowledgecontract.LibraryKnowledge)
		if !ok || source == nil {
			return nil, &knowledgesdk.Error{Class: "unavailable", Code: "knowledge.library_retrieval_unavailable"}
		}
		return source.ReadLibraryKnowledge(ctx, input.LibraryID, input.DocumentID, input.Authority)
	case "runtime.knowledge.search":
		var input struct {
			Query     string                 `json:"query"`
			Authority knowledgesdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err
		}
		if server.dependencies.Retrieval == nil {
			return nil, &knowledgesdk.Error{Class: "unavailable", Code: "knowledge.search_unavailable"}
		}
		return server.dependencies.Retrieval.SearchKnowledge(ctx, input.Query, input.Authority)
	case "runtime.knowledge.read":
		var input struct {
			ID        string                 `json:"id"`
			Authority knowledgesdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err
		}
		if server.dependencies.Retrieval == nil {
			return nil, &knowledgesdk.Error{Class: "unavailable", Code: "knowledge.read_unavailable"}
		}
		return server.dependencies.Retrieval.ReadKnowledge(ctx, input.ID, input.Authority)
	case "runtime.knowledge.revalidate":
		var input struct {
			Input     knowledgesdk.Result    `json:"input"`
			Authority knowledgesdk.Authority `json:"authority"`
		}
		if err := decodeInput(raw, &input); err != nil {
			return nil, err
		}
		if server.dependencies.Retrieval == nil {
			return nil, &knowledgesdk.Error{Class: "unavailable", Code: "knowledge.revalidation_unavailable"}
		}
		return struct{}{}, server.dependencies.Retrieval.RevalidateKnowledge(ctx, input.Input, input.Authority)
	default:
		return server.dispatchExtended(ctx, operation, raw)
	}
}

func (server *Server) validateLibraryAuthority(library string, authority knowledgesdk.Authority) error {
	if library == "" || library != strings.TrimSpace(library) || len(library) > 256 {
		return &knowledgesdk.Error{Class: "bad_request", Code: "knowledge.library_required"}
	}
	if !authority.Known || authority.RuntimeID != server.dependencies.Audience || authority.WorkspaceID == "" || authority.WorkspaceID != strings.TrimSpace(authority.WorkspaceID) || authority.UserID == "" || authority.UserID != strings.TrimSpace(authority.UserID) {
		return &knowledgesdk.Error{Class: "forbidden", Code: "knowledge.library_identity_denied"}
	}
	return nil
}
