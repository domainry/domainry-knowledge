import { kt, ktf } from "./i18n/runtime.ts";
import { Select as AriakitSelect, SelectItem as AriakitSelectItem, SelectItemCheck as AriakitSelectItemCheck, SelectPopover as AriakitSelectPopover, SelectProvider as AriakitSelectProvider } from "@ariakit/react";
import { Check, ChevronDown } from "lucide-react";
import { Children, isValidElement, useMemo, useRef, useState } from "react";
import type { ButtonHTMLAttributes, OptionHTMLAttributes, PropsWithChildren, ReactNode, SelectHTMLAttributes } from "react";

export function Button({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`knowledge-button ${className}`.trim()} {...props} />;
}

type ProductSelectOption = { value: string; label: string; disabled: boolean };

function selectNodeText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(selectNodeText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return selectNodeText(node.props.children);
  return "";
}

function selectOptions(children: ReactNode): ProductSelectOption[] {
  const options: ProductSelectOption[] = [];
  function visit(nodes: ReactNode) {
    Children.forEach(nodes, child => {
      if (!isValidElement<OptionHTMLAttributes<HTMLOptionElement>>(child)) return;
      if (child.type === "option") {
        const label = selectNodeText(child.props.children).trim();
        options.push({ value: String(child.props.value ?? label), label, disabled: !!child.props.disabled });
        return;
      }
      visit(child.props.children);
    });
  }
  visit(children);
  return options;
}

function normalizeSelectValue(value: SelectHTMLAttributes<HTMLSelectElement>["value"], multiple: boolean): string | string[] {
  if (multiple) return Array.isArray(value) ? value.map(String) : value == null ? [] : [String(value)];
  return Array.isArray(value) ? String(value[0] ?? "") : String(value ?? "");
}

/**
 * Product-owned select control. The hidden native element preserves the existing
 * HTML change-event contract while Ariakit owns keyboard, focus and popover behavior.
 */
export function Select({
  children,
  className = "",
  contentEditable,
  defaultValue,
  disabled,
  form,
  id,
  multiple = false,
  name,
  onChange,
  required,
  style,
  title,
  value,
  autoFocus,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
}: SelectHTMLAttributes<HTMLSelectElement>) {
  const options = useMemo(() => selectOptions(children), [children]);
  const controlled = value !== undefined;
  const initial = normalizeSelectValue(value ?? defaultValue ?? (multiple ? [] : options.find(option => !option.disabled)?.value ?? ""), multiple);
  const [uncontrolledValue, setUncontrolledValue] = useState<string | string[]>(initial);
  const selectedValue = controlled ? normalizeSelectValue(value, multiple) : uncontrolledValue;
  const nativeSelect = useRef<HTMLSelectElement>(null);
  const selectedSet = new Set(Array.isArray(selectedValue) ? selectedValue : [selectedValue]);
  const selectedOptions = options.filter(option => selectedSet.has(option.value));
  const displayValue = multiple
    ? selectedOptions.length === 0 ? kt("knowledge.auto.da590a8fe3ce4de0") : selectedOptions.length <= 2 ? selectedOptions.map(option => option.label).join("、") : ktf("knowledge.auto.3a4f3348f0cd60b1", { value0: selectedOptions.length })
    : selectedOptions[0]?.label || kt("knowledge.auto.da590a8fe3ce4de0");

  function readNativeValue(element: HTMLSelectElement): string | string[] {
    return multiple ? Array.from(element.selectedOptions, option => option.value) : element.value;
  }

  function commit(next: string | readonly string[]) {
    const element = nativeSelect.current;
    if (!element) return;
    const normalized = Array.isArray(next) ? next.map(String) : String(next);
    if (multiple) {
      const values = new Set(Array.isArray(normalized) ? normalized : [normalized]);
      Array.from(element.options).forEach(option => { option.selected = values.has(option.value); });
    } else {
      element.value = Array.isArray(normalized) ? normalized[0] || "" : normalized;
    }
    element.dispatchEvent(new Event("change", { bubbles: true }));
    if (!controlled) setUncontrolledValue(readNativeValue(element));
  }

  return <AriakitSelectProvider value={selectedValue} setValue={commit}>
    <span className={`knowledge-select ${multiple ? "is-multiple" : ""} ${className}`.trim()} contentEditable={contentEditable} style={style}>
      <AriakitSelect
        id={id}
        className="knowledge-select-trigger"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-required={required || undefined}
        autoFocus={autoFocus}
        disabled={disabled}
        title={title}
      >
        <span>{displayValue}</span><ChevronDown aria-hidden="true" size={14} />
      </AriakitSelect>
      <select
        ref={nativeSelect}
        className="knowledge-select-native"
        aria-hidden="true"
        tabIndex={-1}
        name={name}
        form={form}
        required={required}
        disabled={disabled}
        multiple={multiple}
        value={selectedValue}
        onChange={event => {
          onChange?.(event);
          if (!controlled) setUncontrolledValue(readNativeValue(event.currentTarget));
        }}
      >{children}</select>
      <AriakitSelectPopover className="knowledge-select-popover" portal gutter={5} sameWidth>
        {options.map((option, index) => <AriakitSelectItem className="knowledge-select-option" key={`${option.value}:${index}`} value={option.value} disabled={option.disabled}>
          <span>{option.label}</span><AriakitSelectItemCheck><Check aria-hidden="true" size={14} /></AriakitSelectItemCheck>
        </AriakitSelectItem>)}
      </AriakitSelectPopover>
    </span>
  </AriakitSelectProvider>;
}

export function EmptyState({ children }: PropsWithChildren) {
  return <div className="knowledge-page-empty">{children}</div>;
}

export function defaultErrorMessage(error: unknown) {
  if (error instanceof DOMException && error.name === "AbortError") return kt("knowledge.auto.83f4727f2b4672a6");
  return error instanceof Error && error.message ? error.message : kt("knowledge.auto.36a92b00137791e8");
}
