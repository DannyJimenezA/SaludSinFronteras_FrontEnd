/**
 * services/appointments.ts
 * Gestión de citas médicas
 *
 * Endpoints:
 *   POST   /appointments                    → Crear cita
 *   GET    /appointments?patientId=X        → Listar citas por paciente
 *   PATCH  /appointments/:id/status         → Actualizar estado de cita
 *   POST   /appointments/:id/notes          → Crear nota médica
 *   POST   /appointments/:id/video          → Obtener token de videollamada
 */

import { api } from "../lib/api";

// ========== TIPOS ==========

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type ModalityApi = "online" | "onsite" | "phone";

/** Cita desde la API */
export interface AppointmentApi {
  Id: number | string;
  PatientUserId: number | string;
  DoctorUserId: number | string;
  Status: AppointmentStatus;
  ScheduledAt: string;            // ISO
  DurationMin?: number | null;
  Modality: ModalityApi;
  SlotId?: number | string | null;
  Reason?: string | null;
  Notes?: string | null;
  CreatedAt: string;
  UpdatedAt: string;
  // Relaciones populadas (si el backend las incluye)
  Patient?: {
    FullName?: string;
    Email?: string;
  };
  Doctor?: {
    FullName?: string;
    Specialty?: string;
  };
}

/** Nota médica */
export interface AppointmentNoteApi {
  Id: number | string;
  AppointmentId: number | string;
  DoctorUserId: number | string;
  Content: string;
  CreatedAt: string;
}

/** Payload para crear cita */
export interface CreateAppointmentPayload {
  DoctorUserId: number | string;
  SlotId: number | string;
  Modality: ModalityApi;
  Reason?: string;
}

/** Payload para actualizar estado */
export interface UpdateAppointmentStatusPayload {
  Status: AppointmentStatus;
}

/** Payload para crear nota */
export interface CreateAppointmentNotePayload {
  Content: string;
}

/** Token de video */
export interface VideoTokenResponse {
  token: string;
  roomName: string;
  participantName: string;
}

// ========== FUNCIONES API ==========

/**
 * Listar citas (con filtros opcionales)
 * GET /appointments?patientId=X&doctorId=Y&status=Z
 */
export async function listAppointments(params?: {
  patientId?: number | string;
  doctorId?: number | string;
  status?: AppointmentStatus;
}): Promise<AppointmentApi[]> {
  try {
    const { data } = await api.get<AppointmentApi[]>("/appointments", { params });
    return Array.isArray(data) ? data : [];
  } catch (err: any) {
    console.error("[APPOINTMENTS] Error listando citas:", err);
    throw new Error(
      err?.response?.data?.message || "Error al obtener citas"
    );
  }
}

/**
 * Obtener cita por ID
 * GET /appointments/:id
 */
export async function getAppointmentById(id: number | string): Promise<AppointmentApi> {
  try {
    const { data } = await api.get<AppointmentApi>(`/appointments/${id}`);
    return data;
  } catch (err: any) {
    console.error("[APPOINTMENTS] Error obteniendo cita:", err);
    throw new Error(
      err?.response?.data?.message || "Error al obtener cita"
    );
  }
}

/**
 * Crear nueva cita
 * POST /appointments
 */
export async function createAppointment(
  payload: CreateAppointmentPayload
): Promise<AppointmentApi> {
  try {
    const { data } = await api.post<AppointmentApi>("/appointments", payload);
    return data;
  } catch (err: any) {
    console.error("[APPOINTMENTS] Error creando cita:", err);
    throw new Error(
      err?.response?.data?.message || "Error al crear cita"
    );
  }
}

/**
 * Actualizar estado de cita
 * PATCH /appointments/:id/status
 */
export async function updateAppointmentStatus(
  id: number | string,
  payload: UpdateAppointmentStatusPayload
): Promise<AppointmentApi> {
  try {
    const { data } = await api.patch<AppointmentApi>(
      `/appointments/${id}/status`,
      payload
    );
    return data;
  } catch (err: any) {
    console.error("[APPOINTMENTS] Error actualizando estado:", err);
    throw new Error(
      err?.response?.data?.message || "Error al actualizar estado de cita"
    );
  }
}

/**
 * Confirmar cita (helper)
 */
export async function confirmAppointment(id: number | string): Promise<AppointmentApi> {
  return updateAppointmentStatus(id, { Status: "CONFIRMED" });
}

/**
 * Cancelar cita (helper)
 */
export async function cancelAppointment(id: number | string): Promise<AppointmentApi> {
  return updateAppointmentStatus(id, { Status: "CANCELLED" });
}

/**
 * Completar cita (helper)
 */
export async function completeAppointment(id: number | string): Promise<AppointmentApi> {
  return updateAppointmentStatus(id, { Status: "COMPLETED" });
}

/**
 * Crear nota médica para una cita
 * POST /appointments/:id/notes
 */
export async function createAppointmentNote(
  appointmentId: number | string,
  payload: CreateAppointmentNotePayload
): Promise<AppointmentNoteApi> {
  try {
    const { data } = await api.post<AppointmentNoteApi>(
      `/appointments/${appointmentId}/notes`,
      payload
    );
    return data;
  } catch (err: any) {
    console.error("[APPOINTMENTS] Error creando nota:", err);
    throw new Error(
      err?.response?.data?.message || "Error al crear nota médica"
    );
  }
}

/**
 * Obtener token para videollamada
 * POST /appointments/:id/video
 */
export async function getVideoToken(
  appointmentId: number | string
): Promise<VideoTokenResponse> {
  try {
    const { data } = await api.post<VideoTokenResponse>(
      `/appointments/${appointmentId}/video`
    );
    return data;
  } catch (err: any) {
    console.error("[APPOINTMENTS] Error obteniendo token de video:", err);
    throw new Error(
      err?.response?.data?.message || "Error al obtener token de videollamada"
    );
  }
}
