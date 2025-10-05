import { useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Globe, Mail, Phone, Facebook } from 'lucide-react';

import { api } from '../lib/api';
import { getMe } from '../services/user';
import type { User } from '../types/users';

interface WelcomeLoginProps {
  onLogin: (userType: 'patient' | 'doctor' | 'admin') => void;
}

type UiRole = 'patient' | 'doctor' | 'admin';

export function WelcomeLogin({ onLogin }: WelcomeLoginProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [userType, setUserType] = useState<'patient' | 'doctor'>('patient');

  // Login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Register form
  const [rFirstName, setRFirstName] = useState('');
  const [rLastName1, setRLastName1] = useState('');
  const [rLastName2, setRLastName2] = useState('');
  const [rEmail, setREmail] = useState('');
  const [rPassword, setRPassword] = useState('');
  const [rPassword2, setRPassword2] = useState('');

  const [loading, setLoading] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [regErrorMsg, setRegErrorMsg] = useState<string | null>(null);

  const languages = useMemo(
    () => [
      { code: 'es', name: 'Español' },
      { code: 'en', name: 'English' },
      { code: 'fr', name: 'Français' },
      { code: 'pt', name: 'Português' },
      { code: 'de', name: 'Deutsch' }
    ],
    []
  );

  const mapRoleToUi = (user: User): UiRole => {
    const r = (user.role || '').toString().toUpperCase();
    if (r === 'ADMIN') return 'admin';
    if (r === 'DOCTOR') return 'doctor';
    return 'patient';
  };

  const handleLogin = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      // 1) Login → recibe { accessToken: string } (ajusta si tu payload tiene otro nombre)
      const { data } = await api.post<{ accessToken: string }>('/auth/login', {
        email,
        password,
      });
      const token = (data as any).accessToken || (data as any).token;
      if (!token) throw new Error('No se recibió token de acceso');

      localStorage.setItem('access_token', token);

      // 2) Pide /users/me con el token recién guardado
      const me = await getMe();

      // 3) Redirige según rol
      onLogin(mapRoleToUi(me));
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message ??
        err?.message ??
        'No se pudo iniciar sesión. Verifica tus credenciales.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setRegErrorMsg(null);

    if (rPassword !== rPassword2) {
      setRegErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    setRegLoading(true);
    try {
      // Endpoint típico de registro; ajusta los nombres de campos a tu DTO real
      // Si en tu backend pides FullName, también puedes enviar FullName: `${rFirstName} ${rLastName1} ${rLastName2 || ''}`.trim()
      const payload: any = {
        email: rEmail,
        password: rPassword,
        firstName1: rFirstName,
        lastName1: rLastName1,
        lastName2: rLastName2 || null,
        role: userType === 'doctor' ? 'DOCTOR' : 'PATIENT',
      };

      await api.post('/auth/register', payload);

      // Auto-login de cortesía (opcional; quítalo si tu flujo exige verificación de correo)
      const { data } = await api.post<{ accessToken: string }>('/auth/login', {
        email: rEmail,
        password: rPassword,
      });
      const token = (data as any).accessToken || (data as any).token;
      if (!token) throw new Error('No se recibió token de acceso después del registro');

      localStorage.setItem('access_token', token);

      const me = await getMe();
      onLogin(mapRoleToUi(me));
    } catch (err: any) {
      setRegErrorMsg(
        err?.response?.data?.message ??
        err?.message ??
        'No se pudo crear la cuenta. Revisa los datos e inténtalo de nuevo.'
      );
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Language Selector */}
        <div className="flex justify-end">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-40 bg-white">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <SelectValue placeholder="Idioma" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Welcome Card */}
        <Card className="bg-white shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
              <div className="text-white text-2xl font-bold">SSF</div>
            </div>
            <CardTitle className="text-2xl text-primary">Salud Sin Fronteras</CardTitle>
            <p className="text-muted-foreground">
              Médicos y pacientes unidos, sin barreras.
            </p>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="login" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>

              {/* LOGIN */}
              <TabsContent value="login" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="loginEmail">Correo Electrónico</Label>
                    <Input
                      id="loginEmail"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="loginPassword">Contraseña</Label>
                    <Input
                      id="loginPassword"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  {errorMsg && (
                    <p className="text-red-600 text-sm">{errorMsg}</p>
                  )}

                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={handleLogin}
                    disabled={loading || !email || !password}
                  >
                    {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-muted-foreground">
                        O continúa con
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline" size="sm" title="Login con correo (enlace mágico)">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" title="Login con Facebook">
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" title="Login con teléfono (OTP)">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-center">
                    <Button
                      variant="link"
                      className="text-primary"
                      onClick={() => onLogin('admin')}
                      title="Acceso de Administrador (demo)"
                    >
                      Acceso de Administrador
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* REGISTER */}
              <TabsContent value="register" className="space-y-4">
                <div className="space-y-4">
                  {/* Tipo de Usuario */}
                  <div className="space-y-2">
                    <Label>Tipo de Usuario</Label>
                    <Select
                      value={userType}
                      onValueChange={(value: 'patient' | 'doctor') => setUserType(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="patient">Paciente</SelectItem>
                        <SelectItem value="doctor">Médico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Campos en grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rFirstName">Nombre</Label>
                      <Input
                        id="rFirstName"
                        placeholder="Juan"
                        value={rFirstName}
                        onChange={(e) => setRFirstName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rLastName1">Primer Apellido</Label>
                      <Input
                        id="rLastName1"
                        placeholder="Pérez"
                        value={rLastName1}
                        onChange={(e) => setRLastName1(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rLastName2">Segundo Apellido</Label>
                      <Input
                        id="rLastName2"
                        placeholder="Rodríguez"
                        value={rLastName2}
                        onChange={(e) => setRLastName2(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rEmail">Correo Electrónico</Label>
                      <Input
                        id="rEmail"
                        type="email"
                        placeholder="tu@email.com"
                        value={rEmail}
                        onChange={(e) => setREmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rPassword">Contraseña</Label>
                      <Input
                        id="rPassword"
                        type="password"
                        placeholder="••••••••"
                        value={rPassword}
                        onChange={(e) => setRPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rPassword2">Confirmar Contraseña</Label>
                      <Input
                        id="rPassword2"
                        type="password"
                        placeholder="••••••••"
                        value={rPassword2}
                        onChange={(e) => setRPassword2(e.target.value)}
                      />
                    </div>
                  </div>

                  {regErrorMsg && (
                    <p className="text-red-600 text-sm">{regErrorMsg}</p>
                  )}

                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={handleRegister}
                    disabled={
                      regLoading ||
                      !rEmail ||
                      !rPassword ||
                      !rPassword2 ||
                      !rFirstName ||
                      !rLastName1
                    }
                  >
                    {regLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
