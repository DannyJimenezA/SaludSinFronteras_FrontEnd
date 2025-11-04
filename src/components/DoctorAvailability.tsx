import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "sonner";

interface AvailabilitySlot {
  Id: string;
  DoctorUserId: string;
  StartAt: string;
  EndAt: string;
  IsRecurring: boolean;
  RRule: string | null;
  CreatedAt: string;
  UpdatedAt: string;
}

// Obtener disponibilidad del doctor
async function getMyAvailability(from?: string, to?: string) {
  const params: any = {};
  if (from) params.from = from;
  if (to) params.to = to;

  const { data } = await api.get<AvailabilitySlot[]>("/doctors/me/availability", { params });
  return Array.isArray(data) ? data : [];
}

// Crear un slot de disponibilidad
async function createSlot(payload: { StartAt: string; EndAt: string }) {
  const { data } = await api.post("/doctors/me/availability", payload);
  return data;
}

// Eliminar un slot de disponibilidad
async function deleteSlot(slotId: string) {
  await api.delete(`/availability/${slotId}`);
}

export function DoctorAvailability() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Obtener fecha de hoy en formato YYYY-MM-DD en timezone local
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

  // Estado para el formulario
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [duration, setDuration] = useState<"30" | "45" | "60">("30");

  // Estado para filtros y paginación (por defecto hoy)
  const [filterDate, setFilterDate] = useState<string>(getTodayDate());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 3x3 grid

  // Obtener disponibilidad
  const { data: slots, isLoading } = useQuery({
    queryKey: ["availability", "mine"],
    queryFn: () => getMyAvailability(),
    staleTime: 30_000,
  });

  // Mutation para crear slot
  const createMutation = useMutation({
    mutationFn: createSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability", "mine"] });
      toast.success("Disponibilidad creada exitosamente");
      // Limpiar formulario
      setSelectedDate("");
      setStartTime("");
      setDuration("30");
    },
    onError: (error: any) => {
      toast.error("Error al crear disponibilidad", {
        description: error.response?.data?.message || "Por favor, intenta nuevamente",
      });
    },
  });

  // Mutation para eliminar slot
  const deleteMutation = useMutation({
    mutationFn: deleteSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability", "mine"] });
      toast.success("Disponibilidad eliminada");
    },
    onError: (error: any) => {
      toast.error("Error al eliminar disponibilidad", {
        description: error.response?.data?.message || "Por favor, intenta nuevamente",
      });
    },
  });

  const handleCreateSlot = () => {
    if (!selectedDate || !startTime) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    // Crear fecha de inicio en UTC
    const startDateTime = new Date(`${selectedDate}T${startTime}:00`);

    // Calcular fecha de fin según duración seleccionada
    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + parseInt(duration));

    // Convertir a ISO string UTC
    const StartAt = startDateTime.toISOString();
    const EndAt = endDateTime.toISOString();

    createMutation.mutate({ StartAt, EndAt });
  };

  const handleDeleteSlot = (slotId: string) => {
    if (confirm("¿Estás seguro de eliminar esta disponibilidad?")) {
      deleteMutation.mutate(slotId);
    }
  };

  // Filtrar slots por fecha seleccionada
  const filteredSlots = (slots ?? []).filter((slot) => {
    if (!filterDate) return true;

    const slotDate = parseUTCAsLocal(slot.StartAt);
    const filterDateObj = new Date(filterDate + "T00:00:00");

    return (
      slotDate.getFullYear() === filterDateObj.getFullYear() &&
      slotDate.getMonth() === filterDateObj.getMonth() &&
      slotDate.getDate() === filterDateObj.getDate()
    );
  }).sort((a, b) => parseUTCAsLocal(a.StartAt).getTime() - parseUTCAsLocal(b.StartAt).getTime());

  // Calcular paginación
  const totalPages = Math.ceil(filteredSlots.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSlots = filteredSlots.slice(startIndex, endIndex);

  // Reset página cuando cambia el filtro
  const handleFilterDateChange = (newDate: string) => {
    setFilterDate(newDate);
    setCurrentPage(1);
  };

  const handleShowToday = () => {
    setFilterDate(getTodayDate());
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/doctor-dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-primary">Gestión de Disponibilidad</h1>
            <p className="text-muted-foreground">
              Crea y administra tus horarios disponibles para citas
            </p>
          </div>
        </div>

        {/* Formulario para crear disponibilidad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Crear Nueva Disponibilidad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Fecha
                </label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={getTodayDate()}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Hora de inicio
                </label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Duración
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value as "30" | "45" | "60")}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="30">30 minutos</option>
                  <option value="45">45 minutos</option>
                  <option value="60">1 hora</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={handleCreateSlot}
                  disabled={createMutation.isPending}
                  className="w-full"
                >
                  {createMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Crear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de disponibilidad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Mi Disponibilidad
              </div>
              {filteredSlots.length > 0 && (
                <Badge variant="secondary">
                  {filteredSlots.length} slot{filteredSlots.length !== 1 ? "s" : ""}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Filtro por fecha */}
            <div className="flex flex-col sm:flex-row gap-4 pb-4 border-b">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">
                  Filtrar por fecha
                </label>
                <Input
                  type="date"
                  value={filterDate}
                  onChange={(e) => handleFilterDateChange(e.target.value)}
                  placeholder="Selecciona una fecha"
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={handleShowToday}
                >
                  Hoy
                </Button>
              </div>
            </div>
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 text-muted-foreground mx-auto mb-3 animate-spin" />
                <p className="text-muted-foreground text-sm">Cargando disponibilidad...</p>
              </div>
            ) : !slots || slots.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No tienes disponibilidad creada aún</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Crea tu primera disponibilidad usando el formulario de arriba
                </p>
              </div>
            ) : filteredSlots.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No hay disponibilidad para la fecha seleccionada</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Intenta seleccionar otra fecha o limpia el filtro
                </p>
              </div>
            ) : (
              <>
                {/* Grid de slots */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {paginatedSlots.map((slot) => {
                    const start = parseUTCAsLocal(slot.StartAt);
                    const end = parseUTCAsLocal(slot.EndAt);
                    const durationMins = Math.round((end.getTime() - start.getTime()) / 60000);

                    return (
                      <Card key={slot.Id} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              {/* Fecha */}
                              <p className="text-xs text-muted-foreground mb-2">
                                {start.toLocaleDateString("es-ES", {
                                  weekday: "short",
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                              {/* Hora */}
                              <div className="flex items-center gap-2 mb-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">
                                  {start.toLocaleTimeString("es-ES", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                  {" - "}
                                  {end.toLocaleTimeString("es-ES", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              <Badge variant="secondary">
                                {durationMins} minutos
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteSlot(slot.Id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-10"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
