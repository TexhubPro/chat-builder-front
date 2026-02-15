import { ApiError } from "../auth/authClient";
import { API_BASE_URL } from "../config/apiBaseUrl";

export type IntegrationAssistant = {
  id: number;
  name: string;
  is_active: boolean;
};

export type AssistantIntegrationChannel = {
  id: number | null;
  assistant_id: number | null;
  channel: "instagram" | "telegram" | "widget" | "api" | string;
  name: string | null;
  external_account_id: string | null;
  is_connected: boolean;
  is_active: boolean;
  settings: Record<string, unknown>;
  metadata: Record<string, unknown>;
  updated_at: string | null;
};

export type AssistantIntegrationLimits = {
  has_active_subscription: boolean;
  subscription_status: string | null;
  integrations_per_channel_limit: number;
  active_integrations: number;
};

export type AssistantIntegrationsResponse = {
  assistants: IntegrationAssistant[];
  selected_assistant_id: number | null;
  channels: AssistantIntegrationChannel[];
  limits: AssistantIntegrationLimits;
};

export type AssistantIntegrationMutationResponse = {
  message: string;
  channel: AssistantIntegrationChannel;
  limits: AssistantIntegrationLimits;
};

export type InstagramConnectResponse = {
  authorization_url: string;
  state_ttl_seconds: number;
};

export type TelegramConnectResponse = {
  message: string;
  channel: AssistantIntegrationChannel;
  limits: AssistantIntegrationLimits;
  telegram?: {
    bot_id?: string;
    bot_username?: string;
    webhook_url?: string;
  };
};

export type WidgetIntegrationSettings = {
  position: "bottom-right" | "bottom-left";
  theme: "light" | "dark";
  primary_color: string;
  title: string;
  welcome_message: string;
  placeholder: string;
  launcher_label: string;
};

export type WidgetSettingsResponse = {
  message: string;
  channel: AssistantIntegrationChannel;
  widget: {
    widget_key: string | null;
    settings: WidgetIntegrationSettings;
    script_url: string;
    api_base_url: string;
    embed_script_tag: string | null;
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

export async function assistantIntegrationsRequest(
  token: string,
  assistantId?: number,
): Promise<AssistantIntegrationsResponse> {
  const query = typeof assistantId === "number" ? `?assistant_id=${assistantId}` : "";

  return request<AssistantIntegrationsResponse>(`/assistant-channels${query}`, token, {
    method: "GET",
  });
}

export async function assistantIntegrationToggleRequest(
  token: string,
  assistantId: number,
  channel: "instagram" | "telegram" | "widget" | "api",
  enabled: boolean,
): Promise<AssistantIntegrationMutationResponse> {
  return request<AssistantIntegrationMutationResponse>(
    `/assistant-channels/${assistantId}/${channel}`,
    token,
    {
      method: "PATCH",
      body: JSON.stringify({
        enabled,
      }),
    },
  );
}

export async function assistantIntegrationDisconnectRequest(
  token: string,
  assistantId: number,
  channel: "instagram" | "telegram" | "widget" | "api",
): Promise<AssistantIntegrationMutationResponse> {
  return request<AssistantIntegrationMutationResponse>(
    `/assistant-channels/${assistantId}/${channel}`,
    token,
    {
      method: "DELETE",
    },
  );
}

export async function assistantInstagramConnectRequest(
  token: string,
  assistantId: number,
): Promise<InstagramConnectResponse> {
  return request<InstagramConnectResponse>(
    `/assistant-channels/${assistantId}/instagram/connect`,
    token,
    {
      method: "POST",
    },
  );
}

export async function assistantTelegramConnectRequest(
  token: string,
  assistantId: number,
  botToken: string,
): Promise<TelegramConnectResponse> {
  return request<TelegramConnectResponse>(
    `/assistant-channels/${assistantId}/telegram/connect`,
    token,
    {
      method: "POST",
      body: JSON.stringify({
        bot_token: botToken,
      }),
    },
  );
}

export async function assistantWidgetSettingsRequest(
  token: string,
  assistantId: number,
): Promise<WidgetSettingsResponse> {
  return request<WidgetSettingsResponse>(
    `/assistant-channels/${assistantId}/widget/settings`,
    token,
    {
      method: "GET",
    },
  );
}

export async function assistantWidgetSettingsUpdateRequest(
  token: string,
  assistantId: number,
  payload: Partial<WidgetIntegrationSettings>,
): Promise<WidgetSettingsResponse> {
  return request<WidgetSettingsResponse>(
    `/assistant-channels/${assistantId}/widget/settings`,
    token,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
  );
}
