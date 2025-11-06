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

export interface Specialty {
  Id: number | string;
  Name: string;
}

export interface DoctorProfileApi {
  UserId: number | string;
  FullName: string;
  Specialty?: string | null;
  Bio?: string | null;
  LicenseNumber?: string | null;
  LicenseCountryId?: number | null;
  YearsExperience?: number | null;
  VerificationStatus?: string | null;
  Specialties?: Specialty[];
}

export interface DoctorProfile {
  userId: number | string;
  fullName: string;
  specialty?: string | null;
  bio?: string | null;
  licenseNumber?: string | null;
  licenseCountryId?: number | null;
  yearsExperience?: number | null;
  verificationStatus?: string | null;
  specialties?: Specialty[];
}

export interface UpdateDoctorProfilePayload {
  licenseNumber: string; // Requerido por backend
  licenseCountryId: number; // Requerido por backend
  yearsExperience?: number;
  bio?: string;
}

// Helper para mapear de PascalCase a camelCase
function mapDoctorProfile(data: DoctorProfileApi): DoctorProfile {
  return {
    userId: data.UserId,
    fullName: data.FullName,
    specialty: data.Specialty,
    bio: data.Bio,
    licenseNumber: data.LicenseNumber,
    licenseCountryId: data.LicenseCountryId,
    yearsExperience: data.YearsExperience,
    verificationStatus: data.VerificationStatus,
    specialties: data.Specialties,
  };
}

// Listado (ajústalo a tu endpoint real o deja vacío si aún no existe)
export async function listDoctors(params: DoctorsSearch): Promise<DoctorListItem[]> {
  // Ejemplo si tienes /doctors:
  // const { data } = await api.get("/doctors", { params });
  // return data;

  return []; // placeholder si aún no hay backend
}

// Perfil del doctor logueado
export async function getMyDoctorProfile(): Promise<DoctorProfile> {
  const { data } = await api.get<DoctorProfileApi>("/doctors/me/profile");
  return mapDoctorProfile(data);
}

// Actualizar perfil profesional del doctor
export async function updateMyDoctorProfile(payload: UpdateDoctorProfilePayload): Promise<DoctorProfile> {
  const dto: Record<string, any> = {
    LicenseNumber: payload.licenseNumber,
    LicenseCountryId: payload.licenseCountryId,
  };

  if (payload.yearsExperience !== undefined) dto.YearsExperience = payload.yearsExperience;
  if (payload.bio !== undefined) dto.Bio = payload.bio;

  const { data } = await api.patch<DoctorProfileApi>("/doctors/me/profile", dto);
  return mapDoctorProfile(data);
}

// Asignar especialidades al doctor
export async function assignMySpecialties(specialtyIds: string[]): Promise<void> {
  await api.post("/doctors/me/specialties", {
    SpecialtyIds: specialtyIds.map(id => Number(id)),
  });
}

// Obtener todas las especialidades disponibles
export async function getAllSpecialties(): Promise<Specialty[]> {
  const { data } = await api.get("/specialties");
  return data;
}
