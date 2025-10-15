import { api } from "../lib/api";

export type AvailabilitySlot = {
  id: number;
  startAt: string; // ISO
  endAt: string;   // ISO
};

// 🔧 Normalizador de slot procedente de la API
function mapSlot(raw: any): AvailabilitySlot {
  return {
    id: Number(raw?.Id ?? raw?.id),
    startAt: String(raw?.StartAt ?? raw?.startAt),
    endAt: String(raw?.EndAt ?? raw?.endAt),
  };
}

export async function getDoctorAvailability(doctorId: number, dayISO?: string) {
  const params: Record<string,string> = {};
  if (dayISO) params.date = dayISO.slice(0,10);

  const { data } = await api.get(`/doctors/${doctorId}/availability`, { params });

  const slots = Array.isArray(data) ? data.map(mapSlot) : [];
  // opcional: ordena por inicio
  slots.sort((a,b) => Date.parse(a.startAt) - Date.parse(b.startAt));
  return slots;
}

export async function publishAvailability(startAtISO: string, endAtISO: string) {
  const { data } = await api.post(`/doctors/me/availability`, {
    StartAt: startAtISO,
    EndAt: endAtISO,
  });
  return data;
}

export async function createAppointment(params: {
  doctorId: number;
  slotId: number | string;
  modality: "online" | "video" | "in_person" | string;
}) {
  const payload = {
    DoctorUserId: Number(params.doctorId),                    // 🔧 numérico
    SlotId: Number(params.slotId),                            // 🔧 usa el ID de slot
    Modality: params.modality === "video" ? "online" : params.modality,
  };
  const { data } = await api.post(`/appointments`, payload);
  return data;
}
