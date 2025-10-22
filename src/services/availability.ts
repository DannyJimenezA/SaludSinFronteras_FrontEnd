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
/*
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
 *  ———————————————————————————————————————————————— 
export async function listAvailability(doctorUserId: string, params: AvailabilityParams): Promise<AvailabilitySlot[]> {
  if (!doctorUserId) throw new Error("doctorUserId requerido");
  if (!params?.from || !params?.to) throw new Error("from y to son requeridos (ISO UTC)");
  const { data } = await api.get(R.RANGE(doctorUserId), { params });
  // compatibilidad
  return Array.isArray(data) ? data : (data?.data ?? []);
}

/** Hook React Query — listar por rango 
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
 *  ———————————————————————————————————————————————— 
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
*/
/**
 * services/availability.ts
 * Gestión de disponibilidad (slots) del doctor
 *
 * Endpoints:
 *   GET  /doctors/me/availability        → Obtener slots del doctor logueado
 *   POST /doctors/me/availability        → Crear nuevos slots
 */

import { api } from "../lib/api";

// ========== TIPOS ==========

/** Slot de disponibilidad desde la API */
export interface AvailabilitySlotApi {
  Id: number | string;
  DoctorUserId: number | string;
  Date: string;           // "2025-10-22"
  StartTime: string;      // "09:00:00"
  EndTime: string;        // "10:00:00"
  IsBooked: boolean;
  AppointmentId?: number | string | null;
  CreatedAt: string;
  UpdatedAt: string;
}

/** Formato para crear slots */
export interface CreateAvailabilityPayload {
  Date: string;           // "2025-10-22"
  StartTime: string;      // "09:00:00"
  EndTime: string;        // "10:00:00"
}

/** Payload para crear múltiples slots */
export interface BulkCreateAvailabilityPayload {
  slots: CreateAvailabilityPayload[];
}

// ========== FUNCIONES API ==========

/**
 * Obtener disponibilidad del doctor logueado
 * GET /doctors/me/availability
 */
export async function getMyAvailability(): Promise<AvailabilitySlotApi[]> {
  try {
    const { data } = await api.get<AvailabilitySlotApi[]>("/doctors/me/availability");
    return Array.isArray(data) ? data : [];
  } catch (err: any) {
    console.error("[AVAILABILITY] Error obteniendo disponibilidad:", err);
    throw new Error(
      err?.response?.data?.message || "Error al obtener disponibilidad"
    );
  }
}

/**
 * Obtener disponibilidad de un doctor específico (para pacientes)
 * GET /doctors/:doctorId/availability
 * NOTA: Este endpoint debe existir en tu backend para que los pacientes vean disponibilidad
 */
export async function getDoctorAvailability(
  doctorId: number | string
): Promise<AvailabilitySlotApi[]> {
  try {
    const { data } = await api.get<AvailabilitySlotApi[]>(
      `/doctors/${doctorId}/availability`
    );
    return Array.isArray(data) ? data : [];
  } catch (err: any) {
    console.error("[AVAILABILITY] Error obteniendo disponibilidad del doctor:", err);
    throw new Error(
      err?.response?.data?.message || "Error al obtener disponibilidad del doctor"
    );
  }
}

/**
 * Crear un nuevo slot de disponibilidad
 * POST /doctors/me/availability
 */
export async function createAvailabilitySlot(
  payload: CreateAvailabilityPayload
): Promise<AvailabilitySlotApi> {
  try {
    const { data } = await api.post<AvailabilitySlotApi>(
      "/doctors/me/availability",
      payload
    );
    return data;
  } catch (err: any) {
    console.error("[AVAILABILITY] Error creando slot:", err);
    throw new Error(
      err?.response?.data?.message || "Error al crear slot de disponibilidad"
    );
  }
}

/**
 * Crear múltiples slots de disponibilidad
 * POST /doctors/me/availability (array)
 */
export async function createMultipleSlots(
  slots: CreateAvailabilityPayload[]
): Promise<AvailabilitySlotApi[]> {
  try {
    const { data } = await api.post<AvailabilitySlotApi[]>(
      "/doctors/me/availability",
      slots
    );
    return Array.isArray(data) ? data : [data];
  } catch (err: any) {
    console.error("[AVAILABILITY] Error creando slots:", err);
    throw new Error(
      err?.response?.data?.message || "Error al crear slots de disponibilidad"
    );
  }
}

// ========== HELPERS ==========

/**
 * Filtrar slots por fecha específica
 */
export function filterSlotsByDate(
  slots: AvailabilitySlotApi[],
  date: string
): AvailabilitySlotApi[] {
  return slots.filter((slot) => slot.Date === date);
}

/**
 * Filtrar slots disponibles (no reservados)
 */
export function getAvailableSlots(
  slots: AvailabilitySlotApi[]
): AvailabilitySlotApi[] {
  return slots.filter((slot) => !slot.IsBooked);
}

/**
 * Agrupar slots por fecha
 */
export function groupSlotsByDate(
  slots: AvailabilitySlotApi[]
): Record<string, AvailabilitySlotApi[]> {
  return slots.reduce((acc, slot) => {
    if (!acc[slot.Date]) {
      acc[slot.Date] = [];
    }
    acc[slot.Date].push(slot);
    return acc;
  }, {} as Record<string, AvailabilitySlotApi[]>);
}
