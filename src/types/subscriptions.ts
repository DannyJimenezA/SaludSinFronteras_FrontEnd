/**
 * Types for Subscriptions and Plans
 */

export type PlanInterval = 'MONTHLY' | 'YEARLY';

// Tipo para el plan tal como lo devuelve el backend
export interface SubscriptionPlan {
  id: number;
  name: string;
  description?: string;
  price: number; // Precio en dólares (convertido de centavos)
  priceCents?: number; // Precio en centavos
  currency: string;
  maxAppointmentsPerMonth: number; // -1 = ilimitado
  features?: string[];
  isActive: boolean;
  createdAt?: string;
}

// Tipo para la suscripción del usuario tal como lo devuelve el backend
export interface UserSubscription {
  id: string | number;
  userId: string | number;
  planId: string | number;
  startAt: string;
  expiresAt?: string | null;
  isActive: boolean;
  autoRenew: boolean;
  createdAt?: string;
  updatedAt?: string;
  plan?: SubscriptionPlan;
}

export interface CreateSubscriptionPayload {
  PlanId: string | number;
  PaymentMethodId?: string;
}

export interface CreateSubscriptionResponse {
  SubscriptionId: string;
  UserId: string;
  PlanId: string;
  Status: string;
  StartDate: string;
  NextBillingDate?: string;
  message: string;
}

export interface SubscriptionLimit {
  currentPeriodUsed: number;
  currentPeriodLimit: number;
  canBookMore: boolean;
  resetDate?: string;
}

export interface CancelSubscriptionResponse {
  message: string;
  SubscriptionId: string;
  CancelledAt: string;
}

export interface SubscriptionHistory {
  SubscriptionId: string;
  PlanName: string;
  Status: string;
  StartDate: string;
  EndDate?: string;
  TotalPaid?: number;
  Currency?: string;
}
