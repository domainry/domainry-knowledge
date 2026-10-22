package store

import (
	"encoding/hex"
	"strings"

	"github.com/domainry/domainry-foundation/entityid"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func validArtifactSHA(value string) bool {
	raw, err := hex.DecodeString(value)
	return err == nil && len(raw) == 32 && strings.ToLower(value) == value
}

func knowledgeDocumentReservationID(library, client, namespace string, authority knowledgesdk.Authority) (string, error) {
	parts := []string{conversationOwner(authority), library, client}
	if namespace != "" {
		parts = append(parts, namespace)
	}
	return entityid.Derive("kdoc", "knowledge.document", parts...)
}
