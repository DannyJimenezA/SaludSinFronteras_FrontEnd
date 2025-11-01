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
  // 1) Citas próximas del usuario autenticado usando el nuevo endpoint
  const apptsRes = await api.get('/appointments/upcoming', {
    params: { limit: 10 } // Obtener hasta 10 citas próximas
  });
  const apptsRaw = Array.isArray(apptsRes.data) ? apptsRes.data : [];

  // Mapea la respuesta del nuevo endpoint
  const upcoming = apptsRaw.map((a: any): UpcomingAppointment => {
    const dt = new Date(a.scheduledAt);
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');

    // Formatear hora con AM/PM
    const time = dt.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return {
      id: Number(a.id),
      doctor: a.doctor?.name || 'Médico',
      specialty: a.doctor?.specialty || 'General',
      date: `${yyyy}-${mm}-${dd}`,
      time: time,
      type: (String(a.modality).toLowerCase() === 'online') ? 'videollamada' : 'presencial',
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
