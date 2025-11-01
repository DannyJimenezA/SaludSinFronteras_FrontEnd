# Instalación de Dependencias - Nuevos Servicios

## Dependencias Requeridas

Para que los nuevos servicios funcionen correctamente, necesitas instalar las siguientes dependencias:

### 1. LiveKit (Video Conferencia)

```bash
npm install @livekit/components-react livekit-client @livekit/components-styles
```

**Uso:** Componente `VideoCallRoom.tsx` para videollamadas médicas

### 2. Socket.io Client (WebSockets)

```bash
npm install socket.io-client
```

**Uso:** Hook `useWebSocket` y componente `ChatWithWebSocket.tsx` para mensajería en tiempo real

### 3. Sonner (Toast Notifications)

Si no lo tienes instalado:

```bash
npm install sonner
```

**Uso:** Notificaciones de éxito/error en todos los componentes

### 4. UI Components (Si faltan)

```bash
npm install @radix-ui/react-avatar @radix-ui/react-badge @radix-ui/react-alert
```

---

## Comando de Instalación Completo

Ejecuta este comando para instalar todas las dependencias de una vez:

```bash
npm install @livekit/components-react livekit-client socket.io-client sonner @radix-ui/react-avatar @radix-ui/react-badge @radix-ui/react-alert
```

---

## Dependencias TypeScript (Dev Dependencies)

Si usas TypeScript y no tienes los tipos instalados:

```bash
npm install --save-dev @types/socket.io-client
```

---

## Verificación de Instalación

Después de instalar, verifica que tu `package.json` tenga:

```json
{
  "dependencies": {
    "@livekit/components-react": "^2.x.x",
    "@livekit/components-styles": "^1.x.x",
    "livekit-client": "^2.x.x",
    "socket.io-client": "^4.x.x",
    "sonner": "^1.x.x",
    "@radix-ui/react-avatar": "^1.x.x",
    "@radix-ui/react-badge": "^1.x.x",
    "@radix-ui/react-alert": "^1.x.x"
  }
}
```

---

## Configuración Adicional

### 1. Importar estilos de LiveKit

En tu archivo principal (ej: `main.tsx` o `App.tsx`):

```tsx
import '@livekit/components-styles';
```

### 2. Configurar Sonner Toast

En tu archivo principal:

```tsx
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      {/* Tu app */}
    </>
  );
}
```

---

## Troubleshooting

### Error: Module not found '@livekit/components-react'
**Solución:** Ejecuta `npm install @livekit/components-react livekit-client`

### Error: Module not found 'socket.io-client'
**Solución:** Ejecuta `npm install socket.io-client`

### Error en tipos TypeScript
**Solución:** Ejecuta `npm install --save-dev @types/socket.io-client`

### Conflictos de versiones
**Solución:** Ejecuta `npm install --legacy-peer-deps` o actualiza las versiones manualmente

---

## Próximos Pasos

Después de instalar las dependencias:

1. ✅ Configurar variables de entorno (ver `.env.example`)
2. ✅ Importar estilos de LiveKit
3. ✅ Configurar Toaster de Sonner
4. ✅ Probar cada componente individualmente
5. ✅ Integrar en el flujo de tu aplicación

---

**Nota:** Asegúrate de reiniciar el servidor de desarrollo después de instalar las dependencias.
