/**
 * Types for Subscriptions and Plans
 */

export type PlanInterval = 'MONTHLY' | 'YEARLY';

export interface SubscriptionPlan {
  PlanId: string;
  Name: string;
  Description?: string;
  Price: number;
  Currency: string;
  Interval: PlanInterval;
  AppointmentsPerMonth: number;
  Features?: string[] | null;
  IsActive: boolean;
  CreatedAt: string;
}

export interface UserSubscription {
  SubscriptionId: string;
  UserId: string;
  PlanId: string;
  Status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PENDING';
  StartDate: string;
  EndDate?: string | null;
  NextBillingDate?: string | null;
  AppointmentsUsed: number;
  AppointmentsLimit: number;
  CreatedAt: string;
  Plan?: SubscriptionPlan;
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
