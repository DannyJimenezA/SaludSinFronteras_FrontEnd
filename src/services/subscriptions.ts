/**
 * Subscriptions and Plans Service
 * Handles subscription management, plan listing, and limit checking
 */

import { api } from "../lib/api";
import type {
  SubscriptionPlan,
  UserSubscription,
  CreateSubscriptionPayload,
  CreateSubscriptionResponse,
  SubscriptionLimit,
  CancelSubscriptionResponse,
  SubscriptionHistory,
} from "../types/subscriptions";

/** ===== CONSTANTS ===== */
const PLANS_PATH = "/plans";
const CHECKOUT_PATH = "/subscriptions/checkout";
const MY_SUBSCRIPTION_PATH = "/subscriptions/me";
const SUBSCRIPTION_HISTORY_PATH = "/subscriptions/history";
const SUBSCRIPTION_LIMIT_PATH = "/subscriptions/appointment-limit";
const CANCEL_SUBSCRIPTION_PATH = "/subscriptions/cancel";

/** ===== HELPER: Map plan from backend (PascalCase) to frontend (camelCase) ===== */
function mapPlan(p: any): SubscriptionPlan {
  return {
    id: Number(p.Id || p.id),
    name: p.Name || p.name || "",
    description: p.Description || p.description,
    price: p.PriceCents ? p.PriceCents / 100 : (p.price || 0),
    priceCents: p.PriceCents || p.priceCents,
    currency: p.Currency || p.currency || "USD",
    maxAppointmentsPerMonth: p.MaxAppointments ?? p.maxAppointmentsPerMonth ?? 0,
    features: Array.isArray(p.FeaturesJson) ? p.FeaturesJson : (p.features || []),
    isActive: p.IsActive ?? p.isActive ?? true,
    createdAt: p.CreatedAt || p.createdAt,
  };
}

/** ===== HELPER: Map subscription from backend (PascalCase) to frontend (camelCase) ===== */
function mapSubscription(s: any): UserSubscription {
  return {
    id: s.Id || s.id,
    userId: s.UserId || s.userId,
    planId: s.PlanId || s.planId,
    startAt: s.StartAt || s.startAt,
    expiresAt: s.ExpiresAt || s.expiresAt,
    isActive: s.IsActive ?? s.isActive ?? false,
    autoRenew: s.AutoRenew ?? s.autoRenew ?? false,
    createdAt: s.CreatedAt || s.createdAt,
    updatedAt: s.UpdatedAt || s.updatedAt,
    plan: s.Plan ? mapPlan(s.Plan) : undefined,
  };
}

/** ===== LIST AVAILABLE PLANS ===== */
export async function listPlans(): Promise<SubscriptionPlan[]> {
  if (import.meta.env.DEV) {
    console.debug("[SUBSCRIPTIONS] listPlans");
  }

  try {
    const { data } = await api.get<any[]>(PLANS_PATH);
    const plans = Array.isArray(data) ? data : data?.data ?? [];
    return plans.map(mapPlan);
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ??
      err?.message ??
      "No se pudieron cargar los planes disponibles";

    throw new Error(String(msg));
  }
}

/** ===== CREATE SUBSCRIPTION (Checkout/Simulate) ===== */
export async function createSubscription(
  planId: number | string
): Promise<UserSubscription> {
  if (import.meta.env.DEV) {
    console.debug("[SUBSCRIPTIONS] createSubscription →", { planId });
  }

  try {
    // El backend espera PlanId y DurationMonths
    const payload = {
      PlanId: Number(planId),
      DurationMonths: 1, // Por defecto 1 mes
    };

    const { data } = await api.post<any>(CHECKOUT_PATH, payload);
    return mapSubscription(data);
  } catch (err: any) {
    const status = err?.response?.status;

    if (status === 400) {
      const msg = err?.response?.data?.message;
      if (Array.isArray(msg)) {
        throw new Error(msg.join(". "));
      }
      throw new Error(msg || "Datos de suscripción inválidos");
    }

    if (status === 404) {
      throw new Error("Plan de suscripción no encontrado");
    }

    if (status === 409) {
      throw new Error("Ya tienes una suscripción activa. Cancélala primero para cambiar de plan.");
    }

    const msg =
      err?.response?.data?.message ??
      err?.message ??
      "No se pudo crear la suscripción";

    throw new Error(String(msg));
  }
}

/** ===== GET MY ACTIVE SUBSCRIPTION ===== */
export async function getMySubscription(): Promise<UserSubscription> {
  if (import.meta.env.DEV) {
    console.debug("[SUBSCRIPTIONS] getMySubscription");
  }

  try {
    const { data } = await api.get<any>(MY_SUBSCRIPTION_PATH);
    return mapSubscription(data);
  } catch (err: any) {
    const status = err?.response?.status;

    if (status === 404) {
      // El backend debería asignar automáticamente el plan Basic
      // Si llegamos aquí, algo salió mal
      throw new Error("No se pudo obtener tu suscripción");
    }

    const msg =
      err?.response?.data?.message ??
      err?.message ??
      "No se pudo obtener tu suscripción";

    throw new Error(String(msg));
  }
}

/** ===== GET SUBSCRIPTION HISTORY ===== */
export async function getSubscriptionHistory(): Promise<SubscriptionHistory[]> {
  if (import.meta.env.DEV) {
    console.debug("[SUBSCRIPTIONS] getSubscriptionHistory");
  }

  try {
    const { data } = await api.get<SubscriptionHistory[]>(SUBSCRIPTION_HISTORY_PATH);
    return Array.isArray(data) ? data : data?.data ?? [];
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ??
      err?.message ??
      "No se pudo obtener el historial de suscripciones";

    throw new Error(String(msg));
  }
}

/** ===== CHECK APPOINTMENT LIMIT ===== */
export async function checkAppointmentLimit(): Promise<SubscriptionLimit> {
  if (import.meta.env.DEV) {
    console.debug("[SUBSCRIPTIONS] checkAppointmentLimit");
  }

  try {
    const { data } = await api.get<SubscriptionLimit>(SUBSCRIPTION_LIMIT_PATH);
    return data;
  } catch (err: any) {
    const status = err?.response?.status;

    if (status === 404) {
      // No hay suscripción activa - retornar límites de free tier o 0
      return {
        currentPeriodUsed: 0,
        currentPeriodLimit: 0,
        canBookMore: false,
      };
    }

    const msg =
      err?.response?.data?.message ??
      err?.message ??
      "No se pudo verificar el límite de citas";

    throw new Error(String(msg));
  }
}

/** ===== CANCEL SUBSCRIPTION ===== */
export async function cancelSubscription(): Promise<UserSubscription> {
  if (import.meta.env.DEV) {
    console.debug("[SUBSCRIPTIONS] cancelSubscription");
  }

  try {
    const { data } = await api.delete<any>(CANCEL_SUBSCRIPTION_PATH);
    return mapSubscription(data);
  } catch (err: any) {
    const status = err?.response?.status;

    if (status === 404) {
      throw new Error("No tienes una suscripción activa para cancelar");
    }

    if (status === 400) {
      const msg = err?.response?.data?.message;
      throw new Error(msg || "No se puede cancelar esta suscripción");
    }

    const msg =
      err?.response?.data?.message ??
      err?.message ??
      "No se pudo cancelar la suscripción";

    throw new Error(String(msg));
  }
}

/** ===== HELPER: Check if user can book more appointments ===== */
export async function canBookAppointment(): Promise<boolean> {
  try {
    const limit = await checkAppointmentLimit();
    return limit.canBookMore;
  } catch (err) {
    console.error("[SUBSCRIPTIONS] Error checking appointment limit:", err);
    return false;
  }
}

/** ===== HELPER: Get appointments remaining ===== */
export async function getAppointmentsRemaining(): Promise<number> {
  try {
    const limit = await checkAppointmentLimit();
    return Math.max(0, limit.currentPeriodLimit - limit.currentPeriodUsed);
  } catch (err) {
    console.error("[SUBSCRIPTIONS] Error getting remaining appointments:", err);
    return 0;
  }
}
