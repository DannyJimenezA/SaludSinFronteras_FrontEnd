# Arquitectura Frontend - Salud Sin Fronteras

## Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Estructura de Carpetas](#estructura-de-carpetas)
4. [Sistema de Rutas](#sistema-de-rutas)
5. [Vistas por Rol](#vistas-por-rol)
6. [Componentes Reutilizables](#componentes-reutilizables)
7. [Integración con Backend](#integración-con-backend)
8. [Librerías NPM](#librerías-npm)
9. [Flujos de Usuario](#flujos-de-usuario)

---

## Resumen Ejecutivo

**Salud Sin Fronteras** es una plataforma de telemedicina que conecta pacientes con médicos certificados de todo el mundo, eliminando las barreras de idioma mediante traducción en tiempo real con IA.

### Características Principales

- Autenticación JWT con 3 roles: PATIENT, DOCTOR, ADMIN
- Videollamadas HD/4K con LiveKit
- Chat médico con traducción en tiempo real
- Gestión de citas médicas
- Historial clínico digital
- Sistema de suscripciones (Free, Basic, Premium)
- Soporte multilenguaje (ES, EN, FR, PT)
- Dashboard administrativo con métricas

---

## Stack Tecnológico

### Core
- **React 18.3** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router DOM 7.9** - Navegación SPA

### UI/UX
- **TailwindCSS** - Estilos utility-first
- **Radix UI** - Componentes accesibles headless
- **Lucide React** - Iconos
- **Sonner** - Notificaciones toast
- **SweetAlert2** - Modales/alertas

### Estado y Data Fetching
- **TanStack Query (React Query)** - Cache y sincronización server state
- **Axios** - Cliente HTTP
- **React Hook Form** - Formularios
- **Zod** - Validación de esquemas

### Características Especiales
- **LiveKit Client** - Videollamadas WebRTC
- **react-i18next** - Internacionalización
- **Recharts** - Gráficas y dashboards
- **date-fns** - Manipulación de fechas

---

## Estructura de Carpetas

```
src/
├── components/                 # Componentes de vistas principales
│   ├── ui/                    # Componentes UI base (Radix + Tailwind)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   ├── calendar.tsx
│   │   ├── select.tsx
│   │   └── ...
│   │
│   ├── common/                # Componentes reutilizables específicos
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── UserAvatar.tsx
│   │   ├── AppointmentCard.tsx
│   │   ├── DoctorCard.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── LanguageSelector.tsx
│   │
│   ├── auth/                  # Componentes de autenticación
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── ResetPassword.tsx
│   │   ├── VerifyEmail.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── patient/               # Vistas de paciente
│   │   ├── PatientDashboard.tsx
│   │   ├── DoctorSearch.tsx
│   │   ├── DoctorProfile.tsx
│   │   ├── AppointmentsList.tsx
│   │   ├── AppointmentDetail.tsx
│   │   ├── PatientMedicalRecords.tsx
│   │   ├── PatientProfile.tsx
│   │   ├── SubscriptionPlans.tsx
│   │   └── ChatWithDoctor.tsx
│   │
│   ├── doctor/                # Vistas de doctor
│   │   ├── DoctorDashboard.tsx
│   │   ├── DoctorProfile.tsx
│   │   ├── DoctorAvailability.tsx
│   │   ├── DoctorAppointments.tsx
│   │   ├── AppointmentDetailDoctor.tsx
│   │   ├── PatientRecordView.tsx
│   │   ├── CreateMedicalRecord.tsx
│   │   └── DoctorVerification.tsx
│   │
│   ├── admin/                 # Vistas de admin
│   │   ├── AdminDashboard.tsx
│   │   ├── UserManagement.tsx
│   │   ├── DoctorVerification.tsx
│   │   ├── AppointmentManagement.tsx
│   │   ├── PlanManagement.tsx
│   │   ├── Analytics.tsx
│   │   └── SystemSettings.tsx
│   │
│   ├── video/                 # Videollamadas
│   │   ├── VideoCallRoom.tsx
│   │   ├── VideoControls.tsx
│   │   ├── ParticipantView.tsx
│   │   ├── ScreenShare.tsx
│   │   └── RecordingIndicator.tsx
│   │
│   ├── chat/                  # Sistema de chat
│   │   ├── ChatWindow.tsx
│   │   ├── MessageList.tsx
│   │   ├── MessageInput.tsx
│   │   ├── TranslationToggle.tsx
│   │   └── FileUpload.tsx
│   │
│   ├── LandingPage.tsx        # Landing page pública
│   ├── NotFound.tsx           # Página 404
│   └── Maintenance.tsx        # Página de mantenimiento
│
├── contexts/                  # React Contexts
│   ├── AuthContext.tsx        # Estado de autenticación
│   ├── ThemeContext.tsx       # Tema claro/oscuro
│   ├── LanguageContext.tsx    # i18n
│   └── NotificationContext.tsx # Sistema de notificaciones
│
├── hooks/                     # Custom hooks
│   ├── useAuth.ts             # Hook de autenticación
│   ├── useAppointments.ts     # Gestión de citas
│   ├── useDoctors.ts          # Búsqueda de doctores
│   ├── useChat.ts             # Chat en tiempo real
│   ├── useVideoCall.ts        # LiveKit integration
│   ├── useMedicalRecords.ts   # Historial médico
│   ├── useTranslation.ts      # Traducción de mensajes
│   └── useDebounce.ts         # Utilidad de debounce
│
├── services/                  # Servicios API
│   ├── api.ts                 # Cliente Axios configurado
│   ├── auth.ts                # Endpoints de autenticación
│   ├── users.ts               # Endpoints de usuarios
│   ├── doctors.ts             # Endpoints de doctores
│   ├── appointments.ts        # Endpoints de citas
│   ├── availability.ts        # Disponibilidad de doctores
│   ├── conversations.ts       # Chat/mensajes
│   ├── messages.ts            # Mensajes individuales
│   ├── medicalRecords.ts      # Historial clínico
│   ├── subscriptions.ts       # Planes y suscripciones
│   ├── admin.ts               # Operaciones admin
│   ├── video.ts               # LiveKit tokens
│   ├── files.ts               # Upload de archivos
│   └── translation.ts         # Traducción de texto
│
├── types/                     # TypeScript types
│   ├── user.ts
│   ├── doctor.ts
│   ├── appointment.ts
│   ├── medicalRecord.ts
│   ├── message.ts
│   ├── subscription.ts
│   └── api.ts
│
├── lib/                       # Utilidades
│   ├── utils.ts               # Funciones helper
│   ├── validators.ts          # Validadores Zod
│   ├── constants.ts           # Constantes globales
│   └── formatters.ts          # Formateo de datos
│
├── locales/                   # Traducciones i18n
│   ├── en/
│   │   └── translation.json
│   ├── es/
│   │   └── translation.json
│   ├── fr/
│   │   └── translation.json
│   └── pt/
│       └── translation.json
│
├── assets/                    # Assets estáticos
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── App.tsx                    # Componente principal
├── main.tsx                   # Entry point
└── index.css                  # Estilos globales + Tailwind
```

---

## Sistema de Rutas

### Rutas Públicas (no requieren autenticación)

```typescript
/ (landing)                    → LandingPage
/login                         → WelcomeLogin
/register                      → RegisterForm
/forgot-password               → ForgotPassword
/reset-password                → ResetPassword
/verify-email                  → VerifyEmail
```

### Rutas Protegidas - PATIENT

```typescript
/patient/dashboard             → PatientDashboard
/patient/profile               → PatientProfile
/patient/doctors               → DoctorSearch
/patient/doctors/:id           → DoctorProfile
/patient/appointments          → AppointmentsList
/patient/appointments/:id      → AppointmentDetail
/patient/appointments/:id/chat → ChatWithDoctor
/patient/appointments/:id/video → VideoCallRoom
/patient/medical-records       → PatientMedicalRecords
/patient/subscriptions         → SubscriptionPlans
```

### Rutas Protegidas - DOCTOR

```typescript
/doctor/dashboard              → DoctorDashboard
/doctor/profile                → DoctorProfile
/doctor/verification           → DoctorVerification
/doctor/availability           → DoctorAvailability
/doctor/appointments           → DoctorAppointments
/doctor/appointments/:id       → AppointmentDetailDoctor
/doctor/appointments/:id/chat  → ChatWithDoctor
/doctor/appointments/:id/video → VideoCallRoom
/doctor/patients/:id/records   → PatientRecordView
```

### Rutas Protegidas - ADMIN

```typescript
/admin/dashboard               → AdminDashboard
/admin/users                   → UserManagement
/admin/doctors                 → DoctorVerification
/admin/appointments            → AppointmentManagement
/admin/plans                   → PlanManagement
/admin/analytics               → Analytics
/admin/settings                → SystemSettings
```

### Rutas Compartidas (cualquier usuario autenticado)

```typescript
/settings                      → Settings
/notifications                 → Notifications
```

---

## Vistas por Rol

### PATIENT - Vistas Detalladas

#### 1. `/patient/dashboard` - Dashboard Principal
**Propósito:** Vista resumen de actividad del paciente

**Componentes:**
- Próximas citas (cards con countdown)
- Doctores favoritos
- Plan de suscripción actual
- Accesos rápidos (agendar cita, ver historial)
- Notificaciones recientes

**Endpoints:**
- `GET /appointments?status=CONFIRMED&userId={id}`
- `GET /users/me`
- `GET /subscriptions/my-plan`

**Ejemplo JSX:**
```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Columna principal */}
  <div className="lg:col-span-2 space-y-6">
    {/* Próximas citas */}
    <Card>
      <CardHeader>
        <CardTitle>Próximas Consultas</CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.map(apt => (
          <AppointmentCard key={apt.id} appointment={apt} />
        ))}
      </CardContent>
    </Card>
  </div>

  {/* Sidebar */}
  <div className="space-y-6">
    {/* Plan actual */}
    <SubscriptionCard plan={currentPlan} />

    {/* Acciones rápidas */}
    <QuickActions />
  </div>
</div>
```

---

#### 2. `/patient/doctors` - Búsqueda de Doctores
**Propósito:** Buscar y filtrar doctores disponibles

**Componentes:**
- Barra de búsqueda con filtros (especialidad, país, idioma)
- Grid de tarjetas de doctores
- Paginación
- Filtros laterales (disponibilidad, rating, experiencia)

**Endpoints:**
- `GET /doctors?specialty={}&country={}&page={}`
- `GET /specialties`
- `GET /countries`

**Ejemplo JSX:**
```tsx
<div className="flex gap-6">
  {/* Filtros laterales */}
  <aside className="w-64 space-y-4">
    <Input
      placeholder="Buscar por nombre..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    <Select onValueChange={setSpecialty}>
      <SelectTrigger>
        <SelectValue placeholder="Especialidad" />
      </SelectTrigger>
      <SelectContent>
        {specialties.map(s => (
          <SelectItem key={s.id} value={s.id}>
            {s.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </aside>

  {/* Grid de doctores */}
  <div className="flex-1">
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {doctors.map(doctor => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  </div>
</div>
```

---

#### 3. `/patient/doctors/:id` - Perfil del Doctor
**Propósito:** Ver detalles del doctor y su disponibilidad para agendar cita

**Componentes:**
- Foto, nombre, especialidad, rating
- Bio y experiencia
- Idiomas que habla
- Calendario de disponibilidad (slots)
- Botón "Agendar Cita"
- Reviews de pacientes

**Endpoints:**
- `GET /doctors/{id}`
- `GET /doctors/{id}/availability`
- `POST /appointments` (al confirmar)

**Ejemplo JSX:**
```tsx
<div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
  {/* Info del doctor */}
  <Card className="lg:col-span-1">
    <CardContent className="p-6 space-y-4">
      <Avatar className="w-32 h-32 mx-auto">
        <AvatarImage src={doctor.photo} />
        <AvatarFallback>{doctor.initials}</AvatarFallback>
      </Avatar>

      <div className="text-center">
        <h2 className="text-2xl font-bold">{doctor.name}</h2>
        <p className="text-muted-foreground">{doctor.specialty}</p>
        <div className="flex items-center justify-center gap-1 mt-2">
          <Star className="fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">{doctor.rating}</span>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-4 w-4" />
          <span>{doctor.experience} años de experiencia</span>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span>{doctor.country}</span>
        </div>
      </div>
    </CardContent>
  </Card>

  {/* Calendario y booking */}
  <Card className="lg:col-span-2">
    <CardHeader>
      <CardTitle>Disponibilidad</CardTitle>
    </CardHeader>
    <CardContent>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        disabled={(date) => !hasAvailability(date)}
      />

      {selectedDate && (
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Horarios disponibles</h3>
          <div className="grid grid-cols-3 gap-2">
            {slots.map(slot => (
              <Button
                key={slot.id}
                variant={selectedSlot === slot.id ? "default" : "outline"}
                onClick={() => setSelectedSlot(slot.id)}
              >
                {slot.time}
              </Button>
            ))}
          </div>
        </div>
      )}

      <Button
        className="w-full mt-6"
        size="lg"
        disabled={!selectedSlot}
        onClick={handleBookAppointment}
      >
        Confirmar Cita
      </Button>
    </CardContent>
  </Card>
</div>
```

---

#### 4. `/patient/appointments` - Lista de Citas
**Propósito:** Ver todas las citas (pendientes, confirmadas, completadas, canceladas)

**Componentes:**
- Tabs por estado (Próximas, Pasadas, Canceladas)
- Cards de citas con info del doctor
- Acciones: Entrar a videollamada, Chat, Cancelar, Ver detalles

**Endpoints:**
- `GET /appointments?status={status}`
- `PATCH /appointments/{id}/cancel`

**Ejemplo JSX:**
```tsx
<Tabs defaultValue="upcoming" className="w-full">
  <TabsList className="grid w-full grid-cols-3">
    <TabsTrigger value="upcoming">Próximas</TabsTrigger>
    <TabsTrigger value="completed">Completadas</TabsTrigger>
    <TabsTrigger value="cancelled">Canceladas</TabsTrigger>
  </TabsList>

  <TabsContent value="upcoming" className="space-y-4">
    {upcomingAppointments.map(apt => (
      <Card key={apt.id}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={apt.doctor.photo} />
              </Avatar>
              <div>
                <h3 className="font-semibold">{apt.doctor.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {apt.doctor.specialty}
                </p>
                <p className="text-sm">
                  {format(apt.date, 'PPP')} - {apt.time}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {apt.status === 'CONFIRMED' && isToday(apt.date) && (
                <Button onClick={() => navigate(`/patient/appointments/${apt.id}/video`)}>
                  <Video className="mr-2 h-4 w-4" />
                  Entrar
                </Button>
              )}
              <Button variant="outline" onClick={() => navigate(`/patient/appointments/${apt.id}/chat`)}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat
              </Button>
              <Button variant="ghost" onClick={() => handleCancel(apt.id)}>
                Cancelar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </TabsContent>
</Tabs>
```

---

#### 5. `/patient/appointments/:id/chat` - Chat con Doctor
**Propósito:** Conversación en tiempo real con traducción automática

**Componentes:**
- Lista de mensajes
- Input de mensaje
- Toggle de traducción automática
- Selector de idioma
- Estado "escribiendo..."
- Upload de archivos

**Endpoints:**
- `GET /conversations/{appointmentId}/messages`
- `POST /messages`
- `POST /messages/translate`
- WebSocket para tiempo real (opcional)

**Ejemplo JSX:**
```tsx
<div className="flex flex-col h-[calc(100vh-4rem)]">
  {/* Header */}
  <div className="border-b p-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={doctor.photo} />
      </Avatar>
      <div>
        <h2 className="font-semibold">{doctor.name}</h2>
        <p className="text-sm text-muted-foreground">
          {isTyping ? 'Escribiendo...' : 'En línea'}
        </p>
      </div>
    </div>

    <div className="flex items-center gap-2">
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="es">Español</SelectItem>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="fr">Français</SelectItem>
        </SelectContent>
      </Select>

      <Switch
        checked={autoTranslate}
        onCheckedChange={setAutoTranslate}
      />
      <span className="text-sm">Auto-traducir</span>
    </div>
  </div>

  {/* Messages */}
  <ScrollArea className="flex-1 p-4">
    <div className="space-y-4">
      {messages.map(msg => (
        <div
          key={msg.id}
          className={cn(
            "flex gap-3",
            msg.senderId === currentUser.id ? "justify-end" : "justify-start"
          )}
        >
          {msg.senderId !== currentUser.id && (
            <Avatar className="h-8 w-8">
              <AvatarImage src={doctor.photo} />
            </Avatar>
          )}

          <div
            className={cn(
              "max-w-[70%] rounded-lg p-3",
              msg.senderId === currentUser.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            <p>{autoTranslate ? msg.translatedText : msg.originalText}</p>
            {autoTranslate && msg.originalText !== msg.translatedText && (
              <p className="text-xs opacity-70 mt-1">
                Original: {msg.originalText}
              </p>
            )}
            <span className="text-xs opacity-70">
              {format(msg.createdAt, 'HH:mm')}
            </span>
          </div>
        </div>
      ))}
    </div>
  </ScrollArea>

  {/* Input */}
  <div className="border-t p-4">
    <div className="flex gap-2">
      <Button variant="outline" size="icon">
        <Paperclip className="h-4 w-4" />
      </Button>

      <Input
        placeholder="Escribe un mensaje..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
      />

      <Button onClick={handleSend}>
        <Send className="h-4 w-4" />
      </Button>
    </div>
  </div>
</div>
```

---

#### 6. `/patient/appointments/:id/video` - Videollamada
**Propósito:** Consulta médica por videollamada con LiveKit

**Componentes:**
- Video principal (doctor)
- Video secundario (paciente)
- Controles (mic, cámara, screen share, colgar)
- Chat lateral
- Indicador de calidad de conexión
- Indicador de grabación (si aplica)

**Endpoints:**
- `GET /video/token?appointmentId={id}&role=patient`
- LiveKit SDK maneja la conexión WebRTC

**Ejemplo JSX:**
```tsx
<div className="relative h-screen bg-black">
  {/* Video principal (doctor) */}
  <div className="absolute inset-0">
    <VideoRenderer
      track={remoteVideoTrack}
      className="w-full h-full object-cover"
    />
  </div>

  {/* Video secundario (yo) */}
  <div className="absolute bottom-20 right-4 w-64 h-48 rounded-lg overflow-hidden shadow-lg">
    <VideoRenderer
      track={localVideoTrack}
      className="w-full h-full object-cover mirror"
    />
  </div>

  {/* Controles */}
  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
    <div className="flex items-center justify-center gap-4">
      <Button
        variant={isMicOn ? "default" : "destructive"}
        size="icon"
        className="rounded-full h-12 w-12"
        onClick={toggleMic}
      >
        {isMicOn ? <Mic /> : <MicOff />}
      </Button>

      <Button
        variant={isCameraOn ? "default" : "destructive"}
        size="icon"
        className="rounded-full h-12 w-12"
        onClick={toggleCamera}
      >
        {isCameraOn ? <Video /> : <VideoOff />}
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="rounded-full h-12 w-12"
        onClick={toggleScreenShare}
      >
        <Monitor />
      </Button>

      <Button
        variant="destructive"
        size="icon"
        className="rounded-full h-14 w-14"
        onClick={handleEndCall}
      >
        <PhoneOff />
      </Button>
    </div>
  </div>

  {/* Info overlay */}
  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3">
    <div className="flex items-center gap-2 text-white">
      <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
      <span className="text-sm">En llamada con {doctor.name}</span>
    </div>
    <p className="text-xs text-gray-300 mt-1">
      {formatDuration(callDuration)}
    </p>
  </div>

  {/* Chat lateral (opcional) */}
  {showChat && (
    <div className="absolute top-0 right-0 w-96 h-full bg-background shadow-xl">
      <ChatWindow appointmentId={appointmentId} compact />
    </div>
  )}
</div>
```

---

#### 7. `/patient/medical-records` - Historial Clínico
**Propósito:** Ver todo el historial médico del paciente

**Componentes:**
- Timeline de consultas
- Diagnósticos por cita
- Prescripciones
- Archivos adjuntos (estudios, análisis)
- Filtros por fecha/doctor

**Endpoints:**
- `GET /medical-records?patientId={id}`
- `GET /medical-records/{id}/attachments`

**Ejemplo JSX:**
```tsx
<div className="max-w-6xl mx-auto space-y-6">
  <Card>
    <CardHeader>
      <CardTitle>Mi Historial Médico</CardTitle>
      <CardDescription>
        Todos tus registros médicos en un solo lugar
      </CardDescription>
    </CardHeader>
  </Card>

  {/* Timeline */}
  <div className="relative space-y-8">
    {/* Línea vertical */}
    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

    {records.map((record, index) => (
      <div key={record.id} className="relative pl-20">
        {/* Dot en la línea */}
        <div className="absolute left-6 w-4 h-4 rounded-full bg-primary border-4 border-background" />

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">
                  Consulta con {record.doctor.name}
                </CardTitle>
                <CardDescription>
                  {format(record.date, 'PPP')} - {record.doctor.specialty}
                </CardDescription>
              </div>
              <Badge>{record.appointmentStatus}</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Diagnóstico */}
            {record.diagnosis && (
              <div>
                <h4 className="font-semibold mb-2">Diagnóstico</h4>
                <p className="text-sm text-muted-foreground">
                  {record.diagnosis}
                </p>
              </div>
            )}

            {/* Prescripciones */}
            {record.prescriptions.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Prescripciones</h4>
                <div className="space-y-2">
                  {record.prescriptions.map(presc => (
                    <div
                      key={presc.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{presc.medication}</p>
                        <p className="text-sm text-muted-foreground">
                          {presc.dosage} - {presc.frequency}
                        </p>
                      </div>
                      <Badge variant="outline">{presc.duration}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notas */}
            {record.notes && (
              <div>
                <h4 className="font-semibold mb-2">Notas del médico</h4>
                <p className="text-sm text-muted-foreground">
                  {record.notes}
                </p>
              </div>
            )}

            {/* Archivos adjuntos */}
            {record.attachments.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Archivos adjuntos</h4>
                <div className="flex gap-2">
                  {record.attachments.map(file => (
                    <Button
                      key={file.id}
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(file.url)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      {file.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    ))}
  </div>
</div>
```

---

#### 8. `/patient/subscriptions` - Planes de Suscripción
**Propósito:** Ver plan actual y opciones de upgrade

**Componentes:**
- Plan actual con features
- Comparación de planes (Free, Basic, Premium)
- Botón de upgrade/downgrade
- Historial de pagos

**Endpoints:**
- `GET /subscriptions/my-plan`
- `GET /subscriptions/plans`
- `POST /subscriptions/upgrade`

**Ejemplo JSX:**
```tsx
<div className="max-w-6xl mx-auto space-y-8">
  {/* Plan actual */}
  <Card className="border-primary">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle>Tu Plan Actual: {currentPlan.name}</CardTitle>
          <CardDescription>
            Activo desde {format(currentPlan.startDate, 'PPP')}
          </CardDescription>
        </div>
        <Badge className="text-lg px-4 py-2">
          {currentPlan.price}/mes
        </Badge>
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-3xl font-bold">{currentPlan.consultationsUsed}</p>
          <p className="text-sm text-muted-foreground">
            de {currentPlan.consultationsLimit} consultas
          </p>
        </div>
        {/* Más métricas... */}
      </div>
    </CardContent>
  </Card>

  {/* Comparación de planes */}
  <div>
    <h2 className="text-2xl font-bold mb-6">Todos los Planes</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map(plan => (
        <Card
          key={plan.id}
          className={cn(
            "relative",
            plan.id === currentPlan.id && "border-primary border-2"
          )}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge>Más Popular</Badge>
            </div>
          )}

          <CardHeader className="text-center">
            <CardTitle>{plan.name}</CardTitle>
            <div className="mt-4">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground">/mes</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className="w-full"
              variant={plan.id === currentPlan.id ? "outline" : "default"}
              disabled={plan.id === currentPlan.id}
              onClick={() => handleChangePlan(plan.id)}
            >
              {plan.id === currentPlan.id ? "Plan Actual" : "Cambiar Plan"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</div>
```

---

### DOCTOR - Vistas Detalladas

#### 9. `/doctor/dashboard` - Dashboard del Doctor
**Propósito:** Vista general de actividad del doctor

**Componentes:**
- Citas del día
- Próximas citas de la semana
- Pacientes recientes
- Estadísticas (total consultas, rating, ingresos)
- Calendario mensual

**Endpoints:**
- `GET /appointments?doctorId={id}&date={today}`
- `GET /appointments?doctorId={id}&status=CONFIRMED`
- `GET /doctors/{id}/stats`

**Ejemplo JSX:**
```tsx
<div className="space-y-6">
  {/* Stats cards */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Consultas Hoy
        </CardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.todayAppointments}</div>
        <p className="text-xs text-muted-foreground">
          {stats.completedToday} completadas
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Rating Promedio
        </CardTitle>
        <Star className="h-4 w-4 text-yellow-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.avgRating}</div>
        <p className="text-xs text-muted-foreground">
          {stats.totalReviews} reseñas
        </p>
      </CardContent>
    </Card>

    {/* Más stats... */}
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Citas de hoy */}
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Agenda de Hoy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {todayAppointments.map(apt => (
            <div
              key={apt.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
              onClick={() => navigate(`/doctor/appointments/${apt.id}`)}
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={apt.patient.photo} />
                  <AvatarFallback>{apt.patient.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{apt.patient.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {apt.time}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge>{apt.status}</Badge>
                {apt.status === 'CONFIRMED' && isNow(apt.time) && (
                  <Button size="sm">
                    <Video className="mr-2 h-4 w-4" />
                    Iniciar
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Calendario mensual */}
    <Card>
      <CardHeader>
        <CardTitle>Calendario</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
        />
      </CardContent>
    </Card>
  </div>
</div>
```

---

#### 10. `/doctor/availability` - Gestión de Disponibilidad
**Propósito:** Crear y administrar horarios disponibles (slots)

**Componentes:**
- Calendario semanal
- Modal para crear slots
- Lista de slots existentes
- Bloquear/desbloquear días

**Endpoints:**
- `GET /availability?doctorId={id}`
- `POST /availability`
- `DELETE /availability/{id}`

**Ejemplo JSX:**
```tsx
<div className="space-y-6">
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle>Mi Disponibilidad</CardTitle>
          <CardDescription>
            Gestiona tus horarios disponibles para consultas
          </CardDescription>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Horario
        </Button>
      </div>
    </CardHeader>
  </Card>

  {/* Vista semanal */}
  <div className="grid grid-cols-7 gap-4">
    {daysOfWeek.map(day => (
      <Card key={day.value}>
        <CardHeader className="p-4">
          <CardTitle className="text-sm text-center">{day.label}</CardTitle>
          <p className="text-xs text-center text-muted-foreground">
            {format(day.date, 'dd MMM')}
          </p>
        </CardHeader>
        <CardContent className="p-2 space-y-2">
          {slots
            .filter(s => isSameDay(s.date, day.date))
            .map(slot => (
              <div
                key={slot.id}
                className="p-2 bg-primary/10 rounded text-xs text-center relative group"
              >
                <p className="font-medium">{slot.startTime}</p>
                <p className="text-muted-foreground">{slot.endTime}</p>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100"
                  onClick={() => handleDeleteSlot(slot.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
        </CardContent>
      </Card>
    ))}
  </div>

  {/* Modal crear slot */}
  <Dialog open={showModal} onOpenChange={setShowModal}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Agregar Horario Disponible</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleCreateSlot} className="space-y-4">
        <div>
          <Label>Fecha</Label>
          <Calendar
            mode="single"
            selected={newSlot.date}
            onSelect={(date) => setNewSlot({ ...newSlot, date })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Hora inicio</Label>
            <Input
              type="time"
              value={newSlot.startTime}
              onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
            />
          </div>
          <div>
            <Label>Hora fin</Label>
            <Input
              type="time"
              value={newSlot.endTime}
              onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label>Repetir</Label>
          <Select
            value={newSlot.repeat}
            onValueChange={(v) => setNewSlot({ ...newSlot, repeat: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No repetir</SelectItem>
              <SelectItem value="daily">Todos los días</SelectItem>
              <SelectItem value="weekly">Todas las semanas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button type="submit">Guardar</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</div>
```

---

#### 11. `/doctor/appointments/:id` - Detalle de Cita (Doctor)
**Propósito:** Ver detalles de la cita y acciones del doctor

**Componentes:**
- Info del paciente
- Estado de la cita
- Botones: Confirmar, Cancelar, Iniciar videollamada
- Notas médicas (crear/editar)
- Historial médico del paciente
- Formulario para diagnóstico y prescripción

**Endpoints:**
- `GET /appointments/{id}`
- `PATCH /appointments/{id}` (confirmar/cancelar)
- `GET /medical-records?patientId={id}`
- `POST /medical-records` (crear después de la consulta)

**Ejemplo JSX:**
```tsx
<div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Info de la cita */}
  <Card className="lg:col-span-2 space-y-6">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>Detalles de la Consulta</CardTitle>
        <Badge>{appointment.status}</Badge>
      </div>
    </CardHeader>

    <CardContent className="space-y-6">
      {/* Info del paciente */}
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={appointment.patient.photo} />
          <AvatarFallback>{appointment.patient.initials}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-lg">{appointment.patient.name}</h3>
          <p className="text-sm text-muted-foreground">
            {appointment.patient.age} años - {appointment.patient.gender}
          </p>
          <p className="text-sm text-muted-foreground">
            {format(appointment.date, 'PPP')} - {appointment.time}
          </p>
        </div>
      </div>

      <Separator />

      {/* Acciones */}
      <div className="flex gap-2">
        {appointment.status === 'PENDING' && (
          <>
            <Button onClick={handleConfirm}>
              <Check className="mr-2 h-4 w-4" />
              Confirmar Cita
            </Button>
            <Button variant="outline" onClick={handleReject}>
              Rechazar
            </Button>
          </>
        )}

        {appointment.status === 'CONFIRMED' && isToday(appointment.date) && (
          <Button onClick={() => navigate(`/doctor/appointments/${appointment.id}/video`)}>
            <Video className="mr-2 h-4 w-4" />
            Iniciar Videollamada
          </Button>
        )}

        <Button variant="outline" onClick={() => navigate(`/doctor/appointments/${appointment.id}/chat`)}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Chat
        </Button>
      </div>

      <Separator />

      {/* Formulario de notas médicas */}
      {appointment.status === 'CONFIRMED' && (
        <div className="space-y-4">
          <h3 className="font-semibold">Notas Médicas</h3>

          <Textarea
            placeholder="Síntomas reportados por el paciente..."
            value={notes.symptoms}
            onChange={(e) => setNotes({ ...notes, symptoms: e.target.value })}
            rows={3}
          />

          <Textarea
            placeholder="Diagnóstico..."
            value={notes.diagnosis}
            onChange={(e) => setNotes({ ...notes, diagnosis: e.target.value })}
            rows={3}
          />

          <div>
            <Label>Prescripciones</Label>
            {prescriptions.map((presc, index) => (
              <div key={index} className="grid grid-cols-3 gap-2 mt-2">
                <Input
                  placeholder="Medicamento"
                  value={presc.medication}
                  onChange={(e) => updatePrescription(index, 'medication', e.target.value)}
                />
                <Input
                  placeholder="Dosis (ej: 500mg)"
                  value={presc.dosage}
                  onChange={(e) => updatePrescription(index, 'dosage', e.target.value)}
                />
                <Input
                  placeholder="Frecuencia (ej: cada 8h)"
                  value={presc.frequency}
                  onChange={(e) => updatePrescription(index, 'frequency', e.target.value)}
                />
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={addPrescription}
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Medicamento
            </Button>
          </div>

          <Textarea
            placeholder="Notas adicionales..."
            value={notes.additionalNotes}
            onChange={(e) => setNotes({ ...notes, additionalNotes: e.target.value })}
            rows={3}
          />

          <Button onClick={handleSaveMedicalRecord}>
            Guardar Registro Médico
          </Button>
        </div>
      )}
    </CardContent>
  </Card>

  {/* Historial del paciente */}
  <Card>
    <CardHeader>
      <CardTitle>Historial Médico</CardTitle>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          {patientHistory.map(record => (
            <div key={record.id} className="p-3 border rounded-lg">
              <p className="text-sm font-semibold">
                {format(record.date, 'dd MMM yyyy')}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {record.diagnosis}
              </p>
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto"
                onClick={() => viewFullRecord(record.id)}
              >
                Ver detalles
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </CardContent>
  </Card>
</div>
```

---

### ADMIN - Vistas Detalladas

#### 12. `/admin/dashboard` - Dashboard Administrativo
**Propósito:** Métricas y estadísticas generales de la plataforma

**Componentes:**
- Gráficas de usuarios (por rol, por país)
- Gráfica de citas (por estado, por mes)
- Ingresos y suscripciones
- Doctores pendientes de verificación
- Actividad reciente

**Endpoints:**
- `GET /admin/stats/users`
- `GET /admin/stats/appointments`
- `GET /admin/stats/revenue`
- `GET /doctors?status=PENDING_VERIFICATION`

**Ejemplo JSX:**
```tsx
<div className="space-y-6">
  {/* Stats principales */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.totalUsers}</div>
        <p className="text-xs text-muted-foreground">
          <span className="text-green-500">+{stats.newUsersThisMonth}</span> este mes
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Doctores</CardTitle>
        <Stethoscope className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.totalDoctors}</div>
        <p className="text-xs text-muted-foreground">
          {stats.pendingVerification} pendientes
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Citas Este Mes</CardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.appointmentsThisMonth}</div>
        <p className="text-xs text-muted-foreground">
          {stats.completedPercentage}% completadas
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${stats.revenueThisMonth}</div>
        <p className="text-xs text-muted-foreground">
          <span className="text-green-500">+{stats.revenueGrowth}%</span> vs mes anterior
        </p>
      </CardContent>
    </Card>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Gráfica de usuarios */}
    <Card>
      <CardHeader>
        <CardTitle>Crecimiento de Usuarios</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userGrowthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="patients" stroke="#8884d8" />
            <Line type="monotone" dataKey="doctors" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>

    {/* Gráfica de citas */}
    <Card>
      <CardHeader>
        <CardTitle>Estado de Citas</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={appointmentStatusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {appointmentStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>

  {/* Doctores pendientes */}
  <Card>
    <CardHeader>
      <CardTitle>Doctores Pendientes de Verificación</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Doctor</TableHead>
            <TableHead>Especialidad</TableHead>
            <TableHead>País</TableHead>
            <TableHead>Fecha Registro</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingDoctors.map(doctor => (
            <TableRow key={doctor.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={doctor.photo} />
                    <AvatarFallback>{doctor.initials}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{doctor.name}</span>
                </div>
              </TableCell>
              <TableCell>{doctor.specialty}</TableCell>
              <TableCell>{doctor.country}</TableCell>
              <TableCell>{format(doctor.createdAt, 'PPP')}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  onClick={() => navigate(`/admin/doctors/${doctor.id}`)}
                >
                  Revisar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</div>
```

---

#### 13. `/admin/doctors/:id` - Verificación de Doctor
**Propósito:** Revisar y aprobar/rechazar solicitud de doctor

**Componentes:**
- Info del doctor (nombre, foto, bio)
- Documentos subidos (licencia médica, certificados)
- Visor de documentos
- Botones: Aprobar, Rechazar, Solicitar más info
- Formulario de feedback

**Endpoints:**
- `GET /doctors/{id}`
- `PATCH /doctors/{id}/verify` (aprobar/rechazar)
- `GET /files/{fileId}` (documentos)

**Ejemplo JSX:**
```tsx
<div className="max-w-6xl mx-auto space-y-6">
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>Verificación de Doctor</CardTitle>
        <Badge variant={doctor.verificationStatus === 'PENDING' ? 'outline' : 'default'}>
          {doctor.verificationStatus}
        </Badge>
      </div>
    </CardHeader>
  </Card>

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Info del doctor */}
    <Card className="lg:col-span-1">
      <CardContent className="p-6 space-y-4">
        <Avatar className="w-32 h-32 mx-auto">
          <AvatarImage src={doctor.photo} />
          <AvatarFallback>{doctor.initials}</AvatarFallback>
        </Avatar>

        <div className="text-center">
          <h2 className="text-xl font-bold">{doctor.name}</h2>
          <p className="text-muted-foreground">{doctor.specialty}</p>
        </div>

        <Separator />

        <div className="space-y-3 text-sm">
          <div>
            <p className="font-semibold">Email</p>
            <p className="text-muted-foreground">{doctor.email}</p>
          </div>
          <div>
            <p className="font-semibold">País</p>
            <p className="text-muted-foreground">{doctor.country}</p>
          </div>
          <div>
            <p className="font-semibold">Experiencia</p>
            <p className="text-muted-foreground">{doctor.experience} años</p>
          </div>
          <div>
            <p className="font-semibold">Licencia Médica</p>
            <p className="text-muted-foreground">{doctor.licenseNumber}</p>
          </div>
          <div>
            <p className="font-semibold">Fecha de Registro</p>
            <p className="text-muted-foreground">
              {format(doctor.createdAt, 'PPP')}
            </p>
          </div>
        </div>

        <Separator />

        <div>
          <p className="font-semibold mb-2">Biografía</p>
          <p className="text-sm text-muted-foreground">{doctor.bio}</p>
        </div>
      </CardContent>
    </Card>

    {/* Documentos y verificación */}
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Documentos Subidos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Lista de documentos */}
        <div className="space-y-4">
          {doctor.documents.map(doc => (
            <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium">{doc.type}</p>
                  <p className="text-sm text-muted-foreground">{doc.filename}</p>
                </div>
              </div>
              <Button variant="outline" onClick={() => viewDocument(doc.url)}>
                Ver Documento
              </Button>
            </div>
          ))}
        </div>

        <Separator />

        {/* Formulario de decisión */}
        <div className="space-y-4">
          <div>
            <Label>Notas de Verificación</Label>
            <Textarea
              placeholder="Agrega notas sobre la verificación..."
              value={verificationNotes}
              onChange={(e) => setVerificationNotes(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="default"
              className="flex-1"
              onClick={() => handleVerify('APPROVED')}
            >
              <Check className="mr-2 h-4 w-4" />
              Aprobar Doctor
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => handleVerify('REJECTED')}
            >
              <X className="mr-2 h-4 w-4" />
              Rechazar
            </Button>
            <Button
              variant="outline"
              onClick={() => handleRequestMoreInfo()}
            >
              Solicitar Más Info
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</div>
```

---

## Componentes Reutilizables

### 1. Navbar.tsx
```tsx
export function Navbar({ user, onLogout }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Salud Sin Fronteras</span>
        </div>

        <div className="ml-auto flex items-center gap-4">
          {/* Selector de idioma */}
          <LanguageSelector />

          {/* Notificaciones */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
            )}
          </Button>

          {/* Perfil */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar>
                  <AvatarImage src={user.photo} />
                  <AvatarFallback>{user.initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
```

### 2. DoctorCard.tsx
```tsx
export function DoctorCard({ doctor }: { doctor: Doctor }) {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={doctor.photo} />
            <AvatarFallback>{doctor.initials}</AvatarFallback>
          </Avatar>

          <div>
            <h3 className="font-semibold text-lg">{doctor.name}</h3>
            <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
          </div>

          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{doctor.rating}</span>
            <span className="text-muted-foreground text-sm">
              ({doctor.reviewsCount})
            </span>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="outline">{doctor.country}</Badge>
            <Badge variant="outline">{doctor.experience} años</Badge>
          </div>

          <div className="flex gap-2 text-sm">
            {doctor.languages.slice(0, 3).map(lang => (
              <span key={lang} className="text-muted-foreground">
                {lang}
              </span>
            ))}
          </div>

          <Button
            className="w-full"
            onClick={() => navigate(`/patient/doctors/${doctor.id}`)}
          >
            Ver Perfil
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 3. AppointmentCard.tsx
```tsx
export function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const navigate = useNavigate();
  const isUpcoming = isFuture(appointment.date);
  const canJoin = isToday(appointment.date) && appointment.status === 'CONFIRMED';

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={appointment.doctor.photo} />
              <AvatarFallback>{appointment.doctor.initials}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">{appointment.doctor.name}</h4>
              <p className="text-sm text-muted-foreground">
                {appointment.doctor.specialty}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-3 w-3" />
                <span className="text-sm">{format(appointment.date, 'PPP')}</span>
                <Clock className="h-3 w-3 ml-2" />
                <span className="text-sm">{appointment.time}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge variant={getStatusVariant(appointment.status)}>
              {appointment.status}
            </Badge>

            {canJoin && (
              <Button
                size="sm"
                onClick={() => navigate(`/patient/appointments/${appointment.id}/video`)}
              >
                <Video className="mr-2 h-4 w-4" />
                Entrar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## Integración con Backend

### Configuración de Axios

```typescript
// src/services/api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Servicios por Módulo

```typescript
// src/services/appointments.ts
import { api } from './api';

export const appointmentsService = {
  getAll: (params?: { status?: string; userId?: number }) =>
    api.get('/appointments', { params }),

  getById: (id: number) =>
    api.get(`/appointments/${id}`),

  create: (data: CreateAppointmentDto) =>
    api.post('/appointments', data),

  update: (id: number, data: Partial<UpdateAppointmentDto>) =>
    api.patch(`/appointments/${id}`, data),

  cancel: (id: number) =>
    api.patch(`/appointments/${id}/cancel`),

  confirm: (id: number) =>
    api.patch(`/appointments/${id}/confirm`),
};
```

### Custom Hooks con React Query

```typescript
// src/hooks/useAppointments.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsService } from '@/services/appointments';

export function useAppointments(userId?: number, status?: string) {
  return useQuery({
    queryKey: ['appointments', userId, status],
    queryFn: () => appointmentsService.getAll({ userId, status }),
    select: (response) => response.data,
  });
}

export function useAppointment(id: number) {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: () => appointmentsService.getById(id),
    select: (response) => response.data,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: appointmentsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => appointmentsService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}
```

---

## Librerías NPM

### Dependencias Principales

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.9.4",
    "typescript": "^5.0.0",

    // Estado y Data Fetching
    "@tanstack/react-query": "^5.90.2",
    "axios": "^1.12.2",

    // Formularios y Validación
    "react-hook-form": "^7.55.0",
    "zod": "^4.1.11",
    "@hookform/resolvers": "^3.3.4",

    // UI Components
    "@radix-ui/react-accordion": "^1.2.12",
    "@radix-ui/react-alert-dialog": "^1.1.15",
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-checkbox": "^1.1.4",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-popover": "^1.1.6",
    "@radix-ui/react-select": "^2.1.6",
    "@radix-ui/react-tabs": "^1.1.3",
    "@radix-ui/react-toast": "^1.2.3",

    // Estilos
    "tailwindcss": "^3.4.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",

    // Iconos y Assets
    "lucide-react": "^0.487.0",

    // Notificaciones
    "sonner": "^2.0.3",
    "sweetalert2": "^11.23.0",

    // Fechas
    "date-fns": "^3.0.0",
    "react-day-picker": "^8.10.1",

    // Gráficas
    "recharts": "^2.15.2",

    // Videollamadas
    "livekit-client": "^2.0.0",
    "@livekit/components-react": "^2.0.0",

    // i18n
    "react-i18next": "^14.0.0",
    "i18next": "^23.7.0",
    "i18next-browser-languagedetector": "^7.2.0",

    // Utilidades
    "cmdk": "^1.1.1",
    "vaul": "^1.1.2"
  },

  "devDependencies": {
    "@vitejs/plugin-react-swc": "^3.10.2",
    "vite": "^6.3.5",
    "@types/react": "^19.1.13",
    "@types/react-dom": "^19.1.9",
    "@types/node": "^20.10.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

### Instalación

```bash
npm install react react-dom react-router-dom
npm install @tanstack/react-query axios
npm install react-hook-form zod @hookform/resolvers
npm install tailwindcss class-variance-authority clsx tailwind-merge
npm install lucide-react
npm install date-fns react-day-picker
npm install sonner sweetalert2
npm install recharts
npm install livekit-client @livekit/components-react
npm install react-i18next i18next i18next-browser-languagedetector
```

---

## Flujos de Usuario

### Flujo Paciente: Agendar Cita

1. Login → Dashboard Paciente
2. Click "Buscar Doctor" → `/patient/doctors`
3. Filtrar por especialidad/país
4. Click en doctor → `/patient/doctors/:id`
5. Ver disponibilidad y seleccionar slot
6. Confirmar cita → Modal de confirmación
7. Cita creada → Redirect a `/patient/appointments`

### Flujo Doctor: Atender Consulta

1. Login → Dashboard Doctor
2. Ver citas del día
3. Click en cita → `/doctor/appointments/:id`
4. Revisar info del paciente
5. Click "Iniciar Videollamada" → `/doctor/appointments/:id/video`
6. Realizar consulta
7. Finalizar llamada → Volver a detalle
8. Completar notas médicas, diagnóstico y prescripciones
9. Guardar registro médico
10. Marcar cita como completada

### Flujo Admin: Verificar Doctor

1. Login → Dashboard Admin
2. Ver "Doctores pendientes"
3. Click en doctor → `/admin/doctors/:id`
4. Revisar documentos (licencia, certificados)
5. Revisar perfil profesional
6. Agregar notas de verificación
7. Aprobar o rechazar → Notificación al doctor

---

## Configuración i18n

```typescript
// src/lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from '@/locales/en/translation.json';
import translationES from '@/locales/es/translation.json';
import translationFR from '@/locales/fr/translation.json';
import translationPT from '@/locales/pt/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationEN },
      es: { translation: translationES },
      fr: { translation: translationFR },
      pt: { translation: translationPT },
    },
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
```

```typescript
// Uso en componentes
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <h1>{t('welcome.title')}</h1>
      <Button onClick={() => i18n.changeLanguage('en')}>
        English
      </Button>
    </div>
  );
}
```

---

## Configuración LiveKit

```typescript
// src/lib/livekit.ts
import { Room, RoomEvent } from 'livekit-client';

export async function connectToRoom(token: string, roomName: string) {
  const room = new Room({
    adaptiveStream: true,
    dynacast: true,
  });

  await room.connect(process.env.VITE_LIVEKIT_URL!, token);

  return room;
}
```

```typescript
// src/components/video/VideoCallRoom.tsx
import { useEffect, useState } from 'react';
import { Room } from 'livekit-client';
import { VideoRenderer, AudioRenderer } from '@livekit/components-react';

export function VideoCallRoom({ appointmentId }: Props) {
  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    async function init() {
      // Obtener token del backend
      const { token } = await videoService.getToken(appointmentId);

      // Conectar a la sala
      const connectedRoom = await connectToRoom(token, `appointment-${appointmentId}`);
      setRoom(connectedRoom);
    }

    init();

    return () => {
      room?.disconnect();
    };
  }, [appointmentId]);

  if (!room) return <LoadingSpinner />;

  return (
    <div className="video-call-container">
      <VideoRenderer track={room.remoteParticipants[0]?.videoTrack} />
      <VideoRenderer track={room.localParticipant.videoTrack} />
    </div>
  );
}
```

---

## Variables de Entorno

```env
# .env.local
VITE_API_URL=http://localhost:3000/api
VITE_LIVEKIT_URL=wss://your-livekit-server.com
VITE_APP_NAME=Salud Sin Fronteras
```

---

## Resumen Final

Este documento define la arquitectura completa del frontend de **Salud Sin Fronteras**:

- **26+ vistas** organizadas por rol (Patient, Doctor, Admin)
- **Sistema de rutas** protegidas con guards por rol
- **Componentes reutilizables** con Radix UI + Tailwind
- **Integración completa** con backend NestJS
- **LiveKit** para videollamadas WebRTC
- **i18n** para soporte multilenguaje
- **React Query** para manejo de estado del servidor
- **TypeScript** para type-safety

Todas las vistas están diseñadas para ser:
- ✅ Modulares y escalables
- ✅ Accesibles (Radix UI)
- ✅ Responsive (Tailwind)
- ✅ Type-safe (TypeScript)
- ✅ Open-source (sin licencias de pago)
