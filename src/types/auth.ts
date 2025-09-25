import { api } from "../lib/api";

// TODO: CAMBIA A LO QUE USES: "/auth/login", "/api/auth/login", etc.
const AUTH_PATH = "/auth";

export type LoginDto = { email: string; password: string };
export type AuthResult = { token?: string; userId: number; role: string };

export async function login(dto: LoginDto) {
  const { data } = await api.post<AuthResult>(`${AUTH_PATH}/login`, dto);
  return data;
}
