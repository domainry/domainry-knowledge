package saas

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"errors"
	"io"
	"mime"
	"mime/multipart"
	"net/http"
	"strings"
	"time"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	"github.com/domainry/domainry-foundation/telemetry"
	knowledgecontract "github.com/domainry/domainry-knowledge-sdk/contract"
)

const streamMetadataLimit = 256 << 10
const documentTransferTimeout = 2 * time.Hour

func (server *Server) uploadDocument(writer http.ResponseWriter, request *http.Request) {
	_ = http.NewResponseController(writer).SetReadDeadline(time.Now().Add(documentTransferTimeout))
	var metadata struct {
		Operation string                                  `json:"operation"`
		Library   string                                  `json:"library"`
		Input     json.RawMessage                         `json:"input"`
		Source    *agentsdk.KnowledgeDocumentSourceAccess `json:"source,omitempty"`
		Authority agentsdk.ConversationAuthority          `json:"authority"`
		Grants    []knowledgecontract.SaaSGrant           `json:"grants,omitempty"`
	}
	multipartReader, content, err := readStreamRequest(writer, request, &metadata)
	if err != nil {
		writeTransferError(writer, err)
		return
	}
	if metadata.Operation != knowledgecontract.SaaSDocumentUploadOperation && metadata.Operation != knowledgecontract.SaaSDocumentUploadSourceOperation && metadata.Operation != knowledgecontract.SaaSDocumentUploadChunkOperation {
		writeStatus(writer, http.StatusBadRequest, "bad_request", "knowledge.document_upload_operation_invalid")
		return
	}
	if (metadata.Operation == knowledgecontract.SaaSDocumentUploadSourceOperation) != (metadata.Source != nil) || metadata.Operation == knowledgecontract.SaaSDocumentUploadChunkOperation && metadata.Source != nil {
		writeStatus(writer, http.StatusBadRequest, "bad_request", "knowledge.document_source_invalid")
		return
	}
	if len(metadata.Grants) > 12 {
		writeStatus(writer, http.StatusBadRequest, "bad_request", "knowledge.document_content_invalid")
		return
	}
	ctx := withGrants(request.Context(), knowledgecontract.SaaSDocumentUploadPrepareOperation, server.secret, metadata.Grants)
	if metadata.Operation == knowledgecontract.SaaSDocumentUploadChunkOperation {
		var input agentsdk.KnowledgeDocumentUploadChunk
		if !decodeStreamInput(metadata.Input, &input) || input.ChunkBytes < 1 || input.ChunkBytes > agentsdk.KnowledgeDocumentUploadChunkBytes || input.Content != nil {
			writeStatus(writer, http.StatusBadRequest, "bad_request", "knowledge.document_content_invalid")
			return
		}
		limited := &io.LimitedReader{R: content, N: input.ChunkBytes + 1}
		input.Content = limited
		progress, uploadErr := server.dependencies.Knowledge.UploadKnowledgeDocumentChunk(ctx, metadata.Library, input, metadata.Authority)
		if uploadErr != nil {
			writeTransferError(writer, uploadErr)
			return
		}
		if uploadErr = finishStreamRequest(multipartReader, limited); uploadErr != nil {
			writeTransferError(writer, uploadErr)
			return
		}
		writeTransferResult(writer, progress)
		return
	}
	var input agentsdk.KnowledgeDocumentUpload
	if !decodeStreamInput(metadata.Input, &input) || input.Bytes < 1 || input.Bytes > agentsdk.KnowledgeDocumentMaximumBytes || input.Content != nil {
		writeStatus(writer, http.StatusBadRequest, "bad_request", "knowledge.document_content_invalid")
		return
	}
	limited := &io.LimitedReader{R: content, N: input.Bytes + 1}
	input.Content = limited
	var document agentsdk.KnowledgeDocument
	if metadata.Source == nil {
		document, err = server.dependencies.Knowledge.UploadKnowledgeDocument(ctx, metadata.Library, input, metadata.Authority)
	} else {
		document, err = server.dependencies.Knowledge.UploadKnowledgeDocumentForSource(ctx, metadata.Library, input, *metadata.Source, metadata.Authority)
	}
	if err != nil {
		writeTransferError(writer, err)
		return
	}
	if err = finishStreamRequest(multipartReader, limited); err != nil {
		writeTransferError(writer, err)
		return
	}
	writeTransferResult(writer, document)
}

func decodeStreamInput(raw json.RawMessage, output any) bool {
	decoder := json.NewDecoder(bytes.NewReader(raw))
	decoder.DisallowUnknownFields()
	return decoder.Decode(output) == nil && decoder.Decode(&struct{}{}) == io.EOF
}

func (server *Server) putSourceDocument(writer http.ResponseWriter, request *http.Request) {
	_ = http.NewResponseController(writer).SetReadDeadline(time.Now().Add(documentTransferTimeout))
	var metadata knowledgecontract.SaaSSourceDocumentPutRequest
	multipartReader, content, err := readStreamRequest(writer, request, &metadata)
	if err != nil {
		writeTransferError(writer, err)
		return
	}
	if metadata.Input.Bytes < 1 || metadata.Input.Bytes > agentsdk.KnowledgeDocumentMaximumBytes || metadata.Input.Content != nil {
		writeStatus(writer, http.StatusBadRequest, "bad_request", "knowledge.document_content_invalid")
		return
	}
	source, err := server.source(metadata.Handle)
	if err != nil {
		writeTransferError(writer, err)
		return
	}
	limited := &io.LimitedReader{R: content, N: metadata.Input.Bytes + 1}
	metadata.Input.Content = limited
	if err = source.PutKnowledgeDocument(request.Context(), metadata.Input, metadata.Authority); err != nil {
		writeTransferError(writer, err)
		return
	}
	if err = finishStreamRequest(multipartReader, limited); err != nil {
		writeTransferError(writer, err)
		return
	}
	writeTransferResult(writer, struct{}{})
}

func readStreamRequest(writer http.ResponseWriter, request *http.Request, metadata any) (*multipart.Reader, *multipart.Part, error) {
	maximum := agentsdk.KnowledgeDocumentMaximumBytes + streamMetadataLimit + (1 << 20)
	if request.ContentLength > maximum {
		return nil, nil, &agentsdk.Error{Class: "bad_request", Code: "knowledge.document_size_invalid"}
	}
	request.Body = http.MaxBytesReader(writer, request.Body, maximum)
	mediaType, parameters, err := mime.ParseMediaType(request.Header.Get("Content-Type"))
	if err != nil || mediaType != "multipart/form-data" || strings.TrimSpace(parameters["boundary"]) == "" {
		return nil, nil, &agentsdk.Error{Class: "bad_request", Code: "knowledge.request_invalid"}
	}
	multipartReader := multipart.NewReader(request.Body, parameters["boundary"])
	part, err := multipartReader.NextPart()
	if err != nil || part.FormName() != "metadata" || part.FileName() != "" {
		return nil, nil, &agentsdk.Error{Class: "bad_request", Code: "knowledge.request_invalid"}
	}
	raw, err := io.ReadAll(io.LimitReader(part, streamMetadataLimit+1))
	_ = part.Close()
	if err != nil || len(raw) == 0 || len(raw) > streamMetadataLimit {
		return nil, nil, &agentsdk.Error{Class: "bad_request", Code: "knowledge.request_invalid"}
	}
	decoder := json.NewDecoder(bytes.NewReader(raw))
	decoder.DisallowUnknownFields()
	if decoder.Decode(metadata) != nil || decoder.Decode(&struct{}{}) != io.EOF {
		return nil, nil, &agentsdk.Error{Class: "bad_request", Code: "knowledge.request_invalid"}
	}
	content, err := multipartReader.NextPart()
	if err != nil || content.FormName() != "content" {
		return nil, nil, &agentsdk.Error{Class: "bad_request", Code: "knowledge.request_invalid"}
	}
	return multipartReader, content, nil
}

func finishStreamRequest(reader *multipart.Reader, content *io.LimitedReader) error {
	if _, err := io.CopyBuffer(io.Discard, content, make([]byte, 128*1024)); err != nil {
		return &agentsdk.Error{Class: "bad_request", Code: "knowledge.document_content_invalid"}
	}
	if content.N != 1 {
		return &agentsdk.Error{Class: "bad_request", Code: "knowledge.document_size_mismatch"}
	}
	part, err := reader.NextPart()
	if part != nil {
		_ = part.Close()
	}
	if err != io.EOF {
		return &agentsdk.Error{Class: "bad_request", Code: "knowledge.request_invalid"}
	}
	return nil
}

func (server *Server) downloadDocument(writer http.ResponseWriter, request *http.Request) {
	_ = http.NewResponseController(writer).SetWriteDeadline(time.Now().Add(documentTransferTimeout))
	encoded := request.Header.Get(knowledgecontract.SaaSTransferHeader)
	if encoded == "" || len(encoded) > (streamMetadataLimit*4/3)+4 {
		writeStatus(writer, http.StatusBadRequest, "bad_request", "knowledge.request_invalid")
		return
	}
	raw, err := base64.RawURLEncoding.DecodeString(encoded)
	if err != nil || len(raw) == 0 || len(raw) > streamMetadataLimit {
		writeStatus(writer, http.StatusBadRequest, "bad_request", "knowledge.request_invalid")
		return
	}
	var metadata knowledgecontract.SaaSDocumentDownloadRequest
	decoder := json.NewDecoder(bytes.NewReader(raw))
	decoder.DisallowUnknownFields()
	if decoder.Decode(&metadata) != nil || decoder.Decode(&struct{}{}) != io.EOF || len(metadata.Grants) > 12 {
		writeStatus(writer, http.StatusBadRequest, "bad_request", "knowledge.request_invalid")
		return
	}
	ctx := withGrants(request.Context(), knowledgecontract.SaaSDocumentDownloadPrepareOperation, server.secret, metadata.Grants)
	download, err := server.dependencies.Knowledge.DownloadKnowledgeDocument(ctx, metadata.Library, metadata.ID, metadata.Authority)
	if err != nil {
		writeTransferError(writer, err)
		return
	}
	if download.Content == nil || download.Document.Bytes < 1 {
		if download.Content != nil {
			_ = download.Content.Close()
		}
		writeStatus(writer, http.StatusServiceUnavailable, "unavailable", "knowledge.document_content_unavailable")
		return
	}
	defer download.Content.Close()
	writer.Header().Set("Accept-Ranges", "bytes")
	writer.Header().Set("Cache-Control", "private, no-store")
	writer.Header().Set("ETag", `"sha256-`+download.Document.SHA256+`"`)
	http.ServeContent(writer, request, download.Document.Filename, time.Time{}, download.Content)
}

func writeTransferResult(writer http.ResponseWriter, value any) {
	raw, err := json.Marshal(value)
	if err != nil {
		writeStatus(writer, http.StatusServiceUnavailable, "unavailable", "knowledge.response_invalid")
		return
	}
	writeJSON(writer, http.StatusOK, knowledgecontract.SaaSResponse{Result: raw})
}

func writeTransferError(writer http.ResponseWriter, err error) {
	var challenge *challengeError
	if errors.As(err, &challenge) {
		writeStatus(writer, http.StatusConflict, "conflict", "knowledge.authorization_stale")
		return
	}
	safe := safeError(err)
	status := http.StatusServiceUnavailable
	switch safe.Class {
	case "bad_request":
		status = http.StatusBadRequest
	case "forbidden":
		status = http.StatusForbidden
	case "not_found":
		status = http.StatusNotFound
	case "conflict":
		status = http.StatusConflict
	}
	telemetry.RecordHTTPStatusError(writer, status, safe.Code)
	writeJSON(writer, status, knowledgecontract.SaaSResponse{Error: safe})
}
