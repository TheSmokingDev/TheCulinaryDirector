import { API_BASE_URL } from "./config";

const TOKEN_KEY = "sticky_tools_tokens";

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

export function getStoredTokens(): Tokens | null {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Tokens;
  } catch {
    return null;
  }
}

export function storeTokens(tokens: Tokens) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
}

export class APIError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

interface APICallOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
}

export async function APICall<T>(
  path: string,
  { method = "GET", body, auth = true }: APICallOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const tokens = getStoredTokens();
    if (tokens) headers.Authorization = `Bearer ${tokens.access_token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const data = await response.json();
      if (typeof data.detail === "string") message = data.detail;
      else message = Object.values(data).flat().join(" ");
    } catch {
      /* keep the generic message */
    }
    throw new APIError(response.status, message);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
