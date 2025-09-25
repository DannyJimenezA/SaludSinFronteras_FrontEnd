import { api } from "../lib/api";
import type { ApiList } from "../types/common";
import type { User } from "../types/users";

// TODO: CAMBIA ESTE PATH CUANDO TENGAS EL REAL EN NEST:
// p.ej. "/api/users" o "/users" o lo que exponga tu backend.
const USERS_PATH = "/api/users";

export async function listUsers(q?: string, page = 1, pageSize = 20) {
  const { data } = await api.get<ApiList<User>>(USERS_PATH, {
    params: { q, page, pageSize },
  });
  return data;
}

export async function getUser(id: number) {
  const { data } = await api.get<User>(`${USERS_PATH}/${id}`);
  return data;
}

export async function createUser(payload: Partial<User>) {
  const { data } = await api.post<User>(USERS_PATH, payload);
  return data;
}

export async function updateUser(id: number, payload: Partial<User>) {
  const { data } = await api.patch<User>(`${USERS_PATH}/${id}`, payload);
  return data;
}

export async function deleteUser(id: number) {
  await api.delete(`${USERS_PATH}/${id}`);
}
