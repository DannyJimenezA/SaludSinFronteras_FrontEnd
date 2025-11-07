import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useAuth } from "../contexts/AuthContext";

import { useMe } from "../hooks/useUsers";
import { updateMe, changePassword } from "../services/users";
import { COUNTRIES, getCountryById } from "../constants/countries";
import {
  listAllUsers,
  updateUser,
  deleteUser,
  type AdminUser,
  listSubscriptionPlans,
  seedSubscriptionPlans,
  type SubscriptionPlan,
  listSpecialties,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty,
  type Specialty
} from "../services/admin";
import { api } from "../lib/api";

import {
  User as UserIcon,
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
  Users,
  Stethoscope,
  CreditCard,
  Search,
  Trash2,
  Check,
  Ban,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  DollarSign,
  Calendar,
  RefreshCw,
  CheckCircle,
  XCircle,
  Plus,
} from "lucide-react";

interface AdminSettingsProps {
  onLogout: () => void;
}

export function AdminSettings({ onLogout }: AdminSettingsProps) {
  const navigate = useNavigate();
  const { getDashboardRoute } = useAuth();

  // Perfil
  const { data: me, isLoading: loadingMe, isError } = useMe();
  const [saving, setSaving] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Campos editables - Personales
  const [firstName, setFirstName] = useState("");
  const [lastName1, setLastName1] = useState("");
  const [lastName2, setLastName2] = useState("");
  const [phone, setPhone] = useState("");

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

  // Gestión de usuarios
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [verificationFilter, setVerificationFilter] = useState<string>("ALL");
  const [editingUserId, setEditingUserId] = useState<string | number | null>(null);
  const [editingUserData, setEditingUserData] = useState<Partial<AdminUser>>({});

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [hasLoadedUsers, setHasLoadedUsers] = useState(false);

  // Gestión de planes de suscripción
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [hasLoadedPlans, setHasLoadedPlans] = useState(false);

  // Gestión de especialidades
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loadingSpecialties, setLoadingSpecialties] = useState(false);
  const [hasLoadedSpecialties, setHasLoadedSpecialties] = useState(false);
  const [editingSpecialtyId, setEditingSpecialtyId] = useState<string | null>(null);
  const [editingSpecialtyName, setEditingSpecialtyName] = useState("");
  const [newSpecialtyName, setNewSpecialtyName] = useState("");
  const [isAddingSpecialty, setIsAddingSpecialty] = useState(false);

  // Prellenar con el perfil
  useEffect(() => {
    if (!me) return;
    setPhone(me.phone ?? "");

    // Separar en tres campos de nombre
    setFirstName(me.firstName1 ?? "");
    setLastName1(me.lastName1 ?? "");
    setLastName2(me.lastName2 ?? "");
  }, [me]);

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
      });
      setIsEditingProfile(false);
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

  // ========== Funciones de gestión de usuarios ==========

  async function loadUsers(page?: number) {
    try {
      setLoadingUsers(true);
      const pageToLoad = typeof page === 'number' ? page : (typeof currentPage === 'number' ? currentPage : 1);

      const filters = {
        page: pageToLoad,
        limit: usersPerPage,
        ...(roleFilter !== "ALL" && { role: roleFilter }),
        ...(verificationFilter !== "ALL" && { verificationStatus: verificationFilter }),
        ...(searchTerm && { search: searchTerm }),
      };

      const response = await listAllUsers(filters);
      setUsers(response.users);
      setTotalPages(response.pages);
      setTotalUsers(response.total);
      setCurrentPage(pageToLoad);
      setHasLoadedUsers(true);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      setUsers([]);
      setTotalPages(1);
      setTotalUsers(0);
    } finally {
      setLoadingUsers(false);
    }
  }

  // Cargar usuarios automáticamente al montar el componente
  useEffect(() => {
    if (!hasLoadedUsers) {
      loadUsers(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recargar cuando cambian los filtros (solo si ya se han cargado antes)
  useEffect(() => {
    if (hasLoadedUsers) {
      loadUsers(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, roleFilter, verificationFilter, usersPerPage]);

  async function handleUpdateUser(userId: string | number) {
    try {
      // Nota: El backend actualmente no soporta actualización directa de usuarios
      // Solo permite ban/unban y eliminación
      await updateUser(userId, {
        fullName: editingUserData.fullName,
        email: editingUserData.email,
        phone: editingUserData.phone,
        role: editingUserData.role,
      });
      await loadUsers();
      setEditingUserId(null);
      setEditingUserData({});
      alert("Usuario actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      alert("Error al actualizar usuario");
    }
  }

  async function handleDeleteUser(userId: string | number) {
    if (!confirm("¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      await deleteUser(userId);
      await loadUsers();
      alert("Usuario eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Error al eliminar usuario");
    }
  }

  async function handleToggleBan(userId: string | number, isBanned: boolean) {
    const action = isBanned ? "desbanear" : "banear";
    if (!confirm(`¿Estás seguro de ${action} este usuario?`)) {
      return;
    }

    try {
      if (isBanned) {
        // Desbanear usuario
        await api.post(`/admin/users/${userId}/unban`);
      } else {
        // Banear usuario
        const reason = prompt("Ingrese la razón del baneo:");
        if (!reason) return;
        await api.post(`/admin/users/${userId}/ban`, { Reason: reason });
      }
      await loadUsers();
      alert(`Usuario ${action}do exitosamente`);
    } catch (error) {
      console.error(`Error al ${action} usuario:`, error);
      alert(`Error al ${action} usuario`);
    }
  }

  function startEditUser(user: AdminUser) {
    setEditingUserId(user.id);
    setEditingUserData({ ...user });
  }

  function cancelEditUser() {
    setEditingUserId(null);
    setEditingUserData({});
  }

  // Los usuarios ya vienen filtrados del backend, solo mostrarlos
  const filteredUsers = users;

  // ==================== FUNCIONES PARA PLANES DE SUSCRIPCIÓN ====================

  async function loadPlans() {
    try {
      setLoadingPlans(true);
      const plansData = await listSubscriptionPlans();
      setPlans(plansData);
      setHasLoadedPlans(true);
    } catch (error) {
      console.error("Error al cargar planes:", error);
      setPlans([]);
    } finally {
      setLoadingPlans(false);
    }
  }

  // Cargar planes automáticamente al montar el componente
  useEffect(() => {
    if (!hasLoadedPlans) {
      loadPlans();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSeedPlans() {
    if (!confirm("¿Estás seguro de reinicializar los planes? Esto creará los 3 planes por defecto (Basic, Professional, Premium).")) {
      return;
    }

    try {
      setLoadingPlans(true);
      const result = await seedSubscriptionPlans();
      alert(result.message || "Planes inicializados exitosamente");
      await loadPlans(); // Recargar la lista
    } catch (error: any) {
      console.error("Error al inicializar planes:", error);
      alert(error.response?.data?.message || "Error al inicializar planes");
    } finally {
      setLoadingPlans(false);
    }
  }

  function formatPrice(priceCents: number, currency: string): string {
    const price = priceCents / 100;
    if (currency === "USD") {
      return `$${price.toFixed(2)}`;
    }
    return `${price.toFixed(2)} ${currency}`;
  }

  // ==================== FUNCIONES PARA ESPECIALIDADES ====================

  async function loadSpecialties() {
    try {
      console.log('Iniciando carga de especialidades...');
      setLoadingSpecialties(true);
      const specialtiesData = await listSpecialties();
      console.log('Especialidades recibidas:', specialtiesData);
      console.log('Número de especialidades:', specialtiesData?.length);
      setSpecialties(specialtiesData);
      setHasLoadedSpecialties(true);
    } catch (error) {
      console.error("Error al cargar especialidades:", error);
      setSpecialties([]);
    } finally {
      setLoadingSpecialties(false);
    }
  }

  // Cargar especialidades automáticamente al montar el componente
  useEffect(() => {
    if (!hasLoadedSpecialties) {
      loadSpecialties();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreateSpecialty() {
    if (!newSpecialtyName.trim()) {
      alert("Por favor ingresa un nombre para la especialidad");
      return;
    }

    try {
      setLoadingSpecialties(true);
      await createSpecialty(newSpecialtyName.trim());
      setNewSpecialtyName("");
      setIsAddingSpecialty(false);
      await loadSpecialties();
      alert("Especialidad creada exitosamente");
    } catch (error: any) {
      console.error("Error al crear especialidad:", error);
      alert(error.response?.data?.message || "Error al crear especialidad");
    } finally {
      setLoadingSpecialties(false);
    }
  }

  async function handleUpdateSpecialty(id: string) {
    if (!editingSpecialtyName.trim()) {
      alert("El nombre no puede estar vacío");
      return;
    }

    try {
      setLoadingSpecialties(true);
      await updateSpecialty(id, editingSpecialtyName.trim());
      setEditingSpecialtyId(null);
      setEditingSpecialtyName("");
      await loadSpecialties();
      alert("Especialidad actualizada exitosamente");
    } catch (error: any) {
      console.error("Error al actualizar especialidad:", error);
      alert(error.response?.data?.message || "Error al actualizar especialidad");
    } finally {
      setLoadingSpecialties(false);
    }
  }

  async function handleDeleteSpecialty(id: string, name: string) {
    if (!confirm(`¿Estás seguro de eliminar la especialidad "${name}"?\n\nNOTA: Solo se puede eliminar si no hay doctores asociados a esta especialidad.`)) {
      return;
    }

    try {
      setLoadingSpecialties(true);
      await deleteSpecialty(id);
      await loadSpecialties();
      alert("Especialidad eliminada exitosamente");
    } catch (error: any) {
      console.error("Error al eliminar especialidad:", error);
      const errorMsg = error.response?.data?.message || "Error al eliminar especialidad";
      if (errorMsg.includes("associated doctors")) {
        alert("No se puede eliminar esta especialidad porque hay doctores asociados a ella. Por favor, primero reasigna o elimina los doctores.");
      } else {
        alert(errorMsg);
      }
    } finally {
      setLoadingSpecialties(false);
    }
  }

  function startEditSpecialty(specialty: Specialty) {
    setEditingSpecialtyId(specialty.Id);
    setEditingSpecialtyName(specialty.Name);
  }

  function cancelEditSpecialty() {
    setEditingSpecialtyId(null);
    setEditingSpecialtyName("");
  }

  const avatarInitial =
    (me?.fullName?.[0] ??
      me?.firstName1?.[0] ??
      me?.email?.[0] ??
      "A")?.toUpperCase?.() || "A";

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(getDashboardRoute())}>
            ← Volver
          </Button>
          <h1 className="text-2xl font-bold text-primary">Configuración de Administrador</h1>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Mi Perfil</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="specialties">Especialidades</TabsTrigger>
            <TabsTrigger value="plans">Planes</TabsTrigger>
          </TabsList>

          {/* ===== MI PERFIL ===== */}
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

                    {/* Rol */}
                    <div className="space-y-2">
                      <Label>Rol</Label>
                      <div className="flex items-center h-10">
                        <Badge className="bg-purple-600">Administrador</Badge>
                      </div>
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

          {/* ===== GESTIÓN DE USUARIOS ===== */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Gestión de Usuarios
                  </div>
                  <Button onClick={() => loadUsers(1)} size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Cargar Usuarios
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Filtros y búsqueda */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Búsqueda */}
                  <div className="space-y-2">
                    <Label htmlFor="search">Buscar</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Nombre o email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Filtro por rol */}
                  <div className="space-y-2">
                    <Label htmlFor="roleFilter">Rol</Label>
                    <select
                      id="roleFilter"
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    >
                      <option value="ALL">Todos los roles</option>
                      <option value="PATIENT">Pacientes</option>
                      <option value="DOCTOR">Doctores</option>
                      <option value="ADMIN">Administradores</option>
                    </select>
                  </div>

                  {/* Filtro por estado de verificación */}
                  <div className="space-y-2">
                    <Label htmlFor="verificationFilter">Verificación (Doctores)</Label>
                    <select
                      id="verificationFilter"
                      value={verificationFilter}
                      onChange={(e) => setVerificationFilter(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    >
                      <option value="ALL">Todos</option>
                      <option value="pending">Pendiente</option>
                      <option value="approved">Aprobado</option>
                      <option value="rejected">Rechazado</option>
                    </select>
                  </div>
                </div>

                {/* Lista de usuarios */}
                {loadingUsers ? (
                  <div className="text-center py-12 text-muted-foreground">
                    Cargando usuarios...
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="font-medium mb-2">No se encontraron usuarios</p>
                    <p className="text-sm">Intenta ajustar los filtros o haz clic en "Cargar Usuarios"</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Mostrando {filteredUsers.length} de {totalUsers} usuario(s)
                      </p>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="usersPerPage" className="text-sm">Por página:</Label>
                        <select
                          id="usersPerPage"
                          value={usersPerPage}
                          onChange={(e) => setUsersPerPage(Number(e.target.value))}
                          className="h-9 px-3 rounded-md border border-input bg-background text-sm"
                        >
                          <option value="10">10</option>
                          <option value="20">20</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                      </div>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium">Nombre</th>
                              <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                              <th className="px-4 py-3 text-left text-sm font-medium">Rol</th>
                              <th className="px-4 py-3 text-left text-sm font-medium">Verificación</th>
                              <th className="px-4 py-3 text-left text-sm font-medium">Teléfono</th>
                              <th className="px-4 py-3 text-right text-sm font-medium">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {filteredUsers.map((user) => (
                              <tr key={user.id} className="hover:bg-muted/30">
                                {editingUserId === user.id ? (
                                  <>
                                    <td className="px-4 py-3">
                                      <Input
                                        value={editingUserData.fullName || ""}
                                        onChange={(e) =>
                                          setEditingUserData({ ...editingUserData, fullName: e.target.value })
                                        }
                                        className="h-8"
                                      />
                                    </td>
                                    <td className="px-4 py-3">
                                      <Input
                                        value={editingUserData.email || ""}
                                        onChange={(e) =>
                                          setEditingUserData({ ...editingUserData, email: e.target.value })
                                        }
                                        className="h-8"
                                      />
                                    </td>
                                    <td className="px-4 py-3">
                                      <select
                                        value={editingUserData.role || ""}
                                        onChange={(e) =>
                                          setEditingUserData({ ...editingUserData, role: e.target.value as any })
                                        }
                                        className="h-8 px-2 rounded-md border border-input bg-background"
                                      >
                                        <option value="PATIENT">Paciente</option>
                                        <option value="DOCTOR">Doctor</option>
                                        <option value="ADMIN">Admin</option>
                                      </select>
                                    </td>
                                    <td className="px-4 py-3">
                                      <span className="text-sm text-muted-foreground">No editable</span>
                                    </td>
                                    <td className="px-4 py-3">
                                      <Input
                                        value={editingUserData.phone || ""}
                                        onChange={(e) =>
                                          setEditingUserData({ ...editingUserData, phone: e.target.value })
                                        }
                                        className="h-8"
                                      />
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="flex items-center justify-end gap-2">
                                        <Button
                                          size="sm"
                                          onClick={() => handleUpdateUser(user.id)}
                                          className="h-8"
                                        >
                                          <Check className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={cancelEditUser}
                                          className="h-8"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td className="px-4 py-3 text-sm">{user.fullName || "N/A"}</td>
                                    <td className="px-4 py-3 text-sm">{user.email || "N/A"}</td>
                                    <td className="px-4 py-3">
                                      <Badge
                                        className={
                                          user.role === "ADMIN"
                                            ? "bg-purple-600"
                                            : user.role === "DOCTOR"
                                            ? "bg-blue-600"
                                            : "bg-green-600"
                                        }
                                      >
                                        {user.role === "ADMIN"
                                          ? "Admin"
                                          : user.role === "DOCTOR"
                                          ? "Doctor"
                                          : "Paciente"}
                                      </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="flex flex-col gap-1">
                                        <Badge
                                          className={user.isEmailVerified ? "bg-green-600" : "bg-gray-600"}
                                        >
                                          {user.isEmailVerified ? "Email ✓" : "Email ✗"}
                                        </Badge>
                                        {user.role === "DOCTOR" && user.verificationStatus && (
                                          <Badge
                                            className={
                                              user.verificationStatus === "approved"
                                                ? "bg-green-600"
                                                : user.verificationStatus === "pending"
                                                ? "bg-yellow-600"
                                                : "bg-red-600"
                                            }
                                          >
                                            {user.verificationStatus === "approved"
                                              ? "Aprobado"
                                              : user.verificationStatus === "pending"
                                              ? "Pendiente"
                                              : "Rechazado"}
                                          </Badge>
                                        )}
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm">{user.phone || "N/A"}</td>
                                    <td className="px-4 py-3">
                                      <div className="flex items-center justify-end gap-2">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => startEditUser(user)}
                                        >
                                          <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleToggleBan(user.id, user.isBanned || false)}
                                          title={user.isBanned ? "Desbanear usuario" : "Banear usuario"}
                                        >
                                          {user.isBanned ? (
                                            <Check className="h-4 w-4" />
                                          ) : (
                                            <Ban className="h-4 w-4" />
                                          )}
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleDeleteUser(user.id)}
                                          className="text-red-600 hover:bg-red-50"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </td>
                                  </>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Controles de Paginación */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          Página {currentPage} de {totalPages}
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Primera página */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => loadUsers(1)}
                            disabled={currentPage === 1 || loadingUsers}
                            title="Primera página"
                          >
                            <ChevronsLeft className="h-4 w-4" />
                          </Button>

                          {/* Página anterior */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => loadUsers(currentPage - 1)}
                            disabled={currentPage === 1 || loadingUsers}
                            title="Página anterior"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>

                          {/* Números de página */}
                          <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              // Mostrar páginas alrededor de la página actual
                              let pageNum;
                              if (totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (currentPage <= 3) {
                                pageNum = i + 1;
                              } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                              } else {
                                pageNum = currentPage - 2 + i;
                              }

                              return (
                                <Button
                                  key={pageNum}
                                  variant={currentPage === pageNum ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => loadUsers(pageNum)}
                                  disabled={loadingUsers}
                                  className="min-w-[2.5rem]"
                                >
                                  {pageNum}
                                </Button>
                              );
                            })}
                          </div>

                          {/* Página siguiente */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => loadUsers(currentPage + 1)}
                            disabled={currentPage === totalPages || loadingUsers}
                            title="Página siguiente"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>

                          {/* Última página */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => loadUsers(totalPages)}
                            disabled={currentPage === totalPages || loadingUsers}
                            title="Última página"
                          >
                            <ChevronsRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== GESTIÓN DE ESPECIALIDADES ===== */}
          <TabsContent value="specialties" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    Gestión de Especialidades
                  </div>
                  <Button
                    onClick={() => setIsAddingSpecialty(true)}
                    disabled={loadingSpecialties || isAddingSpecialty}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Especialidad
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  Administra las especialidades médicas disponibles en la plataforma.
                </p>

                {loadingSpecialties && !hasLoadedSpecialties ? (
                  <div className="text-center py-12">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Cargando especialidades...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Formulario de nueva especialidad */}
                    {isAddingSpecialty && (
                      <div className="border rounded-lg p-4 bg-muted/50">
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Nombre de la especialidad..."
                            value={newSpecialtyName}
                            onChange={(e) => setNewSpecialtyName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleCreateSpecialty();
                              } else if (e.key === "Escape") {
                                setIsAddingSpecialty(false);
                                setNewSpecialtyName("");
                              }
                            }}
                            disabled={loadingSpecialties}
                            autoFocus
                          />
                          <Button
                            onClick={handleCreateSpecialty}
                            disabled={loadingSpecialties || !newSpecialtyName.trim()}
                            size="sm"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsAddingSpecialty(false);
                              setNewSpecialtyName("");
                            }}
                            disabled={loadingSpecialties}
                            size="sm"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Tabla de especialidades */}
                    {specialties.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                        <Stethoscope className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="font-medium mb-2">No hay especialidades configuradas</p>
                        <p className="text-sm mb-4">Crea la primera especialidad para comenzar.</p>
                        <Button onClick={() => setIsAddingSpecialty(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Crear Primera Especialidad
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="text-sm text-muted-foreground">
                          Total de especialidades: <strong>{specialties.length}</strong>
                        </div>
                        <div className="border rounded-lg overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-muted/50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                                  <th className="px-4 py-3 text-left text-sm font-medium">Nombre</th>
                                  <th className="px-4 py-3 text-right text-sm font-medium">Acciones</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y">
                                {specialties.map((specialty) => (
                                  <tr key={specialty.Id} className="hover:bg-muted/30">
                                    {editingSpecialtyId === specialty.Id ? (
                                      <>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">
                                          {specialty.Id}
                                        </td>
                                        <td className="px-4 py-3">
                                          <Input
                                            value={editingSpecialtyName}
                                            onChange={(e) => setEditingSpecialtyName(e.target.value)}
                                            onKeyDown={(e) => {
                                              if (e.key === "Enter") {
                                                handleUpdateSpecialty(specialty.Id);
                                              } else if (e.key === "Escape") {
                                                cancelEditSpecialty();
                                              }
                                            }}
                                            disabled={loadingSpecialties}
                                            className="h-8"
                                            autoFocus
                                          />
                                        </td>
                                        <td className="px-4 py-3">
                                          <div className="flex items-center justify-end gap-2">
                                            <Button
                                              size="sm"
                                              onClick={() => handleUpdateSpecialty(specialty.Id)}
                                              disabled={loadingSpecialties || !editingSpecialtyName.trim()}
                                              className="h-8"
                                            >
                                              <Check className="h-4 w-4" />
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={cancelEditSpecialty}
                                              disabled={loadingSpecialties}
                                              className="h-8"
                                            >
                                              <X className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </td>
                                      </>
                                    ) : (
                                      <>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">
                                          {specialty.Id}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium">
                                          {specialty.Name}
                                        </td>
                                        <td className="px-4 py-3">
                                          <div className="flex items-center justify-end gap-2">
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => startEditSpecialty(specialty)}
                                              disabled={loadingSpecialties}
                                            >
                                              <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => handleDeleteSpecialty(specialty.Id, specialty.Name)}
                                              disabled={loadingSpecialties}
                                              className="text-red-600 hover:bg-red-50"
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </td>
                                      </>
                                    )}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Información adicional */}
                        <div className="p-4 bg-muted rounded-lg space-y-2">
                          <p className="text-sm font-medium flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            Información sobre la gestión de especialidades
                          </p>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                            <li>
                              Las especialidades pueden ser creadas, editadas y eliminadas directamente desde aquí
                            </li>
                            <li>
                              Solo se pueden eliminar especialidades que no tengan doctores asociados
                            </li>
                            <li>
                              Los nombres de especialidades deben ser únicos
                            </li>
                            <li>
                              Presiona Enter para guardar o Escape para cancelar al editar
                            </li>
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== GESTIÓN DE PLANES ===== */}
          <TabsContent value="plans" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Gestión de Planes de Suscripción
                  </div>
                  <Button
                    onClick={handleSeedPlans}
                    disabled={loadingPlans}
                    variant="outline"
                    size="sm"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loadingPlans ? "animate-spin" : ""}`} />
                    Reinicializar Planes
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Visualiza los planes de suscripción disponibles para los pacientes. Los planes son gestionados mediante el sistema de seed.
                  </p>

                  {loadingPlans && !hasLoadedPlans ? (
                    <div className="text-center py-12">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                      <p className="text-muted-foreground">Cargando planes...</p>
                    </div>
                  ) : plans.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                      <CreditCard className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="font-medium mb-2">No hay planes configurados</p>
                      <p className="text-sm mb-4">Inicializa los planes por defecto para comenzar.</p>
                      <Button onClick={handleSeedPlans} disabled={loadingPlans}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Crear Planes Por Defecto
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Tarjetas de planes */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {plans.map((plan) => (
                          <Card
                            key={String(plan.id)}
                            className={`relative ${!plan.isActive ? "opacity-60" : ""}`}
                          >
                            <CardHeader>
                              <CardTitle className="flex items-center justify-between">
                                <span className="text-lg">{plan.name}</span>
                                {plan.isActive ? (
                                  <Badge className="bg-green-600">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Activo
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary">
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Inactivo
                                  </Badge>
                                )}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              {/* Precio */}
                              <div className="text-center py-4 border-b">
                                <div className="flex items-center justify-center gap-1">
                                  <DollarSign className="h-6 w-6 text-primary" />
                                  <span className="text-3xl font-bold text-primary">
                                    {formatPrice(plan.priceCents, plan.currency)}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">por mes</p>
                              </div>

                              {/* Límite de citas */}
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>
                                  {plan.maxAppointments === null
                                    ? "Citas ilimitadas"
                                    : `Hasta ${plan.maxAppointments} citas/mes`}
                                </span>
                              </div>

                              {/* Características */}
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Características:</p>
                                <ul className="space-y-1.5">
                                  {plan.featuresJson.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm">
                                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                      <span className="text-muted-foreground">{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Metadata */}
                              <div className="pt-3 border-t text-xs text-muted-foreground space-y-1">
                                <div>
                                  <strong>ID:</strong> {String(plan.id)}
                                </div>
                                <div>
                                  <strong>Creado:</strong>{" "}
                                  {new Date(plan.createdAt).toLocaleDateString("es-ES")}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {/* Información adicional */}
                      <div className="mt-6 p-4 bg-muted rounded-lg space-y-2">
                        <p className="text-sm font-medium flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          Información sobre la gestión de planes
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                          <li>
                            Los planes son gestionados mediante el sistema de seed del backend
                          </li>
                          <li>
                            Actualmente no es posible editar o eliminar planes individuales
                          </li>
                          <li>
                            El botón "Reinicializar Planes" creará los 3 planes por defecto: Basic ($0), Professional ($29.99), Premium ($99.99)
                          </li>
                          <li>
                            Total de planes configurados: <strong>{plans.length}</strong>
                          </li>
                          <li>
                            Planes activos: <strong>{plans.filter(p => p.isActive).length}</strong>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
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
