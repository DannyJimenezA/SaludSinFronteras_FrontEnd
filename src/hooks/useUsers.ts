import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listUsers, getUser, createUser, updateUser, deleteUser } from "../services/user";

export function useUsers(params?: { q?: string; page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => listUsers(params?.q, params?.page, params?.pageSize),
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => getUser(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useUpdateUser(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof updateUser>[1]) => updateUser(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["users", id] });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}
