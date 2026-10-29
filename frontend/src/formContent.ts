import { kt, ktf } from "./i18n/runtime.ts";
import type { KnowledgeFormComponent, KnowledgeFormComponentType, KnowledgeFormContent, KnowledgeFormSettings } from "./types.ts";

export const defaultFormSettings: KnowledgeFormSettings = {
  submission_role: "reader",
  allow_multiple_submissions: false,
  opens_at: "",
  closes_at: "",
  get confirmation_message() { return kt("knowledge.auto.ee80c0c3949831d7"); },
};

export function emptyFormContent(): KnowledgeFormContent {
  return {
    schema_version: 1,
    display: "form",
    components: [{ type: "textfield", key: "question1", label: kt("knowledge.auto.9c01614cb5d8b384"), input: true, validate: { required: false } }],
    settings: { ...defaultFormSettings },
  };
}

export const formComponentTypes: readonly KnowledgeFormComponentType[] = ["textfield", "textarea", "number", "currency", "email", "url", "phoneNumber", "radio", "select", "selectboxes", "checkbox", "datetime", "rating", "scale", "file"];
const componentTypes = new Set<KnowledgeFormComponentType>(formComponentTypes);
const currencyCodes = new Set<NonNullable<KnowledgeFormComponent["currency"]>>(["CNY", "USD", "EUR", "JPY"]);
const keyPattern = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

function finiteNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function optionList(value: unknown) {
  if (!Array.isArray(value) || value.length < 1 || value.length > 100) throw new Error(kt("knowledge.auto.4080685dadb30c95"));
  const seen = new Set<string>();
  return value.map(raw => {
    const option = raw as Record<string, unknown>;
    const label = typeof option.label === "string" ? option.label.trim() : "";
    const stored = typeof option.value === "string" ? option.value.trim() : "";
    if (!label || !keyPattern.test(stored) || seen.has(stored)) throw new Error(kt("knowledge.auto.4b1f33fe41182806"));
    seen.add(stored);
    return { label, value: stored };
  });
}

function canonicalComponent(value: unknown): KnowledgeFormComponent {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(kt("knowledge.auto.98dd62149e8172f1"));
  const source = value as Record<string, unknown>;
  const type = source.type as KnowledgeFormComponentType;
  const key = typeof source.key === "string" ? source.key.trim() : "";
  const label = typeof source.label === "string" ? source.label.trim() : "";
  if (!componentTypes.has(type) || !keyPattern.test(key) || !label) throw new Error(kt("knowledge.auto.67fda5119fd7067f"));
  const rawValidation = source.validate && typeof source.validate === "object" && !Array.isArray(source.validate) ? source.validate as Record<string, unknown> : {};
  const validate: KnowledgeFormComponent["validate"] = { required: rawValidation.required === true };
  if (["textfield", "textarea", "email", "url", "phoneNumber"].includes(type)) {
    const minLength = finiteNumber(rawValidation.minLength), maxLength = finiteNumber(rawValidation.maxLength);
    if (minLength !== undefined && Number.isInteger(minLength) && minLength >= 0) validate.minLength = minLength;
    if (maxLength !== undefined && Number.isInteger(maxLength) && maxLength > 0) validate.maxLength = maxLength;
  }
  if (type === "number" || type === "currency" || type === "rating" || type === "scale") {
    const min = finiteNumber(rawValidation.min), max = finiteNumber(rawValidation.max);
    if (min !== undefined) validate.min = min;
    if (max !== undefined) validate.max = max;
    if (type === "rating" || type === "scale") {
      const minimum = validate.min ?? (type === "rating" ? 1 : 0);
      const maximum = validate.max ?? (type === "rating" ? 5 : 10);
      if (!Number.isInteger(minimum) || !Number.isInteger(maximum) || minimum < 0 || maximum > 20 || maximum <= minimum || maximum - minimum > 20) throw new Error(kt("knowledge.auto.e48d8d69851b8aa1"));
      validate.min = minimum;
      validate.max = maximum;
    }
  }
  const component: KnowledgeFormComponent = { type, key, label, input: true, validate };
  if (type === "currency") component.currency = typeof source.currency === "string" && currencyCodes.has(source.currency as NonNullable<KnowledgeFormComponent["currency"]>) ? source.currency as NonNullable<KnowledgeFormComponent["currency"]> : "CNY";
  if (type === "phoneNumber") component.inputMask = "";
  if (type === "file") {
    const maxFiles = finiteNumber(source.maxFiles);
    component.maxFiles = maxFiles !== undefined && Number.isInteger(maxFiles) && maxFiles >= 1 && maxFiles <= 20 ? maxFiles : 5;
  }
  if (typeof source.description === "string" && source.description.trim()) component.description = source.description.trim();
  if (typeof source.placeholder === "string" && source.placeholder.trim()) component.placeholder = source.placeholder.trim();
  if (type === "radio" || type === "selectboxes") component.values = optionList(source.values);
  if (type === "select") {
    const data = source.data as Record<string, unknown> | undefined;
    component.data = { values: optionList(data?.values) };
    if (source.multiple === true) component.multiple = true;
  }
  if (source.conditional && typeof source.conditional === "object" && !Array.isArray(source.conditional)) {
    const condition = source.conditional as Record<string, unknown>;
    const when = typeof condition.when === "string" ? condition.when.trim() : "";
    if (when) {
      if (!keyPattern.test(when) || !["string", "number", "boolean"].includes(typeof condition.eq)) throw new Error(ktf("knowledge.auto.9b6dd0a97e5b70c8", { value0: label }));
      component.conditional = { show: condition.show !== false, when, eq: condition.eq as string | number | boolean };
    }
  }
  return component;
}

export function normalizeFormContent(value: unknown): KnowledgeFormContent {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(kt("knowledge.auto.cd8770ae0dad4e57"));
  const root = value as Record<string, unknown>;
  if (!Array.isArray(root.components) || root.components.length < 1 || root.components.length > 200) throw new Error(kt("knowledge.auto.e11787e78ee07f8e"));
  const components = root.components.map(canonicalComponent);
  const keys = new Set<string>();
  for (const component of components) {
    if (keys.has(component.key)) throw new Error(ktf("knowledge.auto.33058614c5f6fd17", { value0: component.key }));
    keys.add(component.key);
  }
  for (const component of components) if (component.conditional && (!keys.has(component.conditional.when) || component.conditional.when === component.key)) throw new Error(ktf("knowledge.auto.347fd91e7f2e966e", { value0: component.label }));
  const settingsSource = root.settings && typeof root.settings === "object" && !Array.isArray(root.settings) ? root.settings as Record<string, unknown> : defaultFormSettings;
  const submissionRole = settingsSource.submission_role;
  const settings: KnowledgeFormSettings = {
    submission_role: submissionRole === "editor" || submissionRole === "manager" ? submissionRole : "reader",
    allow_multiple_submissions: settingsSource.allow_multiple_submissions === true,
    opens_at: typeof settingsSource.opens_at === "string" ? settingsSource.opens_at : "",
    closes_at: typeof settingsSource.closes_at === "string" ? settingsSource.closes_at : "",
    confirmation_message: typeof settingsSource.confirmation_message === "string" && settingsSource.confirmation_message.trim() ? settingsSource.confirmation_message.trim() : defaultFormSettings.confirmation_message,
  };
  return { schema_version: 1, display: "form", components, settings };
}

export function parseFormContent(body: string): KnowledgeFormContent {
  try { return normalizeFormContent(JSON.parse(body)); }
  catch { return emptyFormContent(); }
}

export function formioSchema(content: KnowledgeFormContent) {
  return {
    display: "form",
    components: content.components.map(component => {
      if (component.type === "file") return { type: "textfield", key: component.key, label: component.label, input: true, hidden: true, validate: { required: false } };
      if (component.type === "rating" || component.type === "scale") {
        const minimum = Math.trunc(component.validate.min ?? (component.type === "rating" ? 1 : 0));
        const maximum = Math.trunc(component.validate.max ?? (component.type === "rating" ? 5 : 10));
        return { ...structuredClone(component), type: "radio", inline: true, values: Array.from({ length: maximum - minimum + 1 }, (_, index) => ({ label: String(minimum + index), value: String(minimum + index) })) };
      }
      return structuredClone(component);
    }),
  };
}

export function canonicalFormFromBuilder(schema: unknown, settings: KnowledgeFormSettings) {
  const source = schema && typeof schema === "object" && !Array.isArray(schema) ? schema as Record<string, unknown> : {};
  return normalizeFormContent({ schema_version: 1, display: "form", components: source.components, settings });
}

export function formSubmissionAnswers(value: unknown, components: KnowledgeFormComponent[] = []) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const types = new Map(components.map(component => [component.key, component.type]));
  return Object.fromEntries(Object.entries(value as Record<string, unknown>).filter(([, answer]) => answer !== undefined).map(([key, answer]) => {
    if ((types.get(key) === "rating" || types.get(key) === "scale") && typeof answer === "string" && answer.trim() !== "") return [key, Number(answer)];
    return [key, answer];
  }));
}
