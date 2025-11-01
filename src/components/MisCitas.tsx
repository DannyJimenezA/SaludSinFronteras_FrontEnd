import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, Calendar, Clock, Video, Plus, MapPin, ArrowUpDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  useAllAppointments,
  useUpcomingAppointments,
  usePastAppointments,
  useCancelledAppointments,
  useCancelAppointment
} from "../hooks/useAppointments";
import { toast } from "sonner";

type FilterType = "all" | "upcoming" | "past" | "cancelled";

export function MisCitas() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterType>("upcoming");
  const [currentPage, setCurrentPage] = useState(1);
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const limit = 10;

  // Hooks para obtener las citas según el filtro
  const { data: allResponse, isLoading: allLoading } = useAllAppointments(currentPage, limit, order);
  const { data: upcomingData, isLoading: upcomingLoading } = useUpcomingAppointments(20);
  const { data: pastData, isLoading: pastLoading } = usePastAppointments(20);
  const { data: cancelledData, isLoading: cancelledLoading } = useCancelledAppointments(20);

  // Hook para cancelar citas
  const cancelAppointment = useCancelAppointment();

  // Extrae datos y paginación del response de "Todas"
  const allData = allResponse?.data || [];
  const pagination = allResponse?.pagination;

  // Debug log para ver qué datos llegan
  useEffect(() => {
    if (activeFilter === "past" && pastData) {
      console.log("Past appointments received:", pastData);
    }
  }, [activeFilter, pastData]);

  // Selecciona los datos según el filtro activo
  const getActiveData = () => {
    switch (activeFilter) {
      case "all":
        return { data: allData, loading: allLoading };
      case "upcoming":
        return { data: upcomingData || [], loading: upcomingLoading };
      case "past":
        return { data: pastData || [], loading: pastLoading };
      case "cancelled":
        return { data: cancelledData || [], loading: cancelledLoading };
      default:
        return { data: [], loading: false };
    }
  };

  const { data: appointments, loading: isLoading } = getActiveData();

  // Resetea la página cuando cambia el filtro
  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  // Toggle de ordenamiento
  const toggleOrder = () => {
    setOrder(order === 'desc' ? 'asc' : 'desc');
    setCurrentPage(1);
  };

  // Función para formatear fecha y hora
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const dateFormatted = date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const timeFormatted = date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return { date: dateFormatted, time: timeFormatted };
  };

  // Función para obtener el color del badge según el estado
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Confirmada</Badge>;
      case "PENDING":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendiente</Badge>;
      case "COMPLETED":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Completada</Badge>;
      case "CANCELLED":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelada</Badge>;
      case "NO_SHOW":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">No asistió</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Función para manejar la cancelación de una cita
  const handleCancelAppointment = async (appointmentId: string) => {
    const reason = prompt("¿Por qué deseas cancelar esta cita? (opcional)");

    if (reason === null) {
      // Usuario canceló el prompt
      return;
    }

    try {
      await cancelAppointment.mutateAsync({
        id: appointmentId,
        cancelReason: reason || undefined,
      });

      toast.success("Cita cancelada exitosamente");
    } catch (error: any) {
      toast.error("Error al cancelar la cita", {
        description: error.response?.data?.message || "Por favor, intenta nuevamente",
      });
    }
  };

  // Función para determinar si una cita puede ser cancelada
  const canCancelAppointment = (status: string) => {
    return status === "PENDING" || status === "CONFIRMED";
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/patient-dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mis Citas</h1>
              <p className="text-muted-foreground mt-1">Revisa todas tus consultas programadas</p>
            </div>
          </div>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => navigate("/nueva-cita")}
          >
            <Plus className="h-5 w-5 mr-2" />
            Nueva Cita
          </Button>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <Button
                  variant={activeFilter === "upcoming" ? "default" : "outline"}
                  onClick={() => handleFilterChange("upcoming")}
                  className={activeFilter === "upcoming" ? "bg-primary" : ""}
                >
                  Próximas
                </Button>
                <Button
                  variant={activeFilter === "past" ? "default" : "outline"}
                  onClick={() => handleFilterChange("past")}
                  className={activeFilter === "past" ? "bg-primary" : ""}
                >
                  Pasadas
                </Button>
                <Button
                  variant={activeFilter === "cancelled" ? "default" : "outline"}
                  onClick={() => handleFilterChange("cancelled")}
                  className={activeFilter === "cancelled" ? "bg-primary" : ""}
                >
                  Canceladas
                </Button>
                <Button
                  variant={activeFilter === "all" ? "default" : "outline"}
                  onClick={() => handleFilterChange("all")}
                  className={activeFilter === "all" ? "bg-primary" : ""}
                >
                  Todas
                </Button>
              </div>

              {/* Botón de ordenamiento solo para "Todas" */}
              {activeFilter === "all" && (
                <Button
                  variant="outline"
                  onClick={toggleOrder}
                  className="gap-2"
                >
                  <ArrowUpDown className="h-4 w-4" />
                  {order === 'desc' ? 'Más recientes' : 'Más antiguas'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Lista de citas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-foreground flex items-center justify-between">
              <span>
                {activeFilter === "all" && "Todas las Citas"}
                {activeFilter === "upcoming" && "Próximas Citas"}
                {activeFilter === "past" && "Citas Pasadas"}
                {activeFilter === "cancelled" && "Citas Canceladas"}
              </span>
              {!isLoading && (
                <Badge variant="secondary">
                  {appointments.length} cita{appointments.length !== 1 ? "s" : ""}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Cargando citas...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  {activeFilter === "all" && "No tienes citas registradas"}
                  {activeFilter === "upcoming" && "No tienes citas próximas"}
                  {activeFilter === "past" && "No tienes citas pasadas"}
                  {activeFilter === "cancelled" && "No tienes citas canceladas"}
                </p>
                {(activeFilter === "upcoming" || activeFilter === "all") && (
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => navigate("/nueva-cita")}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Agendar Nueva Cita
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment: any) => {
                  const { date, time } = formatDateTime(appointment.scheduledAt);
                  const isOnline = appointment.modality?.toLowerCase() === 'online';

                  return (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          {isOnline ? (
                            <Video className="h-6 w-6 text-primary" />
                          ) : (
                            <MapPin className="h-6 w-6 text-primary" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-lg text-foreground">
                            {appointment.doctor?.name || 'Médico'}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {appointment.doctor?.specialty || 'General'}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{time}</span>
                            </div>
                            {appointment.durationMin && (
                              <span>• {appointment.durationMin} min</span>
                            )}
                          </div>
                          {appointment.cancelReason && (
                            <p className="text-xs text-red-600 mt-1">
                              Motivo: {appointment.cancelReason}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(appointment.status)}
                        {activeFilter === "upcoming" && isOnline && (
                          <Button
                            className="bg-primary hover:bg-primary/90"
                            onClick={() => navigate("/video-call")}
                          >
                            Unirse
                          </Button>
                        )}
                        {canCancelAppointment(appointment.status) && (
                          <Button
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => handleCancelAppointment(appointment.id)}
                            disabled={cancelAppointment.isPending}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Paginación - solo para "Todas" */}
            {activeFilter === "all" && pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Mostrando {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} citas
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={currentPage === pageNum ? "bg-primary" : ""}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                    disabled={currentPage === pagination.totalPages}
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
