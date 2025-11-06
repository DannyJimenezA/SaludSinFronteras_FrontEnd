// src/hooks/useDoctorsWithAppointments.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

// Tipo para un doctor con el que el paciente tiene citas
export type DoctorWithAppointments = {
  id: number | string;
  name: string;
  specialty: string;
  appointmentCount: number;
  lastAppointmentDate?: string;
};

// Función para parsear fechas UTC como locales (sin conversión de zona horaria)
const parseUTCAsLocal = (dateString: string) => {
  // Remover la 'Z' para que no se interprete como UTC
  const withoutZ = dateString.replace('Z', '');
  return new Date(withoutZ);
};

/**
 * Hook para obtener la lista de doctores con los que el paciente tiene al menos una cita.
 * Esto permite crear conversaciones únicas por doctor.
 */
async function fetchDoctorsWithAppointments(): Promise<DoctorWithAppointments[]> {
  try {
    // Obtener todas las citas del paciente
    const response = await api.get('/appointments/all', {
      params: {
        limit: 1000, // Obtener todas las citas
        order: 'desc'
      }
    });

    const allAppointments = Array.isArray(response.data?.data)
      ? response.data.data
      : (Array.isArray(response.data) ? response.data : []);

    // Agrupar citas por doctor
    const doctorMap = new Map<string | number, {
      name: string;
      specialty: string;
      appointmentCount: number;
      lastAppointmentDate?: Date;
    }>();

    allAppointments.forEach((appointment: any) => {
      const doctorId = appointment.doctor?.id || appointment.DoctorUserId;
      const doctorName = appointment.doctor?.name || 'Médico';
      const doctorSpecialty = appointment.doctor?.specialty || 'General';

      if (!doctorId) return;

      const appointmentDate = appointment.scheduledAt
        ? parseUTCAsLocal(appointment.scheduledAt)
        : undefined;

      if (doctorMap.has(doctorId)) {
        const existing = doctorMap.get(doctorId)!;
        existing.appointmentCount++;

        // Actualizar la fecha de la última cita si es más reciente
        if (appointmentDate && (!existing.lastAppointmentDate || appointmentDate > existing.lastAppointmentDate)) {
          existing.lastAppointmentDate = appointmentDate;
        }
      } else {
        doctorMap.set(doctorId, {
          name: doctorName,
          specialty: doctorSpecialty,
          appointmentCount: 1,
          lastAppointmentDate: appointmentDate,
        });
      }
    });

    // Convertir el mapa a un array y ordenar por fecha de última cita (más reciente primero)
    const doctors: DoctorWithAppointments[] = Array.from(doctorMap.entries())
      .map(([id, data]) => ({
        id,
        name: data.name,
        specialty: data.specialty,
        appointmentCount: data.appointmentCount,
        lastAppointmentDate: data.lastAppointmentDate?.toISOString(),
      }))
      .sort((a, b) => {
        // Ordenar por fecha de última cita (más reciente primero)
        if (!a.lastAppointmentDate) return 1;
        if (!b.lastAppointmentDate) return -1;
        return new Date(b.lastAppointmentDate).getTime() - new Date(a.lastAppointmentDate).getTime();
      });

    return doctors;
  } catch (error) {
    console.error('Error fetching doctors with appointments:', error);
    return [];
  }
}

/**
 * Hook React Query para obtener los doctores con los que el paciente tiene citas
 */
export function useDoctorsWithAppointments() {
  return useQuery({
    queryKey: ['patient', 'doctors-with-appointments'],
    queryFn: fetchDoctorsWithAppointments,
    staleTime: 60_000, // 1 minuto
    refetchOnWindowFocus: false,
  });
}
