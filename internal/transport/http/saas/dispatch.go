package saas

import (
	"context"
	"encoding/json"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
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
