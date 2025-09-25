import { api } from "../lib/api";
import type { UpcomingAppointment, RecommendedDoctor, RecentMessage } from "../types/patient-dashboard";

/**
 * 🔗 CAMBIA SOLO ESTOS PATHS CUANDO TENGAS TU BACKEND NEST:
 * 
 * Sugerencias reales según tu esquema de BD:
 * - Próximas citas del paciente:      GET /api/appointments?patientId=:id&status=scheduled&limit=3
 * - Doctores recomendados:            GET /api/doctors/recommended?patientId=:id
 * - Mensajes recientes del paciente:  GET /api/messages/recent?userId=:id&limit=5
 * 
 * Si decides un endpoint agregado (dashboard en 1 request):
 * - GET /api/patients/:id/dashboard
 */
const APPTS_PATH = "/api/appointments";              // TODO: ajusta
const RECO_DOCTORS_PATH = "/api/doctors/recommended";// TODO: ajusta
const RECENT_MSGS_PATH = "/api/messages/recent";     // TODO: ajusta

export async function fetchUpcomingAppointments(patientId: number): Promise<UpcomingAppointment[]> {
  const { data } = await api.get<UpcomingAppointment[]>(APPTS_PATH, {
    params: { patientId, status: "scheduled", limit: 3 },
  });
  return data;
}

export async function fetchRecommendedDoctors(patientId: number): Promise<RecommendedDoctor[]> {
  const { data } = await api.get<RecommendedDoctor[]>(RECO_DOCTORS_PATH, {
    params: { patientId, limit: 3 },
  });
  return data;
}

export async function fetchRecentMessages(userId: number): Promise<RecentMessage[]> {
  const { data } = await api.get<RecentMessage[]>(RECENT_MSGS_PATH, {
    params: { userId, limit: 5 },
  });
  return data;
}

/** Opción alternativa: un único endpoint de dashboard */
export type DashboardPayload = {
  upcomingAppointments: UpcomingAppointment[];
  recommendedDoctors: RecommendedDoctor[];
  recentMessages: RecentMessage[];
};

// const DASHBOARD_PATH = "/api/patients"; // GET /api/patients/:id/dashboard
export async function fetchPatientDashboard(patientId: number): Promise<DashboardPayload> {
  // Descomenta si prefieres 1 request:
  // const { data } = await api.get<DashboardPayload>(`${DASHBOARD_PATH}/${patientId}/dashboard`);
  // return data;

  // Por defecto: en paralelo con 3 endpoints
  const [appts, doctors, msgs] = await Promise.all([
    fetchUpcomingAppointments(patientId),
    fetchRecommendedDoctors(patientId),
    fetchRecentMessages(patientId),
  ]);
  return { upcomingAppointments: appts, recommendedDoctors: doctors, recentMessages: msgs };
}
