import { api } from "../lib/api";
// src/services/users.ts
import type { User } from "../types/users";

/** Si tu Nest usa prefix global 'api', cambia a '/api/users/me' */
const USERS_ME_PATH = "/users/me";

/** Mapeo: la API devuelve PascalCase (FullName, Phone...). Nuestro modelo usa camelCase */
function mapUserFromApi(apiUser: any): User {
  return {
    id: (String(apiUser.id ?? apiUser.Id ?? apiUser.userId ?? apiUser.UserId ?? "") as User["id"]),
    role: apiUser.role ?? apiUser.Role,
    email: apiUser.email ?? apiUser.Email,
    phone: apiUser.phone ?? apiUser.Phone ?? undefined,
    phonePrefix: apiUser.phonePrefix ?? apiUser.PhonePrefix ?? undefined,
    fullName: apiUser.fullName ?? apiUser.FullName ?? undefined,
    firstName1: apiUser.firstName1 ?? apiUser.FirstName1 ?? undefined,
    lastName1: apiUser.lastName1 ?? apiUser.LastName1 ?? undefined,
    lastName2: apiUser.lastName2 ?? apiUser.LastName2 ?? undefined,
    dateOfBirth: apiUser.dateOfBirth ?? apiUser.DateOfBirth ?? undefined,
    gender: apiUser.gender ?? apiUser.Gender ?? undefined,
    primaryLanguage: apiUser.primaryLanguage ?? apiUser.PrimaryLanguage ?? undefined,
    nativeLanguage: apiUser.nativeLanguage ?? apiUser.NativeLanguage ?? null,
    timezone: apiUser.timezone ?? apiUser.Timezone ?? undefined,
    status: apiUser.status ?? apiUser.Status,
    countryId: apiUser.countryId ?? apiUser.CountryId ?? undefined,
    nationalityCountryId: apiUser.nationalityCountryId ?? apiUser.NationalityCountryId ?? null,
    residenceCountryId: apiUser.residenceCountryId ?? apiUser.ResidenceCountryId ?? null,
    isActive: Boolean(apiUser.isActive ?? apiUser.IsActive ?? true),
    createdAt: apiUser.createdAt ?? apiUser.CreatedAt,
    updatedAt: apiUser.updatedAt ?? apiUser.UpdatedAt,
    avatarFileId: apiUser.avatarFileId ?? apiUser.AvatarFileId ?? undefined,
  };
}

/** ------- Perfil propio (endpoints reales) ------- */
export async function getMe(): Promise<User> {
  const { data } = await api.get(USERS_ME_PATH);
  return mapUserFromApi(data);
}

/** dto solo acepta FullName y/o Phone (PascalCase), hacemos el mapeo desde camelCase */
export async function updateMe(payload: { fullName?: string; phone?: string }): Promise<User> {
  const dto: any = {};
  if (payload.fullName !== undefined) dto.FullName = payload.fullName;
  if (payload.phone !== undefined) dto.Phone = payload.phone;
  const { data } = await api.patch(USERS_ME_PATH, dto);
  return mapUserFromApi(data);
}

/** ------- CRUD admin (PLACEHOLDER / TODO) -------
 * Mantengo tu API por si luego creas endpoints admin como:
 * GET /users, GET /users/:id, POST /users, PATCH /users/:id, DELETE /users/:id
 * De momento, comentar para evitar 404.
 */

// const USERS_ADMIN_PATH = "/users";
// export async function listUsers(q?: string, page = 1, pageSize = 20) { /* ... */ }
// export async function getUser(id: string | number) { /* ... */ }
// export async function createUser(payload: Partial<User>) { /* ... */ }
// export async function updateUser(id: string | number, payload: Partial<User>) { /* ... */ }
// export async function deleteUser(id: string | number) { /* ... */ }
