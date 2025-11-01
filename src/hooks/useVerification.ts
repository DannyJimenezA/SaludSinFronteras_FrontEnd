/**
 * React Query hooks for Doctor Verification
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  submitVerification,
  getMyVerificationStatus,
  listPendingVerifications,
  listApprovedVerifications,
  listRejectedVerifications,
  getDoctorVerification,
  reviewVerification,
  approveVerification,
  rejectVerification,
} from "../services/verification";
import type {
  SubmitVerificationPayload,
  ReviewVerificationPayload,
} from "../types/verification";

/** ===== QUERY: Get my verification status (Doctor) ===== */
export function useMyVerificationStatus() {
  return useQuery({
    queryKey: ["verification", "status", "mine"],
    queryFn: getMyVerificationStatus,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
}

/** ===== QUERY: List pending verifications (Admin) ===== */
export function usePendingVerifications() {
  return useQuery({
    queryKey: ["verification", "pending"],
    queryFn: listPendingVerifications,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/** ===== QUERY: List approved verifications (Admin) ===== */
export function useApprovedVerifications() {
  return useQuery({
    queryKey: ["verification", "approved"],
    queryFn: listApprovedVerifications,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/** ===== QUERY: List rejected verifications (Admin) ===== */
export function useRejectedVerifications() {
  return useQuery({
    queryKey: ["verification", "rejected"],
    queryFn: listRejectedVerifications,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/** ===== QUERY: Get doctor verification (Admin) ===== */
export function useDoctorVerification(doctorId?: string) {
  return useQuery({
    queryKey: ["verification", "doctor", doctorId],
    queryFn: () => {
      if (!doctorId) throw new Error("Doctor ID is required");
      return getDoctorVerification(doctorId);
    },
    enabled: !!doctorId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/** ===== MUTATION: Submit verification documents (Doctor) ===== */
export function useSubmitVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitVerificationPayload) =>
      submitVerification(payload),
    onSuccess: () => {
      // Invalidate my verification status
      queryClient.invalidateQueries({
        queryKey: ["verification", "status", "mine"],
      });
    },
  });
}

/** ===== MUTATION: Review verification (Admin) ===== */
export function useReviewVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      doctorId,
      payload,
    }: {
      doctorId: string;
      payload: ReviewVerificationPayload;
    }) => reviewVerification(doctorId, payload),
    onSuccess: (data, variables) => {
      // Invalidate all verification lists
      queryClient.invalidateQueries({
        queryKey: ["verification", "pending"],
      });
      queryClient.invalidateQueries({
        queryKey: ["verification", "approved"],
      });
      queryClient.invalidateQueries({
        queryKey: ["verification", "rejected"],
      });
      // Invalidate specific doctor verification
      queryClient.invalidateQueries({
        queryKey: ["verification", "doctor", variables.doctorId],
      });
    },
  });
}

/** ===== MUTATION: Approve verification (Admin Helper) ===== */
export function useApproveVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      doctorId,
      adminNotes,
    }: {
      doctorId: string;
      adminNotes?: string;
    }) => approveVerification(doctorId, adminNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["verification"],
      });
    },
  });
}

/** ===== MUTATION: Reject verification (Admin Helper) ===== */
export function useRejectVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      doctorId,
      rejectionReason,
      adminNotes,
    }: {
      doctorId: string;
      rejectionReason: string;
      adminNotes?: string;
    }) => rejectVerification(doctorId, rejectionReason, adminNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["verification"],
      });
    },
  });
}
