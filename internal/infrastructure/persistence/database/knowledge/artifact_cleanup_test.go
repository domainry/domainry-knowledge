package store

import (
	"context"
	"errors"
	"io"
	"testing"
	"time"

	sharedartifact "github.com/domainry/domainry-foundation/artifact"
)

func TestReconcileGeneratedArtifactContentUsesTerminalStateBeforeDelete(t *testing.T) {
	now := time.Date(2026, 9, 23, 16, 0, 0, 0, time.UTC)
	shared := &generatedCleanupTestStore{
		values: map[string]sharedartifact.Artifact{
			"expired": {ID: "expired", WorkspaceID: "workspace-a", Owner: sharedartifact.OwnerAgent, Kind: generatedArtifactKind, StorageReference: "expired.bin", Status: sharedartifact.StatusAvailable, ScanStatus: sharedartifact.ScanNotRequired, ExpiresAt: now.Add(-time.Second)},
			"future":  {ID: "future", WorkspaceID: "workspace-a", Owner: sharedartifact.OwnerAgent, Kind: generatedArtifactKind, StorageReference: "future.bin", Status: sharedartifact.StatusAvailable, ScanStatus: sharedartifact.ScanNotRequired, ExpiresAt: now.Add(time.Hour)},
		},
		content: map[string]bool{"expired.bin": true, "future.bin": true},
	}
	repository := New(nil, nil, ArtifactPersistence{Store: shared, Content: shared})
	changed, err := repository.ReconcileGeneratedArtifactContent(t.Context(), now, 10)
	if err != nil || changed != 2 {
		t.Fatalf("changed=%d err=%v", changed, err)
	}
	if shared.values["expired"].Status != sharedartifact.StatusDeleted || shared.deletedStatus != sharedartifact.StatusExpired || shared.content["expired.bin"] {
		t.Fatalf("expired=%#v delete status=%q content=%v", shared.values["expired"], shared.deletedStatus, shared.content)
	}
	if shared.values["future"].Status != sharedartifact.StatusAvailable || !shared.content["future.bin"] {
		t.Fatalf("future artifact was cleaned: artifact=%#v content=%v", shared.values["future"], shared.content)
	}
}

func TestSubjectErasureRetriesGeneratedContentFromTerminalState(t *testing.T) {
	now := time.Date(2026, 9, 23, 16, 0, 0, 0, time.UTC)
	value := sharedartifact.Artifact{ID: "subject-artifact", WorkspaceID: "workspace-a", Owner: sharedartifact.OwnerAgent, Kind: generatedArtifactKind, StorageReference: "subject.bin", Status: sharedartifact.StatusAvailable, ScanStatus: sharedartifact.ScanNotRequired, ExpiresAt: now.Add(time.Hour)}
	shared := &generatedCleanupTestStore{
		values: map[string]sharedartifact.Artifact{value.ID: value}, content: map[string]bool{value.StorageReference: true},
		deleteError: errors.New("temporary delete failure"),
	}
	lifecycle := SubjectLifecycle{store: New(nil, nil, ArtifactPersistence{Store: shared, Content: shared})}
	if _, err := lifecycle.deleteGeneratedArtifactContent(t.Context(), value); !errors.Is(err, shared.deleteError) {
		t.Fatalf("first delete err=%v", err)
	}
	if shared.values[value.ID].Status != sharedartifact.StatusExpired || shared.deletedStatus != sharedartifact.StatusExpired {
		t.Fatalf("failed delete state=%q observed=%q", shared.values[value.ID].Status, shared.deletedStatus)
	}
	shared.deleteError = nil
	deleted, err := lifecycle.deleteGeneratedArtifactContent(t.Context(), value)
	if err != nil || !deleted || shared.values[value.ID].Status != sharedartifact.StatusDeleted || shared.content[value.StorageReference] {
		t.Fatalf("retry deleted=%v artifact=%#v content=%v err=%v", deleted, shared.values[value.ID], shared.content, err)
	}
}

type generatedCleanupTestStore struct {
	values        map[string]sharedartifact.Artifact
	content       map[string]bool
	deletedStatus sharedartifact.Status
	deleteError   error
}

func (*generatedCleanupTestStore) Register(context.Context, sharedartifact.Artifact) (sharedartifact.Artifact, bool, error) {
	panic("unexpected Register")
}
func (s *generatedCleanupTestStore) ByID(_ context.Context, _, id string) (sharedartifact.Artifact, bool, error) {
	value, found := s.values[id]
	return value, found, nil
}
func (*generatedCleanupTestStore) ByDownloadTokenHash(context.Context, string, string) (sharedartifact.Artifact, bool, error) {
	panic("unexpected ByDownloadTokenHash")
}
func (s *generatedCleanupTestStore) Transition(_ context.Context, _, id string, expected, next sharedartifact.Status, scan sharedartifact.ScanStatus, at time.Time) (bool, error) {
	value, found := s.values[id]
	if !found || value.Status != expected {
		return false, nil
	}
	value.Status, value.ScanStatus, value.UpdatedAt = next, scan, at
	s.values[id] = value
	return true, nil
}
func (*generatedCleanupTestStore) Bind(context.Context, sharedartifact.Binding) (sharedartifact.Binding, bool, error) {
	panic("unexpected Bind")
}
func (*generatedCleanupTestStore) Bindings(context.Context, string, string) ([]sharedartifact.Binding, error) {
	panic("unexpected Bindings")
}
func (s *generatedCleanupTestStore) List(_ context.Context, _ string, query sharedartifact.Query) ([]sharedartifact.Artifact, error) {
	result := []sharedartifact.Artifact{}
	for _, value := range s.values {
		if value.Owner != query.Owner || value.Kind != query.Kind || !generatedCleanupContainsStatus(query.Statuses, value.Status) {
			continue
		}
		if !query.ExpiresAtOrBefore.IsZero() && (value.ExpiresAt.IsZero() || value.ExpiresAt.After(query.ExpiresAtOrBefore)) {
			continue
		}
		result = append(result, value)
	}
	return result, nil
}
func (*generatedCleanupTestStore) Update(context.Context, sharedartifact.Mutation) (bool, error) {
	panic("unexpected Update")
}
func (*generatedCleanupTestStore) Open(context.Context, string, string) (io.ReadCloser, error) {
	panic("unexpected Open")
}
func (*generatedCleanupTestStore) Stat(context.Context, string, string) (sharedartifact.ContentInfo, error) {
	panic("unexpected Stat")
}
func (s *generatedCleanupTestStore) Delete(_ context.Context, _ string, reference string) error {
	for _, value := range s.values {
		if value.StorageReference == reference {
			s.deletedStatus = value.Status
			break
		}
	}
	if s.deleteError != nil {
		return s.deleteError
	}
	delete(s.content, reference)
	return nil
}

func generatedCleanupContainsStatus(values []sharedartifact.Status, value sharedartifact.Status) bool {
	for _, candidate := range values {
		if candidate == value {
			return true
		}
	}
	return len(values) == 0
}
