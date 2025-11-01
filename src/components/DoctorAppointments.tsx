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
} from "lucide-react";
import { api } from "../lib/api";

interface AppointmentData {
  id: string;
  scheduledAt: string;
  durationMin: number;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  modality: "online" | "onsite" | "phone";
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

  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary">Pendiente</Badge>;
      case "CONFIRMED":
        return <Badge className="bg-blue-600">Confirmada</Badge>;
      case "COMPLETED":
        return <Badge className="bg-green-600">Completada</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
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
      await api.patch(`/appointments/${appointmentId}/status`, { status: newStatus });
      refetch();
    } catch (error) {
      console.error("Error al cambiar el estado de la cita:", error);
    }
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

            {filteredAppointments.map((apt) => (
              <Card key={apt.id} className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Información principal */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">
                          {apt.patient?.name || "Paciente sin nombre"}
                        </span>
                        {getStatusBadge(apt.status)}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(apt.scheduledAt).toLocaleTimeString("es-ES", {
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

                      {apt.patient?.email && (
                        <p className="text-sm text-muted-foreground">
                          {apt.patient.email}
                        </p>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      {apt.status === "PENDING" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => handleStatusChange(apt.id, "CONFIRMED")}
                          >
                            <CheckCircle className="h-4 w-4" />
                            Confirmar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => handleStatusChange(apt.id, "CANCELLED")}
                          >
                            <XCircle className="h-4 w-4" />
                            Cancelar
                          </Button>
                        </>
                      )}

                      {apt.status === "CONFIRMED" && (
                        <Button
                          size="sm"
                          className="gap-2"
                          onClick={() => handleStatusChange(apt.id, "COMPLETED")}
                        >
                          <CheckCircle className="h-4 w-4" />
                          Marcar Completada
                        </Button>
                      )}

                      {apt.status === "COMPLETED" && (
                        <Badge className="bg-green-600 self-start">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Completada
                        </Badge>
                      )}

                      {apt.modality === "online" && apt.status === "CONFIRMED" && (
                        <Button
                          size="sm"
                          onClick={() => navigate(`/video-call/${apt.id}`)}
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Unirse
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
