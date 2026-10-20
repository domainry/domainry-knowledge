import { useEffect, useMemo, useRef, useState } from "react";
import * as Y from "yjs";
import { applyKnowledgeYjsState, collaborationContentSHA256, encodeKnowledgeYjsState } from "./collaboration.ts";
import type { KnowledgeEditorChange, KnowledgeEditorCollaboration } from "./editors/types.ts";
import type { KnowledgeClient, KnowledgeCollaborationPresence, KnowledgeCollaborationServerEvent, KnowledgeCollaborationSession, KnowledgeCollaborationSnapshot, KnowledgeCollaborationUpdate, KnowledgePageView } from "./types.ts";

export type KnowledgeCollaborationConnectionState = "unavailable" | "connecting" | "connected" | "syncing" | "reconnecting" | "error";

type Options = {
  active: boolean;
  client: KnowledgeClient;
  libraryID: string;
  pageID: string;
  initialTitle: string;
  initialContent: string;
  onDocument(title: string, content: string, synced: boolean): void;
  onError(error: unknown): void;
};

type PendingDocument = {
  updateID: string;
  title: string;
  content: string;
  change: KnowledgeEditorChange;
};

export function useKnowledgeCollaboration(options: Options) {
  const available = !!(options.client.connectKnowledgeCollaboration && options.client.syncKnowledgeCollaboration && options.client.streamKnowledgeCollaborationEvents && options.client.closeKnowledgeCollaboration && options.client.publishKnowledgeCollaboration);
  const document = useMemo(() => new Y.Doc(), [options.pageID]);
  const fragment = useMemo(() => document.getXmlFragment("knowledge-document"), [document]);
  const [state, setState] = useState<KnowledgeCollaborationConnectionState>(available ? "connecting" : "unavailable");
  const [ready, setReady] = useState(false);
  const [initializeFromBody, setInitializeFromBody] = useState(false);
  const [presence, setPresence] = useState<KnowledgeCollaborationPresence[]>([]);
  const [mergedUserIDs, setMergedUserIDs] = useState<string[]>([]);
  const [mergeCount, setMergeCount] = useState(0);
  const [serverClock, setServerClock] = useState(0);
  const [draftRevision, setDraftRevision] = useState(0);
  const [userID, setUserID] = useState("");
  const [retryNonce, setRetryNonce] = useState(0);
  const sessionRef = useRef<KnowledgeCollaborationSession | null>(null);
  const confirmedRef = useRef<KnowledgeCollaborationSnapshot | null>(null);
  const pendingRef = useRef<PendingDocument | null>(null);
  const cursorRef = useRef({ cursor: "", selection: "" });
  const drainRef = useRef<Promise<void> | null>(null);
  const pumpRef = useRef<() => Promise<void>>(async () => undefined);
  const presenceRef = useRef<() => Promise<void>>(async () => undefined);
  const bodyTimerRef = useRef<number | null>(null);
  const presenceTimerRef = useRef<number | null>(null);
  const generationRef = useRef(0);
  const clientIDRef = useRef(crypto.randomUUID());
  const lastAppliedStateRef = useRef("");
  const callbacksRef = useRef({ onDocument: options.onDocument, onError: options.onError });
  callbacksRef.current = { onDocument: options.onDocument, onError: options.onError };

  function applyServerResult(session: KnowledgeCollaborationSession, events: { user_id?: string }[], synced: boolean) {
    sessionRef.current = session;
    confirmedRef.current = session.snapshot;
    if (session.snapshot.yjs_state && session.snapshot.yjs_state !== lastAppliedStateRef.current) {
      applyKnowledgeYjsState(document, session.snapshot.yjs_state);
      lastAppliedStateRef.current = session.snapshot.yjs_state;
    }
    if (session.snapshot.yjs_state) setInitializeFromBody(false);
    setPresence(session.presence);
    setServerClock(session.snapshot.server_clock);
    setDraftRevision(session.snapshot.draft_revision);
    setUserID(session.user_id);
    const remoteUsers = [...new Set(events.map(event => event.user_id || "").filter(id => id && id !== session.user_id))];
    if (remoteUsers.length > 0) {
      setMergedUserIDs(remoteUsers);
      setMergeCount(count => count + events.filter(event => event.user_id && event.user_id !== session.user_id).length);
    }
    callbacksRef.current.onDocument(pendingRef.current?.title || session.snapshot.title, session.snapshot.content, synced);
  }

  function applyStreamEvent(event: KnowledgeCollaborationServerEvent) {
    const session = sessionRef.current;
    if (!session) return;
    if (event.type === "presence") {
      const nextPresence = event.presence || [];
      sessionRef.current = { ...session, presence: nextPresence };
      setPresence(nextPresence);
      return;
    }
    if (event.type === "heartbeat") {
      if (!pendingRef.current && !drainRef.current) setState("connected");
      return;
    }
    if (event.type !== "update" && event.type !== "snapshot") return;
    const confirmed = confirmedRef.current;
    const next = event.snapshot || (event.update && confirmed ? {
      ...confirmed,
      draft_revision: confirmed.draft_revision + 1,
      server_clock: event.clock,
      title: event.update.title?.trim() || confirmed.title,
      content: event.update.content,
      content_sha256: event.update.content_sha256,
      yjs_state: event.update.yjs_state,
    } : undefined);
    if (!next) return;
    confirmedRef.current = next;
    sessionRef.current = { ...session, server_clock: next.server_clock, snapshot: next };
    if (next.yjs_state && next.yjs_state !== lastAppliedStateRef.current) {
      applyKnowledgeYjsState(document, next.yjs_state);
      lastAppliedStateRef.current = next.yjs_state;
      setInitializeFromBody(false);
    }
    setServerClock(next.server_clock);
    setDraftRevision(next.draft_revision);
    if (event.user_id && event.user_id !== session.user_id) {
      setMergedUserIDs([event.user_id]);
      setMergeCount(count => count + 1);
    }
    callbacksRef.current.onDocument(pendingRef.current?.title || next.title, next.content, !pendingRef.current);
    if (!pendingRef.current && !drainRef.current) setState("connected");
  }

  useEffect(() => {
    if (!options.active || !available) {
      setState(available ? "connecting" : "unavailable");
      setReady(false);
      setPresence([]);
      return;
    }
    const generation = ++generationRef.current;
    const abort = new AbortController();
    const clientID = crypto.randomUUID();
    clientIDRef.current = clientID;
    sessionRef.current = null;
    confirmedRef.current = null;
    pendingRef.current = null;
    drainRef.current = null;
    if (bodyTimerRef.current !== null) window.clearTimeout(bodyTimerRef.current);
    if (presenceTimerRef.current !== null) window.clearTimeout(presenceTimerRef.current);
    bodyTimerRef.current = null;
    presenceTimerRef.current = null;
    setReady(false);
    setState(retryNonce > 0 ? "reconnecting" : "connecting");
    setPresence([]);

    const pump = async () => {
      if (drainRef.current) return drainRef.current;
      const task = (async () => {
        try {
          while (generationRef.current === generation && sessionRef.current && pendingRef.current) {
            setState("syncing");
            const sent = pendingRef.current;
            const confirmed = confirmedRef.current;
            if (!confirmed) return;
            const title = sent.title.trim();
            const update: KnowledgeCollaborationUpdate = {
              client_id: clientIDRef.current,
              update_id: sent.updateID,
              title: title !== confirmed.title ? title : undefined,
              yjs_update: sent.change.yjsUpdate,
              yjs_state: sent.change.yjsState,
              content: sent.content,
              content_sha256: await collaborationContentSHA256(sent.content),
              edited_block_ids: sent.change.editedBlockIDs,
            };
            const response = await options.client.syncKnowledgeCollaboration!(options.libraryID, options.pageID, {
              session_id: sessionRef.current.id,
              after_clock: confirmed.server_clock,
              update,
              cursor_block_id: cursorRef.current.cursor || undefined,
              selection_block_id: cursorRef.current.selection || undefined,
            }, AbortSignal.timeout(30_000));
            if (generationRef.current !== generation) return;
            if (response.applied && pendingRef.current?.updateID === sent.updateID) pendingRef.current = null;
            applyServerResult(response.session, response.events, response.applied && pendingRef.current === null);
            if (!response.applied) {
              // The server clock advanced first. Applying its Yjs checkpoint merges
              // the remote update into the local Y.Doc; BlockNote emits a new
              // canonical document and edit() replaces this stale pending item.
              window.setTimeout(() => {
                if (generationRef.current === generation && pendingRef.current?.updateID !== sent.updateID) void pumpRef.current();
              }, 0);
              break;
            }
          }
          if (generationRef.current === generation && !pendingRef.current) setState("connected");
        } catch (failure) {
          if (generationRef.current === generation) {
            setState("error");
            callbacksRef.current.onError(failure);
          }
        }
      })();
      drainRef.current = task;
      try { await task; } finally { if (drainRef.current === task) drainRef.current = null; }
    };
    pumpRef.current = pump;

    presenceRef.current = async () => {
      const session = sessionRef.current;
      if (!session || pendingRef.current || drainRef.current || generationRef.current !== generation) return;
      try {
        await options.client.syncKnowledgeCollaboration!(options.libraryID, options.pageID, {
          session_id: session.id,
          after_clock: confirmedRef.current?.server_clock || 0,
          cursor_block_id: cursorRef.current.cursor || undefined,
          selection_block_id: cursorRef.current.selection || undefined,
        }, AbortSignal.timeout(10_000));
      } catch {
        // Presence is deliberately lossy. The SSE stream owns connection state
        // and the next selection/body update carries the latest cursor again.
      }
    };

    void options.client.connectKnowledgeCollaboration!(options.libraryID, options.pageID, { client_id: clientID }, abort.signal).then(session => {
      if (abort.signal.aborted || generationRef.current !== generation) return;
      sessionRef.current = session;
      confirmedRef.current = session.snapshot;
      setInitializeFromBody(!session.snapshot.yjs_state);
      applyServerResult(session, [], true);
      setReady(true);
      setState("connected");
      void (async () => {
        let failures = 0;
        while (!abort.signal.aborted && generationRef.current === generation && sessionRef.current) {
          let revokedCode = "";
          try {
            await options.client.streamKnowledgeCollaborationEvents!(options.libraryID, options.pageID, session.id, confirmedRef.current?.server_clock || 0, event => {
              if (event.type === "revoked") {
                revokedCode = event.code || "knowledge.collaboration_revoked";
                throw new Error(revokedCode);
              }
              applyStreamEvent(event);
            }, abort.signal);
            if (abort.signal.aborted || generationRef.current !== generation) return;
            throw new Error("knowledge.collaboration_stream_closed");
          } catch (failure) {
            if (abort.signal.aborted || generationRef.current !== generation) return;
            if (revokedCode) {
              setState("error");
              callbacksRef.current.onError(failure);
              return;
            }
            failures++;
            setState("reconnecting");
            if (failures >= 5) {
              callbacksRef.current.onError(failure);
              setRetryNonce(value => value + 1);
              return;
            }
            await new Promise(resolve => window.setTimeout(resolve, Math.min(4_000, 500 * 2 ** (failures - 1))));
          }
        }
      })();
    }).catch(failure => {
      if (!abort.signal.aborted && generationRef.current === generation) {
        setState("error");
        callbacksRef.current.onError(failure);
      }
    });

    return () => {
      abort.abort();
      generationRef.current++;
      if (bodyTimerRef.current !== null) window.clearTimeout(bodyTimerRef.current);
      if (presenceTimerRef.current !== null) window.clearTimeout(presenceTimerRef.current);
      bodyTimerRef.current = null;
      presenceTimerRef.current = null;
      drainRef.current = null;
      pendingRef.current = null;
      const session = sessionRef.current;
      sessionRef.current = null;
      if (session) void options.client.closeKnowledgeCollaboration!(options.libraryID, options.pageID, session.id, AbortSignal.timeout(10_000)).catch(() => undefined);
    };
  }, [available, document, options.active, options.client, options.libraryID, options.pageID, retryNonce]);

  function edit(title: string, content: string, change?: KnowledgeEditorChange) {
    const confirmed = confirmedRef.current;
    if (!confirmed || !ready || state === "connecting" || state === "reconnecting" || state === "error") return;
    const currentState: KnowledgeEditorChange = change || (() => {
      const encoded = encodeKnowledgeYjsState(document);
      return { yjsUpdate: encoded, yjsState: encoded, editedBlockIDs: [] };
    })();
    if (!pendingRef.current && title.trim() === confirmed.title && content === confirmed.content) return;
    pendingRef.current = { updateID: crypto.randomUUID(), title, content, change: currentState };
    cursorRef.current = { cursor: currentState.cursorBlockID || "", selection: currentState.selectionBlockID || "" };
    setState("syncing");
    if (bodyTimerRef.current !== null) window.clearTimeout(bodyTimerRef.current);
    bodyTimerRef.current = window.setTimeout(() => {
      bodyTimerRef.current = null;
      void pumpRef.current();
    }, 120);
  }

  function updatePresence(cursorBlockID?: string, selectionBlockID?: string) {
    cursorRef.current = { cursor: cursorBlockID || "", selection: selectionBlockID || "" };
    if (!ready || state === "connecting" || state === "reconnecting" || state === "error") return;
    if (presenceTimerRef.current !== null) window.clearTimeout(presenceTimerRef.current);
    presenceTimerRef.current = window.setTimeout(() => {
      presenceTimerRef.current = null;
      void presenceRef.current();
    }, 250);
  }

  async function publish(publishNote?: string): Promise<KnowledgePageView> {
    if (bodyTimerRef.current !== null) {
      window.clearTimeout(bodyTimerRef.current);
      bodyTimerRef.current = null;
    }
    await pumpRef.current();
    const session = sessionRef.current;
    if (!session || pendingRef.current) throw new Error("协作更改尚未完成合并");
    return options.client.publishKnowledgeCollaboration!(options.libraryID, options.pageID, {
      session_id: session.id,
      client_id: session.client_id,
      publish_note: publishNote,
    }, AbortSignal.timeout(60_000));
  }

  const editorCollaboration = useMemo<KnowledgeEditorCollaboration>(() => ({
    document,
    fragment,
    initializeFromBody,
    user: { name: userID || "当前用户", color: "#0b8f72" },
  }), [document, fragment, initializeFromBody, userID]);
  const onlineUsers = useMemo(() => new Set(presence.map(item => item.user_id)).size, [presence]);
  return {
    available: available && options.active,
    ready,
    editorCollaboration,
    state,
    presence,
    onlineUsers,
    mergedUserIDs,
    mergeCount,
    serverClock,
    draftRevision,
    userID,
    edit,
    updatePresence,
    publish,
    reconnect: () => setRetryNonce(value => value + 1),
    encodeState: () => encodeKnowledgeYjsState(document),
  };
}
