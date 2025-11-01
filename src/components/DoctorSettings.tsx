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
import { updateMe } from "../services/users";

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
  GraduationCap,
  FileText,
  Calendar,
  Clock,
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
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other" | "undisclosed">("undisclosed");

  // Campos editables - Profesionales
  const [licenseNumber, setLicenseNumber] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [medicalSchool, setMedicalSchool] = useState("");
  const [bio, setBio] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);

  // Seguridad
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Prellenar con el perfil
  useEffect(() => {
    if (!me) return;
    setPhone(me.phone ?? "");

    const composed =
      me.fullName ??
      [me.firstName1, me.lastName1, me.lastName2].filter(Boolean).join(" ");
    setFullName(composed ?? "");

    const g = (me.gender?.toLowerCase?.() as any) || "undisclosed";
    setGender(["male", "female", "other", "undisclosed"].includes(g) ? (g as any) : "undisclosed");

    const d = me?.dateOfBirth ? String(me.dateOfBirth).slice(0, 10) : "";
    setBirthDate(d);

    // Campos profesionales (estos vendrían del perfil de doctor)
    // setLicenseNumber((me as any)?.doctorProfile?.licenseNumber ?? "");
    // setYearsExperience((me as any)?.doctorProfile?.yearsExperience?.toString() ?? "");
    // setMedicalSchool((me as any)?.doctorProfile?.medicalSchool ?? "");
    // setBio((me as any)?.doctorProfile?.bio ?? "");
    // setSpecialties((me as any)?.doctorProfile?.specialties ?? []);
  }, [me]);

  async function handleSaveProfile() {
    try {
      setSaving(true);
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

  async function handleSaveProfessional() {
    try {
      setSaving(true);
      // Aquí iría la llamada para actualizar el perfil profesional
      // await updateDoctorProfile({ licenseNumber, yearsExperience, medicalSchool, bio });
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

  function handleCancelEditProfessional() {
    // Restaurar valores originales
    setIsEditingProfessional(false);
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Perfil Personal</TabsTrigger>
            <TabsTrigger value="professional">Perfil Profesional</TabsTrigger>
            <TabsTrigger value="availability">Disponibilidad</TabsTrigger>
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
                    {/* Nombre completo */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="fullName">Nombre completo</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Dr. Juan Pérez González"
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

                  {/* Escuela de Medicina */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="medicalSchool" className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Escuela de Medicina
                    </Label>
                    <Input
                      id="medicalSchool"
                      value={medicalSchool}
                      onChange={(e) => setMedicalSchool(e.target.value)}
                      placeholder="Universidad de Costa Rica"
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
                      {specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary">
                          {specialty}
                          {isEditingProfessional && (
                            <button
                              onClick={() =>
                                setSpecialties(specialties.filter((_, i) => i !== index))
                              }
                              className="ml-2 hover:text-destructive"
                            >
                              ×
                            </button>
                          )}
                        </Badge>
                      ))}
                      {specialties.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          No hay especialidades agregadas
                        </p>
                      )}
                    </div>
                    {isEditingProfessional && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Aquí iría un modal o dropdown para agregar especialidades
                          const newSpecialty = prompt("Ingrese la especialidad:");
                          if (newSpecialty) {
                            setSpecialties([...specialties, newSpecialty]);
                          }
                        }}
                      >
                        Agregar Especialidad
                      </Button>
                    )}
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Estado de Verificación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
                  <div className="text-sm text-muted-foreground">
                    <p>
                      Tu licencia médica y credenciales han sido verificadas por nuestro equipo.
                      Si necesitas actualizar algún documento, contacta con soporte.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== DISPONIBILIDAD ===== */}
          <TabsContent value="availability" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Horarios de Atención
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Configura tu disponibilidad para recibir citas de pacientes.
                  </p>
                  <Button onClick={() => navigate("/availability")}>
                    Gestionar Disponibilidad
                  </Button>
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
