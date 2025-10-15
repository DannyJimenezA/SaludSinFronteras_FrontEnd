# 🚀 Quick Start - Conexión Dinámica con Backend

## Implementación en 3 pasos

### Paso 1: Importar los hooks y componentes

```tsx
import { useRouteData } from '../hooks/useRouteData';
import { DataLoader } from '../components/DataLoader';
```

### Paso 2: Definir el tipo de datos esperados

```tsx
interface MyData {
  id: number;
  title: string;
  description: string;
}
```

### Paso 3: Usar en tu componente

```tsx
export function MyPage() {
  // Hook que conecta automáticamente con el backend
  const { data, loading, error, refetch } = useRouteData<MyData>({
    endpoint: '/my-endpoint'
  });

  return (
    <div className="p-6">
      <h1>Mi Página</h1>

      {/* DataLoader maneja automáticamente loading, error y datos */}
      <DataLoader
        loading={loading}
        error={error}
        data={data}
        onRetry={refetch}
      >
        {(myData) => (
          <div>
            <h2>{myData.title}</h2>
            <p>{myData.description}</p>
          </div>
        )}
      </DataLoader>
    </div>
  );
}
```

## ✅ ¡Listo!

Tu componente ahora:
- ✅ Se conecta automáticamente al backend cuando se monta
- ✅ Muestra un spinner mientras carga
- ✅ Muestra errores con opción de reintentar
- ✅ Renderiza los datos cuando están disponibles
- ✅ Se actualiza automáticamente si cambia la ruta

---

## 📝 Casos de Uso Comunes

### GET simple

```tsx
const { data, loading } = useRouteData({
  endpoint: '/about'
});
```

### GET con parámetros de ruta

```tsx
// Ruta: /users/:id
const { data } = useRouteData({
  endpoint: '/users/:id' // :id se reemplaza automáticamente
});
```

### POST (formulario)

```tsx
const { refetch: submitForm, loading } = useFetch({
  url: '/contact/send',
  method: 'POST',
  body: formData,
  autoFetch: false // No ejecutar automáticamente
});

// Llamar manualmente
const handleSubmit = async () => {
  await submitForm();
};
```

### Múltiples peticiones

```tsx
const { data: user } = useRouteData({ endpoint: '/users/me' });
const { data: stats } = useFetch({
  url: '/stats',
  enabled: !!user // Solo ejecutar si hay usuario
});
```

---

## 🔗 Más Información

- Documentación completa: `DYNAMIC_BACKEND_CONNECTION.md`
- Ejemplos: `src/components/examples/`
- Hooks: `src/hooks/`

---

## 💡 Tips

1. **Siempre tipea tus datos** con TypeScript
2. **Usa DataLoader** para evitar código repetitivo
3. **Proporciona funciones de retry** para mejorar UX
4. **Valida antes de renderizar** datos complejos
5. **Usa `autoFetch: false`** para POST/PUT/DELETE
