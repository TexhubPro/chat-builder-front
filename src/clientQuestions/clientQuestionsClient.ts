import { ApiError } from "../auth/authClient";
import { API_BASE_URL } from "../config/apiBaseUrl";

export type ClientQuestionStatus = "open" | "in_progress" | "answered" | "closed";
export type ClientQuestionBoard = "new" | "in_progress" | "completed";

export type ClientQuestionItem = {
  id: number;
  description: string;
  status: ClientQuestionStatus;
  board: ClientQuestionBoard;
  position: number;
  resolved_at: string | null;
  source_chat_id: number | null;
  source_channel: string | null;
  client: {
    id: number;
    name: string;
    phone: string;
    email: string | null;
  } | null;
  assistant: {
    id: number;
    name: string;
  } | null;
  created_at: string | null;
  updated_at: string | null;
};

type ClientQuestionsListResponse = {
  questions: ClientQuestionItem[];
};

type ClientQuestionUpdateResponse = {
  message: string;
  question: ClientQuestionItem;
};

type ClientQuestionDeleteResponse = {
  message: string;
};

export type ClientQuestionUpdatePayload = {
  description?: string;
  status?: ClientQuestionStatus;
  board?: ClientQuestionBoard;
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

export async function clientQuestionsListRequest(
  token: string,
): Promise<ClientQuestionsListResponse> {
  return request<ClientQuestionsListResponse>("/client-questions", token, {
    method: "GET",
  });
}

export async function clientQuestionUpdateRequest(
  token: string,
  questionId: number,
  payload: ClientQuestionUpdatePayload,
): Promise<ClientQuestionUpdateResponse> {
  return request<ClientQuestionUpdateResponse>(`/client-questions/${questionId}`, token, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function clientQuestionDeleteRequest(
  token: string,
  questionId: number,
): Promise<ClientQuestionDeleteResponse> {
  return request<ClientQuestionDeleteResponse>(`/client-questions/${questionId}`, token, {
    method: "DELETE",
  });
}
