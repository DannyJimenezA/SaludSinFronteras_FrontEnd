# Diferencias entre Dashboard del Doctor y Dashboard del Paciente

## ✅ Cambios Aplicados

Se han diferenciado correctamente las rutas y funcionalidades de cada dashboard según el rol del usuario.

---

## 👨‍⚕️ Dashboard del Doctor

### Rutas Actualizadas:

**Antes:**
```typescript
onClick={() => navigate("/appointments")} // ❌ Incorrecto
```

**Ahora:**
```typescript
onClick={() => navigate("/doctor/availability")} // ✅ Correcto
```

### Botones Modificados:

1. **Acciones Rápidas** (línea 139-145):
   - Texto: "Mi Disponibilidad"
   - Ruta: `/doctor/availability`
   - Función: Gestionar horarios de atención

2. **Ver Agenda Completa** (línea 220-226):
   - Texto: "Gestionar Disponibilidad"
   - Ruta: `/doctor/availability`
   - Función: Ir a la vista completa de disponibilidad

### Backend Endpoint Usado:

```
GET {{base_url}}/doctors/me/availability
POST {{base_url}}/doctors/me/availability
```

### Flujo del Doctor:

```
Dashboard del Doctor
    ↓ Click en "Mi Disponibilidad"
    ↓
/doctor/availability (ManageAvailability.tsx)
    ↓
- Ver calendario
- Crear horarios (día/semana)
- Ver slots disponibles vs reservados
```

---

## 👤 Dashboard del Paciente

### Rutas (Sin Cambios):

```typescript
onClick={() => navigate("/appointments")} // ✅ Correcto para pacientes
```

### Botones:

1. **Acciones Rápidas** (línea 304-310):
   - Texto: "Agendar Cita"
   - Ruta: `/appointments`
   - Función: Ver lista de doctores y agendar

2. **Ver Todas las Citas** (línea 378-380):
   - Texto: "Ver Todas las Citas"
   - Ruta: `/appointments`
   - Función: Ver historial de citas

3. **Botón "Agendar" en Médicos Recomendados** (línea 438-448):
   - Selecciona el doctor
   - Navega a `/appointments`
   - Función: Agendar cita con ese doctor

### Backend Endpoints Usados:

```
GET {{base_url}}/appointments?patientId=X
POST {{base_url}}/appointments
GET {{base_url}}/doctors/:id/availability (para ver disponibilidad del doctor)
```

### Flujo del Paciente:

```
Dashboard del Paciente
    ↓ Click en "Agendar Cita"
    ↓
/appointments (AppointmentScheduling.tsx)
    ↓
Selecciona doctor y fecha
    ↓
Ve horarios disponibles
    ↓
Reserva cita
```

**O alternativamente:**

```
Dashboard del Paciente
    ↓ Click en "Agendar" (médico recomendado)
    ↓
/patient/book-appointment/:doctorId (BookAppointment.tsx)
    ↓
- Calendario visual
- Selección de horario
- Confirmar detalles
    ↓
Cita creada
```

---

## 📊 Comparación Lado a Lado

| Característica | Doctor | Paciente |
|---------------|---------|----------|
| **Ruta Principal** | `/doctor/availability` | `/appointments` |
| **Función Principal** | Gestionar disponibilidad | Agendar citas |
| **Acción Rápida** | "Mi Disponibilidad" | "Agendar Cita" |
| **Endpoint Backend** | `/doctors/me/availability` | `/appointments` |
| **Puede crear slots** | ✅ Sí | ❌ No |
| **Puede ver slots disponibles** | ✅ Sí (propios) | ✅ Sí (de doctores) |
| **Puede agendar citas** | ❌ No | ✅ Sí |

---

## 🔄 Flujo Completo del Sistema

### 1. Doctor crea disponibilidad:

```
Doctor Dashboard
    → Click "Mi Disponibilidad"
    → /doctor/availability
    → Selecciona fecha (ej: 25 Oct 2025)
    → Click "Crear Día Completo"
    → POST /doctors/me/availability
    → Se crean 8 slots (9AM-5PM)
    → IsBooked = false
```

### 2. Paciente ve disponibilidad:

```
Patient Dashboard
    → Click "Agendar Cita"
    → /appointments o /patient/book-appointment/:doctorId
    → Selecciona doctor
    → Selecciona fecha (25 Oct 2025)
    → GET /doctors/:id/availability
    → Ve SOLO slots con IsBooked=false
    → Selecciona horario (ej: 10:00-11:00)
```

### 3. Paciente agenda cita:

```
    → Click "Confirmar Cita"
    → POST /appointments
    → Backend marca slot como IsBooked=true
    → Cita creada exitosamente
```

### 4. Doctor ve la cita:

```
Doctor Dashboard
    → Ve en "Citas de Hoy"
    → O va a /doctor/availability
    → Ve el slot marcado como "Reservado" (color naranja/rojo)
    → Puede ver ID de la cita asociada
```

---

## 🎯 Resumen de Cambios

### Archivos Modificados:

1. ✅ **DoctorDashboard.tsx**
   - Línea 139-145: Botón "Mi Disponibilidad" → `/doctor/availability`
   - Línea 220-226: Botón "Gestionar Disponibilidad" → `/doctor/availability`

2. ✅ **PatientDashboard.tsx**
   - Sin cambios (ya estaba correcto)

3. ✅ **ManageAvailability.tsx** (ya existía)
   - Componente para gestionar disponibilidad del doctor
   - Ruta: `/doctor/availability`

4. ✅ **BookAppointment.tsx** (ya existía)
   - Componente para agendar citas del paciente
   - Ruta: `/patient/book-appointment/:doctorId`

5. ✅ **App.tsx** (ya configurado)
   - Ruta `/doctor/availability` protegida para doctores
   - Ruta `/patient/book-appointment/:doctorId` protegida para pacientes

---

## ✅ Verificación

### Para Doctor:
1. Login como doctor
2. Ir al dashboard
3. Click en "Mi Disponibilidad"
4. Debe ir a `/doctor/availability`
5. Debe ver el componente ManageAvailability

### Para Paciente:
1. Login como paciente
2. Ir al dashboard
3. Click en "Agendar Cita"
4. Debe ir a `/appointments`
5. Debe poder seleccionar doctor y agendar

---

## 🔒 Protecciones de Ruta

Ambas rutas están protegidas por rol:

```typescript
// ManageAvailability.tsx (líneas 36-51)
if (currentUser !== "doctor") {
  return <AccessDenied />;
}

// BookAppointment.tsx (líneas 53-68)
if (currentUser !== "patient") {
  return <AccessDenied />;
}
```

¡Todo está correctamente diferenciado! 🎉
