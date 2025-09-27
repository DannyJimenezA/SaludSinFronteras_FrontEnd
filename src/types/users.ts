/**
 * Users, profiles, languages & identifications — based on dbo.Users, DoctorProfiles,
 * UserLanguages, UserIdentifications, IdentificationTypes, IdentificationPhotos
 */
import type { Id, ISODate, ISODateOnly, LanguageCode } from "./common";
import type { FileRef } from "./files";
import type { Country } from "./catalog";
import type { UserRole, UserStatus } from "./auth";

export type Gender = "male" | "female" | "other" | "undisclosed"; // Users.Gender (nvarchar 40)
export interface User {
  id: Id;                    // Users.Id (bigint → string)
  role: UserRole;            // Users.Role ADMIN | DOCTOR | PATIENT
  email: string;             // Users.Email
  phone?: string;            // Users.Phone
  phonePrefix?: string;      // Users.PhonePrefix
  fullName?: string;         // Users.FullName
  firstName1?: string;       // Users.FirstName1
  lastName1?: string;        // Users.LastName1
  lastName2?: string;        // Users.LastName2
  dateOfBirth?: ISODateOnly; // Users.DateOfBirth (date)
  gender?: string;           // Users.Gender (free text in DB; we normalize with Gender above where possible)
  primaryLanguage?: LanguageCode;   // Users.PrimaryLanguage
  nativeLanguage?: string | null;   // Users.NativeLanguage
  timezone?: string;         // Users.Timezone
  status: UserStatus;        // Users.Status
  countryId?: string;        // Users.CountryId (FK to Countries)
  nationalityCountryId?: string | null; // Users.NationalityCountryId
  residenceCountryId?: string | null;   // Users.ResidenceCountryId
  isActive: boolean;         // Users.IsActive (bit)
  createdAt: ISODate;        // Users.CreatedAt
  updatedAt: ISODate;        // Users.UpdatedAt
  // UI helpers
  avatarFileId?: string;
}

export interface DoctorProfile {
  userId: Id;                 // DoctorProfiles.UserId (PK/FK)
  licenseNumber?: string;     // DoctorProfiles.LicenseNumber
  licenseCountryId?: string;  // DoctorProfiles.LicenseCountryId (FK Countries)
  licenseValidUntil?: ISODateOnly; // date
  verificationStatus?: string;     // DoctorProfiles.VerificationStatus (nvarchar 40)
  medicalSchool?: string;     // nvarchar 320
  bio?: string;               // nvarchar(max)
  yearsExperience?: number;   // int
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface UserLanguage {
  id: Id;
  userId: Id;
  language: string;          // UserLanguages.Language (nvarchar 40)
  proficiency: string;       // UserLanguages.Proficiency (nvarchar 40)
}

export interface IdentificationType {
  id: Id;
  code: string;              // nvarchar 40
  name: string;              // nvarchar 40
  countryId?: string;        // FK Countries
  createdAt: ISODate;
}

export interface UserIdentification {
  id: Id;
  userId: Id;
  identificationTypeId: Id;
  number: string;            // nvarchar 40
  issuedCountryId?: string;  // FK Countries
  issuedAt?: ISODateOnly;    // date
  expiresAt?: ISODateOnly;   // date
  status?: string;           // nvarchar 40
  createdAt: ISODate;
  photos?: IdentificationPhoto[];
}

export interface IdentificationPhoto {
  id: Id;
  userIdentificationId: Id;
  side: string;              // nvarchar 40 ("front"/"back")
  fileId: Id;                // FK Files
  createdAt: ISODate;
  file?: FileRef;
}
