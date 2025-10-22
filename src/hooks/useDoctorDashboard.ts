import { useQuery } from "@tanstack/react-query";
import { getMyDoctorProfile } from "../services/doctors";
import { listAppointments } from "../services/appointments";
import { getMe } from "../services/users";

function isTodayISO(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export function useDoctorDashboard() {
  // Obtener ID del usuario logueado
  const user = useQuery({
    queryKey: ["users", "me"],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const prof = useQuery({
    queryKey: ["doctor", "me", "profile"],
    queryFn: getMyDoctorProfile,
    staleTime: 60_000,
  });

  // Obtener citas del doctor logueado
  const appts = useQuery({
    queryKey: ["doctor", "appointments"],
    queryFn: () => listAppointments({ doctorId: user.data?.id }),
    enabled: !!user.data?.id,
    staleTime: 20_000,
  });

  const doctorName = prof.data?.FullName ?? "Doctor/a";
  const doctorSpecialty = prof.data?.Specialty ?? "—";
  const doctorUserId = prof.data?.UserId;

  const todaysAppointments = (appts.data ?? [])
    .filter(a => isTodayISO(a.ScheduledAt))
    .filter(a => (doctorUserId ? String(a.DoctorUserId) === String(doctorUserId) : true))
    .sort((a, b) => +new Date(a.ScheduledAt) - +new Date(b.ScheduledAt))
    .map(a => ({
      id: a.Id,
      patient: a.Patient?.FullName ?? a.Patient?.Email ?? "Paciente",
      time: new Date(a.ScheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: a.Modality === "online" ? "videollamada" : a.Modality === "onsite" ? "presencial" : "teléfono",
      condition: a.Reason ?? "Consulta",
      urgent: false,
      status: a.Status,
    }));

  const stat_today = todaysAppointments.length;
  const stat_online = (appts.data ?? []).filter(a => isTodayISO(a.ScheduledAt) && a.Modality === "online").length;
  const stat_pending = (appts.data ?? []).filter(a => a.Status === "PENDING").length;
  const stat_completed = (appts.data ?? []).filter(a => a.Status === "COMPLETED").length;

  // Por ahora no tenemos endpoint de conversaciones, lo dejamos vacío
  const messages: Array<{
    id: string | number;
    from: string;
    message: string;
    time: string;
    unread: boolean;
  }> = [];

  return {
    profile: prof,
    appointments: appts,
    user,
    doctorName,
    doctorSpecialty,
    todaysAppointments,
    stat_today,
    stat_online,
    stat_pending,
    stat_completed,
    messages,
  };
}
