/**
 * Medical Records Service
 * Handles CRUD operations for medical records (historiales médicos)
 *
 * IMPORTANT: Diagnosis, Prescriptions, and Recommendations are encrypted with AES-256 on the backend
 */

import { api } from "../lib/api";
import type {
  MedicalRecord,
  CreateMedicalRecordPayload,
  UpdateMedicalRecordPayload,
  MedicalRecordListItem,
} from "../types/medical-records";

/** ===== CONSTANTS ===== */
const MEDICAL_RECORDS_PATH = "/medical-records";
const PATIENT_RECORDS_PATH = (patientId: string) => `/medical-records/patient/${patientId}`;
const RECORD_DETAIL_PATH = (recordId: string) => `/medical-records/${recordId}`;

/** ===== CREATE MEDICAL RECORD (Doctor only) ===== */
export async function createMedicalRecord(
  payload: CreateMedicalRecordPayload
): Promise<MedicalRecord> {
  if (import.meta.env.DEV) {
    console.debug("[MEDICAL_RECORDS] createMedicalRecord →", {
      PatientUserId: payload.PatientUserId,
      AppointmentId: payload.AppointmentId,
      hasFiles: !!payload.Files?.length,
    });
  }

  try {
    const { data } = await api.post<MedicalRecord>(MEDICAL_RECORDS_PATH, payload);
    return data;
  } catch (err: any) {
    const status = err?.response?.status;

    if (status === 403) {
      throw new Error("Solo los doctores pueden crear historiales médicos");
    }

    if (status === 404) {
      throw new Error("Paciente o cita no encontrada");
    }

    if (status === 400) {
      const msg = err?.response?.data?.message;
      if (Array.isArray(msg)) {
        throw new Error(msg.join(". "));
      }
      throw new Error(msg || "Datos inválidos para crear historial médico");
    }

    const msg =
      err?.response?.data?.message ??
      err?.message ??
      "No se pudo crear el historial médico";

    throw new Error(String(msg));
  }
}

/** ===== LIST MEDICAL RECORDS OF A PATIENT ===== */
export async function listPatientMedicalRecords(
  patientId: string
): Promise<MedicalRecordListItem[]> {
  if (import.meta.env.DEV) {
    console.debug("[MEDICAL_RECORDS] listPatientMedicalRecords →", { patientId });
  }

  try {
    const { data } = await api.get<MedicalRecordListItem[]>(PATIENT_RECORDS_PATH(patientId));
    return Array.isArray(data) ? data : [];
  } catch (err: any) {
    const status = err?.response?.status;

    if (status === 403) {
      throw new Error("No tienes permisos para ver estos historiales médicos");
    }

    if (status === 404) {
      throw new Error("Paciente no encontrado");
    }

    const msg =
      err?.response?.data?.message ??
      err?.message ??
      "No se pudieron cargar los historiales médicos";

    throw new Error(String(msg));
  }
}

/** ===== GET MY MEDICAL RECORDS (Patient) ===== */
export async function getMyMedicalRecords(): Promise<MedicalRecordListItem[]> {
  if (import.meta.env.DEV) {
    console.debug("[MEDICAL_RECORDS] getMyMedicalRecords");
  }

  try {
    // Primero obtenemos el userId del usuario autenticado
    const { data: userData } = await api.get("/users/me");
    const userId = userData.UserId || userData.userId;

    if (!userId) {
      throw new Error("No se pudo obtener el ID del usuario");
    }

    return await listPatientMedicalRecords(userId);
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ??
      err?.message ??
      "No se pudieron cargar tus historiales médicos";

    throw new Error(String(msg));
  }
}

/** ===== GET MEDICAL RECORD BY ID ===== */
export async function getMedicalRecord(recordId: string): Promise<MedicalRecord> {
  if (import.meta.env.DEV) {
    console.debug("[MEDICAL_RECORDS] getMedicalRecord →", { recordId });
  }

  try {
    const { data } = await api.get<MedicalRecord>(RECORD_DETAIL_PATH(recordId));
    return data;
  } catch (err: any) {
    const status = err?.response?.status;

    if (status === 403) {
      throw new Error("No tienes permisos para ver este historial médico");
    }

    if (status === 404) {
      throw new Error("Historial médico no encontrado");
    }

    const msg =
      err?.response?.data?.message ??
      err?.message ??
      "No se pudo cargar el historial médico";

    throw new Error(String(msg));
  }
}

/** ===== UPDATE MEDICAL RECORD (Doctor only - own records) ===== */
export async function updateMedicalRecord(
  recordId: string,
  payload: UpdateMedicalRecordPayload
): Promise<MedicalRecord> {
  if (import.meta.env.DEV) {
    console.debug("[MEDICAL_RECORDS] updateMedicalRecord →", {
      recordId,
      hasFiles: !!payload.Files?.length,
    });
  }

  try {
    const { data } = await api.patch<MedicalRecord>(
      RECORD_DETAIL_PATH(recordId),
      payload
    );
    return data;
  } catch (err: any) {
    const status = err?.response?.status;

    if (status === 403) {
      throw new Error("Solo puedes actualizar tus propios historiales médicos");
    }

    if (status === 404) {
      throw new Error("Historial médico no encontrado");
    }

    if (status === 400) {
      const msg = err?.response?.data?.message;
      if (Array.isArray(msg)) {
        throw new Error(msg.join(". "));
      }
      throw new Error(msg || "Datos inválidos para actualizar historial médico");
    }

    const msg =
      err?.response?.data?.message ??
      err?.message ??
      "No se pudo actualizar el historial médico";

    throw new Error(String(msg));
  }
}

/** ===== DELETE MEDICAL RECORD (Admin or Doctor owner) ===== */
export async function deleteMedicalRecord(recordId: string): Promise<void> {
  if (import.meta.env.DEV) {
    console.debug("[MEDICAL_RECORDS] deleteMedicalRecord →", { recordId });
  }

  try {
    await api.delete(RECORD_DETAIL_PATH(recordId));
  } catch (err: any) {
    const status = err?.response?.status;

    if (status === 403) {
      throw new Error("No tienes permisos para eliminar este historial médico");
    }

    if (status === 404) {
      throw new Error("Historial médico no encontrado");
    }

    const msg =
      err?.response?.data?.message ??
      err?.message ??
      "No se pudo eliminar el historial médico";

    throw new Error(String(msg));
  }
}
