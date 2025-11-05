/**
 * Zod Validation Schemas
 * Centralized validation schemas for all forms
 */

import { z } from "zod";

/** ===== AUTH SCHEMAS ===== */

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Email inválido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const registerSchema = z.object({
  Email: z
    .string()
    .min(1, "El email es requerido")
    .email("Email inválido"),
  Password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    .regex(/[a-z]/, "Debe contener al menos una minúscula")
    .regex(/[0-9]/, "Debe contener al menos un número"),
  PasswordConfirm: z.string(),
  FirstName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  LastName1: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido no puede exceder 50 caracteres"),
  LastName2: z
    .string()
    .max(50, "El apellido no puede exceder 50 caracteres")
    .optional(),
  Phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Número de teléfono inválido")
    .optional()
    .or(z.literal("")),
  DateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)")
    .optional()
    .or(z.literal("")),
  Role: z.enum(["ADMIN", "DOCTOR", "PATIENT"]).optional(),
}).refine((data) => data.Password === data.PasswordConfirm, {
  message: "Las contraseñas no coinciden",
  path: ["PasswordConfirm"],
});

export const forgotPasswordSchema = z.object({
  Email: z
    .string()
    .min(1, "El email es requerido")
    .email("Email inválido"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token requerido"),
  newPassword: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    .regex(/[a-z]/, "Debe contener al menos una minúscula")
    .regex(/[0-9]/, "Debe contener al menos un número"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

/** ===== MEDICAL RECORDS SCHEMAS ===== */

export const createMedicalRecordSchema = z.object({
  PatientUserId: z
    .number()
    .int()
    .positive("ID de paciente debe ser positivo")
    .or(z.string().min(1, "ID de paciente requerido")),
  AppointmentId: z
    .number()
    .int()
    .positive()
    .optional()
    .or(z.string().optional()),
  Diagnosis: z
    .string()
    .min(10, "El diagnóstico debe tener al menos 10 caracteres")
    .max(5000, "El diagnóstico no puede exceder 5000 caracteres")
    .optional(),
  Prescriptions: z
    .string()
    .max(5000, "Las prescripciones no pueden exceder 5000 caracteres")
    .optional(),
  Recommendations: z
    .string()
    .max(5000, "Las recomendaciones no pueden exceder 5000 caracteres")
    .optional(),
  Files: z.array(z.string().url("URL de archivo inválida")).optional(),
});

export const updateMedicalRecordSchema = z.object({
  Diagnosis: z
    .string()
    .min(10, "El diagnóstico debe tener al menos 10 caracteres")
    .max(5000, "El diagnóstico no puede exceder 5000 caracteres")
    .optional(),
  Prescriptions: z
    .string()
    .max(5000, "Las prescripciones no pueden exceder 5000 caracteres")
    .optional(),
  Recommendations: z
    .string()
    .max(5000, "Las recomendaciones no pueden exceder 5000 caracteres")
    .optional(),
  Files: z.array(z.string().url()).optional(),
});

/** ===== VERIFICATION SCHEMAS ===== */

export const submitVerificationSchema = z.object({
  CertificationDocuments: z
    .array(z.string().url("URL de documento inválida"))
    .min(1, "Debe subir al menos 1 documento")
    .max(10, "Máximo 10 documentos permitidos"),
  Notes: z
    .string()
    .max(1000, "Las notas no pueden exceder 1000 caracteres")
    .optional(),
});

export const reviewVerificationSchema = z.object({
  Action: z.enum(["approve", "reject"], {
    errorMap: () => ({ message: "Acción debe ser 'approve' o 'reject'" }),
  }),
  AdminNotes: z
    .string()
    .max(1000, "Las notas del admin no pueden exceder 1000 caracteres")
    .optional(),
  RejectionReason: z.string().optional(),
}).refine(
  (data) => {
    // Si es reject, RejectionReason es requerido
    if (data.Action === "reject") {
      return data.RejectionReason && data.RejectionReason.length >= 10;
    }
    return true;
  },
  {
    message: "La razón de rechazo debe tener al menos 10 caracteres",
    path: ["RejectionReason"],
  }
);

/** ===== APPOINTMENT SCHEMAS ===== */

export const createAppointmentSchema = z.object({
  patientUserId: z
    .number()
    .int()
    .positive()
    .or(z.string().min(1)),
  doctorUserId: z
    .number()
    .int()
    .positive()
    .or(z.string().min(1)),
  scheduledAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/, "Fecha inválida (ISO 8601)"),
  durationMin: z
    .number()
    .int()
    .min(15, "La duración mínima es 15 minutos")
    .max(240, "La duración máxima es 240 minutos"),
  modality: z.enum(["VIDEO", "IN_PERSON", "PHONE"], {
    errorMap: () => ({ message: "Modalidad inválida" }),
  }),
  reason: z.string().max(500).optional(),
  notes: z.string().max(1000).optional(),
  slotId: z.number().int().optional().or(z.string().optional()),
});

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"], {
    errorMap: () => ({ message: "Estado inválido" }),
  }),
});

export const addAppointmentNoteSchema = z.object({
  content: z
    .string()
    .min(10, "La nota debe tener al menos 10 caracteres")
    .max(2000, "La nota no puede exceder 2000 caracteres"),
});

/** ===== SUBSCRIPTION SCHEMAS ===== */

export const createSubscriptionSchema = z.object({
  PlanId: z
    .number()
    .int()
    .positive()
    .or(z.string().min(1, "ID de plan requerido")),
  PaymentMethodId: z.string().optional(),
});

/** ===== MESSAGE SCHEMAS ===== */

export const sendMessageSchema = z.object({
  conversationId: z.string().min(1, "ID de conversación requerido"),
  content: z
    .string()
    .min(1, "El mensaje no puede estar vacío")
    .max(5000, "El mensaje no puede exceder 5000 caracteres"),
  language: z.string().optional(),
});

/** ===== FILE UPLOAD SCHEMAS ===== */

export const fileUploadSchema = z.object({
  file: z
    .instanceof(File, { message: "Archivo inválido" })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "El archivo no puede exceder 10MB",
    })
    .refine(
      (file) => {
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "application/pdf",
        ];
        return allowedTypes.includes(file.type);
      },
      {
        message: "Tipo de archivo no permitido. Solo JPG, PNG y PDF",
      }
    ),
});

/** ===== HELPER: Validate multiple files ===== */

export const multipleFilesSchema = z.object({
  files: z
    .array(z.instanceof(File))
    .min(1, "Debe seleccionar al menos 1 archivo")
    .max(10, "Máximo 10 archivos permitidos")
    .refine(
      (files) => files.every((file) => file.size <= 10 * 1024 * 1024),
      {
        message: "Cada archivo no puede exceder 10MB",
      }
    )
    .refine(
      (files) => {
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "application/pdf",
        ];
        return files.every((file) => allowedTypes.includes(file.type));
      },
      {
        message: "Tipo de archivo no permitido. Solo JPG, PNG y PDF",
      }
    ),
});

/** ===== TYPE INFERENCE ===== */

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type CreateMedicalRecordFormData = z.infer<typeof createMedicalRecordSchema>;
export type UpdateMedicalRecordFormData = z.infer<typeof updateMedicalRecordSchema>;
export type SubmitVerificationFormData = z.infer<typeof submitVerificationSchema>;
export type ReviewVerificationFormData = z.infer<typeof reviewVerificationSchema>;
export type CreateAppointmentFormData = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentStatusFormData = z.infer<typeof updateAppointmentStatusSchema>;
export type AddAppointmentNoteFormData = z.infer<typeof addAppointmentNoteSchema>;
export type CreateSubscriptionFormData = z.infer<typeof createSubscriptionSchema>;
export type SendMessageFormData = z.infer<typeof sendMessageSchema>;
export type FileUploadFormData = z.infer<typeof fileUploadSchema>;
export type MultipleFilesFormData = z.infer<typeof multipleFilesSchema>;
