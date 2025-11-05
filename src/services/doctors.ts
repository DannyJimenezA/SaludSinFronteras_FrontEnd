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
  yearsExperience?: number | null;
  verificationStatus?: string | null;
  specialties?: Specialty[];
}

export interface UpdateDoctorProfilePayload {
  licenseNumber?: string;
  yearsExperience?: number;
  bio?: string;
  specialtyIds?: string[];
}

// Helper para mapear de PascalCase a camelCase
function mapDoctorProfile(data: DoctorProfileApi): DoctorProfile {
  return {
    userId: data.UserId,
    fullName: data.FullName,
    specialty: data.Specialty,
    bio: data.Bio,
    licenseNumber: data.LicenseNumber,
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
  const dto: Record<string, any> = {};

  if (payload.licenseNumber !== undefined) dto.LicenseNumber = payload.licenseNumber;
  if (payload.yearsExperience !== undefined) dto.YearsExperience = payload.yearsExperience;
  if (payload.bio !== undefined) dto.Bio = payload.bio;
  if (payload.specialtyIds !== undefined) dto.SpecialtyIds = payload.specialtyIds;

  const { data } = await api.patch<DoctorProfileApi>("/doctors/me/profile", dto);
  return mapDoctorProfile(data);
}
