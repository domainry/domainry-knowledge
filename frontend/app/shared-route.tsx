import { KnowledgeSharedPage } from "../src/KnowledgeSharedPage.tsx";
import { knowledgeClient } from "../src/client.ts";
import { formatError } from "../src/session.ts";
import "../src/styles.css";

export default function KnowledgeSharedRoute({ shareID, pageID }: { shareID: string; pageID: string }) {
  return <KnowledgeSharedPage client={knowledgeClient} shareID={shareID} pageID={pageID} formatError={formatError} />;
}
