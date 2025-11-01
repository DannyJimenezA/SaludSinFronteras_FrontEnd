/**
 * React Query hooks for Medical Records
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createMedicalRecord,
  listPatientMedicalRecords,
  getMyMedicalRecords,
  getMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
} from "../services/medical-records";
import type {
  CreateMedicalRecordPayload,
  UpdateMedicalRecordPayload,
} from "../types/medical-records";

/** ===== QUERY: Get my medical records (Patient) ===== */
export function useMyMedicalRecords() {
  return useQuery({
    queryKey: ["medical-records", "mine"],
    queryFn: getMyMedicalRecords,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/** ===== QUERY: Get patient's medical records ===== */
export function usePatientMedicalRecords(patientId?: string) {
  return useQuery({
    queryKey: ["medical-records", "patient", patientId],
    queryFn: () => {
      if (!patientId) throw new Error("Patient ID is required");
      return listPatientMedicalRecords(patientId);
    },
    enabled: !!patientId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/** ===== QUERY: Get specific medical record ===== */
export function useMedicalRecord(recordId?: string) {
  return useQuery({
    queryKey: ["medical-records", "detail", recordId],
    queryFn: () => {
      if (!recordId) throw new Error("Record ID is required");
      return getMedicalRecord(recordId);
    },
    enabled: !!recordId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/** ===== MUTATION: Create medical record ===== */
export function useCreateMedicalRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMedicalRecordPayload) =>
      createMedicalRecord(payload),
    onSuccess: (data) => {
      // Invalidate patient's medical records list
      queryClient.invalidateQueries({
        queryKey: ["medical-records", "patient", data.PatientUserId],
      });
      // Invalidate my records if I'm the patient
      queryClient.invalidateQueries({
        queryKey: ["medical-records", "mine"],
      });
    },
  });
}

/** ===== MUTATION: Update medical record ===== */
export function useUpdateMedicalRecord(recordId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateMedicalRecordPayload) =>
      updateMedicalRecord(recordId, payload),
    onSuccess: (data) => {
      // Invalidate the specific record
      queryClient.invalidateQueries({
        queryKey: ["medical-records", "detail", recordId],
      });
      // Invalidate patient's records list
      queryClient.invalidateQueries({
        queryKey: ["medical-records", "patient", data.PatientUserId],
      });
      // Invalidate my records
      queryClient.invalidateQueries({
        queryKey: ["medical-records", "mine"],
      });
    },
  });
}

/** ===== MUTATION: Delete medical record ===== */
export function useDeleteMedicalRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recordId: string) => deleteMedicalRecord(recordId),
    onSuccess: () => {
      // Invalidate all medical records queries
      queryClient.invalidateQueries({
        queryKey: ["medical-records"],
      });
    },
  });
}
