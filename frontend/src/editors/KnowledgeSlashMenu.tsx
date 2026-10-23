import { ChevronRight, LockKeyhole, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { SuggestionMenuProps } from "@blocknote/react";
import { groupKnowledgeSlashMenuItems, type KnowledgeSlashMenuItem } from "./slashMenu.ts";

function itemClass(selected: boolean, disabled: boolean) {
  return `knowledge-slash-item${selected ? " is-selected" : ""}${disabled ? " is-disabled" : ""}`;
}

function SlashItem({ item, index, selected, onItemClick }: { item: KnowledgeSlashMenuItem; index: number; selected: boolean; onItemClick?: (item: KnowledgeSlashMenuItem) => void }) {
  const disabled = Boolean(item.disabledReason);
  return <div
    id={`bn-suggestion-menu-item-${index}`}
    className={itemClass(selected, disabled)}
    role="option"
    aria-selected={selected || undefined}
    aria-disabled={disabled || undefined}
    title={item.disabledReason}
    onMouseDown={event => event.preventDefault()}
    onClick={() => onItemClick?.(item)}
  >
    <span className="knowledge-slash-item-icon" aria-hidden="true">{item.icon}</span>
    <span className="knowledge-slash-item-copy"><strong>{item.title}</strong><small>{item.disabledReason || item.subtext}</small></span>
    {disabled ? <LockKeyhole className="knowledge-slash-lock" size={14} aria-hidden="true" /> : item.badge ? <span className="knowledge-slash-badge">{item.badge}</span> : null}
  </div>;
}

export function KnowledgeSlashMenu({ items, loadingState, selectedIndex, onItemClick }: SuggestionMenuProps<KnowledgeSlashMenuItem>) {
  const [hoveredSubmenu, setHoveredSubmenu] = useState("");
  const selectedItem = selectedIndex === undefined ? undefined : items[selectedIndex];
  const activeSubmenu = hoveredSubmenu || selectedItem?.submenu || "";
  const groups = useMemo(() => groupKnowledgeSlashMenuItems(items), [items]);
  const submenuItems = useMemo(() => groups.flatMap(group => group.entries).flatMap(entry => entry.kind === "submenu" && entry.label === activeSubmenu ? entry.items : []), [activeSubmenu, groups]);

  useEffect(() => {
    if (selectedIndex === undefined) return;
    document.getElementById(`bn-suggestion-menu-item-${selectedIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  return <div id="bn-suggestion-menu" className={`knowledge-slash-menu${activeSubmenu ? " has-submenu" : ""}`} role="listbox" aria-label="插入内容" onMouseLeave={() => setHoveredSubmenu("")}>
    <section className="knowledge-slash-main">
      <header>
        <span><Search size={14} aria-hidden="true" />继续输入以筛选</span>
        <span className="knowledge-slash-shortcuts" aria-hidden="true"><kbd>↑↓</kbd><kbd>Enter</kbd></span>
      </header>
      <div className="knowledge-slash-scroll">
        {groups.map(group => <div className="knowledge-slash-group" key={group.label}>
          <div className="knowledge-slash-group-label">{group.label}</div>
          {group.entries.map(entry => entry.kind === "item" ? <SlashItem key={`${entry.item.id}:${entry.index}`} item={entry.item} index={entry.index} selected={entry.index === selectedIndex} onItemClick={onItemClick} /> : <div
            key={`${group.label}:${entry.label}`}
            className={`knowledge-slash-item is-submenu${activeSubmenu === entry.label ? " is-selected" : ""}`}
            role="presentation"
            onMouseEnter={() => setHoveredSubmenu(entry.label)}
            onMouseDown={event => event.preventDefault()}
          >
            <span className="knowledge-slash-item-icon" aria-hidden="true">{entry.items[0]?.item.icon}</span>
            <span className="knowledge-slash-item-copy"><strong>{entry.label}</strong><small>{entry.items.length} 项内容</small></span>
            <ChevronRight size={15} aria-hidden="true" />
          </div>)}
        </div>)}
        {items.length === 0 && loadingState !== "loading-initial" && loadingState !== "loading" && <div className="knowledge-slash-empty">没有匹配的内容块</div>}
        {(loadingState === "loading-initial" || loadingState === "loading") && <div className="knowledge-slash-loading" role="status">正在查找…</div>}
      </div>
    </section>
    {activeSubmenu && <aside className="knowledge-slash-submenu" aria-label={activeSubmenu} onMouseEnter={() => setHoveredSubmenu(activeSubmenu)}>
      <header><strong>{activeSubmenu}</strong><small>{submenuItems.length} 项</small></header>
      <div className="knowledge-slash-scroll">{submenuItems.map(({ item, index }) => <SlashItem key={`${item.id}:${index}`} item={item} index={index} selected={index === selectedIndex} onItemClick={onItemClick} />)}</div>
    </aside>}
  </div>;
}

