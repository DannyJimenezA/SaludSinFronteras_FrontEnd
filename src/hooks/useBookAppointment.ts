/**
 * hooks/useBookAppointment.ts
 * Orquesta el flujo: doctores → disponibilidad (slots) → crear cita
 * Compatible con React Query v5. Usa los services ya creados (FAKE routes).
 *
 * Dirige estado y acciones típicas del agendador:
 *  - búsqueda/filtrado de doctores (search/specialty/country + paginación)
 *  - rango de fechas para consultar slots
 *  - selección de doctor y de slot
 *  - creación de cita (POST /appointments)
 *
 * Cómo usar (ejemplo):
 * const hook = useBookAppointment({ patientUserId: me.id, defaultDurationMin: 30, defaultModality: "VIDEO" });
 * // hook.doctors, hook.slots, hook.actions.selectDoctor(...), hook.actions.setRange(...), hook.actions.book(...)
 */

import { useMemo, useState } from "react";
import { useDoctors, type DoctorsSearch, type DoctorListItem } from "../services/doctors";
import { useAvailability, type AvailabilityParams } from "../services/availability";
import { useCreateAppointment, type CreateAppointmentPayload } from "../services/appointments";
import type { AvailabilitySlot } from "../types/appointments";
import type { Id } from "../types/common";

export type Modality = "VIDEO" | "IN_PERSON" | "PHONE";

export interface UseBookAppointmentOptions {
  patientUserId: Id;
  initialSearch?: string;
  initialSpecialtyId?: string;
  initialCountryId?: string;
  defaultDurationMin?: number; // si tu slot no especifica duración, usamos este valor
  defaultModality?: Modality;
  initialFrom?: string; // ISO UTC
  initialTo?: string;   // ISO UTC
}

export interface UseBookAppointmentState {
  // Filtros de doctores
  search: string;
  specialtyId?: string;
  countryId?: string;
  page: number;
  perPage: number;

  // Selecciones
  selectedDoctorId?: Id;
  selectedSlot?: AvailabilitySlot;

  // Rango para slots
  from?: string;
  to?: string;
  tz?: string;
}

export function useBookAppointment(opts: UseBookAppointmentOptions) {
  const {
    patientUserId,
    initialSearch = "",
    initialSpecialtyId,
    initialCountryId,
    defaultDurationMin = 30,
    defaultModality = "VIDEO",
    initialFrom,
    initialTo,
  } = opts;

  // —————————————————————————————————————
  // Estado local
  // —————————————————————————————————————
  const [search, setSearch] = useState(initialSearch);
  const [specialtyId, setSpecialtyId] = useState<string | undefined>(initialSpecialtyId);
  const [countryId, setCountryId] = useState<string | undefined>(initialCountryId);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);

  const [selectedDoctorId, setSelectedDoctorId] = useState<Id | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | undefined>(undefined);

  const [from, setFrom] = useState<string | undefined>(initialFrom);
  const [to, setTo] = useState<string | undefined>(initialTo);
  const [tz, setTz] = useState<string | undefined>(Intl.DateTimeFormat().resolvedOptions().timeZone);

  // —————————————————————————————————————
  // Queries
  // —————————————————————————————————————
  const doctorsParams: DoctorsSearch = useMemo(() => ({
    search, specialtyId, countryId, page, perPage
  }), [search, specialtyId, countryId, page, perPage]);

  const doctorsQuery = useDoctors(doctorsParams);

  const availabilityParams: AvailabilityParams | undefined = useMemo(() => {
    if (!from || !to) return undefined;
    return { from, to, tz };
  }, [from, to, tz]);

  const availabilityQuery = useAvailability(selectedDoctorId, availabilityParams);

  // —————————————————————————————————————
  // Mutation (crear cita)
  // —————————————————————————————————————
  const createMutation = useCreateAppointment();

  // —————————————————————————————————————
  // Helpers
  // —————————————————————————————————————
  function selectDoctor(userId?: Id) {
    setSelectedDoctorId(userId);
    setSelectedSlot(undefined); // al cambiar doctor, limpiar slot
    // Opcional: resetear paginación de slots si la tuvieras
  }

  function setRange(range: { from: string; to: string; tz?: string }) {
    setFrom(range.from);
    setTo(range.to);
    if (range.tz) setTz(range.tz);
  }

  function pickSlot(slot?: AvailabilitySlot) {
    setSelectedSlot(slot);
  }

  async function book(payload?: {
    reason?: string;
    notes?: string;
    modality?: Modality;
    durationMin?: number; // si quieres override
    slotId?: string;      // si tu backend lo exige
  }) {
    if (!selectedDoctorId) throw new Error("Debes seleccionar un doctor");
    if (!selectedSlot) throw new Error("Debes seleccionar un horario (slot)");

    // Determinar duración: del slot o default
    const start = (selectedSlot as any).startAt || (selectedSlot as any).start || selectedSlot?.startAt;
    const end = (selectedSlot as any).endAt || (selectedSlot as any).end || selectedSlot?.endAt;
    if (!start) throw new Error("El slot no tiene 'startAt'");
    let durationMin = payload?.durationMin ?? defaultDurationMin;
    if (start && end) {
      const ms = Math.max(0, new Date(end).getTime() - new Date(start).getTime());
      const fromSlotMin = Math.round(ms / 60000);
      if (fromSlotMin > 0) durationMin = fromSlotMin;
    }

    const body: CreateAppointmentPayload = {
      patientUserId,
      doctorUserId: selectedDoctorId,
      scheduledAt: start,
      durationMin,
      modality: payload?.modality ?? defaultModality,
      reason: payload?.reason,
      notes: payload?.notes,
      slotId: payload?.slotId, // opcional
    };

    const created = await createMutation.mutateAsync(body);
    return created;
  }

  // —————————————————————————————————————
  // Resultado
  // —————————————————————————————————————
  return {
    // datos
    doctors: doctorsQuery.data as DoctorListItem[] | undefined,
    doctorsLoading: doctorsQuery.isLoading,
    doctorsError: doctorsQuery.error as unknown,

    slots: availabilityQuery.data as AvailabilitySlot[] | undefined,
    slotsLoading: availabilityQuery.isLoading,
    slotsError: availabilityQuery.error as unknown,

    // selección actual
    selectedDoctorId,
    selectedSlot,

    // filtros/params actuales
    state: {
      search, specialtyId, countryId, page, perPage, from, to, tz,
    } as UseBookAppointmentState,

    // acciones
    actions: {
      setSearch, setSpecialtyId, setCountryId, setPage, setPerPage,
      selectDoctor, setRange, pickSlot,
      book,
    },

    // mutation state
    booking: {
      isPending: createMutation.isPending,
      error: createMutation.error as unknown,
    },
  };
}
