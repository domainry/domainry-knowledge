package application

import (
	"bytes"
	"context"
	"testing"

	knowledgecontract "github.com/domainry/domainry-knowledge-sdk/contract"
)

type fixedDocumentSecurityScanner struct {
	result knowledgecontract.KnowledgeDocumentSecurityResult
	calls  int
}

func (scanner *fixedDocumentSecurityScanner) ScanKnowledgeDocument(context.Context, knowledgecontract.KnowledgeDocumentSecurityInput) (knowledgecontract.KnowledgeDocumentSecurityResult, error) {
	scanner.calls++
	return scanner.result, nil
}

func TestDocumentSecurityChainRequiresEveryScannerAndCombinesEvidence(t *testing.T) {
	content := []byte("safe content")
	external := &fixedDocumentSecurityScanner{result: knowledgecontract.KnowledgeDocumentSecurityResult{Clean: true, Scanner: "clamd.instream.v1", ReportSHA256: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"}}
	chain, err := ChainDocumentSecurityScanners(BuiltinDocumentSecurityScanner(), external)
	if err != nil {
		t.Fatal(err)
	}
	result, err := chain.ScanKnowledgeDocument(t.Context(), knowledgecontract.KnowledgeDocumentSecurityInput{Document: securityDocument("notes.txt", content), Content: bytes.NewReader(content)})
	if err != nil || !result.Clean || external.calls != 1 || result.Scanner != builtinDocumentScanner+"+clamd.instream.v1" || len(result.ReportSHA256) != 64 {
		t.Fatalf("result=%+v calls=%d err=%v", result, external.calls, err)
	}
}

func TestDocumentSecurityChainStopsBeforeExternalScannerOnStructuralRejection(t *testing.T) {
	content := []byte("not a pdf")
	external := &fixedDocumentSecurityScanner{result: knowledgecontract.KnowledgeDocumentSecurityResult{Clean: true, Scanner: "clamd.instream.v1", ReportSHA256: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"}}
	chain, err := ChainDocumentSecurityScanners(BuiltinDocumentSecurityScanner(), external)
	if err != nil {
		t.Fatal(err)
	}
	result, err := chain.ScanKnowledgeDocument(t.Context(), knowledgecontract.KnowledgeDocumentSecurityInput{Document: securityDocument("notes.pdf", content), Content: bytes.NewReader(content)})
	if err != nil || result.Clean || result.ErrorCode != "document_type_mismatch" || external.calls != 0 {
		t.Fatalf("result=%+v calls=%d err=%v", result, external.calls, err)
	}
}
