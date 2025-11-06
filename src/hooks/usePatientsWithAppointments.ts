// src/hooks/usePatientsWithAppointments.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

// Tipo para un paciente con el que el doctor tiene citas
export type PatientWithAppointments = {
  id: number | string;
  name: string;
  email: string;
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
 * Hook para obtener la lista de pacientes con los que el doctor tiene al menos una cita.
 * Esto permite crear conversaciones únicas por paciente.
 */
async function fetchPatientsWithAppointments(): Promise<PatientWithAppointments[]> {
  try {
    // Obtener todas las citas del doctor desde el endpoint /appointments/today
    // que devuelve las citas de hoy, pero podemos usar /appointments/all si existe
    const response = await api.get('/appointments/all', {
      params: {
        limit: 1000, // Obtener todas las citas
        order: 'desc'
      }
    });

    const allAppointments = Array.isArray(response.data?.data)
      ? response.data.data
      : (Array.isArray(response.data) ? response.data : []);

    // Agrupar citas por paciente
    const patientMap = new Map<string | number, {
      name: string;
      email: string;
      appointmentCount: number;
      lastAppointmentDate?: Date;
    }>();

    allAppointments.forEach((appointment: any) => {
      // Intentar obtener el ID del paciente de diferentes formas
      const patientId = appointment.patient?.id || appointment.patient?.Id || appointment.PatientUserId;

      // Obtener el nombre del paciente - puede venir como objeto patient o como campos directos
      let patientName = 'Paciente';
      if (appointment.patient?.name) {
        patientName = appointment.patient.name;
      } else if (appointment.patient?.FirstName) {
        patientName = `${appointment.patient.FirstName} ${appointment.patient.LastName1 || ''} ${appointment.patient.LastName2 || ''}`.trim();
      }

      const patientEmail = appointment.patient?.email || appointment.patient?.Email || '';

      if (!patientId) return;

      const appointmentDate = appointment.scheduledAt
        ? parseUTCAsLocal(appointment.scheduledAt)
        : undefined;

      if (patientMap.has(patientId)) {
        const existing = patientMap.get(patientId)!;
        existing.appointmentCount++;

        // Actualizar la fecha de la última cita si es más reciente
        if (appointmentDate && (!existing.lastAppointmentDate || appointmentDate > existing.lastAppointmentDate)) {
          existing.lastAppointmentDate = appointmentDate;
        }
      } else {
        patientMap.set(patientId, {
          name: patientName,
          email: patientEmail,
          appointmentCount: 1,
          lastAppointmentDate: appointmentDate,
        });
      }
    });

    // Convertir el mapa a un array y ordenar por fecha de última cita (más reciente primero)
    const patients: PatientWithAppointments[] = Array.from(patientMap.entries())
      .map(([id, data]) => ({
        id,
        name: data.name,
        email: data.email,
        appointmentCount: data.appointmentCount,
        lastAppointmentDate: data.lastAppointmentDate?.toISOString(),
      }))
      .sort((a, b) => {
        // Ordenar por fecha de última cita (más reciente primero)
        if (!a.lastAppointmentDate) return 1;
        if (!b.lastAppointmentDate) return -1;
        return new Date(b.lastAppointmentDate).getTime() - new Date(a.lastAppointmentDate).getTime();
      });

    return patients;
  } catch (error) {
    console.error('Error fetching patients with appointments:', error);
    return [];
  }
}

/**
 * Hook React Query para obtener los pacientes con los que el doctor tiene citas
 */
export function usePatientsWithAppointments() {
  return useQuery({
    queryKey: ['doctor', 'patients-with-appointments'],
    queryFn: fetchPatientsWithAppointments,
    staleTime: 60_000, // 1 minuto
    refetchOnWindowFocus: false,
  });
}
