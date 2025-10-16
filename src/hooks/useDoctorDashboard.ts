import { useQuery } from "@tanstack/react-query";
import { getMyDoctorProfile } from "../services/doctors";
import { listAppointments } from "../services/appointments";
import { getMyConversations } from "../services/conversations";

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
  const prof = useQuery({
    queryKey: ["doctor", "me", "profile"],
    queryFn: getMyDoctorProfile,
    staleTime: 60_000,
  });

  const appts = useQuery({
    queryKey: ["doctor", "appointments"],
    queryFn: listAppointments,
    staleTime: 20_000,
  });

  const convs = useQuery({
    queryKey: ["doctor", "conversations", "mine"],
    queryFn: getMyConversations,
    staleTime: 30_000,
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
      patient: "", // completa cuando tu API devuelva el nombre
      time: new Date(a.ScheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: a.Modality === "online" ? "videollamada" : "presencial",
      condition: "Consulta",
      urgent: false,
    }));

  const stat_today = todaysAppointments.length;
  const stat_online = (appts.data ?? []).filter(a => isTodayISO(a.ScheduledAt) && a.Modality === "online").length;

  const messages = (convs.data ?? []).slice(0, 5).map(c => ({
    id: c.Id,
    from: c.WithUserName ?? c.Title ?? "Paciente",
    message: c.Preview ?? "Nuevo mensaje",
    time: "",
    unread: false,
  }));

  return {
    profile: prof,
    appointments: appts,
    conversations: convs,
    doctorName,
    doctorSpecialty,
    todaysAppointments,
    stat_today,
    stat_online,
    messages,
  };
}
