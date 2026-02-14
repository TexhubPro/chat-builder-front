import { ApiError } from "../auth/authClient";
import { API_BASE_URL } from "../config/apiBaseUrl";

export type ClientBaseStatus = "active" | "archived" | "blocked";
export type ClientBaseStatusFilter = "all" | ClientBaseStatus;

export type ClientBaseItem = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  status: ClientBaseStatus;
  avatar: string | null;
  stats: {
    orders_count: number;
    appointments_count: number;
    tasks_count: number;
    questions_count: number;
    total_spent: number;
    currency: string;
  };
  activity: {
    last_ordered_at: string | null;
    last_appointment_at: string | null;
    last_task_at: string | null;
    last_question_at: string | null;
    last_contact_at: string | null;
  };
  created_at: string | null;
  updated_at: string | null;
};

export type ClientBaseDetails = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  status: ClientBaseStatus;
  avatar: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string | null;
  updated_at: string | null;
};

export type ClientBaseOrderHistoryItem = {
  id: number;
  service_name: string;
  status: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  currency: string;
  notes: string | null;
  address: string | null;
  phone: string | null;
  ordered_at: string | null;
  completed_at: string | null;
  created_at: string | null;
};

export type ClientBaseAppointmentHistoryItem = {
  id: number;
  title: string;
  description: string | null;
  status: string;
  starts_at: string | null;
  ends_at: string | null;
  timezone: string;
  location: string | null;
  meeting_link: string | null;
  created_at: string | null;
};

export type ClientBaseTaskHistoryItem = {
  id: number;
  description: string;
  status: string;
  board_column: string;
  priority: string;
  sync_with_calendar: boolean;
  scheduled_at: string | null;
  due_at: string | null;
  completed_at: string | null;
  created_at: string | null;
};

export type ClientBaseQuestionHistoryItem = {
  id: number;
  description: string;
  status: string;
  board_column: string;
  resolved_at: string | null;
  created_at: string | null;
};

export type ClientBaseTimelineItem = {
  type: "order" | "appointment" | "task" | "question" | string;
  id: number;
  title: string;
  description: string | null;
  status: string | null;
  happened_at: string | null;
  created_at: string | null;
  amount?: number;
  currency?: string;
};

type ClientBaseListResponse = {
  clients: ClientBaseItem[];
  counts: {
    all: number;
    active: number;
    archived: number;
    blocked: number;
  };
};

type ClientBaseDetailsResponse = {
  client: ClientBaseDetails;
  history: {
    orders: ClientBaseOrderHistoryItem[];
    appointments: ClientBaseAppointmentHistoryItem[];
    tasks: ClientBaseTaskHistoryItem[];
    questions: ClientBaseQuestionHistoryItem[];
    timeline: ClientBaseTimelineItem[];
  };
};

async function parseJson(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return null;
  }

  return response.json();
}

async function request<T>(
  path: string,
  token: string,
  init: RequestInit = {},
): Promise<T> {
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

function queryEncode(params: Record<string, string | number | undefined>): string {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === "undefined") {
      return;
    }

    query.set(key, String(value));
  });

  const encoded = query.toString();

  return encoded === "" ? "" : `?${encoded}`;
}

export async function clientBaseListRequest(
  token: string,
  params: {
    search?: string;
    status?: ClientBaseStatusFilter;
    limit?: number;
  } = {},
): Promise<ClientBaseListResponse> {
  return request<ClientBaseListResponse>(
    `/client-base${queryEncode({
      search: params.search,
      status: params.status && params.status !== "all" ? params.status : undefined,
      limit: params.limit,
    })}`,
    token,
    {
      method: "GET",
    },
  );
}

export async function clientBaseDetailsRequest(
  token: string,
  clientId: number,
): Promise<ClientBaseDetailsResponse> {
  return request<ClientBaseDetailsResponse>(`/client-base/${clientId}`, token, {
    method: "GET",
  });
}
