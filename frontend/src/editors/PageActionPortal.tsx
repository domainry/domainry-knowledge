import type { ReactNode } from "react";
import { createPortal } from "react-dom";

export function PageActionPortal({ host, children }: { host?: HTMLElement | null; children: ReactNode }) {
  if (!children) return null;
  const actions = <div className="knowledge-page-export-actions">{children}</div>;
  return host ? createPortal(actions, host) : actions;
}
