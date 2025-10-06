// src/services/users.ts
import { api } from "../lib/api";
import type { User } from "../types/user";

/** Si en algún momento activas app.setGlobalPrefix('api'), NO cambies esto:
 * el prefix lo añade api.baseURL (VITE_API_PREFIX), deja el path tal cual. */
const USERS_ME_PATH = "/users/me";

/** Mapea el usuario de la API (puede venir en PascalCase) a nuestro modelo User (camelCase). */
function mapUserFromApi(u: any): User {
  // id puede venir como bigint serializado (string) o number
  const id =
    u?.id ?? u?.Id ?? u?.userId ?? u?.UserId ?? "";
  const normId = typeof id === "bigint" ? id.toString() : String(id);

  return {
    id: normId as User["id"],

    role: u?.role ?? u?.Role,
    email: u?.email ?? u?.Email,

    phone: u?.phone ?? u?.Phone ?? undefined,
    phonePrefix: u?.phonePrefix ?? u?.PhonePrefix ?? undefined,

    fullName: u?.fullName ?? u?.FullName ?? undefined,
    firstName1: u?.firstName1 ?? u?.FirstName1 ?? undefined,
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
  const { data } = await api.get(USERS_ME_PATH);
  if (!data) throw new Error("Respuesta vacía de /users/me");
  return mapUserFromApi(data);
}

/** Acepta camelCase y lo mapea a PascalCase que espera tu backend (FullName, Phone). */
export async function updateMe(payload: { fullName?: string; phone?: string }): Promise<User> {
  const dto: Record<string, string> = {};
  if (payload.fullName !== undefined) dto.FullName = payload.fullName;
  if (payload.phone !== undefined) dto.Phone = payload.phone;

  const { data } = await api.patch(USERS_ME_PATH, dto);
  if (!data) throw new Error("Respuesta vacía de PATCH /users/me");
  return mapUserFromApi(data);
}
