// src/services/admin.ts
import { api } from "../lib/api";

// ---- Appointments (sí existen) ----
export type Appointment = {
  Id: string | number;
  PatientUserId: string | number;
  DoctorUserId: string | number;
  Status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  ScheduledAt: string;           // ISO
  DurationMin: number | null;
  Modality: "online" | "onsite";
  CreatedAt: string;
  UpdatedAt: string;
};

export async function listAppointments(): Promise<Appointment[]> {
  const { data } = await api.get<Appointment[]>("/appointments");
  return Array.isArray(data) ? data : [];
}

// ---- Usuarios (puede NO existir todavía) ----
// Si tu backend no tiene GET /users, este call lanzará 404 y el hook lo manejará.
export type AdminUser = {
  Id: string | number;
  FullName?: string;
  Email?: string;
  Role?: "DOCTOR" | "PATIENT" | "ADMIN";
  Specialty?: string | null;
  Country?: string | null;
  Status?: "active" | "pending" | "inactive";
  CreatedAt?: string;
};

export async function listRecentUsers(limit = 10): Promise<AdminUser[]> {
  const { data } = await api.get<AdminUser[]>("/users", { params: { limit } });
  return Array.isArray(data) ? data : [];
}
