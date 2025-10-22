# Servicios API y Custom Hooks

## Tabla de Contenidos

1. [Servicios API](#servicios-api)
2. [Custom Hooks](#custom-hooks)
3. [Tipos TypeScript](#tipos-typescript)
4. [Validadores Zod](#validadores-zod)

---

## Servicios API

### 1. Authentication Service

```typescript
// src/services/auth.ts
import { api } from './api';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'PATIENT' | 'DOCTOR';
  country?: string;
  phone?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  register: async (data: RegisterDto) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string) => {
    const response = await api.post('/auth/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },

  resendVerification: async (email: string) => {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  },
};
```

### 2. Users Service

```typescript
// src/services/users.ts
import { api } from './api';
import { User } from '@/types/user';

export const usersService = {
  getMe: async () => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await api.patch<User>('/users/me', data);
    return response.data;
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<{ url: string }>(
      '/users/me/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.post('/users/me/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};
```

### 3. Doctors Service

```typescript
// src/services/doctors.ts
import { api } from './api';
import { Doctor, DoctorProfile } from '@/types/doctor';

export interface SearchDoctorsParams {
  search?: string;
  specialtyId?: number;
  countryId?: number;
  minRating?: number;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const doctorsService = {
  search: async (params: SearchDoctorsParams) => {
    const response = await api.get<PaginatedResponse<Doctor>>('/doctors', {
      params,
    });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Doctor>(`/doctors/${id}`);
    return response.data;
  },

  getProfile: async (id: number) => {
    const response = await api.get<DoctorProfile>(`/doctors/${id}/profile`);
    return response.data;
  },

  updateProfile: async (data: Partial<DoctorProfile>) => {
    const response = await api.patch<DoctorProfile>('/doctors/me/profile', data);
    return response.data;
  },

  uploadLicense: async (file: File) => {
    const formData = new FormData();
    formData.append('license', file);

    const response = await api.post('/doctors/me/license', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getStats: async (doctorId: number) => {
    const response = await api.get(`/doctors/${doctorId}/stats`);
    return response.data;
  },
};
```

### 4. Appointments Service

```typescript
// src/services/appointments.ts
import { api } from './api';
import { Appointment, AppointmentStatus } from '@/types/appointment';

export interface CreateAppointmentDto {
  doctorId: number;
  availabilityId: number;
  reason?: string;
  notes?: string;
}

export interface UpdateAppointmentDto {
  status?: AppointmentStatus;
  notes?: string;
  diagnosis?: string;
  prescriptions?: string;
}

export const appointmentsService = {
  getAll: async (params?: {
    status?: AppointmentStatus;
    userId?: number;
    doctorId?: number;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await api.get<Appointment[]>('/appointments', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Appointment>(`/appointments/${id}`);
    return response.data;
  },

  create: async (data: CreateAppointmentDto) => {
    const response = await api.post<Appointment>('/appointments', data);
    return response.data;
  },

  update: async (id: number, data: UpdateAppointmentDto) => {
    const response = await api.patch<Appointment>(`/appointments/${id}`, data);
    return response.data;
  },

  cancel: async (id: number, reason?: string) => {
    const response = await api.patch<Appointment>(`/appointments/${id}/cancel`, {
      reason,
    });
    return response.data;
  },

  confirm: async (id: number) => {
    const response = await api.patch<Appointment>(`/appointments/${id}/confirm`);
    return response.data;
  },

  complete: async (id: number, notes?: string) => {
    const response = await api.patch<Appointment>(`/appointments/${id}/complete`, {
      notes,
    });
    return response.data;
  },

  reschedule: async (id: number, newAvailabilityId: number) => {
    const response = await api.patch<Appointment>(
      `/appointments/${id}/reschedule`,
      { newAvailabilityId }
    );
    return response.data;
  },
};
```

### 5. Availability Service

```typescript
// src/services/availability.ts
import { api } from './api';
import { Availability } from '@/types/availability';

export interface CreateAvailabilityDto {
  date: string;
  startTime: string;
  endTime: string;
  repeat?: 'none' | 'daily' | 'weekly' | 'monthly';
  repeatUntil?: string;
}

export const availabilityService = {
  getByDoctor: async (doctorId: number, startDate?: string, endDate?: string) => {
    const response = await api.get<Availability[]>('/availability', {
      params: { doctorId, startDate, endDate },
    });
    return response.data;
  },

  create: async (data: CreateAvailabilityDto) => {
    const response = await api.post<Availability>('/availability', data);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/availability/${id}`);
  },

  bulkCreate: async (slots: CreateAvailabilityDto[]) => {
    const response = await api.post<Availability[]>('/availability/bulk', { slots });
    return response.data;
  },
};
```

### 6. Medical Records Service

```typescript
// src/services/medicalRecords.ts
import { api } from './api';
import { MedicalRecord } from '@/types/medicalRecord';

export interface CreateMedicalRecordDto {
  appointmentId: number;
  patientId: number;
  diagnosis: string;
  symptoms?: string;
  treatment?: string;
  prescriptions?: Array<{
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  notes?: string;
  attachments?: number[];
}

export const medicalRecordsService = {
  getByPatient: async (patientId: number) => {
    const response = await api.get<MedicalRecord[]>('/medical-records', {
      params: { patientId },
    });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<MedicalRecord>(`/medical-records/${id}`);
    return response.data;
  },

  create: async (data: CreateMedicalRecordDto) => {
    const response = await api.post<MedicalRecord>('/medical-records', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateMedicalRecordDto>) => {
    const response = await api.patch<MedicalRecord>(`/medical-records/${id}`, data);
    return response.data;
  },

  addAttachment: async (recordId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(
      `/medical-records/${recordId}/attachments`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};
```

### 7. Chat/Messages Service

```typescript
// src/services/messages.ts
import { api } from './api';
import { Message, Conversation } from '@/types/message';

export interface SendMessageDto {
  conversationId: number;
  content: string;
  attachments?: number[];
}

export const messagesService = {
  getConversation: async (appointmentId: number) => {
    const response = await api.get<Conversation>(
      `/conversations/appointment/${appointmentId}`
    );
    return response.data;
  },

  getMessages: async (conversationId: number) => {
    const response = await api.get<Message[]>(
      `/conversations/${conversationId}/messages`
    );
    return response.data;
  },

  sendMessage: async (data: SendMessageDto) => {
    const response = await api.post<Message>('/messages', data);
    return response.data;
  },

  translateMessage: async (messageId: number, targetLanguage: string) => {
    const response = await api.post<{ translated: string }>(
      `/messages/${messageId}/translate`,
      { targetLanguage }
    );
    return response.data;
  },

  markAsRead: async (messageId: number) => {
    await api.patch(`/messages/${messageId}/read`);
  },
};
```

### 8. Video Service (LiveKit)

```typescript
// src/services/video.ts
import { api } from './api';

export interface VideoTokenResponse {
  token: string;
  roomName: string;
  participantName: string;
}

export const videoService = {
  getToken: async (appointmentId: number) => {
    const response = await api.get<VideoTokenResponse>(
      `/video/token?appointmentId=${appointmentId}`
    );
    return response.data;
  },

  startRecording: async (appointmentId: number) => {
    const response = await api.post(`/video/${appointmentId}/record/start`);
    return response.data;
  },

  stopRecording: async (appointmentId: number) => {
    const response = await api.post(`/video/${appointmentId}/record/stop`);
    return response.data;
  },
};
```

### 9. Subscriptions Service

```typescript
// src/services/subscriptions.ts
import { api } from './api';
import { Subscription, SubscriptionPlan } from '@/types/subscription';

export const subscriptionsService = {
  getPlans: async () => {
    const response = await api.get<SubscriptionPlan[]>('/subscriptions/plans');
    return response.data;
  },

  getMyPlan: async () => {
    const response = await api.get<Subscription>('/subscriptions/my-plan');
    return response.data;
  },

  subscribe: async (planId: number) => {
    const response = await api.post<Subscription>('/subscriptions/subscribe', {
      planId,
    });
    return response.data;
  },

  cancel: async () => {
    const response = await api.post('/subscriptions/cancel');
    return response.data;
  },

  changePlan: async (newPlanId: number) => {
    const response = await api.post<Subscription>('/subscriptions/change', {
      planId: newPlanId,
    });
    return response.data;
  },
};
```

### 10. Admin Service

```typescript
// src/services/admin.ts
import { api } from './api';

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getUsers: async (params?: {
    role?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  verifyDoctor: async (doctorId: number, status: 'APPROVED' | 'REJECTED', notes?: string) => {
    const response = await api.patch(`/admin/doctors/${doctorId}/verify`, {
      status,
      notes,
    });
    return response.data;
  },

  getPendingDoctors: async () => {
    const response = await api.get('/admin/doctors/pending');
    return response.data;
  },

  deleteUser: async (userId: number) => {
    await api.delete(`/admin/users/${userId}`);
  },

  updateUserRole: async (userId: number, role: string) => {
    const response = await api.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  },
};
```

---

## Custom Hooks

### 1. useAuth Hook

```typescript
// src/hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### 2. useDoctors Hook

```typescript
// src/hooks/useDoctors.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doctorsService, SearchDoctorsParams } from '@/services/doctors';

export function useDoctors(params?: SearchDoctorsParams) {
  return useQuery({
    queryKey: ['doctors', params],
    queryFn: () => doctorsService.search(params || {}),
  });
}

export function useDoctor(id: number) {
  return useQuery({
    queryKey: ['doctor', id],
    queryFn: () => doctorsService.getById(id),
    enabled: !!id,
  });
}

export function useDoctorProfile(id: number) {
  return useQuery({
    queryKey: ['doctorProfile', id],
    queryFn: () => doctorsService.getProfile(id),
    enabled: !!id,
  });
}

export function useUpdateDoctorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: doctorsService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctorProfile'] });
    },
  });
}
```

### 3. useAppointments Hook

```typescript
// src/hooks/useAppointments.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsService } from '@/services/appointments';
import { AppointmentStatus } from '@/types/appointment';
import { toast } from 'sonner';

export function useAppointments(params?: {
  status?: AppointmentStatus;
  userId?: number;
  doctorId?: number;
}) {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: () => appointmentsService.getAll(params),
  });
}

export function useAppointment(id: number) {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: () => appointmentsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: appointmentsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Cita agendada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al agendar cita');
    },
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
      appointmentsService.cancel(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Cita cancelada');
    },
  });
}

export function useConfirmAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: appointmentsService.confirm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Cita confirmada');
    },
  });
}

export function useCompleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) =>
      appointmentsService.complete(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Cita completada');
    },
  });
}
```

### 4. useAvailability Hook

```typescript
// src/hooks/useAvailability.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { availabilityService } from '@/services/availability';
import { toast } from 'sonner';

export function useAvailability(
  doctorId: number,
  startDate?: string,
  endDate?: string
) {
  return useQuery({
    queryKey: ['availability', doctorId, startDate, endDate],
    queryFn: () => availabilityService.getByDoctor(doctorId, startDate, endDate),
    enabled: !!doctorId,
  });
}

export function useCreateAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: availabilityService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      toast.success('Horario creado exitosamente');
    },
  });
}

export function useDeleteAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: availabilityService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      toast.success('Horario eliminado');
    },
  });
}

export function useBulkCreateAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: availabilityService.bulkCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      toast.success('Horarios creados exitosamente');
    },
  });
}
```

### 5. useMedicalRecords Hook

```typescript
// src/hooks/useMedicalRecords.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { medicalRecordsService } from '@/services/medicalRecords';
import { toast } from 'sonner';

export function useMedicalRecords(patientId: number) {
  return useQuery({
    queryKey: ['medicalRecords', patientId],
    queryFn: () => medicalRecordsService.getByPatient(patientId),
    enabled: !!patientId,
  });
}

export function useMedicalRecord(id: number) {
  return useQuery({
    queryKey: ['medicalRecord', id],
    queryFn: () => medicalRecordsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateMedicalRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: medicalRecordsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicalRecords'] });
      toast.success('Registro médico creado');
    },
  });
}

export function useUpdateMedicalRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      medicalRecordsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicalRecords'] });
      toast.success('Registro médico actualizado');
    },
  });
}
```

### 6. useChat Hook

```typescript
// src/hooks/useChat.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { messagesService } from '@/services/messages';

export function useChat(appointmentId: number) {
  const queryClient = useQueryClient();
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('es');

  const { data: conversation } = useQuery({
    queryKey: ['conversation', appointmentId],
    queryFn: () => messagesService.getConversation(appointmentId),
    enabled: !!appointmentId,
  });

  const { data: messages = [], refetch } = useQuery({
    queryKey: ['messages', conversation?.id],
    queryFn: () => messagesService.getMessages(conversation!.id),
    enabled: !!conversation?.id,
    refetchInterval: 3000, // Poll cada 3 segundos
  });

  const sendMessageMutation = useMutation({
    mutationFn: messagesService.sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  const translateMutation = useMutation({
    mutationFn: ({ messageId, lang }: { messageId: number; lang: string }) =>
      messagesService.translateMessage(messageId, lang),
  });

  const sendMessage = async (content: string) => {
    if (!conversation) return;

    await sendMessageMutation.mutateAsync({
      conversationId: conversation.id,
      content,
    });
  };

  return {
    conversation,
    messages,
    sendMessage,
    isLoading: sendMessageMutation.isPending,
    autoTranslate,
    setAutoTranslate,
    targetLanguage,
    setTargetLanguage,
    translateMessage: translateMutation.mutateAsync,
  };
}
```

### 7. useVideoCall Hook

```typescript
// src/hooks/useVideoCall.ts
import { useEffect, useState } from 'react';
import {
  Room,
  RoomEvent,
  RemoteParticipant,
  LocalParticipant,
  Track,
} from 'livekit-client';
import { videoService } from '@/services/video';
import { toast } from 'sonner';

export function useVideoCall(appointmentId: number) {
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState<RemoteParticipant[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let currentRoom: Room | null = null;

    async function connect() {
      setIsConnecting(true);
      setError(null);

      try {
        const { token } = await videoService.getToken(appointmentId);

        const newRoom = new Room({
          adaptiveStream: true,
          dynacast: true,
          videoCaptureDefaults: {
            resolution: {
              width: 1280,
              height: 720,
              frameRate: 30,
            },
          },
        });

        // Event listeners
        newRoom.on(RoomEvent.Connected, () => {
          setIsConnected(true);
          setIsConnecting(false);
          toast.success('Conectado a la videollamada');
        });

        newRoom.on(RoomEvent.ParticipantConnected, (participant) => {
          setParticipants((prev) => [...prev, participant]);
          toast.info(`${participant.identity} se ha unido`);
        });

        newRoom.on(RoomEvent.ParticipantDisconnected, (participant) => {
          setParticipants((prev) =>
            prev.filter((p) => p.identity !== participant.identity)
          );
          toast.info(`${participant.identity} se ha desconectado`);
        });

        newRoom.on(RoomEvent.Disconnected, () => {
          setIsConnected(false);
          toast.info('Desconectado de la videollamada');
        });

        newRoom.on(RoomEvent.Reconnecting, () => {
          toast.warning('Reconectando...');
        });

        newRoom.on(RoomEvent.Reconnected, () => {
          toast.success('Reconectado');
        });

        await newRoom.connect(import.meta.env.VITE_LIVEKIT_URL, token);

        currentRoom = newRoom;
        setRoom(newRoom);

        // Get initial participants
        setParticipants(Array.from(newRoom.remoteParticipants.values()));
      } catch (err: any) {
        console.error('Error connecting to room:', err);
        setError(err.message);
        setIsConnecting(false);
        toast.error('Error al conectar a la videollamada');
      }
    }

    if (appointmentId) {
      connect();
    }

    return () => {
      currentRoom?.disconnect();
    };
  }, [appointmentId]);

  const toggleMic = async () => {
    if (!room?.localParticipant) return;

    const enabled = !isMicOn;
    await room.localParticipant.setMicrophoneEnabled(enabled);
    setIsMicOn(enabled);
    toast.info(enabled ? 'Micrófono activado' : 'Micrófono desactivado');
  };

  const toggleCamera = async () => {
    if (!room?.localParticipant) return;

    const enabled = !isCameraOn;
    await room.localParticipant.setCameraEnabled(enabled);
    setIsCameraOn(enabled);
    toast.info(enabled ? 'Cámara activada' : 'Cámara desactivada');
  };

  const toggleScreenShare = async () => {
    if (!room?.localParticipant) return;

    try {
      if (isScreenSharing) {
        await room.localParticipant.setScreenShareEnabled(false);
        setIsScreenSharing(false);
        toast.info('Compartir pantalla detenido');
      } else {
        await room.localParticipant.setScreenShareEnabled(true);
        setIsScreenSharing(true);
        toast.success('Compartiendo pantalla');
      }
    } catch (err: any) {
      toast.error('Error al compartir pantalla');
    }
  };

  const disconnect = () => {
    room?.disconnect();
    setRoom(null);
    setIsConnected(false);
  };

  return {
    room,
    isConnected,
    isConnecting,
    isMicOn,
    isCameraOn,
    isScreenSharing,
    participants,
    error,
    toggleMic,
    toggleCamera,
    toggleScreenShare,
    disconnect,
  };
}
```

### 8. useDebounce Hook

```typescript
// src/hooks/useDebounce.ts
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

---

## Tipos TypeScript

```typescript
// src/types/user.ts
export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  fullName?: string;
  phone?: string;
  country?: string;
  photo?: string;
  birthDate?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  createdAt: string;
  updatedAt: string;
}
```

```typescript
// src/types/doctor.ts
export interface Doctor {
  id: number;
  userId: number;
  user: User;
  specialtyId: number;
  specialty: Specialty;
  licenseNumber: string;
  experience: number;
  bio?: string;
  rating: number;
  reviewsCount: number;
  consultationsCount: number;
  languages: string[];
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  isAvailable: boolean;
  createdAt: string;
}

export interface DoctorProfile extends Doctor {
  education: Education[];
  certifications: Certification[];
  availability: Availability[];
}

export interface Specialty {
  id: number;
  name: string;
  description?: string;
}
```

```typescript
// src/types/appointment.ts
export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED';

export interface Appointment {
  id: number;
  patientId: number;
  patient: User;
  doctorId: number;
  doctor: Doctor;
  availabilityId: number;
  date: string;
  time: string;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  diagnosis?: string;
  prescriptions?: string;
  createdAt: string;
  updatedAt: string;
}
```

```typescript
// src/types/medicalRecord.ts
export interface MedicalRecord {
  id: number;
  appointmentId: number;
  appointment: Appointment;
  patientId: number;
  patient: User;
  doctorId: number;
  doctor: Doctor;
  diagnosis: string;
  symptoms?: string;
  treatment?: string;
  prescriptions: Prescription[];
  notes?: string;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface Prescription {
  id: number;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface Attachment {
  id: number;
  filename: string;
  url: string;
  type: string;
  size: number;
}
```

---

## Validadores Zod

```typescript
// src/lib/validators.ts
import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'Nombre requerido'),
  lastName: z.string().min(2, 'Apellido requerido'),
  role: z.enum(['PATIENT', 'DOCTOR']),
  phone: z.string().optional(),
  country: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export const appointmentSchema = z.object({
  doctorId: z.number(),
  availabilityId: z.number(),
  reason: z.string().min(10, 'Por favor describe el motivo de la consulta'),
  notes: z.string().optional(),
});

export const medicalRecordSchema = z.object({
  diagnosis: z.string().min(10, 'Diagnóstico requerido'),
  symptoms: z.string().optional(),
  treatment: z.string().optional(),
  prescriptions: z.array(z.object({
    medication: z.string().min(1),
    dosage: z.string().min(1),
    frequency: z.string().min(1),
    duration: z.string().min(1),
  })),
  notes: z.string().optional(),
});

export const doctorProfileSchema = z.object({
  bio: z.string().max(500, 'Máximo 500 caracteres'),
  experience: z.number().min(0).max(50),
  languages: z.array(z.string()).min(1, 'Selecciona al menos un idioma'),
  specialtyId: z.number(),
  licenseNumber: z.string().min(5, 'Número de licencia requerido'),
});
```

---

Este documento proporciona todos los servicios API y hooks necesarios para implementar todas las funcionalidades de la plataforma. Cada servicio está tipado con TypeScript y los hooks utilizan React Query para manejo de estado del servidor.
