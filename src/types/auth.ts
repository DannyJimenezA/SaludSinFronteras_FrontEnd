/**
 * Auth-related types.
 */
import type { ISODate } from "./common";

export type UserRole = "PATIENT" | "DOCTOR" | "ADMIN"; // from Users.Role (nvarchar(40))
export type UserStatus = "ACTIVE" | "INVITED" | "PENDING" | "SUSPENDED" | "DELETED"; // from Users.Status (nvarchar(40)), adjust to actual values

export interface SessionInfo {
  accessToken: string;
  refreshToken?: string;
  expiresAt: ISODate;
}

// === Merged from existing auth.ts ===
export type LoginDto = { email: string; password: string };

export type AuthResult = { token?: string; userId: number; role: string };