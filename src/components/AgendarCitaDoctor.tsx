import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { ArrowLeft, Calendar, Clock, Loader2, CheckCircle } from "lucide-react";
import { useDoctorAvailableSlots, type TimeSlot } from "../hooks/useDoctors";
import { useCreateAppointment } from "../hooks/useAppointments";
import { toast } from "sonner";

export function AgendarCitaDoctor() {
  const navigate = useNavigate();
  const { doctorId } = useParams<{ doctorId: string }>();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [modality, setModality] = useState<'online' | 'in_person' | 'hybrid'>('online');

  // Función para obtener la fecha de hoy en formato YYYY-MM-DD
  const getTodayDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());

  // Función para convertir fecha UTC a fecha local sin cambiar la hora
  const parseUTCAsLocal = (dateString: string) => {
    // Remover la 'Z' para que no se interprete como UTC
    const withoutZ = dateString.replace('Z', '');
    return new Date(withoutZ);
  };

  // Calcular rango de fechas para el backend (30 días desde hoy)
  const getDateRange = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 30);

    return {
      startDate: today.toISOString().split('T')[0], // YYYY-MM-DD
      endDate: endDate.toISOString().split('T')[0]
    };
  };

  const dateRange = getDateRange();

  // Obtener slots disponibles para la fecha seleccionada
  const { data, isLoading, error } = useDoctorAvailableSlots(
    doctorId,
    dateRange.startDate,
    dateRange.endDate
  );

  // Debug: ver qué está devolviendo el backend
  console.log('AgendarCitaDoctor - Backend response:', {
    doctor: data?.doctor,
    slotsCount: data?.slots?.length || 0,
    slots: data?.slots,
    selectedDate,
    dateRange,
    currentTime: new Date().toISOString(),
    currentLocalTime: new Date().toLocaleString('es-CR', { timeZone: 'America/Costa_Rica' })
  });

  // Filtrar slots por fecha seleccionada
  const filteredSlotsByDate = data?.slots.filter((slot) => {
    const slotDate = parseUTCAsLocal(slot.startAt);
    const filterDate = new Date(selectedDate + 'T00:00:00');

    return (
      slotDate.getFullYear() === filterDate.getFullYear() &&
      slotDate.getMonth() === filterDate.getMonth() &&
      slotDate.getDate() === filterDate.getDate()
    );
  }) || [];

  // Hook para crear la cita
  const createAppointment = useCreateAppointment();

  // Agrupar slots filtrados por fecha
  const slotsByDate = filteredSlotsByDate.reduce((acc, slot) => {
    const date = parseUTCAsLocal(slot.startAt).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlot(slotId);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot || !doctorId) return;

    try {
      await createAppointment.mutateAsync({
        DoctorUserId: Number(doctorId),
        SlotId: Number(selectedSlot),
        Modality: modality,
      });

      toast.success("¡Cita agendada exitosamente!", {
        description: "Puedes ver los detalles en 'Mis Citas'",
      });

      // Redirigir a mis citas después de 1.5 segundos
      setTimeout(() => {
        navigate("/mis-citas");
      }, 1500);
    } catch (error: any) {
      toast.error("Error al agendar la cita", {
        description: error.response?.data?.message || "Por favor, intenta nuevamente",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/nueva-cita")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Seleccionar Horario
            </h1>
            {data?.doctor && (
              <p className="text-muted-foreground mt-1">
                Dr. {data.doctor.name}
              </p>
            )}
          </div>
        </div>

        {/* Filtro por fecha */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block text-foreground">
                  Filtrar por fecha
                </label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={getTodayDate()}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setSelectedDate(getTodayDate())}
              >
                Hoy
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contenido */}
        {isLoading ? (
          <Card>
            <CardContent className="p-12">
              <div className="text-center">
                <Loader2 className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-spin" />
                <p className="text-muted-foreground">
                  Cargando horarios disponibles...
                </p>
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="p-12">
              <div className="text-center">
                <Calendar className="h-16 w-16 text-red-400 mx-auto mb-4" />
                <p className="text-red-600">Error al cargar los horarios</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Por favor, intenta nuevamente
                </p>
              </div>
            </CardContent>
          </Card>
        ) : !data?.slots || data.slots.length === 0 ? (
          <Card>
            <CardContent className="p-12">
              <div className="text-center">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No hay horarios disponibles en este momento
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Este doctor no tiene espacios disponibles para los próximos 30
                  días
                </p>
                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={() => navigate("/nueva-cita")}
                >
                  Buscar otro doctor
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : filteredSlotsByDate.length === 0 ? (
          <Card>
            <CardContent className="p-12">
              <div className="text-center">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No hay horarios disponibles para la fecha seleccionada
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Intenta seleccionar otra fecha
                </p>
                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={() => setSelectedDate(getTodayDate())}
                >
                  Ver hoy
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Lista de horarios agrupados por fecha */}
            <div className="space-y-4">
              {slotsByDate &&
                Object.entries(slotsByDate).map(([date, slots]) => (
                  <Card key={date}>
                    <CardHeader>
                      <CardTitle className="text-lg text-foreground capitalize">
                        <Calendar className="h-5 w-5 inline mr-2" />
                        {date}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {slots.map((slot) => {
                          const startTime = parseUTCAsLocal(
                            slot.startAt
                          ).toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          });
                          const endTime = parseUTCAsLocal(
                            slot.endAt
                          ).toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          });
                          const isSelected = selectedSlot === slot.id;

                          return (
                            <Button
                              key={slot.id}
                              variant={isSelected ? "default" : "outline"}
                              className={`flex flex-col items-center justify-center h-20 ${
                                isSelected
                                  ? "bg-primary text-white"
                                  : "hover:bg-primary/10"
                              }`}
                              onClick={() => handleSlotSelect(slot.id)}
                            >
                              <Clock className="h-4 w-4 mb-1" />
                              <span className="font-semibold">
                                {startTime}
                              </span>
                              <span className="text-xs opacity-80">
                                {endTime}
                              </span>
                              {isSelected && (
                                <CheckCircle className="h-4 w-4 mt-1" />
                              )}
                            </Button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {/* Botón de confirmación */}
            {selectedSlot && (
              <Card className="border-2 border-primary">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Horario seleccionado
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      {data.slots
                        .find((s) => s.id === selectedSlot)
                        ?.startAt &&
                        new Date(
                          data.slots.find((s) => s.id === selectedSlot)!
                            .startAt
                        ).toLocaleString("es-ES", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </p>
                  </div>

                  {/* Selector de modalidad */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Modalidad de consulta
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant={modality === 'online' ? 'default' : 'outline'}
                        onClick={() => setModality('online')}
                        className="flex-1"
                      >
                        En línea
                      </Button>
                      <Button
                        variant={modality === 'in_person' ? 'default' : 'outline'}
                        onClick={() => setModality('in_person')}
                        className="flex-1"
                      >
                        Presencial
                      </Button>
                      <Button
                        variant={modality === 'hybrid' ? 'default' : 'outline'}
                        onClick={() => setModality('hybrid')}
                        className="flex-1"
                      >
                        Híbrido
                      </Button>
                    </div>
                  </div>

                  {/* Botón de confirmación */}
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={handleConfirmBooking}
                    disabled={createAppointment.isPending}
                  >
                    {createAppointment.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Agendando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirmar Cita
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
