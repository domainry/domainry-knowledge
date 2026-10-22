import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, BarChart3, CheckCircle2, ClipboardCopy, Download, FilePenLine, ListChecks, Plus, Settings2, Trash2, Upload, X } from "lucide-react";
import { DefaultEvaluator, Formio } from "@formio/js";
import bootstrapCSS from "bootstrap/dist/css/bootstrap.min.css?inline";
import formioCSS from "@formio/js/dist/formio.full.min.css?inline";
import { canonicalFormFromBuilder, formioSchema, formSubmissionAnswers, normalizeFormContent, parseFormContent } from "../formContent.ts";
import type { KnowledgeFormAnalytics, KnowledgeFormComponent, KnowledgeFormComponentType, KnowledgeFormFileAnswer, KnowledgeFormOption, KnowledgeFormSettings, KnowledgeFormSubmission } from "../types.ts";
import type { KnowledgeEditorProps } from "./types.ts";
import { taskDateTimeInputValue, taskDateTimeISO } from "./task.ts";

type FormView = "design" | "settings" | "responses";

// Form.io's default evaluator compiles lodash templates with `new Function`.
// The Knowledge product deliberately ships a strict CSP without `unsafe-eval`,
// and canonical forms do not support executable expressions. Use Form.io's
// supported no-eval evaluator for both the builder and the response renderer.
Formio.use({ evaluator: new DefaultEvaluator({ noeval: true }) });

const questionTypes: Array<{ type: KnowledgeFormComponentType; label: string }> = [
  { type: "textfield", label: "单行文本" }, { type: "textarea", label: "多行文本" }, { type: "number", label: "数字" },
  { type: "currency", label: "金额" }, { type: "email", label: "邮箱" }, { type: "url", label: "网址" }, { type: "phoneNumber", label: "电话" },
  { type: "radio", label: "单选" }, { type: "select", label: "下拉选择" },
  { type: "selectboxes", label: "多选" }, { type: "checkbox", label: "确认框" }, { type: "datetime", label: "日期时间" },
  { type: "rating", label: "评分" }, { type: "scale", label: "量表" }, { type: "file", label: "附件" },
];

const choiceTypes = new Set<KnowledgeFormComponentType>(["radio", "select", "selectboxes"]);

function questionTypeLabel(type: KnowledgeFormComponentType) {
  return questionTypes.find(item => item.type === type)?.label || type;
}

function newQuestion(type: KnowledgeFormComponentType, components: KnowledgeFormComponent[]): KnowledgeFormComponent {
  let index = components.length + 1;
  while (components.some(component => component.key === `question${index}`)) index += 1;
  const component: KnowledgeFormComponent = { type, key: `question${index}`, label: `未命名${questionTypeLabel(type)}题`, input: true, validate: { required: false } };
  const options = [{ label: "选项 1", value: "option1" }, { label: "选项 2", value: "option2" }];
  if (type === "radio" || type === "selectboxes") component.values = options;
  if (type === "select") component.data = { values: options };
  if (type === "currency") component.currency = "CNY";
  if (type === "phoneNumber") component.inputMask = "";
  if (type === "rating") component.validate = { required: false, min: 1, max: 5 };
  if (type === "scale") component.validate = { required: false, min: 0, max: 10 };
  if (type === "file") component.maxFiles = 5;
  return component;
}

function uploadedFormDocument(value: string | Record<string, unknown>, title: string): KnowledgeFormFileAnswer | null {
  const props = typeof value === "object" && value && typeof value.props === "object" && value.props ? value.props as Record<string, unknown> : {};
  const reference = typeof value === "string" ? value : String(props.url || value.url || "");
  const match = /^knowledge-document:(kdoc_[a-f0-9]{32})$/.exec(reference);
  return match ? { document_id: match[1], title } : null;
}

function questionOptions(component: KnowledgeFormComponent) {
  return component.type === "select" ? component.data?.values || [] : component.values || [];
}

function errorMessage(error: unknown) {
  return error instanceof Error && error.message ? error.message : "操作失败，请稍后重试。";
}

function runtimeError(form: KnowledgeEditorProps["form"], error: unknown) {
  return form?.formatError(error) || errorMessage(error);
}

function formQuestionVisible(component: KnowledgeFormComponent, answers: Record<string, unknown>) {
  if (!component.conditional) return true;
  const actual = answers[component.conditional.when];
  const expected = component.conditional.eq;
  const equal = actual === expected || typeof expected === "number" && typeof actual === "string" && actual.trim() !== "" && Number(actual) === expected;
  return equal === component.conditional.show;
}

function FormFileQuestion({ component, answers, canSubmit, uploadsEnabled, uploading, onRemove, onUpload }: {
  component: KnowledgeFormComponent;
  answers: KnowledgeFormFileAnswer[];
  canSubmit: boolean;
  uploadsEnabled: boolean;
  uploading: boolean;
  onRemove(documentID: string): void;
  onUpload(file: File): Promise<void>;
}) {
  const maximum = component.maxFiles || 5;
  return <article>
    <header><strong>{component.label}{component.validate.required && <em>*</em>}</strong>{component.description && <small>{component.description}</small>}</header>
    <div>{answers.map(answer => <span key={answer.document_id}>{answer.title}<button type="button" aria-label={`移除 ${answer.title}`} disabled={!canSubmit} onClick={() => onRemove(answer.document_id)}><X size={13} /></button></span>)}</div>
    {canSubmit && answers.length < maximum && <label className={uploading ? "is-uploading" : ""}><Upload size={15} />{uploading ? "正在上传…" : `上传附件（最多 ${maximum} 个）`}<input type="file" disabled={!uploadsEnabled || uploading} onChange={async event => { const file = event.target.files?.[0]; if (!file) return; await onUpload(file); event.currentTarget.value = ""; }} /></label>}
    {canSubmit && !uploadsEnabled && <small>当前环境未启用文件上传。</small>}
  </article>;
}

function formShadowStyle() {
  return `${bootstrapCSS}\n${formioCSS}\n
    :host{container-type:inline-size;display:block;color:#1e2c25;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC",sans-serif}
    .formbuilder{min-height:560px}.formio-component{font-size:14px}.formio-component label{font-weight:650;color:#23382f}
    .btn-primary{--bs-btn-bg:#00856a;--bs-btn-border-color:#00856a;--bs-btn-hover-bg:#006f59;--bs-btn-hover-border-color:#006f59}
    .formcomponents .formcomponent{border:1px solid #dbe7e1!important;border-radius:10px!important;margin:6px 0!important;padding:10px 12px!important;background:#fff!important;transition:background .16s,border-color .16s,transform .16s}
    .formcomponents .formcomponent:hover{background:#eef8f4!important;border-color:#72bda8!important;transform:translateX(2px)}
    .formarea .component-btn-group{opacity:.18;transition:opacity .16s}.formarea .formio-component:hover>.component-btn-group{opacity:1}
    @container (max-width:720px){.formbuilder{display:block!important;margin:0!important}.formbuilder>.formcomponents,.formbuilder>.formarea{width:100%!important;max-width:none!important;flex:none!important}.builder-sidebar_scroll{max-height:300px!important;margin-bottom:18px;overflow:auto}.builder-sidebar [ref="sidebar-container"]{grid-template-columns:repeat(2,minmax(0,1fr))}}`;
}

export function FormEditor({ body, readOnly = false, form, authorizeContentAction, onChange, onActionFeedback, uploadFile, fileUploadsEnabled }: KnowledgeEditorProps) {
  const parsed = useMemo(() => parseFormContent(body), [body]);
  const [view, setView] = useState<FormView>("design");
  const [components, setComponents] = useState<KnowledgeFormComponent[]>(parsed.components);
  const [settings, setSettings] = useState<KnowledgeFormSettings>(parsed.settings);
  const [schemaError, setSchemaError] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "submitted">("idle");
  const [operationError, setOperationError] = useState("");
  const [responses, setResponses] = useState<KnowledgeFormSubmission[]>([]);
  const [responsesBefore, setResponsesBefore] = useState("");
  const [responsesComplete, setResponsesComplete] = useState(true);
  const [analytics, setAnalytics] = useState<KnowledgeFormAnalytics | null>(null);
  const [loadingResponses, setLoadingResponses] = useState(false);
  const [fileAnswers, setFileAnswers] = useState<Record<string, KnowledgeFormFileAnswer[]>>({});
  const [uploadingKey, setUploadingKey] = useState("");
  const [formAnswers, setFormAnswers] = useState<Record<string, unknown>>({});
  const host = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<any>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => { setComponents(parsed.components); setSettings(parsed.settings); }, [body]);

  useEffect(() => {
    if (!readOnly || view !== "design" || !host.current) return;
    const shadow = host.current.shadowRoot || host.current.attachShadow({ mode: "open" });
    shadow.replaceChildren();
    const style = document.createElement("style");
    style.textContent = formShadowStyle();
    const mount = document.createElement("div");
    shadow.append(style, mount);
    let active = true;
    const fillable = form?.canSubmit;
    const promise = Formio.createForm(mount, formioSchema(parsed), { readOnly: !fillable, noAlerts: true });
    void promise.then((created: any) => {
      if (!active) { created.destroy?.(true); return; }
      instanceRef.current = created;
      created.on?.("change", (event: { data?: Record<string, unknown> }) => { if (active) setFormAnswers({ ...(event?.data || created.data || {}) }); });
    }).catch((failure: unknown) => { if (active) setSchemaError(runtimeError(form, failure)); });
    return () => {
      active = false;
      instanceRef.current = null;
      void Promise.resolve(promise).then((created: any) => created.destroy?.(true)).catch(() => undefined);
      shadow.replaceChildren();
    };
  }, [body, form?.canSubmit, readOnly, view]);

  function persistComponents(next: KnowledgeFormComponent[]) {
    setComponents(next);
    try {
      const canonical = normalizeFormContent({ schema_version: 1, display: "form", components: next, settings });
      onChangeRef.current(JSON.stringify(canonical));
      setSchemaError("");
    } catch (failure) { setSchemaError(errorMessage(failure)); }
  }

  function patchQuestion(index: number, patch: Partial<KnowledgeFormComponent>) {
    persistComponents(components.map((component, position) => position === index ? { ...component, ...patch } : component));
  }

  function setOptions(index: number, options: KnowledgeFormOption[]) {
    const component = components[index];
    if (component.type === "select") patchQuestion(index, { data: { values: options } });
    else patchQuestion(index, { values: options });
  }

  function setCondition(index: number, when: string) {
    if (!when) {
      const component = { ...components[index] };
      delete component.conditional;
      persistComponents(components.map((value, position) => position === index ? component : value));
      return;
    }
    const target = components.find(component => component.key === when);
    const eq = target?.type === "checkbox" ? true : target?.type === "number" || target?.type === "currency" || target?.type === "rating" || target?.type === "scale" ? 0 : "";
    patchQuestion(index, { conditional: { show: true, when, eq } });
  }

  function updateSettings(patch: Partial<KnowledgeFormSettings>) {
    const next = { ...settings, ...patch };
    setSettings(next);
    try {
      onChange(JSON.stringify(canonicalFormFromBuilder({ components }, next)));
      setSchemaError("");
    } catch (failure) { setSchemaError(errorMessage(failure)); }
  }

  async function submit() {
    if (!form?.canSubmit || !instanceRef.current || submitState === "submitting") return;
    setOperationError("");
    const instance = instanceRef.current;
    const valid = instance.checkValidity?.(instance.data, true, instance.data) !== false;
    instance.setPristine?.(false);
    instance.showErrors?.(instance.errors || []);
    const currentAnswers = instance.submission?.data || instance.data || {};
    const visibleFiles = parsed.components.filter(component => component.type === "file" && formQuestionVisible(component, currentAnswers));
    const missingFile = visibleFiles.find(component => component.validate.required && !(fileAnswers[component.key]?.length));
    if (!valid || missingFile) { setOperationError(missingFile ? `请上传“${missingFile.label}”要求的附件。` : "请先完成所有必填项，并检查输入格式。"); return; }
    setSubmitState("submitting");
    try {
      const attachments = Object.fromEntries(visibleFiles.filter(component => fileAnswers[component.key]?.length).map(component => [component.key, fileAnswers[component.key]]));
      await form.submit(formSubmissionAnswers({ ...currentAnswers, ...attachments }, parsed.components));
      setSubmitState("submitted");
      onActionFeedback?.(parsed.settings.confirmation_message);
    } catch (failure) { setOperationError(runtimeError(form, failure)); setSubmitState("idle"); }
  }

  async function loadResponses(reset = true) {
    if (!form?.canManage || loadingResponses) return;
    setLoadingResponses(true); setOperationError("");
    try {
      const before = reset ? "" : responsesBefore;
      const [page, summary] = await Promise.all([form.listResponses(before, 50), form.analytics()]);
      setResponses(current => reset ? page.items : [...current, ...page.items]);
      setResponsesBefore(page.next_before || "");
      setResponsesComplete(page.complete);
      setAnalytics(summary);
    } catch (failure) { setOperationError(runtimeError(form, failure)); }
    finally { setLoadingResponses(false); }
  }

  useEffect(() => { if (view === "responses") void loadResponses(true); }, [view, form?.publishedVersion]);

  async function copyLink() {
    if (!form?.shareURL) return;
    try { await navigator.clipboard.writeText(form.shareURL); onActionFeedback?.("问卷填写链接已复制。"); }
    catch { setOperationError("浏览器未允许复制，请从地址栏复制当前链接。"); }
  }

  async function exportResponses() {
    if (!form?.canManage) return;
    setOperationError("");
    try {
      if (!authorizeContentAction) throw Error("当前页面禁止导出内容。");
      await authorizeContentAction("export");
      const exported = await form.exportResponses();
      const url = URL.createObjectURL(new Blob([exported.body], { type: exported.content_type }));
      const anchor = document.createElement("a");
      anchor.href = url; anchor.download = exported.filename; anchor.click();
      URL.revokeObjectURL(url);
    } catch (failure) { setOperationError(runtimeError(form, failure)); }
  }

  async function uploadAnswer(component: KnowledgeFormComponent, file: File) {
    if (!uploadFile || uploadingKey) return;
    setUploadingKey(component.key); setOperationError("");
    try {
      const answer = uploadedFormDocument(await uploadFile(file), file.name);
      if (!answer) throw Error("上传结果不是有效文档引用。");
      const maximum = component.maxFiles || 5;
      setFileAnswers(current => ({ ...current, [component.key]: [...(current[component.key] || []).filter(item => item.document_id !== answer.document_id), answer].slice(0, maximum) }));
    } catch (failure) { setOperationError(errorMessage(failure)); }
    finally { setUploadingKey(""); }
  }

  const canShowResponses = form?.canManage && form.publishedVersion > 0;
  return <div className={`knowledge-open-editor is-formio${readOnly ? " is-form-response" : " is-form-builder"}`}>
    <div className="knowledge-form-toolbar" role="tablist" aria-label="问卷工作区">
      <button role="tab" aria-selected={view === "design"} onClick={() => setView("design")}><ListChecks size={16} />{readOnly ? "填写问卷" : "题目设计"}</button>
      {!readOnly && <button role="tab" aria-selected={view === "settings"} onClick={() => setView("settings")}><Settings2 size={16} />提交设置</button>}
      {canShowResponses && <button role="tab" aria-selected={view === "responses"} onClick={() => setView("responses")}><BarChart3 size={16} />答卷与统计</button>}
      {form?.publishedVersion ? <button className="knowledge-form-copy-link" type="button" onClick={() => void copyLink()}><ClipboardCopy size={15} />复制填写链接</button> : null}
    </div>

    {view === "design" && <>
      {readOnly ? <><div ref={host} className="native-form-host" />{parsed.components.some(component => component.type === "file" && formQuestionVisible(component, formAnswers)) && <section className="knowledge-form-file-answers" aria-label="附件问题">{parsed.components.filter(component => component.type === "file" && formQuestionVisible(component, formAnswers)).map(component => <FormFileQuestion key={component.key} component={component} answers={fileAnswers[component.key] || []} canSubmit={form?.canSubmit === true} uploadsEnabled={fileUploadsEnabled === true && !!uploadFile} uploading={uploadingKey === component.key} onRemove={documentID => setFileAnswers(current => ({ ...current, [component.key]: (current[component.key] || []).filter(item => item.document_id !== documentID) }))} onUpload={file => uploadAnswer(component, file)} />)}</section>}</> : <section className="knowledge-form-designer">
        <div className="knowledge-form-question-palette" aria-label="添加问题">
          <span><strong>添加问题</strong><small>选择题型后立即加入问卷，可继续调整顺序和显示条件。</small></span>
          <div>{questionTypes.map(item => <button type="button" key={item.type} onClick={() => persistComponents([...components, newQuestion(item.type, components)])}><Plus size={14} />{item.label}</button>)}</div>
        </div>
        <div className="knowledge-form-question-list">
          {components.map((component, index) => {
            const options = questionOptions(component);
            const conditionTarget = components.find(candidate => candidate.key === component.conditional?.when);
            return <article className="knowledge-form-question-card" key={component.key}>
              <header>
                <span><b>{index + 1}</b><strong>{questionTypeLabel(component.type)}</strong><code>{component.key}</code></span>
                <div>
                  <button type="button" aria-label="上移问题" disabled={index === 0} onClick={() => { const next = [...components]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; persistComponents(next); }}><ArrowUp size={15} /></button>
                  <button type="button" aria-label="下移问题" disabled={index === components.length - 1} onClick={() => { const next = [...components]; [next[index], next[index + 1]] = [next[index + 1], next[index]]; persistComponents(next); }}><ArrowDown size={15} /></button>
                  <button type="button" aria-label="删除问题" disabled={components.length === 1} onClick={() => persistComponents(components.filter((_, position) => position !== index))}><Trash2 size={15} /></button>
                </div>
              </header>
              <div className="knowledge-form-question-grid">
                <label className="is-wide">问题标题<input value={component.label} maxLength={512} onChange={event => patchQuestion(index, { label: event.target.value })} /></label>
                <label>问题标识<input value={component.key} maxLength={128} onChange={event => patchQuestion(index, { key: event.target.value })} /></label>
                <label className="knowledge-form-inline-check"><input type="checkbox" checked={component.validate.required} onChange={event => patchQuestion(index, { validate: { ...component.validate, required: event.target.checked } })} />必填问题</label>
                <label className="is-wide">说明<input value={component.description || ""} maxLength={2048} placeholder="可选，帮助填写者理解问题" onChange={event => patchQuestion(index, { description: event.target.value || undefined })} /></label>
                {!choiceTypes.has(component.type) && component.type !== "checkbox" && <label className="is-wide">占位提示<input value={component.placeholder || ""} maxLength={512} placeholder="可选" onChange={event => patchQuestion(index, { placeholder: event.target.value || undefined })} /></label>}
                {["textfield", "textarea", "email", "url", "phoneNumber"].includes(component.type) && <>
                  <label>最少字符<input type="number" min="0" value={component.validate.minLength ?? ""} onChange={event => patchQuestion(index, { validate: { ...component.validate, minLength: event.target.value ? Number(event.target.value) : undefined } })} /></label>
                  <label>最多字符<input type="number" min="1" value={component.validate.maxLength ?? ""} onChange={event => patchQuestion(index, { validate: { ...component.validate, maxLength: event.target.value ? Number(event.target.value) : undefined } })} /></label>
                </>}
                {(component.type === "number" || component.type === "currency" || component.type === "rating" || component.type === "scale") && <>
                  <label>最小值<input type="number" value={component.validate.min ?? ""} onChange={event => patchQuestion(index, { validate: { ...component.validate, min: event.target.value ? Number(event.target.value) : undefined } })} /></label>
                  <label>最大值<input type="number" value={component.validate.max ?? ""} onChange={event => patchQuestion(index, { validate: { ...component.validate, max: event.target.value ? Number(event.target.value) : undefined } })} /></label>
                </>}
                {component.type === "currency" && <label>币种<select value={component.currency || "CNY"} onChange={event => patchQuestion(index, { currency: event.target.value as NonNullable<KnowledgeFormComponent["currency"]> })}><option value="CNY">人民币 CNY</option><option value="USD">美元 USD</option><option value="EUR">欧元 EUR</option><option value="JPY">日元 JPY</option></select></label>}
                {component.type === "file" && <label>最多文件数<input type="number" min="1" max="20" value={component.maxFiles || 5} onChange={event => patchQuestion(index, { maxFiles: Number(event.target.value) })} /></label>}
              </div>
              {choiceTypes.has(component.type) && <div className="knowledge-form-option-editor">
                <strong>选项</strong>
                {options.map((option, optionIndex) => <div key={`${component.key}-${optionIndex}`}><input aria-label={`选项 ${optionIndex + 1} 名称`} value={option.label} onChange={event => setOptions(index, options.map((value, position) => position === optionIndex ? { ...value, label: event.target.value } : value))} /><input aria-label={`选项 ${optionIndex + 1} 值`} value={option.value} onChange={event => setOptions(index, options.map((value, position) => position === optionIndex ? { ...value, value: event.target.value } : value))} /><button type="button" aria-label={`删除选项 ${optionIndex + 1}`} disabled={options.length === 1} onClick={() => setOptions(index, options.filter((_, position) => position !== optionIndex))}><Trash2 size={14} /></button></div>)}
                <button type="button" onClick={() => { let suffix = options.length + 1; while (options.some(option => option.value === `option${suffix}`)) suffix += 1; setOptions(index, [...options, { label: `选项 ${suffix}`, value: `option${suffix}` }]); }}><Plus size={14} />添加选项</button>
              </div>}
              <div className="knowledge-form-condition-editor">
                <label>显示条件<select value={component.conditional?.when || ""} onChange={event => setCondition(index, event.target.value)}><option value="">始终显示</option>{components.filter(candidate => candidate.key !== component.key).map(candidate => <option key={candidate.key} value={candidate.key}>{candidate.label || candidate.key}</option>)}</select></label>
                {component.conditional && <>
                  <label>规则<select value={component.conditional.show ? "show" : "hide"} onChange={event => patchQuestion(index, { conditional: { ...component.conditional!, show: event.target.value === "show" } })}><option value="show">等于时显示</option><option value="hide">等于时隐藏</option></select></label>
                  <label>比较值{conditionTarget?.type === "checkbox" ? <select value={String(component.conditional.eq)} onChange={event => patchQuestion(index, { conditional: { ...component.conditional!, eq: event.target.value === "true" } })}><option value="true">已勾选</option><option value="false">未勾选</option></select> : <input type={conditionTarget?.type === "number" || conditionTarget?.type === "currency" || conditionTarget?.type === "rating" || conditionTarget?.type === "scale" ? "number" : "text"} value={String(component.conditional.eq)} onChange={event => patchQuestion(index, { conditional: { ...component.conditional!, eq: conditionTarget?.type === "number" || conditionTarget?.type === "currency" || conditionTarget?.type === "rating" || conditionTarget?.type === "scale" ? Number(event.target.value) : event.target.value } })} />}</label>
                </>}
              </div>
            </article>;
          })}
        </div>
      </section>}
      {readOnly && form?.canSubmit && submitState !== "submitted" && <div className="knowledge-form-submit"><button type="button" disabled={submitState === "submitting"} onClick={() => void submit()}>{submitState === "submitting" ? "正在提交…" : "提交答卷"}</button></div>}
      {readOnly && submitState === "submitted" && <div className="knowledge-form-success" role="status"><CheckCircle2 size={22} /><div><strong>{parsed.settings.confirmation_message}</strong><span>答卷已写入当前发布版本。</span></div></div>}
      {readOnly && !form?.canSubmit && <p className="knowledge-form-readonly-note">这是历史或只读预览，不能在此提交答卷。</p>}
    </>}

    {view === "settings" && !readOnly && <section className="knowledge-form-settings">
      <header><FilePenLine size={20} /><div><h3>提交与开放规则</h3><p>规则随问卷版本发布；答卷始终绑定提交时的不可变发布版本。</p></div></header>
      <div className="knowledge-form-settings-grid">
        <label>最低提交角色<select value={settings.submission_role} onChange={event => updateSettings({ submission_role: event.target.value as KnowledgeFormSettings["submission_role"] })}><option value="reader">阅读者及以上</option><option value="editor">编辑者及以上</option><option value="manager">仅管理者</option></select></label>
        <label className="knowledge-form-checkbox"><input type="checkbox" checked={settings.allow_multiple_submissions} onChange={event => updateSettings({ allow_multiple_submissions: event.target.checked })} />允许同一账号重复提交</label>
        <label>开始时间<input type="datetime-local" value={taskDateTimeInputValue(settings.opens_at)} onChange={event => updateSettings({ opens_at: taskDateTimeISO(event.target.value) || "" })} /></label>
        <label>截止时间<input type="datetime-local" value={taskDateTimeInputValue(settings.closes_at)} onChange={event => updateSettings({ closes_at: taskDateTimeISO(event.target.value) || "" })} /></label>
        <label className="is-wide">提交成功提示<textarea rows={3} maxLength={2048} value={settings.confirmation_message} onChange={event => updateSettings({ confirmation_message: event.target.value })} /></label>
      </div>
      <div className="knowledge-form-link-card"><span><strong>发布后填写链接</strong><small>{form?.publishedVersion ? `当前发布版本 ${form.publishedVersion}` : "先发布问卷，链接才可提交"}</small></span>{form?.publishedVersion ? <button type="button" onClick={() => void copyLink()}><ClipboardCopy size={15} />复制链接</button> : null}</div>
    </section>}

    {view === "responses" && canShowResponses && <section className="knowledge-form-responses">
      <header><div><h3>答卷与统计</h3><p>统计只计算当前发布版本；导出会保留历史版本答卷并标注版本号。</p></div>{authorizeContentAction && <button type="button" onClick={() => void exportResponses()}><Download size={15} />导出 CSV</button>}</header>
      {analytics && <div className="knowledge-form-metrics"><article><strong>{analytics.total_submissions}</strong><span>当前版本答卷</span></article><article><strong>{analytics.questions.length}</strong><span>问题数</span></article><article><strong>v{analytics.published_version}</strong><span>统计版本</span></article></div>}
      {analytics?.questions.map(question => <article className="knowledge-form-analysis" key={question.key}><header><strong>{question.label}</strong><span>{question.answered} 人回答 · {question.skipped} 人跳过</span></header>{question.choice_counts.length > 0 && <div>{question.choice_counts.map(choice => <p key={choice.value}><span>{choice.label}</span><b>{choice.count}</b><i style={{ width: `${analytics.total_submissions ? Math.round(choice.count / analytics.total_submissions * 100) : 0}%` }} /></p>)}</div>}{question.number_average !== undefined && <p className="knowledge-form-number-summary">平均 {question.number_average.toFixed(2)} · 最小 {question.number_min} · 最大 {question.number_max}</p>}</article>)}
      <div className="knowledge-form-response-list"><h4>最近答卷</h4>{responses.map(response => <details key={response.id}><summary><span>{response.submitted_by_user_id}</span><time>{new Date(response.submitted_at).toLocaleString()}</time><em>版本 {response.published_version}</em></summary><dl>{Object.entries(response.answers).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{typeof value === "string" ? value : JSON.stringify(value)}</dd></div>)}</dl></details>)}{!loadingResponses && responses.length === 0 && <p>当前版本还没有答卷。</p>}{!responsesComplete && <button type="button" disabled={loadingResponses} onClick={() => void loadResponses(false)}>{loadingResponses ? "正在载入…" : "加载更多"}</button>}</div>
    </section>}
    {(schemaError || operationError) && <p className="knowledge-form-error" role="alert">{schemaError || operationError}</p>}
  </div>;
}
