/**
 * Unit Tests for Zod Validation Schemas
 */

import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  registerSchema,
  createMedicalRecordSchema,
  submitVerificationSchema,
  reviewVerificationSchema,
  createAppointmentSchema,
  sendMessageSchema,
  fileUploadSchema,
} from '../validations';

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };

      expect(() => loginSchema.parse(validData)).not.toThrow();
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };

      expect(() => loginSchema.parse(invalidData)).toThrow();
    });

    it('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'short',
      };

      expect(() => loginSchema.parse(invalidData)).toThrow();
    });
  });

  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        Email: 'test@example.com',
        Password: 'Password123',
        PasswordConfirm: 'Password123',
        FirstName: 'John',
        LastName1: 'Doe',
      };

      expect(() => registerSchema.parse(validData)).not.toThrow();
    });

    it('should reject mismatched passwords', () => {
      const invalidData = {
        Email: 'test@example.com',
        Password: 'Password123',
        PasswordConfirm: 'DifferentPassword123',
        FirstName: 'John',
        LastName1: 'Doe',
      };

      expect(() => registerSchema.parse(invalidData)).toThrow();
    });

    it('should reject weak password', () => {
      const invalidData = {
        Email: 'test@example.com',
        Password: 'password',
        PasswordConfirm: 'password',
        FirstName: 'John',
        LastName1: 'Doe',
      };

      expect(() => registerSchema.parse(invalidData)).toThrow();
    });
  });

  describe('createMedicalRecordSchema', () => {
    it('should validate correct medical record data', () => {
      const validData = {
        PatientUserId: 123,
        Diagnosis: 'This is a valid diagnosis with sufficient length',
        Prescriptions: 'Valid prescription',
      };

      expect(() => createMedicalRecordSchema.parse(validData)).not.toThrow();
    });

    it('should reject diagnosis that is too short', () => {
      const invalidData = {
        PatientUserId: 123,
        Diagnosis: 'Short',
      };

      expect(() => createMedicalRecordSchema.parse(invalidData)).toThrow();
    });

    it('should accept optional fields', () => {
      const validData = {
        PatientUserId: 123,
      };

      expect(() => createMedicalRecordSchema.parse(validData)).not.toThrow();
    });
  });

  describe('submitVerificationSchema', () => {
    it('should validate correct verification submission', () => {
      const validData = {
        CertificationDocuments: [
          'https://example.com/doc1.pdf',
          'https://example.com/doc2.pdf',
        ],
        Notes: 'Valid notes',
      };

      expect(() => submitVerificationSchema.parse(validData)).not.toThrow();
    });

    it('should reject empty documents array', () => {
      const invalidData = {
        CertificationDocuments: [],
      };

      expect(() => submitVerificationSchema.parse(invalidData)).toThrow();
    });

    it('should reject more than 10 documents', () => {
      const invalidData = {
        CertificationDocuments: Array(11).fill('https://example.com/doc.pdf'),
      };

      expect(() => submitVerificationSchema.parse(invalidData)).toThrow();
    });
  });

  describe('reviewVerificationSchema', () => {
    it('should validate approval action', () => {
      const validData = {
        Action: 'approve' as const,
        AdminNotes: 'Approved',
      };

      expect(() => reviewVerificationSchema.parse(validData)).not.toThrow();
    });

    it('should validate rejection with reason', () => {
      const validData = {
        Action: 'reject' as const,
        RejectionReason: 'This is a valid rejection reason with sufficient length',
      };

      expect(() => reviewVerificationSchema.parse(validData)).not.toThrow();
    });

    it('should reject rejection without sufficient reason', () => {
      const invalidData = {
        Action: 'reject' as const,
        RejectionReason: 'Short',
      };

      expect(() => reviewVerificationSchema.parse(invalidData)).toThrow();
    });
  });

  describe('createAppointmentSchema', () => {
    it('should validate correct appointment data', () => {
      const validData = {
        patientUserId: 123,
        doctorUserId: 456,
        scheduledAt: '2025-10-27T10:00:00',
        durationMin: 30,
        modality: 'VIDEO' as const,
      };

      expect(() => createAppointmentSchema.parse(validData)).not.toThrow();
    });

    it('should reject invalid modality', () => {
      const invalidData = {
        patientUserId: 123,
        doctorUserId: 456,
        scheduledAt: '2025-10-27T10:00:00',
        durationMin: 30,
        modality: 'INVALID',
      };

      expect(() => createAppointmentSchema.parse(invalidData)).toThrow();
    });

    it('should reject duration less than 15 minutes', () => {
      const invalidData = {
        patientUserId: 123,
        doctorUserId: 456,
        scheduledAt: '2025-10-27T10:00:00',
        durationMin: 10,
        modality: 'VIDEO' as const,
      };

      expect(() => createAppointmentSchema.parse(invalidData)).toThrow();
    });
  });

  describe('sendMessageSchema', () => {
    it('should validate correct message data', () => {
      const validData = {
        conversationId: '123',
        content: 'Hello, this is a valid message',
      };

      expect(() => sendMessageSchema.parse(validData)).not.toThrow();
    });

    it('should reject empty message', () => {
      const invalidData = {
        conversationId: '123',
        content: '',
      };

      expect(() => sendMessageSchema.parse(invalidData)).toThrow();
    });

    it('should reject message that is too long', () => {
      const invalidData = {
        conversationId: '123',
        content: 'x'.repeat(5001),
      };

      expect(() => sendMessageSchema.parse(invalidData)).toThrow();
    });
  });
});
