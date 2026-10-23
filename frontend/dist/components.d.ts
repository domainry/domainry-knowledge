import type { ButtonHTMLAttributes, PropsWithChildren, SelectHTMLAttributes } from "react";
export declare function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>): import("react").JSX.Element;
/**
 * Product-owned select control. The hidden native element preserves the existing
 * HTML change-event contract while Ariakit owns keyboard, focus and popover behavior.
 */
export declare function Select({ children, className, contentEditable, defaultValue, disabled, form, id, multiple, name, onChange, required, style, title, value, autoFocus, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-describedby": ariaDescribedBy, }: SelectHTMLAttributes<HTMLSelectElement>): import("react").JSX.Element;
export declare function EmptyState({ children }: PropsWithChildren): import("react").JSX.Element;
export declare function defaultErrorMessage(error: unknown): string;
