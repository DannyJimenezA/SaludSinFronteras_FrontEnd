import { ReactNode } from "react";

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
