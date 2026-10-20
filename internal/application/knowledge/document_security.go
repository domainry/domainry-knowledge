package application

import (
	"archive/zip"
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"io"
	"path"
	"strings"
	"unicode/utf8"

	knowledgecontract "github.com/domainry/domainry-knowledge-sdk/contract"
)

const builtinDocumentScanner = "domainry.file-structure-gate.v1"

type builtinDocumentSecurity struct{}

func (builtinDocumentSecurity) ScanKnowledgeDocument(ctx context.Context, input knowledgecontract.KnowledgeDocumentSecurityInput) (knowledgecontract.KnowledgeDocumentSecurityResult, error) {
	if input.Content == nil || input.Document.Bytes < 1 {
		return knowledgecontract.KnowledgeDocumentSecurityResult{}, fmt.Errorf("document security content is unavailable")
	}
	if _, err := input.Content.Seek(0, io.SeekStart); err != nil {
		return knowledgecontract.KnowledgeDocumentSecurityResult{}, err
	}
	extension := strings.ToLower(path.Ext(input.Document.Filename))
	unsafeCode, err := inspectDocumentStream(ctx, input.Content, extension)
	if err != nil {
		return knowledgecontract.KnowledgeDocumentSecurityResult{}, err
	}
	if unsafeCode == "" && (extension == ".docx" || extension == ".pptx" || extension == ".xlsx" || extension == ".xlsm") {
		if _, err = input.Content.Seek(0, io.SeekStart); err != nil {
			return knowledgecontract.KnowledgeDocumentSecurityResult{}, err
		}
		unsafeCode, err = inspectOfficeArchive(ctx, input.Content, input.Document.Bytes, extension)
		if err != nil {
			return knowledgecontract.KnowledgeDocumentSecurityResult{}, err
		}
	}
	result := knowledgecontract.KnowledgeDocumentSecurityResult{Clean: unsafeCode == "", Scanner: builtinDocumentScanner, ErrorCode: unsafeCode}
	report := sha256.Sum256([]byte(strings.Join([]string{builtinDocumentScanner, input.Document.SHA256, extension, fmt.Sprint(result.Clean), unsafeCode}, "\n")))
	result.ReportSHA256 = hex.EncodeToString(report[:])
	return result, nil
}

func inspectDocumentStream(ctx context.Context, content io.Reader, extension string) (string, error) {
	buffer := make([]byte, 128*1024)
	var first, overlap, utf8Tail []byte
	text := documentTextExtension(extension)
	for {
		if err := ctx.Err(); err != nil {
			return "", err
		}
		n, err := content.Read(buffer)
		if n > 0 {
			chunk := buffer[:n]
			if len(first) < 16 {
				missing := 16 - len(first)
				if missing > len(chunk) {
					missing = len(chunk)
				}
				first = append(first, chunk[:missing]...)
			}
			window := append(append([]byte(nil), overlap...), chunk...)
			upper := bytes.ToUpper(window)
			if bytes.Contains(upper, []byte("EICAR-STANDARD-ANTIVIRUS-TEST-FILE")) {
				return "document_malware_detected", nil
			}
			if extension == ".pdf" && (bytes.Contains(window, []byte("/JavaScript")) || bytes.Contains(window, []byte("/OpenAction")) || bytes.Contains(window, []byte("/Launch")) || bytes.Contains(window, []byte("/EmbeddedFile")) || bytes.Contains(window, []byte("/Encrypt"))) {
				return "document_active_content_rejected", nil
			}
			if text {
				if bytes.IndexByte(chunk, 0) >= 0 {
					return "document_text_binary_content", nil
				}
				combined := append(append([]byte(nil), utf8Tail...), chunk...)
				cut := completeUTF8Prefix(combined)
				if !utf8.Valid(combined[:cut]) {
					return "document_text_encoding_invalid", nil
				}
				utf8Tail = append(utf8Tail[:0], combined[cut:]...)
			}
			keep := 128
			if len(window) < keep {
				keep = len(window)
			}
			overlap = append(overlap[:0], window[len(window)-keep:]...)
		}
		if err == io.EOF {
			break
		}
		if err != nil {
			return "", err
		}
	}
	if text && (len(utf8Tail) > 0 && !utf8.Valid(utf8Tail)) {
		return "document_text_encoding_invalid", nil
	}
	if executableMagic(first) {
		return "document_executable_content_rejected", nil
	}
	if !documentMagicMatches(extension, first) {
		return "document_type_mismatch", nil
	}
	return "", nil
}

func completeUTF8Prefix(value []byte) int {
	if len(value) == 0 {
		return 0
	}
	start := len(value) - 1
	for start > 0 && len(value)-start < utf8.UTFMax && !utf8.RuneStart(value[start]) {
		start--
	}
	if utf8.FullRune(value[start:]) {
		return len(value)
	}
	return start
}

func executableMagic(value []byte) bool {
	return len(value) >= 4 && (bytes.HasPrefix(value, []byte("MZ")) || bytes.Equal(value[:4], []byte{0x7f, 'E', 'L', 'F'}) || bytes.Equal(value[:4], []byte{0xfe, 0xed, 0xfa, 0xce}) || bytes.Equal(value[:4], []byte{0xfe, 0xed, 0xfa, 0xcf}) || bytes.Equal(value[:4], []byte{0xcf, 0xfa, 0xed, 0xfe}))
}

func documentTextExtension(extension string) bool {
	switch extension {
	case ".txt", ".md", ".rst", ".html", ".htm", ".csv", ".json", ".jsonl",
		".py", ".js", ".ts", ".tsx", ".jsx", ".java", ".go", ".rs", ".c", ".h",
		".cpp", ".hpp", ".cs", ".rb", ".php", ".kt", ".swift", ".scala", ".sh":
		return true
	default:
		return false
	}
}

func documentMagicMatches(extension string, value []byte) bool {
	switch extension {
	case ".pdf":
		return bytes.HasPrefix(value, []byte("%PDF-"))
	case ".docx", ".pptx", ".xlsx", ".xlsm":
		return bytes.HasPrefix(value, []byte("PK\x03\x04")) || bytes.HasPrefix(value, []byte("PK\x05\x06"))
	case ".png":
		return len(value) >= 8 && bytes.Equal(value[:8], []byte{0x89, 'P', 'N', 'G', '\r', '\n', 0x1a, '\n'})
	case ".jpg", ".jpeg":
		return len(value) >= 3 && bytes.Equal(value[:3], []byte{0xff, 0xd8, 0xff})
	case ".gif":
		return bytes.HasPrefix(value, []byte("GIF87a")) || bytes.HasPrefix(value, []byte("GIF89a"))
	case ".bmp":
		return bytes.HasPrefix(value, []byte("BM"))
	case ".webp":
		return len(value) >= 12 && bytes.Equal(value[:4], []byte("RIFF")) && bytes.Equal(value[8:12], []byte("WEBP"))
	case ".mp3":
		return bytes.HasPrefix(value, []byte("ID3")) || len(value) >= 2 && value[0] == 0xff && value[1]&0xe0 == 0xe0
	case ".wav":
		return len(value) >= 12 && bytes.Equal(value[:4], []byte("RIFF")) && bytes.Equal(value[8:12], []byte("WAVE"))
	case ".ogg":
		return bytes.HasPrefix(value, []byte("OggS"))
	case ".flac":
		return bytes.HasPrefix(value, []byte("fLaC"))
	case ".aac":
		return len(value) >= 2 && value[0] == 0xff && value[1]&0xf6 == 0xf0
	case ".m4a", ".mp4", ".mov":
		return len(value) >= 12 && bytes.Equal(value[4:8], []byte("ftyp"))
	case ".webm":
		return len(value) >= 4 && bytes.Equal(value[:4], []byte{0x1a, 0x45, 0xdf, 0xa3})
	case ".avi":
		return len(value) >= 12 && bytes.Equal(value[:4], []byte("RIFF")) && bytes.Equal(value[8:12], []byte("AVI "))
	default:
		return documentTextExtension(extension)
	}
}

type seekReaderAt struct{ seeker io.ReadSeeker }

func (reader seekReaderAt) ReadAt(buffer []byte, offset int64) (int, error) {
	if _, err := reader.seeker.Seek(offset, io.SeekStart); err != nil {
		return 0, err
	}
	n, err := io.ReadFull(reader.seeker, buffer)
	if err == io.ErrUnexpectedEOF {
		err = io.EOF
	}
	return n, err
}

func inspectOfficeArchive(ctx context.Context, content io.ReadSeeker, size int64, extension string) (string, error) {
	var random io.ReaderAt = seekReaderAt{seeker: content}
	// Local files and object-backed readers provide real positional reads.
	// Prefer them so ZIP inspection does not mutate the sequential scan cursor
	// or reopen an unbounded object-store tail for every archive read.
	if readerAt, ok := content.(io.ReaderAt); ok {
		random = readerAt
	}
	archive, err := zip.NewReader(random, size)
	if err != nil || len(archive.File) == 0 || len(archive.File) > 10_000 {
		return "document_archive_invalid", nil
	}
	var compressed, expanded uint64
	required := "word/document.xml"
	if extension == ".xlsx" || extension == ".xlsm" {
		required = "xl/workbook.xml"
	} else if extension == ".pptx" {
		required = "ppt/presentation.xml"
	}
	foundTypes, foundRequired := false, false
	for _, file := range archive.File {
		if err := ctx.Err(); err != nil {
			return "", err
		}
		name := strings.ToLower(strings.ReplaceAll(file.Name, "\\", "/"))
		clean := path.Clean(name)
		if clean == "." || strings.HasPrefix(clean, "../") || strings.HasPrefix(clean, "/") || file.Flags&1 != 0 {
			return "document_archive_unsafe", nil
		}
		if name == "[content_types].xml" {
			foundTypes = true
		}
		if name == required {
			foundRequired = true
		}
		if strings.Contains(name, "vbaproject") || strings.Contains(name, "/activex/") || strings.Contains(name, "/embeddings/") || strings.HasSuffix(name, ".exe") || strings.HasSuffix(name, ".dll") || strings.HasSuffix(name, ".js") {
			return "document_active_content_rejected", nil
		}
		compressed += file.CompressedSize64
		expanded += file.UncompressedSize64
		if expanded > 4<<30 || expanded > compressed*200+(16<<20) {
			return "document_archive_expansion_limit", nil
		}
		entry, openErr := file.Open()
		if openErr != nil {
			return "document_archive_invalid", nil
		}
		limited := &io.LimitedReader{R: entry, N: int64(file.UncompressedSize64) + 1}
		unsafeCode, scanErr := inspectArchiveEntry(ctx, limited)
		closeErr := entry.Close()
		if scanErr != nil {
			return "", scanErr
		}
		if closeErr != nil || limited.N != 1 {
			return "document_archive_invalid", nil
		}
		if unsafeCode != "" {
			return unsafeCode, nil
		}
	}
	if !foundTypes || !foundRequired {
		return "document_office_structure_invalid", nil
	}
	return "", nil
}

func inspectArchiveEntry(ctx context.Context, content io.Reader) (string, error) {
	buffer := make([]byte, 64*1024)
	var overlap []byte
	for {
		if err := ctx.Err(); err != nil {
			return "", err
		}
		n, err := content.Read(buffer)
		if n > 0 {
			window := append(append([]byte(nil), overlap...), buffer[:n]...)
			if bytes.Contains(bytes.ToUpper(window), []byte("EICAR-STANDARD-ANTIVIRUS-TEST-FILE")) {
				return "document_malware_detected", nil
			}
			keep := 64
			if len(window) < keep {
				keep = len(window)
			}
			overlap = append(overlap[:0], window[len(window)-keep:]...)
		}
		if err == io.EOF {
			return "", nil
		}
		if err != nil {
			return "", err
		}
	}
}

var _ knowledgecontract.DocumentSecurityScanner = builtinDocumentSecurity{}

func BuiltinDocumentSecurityScanner() knowledgecontract.DocumentSecurityScanner {
	return builtinDocumentSecurity{}
}
