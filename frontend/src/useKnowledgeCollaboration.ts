import { useEffect, useMemo, useRef, useState } from "react";
import * as Y from "yjs";
import { Awareness, applyAwarenessUpdate, encodeAwarenessUpdate, modifyAwarenessUpdate, removeAwarenessStates } from "y-protocols/awareness";
import { applyKnowledgeYjsState, applyKnowledgeYjsUpdate, collaborationContentSHA256, collaborationPositionChanged, decodeCollaborationBinary, encodeCollaborationBinary, encodeKnowledgeYjsState, mergeKnowledgeYjsUpdates } from "./collaboration.ts";
import { loadKnowledgeOfflineChange, removeKnowledgeOfflineChange, saveKnowledgeOfflineChange } from "./collaborationOffline.ts";
import { createKnowledgeCollaborationTransport } from "./collaborationTransport.ts";
import type { KnowledgeEditorChange, KnowledgeEditorCollaboration } from "./editors/types.ts";
import type { KnowledgeClient, KnowledgeCollaborationPresence, KnowledgeCollaborationServerEvent, KnowledgeCollaborationSession, KnowledgeCollaborationSnapshot, KnowledgeCollaborationUpdate, KnowledgePageView } from "./types.ts";

export type KnowledgeCollaborationConnectionState = "unavailable" | "connecting" | "connected" | "syncing" | "reconnecting" | "error";

type Options = {
  active: boolean;
  client: KnowledgeClient;
  libraryID: string;
  pageID: string;
  currentUserID: string;
  initialTitle: string;
  initialContent: string;
  resolveUserName?(userID: string): string;
  resolveUserColor?(userID: string): string;
  onDocument(title: string, content: string, synced: boolean): void;
  onError(error: unknown): void;
};

type PendingDocument = {
  updateID: string;
  createdAt: number;
  title: string;
  content: string;
  yjsUpdate: string;
  yjsState: string;
  editedBlockIDs: string[];
};

const checkpointInterval = 32;
const collaborationConnectTimeout = 30_000;
const collaborationRevocationCodes = new Set([
  "knowledge.collaboration_session_revoked",
  "knowledge.collaboration_session_not_found",
  "knowledge.library_not_found",
  "knowledge.page_not_found",
  "knowledge.page_archived",
]);

function collaborationRevocationCode(failure: unknown) {
  const code = typeof failure === "object" && failure !== null && "code" in failure && typeof failure.code === "string"
    ? failure.code
    : failure instanceof Error ? failure.message : "";
  return collaborationRevocationCodes.has(code) ? code : "";
}

export function useKnowledgeCollaboration(options: Options) {
  const transport = useMemo(() => createKnowledgeCollaborationTransport(options.client, options.libraryID, options.pageID), [options.client, options.libraryID, options.pageID]);
  const available = transport !== null;
  const document = useMemo(() => new Y.Doc(), [options.pageID]);
  const fragment = useMemo(() => document.getXmlFragment("knowledge-document"), [document]);
  const titleText = useMemo(() => document.getText("knowledge-title"), [document]);
  const awareness = useMemo(() => new Awareness(document), [document]);
  const [state, setState] = useState<KnowledgeCollaborationConnectionState>(available ? "connecting" : "unavailable");
  const [ready, setReady] = useState(false);
  const [initializeFromBody, setInitializeFromBody] = useState(false);
  const [presence, setPresence] = useState<KnowledgeCollaborationPresence[]>([]);
  const [mergedUserIDs, setMergedUserIDs] = useState<string[]>([]);
  const [mergeCount, setMergeCount] = useState(0);
  const [serverClock, setServerClock] = useState(0);
  const [draftRevision, setDraftRevision] = useState(0);
  const [userID, setUserID] = useState("");
  const [sessionID, setSessionID] = useState("");
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
  const syncFailuresRef = useRef(0);
  const generationRef = useRef(0);
  const clientIDRef = useRef<string>(crypto.randomUUID());
  const localUpdatesRef = useRef<Uint8Array[]>([]);
  const appliedCheckpointRef = useRef(-1);
  const callbacksRef = useRef({ onDocument: options.onDocument, onError: options.onError });
  const identityResolversRef = useRef({ resolveUserName: options.resolveUserName, resolveUserColor: options.resolveUserColor });
  callbacksRef.current = { onDocument: options.onDocument, onError: options.onError };
  identityResolversRef.current = { resolveUserName: options.resolveUserName, resolveUserColor: options.resolveUserColor };

  useEffect(() => {
    const collect = (update: Uint8Array, origin: unknown) => {
      if (origin !== "knowledge-remote") localUpdatesRef.current.push(update);
    };
    document.on("update", collect);
    return () => document.off("update", collect);
  }, [document]);

  useEffect(() => () => awareness.destroy(), [awareness]);

  function currentAwarenessUpdate() {
    return encodeCollaborationBinary(encodeAwarenessUpdate(awareness, [awareness.clientID]));
  }

  function persistPending(pending: PendingDocument) {
    if (!options.currentUserID) return;
    void saveKnowledgeOfflineChange({
      userID: options.currentUserID,
      libraryID: options.libraryID,
      pageID: options.pageID,
      clientID: clientIDRef.current,
      updateID: pending.updateID,
      createdAt: pending.createdAt,
      title: pending.title,
      content: pending.content,
      yjsUpdate: pending.yjsUpdate,
      yjsState: pending.yjsState,
      editedBlockIDs: pending.editedBlockIDs,
      cursorBlockID: cursorRef.current.cursor || undefined,
      selectionBlockID: cursorRef.current.selection || undefined,
      updatedAt: Date.now(),
    }).catch(() => undefined);
  }

  function applyPresence(nextPresence: KnowledgeCollaborationPresence[]) {
    const activeUsers = new Set(nextPresence.map(item => item.user_id));
    for (const item of nextPresence) {
      if (!item.awareness_update || item.user_id === sessionRef.current?.user_id) continue;
      try {
        const trusted = modifyAwarenessUpdate(decodeCollaborationBinary(item.awareness_update), state => ({
          ...state,
          user: {
            id: item.user_id,
            name: identityResolversRef.current.resolveUserName?.(item.user_id) || item.display_name || item.user_id,
            color: identityResolversRef.current.resolveUserColor?.(item.user_id) || "#315f9d",
          },
        }));
        applyAwarenessUpdate(awareness, trusted, "knowledge-remote");
      } catch {
        // A malformed transient cursor is ignored; document state remains valid.
      }
    }
    const staleClients: number[] = [];
    awareness.getStates().forEach((value, clientID) => {
      if (clientID === awareness.clientID) return;
      const userID = typeof value.user?.id === "string" ? value.user.id : "";
      if (!userID || !activeUsers.has(userID)) staleClients.push(clientID);
    });
    if (staleClients.length > 0) removeAwarenessStates(awareness, staleClients, "knowledge-remote");
    setPresence(nextPresence);
  }

  function applySnapshotYjs(snapshot: KnowledgeCollaborationSnapshot) {
    if (snapshot.yjs_state && snapshot.yjs_state_clock !== appliedCheckpointRef.current) {
      applyKnowledgeYjsState(document, snapshot.yjs_state);
      appliedCheckpointRef.current = snapshot.yjs_state_clock;
    }
    for (const update of snapshot.yjs_updates || []) applyKnowledgeYjsUpdate(document, update.yjs_update);
    if (snapshot.yjs_state || snapshot.yjs_updates?.length) setInitializeFromBody(false);
  }

  function applyServerResult(session: KnowledgeCollaborationSession, events: { user_id?: string }[], synced: boolean) {
    sessionRef.current = session;
    setSessionID(session.id);
    confirmedRef.current = session.snapshot;
    applySnapshotYjs(session.snapshot);
    applyPresence(session.presence);
    setServerClock(session.snapshot.server_clock);
    setDraftRevision(session.snapshot.draft_revision);
    setUserID(session.user_id);
    const remoteUsers = [...new Set(events.map(event => event.user_id || "").filter(id => id && id !== session.user_id))];
    if (remoteUsers.length > 0) {
      setMergedUserIDs(remoteUsers);
      setMergeCount(count => count + events.filter(event => event.user_id && event.user_id !== session.user_id).length);
    }
    const mergedTitle = titleText.toString() || session.snapshot.title;
    if (pendingRef.current) {
      pendingRef.current.title = mergedTitle;
      persistPending(pendingRef.current);
    }
    callbacksRef.current.onDocument(pendingRef.current?.title || mergedTitle, session.snapshot.content, synced);
  }

  function applyStreamEvent(event: KnowledgeCollaborationServerEvent) {
    const session = sessionRef.current;
    if (!session) return;
    if (event.type === "presence") {
      const nextPresence = event.presence || [];
      sessionRef.current = { ...session, presence: nextPresence };
      applyPresence(nextPresence);
      return;
    }
    if (event.type === "heartbeat") {
      if (!pendingRef.current && !drainRef.current) setState("connected");
      return;
    }
    if (event.type !== "update" && event.type !== "snapshot") return;
    const confirmed = confirmedRef.current;
    if (event.snapshot) applySnapshotYjs(event.snapshot);
    else if (event.update?.yjs_update) applyKnowledgeYjsUpdate(document, event.update.yjs_update);
    const next = event.snapshot || (event.update && confirmed ? {
      ...confirmed,
      draft_revision: confirmed.draft_revision + 1,
      server_clock: event.clock,
      title: event.update.title?.trim() || confirmed.title,
      content: event.update.content,
      content_sha256: event.update.content_sha256,
      yjs_state: event.update.yjs_state || confirmed.yjs_state,
      yjs_state_clock: event.update.yjs_state ? event.clock : confirmed.yjs_state_clock,
      yjs_update_bytes_since_checkpoint: event.update.yjs_state ? 0 : confirmed.yjs_update_bytes_since_checkpoint + decodeCollaborationBinary(event.update.yjs_update).byteLength,
      yjs_updates: [],
    } : undefined);
    if (!next) return;
    confirmedRef.current = next;
    sessionRef.current = { ...session, server_clock: next.server_clock, snapshot: next };
    setServerClock(next.server_clock);
    setDraftRevision(next.draft_revision);
    if (event.user_id && event.user_id !== session.user_id) {
      setMergedUserIDs([event.user_id]);
      setMergeCount(count => count + 1);
    }
    const mergedTitle = titleText.toString() || next.title;
    if (pendingRef.current) {
      pendingRef.current.title = mergedTitle;
      persistPending(pendingRef.current);
    }
    callbacksRef.current.onDocument(pendingRef.current?.title || mergedTitle, next.content, !pendingRef.current);
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
    let offline: Awaited<ReturnType<typeof loadKnowledgeOfflineChange>> = null;
    clientIDRef.current = crypto.randomUUID();
    sessionRef.current = null;
    confirmedRef.current = null;
    pendingRef.current = null;
    localUpdatesRef.current = [];
    appliedCheckpointRef.current = -1;
    drainRef.current = null;
    if (bodyTimerRef.current !== null) window.clearTimeout(bodyTimerRef.current);
    if (presenceTimerRef.current !== null) window.clearTimeout(presenceTimerRef.current);
    bodyTimerRef.current = null;
    presenceTimerRef.current = null;
    setReady(false);
    setState(retryNonce > 0 ? "reconnecting" : "connecting");
    setPresence([]);

    const clearRevokedState = (failure: unknown) => {
      pendingRef.current = null;
      localUpdatesRef.current = [];
      sessionRef.current = null;
      setSessionID("");
      awareness.setLocalState(null);
      removeAwarenessStates(awareness, [...awareness.getStates().keys()], "knowledge-remote");
      if (options.currentUserID) void removeKnowledgeOfflineChange(options.currentUserID, options.libraryID, options.pageID).catch(() => undefined);
      setReady(false);
      setPresence([]);
      setState("error");
      callbacksRef.current.onError(failure);
    };

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
            const updateBytes = decodeCollaborationBinary(sent.yjsUpdate).byteLength;
            const checkpointDue = !confirmed.yjs_state || confirmed.server_clock-confirmed.yjs_state_clock >= checkpointInterval-1 || confirmed.yjs_update_bytes_since_checkpoint+updateBytes >= 2*1024*1024;
            const update: KnowledgeCollaborationUpdate = {
              client_id: clientIDRef.current,
              update_id: sent.updateID,
              client_created_at: new Date(sent.createdAt).toISOString(),
              title: title !== confirmed.title ? title : undefined,
              yjs_update: sent.yjsUpdate,
              yjs_state: checkpointDue ? sent.yjsState : undefined,
              content: sent.content,
              content_sha256: await collaborationContentSHA256(sent.content),
              edited_block_ids: sent.editedBlockIDs,
            };
            const response = await transport!.sync({
              session_id: sessionRef.current.id,
              after_clock: confirmed.server_clock,
              update,
              awareness_update: currentAwarenessUpdate(),
              cursor_block_id: cursorRef.current.cursor || undefined,
              selection_block_id: cursorRef.current.selection || undefined,
            }, AbortSignal.timeout(30_000));
            if (generationRef.current !== generation) return;
            syncFailuresRef.current = 0;
            if (response.applied && pendingRef.current?.updateID === sent.updateID) {
              pendingRef.current = null;
              if (options.currentUserID) void removeKnowledgeOfflineChange(options.currentUserID, options.libraryID, options.pageID).catch(() => undefined);
            }
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
            if (collaborationRevocationCode(failure)) {
              clearRevokedState(failure);
              return;
            }
            syncFailuresRef.current++;
            setState("reconnecting");
            if (syncFailuresRef.current >= 5) callbacksRef.current.onError(failure);
            const delay = Math.min(8_000, 500 * 2 ** Math.min(syncFailuresRef.current-1, 4));
            window.setTimeout(() => {
              if (generationRef.current === generation && pendingRef.current) setRetryNonce(value => value + 1);
            }, delay);
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
        await transport!.sync({
          session_id: session.id,
          after_clock: confirmedRef.current?.server_clock || 0,
          awareness_update: currentAwarenessUpdate(),
          cursor_block_id: cursorRef.current.cursor || undefined,
          selection_block_id: cursorRef.current.selection || undefined,
        }, AbortSignal.timeout(10_000));
      } catch {
        // Presence is deliberately lossy. The SSE stream owns connection state
        // and the next selection/body update carries the latest cursor again.
      }
    };

    void loadKnowledgeOfflineChange(options.currentUserID, options.libraryID, options.pageID).catch(() => null).then(saved => {
      offline = saved;
      if (saved) clientIDRef.current = saved.clientID;
      // A browser fetch can remain pending when the development server is
      // restarted between retries. Bound the handshake so the retry state can
      // actually advance instead of leaving the editor on "reconnecting"
      // forever. The effect's abort still wins immediately on page changes.
      return transport!.connect(clientIDRef.current, AbortSignal.any([abort.signal, AbortSignal.timeout(collaborationConnectTimeout)]));
    }).then(session => {
      if (abort.signal.aborted || generationRef.current !== generation) return;
      syncFailuresRef.current = 0;
      sessionRef.current = session;
      confirmedRef.current = session.snapshot;
      if (!session.snapshot.yjs_state && !session.snapshot.yjs_updates?.length) {
        setInitializeFromBody(true);
        if (titleText.length === 0 && session.snapshot.title) titleText.insert(0, session.snapshot.title);
      }
      applyServerResult(session, [], true);
      if (offline) {
        applyKnowledgeYjsState(document, offline.yjsState);
        pendingRef.current = {
          updateID: offline.updateID,
          createdAt: offline.createdAt,
          title: titleText.toString() || offline.title,
          content: offline.content,
          yjsUpdate: offline.yjsUpdate,
          yjsState: offline.yjsState,
          editedBlockIDs: offline.editedBlockIDs,
        };
        cursorRef.current = { cursor: offline.cursorBlockID || "", selection: offline.selectionBlockID || "" };
        callbacksRef.current.onDocument(pendingRef.current.title, pendingRef.current.content, false);
      }
      setReady(true);
      setState(offline ? "syncing" : "connected");
      window.setTimeout(() => {
        if (generationRef.current !== generation) return;
        if (pendingRef.current) void pumpRef.current();
        else void presenceRef.current();
      }, 0);
      void (async () => {
        let failures = 0;
        while (!abort.signal.aborted && generationRef.current === generation && sessionRef.current) {
          let revokedCode = "";
          try {
            await transport!.stream(session.id, confirmedRef.current?.server_clock || 0, failures, event => {
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
              clearRevokedState(failure);
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
        if (collaborationRevocationCode(failure)) {
          clearRevokedState(failure);
          return;
        }
        syncFailuresRef.current++;
        setState("reconnecting");
        // A temporary network or development-server outage must never turn
        // into a terminal editor state. Keep retrying with a capped backoff;
        // only an explicit authorization/revocation result above is terminal.
        // Surface one error after the initial retry budget so the outage is
        // visible without spamming a new banner on every later attempt.
        if (syncFailuresRef.current === 5) callbacksRef.current.onError(failure);
        const delay = Math.min(8_000, 500 * 2 ** Math.min(syncFailuresRef.current-1, 4));
        window.setTimeout(() => {
          if (generationRef.current === generation) setRetryNonce(value => value + 1);
        }, delay);
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
      localUpdatesRef.current = [];
      removeAwarenessStates(awareness, [...awareness.getStates().keys()].filter(id => id !== awareness.clientID), "knowledge-remote");
      const session = sessionRef.current;
      sessionRef.current = null;
      setSessionID("");
      if (session) void transport!.close(session.id, AbortSignal.timeout(10_000)).catch(() => undefined);
    };
  }, [available, awareness, document, options.active, options.currentUserID, options.libraryID, options.pageID, retryNonce, titleText, transport]);

  function edit(title: string, content: string, change?: KnowledgeEditorChange) {
    const confirmed = confirmedRef.current;
    // Once the first snapshot is ready, a transient SSE reconnect must not drop
    // local edits. The POST session is still valid while the downlink reconnects,
    // so queue the newest canonical document and let the normal pump submit it.
    if (!confirmed || !ready) return;
    const requestedTitle = title.trim();
    if (titleText.toString() !== requestedTitle) {
      document.transact(() => {
        if (titleText.length > 0) titleText.delete(0, titleText.length);
        if (requestedTitle) titleText.insert(0, requestedTitle);
      }, "knowledge-title");
    }
    const updateParts = localUpdatesRef.current.splice(0);
    const incremental = mergeKnowledgeYjsUpdates(updateParts);
    if (!pendingRef.current && title.trim() === confirmed.title && content === confirmed.content) return;
    if (!incremental && !pendingRef.current) return;
    const previousUpdate = pendingRef.current?.yjsUpdate;
    const mergedUpdate = mergeKnowledgeYjsUpdates([previousUpdate, incremental].filter((value): value is string => Boolean(value)).map(decodeCollaborationBinary));
    pendingRef.current = {
      updateID: crypto.randomUUID(),
      createdAt: pendingRef.current?.createdAt || Date.now(),
      title: titleText.toString() || requestedTitle,
      content,
      yjsUpdate: mergedUpdate,
      yjsState: encodeKnowledgeYjsState(document),
      editedBlockIDs: [...new Set([...(pendingRef.current?.editedBlockIDs || []), ...(change?.editedBlockIDs || [])])].slice(0, 2048),
    };
    cursorRef.current = { cursor: change?.cursorBlockID || "", selection: change?.selectionBlockID || "" };
    persistPending(pendingRef.current);
    setState("syncing");
    if (bodyTimerRef.current !== null) window.clearTimeout(bodyTimerRef.current);
    bodyTimerRef.current = window.setTimeout(() => {
      bodyTimerRef.current = null;
      void pumpRef.current();
    }, 120);
  }

  function updatePresence(cursorBlockID?: string, selectionBlockID?: string) {
    if (!collaborationPositionChanged(cursorRef.current, cursorBlockID, selectionBlockID)) return;
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
    return transport!.publish({
      session_id: session.id,
      client_id: session.client_id,
      publish_note: publishNote,
    }, AbortSignal.timeout(60_000));
  }

  async function flush() {
    if (bodyTimerRef.current !== null) {
      window.clearTimeout(bodyTimerRef.current);
      bodyTimerRef.current = null;
    }
    await pumpRef.current();
    const confirmed = confirmedRef.current;
    if (!confirmed || pendingRef.current) throw new Error("协作更改尚未完成合并");
    return { draftRevision: confirmed.draft_revision, title: confirmed.title, content: confirmed.content };
  }

  const editorCollaboration = useMemo<KnowledgeEditorCollaboration>(() => ({
    document,
    fragment,
    initializeFromBody,
    user: { name: options.resolveUserName?.(userID) || userID || "当前用户", color: options.resolveUserColor?.(userID) || "#0b8f72" },
    provider: { awareness },
  }), [awareness, document, fragment, initializeFromBody, options.resolveUserColor, options.resolveUserName, userID]);
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
    sessionID,
    userID,
    edit,
    updatePresence,
    publish,
    flush,
    reconnect: () => setRetryNonce(value => value + 1),
    encodeState: () => encodeKnowledgeYjsState(document),
  };
}
