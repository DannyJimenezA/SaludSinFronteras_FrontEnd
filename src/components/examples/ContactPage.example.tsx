/**
 * EJEMPLO 2: Componente Contact con formulario y petición POST
 *
 * Ruta: /contact
 * Endpoints:
 * - GET /contact (obtener info de contacto)
 * - POST /contact/send (enviar mensaje)
 */
import { useState } from 'react';
import { useRouteData } from '../../hooks/useRouteData';
import { useFetch } from '../../hooks/useFetch';
import { DataLoader } from '../DataLoader';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

// Datos de contacto del backend
interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  hours: string;
}

export function ContactPage() {
  // Obtener información de contacto del backend
  const { data, loading, error, errorMessage, refetch } = useRouteData<ContactInfo>({
    endpoint: '/contact',
  });

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // Hook para enviar el formulario (petición POST)
  const {
    loading: sending,
    error: sendError,
    refetch: sendMessage,
  } = useFetch({
    url: '/contact/send',
    method: 'POST',
    body: formData,
    autoFetch: false, // No ejecutar automáticamente
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (!formData.name || !formData.email || !formData.message) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Por favor completa todos los campos',
      });
      return;
    }

    // Enviar mensaje
    try {
      await sendMessage();

      // Éxito
      await Swal.fire({
        icon: 'success',
        title: '¡Mensaje enviado!',
        text: 'Gracias por contactarnos. Te responderemos pronto.',
      });

      // Limpiar formulario
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo enviar el mensaje. Intenta de nuevo.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-primary">Contáctanos</h1>

        {/* Información de contacto */}
        <DataLoader
          loading={loading}
          error={error}
          errorMessage={errorMessage}
          data={data}
          onRetry={refetch}
        >
          {(contactInfo) => (
            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Email:</strong> {contactInfo.email}</p>
                <p><strong>Teléfono:</strong> {contactInfo.phone}</p>
                <p><strong>Dirección:</strong> {contactInfo.address}</p>
                <p><strong>Horario:</strong> {contactInfo.hours}</p>
              </CardContent>
            </Card>
          )}
        </DataLoader>

        {/* Formulario de contacto */}
        <Card>
          <CardHeader>
            <CardTitle>Envíanos un mensaje</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Asunto</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Asunto del mensaje"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensaje</Label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Escribe tu mensaje aquí..."
                  className="w-full min-h-[120px] p-2 border rounded-md"
                  required
                />
              </div>

              <Button type="submit" disabled={sending} className="w-full">
                {sending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {sending ? 'Enviando...' : 'Enviar Mensaje'}
              </Button>

              {sendError && (
                <p className="text-sm text-red-600">
                  Error al enviar. Por favor intenta de nuevo.
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
