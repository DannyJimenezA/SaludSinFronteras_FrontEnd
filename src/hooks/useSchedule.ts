import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  publishAvailability,
  getDoctorAvailability,
  createAppointment,
  AvailabilitySlot,
} from "../services/schedule";
import { api } from "../lib/api";

const hasToken = () => !!localStorage.getItem("access_token");

export function usePublishAvailability() {
  return useMutation({
    mutationFn: (p: { startAtISO: string; endAtISO: string }) =>
      publishAvailability(p.startAtISO, p.endAtISO),
  });
}

export type Slot = {
  id: number;
  startAt: string;             // ISO
  endAt: string;               // ISO
  status: "FREE" | "BOOKED";   // normalizamos
};

export function useDoctorAvailability(doctorId?: number, dateISO?: string) {
  return useQuery<Slot[]>({
    queryKey: ["availability", doctorId, dateISO],
    enabled: !!doctorId && !!dateISO,
    queryFn: async () => {
      const { data } = await api.get(`/doctors/${doctorId}/availability`, {
        params: { date: dateISO },
      });
      // Normaliza nombres de campos y status
      return (data ?? []).map((s: any) => ({
        id: Number(s.Id ?? s.id),
        startAt: String(s.StartAt ?? s.startAt),
        endAt: String(s.EndAt ?? s.endAt),
        status: String(s.Status ?? s.status ?? "FREE").toUpperCase() as Slot["status"],
      }));
    },
  });
}

export function useCreateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: { doctorId: number; slotId: number; modality: "online" | "inperson" }) => {
      const body = {
        DoctorUserId: p.doctorId,
        SlotId: p.slotId,
        Modality: p.modality, // tu API acepta "online" | "inperson"
      };
      const { data } = await api.post("/appointments", body);
      return data;
    },
    onSuccess: (_data, vars) => {
      // Refresca los horarios y, si quieres, el listado de citas del paciente
      qc.invalidateQueries({ queryKey: ["availability", vars.doctorId] });
      qc.invalidateQueries({ queryKey: ["meAppointments"] });
    },
  });
}