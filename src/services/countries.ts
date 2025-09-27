/**
 * services/countries.ts
 * Catálogo de países (FAKE route por ahora).
 */
import { api } from "../lib/api";
import { useQuery } from "@tanstack/react-query";
import type { ApiList } from "../types/common";
import type { Country } from "../types/catalog";

// ⚠️ FAKE: reemplaza cuando tengas backend real
const R = {
  COUNTRIES: "/catalog/countries",
} as const;

export function useCountries() {
  return useQuery({
    queryKey: ["catalog", "countries"],
    queryFn: async () => {
      const { data } = await api.get<ApiList<Country>>(R.COUNTRIES);
      return data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 min cache
  });
}
