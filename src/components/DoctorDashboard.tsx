import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Calendar,
  Clock,
  Users,
  FileText,
  Video,
  Bell,
  TrendingUp,
  MessageSquare,
  Stethoscope,
  ClipboardList,
} from "lucide-react";

import { useDoctorDashboard } from "../hooks/useDoctorDashboard";

export function DoctorDashboard() {
  const navigate = useNavigate();
  const {
    profile,
    appointments,
    conversations,
    doctorName,
    doctorSpecialty,
    todaysAppointments,
    stat_today,
    stat_online,
    messages,
  } = useDoctorDashboard();

  const loading =
    profile.isLoading || appointments.isLoading || conversations.isLoading;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              {loading ? "Cargando…" : doctorName}
            </h1>
            <p className="text-muted-foreground">
              {loading ? "—" : doctorSpecialty}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {messages.length}
              </Badge>
            </Button>
            <Button variant="outline" onClick={() => navigate("/settings")}>
              Configuración
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          {/* A falta de endpoint real para pacientes activos, mantenemos placeholder amigable */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pacientes Activos</p>
                  <p className="text-2xl font-bold">—</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Consultas Online (hoy)</p>
                  <p className="text-2xl font-bold">
                    {loading ? "…" : stat_online}
                  </p>
                </div>
                <Video className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Satisfacción</p>
                  <p className="text-2xl font-bold">—</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
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
                    onClick={() => navigate("/video-call")}
                  >
                    <Video className="h-6 w-6" />
                    Iniciar Consulta
                  </Button>
                  <Button
                    className="h-auto flex-col gap-2 p-4"
                    onClick={() => navigate("/appointments")}
                  >
                    <Calendar className="h-6 w-6" />
                    Ver Agenda
                  </Button>
                  <Button
                    className="h-auto flex-col gap-2 p-4"
                    onClick={() => navigate("/history")}
                  >
                    <FileText className="h-6 w-6" />
                    Historiales
                  </Button>
                  <Button
                    className="h-auto flex-col gap-2 p-4"
                    onClick={() => navigate("/prescriptions")}
                  >
                    <ClipboardList className="h-6 w-6" />
                    Recetas
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

                {todaysAppointments.map((a) => (
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
                    <div className="text-right">
                      <Badge variant={a.type === "videollamada" ? "default" : "secondary"}>
                        {a.type}
                      </Badge>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline" onClick={() => navigate("/history")}>
                          Ver Historial
                        </Button>
                        {a.type === "videollamada" && (
                          <Button size="sm" onClick={() => navigate("/video-call")}>
                            Iniciar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

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

          {/* Right Column */}
          <div className="space-y-6">
            {/* Messages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Mensajes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading && <p className="text-sm text-muted-foreground">Cargando…</p>}
                {!loading && messages.length === 0 && (
                  <p className="text-sm text-muted-foreground">Sin mensajes recientes.</p>
                )}

                {messages.map((m) => (
                  <div
                    key={String(m.id)}
                    className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {m.from
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{m.from}</p>
                        {m.time && <span className="text-xs text-muted-foreground">{m.time}</span>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{m.message}</p>
                      {m.unread && <Badge className="mt-2 bg-blue-500">Nuevo</Badge>}
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full">
                  Ver Todos los Mensajes
                </Button>
              </CardContent>
            </Card>

            {/* Resumen semanal / placeholders */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen Semanal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                Conectaremos métricas semanales cuando el backend exponga agregados.
                Por ahora se derivan de citas del día.
              </CardContent>
            </Card>

            {/* Estado de Pacientes / placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Estado de Pacientes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Casos críticos</span>
                  <Badge variant="destructive">—</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Seguimiento requerido</span>
                  <Badge variant="default">—</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Estables</span>
                  <Badge variant="secondary">—</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
