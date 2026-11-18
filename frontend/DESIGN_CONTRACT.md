# Enterprise Knowledge UI contract

## Product promise

Enterprise Knowledge should make document location, access scope, and system state immediately understandable during long desktop work sessions.

## Visual attributes

- Precise, quiet, and information-first.
- Dense enough for administration, but never cramped.
- Explicit about scope and consequences before an action.

## Hierarchy and surfaces

- Show the active knowledge base before any knowledge-base-scoped setting.
- Use one low-emphasis green scope surface; keep lists and forms flat underneath it.
- Prefer spacing and type hierarchy over repeated cards, borders, and dividers.
- Popovers are anchored to their control and never grow to the width of an unrelated form row.

## Typography and color

- Reuse the product font stack and existing text roles; do not introduce display fonts.
- Use the existing Verdent green only for selection, scope, and primary actions.
- Use neutral surfaces for content; danger colors are reserved for destructive actions.

## Interaction rules

- Library-level membership changes always name the active knowledge base.
- Knowledge-base creation is a two-step flow: basic information first, then optional authorization.
- Authorization uses separate member and organization tabs: members accept pasted email batches; organizations are selected from the Identity organization tree and never by typing an organization ID.
- Batch authorization is reviewed as a compact pending list before saving; the creator is always a manager.
- Page-level permissions remain visually separate from library membership.
- Stable success states stay quiet; surface only pending, failed, or actionable states.

## Non-goals

- No global theme replacement.
- No decorative gradients, glass effects, or dashboard-style metric cards.
- No hidden compatibility layer for earlier information architecture.
