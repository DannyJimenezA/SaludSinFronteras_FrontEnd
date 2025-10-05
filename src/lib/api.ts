// src/lib/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

/** ========================
 *  Config desde .env
 *  ======================== */
const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "";
// Prefijo opcional tipo '/api' si usas app.setGlobalPrefix('api') en Nest
const API_PREFIX = (import.meta.env.VITE_API_PREFIX as string | undefined) ?? ""; // ej: "/api"

// Sanitiza el baseURL para evitar dobles slashes
const joinUrl = (base: string, prefix: string) => {
  const b = base.replace(/\/+$/, "");
  const p = prefix.replace(/^\/?/, "/").replace(/\/+$/, "");
  return `${b}${p}`;
};

export const api = axios.create({
  baseURL: joinUrl(API_BASE_URL, API_PREFIX), // queda "https://host.tld[/api]"
  withCredentials: false, // pon true si usaras cookies/sesión
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/** ========================
 *  Token helpers
 *  ======================== */
const TOKEN_KEY = "access_token";

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/** ========================
 *  Request Interceptor
 *  ======================== */
api.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
  // Inyecta Bearer token si existe
  const token = getToken();
  if (token) {
    cfg.headers = cfg.headers ?? {};
    cfg.headers.Authorization = `Bearer ${token}`;
  }

  // Log en desarrollo
  if (import.meta.env.DEV) {
    const method = (cfg.method || "GET").toUpperCase();
    // Evita loggear passwords completos
    const safeData =
      cfg.data && typeof cfg.data === "object"
        ? { ...cfg.data, password: cfg.data.password ? "***" : undefined }
        : cfg.data;
    console.debug(`[API] → ${method} ${cfg.baseURL}${cfg.url}`, {
      params: cfg.params,
      data: safeData,
    });
  }
  return cfg;
});

/** ========================
 *  Response Interceptor
 *  ======================== */
api.interceptors.response.use(
  (res) => {
    if (import.meta.env.DEV) {
      console.debug(
        `[API] ← ${res.status} ${res.config.baseURL}${res.config.url}`,
        res.data
      );
    }
    return res;
  },
  async (error: AxiosError<any>) => {
    const status = error.response?.status;
    const cfg = error.config;

    // Mapea mensajes del backend a un string legible (opcional)
    const backendMsg =
      (error.response?.data as any)?.message ??
      (error.response?.data as any)?.error ??
      error.message;

    if (status === 401) {
      // Token inválido/expirado -> emite un evento para que tu AuthContext haga logout/redirección
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      // Si tienes refresh token, aquí podrías intentar refrescar (no implementado por simplicidad)
    }

    if (status === 403) {
      // Sin permisos -> evento para UI
      window.dispatchEvent(new CustomEvent("auth:forbidden"));
    }

    if (import.meta.env.DEV) {
      console.error(
        `[API ERROR] ${status} ${cfg?.baseURL}${cfg?.url} →`,
        backendMsg,
        error.response?.data
      );
    }

    // Re-lanza el error para manejo en cada llamada
    return Promise.reject(error);
  }
);

/** ========================
 *  Helpers para construir paths (opcional)
 *  ======================== */
// Úsalo si quieres construir rutas consistentes: apiPath('/users/me') -> '/users/me' o '/api/users/me'
export function apiPath(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return p;
}
