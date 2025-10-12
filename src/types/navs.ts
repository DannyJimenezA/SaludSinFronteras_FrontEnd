// Pantallas válidas
export type Screen =
  | "welcome"
  | "patient-dashboard"
  | "doctor-dashboard"
  | "admin-panel"
  | "appointments"
  | "search-doctors"
  | "video-call"
  | "history"
  | "settings"
  | "payments"
  | "prescriptions";

// Parámetros opcionales para navegación contextual
export type NavParams = {
  doctorId?: number | string;
  dateISO?: string;
  [k: string]: unknown;
};

// Firma que usaremos en TODOS los componentes
export type NavigateFn = (screen: Screen, params?: NavParams) => void;
