/**
 * services/billing.ts
 * Facturación / Suscripciones — rutas FAKE por ahora.
 *
 * Endpoints mínimos (proxy a PSP):
 *   POST /billing/payment-intent                      → crea intent (ej. Stripe) y retorna clientSecret
 *   GET  /billing/invoices?userId=me&page=&perPage=  → lista facturas del usuario (paginado)
 *
 * (Opcional futuro)
 *   POST /billing/subscriptions
 *   GET  /billing/subscriptions?userId=me
 */

import { api } from "../lib/api";
import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";
import type {
  PaymentIntent,
  Invoice,
  PSP,
  Subscription,
  InvoicesPage,
} from "../types/billing";

// ⚠️ RUTAS FAKE — cámbialas al conectar el backend real
const R = {
  PAYMENT_INTENT: "/billing/payment-intent",
  INVOICES: "/billing/invoices",
  SUBSCRIPTIONS: "/billing/subscriptions", // opcional
} as const;

export interface CreatePaymentIntentPayload {
  userId?: string;
  amount: number;            // centavos (ej. 5000 = $50.00)
  currency: string;          // 'USD' | 'MXN' | 'CRC'...
  description?: string;
  appointmentId?: string;    // si cobras por cita
  provider?: PSP;            // si manejas varios (default 'stripe' en BE)
  returnUrl?: string;        // para redirigir (Stripe)
  metadata?: Record<string, string>;
}

export interface ListInvoicesFilters {
  userId?: string; // 'me' por defecto en BE
  page?: number;   // 1-based
  perPage?: number;
}

export interface CreateSubscriptionPayload {
  userId?: string;
  planId: string;
  provider?: PSP;
  trialDays?: number;
  metadata?: Record<string, string>;
}

/** ——— Helpers de normalización ——— */
function normalizeInvoicesPage(raw: any, fallbackFilters?: ListInvoicesFilters): InvoicesPage {
  // Formatos soportados:
  // 1) { items, total, page, perPage, ... }
  if (raw?.items && typeof raw.total === "number") {
    const tp = raw.totalPages ?? Math.ceil(raw.total / Math.max(1, raw.perPage ?? 1));
    const p = raw.page ?? fallbackFilters?.page ?? 1;
    const pp = raw.perPage ?? fallbackFilters?.perPage ?? raw.items?.length ?? 0;
    return {
      items: raw.items as Invoice[],
      total: raw.total,
      page: p,
      perPage: pp,
      totalPages: tp,
      hasNext: p < tp,
      hasPrev: p > 1,
    };
  }

  // 2) Laravel-style: { data: Invoice[], meta: { total, current_page, per_page, last_page } }
  if (raw?.data && raw?.meta) {
    const items = raw.data as Invoice[];
    const total = Number(raw.meta.total ?? items.length);
    const page = Number(raw.meta.current_page ?? fallbackFilters?.page ?? 1);
    const perPage = Number(raw.meta.per_page ?? fallbackFilters?.perPage ?? items.length);
    const totalPages = Number(raw.meta.last_page ?? Math.ceil(total / Math.max(1, perPage)));
    return {
      items,
      total,
      page,
      perPage,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  // 3) Array directo: Invoice[]
  if (Array.isArray(raw)) {
    const items = raw as Invoice[];
    const page = fallbackFilters?.page ?? 1;
    const perPage = fallbackFilters?.perPage ?? items.length;
    const total = items.length; // sin total real del BE
    return {
      items,
      total,
      page,
      perPage,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    };
  }

  // 4) { data: Invoice[] }
  if (raw?.data && Array.isArray(raw.data)) {
    const items = raw.data as Invoice[];
    const page = fallbackFilters?.page ?? 1;
    const perPage = fallbackFilters?.perPage ?? items.length;
    const total = items.length;
    return {
      items,
      total,
      page,
      perPage,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    };
  }

  // Fallback vacío
  return {
    items: [],
    total: 0,
    page: fallbackFilters?.page ?? 1,
    perPage: fallbackFilters?.perPage ?? 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  };
}

/** ——— Funciones (promesa) ——— */
export async function createPaymentIntent(payload: CreatePaymentIntentPayload): Promise<PaymentIntent> {
  const res = await api.post(R.PAYMENT_INTENT, payload);
  const data = res?.data;
  return (data?.data ?? data) as PaymentIntent;
}

export async function listInvoices(filters?: ListInvoicesFilters): Promise<InvoicesPage> {
  const res = await api.get(R.INVOICES, { params: filters });
  const raw = res?.data;
  return normalizeInvoicesPage(raw, filters);
}

export async function createSubscription(payload: CreateSubscriptionPayload): Promise<Subscription> {
  const res = await api.post(R.SUBSCRIPTIONS, payload);
  const data = res?.data;
  return (data?.data ?? data) as Subscription;
}

export async function listSubscriptions(filters?: { userId?: string }): Promise<Subscription[]> {
  const res = await api.get(R.SUBSCRIPTIONS, { params: filters });
  const data = res?.data;
  return Array.isArray(data) ? data : (data?.data ?? []);
}

/** ——— Hooks React Query (v5) ——— */
// Reusar funciones en hooks (DRY)
export function useCreatePaymentIntent() {
  return useMutation({
    mutationKey: ["billing", "payment-intent"],
    mutationFn: createPaymentIntent,
  });
}

/**
 * Hook paginado para facturas
 * - `staleTime`: 2 min (no se considera stale rápidamente)
 * - `gcTime`: 10 min (mantén cache para regresar entre páginas sin re-fetch)
 * - `placeholderData: keepPreviousData` mantiene la página anterior mientras carga la nueva
 */
export function useInvoices(filters?: ListInvoicesFilters) {
  const qFilters = filters ?? undefined;
  return useQuery({
    queryKey: ["billing", "invoices", qFilters],
    queryFn: () => listInvoices(qFilters),
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateSubscription() {
  return useMutation({
    mutationKey: ["billing", "subscriptions", "create"],
    mutationFn: createSubscription,
  });
}

export function useSubscriptions(filters?: { userId?: string }) {
  const qFilters = filters ?? undefined;
  return useQuery({
    queryKey: ["billing", "subscriptions", qFilters],
    queryFn: () => listSubscriptions(qFilters),
    placeholderData: keepPreviousData,
    // Opcionalmente también puedes cachear más tiempo:
    gcTime: 10 * 60 * 1000,
  });
}
