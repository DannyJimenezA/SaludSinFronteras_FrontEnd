# Salud Sin Fronteras - Frontend Architecture

> Plataforma de telemedicina con traducción en tiempo real, videollamadas HD y gestión completa de consultas médicas.

---

## Índice de Documentación

📚 **Documentación completa disponible:**

1. **[ARQUITECTURA_FRONTEND.md](ARQUITECTURA_FRONTEND.md)** - Arquitectura completa del sistema
   - Stack tecnológico
   - Estructura de carpetas detallada
   - Sistema de rutas por rol
   - Vistas detalladas (26+ pantallas)
   - Componentes reutilizables
   - Integración con backend
   - Librerías NPM

2. **[GUIA_IMPLEMENTACION.md](GUIA_IMPLEMENTACION.md)** - Guía paso a paso
   - Setup inicial del proyecto
   - Configuración de todas las librerías
   - Implementación por fases (7 semanas)
   - Testing
   - Deployment
   - Checklist completo

3. **[SERVICIOS_Y_HOOKS.md](SERVICIOS_Y_HOOKS.md)** - Código de servicios y hooks
   - 10 servicios API completos
   - 8 custom hooks con React Query
   - Tipos TypeScript completos
   - Validadores Zod

4. **[DIAGRAMAS_FLUJO.md](DIAGRAMAS_FLUJO.md)** - Diagramas visuales
   - 12 diagramas Mermaid
   - Flujos de usuario por rol
   - Arquitectura de componentes
   - Secuencias de integración

---

## Quick Start

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus valores

# Iniciar servidor de desarrollo
npm run dev
```

### Variables de Entorno

```env
VITE_API_URL=http://localhost:3000/api
VITE_LIVEKIT_URL=wss://your-livekit-server.com
```

---

## Stack Tecnológico

### Core
- **React 18.3** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite 6.3** - Build tool ultra-rápido
- **React Router DOM 7.9** - Navegación SPA

### UI/Styling
- **TailwindCSS** - Utility-first CSS
- **Radix UI** - Componentes accesibles headless
- **shadcn/ui** - Componentes pre-construidos
- **Lucide React** - Iconos modernos

### Estado y Data
- **TanStack Query (React Query)** - Server state management
- **Axios** - Cliente HTTP
- **React Hook Form** - Formularios performantes
- **Zod** - Validación de esquemas

### Features Especiales
- **LiveKit** - Videollamadas WebRTC
- **react-i18next** - Internacionalización (ES, EN, FR, PT)
- **Recharts** - Gráficas y dashboards
- **Sonner** - Notificaciones toast elegantes

---

## Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes base (Radix UI)
│   ├── common/         # Componentes compartidos
│   ├── auth/           # Autenticación
│   ├── patient/        # Vistas de paciente
│   ├── doctor/         # Vistas de doctor
│   ├── admin/          # Vistas de admin
│   ├── video/          # Videollamadas
│   └── chat/           # Sistema de chat
│
├── contexts/           # React Contexts
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx
│   └── LanguageContext.tsx
│
├── hooks/              # Custom hooks
│   ├── useAuth.ts
│   ├── useAppointments.ts
│   ├── useVideoCall.ts
│   └── useChat.ts
│
├── services/           # Servicios API
│   ├── api.ts         # Cliente Axios
│   ├── auth.ts
│   ├── appointments.ts
│   └── doctors.ts
│
├── types/              # TypeScript types
│   ├── user.ts
│   ├── appointment.ts
│   └── doctor.ts
│
├── lib/                # Utilidades
│   ├── utils.ts
│   ├── queryClient.ts
│   └── i18n.ts
│
└── locales/            # Traducciones i18n
    ├── es/
    ├── en/
    ├── fr/
    └── pt/
```

---

## Rutas de la Aplicación

### Públicas
- `/` - Landing page
- `/login` - Iniciar sesión
- `/register` - Registro
- `/forgot-password` - Recuperar contraseña
- `/reset-password` - Restablecer contraseña
- `/verify-email` - Verificar email

### Paciente (`/patient/...`)
- `dashboard` - Dashboard principal
- `doctors` - Búsqueda de doctores
- `doctors/:id` - Perfil del doctor
- `appointments` - Mis citas
- `appointments/:id` - Detalle de cita
- `appointments/:id/chat` - Chat con doctor
- `appointments/:id/video` - Videollamada
- `medical-records` - Historial médico
- `subscriptions` - Planes y suscripción
- `profile` - Mi perfil

### Doctor (`/doctor/...`)
- `dashboard` - Dashboard principal
- `profile` - Perfil profesional
- `availability` - Gestión de disponibilidad
- `appointments` - Mis citas
- `appointments/:id` - Detalle de cita
- `appointments/:id/chat` - Chat con paciente
- `appointments/:id/video` - Videollamada
- `patients/:id/records` - Historial del paciente

### Admin (`/admin/...`)
- `dashboard` - Dashboard con métricas
- `users` - Gestión de usuarios
- `doctors` - Verificación de doctores
- `doctors/:id` - Revisar doctor
- `appointments` - Gestión de citas
- `plans` - Gestión de planes
- `analytics` - Reportes y analytics

---

## Características Principales

### 1. Autenticación JWT Multi-Rol
- Login/Registro con validación
- Verificación de email
- Recuperación de contraseña
- Guards de rutas por rol (PATIENT, DOCTOR, ADMIN)
- Persistencia de sesión

### 2. Búsqueda y Agendamiento
- Búsqueda de doctores con filtros
- Filtros por especialidad, país, idioma, rating
- Calendario de disponibilidad
- Agendamiento de citas
- Confirmación y cancelación

### 3. Videollamadas HD/4K
- Integración con LiveKit
- Controles de mic, cámara, screen share
- Calidad adaptativa según conexión
- Indicador de calidad de conexión
- Soporte para grabación (opcional)

### 4. Chat con Traducción
- Mensajes en tiempo real (polling o WebSocket)
- Traducción automática de mensajes
- Soporte para 100+ idiomas
- Upload de archivos
- Estado "escribiendo..."

### 5. Historial Médico Digital
- Registro completo de consultas
- Diagnósticos y prescripciones
- Archivos adjuntos (estudios, análisis)
- Timeline de consultas
- Acceso para paciente y doctor

### 6. Sistema de Suscripciones
- Planes: Free, Basic, Premium
- Comparación de features
- Upgrade/downgrade
- Límites de consultas por plan
- Historial de pagos (simulado)

### 7. Panel Administrativo
- Dashboard con métricas
- Gráficas de usuarios y citas
- Verificación de doctores
- Gestión de usuarios
- Reportes y analytics

### 8. Internacionalización (i18n)
- Soporte para 4 idiomas: ES, EN, FR, PT
- Cambio dinámico de idioma
- Traducción de toda la UI
- Detección automática del idioma del navegador

---

## Ejemplos de Código

### Usar un servicio API

```typescript
import { appointmentsService } from '@/services/appointments';

// Obtener todas las citas
const appointments = await appointmentsService.getAll({
  status: 'CONFIRMED',
  userId: currentUser.id,
});

// Crear una cita
const newAppointment = await appointmentsService.create({
  doctorId: 5,
  availabilityId: 123,
  reason: 'Consulta general',
});
```

### Usar un hook con React Query

```typescript
import { useAppointments, useCreateAppointment } from '@/hooks/useAppointments';

function MyComponent() {
  // Obtener citas (con cache automático)
  const { data: appointments, isLoading } = useAppointments({
    status: 'CONFIRMED',
  });

  // Crear cita (con invalidación de cache automática)
  const createAppointment = useCreateAppointment();

  const handleCreate = () => {
    createAppointment.mutate({
      doctorId: 5,
      availabilityId: 123,
      reason: 'Consulta',
    });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      {appointments?.map(apt => (
        <AppointmentCard key={apt.id} appointment={apt} />
      ))}
      <Button onClick={handleCreate}>Crear Cita</Button>
    </div>
  );
}
```

### Proteger rutas por rol

```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute';

<Route
  path="/doctor/*"
  element={
    <ProtectedRoute allowedRoles={['DOCTOR']}>
      <DoctorRoutes />
    </ProtectedRoute>
  }
/>
```

### Componente con formulario validado

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}

      <Input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}

      <Button type="submit">Login</Button>
    </form>
  );
}
```

---

## Integración con Backend

### Endpoints Principales

```typescript
// Autenticación
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
POST   /api/auth/verify-email

// Usuarios
GET    /api/users/me
PATCH  /api/users/me

// Doctores
GET    /api/doctors?specialty=&country=
GET    /api/doctors/:id
PATCH  /api/doctors/me/profile

// Citas
GET    /api/appointments?status=&userId=
GET    /api/appointments/:id
POST   /api/appointments
PATCH  /api/appointments/:id
PATCH  /api/appointments/:id/cancel
PATCH  /api/appointments/:id/confirm

// Disponibilidad
GET    /api/availability?doctorId=&startDate=
POST   /api/availability

// Historial médico
GET    /api/medical-records?patientId=
GET    /api/medical-records/:id
POST   /api/medical-records

// Chat
GET    /api/conversations/appointment/:id
GET    /api/conversations/:id/messages
POST   /api/messages
POST   /api/messages/:id/translate

// Video
GET    /api/video/token?appointmentId=

// Suscripciones
GET    /api/subscriptions/plans
GET    /api/subscriptions/my-plan
POST   /api/subscriptions/subscribe

// Admin
GET    /api/admin/stats
GET    /api/admin/users
PATCH  /api/admin/doctors/:id/verify
```

---

## Testing

### Unit Tests

```bash
npm run test
```

```typescript
// Ejemplo de test
import { render, screen } from '@testing-library/react';
import { DoctorCard } from './DoctorCard';

test('renders doctor card', () => {
  const doctor = {
    id: 1,
    name: 'Dr. Smith',
    specialty: 'Cardiology',
    rating: 4.8,
  };

  render(<DoctorCard doctor={doctor} />);

  expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
  expect(screen.getByText('Cardiology')).toBeInTheDocument();
});
```

---

## Build y Deployment

### Build de Producción

```bash
npm run build
```

### Preview del Build

```bash
npm run preview
```

### Deploy a Vercel

```bash
vercel
```

### Deploy a Netlify

```bash
netlify deploy --prod
```

---

## Mejores Prácticas

### 1. Organización de Código
- Un componente por archivo
- Nomenclatura consistente: PascalCase para componentes, camelCase para funciones
- Extraer lógica compleja a custom hooks
- Colocar constantes en `lib/constants.ts`

### 2. Performance
- Lazy loading de rutas: `const DoctorDashboard = lazy(() => import('./DoctorDashboard'))`
- Memoización con `useMemo` y `useCallback` para cálculos costosos
- Optimización de imágenes (usar Next.js Image si migras a Next.js)
- Code splitting automático con Vite

### 3. Seguridad
- Nunca exponer tokens en el código
- Validar datos con Zod antes de enviar al backend
- Sanitizar inputs de usuario
- Usar HTTPS en producción

### 4. Accesibilidad (a11y)
- Componentes de Radix UI ya son accesibles por defecto
- Agregar `aria-label` cuando sea necesario
- Asegurar navegación por teclado
- Contraste de colores adecuado

### 5. Estándares de Código
- Usar ESLint y Prettier
- Commits descriptivos siguiendo Conventional Commits
- Pull requests con descripción clara
- Code reviews antes de merge

---

## Scripts Disponibles

```json
{
  "dev": "vite",                    // Servidor de desarrollo
  "build": "vite build",            // Build de producción
  "preview": "vite preview",        // Preview del build
  "test": "vitest",                 // Ejecutar tests
  "lint": "eslint src",             // Linter
  "format": "prettier --write src"  // Formatear código
}
```

---

## Troubleshooting

### Error: "Token expirado"
- Solución: El interceptor de Axios debería limpiar el token y redirigir a login automáticamente

### Error: "CORS"
- Solución: Configurar CORS en el backend NestJS para permitir el origen del frontend

### Error: "LiveKit no conecta"
- Verificar que `VITE_LIVEKIT_URL` esté correctamente configurado
- Verificar que el backend esté generando tokens válidos

### Error: "Traducciones no cargan"
- Verificar que los archivos JSON en `src/locales/` existan
- Verificar que `i18n.ts` esté correctamente configurado

---

## Roadmap Futuro

### Fase 1 (Actual)
- ✅ Autenticación completa
- ✅ Búsqueda y agendamiento
- ✅ Videollamadas
- ✅ Chat con traducción
- ✅ Historial médico

### Fase 2 (Próxima)
- [ ] Notificaciones push en tiempo real (WebSocket)
- [ ] Sistema de reviews y ratings
- [ ] Pagos reales (Stripe/PayPal)
- [ ] App móvil con React Native
- [ ] IA para sugerencias de diagnóstico

### Fase 3 (Futuro)
- [ ] Wearables integration
- [ ] Telemedicina grupal
- [ ] Análisis de voz en tiempo real
- [ ] Recetas médicas electrónicas oficiales

---

## Contribuir

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'feat: agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

---

## Licencia

MIT License - Ver [LICENSE](LICENSE)

---

## Soporte

- Documentación: Ver archivos MD en este repositorio
- Issues: [GitHub Issues](https://github.com/tu-repo/issues)
- Email: soporte@saludsinfronteras.com

---

## Créditos

Desarrollado con:
- React
- TypeScript
- TailwindCSS
- Radix UI
- LiveKit
- TanStack Query

---

**Última actualización:** Octubre 2025

**Versión:** 1.0.0
