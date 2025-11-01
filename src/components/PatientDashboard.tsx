import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, Clock, MessageSquare, Video, Plus, X } from "lucide-react";
import { usePatientDashboard } from "../hooks/usePatientDashboard";
import { NotificationCenter } from "./NotificationCenter";

/* ---------------- Tipos "view model" locales ---------------- */
type UpcomingAppointment = {
  id: number;
  doctor: string;
  specialty: string;
  date: string;   // 'YYYY-MM-DD'
  time: string;   // 'HH:mm'
  type: "videollamada" | "presencial";
};

/* ---------------- Props ---------------- */
interface PatientDashboardProps {
  patientId: number;
  patientName?: string;
}

/* ---------------- Componente ---------------- */
export function PatientDashboard({
  patientId,
  patientName = "Andrey",
}: PatientDashboardProps) {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch, isFetching } = usePatientDashboard(patientId);

  const upcomingAppointments: UpcomingAppointment[] =
    (data?.upcomingAppointments as UpcomingAppointment[]) ?? [];

  /* ----------- Estados globales de carga/error ----------- */
  if (isLoading && !data) {
    return (
      <div className="min-h-screen grid place-items-center p-6 bg-background">
        <div className="text-sm text-muted-foreground">Cargando panel…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen grid place-items-center p-6 bg-background">
        <div className="space-y-3 text-center">
          <p className="text-red-600 font-medium">Ocurrió un error al cargar tu panel.</p>
          <Button onClick={() => refetch()} disabled={isFetching}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  /* ---------------- Render ---------------- */
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Bienvenido, {patientName}</h1>
            <p className="text-muted-foreground mt-1">Gestiona tus citas y consultas médicas</p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationCenter />
            <Button
              variant="outline"
              onClick={() => navigate("/settings")}
            >
              Configuración
            </Button>
          </div>
        </div>

        {/* Acciones Rápidas - 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Nueva cita */}
          <Card className="border-2 hover:border-primary/50 transition-all cursor-pointer"
                onClick={() => navigate("/nueva-cita")}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1 text-foreground">Nueva cita</h3>
                  <p className="text-sm text-muted-foreground mb-4">Agenda una consulta con un médico</p>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/nueva-cita");
                    }}
                  >
                    Buscar médicos
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mensajes */}
          <Card className="border-2 hover:border-primary/50 transition-all cursor-pointer"
                onClick={() => navigate("/mensajes")}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1 text-foreground">Mensajes</h3>
                  <p className="text-sm text-muted-foreground mb-4">Consulta con tus médicos</p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/mensajes");
                    }}
                  >
                    Ver mensajes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mis citas */}
          <Card className="border-2 hover:border-primary/50 transition-all cursor-pointer"
                onClick={() => navigate("/mis-citas")}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1 text-foreground">Mis citas</h3>
                  <p className="text-sm text-muted-foreground mb-4">Revisa tus próximas consultas</p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/mis-citas");
                    }}
                  >
                    Ver citas
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Próximas citas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-foreground">Próximas citas</CardTitle>
            <p className="text-sm text-muted-foreground">Tus consultas programadas</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No tienes más citas programadas</p>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => navigate("/nueva-cita")}
                >
                  Agendar nueva cita
                </Button>
              </div>
            ) : (
              <>
                {upcomingAppointments.map((appointment) => {
                  // Formatear la fecha para mostrar "1 de noviembre de 2025"
                  const dateObj = new Date(appointment.date);
                  const formattedDate = dateObj.toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  });

                  return (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Video className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-medium text-lg text-foreground">{appointment.doctor}</h4>
                          <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formattedDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{appointment.time}</span>
                            </div>
                            <span>• 30 min</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          Pendiente
                        </Badge>
                        <Button
                          className="bg-primary hover:bg-primary/90"
                          onClick={() => navigate(`/mis-citas`)}
                        >
                          Detalles
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
