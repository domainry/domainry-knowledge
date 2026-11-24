import { Building2, ChevronDown, ChevronRight, UserRound, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Button, Select } from "./components.tsx";
import { kt, ktf } from "./i18n/runtime.ts";
import type { KnowledgeClient, KnowledgeDirectoryMember, KnowledgeDirectoryOrganization, KnowledgeLibraryMember, KnowledgePrincipalDirectorySnapshot } from "./types.ts";

export type KnowledgeAccessTab = "members" | "organizations";
export type KnowledgeAccessMemberInput = { principal: KnowledgeDirectoryMember; role: KnowledgeLibraryMember["role"] };
export type KnowledgeAccessOrganizationInput = { organization: KnowledgeDirectoryOrganization; role: KnowledgeLibraryMember["role"] };

type DirectoryIndex = {
  organizations: KnowledgeDirectoryOrganization[];
  organizationByID: Map<string, KnowledgeDirectoryOrganization>;
  childrenByParent: Map<string, KnowledgeDirectoryOrganization[]>;
  members: KnowledgeDirectoryMember[];
  memberByEmail: Map<string, KnowledgeDirectoryMember>;
  roots: KnowledgeDirectoryOrganization[];
};

function buildDirectoryIndex(snapshot: KnowledgePrincipalDirectorySnapshot | null): DirectoryIndex {
  const organizations = (snapshot?.organizations || []).filter(item => item.status === "active");
  const organizationByID = new Map(organizations.map(item => [item.organization_id, item]));
  const childrenByParent = new Map<string, KnowledgeDirectoryOrganization[]>();
  for (const organization of organizations) {
    const parentID = organization.parent_id && organizationByID.has(organization.parent_id) ? organization.parent_id : "";
    childrenByParent.set(parentID, [...(childrenByParent.get(parentID) || []), organization]);
  }
  for (const children of childrenByParent.values()) children.sort((left, right) => left.sort_order - right.sort_order || left.display_name.localeCompare(right.display_name));
  const members = (snapshot?.members || []).filter(item => item.status === "active" && item.user_id !== snapshot?.current_user_id);
  return {
    organizations,
    organizationByID,
    childrenByParent,
    members,
    memberByEmail: new Map(members.filter(item => item.email).map(item => [item.email!.trim().toLowerCase(), item])),
    roots: childrenByParent.get("") || [],
  };
}

function parsedEmails(value: string) {
  return [...new Set((value.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || []).map(email => email.toLowerCase()))];
}

export function KnowledgeAccessTabs({ value, onChange, disabled = false }: { value: KnowledgeAccessTab; onChange(value: KnowledgeAccessTab): void; disabled?: boolean }) {
  return <nav className="knowledge-access-tabs" role="tablist" aria-label={kt("knowledge.access.authorization")}> 
    <button type="button" role="tab" aria-selected={value === "members"} disabled={disabled} onClick={() => onChange("members")}><UserRound size={14} />{kt("knowledge.access.members")}</button>
    <button type="button" role="tab" aria-selected={value === "organizations"} disabled={disabled} onClick={() => onChange("organizations")}><Building2 size={14} />{kt("knowledge.access.organizations")}</button>
  </nav>;
}

export function KnowledgeAccessSelector({ client, activeTab, busy, members, organizations, onMembersChange, onOrganizationsChange, defaultRole = "reader" }: {
  client: KnowledgeClient;
  activeTab: KnowledgeAccessTab;
  busy: boolean;
  members: KnowledgeAccessMemberInput[];
  organizations: KnowledgeAccessOrganizationInput[];
  onMembersChange(value: KnowledgeAccessMemberInput[]): void;
  onOrganizationsChange(value: KnowledgeAccessOrganizationInput[]): void;
  defaultRole?: KnowledgeLibraryMember["role"];
}) {
  const [directory, setDirectory] = useState<KnowledgePrincipalDirectorySnapshot | null>(null);
  const [loading, setLoading] = useState(true), [loadError, setLoadError] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [emailText, setEmailText] = useState(""), [memberRole, setMemberRole] = useState<KnowledgeLibraryMember["role"]>(defaultRole);
  const [pendingMembers, setPendingMembers] = useState<KnowledgeDirectoryMember[]>([]);
  const [memberSuggestions, setMemberSuggestions] = useState<KnowledgeDirectoryMember[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false), [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [organizationRole, setOrganizationRole] = useState<KnowledgeLibraryMember["role"]>(defaultRole);
  const [resolving, setResolving] = useState(false), [inputError, setInputError] = useState("");
  const memberInputRef = useRef<HTMLInputElement>(null);
  const index = useMemo(() => buildDirectoryIndex(directory), [directory]);
  const selectedOrganizationIDs = useMemo(() => new Set(organizations.map(item => item.organization.organization_id)), [organizations]);
  const unavailableMemberIDs = useMemo(() => new Set([
    directory?.current_user_id || "",
    ...members.map(item => item.principal.user_id),
    ...pendingMembers.map(item => item.user_id),
  ]), [directory?.current_user_id, members, pendingMembers]);
  const roleLabels: Record<KnowledgeLibraryMember["role"], string> = {
    reader: kt("knowledge.auto.534cb3fa8fbf373f"), editor: kt("knowledge.auto.051836569928a9f9"), manager: kt("knowledge.auto.bb6d995724f49a72"),
  };

  useEffect(() => {
    const abort = new AbortController();
    setLoading(true); setLoadError("");
    void client.getPrincipalDirectory(abort.signal).then(value => {
      if (abort.signal.aborted) return;
      setDirectory(value);
      setExpanded(new Set(value.organizations.filter(item => !item.parent_id).map(item => item.organization_id)));
    }).catch(failure => { if (!abort.signal.aborted) setLoadError(failure instanceof Error ? failure.message : kt("knowledge.auto.9e70e9e5866eb5cb")); })
      .finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [client]);

  useEffect(() => {
    const query = emailText.trim().toLocaleLowerCase();
    if (query.length < 2 || parsedEmails(emailText).length > 1) {
      setMemberSuggestions([]);
      setSuggestionsLoading(false);
      setActiveSuggestion(0);
      return;
    }

    const matchesQuery = (item: KnowledgeDirectoryMember) =>
      item.display_name.toLocaleLowerCase().includes(query) || item.email?.toLocaleLowerCase().includes(query);
    const available = (item: KnowledgeDirectoryMember) => item.status === "active" && !unavailableMemberIDs.has(item.user_id);
    const local = index.members.filter(item => available(item) && matchesQuery(item)).slice(0, 8);
    setMemberSuggestions(local);
    setActiveSuggestion(0);

    const abort = new AbortController();
    const timer = window.setTimeout(() => {
      setSuggestionsLoading(true);
      void client.searchPrincipals(emailText.trim(), "", 20, abort.signal).then(page => {
        if (abort.signal.aborted) return;
        const merged = new Map<string, KnowledgeDirectoryMember>();
        for (const item of [...local, ...page.items]) {
          if (available(item) && matchesQuery(item)) merged.set(item.user_id, item);
        }
        setMemberSuggestions([...merged.values()].slice(0, 8));
        setActiveSuggestion(0);
      }).catch(() => undefined).finally(() => {
        if (!abort.signal.aborted) setSuggestionsLoading(false);
      });
    }, 180);
    return () => {
      window.clearTimeout(timer);
      abort.abort();
    };
  }, [client, emailText, index.members, unavailableMemberIDs]);

  function selectMemberSuggestion(principal: KnowledgeDirectoryMember) {
    setPendingMembers(current => current.some(item => item.user_id === principal.user_id) ? current : [...current, principal]);
    setEmailText("");
    setInputError("");
    setSuggestionsOpen(false);
    setActiveSuggestion(0);
    window.requestAnimationFrame(() => memberInputRef.current?.focus());
  }

  function removePendingMember(userID: string) {
    setPendingMembers(current => current.filter(item => item.user_id !== userID));
    setInputError("");
  }

  async function resolveEmails(value: string) {
    const resolved: KnowledgeDirectoryMember[] = [];
    const unresolved: string[] = [];
    for (const email of parsedEmails(value)) {
      let principal = index.memberByEmail.get(email);
      if (!principal) {
        const page = await client.searchPrincipals(email, "", 20, AbortSignal.timeout(20_000));
        const match = page.items.find(item => item.status === "active" && item.email?.trim().toLowerCase() === email);
        if (match && match.user_id !== directory?.current_user_id) principal = { ...match };
      }
      if (principal && !members.some(item => item.principal.user_id === principal.user_id)) resolved.push(principal);
      else if (!principal) unresolved.push(email);
    }
    return { resolved, unresolved };
  }

  async function stageEmails(value: string) {
    if (!parsedEmails(value).length) return;
    setResolving(true); setInputError(""); setSuggestionsOpen(false);
    try {
      const { resolved, unresolved } = await resolveEmails(value);
      setPendingMembers(current => {
        const next = new Map(current.map(item => [item.user_id, item]));
        for (const principal of resolved) next.set(principal.user_id, principal);
        return [...next.values()];
      });
      setEmailText(unresolved.join(", "));
      if (unresolved.length) setInputError(ktf("knowledge.access.email_not_found", { value0: unresolved.join(", ") }));
    } finally { setResolving(false); }
  }

  async function addEmails() {
    const emails = parsedEmails(emailText);
    if (!emails.length && pendingMembers.length === 0) { setInputError(kt("knowledge.access.email_invalid")); return; }
    setResolving(true); setInputError("");
    try {
      const { resolved, unresolved } = emails.length ? await resolveEmails(emailText) : { resolved: [], unresolved: [] };
      const next = new Map(members.map(item => [item.principal.user_id, item]));
      for (const principal of [...pendingMembers, ...resolved]) next.set(principal.user_id, { principal, role: memberRole });
      onMembersChange([...next.values()]);
      setPendingMembers([]);
      setEmailText(unresolved.join("\n"));
      if (unresolved.length) setInputError(ktf("knowledge.access.email_not_found", { value0: unresolved.join(", ") }));
    } finally { setResolving(false); }
  }

  function toggleOrganization(organization: KnowledgeDirectoryOrganization, checked: boolean) {
    const next = new Map(organizations.map(item => [item.organization.organization_id, item]));
    if (checked) next.set(organization.organization_id, { organization, role: organizationRole });
    else next.delete(organization.organization_id);
    onOrganizationsChange([...next.values()]);
  }

  function renderOrganization(organization: KnowledgeDirectoryOrganization, depth: number): ReactNode {
    const children = index.childrenByParent.get(organization.organization_id) || [];
    const isExpanded = expanded.has(organization.organization_id);
    return <div className="knowledge-directory-branch" key={organization.organization_id}>
      <div className="knowledge-directory-organization" style={{ "--knowledge-directory-depth": depth } as CSSProperties}>
        <button type="button" aria-label={`${isExpanded ? kt("knowledge.auto.afd4b783536b8297") : kt("knowledge.auto.00bd3960fea8ea98")}${organization.display_name}`} disabled={busy || children.length === 0} onClick={() => setExpanded(current => { const next = new Set(current); next.has(organization.organization_id) ? next.delete(organization.organization_id) : next.add(organization.organization_id); return next; })}>{isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</button>
        <input type="checkbox" checked={selectedOrganizationIDs.has(organization.organization_id)} disabled={busy} onChange={event => toggleOrganization(organization, event.currentTarget.checked)} />
        <Building2 size={15} aria-hidden="true" />
        <span><strong>{organization.display_name}</strong><small>{organization.node_type || kt("knowledge.access.organization")}{children.length ? ktf("knowledge.access.child_organizations", { value0: children.length }) : ""}</small></span>
      </div>
      {isExpanded && children.map(child => renderOrganization(child, depth + 1))}
    </div>;
  }

  if (activeTab === "members") return <div className="knowledge-access-editor" role="tabpanel">
    <div className="knowledge-access-editor-copy"><strong>{kt("knowledge.access.add_members")}</strong><span>{kt("knowledge.access.add_members_description")}</span></div>
    <div className="knowledge-bulk-member-editor">
      <label>{kt("knowledge.access.member_emails")}<div className="knowledge-member-combobox">
        <div className="knowledge-member-token-input" onClick={() => memberInputRef.current?.focus()}>
          {pendingMembers.map(item => <span className="knowledge-member-token" key={item.user_id}><span>{item.email || item.display_name}</span><button type="button" aria-label={`${kt("knowledge.auto.6135d4159e892541")} ${item.email || item.display_name}`} disabled={busy || resolving} onClick={event => { event.stopPropagation(); removePendingMember(item.user_id); }}><X size={12} /></button></span>)}
          <input
            ref={memberInputRef}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={suggestionsOpen && (suggestionsLoading || memberSuggestions.length > 0)}
            aria-controls="knowledge-member-suggestions"
            aria-label={kt("knowledge.settings.find_workspace_member")}
            value={emailText}
            disabled={busy || resolving}
            onFocus={() => setSuggestionsOpen(true)}
            onBlur={() => window.setTimeout(() => setSuggestionsOpen(false), 120)}
            onChange={event => { setEmailText(event.target.value); setInputError(""); setSuggestionsOpen(true); }}
            onPaste={event => { const value = event.clipboardData.getData("text"); if (parsedEmails(value).length) { event.preventDefault(); void stageEmails(value); } }}
            onKeyDown={event => {
              if (event.key === "Escape") { setSuggestionsOpen(false); return; }
              if (event.key === "Backspace" && !emailText && pendingMembers.length) { removePendingMember(pendingMembers.at(-1)!.user_id); return; }
              if (event.key === "ArrowDown" && memberSuggestions.length) { event.preventDefault(); setSuggestionsOpen(true); setActiveSuggestion(value => (value + 1) % memberSuggestions.length); return; }
              if (event.key === "ArrowUp" && memberSuggestions.length) { event.preventDefault(); setSuggestionsOpen(true); setActiveSuggestion(value => (value - 1 + memberSuggestions.length) % memberSuggestions.length); return; }
              if (event.key === "Enter" && suggestionsOpen && memberSuggestions[activeSuggestion]) { event.preventDefault(); selectMemberSuggestion(memberSuggestions[activeSuggestion]); return; }
              if ((event.key === "Enter" || event.key === "," || event.key === ";") && parsedEmails(emailText).length) { event.preventDefault(); void stageEmails(emailText); }
            }}
            placeholder={pendingMembers.length ? kt("knowledge.settings.find_workspace_member") : kt("knowledge.access.member_emails_placeholder")}
          />
        </div>
        {suggestionsOpen && (suggestionsLoading || memberSuggestions.length > 0) && <div id="knowledge-member-suggestions" className="knowledge-member-suggestions" role="listbox" aria-label={kt("knowledge.settings.find_workspace_member")}>
          {memberSuggestions.map((item, itemIndex) => <button key={item.user_id} type="button" role="option" aria-selected={itemIndex === activeSuggestion} onMouseDown={event => event.preventDefault()} onClick={() => selectMemberSuggestion(item)}>
            <span className="knowledge-member-avatar" aria-hidden="true">{(item.display_name || item.email || "?").slice(0, 1)}</span>
            <span><strong>{item.display_name || item.email || item.user_id}</strong><small>{item.email || item.user_id}</small></span>
          </button>)}
          {suggestionsLoading && <small className="knowledge-member-suggestions-loading">{kt("knowledge.auto.38e112b5a2be3b56")}</small>}
        </div>}
      </div></label>
      <label>{kt("knowledge.auto.c47b54e84e79d77f")}<Select value={memberRole} disabled={busy || resolving} onChange={event => setMemberRole(event.target.value as KnowledgeLibraryMember["role"])}>{Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select></label>
      <Button type="button" className="primary" disabled={busy || resolving || (!emailText.trim() && pendingMembers.length === 0)} onClick={() => void addEmails()}>{resolving ? kt("knowledge.access.resolving") : kt("knowledge.access.add_to_authorization")}</Button>
    </div>
    {inputError && <p className="knowledge-access-input-error" role="alert">{inputError}</p>}
    {members.length > 0 && <div className="knowledge-access-selection-list">{members.map(item => <div key={item.principal.user_id}><span className="knowledge-member-avatar" aria-hidden="true">{(item.principal.display_name || item.principal.email || "?").slice(0, 1)}</span><span><strong>{item.principal.display_name || item.principal.email || item.principal.user_id}</strong><small>{item.principal.email || item.principal.user_id}</small></span><em>{roleLabels[item.role]}</em><Button type="button" aria-label={kt("knowledge.auto.6135d4159e892541")} disabled={busy} onClick={() => onMembersChange(members.filter(candidate => candidate.principal.user_id !== item.principal.user_id))}><X size={13} /></Button></div>)}</div>}
  </div>;

  return <div className="knowledge-access-editor" role="tabpanel">
    <div className="knowledge-access-editor-copy"><strong>{kt("knowledge.access.select_organizations")}</strong><span>{kt("knowledge.access.select_organizations_description")}</span></div>
    <div className="knowledge-organization-access-controls"><label>{kt("knowledge.auto.c47b54e84e79d77f")}<Select value={organizationRole} disabled={busy} onChange={event => { const role = event.target.value as KnowledgeLibraryMember["role"]; setOrganizationRole(role); onOrganizationsChange(organizations.map(item => ({ ...item, role }))); }}>{Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select></label></div>
    <div className="knowledge-directory-tree" role="tree" aria-label={kt("knowledge.access.organization_tree")}>
      {loading ? <p className="knowledge-directory-state">{kt("knowledge.auto.38e112b5a2be3b56")}</p> : loadError ? <p className="knowledge-error">{loadError}</p> : index.roots.length ? index.roots.map(root => renderOrganization(root, 0)) : <p className="knowledge-directory-state">{kt("knowledge.access.no_organizations")}</p>}
    </div>
    <p className="knowledge-access-selection-summary">{ktf("knowledge.access.organizations_selected", { value0: organizations.length })}</p>
  </div>;
}
