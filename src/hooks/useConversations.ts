import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface Conversation {
  id: string;
  appointmentId?: string;
  createdBy?: string;
  createdAt: string;
  participants?: Array<{
    userId: string;
    name: string;
    email: string;
  }>;
  lastMessage?: {
    content: string;
    createdAt: string;
    senderName: string;
  };
}

export interface Message {
  id: string;
  conversationId: string;
  senderUserId: string;
  senderName: string;
  type: string;
  content: string;
  language?: string;
  createdAt: string;
  fileId?: string;
  replyToMessageId?: string;
  translation?: string | null;
  translationLanguage?: string | null;
}

export function useMyConversations() {
  return useQuery({
    queryKey: ["conversations", "mine"],
    queryFn: async () => {
      const response = await api.get("/conversations/mine");
      return response.data as Conversation[];
    },
    refetchInterval: 5000, // Refrescar cada 5 segundos para simular tiempo real
  });
}

export function useConversationMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ["conversations", conversationId, "messages"],
    queryFn: async () => {
      if (!conversationId) return [];
      const response = await api.get(`/conversations/${conversationId}/messages`);
      return response.data as Message[];
    },
    enabled: !!conversationId,
    refetchInterval: 3000, // Refrescar cada 3 segundos para mensajes en tiempo real
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      conversationId: string;
      content: string;
      language?: string;
    }) => {
      // Preparar el body - solo incluir Language si se proporciona explícitamente
      const body: { Content: string; Language?: string } = {
        Content: data.content,
      };

      // Solo incluir Language si se proporciona, sino el backend usará el idioma nativo del usuario
      if (data.language) {
        body.Language = data.language;
      }

      const response = await api.post(
        `/conversations/${data.conversationId}/messages`,
        body
      );
      return response.data;
    },
    onSuccess: async (_, variables) => {
      // Refetch inmediato de mensajes de la conversación específica
      await queryClient.refetchQueries({
        queryKey: ["conversations", variables.conversationId, "messages"],
      });
      // Invalidar lista de conversaciones para actualizar último mensaje
      queryClient.invalidateQueries({ queryKey: ["conversations", "mine"] });
    },
  });
}

export function useCreateConversationFromAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const response = await api.post(
        `/conversations/from-appointment/${appointmentId}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations", "mine"] });
    },
  });
}

/**
 * Hook para obtener o crear una conversación única con un doctor específico.
 * El backend debe verificar si ya existe una conversación entre el paciente y el doctor,
 * y retornar la existente o crear una nueva.
 */
export function useGetOrCreateConversationWithDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (doctorId: string | number) => {
      const response = await api.post(
        `/conversations/with-doctor/${doctorId}`
      );
      return response.data as Conversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations", "mine"] });
    },
  });
}

/**
 * Hook para obtener o crear una conversación única con un paciente específico.
 * Similar al anterior pero para el doctor.
 * El backend debe verificar si ya existe una conversación entre el doctor y el paciente,
 * y retornar la existente o crear una nueva.
 */
export function useGetOrCreateConversationWithPatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (patientId: string | number) => {
      const response = await api.post(
        `/conversations/with-patient/${patientId}`
      );
      return response.data as Conversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations", "mine"] });
    },
  });
}
