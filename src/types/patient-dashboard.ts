/**
 * Patient dashboard view models & helpers.
 * Derived from existing patient-dashboard.ts while reusing core types from /types barrel.
 */
import type { Id, ISODate } from "./common";
import type { Appointment } from "./appointments";
import type { User } from "./users";
import { ReactNode } from "react";

// Core view models expected by PatientDashboard component
export interface UpcomingAppointmentVM {
  id: Id;
  date: ISODate;        // from Appointment.scheduledAt
  doctorName: string;
  doctorAvatarUrl?: string;
  type: string;         // modality or human label
  status: string;
}

export interface RecommendedDoctorVM {
  userId: Id;
  name: string;
  specialty: string;
  ratingAvg?: number;
  avatarUrl?: string;
}

export interface RecentMessageVM {
  id: Id;
  fromUserName: string;
  preview: string;
  sentAt: ISODate;
}

// Mapping hints (to be implemented in data layer)
// function mapAppointmentToVM(a: Appointment, doctor: User): UpcomingAppointmentVM { /* ... */ }
// function mapMessageToVM(m: Message): RecentMessageVM { /* ... */ }

// === Types preserved from your previous patient-dashboard.ts ===
export type AppointmentType = "videollamada" | "presencial";

export type UpcomingAppointment = {
  doctor: ReactNode;
  id: number;
  doctorName: string;
  specialty: string;
  date: string; // ISO (YYYY-MM-DD)
  time: string; // HH:mm
  type: AppointmentType;
  // opcional: sfuRoomId, appointmentId...
};

export type RecommendedDoctor = {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  location: string;
  languages: string[];
  available: boolean;
};

export type RecentMessage = {
  id: number;
  fromName: string;
  preview: string;
  urgent?: boolean;
  createdAt: string;
};
