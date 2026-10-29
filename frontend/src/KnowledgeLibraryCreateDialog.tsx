import { kt, ktf } from "./i18n/runtime.ts";
import { createPortal } from "react-dom";
import { BookOpen, Building2, ChevronDown, ChevronRight, UserRound, Users, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Button } from "./components.tsx";
import type { KnowledgeClient, KnowledgeDirectoryMember, KnowledgeDirectoryOrganization, KnowledgeLibraryMember, KnowledgePrincipalDirectorySnapshot } from "./types.ts";

export type KnowledgeLibraryCreateMemberInput = {
  principal: KnowledgeDirectoryMember;
  role: KnowledgeLibraryMember["role"];
};

export type KnowledgeLibraryCreateOrganizationInput = {
  organization: KnowledgeDirectoryOrganization;
  role: KnowledgeLibraryMember["role"];
};

export type KnowledgeLibraryCreateInput = {
  name: string;
  description: string;
  members: KnowledgeLibraryCreateMemberInput[];
  organizations: KnowledgeLibraryCreateOrganizationInput[];
};

type DirectoryIndex = {
  currentUserID: string;
  organizations: KnowledgeDirectoryOrganization[];
  organizationByID: Map<string, KnowledgeDirectoryOrganization>;
  childrenByParent: Map<string, KnowledgeDirectoryOrganization[]>;
  membersByOrganization: Map<string, KnowledgeDirectoryMember[]>;
  memberByID: Map<string, KnowledgeDirectoryMember>;
  roots: KnowledgeDirectoryOrganization[];
};

function directoryIndex(snapshot: KnowledgePrincipalDirectorySnapshot | null): DirectoryIndex {
  const currentUserID = snapshot?.current_user_id || "";
  const organizations = (snapshot?.organizations || []).filter(item => item.status === "active");
  const organizationByID = new Map(organizations.map(item => [item.organization_id, item]));
  const childrenByParent = new Map<string, KnowledgeDirectoryOrganization[]>();
  for (const organization of organizations) {
    const parentID = organization.parent_id && organizationByID.has(organization.parent_id) ? organization.parent_id : "";
    childrenByParent.set(parentID, [...(childrenByParent.get(parentID) || []), organization]);
  }
  for (const children of childrenByParent.values()) children.sort((left, right) => left.sort_order - right.sort_order || left.display_name.localeCompare(right.display_name) || left.organization_id.localeCompare(right.organization_id));
  const members = (snapshot?.members || []).filter(item => item.status === "active");
  const membersByOrganization = new Map<string, KnowledgeDirectoryMember[]>();
  for (const member of members) {
    const organizationID = member.organization_id && organizationByID.has(member.organization_id) ? member.organization_id : "";
    membersByOrganization.set(organizationID, [...(membersByOrganization.get(organizationID) || []), member]);
  }
  for (const values of membersByOrganization.values()) values.sort((left, right) => left.display_name.localeCompare(right.display_name) || left.user_id.localeCompare(right.user_id));
  return { currentUserID, organizations, organizationByID, childrenByParent, membersByOrganization, memberByID: new Map(members.map(item => [item.user_id, item])), roots: childrenByParent.get("") || [] };
}

function descendants(index: DirectoryIndex, organizationID: string) {
  const organizationIDs: string[] = [], memberIDs: string[] = [], queue = [organizationID];
  while (queue.length) {
    const current = queue.shift()!;
    organizationIDs.push(current);
    memberIDs.push(...(index.membersByOrganization.get(current) || []).filter(member => member.user_id !== index.currentUserID).map(member => member.user_id));
    queue.push(...(index.childrenByParent.get(current) || []).map(child => child.organization_id));
  }
  return { organizationIDs, memberIDs };
}

function normalizeSelection(index: DirectoryIndex, organizations: Set<string>, members: Set<string>) {
  const next = new Set(organizations);
  const ordered = [...index.organizations].sort((left, right) => right.depth - left.depth);
  for (const organization of ordered) {
    const children = index.childrenByParent.get(organization.organization_id) || [];
    const directMembers = (index.membersByOrganization.get(organization.organization_id) || []).filter(member => member.user_id !== index.currentUserID);
    const selectableChildren = children.filter(child => descendants(index, child.organization_id).memberIDs.length > 0);
    const hasSelectableDescendants = directMembers.length > 0 || selectableChildren.length > 0;
    const childNodesSelected = selectableChildren.every(child => next.has(child.organization_id));
    const directMembersSelected = directMembers.every(member => members.has(member.user_id));
    if (hasSelectableDescendants && childNodesSelected && directMembersSelected) next.add(organization.organization_id);
    else next.delete(organization.organization_id);
  }
  return next;
}

function compressedSelection(index: DirectoryIndex, selectedOrganizations: Set<string>, selectedMembers: Set<string>) {
  const organizations = [...selectedOrganizations].filter(organizationID => {
    let current = index.organizationByID.get(organizationID);
    while (current?.parent_id) {
      if (selectedOrganizations.has(current.parent_id)) return false;
      current = index.organizationByID.get(current.parent_id);
    }
    return true;
  });
  const members = [...selectedMembers].filter(userID => {
    let current = index.organizationByID.get(index.memberByID.get(userID)?.organization_id || "");
    while (current) {
      if (selectedOrganizations.has(current.organization_id)) return false;
      current = current.parent_id ? index.organizationByID.get(current.parent_id) : undefined;
    }
    return true;
  });
  return { organizations, members };
}

export function KnowledgeLibraryCreateDialog({ client, busy, error, onClose, onCreate }: {
  client: KnowledgeClient;
  busy: boolean;
  error?: string;
  onClose(): void;
  onCreate(input: KnowledgeLibraryCreateInput): void;
}) {
  const [name, setName] = useState(""), [description, setDescription] = useState("");
  const [directory, setDirectory] = useState<KnowledgePrincipalDirectorySnapshot | null>(null);
  const [directoryLoading, setDirectoryLoading] = useState(true), [directoryError, setDirectoryError] = useState("");
  const [expandedOrganizations, setExpandedOrganizations] = useState<Set<string>>(new Set());
  const [selectedOrganizations, setSelectedOrganizations] = useState<Set<string>>(new Set());
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const normalizedName = name.trim(), normalizedDescription = description.trim();
  const index = useMemo(() => directoryIndex(directory), [directory]);
  const compressed = useMemo(() => compressedSelection(index, selectedOrganizations, selectedMembers), [index, selectedMembers, selectedOrganizations]);

  useEffect(() => {
    const abort = new AbortController();
    setDirectoryLoading(true); setDirectoryError("");
    void client.getPrincipalDirectory(abort.signal).then(value => {
      if (abort.signal.aborted) return;
      setDirectory(value);
      setExpandedOrganizations(new Set(value.organizations.filter(item => !item.parent_id).map(item => item.organization_id)));
    }).catch(failure => {
      if (!abort.signal.aborted) setDirectoryError(failure instanceof Error ? failure.message : kt("knowledge.auto.9e70e9e5866eb5cb"));
    }).finally(() => { if (!abort.signal.aborted) setDirectoryLoading(false); });
    return () => abort.abort();
  }, [client]);

  function toggleOrganization(organizationID: string, checked: boolean) {
    const scope = descendants(index, organizationID);
    const nextOrganizations = new Set(selectedOrganizations), nextMembers = new Set(selectedMembers);
    for (const id of scope.organizationIDs) checked ? nextOrganizations.add(id) : nextOrganizations.delete(id);
    for (const id of scope.memberIDs) checked ? nextMembers.add(id) : nextMembers.delete(id);
    if (!checked) {
      let current = index.organizationByID.get(organizationID);
      while (current?.parent_id) { nextOrganizations.delete(current.parent_id); current = index.organizationByID.get(current.parent_id); }
    }
    setSelectedMembers(nextMembers);
    setSelectedOrganizations(normalizeSelection(index, nextOrganizations, nextMembers));
    if (checked) setExpandedOrganizations(current => new Set([...current, organizationID]));
  }

  function toggleMember(userID: string, checked: boolean) {
    const nextMembers = new Set(selectedMembers);
    checked ? nextMembers.add(userID) : nextMembers.delete(userID);
    setSelectedMembers(nextMembers);
    setSelectedOrganizations(normalizeSelection(index, selectedOrganizations, nextMembers));
  }

  function renderMember(member: KnowledgeDirectoryMember, depth: number) {
    const isCreator = member.user_id === index.currentUserID;
    return <label className={`knowledge-directory-member${isCreator ? " is-creator" : ""}`} style={{ "--knowledge-directory-depth": depth } as CSSProperties} key={member.user_id}>
      <input type="checkbox" checked={isCreator || selectedMembers.has(member.user_id)} disabled={busy || isCreator} onChange={event => toggleMember(member.user_id, event.currentTarget.checked)} />
      <span className="knowledge-member-avatar" aria-hidden="true">{(member.display_name || "?").slice(0, 1)}</span>
      <span><strong>{member.display_name || member.user_id}{isCreator && <em>{kt("knowledge.auto.f46c86c0286a8fad")}</em>}</strong><small>{member.email || member.user_id}{isCreator && kt("knowledge.auto.73844537f6b7f89d")}</small></span>
    </label>;
  }

  function renderOrganization(organization: KnowledgeDirectoryOrganization, depth: number): ReactNode {
    const children = index.childrenByParent.get(organization.organization_id) || [];
    const members = index.membersByOrganization.get(organization.organization_id) || [];
    const scope = descendants(index, organization.organization_id);
    const checked = selectedOrganizations.has(organization.organization_id);
    const selectedCount = scope.organizationIDs.filter(id => selectedOrganizations.has(id)).length + scope.memberIDs.filter(id => selectedMembers.has(id)).length;
    const partial = !checked && selectedCount > 0;
    const expanded = expandedOrganizations.has(organization.organization_id);
    const selectable = scope.memberIDs.length > 0;
    return <div className="knowledge-directory-branch" key={organization.organization_id}>
      <div className="knowledge-directory-organization" style={{ "--knowledge-directory-depth": depth } as CSSProperties}>
        <button type="button" aria-label={`${expanded ? kt("knowledge.auto.afd4b783536b8297") : kt("knowledge.auto.00bd3960fea8ea98")}${organization.display_name}`} disabled={busy || children.length + members.length === 0} onClick={() => setExpandedOrganizations(current => { const next = new Set(current); next.has(organization.organization_id) ? next.delete(organization.organization_id) : next.add(organization.organization_id); return next; })}>{expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}</button>
        <input type="checkbox" aria-label={ktf("knowledge.auto.7c76ab309e7460f8", { value0: organization.display_name })} aria-checked={partial ? "mixed" : checked} ref={element => { if (element) element.indeterminate = partial; }} checked={checked} disabled={busy || !selectable} onChange={event => toggleOrganization(organization.organization_id, event.currentTarget.checked)} />
        <Building2 size={16} aria-hidden="true" />
        <span><strong>{organization.display_name}</strong><small>{scope.memberIDs.length} {kt("knowledge.auto.933b8a699d0e5604")}{children.length} {kt("knowledge.auto.970b74f5507bc8c8")}</small></span>
      </div>
      {expanded && <div>{children.map(child => renderOrganization(child, depth + 1))}{members.map(member => renderMember(member, depth + 1))}</div>}
    </div>;
  }

  const unassignedMembers = index.membersByOrganization.get("") || [];
  const selectedCount = selectedMembers.size;
  return createPortal(<div className="knowledge-modal-backdrop" role="presentation" onMouseDown={event => {
    if (event.target === event.currentTarget && !busy) onClose();
  }} onKeyDown={event => {
    if (event.key === "Escape" && !busy) onClose();
  }}><section className="knowledge-transfer-dialog knowledge-library-create-dialog" role="dialog" aria-modal="true" aria-labelledby="knowledge-library-create-title">
    <header><div><h2 id="knowledge-library-create-title">{kt("knowledge.auto.205ce2c06399d019")}</h2><p>{kt("knowledge.auto.2380ac4c4ae0ee52")}</p></div><Button type="button" aria-label={kt("knowledge.auto.3aa89611cce01728")} disabled={busy} onClick={onClose}><X size={17} /></Button></header>
    <div className="knowledge-library-create-scope"><span aria-hidden="true"><Users size={18} /></span><div><strong>{kt("knowledge.auto.31ed76fc17e70532")}</strong><p>{kt("knowledge.auto.170d70cc541db069")}</p></div></div>
    <form onSubmit={event => {
      event.preventDefault();
      if (!normalizedName || busy) return;
      onCreate({
        name: normalizedName,
        description: normalizedDescription,
        organizations: compressed.organizations.map(id => ({ organization: index.organizationByID.get(id)!, role: "editor" })),
        members: compressed.members.map(id => ({ principal: index.memberByID.get(id)!, role: "editor" })),
      });
    }}>
      <div className="knowledge-form-grid">
        <label>{kt("knowledge.auto.83974e4c338de106")}<input autoFocus required value={name} maxLength={128} disabled={busy} onChange={event => setName(event.target.value)} placeholder={kt("knowledge.auto.f897e80b4fcc51e8")} /></label>
        <label><span className="knowledge-field-label">{kt("knowledge.auto.0bef9631f8aa8710")}<em>{kt("knowledge.auto.ebdcbdcf9c998d72")}</em></span><textarea value={description} maxLength={1024} disabled={busy} onChange={event => setDescription(event.target.value)} placeholder={kt("knowledge.auto.69bb1f808842c73e")} /></label>
      </div>
      <section className="knowledge-library-create-members">
        <header><div><strong>{kt("knowledge.auto.43065958d3e5ced6")}<em>{kt("knowledge.auto.ebdcbdcf9c998d72")}</em></strong><p>{kt("knowledge.auto.401f60b2272fa11e")}</p></div></header>
        <div className="knowledge-directory-tree" role="tree" aria-label={kt("knowledge.auto.1d86d38b384d2051")}>
          {directoryLoading ? <p className="knowledge-directory-state">{kt("knowledge.auto.38e112b5a2be3b56")}</p> : directoryError ? <p className="knowledge-error">{directoryError}</p> : <>
            {index.roots.map(root => renderOrganization(root, 0))}
            {unassignedMembers.length > 0 && <div className="knowledge-directory-unassigned"><div><UserRound size={16} /><strong>{kt("knowledge.auto.8db3df9cb9b1b1ad")}</strong></div>{unassignedMembers.map(member => renderMember(member, 1))}</div>}
            {index.roots.length === 0 && unassignedMembers.length === 0 && <p className="knowledge-directory-state">{kt("knowledge.auto.677552c09708c6e2")}</p>}
          </>}
        </div>
        <p className="knowledge-library-create-members-empty">{kt("knowledge.auto.6f2971e96350b9be")}{selectedCount} {kt("knowledge.auto.55e2d81c4ca53e94")}{compressed.organizations.length} {kt("knowledge.auto.546897799bd4c119")}{compressed.members.length} {kt("knowledge.auto.4981830d16d03406")}</p>
      </section>
      {error && <p role="alert" className="knowledge-error">{error}</p>}
      <div className="knowledge-actions"><Button type="button" disabled={busy} onClick={onClose}>{kt("knowledge.auto.2cd0f3be8738a86c")}</Button><Button type="submit" className="primary" disabled={busy || !normalizedName}><BookOpen size={15} />{busy ? kt("knowledge.auto.7c0305bc0ce607b2") : selectedCount > 0 ? kt("knowledge.auto.6598efd992f18e0e") : kt("knowledge.auto.ca2db8ecf35f0c53")}</Button></div>
    </form>
  </section></div>, window.document.body);
}
