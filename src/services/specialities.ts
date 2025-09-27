// services/specialities.ts
import { api } from "../lib/api";
// Si usas paths con alias "@", usa: import type { Specialty } from "@/types/catalog";
// Si NO usas alias, cámbialo a la ruta relativa donde tengas tus types:
import type { Specialty } from "../types/catalog"; // <-- ajusta a "../types/catalog" si es tu caso

import { useQuery } from "@tanstack/react-query";

// ⚠️ RUTA FAKE: cuando tengas backend real, solo cambia este path.
const SPECS_PATH = "/catalog/specialties";

/**
 * Versión funcional (promesa), compatible con tu código actual.
 * - Si el backend regresa { data: Specialty[] }, lo maneja.
 * - Si el backend regresa Specialty[] plano, también lo maneja.
 */
export async function listSpecialties(): Promise<Specialty[]> {
  const { data } = await api.get(SPECS_PATH);
  // Compatibilidad: { data: [] } ó []
  
  return Array.isArray(data) ? data : data?.data ?? [];
}

/**
 * Versión con React Query (recomendada).
 * Cachea 5 min y evita refetch agresivo.
 */
export function useSpecialties() {
  return useQuery({
    queryKey: ["catalog", "specialties"],
    queryFn: async (): Promise<Specialty[]> => {
      const { data } = await api.get(SPECS_PATH);
      // Compatibilidad: { data: [] } ó []
     
      return Array.isArray(data) ? data : data?.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}
