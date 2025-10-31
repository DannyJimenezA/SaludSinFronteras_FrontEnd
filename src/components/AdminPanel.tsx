import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Users,
  UserCheck,
  UserPlus,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  FileText,
  CreditCard,
  TrendingUp,
  UserCog,
  Shield,
  Activity,
  Stethoscope,
} from "lucide-react";

import { useAdminMetrics } from "../hooks/useAdmin";

export function AdminPanel() {
  const navigate = useNavigate();

  // ===== Datos REALES desde el endpoint de estadísticas =====
  const { data: metrics, isLoading: mLoading } = useAdminMetrics();

  // Helper para convertir centavos a dólares/euros formateados
  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

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
            <Button onClick={() => navigate("/admin/verification")}>
              <Shield className="h-4 w-4 mr-2" />
              Verificaciones
            </Button>
            <Button onClick={() => navigate("/admin/specialties")}>
              <Stethoscope className="h-4 w-4 mr-2" />
              Especialidades
            </Button>
          </div>
        </div>

        {/* Sección de Usuarios */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Usuarios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Usuarios</p>
                    <p className="text-2xl font-bold">
                      {mLoading ? "..." : metrics?.totalUsers ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {mLoading ? "..." : `${metrics?.totalDoctors ?? 0} doctores, ${metrics?.totalPatients ?? 0} pacientes`}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Doctores Verificados</p>
                    <p className="text-2xl font-bold text-green-600">
                      {mLoading ? "..." : metrics?.verifiedDoctors ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {mLoading ? "..." : `${metrics?.pendingDoctors ?? 0} pendientes`}
                    </p>
                  </div>
                  <UserCheck className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Nuevos Este Mes</p>
                    <p className="text-2xl font-bold">
                      {mLoading ? "..." : metrics?.newUsersThisMonth ?? 0}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      {mLoading ? "..." : `+${metrics?.newUsersThisWeek ?? 0} esta semana`}
                    </p>
                  </div>
                  <UserPlus className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Administradores</p>
                    <p className="text-2xl font-bold">
                      {mLoading ? "..." : metrics?.totalAdmins ?? 0}
                    </p>
                  </div>
                  <UserCog className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sección de Citas */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Citas Médicas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Citas</p>
                    <p className="text-2xl font-bold">
                      {mLoading ? "..." : metrics?.totalAppointments ?? 0}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completadas</p>
                    <p className="text-2xl font-bold text-green-600">
                      {mLoading ? "..." : metrics?.completedAppointments ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {mLoading
                        ? "..."
                        : metrics?.totalAppointments
                        ? `${((metrics.completedAppointments / metrics.totalAppointments) * 100).toFixed(1)}%`
                        : "0%"}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Próximas</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {mLoading ? "..." : metrics?.upcomingAppointments ?? 0}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Canceladas</p>
                    <p className="text-2xl font-bold text-red-600">
                      {mLoading ? "..." : metrics?.cancelledAppointments ?? 0}
                    </p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sección de Registros Médicos */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Registros Médicos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Registros</p>
                    <p className="text-2xl font-bold">
                      {mLoading ? "..." : metrics?.totalMedicalRecords ?? 0}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Registros Este Mes</p>
                    <p className="text-2xl font-bold text-green-600">
                      {mLoading ? "..." : metrics?.medicalRecordsThisMonth ?? 0}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sección de Suscripciones */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Suscripciones
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Suscripciones Activas</p>
                    <p className="text-2xl font-bold">
                      {mLoading ? "..." : metrics?.activeSubscriptions ?? 0}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Plan Básico</p>
                    <p className="text-2xl font-bold">
                      {mLoading ? "..." : metrics?.basicSubscriptions ?? 0}
                    </p>
                  </div>
                  <Badge className="bg-gray-600">Básico</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Plan Profesional</p>
                    <p className="text-2xl font-bold">
                      {mLoading ? "..." : metrics?.professionalSubscriptions ?? 0}
                    </p>
                  </div>
                  <Badge className="bg-blue-600">Profesional</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Plan Premium</p>
                    <p className="text-2xl font-bold">
                      {mLoading ? "..." : metrics?.premiumSubscriptions ?? 0}
                    </p>
                  </div>
                  <Badge className="bg-purple-600">Premium</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sección de Ingresos */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Ingresos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-2 border-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                    <p className="text-3xl font-bold text-primary">
                      {mLoading ? "..." : formatCurrency(metrics?.totalRevenueCents ?? 0)}
                    </p>
                  </div>
                  <DollarSign className="h-12 w-12 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ingresos Este Mes</p>
                    <p className="text-3xl font-bold text-green-600">
                      {mLoading ? "..." : formatCurrency(metrics?.revenueThisMonthCents ?? 0)}
                    </p>
                  </div>
                  <TrendingUp className="h-12 w-12 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Resumen de Estado de Doctores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Estado de Verificación de Doctores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Verificados</p>
                  <p className="text-2xl font-bold text-green-600">
                    {mLoading ? "..." : metrics?.verifiedDoctors ?? 0}
                  </p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {mLoading ? "..." : metrics?.pendingDoctors ?? 0}
                  </p>
                </div>
                <Clock className="h-10 w-10 text-yellow-600" />
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Rechazados</p>
                  <p className="text-2xl font-bold text-red-600">
                    {mLoading ? "..." : metrics?.rejectedDoctors ?? 0}
                  </p>
                </div>
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
