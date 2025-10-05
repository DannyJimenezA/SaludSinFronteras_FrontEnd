/**
 * services/identifications.ts
 * Identificaciones del usuario + fotos/adjuntos.
 * Tablas: UserIdentifications, IdentificationTypes, IdentificationPhotos, Files
 * Rutas FAKE — cambia cuando conectes el backend real.
 */
import { api } from "../lib/api";
import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";
import type { IdentificationType, UserIdentification } from "../types/users";
import type { FileRef } from "../types/files";

const R = {
  TYPES: "/identifications/types", // GET lista tipos
  LIST: (userId: string) => `/users/${userId}/identifications`, // GET
  CREATE: (userId: string) => `/users/${userId}/identifications`, // POST
  DETAIL: (userId: string, id: string) => `/users/${userId}/identifications/${id}`, // GET/PATCH/DELETE
  PHOTOS: (userId: string, id: string) => `/users/${userId}/identifications/${id}/photos`, // POST multipart
  PHOTO: (userId: string, id: string, photoId: string) => `/users/${userId}/identifications/${id}/photos/${photoId}`, // DELETE
} as const;

export function useIdentificationTypes() {
  return useQuery({
    queryKey: ["identifications", "types"],
    queryFn: async (): Promise<IdentificationType[]> => {
      const { data } = await api.get(R.TYPES);
      return Array.isArray(data) ? data : (data?.data ?? []);
    },
    staleTime: 24 * 60 * 60 * 1000, // 1 día
  });
}

export function useUserIdentifications(userId?: string) {
  return useQuery({
    queryKey: ["identifications", "list", userId],
    queryFn: async (): Promise<UserIdentification[]> => {
      if (!userId) return [];
      const { data } = await api.get(R.LIST(userId));
      return Array.isArray(data) ? data : (data?.data ?? []);
    },
    enabled: Boolean(userId),
    placeholderData: keepPreviousData,
  });
}

export interface CreateIdentificationPayload {
  identificationTypeId: string;
  number: string;
  issuedCountryId?: string;
  issuedAt?: string;   // date
  expiresAt?: string;  // date
  status?: string;     // 'PENDING' | 'VERIFIED' | etc.
}

export function useCreateIdentification(userId: string) {
  return useMutation({
    mutationKey: ["identifications", "create", userId],
    mutationFn: async (payload: CreateIdentificationPayload) => {
      const { data } = await api.post<UserIdentification>(R.CREATE(userId), payload);
      // @ts-expect-error axios any
      return data?.data ?? data;
    },
  });
}

export function useUpdateIdentification(userId: string, id: string) {
  return useMutation({
    mutationKey: ["identifications", "update", userId, id],
    mutationFn: async (payload: Partial<CreateIdentificationPayload>) => {
      const { data } = await api.patch<UserIdentification>(R.DETAIL(userId, id), payload);
      // @ts-expect-error axios any
      return data?.data ?? data;
    },
  });
}

export function useDeleteIdentification(userId: string, id: string) {
  return useMutation({
    mutationKey: ["identifications", "delete", userId, id],
    mutationFn: async () => {
      await api.delete(R.DETAIL(userId, id));
    },
  });
}

/** Subir foto a una identificación (frente/reverso) */
export async function uploadIdentificationPhoto(
  userId: string,
  identificationId: string,
  file: File,
  side?: "FRONT" | "BACK"
): Promise<{ file: FileRef; photoId?: string }> {
  const form = new FormData();
  form.append("file", file);
  if (side) form.append("side", side);
  const { data } = await api.post(R.PHOTOS(userId, identificationId), form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return (data?.data ?? data) as { file: FileRef; photoId?: string };
}

export function useUploadIdentificationPhoto(userId: string, identificationId: string) {
  return useMutation({
    mutationKey: ["identifications", "photos", "upload", userId, identificationId],
    mutationFn: async ({ file, side }: { file: File; side?: "FRONT" | "BACK" }) => {
      return uploadIdentificationPhoto(userId, identificationId, file, side);
    },
  });
}

export function useDeleteIdentificationPhoto(userId: string, identificationId: string, photoId: string) {
  return useMutation({
    mutationKey: ["identifications", "photos", "delete", userId, identificationId, photoId],
    mutationFn: async () => {
      await api.delete(R.PHOTO(userId, identificationId, photoId));
    },
  });
}
