// src/hooks/usePatientDashboard.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

type UpcomingAppointment = {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  type: 'videollamada'|'presencial';
};

type RecommendedDoctor = { id: number; name: string; specialty: string; rating: number; location: string; languages: string[]; available: boolean; };

type RecentMessage = { id: number; from: string; preview: string; at?: string; unread?: boolean; };

type DashboardData = {
  upcomingAppointments: UpcomingAppointment[];
  recommendedDoctors: RecommendedDoctor[]; // por ahora vacío
  recentMessages: RecentMessage[];
};

async function fetchPatientDashboard(): Promise<DashboardData> {
  // 1) Citas del usuario autenticado
  const apptsRes = await api.get('/appointments'); // tu API lista las citas del usuario logueado
  const apptsRaw = Array.isArray(apptsRes.data) ? apptsRes.data : [];

  // Deja solo próximas y toma 3
  const upcoming = apptsRaw
    .filter((a: any) => ['PENDING', 'CONFIRMED', 'SCHEDULED'].includes(String(a.Status ?? a.status)))
    .slice(0, 3)
    .map((a: any): UpcomingAppointment => {
      const dt = new Date(a.ScheduledAt ?? a.scheduledAt ?? a.startAt ?? Date.now());
      const yyyy = dt.getFullYear();
      const mm = String(dt.getMonth() + 1).padStart(2, '0');
      const dd = String(dt.getDate()).padStart(2, '0');
      const hh = String(dt.getHours()).padStart(2, '0');
      const mi = String(dt.getMinutes()).padStart(2, '0');

      return {
        id: Number(a.Id ?? a.id),
        doctor: a.DoctorName ?? a.doctorName ?? 'Médico',
        specialty: a.Specialty ?? a.specialty ?? 'General',
        date: `${yyyy}-${mm}-${dd}`,
        time: `${hh}:${mi}`,
        type: (String(a.Modality ?? a.modality).toLowerCase() === 'online') ? 'videollamada' : 'presencial',
      };
    });

  // 2) Mensajes del usuario autenticado
  const convRes = await api.get('/conversations/mine');
  const conv = convRes.data;
  const messagesRaw: any[] = Array.isArray(conv?.items) ? conv.items : (Array.isArray(conv) ? conv : []);

  const recent = messagesRaw.slice(0, 5).map((m: any): RecentMessage => ({
    id: Number(m.Id ?? m.id),
    from: m.FromName ?? m.fromName ?? 'Contacto',
    preview: m.Preview ?? m.preview ?? m.Text ?? m.text ?? '',
    at: m.CreatedAt ?? m.createdAt,
  }));

  // 3) Aún no hay recomendados reales
  const recommended: RecommendedDoctor[] = [];

  return {
    upcomingAppointments: upcoming,
    recommendedDoctors: recommended,
    recentMessages: recent,
  };
}

export function usePatientDashboard(patientId: number) {
  // patientId no lo usa el backend hoy, pero lo dejamos por compatibilidad con tu componente
  return useQuery({
    queryKey: ['patient_dashboard'],
    queryFn: fetchPatientDashboard,
    refetchOnWindowFocus: false,
  });
}
