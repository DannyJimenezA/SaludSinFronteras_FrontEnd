/**
 * Types for Medical Records (Historiales Médicos)
 * All sensitive fields (Diagnosis, Prescriptions, Recommendations) are encrypted with AES-256
 */

export interface MedicalRecord {
  RecordId: string;
  PatientUserId: string;
  DoctorUserId: string;
  AppointmentId?: string | null;
  Diagnosis?: string | null; // Encrypted
  Prescriptions?: string | null; // Encrypted
  Recommendations?: string | null; // Encrypted
  Files?: string[] | null;
  CreatedAt: string;
  UpdatedAt?: string;
  Doctor?: {
    FirstName: string;
    LastName1: string;
    LastName2?: string;
    LicenseNumber?: string;
  };
  Patient?: {
    FirstName: string;
    LastName1: string;
    LastName2?: string;
  };
}

export interface CreateMedicalRecordPayload {
  PatientUserId: number | string;
  AppointmentId?: number | string;
  Diagnosis?: string;
  Prescriptions?: string;
  Recommendations?: string;
  Files?: string[];
}

export interface UpdateMedicalRecordPayload {
  Diagnosis?: string;
  Prescriptions?: string;
  Recommendations?: string;
  Files?: string[];
}

export interface MedicalRecordListItem {
  RecordId: string;
  PatientUserId: string;
  DoctorUserId: string;
  AppointmentId?: string | null;
  Diagnosis?: string | null;
  CreatedAt: string;
  Doctor: {
    FirstName: string;
    LastName1: string;
    LicenseNumber?: string;
  };
}
