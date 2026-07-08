import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEntry,
  deleteEntry,
  listEntries,
  updateEntry,
} from "../api/services/entries";

export function useEntries<T>(slug: string) {
  return useQuery({
    queryKey: ["entries", slug],
    queryFn: () => listEntries<T>(slug),
  });
}

export function useEntryMutations<T>(slug: string) {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["entries", slug] });

  const create = useMutation({
    mutationFn: ({ name, data }: { name: string; data: T }) =>
      createEntry(slug, name, data),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, name, data }: { id: number; name: string; data: T }) =>
      updateEntry(id, name, data),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteEntry(id),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
