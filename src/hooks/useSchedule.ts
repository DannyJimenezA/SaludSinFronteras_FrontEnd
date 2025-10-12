// src/hooks/useSchedule.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDoctorAvailability,
  createAppointment,
  type CreateAppointmentPayload,
  type AvailabilitySlot,
} from "../services/schedule";

/** Disponibilidad del doctor (por día opcional) */
export function useDoctorAvailability(
  doctorId?: number | string,
  dateISO?: string
) {
  return useQuery<AvailabilitySlot[]>({
    queryKey: ["doctorAvailability", doctorId, dateISO],
    queryFn: () => getDoctorAvailability(doctorId!, dateISO),
    enabled: !!doctorId,         // solo dispara cuando hay doctorId
    staleTime: 60_000,           // 1 minuto cache
  });
}

/** Crear cita */
export function useCreateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAppointmentPayload) => createAppointment(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["doctorAvailability"] });
      qc.invalidateQueries({ queryKey: ["myAppointments"] });
    },
  });
}
