/**
 * services/messages.ts
 * Mensajes de una conversación (lista/envío) — rutas FAKE por ahora.
 *
 * Endpoints esperados:
 *   GET  /conversations/:id/messages?before=&after=&page=&perPage=
 *   POST /conversations/:id/messages            → { text, language? }
 *   (Opcional) POST /messages/:id/translate     → { to: 'en' } → crea/retorna traducción
 *
 * Notas:
 * - Maneja respuesta { data: [...] } o [].
 * - Para realtime (WS), este service sigue útil para bootstrap/historial.
 */

import { api } from "../lib/api";
import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";
import type { ApiList, ApiSuccess } from "../types/common";
import type { Message, MessageTranslation } from "../types/messaging";

const R = {
  LIST: (conversationId: string) => `/conversations/${conversationId}/messages`, // ⚠️ FAKE
  SEND: (conversationId: string) => `/conversations/${conversationId}/messages`, // ⚠️ FAKE
  TRANSLATE: (messageId: string) => `/messages/${messageId}/translate`,         // ⚠️ FAKE opcional
} as const;

export interface MessagesFilters {
  page?: number;
  perPage?: number;
  before?: string; // ISODate para paginado hacia atrás
  after?: string;  // ISODate para paginado hacia adelante
}

export interface SendMessagePayload {
  text: string;
  language?: string; // nvarchar(20)
  // para adjuntos: fileId?, imageUrl?, etc., según tu diseño
}

export async function listMessages(conversationId: string, filters: MessagesFilters = {}): Promise<Message[]> {
  const { data } = await api.get(R.LIST(conversationId), { params: filters });
  return Array.isArray(data) ? data : (data?.data ?? []);
}

export async function sendMessage(conversationId: string, payload: SendMessagePayload): Promise<Message> {
  const { data } = await api.post(R.SEND(conversationId), payload);
  return data?.data ?? data;
}

export async function translateMessage(messageId: string, to: string): Promise<MessageTranslation> {
  const { data } = await api.post(R.TRANSLATE(messageId), { to });
  return data?.data ?? data;
}

/** Hooks React Query (v5) */
export function useMessages(conversationId?: string, filters: MessagesFilters = {}) {
  return useQuery({
    queryKey: ["conversations", conversationId, "messages", filters],
    queryFn: async (): Promise<Message[]> => {
      if (!conversationId) return [];
      const { data } = await api.get(R.LIST(conversationId), { params: filters });
      
      return Array.isArray(data) ? data : (data?.data ?? []);
    },
    enabled: Boolean(conversationId),
    placeholderData: keepPreviousData,
  });
}

export function useSendMessage(conversationId: string) {
  return useMutation({
    mutationKey: ["conversations", conversationId, "sendMessage"],
    mutationFn: async (payload: SendMessagePayload) => {
      const { data } = await api.post<ApiSuccess<Message>>(R.SEND(conversationId), payload);
      return data.data ?? (data as any);
    },
  });
}

export function useTranslateMessage(messageId?: string) {
  return useMutation({
    mutationKey: ["messages", "translate", messageId],
    mutationFn: async ({ to }: { to: string }) => {
      if (!messageId) throw new Error("messageId requerido");
      const { data } = await api.post<ApiSuccess<MessageTranslation>>(R.TRANSLATE(messageId), { to });
      return data.data ?? (data as any);
    },
  });
}
