package saas

import (
	"bytes"
	"encoding/json"
	"io"
	"mime"
	"mime/multipart"
	"net/http"
	"strings"
	"time"

	knowledgefiles "github.com/domainry/domainry-knowledge-sdk/files"
)

func (server *Server) uploadFile(writer http.ResponseWriter, request *http.Request) {
	_ = http.NewResponseController(writer).SetReadDeadline(time.Now().Add(documentTransferTimeout))
	var metadata struct {
		Authority knowledgefiles.Authority    `json:"authority"`
		Input     knowledgefiles.StreamUpload `json:"input"`
	}
	multipartReader, content, err := readFileStreamRequest(writer, request, &metadata)
	if err != nil {
		writeTransferError(writer, err)
		return
	}
	if metadata.Input.SizeBytes < 1 || metadata.Input.SizeBytes > knowledgefiles.MaxContentBytes || metadata.Input.Content != nil {
		writeStatus(writer, http.StatusBadRequest, "bad_request", "knowledge.file_invalid")
		return
	}
	limited := &io.LimitedReader{R: content, N: metadata.Input.SizeBytes + 1}
	metadata.Input.Content = limited
	file, err := server.dependencies.Files.UploadStream(request.Context(), metadata.Authority, metadata.Input)
	if err != nil {
		writeTransferError(writer, err)
		return
	}
	if err = finishFileStreamRequest(multipartReader, limited); err != nil {
		writeTransferError(writer, err)
		return
	}
	writeTransferResult(writer, file)
}

func readFileStreamRequest(writer http.ResponseWriter, request *http.Request, metadata any) (*multipart.Reader, *multipart.Part, error) {
	maximum := knowledgefiles.MaxContentBytes + streamMetadataLimit + (1 << 20)
	if request.ContentLength > maximum {
		return nil, nil, &knowledgefiles.Error{Class: knowledgefiles.ErrorClassBadRequest, Code: "knowledge.file_size_mismatch"}
	}
	request.Body = http.MaxBytesReader(writer, request.Body, maximum)
	mediaType, parameters, err := mime.ParseMediaType(request.Header.Get("Content-Type"))
	if err != nil || mediaType != "multipart/form-data" || strings.TrimSpace(parameters["boundary"]) == "" {
		return nil, nil, &knowledgefiles.Error{Class: knowledgefiles.ErrorClassBadRequest, Code: "knowledge.request_invalid"}
	}
	multipartReader := multipart.NewReader(request.Body, parameters["boundary"])
	part, err := multipartReader.NextPart()
	if err != nil || part.FormName() != "metadata" || part.FileName() != "" {
		return nil, nil, &knowledgefiles.Error{Class: knowledgefiles.ErrorClassBadRequest, Code: "knowledge.request_invalid"}
	}
	raw, err := io.ReadAll(io.LimitReader(part, streamMetadataLimit+1))
	_ = part.Close()
	if err != nil || len(raw) == 0 || len(raw) > streamMetadataLimit {
		return nil, nil, &knowledgefiles.Error{Class: knowledgefiles.ErrorClassBadRequest, Code: "knowledge.request_invalid"}
	}
	decoder := json.NewDecoder(bytes.NewReader(raw))
	decoder.DisallowUnknownFields()
	if decoder.Decode(metadata) != nil || decoder.Decode(&struct{}{}) != io.EOF {
		return nil, nil, &knowledgefiles.Error{Class: knowledgefiles.ErrorClassBadRequest, Code: "knowledge.request_invalid"}
	}
	content, err := multipartReader.NextPart()
	if err != nil || content.FormName() != "content" {
		return nil, nil, &knowledgefiles.Error{Class: knowledgefiles.ErrorClassBadRequest, Code: "knowledge.request_invalid"}
	}
	return multipartReader, content, nil
}

func finishFileStreamRequest(reader *multipart.Reader, content *io.LimitedReader) error {
	if _, err := io.CopyBuffer(io.Discard, content, make([]byte, 128*1024)); err != nil {
		return &knowledgefiles.Error{Class: knowledgefiles.ErrorClassBadRequest, Code: "knowledge.file_invalid", Cause: err}
	}
	if content.N != 1 {
		return &knowledgefiles.Error{Class: knowledgefiles.ErrorClassBadRequest, Code: "knowledge.file_size_mismatch"}
	}
	part, err := reader.NextPart()
	if part != nil {
		_ = part.Close()
	}
	if err != io.EOF {
		return &knowledgefiles.Error{Class: knowledgefiles.ErrorClassBadRequest, Code: "knowledge.request_invalid"}
	}
	return nil
}
