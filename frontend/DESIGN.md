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

- Desktop page workspace: 260px navigation, flexible document canvas, 264px collaboration rail.
- The product shell owns the outer boundary. Personal and team libraries are the primary scope navigation. Full-text search sits beside that scope navigation in one compact toolbar and is scoped to the selected library, never a competing navigation tab. A selected library has one everyday content surface: one mixed knowledge-entry rail and one selected detail surface. Native documents and each uploaded file are sibling entries reached from the same Feishu-style create menu; the rail must not add a permanent “资料文件” collection row. Sources, members and library metadata belong to one manager-only dialog. Search results temporarily replace the content surface.
- A personal library is a singleton and does not earn a second library-selection rail. Its page tree starts directly under the library header and opens the selected knowledge entry in the adjacent detail surface. Team scope keeps a library rail because a user may belong to multiple team libraries.
- The document measure is capped at 820px for reading and editing.
- Below 980px the collaboration rail moves below the editor; below 720px the page tree becomes a bounded top region and actions wrap by priority.
- Controls have at least 36px desktop height and 42px touch height.

## Component contracts

- Navigation rows are flat, not cards. Selection uses a subtle fill, left accent and explicit text weight.
- One boundary owns each section. Child rows use spacing and dividers; upload drop zones, document previews, protected confirmations and dialogs are the only ordinary nested surfaces.
- View modes inside a selected knowledge entry use a compact tab strip; mutations such as publish remain visually separate.
- Backend resource types must not become primary navigation by default. Native documents and imported files appear as individual knowledge entries inside the content rail; upload remains an action in the create menu, never a second permanent navigation row. Source binding, membership and library metadata remain management sections. The selected library must not repeat a large title/description header when its scope is already clear from the surrounding navigation. Search results and management lists are flat rows with dividers, not independent cards.
- The create trigger opens a type menu for document, multidimensional table, spreadsheet, presentation, form, mind note, whiteboard, mind map, flowchart, and upload/import. Choosing a native type immediately creates a typed child under the selected entry, selects it, opens the matching editor, and focuses its title; there is no intermediate create form above the tree. Upload/import opens the file picker and the completed file itself becomes the entry. A page's `content_type` is immutable after creation, its structured content is versioned through the same draft/publish/history chain, and the server derives searchable plain text from the typed payload. Editable titles support explicit edit mode and the desktop convention of double-clicking the title.
- Native knowledge entries are rendered through a content-type editor registry rather than one handwritten conditional component. Document and mind-note surfaces use BlockNote; multidimensional tables use AG Grid Community; spreadsheets use Univer Sheets; presentations and whiteboards use Excalidraw-backed canvases; forms use the Form.io builder; mind maps use Mind Elixir; flowcharts use LogicFlow. Every engine is loaded only when its content type is selected and is wrapped by the same title, draft, publish, history and permission shell.
- Rich documents persist one canonical Block JSON tree; BlockNote binds that tree to a Y.Doc and Yjs merges block structure plus rich-text nodes. Every accepted collaboration update carries a Yjs checkpoint and the canonical Block JSON produced from the same editor state. The server serializes update clocks, validates the Block schema and content hash, stores the checkpoint, and rejects stale writes so the client must merge and retry. Other native editor types persist their own typed JSON snapshot through whole-draft optimistic concurrency. Editor adapters may additionally receive the document collaboration binding, while third-party chrome is themed through Domainry semantic tokens rather than introducing a second visual system.
- Forms use aligned label/control rows on wide screens and one column on narrow screens. A form section has no extra card when its parent already owns the work surface.
- Browser-native inputs keep native semantics but not native chrome: selects use the product chevron, checkboxes use the brand selection state, file inputs are represented by labelled product controls, and scroll regions share one restrained scrollbar treatment.
- Dialogs use one outer overlay surface; their headers, toolbars and content are divided regions rather than additional cards.
- The editor canvas owns the main elevation. Toolbars are divided regions inside it, not nested cards.
- Presence uses overlapping avatars plus an explicit online count. The collaboration rail lists one row per user with the current block, unique edited-block count and last heartbeat.
- Connection, merge and publish states always include text and an icon; collaborator colors never encode success or failure.
- Permission and conflict notices use semantic bordered callouts, not generic cards.

## Motion and accessibility

- Feedback transitions are 120–180ms and limited to color, border and opacity.
- `prefers-reduced-motion` disables nonessential transitions and spinners.
- Every interactive element exposes a keyboard focus ring. Selected/online/conflict states have textual equivalents.
