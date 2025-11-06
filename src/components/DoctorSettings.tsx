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
import { getMyDoctorProfile, updateMyDoctorProfile, assignMySpecialties, getAllSpecialties, type DoctorProfile, type Specialty } from "../services/doctors";
import { api } from "../lib/api";

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
  Upload,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Trash2,
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
  const [licenseCountryId, setLicenseCountryId] = useState("");
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

  // Verificación de documentos
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState<'license' | 'diploma' | 'certification' | 'other'>('license');
  const [verificationDocuments, setVerificationDocuments] = useState<{
    id: string;
    name: string;
    type: 'license' | 'diploma' | 'certification' | 'other';
    uploadedAt: string;
    status: 'pending' | 'approved' | 'rejected';
    url?: string;
  }[]>([]);

  // Especialidades
  const [allSpecialties, setAllSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialtyIds, setSelectedSpecialtyIds] = useState<string[]>([]);
  const [loadingSpecialties, setLoadingSpecialties] = useState(false);
  const [isEditingSpecialties, setIsEditingSpecialties] = useState(false);

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
        setLicenseCountryId(profile.licenseCountryId?.toString() ?? "");
        setYearsExperience(profile.yearsExperience?.toString() ?? "");
        setBio(profile.bio ?? "");
        setSpecialties(profile.specialties ?? []);
        setSelectedSpecialtyIds(profile.specialties?.map(s => String(s.Id)) ?? []);
      } catch (error: any) {
        // Si es 404, significa que aún no tiene perfil de doctor
        if (error.response?.status === 404) {
          console.log("El doctor aún no tiene perfil profesional");
          setDoctorProfile(null);
        } else {
          console.error("Error al cargar perfil profesional:", error);
        }
      } finally {
        setLoadingDoctorProfile(false);
      }
    }
    loadDoctorProfile();
  }, []);

  // Cargar todas las especialidades disponibles
  useEffect(() => {
    async function loadSpecialties() {
      try {
        const specs = await getAllSpecialties();
        setAllSpecialties(specs);
      } catch (error) {
        console.error("Error al cargar especialidades:", error);
      }
    }
    loadSpecialties();
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
    // Validar campos requeridos
    if (!licenseNumber.trim()) {
      alert("El número de licencia médica es obligatorio");
      return;
    }

    if (!licenseCountryId) {
      alert("El país de la licencia médica es obligatorio");
      return;
    }

    try {
      setSaving(true);
      const profile = await updateMyDoctorProfile({
        licenseNumber: licenseNumber,
        licenseCountryId: Number(licenseCountryId),
        yearsExperience: yearsExperience ? Number(yearsExperience) : undefined,
        bio: bio || undefined,
      });

      // Actualizar el estado con el perfil guardado
      setDoctorProfile(profile);
      setIsEditingProfessional(false);
      alert("Perfil profesional actualizado exitosamente");
    } catch (e: any) {
      console.error(e);
      const errorMsg = e.response?.data?.message || e.message || "Error al guardar el perfil profesional";
      alert(`Error: ${Array.isArray(errorMsg) ? errorMsg.join(", ") : errorMsg}`);
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
      setLicenseCountryId(doctorProfile.licenseCountryId?.toString() ?? "");
      setYearsExperience(doctorProfile.yearsExperience?.toString() ?? "");
      setBio(doctorProfile.bio ?? "");
      setSpecialties(doctorProfile.specialties ?? []);
    } else {
      // Si no hay perfil, limpiar los campos
      setLicenseNumber("");
      setLicenseCountryId("");
      setYearsExperience("");
      setBio("");
      setSpecialties([]);
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

  async function handleUploadVerificationDocument(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tamaño (10MB máximo)
    const maxSize = 10 * 1024 * 1024; // 10MB en bytes
    if (file.size > maxSize) {
      alert('El archivo es demasiado grande. El tamaño máximo es 10MB.');
      event.target.value = '';
      return;
    }

    // Validar tipo de archivo
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('Formato de archivo no válido. Solo se aceptan PDF, JPG y PNG.');
      event.target.value = '';
      return;
    }

    try {
      setUploadingDocument(true);

      // Subir archivo al backend
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await api.post('/verification/upload-document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Agregar documento a la lista local
      const newDoc = {
        id: data.fileId,
        name: file.name,
        type: selectedDocumentType,
        uploadedAt: new Date().toISOString(),
        status: 'pending' as const,
        url: data.url,
      };

      setVerificationDocuments(prev => [...prev, newDoc]);
      alert(`Documento "${file.name}" subido exitosamente como ${getDocumentTypeLabel(selectedDocumentType)}`);
    } catch (error: any) {
      console.error('Error uploading document:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Error al subir el documento';
      alert(`Error al subir el documento: ${errorMsg}`);
    } finally {
      setUploadingDocument(false);
      // Limpiar el input
      event.target.value = '';
    }
  }

  function handleDeleteDocument(docId: string) {
    if (!confirm('¿Estás seguro de que deseas eliminar este documento?')) return;

    // TODO: Implementar eliminación real en el backend
    // await api.delete(`/doctors/verification-documents/${docId}`);

    setVerificationDocuments(prev => prev.filter(doc => doc.id !== docId));
  }

  function getDocumentTypeLabel(type: string) {
    const labels: Record<string, string> = {
      license: 'Licencia Médica',
      diploma: 'Diploma',
      certification: 'Certificación',
      other: 'Otro',
    };
    return labels[type] || type;
  }

  function getDocumentStatusBadge(status: string) {
    if (status === 'approved') {
      return <Badge className="bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />Aprobado</Badge>;
    }
    if (status === 'rejected') {
      return <Badge className="bg-red-600"><XCircle className="h-3 w-3 mr-1" />Rechazado</Badge>;
    }
    return <Badge className="bg-yellow-600"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
  }

  async function handleSaveSpecialties() {
    try {
      setLoadingSpecialties(true);
      await assignMySpecialties(selectedSpecialtyIds);

      // Recargar el perfil para obtener las especialidades actualizadas
      const profile = await getMyDoctorProfile();
      setDoctorProfile(profile);
      setSpecialties(profile.specialties ?? []);
      setIsEditingSpecialties(false);
      alert("Especialidades actualizadas exitosamente");
    } catch (error: any) {
      console.error("Error al guardar especialidades:", error);
      alert("Error al guardar especialidades. Por favor intenta nuevamente.");
    } finally {
      setLoadingSpecialties(false);
    }
  }

  function handleToggleSpecialty(specialtyId: string) {
    setSelectedSpecialtyIds(prev => {
      if (prev.includes(specialtyId)) {
        return prev.filter(id => id !== specialtyId);
      } else {
        return [...prev, specialtyId];
      }
    });
  }

  async function handleSubmitVerification() {
    if (verificationDocuments.length === 0) {
      alert("Debes subir al menos un documento antes de enviar para verificación");
      return;
    }

    try {
      setSaving(true);

      // Preparar los datos según el formato esperado por el backend
      const certificationDocuments = verificationDocuments.map(doc => doc.url);

      await api.post('/verification/submit', {
        CertificationDocuments: certificationDocuments,
        Notes: `Documentos de verificación profesional. Tipos: ${verificationDocuments.map(d => getDocumentTypeLabel(d.type)).join(', ')}`,
      });

      alert("¡Documentos enviados exitosamente! Tu solicitud de verificación está siendo revisada por nuestro equipo. Recibirás una respuesta en un plazo de 48 horas.");

      // Recargar el perfil del doctor para actualizar el estado de verificación
      const profile = await getMyDoctorProfile();
      setDoctorProfile(profile);
    } catch (error: any) {
      console.error("Error al enviar verificación:", error);
      const errorMsg = error.response?.data?.message || error.message || "Error al enviar la verificación";
      alert(`Error: ${Array.isArray(errorMsg) ? errorMsg.join(", ") : errorMsg}`);
    } finally {
      setSaving(false);
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
                      {!licenseNumber && isEditingProfessional && (
                        <p className="flex items-center text-xs text-red-500 gap-1">
                          <AlertTriangle className="w-3 h-3" /> Campo obligatorio
                        </p>
                      )}
                    </div>

                    {/* País de Licencia */}
                    <div className="space-y-2">
                      <Label htmlFor="licenseCountry" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        País de Licencia Médica
                      </Label>
                      <Select
                        value={licenseCountryId}
                        onValueChange={(val) => setLicenseCountryId(val)}
                        disabled={!isEditingProfessional}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el país">
                            {licenseCountryId ? getCountryById(licenseCountryId) : "Selecciona el país"}
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
                      {!licenseCountryId && isEditingProfessional && (
                        <p className="flex items-center text-xs text-red-500 gap-1">
                          <AlertTriangle className="w-3 h-3" /> Campo obligatorio
                        </p>
                      )}
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
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2">
                          <Stethoscope className="h-4 w-4" />
                          Especialidades
                        </Label>
                        {!isEditingSpecialties && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditingSpecialties(true)}
                            disabled={isEditingProfessional}
                          >
                            <Pencil className="h-3 w-3 mr-2" />
                            Editar
                          </Button>
                        )}
                      </div>

                      {isEditingSpecialties ? (
                        <div className="space-y-3">
                          <div className="p-4 border rounded-lg max-h-60 overflow-y-auto">
                            {allSpecialties.length === 0 ? (
                              <p className="text-sm text-muted-foreground">Cargando especialidades...</p>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {allSpecialties.map((spec) => (
                                  <label
                                    key={spec.Id}
                                    className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedSpecialtyIds.includes(String(spec.Id))}
                                      onChange={() => handleToggleSpecialty(String(spec.Id))}
                                      className="rounded"
                                    />
                                    <span className="text-sm">{spec.Name}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={handleSaveSpecialties}
                              disabled={loadingSpecialties}
                              size="sm"
                            >
                              {loadingSpecialties ? "Guardando..." : "Guardar Especialidades"}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSelectedSpecialtyIds(specialties.map(s => String(s.Id)));
                                setIsEditingSpecialties(false);
                              }}
                              size="sm"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {specialties.map((specialty) => (
                            <Badge key={specialty.Id} variant="secondary">
                              {specialty.Name}
                            </Badge>
                          ))}
                          {specialties.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                              No hay especialidades agregadas. Haz clic en "Editar" para agregar.
                            </p>
                          )}
                        </div>
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
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
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

            {/* Documentos de Verificación */}
            {!loadingDoctorProfile && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Documentos de Verificación
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Notificación de Perfil Verificado */}
                  {doctorProfile?.verificationStatus === "approved" && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-900 mb-1">
                            Perfil Verificado
                          </h4>
                          <p className="text-sm text-green-700">
                            Tu perfil ha sido verificado exitosamente. Los documentos están bloqueados y no pueden ser modificados o eliminados. Si necesitas actualizar algún documento, por favor contacta con soporte.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Instrucciones - Solo mostrar si NO está verificado */}
                  {doctorProfile?.verificationStatus !== "approved" && (
                    <>
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">
                          Documentos requeridos para verificación
                        </h4>
                        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                          <li>Licencia médica vigente (obligatorio)</li>
                          <li>Diploma de título médico (obligatorio)</li>
                          <li>Certificaciones de especialidades (opcional)</li>
                          <li>Otros documentos relevantes (opcional)</li>
                        </ul>
                        <p className="text-xs text-blue-600 mt-3">
                          Formatos aceptados: PDF, JPG, PNG. Tamaño máximo: 10MB por archivo.
                        </p>
                      </div>

                      {/* Subir Documentos */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Tipo de Documento */}
                          <div className="space-y-2">
                            <Label htmlFor="document-type">Tipo de Documento</Label>
                            <Select
                              value={selectedDocumentType}
                              onValueChange={(val) => setSelectedDocumentType(val as 'license' | 'diploma' | 'certification' | 'other')}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona el tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="license">Licencia Médica</SelectItem>
                                <SelectItem value="diploma">Diploma</SelectItem>
                                <SelectItem value="certification">Certificación</SelectItem>
                                <SelectItem value="other">Otro</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Subir Archivo */}
                          <div className="space-y-2">
                            <Label htmlFor="document-upload">Seleccionar Archivo</Label>
                            <Input
                              id="document-upload"
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={handleUploadVerificationDocument}
                              disabled={uploadingDocument}
                              className="text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {uploadingDocument && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                          Subiendo documento...
                        </div>
                      )}
                    </>
                  )}

                  {/* Lista de Documentos Subidos */}
                  {verificationDocuments.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Documentos subidos</h4>
                      <div className="space-y-2">
                        {verificationDocuments.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{doc.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {getDocumentTypeLabel(doc.type)}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(doc.uploadedAt).toLocaleDateString('es-ES')}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {getDocumentStatusBadge(doc.status)}
                              {doc.url && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(doc.url, '_blank')}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              )}
                              {/* Solo mostrar botón de eliminar si NO está verificado */}
                              {doctorProfile?.verificationStatus !== "approved" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteDocument(doc.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {verificationDocuments.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">
                        No has subido documentos de verificación aún
                      </p>
                      <p className="text-xs mt-1">
                        Sube tus documentos para iniciar el proceso de verificación
                      </p>
                    </div>
                  )}

                  {/* Botón de enviar verificación */}
                  {verificationDocuments.length > 0 && doctorProfile?.verificationStatus !== "approved" && (
                    <div className="pt-4 border-t">
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={handleSubmitVerification}
                      >
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        Enviar para Verificación
                      </Button>
                      <p className="text-xs text-center text-muted-foreground mt-2">
                        Un miembro de nuestro equipo revisará tus documentos en un plazo de 48 horas
                      </p>
                    </div>
                  )}
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
