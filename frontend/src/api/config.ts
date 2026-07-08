export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV
    ? "http://localhost:8000/api"
    : "https://stickytools-api.onrender.com/api");

export const ENDPOINTS = {
  auth: {
    register: "/auth/register/",
    login: "/auth/login/",
    refresh: "/auth/refresh/",
    me: "/auth/me/",
  },
  tools: {
    list: "/tools/",
    detail: (slug: string) => `/tools/${slug}/`,
  },
  entries: {
    list: (slug: string) => `/tools/${slug}/entries/`,
    detail: (id: number) => `/entries/${id}/`,
  },
} as const;
