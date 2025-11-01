/**
 * Types for Doctor Verification
 */

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface DoctorVerification {
  UserId: string;
  VerificationStatus: VerificationStatus;
  CertificationDocuments: string[];
  Notes?: string | null;
  SubmittedAt?: string | null;
  AdminNotes?: string | null;
  RejectionReason?: string | null;
  VerifiedAt?: string | null;
  VerifiedByAdminId?: string | null;
}

export interface SubmitVerificationPayload {
  CertificationDocuments: string[]; // Array de 1-10 URLs de documentos
  Notes?: string;
}

export interface ReviewVerificationPayload {
  Action: 'approve' | 'reject';
  AdminNotes?: string;
  RejectionReason?: string; // Required if Action = 'reject'
}

export interface PendingDoctorVerification {
  UserId: string;
  DoctorName: string;
  Email: string;
  LicenseNumber?: string;
  SubmittedAt: string;
  DocumentsCount: number;
}

export interface VerificationStatusResponse {
  UserId: string;
  VerificationStatus: VerificationStatus;
  CertificationDocuments: string[];
  Notes?: string;
  SubmittedAt?: string;
  AdminNotes?: string;
  RejectionReason?: string;
  VerifiedAt?: string;
  VerifiedByAdminId?: string;
}
