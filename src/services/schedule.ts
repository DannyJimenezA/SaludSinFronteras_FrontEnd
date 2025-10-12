// src/services/schedule.ts
import { api } from "../lib/api";

/** ===== Tipos ===== */
export interface AvailabilitySlot {
  id: number;
  startAt: string;  // ISO
  endAt: string;    // ISO
  isRecurring: boolean;
  rrule?: string | null;
}

export interface CreateAppointmentPayload {
  doctorId: number | string;
  slotId: number | string;                 // ← tu API usa SlotId
  modality?: "video" | "inperson";         // UI-friendly
  notes?: string;
}

/** ===== Helpers ===== */
const mapModalityToApi = (m?: "video" | "inperson") =>
  m === "video" ? "online" : m === "inperson" ? "inperson" : "online";

/** ===== Disponibilidad del doctor =====
 * GET /doctors/:id/availability?date=YYYY-MM-DD (si tu backend acepta date)
 * Si tu endpoint no usa date, quita params.
 */
export async function getDoctorAvailability(
  doctorId: number | string,
  dateISO?: string
): Promise<AvailabilitySlot[]> {
  const { data } = await api.get(`/doctors/${doctorId}/availability`, {
    params: dateISO ? { date: dateISO } : undefined,
  });

  // data puede venir como array de objetos con PascalCase
  // mapeamos a camelCase homogéneo
  const arr = Array.isArray(data) ? data : [];
  return arr.map((s: any) => ({
    id: Number(s.id ?? s.Id),
    startAt: s.startAt ?? s.StartAt,
    endAt: s.endAt ?? s.EndAt,
    isRecurring: Boolean(s.isRecurring ?? s.IsRecurring ?? false),
    rrule: s.rrule ?? s.RRule ?? null,
  }));
}

/** ===== Crear cita =====
 * POST /appointments { DoctorUserId, SlotId, Modality }
 */
export async function createAppointment(payload: CreateAppointmentPayload) {
  const dto = {
    DoctorUserId: payload.doctorId,
    SlotId: payload.slotId,
    Modality: mapModalityToApi(payload.modality), // "online" | "inperson"
    ...(payload.notes ? { Notes: payload.notes } : {}),
  };

  const { data } = await api.post(`/appointments`, dto);

  return {
    id: String(data.id ?? data.Id),
    status: data.status ?? data.Status,
    scheduledAt: data.scheduledAt ?? data.ScheduledAt,
    doctorUserId: String(data.doctorUserId ?? data.DoctorUserId ?? ""),
    patientUserId: String(data.patientUserId ?? data.PatientUserId ?? ""),
    slotId: String(data.slotId ?? data.SlotId ?? ""),
    modality: data.modality ?? data.Modality,
    durationMin: data.durationMin ?? data.DurationMin,
  };
}
