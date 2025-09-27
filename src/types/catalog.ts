/**
 * Catalog-like data — Countries, Specialties, Drugs, ActiveIngredients, CountryDrugs
 */
import type { Id, ISODate, CountryISO2, CurrencyCode } from "./common";

export interface Country {
  id: Id;              // Countries.Id
  iso2: CountryISO2;   // Countries.Iso2 (nchar 2)
  name: string;        // Countries.Name (nvarchar 240)
  currency?: CurrencyCode; // Countries.Currency (nchar)
  regulatoryNotes?: string; // Countries.RegulatoryNotes (nvarchar max)
}

export interface Specialty {
  id: Id;
  name: string;        // nvarchar 240
}

export interface ActiveIngredient {
  id: Id;
  name: string;        // nvarchar 320
}

export interface Drug {
  id: Id;
  brandName: string;           // nvarchar 320
  form?: string;               // nvarchar (likely short code)
  strength?: string;           // nvarchar 120
  activeIngredientId?: Id;     // FK to ActiveIngredients
}

export interface CountryDrug {
  id: Id;
  countryId: Id;               // FK Countries
  drugId: Id;                  // FK Drugs
  localBrand?: string;         // nvarchar 320
  otc?: boolean | null;        // bit (nullable)
  rxRequired?: boolean | null; // bit (nullable)
}
