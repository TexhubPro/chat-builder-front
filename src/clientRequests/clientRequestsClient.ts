import { ApiError } from "../auth/authClient";
import { API_BASE_URL } from "../config/apiBaseUrl";

export type ClientRequestStatus =
  | "new"
  | "in_progress"
  | "appointments"
  | "completed"
  | "confirmed"
  | "canceled"
  | "handed_to_courier"
  | "delivered";
export type ClientRequestBoard = "new" | "in_progress" | "appointments" | "completed";

export type ClientRequestItem = {
  id: number;
  client: {
    id: number | null;
    name: string;
    phone: string;
    email: string | null;
  };
  assistant: {
    id: number;
    name: string;
  } | null;
  service_name: string;
  address: string;
  amount: number;
  currency: string;
  note: string;
  status: ClientRequestStatus;
  board: ClientRequestBoard;
  appointment: {
    calendar_event_id: number;
    starts_at: string;
    ends_at: string | null;
    timezone: string;
    duration_minutes: number | null;
  } | null;
  source_chat_id: number | null;
  source_channel: string | null;
  chat_message_id: number | null;
  ordered_at: string | null;
  completed_at: string | null;
  updated_at: string | null;
  created_at: string | null;
};

type ClientRequestsListResponse = {
  appointments_enabled: boolean;
  delivery_enabled: boolean;
  requests: ClientRequestItem[];
};

type ClientRequestUpdateResponse = {
  message: string;
  request: ClientRequestItem;
};

type ClientRequestDeleteResponse = {
  message: string;
};

export type ClientRequestUpdatePayload = {
  status?: ClientRequestStatus;
  client_name?: string;
  phone?: string;
  service_name?: string;
  address?: string;
  amount?: number;
  note?: string;
  book_appointment?: boolean;
  appointment_date?: string;
  appointment_time?: string;
  appointment_duration_minutes?: number;
  clear_appointment?: boolean;
  archived?: boolean;
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

export async function clientRequestsListRequest(
  token: string,
): Promise<ClientRequestsListResponse> {
  return request<ClientRequestsListResponse>("/client-requests", token, {
    method: "GET",
  });
}

export async function clientRequestUpdateRequest(
  token: string,
  requestId: number,
  payload: ClientRequestUpdatePayload,
): Promise<ClientRequestUpdateResponse> {
  return request<ClientRequestUpdateResponse>(`/client-requests/${requestId}`, token, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function clientRequestDeleteRequest(
  token: string,
  requestId: number,
): Promise<ClientRequestDeleteResponse> {
  return request<ClientRequestDeleteResponse>(`/client-requests/${requestId}`, token, {
    method: "DELETE",
  });
}
