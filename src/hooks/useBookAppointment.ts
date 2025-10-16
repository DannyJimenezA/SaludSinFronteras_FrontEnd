// src/hooks/useBookAppointment.ts
import { useMemo, useState } from "react";
import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query"; // <-- importa el helper


import {
  listDoctors,
  type DoctorsSearch,
  type DoctorListItem,
} from "../services/doctors";

import {
  listAvailability,
  type AvailabilityParams,
} from "../services/availability";

import {
  createAppointment,
  type CreateAppointmentPayload,
} from "../services/appointments";

import type { AvailabilitySlot } from "../types/appointments";
import type { Id } from "../types/common";

export type Modality = "VIDEO" | "IN_PERSON" | "PHONE";

export interface UseBookAppointmentOptions {
  patientUserId: Id;
  initialSearch?: string;
  initialSpecialtyId?: string;
  initialCountryId?: string;
  defaultDurationMin?: number;
  defaultModality?: Modality;
  initialFrom?: string; // ISO UTC
  initialTo?: string;   // ISO UTC
}

export interface UseBookAppointmentState {
  search: string;
  specialtyId?: string;
  countryId?: string;
  page: number;
  perPage: number;
  selectedDoctorId?: Id;
  selectedSlot?: AvailabilitySlot;
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

  // Estado local
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

  // Params doctores
  const doctorsParams: DoctorsSearch = useMemo(
    () => ({ search, specialtyId, countryId, page, perPage }),
    [search, specialtyId, countryId, page, perPage]
  );

  const doctorsQuery = useQuery({
  queryKey: ["doctors", doctorsParams],
  queryFn: () => listDoctors(doctorsParams),
  placeholderData: keepPreviousData,  // <-- en v5 se usa así
  staleTime: 30_000,
});

  // Params disponibilidad
  const availabilityParams: AvailabilityParams | undefined = useMemo(() => {
    if (!from || !to) return undefined;
    return { from, to, tz };
  }, [from, to, tz]);

  const availabilityQuery = useQuery({
    enabled: !!selectedDoctorId && !!availabilityParams,
    queryKey: ["availability", selectedDoctorId, availabilityParams],
    queryFn: () => listAvailability(selectedDoctorId!, availabilityParams!),
    staleTime: 10_000,
  });

  // Crear cita
  const createMutation = useMutation({
    mutationFn: (body: CreateAppointmentPayload) => createAppointment(body),
  });

  // Helpers
  function selectDoctor(userId?: Id) {
    setSelectedDoctorId(userId);
    setSelectedSlot(undefined);
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
    durationMin?: number;
    slotId?: string;
  }) {
    if (!selectedDoctorId) throw new Error("Debes seleccionar un doctor");
    if (!selectedSlot) throw new Error("Debes seleccionar un horario (slot)");

    const start =
      (selectedSlot as any).startAt ||
      (selectedSlot as any).start ||
      (selectedSlot as any).StartAt ||
      (selectedSlot as any).Start ||
      (selectedSlot as any).start_at;

    const end =
      (selectedSlot as any).endAt ||
      (selectedSlot as any).end ||
      (selectedSlot as any).EndAt ||
      (selectedSlot as any).End ||
      (selectedSlot as any).end_at;

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
      slotId: payload?.slotId,
    };

    const created = await createMutation.mutateAsync(body);
    return created;
  }

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
      search,
      specialtyId,
      countryId,
      page,
      perPage,
      from,
      to,
      tz,
    } as UseBookAppointmentState,

    // acciones
    actions: {
      setSearch,
      setSpecialtyId,
      setCountryId,
      setPage,
      setPerPage,
      selectDoctor,
      setRange,
      pickSlot,
      book,
    },

    // estado mutation
    booking: {
      isPending: createMutation.isPending,
      error: createMutation.error as unknown,
    },
  };
}
