/**
 * Doctor Verification Service
 * Handles doctor verification process (document submission, review, approval/rejection)
 *
 * Roles:
 * - DOCTOR: can submit documents and check their own status
 * - ADMIN: can review, approve, or reject verification requests
 */

import { api } from "../lib/api";
import type {
  DoctorVerification,
  SubmitVerificationPayload,
  ReviewVerificationPayload,
  PendingDoctorVerification,
  VerificationStatusResponse,
  VerificationResponseDto,
} from "../types/verification";

/** ===== CONSTANTS ===== */
const VERIFICATION_SUBMIT_PATH = "/verification/submit";
const VERIFICATION_STATUS_PATH = "/verification/status";
const VERIFICATION_PENDING_PATH = "/verification/pending";
const VERIFICATION_APPROVED_PATH = "/verification/approved";
const VERIFICATION_REJECTED_PATH = "/verification/rejected";
const VERIFICATION_DOCTOR_PATH = (doctorId: string) => `/verification/doctor/${doctorId}`;
const VERIFICATION_REVIEW_PATH = (doctorId: string) => `/verification/review/${doctorId}`;

/** ===== SUBMIT VERIFICATION DOCUMENTS (Doctor) ===== */
export async function submitVerification(
  payload: SubmitVerificationPayload
): Promise<DoctorVerification> {
  if (import.meta.env.DEV) {
    console.debug("[VERIFICATION] submitVerification →", {
      documentsCount: payload.CertificationDocuments.length,
      hasNotes: !!payload.Notes,
    });
  }

  // Validar que tenga al menos 1 documento y máximo 10
  if (
    !payload.CertificationDocuments ||
    payload.CertificationDocuments.length < 1 ||
    payload.CertificationDocuments.length > 10
  ) {
    throw new Error("Debes subir entre 1 y 10 documentos de certificación");
  }

  try {
    const { data } = await api.post<DoctorVerification>(
      VERIFICATION_SUBMIT_PATH,
      payload
    );
    return data;
  } catch (err: any) {
    const status = err?.response?.status;

    if (status === 403) {
      throw new Error("Solo los doctores pueden enviar documentos de verificación");
    }

    if (status === 400) {
      const msg = err?.response?.data?.message;
      if (Array.isArray(msg)) {
        throw new Error(msg.join(". "));
      }
      throw new Error(msg || "Datos de verificación inválidos");
    }

    const msg =
      err?.response?.data?.message ??
      err?.message ??
      "No se pudieron enviar los documentos de verificación";

    throw new Error(String(msg));
  }
}

/** ===== GET MY VERIFICATION STATUS (Doctor) ===== */
export async function getMyVerificationStatus(): Promise<VerificationStatusResponse> {
  if (import.meta.env.DEV) {
    console.debug("[VERIFICATION] getMyVerificationStatus");
  }

  try {
    const { data } = await api.get<VerificationStatusResponse>(VERIFICATION_STATUS_PATH);
    return data;
  } catch (err: any) {
    const status = err?.response?.status;

    if (status === 403) {
      throw new Error("Solo los doctores pueden consultar su estado de verificación");
    }

    if (status === 404) {
      // Si no hay verificación aún, retornar un objeto vacío con status null
      return {
        UserId: "",
        VerificationStatus: "pending",
        CertificationDocuments: [],
      };
    }

    const msg =
      err?.response?.data?.message ??
      err?.message ??
      "No se pudo obtener el estado de verificación";

    throw new Error(String(msg));
  }
}

/** ===== LIST PENDING VERIFICATIONS (Admin) ===== */
export async function listPendingVerifications(): Promise<PendingDoctorVerification[]> {
  if (import.meta.env.DEV) {
    console.debug("[VERIFICATION] listPendingVerifications (Admin)");
  }

  try {
    const { data } = await api.get<PendingDoctorVerification[]>(VERIFICATION_PENDING_PATH);
    return Array.isArray(data) ? data : [];
  } catch (err: any) {
    const status = err?.response?.status;

    if (status === 403) {
      throw new Error("Solo los administradores pueden ver verificaciones pendientes");
    }

    const msg =
      err?.response?.data?.message ??
      err?.message ??
      "No se pudieron cargar las verificaciones pendientes";

    throw new Error(String(msg));
  }
}

/** ===== LIST APPROVED VERIFICATIONS (Admin) ===== */
export async function listApprovedVerifications(): Promise<VerificationResponseDto[]> {
  if (import.meta.env.DEV) {
    console.debug("[VERIFICATION] listApprovedVerifications (Admin)");
  }

  try {
    const { data } = await api.get<VerificationResponseDto[]>(VERIFICATION_APPROVED_PATH);
    return Array.isArray(data) ? data : [];
  } catch (err: any) {
    const status = err?.response?.status;

    if (status === 403) {
      throw new Error("Solo los administradores pueden ver doctores verificados");
    }

    const msg =
      err?.response?.data?.message ??
      err?.message ??
      "No se pudieron cargar los doctores verificados";

    throw new Error(String(msg));
  }
}

/** ===== LIST REJECTED VERIFICATIONS (Admin) ===== */
export async function listRejectedVerifications(): Promise<VerificationResponseDto[]> {
  if (import.meta.env.DEV) {
    console.debug("[VERIFICATION] listRejectedVerifications (Admin)");
  }

  try {
    const { data } = await api.get<VerificationResponseDto[]>(VERIFICATION_REJECTED_PATH);
    return Array.isArray(data) ? data : [];
  } catch (err: any) {
    const status = err?.response?.status;

    if (status === 403) {
      throw new Error("Solo los administradores pueden ver doctores rechazados");
    }

    const msg =
      err?.response?.data?.message ??
      err?.message ??
      "No se pudieron cargar los doctores rechazados";

    throw new Error(String(msg));
  }
}

/** ===== GET VERIFICATION OF SPECIFIC DOCTOR (Admin) ===== */
export async function getDoctorVerification(
  doctorId: string
): Promise<VerificationStatusResponse> {
  if (import.meta.env.DEV) {
    console.debug("[VERIFICATION] getDoctorVerification (Admin) →", { doctorId });
  }

  try {
    const { data } = await api.get<VerificationStatusResponse>(
      VERIFICATION_DOCTOR_PATH(doctorId)
    );
    return data;
  } catch (err: any) {
    const status = err?.response?.status;

    if (status === 403) {
      throw new Error("Solo los administradores pueden ver verificaciones de doctores");
    }

    if (status === 404) {
      throw new Error("Doctor no encontrado o sin verificación");
    }

    const msg =
      err?.response?.data?.message ??
      err?.message ??
      "No se pudo obtener la verificación del doctor";

    throw new Error(String(msg));
  }
}

/** ===== REVIEW VERIFICATION (Approve/Reject) (Admin) ===== */
export async function reviewVerification(
  doctorId: string,
  payload: ReviewVerificationPayload
): Promise<DoctorVerification> {
  if (import.meta.env.DEV) {
    console.debug("[VERIFICATION] reviewVerification (Admin) →", {
      doctorId,
      action: payload.Action,
    });
  }

  // Validar que si es reject, tenga RejectionReason
  if (payload.Action === "reject" && !payload.RejectionReason) {
    throw new Error("Debes proporcionar una razón de rechazo");
  }

  try {
    const { data } = await api.post<DoctorVerification>(
      VERIFICATION_REVIEW_PATH(doctorId),
      payload
    );
    return data;
  } catch (err: any) {
    const status = err?.response?.status;

    if (status === 403) {
      throw new Error("Solo los administradores pueden revisar verificaciones");
    }

    if (status === 404) {
      throw new Error("Doctor o verificación no encontrada");
    }

    if (status === 400) {
      const msg = err?.response?.data?.message;
      if (Array.isArray(msg)) {
        throw new Error(msg.join(". "));
      }
      throw new Error(msg || "Datos de revisión inválidos");
    }

    const msg =
      err?.response?.data?.message ??
      err?.message ??
      "No se pudo procesar la revisión de verificación";

    throw new Error(String(msg));
  }
}

/** ===== APPROVE VERIFICATION (Helper) ===== */
export async function approveVerification(
  doctorId: string,
  adminNotes?: string
): Promise<DoctorVerification> {
  return reviewVerification(doctorId, {
    Action: "approve",
    AdminNotes: adminNotes,
  });
}

/** ===== REJECT VERIFICATION (Helper) ===== */
export async function rejectVerification(
  doctorId: string,
  rejectionReason: string,
  adminNotes?: string
): Promise<DoctorVerification> {
  return reviewVerification(doctorId, {
    Action: "reject",
    RejectionReason: rejectionReason,
    AdminNotes: adminNotes,
  });
}
