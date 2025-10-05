/*
 * services/availability.ts
 * Disponibilidad (Slots) del Doctor — rutas FAKE por ahora.
 * Tablas: AvailabilitySlots
 *
 * Endpoints mínimos esperados:
 *   GET  /doctors/:userId/availability?from=&to=     → AvailabilitySlot[] (UTC ISO)
 *   POST /doctors/:userId/availability               → crea uno o varios slots
 *   PUT  /doctors/:userId/availability/:slotId       → edita un slot
 *   DELETE /doctors/:userId/availability/:slotId     → borra un slot
 *
 * Notas:
 * - 'from' y 'to' deben ser cadenas ISO8601 en UTC (ej: 2025-09-27T00:00:00Z).
 * - Si tu backend devuelve { data: [...] }, lo manejamos; si devuelve [] plano, también.
 */
import { api } from "../lib/api";
import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";
import type { ApiList, ApiSuccess } from "../types/common";
import type { AvailabilitySlot } from "../types/appointments";

// ⚠️ RUTAS FAKE — cámbialas cuando tengas backend real
const R = {
  RANGE: (doctorUserId: string) => `/doctors/${doctorUserId}/availability`,
  CREATE: (doctorUserId: string) => `/doctors/${doctorUserId}/availability`,
  UPDATE: (doctorUserId: string, slotId: string) => `/doctors/${doctorUserId}/availability/${slotId}`,
  DELETE: (doctorUserId: string, slotId: string) => `/doctors/${doctorUserId}/availability/${slotId}`,
} as const;

export interface AvailabilityParams {
  from: string; // ISO UTC
  to: string;   // ISO UTC
  tz?: string;  // IANA tz opcional para el server (ej: 'America/Mexico_City')
}

/** ————————————————————————————————————————————————
 *  Versión promesa (sin hooks) — listar por rango
 *  ———————————————————————————————————————————————— */
export async function listAvailability(doctorUserId: string, params: AvailabilityParams): Promise<AvailabilitySlot[]> {
  if (!doctorUserId) throw new Error("doctorUserId requerido");
  if (!params?.from || !params?.to) throw new Error("from y to son requeridos (ISO UTC)");
  const { data } = await api.get(R.RANGE(doctorUserId), { params });
  // compatibilidad
  return Array.isArray(data) ? data : (data?.data ?? []);
}

/** Hook React Query — listar por rango */
export function useAvailability(doctorUserId?: string, params?: AvailabilityParams) {
  return useQuery({
    queryKey: ["availability", doctorUserId, params],
    queryFn: async (): Promise<AvailabilitySlot[]> => {
      if (!doctorUserId || !params?.from || !params?.to) return [];
      const { data } = await api.get(R.RANGE(doctorUserId), { params });
      return Array.isArray(data) ? data : (data?.data ?? []);
    },
    enabled: Boolean(doctorUserId && params?.from && params?.to),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
}

/** ————————————————————————————————————————————————
 *  Mutations para el panel del doctor (opcionales)
 *  ———————————————————————————————————————————————— */
export interface CreateAvailabilityPayload {
  // Puedes crear uno o varios slots
  slots: Array<Pick<AvailabilitySlot, "startAt" | "endAt"> & { isRecurring?: boolean; rrule?: string }>;
}

export function useCreateAvailability(doctorUserId: string) {
  return useMutation({
    mutationKey: ["availability", "create", doctorUserId],
    mutationFn: async (payload: CreateAvailabilityPayload) => {
      const { data } = await api.post<ApiSuccess<AvailabilitySlot[]>>(R.CREATE(doctorUserId), payload);
      return data.data;
    },
  });
}

export function useUpdateAvailability(doctorUserId: string, slotId: string) {
  return useMutation({
    mutationKey: ["availability", "update", doctorUserId, slotId],
    mutationFn: async (payload: Partial<AvailabilitySlot>) => {
      const { data } = await api.put<ApiSuccess<AvailabilitySlot>>(R.UPDATE(doctorUserId, slotId), payload);
      return data.data;
    },
  });
}

export function useDeleteAvailability(doctorUserId: string, slotId: string) {
  return useMutation({
    mutationKey: ["availability", "delete", doctorUserId, slotId],
    mutationFn: async () => {
      await api.delete(R.DELETE(doctorUserId, slotId));
    },
  });
}
