# Diagramas de Flujo - Salud Sin Fronteras

Este documento contiene los diagramas de flujo de los principales procesos de la plataforma.

---

## 1. Flujo de Autenticación

```mermaid
flowchart TD
    A[Inicio] --> B{Usuario autenticado?}
    B -->|No| C[Landing Page]
    C --> D[Click Login/Register]
    D --> E{Qué acción?}

    E -->|Login| F[Formulario Login]
    F --> G[Enviar email + password]
    G --> H{Credenciales válidas?}
    H -->|No| I[Mostrar error]
    I --> F
    H -->|Sí| J[Recibir JWT token]

    E -->|Register| K[Formulario Registro]
    K --> L[Ingresar datos + rol]
    L --> M[Enviar POST /auth/register]
    M --> N{Registro exitoso?}
    N -->|No| O[Mostrar error]
    O --> K
    N -->|Sí| P[Enviar email verificación]
    P --> Q[Redirigir a verify-email]

    J --> R[Guardar token en localStorage]
    R --> S[Fetch perfil usuario GET /users/me]
    S --> T{Cuál es el rol?}

    T -->|PATIENT| U[Redirigir a /patient/dashboard]
    T -->|DOCTOR| V[Redirigir a /doctor/dashboard]
    T -->|ADMIN| W[Redirigir a /admin/dashboard]

    B -->|Sí| T
```

---

## 2. Flujo Paciente: Agendar Cita

```mermaid
flowchart TD
    A[Dashboard Paciente] --> B[Click 'Buscar Doctor']
    B --> C[Vista /patient/doctors]
    C --> D[Aplicar filtros]
    D --> E[Especialidad, país, rating]
    E --> F[GET /doctors?filters]
    F --> G[Mostrar resultados]

    G --> H[Click en doctor]
    H --> I[Vista /patient/doctors/:id]
    I --> J[GET /doctors/:id]
    I --> K[GET /availability?doctorId=:id]

    K --> L[Mostrar calendario]
    L --> M[Seleccionar fecha]
    M --> N{Hay slots disponibles?}
    N -->|No| O[Mostrar mensaje]
    N -->|Sí| P[Mostrar horarios]

    P --> Q[Seleccionar slot]
    Q --> R[Ingresar motivo consulta]
    R --> S[Click Confirmar Cita]

    S --> T[POST /appointments]
    T --> U{Cita creada?}
    U -->|No| V[Mostrar error]
    U -->|Sí| W[Mostrar confirmación]
    W --> X[Enviar notificación al doctor]
    X --> Y[Redirigir a /patient/appointments]
    Y --> Z[Mostrar cita en lista]
```

---

## 3. Flujo Doctor: Confirmar y Atender Cita

```mermaid
flowchart TD
    A[Dashboard Doctor] --> B[Ver citas pendientes]
    B --> C[GET /appointments?status=PENDING&doctorId=:id]
    C --> D[Mostrar lista]

    D --> E[Click en cita]
    E --> F[Vista /doctor/appointments/:id]
    F --> G[GET /appointments/:id]
    G --> H{Estado de la cita?}

    H -->|PENDING| I[Mostrar botones: Confirmar/Rechazar]
    I --> J{Acción?}
    J -->|Confirmar| K[PATCH /appointments/:id/confirm]
    J -->|Rechazar| L[PATCH /appointments/:id/cancel]

    K --> M[Actualizar estado a CONFIRMED]
    M --> N[Enviar notificación al paciente]
    N --> O[Actualizar vista]

    H -->|CONFIRMED| P{Es día de la cita?}
    P -->|No| Q[Mostrar info + fecha]
    P -->|Sí| R[Mostrar botón 'Iniciar Videollamada']

    R --> S[Click Iniciar Videollamada]
    S --> T[GET /video/token?appointmentId=:id]
    T --> U[Conectar a LiveKit]
    U --> V[Vista /doctor/appointments/:id/video]

    V --> W[Realizar consulta]
    W --> X[Finalizar llamada]
    X --> Y[Volver a /doctor/appointments/:id]

    Y --> Z[Completar notas médicas]
    Z --> AA[Ingresar diagnóstico]
    AA --> AB[Agregar prescripciones]
    AB --> AC[POST /medical-records]
    AC --> AD[PATCH /appointments/:id status=COMPLETED]
    AD --> AE[Guardar y finalizar]
```

---

## 4. Flujo de Videollamada

```mermaid
flowchart TD
    A[Usuario en detalle de cita] --> B{Cita confirmada y es hoy?}
    B -->|No| C[Botón deshabilitado]
    B -->|Sí| D[Click 'Entrar a Videollamada']

    D --> E[GET /video/token?appointmentId=:id]
    E --> F[Recibir token LiveKit]
    F --> G[Inicializar Room de LiveKit]
    G --> H[Conectar a servidor WebRTC]

    H --> I{Conexión exitosa?}
    I -->|No| J[Mostrar error reconexión]
    I -->|Sí| K[Vista de videollamada]

    K --> L[Activar micrófono local]
    K --> M[Activar cámara local]
    K --> N[Esperar participante remoto]

    N --> O{Participante conectado?}
    O -->|No| P[Mostrar 'Esperando...']
    O -->|Sí| Q[Mostrar video remoto]

    Q --> R[Interacciones usuario]
    R --> S{Acción?}

    S -->|Toggle Mic| T[room.localParticipant.setMicrophoneEnabled]
    T --> R

    S -->|Toggle Camera| U[room.localParticipant.setCameraEnabled]
    U --> R

    S -->|Screen Share| V[room.localParticipant.setScreenShareEnabled]
    V --> R

    S -->|Colgar| W[room.disconnect]
    W --> X[Finalizar llamada]
    X --> Y[Redirigir a detalle de cita]
    Y --> Z{Es doctor?}
    Z -->|Sí| AA[Completar notas médicas]
    Z -->|No| AB[Ver resumen]
```

---

## 5. Flujo de Chat con Traducción

```mermaid
flowchart TD
    A[Vista de cita] --> B[Click 'Chat']
    B --> C[GET /conversations/appointment/:id]
    C --> D{Conversación existe?}
    D -->|No| E[POST /conversations crear nueva]
    D -->|Sí| F[GET /conversations/:id/messages]

    E --> F
    F --> G[Mostrar lista de mensajes]

    G --> H[Polling cada 3s para nuevos mensajes]
    H --> I[GET /conversations/:id/messages]
    I --> J{Nuevos mensajes?}
    J -->|Sí| K[Actualizar lista]
    J -->|No| H

    G --> L[Usuario escribe mensaje]
    L --> M[Click enviar]
    M --> N[POST /messages]
    N --> O[Mensaje enviado]
    O --> P{Auto-translate activado?}

    P -->|No| Q[Mostrar mensaje original]
    P -->|Sí| R[POST /messages/:id/translate]
    R --> S[Recibir traducción]
    S --> T[Mostrar mensaje traducido]
    T --> U[Mostrar original en pequeño]

    Q --> H
    U --> H

    G --> V[Toggle traducción automática]
    V --> W{Estado?}
    W -->|Activar| X[Traducir todos los mensajes]
    W -->|Desactivar| Y[Mostrar originales]
```

---

## 6. Flujo Admin: Verificar Doctor

```mermaid
flowchart TD
    A[Dashboard Admin] --> B[Ver doctores pendientes]
    B --> C[GET /admin/doctors/pending]
    C --> D[Mostrar lista]

    D --> E[Click en doctor]
    E --> F[Vista /admin/doctors/:id]
    F --> G[GET /doctors/:id]
    G --> H[Mostrar perfil completo]

    H --> I[Ver documentos subidos]
    I --> J[Licencia médica]
    I --> K[Certificados]
    I --> L[Foto de identificación]

    J --> M[Click ver documento]
    K --> M
    L --> M
    M --> N[GET /files/:id]
    N --> O[Abrir en modal/nueva pestaña]

    H --> P[Revisar información]
    P --> Q[Bio, experiencia, especialidad]

    Q --> R{Decisión del admin}
    R -->|Aprobar| S[Escribir notas de verificación]
    R -->|Rechazar| T[Escribir razón del rechazo]
    R -->|Solicitar más info| U[Escribir qué se necesita]

    S --> V[PATCH /admin/doctors/:id/verify status=APPROVED]
    T --> W[PATCH /admin/doctors/:id/verify status=REJECTED]
    U --> X[POST /admin/doctors/:id/request-info]

    V --> Y[Enviar email aprobación]
    W --> Z[Enviar email rechazo]
    X --> AA[Enviar email solicitud]

    Y --> AB[Doctor puede ver pacientes]
    Z --> AC[Doctor no puede operar]
    AA --> AD[Doctor sube más docs]
```

---

## 7. Flujo de Suscripción/Upgrade

```mermaid
flowchart TD
    A[Dashboard Paciente] --> B[Ver plan actual]
    B --> C[GET /subscriptions/my-plan]
    C --> D[Mostrar plan FREE/BASIC/PREMIUM]

    D --> E[Click 'Ver Planes']
    E --> F[Vista /patient/subscriptions]
    F --> G[GET /subscriptions/plans]
    G --> H[Mostrar comparación de planes]

    H --> I{Plan actual}
    I -->|FREE| J[Destacar BASIC y PREMIUM]
    I -->|BASIC| K[Destacar PREMIUM y FREE]
    I -->|PREMIUM| L[Destacar BASIC y FREE]

    J --> M[Click 'Cambiar Plan']
    K --> M
    L --> M

    M --> N[Modal confirmación]
    N --> O{Confirmar?}
    O -->|No| H
    O -->|Sí| P[POST /subscriptions/change planId=:id]

    P --> Q{Upgrade o Downgrade?}
    Q -->|Upgrade| R[Procesar pago simulado]
    Q -->|Downgrade| S[Aplicar inmediatamente]

    R --> T{Pago exitoso?}
    T -->|No| U[Mostrar error]
    T -->|Sí| V[Actualizar plan]

    S --> V
    V --> W[Mostrar confirmación]
    W --> X[Actualizar límites de consultas]
    X --> Y[Enviar email confirmación]
    Y --> Z[Redirigir a dashboard]
```

---

## 8. Arquitectura de Componentes React

```mermaid
graph TD
    A[App.tsx] --> B[AuthProvider]
    B --> C[React Router]

    C --> D[Rutas Públicas]
    C --> E[Rutas Protegidas]

    D --> F[LandingPage]
    D --> G[LoginForm]
    D --> H[RegisterForm]

    E --> I[ProtectedRoute]
    I --> J{Verificar rol}

    J -->|PATIENT| K[Patient Routes]
    J -->|DOCTOR| L[Doctor Routes]
    J -->|ADMIN| M[Admin Routes]

    K --> K1[PatientDashboard]
    K --> K2[DoctorSearch]
    K --> K3[AppointmentsList]
    K --> K4[MedicalRecords]

    L --> L1[DoctorDashboard]
    L --> L2[DoctorAvailability]
    L --> L3[DoctorAppointments]
    L --> L4[PatientRecordView]

    M --> M1[AdminDashboard]
    M --> M2[UserManagement]
    M --> M3[DoctorVerification]
    M --> M4[Analytics]

    K1 --> N[Common Components]
    K2 --> N
    L1 --> N
    M1 --> N

    N --> N1[Navbar]
    N --> N2[Sidebar]
    N --> N3[AppointmentCard]
    N --> N4[DoctorCard]

    K3 --> O[Shared Views]
    L3 --> O

    O --> O1[VideoCallRoom]
    O --> O2[ChatWindow]

    O1 --> P[LiveKit Components]
    P --> P1[VideoRenderer]
    P --> P2[AudioRenderer]
    P --> P3[VideoControls]
```

---

## 9. Flujo de Estado con React Query

```mermaid
flowchart TD
    A[Componente React] --> B{Necesita datos?}
    B -->|Sí| C[useQuery hook]
    B -->|Modificar datos| D[useMutation hook]

    C --> E[React Query Cache]
    E --> F{Datos en cache?}
    F -->|Sí y frescos| G[Retornar desde cache]
    F -->|No o stale| H[Fetch desde API]

    H --> I[Axios request]
    I --> J[Backend NestJS]
    J --> K{Response OK?}
    K -->|Sí| L[Actualizar cache]
    K -->|No| M[Error handling]

    L --> G
    M --> N[Mostrar error al usuario]

    D --> O[Ejecutar mutación]
    O --> P[POST/PATCH/DELETE API]
    P --> J

    K -->|Sí mutation| Q[onSuccess callback]
    Q --> R[Invalidar queries relacionadas]
    R --> S[Re-fetch automático]
    S --> E

    G --> T[Renderizar UI]
    N --> T
```

---

## 10. Sistema de Autenticación y Guards

```mermaid
flowchart TD
    A[Usuario accede a ruta] --> B[React Router]
    B --> C{Ruta protegida?}

    C -->|No| D[Renderizar componente]
    C -->|Sí| E[ProtectedRoute wrapper]

    E --> F[useAuth hook]
    F --> G[AuthContext]
    G --> H{isLoading?}

    H -->|Sí| I[Mostrar loader]
    H -->|No| J{isAuthenticated?}

    J -->|No| K[Redirect a /login]
    J -->|Sí| L{Verificar rol}

    L --> M{Rol permitido?}
    M -->|No| N[Redirect a /unauthorized]
    M -->|Sí| O[Renderizar componente]

    G --> P[localStorage]
    P --> Q{Token existe?}
    Q -->|No| R[user = null]
    Q -->|Sí| S[GET /users/me]

    S --> T{Response OK?}
    T -->|Sí| U[Setear user]
    T -->|No| V[Limpiar token]
    V --> R

    U --> J
    R --> J
```

---

## 11. Flujo de Datos: Crear Registro Médico

```mermaid
sequenceDiagram
    participant D as Doctor
    participant UI as UI Component
    participant H as useMedicalRecords Hook
    participant RQ as React Query
    participant API as Axios/API
    participant BE as Backend

    D->>UI: Completa formulario
    D->>UI: Click "Guardar Registro"
    UI->>UI: Validar con Zod

    alt Validación falla
        UI->>D: Mostrar errores
    else Validación OK
        UI->>H: createMedicalRecord.mutate(data)
        H->>RQ: useMutation
        RQ->>API: POST /medical-records
        API->>BE: Request con JWT

        BE->>BE: Validar token
        BE->>BE: Crear registro en DB
        BE->>API: Response 201

        API->>RQ: Resolve promise
        RQ->>H: onSuccess callback
        H->>RQ: invalidateQueries(['medicalRecords'])
        RQ->>API: Re-fetch GET /medical-records
        API->>BE: Request
        BE->>API: Response con datos actualizados
        API->>RQ: Actualizar cache
        RQ->>UI: Re-render con nuevos datos
        UI->>D: Mostrar toast success
    end
```

---

## 12. Arquitectura de Carpetas

```mermaid
graph TD
    A[src/] --> B[components/]
    A --> C[contexts/]
    A --> D[hooks/]
    A --> E[services/]
    A --> F[types/]
    A --> G[lib/]
    A --> H[locales/]

    B --> B1[ui/]
    B --> B2[common/]
    B --> B3[auth/]
    B --> B4[patient/]
    B --> B5[doctor/]
    B --> B6[admin/]
    B --> B7[video/]
    B --> B8[chat/]

    B1 --> B1A[button.tsx]
    B1 --> B1B[card.tsx]
    B1 --> B1C[dialog.tsx]

    B2 --> B2A[Navbar.tsx]
    B2 --> B2B[Sidebar.tsx]
    B2 --> B2C[DoctorCard.tsx]

    B4 --> B4A[PatientDashboard.tsx]
    B4 --> B4B[DoctorSearch.tsx]
    B4 --> B4C[AppointmentsList.tsx]

    C --> C1[AuthContext.tsx]
    C --> C2[ThemeContext.tsx]
    C --> C3[LanguageContext.tsx]

    D --> D1[useAuth.ts]
    D --> D2[useAppointments.ts]
    D --> D3[useVideoCall.ts]

    E --> E1[api.ts]
    E --> E2[auth.ts]
    E --> E3[appointments.ts]
    E --> E4[doctors.ts]

    F --> F1[user.ts]
    F --> F2[appointment.ts]
    F --> F3[doctor.ts]

    G --> G1[utils.ts]
    G --> G2[validators.ts]
    G --> G3[queryClient.ts]
    G --> G4[i18n.ts]

    H --> H1[es/translation.json]
    H --> H2[en/translation.json]
    H --> H3[fr/translation.json]
```

---

Estos diagramas proporcionan una visualización clara de:
- Flujos de usuario por rol
- Arquitectura de componentes
- Manejo de estado
- Integración con backend
- Sistema de autenticación
- Procesos de negocio clave

Puedes renderizar estos diagramas en GitHub, VS Code con extensiones Mermaid, o en cualquier visualizador compatible.
