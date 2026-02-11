import { ApiError } from "../auth/authClient";

export type BillingPlan = {
  id: number;
  code: string;
  name: string;
  description: string | null;
  is_active: boolean;
  is_public: boolean;
  is_enterprise: boolean;
  billing_period_days: number;
  currency: string;
  price: string;
  included_chats: number;
  overage_chat_price: string;
  assistant_limit: number;
  integrations_per_channel_limit: number;
  features: Record<string, unknown> | null;
};

export type BillingUsage = {
  included_chats: number;
  used_chats: number;
  remaining_chats: number;
  overage_chats: number;
  overage_chat_price: string;
  assistant_limit: number;
  integrations_per_channel_limit: number;
};

type SubscriptionPlanRef = {
  id: number;
  code: string;
  name: string;
} | null;

export type BillingSubscription = {
  id: number;
  status: string;
  quantity: number;
  billing_cycle_days: number;
  starts_at: string | null;
  expires_at: string | null;
  renewal_due_at: string | null;
  paid_at: string | null;
  chat_count_current_period: number;
  plan: SubscriptionPlanRef;
};

export type BillingInvoice = {
  id: number;
  number: string;
  status: string;
  currency: string;
  total: string;
  amount_paid: string;
  due_at: string | null;
  paid_at: string | null;
  created_at: string;
};

type BillingPlansResponse = {
  plans: BillingPlan[];
};

type BillingSubscriptionResponse = {
  subscription: BillingSubscription | null;
  usage: BillingUsage | null;
};

type BillingInvoicesResponse = {
  invoices: BillingInvoice[];
};

export type CheckoutResponse = {
  message: string;
  subscription: BillingSubscription;
  usage: BillingUsage;
  invoice: BillingInvoice;
};

export type PayInvoiceResponse = {
  message: string;
  invoice: BillingInvoice;
  subscription: BillingSubscription | null;
};

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api").replace(
  /\/$/,
  "",
);

async function parseJson(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return null;
  }

  return response.json();
}

async function request<T>(path: string, token: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers ?? {});

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (
    typeof init.body !== "undefined"
    && init.body !== null
    && !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  const data = await parseJson(response);

  if (!response.ok) {
    const message =
      typeof data === "object"
      && data !== null
      && "message" in data
      && typeof data.message === "string"
        ? data.message
        : "Request failed.";

    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

export async function billingPlansRequest(token: string): Promise<BillingPlan[]> {
  const response = await request<BillingPlansResponse>("/billing/plans", token, { method: "GET" });

  return response.plans;
}

export async function billingSubscriptionRequest(token: string): Promise<{
  subscription: BillingSubscription | null;
  usage: BillingUsage | null;
}> {
  return request<BillingSubscriptionResponse>("/billing/subscription", token, {
    method: "GET",
  });
}

export async function billingInvoicesRequest(token: string): Promise<BillingInvoice[]> {
  const response = await request<BillingInvoicesResponse>("/billing/invoices", token, {
    method: "GET",
  });

  return response.invoices;
}

export async function billingCheckoutRequest(
  token: string,
  payload: { plan_code: string; quantity: number },
): Promise<CheckoutResponse> {
  return request<CheckoutResponse>("/billing/checkout", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function billingPayInvoiceRequest(
  token: string,
  invoiceId: number,
): Promise<PayInvoiceResponse> {
  return request<PayInvoiceResponse>(`/billing/invoices/${invoiceId}/pay`, token, {
    method: "POST",
  });
}
