import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

// Tipos para las estadísticas del dashboard
export interface AdminDashboardStats {
  totalUsers: number;
  totalDoctors: number;
  totalPatients: number;
  totalAdmins: number;
  verifiedDoctors: number;
  pendingDoctors: number;
  rejectedDoctors: number;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  upcomingAppointments: number;
  totalMedicalRecords: number;
  medicalRecordsThisMonth: number;
  activeSubscriptions: number;
  basicSubscriptions: number;
  professionalSubscriptions: number;
  premiumSubscriptions: number;
  totalRevenueCents: number;
  revenueThisMonthCents: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
}

type UserLite = {
  id: number | string;
  name: string;
  email: string;
  type: "doctor" | "patient";
  status: "active" | "pending" | "blocked";
  country?: string;
  joinDate?: string;
};

// ─────────────────────────────────────────────────────────────
// Métricas del dashboard de admin
// ─────────────────────────────────────────────────────────────
export function useAdminMetrics() {
  return useQuery({
    queryKey: ["admin", "dashboard", "stats"],
    queryFn: async () => {
      const { data } = await api.get<AdminDashboardStats>("/admin/dashboard/stats");
      return data;
    },
    staleTime: 60_000,
  });
}

// ─────────────────────────────────────────────────────────────
// Usuarios recientes (si /users no existe aún, devolvemos [])
// ─────────────────────────────────────────────────────────────
export function useRecentUsers(limit = 12) {
  return useQuery({
    queryKey: ["admin", "recentUsers", limit],
    queryFn: async (): Promise<UserLite[]> => {
      try {
        const { data } = await api.get<any[]>("/users", { params: { limit } });
        const arr = Array.isArray(data) ? data : [];

        return arr.slice(0, limit).map((u) => {
          const role = String(u.role ?? u.Role ?? "").toUpperCase();
          const statusRaw = String(u.status ?? u.Status ?? "active").toLowerCase();

          // ✅ nombre robusto y sin errores de sintaxis
          const name =
            (u.fullName ?? u.FullName ?? u.name) ||
            [u.firstName ?? u.FirstName ?? "",
             u.lastName1 ?? u.LastName1 ?? "",
             u.lastName2 ?? u.LastName2 ?? ""]
              .join(" ")
              .trim() ||
            "Usuario";

          const status: UserLite["status"] =
            (["active", "pending, blocked"] as const).includes(statusRaw as any)
              ? (statusRaw as UserLite["status"])
              : "active";

          return {
            id: u.id ?? u.Id,
            name,
            email: u.email ?? u.Email ?? "",
            type: role === "DOCTOR" ? "doctor" : "patient",
            status,
            country: u.country ?? u.Country ?? undefined,
            joinDate: String(u.createdAt ?? u.CreatedAt ?? "").slice(0, 10),
          };
        });
      } catch {
        // si aún no hay /users, devolvemos vacío para que la UI muestre el aviso
        return [];
      }
    },
    staleTime: 60_000,
  });
}
