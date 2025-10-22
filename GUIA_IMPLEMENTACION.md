# Guía de Implementación - Salud Sin Fronteras

## Tabla de Contenidos

1. [Setup Inicial](#setup-inicial)
2. [Configuración del Proyecto](#configuración-del-proyecto)
3. [Implementación por Fases](#implementación-por-fases)
4. [Testing](#testing)
5. [Deployment](#deployment)

---

## Setup Inicial

### 1. Clonar y Configurar

```bash
# Ya tienes el proyecto, pero si necesitas empezar desde cero:
npm create vite@latest salud-sin-fronteras -- --template react-ts
cd salud-sin-fronteras
```

### 2. Instalar Dependencias

```bash
# Core
npm install react-router-dom
npm install @tanstack/react-query
npm install axios

# UI Components (Radix UI + shadcn/ui)
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-avatar
npm install @radix-ui/react-checkbox @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-label @radix-ui/react-popover @radix-ui/react-select
npm install @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-slot

# Formularios
npm install react-hook-form zod @hookform/resolvers

# Estilos
npm install -D tailwindcss postcss autoprefixer
npm install class-variance-authority clsx tailwind-merge

# Iconos
npm install lucide-react

# Notificaciones
npm install sonner sweetalert2

# Fechas
npm install date-fns react-day-picker

# Gráficas (para admin)
npm install recharts

# Videollamadas
npm install livekit-client @livekit/components-react

# i18n
npm install react-i18next i18next i18next-browser-languagedetector

# Dev dependencies
npm install -D @types/node
```

### 3. Configurar TailwindCSS

```bash
npx tailwindcss init -p
```

```typescript
// tailwind.config.js
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 174 62% 47%; /* Teal-500 */
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 174 62% 47%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 174 62% 47%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 174 62% 47%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### 4. Configurar Variables de Entorno

```env
# .env.local
VITE_API_URL=http://localhost:3000/api
VITE_LIVEKIT_URL=wss://your-livekit-server.com
VITE_APP_NAME=Salud Sin Fronteras
```

---

## Configuración del Proyecto

### 1. Crear Utilidades Base

```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string, format?: string): string {
  // Usar date-fns
  return new Date(date).toLocaleDateString('es-ES');
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(amount);
}
```

### 2. Configurar Axios

```typescript
// src/services/api.ts
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Error en la solicitud';

    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
      toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    } else if (error.response?.status === 403) {
      toast.error('No tienes permisos para realizar esta acción');
    } else if (error.response?.status === 404) {
      toast.error('Recurso no encontrado');
    } else if (error.response?.status >= 500) {
      toast.error('Error del servidor. Intenta nuevamente más tarde.');
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
```

### 3. Configurar React Query

```typescript
// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
```

```typescript
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import App from './App';
import { queryClient } from './lib/queryClient';
import './lib/i18n';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster position="top-right" richColors />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
```

### 4. Configurar i18n

```typescript
// src/lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        translation: {
          // Traducciones en español
          'common.save': 'Guardar',
          'common.cancel': 'Cancelar',
          'common.delete': 'Eliminar',
          'common.edit': 'Editar',
          'auth.login': 'Iniciar Sesión',
          'auth.register': 'Registrarse',
          'auth.logout': 'Cerrar Sesión',
          // ... más traducciones
        },
      },
      en: {
        translation: {
          'common.save': 'Save',
          'common.cancel': 'Cancel',
          'common.delete': 'Delete',
          'common.edit': 'Edit',
          'auth.login': 'Login',
          'auth.register': 'Register',
          'auth.logout': 'Logout',
          // ... más traducciones
        },
      },
    },
    fallbackLng: 'es',
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
```

### 5. Crear Context de Autenticación

```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types/user';
import { getMe } from '@/services/users';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const userData = await getMe();
          setUser(userData);
        } catch (error) {
          localStorage.removeItem('access_token');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (token: string) => {
    localStorage.setItem('access_token', token);
    const userData = await getMe();
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const role = user?.role || null;
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

---

## Implementación por Fases

### Fase 1: Autenticación y Base (Semana 1)

**Tareas:**
1. ✅ Setup inicial del proyecto
2. ✅ Configuración de Tailwind, React Query, i18n
3. ✅ Componentes UI base (Button, Input, Card, Dialog, etc.)
4. Implementar sistema de autenticación completo
5. Crear rutas protegidas
6. Landing Page

**Archivos a crear:**

```typescript
// src/components/auth/LoginForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { login as loginService } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginService(data.email, data.password);
      await login(response.access_token);
      toast.success('Inicio de sesión exitoso');
    } catch (error) {
      toast.error('Credenciales inválidas');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          placeholder="tu@email.com"
        />
        {errors.email && (
          <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>
    </form>
  );
}
```

```typescript
// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, role } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
```

**App.tsx actualizado:**

```typescript
// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LandingPage } from './components/LandingPage';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PatientDashboard } from './components/patient/PatientDashboard';
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Rutas protegidas - Patient */}
        <Route
          path="/patient/*"
          element={
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <PatientRoutes />
            </ProtectedRoute>
          }
        />

        {/* Rutas protegidas - Doctor */}
        <Route
          path="/doctor/*"
          element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <DoctorRoutes />
            </ProtectedRoute>
          }
        />

        {/* Rutas protegidas - Admin */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminRoutes />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

// Rutas específicas por rol
function PatientRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<PatientDashboard />} />
      <Route path="doctors" element={<DoctorSearch />} />
      {/* ... más rutas */}
    </Routes>
  );
}

function DoctorRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<DoctorDashboard />} />
      {/* ... más rutas */}
    </Routes>
  );
}

function AdminRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<AdminDashboard />} />
      {/* ... más rutas */}
    </Routes>
  );
}

export default App;
```

---

### Fase 2: Vistas de Paciente (Semana 2-3)

**Tareas:**
1. Dashboard de paciente
2. Búsqueda de doctores
3. Perfil de doctor y agendamiento
4. Lista de citas
5. Detalle de cita

**Implementación prioritaria:**

1. Crear servicios API para pacientes
2. Implementar hooks personalizados
3. Desarrollar vistas principales
4. Conectar con backend real

---

### Fase 3: Sistema de Chat y Video (Semana 4)

**Tareas:**
1. Implementar chat en tiempo real
2. Integrar LiveKit para videollamadas
3. Sistema de traducción de mensajes
4. Controles de video (mic, cámara, screen share)

**Ejemplo de integración LiveKit:**

```typescript
// src/hooks/useVideoCall.ts
import { useEffect, useState } from 'react';
import {
  Room,
  RoomEvent,
  Track,
  LocalParticipant,
  RemoteParticipant,
} from 'livekit-client';
import { getVideoToken } from '@/services/video';

export function useVideoCall(appointmentId: number) {
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [participants, setParticipants] = useState<RemoteParticipant[]>([]);

  useEffect(() => {
    let currentRoom: Room | null = null;

    async function connect() {
      try {
        const { token } = await getVideoToken(appointmentId);

        const newRoom = new Room({
          adaptiveStream: true,
          dynacast: true,
        });

        await newRoom.connect(
          import.meta.env.VITE_LIVEKIT_URL,
          token
        );

        currentRoom = newRoom;
        setRoom(newRoom);
        setIsConnected(true);

        // Event listeners
        newRoom.on(RoomEvent.ParticipantConnected, (participant) => {
          setParticipants((prev) => [...prev, participant]);
        });

        newRoom.on(RoomEvent.ParticipantDisconnected, (participant) => {
          setParticipants((prev) =>
            prev.filter((p) => p.identity !== participant.identity)
          );
        });

        newRoom.on(RoomEvent.Disconnected, () => {
          setIsConnected(false);
        });
      } catch (error) {
        console.error('Error connecting to room:', error);
      }
    }

    connect();

    return () => {
      currentRoom?.disconnect();
    };
  }, [appointmentId]);

  const toggleMic = async () => {
    if (room?.localParticipant) {
      const enabled = !isMicOn;
      await room.localParticipant.setMicrophoneEnabled(enabled);
      setIsMicOn(enabled);
    }
  };

  const toggleCamera = async () => {
    if (room?.localParticipant) {
      const enabled = !isCameraOn;
      await room.localParticipant.setCameraEnabled(enabled);
      setIsCameraOn(enabled);
    }
  };

  const disconnect = () => {
    room?.disconnect();
  };

  return {
    room,
    isConnected,
    isMicOn,
    isCameraOn,
    participants,
    toggleMic,
    toggleCamera,
    disconnect,
  };
}
```

---

### Fase 4: Vistas de Doctor (Semana 5)

**Tareas:**
1. Dashboard de doctor
2. Gestión de disponibilidad
3. Vista de citas
4. Formulario de notas médicas
5. Historial de pacientes

---

### Fase 5: Panel Administrativo (Semana 6)

**Tareas:**
1. Dashboard con métricas
2. Verificación de doctores
3. Gestión de usuarios
4. Reportes y analytics
5. Configuración del sistema

---

### Fase 6: Optimización y Testing (Semana 7)

**Tareas:**
1. Testing de componentes
2. Testing de integración
3. Optimización de rendimiento
4. Accesibilidad (a11y)
5. SEO y meta tags

---

## Testing

### Unit Tests con Vitest

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

```typescript
// src/components/__tests__/LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoginForm } from '../auth/LoginForm';

describe('LoginForm', () => {
  it('renders login form', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  });

  it('shows validation errors', async () => {
    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
    });
  });
});
```

---

## Deployment

### Build de Producción

```bash
npm run build
```

### Deployment en Vercel

```bash
npm install -g vercel
vercel
```

### Variables de Entorno en Producción

Configurar en el dashboard de Vercel:
- `VITE_API_URL`
- `VITE_LIVEKIT_URL`

---

## Mejores Prácticas

### 1. Organización de Código
- Un componente por archivo
- Colocar estilos inline con Tailwind
- Extraer lógica compleja a hooks personalizados

### 2. Performance
- Lazy loading de rutas con `React.lazy()`
- Memoización con `useMemo` y `useCallback`
- Optimización de imágenes

### 3. Seguridad
- Nunca exponer tokens en el código
- Validar datos del lado del cliente Y servidor
- Sanitizar inputs de usuario

### 4. Accesibilidad
- Usar componentes de Radix UI (ya son accesibles)
- Agregar labels a todos los inputs
- Navegación por teclado

---

## Checklist de Implementación

### Autenticación
- [ ] Login
- [ ] Registro
- [ ] Recuperación de contraseña
- [ ] Verificación de email
- [ ] Guards de rutas por rol

### Paciente
- [ ] Dashboard
- [ ] Búsqueda de doctores
- [ ] Perfil de doctor
- [ ] Agendamiento de citas
- [ ] Lista de citas
- [ ] Chat con doctor
- [ ] Videollamada
- [ ] Historial médico
- [ ] Suscripciones

### Doctor
- [ ] Dashboard
- [ ] Perfil profesional
- [ ] Gestión de disponibilidad
- [ ] Lista de citas
- [ ] Detalle de cita
- [ ] Notas médicas
- [ ] Chat con paciente
- [ ] Videollamada
- [ ] Historial de pacientes

### Admin
- [ ] Dashboard con métricas
- [ ] Verificación de doctores
- [ ] Gestión de usuarios
- [ ] Gestión de citas
- [ ] Planes de suscripción
- [ ] Analytics

### General
- [ ] i18n (ES, EN, FR, PT)
- [ ] Notificaciones
- [ ] Tema claro/oscuro
- [ ] Responsive design
- [ ] Error boundaries
- [ ] Loading states
- [ ] Testing
- [ ] Deployment
