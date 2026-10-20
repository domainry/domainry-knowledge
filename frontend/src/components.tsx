import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

export function Button({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`knowledge-button ${className}`.trim()} {...props} />;
}

export function EmptyState({ children }: PropsWithChildren) {
  return <div className="knowledge-page-empty">{children}</div>;
}

export function defaultErrorMessage(error: unknown) {
  if (error instanceof DOMException && error.name === "AbortError") return "操作已取消。";
  return error instanceof Error && error.message ? error.message : "知识库暂时不可用，请稍后重试。";
}
