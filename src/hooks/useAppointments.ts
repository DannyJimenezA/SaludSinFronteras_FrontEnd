/**
 * hooks/useAppointments.ts
 * Hooks de React Query para gestionar citas médicas
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  listAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointmentStatus,
  confirmAppointment,
  cancelAppointment,
  completeAppointment,
  createAppointmentNote,
  getVideoToken,
  type AppointmentApi,
  type AppointmentStatus,
  type CreateAppointmentPayload,
  type UpdateAppointmentStatusPayload,
  type CreateAppointmentNotePayload,
} from "@/services/appointments";

/**
 * Hook para listar citas con filtros
 */
export function useAppointments(params?: {
  patientId?: number | string;
  doctorId?: number | string;
  status?: AppointmentStatus;
}) {
  return useQuery({
    queryKey: ["appointments", params],
    queryFn: () => listAppointments(params),
    staleTime: 30 * 1000, // 30 segundos
  });
}

/**
 * Hook para obtener una cita específica
 */
export function useAppointment(id?: number | string) {
  return useQuery({
    queryKey: ["appointments", id],
    queryFn: () => {
      if (!id) throw new Error("ID requerido");
      return getAppointmentById(id);
    },
    enabled: !!id,
  });
}

/**
 * Hook para crear una cita
 */
export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Cita creada exitosamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear cita");
    },
  });
}

/**
 * Hook para actualizar el estado de una cita
 */
export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: UpdateAppointmentStatusPayload }) =>
      updateAppointmentStatus(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointments", variables.id] });
      toast.success("Estado actualizado");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar estado");
    },
  });
}

/**
 * Hook para confirmar una cita
 */
export function useConfirmAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmAppointment,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointments", id] });
      toast.success("Cita confirmada");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al confirmar cita");
    },
  });
}

/**
 * Hook para cancelar una cita
 */
export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelAppointment,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointments", id] });
      toast.success("Cita cancelada");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al cancelar cita");
    },
  });
}

/**
 * Hook para completar una cita
 */
export function useCompleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeAppointment,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointments", id] });
      toast.success("Cita completada");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al completar cita");
    },
  });
}

/**
 * Hook para crear una nota médica
 */
export function useCreateAppointmentNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appointmentId, payload }: { appointmentId: number | string; payload: CreateAppointmentNotePayload }) =>
      createAppointmentNote(appointmentId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["appointments", variables.appointmentId] });
      toast.success("Nota médica guardada");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al guardar nota");
    },
  });
}

/**
 * Hook para obtener token de videollamada
 */
export function useVideoToken(appointmentId?: number | string) {
  return useQuery({
    queryKey: ["appointments", appointmentId, "video"],
    queryFn: () => {
      if (!appointmentId) throw new Error("ID de cita requerido");
      return getVideoToken(appointmentId);
    },
    enabled: !!appointmentId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: false,
  });
}
