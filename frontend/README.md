# Domainry Knowledge UI

`@domainry/knowledge-ui` is the public React feature entrypoint owned by
`domainry-knowledge`. It renders knowledge search, document reading, managed
libraries, upload, lifecycle status, deletion, download, and bounded original
file preview. Search can target the configured default knowledge source or one
authorized managed library; the host remains responsible for enforcing the
requested `libraryID`.

The package deliberately does not know any product route, cookie, access token,
or Agent session. A consuming product implements `KnowledgeClient`, mounts the
component in its own shell, and imports the semantic stylesheet:

```tsx
import { KnowledgeWorkspace, type KnowledgeClient } from "@domainry/knowledge-ui";
import "@domainry/knowledge-ui/styles.css";

export function KnowledgeRoute({ client }: { client: KnowledgeClient }) {
  return <KnowledgeWorkspace client={client} />;
}
```

The backend remains authoritative for authentication, authorization, document
identity, size and SHA-256 headers. The browser package never accepts provider
credentials and never infers permissions from visible controls.

Large-file behavior is bounded by contract rather than by a larger in-memory
limit. Upload SHA-256 is calculated incrementally from `File.stream()`. PDF
preview uses authorized 256 KiB HTTP ranges and loads PDF.js only after the
viewer opens. Text preview reads at most 512 KiB. DOCX, PPTX, XLSX, and XLSM
preview accept at most 8 MiB compressed input and reject macros, external
workbook links, unsafe archive paths, more than 32 MiB expanded content, and
format/container mismatches. PPTX preview intentionally extracts safe slide
text instead of executing or visually reproducing embedded content. Images are
bounded before blob creation; audio and video use the authorized same-origin
stream URL so the browser can issue ranges without copying the whole file. A host
`KnowledgeClient.readDocumentContent` implementation therefore must preserve
`Range`, `Content-Range`, `Content-Length`, `Content-Disposition`, and the
normalized `X-Domainry-File-SHA256` header.
