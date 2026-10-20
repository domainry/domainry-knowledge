package application

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"io"
	"strings"

	knowledgecontract "github.com/domainry/domainry-knowledge-sdk/contract"
)

type documentSecurityChain struct {
	scanners []knowledgecontract.DocumentSecurityScanner
}

func ChainDocumentSecurityScanners(scanners ...knowledgecontract.DocumentSecurityScanner) (knowledgecontract.DocumentSecurityScanner, error) {
	for _, scanner := range scanners {
		if scanner == nil {
			return nil, fmt.Errorf("document security chain contains a nil scanner")
		}
	}
	if len(scanners) == 0 {
		return nil, fmt.Errorf("document security chain is empty")
	}
	return documentSecurityChain{scanners: append([]knowledgecontract.DocumentSecurityScanner(nil), scanners...)}, nil
}

func (chain documentSecurityChain) ScanKnowledgeDocument(ctx context.Context, input knowledgecontract.KnowledgeDocumentSecurityInput) (knowledgecontract.KnowledgeDocumentSecurityResult, error) {
	if input.Content == nil {
		return knowledgecontract.KnowledgeDocumentSecurityResult{}, fmt.Errorf("document security content is unavailable")
	}
	var names, evidence []string
	for _, scanner := range chain.scanners {
		if _, err := input.Content.Seek(0, io.SeekStart); err != nil {
			return knowledgecontract.KnowledgeDocumentSecurityResult{}, err
		}
		result, err := scanner.ScanKnowledgeDocument(ctx, input)
		if err != nil {
			return knowledgecontract.KnowledgeDocumentSecurityResult{}, err
		}
		_, reportError := hex.DecodeString(result.ReportSHA256)
		if result.Scanner == "" || len(result.Scanner) > 128 || strings.ContainsAny(result.Scanner, "\r\n\x00") || len(result.ReportSHA256) != 64 || reportError != nil || len(result.ErrorCode) > 128 || strings.ContainsAny(result.ErrorCode, "\r\n\x00") {
			return knowledgecontract.KnowledgeDocumentSecurityResult{}, fmt.Errorf("document security scanner returned invalid evidence")
		}
		if result.Clean == (result.ErrorCode != "") {
			return knowledgecontract.KnowledgeDocumentSecurityResult{}, fmt.Errorf("document security scanner returned an invalid decision")
		}
		names = append(names, result.Scanner)
		evidence = append(evidence, result.Scanner+":"+result.ReportSHA256+":"+result.ErrorCode)
		if !result.Clean {
			return chainedDocumentSecurityResult(input.Document.SHA256, names, evidence, result.ErrorCode), nil
		}
	}
	return chainedDocumentSecurityResult(input.Document.SHA256, names, evidence, ""), nil
}

func chainedDocumentSecurityResult(documentSHA256 string, names, evidence []string, errorCode string) knowledgecontract.KnowledgeDocumentSecurityResult {
	name := strings.Join(names, "+")
	if len(name) > 128 {
		name = "domainry.security-chain.v1"
	}
	report := sha256.Sum256([]byte(documentSHA256 + "\n" + strings.Join(evidence, "\n")))
	return knowledgecontract.KnowledgeDocumentSecurityResult{Clean: errorCode == "", Scanner: name, ReportSHA256: hex.EncodeToString(report[:]), ErrorCode: errorCode}
}

var _ knowledgecontract.DocumentSecurityScanner = documentSecurityChain{}
