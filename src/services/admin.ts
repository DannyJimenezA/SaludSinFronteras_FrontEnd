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

// ---- Usuarios ----
// Tipo que coincide con la respuesta del backend (camelCase)
export type AdminUser = {
  id: string | number | bigint;
  email: string;
  fullName: string;
  role: "DOCTOR" | "PATIENT" | "ADMIN";
  isEmailVerified: boolean;
  isBanned: boolean;
  banReason?: string;
  createdAt: Date | string;
  verificationStatus?: "pending" | "approved" | "rejected";
  licenseNumber?: string;
  // Campos adicionales del detalle
  firstName?: string;
  lastName1?: string;
  lastName2?: string;
  phone?: string;
  birthDate?: Date | string;
  totalAppointments?: number;
  totalMedicalRecords?: number;
  activeSubscription?: {
    planName: string;
    expiresAt?: Date | string;
  };
  lastLogin?: Date | string;
  updatedAt?: Date | string;
};

export async function listRecentUsers(limit = 10): Promise<AdminUser[]> {
  const { data } = await api.get<AdminUser[]>("/users", { params: { limit } });
  return Array.isArray(data) ? data : [];
}

// Tipo de respuesta paginada del backend
export type PaginatedUsersResponse = {
  users: AdminUser[];
  total: number;
  pages: number;
  currentPage?: number;
};

// Listar todos los usuarios con filtros opcionales
export async function listAllUsers(filters?: {
  role?: string;
  verificationStatus?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedUsersResponse> {
  const params: any = {};

  if (filters?.role && filters.role !== 'ALL') {
    params.role = filters.role;
  }

  if (filters?.verificationStatus && filters.verificationStatus !== 'ALL') {
    params.verificationStatus = filters.verificationStatus;
  }

  if (filters?.search) {
    params.search = filters.search;
  }

  // Default page 1, limit 20
  params.page = filters?.page || 1;
  params.limit = filters?.limit || 20;

  const { data } = await api.get<any>("/admin/users", { params });

  // El backend devuelve un objeto con paginación
  if (data && Array.isArray(data.users)) {
    return {
      users: data.users,
      total: data.total || 0,
      pages: data.pages || 1,
      currentPage: params.page,
    };
  }

  // Si devuelve un array directamente (fallback)
  if (Array.isArray(data)) {
    return {
      users: data,
      total: data.length,
      pages: 1,
      currentPage: 1,
    };
  }

  // Respuesta vacía
  return {
    users: [],
    total: 0,
    pages: 0,
    currentPage: 1,
  };
}

// Obtener un usuario específico por ID
export async function getUserById(userId: string | number): Promise<AdminUser> {
  const { data } = await api.get<AdminUser>(`/admin/users/${userId}`);
  return data;
}

// Actualizar un usuario
// NOTA: El backend actualmente no tiene este endpoint implementado
// Esta función está aquí por compatibilidad, pero podría retornar error 404
export async function updateUser(
  userId: string | number,
  updates: Partial<{
    fullName: string;
    email: string;
    phone: string;
    role: string;
    firstName: string;
    lastName1: string;
    lastName2: string;
    gender: string;
    dateOfBirth: string;
  }>
): Promise<AdminUser> {
  const { data } = await api.patch<AdminUser>(`/admin/users/${userId}`, updates);
  return data;
}

// Eliminar un usuario
export async function deleteUser(userId: string | number): Promise<void> {
  await api.delete(`/admin/users/${userId}`);
}

// ---- Planes de Suscripción ----
export type SubscriptionPlan = {
  id: string | number | bigint;
  name: string;
  priceCents: number;
  currency: string;
  featuresJson: string[];
  maxAppointments: number | null; // null = ilimitado
  isActive: boolean;
  createdAt: Date | string;
  formattedPrice?: string;
};

// Listar todos los planes de suscripción
export async function listSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const { data } = await api.get<any[]>("/plans");

  if (Array.isArray(data)) {
    // Convertir de PascalCase (backend) a camelCase (frontend)
    return data.map((plan) => ({
      id: plan.Id,
      name: plan.Name,
      priceCents: plan.PriceCents,
      currency: plan.Currency,
      featuresJson: plan.FeaturesJson || [],
      maxAppointments: plan.MaxAppointments,
      isActive: plan.IsActive,
      createdAt: plan.CreatedAt,
      formattedPrice: plan.FormattedPrice,
    }));
  }

  return [];
}

// Seed de planes (crear los 3 planes por defecto)
export async function seedSubscriptionPlans(): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>("/plans/seed");
  return data;
}

// ---- Especialidades ----
export type Specialty = {
  id: string;
  name: string;
};

// Listar todas las especialidades
export async function listSpecialties(): Promise<Specialty[]> {
  const { data } = await api.get<Specialty[]>("/specialties");
  return Array.isArray(data) ? data : [];
}

// Obtener una especialidad por ID
export async function getSpecialtyById(id: string): Promise<Specialty> {
  const { data } = await api.get<Specialty>(`/specialties/${id}`);
  return data;
}

// Crear una nueva especialidad (solo ADMIN)
export async function createSpecialty(name: string): Promise<Specialty> {
  const { data } = await api.post<Specialty>("/specialties", { Name: name });
  return data;
}

// Actualizar una especialidad (solo ADMIN)
export async function updateSpecialty(id: string, name: string): Promise<Specialty> {
  const { data } = await api.put<Specialty>(`/specialties/${id}`, { Name: name });
  return data;
}

// Eliminar una especialidad (solo ADMIN)
export async function deleteSpecialty(id: string): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(`/specialties/${id}`);
  return data;
}
