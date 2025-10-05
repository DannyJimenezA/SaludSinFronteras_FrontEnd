/**
 * services/appointments.ts
 * Citas (Appointments) + Notas — rutas FAKE por ahora.
 * Tablas: Appointments, AppointmentNotes
 *
 * Endpoints mínimos esperados:
 *   GET   /appointments?doctorId=&patientId=&status=&from=&to=
 *   POST  /appointments                                 → crea cita (valida colisión/slot)
 *   GET   /appointments/:id
 *   PATCH /appointments/:id/status                      → { status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'RESCHEDULED' }
 *   POST  /appointments/:id/notes                       → crea nota del doctor
 *
 * Notas:
 * - 'from' y 'to' en filtros: ISO8601 UTC.
 * - Este service acepta respuesta tanto { data: [...] } como array plano.
 */
import { api } from "../lib/api";
import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";
import type { ApiList, ApiSuccess } from "../types/common";
import type { Appointment, AppointmentNote } from "../types/appointments";

// ⚠️ RUTAS FAKE — cámbialas cuando tengas backend real
const R = {
  LIST: "/appointments",
  CREATE: "/appointments",
  DETAIL: (id: string) => `/appointments/${id}`,
  STATUS: (id: string) => `/appointments/${id}/status`,
  NOTES: (id: string) => `/appointments/${id}/notes`,
} as const;

export interface AppointmentFilters {
  doctorId?: string;
  patientId?: string;
  status?: string;
  from?: string; // ISODate
  to?: string;   // ISODate
  page?: number;
  perPage?: number;
}

/** Payload de creación (ajústalo si tu backend exige otros campos) */
export interface CreateAppointmentPayload {
  patientUserId: string;
  doctorUserId: string;
  scheduledAt: string; // ISODate (inicio)
  durationMin: number;
  modality?: string;   // 'VIDEO' | 'IN_PERSON' | 'PHONE'
  reason?: string;
  notes?: string;
  // opcionalmente: slotId si tu backend lo pide para evitar colisiones
  slotId?: string;
}

/** ————————————————————————————————————————————————
 *  Versión promesa (sin hooks)
 *  ———————————————————————————————————————————————— */
export async function listAppointments(filters: AppointmentFilters = {}): Promise<Appointment[]> {
  const { data } = await api.get(R.LIST, { params: filters });
  return Array.isArray(data) ? data : (data?.data ?? []);
}

export async function getAppointment(id: string): Promise<Appointment> {
  const { data } = await api.get(R.DETAIL(id));
  return data?.data ?? data;
}

export async function createAppointment(payload: CreateAppointmentPayload): Promise<Appointment> {
  const { data } = await api.post(R.CREATE, payload);
  return data?.data ?? data;
}

export async function updateAppointmentStatus(id: string, status: string): Promise<Appointment> {
  const { data } = await api.patch(R.STATUS(id), { status });
  return data?.data ?? data;
}

export async function addAppointmentNote(id: string, content: string): Promise<AppointmentNote> {
  const { data } = await api.post(R.NOTES(id), { content });
  return data?.data ?? data;
}

/** ————————————————————————————————————————————————
 *  Hooks React Query (v5)
 *  ———————————————————————————————————————————————— */
export function useAppointments(filters: AppointmentFilters) {
  return useQuery({
    queryKey: ["appointments", filters],
    queryFn: async (): Promise<Appointment[]> => {
      const { data } = await api.get(R.LIST, { params: filters });
      
      return Array.isArray(data) ? data : (data?.data ?? []);
    },
    placeholderData: keepPreviousData,
  });
}

export function useAppointment(id?: string) {
  return useQuery({
    queryKey: ["appointments", "detail", id],
    queryFn: async (): Promise<Appointment> => {
      if (!id) throw new Error("id requerido");
      const { data } = await api.get(R.DETAIL(id));
      
      return data?.data ?? data;
    },
    enabled: Boolean(id),
  });
}

export function useCreateAppointment() {
  return useMutation({
    mutationKey: ["appointments", "create"],
    mutationFn: async (payload: CreateAppointmentPayload) => {
      const { data } = await api.post<ApiSuccess<Appointment>>(R.CREATE, payload);
      return data.data ?? (data as any);
    },
  });
}

export function useUpdateAppointmentStatus(id: string) {
  return useMutation({
    mutationKey: ["appointments", "status", id],
    mutationFn: async (payload: { status: string }) => {
      const { data } = await api.patch<ApiSuccess<Appointment>>(R.STATUS(id), payload);
      return data.data ?? (data as any);
    },
  });
}

export function useAddAppointmentNote(id: string) {
  return useMutation({
    mutationKey: ["appointments", "notes", id],
    mutationFn: async (payload: { content: string }) => {
      const { data } = await api.post<ApiSuccess<AppointmentNote>>(R.NOTES(id), payload);
      return data.data ?? (data as any);
    },
  });
}
