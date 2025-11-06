import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface Specialty {
  id: string;
  name: string;
}

export function useSpecialties() {
  return useQuery({
    queryKey: ["specialties"],
    queryFn: async () => {
      const response = await api.get("/specialties");
      // El backend devuelve { Id, Name } en PascalCase, lo mapeamos a { id, name } en camelCase
      const specialtiesFromApi = response.data as Array<{ Id: string; Name: string }>;
      return specialtiesFromApi.map(s => ({
        id: s.Id,
        name: s.Name,
      })) as Specialty[];
    },
    staleTime: 1000 * 60 * 60, // Cache por 1 hora (las especialidades no cambian frecuentemente)
  });
}

export function useCreateSpecialty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { Name: string }) => {
      const response = await api.post("/specialties", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specialties"] });
    },
  });
}

export function useUpdateSpecialty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; Name: string }) => {
      const response = await api.put(`/specialties/${data.id}`, {
        Name: data.Name,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specialties"] });
    },
  });
}

export function useDeleteSpecialty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/specialties/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specialties"] });
    },
  });
}
