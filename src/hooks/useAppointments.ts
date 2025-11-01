// src/hooks/useAppointments.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

type Appointment = {
  id: string;
  scheduledAt: string;
  durationMin: number;
  status: string;
  modality: string;
  cancelReason?: string;
  doctor: {
    id: string;
    name: string;
    specialty: string;
    email: string;
  } | null;
  patient: {
    id: string;
    name: string;
    email: string;
  } | null;
  slot: {
    id: string;
    startAt: string;
    endAt: string;
  } | null;
  cancelledBy?: {
    id: string;
    name: string;
    email: string;
  } | null;
};

// Hook para obtener todas las citas con paginación
export function useAllAppointments(page: number = 1, limit: number = 10, order: 'asc' | 'desc' = 'desc') {
  return useQuery({
    queryKey: ['appointments', 'all', page, limit, order],
    queryFn: async () => {
      const response = await api.get('/appointments/all', {
        params: { page, limit, order }
      });
      return response.data as {
        data: Appointment[];
        pagination: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      };
    },
    refetchOnWindowFocus: false,
  });
}

// Hook para obtener próximas citas
export function useUpcomingAppointments(limit: number = 10) {
  return useQuery({
    queryKey: ['appointments', 'upcoming', limit],
    queryFn: async () => {
      const response = await api.get('/appointments/upcoming', {
        params: { limit }
      });
      return response.data as Appointment[];
    },
    refetchOnWindowFocus: false,
  });
}

// Hook para obtener citas pasadas
export function usePastAppointments(limit: number = 20) {
  return useQuery({
    queryKey: ['appointments', 'past', limit],
    queryFn: async () => {
      const response = await api.get('/appointments/past', {
        params: { limit }
      });
      return response.data as Appointment[];
    },
    refetchOnWindowFocus: false,
  });
}

// Hook para obtener citas canceladas
export function useCancelledAppointments(limit: number = 20) {
  return useQuery({
    queryKey: ['appointments', 'cancelled', limit],
    queryFn: async () => {
      const response = await api.get('/appointments/cancelled', {
        params: { limit }
      });
      return response.data as Appointment[];
    },
    refetchOnWindowFocus: false,
  });
}

// Hook para crear una nueva cita
export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      DoctorUserId: number;
      SlotId: number;
      Modality?: 'online' | 'in_person' | 'hybrid';
    }) => {
      const response = await api.post('/appointments', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidar todas las queries de appointments para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

// Hook para cancelar una cita
export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; cancelReason?: string }) => {
      const response = await api.patch(`/appointments/${data.id}/cancel`, {
        CancelReason: data.cancelReason,
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidar todas las queries de appointments para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}
