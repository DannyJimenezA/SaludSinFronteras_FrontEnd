/**
 * React Query hooks for Video Conferencing
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ensureVideoRoom,
  getVideoToken,
  endVideoRoom,
  setupVideoCall,
} from "../services/video";

/** ===== QUERY: Get video token ===== */
export function useVideoToken(appointmentId?: string) {
  return useQuery({
    queryKey: ["video", "token", appointmentId],
    queryFn: () => {
      if (!appointmentId) throw new Error("Appointment ID is required");
      return getVideoToken(appointmentId);
    },
    enabled: !!appointmentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/** ===== MUTATION: Ensure video room exists ===== */
export function useEnsureVideoRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentId: string) => ensureVideoRoom(appointmentId),
    onSuccess: (data, appointmentId) => {
      // Invalidate appointment details
      queryClient.invalidateQueries({
        queryKey: ["appointments", "detail", appointmentId],
      });
    },
  });
}

/** ===== MUTATION: End video room ===== */
export function useEndVideoRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentId: string) => endVideoRoom(appointmentId),
    onSuccess: (data, appointmentId) => {
      // Invalidate video token
      queryClient.invalidateQueries({
        queryKey: ["video", "token", appointmentId],
      });
      // Invalidate appointment details
      queryClient.invalidateQueries({
        queryKey: ["appointments", "detail", appointmentId],
      });
    },
  });
}

/** ===== QUERY: Setup video call (room + token) ===== */
export function useSetupVideoCall(appointmentId?: string) {
  return useQuery({
    queryKey: ["video", "setup", appointmentId],
    queryFn: () => {
      if (!appointmentId) throw new Error("Appointment ID is required");
      return setupVideoCall(appointmentId);
    },
    enabled: !!appointmentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}
