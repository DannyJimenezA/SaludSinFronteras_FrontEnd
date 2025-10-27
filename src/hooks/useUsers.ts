// src/hooks/useUsers.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login, logout } from "../services/auth";
import { getMe } from "../services/users";
import type { User } from "../types/user";

export const ME_KEY = ["me"] as const;

// Evaluado runtime: si hay token habilitamos /users/me
const hasToken = () => !!localStorage.getItem("access_token");

export function useMe() {
  return useQuery<User>({
    queryKey: ME_KEY,
    queryFn: getMe,
    enabled: hasToken(),
    retry: false,
    staleTime: 60_000, // 1 min
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: { email: string; password: string }) => {
      // 1) Login (guarda token)
      await login(p);
      // 2) Pre-carga el perfil inmediatamente
      const me = await qc.fetchQuery({ queryKey: ME_KEY, queryFn: getMe });
      return me;
    },
    onSuccess: (me) => {
      // Dejamos cacheado /me por si un componente lo lee de inmediato
      qc.setQueryData(ME_KEY, me);
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      logout(); // limpia token
    },
    onSuccess: () => {
      // Limpiar el cache del perfil
      qc.removeQueries({ queryKey: ME_KEY });
    },
  });
}
