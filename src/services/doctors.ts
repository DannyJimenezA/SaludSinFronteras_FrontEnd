/**
 * services/doctors.ts
 * Gestión de perfiles de doctores
 *
 * Endpoints:
 *   GET   /doctors/me/profile         → Obtener perfil del doctor logueado
 *   PATCH /doctors/me/profile         → Actualizar perfil del doctor
 */

import { api } from "../lib/api";

// ========== TIPOS ==========

/** Perfil del doctor desde la API */
export interface DoctorProfileApi {
  UserId: number | string;
  FullName?: string;
  Specialty?: string | null;
  LicenseNumber?: string | null;
  YearsOfExperience?: number | null;
  Bio?: string | null;
  Education?: string | null;
  Languages?: string[] | null;
  ConsultationFee?: number | null;
  Rating?: number | null;
  IsVerified?: boolean;
  CreatedAt?: string;
  UpdatedAt?: string;
  // Agrega más campos según tu backend
}

/** Payload para actualizar perfil */
export interface UpdateDoctorProfilePayload {
  FullName?: string;
  Specialty?: string;
  LicenseNumber?: string;
  YearsOfExperience?: number;
  Bio?: string;
  Education?: string;
  Languages?: string[];
  ConsultationFee?: number;
}

/** Búsqueda de doctores */
export interface DoctorsSearch {
  search?: string;
  specialtyId?: string;
  countryId?: string;
  page?: number;
  perPage?: number;
}

export interface DoctorListItem {
  id: number | string;
  name: string;
  specialty: string;
  rating?: number;
  location?: string;
  languages?: string[];
  consultationFee?: number;
  isVerified?: boolean;
}

// ========== FUNCIONES API ==========

/**
 * Obtener perfil del doctor logueado
 * GET /doctors/me/profile
 */
export async function getMyDoctorProfile(): Promise<DoctorProfileApi> {
  try {
    const { data } = await api.get<DoctorProfileApi>("/doctors/me/profile");
    return data;
  } catch (err: any) {
    console.error("[DOCTORS] Error obteniendo perfil:", err);
    throw new Error(
      err?.response?.data?.message || "Error al obtener perfil del doctor"
    );
  }
}

/**
 * Actualizar perfil del doctor logueado
 * PATCH /doctors/me/profile
 */
export async function updateMyDoctorProfile(
  payload: UpdateDoctorProfilePayload
): Promise<DoctorProfileApi> {
  try {
    const { data } = await api.patch<DoctorProfileApi>(
      "/doctors/me/profile",
      payload
    );
    return data;
  } catch (err: any) {
    console.error("[DOCTORS] Error actualizando perfil:", err);
    throw new Error(
      err?.response?.data?.message || "Error al actualizar perfil"
    );
  }
}

/**
 * Listar doctores (para búsqueda de pacientes)
 * TODO: Implementar cuando exista el endpoint GET /doctors
 */
export async function listDoctors(params: DoctorsSearch): Promise<DoctorListItem[]> {
  // Placeholder - implementar cuando exista el endpoint
  console.warn("[DOCTORS] Endpoint GET /doctors no implementado aún");
  return [];
}
