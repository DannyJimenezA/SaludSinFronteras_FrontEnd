/**
 * services/transcription.ts
 * Control de transcripción/traducción en tiempo real durante una sesión RTC.
 * Rutas FAKE — reemplaza por tus endpoints reales.
 *
 * Endpoints sugeridos:
 *   POST   /video/sessions/:id/transcription/start   { sourceLang?, targetLangs? }
 *   POST   /video/sessions/:id/transcription/stop
 *   PATCH  /video/sessions/:id/transcription         { targetLangs?, sourceLang?, enabled? }
 *   GET(SSE)/video/sessions/:id/captions/stream?lang=es
 *   WS    wss://.../video/sessions/:id/captions?lang=es   (alternativa WebSocket)
 */

import { api } from "../lib/api";
import { useMutation } from "@tanstack/react-query";
import type { ApiSuccess } from "../types";
import type { TranslationPrefs } from "../types/realtime";

const R = {
  START: (id: string) => `/video/sessions/${id}/transcription/start`,
  STOP:  (id: string) => `/video/sessions/${id}/transcription/stop`,
  PATCH: (id: string) => `/video/sessions/${id}/transcription`,
  SSE:   (id: string) => `/video/sessions/${id}/captions/stream`, // GET ?lang=
  WS:    (id: string) => `/video/sessions/${id}/captions`,        // ws ?lang=
} as const;

export interface StartTranscriptionPayload {
  sourceLang?: string;
  targetLangs?: string[];
}
export interface PatchTranscriptionPayload extends StartTranscriptionPayload {
  enabled?: boolean;
}

export async function startTranscription(sessionId: string, payload: StartTranscriptionPayload) {
  const { data } = await api.post(R.START(sessionId), payload);
  return data?.data ?? data;
}

export async function stopTranscription(sessionId: string) {
  const { data } = await api.post(R.STOP(sessionId));
  return data?.data ?? data;
}

export async function patchTranscription(sessionId: string, payload: PatchTranscriptionPayload) {
  const { data } = await api.patch(R.PATCH(sessionId), payload);
  
  return data?.data ?? data;
}

/** Hooks (mutations) */
export function useStartTranscription(sessionId: string) {
  return useMutation({
    mutationKey: ["rtc", "transcription", "start", sessionId],
    mutationFn: (payload: StartTranscriptionPayload) => startTranscription(sessionId, payload),
  });
}
export function useStopTranscription(sessionId: string) {
  return useMutation({
    mutationKey: ["rtc", "transcription", "stop", sessionId],
    mutationFn: () => stopTranscription(sessionId),
  });
}
export function usePatchTranscription(sessionId: string) {
  return useMutation({
    mutationKey: ["rtc", "transcription", "patch", sessionId],
    mutationFn: (payload: PatchTranscriptionPayload) => patchTranscription(sessionId, payload),
  });
}

// Utilidades para construir URLs de streaming (SSE/WS). El api base sale de axios.
export function buildSseUrl(sessionId: string, lang: string) {
  // ejemplo: https://api/base + /video/sessions/:id/captions/stream?lang=es
  const base = (api.defaults.baseURL ?? "").replace(/\/$/, "");
  return `${base}${R.SSE(sessionId)}?lang=${encodeURIComponent(lang)}`;
}

export function buildWsUrl(sessionId: string, lang: string) {
  // Cambia http/https por ws/wss automáticamente
  const base = (api.defaults.baseURL ?? "").replace(/\/$/, "");
  const url = `${base}${R.WS(sessionId)}?lang=${encodeURIComponent(lang)}`;
  return url.replace(/^http/, "ws");
}
