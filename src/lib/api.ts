// src/lib/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

/** ========================
 *  Config desde .env
 *  ======================== */
const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "";
const API_PREFIX = (import.meta.env.VITE_API_PREFIX as string | undefined) ?? ""; // ej: "/api"

// Validación temprana (evita llamadas a "/")
if (!API_BASE_URL) {
  throw new Error(
    "[API] VITE_API_URL no está definido. Configúralo en tu .env (p.ej. http://localhost:3000)"
  );
}

// Une base + prefijo evitando dobles slashes
const joinUrl = (base: string, prefix: string) => {
  const b = base.replace(/\/+$/, "");
  if (!prefix) return b; // sin prefijo → solo base
  const p = prefix.startsWith("/") ? prefix : `/${prefix}`;
  return `${b}${p.replace(/\/+$/, "")}`;
};

const BASE = joinUrl(API_BASE_URL, API_PREFIX);

// Log de arranque (solo dev) para confirmar a qué host apunta el front
if (import.meta.env.DEV) {
  console.info("[API] baseURL =", BASE);
}

export const api = axios.create({
  baseURL: BASE, // queda "https://host.tld" o "https://host.tld/api"
  withCredentials: false, // pon true si usas cookies/sesión
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
  const token = getToken();
  if (token) {
    cfg.headers = cfg.headers ?? {};
    (cfg.headers as any).Authorization = `Bearer ${token}`;
  }

  if (import.meta.env.DEV) {
    const method = (cfg.method || "GET").toUpperCase();
    // Enmascarar password y Password
    const mask = (obj: any) =>
      obj && typeof obj === "object"
        ? {
            ...obj,
            password: obj.password ? "***" : undefined,
            Password: obj.Password ? "***" : undefined,
          }
        : obj;

    console.debug(`[API] → ${method} ${cfg.baseURL}${cfg.url}`, {
      params: cfg.params,
      data: mask(cfg.data),
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

    const backendMsg =
      (error.response?.data as any)?.message ??
      (error.response?.data as any)?.error ??
      error.message;

    if (status === 401) {
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      clearToken();
    }

    if (status === 403) {
      window.dispatchEvent(new CustomEvent("auth:forbidden"));
    }

    if (import.meta.env.DEV) {
      console.error(
        `[API ERROR] ${status} ${cfg?.baseURL}${cfg?.url} →`,
        backendMsg,
        error.response?.data
      );
    }
    return Promise.reject(error);
  }
);

/** ========================
 *  Helper de path (opcional)
 *  ======================== */
export function apiPath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}
