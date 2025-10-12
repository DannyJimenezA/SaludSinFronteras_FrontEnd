import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

// Tipos base mínimos (ajusta si luego expones DTOs formales)
type Appt = {
  id?: number | string;
  Id?: number | string;
  status?: string;
  Status?: string;
  scheduledAt?: string;   // ISO
  ScheduledAt?: string;   // ISO
};

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
// Métricas de citas (derivadas de GET /appointments)
// ─────────────────────────────────────────────────────────────
export function useAdminMetrics() {
  return useQuery({
    queryKey: ["admin", "metrics"],
    queryFn: async () => {
      // Si más adelante tienes /admin/metrics, cámbialo aquí
      const { data } = await api.get<Appt[]>("/appointments");
      const list = Array.isArray(data) ? data : [];

      const totalAppointments = list.length;

      const todayISO = new Date().toISOString().slice(0, 10);
      let todayConsultations = 0;
      let completedCount = 0;

      for (const a of list) {
        const status = String(a.Status ?? a.status ?? "").toUpperCase();
        const day = String(a.ScheduledAt ?? a.scheduledAt ?? "").slice(0, 10);

        if (day === todayISO) todayConsultations++;
        if (status === "COMPLETED") completedCount++;
      }

      const completedPct = totalAppointments
        ? (completedCount * 100) / totalAppointments
        : 0;

      return {
        totalAppointments,
        todayConsultations,
        completedPct,
        monthlyRevenue: 0, // placeholder hasta conectar billing
      };
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
