import { createPortal } from "react-dom";
import { BookOpen, Users, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./components.tsx";

export type KnowledgeLibraryCreateInput = { name: string; description: string };

export function KnowledgeLibraryCreateDialog({ busy, error, onClose, onCreate }: {
  busy: boolean;
  error?: string;
  onClose(): void;
  onCreate(input: KnowledgeLibraryCreateInput): void;
}) {
  const [name, setName] = useState(""), [description, setDescription] = useState("");
  const normalizedName = name.trim(), normalizedDescription = description.trim();
  return createPortal(<div className="knowledge-modal-backdrop" role="presentation" onMouseDown={event => {
    if (event.target === event.currentTarget && !busy) onClose();
  }} onKeyDown={event => {
    if (event.key === "Escape" && !busy) onClose();
  }}><section className="knowledge-transfer-dialog knowledge-library-create-dialog" role="dialog" aria-modal="true" aria-labelledby="knowledge-library-create-title">
    <header><div><h2 id="knowledge-library-create-title">新建团队知识库</h2><p>填写团队成员能够识别的名称和用途说明。</p></div><Button type="button" aria-label="关闭新建知识库" disabled={busy} onClick={onClose}><X size={17} /></Button></header>
    <div className="knowledge-library-create-scope"><span aria-hidden="true"><Users size={18} /></span><div><strong>团队共享空间</strong><p>创建后你将成为管理者；其他成员需由管理者邀请并分配角色。</p></div></div>
    <form onSubmit={event => { event.preventDefault(); if (normalizedName && !busy) onCreate({ name: normalizedName, description: normalizedDescription }); }}>
      <div className="knowledge-form-grid">
        <label>知识库名称<input autoFocus required value={name} maxLength={128} disabled={busy} onChange={event => setName(event.target.value)} placeholder="例如：产品研发知识库" /></label>
        <label><span className="knowledge-field-label">用途说明 <em>选填</em></span><textarea value={description} maxLength={1024} disabled={busy} onChange={event => setDescription(event.target.value)} placeholder="说明知识库收录的内容、适用团队或使用范围" /></label>
      </div>
      {error && <p role="alert" className="knowledge-error">{error}</p>}
      <div className="knowledge-actions"><Button type="button" disabled={busy} onClick={onClose}>取消</Button><Button type="submit" className="primary" disabled={busy || !normalizedName}><BookOpen size={15} />{busy ? "正在创建…" : "创建团队知识库"}</Button></div>
    </form>
  </section></div>, window.document.body);
}
