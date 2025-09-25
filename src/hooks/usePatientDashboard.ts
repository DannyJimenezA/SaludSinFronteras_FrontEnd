import { useQuery } from "@tanstack/react-query";
import { fetchPatientDashboard } from "../services/patient-dashboard";

export function usePatientDashboard(patientId: number) {
  return useQuery({
    queryKey: ["patient-dashboard", patientId],
    queryFn: () => fetchPatientDashboard(patientId),
    enabled: !!patientId,
    staleTime: 30_000,
  });
}
