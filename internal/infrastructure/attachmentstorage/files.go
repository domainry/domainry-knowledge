// Package attachmentstorage stores original uploaded files outside transcripts
// and web roots. Its per-object lock and deletion marker survive process races.
package attachmentstorage

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"os"
	"regexp"
	"strings"
	"time"

	agentsdk "github.com/domainry/domainry-agent-sdk"
)

type Files struct{ root *os.Root }

func NewFiles(directory string) (*Files, error) {
	if directory == "" {
		return nil, fmt.Errorf("attachment storage directory is required")
	}
	if err := os.MkdirAll(directory, 0700); err != nil {
		return nil, err
	}
	info, err := os.Lstat(directory)
	if err != nil || !info.IsDir() || info.Mode().Perm()&0077 != 0 {
		return nil, fmt.Errorf("attachment storage must be a private directory")
	}
	root, err := os.OpenRoot(directory)
	if err != nil {
		return nil, err
	}
	return &Files{root: root}, nil
}

func (f *Files) Close() error { return f.root.Close() }

func failure(class, code string) error {
	return &agentsdk.Error{Class: class, Code: "agent.conversation." + code}
}

func hash(raw []byte) string { sum := sha256.Sum256(raw); return hex.EncodeToString(sum[:]) }

var idPattern = regexp.MustCompile(`^att_[a-f0-9]{32}$`)
var hashPattern = regexp.MustCompile(`^[a-f0-9]{64}$`)

func (f *Files) owner(a agentsdk.ConversationAuthority) (*os.Root, error) {
	if !a.Known || strings.TrimSpace(a.RuntimeID) == "" || strings.TrimSpace(a.WorkspaceID) == "" || strings.TrimSpace(a.UserID) == "" || len(a.RuntimeID) > 255 || len(a.WorkspaceID) > 255 || len(a.UserID) > 255 {
		return nil, failure("forbidden", "attachment_storage_denied")
	}
	raw, _ := json.Marshal([]string{a.RuntimeID, a.WorkspaceID, a.UserID})
	key := hash(raw)
	if err := f.root.Mkdir(key, 0700); err != nil && !errors.Is(err, os.ErrExist) {
		return nil, failure("unavailable", "attachment_storage_unavailable")
	}
	info, err := f.root.Lstat(key)
	if err != nil || !info.IsDir() || info.Mode().Perm()&0077 != 0 {
		return nil, failure("unavailable", "attachment_storage_unavailable")
	}
	root, err := f.root.OpenRoot(key)
	if err != nil {
		return nil, failure("unavailable", "attachment_storage_unavailable")
	}
	return root, nil
}

// OS locks are released on process death. The persistent lock inode is never
// replaced/unlinked, so two hosts cannot lock different inodes for one object.
func (f *Files) locked(ctx context.Context, id string, a agentsdk.ConversationAuthority, fn func(*os.Root) error) error {
	if err := ctx.Err(); err != nil {
		return err
	}
	if !idPattern.MatchString(id) {
		return failure("bad_request", "attachment_reference_invalid")
	}
	root, err := f.owner(a)
	if err != nil {
		return err
	}
	defer root.Close()
	name := id + ".lock"
	if info, err := root.Lstat(name); err == nil && (!info.Mode().IsRegular() || info.Mode().Perm()&0077 != 0) {
		return failure("unavailable", "attachment_storage_unavailable")
	}
	lock, err := root.OpenFile(name, os.O_CREATE|os.O_RDWR, 0600)
	if err != nil {
		return failure("unavailable", "attachment_storage_unavailable")
	}
	defer lock.Close()
	info, err := lock.Stat()
	if err != nil || !info.Mode().IsRegular() || info.Mode().Perm()&0077 != 0 {
		return failure("unavailable", "attachment_storage_unavailable")
	}
	for {
		acquired, lockErr := tryAttachmentFileLock(lock)
		if lockErr != nil {
			return failure("unavailable", "attachment_storage_unavailable")
		}
		if acquired {
			break
		}
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-time.After(5 * time.Millisecond):
		}
	}
	defer unlockAttachmentFile(lock)
	if err := ctx.Err(); err != nil {
		return err
	}
	return fn(root)
}

func exists(root *os.Root, name string) (bool, error) {
	_, err := root.Lstat(name)
	if errors.Is(err, os.ErrNotExist) {
		return false, nil
	}
	if err != nil {
		return false, failure("unavailable", "attachment_storage_unavailable")
	}
	return true, nil
}

func live(root *os.Root, id string) error {
	deleted, err := exists(root, id+".deleted")
	if err != nil {
		return err
	}
	if deleted {
		return failure("not_found", "attachment_not_found")
	}
	return nil
}

func syncDir(root *os.Root) error {
	dir, err := root.Open(".")
	if err != nil {
		return err
	}
	defer dir.Close()
	return dir.Sync()
}

func read(root *os.Root, id, expected string) ([]byte, error) {
	if err := live(root, id); err != nil {
		return nil, err
	}
	info, err := root.Lstat(id + ".bin")
	if errors.Is(err, os.ErrNotExist) {
		return nil, failure("not_found", "attachment_content_not_found")
	}
	if err != nil || !info.Mode().IsRegular() || info.Mode().Perm()&0077 != 0 {
		return nil, failure("unavailable", "attachment_storage_unavailable")
	}
	file, err := root.Open(id + ".bin")
	if err != nil {
		return nil, failure("unavailable", "attachment_storage_unavailable")
	}
	defer file.Close()
	raw, err := io.ReadAll(io.LimitReader(file, agentsdk.ConversationAttachmentMaxBytes+1))
	if err != nil || len(raw) == 0 || int64(len(raw)) > agentsdk.ConversationAttachmentMaxBytes || hash(raw) != expected {
		return nil, failure("unavailable", "attachment_content_mismatch")
	}
	return raw, nil
}

func (f *Files) PutAttachmentContent(ctx context.Context, id, expected string, raw []byte, a agentsdk.ConversationAuthority) (string, error) {
	if !hashPattern.MatchString(expected) || len(raw) == 0 || int64(len(raw)) > agentsdk.ConversationAttachmentMaxBytes || hash(raw) != expected {
		return "", failure("bad_request", "attachment_content_mismatch")
	}
	return f.PutAttachmentContentStream(ctx, id, expected, int64(len(raw)), agentsdk.ConversationAttachmentMaxBytes, bytes.NewReader(raw), a)
}

// PutAttachmentContentStream writes one immutable object through a bounded
// reader, verifies its declared size and SHA-256 before the atomic rename, and
// never retains the complete body in memory.
func (f *Files) PutAttachmentContentStream(ctx context.Context, id, expected string, expectedBytes, maxBytes int64, content io.Reader, a agentsdk.ConversationAuthority) (string, error) {
	if !hashPattern.MatchString(expected) || expectedBytes < 1 || maxBytes < expectedBytes || content == nil {
		return "", failure("bad_request", "attachment_content_mismatch")
	}
	err := f.locked(ctx, id, a, func(root *os.Root) error {
		if err := live(root, id); err != nil {
			return err
		}
		if present, err := exists(root, id+".bin"); err != nil {
			return err
		} else if present {
			info, err := root.Lstat(id + ".bin")
			if err != nil || !info.Mode().IsRegular() || info.Mode().Perm()&0077 != 0 || info.Size() != expectedBytes {
				return failure("unavailable", "attachment_content_mismatch")
			}
			return nil
		}
		// The fixed temporary name is private to the locked object. A crashed
		// write is replaced on retry or removed by deletion; it cannot accumulate.
		pending := id + ".pending"
		if err := root.Remove(pending); err != nil && !errors.Is(err, os.ErrNotExist) {
			return failure("unavailable", "attachment_storage_unavailable")
		}
		file, err := root.OpenFile(pending, os.O_WRONLY|os.O_CREATE|os.O_EXCL, 0600)
		if err != nil {
			return failure("unavailable", "attachment_storage_unavailable")
		}
		defer file.Close()
		defer root.Remove(pending)
		digest := sha256.New()
		limited := &io.LimitedReader{R: content, N: expectedBytes + 1}
		written, err := io.CopyBuffer(io.MultiWriter(file, digest), limited, make([]byte, 128*1024))
		if err != nil {
			return failure("unavailable", "attachment_storage_unavailable")
		}
		if written != expectedBytes || limited.N != 1 || hex.EncodeToString(digest.Sum(nil)) != expected {
			return failure("bad_request", "attachment_content_mismatch")
		}
		if err := file.Sync(); err != nil {
			return failure("unavailable", "attachment_storage_unavailable")
		}
		if err := file.Close(); err != nil {
			return failure("unavailable", "attachment_storage_unavailable")
		}
		if err := ctx.Err(); err != nil {
			return err
		}
		if err := root.Rename(pending, id+".bin"); err != nil {
			return failure("unavailable", "attachment_storage_unavailable")
		}
		if err := syncDir(root); err != nil {
			return failure("unavailable", "attachment_storage_unavailable")
		}
		return nil
	})
	if err != nil {
		return "", err
	}
	return id + ":" + expected, nil
}

func verifiedChunk(content io.Reader, expectedBytes int64, expectedHash string) error {
	digest := sha256.New()
	limited := &io.LimitedReader{R: content, N: expectedBytes + 1}
	written, err := io.CopyBuffer(digest, limited, make([]byte, 128*1024))
	if err != nil || written != expectedBytes || limited.N != 1 || hex.EncodeToString(digest.Sum(nil)) != expectedHash {
		return failure("bad_request", "attachment_content_mismatch")
	}
	return nil
}

// PutAttachmentContentChunk appends one deterministic part to a private
// staged object. Replaying a previously acknowledged part is idempotent after
// both the request body and already-stored range are hashed. The final rename
// occurs only after the complete-file digest matches.
func (f *Files) PutAttachmentContentChunk(ctx context.Context, id, expected string, expectedBytes, maxBytes, offset int64, expectedChunk string, chunkBytes int64, content io.Reader, a agentsdk.ConversationAuthority) (nextOffset int64, reference string, resultErr error) {
	if !hashPattern.MatchString(expected) || !hashPattern.MatchString(expectedChunk) || expectedBytes < 1 || expectedBytes > maxBytes || offset < 0 || chunkBytes < 1 || offset+chunkBytes > expectedBytes || content == nil {
		return 0, "", failure("bad_request", "attachment_content_mismatch")
	}
	err := f.locked(ctx, id, a, func(root *os.Root) error {
		if err := live(root, id); err != nil {
			return err
		}
		if present, err := exists(root, id+".bin"); err != nil {
			return err
		} else if present {
			info, statErr := root.Lstat(id + ".bin")
			if statErr != nil || !info.Mode().IsRegular() || info.Mode().Perm()&0077 != 0 || info.Size() != expectedBytes {
				return failure("unavailable", "attachment_content_mismatch")
			}
			if err = verifiedChunk(content, chunkBytes, expectedChunk); err != nil {
				return err
			}
			nextOffset, reference = expectedBytes, id+":"+expected
			return nil
		}
		if err := root.Remove(id + ".pending"); err != nil && !errors.Is(err, os.ErrNotExist) {
			return failure("unavailable", "attachment_storage_unavailable")
		}
		staged := id + ".upload"
		file, err := root.OpenFile(staged, os.O_CREATE|os.O_RDWR, 0600)
		if err != nil {
			return failure("unavailable", "attachment_storage_unavailable")
		}
		closed := false
		defer func() {
			if !closed {
				_ = file.Close()
			}
		}()
		publish := func() error {
			if _, seekErr := file.Seek(0, io.SeekStart); seekErr != nil {
				return failure("unavailable", "attachment_storage_unavailable")
			}
			whole := sha256.New()
			readBytes, readErr := io.CopyBuffer(whole, file, make([]byte, 128*1024))
			if readErr != nil || readBytes != expectedBytes || hex.EncodeToString(whole.Sum(nil)) != expected {
				return failure("bad_request", "attachment_content_mismatch")
			}
			if closeErr := file.Close(); closeErr != nil {
				return failure("unavailable", "attachment_storage_unavailable")
			}
			closed = true
			if renameErr := root.Rename(staged, id+".bin"); renameErr != nil {
				return failure("unavailable", "attachment_storage_unavailable")
			}
			if syncErr := syncDir(root); syncErr != nil {
				return failure("unavailable", "attachment_storage_unavailable")
			}
			reference = id + ":" + expected
			return nil
		}
		info, err := file.Stat()
		if err != nil || !info.Mode().IsRegular() || info.Mode().Perm()&0077 != 0 || info.Size() < 0 || info.Size() > expectedBytes {
			return failure("unavailable", "attachment_storage_unavailable")
		}
		current := info.Size()
		if offset < current {
			if offset+chunkBytes > current {
				return failure("conflict", "attachment_upload_offset_conflict")
			}
			if err = verifiedChunk(content, chunkBytes, expectedChunk); err != nil {
				return err
			}
			digest := sha256.New()
			if _, err = io.CopyBuffer(digest, io.NewSectionReader(file, offset, chunkBytes), make([]byte, 128*1024)); err != nil || hex.EncodeToString(digest.Sum(nil)) != expectedChunk {
				return failure("conflict", "attachment_upload_content_conflict")
			}
			nextOffset = current
			if current == expectedBytes {
				return publish()
			}
			return nil
		}
		if offset != current {
			return failure("conflict", "attachment_upload_offset_conflict")
		}
		if _, err = file.Seek(current, io.SeekStart); err != nil {
			return failure("unavailable", "attachment_storage_unavailable")
		}
		digest := sha256.New()
		limited := &io.LimitedReader{R: content, N: chunkBytes + 1}
		written, writeErr := io.CopyBuffer(io.MultiWriter(file, digest), limited, make([]byte, 128*1024))
		if writeErr != nil || written != chunkBytes || limited.N != 1 || hex.EncodeToString(digest.Sum(nil)) != expectedChunk {
			_ = file.Truncate(current)
			return failure("bad_request", "attachment_content_mismatch")
		}
		if err = file.Sync(); err != nil {
			_ = file.Truncate(current)
			return failure("unavailable", "attachment_storage_unavailable")
		}
		nextOffset = current + chunkBytes
		if nextOffset < expectedBytes {
			return nil
		}
		return publish()
	})
	if err != nil {
		return 0, "", err
	}
	return nextOffset, reference, nil
}

func (f *Files) ReadAttachmentContent(ctx context.Context, id, reference string, a agentsdk.ConversationAuthority) ([]byte, error) {
	prefix := id + ":"
	if !strings.HasPrefix(reference, prefix) || !hashPattern.MatchString(strings.TrimPrefix(reference, prefix)) {
		return nil, failure("bad_request", "attachment_reference_invalid")
	}
	var raw []byte
	err := f.locked(ctx, id, a, func(root *os.Root) error {
		var err error
		raw, err = read(root, id, strings.TrimPrefix(reference, prefix))
		return err
	})
	if err == nil {
		err = ctx.Err()
	}
	return raw, err
}

// OpenAttachmentContent returns a seekable immutable snapshot without copying
// the body into memory. The content hash was verified before the atomic rename
// in PutAttachmentContent; reads revalidate the fenced reference, file type,
// private mode and exact byte count before exposing the descriptor. Callers
// must close the returned file.
func (f *Files) OpenAttachmentContent(ctx context.Context, id, reference string, expectedBytes, maxBytes int64, a agentsdk.ConversationAuthority) (io.ReadSeekCloser, error) {
	prefix := id + ":"
	if !strings.HasPrefix(reference, prefix) || !hashPattern.MatchString(strings.TrimPrefix(reference, prefix)) || expectedBytes < 1 || maxBytes < expectedBytes {
		return nil, failure("bad_request", "attachment_reference_invalid")
	}
	var content *os.File
	err := f.locked(ctx, id, a, func(root *os.Root) error {
		if err := live(root, id); err != nil {
			return err
		}
		info, err := root.Lstat(id + ".bin")
		if errors.Is(err, os.ErrNotExist) {
			return failure("not_found", "attachment_content_not_found")
		}
		if err != nil || !info.Mode().IsRegular() || info.Mode().Perm()&0077 != 0 || info.Size() != expectedBytes || info.Size() > maxBytes {
			return failure("unavailable", "attachment_content_mismatch")
		}
		content, err = root.Open(id + ".bin")
		if err != nil {
			return failure("unavailable", "attachment_storage_unavailable")
		}
		return nil
	})
	if err != nil {
		if content != nil {
			_ = content.Close()
		}
		return nil, err
	}
	if err = ctx.Err(); err != nil {
		_ = content.Close()
		return nil, err
	}
	return content, nil
}

func (f *Files) DeleteAttachmentContent(ctx context.Context, id string, a agentsdk.ConversationAuthority) error {
	return f.locked(ctx, id, a, func(root *os.Root) error {
		marker := id + ".deleted"
		if info, err := root.Lstat(marker); err == nil && (!info.Mode().IsRegular() || info.Mode().Perm()&0077 != 0) {
			return failure("unavailable", "attachment_storage_unavailable")
		}
		file, err := root.OpenFile(marker, os.O_CREATE|os.O_WRONLY, 0600)
		if err != nil {
			return failure("unavailable", "attachment_storage_unavailable")
		}
		err = file.Sync()
		closeErr := file.Close()
		if err != nil || closeErr != nil {
			return failure("unavailable", "attachment_storage_unavailable")
		}
		// Persist the irreversible fence before removing content. A crash between
		// these steps denies reads, and the same delete safely completes on retry.
		if err := syncDir(root); err != nil {
			return failure("unavailable", "attachment_storage_unavailable")
		}
		for _, suffix := range []string{".bin", ".pending", ".upload"} {
			if err := root.Remove(id + suffix); err != nil && !errors.Is(err, os.ErrNotExist) {
				return failure("unavailable", "attachment_storage_unavailable")
			}
		}
		if err := syncDir(root); err != nil {
			return failure("unavailable", "attachment_storage_unavailable")
		}
		return nil
	})
}

var _ agentsdk.TaskAttachmentStorage = (*Files)(nil)
