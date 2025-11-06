// src/services/conversations.ts
import { api } from "../lib/api";

export type ConversationApi = {
  Id: number | string;
  Title?: string | null;
  WithUserName?: string | null;  // si tu backend lo incluye
  Preview?: string | null;       // último mensaje (si existe)
  UpdatedAt?: string;
};

export async function getMyConversations(): Promise<ConversationApi[]> {
  const { data } = await api.get<ConversationApi[]>("/conversations/mine");
  return Array.isArray(data) ? data : [];
}

/**
 * Obtiene o crea una conversación única con un doctor específico.
 * El backend debe manejar la lógica de retornar una conversación existente
 * o crear una nueva si no existe.
 */
export async function getOrCreateConversationWithDoctor(doctorId: string | number): Promise<ConversationApi> {
  const { data } = await api.post<ConversationApi>(`/conversations/with-doctor/${doctorId}`);
  return data;
}
