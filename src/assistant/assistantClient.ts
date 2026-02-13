import { ApiError } from "../auth/authClient";
import { API_BASE_URL } from "../config/apiBaseUrl";

export type AssistantTrigger = {
  trigger: string;
  response: string;
};

export type AssistantSettings = {
  triggers?: AssistantTrigger[];
};

export type AssistantInstructionFile = {
  id: number;
  original_name: string;
  mime_type: string | null;
  size: number | null;
  purpose: string;
  openai_file_id: string | null;
  url: string;
  created_at: string | null;
};

export type AssistantItem = {
  id: number;
  name: string;
  instructions: string | null;
  restrictions: string | null;
  conversation_tone: string;
  is_active: boolean;
  enable_file_search: boolean;
  enable_file_analysis: boolean;
  enable_voice: boolean;
  enable_web_search: boolean;
  openai_assistant_id: string | null;
  openai_vector_store_id: string | null;
  settings: AssistantSettings;
  instruction_files: AssistantInstructionFile[];
  created_at: string | null;
  updated_at: string | null;
};

export type AssistantLimits = {
  assistant_limit: number;
  has_active_subscription: boolean;
  subscription_status: string | null;
  current_assistants: number;
  active_assistants: number;
  can_create: boolean;
};

export type AssistantListResponse = {
  assistants: AssistantItem[];
  limits: AssistantLimits;
};

export type AssistantMutationPayload = {
  name: string;
  instructions?: string;
  restrictions?: string;
  conversation_tone?: string;
  enable_file_search?: boolean;
  enable_file_analysis?: boolean;
  enable_voice?: boolean;
  enable_web_search?: boolean;
  settings?: AssistantSettings;
};

export type AssistantMutationResponse = {
  message: string;
  warning?: string;
  assistant: AssistantItem;
  limits: AssistantLimits;
};

export type AssistantDeleteResponse = {
  message: string;
  warning?: string;
  limits: AssistantLimits;
};

export type AssistantFilesResponse = {
  message: string;
  warning?: string;
  assistant: AssistantItem;
  files?: AssistantInstructionFile[];
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
  const isFormDataBody =
    typeof FormData !== "undefined"
    && typeof init.body !== "undefined"
    && init.body instanceof FormData;

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (
    !isFormDataBody
    && typeof init.body !== "undefined"
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

export async function assistantsListRequest(token: string): Promise<AssistantListResponse> {
  return request<AssistantListResponse>("/assistants", token, {
    method: "GET",
  });
}

export async function assistantsCreateRequest(
  token: string,
  payload: AssistantMutationPayload,
): Promise<AssistantMutationResponse> {
  return request<AssistantMutationResponse>("/assistants", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function assistantsUpdateRequest(
  token: string,
  assistantId: number,
  payload: AssistantMutationPayload,
): Promise<AssistantMutationResponse> {
  return request<AssistantMutationResponse>(`/assistants/${assistantId}`, token, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function assistantsStartRequest(
  token: string,
  assistantId: number,
): Promise<AssistantMutationResponse> {
  return request<AssistantMutationResponse>(`/assistants/${assistantId}/start`, token, {
    method: "POST",
  });
}

export async function assistantsStopRequest(
  token: string,
  assistantId: number,
): Promise<AssistantMutationResponse> {
  return request<AssistantMutationResponse>(`/assistants/${assistantId}/stop`, token, {
    method: "POST",
  });
}

export async function assistantsDeleteRequest(
  token: string,
  assistantId: number,
): Promise<AssistantDeleteResponse> {
  return request<AssistantDeleteResponse>(`/assistants/${assistantId}`, token, {
    method: "DELETE",
  });
}

export async function assistantUploadFilesRequest(
  token: string,
  assistantId: number,
  files: File[],
): Promise<AssistantFilesResponse> {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files[]", file);
  });

  return request<AssistantFilesResponse>(
    `/assistants/${assistantId}/instruction-files`,
    token,
    {
      method: "POST",
      body: formData,
    },
  );
}

export async function assistantDeleteFileRequest(
  token: string,
  assistantId: number,
  fileId: number,
): Promise<AssistantFilesResponse> {
  return request<AssistantFilesResponse>(
    `/assistants/${assistantId}/instruction-files/${fileId}`,
    token,
    {
      method: "DELETE",
    },
  );
}
