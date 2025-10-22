/**
 * BookAppointment.tsx
 * Vista moderna y minimalista para que el PACIENTE agende citas
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDoctorAvailability } from "@/hooks/useAvailability";
import { useCreateAppointment } from "@/hooks/useAppointments";
import { groupSlotsByDate, getAvailableSlots, AvailabilitySlotApi } from "@/services/availability";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Clock,
  Video,
  Building2,
  Phone,
  Calendar as CalendarIcon,
  ArrowLeft,
  CheckCircle2,
  User,
  Stethoscope,
  XCircle,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import Swal from "sweetalert2";

interface BookAppointmentProps {
  doctorId: number | string;
  doctorName: string;
  doctorSpecialty?: string;
}

export function BookAppointment({ doctorId, doctorName, doctorSpecialty }: BookAppointmentProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { data: allSlots = [], isLoading } = useDoctorAvailability(doctorId);
  const createAppointment = useCreateAppointment();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [modality, setModality] = useState<"online" | "onsite" | "phone">("online");
  const [reason, setReason] = useState("");

  // Protección: Solo pacientes pueden acceder
  if (currentUser !== "patient") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6 pb-6 text-center">
            <XCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-bold mb-2">Acceso Denegado</h2>
            <p className="text-muted-foreground mb-4">
              Esta sección es exclusiva para pacientes
            </p>
            <Button onClick={() => navigate("/")}>Volver al Inicio</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filtrar SOLO slots disponibles (no reservados)
  const availableSlots = getAvailableSlots(allSlots);
  const slotsByDate = groupSlotsByDate(availableSlots);

  const dateKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const slotsForDate = dateKey ? (slotsByDate[dateKey] || []) : [];

  // Obtener todas las fechas que tienen slots disponibles
  const datesWithSlots = Object.keys(slotsByDate).map((date) => parseISO(date + "T00:00:00"));

  const handleBookAppointment = async () => {
    if (!selectedSlotId) return;

    try {
      await createAppointment.mutateAsync({
        DoctorUserId: Number(doctorId),
        SlotId: selectedSlotId,
        Modality: modality,
        Reason: reason || undefined,
      });

      await Swal.fire({
        icon: "success",
        title: "¡Cita Agendada!",
        text: "Tu cita fue reservada exitosamente.",
        confirmButtonText: "OK",
        confirmButtonColor: "#0f766e",
      });

      // Limpiar selección y regresar
      setSelectedSlotId(null);
      setReason("");
      navigate("/patient-dashboard");
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || "No se pudo agendar la cita. Intenta de nuevo.",
      });
    }
  };

  const selectedSlot = slotsForDate.find((s) => Number(s.Id) === selectedSlotId);

  // Estados de carga y sin disponibilidad
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

  if (availableSlots.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <Card className="max-w-lg">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="bg-primary/5 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <CalendarIcon className="h-12 w-12 text-primary/40" />
            </div>
            <h3 className="text-2xl font-bold mb-3">No hay disponibilidad</h3>
            <p className="text-muted-foreground mb-2">
              <span className="font-semibold">{doctorName}</span> no tiene horarios disponibles en este momento.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Por favor, intenta más tarde o selecciona otro doctor.
            </p>
            <Button onClick={() => navigate("/patient-dashboard")} size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Dashboard
            </Button>
          </CardContent>
        </Card>
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
            onClick={() => navigate("/patient-dashboard")}
            className="mb-4 hover:bg-primary/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Dashboard
          </Button>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Agendar Cita Médica
              </h1>
              <div className="flex items-center gap-3 text-lg text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span className="font-semibold text-foreground">{doctorName}</span>
                </div>
                {doctorSpecialty && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5" />
                      <span>{doctorSpecialty}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${selectedDate ? "bg-primary/10 border-primary" : "bg-muted"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${selectedDate ? "bg-primary text-white" : "bg-muted-foreground/20"}`}>
                  1
                </div>
                <span className="text-sm font-medium">Fecha</span>
              </div>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${selectedSlotId ? "bg-primary/10 border-primary" : "bg-muted"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${selectedSlotId ? "bg-primary text-white" : "bg-muted-foreground/20"}`}>
                  2
                </div>
                <span className="text-sm font-medium">Horario</span>
              </div>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border bg-muted`}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-muted-foreground/20">
                  3
                </div>
                <span className="text-sm font-medium">Confirmar</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Paso 1: Seleccionar fecha */}
          <Card className="shadow-lg border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                  1
                </div>
                Selecciona una Fecha
              </CardTitle>
              <CardDescription>Fechas con disponibilidad están resaltadas</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                    setSelectedSlotId(null); // Reset slot selection
                  }
                }}
                locale={es}
                disabled={(date) => {
                  // Deshabilitar fechas sin slots disponibles
                  const key = format(date, "yyyy-MM-dd");
                  return !slotsByDate[key] || slotsByDate[key].length === 0;
                }}
                modifiers={{
                  available: datesWithSlots,
                }}
                modifiersClassNames={{
                  available: "bg-green-100 dark:bg-green-900/30 font-bold hover:bg-green-200 dark:hover:bg-green-900/40",
                }}
                className="rounded-md border shadow-sm"
              />

              <div className="mt-4 p-3 bg-primary/5 rounded-lg text-sm">
                <p className="font-medium mb-1">💡 Tip</p>
                <p className="text-muted-foreground text-xs">
                  Solo puedes seleccionar fechas con horarios disponibles (resaltadas en verde)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Paso 2: Seleccionar horario */}
          <Card className="shadow-lg border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${selectedDate ? "bg-primary text-white" : "bg-muted-foreground/20"}`}>
                  2
                </div>
                Elige un Horario
              </CardTitle>
              <CardDescription>
                {selectedDate
                  ? format(selectedDate, "EEEE, d 'de' MMMM, yyyy", { locale: es })
                  : "Primero selecciona una fecha"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedDate ? (
                <div className="text-center py-12">
                  <Clock className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground text-sm">
                    Selecciona una fecha en el calendario para ver horarios disponibles
                  </p>
                </div>
              ) : slotsForDate.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground text-sm">No hay horarios disponibles para esta fecha</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[450px] overflow-y-auto pr-2">
                  {slotsForDate
                    .sort((a, b) => a.StartTime.localeCompare(b.StartTime))
                    .map((slot) => (
                      <button
                        key={slot.Id}
                        onClick={() => setSelectedSlotId(Number(slot.Id))}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                          selectedSlotId === Number(slot.Id)
                            ? "border-primary bg-gradient-to-r from-primary/10 to-primary/5 shadow-lg scale-[1.02]"
                            : "border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-muted/50 hover:scale-[1.01]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-lg ${selectedSlotId === Number(slot.Id) ? "bg-primary/20" : "bg-primary/5"}`}>
                            <Clock className={`h-5 w-5 ${selectedSlotId === Number(slot.Id) ? "text-primary" : "text-muted-foreground"}`} />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-lg">
                              {slot.StartTime.slice(0, 5)} - {slot.EndTime.slice(0, 5)}
                            </p>
                            <p className="text-xs text-muted-foreground">1 hora de consulta</p>
                          </div>
                          {selectedSlotId === Number(slot.Id) && (
                            <CheckCircle2 className="h-6 w-6 text-primary" />
                          )}
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Paso 3: Confirmar detalles */}
          <Card className="shadow-lg border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${selectedSlotId ? "bg-primary text-white" : "bg-muted-foreground/20"}`}>
                  3
                </div>
                Detalles de la Cita
              </CardTitle>
              <CardDescription>Completa la información final</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Modalidad */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Modalidad de Consulta</Label>
                <RadioGroup
                  value={modality}
                  onValueChange={(v: "online" | "onsite" | "phone") => setModality(v)}
                  className="space-y-2"
                >
                  <div
                    className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      modality === "online"
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-gray-200 dark:border-gray-700 hover:bg-muted/50"
                    }`}
                  >
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <Video className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Videollamada</p>
                        <p className="text-xs text-muted-foreground">Consulta virtual online</p>
                      </div>
                    </Label>
                  </div>

                  <div
                    className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      modality === "onsite"
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-gray-200 dark:border-gray-700 hover:bg-muted/50"
                    }`}
                  >
                    <RadioGroupItem value="onsite" id="onsite" />
                    <Label htmlFor="onsite" className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                        <Building2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Presencial</p>
                        <p className="text-xs text-muted-foreground">Visita al consultorio</p>
                      </div>
                    </Label>
                  </div>

                  <div
                    className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      modality === "phone"
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-gray-200 dark:border-gray-700 hover:bg-muted/50"
                    }`}
                  >
                    <RadioGroupItem value="phone" id="phone" />
                    <Label htmlFor="phone" className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                        <Phone className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Teléfono</p>
                        <p className="text-xs text-muted-foreground">Llamada telefónica</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Motivo */}
              <div>
                <Label htmlFor="reason" className="text-base font-semibold mb-2 block">
                  Motivo de la Consulta <span className="text-xs text-muted-foreground font-normal">(opcional)</span>
                </Label>
                <Textarea
                  id="reason"
                  placeholder="Describe brevemente el motivo de tu consulta..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>

              {/* Resumen */}
              {selectedSlot && (
                <div className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border-2 border-primary/20 space-y-2">
                  <p className="font-bold text-sm mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Resumen de tu Cita
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-primary" />
                      <span className="font-medium">
                        {selectedDate && format(selectedDate, "EEEE, d 'de' MMMM, yyyy", { locale: es })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-medium">
                        {selectedSlot.StartTime.slice(0, 5)} - {selectedSlot.EndTime.slice(0, 5)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      <span className="font-medium">{doctorName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {modality === "online" ? (
                        <Video className="h-4 w-4 text-primary" />
                      ) : modality === "onsite" ? (
                        <Building2 className="h-4 w-4 text-primary" />
                      ) : (
                        <Phone className="h-4 w-4 text-primary" />
                      )}
                      <span className="font-medium">
                        {modality === "online" ? "Videollamada" : modality === "onsite" ? "Presencial" : "Teléfono"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Botón confirmar */}
              <Button
                onClick={handleBookAppointment}
                disabled={!selectedSlotId || createAppointment.isPending}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                size="lg"
              >
                {createAppointment.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Agendando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Confirmar Cita
                  </>
                )}
              </Button>

              {!selectedSlotId && (
                <p className="text-xs text-center text-muted-foreground">
                  Selecciona una fecha y horario para continuar
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Footer */}
        <Card className="mt-6 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-6 items-center justify-center text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="font-medium">Disponible:</span>
                <span className="text-muted-foreground">Horarios que puedes reservar</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-medium">Duración:</span>
                <span className="text-muted-foreground">Cada consulta dura 1 hora</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-primary" />
                <span className="font-medium">Confirmación:</span>
                <span className="text-muted-foreground">Recibirás una notificación al agendar</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
