/**
 * React Query hooks for File Management
 * Re-exports from services/files.ts for consistency with architecture
 */

export {
  useFiles,
  useFile,
  useUploadFile,
  useDeleteFile,
  uploadFile,
  buildDownloadUrl,
} from '../services/files';

export type { FilesFilters } from '../services/files';
