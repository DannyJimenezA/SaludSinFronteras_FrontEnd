// src/services/doctors.ts
import { api } from "../lib/api";

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
  priceCents?: number;
}

export interface DoctorProfileApi {
  UserId: number | string;
  FullName: string;
  Specialty?: string | null;
  About?: string | null;
  // agrega los campos que tengas
}

// Listado (ajústalo a tu endpoint real o deja vacío si aún no existe)
export async function listDoctors(params: DoctorsSearch): Promise<DoctorListItem[]> {
  // Ejemplo si tienes /doctors:
  // const { data } = await api.get("/doctors", { params });
  // return data;

  return []; // placeholder si aún no hay backend
}

// Perfil del doctor logueado
export async function getMyDoctorProfile(): Promise<DoctorProfileApi> {
  const { data } = await api.get<DoctorProfileApi>("/doctors/me/profile");
  return data;
}
