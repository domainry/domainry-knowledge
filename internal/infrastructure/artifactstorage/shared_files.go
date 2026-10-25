package artifactstorage

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"io"
	"os"
	"regexp"
	"strings"
	"time"

	sharedartifact "github.com/domainry/domainry-foundation/artifact"
	"github.com/domainry/domainry-foundation/telemetry"
)

const maxSharedBytes = int64(100 << 20)

var sharedReference = regexp.MustCompile(`^artifact_[a-f0-9]{32}_[a-f0-9]{64}$`)
var sharedDigest = regexp.MustCompile(`^[a-f0-9]{64}$`)

type SharedFiles struct{ root *os.Root }

func NewSharedFiles(directory string) (*SharedFiles, error) {
	if strings.TrimSpace(directory) == "" {
		return nil, fmt.Errorf("shared artifact storage directory is required")
	}
	if err := os.MkdirAll(directory, 0700); err != nil {
		return nil, err
	}
	info, err := os.Lstat(directory)
	if err != nil || !info.IsDir() || info.Mode().Perm()&0077 != 0 {
		return nil, fmt.Errorf("shared artifact storage directory must be private")
	}
	root, err := os.OpenRoot(directory)
	if err != nil {
		return nil, err
	}
	return &SharedFiles{root: root}, nil
}
func (f *SharedFiles) Close() error {
	if f == nil || f.root == nil {
		return nil
	}
	return f.root.Close()
}
func workspaceName(value string) (string, error) {
	value = strings.TrimSpace(value)
	if value == "" || len(value) > 255 {
		return "", fmt.Errorf("shared artifact workspace is invalid")
	}
	sum := sha256.Sum256([]byte(value))
	return hex.EncodeToString(sum[:]), nil
}
func (f *SharedFiles) workspace(value string, create bool) (*os.Root, error) {
	name, err := workspaceName(value)
	if err != nil {
		return nil, err
	}
	if create {
		if err = f.root.Mkdir(name, 0700); err != nil && !errors.Is(err, os.ErrExist) {
			return nil, err
		}
	}
	info, err := f.root.Lstat(name)
	if errors.Is(err, os.ErrNotExist) {
		return nil, sharedartifact.ErrContentNotFound
	}
	if err != nil || !info.IsDir() || info.Mode().Perm()&0077 != 0 {
		return nil, fmt.Errorf("shared artifact workspace is invalid")
	}
	return f.root.OpenRoot(name)
}
func contentInfo(root *os.Root, reference string) (sharedartifact.ContentInfo, error) {
	file, err := root.Open(reference + ".blob")
	if errors.Is(err, os.ErrNotExist) {
		return sharedartifact.ContentInfo{}, sharedartifact.ErrContentNotFound
	}
	if err != nil {
		return sharedartifact.ContentInfo{}, err
	}
	defer file.Close()
	info, err := file.Stat()
	if err != nil || !info.Mode().IsRegular() || info.Mode().Perm()&0077 != 0 || info.Size() > maxSharedBytes {
		return sharedartifact.ContentInfo{}, fmt.Errorf("shared artifact content is invalid")
	}
	digest := sha256.New()
	if _, err = io.Copy(digest, io.LimitReader(file, maxSharedBytes+1)); err != nil {
		return sharedartifact.ContentInfo{}, err
	}
	return sharedartifact.ContentInfo{Reference: reference, SHA256: hex.EncodeToString(digest.Sum(nil)), Size: info.Size()}, nil
}
func (f *SharedFiles) PutImmutable(ctx context.Context, workspaceID, identity string, content []byte) (sharedartifact.ContentInfo, error) {
	digest := sha256.Sum256(content)
	return f.PutImmutableStream(ctx, workspaceID, identity, hex.EncodeToString(digest[:]), int64(len(content)), bytes.NewReader(content))
}

func (f *SharedFiles) PutImmutableStream(ctx context.Context, workspaceID, identity, expectedSHA256 string, expectedBytes int64, content io.Reader) (result sharedartifact.ContentInfo, returnErr error) {
	started := time.Now()
	defer func() {
		recordSharedFileCall(ctx, "put_immutable", map[string]any{"content_sha256": expectedSHA256, "content_bytes": expectedBytes}, result, started, returnErr)
	}()
	if err := ctx.Err(); err != nil {
		return sharedartifact.ContentInfo{}, err
	}
	expectedSHA256 = strings.ToLower(strings.TrimSpace(expectedSHA256))
	if strings.TrimSpace(identity) == "" || !sharedDigest.MatchString(expectedSHA256) || expectedBytes < 0 || expectedBytes > maxSharedBytes || content == nil {
		return sharedartifact.ContentInfo{}, fmt.Errorf("shared artifact identity or size is invalid")
	}
	root, err := f.workspace(workspaceID, true)
	if err != nil {
		return sharedartifact.ContentInfo{}, err
	}
	defer root.Close()
	identityHash := sha256.Sum256([]byte(strings.TrimSpace(identity)))
	reference := "artifact_" + hex.EncodeToString(identityHash[:16]) + "_" + expectedSHA256
	if info, statErr := contentInfo(root, reference); statErr == nil {
		if info.SHA256 != expectedSHA256 || info.Size != expectedBytes {
			return sharedartifact.ContentInfo{}, sharedartifact.ErrIdentityConflict
		}
		return info, nil
	} else if !errors.Is(statErr, sharedartifact.ErrContentNotFound) {
		return sharedartifact.ContentInfo{}, statErr
	}
	file, err := root.OpenFile(reference+".pending", os.O_WRONLY|os.O_CREATE|os.O_EXCL, 0600)
	if err != nil {
		return sharedartifact.ContentInfo{}, err
	}
	digest := sha256.New()
	limited := &io.LimitedReader{R: content, N: expectedBytes + 1}
	written, writeErr := io.CopyBuffer(io.MultiWriter(file, digest), limited, make([]byte, 128*1024))
	if writeErr != nil || written != expectedBytes || limited.N != 1 || hex.EncodeToString(digest.Sum(nil)) != expectedSHA256 {
		_ = file.Close()
		_ = root.Remove(reference + ".pending")
		if writeErr != nil {
			return sharedartifact.ContentInfo{}, writeErr
		}
		return sharedartifact.ContentInfo{}, fmt.Errorf("shared artifact content does not match declared integrity metadata")
	}
	if err = file.Sync(); err == nil {
		err = file.Close()
	} else {
		_ = file.Close()
	}
	if err != nil {
		_ = root.Remove(reference + ".pending")
		return sharedartifact.ContentInfo{}, err
	}
	if err = root.Rename(reference+".pending", reference+".blob"); err != nil {
		return sharedartifact.ContentInfo{}, err
	}
	return sharedartifact.ContentInfo{Reference: reference, SHA256: expectedSHA256, Size: expectedBytes}, nil
}
func (f *SharedFiles) Open(ctx context.Context, workspaceID, reference string) (reader io.ReadCloser, returnErr error) {
	started := time.Now()
	defer func() {
		telemetry.RecordDependencyCall(ctx, telemetry.DependencyCall{
			Feature: telemetry.DiagnosticFeatureFilesystem, Dependency: "knowledge.shared_files", Operation: "open",
			Input: map[string]any{"reference": reference},
		}, telemetry.DependencyResult{Output: map[string]any{"opened": reader != nil}, Err: returnErr}, time.Since(started))
	}()
	if err := ctx.Err(); err != nil {
		return nil, err
	}
	if !sharedReference.MatchString(reference) {
		return nil, fmt.Errorf("shared artifact reference is invalid")
	}
	root, err := f.workspace(workspaceID, false)
	if err != nil {
		return nil, err
	}
	file, err := root.Open(reference + ".blob")
	_ = root.Close()
	if errors.Is(err, os.ErrNotExist) {
		return nil, sharedartifact.ErrContentNotFound
	}
	return file, err
}
func (f *SharedFiles) Stat(ctx context.Context, workspaceID, reference string) (result sharedartifact.ContentInfo, returnErr error) {
	started := time.Now()
	defer func() {
		recordSharedFileCall(ctx, "stat", map[string]any{"reference": reference}, result, started, returnErr)
	}()
	if err := ctx.Err(); err != nil {
		return sharedartifact.ContentInfo{}, err
	}
	if !sharedReference.MatchString(reference) {
		return sharedartifact.ContentInfo{}, fmt.Errorf("shared artifact reference is invalid")
	}
	root, err := f.workspace(workspaceID, false)
	if err != nil {
		return sharedartifact.ContentInfo{}, err
	}
	defer root.Close()
	return contentInfo(root, reference)
}
func (f *SharedFiles) Delete(ctx context.Context, workspaceID, reference string) (returnErr error) {
	started := time.Now()
	defer func() {
		telemetry.RecordDependencyCall(ctx, telemetry.DependencyCall{
			Feature: telemetry.DiagnosticFeatureFilesystem, Dependency: "knowledge.shared_files", Operation: "delete",
			Input: map[string]any{"reference": reference},
		}, telemetry.DependencyResult{Err: returnErr}, time.Since(started))
	}()
	if err := ctx.Err(); err != nil {
		return err
	}
	if !sharedReference.MatchString(reference) {
		return fmt.Errorf("shared artifact reference is invalid")
	}
	root, err := f.workspace(workspaceID, false)
	if errors.Is(err, sharedartifact.ErrContentNotFound) {
		return nil
	}
	if err != nil {
		return err
	}
	defer root.Close()
	if err = root.Remove(reference + ".blob"); err != nil && !errors.Is(err, os.ErrNotExist) {
		return err
	}
	return nil
}

func recordSharedFileCall(ctx context.Context, operation string, input map[string]any, result sharedartifact.ContentInfo, started time.Time, err error) {
	telemetry.RecordDependencyCall(ctx, telemetry.DependencyCall{
		Feature: telemetry.DiagnosticFeatureFilesystem, Dependency: "knowledge.shared_files", Operation: operation, Input: input,
	}, telemetry.DependencyResult{Output: map[string]any{
		"reference": result.Reference, "size": result.Size, "content_sha256": result.SHA256,
	}, Err: err}, time.Since(started))
}

var _ sharedartifact.ContentStore = (*SharedFiles)(nil)
var _ sharedartifact.ContentWriter = (*SharedFiles)(nil)
