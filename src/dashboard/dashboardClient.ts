import { ApiError } from "../auth/authClient";
import { API_BASE_URL } from "../config/apiBaseUrl";

export type DashboardOverviewResponse = {
  company: {
    id: number;
    name: string;
    currency: string;
    timezone: string;
  };
  kpis: {
    total_chats: number;
    total_messages: number;
    total_clients: number;
    revenue_current_month: string;
    automation_rate_percent: number;
  };
  limits: {
    included_chats: number;
    used_chats: number;
    remaining_chats: number;
    overage_chats: number;
    usage_percent: number;
    assistant_limit: number;
    integrations_per_channel_limit: number;
    overage_chat_price: string;
  };
  subscription: {
    status: string | null;
    plan: {
      id: number;
      code: string;
      name: string;
      price: string;
      currency: string;
      billing_period_days: number;
    } | null;
    expires_at: string | null;
    renewal_due_at: string | null;
  };
  chats: {
    unread_messages: number;
    messages_today: number;
    active_chats_today: number;
    messages_last_7_days: Array<{
      date: string;
      count: number;
    }>;
    status_breakdown: {
      open: number;
      pending: number;
      closed: number;
      archived: number;
    };
    channel_breakdown: Array<{
      channel: string;
      chats: number;
      messages: number;
    }>;
  };
  revenue: {
    currency: string;
    current_month_paid: string;
    previous_month_paid: string;
    pending_amount: string;
    growth_percent: number | null;
    history_last_6_months: Array<{
      month: string;
      amount: string;
    }>;
  };
  catalog: {
    assistants_total: number;
    assistants_active: number;
    services_total: number;
    services_active: number;
    products_total: number;
    products_active: number;
    average_service_price: string;
    average_product_price: string;
    top_services: Array<{
      id: number;
      name: string;
      orders_count: number;
      revenue: string;
    }>;
  };
  operations: {
    orders: {
      new: number;
      in_progress: number;
      appointments: number;
      confirmed: number;
      handed_to_courier: number;
      delivered: number;
      completed: number;
      canceled: number;
    };
    questions: {
      open: number;
      in_progress: number;
      answered: number;
      closed: number;
    };
    upcoming_appointments_7d: number;
  };
};

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

export async function dashboardOverviewRequest(token: string): Promise<DashboardOverviewResponse> {
  return request<DashboardOverviewResponse>("/dashboard/overview", token, {
    method: "GET",
  });
}
