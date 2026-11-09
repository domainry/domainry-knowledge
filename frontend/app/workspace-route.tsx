import { KnowledgeWorkspace } from "../src/KnowledgeWorkspace.tsx";
import { knowledgeClient } from "../src/client.ts";
import { formatError } from "../src/session.ts";
import "../src/styles.css";

export default function KnowledgeWorkspaceRoute({ currentUserID, headerSearchHost }: { currentUserID: string; headerSearchHost: HTMLDivElement | null }) {
  return <KnowledgeWorkspace client={knowledgeClient} currentUserID={currentUserID} formatError={formatError} headerSearchHost={headerSearchHost} />;
}
