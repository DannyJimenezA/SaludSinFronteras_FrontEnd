// src/lib/api.ts
import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL as string;

// ⬇⬇⬇ CAMBIAR SOLO LOS PATHS EN LOS SERVICES (ver más abajo).
// Aquí solo vive la base URL (host) del backend.
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // ← pon true si usas cookies/sesión
  timeout: 15000,
});

// Interceptor opcional para ver peticiones en consola (útil en dev)
api.interceptors.request.use((cfg) => {
  console.debug(`[API] → ${cfg.method?.toUpperCase()} ${cfg.baseURL}${cfg.url}`);
  return cfg;
});
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("[API ERROR]", err?.response ?? err);
    throw err;
  }
);
