import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  Calendar,
  Clock,
  User,
  Video,
  MapPin,
  Phone,
  ArrowLeft,
  Filter,
  CheckCircle,
  XCircle,
  Search,
  ChevronDown,
  ChevronUp,
  FileText,
  Mail,
  DollarSign,
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "sonner";

interface AppointmentData {
  id: string;
  scheduledAt: string;
  durationMin: number;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  statusName?: string; // Nombre del estado en español desde el backend
  modality: "online" | "onsite" | "phone";
  videoRoomName?: string | null; // Nombre de la sala de video
  patient: {
    id: string;
    name: string;
    email: string;
  } | null;
  doctor: {
    id: string;
    name: string;
    specialty: string;
    email: string;
  } | null;
  slot: {
    id: string;
    startAt: string;
    endAt: string;
  } | null;
}

async function getDoctorAppointmentsByDate(startDate?: string, endDate?: string) {
  // Obtener citas del doctor con filtro de fecha
  const params: any = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const { data } = await api.get<AppointmentData[]>("/appointments/doctor/by-date", { params });
  return Array.isArray(data) ? data : [];
}

export function DoctorAppointments() {
  const navigate = useNavigate();

  // Obtener la fecha actual en la zona horaria local
  const getTodayDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Función para parsear fechas UTC como locales (sin conversión de zona horaria)
  const parseUTCAsLocal = (dateString: string) => {
    // Remover la 'Z' para que no se interprete como UTC
    const withoutZ = dateString.replace('Z', '');
    return new Date(withoutZ);
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedAppointmentId, setExpandedAppointmentId] = useState<string | null>(null);

  const { data: appointments, isLoading, refetch } = useQuery({
    queryKey: ["doctor", "appointments", "by-date", selectedDate],
    queryFn: () => getDoctorAppointmentsByDate(selectedDate, selectedDate),
    staleTime: 20_000,
  });

  // Filtrar citas solo por búsqueda (el filtro de fecha ya lo hace el backend)
  const filteredAppointments = (appointments ?? [])
    .filter((apt) => {
      // Filtro de búsqueda por nombre
      const matchesSearch = searchQuery.trim() === "" ||
        (apt.patient?.name || "").toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });

  const getStatusName = (appointment: AppointmentData) => {
    // Si el appointment tiene el nombre del estado, usarlo directamente
    if (appointment.statusName) {
      return appointment.statusName;
    }

    // Fallback al mapeo manual si no viene del backend
    const status = appointment.status;
    switch (status) {
      case "CONFIRMED":
        return "Confirmada";
      case "PENDING":
        return "Pendiente";
      case "COMPLETED":
        return "Completada";
      case "CANCELLED":
        return "Cancelada";
      case "NO_SHOW":
        return "No asistió";
      default:
        return status;
    }
  };

  const getStatusBadge = (appointment: AppointmentData) => {
    const status = appointment.status;
    const statusName = getStatusName(appointment);

    switch (status) {
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">{statusName}</Badge>;
      case "CONFIRMED":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">{statusName}</Badge>;
      case "COMPLETED":
        return <Badge className="bg-green-100 text-green-800 border-green-300">{statusName}</Badge>;
      case "CANCELLED":
        return <Badge className="bg-red-100 text-red-800 border-red-300">{statusName}</Badge>;
      case "NO_SHOW":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">{statusName}</Badge>;
      default:
        return <Badge variant="secondary">{statusName}</Badge>;
    }
  };

  const getModalityIcon = (modality: string) => {
    switch (modality) {
      case "online":
        return <Video className="h-4 w-4" />;
      case "onsite":
        return <MapPin className="h-4 w-4" />;
      case "phone":
        return <Phone className="h-4 w-4" />;
      default:
        return <Video className="h-4 w-4" />;
    }
  };

  const getModalityText = (modality: string) => {
    switch (modality) {
      case "online":
        return "Videollamada";
      case "onsite":
        return "Presencial";
      case "phone":
        return "Teléfono";
      default:
        return modality;
    }
  };

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      await api.patch(`/appointments/${appointmentId}/status`, { Status: newStatus });
      toast.success("Estado actualizado exitosamente");
      refetch();
    } catch (error: any) {
      console.error("Error al cambiar el estado de la cita:", error);
      toast.error("Error al actualizar el estado", {
        description: error.response?.data?.message || "Por favor, intenta nuevamente"
      });
    }
  };

  const toggleAppointmentDetails = (appointmentId: string) => {
    setExpandedAppointmentId(expandedAppointmentId === appointmentId ? null : appointmentId);
  };

  const canModifyAppointment = (appointment: AppointmentData) => {
    // Solo se pueden modificar citas pendientes o confirmadas que no hayan pasado
    if (appointment.status !== "PENDING" && appointment.status !== "CONFIRMED") {
      return false;
    }

    const now = new Date();
    const scheduledAt = parseUTCAsLocal(appointment.scheduledAt);

    // Si la cita ya pasó, no se puede modificar
    if (scheduledAt < now) {
      return false;
    }

    return true;
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/doctor-dashboard")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-primary">Gestión de Citas</h1>
              <p className="text-muted-foreground">
                Administra y filtra tus citas médicas
              </p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {/* Filtro de fecha */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">
                    Fecha
                  </label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedDate(getTodayDate())}
                  >
                    Hoy
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const now = new Date();
                      now.setDate(now.getDate() + 1);
                      const year = now.getFullYear();
                      const month = String(now.getMonth() + 1).padStart(2, '0');
                      const day = String(now.getDate()).padStart(2, '0');
                      setSelectedDate(`${year}-${month}-${day}`);
                    }}
                  >
                    Mañana
                  </Button>
                </div>
              </div>

              {/* Filtro de búsqueda */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Buscar paciente
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar por nombre del paciente..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Citas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Citas del {new Date(selectedDate + "T00:00:00").toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <Badge variant="secondary">
                {filteredAppointments.length} citas
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Cargando citas...
              </p>
            )}

            {!isLoading && filteredAppointments.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No hay citas para esta fecha.
              </p>
            )}

            {filteredAppointments.map((apt) => {
              const isExpanded = expandedAppointmentId === apt.id;
              return (
                <div key={apt.id} className="border rounded-lg overflow-hidden transition-all">
                  {/* Información básica */}
                  <div className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Información principal */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">
                            {apt.patient?.name || "Paciente sin nombre"}
                          </span>
                          {getStatusBadge(apt)}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {parseUTCAsLocal(apt.scheduledAt).toLocaleTimeString("es-ES", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            {getModalityIcon(apt.modality)}
                            {getModalityText(apt.modality)}
                          </div>
                          <div>
                            {apt.durationMin} min
                          </div>
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        {apt.modality === "online" && apt.status === "CONFIRMED" && (
                          <Button
                            size="sm"
                            onClick={() => navigate(`/video-call/${apt.id}`)}
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Unirse
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleAppointmentDetails(apt.id)}
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-2" />
                              Ocultar
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-2" />
                              Gestionar
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Panel desplegable con información detallada */}
                  {isExpanded && (
                    <div className="border-t bg-muted/30">
                      <div className="p-6 space-y-4">
                        {/* Información detallada */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Información del paciente */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <User className="h-4 w-4 text-primary" />
                              <span>Información del Paciente</span>
                            </div>
                            <div className="pl-6 space-y-1 text-sm text-muted-foreground">
                              <p><span className="font-medium">Nombre:</span> {apt.patient?.name || 'No especificado'}</p>
                              {apt.patient?.email && (
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  <span>{apt.patient.email}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Detalles de la cita */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <FileText className="h-4 w-4 text-primary" />
                              <span>Detalles de la Cita</span>
                            </div>
                            <div className="pl-6 space-y-1 text-sm text-muted-foreground">
                              <p><span className="font-medium">Modalidad:</span> {getModalityText(apt.modality)}</p>
                              <p><span className="font-medium">Duración:</span> {apt.durationMin} minutos</p>
                              <p><span className="font-medium">Estado:</span> {getStatusName(apt)}</p>
                              <p>
                                <span className="font-medium">Hora:</span>{" "}
                                {parseUTCAsLocal(apt.scheduledAt).toLocaleString("es-ES", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true
                                })}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Acciones de gestión */}
                        <div className="pt-4 border-t">
                          <p className="text-sm font-medium mb-3">Gestionar cita</p>
                          <div className="flex flex-wrap gap-2">
                            {/* Estado PENDING: Aprobar o Cancelar */}
                            {apt.status === "PENDING" && (
                              <>
                                <Button
                                  size="sm"
                                  className="gap-2 bg-green-600 hover:bg-green-700"
                                  onClick={() => handleStatusChange(apt.id, "CONFIRMED")}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Aprobar Cita
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="gap-2"
                                  onClick={() => handleStatusChange(apt.id, "CANCELLED")}
                                >
                                  <XCircle className="h-4 w-4" />
                                  Rechazar
                                </Button>
                              </>
                            )}

                            {/* Estado CONFIRMED: Completar o Marcar No Show */}
                            {apt.status === "CONFIRMED" && (
                              <>
                                <Button
                                  size="sm"
                                  className="gap-2 bg-green-600 hover:bg-green-700"
                                  onClick={() => handleStatusChange(apt.id, "COMPLETED")}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Marcar Completada
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-2"
                                  onClick={() => handleStatusChange(apt.id, "NO_SHOW")}
                                >
                                  <XCircle className="h-4 w-4" />
                                  Paciente no asistió
                                </Button>
                              </>
                            )}

                            {/* Estados finales: Solo mostrar información */}
                            {(apt.status === "COMPLETED" || apt.status === "CANCELLED" || apt.status === "NO_SHOW") && (
                              <p className="text-sm text-muted-foreground">
                                Esta cita ya ha sido {apt.status === "COMPLETED" ? "completada" : apt.status === "CANCELLED" ? "cancelada" : "marcada como no asistida"}.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
