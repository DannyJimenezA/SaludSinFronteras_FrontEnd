// src/services/auth.ts
import { api, setToken, clearToken } from "../lib/api";

/** ===== Tipos ===== */
export interface LoginPayload {
  email: string;
  password: string;
}

export type LoginResponse =
  | { access_token: string; refresh_token?: string }
  | { accessToken: string; refreshToken?: string }
  | { token: string };

export interface RegisterPatientPayload {
  email: string;
  password: string;
  fullName: string;
}
export type RegisterDoctorPayload = RegisterPatientPayload;

export interface RegisterResponse {
  id?: string | number;
  access_token?: string;
  refresh_token?: string;
  accessToken?: string;
  refreshToken?: string;
  token?: string;
}

/** ===== Constantes ===== */
const AUTH_LOGIN_PATH = "/auth/login";
const AUTH_REGISTER_PATH = "/auth/register";
const AUTH_REFRESH_PATH = "/auth/refresh";
const AUTH_FORGOT_PASSWORD_PATH = "/auth/forgot-password";

/** ===== Utils ===== */
function normalizeTokens(data: any): { access?: string; refresh?: string } {
  const access =
    data?.access_token ??
    data?.accessToken ??
    data?.token ??
    null;

  const refresh =
    data?.refresh_token ??
    data?.refreshToken ??
    null;

  return { access: access ?? undefined, refresh: refresh ?? undefined };
}

/** ===== LOGIN =====
 * Backend espera PascalCase: { Email, Password }
 */
export async function login({ email, password }: LoginPayload): Promise<string> {
  const payload = { Email: email, Password: password };

  if (import.meta.env.DEV) {
    console.debug("[AUTH] login →", { Email: email, Password: "***" });
  }

  try {
    const { data } = await api.post<LoginResponse>(AUTH_LOGIN_PATH, payload);
    const { access } = normalizeTokens(data);
    if (!access) throw new Error("No se recibió token de acceso");
    setToken(access);
    return access;
  } catch (err: any) {
    const status = err?.response?.status;
    if (status === 404) {
      throw new Error(
        "Endpoint no encontrado (404). Revisa VITE_API_URL / VITE_API_PREFIX y que el backend exponga /auth/login."
      );
    }
    const msg =
      err?.response?.data?.message ??
      err?.response?.data?.error ??
      err?.message ??
      "No se pudo iniciar sesión";
    throw new Error(String(msg));
  }
}

/** ===== LOGOUT ===== */
export function logout(): void {
  clearToken();
}

/** ===== REGISTER paciente =====
 * Backend espera: { Email, Password, FullName } (PascalCase)
 */
export async function registerPatient(
  payload: RegisterPatientPayload
): Promise<RegisterResponse> {
  const dto = {
    Email: payload.email,
    Password: payload.password,
    FullName: payload.fullName,
  };

  if (import.meta.env.DEV) {
    console.debug("[AUTH] registerPatient →", {
      Email: payload.email,
      Password: "***",
      FullName: payload.fullName,
    });
  }

  const { data } = await api.post<RegisterResponse>(AUTH_REGISTER_PATH, dto);

  const { access } = normalizeTokens(data);
  if (access) setToken(access);

  return data;
}

/** ===== REGISTER médico =====
 * Igual que paciente, pero enviando Role: "DOCTOR"
 */
export async function registerDoctor(
  payload: RegisterDoctorPayload
): Promise<RegisterResponse> {
  const dto = {
    Email: payload.email,
    Password: payload.password,
    FullName: payload.fullName,
    Role: "DOCTOR", // <- clave para crear la cuenta como médico
  };

  if (import.meta.env.DEV) {
    console.debug("[AUTH] registerDoctor →", {
      Email: payload.email,
      Password: "***",
      FullName: payload.fullName,
      Role: "DOCTOR",
    });
  }

  const { data } = await api.post<RegisterResponse>(AUTH_REGISTER_PATH, dto);

  const { access } = normalizeTokens(data);
  if (access) setToken(access);

  return data;
}

/** ===== REFRESH opcional ===== */
export async function refreshToken(): Promise<string> {
  const { data } = await api.post<LoginResponse>(AUTH_REFRESH_PATH, {});
  const { access } = normalizeTokens(data);
  if (!access) throw new Error("No se recibió un token nuevo en refresh");
  setToken(access);
  return access;
}

/** ===== FORGOT PASSWORD =====
 * Solicitar enlace de recuperación de contraseña
 * Backend espera: { Email } (PascalCase)
 */
export async function requestPasswordReset(email: string): Promise<void> {
  const payload = { Email: email };

  if (import.meta.env.DEV) {
    console.debug("[AUTH] requestPasswordReset →", { Email: email });
  }

  try {
    await api.post(AUTH_FORGOT_PASSWORD_PATH, payload);
  } catch (err: any) {
    const status = err?.response?.status;

    // Si el endpoint no existe (404), simular éxito para no revelar si el email existe
    if (status === 404) {
      console.warn("[AUTH] Endpoint /auth/forgot-password no encontrado. Simulando éxito.");
      return;
    }

    const msg =
      err?.response?.data?.message ??
      err?.response?.data?.error ??
      err?.message ??
      "No se pudo enviar el correo de recuperación";

    throw new Error(String(msg));
  }
}
