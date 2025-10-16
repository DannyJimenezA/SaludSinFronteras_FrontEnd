import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Calendar,
  Clock,
  MessageSquare,
  Search,
  Bell,
  FileText,
  Video,
  Star,
  MapPin,
  Languages,
} from "lucide-react";

import { usePatientDashboard } from "../hooks/usePatientDashboard";
import { useDoctorAvailability, useCreateAppointment } from "../hooks/useSchedule";

/* ---------------- Tipos “view model” locales ---------------- */
type UpcomingAppointment = {
  id: number;
  doctor: string;
  specialty: string;
  date: string;   // 'YYYY-MM-DD'
  time: string;   // 'HH:mm'
  type: "videollamada" | "presencial";
};

type RecommendedDoctor = {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  location: string;
  languages: string[];
  available: boolean;
};

type RecentMessage = {
  id: number;
  from: string;
  preview: string;
  unread?: boolean;
  at?: string;
};

/* Slots que devuelve el servicio de disponibilidad */
type SlotVM = {
  id: number;
  startAt: string; // ISO
  endAt: string;   // ISO
};

/* ---------------- Props ---------------- */
interface PatientDashboardProps {
  patientId: number;
  patientName?: string;
}

/* ---------------- Componente ---------------- */
export function PatientDashboard({
  patientId,
  patientName = "Paciente",
}: PatientDashboardProps) {
  const navigate = useNavigate();
  /* Panel del paciente (3 widgets) */
  const { data, isLoading, error, refetch, isFetching } = usePatientDashboard(patientId);

  const upcomingAppointments: UpcomingAppointment[] =
    (data?.upcomingAppointments as UpcomingAppointment[]) ?? [];

  const recommendedDoctors: RecommendedDoctor[] =
    (data?.recommendedDoctors as RecommendedDoctor[]) ?? [];

  const recentMessages: RecentMessage[] =
    (data?.recentMessages as unknown as RecentMessage[]) ?? [];

  /* ----------- Estados de “Agendar Cita” ----------- */
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [selectedDateISO, setSelectedDateISO] = useState<string | null>(null); // YYYY-MM-DD

  // Si eliges un doctor y no hay fecha, auto-seteo hoy
  useEffect(() => {
    if (selectedDoctorId && !selectedDateISO) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      setSelectedDateISO(`${yyyy}-${mm}-${dd}`);
    }
  }, [selectedDoctorId, selectedDateISO]);

  const doctorOptions = useMemo(
    () =>
      (recommendedDoctors ?? []).map((d) => ({
        id: Number(d.id),
        name: d.name,
        specialty: d.specialty,
      })),
    [recommendedDoctors]
  );

  const {
    data: slots = [],
    isLoading: slotsLoading,
    refetch: refetchSlots,
  } = useDoctorAvailability(
    selectedDoctorId ?? undefined,
    selectedDateISO ?? undefined
  );

  const createAppt = useCreateAppointment();

  async function onBook(slotId: number) {
    if (!selectedDoctorId) return;
    try {
      await createAppt.mutateAsync({
        doctorId: selectedDoctorId,
        slotId,
        modality: "online", // videollamada online
      });

      await Swal.fire({
        icon: "success",
        title: "¡Cita creada!",
        text: "Tu cita fue agendada correctamente.",
        confirmButtonText: "OK",
        confirmButtonColor: "#0f766e",
      });

      // refrescamos panel y disponibilidad
      refetch();
      refetchSlots();
      // onNavigate("appointments");
    } catch (e: any) {
      await Swal.fire({
        icon: "error",
        title: "No se pudo agendar",
        text: e?.response?.data?.message ?? e?.message ?? "Intenta de nuevo.",
      });
    }
  }

  /* ----------- Estados globales de carga/error ----------- */
  if (isLoading && !data) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <div className="text-sm text-muted-foreground">Cargando panel…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">¡Hola, {patientName}!</h1>
            <p className="text-muted-foreground">Tu salud es nuestra prioridad</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                3
              </Badge>
            </Button>
            <Button variant="outline" onClick={() => navigate("/settings")}>
              Configuración
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ---------------- Columna Izquierda ---------------- */}
          <div className="lg:col-span-2 space-y-6">
            {/* Agendar Cita */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Agendar Cita
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Doctor */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Médico</label>
                  <select
                    className="w-full border rounded-md p-2 bg-white"
                    value={selectedDoctorId ?? ""}
                    onChange={(e) =>
                      setSelectedDoctorId(e.target.value ? Number(e.target.value) : null)
                    }
                  >
                    <option value="">Selecciona un médico…</option>
                    {doctorOptions.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} — {d.specialty}
                      </option>
                    ))}
                  </select>
                  {doctorOptions.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      No hay médicos recomendados disponibles por ahora.
                    </p>
                  )}
                </div>

                {/* Fecha */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fecha</label>
                  <input
                    type="date"
                    className="border rounded-md p-2 bg-white"
                    value={selectedDateISO ?? ""}
                    onChange={(e) => setSelectedDateISO(e.target.value || null)}
                    disabled={!selectedDoctorId}
                  />
                </div>

                {/* Slots */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Horarios disponibles</label>
                    <span className="text-xs text-muted-foreground">
                      (El médico debe publicar disponibilidad)
                    </span>
                  </div>

                  {!selectedDoctorId || !selectedDateISO ? (
                    <p className="text-sm text-muted-foreground">
                      Selecciona médico y fecha para ver los horarios.
                    </p>
                  ) : slotsLoading ? (
                    <p className="text-sm text-muted-foreground">Cargando horarios…</p>
                  ) : !slots || slots.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No hay horarios para esta fecha.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {(slots as SlotVM[]).map((s) => {
                        const start = new Date(s.startAt);
                        const hh = String(start.getHours()).padStart(2, "0");
                        const mm = String(start.getMinutes()).padStart(2, "0");
                        const label = `${hh}:${mm}`;
                        return (
                          <Button
                            key={s.id}
                            variant="outline"
                            className="min-w-[84px]"
                            onClick={() => onBook(s.id)}
                            disabled={createAppt.isPending}
                          >
                            {label}
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Acciones rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Acciones Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    className="h-auto flex-col gap-2 p-4"
                    onClick={() => navigate("/search-doctors")}
                  >
                    <Search className="h-6 w-6" />
                    Buscar Médicos
                  </Button>
                  <Button
                    className="h-auto flex-col gap-2 p-4"
                    onClick={() => navigate("/appointments")}
                  >
                    <Calendar className="h-6 w-6" />
                    Agendar Cita
                  </Button>
                  <Button className="h-auto flex-col gap-2 p-4" onClick={() => navigate("/history")}>
                    <FileText className="h-6 w-6" />
                    Mi Historial
                  </Button>
                  <Button
                    className="h-auto flex-col gap-2 p-4"
                    onClick={() => navigate("/video-call")}
                  >
                    <Video className="h-6 w-6" />
                    Videollamada
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Próximas citas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Próximas Citas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingAppointments.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Aún no tienes citas. ¡Agenda la primera!
                  </p>
                )}

                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{appointment.doctor}</h4>
                        <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs">
                            {appointment.date} - {appointment.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          appointment.type === "videollamada" ? "default" : "secondary"
                        }
                      >
                        {appointment.type}
                      </Badge>
                      {appointment.type === "videollamada" && (
                        <Button className="mt-2" size="sm" onClick={() => navigate("/video-call")}>
                          Unirse
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full" onClick={() => navigate("/appointments")}>
                  Ver Todas las Citas
                </Button>
              </CardContent>
            </Card>

            {/* Médicos recomendados */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Médicos Recomendados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendedDoctors.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No hay recomendaciones por ahora.
                  </p>
                )}

                {recommendedDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {doctor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{doctor.name}</h4>
                        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{doctor.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="text-xs">{doctor.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Languages className="h-3 w-3" />
                          <span className="text-xs">{doctor.languages.join(", ")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={doctor.available ? "default" : "secondary"}>
                        {doctor.available ? "Disponible" : "Ocupado"}
                      </Badge>
                      <Button
                        size="sm"
                        className="mt-2"
                        disabled={!doctor.available}
                        onClick={() => {
                          setSelectedDoctorId(Number(doctor.id));
                          navigate("/appointments"); // o quédate en el dashboard si prefieres
                        }}
                      >
                        Agendar
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* ---------------- Columna Derecha ---------------- */}
          <div className="space-y-6">
            {/* Mensajes recientes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Mensajes Recientes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentMessages.length === 0 && (
                  <p className="text-sm text-muted-foreground">Sin mensajes recientes.</p>
                )}

                {recentMessages.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 p-3 border rounded-lg">
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
                      <p className="text-sm font-medium">{m.from}</p>
                      <p className="text-xs text-muted-foreground">{m.preview}</p>
                    </div>
                    {m.unread && <Badge className="bg-red-500">!</Badge>}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Resumen de salud (placeholder) */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Salud</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Última consulta</span>
                    <span className="text-muted-foreground">—</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Próximo chequeo</span>
                    <span className="text-muted-foreground">—</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medicamentos activos</span>
                    <span className="text-muted-foreground">—</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={() => navigate("/history")}>
                  Ver Historial Completo
                </Button>
              </CardContent>
            </Card>

            {/* Emergencias */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-700">Emergencias</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-600 mb-3">¿Necesitas atención médica urgente?</p>
                <Button variant="destructive" className="w-full">
                  Llamar Emergencias
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
