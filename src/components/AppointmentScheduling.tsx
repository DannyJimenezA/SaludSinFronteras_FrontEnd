import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar as CalendarIcon, Clock, Calendar as CalendarGlyph } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

import { useDoctorAvailability, useCreateAppointment } from "../hooks/useSchedule";

type ApptType = "videollamada" | "presencial";

interface AppointmentSchedulingProps {
  preselectedDoctorId?: number;
  preselectedDateISO?: string;
}

function hhmm(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? "—"
    : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function AppointmentScheduling({
  preselectedDoctorId,
  preselectedDateISO,
}: AppointmentSchedulingProps) {
  const navigate = useNavigate();
  const { getDashboardRoute } = useAuth();

  /* ------------------ Estado UI ------------------ */
  const [doctorId, setDoctorId] = useState<number | "">(preselectedDoctorId ?? "");
  const [dateISO, setDateISO] = useState<string>(
    preselectedDateISO ?? new Date().toISOString().slice(0, 10)
  ); // YYYY-MM-DD
  const [apptType, setApptType] = useState<ApptType>("videollamada");

  /* ------------------ Backend: disponibilidad ------------------ */
  const {
    data: slots = [],
    isLoading: slotsLoading,
    isRefetching,
  } = useDoctorAvailability(typeof doctorId === "number" ? doctorId : undefined, dateISO || undefined);

  /* ------------------ Backend: crear cita ------------------ */
  const createAppt = useCreateAppointment();

  const canQuery = useMemo(
    () => typeof doctorId === "number" && dateISO.length === 10,
    [doctorId, dateISO]
  );

  useEffect(() => {
    // Si venimos con doctor precargado, no necesitamos más aquí:
    // el hook ya hará el fetch.
  }, [preselectedDoctorId]);

  /* ------------------ Acciones ------------------ */
  async function handleBook(slotId: number) {
    if (!canQuery) return;

    try {
      await createAppt.mutateAsync({
        doctorId: doctorId as number,
        slotId: Number(slotId), // aseguramos entero
        modality: apptType === "videollamada" ? "online" : "inperson",
      });

      await Swal.fire({
        icon: "success",
        title: "¡Cita creada!",
        text: "Tu cita fue agendada correctamente.",
        confirmButtonText: "OK",
        confirmButtonColor: "#0f766e",
      });

      navigate(getDashboardRoute());
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        "No se pudo agendar. El horario podría estar ocupado.";
      await Swal.fire({ icon: "error", title: "No se pudo agendar", text: msg });
    }
  }

  /* ------------------ Render ------------------ */
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(getDashboardRoute())}>
            ← Volver
          </Button>
          <h1 className="text-2xl font-bold text-primary">Agendar Cita</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ====== Filtros ====== */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarGlyph className="h-5 w-5" />
                  Selección
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Campo temporal para Doctor ID mientras no exista buscador/listado */}
                <div className="space-y-2">
                  <Label htmlFor="doctorId">ID del Médico</Label>
                  <Input
                    id="doctorId"
                    placeholder="Ej: 5"
                    inputMode="numeric"
                    value={doctorId}
                    onChange={(e) => {
                      const v = e.target.value.trim();
                      setDoctorId(v === "" ? "" : Number(v));
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    (Mientras no exista un listado/buscador real, ingresa el ID del médico. Ej: 5)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Fecha</Label>
                  <Input
                    id="date"
                    type="date"
                    value={dateISO}
                    onChange={(e) => setDateISO(e.target.value)}
                    disabled={doctorId === ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tipo de Consulta</Label>
                  <Select value={apptType} onValueChange={(v: ApptType) => setApptType(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de consulta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="videollamada">Videollamada</SelectItem>
                      <SelectItem value="presencial">Presencial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-xs text-muted-foreground">
                  El médico debe publicar disponibilidad para que aparezcan horarios.
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ====== Lista de horarios ====== */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Horarios disponibles</h2>
              <Badge variant="secondary">
                {slotsLoading || isRefetching
                  ? "Cargando…"
                  : Array.isArray(slots)
                  ? `${slots.length} horarios`
                  : "0 horarios"}
              </Badge>
            </div>

            {!canQuery ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  Ingresa un <b>ID de médico</b> y selecciona una <b>fecha</b> para ver disponibilidad.
                </CardContent>
              </Card>
            ) : slotsLoading || isRefetching ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  Consultando disponibilidad…
                </CardContent>
              </Card>
            ) : !slots || slots.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No hay horarios para esta fecha.
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {slots.map((s: { id: number; startAt: string; status: "FREE" | "BOOKED" }) => {
                  const disabled = s.status !== "FREE" || createAppt.isPending;
                  return (
                    <Card key={s.id} className="hover:shadow-sm">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          <span className="text-sm">
                            {new Date(s.startAt).toLocaleDateString()}
                          </span>
                          <Clock className="h-4 w-4 ml-2" />
                          <span className="font-medium">{hhmm(s.startAt)}</span>
                        </div>
                        <Button
                          variant={disabled ? "outline" : "default"}
                          size="sm"
                          onClick={() => handleBook(s.id)}
                          disabled={disabled}
                          title={s.status === "BOOKED" ? "Ya reservado" : "Reservar"}
                        >
                          {s.status === "BOOKED" ? "Ocupado" : "Reservar"}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
