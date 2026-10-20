package documentsecurity

import (
	"bytes"
	"crypto/sha256"
	"encoding/binary"
	"encoding/hex"
	"fmt"
	"io"
	"net"
	"testing"
	"time"

	agentsdk "github.com/domainry/domainry-agent-sdk"
	knowledgecontract "github.com/domainry/domainry-knowledge-sdk/contract"
)

func fakeClamd(t *testing.T, response string) (string, <-chan []byte) {
	t.Helper()
	listener, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = listener.Close() })
	received, done := make(chan []byte, 1), make(chan error, 1)
	go func() {
		connection, acceptErr := listener.Accept()
		if acceptErr != nil {
			done <- acceptErr
			return
		}
		defer connection.Close()
		command := make([]byte, len("zINSTREAM\x00"))
		if _, acceptErr = io.ReadFull(connection, command); acceptErr != nil || string(command) != "zINSTREAM\x00" {
			done <- fmt.Errorf("invalid command: %q err=%v", command, acceptErr)
			return
		}
		var content bytes.Buffer
		header := make([]byte, 4)
		for {
			if _, acceptErr = io.ReadFull(connection, header); acceptErr != nil {
				done <- acceptErr
				return
			}
			size := binary.BigEndian.Uint32(header)
			if size == 0 {
				break
			}
			if size > 64*1024 {
				done <- fmt.Errorf("oversized chunk: %d", size)
				return
			}
			if _, acceptErr = io.CopyN(&content, connection, int64(size)); acceptErr != nil {
				done <- acceptErr
				return
			}
		}
		received <- content.Bytes()
		_, acceptErr = connection.Write(append([]byte(response), 0))
		done <- acceptErr
	}()
	t.Cleanup(func() {
		select {
		case serveErr := <-done:
			if serveErr != nil {
				t.Errorf("fake clamd: %v", serveErr)
			}
		case <-time.After(time.Second):
			t.Error("fake clamd did not finish")
		}
	})
	return listener.Addr().String(), received
}

func scanInput(content []byte) knowledgecontract.KnowledgeDocumentSecurityInput {
	digest := sha256.Sum256(content)
	return knowledgecontract.KnowledgeDocumentSecurityInput{Document: agentsdk.KnowledgeDocument{Filename: "notes.txt", Bytes: int64(len(content)), SHA256: hex.EncodeToString(digest[:])}, Content: bytes.NewReader(content)}
}

func TestClamdScannerStreamsWholeDocumentAndAcceptsCleanResult(t *testing.T) {
	address, received := fakeClamd(t, "stream: OK")
	scanner, err := NewClamdScanner("tcp", address, 5*time.Second)
	if err != nil {
		t.Fatal(err)
	}
	content := bytes.Repeat([]byte("domainry"), 20_000)
	result, err := scanner.ScanKnowledgeDocument(t.Context(), scanInput(content))
	if err != nil || !result.Clean || result.Scanner != clamdScannerName || len(result.ReportSHA256) != 64 {
		t.Fatalf("result=%+v err=%v", result, err)
	}
	if got := <-received; !bytes.Equal(got, content) {
		t.Fatalf("received %d bytes, want %d", len(got), len(content))
	}
}

func TestClamdScannerRejectsFoundSignature(t *testing.T) {
	address, _ := fakeClamd(t, "stream: Win.Test.EICAR_HDB-1 FOUND")
	scanner, err := NewClamdScanner("tcp", address, 5*time.Second)
	if err != nil {
		t.Fatal(err)
	}
	result, err := scanner.ScanKnowledgeDocument(t.Context(), scanInput([]byte("infected")))
	if err != nil || result.Clean || result.ErrorCode != "document_malware_detected" {
		t.Fatalf("result=%+v err=%v", result, err)
	}
}

func TestClamdScannerReportsDaemonStreamLimitAsTerminalRejection(t *testing.T) {
	address, _ := fakeClamd(t, "INSTREAM size limit exceeded. ERROR")
	scanner, err := NewClamdScanner("tcp", address, 5*time.Second)
	if err != nil {
		t.Fatal(err)
	}
	result, err := scanner.ScanKnowledgeDocument(t.Context(), scanInput([]byte("oversized for daemon policy")))
	if err != nil || result.Clean || result.ErrorCode != "document_security_size_unsupported" || len(result.ReportSHA256) != 64 {
		t.Fatalf("result=%+v err=%v", result, err)
	}
}
