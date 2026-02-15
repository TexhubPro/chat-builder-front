import { ApiError } from "../auth/authClient";
import { API_BASE_URL } from "../config/apiBaseUrl";

export type EmployeeItem = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  status: boolean;
  company_id: number | null;
  page_access: string[];
  temporary_password_sent_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type EmployeesListResponse = {
  employees: EmployeeItem[];
  available_page_access: string[];
};

export type EmployeeCreatePayload = {
  name: string;
  email: string;
  phone: string;
  page_access: string[];
  status: boolean;
};

export type EmployeeUpdatePayload = EmployeeCreatePayload;

export type EmployeeMutationResponse = {
  message: string;
  employee: EmployeeItem;
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

export async function employeesListRequest(token: string): Promise<EmployeesListResponse> {
  return request<EmployeesListResponse>("/company/employees", token, {
    method: "GET",
  });
}

export async function employeeCreateRequest(
  token: string,
  payload: EmployeeCreatePayload,
): Promise<EmployeeMutationResponse> {
  return request<EmployeeMutationResponse>("/company/employees", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function employeeUpdateRequest(
  token: string,
  employeeId: number,
  payload: EmployeeUpdatePayload,
): Promise<EmployeeMutationResponse> {
  return request<EmployeeMutationResponse>(`/company/employees/${employeeId}`, token, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function employeeDeleteRequest(
  token: string,
  employeeId: number,
): Promise<{ message: string }> {
  return request<{ message: string }>(`/company/employees/${employeeId}`, token, {
    method: "DELETE",
  });
}
