import { useQuery } from "@tanstack/react-query";
import { getMyDoctorProfile } from "../services/doctors";
import { api } from "../lib/api";

// Función para obtener las citas de hoy del doctor
async function getTodayAppointments() {
  const { data } = await api.get<any[]>("/appointments/today");
  return Array.isArray(data) ? data : [];
}

// Función para parsear fechas UTC como locales (sin conversión de zona horaria)
const parseUTCAsLocal = (dateString: string) => {
  // Remover la 'Z' para que no se interprete como UTC
  const withoutZ = dateString.replace('Z', '');
  return new Date(withoutZ);
};

export function useDoctorDashboard() {
  const prof = useQuery({
    queryKey: ["doctor", "me", "profile"],
    queryFn: getMyDoctorProfile,
    staleTime: 60_000,
  });

  const appts = useQuery({
    queryKey: ["doctor", "appointments", "today"],
    queryFn: getTodayAppointments,
    staleTime: 20_000,
  });

  const doctorName = prof.data?.fullName ?? "Doctor/a";
  const doctorSpecialty = prof.data?.specialty ?? "—";

  const todaysAppointments = (appts.data ?? [])
    .map(a => ({
      id: a.id,
      patient: a.patient?.name || "Paciente",
      patientEmail: a.patient?.email || "",
      time: parseUTCAsLocal(a.scheduledAt).toLocaleTimeString('es-ES', {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      }),
      type: a.modality === "online" ? "videollamada" : a.modality === "onsite" ? "presencial" : "teléfono",
      condition: "Consulta",
      status: a.status,
      urgent: false,
    }));

  const stat_today = todaysAppointments.length;

  // Citas atendidas (Status === "COMPLETED")
  const stat_completed = (appts.data ?? [])
    .filter(a => a.status === "COMPLETED").length;

  // Citas pendientes (Status === "PENDING" o "CONFIRMED")
  const stat_pending = (appts.data ?? [])
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
