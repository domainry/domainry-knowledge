import { kt, ktf } from "./i18n/runtime.ts";
import { ShieldCheck } from "lucide-react";
import type { KnowledgePageContentGovernance } from "./types.ts";

const classificationLabels: Record<KnowledgePageContentGovernance["classification"], string> = {
  get public() { return kt("knowledge.auto.7a73baf0ce9abe54"); },
  get internal() { return kt("knowledge.auto.6f225eb36d6d4e6a"); },
  get confidential() { return kt("knowledge.auto.3fcc476715c11fd7"); },
  get restricted() { return kt("knowledge.auto.ff93825419f899a5"); },
};

export function KnowledgeClassificationBadge({ governance }: { governance?: KnowledgePageContentGovernance }) {
  if (!governance?.classification) return null;
  return <span className={`knowledge-classification is-${governance.classification}`} title={ktf("knowledge.auto.e5f0cad8f90b8599", { value0: classificationLabels[governance.classification] })}><ShieldCheck size={12} />{classificationLabels[governance.classification]}</span>;
}

export function KnowledgeDynamicWatermark({ governance }: { governance?: KnowledgePageContentGovernance }) {
  const watermark = governance?.dynamic_watermark;
  if (!watermark?.text) return null;
  return <div className="knowledge-dynamic-watermark" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <span key={index}>{watermark.text}</span>)}</div>;
}
