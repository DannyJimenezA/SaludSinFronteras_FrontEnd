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

// Función para parsear fechas UTC como locales (sin conversión de zona horaria)
const parseUTCAsLocal = (dateString: string) => {
  // Remover la 'Z' para que no se interprete como UTC
  const withoutZ = dateString.replace('Z', '');
  return new Date(withoutZ);
};

async function fetchPatientDashboard(): Promise<DashboardData> {
  // 1) Traer todas las citas y filtrar en el frontend por hora local
  const apptsRes = await api.get('/appointments/all', {
    params: {
      limit: 100, // Aumentar el límite para obtener todas las citas
      order: 'asc'
    }
  });
  // El endpoint /appointments/all devuelve { data: [], pagination: {} }
  const allApptsRaw = Array.isArray(apptsRes.data?.data) ? apptsRes.data.data : (Array.isArray(apptsRes.data) ? apptsRes.data : []);

  // Clasificar citas usando hora local
  const now = new Date();
  const upcomingApptsRaw = allApptsRaw.filter((a: any) => {
    if (a.status === 'CANCELLED') return false;
    const scheduledAt = parseUTCAsLocal(a.scheduledAt);

    // Calcular la hora de finalización de la cita
    const durationMin = a.durationMin || 30; // 30 minutos por defecto
    const endAt = new Date(scheduledAt.getTime() + durationMin * 60000);

    // La cita es próxima si aún no ha terminado
    return endAt > now;
  });

  // Limitar a las primeras 10 citas próximas
  const upcoming = upcomingApptsRaw.slice(0, 10).map((a: any): UpcomingAppointment => {
    const dt = parseUTCAsLocal(a.scheduledAt);
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
