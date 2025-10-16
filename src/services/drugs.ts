/**
 * services/drugs.ts (opcional)
 * Catálogo de fármacos con búsqueda (FAKE route por ahora).
 */
import { api } from "../lib/api";
import { useQuery } from "@tanstack/react-query";
import type { ApiList } from "../types/common";
import type { Drug } from "../types/catalog";

// ⚠️ FAKE: reemplaza cuando tengas backend real
const R = {
  DRUGS: "/catalog/drugs",
} as const;

export function useDrugs(search: string) {
  return useQuery({
    queryKey: ["catalog", "drugs", search],
    queryFn: async () => {
      if (!search || !search.trim()) return [] as Drug[];
      const { data } = await api.get<ApiList<Drug>>(R.DRUGS, { params: { search } });
      return data.data;
    },
    enabled: Boolean(search && search.trim()),
    staleTime: 2 * 60 * 1000,
  });
}
