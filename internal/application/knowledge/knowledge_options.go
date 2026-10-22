package application

import (
	"fmt"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
	"time"
)

func ValidateOptions(repo any, options *Options) error {
	if err := validateResourcePolicy(); err != nil {
		return err
	}
	if options.LibraryAuthorizer != nil {
		if _, ok := repo.(persistence.KnowledgeLibraryRepository); !ok {
			return fmt.Errorf("knowledge library authorization requires library persistence")
		}
	}
	if options.DocumentStorage != nil {
		if _, ok := repo.(persistence.KnowledgeDocumentRepository); !ok || options.LibraryAuthorizer == nil {
			return fmt.Errorf("document storage requires document persistence and library authorization")
		}
		if _, ok := repo.(knowledgeDocumentUploadRepository); !ok {
			return fmt.Errorf("document storage requires resumable upload lifecycle persistence")
		}
		if options.DocumentSecurity == nil {
			options.DocumentSecurity = builtinDocumentSecurity{}
		}
	}
	if options.DocumentPoll == 0 {
		options.DocumentPoll = 2 * time.Second
	}
	if options.DocumentPoll < 10*time.Millisecond || options.DocumentPoll > time.Minute {
		return fmt.Errorf("invalid document polling interval")
	}
	if options.DocumentWorkTimeout == 0 {
		options.DocumentWorkTimeout = 30 * time.Minute
	}
	if options.DocumentWorkTimeout < time.Minute || options.DocumentWorkTimeout > 2*time.Hour {
		return fmt.Errorf("invalid document work timeout")
	}
	if options.DocumentUploadIdleTimeout == 0 {
		options.DocumentUploadIdleTimeout = 24 * time.Hour
	}
	if options.DocumentUploadIdleTimeout < 5*time.Minute || options.DocumentUploadIdleTimeout > 30*24*time.Hour || options.DocumentUploadIdleTimeout%time.Second != 0 {
		return fmt.Errorf("invalid document upload idle timeout")
	}
	if options.WebhookPoll == 0 {
		options.WebhookPoll = 2 * time.Second
	}
	if options.WebhookPoll < 10*time.Millisecond || options.WebhookPoll > time.Minute {
		return fmt.Errorf("invalid webhook polling interval")
	}
	if options.AIPoll == 0 {
		options.AIPoll = 2 * time.Second
	}
	if options.AIPoll < 10*time.Millisecond || options.AIPoll > time.Minute {
		return fmt.Errorf("invalid AI polling interval")
	}
	if options.AIProvider != nil {
		if options.AccessExplainer == nil {
			return fmt.Errorf("Knowledge AI requires a current-principal resolver")
		}
		if _, ok := repo.(knowledgesdk.KnowledgeAIRepository); !ok {
			return fmt.Errorf("Knowledge AI requires execution persistence")
		}
	}
	if _, err := knowledgesdk.NewKnowledgeApplicationCardRegistry(options.ApplicationCardProviders...); err != nil {
		return err
	}
	return nil
}
