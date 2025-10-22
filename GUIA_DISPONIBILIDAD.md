# Guía Completa: Disponibilidad y Agendamiento de Citas

## 📋 Índice

1. [Resumen del Flujo](#resumen-del-flujo)
2. [Paso 1: Doctor Crea Disponibilidad](#paso-1-doctor-crea-disponibilidad)
3. [Paso 2: Paciente Ve Disponibilidad](#paso-2-paciente-ve-disponibilidad)
4. [Paso 3: Paciente Agenda Cita](#paso-3-paciente-agenda-cita)
5. [Requisitos del Backend](#requisitos-del-backend)
6. [Integración en las Rutas](#integración-en-las-rutas)
7. [Solución de Problemas](#solución-de-problemas)

---

## Resumen del Flujo

### 🎯 Objetivo
Permitir que:
1. ✅ **Doctores** creen sus horarios disponibles
2. ✅ **Pacientes** vean SOLO horarios disponibles (no reservados)
3. ✅ **Pacientes** NO ingresen ID manualmente
4. ✅ Sistema evite "Slot already booked" mostrando solo slots libres

### 🔄 Flujo Completo

```
1. DOCTOR → Crea disponibilidad (ej: Lunes 9:00-10:00, 10:00-11:00)
                ↓
2. BACKEND → Guarda slots en DB (IsBooked = false)
                ↓
3. PACIENTE → Ve perfil del doctor
                ↓
4. PACIENTE → Ve calendario con fechas disponibles
                ↓
5. PACIENTE → Selecciona fecha y ve SOLO horarios libres
                ↓
6. PACIENTE → Selecciona horario y agenda
                ↓
7. BACKEND → Marca slot como reservado (IsBooked = true)
                ↓
8. CITA CREADA ✅
```

---

## Paso 1: Doctor Crea Disponibilidad

### Componente: `ManageAvailability.tsx`

**Ubicación:** `src/components/doctor/ManageAvailability.tsx`

### ¿Qué hace?

1. Muestra un calendario
2. Doctor selecciona una fecha
3. Doctor crea horarios con un click
4. Backend guarda los slots

### Ejemplo de Uso:

```typescript
import { ManageAvailability } from "@/components/doctor/ManageAvailability";

// En el dashboard del doctor o en una ruta específica
function DoctorAvailabilityPage() {
  return <ManageAvailability />;
}
```

### Screenshots del Flujo:

**Vista del Doctor:**
```
┌─────────────────────────────────────────────────────┐
│  Gestionar Disponibilidad                           │
├─────────────────────────────────────────────────────┤
│                                                      │
│  📅 Calendario          │  ⏰ Horarios para 22 Oct  │
│  ┌─────────────────┐   │  ┌──────────────────────┐ │
│  │  OCT 2025       │   │  │ ✅ 09:00 - 10:00     │ │
│  │  Lu Ma Mi Ju... │   │  │    Disponible        │ │
│  │   1  2  3  4... │   │  ├──────────────────────┤ │
│  │  ...            │   │  │ ✅ 10:00 - 11:00     │ │
│  │  20 21 [22] 23  │   │  │    Disponible        │ │
│  │  ...            │   │  ├──────────────────────┤ │
│  └─────────────────┘   │  │ 🔴 11:00 - 12:00     │ │
│                         │  │    Reservado (Cita)  │ │
│  [+ Crear Horario]      │  └──────────────────────┘ │
│  (9AM - 5PM)            │                           │
└─────────────────────────┴───────────────────────────┘
```

### Código Interno:

```typescript
// El doctor hace click en "Crear Horario Completo"
const handleCreateDaySchedule = () => {
  const newSlots = [];

  // Crear slots de 9:00 AM a 5:00 PM
  for (let hour = 9; hour < 17; hour++) {
    newSlots.push({
      Date: "2025-10-22",              // Fecha seleccionada
      StartTime: "09:00:00",           // Hora inicio
      EndTime: "10:00:00",             // Hora fin
    });
  }

  // Enviar al backend
  // POST /doctors/me/availability
  createSlots.mutate(newSlots);
};
```

### Respuesta del Backend:

```json
[
  {
    "Id": 1,
    "DoctorUserId": 5,
    "Date": "2025-10-22",
    "StartTime": "09:00:00",
    "EndTime": "10:00:00",
    "IsBooked": false,          // ← IMPORTANTE: No está reservado
    "AppointmentId": null
  },
  {
    "Id": 2,
    "DoctorUserId": 5,
    "Date": "2025-10-22",
    "StartTime": "10:00:00",
    "EndTime": "11:00:00",
    "IsBooked": false,
    "AppointmentId": null
  }
  // ... más slots
]
```

---

## Paso 2: Paciente Ve Disponibilidad

### Componente: `BookAppointment.tsx`

**Ubicación:** `src/components/patient/BookAppointment.tsx`

### ¿Qué hace?

1. Obtiene la disponibilidad del doctor
2. **Filtra SOLO slots disponibles** (`IsBooked = false`)
3. Muestra calendario con fechas que tienen slots libres
4. Paciente NO ve slots ya reservados

### Ejemplo de Uso:

```typescript
import { BookAppointment } from "@/components/patient/BookAppointment";

// En el perfil del doctor o lista de doctores
function DoctorProfilePage() {
  const doctorId = 5; // ID del doctor seleccionado
  const doctorName = "Dr. Juan Pérez";
  const doctorSpecialty = "Cardiología";

  return (
    <BookAppointment
      doctorId={doctorId}
      doctorName={doctorName}
      doctorSpecialty={doctorSpecialty}
    />
  );
}
```

### Código Interno - Filtrado Automático:

```typescript
// 1. Obtener TODOS los slots del doctor
const { data: allSlots = [] } = useDoctorAvailability(doctorId);
// GET /doctors/5/availability

// 2. Filtrar SOLO los disponibles (IsBooked = false)
const availableSlots = getAvailableSlots(allSlots);

// Función helper:
function getAvailableSlots(slots) {
  return slots.filter(slot => !slot.IsBooked);  // ← Magia aquí
}

// 3. Agrupar por fecha
const slotsByDate = groupSlotsByDate(availableSlots);
// {
//   "2025-10-22": [slot1, slot2, slot3],
//   "2025-10-23": [slot4, slot5]
// }
```

### Vista del Paciente:

```
┌───────────────────────────────────────────────────────────┐
│  Agendar Cita con Dr. Juan Pérez - Cardiología           │
├───────────────────────────────────────────────────────────┤
│                                                            │
│  1️⃣ Fecha          2️⃣ Horario              3️⃣ Detalles    │
│  ┌──────────┐    ┌─────────────────┐    ┌─────────────┐  │
│  │ OCT 2025 │    │ 22 de Oct 2025  │    │ Modalidad:  │  │
│  │ [22] 23  │    │                 │    │ ○ Video     │  │
│  │  24  25  │    │ ✅ 09:00-10:00  │    │ ○ Presenc.  │  │
│  │  ...     │    │ ✅ 10:00-11:00  │    │ ○ Teléfono  │  │
│  └──────────┘    │ ✅ 14:00-15:00  │    │             │  │
│                  │ ✅ 15:00-16:00  │    │ Motivo:     │  │
│  Solo fechas     │                 │    │ [________]  │  │
│  con horarios    │ NO muestra      │    │             │  │
│  disponibles     │ 11:00-12:00     │    │ [Confirmar] │  │
│                  │ (ya reservado)  │    └─────────────┘  │
└──────────────────┴─────────────────┴────────────────────┘
```

---

## Paso 3: Paciente Agenda Cita

### Flujo de Agendamiento:

```typescript
// Paciente selecciona un slot
const handleBookAppointment = async () => {
  await createAppointment.mutateAsync({
    DoctorUserId: 5,              // ID del doctor
    SlotId: 123,                  // ID del slot seleccionado
    Modality: "online",           // videollamada, presencial o teléfono
    Reason: "Dolor de pecho"      // Motivo (opcional)
  });

  // POST /appointments
};
```

### Request al Backend:

```json
POST /appointments
{
  "DoctorUserId": 5,
  "SlotId": 123,
  "Modality": "online",
  "Reason": "Dolor de pecho"
}
```

### Respuesta del Backend:

```json
{
  "Id": 456,
  "PatientUserId": 10,
  "DoctorUserId": 5,
  "SlotId": 123,
  "Status": "PENDING",
  "ScheduledAt": "2025-10-22T09:00:00Z",
  "Modality": "online",
  "Reason": "Dolor de pecho"
}
```

### ¿Qué hace el Backend?

```sql
-- 1. Crear la cita
INSERT INTO Appointments (...) VALUES (...);

-- 2. Marcar el slot como reservado
UPDATE AvailabilitySlots
SET IsBooked = true, AppointmentId = 456
WHERE Id = 123;

-- Ahora este slot NO aparecerá para otros pacientes
```

---

## Requisitos del Backend

### Endpoints Necesarios:

#### 1. **GET /doctors/:doctorId/availability**
```typescript
// Debe retornar TODOS los slots del doctor (reservados y disponibles)
// El frontend se encarga de filtrar
[
  {
    "Id": 1,
    "DoctorUserId": 5,
    "Date": "2025-10-22",
    "StartTime": "09:00:00",
    "EndTime": "10:00:00",
    "IsBooked": false,
    "AppointmentId": null
  }
]
```

**📝 Implementación Sugerida en NestJS:**

```typescript
// doctors.controller.ts
@Get(':id/availability')
async getDoctorAvailability(@Param('id') doctorId: string) {
  return this.availabilityService.findByDoctorId(doctorId);
}
```

#### 2. **POST /appointments**
```typescript
// Debe crear la cita Y marcar el slot como reservado
{
  "DoctorUserId": 5,
  "SlotId": 123,
  "Modality": "online",
  "Reason": "Motivo"
}
```

**📝 Implementación Sugerida:**

```typescript
// appointments.service.ts
async create(createDto) {
  // 1. Verificar que el slot existe y NO está reservado
  const slot = await this.availabilityService.findOne(createDto.SlotId);

  if (slot.IsBooked) {
    throw new BadRequestException('Slot already booked');
  }

  // 2. Crear la cita
  const appointment = await this.appointmentsRepository.create({
    ...createDto,
    PatientUserId: currentUser.id,
    ScheduledAt: new Date(slot.Date + 'T' + slot.StartTime),
    Status: 'PENDING'
  });

  // 3. Marcar slot como reservado
  await this.availabilityService.update(createDto.SlotId, {
    IsBooked: true,
    AppointmentId: appointment.Id
  });

  return appointment;
}
```

---

## Integración en las Rutas

### Para el DOCTOR:

```typescript
// src/App.tsx
import { ManageAvailability } from "./components/doctor/ManageAvailability";

<Route
  path="/doctor/availability"
  element={
    <ProtectedRoute isAllowed={currentUser === "doctor"}>
      <ManageAvailability />
    </ProtectedRoute>
  }
/>
```

### Para el PACIENTE:

**Opción 1: Desde lista de doctores**

```typescript
// src/components/patient/DoctorsList.tsx
import { BookAppointment } from "@/components/patient/BookAppointment";

function DoctorsList() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  if (selectedDoctor) {
    return (
      <BookAppointment
        doctorId={selectedDoctor.id}
        doctorName={selectedDoctor.name}
        doctorSpecialty={selectedDoctor.specialty}
      />
    );
  }

  return (
    <div>
      {doctors.map(doctor => (
        <div key={doctor.id}>
          <h3>{doctor.name}</h3>
          <Button onClick={() => setSelectedDoctor(doctor)}>
            Ver Disponibilidad
          </Button>
        </div>
      ))}
    </div>
  );
}
```

**Opción 2: Ruta dedicada**

```typescript
// src/App.tsx
<Route
  path="/patient/book-appointment/:doctorId"
  element={
    <ProtectedRoute isAllowed={currentUser === "patient"}>
      <BookAppointmentPage />
    </ProtectedRoute>
  }
/>

// src/pages/BookAppointmentPage.tsx
import { useParams } from "react-router-dom";
import { BookAppointment } from "@/components/patient/BookAppointment";

function BookAppointmentPage() {
  const { doctorId } = useParams();
  // Obtener info del doctor desde API

  return (
    <BookAppointment
      doctorId={doctorId}
      doctorName="Dr. Juan Pérez"
      doctorSpecialty="Cardiología"
    />
  );
}
```

---

## Solución de Problemas

### ❌ Error: "Slot already booked"

**Causa:** El slot ya fue reservado por otro paciente

**Solución:**
1. ✅ El componente `BookAppointment` filtra automáticamente slots reservados
2. ✅ Usa `getAvailableSlots()` que excluye `IsBooked = true`
3. ✅ El paciente NUNCA verá slots ya reservados

### ❌ Error: "Ingresa un ID de médico"

**Causa:** Componente antiguo que pide ID manual

**Solución:**
- ❌ NO uses componentes que pidan ID manual
- ✅ USA `BookAppointment` con prop `doctorId`

```typescript
// ❌ MAL - Pide ID manual
<input type="number" placeholder="ID del doctor" />

// ✅ BIEN - Recibe doctorId como prop
<BookAppointment doctorId={5} />
```

### ❌ No aparecen fechas en el calendario

**Causa:** Doctor no ha creado disponibilidad

**Pasos:**
1. Doctor debe ir a `/doctor/availability`
2. Seleccionar fecha
3. Click en "Crear Horario Completo (9AM - 5PM)"
4. Ahora el paciente verá esa fecha disponible

### ❌ Backend no tiene endpoint GET /doctors/:id/availability

**Solución:** Agregar en tu backend NestJS:

```typescript
// doctors.controller.ts
@Get(':id/availability')
async getDoctorAvailability(@Param('id') id: string) {
  return this.availabilityService.findByDoctorId(+id);
}
```

---

## Resumen Final

### ✅ Lo que NECESITAS hacer:

1. **Agregar endpoint en backend:**
   - `GET /doctors/:doctorId/availability`

2. **Agregar rutas en frontend:**
   ```typescript
   /doctor/availability → ManageAvailability
   /patient/book/:doctorId → BookAppointment
   ```

3. **Flujo Doctor:**
   - Doctor → Dashboard → "Gestionar Disponibilidad"
   - Selecciona fecha → Click "Crear Horario"
   - ✅ Slots creados

4. **Flujo Paciente:**
   - Paciente → Buscar doctores → Seleccionar doctor
   - Ver disponibilidad (SOLO slots libres)
   - Seleccionar fecha y hora → Confirmar
   - ✅ Cita agendada

### 🎯 Resultado:
- ✅ NO más "Slot already booked"
- ✅ NO más ingresar ID manual
- ✅ Paciente ve SOLO horarios disponibles
- ✅ Sistema funcional y profesional

---

¿Necesitas ayuda con algún paso específico?
