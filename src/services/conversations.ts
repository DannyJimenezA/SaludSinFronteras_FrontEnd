/**
 * services/conversations.ts
 * Conversaciones (lista/creación) — rutas FAKE por ahora.
 *
 * Endpoints esperados:
 *   GET  /conversations?userId=me&page=&perPage=
 *   POST /conversations                       → { participantIds: string[], appointmentId? }
 *   GET  /conversations/:id                   → detalle opcional
 *
 * Notas:
 * - Este service acepta respuesta { data: [...] } o array plano [].
 */

import { api } from "../lib/api";
import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";
import type { ApiList, ApiSuccess } from "../types/common";
import type { Conversation } from "../types/messaging";

const R = {
  LIST: "/conversations",                         // ⚠️ FAKE
  CREATE: "/conversations",                       // ⚠️ FAKE
  DETAIL: (id: string) => `/conversations/${id}`, // ⚠️ FAKE
} as const;

export interface ConversationsFilters {
  userId?: string;   // "me" por defecto en el backend
  page?: number;
  perPage?: number;
}

export interface CreateConversationPayload {
  participantIds: string[];  // incluye al remitente si tu BE lo exige
  appointmentId?: string;
}

export async function listConversations(filters: ConversationsFilters = {}): Promise<Conversation[]> {
  const { data } = await api.get(R.LIST, { params: filters });
  return Array.isArray(data) ? data : (data?.data ?? []);
}

export async function createConversation(payload: CreateConversationPayload): Promise<Conversation> {
  const { data } = await api.post(R.CREATE, payload);
  return data?.data ?? data;
}

export async function getConversation(id: string): Promise<Conversation> {
  const { data } = await api.get(R.DETAIL(id));
  return data?.data ?? data;
}

/** React Query hooks (v5) */
export function useConversations(filters: ConversationsFilters = {}) {
  return useQuery({
    queryKey: ["conversations", filters],
    queryFn: async (): Promise<Conversation[]> => {
      const { data } = await api.get(R.LIST, { params: filters });
      return Array.isArray(data) ? data : (data?.data ?? []);
    },
    placeholderData: keepPreviousData,
  });
}

export function useCreateConversation() {
  return useMutation({
    mutationKey: ["conversations", "create"],
    mutationFn: async (payload: CreateConversationPayload) => {
      const { data } = await api.post<ApiSuccess<Conversation>>(R.CREATE, payload);
      return data.data ?? (data as any);
    },
  });
}

export function useConversation(id?: string) {
  return useQuery({
    queryKey: ["conversations", "detail", id],
    queryFn: async (): Promise<Conversation> => {
      if (!id) throw new Error("id requerido");
      const { data } = await api.get(R.DETAIL(id));
      
      return data?.data ?? data;
    },
    enabled: Boolean(id),
  });
}
