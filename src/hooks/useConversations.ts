/**
 * hooks/useConversations.ts
 * Hooks de React Query para gestionar conversaciones y mensajes
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createConversationFromAppointment,
  getConversationMessages,
  sendMessage,
  getOrCreateConversation,
  type ConversationApi,
  type MessageApi,
  type SendMessagePayload,
} from "@/services/conversations";

/**
 * Hook para obtener o crear conversación desde una cita
 */
export function useConversationFromAppointment(appointmentId?: number | string) {
  return useQuery({
    queryKey: ["conversations", "appointment", appointmentId],
    queryFn: () => {
      if (!appointmentId) throw new Error("ID de cita requerido");
      return getOrCreateConversation(appointmentId);
    },
    enabled: !!appointmentId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para obtener mensajes de una conversación
 * Con polling automático cada 3 segundos
 */
export function useConversationMessages(conversationId?: number | string, enablePolling = true) {
  return useQuery({
    queryKey: ["conversations", conversationId, "messages"],
    queryFn: () => {
      if (!conversationId) throw new Error("ID de conversación requerido");
      return getConversationMessages(conversationId);
    },
    enabled: !!conversationId,
    refetchInterval: enablePolling ? 3000 : false, // Polling cada 3 segundos
    staleTime: 1000, // Considerar datos obsoletos después de 1 segundo
  });
}

/**
 * Hook para enviar un mensaje
 */
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, payload }: { conversationId: number | string; payload: SendMessagePayload }) =>
      sendMessage(conversationId, payload),
    onSuccess: (_, variables) => {
      // Invalidar mensajes para refrescar inmediatamente
      queryClient.invalidateQueries({
        queryKey: ["conversations", variables.conversationId, "messages"]
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al enviar mensaje");
    },
  });
}

/**
 * Hook combinado para chat completo
 * Retorna conversación, mensajes y función para enviar
 */
export function useChat(appointmentId?: number | string) {
  const { data: conversation, isLoading: isLoadingConversation } = useConversationFromAppointment(appointmentId);

  const { data: messages = [], isLoading: isLoadingMessages, refetch: refetchMessages } = useConversationMessages(
    conversation?.Id,
    true // Habilitar polling
  );

  const sendMessageMutation = useSendMessage();

  const sendChatMessage = async (text: string, language?: string) => {
    if (!conversation?.Id) {
      toast.error("No hay conversación activa");
      return;
    }

    await sendMessageMutation.mutateAsync({
      conversationId: conversation.Id,
      payload: { Text: text, Language: language },
    });
  };

  return {
    conversation,
    messages,
    isLoading: isLoadingConversation || isLoadingMessages,
    sendMessage: sendChatMessage,
    isSending: sendMessageMutation.isPending,
    refetchMessages,
  };
}
