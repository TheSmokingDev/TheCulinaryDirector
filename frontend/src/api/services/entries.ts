import { APICall } from "../apiCall";
import { ENDPOINTS } from "../config";

export interface ToolEntry<T = Record<string, unknown>> {
  id: number;
  name: string;
  data: T;
  created_at: string;
  updated_at: string;
}

export function listEntries<T>(slug: string) {
  return APICall<ToolEntry<T>[]>(ENDPOINTS.entries.list(slug));
}

export function createEntry<T>(slug: string, name: string, data: T) {
  return APICall<ToolEntry<T>>(ENDPOINTS.entries.list(slug), {
    method: "POST",
    body: { name, data },
  });
}

export function updateEntry<T>(id: number, name: string, data: T) {
  return APICall<ToolEntry<T>>(ENDPOINTS.entries.detail(id), {
    method: "PUT",
    body: { name, data },
  });
}

export function deleteEntry(id: number) {
  return APICall<void>(ENDPOINTS.entries.detail(id), { method: "DELETE" });
}
