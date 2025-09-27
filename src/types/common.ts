/**
 * Common types shared across the Telemedicina Global frontend.
 * Generated from SQL Server schema (columns inspected from screenshots).
 * All timestamps are ISO 8601 strings in UTC.
 */

export type Id = string & { readonly __brand: "Id" };
export type ISODate = string & { readonly __brand: "ISODate" }; // e.g., 2025-09-26T00:00:00Z
export type ISODateOnly = string & { readonly __brand: "ISODateOnly" }; // e.g., 2025-09-26 (date columns)
export type LanguageCode = string & { readonly __brand: "LanguageCode" }; // nvarchar(20/40)
export type CountryISO2 = string & { readonly __brand: "CountryISO2" }; // nchar(2)
export type CurrencyCode = string & { readonly __brand: "CurrencyCode" }; // nchar(3) typical

// Generic API shapes
export interface PageMeta {
  page: number; // 1-based
  perPage: number;
  totalItems: number;
  totalPages: number;
}
export interface Paginated<T> {
  data: T[];
  meta: PageMeta;
}

export interface ApiSuccess<T> { data: T; }
export interface ApiList<T> { data: T[]; }
export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
  traceId?: string;
}

// === Merged from existing common.ts ===
//Id

//ApiList
