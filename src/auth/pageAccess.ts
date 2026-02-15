import type { AuthUser } from "./authClient";

export const PAGE_ACCESS_KEYS = [
  "dashboard",
  "client-requests",
  "client-questions",
  "client-chats",
  "client-base",
  "calendar",
  "assistant-training",
  "integrations",
  "products-services",
  "billing",
  "business-settings",
  "employees",
] as const;

export type PageAccessKey = (typeof PAGE_ACCESS_KEYS)[number];

export const PAGE_ACCESS_ROUTE_MAP: Record<PageAccessKey, string> = {
  dashboard: "/",
  "client-requests": "/client-requests",
  "client-questions": "/client-questions",
  "client-chats": "/client-chats",
  "client-base": "/client-base",
  calendar: "/calendar",
  "assistant-training": "/assistant/training",
  integrations: "/integrations",
  "products-services": "/products-services",
  billing: "/billing",
  "business-settings": "/business-settings",
  employees: "/employees",
};

function isPageAccessKey(value: string): value is PageAccessKey {
  return (PAGE_ACCESS_KEYS as readonly string[]).includes(value);
}

export function normalizePageAccess(value: unknown): PageAccessKey[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const keys: PageAccessKey[] = [];

  for (const item of value) {
    if (typeof item !== "string") {
      continue;
    }

    const normalized = item.trim();
    if (!isPageAccessKey(normalized)) {
      continue;
    }

    if (!keys.includes(normalized)) {
      keys.push(normalized);
    }
  }

  return keys;
}

export function isEmployeeUser(user: AuthUser | null): boolean {
  return user?.role === "employee";
}

export function hasPageAccess(user: AuthUser | null, pageKey: PageAccessKey): boolean {
  if (!user) {
    return false;
  }

  if (!isEmployeeUser(user)) {
    return true;
  }

  const allowed = normalizePageAccess(user.page_access);
  return allowed.includes(pageKey);
}

export function firstAccessiblePath(user: AuthUser | null): string {
  if (!user) {
    return "/login";
  }

  if (!isEmployeeUser(user)) {
    return "/";
  }

  const allowed = normalizePageAccess(user.page_access);
  for (const key of PAGE_ACCESS_KEYS) {
    if (allowed.includes(key)) {
      return PAGE_ACCESS_ROUTE_MAP[key];
    }
  }

  return "/profile";
}
