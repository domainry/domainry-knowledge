import { formatKnowledgeDate, kt, ktf } from "../i18n/runtime.ts";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import { AtSign, Bold, CalendarDays, CheckSquare2, Code2, Ellipsis, FileCode2, Italic, Link2, List, ListOrdered, Minus, Quote, Smile, Strikethrough, Type } from "lucide-react";
import { Button } from "../components.tsx";
import type { KnowledgePrincipal } from "../types.ts";

type MentionRange = { start: number; end: number };
type ComposerMenu = "format" | "emoji" | "more" | "";

const composerEmojis = ["😀", "😄", "😂", "🥰", "👍", "👏", "🎉", "❤️", "👀", "🚀", "✅", "💡"] as const;

export type MentionComposerProps = {
  value: string;
  mentionedUserIDs: string[];
  onChange(value: string): void;
  onMentionedUserIDsChange(userIDs: string[]): void;
  searchMembers(query: string, signal: AbortSignal): Promise<KnowledgePrincipal[]>;
  onMemberResolved?(member: KnowledgePrincipal): void;
  onSubmit(): void;
  placeholder: string;
  ariaLabel: string;
  submitLabel: string;
  submittingLabel?: string;
  submitting?: boolean;
  submitDisabled?: boolean;
  hint?: string;
  maxLength?: number;
  focusRequest?: number;
  className?: string;
};

function mentionRangeAt(value: string, caret: number): { range: MentionRange; query: string } | null {
  const prefix = value.slice(0, caret);
  const match = prefix.match(/(?:^|[\s([{\u201c\u2018])@([^@\s]*)$/u);
  if (!match || match.index === undefined) return null;
  const atOffset = match[0].lastIndexOf("@");
  return { range: { start: match.index + atOffset, end: caret }, query: match[1] || "" };
}

export function MentionComposer({
  value,
  mentionedUserIDs,
  onChange,
  onMentionedUserIDsChange,
  searchMembers,
  onMemberResolved,
  onSubmit,
  placeholder,
  ariaLabel,
  submitLabel,
  submittingLabel,
  submitting = false,
  submitDisabled = false,
  hint = kt("knowledge.auto.08efb11432dbc6b4"),
  maxLength = 16_384,
  focusRequest = 0,
  className = "",
}: MentionComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const composerRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRefs = useRef<Partial<Record<Exclude<ComposerMenu, "">, HTMLButtonElement | null>>>({});
  const mentionLabelsRef = useRef(new Map<string, string>());
  const [mention, setMention] = useState<{ range: MentionRange; query: string } | null>(null);
  const [candidates, setCandidates] = useState<KnowledgePrincipal[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [menu, setMenu] = useState<ComposerMenu>("");
  const [popoverStyle, setPopoverStyle] = useState<CSSProperties>({ visibility: "hidden" });

  useEffect(() => {
    if (!focusRequest) return;
    window.requestAnimationFrame(() => textareaRef.current?.focus());
  }, [focusRequest]);

  useEffect(() => {
    if (!mention) {
      setCandidates([]);
      setLoading(false);
      return;
    }
    const abort = new AbortController();
    setLoading(true);
    const timer = window.setTimeout(() => {
      void searchMembers(mention.query.trim(), abort.signal).then(items => {
        if (abort.signal.aborted) return;
        setCandidates(items.filter(item => item.status === "active"));
        setActiveIndex(0);
      }).catch(() => {
        if (!abort.signal.aborted) setCandidates([]);
      }).finally(() => {
        if (!abort.signal.aborted) setLoading(false);
      });
    }, 160);
    return () => {
      window.clearTimeout(timer);
      abort.abort();
    };
  }, [mention?.query, searchMembers]);

  useLayoutEffect(() => {
    if (!menu || !popoverRef.current) return;
    const anchor = menuButtonRefs.current[menu];
    if (!anchor) return;
    const position = () => {
      const popover = popoverRef.current;
      if (!popover) return;
      const anchorRect = anchor.getBoundingClientRect();
      const composerRect = composerRef.current?.getBoundingClientRect() || anchorRect;
      const popoverRect = popover.getBoundingClientRect();
      const margin = 12;
      const gap = 8;
      const spaceBelow = window.innerHeight - anchorRect.bottom - margin;
      const spaceAbove = anchorRect.top - margin;
      const openBelow = spaceBelow >= Math.min(popoverRect.height, 260) || spaceBelow >= spaceAbove;
      const availableHeight = Math.max(120, openBelow ? spaceBelow - gap : spaceAbove - gap);
      const top = openBelow ? anchorRect.bottom + gap : Math.max(margin, anchorRect.top - Math.min(popoverRect.height, availableHeight) - gap);
      const preferredLeft = menu === "emoji" ? anchorRect.left : composerRect.left;
      const left = Math.max(margin, Math.min(preferredLeft, window.innerWidth - popoverRect.width - margin));
      setPopoverStyle({ top, left, maxHeight: availableHeight, visibility: "visible" });
    };
    position();
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    return () => {
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
    };
  }, [menu]);

  useEffect(() => {
    if (!menu) return;
    const close = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!composerRef.current?.contains(target) && !popoverRef.current?.contains(target)) setMenu("");
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [menu]);

  function updateValue(next: string, caret: number) {
    onChange(next);
    setMenu("");
    const retained = mentionedUserIDs.filter(userID => {
      const label = mentionLabelsRef.current.get(userID);
      return !label || next.includes(`@${label}`);
    });
    if (retained.length !== mentionedUserIDs.length) onMentionedUserIDsChange(retained);
    setMention(mentionRangeAt(next, caret));
  }

  function replaceSelection(prefix: string, suffix = "", fallback = "") {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? value.length;
    const end = textarea?.selectionEnd ?? start;
    const selected = value.slice(start, end) || fallback;
    const next = `${value.slice(0, start)}${prefix}${selected}${suffix}${value.slice(end)}`;
    const selectionStart = start + prefix.length;
    const selectionEnd = selectionStart + selected.length;
    updateValue(next, selectionEnd + suffix.length);
    window.requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(selectionStart, selectionEnd);
    });
  }

  function insertText(text: string, mentionTrigger = false) {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? value.length;
    const end = textarea?.selectionEnd ?? start;
    const next = `${value.slice(0, start)}${text}${value.slice(end)}`;
    const caret = start + text.length;
    onChange(next);
    setMenu("");
    setMention(mentionTrigger ? mentionRangeAt(next, caret) : null);
    window.requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(caret, caret);
    });
  }

  function insertMention(member: KnowledgePrincipal) {
    if (!mention) return;
    const label = member.display_name || member.email || member.user_id;
    const token = `@${label}`;
    const next = `${value.slice(0, mention.range.start)}${token} ${value.slice(mention.range.end)}`;
    const caret = mention.range.start + token.length + 1;
    mentionLabelsRef.current.set(member.user_id, label);
    onChange(next);
    if (!mentionedUserIDs.includes(member.user_id)) onMentionedUserIDsChange([...mentionedUserIDs, member.user_id]);
    onMemberResolved?.(member);
    setMention(null);
    setCandidates([]);
    window.requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(caret, caret);
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      if (!submitting && !submitDisabled) onSubmit();
      return;
    }
    if (!mention || candidates.length === 0) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex(current => (current + direction + candidates.length) % candidates.length);
      return;
    }
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      insertMention(candidates[activeIndex] || candidates[0]);
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setMention(null);
      setCandidates([]);
    }
  }

  const menuID = `${ariaLabel.replace(/\s+/g, "-")}-mention-menu`;
  const menuPopover = menu ? <div ref={popoverRef} style={popoverStyle} className={`knowledge-composer-popover is-floating is-${menu}`} role="menu" aria-label={menu === "format" ? kt("knowledge.auto.87dfacebd8786686") : menu === "emoji" ? kt("knowledge.auto.b40ffb08299185d1") : kt("knowledge.auto.bafc324d9d0744f1")} onMouseDown={event => event.preventDefault()}>
    {menu === "format" && <>
      <button type="button" role="menuitem" onClick={() => replaceSelection("**", "**", kt("knowledge.auto.eb4d955648e50ef7"))}><Bold size={15} /><span><strong>{kt("knowledge.auto.5ceac65ed8ee2ca6")}</strong><small>{kt("knowledge.auto.6c29976ae1958917")}</small></span></button>
      <button type="button" role="menuitem" onClick={() => replaceSelection("*", "*", kt("knowledge.auto.1ebce64190dc9b39"))}><Italic size={15} /><span><strong>{kt("knowledge.auto.217901c51a44d8b1")}</strong><small>{kt("knowledge.auto.4a4ae902d0f956c6")}</small></span></button>
      <button type="button" role="menuitem" onClick={() => replaceSelection("~~", "~~", kt("knowledge.auto.d0a7a932150b9775"))}><Strikethrough size={15} /><span><strong>{kt("knowledge.auto.5b050892a8d5f07f")}</strong><small>{kt("knowledge.auto.c676963513636777")}</small></span></button>
      <button type="button" role="menuitem" onClick={() => replaceSelection("`", "`", kt("knowledge.auto.e6f04ffbaa424001"))}><Code2 size={15} /><span><strong>{kt("knowledge.auto.6711d91085b910f7")}</strong><small>{kt("knowledge.auto.5b704036e055b328")}</small></span></button>
      <button type="button" role="menuitem" onClick={() => replaceSelection("[", "](https://)", kt("knowledge.auto.6f64e476be601da2"))}><Link2 size={15} /><span><strong>{kt("knowledge.auto.305378ddd2b86b60")}</strong><small>{kt("knowledge.auto.f97ca032da59dc64")}</small></span></button>
      <button type="button" role="menuitem" onClick={() => replaceSelection("> ", "", kt("knowledge.auto.dad60ee6bdc98b74"))}><Quote size={15} /><span><strong>{kt("knowledge.auto.e0ec651f0dae7cf3")}</strong><small>{kt("knowledge.auto.ab30f2f7657cbcf9")}</small></span></button>
      <button type="button" role="menuitem" onClick={() => replaceSelection("- ", "", kt("knowledge.auto.795dec6ac7650b6e"))}><List size={15} /><span><strong>{kt("knowledge.auto.9ee5773e25a9d739")}</strong><small>{kt("knowledge.auto.b6ade44cef2c2b28")}</small></span></button>
      <button type="button" role="menuitem" onClick={() => replaceSelection("1. ", "", kt("knowledge.auto.795dec6ac7650b6e"))}><ListOrdered size={15} /><span><strong>{kt("knowledge.auto.5d0bb2712dc8b22b")}</strong><small>{kt("knowledge.auto.2237cf8c6307fc7f")}</small></span></button>
    </>}
    {menu === "emoji" && composerEmojis.map(emoji => <button key={emoji} type="button" role="menuitem" aria-label={ktf("knowledge.auto.50c35d572eb43d6d", { value0: emoji })} onClick={() => insertText(emoji)}>{emoji}</button>)}
    {menu === "more" && <>
      <button type="button" role="menuitem" onClick={() => insertText(formatKnowledgeDate(new Date(), { year: "numeric", month: "2-digit", day: "2-digit" }))}><CalendarDays size={15} /><span><strong>{kt("knowledge.auto.70d0c1b33626ba4b")}</strong><small>{kt("knowledge.auto.c444d45cdb7e3fcd")}</small></span></button>
      <button type="button" role="menuitem" onClick={() => insertText(`${value && !value.endsWith("\n") ? "\n" : ""}- [ ] `)}><CheckSquare2 size={15} /><span><strong>{kt("knowledge.auto.5e415ae2bb8630c1")}</strong><small>{kt("knowledge.auto.f55dc502ed138e36")}</small></span></button>
      <button type="button" role="menuitem" onClick={() => replaceSelection("```\n", "\n```", kt("knowledge.auto.cdc931b12a561a6d"))}><FileCode2 size={15} /><span><strong>{kt("knowledge.auto.ddb4a628815d1385")}</strong><small>{kt("knowledge.auto.80a4b3cf8ac2f7a7")}</small></span></button>
      <button type="button" role="menuitem" onClick={() => insertText(`${value && !value.endsWith("\n") ? "\n" : ""}---\n`)}><Minus size={15} /><span><strong>{kt("knowledge.auto.c64dd5eb2135d0ba")}</strong><small>{kt("knowledge.auto.7dd8584d0abf8e9f")}</small></span></button>
    </>}
  </div> : null;
  return <div ref={composerRef} className={`knowledge-mention-composer ${className}`.trim()}>
    <textarea
      ref={textareaRef}
      value={value}
      maxLength={maxLength}
      placeholder={placeholder}
      aria-label={ariaLabel}
      aria-autocomplete="list"
      aria-controls={mention ? menuID : undefined}
      aria-expanded={!!mention}
      onChange={event => updateValue(event.target.value, event.target.selectionStart)}
      onKeyDown={handleKeyDown}
    />
    {mention && <div id={menuID} className="knowledge-mention-composer-menu" role="listbox" aria-label={kt("knowledge.auto.d86a6f01457bc0ac")}>
      {candidates.length > 0 ? candidates.map((member, index) => <button key={member.user_id} type="button" role="option" aria-selected={index === activeIndex} onMouseDown={event => event.preventDefault()} onClick={() => insertMention(member)}>
        <span aria-hidden="true">{(member.display_name || member.email || "?").slice(0, 1)}</span>
        <strong>{member.display_name || member.email}</strong>
        {member.email && member.display_name && <small>{member.email}</small>}
      </button>) : <p>{loading ? kt("knowledge.auto.a0ce5a06b70d3652") : mention.query ? kt("knowledge.auto.ac51b03397450a1e") : kt("knowledge.auto.bff333b73aad08e5")}</p>}
    </div>}
    <footer>
      <div className="knowledge-composer-toolbar" aria-label={kt("knowledge.auto.c3c09faea1cd1fa8")}>
        <button ref={node => { menuButtonRefs.current.format = node; }} type="button" aria-label={kt("knowledge.auto.87dfacebd8786686")} title={kt("knowledge.auto.87dfacebd8786686")} aria-expanded={menu === "format"} onClick={() => setMenu(current => current === "format" ? "" : "format")}><Type size={17} /></button>
        <button ref={node => { menuButtonRefs.current.emoji = node; }} type="button" aria-label={kt("knowledge.auto.d405f59076940eb3")} title={kt("knowledge.auto.d405f59076940eb3")} aria-expanded={menu === "emoji"} onClick={() => setMenu(current => current === "emoji" ? "" : "emoji")}><Smile size={17} /></button>
        <button type="button" aria-label={kt("knowledge.auto.ef2f58033d8b216f")} title={kt("knowledge.auto.ef2f58033d8b216f")} onClick={() => insertText("@", true)}><AtSign size={18} /></button>
        <button ref={node => { menuButtonRefs.current.more = node; }} type="button" aria-label={kt("knowledge.auto.bafc324d9d0744f1")} title={kt("knowledge.auto.bafc324d9d0744f1")} aria-expanded={menu === "more"} onClick={() => setMenu(current => current === "more" ? "" : "more")}><Ellipsis size={18} /></button>
        <span>{hint}</span>
      </div>
      <Button className="primary" disabled={submitting || submitDisabled} onClick={onSubmit}>{submitting ? submittingLabel || kt("knowledge.auto.18931020ad52e63a") : submitLabel}</Button>
    </footer>
    {typeof document !== "undefined" && menuPopover ? createPortal(menuPopover, document.body) : null}
  </div>;
}

function renderInline(value: string): ReactNode[] {
  const tokens = value.split(/(\*\*[^*]+\*\*|~~[^~]+~~|`[^`]+`|\*[^*\n]+\*|\[[^\]\n]+\]\(https?:\/\/[^\s)]+\))/g);
  return tokens.map((token, index) => {
    if (token.startsWith("**") && token.endsWith("**")) return <strong key={index}>{token.slice(2, -2)}</strong>;
    if (token.startsWith("~~") && token.endsWith("~~")) return <del key={index}>{token.slice(2, -2)}</del>;
    if (token.startsWith("`") && token.endsWith("`")) return <code key={index}>{token.slice(1, -1)}</code>;
    if (token.startsWith("*") && token.endsWith("*")) return <em key={index}>{token.slice(1, -1)}</em>;
    const link = token.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
    if (link) return <a key={index} href={link[2]} target="_blank" rel="noreferrer">{link[1]}</a>;
    return token;
  });
}

export function ComposerContent({ value, className = "" }: { value: string; className?: string }) {
  const children: ReactNode[] = [];
  let code: string[] | null = null;
  for (const [index, line] of value.split("\n").entries()) {
    if (line === "```") {
      if (code) {
        children.push(<pre key={`code-${index}`}><code>{code.join("\n")}</code></pre>);
        code = null;
      } else code = [];
      continue;
    }
    if (code) {
      code.push(line);
      continue;
    }
    const todo = line.match(/^- \[([ xX])\]\s(.*)$/);
    if (todo) {
      children.push(<p className="is-check" key={index}><input type="checkbox" checked={todo[1].toLowerCase() === "x"} readOnly />{renderInline(todo[2])}</p>);
      continue;
    }
    if (line.trim() === "---") {
      children.push(<hr key={index} />);
      continue;
    }
    if (line.startsWith("> ")) children.push(<blockquote key={index}>{renderInline(line.slice(2))}</blockquote>);
    else if (line.startsWith("- ")) children.push(<p className="is-list" key={index}><span>•</span>{renderInline(line.slice(2))}</p>);
    const ordered = line.match(/^(\d+)\.\s(.+)$/);
    if (ordered) children.push(<p className="is-list" key={index}><span>{ordered[1]}.</span>{renderInline(ordered[2])}</p>);
    else if (!line.startsWith("> ") && !line.startsWith("- ")) children.push(<p key={index}>{renderInline(line) || <br />}</p>);
  }
  if (code) children.push(<pre key="code-final"><code>{code.join("\n")}</code></pre>);
  return <div className={`knowledge-composer-content ${className}`.trim()}>{children}</div>;
}
