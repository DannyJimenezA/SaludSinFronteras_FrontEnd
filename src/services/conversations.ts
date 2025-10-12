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
