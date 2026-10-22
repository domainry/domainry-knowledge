# Domainry Knowledge UI design contract

## Identity

Domainry Knowledge is a calm editorial operations workspace: dense enough for long-running knowledge maintenance, but visually quiet enough that the document remains the primary object.

Evidence: the existing green product accent, the current knowledge/library workflows, the page tree, permissions and publishing states, and the requirement for multi-user editing visibility.

Attributes: precise, editorial, trustworthy, collaborative, restrained. Non-goals: consumer-style oversized cards, decorative gradients, pill-shaped controls everywhere, hiding operational state behind color alone, and nested bordered cards that repeat the same grouping.

## Color roles

- Canvas `#f3f5f2`: application background only.
- Surface `#ffffff`: document canvas, navigation and overlays.
- Subtle surface `#f7f9f6`: navigation selections, toolbars and secondary regions.
- Ink `#17221c`, secondary `#526158`, faint `#7d8982`: primary, supporting and metadata text.
- Border `#d9e0da`, strong border `#bcc9bf`: grouping and interactive boundaries.
- Brand/action `#176b52`, hover `#115840`: primary actions, focus and active navigation.
- Success `#16734f`, warning `#a76516`, danger `#b23a3a`, information `#315f9d`: status roles only.
- Selection `#e6f1eb` and focus ring `rgba(23,107,82,.20)`: selection and keyboard focus.
- Collaborator colors use the fixed accessible sequence `#176b52`, `#315f9d`, `#9a5a17`, `#7a4b9d`, `#a13f5b`; they identify people, never state.

## Typography

- UI: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `PingFang SC`, `Microsoft YaHei`, sans-serif.
- Editing: `SFMono-Regular`, `Cascadia Code`, `Menlo`, monospace.
- Page title 26/32, section title 15/22, body 14/24, label 12/18 semibold, metadata 12/18.
- Mixed Chinese/Latin copy must wrap naturally. Revisions, block counts and clocks use tabular numbers.

## Geometry and rhythm

- Spacing scale: 4, 8, 12, 16, 24, 32.
- Radius scale: 6 for controls, 10 for panels, 14 for overlays. Avatars and compact statuses may be circular.
- One-pixel dividers own hierarchy; shadows are reserved for the document canvas and overlays.
- Icons are 14–18px with consistent Lucide strokes.

## Layout and responsiveness

- Authentication uses a two-region editorial entry shell on wide screens: a quiet product-led knowledge preview and value statement on the left, and one focused white form surface on the right. It must not present a small floating card inside an otherwise empty decorative canvas. Below 900px the product preview yields to the form, with a compact brand lockup retained above the heading.
- Desktop page workspace: 260px navigation and a flexible document or native-editor canvas. Collaboration detail is an on-demand popover from the page header; it never reserves a permanent content column.
- Workbench-style native pages—multidimensional tables, spreadsheets, presentations, forms, whiteboards, mind maps and flowcharts—use the full width available to the right of the knowledge tree while editing. The 820px reading measure and 1080px document shell are for prose and file pages only; they must never clip a native editor's own navigation, stage or inspector columns.
- The product shell owns the outer boundary. Personal and team libraries are the primary scope navigation. Full-text search sits beside that scope navigation in one compact toolbar and is scoped to the selected library, never a competing navigation tab. A selected library has one everyday content surface: one mixed knowledge-entry rail and one selected detail surface. Native documents and each uploaded file are sibling entries reached from the same Feishu-style create menu; the rail must not add a permanent “资料文件” collection row. Sources, members and library metadata belong to one manager-only dialog. Search results temporarily replace the content surface.
- A personal library is a singleton and does not earn a second library-selection rail. Its page tree starts directly under the library header and opens the selected knowledge entry in the adjacent detail surface. Team scope keeps a library rail because a user may belong to multiple team libraries.
- The document measure is capped at 820px for reading and editing.
- Below 980px the collaboration rail moves below the editor; below 720px the page tree becomes a bounded top region and actions wrap by priority.
- Controls have at least 36px desktop height and 42px touch height.

## Component contracts

- Authentication forms use explicit labels, leading field icons, visible focus rings, a password visibility control and one full-width primary submit action. Loading and errors occupy the form flow rather than shifting the shell. The auth shell may illustrate existing search, collaboration and publishing capabilities, but must not imply unauthenticated access to workspace data or add unavailable recovery/SSO actions.
- The signed-in product header keeps identity text quiet and uses a compact icon-only logout action with an accessible name and hover title; logout must not compete with the workspace's primary actions.
- Navigation rows are flat, not cards. Selection uses a subtle fill, left accent and explicit text weight.
- Personal page organization is one compact secondary navigation row above the entry list: all pages, shortcuts and favorites remain immediately available; recent views, recent edits, subscriptions and trash live in one labelled overflow menu. It changes the existing rail's dataset rather than opening another workspace, and each collection owns explicit loading, empty, refresh and pagination states. Favorite, subscribe and shortcut are icon-only page-toolbar toggles with accessible pressed state; trash is the archived-page collection and restore returns the same stable page identity.
- Shared page metadata belongs to the stable page identity, not to one draft or published version. The page header summarizes status, owner, review time and tags; the compact page-properties view edits those fields plus typed custom properties. Unsaved header projections must say “未保存”, owners and person properties resolve only current library members, and metadata revision/CAS remains independent from page content revisions.
- Page references and backlinks are projections of the server-owned normalized reference graph, never a browser scan or copied-title list. “引用了谁” keeps an unavailable tombstone when the target is archived or no longer authorized, but exposes no target title or type; “被谁引用” omits every source page the current user cannot read. Visible titles and content types resolve from each page's current authorized projection, so rename, publish and ACL changes take effect without rewriting source blocks. Both directions paginate by opaque cursors and retain stable page and Block IDs for navigation.
- Knowledge-tree rows are selected by clicking anywhere on the entry label and reordered by direct drag. The upper and lower edge indicate sibling insertion; the center indicates nesting under that entry. Persistent up/down action arrows are forbidden because they duplicate the spatial drag model. Filtering and archived views do not expose partial-list sibling reordering.
- Disclosure chevrons belong only to branch nodes. Once a node's child list is resolved as empty, the glyph disappears while an equal-width spacer preserves title alignment; creating, moving or removing the last child refreshes this state from the server.
- One boundary owns each section. Child rows use spacing and dividers; upload drop zones, document previews, protected confirmations and dialogs are the only ordinary nested surfaces.
- View modes inside a selected knowledge entry use a compact tab strip; mutations such as publish remain visually separate.
- Backend resource types must not become primary navigation by default. Native documents and imported files appear as individual knowledge entries inside the content rail; upload remains an action in the create menu, never a second permanent navigation row. Source binding, membership and library metadata remain management sections. The selected library must not repeat a large title/description header when its scope is already clear from the surrounding navigation. Search results and management lists are flat rows with dividers, not independent cards.
- The create trigger opens a type menu for document, multidimensional table, spreadsheet, presentation, form, mind note, whiteboard, mind map, flowchart, and upload/import. Choosing a native type immediately creates a typed child under the selected entry, selects it, opens the matching editor, and focuses its title; there is no intermediate create form above the tree. Upload/import opens the file picker and the completed file itself becomes the entry. A page's `content_type` is immutable after creation, its structured content is versioned through the same draft/publish/history chain, and the server derives searchable plain text from the typed payload. Editable titles support explicit edit mode and the desktop convention of double-clicking the title.
- A file entry is a normal `file` page under the selected tree node, never a second document list. Its canonical page body stores only `document_id`, `display_mode`, and a display title; the immutable original, scan state, parsed content, index lifecycle, preview bytes, and download authorization remain owned by `KnowledgeDocument`. The UI resolves that reference on every open and renders an explicit unavailable state after deletion, quarantine, scan failure, or revoked access; it never persists a download URL in page content.
- Native knowledge entries are rendered through a content-type editor registry rather than one handwritten conditional component. Document and mind-note surfaces use BlockNote; multidimensional tables use AG Grid Community; spreadsheets use Univer Sheets; presentations use a Knowledge-owned 16:9 slide model and editor with PptxGenJS only as an export adapter; whiteboards use an Excalidraw-backed canvas; forms use the Form.io builder; mind maps use Mind Elixir; flowcharts use LogicFlow. Every engine is loaded only when its content type is selected and is wrapped by the same title, draft, publish, history and permission shell.
- `PageTypeDefinition` is the only frontend registration point for a page type: stable ID, capability bits, icon, labels, native create action, lazy editor, read-only renderer, preview renderer and importer are declared together. The workbench tree, create menu and `KnowledgeEditor` consume that registry; they do not carry parallel type switches. `BlockDefinition` performs the same job for BlockNote specs, Slash entries, read-only rendering ownership, server-validator IDs, text-extraction keys and required capabilities. Both registries reject duplicate or incomplete definitions during module initialization.
- Page and Block implementations are compile-time trusted code only. Stored content can select only a registered stable type; it cannot provide a component, script, HTML renderer, iframe or dynamic plugin. The server independently resolves its code-owned page/Block definitions, validates canonical content, extracts search text and references, and runs publish checks before creating an immutable version.
- Rich documents persist one canonical Block JSON tree; BlockNote binds that tree to a Y.Doc and Yjs merges block structure plus rich-text nodes. Daily edits carry a batched Yjs delta and canonical Block JSON produced from the same editor state; a full Yjs state is included only when the server-declared count or byte checkpoint threshold is due. The server serializes update clocks, validates the Block schema and content hash, keeps a bounded delta log, stores gzip checkpoints, and rejects stale writes so the client must merge and retry. Other native editor types persist their own typed JSON snapshot through whole-draft optimistic concurrency. Editor adapters may additionally receive the document collaboration binding, while third-party chrome is themed through Domainry semantic tokens rather than introducing a second visual system.
- Collaboration transport is an adapter boundary around `connect`, `sync`, ordered `stream`, `close`, and `publish`; canonical Block JSON, Y.Doc ownership, session IDs, server clocks, update IDs, checkpoints, ACL and immutable publishing do not depend on whether the adapter uses POST + SSE or WebSocket.
- POST + SSE remains the production transport until a controlled load test proves at least one unmet requirement after ordinary batching and gateway tuning: p95 durable edit latency above 250 ms for 15 minutes, more than 10 accepted update batches per user per second for high-frequency tools, p95 binary delta above 64 KiB with measured base64/HTTP overhead above 20%, more than 10,000 active streams per instance exceeding its file-descriptor or memory budget, or more than one transport reconnect per active session-hour caused by the SSE path. A WebSocket adapter must reuse the same session, clock, update-log, checkpoint, revocation and publish contracts; it may not introduce another content protocol.
- External clipboard content is an import boundary: BlockNote-owned clipboard payloads and authorized files keep their native handlers, Markdown and plain text are routed explicitly, and external or Office HTML is allowlist-sanitized before parsing. Block JSON, Markdown and printable PDF are read-only projections of the current editor state and never replace canonical Block JSON.
- Slash suggestions are derived from the trusted Block and Page Type registries. Grouping, search, nested presentation, hover/keyboard state, and bounded local recents are UI-only; permission and capability checks remain live, and disabled choices explain their missing capability.
- Forms use aligned label/control rows on wide screens and one column on narrow screens. A form section has no extra card when its parent already owns the work surface.
- Browser-native inputs keep native semantics but not native chrome: selects use the product chevron, checkboxes use the brand selection state, file inputs are represented by labelled product controls, and scroll regions share one restrained scrollbar treatment.
- Dialogs use one outer overlay surface; their headers, toolbars and content are divided regions rather than additional cards.
- The editor canvas owns the main elevation. Toolbars are divided regions inside it, not nested cards.
- Presence uses overlapping avatars plus an explicit online count. Opening that compact control shows one row per user with the current block, unique edited-block count and last heartbeat, without narrowing the editor.
- Connection, merge and publish states always include text and an icon; collaborator colors never encode success or failure.
- Permission and conflict notices use semantic bordered callouts, not generic cards.

## Motion and accessibility

- Feedback transitions are 120–180ms and limited to color, border and opacity.
- `prefers-reduced-motion` disables nonessential transitions and spinners.
- Every interactive element exposes a keyboard focus ring. Selected/online/conflict states have textual equivalents.
