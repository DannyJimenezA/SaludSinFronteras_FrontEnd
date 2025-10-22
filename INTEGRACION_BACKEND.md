# Integración Frontend-Backend - Salud Sin Fronteras

## Resumen de Cambios

He actualizado **todos los servicios** del frontend para que funcionen correctamente con tu backend NestJS. Ahora puedes usar estos servicios en tus componentes.

---

## Servicios Actualizados

### 1. ✅ Availability (Disponibilidad del Doctor)

**Archivo:** `src/services/availability.ts`

**Endpoints:**
- `GET /doctors/me/availability` - Obtener slots del doctor logueado
- `POST /doctors/me/availability` - Crear nuevo(s) slot(s)

**Funciones disponibles:**
```typescript
import {
  getMyAvailability,
  createAvailabilitySlot,
  createMultipleSlots,
  filterSlotsByDate,
  getAvailableSlots,
  groupSlotsByDate,
} from "@/services/availability";

// Ejemplo: Obtener disponibilidad
const slots = await getMyAvailability();

// Ejemplo: Crear un slot
await createAvailabilitySlot({
  Date: "2025-10-22",
  StartTime: "09:00:00",
  EndTime: "10:00:00",
});

// Ejemplo: Crear múltiples slots
await createMultipleSlots([
  { Date: "2025-10-22", StartTime: "09:00:00", EndTime: "10:00:00" },
  { Date: "2025-10-22", StartTime: "10:00:00", EndTime: "11:00:00" },
  { Date: "2025-10-22", StartTime: "11:00:00", EndTime: "12:00:00" },
]);
```

---

### 2. ✅ Appointments (Citas)

**Archivo:** `src/services/appointments.ts`

**Endpoints:**
- `GET /appointments?patientId=X` - Listar citas
- `POST /appointments` - Crear cita
- `PATCH /appointments/:id/status` - Actualizar estado
- `POST /appointments/:id/notes` - Crear nota médica
- `POST /appointments/:id/video` - Obtener token de video

**Funciones disponibles:**
```typescript
import {
  listAppointments,
  createAppointment,
  confirmAppointment,
  cancelAppointment,
  completeAppointment,
  createAppointmentNote,
  getVideoToken,
} from "@/services/appointments";

// Ejemplo: Listar citas de un paciente
const appointments = await listAppointments({ patientId: 6 });

// Ejemplo: Crear una cita
await createAppointment({
  DoctorUserId: 5,
  SlotId: 123,
  Modality: "online",
  Reason: "Consulta general",
});

// Ejemplo: Confirmar cita
await confirmAppointment(1);

// Ejemplo: Crear nota médica
await createAppointmentNote(1, {
  Content: "Paciente presenta síntomas de...",
});

// Ejemplo: Obtener token para videollamada
const { token, roomName } = await getVideoToken(5);
```

---

### 3. ✅ Conversations (Chat)

**Archivo:** `src/services/conversations.ts`

**Endpoints:**
- `POST /conversations/from-appointment/:id` - Crear conversación
- `GET /conversations/:id/messages` - Obtener mensajes
- `POST /conversations/:id/messages` - Enviar mensaje

**Funciones disponibles:**
```typescript
import {
  createConversationFromAppointment,
  getConversationMessages,
  sendMessage,
  getOrCreateConversation,
} from "@/services/conversations";

// Ejemplo: Crear/obtener conversación desde cita
const conversation = await getOrCreateConversation(appointmentId);

// Ejemplo: Obtener mensajes
const messages = await getConversationMessages(conversation.Id);

// Ejemplo: Enviar mensaje
await sendMessage(conversation.Id, {
  Text: "Hola doctor, tengo una consulta",
  Language: "es",
});
```

---

### 4. ✅ Doctors (Perfiles de Doctores)

**Archivo:** `src/services/doctors.ts`

**Endpoints:**
- `GET /doctors/me/profile` - Obtener perfil del doctor
- `PATCH /doctors/me/profile` - Actualizar perfil

**Funciones disponibles:**
```typescript
import {
  getMyDoctorProfile,
  updateMyDoctorProfile,
} from "@/services/doctors";

// Ejemplo: Obtener perfil
const profile = await getMyDoctorProfile();

// Ejemplo: Actualizar perfil
await updateMyDoctorProfile({
  FullName: "Dr. Juan Pérez",
  Specialty: "Cardiología",
  YearsOfExperience: 10,
  Bio: "Especialista en...",
});
```

---

### 5. ✅ Users (Usuarios/Pacientes)

**Archivo:** `src/services/users.ts`

**Endpoints:**
- `GET /users/me` - Obtener perfil del usuario
- `PATCH /users/me` - Actualizar perfil

**Funciones disponibles:**
```typescript
import { getMe, updateMe } from "@/services/users";

// Ejemplo: Obtener perfil
const user = await getMe();

// Ejemplo: Actualizar perfil
await updateMe({
  fullName: "María García",
  phone: "+52 555 1234 5678",
});
```

---

## Hooks de React Query

He creado hooks personalizados para facilitar el uso en componentes React:

### Hook: `useMyAvailability`

```typescript
import { useMyAvailability, useCreateAvailabilitySlot } from "@/hooks/useAvailability";

function DoctorAvailabilityComponent() {
  const { data: slots, isLoading } = useMyAvailability();
  const createSlot = useCreateAvailabilitySlot();

  const handleCreateSlot = () => {
    createSlot.mutate({
      Date: "2025-10-22",
      StartTime: "09:00:00",
      EndTime: "10:00:00",
    });
  };

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div>
      <h2>Mis Horarios</h2>
      {slots?.map(slot => (
        <div key={slot.Id}>
          {slot.Date} - {slot.StartTime} a {slot.EndTime}
          {slot.IsBooked && <span> (Reservado)</span>}
        </div>
      ))}
      <button onClick={handleCreateSlot}>Agregar Horario</button>
    </div>
  );
}
```

### Hook: `useAppointments`

```typescript
import { useAppointments, useConfirmAppointment } from "@/hooks/useAppointments";
import { useAuth } from "@/contexts/AuthContext";

function AppointmentsListComponent() {
  const { user } = useAuth();
  const { data: appointments, isLoading } = useAppointments({
    patientId: user?.id,
  });
  const confirmMutation = useConfirmAppointment();

  const handleConfirm = (id: number) => {
    confirmMutation.mutate(id);
  };

  if (isLoading) return <div>Cargando citas...</div>;

  return (
    <div>
      {appointments?.map(apt => (
        <div key={apt.Id}>
          <p>Cita con Dr. {apt.Doctor?.FullName}</p>
          <p>Estado: {apt.Status}</p>
          {apt.Status === "PENDING" && (
            <button onClick={() => handleConfirm(apt.Id)}>
              Confirmar Cita
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
```

### Hook: `useChat`

```typescript
import { useChat } from "@/hooks/useConversations";

function ChatComponent({ appointmentId }: { appointmentId: number }) {
  const { conversation, messages, sendMessage, isSending, isLoading } = useChat(appointmentId);
  const [inputText, setInputText] = useState("");

  const handleSend = async () => {
    await sendMessage(inputText, "es");
    setInputText("");
  };

  if (isLoading) return <div>Cargando chat...</div>;

  return (
    <div>
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.Id}>
            <strong>{msg.Sender?.FullName}:</strong> {msg.Text}
            <small>{new Date(msg.CreatedAt).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>

      <div className="input">
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <button onClick={handleSend} disabled={isSending}>
          {isSending ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </div>
  );
}
```

---

## Ejemplos de Uso en Dashboards

### Dashboard del Doctor - Gestionar Disponibilidad

```typescript
// src/components/doctor/DoctorAvailability.tsx
import { useState } from "react";
import { useMyAvailability, useCreateMultipleSlots } from "@/hooks/useAvailability";
import { groupSlotsByDate } from "@/services/availability";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

export function DoctorAvailability() {
  const { data: slots = [], isLoading } = useMyAvailability();
  const createSlots = useCreateMultipleSlots();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Agrupar slots por fecha
  const slotsByDate = groupSlotsByDate(slots);
  const dateKey = selectedDate.toISOString().split("T")[0];
  const slotsForDate = slotsByDate[dateKey] || [];

  const handleCreateSlots = () => {
    // Crear slots de 9am a 5pm cada hora
    const newSlots = [];
    for (let hour = 9; hour < 17; hour++) {
      newSlots.push({
        Date: dateKey,
        StartTime: `${hour.toString().padStart(2, "0")}:00:00`,
        EndTime: `${(hour + 1).toString().padStart(2, "0")}:00:00`,
      });
    }

    createSlots.mutate(newSlots);
  };

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calendario */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Seleccionar Fecha</h2>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
        />
        <Button onClick={handleCreateSlots} className="mt-4 w-full">
          Crear Horarios del Día (9am - 5pm)
        </Button>
      </div>

      {/* Lista de slots */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Horarios para {dateKey}
        </h2>
        {slotsForDate.length === 0 ? (
          <p className="text-muted-foreground">
            No hay horarios para esta fecha
          </p>
        ) : (
          <div className="space-y-2">
            {slotsForDate.map(slot => (
              <div
                key={slot.Id}
                className={`p-3 rounded-lg border ${
                  slot.IsBooked ? "bg-red-50 border-red-300" : "bg-green-50 border-green-300"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {slot.StartTime.slice(0, 5)} - {slot.EndTime.slice(0, 5)}
                  </span>
                  <span className={`text-sm ${slot.IsBooked ? "text-red-600" : "text-green-600"}`}>
                    {slot.IsBooked ? "Reservado" : "Disponible"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

### Dashboard del Paciente - Ver Disponibilidad

```typescript
// src/components/patient/DoctorAvailabilityView.tsx
import { useState } from "react";
import { useCreateAppointment } from "@/hooks/useAppointments";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { getAvailableSlots, groupSlotsByDate, type AvailabilitySlotApi } from "@/services/availability";

export function DoctorAvailabilityView({
  doctorSlots,
  doctorId,
}: {
  doctorSlots: AvailabilitySlotApi[];
  doctorId: number;
}) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const createAppointment = useCreateAppointment();

  // Filtrar solo slots disponibles
  const availableSlots = getAvailableSlots(doctorSlots);
  const slotsByDate = groupSlotsByDate(availableSlots);
  const dateKey = selectedDate.toISOString().split("T")[0];
  const slotsForDate = slotsByDate[dateKey] || [];

  const handleBookAppointment = () => {
    if (!selectedSlotId) return;

    createAppointment.mutate({
      DoctorUserId: doctorId,
      SlotId: selectedSlotId,
      Modality: "online",
      Reason: "Consulta médica",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Selecciona una Fecha</h3>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          disabled={(date) => {
            const key = date.toISOString().split("T")[0];
            return !slotsByDate[key] || slotsByDate[key].length === 0;
          }}
        />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">
          Horarios Disponibles - {dateKey}
        </h3>

        {slotsForDate.length === 0 ? (
          <p className="text-muted-foreground">
            No hay horarios disponibles para esta fecha
          </p>
        ) : (
          <div className="space-y-2">
            {slotsForDate.map(slot => (
              <button
                key={slot.Id}
                onClick={() => setSelectedSlotId(Number(slot.Id))}
                className={`w-full p-3 rounded-lg border text-left transition ${
                  selectedSlotId === Number(slot.Id)
                    ? "border-primary bg-primary/10"
                    : "border-gray-200 hover:border-primary/50"
                }`}
              >
                {slot.StartTime.slice(0, 5)} - {slot.EndTime.slice(0, 5)}
              </button>
            ))}

            <Button
              onClick={handleBookAppointment}
              disabled={!selectedSlotId || createAppointment.isPending}
              className="w-full mt-4"
            >
              {createAppointment.isPending ? "Reservando..." : "Agendar Cita"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## Flujo Completo: Paciente Agenda Cita

1. **Paciente busca doctor** (pendiente implementar endpoint GET /doctors)
2. **Paciente ve disponibilidad del doctor:**
   ```typescript
   const doctorSlots = await getMyAvailability(); // Esto lo llamaría desde el perfil del doctor
   ```
3. **Paciente selecciona un slot y agenda:**
   ```typescript
   await createAppointment({
     DoctorUserId: 5,
     SlotId: 123,
     Modality: "online",
     Reason: "Consulta general",
   });
   ```
4. **Doctor ve la cita pendiente:**
   ```typescript
   const { data: appointments } = useAppointments({ doctorId: myId, status: "PENDING" });
   ```
5. **Doctor confirma la cita:**
   ```typescript
   await confirmAppointment(appointmentId);
   ```
6. **Día de la cita, ambos entran al chat:**
   ```typescript
   const { conversation, messages, sendMessage } = useChat(appointmentId);
   ```
7. **Inician videollamada:**
   ```typescript
   const { token, roomName } = await getVideoToken(appointmentId);
   // Usar token con LiveKit
   ```

---

## Próximos Pasos

### Endpoints que Faltan (para completar la funcionalidad)

1. **GET /doctors** - Búsqueda de doctores (para pacientes)
2. **GET /doctors/:id/availability** - Ver disponibilidad de un doctor específico
3. **DELETE /doctors/me/availability/:id** - Eliminar un slot

### Recomendaciones

1. **Implementar WebSockets** para chat en tiempo real (actualmente usa polling)
2. **Agregar paginación** a listado de citas
3. **Implementar notificaciones** cuando cambia el estado de una cita

---

## Resumen

✅ **Servicios actualizados:** availability, appointments, conversations, doctors, users
✅ **Hooks creados:** useAvailability, useAppointments, useConversations
✅ **Ejemplos de uso** en componentes de dashboard
✅ **Integración completa** con tu backend NestJS

¡Ahora puedes usar estos servicios y hooks en tus componentes React para conectar con el backend!
