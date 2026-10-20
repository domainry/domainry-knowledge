package application

import (
	"context"
	"sync"
	"testing"
	"time"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
)

type uploadExpirySweep struct {
	before time.Time
	limit  int
}

type uploadExpiryWorkerRepository struct {
	persistence.KnowledgeDocumentRepository
	once   sync.Once
	called chan uploadExpirySweep
}

func (*uploadExpiryWorkerRepository) ClaimKnowledgeDocumentWork(context.Context, string, string, time.Time, time.Duration) (persistence.KnowledgeDocumentLease, bool, error) {
	return persistence.KnowledgeDocumentLease{}, false, nil
}

func (*uploadExpiryWorkerRepository) TouchKnowledgeDocumentUpload(context.Context, string, agentsdk.Authority) (persistence.KnowledgeDocumentRecord, error) {
	return persistence.KnowledgeDocumentRecord{}, nil
}

func (repo *uploadExpiryWorkerRepository) ExpireKnowledgeDocumentUploads(_ context.Context, _ string, before time.Time, limit int) (int, error) {
	repo.once.Do(func() { repo.called <- uploadExpirySweep{before: before, limit: limit} })
	return 0, nil
}

type uploadExpiryDocumentStorage struct {
	agentsdk.KnowledgeDocumentStorage
}

func TestKnowledgeDocumentWorkerSweepsIdleUploads(t *testing.T) {
	repo := &uploadExpiryWorkerRepository{called: make(chan uploadExpirySweep, 1)}
	service := NewService(repo, "runtime-a", Options{DocumentStorage: &uploadExpiryDocumentStorage{}}, nil)
	if _, err := service.KnowledgeDocumentWorkerTick(t.Context()); err != nil {
		t.Fatal(err)
	}

	select {
	case sweep := <-repo.called:
		if sweep.limit != knowledgeDocumentUploadExpiryBatchSize {
			t.Fatalf("expiry batch=%d", sweep.limit)
		}
		age := time.Since(sweep.before)
		if age < 24*time.Hour-time.Second || age > 24*time.Hour+time.Second {
			t.Fatalf("default upload idle timeout age=%s", age)
		}
	case <-time.After(time.Second):
		t.Fatal("document worker did not sweep idle uploads")
	}
}
