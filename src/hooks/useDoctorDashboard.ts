import { useQuery } from "@tanstack/react-query";
import { getMyDoctorProfile } from "../services/doctors";
import { api } from "../lib/api";

function isTodayISO(iso: string) {
  const d = new Date(iso);
  const now = new Date();

  // Comparar usando UTC para evitar problemas de zona horaria
  return (
    d.getUTCFullYear() === now.getUTCFullYear() &&
    d.getUTCMonth() === now.getUTCMonth() &&
    d.getUTCDate() === now.getUTCDate()
  );
}

// Función para obtener las citas upcoming del doctor con formato mejorado
async function getUpcomingAppointments() {
  const { data } = await api.get<any[]>("/appointments/upcoming");
  return Array.isArray(data) ? data : [];
}

export function useDoctorDashboard() {
  const prof = useQuery({
    queryKey: ["doctor", "me", "profile"],
    queryFn: getMyDoctorProfile,
    staleTime: 60_000,
  });

  const appts = useQuery({
    queryKey: ["doctor", "appointments", "upcoming"],
    queryFn: getUpcomingAppointments,
    staleTime: 20_000,
  });

  const doctorName = prof.data?.FullName ?? "Doctor/a";
  const doctorSpecialty = prof.data?.Specialty ?? "—";

  const todaysAppointments = (appts.data ?? [])
    .filter(a => isTodayISO(a.scheduledAt))
    .sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt))
    .map(a => ({
      id: a.id,
      patient: a.patient?.name || "Paciente",
      patientEmail: a.patient?.email || "",
      time: new Date(a.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: a.modality === "online" ? "videollamada" : a.modality === "onsite" ? "presencial" : "teléfono",
      condition: "Consulta",
      status: a.status,
      urgent: false,
    }));

  const stat_today = todaysAppointments.length;

  // Citas atendidas (Status === "COMPLETED")
  const stat_completed = (appts.data ?? [])
    .filter(a => isTodayISO(a.scheduledAt))
    .filter(a => a.status === "COMPLETED").length;

  // Citas pendientes (Status === "PENDING" o "CONFIRMED")
  const stat_pending = (appts.data ?? [])
    .filter(a => isTodayISO(a.scheduledAt))
    .filter(a => a.status === "PENDING" || a.status === "CONFIRMED").length;

  return {
    profile: prof,
    appointments: appts,
    doctorName,
    doctorSpecialty,
    todaysAppointments,
    stat_today,
    stat_completed,
    stat_pending,
  };
}
