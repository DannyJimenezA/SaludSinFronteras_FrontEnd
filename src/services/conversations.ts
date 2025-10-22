/**
 * services/conversations.ts
 * Gestión de conversaciones y mensajes
 *
 * Endpoints:
 *   POST  /conversations/from-appointment/:id     → Crear conversación desde cita
 *   GET   /conversations/:id/messages             → Obtener mensajes
 *   POST  /conversations/:id/messages             → Enviar mensaje
 */

import { api } from "../lib/api";

// ========== TIPOS ==========

/** Conversación desde la API */
export interface ConversationApi {
  Id: number | string;
  AppointmentId: number | string;
  PatientUserId: number | string;
  DoctorUserId: number | string;
  CreatedAt: string;
  UpdatedAt: string;
}

/** Mensaje desde la API */
export interface MessageApi {
  Id: number | string;
  ConversationId: number | string;
  SenderUserId: number | string;
  Text: string;
  Language?: string | null;
  TranslatedText?: string | null;
  TargetLanguage?: string | null;
  CreatedAt: string;
  // Info del remitente (si el backend la incluye)
  Sender?: {
    FullName?: string;
    Role?: string;
  };
}

/** Payload para enviar mensaje */
export interface SendMessagePayload {
  Text: string;
  Language?: string;
}

// ========== FUNCIONES API ==========

/**
 * Crear conversación desde una cita
 * POST /conversations/from-appointment/:appointmentId
 */
export async function createConversationFromAppointment(
  appointmentId: number | string
): Promise<ConversationApi> {
  try {
    const { data } = await api.post<ConversationApi>(
      `/conversations/from-appointment/${appointmentId}`
    );
    return data;
  } catch (err: any) {
    console.error("[CONVERSATIONS] Error creando conversación:", err);
    throw new Error(
      err?.response?.data?.message || "Error al crear conversación"
    );
  }
}

/**
 * Obtener mensajes de una conversación
 * GET /conversations/:id/messages
 */
export async function getConversationMessages(
  conversationId: number | string
): Promise<MessageApi[]> {
  try {
    const { data } = await api.get<MessageApi[]>(
      `/conversations/${conversationId}/messages`
    );
    return Array.isArray(data) ? data : [];
  } catch (err: any) {
    console.error("[CONVERSATIONS] Error obteniendo mensajes:", err);
    throw new Error(
      err?.response?.data?.message || "Error al obtener mensajes"
    );
  }
}

/**
 * Enviar mensaje en una conversación
 * POST /conversations/:id/messages
 */
export async function sendMessage(
  conversationId: number | string,
  payload: SendMessagePayload
): Promise<MessageApi> {
  try {
    const { data } = await api.post<MessageApi>(
      `/conversations/${conversationId}/messages`,
      payload
    );
    return data;
  } catch (err: any) {
    console.error("[CONVERSATIONS] Error enviando mensaje:", err);
    throw new Error(
      err?.response?.data?.message || "Error al enviar mensaje"
    );
  }
}

/**
 * Obtener o crear conversación desde una cita
 * Helper que combina verificación y creación
 */
export async function getOrCreateConversation(
  appointmentId: number | string
): Promise<ConversationApi> {
  try {
    // Intentar crear la conversación
    // Si ya existe, el backend debería devolverla
    return await createConversationFromAppointment(appointmentId);
  } catch (err: any) {
    console.error("[CONVERSATIONS] Error obteniendo/creando conversación:", err);
    throw err;
  }
}
