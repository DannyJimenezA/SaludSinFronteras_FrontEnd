import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
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
import { getMyDoctorProfile, updateMyDoctorProfile, type DoctorProfile, type Specialty } from "../services/doctors";

import {
  User as UserIcon,
  Briefcase,
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
  Stethoscope,
  FileText,
  Calendar,
} from "lucide-react";

interface DoctorSettingsProps {
  onLogout: () => void;
}

export function DoctorSettings({ onLogout }: DoctorSettingsProps) {
  const navigate = useNavigate();
  const { getDashboardRoute } = useAuth();

  // Perfil
  const { data: me, isLoading: loadingMe, isError } = useMe();
  const [saving, setSaving] = useState(false);
  const [birthDate, setBirthDate] = useState<string>("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingProfessional, setIsEditingProfessional] = useState(false);

  // Campos editables - Personales
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

  // Campos editables - Profesionales
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
  const [loadingDoctorProfile, setLoadingDoctorProfile] = useState(true);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [bio, setBio] = useState("");
  const [specialties, setSpecialties] = useState<Specialty[]>([]);

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

    // Campos adicionales del doctor
    setIdentification((me as any)?.identification ?? "");
    setNationality((me as any)?.nationalityId ?? "");
    setResidenceCountry((me as any)?.residenceCountryId ?? "");
    setPrimaryLanguage((me as any)?.primaryLanguage ?? "");
    setTimezone((me as any)?.timezone ?? "");
  }, [me]);

  // Cargar perfil profesional del doctor
  useEffect(() => {
    async function loadDoctorProfile() {
      try {
        setLoadingDoctorProfile(true);
        const profile = await getMyDoctorProfile();
        setDoctorProfile(profile);

        // Prellenar campos profesionales
        setLicenseNumber(profile.licenseNumber ?? "");
        setYearsExperience(profile.yearsExperience?.toString() ?? "");
        setBio(profile.bio ?? "");
        setSpecialties(profile.specialties ?? []);
      } catch (error) {
        console.error("Error al cargar perfil profesional:", error);
      } finally {
        setLoadingDoctorProfile(false);
      }
    }
    loadDoctorProfile();
  }, []);

  async function handleSaveProfile() {
    try {
      setSaving(true);

      // Construir el FullName automáticamente
      const fullNameParts = [firstName, lastName1, lastName2].filter(Boolean);
      const fullName = fullNameParts.join(" ");

      await updateMe({
        fullName: fullName || undefined,
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

  async function handleSaveProfessional() {
    try {
      setSaving(true);
      await updateMyDoctorProfile({
        licenseNumber: licenseNumber || undefined,
        yearsExperience: yearsExperience ? Number(yearsExperience) : undefined,
        bio: bio || undefined,
        specialtyIds: specialties.map(s => String(s.Id)),
      });
      setIsEditingProfessional(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  function handleCancelEditProfile() {
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

  function handleCancelEditProfessional() {
    // Restaurar valores originales del perfil profesional
    if (doctorProfile) {
      setLicenseNumber(doctorProfile.licenseNumber ?? "");
      setYearsExperience(doctorProfile.yearsExperience?.toString() ?? "");
      setBio(doctorProfile.bio ?? "");
      setSpecialties(doctorProfile.specialties ?? []);
    }
    setIsEditingProfessional(false);
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
      "D")?.toUpperCase?.() || "D";

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(getDashboardRoute())}>
            ← Volver
          </Button>
          <h1 className="text-2xl font-bold text-primary">Configuración Profesional</h1>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Perfil Personal</TabsTrigger>
            <TabsTrigger value="professional">Perfil Profesional</TabsTrigger>
          </TabsList>

          {/* ===== PERFIL PERSONAL ===== */}
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
                      onClick={handleCancelEditProfile}
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
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
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
                      {!firstName && isEditingProfile && (
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
                      {!lastName1 && isEditingProfile && (
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
                      {!phone && isEditingProfile && (
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

          {/* ===== PERFIL PROFESIONAL ===== */}
          <TabsContent value="professional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Información Profesional
                  </div>
                  {!isEditingProfessional ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingProfessional(true)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEditProfessional}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {loadingDoctorProfile ? (
                  <div className="text-sm text-muted-foreground">Cargando perfil profesional...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Número de Licencia */}
                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Número de Licencia Médica
                      </Label>
                      <Input
                        id="licenseNumber"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        placeholder="MED-12345"
                        disabled={!isEditingProfessional}
                      />
                    </div>

                    {/* Años de Experiencia */}
                    <div className="space-y-2">
                      <Label htmlFor="yearsExperience" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Años de Experiencia
                      </Label>
                      <Input
                        id="yearsExperience"
                        type="number"
                        value={yearsExperience}
                        onChange={(e) => setYearsExperience(e.target.value)}
                        placeholder="10"
                        disabled={!isEditingProfessional}
                      />
                    </div>

                    {/* Especialidades */}
                    <div className="space-y-2 md:col-span-2">
                      <Label className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4" />
                        Especialidades
                      </Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {specialties.map((specialty) => (
                          <Badge key={specialty.Id} variant="secondary">
                            {specialty.Name}
                          </Badge>
                        ))}
                        {specialties.length === 0 && (
                          <p className="text-sm text-muted-foreground">
                            No hay especialidades agregadas
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Biografía */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bio">Biografía Profesional</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Describe tu experiencia, áreas de interés, y enfoque en la atención médica..."
                        rows={6}
                        disabled={!isEditingProfessional}
                      />
                      <p className="text-xs text-muted-foreground">
                        Esta información será visible para los pacientes
                      </p>
                    </div>
                  </div>
                )}

                {isEditingProfessional && (
                  <Button
                    className="w-full sm:w-auto"
                    onClick={handleSaveProfessional}
                    disabled={saving}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Estado de Verificación */}
            {!loadingDoctorProfile && doctorProfile && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Estado de Verificación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {doctorProfile.verificationStatus === "approved" ? (
                      <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Badge className="h-6 w-6 bg-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-green-900">Verificación Aprobada</p>
                            <p className="text-sm text-green-700">
                              Tu perfil profesional ha sido verificado
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-green-600">Verificado</Badge>
                      </div>
                    ) : doctorProfile.verificationStatus === "pending" ? (
                      <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <AlertTriangle className="h-6 w-6 text-yellow-600" />
                          </div>
                          <div>
                            <p className="font-medium text-yellow-900">Verificación Pendiente</p>
                            <p className="text-sm text-yellow-700">
                              Tu perfil está siendo revisado
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-yellow-600">Pendiente</Badge>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <AlertTriangle className="h-6 w-6 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Sin Verificar</p>
                            <p className="text-sm text-gray-700">
                              Completa tu perfil para iniciar verificación
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">Sin Verificar</Badge>
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      <p>
                        {doctorProfile.verificationStatus === "approved"
                          ? "Tu licencia médica y credenciales han sido verificadas por nuestro equipo. Si necesitas actualizar algún documento, contacta con soporte."
                          : "Nuestro equipo revisará tu información profesional. Este proceso puede tardar hasta 48 horas."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
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
