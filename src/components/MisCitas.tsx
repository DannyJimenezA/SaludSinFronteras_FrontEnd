import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { ArrowLeft, Calendar, Clock, Video, Plus, MapPin, ArrowUpDown, ChevronLeft, ChevronRight, X, ChevronDown, ChevronUp, FileText, User, DollarSign, MessageSquare } from "lucide-react";
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
  const [expandedAppointmentId, setExpandedAppointmentId] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const limit = 10;

  // Traer todas las citas y filtrar en el frontend por hora local
  const { data: allResponse, isLoading: allLoading } = useAllAppointments(currentPage, 100, order); // Aumentar límite para tener todas las citas
  const { data: cancelledData, isLoading: cancelledLoading } = useCancelledAppointments(100);

  // Hook para cancelar citas
  const cancelAppointment = useCancelAppointment();

  // Extrae datos y paginación del response de "Todas"
  const allData = allResponse?.data || [];
  const pagination = allResponse?.pagination;

  // Función para parsear fechas UTC como locales (sin conversión de zona horaria)
  const parseUTCAsLocal = (dateString: string) => {
    // Remover la 'Z' para que no se interprete como UTC
    const withoutZ = dateString.replace('Z', '');
    return new Date(withoutZ);
  };

  // Función para clasificar citas usando hora local
  const classifyAppointments = (appointments: any[]) => {
    const now = new Date();
    const upcoming: any[] = [];
    const past: any[] = [];

    appointments.forEach((apt) => {
      // Saltar citas canceladas
      if (apt.status === 'CANCELLED') return;

      const scheduledAt = parseUTCAsLocal(apt.scheduledAt);

      if (scheduledAt >= now) {
        upcoming.push(apt);
      } else {
        past.push(apt);
      }
    });

    return { upcoming, past };
  };

  // Clasificar citas
  const { upcoming: upcomingData, past: pastData } = classifyAppointments(allData);

  // Selecciona los datos según el filtro activo
  const getActiveData = () => {
    switch (activeFilter) {
      case "all":
        return { data: allData, loading: allLoading };
      case "upcoming":
        return { data: upcomingData, loading: allLoading };
      case "past":
        return { data: pastData, loading: allLoading };
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
    const date = parseUTCAsLocal(dateString);
    const dateFormatted = date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const timeFormatted = date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    return { date: dateFormatted, time: timeFormatted };
  };

  // Función para obtener el nombre del estado en español
  const getStatusName = (appointment: any) => {
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
      case "RESCHEDULED":
        return "Reprogramada";
      case "NO_SHOW":
        return "No asistió";
      default:
        return status;
    }
  };

  // Función para obtener el color del badge según el estado
  const getStatusBadge = (appointment: any) => {
    const status = appointment.status;
    const statusName = getStatusName(appointment);

    switch (status) {
      case "CONFIRMED":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{statusName}</Badge>;
      case "PENDING":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">{statusName}</Badge>;
      case "COMPLETED":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{statusName}</Badge>;
      case "CANCELLED":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{statusName}</Badge>;
      case "RESCHEDULED":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">{statusName}</Badge>;
      case "NO_SHOW":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">{statusName}</Badge>;
      default:
        return <Badge variant="outline">{statusName}</Badge>;
    }
  };

  // Función para abrir el diálogo de cancelación
  const handleCancelAppointment = (appointmentId: string) => {
    setAppointmentToCancel(appointmentId);
    setCancelReason("");
    setShowCancelDialog(true);
  };

  // Función para confirmar la cancelación
  const confirmCancelAppointment = async () => {
    if (!appointmentToCancel) return;

    try {
      await cancelAppointment.mutateAsync({
        id: appointmentToCancel,
        cancelReason: cancelReason.trim() || undefined,
      });

      toast.success("Cita cancelada exitosamente");
      setShowCancelDialog(false);
      setAppointmentToCancel(null);
      setCancelReason("");
    } catch (error: any) {
      toast.error("Error al cancelar la cita", {
        description: error.response?.data?.message || "Por favor, intenta nuevamente",
      });
    }
  };

  // Función para determinar si una cita puede ser cancelada
  const canCancelAppointment = (appointment: any) => {
    const status = appointment.status;

    // Solo se pueden cancelar citas pendientes o confirmadas
    if (status !== "PENDING" && status !== "CONFIRMED") {
      return false;
    }

    // Verificar que la cita no haya pasado
    const now = new Date();
    const scheduledAt = parseUTCAsLocal(appointment.scheduledAt);

    // Si la cita ya pasó, no se puede cancelar
    if (scheduledAt < now) {
      return false;
    }

    return true;
  };

  // Función para toggle del panel expandido
  const toggleAppointmentDetails = (appointmentId: string) => {
    setExpandedAppointmentId(expandedAppointmentId === appointmentId ? null : appointmentId);
  };

  // Función para verificar si el paciente puede unirse a la videollamada
  const canJoinVideoCall = (appointment: any) => {
    // Solo para citas online
    if (appointment.modality?.toLowerCase() !== 'online') {
      return { canJoin: false, reason: 'not_online' };
    }

    const now = new Date();
    const scheduledAt = parseUTCAsLocal(appointment.scheduledAt);
    const fiveMinutesBefore = new Date(scheduledAt.getTime() - 5 * 60 * 1000);

    // Verificar si la sala de video existe
    const roomExists = appointment.videoRoomName != null;

    // Verificar si estamos dentro del tiempo permitido (5 minutos antes o después de la hora)
    const isWithinTimeWindow = now >= fiveMinutesBefore;

    if (!roomExists && !isWithinTimeWindow) {
      // Sala no existe y aún no es tiempo
      const minutesUntilStart = Math.ceil((scheduledAt.getTime() - now.getTime()) / (60 * 1000));
      return {
        canJoin: false,
        reason: 'too_early',
        minutesUntilStart
      };
    }

    if (!roomExists && isWithinTimeWindow) {
      // Sala no existe pero ya es tiempo - el doctor debe habilitarla
      return {
        canJoin: false,
        reason: 'waiting_doctor'
      };
    }

    // Sala existe - puede unirse
    return { canJoin: true };
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
                  const isExpanded = expandedAppointmentId === appointment.id;

                  return (
                    <div
                      key={appointment.id}
                      className="border rounded-lg overflow-hidden transition-all"
                    >
                      {/* Información básica de la cita */}
                      <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
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
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(appointment)}
                          {activeFilter === "upcoming" && isOnline && (() => {
                            const joinStatus = canJoinVideoCall(appointment);

                            if (joinStatus.canJoin) {
                              return (
                                <Button
                                  className="bg-primary hover:bg-primary/90"
                                  onClick={() => navigate(`/video-call/${appointment.id}`)}
                                >
                                  <Video className="h-4 w-4 mr-2" />
                                  Unirse
                                </Button>
                              );
                            }

                            if (joinStatus.reason === 'too_early') {
                              return (
                                <Button
                                  disabled
                                  variant="outline"
                                  className="cursor-not-allowed"
                                  title={`La sala estará disponible ${joinStatus.minutesUntilStart} minutos antes de la cita`}
                                >
                                  <Clock className="h-4 w-4 mr-2" />
                                  {joinStatus.minutesUntilStart}min
                                </Button>
                              );
                            }

                            if (joinStatus.reason === 'waiting_doctor') {
                              return (
                                <Button
                                  disabled
                                  variant="outline"
                                  className="cursor-not-allowed animate-pulse"
                                  title="Esperando que el doctor habilite la sala"
                                >
                                  <Clock className="h-4 w-4 mr-2" />
                                  Esperando...
                                </Button>
                              );
                            }

                            return null;
                          })()}
                          <Button
                            variant="outline"
                            onClick={() => toggleAppointmentDetails(appointment.id)}
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

                      {/* Panel desplegable con información detallada */}
                      {isExpanded && (
                        <div className="border-t bg-muted/30">
                          <div className="p-6 space-y-4">
                            {/* Información detallada */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Información del doctor */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                  <User className="h-4 w-4 text-primary" />
                                  <span>Información del Doctor</span>
                                </div>
                                <div className="pl-6 space-y-1 text-sm text-muted-foreground">
                                  <p><span className="font-medium">Nombre:</span> {appointment.doctor?.name || 'No especificado'}</p>
                                  <p><span className="font-medium">Especialidad:</span> {appointment.doctor?.specialty || 'General'}</p>
                                  {appointment.doctor?.email && (
                                    <p><span className="font-medium">Email:</span> {appointment.doctor.email}</p>
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
                                  <p><span className="font-medium">Modalidad:</span> {isOnline ? 'Videollamada' : 'Presencial'}</p>
                                  <p><span className="font-medium">Duración:</span> {appointment.durationMin || 30} minutos</p>
                                  <p><span className="font-medium">Estado:</span> {getStatusName(appointment)}</p>
                                  {appointment.appointmentType && (
                                    <p><span className="font-medium">Tipo:</span> {appointment.appointmentType}</p>
                                  )}
                                </div>
                              </div>

                              {/* Costo */}
                              {appointment.costCents && (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm font-medium">
                                    <DollarSign className="h-4 w-4 text-primary" />
                                    <span>Información de Pago</span>
                                  </div>
                                  <div className="pl-6 space-y-1 text-sm text-muted-foreground">
                                    <p><span className="font-medium">Costo:</span> ${(appointment.costCents / 100).toFixed(2)}</p>
                                  </div>
                                </div>
                              )}

                              {/* Notas o motivo de cancelación */}
                              {(appointment.notes || appointment.cancelReason) && (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm font-medium">
                                    <MessageSquare className="h-4 w-4 text-primary" />
                                    <span>Notas</span>
                                  </div>
                                  <div className="pl-6 space-y-1 text-sm text-muted-foreground">
                                    {appointment.notes && (
                                      <p className="text-foreground">{appointment.notes}</p>
                                    )}
                                    {appointment.cancelReason && (
                                      <p className="text-red-600">
                                        <span className="font-medium">Motivo de cancelación:</span> {appointment.cancelReason}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Acciones */}
                            <div className="pt-4 border-t flex justify-end gap-3">
                              {canCancelAppointment(appointment) && (
                                <Button
                                  variant="destructive"
                                  onClick={() => handleCancelAppointment(appointment.id)}
                                  disabled={cancelAppointment.isPending}
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Cancelar Cita
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
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

      {/* Diálogo de confirmación de cancelación */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Cita</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="cancel-reason" className="text-sm font-medium text-foreground">
                Motivo de cancelación (opcional)
              </label>
              <Input
                id="cancel-reason"
                placeholder="Ej: Conflicto de horario, problemas de salud, etc."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Proporcionar un motivo ayuda al médico a entender mejor tu situación.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCancelDialog(false);
                setAppointmentToCancel(null);
                setCancelReason("");
              }}
              disabled={cancelAppointment.isPending}
            >
              No, mantener cita
            </Button>
            <Button
              variant="destructive"
              onClick={confirmCancelAppointment}
              disabled={cancelAppointment.isPending}
            >
              {cancelAppointment.isPending ? (
                <>Cancelando...</>
              ) : (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Sí, cancelar cita
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
