import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Users,
  Activity,
  DollarSign,
  TrendingUp,
  Search,
  Download,
  UserPlus,
  Clock,
  Globe,
  Video,
  MessageSquare,
  Settings,
  BarChart3,
  Shield,
  XCircle,
  CheckCircle,
} from "lucide-react";

import { useAdminMetrics, useRecentUsers } from "../hooks/useAdmin";

interface AdminPanelProps {
  onNavigate: (screen: string) => void;
}

export function AdminPanel({ onNavigate }: AdminPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // ===== Datos REALES (appointments) =====
  const { data: metrics, isLoading: mLoading } = useAdminMetrics();

  // ===== Usuarios recientes (puede venir vacío si /users no existe) =====
  const { data: recentUsers = [], isLoading: uLoading } = useRecentUsers(12);

  // Derivados “seguros” para tarjetas
  const todayConsultations = metrics?.todayConsultations ?? 0;
  const monthlyRevenue = metrics?.monthlyRevenue ?? 0;
  const completedPct = metrics?.completedPct ?? 0;

  // Filtros de usuarios en memoria
  const filteredUsers = recentUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedFilter === "all" ||
      (selectedFilter === "doctors" && u.type === "doctor") ||
      (selectedFilter === "patients" && u.type === "patient") ||
      (selectedFilter === "pending" && u.status === "pending");
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Panel de Administración</h1>
            <p className="text-muted-foreground">Salud Sin Fronteras – Dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onNavigate("settings")}>
              <Settings className="h-4 w-4 mr-2" />
              Configuración
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar Datos
            </Button>
          </div>
        </div>

        {/* Key Metrics (parcialmente reales) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Consultas Hoy</p>
                  <p className="text-2xl font-bold">
                    {mLoading ? "…" : todayConsultations}
                  </p>
                  <p className="text-xs text-green-600">actualizado</p>
                </div>
                <Video className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">% Completadas</p>
                  <p className="text-2xl font-bold">
                    {mLoading ? "…" : `${completedPct.toFixed(1)}%`}
                  </p>
                  <p className="text-xs text-green-600">sobre todas las citas</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ingresos Mensuales</p>
                  <p className="text-2xl font-bold">
                    {mLoading ? "…" : `€${(monthlyRevenue / 1000).toFixed(0)}k`}
                  </p>
                  <p className="text-xs text-muted-foreground">requiere módulo de billing</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Usuarios (muestra)</p>
                  <p className="text-2xl font-bold">
                    {uLoading ? "…" : recentUsers.length}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {recentUsers.length ? "últimos cargados" : "requiere GET /users"}
                  </p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="consultations">Consultas</TabsTrigger>
            <TabsTrigger value="analytics">Análisis</TabsTrigger>
            <TabsTrigger value="system">Sistema</TabsTrigger>
          </TabsList>

          {/* === Resumen (simple) === */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Indicadores rápidos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Citas totales (dataset)</span>
                    <span className="font-medium">
                      {mLoading ? "…" : metrics?.totalAppointments ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>% completadas</span>
                    <span className="font-medium">
                      {mLoading ? "…" : `${completedPct.toFixed(1)}%`}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Hoy
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-3xl font-bold text-primary">
                    {mLoading ? "…" : todayConsultations}
                  </p>
                  <p className="text-sm text-muted-foreground">consultas programadas</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Próximos pasos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>• Añadir endpoint <code>/users</code> para listado y conteos.</p>
                  <p>• Conectar módulo de billing para ingresos reales.</p>
                  <p>• Agregar métricas por país/idioma.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* === Usuarios (usa /users si existe) === */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar usuarios por nombre o email…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="doctors">Médicos</SelectItem>
                    <SelectItem value="patients">Pacientes</SelectItem>
                    <SelectItem value="pending">Pendientes</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invitar
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Usuarios recientes</CardTitle>
              </CardHeader>
              <CardContent>
                {!recentUsers.length ? (
                  <div className="p-6 text-sm text-muted-foreground">
                    Aún no hay endpoint <code>/users</code> disponible o no devolvió resultados.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredUsers.map((user) => (
                      <div key={String(user.id)} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={user.type === "doctor" ? "default" : "secondary"}>
                                {user.type === "doctor" ? "Médico" : "Paciente"}
                              </Badge>
                              {user.country && <span className="text-xs text-muted-foreground">{user.country}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              user.status === "active"
                                ? "default"
                                : user.status === "pending"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {user.status}
                          </Badge>
                          {user.joinDate && (
                            <p className="text-xs text-muted-foreground mt-1">{user.joinDate}</p>
                          )}
                          <div className="flex gap-1 mt-2">
                            <Button variant="outline" size="sm">
                              Ver
                            </Button>
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* === Consultas (métricas desde appointments) === */}
          <TabsContent value="consultations" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Video className="h-8 w-8 mx-auto text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Programadas hoy</p>
                  <p className="text-2xl font-bold">{mLoading ? "…" : todayConsultations}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-8 w-8 mx-auto text-green-600 mb-2" />
                  <p className="text-sm text-muted-foreground">% Completadas</p>
                  <p className="text-2xl font-bold">{mLoading ? "…" : `${completedPct.toFixed(1)}%`}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <XCircle className="h-8 w-8 mx-auto text-red-600 mb-2" />
                  <p className="text-sm text-muted-foreground">% Canceladas</p>
                  <p className="text-2xl font-bold">
                    {mLoading ? "…" : `${(100 - completedPct).toFixed(1)}%`}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Activity className="h-8 w-8 mx-auto text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Total citas cargadas</p>
                  <p className="text-2xl font-bold">
                    {mLoading ? "…" : metrics?.totalAppointments ?? 0}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* === Analytics & Sistema (placeholders por ahora) === */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Análisis</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Conecta facturación e informes cuando estén disponibles.
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Shield className="h-8 w-8 mx-auto text-green-600 mb-2" />
                  <p className="text-sm text-muted-foreground">Estado del sistema</p>
                  <p className="text-lg font-bold text-green-600">Operativo</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Globe className="h-8 w-8 mx-auto text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">APIs externas</p>
                  <p className="text-lg font-bold">OK</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 mx-auto text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Uptime</p>
                  <p className="text-lg font-bold">99.9%</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
