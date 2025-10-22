/**
 * hooks/useAvailability.ts
 * Hooks de React Query para gestionar disponibilidad del doctor
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getMyAvailability,
  getDoctorAvailability,
  createAvailabilitySlot,
  createMultipleSlots,
  type AvailabilitySlotApi,
  type CreateAvailabilityPayload,
} from "@/services/availability";

/**
 * Hook para obtener la disponibilidad del doctor logueado
 */
export function useMyAvailability() {
  return useQuery({
    queryKey: ["availability", "me"],
    queryFn: getMyAvailability,
    staleTime: 60 * 1000, // 1 minuto
  });
}

/**
 * Hook para obtener la disponibilidad de un doctor específico (para pacientes)
 */
export function useDoctorAvailability(doctorId?: number | string) {
  return useQuery({
    queryKey: ["availability", "doctor", doctorId],
    queryFn: () => {
      if (!doctorId) throw new Error("ID de doctor requerido");
      return getDoctorAvailability(doctorId);
    },
    enabled: !!doctorId,
    staleTime: 60 * 1000, // 1 minuto
  });
}

/**
 * Hook para crear un slot de disponibilidad
 */
export function useCreateAvailabilitySlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAvailabilitySlot,
    onSuccess: (newSlot) => {
      // Invalidar la query para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ["availability", "me"] });
      toast.success("Horario creado exitosamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear horario");
    },
  });
}

/**
 * Hook para crear múltiples slots
 */
export function useCreateMultipleSlots() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMultipleSlots,
    onSuccess: (slots) => {
      queryClient.invalidateQueries({ queryKey: ["availability", "me"] });
      toast.success(`${slots.length} horarios creados exitosamente`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear horarios");
    },
  });
}
