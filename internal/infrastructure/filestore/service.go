// Package filestore implements the product-neutral file capability. Knowledge
// indexing may consume these files, but storing a file does not implicitly add
// it to a knowledge library or grant any product resource permission.
package filestore

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"io"
	"mime"
	"net/http"
	"path"
	"regexp"
	"strings"
	"time"
	"unicode"

	sharedartifact "github.com/domainry/domainry-foundation/artifact"
	knowledgefiles "github.com/domainry/domainry-knowledge-sdk/files"
)

const fileKind = "file"

var stableID = regexp.MustCompile(`^[A-Za-z0-9][A-Za-z0-9._:-]{0,254}$`)
var fileID = regexp.MustCompile(`^file_[a-f0-9]{32}$`)

type Service struct {
	runtimeID string
	store     sharedartifact.ManagedStore
	content   sharedartifact.ContentStore
	writer    sharedartifact.ContentWriter
	now       func() time.Time
}

func New(runtimeID string, store sharedartifact.ManagedStore, content sharedartifact.ContentStore, writer sharedartifact.ContentWriter) (*Service, error) {
	runtimeID = strings.TrimSpace(runtimeID)
	if !stableID.MatchString(runtimeID) || store == nil || content == nil || writer == nil {
		return nil, failure("unavailable", "knowledge.files_configuration_invalid")
	}
	return &Service{runtimeID: runtimeID, store: store, content: content, writer: writer, now: func() time.Time { return time.Now().UTC().Truncate(time.Millisecond) }}, nil
}

func (service *Service) Upload(ctx context.Context, authority knowledgefiles.Authority, input knowledgefiles.Upload) (out knowledgefiles.File, resultErr error) {
	if err := service.authorize(authority); err != nil {
		return out, err
	}
	input.ClientID = strings.TrimSpace(input.ClientID)
	input.Filename = path.Base(strings.ReplaceAll(strings.TrimSpace(input.Filename), "\\", "/"))
	input.ContentType = normalizeContentType(input.ContentType, input.Data)
	if !stableID.MatchString(input.ClientID) || input.Filename == "" || input.Filename == "." || input.Filename == ".." || len(input.Filename) > 255 || strings.IndexFunc(input.Filename, unicode.IsControl) >= 0 || input.ContentType == "" || len(input.ContentType) > 128 || len(input.Data) == 0 || int64(len(input.Data)) > knowledgefiles.MaxContentBytes {
		return out, failure("bad_request", "knowledge.file_invalid")
	}
	identity := digest([]string{service.runtimeID, authority.WorkspaceID, authority.SubjectID, input.ClientID})
	id := "file_" + identity[:32]
	contentDigest := sha256.Sum256(input.Data)
	contentSHA := hex.EncodeToString(contentDigest[:])
	idempotencyKey := "uploads-file:" + identity
	if current, found, err := service.store.ByID(ctx, authority.WorkspaceID, id); err != nil {
		return out, err
	} else if found {
		if sameUpload(current, authority, input, contentSHA, idempotencyKey) {
			return fileView(current), nil
		}
		return out, failure("conflict", "knowledge.file_idempotency_conflict")
	}
	info, err := service.writer.PutImmutable(ctx, authority.WorkspaceID, "uploads-file:"+id, input.Data)
	if err != nil {
		return out, err
	}
	defer func() {
		if resultErr == nil {
			return
		}
		current, found, readErr := service.store.ByID(context.WithoutCancel(ctx), authority.WorkspaceID, id)
		if readErr == nil && (!found || current.StorageReference != info.Reference) {
			_ = service.content.Delete(context.WithoutCancel(ctx), authority.WorkspaceID, info.Reference)
		}
	}()
	if strings.TrimSpace(info.Reference) == "" || !strings.EqualFold(info.SHA256, contentSHA) || info.Size != int64(len(input.Data)) {
		return out, failure("unavailable", "knowledge.file_content_mismatch")
	}
	now := service.now()
	value := sharedartifact.Artifact{
		ID: id, WorkspaceID: authority.WorkspaceID, Owner: sharedartifact.OwnerUploads, Kind: fileKind,
		IdempotencyKey: idempotencyKey, CreatedBy: authority.SubjectID, Filename: input.Filename, MediaType: input.ContentType,
		ContentSHA256: contentSHA, SizeBytes: int64(len(input.Data)), StorageReference: info.Reference,
		Status: sharedartifact.StatusAvailable, ScanStatus: sharedartifact.ScanNotRequired,
		AuthorizationScopeSHA256: digest([]string{authority.RuntimeID, authority.WorkspaceID, authority.SubjectID}),
		Metadata:                 json.RawMessage(`{}`), CreatedAt: now, UpdatedAt: now,
	}
	registered, _, err := service.store.Register(ctx, value)
	if err != nil {
		return out, err
	}
	if !sameUpload(registered, authority, input, contentSHA, idempotencyKey) || registered.StorageReference != info.Reference {
		return out, failure("conflict", "knowledge.file_idempotency_conflict")
	}
	return fileView(registered), nil
}

func (service *Service) Get(ctx context.Context, authority knowledgefiles.Authority, id string) (knowledgefiles.File, error) {
	value, err := service.get(ctx, authority, id)
	if err != nil {
		return knowledgefiles.File{}, err
	}
	return fileView(value), nil
}

func (service *Service) Download(ctx context.Context, authority knowledgefiles.Authority, id string) (knowledgefiles.Download, error) {
	value, err := service.get(ctx, authority, id)
	if err != nil {
		return knowledgefiles.Download{}, err
	}
	reader, err := service.content.Open(ctx, value.WorkspaceID, value.StorageReference)
	if err != nil {
		if errors.Is(err, sharedartifact.ErrContentNotFound) {
			return knowledgefiles.Download{}, failure("not_found", "knowledge.file_content_not_found")
		}
		return knowledgefiles.Download{}, err
	}
	defer reader.Close()
	raw, err := io.ReadAll(io.LimitReader(reader, value.SizeBytes+1))
	if err != nil {
		return knowledgefiles.Download{}, err
	}
	sum := sha256.Sum256(raw)
	if int64(len(raw)) != value.SizeBytes || hex.EncodeToString(sum[:]) != value.ContentSHA256 {
		return knowledgefiles.Download{}, failure("unavailable", "knowledge.file_content_mismatch")
	}
	current, found, err := service.store.ByID(ctx, value.WorkspaceID, value.ID)
	if err != nil {
		return knowledgefiles.Download{}, err
	}
	if !found || current.Status != sharedartifact.StatusAvailable || current.StorageReference != value.StorageReference || current.Owner != sharedartifact.OwnerUploads || current.Kind != fileKind {
		return knowledgefiles.Download{}, failure("not_found", "knowledge.file_not_found")
	}
	return knowledgefiles.Download{File: fileView(current), Data: raw}, nil
}

func (service *Service) Bind(ctx context.Context, authority knowledgefiles.Authority, id string, binding knowledgefiles.Binding) error {
	value, err := service.get(ctx, authority, id)
	if err != nil {
		return err
	}
	if value.CreatedBy != authority.SubjectID {
		return failure("forbidden", "knowledge.file_binding_denied")
	}
	binding.Owner = strings.TrimSpace(binding.Owner)
	binding.ResourceType = strings.TrimSpace(binding.ResourceType)
	binding.ResourceID = strings.TrimSpace(binding.ResourceID)
	binding.FieldKey = strings.TrimSpace(binding.FieldKey)
	if !stableID.MatchString(binding.Owner) || !stableID.MatchString(binding.ResourceType) || !stableID.MatchString(binding.ResourceID) || len(binding.FieldKey) > 255 || binding.FieldKey != "" && !stableID.MatchString(binding.FieldKey) {
		return failure("bad_request", "knowledge.file_binding_invalid")
	}
	key := digest([]string{id, binding.Owner, binding.ResourceType, binding.ResourceID, binding.FieldKey})
	_, _, err = service.store.Bind(ctx, sharedartifact.Binding{
		ID: "bind_" + key[:32], WorkspaceID: authority.WorkspaceID, ArtifactID: id,
		Owner: binding.Owner, Kind: sharedartifact.BindingObjectField, ResourceType: binding.ResourceType,
		ResourceID: binding.ResourceID, FieldKey: binding.FieldKey, Metadata: json.RawMessage(`{}`), CreatedAt: service.now(),
	})
	return err
}

func (service *Service) Delete(ctx context.Context, authority knowledgefiles.Authority, id string) error {
	if err := service.authorize(authority); err != nil {
		return err
	}
	id = strings.TrimSpace(id)
	if !fileID.MatchString(id) {
		return failure("bad_request", "knowledge.file_reference_invalid")
	}
	value, found, err := service.store.ByID(ctx, authority.WorkspaceID, id)
	if err != nil {
		return err
	}
	if !found || value.Owner != sharedartifact.OwnerUploads || value.Kind != fileKind {
		return failure("not_found", "knowledge.file_not_found")
	}
	if value.CreatedBy != authority.SubjectID {
		return failure("forbidden", "knowledge.file_delete_denied")
	}
	if value.Status == sharedartifact.StatusDeleted {
		return nil
	}
	bindings, err := service.store.Bindings(ctx, authority.WorkspaceID, id)
	if err != nil {
		return err
	}
	if len(bindings) != 0 {
		return failure("conflict", "knowledge.file_in_use")
	}
	if value.Status == sharedartifact.StatusAvailable {
		changed, transitionErr := service.store.Transition(ctx, authority.WorkspaceID, id, sharedartifact.StatusAvailable, sharedartifact.StatusExpired, value.ScanStatus, service.now())
		if transitionErr != nil {
			return transitionErr
		}
		if !changed {
			return failure("conflict", "knowledge.file_state_conflict")
		}
		value.Status = sharedartifact.StatusExpired
	}
	if value.Status != sharedartifact.StatusExpired {
		return failure("conflict", "knowledge.file_state_conflict")
	}
	if err = service.content.Delete(ctx, authority.WorkspaceID, value.StorageReference); err != nil && !errors.Is(err, sharedartifact.ErrContentNotFound) {
		return err
	}
	changed, err := service.store.Transition(ctx, authority.WorkspaceID, id, sharedartifact.StatusExpired, sharedartifact.StatusDeleted, value.ScanStatus, service.now())
	if err != nil {
		return err
	}
	if !changed {
		current, currentFound, readErr := service.store.ByID(ctx, authority.WorkspaceID, id)
		if readErr != nil {
			return readErr
		}
		if !currentFound || current.Status != sharedartifact.StatusDeleted {
			return failure("conflict", "knowledge.file_state_conflict")
		}
	}
	return nil
}

func (service *Service) get(ctx context.Context, authority knowledgefiles.Authority, id string) (sharedartifact.Artifact, error) {
	if err := service.authorize(authority); err != nil {
		return sharedartifact.Artifact{}, err
	}
	id = strings.TrimSpace(id)
	if !fileID.MatchString(id) {
		return sharedartifact.Artifact{}, failure("bad_request", "knowledge.file_reference_invalid")
	}
	value, found, err := service.store.ByID(ctx, authority.WorkspaceID, id)
	if err != nil {
		return sharedartifact.Artifact{}, err
	}
	if !found || value.Owner != sharedartifact.OwnerUploads || value.Kind != fileKind || value.Status != sharedartifact.StatusAvailable {
		return sharedartifact.Artifact{}, failure("not_found", "knowledge.file_not_found")
	}
	return value, nil
}

func (service *Service) authorize(authority knowledgefiles.Authority) error {
	if authority.RuntimeID != strings.TrimSpace(authority.RuntimeID) || authority.WorkspaceID != strings.TrimSpace(authority.WorkspaceID) || authority.SubjectID != strings.TrimSpace(authority.SubjectID) {
		return failure("forbidden", "knowledge.file_authority_invalid")
	}
	if authority.RuntimeID != service.runtimeID {
		return failure("forbidden", "knowledge.runtime_mismatch")
	}
	if !stableID.MatchString(authority.WorkspaceID) || !stableID.MatchString(authority.SubjectID) {
		return failure("forbidden", "knowledge.file_authority_invalid")
	}
	return nil
}

func sameUpload(value sharedartifact.Artifact, authority knowledgefiles.Authority, input knowledgefiles.Upload, contentSHA, idempotencyKey string) bool {
	return value.WorkspaceID == authority.WorkspaceID && value.Owner == sharedartifact.OwnerUploads && value.Kind == fileKind && value.IdempotencyKey == idempotencyKey && value.CreatedBy == authority.SubjectID && value.Filename == input.Filename && value.MediaType == input.ContentType && value.ContentSHA256 == contentSHA && value.SizeBytes == int64(len(input.Data)) && value.Status == sharedartifact.StatusAvailable
}

func fileView(value sharedartifact.Artifact) knowledgefiles.File {
	return knowledgefiles.File{ID: value.ID, WorkspaceID: value.WorkspaceID, CreatedBy: value.CreatedBy, Filename: value.Filename, ContentType: value.MediaType, SizeBytes: value.SizeBytes, SHA256: value.ContentSHA256, CreatedAt: value.CreatedAt}
}

func normalizeContentType(supplied string, data []byte) string {
	detected := http.DetectContentType(data[:min(len(data), 512)])
	if mediaType, _, err := mime.ParseMediaType(detected); err == nil {
		detected = strings.ToLower(mediaType)
	}
	if detected == "application/octet-stream" {
		if mediaType, parameters, err := mime.ParseMediaType(strings.TrimSpace(supplied)); err == nil && len(parameters) == 0 {
			detected = strings.ToLower(mediaType)
		}
	}
	switch detected {
	case "", "text/html", "application/xhtml+xml", "image/svg+xml", "application/javascript", "text/javascript":
		return ""
	}
	return detected
}

func digest(value []string) string {
	raw, _ := json.Marshal(value)
	sum := sha256.Sum256(raw)
	return hex.EncodeToString(sum[:])
}

func failure(class, code string) error { return &knowledgefiles.Error{Class: class, Code: code} }

var _ knowledgefiles.Service = (*Service)(nil)
