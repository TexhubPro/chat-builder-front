import { ApiError } from "../auth/authClient";

export type ChatChannel = "instagram" | "telegram" | "widget" | "api";
export type ChatFilterChannel =
  | "all"
  | ChatChannel
  | "assistant";

export type ChatAssistant = {
  id: number;
  name: string;
  is_active: boolean;
};

export type ChatAssistantChannel = {
  id: number;
  name: string | null;
  channel: string;
};

export type ChatItem = {
  id: number;
  channel: string;
  channel_chat_id: string | null;
  channel_user_id: string | null;
  name: string | null;
  avatar: string | null;
  status: string;
  unread_count: number;
  last_message_preview: string | null;
  last_message_at: string | null;
  metadata: Record<string, unknown> | null;
  assistant: ChatAssistant | null;
  assistant_channel: ChatAssistantChannel | null;
  created_at: string | null;
  updated_at: string | null;
};

export type ChatMessageItem = {
  id: number;
  chat_id: number;
  assistant_id: number | null;
  sender_type: string;
  direction: string;
  status: string;
  channel_message_id: string | null;
  message_type: string;
  text: string | null;
  media_url: string | null;
  media_mime_type: string | null;
  media_size: number | null;
  link_url: string | null;
  attachments: unknown[] | null;
  payload: Record<string, unknown> | null;
  sent_at: string | null;
  delivered_at: string | null;
  read_at: string | null;
  failed_at: string | null;
  created_at: string | null;
};

export type ChatSubscriptionInfo = {
  has_active_subscription: boolean;
  status: string | null;
};

type ChatsListResponse = {
  chats: ChatItem[];
  assistants: ChatAssistant[];
  channel_counts: Record<string, number>;
  subscription: ChatSubscriptionInfo;
};

type ChatDetailsResponse = {
  chat: ChatItem;
  messages: ChatMessageItem[];
  assistants: ChatAssistant[];
  subscription: ChatSubscriptionInfo;
};

type ChatMutationResponse = {
  message: string;
  chat: ChatItem;
  chat_message?: ChatMessageItem;
  assistant_message?: ChatMessageItem | null;
};

type ChatAssistantReplyResponse = {
  message: string;
  assistant: {
    id: number;
    name: string;
  };
  chat: ChatItem;
  incoming_message: ChatMessageItem;
  assistant_message: ChatMessageItem;
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

async function request<T>(
  path: string,
  token: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers ?? {});
  const isFormDataBody =
    typeof FormData !== "undefined" && init.body instanceof FormData;

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (
    typeof init.body !== "undefined"
    && init.body !== null
    && !isFormDataBody
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

export async function chatsListRequest(
  token: string,
  params: {
    channel?: ChatFilterChannel;
    search?: string;
    limit?: number;
  } = {},
): Promise<ChatsListResponse> {
  const query = encodeQuery({
    channel: params.channel,
    search: params.search,
    limit: params.limit,
  });

  return request<ChatsListResponse>(`/chats${query}`, token, {
    method: "GET",
  });
}

export async function chatDetailsRequest(
  token: string,
  chatId: number,
  limit = 120,
): Promise<ChatDetailsResponse> {
  return request<ChatDetailsResponse>(
    `/chats/${chatId}${encodeQuery({ limit })}`,
    token,
    {
      method: "GET",
    },
  );
}

export async function chatMarkReadRequest(
  token: string,
  chatId: number,
): Promise<ChatMutationResponse> {
  return request<ChatMutationResponse>(`/chats/${chatId}/read`, token, {
    method: "POST",
  });
}

export async function chatSendMessageRequest(
  token: string,
  chatId: number,
  payload: {
    text?: string;
    sender_type?: "agent" | "assistant" | "system" | "customer";
    direction?: "inbound" | "outbound";
    message_type?: "text" | "image" | "video" | "voice" | "audio" | "link" | "file";
    file?: File;
  },
): Promise<ChatMutationResponse> {
  if (payload.file instanceof File) {
    const formData = new FormData();

    if (typeof payload.text === "string") {
      formData.set("text", payload.text);
    }

    if (typeof payload.sender_type === "string") {
      formData.set("sender_type", payload.sender_type);
    }

    if (typeof payload.direction === "string") {
      formData.set("direction", payload.direction);
    }

    if (typeof payload.message_type === "string") {
      formData.set("message_type", payload.message_type);
    }

    formData.set("file", payload.file);

    return request<ChatMutationResponse>(`/chats/${chatId}/messages`, token, {
      method: "POST",
      body: formData,
    });
  }

  return request<ChatMutationResponse>(`/chats/${chatId}/messages`, token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function chatAssistantReplyRequest(
  token: string,
  chatId: number,
  payload: {
    prompt: string;
    assistant_id?: number;
  },
): Promise<ChatAssistantReplyResponse> {
  return request<ChatAssistantReplyResponse>(`/chats/${chatId}/assistant-reply`, token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
