/**
 * services/doctors.ts
 * GET /doctors?search=&specialtyId=&countryId=
 * GET /doctors/:userId
 */
import { api } from "../lib/api";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { Id } from "../types/common";
import type { DoctorProfile } from "../types/users";
import type { Specialty, Country } from "../types/catalog";

/** Parámetros para la búsqueda de doctores */
export interface DoctorsSearch {
  search?: string;
  specialtyId?: string;
  countryId?: string;
  page?: number;
  perPage?: number;
}

/** Item para la lista (ligero y directo para tarjetas) */
export interface DoctorListItem {
  userId: Id;
  fullName: string;
  avatarUrl?: string;
  countryId?: string | null;
  specialtyNames?: string[];
  ratingAvg?: number | null;
  ratingCount?: number | null;
  profile?: Pick<DoctorProfile, "licenseNumber" | "yearsExperience" | "bio"> | null;
  specialties?: Specialty[];
}

/** Detalle del doctor (para página/sidepanel) */
export interface DoctorDetail extends DoctorListItem {
  profile?: DoctorProfile | null;
  country?: Country | null;
  languages?: string[];
}

// ⚠️ RUTAS FAKE
const R = {
  LIST: "/doctors",
  DETAIL: (userId: string) => `/doctors/${userId}`,
} as const;

/** Versión promesa (sin hooks) */
export async function listDoctors(params: DoctorsSearch = {}): Promise<DoctorListItem[]> {
  const { data } = await api.get(R.LIST, { params });
  // compat: { data: [] } ó []
  return Array.isArray(data) ? data : (data?.data ?? []);
}

export async function getDoctor(userId: string): Promise<DoctorDetail> {
  const { data } = await api.get(R.DETAIL(userId));
  return data?.data ?? data;
}

/** Hooks React Query (v5) */
export function useDoctors(params: DoctorsSearch) {
  return useQuery({
    queryKey: ["doctors", params],
    queryFn: async (): Promise<DoctorListItem[]> => {
      const { data } = await api.get(R.LIST, { params });
      return Array.isArray(data) ? data : (data?.data ?? []);
    },
    // v5: reemplaza keepPreviousData por:
    placeholderData: keepPreviousData,
  });
}

export function useDoctor(userId?: string) {
  return useQuery({
    queryKey: ["doctors", "detail", userId],
    queryFn: async (): Promise<DoctorDetail> => {
      if (!userId) throw new Error("userId requerido");
      const { data } = await api.get(R.DETAIL(userId));
      return data?.data ?? data;
    },
    enabled: Boolean(userId),
  });
}
