import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface Doctor {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  licenseNumber: string;
  licenseCountry: string;
  yearsExperience: number | null;
  bio: string | null;
  specialties: Array<{
    id: string;
    name: string;
  }>;
}

export interface TimeSlot {
  id: string;
  startAt: string;
  endAt: string;
  isRecurring: boolean;
}

export interface AvailableSlotsResponse {
  doctor: {
    userId: string;
    name: string;
  };
  slots: TimeSlot[];
}

export function useApprovedDoctors(search?: string, specialtyId?: string) {
  return useQuery({
    queryKey: ["doctors", "approved", search, specialtyId],
    queryFn: async () => {
      const response = await api.get("/doctors/approved", {
        params: {
          ...(search && { search }),
          ...(specialtyId && { specialtyId }),
        },
      });
      return response.data as Doctor[];
    },
  });
}

export function useDoctorAvailableSlots(
  doctorId: string | undefined,
  startDate?: string,
  endDate?: string
) {
  return useQuery({
    queryKey: ["doctors", doctorId, "available-slots", startDate, endDate],
    queryFn: async () => {
      if (!doctorId) throw new Error("Doctor ID is required");
      const response = await api.get(`/doctors/${doctorId}/available-slots`, {
        params: {
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        },
      });
      return response.data as AvailableSlotsResponse;
    },
    enabled: !!doctorId,
  });
}
