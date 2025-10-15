import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Mail, ArrowLeft, Loader2, Send } from 'lucide-react';
import { requestPasswordReset } from '../services/auth';

export function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validación
    if (!email.trim()) {
      setError('Por favor ingresa tu correo electrónico');
      return;
    }

    if (!validateEmail(email)) {
      setError('Por favor ingresa un correo electrónico válido');
      return;
    }

    setLoading(true);

    try {
      // Llamar al servicio para enviar solicitud de recuperación
      await requestPasswordReset(email);

      // Mostrar mensaje de éxito
      await Swal.fire({
        icon: 'success',
        title: '¡Correo enviado!',
        html: `
          <p>Se ha enviado un enlace de recuperación a:</p>
          <p class="font-semibold text-primary mt-2">${email}</p>
          <p class="text-sm text-muted-foreground mt-2">
            Por favor revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
          </p>
        `,
        confirmButtonText: 'Ir al Login',
        confirmButtonColor: '#0f766e',
      });

      // Redirigir al login
      navigate('/login');
    } catch (err: any) {
      setLoading(false);

      // Manejar errores del backend
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'No se pudo enviar el correo de recuperación. Intenta de nuevo.';

      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonColor: '#dc2626',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Botón volver */}
        <Button
          variant="ghost"
          onClick={() => navigate('/login')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Login
        </Button>

        <Card className="shadow-xl border-2 border-teal-100">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-2">
              <Mail className="h-8 w-8 text-teal-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-teal-900">
              ¿Olvidaste tu contraseña?
            </CardTitle>
            <CardDescription className="text-base">
              No te preocupes. Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo de email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Correo Electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    className={`pl-10 ${error ? 'border-red-500 focus:border-red-500' : ''}`}
                    disabled={loading}
                    autoFocus
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                    {error}
                  </p>
                )}
              </div>

              {/* Botón enviar */}
              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar enlace de recuperación
                  </>
                )}
              </Button>

              {/* Información adicional */}
              <div className="pt-4 border-t">
                <p className="text-xs text-center text-gray-600">
                  El enlace de recuperación expirará en 24 horas.
                  <br />
                  Si no recibes el correo, revisa tu carpeta de spam.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Ayuda adicional */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿Necesitas ayuda?{' '}
            <button
              onClick={() => {
                Swal.fire({
                  icon: 'info',
                  title: 'Contacta con Soporte',
                  html: `
                    <p>Si tienes problemas para recuperar tu cuenta, contáctanos:</p>
                    <p class="font-semibold mt-2">soporte@saludSinFronteras.com</p>
                    <p class="text-sm text-muted-foreground mt-2">Horario: Lun-Vie 9:00 AM - 6:00 PM</p>
                  `,
                  confirmButtonColor: '#0f766e',
                });
              }}
              className="text-teal-600 hover:text-teal-700 font-medium hover:underline"
            >
              Contacta con soporte
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
