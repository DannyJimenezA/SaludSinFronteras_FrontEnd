import { useAuth } from "../contexts/AuthContext";
import { useMe } from "../hooks/useUsers";
import { PatientSettings } from "./PatientSettings";
import { DoctorSettings } from "./DoctorSettings";

interface SettingsProps {
  onLogout: () => void;
}

export function Settings({ onLogout }: SettingsProps) {
  const { user } = useAuth();
  const { data: me, isLoading } = useMe();

  // Mientras carga, mostrar un loader simple
  if (isLoading || !me) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando configuración...</p>
      </div>
    );
  }

  // Determinar qué componente mostrar según el rol
  const userRole = user?.role || me?.role;

  if (userRole === "DOCTOR") {
    return <DoctorSettings onLogout={onLogout} />;
  }

  // Por defecto, mostrar configuración de paciente
  return <PatientSettings onLogout={onLogout} />;
}

// Legacy imports for deprecated component below
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { updateMe } from "../services/users";
import {
  User as UserIcon,
  CreditCard,
  Eye,
  EyeOff,
  Camera,
  Save,
  LogOut,
  Trash2,
  Key,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Pencil,
  X,
} from "lucide-react";

// Componente legacy mantenido por si acaso (deprecated - usar PatientSettings o DoctorSettings)
export function SettingsLegacy({ onLogout }: SettingsProps) {
  const navigate = useNavigate();
  const { getDashboardRoute } = useAuth();

  // Perfil
  const { data: me, isLoading: loadingMe, isError } = useMe();
  const [saving, setSaving] = useState(false);
  const [birthDate, setBirthDate] = useState<string>("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Campos editables
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other" | "undisclosed">("undisclosed");
  const [address, setAddress] = useState("");

  // Seguridad
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const paymentMethods = [
    {
      id: 1,
      type: "card" as const,
      last4: "1234",
      brand: "Visa",
      expiry: "12/26",
      isDefault: true,
    },
    {
      id: 2,
      type: "paypal" as const,
      email: "juan@email.com",
      isDefault: false,
    },
  ];

  // Prellenar con el perfil
  useEffect(() => {
    if (!me) return;
    setPhone(me.phone ?? "");

    // Prefiere FullName; si no existe, compón con first/last
    const composed =
      me.fullName ??
      [me.firstName1, me.lastName1, me.lastName2].filter(Boolean).join(" ");
    setFullName(composed ?? "");

    const g = (me.gender?.toLowerCase?.() as any) || "undisclosed";
    setGender(["male", "female", "other", "undisclosed"].includes(g) ? (g as any) : "undisclosed");

     const d = me?.dateOfBirth ? String(me.dateOfBirth).slice(0, 10) : "";
    setBirthDate(d);

    // Si en tu API luego agregas address, aquí podrías setearlo.
    // setAddress((me as any)?.address ?? "");
  }, [me]);

  async function handleSaveProfile() {
    try {
      setSaving(true);
      // Tu servicio tipa solo { fullName?, phone? }. No enviamos gender/address para evitar TS2353.
      await updateMe({
        fullName: fullName || undefined,
        phone: phone || undefined,
      });
      setIsEditingProfile(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  function handleCancelEdit() {
    // Restaurar valores originales del perfil
    if (me) {
      setPhone(me.phone ?? "");
      const composed =
        me.fullName ??
        [me.firstName1, me.lastName1, me.lastName2].filter(Boolean).join(" ");
      setFullName(composed ?? "");
      const g = (me.gender?.toLowerCase?.() as any) || "undisclosed";
      setGender(["male", "female", "other", "undisclosed"].includes(g) ? (g as any) : "undisclosed");
      const d = me?.dateOfBirth ? String(me.dateOfBirth).slice(0, 10) : "";
      setBirthDate(d);
    }
    setIsEditingProfile(false);
  }

  // helper para iniciales del avatar
  const avatarInitial =
    (me?.fullName?.[0] ??
      me?.firstName1?.[0] ??
      me?.email?.[0] ??
      "U")?.toUpperCase?.() || "U";

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(getDashboardRoute())}>
            ← Volver
          </Button>
          <h1 className="text-2xl font-bold text-primary">Configuración</h1>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="subscriptions">Suscripciones</TabsTrigger>
          </TabsList>

          {/* ===== PERFIL ===== */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5" />
                    Información Personal
                  </div>
                  {!isEditingProfile ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingProfile(true)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Foto */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="text-2xl">
                      {avatarInitial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline">
                      <Camera className="h-4 w-4 mr-2" />
                      Cambiar Foto
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      JPG, PNG o GIF. Máximo 5MB.
                    </p>
                  </div>
                </div>

                {/* Formulario */}
                {loadingMe ? (
                  <div className="text-sm text-muted-foreground">Cargando perfil...</div>
                ) : isError ? (
                  <div className="text-sm text-red-600">No se pudo cargar tu perfil.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nombre completo */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="fullName">Nombre completo</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Tu nombre completo"
                        disabled={!isEditingProfile}
                      />
                      {!fullName && (
                        <p className="flex items-center text-xs text-red-500 gap-1">
                          <AlertTriangle className="w-3 h-3" /> Complete la información
                        </p>
                      )}
                    </div>

                    {/* Correo */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input id="email" type="email" value={me?.email ?? ""} readOnly />
                    </div>

                    {/* Teléfono */}
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+506 8888 8888"
                        disabled={!isEditingProfile}
                      />
                      {!phone && (
                        <p className="flex items-center text-xs text-red-500 gap-1">
                          <AlertTriangle className="w-3 h-3" /> Complete la información
                        </p>
                      )}
                    </div>

                    {/* Fecha nacimiento */}
                    <div className="space-y-2">
                     <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        disabled={!isEditingProfile}
                      />
                    </div>

                    {/* Género */}
                    <div className="space-y-2">
                      <Label htmlFor="gender">Género</Label>
                      <Select
                        value={gender}
                        onValueChange={(val: string) =>
                          setGender(val as "male" | "female" | "other" | "undisclosed")
                        }
                        disabled={!isEditingProfile}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un género" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Masculino</SelectItem>
                          <SelectItem value="female">Femenino</SelectItem>
                          <SelectItem value="other">Otro</SelectItem>
                          <SelectItem value="undisclosed">
                            Prefiero no decir
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {!gender && (
                        <p className="flex items-center text-xs text-red-500 gap-1">
                          <AlertTriangle className="w-3 h-3" /> Complete la información
                        </p>
                      )}
                    </div>

                    {/* Dirección */}
                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección</Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Calle Principal 123, Ciudad, País"
                        disabled={!isEditingProfile}
                      />
                      {!address && (
                        <p className="flex items-center text-xs text-red-500 gap-1">
                          <AlertTriangle className="w-3 h-3" /> Complete la información
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {isEditingProfile && (
                  <Button
                    className="w-full sm:w-auto"
                    onClick={handleSaveProfile}
                    disabled={saving || loadingMe}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Seguridad (desplegable) */}
            <Card>
              <CardHeader
                onClick={() => setShowChangePassword(!showChangePassword)}
                className="cursor-pointer select-none"
              >
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Cambiar Contraseña
                  </div>
                  {showChangePassword ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </CardTitle>
              </CardHeader>
              {showChangePassword && (
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Contraseña Actual</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="••••••••"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nueva Contraseña</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="••••••••"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                    <Input id="confirmPassword" type="password" placeholder="••••••••" />
                  </div>
                  <Button>Actualizar Contraseña</Button>
                </CardContent>
              )}
            </Card>
          </TabsContent>

          {/* ===== SUSCRIPCIONES ===== */}
          <TabsContent value="subscriptions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Mi Suscripción
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-accent rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-primary">Plan Actual</h3>
                      <p className="text-sm text-muted-foreground">Plan Gratuito</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Activo</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center justify-between">
                      <span className="text-muted-foreground">Citas mensuales:</span>
                      <span className="font-medium">2 de 2 usadas</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-muted-foreground">Próxima renovación:</span>
                      <span className="font-medium">1 de diciembre, 2025</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-muted-foreground">Precio:</span>
                      <span className="font-medium text-lg">$0.00</span>
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <h4 className="font-semibold mb-3">Actualizar Plan</h4>
                  <div className="grid gap-4">
                    {/* Plan Básico */}
                    <div className="border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-lg">Plan Básico</h5>
                        <Badge variant="outline">Popular</Badge>
                      </div>
                      <p className="text-2xl font-bold text-primary mb-2">$9.99<span className="text-sm font-normal text-muted-foreground">/mes</span></p>
                      <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                        <li>✓ 5 citas mensuales</li>
                        <li>✓ Mensajería con médicos</li>
                        <li>✓ Soporte por email</li>
                      </ul>
                      <Button className="w-full">Seleccionar Plan</Button>
                    </div>

                    {/* Plan Premium */}
                    <div className="border-2 border-primary rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-lg">Plan Premium</h5>
                        <Badge className="bg-primary text-white">Recomendado</Badge>
                      </div>
                      <p className="text-2xl font-bold text-primary mb-2">$19.99<span className="text-sm font-normal text-muted-foreground">/mes</span></p>
                      <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                        <li>✓ Citas ilimitadas</li>
                        <li>✓ Mensajería con médicos</li>
                        <li>✓ Videollamadas HD</li>
                        <li>✓ Soporte prioritario 24/7</li>
                        <li>✓ Recordatorios automáticos</li>
                      </ul>
                      <Button className="w-full">Seleccionar Plan</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Métodos de Pago */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Métodos de Pago
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <div>
                        {method.type === "card" ? (
                          <>
                            <p className="font-medium">
                              {method.brand} •••• {method.last4}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Expira {method.expiry}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="font-medium">PayPal</p>
                            <p className="text-sm text-muted-foreground">
                              {method.email}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {method.isDefault && <Badge>Predeterminado</Badge>}
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  Agregar Método de Pago
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Logout Button */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Cerrar Sesión</p>
                <p className="text-sm text-muted-foreground">
                  Cierra la sesión en este dispositivo
                </p>
              </div>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
