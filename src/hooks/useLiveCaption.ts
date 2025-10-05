/**
 * hooks/useLiveCaptions.ts
 * Lectura de captions (transcripción/traducción) por SSE o WebSocket.
 * - SSE: más simple, sólo lectura.
 * - WS: lectura/escritura (si necesitas features extra).
 * 
 * Cómo integrarlo en la UI de la llamada

 1. Botón “Traducir” + selector de idioma de salida:
 * 
 * import { useStartTranscription, useStopTranscription, usePatchTranscription } from "@/services/transcription";
import { useLiveCaptions } from "@/hooks/useLiveCaptions";

const start = useStartTranscription(sessionId);
const stop  = useStopTranscription(sessionId);

async function onToggleTranslate(enabled: boolean, langOut = "es") {
  if (enabled) {
    await start.mutateAsync({ sourceLang: "auto", targetLangs: [langOut] });
  } else {
    await stop.mutateAsync();
  }
}
 * 2 .Suscribirse al stream (según idioma elegido):

const { connected, captions } = useLiveCaptions({
  sessionId,
  lang: selectedLang,   // ej. 'es'
  transport: "sse",     // o "ws"
  autoConnect: true,
});

// pinta captions
return (
  <div className="captions">
    {captions.map(c => (
      <p key={c.id}>
        <span className="opacity-60">[{c.speaker ?? 'SYSTEM'}]</span> {c.text}
      </p>
    ))}
  </div>
);
 * 3. Cambiar idioma sobre la marcha:

import { usePatchTranscription } from "@/services/transcription";
const patch = usePatchTranscription(sessionId);

async function onChangeLang(newLang: string) {
  await patch.mutateAsync({ targetLangs: [newLang] });
  // Al cambiar lang, re-monta useLiveCaptions con el nuevo lang para nuevo stream
}
 * 
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { buildSseUrl, buildWsUrl } from "../services/transcription";
import type { CaptionChunk } from "../types/realtime";

type Transport = "sse" | "ws";

export interface UseLiveCaptionsOptions {
  sessionId: string;
  lang: string;           // idioma de salida deseado (ej: 'es')
  transport?: Transport;  // 'sse' (default) o 'ws'
  autoConnect?: boolean;  // conecta al montar
  maxItems?: number;      // límite en memoria
}

export interface UseLiveCaptionsResult {
  connected: boolean;
  captions: CaptionChunk[];
  connect: () => void;
  disconnect: () => void;
  error?: unknown;
}

export function useLiveCaptions(opts: UseLiveCaptionsOptions): UseLiveCaptionsResult {
  const { sessionId, lang, transport = "sse", autoConnect = true, maxItems = 200 } = opts;
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<unknown>(undefined);
  const [captions, setCaptions] = useState<CaptionChunk[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const esRef = useRef<EventSource | null>(null);

  const url = useMemo(() => {
    return transport === "ws" ? buildWsUrl(sessionId, lang) : buildSseUrl(sessionId, lang);
  }, [sessionId, lang, transport]);

  const push = (chunk: CaptionChunk) => {
    setCaptions((prev) => {
      const next = [...prev, chunk];
      if (next.length > maxItems) next.splice(0, next.length - maxItems);
      return next;
    });
  };

  const connect = () => {
    setError(undefined);
    if (transport === "ws") {
      const ws = new WebSocket(url);
      // @ts-ignore
      wsRef.current = ws;
      ws.onopen = () => setConnected(true);
      ws.onerror = (e) => { setError(e); setConnected(false); };
      ws.onclose = () => setConnected(false);
      ws.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data);
          if (data && (data.text || data.caption || data.transcript)) {
            const chunk: CaptionChunk = {
              id: data.id ?? `${Date.now()}-${Math.random()}`,
              ts: data.ts ?? new Date().toISOString(),
              seq: data.seq ?? 0,
              text: data.text ?? data.caption ?? data.transcript,
              lang: data.lang ?? opts.lang,
              translated: data.translated ?? false,
              fromLang: data.fromLang,
              speaker: data.speaker,
            };
            push(chunk);
          }
        } catch {}
      };
    } else {
      const es = new EventSource(url, { withCredentials: true } as any);
      esRef.current = es;
      es.onopen = () => setConnected(true);
      es.onerror = (e) => { setError(e); setConnected(false); };
      es.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data);
          const chunk: CaptionChunk = {
            id: data.id ?? `${Date.now()}-${Math.random()}`,
            ts: data.ts ?? new Date().toISOString(),
            seq: data.seq ?? 0,
            text: data.text ?? data.caption ?? data.transcript,
            lang: data.lang ?? opts.lang,
            translated: data.translated ?? false,
            fromLang: data.fromLang,
            speaker: data.speaker,
          };
          push(chunk);
        } catch {}
      };
    }
  };

  const disconnect = () => {
    if (wsRef.current && wsRef.current.readyState <= 1) wsRef.current.close();
    if (esRef.current) esRef.current.close();
    setConnected(false);
  };

  useEffect(() => {
    if (!autoConnect) return;
    connect();
    return () => disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { connected, captions, connect, disconnect, error };
}
