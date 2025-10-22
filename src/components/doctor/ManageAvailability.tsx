/**
 * ManageAvailability.tsx
 * Vista moderna y minimalista para que el DOCTOR gestione su disponibilidad
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMyAvailability, useCreateMultipleSlots } from "@/hooks/useAvailability";
import { groupSlotsByDate } from "@/services/availability";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Plus,
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Sparkles,
  Trash2
} from "lucide-react";
import { format, addDays, startOfToday } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";

export function ManageAvailability() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { data: slots = [], isLoading } = useMyAvailability();
  const createSlots = useCreateMultipleSlots();
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());

  // Protección: Solo doctores pueden acceder
  if (currentUser !== "doctor") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6 pb-6 text-center">
            <XCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-bold mb-2">Acceso Denegado</h2>
            <p className="text-muted-foreground mb-4">
              Esta sección es exclusiva para doctores
            </p>
            <Button onClick={() => navigate("/")}>Volver al Inicio</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Agrupar slots por fecha
  const slotsByDate = groupSlotsByDate(slots);
  const dateKey = format(selectedDate, "yyyy-MM-dd");
  const slotsForDate = slotsByDate[dateKey] || [];

  // Estadísticas
  const totalSlots = slots.length;
  const bookedSlots = slots.filter(s => s.IsBooked).length;
  const availableSlots = totalSlots - bookedSlots;
  const datesWithSlots = Object.keys(slotsByDate).length;

  // Función para crear horarios predeterminados
  const handleCreateDaySchedule = () => {
    const newSlots = [];

    // Crear slots de 9:00 AM a 5:00 PM (cada hora)
    for (let hour = 9; hour < 17; hour++) {
      newSlots.push({
        Date: dateKey,
        StartTime: `${hour.toString().padStart(2, "0")}:00:00`,
        EndTime: `${(hour + 1).toString().padStart(2, "0")}:00:00`,
      });
    }

    createSlots.mutate(newSlots);
  };

  // Función para crear horarios de la semana
  const handleCreateWeekSchedule = () => {
    const newSlots = [];

    // Para los próximos 7 días
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const date = addDays(selectedDate, dayOffset);
      const dayKey = format(date, "yyyy-MM-dd");

      // Si ya tiene slots ese día, saltar
      if (slotsByDate[dayKey]?.length > 0) continue;

      // Crear slots de 9AM a 5PM
      for (let hour = 9; hour < 17; hour++) {
        newSlots.push({
          Date: dayKey,
          StartTime: `${hour.toString().padStart(2, "0")}:00:00`,
          EndTime: `${(hour + 1).toString().padStart(2, "0")}:00:00`,
        });
      }
    }

    if (newSlots.length > 0) {
      createSlots.mutate(newSlots);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">Cargando disponibilidad...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/doctor-dashboard")}
            className="mb-4 hover:bg-primary/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Dashboard
          </Button>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Mi Disponibilidad
              </h1>
              <p className="text-muted-foreground text-lg">
                Gestiona tus horarios de atención
              </p>
            </div>

            {/* Stats Cards - Mini */}
            <div className="flex gap-3">
              <div className="bg-card border rounded-lg px-4 py-2 shadow-sm">
                <p className="text-xs text-muted-foreground">Total Horarios</p>
                <p className="text-2xl font-bold text-primary">{totalSlots}</p>
              </div>
              <div className="bg-card border rounded-lg px-4 py-2 shadow-sm">
                <p className="text-xs text-muted-foreground">Disponibles</p>
                <p className="text-2xl font-bold text-green-600">{availableSlots}</p>
              </div>
              <div className="bg-card border rounded-lg px-4 py-2 shadow-sm">
                <p className="text-xs text-muted-foreground">Reservados</p>
                <p className="text-2xl font-bold text-orange-600">{bookedSlots}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Calendario y acciones */}
          <div className="lg:col-span-1 space-y-6">
            {/* Calendario */}
            <Card className="shadow-lg border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  Calendario
                </CardTitle>
                <CardDescription>
                  Selecciona una fecha para gestionar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  locale={es}
                  className="rounded-md border shadow-sm"
                  modifiers={{
                    hasSlots: (date) => {
                      const key = format(date, "yyyy-MM-dd");
                      return (slotsByDate[key]?.length || 0) > 0;
                    },
                    hasAvailable: (date) => {
                      const key = format(date, "yyyy-MM-dd");
                      const daySlots = slotsByDate[key] || [];
                      return daySlots.some(s => !s.IsBooked);
                    },
                  }}
                  modifiersClassNames={{
                    hasSlots: "bg-primary/10 font-bold",
                    hasAvailable: "bg-green-100 dark:bg-green-900/20",
                  }}
                />

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-100 dark:bg-green-900/20 border-2 border-green-500"></div>
                    <span className="text-muted-foreground">Días con disponibilidad</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-primary/10 border-2 border-primary"></div>
                    <span className="text-muted-foreground">Días con horarios</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Acciones Rápidas */}
            <Card className="shadow-lg border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Acciones Rápidas
                </CardTitle>
                <CardDescription>
                  Crea horarios de forma automática
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleCreateDaySchedule}
                  disabled={createSlots.isPending || slotsForDate.length > 0}
                  className="w-full h-auto py-4 flex-col gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  size="lg"
                >
                  <Plus className="h-5 w-5" />
                  <div className="text-center">
                    <div className="font-semibold">Crear Día Completo</div>
                    <div className="text-xs opacity-90">9:00 AM - 5:00 PM</div>
                  </div>
                </Button>

                <Button
                  onClick={handleCreateWeekSchedule}
                  disabled={createSlots.isPending}
                  variant="outline"
                  className="w-full h-auto py-4 flex-col gap-2 border-primary/30 hover:bg-primary/5"
                  size="lg"
                >
                  <CalendarIcon className="h-5 w-5" />
                  <div className="text-center">
                    <div className="font-semibold">Crear Semana</div>
                    <div className="text-xs opacity-70">Próximos 7 días (sin duplicar)</div>
                  </div>
                </Button>

                {slotsForDate.length > 0 && (
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Este día ya tiene horarios configurados
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Columna derecha - Lista de horarios */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-primary/10">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <CardTitle className="text-2xl">
                      {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
                    </CardTitle>
                    <CardDescription className="text-base mt-1">
                      {slotsForDate.length === 0
                        ? "No hay horarios configurados"
                        : `${slotsForDate.length} horario${slotsForDate.length !== 1 ? "s" : ""} configurado${slotsForDate.length !== 1 ? "s" : ""}`
                      }
                    </CardDescription>
                  </div>

                  {slotsForDate.length > 0 && (
                    <div className="flex gap-2">
                      <Badge variant="outline" className="px-3 py-1">
                        <CheckCircle2 className="h-3 w-3 mr-1 text-green-600" />
                        {slotsForDate.filter(s => !s.IsBooked).length} disponibles
                      </Badge>
                      <Badge variant="outline" className="px-3 py-1">
                        <XCircle className="h-3 w-3 mr-1 text-orange-600" />
                        {slotsForDate.filter(s => s.IsBooked).length} reservados
                      </Badge>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                {slotsForDate.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="bg-primary/5 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                      <Clock className="h-12 w-12 text-primary/40" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No hay horarios para esta fecha</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                      Crea horarios usando las acciones rápidas del panel izquierdo
                    </p>
                    <Button
                      onClick={handleCreateDaySchedule}
                      disabled={createSlots.isPending}
                      size="lg"
                      className="bg-gradient-to-r from-primary to-primary/80"
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Crear Horarios
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2">
                    {slotsForDate
                      .sort((a, b) => a.StartTime.localeCompare(b.StartTime))
                      .map((slot) => (
                        <div
                          key={slot.Id}
                          className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                            slot.IsBooked
                              ? "bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-900"
                              : "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-900 hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${
                                slot.IsBooked
                                  ? "bg-orange-100 dark:bg-orange-900/30"
                                  : "bg-green-100 dark:bg-green-900/30"
                              }`}>
                                <Clock className={`h-5 w-5 ${
                                  slot.IsBooked ? "text-orange-600" : "text-green-600"
                                }`} />
                              </div>
                              <div>
                                <p className="font-bold text-lg">
                                  {slot.StartTime.slice(0, 5)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  hasta {slot.EndTime.slice(0, 5)}
                                </p>
                                {slot.IsBooked && slot.AppointmentId && (
                                  <Badge variant="secondary" className="mt-1 text-xs">
                                    Cita #{slot.AppointmentId}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <Badge
                              variant={slot.IsBooked ? "destructive" : "default"}
                              className="font-semibold"
                            >
                              {slot.IsBooked ? (
                                <>
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Reservado
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Disponible
                                </>
                              )}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info Footer */}
        <Card className="mt-6 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-6 items-center justify-center text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="font-medium">Disponible:</span>
                <span className="text-muted-foreground">Horarios libres para agendar</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-orange-600" />
                <span className="font-medium">Reservado:</span>
                <span className="text-muted-foreground">Ya tiene cita agendada</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-medium">Tip:</span>
                <span className="text-muted-foreground">Crea horarios por semana para ahorrar tiempo</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
