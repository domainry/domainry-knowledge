package application

import (
	"archive/zip"
	"bytes"
	"crypto/sha256"
	"encoding/hex"
	"testing"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgecontract "github.com/domainry/domainry-knowledge-sdk/contract"
)

func securityDocument(filename string, content []byte) agentsdk.KnowledgeDocument {
	digest := sha256.Sum256(content)
	return agentsdk.KnowledgeDocument{Filename: filename, Bytes: int64(len(content)), SHA256: hex.EncodeToString(digest[:])}
}

func TestBuiltinDocumentSecurityAcceptsCleanUTF8Text(t *testing.T) {
	content := []byte("Domainry 知识库\n安全内容")
	result, err := (builtinDocumentSecurity{}).ScanKnowledgeDocument(t.Context(), knowledgecontract.KnowledgeDocumentSecurityInput{Document: securityDocument("notes.txt", content), Content: bytes.NewReader(content)})
	if err != nil || !result.Clean || result.Scanner != builtinDocumentScanner || len(result.ReportSHA256) != 64 {
		t.Fatalf("result=%+v err=%v", result, err)
	}
}

func TestBuiltinDocumentSecurityRejectsMalwareTestSignature(t *testing.T) {
	content := []byte("prefix EICAR-STANDARD-ANTIVIRUS-TEST-FILE suffix")
	result, err := (builtinDocumentSecurity{}).ScanKnowledgeDocument(t.Context(), knowledgecontract.KnowledgeDocumentSecurityInput{Document: securityDocument("notes.txt", content), Content: bytes.NewReader(content)})
	if err != nil || result.Clean || result.ErrorCode != "document_malware_detected" {
		t.Fatalf("result=%+v err=%v", result, err)
	}
}

func TestBuiltinDocumentSecurityRejectsActiveOfficeContent(t *testing.T) {
	var content bytes.Buffer
	writer := zip.NewWriter(&content)
	for name, body := range map[string]string{
		"[Content_Types].xml": "<Types/>",
		"word/document.xml":   "<document/>",
		"word/vbaProject.bin": "macro",
	} {
		entry, err := writer.Create(name)
		if err != nil {
			t.Fatal(err)
		}
		_, _ = entry.Write([]byte(body))
	}
	if err := writer.Close(); err != nil {
		t.Fatal(err)
	}
	raw := content.Bytes()
	result, err := (builtinDocumentSecurity{}).ScanKnowledgeDocument(t.Context(), knowledgecontract.KnowledgeDocumentSecurityInput{Document: securityDocument("unsafe.docx", raw), Content: bytes.NewReader(raw)})
	if err != nil || result.Clean || result.ErrorCode != "document_active_content_rejected" {
		t.Fatalf("result=%+v err=%v", result, err)
	}
}

func TestBuiltinDocumentSecurityAcceptsBuilderMediaMagic(t *testing.T) {
	tests := map[string][]byte{
		"image.bmp":  append([]byte("BM"), make([]byte, 14)...),
		"audio.mp3":  append([]byte("ID3"), make([]byte, 13)...),
		"audio.wav":  []byte("RIFF\x00\x00\x00\x00WAVEdata"),
		"audio.ogg":  []byte("OggS\x00\x00\x00\x00"),
		"audio.flac": []byte("fLaC\x00\x00\x00\x00"),
		"audio.m4a":  []byte("\x00\x00\x00\x18ftypM4A \x00\x00\x00\x00"),
		"audio.aac":  {0xff, 0xf1, 0x50, 0x80},
		"video.mp4":  []byte("\x00\x00\x00\x18ftypmp42\x00\x00\x00\x00"),
		"video.mov":  []byte("\x00\x00\x00\x18ftypqt  \x00\x00\x00\x00"),
		"video.webm": {0x1a, 0x45, 0xdf, 0xa3, 0x01, 0x00, 0x00, 0x00},
		"video.avi":  []byte("RIFF\x00\x00\x00\x00AVI data"),
	}
	for filename, content := range tests {
		t.Run(filename, func(t *testing.T) {
			result, err := (builtinDocumentSecurity{}).ScanKnowledgeDocument(t.Context(), knowledgecontract.KnowledgeDocumentSecurityInput{Document: securityDocument(filename, content), Content: bytes.NewReader(content)})
			if err != nil || !result.Clean {
				t.Fatalf("result=%+v err=%v", result, err)
			}
		})
	}
}

func TestBuiltinDocumentSecurityAcceptsBuilderTextAndPresentation(t *testing.T) {
	for _, filename := range []string{"notes.rst", "page.html", "events.jsonl", "main.go"} {
		content := []byte("Domainry 知识库\n")
		result, err := (builtinDocumentSecurity{}).ScanKnowledgeDocument(t.Context(), knowledgecontract.KnowledgeDocumentSecurityInput{Document: securityDocument(filename, content), Content: bytes.NewReader(content)})
		if err != nil || !result.Clean {
			t.Fatalf("%s result=%+v err=%v", filename, result, err)
		}
	}

	var content bytes.Buffer
	writer := zip.NewWriter(&content)
	for name, body := range map[string]string{"[Content_Types].xml": "<Types/>", "ppt/presentation.xml": "<presentation/>"} {
		entry, err := writer.Create(name)
		if err != nil {
			t.Fatal(err)
		}
		_, _ = entry.Write([]byte(body))
	}
	if err := writer.Close(); err != nil {
		t.Fatal(err)
	}
	raw := content.Bytes()
	result, err := (builtinDocumentSecurity{}).ScanKnowledgeDocument(t.Context(), knowledgecontract.KnowledgeDocumentSecurityInput{Document: securityDocument("deck.pptx", raw), Content: bytes.NewReader(raw)})
	if err != nil || !result.Clean {
		t.Fatalf("pptx result=%+v err=%v", result, err)
	}
}

func TestBuiltinDocumentSecurityAcceptsMacroFreeXLSMAndRejectsVBA(t *testing.T) {
	build := func(vba bool) []byte {
		var content bytes.Buffer
		writer := zip.NewWriter(&content)
		entries := map[string]string{
			"[Content_Types].xml": "<Types/>",
			"xl/workbook.xml":     "<workbook/>",
		}
		if vba {
			entries["xl/vbaProject.bin"] = "macro"
		}
		for name, body := range entries {
			entry, err := writer.Create(name)
			if err != nil {
				t.Fatal(err)
			}
			_, _ = entry.Write([]byte(body))
		}
		if err := writer.Close(); err != nil {
			t.Fatal(err)
		}
		return content.Bytes()
	}

	clean := build(false)
	result, err := (builtinDocumentSecurity{}).ScanKnowledgeDocument(t.Context(), knowledgecontract.KnowledgeDocumentSecurityInput{Document: securityDocument("budget.xlsm", clean), Content: bytes.NewReader(clean)})
	if err != nil || !result.Clean {
		t.Fatalf("clean xlsm result=%+v err=%v", result, err)
	}
	active := build(true)
	result, err = (builtinDocumentSecurity{}).ScanKnowledgeDocument(t.Context(), knowledgecontract.KnowledgeDocumentSecurityInput{Document: securityDocument("macro.xlsm", active), Content: bytes.NewReader(active)})
	if err != nil || result.Clean || result.ErrorCode != "document_active_content_rejected" {
		t.Fatalf("active xlsm result=%+v err=%v", result, err)
	}
}
