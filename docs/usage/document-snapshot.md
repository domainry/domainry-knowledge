# Checking a frozen managed-document reference before a business effect

The embedded Knowledge application implements the optional SDK
`KnowledgeDocumentSnapshotService`. `CheckKnowledgeDocumentSnapshot` receives
the current authority, one library and an exact document/content/index/hash
snapshot. Page projections additionally bind the original page and version.

The owner rechecks library download authorization, source-record authorization,
the active managed source binding, clean scan, ready/indexed lifecycle, content
version, index generation and SHA256. Pending replacement, deletion and
reindexing are denied. A page projection must pass its current page policy.
Access and metadata are resolved twice to reject a change observed during the
check. No original-content storage or remote search/fetch call is made.

This metadata-only capability lets a Runtime business operation verify the
managed Knowledge facts it already used without opening a second knowledge
store or calling a Provider from its write transaction. It is not a proof of
current external-provider search results, a durable access grant, an approval
decision or permission to disclose information to customers. The business owner
still binds the original generated output, checks its own state and enforces
the review/disclosure policy before sending anything.

Use the Runtime composition gateway rather than injecting the owner service or
repository into project Handlers. The capability is optional; an unsupported
remote/deployment binding must fail as unavailable, never downgrade to a plain
document metadata read. No public HTTP endpoint or Remote parity is claimed by
this slice.
