import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { collaborationPositionChanged } from "./collaboration.ts";
import { createKnowledgeCollaborationTransport } from "./collaborationTransport.ts";
import type { KnowledgeClient, KnowledgeCollaborationPresence, KnowledgeCollaborationServerEvent, KnowledgeCollaborationSnapshot, KnowledgeCollaborationSession } from "./types.ts";

type NativeAwarenessOptions = {
  active: boolean;
  client: KnowledgeClient;
  libraryID: string;
  pageID: string;
  onSnapshot?(snapshot: KnowledgeCollaborationSnapshot): void;
  onError?(failure: unknown): void;
};

export function useKnowledgeNativeAwareness(options: NativeAwarenessOptions) {
  const transport = useMemo(() => createKnowledgeCollaborationTransport(options.client, options.libraryID, options.pageID), [options.client, options.libraryID, options.pageID]);
  const callbacksRef = useRef({ onSnapshot: options.onSnapshot, onError: options.onError });
  callbacksRef.current = { onSnapshot: options.onSnapshot, onError: options.onError };
  const sessionRef = useRef<KnowledgeCollaborationSession | null>(null);
  const clockRef = useRef(0);
  const positionRef = useRef({ cursor: "", selection: "" });
  const timerRef = useRef<number | null>(null);
  const generationRef = useRef(0);
  const [presence, setPresence] = useState<KnowledgeCollaborationPresence[]>([]);
  const [state, setState] = useState<"unavailable" | "connecting" | "connected" | "reconnecting" | "error">("unavailable");
  const [ready, setReady] = useState(false);

  const applyEvent = useCallback((event: KnowledgeCollaborationServerEvent) => {
    clockRef.current = Math.max(clockRef.current, event.clock);
    if (event.type === "presence") setPresence(event.presence || []);
    if (event.snapshot) callbacksRef.current.onSnapshot?.(event.snapshot);
  }, []);

  const syncPresence = useCallback(async () => {
    const session = sessionRef.current;
    if (!session || !transport) return;
    try {
      const result = await transport.sync({
        session_id: session.id,
        after_clock: clockRef.current,
        cursor_block_id: positionRef.current.cursor || undefined,
        selection_block_id: positionRef.current.selection || undefined,
      }, AbortSignal.timeout(10_000));
      sessionRef.current = result.session;
      clockRef.current = Math.max(clockRef.current, result.session.server_clock);
      setPresence(result.session.presence);
      result.events.forEach(event => {
        clockRef.current = Math.max(clockRef.current, event.clock);
        if (event.snapshot) callbacksRef.current.onSnapshot?.(event.snapshot);
      });
    } catch {
      // Awareness is transient. The authenticated SSE loop renews the session
      // and the next selection change carries the current target again.
    }
  }, [transport]);

  useEffect(() => {
    if (!options.active || !transport) {
      setReady(false);
      setPresence([]);
      setState(transport ? "connecting" : "unavailable");
      return;
    }
    const generation = ++generationRef.current;
    const abort = new AbortController();
    let heartbeat = 0;
    setReady(false);
    setPresence([]);
    setState("connecting");
    void transport.connect(crypto.randomUUID(), abort.signal).then(session => {
      if (abort.signal.aborted || generationRef.current !== generation) return;
      sessionRef.current = session;
      clockRef.current = session.server_clock;
      setPresence(session.presence);
      setReady(true);
      setState("connected");
      heartbeat = window.setInterval(() => void syncPresence(), 10_000);
      void syncPresence();
      void (async () => {
        let failures = 0;
        while (!abort.signal.aborted && generationRef.current === generation && sessionRef.current) {
          try {
            await transport.stream(session.id, clockRef.current, failures, event => {
              if (event.type === "revoked") throw new Error(event.code || "knowledge.collaboration_revoked");
              failures = 0;
              setState("connected");
              applyEvent(event);
            }, abort.signal);
            if (abort.signal.aborted) return;
            throw new Error("knowledge.collaboration_stream_closed");
          } catch (failure) {
            if (abort.signal.aborted || generationRef.current !== generation) return;
            failures++;
            setState("reconnecting");
            if (failures >= 5) {
              setReady(false);
              setState("error");
              callbacksRef.current.onError?.(failure);
              return;
            }
            await new Promise(resolve => window.setTimeout(resolve, Math.min(4_000, 500 * 2 ** (failures - 1))));
          }
        }
      })();
    }).catch(failure => {
      if (!abort.signal.aborted && generationRef.current === generation) {
        setReady(false);
        setState("error");
        callbacksRef.current.onError?.(failure);
      }
    });
    return () => {
      abort.abort();
      generationRef.current++;
      if (heartbeat) window.clearInterval(heartbeat);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = null;
      const session = sessionRef.current;
      sessionRef.current = null;
      if (session) void transport.close(session.id, AbortSignal.timeout(10_000)).catch(() => undefined);
    };
  }, [applyEvent, options.active, options.libraryID, options.pageID, syncPresence, transport]);

  const updatePresence = useCallback((cursorTargetID?: string, selectionTargetID?: string) => {
    if (!collaborationPositionChanged(positionRef.current, cursorTargetID, selectionTargetID)) return;
    positionRef.current = { cursor: cursorTargetID || "", selection: selectionTargetID || "" };
    if (!ready) return;
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      void syncPresence();
    }, 150);
  }, [ready, syncPresence]);

  return {
    available: Boolean(transport) && options.active,
    ready,
    state,
    presence,
    onlineUsers: new Set(presence.map(item => item.user_id)).size,
    updatePresence,
  };
}
