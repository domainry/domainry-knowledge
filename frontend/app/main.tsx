import { FormEvent, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { LogOut } from "lucide-react";
import { KnowledgeWorkspace } from "../src/KnowledgeWorkspace.tsx";
import "../src/styles.css";
import { knowledgeClient } from "./client.ts";
import { changePassword, formatError, loadConfig, loadProductSession, login, logout, refreshSession, type ProductConfig, type ProductSession } from "./session.ts";
import "./product.css";

function ProductApp() {
  const [config, setConfig] = useState<ProductConfig | null>(null);
  const [session, setSession] = useState<ProductSession | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

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

  async function rotatePassword(currentPassword: string, newPassword: string) {
    if (busy) return;
    setBusy(true); setError("");
    try {
      await changePassword(currentPassword, newPassword);
      setSession(await loadProductSession());
    } catch (failure) { setError(formatError(failure)); }
    finally { setBusy(false); }
  }

  if (!ready) return <div className="product-centered"><div className="product-loading">正在连接 Knowledge 服务…</div></div>;
  if (!config) return <div className="product-centered"><p role="alert" className="product-error">{error || "Knowledge 服务配置不可用。"}</p></div>;
  if (!session) return <LoginView busy={busy} error={error} onSubmit={authenticate} />;
  if (session.must_change_password) return <PasswordChangeView busy={busy} error={error} onSubmit={rotatePassword} />;
  return <div className="product-shell">
    <header className="product-header"><div><strong>Knowledge</strong><span>知识库</span></div><div className="product-user"><span>{session.name || session.user_id}</span><button onClick={() => void logout().then(() => setSession(null))}><LogOut size={16} />退出</button></div></header>
    <KnowledgeWorkspace client={knowledgeClient} formatError={formatError} />
  </div>;
}

function LoginView({ busy, error, onSubmit }: { busy: boolean; error: string; onSubmit: (loginID: string, password: string) => Promise<void> }) {
  const [loginID, setLoginID] = useState("");
  const [password, setPassword] = useState("");
  function submit(event: FormEvent) { event.preventDefault(); void onSubmit(loginID.trim(), password); }
  return <div className="product-centered"><form className="product-auth-card" onSubmit={submit}><div className="product-brand">K</div><h1>登录 Knowledge</h1><p>使用当前 Knowledge 工作区的 Identity 账号登录。</p><label>账号<input autoFocus autoComplete="username" value={loginID} onChange={event => setLoginID(event.target.value)} required /></label><label>密码<input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required /></label>{error && <p role="alert" className="product-error">{error}</p>}<button type="submit" disabled={busy || !loginID.trim() || !password}>{busy ? "正在登录…" : "登录"}</button></form></div>;
}

function PasswordChangeView({ busy, error, onSubmit }: { busy: boolean; error: string; onSubmit: (currentPassword: string, newPassword: string) => Promise<void> }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  function submit(event: FormEvent) { event.preventDefault(); void onSubmit(currentPassword, newPassword); }
  return <div className="product-centered"><form className="product-auth-card" onSubmit={submit}><div className="product-brand">K</div><h1>设置新密码</h1><p>初始凭据必须先更新，完成后才能进入知识库。</p><label>当前密码<input type="password" autoComplete="current-password" value={currentPassword} onChange={event => setCurrentPassword(event.target.value)} required /></label><label>新密码<input type="password" autoComplete="new-password" minLength={12} value={newPassword} onChange={event => setNewPassword(event.target.value)} required /></label>{error && <p role="alert" className="product-error">{error}</p>}<button type="submit" disabled={busy || !currentPassword || newPassword.length < 12}>{busy ? "正在保存…" : "保存并进入"}</button></form></div>;
}

createRoot(document.getElementById("root")!).render(<ProductApp />);
