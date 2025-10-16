# Conexión Dinámica con el Backend

Sistema completo para conectar componentes de React con el backend de forma dinámica, manejando automáticamente estados de carga, errores y datos.

## 📚 Tabla de Contenidos

1. [Hooks Disponibles](#hooks-disponibles)
2. [Componentes](#componentes)
3. [Guías de Uso](#guías-de-uso)
4. [Ejemplos Completos](#ejemplos-completos)
5. [API Reference](#api-reference)

---

## 🎣 Hooks Disponibles

### 1. `useFetch` - Hook genérico para peticiones HTTP

Hook de bajo nivel para realizar cualquier tipo de petición HTTP con manejo automático de estados.

```typescript
import { useFetch } from '../hooks/useFetch';

const { data, loading, error, refetch } = useFetch({
  url: '/api/endpoint',
  method: 'GET', // GET, POST, PUT, DELETE, PATCH
  autoFetch: true, // Ejecutar automáticamente
});
```

**Características:**
- ✅ Manejo automático de loading, error y datos
- ✅ Soporte para todos los métodos HTTP
- ✅ Re-fetch manual con `refetch()`
- ✅ Transformación de datos
- ✅ Control de ejecución con `enabled`
- ✅ Dependencias para re-ejecutar automáticamente

### 2. `useRouteData` - Hook integrado con React Router

Hook de alto nivel que se integra con React Router para hacer peticiones basadas en la ruta actual.

```typescript
import { useRouteData } from '../hooks/useRouteData';

const { data, loading, error, refetch } = useRouteData({
  endpoint: '/users/:id', // Reemplaza parámetros automáticamente
});
```

**Características:**
- ✅ Integración automática con React Router
- ✅ Reemplazo automático de parámetros de ruta (`:id`, `:slug`, etc.)
- ✅ Re-ejecuta cuando cambia la ruta
- ✅ Lógica personalizada para generar endpoints

---

## 🧩 Componentes

### `DataLoader` - Componente para renderizado condicional

Componente que maneja automáticamente los estados de carga, error y datos.

```tsx
<DataLoader
  loading={loading}
  error={error}
  data={data}
  onRetry={refetch}
>
  {(data) => <div>{data.title}</div>}
</DataLoader>
```

**Características:**
- ✅ Renderizado condicional automático
- ✅ Estados de loading personalizables
- ✅ Mensajes de error con botón de reintentar
- ✅ Manejo de datos vacíos
- ✅ Totalmente personalizable

---

## 📖 Guías de Uso

### Caso 1: Página simple con datos del backend

**Ruta:** `/about`
**Backend:** `GET /about`

```tsx
import { useRouteData } from '../hooks/useRouteData';
import { DataLoader } from '../components/DataLoader';

export function AboutPage() {
  const { data, loading, error, refetch } = useRouteData({
    endpoint: '/about'
  });

  return (
    <DataLoader
      loading={loading}
      error={error}
      data={data}
      onRetry={refetch}
    >
      {(aboutData) => (
        <div>
          <h1>{aboutData.title}</h1>
          <p>{aboutData.description}</p>
        </div>
      )}
    </DataLoader>
  );
}
```

### Caso 2: Página con parámetros de ruta

**Ruta:** `/users/:id`
**Backend:** `GET /users/123`

```tsx
export function UserPage() {
  // :id se reemplaza automáticamente con el parámetro de la URL
  const { data, loading, error } = useRouteData({
    endpoint: '/users/:id'
  });

  return (
    <DataLoader loading={loading} error={error} data={data}>
      {(user) => <h1>{user.name}</h1>}
    </DataLoader>
  );
}
```

### Caso 3: Formulario con POST

```tsx
import { useFetch } from '../hooks/useFetch';
import { useState } from 'react';

export function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const { loading, error, refetch: sendMessage } = useFetch({
    url: '/contact/send',
    method: 'POST',
    body: formData,
    autoFetch: false, // No ejecutar automáticamente
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendMessage();
    alert('Mensaje enviado!');
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* campos del formulario */}
      <button disabled={loading}>
        {loading ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
}
```

### Caso 4: Múltiples peticiones en un componente

```tsx
export function DashboardPage() {
  // Obtener datos del usuario
  const { data: user, loading: userLoading } = useRouteData({
    endpoint: '/users/me'
  });

  // Obtener estadísticas
  const { data: stats, loading: statsLoading } = useFetch({
    url: '/stats/dashboard',
    enabled: !!user, // Solo ejecutar si hay usuario
  });

  return (
    <div>
      <DataLoader loading={userLoading} data={user}>
        {(userData) => <h1>Hola, {userData.name}</h1>}
      </DataLoader>

      <DataLoader loading={statsLoading} data={stats}>
        {(statsData) => <div>Citas: {statsData.appointments}</div>}
      </DataLoader>
    </div>
  );
}
```

### Caso 5: Transformación de datos

```tsx
const { data } = useRouteData({
  endpoint: '/users',
  transform: (response) => {
    // Transformar la respuesta antes de guardarla
    return response.users.map(user => ({
      ...user,
      fullName: `${user.firstName} ${user.lastName}`
    }));
  }
});
```

### Caso 6: Lógica personalizada para endpoint

```tsx
const { data } = useRouteData({
  getEndpoint: (pathname, params) => {
    // Lógica personalizada según la ruta
    if (pathname.includes('doctor')) {
      return `/doctors/${params.id}`;
    }
    if (pathname.includes('patient')) {
      return `/patients/${params.id}`;
    }
    return '/users/' + params.id;
  }
});
```

---

## 🎯 Ejemplos Completos

Revisa estos archivos para ver implementaciones completas:

1. **`AboutPage.example.tsx`** - Página simple con datos del backend
2. **`ContactPage.example.tsx`** - Formulario con GET y POST
3. **`UserDetailPage.example.tsx`** - Página con parámetros dinámicos

---

## 📘 API Reference

### `useFetch` Options

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `url` | `string` | - | URL del endpoint |
| `method` | `'GET' \| 'POST' \| 'PUT' \| 'DELETE' \| 'PATCH'` | `'GET'` | Método HTTP |
| `body` | `any` | - | Datos para POST/PUT/PATCH |
| `params` | `Record<string, any>` | - | Query parameters |
| `headers` | `Record<string, string>` | - | Headers adicionales |
| `autoFetch` | `boolean` | `true` | Ejecutar automáticamente |
| `transform` | `(data: any) => T` | - | Función de transformación |
| `dependencies` | `any[]` | `[]` | Dependencias para re-ejecutar |
| `enabled` | `boolean` | `true` | Habilitar/deshabilitar petición |

### `useFetch` Return

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `data` | `T \| null` | Datos recibidos |
| `loading` | `boolean` | Si está cargando |
| `error` | `Error \| null` | Error si ocurrió |
| `errorMessage` | `string \| null` | Mensaje de error legible |
| `refetch` | `() => Promise<void>` | Re-ejecutar petición |
| `reset` | `() => void` | Resetear estado |
| `isSuccess` | `boolean` | Si fue exitoso |
| `isError` | `boolean` | Si hubo error |

### `useRouteData` Options

| Opción | Tipo | Descripción |
|--------|------|-------------|
| `endpoint` | `string` | Endpoint con parámetros (ej: `/users/:id`) |
| `getEndpoint` | `(pathname, params) => string` | Función personalizada para generar endpoint |
| `method` | `'GET' \| 'POST' \| ...` | Método HTTP |
| `transform` | `(data: any) => T` | Transformar datos |
| `enabled` | `boolean` | Habilitar petición |
| `params` | `Record<string, any>` | Query parameters adicionales |

### `DataLoader` Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| `loading` | `boolean` | Estado de carga |
| `error` | `Error \| null` | Error |
| `data` | `T \| null` | Datos |
| `onRetry` | `() => void` | Función para reintentar |
| `children` | `(data: T) => ReactNode` | Render prop con datos |
| `loadingMessage` | `string` | Mensaje durante carga |
| `loadingComponent` | `ReactNode` | Componente personalizado de carga |
| `errorComponent` | `ReactNode` | Componente personalizado de error |
| `emptyMessage` | `string` | Mensaje cuando no hay datos |
| `emptyComponent` | `ReactNode` | Componente para estado vacío |

---

## 🔧 Configuración

### 1. Variables de entorno

Asegúrate de tener configurado tu `.env`:

```env
VITE_API_URL=http://localhost:3000
VITE_API_PREFIX=/api
```

### 2. Agregar rutas en App.tsx

```tsx
import { AboutPage } from './components/examples/AboutPage.example';
import { ContactPage } from './components/examples/ContactPage.example';
import { UserDetailPage } from './components/examples/UserDetailPage.example';

// En tus Routes
<Route path="/about" element={<AboutPage />} />
<Route path="/contact" element={<ContactPage />} />
<Route path="/users/:id" element={<UserDetailPage />} />
```

---

## ✅ Mejores Prácticas

1. **Siempre define tipos TypeScript** para los datos esperados
2. **Usa DataLoader** para manejar estados automáticamente
3. **Proporciona mensajes de error claros** al usuario
4. **Implementa botones de reintentar** en errores
5. **Valida datos antes de renderizar** componentes complejos
6. **Usa `autoFetch: false`** para peticiones POST/PUT/DELETE
7. **Implementa loading states** en botones de acción

---

## 🐛 Solución de Problemas

### Error: "Cannot read property 'data' of null"

**Solución:** Usa DataLoader o verifica que data existe antes de renderizar:

```tsx
{data && <div>{data.title}</div>}
```

### Error: "Network Error"

**Solución:** Verifica que el backend esté corriendo y que las variables de entorno estén correctas.

### Los datos no se actualizan

**Solución:** Usa `refetch()` o agrega dependencias:

```tsx
const { refetch } = useFetch({
  url: '/data',
  dependencies: [userId] // Se re-ejecuta cuando userId cambia
});
```

---

## 📞 Soporte

Para más información, revisa:
- Ejemplos en `src/components/examples/`
- Código fuente de hooks en `src/hooks/`
- Componentes UI en `src/components/`
