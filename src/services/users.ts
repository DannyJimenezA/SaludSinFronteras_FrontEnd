// src/services/users.ts
import { api } from "../lib/api";
import type { User, Gender } from "../types/user";

/** Si en algún momento activas app.setGlobalPrefix('api'), NO cambies esto:
 * el prefix lo añade api.baseURL (VITE_API_PREFIX), deja el path tal cual. */
const USERS_ME_PATH = "/users/me";

/** Mapea el usuario de la API (puede venir en PascalCase) a nuestro modelo User (camelCase). */
function mapUserFromApi(u: any): User {
  // id puede venir como bigint serializado (string) o number
  const id = u?.id ?? u?.Id ?? u?.userId ?? u?.UserId ?? "";
  const normId = typeof id === "bigint" ? id.toString() : String(id);

  return {
    id: normId as User["id"],

    role: u?.role ?? u?.Role,
    email: u?.email ?? u?.Email,

    phone: u?.phone ?? u?.Phone ?? undefined,
    phonePrefix: u?.phonePrefix ?? u?.PhonePrefix ?? undefined,

    fullName: u?.fullName ?? u?.FullName ?? undefined,
    firstName1: u?.firstName1 ?? u?.FirstName ?? undefined,
    lastName1: u?.lastName1 ?? u?.LastName1 ?? undefined,
    lastName2: u?.lastName2 ?? u?.LastName2 ?? undefined,

    dateOfBirth: u?.dateOfBirth ?? u?.DateOfBirth ?? undefined,
    gender: u?.gender ?? u?.Gender ?? undefined,

    primaryLanguage: u?.primaryLanguage ?? u?.PrimaryLanguage ?? undefined,
    nativeLanguage: u?.nativeLanguage ?? u?.NativeLanguage ?? null,

    timezone: u?.timezone ?? u?.Timezone ?? undefined,

    status: u?.status ?? u?.Status,
    countryId: u?.countryId ?? u?.CountryId ?? undefined,
    nationalityCountryId: u?.nationalityCountryId ?? u?.NationalityCountryId ?? null,
    residenceCountryId: u?.residenceCountryId ?? u?.ResidenceCountryId ?? null,

    isActive: Boolean(u?.isActive ?? u?.IsActive ?? true),

    createdAt: u?.createdAt ?? u?.CreatedAt,
    updatedAt: u?.updatedAt ?? u?.UpdatedAt,

    avatarFileId: u?.avatarFileId ?? u?.AvatarFileId ?? undefined,
  };
}

/** -------- Perfil propio -------- */
export async function getMe(): Promise<User> {
  const { data } = await api.get<any>(USERS_ME_PATH);
  if (!data) throw new Error("Respuesta vacía de /users/me");
  return mapUserFromApi(data);
}

/** Acepta camelCase y lo mapea a PascalCase que espera tu backend. */
export async function updateMe(payload: {
  firstName1?: string;
  lastName1?: string;
  lastName2?: string;
  phone?: string;
  gender?: Gender | string;
  dateOfBirth?: string;
  identification?: string;
  nationalityId?: string;
  residenceCountryId?: string;
  primaryLanguage?: string;
  timezone?: string;
}): Promise<User> {
  const dto: Record<string, any> = {};
  if (payload.firstName1 !== undefined) dto.FirstName = payload.firstName1;
  if (payload.lastName1 !== undefined) dto.LastName1 = payload.lastName1;
  if (payload.lastName2 !== undefined) dto.LastName2 = payload.lastName2;
  if (payload.phone !== undefined) dto.Phone = payload.phone;
  if (payload.gender !== undefined) dto.Gender = String(payload.gender);
  if (payload.dateOfBirth !== undefined) dto.DateOfBirth = payload.dateOfBirth;
  if (payload.identification !== undefined) dto.Identification = payload.identification;
  if (payload.nationalityId !== undefined) dto.NationalityId = payload.nationalityId;
  if (payload.residenceCountryId !== undefined) dto.ResidenceCountryId = payload.residenceCountryId;
  if (payload.primaryLanguage !== undefined) dto.PrimaryLanguage = payload.primaryLanguage;
  if (payload.timezone !== undefined) dto.Timezone = payload.timezone;

  const { data } = await api.patch<any>(USERS_ME_PATH, dto);
  if (!data) throw new Error("Respuesta vacía de PATCH /users/me");
  return mapUserFromApi(data);
}

/** Cambia la contraseña del usuario actual */
export async function changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
  const { data } = await api.post<any>("/users/change-password", {
    currentPassword,
    newPassword,
  });
  return data;
}
