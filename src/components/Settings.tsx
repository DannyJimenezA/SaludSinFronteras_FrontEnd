
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useAuth } from "../contexts/AuthContext";

import { useMe } from "../hooks/useUsers";
import { updateMe } from "../services/users";

import {
  User as UserIcon,
  Globe,
  Bell,
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
} from "lucide-react";

interface SettingsProps {
  onLogout: () => void;
}

export function Settings({ onLogout }: SettingsProps) {
  const navigate = useNavigate();
  const { getDashboardRoute } = useAuth();

  // Perfil
  const { data: me, isLoading: loadingMe, isError } = useMe();
  const [saving, setSaving] = useState(false);
  const [birthDate, setBirthDate] = useState<string>("");


  // Campos editables
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other" | "undisclosed">("undisclosed");
  const [address, setAddress] = useState("");

  // Idioma
  const [selectedLanguage, setSelectedLanguage] = useState("es");
  const [autoTranslation, setAutoTranslation] = useState(true);

  // Seguridad
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [twoFactorEnabled] = useState(false); // placeholder visual
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Notificaciones
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const languages = [
    { code: "es", name: "Español" },
    { code: "en", name: "English" },
    { code: "fr", name: "Français" },
    { code: "pt", name: "Português" },
    { code: "de", name: "Deutsch" },
    { code: "it", name: "Italiano" },
    { code: "zh", name: "中文" },
    { code: "ar", name: "العربية" },
  ];

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
    if (me.primaryLanguage) setSelectedLanguage(me.primaryLanguage);

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
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
            <TabsTrigger value="billing">Facturación</TabsTrigger>
          </TabsList>

          {/* ===== PERFIL ===== */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Información Personal
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
                      />
                      {!address && (
                        <p className="flex items-center text-xs text-red-500 gap-1">
                          <AlertTriangle className="w-3 h-3" /> Complete la información
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <Button
                  className="w-full sm:w-auto"
                  onClick={handleSaveProfile}
                  disabled={saving || loadingMe}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </CardContent>
            </Card>

            {/* Idioma */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Configuración de Idioma
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Idioma Principal</Label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Este será el idioma principal de la interfaz
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Traducción Automática</Label>
                    <p className="text-sm text-muted-foreground">
                      Traduce automáticamente las conversaciones durante las videollamadas
                    </p>
                  </div>
                  <Switch
                    checked={autoTranslation}
                    onCheckedChange={setAutoTranslation}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Idiomas Secundarios</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Selecciona los idiomas que entiendes para mejorar la traducción
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {languages
                      .filter((lang) => lang.code !== selectedLanguage)
                      .map((lang) => (
                        <div key={lang.code} className="flex items-center space-x-2">
                          <input type="checkbox" id={lang.code} className="rounded" />
                          <Label htmlFor={lang.code} className="text-sm">
                            {lang.name}
                          </Label>
                        </div>
                      ))}
                  </div>
                </div>

                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Configuración
                </Button>
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

          {/* ===== NOTIFICACIONES ===== */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Preferencias de Notificaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificaciones por Email</p>
                      <p className="text-sm text-muted-foreground">
                        Recibe recordatorios de citas y actualizaciones importantes
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificaciones SMS</p>
                      <p className="text-sm text-muted-foreground">
                        Recibe mensajes de texto para citas urgentes
                      </p>
                    </div>
                    <Switch
                      checked={smsNotifications}
                      onCheckedChange={setSmsNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificaciones Push</p>
                      <p className="text-sm text-muted-foreground">
                        Recibe notificaciones en tiempo real en tu dispositivo
                      </p>
                    </div>
                    <Switch
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== FACTURACIÓN ===== */}
          <TabsContent value="billing" className="space-y-6">
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
