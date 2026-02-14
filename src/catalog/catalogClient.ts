import { ApiError } from "../auth/authClient";
import { API_BASE_URL } from "../config/apiBaseUrl";

export type CatalogServiceItem = {
  id: number;
  assistant_id: number;
  name: string;
  description: string | null;
  terms_conditions: string | null;
  price: number;
  currency: string;
  specialists: Array<{
    name: string;
    price: number;
  }>;
  photo_urls: string[];
  is_active: boolean;
  sort_order: number;
  metadata: Record<string, unknown> | null;
  created_at: string | null;
  updated_at: string | null;
};

export type CatalogProductItem = {
  id: number;
  assistant_id: number;
  name: string;
  sku: string | null;
  description: string | null;
  terms_conditions: string | null;
  price: number;
  currency: string;
  stock_quantity: number | null;
  is_unlimited_stock: boolean;
  product_url: string | null;
  photo_urls: string[];
  is_active: boolean;
  sort_order: number;
  metadata: Record<string, unknown> | null;
  created_at: string | null;
  updated_at: string | null;
};

export type CatalogServicesResponse = {
  services: CatalogServiceItem[];
};

export type CatalogProductsResponse = {
  products: CatalogProductItem[];
};

export type CatalogServicePayload = {
  assistant_id: number;
  name: string;
  description?: string;
  terms_conditions?: string;
  price?: number;
  currency?: string;
  specialists?: Array<{
    name: string;
    price?: number;
  }>;
  photo_urls?: string[];
  is_active?: boolean;
  sort_order?: number;
};

export type CatalogProductPayload = {
  assistant_id: number;
  name: string;
  sku?: string;
  description?: string;
  terms_conditions?: string;
  price?: number;
  currency?: string;
  product_url?: string;
  stock_quantity?: number;
  is_unlimited_stock?: boolean;
  photo_urls?: string[];
  is_active?: boolean;
  sort_order?: number;
};

type CatalogServiceMutationResponse = {
  message: string;
  service: CatalogServiceItem;
};

type CatalogProductMutationResponse = {
  message: string;
  product: CatalogProductItem;
};

type CatalogDeleteResponse = {
  message: string;
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

export async function catalogServicesListRequest(
  token: string,
  assistantId: number,
): Promise<CatalogServicesResponse> {
  return request<CatalogServicesResponse>(
    `/assistant-services?assistant_id=${assistantId}`,
    token,
    { method: "GET" },
  );
}

export async function catalogProductsListRequest(
  token: string,
  assistantId: number,
): Promise<CatalogProductsResponse> {
  return request<CatalogProductsResponse>(
    `/assistant-products?assistant_id=${assistantId}`,
    token,
    { method: "GET" },
  );
}

export async function catalogServiceCreateRequest(
  token: string,
  payload: CatalogServicePayload,
): Promise<CatalogServiceMutationResponse> {
  return request<CatalogServiceMutationResponse>("/assistant-services", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function catalogServiceUpdateRequest(
  token: string,
  serviceId: number,
  payload: Partial<CatalogServicePayload>,
): Promise<CatalogServiceMutationResponse> {
  return request<CatalogServiceMutationResponse>(
    `/assistant-services/${serviceId}`,
    token,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
  );
}

export async function catalogServiceDeleteRequest(
  token: string,
  serviceId: number,
): Promise<CatalogDeleteResponse> {
  return request<CatalogDeleteResponse>(`/assistant-services/${serviceId}`, token, {
    method: "DELETE",
  });
}

export async function catalogProductCreateRequest(
  token: string,
  payload: CatalogProductPayload,
): Promise<CatalogProductMutationResponse> {
  return request<CatalogProductMutationResponse>("/assistant-products", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function catalogProductUpdateRequest(
  token: string,
  productId: number,
  payload: Partial<CatalogProductPayload>,
): Promise<CatalogProductMutationResponse> {
  return request<CatalogProductMutationResponse>(
    `/assistant-products/${productId}`,
    token,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
  );
}

export async function catalogProductDeleteRequest(
  token: string,
  productId: number,
): Promise<CatalogDeleteResponse> {
  return request<CatalogDeleteResponse>(`/assistant-products/${productId}`, token, {
    method: "DELETE",
  });
}
