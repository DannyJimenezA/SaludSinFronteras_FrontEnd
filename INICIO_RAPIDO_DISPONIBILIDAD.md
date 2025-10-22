# Inicio Rápido - Sistema de Disponibilidad

## ✅ Sistema Completado

El sistema de disponibilidad y agendamiento ya está integrado en tu aplicación. Aquí está todo lo que necesitas saber:

---

## 📍 Rutas Agregadas

### Para Doctores:
```
/doctor/availability → Gestionar disponibilidad
```

### Para Pacientes:
```
/patient/book-appointment/:doctorId → Agendar cita con un doctor específico
```

---

## 🎯 Cómo Funciona

### 1️⃣ DOCTOR crea su disponibilidad:

```typescript
// El doctor navega a: /doctor/availability

// Ve un calendario y puede:
// - Seleccionar una fecha
// - Click en "Crear Horario Completo (9AM - 5PM)"
// - Se crean automáticamente 8 slots de 1 hora cada uno
```

**Ejemplo visual:**
```
📅 Selecciona: 25 de Octubre, 2025
👇
Click en "Crear Horario Completo"
👇
✅ Se crean estos slots:
  - 09:00 - 10:00 (Disponible)
  - 10:00 - 11:00 (Disponible)
  - 11:00 - 12:00 (Disponible)
  - 12:00 - 13:00 (Disponible)
  - 13:00 - 14:00 (Disponible)
  - 14:00 - 15:00 (Disponible)
  - 15:00 - 16:00 (Disponible)
  - 16:00 - 17:00 (Disponible)
```

### 2️⃣ PACIENTE ve disponibilidad y agenda:

```typescript
// Desde tu lista de doctores, el paciente hace click en un doctor
// Lo rediriges a: /patient/book-appointment/5 (donde 5 = doctorId)

// El paciente ve:
// - Calendario con SOLO fechas que tienen slots disponibles
// - Al seleccionar fecha: SOLO slots libres (NO reservados)
// - Selecciona horario → Confirma → ✅ Cita creada
```

**Ejemplo visual:**
```
📅 Ve calendario:
  ✅ 25 Oct (tiene slots libres)
  ✅ 26 Oct (tiene slots libres)
  ❌ 27 Oct (no tiene slots o todos reservados)

👇 Selecciona: 25 de Octubre

⏰ Ve horarios DISPONIBLES:
  ✅ 09:00 - 10:00 (disponible)
  ✅ 10:00 - 11:00 (disponible)
  ❌ NO ve 11:00 - 12:00 (ya está reservado por otro paciente)
  ✅ 12:00 - 13:00 (disponible)
  ...

👇 Selecciona: 09:00 - 10:00
👇 Elige modalidad: Videollamada
👇 Escribe motivo (opcional): "Dolor de cabeza"
👇 Click "Confirmar Cita"

✅ CITA CREADA
```

---

## 🔗 Integración en tu Código

### Desde Lista de Doctores (Ejemplo):

```typescript
// src/components/patient/DoctorsList.tsx

import { useNavigate } from "react-router-dom";

function DoctorsList() {
  const navigate = useNavigate();

  const doctors = [
    { id: 1, name: "Dr. Juan Pérez", specialty: "Cardiología" },
    { id: 2, name: "Dra. María García", specialty: "Pediatría" },
  ];

  return (
    <div>
      {doctors.map(doctor => (
        <div key={doctor.id}>
          <h3>{doctor.name}</h3>
          <p>{doctor.specialty}</p>

          <Button
            onClick={() => navigate(`/patient/book-appointment/${doctor.id}`)}
          >
            Ver Disponibilidad y Agendar
          </Button>
        </div>
      ))}
    </div>
  );
}
```

### Desde Dashboard del Doctor (Ejemplo):

```typescript
// src/components/DoctorDashboard.tsx

import { useNavigate } from "react-router-dom";

function DoctorDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Dashboard del Doctor</h1>

      <Button onClick={() => navigate("/doctor/availability")}>
        Gestionar mi Disponibilidad
      </Button>
    </div>
  );
}
```

---

## 🛠️ Requisitos del Backend

### ✅ Endpoints que YA tienes:

```
✅ POST /doctors/me/availability     → Crear slots
✅ GET /doctors/me/availability      → Ver mis slots (doctor)
✅ POST /appointments                → Crear cita
```

### ⚠️ Endpoint que NECESITAS agregar:

```typescript
// En tu backend NestJS:

@Get(':id/availability')
async getDoctorAvailability(@Param('id') doctorId: string) {
  // Retornar TODOS los slots del doctor (disponibles Y reservados)
  // El frontend se encarga de filtrar los disponibles
  return this.availabilityService.findByDoctorId(+doctorId);
}
```

**Respuesta esperada:**
```json
[
  {
    "Id": 1,
    "DoctorUserId": 5,
    "Date": "2025-10-25",
    "StartTime": "09:00:00",
    "EndTime": "10:00:00",
    "IsBooked": false,
    "AppointmentId": null
  },
  {
    "Id": 2,
    "DoctorUserId": 5,
    "Date": "2025-10-25",
    "StartTime": "10:00:00",
    "EndTime": "11:00:00",
    "IsBooked": true,
    "AppointmentId": 123
  }
]
```

---

## 🎨 Características del Sistema

### ✅ Para el Doctor:

- ✅ Calendario visual para seleccionar fechas
- ✅ Creación rápida de horarios (1 click = 8 slots)
- ✅ Ve qué slots están disponibles vs reservados
- ✅ Código de colores: Verde = Disponible, Rojo = Reservado
- ✅ Muestra ID de cita en slots reservados

### ✅ Para el Paciente:

- ✅ NO ingresa ID manualmente (se pasa como prop)
- ✅ Ve SOLO fechas con slots disponibles
- ✅ Ve SOLO horarios libres (no reservados)
- ✅ Proceso en 3 pasos: Fecha → Horario → Detalles
- ✅ Selección de modalidad: Videollamada / Presencial / Teléfono
- ✅ Campo opcional para motivo de consulta
- ✅ Resumen visual antes de confirmar

### ✅ Prevención de Errores:

- ✅ NO más error "Slot already booked"
- ✅ Filtrado automático de slots reservados
- ✅ Calendario deshabilita fechas sin disponibilidad
- ✅ Validación automática antes de agendar

---

## 🚀 Cómo Probar

### 1. Como Doctor:

```
1. Login como doctor
2. Ir a: /doctor/availability
3. Seleccionar fecha (ej: mañana)
4. Click "Crear Horario Completo (9AM - 5PM)"
5. ✅ Deberías ver 8 slots verdes (disponibles)
```

### 2. Como Paciente:

```
1. Login como paciente
2. Ir a: /patient/book-appointment/5 (donde 5 = ID del doctor anterior)
3. Ver calendario → fecha resaltada (la que creó el doctor)
4. Seleccionar esa fecha
5. Ver lista de horarios disponibles
6. Seleccionar uno → Elegir modalidad → Confirmar
7. ✅ Cita creada
8. Si el doctor revisa /doctor/availability, verá ese slot en ROJO (reservado)
```

---

## 📚 Archivos Creados/Modificados

### Nuevos Componentes:
- ✅ `src/components/doctor/ManageAvailability.tsx`
- ✅ `src/components/patient/BookAppointment.tsx`
- ✅ `src/pages/BookAppointmentPage.tsx`

### Servicios:
- ✅ `src/services/availability.ts` (actualizado)
- ✅ `src/services/appointments.ts` (actualizado)

### Hooks:
- ✅ `src/hooks/useAvailability.ts` (nuevo)
- ✅ `src/hooks/useAppointments.ts` (nuevo)

### Rutas:
- ✅ `src/App.tsx` (agregadas rutas)

### Documentación:
- ✅ `GUIA_DISPONIBILIDAD.md` (guía completa paso a paso)
- ✅ `INICIO_RAPIDO_DISPONIBILIDAD.md` (este archivo)

---

## 🐛 Solución de Problemas

### ❌ Error: "No hay disponibilidad"
**Causa:** El doctor no ha creado slots
**Solución:** Doctor debe ir a `/doctor/availability` y crear horarios

### ❌ Error: "Cannot find module"
**Causa:** Falta instalar dependencias
**Solución:**
```bash
npm install date-fns
npm install @tanstack/react-query
```

### ❌ Error: 404 en GET /doctors/:id/availability
**Causa:** Falta el endpoint en el backend
**Solución:** Agregar el endpoint en tu NestJS (ver sección "Requisitos del Backend")

### ❌ Las fechas no se resaltan en el calendario
**Causa:** No hay slots disponibles O todos están reservados
**Solución:** Doctor debe crear más slots en otras fechas

---

## 📞 Resumen

**¿Qué tienes ahora?**
✅ Sistema completo de disponibilidad para doctores
✅ Sistema completo de agendamiento para pacientes
✅ Filtrado automático de slots ocupados
✅ UI profesional con calendario interactivo
✅ Integración lista con el backend
✅ Documentación completa

**¿Qué necesitas hacer?**
1. Agregar endpoint: `GET /doctors/:id/availability` en el backend
2. Navegar desde tu lista de doctores a `/patient/book-appointment/:doctorId`
3. Agregar botón en dashboard del doctor que vaya a `/doctor/availability`

**¿Próximos pasos sugeridos?**
- Crear componente de lista de doctores para pacientes
- Agregar filtros de búsqueda por especialidad
- Mostrar foto de perfil del doctor en BookAppointment
- Agregar notificaciones al crear/confirmar citas

---

¡El sistema está listo para usar! 🎉
