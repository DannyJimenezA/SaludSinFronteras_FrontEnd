import { api } from "../lib/api";
import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";
import type { FileRef } from "../types/files";

const R = {
  LIST: "/files",
  UPLOAD: "/files",
  DETAIL: (id: string) => `/files/${id}`,
  DELETE: (id: string) => `/files/${id}`,
  DOWNLOAD: (id: string) => `/files/${id}/download`,
} as const;

export interface FilesFilters {
  ownerUserId?: string;
  q?: string;
  page?: number;
  perPage?: number;
}

export function useFiles(filters: FilesFilters = {}) {
  return useQuery({
    queryKey: ["files", filters],
    queryFn: async (): Promise<FileRef[]> => {
      const { data } = await api.get(R.LIST, { params: filters });
      return Array.isArray(data) ? data : (data?.data ?? []);
    },
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000,
  });
}

export function useFile(id?: string) {
  return useQuery({
    queryKey: ["files", "detail", id],
    queryFn: async (): Promise<FileRef> => {
      if (!id) throw new Error("id requerido");
      const { data } = await api.get(R.DETAIL(id));
      return data?.data ?? data;
    },
    enabled: Boolean(id),
  });
}

/** Subida (multipart) con progreso */
export function uploadFile(
  file: File,
  onProgress?: (pct: number) => void
): Promise<{ file: FileRef }> {
  const form = new FormData();
  form.append("file", file);
  return api
    .post(R.UPLOAD, form, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (ev) => {
        if (!onProgress || !ev.total) return;
        const pct = Math.round((ev.loaded * 100) / ev.total);
        onProgress(pct);
      },
    })
    .then(({ data }) => ({
      
      file: (data?.data ?? data) as FileRef,
    }));
}

export function useUploadFile() {
  return useMutation({
    mutationKey: ["files", "upload"],
    mutationFn: async ({ file, onProgress }: { file: File; onProgress?: (pct: number) => void }) => {
      return uploadFile(file, onProgress);
    },
  });
}

export function useDeleteFile(id: string) {
  return useMutation({
    mutationKey: ["files", "delete", id],
    mutationFn: async () => {
      await api.delete(R.DELETE(id));
    },
  });
}

export function buildDownloadUrl(id: string) {
  const base = (api.defaults.baseURL ?? "").replace(/\/$/, "");
  return `${base}${R.DOWNLOAD(id)}`;
}
