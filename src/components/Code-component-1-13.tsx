import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Globe, Mail, Phone, Facebook, Twitter } from 'lucide-react';

interface WelcomeLoginProps {
  onLogin: (userType: 'patient' | 'doctor' | 'admin') => void;
}

export function WelcomeLogin({ onLogin }: WelcomeLoginProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [userType, setUserType] = useState<'patient' | 'doctor'>('patient');

  const languages = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'pt', name: 'Português' },
    { code: 'de', name: 'Deutsch' }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Language Selector */}
        <div className="flex justify-end">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-40 bg-white">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <SelectValue />
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
              {/* <div className="text-white text-2xl font-bold">MC</div> */}
              <img
                src="/assets/logo_mediConnect.png"
                alt="Logo MediConnect"
                className="w-12 h-12 object-contain"
              />
            </div>
            <CardTitle className="text-2xl text-primary">MediConnect Global</CardTitle>
            <p className="text-muted-foreground">
              Conectando pacientes y médicos alrededor del mundo
            </p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input id="email" type="email" placeholder="tu@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input id="password" type="password" placeholder="••••••••" />
                  </div>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => onLogin('patient')}
                  >
                    Iniciar Sesión
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
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-center">
                    <Button
                      variant="link"
                      className="text-primary"
                      onClick={() => onLogin('admin')}
                    >
                      Acceso de Administrador
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tipo de Usuario</Label>
                    <Select value={userType} onValueChange={(value: 'patient' | 'doctor') => setUserType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="patient">Paciente</SelectItem>
                        <SelectItem value="doctor">Médico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nombre</Label>
                    <Input id="fullName" placeholder="Juan" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Primer Apellido</Label>
                    <Input id="fullName" placeholder="Pérez" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Segundo Apellido</Label>
                    <Input id="fullName" placeholder="Pérez" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registerEmail">Correo Electrónico</Label>
                    <Input id="registerEmail" type="email" placeholder="tu@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registerPassword">Contraseña</Label>
                    <Input id="registerPassword" type="password" placeholder="••••••••" />
                  </div>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => onLogin(userType)}
                  >
                    Crear Cuenta
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