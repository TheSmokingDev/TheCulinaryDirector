import { useQuery } from "@tanstack/react-query";
import { getTool, listTools } from "../api/services/tools";

export function useTools() {
  return useQuery({ queryKey: ["tools"], queryFn: listTools });
}

export function useTool(slug: string) {
  return useQuery({ queryKey: ["tools", slug], queryFn: () => getTool(slug) });
}
