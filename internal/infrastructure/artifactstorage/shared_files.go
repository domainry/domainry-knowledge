package artifactstorage

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"io"
	"os"
	"regexp"
	"strings"

	sharedartifact "github.com/domainry/domainry-foundation/artifact"
)

const maxSharedBytes = int64(100 << 20)

var sharedReference = regexp.MustCompile(`^artifact_[a-f0-9]{32}_[a-f0-9]{64}$`)

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
	if err := ctx.Err(); err != nil {
		return sharedartifact.ContentInfo{}, err
	}
	if strings.TrimSpace(identity) == "" || int64(len(content)) > maxSharedBytes {
		return sharedartifact.ContentInfo{}, fmt.Errorf("shared artifact identity or size is invalid")
	}
	root, err := f.workspace(workspaceID, true)
	if err != nil {
		return sharedartifact.ContentInfo{}, err
	}
	defer root.Close()
	contentHash := sha256.Sum256(content)
	identityHash := sha256.Sum256([]byte(strings.TrimSpace(identity)))
	reference := "artifact_" + hex.EncodeToString(identityHash[:16]) + "_" + hex.EncodeToString(contentHash[:])
	if info, statErr := contentInfo(root, reference); statErr == nil {
		if info.SHA256 != hex.EncodeToString(contentHash[:]) || info.Size != int64(len(content)) {
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
	if n, writeErr := file.Write(content); writeErr != nil || n != len(content) {
		_ = file.Close()
		_ = root.Remove(reference + ".pending")
		if writeErr != nil {
			return sharedartifact.ContentInfo{}, writeErr
		}
		return sharedartifact.ContentInfo{}, io.ErrShortWrite
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
	return sharedartifact.ContentInfo{Reference: reference, SHA256: hex.EncodeToString(contentHash[:]), Size: int64(len(content))}, nil
}
func (f *SharedFiles) Open(ctx context.Context, workspaceID, reference string) (io.ReadCloser, error) {
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
func (f *SharedFiles) Stat(ctx context.Context, workspaceID, reference string) (sharedartifact.ContentInfo, error) {
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
func (f *SharedFiles) Delete(ctx context.Context, workspaceID, reference string) error {
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

var _ sharedartifact.ContentStore = (*SharedFiles)(nil)
var _ sharedartifact.ContentWriter = (*SharedFiles)(nil)
