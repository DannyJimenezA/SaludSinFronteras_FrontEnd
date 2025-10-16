// src/hooks/useUser.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login, logout } from "../services/auth";
import { getMe } from "../services/users";
import type { User } from "../types/user";

const ME_KEY = ["me"] as const;
const hasToken = () => !!localStorage.getItem("access_token");

export function useMe() {
  return useQuery<User>({
    queryKey: ME_KEY,
    queryFn: getMe,
    enabled: hasToken(),
    retry: false,
    staleTime: 60_000,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: { email: string; password: string }) => {
      await login(p);                           // guarda token
      const me = await qc.fetchQuery({ queryKey: ME_KEY, queryFn: getMe }); // precarga perfil
      return me;
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => logout(),
    onSuccess: () => qc.removeQueries({ queryKey: ME_KEY }),
  });
}
