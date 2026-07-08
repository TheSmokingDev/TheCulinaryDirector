import { APICall } from "../apiCall";
import { ENDPOINTS } from "../config";

export interface Tool {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  icon: string;
  status: "available" | "coming_soon";
}

export function listTools() {
  return APICall<Tool[]>(ENDPOINTS.tools.list, { auth: false });
}

export function getTool(slug: string) {
  return APICall<Tool>(ENDPOINTS.tools.detail(slug));
}
