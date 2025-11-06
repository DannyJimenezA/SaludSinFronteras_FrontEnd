import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Calendar,
  Clock,
  MessageSquare,
  Stethoscope,
  ShieldCheck,
  CheckCircle,
  ClockAlert,
} from "lucide-react";

import { useDoctorDashboard } from "../hooks/useDoctorDashboard";
import { NotificationCenter } from "./NotificationCenter";

export function DoctorDashboard() {
  const navigate = useNavigate();
  const {
    profile,
    appointments,
    doctorName,
    doctorSpecialty,
    todaysAppointments,
    stat_today,
    stat_completed,
    stat_pending,
  } = useDoctorDashboard();

  const loading =
    profile.isLoading || appointments.isLoading;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              {loading ? "Cargando…" : `Bienvenido, ${doctorName}`}
            </h1>
            <p className="text-muted-foreground">
              {loading ? "—" : doctorSpecialty}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <NotificationCenter />
            <Button variant="outline" onClick={() => navigate("/settings")}>
              Configuración
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Citas Hoy</p>
                  <p className="text-2xl font-bold">
                    {loading ? "…" : stat_today}
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
                  <p className="text-sm text-muted-foreground">Citas Atendidas</p>
                  <p className="text-2xl font-bold">
                    {loading ? "…" : stat_completed}
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
                  <p className="text-sm text-muted-foreground">Citas Pendientes</p>
                  <p className="text-2xl font-bold">
                    {loading ? "…" : stat_pending}
                  </p>
                </div>
                <ClockAlert className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Main Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Acciones Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    className="h-auto flex-col gap-2 p-4"
                    onClick={() => navigate("/appointments")}
                  >
                    <Calendar className="h-6 w-6" />
                    Ver Citas
                  </Button>
                  <Button
                    className="h-auto flex-col gap-2 p-4"
                    onClick={() => navigate("/messages")}
                  >
                    <MessageSquare className="h-6 w-6" />
                    Mensajes
                  </Button>
                  <Button
                    className="h-auto flex-col gap-2 p-4"
                    onClick={() => navigate("/availability")}
                  >
                    <Clock className="h-6 w-6" />
                    Crear Disponibilidad
                  </Button>
                  <Button
                    className="h-auto flex-col gap-2 p-4"
                    onClick={() => navigate("/verification")}
                  >
                    <ShieldCheck className="h-6 w-6" />
                    Verificación
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Today's Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Citas de Hoy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading && <p className="text-sm text-muted-foreground">Cargando…</p>}
                {!loading && todaysAppointments.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No tienes citas para hoy.
                  </p>
                )}

                {todaysAppointments.map((a) => {
                  // Función para obtener el badge del estado
                  const getStatusBadge = (status: string) => {
                    switch (status) {
                      case "PENDING":
                        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Pendiente</Badge>;
                      case "CONFIRMED":
                        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Confirmada</Badge>;
                      case "COMPLETED":
                        return <Badge className="bg-green-100 text-green-800 border-green-300">Completada</Badge>;
                      case "CANCELLED":
                        return <Badge className="bg-red-100 text-red-800 border-red-300">Cancelada</Badge>;
                      case "NO_SHOW":
                        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">No asistió</Badge>;
                      default:
                        return <Badge variant="secondary">{status}</Badge>;
                    }
                  };

                  return (
                    <div
                      key={String(a.id)}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Clock className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{a.patient || "Paciente"}</h4>
                          <p className="text-sm text-muted-foreground">{a.condition}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-medium">{a.time}</span>
                            {a.urgent && (
                              <Badge variant="destructive" className="text-xs">
                                Urgente
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="flex gap-2 justify-end">
                          <Badge variant={a.type === "videollamada" ? "default" : "secondary"}>
                            {a.type}
                          </Badge>
                          {getStatusBadge(a.status)}
                        </div>
                        <Button size="sm" onClick={() => navigate("/appointments")}>
                          Detalles
                        </Button>
                      </div>
                    </div>
                  );
                })}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/appointments")}
                >
                  Ver Agenda Completa
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
