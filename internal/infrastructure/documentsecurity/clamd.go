package documentsecurity

import (
	"bufio"
	"context"
	"crypto/sha256"
	"encoding/binary"
	"encoding/hex"
	"fmt"
	"io"
	"net"
	"strings"
	"time"

	"github.com/domainry/domainry-foundation/telemetry"
	knowledgecontract "github.com/domainry/domainry-knowledge-sdk/contract"
)

const clamdScannerName = "clamd.instream.v1"

type clamdScanner struct {
	network string
	address string
	timeout time.Duration
}

func NewClamdScanner(network, address string, timeout time.Duration) (knowledgecontract.DocumentSecurityScanner, error) {
	network, address = strings.TrimSpace(network), strings.TrimSpace(address)
	if network != "tcp" && network != "tcp4" && network != "tcp6" && network != "unix" {
		return nil, fmt.Errorf("clamd network must be tcp, tcp4, tcp6, or unix")
	}
	if address == "" || len(address) > 1024 || strings.ContainsAny(address, "\r\n\x00") {
		return nil, fmt.Errorf("clamd address is invalid")
	}
	if timeout < time.Second || timeout > 2*time.Hour {
		return nil, fmt.Errorf("clamd timeout must be between one second and two hours")
	}
	return &clamdScanner{network: network, address: address, timeout: timeout}, nil
}

func (scanner *clamdScanner) ScanKnowledgeDocument(ctx context.Context, input knowledgecontract.KnowledgeDocumentSecurityInput) (result knowledgecontract.KnowledgeDocumentSecurityResult, returnErr error) {
	started := time.Now()
	defer func() {
		telemetry.RecordDependencyCall(ctx, telemetry.DependencyCall{
			Feature: telemetry.DiagnosticFeatureScanner, Dependency: "clamd", Operation: "scan",
			Input: map[string]any{"network": scanner.network, "document_bytes": input.Document.Bytes, "content_sha256": input.Document.SHA256},
		}, telemetry.DependencyResult{Output: map[string]any{
			"clean": result.Clean, "scanner": result.Scanner, "report_sha256": result.ReportSHA256, "error_code": result.ErrorCode,
		}, Err: returnErr}, time.Since(started))
	}()
	if input.Content == nil || input.Document.Bytes < 1 {
		return knowledgecontract.KnowledgeDocumentSecurityResult{}, fmt.Errorf("clamd document content is unavailable")
	}
	if _, err := input.Content.Seek(0, io.SeekStart); err != nil {
		return knowledgecontract.KnowledgeDocumentSecurityResult{}, err
	}
	conn, err := (&net.Dialer{Timeout: scanner.timeout}).DialContext(ctx, scanner.network, scanner.address)
	if err != nil {
		return knowledgecontract.KnowledgeDocumentSecurityResult{}, fmt.Errorf("connect clamd: %w", err)
	}
	defer conn.Close()
	deadline := time.Now().Add(scanner.timeout)
	if current, ok := ctx.Deadline(); ok && current.Before(deadline) {
		deadline = current
	}
	if err = conn.SetDeadline(deadline); err != nil {
		return knowledgecontract.KnowledgeDocumentSecurityResult{}, err
	}
	stop := context.AfterFunc(ctx, func() { _ = conn.SetDeadline(time.Now()) })
	defer stop()
	if err = writeAll(conn, []byte("zINSTREAM\x00")); err != nil {
		return knowledgecontract.KnowledgeDocumentSecurityResult{}, fmt.Errorf("start clamd stream: %w", err)
	}
	buffer, header := make([]byte, 64*1024), make([]byte, 4)
	var total int64
	for {
		n, readErr := input.Content.Read(buffer)
		if n > 0 {
			total += int64(n)
			if total > input.Document.Bytes {
				return knowledgecontract.KnowledgeDocumentSecurityResult{}, fmt.Errorf("clamd input exceeds declared document length")
			}
			binary.BigEndian.PutUint32(header, uint32(n))
			if err = writeAll(conn, header); err == nil {
				err = writeAll(conn, buffer[:n])
			}
			if err != nil {
				return knowledgecontract.KnowledgeDocumentSecurityResult{}, fmt.Errorf("write clamd stream: %w", err)
			}
		}
		if readErr == io.EOF {
			break
		}
		if readErr != nil {
			return knowledgecontract.KnowledgeDocumentSecurityResult{}, readErr
		}
	}
	if total != input.Document.Bytes {
		return knowledgecontract.KnowledgeDocumentSecurityResult{}, fmt.Errorf("clamd input length mismatch")
	}
	if err = writeAll(conn, []byte{0, 0, 0, 0}); err != nil {
		return knowledgecontract.KnowledgeDocumentSecurityResult{}, fmt.Errorf("finish clamd stream: %w", err)
	}
	response, err := bufio.NewReader(io.LimitReader(conn, 4097)).ReadString(0)
	if err != nil || len(response) > 4096 || !strings.HasSuffix(response, "\x00") {
		return knowledgecontract.KnowledgeDocumentSecurityResult{}, fmt.Errorf("read clamd result: invalid response")
	}
	response = strings.TrimSuffix(response, "\x00")
	errorCode := ""
	if strings.HasSuffix(response, " FOUND") {
		errorCode = "document_malware_detected"
	} else if strings.Contains(strings.ToLower(response), "instream size limit exceeded") {
		errorCode = "document_security_size_unsupported"
	} else if !strings.HasSuffix(response, " OK") {
		return knowledgecontract.KnowledgeDocumentSecurityResult{}, fmt.Errorf("clamd scan failed")
	}
	report := sha256.Sum256([]byte(clamdScannerName + "\n" + input.Document.SHA256 + "\n" + response))
	return knowledgecontract.KnowledgeDocumentSecurityResult{Clean: errorCode == "", Scanner: clamdScannerName, ReportSHA256: hex.EncodeToString(report[:]), ErrorCode: errorCode}, nil
}

func writeAll(writer io.Writer, value []byte) error {
	for len(value) > 0 {
		n, err := writer.Write(value)
		if err != nil {
			return err
		}
		if n < 1 {
			return io.ErrUnexpectedEOF
		}
		value = value[n:]
	}
	return nil
}

var _ knowledgecontract.DocumentSecurityScanner = (*clamdScanner)(nil)
