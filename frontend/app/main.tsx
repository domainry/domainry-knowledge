import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { BookOpenText, Eye, EyeOff, FileText, LockKeyhole, LogIn, LogOut, Search, ShieldCheck, UserRound, UsersRound } from "lucide-react";
import { KnowledgeWorkspace } from "../src/KnowledgeWorkspace.tsx";
import { KnowledgeSharedPage } from "../src/KnowledgeSharedPage.tsx";
import { parseKnowledgePageShareLocation } from "../src/knowledge-share-links.ts";
import "../src/styles.css";
import { knowledgeClient } from "./client.ts";
import { changePassword, formatError, loadConfig, loadProductSession, login, logout, refreshSession, type ProductConfig, type ProductSession } from "./session.ts";
import "./product.css";

(window as Window & { EXCALIDRAW_ASSET_PATH?: string }).EXCALIDRAW_ASSET_PATH = "/";

function ProductApp() {
  const [config, setConfig] = useState<ProductConfig | null>(null);
  const [session, setSession] = useState<ProductSession | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const sharedLocation = parseKnowledgePageShareLocation(window.location.href);

  useEffect(() => {
    const abort = new AbortController();
    void loadConfig().then(async value => {
      if (abort.signal.aborted) return;
      setConfig(value);
      if (await refreshSession() && !abort.signal.aborted) setSession(await loadProductSession(abort.signal));
    }).catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); }).finally(() => { if (!abort.signal.aborted) setReady(true); });
    return () => abort.abort();
  }, []);

  async function authenticate(loginID: string, password: string) {
    if (!config || busy) return;
    setBusy(true); setError("");
    try {
      await login(config.workspace_id, loginID, password);
      setSession(await loadProductSession());
    } catch (failure) { setError(formatError(failure)); }
    finally { setBusy(false); }
  }

  async function rotatePassword(currentPassword: string, newPassword: string, idempotencyKey: string) {
    if (busy) return;
    setBusy(true); setError("");
    try {
      await changePassword(currentPassword, newPassword, idempotencyKey);
      setSession(await loadProductSession());
    } catch (failure) { setError(formatError(failure)); }
    finally { setBusy(false); }
  }

  if (!ready) return <div className="product-centered"><div className="product-loading">正在连接 Knowledge 服务…</div></div>;
  if (!config) return <div className="product-centered"><p role="alert" className="product-error">{error || "Knowledge 服务配置不可用。"}</p></div>;
  if (!session) return <LoginView busy={busy} error={error} onSubmit={authenticate} />;
  if (session.must_change_password) return <PasswordChangeView busy={busy} error={error} onSubmit={rotatePassword} />;
  return <div className="product-shell">
    <header className="product-header"><div><strong>Knowledge</strong><span>知识库</span></div><div className="product-user"><span>{session.name || session.user_id}</span><button className="product-logout" aria-label="退出登录" title="退出登录" onClick={() => void logout().then(() => setSession(null))}><LogOut size={17} aria-hidden="true" /></button></div></header>
    {sharedLocation ? <KnowledgeSharedPage client={knowledgeClient} shareID={sharedLocation.shareID} pageID={sharedLocation.pageID} formatError={formatError} /> : <KnowledgeWorkspace client={knowledgeClient} currentUserID={session.user_id} formatError={formatError} />}
  </div>;
}

function LoginView({ busy, error, onSubmit }: { busy: boolean; error: string; onSubmit: (loginID: string, password: string) => Promise<void> }) {
  const [loginID, setLoginID] = useState("");
  const [password, setPassword] = useState("");
  function submit(event: FormEvent) { event.preventDefault(); void onSubmit(loginID.trim(), password); }
  return <AuthShell eyebrow="Knowledge 工作区" title="欢迎回来" description="登录后继续访问你的个人与团队知识库。">
    <form className="product-auth-form" onSubmit={submit} aria-busy={busy}>
      <label className="product-field">
        <span>账号</span>
        <span className="product-input-shell">
          <UserRound size={17} aria-hidden="true" />
          <input autoFocus autoComplete="username" placeholder="请输入工作区账号" value={loginID} onChange={event => setLoginID(event.target.value)} required />
        </span>
      </label>
      <PasswordField label="密码" autoComplete="current-password" placeholder="请输入密码" value={password} onChange={setPassword} />
      {error && <p role="alert" className="product-error">{error}</p>}
      <button className="product-submit" type="submit" disabled={busy || !loginID.trim() || !password}>
        {busy ? <><span className="product-button-spinner" aria-hidden="true" />正在登录…</> : <>进入知识库<LogIn size={17} aria-hidden="true" /></>}
      </button>
    </form>
  </AuthShell>;
}

function PasswordChangeView({ busy, error, onSubmit }: { busy: boolean; error: string; onSubmit: (currentPassword: string, newPassword: string, idempotencyKey: string) => Promise<void> }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const operationKey = useRef("");
  const passwordsMatch = newPassword === confirmedPassword;
  function updatePassword(setter: (value: string) => void, value: string) {
    operationKey.current = "";
    setter(value);
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!currentPassword || newPassword.length < 12 || !passwordsMatch) return;
    if (!operationKey.current) operationKey.current = crypto.randomUUID();
    void onSubmit(currentPassword, newPassword, operationKey.current);
  }
  return <AuthShell eyebrow="首次登录" title="设置你的新密码" description="初始凭据需要更新后才能进入知识库。新密码至少 12 位。">
    <form className="product-auth-form" onSubmit={submit} aria-busy={busy}>
      <PasswordField label="当前密码" autoComplete="current-password" placeholder="输入当前密码" value={currentPassword} onChange={value => updatePassword(setCurrentPassword, value)} />
      <PasswordField label="新密码" autoComplete="new-password" placeholder="至少 12 位" minLength={12} value={newPassword} onChange={value => updatePassword(setNewPassword, value)} />
      <PasswordField label="确认新密码" autoComplete="new-password" placeholder="再次输入新密码" minLength={12} value={confirmedPassword} onChange={value => updatePassword(setConfirmedPassword, value)} />
      {confirmedPassword && !passwordsMatch && <p className="product-field-error">两次输入的新密码不一致。</p>}
      {error && <p role="alert" className="product-error">{error}</p>}
      <button className="product-submit" type="submit" disabled={busy || !currentPassword || newPassword.length < 12 || !confirmedPassword || !passwordsMatch}>
        {busy ? <><span className="product-button-spinner" aria-hidden="true" />正在保存…</> : <>保存并进入<LogIn size={17} aria-hidden="true" /></>}
      </button>
    </form>
  </AuthShell>;
}

function ProductBrand({ compact = false }: { compact?: boolean }) {
  return <div className={`product-auth-brand${compact ? " is-compact" : ""}`}>
    <span className="product-auth-mark"><BookOpenText size={21} aria-hidden="true" /></span>
    <span><strong>Domainry</strong><small>KNOWLEDGE</small></span>
  </div>;
}

function AuthShell({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  return <main className="product-auth-shell">
    <section className="product-auth-story" aria-label="Knowledge 产品介绍">
      <ProductBrand />
      <div className="product-auth-message">
        <p>TEAM KNOWLEDGE WORKSPACE</p>
        <h2>让团队知识，<br />始终在同一页</h2>
        <span>从资料沉淀、协作编辑到权限发布，把团队事实收拢在一个可追踪的工作空间里。</span>
      </div>
      <div className="product-preview" aria-hidden="true">
        <header><span><BookOpenText size={15} />产品知识库</span><em><i />3 人在线</em></header>
        <div className="product-preview-body">
          <nav>
            <b><Search size={14} />搜索知识条目</b>
            <span className="is-active"><FileText size={15} />协作编辑规范</span>
            <span><FileText size={15} />产品发布流程</span>
            <span><FileText size={15} />客户交付手册</span>
          </nav>
          <article>
            <small>产品规范 / 协作编辑</small>
            <h3>内容设计与发布流程</h3>
            <p>建立清晰、可信、可追踪的团队知识。</p>
            <div className="product-preview-rule is-wide" />
            <div className="product-preview-rule" />
            <div className="product-preview-rule is-short" />
            <footer><span>所有更改已同步</span><b>K&nbsp;&nbsp;L&nbsp;&nbsp;M</b></footer>
          </article>
        </div>
      </div>
      <div className="product-auth-capabilities" aria-label="Knowledge 核心能力">
        <span><Search size={16} aria-hidden="true" />全文检索</span>
        <span><UsersRound size={16} aria-hidden="true" />实时协作</span>
        <span><ShieldCheck size={16} aria-hidden="true" />版本与权限</span>
      </div>
    </section>
    <section className="product-auth-panel">
      <div className="product-auth-panel-inner">
        <ProductBrand compact />
        <header className="product-auth-heading">
          <span>{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </header>
        {children}
        <p className="product-auth-trust"><ShieldCheck size={15} aria-hidden="true" />通过当前工作区的 Identity 服务安全验证</p>
      </div>
    </section>
  </main>;
}

function PasswordField({ label, autoComplete, placeholder, minLength, value, onChange }: { label: string; autoComplete: string; placeholder: string; minLength?: number; value: string; onChange: (value: string) => void }) {
  const [visible, setVisible] = useState(false);
  return <label className="product-field">
    <span>{label}</span>
    <span className="product-input-shell">
      <LockKeyhole size={17} aria-hidden="true" />
      <input type={visible ? "text" : "password"} autoComplete={autoComplete} placeholder={placeholder} minLength={minLength} value={value} onChange={event => onChange(event.target.value)} required />
      <button className="product-password-toggle" type="button" aria-label={visible ? `隐藏${label}` : `显示${label}`} aria-pressed={visible} onClick={() => setVisible(current => !current)}>
        {visible ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
      </button>
    </span>
  </label>;
}

createRoot(document.getElementById("root")!).render(<ProductApp />);
