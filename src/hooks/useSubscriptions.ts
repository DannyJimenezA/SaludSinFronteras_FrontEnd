/**
 * React Query hooks for Subscriptions
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listPlans,
  createSubscription,
  getMySubscription,
  getSubscriptionHistory,
  checkAppointmentLimit,
  cancelSubscription,
  canBookAppointment,
  getAppointmentsRemaining,
} from "../services/subscriptions";
import type { CreateSubscriptionPayload } from "../types/subscriptions";

/** ===== QUERY: List available plans ===== */
export function usePlans() {
  return useQuery({
    queryKey: ["subscriptions", "plans"],
    queryFn: listPlans,
    staleTime: 30 * 60 * 1000, // 30 minutes - plans don't change often
  });
}

/** ===== QUERY: Get my active subscription ===== */
export function useMySubscription() {
  return useQuery({
    queryKey: ["subscriptions", "mine"],
    queryFn: getMySubscription,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/** ===== QUERY: Get subscription history ===== */
export function useSubscriptionHistory() {
  return useQuery({
    queryKey: ["subscriptions", "history"],
    queryFn: getSubscriptionHistory,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/** ===== QUERY: Check appointment limit ===== */
export function useAppointmentLimit() {
  return useQuery({
    queryKey: ["subscriptions", "limit"],
    queryFn: checkAppointmentLimit,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/** ===== QUERY: Can book appointment (helper) ===== */
export function useCanBookAppointment() {
  return useQuery({
    queryKey: ["subscriptions", "can-book"],
    queryFn: canBookAppointment,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/** ===== QUERY: Appointments remaining (helper) ===== */
export function useAppointmentsRemaining() {
  return useQuery({
    queryKey: ["subscriptions", "remaining"],
    queryFn: getAppointmentsRemaining,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/** ===== MUTATION: Create subscription ===== */
export function useCreateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSubscriptionPayload) =>
      createSubscription(payload),
    onSuccess: () => {
      // Invalidate my subscription
      queryClient.invalidateQueries({
        queryKey: ["subscriptions", "mine"],
      });
      // Invalidate appointment limit
      queryClient.invalidateQueries({
        queryKey: ["subscriptions", "limit"],
      });
      // Invalidate history
      queryClient.invalidateQueries({
        queryKey: ["subscriptions", "history"],
      });
    },
  });
}

/** ===== MUTATION: Cancel subscription ===== */
export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cancelSubscription(),
    onSuccess: () => {
      // Invalidate all subscription queries
      queryClient.invalidateQueries({
        queryKey: ["subscriptions"],
      });
    },
  });
}
