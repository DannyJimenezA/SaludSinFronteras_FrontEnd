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
import { useAuth } from "../contexts/AuthContext";

import { useMe } from "../hooks/useUsers";
import { updateMe, changePassword } from "../services/users";
import { COUNTRIES, getCountryById } from "../constants/countries";

import {
  User as UserIcon,
  CreditCard,
  Eye,
  EyeOff,
  Camera,
  Save,
  LogOut,
  Key,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Pencil,
  X,
  Check,
} from "lucide-react";

interface PatientSettingsProps {
  onLogout: () => void;
}

export function PatientSettings({ onLogout }: PatientSettingsProps) {
  const navigate = useNavigate();
  const { getDashboardRoute } = useAuth();

  // Perfil
  const { data: me, isLoading: loadingMe, isError } = useMe();
  const [saving, setSaving] = useState(false);
  const [birthDate, setBirthDate] = useState<string>("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Campos editables
  const [firstName, setFirstName] = useState("");
  const [lastName1, setLastName1] = useState("");
  const [lastName2, setLastName2] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other" | "undisclosed">("undisclosed");
  const [identification, setIdentification] = useState("");
  const [nationality, setNationality] = useState("");
  const [residenceCountry, setResidenceCountry] = useState("");
  const [primaryLanguage, setPrimaryLanguage] = useState("");
  const [timezone, setTimezone] = useState("");

  // Seguridad
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Campos de cambio de contraseña
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Prellenar con el perfil
  useEffect(() => {
    if (!me) return;
    setPhone(me.phone ?? "");

    // Separar en tres campos de nombre
    setFirstName(me.firstName1 ?? "");
    setLastName1(me.lastName1 ?? "");
    setLastName2(me.lastName2 ?? "");

    const g = (me.gender?.toLowerCase?.() as any) || "undisclosed";
    setGender(["male", "female", "other", "undisclosed"].includes(g) ? (g as any) : "undisclosed");

    const d = me?.dateOfBirth ? String(me.dateOfBirth).slice(0, 10) : "";
    setBirthDate(d);

    // Campos adicionales del paciente
    setIdentification((me as any)?.identification ?? "");
    setNationality((me as any)?.nationalityId ?? "");
    setResidenceCountry((me as any)?.residenceCountryId ?? "");
    setPrimaryLanguage((me as any)?.primaryLanguage ?? "");
    setTimezone((me as any)?.timezone ?? "");
  }, [me]);

  async function handleSaveProfile() {
    try {
      setSaving(true);
      await updateMe({
        firstName1: firstName || undefined,
        lastName1: lastName1 || undefined,
        lastName2: lastName2 || undefined,
        phone: phone || undefined,
        gender: gender || undefined,
        dateOfBirth: birthDate || undefined,
        identification: identification || undefined,
        nationalityId: nationality || undefined,
        residenceCountryId: residenceCountry || undefined,
        primaryLanguage: primaryLanguage || undefined,
        timezone: timezone || undefined,
      });
      setIsEditingProfile(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  function handleCancelEdit() {
    if (me) {
      setPhone(me.phone ?? "");

      // Restaurar los tres campos de nombre
      setFirstName(me.firstName1 ?? "");
      setLastName1(me.lastName1 ?? "");
      setLastName2(me.lastName2 ?? "");

      const g = (me.gender?.toLowerCase?.() as any) || "undisclosed";
      setGender(["male", "female", "other", "undisclosed"].includes(g) ? (g as any) : "undisclosed");
      const d = me?.dateOfBirth ? String(me.dateOfBirth).slice(0, 10) : "";
      setBirthDate(d);

      // Restaurar campos adicionales
      setIdentification((me as any)?.identification ?? "");
      setNationality((me as any)?.nationalityId ?? "");
      setResidenceCountry((me as any)?.residenceCountryId ?? "");
      setPrimaryLanguage((me as any)?.primaryLanguage ?? "");
      setTimezone((me as any)?.timezone ?? "");
    }
    setIsEditingProfile(false);
  }

  async function handleChangePassword() {
    // Limpiar errores previos
    setPasswordError("");

    // Validaciones
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Por favor completa todos los campos");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("La nueva contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    }

    try {
      setChangingPassword(true);

      // Llamar al servicio para cambiar la contraseña
      await changePassword(currentPassword, newPassword);

      // Limpiar campos
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowChangePassword(false);

      alert("Contraseña actualizada exitosamente");
    } catch (error: any) {
      setPasswordError(error.response?.data?.message || error.message || "Error al cambiar la contraseña");
    } finally {
      setChangingPassword(false);
    }
  }

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
                    {/* Nombre */}
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Tu nombre"
                        disabled={!isEditingProfile}
                      />
                      {!firstName && (
                        <p className="flex items-center text-xs text-red-500 gap-1">
                          <AlertTriangle className="w-3 h-3" /> Complete la información
                        </p>
                      )}
                    </div>

                    {/* Primer Apellido */}
                    <div className="space-y-2">
                      <Label htmlFor="lastName1">Primer Apellido</Label>
                      <Input
                        id="lastName1"
                        value={lastName1}
                        onChange={(e) => setLastName1(e.target.value)}
                        placeholder="Primer apellido"
                        disabled={!isEditingProfile}
                      />
                      {!lastName1 && (
                        <p className="flex items-center text-xs text-red-500 gap-1">
                          <AlertTriangle className="w-3 h-3" /> Complete la información
                        </p>
                      )}
                    </div>

                    {/* Segundo Apellido */}
                    <div className="space-y-2">
                      <Label htmlFor="lastName2">Segundo Apellido</Label>
                      <Input
                        id="lastName2"
                        value={lastName2}
                        onChange={(e) => setLastName2(e.target.value)}
                        placeholder="Segundo apellido (opcional)"
                        disabled={!isEditingProfile}
                      />
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
                    </div>

                    {/* Identificación */}
                    <div className="space-y-2">
                      <Label htmlFor="identification">Número de Identificación</Label>
                      <Input
                        id="identification"
                        value={identification}
                        onChange={(e) => setIdentification(e.target.value)}
                        placeholder="504470462"
                        disabled={!isEditingProfile}
                      />
                    </div>

                    {/* Nacionalidad */}
                    <div className="space-y-2">
                      <Label htmlFor="nationality">Nacionalidad</Label>
                      <Select
                        value={nationality}
                        onValueChange={(val: string) => setNationality(val)}
                        disabled={!isEditingProfile}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu nacionalidad">
                            {nationality ? getCountryById(nationality) : "Selecciona tu nacionalidad"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map((country) => (
                            <SelectItem key={country.id} value={country.id}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* País de Residencia */}
                    <div className="space-y-2">
                      <Label htmlFor="residenceCountry">País de Residencia</Label>
                      <Select
                        value={residenceCountry}
                        onValueChange={(val: string) => setResidenceCountry(val)}
                        disabled={!isEditingProfile}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu país de residencia">
                            {residenceCountry ? getCountryById(residenceCountry) : "Selecciona tu país de residencia"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map((country) => (
                            <SelectItem key={country.id} value={country.id}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Idioma Primario */}
                    <div className="space-y-2">
                      <Label htmlFor="primaryLanguage">Idioma Primario</Label>
                      <Select
                        value={primaryLanguage}
                        onValueChange={(val: string) => setPrimaryLanguage(val)}
                        disabled={!isEditingProfile}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un idioma" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="en">Inglés</SelectItem>
                          <SelectItem value="fr">Francés</SelectItem>
                          <SelectItem value="pt">Portugués</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Zona Horaria */}
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Zona Horaria</Label>
                      <Select
                        value={timezone}
                        onValueChange={(val: string) => setTimezone(val)}
                        disabled={!isEditingProfile}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona zona horaria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Costa_Rica">América/Costa Rica (UTC-6)</SelectItem>
                          <SelectItem value="America/Mexico_City">América/Ciudad de México (UTC-6)</SelectItem>
                          <SelectItem value="America/New_York">América/Nueva York (UTC-5)</SelectItem>
                          <SelectItem value="America/Los_Angeles">América/Los Ángeles (UTC-8)</SelectItem>
                          <SelectItem value="Europe/Madrid">Europa/Madrid (UTC+1)</SelectItem>
                        </SelectContent>
                      </Select>
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

            {/* Información de Cuenta */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Información de Cuenta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Estado de la Cuenta */}
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Estado de la Cuenta</Label>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">
                        {(me as any)?.status === "active" ? "Activa" : "Inactiva"}
                      </Badge>
                    </div>
                  </div>

                  {/* Tipo de Usuario */}
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Tipo de Usuario</Label>
                    <p className="text-sm font-medium">{me?.role === "PATIENT" ? "Paciente" : me?.role}</p>
                  </div>

                  {/* Fecha de Registro */}
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Miembro desde</Label>
                    <p className="text-sm font-medium">
                      {me?.createdAt
                        ? new Date(me.createdAt).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>

                  {/* Última Actualización */}
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Última Actualización</Label>
                    <p className="text-sm font-medium">
                      {me?.updatedAt
                        ? new Date(me.updatedAt).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>

                  {/* ID de Usuario */}
                  {/* <div className="space-y-1 md:col-span-2">
                    <Label className="text-muted-foreground">ID de Usuario</Label>
                    <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      {me?.id || "N/A"}
                    </p>
                  </div> */}
                </div>
              </CardContent>
            </Card>

            {/* Seguridad */}
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
                  {passwordError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        {passwordError}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Contraseña Actual</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
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
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
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
                    <p className="text-xs text-muted-foreground">
                      Mínimo 8 caracteres
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handleChangePassword}
                    disabled={changingPassword}
                  >
                    {changingPassword ? "Actualizando..." : "Actualizar Contraseña"}
                  </Button>
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
