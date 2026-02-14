import { ApiError } from "../auth/authClient";
import { API_BASE_URL } from "../config/apiBaseUrl";

export type BusinessAccountType = "with_appointments" | "without_appointments";
export type BusinessWeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type BusinessDaySchedule = {
  is_day_off: boolean;
  start_time: string | null;
  end_time: string | null;
};

export type CompanyBusinessSettings = {
  account_type: BusinessAccountType;
  business: {
    address: string | null;
    timezone: string;
    currency: string;
    schedule: Record<BusinessWeekDay, BusinessDaySchedule>;
  };
  appointment: {
    enabled: boolean;
    slot_minutes: number;
    buffer_minutes: number;
    max_days_ahead: number;
    auto_confirm: boolean;
  };
  delivery: {
    enabled: boolean;
    require_delivery_address: boolean;
    require_delivery_datetime: boolean;
    default_eta_minutes: number;
    fee: number;
    free_from_amount: number | null;
    available_from: string;
    available_to: string;
    notes: string | null;
  };
  crm: {
    order_required_fields: Array<
      "client_name" | "phone" | "service_name" | "address" | "amount" | "note"
    >;
    appointment_required_fields: Array<
      | "client_name"
      | "phone"
      | "service_name"
      | "address"
      | "appointment_date"
      | "appointment_time"
      | "appointment_duration_minutes"
      | "amount"
      | "note"
    >;
  };
  ai: {
    response_languages: Array<"ru" | "en" | "tg" | "uz" | "tr" | "fa">;
  };
};

export type CompanyBusinessProfile = {
  id: number;
  name: string;
  slug: string | null;
  short_description: string | null;
  industry: string | null;
  primary_goal: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  status: string;
  settings: CompanyBusinessSettings;
  updated_at: string | null;
  created_at: string | null;
};

export type CompanySettingsResponse = {
  company: CompanyBusinessProfile;
};

export type UpdateCompanySettingsPayload = {
  name: string;
  short_description: string | null;
  industry: string | null;
  primary_goal: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  settings: CompanyBusinessSettings;
};

export type UpdateCompanySettingsResponse = {
  message: string;
  company: CompanyBusinessProfile;
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

export async function companySettingsRequest(
  token: string,
): Promise<CompanySettingsResponse> {
  return request<CompanySettingsResponse>("/company/settings", token, {
    method: "GET",
  });
}

export async function companySettingsUpdateRequest(
  token: string,
  payload: UpdateCompanySettingsPayload,
): Promise<UpdateCompanySettingsResponse> {
  return request<UpdateCompanySettingsResponse>("/company/settings", token, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
