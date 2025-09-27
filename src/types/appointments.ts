/**
 * Appointments, notes and availability — based on dbo.Appointments, dbo.AppointmentNotes, dbo.AvailabilitySlots
 */
import type { Id, ISODate } from "./common";

export type AppointmentStatus = "PENDING" | "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW" | "RESCHEDULED"; // Appointments.Status (nvarchar 40) — adjust to real values
export type AppointmentModality = "VIDEO" | "IN_PERSON" | "PHONE"; // Appointments.Modality (nvarchar 20)

export interface Appointment {
  id: Id;                 // Appointments.Id
  patientUserId: Id;      // Appointments.PatientUserId
  doctorUserId: Id;       // Appointments.DoctorUserId
  status: string;         // keep flexible; UI can narrow using AppointmentStatus
  scheduledAt?: ISODate;  // Appointments.ScheduledAt
  durationMin?: number;   // Appointments.DurationMin
  modality?: string;      // Appointments.Modality
  sfuRoomId?: string;     // Appointments.SfuRoomId
  createdByUserId: Id;    // Appointments.CreatedByUserId
  createdAt: ISODate;     // Appointments.CreatedAt
  updatedAt: ISODate;     // Appointments.UpdatedAt
}

export interface AppointmentNote {
  id: Id;                 // AppointmentNotes.Id
  appointmentId: Id;     // AppointmentNotes.AppointmentId
  doctorUserId: Id;      // AppointmentNotes.DoctorUserId
  content: string;       // nvarchar(max)
  createdAt: ISODate;    // datetime2
}

export interface AvailabilitySlot {
  id: Id;                // AvailabilitySlots.Id
  doctorUserId: Id;      // AvailabilitySlots.DoctorUserId
  startAt: ISODate;      // AvailabilitySlots.StartAt
  endAt: ISODate;        // AvailabilitySlots.EndAt
  isRecurring: boolean;  // AvailabilitySlots.IsRecurring (bit)
  rrule?: string;        // AvailabilitySlots.RRule (nvarchar max) — RFC 5545
  createdAt: ISODate;
  updatedAt: ISODate;
}
