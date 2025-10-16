// src/services/auth.ts
import { api, setToken, clearToken } from "../lib/api";

/** ===== Tipos ===== */
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface RegisterPayload {
  // Campos requeridos
  FirstName: string;
  LastName1: string;
  Email: string;
  Password: string;
  PasswordConfirm: string;

  // Campos opcionales
  LastName2?: string;
  Phone?: string;
  IdentificationTypeId?: number;
  Identification?: string;
  GenderId?: number;
  DateOfBirth?: string; // formato YYYY-MM-DD
  NativeLanguageId?: number;
  NationalityId?: number;
  ResidenceCountryId?: number;
  Role?: "ADMIN" | "DOCTOR" | "PATIENT";
}

export interface RegisterResponse {
  message: string;
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

/** ===== Constantes ===== */
const AUTH_LOGIN_PATH = "/auth/login";
const AUTH_REGISTER_PATH = "/auth/register";
const AUTH_REFRESH_PATH = "/auth/refresh";
const AUTH_FORGOT_PASSWORD_PATH = "/auth/forgot-password";
const AUTH_VERIFY_EMAIL_PATH = "/auth/verify-email";
const AUTH_RESET_PASSWORD_PATH = "/auth/reset-password";

/** ===== LOGIN =====
 * Backend espera: { Email, Password }
 * Respuesta: { access_token, refresh_token }
 */
export async function login({ email, password }: LoginPayload): Promise<string> {
  const payload = { Email: email, Password: password };

  if (import.meta.env.DEV) {
    console.debug("[AUTH] login →", { Email: email, Password: "***" });
  }

  try {
    const { data } = await api.post<LoginResponse>(AUTH_LOGIN_PATH, payload);

    if (!data.access_token) {
      throw new Error("No se recibió token de acceso");
    }

    // Guardar ambos tokens
    setToken(data.access_token);
    if (data.refresh_token) {
      localStorage.setItem("refresh_token", data.refresh_token);
    }

    return data.access_token;
  } catch (err: any) {
    const status = err?.response?.status;

    if (status === 404) {
      throw new Error(
        "Endpoint no encontrado (404). Verifica que el backend exponga /auth/login."
      );
    }

    if (status === 401) {
      const msg = err?.response?.data?.message;
      if (msg?.includes("no activada") || msg?.includes("not activated")) {
        throw new Error("Cuenta no activada. Por favor verifica tu correo electrónico.");
      }
      throw new Error("Credenciales inválidas");
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
  localStorage.removeItem("refresh_token");
}

/** ===== REGISTER =====
 * Backend espera: RegisterPayload con todos los campos en PascalCase
 * Respuesta: { message, email }
 * NO devuelve tokens, el usuario debe activar su cuenta primero
 */
export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  if (import.meta.env.DEV) {
    console.debug("[AUTH] register →", {
      ...payload,
      Password: "***",
      PasswordConfirm: "***",
    });
  }

  try {
    const { data } = await api.post<RegisterResponse>(AUTH_REGISTER_PATH, payload);
    return data;
  } catch (err: any) {
    const status = err?.response?.status;

    if (status === 400) {
      const msg = err?.response?.data?.message;
      // Si es un array de mensajes, unirlos
      if (Array.isArray(msg)) {
        throw new Error(msg.join(". "));
      }
      throw new Error(msg || "Datos de registro inválidos");
    }

    const msg =
      err?.response?.data?.message ??
      err?.response?.data?.error ??
      err?.message ??
      "No se pudo registrar el usuario";

    throw new Error(String(msg));
  }
}

/** ===== HELPER: Registrar Paciente =====
 * Convierte formato simple a RegisterPayload completo
 */
export async function registerPatient(params: {
  firstName: string;
  lastName1: string;
  lastName2?: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<RegisterResponse> {
  return register({
    FirstName: params.firstName,
    LastName1: params.lastName1,
    LastName2: params.lastName2,
    Email: params.email,
    Password: params.password,
    PasswordConfirm: params.password,
    Phone: params.phone,
    Role: "PATIENT",
  });
}

/** ===== HELPER: Registrar Doctor =====
 * Convierte formato simple a RegisterPayload completo con Role: DOCTOR
 */
export async function registerDoctor(params: {
  firstName: string;
  lastName1: string;
  lastName2?: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<RegisterResponse> {
  return register({
    FirstName: params.firstName,
    LastName1: params.lastName1,
    LastName2: params.lastName2,
    Email: params.email,
    Password: params.password,
    PasswordConfirm: params.password,
    Phone: params.phone,
    Role: "DOCTOR",
  });
}

/** ===== VERIFY EMAIL =====
 * Backend espera: POST /auth/verify-email con body { token }
 * Respuesta: { message }
 */
export async function verifyEmail(token: string): Promise<void> {
  if (import.meta.env.DEV) {
    console.debug("[AUTH] verifyEmail →", { token: token.substring(0, 10) + "..." });
  }

  try {
    // Según la API, enviamos el token en el body
    await api.post(AUTH_VERIFY_EMAIL_PATH, { token });
  } catch (err: any) {
    const status = err?.response?.status;

    if (status === 404) {
      throw new Error(
        "Endpoint no encontrado (404). Verifica que el backend exponga /auth/verify-email."
      );
    }

    if (status === 400) {
      throw new Error("Token de verificación inválido o expirado");
    }

    const msg =
      err?.response?.data?.message ??
      err?.response?.data?.error ??
      err?.message ??
      "No se pudo verificar el email";

    throw new Error(String(msg));
  }
}

/** ===== FORGOT PASSWORD =====
 * Backend espera: { Email }
 * Respuesta: { message } (siempre exitoso por seguridad)
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

    // Por seguridad, no lanzar error real, simular éxito
    console.warn("[AUTH] Error en forgot-password, pero simulando éxito por seguridad:", err);
  }
}

/** ===== RESET PASSWORD =====
 * Backend espera: { token, newPassword }
 * Respuesta: { message }
 */
export async function resetPassword({ token, newPassword }: ResetPasswordPayload): Promise<void> {
  if (import.meta.env.DEV) {
    console.debug("[AUTH] resetPassword →", {
      token: token.substring(0, 10) + "...",
      newPassword: "***"
    });
  }

  try {
    await api.post(AUTH_RESET_PASSWORD_PATH, { token, newPassword });
  } catch (err: any) {
    const status = err?.response?.status;

    if (status === 404) {
      throw new Error(
        "Endpoint no encontrado (404). Verifica que el backend exponga /auth/reset-password."
      );
    }

    if (status === 400) {
      throw new Error("Token de recuperación inválido o expirado");
    }

    const msg =
      err?.response?.data?.message ??
      err?.response?.data?.error ??
      err?.message ??
      "No se pudo restablecer la contraseña";

    throw new Error(String(msg));
  }
}

/** ===== REFRESH TOKEN =====
 * Backend espera: { refresh_token }
 * Respuesta: { access_token, refresh_token }
 */
export async function refreshToken(): Promise<string> {
  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) {
    throw new Error("No hay refresh token disponible");
  }

  try {
    const { data } = await api.post<LoginResponse>(AUTH_REFRESH_PATH, {
      refresh_token: refreshToken,
    });

    if (!data.access_token) {
      throw new Error("No se recibió un token nuevo en refresh");
    }

    setToken(data.access_token);
    if (data.refresh_token) {
      localStorage.setItem("refresh_token", data.refresh_token);
    }

    return data.access_token;
  } catch (err: any) {
    // Si el refresh falla, limpiar tokens y forzar re-login
    clearToken();
    localStorage.removeItem("refresh_token");

    throw new Error("Sesión expirada. Por favor inicia sesión nuevamente.");
  }
}
