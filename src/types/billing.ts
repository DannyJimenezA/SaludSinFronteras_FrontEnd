/**
 * types/billing.ts
 * Tipos mínimos para cobro con PSP (Stripe/PayPal) y facturas.
 */
import type { Id, ISODate } from "./common";

export type PSP = "stripe" | "paypal" | "adyen" | "mercadopago" | "custom";

export interface PaymentIntent {
  id: Id;                       // id interno del BE
  provider: PSP;                // 'stripe', 'paypal', ...
  providerIntentId?: string;    // id en el PSP
  clientSecret?: string;        // p.ej. Stripe
  amount: number;               // en centavos (5000 = $50.00)
  currency: string;             // 'USD', 'MXN', 'CRC', ...
  status:
    | "requires_payment_method"
    | "requires_confirmation"
    | "processing"
    | "succeeded"
    | "canceled"
    | string;
  metadata?: Record<string, string>;
  createdAt: ISODate;
}

export interface Invoice {
  id: Id;
  userId: Id;
  amountTotal: number;          // en centavos
  currency: string;
  status:
    | "draft"
    | "open"
    | "paid"
    | "void"
    | "uncollectible"
    | "refunded"
    | string;
  provider: PSP;
  providerInvoiceId?: string;
  pdfUrl?: string | null;       // url directa o presignada
  createdAt: ISODate;
  dueAt?: ISODate | null;
  appointmentId?: Id | null;
  description?: string | null;
}

/** Opcional si más adelante manejas planes */
export interface Subscription {
  id: Id;
  userId: Id;
  provider: PSP;
  providerSubId?: string;
  status:
    | "active"
    | "trialing"
    | "past_due"
    | "canceled"
    | "incomplete"
    | "paused"
    | string;
  currentPeriodEnd?: ISODate | null;
  planId?: Id | null;
  createdAt: ISODate;
}

/** Paginación tipada para facturas */
export interface InvoicesPage {
  items: Invoice[];
  total: number;
  page: number;
  perPage: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}
