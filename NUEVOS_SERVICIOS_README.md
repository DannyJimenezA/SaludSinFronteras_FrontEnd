# Nuevos Servicios Implementados - MediConnect Global

## Resumen

Se han implementado **5 servicios críticos** que faltaban en el frontend, junto con sus tipos TypeScript, hooks de React Query y componentes UI.

---

## 📦 Servicios Implementados

### 1. **Historiales Médicos** (`medical-records`)

**Archivos creados:**
- `src/types/medical-records.ts` - Tipos TypeScript
- `src/services/medical-records.ts` - Servicio API
- `src/hooks/useMedicalRecords.ts` - Hooks React Query
- `src/components/MedicalHistoryNew.tsx` - Componente UI

**Funcionalidades:**
- ✅ Crear historial médico (doctor)
- ✅ Listar historiales de un paciente
- ✅ Obtener mis historiales (paciente)
- ✅ Obtener historial específico
- ✅ Actualizar historial (doctor propietario)
- ✅ Eliminar historial (admin/doctor)

**Seguridad:**
- Los campos `Diagnosis`, `Prescriptions` y `Recommendations` son cifrados con **AES-256** en el backend

**Hooks disponibles:**
```typescript
import {
  useMyMedicalRecords,
  usePatientMedicalRecords,
  useMedicalRecord,
  useCreateMedicalRecord,
  useUpdateMedicalRecord,
  useDeleteMedicalRecord,
} from '../hooks/useMedicalRecords';
```

**Ejemplo de uso:**
```tsx
function MyMedicalRecords() {
  const { data: records, isLoading } = useMyMedicalRecords();
  const createMutation = useCreateMedicalRecord();

  const handleCreate = async () => {
    await createMutation.mutateAsync({
      PatientUserId: '123',
      Diagnosis: 'Hipertensión arterial',
      Prescriptions: 'Losartán 50mg cada 12 horas',
      Recommendations: 'Dieta baja en sodio',
    });
  };

  return <div>{/* UI */}</div>;
}
```

---

### 2. **Verificación de Doctores** (`verification`)

**Archivos creados:**
- `src/types/verification.ts` - Tipos TypeScript
- `src/services/verification.ts` - Servicio API
- `src/hooks/useVerification.ts` - Hooks React Query
- `src/components/DoctorVerification.tsx` - Componente UI

**Funcionalidades:**
- ✅ Enviar documentos de verificación (doctor)
- ✅ Consultar estado de verificación (doctor)
- ✅ Listar verificaciones pendientes (admin)
- ✅ Listar verificaciones aprobadas (admin)
- ✅ Listar verificaciones rechazadas (admin)
- ✅ Consultar verificación específica (admin)
- ✅ Aprobar/rechazar verificación (admin)

**Estados de verificación:**
- `pending` - Pendiente de revisión
- `approved` - Verificado
- `rejected` - Rechazado

**Hooks disponibles:**
```typescript
import {
  useMyVerificationStatus,
  usePendingVerifications,
  useApprovedVerifications,
  useRejectedVerifications,
  useDoctorVerification,
  useSubmitVerification,
  useReviewVerification,
  useApproveVerification,
  useRejectVerification,
} from '../hooks/useVerification';
```

**Ejemplo de uso (Doctor):**
```tsx
function DoctorVerificationPage() {
  const { data: status } = useMyVerificationStatus();
  const submitMutation = useSubmitVerification();

  const handleSubmit = async (documentUrls: string[]) => {
    await submitMutation.mutateAsync({
      CertificationDocuments: documentUrls,
      Notes: 'Licencia médica vigente hasta 2030',
    });
  };

  return <div>{/* UI */}</div>;
}
```

**Ejemplo de uso (Admin):**
```tsx
function AdminVerificationPanel() {
  const { data: pending } = usePendingVerifications();
  const approveMutation = useApproveVerification();

  const handleApprove = async (doctorId: string) => {
    await approveMutation.mutateAsync({
      doctorId,
      adminNotes: 'Documentos verificados correctamente',
    });
  };

  return <div>{/* UI */}</div>;
}
```

---

### 3. **Video Conferencia** (`video`)

**Archivos creados:**
- `src/types/video.ts` - Tipos TypeScript
- `src/services/video.ts` - Servicio API
- `src/hooks/useVideo.ts` - Hooks React Query
- `src/components/VideoCallRoom.tsx` - Componente UI con LiveKit

**Funcionalidades:**
- ✅ Crear/asegurar sala de video para una cita
- ✅ Obtener token de acceso a LiveKit
- ✅ Terminar sala de video
- ✅ Setup completo de videollamada (helper)

**Integración con LiveKit:**
Requiere las siguientes dependencias:
```bash
npm install @livekit/components-react livekit-client
```

**Hooks disponibles:**
```typescript
import {
  useVideoToken,
  useEnsureVideoRoom,
  useEndVideoRoom,
  useSetupVideoCall,
} from '../hooks/useVideo';
```

**Ejemplo de uso:**
```tsx
function VideoCall({ appointmentId }: { appointmentId: string }) {
  const { data: videoSetup, isLoading } = useSetupVideoCall(appointmentId);

  if (isLoading) return <div>Cargando...</div>;

  return (
    <LiveKitRoom
      token={videoSetup.token.token}
      serverUrl={videoSetup.token.url}
      connect={true}
      video={true}
      audio={true}
    >
      <VideoConference />
    </LiveKitRoom>
  );
}
```

---

### 4. **Suscripciones** (`subscriptions`)

**Archivos creados:**
- `src/types/subscriptions.ts` - Tipos TypeScript
- `src/services/subscriptions.ts` - Servicio API
- `src/hooks/useSubscriptions.ts` - Hooks React Query
- `src/components/SubscriptionPlans.tsx` - Componente UI

**Funcionalidades:**
- ✅ Listar planes disponibles
- ✅ Crear suscripción (checkout)
- ✅ Obtener mi suscripción activa
- ✅ Obtener historial de suscripciones
- ✅ Verificar límite de citas
- ✅ Cancelar suscripción
- ✅ Helpers: `canBookAppointment()`, `getAppointmentsRemaining()`

**Hooks disponibles:**
```typescript
import {
  usePlans,
  useMySubscription,
  useSubscriptionHistory,
  useAppointmentLimit,
  useCanBookAppointment,
  useAppointmentsRemaining,
  useCreateSubscription,
  useCancelSubscription,
} from '../hooks/useSubscriptions';
```

**Ejemplo de uso:**
```tsx
function SubscriptionPage() {
  const { data: plans } = usePlans();
  const { data: mySubscription } = useMySubscription();
  const { data: limit } = useAppointmentLimit();
  const createMutation = useCreateSubscription();

  const handleSubscribe = async (planId: string) => {
    await createMutation.mutateAsync({ PlanId: planId });
  };

  return (
    <div>
      <p>Citas usadas: {limit?.currentPeriodUsed}/{limit?.currentPeriodLimit}</p>
      {plans?.map(plan => (
        <div key={plan.PlanId}>
          <h3>{plan.Name}</h3>
          <button onClick={() => handleSubscribe(plan.PlanId)}>
            Suscribirse
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

### 5. **WebSockets** (`websocket`)

**Archivos creados:**
- `src/services/websocket.ts` - Manager de WebSocket
- `src/hooks/useWebSocket.ts` - Hook React personalizado
- `src/components/ChatWithWebSocket.tsx` - Componente de chat en tiempo real

**Funcionalidades:**
- ✅ Conexión/desconexión a WebSocket
- ✅ Unirse/salir de conversaciones
- ✅ Enviar mensajes en tiempo real
- ✅ Recibir mensajes en tiempo real
- ✅ Manejo de errores
- ✅ Reconexión automática

**Eventos soportados:**
- `joinConversation` - Unirse a una conversación
- `sendMessage` - Enviar mensaje
- `newMessage` - Nuevo mensaje recibido
- `messageSent` - Confirmación de mensaje enviado
- `error` - Error en la comunicación

**Dependencias requeridas:**
```bash
npm install socket.io-client
```

**Hook disponible:**
```typescript
import { useWebSocket, useWebSocketConnection } from '../hooks/useWebSocket';
```

**Ejemplo de uso:**
```tsx
function Chat({ conversationId }: { conversationId: string }) {
  const { messages, sendMessage, isConnected } = useWebSocket({
    conversationId,
    autoConnect: true,
    onNewMessage: (message) => {
      console.log('Nuevo mensaje:', message);
    },
  });

  return (
    <div>
      <div>Estado: {isConnected ? 'Conectado' : 'Desconectado'}</div>
      {messages.map(msg => (
        <div key={msg.MessageId}>{msg.Content}</div>
      ))}
      <button onClick={() => sendMessage('Hola')}>Enviar</button>
    </div>
  );
}
```

---

## 🎯 Componentes UI Creados

### 1. `MedicalHistoryNew.tsx`
Componente para visualizar el historial médico del paciente con:
- Búsqueda por diagnóstico o doctor
- Lista de registros médicos
- Detalle de cada consulta
- Indicador de cifrado de datos

### 2. `DoctorVerification.tsx`
Componente para verificación de doctores con:
- Upload de documentos (1-10 archivos)
- Estados: pendiente, aprobado, rechazado
- Notas del doctor
- Feedback del admin
- Razón de rechazo si aplica

### 3. `VideoCallRoom.tsx`
Componente de videollamada con LiveKit con:
- Integración completa con LiveKit
- Video y audio bidireccional
- Botón de finalizar llamada
- Manejo de errores de conexión

### 4. `SubscriptionPlans.tsx`
Componente de planes de suscripción con:
- Grid de planes disponibles
- Plan actual destacado
- Contador de citas usadas
- Botón de suscripción/cancelación
- Features de cada plan

### 5. `ChatWithWebSocket.tsx`
Componente de chat en tiempo real con:
- Mensajes en tiempo real
- Indicador de conexión
- Auto-scroll al último mensaje
- Notificaciones de nuevos mensajes
- Avatares de usuarios

---

## 📋 Validaciones Implementadas

### Validaciones del cliente:
1. **Medical Records:**
   - No permite crear sin paciente ID
   - Valida permisos (solo doctor puede crear)

2. **Verification:**
   - Valida entre 1-10 documentos
   - Requiere razón de rechazo si se rechaza
   - Valida roles (doctor vs admin)

3. **Video:**
   - Valida que la cita exista
   - Maneja errores de conexión a LiveKit
   - Reconexión automática

4. **Subscriptions:**
   - Valida que el plan exista
   - Previene suscripciones duplicadas
   - Valida límite de citas antes de reservar

5. **WebSocket:**
   - Valida autenticación antes de conectar
   - Manejo de desconexión
   - Reconexión automática en 5 intentos

---

## 🔧 Configuración Necesaria

### Variables de Entorno

Actualiza tu archivo `.env`:

```bash
# Backend API
VITE_API_URL=http://localhost:3000
VITE_API_PREFIX=/api  # opcional

# LiveKit (para video conferencia)
VITE_LIVEKIT_URL=wss://livekit.example.com
```

### Dependencias NPM

Instala las dependencias necesarias:

```bash
# Para video conferencia
npm install @livekit/components-react livekit-client

# Para WebSockets
npm install socket.io-client

# Para notificaciones toast (si no está instalado)
npm install sonner
```

---

## 🚀 Uso en Rutas

Actualiza tu archivo de rutas para incluir los nuevos componentes:

```tsx
// src/App.tsx o donde tengas tus rutas

import { MedicalHistoryNew } from './components/MedicalHistoryNew';
import { DoctorVerification } from './components/DoctorVerification';
import { VideoCallRoom } from './components/VideoCallRoom';
import { SubscriptionPlans } from './components/SubscriptionPlans';
import { ChatWithWebSocket } from './components/ChatWithWebSocket';

// En tus rutas:
<Route path="/medical-history" element={<MedicalHistoryNew />} />
<Route path="/verification" element={<DoctorVerification />} />
<Route path="/video-call/:appointmentId" element={<VideoCallRoom />} />
<Route path="/subscription" element={<SubscriptionPlans />} />
<Route path="/chat/:conversationId" element={<ChatWithWebSocket />} />
```

---

## 📝 Siguientes Pasos Recomendados

### Prioridad ALTA:
1. ✅ Instalar dependencias (`@livekit/components-react`, `socket.io-client`)
2. ✅ Configurar variables de entorno (LiveKit URL)
3. ✅ Agregar rutas para los nuevos componentes
4. ✅ Probar cada servicio con el backend real
5. ⚠️ Descomentar funciones de appointments (ver `src/services/appointments.ts` líneas 98-139)

### Prioridad MEDIA:
1. Agregar validaciones de formularios con Zod
2. Implementar manejo de errores global con toast
3. Agregar panel de admin para verificaciones
4. Implementar página de detalle de historial médico
5. Agregar tests unitarios para los servicios

### Prioridad BAJA:
1. Implementar caché optimista con React Query
2. Agregar retry automático con exponential backoff
3. Implementar paginación infinita para historiales
4. Agregar logger centralizado
5. Implementar monitoring de performance

---

## 🐛 Troubleshooting

### Error: "WebSocket not connected"
**Solución:** Asegúrate de que el backend esté corriendo y que la URL en `VITE_API_URL` sea correcta.

### Error: "LiveKit connection failed"
**Solución:** Verifica que el servidor LiveKit esté configurado y que la URL en las variables de entorno sea correcta.

### Error: "Cannot read property 'mutateAsync' of undefined"
**Solución:** Asegúrate de que el componente esté envuelto en `QueryClientProvider` de React Query.

### Error: "No authentication token"
**Solución:** El usuario debe estar autenticado antes de usar WebSocket. Verifica que `getToken()` retorne un token válido.

---

## 📚 Recursos Adicionales

- [Documentación de React Query](https://tanstack.com/query/latest)
- [Documentación de LiveKit](https://docs.livekit.io/)
- [Documentación de Socket.io](https://socket.io/docs/v4/)
- [Documentación del Backend](./DOCUMENTACION_ENDPOINTS_FRONTEND.md)

---

## ✅ Checklist de Implementación

- [x] Tipos TypeScript para todos los servicios
- [x] Servicios API con manejo de errores
- [x] Hooks de React Query con invalidación automática
- [x] Componentes UI con Skeleton loaders
- [x] Manejo de estados de carga
- [x] Manejo de errores con Alerts
- [x] Validaciones del lado del cliente
- [x] Documentación completa
- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] Configuración en producción

---

**Fecha de implementación:** 27 de octubre de 2025
**Desarrollado por:** Claude Code Assistant
**Versión:** 1.0.0
