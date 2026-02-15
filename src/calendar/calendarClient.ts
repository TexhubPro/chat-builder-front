import { ApiError } from "../auth/authClient";
import { API_BASE_URL } from "../config/apiBaseUrl";

export type CalendarWeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type CalendarEventStatus =
  | "scheduled"
  | "confirmed"
  | "completed"
  | "canceled"
  | "no_show";

export type CalendarDaySchedule = {
  is_day_off: boolean;
  start_time: string | null;
  end_time: string | null;
};

export type CalendarAssistant = {
  id: number;
  name: string;
};

export type CalendarService = {
  id: number;
  assistant_id: number | null;
  name: string;
};

export type CalendarClient = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
};

export type CalendarEventItem = {
  id: number;
  title: string;
  description: string | null;
  starts_at: string | null;
  ends_at: string | null;
  duration_minutes: number | null;
  timezone: string;
  status: CalendarEventStatus;
  location: string | null;
  meeting_link: string | null;
  assistant: CalendarAssistant | null;
  service: CalendarService | null;
  client: CalendarClient | null;
  metadata: Record<string, unknown> | null;
  created_at: string | null;
  updated_at: string | null;
};

type CalendarEventsListResponse = {
  appointments_enabled: boolean;
  timezone: string;
  slot_minutes: number;
  business_schedule: Record<CalendarWeekDay, CalendarDaySchedule>;
  assistants: CalendarAssistant[];
  services: CalendarService[];
  events: CalendarEventItem[];
};

type CalendarEventMutationResponse = {
  message: string;
  event: CalendarEventItem;
};

type CalendarEventDeleteResponse = {
  message: string;
};

export type CalendarEventUpsertPayload = {
  title: string;
  description?: string;
  date: string;
  time: string;
  duration_minutes: number;
  timezone?: string;
  status?: CalendarEventStatus;
  location?: string;
  meeting_link?: string;
  assistant_id?: number | null;
  assistant_service_id?: number | null;
  company_client_id?: number | null;
  client_name?: string;
  client_phone?: string;
  client_email?: string;
  client_notes?: string;
};

export type CalendarEventUpdatePayload = Partial<CalendarEventUpsertPayload>;

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

function encodeQuery(params: Record<string, string | number | undefined>): string {
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

export async function calendarEventsListRequest(
  token: string,
  params: {
    from?: string;
    to?: string;
    assistant_id?: number;
    status?: CalendarEventStatus;
  } = {},
): Promise<CalendarEventsListResponse> {
  const query = encodeQuery({
    from: params.from,
    to: params.to,
    assistant_id: params.assistant_id,
    status: params.status,
  });

  return request<CalendarEventsListResponse>(`/calendar/events${query}`, token, {
    method: "GET",
  });
}

export async function calendarEventCreateRequest(
  token: string,
  payload: CalendarEventUpsertPayload,
): Promise<CalendarEventMutationResponse> {
  return request<CalendarEventMutationResponse>("/calendar/events", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function calendarEventUpdateRequest(
  token: string,
  eventId: number,
  payload: CalendarEventUpdatePayload,
): Promise<CalendarEventMutationResponse> {
  return request<CalendarEventMutationResponse>(`/calendar/events/${eventId}`, token, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function calendarEventDeleteRequest(
  token: string,
  eventId: number,
): Promise<CalendarEventDeleteResponse> {
  return request<CalendarEventDeleteResponse>(`/calendar/events/${eventId}`, token, {
    method: "DELETE",
  });
}
