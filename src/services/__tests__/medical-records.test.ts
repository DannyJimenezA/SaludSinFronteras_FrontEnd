/**
 * Unit Tests for Medical Records Service
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '../../lib/api';
import {
  createMedicalRecord,
  listPatientMedicalRecords,
  getMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
} from '../medical-records';

// Mock the api module
vi.mock('../../lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Medical Records Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createMedicalRecord', () => {
    it('should create a medical record successfully', async () => {
      const mockRecord = {
        RecordId: '1',
        PatientUserId: '123',
        DoctorUserId: '456',
        Diagnosis: 'Test diagnosis',
        Prescriptions: 'Test prescription',
        CreatedAt: new Date().toISOString(),
      };

      vi.mocked(api.post).mockResolvedValue({ data: mockRecord });

      const result = await createMedicalRecord({
        PatientUserId: 123,
        Diagnosis: 'Test diagnosis',
        Prescriptions: 'Test prescription',
      });

      expect(result).toEqual(mockRecord);
      expect(api.post).toHaveBeenCalledWith('/medical-records', {
        PatientUserId: 123,
        Diagnosis: 'Test diagnosis',
        Prescriptions: 'Test prescription',
      });
    });

    it('should throw error on 403 Forbidden', async () => {
      vi.mocked(api.post).mockRejectedValue({
        response: { status: 403 },
      });

      await expect(
        createMedicalRecord({ PatientUserId: 123 })
      ).rejects.toThrow('Solo los doctores pueden crear historiales médicos');
    });

    it('should throw error on 404 Not Found', async () => {
      vi.mocked(api.post).mockRejectedValue({
        response: { status: 404 },
      });

      await expect(
        createMedicalRecord({ PatientUserId: 123 })
      ).rejects.toThrow('Paciente o cita no encontrada');
    });
  });

  describe('listPatientMedicalRecords', () => {
    it('should list patient medical records', async () => {
      const mockRecords = [
        { RecordId: '1', PatientUserId: '123' },
        { RecordId: '2', PatientUserId: '123' },
      ];

      vi.mocked(api.get).mockResolvedValue({ data: mockRecords });

      const result = await listPatientMedicalRecords('123');

      expect(result).toEqual(mockRecords);
      expect(api.get).toHaveBeenCalledWith('/medical-records/patient/123');
    });

    it('should return empty array if no records', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: [] });

      const result = await listPatientMedicalRecords('123');

      expect(result).toEqual([]);
    });

    it('should throw error on 403 Forbidden', async () => {
      vi.mocked(api.get).mockRejectedValue({
        response: { status: 403 },
      });

      await expect(listPatientMedicalRecords('123')).rejects.toThrow(
        'No tienes permisos para ver estos historiales médicos'
      );
    });
  });

  describe('getMedicalRecord', () => {
    it('should get a specific medical record', async () => {
      const mockRecord = {
        RecordId: '1',
        PatientUserId: '123',
        Diagnosis: 'Test',
      };

      vi.mocked(api.get).mockResolvedValue({ data: mockRecord });

      const result = await getMedicalRecord('1');

      expect(result).toEqual(mockRecord);
      expect(api.get).toHaveBeenCalledWith('/medical-records/1');
    });
  });

  describe('updateMedicalRecord', () => {
    it('should update a medical record', async () => {
      const mockUpdated = {
        RecordId: '1',
        Diagnosis: 'Updated diagnosis',
      };

      vi.mocked(api.patch).mockResolvedValue({ data: mockUpdated });

      const result = await updateMedicalRecord('1', {
        Diagnosis: 'Updated diagnosis',
      });

      expect(result).toEqual(mockUpdated);
      expect(api.patch).toHaveBeenCalledWith('/medical-records/1', {
        Diagnosis: 'Updated diagnosis',
      });
    });

    it('should throw error when updating without permission', async () => {
      vi.mocked(api.patch).mockRejectedValue({
        response: { status: 403 },
      });

      await expect(
        updateMedicalRecord('1', { Diagnosis: 'Test' })
      ).rejects.toThrow('Solo puedes actualizar tus propios historiales médicos');
    });
  });

  describe('deleteMedicalRecord', () => {
    it('should delete a medical record', async () => {
      vi.mocked(api.delete).mockResolvedValue({});

      await expect(deleteMedicalRecord('1')).resolves.toBeUndefined();
      expect(api.delete).toHaveBeenCalledWith('/medical-records/1');
    });

    it('should throw error when deleting without permission', async () => {
      vi.mocked(api.delete).mockRejectedValue({
        response: { status: 403 },
      });

      await expect(deleteMedicalRecord('1')).rejects.toThrow(
        'No tienes permisos para eliminar este historial médico'
      );
    });
  });
});
