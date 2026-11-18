import { ArrowLeft, ArrowRight, BookOpen, X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { KnowledgeAccessSelector, KnowledgeAccessTabs } from "./KnowledgeAccessSelector.tsx";
import type { KnowledgeAccessMemberInput, KnowledgeAccessOrganizationInput, KnowledgeAccessTab } from "./KnowledgeAccessSelector.tsx";
import { Button } from "./components.tsx";
import { kt } from "./i18n/runtime.ts";
import type { KnowledgeClient } from "./types.ts";

export type KnowledgeLibraryCreateMemberInput = KnowledgeAccessMemberInput;
export type KnowledgeLibraryCreateOrganizationInput = KnowledgeAccessOrganizationInput;
export type KnowledgeLibraryCreateInput = {
  name: string;
  description: string;
  members: KnowledgeLibraryCreateMemberInput[];
  organizations: KnowledgeLibraryCreateOrganizationInput[];
};

export function KnowledgeLibraryCreateDialog({ client, busy, error, onClose, onCreate }: {
  client: KnowledgeClient;
  busy: boolean;
  error?: string;
  onClose(): void;
  onCreate(input: KnowledgeLibraryCreateInput): void;
}) {
  const [step, setStep] = useState<"basic" | "access">("basic");
  const [accessTab, setAccessTab] = useState<KnowledgeAccessTab>("members");
  const [name, setName] = useState(""), [description, setDescription] = useState("");
  const [members, setMembers] = useState<KnowledgeLibraryCreateMemberInput[]>([]);
  const [organizations, setOrganizations] = useState<KnowledgeLibraryCreateOrganizationInput[]>([]);
  const normalizedName = name.trim(), normalizedDescription = description.trim();

  function create() {
    if (!normalizedName || busy) return;
    onCreate({ name: normalizedName, description: normalizedDescription, members, organizations });
  }

  return createPortal(<div className="knowledge-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget && !busy) onClose(); }} onKeyDown={event => { if (event.key === "Escape" && !busy) onClose(); }}>
    <section className="knowledge-transfer-dialog knowledge-library-create-dialog" role="dialog" aria-modal="true" aria-labelledby="knowledge-library-create-title">
      <header><div><h2 id="knowledge-library-create-title">{kt("knowledge.auto.601bdf61c4cb8e38")}</h2><p>{step === "basic" ? kt("knowledge.create.basic_description") : kt("knowledge.create.access_description")}</p></div><Button type="button" aria-label={kt("knowledge.auto.3aa89611cce01728")} disabled={busy} onClick={onClose}><X size={17} /></Button></header>
      <ol className="knowledge-create-steps" aria-label={kt("knowledge.create.steps")}>
        <li aria-current={step === "basic" ? "step" : undefined} className={step === "access" ? "is-complete" : ""}><span>1</span><strong>{kt("knowledge.create.basic")}</strong></li>
        <li aria-current={step === "access" ? "step" : undefined}><span>2</span><strong>{kt("knowledge.create.access")}</strong></li>
      </ol>
      {step === "basic" ? <form onSubmit={event => { event.preventDefault(); if (normalizedName) setStep("access"); }}>
        <div className="knowledge-library-create-scope"><span aria-hidden="true"><BookOpen size={18} /></span><div><strong>{kt("knowledge.auto.975b35f9c2b1148c")}</strong><p>{kt("knowledge.auto.170d70cc541db069")}</p></div></div>
        <div className="knowledge-form-grid">
          <label>{kt("knowledge.auto.83974e4c338de106")}<input autoFocus required value={name} maxLength={128} disabled={busy} onChange={event => setName(event.target.value)} placeholder={kt("knowledge.auto.f897e80b4fcc51e8")} /></label>
          <label><span className="knowledge-field-label">{kt("knowledge.auto.0bef9631f8aa8710")}<em>{kt("knowledge.auto.ebdcbdcf9c998d72")}</em></span><textarea value={description} maxLength={1024} disabled={busy} onChange={event => setDescription(event.target.value)} placeholder={kt("knowledge.auto.69bb1f808842c73e")} /></label>
        </div>
        <div className="knowledge-actions"><Button type="button" disabled={busy} onClick={onClose}>{kt("knowledge.auto.2cd0f3be8738a86c")}</Button><Button type="submit" className="primary" disabled={busy || !normalizedName}>{kt("knowledge.create.next")}<ArrowRight size={14} /></Button></div>
      </form> : <form onSubmit={event => { event.preventDefault(); create(); }}>
        <KnowledgeAccessTabs value={accessTab} disabled={busy} onChange={setAccessTab} />
        <KnowledgeAccessSelector client={client} activeTab={accessTab} busy={busy} members={members} organizations={organizations} onMembersChange={setMembers} onOrganizationsChange={setOrganizations} defaultRole="editor" />
        {error && <p role="alert" className="knowledge-error">{error}</p>}
        <div className="knowledge-create-access-summary"><span>{kt("knowledge.create.creator_manager")}</span><strong>{members.length} {kt("knowledge.access.members")} · {organizations.length} {kt("knowledge.access.organizations")}</strong></div>
        <div className="knowledge-actions"><Button type="button" disabled={busy} onClick={() => setStep("basic")}><ArrowLeft size={14} />{kt("knowledge.create.previous")}</Button><Button type="submit" className="primary" disabled={busy || !normalizedName}><BookOpen size={15} />{busy ? kt("knowledge.auto.7c0305bc0ce607b2") : kt("knowledge.auto.601bdf61c4cb8e38")}</Button></div>
      </form>}
    </section>
  </div>, window.document.body);
}
