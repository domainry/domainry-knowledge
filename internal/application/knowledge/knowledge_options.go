package application

import (
	"fmt"
	"github.com/domainry/domainry-agent-sdk/persistence"
	"time"
)

func ValidateOptions(repo any, options *Options) error {
	if options.LibraryAuthorizer != nil {
		if _, ok := repo.(persistence.KnowledgeLibraryRepository); !ok {
			return fmt.Errorf("knowledge library authorization requires library persistence")
		}
	}
	if options.AttachmentStorage != nil {
		if _, ok := repo.(persistence.ConversationAttachmentRepository); !ok || options.AttachmentAuthorizer == nil {
			return fmt.Errorf("attachment storage requires attachment persistence and current authorization")
		}
	}
	if options.DocumentStorage != nil {
		if _, ok := repo.(persistence.KnowledgeDocumentRepository); !ok || options.LibraryAuthorizer == nil {
			return fmt.Errorf("document storage requires document persistence and library authorization")
		}
	}
	if err := ValidateAttachmentKnowledge(repo, options); err != nil {
		return err
	}
	if options.DocumentPoll == 0 {
		options.DocumentPoll = 2 * time.Second
	}
	if options.DocumentPoll < 10*time.Millisecond || options.DocumentPoll > time.Minute {
		return fmt.Errorf("invalid document polling interval")
	}
	if options.ArtifactExportTTL == 0 {
		options.ArtifactExportTTL = time.Hour
	}
	if options.ArtifactExportTTL < time.Second || options.ArtifactExportTTL > 24*time.Hour || options.ArtifactExportTTL%time.Second != 0 {
		return fmt.Errorf("invalid artifact export lifetime")
	}

	return nil
}
