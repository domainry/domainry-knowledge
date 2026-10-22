import { ShieldCheck } from "lucide-react";
import type { KnowledgePageContentGovernance } from "./types.ts";

const classificationLabels: Record<KnowledgePageContentGovernance["classification"], string> = {
  public: "公开",
  internal: "内部",
  confidential: "机密",
  restricted: "严格受限",
};

export function KnowledgeClassificationBadge({ governance }: { governance?: KnowledgePageContentGovernance }) {
  if (!governance?.classification) return null;
  return <span className={`knowledge-classification is-${governance.classification}`} title={`内容密级：${classificationLabels[governance.classification]}`}><ShieldCheck size={12} />{classificationLabels[governance.classification]}</span>;
}

export function KnowledgeDynamicWatermark({ governance }: { governance?: KnowledgePageContentGovernance }) {
  const watermark = governance?.dynamic_watermark;
  if (!watermark?.text) return null;
  return <div className="knowledge-dynamic-watermark" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <span key={index}>{watermark.text}</span>)}</div>;
}
