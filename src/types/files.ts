/**
 * File storage references — based on dbo.Files
 */
import type { Id, ISODate } from "./common";

export interface FileRef {
  id: Id;             // Files.Id (bigint → string)
  ownerUserId: Id;    // Files.OwnerUserId
  storageUrl: string; // Files.StorageUrl (nvarchar 1024)
  mimeType: string;   // Files.MimeType (nvarchar 200)
  sizeBytes: number;  // Files.SizeBytes (bigint)
  checksum?: string;  // Files.Checksum (nvarchar 256)
  createdAt: ISODate; // Files.CreatedAt (datetime2)
}
