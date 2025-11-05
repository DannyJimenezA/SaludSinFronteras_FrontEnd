// Lista de países más comunes en América Latina y otros
export const COUNTRIES = [
  { id: "1", name: "Costa Rica", code: "CR" },
  { id: "2", name: "México", code: "MX" },
  { id: "3", name: "Guatemala", code: "GT" },
  { id: "4", name: "Honduras", code: "HN" },
  { id: "5", name: "El Salvador", code: "SV" },
  { id: "6", name: "Nicaragua", code: "NI" },
  { id: "7", name: "Panamá", code: "PA" },
  { id: "8", name: "Colombia", code: "CO" },
  { id: "9", name: "Venezuela", code: "VE" },
  { id: "10", name: "Ecuador", code: "EC" },
  { id: "11", name: "Perú", code: "PE" },
  { id: "12", name: "Bolivia", code: "BO" },
  { id: "13", name: "Chile", code: "CL" },
  { id: "14", name: "Argentina", code: "AR" },
  { id: "15", name: "Uruguay", code: "UY" },
  { id: "16", name: "Paraguay", code: "PY" },
  { id: "17", name: "Brasil", code: "BR" },
  { id: "18", name: "Cuba", code: "CU" },
  { id: "19", name: "República Dominicana", code: "DO" },
  { id: "20", name: "Puerto Rico", code: "PR" },
  { id: "21", name: "Estados Unidos", code: "US" },
  { id: "22", name: "Canadá", code: "CA" },
  { id: "23", name: "España", code: "ES" },
  { id: "24", name: "Portugal", code: "PT" },
  { id: "25", name: "Francia", code: "FR" },
  { id: "26", name: "Italia", code: "IT" },
  { id: "27", name: "Alemania", code: "DE" },
  { id: "28", name: "Reino Unido", code: "GB" },
  { id: "29", name: "China", code: "CN" },
  { id: "30", name: "Japón", code: "JP" },
  { id: "31", name: "Corea del Sur", code: "KR" },
  { id: "32", name: "India", code: "IN" },
  { id: "33", name: "Australia", code: "AU" },
  { id: "34", name: "Nueva Zelanda", code: "NZ" },
  { id: "35", name: "Rusia", code: "RU" },
  { id: "36", name: "Otro", code: "XX" },
];

export function getCountryById(id: string | number | null | undefined): string {
  if (!id) return "";
  const country = COUNTRIES.find(c => c.id === String(id));
  return country?.name ?? "";
}

export function getCountryByCode(code: string | null | undefined): string {
  if (!code) return "";
  const country = COUNTRIES.find(c => c.code === code);
  return country?.name ?? "";
}
