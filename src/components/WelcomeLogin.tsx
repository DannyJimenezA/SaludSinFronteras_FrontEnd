import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Globe, Mail, Phone, Facebook, Eye, EyeOff } from 'lucide-react';
// arriba con el resto de imports
import Swal from 'sweetalert2';


import { getMe } from '../services/users';           // ✅ users (plural)
import { login, registerPatient, registerDoctor } from '../services/auth';
import type { User } from '../types/user';          // ✅ users (plural)

interface WelcomeLoginProps {
  onLogin: (userType: 'patient' | 'doctor' | 'admin') => void;
}

type UiRole = 'patient' | 'doctor' | 'admin';

export function WelcomeLogin({ onLogin }: WelcomeLoginProps) {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [userType, setUserType] = useState<'patient' | 'doctor'>('patient');

  // Login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register form
  const [rFirstName, setRFirstName] = useState('');
  const [rLastName1, setRLastName1] = useState('');
  const [rLastName2, setRLastName2] = useState('');
  const [rEmail, setREmail] = useState('');
  const [rPassword, setRPassword] = useState('');
  const [rPassword2, setRPassword2] = useState('');
  const [showRPassword, setShowRPassword] = useState(false);
  const [showRPassword2, setShowRPassword2] = useState(false);

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
      { code: 'de', name: 'Deutsch' },
    ],
    []
  );

  const mapRoleToUi = (user: User): UiRole => {
    const r = (user.role || '').toString().toUpperCase();
    if (r === 'ADMIN') return 'admin';
    if (r === 'DOCTOR') return 'doctor';
    return 'patient';
  };

 // --- LOGIN real ---
const handleLogin = async () => {
  setErrorMsg(null);
  setLoading(true);
  try {
    await login({ email: email.trim(), password });

    const me = await getMe();
    const uiRole = mapRoleToUi(me); // 'patient' | 'doctor' | 'admin'
    if (!['patient', 'doctor', 'admin'].includes(uiRole)) {
      setErrorMsg('Tu cuenta no tiene un rol válido para acceder.');
      return;
    }

    const roleLabel = uiRole === 'doctor' ? 'doctor' : uiRole === 'admin' ? 'administrador' : 'paciente';
    await Swal.fire({
      icon: 'success',
      title: `¡Bienvenido, ${roleLabel}!`,
      text: `Inicio de sesión exitoso${me.fullName ? `, ${me.fullName}` : ''}.`,
      confirmButtonText: 'Continuar',
      confirmButtonColor: '#0f766e',
    });

    onLogin(uiRole); // ← envía a dashboard correcto
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ??
      err?.message ??
      'No se pudo iniciar sesión. Verifica tus credenciales.';
    setErrorMsg(msg);
  } finally {
    setLoading(false);
  }
};



  // --- REGISTER real (paciente/doctor) ---
  const handleRegister = async () => {
  setRegErrorMsg(null);

  if (rPassword !== rPassword2) {
    setRegErrorMsg('Las contraseñas no coinciden.');
    return;
  }

  setRegLoading(true);
  try {
    // Registrar según "Tipo de Usuario"
    if (userType === 'doctor') {
      await registerDoctor({
        firstName: rFirstName.trim(),
        lastName1: rLastName1.trim(),
        lastName2: rLastName2 ? rLastName2.trim() : undefined,
        email: rEmail.trim(),
        password: rPassword
      });
    } else {
      await registerPatient({
        firstName: rFirstName.trim(),
        lastName1: rLastName1.trim(),
        lastName2: rLastName2 ? rLastName2.trim() : undefined,
        email: rEmail.trim(),
        password: rPassword
      });
    }

    // Auto-login y redirección por rol
    await login({ email: rEmail.trim(), password: rPassword });
    const me = await getMe();
    const uiRole = mapRoleToUi(me);

    await Swal.fire({
      icon: 'success',
      title: '¡Cuenta creada!',
      text: `Bienvenido${me.fullName ? `, ${me.fullName}` : ''}.`,
      confirmButtonText: 'Continuar',
      confirmButtonColor: '#0f766e',
    });

    onLogin(uiRole);
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
                    <div className="flex items-center justify-between">
                      <Label htmlFor="loginPassword">Contraseña</Label>
                      <Button
                        variant="link"
                        className="text-xs text-primary p-0 h-auto"
                        onClick={() => navigate('/forgot-password')}
                      >
                        ¿Olvidaste tu contraseña?
                      </Button>
                    </div>
                    <div className="relative">
                      <Input
                        id="loginPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

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
                      <div className="relative">
                        <Input
                          id="rPassword"
                          type={showRPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={rPassword}
                          onChange={(e) => setRPassword(e.target.value)}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRPassword(!showRPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showRPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rPassword2">Confirmar Contraseña</Label>
                      <div className="relative">
                        <Input
                          id="rPassword2"
                          type={showRPassword2 ? "text" : "password"}
                          placeholder="••••••••"
                          value={rPassword2}
                          onChange={(e) => setRPassword2(e.target.value)}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRPassword2(!showRPassword2)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showRPassword2 ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {regErrorMsg && <p className="text-red-600 text-sm">{regErrorMsg}</p>}

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
